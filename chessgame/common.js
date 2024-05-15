/* exported Color, Coords, Icon, MovementType */

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
	// fairy
	static FERZ = new MovementType('F');
	static WAZIR = new MovementType('W');
	static MANN = new MovementType('K');
	static AMAZON = new MovementType('QN');
}

class Icon {
	/**
	 * @param {string} type 
	 * @param {*} data a character if "char"; else {white, black} if '32' else {dl, dd, ll, ld} if '24'
	 */
	constructor(type, data){
		this.type = type;
		this.data = data;
	}
	/**
	 * @param {Color} color color of the piece
	 * @param {Color} bg color of the square
	 */
	elem(color, bg){
		switch (this.type){
			case '24':
				return this._24(color, bg);
			case '32':
				return this._32(color);
			case 'char':
				return this.char(color);
			default:
				throw new Error('invalid Icon.type');
		}
	}
	/**
	 * @param {Color} color color of the piece
	 * @param {Color} bg color of the square
	 */
	_24(color, bg){
		const e = document.createElement('img');
		e.src = this.data[`${color === Color.WHITE ? 'l' : 'd'}${bg === Color.WHITE ? 'l' : 'd'}`];
		e.classList.add('piece_icon');
		return e;
	}
	/** @param {Color} color color of the piece */
	_32(color){
		const e = document.createElement('img');
		e.src = this.data[color === Color.WHITE ? 'white' : 'black'];
		e.classList.add('piece_icon');
		return e;
	}
	/** @param {Color} color color of the piece */
	char(color){
		const e = document.createElement('span');
		e.innerHTML = this.data[color === Color.WHITE ? 'white' : 'black'];
		e.classList.add('piece_icon');
		return e;
	}
	// std icons
	static PAWN = new Icon('char', {black: '♟', white: '♙'});
	static KNIGHT = new Icon('char', {black: '♞', white: '♘'});
	static BISHOP = new Icon('char', {black: '♝', white: '♗'});
	static ROOK = new Icon('char', {black: '♜', white: '♖'});
	static QUEEN = new Icon('char', {black: '♛', white: '♕'});
	static KING = new Icon('char', {black: '♚', white: '♔'});
}