/* exported main */
/* global Game */

// functions

function main(){
	console.info('Mocha\'s weird-ass chess test');
	makeBoard();
	const GAME = new Game();
	GAME.setUp(); // place pieces
	return GAME;
}

function makeBoard(){
	for (let i = 0; i < 9; i++)
		for (let j = 0; j < 9; j++)
			makeSquare(i, j);
}

function makeSquare(row, col){
	// console.log(row, col);
	const elem = document.createElement('div');
	document.getElementById('board').appendChild(elem);
	elem.style.left = 100*col/9+'%';
	elem.style.top = 100*row/9+'%';
	if (row === 0){ // letters
		elem.classList = 'dataSquare';
		return elem.innerHTML = ' abcdefgh'[col];
	}
	else if (col === 0){ // numbers
		elem.classList = 'dataSquare';
		return elem.innerHTML = row;
	}
	const color = (row+col)%2;
	elem.classList = ['white', 'black'][color] +'Square';
	elem.id = ' abcdefgh'[col] + row;
}
/**
 * todo:
 * double pawn first move / the french move
 * pawn changes gender
 * castling
 * checks / checkmates
 */