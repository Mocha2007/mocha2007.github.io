/* exported Color, Coords */

class Color {
	constructor(id, name){
		this.id = id;
		this.name = name;
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