class Good {
	constructor(name = "", priceBase = 0){
		this.name = name;
		this.priceBase = priceBase;
		this.variance = Math.random();
	}
	get price(){
		return this.priceBase * (1 + this.variance * GAME.config.varianceScale);
	}
	createElem(){
		const e = document.createElement('div');
		e.classList.add('good');
		e.innerHTML = `${this.name} = ${GAME.prettyPrice(this.price)}`;
		return e;
	}
	tick(){
		this.variance += (Math.random < this.variance ? -1 : 1)
			* GAME.config.varianceQuantum;
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
		/** ms */
		priceUpdateInterval: 60*60*1000,
		varianceScale: 0.75,
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
	},
	init(){
		this.state.goods = (new Array(this.config.nGoods)).fill(0)
			.map((_, i) => new Good(this.config.goodNames[i], this.config.goodPriceBase * Math.pow(this.config.goodPriceScaling, i)));
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