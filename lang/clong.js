/* exported main */
/* global data, phones, random, range, syllables */
'use strict';


class Phone {
	/**
	 * individual phones usable by languages as phonemes or allophones
	 * @param {string} name eg 'p'
	 * @param {object} properties info about c/v, voicedness, ...
	*/
	constructor(name, properties){
		this.name = name;
		this.properties = properties;
		Phone.list.push(this);
	}
	get html(){
		const elem = document.createElement('span');
		elem.classList.add('phone');
		elem.innerHTML = this.name;
		return elem;
	}
	/** @returns {Phone[]} */
	get implications(){
		if ('implications' in this.properties)
			return this.properties.implications.map(s => Phone.fromString(s));
		return [];
	}
	testIfGenerates(){
		return random.random() < this.properties.freq;
	}
	static fromString(s){
		return Phone.list.find(p => p.name === s);
	}
	static load(){
		// todo
		phones.forEach(phoneDatum => {
			new Phone(phoneDatum.name, phoneDatum.properties);
		});
	}
}
/** @type {Phone[]} */
Phone.list = [];


class Phoneme {
	/**
	 * phonemes of a language
	 * @param {Phone} primary eg 'p'
	 * @param {Allophone[]} allophones allophones and their conditions
	*/
	constructor(primary, allophones){
		this.primary = primary;
		this.allophones = allophones;
	}
	static generatePhonology(){
		// todo
		const attempt = Phone.list.filter(p => p.testIfGenerates());
		while (Phoneme.verifyImplications(attempt)){
			// keep trying
		}
		return attempt.map(p => new Phoneme(p));
	}
	/** @param {Phone[]} attempt */
	static verifyImplications(attempt){
		const failures = attempt.filter(
			p => p.implications.some(i => !attempt.includes(i)));
		if (!failures.length)
			return false;
		// otherwise, fix for next attempt:
		failures.forEach(fail => {
			fail.implications.forEach(implication => {
				if (!attempt.includes(implication))
					attempt.push(implication);
			});
		});
		return true;
	}
	/** @param {Phoneme[]} phonology */
	static generateHTML(phonology){
		// todo
		const div = document.createElement('div');
		div.id = 'phonology';
		const consonantTable = document.createElement('table');
		div.appendChild(consonantTable);
		consonantTable.id = 'consonants';
		// determine necessary columns (POA) and rows (MOA)
		const moa = data.MOA.filter(
			manner => phonology.some(p => p.primary.properties.manner === manner));
		const poa = data.POA.filter(
			place => phonology.some(p => p.primary.properties.place === place));
		// create cells for that...
		// create headers...
		const headerRow = document.createElement('tr');
		consonantTable.appendChild(headerRow);
		headerRow.appendChild(document.createElement('th')); // blank corner
		poa.forEach(place => {
			const cell = document.createElement('th');
			cell.innerHTML = place;
			headerRow.appendChild(cell);
		});
		// create rows...
		moa.forEach(manner => {
			const row = document.createElement('tr');
			consonantTable.appendChild(row);
			const header = document.createElement('th');
			header.innerHTML = manner;
			row.appendChild(header);
			// now create each cell in this row...
			poa.forEach(place => {
				const cell = document.createElement('td');
				row.appendChild(cell);
				// put all applicable phones in this cell...
				phonology.filter(p => p.primary.properties.manner === manner
					&& p.primary.properties.place === place).forEach(p => {
					cell.appendChild(p.primary.html);
				});
			});
		});
		return div;
	}
}

class Phonotactics {
	/**
	 * phonotactics. used to generate and validate syllables.
	 * @param {(Phone => boolean)[]} syllableStructure uses data.filters
	 * @param {boolean[]} mandatory which slots are mandatory/optional
	*/
	constructor(syllableStructure, mandatory){
		this.syllableStructure = syllableStructure;
		this.mandatory = mandatory;
	}
	/** @param {Phoneme[]} phonology */
	randomSyllable(phonology){
		/** @type {Phoneme[][]} */
		const valids = this.syllableStructure.map(f =>
			phonology.filter(p => f(p.primary)))
			// remove optionals
			.filter((_, i) => this.mandatory[i] || random.random() < 0.6);
		/** @type {Phoneme[]} */
		const choices = valids.map(options => random.choice(options));
		return choices;
	}
	randomWord(phonology, dropoff = 0.5){
		const word = this.randomSyllable(phonology);
		while (random.random() < dropoff)
			this.randomSyllable(phonology).forEach(p => word.push(p));
		return new Word(word);
	}
	static generate(){
		// for now, only this:
		return new Phonotactics(...random.choice(syllables));
	}
}

class Word {
	/**
	 * word. todo: add meaning
	 * @param {Phoneme[]} phonemes each phoneme in word
	*/
	constructor(phonemes){
		this.phonemes = phonemes;
	}
	get html(){
		const container = document.createElement('span');
		container.classList.add('word');
		this.phonemes.forEach(p => container.appendChild(p.primary.html));
		return container;
	}
}

class Language {
	/**
	 * currently, languages have only phonologies
	 * @param {Phoneme[]} phonology set of phonemes
	 * @param {Phonotactics} phonotactics
	*/
	constructor(phonology, phonotactics){
		this.phonology = phonology;
		this.phonotactics = phonotactics;
	}
	print(){
		// show tables n sheit
		const doc = document.getElementById('body');
		doc.appendChild(Phoneme.generateHTML(this.phonology));
		// list of ten random words...
		const wordlist = document.createElement('ul');
		doc.appendChild(wordlist);
		wordlist.id = 'wordlist';
		range(50).map(() => this.phonotactics.randomWord(this.phonology))
			.forEach(word => {
				const li = document.createElement('li');
				wordlist.appendChild(li);
				li.appendChild(word.html);
			});
	}
	static generate(){
		return new Language(
			Phoneme.generatePhonology(),
			Phonotactics.generate()
		);
	}
}

function main(){
	// load all data
	Phone.load();
	const l = Language.generate();
	console.debug(l);
	l.print();
}