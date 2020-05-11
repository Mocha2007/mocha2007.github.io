/* jshint esversion: 6, strict: true, strict: global, eqeqeq: true, nonew: false */
/* exported main */
/* globals cookie, mean, pi, random */
'use strict';
const version = 'a200511';
const clickerName = 'cellgame';

// constants
/** m; exact */
const angstrom = 1e-10;
/** mol^-1; exact; Avogadro's Constant */
const avogadro = 6.02214076e23;
/** m/s; exact */
// const speedOfLight = 299792458;

// simple fxs

/** @param {number} r */
const sphere = r => 4/3 * pi * r*r*r;

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
			}
			catch (TypeError){
				// if a click-removable particle is defined and clicked, this block will trigger
			}
		}, lifespan*1000);
		Game.particles.push(this);
	}
}

class Interactable {
	/** things with names, descs, and images
	 * @param {string} name
	 * @param {string} desc
	 * @param {string} imgUrl
	 * @param {string[]} tags
	 */
	constructor(name, desc = '', imgUrl = '', tags = []){
		this.name = name;
		this.desc = desc;
		this.imgUrl = imgUrl;
		this.tags = tags.map(tagName => Tag.fromString(tagName));
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
	constructor(name, tags = [], desc = '', imgUrl = ''){
		super(name, desc, imgUrl, tags);
		tagList.push(this);
	}
	/** @param {string} string */
	static fromString(string){
		return tagList.filter(t => t.name === string)[0];
	}
}

const resources = [];
class Resource extends Interactable {
	/**
	 * @param {string} name
	 * @param {string} imgUrl
	 * @param {string[]} tags
	 */
	constructor(name, imgUrl = '', tags = []){
		super(name, undefined, imgUrl, tags);
		resources.push(this);
	}
}

const materials = [];
class Material extends Resource {
	/** NOT objects. abstract. use item for physical objects.
	 * @param {string} name
	 * @param {number} density kg/m^3
	 * @param {string} imgUrl
	 * @param {string[]} tags
	 */
	constructor(name, density, imgUrl = '', tags = []){
		super(name, imgUrl, tags);
		/** kg/m^3 */
		this.density = density;
		materials.push(this);
	}
}

/** @type {Chem[]} */
const chems = [];
class Chem extends Material {
	/**
	 * @param {string} name
	 * @param {number} density g/cm^3
	 * @param {number} molarMass g/mol
	 * @param {string} imgUrl
	 * @param {string[]} tags
	 */
	constructor(name, density, molarMass, imgUrl = '', tags = []){
		super(name, density*1000, imgUrl, tags);
		/** kg/mol */
		this.molarMass = molarMass / 1000;
		chems.push(this);
	}
	/** mass of a single atom/molecule */
	get mass(){
		return this.molarMass / avogadro;
	}
	get molecule(){
		const name = this.name + ' Molecule';
		const i = items.filter(item => item.name === name);
		if (i.length) // preexisting
			return i[0];
		// new
		return new Item(name, this.mass,
			// estimate from https://physics.stackexchange.com/a/67721
			this.molarMass / this.density / avogadro,
			[this], this.imgUrl);
	}
	/** @return {number} integer in [1, 4] */
	get rarity(){
		return Math.max(0, Math.floor(Math.log(this.molarMass)) + 4);
	}
	/** @param {string} name */
	static find(name){
		return chems.filter(c => c.name === name)[0];
	}
}

/** @type {Item[]} */
const items = [];
class Item extends Resource {
	/** physical, tangible objects
	 * @param {string} name
	 * @param {number} mass
	 * @param {number} volume
	 * @param {Material[]} composition
	 * @param {string[]} tags
	 */
	constructor(name, mass, volume, composition, imgUrl = '', tags = []){
		super(name, imgUrl, tags);
		this.mass = mass;
		this.volume = volume;
		this.composition = composition;
		items.push(this);
		// create element
		this.elem;
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
			li.innerHTML = this.name;
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
	createParticle(){
		const p = this.img;
		p.style.opacity = 1;
		p.style.width = '200px';
		return new Particle(p, e => {
			e.style.opacity = parseFloat(e.style.opacity) * 0.9;
			e.style.width = parseFloat(e.style.width.slice(0, -2)) * 0.9 + 'px';
		}, 2);
	}
	/** @param {number} v */
	kinetic(v){
		return 1/2 * this.mass * v*v;
	}
}

const recipes = [];
class Recipe {
	/**
	 * @param {[Resource, number][]} reagents
	 * @param {[Resource, number][]} products
	 */
	constructor(reagents, products){
		this.reagents = reagents;
		this.products = products;
		recipes.push(this);
		// create element
		this.elem;
	}
	get elem(){
		const elemId = 'recipe' + this.id;
		/** @type {HTMLLIElement} */
		let li = document.getElementById(elemId);
		if (!li){
			li = document.createElement('li');
			li.id = elemId;
			li.innerHTML = this.reagents + ' &rarr; ' + this.products;
			li.onclick = () => this.make();
			li.title = 'Make this recipe';
			document.getElementById('recipeList').appendChild(li);
		}
		return li;
	}
	get id(){
		return recipes.indexOf(this);
	}
	make(){
		// todo
	}
}

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
			li.title = 'Buy this upgrade';
			document.getElementById('techList').appendChild(li);
		}
		return li;
	}
	get unlockable(){
		return this.prereqs.every(t => t.unlocked) &&
			this.cost.every(x => x[1] <= x[0].amount);
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
		mine(){
			const c = Game.chem.random();
			const mol = c.molecule;
			Game.p.add(mol);
			const l = document.getElementById('miningLog');
			l.innerHTML = 'mined ' + mol.name;
			l.appendChild(document.createElement('br'));
			l.appendChild(Game.rarity.elem(c.rarity));
			mol.createParticle();
		},
	},
	chem: {
		chems,
		/** @return {Chem} */
		random(){
			return random.weightedChoice(this.chems, this.weights);
		},
		get weights(){
			// -1 too big, -2 too small... but realistic...
			return this.chems.map(c => Math.pow(c.molarMass, -2));
		},
	},
	debug: {
		/** @type {number} */
		autosaveTimeout: undefined,
		loadTime: new Date(),
		/** @type {string[]} */
		log: [],
		version,
	},
	/** @param {string} string string to log */
	log(string){
		Game.debug.log.push(string);
		console.log(string);
	},
	/** shit that can't go into a savefile */
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
			return this.hasItem(item) &&
				Game.player.inventory.filter(i => i[0] === item.name)[0][1] ||
				0;
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
		lifetimeSnueg: 0,
		/** @type {number[]} tech ids */
		unlockedTechs: [],
		snueg: 0,
		startTime: +new Date(),
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
			const saveFile = cookie.read(clickerName);
			Game.player = saveFile.player;
			Game.settings = saveFile.settings;
		},
		/**
		 * @param {boolean} isManual is this save manually triggered, or automatic?
		*/
		save(isManual = false){
			clearTimeout(Game.debug.autosaveTimeout);
			const saveFile = {};
			saveFile.settings = Game.settings;
			Game.player.lastSave = +new Date();
			saveFile.player = Game.player;
			cookie.write(clickerName, saveFile);
			Game.debug.lastSave = new Date();
			if (isManual)
				Game.log('Successfully manually saved Game!');
			Game.debug.autosaveTimeout = setTimeout(Game.save.save, Game.settings.autosaveInterval);
		},
	},
	settings: {
		autosaveInterval: 30 * 1000,
		fps: 20,
	},
	tick(){
		// automine
		if (automineTech.unlocked)
			Game.action.mine();
	},
};

// ITEM, RECIPE, ETC DEFS (MUST COME AFTER GAME)
// Tier 0 - no reqs
new Tag('Organic', [], 'Molecules containing a carbon-hydrogen bond'); // must contain H C

// Tier 1 - requires something from Tier 0
new Tag('Amino Acid', ['Organic'], 'Molecules with an amine and carboxyl group'); // must contain H C N O
new Tag('Carbohydrate', ['Organic'], 'Molecules of Carbon, Oxygen, and Hydrogen'); // must contain H C O and only those
new Tag('Nucleobase', ['Organic']);

// Tier 2
new Tag('Monosaccharide', ['Carbohydrate']);

// chems - ball-and-stick models preferred
const water = new Chem('Water', 1, 18.01528, 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Water_molecule_3D.svg');
new Chem('Nitrogen', 1.2506e-3, 28, 'https://upload.wikimedia.org/wikipedia/commons/2/20/Dinitrogen-3D-vdW.png');
new Chem('Oxygen', 1.429e-3, 32, 'https://upload.wikimedia.org/wikipedia/commons/5/57/Oxygen_molecule.svg');
new Chem('Carbon Dioxide', 1.429e-3, 44.009, 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Carbon_dioxide_3D_ball.png');
new Chem('Sodium Chloride', 2.17, 58.443, 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Sodium-chloride-3D-ionic.png');
new Chem('Glycine', 1.1607, 75.067, 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Glycine-3D-balls.png', ['Amino Acid']);
new Chem('Cytosine', 1.55, 111.1, 'https://upload.wikimedia.org/wikipedia/commons/7/73/Cytosine-3D-balls.png', ['Nucleobase']);
new Chem('Uracil', 1.32, 112.08676, 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Uracil-3D-balls.png', ['Nucleobase']);
new Chem('Thymine', 1.223, 126.115, 'https://upload.wikimedia.org/wikipedia/commons/8/88/Thymine-3D-balls.png', ['Nucleobase']);
new Chem('Adenine', 1.6, 135.13, 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Adenine-3D-balls.png', ['Nucleobase']);
new Chem('Guanine', 2.2, 151.13, 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Guanine-3D-balls.png', ['Nucleobase']);
new Chem('Vitamin C', 1.694, 176.12, 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Ascorbic-acid-from-xtal-1997-3D-balls.png', ['Organic']);
new Chem('Glucose', 1.54, 180.156, 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Alpha-D-glucose-from-xtal-1979-3D-balls.png', ['Monosaccharide']);
new Chem('ATP', 1.04, 507.18, 'https://upload.wikimedia.org/wikipedia/commons/2/22/ATP-3D-vdW.png', ['Organic']);
// https://en.wikipedia.org/wiki/Eukaryotic_ribosome_(80S)#Composition
/* new Chem('Ribosome', undefined, 3.2e6, 'https://upload.wikimedia.org/wikipedia/commons/a/a8/80S_2XZM_4A17_4A19.png', ['Organic']);

const ribosome = new Item('Ribosome', Chem.find('Ribosome').mass,
	sphere(mean([200, 300])/2*angstrom),
	[Chem.find('Ribosome')],
	Chem.find('Ribosome').imgUrl
);*/

// const ribosomeRecipe = new Recipe([['proteins', 6592 + 5265]], [[ribosome, 1]]);

const automineTech = new Tech('Automine', 'Automatically mine for resources', undefined, [[water.molecule, 100]]);
// todo const ribosomeTech = new Tech('Ribosome', 'Unlock ribosome manufacture', undefined, ['amino acids', 1e4]);

// functions

// https://stackoverflow.com/a/2956980/2579798
function setIntervalX(callback, delay, repetitions){
	let x = 0;
	const intervalID = window.setInterval(function(){
		callback();
		if (++x === repetitions){
			window.clearInterval(intervalID);
		}
	}, delay);
}

// main only beyond here

function main(){
	// update version div
	document.getElementById('version').innerHTML = 'v. ' + Game.debug.version;
	// load save
	if (cookie.read(clickerName))
		Game.save.load();
	else
		Game.save.save();
	// set up ticks
	setTimeout(Game.save.save, Game.settings.autosaveInterval);
	setInterval(Game.tick, 1000);
	// notification
	Game.log(clickerName + ' v. ' + version + ' loaded successfully.');
}