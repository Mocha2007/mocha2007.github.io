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
	["Look", i => () => i.Look(), () => true],
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
		text.innerHTML = this.name;
		elem.onclick = () => this.showMenu();
		return elem;
	}
	get thumbnail(){
		const elem = this.img;
		elem.height = elem.width = 20;
		return elem;
	}
	showMenu(){
		// todo
		this.menu;
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
}

class Person extends Container {
	constructor(name, desc="", tags=[], imgsrc="", pron=pronThey){
		super(name, desc, tags.concat(["person"]), imgsrc);
		this.pronoun = pron;
		classLists.person.push(this);
	}
}

const Game = {
	player: new Person("Player"),
	run(){
		const bedroom = new Room("Bedroom", "A sleepy hallow");
		const bed = new Item("Bed", "Bouncy bouncy bouncy");
		const pencil = new Item("Pencil", "The superior writing implement", ["take"]);
		bedroom.contents.push(bed, pencil);
		// todo...?
	},
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
*/