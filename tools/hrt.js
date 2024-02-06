/* eslint-disable max-len */
/* exported sim */
const debug = document.URL[0].toLowerCase() === 'f'; // file:// vs. http(s)://

const _1s = 1000;
const _1m = 60*_1s;
const _1h = 60*_1m;
const _12h = 12*_1h;
const _1d = 24*_1h;
const _1w = 7*_1d;
const _1y = 365.2425*_1d;
const _1mo = _1y/12;
const laserP = 5*_1w; // 5 weeks
const LUNA_MASS = 53; // kg
const LUNA_BLOOD = 65 * LUNA_MASS; // mL https://reference.medscape.com/calculator/648/estimated-blood-volume

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
	constructor(name, min_onset, max_onset, min_completion, max_completion, notes, firstNoticed){
		this.name = name;
		this.min_onset = min_onset;
		this.max_onset = max_onset;
		this.min_completion = min_completion;
		this.max_completion = max_completion;
		this.notes = notes;
		this.firstNoticed = firstNoticed;
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
		const label = document.createElement('label');
		label.setAttribute('for', label.innerHTML = this.name);
		td_name.appendChild(label);
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
		progress_elem.id = this.name;
		progress_elem.value = avg;
		progress_elem.max = 1;
		progress_elem.innerHTML = `${Math.round(avg*100)}%`; // I think this only shows up for eg. screen readers
		td_progress.appendChild(progress_elem);
		tr.appendChild(td_progress);
		const td_notice = document.createElement('td');
		td_notice.innerHTML = this.firstNoticed;
		tr.appendChild(td_notice);
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
	return new Date() - get_t.epoch;
}
get_t.epoch = new Date(2023, 7, 16, 16, 16); // first dose = 2023 Aug 16 @ 4:16 PM EDT

/** https://stackoverflow.com/a/30280636 */
function isDST(d){
	const jan = new Date(d.getFullYear(), 0, 1).getTimezoneOffset();
	const jul = new Date(d.getFullYear(), 6, 1).getTimezoneOffset();
	return Math.max(jan, jul) !== d.getTimezoneOffset();
}

function get_dose_t(){
	const d = new Date();
	return d - 1692227700000 - (isDST(d) ? 0 : _1h) + 75*_1m; // 7:15 is when I used to take my doses, but I have now moved it back 75 mins to 6:00
}

function get_laser_t(){
	return new Date() - get_laser_t.epoch;
}
get_laser_t.epoch = new Date(2024, 1, 7, 16) - 4*laserP; // 4*5 weeks before 2/7; iirc orig. 1694782800000
get_laser_t.appts = [
	new Date('2023-09-15T09:00:00.000-04:00'),
	new Date('2023-10-15T11:15:00.000-04:00'),
	new Date('2023-11-27T10:30:00.000-05:00'),
	new Date('2024-01-02T09:30:00.000-05:00'),
	new Date('2024-02-07T16:00:00.000-05:00'),
];

function get_prog(){
	const t = new Date() - get_prog.epoch;
	const untilNext = t % _1d;
	const doseCount = Math.floor(t / _1d);
	const pCount = get_prog.dose * doseCount;
	return {t, untilNext, doseCount, pCount};
}
get_prog.epoch = new Date(2024, 1, 12, 18); // February 12th
get_prog.dose = 100;

/** @param {Date} t - integer in [0, 11] = day in shave cycle*/
function get_shave_cycle(t = new Date()){
	// shave body every 4d; replace blade every 12d
	const day = (Math.floor(t/_1d) + get_shave_cycle.dayOffset) % get_shave_cycle.period;
	const abbr = day ? day % get_shave_cycle.periodminor ? '' : 's' : '*';
	const title = day ? day % get_shave_cycle.periodminor ? '' : 'shave body' : 'new blade';
	const bladesLeft = get_shave_cycle.cycleOffset
		- Math.floor((+t + get_shave_cycle.dayOffset*_1d) / (get_shave_cycle.period*_1d));
	const eta = new Date(get_shave_cycle.cycleOffset*get_shave_cycle.period*_1d - get_shave_cycle.dayOffset*_1d)
		.toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'});
	const full = `${title} (${unit(bladesLeft, 'blade')} left - estimated date of depletion: ${eta})`;
	const boxesLeft = Math.floor(bladesLeft / get_shave_cycle.boxSize);
	return {day, abbr, title, bladesLeft, full, boxesLeft};
}
get_shave_cycle.boxSize = 12;
get_shave_cycle.dayOffset = 14;
get_shave_cycle.period = 16;
get_shave_cycle.periodminor = 4;
get_shave_cycle.cycleOffset = 1257;

function laserPhaseElem(){
	/** the last time I got lasered */
	const last = get_laser_t.appts[get_laser_t.appts.length-2];
	// a visual chart showing progress to next laser: 2 days, avoid sunlight, 1 wk, "face settling in", rest, "waiting"
	// container
	const elem = document.createElement('div');
	elem.id = 'laserPhaseContainer';
	// it is a 7-wide, >=5-tall table
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
			const timeObject = new Date(_1d*d + +last);
			date.innerHTML = timeObject.getDate();
			tdContainer.appendChild(date);
			td.classList.add(timeObject <= new Date() ? 'red' : debug ? 'redDebug' : 'redNoDebug');
			// shave cycle
			const shave = get_shave_cycle(timeObject);
			const shaveElem = document.createElement('div');
			shaveElem.classList.add('shave');
			shaveElem.innerHTML = shave.abbr;
			shaveElem.title = shave.full;
			tdContainer.appendChild(shaveElem);
		}
	}
	elem.appendChild(red);
	return elem;
}

function eLevel(){
	const t = get_dose_t() % _12h / _1h;
	const e = eLevel.peak * Math.pow(0.5, t/6);
	const delta = Math.LN2/6 * e; // instantaneous change; found through derivative
	const totalE = Math.round(LUNA_BLOOD * e / 1000);
	return `<span class="small">Current blood E2 level: ~${Math.round(e)} pg/mL (&darr; ${Math.round(delta)} pg/mLh, ${totalE} ng total)</span>`;
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
	const laser = get_laser_t.appts.length-1; // Math.floor(get_laser_t()/(5*_1w)) + 1; // laser count starts at 1 for t=0
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
	// total E consumed
	const totalE = doses <= 166 ? doses
		: doses <= 349 ? 2*doses - 166 : 3*doses - 515;
	const totalS = doses*50;
	const totalP = Math.floor(doses/2-180.5)*100;
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
		<span class="small">Total E consumed: ${totalE} mg</span><br>
		<span class="small">Total Spiro consumed: ${totalS/1000} g</span><br>
		<span class="small">Total Prog consumed: ${totalP/1000} g</span><br>
		${unit(laser, 'laser session')}<br><span class="small">Laser Calendar:</span>`;
}

const progress_items = [
	new ProgressItem('Reduced facial hair', 0, 0, 6 * 35/30.5, 10 * 35/30.5, 'middle estimate', '2nd laser'), // I am lasering!
	new ProgressItem('Improved skin', 0, 2, 3, 24, 'upper estimate', '2 weeks'), // TFS DIYHRT TFS DIYHRT
	new ProgressItem('Decreased muscle mass', 1, 6, 12, 24, 'middle estimate?', '1 month?'), // DIYHRT TFS TFS TFS
	new ProgressItem('Reduced body hair', 1, 12, 6, 36, 'lower estimate', '???'), // DIYHRT TFS DIYHRT TFS
	new ProgressItem('Body fat redistribution', 1, 6, 24, 60, 'middle estimate??', '14 weeks'), // DIYHRT TFS TFS TFS
	new ProgressItem('Breast development', 0.5, 6, 24, 72, 'middle estimate??', '4 weeks'), // DIYHRT TFS TFS DIYHRT
];

const notes = [
	'16 Aug 2023 - 7 Nov 2023: twice daily 1 mg E subL, 50 mg spiro oral',
	'7 Nov 2023 - 6 Feb 2024: twice daily 2 mg E subL, 50 mg spiro oral',
	'7 Feb 2024 onward: 3x daily 2 mg E subL, 2x daily 50 mg spiro oral, 1x daily 100 mg prog oral',
	'Lasering started 15 Sep 2023: 9/15, 10/20, 11/27, 1/2, 2/7, ...',
	`Current daily schedule as of 2/12/24:<ul>
	<li>Morning: 2 x 2 mg E, 50 mg spiro</li>
	<li>Evening: 1 x 2 mg E, 50 mg spiro, 100 mg prog</li>
	</ul>`,
];

function progress(){
	const months = get_t() / _1mo;
	// elem
	const elem = document.createElement('div');
	const table = document.createElement('table');
	const tr = document.createElement('tr');
	['Effect', 'Min. Progress', 'Max. Progress', 'Visualization', 'Started', 'Apparent Progress'].forEach(header => {
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
	setInterval(refresh, 500);
	setTimeout(() => location.reload(), _1h); // refresh every hour in case dose counter increases
}

function refresh(){
	document.getElementById('time').innerHTML = time_elem_inner();
}

main();