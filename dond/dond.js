/* jshint esversion: 6, strict: true, strict: global */
/* globals commaNumber, mean, random, round */
'use strict';

const caseValues = [
	0.01, 1, 5, 10, 25, 50, 75,
	100, 200, 300, 400, 500, 750,
	1e3, 5e3, 1e4, 25e3, 5e4, 75e3, 1e5,
	2e5, 3e5, 4e5, 5e5, 75e4, 1e6,
];

class Case {
	/**
	 * @param {number} num
	 * @param {Value} value
	 */
	constructor(num, value){
		this.num = num;
		this.value = value;
		this.opened = false;
	}
	get div(){
		const div = document.createElement('div');
		div.id = this.id;
		div.classList.add('case');
		div.innerHTML = this.num;
		div.onclick = () => this.click();
		return div;
	}
	get id(){
		return this.num+'case';
	}
	click(){
		console.log('Clicked on case ' + this.num);
		if (this.num === Game.chosen){
			return;
		}
		if (!Game.chosen){
			Game.chosen = this.num;
			document.getElementById(this.id).classList.add('chosen');
			Game.log('You have selected case ' + this.num + '.');
		}
		// otherwise, the player is choosing it...
		else {
			this.open();
			this.value.reveal();
			Game.log('The case was worth $' + commaNumber(this.value.value) + '!');
		}
		Game.banker.update();

	}
	open(){
		this.opened = true;
		document.getElementById(this.id).classList.add('opened');
	}
	reset(){
		this.opened = false;
		document.getElementById(this.id).classList.remove('chosen');
		document.getElementById(this.id).classList.remove('opened');
	}
}

class Value {
	/** @param {number} value */
	constructor(value){
		this.value = value;
		this.revealed = false;
	}
	get div(){
		const div = document.createElement('div');
		div.id = this.value+'value';
		div.classList.add('value');
		div.innerHTML = commaNumber(this.value);
		return div;
	}
	get id(){
		return this.value+'value';
	}
	reset(){
		this.revealed = false;
		document.getElementById(this.id).classList.remove('opened');
	}
	reveal(){
		this.revealed = true;
		document.getElementById(this.id).classList.add('opened');
	}
}

const Game = {
	banker: {
		callsAt: [20, 15, 11, 8, 6, 5, 4, 3, 2],
		/** ie., the number of previous times the banker has called */
		get callId(){
			const remaining = Game.casesUnopened.length;
			return this.callsAt.indexOf(this.callsAt.filter(x => x <= remaining)[0]);
		},
		callWeights: [0.1, 0.3, 0.75, 0.83, 0.95, 1, 1, 1, 1],
		no(){
			Game.log('You have declined the banker\'s offer! Please select another case...');
		},
		get offer(){
			return round(mean(Game.casesUnopened.map(c => c.value.value)) *
				this.callWeights[this.callId]);
		},
		get timeUntilNextCall(){
			const nextCallId = this.callId;
			return Game.casesUnopened.length - this.callsAt[nextCallId];
		},
		update(){
			const tunc = this.timeUntilNextCall;
			if (tunc){
				document.getElementById('casesUntilNextCall').innerHTML = 'Please select ' + this.timeUntilNextCall + ' more cases...';
				return;
			}
			document.getElementById('casesUntilNextCall').innerHTML = '';
			Game.log('The banker offers you $' + commaNumber(this.offer) + `. Do you accept?<br>
			<a href="javascript:Game.banker.yes()">YES</a>
			<a href="javascript:Game.banker.no()">NO</a>`);
		},
		yes(){
			const moolah = Game.cases[Game.chosen].value.value;
			Game.log('You take the $' + commaNumber(this.offer) +
			'! Howie opens your case, and inside was $' + commaNumber(moolah) + '! ' +
			(moolah <= this.offer ? 'A wise choice!' : 'An unfortunate decision!') +
			' <a href="Game.new()">Play Again?</a>');
		},
	},
	build(){
		// build cases and values
		caseValues.forEach((_, i) => {
			// values
			const container = document.getElementById(i < caseValues.length/2 ? 'left' : 'right');
			container.appendChild(Game.values[i].div);
			// cases
			Game.cases.push(new Case(i+1));
			document.getElementById('cases').appendChild(Game.cases[i].div);
		});
	},
	/** @type {Case[]} */
	cases: [],
	get casesUnopened(){
		return Game.cases.filter(c => !c.opened);
	},
	/** the ID of the case, not the index. so the min value is 1 */
	chosen: 0,
	log(s = ''){
		return document.getElementById('log').innerHTML = s;
	},
	new(){
		// shuffle values...
		/** @type {Value[]} */
		const vv = random.shuffle(Game.values);
		// reset cases
		Game.cases.forEach((c, i) => {
			c.value = vv[i];
			c.reset();
		});
		// reset values
		Game.values.forEach(v => v.reset());
		// reset chosen
		Game.chosen = 0;
		Game.log('Select your case...');
	},
	/** @param {number} i */
	reveal(i){
		const c = Game.cases[i];
		// open case
		c.open();
		// reveal value
		c.value.reveal();
	},
	/** @type {Value[]} */
	values: [],
};
Game.values = caseValues.map(v => new Value(v));

Game.build(); // construct game
Game.new(); // reset game

/* TODO LIST
- banker
- endgame
*/