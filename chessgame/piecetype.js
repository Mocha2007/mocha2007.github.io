/* exported PieceType */

class PieceType {
	/**
	 * @param {string} name
	 * @param {string} abbr
	 * @param {string} white_emoji
	 * @param {string} black_emoji
	 * @param {MovementType} movement
	 */
	constructor(name, abbr, white_emoji, black_emoji, movement){
		this.name = name || 'unknown';
		this.abbr = abbr || '?';
		this.white_emoji = white_emoji || '?';
		this.black_emoji = black_emoji || '?';
		this.movement = movement;
	}
}

class MovementType {
	constructor(both, move = [], capture = []){
		this.both = both;
		this.move = move;
		this.capture = capture;
	}
	validMoves(coords, board){
		// todo
	}
}