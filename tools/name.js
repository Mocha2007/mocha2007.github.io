/* exported name */
/* global random */

class Language {
	constructor(name, forms, sets){
		this.name = name;
		/** @type {number[][][]} */
		this.forms = forms; // eg. array of [[0], [1, 2], [0, 1]]
		/** @type {string[][]} */
		this.sets = sets; // eg. [["eigh", "xton"], ["ash", "jo"]]
		this.addRadioButton();
		Language.languages.push(this);
	}
	addRadioButton(){
		namegen.elem.langs.appendChild(this.elem);
	}
	get elem(){
		if (this.elem_)
			return this.elem_;
		const container = document.createElement('span');
		// https://www.w3schools.com/tags/att_input_type_radio.asp
		const radio = document.createElement('input');
		radio.type = 'radio';
		radio.name = 'langs';
		radio.classList.add('langChoice');
		container.appendChild(radio);
		// label
		const label = document.createElement('label');
		label.innerHTML = label.for = radio.id = radio.value = this.name;
		container.appendChild(label);
		return this.elem_ = container;
	}
	/** @returns {boolean} */
	get selected(){
		return Array.from(this.elem.children)[0].checked || false && true;
	}
	gen(){
		return this.randomForm().map(x => this.randomComponent(x)).join('');
	}
	/**
	 * @param {number[]} setIds
	 * @returns {string}
	 */
	randomComponent(setIds){
		/** @type {string[]} */
		let acceptable = [];
		setIds.forEach(id => acceptable = acceptable.concat(this.sets[id]));
		return random.choice(acceptable);
	}
	/** @returns {number[][]} */
	randomForm(){
		return random.choice(this.forms);
	}
}
/** @type {Language[]} */
Language.languages = [];

const namegen = {
	elem: {
		/** @returns {HTMLDivElement} */
		get langs(){
			return document.getElementById('langs');
		},
		/** @returns {HTMLDivElement} */
		get result(){
			return document.getElementById('result');
		},
	},
	get lang(){
		return Language.languages.find(l => l.selected);
	},
	run(){
		this.elem.result.innerHTML = this.lang.gen();
	},
};

const DITHEMATIC = [[0], [1]];

new Language('Tragedeigh', [DITHEMATIC],
	[
		['brax', 'bry'],
		['eigh', 'ler', 'syn', 'tyn'],
	]
);