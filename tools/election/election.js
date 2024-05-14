/* global ACTUARIAL_TABLE, MapElem, Party, POLITICIANS, Position, random, round, STATES */

const CONST = {
	config: {
		deathRate: 1, // x times normal rate of death
		eligibleVoters: 0.72,
		errorFuzzing: 0.05, // max state variation in systemic polling error
		forceErrorX: 0, // set to 0.5 to use exact polling data, set to 1 to set max rep win, set to epsilon for max dem win
		mortal: true,
		nClosestRaces: 3,
		recountMargin: 0.01, // todo
		speakerRemovalDailyChance: 0.001,
		timestep: 1, // days
		turnout: 0.66,
	},
	date: new Date(2024, 2, 5), // sim starts after March 5th - super tuesday - 8 months before the election
	dates: {
		election: new Date(2024, 10, 5),
		inauguration: new Date(2025, 0, 20),
		start: new Date(2024, 2, 5),
	},
	debug_mode: false,
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
		['Tim Scott', 0.18],
		['James Vance', 0.128],
		['Elise Stefanik', 0.058],
		['Ben Carson', 0.045],
		// no way Haley accepts VP lol
		['Vivek Ramaswamy', 0.023],
		// ['Byron Donalds', 0.019], prob. not because his home state is also FL
		// no way Kennedy accepts VP lol
		// the following %s are guesses
		['Doug Burgum', 0.02],
		['Kristi Noem', 0.02],
		// ['Tucker Carlson', 0.02], prob. not because his home state is also FL
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
		nom_p: undefined,
		/** @type {Politician} */
		nom_vp: undefined,
		/** @type {Politician} */
		nom_d_p: undefined,
		/** @type {Politician} */
		nom_d_vp: undefined,
		/** @type {Politician} */
		nom_r_p: undefined,
		/** @type {Politician} */
		nom_r_vp: undefined,
		/** @type {Politician} */
		nom_rfk_p: undefined,
		/** @type {Politician} */
		nom_rfk_vp: undefined,
	},
	position_backups: {
		president: () => ({x: CONST.positions.vice_president, y: 'vice_president'}),
		nom_p: () => ({x: CONST.positions.nom_vp, y: 'nom_vp'}),
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
		this.alertElem(elem);
	},
	alertElem(elem){
		if (this.debug_mode)
			return;
		document.getElementById('console').appendChild(elem);
	},
	checkPositions(){
		for (const x in this.positions)
			if ((!this.positions[x] || !this.positions[x].alive) && this.position_backups[x]){
				const bu = this.position_backups[x]();
				if (!bu.x)
					continue;
				this.alert(`filling ${x} with ${bu.y || 'random'} (${bu.x.html})...`);
				this.positions[x] = bu.x;
				this.positions[bu.y] = undefined;
			}
	},
	holdElection(){
		this.flags.election_held = true;
		let d = 0;
		let r = 0;
		let d_pop = 0;
		let r_pop = 0;
		let rfk_pop = 0;
		const TICKET_D = `${this.positions.nom_d_p.html} / ${this.positions.nom_d_vp.html}`;
		const TICKET_R = `${this.positions.nom_r_p.html} / ${this.positions.nom_r_vp.html}`;
		const TICKET_RFK = `${this.positions.nom_rfk_p.html} / ${this.positions.nom_rfk_vp.html}`;
		const results = [];
		const pollingError = this.config.forceErrorX
			|| random.uniform(CONST.config.errorFuzzing, 1 - CONST.config.errorFuzzing);
		this.states.forEach(state => {
			const result = state.results(pollingError
				+ random.uniform(-CONST.config.errorFuzzing, CONST.config.errorFuzzing));
			const winner = result.D < result.R ? 'R' : 'D';
			if (winner === 'R')
				r += state.ev;
			else
				d += state.ev;
			results.push([state.name, winner, state.swing, result.margin]);
			// popular vote tally
			d_pop += result.D;
			r_pop += result.R;
			rfk_pop += result.RFK;
			// recount
			if (result.recount)
				this.alert(`The margin in ${state.name} was close enough to warrant a recount
				(${round(state.recountMargin * 100, 2)}%);
			final results will be delayed for a few weeks.`);
		});
		this.alert(`<br>ELECTION RESULTS:<br>
		${TICKET_D} : ${d} EVs (${d_pop.toLocaleString()} votes)<br>
		${TICKET_R} : ${r} EVs (${r_pop.toLocaleString()} votes)<br>
		${TICKET_RFK} : 0 EVs (${rfk_pop.toLocaleString()} votes)`);
		// fancy map
		this.alertElem(MapElem.table(results));
		// closest races
		this.alert(`${this.config.nClosestRaces} closest races:`);
		results.sort((a, b) => Math.abs(a[3]) - Math.abs(b[3]));
		for (let i = 0; i < this.config.nClosestRaces; i++)
			this.alert(`(${i+1}) ${results[i][0]} - ${round(results[i][3] * 100, 2)}%`);
		// winner declaration / tie
		// tie?
		if (d === r)
			this.evTie();
		else if (r < d){
			this.alert(`${TICKET_D.replace(' / ', ' and ')} win!`);
			this.positions.nom_p = this.positions.nom_d_p;
			this.positions.nom_vp = this.positions.nom_d_vp;
		}
		else {
			this.alert(`${TICKET_R.replace(' / ', ' and ')} win!`);
			this.positions.nom_p = this.positions.nom_r_p;
			this.positions.nom_vp = this.positions.nom_r_vp;
		}
	},
	evTie(){
		// choose president since the EV is tied.
		this.alert('Due to the EV tie, the house will elect the president, and the senate will elect the vice president.');
		// republicans control the house. they choose trump.
		this.alert(`The house elects ${this.positions.nom_r_p.html} president`);
		this.positions.nom_p = this.positions.nom_r_p;
		// democrats control the senate. they choose harris.
		this.alert(`The house elects ${this.positions.nom_d_vp.html} vice president`);
		this.positions.nom_vp = this.positions.nom_d_vp;
	},
	inauguration(){
		this.positions.president = this.positions.nom_p;
		this.positions.vice_president = this.positions.nom_vp;
		try {
			this.alert(`Inauguration of ${this.positions.president.html}
				and ${this.positions.vice_president.html}`);
		}
		catch (e){
			// pass
		}
		return {p: this.positions.president, vp: this.positions.vice_president};
	},
	debug(n = 1000, use_debug = true){
		this.debug_mode = use_debug;
		const outcomes = [];
		for (let i = 0; i < n; i++){
			const o = simulation();
			const p = o.p ? o.p.name : '';
			const vp = o.vp ? o.vp.name : '';
			outcomes.push(`${p}\t${vp}`);
		}
		this.debug_mode = false;
		return outcomes.join('\n');
	},
};

class State {
	/**
	 * @param {string} name
	 * @param {number} ev electoral votes
	 * @param {Polling} polling
	 * @param {number} pop 1M default
	 * @param {number} recountMargin margin in % to warrant a vote recount based on state law https://ballotpedia.org/Vote_margins_required_for_election_recounts,_2020
	 */
	constructor(name, ev, polling, pop = 1e6, recountMargin = 0){
		this.name = name;
		this.ev = ev;
		this.polling = polling;
		this.pop = pop;
		this.recountMargin = recountMargin;
		CONST.states.push(this);
	}
	get swing(){
		return Math.abs(this.polling.r - this.polling.d) < 0.1;
	}
	results(x = 0.5){
		const c = this.polling.actual(x);
		const R = Math.round(this.pop * c.R * CONST.config.eligibleVoters * CONST.config.turnout);
		const D = Math.round(this.pop * c.D * CONST.config.eligibleVoters * CONST.config.turnout);
		// eslint-disable-next-line max-len
		const RFK = Math.round(this.pop * c.RFK * CONST.config.eligibleVoters * CONST.config.turnout);
		const sum = R + D + RFK;
		const margin = c.R - c.D;
		const recount = Math.abs(margin) < this.recountMargin;
		return {R, D, sum, recount, margin, RFK};
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
		this.position = o.position || Position.NONE;
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
		return 1 - Math.pow(1-this.annual_death_chance, CONST.config.timestep/365.25);
	}
	get eligible_for_president(){
		return 35 < this.age && this.alive;
	}
	get html(){
		// eslint-disable-next-line max-len
		return `${this.name} (<span class='char_${this.party.abbr}'>${this.party.abbr}</span>-${this.state})`;
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
			CONST.alert(`${this.html} has died!`);
			CONST.checkPositions();
		}
	}
	static fromName(name){
		return CONST.politicians.find(p => p.name === name);
	}
}

// https://en.wikipedia.org/wiki/Twelfth_Amendment_to_the_United_States_Constitution#Text

function simulation(){
	// initialize/reset simulation...
	CONST.politicians.forEach(p => p.alive = true);
	CONST.date = CONST.dates.start;
	CONST.flags.election_held = false;
	// set prez, vp, speaker
	CONST.positions.nom_d_p = CONST.positions.president = Politician.fromName('Joe Biden');
	CONST.positions.nom_d_vp = CONST.positions.vice_president = Politician.fromName('Kamala Harris');
	CONST.positions.nom_rfk_p = Politician.fromName('Robert Kennedy');
	CONST.positions.nom_rfk_vp = Politician.fromName('Nicole Shanahan');
	CONST.positions.house_speaker = Politician.fromName('Mike Johnson');
	CONST.positions.nom_r_p = Politician.fromName('Donald Trump');
	// trump veep choice - random day in July or August
	// https://docs.google.com/spreadsheets/d/1A4S_VrL-ZLOflY1Y4SGoKAZumv4xHQmYg4TWszrn9vw
	CONST.positions.nom_r_vp = undefined;
	const TRUMP_VP_SELECTION_DATE = new Date(2024, random.randint(6, 7), random.randint(1, 31));
	// start!
	CONST.alert('Super Tuesday');
	while (CONST.date < CONST.dates.inauguration){
		// see if someone dies
		if (CONST.config.mortal)
			CONST.politicians.forEach(p => p.tick());
		// Trump VP selection
		if (!CONST.positions.nom_r_vp && TRUMP_VP_SELECTION_DATE <= CONST.date){
			CONST.positions.nom_r_vp = Politician.fromName(random.weightedChoice(
				CONST.nom_r_vp_candidates.map(x => x[0]),
				CONST.nom_r_vp_candidates.map(x => x[1])
			));
			// eslint-disable-next-line max-len
			CONST.alert(`${CONST.positions.nom_r_p.html} chose ${CONST.positions.nom_r_vp.html} as VP`);
		}
		// remove the speaker
		// eslint-disable-next-line max-len
		if (Math.random() < Math.pow(CONST.config.speakerRemovalDailyChance, CONST.config.timestep)){
			// eslint-disable-next-line max-len
			CONST.alert(`The house has voted to oust ${CONST.positions.house_speaker.html} from the speaker role.`);
			CONST.positions.house_speaker = undefined;
			CONST.checkPositions();
		}
		// election
		if (CONST.dates.election <= CONST.date && !CONST.flags.election_held)
			CONST.holdElection();
		// increment date by 1
		CONST.date = new Date(+CONST.date + CONST.dur.day * CONST.config.timestep);
	}
	return CONST.inauguration();
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