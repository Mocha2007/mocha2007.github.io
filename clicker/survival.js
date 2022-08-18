/* jshint esversion: 6, strict: true, strict: global, eqeqeq: true, nonew: false */
/* exported main */
/* globals itemData, random, recipeData, round, storage, unitString */
'use strict';
const version = 'a210413';
const clickerName = 'survival';
// Willscrlt, public domain
const defaultImgUrl = 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Question_Mark_Icon_-_Blue_Box_withoutQuestionmarkBlur.svg';

// classes

class Particle {
	/**
	 * Aesthetic Particles
	 * @param {HTMLElement} element - element to animate
	 * @param {(elem: HTMLElement) => void} tick - animation function (runs every tick, takes element as argument)
	 * @param {number} lifespan - animation time (s)
	*/
	constructor(element, tick, lifespan){
		element.id = +new Date();
		element.classList.add('particle');
		document.getElementById('left').appendChild(element);
		this.element = element;
		this.tick = tick;
		this.lifespan = lifespan;
		setIntervalX(() => tick(element), 1000/Game.settings.fps, lifespan*Game.settings.fps);
		setTimeout(() => {
			try {
				document.getElementById(element.id).remove();
				// remove from list
				Game.particles.splice(Game.particles.indexOf(this), 1);
			}
			catch (TypeError){
				// if a click-removable particle is defined and clicked, this block triggers
			}
		}, lifespan*1000);
		Game.particles.push(this);
	}
}

/** @type {Interactable[]} */
const interactables = [];
class Interactable {
	/** things with names, descs, and images
	 * @param {string} name
	 * @param {string} desc
	 * @param {string} imgUrl
	 * @param {string[]} tags
	 */
	constructor(name, desc = '', imgUrl = defaultImgUrl, tags = []){
		this.name = name;
		this.desc = desc;
		this.imgUrl = imgUrl;
		this.tags = tags.map(tagName => Tag.find(tagName));
		interactables.push(this);
	}
	/** @return {Tag[]} a flat array of all categories and supercategories it is a member of */
	get categories(){
		return this.tags.concat(...this.tags.map(t => t.categories));
	}
	get img(){
		const image = document.createElement('img');
		image.src = this.imgUrl;
		image.title = this.name;
		image.alt = this.name;
		return image;
	}
	get wikilink(){
		const a = document.createElement('a');
		a.href = 'https://en.wikipedia.org/wiki/' + this.name;
		a.innerHTML = this.name;
		return a;
	}
	/**
	 * @param {Tag} tag
	 * @return {boolean}
	 */
	hasTag(tag){
		return this.tags.some(t => t === tag || t.hasTag(t));
	}
}

/** @type {Tag[]} */
const tagList = [];
class Tag extends Interactable {
	/** things with names, descs, and images
	 * @param {string} name
	 * @param {string[]} tags - implications, like how FPS => first person, shooter
	 * @param {string} desc
	 * @param {string} imgUrl
	 */
	constructor(name, tags = [], desc = '', imgUrl = defaultImgUrl){
		super(name, desc, imgUrl, tags);
		tagList.push(this);
	}
	/** @param {string} string */
	static find(string){
		return tagList.filter(t => t.name === string)[0];
	}
}

/** @type {Item[]} */
const items = [];
class Item extends Interactable {
	/** physical, tangible objects
	 * @param {string} name
	 * @param {number} mass
	 * @param {number} volume
	 * @param {Material[]} composition
	 * @param {string[]} tags
	 */
	constructor(name, mass, volume, imgUrl = defaultImgUrl, tags = [], rarity = 0){
		super(name, undefined, imgUrl, tags);
		this.mass = mass;
		this.volume = volume;
		this.rarity = rarity;
		items.push(this);
	}
	get amount(){
		return Game.p.amount(this);
	}
	get density(){
		return this.mass / this.volume;
	}
	get elem(){
		const elemId = 'item' + this.name;
		/** @type {HTMLLIElement} */
		let li = document.getElementById(elemId);
		if (!li){
			li = document.createElement('li');
			li.id = elemId;
			li.appendChild(this.span);
			document.getElementById('invList').appendChild(li);
		}
		// update amount
		if (this.amount)
			li.classList.remove('invisible');
		else
			li.classList.add('invisible');
		li.value = this.amount;
		// return
		return li;
	}
	get itemId(){
		return items.indexOf(this);
	}
	get rarityWeight(){
		return Math.pow(10, -this.rarity);
	}
	/** inline representation of an item */
	get span(){
		const elem = document.createElement('span');
		// icon
		const img = this.img;
		img.style.height = '20px';
		img.style.marginBottom = '-5px';
		elem.appendChild(img);
		// name
		const name = document.createElement('span');
		name.innerHTML = this.name;
		elem.appendChild(name);
		// styling
		elem.style.color = Game.rarity.colors[this.rarity];
		elem.title = this.name + '\n'
			+ 'ID: ' + this.itemId + '\n'
			+ 'Rarity: ' + Game.rarity.names[this.rarity] + ' (' + this.rarity + ')\n'
			+ 'Mass: ' + unitString(this.mass, 'g', 2, 1e3) + '\n'
			+ 'Volume: ' + unitString(this.volume, 'L', 2, 1e3) + '\n'
			+ 'Density: ' + round(this.density) + ' kg/m³\n'
			+ this.desc;
		return elem;
	}
	createParticle(){
		const p = this.img;
		p.style.opacity = 1;
		p.style.width = '200px';
		return new Particle(p, e => {
			e.style.opacity = parseFloat(e.style.opacity) * 0.9;
			e.style.width = parseFloat(e.style.width.slice(0, -2)) * 0.9 + 'px';
		}, 1);
	}
	/** @param {number} v */
	kinetic(v){
		return 1/2 * this.mass * v*v;
	}
	/** @param {string} name */
	static find(name){
		return items.filter(i => i.name === name)[0];
	}
	static fromJSON(o){
		return new Item(o.name, o.mass, o.volume, o.imgUrl, o.tags, o.rarity);
	}
}

/** @type {Recipe[]} */
const recipes = [];
class Recipe {
	/**
	 * @param {[Item, number][]} reagents
	 * @param {[Item, number][]} products
	 * @param {number} time - crafting time. ingame: (h); irl: (s)
	 */
	constructor(reagents, products, time = 0, onComplete = () => undefined){
		this.reagents = reagents;
		this.products = products;
		this.time = time;
		this.onComplete = onComplete;
		recipes.push(this);
		// create element
		if (reagents.length)
			this.elem;
	}
	get elem(){
		const elemId = this.elemId;
		/** @type {HTMLLIElement} */
		let li = document.getElementById(elemId);
		if (!li){
			li = document.createElement('li');
			li.id = elemId;
			li.appendChild(this.span);
			li.onclick = () => this.make();
			li.title = 'Make this recipe';
			document.getElementById('recipeList').appendChild(li);
		}
		return li;
	}
	get elemId(){
		return 'recipe' + this.id;
	}
	get id(){
		return recipes.indexOf(this);
	}
	get makable(){
		return this.reagents.every(i => i[1] <= i[0].amount);
	}
	get span(){
		const span = document.createElement('span');
		this.reagents.forEach((x, i) => {
			span.innerHTML += x[1] + ' ';
			span.appendChild(x[0].span);
			if (i !== this.reagents.length - 1)
				span.innerHTML += ', ';
		});
		span.innerHTML += ' &rarr; ';
		this.products.forEach((x, i) => {
			span.innerHTML += x[1] + ' ';
			span.appendChild(x[0].span);
			if (i !== this.products.length - 1)
				span.innerHTML += ', ';
		});
		if (!this.products.length)
			span.innerHTML += '<span title="This recipe has unpredictable results...">?</span>';
		return span;
	}
	finishCrafting(){
		// reset Game.inProgress
		Game.inProgress = false;
		// give products
		this.products.forEach(i => Game.p.add(i[0], i[1]));
		// onComplete
		this.onComplete();
		// reset progress bar
		document.getElementById('progressbar').value = 0;
	}
	make(){
		if (!this.makable || Game.inProgress)
			return false;
		// consume reagents
		this.reagents.forEach(i => Game.p.add(i[0], -i[1]));
		Game.inProgress = true;
		if (this.time){
			/** @type {HTMLProgressElement} */
			const progressBar = document.getElementById('progressbar');
			// update progress
			const minInterval = 1000 / Game.settings.fps; // default: 33 ms
			const maxDivisions = 160; // default browser width is 160px
			const interval = Math.max(1000 * this.time / maxDivisions, minInterval);
			const divisions = round(1000 * this.time / interval);
			// Game.log(minInterval, maxDivisions, interval, divisions);
			setIntervalX(() => progressBar.value += 1/divisions, interval, divisions);
		}
		// give products after this.time seconds
		setTimeout(() => this.finishCrafting(), this.time*1000);
		Game.log('Crafted ' + this.id);
		return true;
	}
	static fromJSON(o){
		return new Recipe(
			o.reagents.map(x => [Item.find(x[0]), x[1]]),
			o.products.map(x => [Item.find(x[0]), x[1]]),
			o.time
		);
	}
}

/** @type {Tech[]} */
const techs = [];
class Tech extends Interactable {
	/**
	 * @param {string} name
	 * @param {string} desc
	 * @param {Tech[]} prereqs
	 * @param {[Item, number][]} cost
	 * @param {string[]} tags
	 */
	constructor(name, desc, prereqs = [], cost = [], tags = []){
		super(name, desc, undefined, tags);
		this.prereqs = prereqs;
		this.cost = cost;
		techs.push(this);
		// create element
		this.elem;
	}
	get elem(){
		const elemId = 'tech' + this.name;
		/** @type {HTMLLIElement} */
		let li = document.getElementById(elemId);
		if (!li){
			li = document.createElement('li');
			li.id = elemId;
			li.innerHTML = this.name;
			li.onclick = () => this.unlock();
			li.title = `Cost:\n${this.cost.map(inp => `${inp[1]} units of ${inp[0].name}`).join('\n')}`;
			document.getElementById('techList').appendChild(li);
		}
		return li;
	}
	get unlockable(){
		return this.prereqs.every(t => t.unlocked)
			&& this.cost.every(x => x[1] <= x[0].amount);
	}
	get unlocked(){
		return Game.player.unlockedTechs.includes(this.name);
	}
	/** @return {boolean} Was the unlock successful? */
	unlock(){
		if (!this.unlockable || this.unlocked)
			return false;
		this.cost.forEach(x => Game.p.add(x[0], -x[1]));
		Game.player.unlockedTechs.push(this.name);
		return true;
	}
}

// constants

const Game = {
	action: {
		mine(n = 1){
			if (n < 1)
				return;
			const c = Game.item.random();
			Game.p.add(c);
			const l = document.getElementById('miningLog');
			l.innerHTML = 'mined ';
			l.appendChild(c.span);
			l.appendChild(document.createElement('br'));
			l.appendChild(Game.rarity.elem(c.rarity));
			c.createParticle();
			if (1 < n)
				this.mine(n-1);
		},
		mineralSplit(){
			const mineralTag = Tag.find('Mineral');
			const minerals = items.filter(i => i.categories.includes(mineralTag));
			Game.p.add(random.weightedChoice(minerals, minerals.map(m => m.rarityWeight)), 1);
		},
	},
	clock(){
		let time = Game.player.ticks;
		const year = Math.floor(time / (12*30*24)); // 2 h 24 min irl
		time -= year * 12 * 30 * 24;
		const month = Math.floor(time / (30*24)); // 12 irl minutes
		time -= month * 30 * 24;
		const day = Math.floor(time / 24); // 24 irl seconds
		time -= day * 24;
		document.getElementById('clock').innerHTML = `Year ${year}, Month ${month}, Day ${day}, ${time} h`;
	},
	debug: {
		/** @type {number} */
		autosaveTimeout: undefined,
		loadTime: new Date(),
		/** @type {string[]} */
		log: [],
		version,
	},
	inProgress: false,
	item: {
		items,
		/** @return {Item} */
		random(){
			return random.weightedChoice(this.items, this.weights);
		},
		get weights(){
			// rarity 0 -> weight 1; 1 -> 1/10, 2 -> 1/100, 3 -> 1/1000, ...
			return this.items.map(c => c.categories.includes(whitelisted) && c.rarityWeight);
		},
	},
	/** @param {string} string string to log */
	log(string){
		Game.debug.log.push(string);
		console.log(string);
	},
	/** stuff that can't go into a savefile */
	p: {
		/** @param {Item} item */
		add(item, amount = 1){
			if (this.hasItem(item)){
				const nameMap = Game.player.inventory.map(i => i[0]);
				Game.player.inventory[nameMap.indexOf(item.name)][1] += amount;
			}
			else
				Game.player.inventory.push([item.name, amount]);
			// update count
			item.elem;
		},
		/** @param {Item} item */
		amount(item){
			return this.hasItem(item)
				&& Game.player.inventory.filter(i => i[0] === item.name)[0][1]
				|| 0;
		},
		/** @param {Item} item */
		hasItem(item){
			return Game.player.inventory.some(i => i[0] === item.name);
		},
	},
	/** @type {Particle[]} */
	particles: [],
	player: {
		/** @type {[string, number][]} [name, count] of Item */
		inventory: [],
		lastSave: 0,
		/** @type {number[]} tech ids */
		unlockedTechs: [],
		startTime: +new Date(),
		ticks: 0,
	},
	powerOverwhelming(){
		items.forEach(i => Game.p.add(i, 200));
		techs.forEach(t => t.unlock());
	},
	rarity: {
		colors: 'White CornflowerBlue PaleGreen BurlyWood IndianRed'.split(' '),
		names: 'Common Uncommon Rare Epic Legendary'.split(' '),
		/** @param {number} n */
		elem(n){
			const span = document.createElement('span');
			span.id = 'rarity';
			span.innerHTML = this.names[n];
			span.style.color = this.colors[n];
			return span;
		},
	},
	save: {
		load(){
			const saveFile = storage.read(clickerName);
			Game.player = saveFile.player;
			Game.settings = saveFile.settings;
		},
		reset(){
			storage.delete(clickerName);
			location.reload();
		},
		save(){
			clearTimeout(Game.debug.autosaveTimeout);
			const saveFile = {};
			saveFile.settings = Game.settings;
			Game.player.lastSave = +new Date();
			saveFile.player = Game.player;
			storage.write(clickerName, saveFile);
			Game.debug.lastSave = new Date();
			Game.log('Game saved.');
			Game.debug.autosaveTimeout = setTimeout(Game.save.save, Game.settings.autosaveInterval);
		},
	},
	settings: {
		autosaveInterval: 30 * 1000,
		fps: 30,
	},
	tick(){
		// update clock
		Game.player.ticks++;
		Game.clock();
		// automine
		if (automineTech.unlocked)
			Game.action.mine();
		// fade / unfade recipes
		recipes.forEach(r => {
			/** @type {HTMLLIElement} */
			const elem = document.getElementById(r.elemId);
			if (!elem)
				return;
			if (r.makable)
				elem.classList.remove('faded');
			else
				elem.classList.add('faded');
		});
	},
};

// ITEM, RECIPE, ETC DEFS (MUST COME AFTER GAME)
// Tier 0 - no reqs
const whitelisted = new Tag('Whitelisted', [], 'Can be mined');
new Tag('Mineral', [], 'Broken off from a larger stone');

// read chemData, recipeData
itemData.forEach(o => Item.fromJSON(o));
const water = Item.find('Water');

// buttonrecipes
Game.buttonRecipes = {
	mine: new Recipe([], [], 1, () => Game.action.mine(3)),
	mineralSplit: new Recipe([[Item.find('Stone'), 1]], [], 1, () => Game.action.mineralSplit()),
};

// other recipes
recipeData.forEach(o => Recipe.fromJSON(o));

const automineTech = new Tech('Automine', 'Automatically mine for resources', undefined, [[water, 100]]);

// functions

function preloader(){
	// loadcircle, loadpercent
	let loadcurrent = 0;
	const loadtotal = interactables.length;
	const load = document.getElementById('loadContainer');
	load.style.opacity = 0.999; // setting the opacity to 1 causes it to become transparent for some dumb fucking css reason
	const loadPercent = document.getElementById('loadPercent');
	const loadCircle = document.getElementById('loadCircle');
	interactables.forEach(interactable => {
		// https://stackoverflow.com/a/2342181/2579798
		if (!interactable.imgUrl){
			loadcurrent++;
			return;
		}
		const img = new Image();
		img.onload = () => {
			loadcurrent++;
			// percentage
			loadPercent.innerHTML = round(100 * loadcurrent / loadtotal) + '%';
			// circle
			// 71% is full screen for some dumb fucking reason
			loadCircle.setAttribute('r', 71 * loadcurrent / loadtotal + '%');
			if (loadtotal <= loadcurrent){
				// fade for 1s
				setIntervalX(() => load.style.opacity *= 0.9,
					1000 / Game.settings.fps, Game.settings.fps);
				// delete after 1s
				setTimeout(() => load.remove(), 1000);
			}
		};
		img.src = interactable.imgUrl;
	});
}

// https://stackoverflow.com/a/2956980/2579798
function setIntervalX(callback, delay, repetitions){
	let x = 0;
	const intervalID = window.setInterval(() => {
		callback();
		if (++x === repetitions){
			window.clearInterval(intervalID);
		}
	}, delay);
}

// main only beyond here

function main(){
	// preloader
	preloader();
	// update version div
	document.getElementById('version').innerHTML = 'v. ' + Game.debug.version;
	// load save
	if (storage.exists(clickerName))
		Game.save.load();
	else
		Game.save.save();
	// set up ticks
	setTimeout(Game.save.save, Game.settings.autosaveInterval);
	setInterval(Game.tick, 1000);
	// set up inventory
	items.forEach(i => i.elem);
	// set up clock
	Game.clock();
	// notification
	Game.log(clickerName + ' v. ' + version + ' loaded successfully.');
}