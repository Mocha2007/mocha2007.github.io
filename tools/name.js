/* exported name */
/* global random, sum, title */

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
	get count(){
		return sum(this.forms.map(
			form => form.map(
				setIds => sum(setIds.map(
					setId => this.sets[setId].length))).reduce((a, b) => a * b, 1)));
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
		if (!Language.languages.length)
			radio.checked = 'checked';
		// label
		const label = document.createElement('label');
		label.innerHTML = this.name;
		label.appendChild(radio);
		container.appendChild(label);
		return this.elem_ = container;
	}
	/** @returns {boolean} */
	get selected(){
		return Language.languages[0].elem.children[0].children[0].checked;
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
		get count(){
			return document.getElementById('count');
		},
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
		this.elem.result.innerHTML = title(this.lang.gen());
	},
	updateCount(){
		this.elem.count.innerHTML = this.lang.count + ' possible names';
	},
};

const DITHEMATIC = [[0], [1]];

new Language('Tragedeigh', [DITHEMATIC],
	/*
		SOURCES
		https://www.reddit.com/r/tragedeigh/comments/14dkpz0/posted_in_my_due_date_group/
	*/
	[
		['at', 'brax', 'bray', 'brex', 'brin', 'bry', 'car', 'ever', 'fyn', 'gray', 'had',
			'hud', 'hunt', 'hux', 'jae', 'jax', 'kash', 'kay', 'kort', 'ky', 'lox', 'oak',
			'pais', 'pay', 'say', 'zay'],
		['cyn', 'don', 'dyn', 'lan', 'lea', 'lee', 'lei', 'leigh', 'ler', 'ley', 'lie', 'lii',
			'lin', 'lyn', 'lynn', 'reigh', 'sen', 'sleigh', 'son', 'ster', 'syn', 'ton', 'tyn',
			'ven', 'zen', 'zlee'],
	]
);

// finally
namegen.updateCount();