const unit = {
	/** number of grams in a gallon of water */
	gal: 3770,
	/** number of grams in a quart of water */
	qt: 3770/4,
	/** tower pound in grams */
	lbtower: 350,
	/** troy pound in grams */
	lbt: 373.242,
};


// eg. "cheese"
class Good {
	/**
	 * @param {string} name
	 */
	constructor(name){
		/** @type {string} */
		this.name = name;
		Good.goods.push(this);
	}
	get sourceArr(){
		return Source.sources
			.map(s => GoodDatum.gooddata.find(datum => datum.good === this && datum.source === s));
	}
	get th(){
		const elem = document.createElement('th');
		elem.innerHTML = this.name;
		return elem;
	}
	get tr(){
		const elem = document.createElement('tr');
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
	gold: new Good('Gold'),
	// have gold on top, the rest in groups alphabetical or in logical order...
	// DAIRY
	butter: new Good('Butter'),
	cheese: new Good('Cheese'),
	milk: new Good('Milk'),
	// MEAT
	boarMeat: new Good('Boar Meat'),
	beef: new Good('Beef'),
	pork: new Good('Pork'),
	// FISH
	fishFreshwater: new Good('Freshwater Fish'),
	fishSaltwater: new Good('Saltwater Fish'),
	fishSalted: new Good('Salted Fish'),
	fishSardines: new Good('Sardines'),
	// FRUIT
	figs: new Good('Figs'),
	// SPICES &c
	ginger: new Good('Ginger'),
	honey: new Good('Honey'),
	hops: new Good('Hops'),
	incense: new Good('Incense'),
	oliveOil: new Good('Olive Oil'),
	pepper: new Good('Black Pepper'),
	saffron: new Good('Saffron'),
	salt: new Good('Salt'),
	vinegar: new Good('Vinegar'),
	// ALCOHOL
	ale: new Good('Ale'),
	beer: new Good('Beer'),
	wine: new Good('Wine'),
	// DOWN FEATHERS LINING WOOL
	downGoose: new Good('Goose Down'),
	downWillow: new Good('Willow Down'),
	linen: new Good('Linen'),
	wool: new Good('Wool'),
	// TOOLS
	ink: new Good('Ink'),
	// LUXURY MATERIALS
	glass: new Good('Glass'),
	ivory: new Good('Ivory'),
	silk: new Good('Silk'),
	turtleshell: new Good('Turtleshell'),
	// MISC
	firewood: new Good('Firewood'),
	wax: new Good('Wax'),
};

const sources = {
	// "Silver, pure, in bars or coins – 6000 denarii for about 300 g" thus 1g Ag = 20 denarii
	rome0: new Source(301, 'Rome', 'https://imperiumromanum.pl/en/roman-economy/roman-goods-prices/'),
	med13: new Source('13th c.', 'England', 'http://medieval.ucdavis.edu/120D/Money.html'),
	med14: new Source('14th c.', 'England', 'http://www.afamilystory.co.uk/history/wages-and-prices.aspx'),
	med15: new Source('15th c.', 'England', 'http://www.afamilystory.co.uk/history/wages-and-prices.aspx'),
	med16: new Source('16th c.', 'England', 'http://www.afamilystory.co.uk/history/wages-and-prices.aspx'),
	med17: new Source('17th c.', 'England', ''),
	med18: new Source('18th c.', 'England', ''),
};

// value of a pound, bimetallic ratio:
// https://en.wikipedia.org/wiki/Pound_sterling#History_(600%E2%80%931945)
new GoodDatum(goods.gold, sources.med14, 258.9/23.21);
new GoodDatum(goods.gold, sources.med15, 172.6/15.47);
new GoodDatum(goods.gold, sources.med16, 115.1/10.31);
new GoodDatum(goods.gold, sources.med17, 111.4/((10.31 + 7.32238)/2));
new GoodDatum(goods.gold, sources.med18, 111.4/7.32238);

// 301 CE ROME
new GoodDatum(goods.wine, sources.rome0, 8/20/500); // 8 denarii for 500mL
new GoodDatum(goods.beer, sources.rome0, 4/20/500); // 4 denarii for 500mL
new GoodDatum(goods.oliveOil, sources.rome0, 40/20/500);
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

// ENGLAND
// https://en.wikipedia.org/wiki/Penny_(English_coin)#History
// "The penny initially weighed 20 to 22.5 modern grains (1.3 to 1.5 g). It was standardized to 32 Tower grains, 1⁄240 of a Tower pound (approx. 350 g)."
// 1d = 350/240 g silver
new GoodDatum(goods.wool, sources.med14, (3 + 5/7)*unit.lbtower/240 / 453.5924); // 3 5/7 d per pound
new GoodDatum(goods.cheese, sources.med14, (4 + 1/2)*unit.lbtower/240 / (7*453.5924)); // 4 1/2 d per 7 lbs
new GoodDatum(goods.butter, sources.med14, (4 + 3/4)*unit.lbtower/240 / (7*453.5924));
// 2nd row
new GoodDatum(goods.wool, sources.med15, (3 + 5/7)*unit.lbtower/240 / 453.5924);
new GoodDatum(goods.cheese, sources.med15, 0.5*unit.lbtower/240 / 453.5924);
new GoodDatum(goods.butter, sources.med15, 1*unit.lbtower/240 / 453.5924);
new GoodDatum(goods.hops, sources.med15, (14*12 + 0.5)*unit.lbtower/240 / (100*453.5924)); // 1s 0.5d per cwt
// "The weight standard was changed to the Troy pound (373.242 g) in 1527 under Henry VIII,"
new GoodDatum(goods.wool, sources.med16, (7 + 1/2)*unit.lbt/240 / 453.5924);
new GoodDatum(goods.cheese, sources.med16, 1*unit.lbt/240 / 453.5924);
new GoodDatum(goods.butter, sources.med16, 3*unit.lbt/240 / 453.5924);
new GoodDatum(goods.hops, sources.med16, (26*12 + 8)*unit.lbt/240 / (100*453.5924));

// med13
new GoodDatum(goods.wine, sources.med14, 3*unit.lbtower/240 / unit.gal);
new GoodDatum(goods.ale, sources.med15, 0.75*unit.lbtower/240 / unit.gal);
new GoodDatum(goods.beer, sources.med16, 1*unit.lbtower/240 / unit.qt);
new GoodDatum(goods.pepper, sources.med13, 12*unit.lbtower/240 / 453.5924);
new GoodDatum(goods.saffron, sources.med14, 13.5*unit.lbtower/240 / 453.5924);
new GoodDatum(goods.cheese, sources.med13, (3*12 + 4)*unit.lbt/240 / (80*453.5924));

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