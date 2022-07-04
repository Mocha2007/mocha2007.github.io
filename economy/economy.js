/* exported BuildingAmount */
/* global ObjectThumbnail, sum */

class Good extends ObjectThumbnail {
	constructor(data){
		super(data.name, data.desc, data.icon);
		this.rawObject = data; // for debugging
		/** @type {string[]} */
		this.categories = data.categories;
		Good.goods.push(this);
	}
	static fromString(s){
		return this.goods.find(g => g.name === s);
	}
	static parse(goodData){
		goodData.forEach(good => new Good(good));
		console.log(`Parsed ${this.goods.length} goods.`);
	}
}
/** @type {Good[]} */
Good.goods = [];

class GoodAmount extends ObjectThumbnail {
	/**
	 * a physical manifestation of a good - used in prices and player inventory
	 * @param {Good} good
	 * @param {number} amount in kg
	 * @param {number} time (optional) in seconds
	 */
	constructor(good, amount, time = 0){
		super(`${good.name} (${amount} kg)`);
		this.amount = amount;
		this.time = time;
	}
	static parseObject(o){
		return new GoodAmount(Good.fromString(o.id), o.amount, o.time);
	}
}

class Building extends ObjectThumbnail {
	// buildings have:
	// (1) an initial, one-time resource cost (ie. construction materials)
	// (2) a lifetime "resource lock" (ie. it reserves resources, like land,
	//     machinery, and workers, but never consumes them; they're refunded on destruction)
	// (3) ongoing costs
	// (4) storage (by default, 1d worth of input goods + 1d word of output goods)
	constructor(data){
		super(data.name, data.desc, data.icon);
		this.rawObject = data; //for debugging
		/** @type {GoodAmount[]} */
		this.costBuild = data.costBuild.map(GoodAmount.parseObject);
		/** @type {GoodAmount[]} */
		this.costBuildLock = data.costBuildLock.map(GoodAmount.parseObject);
		/** @type {GoodAmount[]} */
		this.costOngoing = data.costOngoing.map(GoodAmount.parseObject);
		/** @type {GoodAmount[]} */
		this.produces = data.produces.map(GoodAmount.parseObject);
		/** @type {number} in kg */
		this.storage = data.storage ? data.storage
			: sum(this.costOngoing.map(ga => ga.amount)) + sum(this.produces.map(ga => ga.amount));
		Building.buildings.push(this);
	}
	static fromString(s){
		return this.buildings.find(b => b.name === s);
	}
	static parse(buildingData){
		buildingData.forEach(building => new Building(building));
		console.log(`Parsed ${this.buildings.length} buildings.`);
	}
}
/** @type {Building[]} */
Building.buildings = [];

class BuildingAmount extends ObjectThumbnail {
	/**
	 * a physical manifestation of a building type - used in player inventories
	 * @param {Building} building
	 * @param {number} amount
	 */
	constructor(building, amount){
		super(`${amount} ${building}s`);
	}
	static parseObject(o){
		return new BuildingAmount(Building.fromString(o.id), o.amount);
	}
}