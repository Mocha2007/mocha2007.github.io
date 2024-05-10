/* exported PieceType */

class PieceType {
	constructor(name, abbr, white_emoji, black_emoji, movement){
		this.name = name || 'unknown';
		this.abbr = abbr || '?';
		this.white_emoji = white_emoji || '?';
		this.black_emoji = black_emoji || '?';
		this.movement = movement;
	}
}