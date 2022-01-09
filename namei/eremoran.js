/* exported compileDict, compileFinals, compileInitials, compileLength,
	compileMeanings, compileMedials, compileNounClass, EremoranTooltip,
	computeStats, numberTool, autoUp */
/* global commaNumber, random, range, round, union */

'use strict';

// tools for main
/** @param {HTMLDListElement} - the entire dictionary element*/
const d = document.getElementsByClassName('dictionary')[0];
/** @param {string[]} - array of words*/
const dict = new Array(...d.getElementsByTagName('dt')).map(e => e.innerHTML);
/** @param {HTMLParagraphElement} - the element with the buttons*/
const p = document.getElementById('wordlist');

// main
function compileDict(){
	p.innerHTML = dict.join(' ');
}

function compileFinals(){
	p.innerHTML = dict.map(w => w[w.length-1]).join('');
}

function compileInitials(){
	p.innerHTML = dict.map(w => w[0]).join('');
}

function compileLength(){
	p.innerHTML = dict.map(w => w.length).join(' ');
}

function compileMeanings(){
	p.innerHTML = new Array(...d.getElementsByTagName('dd'))
		.filter(x => 0 < x.getElementsByTagName('ol').length)
		.map(x => x.getElementsByTagName('ol')[0].children.length).join(' ');
}

function compileMedials(){
	p.innerHTML = dict.map(w => w.slice(1, -1)).join('');
}

function compileNounClass(){
	p.innerHTML = new Array(...d.getElementsByTagName('dd'))
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
	words: undefined,
	clearTooltip(){
		this.tooltip.innerHTML = '';
		this.tooltip.style.display = 'none';
		this.tooltip.style.left = this.tooltip.style.right = '';
	},
	/** @param {string} word */
	getDef(word){
		// collect target elements
		const desiredWordElement = this.words.filter(dt => dt.innerHTML.toLowerCase() === word)[0];
		/** @type {HTMLElement[]} */
		const elementsInDict = Array.from(desiredWordElement.parentElement.children);
		const beginIndex = elementsInDict.indexOf(desiredWordElement);
		let endIndex = elementsInDict.indexOf(elementsInDict.slice(beginIndex+1).find(elem => elem.tagName.toLowerCase() === 'dt'));
		if (endIndex === -1)
			endIndex = elementsInDict.length;
		// create container
		const container = document.createElement('dl');
		range(beginIndex, endIndex).forEach(i => {
			container.appendChild(elementsInDict[i].cloneNode(true));
		});
		return container;
	},
	setup(){
		// store data
		this.words = Array.from(document.getElementsByTagName('dt'));
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
	document.getElementById('wordcount').innerHTML = EremoranTooltip.words.length;
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
namegen.either = ['afês', 'ardo', 'badm', 'bi', 'hisk', 'kafl', 'ko', 'lib',
	'lusi', 'mar', 'tem', 'uris'];
namegen.first = union(namegen.either,
	['bêt', 'dare', 'end', 'ere', 'ku', 'lak', 'maram', 'saz', 'si']
);
namegen.last = union(namegen.either,
	['bazê', 'ke', 'kiki', 'labni', 'len', 'mo', 'subi']
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
toponym.either = ['bemmu', 'len', 'nô', 'nul'];
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