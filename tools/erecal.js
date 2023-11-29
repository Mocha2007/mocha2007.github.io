/* global phoonsvg */

// const debug = document.URL[0].toLowerCase() === 'f'; // file:// vs. http(s)://
const _1s = 1000;
const _1m = 60*_1s;
const _1h = 60*_1m;
const _1d = 24*_1h;
/*
const _1w = 7*_1d;
const _1y = 365.2425*_1d;
const _1mo = _1y/12;
*/
const ere = {
	eisen: {
		synodic: 93.37 * _1d,
	},
	eremor: {
		get season(){
			return ere.oneia.year / this.seasons.length;
		},
		seasons: ['Stum', 'Reram', 'Kokum'],
		seasonsAlt: ['Sowing', 'Harvest', 'Flood'],
		week: ['Nodrilm', 'Rilrilm', 'Kopkêrilm', 'Kosurilm', 'Bikêrilm', 'Samarrilm'],
	},
	/*nikki: {
		epoch: 0.078, // fraction of orbit period?
	},*/
	oneia: {
		// 00:00 is at roughly local noon
		atEpoch: 1750,
		day: 105583056.7402678, // ms; solar day; the sideral day is 104148 s
		epoch: 1497151176000, // ms; SUN 2017 JUN 11 03:19:36 UTC
		year: 7656883274.804221, // ms; 72.52 local days; oneian tropical year = 7656856407.307186 s
	},
};

function moon(t){
	const phase = t/ere.eisen.synodic % 1;
	const svg = phoonsvg(phase);
	svg.setAttribute('height', 20);
	svg.setAttribute('width', 20);
	return svg;
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
	// todo
	const elem = document.createElement('div');
	elem.innerHTML = `${y} AT, ${ere.eremor.seasons[season]}
	(${ere.eremor.seasonsAlt[season]}), Day ${date+1}
	(index ${season * seasonLength + date}), @${r.toFixed(2)}`;
	return elem;
}
clock.dayIndex = (t = new Date()) => +clock(t).innerHTML.match(/index \d+/g)[0].slice(6);
clock.year = (t = new Date()) => +clock(t).innerHTML.match(/^\d+/g)[0];
clock.yearStartDay = (t = new Date()) => {
	let y = clock.year(t);
	y %= 150; // just in case...
	const ADJUSTMENT_TO_MATCH_HOMEPAGE = 1;
	return Math.round(0.52*y + (Math.floor((y-1)/25) % 2 ? 0 : 1 - y%2)
		+ ADJUSTMENT_TO_MATCH_HOMEPAGE) % 6;
};
clock.isLeapYear = (t = new Date()) => clock.yearStartDay(t)
	!== clock.yearStartDay(t - ere.oneia.year);

function calendar(t = new Date()){
	const IS_LEAP_YEAR = clock.isLeapYear(t);
	const DOTW_OFFSET = clock.yearStartDay(t);
	const yearStart = Math.floor((t - ere.oneia.epoch) / ere.oneia.year) * ere.oneia.year
		+ ere.oneia.epoch;
	const table = document.createElement('table');
	table.id = 'calendar';
	// day cells
	const tr0 = document.createElement('tr');
	table.appendChild(tr0);
	ere.eremor.week.forEach(day => {
		const th = document.createElement('th');
		tr0.appendChild(th);
		th.innerHTML = day;
	});
	// date cells
	for (let i = 0; i < Math.ceil(ere.oneia.year / ere.oneia.day / ere.eremor.week.length); i++){ // 12 weeks / year
		const tr = document.createElement('tr');
		table.appendChild(tr);
		for (let j = 0; j < ere.eremor.week.length; j++){ // 6 days / week
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
			// highlight
			if (clock.dayIndex() === d)
				tdContainer.classList.add('selectedDate');
		}
	}
	return table;
}

function main(){
	document.getElementById('erecal').appendChild(calendar());
	refresh();
	setInterval(refresh, 200);
}

function refresh(){
	const clockElem = document.getElementById('ereclock');
	clockElem.innerHTML = '';
	clockElem.appendChild(clock());
}

main();