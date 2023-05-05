/* exported etym */
/* global etymData */

class Root {
	constructor(o){
		/** @type {string} */
		this.head = o.head;
		/** @type {string} */
		this.lang = o.lang;
		/** @type {string} */
		this.gloss = o.gloss;
		/** @type {string[]} */
		this.forms = o.forms;
		Root.roots.push(this);
	}
	elem(s){
		return etym.rootCard(s, this.head, this.gloss, this.lang);
	}
	/**
	 * @param {string} s
	 * @returns {false | [string, string]}
	 */
	matches(s){
		let match;
		if (!this.forms.some(f => new RegExp(`^${match = f}`).test(s)))
			return false;
		return [this, match, s.replace(match, '')];
	}
}
/** @type {Root[]} */
Root.roots = [];

const etym = {
	elem: {
		/** @type {HTMLTextAreaElement} */
		get input(){
			return document.getElementById('input');
		},
		/** @type {HTMLDivElement} */
		get result(){
			return document.getElementById('result');
		},
	},
	debug: true,
	go(){
		this.init();
		this.solve(this.elem.input.value);
	},
	init(){
		if (this.initialized)
			return;
		etymData.forEach(x => new Root(x));
		Root.roots.sort(r => -r.forms[0].length);
		this.initialized = true;
	},
	reset(){
		this.elem.result.innerHTML = '';
	},
	/** @param {string} s */
	residual(s){
		return this.rootCard(s);
	},
	/** @param {string} title */
	rootCard(match, title = '???', gloss = '???', lang = '???'){
		// todo
		const elem = document.createElement('div');
		elem.classList.add('bubble');
		elem.style.textAlign = 'center';
		elem.style.display = 'inline-block';
		elem.style.backgroundColor = '#222';
		// eslint-disable-next-line max-len
		elem.innerHTML = `<em>${match}</em><br><strong>${title}</strong><br><q>${gloss}</q><br>${lang}`;
		return elem;
	},
	/** @param {string} word */
	solve(word){
		this.reset();
		/** @type {Root[]} */
		const solution = [];
		/** @type {string[]} */
		const solution2 = [];
		let some = true;
		while (some){
			some = false;
			for (const r of Root.roots){
				if (this.debug)
					console.debug(`testing ${word} for root ${r.head}...`);
				const o = r.matches(word);
				if (o){
					solution.push(o[0]);
					solution2.push(o[1]);
					word = o[2];
					some = true;
					break;
				}
			}
			if (word.length < 1)
				break;
		}
		solution.forEach((r, i) => this.elem.result.appendChild(r.elem(solution2[i])));
		if (word) // residual
			this.elem.result.appendChild(this.residual(word));
	},
};