/* eslint-disable indent */
/* jshint esversion: 6, strict: true, strict: global */
/* globals ages, lifeData, proper */
/* exported openAge, searchButton, toggle, main */
'use strict';

class Taxon {
	constructor(o){
		/** @type {string} */
		this.name = o.name;
		/** @type {string} */
		this.rank = o.rank;
		/** @type {string} */
		this.parent_id = o.parent;
		const wikientry = o.wiki || o.name.replaceAll(' ', '_');
		/** @type {string} */
		this.url = o.url || `https://en.wikipedia.org/wiki/${wikientry}`;
		/** @type {number} */
		this.i = Taxon.taxa.length;
		/** @type {number} */
		this.age = o.age | 0;
		/** @type {number} */
		this.age_end = o.age_end | 0;
		/** @type {boolean} */
		this.extinct = o.extinct || false;
		Taxon.taxa.push(this);
	}
	get a(){
		const e = document.createElement('a');
		e.innerHTML = this.pName;
		e.href = this.url;
		return e;
	}
	get authority_elem(){
		const authority_elem = document.createElement('span');
		authority_elem.classList.add('authority');
		if (lifeData[this.i].hasOwnProperty('authority')){
			const authority = lifeData[this.i].authority;
			const original_authority = authority.original_authority;
			// (Original, year) current
			if (original_authority){
				const current_authority = authority.current_authority;
				if (current_authority){
					authority_elem.innerHTML += '(';
				}
				authority_elem.innerHTML += `<a href="https://en.wikipedia.org/wiki/${original_authority}">${original_authority}</a>`;
				const year = authority.year;
				if (year){
					authority_elem.innerHTML += `, ${year}`;
				}
				if (current_authority){
					authority_elem.innerHTML += `) <a href="https://en.wikipedia.org/wiki/${current_authority}">${current_authority}</a>`;
				}
			}

		}
		return authority_elem;
	}
	get elem(){
		const i = this.i;
		const details = document.createElement('details');
		details.open = openSetting;
		const rank = lifeData[i].rank;
		details.classList.add(rank);
		const name = lifeData[i].name;
		if (lifeData[i+1] && lifeData[i+1].name < name)
			console.warn(`${name} out of order!`);
		objects[name] = details;
		details.id = name;
		// title
		const title = document.createElement('summary');
		details.appendChild(title);
		/* important
		if (isImportant(i)){
			var important = document.createElement("span");
			important.classList.add('important');
			important.innerHTML = '(!) ';
			title.appendChild(important);
		}
		*/
		// rank
		const b = document.createElement('b');
		b.innerHTML = proper(rank) + ' ';
		title.appendChild(b);
		// extinct?
		if (this.extinct){
			title.innerHTML += '&dagger; ';
		}
		// emoji?
		if (lifeData[i].emoji)
			title.innerHTML += lifeData[i].emoji + ' ';
		// name
		title.appendChild(this.a);
		// authority
		title.appendChild(this.authority_elem);
		// range
		if (lifeData[i].hasOwnProperty('range')){
			title.innerHTML += ' ';
			title.appendChild(rangeElem(lifeData[i].range));
		}
		// age
		if (this.age){
			const a = this.age; // mya
			title.innerHTML += ' ';
			const age = document.createElement('abbr');
			age.classList.add('age');
			age.title = getEra(a);
			age.innerHTML = getAge(a);
			title.appendChild(age);
			// age_end
			if (this.age_end){
				title.innerHTML += '&ndash;';
				const a = this.age_end; // mya
				const age_end = document.createElement('abbr');
				age_end.classList.add('age');
				age_end.title = getEra(a);
				age_end.innerHTML = getAge(a);
				title.appendChild(age_end);
			}
		}
		// genetics
		if (lifeData[i].hasOwnProperty('genetic')){
			const genetic = document.createElement('span');
			genetic.classList.add('genetic');
			title.appendChild(genetic);
			// chromosomes
			if (lifeData[i].genetic.hasOwnProperty('chromosome')){
				const chr = document.createElement('abbr');
				genetic.appendChild(chr);
				const ploidy = lifeData[i].genetic.chromosome.ploidy || 1;
				const allo = lifeData[i].genetic.chromosome.autosomal * ploidy;
				if (lifeData[i].genetic.chromosome.allosomal){
					const [chrF, chrM] = lifeData[i].genetic.chromosome.allosomal
						.map(sex => sex + allo);
					if (chrF === chrM)
						chr.innerHTML = chrF;
					else
						chr.innerHTML = `♀${chrF}♂${chrM}`;
				}
				else
					chr.innerHTML = allo;
				chr.title = `Chromosome count ${ploidy}x = ${allo}, excl. sex chromosomes.`;
			}
			// sex determination system
			if (lifeData[i].genetic.hasOwnProperty('sex')){
				const sds = document.createElement('abbr');
				genetic.appendChild(sds);
				sds.innerHTML = lifeData[i].genetic.sex;
				sds.title = 'Sex determination system';
			}
		}
		// development
		if (lifeData[i].hasOwnProperty('develop')){
			const develop = document.createElement('abbr');
			develop.classList.add('develop');
			title.appendChild(develop);
			develop.innerHTML = '*';
			develop.title = `${this.pName} innovated: ${lifeData[i].develop}`;
		}
		if (lifeData[i].hasOwnProperty('loss')){
			const loss = document.createElement('abbr');
			loss.classList.add('develop');
			title.appendChild(loss);
			loss.innerHTML = '+';
			loss.title = `${this.pName} lost: ${lifeData[i].loss}`;
		}
		// "open all" button
		const openAll = document.createElement('input');
		openAll.type = 'submit';
		openAll.value = 'Open All';
		openAll.onclick = () => openChildren(details);
		openAll.classList.add('openAll');
		title.appendChild(openAll);
		// desc
		if (lifeData[i].hasOwnProperty('desc')){
			const desc = document.createElement('p');
			desc.innerHTML = lifeData[i].desc;
			details.appendChild(desc);
		}
		return details;
	}
	// get i(){
	// 	return lifeData.findIndex(o => o.name === this.name);
	// }
	/** @returns {Taxon|undefined} */
	get kingdom(){
		if (this.rank === 'kingdom')
			return this;
		const p = this.parent;
		if (p)
			return p.kingdom;
		return undefined;
	}
	get parent(){
		return Taxon.fromString(this.parent_id);
	}
	get pName(){
		return proper(this.name);
	}
	/** @param {string} s */
	static fromString(s){
		return Taxon.taxa.find(t => t.name === s);
	}
}
/** @type {Taxon[]} */
Taxon.taxa = [];

/** @type {Object<string, HTMLDetailsElement>} */
const objects = {}; // string -> DOM object map
let openSetting = false; // default setting
const regions = {
	'WW': 'Worldwide',
		'AN': 'Antarctica',
		'NW': 'New World',
			'NA': 'North America',
			'SA': 'South America',
		'OC': 'Oceania',
			'AU': 'Australia',
		'OW': 'Old World',
			'AF': 'Africa',
			'EA': 'Eurasia',
				'AS': 'Asia',
					'CN': 'China',
					'IN': 'India',
					'ME': 'Middle East', // excl. Africa
				'EU': 'Europe',
		// alternatively
		'NH': 'Northern Hemisphere',
		'EQ': 'Equatorial Regions',
		'SH': 'Southern Hemisphere',
		// oceans
		'WO': 'World Ocean',
			'AL': 'Atlantic Ocean',
			'PA': 'Pacific Ocean',
			'SO': 'Southern Ocean',
	// 'XX': 'Extinct', // deprecated
};

// helper functions
/** @param {number} age */
function getAge(age){
	if (1 < age){
		return age + ' mya';
	}
	return age*1000 + ' kya';
}

/**
 * @param {number} age
 * @param {number} depth
 * @return {string}
*/
function getEra(age, ageList = ages, depth = 0){
	/** @type {number} */
	let i;
	const names = ['eon', 'era', 'period', 'epoch', 'age'];
	for (i = 1; i < ageList.length; i++){
		if (ageList[i].start < age){
			break;
		}
	}
	return (ageList[i-1].hasOwnProperty('divisions') ? getEra(age, ageList[i-1].divisions, depth+1) + ', ' : '')
	+ ageList[i-1].name + ' ' + names[depth];
}

/** @param {number} i */
function isImportant(i){
	return lifeData[i].hasOwnProperty('important') && lifeData[i].important;
}

/** @param {number} age */
function openAge(age){
	// open all clades older than age mya
	lifeData.forEach(
		clade => {
			if (clade.hasOwnProperty('age') && age < clade.age){
				openParents(objects[clade.name]);
			}
		}
	);
}

/** @param {HTMLDetailsElement} object */
function openChildren(object){
	// open object
	object.open = true;
	Array.from(object.children).filter(elem => elem.tagName === 'DETAILS').forEach(openChildren);
}

/** @param {HTMLDetailsElement} object */
function openParents(object){
	// open object
	object.open = true;
	// get parent
	/** @type {HTMLDetailsElement|HTMLDivElement} */
	const parent = object.parentElement;
	// if parent === details then call for parent
	if (parent.tagName === 'DETAILS')
		openParents(parent);
}

function refreshButtons(){
	document.getElementById('toggle_button_inner').innerHTML = openSetting ? 'Close' : 'Open';
}

/** @param {string} string */
function search(string){
	string = string.toLowerCase();
	/** @type {number[]} */
	const indices = [];
	// return all lifeData indices matching search string
	lifeData.forEach(
		(clade, i) => {
			// if name or desc contains string
			if (clade.hasOwnProperty('name') && clade.name.toLowerCase().includes(string)
				|| clade.hasOwnProperty('desc') && clade.desc.toLowerCase().includes(string)){
				indices.push(i);
			}
		}
	);
	return indices;
}

function searchButton(){
	const searchString = document.getElementById('search_clade').value;
	// clear results
	document.getElementById('results').innerHTML = '';
	search(searchString).forEach(i => {
		const name = lifeData[i].name;
		// open element
		openParents(objects[name]);
		// show result
		const li = document.createElement('li');
		li.value = i;
		if (name.includes(searchString)){
			li.innerHTML = name.replace(new RegExp(searchString, 'gi'), '<b>' + searchString + '</b>');
		}
		else {
			li.innerHTML = name + ' (matched description)';
		}
		document.getElementById('results').appendChild(li);
	});
}

function toggle(){
	// make everything closed or open (toggle)
	openSetting = !openSetting;
	refreshButtons();
	Array.from(document.getElementsByTagName('DETAILS')).forEach(
		element => element.open = openSetting
	);
}

/** @param {string} s */
function rangeElem(s){
	const rangeAbbrs = s.toUpperCase().split(';');
	const range = document.createElement('abbr');
	range.classList.add('range');
	range.title = rangeAbbrs.map(r => regions[r]).join(', ');
	range.innerHTML = rangeAbbrs.join(' ');
	return range;
}

// main program

function main(){
	console.log('Loading life.js ...');
	// print appropriate text to toggle button
	refreshButtons();
	// first, add everything in lifeData to objects
	for (let i = 0; i < lifeData.length; i++){
		const taxon = new Taxon(lifeData[i]);
		// create DOM object
		taxon.elem;
	}
	// next, nest everything accordingly. add * to root.
	for (let i = 0; i < lifeData.length; i++){
		const name = lifeData[i].name;
		// console.log('Loading ' + name + '...');
		const parentId = lifeData[i].parent;
		const child = objects[name];
		const parent = parentId === '*' ? document.getElementById('root') : objects[parentId];
		try {
			parent.appendChild(child);
		}
		catch (_){
			console.error(`error nesting ${name} under ${parentId}`);
			throw _;
		}
	}
	// next, if important, open every parent
	for (let i = 0; i < lifeData.length; i++){
		if (isImportant(i)){
			openParents(objects[lifeData[i].name]);
		}
	}
	stats();
	verify();
}

function stats(){
	const total = lifeData.length;
	console.log(`Loaded ${total} entries.`);
	const kingdoms = {};
	Taxon.taxa.forEach(t => {
		let key = 'N/A';
		if (t.kingdom)
			key = t.kingdom.name;
		if (kingdoms[key])
			kingdoms[key]++;
		else
			kingdoms[key] = 1;
	});
	Object.keys(kingdoms).forEach(ks => {
		const n = kingdoms[ks];
		console.info(`${n} taxa (${Math.round(100*n/total)}%) in kingdom ${ks}`);
	});
	/*
	const ranks = {};
	Taxon.taxa.forEach(t => {
		if (ranks[t.rank])
			ranks[t.rank]++;
		else
			ranks[t.rank] = 1;
	});
	Object.keys(ranks).sort().forEach(key => console.info(`${ranks[key]} of rank ${key}`));
	*/
}

function verify(){
	// missing ages
	console.debug("missing ages:");
	console.debug(Taxon.taxa.filter(t => !lifeData[t.i].hasOwnProperty('age')).map(t => t.url));
	// age is older than parent
	console.debug("age is older than parent:");
	Taxon.taxa.filter(t => t.parent && t.age > t.parent.age).forEach(t => {
		console.warn(`${t.name} (${t.age}) older than its parent ${t.parent.name} (${t.parent.age})`);
	});
	// extinct but no age or age_end tag
	console.debug("missing age tags for extinct taxa:");
	Taxon.taxa.filter(t => t.extinct && !(t.age && t.age_end)).forEach(t => {
		console.warn(`${t.name} (${t.url}) is extinct but is missing an age tag (${t.age}) or an age_end tag (${t.age_end})`);
	});
}