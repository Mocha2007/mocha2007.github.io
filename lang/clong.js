/* exported main */
/* global data, phones, random, range, sum, syllables, wordLists */
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
		// pass/fail implications...
		for (const i in data.implications.phonology){
			const implication = data.implications.phonology[i];
			if (!implication(attempt)){
				// restart
				console.log(`PHONOLOGY FAILED IMPLICATION ${i}, REGEN...`);
				return Phoneme.generatePhonology();
			}
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
	get averageSyllableLength(){
		return sum(this.mandatory.map(x => x ? 1 : 0.5));
	}
	get averageWordLength(){
		return 4;
	}
	get defaultDropoff(){
		// 1-a/5; this means words will have a mean of 5 phonemes in them,
		// assuming each non-mandatory token has a 50/50 chance of appearing
		/*
		A : average word length
		a : average syll length
		d : syllable dropoff (each successive syll has a d chance of getting generated)

		A = 5 (based on English)
		A = sum(ad^n, 0, inf) = a/(1-d)

		5 = a/(1-d)
		5(1-d) = a
		5-5d=a
		5-a=5d

		SOLUTION 1-a/5=d
		*/
		return 1 - this.averageSyllableLength/this.averageWordLength;
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
	randomWord(phonology, dropoff = this.defaultDropoff){
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
	 * word.
	 * @param {Phoneme[]} phonemes each phoneme in word
	 * @param {string} meaning
	 * @param {string|false} affix
	*/
	constructor(phonemes, meaning, affix = false){
		this.phonemes = phonemes;
		this.meaning = meaning;
		this.affix = affix;
	}
	get html(){
		const container = document.createElement('span');
		container.classList.add('word');
		if (this.affix)
			container.innerHTML = Word.affixPatterns[this.affix]
				.replace('{stem}', '').replace('{aff}', this.string);
		else
			container.innerHTML = this.string;
		return container;
	}
	get htmlFull(){
		const container = document.createElement('span');
		container.classList.add('wordFull');
		container.innerHTML = `${this.meaning} = `;
		container.appendChild(this.html);
		return container;
	}
	get string(){
		return this.phonemes.map(p => p.primary.name).join('');
	}
}
Word.affixPatterns = {
	circum: '{aff}-{stem}-{aff}',
	pref: '{aff}-{stem}',
	suff: '{stem}-{aff}',
};

class Morphology {
	/**
	 * morphology data
	 * @param {Word[]} caseEndings for the cases eg. ERG, DAT, ...
	 * @param {Word[]} numbers eg. S, PL ...
	 * @param {Word[]} derivational eg. AUG, N>V, ...
	*/
	constructor(caseEndings, numbers, derivational){
		this.caseEndings = caseEndings;
		this.numbers = numbers;
		this.derivational = derivational;
	}
	get html(){
		const div = document.createElement('div');
		const h2 = document.createElement('h2');
		h2.innerHTML = 'Morphology';
		div.appendChild(h2);
		// cases
		const hCase = document.createElement('h3');
		hCase.innerHTML = 'Cases';
		div.appendChild(hCase);
		const cases = document.createElement('ul');
		this.caseEndings.forEach(c => {
			const li = document.createElement('li');
			li.appendChild(c.htmlFull);
			cases.appendChild(li);
		});
		div.appendChild(cases);
		// numbers
		const hNum = document.createElement('h3');
		hNum.innerHTML = 'Numbers';
		div.appendChild(hNum);
		const numbers = document.createElement('ul');
		this.numbers.forEach(n => {
			const li = document.createElement('li');
			li.appendChild(n.htmlFull);
			numbers.appendChild(li);
		});
		div.appendChild(numbers);
		// derivational
		const hDeriv = document.createElement('h3');
		hDeriv.innerHTML = 'Derivational Morphology';
		div.appendChild(hDeriv);
		const deriv = document.createElement('ul');
		this.derivational.forEach(affix => {
			const li = document.createElement('li');
			li.appendChild(affix.htmlFull);
			deriv.appendChild(li);
		});
		div.appendChild(deriv);
		return div;
	}
	static generate(phonology, phonotactics){
		const c = [...random.choice(data.cases.alignment)]; // copy template
		// OTHER CASES: okay, now add other cases
		const outsOther = range(data.cases.common.length); // 0 ... n
		/** @type {number} */
		const distrOther = random.weightedChoice(outsOther, outsOther.map(n => Math.pow(0.5, n)));
		data.cases.common.slice(0, distrOther).forEach(cc => c.push(cc));
		// GRAMMATICAL NUMBER: weighted distribution...
		const outs = range(1, data.cases.numbers.length-1); // 1 ... n
		/** @type {number} */
		const distr = random.weightedChoice(outs, outs.map(n => Math.pow(0.5, n)));
		/** @type {string[]} */
		const numbers = data.cases.numbers.slice(0, distr);
		// add other cases... (6 min)
		if (6 <= c.length)
			data.cases.rare.filter(() => random.random() < 1/4).forEach(x => c.push(x));
		// return
		return new Morphology(
			Morphology.generateEndings(phonology, phonotactics, c),
			Morphology.generateNumbers(phonology, phonotactics, numbers),
			Morphology.generateDerivational(phonology, phonotactics)
		);
	}
	/**
	 * @param {Phone[]} phonology
	 * @param {Phonotactics} phonotactics
	 */
	static generateDerivational(phonology, phonotactics){
		return data.morphology.derivational.filter(() => random.bool()).map(affix => {
			const w = phonotactics.randomWord(phonology, 0.1);
			w.meaning = affix;
			w.affix = 'suff';
			return w;
		});
	}
	/**
	 * @param {Phone[]} phonology
	 * @param {Phonotactics} phonotactics
	 * @param {string[]} cases
	 */
	static generateEndings(phonology, phonotactics, cases){
		return cases.map((c, i) => {
			let w;
			// the first case is blank 50%.
			if (i === 0 && random.bool())
				w = new Word([]);
			else
				w = phonotactics.randomWord(phonology, 0.1);
			w.meaning = c;
			w.affix = 'suff';
			return w;
		});
	}
	/**
	 * @param {Phone[]} phonology
	 * @param {Phonotactics} phonotactics
	 * @param {string[]} numbers
	 */
	static generateNumbers(phonology, phonotactics, numbers){
		return numbers.map((n, i) => {
			let w;
			// the first numbers is blank 50%.
			if (i === 0 && random.bool())
				w = new Word([]);
			else
				w = phonotactics.randomWord(phonology, 0.1);
			w.meaning = n;
			w.affix = 'suff';
			return w;
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
	static generate(maxFailureResolutions = 10){
		// first attempt at orders
		const orders = {};
		for (const key in data.order)
			orders[key] = random.shuffle(data.order[key]);
		// validate orders with implications
		let failures = 0;
		while (Syntax.verifyImplications(orders)){
			failures++;
			// keep trying
			// console.log('NEXT SYNTAX ATTEMPT', orders);
			// debugger;
			if (maxFailureResolutions < failures){
				// complete overhaul
				console.log('TOO MANY FAILURES, RESTARTING SYNTAX GEN...');
				return Syntax.generate();
			}
		}
		return new Syntax(orders);
	}
	/**  turns a property string back into an array for that property
	 * @param {string} category eg. "GenN" (the category of the order)
	 * @param {string} prop eg. "GenN" (the specific order)
	 * @returns {[string, string]}
	 */
	static propToArray(category, prop){
		let attempt;
		while ((attempt = random.shuffle(data.order[category]))
			.map(i => i[0]).join('') !== prop){
			// keep trying - todo: do something smarter than just shuffling until you get the right answer... lol
		}
		return attempt;
	}
	static verifyImplications(attempt){
		let failed = false;
		data.implications.syntax.forEach(implication => {
			// each implication has CONDITIONS and RESULTS
			for (const condition in implication.conditions)
				if (!implication.conditions[condition].includes(
					attempt[condition].map(i => i[0]).join('')))
					return;
			// then all conditions passed
			// check result
			let resultsFailed = false;
			for (const result in implication.results)
				if (implication.results[result] !== attempt[result].map(i => i[0]).join('')){
					resultsFailed = true;
					break;
				}
			// check if results failed
			if (!resultsFailed)
				return;
			// then result failed
			failed = true;
			console.log(`Syntax broke implication ${implication.name} (${implication.url})`);
			// regen this thing
			for (const result in implication.results)
				attempt[result] = Syntax.propToArray(result, implication.results[result]);
		});
		return failed;
	}
}

class Vocab {
	/** @param {Word[]} words set of words */
	constructor(words = []){
		/** @type {Word[]} words set of words */
		this.words = [];
		this.tokenCount = {};
		words.forEach(w => this.add(w));
	}
	/** @param {Word} word */
	add(word){
		this.words.push(word);
		if (this.tokenCount[word.string])
			this.tokenCount[word.string]++;
		else
			this.tokenCount[word.string] = 1;
	}
	/** @param {Word} word */
	checkPotentialToken(word){
		// if it exists as a key, then check if it's < 2
		return !this.tokenCount[word.string] || this.tokenCount[word.string] < 2;
	}
	/**
	 * @param {Phoneme[]} phonology
	 * @param {Phonotactics} phonotactics
	 * @param {Morphology} morphology
	*/
	static generate(phonology, phonotactics){ // todo integrate morphology
		const v = new Vocab();
		wordLists.swadesh.map(def => {
			let attempt;
			while (!v.checkPotentialToken(attempt = phonotactics.randomWord(phonology))){
				// keep trying
				// console.debug(`${attempt.string} failed, already 2`);
				// debugger;
			}
			attempt.meaning = def;
			v.add(attempt);
		});
		return v;
	}
}

class Language {
	/**
	 * currently, languages have only phonologies
	 * @param {Phoneme[]} phonology set of phonemes
	 * @param {Phonotactics} phonotactics
	 * @param {Syntax} syntax
	 * @param {Morphology} morphology
	 * @param {Vocab} vocab
	*/
	constructor(phonology, phonotactics, syntax, morphology, vocab){
		this.phonology = phonology;
		this.phonotactics = phonotactics;
		this.syntax = syntax;
		this.morphology = morphology;
		this.vocab = vocab;
	}
	get vocabHTML(){
		const div = document.createElement('div');
		const vocabHeader = document.createElement('h2');
		vocabHeader.innerHTML = 'Vocabulary';
		div.appendChild(vocabHeader);
		const wordlist = document.createElement('ul');
		wordlist.id = 'wordlist';
		this.vocab.words.forEach((word, i) => {
			const li = document.createElement('li');
			wordlist.appendChild(li);
			li.innerHTML = `${word.meaning} = `;
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
		const morpho = Morphology.generate(phonology, phonotactics);
		return new Language(
			phonology,
			phonotactics,
			Syntax.generate(),
			morpho,
			Vocab.generate(phonology, phonotactics, morpho)
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

/* Vulgarlang but actually good
	missing features from vulgarlang:
	- sample sentence
	- long vowels
	- rarer consonants
	- more complex syllable structures
	- stress pattern
	- article table
	- pronoun table (but ideally, unlike vulgarlang, one that respects roots)
	- possessives
	- verbs
	- numbers (preferably, with more than just base-10/20 like vulgarlang)
	- derivational suffixes
	other missing features:
	- custom orthography
		(like... entirely different script)
		might be a challenge but with svg should definitely be possible
	- prettify css
	- "generate more words" button
	- morphology: also prefixes... and clitics...
*/