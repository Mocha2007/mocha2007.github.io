/* eslint-disable max-len */
/* global getEaster, goldClock, mochaLunisolar, phoonsvg, romanFULL, solarDay, sundial, nightSky */

const _1m = 60*1000;
const _1h = 60*_1m;
const _1d = 24*_1h;

function isLoaded(...varNames){
	return varNames.map(s => {
		try {
			// eslint-disable-next-line no-eval
			return eval(s);
		}
		catch (_){
			return undefined;
		}
	});
}

function mod(n, m){
	return (n%m+m)%m;
}

/**
 * Converts string to title case. identical to str.title in python.
 * @param {string} s
 */
function title(s){
	return s[0].toUpperCase() + s.slice(1);
}

// needs to be separate so the type hinting works for time
const calendars = {
	/** https://en.wikipedia.org/wiki/Hebrew_calendar#Calculations */
	hebrew: {
		get avgYear(){
			return this.commonYear + 30 * _1d * this.leapYearR.length / this.leapPeriod;
		},
		commonYear: 354 * _1d,
		fromGregorian(t = new Date()){
			const delta = t - this.epoch;
			const cycles = Math.floor(delta/this.leapLength);
			let r = mod(delta, this.leapLength), y;
			for (y = 0; y < this.leapPeriod; y++){
				const leap = this.isLeap(y);
				const length = this.commonYear + 30*_1d*leap;
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
		epoch: new Date(-3758, 2, 22, 20), // trial and error
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
			return this.commonYear + 30 * _1d * this.leapYearR.length / this.leapPeriod;
		},
		commonYear: 354 * _1d,
		fromGregorian(t = new Date()){
			const delta = t - this.epoch;
			const cycles = Math.floor(delta/this.leapLength);
			let r = mod(delta, this.leapLength), y;
			for (y = 0; y < this.leapPeriod; y++){
				const leap = this.isLeap(y);
				const length = this.commonYear + 30*_1d*leap;
				if (r < length)
					break;
				r -= length;
			}
			const year = cycles * this.leapPeriod + y;
			const yearDay = r / _1d;
			// month
			let m;
			for (m = 0; m < 13; m++){
				const length = (29 + (m % 2 === 0 || m === 13 && this.isLeap(y))) * _1d;
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
		epoch: new Date(0, 2, 28).setFullYear(7), // trial and error
		get leapLength(){
			return this.avgYear * this.leapPeriod;
		},
		leapPeriod: 19, // years
		leapYearR: [0, 3, 5, 8, 11, 14, 16],
	},
	/** https://en.wikipedia.org/wiki/Tabular_Islamic_calendar */
	islam: {
		get avgYear(){
			return this.commonYear + _1d * this.leapYearR.length / this.leapPeriod;
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
			for (m = 0; m < 13; m++){
				const length = (29 + (m % 2 === 0 || m === 13 && this.isLeap(y))) * _1d;
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
		epoch: new Date(621, 6, 29, 20), // should be new Date(622, 6, 15) but the Ramadan math is off?
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
		CALTYPE: undefined,
		DEBUG: document.URL[0].toLowerCase() === 'f', // file:// vs. http(s)://
		FAST_CLOCK: false,
		GEO: {
			ALT: 160, // meters
			HEADING: 0, // degrees
			LAT: 36,
			LON: -79,
		},
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
		['Spring Forward', (t = new Date()) => t.getMonth() === 2 && t.getDay() === 0 && 8 < t.getDate() && t.getDate() < 15],
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
		['Fall Back', (t = new Date()) => t.getMonth() === 10 && t.getDay() === 0 && t.getDate() < 8],
		['Election Day', (t = new Date()) => t.getMonth() === 10 && t.getDay() === 2 && 1 < t.getDate() && t.getDate() < 9],
		['Veterans\' Day', (t = new Date()) => t.getMonth() === 10 && t.getDate() === 11],
		['TDoR', (t = new Date()) => t.getMonth() === 10 && t.getDate() === 20],
		['Thanksgiving', (t = new Date()) => t.getMonth() === 10 && t.getDay() === 4 && 21 < t.getDate() && t.getDate() < 29], // [22, 28]
		['Black Friday', (t = new Date()) => t.getMonth() === 10 && t.getDay() === 5 && 22 < t.getDate() && t.getDate() < 30], // [23, 29]
		['Cyber Monday', (t = new Date()) => t.getDay() === 1 && (t.getMonth() === 10 && 25 < t.getDate() || t.getMonth() === 11 && t.getDate() < 3)], // [26, 2]
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
		epoch: new Date(Date.UTC(2024, 3, 8, 18, 18, 29)), // https://en.wikipedia.org/wiki/Solar_eclipse_of_April_8,_2024
		p: 29.530588904835206 * _1d,
	},
	months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	vernal: new Date(2023, 2, 20, 21, 25),
	weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
	yTropical: 365.24219 * _1d,
	zodiac: '♈︎︎♉︎︎♊︎︎♋︎︎♌︎︎♍︎︎♎︎︎♏︎︎♐︎︎♑︎︎♒︎︎♓︎︎'.split('').filter((_, i) => i % 3 === 0),
	zodiacAlt: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
		'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'],
	zodiacSrc: [
		'https://upload.wikimedia.org/wikipedia/commons/0/0f/Sidney_Hall_-_Urania%27s_Mirror_-_Aries_and_Musca_Borealis.jpg',
		'https://upload.wikimedia.org/wikipedia/commons/d/de/Sidney_Hall_-_Urania%27s_Mirror_-_Taurus.jpg',
		'https://upload.wikimedia.org/wikipedia/commons/4/44/Sidney_Hall_-_Urania%27s_Mirror_-_Gemini.jpg',
		'https://upload.wikimedia.org/wikipedia/commons/c/ce/Sidney_Hall_-_Urania%27s_Mirror_-_Cancer.jpg',
		'https://upload.wikimedia.org/wikipedia/commons/6/62/Sidney_Hall_-_Urania%27s_Mirror_-_Leo_Major_and_Leo_Minor.jpg',
		'https://upload.wikimedia.org/wikipedia/commons/3/38/Sidney_Hall_-_Urania%27s_Mirror_-_Virgo.jpg',
		'https://upload.wikimedia.org/wikipedia/commons/0/00/Sidney_Hall_-_Urania%27s_Mirror_-_Libra.jpg',
		'https://upload.wikimedia.org/wikipedia/commons/c/cf/Sidney_Hall_-_Urania%27s_Mirror_-_Scorpio.jpg',
		'https://upload.wikimedia.org/wikipedia/commons/7/7e/Sidney_Hall_-_Urania%27s_Mirror_-_Sagittarius_and_Corona_Australis%2C_Microscopium%2C_and_Telescopium.png',
		'https://upload.wikimedia.org/wikipedia/commons/f/fc/Sidney_Hall_-_Urania%27s_Mirror_-_Capricornus.jpg',
		'https://upload.wikimedia.org/wikipedia/commons/5/5c/Sidney_Hall_-_Urania%27s_Mirror_-_Aquarius%2C_Piscis_Australis_%26_Ballon_Aerostatique.jpg',
		'https://upload.wikimedia.org/wikipedia/commons/d/d9/Sidney_Hall_-_Urania%27s_Mirror_-_Pisces.jpg',
	],
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
	return {date, monthWeek, monthDay, season, starsign, month: t.getMonth()};
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
	let alt = '', letter = '';
	if (biweekIndex === 9){
		letter = 'L';
		alt = 'Luna Payday';
	}
	return {biweekIndex, letter, title: alt};
}

function dayCell(td, dateObj, datum){
	// container
	const tdContainer = document.createElement('div');
	tdContainer.classList.add('tdContainer');
	tdContainer.title = dateObj.toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'});
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

function calendar(t = new Date()){
	const USING_MLSC = time.CONFIG.CALTYPE === 'MLSC';
	const MLSC = mochaLunisolar(t);
	const table = document.createElement('table');
	table.id = 'cals';
	table.innerHTML = '';
	// construct table first...
	const cells = {};
	for (let se = 0; se < 4 + USING_MLSC; se++){ // season (row)
		const season = document.createElement('tr');
		season.id = 'season_' + se;
		table.appendChild(season);
		for (let m_ = 0; m_ < 3; m_++){ // months (cell)
			const mo = 3*se + m_;
			if (MLSC.yearLengthMonths <= mo)
				break;
			const month = document.createElement('td');
			month.id = 'month_' + mo;
			season.appendChild(month);
			// month header
			const monthHeader = document.createElement('h3');
			monthHeader.innerHTML = (USING_MLSC ? MLSC.eraMonths : time.months)[mo];
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
	const year = USING_MLSC ? MLSC.year
		: t.getFullYear();
	const LEAP = USING_MLSC ? MLSC.leap
		: year % 400 === 0 || year % 4 === 0 && year % 100 !== 0;
	const YEAR_LENGTH_IN_DAYS = USING_MLSC ? MLSC.yearLengthDays
		: 365 + LEAP;
	for (let d = 0; d < YEAR_LENGTH_IN_DAYS; d++){
		const dateObj = USING_MLSC ? new Date(+MLSC.yearStartT + d*_1d)
			: new Date(year, 0, d + 1);
		const datum = USING_MLSC ? mochaLunisolar(dateObj)
			: getDatum(dateObj);
		const cellID = `month_${datum.month}week_${datum.monthWeek}day_${datum.monthDay}`;
		const td = cells[cellID];
		datum.season = getDatum(dateObj).season;
		datum.starsign = getDatum(dateObj).starsign;
		dayCell(td, dateObj, datum);
	}
	return table;
}

function main(t = new Date()){
	const container = document.getElementById('months');
	container.innerHTML = '';
	container.appendChild(calendar(t));
	let year;
	query();
	refresh();
	setInterval(refresh, 200); // if you set to 1s, it's not exactly 1000ms so sometimes the clock could "miss" a second - the same issue happens with 200ms, but with time so short you can't actually perceive it
	if (time.CONFIG.CALTYPE === 'GREGORIAN'){
		year = document.getElementById('erecal1_title').innerHTML = t.getFullYear();
		refreshClock();
		refreshSundial();
		const sundialSize = document.getElementsByClassName('sundial')[0].getBoundingClientRect().width;
		const sundialPixelAngle = Math.atan2(1, sundialSize);
		const sundialInterval = time.CONFIG.UPDATE_INTERVAL.SUNDIAL || _1d*sundialPixelAngle/Math.PI;
		console.info(`Sundial update interval: ${sundialInterval/1000} s`);
		setInterval(refreshSundial, sundialInterval); // updates in the time it takes for pixels to shift over 1 unit
		const clockInterval = time.CONFIG.UPDATE_INTERVAL.CLOCK || _1m*sundialPixelAngle/Math.PI;
		console.info(`Clock update interval: ${clockInterval} ms`);
		setInterval(refreshClock, clockInterval);
	}
	else if (time.CONFIG.CALTYPE === 'MLSC'){
		const MLSC = mochaLunisolar(t);
		year = document.getElementById('erecal1_title').innerHTML = `MLSC Year ${MLSC.year}`;
		/** @type {HTMLTableRowElement} */
		const monthTable = document.getElementById('earthclock2');
		monthTable.innerHTML = '';
		'previousMonth t nextMonth'.split(' ').forEach(key => {
			const datum = mochaLunisolar(MLSC[key]);
			const td = document.createElement('td');
			td.innerHTML = `${datum.monthName}, Year ${datum.year}:`;
			'kalends nones ides icas'.split(' ').forEach(key2 => {
				const rowTitle = title(key2).padStart(7, '_').replace(/_/g, '&nbsp;');
				td.innerHTML += `<br>${rowTitle}: ${datum[key2].toLocaleDateString('en-GB', {year: 'numeric', month: 'short', day: '2-digit'})}`;
			});
			monthTable.appendChild(td);
		});
		const modMonth = MLSC.month === 12 ? 12 : (MLSC.month + MLSC.era) % 12;
		document.getElementById('monthImg').src = modMonth < 12 ? modMonth === 7
			? 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Sidney_Hall_-_Urania%27s_Mirror_-_Taurus_Poniatowski%2C_Serpentarius%2C_Scutum_Sobiesky%2C_and_Serpens.jpg'
			: time.zodiacSrc[modMonth]
			: 'https://the-public-domain-review.imgix.net/collections/aurora-borealis-in-art/SAAM-1911.4.1_2-000001.jpg';
		monthAlt(t);
		mlscBonus(t);
	}
	// timestamp
	document.getElementById('timestamp').innerHTML = romanFULL(new Date());
	// done loading
	console.info('cal.js successfully loaded.');
	console.info(`CONFIG: ${time.CONFIG.CALTYPE} - ${year}`);
}

function query(){
	navigator.geolocation.getCurrentPosition(gc => {
		time.CONFIG.GEO.ALT = gc.coords.altitude;
		time.CONFIG.GEO.HEADING = gc.coords.heading;
		time.CONFIG.GEO.LAT = gc.coords.latitude;
		time.CONFIG.GEO.LON = gc.coords.longitude;
		if (time.CONFIG.CALTYPE === 'GREGORIAN')
			refreshSundial();
	},
	e => {
		console.debug(`Couldn't get geolocation due to ${e}`);
	});
}

/** display the month with the MLSC days of the week */
function monthAlt(t = new Date()){
	const MLSC = mochaLunisolar(t);
	const table = document.getElementById('monthAlt');
	// title
	document.getElementById('monthTitle').innerHTML = MLSC.monthName;
	// headers
	const trh = document.createElement('tr');
	table.appendChild(trh);
	const corner = document.createElement('th');
	corner.colSpan = 2;
	trh.appendChild(corner); // blank cell in corner
	mochaLunisolar.dayNames.forEach((day, i) => {
		if (i === 7 && MLSC.monthLength < 31)
			return;
		const th = document.createElement('th');
		th.innerHTML = day + '’s Day';
		trh.appendChild(th);
	});
	// dates
	let date = 0;
	for (let week = 0; week < 4; week++){
		const tr = document.createElement('tr');
		table.appendChild(tr);
		// header
		const th = document.createElement('th');
		th.innerHTML = mochaLunisolar.quarterNames[week];
		tr.appendChild(th);
		// dates
		const weekLength = week % 2 ? week === 3 ? MLSC.monthLength-22 : 8 : 7;
		for (let day = 0; day < weekLength; day++){
			const dateObj = new Date(+MLSC.monthStartT + date*_1d);
			const td = document.createElement('td');
			tr.appendChild(td);
			// fill cell
			td.innerHTML = `<span class="bigger">${date+1}</span><hr>
			${dateObj.toLocaleDateString('en-US', {month: 'short', day: 'numeric', weekday: 'short'}).replace(', ', '<br>')}`;
			td.classList.add('season_' + [2, 6, 1, 0, 5, 3, 4, 7][dateObj.getDay()]); // ROYGCBP and rose
			// finish
			date++;
		}
	}
}

function mlscBonus(t = new Date()){
	const bonus = document.getElementById('bonus');
	const MLSC = mochaLunisolar(t);
	bonus.innerHTML = `<h2>Additional Information</h2>
	Lunar Mansion: <a href="https://en.wikipedia.org/wiki/${MLSC.mansion}">${MLSC.mansion}</a>`;
}

function refresh(t = new Date()){
	document.getElementById('earthclock').innerHTML = time.CONFIG.CALTYPE === 'MLSC'
		? mochaLunisolar(t).string + '<br>' + solarDay(t)
		: t;
}

function refreshSundial(t = new Date()){
	const container = document.getElementById('sundial');
	container.innerHTML = '';
	const dayFraction = (t / _1d - (6 + new Date().getTimezoneOffset()/60)/24) % 1; // offset so 0 = sunrise
	const sunMoon = [dayFraction, moon.phase(t), 2];
	container.appendChild(sundial(...sunMoon));
	const sky = document.getElementById('sky');
	sky.innerHTML = '';
	sky.appendChild(nightSky(t, true, time.CONFIG.GEO.LAT, time.CONFIG.GEO.LON));
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

function mainWrapper(){
	// global CALENDAR_TYPE (cal.html), getEaster (oneiatime.js), goldClock (sundial.js), phoonsvg (phoon.js)
	const [caltype, a, b, c] = isLoaded('CALENDAR_TYPE', 'getEaster', 'goldClock', 'phoonsvg');
	time.CONFIG.CALTYPE = caltype;
	switch (caltype){
		case 'GREGORIAN':
			if (a && b && c)
				return main();
			break;
		case 'MLSC':
			if (a && c)
				return main();
			break;
	}
	setTimeout(mainWrapper, 50);
}

mainWrapper();