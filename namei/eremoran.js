/* exported compileDict, compileFinals, compileInitials, compileLength,
	compileMeanings, compileMedials, compileNounClass, EremoranTooltip */
/* global random, range, round */

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
		const desiredWordElement = this.words.filter(dt => dt.innerHTML.replace('f', 'h') === word)[0];
		/** @type {HTMLElement[]} */
		const elementsInDict = Array.from(desiredWordElement.parentElement.children);
		const beginIndex = elementsInDict.indexOf(desiredWordElement);
		const endIndex = elementsInDict.indexOf(elementsInDict.slice(beginIndex+1).find(elem => elem.tagName.toLowerCase() === 'dt'));
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
		eremoranTags.forEach(elem => {
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
				const fixedword = word.replace('f', 'h').toLowerCase();
				span.innerHTML = fixedword;
				span.classList.add('eremoranWord');
				span.onmouseover = () => this.showTooltip(fixedword, span);
				span.onmouseout = () => this.clearTooltip();
				elem.appendChild(span);
				span.appendChild(rt);
			});
		});
	},
	/**
	 * @param {string} word
	 * @param {HTMLSpanElement} elem
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