/* global ACTUARIAL_TABLE, Gender, Party, POLITICIANS, Position, random, STATES */

const CONST = {
	config: {
		deathRate: 1, // x times normal rate of death
	},
	date: new Date(2024, 2, 5), // sim starts after March 5th - super tuesday - 8 months before the election
	dates: {
		election: new Date(2024, 10, 5),
		inauguration: new Date(2025, 0, 20),
	},
	dur: {
		day: 24*60*60*1000,
		get year(){
			return 365.25 * this.day;
		},
	},
	flags: {
		election_held: false,
	},
	nom_r_vp_candidates: [
		// https://electionbettingodds.com/RepublicanVicePresident_2024.html
		['Tim Scott', 0.207],
		['Kristi Noem', 0.113],
		['Elise Stefanik', 0.075],
		['James Vance', 0.066],
		['Ben Carson', 0.056],
		// no way Haley accepts VP lol
		['Vivek Ramaswamy', 0.033],
		['Byron Donalds', 0.029],
		// the following %s are guesses
		['Doug Burgum', 0.02],
		['Tucker Carlson', 0.02],
	],
	/** @type {Politician[]} */
	politicians: [],
	positions: {
		/** @type {Politician} */
		president: undefined,
		/** @type {Politician} */
		vice_president: undefined,
		/** @type {Politician} */
		house_speaker: undefined,
		/** @type {Politician} */
		nom_d_p: undefined,
		/** @type {Politician} */
		nom_d_vp: undefined,
		/** @type {Politician} */
		nom_r_p: undefined,
		/** @type {Politician} */
		nom_r_vp: undefined,
		// 'secret' backups...
		/** @type {Politician} */
		BACKUP_d_vp: undefined,
		/** @type {Politician} */
		BACKUP_r_vp: undefined,
		/** @type {Politician} */
		BACKUP_house_speaker: undefined,
	},
	position_backups: {
		president: 'vice_president',
		nom_d_p: 'nom_d_vp', // it's a fair guess
		nom_r_p: 'nom_r_vp', // it's a fair guess
		nom_d_vp: 'BACKUP_d_vp',
		nom_r_vp: 'BACKUP_r_vp',
		house_speaker: 'BACKUP_house_speaker',
	},
	/** @type {State[]} */
	states: [],
	// methods
	alert(s){
		const str = `${this.date.toDateString()}: ${s}`;
		console.info(str);
		const elem = document.createElement('div');
		elem.classList.add('message');
		elem.innerHTML = str;
		document.getElementById('console').appendChild(elem);
	},
	checkPositions(){
		for (const x in this.positions)
			if ((!this.positions[x] || !this.positions[x].alive) && this.position_backups[x]){
				// eslint-disable-next-line max-len
				this.alert(`filling ${x} with ${this.position_backups[x]} (${this.positions[this.position_backups[x]].name})...`);
				this.positions[x] = this.positions[this.position_backups[x]];
				this.positions[this.position_backups[x]] = undefined;
			}
	},
	holdElection(){
		console.info('holding election...');
		this.flags.election_held = true;
		let d = 0;
		let r = 0;
		this.states.forEach(state => {
			if (Math.random() < state.p_rep)
				r += state.ev;
			else
				d += state.ev;
		});
		this.alert(`<br>ELECTION RESULTS:<br>
		${this.positions.nom_d_p.name} / ${this.positions.nom_d_vp.name} : ${d} EVs<br>
		${this.positions.nom_r_p.name} / ${this.positions.nom_r_vp.name} : ${r} EVs`);
	},
};

class State {
	/**
	 * @param {string} name
	 * @param {number} ev electoral votes
	 * @param {number} p_rep chance the repubs win this state
	 */
	constructor(name, ev, p_rep){
		this.name = name;
		this.ev = ev;
		this.p_rep = p_rep;
		CONST.states.push(this);
	}
	get victor(){
		return Math.random() < this.p_rep ? 1 : 0;
	}
}

class Politician {
	/**
	 * @param {string} name
	 * @param {Date} dob
	 * @param {Gender} gender
	 * @param {Party} party
	 * @param {Position} pos political position (eg. "Governor")
	 */
	constructor(name, dob, gender, party, pos = Position.NONE){
		this.name = name;
		this.dob = dob;
		this.gender = gender;
		this.party = party;
		this.position = pos;
		this.alive = true;
		CONST.politicians.push(this);
	}
	get age(){
		return Math.floor((CONST.date - this.dob) / CONST.dur.year);
	}
	get annual_death_chance(){
		return 1 - Math.pow(1 - ACTUARIAL_TABLE[this.age][this.gender], CONST.config.deathRate);
	}
	get daily_death_chance(){
		return 1 - Math.pow(1-this.annual_death_chance, 1/365.25);
	}
	get eligible_for_president(){
		return 35 < this.age;
	}
	tick(){
		if (!this.alive)
			return;
		// dies
		if (Math.random() < this.daily_death_chance){
			this.alive = false;
			CONST.alert(`${this.name} has died!`);
			CONST.checkPositions();
		}
	}
	static fromName(name){
		return CONST.politicians.find(p => p.name === name);
	}
}

// https://en.wikipedia.org/wiki/Twelfth_Amendment_to_the_United_States_Constitution#Text

function simulation(){
	// initialize simulation...
	console.info('initializing simulation...');
	// todo set prez, vp, speaker
	CONST.positions.nom_d_p = CONST.positions.president = Politician.fromName('Joe Biden');
	CONST.positions.nom_d_vp = CONST.positions.vice_president = Politician.fromName('Kamala Harris');
	CONST.positions.house_speaker = Politician.fromName('Mike Johnson');
	CONST.positions.nom_r_p = Politician.fromName('Donald Trump');
	CONST.positions.nom_r_vp = Politician.fromName(random.weightedChoice(
		CONST.nom_r_vp_candidates.map(x => x[0]),
		CONST.nom_r_vp_candidates.map(x => x[1])
	));
	// if Kamala dies, a random democrat is chosen (other than Biden and Harris)
	CONST.positions.BACKUP_d_vp = random.choice(
		CONST.politicians.filter(p => p.party === Party.DEMOCRATIC
			&& p !== CONST.positions.nom_d_p && p !== CONST.positions.nom_d_vp)
	);
	// if VP dies, a random republican is chosen (other than Trump and VP)
	CONST.positions.BACKUP_r_vp = random.choice(
		CONST.politicians.filter(p => p.party === Party.REPUBLICAN
			&& p !== CONST.positions.nom_r_p && p !== CONST.positions.nom_r_vp)
	);
	// if house speaker dies, a random republican representative is chosen (Other than Johnson)
	CONST.positions.BACKUP_house_speaker = random.choice(
		CONST.politicians.filter(p => p.party === Party.REPUBLICAN
			&& p.position === Position.REPRESENTATIVE && p !== CONST.positions.house_speaker)
	);
	// trump veep choice
	CONST.alert(`${CONST.positions.nom_r_p.name} chose ${CONST.positions.nom_r_vp.name} as VP`);
	// start!
	while (CONST.date < CONST.dates.inauguration){
		// console.log(CONST.date);
		// see if someone dies
		CONST.politicians.forEach(p => p.tick());
		// election
		if (CONST.dates.election <= CONST.date && !CONST.flags.election_held)
			CONST.holdElection();
		// increment date by 1
		CONST.date = new Date(+CONST.date + CONST.dur.day);
	}
	console.info('Simulation complete!');
}

function main(){
	// wait for data to load...
	if (typeof random === 'undefined' || typeof POLITICIANS === 'undefined' || typeof STATES === 'undefined')
		return setTimeout(main, 100);
	// parse data
	POLITICIANS.forEach(o => new Politician(o.name, o.dob, o.gender, o.party, o.position));
	STATES.forEach(o => new State(...o));
	// eslint-disable-next-line max-len
	console.info(`election.js loaded ${CONST.politicians.length} politicians and ${CONST.states.length} states.`);
	// run sim
	simulation();
}

main();