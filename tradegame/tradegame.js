const range = n => (new Array(n)).fill(0).map((_, i) => i);

class Tone {
	constructor(o = {}){
		/** @type {number} */
		this.freq = o.freq || 440;
		/** @type {number} */
		this.hold = o.hold || 100;
		/** @type {number} */
		this.attack = o.attack || 100;
		/** @type {number} */
		this.fade = o.fade || 100;
		/** @type {number} */
		this.volume = o.volume || 1;
		/** @type {string} */
		this.wave = o.wave || 'sine';
	}
	get duration(){
		return this.attack + this.hold + this.fade;
	}
	/** (see piano.js for further info) */
	play(){
		const gain = GAME.audio.createGain(), osc = GAME.audio.createOscillator();
		gain.connect(GAME.audio.destination);
		gain.gain.setValueAtTime(this.attack ? this.volume : 0, GAME.audio.currentTime);
		if (this.attack) {
			gain.gain.linearRampToValueAtTime(this.volume, GAME.audio.currentTime + this.attack / 1000);
		}
		osc.frequency.value = this.freq;
		osc.type = this.wave;
		osc.connect(gain);
		osc.start(0);
		setTimeout(() => {
			if (this.fade) {
				gain.gain.linearRampToValueAtTime(0, GAME.audio.currentTime + this.fade / 1000);
			}
			setTimeout(() => {
				try {
					osc.stop(0);
					osc.disconnect(gain);
					gain.disconnect(GAME.audio.destination);
				}
				catch (_){}
			}, this.fade + 1000);
		}, this.attack + this.hold);
	}
}

class Good {
	constructor(name = "", priceBase = 0, variance = undefined){
		this.name = name;
		this.priceBase = priceBase;
		this.variance = variance || Math.random();
	}
	get id(){
		return GAME.state.goods.indexOf(this);
	}
	get price(){
		return this.priceBase * (1 + (2*this.variance - 1) * GAME.constants.varianceScaleGood);
	}
	createElem(priceOverride){
		const e = document.createElement('div');
		e.classList.add('good');
		e.innerHTML = `${this.name} = ${GAME.prettyPrice(priceOverride || this.price)}`;
		return e;
	}
	tick(){
		this.variance += (Math.random < this.variance ? -1 : 1)
			* GAME.constants.varianceQuantum;
	}
	/** @param {Good} g */
	static toObj(g){
		return {name: g.name, priceBase: g.priceBase, variance: g.variance};
	}
	static fromObj(o){
		return new Good(o.name, o.priceBase, o.variance);
	}
}

class Town {
	constructor(){
		this.name = GAME.nameGen.name();
		this.x = Math.random()*0.8 + 0.1;
		this.y = Math.random()*0.8 + 0.1;
		this.variances = range(GAME.constants.nGoods).map(_ => Math.random());
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
		e.onclick = () => {
			GAME.constants.sfx.buttonClick.play();
			GAME.confirmTravel(this.id)
		};
		e.onmouseover = () => GAME.constants.sfx.buttonHover.play();
		e.style.left = `${this.x*100}%`;
		e.style.top = `${this.y*100}%`;
		return e;
	}
	/** @param {Town} other */
	distance(other){
		return Math.hypot((this.x - other.x), (this.y - other.y)) * GAME.constants.distanceScale;
	}
	/** @param {Good} good  */
	price(good){
		return good.price * (1 + (2*this.variances[good.id]-1) * GAME.constants.varianceScaleTown);
	}
	/** @param {Town} other */
	travelTime(other){
		return this.distance(other) / GAME.constants.travelSpeed;
	}
	/** @param {Town} t */
	static toObj(t){
		return {name: t.name, x: t.x, y: t.y, variances: t.variances};
	}
	static fromObj(o){
		const t = new Town();
		t.name = o.name;
		t.x = o.x;
		t.y = o.y;
		t.variances = o.variances;
		return t;
	}
}

class MoneyFormat {
	static LSD = 0;
	static DECIMAL = 1;
}

class TravelState {
	constructor(){
		/** @type {Town} */
		this.destination;
		/** @type {Town} */
		this.origin;
		/** @type {boolean} */
		this.paused = false;
		/** @type {number} */
		this.tick = 0;
	}
}

const GAME = {
	audio: new(window.AudioContext || window.webkitAudioContext)(),
	/** non-user-editable vars */
	constants: {
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
		nGoods: 20,
		nTowns: 20,
		name: 'Trader',
		playerStartMoney: 480,
		/** ms */
		priceUpdateInterval: 60*60*1000,
		sfx: {
			buttonClick: new Tone({freq: 300, attack: 0, hold: 0, fade: 500, volume: 0.2}),
			buttonHover: new Tone({freq: 200, attack: 0, hold: 0, fade: 500, volume: 0.1}),
			tickHi: new Tone({freq: 1200, attack: 0, hold: 200, fade: 0, volume: 0.1}),
			tickLo: new Tone({freq: 600, attack: 0, hold: 200, fade: 0, volume: 0.1}),
		},
		/** km/h */
		travelSpeed: 5,
		travelTickInterval: 5*60*1000,
		travelTickIRL: 50,
		varianceScaleGood: 0.5,
		varianceScaleTown: 0.5,
		varianceQuantum: 0.01,
		version: '26w21',
	},
	/** user-editable vars */
	config: {
		dateFormat: {month: 'long', day: 'numeric', year: 'numeric'},
		moneyFormat: MoneyFormat.LSD,
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
				GAME.constants.sfx.buttonClick.play();
				const price = GAME.state.town.price(good);
				const maxAmt = Math.floor(GAME.state.player.money / price);
				buyAmt.value = maxAmt;
			};
			buyMaxButton.onmouseover = () => GAME.constants.sfx.buttonHover.play();
			buyContainer.appendChild(buyMaxButton);
			const buyNoneButton = document.createElement('span');
			buyNoneButton.innerHTML = 'none';
			buyNoneButton.classList.add('button');
			buyNoneButton.onclick = () => {
				GAME.constants.sfx.buttonClick.play();
				buyAmt.value = 0;
			};
			buyNoneButton.onmouseover = () => GAME.constants.sfx.buttonHover.play();
			buyNoneButton.classList.add('buyNoneButton');
			buyContainer.appendChild(buyNoneButton);
			const buyButton = document.createElement('span');
			buyButton.innerHTML = 'buy';
			buyButton.classList.add('buyButton');
			buyButton.classList.add('button');
			buyButton.onclick = () => {
				GAME.constants.sfx.buttonClick.play();
				const amt = +buyAmt.value;
				const priceUnit = GAME.state.town.price(good);
				const priceTotal = Math.round(amt * priceUnit);
				if (priceTotal <= GAME.state.player.money) {
					if (amt && confirm(`Really buy ${amt} ${GAME.state.goods[goodId].name} for ${GAME.prettyPrice(priceTotal, true)}?`)){
						GAME.state.player.money -= priceTotal;
						GAME.state.player.goods[goodId] += amt;
						GAME.updateInterface();
					}
				}
				else {
					alert('Insufficient funds.');
				}
			};
			buyButton.onmouseover = () => GAME.constants.sfx.buttonHover.play();
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
			sellMaxButton.onclick = () => {
				GAME.constants.sfx.buttonClick.play();
				sellAmt.value = GAME.state.player.goods[goodId];
			};
			sellMaxButton.onmouseover = () => GAME.constants.sfx.buttonHover.play();
			sellContainer.appendChild(sellMaxButton);
			const sellNoneButton = document.createElement('span');
			sellNoneButton.innerHTML = 'none';
			sellNoneButton.classList.add('button');
			sellNoneButton.onclick = () => {
				GAME.constants.sfx.buttonClick.play();
				sellAmt.value = 0;
			};
			sellNoneButton.onmouseover = () => GAME.constants.sfx.buttonHover.play();
			sellNoneButton.classList.add('sellNoneButton');
			sellContainer.appendChild(sellNoneButton);
			const sellButton = document.createElement('span');
			sellButton.innerHTML = 'sell';
			sellButton.classList.add('sellButton');
			sellButton.classList.add('button');
			sellButton.onclick = () => {
				GAME.constants.sfx.buttonClick.play();
				const amt = +sellAmt.value;
				const priceUnit = GAME.state.town.price(good);
				const priceTotal = Math.round(amt * priceUnit);
				if (amt <= GAME.state.player.goods[goodId]) {
					if (amt && confirm(`Really sell ${amt} ${GAME.state.goods[goodId].name} for ${GAME.prettyPrice(priceTotal, true)}?`)){
						GAME.state.player.goods[goodId] -= amt;
						GAME.state.player.money += priceTotal;
						GAME.updateInterface();
					}
				}
				else {
					alert('Insufficient goods.');
				}
			};
			sellButton.onmouseover = () => GAME.constants.sfx.buttonHover.play();
			sellButton.classList.add('sellButton');
			sellContainer.appendChild(sellButton);
			return container;
		},
		createHeader(n = 1, s = ""){
			const e = document.createElement(`h${n}`);
			e.innerHTML = s;
			return e;
		},
		createTravelMinigame(){
			// todo
			// for now it is JUST a clock and header...
			const e = document.createElement('div');
			e.id = 'travelMinigame';
			e.style.display = 'none';
			// header
			e.appendChild(this.createHeader(2, 'Travelling to <span id="destination"></span>'));
			// date
			const date = document.createElement('span');
			date.id = 'travelMinigameDate';
			e.appendChild(date);
			// pause button
			const pause = document.createElement('div');
			pause.id = 'travelMinigamePause';
			pause.innerHTML = 'Pause';
			pause.classList.add('button');
			pause.onmouseover = () => GAME.constants.sfx.buttonHover.play();
			e.appendChild(pause);
			return e;
		},
		/** @type {HTMLDivElement} */
		map: undefined,
		/** @type {HTMLDivElement} */
		player: undefined,
		/** @type {HTMLDivElement} */
		priceList: undefined,
		/** @type {HTMLDivElement} */
		saveContainer: undefined,
		/** @type {HTMLDivElement} */
		travelMinigame: undefined,
		/** @type {HTMLDivElement} */
		version: undefined,
	},
	// todo
	nameGen: {
		phones: {
			get approximant(){
				return this.liquid.concat(this.nonliquidApproximant);
			},
			get approximantNoY(){
				return this.approximant.filter(x => x !== 'y');
			},
			get consonant(){
				return []
					.concat(this.plosive)
					.concat(this.liquid)
					.concat(this.nasal)
					.concat(this.fricative);
			},
			get fricative(){
				return this.fricativeVoiced.concat(this.fricativeVoiceless);
			},
			fricativeVoiceless: 'fs'.split(''),
			fricativeVoiced: 'vz'.split(''),
			liquid: 'lr'.split(''),
			nasal: 'mn'.split(''),
			nonliquidApproximant: 'wy'.split(''),
			null: [''],
			get obstruent(){
				return this.plosive.concat(this.fricative);
			},
			get plosive(){
				return this.plosiveVoiced.concat(this.plosiveVoiceless);
			},
			plosiveVoiceless: 'ptk'.split(''),
			plosiveVoiced: 'bdg'.split(''),
			s: ['s'],
			vowel: "aeiou".split(''),
			y: ['y'],
		},
		/** https://en.wikipedia.org/wiki/English_phonology#Onset */
		onsets: [
			['null'],
			['consonant'],
			['plosive', 'approximantNoY'],
			['fricativeVoiceless', 'approximantNoY'],
			['obstruent', 'y'],
			['s', 'plosiveVoiceless'],
			['s', 'nasal'],
			['s', 'plosiveVoiceless', 'approximant'],
		],
		nuclei: [
			['vowel'],
		],
		codas: [
			['null'],
			['consonant'],
			['liquid', 'obstruent'],
			['liquid', 'nasal'],
		],
		/** @param {Array} arr  */
		choice(arr){
			return arr[Math.floor(arr.length * Math.random())];
		},
		name(){
			let s = '';
			const length = this.randint(1, 3);
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
			const onset = this.choice(this.onsets).map((cat, i) => this.choice(this.phones[cat])).join('');
			const nucleus = this.choice(this.nuclei).map((cat, i) => this.choice(this.phones[cat])).join('');
			const coda = this.choice(this.codas).map((cat, i) => this.choice(this.phones[cat])).join('');
			const syl = onset + nucleus + coda;
			return cap ? this.title(syl) : syl;
		},
		/** @param {string} s  */
		title(s){
			return 0 < s.length ? s[0].toUpperCase() + s.slice(1) : s;
		},
	},
	save: {
		createSaveElement(){
			const ce = (s, f) => {
				const e = document.createElement('div');
				e.classList.add('button');
				e.innerHTML = s;
				e.title = `${s} game`;
				e.onclick = () => {
					GAME.constants.sfx.buttonClick.play();
					f();
				};
				e.onmouseover = () => GAME.constants.sfx.buttonHover.play();
				saveContainer.appendChild(e);
			};
			const saveContainer = document.createElement('div');
			saveContainer.id = 'saveContainer';
			ce('Save', () => 
				navigator.clipboard.writeText(this.string).then(
					() => {alert('Save copied to clipboard'); console.log('Copied save');},
					e => {alert('Failed to save to clipboard'); console.error('copying save failed:', e)}));
			ce('Load', () => 
				navigator.clipboard.readText().then(
					s => this.string = s,
					e => console.error('copying save failed:', e)));
			ce('Reset', () => {
				if (confirm('Really restart?')) {
					GAME.init();
				}
			});
			return saveContainer;
		},
		get saveObject(){
			return {
				config: GAME.config,
				state: GAME.state.saveData,
			};
		},
		set saveObject(o){
			GAME.config = o.config;
			GAME.state.saveData = o.state;
		},
		get string(){
			return btoa(JSON.stringify(this.saveObject));
		},
		set string(s){
			console.log('loading save...');
			this.saveObject = JSON.parse(atob(s));
			GAME.updateInterface();
		},
	},
	state: {
		get date(){
			return this.dateFromT(this.t);
		},
		dateFromT(t = 0){
			return new Date(1000, 0, 1, 6, 0, 0, t);
		},
		/** @type {Good[]} */
		goods: [],
		location: 0,
		player: {
			/** @type {number[]} */
			goods: [],
			name: '',
			money: 0,
		},
		get saveData(){
			return {
				goods: this.goods.map(Good.toObj),
				location: this.location,
				player: this.player,
				t: this.t,
				towns: this.towns.map(Town.toObj), 
			};
		},
		set saveData(o){
			this.goods = o.goods.map(Good.fromObj);
			this.location = o.location;
			this.player = o.player;
			this.t = o.t;
			this.towns = o.towns.map(Town.fromObj);
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
			this.travelMinigame(id);
		}
	},
	prettyPrice(x = 0, nowrap = false){
		const wrap = s => nowrap ? s : `<span class="price" title="${x.toFixed(0)} pence">${s}</span>`;
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
		this.state.goods = range(this.constants.nGoods)
			.map(i => new Good(this.constants.goodNames[i], Math.round(this.constants.goodPriceBase * Math.pow(this.constants.goodPriceScaling, i))));
		this.state.towns = range(this.constants.nTowns)
			.map(i => new Town());
		this.verify();
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
			const playerHeader = this.elem.createHeader(2, this.state.player.name);
			playerHeader.classList.add('insertPlayerName');
			playerHeader.classList.add('button');
			playerHeader.onclick = () => {
				GAME.constants.sfx.buttonClick.play();
				this.state.player.name = prompt('Name:');
				this.updateInterface();
			};
			playerHeader.onmouseover = () => GAME.constants.sfx.buttonHover.play();
			playerContainer.appendChild(playerHeader);
			const player = this.elem.player = document.createElement('div');
			player.id = 'player';
			playerContainer.appendChild(player);
		}
		if (!this.elem.map) {
			const map = this.elem.map = document.createElement('div');
			map.id = 'map';
			document.body.appendChild(map);
		}
		if (!this.elem.saveContainer) {
			document.body.appendChild(this.elem.saveContainer = this.save.createSaveElement());
		}
		if (!this.elem.travelMinigame) {
			document.body.appendChild(this.elem.travelMinigame = this.elem.createTravelMinigame());
		}
		if (!this.elem.version) {
			const version = this.elem.version = document.createElement('div');
			version.id = version.title = 'version';
			version.innerHTML = this.constants.version;
			document.body.appendChild(version);
		}
		this.setLocation(0);
		console.info('tradegame.js loaded');
	},
	initPlayer(){
		this.state.player.money = this.constants.playerStartMoney;
		this.state.player.goods = new Array(this.constants.nGoods).fill(0);
		this.state.player.name = this.constants.name;
	},
	passTime(t = 0){
		this.state.t += t;
		const ticks = Math.floor(t / this.constants.priceUpdateInterval);
		for (let i = 0; i < ticks; i++){
			this.tick();
		}
	},
	setLocation(id = 0){
		const travelTime = this.state.town.travelTime(this.state.towns[id]) * 60*60*1000;
		this.passTime(travelTime);
		this.state.location = id;
		// alert(`todo: moved to #${id}`);
		this.updateInterface();
	},
	tick(){
		this.state.goods.forEach(g => g.tick());
		this.updateInterface();
	},
	/** @param {number} destId  */
	travelMinigame(destId){
		const destination = this.state.towns[destId];
		const duration = this.state.town.travelTime(destination) * 60*60*1000;
		const travelTicks = Math.round(duration / this.constants.travelTickInterval);
		document.getElementById('destination').innerHTML = destination.name;
		this.elem.travelMinigame.style.display = 'block';
		/** @type {HTMLSpanElement} */
		const dateElem = document.getElementById('travelMinigameDate');
		const travelState = new TravelState();
		travelState.origin = this.state.town;
		travelState.destination = destination;
		const onTick = () => {
			if (travelTicks <= travelState.tick) {
				clearInterval(intervalKey);
				this.setLocation(destId);
				this.elem.travelMinigame.style.display = 'none';
				return;
			}
			travelState.tick++;
			const sfx = ['tickHi', 'tickLo'][travelState.tick/12 % 2];
			if (this.constants.sfx[sfx]) this.constants.sfx[sfx].play();
			// continue...
			const displayedTime = this.state.t + travelState.tick * this.constants.travelTickInterval;
			dateElem.innerHTML = this.state.dateFromT(displayedTime);
		};
		let intervalKey;
		const restart = () => intervalKey = setInterval(() => onTick(), this.constants.travelTickIRL);
		const pause = document.getElementById('travelMinigamePause');
		pause.onclick = () => {
			GAME.constants.sfx.buttonClick.play();
			travelState.paused = !travelState.paused;
			if (travelState.paused) {
				clearInterval(intervalKey);
				pause.innerHTML = 'Resume';
			}
			else {
				restart();
				pause.innerHTML = 'Pause';
			}
		};
		restart();
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
		// insert data
		[
			['Date', () => this.state.date.toLocaleDateString('en-US', this.config.dateFormat)],
			['PlayerName', () => this.state.player.name],
			['TownName', () => this.state.town.name],
		].forEach(([s, f]) => {
			const o = f();
			Array.from(document.getElementsByClassName(`insert${s}`))
				.forEach(e => e.innerHTML = o);
		});
	},
	verify(){
		this.verifyTownNames();
	},
	verifyTownNames(){
		// reroll names until all are unique
		for (let i = 0; i < this.constants.nTowns; i++) {
			const a = this.state.towns[i].name;
			for (let j = 0; j < i; j++) {
				for (let n = 0; n < 1000; n++) {
					if (a !== this.state.towns[j].name) {
						break;
					}
					this.state.towns[j].name = this.nameGen.name();
				}
			}
		}
	},
};

GAME.init();