/* eslint-disable max-len */
/* global getEaster, goldClock, phoonsvg, romanFULL, sundial */

const _1m = 60*1000;
const _1h = 60*_1m;
const _1d = 24*_1h;

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
		DEBUG: document.URL[0].toLowerCase() === 'f', // file:// vs. http(s)://
		FAST_CLOCK: false,
		LAME_CLOCK: true,
		LANG: 'EN',
		OFFSET: false,
		SEASON: false,
		SEASONS: {
			CAL: ['16 APR', '1 JUN', '1 JUL', '16 OCT'], // appx
			// https://www.weather.gov/wrh/climate
			CELTIC: ['1 FEB', '1 MAY', '1 AUG', '1 NOV'],
			CH: ['2 MAR', '10 JUN', '9 SEP', '1 DEC'],
			DRYWET: ['1 MAY', '1 NOV'],
			ECO: ['15 FEB', '1 APR', '1 JUN', '24 AUG', '24 SEP', '15 NOV'],
			// Peret := 9 Jan, each month 122 days
			EGYPT: ['9 JAN', '10 MAY', '9 SEP'],
			HINDU: ['19 JAN', '20 MAR', '20 MAY', '20 JUL', '19 SEP', '19 NOV'],
			METEON: ['1 MAR', '1 JUN', '1 SEP', '1 DEC'],
			METEOS: ['1 MAR', '1 JUN', '1 SEP', '1 DEC'],
			// apparently by using blanks to create invalid Date objects, and appending a second quartet of dates, you can start the year in any season
			MID: ['3 FEB', '6 MAY', '8 AUG', '6 NOV'], // Set midpoint to sol/equ, like Pliny the Elder
			PA: ['8 MAR', '9 JUN', '6 SEP', '7 DEC'], // LEHIGHTON
			ROMAN: ['7 FEB', '9 MAY', '11 AUG', '10 NOV'], // Varro
			THAI: ['15 FEB', '16 MAY', '16 OCT'],
		},
		SEASON_COLORS: {
			CAL: ['season_5', 'season_1', 'season_2', 'season_3'],
			DRYWET: ['season_3', 'season_1'],
			ECO: ['season_5', 'season_0', 'season_1', 'season_2', 'season_4', 'season_3'],
			EGYPT: ['season_0', 'season_1', 'season_3'],
			//		 green       yellow      red         blue; 4=purple, 5=teal
			false: ['season_0', 'season_1', 'season_2', 'season_3'],
			HINDU: ['season_4', 'season_0', 'season_1', 'season_5', 'season_2', 'season_3'],
			METEOS: ['season_2', 'season_3', 'season_0', 'season_1'],
			THAI: ['season_2', 'season_0', 'season_3'],
		},
		SEASON_NAMES: {
			CAL: ['May Gray', 'June Gloom', 'Warm', 'Wet'],
			DRYWET: ['Wet', 'Dry'],
			ECO: ['Pervernal', 'Vernal', 'Estival', 'Serotinal', 'Autumnal', 'Hibernal'],
			EGYPT: ['Peret', 'Shemu', 'Akhet'],
			false: ['Spring', 'Summer', 'Fall', 'Winter'],
			HINDU: ['Shishira', 'Vasanta', 'Grīshma', 'Varshā', 'Sharat', 'Hemanta'],
			METEOS: ['Fall', 'Winter', 'Spring', 'Summer'],
			THAI: ['Hot', 'Rainy', 'Cold'],
		},
		UPDATE_INTERVAL: {
			CLOCK: 500,
			SUNDIAL: 0,
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
		p: 29.530588904835206 * _1d,
	},
	months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
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
	if (time.CONFIG.SEASON)
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
	const seasonStarts = time.CONFIG.SEASONS[forceClimate || time.CONFIG.SEASON];
	const allStarts = seasonStarts.map(s => new Date(s + ' ' + (year-1)))
		.concat(seasonStarts.map(s => new Date(s + ' ' + year)))
		.concat(seasonStarts.map(s => new Date(s + ' ' + (year+1))));
	return mod(allStarts.findIndex(start => t < start) - 1, getSeason.sa().length);
};
/** @type {(n?: number) => string} */
getSeason.c = (n = 0) => (time.CONFIG.SEASON_COLORS[time.CONFIG.SEASON] || time.CONFIG.SEASON_COLORS.false)[n];
/** @type {(n?: number) => string} */
getSeason.s = (n = 0) => getSeason.sa()[n];
/** @type {() => string[]} */
getSeason.sa = () => time.CONFIG.SEASON_NAMES[time.CONFIG.SEASON] || time.CONFIG.SEASON_NAMES.false;

function getKippi(t = new Date()){
	const monthIndex = mod(Math.floor(t/_1d) + 18, 28);
	const biweekIndex = monthIndex % 14; // 0 3 4 8 9 12 13
	const week = Math.floor(monthIndex/7);
	const weekDay = monthIndex % 7;
	const isSpecial = (Math.floor((weekDay + 3)/2) + week) % 2;
	const letter = isSpecial ? 'E' : '';
	return {monthIndex, biweekIndex, week, weekDay, isSpecial, letter};
}

function getLuna(t = new Date()){
	const biweekIndex = mod(Math.floor(t/_1d) + 3, 14);
	let letter = '', title = '';
	if (biweekIndex === 9){
		letter = 'L';
		title = 'Luna Payday';
	}
	return {biweekIndex, letter, title};
}

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
		td.classList.add(getSeason.c(season_id));
		const season = document.createElement('div');
		season.classList.add('season');
		const seasonName = getSeason.s(season_id);
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
		// KIPPI
		const kippi = document.createElement('div');
		kippi.classList.add('kippi');
		const KIPPI = getKippi(dateObj);
		kippi.innerHTML = KIPPI.letter;
		kippi.title = `Kippi Cycle: Day ${KIPPI.monthIndex}`;
		tdContainer.appendChild(kippi);
		// LUNA PAYDAY
		const luna = document.createElement('span');
		luna.classList.add('luna');
		const LUNA = getLuna(dateObj);
		luna.innerHTML = LUNA.letter;
		luna.title = LUNA.title;
		kippi.appendChild(luna);
	}
	return table;
}

function main(t = new Date()){
	const container = document.getElementById('months');
	container.innerHTML = '';
	container.appendChild(calendar(t));
	document.getElementById('erecal1_title').innerHTML = t.getFullYear();
	refresh();
	refreshClock();
	refreshSundial();
	setInterval(refresh, 200); // if you set to 1s, it's not exactly 1000ms so sometimes the clock could "miss" a second - the same issue happens with 200ms, but with time so short you can't actually perceive it
	const sundialSize = document.getElementsByClassName('sundial')[0].getBoundingClientRect().width;
	const sundialPixelAngle = Math.atan2(1, sundialSize);
	const sundialInterval = time.CONFIG.UPDATE_INTERVAL.SUNDIAL || _1d*sundialPixelAngle/Math.PI;
	console.info(`Sundial update interval: ${sundialInterval/1000} s`);
	setInterval(refreshSundial, sundialInterval); // updates in the time it takes for pixels to shift over 1 unit
	const clockInterval = time.CONFIG.UPDATE_INTERVAL.CLOCK || _1m*sundialPixelAngle/Math.PI;
	console.info(`Clock update interval: ${clockInterval} ms`);
	setInterval(refreshClock, clockInterval);
	// timestamp
	document.getElementById('timestamp').innerHTML = romanFULL(new Date());
	// done loading
	setInterval(refreshDebug, 3000);
	console.info('cal.js successfully loaded.');
}

function refresh(t = new Date()){
	document.getElementById('earthclock').innerHTML = t;
}

function refreshSundial(t = new Date()){
	const container = document.getElementById('sundial');
	container.innerHTML = '';
	const dayFraction = (t / _1d - (6 + new Date().getTimezoneOffset()/60)/24) % 1; // offset so 0 = sunrise
	const sunMoon = [dayFraction, moon.phase(t), 2];
	container.appendChild(sundial(...sunMoon));
}

function refreshClock(t = new Date()){
	t = new Date(+t + time.CONFIG.OFFSET);
	if (time.CONFIG.FAST_CLOCK)
		t = new Date((t - new Date(t.getFullYear(), 0, 1))*time.CONFIG.FAST_CLOCK);
	const container = document.getElementById('clock');
	container.innerHTML = '';
	// round to nearest interval...
	if (time.CONFIG.LAME_CLOCK)
		t = new Date(Math.floor(t/time.CONFIG.UPDATE_INTERVAL.CLOCK/2)*time.CONFIG.UPDATE_INTERVAL.CLOCK*2);
	container.appendChild(goldClock(t, time.CONFIG.LANG));
}

function refreshDebug(){
	// const PCA_AVG = printCharArc.data.reduce((a, b) => a+b, 0) / printCharArc.data.length;
	// console.debug(`PCA_AVG = ${PCA_AVG} ms`);
}

main();