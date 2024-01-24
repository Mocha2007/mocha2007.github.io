/* exported CITY, CITY_LOADED */
/* global clamp, mean, random, round, storage, sum */

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
		return `${Math.floor(this.amount)} ${this.name}`;
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
		elem.classList.add(this.isSpecial ? 'specialResource' : 'resource');
		elem.id = 'RES_' + this.name;
		elem.appendChild(this.countElem);
		if (this.gatherable)
			elem.appendChild(this.gatherButton);
		return elem;
	}
	get isSpecial(){
		return !!this.amtGetter;
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
	get amt_build(){
		return this.amt.map(a => a * CITY.BONUS.BUILD);
	}
	get elem(){
		const e = document.createElement('span');
		const AMT_BUILD = this.amt_build;
		e.innerHTML = 'Cost: ' + this.res.map((r, i) => `${AMT_BUILD[i]} ${r.name}`).join(', ');
		return e;
	}
	get revealable(){
		return this.res.every((r, i) => this.amt[i] / 2 <= r.amount);
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
	constructor(pop = 0, prod_per_s = new Cost(), tags = []){
		super('Effects');
		/** @type {number} */
		this.pop = pop;
		/** @type {Cost} */
		this.prod_per_s = prod_per_s;
		/** @type {string[]} */
		this.tags = tags;
	}
	get amt_prod(){
		return this.prod_per_s.amt.map(a => a * CITY.BONUS.PROD);
	}
	get elem(){
		const e = document.createElement('div');
		e.classList.add('effects');
		e.innerHTML = '<strong>Effects</strong>: ';
		const ul = document.createElement('ul');
		e.appendChild(ul);
		const list = [];
		if (this.pop)
			list.push(`Provides housing for ${this.pop} pops.`);
		if (this.tags)
			list.push(...this.tagEffects);
		if (this.prod_per_s.res.length){
			const AMT_PROD = this.amt_prod;
			list.push('Produces: ' + this.prod_per_s.res.map((r, i) => `${round(AMT_PROD[i], 2)} ${r.name}/s`).join(', '));
		}
		list.forEach(x => {
			const li = document.createElement('li');
			li.innerHTML = x;
			ul.appendChild(li);
		});
		return e;
	}
	get tagEffects(){
		const o = [];
		this.tags.forEach(tag => {
			switch (tag.toLowerCase()){
				case 'admin': // clinic
					o.push('Provides administrative support for a limited number of pops');
					break;
				case 'arch': // architect
					o.push('Reduces all build costs by 5%');
					break;
				case 'edu1': // elem
				case 'edu2': // high
				case 'edu3': // coll
					o.push('Provides education for a limited number of pops');
					break;
				case 'health': // clinic
					o.push('Provides healthcare for a limited number of pops');
					break;
				case 'police': // cops
					o.push('Provides public safety for a limited number of pops');
					break;
				case 'trans': // roads
					o.push('Provides transportation for a limited number of buildings');
					break;
				default:
					console.warn(`INVALID TAG "${tag}"`);
			}
		});
		return o;
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
		/** @type {boolean} */
		this.visible = false;
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
		elem.classList.add('hidden');
		elem.id = 'BUILDING_' + this.name;
		elem.appendChild(this.countElem);
		elem.appendChild(this.buildButton);
		elem.appendChild(document.createElement('br'));
		elem.appendChild(this.costElem);
		elem.appendChild(this.effectElem);
		return elem;
	}
	get cost(){
		return this.baseCost.mul(Math.pow(1.2, this.amount) * CITY.BONUS.BUILD);
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
	reveal(){
		document.getElementById('BUILDING_' + this.name).classList.remove('hidden');
		this.visible = true;
	}
	tick(){
		// production
		if (this.effects.prod_per_s.mul(-1).affordable)
			this.effects.prod_per_s.res
				// eslint-disable-next-line max-len
				.forEach((r, i) => r.gather(CITY.BONUS.PROD * this.amount * this.effects.prod_per_s.amt[i] / CITY.FPS));
	}
	/** @param {string} s */
	static fromString(s){
		return this.buildings.find(b => b.name === s);
	}
}
/** @type {Building[]} */
Building.buildings = [];

const CITY = {
	AUTOSAVE_INTERVAL: 60 * 1000, // autosave every minute
	BONUS: {
		get BUILD(){
			return Math.pow(0.95, CITY.resources2.upgrade.build);
		},
		get PROD(){
			return 0.1 + CITY.resources2.approval / 100;
		},
	},
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
	FPS: 10,
	init(){
		const MAIN = this.ELEM.MAIN;
		// status list
		const STATUS_CONTAINER = this.ELEM.STATUS_CONTAINER = document.createElement('div');
		MAIN.appendChild(STATUS_CONTAINER);
		// resource list
		MAIN.appendChild(document.createElement('hr'));
		const RES_CONTAINER = this.ELEM.RES_CONTAINER = document.createElement('div');
		MAIN.appendChild(RES_CONTAINER);
		// gather buttons
		Resource.resources.forEach(r => {
			(r.isSpecial ? STATUS_CONTAINER : RES_CONTAINER).appendChild(r.gatherElem);
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
		setInterval(() => this.update.buildingTick(), 1000 / this.FPS);
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
		get approval(){
			return Math.floor(mean([this.admin, 100 - this.crime,
				this.education, this.health, this.trans, 100-this.unemployment]));
		},
		get admin(){
			const P = this.pop || 1;
			const ADMIN = sum(Building.buildings.map(b => b.amount * b.effects.tags.includes('admin')));
			const ADMIN_ = Math.min(1, 75 * ADMIN / P);
			return Math.floor(100 * ADMIN_);
		},
		get buildings(){
			return sum(Building.buildings.map(b => b.amount));
		},
		get education(){
			const P = this.pop || 1;
			const EDU1 = sum(Building.buildings.map(b => b.amount * b.effects.tags.includes('edu1')));
			const EDU2 = sum(Building.buildings.map(b => b.amount * b.effects.tags.includes('edu2')));
			const EDU3 = sum(Building.buildings.map(b => b.amount * b.effects.tags.includes('edu3')));
			const EDU1_ = Math.min(1, 25 * EDU1 / P) / 3;
			const EDU2_ = Math.min(1, 50 * EDU2 / P) / 3;
			const EDU3_ = Math.min(1, 100 * EDU3 / P) / 3;
			return Math.floor(100 * (EDU1_ + EDU2_ + EDU3_));
		},
		get crime(){
			const CRIMINALS = this.employed * 0.1 + this.unemployed * 0.9;
			const POL = sum(Building.buildings.map(b => b.amount * b.effects.tags.includes('police')));
			const CRIME = clamp(CRIMINALS / (10 * POL) - 1, 0, 1) || 1;
			return Math.floor(100 * CRIME);
		},
		get employed(){
			return sum(Building.buildings.map(b => b.cost.res.includes(PEOPLE_U)
				? b.amount * b.cost.amt[b.cost.res.indexOf(PEOPLE_U)] : 0));
		},
		get health(){
			const P = this.pop || 1;
			const HEALTH = sum(Building.buildings.map(b => b.amount * b.effects.tags.includes('health')));
			const HEALTH_ = Math.min(1, 25 * HEALTH / P);
			return Math.floor(100 * HEALTH_);
		},
		get pop(){
			return HOUSE.amount;
		},
		get trans(){
			const TRANS = sum(Building.buildings.map(b => b.amount * b.effects.tags.includes('trans')));
			const B = this.buildings - TRANS || 1;
			const TRANS_ = Math.min(1, 10 * TRANS / B);
			return Math.floor(100 * TRANS_);
		},
		get unemployed(){
			return this.pop - this.employed;
		},
		get unemployment(){
			return Math.floor(100 * this.unemployed / this.pop) || 0;
		},
		// upgrades
		upgrade: {
			get build(){
				return sum(Building.buildings.map(b => b.amount * b.effects.tags.includes('arch')));
			},
		},
	},
	save: {
		get data(){
			return {
				buildings: Building.buildings.map(b => [b.name, b.amount]),
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
			x.buildings.forEach(pair => Building.fromString(pair[0]).amount = pair[1]);
			CITY.resources = x.resources;
			console.info('loaded');
			CITY.update.all();
		},
		reset(){
			storage.delete('city.js');
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
			this.buildingEff();
			this.buildingVis();
		},
		buildingEff(){
			Building.buildings.forEach(b => {
				// update effects
				document.getElementById('EFFECTS_' + b.name).innerHTML = b.effectElem.innerHTML;
			});
		},
		buildingVis(){
			Building.buildings.forEach(b => {
				// update visibility
				if (!b.visible && (b.amount || b.cost.revealable))
					b.reveal();
			});
		},
		buildingTick(){
			Building.buildings.forEach(b => b.tick());
		},
		resources(){
			Resource.resources.forEach(r => document.getElementById('COUNT_' + r.name).innerHTML = r.amountString);
			this.buildingVis();
		},
	},
};

// resources
// const METAL = new Resource('Metal');
const PEOPLE = new Resource('Pop', false, () => CITY.resources2.pop, false);
const PEOPLE_E = new Resource('Employed', false, () => CITY.resources2.employed, false);
const PEOPLE_U = new Resource('Unemployed', false, () => CITY.resources2.unemployed, false);
const APPROVAL = new Resource('Satisfaction', false, () => CITY.resources2.approval, false);
const ADMIN = new Resource('Administration', false, () => CITY.resources2.admin, false);
const CRIME = new Resource('Crime', false, () => CITY.resources2.crime, false);
const EDU = new Resource('Education', false, () => CITY.resources2.education, false);
const HEALTH = new Resource('Health', false, () => CITY.resources2.health, false);
const TRANS = new Resource('Transportation', false, () => CITY.resources2.trans, false);
const UNEMPLOYMENT = new Resource('Unemployment', false, () => CITY.resources2.unemployment, false);
const METAL = new Resource('Metal', false);
const ORE = new Resource('Ore', false);
const STONE = new Resource('Stone', false);
const WOOD = new Resource('Wood');

// buildings
const HOUSE = new Building('House', new Cost([WOOD], [3]), new Effects(1));
const MAKER_METAL = new Building('Foundry',
	new Cost([STONE, ORE, PEOPLE_U], [50, 1, 5]),
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

const UPGRADE_BUILD = new Building('Architect',
	new Cost([WOOD, STONE, METAL, PEOPLE_U], [100, 1000, 100, 1]),
	new Effects(0, new Cost(), ['arch'])
);

// https://wiki.sc4devotion.com
const SCHOOL1 = new Building('Elementary School',
	new Cost([WOOD, STONE, METAL, PEOPLE, PEOPLE_U], [500, 1000, 250, 25, 1]),
	new Effects(0, new Cost(), ['edu1'])
);
const SCHOOL2 = new Building('High School',
	new Cost([WOOD, STONE, METAL, PEOPLE, PEOPLE_U], [2000, 4000, 1000, 50, 2]),
	new Effects(0, new Cost(), ['edu2'])
);
const SCHOOL3 = new Building('College',
	new Cost([WOOD, STONE, METAL, PEOPLE, PEOPLE_U], [8000, 16000, 4000, 100, 4]),
	new Effects(0, new Cost(), ['edu3'])
);
const ADMINCEN = new Building('Administrative Center',
	new Cost([WOOD, STONE, METAL, PEOPLE, PEOPLE_U], [6000, 12000, 3000, 75, 3]),
	new Effects(0, new Cost(), ['admin'])
);
const CLINIC = new Building('Clinic',
	new Cost([WOOD, STONE, METAL, PEOPLE, PEOPLE_U], [500, 1000, 250, 25, 1]),
	new Effects(0, new Cost(), ['health'])
);
const POLICE = new Building('Police Station',
	new Cost([WOOD, STONE, METAL, PEOPLE, PEOPLE_U], [2000, 4000, 1000, 50, 2]),
	new Effects(0, new Cost(), ['health'])
);
const ROAD = new Building('Road',
	new Cost([STONE], [100]),
	new Effects(0, new Cost(), ['trans'])
);

const CITY_LOADED = true;

// todo save/load w/ common.js:storage