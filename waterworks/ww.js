/* globals random, range, sum */
/* exported recalc */
'use strict';

const perfectScore = 20;
const worstScore = -40;

const adjacencies = [
	// row 1
	[1, 6],
	[0, 2, 7],
	[1, 3, 8],
	[2, 4, 9, 10],
	[3, 5, 11],
	[4, 12],
	// row 2
	[0, 7, 13],
	[1, 6, 8, 13, 15],
	[2, 7, 9, 16],
	[3, 8, 10, 17],
	[3, 9, 11, 17],
	[4, 10, 12, 18],
	[5, 11, 19],
	// row 3
	[6, 7, 14],
	// row 4
	[13, 15],
	[7, 14, 16],
	[8, 15, 17],
	[9, 10, 16, 18],
	[11, 17, 19],
	[12, 18],
];
/*
const types = {
	carrier: 1, // 2 when over tile
	cart: 2, // 3 "
	wagon: 6, // 8 "
	well: 2,
	sump: 11,
};*/

/** @type {Block[]} */
const blocks = [];
class Block {
	/**
	 * @param {number} id
	*/
	constructor(id){
		this.id = id;
		/** @type {Block[]} */
		this.neighbors = []; // todo
		blocks.push(this);
	}
	get demand(){
		return document.getElementById(`popInput${this.id}`).value - 1;
	}
	get score(){
		return 0 < this.supply-this.demand ? 1 : this.supply === this.demand ? 0 : -2;
	}
	get supply(){
		return this.waterInput.value - 0;
	}
	get td(){
		return document.getElementById(`block${this.id}`);
	}
	/** @return {HTMLInputElement} */
	get waterInput(){
		return document.getElementById(`waterInput${this.id}`);
	}
	reset(){
		this.waterInput.value = 0;
	}
	/** @param {number[]} arr */
	static get(arr){
		return arr.map(i => blocks[i]);
	}
}
range(20).forEach(i => new Block(i));
range(20).forEach(i => blocks[i].neighbors = Block.get(adjacencies[i]));

// functions

/** @param {number} carriers
 * @param {number} carts
 * @param {number} wagons
*/
function optimizeCarriers(carriers, carts, wagons){
	// unfortunately, by the end of the game, there are 20^8 possible combos! way too many to check.
	let bestScore = worstScore;
	/** @type {{carrierLocs: number[], cartLocs: number[], wagonLocs: number[]}} */
	let bestArrangement = {};
	range(1000).forEach(() => {
		// reset grid
		blocks.forEach(b => b.reset());
		// try combos
		// carriers
		/** @type {number[]} */
		const carrierLocs = [];
		range(carriers).forEach(() => {
			const id = random.randint(0, 19);
			carrierLocs.push(id);
			blocks[id].waterInput.value -= -2;
			blocks[id].neighbors.forEach(n => n.waterInput.value -= -1);
		});
		// carts
		/** @type {number[]} */
		const cartLocs = [];
		range(carts).forEach(() => {
			const id = random.randint(0, 19);
			cartLocs.push(id);
			blocks[id].waterInput.value -= -3;
			blocks[id].neighbors.forEach(n => n.waterInput.value -= -2);
		});
		// wagons
		/** @type {number[]} */
		const wagonLocs = [];
		range(wagons).forEach(() => {
			const id = random.randint(0, 19);
			wagonLocs.push(id);
			blocks[id].waterInput.value -= -8;
			blocks[id].neighbors.forEach(n => n.waterInput.value -= -6);
		});
		// get score
		const currentScore = score();
		if (bestScore < currentScore){
			bestScore = currentScore;
			bestArrangement = {
				carrierLocs: carrierLocs.slice(),
				cartLocs: cartLocs.slice(),
				wagonLocs: wagonLocs.slice(),
			};
		}
	});
	// reset grid
	blocks.forEach(b => b.reset());
	return bestArrangement;
}

/** returns score of the current grid */
function score(){
	return sum(range(20).map(i => {
		const demand = document.getElementById(`popInput${i}`).value - 1;
		const supply = document.getElementById(`waterInput${i}`).value - 0;
		return 0 < supply-demand ? 1 : supply === demand ? 0 : -2;
	}));
}

function main(){
	// initialize blocks
	range(20).forEach(i => {
		const block = document.getElementById(`block${i}`);
		// water input
		const waterInput = document.createElement('input');
		waterInput.type = 'number';
		waterInput.min = 0;
		waterInput.step = 1;
		waterInput.value = 0;
		waterInput.classList.add('waterInput');
		waterInput.id = `waterInput${i}`;
		block.appendChild(waterInput);
		block.appendChild(document.createElement('br'));
		// pop input
		const popInput = document.createElement('input');
		popInput.type = 'number';
		popInput.min = 1;
		popInput.step = 1;
		popInput.value = 1;
		popInput.classList.add('popInput');
		popInput.id = `popInput${i}`;
		block.appendChild(popInput);
	});
	// updater
	// setInterval(update, 1000);
	console.log('Waterworks! Solver loaded.');
}

function recalc(){
	// called by a button on the page
	const carriers = parseInt(document.getElementById('carriers').value);
	const carts = parseInt(document.getElementById('carts').value);
	const wagons = parseInt(document.getElementById('wagons').value);
	const solution = JSON.stringify(optimizeCarriers(carriers, carts, wagons));
	document.getElementById('solution').innerHTML = solution;
}
/*
function update(){
	document.getElementById('score').innerHTML = score();
}*/

main();

/* todo:
	- fire
*/