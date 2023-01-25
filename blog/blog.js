/* exported blog */

/** @param {Date} d */
function formatDate(d){
	// 2011-11-18T14:54:39.929-0400
	// eslint-disable-next-line max-len
	return `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}T${d.getUTCHours()}:${d.getUTCMinutes()}:${d.getUTCSeconds()}Z`;
}

class Blogpost {
	/**
	 * @param {string} title
	 * @param {Date} date
	 * @param {Tag[]} tags
	 * @param {Section[]} sections
	 */
	constructor(title, date, tags, sections){
		this.title = title;
		this.date = date;
		this.tags = tags;
		this.sections = sections;
	}
	get elem(){
		const div = document.createElement('div');
		const h = document.createElement('h2');
		h.innerHTML = this.title;
		div.appendChild(h);
		const date = document.createElement('time');
		date.dateTime = formatDate(this.date);
		div.appendChild(Tag.tagList(this.tags));
		this.sections.forEach(s => div.appendChild(s.elem));
		return div;
	}
	/** @param {string} s */
	static parse(s){
		// todo
	}
}

class Tag {
	/** @param {string} name */
	constructor(name){
		this.name = name;
	}
	get elem(){
		const e = document.createElement('span');
		e.classList.add('tag');
		// e.onclick = () =>
		e.innerHTML = this.name;
		return e;
	}
	/** @param {Tag[]} tags */
	static tagList(tags){
		const span = document.createElement('span');
		span.classList.add('tagList');
		span.innerHTML = 'Tags: ';
		tags.forEach(t => span.appendChild(t.innerHTML));
		return span;
	}
}

class Section {
	/**
	 * @param {Tag[]} tags
	 * @param {string} innerHTML
	 */
	constructor(tags, innerHTML){
		this.tags = tags;
		this.innerHTML = innerHTML;
	}
	get elem(){
		const div = document.createElement('div');
		div.appendChild(Tag.tagList(this.tags));
		const p = document.createElement('p');
		p.innerHTML = this.innerHTML;
		div.appendChild(p);
		return div;
	}
}

const blog = {
	init(){
		// todo
	},
};