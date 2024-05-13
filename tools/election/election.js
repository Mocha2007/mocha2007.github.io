/* global ACTUARIAL_TABLE, Gender, MapElem, Party, POLITICIANS, Position, random, STATES */

const CONST = {
	config: {
		deathRate: 1, // x times normal rate of death
		speakerRemovalDailyChance: 0.001,
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
	},
	position_backups: {
		president: () => ({x: CONST.positions.vice_president, y: 'vice_president'}),
		nom_d_p: () => ({x: CONST.positions.nom_d_vp, y: 'nom_d_vp'}), // it's a fair guess
		nom_r_p: () => ({x: CONST.positions.nom_r_vp, y: 'nom_r_vp'}), // it's a fair guess
		// VP: alive, same party, must be from different state than pres candidate (which also prevents the pres from also becoming veep)
		nom_d_vp: () => ({x: random.choice(CONST.politicians.filter(p => p.alive
			&& p.party === Party.DEMOCRATIC && p.state !== CONST.positions.nom_d_p.state))}),
		nom_r_vp: () => ({x: random.choice(CONST.politicians.filter(p => p.alive
			&& p.party === Party.REPUBLICAN && p.state !== CONST.positions.nom_r_p.state))}),
		house_speaker: () => ({x: random.choice(CONST.politicians.filter(p => p.alive
			&& p.party === Party.REPUBLICAN && p.position === Position.REPRESENTATIVE))}),
	},
	/** @type {State[]} */
	states: [],
	// methods
	alert(s){
		const elem = document.createElement('div');
		elem.classList.add('message');
		elem.innerHTML = `<span class='date'>${this.date.toDateString()}</span>: ${s}`;
		document.getElementById('console').appendChild(elem);
	},
	checkPositions(){
		for (const x in this.positions)
			if ((!this.positions[x] || !this.positions[x].alive) && this.position_backups[x]){
				const bu = this.position_backups[x]();
				this.alert(`filling ${x} with ${bu.y || 'random'} (${bu.x.name})...`);
				this.positions[x] = bu.x;
				this.positions[bu.y] = undefined;
			}
	},
	holdElection(){
		// console.info('holding election...');
		this.flags.election_held = true;
		let d = 0;
		let r = 0;
		const TICKET_D = `${this.positions.nom_d_p.str} / ${this.positions.nom_d_vp.str}`;
		const TICKET_R = `${this.positions.nom_r_p.str} / ${this.positions.nom_r_vp.str}`;
		const results = [];
		this.states.forEach(state => {
			if (Math.random() < state.p_rep){
				r += state.ev;
				results.push([state.name, 'R']);
			}
			else {
				d += state.ev;
				results.push([state.name, 'D']);
			}
		});
		this.alert(`<br>ELECTION RESULTS:<br>
		${TICKET_D} : ${d} EVs<br>
		${TICKET_R} : ${r} EVs`);
		// fancy map
		document.getElementById('console').appendChild(MapElem.table(results));
		// winner declaration / tie
		// tie?
		if (d === r)
			this.evTie();
		else
			this.alert(`${(r < d ? TICKET_D : TICKET_R).replace('/', 'and')} win!`);
	},
	evTie(){
		// choose president since the EV is tied.
		this.alert('Due to the EV tie, the house will elect the president, and the senate will elect the vice president.');
		// republicans control the house. they choose trump.
		this.alert(`The house elects ${this.positions.nom_r_p.str} president`);
		// democrats control the senate. they choose harris.
		this.alert(`The house elects ${this.positions.nom_d_vp.str} vice president`);
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
	constructor(o){
		/** @type {string} */
		this.name = o.name;
		/** @type {Date} */
		this.dob = o.dob;
		/** @type {Gender} */
		this.gender = o.gender;
		/** @type {Party} */
		this.party = o.party || Party.INDEPENDENT;
		/** @type {Position} */
		this.position = o.pos || Position.NONE;
		/** @type {State} */
		this.state = o.state;
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
		return 35 < this.age && this.alive;
	}
	get str(){
		return `${this.name} (${this.party.abbr}-${this.state})`;
	}
	tick(){
		if (!this.alive)
			return;
		// dies
		if (Math.random() < this.daily_death_chance){
			this.alive = false;
			CONST.alert(`${this.str} has died!`);
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
	// todo set prez, vp, speaker
	CONST.positions.nom_d_p = CONST.positions.president = Politician.fromName('Joe Biden');
	CONST.positions.nom_d_vp = CONST.positions.vice_president = Politician.fromName('Kamala Harris');
	CONST.positions.house_speaker = Politician.fromName('Mike Johnson');
	CONST.positions.nom_r_p = Politician.fromName('Donald Trump');
	// trump veep choice - random day in July or August
	// https://docs.google.com/spreadsheets/d/1A4S_VrL-ZLOflY1Y4SGoKAZumv4xHQmYg4TWszrn9vw
	const TRUMP_VP_SELECTION_DATE = new Date(2024, random.randint(6, 7), random.randint(1, 31));
	// start!
	CONST.alert('Super Tuesday');
	while (CONST.date < CONST.dates.inauguration){
		// console.log(CONST.date);
		// see if someone dies
		CONST.politicians.forEach(p => p.tick());
		// Trump VP selection
		if (!CONST.positions.nom_r_vp && TRUMP_VP_SELECTION_DATE <= CONST.date){
			CONST.positions.nom_r_vp = Politician.fromName(random.weightedChoice(
				CONST.nom_r_vp_candidates.map(x => x[0]),
				CONST.nom_r_vp_candidates.map(x => x[1])
			));
			// eslint-disable-next-line max-len
			CONST.alert(`${CONST.positions.nom_r_p.str} chose ${CONST.positions.nom_r_vp.str} as VP`);
		}
		// remove the speaker
		if (Math.random() < CONST.config.speakerRemovalDailyChance){
			// eslint-disable-next-line max-len
			CONST.alert(`The house has voted to oust ${CONST.positions.house_speaker.str} from the speaker role.`);
			CONST.positions.house_speaker = undefined;
			CONST.checkPositions();
		}
		// election
		if (CONST.dates.election <= CONST.date && !CONST.flags.election_held)
			CONST.holdElection();
		// increment date by 1
		CONST.date = new Date(+CONST.date + CONST.dur.day);
	}
	CONST.alert('Inauguration');
}

function main(){
	// wait for data to load...
	if (typeof random === 'undefined' || typeof POLITICIANS === 'undefined' || typeof STATES === 'undefined' || typeof MapElem === 'undefined')
		return setTimeout(main, 100);
	// parse data
	POLITICIANS.forEach(o => new Politician(o));
	STATES.forEach(o => new State(...o));
	// eslint-disable-next-line max-len
	console.info(`election.js loaded ${CONST.politicians.length} politicians and ${CONST.states.length} states.`);
	// run sim
	simulation();
}

main();