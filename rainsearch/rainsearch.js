/**
 * RainSearch
 * a tool to search the Rain comic for specific things
 * Mocha, 2023
 * todo:
 * - character checkboxes
 * - hairstyle option for rain?
 * - date published
 * - in-universe date???
 * - chapter
 * - setting
 */
/* exported updateResults */
/* global chardata, raindata */

const NBSP = String.fromCharCode(160);

/**
 * @param {string} id
 * @param {boolean} checked
 * @param {HTMLElement} innerNode
 */
function checkbox(id, checked = false, innerNode = undefined){
	const label = document.createElement('label');
	if (innerNode)
		label.appendChild(innerNode);
	// label.style.color = this.color; todo gender? sexuality????
	label.appendChild(document.createTextNode(NBSP));
	const input = document.createElement('input');
	label.appendChild(input);
	input.type = 'checkbox';
	input.checked = checked;
	label.for = input.id = input.name = id;
	label.classList.add('button');
	return label;
}

class Char {
	/**
	 * https://rain.thecomicseries.com/characters/
	 * @param {string} id - for internal use only
	 * @param {string} name
	 * @param {number} age
	 * @param {string} gender
	 * @param {string} sexuality
	 */
	constructor(id, name, age, gender, sexuality){
		Char.chars.push(this);
		/** @type {string} */
		this.id = id;
		/** @type {string} */
		this.name = name;
		/** @type {number} */
		this.age = age;
		/** @type {string} */
		this.gender = gender;
		/** @type {string} */
		this.sexuality = sexuality;
	}
	get checkboxId(){
		return 'char_' + this.id;
	}
	get elem(){
		const innerNode = document.createElement('span');
		innerNode.innerHTML = this.name.replace(/ /g, '&nbsp;') + NBSP
			+ `(${Comic.comics.filter(comic => comic.chars.includes(this)).length})`;
		return checkbox(this.checkboxId, false, innerNode);
	}
	/** @returns {boolean} */
	get selected(){
		return document.getElementById(this.checkboxId).checked;
	}
	static fromId(id){
		return Char.chars.find(c => c.id === id);
	}
	static fromObj(o){
		return new Char(o.id, o.name, o.age, o.gender, o.sexuality);
	}
}
/** @type {Char[]} */
Char.chars = [];

class Comic {
	/**
	 * @param {string} url
	 * @param {string} src
	 * @param {string} title
	 * @param {string} chapter
	 * @param {Char[]} chars
	 * @param {string[]} settings
	 * @param {string[]} tags
	 * @param {number} year
	 */
	constructor(url, src, title, chapter, chars, settings, tags, year){
		Comic.comics.push(this);
		/** @type {string} */
		this.url = url;
		/** @type {string} */
		this.src = src;
		/** @type {string} */
		this.title = title;
		/** @type {string} */
		this.chapter = chapter;
		if (!Data.chapters.includes(chapter))
			Data.chapters.push(chapter);
		/** @type {Char[]} */
		this.chars = chars;
		/** @type {string[]} */
		this.settings = settings;
		settings.forEach(s => {
			if (!Data.settings.includes(s))
				Data.settings.push(s);
		});
		/** @type {string[]} */
		this.tags = tags;
		tags.forEach(t => {
			if (!Data.tags.includes(t))
				Data.tags.push(t);
		});
		/** @type {number} */
		this.year = year;
	}
	get id(){
		return Comic.comics.indexOf(this);
	}
	get img(){
		const a = document.createElement('a');
		a.href = this.url;
		const elem = document.createElement('img');
		elem.height = 100;
		elem.src = this.src;
		a.appendChild(elem);
		return a;
	}
	get li(){
		const elem = document.createElement('li');
		elem.value = this.id;
		elem.appendChild(this.img);
		elem.appendChild(document.createTextNode(`${this.chapter} - `));
		const a = document.createElement('a');
		a.href = this.url;
		a.innerHTML = this.title;
		elem.appendChild(a);
		return elem;
	}
	static fromObj(o){
		return new Comic(o.url, o.src, o.title, o.chapter,
			o.chars.map(Char.fromId) || [],
			o.settings || [],
			o.tags || [],
			o.year);
	}
}
/** @type {Comic[]} */
Comic.comics = [];

function main(){
	// parse comics and chars
	chardata.forEach(Char.fromObj);
	console.info(`rainsearch.js parsed ${Char.chars.length} chars`);
	raindata.forEach(Comic.fromObj);
	console.info(`rainsearch.js parsed ${Comic.comics.length} comics`);
	// create UI
	// chars
	const charFilters = document.getElementById('chars');
	Char.chars.forEach(c => {
		charFilters.appendChild(c.elem);
		charFilters.appendChild(document.createTextNode(' '));
	});
	// chapters
	Data.chapters.sort();
	const chapters = document.getElementById('chapters');
	Data.chapters.forEach(c => {
		const elem = checkbox('ch_' + c.replace(' ', '_'), true, document.createTextNode(c));
		chapters.appendChild(elem);
		chapters.appendChild(document.createTextNode(' '));
	});
	console.info(`rainsearch.js collated ${Data.chapters.length} chapters`);
	// tags
	Data.tags.sort();
	const tags = document.getElementById('tags');
	Data.tags.forEach(t => {
		const elem = checkbox('t_' + t.replace(' ', '_'), false, document.createTextNode(t));
		tags.appendChild(elem);
		tags.appendChild(document.createTextNode(' '));
	});
	console.info(`rainsearch.js collated ${Data.tags.length} tags`);
	// todo settings
	Data.settings.sort();
	const settings = document.getElementById('settings');
	Data.settings.forEach(s => {
		const elem = checkbox('s_' + s.replace(' ', '_'), true, document.createTextNode(s));
		settings.appendChild(elem);
		settings.appendChild(document.createTextNode(' '));
	});
	console.info(`rainsearch.js collated ${Data.settings.length} settings`);
}

const Data = {
	/** @type {string[]} */
	chapters: [],
	selected: {
		get chars(){
			return Char.chars.filter(c => c.selected);
		},
		get chapters(){
			return Data.chapters.filter(c => document.getElementById('ch_' + c.replace(' ', '_')).checked);
		},
		get settings(){
			return Data.settings.filter(c => document.getElementById('s_' + c.replace(' ', '_')).checked);
		},
		get tags(){
			return Data.tags.filter(c => document.getElementById('t_' + c.replace(' ', '_')).checked);
		},
	},
	/** @type {string[]} */
	settings: [],
	/** @type {string[]} */
	tags: [],
};

function updateResults(){
	const results = Comic.comics
		// must include every checked char
		.filter(comic => Data.selected.chars.every(char => comic.chars.includes(char)))
		// must include at least one checked chapter
		.filter(comic => Data.selected.chapters.includes(comic.chapter))
		// must include every checked tag
		.filter(comic => Data.selected.tags.every(t => comic.tags.includes(t)))
		// must include at least one checked setting
		.filter(comic => Data.selected.settings.some(s => comic.settings.includes(s)));
	const resultElem = document.getElementById('results');
	resultElem.innerHTML = '';
	results.forEach(r => resultElem.appendChild(r.li));
}

main();
/**
 * todo:
 * - tag filtring
 * - setting filtering
 * - result count
 */