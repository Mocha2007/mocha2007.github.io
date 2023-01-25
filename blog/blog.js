/* exported blog */

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
		const span = document.createElement('span');
		span.innerHTML = 'Tags: ';
		this.tags.forEach(t => span.appendChild(t.innerHTML));
		div.appendChild(span);
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