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
		return ' abcdefgh'[this.file + 1] + (this.rank + 1);
	}
	get isValid(){
		return 0 <= this.file && this.file <= 7 && 0 <= this.rank && this.rank <= 7;
	}
	static fromNotation(s){
		const x = colString.indexOf(s[0])-1;
		const y = parseInt(s[1])-1;
		return new Coords(x, y);
	}
}

class MovementType {
	constructor(betza, flags = []){
		this.betza = betza;
		this.flags = flags;
	}
	// https://en.wikipedia.org/wiki/Betza%27s_funny_notation
	static PAWN = new MovementType('fmWfcF', ['double_pawn_move', 'changes_gender']); // (m)oves (f)orward like a (W)azir, (c)aptures (f)orward like a (F)erz
	static KNIGHT = new MovementType('N');
	static BISHOP = new MovementType('B');
	static ROOK = new MovementType('R', ['castle_target']);
	static QUEEN = new MovementType('Q');
	static KING = new MovementType('yK', ['castle_source']); // ro(y)al
}