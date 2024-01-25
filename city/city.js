/* exported CITY, CITY_LOADED */
/* global clamp, isString, mean, random, round, storage, sum */

function button(says, does, id = '', classes = []){
	const elem = document.createElement('span');
	elem.classList.add('button');
	elem.innerHTML = says;
	elem.onclick = does;
	if (id)
		elem.id = id;
	if (classes)
		elem.classList.add(...classes);
	return elem;
}

function colorScale(c = 0.5){
	return `hsl(${120*clamp(c, 0, 1)} 100% 50%)`;
}

class Name {
	constructor(singular, plural = ''){
		this.s = singular;
		this.pl = plural || singular;
	}
	/** @param {number} x */
	n(x){
		return `${x.toLocaleString()}&nbsp;${x === 1 ? this.s : this.pl}`;
	}
}

class Floater {
	/**
	 * @param {string} text
	 * @param {number} x
	 * @param {number} y
	 * @param {string} color
	 * @param {number} t
	 */
	constructor(text, x = 0, y = 0, color = 'White', t = 1000){
		/** @type {string} */
		this.text = text;
		/** @type {number} */
		this.x = x;
		/** @type {number} */
		this.y = y;
		/** @type {string} */
		this.color = color;
		/** @type {number} */
		this.t = t;
		/** @type {number} */
		this.vx = random.uniform(-1, 1);
		/** @type {number} */
		this.vy = random.uniform(-1, 1);
		/** @type {string} */
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
	/**
	 * @param {Name} name
	 * @param {string} src
	 * @param {string} desc
	 */
	constructor(name, src = '', desc = ''){
		this.name = name;
		this.src = src || CITY.DEFAULT.SRC;
		this.desc = desc;
	}
	get amountElem(){
		const elem = document.createElement('span');
		elem.classList.add('amount');
		elem.onmouseover = () => this.tooltipShow();
		elem.onmouseleave = () => this.tooltipHide();
		return elem;
	}
	get countElem(){
		const elem = this.amountElem;
		elem.id = this.countID;
		elem.classList.add('count');
		return elem;
	}
	get countID(){
		return 'COUNT_' + this.name.s;
	}
	get loc(){
		const rect = document.getElementById(this.countID).getBoundingClientRect();
		return {x: rect.left + window.scrollX, y: rect.top + window.scrollY};
	}
	get tooltip(){
		const elem = document.createElement('div');
		elem.innerHTML = `<h2>${this.name.s}</h2><p>${this.desc}</p>`;
		return elem;
	}
	spawnFloater(text, color = 'White'){
		const LOC = this.loc;
		new Floater(text, LOC.x, LOC.y, color).spawn();
	}
	tooltipHide(){
		CITY.tooltip.setVisibility(false);
	}
	tooltipShow(){
		const LOC = this.loc;
		CITY.tooltip.move(LOC.x, LOC.y);
		CITY.tooltip.set(this.tooltip);
		CITY.tooltip.setVisibility(true);
	}
}

class Resource extends Infobox {
	/**
	 * @param {Name|string} name (if the plural and singular are the same, you can use a string as a shorthand)
	 * @param {string} desc
	 * @param {boolean} gatherable whether there is a gather button
	 * @param {() => number} amtGetter function returning the displayed value
	 * @param {boolean} scales whether, in costs of buildings, upgrades, etc., the amount increases with each purchase
	 * @param {0|1|-1} positivity whether a statistic is good (1), bad (-1), or neutral (0). Theoretically, other values are possible, but they might break shit.
	 */
	constructor(name, desc, gatherable = true, amtGetter = undefined,
		scales = true, positivity = 0){
		if (isString(name))
			name = new Name(name);
		super(name, '', desc);
		/** @type {boolean} */
		this.gatherable = gatherable;
		/** @type {() => void} */
		this.amtGetter = amtGetter;
		/** @type {boolean} */
		this.scales = scales;
		/** @type {number} */
		this.positivity = positivity;
		CITY.resources[name] = 0;
		Resource.resources.push(this);
	}
	get amount(){
		return this.amtGetter ? this.amtGetter() : CITY.resources[this.name.s];
	}
	set amount(x){
		CITY.resources[this.name.s] = x;
	}
	get amountString(){
		// eslint-disable-next-line max-len
		return `<span style="color:${this.color}">${Math.floor(this.amount).toLocaleString()}</span> ${this.name.s}`;
	}
	get color(){
		if (this.positivity){
			let C = this.amount / 100;
			C = 0.5 * (1 - this.positivity) + this.positivity * C;
			return colorScale(C);
		}
		return 'inherit';
	}
	get gatherButton(){
		return button('Gather ' + this.name.s, () => this.gather(CITY.BONUS.CLICK), 'GATHER_' + this.name.s);
	}
	get gatherElem(){
		const elem = document.createElement('div');
		elem.classList.add(this.isSpecial ? 'specialResource' : 'resource');
		elem.id = 'RES_' + this.name.s;
		elem.appendChild(this.countElem);
		if (this.gatherable)
			elem.appendChild(this.gatherButton);
		return elem;
	}
	get isSpecial(){
		return !!this.amtGetter;
	}
	/** @param {number} n */
	costElem(n){
		const elem = this.amountElem;
		elem.innerHTML = this.name.n(n);
		return elem;
	}
	gather(n = 1){
		CITY.resources[this.name.s] += n;
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
	get affordable_build(){
		return this.amt_build.every((a, i) => a <= this.res[i].amount);
	}
	get affordable_build_ignoring_unemployed(){
		return this.amt_build.every((a, i) => this.res[i] === CITY.NAME.UNEMPLOYED
			|| a <= this.res[i].amount);
	}
	get amt_build(){
		return this.amt.map((a, i) => this.res[i].isSpecial ? a : a * CITY.BONUS.BUILD);
	}
	get elem(){
		const e = document.createElement('span');
		const AMT_BUILD = this.amt_build;
		e.innerHTML = 'Cost: ';
		this.res.forEach((r, i) => {
			if (i)
				e.appendChild(document.createTextNode(', '));
			e.appendChild(r.costElem(Math.round(AMT_BUILD[i])));
		});
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
			list.push(`Provides housing for ${this.pop * CITY.BONUS.HOUSE_SIZE} pops.`);
		if (this.tags)
			list.push(...this.tagEffects);
		if (this.prod_per_s.res.length){
			const AMT_PROD = this.amt_prod;
			list.push('Produces: ' + this.prod_per_s.res.map((r, i) => `${r.name.n(round(AMT_PROD[i], 2))}/s`).join(', '));
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
			let OFFLINE;
			switch (tag.toLowerCase()){
				case 'admin': // clinic
					o.push('Provides administrative support for a limited number of pops');
					break;
				case 'arch': // architect
					o.push('Reduces all build costs by 5%');
					break;
				case 'click': // doubles click power
					o.push('Doubles click power');
					break;
				case 'demo': // demolitionist
					o.push('Recover 20% more building material when demolishing buildings');
					break;
				case 'edu1': // elem
				case 'edu2': // mid
				case 'edu3': // high
				case 'edu4': // coll
					o.push('Provides education for a limited number of pops');
					break;
				case 'farm': // farm
					o.push('Produces 10 food units');
					break;
				case 'fire': // firefighting
					o.push('Provides fire suppression for a limited number of pops');
					break;
				case 'health': // clinic
					o.push('Provides healthcare for a limited number of pops');
					break;
				case 'house_size':
					o.push(`Houses can now hold ${CITY.BONUS.HOUSE_SIZE+1} people`);
					break;
				case 'offline': // cops
					OFFLINE = Math.round(CITY.BONUS.OFFLINE * 100);
					o.push(`Increase offline resource gain from ${OFFLINE}% to ${OFFLINE+1}%`);
					break;
				case 'police': // cops
					o.push('Provides public safety for a limited number of pops');
					break;
				case 'traffic': // traffic suppression
					o.push('Reduces traffic');
					break;
				case 'trans': // roads
					o.push('Provides transportation for a limited number of buildings');
					break;
				case 'wfp1': // workforce participation
					o.push('Increases workforce participation of teens by 10%');
					break;
				case 'wfp3': // workforce participation
					o.push('Increases workforce participation of elders by 10%');
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
	 * @param {Name|string} name (if the plural and singular are the same, you can use a string as a shorthand)
	 * @param {Cost} baseCost
	 * @param {Effects} effects
	 */
	constructor(name, baseCost = new Cost(), effects = new Effects()){
		if (isString(name))
			name = new Name(name);
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
		return this.name.n(this.amount);
	}
	get base(){
		return CITY.CONFIG.BASE;
	}
	get buildButton(){
		return button('Build', () => this.build(), 'BUILD_' + this.name.s);
	}
	get buildElem(){
		const elem = document.createElement('div');
		elem.classList.add(this instanceof Upgrade ? 'upgrade' : 'building');
		elem.classList.add('hidden');
		elem.id = 'BUILDING_' + this.name.s;
		elem.appendChild(this.countElem);
		elem.appendChild(this.buildButton);
		elem.appendChild(this.demoButton);
		elem.appendChild(document.createElement('br'));
		elem.appendChild(this.costElem);
		elem.appendChild(this.effectElem);
		return elem;
	}
	get cost(){
		return this.baseCost.mul(Math.pow(this.base, this.amount) * CITY.BONUS.BUILD);
	}
	get costElem(){
		const elem = this.cost.elem;
		elem.id = 'COST_' + this.name.s;
		return elem;
	}
	get effectElem(){
		const elem = this.effects.elem;
		elem.id = 'EFFECTS_' + this.name.s;
		return elem;
	}
	get demoButton(){
		return button('Demolish', () => this.demo(), 'DEMO_' + this.name.s);
	}
	build(n = 1){
		for (let i = 0; i < n; i++)
			if (this.cost.affordable_build
					|| this.effects.pop && this.cost.affordable_build_ignoring_unemployed){
				if (CITY.resources2.food < this.effects.pop * CITY.BONUS.HOUSE_SIZE && !this.effects.tags.includes('farm')){
					// eslint-disable-next-line max-len
					this.spawnFloater(`You have insufficient food production to build another ${this.name.s}.`, CITY.COLOR.BAD);
					break;
				}
				this.cost.modifyStock(-CITY.BONUS.BUILD);
				this.amount++;
			}
			else {
				this.spawnFloater(`You can't afford another ${this.name.s}.`, CITY.COLOR.BAD);
				break;
			}
		CITY.update.buildings();
	}
	demo(n = 1){
		for (let i = 0; i < n; i++)
			if (0 < this.amount){
				if (CITY.resources2.unemployed < this.effects.pop * CITY.BONUS.HOUSE_SIZE){
					// eslint-disable-next-line max-len
					this.spawnFloater(`You have insufficient unemployed pops to demolish another ${this.name.s}.`, CITY.COLOR.BAD);
					break;
				}
				this.cost.modifyStock(CITY.BONUS.DEMO);
				this.amount--;
			}
			else {
				this.spawnFloater(`You have no ${this.name.s} to demolish.`, CITY.COLOR.BAD);
				break;
			}
		CITY.update.buildings();
	}
	reveal(){
		document.getElementById('BUILDING_' + this.name.s).classList.remove('hidden');
		this.visible = true;
	}
	/** @param {number} t in seconds */
	tick(t){
		// production
		if (this.effects.prod_per_s.mul(-1).affordable)
			this.effects.prod_per_s.res
				// eslint-disable-next-line max-len
				.forEach((r, i) => r.gather(CITY.BONUS.PROD * this.amount * this.effects.prod_per_s.amt[i] * t));
	}
	/** @param {string} s */
	static fromString(s){
		return this.buildings.find(b => b.name.s === s);
	}
}
/** @type {Building[]} */
Building.buildings = [];

class Upgrade extends Building {
	/**
	 * @param {Name|string} name (if the plural and singular are the same, you can use a string as a shorthand)
	 * @param {Cost} baseCost
	 * @param {Effects} effects
	 */
	constructor(name, baseCost = new Cost(), effects = new Effects()){
		super(name, baseCost, effects);
	}
	get base(){
		return CITY.CONFIG.BASE_UPGRADE;
	}
}

const CITY = {
	BONUS: {
		get BUILD(){ // build efficiency
			return Math.pow(0.95, CITY.resources2.upgrade.build);
		},
		get CLICK(){
			const POW = CITY.cachedBuildingTagValue('click');
			return Math.pow(CITY.CONFIG.UPGRADE_EFFECT, POW);
		},
		get DEMO(){ // demolition efficiency
			return 1 - Math.pow(0.8, CITY.resources2.upgrade.demo + 1);
		},
		get HOUSE_SIZE(){ // people per house
			return 2 + CITY.cachedBuildingTagValue('house_size');
		},
		get OFFLINE(){ // offline gain
			return 1 + CITY.cachedBuildingTagValue('offline')/100;
		},
		get PROD(){ // production efficiency
			return 0.1 + CITY.resources2.approval / 100;
		},
		WORKFORCE_PARTICIPATION: {
			get AGE1(){ // starts out at 40%, slowly increases to 100%
				return 1 - 0.6 * Math.pow(0.9, CITY.resources2.upgrade.wfp1);
			},
			get AGE3(){ // starts out at 40%, slowly increases to 100%
				return 1 - 0.6 * Math.pow(0.9, CITY.resources2.upgrade.wfp3);
			},
		},
	},
	CACHE: {},
	/** searches the cache for the key - if it doesn't exist, uses value provided by the getter */
	cached(key, getter){
		if (!(this.CACHE[key] && this.CACHE[key][0] === CITY.CACHET))
			this.CACHE[key] = [CITY.CACHET, getter()];
		return this.CACHE[key][1];
	},
	cachedBuildingTagValue(tag){
		// eslint-disable-next-line max-len
		return CITY.cached(`cbtv_${tag}`, () => sum(Building.buildings.map(b => b.amount * b.effects.tags.includes(tag))));
	},
	CACHET: new Date(),
	COLOR: {
		BAD: 'red',
		DEFAULT: 'silver',
		GOOD: 'lime',
		NEUTRAL: 'yellow',
	},
	CONFIG: {
		AUTOSAVE_INTERVAL: 60 * 1000, // autosave every minute
		BASE: 1.15, // each building is 15% more
		BASE_UPGRADE: 10, // each upgrade is 9x more
		FPS: 20,
		UPGRADE_EFFECT: 2, // each upgrade doubles something
	},
	DEBUG: {
		get FPS(){
			return Math.floor(1000 / this.TICK);
		},
		TICK: 0,
	},
	DEFAULT: {
		SRC: 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Ambox_blue_question.svg',
	},
	DESC: {
		CONS: 'Basic construction material.',
	},
	ELEM: {
		/** @returns {HTMLDivElement} */
		get MAIN(){
			return document.getElementById('main');
		},
	},
	init(){
		this.loadData();
		const MAIN = this.ELEM.MAIN;
		// control panel
		// todo (save, reset)
		const CTRL_CONTAINER = this.ELEM.CTRL_CONTAINER = document.createElement('div');
		MAIN.appendChild(CTRL_CONTAINER);
		CTRL_CONTAINER.appendChild(button('Save', () => CITY.save.write(), 'ctrl_save', ['ctrl']));
		CTRL_CONTAINER.appendChild(button('Reset Data', CITY.save.reset, 'ctrl_reset', ['ctrl']));
		// status list
		MAIN.appendChild(document.createElement('hr'));
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
		// tooltip
		this.tooltip.init();
		// tick info
		const TICK = this.ELEM.TICK = document.createElement('div');
		TICK.id = 'tick';
		document.body.appendChild(TICK);
	},
	main(){
		this.init();
		this.update.all();
		setInterval(() => this.update.globalTick(1/CITY.CONFIG.FPS), 1000 / this.CONFIG.FPS);
		console.info('city.js loaded.');
		console.info(`${Resource.resources.length} resource types.`);
		console.info(`${Building.buildings.length} building types.`);
		// try to load
		this.save.read();
		// try to save
		this.save.write();
		setInterval(() => this.save.write(), this.CONFIG.AUTOSAVE_INTERVAL);
	},
	NAME: {
		/** @type {Resource} */
		UNEMPLOYED: undefined,
	},
	/** @param {number} t in ms */
	offlineGain(t = 0){
		// t in ms, T in s
		const TIME = t/1000 * this.BONUS.OFFLINE;
		this.update.globalTick(TIME);
		// eslint-disable-next-line max-len
		alert(`${Math.floor(TIME)} seconds of offline time (${Math.round(100*this.BONUS.OFFLINE)}% Efficiency)`);
	},
	resources: {},
	resources2: {
		get approval(){
			return Math.floor(mean([this.admin, 100 - this.crime,
				this.education, this.fire, this.happiness,
				100 - this.traffic]));
		},
		get admin(){
			const P = this.pop.total || 1;
			const ADMIN = CITY.cachedBuildingTagValue('admin');
			const ADMIN_ = Math.min(1, 100 * ADMIN / P);
			return Math.floor(100 * ADMIN_);
		},
		get buildings(){
			return CITY.cached('buildings', () => sum(Building.buildings.map(b => b.amount)));
		},
		get crime(){
			const POP_RAMPUP = clamp(this.pop.total, 0, 30) / 30; // crime reduced if pop < 30
			const EDUCATION_BONUS = this.education / 1000; // [0, 0.1]
			const CRIMINALS = this.pop.employed * (0.1 - EDUCATION_BONUS)
				+ this.pop.unemployed * (1 - EDUCATION_BONUS);
			const POL = CITY.cachedBuildingTagValue('police') || 1e-3;
			const CRIME = clamp(CRIMINALS / (15 * POL) - 1, 0, 1);
			return Math.floor(100 * CRIME * POP_RAMPUP);
		},
		get education(){
			const P0 = this.pop.age0 || 1;
			const P1 = this.pop.age1 || 1;
			const P2 = this.pop.age2 || 1;
			const EDU1 = CITY.cachedBuildingTagValue('edu1');
			// const EDU2 = CITY.cachedBuildingTagValue('edu2');
			const EDU3 = CITY.cachedBuildingTagValue('edu3');
			const EDU4 = CITY.cachedBuildingTagValue('edu4');
			const EDU1_ = Math.min(1, 30 * EDU1 / P0) / 3;
			// const EDU2_ = Math.min(1, 30 * EDU2 / P0) / 4;
			const EDU3_ = Math.min(1, 30 * EDU3 / P1) / 3;
			const EDU4_ = Math.min(1, 250 * EDU4 / P2) / 3;
			return Math.floor(100 * (EDU1_ + EDU3_ + EDU4_));
		},
		get fire(){
			const P = this.pop.total || 1;
			const STATIONS = CITY.cachedBuildingTagValue('fire');
			const FF = Math.min(1, 1000 * STATIONS / P);
			return Math.floor(100 * FF);
		},
		get food(){
			const BASE = 5;
			const FARMERS = CITY.cachedBuildingTagValue('farm');
			const PRODUCTION = BASE + 7 * FARMERS;
			const CONSUMPTION = this.pop.foodConsumption;
			return PRODUCTION - CONSUMPTION;
		},
		get happiness(){
			const H_FOOD = 0 < this.food ? 1 : 0;
			const H_HEALTH = this.health/100;
			const H_HOBO = 1 - this.unemployment/100;
			return Math.floor(100 * mean([H_FOOD, H_HEALTH, H_HOBO]));
		},
		get health(){
			const P = this.pop.total || 1;
			const HEALTH = CITY.cachedBuildingTagValue('health');
			const HEALTH_ = Math.min(1, 600 * HEALTH / P);
			return Math.floor(100 * HEALTH_);
		},
		pop: {
			get age0(){ // 0-12
				return this.total * 0.19;
			},
			get age1(){ // 13-18
				return this.total * 0.07;
			},
			get age2(){ // 19-54
				return this.total * 0.46;
			},
			get age3(){ // >=55
				return this.total * 0.28;
			},
			get employed(){
				return CITY.cached('employed', () => sum(Building.buildings.map(b => b.cost.res.includes(CITY.NAME.UNEMPLOYED)
					? b.amount * b.cost.amt[b.cost.res.indexOf(CITY.NAME.UNEMPLOYED)] : 0)));
			},
			get foodConsumption(){
				return this.age0 * 0.5 + this.age1 * 0.75 + this.age2 + this.age3;
			},
			get total(){
				return CITY.cached('poptotal',
					() => sum(Building.buildings
						.map(b => b.amount * b.effects.pop * CITY.BONUS.HOUSE_SIZE)));
			},
			get unemployed(){
				return this.workforce - this.employed;
			},
			get workforce(){ // https://en.wikipedia.org/wiki/File:Work_Force_Participation_Rate_by_Age_Group.webp
				return CITY.BONUS.WORKFORCE_PARTICIPATION.AGE1 * this.age1
					+ 0.8 * this.age2
					+ CITY.BONUS.WORKFORCE_PARTICIPATION.AGE3 * this.age3;
			},
		},
		get trans(){
			const TRANS = CITY.cachedBuildingTagValue('trans');
			const B = this.buildings - TRANS || 1;
			const TRANS_ = Math.min(1, 10 * TRANS / B);
			return Math.floor(100 * TRANS_);
		},
		get traffic(){
			const POP_RAMPUP = clamp(this.pop.total, 0, 10) / 10; // traffic reduced if pop < 10
			const TRAFFIC_PROD = this.buildings / 25;
			const TRAFFIC_REDU = CITY.cachedBuildingTagValue('traffic') || 0.5;
			const TRAFFIC = clamp(TRAFFIC_PROD/TRAFFIC_REDU - 1, 0, 1);
			const TRANS = this.trans;
			const TRAF_ = Math.min(1, TRAFFIC);
			return Math.floor((50 - TRANS/2 + 50 * TRAF_) * POP_RAMPUP);
		},
		get unemployment(){
			return Math.floor(100 * this.pop.unemployed / this.pop.total) || 0;
		},
		// upgrades
		upgrade: {
			get build(){
				return CITY.cachedBuildingTagValue('arch');
			},
			get demo(){
				return CITY.cachedBuildingTagValue('demo');
			},
			get wfp1(){
				return CITY.cachedBuildingTagValue('wfp1');
			},
			get wfp3(){
				return CITY.cachedBuildingTagValue('wfp3');
			},
		},
	},
	save: {
		get data(){
			return {
				buildings: Building.buildings.map(b => [b.name.s, b.amount]),
				resources: CITY.resources,
				time: +new Date(),
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
			x.buildings.forEach(pair => {
				try {
					Building.fromString(pair[0]).amount = pair[1];
				}
				catch (_){
					console.warn(`CITY.save.read: Invalid building "${pair[0]}"`);
				}
			});
			CITY.resources = x.resources;
			if (x.time)
				CITY.offlineGain(new Date() - x.time);
			console.info('loaded');
			CITY.update.all();
		},
		reset(){
			if (!confirm('Are you sure you want to reset the save? (This is PERMANENT!)'))
				return;
			storage.delete('city.js');
			location.reload();
		},
		write(){
			storage.write('city.js', this.data);
			console.info('saved');
		},
	},
	tooltip: {
		/** @type {HTMLDivElement} */
		get elem(){
			return CITY.ELEM.TOOLTIP;
		},
		init(){
			const TOOLTIP = CITY.ELEM.TOOLTIP = document.createElement('div');
			document.body.appendChild(TOOLTIP);
			TOOLTIP.id = 'tooltip';
			TOOLTIP.innerHTML = 'TEST';
			this.setVisibility(false);
			this.move();
		},
		move(x = 0, y = 0){
			this.elem.style.left = x + 'px';
			this.elem.style.top = y + 20 + 'px';
		},
		/** @param {HTMLElement} elem */
		set(elem){
			this.elem.innerHTML = '';
			this.elem.appendChild(elem);
		},
		setVisibility(state = true){
			this.elem.style.display = state ? 'block' : 'none';
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
				const COUNT = document.getElementById('COUNT_' + b.name.s);
				COUNT.innerHTML = b.amountString;
				// update cost
				const COST = document.getElementById('COST_' + b.name.s);
				COST.innerHTML = '';
				COST.appendChild(b.costElem);
			});
			this.buildingEff();
			this.buildingVis();
		},
		buildingEff(){
			Building.buildings.forEach(b => {
				// update effects
				const EFF = document.getElementById('EFFECTS_' + b.name.s);
				EFF.innerHTML = '';
				EFF.appendChild(b.effectElem);
			});
		},
		buildingVis(){
			Building.buildings.forEach(b => {
				// update visibility
				if (!b.visible && (b.amount || b.cost.revealable))
					b.reveal();
			});
		},
		/** @param {number} t time in seconds */
		buildingTick(t){
			Building.buildings.forEach(b => b.tick(t));
		},
		fix(){
			Resource.resources.forEach(r => r.amount = Math.max(0, r.amount));
		},
		fpsMeter(){
			CITY.ELEM.TICK.innerHTML = Math.min(CITY.CONFIG.FPS, CITY.DEBUG.FPS) + ' TPS';
		},
		/** @param {number} t time in seconds */
		globalTick(t){
			CITY.CACHET = new Date();
			this.buildingTick(t); // for now, just this.
			this.fix();
			this.fpsMeter();
			CITY.DEBUG.TICK = new Date() - CITY.CACHET;
		},
		resources(){
			Resource.resources.forEach(r => document.getElementById('COUNT_' + r.name.s).innerHTML = r.amountString);
			this.buildingVis();
		},
	},
};

CITY.loadData = () => {
// resources
/* eslint-disable indent, no-unused-vars */

// population statistics
const PEOPLE = new Resource('Population', 'Total number of people in the settlement. Creates demand for most services.', false, () => CITY.resources2.pop.total, false);
const PEOPLE_AGE0 = new Resource('Population (Child)', 'People under 13. None work. Creates demand for elementary school education.', false, () => CITY.resources2.pop.age0, false);
const PEOPLE_AGE1 = new Resource('Population (Teen)', 'People 13-18. Some work, but most do not. Creates demand for high school education.', false, () => CITY.resources2.pop.age1, false);
const PEOPLE_AGE2 = new Resource('Population (Adult)', 'People 18-54. Most work. Creates a slight demand for college education.', false, () => CITY.resources2.pop.age2, false);
const PEOPLE_AGE3 = new Resource('Population (Elder)', 'People 55 or older. Some work, but most do not.', false, () => CITY.resources2.pop.age3, false);
const PEOPLE_W = new Resource('Workforce', 'Number of people able and willing to work. Ensure as many of them are employed as possible, otherwise crime and other unpleasant effects will become rampant.', false, () => CITY.resources2.pop.workforce, false);
const PEOPLE_E = new Resource('Employed', 'Employed people in the workforce.', false, () => CITY.resources2.pop.employed, false);
const PEOPLE_U = CITY.NAME.UNEMPLOYED = new Resource('Unemployed', 'Unemployed people in the workforce. Folks out of work tend to turn to crime to make ends meet, and their presence irritates other settlers, futher reducing productivity.', false, () => CITY.resources2.pop.unemployed, false);

// concrete
const FOOD = new Resource('Food Production', 'Food is produced on farms, and cannot be stored. If it is not consumed; it immediately rots. You must have a net inflow of food to increase population. Children and teens consume less food than adults and elders.', false, () => CITY.resources2.food, false);

// abstract
const APPROVAL = new Resource('Productivity', 'Impacts resource generation rate.', false, () => CITY.resources2.approval, false, 1);
const ADMIN = new Resource('Administration', 'Improves productivity. Increased by administration centers.', false, () => CITY.resources2.admin, false, 1);
const CRIME = new Resource('Crime', 'Crime is primarily perpetrated by unemployed pops, but even employed pops commit some crime. Education slightly reduces crime. Police greatly reduce crime.', false, () => CITY.resources2.crime, false, -1);
const EDU = new Resource('Education', 'Improves productivity and slightly reduces crime.', false, () => CITY.resources2.education, false, 1);
const FIREFIGHTING = new Resource('Fire Suppression', 'Improves productivity. Increased by fire stations.', false, () => CITY.resources2.fire, false, 1);
const HAPPINESS = new Resource('Happiness', 'Improves productivity. Affected by food availability, health, and unemployment.', false, () => CITY.resources2.happiness, false, 1);
const HEALTH = new Resource('Health', 'Improves happiness. Increased by clinics.', false, () => CITY.resources2.health, false, 1);
const TRANS = new Resource('Infrastructure', 'Improves productivity and reduces traffic. Increased by roads.', false, () => CITY.resources2.trans, false, 1);
const TRAFFIC = new Resource('Traffic', 'Reduces productivity. Decreased by infrastructure and signage.', false, () => CITY.resources2.traffic, false, -1);
const UNEMPLOYMENT = new Resource('Unemployment', 'Percentage of workforce employed. High unemployment reduces happiness.', false, () => CITY.resources2.unemployment, false, -1);

// actual legit resources
const METAL = new Resource('Metal', CITY.DESC.CONS, false);
const ORE = new Resource('Ore', 'Can be smelted into metal.', false);
const STONE = new Resource('Stone', CITY.DESC.CONS, false);
const WOOD = new Resource('Wood', CITY.DESC.CONS);

// buildings
const HOUSE = new Building(new Name('House', 'Houses'), new Cost([WOOD], [3]), new Effects(1));
const FARM = new Building(new Name('Farm', 'Farms'),
	new Cost([WOOD, PEOPLE_U], [25, 1]),
	new Effects(1, new Cost(), ['farm'])
);
const MAKER_METAL = new Building(new Name('Foundry', 'Foundries'),
	new Cost([STONE, ORE, PEOPLE_U], [50, 1, 1]),
	new Effects(0, new Cost([ORE, METAL], [-1, 1]))
);
const MAKER_ORE = new Building(new Name('Mine', 'Mines'),
	new Cost([STONE, PEOPLE_U], [25, 1]),
	new Effects(0, new Cost([ORE], [1]))
);
const MAKER_STONE = new Building(new Name('Masonry', 'Masonries'),
	new Cost([WOOD, PEOPLE_U], [25, 1]),
	new Effects(0, new Cost([STONE], [1]))
);
const MAKER_WOOD = new Building(new Name('Lumbermill', 'Lumbermills'),
	new Cost([WOOD, PEOPLE_U], [25, 1]),
	new Effects(0, new Cost([WOOD], [1]))
);

const UPGRADE_BUILD = new Building(new Name('Architect', 'Architects'),
	new Cost([WOOD, STONE, METAL, PEOPLE_U], [100, 1000, 100, 1]),
	new Effects(0, new Cost(), ['arch'])
);

const UPGRADE_DEMO = new Building(new Name('Demolitionist', 'Demolitionists'),
	new Cost([WOOD, STONE, METAL, PEOPLE_U], [100, 1000, 100, 1]),
	new Effects(0, new Cost(), ['demo'])
);

// cf. https://wiki.sc4devotion.com
/*
	1 firefighter : 1000 people
	1 doctor : 600 people
	1 teacher : 30 students
	1 cop : 450 people, OR... 1 cop : 15 unemployed people
*/
const SCHOOL1 = new Building(new Name('Elementary School', 'Elementary Schools'),
	new Cost([WOOD, STONE, METAL, PEOPLE_AGE0, PEOPLE_U], [500, 1000, 250, 15, 1]),
	new Effects(0, new Cost(), ['edu1'])
);
/*
const SCHOOL2 = new Building('Middle School',
	new Cost([WOOD, STONE, METAL, PEOPLE_AGE0, PEOPLE_U], [2000, 4000, 1000, 15, 1]),
	new Effects(0, new Cost(), ['edu2'])
);*/
const SCHOOL3 = new Building(new Name('High School', 'High Schools'),
	new Cost([WOOD, STONE, METAL, PEOPLE_AGE1, PEOPLE_U], [1000, 2000, 500, 15, 1]),
	new Effects(0, new Cost(), ['edu3'])
);
const SCHOOL4 = new Building(new Name('College', 'Colleges'),
	new Cost([WOOD, STONE, METAL, PEOPLE_AGE2, PEOPLE_U], [8000, 16000, 4000, 125, 4]),
	new Effects(0, new Cost(), ['edu4'])
);
const ADMINCEN = new Building(new Name('Administrative Center', 'Administrative Centers'),
	new Cost([WOOD, STONE, METAL, PEOPLE, PEOPLE_U], [5000, 10000, 2500, 50, 1]),
	new Effects(0, new Cost(), ['admin'])
);
const CLINIC = new Building(new Name('Clinic', 'Clinics'),
	new Cost([WOOD, STONE, METAL, PEOPLE, PEOPLE_U], [500, 1000, 250, 300, 1]),
	new Effects(0, new Cost(), ['health'])
);
const POLICE = new Building(new Name('Police Station', 'Police Stations'),
	new Cost([WOOD, STONE, METAL, PEOPLE, PEOPLE_U], [1000, 2000, 500, 30, 1]),
	new Effects(0, new Cost(), ['police'])
);
const FIRE = new Building(new Name('Fire Station', 'Fire Stations'),
	new Cost([WOOD, STONE, METAL, PEOPLE, PEOPLE_U], [1000, 2000, 500, 250, 1]),
	new Effects(0, new Cost(), ['fire'])
);
const ROAD = new Building(new Name('Road', 'Roads'),
	new Cost([STONE], [100]),
	new Effects(0, new Cost(), ['trans'])
);
const SIGNAGE = new Building('Signage',
	new Cost([WOOD], [10]),
	new Effects(0, new Cost(), ['traffic'])
);

// real upgrades

const UPGRADE_CLICK = new Upgrade('Better Axe',
	new Cost([WOOD], [10]),
	new Effects(0, new Cost(), ['click'])
);

const UPGRADE_WFP1 = new Upgrade('Increased Teen Workforce Participation',
	new Cost([WOOD, STONE, METAL], [1000, 500, 250]),
	new Effects(0, new Cost(), ['wfp1'])
);

const UPGRADE_WFP3 = new Upgrade('Increased Elder Workforce Participation',
	new Cost([WOOD, STONE, METAL], [1000, 500, 250]),
	new Effects(0, new Cost(), ['wfp3'])
);

const UPGRADE_HOUSE_SIZE = new Upgrade('Bigger Houses',
	new Cost([WOOD, STONE], [2000, 1000]),
	new Effects(0, new Cost(), ['house_size'])
);

const UPGRADE_OFFLINE_GAIN = new Upgrade('Better Offline Gain',
	new Cost([WOOD, STONE, METAL], [10000, 5000, 2500]),
	new Effects(0, new Cost(), ['offline'])
);
};

const CITY_LOADED = true;