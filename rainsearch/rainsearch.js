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
		const label = document.createElement('label');
		label.innerHTML = this.name.replace(' ', '&nbsp;');
		const count = document.createElement('span');
		count.id = this.checkboxId + '_count';
		count.innerHTML = ` (${Comic.comics.filter(comic => comic.chars.includes(this)).length})`;
		label.appendChild(count);
		// label.style.color = this.color; todo gender? sexuality????
		const input = document.createElement('input');
		label.appendChild(input);
		input.type = 'checkbox';
		// input.checked = true;
		label.for = input.id = input.name = this.checkboxId;
		label.classList.add('button');
		return label;
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
		/** @type {Char[]} */
		this.chars = chars;
		/** @type {string[]} */
		this.settings = settings;
		/** @type {string[]} */
		this.tags = tags;
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
	// todo create UI
	const charFilters = document.getElementById('chars');
	Char.chars.forEach(c => {
		charFilters.appendChild(c.elem);
		charFilters.appendChild(document.createTextNode(' '));
	});
}

const Data = {
	selected: {
		get chars(){
			return Char.chars.filter(c => c.selected);
		},
	},
};

function updateResults(){
	const results = Comic.comics
		// must include every checked char
		.filter(comic => Data.selected.chars.every(char => comic.chars.includes(char)));
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