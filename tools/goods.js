/* eslint-disable max-len */

const unit = {
	/** number of L in a bushel */
	bu: 35.2390704,
	/** hundredweight in grams */
	cwt: 45359.24,
	/** number of grams in a gallon of water */
	gal: 3770,
	/** grams in a grain (no difference between troy/avoirdupois/etc) */
	grain: 0.06479891,
	/** g/L of grains https://www.smallfarmcanada.ca/resources/standard-weights-per-bushel-for-agricultural-commodities */
	grainDensity: {
		get ppb(){
			return unit.lb / unit.bu;
		},
		// grains alphabetical from here
		get barley(){
			return 48 * this.ppb;
		},
		// http://webserver.rilin.state.ri.us/Statutes/TITLE47/47-4/47-4-2.HTM
		get charcoal(){
			return 20 * this.ppb;
		},
		get millet(){
			return 50 * this.ppb;
		},
		get oat(){
			return 32 * this.ppb;
		},
		get rice(){
			return 45 * this.ppb;
		},
		get rye(){
			return 56 * this.ppb;
		},
		/** g/L salt density */
		get salt(){
			return 2170;
		},
		// https://kirschner.med.harvard.edu/files/bionumbers/Weight%20per%20bushel%20and%20bulk%20densities%20of%20grain%20and%20seeds.pdf
		get sesame(){
			return 46 * this.ppb;
		},
		get spelt(){
			return 40 * this.ppb;
		},
		get wheat(){
			return 60 * this.ppb;
		},
		/** unsorted */
		get NULL(){
			return 60 * this.ppb;
		},
		/** vegetable avg. */
		get NULL_VEG(){
			return 45 * this.ppb;
		},
	},
	/** number of grams in a quart of water */
	qt: 3770/4,
	/** last in grams */
	last: 2*453.5924*2000,
	/** pound in grams */
	lb: 453.5924,
	/** troy pound in grams */
	lbt: 373.242,
	/** tower pound in grams */
	lbtower: 350,
	/** pound in grams */
	oz: 453.5924/16,
	/** troy ounce in grams */
	ozt: 373.242/12,
	/** quarter in L https://en.wikipedia.org/wiki/Quarter_(unit)#Volume */
	get quarter(){
		return 8 * this.bu;
	},
	/** imperial ton in grams */
	t: 453.5924*2000,
	/** tun in mL */
	tun: 252 * 3785,
	weights: {
		apple: 200, // https://fdc.nal.usda.gov/fdc-app.html#/food-details/2344711/portions
		asparagus: 16, // https://fdc.nal.usda.gov/fdc-app.html#/food-details/2345287/portions
		beet: 80, // https://fdc.nal.usda.gov/fdc-app.html#/food-details/2345290/portions
		cabbage: 900, // https://fdc.nal.usda.gov/fdc-app.html#/food-details/2345293/portions
		citron: 65, // lemon https://fdc.nal.usda.gov/fdc-app.html#/food-details/2344662/portions
		leek: 89, // https://fdc.nal.usda.gov/fdc-app.html#/food-details/169246/measures
		lettuce: 539, // https://fdc.nal.usda.gov/fdc-app.html#/food-details/2345309/portions
		melon: 1000, // https://fdc.nal.usda.gov/fdc-app.html#/food-details/2344736/portions
		radish: 5, // https://fdc.nal.usda.gov/fdc-app.html#/food-details/2345323/portions
		turnip: 120, // https://fdc.nal.usda.gov/fdc-app.html#/food-details/2345329/portions
		walnut: 2, // https://fdc.nal.usda.gov/fdc-app.html#/food-details/2343008/portions
	},
};

class Category {
	/**
	 * @param {string} name
	 * @param {string} bgColor
	 */
	constructor(name, bgColor, blackFore = false){
		/** @type {string} */
		this.name = name;
		/** @type {string} */
		this.bgColor = bgColor;
		/** @type {boolean} */
		this.blackFore = blackFore;
		Category.categories.push(this);
	}
	static fromString(s){
		return Category.categories.find(category => category.name === s) || NULL_CATEGORY;
	}
}
/** @type {Category[]} */
Category.categories = [];
const NULL_CATEGORY = new Category('NULL', 'black');
new Category('Gold', 'gold', true);
new Category('Grain', 'wheat', true);
new Category('Processed Grain', 'wheat', true);
new Category('Dairy', '#ffd', true);
new Category('Meat', 'red', true);
new Category('Fowl', '#f40', true);
new Category('Fish', '#0ff', true);
new Category('Fruit', '#0c0', true);
new Category('Vegetable', '#080', true);
new Category('Nut', 'brown');
new Category('Spice', '#c86', true);
new Category('Ingredient', 'white', true);
new Category('Alcohol', '#808');
new Category('Fabric', '#fec', true);
new Category('Tool', 'grey', true);
new Category('Luxury', 'magenta', true);
new Category('Misc', 'black');


// eg. "cheese"
class Good {
	/**
	 * @param {string} name
	 * @param {string} name
	 */
	constructor(name, category = 'NULL', unit_ = ''){
		/** @type {string} */
		this.name = name;
		/** @type {Category} */
		this.category = Category.fromString(category);
		/** @type {string} */
		this.unit = unit_;
		Good.goods.push(this);
	}
	get sourceArr(){
		return Source.sources
			.map(s => GoodDatum.gooddata.find(datum => datum.good === this && datum.source === s));
	}
	get th(){
		const elem = document.createElement('th');
		elem.innerHTML = this.name;
		if (this.unit)
			elem.innerHTML += ` (g Ag / ${this.unit})`;
		return elem;
	}
	get tr(){
		const elem = document.createElement('tr');
		elem.style.backgroundColor = this.category.bgColor;
		if (this.category.blackFore)
			elem.style.color = 'black';
		elem.appendChild(this.th);
		// add col for each source
		this.sourceArr.forEach(datum => elem.appendChild(datum ? datum.td : blankTD()));
		return elem;
	}
}
/** @type {Good[]} */
Good.goods = [];

// eg. "cheese in england in 1553 CE"
class GoodDatum {
	/**
	 * @param {Good} good eg. Cheese
	 * @param {Source} source eg. 1592
	 * @param {number} price grams per grams of silver unless otherwise specified; eg. "dozen eggs" in context string
	 * @param {string} context eg. "lowest quality swiss cheese"
	 */
	constructor(good, source, price, context = ''){
		/** @type {Good} */
		this.good = good;
		/** @type {Source} */
		this.source = source;
		/** @type {number} */
		this.price = price;
		/** @type {string} */
		this.context = context;
		GoodDatum.gooddata.push(this);
	}
	get priceElem(){
		const elem = document.createElement('span');
		if (this.price < 1)
			elem.innerHTML = `1:${(1/this.price).toFixed(0)}`;
		else
			elem.innerHTML = `${this.price.toFixed(0)}:1`;
		return elem;
	}
	get td(){
		const elem = document.createElement('td');
		elem.appendChild(this.priceElem);
		return elem;
	}
}
/** @type {GoodDatum[]} */
GoodDatum.gooddata = [];

class Source {
	/**
	 * @param {number} year eg. 1592
	 * @param {string} place eg. "England"
	 * @param {string} url
	 */
	constructor(year, place, url){
		this.year = year;
		this.place = place;
		this.url = url;
		Source.sources.push(this);
	}
	get th(){
		const elem = document.createElement('th');
		// elem.classList.add('rot');
		elem.innerHTML = `${this.year}, ${this.place} <a href="${this.url}">*</a>`;
		return elem;
	}
}
/** @type {Source[]} */
Source.sources = [];

const goods = {
	gold: new Good('Gold', 'Gold'),
	// have gold on top, the rest in groups alphabetical or in logical order...
	// GRAIN
	barley: new Good('Barley', 'Grain'),
	millet: new Good('Millet', 'Grain'),
	oat: new Good('Oat', 'Grain'),
	rice: new Good('Rice', 'Grain'),
	rye: new Good('Rye', 'Grain'),
	spelt: new Good('Spelt', 'Grain'),
	wheat: new Good('Wheat', 'Grain'),
	// PROCESSED GRAIN
	flour: new Good('Flour', 'Processed Grain'),
	oatmeal: new Good('Oatmeal', 'Processed Grain'),
	// DAIRY
	butter: new Good('Butter', 'Dairy'),
	cheese: new Good('Cheese', 'Dairy'),
	egg: new Good('Egg', 'Dairy', 'doz'),
	ghee: new Good('Ghee', 'Dairy'),
	milk: new Good('Milk', 'Dairy'),
	// MEAT
	boarMeat: new Good('Boar Meat', 'Meat'),
	beef: new Good('Beef', 'Meat'),
	lamb: new Good('Lamb', 'Meat'),
	pork: new Good('Pork', 'Meat'),
	veal: new Good('Veal', 'Meat'),
	// FOWL
	chicken: new Good('Chicken', 'Fowl'),
	goose: new Good('Goose', 'Fowl'),
	turkey: new Good('Turkey', 'Fowl'),
	// FISH
	fish: new Good('Fish', 'Fish'),
	fishFreshwater: new Good('Freshwater Fish', 'Fish'),
	fishSaltwater: new Good('Saltwater Fish', 'Fish'),
	fishSalted: new Good('Salted Fish', 'Fish'),
	fishSardines: new Good('Sardines', 'Fish'),
	// FRUIT
	apple: new Good('Apple', 'Fruit'),
	citron: new Good('Citron', 'Fruit'),
	currant: new Good('Currant', 'Fruit'),
	figs: new Good('Figs', 'Fruit'),
	melon: new Good('Melon', 'Fruit'),
	// VEGETABLES
	asparagus: new Good('Asparagus', 'Vegetable'),
	beet: new Good('Beet', 'Vegetable'),
	cabbage: new Good('Cabbage', 'Vegetable'),
	garlic: new Good('Garlic', 'Vegetable'),
	leek: new Good('Leek', 'Vegetable'),
	lettuce: new Good('Lettuce', 'Vegetable'),
	potatoSweet: new Good('Sweet Potato', 'Vegetable'),
	radish: new Good('Radish', 'Vegetable'),
	squash: new Good('Squash', 'Vegetable'),
	turnip: new Good('Turnip', 'Vegetable'),
	// NUTS
	almond: new Good('Almond', 'Nut'),
	walnut: new Good('Walnut', 'Nut'),
	// SPICES/HERBS
	cinnamon: new Good('Cinnamon', 'Spice'),
	clove: new Good('Clove', 'Spice'),
	cumin: new Good('Cumin', 'Spice'),
	ginger: new Good('Ginger', 'Spice'),
	mace: new Good('Mace', 'Spice'),
	mustard: new Good('Mustard', 'Spice'),
	nutmeg: new Good('Nutmeg', 'Spice'),
	pepper: new Good('Black Pepper', 'Spice'),
	saffron: new Good('Saffron', 'Spice'),
	// MISC FOOD / INGREDIENTS
	chocolate: new Good('Chocolate', 'Ingredient'),
	coffee: new Good('Coffee', 'Ingredient'),
	flax: new Good('Flax', 'Ingredient'),
	honey: new Good('Honey', 'Ingredient'),
	hops: new Good('Hops', 'Ingredient'),
	incense: new Good('Incense', 'Ingredient'),
	lard: new Good('Lard', 'Ingredient'),
	oilOlive: new Good('Olive Oil', 'Ingredient'),
	oilSesame: new Good('Sesame Oil', 'Ingredient'),
	opium: new Good('Opium', 'Ingredient'),
	salt: new Good('Salt', 'Ingredient'),
	sesame: new Good('Sesame', 'Ingredient'),
	soda: new Good('Baking Soda', 'Ingredient'),
	sugar: new Good('Sugar', 'Ingredient'),
	sugarBrown: new Good('Sugar (Brown)', 'Ingredient'),
	tallow: new Good('Tallow', 'Ingredient'),
	tea: new Good('Tea', 'Ingredient'),
	tobacco: new Good('Tobacco', 'Ingredient'),
	vinegar: new Good('Vinegar', 'Ingredient'),
	// ALCOHOL
	ale: new Good('Ale', 'Alcohol'),
	beer: new Good('Beer', 'Alcohol'),
	wine: new Good('Wine', 'Alcohol'),
	// DOWN FEATHERS LINING WOOL
	cotton: new Good('Cotton', 'Fabric'),
	downGoose: new Good('Goose Down', 'Fabric'),
	downWillow: new Good('Willow Down', 'Fabric'),
	leather: new Good('Leather', 'Fabric'),
	linen: new Good('Linen', 'Fabric'),
	wool: new Good('Wool', 'Fabric'),
	// TOOLS
	candle: new Good('Candles', 'Tool'),
	ink: new Good('Ink', 'Tool'),
	soap: new Good('Soap', 'Tool'),
	// LUXURY MATERIALS
	ivory: new Good('Ivory', 'Luxury'),
	silk: new Good('Silk', 'Luxury'),
	turtleshell: new Good('Turtleshell', 'Luxury'),
	// SLAVES
	wageLaborer: new Good('Wage (Laborer)', 'Misc', 'd'), // one day of labor
	slaveF: new Good('Slave (f)', 'Misc', 'ea'),
	slaveM: new Good('Slave (m)', 'Misc', 'ea'),
	slaveSkilled: new Good('Slave (Skilled)', 'Misc', 'ea'),
	slaveYoung: new Good('Slave (Young)', 'Misc', 'ea'),
	// LIVESTOCK
	horse: new Good('Horse', 'Misc', 'ea'),
	pony: new Good('Pony', 'Misc', 'ea'),
	bull: new Good('Bull', 'Misc', 'ea'),
	ox: new Good('Ox', 'Misc', 'ea'),
	cow: new Good('Cow', 'Misc', 'ea'),
	pig: new Good('Pig', 'Misc', 'ea'),
	sheep: new Good('Sheep', 'Misc', 'ea'),
	dog: new Good('Dog', 'Misc', 'ea'),
	cat: new Good('Cat', 'Misc', 'ea'),
	gooseLive: new Good('Goose', 'Misc', 'ea'),
	chickenLive: new Good('Chicken', 'Misc', 'ea'),
	duckLive: new Good('Duck', 'Misc', 'ea'),
	// MISC
	charcoal: new Good('Charcoal', 'Misc'),
	coal: new Good('Coal', 'Misc'),
	copper: new Good('Copper', 'Misc'),
	firewood: new Good('Firewood', 'Misc'),
	glass: new Good('Glass', 'Misc'),
	iron: new Good('Iron', 'Misc'),
	wax: new Good('Wax', 'Misc'),
};

const sources = {
	// "Silver, pure, in bars or coins – 6000 denarii for about 300 g" thus 1g Ag = 20 denarii
	chinaHan: new Source('Han', 'China', ''), // 206 BCE - 220 CE
	rome0: new Source(301, 'Rome', 'https://imperiumromanum.pl/en/roman-economy/roman-goods-prices/'),
	chinaTang: new Source('Tang', 'China', ''), // 618 - 907
	chinaSong: new Source('Song', 'China', ''), // 960 - 1279
	med12: new Source('12th c.', 'W. Eur.', 'http://www.medievalcoinage.com/prices/medievalprices.htm'),
	med13: new Source('13th c.', 'England', 'http://medieval.ucdavis.edu/120D/Money.html'),
	med14: new Source('14th c.', 'England', 'http://www.afamilystory.co.uk/history/wages-and-prices.aspx'),
	ind14: new Source('14th c.', 'India', 'https://en.wikipedia.org/wiki/Market_reforms_of_Alauddin_Khalji'),
	chinaMing: new Source('Ming', 'China', ''), // 1368 - 1644
	med15: new Source('15th c.', 'England', 'http://www.afamilystory.co.uk/history/wages-and-prices.aspx'),
	med16: new Source('16th c.', 'England', 'http://www.afamilystory.co.uk/history/wages-and-prices.aspx'),
	med17: new Source('17th c.', 'England', ''),
	med18: new Source('18th c.', 'England', ''),
	usa180: new Source('c. 1800', 'US', 'https://babel.hathitrust.org/cgi/pt?id=hvd.32044050806330&seq=76'),
	usa185: new Source('c. 1850', 'US', 'https://babel.hathitrust.org/cgi/pt?id=hvd.32044050806330&seq=76'),
	usa202: new Source('2023', 'US', 'https://www.walmart.com'), // i just went onto walmart lol
};

// value of a pound, bimetallic ratio:
// https://en.wikipedia.org/wiki/Pound_sterling#History_(600%E2%80%931945)
new GoodDatum(goods.gold, sources.med14, 258.9/23.21);
new GoodDatum(goods.gold, sources.med15, 172.6/15.47);
new GoodDatum(goods.gold, sources.med16, 115.1/10.31);
new GoodDatum(goods.gold, sources.med17, 111.4/((10.31 + 7.32238)/2));
new GoodDatum(goods.gold, sources.med18, 111.4/7.32238);
// https://en.wikipedia.org/wiki/Bimetallism#United_States
new GoodDatum(goods.gold, sources.usa180, 15); // becomes 16 in 1834
new GoodDatum(goods.gold, sources.usa185, 16);
new GoodDatum(goods.gold, sources.usa202, 1962.98/23.35);

const pence = {
	/** 1158 - 1350 https://en.wikipedia.org/wiki/Pound_sterling#Medieval,_1158 */
	_0: unit.lbtower / 240 * 0.925,
	/** 1351 - 1412 https://en.wikipedia.org/wiki/Pound_sterling#Edward_III,_1351 */
	_1: unit.grain * 20.25 * 0.925,
	/** 1412 - 1463 https://en.wikipedia.org/wiki/Pound_sterling#Henry_IV,_1412 */
	_2: unit.grain * 15 * 0.925,
	/** 1464 - 1550 https://en.wikipedia.org/wiki/Pound_sterling#Great_slump,_1464 */
	_3: unit.grain * 12 * 0.925,
	/** 1551 - 1600 https://en.wikipedia.org/wiki/Pound_sterling#Tudor,_1551 */
	_4: unit.grain * 8 * 0.925,
	/** 1601 - ???? https://en.wikipedia.org/wiki/Pound_sterling#1601_to_1816 */
	_5: unit.ozt / 62 * 0.925,
	// centuries - if an exact year is unavailable, use these estimates
	c: {
		get _12(){
			return pence._0;
		},
		get _13(){
			return pence._0;
		},
		get _14(){
			return (pence._0 + pence._1)/2;
		},
		get _15(){
			return (12*pence._1 + 52*pence._2 + 36 * pence._3)/100;
		},
		get _16(){
			return (pence._3 + pence._4)/2;
		},
		get _17(){
			return pence._5;
		},
		get _18(){
			return pence._5;
		},
	},
};

// copper values
// new GoodDatum(goods.copper, sources.rome0, 0.355 / 12); // https://seekingalpha.com/article/4181917-copper-silver-ratio-range-for-thousands-of-years
new GoodDatum(goods.copper, sources.med14, 0.13 / 12); // https://seekingalpha.com/article/4181917-copper-silver-ratio-range-for-thousands-of-years
new GoodDatum(goods.copper, sources.med17, 0.5*pence.c._17/11); // https://en.wikipedia.org/wiki/History_of_the_halfpenny#Base-metal_halfpennies
new GoodDatum(goods.copper, sources.med18, 0.5*pence.c._18/((10.3+9.4)/2)); // https://en.wikipedia.org/wiki/History_of_the_halfpenny#The_United_Kingdom
new GoodDatum(goods.copper, sources.usa180, 0.01/13.48/(1.29/unit.ozt)); // A penny was ~100% pure copper and weighed 13.48g
new GoodDatum(goods.copper, sources.usa185, 0.22/unit.lb/(1.29/unit.ozt)); // https://pubs.usgs.gov/sir/2012/5188/sir2012-5188.pdf
new GoodDatum(goods.copper, sources.usa202, 3.73/unit.lb/(23.35/unit.ozt)); // https://commodity.com/precious-metals/copper/price/

// iron values
new GoodDatum(goods.iron, sources.usa202, 129.25/1000000/(23.35/unit.ozt)); // iron ore price

// 301 CE ROME
// cf. https://www.academia.edu/23644199/New_English_translation_of_the_Price_Edict_of_Diocletianus
const rome = {
	correctiveFactor: 1, // 2.2, // 1 lb of gold = 72 d
	get cwt(){
		return 100 * this.lb;
	},
	/** g Ag / denarius */
	get d(){
		return this.lb / 96 * 0.05 * this.correctiveFactor; // 1/96 roman pound 0.05 fineness https://en.wikipedia.org/wiki/Denarius#Debasement_and_evolution
	},
	/** k mod in L */
	get kmod(){
		return 0.032 * this.pt;
	},
	lb: 328.9, // https://en.wikipedia.org/wiki/Ancient_Roman_units_of_measurement#Weight
	/** sextarius in mL */
	pt: 546,
};

new GoodDatum(goods.wheat, sources.rome0, 100 * rome.d/(rome.kmod*unit.grainDensity.wheat)); // 100 denarii for 17L
new GoodDatum(goods.barley, sources.rome0, 60 * rome.d/(rome.kmod*unit.grainDensity.barley));
new GoodDatum(goods.rye, sources.rome0, 60 * rome.d/(rome.kmod*unit.grainDensity.rye));
new GoodDatum(goods.millet, sources.rome0, 100 * rome.d/(rome.kmod*unit.grainDensity.millet));
new GoodDatum(goods.spelt, sources.rome0, 100 * rome.d/(rome.kmod*unit.grainDensity.spelt));
new GoodDatum(goods.oat, sources.rome0, 30 * rome.d/(rome.kmod*unit.grainDensity.oat));
new GoodDatum(goods.flax, sources.rome0, 150 * rome.d/(rome.kmod*unit.grainDensity.NULL));
new GoodDatum(goods.rice, sources.rome0, 200 * rome.d/(rome.kmod*unit.grainDensity.rice));
new GoodDatum(goods.sesame, sources.rome0, 200 * rome.d/(rome.kmod*unit.grainDensity.sesame));
new GoodDatum(goods.cumin, sources.rome0, 200 * rome.d/(rome.kmod*unit.grainDensity.NULL));
new GoodDatum(goods.mustard, sources.rome0, 150 * rome.d/(rome.kmod*unit.grainDensity.NULL));
new GoodDatum(goods.wine, sources.rome0, 8 * rome.d/rome.pt); // 8 denarii for 500mL
new GoodDatum(goods.beer, sources.rome0, 4 * rome.d/rome.pt); // 4 denarii for 500mL
new GoodDatum(goods.oilOlive, sources.rome0, 40 * rome.d/rome.pt);
new GoodDatum(goods.vinegar, sources.rome0, 6 * rome.d/rome.pt);
new GoodDatum(goods.salt, sources.rome0, 100 * rome.d/(unit.grainDensity.salt * rome.kmod));
new GoodDatum(goods.honey, sources.rome0, 40 * rome.d/rome.pt);
new GoodDatum(goods.pork, sources.rome0, 12 * rome.d/rome.lb); // 12 denarii for 300g
new GoodDatum(goods.beef, sources.rome0, 8 * rome.d/rome.lb);
new GoodDatum(goods.gooseLive, sources.rome0, 200 * rome.d);
new GoodDatum(goods.chickenLive, sources.rome0, 30 * rome.d);
new GoodDatum(goods.duckLive, sources.rome0, 20 * rome.d);
new GoodDatum(goods.boarMeat, sources.rome0, 16 * rome.d/rome.lb);
new GoodDatum(goods.lamb, sources.rome0, 12 * rome.d/rome.lb);
new GoodDatum(goods.butter, sources.rome0, 16 * rome.d/rome.lb);
new GoodDatum(goods.fishSaltwater, sources.rome0, 24 * rome.d/rome.lb);
new GoodDatum(goods.fishFreshwater, sources.rome0, 8 * rome.d/rome.lb);
new GoodDatum(goods.fishSalted, sources.rome0, 6 * rome.d/rome.lb);
new GoodDatum(goods.cheese, sources.rome0, 12 * rome.d/rome.lb);
new GoodDatum(goods.fishSardines, sources.rome0, 16 * rome.d/rome.lb);
new GoodDatum(goods.lettuce, sources.rome0, 4/5 * rome.d / unit.weights.lettuce);
new GoodDatum(goods.cabbage, sources.rome0, 4/10 * rome.d / unit.weights.cabbage);
new GoodDatum(goods.beet, sources.rome0, 4/5 * rome.d / unit.weights.beet);
new GoodDatum(goods.garlic, sources.rome0, 60 * rome.d/(rome.kmod*unit.grainDensity.NULL_VEG));
new GoodDatum(goods.turnip, sources.rome0, 4 * rome.d * rome.d / unit.weights.turnip);
new GoodDatum(goods.radish, sources.rome0, 4/10 * rome.d / unit.weights.radish);
new GoodDatum(goods.leek, sources.rome0, 4/10 * rome.d / unit.weights.leek);
new GoodDatum(goods.egg, sources.rome0, 12 * rome.d);
new GoodDatum(goods.asparagus, sources.rome0, 4/50 * rome.d / unit.weights.asparagus);
new GoodDatum(goods.walnut, sources.rome0, 4/100 * rome.d / unit.weights.walnut);
new GoodDatum(goods.almond, sources.rome0, 6 * rome.d / rome.pt);
new GoodDatum(goods.citron, sources.rome0, 1 * rome.d / unit.weights.citron);
new GoodDatum(goods.melon, sources.rome0, 4/2 * rome.d / unit.weights.melon);
new GoodDatum(goods.apple, sources.rome0, 4/40 * rome.d / unit.weights.apple);
new GoodDatum(goods.figs, sources.rome0, 4 * rome.d/rome.lb);
new GoodDatum(goods.milk, sources.rome0, 8 * rome.d/rome.pt);
new GoodDatum(goods.wageLaborer, sources.rome0, 25 * rome.d);
new GoodDatum(goods.firewood, sources.rome0, 30 * rome.d/(300 * rome.lb)); // 30 denarii for 98 kg
new GoodDatum(goods.ivory, sources.rome0, 150 * rome.d/rome.lb);
new GoodDatum(goods.turtleshell, sources.rome0, 100 * rome.d/rome.lb);
new GoodDatum(goods.glass, sources.rome0, 24 * rome.d/rome.lb);
new GoodDatum(goods.downGoose, sources.rome0, 100 * rome.d/rome.lb);
new GoodDatum(goods.downWillow, sources.rome0, 1000 * rome.d/rome.cwt);
new GoodDatum(goods.ink, sources.rome0, 12 * rome.d/rome.lb);
new GoodDatum(goods.silk, sources.rome0, 12000 * rome.d/rome.lb);
new GoodDatum(goods.wool, sources.rome0, 175 * rome.d/rome.lb);
new GoodDatum(goods.linen, sources.rome0, 24 * rome.d/rome.lb);
new GoodDatum(goods.gold, sources.rome0, 12);
new GoodDatum(goods.wax, sources.rome0, 25 * rome.d/rome.lb);
new GoodDatum(goods.saffron, sources.rome0, 2000 * rome.d/rome.lb);
new GoodDatum(goods.incense, sources.rome0, 100 * rome.d/rome.lb);
new GoodDatum(goods.pepper, sources.rome0, 800 * rome.d/rome.lb);
new GoodDatum(goods.ginger, sources.rome0, 250 * rome.d/rome.lb);
new GoodDatum(goods.slaveM, sources.rome0, (25000 + 30000)/2 * rome.d); // 25 - 30k denarii
new GoodDatum(goods.slaveF, sources.rome0, (20000 + 25000)/2 * rome.d);
new GoodDatum(goods.slaveYoung, sources.rome0, (10000 + 20000)/2 * rome.d);
new GoodDatum(goods.cow, sources.rome0, 2000/2 * rome.d);
new GoodDatum(goods.ox, sources.rome0, 10000/2 * rome.d);
new GoodDatum(goods.sheep, sources.rome0, 400/2 * rome.d);
new GoodDatum(goods.horse, sources.rome0, 100000/2 * rome.d);
new GoodDatum(goods.bull, sources.rome0, 5000/2 * rome.d);
new GoodDatum(goods.copper, sources.rome0, 75 * rome.d / rome.lb);
new GoodDatum(goods.candle, sources.rome0, 4 * rome.d / rome.lb);
new GoodDatum(goods.soap, sources.rome0, 24 * rome.d / rome.lb);
new GoodDatum(goods.cinnamon, sources.rome0, 120 * rome.d / rome.lb); // Cassia
new GoodDatum(goods.opium, sources.rome0, (1000 + 1250)/2 * rome.d / rome.lb); // Cassia

// ENGLAND
// https://en.wikipedia.org/wiki/Penny_(English_coin)#History
// "The penny initially weighed 20 to 22.5 modern grains (1.3 to 1.5 g). It was standardized to 32 Tower grains, 1⁄240 of a Tower pound (approx. 350 g)."
// 1d = 350/240 g silver
new GoodDatum(goods.wheat, sources.med14, (5*12 + 10 + 3/4)*pence.c._14 / (unit.grainDensity.wheat * unit.quarter));
new GoodDatum(goods.barley, sources.med14, (4*12 + 3 + 3/4)*pence.c._14 / (unit.grainDensity.barley * unit.quarter));
new GoodDatum(goods.oat, sources.med14, (2*12 + 5 + 3/4)*pence.c._14 / (unit.grainDensity.oat * unit.quarter));
new GoodDatum(goods.rye, sources.med14, (4*12 + 4 + 7/8)*pence.c._14 / (unit.grainDensity.rye * unit.quarter));

new GoodDatum(goods.wheat, sources.med15, (5*12 + 11 + 3/4)*pence.c._15 / (unit.grainDensity.wheat * unit.quarter));
new GoodDatum(goods.barley, sources.med15, (3*12 + 8 + 3/4)*pence.c._15 / (unit.grainDensity.barley * unit.quarter));
new GoodDatum(goods.oat, sources.med15, (2*12 + 2 + 1/2)*pence.c._15 / (unit.grainDensity.oat * unit.quarter));
new GoodDatum(goods.rye, sources.med15, (4*12 + 7 + 3/4)*pence.c._15 / (unit.grainDensity.rye * unit.quarter));

new GoodDatum(goods.wheat, sources.med16, (13*12 + 10 + 1/2)*pence.c._16 / (unit.grainDensity.wheat * unit.quarter));
new GoodDatum(goods.barley, sources.med16, (8*12 + 5 + 3/4)*pence.c._16 / (unit.grainDensity.barley * unit.quarter));
new GoodDatum(goods.oat, sources.med16, (5*12 + 5 + 1/2)*pence.c._16 / (unit.grainDensity.oat * unit.quarter));

new GoodDatum(goods.wheat, sources.med17, (39*12 + 1/2)*pence.c._17 / (unit.grainDensity.wheat * unit.quarter));
new GoodDatum(goods.barley, sources.med17, (21*12 + 4)*pence.c._17 / (unit.grainDensity.barley * unit.quarter));
new GoodDatum(goods.oat, sources.med17, (13*12 + 10)*pence.c._17 / (unit.grainDensity.oat * unit.quarter));

new GoodDatum(goods.egg, sources.med14, 12*4.5/100*pence.c._14);
new GoodDatum(goods.egg, sources.med15, 12*6.5/100*pence.c._15);
new GoodDatum(goods.egg, sources.med16, 12*7.5/100*pence.c._16);
new GoodDatum(goods.egg, sources.med17, 12*(3*12 + 3)/100*pence.c._17);

new GoodDatum(goods.wool, sources.med14, (3 + 5/7)*pence.c._14 / unit.lb); // 3 5/7 d per pound
new GoodDatum(goods.cheese, sources.med14, (4 + 1/2)*pence.c._14 / (7*unit.lb)); // 4 1/2 d per 7 lbs
new GoodDatum(goods.butter, sources.med14, (4 + 3/4)*pence.c._14 / (7*unit.lb));
// 2nd row
new GoodDatum(goods.wool, sources.med15, (3 + 5/7)*pence.c._15 / unit.lb);
new GoodDatum(goods.cheese, sources.med15, 0.5*pence.c._15 / unit.lb);
new GoodDatum(goods.butter, sources.med15, 1*pence.c._15 / unit.lb);
new GoodDatum(goods.hops, sources.med15, (14*12 + 0.5)*pence.c._15 / unit.cwt); // 1s 0.5d per cwt
// "The weight standard was changed to the Troy pound (373.242 g) in 1527 under Henry VIII,"
new GoodDatum(goods.wool, sources.med16, (7 + 1/2)*pence.c._16 / unit.lb);
new GoodDatum(goods.cheese, sources.med16, 1*pence.c._16 / unit.lb);
new GoodDatum(goods.butter, sources.med16, 3*pence.c._16 / unit.lb);
new GoodDatum(goods.hops, sources.med16, (26*12 + 8)*pence.c._16 / unit.cwt);

// med13 http://medieval.ucdavis.edu/120D/Money.html
// https://web.archive.org/web/20110628231215/http://www.fordham.edu/halsall/source/medievalprices.html
new GoodDatum(goods.horse, sources.med13, (10+20)/2*20*pence.c._13);
new GoodDatum(goods.horse, sources.med14, (20+40)/2*20*pence._0); // "Note: Horse prices varied dramatically; for instance, they doubled between 1210 and 1310.  ([3], p. 37). "
new GoodDatum(goods.wine, sources.med13, (3+4)/2*pence.c._13 / unit.gal);
new GoodDatum(goods.wine, sources.med14, 4*pence._0 / unit.gal);
new GoodDatum(goods.ale, sources.med14, 0.75*pence._0 / unit.gal);
new GoodDatum(goods.beer, sources.med16, 1*pence._4 / unit.qt);
new GoodDatum(goods.pepper, sources.med13, (4*20 + 12)/2*pence.c._13 / unit.lb);
new GoodDatum(goods.saffron, sources.med14, (12+15)/2*pence.c._14 / unit.lb);
new GoodDatum(goods.cheese, sources.med13, (3*12 + 4)*pence.c._13 / (80*unit.lb));
new GoodDatum(goods.candle, sources.med14, (1.5 + 2.5)/2*pence._0 / unit.lb);
new GoodDatum(goods.candle, sources.med15, (1.5 + 6.5)/2*pence._1 / unit.lb);

// WAGES
new GoodDatum(goods.wageLaborer, sources.med13, (2 + 2.5)/2*pence.c._13);
new GoodDatum(goods.wageLaborer, sources.med14, (2.5 + 4.25)/2*pence.c._14);
new GoodDatum(goods.wageLaborer, sources.med15, (4.5 + 6)/2*pence.c._15);
new GoodDatum(goods.wageLaborer, sources.med16, (5.25 + 5.75)/2*pence.c._16);

// https://thehistoryofengland.co.uk/resource/medieval-prices-and-wages/
new GoodDatum(goods.sugar, sources.med14, 18*pence.c._14 / unit.lb);

// http://www.medievalcoinage.com/prices/medievalprices.htm
new GoodDatum(goods.wine, sources.med12, 1.14*pence.c._12 / unit.gal);
new GoodDatum(goods.wheat, sources.med12, (20+30)/2*pence.c._12 / (unit.bu * unit.grainDensity.wheat));
new GoodDatum(goods.wheat, sources.med13, (3+18)/2*pence.c._13 / (unit.bu * unit.grainDensity.wheat));

// https://medium.com/@zavidovych/what-we-can-learn-by-looking-at-prices-and-wages-in-medieval-england-8dc207cfd20a#.7yzbvz6lj
new GoodDatum(goods.sheep, sources.med15, 8.3/1.5*pence.c._15); // 1.5 sheep
new GoodDatum(goods.charcoal, sources.med15, 4.4*pence.c._15 / (4.25 * unit.grainDensity.charcoal)); // 4.25 bu

// https://www.historyextra.com/period/medieval/a-time-travellers-guide-to-medieval-shopping/
new GoodDatum(goods.ale, sources.med14, (0.75 + 1)/2*pence.c._14 / unit.gal);

// https://regia.org/research/misc/costs.htm
new GoodDatum(goods.chickenLive, sources.med12, 1/15*pence.c._12);
const priceMed12Cow = (64.5 + 88.5)/2*pence.c._12;
new GoodDatum(goods.cow, sources.med12, priceMed12Cow);
new GoodDatum(goods.ox, sources.med12, (80.5 + 88.5)/2*pence.c._12);
new GoodDatum(goods.pig, sources.med12, 20*pence.c._12);
const priceMed12Sheep = 10*pence.c._12;
new GoodDatum(goods.sheep, sources.med12, priceMed12Sheep);
const priceMed12Horse = (193.5 + 308.5)/2*pence.c._12;
new GoodDatum(goods.horse, sources.med12, priceMed12Horse);
new GoodDatum(goods.dog, sources.med12, 4*pence.c._12);
new GoodDatum(goods.slaveM, sources.med12, 197.5*pence.c._12);
new GoodDatum(goods.slaveF, sources.med12, 131.5*pence.c._12);
new GoodDatum(goods.silk, sources.med12, 37*pence.c._12 / unit.oz);

// https://www.rpg.net/columns/beasts/beasts4.phtml
new GoodDatum(goods.cat, sources.med12, (1+4)/2*pence.c._12);
new GoodDatum(goods.gooseLive, sources.med14, (2.5 + 2)/2*pence.c._14);
new GoodDatum(goods.chickenLive, sources.med14, (0.5 + 1)/2*pence.c._14);
const priceMed14Ox = (6*12 + 8)*pence.c._14;
new GoodDatum(goods.ox, sources.med14, priceMed14Ox);

new GoodDatum(goods.cow, sources.med13, 13*12*pence.c._13);
new GoodDatum(goods.cow, sources.med14, (9*12 + 5)*pence.c._14);
new GoodDatum(goods.sheep, sources.med14, (1*12 + 5)*pence.c._14);
new GoodDatum(goods.pig, sources.med14, 2*12*pence.c._14);
new GoodDatum(goods.horse, sources.med17, 20*240*pence.c._17);

// china
const china = {
	/** weight of a bolt of silk in grams, estimate */
	boltOfSilk: 3 * unit.lb,
	get cash(){
		return this.tael / 1000;
	},
	/** g per catty = jin */
	get catty(){
		return 16 * this.tael;
	},
	/** L per dou https://en.wikipedia.org/wiki/Chinese_units_of_measurement#Volume */
	dou: 10.354688,
	/** L per hu https://en.wikipedia.org/wiki/Economy_of_the_Han_dynasty#Subsistence */
	hu: 20,
	/** g per picul */
	get picul(){
		return 100 * this.catty;
	},
	/** g per tael */
	tael: 37.62, // values given by https://www.jstor.org/stable/1009669?seq=10: 37.573 37.61771 37.6702 - I'm going to take the average of the two extrema
};
new GoodDatum(goods.horse, sources.chinaHan, 4500 * china.cash);
new GoodDatum(goods.horse, sources.chinaTang, 25000 * china.cash);
new GoodDatum(goods.gooseLive, sources.chinaMing, 1/2 * 3/10 * china.tael);
new GoodDatum(goods.sheep, sources.chinaMing, 1/2 * china.tael);
new GoodDatum(goods.pig, sources.chinaMing, 1 * china.tael);

// https://www.wikiwand.com/en/Han_dynasty_coinage
// "During the Han dynasty one catty (250g - 300g) of gold currency was valued at around ten thousand bronze Ban Liang cash coins."
new GoodDatum(goods.gold, sources.chinaHan, 10000 * china.cash / 275);

// https://en.wikipedia.org/wiki/Economy_of_the_Han_dynasty#Subsistence
new GoodDatum(goods.rice, sources.chinaHan, (70 + 100)/2 * china.cash
	/ (unit.grainDensity.rice * china.hu)); // technically it is "any grain" - but this seems to suggest the values of different grains were not substantially different between one another

// https://en.wikipedia.org/wiki/Economy_of_the_Song_dynasty#Cash_crops
new GoodDatum(goods.tea, sources.chinaSong, (500+37)/2 * china.cash/china.catty);

// https://cedar.wwu.edu/cgi/viewcontent.cgi?filename=14&article=1016&context=easpress&type=additional
const tangCorrectiveFactor = 13; // I seem to be off by a factor of ~13 based on food prices
const tangRiceValue = (20 + 50)/2 * china.cash / china.picul * tangCorrectiveFactor;
new GoodDatum(goods.rice, sources.chinaTang, tangRiceValue);
const tangBoltOfSilk = 10 * china.picul * tangRiceValue;
new GoodDatum(goods.silk, sources.chinaTang, tangBoltOfSilk / china.boltOfSilk);
new GoodDatum(goods.cotton, sources.chinaTang, (500 + 2000)/2 * china.cash / china.boltOfSilk
	* tangCorrectiveFactor);
// "40 bolts of heavy silk per horse"
new GoodDatum(goods.horse, sources.chinaTang, 10 * tangBoltOfSilk);
// "in Emperor Shunzong’s yongzhen 1 (805), the price of salt fell from 370 or more per dou to 250-300 cash.*"
const saltgperL = 1200;
new GoodDatum(goods.salt, sources.chinaTang, (250 + 370)/2 * china.cash / (saltgperL * china.dou)
	* tangCorrectiveFactor);
// "a catty of pure copper fetched 150 cash, and raw copper fetched 100."
new GoodDatum(goods.copper, sources.chinaTang, (100 + 150)/2 * china.cash / china.catty
	* tangCorrectiveFactor);
new GoodDatum(goods.beef, sources.chinaTang, 5 * china.cash / china.catty * tangCorrectiveFactor);

// https://www.jstor.org/stable/2123972?seq=5
new GoodDatum(goods.gold, sources.chinaMing, 5); // went from 1:4 to 1:6 during the ming dynasty, increasing to European levels during the 17th c.
new GoodDatum(goods.gold, sources.ind14, 8);
new GoodDatum(goods.rice, sources.chinaMing, 50 / (100 * unit.grainDensity.rice)); // varied from ~35g to a bit over 100g, but was close to 50 for the first half of the dynasty

// https://babel.hathitrust.org/cgi/pt?id=hvd.32044050806330&seq=76
// 1800
const usd_ag = 1.29 / unit.ozt; // usd per gram Ag prior to ~1861
new GoodDatum(goods.flax, sources.usa180, 0.174/unit.lb / usd_ag);
new GoodDatum(goods.hops, sources.usa180, 0.167/unit.lb / usd_ag);
new GoodDatum(goods.rice, sources.usa180, 0.036/unit.lb / usd_ag);
new GoodDatum(goods.wool, sources.usa180, 0.416/unit.lb / usd_ag);
new GoodDatum(goods.leather, sources.usa180, 0.198/unit.lb / usd_ag);
new GoodDatum(goods.butter, sources.usa180, 0.198/unit.lb / usd_ag);
new GoodDatum(goods.cheese, sources.usa180, 0.105/unit.lb / usd_ag);
new GoodDatum(goods.egg, sources.usa180, (0.185 + 0.07)/2 / usd_ag);
new GoodDatum(goods.milk, sources.usa180, 0.035/unit.qt / usd_ag);
new GoodDatum(goods.cotton, sources.usa180, 0.222/unit.lb / usd_ag);
new GoodDatum(goods.fish, sources.usa180, 0.057/unit.lb / usd_ag);
new GoodDatum(goods.fishSaltwater, sources.usa180, 0.056/unit.lb / usd_ag);
new GoodDatum(goods.flour, sources.usa180, 0.063/unit.lb / usd_ag);
new GoodDatum(goods.oatmeal, sources.usa180, 0.125/unit.lb / usd_ag);
new GoodDatum(goods.chocolate, sources.usa180, 0.33/unit.lb / usd_ag);
new GoodDatum(goods.coffee, sources.usa180, 0.279/unit.lb / usd_ag);
new GoodDatum(goods.honey, sources.usa180, 0.167/unit.lb / usd_ag);
new GoodDatum(goods.lard, sources.usa180, 0.11/unit.lb / usd_ag);
new GoodDatum(goods.sugar, sources.usa180, 0.13/unit.lb / usd_ag);
new GoodDatum(goods.tea, sources.usa180, 0.799/unit.lb / usd_ag);
new GoodDatum(goods.currant, sources.usa180, 0.167/unit.lb / usd_ag);
new GoodDatum(goods.figs, sources.usa180, 0.125/unit.lb / usd_ag);
new GoodDatum(goods.coal, sources.usa180, 1.03/unit.cwt / usd_ag);
new GoodDatum(goods.beer, sources.usa180, 0.192/unit.gal / usd_ag);
new GoodDatum(goods.wine, sources.usa180, 1.17/unit.gal / usd_ag);
new GoodDatum(goods.beef, sources.usa180, 0.05/unit.lb / usd_ag);
new GoodDatum(goods.lamb, sources.usa180, 0.076/unit.lb / usd_ag);
new GoodDatum(goods.pork, sources.usa180, 0.153/unit.lb / usd_ag);
new GoodDatum(goods.veal, sources.usa180, 0.07/unit.lb / usd_ag);
new GoodDatum(goods.almond, sources.usa180, 0.626/unit.lb / usd_ag);
new GoodDatum(goods.chicken, sources.usa180, 0.08/unit.lb / usd_ag); // 1811
new GoodDatum(goods.goose, sources.usa180, 0.08/unit.lb / usd_ag); // 1806
new GoodDatum(goods.turkey, sources.usa180, 0.055/unit.lb / usd_ag);
new GoodDatum(goods.silk, sources.usa180, 6.5/unit.lb / usd_ag);
new GoodDatum(goods.cinnamon, sources.usa180, 0.083/unit.oz / usd_ag);
new GoodDatum(goods.clove, sources.usa180, 0.165/unit.oz / usd_ag);
new GoodDatum(goods.ginger, sources.usa180, 0.25/unit.lb / usd_ag);
new GoodDatum(goods.mace, sources.usa180, 2/unit.lb / usd_ag);
new GoodDatum(goods.mustard, sources.usa180, 0.031/unit.oz / usd_ag);
new GoodDatum(goods.nutmeg, sources.usa180, 5/unit.lb / usd_ag);
new GoodDatum(goods.pepper, sources.usa180, 0.04/unit.oz / usd_ag);
new GoodDatum(goods.vinegar, sources.usa180, 0.201/unit.gal / usd_ag);
new GoodDatum(goods.candle, sources.usa180, 0.2/unit.lb / usd_ag);
new GoodDatum(goods.soap, sources.usa180, 0.1/unit.lb / usd_ag);
new GoodDatum(goods.tallow, sources.usa180, 0.167/unit.lb / usd_ag);
new GoodDatum(goods.tobacco, sources.usa180, 0.083/unit.lb / usd_ag);
new GoodDatum(goods.iron, sources.usa180, 0.055/unit.lb / usd_ag); // 1752 - 1830

// 1850
new GoodDatum(goods.hops, sources.usa185, 0.189/unit.lb / usd_ag);
new GoodDatum(goods.rice, sources.usa185, 0.05/unit.lb / usd_ag);
new GoodDatum(goods.squash, sources.usa185, 0.01/unit.lb / usd_ag);
new GoodDatum(goods.potatoSweet, sources.usa185, 0.029/unit.lb / usd_ag);
new GoodDatum(goods.butter, sources.usa185, 0.206/unit.lb / usd_ag);
new GoodDatum(goods.cheese, sources.usa185, 0.094/unit.lb / usd_ag);
new GoodDatum(goods.egg, sources.usa185, 0.191 / usd_ag);
new GoodDatum(goods.milk, sources.usa185, 0.053/unit.qt / usd_ag);
new GoodDatum(goods.cotton, sources.usa185, 0.1/unit.lb / usd_ag);
new GoodDatum(goods.fish, sources.usa185, 0.042/unit.lb / usd_ag);
new GoodDatum(goods.fishSaltwater, sources.usa185, 0.035/unit.lb / usd_ag);
new GoodDatum(goods.flour, sources.usa185, 0.037/unit.lb / usd_ag);
new GoodDatum(goods.oatmeal, sources.usa185, 0.095/unit.lb / usd_ag);
new GoodDatum(goods.chocolate, sources.usa185, 0.202/unit.lb / usd_ag);
new GoodDatum(goods.coffee, sources.usa185, 0.137/unit.lb / usd_ag);
new GoodDatum(goods.lard, sources.usa185, 0.098/unit.lb / usd_ag);
new GoodDatum(goods.soda, sources.usa185, 0.06/unit.lb / usd_ag);
new GoodDatum(goods.sugar, sources.usa185, 0.078/unit.lb / usd_ag);
new GoodDatum(goods.tea, sources.usa185, 0.378/unit.lb / usd_ag);
new GoodDatum(goods.citron, sources.usa185, 0.301/unit.lb / usd_ag);
new GoodDatum(goods.currant, sources.usa185, 0.123/unit.lb / usd_ag);
new GoodDatum(goods.figs, sources.usa185, 0.152/unit.lb / usd_ag);
new GoodDatum(goods.coal, sources.usa185, 7/(2000*unit.lb) / usd_ag);
new GoodDatum(goods.beer, sources.usa185, 0.315/unit.gal / usd_ag);
new GoodDatum(goods.wine, sources.usa185, 0.25/unit.qt / usd_ag);
new GoodDatum(goods.beef, sources.usa185, 0.113/unit.lb / usd_ag);
new GoodDatum(goods.lamb, sources.usa185, 0.081/unit.lb / usd_ag);
new GoodDatum(goods.pork, sources.usa185, 0.094/unit.lb / usd_ag);
new GoodDatum(goods.veal, sources.usa185, 0.1/unit.lb / usd_ag);
new GoodDatum(goods.almond, sources.usa185, 0.151/unit.lb / usd_ag);
new GoodDatum(goods.walnut, sources.usa185, 0.125/unit.lb / usd_ag);
new GoodDatum(goods.chicken, sources.usa185, 0.11/unit.lb / usd_ag); // 1834
new GoodDatum(goods.goose, sources.usa185, 0.096/unit.lb / usd_ag);
new GoodDatum(goods.turkey, sources.usa185, 0.124/unit.lb / usd_ag);
new GoodDatum(goods.silk, sources.usa185, 0.56/unit.oz / usd_ag);
new GoodDatum(goods.cinnamon, sources.usa185, 0.5/unit.lb / usd_ag);
new GoodDatum(goods.clove, sources.usa185, 0.399/unit.lb / usd_ag);
new GoodDatum(goods.ginger, sources.usa185, 0.124/unit.lb / usd_ag);
new GoodDatum(goods.mace, sources.usa185, 1.48/unit.lb / usd_ag);
new GoodDatum(goods.mustard, sources.usa185, 0.44/unit.lb / usd_ag);
new GoodDatum(goods.nutmeg, sources.usa185, 1.71/unit.lb / usd_ag);
new GoodDatum(goods.pepper, sources.usa185, 0.226/unit.lb / usd_ag);
new GoodDatum(goods.vinegar, sources.usa185, 0.185/unit.gal / usd_ag);
new GoodDatum(goods.candle, sources.usa185, 0.135/unit.lb / usd_ag);
new GoodDatum(goods.soap, sources.usa185, 0.081/unit.lb / usd_ag);
new GoodDatum(goods.tallow, sources.usa185, 0.08/unit.lb / usd_ag); // 1841
new GoodDatum(goods.tobacco, sources.usa185, 0.285/unit.lb / usd_ag);

// 19th century US wages
// https://babel.hathitrust.org/cgi/pt?id=wu.89071501472&seq=69
new GoodDatum(goods.wageLaborer, sources.usa180, 0.692 / usd_ag);
new GoodDatum(goods.wageLaborer, sources.usa185, (0.333 + 1.67)/2 / usd_ag);

// TODAY PRICES
const usd_ag2 = 23.35 / unit.ozt; // current value
new GoodDatum(goods.millet, sources.usa202, 0.309/unit.oz / usd_ag2);
new GoodDatum(goods.oat, sources.usa202, 0.095/unit.oz / usd_ag2);
new GoodDatum(goods.rice, sources.usa202, 0.042/unit.oz / usd_ag2);
new GoodDatum(goods.flour, sources.usa202, 0.027/unit.oz / usd_ag2);
new GoodDatum(goods.oatmeal, sources.usa202, 0.095/unit.oz / usd_ag2);
new GoodDatum(goods.butter, sources.usa202, 0.236/unit.oz / usd_ag2);
new GoodDatum(goods.cheese, sources.usa202, 0.155/unit.oz / usd_ag2);
new GoodDatum(goods.egg, sources.usa202, 1.7 / usd_ag2);
new GoodDatum(goods.ghee, sources.usa202, 0.625/unit.oz / usd_ag2);
new GoodDatum(goods.milk, sources.usa202, 0.022/unit.oz / usd_ag2);
new GoodDatum(goods.beef, sources.usa202, 6.48/unit.lb / usd_ag2);
new GoodDatum(goods.lamb, sources.usa202, 11.99/unit.lb / usd_ag2); // https://www.harristeeter.com/p/great-southern-lamb-shoulder-chops/0020211100000?searchType=default_search
new GoodDatum(goods.pork, sources.usa202, 4.47/unit.lb / usd_ag2);
new GoodDatum(goods.veal, sources.usa202, 13.99/unit.lb / usd_ag2); // https://www.harristeeter.com/p/strauss-all-natural-veal-loin-chop/0020035600000?searchType=default_search
new GoodDatum(goods.chicken, sources.usa202, 2.67/unit.lb / usd_ag2);
new GoodDatum(goods.turkey, sources.usa202, 7.5/unit.lb / usd_ag2);
new GoodDatum(goods.fish, sources.usa202, 4.24/unit.lb / usd_ag2); // Tilapia filets
new GoodDatum(goods.fishSardines, sources.usa202, 0.285/unit.oz / usd_ag2);
new GoodDatum(goods.apple, sources.usa202, 1.15/unit.lb / usd_ag2);
new GoodDatum(goods.melon, sources.usa202, 0.214/unit.oz / usd_ag2);
new GoodDatum(goods.asparagus, sources.usa202, 0.371/unit.oz / usd_ag2);
new GoodDatum(goods.beet, sources.usa202, 0.173/unit.oz / usd_ag2);
new GoodDatum(goods.cabbage, sources.usa202, 0.87/unit.lb / usd_ag2);
new GoodDatum(goods.garlic, sources.usa202, 0.274/unit.lb / usd_ag2);
new GoodDatum(goods.lettuce, sources.usa202, 0.218/unit.oz / usd_ag2);
new GoodDatum(goods.potatoSweet, sources.usa202, 0.64/unit.lb / usd_ag2);
new GoodDatum(goods.radish, sources.usa202, 0.228/unit.oz / usd_ag2);
new GoodDatum(goods.squash, sources.usa202, 0.98/unit.lb / usd_ag2); // Butternut
new GoodDatum(goods.almond, sources.usa202, 0.389/unit.oz / usd_ag2);
new GoodDatum(goods.walnut, sources.usa202, 0.374/unit.oz / usd_ag2);
new GoodDatum(goods.cinnamon, sources.usa202, 0.496/unit.oz / usd_ag2);
new GoodDatum(goods.clove, sources.usa202, 3.35/unit.oz / usd_ag2);
new GoodDatum(goods.cumin, sources.usa202, 0.437/unit.oz / usd_ag2);
new GoodDatum(goods.ginger, sources.usa202, 0.495/unit.oz / usd_ag2);
new GoodDatum(goods.mace, sources.usa202, 2.72/unit.oz / usd_ag2);
new GoodDatum(goods.mustard, sources.usa202, 0.691/unit.oz / usd_ag2);
new GoodDatum(goods.nutmeg, sources.usa202, 1.61/unit.oz / usd_ag2);
new GoodDatum(goods.pepper, sources.usa202, 0.953/unit.oz / usd_ag2);
new GoodDatum(goods.saffron, sources.usa202, 305.5/unit.oz / usd_ag2);
new GoodDatum(goods.chocolate, sources.usa202, 0.145/unit.oz / usd_ag2);
new GoodDatum(goods.coffee, sources.usa202, 0.247/unit.oz / usd_ag2);
new GoodDatum(goods.flax, sources.usa202, 0.317/unit.oz / usd_ag2);
new GoodDatum(goods.honey, sources.usa202, 0.32/unit.oz / usd_ag2);
new GoodDatum(goods.hops, sources.usa202, 6.1/unit.lb / usd_ag2); // https://www.statista.com/statistics/758004/average-annual-price-of-hops-in-the-us/
new GoodDatum(goods.lard, sources.usa202, 0.08/unit.oz / usd_ag2);
new GoodDatum(goods.oilOlive, sources.usa202, 0.281/unit.oz / usd_ag2);
new GoodDatum(goods.oilSesame, sources.usa202, 0.536/unit.oz / usd_ag2);
new GoodDatum(goods.opium, sources.usa202, 408/1000 / usd_ag2); // https://www.unodc.org/documents/crop-monitoring/Afghanistan/Afghanistan_opium_survey_2023.pdf
new GoodDatum(goods.salt, sources.usa202, 0.025/unit.oz / usd_ag2);
new GoodDatum(goods.sesame, sources.usa202, 0.653/unit.oz / usd_ag2);
new GoodDatum(goods.soda, sources.usa202, 0.058/unit.oz / usd_ag2);
new GoodDatum(goods.sugar, sources.usa202, 0.048/unit.oz / usd_ag2);
new GoodDatum(goods.sugarBrown, sources.usa202, 0.073/unit.oz / usd_ag2);
new GoodDatum(goods.tallow, sources.usa202, 39.99/(7*unit.lb) / usd_ag2);
new GoodDatum(goods.tea, sources.usa202, 0.623/unit.oz / usd_ag2);
new GoodDatum(goods.tobacco, sources.usa202, 3494.2/1e6 / usd_ag2); // rough estimate from https://www.statista.com/statistics/1184304/unit-price-of-tobacco-in-tanzania/
new GoodDatum(goods.vinegar, sources.usa202, 0.029/unit.oz / usd_ag2);
new GoodDatum(goods.ale, sources.usa202, 0.091/unit.oz / usd_ag2);
new GoodDatum(goods.beer, sources.usa202, 0.064/unit.oz / usd_ag2);
new GoodDatum(goods.wine, sources.usa202, 0.136/unit.oz / usd_ag2);
new GoodDatum(goods.candle, sources.usa202, 0.214/unit.oz / usd_ag2);
new GoodDatum(goods.soap, sources.usa202, 0.148/unit.oz / usd_ag2);
new GoodDatum(goods.charcoal, sources.usa202, 0.493/unit.lb / usd_ag2);
new GoodDatum(goods.ivory, sources.usa202, 3300/unit.lb / usd_ag2); // https://wildaid.org/14-things-you-didnt-know-about-todays-ivory-trade/

new GoodDatum(goods.wageLaborer, sources.usa202, 8 * 7.25 / usd_ag2); // 8h min wage

// https://babel.hathitrust.org/cgi/pt?id=uc1.32106007458745&seq=42
new GoodDatum(goods.butter, sources.med17, 0.09/unit.lb / usd_ag);
new GoodDatum(goods.butter, sources.med18, 0.12/unit.lb / usd_ag);

new GoodDatum(goods.beef, sources.med17, 0.03/unit.lb / usd_ag);
new GoodDatum(goods.beef, sources.med18, 0.04/unit.lb / usd_ag);

new GoodDatum(goods.pork, sources.med17, 0.05/unit.lb / usd_ag);
new GoodDatum(goods.pork, sources.med18, 0.07/unit.lb / usd_ag);

// https://www.foodtimeline.org/1720.pdf
const eng_s_ag = 111.4 / 20; // g Ag / shilling https://en.wikipedia.org/wiki/Pound_sterling#History_(600%E2%80%931945)
const PA_CORRECTION = 50; // for some reason the prices listed are WAAAAAAY off... I'm basing this factor off the price of sugar decreasing exponentially from medieval times
new GoodDatum(goods.wheat, sources.med18, 4.51/(unit.grainDensity.wheat * unit.bu)
	/ eng_s_ag * PA_CORRECTION);
new GoodDatum(goods.tobacco, sources.med18, 19.98/unit.cwt / eng_s_ag * PA_CORRECTION);
new GoodDatum(goods.rice, sources.med18, 20.63/unit.cwt / eng_s_ag * PA_CORRECTION);
new GoodDatum(goods.flour, sources.med18, 13.10/unit.cwt / eng_s_ag * PA_CORRECTION);
new GoodDatum(goods.sugar, sources.med18, 51.98/unit.cwt / eng_s_ag * PA_CORRECTION);
new GoodDatum(goods.iron, sources.med18, 34.5*20/unit.t / eng_s_ag * PA_CORRECTION);
new GoodDatum(goods.cotton, sources.med18, 2.15/unit.lb / eng_s_ag * PA_CORRECTION);
// https://books.google.com/books?id=j1ArEAAAQBAJ&pg=PA9&source=gbs_toc_r&cad=2#v=onepage&q&f=false

// https://en.wikipedia.org/wiki/Market_reforms_of_Alauddin_Khalji
const india = {
	correctiveFactor: 12, // based on food prices
	// "Firishta states that 1 silver tanka was equal to 50 jitals."
	get jital(){
		return india.tanka/50;
	},
	/** grams in one Mann https://en.wikipedia.org/wiki/Maund#Delhi_Sultanate */
	mann: 11540,
	// "a tanka was made of one tola of gold or silver."
	get tanka(){
		return india.tola * this.correctiveFactor;
	},
	/** grams in one Sir
	 * https://en.wikipedia.org/wiki/Seer_(unit)#India
	 * BENGAL		~923 g		80 tolas
	 * SOUTH INDIA	?			24 local rupees
	 * CHENNAI		~11340 g	25 lbs
	 * GUJARAT		?			40 local rupees
	 * MUMBAI		~12701 g	28 lbs
	 * MAHARASHTRA	1000 g		1 kg
	 * "STANDARD"	1250 g		1.25 kg
	*/
	sir: 1250,
	/**
	 * grams in one Tola https://en.wikipedia.org/wiki/Tola_(unit)
	 * "The very first rupee (Urdu: رپيا; rupayā), minted by Sher Shah Suri (1540–45), had a mass of 178 troy grains"
	 */
	tola: 178 * unit.grain,
};
new GoodDatum(goods.wheat, sources.ind14, 7.5 * india.jital / india.mann);
new GoodDatum(goods.barley, sources.ind14, 4 * india.jital / india.mann);
new GoodDatum(goods.rice, sources.ind14, 5 * india.jital / india.mann);
new GoodDatum(goods.sugar, sources.ind14, 1.5 * india.jital / india.sir);
new GoodDatum(goods.sugarBrown, sources.ind14, 1 * india.jital / (3 * india.sir));
new GoodDatum(goods.ghee, sources.ind14, 1 * india.jital / (1.5 * india.sir));
new GoodDatum(goods.oilSesame, sources.ind14, 1 * india.jital / (3 * india.sir));
new GoodDatum(goods.salt, sources.ind14, 1 * india.jital / (5 * india.sir));
new GoodDatum(goods.slaveF, sources.ind14, (5 + 40)/2 * india.tanka);
new GoodDatum(goods.slaveM, sources.ind14, (20 + 30)/2 * india.tanka);
new GoodDatum(goods.slaveSkilled, sources.ind14, (10 + 15)/2 * india.tanka);
new GoodDatum(goods.slaveYoung, sources.ind14, (7 + 8)/2 * india.tanka);
new GoodDatum(goods.horse, sources.ind14, (60 + 120)/2 * india.tanka);
new GoodDatum(goods.pony, sources.ind14, (10 + 25)/2 * india.tanka);
new GoodDatum(goods.bull, sources.ind14, 3 * india.tanka);
new GoodDatum(goods.cow, sources.ind14, (1.5 + 4)/2 * india.tanka);
new GoodDatum(goods.sheep, sources.ind14, (10 + 12)/2 * india.jital);

// https://www.mccormickscienceinstitute.com/resources/history-of-spices
// "A pound of saffron cost the same as a horse;""
new GoodDatum(goods.saffron, sources.med12, priceMed12Horse / unit.lb);
// "a pound of ginger, as much as a sheep;"
new GoodDatum(goods.ginger, sources.med12, priceMed12Sheep / unit.lb);
// "2 pounds of mace as much as a cow."
new GoodDatum(goods.mace, sources.med12, priceMed12Cow / (2 * unit.lb));
// "A Germanic price table of AD 1393 lists a pound of nutmeg as worth 7 fat oxen."
new GoodDatum(goods.nutmeg, sources.med14, priceMed14Ox / unit.lb);
// cites "Duke, James A., ed. CRC Handbook of Medicinal Spices. CRC press, 2002.", but that doesn't mention it
// http://soupsong.com/fnutmeg.html mentions it too
// maybe look at https://memdb.libraries.rutgers.edu/posthumus-prices?field_postprice_month_value%5Bmin%5D=1&field_postprice_month_value%5Bmax%5D=12&field_postprice_year_value%5Bmin%5D=1572&field_postprice_year_value%5Bmax%5D=1813&items_per_page=50&order=field_postprice_price&sort=desc&page=1393

const guilder_ag = 10.61; // https://en.wikipedia.org/wiki/Dutch_guilder#1659,_Gulden_currency_&_banco
new GoodDatum(goods.pepper, sources.med18, (0.4 + 1.25)/2 * guilder_ag/unit.lb);
new GoodDatum(goods.silk, sources.med18, (5.1 + 24)/2 * guilder_ag/unit.lb);
new GoodDatum(goods.clove, sources.med18, (2.75 + 8.25)/2 * guilder_ag/unit.lb);
new GoodDatum(goods.iron, sources.med18, (5.63 + 8)/2 * guilder_ag/unit.cwt);
new GoodDatum(goods.currant, sources.med18, (7 + 25)/2 * guilder_ag/unit.cwt);
new GoodDatum(goods.cotton, sources.med18, (0.3 + 0.78)/2 * guilder_ag/unit.lb); // from Cyprus
new GoodDatum(goods.figs, sources.med18, (5.25 + 14.5)/2 * guilder_ag/unit.cwt);
new GoodDatum(goods.wine, sources.med18, (63 + 285)/2 * guilder_ag/unit.tun); // "French Bordeaux wine"
new GoodDatum(goods.wheat, sources.med18, (95.3 + 514.5)/2 * guilder_ag/unit.last); // "Frisian wheat"
new GoodDatum(goods.millet, sources.med18, (5.5 + 18)/2 * guilder_ag/unit.cwt); // "German millet"
new GoodDatum(goods.wool, sources.med18, (23.5 + 42)/2 * guilder_ag/unit.cwt); // "German wool"
new GoodDatum(goods.coffee, sources.med18, (0.34 + 1.2)/2 * guilder_ag/unit.lb); // "Java coffee beans"
new GoodDatum(goods.cinnamon, sources.med18, (2.35 + 10)/2 * guilder_ag/unit.lb);
new GoodDatum(goods.mace, sources.med18, (5.55 + 22.5)/2 * guilder_ag/unit.lb);
new GoodDatum(goods.rice, sources.med18, (6.75 + 21)/2 * guilder_ag/unit.cwt); // "Milanese rice"
new GoodDatum(goods.honey, sources.med18, (17.5 + 48)/2 * guilder_ag/(300 * unit.lb));
new GoodDatum(goods.wax, sources.med18, (58.5 + 104)/2 * guilder_ag/unit.cwt);
new GoodDatum(goods.nutmeg, sources.med18, (3.75 + 25)/2 * guilder_ag/unit.lb);
new GoodDatum(goods.opium, sources.med18, (3 + 14)/2 * guilder_ag/unit.lb);
new GoodDatum(goods.tea, sources.med18, (0.48 + 1.75)/2 * guilder_ag/unit.lb); // "Ordinary buoy tea"
new GoodDatum(goods.ginger, sources.med18, (0.4 + 2.06)/2 * guilder_ag/unit.lb); // "Preserved ginger"
new GoodDatum(goods.rye, sources.med18, (79.8 + 483)/2 * guilder_ag/unit.last); // "Prussian rye"
new GoodDatum(goods.soda, sources.med18, (4.5 + 24.5)/2 * guilder_ag/unit.cwt);
new GoodDatum(goods.almond, sources.med18, (17 + 65)/2 * guilder_ag/unit.cwt); // "Valence almonds"

function blankTD(){
	return document.createElement('td');
}

function headers(){
	const trh = document.createElement('tr');
	trh.appendChild(document.createElement('td'));
	Source.sources.forEach(source => {
		trh.appendChild(source.th);
	});
	return trh;
}

function main(){
	const container = document.getElementById('container');
	// construct table
	const table = document.createElement('table');
	// headers
	table.appendChild(headers());
	// rows
	Good.goods.forEach(good => table.appendChild(good.tr));
	// footers
	table.appendChild(headers());
	// end
	container.appendChild(table);
}

main();
// TODO item categories with background colors