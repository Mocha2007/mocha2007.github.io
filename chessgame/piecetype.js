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
		const COLOR = board.getAt(coords).color;
		// todo
		// https://www.chessvariants.com/dictionary/BexNotation.pdf
		this.movement.betza.split(/(?<=[A-Z])/g).forEach(moveType => {
			const [modifiers, movement] = moveType.split(/(?=[A-Z])/g);
			// royalty... 
			const FLAG_ROYAL = modifiers.includes('y'); // todo
			// move types...
			const FLAG_CAPTURE = modifiers.includes('c') || !modifiers.includes('m');
			const FLAG_MOVE = modifiers.includes('m') || !modifiers.includes('c');
			// directions...
			const HAS_MOVEMENT_FLAGS = 'fblrvs'.split('').some(char => modifiers.includes(char))
			const FLAG_FORWARD = !HAS_MOVEMENT_FLAGS || modifiers.includes('f') || modifiers.includes('v');
			const FLAG_BACKWARD = !HAS_MOVEMENT_FLAGS || modifiers.includes('b') || modifiers.includes('v');
			const FLAG_LEFTWARD = !HAS_MOVEMENT_FLAGS || modifiers.includes('l') || modifiers.includes('s');
			const FLAG_RIGHTWARD = !HAS_MOVEMENT_FLAGS || modifiers.includes('r') || modifiers.includes('s');
			// is rider?
			const FLAG_BISHOPISH = 'BQ'.includes(movement);
			const FLAG_ROOKISH = 'RQ'.includes(movement);
			const FLAG_RIDER = FLAG_BISHOPISH || FLAG_ROOKISH;
			if (FLAG_RIDER) // goes in a continuous line
				[-1, 0, 1].forEach(dx => {
					// todo, may have to account for board orientation difference between black and white wrt left/rightness?
					if (dx === -1 && !FLAG_LEFTWARD)
						return;
					if (dx === 1 && !FLAG_RIGHTWARD)
						return;
					[-1, 0, 1].forEach(dy => {
						if (dy === -1 && !FLAG_BACKWARD)
							return;
						if (dy === 1 && !FLAG_FORWARD)
							return;
						if (!(dx || dy))
							return; // null move
						const IS_ORTHOGONAL = !(dx && dy);
						if ((IS_ORTHOGONAL && !FLAG_ROOKISH) || !(IS_ORTHOGONAL || FLAG_BISHOPISH))
							return; // invalid move type for this piece
						for (let i = 0; i < 7; i++){
							if (coords.file + i*dx < 0 || 7 < coords.file + i*dx || coords.rank + i*dy < 0 || 7 < coords.rank + i*dy)
								break; // move is off board!
							// okay so the move is valid I GUESS
							const COORDS = [coords.file + i*dx, coords.rank + i*dy];
							const TARGET = board.getAt(COORDS);
							if (TARGET){
								// block movement if same color,
								// otherwise, check capture flag,
								if (TARGET.color !== COLOR && FLAG_CAPTURE)
									o.push(new Coords(...COORDS));
								// then break
								break;
							}
							else if (FLAG_MOVE) // can move to this empty tile
								o.push(new Coords(...COORDS));
							else // lacks movement flag, and this would count as a move
								break;
						}
					})
				});
			// look leapward...
			else {
				const LEAP = PieceType.LEAPS[movement];
				[
					/* for a given leap L: each element x:
						x[0][0]*L[0] + x[0][1]*L[1] is the delta-x
						x[1][0]*L[0] + x[1][1]*L[1] is the delta-y
						(and thus, one of these must be 0, and the other must be 1 or -1)
					*/
					[[0, 1], [1, 0]], [[1, 0], [0, 1]],
					[[0, 1], [1, 0]], [[-1, 0], [0, -1]],
					[[0, -1], [-1, 0]], [[1, 0], [0, 1]],
					[[0, -1], [-1, 0]], [[-1, 0], [0, -1]],
				].forEach(coefficients => {
					const [[dx0, dx1], [dy0, dy1]] = coefficients;
					const [dx, dy] = [dx0 * LEAP[0] + dx1 * LEAP[1], dy0 * LEAP[0] + dy1 * LEAP[1]];
					// continue
					const COORDS = [coords.file + dx, coords.rank + dy];
					if (dx < 0 || 7 < dx || dy < 0 || 7 < dy)
						return; // invalid position
					const TARGET = board.getAt(COORDS);
					if (TARGET){
						// block movement if same color,
						// otherwise, check capture flag,
						if (TARGET.color !== COLOR && FLAG_CAPTURE)
							o.push(new Coords(...COORDS));
					}
					else if (FLAG_MOVE) // can move to this empty tile
						o.push(new Coords(...COORDS));
				});
			}
		});
		return o;
	}
	static PAWN = new PieceType('Pawn', '', '♙', '♟', MovementType.PAWN, ['pawn_double_move', 'promotes']);
	static KNIGHT = new PieceType('Knight', 'N', '♘', '♞', MovementType.KNIGHT);
	static BISHOP = new PieceType('Bishop', 'B', '♗', '♝', MovementType.BISHOP);
	static ROOK = new PieceType('Rook', 'R', '♖', '♜', MovementType.ROOK, ['castle_target']);
	static QUEEN = new PieceType('Queen', 'Q', '♕', '♛', MovementType.QUEEN);
	static KING = new PieceType('King', 'K', '♔', '♚', MovementType.KING, ['castle_source']);
	static LEAPS = {
		// todo
		'N': [1, 2],
	};
}
/** @type {PieceType[]} */
PieceType.list = [];

class MovementType {
	constructor(betza){
		this.betza = betza;
	}
	// https://en.wikipedia.org/wiki/Betza%27s_funny_notation
	static PAWN = new MovementType('fmWfcF'); // (m)oves (f)orward like a (W)azir, (c)aptures (f)orward like a (F)erz
	static KNIGHT = new MovementType('N');
	static BISHOP = new MovementType('B');
	static ROOK = new MovementType('R');
	static QUEEN = new MovementType('Q');
	static KING = new MovementType('yK'); // ro(y)al
}

class Board {
	/** @param {PieceInstance[][]} piece_array */
	constructor(piece_array){
		/** @type {PieceInstance[][]} */
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