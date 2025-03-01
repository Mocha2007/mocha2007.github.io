/* eslint-disable max-len */
/* exported compare */

/** @param {number[]} arr */
function geometricAvg(arr){
	return Math.pow(arr.reduce((a, b) => a*b, 1), 1 / arr.length);
}

const debug = document.URL[0].toLowerCase() === 'f'; // file:// vs. http(s)://

const unit = {
	/** number of L in a bushel */
	bu: 35.2390704,
	/** mL per standard US can size https://food.unl.edu/article/how-interpret-can-size-numbers */
	can: {
		get _1(){
			return 1.25 * unit.cup;
		},
		get _2(){
			return 2.5 * unit.cup;
		},
		get _2_5(){
			return 3.5 * unit.cup;
		},
		get _3(){
			return 5.75 * unit.cup;
		},
		get beerBottle(){
			return 1.5 * unit.cup;
		},
	},
	/** mL per cup */
	cup: 236.588,
	/** hundredweight in grams */
	cwt: 45359.24,
	/** kg/m^3 */
	density: {
		oilOlive: 916.5, // https://www.chefsresource.com/what-is-the-density-of-olive-oil/
		glass: 2500,
	},
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
	/** number of meters in an inch */
	inch: 0.0254,
	/** @returns {Good} */
	get index(){
		return Good.fromName(document.getElementById('index').value);
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
new Category('Silver', 'silver', true);
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
new Category('Fuel', '#222');
new Category('Misc', 'black');


// eg. "cheese"
class Good {
	/** @param {string} name */
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
		return Source.sources.filter(visibleSources)
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
		this.sourceArr.forEach(datum => {
			try {
				elem.appendChild(datum ? datum.td : blankTD());
			}
			catch (_){
				const e = blankTD();
				e.innerHTML = 'nd';
				e.title = 'no index data at this date';
				elem.appendChild(e);
			}
		});
		return elem;
	}
	static fromName(name){
		return this.goods.find(good => good.name === name);
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
	get indexedPrice(){
		return this.price / GoodDatum.getAt(unit.index, this.source).price;
	}
	get priceElem(){
		const elem = document.createElement('span');
		const price = this.indexedPrice;
		if (price < 1)
			elem.innerHTML = `1:${(1/price).toFixed(0)}`;
		else
			elem.innerHTML = `${price.toFixed(0)}:1`;
		elem.title = `${this.good.name} in ${this.source.summary}\n${price}`;
		return elem;
	}
	get td(){
		const elem = document.createElement('td');
		elem.appendChild(this.priceElem);
		return elem;
	}
	/**
	 * @param {Good} good
	 * @param {Source} source
	 */
	static getAt(good, source){
		return this.gooddata.find(datum => datum.good === good && datum.source === source);
	}
}
/** @type {GoodDatum[]} */
GoodDatum.gooddata = [];

class Source {
	/**
	 * @param {number} year eg. 1592
	 * @param {string} place eg. "England"
	 * @param {string|string[]} url
	 */
	constructor(year, place, url, hideMe = false){
		this.year = year;
		this.place = place;
		/** @type {string[]} */
		this.urls = typeof url === 'string' ? [url] : url;
		this.hideMe = hideMe;
		Source.sources.push(this);
	}
	get summary(){
		return `${this.place} in ${this.year}`;
	}
	get th(){
		const elem = document.createElement('th');
		// elem.classList.add('rot');
		elem.innerHTML = `${this.year}, ${this.place}`;
		elem.appendChild(this.urlElem);
		return elem;
	}
	get urlElem(){
		const elem = document.createElement('span');
		this.urls.forEach((url, i) => {
			elem.appendChild(document.createTextNode(' '));
			const a = document.createElement('a');
			a.href = url;
			a.innerHTML = i+1;
			elem.appendChild(a);
		});
		return elem;
	}
}
/** @type {Source[]} */
Source.sources = [];

const goods = {
	silver: new Good('Silver', 'Silver'),
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
	// FUEL
	charcoal: new Good('Charcoal', 'Fuel'),
	coal: new Good('Coal', 'Fuel'),
	firewood: new Good('Firewood', 'Fuel'),
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
	aluminum: new Good('Aluminum', 'Misc'),
	copper: new Good('Copper', 'Misc'),
	glass: new Good('Glass', 'Misc'),
	iron: new Good('Iron', 'Misc'),
	platinum: new Good('Platinum', 'Misc'),
	uranium: new Good('Uranium', 'Misc'),
	wax: new Good('Wax', 'Misc'),
};

const sources = {
	// "Silver, pure, in bars or coins – 6000 denarii for about 300 g" thus 1g Ag = 20 denarii
	babylon: new Source('6th c. BCE', 'Babylon', ['https://economics.yale.edu/sites/default/files/yale_money-prices-markets.pdf']), // p. 16
	chinaHan: new Source('Han', 'China', []), // 206 BCE - 220 CE
	rome0: new Source(301, 'Rome', 'https://www.academia.edu/23644199/New_English_translation_of_the_Price_Edict_of_Diocletianus'),
	chinaTang: new Source('Tang', 'China', 'https://cedar.wwu.edu/cgi/viewcontent.cgi?filename=14&article=1016&context=easpress&type=additional'), // 618 - 907
	chinaSong: new Source('Song', 'China', []), // 960 - 1279
	med12: new Source('12th c.', 'W. Eur.', ['http://www.medievalcoinage.com/prices/medievalprices.htm', 'https://regia.org/research/misc/costs.htm', 'https://www.rpg.net/columns/beasts/beasts4.phtml', 'https://www.mccormickscienceinstitute.com/resources/history-of-spices']),
	med13: new Source('13th c.', 'England', ['http://www.afamilystory.co.uk/history/wages-and-prices.aspx', 'http://medieval.ucdavis.edu/120D/Money.html', 'http://www.medievalcoinage.com/prices/medievalprices.htm', 'https://www.rpg.net/columns/beasts/beasts4.phtml']),
	med14: new Source('14th c.', 'England', ['http://www.afamilystory.co.uk/history/wages-and-prices.aspx', 'http://medieval.ucdavis.edu/120D/Money.html', 'https://thehistoryofengland.co.uk/resource/medieval-prices-and-wages/', 'https://www.historyextra.com/period/medieval/a-time-travellers-guide-to-medieval-shopping/', 'https://www.rpg.net/columns/beasts/beasts4.phtml', 'https://www.mccormickscienceinstitute.com/resources/history-of-spices']),
	ind14: new Source('14th c.', 'India', 'https://en.wikipedia.org/wiki/Market_reforms_of_Alauddin_Khalji'),
	chinaMing: new Source('Ming', 'China', []), // 1368 - 1644
	med15: new Source('15th c.', 'England', ['http://www.afamilystory.co.uk/history/wages-and-prices.aspx', 'http://medieval.ucdavis.edu/120D/Money.html', 'https://medium.com/@zavidovych/what-we-can-learn-by-looking-at-prices-and-wages-in-medieval-england-8dc207cfd20a']),
	med16: new Source('16th c.', 'England', ['http://www.afamilystory.co.uk/history/wages-and-prices.aspx', 'http://medieval.ucdavis.edu/120D/Money.html', 'https://memdb.libraries.rutgers.edu/metz-prices']),
	med17: new Source('17th c.', 'England', ['https://www.rpg.net/columns/beasts/beasts4.phtml', 'https://memdb.libraries.rutgers.edu/metz-prices']),
	med18: new Source('18th c.', 'England', ['https://www.foodtimeline.org/1720.pdf', 'https://memdb.libraries.rutgers.edu/posthumus-prices', 'https://memdb.libraries.rutgers.edu/metz-prices']),
	usa180: new Source('c. 1800', 'US', 'https://babel.hathitrust.org/cgi/pt?id=hvd.32044050806330&seq=76'),
	usa185: new Source('c. 1850', 'US', 'https://babel.hathitrust.org/cgi/pt?id=hvd.32044050806330&seq=76'),
	usa190: new Source('c. 1900', 'US', ['https://babel.hathitrust.org/cgi/pt?id=umn.31951000014585x&seq=233', 'https://fraser.stlouisfed.org/title/bulletin-united-states-bureau-labor-3943/july-1905-477618/retail-prices-food-498513?start_page=179', 'https://fraser.stlouisfed.org/files/docs/publications/FRB/pages/1915-1919/24568_1915-1919.pdf']),
	usa195: new Source('c. 1950', 'US', 'https://babel.hathitrust.org/cgi/pt?id=umn.31951000014585x&seq=233'),
	usa202: new Source('2023', 'US', 'https://www.walmart.com'), // i just went onto walmart lol
	skyrim: new Source('4E 201', 'Skyrim', 'https://en.uesp.net/wiki/Skyrim:Skyrim', true),
	dorf: new Source('', 'Dwarf Fortress', 'https://dwarffortresswiki.org', true),
};

// add default silver
Source.sources.forEach(source => new GoodDatum(goods.silver, source, 1));

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
new GoodDatum(goods.oilOlive, sources.rome0, 40 * rome.d/(rome.pt/1000 * unit.density.oilOlive));
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
// no data for 12th century, so just assume it's about the same as 13th...
new GoodDatum(goods.wageLaborer, sources.med12, 3);

// https://thehistoryofengland.co.uk/resource/medieval-prices-and-wages/
new GoodDatum(goods.sugar, sources.med14, 18*pence.c._14 / unit.lb);

// http://www.medievalcoinage.com/prices/medievalprices.htm
new GoodDatum(goods.wine, sources.med12, 1.14*pence.c._12 / unit.gal);
new GoodDatum(goods.wheat, sources.med12, (20+30)/2*pence.c._12 / (unit.bu * unit.grainDensity.wheat));
new GoodDatum(goods.wheat, sources.med13, (3+18)/2*pence.c._13 / (unit.bu * unit.grainDensity.wheat));

// https://medium.com/@zavidovych/what-we-can-learn-by-looking-at-prices-and-wages-in-medieval-england-8dc207cfd20a#.7yzbvz6lj
new GoodDatum(goods.sheep, sources.med15, 8.3/1.5*pence.c._15); // 1.5 sheep
new GoodDatum(goods.charcoal, sources.med15, 4.4*pence.c._15 / (4.25 * unit.bu * unit.grainDensity.charcoal)); // 4.25 bu

// https://www.historyextra.com/period/medieval/a-time-travellers-guide-to-medieval-shopping/
new GoodDatum(goods.ale, sources.med14, (0.75 + 1)/2*pence._1 / unit.gal);
new GoodDatum(goods.wine, sources.med14, (3 + 4)/2*pence._1 / unit.gal);
new GoodDatum(goods.chickenLive, sources.med14, 2*pence._1);
new GoodDatum(goods.sugar, sources.med14, 18*pence._1 / unit.lb);
new GoodDatum(goods.apple, sources.med14, 7*pence._1 / (100 * unit.weights.apple));
new GoodDatum(goods.egg, sources.med14, 12*33/425*pence._1);

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
const chinaHanGold = new GoodDatum(goods.gold, sources.chinaHan, 10000 * china.cash / 275);

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

// https://en.wikipedia.org/wiki/Economy_of_the_Han_dynasty#Landowners_and_peasants
// a family of five producing 2000L of grain annually (313 workdays?) was apparently a plausible hypothetical, albeit a low one
// a bit further down a more neutral 2800L estimate is given
const china_wage_labor_estimate = 2800 * unit.grainDensity.rice * tangRiceValue / 313;
new GoodDatum(goods.wageLaborer, sources.chinaHan, china_wage_labor_estimate);
new GoodDatum(goods.wageLaborer, sources.chinaTang, china_wage_labor_estimate);
new GoodDatum(goods.wageLaborer, sources.chinaSong, china_wage_labor_estimate);

// babylon https://economics.yale.edu/sites/default/files/yale_money-prices-markets.pdf
const shekel_babylonian = 8.62; // g Ag "the didrachm (8.62 g) more or less equaled the shekel;"
new GoodDatum(goods.gold, sources.babylon, 13); // roughly same place and era https://en.wikipedia.org/wiki/Bimetallism#Achaemenid_coinage
new GoodDatum(goods.barley, sources.babylon, shekel_babylonian / (180 * unit.grainDensity.barley)); // 180 L of barley = 1 shekel
new GoodDatum(goods.sesame, sources.babylon, shekel_babylonian / (66 * unit.grainDensity.sesame)); // 66 L of sesame = 1 shekel
new GoodDatum(goods.oilOlive, sources.babylon, shekel_babylonian / (18 * unit.density.oilOlive)); // 18 L of "oil" = 1 shekel
new GoodDatum(goods.wool, sources.babylon, shekel_babylonian / (5 * unit.lb)); // 5 lb of wool = 1 shekel
new GoodDatum(goods.wine, sources.babylon, shekel_babylonian / 18000); // 18 L of wine = 1 shekel
new GoodDatum(goods.wageLaborer, sources.babylon, 20 * shekel_babylonian/(5 * 26)); // 1 month (26 labor days?), 5 workers = 20 shekels

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

// 1900
const usd_ag_1900 = 0.62007 / unit.ozt; // $0.62007/ozt
new GoodDatum(goods.gold, sources.usa190, 18.96/unit.ozt / usd_ag_1900);
new GoodDatum(goods.beef, sources.usa190, 0.1431/unit.lb / usd_ag_1900);
new GoodDatum(goods.pork, sources.usa190, 0.1228/unit.lb / usd_ag_1900);
new GoodDatum(goods.chicken, sources.usa190, 0.1402/unit.lb / usd_ag_1900);
new GoodDatum(goods.fish, sources.usa190, 0.1003/unit.lb / usd_ag_1900);
new GoodDatum(goods.egg, sources.usa190, 0.1971 / usd_ag_1900);
new GoodDatum(goods.milk, sources.usa190, 0.0601/unit.qt / usd_ag_1900);
new GoodDatum(goods.butter, sources.usa190, 0.2456/unit.lb / usd_ag_1900);
new GoodDatum(goods.cheese, sources.usa190, 0.1638/unit.lb / usd_ag_1900);
new GoodDatum(goods.lard, sources.usa190, 0.1108/unit.lb / usd_ag_1900);
new GoodDatum(goods.tea, sources.usa190, 0.5/unit.lb / usd_ag_1900);
new GoodDatum(goods.coffee, sources.usa190, 0.0587/unit.lb / usd_ag_1900);
new GoodDatum(goods.sugar, sources.usa190, 0.2295/unit.lb / usd_ag_1900);
new GoodDatum(goods.flour, sources.usa190, 0.0246/unit.lb / usd_ag_1900);
new GoodDatum(goods.rice, sources.usa190, 0.0817/unit.lb / usd_ag_1900);
// https://babel.hathitrust.org/cgi/pt?id=mdp.39015068283111&seq=220
new GoodDatum(goods.lamb, sources.usa190, 0.13/unit.lb / usd_ag_1900);
new GoodDatum(goods.turkey, sources.usa190, 0.21/unit.lb / usd_ag_1900);
new GoodDatum(goods.goose, sources.usa190, 0.175/unit.lb / usd_ag_1900);
new GoodDatum(goods.cabbage, sources.usa190, 0.125/unit.weights.cabbage / usd_ag_1900);
// https://babel.hathitrust.org/cgi/pt?id=uc1.b3991878&seq=146
new GoodDatum(goods.oatmeal, sources.usa190, 0.075/unit.lb / usd_ag_1900);
new GoodDatum(goods.salt, sources.usa190, 0.025/unit.lb / usd_ag_1900);
new GoodDatum(goods.mustard, sources.usa190, 0.65/unit.lb / usd_ag_1900);
new GoodDatum(goods.pepper, sources.usa190, 0.40/unit.lb / usd_ag_1900);
new GoodDatum(goods.sugarBrown, sources.usa190, 0.05/unit.lb / usd_ag_1900);
new GoodDatum(goods.veal, sources.usa190, 0.2/unit.lb / usd_ag_1900);
new GoodDatum(goods.wheat, sources.usa190, 0.05/unit.lb / usd_ag_1900);
new GoodDatum(goods.coal, sources.usa190, 12/unit.t / usd_ag_1900);
new GoodDatum(goods.glass, sources.usa190, 6/(9*unit.inch*12*unit.inch*3/32*unit.inch * unit.density.glass*1000) / usd_ag_1900);
// https://babel.hathitrust.org/cgi/pt?id=nnc2.ark:/13960/t2x376p77&seq=387
new GoodDatum(goods.chocolate, sources.usa190, 0.18/(0.5*unit.lb) / usd_ag_1900);
new GoodDatum(goods.soda, sources.usa190, 0.04/(0.5*unit.lb) / usd_ag_1900);
new GoodDatum(goods.clove, sources.usa190, 0.38/unit.lb / usd_ag_1900);
new GoodDatum(goods.cinnamon, sources.usa190, 0.32/unit.lb / usd_ag_1900);
new GoodDatum(goods.ginger, sources.usa190, 0.29/unit.lb / usd_ag_1900);
new GoodDatum(goods.mace, sources.usa190, 0.69/unit.lb / usd_ag_1900);
new GoodDatum(goods.nutmeg, sources.usa190, 0.19/(0.25*unit.lb) / usd_ag_1900);
new GoodDatum(goods.oilOlive, sources.usa190, 2.54/(unit.gal * unit.density.oilOlive/1000) / usd_ag_1900);
new GoodDatum(goods.vinegar, sources.usa190, 0.34/unit.gal / usd_ag_1900);
new GoodDatum(goods.asparagus, sources.usa190, 0.78/unit.can._2_5 / usd_ag_1900);
new GoodDatum(goods.turnip, sources.usa190, 0.24/unit.can._1 / usd_ag_1900);
new GoodDatum(goods.beet, sources.usa190, 0.14/unit.can._3 / usd_ag_1900);
new GoodDatum(goods.squash, sources.usa190, 0.12/unit.can._3 / usd_ag_1900);
new GoodDatum(goods.wine, sources.usa190, 0.8/unit.gal / usd_ag_1900); // rough average
new GoodDatum(goods.ale, sources.usa190, 0.98/(12 * unit.can.beerBottle) / usd_ag_1900); // cheapest
new GoodDatum(goods.beer, sources.usa190, 0.79/(12 * unit.can.beerBottle) / usd_ag_1900); // cheapest

new GoodDatum(goods.wageLaborer, sources.usa190, 10.06/7 / usd_ag_1900); // actual wages per week per capita https://babel.hathitrust.org/cgi/pt?id=nnc1.cu56779232&seq=15

// 1950
const usd_ag_1950 = 0.73 / unit.ozt; // $0.62007/ozt
new GoodDatum(goods.gold, sources.usa195, 34.72/unit.ozt / usd_ag_1950);
new GoodDatum(goods.flour, sources.usa195, 0.491/(5*unit.lb) / usd_ag_1950);
new GoodDatum(goods.beef, sources.usa195, 0.936/unit.lb / usd_ag_1950);
new GoodDatum(goods.pork, sources.usa195, 0.754/unit.lb / usd_ag_1950);
new GoodDatum(goods.butter, sources.usa195, 0.729/unit.lb / usd_ag_1950);
new GoodDatum(goods.egg, sources.usa195, 0.604 / usd_ag_1950);
new GoodDatum(goods.milk, sources.usa195, 0.412 / (0.5 * unit.gal) / usd_ag_1950);
new GoodDatum(goods.coffee, sources.usa195, 0.794 / unit.lb / usd_ag_1950);
new GoodDatum(goods.sugar, sources.usa195, 0.487/(5*unit.lb) / usd_ag_1950);


new GoodDatum(goods.wageLaborer, sources.usa195, 8 * 0.75 / usd_ag_1950); // 8h min wage
new GoodDatum(goods.uranium, sources.usa195, 9.11 / unit.lb / usd_ag_1950); // https://www.osti.gov/servlets/purl/7346006

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
new GoodDatum(goods.saffron, sources.usa202, 99/28 / usd_ag2); // https://www.amazon.com/Persian-Saffron-Threads-Slofoodgroup-Filaments/dp/B01HOXIRGO?th=1
new GoodDatum(goods.chocolate, sources.usa202, 0.145/unit.oz / usd_ag2);
new GoodDatum(goods.coffee, sources.usa202, 0.247/unit.oz / usd_ag2);
new GoodDatum(goods.flax, sources.usa202, 0.317/unit.oz / usd_ag2);
new GoodDatum(goods.honey, sources.usa202, 0.32/unit.oz / usd_ag2);
new GoodDatum(goods.hops, sources.usa202, 6.1/unit.lb / usd_ag2); // https://www.statista.com/statistics/758004/average-annual-price-of-hops-in-the-us/
new GoodDatum(goods.lard, sources.usa202, 0.08/unit.oz / usd_ag2);
new GoodDatum(goods.oilOlive, sources.usa202, 0.281/(unit.oz * unit.density.oilOlive/1000) / usd_ag2);
new GoodDatum(goods.oilSesame, sources.usa202, 0.536/(unit.oz * unit.density.oilOlive/1000) / usd_ag2);
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
new GoodDatum(goods.uranium, sources.usa202, 40.06/unit.lb / usd_ag2); // https://www.statista.com/statistics/260005/monthly-uranium-price/

new GoodDatum(goods.wageLaborer, sources.usa202, 8 * 7.25 / usd_ag2); // 8h min wage

// today's cheapest animal prices
new GoodDatum(goods.horse, sources.usa202, 7000 / usd_ag2); // https://www.astepabovestables.com/horses-for-sale/draft?Order=lowest
new GoodDatum(goods.cat, sources.usa202, 15 / usd_ag2); // https://www.hepper.com/how-much-does-a-cat-cost/ (cheapest adoption cost)
new GoodDatum(goods.dog, sources.usa202, 50 / usd_ag2); // https://be.chewy.com/pet-parenting-pet-lovers-dog-adoption-fees-explained/ (cheapest adoption cost)

// aluminum values
new GoodDatum(goods.aluminum, sources.usa185, 545/unit.lb / usd_ag); // https://www.indexbox.io/search/historical-aluminum-prices-per-pound/
new GoodDatum(goods.aluminum, sources.usa190, 0.4/unit.lb / usd_ag); // https://www.indexbox.io/search/historical-aluminum-prices-per-pound/
new GoodDatum(goods.aluminum, sources.usa195, 0.183*0.4/unit.lb / usd_ag); // https://ourworldindata.org/grapher/real-commodity-price-index-metals
new GoodDatum(goods.aluminum, sources.usa202, 2202.25545/1e6 / usd_ag2); // https://fred.stlouisfed.org/series/PALUMUSDM

// copper values
// https://www.worldcoppersmith.com/articles/a-complete-history-of-the-price-of-copper/
new GoodDatum(goods.copper, sources.usa190, 0.2/unit.lb / usd_ag);
new GoodDatum(goods.copper, sources.usa195, 0.25/unit.lb / usd_ag_1950);

// iron values
// https://economics.yale.edu/sites/default/files/iron_www.pdf
new GoodDatum(goods.iron, sources.usa185, 0.5831*18.7/unit.t / usd_ag); // https://ourworldindata.org/grapher/real-commodity-price-index-metals
new GoodDatum(goods.iron, sources.usa190, 18.7/unit.t / usd_ag);
new GoodDatum(goods.iron, sources.usa195, 0.7077*18.7/unit.t / usd_ag); // https://ourworldindata.org/grapher/real-commodity-price-index-metals

// 2019 misc commodity values
// https://www.sfu.ca/~djacks/data/boombust/Chartbook%20for%20From%20Boom%20to%20Bust%202102.pdf
new GoodDatum(goods.barley, sources.usa202, 20.36e9/158.98e12 / usd_ag2);
new GoodDatum(goods.rye, sources.usa202, 3.03e9/12.8e12 / usd_ag2);

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
new GoodDatum(goods.oilSesame, sources.ind14, 1 * india.jital / (3 * india.sir * unit.density.oilOlive/1000));
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
new GoodDatum(goods.wageLaborer, sources.ind14, (1+2)/2 * india.jital); // Pulled this out of my ass, essentially. If you find actual sources, replace this.

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
// maybe look at https://memdb.libraries.rutgers.edu/posthumus-prices

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

// https://memdb.libraries.rutgers.edu/metz-prices
// I assume "malter" ~ 870 lbs since that seems to be about right price-wise
const malter = 870 * unit.lb;
// 1587
new GoodDatum(goods.wheat, sources.med16, (12 + 22.08)/2 * guilder_ag/malter);
new GoodDatum(goods.barley, sources.med16, (7.75 + 10.92)/2 * guilder_ag/malter);
new GoodDatum(goods.oat, sources.med16, (4.13 + 5.25)/2 * guilder_ag/malter);
new GoodDatum(goods.rye, sources.med16, (10.38 + 20)/2 * guilder_ag/malter);
// 1650
new GoodDatum(goods.wheat, sources.med17, (12.38 + 18.75)/2 * guilder_ag/malter);
new GoodDatum(goods.barley, sources.med17, (6.5 + 10.33)/2 * guilder_ag/malter);
new GoodDatum(goods.oat, sources.med17, (3.81 + 6.92)/2 * guilder_ag/malter);
new GoodDatum(goods.rye, sources.med17, (9.38 + 18.68)/2 * guilder_ag/malter);
// 1750
new GoodDatum(goods.wheat, sources.med18, (13.38 + 17.61)/2 * guilder_ag/malter);
new GoodDatum(goods.barley, sources.med18, (5.9 + 9)/2 * guilder_ag/malter);
new GoodDatum(goods.oat, sources.med18, (3.2 + 5.47)/2 * guilder_ag/malter);
new GoodDatum(goods.rye, sources.med18, (9.3 + 14.39)/2 * guilder_ag/malter);

// https://memdb.libraries.rutgers.edu/sites/default/files/munro/eng_comm.xls
new GoodDatum(goods.wine, sources.med16, 9.702 * pence.c._16/unit.gal); // Wine
new GoodDatum(goods.wine, sources.med15, 2.145 * pence._3 / 1000); // EngWine
new GoodDatum(goods.sugar, sources.med15, 5 * pence._3 / unit.lb); // Sugar
new GoodDatum(goods.sugar, sources.med16, 5.935 * pence._3 / unit.lb); // Sugar
new GoodDatum(goods.candle, sources.med16, 1.206 * pence._3 / unit.lb); // Candles

// 17th and 18th century American wages
// https://babel.hathitrust.org/cgi/pt?id=uiug.30112104053555&seq=606
new GoodDatum(goods.wageLaborer, sources.med17, (15 + 18 + 24 + 18 + 36)/5 * pence.c._17); // average of five 17th-c values
new GoodDatum(goods.wageLaborer, sources.med18, (24 + 36)/2 * pence.c._17); // average of two 18th-c values

// Notes from
// A Monetary History of China
// (1) In Chu [https://en.wikipedia.org/wiki/Chu_(state)], the Gold:Copper ratio was "a bit over" 1:10 (p.29)
new GoodDatum(goods.copper, sources.chinaHan, chinaHanGold.price/10.5);
// (2) p.165 [217 in pdf] gives prices for livestock and grain:
/* "Hence, calculated in gold, the
Chinese and Roman wheat prices were fairly close.
In silver, the Chinese price was much lower than
Rome’s." */
// My calculations seem to agree with this assessment so I think I calculated them right...
new GoodDatum(goods.wheat, sources.chinaHan, 9800 / 6250 * 3.6*chinaHanGold.price / (100*unit.grainDensity.wheat));
new GoodDatum(goods.ox, sources.chinaHan, (1200+3800)/2 * china.cash);
new GoodDatum(goods.sheep, sources.chinaHan, (150+500)/2 * china.cash);
new GoodDatum(goods.pig, sources.chinaHan, 300 * china.cash);
new GoodDatum(goods.dog, sources.chinaHan, (100+120)/2 * china.cash);
new GoodDatum(goods.chickenLive, sources.chinaHan, (23+70)/2 * china.cash);
const chinaHanMillet = new GoodDatum(goods.millet, sources.chinaHan, (85+195)/2 * china.cash / china.picul);
new GoodDatum(goods.barley, sources.chinaHan, 110/2 * china.cash / china.picul);
new GoodDatum(goods.wheat, sources.chinaHan, 90/2 * china.cash / china.picul);
// p. 168, typical annual untaxed peasant income during Emperor Wen (Han dynasty)
// this is in almost precise agreement with the source I originally used (only like 2% less)
new GoodDatum(goods.wageLaborer, sources.chinaHan, 100*china.picul*chinaHanMillet.price / 365.25);
// p. 281 "At the time Emperor Muzong ascended the throne, gold and silver sold for each other in Chang’an at a price ratio of 1:10"
new GoodDatum(goods.gold, sources.chinaTang, 10);
// also cf. p. 282 "In Japan in 760, the ratio of gold to silver to copper was tenfold at each step."
// this page also has a LOT of other gold:silver ratios for other regions
// p. 380: Song prices
// RICE: 350 small iron cash per dou (c. Zhenzhong, 997‍–‍1022)
// WHEAT: 10 cash per dou (do.)
// IRON: c. 966 iron cash fell to 1/5 copper cash. c. 976 it fell to 1/10. c. 1079 it went back up between 1/1.5 and 1/2.
/** This is the approximate value of copper cash (in silver) p.428 averaged over entire Song dynasty */
const chinaSongCopperCash = unit.oz / 2105.71; // 2105.71 copper cash per oz silver average
/** This is the approximate value of iron cash (in silver) between c. 976 - 1079 */
// const chinaSongIronCash = 0.1 * chinaSongCopperCash; // todo: I feel like rice should be worth twice as much - is this really right?
// p.428, averaged values in table
new GoodDatum(goods.rice, sources.chinaSong, 1.34152 * unit.oz / (100 *unit.grainDensity.rice));
new GoodDatum(goods.wheat, sources.chinaSong, 10 * chinaSongCopperCash / (unit.grainDensity.wheat * china.dou));
// p.431, chose average in date range where copper prices were near chinaSongCopperCash; this matches table on p.433
new GoodDatum(goods.gold, sources.chinaSong, 30000 * chinaSongCopperCash / unit.oz);
//p. 608
new GoodDatum(goods.copper, sources.chinaMing, 1/((320+112)/2)); // avg. throughout dynasty
// p.609
new GoodDatum(goods.horse, sources.chinaMing, 14.37 * unit.oz);
new GoodDatum(goods.cow, sources.chinaMing, 1.5 * unit.oz);
new GoodDatum(goods.sheep, sources.chinaMing, 0.59 * unit.oz);
new GoodDatum(goods.pig, sources.chinaMing, 1.23 * unit.oz); // Yuan
new GoodDatum(goods.chickenLive, sources.chinaMing, 0.04 * unit.oz);
// p. 615 "During the ’30s of the jiajing period [1550s], an ordinary river worker’s wage was 0.03 ounce of silver per day"
new GoodDatum(goods.wageLaborer, sources.chinaMing, 0.03 * unit.oz);

// SKYRIM
// https://en.uesp.net/wiki/Skyrim:Silver
// the main currency is GOLD
// const skyrimWeightCalibration = [unit.weights.apple/0.1, unit.weights.cabbage/0.25, unit.weights.leek/0.1,
//	60/0.1, 1600/0.2, 80/0.25, 70/0.5];
const skyrimWeight = 1; // geometricAvg(skyrimWeightCalibration);
// exact value doesn't matter for most items
// apple	0.1
// cabbage	0.25
// leek		0.1
// carrot	0.1		60g
// squash	0.2 	1600g
// garlic	0.25 	80g
// egg		0.5		70g (large)
const septim = skyrimWeight / 50; // a silver bar with a weight of 1 is worth 50 septims
new GoodDatum(goods.gold, sources.skyrim, 100*septim/skyrimWeight); // 100s = 1 gold bar; 50s = 1 silver bar
new GoodDatum(goods.iron, sources.skyrim, 7*septim/skyrimWeight);
new GoodDatum(goods.leather, sources.skyrim, 10*septim/(2*skyrimWeight));
// new GoodDatum(goods.glass, sources.skyrim, (2*100*septim/skyrimWeight + 75*septim/skyrimWeight)/3); // glass is 2:1 Malachite:Moonstone
// https://en.uesp.net/wiki/Skyrim:Clothing#Circlets
new GoodDatum(goods.copper, sources.skyrim, (100/250 + 200/400)/2); // copper circlets are XXX% the value of silver ones
// Beyond Skyrim (https://en.uesp.net/wiki/Beyond_Skyrim:Copper) has copper as 0.6 x Silver, close to the 0.45 x calculation I have
// https://en.uesp.net/wiki/Skyrim:Food
new GoodDatum(goods.boarMeat, sources.skyrim, 2*septim/skyrimWeight);
new GoodDatum(goods.chicken, sources.skyrim, 3*septim/(0.2 * skyrimWeight));
new GoodDatum(goods.lamb, sources.skyrim, 3*septim/skyrimWeight); // leg of goat
new GoodDatum(goods.beef, sources.skyrim, 4*septim/(0.2 * skyrimWeight));
new GoodDatum(goods.potatoSweet, sources.skyrim, 1*septim/(0.1 * skyrimWeight)); // ash yam
new GoodDatum(goods.cabbage, sources.skyrim, 2*septim/(0.25 * skyrimWeight));
new GoodDatum(goods.carrot, sources.skyrim, 1*septim/(0.1 * skyrimWeight));
new GoodDatum(goods.squash, sources.skyrim, 1*septim/(0.2 * skyrimWeight)); // gourd
new GoodDatum(goods.apple, sources.skyrim, 3*septim/(0.1 * skyrimWeight)); // green apple and red apple
new GoodDatum(goods.leek, sources.skyrim, 1*septim/(0.1 * skyrimWeight));
new GoodDatum(goods.butter, sources.skyrim, 1*septim/(0.1 * skyrimWeight));
new GoodDatum(goods.milk, sources.skyrim, 2*septim/(1 * skyrimWeight));
new GoodDatum(goods.flour, sources.skyrim, 1*septim/(0.5 * skyrimWeight));
new GoodDatum(goods.cheese, sources.skyrim, (13+10)/2*septim/(2 * skyrimWeight)); // avg. of Eidar and Goat cheese
new GoodDatum(goods.honey, sources.skyrim, 2*septim/(0.1 * skyrimWeight));
new GoodDatum(goods.ale, sources.skyrim, 5*septim/(0.5 * skyrimWeight));
new GoodDatum(goods.wine, sources.skyrim, 7*septim/(0.5 * skyrimWeight));
// https://en.uesp.net/wiki/Skyrim:Ingredients
// new GoodDatum(goods.egg, sources.skyrim, 12*2*septim);
new GoodDatum(goods.garlic, sources.skyrim, 1*septim/(0.25 * skyrimWeight));
new GoodDatum(goods.sugar, sources.skyrim, 50*septim/(0.25 * skyrimWeight)); // moon sugar
new GoodDatum(goods.salt, sources.skyrim, 1*septim/(0.2 * skyrimWeight));
new GoodDatum(goods.wheat, sources.skyrim, 5*septim/(0.1 * skyrimWeight));
new GoodDatum(goods.silk, sources.skyrim, 50*septim/(0.5 * skyrimWeight)); // daedra silk
// https://en.uesp.net/wiki/Skyrim:Miscellaneous_Items
new GoodDatum(goods.glass, sources.skyrim, 5*septim/skyrimWeight);
new GoodDatum(goods.firewood, sources.skyrim, 5*septim/(5 * skyrimWeight));
// https://en.uesp.net/wiki/Skyrim:Tools
new GoodDatum(goods.charcoal, sources.skyrim, 2*septim/(0.5 * skyrimWeight));
// horse price
// new GoodDatum(goods.horse, sources.skyrim, 1000*septim);
// https://en.uesp.net/wiki/Skyrim:Chop_Wood
// "For the house in Whiterun, for example, you will get 5000 gold if you accumulate 1000 pieces of firewood. This takes approximately 24 hours of game time when the time scale is set around 10, or 25 minutes in real time."
// new GoodDatum(goods.wageLaborer, sources.skyrim, 5000/3 * septim);
// https://en.uesp.net/wiki/Beyond_Skyrim:Food
new GoodDatum(goods.lettuce, sources.skyrim, 2*septim/(0.25 * skyrimWeight));
new GoodDatum(goods.radish, sources.skyrim, 1*septim/(0.1 * skyrimWeight));
// https://en.uesp.net/wiki/Beyond_Skyrim:Ingredients
new GoodDatum(goods.rice, sources.skyrim, 5*septim/(0.1 * skyrimWeight));
// https://www.reddit.com/r/teslore/comments/hhru3q/what_is_the_average_income/
new GoodDatum(goods.wageLaborer, sources.skyrim, 10*septim); // rough estimate


// DWARF FORTRESS
// https://dwarffortresswiki.org/index.php/Silver
const dfs = 10*10.49; // value of silver * its density
const df$ = 600 * 10.49 / (500 * 0.2); // a 600 cm^3 bar of silver (10.49 g/cm^3), weighs 6294 g. This can be turned into 500 silver coins worth $0.2 each.
// https://dwarffortresswiki.org/index.php/Metal#Pure_metals
new GoodDatum(goods.gold, sources.dorf, 30*19.32 / dfs);
new GoodDatum(goods.copper, sources.dorf, 2*8.93 / dfs);
new GoodDatum(goods.iron, sources.dorf, 10*7.85 / dfs);
new GoodDatum(goods.aluminum, sources.dorf, 40*2.7 / dfs);
new GoodDatum(goods.platinum, sources.dorf, 40*21.4 / dfs);

new GoodDatum(goods.charcoal, sources.dorf, 2*1.346 / dfs); // fuel
new GoodDatum(goods.glass, sources.dorf, 2*2.6 / dfs); // green glass
new GoodDatum(goods.salt, sources.dorf, 1*2.17 / dfs);
new GoodDatum(goods.soap, sources.dorf, 1*0.5 / dfs);

new GoodDatum(goods.cow, sources.dorf, 300 * df$);
new GoodDatum(goods.horse, sources.dorf, 200 * df$);
new GoodDatum(goods.pig, sources.dorf, 100 * df$);
new GoodDatum(goods.sheep, sources.dorf, 100 * df$);
new GoodDatum(goods.dog, sources.dorf, 30 * df$);
new GoodDatum(goods.cat, sources.dorf, 20 * df$);
new GoodDatum(goods.gooseLive, sources.dorf, 10 * df$);
new GoodDatum(goods.chickenLive, sources.dorf, 10 * df$);
new GoodDatum(goods.duckLive, sources.dorf, 10 * df$);

// BASIC STANDARD OF LIVING: FOOD + DRINK + CLOTHING
// FOOD:
// https://dwarffortresswiki.org/index.php/Food#Detailed_mechanics
// Eating one meal decreases hunger by 50,000 units. It increases 1,200 units per day. (Drinking works identically)
// My understanding is that with cheap ingredients, basic meal quality, a meal is 1☼
// Cheapest alcohol is 1☼ per unit [https://dwarffortresswiki.org/index.php/Alcohol#List_of_alcohol], although one could also consider it is easier to get the 2☼ alcohols
// cheapest base values of clothing 5 headwear, 8 torso, 5 pants, 12 pair of handwear, 12 pair of footwear (42 total)
// clothing undergoes 1 wear level every 20 years base (https://dwarffortresswiki.org/index.php/Wear) so this is the replacement time I'm using.
// so 0.024☼/d for food, the same amount for drink, 0.00625☼/d clothing (336 days in a year)
// this comes out to 0.05425☼/d (abt. 1/18)
new GoodDatum(goods.wageLaborer, sources.dorf, 0.05425 * df$);

// Platinum Price History
// https://sdbullion.com/blog/platinum-price-history
new GoodDatum(goods.platinum, sources.usa190, 6 / unit.ozt / usd_ag_1900); // abt $6 / ozt
new GoodDatum(goods.platinum, sources.usa195, 70 / unit.ozt / usd_ag_1950); // abt $70 / ozt
// https://tradingeconomics.com/commodity/platinum
new GoodDatum(goods.platinum, sources.usa202, 1011.1 / unit.ozt / usd_ag2);

/** @param {Source} source */
function cost_of_living(source, use_indexed = true){
	const qqq = use_indexed ? 'indexedPrice' : 'price';
	// I'm using very approximate values based on dietary recommendations:
	// PER DAY:
	// 300g vegetables
	// 200g fruit
	// 60g meat
	// 20g fish
	// 500 mL milk (appx. 485g)
	// 500g grain
	// 25g nuts
	// 10g fabric (to replace about 3.65 kg of worn clothing per year)
	/** @param {string} name */
	function get_cat(name){
		return GoodDatum.gooddata.filter(gd => gd.good && gd.good.category === Category.fromString(name) && gd.source === source).map(gd => gd[qqq]);
	}
	/** @param {Good} good */
	function get_good(good){
		const datum = GoodDatum.gooddata.find(gd => gd.good && gd.good === good && gd.source === source);
		return datum && datum[qqq];
	}
	function min(x){
		const m = Math.min(...x);
		return isFinite(m) ? m : undefined;
	}
	try {
		const fallback = min(GoodDatum.gooddata.filter(gd => gd.good && gd.source === source).map(gd => gd[qqq]));
		const gra_min = min(get_cat('Grain')) || fallback;
		const veg_min = min(get_cat('Vegetable')) || gra_min;
		const fru_min = min(get_cat('Fruit')) || veg_min;
		const mea_min = min([get_cat('Meat'), get_cat('Fowl')]) || gra_min;
		const fis_min = min(get_cat('Fish')) || mea_min;
		const dai_min = min(get_cat('Dairy')) || gra_min;
		const nut_min = min(get_cat('Nut')) || dai_min;
		const fab_min = min(get_cat('Fabric')) || fallback;
		const alc_min = min(get_cat('Alcohol')) || fallback;
		const sal_min = get_good(goods.salt) || fallback;
		const egg_min = get_good(goods.egg) || fallback;
		const fuel_min = Math.min(...[get_good(goods.charcoal), get_good(goods.coal), 1.62*get_good(goods.firewood)].filter(isFinite));
		const fuel_actual = 1350 * (isFinite(fuel_min) ? fuel_min : 1.62*fallback);
		const value = 350*veg_min + 350*fru_min + 105*mea_min + 30*fis_min + 150*dai_min + 300*gra_min + 20*nut_min
			+ 1.65*fab_min + 1*sal_min + fuel_actual + 15*alc_min + 0.015*egg_min;
		const frac = {
			gra: 300 * gra_min / value,
			fru: 350 * fru_min / value,
			veg: 350 * veg_min / value,
			mea: 105 * mea_min / value,
			fis: 30 * fis_min / value,
			dai: 150 * dai_min / value,
			nut: 20 * nut_min / value,
			fab: 1.65 * fab_min / value,
			alc: 15 * alc_min / value,
			egg: 0.015 * egg_min / value,
			sal: 1 * sal_min / value,
			fuel: fuel_actual / value,
		};
		return {
			fallback, gra_min, veg_min, fru_min, fis_min, dai_min, nut_min, fab_min, sal_min, fuel_min, value, frac,
			just_grain: 1250 * gra_min, // abt. 2000 cal of grain
		};
	}
	catch (_){
		// eslint-disable-next-line no-useless-return
		return;
	}
}

/** @param {Source} source */
function standard_of_living(source){
	return GoodDatum.gooddata.find(gd => gd.good && gd.good === goods.wageLaborer && gd.source === source).price / cost_of_living(source, false).value;
}

/** try "compare(sources.rome0, sources.usa202)" */
function compare(s0, s1){
	const priceChanges = {};
	const rr = [];
	Good.goods.filter(g => GoodDatum.gooddata.some(gd => gd.good === g && gd.source === s0)
		&& GoodDatum.gooddata.some(gd => gd.good === g && gd.source === s1)
	).forEach(g => {
		const d0 = GoodDatum.gooddata.find(gd => gd.good === g && gd.source === s0);
		const d1 = GoodDatum.gooddata.find(gd => gd.good === g && gd.source === s1);
		const r = d1.price / d0.price;
		priceChanges[d0.good.name] = r;
		rr.push(r);
	});
	priceChanges.avgArithmetic = rr.reduce((a, b) => a+b, 0) / rr.length;
	priceChanges.avgGeometric = geometricAvg(rr);
	priceChanges.adjGeo = {};
	for (const i in priceChanges)
		if (!['avg', 'adj'].includes(i.slice(0, 3)))
			priceChanges.adjGeo[i] = priceChanges[i] / priceChanges.avgGeometric;
	priceChanges.adjWage = {};
	for (const i in priceChanges)
		if (!['avg', 'adj'].includes(i.slice(0, 3)))
			priceChanges.adjWage[i] = priceChanges[i] / priceChanges['Wage (Laborer)'];
	return priceChanges;
}

function blankTD(){
	return document.createElement('td');
}

/** @param {Source} source */
function visibleSources(source){
	return debug || !source.hideMe;
}

function headers(){
	const trh = document.createElement('tr');
	trh.appendChild(document.createElement('td'));
	Source.sources.filter(visibleSources).forEach(source => {
		trh.appendChild(source.th);
	});
	return trh;
}

function main(){
	function round3(x){
		return Math.round(1000 * x) / 1000;
	}
	if (main.last === unit.index)
		return;
	main.last = unit.index;
	const container = document.getElementById('container');
	container.innerHTML = '';
	// construct table
	const table = document.createElement('table');
	// headers
	table.appendChild(headers());
	// first two rows are COST OF LIVING and STANDARD OF LIVING
	const col_tr = document.createElement('tr');
	table.appendChild(col_tr);
	const col2_tr = document.createElement('tr');
	table.appendChild(col2_tr);
	const sol_tr = document.createElement('tr');
	table.appendChild(sol_tr);
	const col_th = document.createElement('th');
	col_tr.appendChild(col_th);
	col_th.innerHTML = 'Cost of Living';
	col_th.title = 'Based on a balanced diet (see methodology section)';
	const col2_th = document.createElement('th');
	col2_tr.appendChild(col2_th);
	col2_th.innerHTML = 'Cost of 2k cal Grain';
	col2_th.title = 'Currently approximated by taking 1.25 kg of the cheapest grain';
	const sol_th = document.createElement('th');
	sol_tr.appendChild(sol_th);
	sol_th.innerHTML = 'Standard of Living';
	sol_th.title = 'Wage / Cost of Living';
	Source.sources.forEach(source => {
		const col_td = document.createElement('td');
		col_tr.appendChild(col_td);
		const col2_td = document.createElement('td');
		col2_tr.appendChild(col2_td);
		const sol_td = document.createElement('td');
		sol_tr.appendChild(sol_td);
		const col = cost_of_living(source);
		col_td.innerHTML = round3(col.value);
		col2_td.innerHTML = round3(col.just_grain);
		sol_td.innerHTML = round3(standard_of_living(source));
		col_td.title = sol_td.title = `${source.summary}
		Breakdown:
		Fuel: ${Math.round(100*col.frac.fuel)}%
		Grain: ${Math.round(100*col.frac.gra)}%
		Dairy: ${Math.round(100*col.frac.dai)}%
		Vegetables: ${Math.round(100*col.frac.veg)}%
		Fruit: ${Math.round(100*col.frac.fru)}%
		Meat: ${Math.round(100*col.frac.mea)}%
		Alcohol: ${Math.round(100*col.frac.alc)}%
		Nuts: ${Math.round(100*col.frac.nut)}%
		Fish: ${Math.round(100*col.frac.fis)}%
		Fabric: ${Math.round(100*col.frac.fab)}%
		Salt: ${Math.round(100*col.frac.sal)}%
		Eggs: ${Math.round(100*col.frac.egg)}%
		`;
	});
	// rows
	Good.goods.forEach(good => table.appendChild(good.tr));
	// footers
	table.appendChild(headers());
	// end
	container.appendChild(table);
}

main();
// TODO item categories with background colors