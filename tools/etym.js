/* exported etym */
/* global etymData, etymLangData */

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
		let match, re;
		if (!this.forms.some(f => (re = new RegExp(`^${match = f}`)).test(s)))
			return false;
		return [this, match, s.replace(re, '')];
	}
}
/** @type {Root[]} */
Root.roots = [];

const etym = {
	get acceptableLangs(){
		return Array.from(this.elem.langs.children).map(e => e.children[0])
			.filter(e => e.checked).map(e => e.id.slice(5));
	},
	elem: {
		/** @type {HTMLTextAreaElement} */
		get input(){
			return document.getElementById('input');
		},
		/** @type {HTMLDivElement} */
		get langs(){
			return document.getElementById('langs');
		},
		/** @type {HTMLDivElement} */
		get result(){
			return document.getElementById('result');
		},
	},
	debug: window.location.origin[0] === 'f', // http://mocha2007.github.io, or file://?
	go(){
		const s = this.elem.input.value.toLowerCase().replace(/[^a-z]/, '');
		if (s)
			this.solve(s);
	},
	init(){
		if (this.initialized)
			return;
		// make lang buttons
		etymLangData.forEach(l => {
			const label = document.createElement('label');
			label.classList.add('bubble');
			label.style.backgroundColor = '#004';
			label.innerHTML = l;
			const input = document.createElement('input');
			label.appendChild(input);
			input.type = 'checkbox';
			input.checked = true;
			label.for = input.id = input.name = `lang-${l}`;
			etym.elem.langs.appendChild(label);
		});
		// import
		etymData.forEach(x => new Root(x));
		// sort etyms
		Root.roots.sort((a, b) => b.forms[0].length - a.forms[0].length);
		this.initialized = true;
		console.log(`etym: ${Root.roots.length} roots loaded`);
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
		const langs = this.acceptableLangs;
		while (some){
			some = false;
			for (const r of Root.roots){
				if (!langs.includes(r.lang))
					continue;
				if (this.debug)
					console.debug(`testing ${word} for root ${r.head}...`);
				const o = r.matches(word);
				if (o){
					solution.push(o[0]);
					solution2.push(o[1]);
					word = o[2];
					some = true;
					if (this.debug)
						console.debug(`${word} matches ${r.head}!`);
					break;
				}
			}
			if (word.length < 1)
				break;
		}
		solution.forEach((r, i) => this.elem.result.appendChild(r.elem(solution2[i])));
		if (word) // residual
			this.elem.result.appendChild(this.residual(word));
		return word.length === 0;
	},
	testTaxa(i = -1){
		if (typeof lifeData === 'undefined') {
			if (!this.testTaxaLoad) {
				const script = document.createElement('script');
				script.onload = () => {}; // onload;
				script.src = '../life/life_data.js';
				document.head.appendChild(script);
				this.testTaxaLoad = true;
			}
			setTimeout(() => this.testTaxa(i), 100);
			return;
		}
		// choose random
		let success = true;
		let name, taxon;
		if (i < 0){
			i = Math.floor(Math.random() * lifeData.length);
		}
		do {
			taxon = lifeData[i];
			/** @type {string[]} */
			const words = taxon.name.split(' ');
			name = words[words.length-1];
			success = this.solve(name);
			if (success) {
				console.debug(`${name} good`);
			}
			i++;
		} while (success && i < taxon.length)
		console.warn(i, taxon.name, taxon, `https://en.wikipedia.org/wiki/${taxon.name}`);
	},
	testTaxaLoad: false,
};

if (typeof etymLangData !== 'object')
	document.getElementById('etymData').onload = etym.init;
else
	etym.init();