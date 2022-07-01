/* exported Item */
/* global itemData, ObjectThumbnail */

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
	// static methods
	static parse(){
		itemData.forEach(obj => {
			obj;
			// todo
			// this.bodyparts.push(new Bodypart(obj.name, obj.icon, obj.validProperties));
		});
		console.log('Items successfully parsed');
	}
}
/** @type {Item[]} */
Item.items = [];
Item.parse();