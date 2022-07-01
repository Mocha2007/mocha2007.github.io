

const icons = {
	data: ['📝'],
	person: ['🧑'],
	unknown: ['❓'],
};

function getArraySpan(obj){
	const span = document.createElement('span');
	span.classList.add('array');
	obj.forEach((e, i) => {
		if (0 < i)
			span.appendChild(spacer());
		span.appendChild(getTableOrSpan(e));
	});
	return span;
}

/** if obj has table prop, use that, otherwise create span
 * @returns {HTMLTableElement|HTMLSpanElement}
*/
function getTableOrSpan(obj){
	// try to give the thumbnail
	if (obj instanceof ObjectThumbnail)
		return obj.thumbnail;
	if (Array.isArray(obj))
		return getArraySpan(obj);
	if (typeof obj === "string" || obj instanceof String || obj === undefined){}
		// https://stackoverflow.com/a/24844091/2579798
		// empty block because I need it to fall below object BUT I need to check it before
	else if (Object.keys(obj).length) // normal js object
		return kvpTable(obj);
	const span = document.createElement('span');
	span.innerHTML = obj;
	return span;
}

/** generates pretty tables based on key value pairs of objects */
function kvpTable(obj){
	const table = document.createElement('table');
	table.classList.add('kvpTable');
	const header = document.createElement('tr');
	table.appendChild(header);
	const headerKey = document.createElement('th');
	headerKey.innerHTML = 'Key';
	header.appendChild(headerKey);
	const headerValue = document.createElement('th');
	headerValue.innerHTML = 'Value';
	header.appendChild(headerValue);
	// main
	for (let key in obj){
		const tr = document.createElement('tr');
		const tdKey = document.createElement('td');
		tdKey.classList.add('kvpKey');
		tdKey.innerHTML = key;
		tr.appendChild(tdKey)
		// value
		const value = obj[key];
		const tdValue = document.createElement('td');
		tdValue.appendChild(getTableOrSpan(value));
		tr.appendChild(tdValue);
		table.appendChild(tr);
	}
	return table;
}

function spacer(){
	const spacer = document.createElement('span');
	spacer.classList.add('spacer');
	return spacer;
}

class ObjectThumbnail {
	/** 
	 * @param {string} name 
	 * @param {string} thumbnailElem
	 */
	constructor(name, thumbnailElem){
		this.name = name;
		this.thumbnailElem = thumbnailElem ? new ThumbnailElem(...thumbnailElem) : ThumbnailElem.default;
	}
	get thumbnail(){
		const span = document.createElement('span');
		span.classList.add('button', 'thumbnail');
		span.onclick = () => this.showTable();
		span.obj = this;
		span.appendChild(this.thumbnailElem.elem);
		span.appendChild(spacer());
		const inner = document.createElement('span');
		inner.innerHTML = this.name;
		span.appendChild(inner)
		return span;
	}
	showTable(){
		// edit history
		history.go(this);
	}
}

class ThumbnailElem {
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
	static default = new ThumbnailElem(...icons.unknown);
}