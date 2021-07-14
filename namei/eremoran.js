/* exported compileDict, compileFinals, compileInitials, compileLength,
	compileMeanings, compileMedials, compileNounClass */
/* global random, round */

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
		// question
		const elemQ = document.createElement('span');
		elemQ.innerHTML = question;
		this.learn.appendChild(elemQ);
		// linebreak
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