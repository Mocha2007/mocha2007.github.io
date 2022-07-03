/* global Game */
/* exported ObjectThumbnail */

const icons = {
	data: ['📝'],
	person: ['🧑'],
	unknown: ['❓'],
};

function spacer(){
	const s = document.createElement('span');
	s.classList.add('spacer');
	return s;
}

/**
 * @param {string} s
 * @param {() => *} action
 */
function button(s, action){
	const elem = document.createElement('div');
	elem.classList.add('button');
	elem.innerHTML = s;
	elem.onclick = action;
	return elem;
}

class GameWindow {
	/** @param {HTMLElement} inner */
	constructor(inner){
		/** @type {HTMLElement} */
		this.inner = inner;
		GameWindow.active.push(this);
	}
	get elem(){
		return this._elemCache ? this._elemCache : this._elemCache = this.outer();
	}
	close(){
		const i = GameWindow.active.indexOf(this);
		GameWindow.active.splice(i, 1);
		this.elem.remove();
	}
	createXBox(){
		const xBox = button('X', () => this.close());
		xBox.classList.add('xbox');
		return xBox;
	}
	outer(){
		const outer = document.createElement('div');
		outer.classList.add('window');
		// top bar
		const topbar = document.createElement('div');
		topbar.classList.add('topbar');
		topbar.appendChild(this.createXBox());
		outer.appendChild(topbar);
		outer.appendChild(this.inner);
		return outer;
	}
	setDimensions(x = 0, y = 0, width = 10, height = 10){
		this.elem.style.left = `${x}vw`;
		this.elem.style.top = `${y}vh`;
		this.elem.style.width = `${width}vw`;
		this.elem.style.height = `${height}vh`;
	}
	static get activeWindow(){
		return this.active[this.active.length-1];
	}
	/** @param {string} s - text to display as a notification */
	static popup(s){
		const div = document.createElement('div');
		const span = document.createElement('span');
		span.innerHTML = s;
		div.appendChild(span);
		const popup = new GameWindow(div);
		const ok = button('OK', () => popup.close());
		ok.classList.add('promptbutton');
		div.appendChild(ok);
		GameWindow.root.inner.appendChild(popup.elem);
	}
}
/** @type {HTMLDivElement[]} */
GameWindow.active = [];

class ObjectThumbnail {
	/** inherit this class to get pretty tables for this element!
	 * @param {string} name
	 * @param {string} desc
	 * @param {string} thumbnailString
	 */
	constructor(name, desc, thumbnailString){
		this.name = name;
		this.desc = desc; // todo unused
		/** @type {ThumbnailElem} */
		this.thumbnailString = thumbnailString
			? new ThumbnailElem(...thumbnailString) : ThumbnailElem.default;
	}
	get table(){
		const table = document.createElement('table');
		const header = document.createElement('tr');
		table.appendChild(header);
		const thKey = document.createElement('th');
		thKey.innerHTML = Game.localization.key;
		header.appendChild(thKey);
		const thValue = document.createElement('th');
		thValue.innerHTML = Game.localization.value;
		header.appendChild(thValue);
		// main
		Object.keys(this).forEach(key => {
			const tr = document.createElement('tr');
			table.appendChild(tr);
			const tdKey = document.createElement('td');
			tdKey.innerHTML = Game.localization[key];
			tr.appendChild(tdKey);
			const tdValue = document.createElement('td');
			const value = this[key];
			if (value instanceof ObjectThumbnail)
				tdValue.appendChild(value.thumbnail);
			else
				tdValue.appendChild(value);
			tr.appendChild(tdValue);
		});
		return table;
	}
	get thumbnail(){
		const span = document.createElement('span');
		span.classList.add('button', 'thumbnail');
		// span.onclick = this.showTable;
		span.obj = this;
		span.appendChild(this.thumbnailElem.elem);
		span.appendChild(spacer());
		const inner = document.createElement('span');
		inner.innerHTML = Game.localization[this.name];
		span.appendChild(inner);
		return span;
	}
}

class ThumbnailElem {
	/** generates icons for thumbnails */
	constructor(s = '', isURL = false){
		this.s = s;
		this.isURL = isURL;
	}
	get elem(){
		if (this.isURL){
			const img = document.createElement('img');
			img.src = this.s;
			img.classList.add('thumbnail');
			return img;
		}
		const span = document.createElement('span');
		span.innerHTML = this.s;
		return span;
	}
}
ThumbnailElem.default = new ThumbnailElem(...icons.unknown);