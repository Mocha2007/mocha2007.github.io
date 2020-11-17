/* eslint-disable */
'use strict';

const classLists = {
	/** @type {Container[]} */
	container: [],
	/** @type {Item[]} */
	item: [],
	/** @type {Person[]} */
	person: [],
	/** @type {Pronoun[]} */
	pronoun: [],
	/** @type {Room[]} */
	room: [],
};

class Pronoun {
	constructor(subject, object, poss_det, poss_pron, reflexive, plural=false){
		this.subject = subject;
		this.object = object;
		this.poss_det = poss_det;
		this.poss_pron = poss_pron;
		this.reflexive = reflexive;
		this.plural = plural;
		classLists.pronoun.push(this);
	}
}

const pronM = new Pronoun("he", "him", "his", "his", "himself");
const pronF = new Pronoun("she", "her", "her", "hers", "herself");
const pronN = new Pronoun("it", "it", "its", "its", "itself");
const pronP = new Pronoun("they", "them", "their", "theirs", "themselves", true);
const pronThey = new Pronoun("they", "them", "their", "theirs", "themself", true);

const verbs = [
	// go to (for rooms)
	["Look", i => () => i.Look(), () => true],
	// look around (for containers)
	// speak to (for people)
	// take (for take)
];

class Item {
	constructor(name, desc="", tags=[], imgsrc="", plural=false){
		this.name = name;
		this.desc = desc;
		this.tags = tags;
		this.imgsrc = imgsrc;
		this.pronoun = this.plural ? pronP : pronN;
		classLists.item.push(this);
	}
	get menu(){
		/** @type {HTMLDivElement} */
		const elem = document.createElement("div");
		// list items
		verbs.filter(v => v[2](this)).forEach(v => {
			const verbElem = document.createElement("span");
			verbElem.onclick = v[1](this);
			verbElem.innerHTML = v[0];
			elem.appendChild(verbElem);
		});
		// finish
		elem.classList.add("itemMenu");
		return elem;
	}
	get img(){
		/** @type {HTMLImageElement} */
		const elem = document.createElement("img");
		elem.src = this.imgsrc;
		elem.alt = elem.title = this.name;
		return elem;
	}
	get span(){
		/** @type {HTMLSpanElement} */
		const elem = document.createElement("span");
		elem.classList.add("rich_item");
		elem.appendChild(this.thumbnail);
		const text = document.createElement("span");
		elem.appendChild(text);
		text.innerHTML = " " + this.name;
		elem.onmouseover = () => this.showMenu(elem);
		elem.onmouseleave = () => this.hideMenu(elem);
		return elem;
	}
	get thumbnail(){
		const elem = this.img;
		elem.height = elem.width = 20;
		return elem;
	}
	/** @param {HTMLSpanElement} elem */
	hideMenu(elem){
		Game.elem.tooltip.innerHTML = "";
	}
	/** @param {HTMLSpanElement} elem */
	showMenu(elem){
		const outerMenu = Game.elem.tooltip;
		const innerMenu = this.menu;
		outerMenu.innerHTML = "";
		outerMenu.appendChild(innerMenu);
		elem.appendChild(outerMenu);
	}
}

class Container extends Item {
	constructor(name, desc="", tags=[], imgsrc=""){
		super(name, desc, tags.concat(["container"]), imgsrc);
		/** @type {Item[]} */
		this.contents = [];
		classLists.container.push(this);
	}
}

class Room extends Container {
	constructor(name, desc="", tags=[], imgsrc=""){
		super(name, desc, tags.concat(["room"]), imgsrc);
		/** @type {Room[]} */
		this.connections = [];
		classLists.room.push(this);
	}
	/** show info on screen */
	details(){
		const elem = Game.elem.details;
		elem.innerHTML = "";
		// title
		const title = document.createElement("h1");
		title.innerHTML = this.name;
		elem.appendChild(title);
		// desc
		const description = document.createElement("p");
		description.innerHTML = this.desc;
		elem.appendChild(description);
		// item list title
		const itemListTitle = document.createElement("h2");
		itemListTitle.innerHTML = "You see the following items:";
		elem.appendChild(itemListTitle);
		// item list
		const itemList = document.createElement("ul");
		elem.appendChild(itemList);
		this.contents.forEach(i => {
			const item = document.createElement("li");
			item.appendChild(i.span);
			itemList.appendChild(item);
		});
	}
}

class Person extends Container {
	constructor(name, desc="", tags=[], imgsrc="", pron=pronThey){
		super(name, desc, tags.concat(["person"]), imgsrc);
		this.pronoun = pron;
		classLists.person.push(this);
	}
}

const Game = {
	elem: {
		details: document.createElement("div"),
		gameFrame: document.createElement("div"),
		status: document.createElement("div"),
		tooltip: document.createElement("div"),
		init(){
			// gameframe setup
			this.gameFrame.id = "gameFrame"
			document.body.appendChild(this.gameFrame);
			// status setup
			this.status.id = "status"
			this.gameFrame.appendChild(this.status);
			// details setup
			this.details.id = "details"
			this.gameFrame.appendChild(this.details);
			// tooltip setup
			this.tooltip.id = "tooltip";
			this.gameFrame.appendChild(this.tooltip);
			// this.tooltip.style.visibility = "none";
		},
	},
	player: new Person("Player", "Stunningly gorgeous", [], "https://www.clker.com/cliparts/F/V/I/C/q/Z/red-stick-man-md.png"),
	run(){
		// init
		this.elem.init();
		// test items
		const bedroom = new Room("Bedroom", "A sleepy hallow");
		const bed = new Item("Bed", "Bouncy bouncy bouncy", [], "https://productimages.mybobs.com/fit-in/624x0/sp/20031533/20031533_hero_wide.jpg");
		const pencil = new Item("Pencil", "The superior writing implement", ["take"], "https://cdn.psychologytoday.com/sites/default/files/styles/article-inline-half-caption/public/field_blog_entry_images/2019-12/redpencil.png");
		bedroom.contents.push(bed, pencil, this.player);
		// todo...?
		bedroom.details();
	},
	updateTitle(){
		// todo: change title based on room, open window, etc...
	}
};

Game.run();

/*
	TODO LIST
	- time management (morning, afternoon, ...)
	- items
		- container
			- rooms
			- people
				- player
	- inventory/stats screen (always visible...?)
	- options for what to do in each room
	- preload all images
*/