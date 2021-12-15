/* exported main */
/* global data, phones, random, range, syllables, wordLists */
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
		const h2 = document.createElement('h2');
		h2.innerHTML = 'Phonology';
		div.appendChild(h2);
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
		// create vowel table...
		const vowelTable = document.createElement('table');
		div.appendChild(vowelTable);
		// determine necessary columns (POA) and rows (MOA)
		const vy = data.vowels.dy.filter(
			y => phonology.some(p => p.primary.properties.openness === y));
		const vx = data.vowels.dx.filter(
			x => phonology.some(p => p.primary.properties.backness === x));
		// create cells for that...
		// create headers...
		const vowelHeaderRow = document.createElement('tr');
		vowelTable.appendChild(vowelHeaderRow);
		vowelHeaderRow.appendChild(document.createElement('th')); // blank corner
		vx.forEach(x => {
			const cell = document.createElement('th');
			cell.innerHTML = x;
			vowelHeaderRow.appendChild(cell);
		});
		// create rows...
		vy.forEach(y => {
			const row = document.createElement('tr');
			vowelTable.appendChild(row);
			const header = document.createElement('th');
			header.innerHTML = y;
			row.appendChild(header);
			// now create each cell in this row...
			vx.forEach(x => {
				const cell = document.createElement('td');
				row.appendChild(cell);
				// put all applicable phones in this cell...
				phonology.filter(p => p.primary.properties.openness === y
					&& p.primary.properties.backness === x).forEach(p => {
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
	 * @param {string} syllableStructureName
	*/
	constructor(syllableStructure, mandatory, syllableStructureName){
		this.syllableStructure = syllableStructure;
		this.mandatory = mandatory;
		this.syllableStructureName = syllableStructureName;
	}
	get html(){
		const div = document.createElement('div');
		// header
		const h3 = document.createElement('h3');
		h3.innerHTML = 'Phonotactics';
		div.appendChild(h3);
		// show syllable structure...
		const span = document.createElement('span');
		span.innerHTML = `The syllable structure is ${this.syllableStructureName}`;
		div.appendChild(span);
		return div;
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

class Morphology {
	/**
	 * morphology data
	 * @param {string[]} cases eg. ERG, DAT, ...
	 * @param {Word[]} caseEndings for the cases
	 * @param {string[]} numbers eg. S, PL ...
	*/
	constructor(cases, caseEndings, numbers){
		this.cases = cases;
		this.caseEndings = caseEndings;
		this.numbers = numbers;
	}
	get html(){
		// todo
		const div = document.createElement('div');
		const h2 = document.createElement('h2');
		h2.innerHTML = 'Morphology';
		div.appendChild(h2);
		// cases
		const cases = document.createElement('span');
		const caseString = this.cases.map((c, i) => `${c} (-${this.caseEndings[i].html.outerHTML})`)
			.join('<br>');
		cases.innerHTML = `Cases: ${caseString}<br><br>`;
		div.appendChild(cases);
		// numbers
		const numbers = document.createElement('span');
		numbers.innerHTML = `${this.numbers.join()}`;
		div.appendChild(numbers);
		return div;
	}
	static generate(phonology, phonotactics){
		const c = [...random.choice(data.cases.alignment)]; // copy template
		// okay, now add other cases
		const outsOther = range(data.cases.other.length); // 0 ... n
		const distrOther = random.weightedChoice(outsOther, outsOther.map(n => Math.pow(0.5, n)));
		data.cases.other.slice(0, distrOther).forEach(cc => c.push(cc));
		// weighted distribution...
		const outs = range(1, data.cases.numbers.length-1); // 1 ... n
		const distr = random.weightedChoice(outs, outs.map(n => Math.pow(0.5, n)));
		const numbers = data.cases.numbers.slice(0, distr);
		// todo add other cases...
		return new Morphology(
			c,
			Morphology.generateEndings(phonology, phonotactics, c),
			numbers
		);
	}
	/**
	 * @param {Phonotactics} phonotactics
	 * @param {string[]} cases
	 */
	static generateEndings(phonology, phonotactics, cases){
		// todo also prefixes... and clitics...
		// the first case is blank 50%.
		return cases.map((_, i) => {
			if (i === 0 && random.random() < 0.5)
				return new Word([]);
			return phonotactics.randomWord(phonology, 0.1);
		});
	}
}

class Syntax {
	/**
	 * syntax rules
	 * @param {idk yet} properties word order n stuff
	*/
	constructor(properties){
		this.properties = properties;
	}
	get html(){
		// div
		const div = document.createElement('div');
		// header
		const h2 = document.createElement('h2');
		h2.innerHTML = 'Syntax';
		div.appendChild(h2);
		// list stufffff
		const ul = document.createElement('ul');
		div.appendChild(ul);
		for (const key in this.properties){
			const li = document.createElement('li');
			const s = this.properties[key].map(t => t[0]).join();
			li.innerHTML = `${key} = ${s}`; //todo shuffle
			ul.appendChild(li);
		}
		return div;
	}
	static generate(){
		const orders = {};
		for (const key in data.order){
			// console.debug(key);
			orders[key] = random.shuffle(data.order[key]); //todo shuffle
		}
		return new Syntax(orders);
	}
}

class Language {
	/**
	 * currently, languages have only phonologies
	 * @param {Phoneme[]} phonology set of phonemes
	 * @param {Phonotactics} phonotactics
	 * @param {Syntax} syntax
	 * @param {Morphology} morphology
	*/
	constructor(phonology, phonotactics, syntax, morphology){
		this.phonology = phonology;
		this.phonotactics = phonotactics;
		this.syntax = syntax;
		this.morphology = morphology;
	}
	get vocabHTML(){
		const div = document.createElement('div');
		const vocabHeader = document.createElement('h2');
		vocabHeader.innerHTML = 'Vocabulary';
		div.appendChild(vocabHeader);
		const wordlist = document.createElement('ul');
		wordlist.id = 'wordlist';
		wordLists.swadesh.map(def => [def, this.phonotactics.randomWord(this.phonology)])
			.forEach((dwPair, i) => {
				const def = dwPair[0];
				const word = dwPair[1];
				const li = document.createElement('li');
				wordlist.appendChild(li);
				li.innerHTML = `${def} = `;
				li.appendChild(word.html);
				// title
				if (i === wordLists.swadesh.length-1)
					document.getElementById('language_name').appendChild(word.html);
			});
		div.appendChild(wordlist);
		return div;
	}
	print(){
		// show tables n sheit
		const doc = document.getElementById('body');
		// header
		const h1 = document.createElement('h1');
		h1.innerHTML = 'The ';
		const languageName = document.createElement('span');
		languageName.id = 'language_name';
		h1.appendChild(languageName);
		h1.innerHTML += ' language';
		doc.appendChild(h1);
		// phonology
		doc.appendChild(Phoneme.generateHTML(this.phonology));
		// phonotactics
		doc.appendChild(this.phonotactics.html);
		// vocab
		doc.appendChild(this.vocabHTML);
		// morphology
		doc.appendChild(this.morphology.html);
		// syntax
		doc.appendChild(this.syntax.html);
	}
	static generate(){
		const phonology = Phoneme.generatePhonology();
		const phonotactics = Phonotactics.generate();
		return new Language(
			phonology,
			phonotactics,
			Syntax.generate(),
			Morphology.generate(phonology, phonotactics)
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