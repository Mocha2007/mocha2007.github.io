
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
	cheese: new Good('Cheese'),
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
	incense: new Good('Incense'),
	pepper: new Good('Black Pepper'),
	saffron: new Good('Saffron'),
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
};

new GoodDatum(goods.pork, sources.rome0, 12/20/300); // 12 denarii for 300g
new GoodDatum(goods.beef, sources.rome0, 8/20/300);
new GoodDatum(goods.boarMeat, sources.rome0, 16/20/300);
new GoodDatum(goods.fishSaltwater, sources.rome0, 24/20/300);
new GoodDatum(goods.fishFreshwater, sources.rome0, 8/20/300);
new GoodDatum(goods.fishSalted, sources.rome0, 6/20/300);
new GoodDatum(goods.cheese, sources.rome0, 12/20/300);
new GoodDatum(goods.fishSardines, sources.rome0, 16/20/300);
new GoodDatum(goods.figs, sources.rome0, 4/20/300);
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