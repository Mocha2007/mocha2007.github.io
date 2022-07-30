/* exported adjTool, autoUp, compileDict, compileFinals, compileInitials,
	compileLength, compileMeanings, compileMedials, compileNounClass,
	computeStats, EremoranTooltip, numberTool, search, titleCard, wordle */
/* global charHisto, commaNumber, histo, random, round, union */

'use strict';

// tools for main
const elements = {
	/** @type {string[]} */
	categories: [],
	/** @returns {HTMLDListElement} - the entire dictionary element*/
	get d(){
		return document.getElementsByClassName('dictionary')[0];
	},
	/** @type {string[]} - array of words*/
	dict: [],
	/** @returns {HTMLParagraphElement} - the element with the buttons*/
	get p(){
		return document.getElementById('wordlist');
	},
	raws: [],
};

// main
function compileDict(){
	elements.p.innerHTML = compileDict.data();
}
compileDict.data = () => elements.dict.join(' ');

function compileFinals(){
	elements.p.innerHTML = compileFinals.data();
}
compileFinals.data = () => elements.dict.map(w => w[w.length-1]).join('');

function compileInitials(){
	elements.p.innerHTML = compileInitials.data();
}
compileInitials.data = () => elements.dict.map(w => w[0]).join('');

function compileLength(){
	elements.p.innerHTML = compileLength.data().join(' ');
}
compileLength.data = () => elements.dict.map(w => w.length);

function compileMeanings(){
	elements.p.innerHTML = compileMeanings.data().join(' ');
}
compileMeanings.data = () => new Array(...elements.d.getElementsByTagName('dd'))
	.filter(x => 0 < x.getElementsByTagName('ol').length)
	.map(x => x.getElementsByTagName('ol')[0].children.length);

function compileMedials(){
	elements.p.innerHTML = compileMedials.data();
}
compileMedials.data = () => elements.dict.map(w => w.slice(1, -1)).join('').replace(/\s/g, '');

function compileNounClass(){
	elements.p.innerHTML = compileNounClass.data().join(' ');
}
compileNounClass.data = () => new Array(...elements.d.getElementsByClassName('lemmaType'))
	.filter(x => x.innerHTML.slice(0, 3) === 'n.,')
	.map(x => x.innerHTML[4]);

/** f -> h &c to match font */
function normalizeEremoran(s){
	return s.replace(/f/g, 'h');
}

// learn eremoran!

const LE = {
	learn: document.getElementById('learn'),
	new(canIUseReview = true){
		// blank
		this.learn.innerHTML = '';
		// old or new?
		const [question, answer] = canIUseReview && this.review.list.length && random.random() < 0.5
			? random.choice(this.review.list) // old
			: this.random.supraclause(); // new
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
			const choice = random.choice(LE.shapes.clause);
			/** @type {[string, string]} */
			const subj = this.noun();
			const obj = this.noun();
			choice[0] = choice[0].replace('$subj', subj[0]).replace('$obj', obj[0]);
			choice[1] = choice[1].replace('$subj', subj[1]).replace('$obj', obj[1]);
			return choice;
		},
		/** @returns {[string, string]} */
		noun(){
			return random.choice(LE.shapes.noun);
		},
		supraclause(){
			/** @type {[string, string]} */
			const choice = random.choice(LE.shapes.supraclause);
			/** @type {[string, string]} */
			const c = this.clause();
			choice[0] = choice[0].replace('$c', c[0]);
			choice[1] = choice[1].replace('$c', c[1]);
			return choice;
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
		element: document.getElementById('review'),
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
	shapes: {
		clause: [
			['$subj i ad $obj afkaz', '$subj goes to $obj'],
			['$subj i dir $obj namz', '$subj eats $obj'],
			['$subj i dir $obj saurz', '$subj sees $obj'],
		],
		noun: [
			['arêôk', 'the cow'],
			['badmak', 'the fox'],
			['bôk', 'the chicken'],
			['danôak', 'the bug'],
			['dirak', 'the whale'],
			['ek', 'the horse'],
			['hisk', 'the crow'],
			['lusik', 'the dog'],
			['mor', 'the person'],
			['roraok', 'the cat'],
		],
		supraclause: [
			['$c', '$c'],
			['$c uid', '$c not'],
		],
	},
};
// replace each word in eremoran class span with <span ... >
// which creates a tooltip with the word info!

const EremoranTooltip = {
	id: 'eremoran_tooltip',
	/** @type {HTMLDivElement} */
	tooltip: undefined,
	visible: true,
	/** @type {HTMLElement[]} */
	get words(){
		return Array.from(document.getElementsByTagName('dt'));
	},
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
			if (i){
				const sp = document.createElement('span');
				sp.innerHTML = ' ';
				elem.appendChild(sp);
			}
			const span = document.createElement('ruby');
			const rt = document.createElement('rt'); // ruby top
			rt.innerHTML = word.toUpperCase();
			const fixedword = word.toLowerCase();
			span.innerHTML = normalizeEremoran(fixedword);
			span.classList.add('eremoranWord');
			span.onmouseover = () => EremoranTooltip.showTooltip(fixedword, span);
			span.onmouseout = () => EremoranTooltip.clearTooltip();
			elem.appendChild(span);
			span.appendChild(rt);
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

function computeStats(){
	// print dict length
	document.getElementById('wordcount').innerHTML = EremoranTooltip.words.length;
	// new graphs
	// const chartURL = 'https://mocha2007.github.io/tools/chart.svg?data=';
	const chartURL = '../tools/chart.svg?data=';
	document.getElementById('chartLetter').src = chartURL + charHisto(
		normalizeEremoran(compileDict.data().replace(/\s/g, ''))
	);
	document.getElementById('chartInitial').src = chartURL + charHisto(normalizeEremoran(compileInitials.data()));
	document.getElementById('chartMedial').src = chartURL + charHisto(normalizeEremoran(compileMedials.data()));
	document.getElementById('chartFinal').src = chartURL + charHisto(normalizeEremoran(compileFinals.data()));
	document.getElementById('chartLength').src = chartURL + histo(compileLength.data());
	document.getElementById('chartMeaning').src = chartURL + histo(compileMeanings.data());
	document.getElementById('chartClass').src = chartURL + histo(compileNounClass.data());
	// do word histogram
	const wordData = (quotes.map(i => i[0]).join(' ') + ' '
		+ Array.from(document.getElementsByClassName('corpus')).map(elem => elem.innerHTML).join(' ')
		).replace(/ [:\/.,]/g, '').replace(/\s+/g, ' ').toLowerCase().split(' ');
	// const filteredWordData = wordData.filter(word => wordData)
	document.getElementById('chartWord').src = chartURL + histo(wordData, true, true, 4);
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
}

/**
 * @param {number} x
 * @returns {string}
 */
function ereNum(x){
	if (x < 15)
		return ereNum.first[x];
	if (x < 80){
		const fives = Math.floor(x / 5);
		const remainder = x % 5;
		const fivesWord = `${ereNum(fives).replace(/u$/g, '')}anu`;
		const onesWord = ereNum.first[remainder];
		return `${fivesWord} ${onesWord}`.replace(/ $/g, '');
	}
	if (x < 100)
		return `kumkananu ${ereNum(x-75)}`;
	if (x < 200)
		return `sesu ${ereNum(x-100)}`.replace(/ $/g, '');
	const hundreds = Math.floor(x / 100);
	const remainder = x % 100;
	const hundredsWord = `${ereNum(hundreds)}sesu`.replace(' ', 'sesu ').replace('idsesu', 'sesu ');
	const onesWord = ereNum(remainder);
	return `${hundredsWord} ${onesWord}`.replace(/ $/g, '');
}
ereNum.first = [
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
];

function numberTool(){
	/** @type {number} */
	const input = document.getElementById('eremoranNumberInput').value;
	/** @type {HTMLQuoteElement} */
	const o = document.getElementById('eremoranNumberOutput');
	// main
	o.innerHTML = ereNum(input);
	// recompute tooltips
	EremoranTooltip.setupWord(o);
}

/** toggle eremoran number tool auto-up */
function autoUp(){
	autoUp.on = !autoUp.on;
	if (autoUp.on)
		autoUp.interval = setInterval(() => {
			document.getElementById('eremoranNumberInput').value++;
			numberTool();
		}, 100);
	else
		clearInterval(autoUp.interval);
}

function namegen(){
	const elem = document.getElementById('namegen_out');
	elem.innerHTML = `${ngTemplate(namegen.first, namegen.last, 'a', 'i', 'sur')} ${ngTemplate(namegen.first, namegen.last, 'a', 'a', 'r')}`;
	// recompute tooltips
	EremoranTooltip.setupWord(elem);
	namegen.updateCombos();
}
// todo: bold? army? fame? fortress bear gift
namegen.vowels = 'aeiouêô';
namegen.either = ['afês', 'ardo', 'badm', 'bi', 'kafl', 'ko', 'lib',
	'lusi', 'mar', 'mas', 'tem', 'uris'];
namegen.first = union(namegen.either,
	['bêt', 'dare', 'end', 'ere', 'hem', 'hisk', 'ku', 'lak', 'maram', 'saz', 'si', 'tranz']
);
namegen.last = union(namegen.either,
	['bazê', 'fem', 'fisk', 'ke', 'kiki', 'labni', 'len', 'mo', 'subi']
);
namegen.endsWithVowel = s => namegen.vowels.includes(s[s.length-1]);
namegen.startsWithVowel = s => namegen.vowels.includes(s[0]);
namegen.updateCombos = () => document.getElementById('namegen_combos').innerHTML
	= commaNumber(Math.pow(namegen.first.length * namegen.last.length, 2));

/**
 * @param {string[]} firsts acceptable first components
 * @param {string[]} lasts acceptable last components
 * @param {string} midAnaptyxis vowel to insert between first and last components if necessary
 * @param {string} endAnaptyxis vowel to insert between suffix and last component if necessary
 * @param {string} suffix
 */
function ngTemplate(firsts, lasts, midAnaptyxis = '', endAnaptyxis = '', suffix = ''){
	/** @type {string} */
	let name = random.choice(firsts);
	/** @type {string} */
	const last = random.choice(lasts);
	if (!namegen.endsWithVowel(name)
			&& !namegen.startsWithVowel(last))
		name += midAnaptyxis;
	name += last;
	// generate name
	if (!namegen.endsWithVowel(name))
		name += endAnaptyxis;
	name += suffix;
	return name;
}

function toponym(){
	const elem = document.getElementById('toponym_out');
	elem.innerHTML = ngTemplate(toponym.first, toponym.last, 'a');
	// recompute tooltips
	EremoranTooltip.setupWord(elem);
	toponym.updateCombos();
}
// todo: city/fort clearing
toponym.either = ['bemmu', 'len', 'mura', 'nô', 'nul'];
toponym.first = union(toponym.either,
	['ake', 'end', 'ere', 'hai', 'huk', 'kan', 'kokin', 'ku', 'kure', 'lak', 'lib', 'muk',
		'n', 'nats', 'sed', 'si', 'tar', 'tas']
);
toponym.last = union(toponym.either,
	['alika', 'ammut', 'da', 'damu', 'kokint', 'lira', 'mam', 'mamat', 'mor', 'saurom', 'seda',
		'sedat']
);
toponym.updateCombos = () => document.getElementById('toponym_combos').innerHTML
	= commaNumber(toponym.first.length * toponym.last.length);

/** @param {string} indexForm */
function adjDecline(indexForm){
	const gendered = indexForm[indexForm.length-1] === 'u';
	const stem = gendered ? indexForm.slice(0, indexForm.length - 1) : indexForm;
	const [comparative, superlative, equative] = [
		stem + 'udou',
		stem + 'udoid',
		stem + 'osaz',
	];
	const positive = gendered
		? adjClasses(indexForm) : adjClassless(indexForm);
	const ee = [
		{name: 'Positive', elem: positive},
		{name: 'Comparative', elem: adjClasses(comparative)},
		{name: 'Superlative', elem: adjClassless(superlative)},
		{name: 'Equative', elem: adjClassless(equative)},
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
}

/** @param {string} adj */
function adjClassless(adj){
	const elem = document.createElement('span');
	elem.innerHTML = adj;
	return elem;
}

/** @param {string} adj */
function adjClasses(adj){
	const forms = [adj + 'r', adj + 'k', adj + 't', adj, adj + 'm'];
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
}

function adjTool(){
	/** @type {string} */
	const adj = document.getElementById('adjInput').value;
	const output = document.getElementById('adjOutput');
	output.innerHTML = '';
	output.appendChild(adjDecline(adj));
}

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

/** @param {string} s */
function titleCard(s){
	const span = document.createElement('span');
	// hotlink to entry
	/** @type {HTMLAnchorElement} */
	const anchor = document.createElement('a');
	anchor.href = `#lemma-${s}`;
	anchor.innerHTML = '*';
	span.appendChild(anchor);
	// entry title
	const ereTitle = document.createElement('span');
	ereTitle.innerHTML = s;
	ereTitle.classList.add('eremoran');
	EremoranTooltip.setupWord(ereTitle);
	span.appendChild(ereTitle);
	return span;
}

const search = {
	appendResult(s){
		const li = document.createElement('li');
		li.appendChild(titleCard(s));
		this.searchResults.appendChild(li);
	},
	/** @returns {string} */
	get category(){
		return document.getElementById('categorySearch').value;
	},
	input(){
		this.resetResults();
		elements.raws.filter(o => {
			// category match
			if (this.category !== 'any' && (!o.categories || !o.categories.includes(this.category)))
				return false;
			return true;
		}).forEach(o => this.appendResult(o.title));
	},
	resetResults(){
		this.searchResults.innerHTML = '';
	},
	/** @returns {HTMLUListElement} */
	get searchResults(){
		return document.getElementById('searchResults');
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
		const word = normalizeEremoran(s);
		const syllables = this.syllabify(word);
		if (2 <= syllables.length)
			syllables[syllables.length-2] = syllables[syllables.length-2].toUpperCase();
		const ipa = this.ipa(word);
		const syllabification = syllables.join('-');
		const irr = elements.raws.find(w => w.title === s).pron; // irregular pron?
		span.innerHTML = `IPA: [${irr || ipa}] &ndash; Syllabification: ${syllabification}`;
		// debug warning
		this.validate(word);
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
			this.vowels.ortho.forEach(
				(v, j) => syll = syll.replace(v, this.vowels[stress][j]));
			// consonants
			this.consonants.ortho.forEach(
				(c, j) => syll = syll.replace(new RegExp(c, 'g'), this.consonants.ipa[j]));
			// coda liquids
			const divisions = this.divideSyllable(syll);
			divisions[2] = divisions[2].replace('l', 'ʕʷ').replace('ʀ', 'ʀʷ');
			// if (stress === 'stressed')
			//	syll = 'ˈ' + syll;
			return syll;
		});
		let o = ipaSyllables.join(''); // '.'
		// o = o.replace('.ˈ', 'ˈ');
		// misc allophones
		o = o.replace(/nk/g, 'ŋk')
			.replace(/^f/, 'h')
			.replace(/^k/, 'g')
			.replace(/(?<=[aeiouəɛɪɔʊ])b(?=[aeiouəɛɪɔʊ])/g, 'w')
			.replace(/(?<=[aeiouəɛɪɔʊ])d(?=[aeiouəɛɪɔʊ])/g, 'ɾ')
			.replace(/(?<=[aɔ])ʀ(?![eiɛɪ])/g, 'ħ')
			.replace(/ɪ$/, 'i') // i/u do not reduce word-finally
			.replace(/ʊ$/, 'u') // i/u do not reduce word-finally
			.replace(/kz$/, 'ks') // fix verb ending weirdness
			.replace(/pz$/, 'ps') // fix verb ending weirdness
			.replace(/tz$/, 'ts') // fix verb ending weirdness
			.replace(/kʀ/g, 'qʀ') // velar + r
			.replace(/gʀ/g, 'ɢʀ'); // velar + r
		// syllabify
		/*
		o = this.syllabify(o).map((syll, i) =>
			(i === syllables.length - 2
				? 'ˈ' : i ? '.' : '') + syll
		).join('');
		*/
		return o;
	},
	/** @param {string} word */
	syllabify(word){
		const rev = word.split('').reverse().join('');
		const regex = /(([sz][bdkmnpt])|([kt][sn])|([bdhkmnpstz][lr])|(tk)|([bdhklmnprstz]))?[aeiouêô]((r[bdkpt])|([ptk]s|(lk)|([bdhklmnprstz])))?/g;
		return rev.match(regex).reverse().map(s => s.split('').reverse().join(''));
	},
	/** @param {string} word */
	validate(word){
		// debug warnings
		const syllTest = this.syllabify(word).join('');
		if (syllTest !== word.replace(/ /g, ''))
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
	proto: {
		/** @type {{string: {string: number}}} */
		data: {'^': {}},
		/** @param {string} pform */
		evolve(pform){
			// todo
			pform = pform
				.replace(/x[eê]x?/g, 'a')
				.replace(/[eê]x/g, 'a')
				.replace(/x/g, 'k')
				.replace(/i(?=[aeiouêô])/g, 'j')
				.replace(/^[ɸs](?=[aeiouêô])/g, 'h')
				.replace(/(?<=[aeiouêôbdlmnrz])s(?=[aeiouêôbdlmnrz]|$)/g, 'z')
				.replace(/(?<=[aeiouêôbdlmnrz])ss(?=[aeiouêôbdlmnrz]|$)/g, 's')
				.replace(/(?<=[aeiouêô])ɸu/g, 'u') // the lookbehind might be unnecessary
				.replace(/ɸ/g, 'f')
				.replace(/β/g, 'b')
				.replace(/sj/g, 'ʃ')
				.replace(/zj/g, 'ʒ')
				.replace(/tj/g, 'tʃ')
				.replace(/dj/g, 'dʒ')
				.replace(/ʃ/g, 's')
				.replace(/ʒ/g, 'z')
				.replace(/g/g, 'k')
				.replace(/ts/g, 's');
			return pform;
		},
		gen(){
			return gen.markov.gen(this, this.evolve);
		},
		init(){
			this.pforms = elements.raws.map(o => {
				const matches = o.etym.replace(/[;:,.]/g, '').match(/^Proto-Eremo-Numoran *[^ ]+(?= )/g);
				if (matches)
					return matches[0].slice(21);
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
		validatePforms(){
			if (!this.initialized)
				this.init();
			let pformi = 0;
			elements.raws.forEach(o => {
				if (!o.etym.includes(this.pforms[pformi]))
					return; // continue
				const pform = this.pforms[pformi];
				const expected = normalizeEremoran(o.title).replace(/kz$/g, 'ks').replace(/tz$/g, 'ts').replace('-', '');
				const actual = phono.syllabify(normalizeEremoran(this.evolve(pform))).join('');
				if (expected !== actual)
					console.warn(`${expected} expected, but ${pform} => ${actual}`);
				pformi++;
			});
			console.log('P-Form validation complete.');
		}
	},
	markov: {
		/** @type {{string: {string: number}}} */
		data: {'^': {}},
		gen(o = gen.markov){
			if (!o.initialized)
				o.init();
			let choice = '^';
			let str = '';
			while (choice !== '$'){
				// pick next char
				const choices = Object.keys(o.data[choice]);
				const weights = choices.map(c => o.data[choice][c]);
				const next = random.weightedChoice(choices, weights);
				str += next;
				choice = next;
			}
			str = str.slice(0, -1);
			if (o.prevalidationF)
				str = o.prevalidationF(str);
			try {
				if (phono.validate(normalizeEremoran(str)))
					return str;
			}
			catch {} // retry
			return this.gen(o); // retry
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
					if(output[char][next])
						output[char][next]++;
					else
						output[char][next] = 1;
				});
			});
			this.initialized = true;
		},
	},
};