/* exported  ObjectThumbnail */

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

class ObjectThumbnail {
	/** inherit this class to get pretty tables for this element!
	 * @param {string} name
	 * @param {string} thumbnailString
	 */
	constructor(name, thumbnailString){
		this.name = name;
		this.thumbnailString = thumbnailString
			? new ThumbnailElem(...thumbnailString) : ThumbnailElem.default;
	}
	get table(){
		const table = document.createElement('table');
		const header = document.createElement('tr');
		table.appendChild(header);
		const thKey = document.createElement('th');
		thKey.innerHTML = 'Key';
		header.appendChild(thKey);
		const thValue = document.createElement('th');
		thValue.innerHTML = 'Value';
		header.appendChild(thValue);
		// main
		Object.keys(this).forEach(key => {
			const tr = document.createElement('tr');
			table.appendChild(tr);
			const tdKey = document.createElement('td');
			tdKey.innerHTML = key;
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
		inner.innerHTML = this.name;
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