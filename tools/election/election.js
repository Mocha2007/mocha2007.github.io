/* eslint-disable max-len */
/* global ACTUARIAL_TABLE, EVENTS, MapElem, Party, POLITICIANS, Position, random, round, STATES, sum */

const CONST = {
	config: {
		deathPenalty: 0.96, // eg. 0.9 => 10% fewer votes when presidential candidate dies. I estimate this from the difference betweeen Biden/Trump and Harris/Trump 2023 polling averages.
		deathRate: 1, // x times normal rate of death
		eligibleVoters: 0.72,
		errorFuzzing: 0.05, // max state variation in systemic polling error
		forceErrorX: 0, // set to 0.5 to use exact polling data, set to 1 to set max rep win, set to epsilon for max dem win
		mortal: true,
		nClosestRaces: 3,
		speakerRemovalDailyChance: 0.001,
		swingMargin: 0.07, // polling margin required to highlight state as a swing state - should be a superset of whatever 538 has as tossup or lean https://projects.fivethirtyeight.com/2024-election-forecast/#state-probabilities
		thirdPartyBuff: 1, // 1 = no change. 0 = no third party votes. 2 = double votes.
		timestep: 1, // days
		turnout: 0.6,
		turnoutMinMax: [0.542, 0.666], // 2000, 2020 - extrema for the 2000s
	},
	date: new Date(2024, 2, 5), // sim starts after March 5th - super tuesday - 8 months before the election
	dates: {
		election: new Date(2024, 10, 5),
		inauguration: new Date(2025, 0, 20),
		start: new Date(2024, 2, 5),
		_538: {
			get args(){
				return [this.start.getMonth(), this.start.getDate() + random.randint(0, this.delta_d_max)];
			},
			start: new Date(2024, 5, 29),
			delta_d_max: 48,
		},
	},
	debug_mode: false,
	dur: {
		day: 24*60*60*1000,
		get year(){
			return 365.25 * this.day;
		},
	},
	flags: {
		_538: false,
		election_held: false,
		partyNomDeath: {},
		trumpChoseVP: false,
	},
	nom_r_vp_candidates: [
		// https://electionbettingodds.com/RepublicanVicePresident_2024.html
		// updated 6/25
		['Doug Burgum', 0.335],
		['James Vance', 0.175],
		['Vivek Ramaswamy', 0.096],
		// ['Byron Donalds', 0.079], prob. not because his home state is also FL
		// ['Marco Rubio', 0.065], fl so no
		['Tim Scott', 0.055],
		['Ben Carson', 0.054],
		['Glenn Youngkin', 0.053],
		['Sarah Sanders', 0.040],
		['Elise Stefanik', 0.032],
		// no way Haley accepts VP lol
		// no way Kennedy accepts VP lol
		['Tom Cotton', 0.014],
		// the following %s are guesses
		// https://www.nytimes.com/interactive/2024/us/politics/donald-trump-vp.html
		// https://www.axios.com/2024/06/06/trump-vp-short-list-top-contenders
		// ['Tucker Carlson', 0.006], prob. not because his home state is also FL
		// ['Tulsi Gabbard', 0.006], insanely unlikely
		['Marjorie Greene', 0.006],
		['Wesley Hunt', 0.012],
		['Kari Lake', 0.006],
		['Nancy Mace', 0.012],
		['Kristi Noem', 0.012],
		['Mike Pompeo', 0.012],
		['John Ratcliffe', 0.012],
		// ['Rick Scott', 0.012], fl so no
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
		nom_i_p: undefined,
		/** @type {Politician} */
		nom_i_vp: undefined,
		/** @type {Politician} */
		nom_j_p: undefined,
		/** @type {Politician} */
		nom_j_vp: undefined,
		/** @type {Politician} */
		nom_g_p: undefined,
		/** @type {Politician} */
		nom_g_vp: undefined,
		/** @type {Politician} */
		nom_l_p: undefined,
		/** @type {Politician} */
		nom_l_vp: undefined,
		/** @type {Politician} */
		nom_s_p: undefined,
		/** @type {Politician} */
		nom_s_vp: undefined,
	},
	position_backups: {
		president: () => ({x: CONST.positions.vice_president, y: 'vice_president'}),
		house_speaker: () => ({x: random.choice(CONST.politicians.filter(p => p.alive
			&& p.party === Party.REPUBLICAN && p.position === Position.REPRESENTATIVE))}),
		// final noms
		nom_p: () => ({x: CONST.positions.nom_vp, y: 'nom_vp'}),
		// todo: pres nominates new vp-elect?
		// nom_vp: () => ({x: CONST.positions.nom_vp, y: 'nom_vp'}),
		// the five party noms
		nom_d_p: () => ({x: CONST.positions.nom_d_vp, y: 'nom_d_vp'}), // it's a fair guess
		nom_r_p: () => ({x: CONST.positions.nom_r_vp, y: 'nom_r_vp'}), // it's a fair guess
		nom_i_p: () => ({x: CONST.positions.nom_i_vp, y: 'nom_i_vp'}), // it's a fair guess
		nom_j_p: () => ({x: CONST.positions.nom_j_vp, y: 'nom_j_vp'}), // it's a fair guess
		nom_g_p: () => ({x: CONST.positions.nom_g_vp, y: 'nom_g_vp'}), // it's a fair guess
		nom_l_p: () => ({x: CONST.positions.nom_l_vp, y: 'nom_l_vp'}), // it's a fair guess
		nom_s_p: () => ({x: CONST.positions.nom_s_vp, y: 'nom_s_vp'}), // it's a fair guess
		// VP: alive, same party, must be from different state than pres candidate (which also prevents the pres from also becoming veep)
		nom_d_vp: () => ({x: random.choice(CONST.politicians.filter(p => p.alive
			&& p.party === Party.DEMOCRATIC && p.state !== CONST.positions.nom_d_p.state))}),
		nom_r_vp: () => ({x:
				CONST.flags.trumpChoseVP
					? random.choice(CONST.politicians.filter(p => p.alive
						&& p.party === Party.REPUBLICAN && p.state !== CONST.positions.nom_r_p.state))
					: undefined, // TRUMP HASNT CHOSEN YET
		}),
		nom_i_vp: () => ({x: random.choice(CONST.politicians.filter(p => p.alive
			&& p.party === Party.INDEPENDENT && p.state !== CONST.positions.nom_i_p.state))}),
		nom_j_vp: () => ({x: random.choice(CONST.politicians.filter(p => p.alive
			&& p.party === Party.JFA && p.state !== CONST.positions.nom_j_p.state))}),
		nom_g_vp: () => ({x: random.choice(CONST.politicians.filter(p => p.alive
			&& p.party === Party.GREEN && p.state !== CONST.positions.nom_g_p.state))}),
		nom_l_vp: () => ({x: random.choice(CONST.politicians.filter(p => p.alive
			&& p.party === Party.LIBERTARIAN && p.state !== CONST.positions.nom_l_p.state))}),
		nom_s_vp: () => ({x: random.choice(CONST.politicians.filter(p => p.alive
			&& p.party === Party.SAL && p.state !== CONST.positions.nom_s_p.state))}),
	},
	/** @type {State[]} */
	states: [],
	// methods
	alert(s, major = true){
		const elem = document.createElement('div');
		elem.classList.add('message');
		const majority = major ? 'major' : 'minor';
		elem.innerHTML = `<span class='date'>${this.date.toDateString()}</span><span class="event_${majority}">: ${s}</span>`;
		this.alertElem(elem);
	},
	alertElem(elem){
		if (this.debug_mode)
			return;
		document.getElementById('console').appendChild(elem);
	},
	checkPositions(){
		for (const x in this.positions){
			// remove dead people from office, even if they DON'T have a backup...
			if (this.positions[x] && !this.positions[x].alive)
				this.positions[x] = undefined;
			if (!this.positions[x] && this.position_backups[x]){
				const bu = this.position_backups[x]();
				if (!bu.x)
					continue;
				this.alert(`filling ${x} with ${bu.y || 'random'} (${bu.x.html})...`);
				this.positions[x] = bu.x;
				this.positions[bu.y] = undefined;
			}
		}
	},
	holdElection(){
		this.alert('ELECTION 2024');
		this.flags.election_held = true;
		const ev = {D: 0, R: 0, I: 0, J: 0, G: 0, L: 0, S: 0};
		const pv = {D: 0, R: 0, I: 0, J: 0, G: 0, L: 0, S: 0};
		let turnout = 0;
		const TICKET_D = `${this.positions.nom_d_p.html} / ${this.positions.nom_d_vp.html}`;
		const TICKET_R = `${this.positions.nom_r_p.html} / ${this.positions.nom_r_vp.html}`;
		const TICKET_I = `${this.positions.nom_i_p.html} / ${this.positions.nom_i_vp.html}`;
		const TICKET_J = `${this.positions.nom_j_p.html} / ${this.positions.nom_j_vp.html}`;
		const TICKET_G = `${this.positions.nom_g_p.html} / ${this.positions.nom_g_vp.html}`;
		const TICKET_L = `${this.positions.nom_l_p.html} / ${this.positions.nom_l_vp.html}`;
		const TICKET_S = `${this.positions.nom_s_p.html} / ${this.positions.nom_s_vp.html}`;
		/** @type {[State, *][]} */
		const results = [];
		const pollingError = this.config.forceErrorX
			|| random.uniform(CONST.config.errorFuzzing, 1 - CONST.config.errorFuzzing);
		this.states.forEach(state => {
			const result = state.results(pollingError
				+ random.uniform(-CONST.config.errorFuzzing, CONST.config.errorFuzzing));
			ev[result.winner.abbr] += state.ev;
			results.push([state, result]);
			// popular vote tally
			if (!state.votesDontCount)
				'DRIJGLS'.split('').forEach(p => {
					const v = result.result.find(x => x[0].abbr === p)[1];
					pv[p] += v;
					turnout += v;
				});
			// recount
			if (result.recount)
				this.alert(`The margin in ${state.name} was close enough to warrant a recount
				(${round(state.recountMargin * 100, 2)}%);
			final results will be delayed for a few weeks.`, false);
		});
		this.alert(`<br>ELECTION RESULTS:<br>
		${TICKET_D} : ${ev.D} EVs (${pv.D.toLocaleString()} votes - ${round(pv.D / turnout * 100, 2)}%)<br>
		${TICKET_R} : ${ev.R} EVs (${pv.R.toLocaleString()} votes - ${round(pv.R / turnout * 100, 2)}%)<br>
		${TICKET_I} : ${ev.I} EVs (${pv.I.toLocaleString()} votes - ${round(pv.I / turnout * 100, 2)}%)<br>
		${TICKET_J} : ${ev.J} EVs (${pv.J.toLocaleString()} votes - ${round(pv.J / turnout * 100, 2)}%)<br>
		${TICKET_G} : ${ev.G} EVs (${pv.G.toLocaleString()} votes - ${round(pv.G / turnout * 100, 2)}%)<br>
		${TICKET_L} : ${ev.L} EVs (${pv.L.toLocaleString()} votes - ${round(pv.L / turnout * 100, 2)}%)<br>
		${TICKET_S} : ${ev.S} EVs (${pv.S.toLocaleString()} votes - ${round(pv.S / turnout * 100, 2)}%)`);
		this.alert(`Turnout: ${round(this.config.turnout * 100, 1)}%`);
		// fancy map
		this.alertElem(MapElem.table(results));
		// closest races
		this.alert(`${this.config.nClosestRaces} closest races:`);
		results.sort((a, b) => Math.abs(a[1].margin) - Math.abs(b[1].margin));
		for (let i = 0; i < this.config.nClosestRaces; i++)
			this.alert(`(${i+1}) ${results[i][0].name} -
			${round(results[i][1].margin * 100, 2)}%
			(${results[i][1].marginAbs.toLocaleString()} votes)`);
		// winner declaration / tie
		const winner = 'DRIJGLS'.split('').find(char => 270 <= ev[char]);
		// tie?
		switch (winner){
			case 'D':
				this.alert(`${TICKET_D.replace(' / ', ' and ')} win!`);
				this.positions.nom_p = this.positions.nom_d_p;
				this.positions.nom_vp = this.positions.nom_d_vp;
				break;
			case 'R':
				this.alert(`${TICKET_R.replace(' / ', ' and ')} win!`);
				this.positions.nom_p = this.positions.nom_r_p;
				this.positions.nom_vp = this.positions.nom_r_vp;
				break;
			case 'I':
				this.alert(`${TICKET_I.replace(' / ', ' and ')} win!`);
				this.positions.nom_p = this.positions.nom_i_p;
				this.positions.nom_vp = this.positions.nom_i_vp;
				break;
			default:
				this.evTie();
		}
	},
	evTie(){
		// choose president since the EV is tied.
		this.alert('Due to no candidate getting a majority in the electoral college, the house will elect the president, and the senate will elect the vice president.');
		// republicans control the house. they choose trump.
		this.alert(`The house elects ${this.positions.nom_r_p.html} president`);
		this.positions.nom_p = this.positions.nom_r_p;
		// democrats control the senate. they choose harris or biden randomly.
		this.positions.nom_vp = random.choice([this.positions.nom_d_p, this.positions.nom_d_vp]);
		this.alert(`The senate elects ${this.positions.nom_vp.html} vice president`);
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
	// @ n = 1000, takes about 54s
	debug(n = 1000, use_debug = true){
		if (!use_debug)
			this.dates.start = new Date();
		this.debug_mode = use_debug;
		const outcomes = [];
		const START = new Date();
		const DIVISION = Math.floor(n/10);
		for (let i = 0; i < n; i++){
			try {
				const o = simulation();
				const p = o.p ? o.p.name : '';
				const vp = o.vp ? o.vp.name : '';
				outcomes.push(`${p}\t${vp}`);
			}
			catch (e){
				i--; // ignore this attempt
				console.error(e);
			}
			// progress
			if (i && i % DIVISION === 0){
				const f = i/n;
				const t = new Date() - START;
				console.debug(`${Math.round(100*f)}%; ETA = ${Math.round((t/f - t)/1000)} s`);
			}
		}
		const t = new Date() - START;
		console.debug(`T = ${t/1000} s; ${t/n} ms avg.`);
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
	 * @param {number} pollClose in hours after noon (eg. 11.00 for 11 PM), EST (UTC-5). (DST ends first sunday in Nov, so 3 Nov 2024)
	 * @param {number} ET_OFFSET time zone offset from ET
	 */
	constructor(name, ev, polling, pop = 1e6, recountMargin = 0, pollClose = 8, ET_OFFSET = 0){
		this.name = name;
		this.ev = ev;
		this.polling = polling;
		this.pop = pop;
		this.recountMargin = recountMargin;
		this.pollClose = pollClose;
		this.ET_OFFSET = ET_OFFSET;
		CONST.states.push(this);
	}
	get pollCloseTime(){
		const t = new Date(CONST.dates.election);
		t.setHours(12 + this.pollClose);
		// fixes if eg. 7:30, that gets changed to eg. 7 without following line
		t.setMinutes(this.pollClose % 1 * 60);
		const t2 = new Date(t);
		t.setHours(t.getHours() + this.ET_OFFSET);
		return {t, t2};
	}
	get pollCloseTimeString(){
		const t = this.pollCloseTime;
		return `Polls close at ${t.t.toLocaleTimeString()} local time (${t.t2.toLocaleTimeString()} ET)`;
	}
	/** prevents double-counting of districts in popular vote totals */
	get votesDontCount(){
		return 2 < this.name.length;
	}
	get swing(){
		return Math.abs(this.polling.r - this.polling.d) < CONST.config.swingMargin;
	}
	results(x = 0.5){
		const c = this.polling.actual(x);
		const R = Math.round(this.pop * c.R * CONST.config.eligibleVoters * CONST.config.turnout);
		const D = Math.round(this.pop * c.D * CONST.config.eligibleVoters * CONST.config.turnout);
		const I = Math.round(this.pop * c.RFK * CONST.config.eligibleVoters * CONST.config.turnout);
		const J = Math.round(this.pop * c.WEST * CONST.config.eligibleVoters * CONST.config.turnout);
		const G = Math.round(this.pop * c.G * CONST.config.eligibleVoters * CONST.config.turnout);
		const L = Math.round(this.pop * c.L * CONST.config.eligibleVoters * CONST.config.turnout);
		const S = Math.round(this.pop * c.S * CONST.config.eligibleVoters * CONST.config.turnout);
		const result = [
			[Party.REPUBLICAN, R],
			[Party.DEMOCRATIC, D],
			[Party.INDEPENDENT, I],
			[Party.JFA, J],
			[Party.GREEN, G],
			[Party.LIBERTARIAN, L],
			[Party.SAL, S],
		];
		result.sort((a, b) => b[1] - a[1]);
		const total = sum(result.map(a => a[1]));
		const resultP = result.map(a => [a[0], a[1] / total]);
		/** @type {Party} */
		const winner = result[0][0];
		const marginAbs = result[0][1] - result[1][1];
		const margin = marginAbs / sum(result.map(a => a[1]));
		const recount = Math.abs(margin) < this.recountMargin;
		return {result, winner, margin, marginAbs, recount, total, resultP};
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
		return 1 - Math.pow(1 - ACTUARIAL_TABLE[this.age][this.gender.id], CONST.config.deathRate);
	}
	get daily_death_chance(){
		return 1 - Math.pow(1-this.annual_death_chance, 1/365.25);
	}
	get eligible_for_president(){
		return 35 < this.age && this.alive;
	}
	get html(){
		return `${this.name} (<span class='char_${this.party.abbr}'>${this.party.abbr}</span>-${this.state}
			${this.age}${this.gender.html})`;
	}
	get str(){
		return `${this.name} (${this.party.abbr}-${this.state})`;
	}
	die(){
		this.alive = false;
		// todo: if head of party, set party head death flag!
		if (CONST.positions[`nom_${this.party.abbr.toLowerCase()}_p`])
			CONST.flags.partyNomDeath[this.party.abbr] = true;
		CONST.alert(`${this.html} has died!`);
		CONST.checkPositions();
	}
	tick(){
		if (!this.alive)
			return;
		// dies
		for (let i = 0; i < CONST.config.timestep; i++)
			if (Math.random() < this.daily_death_chance)
				this.die();
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
	CONST.flags.trumpChoseVP = false;
	CONST.config.turnout = random.uniform(...CONST.config.turnoutMinMax); // random turnout
	CONST.flags.partyNomDeath = {};
	Party.parties.forEach(p => CONST.flags.partyNomDeath[p.abbr] = false);
	// set prez, vp, speaker
	CONST.positions.nom_d_p = CONST.positions.president = Politician.fromName('Joe Biden');
	CONST.positions.nom_d_vp = CONST.positions.vice_president = Politician.fromName('Kamala Harris');
	CONST.positions.house_speaker = Politician.fromName('Mike Johnson');
	CONST.positions.nom_r_p = Politician.fromName('Donald Trump');
	// trump veep choice - random day in July or August
	// https://docs.google.com/spreadsheets/d/1A4S_VrL-ZLOflY1Y4SGoKAZumv4xHQmYg4TWszrn9vw
	CONST.positions.nom_r_vp = undefined;
	const TRUMP_VP_SELECTION_DATE = new Date(2024, random.randint(6, 7), random.randint(1, 31));
	// third parties
	CONST.positions.nom_i_p = Politician.fromName('Robert Kennedy');
	CONST.positions.nom_i_vp = Politician.fromName('Nicole Shanahan');
	CONST.positions.nom_j_p = Politician.fromName('Cornel West');
	CONST.positions.nom_j_vp = Politician.fromName('Melina Abdullah');
	CONST.positions.nom_g_p = Politician.fromName('Jill Stein');
	CONST.positions.nom_g_vp = Politician.fromName('Jasmine Sherman'); // placeholder
	CONST.positions.nom_l_p = Politician.fromName('Chase Oliver');
	CONST.positions.nom_l_vp = Politician.fromName('Mike ter Maat');
	CONST.positions.nom_s_p = Politician.fromName('Claudia de la Cruz');
	CONST.positions.nom_s_vp = Politician.fromName('Karina Garcia');
	// 538
	// const DATE_538 = new Date(2024, ...CONST.dates._538.args);
	// start!
	CONST.alert('Super Tuesday');
	while (CONST.date < CONST.dates.inauguration){
		// see if someone dies
		if (CONST.config.mortal)
			CONST.politicians.forEach(p => p.tick());
		// Trump VP selection
		if (!CONST.flags.trumpChoseVP && TRUMP_VP_SELECTION_DATE <= CONST.date){
			CONST.positions.nom_r_vp = Politician.fromName(random.weightedChoice(
				CONST.nom_r_vp_candidates.map(x => x[0]),
				CONST.nom_r_vp_candidates.map(x => x[1])
			));
			CONST.flags.trumpChoseVP = true;
			// if Trump dies too early, repubs just choose the veep
			if (!CONST.positions.nom_r_p){
				CONST.positions.nom_r_p = CONST.positions.nom_r_vp;
				CONST.positions.nom_r_vp = CONST.position_backups.nom_r_vp().x;
				// console.debug('Emergency Trump veep fill!');
			}
			CONST.alert(`${CONST.positions.nom_r_p.html} chose ${CONST.positions.nom_r_vp.html} as VP`);
		}
		// remove the speaker
		if (Math.random() < Math.pow(CONST.config.speakerRemovalDailyChance, CONST.config.timestep)){
			CONST.alert(`The house has voted to oust ${CONST.positions.house_speaker.html} from the speaker role.`);
			CONST.positions.house_speaker = undefined;
			CONST.checkPositions();
		}
		// election
		if (CONST.dates.election <= CONST.date && !CONST.flags.election_held)
			CONST.holdElection();
		// election
		// if (DATE_538 <= CONST.date && !CONST.flags._538){
		// 	CONST.alert('538 uploads their election tracker.', false);
		// 	CONST.flags._538 = true;
		// }
		// misc events
		if (!CONST.debug_mode)
			while (EVENTS.i < EVENTS.length && EVENTS[EVENTS.i][0] <= CONST.date)
				CONST.alert(EVENTS[EVENTS.i++][1], false);
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
	console.info(`election.js loaded ${CONST.politicians.length} politicians and ${CONST.states.length} states.`);
	// run sim
	simulation();
}

main();