/* eslint-disable indent */
/* jshint esversion: 6, strict: true, strict: global */
/* globals ages, lifeData */
/* exported openAge, searchButton, toggle, main */
'use strict';

// for taxa we only want to capitalize the VERY FIRST letter, nothing else...
function capitalizeFirstLetter(s) {
	return s.charAt(0).toUpperCase() + s.slice(1);
}

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
		this.age = o.age || 0;
		/** @type {number} */
		this.age_end = o.age_end || 0;
		/** @type {boolean} */
		this.extinct = o.extinct || false;
		/** @type {Taxon[]} once initialized */
		this.parent_recursive = undefined;
		// precompute some things...
		if (o.stats && o.stats.cranial_capacity && typeof o.stats.brain_weight !== "number"){
			const DENSITY = (1.2 + 1.4) / (1130 + 1260);
			o.stats.brain_weight = o.stats.cranial_capacity * DENSITY;
			o.stats.brain_weight_computed = true;
		}
		if (o.stats && o.stats.brain_weight && o.stats.weight && !o.stats.encephalization_quotient){
			// https://en.wikipedia.org/wiki/Encephalization_quotient#Calculation
			o.stats.encephalization_quotient = 100 * o.stats.brain_weight / Math.pow(o.stats.weight, 2/3);
			o.stats.encephalization_quotient_computed = true;
		}
		/** object possibly existing, and possibly containing height, length, weight, and speed */
		this.stats = o.stats;
		// this.raw = o;
		Taxon.taxa.push(this);
	}
	get a(){
		const e = document.createElement('a');
		e.innerHTML = this.pName;
		e.href = this.url;
		return e;
	}
	// todo: make this auto-generate a "guess" if there is parent and daughter info
	get age_elem(){
		const age_container = document.createElement('span');
		const age = this.age_guess;
		const is_guess = !this.age;
		if (age){
			const age_elem = document.createElement('abbr');
			age_elem.classList.add('age');
			age_elem.title = getEra(age);
			age_elem.innerHTML = getAge(age);
			age_container.appendChild(age_elem);
			if (is_guess){
				age_elem.innerHTML += '<abbr title="guess">?</abbr>';
			}
			// age_end
			if (this.age_end){
				age_container.innerHTML += '&ndash;';
				const a = this.age_end; // mya
				const age_end = document.createElement('abbr');
				age_end.classList.add('age');
				age_end.title = getEra(a);
				age_end.innerHTML = getAge(a);
				age_container.appendChild(age_end);
			}
		}
		return age_container;
	}
	get age_guess(){
		if (this.age){
			return this.age;
		}
		const age_upper = this.age_guess_upper;
		const age_lower = this.age_guess_lower;
		return 0 < age_upper && 0 < age_lower && age_lower <= age_upper ? (age_upper + age_lower)/2 : 0;
	}
	get age_guess_lower(){
		if (this.age){
			return this.age;
		}
		const children = this.children_recursive;
		return children ? Math.max(...children.map(t => t.age_guess_lower)) : 0;
	}
	get age_guess_upper(){
		if (this.age){
			return this.age;
		}
		const parent = this.parent;
		return parent ? this.parent.age_guess_upper : 0;
	}
	/** @param {number} year; @returns {boolean} */
	alive(year){
		return this.extinct ? (this.age && year <= this.age && (this.age_end || this.age) <= year)
			: (!year || year <= this.age);
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
				const oa_url = authority.original_authority_wiki || original_authority;
				authority_elem.innerHTML += `<a href="https://en.wikipedia.org/wiki/${oa_url}">${original_authority}</a>`;
				const year = authority.year;
				if (year){
					authority_elem.innerHTML += `, ${year}`;
				}
				if (current_authority){
					const ca_url = authority.current_authority_wiki || current_authority;
					authority_elem.innerHTML += `) <a href="https://en.wikipedia.org/wiki/${ca_url}">${current_authority}</a>`;
				}
			}

		}
		return authority_elem;
	}
	get children(){
		return Taxon.taxa.filter(t => t.parent_id === this.name);
	}
	get children_recursive(){
		return Taxon.taxa.filter(t => t.parent_recursive.includes(this))
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
		// rank
		const b = document.createElement('b');
		b.innerHTML = capitalizeFirstLetter(rank) + ' ';
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
		title.appendChild(this.age_elem);
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
		return this.rank === 'kingdom' ? this : (p => p && p.kingdom)(this.parent);
	}
	get parent(){
		return Taxon.fromString(this.parent_id);
	}
	get pName(){
		return capitalizeFirstLetter(this.name);
	}
	/** @param {string} s */
	static fromString(s){
		const o = Taxon.taxa.find(t => t.name === s);
		if (typeof o === 'undefined' && s !== '*'){
			console.warn(`invalid taxon: ${s}`);
		}
		return o;
	}
	static preload_parent_recursive(){
		const start_time = new Date();
		// init roots
		// console.debug(Taxon.taxa.length);
		Taxon.taxa.filter(t => t.parent_id === '*').forEach(root => {
			// console.debug(`initializing parent_recursive for root ${root.name}`);
			root.parent_recursive = [];
		})
		// go through this iteratively
		const todo = Taxon.taxa.map(t => t);
		let prev_len;
		while (todo.length !== prev_len){
			prev_len = todo.length;
			const todo_clone = todo.map(x => x);
			todo_clone.forEach(t => {
				const parent = t.parent;
				if (!parent){
					todo.splice(todo.indexOf(t), 1);
				}
				else if (typeof parent.parent_recursive !== 'undefined'){
					t.parent_recursive = [parent].concat(...parent.parent_recursive);
					todo.splice(todo.indexOf(t), 1);
				}
			});
		}
		const end_time = new Date();
		const time = end_time - start_time;
		console.info(`Taxon.preload_parent_recursive took ${time} ms.`);
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
					'ME': 'Middle East', // excl. Africa, includes Iran and Asian Turkey
				'EU': 'Europe',
		// alternatively
		'NH': 'Northern Hemisphere',
		'SH': 'Southern Hemisphere',
		// oceans
		'WO': 'World Ocean',
			'AL': 'Atlantic Ocean',
			'IO': 'Indian Ocean',
			'PA': 'Pacific Ocean',
			'SO': 'Southern Ocean',
};

// helper functions
/** @param {number} age */
function getAge(age){
	if (1 <= age){
		return age + ' Mya';
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
	if (typeof ages === 'undefined' || typeof lifeData === 'undefined'){
		console.debug('awaiting ages.js and life_data.js ... sleeping 100 ms');
		return setTimeout(main, 100);
	}
	if (!main.preprocessed){
		main.preprocess();
	}
	if (document.readyState === 'loading'){
		console.debug('awaiting document to load ... sleeping 100 ms');
		return setTimeout(main, 100);
	}
	console.log('Loading life.js ...');
	// print appropriate text to toggle button
	refreshButtons();
	// create DOM objects...
	Taxon.taxa.forEach(taxon => taxon.elem);
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
	// add search enter key thing
	// https://stackoverflow.com/a/45650898
	document.getElementById("search_clade").addEventListener("keyup", event => {
		if(event.key !== "Enter") return;
		searchButton();
		event.preventDefault();
	});
	// stat elem
	stat_elem.init();
	// bonus goodies
	if (window.location.href.slice(0, 4) === 'file') {
		stats();
		verify();
	}
}
/** functions that do NOT require DOM */
main.preprocess = () => {
	console.log('Preprocessing life.js ...');
	// first, add everything in lifeData to objects
	lifeData.forEach(x => new Taxon(x));
	// preprocessing...
	Taxon.preload_parent_recursive();
	main.preprocessed = true;
};
main.preprocessed = false;

const stat_elem = {
	// taxon categorizer
	cat: {
		colors: {
			animal: 'pink',
			archaea: 'darkgrey',
			bacteria: 'lightgrey',
			fungus: 'lightblue',
			plant: 'lightgreen',
			protozoan: 'khaki',
		},
		/** @param {Taxon} taxon */
		cat(taxon){
			const parents = taxon.parent_recursive.map(t => t.name);
			if (parents.includes('animalia')){
				return 'animal';
			}
			else if (parents.includes('plantae')){
				return 'plant';
			}
			else if (parents.includes('fungi')){
				return 'fungus';
			}
			else if (parents.includes('eukaryota')){
				return 'protozoan';
			}
			else if (parents.includes('archaea')){
				return 'archaea';
			}
			else {
				return 'bacteria';
			}
		}
	},
	elem: {
		/** @returns {HTMLDivElement} */
		get container(){
			return document.getElementById('stats_container');
		},
		/** @returns {HTMLInputElement} */
		get input(){
			return document.getElementById('stats_age_input');
		},
		/** @param {string} x; @returns {HTMLDivElement} */
		spec(x){
			return document.getElementById(`spec-${x}`);
		},
	},
	init(){
		const container = this.elem.container;
		this.specs.forEach(spec => {
			const spec_elem = document.createElement('div');
			spec_elem.id = `spec-${spec}`;
			spec_elem.classList.add('spec');
			container.appendChild(spec_elem);
		});
		this.refresh();
	},
	max_len: 10,
	refresh(){
		const year = this.year;
		const taxa = Taxon.taxa.filter(t => t.stats && t.alive(year));
		this.specs.forEach(spec => {
			const unit = this.unit[spec];
			const elem = this.elem.spec(spec);
			elem.innerHTML = '';
			const h = document.createElement('h3');
			h.innerHTML = capitalizeFirstLetter(spec).replaceAll('_', ' ');
			elem.appendChild(h);
			const filtered_taxa = taxa.filter(t => typeof t.stats[spec] === 'number');
			const top = filtered_taxa.sort((a, b) => a.stats[spec] - b.stats[spec]).reverse().slice(0, this.max_len);
			const ol = document.createElement('ol');
			elem.appendChild(ol);
			top.forEach(t => {
				const li = document.createElement('li');
				li.appendChild(t.a);
				li.appendChild(document.createTextNode(`: ${t.stats[spec]} ${unit}`)) // todo - make fancier
				const category = this.cat.cat(t);
				li.style.backgroundColor = this.cat.colors[category];
				li.title = `${capitalizeFirstLetter(category)} (${capitalizeFirstLetter(t.parent_id)})`;
				ol.appendChild(li);
			});
		});
	},
	// current specs: HEIGHT, LENGTH, SPEED, WEIGHT
	specs: ['height', 'length', 'speed', 'weight', 'bite_force', 'encephalization_quotient', 'jump', 'lifespan'],
	unit: {
		bite_force: 'N',
		encephalization_quotient: '',
		height: 'm',
		jump: 'm',
		length: 'm',
		lifespan: 'yr',
		speed: 'm/s',
		weight: 'kg',
	},
	get year(){
		return +this.elem.input.value;
	},
};

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
	const MISSING_AGES_KINGDOM_WHITELIST = ['animalia', 'embryophyta'].map(Taxon.fromString);
	let population = 0;
	const missing = Taxon.taxa.filter(t => MISSING_AGES_KINGDOM_WHITELIST.includes(t.kingdom) && ++population && !lifeData[t.i].hasOwnProperty('age')).map(t => t.url);
	console.debug(`missing ages in plants (s.s.) and animals: ${Math.round(100 * missing.length / population)}% of ${population}`);
	console.warn(missing);
	// age is older than parent
	console.debug("age is older than parent:");
	Taxon.taxa.filter(t => t.parent && t.parent.age > 0 && t.age > t.parent.age).forEach(t => {
		const r = t.age / t.parent.age - 1;
		console.warn(`${t.name} (${t.age}) older than its parent ${t.parent.name} (${t.parent.age}) - ${Math.round(r * 100)}%`);
	});
	// extinct but no age or age_end tag
	console.debug("missing age tags for extinct taxa:");
	Taxon.taxa.filter(t => t.extinct && !(t.age && t.age_end)).forEach(t => {
		console.warn(`${t.name} (${t.url}) is extinct but is missing an age tag (${t.age}) or an age_end tag (${t.age_end})`);
	});
	// too many children
	const MAX_CHILDREN = 4;
	const FORGIVEN_RANKS = ['genus'];
	console.debug(`too many direct children (>${MAX_CHILDREN}):`);
	Taxon.taxa.filter(t => !FORGIVEN_RANKS.includes(t.rank) && MAX_CHILDREN < t.children.length).forEach(t => {
		console.warn(`${t.name} (${t.url}) has too many direct children (${t.children.length}: ${t.children.map(c => c.name).join(', ')}) - are we sure it isn't divided further?`);
	});
	// range: EQ is DEPRECATED!!!!
	console.debug(`range: EQ is deprecated:`);
	Taxon.taxa.forEach(t => {
		const range = lifeData[t.i].range;
		if (range && range.includes('eq')) {
			console.warn(`${t.name} (${t.url}) has EQ in range, which is deprecated (use the continent(s) instead!)`);
		}
	});
	// age can be guessed
	console.debug(`age can be guessed (make sure these actually don't have ages):`);
	const age_can_be_guessed = Taxon.taxa.filter(t => !t.age && t.age_guess);
	if (0 < age_can_be_guessed.length){
		console.warn(age_can_be_guessed.map(t => t.url));
	}
	// extinct childless taxa without stats
	console.debug(`childless taxa without stats:`)
	const ectwos = Taxon.taxa.filter(t => !t.stats && !t.children.length);
	if (ectwos.length) {
		console.warn(ectwos);
	}
}

main();