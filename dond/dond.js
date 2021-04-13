/* jshint esversion: 6, strict: true, strict: global */
/* globals commaNumber, mean, postScore, random, sigFigs, storage, unlockMedal */
'use strict';

const caseValues = [
	0.01, 1, 5, 10, 25, 50, 75,
	100, 200, 300, 400, 500, 750,
	1e3, 5e3, 1e4, 25e3, 5e4, 75e3, 1e5,
	2e5, 3e5, 4e5, 5e5, 75e4, 1e6,
];
const modelNames = [
	'Claudia', 'Stacey', 'Lisa', 'Lindsay', 'Ursula', 'Megan',
	'Sara', 'Pilar', 'Patricia', 'Anya', 'Katie', 'Jill', 'Leyla',
	'April', 'Lanisha', 'Kimberly', 'Jenelle', 'Aliké', 'Mylinda', 'Marisa',
	'Temeka', 'Donna', 'Aubrie', 'Nancy', 'Sonia', 'Lindsay',
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
		div.onkeydown = e => e.key === 'Enter' ? div.onclick() : undefined;
		div.tabIndex = 0;
		return div;
	}
	get id(){
		return this.num+'case';
	}
	get model(){
		return modelNames[this.num-1];
	}
	click(){
		console.log('Clicked on case ' + this.num);
		if (this.num === Game.chosen || Game.banker.offering || Game.over){
			return;
		}
		const div = document.getElementById(this.id);
		div.removeAttribute('tabIndex');
		if (!Game.chosen){
			Game.chosen = this.num;
			div.classList.add('chosen');
			Game.log('You have selected case ' + this.num + '.');
		}
		// otherwise, the player is choosing it...
		else {
			this.open();
			this.value.reveal();
			Game.log(this.model + ' opens up the case - it&rsquo;s worth $' + commaNumber(this.value.value) + '!');
		}
		Game.banker.update();
	}
	open(){
		Game.sfx.open.play();
		(this.value.big ? Game.sfx.bigAmountGone : Game.sfx.smallAmountGone).play();
		this.opened = true;
		document.getElementById(this.id).classList.add('opened');
	}
	reset(){
		this.opened = false;
		const div = document.getElementById(this.id);
		div.classList.remove('chosen');
		div.classList.remove('opened');
		div.tabIndex = 0;
	}
}

class Value {
	/** @param {number} value */
	constructor(value){
		this.value = value;
		this.revealed = false;
	}
	get big(){
		// if bigger than 65%, panic!!!
		return 0.65 < mean(Game.casesUnopened.map(c => c.value.value < this.value));
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

class Sound {
	/** @param {string} url */
	constructor(url){
		this.url = url;
		this.audio = new Audio(url);
		this.audio.volume = 0.4;
	}
	play(){
		this.audio.play();
	}
	stop(){
		this.audio.pause();
		this.audio.currentTime = 0;
	}
}

/** @type {Music[]} */
const allMusic = [];
class Music extends Sound {
	/** @param {string} url */
	constructor(url){
		super(url);
		this.audio.volume = 0.2;
		this.audio.onended = () => this.onended();
		allMusic.push(this);
	}
	onended(){
		Game.sfx.bgm.play();
	}
	play(){
		allMusic.forEach(m => m.stop());
		this.audio.play().catch(() => undefined);
	}
}

const Game = {
	banker: {
		callsAt: [20, 15, 11, 8, 6, 5, 4, 3, 2],
		/** ie., the number of previous times the banker has called */
		get callId(){
			const remaining = Game.casesUnopened.length;
			const id = this.callsAt.indexOf(this.callsAt.filter(x => x <= remaining)[0]);
			return id === -1 ? this.callsAt.length : id;
		},
		callWeights: [0.1, 0.3, 0.75, 0.83, 0.95, 1, 1, 1, 1],
		largeOffer: 2e5,
		no(){
			this.offering = false;
			if (this.callId < 8){
				Game.log('You have rejected the banker\'s offer! Please select another case...');
				return;
			}
			this.yes(true);
		},
		get offer(){
			return sigFigs(mean(Game.casesUnopened.map(c => c.value.value)) *
				this.callWeights[this.callId], 2);
		},
		offering: false,
		get timeUntilNextCall(){
			const nextCallId = this.callId;
			return 8 < nextCallId ? Infinity : Game.casesUnopened.length - this.callsAt[nextCallId];
		},
		update(){
			const tunc = this.timeUntilNextCall;
			const plural = tunc === 1 ? '' : 's';
			if (tunc){
				document.getElementById('casesUntilNextCall').innerHTML = 'Please select ' +
					this.timeUntilNextCall + ' more case' + plural + '...';
				return;
			}
			Game.sfx.call.play();
			Game.sfx.call.audio.onended = () => (this.largeOffer <= this.offer ?
				Game.sfx.largeOffer : Game.sfx.smallOffer).play();
			document.getElementById('casesUntilNextCall').innerHTML = '';
			Game.log('The banker offers you $' + commaNumber(this.offer) + `. Do you accept?<br>
			<a href="javascript:Game.banker.yes()" tabindex="0">YES</a>
			<a href="javascript:Game.banker.no()" tabindex="0">NO</a>`);
			this.offering = true;
		},
		yes(tookOwnCase = false){
			Game.over = true;
			Game.sfx.yes.play();
			this.offering = false;
			const taken = tookOwnCase ? Game.playerCase.value.value : this.offer;
			const other = tookOwnCase ? this.offer : Game.playerCase.value.value;
			Game.log('You ' + (tookOwnCase ? 'reject' : 'take') + ' the $' + commaNumber(this.offer) +
			'! Howie opens your case, and inside was $' + commaNumber(Game.playerCase.value.value) + '! ' +
			(other <= taken ? 'A wise choice!' : 'An unfortunate decision!') +
			' <a href="javascript:Game.new()" tabindex="0">Play Again?</a>');
			// medals
			if (taken === 0.01)
				unlockMedal('Heather McKee');
			else if (1e5 <= taken){
				unlockMedal('Decent Show');
				if (taken === 1e6){
					Game.milCount++;
					Game.save.save();
					unlockMedal('Jessica Robinson');
					postScore('Multimillionaire', Game.milCount);
				}
				const vals = Game.casesUnopened.map(c => c.value.value);
				// 1e5 req is so the penny doesn't cheese it
				if (tookOwnCase && 1e4 <= Math.max(...vals)/Math.min(...vals) && other < taken)
					unlockMedal('Gambler');
			}
			// scoreboards
			postScore('Money', taken*100);
		},
	},
	build(){
		Game.save.load();
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
	milCount: 0,
	new(){
		Game.over = false;
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
		Game.log('Select your case to begin...');
		Game.sfx.theme.play();
	},
	over: false,
	get playerCase(){
		return Game.cases[Game.chosen-1];
	},
	/** @param {number} i */
	reveal(i){
		const c = Game.cases[i];
		// open case
		c.open();
		// reveal value
		c.value.reveal();
	},
	save: {
		load(){
			const data = storage.read('mocha-dond');
			if (!data) return;
			Game.milCount = data.milCount;
		},
		save(){
			const data = {
				milCount: Game.milCount,
			};
			storage.write('mocha-dond', data);
		},
	},
	sfx: {
		bgm: new Music('https://www.soundboard.com/mediafiles/mt/MTI5OTI2NzYxMjk5OTg_ZHE95Cjg8LQ.mp3'),
		bigAmountGone: new Sound('https://www.soundboard.com/mediafiles/mj/Mjc0MjI2NzYyNzQyNTI_z0kYdmYNpWQ.mp3'),
		call: new Sound('https://www.soundboard.com/mediafiles/nj/NjM5MTI2NzY2MzkyMTk_qqoRKnOqaNc.mp3'),
		largeOffer: new Sound('https://www.soundboard.com/mediafiles/nd/NDE0NjI2NzY0MTQ3MzQ_jS49MEHM2dc.mp3'),
		open: new Sound('https://www.soundboard.com/mediafiles/mj/MjU1MTI2NzYyNTUxOTA_1agykhsm8s8.mp3'),
		smallAmountGone: new Sound('https://www.soundboard.com/mediafiles/nd/NDUwNTI2NzY0NTA2MDk_WwX0VBNxjjE.mp3'),
		smallOffer: new Sound('https://www.soundboard.com/mediafiles/ot/OTQzNzI2NzY5NDM4ODc_cZt51fuUnZA.mp3'),
		theme: new Music('https://www.soundboard.com/mediafiles/mz/MzQxNjI2NzYzNDE2NDk_UC3784hWjLI.mp3'),
		yes: new Sound('https://www.soundboard.com/mediafiles/ot/OTAyMTI2NzY5MDIyMzY_nZyNlpDh6EI.mp3'),
	},
	/** @type {Value[]} */
	values: [],
};
Game.values = caseValues.map(v => new Value(v));

Game.build(); // construct game
Game.new(); // reset game
const clickFunction = () => {
	Game.sfx.theme.play();
	document.removeEventListener('click', clickFunction);
};
document.addEventListener('click', clickFunction);