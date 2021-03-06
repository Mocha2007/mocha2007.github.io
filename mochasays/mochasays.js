'use strict';

const Game = {
	/** @type {number} */
	correctSoFar: 0,
	/** @type {number[]} */
	seq: [],
	// methods
	/** @param {number} i - button ID */
	buttonNoise(i){
		play("sfx/button" + i + ".mp3");
	},
	gameOver(){
		play("sfx/ono.mp3");
		this.reset();
	},
	newitem(){
		// console.log("NEW ITEM");
		this.correctSoFar = 0;
		this.seq.push(random.randint(0, 3));
		// play("sfx/nextseq.mp3");
		this.teach();
	},
	/** @param {number} i - button ID */
	press(i){
		// console.log("Pressed " + i);
		// check if wrong
		if (0 < this.seq.length && this.seq[this.correctSoFar] != i)
			return this.gameOver();
		// do every time
		if (this.seq.length != 0)
			this.correctSoFar++;
		// did you get the sequence right?
		if (this.seq.length <= this.correctSoFar)
			this.newitem();
		else
			this.buttonNoise(i);
	},
	reset(){
		this.correctSoFar = 0;
		this.seq = [];
	},
	/** show the player the new sequence */
	teach(){
		console.log("seq", this.seq);
		this.seq.forEach((x, i) => {
			setTimeout(() => {this.buttonNoise(x);}, i*700);
			/*
			0	604 ms
			1	673 ms
			2	430 ms
			3	650 ms
			*/
		});
	}
};