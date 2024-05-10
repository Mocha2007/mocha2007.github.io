/* exported */
/* global Color, Coords */

class PieceType {
	/**
	 * @param {string} name
	 * @param {string} abbr
	 * @param {string} white_emoji
	 * @param {string} black_emoji
	 * @param {MovementType} movement
	 */
	constructor(name, abbr, white_emoji, black_emoji, movement, flags = []){
		this.name = name || 'unknown';
		this.abbr = abbr || '?';
		this.white_emoji = white_emoji || '?';
		this.black_emoji = black_emoji || '?';
		/** @type {MovementType} */
		this.movement = movement;
		/** @type {string[]} */
		this.flags = flags;
		PieceType.list.push(this);
	}
	/** @param {Color} color */
	emoji(color){
		return color === Color.BLACK ? this.black_emoji : this.white_emoji;
	}
	/**
	 * @param {Coords} coords
	 * @param {Board} board
	 */
	getValidMoves(coords, board){
		/** @type {Coords[]} */
		const o = [];
		// todo
		return o;
	}
	static PAWN = new PieceType('Pawn', '', '♙', '♟', MovementType.PAWN, ['pawn_double_move', 'promotes']);
	static KNIGHT = new PieceType('Knight', 'N', '♘', '♞', MovementType.KNIGHT);
	static BISHOP = new PieceType('Bishop', 'B', '♗', '♝', MovementType.BISHOP);
	static ROOK = new PieceType('Rook', 'R', '♖', '♜', MovementType.ROOK, ['castle_target']);
	static QUEEN = new PieceType('Queen', 'Q', '♕', '♛', MovementType.QUEEN);
	static KING = new PieceType('King', 'K', '♔', '♚', MovementType.KING, ['royal', 'castle_source']);
}
/** @type {PieceType[]} */
PieceType.list = [];

class MovementType {
	constructor(betza){
		this.betza = betza;
	}
	// https://en.wikipedia.org/wiki/Betza%27s_funny_notation
	static PAWN = new MovementType('fmWfcF');
	static KNIGHT = new MovementType('N');
	static BISHOP = new MovementType('B');
	static ROOK = new MovementType('R');
	static QUEEN = new MovementType('Q');
	static KING = new MovementType('K');
}

class Board {
	/** @param {Piece[][]} piece_array */
	constructor(piece_array){
		/** @type {Piece[][]} */
		this.piece_array = piece_array;
	}
	/** @param {number[]} coords */
	getAt(coords){
		return this.piece_array[coords[0]][coords[1]];
	}
	static new(){
		const o = new Board([
			[],
			[],
			[],
			[],
			[],
			[],
			[],
			[],
		]);
		return o;
	}
}

class Game {
	constructor(){
		this.board = Board.new();
		this.turn = Color.WHITE;
	}
	next(){
		this.turn = this.turn === Color.WHITE ? Color.BLACK : Color.WHITE;
	}
}

class PieceInstance {
	/**
	 * @param {PieceType} type
	 * @param {Color} color
	 * @param {Coords} coords
	 * @param {Game} game
	 */
	constructor(type, color, coords, game){
		this.type = type;
		this.color = color;
		/** @type {Coords} */
		this.coords = coords;
		/** @type {Game} */
		this.game = game;
		this.id = 'piece_' + coords.file + '_' + coords.rank;
	}
	get abbr(){
		return this.type.abbr + this.color.name;
	}
	/** @type {HTMLSpanElement} */
	get element(){
		return document.getElementById(this.id);
	}
	get emoji(){
		return this.type.emoji(this.color);
	}
	get span(){
		const elem = document.createElement('span');
		elem.innerHTML = this.emoji;
		elem.title = this.color.name + ' ' + this.type.name;
		elem.id = this.id;
		elem.classList.add('piece');
		elem.onclick = () => this.showMoves();
		return elem;
	}
	/** @param {[number, number]} coords */
	hideMoveButton(coords){
		const elem = document.createElement('div');
		elem.classList.add('move');
		elem.style.marginLeft = (coords.file+1)/9 * 100 + 'vw';
		elem.style.marginTop = (coords.rank+1)/9 * 100 + 'vh';
		elem.title = 'Cancel move';
		elem.onclick = () => PieceInstance.hideMoves();
		elem.innerHTML = '❌';
		return elem;
	}
	/** move this piece to specified coords
	 * @param {Coords} coords
	*/
	move(coords){
		// update piece coords
		this.coords = coords;
		// move element
		/** @type {HTMLDivElement} */
		const destinationElement = document.getElementById(coords.notation);
		destinationElement.appendChild(this.element);
		// hide moves
		PieceInstance.hideMoves();
		// swap player
		this.game.next();
	}
	/** @param {Coords} coords */
	moveButton(coords){
		const elem = document.createElement('div');
		elem.classList.add('move');
		elem.style.marginLeft = (coords.file+1)/9 * 100 + 'vw';
		elem.style.marginTop = (coords.rank+1)/9 * 100 + 'vh';
		elem.title = 'Move ' + this.type + ' to ' + coords.notation;
		elem.onclick = () => this.move(coords);
		return elem;
	}
	showMoves(){
		if (this.game.turn !== this.color)
			return; // not your turn!
		// hide moves in case two pieces are selected...
		PieceInstance.hideMoves();
		const root = document.body;
		// button to hide moves
		root.appendChild(this.hideMoveButton(this.coords));
		// show each move, onclick = perform move
		this.moveList.forEach(m => root.appendChild(this.moveButton(m)));
	}
	static hideMoves(){
		Array.from(document.getElementsByClassName('move')).forEach(e => e.remove());
	}
}