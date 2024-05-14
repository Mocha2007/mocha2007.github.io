/* exported */
/* global Color, Coords, MovementType */

class PieceType {
	/**
	 * @param {string} name
	 * @param {string} abbr
	 * @param {number} value
	 * @param {string} white_emoji
	 * @param {string} black_emoji
	 * @param {MovementType} movement
	 */
	constructor(name, abbr, value, white_emoji, black_emoji, movement, flags = []){
		this.name = name || 'unknown';
		this.abbr = abbr || '?';
		this.value = value;
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
		const PIECE = board.getAt(coords);
		const COLOR = PIECE.color;
		// todo
		// https://www.chessvariants.com/dictionary/BexNotation.pdf
		this.movement.betza.split(/(?<=[A-Z])/g).forEach(moveType => {
			if (!moveType)
				return; // blank ... not sure if this is necessary but better safe than sorry.
			// need this ternary operator because if it's just eg. 'N' it thinks 'N' is the modifier...
			const [modifiers, movement] = moveType.length === 1 ? ['', moveType] : moveType.split(/(?=[A-Z])/g);
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
					// have to account for board orientation difference between black and white wrt left/rightness?
					// shouldn't matter for most standard pieces anyways I think...
					if (dx === 1 * COLOR.direction && !FLAG_LEFTWARD)
						return;
					if (dx === -1 * COLOR.direction && !FLAG_RIGHTWARD)
						return;
					[-1, 0, 1].forEach(dy => {
						if (dy === 1 * COLOR.direction && !FLAG_BACKWARD)
							return;
						if (dy === -1 * COLOR.direction && !FLAG_FORWARD)
							return;
						if (!(dx || dy))
							return; // null move
						const IS_ORTHOGONAL = !(dx && dy);
						if ((IS_ORTHOGONAL && !FLAG_ROOKISH) || !(IS_ORTHOGONAL || FLAG_BISHOPISH))
							return; // invalid move type for this piece
						for (let i = 1; i < 7; i++){
							const COORDS = new Coords(coords.file + i*dx, coords.rank + i*dy);
							if (!COORDS.isValid)
								break; // move is off board!
							// okay so the move is valid I GUESS
							const TARGET = board.getAt(COORDS);
							if (TARGET){
								// block movement if same color,
								// otherwise, check capture flag,
								if (TARGET.color !== COLOR && FLAG_CAPTURE)
									o.push(COORDS);
								// then break
								break;
							}
							else if (FLAG_MOVE) // can move to this empty tile
								o.push(COORDS);
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
					[[0, 1], [-1, 0]], [[1, 0], [0, -1]],
					[[0, -1], [1, 0]], [[-1, 0], [0, 1]],
					[[0, -1], [-1, 0]], [[-1, 0], [0, -1]],
				].forEach(coefficients => {
					const [[dx0, dx1], [dy0, dy1]] = coefficients;
					const [dx, dy] = [dx0 * LEAP[0] + dx1 * LEAP[1], dy0 * LEAP[0] + dy1 * LEAP[1]];
					// continue
					const COORDS = new Coords(coords.file + dx, coords.rank + dy);
					if (!COORDS.isValid)
						return; // invalid position
					const TARGET = board.getAt(COORDS);
					if (TARGET){
						// block movement if same color,
						// otherwise, check capture flag,
						if (TARGET.color !== COLOR && FLAG_CAPTURE)
							o.push(COORDS);
					}
					else if (FLAG_MOVE) // can move to this empty tile
						o.push(COORDS);
				});
			}
		});
		// SPECIAL MOVES
		if (!PIECE.hasMoved && this.movement.flags.includes('double_pawn_move')){
			// todo double pawn first move
		}
		// todo en passant
		// todo castling
		// todo promotion
		return o;
	}
	/** @type {PieceType[]} */
	static list = [];
	static PAWN = new PieceType('Pawn', ' ', 1, '♙', '♟', MovementType.PAWN);
	static KNIGHT = new PieceType('Knight', 'N', 3, '♘', '♞', MovementType.KNIGHT);
	static BISHOP = new PieceType('Bishop', 'B', 3, '♗', '♝', MovementType.BISHOP);
	static ROOK = new PieceType('Rook', 'R', 5, '♖', '♜', MovementType.ROOK);
	static QUEEN = new PieceType('Queen', 'Q', 9, '♕', '♛', MovementType.QUEEN);
	static KING = new PieceType('King', 'K', Infinity, '♔', '♚', MovementType.KING);
	static LEAPS = {
		// todo
		'F': [1, 1],
		'N': [1, 2],
		'W': [0, 1],
	};
}

class Board {
	/**
	 * @param {Game} game 
	 * @param {PieceInstance[][]} piece_array 
	 */
	constructor(game, piece_array){
		/** @type {Game} */
		this.game = game;
		/** @type {PieceInstance[][]} */
		this.piece_array = piece_array;
	}
	/** @param {Coords} coords */
	getAt(coords){
		return this.piece_array[coords.file] && this.piece_array[coords.file][coords.rank];
	}
	/** @param {Game} game */
	static new(game){
		const a = [
			[
				new PieceInstance(PieceType.ROOK, Color.WHITE, undefined, game),
				new PieceInstance(PieceType.KNIGHT, Color.WHITE, undefined, game),
				new PieceInstance(PieceType.BISHOP, Color.WHITE, undefined, game),
				new PieceInstance(PieceType.KING, Color.WHITE, undefined, game),
				new PieceInstance(PieceType.QUEEN, Color.WHITE, undefined, game),
				new PieceInstance(PieceType.BISHOP, Color.WHITE, undefined, game),
				new PieceInstance(PieceType.KNIGHT, Color.WHITE, undefined, game),
				new PieceInstance(PieceType.ROOK, Color.WHITE, undefined, game),
			],
			[
				new PieceInstance(PieceType.PAWN, Color.WHITE, undefined, game),
				new PieceInstance(PieceType.PAWN, Color.WHITE, undefined, game),
				new PieceInstance(PieceType.PAWN, Color.WHITE, undefined, game),
				new PieceInstance(PieceType.PAWN, Color.WHITE, undefined, game),
				new PieceInstance(PieceType.PAWN, Color.WHITE, undefined, game),
				new PieceInstance(PieceType.PAWN, Color.WHITE, undefined, game),
				new PieceInstance(PieceType.PAWN, Color.WHITE, undefined, game),
				new PieceInstance(PieceType.PAWN, Color.WHITE, undefined, game),
			],
			[],
			[],
			[],
			[],
			[
				new PieceInstance(PieceType.PAWN, Color.BLACK, undefined, game),
				new PieceInstance(PieceType.PAWN, Color.BLACK, undefined, game),
				new PieceInstance(PieceType.PAWN, Color.BLACK, undefined, game),
				new PieceInstance(PieceType.PAWN, Color.BLACK, undefined, game),
				new PieceInstance(PieceType.PAWN, Color.BLACK, undefined, game),
				new PieceInstance(PieceType.PAWN, Color.BLACK, undefined, game),
				new PieceInstance(PieceType.PAWN, Color.BLACK, undefined, game),
				new PieceInstance(PieceType.PAWN, Color.BLACK, undefined, game),
			],
			[
				new PieceInstance(PieceType.ROOK, Color.BLACK, undefined, game),
				new PieceInstance(PieceType.KNIGHT, Color.BLACK, undefined, game),
				new PieceInstance(PieceType.BISHOP, Color.BLACK, undefined, game),
				new PieceInstance(PieceType.KING, Color.BLACK, undefined, game),
				new PieceInstance(PieceType.QUEEN, Color.BLACK, undefined, game),
				new PieceInstance(PieceType.BISHOP, Color.BLACK, undefined, game),
				new PieceInstance(PieceType.KNIGHT, Color.BLACK, undefined, game),
				new PieceInstance(PieceType.ROOK, Color.BLACK, undefined, game),
			],
		];
		// transpose a
		const a_ = [[],[],[],[],[],[],[],[]];
		a.forEach((row, x) => row.forEach((piece, y) => a_[y][x] = piece));
		a_.forEach((row, x) => row.forEach((piece, y) => piece.coords = new Coords(x, y)));
		return new Board(game, a_);
	}
}

class Game {
	constructor(){
		this.board = Board.new(this);
		this.turn = Color.WHITE;
	}
	next(){
		this.turn = this.turn === Color.WHITE ? Color.BLACK : Color.WHITE;
	}
	setUp(){
		this.board.piece_array.flat().filter(p => p).forEach(p => p.placePiece())
	}
}

class PieceInstance {
	static pieceIDcounter = 0;
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
		this.id = 'piece_' + (PieceInstance.pieceIDcounter++);
		// flags
		this.hasMoved = false; // needed for castling and double pawn first move
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
		this.game.board.piece_array[this.coords.file][this.coords.rank] = undefined;
		// check if capture
		if (this.game.board.piece_array[coords.file][coords.rank])
			this.game.board.piece_array[coords.file][coords.rank].element.remove();
		this.game.board.piece_array[coords.file][coords.rank] = this;
		this.coords = coords;
		// move element
		/** @type {HTMLDivElement} */
		const destinationElement = document.getElementById(coords.notation);
		destinationElement.appendChild(this.element);
		// hide moves
		PieceInstance.hideMoves();
		// swap player
		this.game.next();
		// change flag
		this.hasMoved = true;
	}
	/** @param {Coords} coords */
	moveButton(coords){
		const elem = document.createElement('div');
		elem.classList.add('move');
		elem.style.marginLeft = (coords.file+1)/9 * 100 + 'vw';
		elem.style.marginTop = (coords.rank+1)/9 * 100 + 'vh';
		elem.title = 'Move ' + this.type.name + ' to ' + coords.notation;
		elem.onclick = () => this.move(coords);
		return elem;
	}
	placePiece(){
		document.getElementById(this.coords.notation).appendChild(this.span);
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
		this.type.getValidMoves(this.coords, this.game.board)
			.forEach(m => root.appendChild(this.moveButton(m)));
	}
	static hideMoves(){
		Array.from(document.getElementsByClassName('move')).forEach(e => e.remove());
	}
}