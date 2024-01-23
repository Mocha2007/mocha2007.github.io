/* exported CITY, CITY_LOADED */
/* global random */

class Floater {
	constructor(text, x = 0, y = 0, color = 'White', t = 1000){
		this.text = text;
		this.x = x;
		this.y = y;
		this.color = color;
		this.t = t;
		this.vx = random.uniform(-1, 1);
		this.vy = random.uniform(-1, 1);
		this.id = 'FLOATER_' + Floater.i++;
	}
	/** @returns {HTMLDivElement} */
	get currentElem(){
		return document.getElementById(this.id);
	}
	spawn(){
		const elem = document.createElement('div');
		document.body.appendChild(elem);
		elem.id = this.id;
		elem.style.position = 'absolute';
		elem.style.left = this.x;
		elem.style.top = this.y;
		elem.style.color = this.color;
		elem.innerHTML = this.text;
		this.tick();
		return elem;
	}
	tick(){
		// move elem in direction of velocity vector
		this.currentElem.style.left = (this.x += this.vx) + 'px';
		this.currentElem.style.top = (this.y += this.vy) + 'px';
		if (0 < this.t)
			setTimeout(() => this.tick(), Floater.time);
		else
			this.currentElem.remove();
		this.t -= Floater.time;
	}
}
Floater.i = 0;
Floater.time = 50; // ms

class Infobox {
	constructor(name, src = ''){
		this.name = name;
		this.src = src || CITY.DEFAULT.SRC;
	}
	get countElem(){
		const elem = document.createElement('div');
		elem.id = 'COUNT_' + this.name;
		return elem;
	}
	spawnFloater(text, color = 'White'){
		const elem = document.getElementById('COUNT_' + this.name);
		const rect = elem.getBoundingClientRect();
		new Floater(text, rect.x, rect.y, color).spawn();
	}
}

class Resource extends Infobox {
	constructor(name){
		super(name);
		CITY.resources[name] = 0;
		Resource.resources.push(this);
	}
	get amount(){
		return CITY.resources[this.name];
	}
	set amount(x){
		CITY.resources[this.name] = x;
	}
	get amountString(){
		return `${this.amount} ${this.name}`;
	}
	get gatherButton(){
		const elem = document.createElement('span');
		elem.classList.add('button');
		elem.id = 'GATHER_' + this.name;
		elem.innerHTML = 'Gather ' + this.name;
		elem.onclick = () => this.gather();
		return elem;
	}
	get gatherElem(){
		const elem = document.createElement('div');
		elem.id = 'RES_' + this.name;
		elem.appendChild(this.countElem);
		elem.appendChild(this.gatherButton);
		return elem;
	}
	gather(){
		CITY.resources[this.name]++;
		CITY.update.resources();
	}
}
/** @type {Resource[]} */
Resource.resources = [];

class Cost extends Infobox {
	/**
	 * @param {Resource[]} res
	 * @param {number[]} amt
	 */
	constructor(res = [], amt = []){
		super('Cost');
		if (res.length !== amt.length)
			console.warn('cost arrays do not align');
		/** @type {Resource[]} */
		this.res = res;
		/** @type {number[]} */
		this.amt = amt;
	}
	get affordable(){
		return this.res.every((r, i) => this.amt[i] <= r.amount);
	}
	modifyStock(mul = -1){
		this.res.forEach((r, i) => r.amount += mul * this.amt[i]);
		CITY.update.resources();
	}
}

class Effects extends Infobox {
	constructor(pop = 0){
		super('Effects');
		this.pop = pop;
	}
}

class Building extends Infobox {
	/**
	 * @param {string} name
	 * @param {Cost} baseCost
	 * @param {Effects} effects
	 */
	constructor(name, baseCost = new Cost(), effects = new Effects()){
		super(name);
		/** @type {number} */
		this.amount = 0;
		/** @type {Cost} */
		this.baseCost = baseCost;
		/** @type {Effects} */
		this.effects = effects;
		Building.buildings.push(this);
	}
	get amountString(){
		return `${this.amount} ${this.name}`;
	}
	get buildButton(){
		const elem = document.createElement('span');
		elem.classList.add('button');
		elem.id = 'BUILD_' + this.name;
		elem.innerHTML = 'Build ' + this.name;
		elem.onclick = () => this.build();
		return elem;
	}
	get buildElem(){
		const elem = document.createElement('div');
		elem.id = 'BUILDING_' + this.name;
		elem.appendChild(this.countElem);
		elem.appendChild(this.buildButton);
		return elem;
	}
	get cost(){
		return Math.round(this.baseCost * Math.pow(1.2, this.amount));
	}
	build(n = 1){
		for (let i = 0; i < n; i++)
			if (this.cost.affordable){
				this.cost.modifyStock(-1);
				this.amount++;
			}
			else {
				this.spawnFloater(`You can't afford another ${this.name}.`, CITY.COLOR.BAD);
				break;
			}
		CITY.update.buildings();
	}
}
/** @type {Building[]} */
Building.buildings = [];

const CITY = {
	COLOR: {
		BAD: 'red',
		DEFAULT: 'silver',
		GOOD: 'lime',
		NEUTRAL: 'yellow',
	},
	DEFAULT: {
		SRC: '', // todo
	},
	ELEM: {
		/** @returns {HTMLDivElement} */
		get MAIN(){
			return document.getElementById('main');
		},
	},
	init(){
		// todo
		const MAIN = this.ELEM.MAIN;
		// resource list
		const RES_CONTAINER = this.ELEM.RES_CONTAINER = document.createElement('div');
		MAIN.appendChild(RES_CONTAINER);
		// gather buttons
		Resource.resources.forEach(r => {
			RES_CONTAINER.appendChild(r.gatherElem);
		});
		// building buttons
		MAIN.appendChild(document.createElement('hr'));
		const BUILD_CONTAINER = this.ELEM.BUILD_CONTAINER = document.createElement('div');
		MAIN.appendChild(BUILD_CONTAINER);
		Building.buildings.forEach(b => {
			BUILD_CONTAINER.appendChild(b.buildElem);
		});
	},
	main(){
		this.init();
		this.update.all();
		console.info('city.js loaded.');
		console.info(`${Resource.resources.length} resource types.`);
		console.info(`${Building.buildings.length} building types.`);
	},
	resources: {},
	update: {
		all(){
			this.buildings();
			this.resources();
		},
		buildings(){
			Building.buildings.forEach(b => document.getElementById('COUNT_' + b.name).innerHTML = b.amountString);
		},
		resources(){
			Resource.resources.forEach(r => document.getElementById('COUNT_' + r.name).innerHTML = r.amountString);
		},
	},
};

// resources
// const METAL = new Resource('Metal');
const WOOD = new Resource('Wood');

// buildings
new Building('House', new Cost([WOOD], [10]));

const CITY_LOADED = true;