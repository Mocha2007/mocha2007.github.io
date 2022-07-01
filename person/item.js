/* exported Item */
/* global ObjectThumbnail */

class Item extends ObjectThumbnail {
	/**
	 * @param {string} name
	 * @param {string} icon
	 * @param {string} desc
	 * @param {*} properties todo
	 */
	constructor(name, icon, desc, properties){
		super(name, icon);
		/** @type {string} */
		this.desc = desc;
		this.properties = properties;
		Item.items.push(this);
	}
	/** @type {Item[]} */
	static items = [];
}