/* exported main */
/* global authorData, categoryData, entryData, languageData, meaningData, sourceData */
'use strict';

/** @type {HTMLBodyElement} */
const body = document.getElementById('body');

class Clickable {
	constructor(name){
		this.name = name;
	}
	get span(){
		const elem = document.createElement('span');
		elem.classList.add('clickable');
		elem.innerHTML = this.name;
		elem.onclick = () => this.go();
		return elem;
	}
	go(){
		body.innerHTML = '';
		body.appendChild(this.div);
	}
}

class Author extends Clickable {
	constructor(name){
		super(name);
		Author.list.push(this);
	}
	static fromName(name){
		return Author.list.find(x => x.name === name);
	}
	static parseData(o){
		new Author(o.name);
	}
}
/** @type {Author[]} */
Author.list = [];

class Source extends Clickable {
	constructor(name, author='', url='', date=''){
		super(name);
		this.author = Author.fromName(author);
		this.url = url;
		this.date = date;
		Source.list.push(this);
	}
	static fromName(name){
		return Source.list.find(x => x.name === name);
	}
	static parseData(o){
		new Source(o.name, o.author, o.url, o.date);
	}
}
/** @type {Source[]} */
Source.list = [];

class Language extends Clickable {
	constructor(name, parent, location, period){
		super(name);
		/** @type {Language} - parsed after loading */
		this.parent = parent;
		this.location = location;
		this.period = period;
		Language.list.push(this);
	}
	/** @param {string} s */
	parseParent(){
		if (!this.parent)
			return;
		this.parent = Language.fromName(this.parent);
	}
	static fromName(name){
		return Language.list.find(x => x.name === name);
	}
	static parseData(o){
		new Language(o.name, o.parent, o.location, o.period);
	}
}
/** @type {Language[]} */
Language.list = [];

class Category extends Clickable {
	constructor(name, categories){
		super(name);
		/** @type {Category[]} - parsed afterwards */
		this.categories = categories;
		Category.list.push(this);
	}
	parseCategories(){
		if (!this.categories)
			return;
		this.categories = this.categories.split(';').map(c => Category.fromName(c));
	}
	static fromName(name){
		return Category.list.find(x => x.name === name);
	}
	static parseData(o){
		new Category(o.name, o.categories);
	}
}
/** @type {Category[]} */
Category.list = [];

class Meaning extends Clickable {
	constructor(name, categories){
		super(name);
		this.categories = categories.split(';').map(c => Category.fromName(c));
		Meaning.list.push(this);
	}
	static fromName(name){
		return Meaning.list.find(x => x.name === name);
	}
	static parseData(o){
		new Meaning(o.name, o.categories);
	}
}
/** @type {Meaning[]} */
Meaning.list = [];

class Entry extends Clickable {
	constructor(language, word, meanings, etymology, source, notes){
		super(word);
		this.language = Language.fromName(language);
		this.word = word;
		this.meanings = Entry.parseMeanings(meanings);
		/** @type {Entry[]} - this will be parsed from a string AFTER all entries are loaded */
		this.etymology = etymology;
		this.source = Source.fromName(source);
		this.notes = notes;
		Entry.list.push(this);
	}
	get div(){
		/** @type {HTMLDivElement} */
		const elem = document.createElement('div');
		elem.classList.add('entry');
		elem.id = `${this.language.name}/${this.word}/div`;
		const header = document.createElement('h1');
		header.innerHTML = this.word;
		elem.appendChild(header);
		// lang button
		elem.appendChild(this.language.span);
		// source button
		elem.appendChild(this.source.span);
		// etymology button
		elem.appendChild(this.etymologyDiv);
		const ul = document.createElement('ul');
		this.meanings.forEach(m => {
			const li = document.createElement('li');
			if (m)
				li.appendChild(m.span);
			else
				li.innerHTML = m;
			ul.appendChild(li);
		});
		elem.appendChild(ul);
		// note button
		if (this.notes){
			const notes = document.createElement('p');
			notes.innerHTML = 'Notes: ' + this.notes;
			elem.appendChild(notes);
		}
		return elem;
	}
	get etymologyDiv(){
		const elem = document.createElement('div');
		elem.innerHTML = 'Etymology: ';
		this.etymology.forEach(e => e ? elem.appendChild(e.span) : elem.innerHTML+=undefined);
		return elem;
	}
	parseEtymology(){
		if (!this.etymology)
			return;
		this.etymology = this.etymology.split(';').map(name => Entry.fromName(name));
	}
	static fromName(name){
		return Entry.list.find(x => x.name === name);
	}
	static parseData(o){
		new Entry(o.language, o.word, o.meanings, o.etymology, o.source, o.notes);
	}
	/** @param {string} s */
	static parseMeanings(s){
		// eg. meanings1;meaning2;...
		return s.split(';').map(name => Meaning.fromName(name));
	}
}
/** @type {Entry[]} */
Entry.list = [];

function main(){
	// load shit
	authorData.forEach(o => Author.parseData(o));
	sourceData.forEach(o => Source.parseData(o));
	languageData.forEach(o => Language.parseData(o));
	categoryData.forEach(o => Category.parseData(o));
	meaningData.forEach(o => Meaning.parseData(o));
	entryData.forEach(o => Entry.parseData(o));
	// construct etymology mappings after all entries loaded
	Category.list.forEach(c => c.parseCategories());
	Entry.list.forEach(e => e.parseEtymology());
	Language.list.forEach(l => l.parseParent());
	// display first entry just to start off...
	Entry.list[0].go();
}