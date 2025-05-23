/* exported adj, eremoranMain, ereNum, expansionProject, linkCard, search, titleCard, wordle */
/* global charHisto, commaNumber, defFormat, etymElement, getDict, histo, histo2, isAnagram
	quotes, random, removeAccents, round, startEreQuote,
	translationChallenges, union */

'use strict';

// dictionary databases
const elements = {
	get anadromes(){
		return this.dict.filter(w => this.dict.includes(w.split('').reverse().join('')));
	},
	get anagrams(){
		return this.dict.filter(w1 => this.dict.some(w2 => w1 !== w2 && isAnagram(w1, w2)));
	},
	/** @type {string[]} */
	categories: [],
	/** @type {string[]} - array of words*/
	get corpus(){
		if (this.corpusCache)
			return this.corpusCache;
		return this.corpusCache = (translationChallenges.concat(quotes.map(i => i[0]))
			.join(' ') + ' '
			+ Array.from(document.getElementsByClassName('corpus'))
				.map(elem => elem.innerHTML).join(' ')
		).replace(/[:\\/.,]/g, '').replace(/\s+/g, ' ').toLowerCase().split(' ');
	},
	/** @returns {HTMLDListElement} - the entire dictionary element*/
	get d(){
		return document.getElementById('dictionary');
	},
	/** @type {string[]} - array of words*/
	dict: [],
	/** @type {string[]} */
	get nocat(){
		return this.raws.filter(o => !o.categories).map(o => o.title);
	},
	get palindromes(){
		return this.dict.filter(w => w === w.split('').reverse().join(''));
	},
	/** @type {Array} */
	raws: [],
	/** @type {string[]} */
	testList(wordlist){
		return wordlist.filter(w => !elements.raws.some(raw => raw.defList.some(def => new RegExp(w, 'gi').test(def))));
	},
};

// utilities

/**
 * @param {string} s eremoran word
 * @returns {string} */
function gloss(s){
	try {
		const o = elements.raws.find(entry => entry.title === s).defList[0]
			.replace(/ ?\(.+?\) ?/g, '') // remove parentheticals from glosses
			.replace(/,.+/, ''); // remove secondary glosses
		if (23 < o.length)
			console.warn(`long gloss: ${s} = "${o}"`);
		return defFormat(o);
	}
	catch (e){
		console.error(`unable to gloss ${s}`);
		return '???';
	}
}

/** @param {string} s */
function linkCard(s){
	// hotlink to entry
	/** @type {HTMLAnchorElement} */
	const anchor = document.createElement('a');
	anchor.href = `#lemma-${s}`;
	anchor.innerHTML = s;
	anchor.title = gloss(s);
	anchor.classList.add('eremoran');
	EremoranTooltip.setupWord(anchor);
	return anchor;
}

/** f -> h &c to match font */
function normalizeEremoran(s){
	return s.replace(/f/g, 'h').replace(/-/g, '');
}

/** @param {string} s */
function titleCard(s){
	const span = document.createElement('span');
	// hotlink to entry
	/** @type {HTMLAnchorElement} */
	const anchor = document.createElement('a');
	anchor.href = `#lemma-${s}`;
	anchor.innerHTML = '^';
	span.appendChild(anchor);
	// entry title
	const ereTitle = document.createElement('span');
	ereTitle.innerHTML = s;
	ereTitle.classList.add('eremoran');
	EremoranTooltip.setupWord(ereTitle);
	span.appendChild(ereTitle);
	return span;
}

// main

const compile = {
	adpPrefix(){
		return elements.raws
			.filter(raw => raw.cat.includes('prep.') || raw.cat.includes('post.'))
			.map(raw => [raw.title, elements.raws.filter(otherRaw => otherRaw.etym.split('/').includes(raw.title)).length])
			.filter(xy => xy[1]);
	},
	dict(){
		return elements.dict.join(' ');
	},
	finals(){
		return elements.dict.map(w => w[w.length-1]).join('');
	},
	initials(){
		return elements.dict.map(w => w[0]).join('');
	},
	length(){
		return elements.dict.map(w => w.length);
	},
	meanings(){
		return new Array(...elements.d.getElementsByTagName('dd'))
			.filter(x => 0 < x.getElementsByTagName('ol').length)
			.map(x => x.getElementsByTagName('ol')[0].children.length);
	},
	medials(){
		return elements.dict.map(w => w.slice(1, -1)).join('').replace(/\s/g, '');
	},
	nounClass(){
		return new Array(...elements.d.getElementsByClassName('lemmaType'))
			.filter(x => x.innerHTML.slice(0, 3) === 'n.,')
			.map(x => x.innerHTML[4]);
	},
	sequences(){
		return elements.dict.map(word => Array.from(word).map((letter, i) => letter + word[i+1]).join(' '))
			.join(' ').replace(/ .undefined/g, '').split(' ');
	},
};

// learn eremoran!

const LE = {
	get learn(){
		return document.getElementById('learn');
	},
	new(canIUseReview = true){
		// console.debug('LE.new', this);
		// blank
		this.learn.innerHTML = '';
		// old or new?
		const [question, answer] = canIUseReview && this.review.list.length && random.random() < 0.5
			? random.choice(this.review.list) // old
			: this.random.clause(); // new
		this.review.current = [question, answer];
		// eremoran script
		const elemQe = document.createElement('span');
		elemQe.classList.add('eremoran');
		elemQe.innerHTML = question.replace('f', 'h');
		this.learn.appendChild(elemQe);
		// newline
		this.learn.appendChild(document.createElement('br'));
		// question
		const elemQ = document.createElement('span');
		elemQ.innerHTML = question;
		this.learn.appendChild(elemQ);
		// newline
		this.learn.appendChild(document.createElement('br'));
		// answer (spoilered)
		const elemA = document.createElement('span');
		elemA.classList.add('hidden', 'button');
		elemA.onclick = () => elemA.classList.value = '';
		elemA.innerHTML = answer;
		this.learn.appendChild(elemA);
	},
	random: {
		clause(){
			/** @type {[string, string]} */
			const choice = random.choice(LE.shapes);
			/** @type {[string, string]} */
			const o = choice.map(x => x); // copy
			choice[0].match(/{.+?}/g).forEach(match => {
				const tag = match.replace(/{|}/g, '');
				const raw = this.noun(tag);
				const ere = raw.title;
				const en = gloss(ere);
				o[0] = o[0].replace(match, ere);
				o[1] = o[1].replace(match, en);
			});
			return o;
		},
		/**
		 * @param {string} tag
		 * @returns {[string, string]}
		 */
		noun(tag){
			return random.choice(elements.raws.filter(
				x => x.categories && x.categories.includes(tag)));
		},
	},
	review: {
		// todo
		add(){
			this.list.push(this.current);
			this.updateElement();
		},
		/** @type {[string, string]} */
		current: undefined,
		/** @type {HTMLSpanElement} */
		get element(){
			return document.getElementById('review');
		},
		/** @type {[string, string][]} */
		list: [],
		remove(){
			const i = this.list.map(x => x[0]).indexOf(this.current[0]);
			if (-1 < i)
				this.list.splice(i, 1);
			this.updateElement();
		},
		updateElement(){
			this.element.innerHTML = this.list.length;
		},
	},
	score: {
		change(n = 0){
			if (n < 0)
				this.wrong -= n;
			else
				this.right += n;
			document.getElementById('score').innerHTML = `${round(100*this.total, 2)}%`;
		},
		right: 0,
		get total(){
			return this.right / (this.right + this.wrong);
		},
		wrong: 0,
	},
	shapes: [
		['{person} i ad {toponym} afkaz', 'The {person} goes to {toponym}.'],
		['{person} i dir {plant} namz', 'The {person} eats the {plant}.'],
		['{person} i dir {animal} saurz', 'The {person} sees the {animal}.'],
		['{v3_trade} su purrum i naum ne', 'How much does {v3_trade} cost?'],
		['kikom i dir {v3_trade} sudôz', 'We produce {v3_trade} here.'],
		['dir {v3_trade} ad dare baliz', 'I trade {v3_trade} for gold.'],
		['{animal} i kusanam ne', 'How many {animal}s are there?'],
	],
	understood(was_it){
		this.score.change(was_it ? 1 : -1);
		if (was_it)
			this.review.remove();
		else
			this.review.add();
		this.new(was_it);
	},
};
// replace each word in eremoran class span with <span ... >
// which creates a tooltip with the word info!

const EremoranTooltip = {
	id: 'eremoran_tooltip',
	/** @type {HTMLDivElement} */
	tooltip: undefined,
	visible: true,
	clearTooltip(){
		this.tooltip.innerHTML = '';
		this.tooltip.style.display = 'none';
		this.tooltip.style.left = this.tooltip.style.right = '';
	},
	/** @param {string} word */
	getDef(word){
		// collect target elements
		const desiredWordElement = document.getElementById(`lemma-${word}`);
		// create container
		const container = document.createElement('div');
		const header = document.createElement('h3');
		header.innerHTML = word;
		container.appendChild(header);
		container.innerHTML += desiredWordElement.innerHTML;
		return container;
	},
	setup(){
		// store data
		// this.words = Array.from(document.getElementsByTagName('dt'));
		// create tooltip
		const div = this.tooltip = document.createElement('div');
		div.id = this.id;
		document.body.appendChild(div);
		this.clearTooltip();
		// create triggers for words in eremoran class...
		/** @type {HTMLElement[]} */
		const eremoranTags = Array.from(document.getElementsByClassName('eremoran'));
		eremoranTags.forEach(this.setupWord);
	},
	/** @param {HTMLElement} elem */
	setupWord(elem){
		if (elem.classList.contains('cs')) // ignore case-sensitive
			return;
		/** @type {string[]} */
		const words = elem.innerHTML.split(' ');
		elem.innerHTML = '';
		words.forEach((word, i) => {
			if (i)
				elem.appendChild(document.createTextNode(' '));
			const span = document.createElement('ruby');
			const rt = document.createElement('rt'); // ruby top
			rt.innerHTML = word.toUpperCase();
			const fixedword = word.toLowerCase();
			span.innerHTML = normalizeEremoran(fixedword);
			span.classList.add('eremoranWord');
			span.onmouseover = () => EremoranTooltip.showTooltip(fixedword, span);
			span.onmouseout = () => EremoranTooltip.clearTooltip();
			span.appendChild(rt);
			elem.appendChild(span);
		});
	},
	/**
	 * @param {string} word
	 * @param {HTMLSpanElement} elem
	 * @returns {void}
	*/
	showTooltip(word, elem){
		try {
			this.tooltip.appendChild(this.getDef(word));
		}
		catch (e){
			if (1 < word.length)
				return this.showTooltip(word.slice(0, -1), elem); // attempt truncation
			return console.debug(`couldn't fetch ${word}.`);
		}
		this.tooltip.style.display = 'block'; // to reveal it
		// position it
		const xy = elem.getBoundingClientRect();
		if (xy.right+xy.left < window.innerWidth)
			this.tooltip.style.left = `${xy.right}px`;
		else
			this.tooltip.style.right = `${window.innerWidth-xy.left}px`;
		this.tooltip.style.top = `${xy.bottom}px`;
	},
};

const ereNum = {
	/** toggle eremoran number tool auto-up */
	autoUp(){
		this.on = !this.on;
		if (this.on)
			this.interval = setInterval(() => {
				document.getElementById('eremoranNumberInput').value++;
				this.numberTool();
			}, 100);
		else
			clearInterval(this.interval);
	},
	first: [
		'',
		'id',
		'nasu',
		'kumku',
		'babzu',
		'hanu',
		'elmnu',
		'klimu',
		'triksu',
		'talsu',
		'nasanu',
		'tanid',
		'tanasu',
		'tankumku',
		'tambabzu',
	],
	hundreds: [
		'',
		'sesu', // 100
		'sesusesu', // 10k
		'natiuz', // 1M
		'pamoluz', // 100M
		'amuluz', // 10B
		'moluz', // 1T
		'dazuz', // 100T; not in dict
		'kuduz', // 10Qa; not in dict
		'sauz', // 1Qi; not in dict
		'kakuz', // 100Qi; not in dict
		'bakuz', // 10Sx; not in dict
		'sonuz', // 1Sp; not in dict
	],
	interval: 0,
	/**
	 * @param {number} x
	 * @returns {string}
	 */
	num(x){
		if (Math.pow(100, this.hundreds.length) <= x)
			return '';
		if (x < 15)
			return this.first[x];
		if (x < 80){
			const fives = Math.floor(x / 5);
			const remainder = x % 5;
			const fivesWord = `${this.num(fives).replace(/u$/g, '')}anu`;
			const onesWord = this.first[remainder];
			return `${fivesWord} ${onesWord}`.replace(/ $/g, '');
		}
		if (x < 100)
			return `kumkananu ${this.num(x-75)}`;
		// 2024 modifications
		return this.splitBase(x)
			.map((n, i, a) => `${1 < n || i === a.length-1 ? this.num(n) : ''} ${n ? this.hundreds[a.length-i-1] : ''}`)
			.join(' ')
			.replace(/ +/g, ' ') // double space
			.replace(/^ /, '') // phrase-initial space
			.replace(/ $/, ''); // phrase-final space
	},
	numberTool(){
		/** @type {number} */
		const input = document.getElementById('eremoranNumberInput').value;
		/** @type {HTMLQuoteElement} */
		const o = document.getElementById('eremoranNumberOutput');
		// main
		o.innerHTML = this.num(input);
		// recompute tooltips
		EremoranTooltip.setupWord(o);
	},
	on: false,
	splitBase(n, base = 100){
		const digits = [];
		while (n){
			digits.push(n % base);
			n = Math.floor(n / base);
		}
		return digits.reverse();
	},
};

const adj = {
	/** @param {string} a */
	classes(a){
		const forms = [a + 'r', a + 'k', a + 't', a, a + 'm'];
		const table = document.createElement('table');
		// create rows...
		forms.forEach((form, i) => {
			const row = document.createElement('tr');
			const label = document.createElement('th');
			label.innerHTML = `Class ${i+1}`;
			const entry = document.createElement('td');
			entry.innerHTML = form;
			row.appendChild(label);
			row.appendChild(entry);
			table.appendChild(row);
		});
		return table;
	},
	/** @param {string} a */
	classless(a){
		const elem = document.createElement('span');
		elem.innerHTML = a;
		return elem;
	},
	/** @param {string} indexForm */
	decline(indexForm){
		const gendered = indexForm[indexForm.length-1] === 'u';
		const stem = gendered ? indexForm.slice(0, indexForm.length - 1) : indexForm;
		const [comparative, superlative, equative] = [
			stem + 'uku',
			stem + 'id',
			stem + 'ofaz',
		];
		const positive = gendered
			? this.classes(indexForm) : this.classless(indexForm);
		const ee = [
			{name: 'Positive', elem: positive},
			{name: 'Comparative (ZE)', elem: this.classes(comparative)},
			{name: 'Superlative', elem: this.classless(superlative)},
			{name: 'Equative', elem: this.classless(equative)},
		];
		// TODO pu- + adj = negative
		// make table
		const table = document.createElement('table');
		ee.forEach(data => {
			const name = data.name;
			const elem = data.elem;
			const row = document.createElement('tr');
			const th = document.createElement('th');
			const td = document.createElement('td');
			th.innerHTML = name;
			td.appendChild(elem);
			row.appendChild(th);
			row.appendChild(td);
			table.appendChild(row);
		});
		return table;
	},
	tool(){
		/** @type {string} */
		const a = document.getElementById('adjInput').value;
		const output = document.getElementById('adjOutput');
		output.innerHTML = '';
		output.appendChild(this.decline(a));
	},
};

const wordle = {
	/** @type {string} */
	current: undefined,
	guesses: 0,
	initialized: false,
	/** @returns {string[]} */
	get wordbank(){
		return elements.dict.filter(x => x.length === 5);
	},
	/** @param {string} char */
	append(char){
		document.getElementById('wordle_input').value += char;
	},
	/** @param {string} word */
	fixWord(word){
		return word.toLowerCase().replace(/f/g, 'h');
	},
	/** @param {string} guess */
	guessElement(guess){
		const span = document.createElement('span');
		guess.split('').forEach((char, i) => {
			const elem = document.createElement('span');
			elem.innerHTML = char;
			elem.classList.add(`wordle${this.rateLetter(char, i)}`);
			span.appendChild(elem);
		});
		return span;
	},
	init(){
		if (!this.initialized){
			document.getElementById('wordle_input').addEventListener('keydown', e => {
				if (e.key === 'Enter')
					this.submit();
			});
			this.initialized = true;
		}
		this.reset();
	},
	/** @returns {string} */
	randomWord(){
		return this.fixWord(random.choice(this.wordbank));
	},
	rateLetter(letter, position){
		return this.current[position] === letter ? 2
			: this.current.includes(letter) ? 1 : 0;
	},
	reset(){
		document.getElementById('wordle_input').value = '';
		document.getElementById('wordle_history').innerHTML = '';
		this.current = this.randomWord();
		this.guesses = 0;
	},
	submit(){
		/** @type {string} */
		const guess = this.fixWord(document.getElementById('wordle_input').value);
		// verify 5 valid chars
		if (!this.validate(guess))
			return window.alert('Invalid Word!');
		if (5 < this.guesses)
			return window.alert(`Too many guesses! The word was ${this.current}.
			Press Reset to try again!`);
		// add to history
		const li = document.createElement('li');
		li.appendChild(this.guessElement(guess));
		document.getElementById('wordle_history').appendChild(li);
		// clear text box
		document.getElementById('wordle_input').value = '';
		this.guesses++;
		// refocus
		document.getElementById('Wordle').scrollIntoView();
	},
	/** @param {string} guess */
	validate(guess){
		return /[abdehiklmnoprstuzêô]{5}/.test(guess);
	},
};

const search = {
	append(s){
		document.getElementById('regexSearch').value += s;
	},
	appendResult(s){
		const li = document.createElement('li');
		li.appendChild(titleCard(s));
		const g = document.createElement('q');
		g.classList.add('gloss');
		g.innerHTML = gloss(s);
		li.appendChild(g);
		this.searchResults.appendChild(li);
	},
	/** @returns {string} */
	get category(){
		return document.getElementById('categorySearch').value;
	},
	/** @returns {string} */
	get etymSource(){
		return document.getElementById('etymologySourceSearch').value;
	},
	/** @returns {string} */
	get etymType(){
		return document.getElementById('etymologyTypeSearch').value;
	},
	input(){
		this.resetResults();
		const results = elements.raws.filter(o => {
			// category match
			if (this.category !== 'any' && (!o.categories || !o.categories.includes(this.category)))
				return false;
			// word class match
			if (this.type !== 'any' && (!o.cat || !o.cat.match(new RegExp(`\\b${this.type}\\.(,|$)`))))
				return false;
			// property match
			if (this.property !== 'any' && (!o.cat || !o.cat.match(this.property)))
				return false;
			// etym source match
			if (this.etymSource !== 'any' && (!o.etym || !o.etym.match(new RegExp(`^L/${this.etymSource}`))))
				return false;
			// etym type match
			if (this.etymType !== 'any' && (!o.etym || !o.etym.match(new RegExp(`^${this.etymType}/`))))
				return false;
			// regex match
			if (!o.title.match(new RegExp(this.regex)))
				return false;
			return true;
		});
		document.getElementById('searchResultN').innerHTML = results.length;
		results.forEach(o => this.appendResult(o.title));
	},
	/** @returns {string} */
	get property(){
		return document.getElementById('propertySearch').value;
	},
	reset(){
		[
			'categorySearch', 'typeSearch', 'propertySearch',
			'etymologySourceSearch', 'etymologyTypeSearch',
		].forEach(s => document.getElementById(s).value = 'any');
		document.getElementById('regexSearch').value = '';
		this.resetResults();
	},
	resetResults(){
		this.searchResults.innerHTML = '';
	},
	/** @returns {string} */
	get regex(){
		return document.getElementById('regexSearch').value;
	},
	/** @returns {HTMLUListElement} */
	get searchResults(){
		return document.getElementById('searchResults');
	},
	/** @returns {string} */
	get type(){
		return document.getElementById('typeSearch').value;
	},
};

/** tools to get pronounciation from normalized eremoran */
const phono = {
	consonants: {
		ipa: 'bdfklmnpʀstz'.split(''),
		ortho: 'bdhklmnprstz'.split(''),
	},
	/** @param {string} syll */
	divideSyllable(syll){
		const nucleus = syll.match(/[aeiouəɛɪɔʊ]/g)[0];
		const [onset, coda] = syll.split(nucleus);
		return [onset, nucleus, coda];
	},
	/** @param {string} s */
	elem(s){
		const span = document.createElement('span');
		span.classList.add('ipa');
		const irr = elements.raws.find(w => w.title === s).pron; // irregular pron?
		if (irr === 0) // todo fix affixes
			return span;
		if (!irr){
			const word = normalizeEremoran(s);
			const [ipa, syllables] = this.ipa(word);
			if (2 <= syllables.length)
				syllables[syllables.length-2] = syllables[syllables.length-2].toUpperCase();
			const syllabification = syllables.join('-');
			span.innerHTML = `IPA: [${ipa}] &ndash; Syllabification: ${syllabification}`;
			// debug warning
			this.validate(word);
		}
		else
			span.innerHTML = `IPA: [${irr}]`;
		return span;
	},
	/** @param {string} s */
	ipa(s){
		// main function
		const syllables = this.syllabify(s);
		const ipaSyllables = syllables.map((syll, i) => {
			// penultimate stress
			const stress = syllables.length < 2 || i === syllables.length - 2
				? 'stressed' : 'unstressed';
			// replace letters with sounds
			Array.from(syll).forEach(char => {
				let j = this.vowels.ortho.indexOf(char);
				if (0 <= j)
					syll = syll.replace(char, this.vowels[stress][j]);
				else {
					j = this.consonants.ortho.indexOf(char);
					syll = syll.replace(char, this.consonants.ipa[j]);
				}
			});
			// coda liquids
			const divisions = this.divideSyllable(syll);
			divisions[2] = divisions[2].replace('l', 'ʕʷ').replace('ʀ', 'ʀʷ');
			return divisions.join('');
		});
		const o = ipaSyllables.join('')
			// misc allophones
			.replace(/[mn]k/g, 'ŋk')
			.replace(/n(?=[bp])/, 'm')
			.replace(/[mn]f/, 'ɱf')
			.replace(/m(?=[sztd])/, 'n')
			.replace(/^f/, 'h')
			.replace(/^k/, 'g')
			// to get around having to use lookbehinds
			.replace(/[aeiouəɛɪɔʊ](b)(?=[aeiouəɛɪɔʊ])/g, (a, b) => a.replace(b, 'w'))
			.replace(/[aeiouəɛɪɔʊ](d)(?=[aeiouəɛɪɔʊ])/g, (a, b) => a.replace(b, 'ɾ'))
			.replace(/aʀ(?![eiɛɪ])/g, 'aħ')
			.replace(/ɔʀ(?![eiɛɪ])/g, 'ɔħ')
			.replace(/ɪ$/, 'i') // i/u do not reduce word-finally
			.replace(/ʊ$/, 'u') // i/u do not reduce word-finally
			.replace(/kz$/, 'ks') // fix verb ending weirdness
			.replace(/pz$/, 'ps') // fix verb ending weirdness
			.replace(/tz$/, 'ts') // fix verb ending weirdness
			.replace(/kʀ/g, 'qʀ') // velar + r
			.replace(/gʀ/g, 'ɢʀ'); // velar + r
		return [o, syllables];
	},
	/** @param {string} s - sentence */
	sentence(s){
		return normalizeEremoran(s.toLowerCase()).split(' ').map(w => this.ipa(w)).join(' ');
	},
	/** @param {string} word */
	syllabify(word){
		// reverse word
		const rev = word.split('').reverse().join('');
		// this m is necessary for words like rilmonumk where the base form uses /-nk/ but derived forms use /-m-/
		//										|
		// eslint-disable-next-line max-len
		const regex = /(([sz][bdkmnpt])|([kt][snm])|([mtzk][lr])|([bdhklmnprstz]))?[aeiouêô]((r[bdkpt])|([ptk]s|(lk)|([bdhklmnprstz])))?/g;
		return rev.match(regex).reverse().map(s => s.split('').reverse().join(''));
	},
	/** @param {string} word */
	validate(word){
		if (word.includes('-'))
			return true; // ignore
		// debug warnings
		const syllTest = this.syllabify(word).join('');
		if (syllTest !== word.replace(/ /g, ''))
			// eslint-disable-next-line max-len
			return console.warn(`${word} changed value to ${syllTest} during syllabification! (Is it valid Eremoran?)`);
		if ('bph'.includes(word[word.length-1]))
			return console.warn(`${word} ends in a labial`);
		return true;
	},
	vowels: {
		ortho: 'aeiouêô'.split(''),
		stressed: 'aɛiɔueo'.split(''),
		unstressed: 'əəɪəʊeo'.split(''),
	},
};

const gen = {
	json(cat){
		const template = `
		{
			"title": "TITLE",
			"etym": "I/PEN/*PROTO",
			"cat": "CAT",
			"defList": [
				"DEF"
			],
			"categories": [CATEGORIES]
		},`;
		const filter = w => 3 < w.length && w.length < 10
			&& this.filter.c(cat)(w) && !elements.dict.includes(w);
		const catString = {
			n1: 'n., 1st', n2: 'n., 2nd', n3: 'n., 3rd', n4: 'n., 4th', n5: 'n., 5th',
			v: 'v.', adj: 'adj.',
		}[cat];
		const word = this.proto.gen(filter);
		return template.replace('TITLE', word).replace('CAT', catString);
	},
	filter: {
		/** returns true if this matches what we would expect from a class 4 noun
		 * eg. try gen.proto.gen(gen.filter.c('n1'));
		 * @param {number} type eg 'v' or 'n1' or 'adj' */
		c(type){
			function output(w){
				const reserved = 'rktmz'.split('');
				const last = w[w.length-1];
				switch (type){
					case 'n1':
						return last === 'r';
					case 'n2':
						return last === 'k';
					case 'n3':
						return last === 't';
					case 'n5':
						return last === 'm';
					case 'v':
						return last === 'z';
					case 'adj':
						return last === 'u';
				}
				return !reserved.includes(last);
			}
			return output;
		},
		/** eg. try gen.proto.gen(gen.filter.endsWith('k'));
		 * @param {string} char
		 */
		endsWith(char){
			return w => w[w.length-1] === char;
		},
	},
	name: {
		vowels: 'aeiouêô',
		/** @param {string} s */
		endsWithVowel(s){
			return this.vowels.includes(s[s.length-1]);
		},
		/** @param {string} s */
		startsWithVowel(s){
			return this.vowels.includes(s[0]);
		},
		/**
		 * @param {string[]} firsts acceptable first components
		 * @param {string[]} lasts acceptable last components
		 * @param {string} midAnaptyxis vowel to insert between first and last components if necessary
		 * @param {string} endAnaptyxis vowel to insert between suffix and last component if necessary
		 * @param {string} suffix
		 */
		template(firsts, lasts, midAnaptyxis = '', endAnaptyxis = '', suffix = ''){
			/** @type {string} */
			let name = random.choice(firsts);
			/** @type {string} */
			const last = random.choice(lasts);
			if (!this.endsWithVowel(name)
					&& !this.startsWithVowel(last))
				name += midAnaptyxis;
			name += last;
			// generate name
			if (!this.endsWithVowel(name))
				name += endAnaptyxis;
			name += suffix;
			return name;
		},
		name: {
			gen(){
				const elem = document.getElementById('namegen_out');
				elem.innerHTML = `${gen.name.template(this.first, this.last, 'a', 'i', 'sur')} ${gen.name.template(this.first, this.last, 'a', 'a', 'r')}`;
				// recompute tooltips
				EremoranTooltip.setupWord(elem);
				this.updateCombos();
			},
			either: ['afês', 'ardo', 'badm', 'bi', 'kafl', 'ko', 'lib',
				'lusi', 'mar', 'mas', 'tem', 'uris'],
			first_: ['bêt', 'dare', 'end', 'epe', 'ere', 'hem', 'his', 'ku', 'lak', 'maram', 'saz', 'si', 'tranz'],
			get first(){
				return union(this.either, this.first_);
			},
			last_: ['bazê', 'fem', 'fis', 'ke', 'kiki', 'kop', 'labni', 'len', 'mo', 'subi'],
			get last(){
				return union(this.either, this.last_);
			},
			updateCombos(){
				document.getElementById('namegen_combos').innerHTML
					= commaNumber(Math.pow(this.first.length * this.last.length, 2));
			},
		},
		topo: {
			gen(){
				const elem = document.getElementById('toponym_out');
				elem.innerHTML = gen.name.template(this.first, this.last, 'a');
				// recompute tooltips
				EremoranTooltip.setupWord(elem);
				this.updateCombos();
			},
			// todo: city/fort clearing
			either: ['akranu', 'bemmu', 'iklu', 'len', 'muna', 'mura', 'nô', 'nul'],
			first_: ['ke', 'end', 'ere', 'hai', 'huk', 'kan', 'kokin', 'ku', 'kure', 'lak', 'lib', 'muk', 'n', 'nas', 'sed', 'si', 'tar', 'tas'],
			get first(){
				return union(this.either, this.first_);
			},
			last_: ['alika', 'ammut', 'da', 'damu', 'kokint', 'labafi', 'lira', 'mam', 'mamat', 'mor', 'saurom', 'seda', 'sedat'],
			get last(){
				return union(this.either, this.last_);
			},
			updateCombos(){
				document.getElementById('toponym_combos').innerHTML
					= commaNumber(this.first.length * this.last.length);
			},
		},
	},
	proto: {
		/** @type {{string: {string: number}}} */
		data: {'^': {}},
		/** @param {string} pform */
		evolve(pform){
			let o = pform
				.replace(/x[eê]x?/g, 'a')
				.replace(/[eê]x/g, 'a')
				.replace(/x/g, 'k')
				.replace(/i(?=[aeouêô])/g, 'j') // except i
				.replace(/^[ɸs](?=[aeiouêô])/g, 'h');
			this.sets.voiced.forEach(phone => {
				o = o.replace(new RegExp(`${phone}s(?=[aeiouêôbdlmnrz]|$)`, 'g'), `${phone}z`);
				o = o.replace(new RegExp(`${phone}ss(?=[aeiouêôbdlmnrz]|$)`, 'g'), `${phone}s`);
			});
			this.sets.vowels.forEach(phone => {
				o = o.replace(new RegExp(`${phone}ɸu`, 'g'), `${phone}u`);
			});
			o = o
				.replace(/ɸ/g, 'f')
				.replace(/β/g, 'b')
				.replace(/sj/g, 'ʃ')
				.replace(/zj/g, 'ʒ')
				.replace(/tj/g, 'tʃ')
				.replace(/dj/g, 'dʒ')
				.replace(/ʃ/g, 's')
				.replace(/ʒ/g, 'z')
				.replace(/g/g, 'k')
				.replace(/ts/g, 's')
				.replace(/j/g, '')
				.replace(/^sl/g, 'z') // word-initial sl -> z
				.replace(/[eo](?=.*[aeiouêô].*[aeiouêô])/g, 'a') // account for vowel reduction
				.replace(/aa/g, 'a') // double-a reduction
				.replace(/a(?=[aeiouêô]{2,})/g, '') // a-triphthong reduction
				.replace(/ar[aeo](?!$)/g, 'ar') // arV reduction
				.replace(/^a(?=.*[eiouêô].*[eiouêô])(?![bdfklmnprstz]{2,})/g, ''); // a-V-V reduction
			console.info(`*${pform} -> ${o}`);
			return o;
		},
		gen(filter = () => true){
			return gen.markov.gen(this, filter);
		},
		init(){
			this.pforms = elements.raws.map(o => {
				const matches = o.etym.match(/^I\/PEN\/\*[^/]+/g);
				if (matches)
					return matches[0].slice(7).replace(/[-()]/g, '');
				return '';
			}).filter(x => x);
			gen.markov.init(this.pforms, this.data);
			this.initialized = true;
		},
		/** @type {string[]} */
		pforms: [],
		get prevalidationF(){
			return this.evolve;
		},
		sets: {
			voiced: 'aeiouêôbdlmnrz'.split(''),
			vowels: 'aeiouêô'.split(''),
		},
		validatePforms(){
			if (!this.initialized)
				this.init();
			let pformi = 0;
			elements.raws.forEach(o => {
				const pform = this.pforms[pformi];
				if (!o.etym.match(new RegExp(`^I\\/PEN\\/\\*${pform}`)))
					return; // continue
				const expected = normalizeEremoran(o.title).replace(/kz$/g, 'ks').replace(/tz$/g, 'ts');
				//generate 'evolved' proto-form
				let actual = phono.syllabify(normalizeEremoran(this.evolve(pform))).join('');
				// s-triggering adjectives lose final *-z
				if (o.cat.includes('s-triggering'))
					actual = actual.replace(/[sz]$/g, '');
				// compare
				if (expected !== actual)
					console.warn(`${expected} found, but ${pform} => ${actual} expected`);
				pformi++;
			});
			console.log('P-Form validation complete.');
		},
	},
	markov: {
		/** @type {{string: {string: number}}} */
		data: {'^': {}},
		/** @returns {string} */
		gen(o = this, filter = () => true){
			if (!o.initialized)
				o.init();
			let choice = '^';
			let str = '';
			while (choice !== '$'){
				// pick next char
				const choices = Object.keys(o.data[choice]);
				// eslint-disable-next-line no-loop-func
				const weights = choices.map(c => o.data[choice][c]);
				choice = random.weightedChoice(choices, weights);
				if (choice !== '$')
					str += choice;
			}
			if (o.prevalidationF)
				str = o.prevalidationF(str);
			try {
				if (filter(str) && phono.validate(normalizeEremoran(str)))
					return str;
			}
			catch (_){
				// retry
			}
			return this.gen(o, filter); // retry
		},
		init(corpus = elements.dict, output = this.data){
			// this.data = {'^': {}}; // reset
			corpus.forEach(word => {
				word = `^${word}$`;
				Array.from(word).forEach((char, i) => {
					if (i === word.length-1)
						return;
					const next = word[i + 1];
					// create source if nonexistent
					if (!output[char])
						output[char] = {};
					// create target if nonexistent
					if (output[char][next])
						output[char][next]++;
					else
						output[char][next] = 1;
				});
			});
			this.initialized = true;
		},
	},
};

const dialectMap = {
	/** @type {[number, number][]} */
	coords: [
		// ...range(0, 100, 10).map(x => [x, x]) // fake debug coords
		// SOUTHERN DIALECTS
		[16, 75], // Capital
		[7, 68], // Kurramut
		[27, 70], // LRS
		[23, 50], // HRS
		// NORTHERN DIALECTS
		[39, 51], // LN
		[50, 35], // UN
		[55, 29], // Deftei
		[80, 13], // Abbakarm
		[92, 6], // Lake
		// WEST DIALECT
		[35, 30], // ZE
		// Other langs in family (if available)
		[2, 7], // Numoran
		[16, 2], // Timuran
		[36, 6], // Simuran
	],
	data: [
		[...Array(10).keys()], // ids - can't use range() because idk if that's loaded yet.
		[
			'Capital', 'Kurramut', 'LRS', 'HRS',
			'LN', 'UN', 'Deftei', 'Abbakarm', 'Lake',
			'ZE', 'Numoran', 'Timuran', 'Simuran',
		], // names
		[
			'5', '5', '5', '5',
			'5', '5', '5', '5', '5',
			'MFAN', 'MFAN', 'Ø', 'Ø',
		], // names
		[
			'[ʀ]', '[ʁ ~ χ]', '[ʁ ~ χ]', '[x]',
			'[x]', '[ʁ]', '[ʀ]', '[x]', '[h]',
			'[ʁ ~ r]', '[ɾ]', '[ɾ]', '[ɾ]',
		], // /r/
		[
			'[baħʷs]', '[baħʷs]', '[baħʷs]', '[baħʷs]',
			'[maxʷs]', '[maʁʷz]', '[maħʷs]', '[maxʷs]', '[mahʷs]',
			'[barz]', '[baɾh]', '[a baɾ]', '[a baɾ]',
		], // barz
		[
			'[(h)ɔ]', '[ɔ]', '[ɔ]', '[ɔ]',
			'[o]', '[o]', '[(h)o]', '[(h)o]', '[ho]',
			'[hɔ]', '[swe]', '[su]', '[su]',
		], // ho
		[
			'[ʊ.zʊʀʷ.kəˈla.ʊʀʷ]', '[ʊ.zʊʁʷ.kəˈla.ʊʁʷ]', '[ʊ.zʊʁʷ.kəˈla.ʊʁʷ]', '[ʊ.zʊxʷ.kəˈla.ʊxʷ]',
			'[əsˈtʃe.ɾuxʷ]', '[əsˈtʃe.ɾuʁʷ]', '[əsˈtʃe.ɾuʀʷ]', '[əsˈtʃe.ɾuxʷ]', '[əsˈtʃe.ɾuhʷ]',
			'[əs.təˈdur.rə]', '[ahˈtei.dur.re]', '[ˈas.tɛ.du]', '[ˈas.sɛ.zu]',
		], // beautiful
		[
			'[əˈla.oʀʷ]', '[əˈla.oʁʷ]', '[əˈla.oʁʷ]', '[əˈla.oxʷ]',
			'[ˈik.tʃexʷ]', '[ˈik.tʃeʁʷ]', '[ˈik.tʃeʀʷ]', '[ˈik.tʃexʷ]', '[ˈik.tʃehʷ]',
			'[ɪkˈter.rɛ]', '[ˈik.ter.re]', '[ˈi.tɛɾ]', '[ˈi.sɛɾ]',
		], // girl
		[
			'[ˈu.ɪd]', '[ˈu.ɪd]', '[ˈu.ɪd]', '[ˈu.ɪd]',
			'[u]', '[u]', '[u]', '[u]', '[u]',
			'[u-]', '[u]', '[ˈɛ.dʒi]', '[ˈɛ.ʒi]', // *edia rel. to eremoran edzam
		], // not
		[
			'[ˈɛʕʷm.nu]', '[ˈɛʕʷm.nu]', '[ˈɛʕʷm.nu]', '[ˈɛʕʷm.nu]',
			'[ˈewm.nu]', '[ˈewm.nu]', '[ˈewm.nu]', '[ˈewm.nu]', '[ˈewm.nu]',
			'[ɛʟ̠ʷm.nu]', '[ˈxa.jo]', '[ˈa.ju]', '[ˈa.gu]', // *edia rel. to eremoran edzam
		], // six
		[
			'Ø dir', 'Ø dir', 'Ø dir', 'Ø dir',
			'Ø dir', 'Ø dir', 'Ø dir', 'Ø dir', 'Ø dir',
			'tsu di', 'chu Ø', 'chu Ø', 'shu Ø', // *edia rel. to eremoran edzam
		], // erg-abs markers
	],
	display(mode = 0){
		// clear
		this.elem.innerHTML = '';
		// put
		this.data[mode].forEach((datum, i) => {
			const [x, y] = this.coords[i];
			this.putText(datum, x, y);
		});
		this.mode.descElem.innerHTML = this.mode.descs[mode];
	},
	/** @returns {HTMLDivElement} */
	get elem(){
		return document.getElementById('dialectMap');
	},
	mode: {
		/** @returns {HTMLDivElement} */
		get descElem(){
			return document.getElementById('dialectMapDesc');
		},
		/** @returns {HTMLDivElement} */
		get elem(){
			return document.getElementById('dialectMapSelector');
		},
		descs: [
			'debug',
			'Main Eremoran dialect groups, along with nearby Muran languages.',
			'The existence of noun classes within the dialect/language:<br>5 - Standard five (see below)<br>MFAN - Human Masculine, Human Feminine, Nonhuman Animate, Neuter<br>Ø - None',
			'Primary form of the rhotic.',
			'<a class="eremoran" href="#lemma-barz" title="barz \'bind\'">barz</a>',
			'<a class="eremoran" href="#lemma-ho" title="ho \'that\'">ho</a>',
			'The standard word for "beautiful" when referring to a person (in the case of ZE, specifically a woman).',
			'The standard word for girl.',
			'The standard verb negator.',
			'The standard word for the numeral six.',
			'The standard ergative and absolutive markers, respectively.',
		],
		/* place radio button elements */
		init(){
			// todo
			this.names.forEach((name, i) => {
				if (!i)
					return;
				const radio = document.createElement('input');
				const label = document.createElement('label');
				label.classList.add('button');
				radio.type = 'radio';
				radio.name = 'map_mode';
				label.innerHTML = radio.value = name;
				label.setAttribute('for', radio.id = `dialectMapSelector-${name}`);
				radio.checked = i === 1;
				radio.onclick = label.onclick = () => dialectMap.display(i);
				this.elem.appendChild(radio);
				this.elem.appendChild(label);
			});
			dialectMap.display(1);
		},
		names: [
			'debug_id', 'Names', 'Noun Classes', '/r/', 'barz', 'ho',
			'beautiful', 'girl', 'not', 'six', 'ERG-ABS',
		],
	},
	/**
	 * @param {string} s text
	 * @param {number} x % from left [0, 100]
	 * @param {number} y % from top [0, 100]
	 */
	putText(s, x, y){
		const e = document.createElement('div');
		e.classList.add('dialectMapText');
		e.style.left = x + '%';
		e.style.top = y + '%';
		e.innerHTML = s;
		this.elem.appendChild(e);
	},
};

// keep computeStats at the VERY BOTTOM

/** this function is used to run generate statistics DEPENDENT ON the dictionary already existing */
function computeStats(){
	// print dict length (for comparison, Verdurian has 6,757)
	document.getElementById('wordcount').innerHTML = commaNumber(elements.dict.length);
	// new graphs
	// const chartURL = 'https://mocha2007.github.io/tools/chart.svg?data=';
	const chartURL = '../tools/chart.svg?data=';
	document.getElementById('chartLetter').src = chartURL + charHisto(
		normalizeEremoran(compile.dict().replace(/\s/g, ''))
	);
	document.getElementById('chartInitial').src = chartURL + charHisto(normalizeEremoran(compile.initials()));
	document.getElementById('chartMedial').src = chartURL + charHisto(normalizeEremoran(compile.medials()));
	document.getElementById('chartFinal').src = chartURL + charHisto(normalizeEremoran(compile.finals()));
	document.getElementById('chartLength').src = chartURL + histo(compile.length());
	document.getElementById('chartMeaning').src = chartURL + histo(compile.meanings());
	document.getElementById('chartClass').src = chartURL + histo(compile.nounClass());
	document.getElementById('chartSequence').src = chartURL + histo(compile.sequences(), true, true, false, 25);
	document.getElementById('chartEtymType').src = chartURL + charHisto(etymElement.stats.type.join(''));
	document.getElementById('chartEtymSource').src = chartURL + histo(etymElement.stats.source, true, true);
	document.getElementById('chartAdpPrefix').src = chartURL + histo2(compile.adpPrefix(), true, true);
	// do word histogram
	const wordData = elements.corpus;
	// const filteredWordData = wordData.filter(word => wordData)
	document.getElementById('chartWord').src = chartURL + histo(wordData, true, true, false, 20);
	// add categories
	/** @type {HTMLSelectElement} */
	const categorySearch = document.getElementById('categorySearch');
	// sort first
	elements.categories.sort();
	elements.categories.forEach(category => {
		const option = document.createElement('option');
		option.value = option.innerHTML = category;
		categorySearch.appendChild(option);
	});
	// verify etymology hyperlinks
	Array.from(document.querySelectorAll('a.eremoran')).forEach(e => {
		const href = e.href.match(/#.+/)[0]
			.replace(/%20/g, ' ')
			.replace(/%C3%AA/g, 'ê')
			.replace(/%C3%B4/g, 'ô');
		// try to get hyperlink target
		try {
			const target = document.querySelectorAll(href);
			if (!target.length)
				console.warn(`Link points to non-existent entry: ${href}`);
		}
		catch (err){
			console.error(`${err} while analyzing link to ${href}`);
		}
	});
	// verify word forms
	elements.raws.forEach((o, i) => {
		const [word, n] = [o.title, (x => x && x[0])(o.cat.match(/\d/))];
		// add categories to lemmas FIRST AND THEN VERIFY
		if (o.categories && o.categories.length){
			const catdd = document.createElement('dd');
			catdd.innerHTML = 'Categories:';
			o.categories.forEach(catName => {
				catdd.appendChild(document.createTextNode(' '));
				const elem = document.createElement('a');
				elem.href = '#Vocab_Search';
				elem.onclick = () => {
					search.reset();
					document.getElementById('categorySearch').value = catName;
					search.input();
				};
				elem.innerHTML = catName;
				catdd.appendChild(elem);
			});
			document.getElementById(`lemma-${word}`).appendChild(catdd);
		}
		// ok now verify
		if (i && removeAccents(word) < removeAccents(elements.raws[i-1].title))
			console.warn(`${word} out of order!`);
		const last = word[word.length-1];
		switch (n){
			case '1':
				if (last !== 'r')
					console.error(`${word} does not end in r!`);
				break;
			case '2':
				if (last !== 'k')
					console.error(`${word} does not end in k!`);
				break;
			case '3':
				if (last !== 't')
					console.error(`${word} does not end in t!`);
				break;
			case '5':
				if (last !== 'm')
					console.error(`${word} does not end in m!`);
				break;
		}
		// check verbs
		if (o.cat === 'v.' && last !== 'z' && !o.pron)
			console.error(`${word} does not end in z!`);
		// ensure PEN and OER are not incorrectly marked as loans
		if (o.etym.includes('L/PEN') || o.etym.includes('L/OER'))
			console.error(`${word} incorrectly marked as loan (L) rather than inheritance (I)`);
	});
	// print success message
	// eslint-disable-next-line max-len
	console.info(`eremoran.js successfully parsed ${elements.dict.length} words and recorded statistics.`);
	// expansionProject();
}

function expansionProject(){
	const epoch = 1504561680000;
	const w = elements.dict.length;
	const day = 1000*60*60*24;
	const days = (new Date() - epoch)/day; // https://github.com/Mocha2007/mocha2007.github.io/commit/e0c066b3adcba427b5301c43ba5f5a0eab8556c6
	console.info(`avg. ${round(w/days, 2)} w/d`);
	// eslint-disable-next-line max-len
	console.info(`target of 1 w/d would require ${Math.ceil(days)} words. (${Math.ceil(days) - w} short)`);
	// const _2024 = (new Date(2024, 0, 1) - epoch)/day;
	// const goal = (_2024 - w)/(new Date(2024, 0, 1) - new Date()) * day;
	const currentRate = (w - 900) * day / (new Date() - new Date(2023, 1, 10));
	const eta = new Date(+new Date() + day*(days - w)/(currentRate-1));
	// const _super = (new Date(2023, 8, 4) - epoch)/day;
	// const supergoal = (_super - w)/(new Date(2023, 8, 4) - new Date()) * day;
	// console.info(`${round(goal, 2)} w/d required to reach 2024 goal`);
	// console.info(`${round(supergoal, 2)} w/d required to reach anniversary supergoal`);
	console.info(`ETA @ ${currentRate} w/d = ${eta.toDateString()}`);
}

/** this is run at the end of eremoran.html */
function eremoranMain(){
	// needs to wait a second to download, so put this first
	getDict('eremoran', computeStats);
	// scrolling quotes
	startEreQuote();
	// tooltip for hovering over eremoran words
	EremoranTooltip.setup();
	// print radio buttons
	dialectMap.mode.init();
	// add titles to iframes for accessibility
	Array.from(document.getElementsByTagName('iframe')).forEach(e => e.title = e.id);
}