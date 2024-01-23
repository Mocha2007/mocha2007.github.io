/* exported CITY, CITY_LOADED */
/* global random, storage, sum */

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
	constructor(name, gatherable = true, amtGetter = undefined, scales = true){
		super(name);
		/** @type {boolean} */
		this.gatherable = gatherable;
		/** @type {() => void} */
		this.amtGetter = amtGetter;
		/** @type {boolean} */
		this.scales = scales;
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
		elem.classList.add('resource');
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
		return new Cost(this.res, this.amt.map((x, i) => this.res[i].scales ? Math.floor(x*c) : x));
	}
}

class Effects extends Infobox {
	constructor(pop = 0, prod_per_s = new Cost()){
		super('Effects');
		this.pop = pop;
		this.prod_per_s = prod_per_s;
	}
	get elem(){
		const e = document.createElement('div');
		e.innerHTML = '<strong>Effects</strong>: ';
		const ul = document.createElement('ul');
		e.appendChild(ul);
		const list = [];
		if (this.pop)
			list.push(`Provides housing for ${this.pop} pops.`);
		if (this.prod_per_s.res.length)
			list.push('Produces: ' + this.prod_per_s.res.map((r, i) => `${this.prod_per_s.amt[i]} ${r.name}/s`).join(', '));
		list.forEach(x => {
			const li = document.createElement('li');
			li.innerHTML = x;
			ul.appendChild(li);
		});
		return e;
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
		elem.appendChild(document.createElement('br'));
		elem.appendChild(this.costElem);
		elem.appendChild(this.effectElem);
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
	get effectElem(){
		const elem = this.effects.elem;
		elem.id = 'EFFECTS_' + this.name;
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
	AUTOSAVE_INTERVAL: 60 * 1000, // autosave every minute
	COLOR: {
		BAD: 'red',
		DEFAULT: 'silver',
		GOOD: 'lime',
		NEUTRAL: 'yellow',
	},
	DEFAULT: {
		SRC: 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Ambox_blue_question.svg',
	},
	ELEM: {
		/** @returns {HTMLDivElement} */
		get MAIN(){
			return document.getElementById('main');
		},
	},
	init(){
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
		// try to load
		this.save.read();
		// try to save
		this.save.write();
		setInterval(() => this.save.write(), this.AUTOSAVE_INTERVAL);
	},
	resources: {},
	resources2: {
		get employed(){
			return sum(Building.buildings.map(b => b.cost.res.includes(PEOPLE_U)
				? b.amount * b.cost.amt[b.cost.res.indexOf(PEOPLE_U)] : 0));
		},
		get pop(){
			return HOUSE.amount;
		},
		get unemployed(){
			return this.pop - this.employed;
		},
	},
	save: {
		get data(){
			return {
				buildings: Building.buildings.map(b => b.amount),
				resources: CITY.resources,
				version_checksum: this.version_checksum,
			};
		},
		get version_checksum(){
			return Building.buildings.length * 100 + Resource.resources.length;
		},
		read(){
			const x = storage.read('city.js');
			if (!x){
				console.warn('no save detected');
				return;
			}
			if (x.version_checksum !== this.version_checksum)
				// eslint-disable-next-line max-len
				console.warn(`SAVE VERSION CHECKSUM MISMATCH: WAS ${x.version_checksum}, EXPECTED ${this.version_checksum}!`);
			// now copy data over
			Building.buildings.forEach((b, i) => b.amount = x.buildings[i]);
			CITY.resources = x.resources;
			console.info('loaded');
		},
		write(){
			storage.write('city.js', this.data);
			console.info('saved');
		},
	},
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
const PEOPLE = new Resource('Pops', false, () => CITY.resources2.pop, false);
const PEOPLE_E = new Resource('Employed', false, () => CITY.resources2.employed, false);
const PEOPLE_U = new Resource('Unemployed', false, () => CITY.resources2.unemployed, false);
const METAL = new Resource('Metal', false);
const ORE = new Resource('Ore');
const STONE = new Resource('Stone');
const WOOD = new Resource('Wood');

// buildings
const HOUSE = new Building('House', new Cost([WOOD], [10]), new Effects(1));
const MAKER_METAL = new Building('Foundry',
	new Cost([STONE, PEOPLE_U], [50, 5]),
	new Effects(0, new Cost([ORE, METAL], [-1, 1]))
);
const MAKER_ORE = new Building('Mine',
	new Cost([STONE, PEOPLE_U], [25, 1]),
	new Effects(0, new Cost([ORE], [1]))
);
const MAKER_STONE = new Building('Mason',
	new Cost([WOOD, PEOPLE_U], [25, 1]),
	new Effects(0, new Cost([STONE], [1]))
);
const MAKER_WOOD = new Building('Lumbermill',
	new Cost([WOOD, PEOPLE_U], [25, 1]),
	new Effects(0, new Cost([WOOD], [1]))
);

const CITY_LOADED = true;

// todo save/load w/ common.js:storage