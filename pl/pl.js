/* exported Game */
/* global data, proper, storage */
'use strict';

/* type structure...
Viewable
	Gender
	Inpupt
	Item
		Container
			Person
				Player
			Room
combination of shapez.io and papers please
*/

class Viewable {
	constructor(name){
		this.name = name;
	}
	get body(){
		const elem = document.createElement('div');
		return elem;
	}
	get div(){
		const elem = document.createElement('div');
		elem.classList.add('viewableDiv');
		elem.id = `${this.constructor.name}/${this.name}/div`;
		// children
		elem.appendChild(this.header);
		elem.appendChild(this.body);
		return elem;
	}
	get header(){
		const h1 = document.createElement('h1');
		h1.innerHTML = this.name;
		return h1;
	}
	get span(){
		const elem = document.createElement('span');
		elem.innerHTML = this.name;
		elem.classList.add('button');
		elem.onclick = () => this.go();
		return elem;
	}
	go(){
		Game.history.go(this);
	}
}

class Input extends Viewable {
	constructor(prompt, onAnswer){
		super(prompt);
		/** @type {() => {}} */
		this.onAnswer = onAnswer;
	}
	get body(){
		const elem = document.createElement('div');
		// text box
		const ie = document.createElement('input');
		ie.type = 'text';
		ie.id = 'ie';
		elem.appendChild(ie);
		// submit
		const submit = document.createElement('span');
		submit.classList.add('button');
		submit.innerHTML = '&rarr;';
		submit.onclick = () => {
			Game.input.value = document.getElementById('ie').value;
			this.onAnswer();
		};
		return elem;
	}
}

class Gender extends Viewable {
	constructor(name, abbr, subject, oblique, possDet, possPron, refl, title, isPlural){
		super(name); // eg. neuter2
		this.abbr = abbr; // eg. na
		this.subject = subject; // eg. they
		this.oblique = oblique; // eg. them
		this.possDet = possDet; // eg. their
		this.possPron = possPron; // eg. theirs
		this.refl = refl; // eg. themself
		this.title = title; // eg. Mx
		this.isPlural = isPlural; // eg. true
		Gender.list.push(this);
	}
	/** @param {string} s */
	static fromAbbr(s){
		return Gender.list.find(x => x.abbr === s);
	}
	static fromObject(o){
		return new Gender(o.name, o.abbr, o.subject, o.oblique,
			o.possDet, o.possPron, o.refl, o.title ? proper(o.title)+'.' : '?',
			o.isPlural === true);
	}
}
/** @type {Gender[]} */
Gender.list = [];

class Item extends Viewable {
	/**
	 * @param {string} name
	 */
	constructor(name){
		super(name);
		Item.list.push(this);
	}
	get container(){
		return Container.list.find(c => c.contents.includes(this));
	}
	get room(){
		return Room.list.find(r => r.contents.includes(this));
	}
}
/** @type {Item[]} */
Item.list = [];

class Container extends Item {
	/**
	 * @param {string} name
	 */
	constructor(name){
		super(name);
		/** @type {Item[]} */
		this.contents = [];
		Container.list.push(this);
	}
	/** @param {Item} i */
	add(i){
		this.contents.push(i);
	}
	/** @param {Item} i */
	remove(i){
		const index = this.contents.indexOf(i);
		if (-1 < index)
			this.contents.splice(index, 1);
	}
}
/** @type {Container[]} */
Container.list = [];

class Room extends Container {
	/**
	 * @param {string} name
	 */
	constructor(name){
		super(name);
		Room.list.push(this);
	}
}
/** @type {Room[]} */
Room.list = [];

class Person extends Container {
	/**
	 * @param {string} name
	 * @param {Gender} gender - used to determine pronouns
	 */
	constructor(name, gender){
		super(name);
		this.gender = gender;
		Person.list.push(this);
	}
	/** @param {Room} r */
	go(r){
		this.room.remove(this);
		r.add(this);
	}
}
/** @type {Person[]} */
Person.list = [];

class Player extends Person {
	/**
	 * @param {string} name
	 * @param {Gender} gender - used to determine pronouns
	 */
	constructor(name, gender){
		super(name, gender);
		this.money = 100;
	}
}

const Game = {
	/** @type {HTMLDivElement} */
	canvas: document.getElementById('canvas'),
	history: {
		// stores previous screens
		/** @type {Viewable} */
		current: undefined,
		limit: 10,
		/** @type {Viewable[]} */
		logBack: [],
		logForward: [],
		back(n = 1){
			if (n <= 0 || !this.logBack.length)
				return;
			// do its thing
			this.logForward.push(this.current);
			this.current = this.logBack.pop();
			// do again?
			if (1 < n)
				this.back(n-1);
			else
				this.current.go();
			this.cleanHistory();
		},
		cleanHistory(){
			while (this.limit < this.logBack.length)
				this.logBack.shift();
			while (this.limit < this.logForward.length)
				this.logForward.shift();
		},
		forward(n = 1){
			if (n <= 0 || !this.logForward.length)
				return;
			// do its thing
			this.logBack.push(this.current);
			this.current = this.logForward.pop();
			// do again?
			if (1 < n)
				this.forward(n-1);
			else
				this.current.go();
			this.cleanHistory();
		},
		/** @param {Viewable} v */
		go(v){
			Game.canvas.innerHTML = '';
			Game.canvas.appendChild(v.div);
			// record change
			if (this.current)
				this.logBack.push(this.current);
			this.current = v;
		},
	},
	input: {
		ask(question, onAnswer){
			this.value = '';
			const i = new Input(question, onAnswer);
			i.go();
		},
		value: '',
	},
	minigames: {
		line: {
			// todo
		},
	},
	name: 'Production Line',
	new(){
		// get player info like gender
		this.player = new Player();
	},
	/** @type {Player} */
	player: undefined,
	save: {
		// todo
	},
	start(){
		// load data
		data.gender.forEach(o => Gender.fromObject(o));
		// run
		console.info(`${this.name} ${this.version} loaded.`);
		// test
		this.test();
	},
	test(){
		console.debug('test');
		Gender.list[0].go();
	},
	version: 'a1',
};