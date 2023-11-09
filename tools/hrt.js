/* eslint-disable max-len */

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

function get_t(){
	return new Date() - 1692216960000; // first dose = 2023 Aug 16 @ 4:16 PM EDT
}

function get_dose_t(){
	return new Date() - 1692227700000; // 7:15 is when I normally take my doses
}

function get_laser_t(){
	return new Date() - 1694782800000; // iirc
}

function unit(x, name){
	return `${x} ${name}${x === 1 ? '' : 's'}`;
}

function time_elem_inner(){
	// I subtract 16d 16h 16min from the time, shifting the epoch to August 1st. This allows me to easily count months, whether they were 31 days, 30 days, etc.
	const dt = new Date(new Date() - (24*60*60*1000 * 15 + 60*60*1000 * 16 + 60*1000 * 16));
	const mo = dt.getMonth() - 7 + (dt.getFullYear() - 2023)*12;
	const yr = Math.floor(mo / 12);
	const m = mo % 12;
	const d = dt.getDate()-1;
	const h = dt.getHours();
	const min = dt.getMinutes();
	const s = dt.getSeconds();
	const doses = Math.floor(get_dose_t()/(12*60*60*1000)) + 1; // dose count starts at 1 for t=0
	const laser = Math.floor(get_laser_t()/(35*24*60*60*1000)) + 1; // laser count starts at 1 for t=0
	// elem
	const str = 0 < yr ? `${unit(yr, 'year')}, ` : '';
	return str + `${unit(m, 'month')}, ${unit(d, 'day')},
		${unit(h, 'hour')}, ${unit(min, 'minute')}, ${unit(s, 'second')}<br>
		${unit(doses, 'dose')} of E<br>
		${unit(laser, 'laser session')}`;
}

const progress_items = [
	new ProgressItem('Improved skin', 0, 2, 3, 24, 'upper estimate'), // TFS DIYHRT TFS DIYHRT
	new ProgressItem('Reduced facial hair', 0, 0, 6 * 35/30.5, 10 * 35/30.5, 'lower estimate'), // I am lasering!
	new ProgressItem('Reduced body hair', 1, 12, 6, 36, 'lower estimate'), // DIYHRT TFS DIYHRT TFS
	new ProgressItem('Decreased muscle mass', 1, 6, 12, 24, 'Metabolic panel suggests this is in progress'), // DIYHRT TFS TFS TFS
	new ProgressItem('Breast development', 0.5, 6, 24, 72, 'in progress (upper estimate?)'), // DIYHRT TFS TFS DIYHRT
	new ProgressItem('Body fat redistribution', 1, 6, 24, 60, 'yet unsure'), // DIYHRT TFS TFS TFS
];

const notes = [
	'16 Aug 2023 - 7 Nov 2023: twice daily 1 mg E subL, 50 mg spiro oral',
	'7 Nov 2023 onward: twice daily 2 mg E subL, 50 mg spiro oral',
	'Lasering started 15 Sep 2023',
];

function progress(){
	const months = get_t() / (1000*60*60*24*365.2425/12);
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
	container.appendChild(document.createElement('hr'));
	container.appendChild(progress());
	return container;
}

function main(){
	const elem = document.getElementById('hrt');
	elem.appendChild(hrt());
	refresh();
	setInterval(refresh, 200);
	setTimeout(() => location.reload(), 1000 * 60 * 60); // refresh every hour in case dose counter increases
}

function refresh(){
	document.getElementById('time').innerHTML = time_elem_inner();
}

main();