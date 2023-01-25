/* exported blog */

class Blogpost {
	/**
	 * @param {string} title
	 * @param {Date} date
	 * @param {Tag[]} tags
	 * @param {string} innerHTML
	 */
	constructor(title, date, tags, innerHTML){
		this.title = title;
		this.date = date;
		this.tags = tags;
		this.innerHTML = innerHTML;
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
}

const blog = {
	init(){
		// todo
	},
};