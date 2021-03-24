/* exported main */
/* global authorData, categoryData, entryData, languageData, meaningData, sourceData */
'use strict';

class Author {
	constructor(name){
		this.name = name;
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

class Source {
	constructor(name, author='', url='', date=''){
		this.name = name;
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

class Language {
	constructor(name, parent, location, period){
		this.name = name;
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

class Category {
	constructor(name, categories){
		this.name = name;
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

class Meaning {
	constructor(name, categories){
		this.name = name;
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

class Entry {
	constructor(language, word, meanings, etymology, source, notes){
		this.language = Language.fromName(language);
		this.word = word;
		this.meanings = Entry.parseMeanings(meanings);
		/** @type {Entry[]} - this will be parsed from a string AFTER all entries are loaded */
		this.etymology = etymology;
		this.source = Source.fromName(source);
		this.notes = notes;
		Entry.list.push(this);
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
}