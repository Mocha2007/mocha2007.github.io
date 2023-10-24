/* eslint-disable max-len */

function get_t(){
	return new Date() - 1692227700000; // 7:15 is when I normally take my doses; first dose was actually 1692216960000 (2023 Aug 16 @ 4:16 PM EDT)
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
	const doses = Math.floor(get_t()/(12*60*60*1000)) + 1; // dose count starts at 1 for t=0
	// elem
	return `${yr} years, ${m} months, ${d} days, ${h} hours, ${min} minutes, ${s} seconds (${doses} doses)`;
}

function progress(){
	const t_ = get_t();
	// https://transfemscience.org/articles/transfem-intro/#timeline-of-effects
	// "2 to 3 years"
	const TIDDIES_MIN = Math.round(100 * t_/(1000*60*60*24*365.2425*3));
	const TIDDIES_MAX = Math.round(100 * t_/(1000*60*60*24*365.2425*2));
	// My lasering started after 30 days HRT. 6-10 Sessions every 5 weeks. Thus 30-50 weeks.
	const LASER = Math.floor(t_/(1000*60*60*24*7*5) - 30/35 + 1); // 5-week periods, 1-indexed
	const LASER_MIN = Math.round(100 * LASER/10);
	const LASER_MAX = Math.round(100 * LASER/6);
	// Skin - "3 to 6 months"
	const SKIN_MIN = Math.round(100 * t_/(1000*60*60*24*365.2425/2));
	const SKIN_MAX = Math.round(100 * t_/(1000*60*60*24*365.2425/4));
	// Body Fat Redist. - "2 to 5 years"
	const BF_MIN = Math.round(100 * t_/(1000*60*60*24*365.2425*5));
	// elem
	const elem = document.createElement('div');
	elem.innerHTML = `Theoretically...<br>
		Breast Development = ${TIDDIES_MIN}% to ${TIDDIES_MAX}%<br>
		Body Fat Redistribution = ${BF_MIN}% to ${TIDDIES_MAX}%<br>
		Body Hair Loss = ${TIDDIES_MIN}%<br>
		Facial Hair Loss = ${LASER_MIN}% to ${LASER_MAX}%<br>
		Improved Skin = ${SKIN_MIN}% to ${SKIN_MAX}%<br><br>`;
	// source
	const source_container = document.createElement('span');
	source_container.innerHTML = 'Source: ';
	const source = document.createElement('cite');
	source.innerHTML = 'Transfeminine Science - ';
	const source_a = document.createElement('a');
	source_a.href = 'https://transfemscience.org/articles/transfem-intro/#timeline-of-effects';
	source_a.innerHTML = 'An Introduction to Hormone Therapy for Transfeminine People';
	source.appendChild(source_a);
	source_container.appendChild(source);
	elem.appendChild(source_container);
	return elem;
}

function hrt(){
	// html
	const container = document.createElement('div');
	const time = document.createElement('span');
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
	setInterval(refresh, 1000);
}

function refresh(){
	document.getElementById('time').innerHTML = time_elem_inner();
}

main();

// todo https://www.w3schools.com/tags/tag_progress.asp