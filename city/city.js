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
	constructor(name, gatherable = true, amtGetter = undefined){
		super(name);
		/** @type {boolean} */
		this.gatherable = gatherable;
		/** @type {() => void} */
		this.amtGetter = amtGetter;
		CITY.resources[name] = 0;
		Resource.resources.push(this);
	}
	get amount(){
		return this.amtGetter ? this.amtGetter() : CITY.resources[this.name];
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
		if (this.gatherable)
			elem.appendChild(this.gatherButton);
		return elem;
	}
	gather(n = 1){
		CITY.resources[this.name] += n;
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
	get elem(){
		const e = document.createElement('span');
		e.innerHTML = 'Cost: ' + this.res.map((r, i) => `${this.amt[i]} ${r.name}`).join(', ');
		return e;
	}
	modifyStock(mul = -1){
		this.res.forEach((r, i) => r.amount += mul * this.amt[i]);
		CITY.update.resources();
	}
	mul(c = 1){
		return new Cost(this.res, this.amt.map(x => x*c));
	}
}

class Effects extends Infobox {
	constructor(pop = 0, prod_per_s = new Cost()){
		super('Effects');
		this.pop = pop;
		this.prod_per_s = prod_per_s;
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
		elem.classList.add('building');
		elem.id = 'BUILDING_' + this.name;
		elem.appendChild(this.countElem);
		elem.appendChild(this.buildButton);
		elem.appendChild(this.costElem);
		return elem;
	}
	get cost(){
		return this.baseCost.mul(Math.pow(1.2, this.amount));
	}
	get costElem(){
		const elem = this.cost.elem;
		elem.id = 'COST_' + this.name;
		return elem;
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
	tick(){
		// production
		// eslint-disable-next-line max-len
		this.effects.prod_per_s.res.forEach((r, i) => r.gather(this.amount * this.effects.prod_per_s.amt[i]));
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
		setInterval(() => this.update.buildingTick(), 1000);
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
			Building.buildings.forEach(b => {
				// update amt
				document.getElementById('COUNT_' + b.name).innerHTML = b.amountString;
				// update cost
				document.getElementById('COST_' + b.name).innerHTML = b.costElem.innerHTML;
			});
		},
		buildingTick(){
			Building.buildings.forEach(b => b.tick());
		},
		resources(){
			Resource.resources.forEach(r => document.getElementById('COUNT_' + r.name).innerHTML = r.amountString);
		},
	},
};

// resources
// const METAL = new Resource('Metal');
const PEOPLE = new Resource('People', false, () => HOUSE.amount);
const WOOD = new Resource('Wood');

// buildings
const HOUSE = new Building('House', new Cost([WOOD], [10]));
const MAKER_WOOD = new Building('Lumbermill', new Cost([WOOD, PEOPLE], [25, 1]), new Effects(0, new Cost([WOOD], [1])));

const CITY_LOADED = true;