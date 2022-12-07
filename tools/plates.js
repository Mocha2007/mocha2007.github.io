/* exported plates */

class Plate {
	constructor(o){
		/** @type {Plate} */
		this.parent = o.parent;
		/** @type {string} */
		this.title = o.title;
		/** @type {Plate[]} */
		this.children = [];
		Plate.plates.push(this);
	}
}
/** @type {Plate[]} */
Plate.plates = [];

const plates = {
	/** @type {Plate} */
	root: undefined,
	setup(){
		this.root = new Plate({title: 'root'});
	},
};