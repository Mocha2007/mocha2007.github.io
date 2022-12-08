/* exported plates */
/* global createSvgElement */

class Plate {
	constructor(o){
		/** @type {Plate} */
		this.parent = o.parent;
		/** @type {string} */
		this.title = o.title;
		/** @type {string} */
		this.imgSrc = o.imgSrc;
		/** @type {Plate[]} */
		this.children = [];
		Plate.plates.push(this);
	}
	get elem(){
		if (this.elem_cache)
			return this.elem_cache;
		const e = createSvgElement('rect');
		return this.elem_cache = e;
	}
	get id(){
		return Plate.plates.indexOf(this);
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
}
/** @type {Plate[]} */
Plate.plates = [];

const plates = {
	addChild(){
		const np = new Plate({parent: this.current});
		this.current.children.push(np);
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
	pan(dx = 0, dy = 0){
		// todo
	},
	/** @type {Plate} */
	root: undefined,
	setup(){
		this.current = this.root = new Plate({title: 'root'});
		console.info('Plates by Mocha loaded.');
		console.debug(this.current);
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
		x: 0,
		y: 0,
		zoom: 1,
	},
	zoom(delta){
		// todo
	},
};