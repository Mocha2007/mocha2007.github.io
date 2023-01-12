// yes, that's right, I'm making another crappy mc/terraria clone

class Block {
	/**
	 * @param {string} name
	 * @param {string} color
	 */
	constructor(name, color){
		this.name = name;
		this.color = color;
		Block.blocks.push(this);
	}
	get elem(){
		const rect = createSvgElement('rect');
		rect.setAttribute('height', mine.tileSize);
		rect.setAttribute('width', mine.tileSize);
		rect.setAttribute('fill', this.color);
		return rect;
	}
	/** @type {Block[]} */
	static blocks = [];
	/** @param {string} s */
	static FromName(s){
		return this.blocks.find(b => b.name === s);
	}
}

class Item {
	/**
	 * @param {string} name
	 */
	constructor(name){
		this.name = name;
		Item.items.push(this);
	}
	/** @type {Item[]} */
	static items = [];
}

class World {
	/** @param {Block[][]} data */
	constructor(data){
		this.data = data;
	}
}

const mine = {
	gen(){
		return new World(range(this.worldSettings.height).map(y => range(this.worldSettings.width).map(x => {
			if (y < 5 && y/5 < random.random())
				return Block.FromName('bedrock');
			if (y < 60)
				return Block.FromName('stone')
			if (y < 63)
				return Block.FromName('dirt')
			return Block.FromName('grass');
		})));
	},
	init(){
		console.info('MoMine');
		this.gen();
		console.info('World Generated.');
		// todo
	},
	player: {
		x: 0,
		y: 64,
	},
	tileSize: 32,
	worldSettings: {
		height: 64,
		width: 128,
	},
};