/* eslint-disable max-len */
/* exported sim */
/* global phoonsvg */
const debug = document.URL[0].toLowerCase() === 'f'; // file:// vs. http(s)://

const _1s = 1000;
const _1m = 60*_1s;
const _1h = 60*_1m;
const _12h = 12*_1h;
const _1d = 24*_1h;
const _1w = 7*_1d;
const _1y = 365.2425*_1d;
const _1mo = _1y/12;
const moonEpoch = new Date(1970, 0, 7, 15, 35); // first new moon after 1/1/1970
const moonP = 29.530589 * _1d; // synodic period
const laserP = 5*_1w; // 5 weeks

class Source {
	constructor(url, title = '(no title)', author = '(no author)',
		publisher = '(no publisher)', year = '(undated)'){
		this.url = url;
		this.title = title;
		this.author = author;
		this.publisher = publisher;
		this.year = year;
	}
	get elem(){
		const container = document.createElement('span');
		container.classList.add('source');
		container.innerHTML = `${this.author} (${this.year}). "${this.title}". <cite>${this.publisher}</cite>. `;
		const link = document.createElement('a');
		link.href = this.url;
		link.innerHTML = '[*]';
		container.appendChild(link);
		return container;
	}
	get li(){
		const elem = document.createElement('li');
		elem.appendChild(this.elem);
		return elem;
	}
}
const sources = [
	new Source('https://transfemscience.org/articles/transfem-intro/#timeline-of-effects',
		'An Introduction to Hormone Therapy for Transfeminine People',
		'Aly',
		'Transfeminine Science',
		'2018'),
	new Source('https://diyhrt.wiki/transfem#what_does_it_do',
		'Transfeminine DIY HRT: the Ultimate Guide',
		undefined,
		'The DIY HRT Directory',
		'2023'),
];

class ProgressItem {
	/** all times are measured in MONTHS. */
	constructor(name, min_onset, max_onset, min_completion, max_completion, notes){
		this.name = name;
		this.min_onset = min_onset;
		this.max_onset = max_onset;
		this.min_completion = min_completion;
		this.max_completion = max_completion;
		this.notes = notes;
	}
	/** @param {number} t (in months) */
	range(t){
		const min = t < this.max_onset ? 0
			: this.max_completion < t ? 1
				: (t - this.max_onset) / (this.max_completion - this.max_onset);
		const max = t < this.min_onset ? 0
			: this.min_completion < t ? 1
				: (t - this.min_onset) / (this.min_completion - this.min_onset);
		return [min, max];
	}
	/** @param {number} t (in months) */
	tr(t){
		const tr = document.createElement('tr');
		const td_name = document.createElement('td');
		td_name.innerHTML = this.name;
		tr.appendChild(td_name);
		// min/max
		const [min, max] = this.range(t);
		const avg = (min + max)/2;
		const td_min = document.createElement('td');
		td_min.innerHTML = Math.round(min*100) + '%';
		tr.appendChild(td_min);
		const td_max = document.createElement('td');
		td_max.innerHTML = Math.round(max*100) + '%';
		tr.appendChild(td_max);
		const td_progress = document.createElement('td');
		const progress_elem = document.createElement('progress');
		progress_elem.value = avg;
		progress_elem.max = 1;
		progress_elem.innerHTML = `${Math.round(avg*100)}%`; // I think this only shows up for eg. screen readers
		td_progress.appendChild(progress_elem);
		tr.appendChild(td_progress);
		const td_notes = document.createElement('td');
		td_notes.innerHTML = this.notes;
		tr.appendChild(td_notes);
		return tr;
	}
}

/** create table of E levels */
function sim(mg = 2, rounds = 2, t = 48 * _1h, tick = _1m){
	/** pg/mL per mg dose */
	const doseCoef = 230.52688366817927/2;
	/** mg dose */
	const dose = mg;
	/** time to dissolve dose */
	const dissolutionT = 45 * _1m;
	/** time between doses */
	const doseT = _1d / rounds;
	const peak = doseCoef * dose;
	/** sublingual estradiol half-life */
	const hl = 6 * _1h;
	/** the long-term limit of the trough level (appx) */
	const limit = peak / (Math.pow(2, doseT/hl) - 1);
	const data = [limit];
	for (let ms = 0; ms < t; ms += tick){
		let nextELevel = data[data.length - 1];
		// more E is dissolving
		if (ms % doseT < dissolutionT)
			nextELevel += peak * tick / dissolutionT;
		// exponential decay
		nextELevel *= Math.pow(0.5, tick / hl);
		// update data
		data.push(nextELevel);
	}
	return data.join('\n');
}

function get_t(){
	return new Date() - 1692216960000; // first dose = 2023 Aug 16 @ 4:16 PM EDT
}

/** https://stackoverflow.com/a/30280636 */
function isDST(d){
	const jan = new Date(d.getFullYear(), 0, 1).getTimezoneOffset();
	const jul = new Date(d.getFullYear(), 6, 1).getTimezoneOffset();
	return Math.max(jan, jul) !== d.getTimezoneOffset();
}

function get_dose_t(){
	const d = new Date();
	return d - 1692227700000 - (isDST(d) ? 0 : _1h) + 10*_1m; // 7:15 is when I used to take my doses, but I have now moved it back 10 mins to 7:05
}

function get_laser_t(){
	return new Date() - get_laser_t.epoch;
}
get_laser_t.epoch = new Date(2024, 0, 2, 9) - 3*laserP; // 3*5 weeks before 1/2; iirc orig. 1694782800000

function get_prog(){
	const t = new Date() - get_prog.epoch;
	const untilNext = t % _1d;
	const doseCount = Math.floor(t / _1d);
	const pumpCount = get_prog.pumps * doseCount;
	const pCount = get_prog.dose * pumpCount;
	return {t, untilNext, doseCount, pumpCount, pCount};
}
get_prog.epoch = new Date(2023, 11, 7, 19); // Dec 7th @ 7 PM?
get_prog.pumps = 2;
get_prog.dose = 21;

/** @param {Date} t - integer in [0, 11] = day in shave cycle*/
function get_shave_cycle(t){
	// shave body every 4d; replace blade every 12d
	return (Math.floor(t/_1d) + 3) % 12;
}

function moon(t){
	// full = 0
	const phase = (t - moonEpoch) / moonP % 1;
	const svg = phoonsvg(phase);
	svg.setAttribute('height', 10);
	svg.setAttribute('width', 10);
	return svg;
}

function laserPhaseElem(){
	/** the last time I got lasered */
	const epoch = new Date(get_laser_t.epoch + Math.floor((new Date() - get_laser_t.epoch) / laserP) * laserP);
	// a visual chart showing progress to next laser: 2 days, avoid sunlight, 1 wk, "face settling in", rest, "waiting"
	// container
	const elem = document.createElement('div');
	elem.id = 'laserPhaseContainer';
	// it is a 7-wide, 5-tall table
	const table = document.createElement('table');
	table.id = 'laserPhaseTable';
	elem.appendChild(table);
	const tr0 = document.createElement('tr');
	table.appendChild(tr0);
	const tr1 = document.createElement('tr');
	table.appendChild(tr1);
	const td0 = document.createElement('td');
	td0.id = 'lpt_td0';
	td0.innerHTML = 'avoid sun';
	td0.colSpan = 2;
	tr0.appendChild(td0);
	const td1 = document.createElement('td');
	td1.id = 'lpt_td1';
	td1.innerHTML = 'hair dies';
	td1.colSpan = 5;
	tr0.appendChild(td1);
	const td2 = document.createElement('td');
	td2.id = 'lpt_td2';
	td2.innerHTML = 'wait';
	td2.colSpan = 7;
	td2.rowSpan = 4;
	tr1.appendChild(td2);
	// duplicate, but just for the redness...
	const red = document.createElement('table');
	red.id = 'laserPhaseRed';
	for (let i = 0; i < 5; i++){
		const tr = document.createElement('tr');
		red.appendChild(tr);
		for (let j = 0; j < 7; j++){
			const d = 7*i + j;
			const td = document.createElement('td');
			tr.appendChild(td);
			// container
			const tdContainer = document.createElement('div');
			tdContainer.classList.add('tdContainer');
			td.appendChild(tdContainer);
			// content
			const date = document.createElement('div');
			date.classList.add('date');
			const timeObject = new Date(_1d*d + +epoch);
			date.innerHTML = timeObject.getDate();
			tdContainer.appendChild(date);
			td.classList.add(timeObject <= new Date() ? 'red' : debug ? 'redDebug' : 'redNoDebug');
			// shave cycle
			const shave = get_shave_cycle(timeObject);
			const shaveElem = document.createElement('div');
			shaveElem.classList.add('shave');
			shaveElem.innerHTML = shave ? shave % 4 ? '' : 's' : '*';
			shaveElem.title = shave ? shave % 4 ? '' : 'shave body' : 'new blade';
			tdContainer.appendChild(shaveElem);
			// MOOOOOOOON
			const moonElem = document.createElement('div');
			moonElem.classList.add('moon');
			moonElem.appendChild(moon(timeObject));
			tdContainer.appendChild(moonElem);
		}
	}
	elem.appendChild(red);
	return elem;
}

function eLevel(){
	const t = get_dose_t() % _12h / _1h;
	const e = eLevel.peak * Math.pow(0.5, t/6);
	const delta = Math.LN2/6 * e; // instantaneous change; found through derivative
	return `<span class="small">Current blood E2 level: ~${Math.round(e)} pg/mL (&darr; ${Math.round(delta)} pg/mLh)</span>`;
}
eLevel.peak = 63.4 * Math.pow(2, 14/6);

function unit(x, name){
	return `${x} ${name}${x === 1 ? '' : 's'}`;
}

function time_elem_inner(){
	// I subtract 16d 16h 16min from the time, shifting the epoch to August 1st. This allows me to easily count months, whether they were 31 days, 30 days, etc.
	const dt = new Date(new Date() - (_1d * 15 + _1h * 16 + _1m * 16));
	const mo = dt.getMonth() - 7 + (dt.getFullYear() - 2023)*12;
	const yr = Math.floor(mo / 12);
	const m = mo % 12;
	const d = dt.getDate()-1;
	const h = dt.getHours();
	const min = dt.getMinutes();
	const s = dt.getSeconds();
	const doseT = get_dose_t();
	const doses = Math.floor(doseT/_12h) + 1; // dose count starts at 1 for t=0
	const laser = Math.floor(get_laser_t()/(5*_1w)) + 1; // laser count starts at 1 for t=0
	// next dose timer
	let doseR = doses*_12h - doseT;
	const quietGirlunaTime = Math.floor((12 - doseR / _1h)*60); // minutes since last dose
	const quietGirluna = quietGirlunaTime < 45
		? ['Quiet', 'UwU', 45 - quietGirlunaTime]
		: ['Loud', 'OwO', 12*60 - quietGirlunaTime];
	const doseH = Math.floor(doseR / _1h);
	doseR -= _1h*doseH;
	const doseM = Math.floor(doseR / _1m);
	doseR -= _1m*doseM;
	const doseS = Math.ceil(doseR / _1s);
	// visitations
	const visits = Math.floor(mo/3) + 2;
	// elem
	const str = 0 < yr ? `${unit(yr, 'year')}, ` : '';
	return str + `${unit(m, 'month')}, ${unit(d, 'day')},
		${unit(h, 'hour')}, ${unit(min, 'minute')}, ${unit(s, 'second')}<br>
		<span class="small">${unit(visits, 'endo visit')}</span><br>
		${unit(doses, 'dose')} of E (${unit(doseH, 'hour')}, ${unit(doseM, 'minute')}, ${unit(doseS, 'second')} until next dose)<br>
		<span class="small">${quietGirluna[0]} Girluna ${quietGirluna[1]} (${unit(quietGirluna[2], 'minute')} left)</span><br>
		${eLevel()}<br>
		${unit(laser, 'laser session')}<br><span class="small">Laser Calendar:</span>`;
}

const progress_items = [
	new ProgressItem('Improved skin', 0, 2, 3, 24, 'upper estimate'), // TFS DIYHRT TFS DIYHRT
	new ProgressItem('Reduced facial hair', 0, 0, 6 * 35/30.5, 10 * 35/30.5, 'lower estimate'), // I am lasering!
	new ProgressItem('Reduced body hair', 1, 12, 6, 36, 'lower estimate'), // DIYHRT TFS DIYHRT TFS
	new ProgressItem('Decreased muscle mass', 1, 6, 12, 24, 'Metabolic panel suggests this is in progress'), // DIYHRT TFS TFS TFS
	new ProgressItem('Breast development', 0.5, 6, 24, 72, 'in progress (middle estimate?)'), // DIYHRT TFS TFS DIYHRT
	new ProgressItem('Body fat redistribution', 1, 6, 24, 60, 'in progress? (middle estimate?)'), // DIYHRT TFS TFS TFS
];

const notes = [
	'16 Aug 2023 - 7 Nov 2023: twice daily 1 mg E subL, 50 mg spiro oral',
	'7 Nov 2023 onward: twice daily 2 mg E subL, 50 mg spiro oral',
	'Lasering started 15 Sep 2023: 9/15, 10/20, 11/27, 1/2, ...',
];

function progress(){
	const months = get_t() / _1mo;
	// elem
	const elem = document.createElement('div');
	const table = document.createElement('table');
	const tr = document.createElement('tr');
	['Effect', 'Min. Progress', 'Max. Progress', 'Visualization', 'Apparent Progress'].forEach(header => {
		const th = document.createElement('th');
		th.innerHTML = header;
		tr.appendChild(th);
	});
	table.appendChild(tr);
	progress_items.forEach(x => table.appendChild(x.tr(months)));
	elem.appendChild(table);
	// notes
	elem.appendChild(document.createElement('hr'));
	const note_header = document.createElement('h2');
	note_header.innerHTML = 'Notes:';
	elem.appendChild(note_header);
	const note_list = document.createElement('ul');
	notes.forEach(note => {
		const li = document.createElement('li');
		li.innerHTML = note;
		note_list.appendChild(li);
	});
	elem.appendChild(note_list);
	// sources
	elem.appendChild(document.createElement('hr'));
	const source_header = document.createElement('h2');
	source_header.innerHTML = 'Sources:';
	elem.appendChild(source_header);
	const source_list = document.createElement('ul');
	sources.forEach(source => source_list.appendChild(source.li));
	elem.appendChild(source_list);
	return elem;
}

function hrt(){
	// html
	const container = document.createElement('div');
	const time = document.createElement('h2');
	time.id = 'time';
	container.appendChild(time);
	container.appendChild(laserPhaseElem());
	container.appendChild(document.createElement('hr'));
	container.appendChild(progress());
	return container;
}

function main(){
	const elem = document.getElementById('hrt');
	elem.appendChild(hrt());
	refresh();
	setInterval(refresh, 200);
	setTimeout(() => location.reload(), _1h); // refresh every hour in case dose counter increases
}

function refresh(){
	document.getElementById('time').innerHTML = time_elem_inner();
}

main();