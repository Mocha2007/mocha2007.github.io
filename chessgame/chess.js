/* exported main */
/* global Game */

// functions

function main(){
	console.info('Mocha\'s weird-ass chess test');
	makeBoard();
	const GAME = new Game();
	return GAME;
}

function makeBoard(){
	for (let i = 0; i < 9; i++)
		for (let j = 0; j < 8; j++)
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
	if (col === 0){ // numbers
		elem.classList = 'dataSquare';
		return elem.innerHTML = row ? row : '';
	}
	const color = (row+col)%2;
	elem.classList = ['black', 'white'][color] +'Square';
	elem.id = ' abcdefgh'[col] + row;
	// console.log(color);
}