/* eslint-disable max-len */
/* global getEaster, phoonsvg, romanFULL, sundial */

const _1d = 1000*60*60*24;

function mod(n, m){
	return (n%m+m)%m;
}

// needs to be separate so the type hinting works for time
const calendars = {
	/** https://en.wikipedia.org/wiki/Hebrew_calendar#Calculations */
	hebrew: {
		get avgYear(){
			return this.commonYear + this.leapYearR.length / this.leapPeriod;
		},
		commonYear: 354 * _1d,
		fromGregorian(t = new Date()){
			const delta = t - this.epoch;
			const cycles = Math.floor(delta/this.leapLength);
			let r = mod(delta, this.leapLength), y;
			for (y = 0; y < this.leapPeriod; y++){
				const leap = this.isLeap(y);
				const length = this.commonYear + 30*leap;
				if (r < length)
					break;
				r -= length;
			}
			const year = cycles * this.leapPeriod + y;
			const yearDay = r / _1d;
			// month
			let m;
			for (m = 0; m < 13; m++){
				const length = (29 + (m % 2 === 0)) * _1d;
				if (r < length)
					break;
				r -= length;
			}
			const month = m + 1; // 1-indexed
			const date = Math.floor(r / _1d) + 1; // 1-indexed
			// console.debug(5784, 9, 23);
			return {year, yearDay, month, date};
		},
		isLeap(y = 0){
			return this.leapYearR.includes(mod(y, this.leapPeriod));
		},
		/** YEAR 1 */
		epoch: new Date(-3583, 3, 4, 20), // trial and error
		// days begin at SUNSET UTC+2 in judaism - so roughly 20:00 UTC
		get leapLength(){
			return this.avgYear * this.leapPeriod;
		},
		leapPeriod: 19, // years
		leapYearR: [0, 3, 6, 8, 11, 14, 17],
	},
	// https://en.wikipedia.org/wiki/Hindu_calendar https://www.drikpanchang.com/calendars/hindu/hinducalendar.html
	// USE PURNIMANTA SYSTEM https://en.wikipedia.org/wiki/Hindu_calendar#amanta
	hindu: {
		get avgYear(){
			return this.commonYear + this.leapYearR.length / this.leapPeriod;
		},
		commonYear: 354 * _1d,
		fromGregorian(t = new Date()){
			const delta = t - this.epoch;
			const cycles = Math.floor(delta/this.leapLength);
			let r = mod(delta, this.leapLength), y;
			for (y = 0; y < this.leapPeriod; y++){
				const leap = this.isLeap(y);
				const length = this.commonYear + 30*leap;
				if (r < length)
					break;
				r -= length;
			}
			const year = cycles * this.leapPeriod + y;
			const yearDay = r / _1d;
			// month
			let m;
			for (m = 0; m < 13; m++){
				const length = (29 + (m % 2 === 0)) * _1d;
				if (r < length)
					break;
				r -= length;
			}
			const month = m + 1; // 1-indexed
			const date = Math.floor(r / _1d) + 1; // 1-indexed
			// March 22, 2023 is the start of the current year
			// console.debug(2080, 1, 1);
			return {year, yearDay, month, date};
		},
		isLeap(y = 0){
			return this.leapYearR.includes(mod(y, this.leapPeriod));
		},
		/** YEAR 1 */
		epoch: new Date(0, 3, 14).setFullYear(7), // trial and error
		get leapLength(){
			return this.avgYear * this.leapPeriod;
		},
		leapPeriod: 19, // years
		leapYearR: [0, 3, 5, 8, 11, 14, 16],
	},
	/** https://en.wikipedia.org/wiki/Tabular_Islamic_calendar */
	islam: {
		get avgYear(){
			return this.commonYear + this.leapYearR.length / this.leapPeriod;
		},
		commonYear: 354 * _1d,
		fromGregorian(t = new Date()){
			// see also https://www.fourmilab.ch/documents/calendar/
			const delta = t - this.epoch;
			const cycles = Math.floor(delta/this.leapLength);
			let r = mod(delta, this.leapLength), y;
			for (y = 0; y < this.leapPeriod; y++){
				const leap = this.isLeap(y);
				const length = this.commonYear + _1d*leap;
				if (r < length)
					break;
				r -= length;
			}
			const year = cycles * this.leapPeriod + y;
			const yearDay = r / _1d;
			// month
			let m;
			for (m = 0; m < 12; m++){
				const length = (29 + (m % 2 === 0) + this.isLeap(y)) * _1d;
				if (r < length)
					break;
				r -= length;
			}
			const month = m + 1; // 1-indexed
			const date = Math.floor(r / _1d) + 1; // 1-indexed
			return {year, yearDay, month, date};
		},
		isLeap(y = 0){
			return this.leapYearR.includes(mod(y, this.leapPeriod));
		},
		/** YEAR 1 */
		epoch: new Date(623, 0, 7, 20), // should be new Date(622, 6, 15) but the Ramadan math is off?
		// days begin at SUNSET UTC+3 in islam - so roughly 21:00 UTC
		get leapLength(){
			return this.avgYear * this.leapPeriod;
		},
		leapPeriod: 30, // years
		leapYearR: [2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29],
	},
};

const time = {
	CONFIG: {
		SEASONS_USE_CLIMATE: false,
		SEASONS: {
			// https://www.weather.gov/wrh/climate
			CELTIC: ['1 FEB', '1 MAY', '1 AUG', '1 NOV'],
			CH: ['2 MAR', '10 JUN', '9 SEP', '1 DEC'],
			DRYWET: ['1 JAN', '1 MAY', '1 MAY', '1 NOV', '1 NOV'], // idk how this works, but it does!!!
			METEON: ['1 MAR', '1 JUN', '1 SEP', '1 DEC'],
			METEOS: ['', '', '1 MAR', '1 JUN', '1 SEP', '1 DEC', '1 MAR', '1 JUN'], // I used sorcery and witchcraft to make this work
			// apparently by using blanks to create invalid Date objects, and appending a second quartet of dates, you can start the year in any season
			MID: ['3 FEB', '6 MAY', '8 AUG', '6 NOV'], // Set midpoint to sol/equ, like Pliny the Elder
			PA: ['8 MAR', '9 JUN', '6 SEP', '7 DEC'], // LEHIGHTON
			ROMAN: ['7 FEB', '9 MAY', '11 AUG', '10 NOV'], // Varro
			SD: ['27 FEB', '2 JUL', '1 OCT', '27 NOV'], // MONTGOMERY FIELD
		},
	},
	equinox: [
		(t = new Date()) => t.getMonth() === 2 && t.getDate() === 20, // vernal equinox
		(t = new Date()) => t.getMonth() === 5 && t.getDate() === 20 + (0 < t.getFullYear() % 4), // summer solstice
		(t = new Date()) => t.getMonth() === 8 && t.getDate() === 22 + (1 < t.getFullYear() % 4), // autumnal equinox
		(t = new Date()) => t.getMonth() === 11 && t.getDate() === 21 + (t.getFullYear() % 4 === 3), // winter solstice
	],
	equinoxNames: ['Vernal Equinox', 'Summer Solstice', 'Autumnal Equinox', 'Winter Solstice'],
	holidays: [
		['New Year\'s', (t = new Date()) => t.getMonth() === 0 && t.getDate() === 1],
		['MLK Jr. Day', (t = new Date()) => t.getMonth() === 0 && t.getDay() === 1 && 14 < t.getDate() && t.getDate() < 22],
		['Inauguration Day', (t = new Date()) => t.getMonth() === 0 && t.getDate() === (new Date(t.getYear(), 0, 20).getDay() ? 20 : 21)], // Jan 20 unless that's a sunday, then Jan 21
		['Groundhog Day', (t = new Date()) => t.getMonth() === 1 && t.getDate() === 2],
		['Super Bowl Sunday', (t = new Date()) => t.getMonth() === 1 && t.getDay() === 0 && 7 < t.getDate() && t.getDate() < 15],
		['Valentine\'s Day', (t = new Date()) => t.getMonth() === 1 && t.getDate() === 14],
		['Presidents\' Day', (t = new Date()) => t.getMonth() === 1 && t.getDay() === 1 && 14 < t.getDate() && t.getDate() < 22],
		['TDoV', (t = new Date()) => t.getMonth() === 2 && t.getDate() === 31],
		['April Fool\'s Day', (t = new Date()) => t.getMonth() === 3 && t.getDate() === 1],
		['Cinco de Mayo', (t = new Date()) => t.getMonth() === 4 && t.getDate() === 5],
		['Mother\'s Day', (t = new Date()) => t.getMonth() === 4 && t.getDay() === 0 && 8 < t.getDate() && t.getDate() < 15],
		['Memorial Day', (t = new Date()) => t.getMonth() === 4 && t.getDay() === 1 && 24 < t.getDate()],
		['Father\'s Day', (t = new Date()) => t.getMonth() === 5 && t.getDay() === 0 && 14 < t.getDate() && t.getDate() < 22],
		['Juneteenth', (t = new Date()) => t.getMonth() === 5 && t.getDate() === 19],
		['Independence Day', (t = new Date()) => t.getMonth() === 6 && t.getDate() === 4],
		['Labor Day', (t = new Date()) => t.getMonth() === 8 && t.getDay() === 1 && t.getDate() < 8],
		['Oktoberfest', (t = new Date()) => t.getMonth() === 8 && t.getDay() === 6 && 14 < t.getDate() && t.getDate() < 22],
		['Columbus Day', (t = new Date()) => t.getMonth() === 9 && t.getDay() === 1 && 7 < t.getDate() && t.getDate() < 15],
		['Halloween', (t = new Date()) => t.getMonth() === 9 && t.getDate() === 31],
		['Election Day', (t = new Date()) => t.getMonth() === 10 && t.getDay() === 2 && 1 < t.getDate() && t.getDate() < 9],
		['Veterans\' Day', (t = new Date()) => t.getMonth() === 10 && t.getDate() === 11],
		['TDoR', (t = new Date()) => t.getMonth() === 10 && t.getDate() === 20],
		['Thanksgiving', (t = new Date()) => t.getMonth() === 10 && t.getDay() === 4 && 21 < t.getDate() && t.getDate() < 29],
		['Black Friday', (t = new Date()) => t.getMonth() === 10 && t.getDay() === 5 && 22 < t.getDate() && t.getDate() < 30],
		['Cyber Monday', (t = new Date()) => t.getDay() === 1 && (t.getMonth() === 10 && 25 < t.getDate() || t.getMonth() === 11 && t.getDate() === 1)],
		['Super Saturday', (t = new Date()) => t.getMonth() === 11 && t.getDay() === 6 && 16 < t.getDate() && t.getDate() < 24],
		['Christmas Eve', (t = new Date()) => t.getMonth() === 11 && t.getDate() === 24],
		['Christmas', (t = new Date()) => t.getMonth() === 11 && t.getDate() === 25],
		['Kwanzaa', (t = new Date()) => t.getMonth() === 11 && t.getDate() === 26], // 8 days
		['New Year\'s Eve', (t = new Date()) => t.getMonth() === 11 && t.getDate() === 31],
		// Chinese
		['Chinese New Year', (t = new Date()) => (x => t.getMonth() === x.getMonth() && t.getDate() === x.getDate())(getChineseNewYear(t.getFullYear()))],
		// Christianity (excl. Christmas)
		['Epiphany', (t = new Date()) => t.getMonth() === 0 && t.getDate() === 6],
		['Ash Wednesday', (t = new Date()) => (e => e.getMonth() === t.getMonth() && e.getDate() === t.getDate())(new Date(getEaster(t.getFullYear()) - 45*_1d))],
		['St. Patrick\'s Day', (t = new Date()) => t.getMonth() === 2 && t.getDate() === 17],
		['Good Friday', (t = new Date()) => (e => e.getMonth() === t.getMonth() && e.getDate() === t.getDate())(new Date(getEaster(t.getFullYear()) - 2*_1d))],
		['Easter', (t = new Date()) => (e => e.getMonth() === t.getMonth() && e.getDate() === t.getDate())(getEaster(t.getFullYear()))],
		['Advent Sunday', (t = new Date()) => t.getDay() === 0 && (t.getMonth() === 10 && 26 < t.getDate() || t.getMonth() === 11 && t.getDate() < 4)],
		// Islam
		['Ramadan', (t = new Date()) => (x => x.month === 9 && x.date === 1)(calendars.islam.fromGregorian(t))],
		['Eid al-Fitr', (t = new Date()) => (x => x.month === 10 && x.date === 1)(calendars.islam.fromGregorian(t))],
		['Eid al-Adha', (t = new Date()) => (x => x.month === 12 && x.date === 10)(calendars.islam.fromGregorian(t))],
		// Judaism
		['Passover', (t = new Date()) => (x => x.month === 1 && x.date === 15)(calendars.hebrew.fromGregorian(t))],
		['Rosh Hashanah', (t = new Date()) => (x => x.month === 7 && x.date === 1)(calendars.hebrew.fromGregorian(t))],
		['Yom Kippur', (t = new Date()) => (x => x.month === 7 && x.date === 10)(calendars.hebrew.fromGregorian(t))],
		['Hanukkah', (t = new Date()) => (x => x.month === 9 && x.date === 25)(calendars.hebrew.fromGregorian(t))], // 8 days
		// Hindu
		// ['Chaitra Navaratri', (t = new Date()) => (x => x.month === 1 && x.date === 1)(calendars.hindu.fromGregorian(t))],
		['Diwali', (t = new Date()) => (x => x.month === 8 && x.date === 12)(calendars.hindu.fromGregorian(t))],
		// misc
		['Friday the 13th', (t = new Date()) => t.getDay() === 5 && t.getDate() === 13],
		// bdays
		['Luna\'s Birthday', (t = new Date()) => t.getMonth() === 3 && t.getDate() === 27],
		['Luna\'s HRTiversary', (t = new Date()) => t.getMonth() === 7 && t.getDate() === 16],
		['Kippi\'s Birthday', (t = new Date()) => t.getMonth() === 10 && t.getDate() === 14],
	],
	moon: {
		epoch: new Date(2023, 11, 12, 18, 31),
		p: 29.530594 * _1d,
	},
	months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	seasons: ['Spring', 'Summer', 'Fall', 'Winter'],
	vernal: new Date(2023, 2, 20, 21, 25),
	weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
	yTropical: 365.24219 * _1d,
	zodiac: '♈︎︎♉︎︎♊︎︎♋︎︎♌︎︎♍︎︎♎︎︎♏︎︎♐︎︎♑︎︎♒︎︎♓︎︎'.split('').filter((_, i) => i % 3 === 0),
	zodiacAlt: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
		'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'],
};
time.equinox.forEach((d, i) => time.holidays.push([time.equinoxNames[i], d]));

function moon(t = new Date()){
	return phoonsvg(moon.phase(t));
}
moon.phase = (t = new Date()) => mod((t - time.moon.epoch)/time.moon.p, 1);

/** @param {number} year */
function getChineseNewYear(year){
	let d;
	for (let i = 0; i < 30; i++)
		// if yesterday's % is greater than today's, that means it must now be a new moon
		if (moon.phase(d = new Date(year, 0, 21+i)) < moon.phase(new Date(year, 0, 20+i)))
			return d;
}

function getDatum(t = new Date()){
	const starsign = mod(Math.floor((t - time.vernal) / (time.yTropical/12)), 12);
	const date = t.getDate();
	const season = getSeason(t);
	/** this date is in the nth week of the current month */
	let monthWeek = 0;
	const monthDay = t.getDay();
	for (let d = 1; d < t.getDate(); d++){
		const newDate = new Date(t.getFullYear(), t.getMonth(), d);
		const dotw = newDate.getDay();
		if (dotw === 6)
			monthWeek++;
	}
	return {date, monthWeek, monthDay, season, starsign};
}

function getSeason(t = new Date()){
	if (time.CONFIG.SEASONS_USE_CLIMATE)
		return getSeason.climate(t);
	let seasonDelta = 0;
	// eslint-disable-next-line no-loop-func
	while (!time.equinox.some(eq => eq(new Date(t - seasonDelta * _1d))))
		seasonDelta++;
	return time.equinox.findIndex(eq => eq(new Date(t - seasonDelta * _1d)));
}
getSeason.climate = (t = new Date(), forceClimate = '') => {
	const year = t.getFullYear();
	/** @type {string[]} */
	const seasonStarts = time.CONFIG.SEASONS[forceClimate || time.CONFIG.SEASONS_USE_CLIMATE];
	const allStarts = seasonStarts.map(s => new Date(s + ' ' + (year-1)))
		.concat(seasonStarts.map(s => new Date(s + ' ' + year)))
		.concat(seasonStarts.map(s => new Date(s + ' ' + (year+1))));
	return mod(allStarts.findIndex(start => t < start) - 1, 4);
};

function calendar(t = new Date()){
	// todo add weekday and month labels
	const table = document.createElement('table');
	table.id = 'cals';
	table.innerHTML = '';
	// construct table first...
	const cells = {};
	for (let se = 0; se < 4; se++){ // season (row)
		const season = document.createElement('tr');
		season.id = 'season_' + se;
		table.appendChild(season);
		for (let m_ = 0; m_ < 3; m_++){ // months (cell)
			const mo = 3*se + m_;
			const month = document.createElement('td');
			month.id = 'month_' + mo;
			season.appendChild(month);
			// month header
			const monthHeader = document.createElement('h3');
			monthHeader.innerHTML = time.months[mo];
			month.appendChild(monthHeader);
			// month table
			const monthTable = document.createElement('table');
			month.appendChild(monthTable);
			// weekday headers
			const weekdayTr = document.createElement('tr');
			monthTable.appendChild(weekdayTr);
			time.weekdays.forEach(weekday => {
				const th = document.createElement('th');
				th.innerHTML = weekday;
				weekdayTr.appendChild(th);
			});
			for (let wk = 0; wk < 6; wk++){ // weeks (row)
				const week = document.createElement('tr');
				week.id = month.id + 'week_' + wk;
				monthTable.appendChild(week);
				for (let d = 0; d < 7; d++){ // days (cell)
					const day = document.createElement('td');
					cells[day.id = week.id + 'day_' + d] = day;
					week.appendChild(day);
				}
			}
		}
	}
	const year = t.getFullYear();
	const LEAP = year % 400 === 0 || year % 4 === 0 && year % 100 !== 0;
	const YEAR_LENGTH_IN_DAYS = 365 + LEAP;
	for (let d = 0; d < YEAR_LENGTH_IN_DAYS; d++){
		const dateObj = new Date(year, 0, d + 1);
		const datum = getDatum(dateObj);
		const cellID = `month_${dateObj.getMonth()}week_${datum.monthWeek}day_${datum.monthDay}`; // todo
		const td = cells[cellID]; // todo
		// container
		const tdContainer = document.createElement('div');
		tdContainer.classList.add('tdContainer');
		td.appendChild(tdContainer);
		// date
		const date = document.createElement('div');
		date.classList.add('date');
		const season_id = datum.season;
		date.innerHTML = datum.date;
		tdContainer.appendChild(date);
		// season
		td.classList.add(`season_${season_id}`);
		const season = document.createElement('div');
		season.classList.add('season');
		const seasonName = time.seasons[season_id];
		season.innerHTML = seasonName;
		tdContainer.appendChild(season);
		// zodiac
		const zodiacElem = document.createElement('div');
		zodiacElem.classList.add('zodiac');
		// todo
		zodiacElem.innerHTML = time.zodiacAlt[datum.starsign].slice(0, 3) + '.';
		zodiacElem.title = `Starsign: ${time.zodiac[datum.starsign]} ${time.zodiacAlt[datum.starsign]}`;
		tdContainer.appendChild(zodiacElem);
		// holidays
		const holiday = time.holidays.filter(xyz => xyz[1](dateObj));
		if (holiday.length){
			const holidayElem = document.createElement('div');
			holidayElem.classList.add('holiday');
			holidayElem.innerHTML = holiday.map(x => x[0]).join('<br>');
			tdContainer.appendChild(holidayElem);
		}
		// phoon
		const phoon = document.createElement('div');
		phoon.classList.add('phoon');
		phoon.appendChild(moon(dateObj));
		tdContainer.appendChild(phoon);
	}
	return table;
}

function main(t = new Date()){
	const container = document.getElementById('months');
	container.innerHTML = '';
	container.appendChild(calendar(t));
	document.getElementById('erecal1_title').innerHTML = t.getFullYear();
	refresh();
	refreshSundial();
	setInterval(refresh, 200); // if you set to 1s, it's not exactly 1000ms so sometimes the clock could "miss" a second - the same issue happens with 200ms, but with time so short you can't actually perceive it
	const sundialSize = document.getElementsByClassName('sundial')[0].getBoundingClientRect().width;
	const sundialPixelAngle = Math.atan2(1, sundialSize);
	const sundialInterval = _1d*sundialPixelAngle/Math.PI;
	console.info(`Sundial update interval: ${sundialInterval} ms`);
	setInterval(refreshSundial, sundialInterval); // updates in the time it takes for pixels to shift over 1 unit
	// timestamp
	document.getElementById('timestamp').innerHTML = romanFULL(new Date());
	// done loading
	console.info('erecal.js successfully loaded.');
}

function refresh(t = new Date()){
	document.getElementById('earthclock').innerHTML = t;
}

function refreshSundial(t = new Date()){
	const sundialContainer = document.getElementById('sundial');
	sundialContainer.innerHTML = '';
	const dayFraction = (t / _1d - (6 + new Date().getTimezoneOffset()/60)/24) % 1; // offset so 0 = sunrise
	const sunMoon = [dayFraction, moon.phase(t), true];
	sundialContainer.appendChild(sundial(...sunMoon));
}

main();