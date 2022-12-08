/* exported plates */
/* global createSvgElement */

class Plate {
	constructor(o){
		/** @type {Plate} */
		this.parent = o.parent;
		/** @type {string} */
		this.title = o.title;
		/** @type {string} */
		this._imgSrc = o.imgSrc;
		/** @type {Plate[]} */
		this.children = o.children ? o.children.map(q => new Plate(q)) : [];
		this.x = o.x || 0;
		this.y = o.y || 0;
		this.w = o.w || 0;
		this.h = o.h || 0;
		Plate.plates.push(this);
	}
	get elem(){
		if (this.elem_cache)
			return this.elem_cache;
		const e = createSvgElement('g');
		e.setAttribute('transform', `translate(${this.x}, ${this.y})`);
		const border = createSvgElement('rect');
		border.setAttribute('height', this.h);
		border.setAttribute('width', this.w);
		e.appendChild(border);
		const image = createSvgElement('image');
		image.setAttribute('href', this.imgSrc);
		image.setAttribute('height', this.h);
		image.setAttribute('width', this.w);
		e.appendChild(image);
		return this.elem_cache = e;
	}
	get export(){
		return {
			parent: this.parent,
			title: this.title,
			imgSrc: this._imgSrc,
			children: this.children.map(child => child.export),
			x: this.x,
			y: this.y,
			w: this.w,
			h: this.h,
		};
	}
	get id(){
		return Plate.plates.indexOf(this);
	}
	get imgSrc(){
		return this._imgSrc;
	}
	/** @param {string} x */
	set imgSrc(x){
		this._imgSrc = x;
		this.elem.children[1].setAttribute('href', x);
	}
	get link(){
		const button = document.createElement('button');
		button.id = 'parentButton';
		button.onclick = () => plates.current = this;
		button.innerHTML = this.string;
		return button;
	}
	get string(){
		return `<[${this.id}] "${this.title}">`;
	}
	move(dx = 0, dy = 0){
		const ratio = plates.window.size / 10;
		this.x += dx * ratio;
		this.y += dy * ratio;
		this.elem.setAttribute('transform', `translate(${this.x}, ${this.y})`);
	}
}
/** @type {Plate[]} */
Plate.plates = [];

const plates = {
	addChild(){
		const np = new Plate({
			parent: this.current,
			// x: this.window.x,
			// y: this.window.y,
			w: this.window.size,
			h: this.window.size,
		});
		this.current.children.push(np);
		this.current.elem.appendChild(np.elem);
		this.current = np;
	},
	/** @type {Plate} */
	_current: undefined,
	get current(){
		return this._current;
	},
	/** @param {Plate} x */
	set current(x){
		// deselect
		const old = this._current;
		if (old)
			old.elem.classList.remove('selected');
		// select
		this._current = x;
		this.updateDisplay();
	},
	elem: {
		/** @returns {HTMLUListElement} */
		get children(){
			return document.getElementById('children');
		},
		/** @returns {HTMLSpanElement} */
		get id(){
			return document.getElementById('id');
		},
		/** @returns {HTMLInputElement} */
		get imgSrc(){
			return document.getElementById('img_src');
		},
		/** @returns {HTMLButtonElement} */
		get parent(){
			return document.getElementById('parent');
		},
		/** @returns {HTMLInputElement} */
		get title(){
			return document.getElementById('title');
		},
	},
	export(){
		const text = JSON.stringify(this.root.export);
		navigator.clipboard.writeText(text)
			.then(() => alert('Copied!'), () => alert('Could not copy...'));
	},
	import(){
		document.getElementById('plates').innerHTML = '';
		this.current = this.root = new Plate(JSON.parse(prompt('Paste code here:')));
		document.getElementById('plates').appendChild(this.current.elem);
	},
	pan(dx = 0, dy = 0){
		const ratio = this.window.size / 10;
		this.window.x += dx * ratio;
		this.window.y += dy * ratio;
		this.zoom();
	},
	/** @type {Plate} */
	root: undefined,
	setup(){
		this.zoom();
		this.current = this.root = new Plate({
			title: 'root',
			imgSrc: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Blue_Marble_2002.png/1024px-Blue_Marble_2002.png',
			w: this.window.size,
			h: this.window.size,
		});
		document.getElementById('plates').appendChild(this.current.elem);
		console.info('Plates by Mocha loaded.');
		// console.debug(this.current);
	},
	updateDisplay(){
		this.current.elem.classList.add('selected');
		this.elem.id.innerHTML = this.current.id;
		this.elem.imgSrc.value = this.current.imgSrc;
		// parent link
		this.elem.parent.innerHTML = '';
		if (this.current.parent)
			this.elem.parent.appendChild(this.current.parent.link);
		else
			this.elem.parent.innerHTML = 'None';
		// title
		this.elem.title.value = this.current.title;
		// child list
		this.elem.children.innerHTML = '';
		this.current.children.forEach(child => {
			const li = document.createElement('li');
			li.appendChild(child.link);
			this.elem.children.appendChild(li);
		});
	},
	window: {
		size: 1000,
		x: 0,
		y: 0,
	},
	zoom(delta = 0){
		this.window.size /= Math.pow(2, delta);
		// compensate for zoom
		if (delta === 1){
			this.window.x += this.window.size / 2;
			this.window.y += this.window.size / 2;
		}
		else if (delta === -1){
			this.window.x -= this.window.size / 4;
			this.window.y -= this.window.size / 4;
		}
		const vb = `${this.window.x} ${this.window.y} ${this.window.size} ${this.window.size}`;
		console.info('viewBox =>', vb);
		// reset
		document.getElementById('plates').setAttribute('viewBox', vb);
	},
};