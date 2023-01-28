/* exported sudoku */
/* global gcd, random, sum */

function range2(n){
	return [...Array(n).keys()];
}

function triangular(n){
	return Math.round(n*(n+1)/2);
}

class Sudoku {
	/** @param {number[][]} data */
	constructor(data, squareSize=3){
		/** @type {number[][]} */
		this.data = data;
		/** @type {number} */
		this.squareSize = squareSize;
		/** @type {number} */
		this.sum = triangular(this.squareSize*this.squareSize-1);
	}
	/** IF there are cells with only one possibility, change them all. otherwise, do the same as addRandom */
	addAllRandom(){
		let forced_move = false;
		const pp = Array(this.size);
		for (let i = 0; i < this.size; i++)
			for (let j = 0; j < this.size; j++)
				if (this.data[i][j] === undefined){
					const p = this.pencil(i, j);
					if (p.length === 1){
						this.data[i][j] = p[0];
						forced_move = true;
					}
					else if (p.length === 0)
						throw Error('this error should never be thrown');
					else
						pp[p.length] = [i, j, p];
				}
		if (!forced_move) // false ~73% of the time based on observation
			for (let i = 2; i < this.size; i++) // since there aren't any squares with one choice, what about 2? 3? etc
				if (pp[i]){
					this.data[pp[i][0]][pp[i][1]] = random.choice(pp[i][2]);
					break;
				}
		return forced_move;
	}
	/** @param {number} c */
	col(c){
		return this.data.map(row => row[c]);
	}
	get copy(){
		return new Sudoku(this.data.map(row => row.map(cell => cell)), this.squareSize);
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
				const darkSquare = (Math.floor(i/this.squareSize)
					+ Math.floor(j/this.squareSize)) % 2;
				if (darkSquare)
					td.classList.add('dark');
				table.appendChild(td);
			});
		});
		return table;
	}
	get hasEmpty(){
		for (let i = 0; i < this.size; i++)
			if (this.data[i].includes(undefined))
				return true;
		return false;
	}
	/** @returns {[number, number, number, number[]]} */
	get minPencilSize(){
		let o = [this.size];
		for (let i = 0; i < this.size; i++)
			for (let j = 0; j < this.size; j++)
				if (this.data[i][j] === undefined){
					const p = this.pencil(i, j);
					if (p.length < o[0])
						o = [p.length, i, j, p];
					if (o[0] === 0)
						return o;
				}
		return o;
	}
	/**
	 * @param {number} row_n
	 * @param {number} col_n
	 */
	pencil(row_n, col_n){
		// row
		const row = this.data[row_n];
		// col
		const col = this.col(col_n);
		// square
		let sq;
		const o = [];
		for (let i = 0; i < this.size; i++)
			if (!col.includes(i) && !row.includes(i)){
				if (!sq)
					sq = this.square(
						Math.floor(row_n/this.squareSize),
						Math.floor(col_n/this.squareSize));
				if (!sq.includes(i))
					o.push(i);
			}
		return o;
		/* out of a shitton of tests, I have found it fails with this frequency:
			c:  55995899 (ie. there is another in the same col)
			r:  50262264 (ie. there is another in the same row)
			sq: 32881597 (ie. there is another in the same square)
			therefore I have ordered this such as to give the greatest odds of it breaking first
		*/
	}
	get size(){
		return this.squareSize * this.squareSize;
	}
	/** @returns {boolean|Sudoku} */
	get solved(){
		if (!this.hasEmpty)
			return this;
		let more_information = false;
		const copy = this.copy;
		for (let i = 0; i < this.size; i++){
			// before fucking around check if there is only one undefined in the row
			const undefineds = copy.data[i].filter(x => x === undefined).length;
			if (undefineds === 0)
				continue;
			if (undefineds === 1){
				// copy.data[i][j] = range2(this.size).find(x => !copy.data[i].includes(x));
				copy.data[i][copy.data[i].indexOf(undefined)]
					= this.sum - sum(copy.data[i].filter(x => x));
				more_information = true;
				continue;
			}
			// okay now waste time with the stupid fucking pencil
			for (let j = 0; j < this.size; j++){
				if (copy.data[i][j] !== undefined)
					continue;
				const missing = copy.pencil(i, j);
				if (missing.length === 0)
					return false;
				if (missing.length === 1){
					copy.data[i][j] = missing[0];
					more_information = true;
				}
			}
		}
		if (!more_information)
			return true; // multiple solutions
		return copy.solved;
	}
	/**
	 * @param {number} r
	 * @param {number} c
	 */
	square(r, c){
		const o = [];
		for (let row_id = this.squareSize*r; row_id < this.squareSize*r+this.squareSize; row_id++)
			// eslint-disable-next-line max-len
			for (let col_id = this.squareSize*c; col_id < this.squareSize*c+this.squareSize; col_id++)
				o.push(this.data[row_id][col_id]);
		return o;
	}
	get string(){
		return this.data.map(row => row.map(x => x === undefined ? ' ' : x).join(' ')).join('\n');
	}
	/** @returns {Sudoku} */
	static randomSolved(squareSize = 3, attempts = 20){
		const size = squareSize * squareSize;
		const board = new Sudoku(Array(size).fill(0).map(() => Array(size)), squareSize);
		// seed the board by filling the three diagonal 3x3 squares...
		const seed = () => {
			for (let diag = 0; diag < squareSize; diag++){
				const order = random.shuffle(range2(size));
				for (let i = 0; i < squareSize; i++)
					for (let j = 0; j < squareSize; j++)
						board.data[squareSize*diag+i][squareSize*diag+j] = order[squareSize*i+j];
			}
		};
		seed();
		while (board.minPencilSize[0] === 0)
			seed();
		// add to board until solved
		const hist = [board];
		const forced_move = [undefined];
		const undo = () => {
			hist.pop();
			forced_move.pop();
			// console.warn('undo');
		};
		while (hist[hist.length-1].hasEmpty){
			// console.debug(hist[hist.length-1].string);
			// try adding a random # to board
			const next = hist[hist.length-1].copy;
			try {
				forced_move.push(next.addAllRandom());
				hist.push(next);
			}
			catch (_){ // no solution
				// console.debug(_);
				if (!next.hasEmpty)
					return next;
				if (attempts <= 0){
					// console.warn('reseeding...');
					return this.randomSolved(squareSize);
				}
				// console.info(attempts, hist.length, forced_move);
				while (forced_move[forced_move.length-1]) // try to undo forced moves until last optional move
					undo();
				undo();
				attempts--;
			}
		}
		return hist[hist.length-1];
	}
	/** this generator cheats a bit by using cyclical transpositions of regions
	 * if the player know this then they can unfortunately use this to cheat,
	 * however, if they don't... :^)
	 * @returns {Sudoku} */
	static randomSolved2(squareSize = 3){
		const size = squareSize * squareSize;
		const board = new Sudoku(Array(size).fill(0).map(() => Array(size)), squareSize);
		// generate order
		const order = random.shuffle(range2(size));
		// generate a, b such that gcd(a, squareSize) = 1; I don't think there are limits on b...
		// this is to try to make it less obvious that all regions are the same but with transposition of rows/cols
		let ai, aj;
		while (gcd(ai, squareSize) !== 1)
			ai = random.randint(0, squareSize);
		while (gcd(aj, squareSize) !== 1)
			aj = random.randint(0, squareSize);
		const bi = random.randint(0, squareSize);
		const bj = random.randint(0, squareSize);
		// console.log(`I: ${ai}x + ${bi}\nJ: ${aj}x + ${bj}`);
		for (let ii = 0; ii < squareSize; ii++)
			for (let jj = 0; jj < squareSize; jj++)
				for (let i = 0; i < squareSize; i++)
					for (let j = 0; j < squareSize; j++)
						board.data[squareSize*ii+i][squareSize*jj+j]
							= order[squareSize*((i+jj*ai+bi)%squareSize) + (j+ii*aj+bj)%squareSize];
		// phase 2: attempt to introduce randomness by deleting every other tile
		for (let i = 0; i < size; i++)
			for (let j = 0; j < size; j++)
				if ((i+j+1) % 2)
					board.data[i][j] = undefined;
		// add to board until solved
		while (board.hasEmpty){
			// console.debug(board.string);
			// try adding a random # to board
			try {
				board.addAllRandom();
				//if (!forced_move[forced_move.length-1])
				//	console.debug('AHA TRICKED YA BETCHA THOUGHT IT WAS TOTALLY CYCLICAL EH');
			}
			catch (_){ // no solution
				// console.warn('reseeding...');
				return this.randomSolved2(squareSize);
			}
		}
		return board;
	}
	/** @returns {[Sudoku, Sudoku]} */
	static randomUnsolved(squareSize = 3, max_tries = 5){
		// https://stackoverflow.com/a/7280517
		const solved = 4 < squareSize
			? this.randomSolved2(squareSize) // this algo generates lower-quality puzzles but it much faster above 4x4 region size
			: this.randomSolved(squareSize);
		let o = solved;
		// console.debug(solved.string);
		for (let i = 0; i < max_tries; i++){
			const copy = o.copy;
			for (let j = 0; j < squareSize*squareSize; j++) // we want to work faster for bigger copies...
				copy.deleteRandom();
			if (copy.solved !== true) // true means multiple solutions
				o = copy;
		}
		// console.debug(1-sum(o.data.map(row => row.filter(x => x === undefined).length))/Math.pow(squareSize, 4));
		return [solved, o];
	}
}

const sudoku = {
	benchmark(trials = 100){
		[2, 3, 4, 5].forEach(n => {
			this.size = n;
			const t_start = performance.now();
			for (let i = 0; i < trials; i++)
				this.gen(false);
			const t = (performance.now() - t_start)/trials;
			console.debug(`${n} took ${t} ms avg.`);
		});
	},
	difficulty: 0,
	difficultyCurve: [1, 2, 4], // abt. 50%, 40%, 35% full respectively (at least on 3x3)
	gen(debug = true){
		const t_start = performance.now();
		// only squared because we delete multiple times as a function of size^2, 4-2=2
		const tries = this.difficultyCurve[this.difficulty] * this.size*this.size;
		const [solution, puzzle] = Sudoku.randomUnsolved(this.size, tries);
		// elems
		const main = document.getElementById('main');
		main.innerHTML = '';
		main.appendChild(puzzle.elem);
		main.appendChild(this.spoiler(solution.elem));
		// for debugging purposes
		if (debug){
			this.puzzle = puzzle;
			this.solution = solution;
			console.info(`${performance.now() - t_start} ms`);
		}
	},
	size: 3,
	/** @param {HTMLElement} elem */
	spoiler(elem){
		const details = document.createElement('details');
		const summary = document.createElement('summary');
		summary.innerHTML = 'SOLUTION';
		details.appendChild(summary);
		details.appendChild(elem);
		return details;
	},
	test(){
		const main = document.getElementById('main');
		main.innerHTML = '';
		main.appendChild(Sudoku.randomSolved2(5).elem);
	},
};