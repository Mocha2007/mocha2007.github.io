/* exported Color, Coords */

class Color {
	constructor(id, name){
		this.id = id;
		this.name = name;
	}
	/** rank direction of pawns (ie., where is "forward"?) */
	get direction(){
		return this.id ? -1 : 1;
	}
	static BLACK = new Color(0, 'Black');
	static WHITE = new Color(1, 'White');
}

class Coords {
	constructor(file, rank){
		/** @type {number} */
		this.file = file;
		/** @type {number} */
		this.rank = rank;
	}
	get notation(){
		return ' abcdefgh'[this.file] + (rank + 1);
	}
}