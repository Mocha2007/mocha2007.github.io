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
		rect.classList.add(`b${this.name}`);
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
	get elem(){
		if (!this._elem){
			const g = createSvgElement('g');
			g.id = 'world';
			document.getElementById('canvas').appendChild(g);
			this._elem = g;
		}
		return this._elem;
	}
	/**
	 * @param {Block} ore 
	 * @param {number} x 
	 * @param {number} y 
	 * @param {number} max_size 
	 */
	createVein(ore, x, y, max_size = 8){
		// console.info(`creating ${max_size}-block ${ore.name} vein`);
		range(max_size).forEach(_ => {
			try {
				if (this.data[y][x].name === 'stone')
				this.data[y][x] = ore;
				// console.warn(`could not place ${ore.name} @ (${x}, ${y})`);
			}
			catch (_){}
			x += random.randint(-1, 1);
			y += random.randint(-1, 1);
		});
	}
	reloadTiles(){
		this.elem.innerHTML = '';
		this.data.forEach((r, y) => r.forEach((b, x) => {
			const blockElem = b.elem;
			blockElem.classList.add(`x${x}`);
			blockElem.classList.add(`y${y}`);
			blockElem.setAttribute('transform', `translate(${x*mine.tileSize}, ${(mine.worldSettings.height-y)*mine.tileSize})`);
			this.elem.appendChild(blockElem);
		}));
	}
}

const mine = {
	gen(){
		const w = new World(range(this.worldSettings.height).map(y => range(this.worldSettings.width).map(x => {
			if (y < 5 && y/5 < random.random())
				return Block.FromName('bedrock');
			if (y < this.worldSettings.height-4)
				return Block.FromName('stone');
			if (y < this.worldSettings.height-1)
				return Block.FromName('dirt');
			if (y < this.worldSettings.height)
				return Block.FromName('grass');
		})));
		range(50).forEach(_ => w.createVein(
			Block.FromName('coal'),
			random.randint(0, this.worldSettings.width-1),
			Math.floor(random.normal(48, 16)),
			8));
		range(25).forEach(_ => w.createVein(
			Block.FromName('iron_ore'),
			random.randint(0, this.worldSettings.width-1),
			Math.floor(random.normal(16, 16)),
			4));
		return w;
	},
	init(){
		console.info('MoMine');
		const w = this.gen();
		console.info('World Generated.');
		w.reloadTiles();
		console.info('World Rendered.');
	},
	player: {
		x: 64,
		y: 64,
	},
	tileSize: 12,
	worldSettings: {
		height: 64,
		width: 128,
	},
};