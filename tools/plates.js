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
	get string(){
		return `<[${this.id}] "${this.title}">`;
	}
}
/** @type {Plate[]} */
Plate.plates = [];

const plates = {
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
			return document.getElementById('parentButton');
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
		this.elem.parent.innerHTML = this.current.string;
		this.elem.title.value = this.current.title;
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