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
			blockElem.setAttribute('transform', `translate(${x*mine.tileSize}, ${(y)*mine.tileSize})`);
			this.elem.appendChild(blockElem);
		}));
	}
}

const mine = {
	gen(){
		const w = new World(range(this.worldSettings.depth).map(y => range(this.worldSettings.width).map(x => {
			if (this.worldSettings.depth - 5 < y && (this.worldSettings.depth - y - 1)/5 < random.random())
				return Block.FromName('bedrock');
			if (3 < y)
				return Block.FromName('stone');
			if (0 < y)
				return Block.FromName('dirt');
			return Block.FromName('grass');
		})));
		['coal', 'copper_ore', 'tin_ore', 'iron_ore',
		'silver_ore', 'gold_ore', 'platinum_ore'].forEach((s, i) => {
			const veins = Math.ceil(50/(i+1));
			const veinSize = Math.ceil((8/(i+1)**0.5));
			console.log(`generating ${veins} ${veinSize}-block %c${s}%cveins (total: ${veins*veinSize})`,
				`background-color:grey;color: ${Block.FromName(s).color};text-shadow: 0 0 1vw black, 0 0 1vw black, 0 0 1vw black`);
			range(veins)
				.forEach(_ => w.createVein(
					Block.FromName(s),
					this.random.x,
					Math.floor(random.normal(16*(i+1), 16)),
					veinSize)
				);
		});
		return w;
	},
	init(){
		console.info('MoMine');
		// load block styling
		this.style = createSvgStyleSheet();
		Block.blocks.forEach(b => this.style.insertRule(`.b${b.name}{fill:${b.color}}`));
		// generate world
		const w = this.gen();
		console.log('World Generated.');
		w.reloadTiles();
		console.log('World Rendered.');
	},
	player: {
		x: 64,
		y: 64,
	},
	random: {
		get x(){
			return random.randint(0, mine.worldSettings.width-1);
		},
	},
	/** @type {CSSStyleSheet} */
	style: undefined,
	tileSize: 6,
	worldSettings: {
		depth: 64*2,
		width: 64,
	},
};