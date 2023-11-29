/* global phoonsvg */

const _1s = 1000;
const _1m = 60*_1s;
const _1h = 60*_1m;
const _1d = 24*_1h;
const ere = {
	eisen: {
		synodic: 93.37 * _1d,
	},
	eremor: {
		get daysPerStarsign(){
			return ere.oneia.daysPerYear / this.zodiac.length;
		},
		holidays: [
			['Abubisêm', 34], // 34 = Reram 11
		],
		get season(){
			return ere.oneia.year / this.seasons.length;
		},
		seasons: ['Stum', 'Reram', 'Kokum'],
		seasonsAlt: ['Sowing', 'Harvest', 'Flood'],
		week: ['Nodrilm', 'Rilrilm', 'Kopkêrilm', 'Kosurilm', 'Bikêrilm', 'Samarrilm'],
		zodiac: ['Unasêm', 'Tupazut', 'Tait', 'Kôbenk', 'Kraêt', 'Bazêr',
			'Kôk', 'Siêt', 'Bebekat', 'Dadalidinmat', 'Kunum', 'Zetidot'],
		zodiacAlt: ['Void', 'Drum', 'Bucket', 'Mice', 'Trowel', 'King',
			'Hawks', 'Candle', 'Road', 'Inkwell', 'Treaty', 'Die'],
	},
	oneia: {
		// 00:00 is at roughly local noon
		atEpoch: 1750,
		day: 105583056.7402678, // ms; solar day; the sideral day is 104148 s
		get daysPerYear(){
			return this.year / this.day;
		},
		epoch: 1497151176000, // ms; SUN 2017 JUN 11 03:19:36 UTC
		year: 7656883274.804221, // ms; 72.52 local days; oneian tropical year = 7656856407.307186 s
	},
	seasons: ['Winter', 'Spring', 'Summer', 'Fall'],
	seasonsCyc: ['No Cyclones', 'Cyclonic Activity', 'No Cyclones', 'Cyclonic Activity'],
};

function moon(t = new Date()){
	return phoonsvg(t/ere.eisen.synodic % 1);
}

function clock(t = new Date()){
	let r = (t - ere.oneia.epoch) / ere.oneia.year + ere.oneia.atEpoch;
	const y = Math.floor(r);
	r -= y;
	const yearLength = ere.oneia.year / ere.oneia.day;
	r *= yearLength;
	const seasonLength = Math.floor(yearLength / ere.eremor.seasons.length);
	const season = Math.floor(r / seasonLength);
	const date = Math.floor(r % seasonLength);
	r %= 1;
	r *= 1000;
	const elem = document.createElement('div');
	elem.innerHTML = `${y} AT, ${ere.eremor.seasons[season]}
	(${ere.eremor.seasonsAlt[season]}), Day ${date+1}
	(index ${season * seasonLength + date}), @${r.toFixed(2)}`;
	return elem;
}
clock.dayIndex = (t = new Date()) => +clock(t).innerHTML.match(/index \d+/g)[0].slice(6);
clock.year = (t = new Date()) => +clock(t).innerHTML.match(/^\d+/g)[0];
clock.yearStartDay = (t = new Date()) => {
	const y = clock.year(t);
	const ADJUSTMENT_TO_MATCH_HOMEPAGE = 1;
	return Math.round(0.52*y + (Math.floor((y-1)/25) % 2 ? 0 : 1 - y%2)
		+ ADJUSTMENT_TO_MATCH_HOMEPAGE) % 6;
};
clock.isLeapYear = (t = new Date()) => clock.yearStartDay(t)
	!== clock.yearStartDay(+t + ere.oneia.year);

function calendar(t = new Date(), hideCurrent = false){
	const IS_LEAP_YEAR = clock.isLeapYear(t);
	const DOTW_OFFSET = clock.yearStartDay(t);
	const yearStart = Math.floor((t - ere.oneia.epoch) / ere.oneia.year) * ere.oneia.year
		+ ere.oneia.epoch;
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
	// date cells
	for (let i = 0; i < Math.ceil(ere.oneia.year / ere.oneia.day / ere.eremor.week.length); i++){ // weeks
		const tr = document.createElement('tr');
		table.appendChild(tr);
		for (let j = 0; j < ere.eremor.week.length; j++){ // days
			const d = ere.eremor.week.length*i + j - DOTW_OFFSET;
			const dateTime = new Date((d + DOTW_OFFSET) * ere.oneia.day + yearStart);
			const td = document.createElement('td');
			tr.appendChild(td);
			if (d < 0)
				continue;
			// container
			const tdContainer = document.createElement('div');
			tdContainer.classList.add('tdContainer');
			td.appendChild(tdContainer);
			// date
			const date = document.createElement('div');
			date.classList.add('date');
			const IS_LEAP_DAY = d === 72 && IS_LEAP_YEAR;
			const slength = Math.floor(ere.eremor.season / ere.oneia.day);
			const season_id = IS_LEAP_DAY ? ere.eremor.seasons.length-1 : Math.floor(d / slength);
			const date_adj = (IS_LEAP_DAY ? slength : 0) + d % slength;
			if (!IS_LEAP_DAY)
				date.innerHTML = date_adj + (IS_LEAP_YEAR && 72 < d ? 0 : 1);
			tdContainer.appendChild(date);
			// season
			td.classList.add(IS_LEAP_DAY ? 'intercalary' : `season_${season_id}`);
			const season = document.createElement('div');
			season.classList.add('season');
			season.innerHTML = IS_LEAP_DAY ? 'Bodôbêkum' : ere.eremor.seasons[season_id % ere.eremor.seasons.length];
			if (IS_LEAP_DAY)
				season.title = 'Intercalary Day';
			tdContainer.appendChild(season);
			// MOOOOOOOON
			const moonElem = document.createElement('div');
			moonElem.classList.add('moon');
			moonElem.title = 'Eisen Phase';
			moonElem.appendChild(moon(dateTime));
			tdContainer.appendChild(moonElem);
			// IRL MONTH
			season.appendChild(document.createElement('br'));
			season.appendChild(document.createTextNode(dateTime.toLocaleString('default', { month: 'short', day: 'numeric' })));
			// zodiac
			const zodiacElem = document.createElement('div');
			zodiacElem.classList.add('zodiac');
			const CURRENT_SIGN = Math.floor(d / ere.eremor.daysPerStarsign)
				% ere.eremor.zodiac.length;
			zodiacElem.innerHTML = ere.eremor.zodiac[CURRENT_SIGN].slice(0, 3) + '.';
			const _4seasonID = Math.floor(ere.seasons.length * d / ere.oneia.daysPerYear);
			// eslint-disable-next-line max-len
			zodiacElem.title = `Starsign: ${ere.eremor.zodiac[CURRENT_SIGN]} (the ${ere.eremor.zodiacAlt[CURRENT_SIGN]})
Season: ${ere.seasons[_4seasonID]} (${ere.seasonsCyc[_4seasonID]})`;
			tdContainer.appendChild(zodiacElem);
			// highlight
			if (!hideCurrent && clock.dayIndex() === d)
				tdContainer.classList.add('selectedDate');
			// holidays
			const holiday = ere.eremor.holidays.find(xyz => d === xyz[1]);
			if (holiday){
				const holidayElem = document.createElement('div');
				holidayElem.classList.add('holiday');
				holidayElem.innerHTML = holiday[0];
				tdContainer.appendChild(holidayElem);
			}
		}
	}
	return table;
}

function main(t = new Date()){
	const [last, curr, next] = [-1, 0, 1].map(x => new Date(+t + x * ere.oneia.year));
	document.getElementById('erecal0').appendChild(calendar(last, true));
	document.getElementById('erecal1').appendChild(calendar(curr));
	document.getElementById('erecal2').appendChild(calendar(next, true));
	document.getElementById('erecal0_title').innerHTML = clock.year(last);
	document.getElementById('erecal1_title').innerHTML = clock.year(curr);
	document.getElementById('erecal2_title').innerHTML = clock.year(next);
	refresh();
	setInterval(refresh, 200);
}

function refresh(t = new Date()){
	// eremoran clock
	const clockElem = document.getElementById('ereclock');
	clockElem.innerHTML = '';
	clockElem.appendChild(clock());
	// earth clock
	document.getElementById('earthclock').innerHTML = '' + t;
}

main();