/* exported adjTool, compileDict, compileFinals, compileInitials, compileLength,
	compileMeanings, compileMedials, compileNounClass, EremoranTooltip,
	computeStats, numberTool, autoUp, wordle */
/* global charHisto, commaNumber, histo, random, round, union */

'use strict';

// tools for main
const elements = {
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
	elements.p.innerHTML = new Array(...elements.d.getElementsByTagName('dd'))
		.filter(x => x.innerHTML.slice(0, 3) === 'n.,')
		.map(x => x.innerHTML[4]).join(' ');
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
			span.innerHTML = fixedword
				.replace(/f/g, 'h')
				.replace(/á/g, 'a')
				.replace(/é/g, 'e')
				.replace(/ó/g, 'o');
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
	document.getElementById('chartLetter').src = `../tools/chart.html?data=${charHisto(compileDict.data().replace(/\s/g, ''))}`;
	document.getElementById('chartInitial').src = `../tools/chart.html?data=${charHisto(compileInitials.data())}`;
	document.getElementById('chartMedial').src = `../tools/chart.html?data=${charHisto(compileMedials.data())}`;
	document.getElementById('chartFinal').src = `../tools/chart.html?data=${charHisto(compileFinals.data())}`;
	document.getElementById('chartLength').src = `../tools/chart.html?data=${histo(compileLength.data())}`;
	document.getElementById('chartMeaning').src = `../tools/chart.html?data=${histo(compileMeanings.data())}`;
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

// todo: function to create histogram of all words in .eremoran elements