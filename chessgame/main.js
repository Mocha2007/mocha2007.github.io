/* jshint esversion: 6, strict: true, forin: false, loopfunc: true, strict: global */
/* exported importSave, downloadSave, createOrder, wipeMap, hardReset */
"use strict";
var colString = " abcdefgh";
var colorData = [
	{
		'name': 'black'
	},
	{
		'name': 'white'
	}
];
var pieceData = {
	'bishop': {
		'abbr': 'B',
		'moves': [
			{
				'dir': 'diagonal',
				'dist': Infinity
			}
		]
	},
	'king': {
		'abbr': 'K',
		'castling': "king",
		'isEssential': true,
		'moves': [
			{
				'dir': 'any',
				'dist': 1
			}
		]
	},
	'knight': {
		'abbr': 'N',
		'leaper': true,
		'moves': [
			{
				'dir': 'L',
				'dist': 1
			}
		]
	},
	'pawn': {
		'abbr': 'P',
		'pawnMoves': true,
		'moves': [
			{
				'dir': 'P',
				'dist': 1
			}
		]
	},
	'queen': {
		'abbr': 'Q',
		'moves': [
			{
				'dir': 'any',
				'dist': Infinity
			}
		]
	},
	'rook': {
		'abbr': 'R',
		'moves': [
			{
				'dir': 'orthogonal',
				'dist': Infinity
			}
		]
	}
};

class Piece{
	constructor(type, color){
		this.type = type;
		this.color = color;
	}
	get getElement(){
		var elem = document.createElement("abbr");
		elem.innerHTML = pieceData[this.type].abbr + colorData[this.color].name[0];
		elem.title = colorData[this.color].name + " " + this.type;
		return elem;
	}
}

// functions

function getAttacks(type, pos, color){
	console.warn("this function doesnt account for blocking pieces!!!");
	var attacks = [];
	var piece = pieceData[type];
	var aType = piece.moves[0].dir;
	var maxDist = 8 < piece.moves[0].dist? 8 : piece.moves[0].dist;
	if (aType === 'L'){
		attacks.push([pos[0]-2, pos[1]-1]);
		attacks.push([pos[0]-2, pos[1]+1]);
		attacks.push([pos[0]-1, pos[1]+2]);
		attacks.push([pos[0]+1, pos[1]+2]);
		attacks.push([pos[0]+2, pos[1]+1]);
		attacks.push([pos[0]+2, pos[1]-1]);
		attacks.push([pos[0]+1, pos[1]-2]);
		attacks.push([pos[0]-1, pos[1]-2]);
	}
	else if (aType === 'P'){
		var dir = color ? 1 : -1; // fixme
		attacks.push([pos[0]-1, pos[1]+dir]);
		attacks.push([pos[0]+1, pos[1]+dir]);
	}
	else{
		for (var i=1; i<=maxDist; i+=1){
			if (aType === 'diagonal' || aType === 'any'){
				attacks.push([pos[0]-i, pos[1]-i]);
				attacks.push([pos[0]-i, pos[1]+i]);
				attacks.push([pos[0]+i, pos[1]-i]);
				attacks.push([pos[0]+i, pos[1]+i]);
			}
			if (aType === 'orthogonal' || aType === 'any'){
				attacks.push([pos[0], pos[1]-i]);
				attacks.push([pos[0], pos[1]+i]);
				attacks.push([pos[0]-i, pos[1]]);
				attacks.push([pos[0]+i, pos[1]]);
			}
		}
	}
	// remove off-board moves
	var finalAttacks = [];
	for (i=0; i<attacks.length; i+=1){
		if (attacks[i][0] < 0 || 7 < attacks[i][0] || attacks[i][1] < 0 || 7 < attacks[i][1]){
			continue;
		}
		finalAttacks.push(attacks[i]);
	}
	return finalAttacks;
}

function getFrom(){
	return document.getElementById("input_from").value;
}

function getTo(){
	return document.getElementById("input_to").value;
}

function main(){
	console.info("Mocha's weird-ass chess test");
	makeBoard();
	resetPieces();
	// fixme debug
	placeNote(3, "c6", "attack");
	placeNote(3, "c3", "defense");

}

function makeBoard(){
	var col, row;
	for (var i=0; i<9; i+=1){
		for (var j=0; j<colString.length; j+=1){
			makeSquare(i, j);
		}
	}
}

function makeSquare(row, col){
	// console.log(row, col);
	var elem = document.createElement("div");
	document.getElementById("board").appendChild(elem);
	elem.style.left = 100*col/9+"%";
	elem.style.top = 100*row/9+"%";
	if (row === 0){ // letters
		elem.classList = "dataSquare";
		return elem.innerHTML = colString[col];
	}
	if (col === 0){ // numbers
		elem.classList = "dataSquare";
		return elem.innerHTML = row ? row : "";
	}
	var color = (row+col)%2;
	elem.classList = colorData[color].name+"Square";
	elem.id = colString[col] + row;
	// console.log(color);
}

function movePiece(from, to){
	var temp = document.getElementById(from).innerHTML
	document.getElementById(from).innerHTML = "";
	document.getElementById(to).innerHTML = temp;
}

function placeNote(n, tileID, type){
	var elem = document.createElement("div");
	elem.classList = type+"Square";
	elem.innerHTML = n;
	elem.id = tileID + type;
	var under = document.getElementById(tileID);
	elem.style.left = under.style.left;
	elem.style.top = under.style.top;
	document.getElementById(type+"Board").appendChild(elem);
}

function placePiece(piece, tileID){
	document.getElementById(tileID).appendChild(piece.getElement);
}

function reloadNotes(){
}

function resetPieces(){
	// white
	placePiece(new Piece("rook", 1), "a1");
	placePiece(new Piece("knight", 1), "b1");
	placePiece(new Piece("bishop", 1), "c1");
	placePiece(new Piece("queen", 1), "d1");
	placePiece(new Piece("king", 1), "e1");
	placePiece(new Piece("bishop", 1), "f1");
	placePiece(new Piece("knight", 1), "g1");
	placePiece(new Piece("rook", 1), "h1");
	// black
	placePiece(new Piece("rook", 0), "a8");
	placePiece(new Piece("knight", 0), "b8");
	placePiece(new Piece("bishop", 0), "c8");
	placePiece(new Piece("queen", 0), "d8");
	placePiece(new Piece("king", 0), "e8");
	placePiece(new Piece("bishop", 0), "f8");
	placePiece(new Piece("knight", 0), "g8");
	placePiece(new Piece("rook", 0), "h8");
	// pawns
	var letter;
	for (var i=1; i<colString.length; i+=1){
		letter = colString[i];
		placePiece(new Piece("pawn", 1), letter+2);
		placePiece(new Piece("pawn", 0), letter+7);
	}
}