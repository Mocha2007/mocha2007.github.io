// solver for https://www.nytimes.com/games/digits
/* exported shuggerlain */
/* global getAllSubsets, sum, unique */

class Action {
	/** @param {string} name */
	constructor(name, d_min = 0, d_max = 0, mana = 0, ap = 1){
		this.name = name;
		this.d_min = d_min;
		this.d_max = d_max;
		this.mana = mana;
		this.ap = ap;
		Action.actions.push(this);
	}
	get canAct(){
		return this.mana <= shuggerlain.mana && this.ap <= shuggerlain.ap && this.character.canAct;
	}
	get character(){
		return Character.characters.find(c => c.actions.includes(this));
	}
	get d_avg(){
		return (this.d_max + this.d_min)/2;
	}
	get string(){
		return `${this.name} (${this.character.name})`;
	}
}
/** @type {Action[]} */
Action.actions = [];

class Character {
	/**
	 * @param {string} name
	 * @param {Action[]} actions
	 */
	constructor(name, actions){
		this.name = name;
		this.actions = actions;
		Character.characters.push(this);
	}
	get canAct(){
		return this.selected
			&& this.actions.some(a => a.mana <= shuggerlain.mana && a.ap <= shuggerlain.ap);
	}
	get elem(){
		const label = document.createElement('label');
		label.innerHTML = this.name;
		const input = document.createElement('input');
		label.appendChild(input);
		input.type = 'checkbox';
		label.for = input.id = input.name = this.elemId;
		return label;
	}
	get elemId(){
		return `c${this.id}`;
	}
	get id(){
		return Character.characters.indexOf(this);
	}
	/** @returns {boolean} */
	get selected(){
		return document.getElementById(this.elemId).checked;
	}
}
/** @type {Character[]} */
Character.characters = [];
new Character('Nulkan', [
	new Action('Ashteran Fury', 300, 350),
	new Action('Dark Slash', 450, 550, 60),
]);
new Character('Dynae', [
	new Action('Arcane Pulse', 340, 390, 20),
	new Action('Lightning Bolt', 820, 910, 120, 2),
]);
new Character('Nadine', [
	new Action('Cavalry Attack', 320, 380),
	new Action('Final Stomp', 470, 560, 85),
]);

const shuggerlain = {
	/** @param {Action[]} actions */
	actionPossible(actions){
		const ap = actions.map(a => a.ap);
		const mana = actions.map(a => a.mana);
		return sum(ap) <= this.ap && sum(mana) <= this.mana
			&& actions.map(a => a.character).filter(unique).length === actions.length;
	},
	get ap(){
		return +this.elem.ap.value;
	},
	button(){
		const actions = Action.actions.filter(a => a.canAct);
		/** @type {Action[][]} */
		const actionSets = getAllSubsets(actions).filter(aa => this.actionPossible(aa));
		const maxDamage = Math.max(...actionSets.map(aa => sum(aa.map(a => a.d_avg))));
		/** @type {Action[]} */
		const bestSet = actionSets.find(aa => maxDamage === sum(aa.map(a => a.d_avg)));
		const s = bestSet.map(a => a.string).join(' + ');
		// eslint-disable-next-line max-len
		this.elem.output.innerHTML = `${s} (${sum(bestSet.map(a => a.d_min))} - ${sum(bestSet.map(a => a.d_max))} damage, avg. ${maxDamage})`;
	},
	elem: {
		/** @returns {HTMLInputElement} */
		get ap(){
			return document.getElementById('ap');
		},
		/** @returns {HTMLDivElement} */
		get characterContainer(){
			return document.getElementById('characterContainer');
		},
		/** @returns {HTMLInputElement} */
		get mana(){
			return document.getElementById('mana');
		},
		/** @returns {HTMLSpanElement} */
		get output(){
			return document.getElementById('output');
		},
	},
	initialized: false,
	init(){
		if (this.initialized)
			return;
		// add character elems
		Character.characters.forEach(c => this.elem.characterContainer.appendChild(c.elem));
	},
	get mana(){
		return +this.elem.mana.value;
	},
};

shuggerlain.init();