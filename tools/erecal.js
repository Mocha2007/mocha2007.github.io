/* global phoonsvg */

/*
const debug = document.URL[0].toLowerCase() === 'f'; // file:// vs. http(s)://
const _1s = 1000;
const _1m = 60*_1s;
const _1h = 60*_1m;
const _1d = 24*_1h;
const _1w = 7*_1d;
const _1y = 365.2425*_1d;
const _1mo = _1y/12;
*/
const ere = {
	eremor: {
		get season(){
			return ere.oneia.year / this.seasons.length;
		},
		seasons: ['Stum', 'Reram', 'Kokum'],
		seasonsAlt: ['Sowing', 'Harvest', 'Flood'],
		week: ['Nodrilm', 'Rilrilm', 'Kopkêrilm', 'Kosurilm', 'Bikêrilm', 'Samarrilm'],
	},
	nikki: {
		epoch: 0.078, // fraction of orbit period?
	},
	oneia: {
		// 00:00 is at roughly local noon
		atEpoch: 1750,
		day: 105583056.7402678, // ms; solar day; the sideral day is 104148 s
		epoch: 1497151176000, // ms; SUN 2017 JUN 11 03:19:36 UTC
		year: 7656883274.804221, // ms; 72.52 local days; oneian tropical year = 7656856407.307186 s
	},
};

function moon(t){
	const day = t/ere.oneia.day % 1;
	const phase = (day - ere.nikki.epoch) % 1;
	const svg = phoonsvg(phase);
	svg.setAttribute('height', 20);
	svg.setAttribute('width', 20);
	return svg;
}

function clock(t = new Date()){
	// todo
	const elem = document.createElement('div');
	elem.innerHTML = +t;
	return elem;
}

function calendar(t = new Date()){
	const slength = Math.floor(ere.eremor.season / ere.oneia.day);
	// const year = (t - ere.oneia.epoch) / ere.oneia.year + ere.oneia.atEpoch;
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
	for (let i = 0; i < Math.floor(ere.oneia.year / ere.oneia.day / ere.eremor.week.length); i++){ // 12 weeks / year
		const tr = document.createElement('tr');
		table.appendChild(tr);
		for (let j = 0; j < ere.eremor.week.length; j++){ // 6 days / week
			const d = ere.eremor.week.length*i + j;
			const td = document.createElement('td');
			tr.appendChild(td);
			// container
			const tdContainer = document.createElement('div');
			tdContainer.classList.add('tdContainer');
			td.appendChild(tdContainer);
			// date
			const date = document.createElement('div');
			date.classList.add('date');
			const season_id = Math.floor(d / slength);
			const date_adj = d % slength;
			date.innerHTML = date_adj + 1; // todo
			tdContainer.appendChild(date);
			// season
			td.classList.add(`season_${season_id}`);
			// MOOOOOOOON
			const moonElem = document.createElement('div');
			moonElem.classList.add('moon');
			moonElem.appendChild(moon(t)); // todo D IS NOT CORRECT ITS JUST A PLACEHOLDER AND A SHITTY ONE AT THAT
			tdContainer.appendChild(moonElem);
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