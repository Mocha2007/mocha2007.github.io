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

function placePiece(piece, tileID){
	document.getElementById(tileID).appendChild(piece.getElement);
}


function main(){
	console.info("Mocha's weird-ass chess test");
	makeBoard();
	resetPieces();
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
}

document.onload = function(){main();};