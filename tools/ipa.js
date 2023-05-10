/* exported ipa */
/* global ipaData */

class Language {
	/**
	 * @param {string} name
	 * @param {[string, string][]} rules regex replacement rules
	 */
	constructor(name, rules){
		/** @type {string} */
		this.name = name;
		/** @type {[string, string][]} */
		this.rules = rules;
		Language.languages.push(this);
	}
	/** @param {string} s word */
	apply(s){
		this.rules.forEach(r => s = s.replace(new RegExp(r[0], 'gi'), r[1]));
		return s;
	}
	/** @param {string} s name of language */
	static fromString(s){
		return this.languages.find(l => l.name === s);
	}
}

/** @type {Language[]} */
Language.languages = [];

const ipa = {
	elem: {
		/** @type {HTMLInputElement} */
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
	go(){
		const i = this.elem.input.value;
		const l = this.lang;
		const o = l.apply(i);
		this.elem.result.innerHTML = `[${o}]`;
	},
	init(){
		if (this.initialized)
			return;
		console.log('Loading IPA...');
		// make lang buttons and create langs
		ipaData.forEach((o, i) => {
			const label = document.createElement('label');
			label.classList.add('bubble');
			label.style.backgroundColor = '#004';
			label.innerHTML = o.lang;
			const input = document.createElement('input');
			label.appendChild(input);
			input.type = 'radio';
			input.name = 'lang';
			if (!i)
				input.checked = true;
			label.for = input.id = input.name = `lang-${o.lang}`;
			ipa.elem.langs.appendChild(label);
			new Language(o.lang, o.rules);
		});
		// finish
		this.initialized = true;
		console.log(`Successfully loaded IPA (${Language.languages.length} languages).`);
	},
	get lang(){
		return Language.fromString(
			Array.from(ipa.elem.langs.children)
				.find(e => e.children[0].checked).childNodes[0].wholeText);
	},
	wait(){
		this.waitingOn--;
		console.debug(`One dependency loaded (${this.waitingOn} left)`);
		if (this.waitingOn === 0)
			this.init();
	},
	waitingOn: 0,
};

// wait for other modules to load first
/*
if (typeof random !== 'object'){
	console.debug('Waiting on common.js');
	jp.waitingOn++;
	document.getElementById('common').onload = () => jp.wait();
}
*/
if (typeof ipaData !== 'object'){
	console.debug('Waiting on ipaData.js');
	ipa.waitingOn++;
	document.getElementById('ipaData').onload = () => ipa.wait();
}
else if (ipa.waitingOn === 0)
	ipa.init();