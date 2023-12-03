/* eslint-disable max-len */
/* global phoonsvg, sundial */

function mod(n, m){
	return (n%m+m)%m;
}

const ere = {
	eremor: {
		dominicalCycleYears: 150,
		get dominical(){
			return ere.oneia.year * this.dominicalCycleYears;
		},
		holidays: [
			['Lirebolbam', datum => datum.yearDayIndex === 13], // Stum 13
			['Abubisêm', datum => datum.yearDayIndex === 34], // 34 = Reram 11
			['Lusibolbam', datum => datum.yearDayIndex === 60], // Kokum 13
			['Skum', datum => datum.yearDayIndex === EremoranDate.yearLength(datum.year)-1], // Last day in the year
		],
		// https://en.wikipedia.org/wiki/Karachi#Climate
		monsoon: ['Dry', 'Dry', 'Dry', 'Monsoon', 'Dry', 'Dry'],
		seasons: ['Stum', 'Reram', 'Kokum'],
		seasonsAlt: ['Sowing', 'Harvest', 'Flood'],
		// https://en.wikipedia.org/wiki/North_Indian_Ocean_tropical_cyclone#Seasons
		seasonsCyc: ['No', 'Little', 'Much'],
		week: ['Nodrilm', 'Rilrilm', 'Kopkêrilm', 'Kosurilm', 'Bikêrilm', 'Samarrilm'],
		zodiac: ['Unasêm', 'Tupazut', 'Tait', 'Kôbenk', 'Kraêt', 'Bazêr',
			'Kôk', 'Siêt', 'Bebekat', 'Dadalidinmat', 'Kunum', 'Zetidot'],
		zodiacAlt: ['Void', 'Drum', 'Bucket', 'Mice', 'Trowel', 'King',
			'Hawks', 'Candle', 'Road', 'Inkwell', 'Treaty', 'Die'],
	},
	nikki: {
		epoch: 0.078, // fraction of illumination at epoch; must be positive to ensure visibility
	},
	oneia: {
		// 00:00 is at roughly local noon
		atEpoch: 1750,
		day: 105583056.7402678, // ms; solar day; the sideral day is 104148 s
		daysPerYear: 72.52,
		epoch: 1497151176000, // ms; SUN 2017 JUN 11 03:19:36 UTC
		/** ms; 72.52 local days; oneian tropical year = 7656856407.307186 s versus 7656883274.80422 */
		get year(){
			return this.day * this.daysPerYear;
		},
	},
	planets: {
		// relative to the sun
		angle(t = new Date()){
			const positions = this.pos(t);
			const oneiaPos = positions[4];
			const nameiAng = Math.atan2(oneiaPos[1], oneiaPos[0]) + Math.PI;
			return positions.map(xy => Math.atan2(xy[1] - oneiaPos[1], xy[0] - oneiaPos[0]))
				.filter(theta => theta) // filter out oneia
				.map(theta => theta - nameiAng); // get angle of planet relative to namei
		},
		get periods(){
			return this.sma.map(a => Math.pow(a / 340, 1.5) * ere.oneia.year);
		},
		/** planar x,y coords of each planet at time t */
		pos(t = new Date()){
			return this.periods.map((p, i) => (theta => [Math.cos(theta)*this.sma[i], Math.sin(theta)*this.sma[i]])(2*Math.PI*mod(t/p, 1)));
		},
		sma: [50, 84, 137, 196, 340, 626, 2500, 6601, 13730, 21797],
	},
	seasons: ['Winter', 'Spring', 'Summer', 'Fall'],
};

class EremoranDate {
	constructor(dateObj = new Date()){
		this.dateObj = dateObj;
	}
	get datum(){
		// A leap day, located at the end of the year, outside any season, is added when the year is odd or divisible by 50.
		/** ms */
		const offset = this.dateObj - ere.oneia.epoch;
		/** dominical cycles */
		const dominicalCycles = Math.floor(offset / ere.eremor.dominical);
		/** ms */
		const dominicalOffset = mod(offset, ere.eremor.dominical);
		let year = ere.oneia.atEpoch + ere.eremor.dominicalCycleYears * dominicalCycles;
		const dayIndex = Math.floor(dominicalOffset / ere.oneia.day);
		const dayFraction = dominicalOffset % ere.oneia.day / ere.oneia.day;
		let yearDayIndex = dayIndex;
		for (let i = 0; i < ere.eremor.dominicalCycleYears; i++){
			const daysThisYear = EremoranDate.yearLength(year);
			if (yearDayIndex < daysThisYear)
				break;
			yearDayIndex -= daysThisYear;
			year++;
		}
		const seasonLength = Math.floor(ere.oneia.daysPerYear / ere.eremor.seasons.length);
		const season = Math.floor(yearDayIndex / seasonLength);
		const date = yearDayIndex - season * seasonLength + 1;
		const startDay = EremoranDate.yearStartDay(year);
		const dotw = (startDay + yearDayIndex) % ere.eremor.week.length;
		const week = Math.floor((startDay + yearDayIndex) / ere.eremor.week.length);
		// the starsign doesn't care about the calendar
		const starsignLength = ere.oneia.year / ere.eremor.zodiac.length;
		const starsign = Math.floor(dominicalOffset % ere.oneia.year / starsignLength);
		return {
			dominicalCycles, dayIndex, year, yearDayIndex, dayFraction, season, date, dotw, week, starsign,
		};
	}
	get cellID(){
		const datum = this.datum;
		return `y${datum.year}w${datum.week}d${datum.dotw}`;
	}
	/** get the EremoranDate object representing the beginning of this object's current year */
	get yearStart(){
		return this.modify(0, -this.datum.yearDayIndex);
	}
	/**
	 * creates new EremoranDate object with the specified delta-T
	 * @param {number} dy number of oneian years to add/subtract
	 * @param {number} dd number of oneian days to add/subtract
	 */
	modify(dy = 0, dd = 0){
		const yearSign = Math.sign(dy);
		const datum = this.datum;
		let t = +this.dateObj + dd * ere.oneia.day;
		for (let i = 0; i < yearSign * dy; i++)
			t += yearSign * EremoranDate.yearLength(datum.year + yearSign * i) * ere.oneia.day;
		return new EremoranDate(new Date(t));
	}
	static from(y = 0, d = 0){
		y -= ere.oneia.atEpoch;
		const y_quotient = Math.floor(y / ere.eremor.dominicalCycleYears);
		const y_remainder = mod(y, ere.eremor.dominicalCycleYears);
		let t = ere.oneia.epoch + y_quotient * ere.eremor.dominical;
		for (let i = 0; i < y_remainder; i++)
			t += this.yearLength(i) * ere.oneia.day;
		t += d * ere.oneia.day;
		return new EremoranDate(new Date(t));
	}
	/** @param {number} y eremoran year */
	static isLeapYear(y){
		return this.yearStartDay(y) !== this.yearStartDay(y+1);
	}
	/**
	 * @param {number} y eremoran year
	 * @returns {72|73} eremoran days
	 */
	static yearLength(y){
		return 72 + this.isLeapYear(y);
	}
	/**
	 * @param {number} y eremoran year
	 * @returns {0|1|2|3|4|5} eremoran day of the week
	 */
	static yearStartDay(y){
		// 49 may be replaced by any integer st. i % 50 = 49
		return mod(Math.floor(y/2) + Math.floor((y+49)/50), 6);
	}
}

/** brute force yearStartDay calculator
function brute(max = 10){
	const t0 = +new Date();
	const f = (c0, c1, c2, x) => mod(Math.floor((c0*x + c1)/c2), 6);
	for (let c0 = -max; c0 < max; c0++)
		for (let c1 = -max; c1 < max; c1++)
			for (let c2 = 1; c2 < max; c2++){
				let works = true;
				for (let y = 0; y < 50; y++){
					if (EremoranDate.yearStartDay(y) !== f(c0, c1, c2, y)){
						works = false;
						break;
					}
					if (t0 + 10000 < new Date())
						return `TIMED OUT @ {${c0}, ${c1}, ${c2}}`;
				}
				if (works)
					console.log({c0, c1, c2});
			}
} */

function moon(t = new Date()){
	return phoonsvg(moon.phase(t));
}
moon.phase = (t = new Date()) => mod(-(t - ere.oneia.epoch)/ere.oneia.day + ere.nikki.epoch, 1);

function clock(t = new Date()){
	const datum = new EremoranDate(t).datum;
	const elem = document.createElement('span');
	elem.innerHTML = `${datum.year} AT,
	${ere.eremor.seasons[datum.season]} (${ere.eremor.seasonsAlt[datum.season]}),
	Day ${datum.date},
	@${(datum.dayFraction * 1000).toFixed(2).padStart(6, '0')}`;
	return elem;
}

function calendar(t = new Date(), hideCurrent = false){
	const ed = new EremoranDate(t);
	const datum = ed.datum;
	const table = document.createElement('table');
	table.classList.add('calendar');
	// day cells
	const tr0 = document.createElement('tr');
	table.appendChild(tr0);
	ere.eremor.week.forEach(day => {
		const th = document.createElement('th');
		tr0.appendChild(th);
		th.innerHTML = day;
	});
	// construct table first...
	const cells = {};
	for (let i = 0; i < Math.ceil(ere.oneia.year / ere.oneia.day / ere.eremor.week.length); i++){ // weeks
		const tr = document.createElement('tr');
		table.appendChild(tr);
		for (let j = 0; j < ere.eremor.week.length; j++){ // days
			const td = document.createElement('td');
			cells[td.id = `y${datum.year}w${i}d${j}`] = td;
			tr.appendChild(td);
		}
	}
	const yearStart = ed.yearStart;
	const YEAR_LENGTH_IN_DAYS = EremoranDate.yearLength(datum.year);
	for (let d = 0; d < YEAR_LENGTH_IN_DAYS; d++){
		const ed_ = yearStart.modify(0, d);
		const datum_ = ed_.datum;
		const td = cells[ed_.cellID];
		// container
		const tdContainer = document.createElement('div');
		tdContainer.classList.add('tdContainer');
		td.appendChild(tdContainer);
		// date
		const date = document.createElement('div');
		date.classList.add('date');
		const IS_LEAP_DAY = d === 72;
		const season_id = datum_.season;
		if (!IS_LEAP_DAY)
			date.innerHTML = datum_.date;
		tdContainer.appendChild(date);
		// season
		td.classList.add(IS_LEAP_DAY ? 'intercalary' : `season_${season_id}`);
		const season = document.createElement('div');
		season.classList.add('season');
		const seasonName = ere.eremor.seasons[season_id];
		season.innerHTML = IS_LEAP_DAY ? 'Bodôbêkum' : seasonName;
		const monsoon = Math.floor(ere.eremor.monsoon.length * d / YEAR_LENGTH_IN_DAYS);
		season.title = `${seasonName} (${ere.eremor.seasonsAlt[season_id]}; ${ere.eremor.monsoon[monsoon]} - ${ere.eremor.seasonsCyc[season_id]} Cyclonic Activity)`;
		if (IS_LEAP_DAY)
			season.title = 'Intercalary Day';
		tdContainer.appendChild(season);
		// IRL MONTH
		season.appendChild(document.createElement('br'));
		season.appendChild(document.createTextNode(ed_.dateObj.toLocaleString('default', { month: 'short', day: 'numeric' })));
		// zodiac
		const zodiacElem = document.createElement('div');
		zodiacElem.classList.add('zodiac');
		zodiacElem.innerHTML = ere.eremor.zodiac[datum_.starsign].slice(0, 3) + '.';
		const _4seasonID = Math.floor(ere.seasons.length * d / YEAR_LENGTH_IN_DAYS)
			% ere.seasons.length;
		zodiacElem.title = `Starsign: ${ere.eremor.zodiac[datum_.starsign]} (the ${ere.eremor.zodiacAlt[datum_.starsign]})
Season: ${ere.seasons[_4seasonID]}`;
		tdContainer.appendChild(zodiacElem);
		// highlight
		if (!hideCurrent && datum.yearDayIndex === d)
			tdContainer.classList.add('selectedDate');
		// holidays
		const holiday = ere.eremor.holidays.find(xyz => xyz[1](datum_));
		if (holiday){
			const holidayElem = document.createElement('div');
			holidayElem.classList.add('holiday');
			holidayElem.innerHTML = holiday[0];
			tdContainer.appendChild(holidayElem);
		}
	}
	return table;
}

function main(t = new Date()){
	const [last, curr, next] = [-1, 0, 1].map(x => new Date(+t + x * ere.oneia.year));
	const year = new EremoranDate(t).datum.year;
	document.getElementById('erecal0').appendChild(calendar(last, true));
	document.getElementById('erecal1').appendChild(calendar(curr));
	document.getElementById('erecal2').appendChild(calendar(next, true));
	document.getElementById('erecal0_title').innerHTML = year-1;
	document.getElementById('erecal1_title').innerHTML = year;
	document.getElementById('erecal2_title').innerHTML = year+1;
	refresh();
	refreshSundial();
	setInterval(refresh, 200); // if you set to 1s, it's not exactly 1000ms so sometimes the clock could "miss" a second - the same issue happens with 200ms, but with time so short you can't actually perceive it
	const sundialSize = document.getElementsByClassName('sundial')[0].getBoundingClientRect().width;
	const sundialPixelAngle = Math.atan2(1, sundialSize);
	const sundialInterval = ere.oneia.day*sundialPixelAngle/Math.PI;
	console.info(`Sundial update interval: ${sundialInterval} ms`);
	setInterval(refreshSundial, sundialInterval); // updates in the time it takes for pixels to shift over 1 unit
	console.info('erecal.js successfully loaded.');
}

function refresh(t = new Date()){
	// eremoran clock
	const clockElem = document.getElementById('ereclock');
	clockElem.innerHTML = '';
	clockElem.appendChild(clock());
	// earth clock
	document.getElementById('earthclock').innerHTML = '' + t;
}

function refreshSundial(t = new Date()){
	const sundialContainer = document.getElementById('sundial');
	sundialContainer.innerHTML = '';
	const sunMoon = [new EremoranDate(t).datum.dayFraction, moon.phase(t), true, ere.planets.angle(t)];
	sundialContainer.appendChild(sundial(...sunMoon));
}

main();