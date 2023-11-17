const unit = {
	/** number of L in a bushel */
	bu: 35.2390704,
	/** hundredweight in grams */
	cwt: 45359.24,
	/** number of grams in a gallon of water */
	gal: 3770,
	/** number of grams in a quart of water */
	qt: 3770/4,
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
	/** imperial ton in grams */
	t: 453.5924*2000,
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
	constructor(name, category = 'NULL', unit = ''){
		/** @type {string} */
		this.name = name;
		/** @type {Category} */
		this.category = Category.fromString(category);
		/** @type {string} */
		this.unit = unit;
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
	rice: new Good('Rice', 'Grain'),
	spelt: new Good('Spelt', 'Grain'),
	wheat: new Good('Wheat', 'Grain'),
	// PROCESSED GRAIN
	flour: new Good('Flour', 'Processed Grain'),
	oatmeal: new Good('Oatmeal', 'Processed Grain'),
	// DAIRY
	butter: new Good('Butter', 'Dairy'),
	cheese: new Good('Cheese', 'Dairy'),
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
	citron: new Good('Citron', 'Fruit'),
	currant: new Good('Currant', 'Fruit'),
	figs: new Good('Figs', 'Fruit'),
	// VEGETABLES
	garlic: new Good('Garlic', 'Vegetable'),
	potatoSweet: new Good('Sweet Potato', 'Vegetable'),
	squash: new Good('Squash', 'Vegetable'),
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
	slaveF: new Good('Slave (f)', 'Misc', 'ea'),
	slaveM: new Good('Slave (m)', 'Misc', 'ea'),
	slaveSkilled: new Good('Slave (Skilled)', 'Misc', 'ea'),
	slaveYoung: new Good('Slave (Young)', 'Misc', 'ea'),
	// LIVESTOCK
	horse: new Good('Horse', 'Misc', 'ea'),
	pony: new Good('Pony', 'Misc', 'ea'),
	bull: new Good('Bull', 'Misc', 'ea'),
	cow: new Good('Cow', 'Misc', 'ea'),
	sheep: new Good('Sheep', 'Misc', 'ea'),
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
	rome0: new Source(301, 'Rome', 'https://imperiumromanum.pl/en/roman-economy/roman-goods-prices/'),
	med12: new Source('12th c.', 'W. Eur.', 'http://www.medievalcoinage.com/prices/medievalprices.htm'),
	med13: new Source('13th c.', 'England', 'http://medieval.ucdavis.edu/120D/Money.html'),
	med14: new Source('14th c.', 'England', 'http://www.afamilystory.co.uk/history/wages-and-prices.aspx'),
	ind14: new Source('14th c.', 'India', 'https://en.wikipedia.org/wiki/Market_reforms_of_Alauddin_Khalji'),
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

// copper values
new GoodDatum(goods.copper, sources.rome0, 0.355 / 12); // https://seekingalpha.com/article/4181917-copper-silver-ratio-range-for-thousands-of-years
new GoodDatum(goods.copper, sources.med14, 0.13 / 12); // https://seekingalpha.com/article/4181917-copper-silver-ratio-range-for-thousands-of-years
new GoodDatum(goods.copper, sources.med17, 5*0.5/240/11/(5/3.58/unit.ozt)); // https://en.wikipedia.org/wiki/History_of_the_halfpenny#Base-metal_halfpennies
new GoodDatum(goods.copper, sources.med18, 5*0.5/240/((10.3+9.4)/2)/(5/3.58/unit.ozt)); // https://en.wikipedia.org/wiki/History_of_the_halfpenny#The_United_Kingdom
new GoodDatum(goods.copper, sources.usa180, 0.01/13.48/(1.29/unit.ozt)); // A penny was ~100% pure copper and weighed 13.48g
new GoodDatum(goods.copper, sources.usa185, 0.22/unit.lb/(1.29/unit.ozt)); // https://pubs.usgs.gov/sir/2012/5188/sir2012-5188.pdf
new GoodDatum(goods.copper, sources.usa202, 3.73/unit.lb/(23.35/unit.ozt)); // https://commodity.com/precious-metals/copper/price/

// iron values
new GoodDatum(goods.iron, sources.usa202, 129.25/1000000/(23.35/unit.ozt)); // iron ore price

// 301 CE ROME
const grainDensity = 27215.5 / 35.2391; // g/L of grains https://www.smallfarmcanada.ca/resources/standard-weights-per-bushel-for-agricultural-commodities
new GoodDatum(goods.wheat, sources.rome0, 100/20/(17*grainDensity)); // 100 denarii for 17L
new GoodDatum(goods.barley, sources.rome0, 60/20/(17*grainDensity));
new GoodDatum(goods.millet, sources.rome0, 100/20/(17*grainDensity));
new GoodDatum(goods.spelt, sources.rome0, 100/20/(17*grainDensity));
new GoodDatum(goods.sesame, sources.rome0, 200/20/(17*grainDensity));
new GoodDatum(goods.cumin, sources.rome0, 200/20/(17*grainDensity));
new GoodDatum(goods.wine, sources.rome0, 8/20/500); // 8 denarii for 500mL
new GoodDatum(goods.beer, sources.rome0, 4/20/500); // 4 denarii for 500mL
new GoodDatum(goods.oilOlive, sources.rome0, 40/20/500);
new GoodDatum(goods.vinegar, sources.rome0, 6/20/500);
new GoodDatum(goods.salt, sources.rome0, 100/20/21000);
new GoodDatum(goods.honey, sources.rome0, 40/20/500);
new GoodDatum(goods.pork, sources.rome0, 12/20/300); // 12 denarii for 300g
new GoodDatum(goods.beef, sources.rome0, 8/20/300);
new GoodDatum(goods.boarMeat, sources.rome0, 16/20/300);
new GoodDatum(goods.fishSaltwater, sources.rome0, 24/20/300);
new GoodDatum(goods.fishFreshwater, sources.rome0, 8/20/300);
new GoodDatum(goods.fishSalted, sources.rome0, 6/20/300);
new GoodDatum(goods.cheese, sources.rome0, 12/20/300);
new GoodDatum(goods.fishSardines, sources.rome0, 16/20/300);
new GoodDatum(goods.garlic, sources.rome0, 60/20/(17*grainDensity));
new GoodDatum(goods.figs, sources.rome0, 4/20/300);
new GoodDatum(goods.milk, sources.rome0, 8/20/500);
new GoodDatum(goods.firewood, sources.rome0, 30/20/98000); // 30 denarii for 98 kg
new GoodDatum(goods.ivory, sources.rome0, 150/20/300);
new GoodDatum(goods.turtleshell, sources.rome0, 100/20/300);
new GoodDatum(goods.glass, sources.rome0, 24/20/300);
new GoodDatum(goods.downGoose, sources.rome0, 100/20/300);
new GoodDatum(goods.downWillow, sources.rome0, 1000/20/30000);
new GoodDatum(goods.ink, sources.rome0, 12/20/300);
new GoodDatum(goods.silk, sources.rome0, 12000/20/300);
new GoodDatum(goods.wool, sources.rome0, 175/20/300);
new GoodDatum(goods.linen, sources.rome0, 24/20/300);
new GoodDatum(goods.gold, sources.rome0, 12);
new GoodDatum(goods.wax, sources.rome0, 25/20/300);
new GoodDatum(goods.saffron, sources.rome0, 2000/20/300);
new GoodDatum(goods.incense, sources.rome0, 100/20/300);
new GoodDatum(goods.pepper, sources.rome0, 800/20/300);
new GoodDatum(goods.ginger, sources.rome0, 250/20/300);
new GoodDatum(goods.slaveM, sources.rome0, (25000 + 30000)/2/20); // 25 - 30k denarii
new GoodDatum(goods.slaveF, sources.rome0, (20000 + 25000)/2/20);
new GoodDatum(goods.slaveYoung, sources.rome0, (10000 + 20000)/2/20);
new GoodDatum(goods.cow, sources.rome0, 2000/2/20);
new GoodDatum(goods.sheep, sources.rome0, 400/2/20);
new GoodDatum(goods.horse, sources.rome0, 100000/2/20);
new GoodDatum(goods.bull, sources.rome0, 5000/2/20);

// ENGLAND
// https://en.wikipedia.org/wiki/Penny_(English_coin)#History
// "The penny initially weighed 20 to 22.5 modern grains (1.3 to 1.5 g). It was standardized to 32 Tower grains, 1⁄240 of a Tower pound (approx. 350 g)."
// 1d = 350/240 g silver
new GoodDatum(goods.wool, sources.med14, (3 + 5/7)*unit.lbtower/240 / unit.lb); // 3 5/7 d per pound
new GoodDatum(goods.cheese, sources.med14, (4 + 1/2)*unit.lbtower/240 / (7*unit.lb)); // 4 1/2 d per 7 lbs
new GoodDatum(goods.butter, sources.med14, (4 + 3/4)*unit.lbtower/240 / (7*unit.lb));
// 2nd row
new GoodDatum(goods.wool, sources.med15, (3 + 5/7)*unit.lbtower/240 / unit.lb);
new GoodDatum(goods.cheese, sources.med15, 0.5*unit.lbtower/240 / unit.lb);
new GoodDatum(goods.butter, sources.med15, 1*unit.lbtower/240 / unit.lb);
new GoodDatum(goods.hops, sources.med15, (14*12 + 0.5)*unit.lbtower/240 / unit.cwt); // 1s 0.5d per cwt
// "The weight standard was changed to the Troy pound (373.242 g) in 1527 under Henry VIII,"
new GoodDatum(goods.wool, sources.med16, (7 + 1/2)*unit.lbt/240 / unit.lb);
new GoodDatum(goods.cheese, sources.med16, 1*unit.lbt/240 / unit.lb);
new GoodDatum(goods.butter, sources.med16, 3*unit.lbt/240 / unit.lb);
new GoodDatum(goods.hops, sources.med16, (26*12 + 8)*unit.lbt/240 / unit.cwt);

// med13
new GoodDatum(goods.wine, sources.med14, 3*unit.lbtower/240 / unit.gal);
new GoodDatum(goods.ale, sources.med15, 0.75*unit.lbtower/240 / unit.gal);
new GoodDatum(goods.beer, sources.med16, 1*unit.lbtower/240 / unit.qt);
new GoodDatum(goods.pepper, sources.med13, 12*unit.lbtower/240 / unit.lb);
new GoodDatum(goods.saffron, sources.med14, 13.5*unit.lbtower/240 / unit.lb);
new GoodDatum(goods.cheese, sources.med13, (3*12 + 4)*unit.lbt/240 / (80*unit.lb));

// https://thehistoryofengland.co.uk/resource/medieval-prices-and-wages/
new GoodDatum(goods.beer, sources.med14, 1*unit.lbtower/240 / unit.gal);
new GoodDatum(goods.sugar, sources.med14, 18*unit.lbtower/240 / unit.lb);

// https://web.archive.org/web/20110628231215/http://www.fordham.edu/halsall/source/medievalprices.html
new GoodDatum(goods.candle, sources.med14, 2*unit.lbtower/240 / unit.lb);
new GoodDatum(goods.candle, sources.med15, 4*unit.lbtower/240 / unit.lb);

// http://www.medievalcoinage.com/prices/medievalprices.htm
new GoodDatum(goods.wine, sources.med12, 1.14*unit.lbtower/240 / unit.gal);

// https://medium.com/@zavidovych/what-we-can-learn-by-looking-at-prices-and-wages-in-medieval-england-8dc207cfd20a#.7yzbvz6lj
new GoodDatum(goods.charcoal, sources.med15, 5*unit.lbtower/240 / 38560); // 4.25 bu

// https://www.historyextra.com/period/medieval/a-time-travellers-guide-to-medieval-shopping/
new GoodDatum(goods.ale, sources.med14, (0.75 + 1)/2*unit.lbtower/240 / unit.gal);

// https://babel.hathitrust.org/cgi/pt?id=hvd.32044050806330&seq=79
// 1800
const usd_ag = 1.29 / unit.ozt; // usd per gram Ag prior to ~1861
new GoodDatum(goods.flax, sources.usa180, 0.174/unit.lb / usd_ag);
new GoodDatum(goods.hops, sources.usa180, 0.167/unit.lb / usd_ag);
new GoodDatum(goods.rice, sources.usa180, 0.036/unit.lb / usd_ag);
new GoodDatum(goods.wool, sources.usa180, 0.416/unit.lb / usd_ag);
new GoodDatum(goods.leather, sources.usa180, 0.198/unit.lb / usd_ag);
new GoodDatum(goods.butter, sources.usa180, 0.198/unit.lb / usd_ag);
new GoodDatum(goods.cheese, sources.usa180, 0.105/unit.lb / usd_ag);
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

// TODAY PRICES
const usd_ag2 = 23.35 / unit.ozt; // current value
new GoodDatum(goods.rice, sources.usa202, 0.042/unit.oz / usd_ag2);
new GoodDatum(goods.flour, sources.usa202, 0.027/unit.oz / usd_ag2);
new GoodDatum(goods.oatmeal, sources.usa202, 0.095/unit.oz / usd_ag2);
new GoodDatum(goods.butter, sources.usa202, 0.236/unit.oz / usd_ag2);
new GoodDatum(goods.cheese, sources.usa202, 0.155/unit.oz / usd_ag2);
new GoodDatum(goods.ghee, sources.usa202, 0.625/unit.oz / usd_ag2);
new GoodDatum(goods.milk, sources.usa202, 0.022/unit.oz / usd_ag2);
new GoodDatum(goods.beef, sources.usa202, 6.48/unit.lb / usd_ag2);
new GoodDatum(goods.pork, sources.usa202, 4.47/unit.lb / usd_ag2);
new GoodDatum(goods.chicken, sources.usa202, 2.67/unit.lb / usd_ag2);
new GoodDatum(goods.turkey, sources.usa202, 7.5/unit.lb / usd_ag2);
new GoodDatum(goods.fish, sources.usa202, 4.24/unit.lb / usd_ag2); // Tilapia filets
new GoodDatum(goods.fishSardines, sources.usa202, 0.285/unit.oz / usd_ag2);
new GoodDatum(goods.garlic, sources.usa202, 0.274/unit.lb / usd_ag2);
new GoodDatum(goods.potatoSweet, sources.usa202, 0.64/unit.lb / usd_ag2);
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
new GoodDatum(goods.honey, sources.usa202, 0.32/unit.oz / usd_ag2);
new GoodDatum(goods.lard, sources.usa202, 0.08/unit.oz / usd_ag2);
new GoodDatum(goods.oilOlive, sources.usa202, 0.281/unit.oz / usd_ag2);
new GoodDatum(goods.oilSesame, sources.usa202, 0.536/unit.oz / usd_ag2);
new GoodDatum(goods.salt, sources.usa202, 0.025/unit.oz / usd_ag2);
new GoodDatum(goods.sesame, sources.usa202, 0.653/unit.oz / usd_ag2);
new GoodDatum(goods.soda, sources.usa202, 0.058/unit.oz / usd_ag2);
new GoodDatum(goods.sugar, sources.usa202, 0.048/unit.oz / usd_ag2);
new GoodDatum(goods.sugarBrown, sources.usa202, 0.073/unit.oz / usd_ag2);
new GoodDatum(goods.tallow, sources.usa202, 39.99/(7*unit.lb) / usd_ag2);
new GoodDatum(goods.tea, sources.usa202, 0.623/unit.oz / usd_ag2);
new GoodDatum(goods.vinegar, sources.usa202, 0.029/unit.oz / usd_ag2);
new GoodDatum(goods.ale, sources.usa202, 0.091/unit.oz / usd_ag2);
new GoodDatum(goods.wine, sources.usa202, 0.136/unit.oz / usd_ag2);
new GoodDatum(goods.candle, sources.usa202, 0.214/unit.oz / usd_ag2);
new GoodDatum(goods.soap, sources.usa202, 0.148/unit.oz / usd_ag2);
new GoodDatum(goods.charcoal, sources.usa202, 0.493/unit.lb / usd_ag2);

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
new GoodDatum(goods.wheat, sources.med18, 4.51/(grainDensity * unit.bu) / eng_s_ag * PA_CORRECTION);
new GoodDatum(goods.tobacco, sources.med18, 19.98/unit.cwt / eng_s_ag * PA_CORRECTION);
new GoodDatum(goods.rice, sources.med18, 20.63/unit.cwt / eng_s_ag * PA_CORRECTION);
new GoodDatum(goods.flour, sources.med18, 13.10/unit.cwt / eng_s_ag * PA_CORRECTION);
new GoodDatum(goods.sugar, sources.med18, 51.98/unit.cwt / eng_s_ag * PA_CORRECTION);
new GoodDatum(goods.iron, sources.med18, 34.5*20/unit.t / eng_s_ag * PA_CORRECTION);
new GoodDatum(goods.cotton, sources.med18, 2.15/unit.lb / eng_s_ag * PA_CORRECTION);
// https://books.google.com/books?id=j1ArEAAAQBAJ&pg=PA9&source=gbs_toc_r&cad=2#v=onepage&q&f=false

// https://en.wikipedia.org/wiki/Market_reforms_of_Alauddin_Khalji
const india = {
	// "Firishta states that 1 silver tanka was equal to 50 jitals."
	get jital(){
		return india.tanka/50;
	},
	/** grams in one Mann https://en.wikipedia.org/wiki/Maund#Delhi_Sultanate */
	mann: 11540,
	// "a tanka was made of one tola of gold or silver."
	get tanka(){
		return india.tola;
	},
	/** grams in one Sir https://en.wikipedia.org/wiki/Seer_(unit) */
	sir: 1250,
	/** grams in one Tola https://en.wikipedia.org/wiki/Tola_(unit) */
	tola: 11.6638038,
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

function blankTD(){
	return document.createElement('td');
}

function main(){
	const container = document.getElementById('container');
	// construct table
	const table = document.createElement('table');
	// headers
	const trh = document.createElement('tr');
	trh.appendChild(document.createElement('td'));
	Source.sources.forEach(source => {
		trh.appendChild(source.th);
	});
	table.appendChild(trh);
	// rows
	Good.goods.forEach(good => table.appendChild(good.tr));
	// end
	container.appendChild(table);
}

main();
// TODO item categories with background colors