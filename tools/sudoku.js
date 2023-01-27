/* exported sudoku */
/* global random, range */

/** @param {[]} arr */
function isUniqueArr(arr){
	arr = arr.filter(x => x !== undefined);
	return new Set(arr).size === arr.length;
}

class Sudoku {
	constructor(data, squareSize=3){
		this.data = data;
		this.squareSize = squareSize;
	}
	/** add random legal int to blank cell */
	addRandom(){
		const mps = this.minPencilSize;
		for (let i = 0; i < this.size; i++)
			for (let j = 0; j < this.size; j++)
				if (this.data[i][j] === undefined){
					const p = this.pencil(i, j);
					if (p.size === mps)
						return this.data[i][j] = random.choice(Array.from(p));
				}
	}
	/** @returns {number[]} */
	col(c){
		return this.data.map(row => row[c]);
	}
	get copy(){
		return new Sudoku(this.data.map(row => row.map(cell => cell)));
	}
	deleteRandom(){
		this.data[random.randint(0, this.size-1)][random.randint(0, this.size-1)] = undefined;
	}
	get elem(){
		const table = document.createElement('table');
		this.data.forEach((row, i) => {
			const tr = document.createElement('tr');
			table.appendChild(tr);
			row.forEach((cell, j) => {
				const td = document.createElement('td');
				td.id = `cell_${i}_${j}`;
				if (cell !== undefined)
					td.innerHTML = cell+1; // convert from 0-indexed to 1-indexed
				const darkSquare = (Math.floor(i/3) + Math.floor(j/3)) % 2;
				if (darkSquare)
					td.classList.add('dark');
				table.appendChild(td);
			});
		});
		return table;
	}
	get hasEmpty(){
		for (let i = 0; i < this.size; i++)
			if (this.row(i).includes(undefined))
				return true;
		return false;
	}
	get legal(){
		// check rows
		for (let i = 0; i < this.size; i++)
			if (!isUniqueArr(this.row(i)))
				return false;
		// check cols
		for (let i = 0; i < this.size; i++)
			if (!isUniqueArr(this.col(i)))
				return false;
		// check squares
		for (let i = 0; i < this.squareSize; i++)
			for (let j = 0; j < this.squareSize; j++)
				if (!isUniqueArr(this.square(i, j)))
					return false;
		// all checks passed
		return true;
	}
	get minPencilSize(){
		let o = this.size;
		for (let i = 0; i < this.size; i++)
			for (let j = 0; j < this.size; j++)
				if (this.data[i][j] === undefined){
					const p = this.pencil(i, j).size;
					if (p < o)
						o = p;
				}
		return o;
	}
	/** @returns {Set<number>} */
	pencil(row_n, col_n){
		const missing = new Set(range(this.size));
		const row = this.row(row_n);
		const col = this.col(col_n);
		const square = this.square(Math.floor(row_n/3), Math.floor(col_n/3));
		row.forEach(n => missing.delete(n));
		col.forEach(n => missing.delete(n));
		square.forEach(n => missing.delete(n));
		return missing;
	}
	/** @returns {number[]} */
	row(r){
		return this.data[r];
	}
	get size(){
		return this.squareSize * this.squareSize;
	}
	/** @returns {boolean|Sudoku} */
	get solved(){
		if (!this.hasEmpty)
			return this;
		let more_information = false;
		let solvable = true;
		const copy = this.copy;
		this.data.forEach((row, i) => row.forEach((cell, j) => {
			if (cell !== undefined || !solvable)
				return;
			const missing = this.pencil(i, j);
			if (missing.size === 0)
				solvable = false;
			if (missing.size === 1){
				copy.data[i][j] = Array.from(missing)[0];
				more_information = true;
			}
		}));
		if (!more_information)
			return true; // multiple solutions
		return copy.solved;
	}
	square(r, c){
		const o = [];
		range(this.squareSize*r, this.squareSize*r+this.squareSize)
			.forEach(row_id => range(this.squareSize*c, this.squareSize*c+this.squareSize)
				.forEach(col_id => o.push(this.data[row_id][col_id])));
		return o;
	}
	get string(){
		return this.data.map(row => row.map(x => x === undefined ? ' ' : x).join(' ')).join('\n');
	}
	/** @returns {Sudoku} */
	static randomSolved(squareSize = 3, max_tries = 1000){
		const size = squareSize * squareSize;
		let board = new Sudoku(range(size)
			.map(() => range(size)
				.map(() => undefined)), squareSize);
		// seed the board by filling the three diagonal 3x3 squares...
		for (let diag = 0; diag < squareSize; diag++){
			const order = random.shuffle(range(size));
			for (let i = 0; i < squareSize; i++)
				for (let j = 0; j < squareSize; j++)
					board.data[squareSize*diag+i][squareSize*diag+j] = order[squareSize*i+j];
		}
		// console.debug(board);
		// todo
		while (0 < max_tries && typeof board.solved === 'boolean'){
			// try adding a random # to board
			const copy = board.copy;
			copy.addRandom();
			if (copy.solved) // if solvable...
				board = copy;
			max_tries--;
		}
		if (!max_tries){
			// console.error(board.string);
			return this.randomSolved();
		}
		return board.solved;
	}
	/** @returns {[Sudoku, Sudoku]} */
	static randomUnsolved(max_tries = 100){
		// https://stackoverflow.com/a/7280517
		const solved = this.randomSolved();
		let o = solved;
		while (0 < max_tries){
			const copy = o.copy;
			copy.deleteRandom();
			if (copy.solved !== true)
				o = copy;
			max_tries--;
		}
		// console.debug(1-sum(o.data.map(row => row.filter(x => x === undefined).length))/81);
		return [solved, o];
	}
}

const sudoku = {
	difficulty: 0,
	difficultyCurve: [55, 90, 1000], // abt. 50%, 40%, 30% full respectively
	gen(){
		const [solution, puzzle] = Sudoku.randomUnsolved(this.difficultyCurve[this.difficulty]);
		// elems
		const main = document.getElementById('main');
		main.innerHTML = '';
		main.appendChild(puzzle.elem);
		main.appendChild(this.spoiler(solution.elem));
		// for debugging purposes
		this.puzzle = puzzle;
		this.solution = solution;
	},
	/** @param {HTMLElement} elem */
	spoiler(elem){
		const details = document.createElement('details');
		const summary = document.createElement('summary');
		summary.innerHTML = 'SOLUTION';
		details.appendChild(summary);
		details.appendChild(elem);
		return details;
	},
};