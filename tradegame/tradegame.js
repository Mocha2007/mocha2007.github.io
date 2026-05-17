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
		this.name = GAME.nameGen.name();
		this.x = Math.random()*0.8 + 0.1;
		this.y = Math.random()*0.8 + 0.1;
		this.variances = range(GAME.config.nGoods).map(_ => Math.random());
	}
	get id(){
		return GAME.state.towns.indexOf(this);
	}
	createElem(){
		const e = document.createElement('div');
		e.classList.add('town');
		e.appendChild(GAME.elem.createHeader(3, this.name));
		GAME.state.goods.forEach(g => e.appendChild(g.createElem(this.price(g))));
		return e;
	}
	createMapElem(){
		const e = document.createElement('div');
		e.classList.add('mapIcon');
		if (this.id === GAME.state.location){
			e.classList.add('location');
		}
		e.title = `${this.name}\nDistance: ${GAME.state.town.distance(this).toFixed(0)} km\nTravel Time: ${GAME.prettyDuration(GAME.state.town.travelTime(this))}`;
		e.onclick = () => GAME.confirmTravel(this.id);
		e.style.left = `${this.x*100}%`;
		e.style.top = `${this.y*100}%`;
		return e;
	}
	/** @param {Town} other */
	distance(other){
		return Math.hypot((this.x - other.x), (this.y - other.y)) * GAME.config.distanceScale;
	}
	/** @param {Good} good  */
	price(good){
		return good.price * (1 + (2*this.variances[good.id]-1) * GAME.config.varianceScaleTown);
	}
	/** @param {Town} other */
	travelTime(other){
		return this.distance(other) / GAME.config.travelSpeed;
	}
}

class MoneyFormat {
	static LSD = 0;
	static DECIMAL = 1;
}

const GAME = {
	version: '26w21',
	config: {
		dateFormat: {month: 'long', day: 'numeric', year: 'numeric'},
		/* map width/height, in km */
		distanceScale: 1000,
		goodPriceBase: 4,
		goodPriceScaling: 1.36,
		goodNames: [
			"Grain", "Vegetables", "Fruit", "Eggs",
			"Cloth", "Timber", "Wax", "Herbs",
			"Spices", "Meat", "Iron", "Beer",
			"Wine", "Bronze", "Tools", "Silver",
			"Gold", "Silk", "Tomes", "Gems"
		],
		moneyFormat: MoneyFormat.LSD,
		name: 'Trader',
		nGoods: 20,
		nTowns: 20,
		playerStartMoney: 480,
		/** ms */
		priceUpdateInterval: 60*60*1000,
		/** km/h */
		travelSpeed: 5,
		varianceScaleGood: 0.5,
		varianceScaleTown: 0.5,
		varianceQuantum: 0.01,
	},
	elem: {
		createBuySellButtons(goodId = 0){
			const good = GAME.state.goods[goodId];
			const container = document.createElement('span');
			container.classList.add('buySellContainer');
			// BUY
			const buyContainer = document.createElement('span');
			buyContainer.classList.add('buyContainer');
			container.appendChild(buyContainer);
			// buyContainer.appendChild(document.createTextNode('Buy: '));
			const buyAmt = document.createElement('input');
			buyAmt.type = 'number';
			buyAmt.value = 0;
			buyContainer.appendChild(buyAmt);
			const buyMaxButton = document.createElement('span');
			buyMaxButton.innerHTML = 'max';
			buyMaxButton.classList.add('button');
			buyMaxButton.classList.add('buyMaxButton');
			buyMaxButton.onclick = () => {
				const price = GAME.state.town.price(good);
				const maxAmt = Math.floor(GAME.state.player.money / price);
				buyAmt.value = maxAmt;
			};
			buyContainer.appendChild(buyMaxButton);
			const buyNoneButton = document.createElement('span');
			buyNoneButton.innerHTML = 'none';
			buyNoneButton.classList.add('button');
			buyNoneButton.onclick = () => buyAmt.value = 0;
			buyNoneButton.classList.add('buyNoneButton');
			buyContainer.appendChild(buyNoneButton);
			const buyButton = document.createElement('span');
			buyButton.innerHTML = 'buy';
			buyButton.classList.add('buyButton');
			buyButton.classList.add('button');
			buyButton.onclick = () => {
				const amt = +buyAmt.value;
				const priceUnit = GAME.state.town.price(good);
				const priceTotal = Math.round(amt * priceUnit);
				if (priceTotal <= GAME.state.player.money) {
					if (confirm(`Really buy ${amt} ${GAME.state.goods[goodId].name} for ${GAME.prettyPrice(priceTotal)}?`)){
						GAME.state.player.money -= priceTotal;
						GAME.state.player.goods[goodId] += amt;
					}
				}
				else {
					alert('Insufficient funds.');
				}
			};
			buyButton.classList.add('buyButton');
			buyContainer.appendChild(buyButton);
			// SELL
			const sellContainer = document.createElement('span');
			sellContainer.classList.add('sellContainer');
			container.appendChild(sellContainer);
			// sellContainer.appendChild(document.createTextNode('Sell: '));
			const sellAmt = document.createElement('input');
			sellAmt.type = 'number';
			sellAmt.value = 0;
			sellContainer.appendChild(sellAmt);
			const sellMaxButton = document.createElement('span');
			sellMaxButton.innerHTML = 'max';
			sellMaxButton.classList.add('button');
			sellMaxButton.classList.add('sellMaxButton');
			sellMaxButton.onclick = () => sellAmt.value = GAME.state.player.goods[goodId];
			sellContainer.appendChild(sellMaxButton);
			const sellNoneButton = document.createElement('span');
			sellNoneButton.innerHTML = 'none';
			sellNoneButton.classList.add('button');
			sellNoneButton.onclick = () => sellAmt.value = 0;
			sellNoneButton.classList.add('sellNoneButton');
			sellContainer.appendChild(sellNoneButton);
			const sellButton = document.createElement('span');
			sellButton.innerHTML = 'sell';
			sellButton.classList.add('sellButton');
			sellButton.classList.add('button');
			sellButton.onclick = () => {
				const amt = +sellAmt.value;
				const priceUnit = GAME.state.town.price(good);
				const priceTotal = Math.round(amt * priceUnit);
				if (amt <= GAME.state.player.goods[goodId]) {
					if (confirm(`Really sell ${amt} ${GAME.state.goods[goodId].name} for ${GAME.prettyPrice(priceTotal)}?`)){
						GAME.state.player.goods[goodId] -= amt;
						GAME.state.player.money += priceTotal;
					}
				}
				else {
					alert('Insufficient goods.');
				}
			};
			sellButton.classList.add('sellButton');
			sellContainer.appendChild(sellButton);
			return container;
		},
		createHeader(n = 1, s = ""){
			const e = document.createElement(`h${n}`);
			e.innerHTML = s;
			return e;
		},
		/** @type {HTMLDivElement} */
		map: undefined,
		/** @type {HTMLDivElement} */
		player: undefined,
		/** @type {HTMLDivElement} */
		priceList: undefined,
		/** @type {HTMLDivElement} */
		version: undefined,
	},
	// todo
	nameGen: {
		phones: {
			get consonant(){
				return []
					.concat(this.plosive)
					.concat(this.liquid)
					.concat(this.nasal)
					.concat(this.fricative);
			},
			fricative: 'fvsz'.split(''),
			liquid: 'lr'.split(''),
			nasal: 'mn'.split(''),
			get obstruent(){
				return this.plosive.concat(this.fricative);
			},
			plosive: 'ptkbdg'.split(''),
			vowel: "aeiou".split(''),
		},
		sylls: [
			['consonant', 'vowel'],
			['consonant', 'vowel', 'consonant'],
			['obstruent', 'liquid', 'vowel'],
			['obstruent', 'liquid', 'vowel', 'consonant'],
		],
		/** @param {Array} arr  */
		choice(arr){
			return arr[Math.floor(arr.length * Math.random())];
		},
		name(){
			let s = '';
			const length = this.randint(2, 3);
			for (let i = 0; i < length; i++) {
				s += this.syllable(i === 0);
			}
			return s;
		},
		randint(min = 0, max = 1){
			const range = max - min;
			return Math.floor(Math.random()*range + min);
		},
		syllable(cap = false){
			const form = this.choice(this.sylls);
			return form.map((cat, i) => {
				const raw = this.choice(this.phones[cat]);
				return cap && i === 0 ? raw.toUpperCase() : raw;
			}).join('');
		},
	},
	state: {
		get date(){
			return new Date(1000, 0, 1, 0, 0, 0, this.t);
		},
		/** @type {Good[]} */
		goods: [],
		location: 0,
		player: {
			/** @type {number[]} */
			goods: [],
			money: 0,
		},
		t: 0,
		get town(){
			return this.towns[this.location];
		},
		/** @type {Town[]} */
		towns: [],
	},
	confirmTravel(id = 0){
		const destination = this.state.towns[id];
		const t = this.state.town.travelTime(destination);
		if (confirm(`Are you sure you wish to spend ${this.prettyDuration(t)} travelling to ${destination.name}?`)) {
			this.setLocation(id);
		}
	},
	prettyPrice(x = 0){
		const wrap = s => `<span class="price" title="${x.toFixed(0)} pence">${s}</span>`;
		let r = Math.round(x);
		if (this.config.moneyFormat === MoneyFormat.LSD) {
			const d = r % 12;
			r = Math.floor(r / 12);
			const s = r % 20;
			const l = Math.floor(r / 20);
			if (l) {
				return wrap(`${l}£ ${s}s ${d}d`);
			}
			if (s) {
				return wrap(`${s}s ${d}d`);
			}
			return wrap(`${d}d`);
		}
		else {
			return wrap(`${r}d`);
		}
	},
	prettyDuration(h = 0){
		const hours = Math.floor(h);
		const ho = hours % 24;
		const d = Math.floor(hours / 24);
		return d ? `${d} d, ${ho} h` : `${ho} h`;
	},
	init(){
		this.initPlayer();
		this.state.goods = range(this.config.nGoods)
			.map(i => new Good(this.config.goodNames[i], this.config.goodPriceBase * Math.pow(this.config.goodPriceScaling, i)));
		this.state.towns = range(this.config.nTowns)
			.map(i => new Town());
		if (!this.elem.priceList) {
			const priceListContainer = document.createElement('div');
			priceListContainer.id = 'priceListContainer';
			document.body.appendChild(priceListContainer);
			priceListContainer.appendChild(this.elem.createHeader(2, "Prices in <span class='insertTownName'></span> on <span class='insertDate'></span>"));
			const priceList = this.elem.priceList = document.createElement('div');
			priceList.id = 'priceList';
			priceListContainer.appendChild(priceList);
		}
		if (!this.elem.player) {
			const playerContainer = document.createElement('div');
			playerContainer.id = 'playerContainer';
			document.body.appendChild(playerContainer);
			playerContainer.appendChild(this.elem.createHeader(2, this.config.name || prompt('Name:')));
			const player = this.elem.player = document.createElement('div');
			player.id = 'player';
			playerContainer.appendChild(player);
		}
		if (!this.elem.map) {
			const map = this.elem.map = document.createElement('div');
			map.id = 'map';
			document.body.appendChild(map);
		}
		if (!this.elem.version) {
			const version = this.elem.version = document.createElement('div');
			version.id = version.title = 'version';
			version.innerHTML = this.version;
			document.body.appendChild(version);
		}
		this.setLocation(0);
		console.info('tradegame.js loaded');
	},
	initPlayer(){
		this.state.player.money = this.config.playerStartMoney;
		this.state.player.goods = new Array(this.config.nGoods).fill(0);
	},
	passTime(t = 0){
		this.state.t += t;
		const ticks = Math.floor(t / this.config.priceUpdateInterval);
		for (let i = 0; i < ticks; i++){
			this.tick();
		}
	},
	setLocation(id = 0){
		const travelTime = this.state.town.travelTime(this.state.towns[id]) * 60*60*1000;
		this.passTime(travelTime);
		this.state.location = id;
		Array.from(document.getElementsByClassName('insertTownName'))
			.forEach(e => e.innerHTML = this.state.town.name);
		Array.from(document.getElementsByClassName('insertDate'))
			.forEach(e => e.innerHTML = this.state.date.toLocaleDateString('en-US', this.config.dateFormat));
		// alert(`todo: moved to #${id}`);
		this.updateInterface();
	},
	tick(){
		this.state.goods.forEach(g => g.tick());
		this.updateInterface();
	},
	updateInterface(){
		this.elem.priceList.innerHTML = '';
		this.state.goods.forEach(g => this.elem.priceList.appendChild(g.createElem(this.state.town.price(g))));
		this.elem.map.innerHTML = '';
		this.state.towns.forEach(t => this.elem.map.appendChild(t.createMapElem()));
		// update trader info
		this.elem.player.innerHTML = `Money: ${this.prettyPrice(this.state.player.money)}`;
		this.state.goods.forEach((g, i) => {
			const e = document.createElement('div');
			const amt = this.state.player.goods[i];
			e.innerHTML = `${g.name}: ${amt} `;
			e.appendChild(this.elem.createBuySellButtons(i));
			this.elem.player.appendChild(e);
		});
	},
};

GAME.init();