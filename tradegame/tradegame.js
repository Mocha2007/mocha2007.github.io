const range = n => (new Array(n)).fill(0).map((_, i) => i);

class Good {
	constructor(name = "", priceBase = 0){
		this.name = name;
		this.priceBase = priceBase;
		this.variance = Math.random();
	}
	get id(){
		return GAME.state.goods.indexOf(this);
	}
	get price(){
		return this.priceBase * (1 + (2*this.variance - 1) * GAME.config.varianceScaleGood);
	}
	createElem(priceOverride){
		const e = document.createElement('div');
		e.classList.add('good');
		e.innerHTML = `${this.name} = ${GAME.prettyPrice(priceOverride || this.price)}`;
		return e;
	}
	tick(){
		this.variance += (Math.random < this.variance ? -1 : 1)
			* GAME.config.varianceQuantum;
	}
}

class Town {
	constructor(){
		this.name = Town.randomName();
		this.x = Math.random();
		this.y = Math.random();
		this.variances = range(GAME.config.nGoods).map(_ => Math.random());
	}
	createElem(){
		const e = document.createElement('div');
		e.classList.add('town');
		e.appendChild(GAME.elem.createHeader(3, this.name));
		GAME.state.goods.forEach(g => e.appendChild(g.createElem(this.price(g))));
		return e;
	}
	/** @param {Good} good  */
	price(good){
		return good.price * (1 + (2*this.variances[good.id]-1) * GAME.config.varianceScaleTown);
	}
	static randomName(){
		return "Town";
	}
}

const GAME = {
	config: {
		goodPriceBase: 4,
		goodPriceScaling: 1.36,
		goodNames: [
			"Grain", "Vegetables", "Fruit", "Eggs",
			"Cloth", "Timber", "Wax", "Herbs",
			"Spices", "Meat", "Iron", "Beer",
			"Wine", "Bronze", "Tools", "Silver",
			"Gold", "Silk", "Tomes", "Gems"
		],
		nGoods: 20,
		nTowns: 20,
		/** ms */
		priceUpdateInterval: 60*60*1000,
		varianceScaleGood: 0.5,
		varianceScaleTown: 0.5,
		varianceQuantum: 0.01,
	},
	elem: {
		createHeader(n = 1, s = ""){
			const e = document.createElement(`h${n}`);
			e.innerHTML = s;
			return e;
		},
		/** @type {HTMLDivElement} */
		priceList: undefined,
	},
	prettyPrice(x = 0){
		let r = Math.round(x);
		const d = r % 12;
		r = Math.floor(r / 12);
		const s = r % 20;
		const l = Math.floor(r / 20);
		if (l) {
			return `${l} £ ${s} s ${d} d`;
		}
		if (s) {
			return `${s} s ${d} d`;
		}
		return `${d} d`;
	},
	state: {
		/** @type {Good[]} */
		goods: [],
		t: 0,
		/** @type {Town[]} */
		towns: [],
	},
	init(){
		this.state.goods = range(this.config.nGoods)
			.map(i => new Good(this.config.goodNames[i], this.config.goodPriceBase * Math.pow(this.config.goodPriceScaling, i)));
		this.state.towns = range(this.config.nTowns)
			.map(i => new Town());
		if (!this.elem.priceList) {
			const priceListContainer = document.createElement('div');
			document.body.appendChild(priceListContainer);
			priceListContainer.appendChild(this.elem.createHeader(2, "Prices"));
			const priceList = this.elem.priceList = document.createElement('div');
			priceList.id = 'priceList';
			priceListContainer.appendChild(priceList);
		}
		this.updateInterface();
		console.info('tradegame.js loaded');
	},
	passTime(t = 0){
		this.state.t += t;
		const ticks = Math.floor(t / this.config.priceUpdateInterval);
		for (let i = 0; i < ticks; i++){
			this.tick();
		}
	},
	tick(){
		this.state.goods.forEach(g => g.tick());
		this.updateInterface();
	},
	updateInterface(){
		this.elem.priceList.innerHTML = '';
		this.state.goods.forEach(g => this.elem.priceList.appendChild(g.createElem()));
	},
};

GAME.init();