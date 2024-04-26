/* global Gender, Party, POLITICIANS, Position, random, STATES */

const CONST = {
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
		BACKUP_dem_vp: undefined,
		BACKUP_house_speaker: undefined,
	},
	position_backups: {
		president: 'vice_president',
		nom_d_p: 'nom_d_vp', // it's a fair guess
		nom_r_p: 'nom_r_vp', // it's a fair guess
		nom_d_vp: 'BACKUP_dem_vp',
		house_speaker: 'BACKUP_house_speaker',
	},
	/** @type {State[]} */
	states: [],
	// methods
	alert(s){
		console.info(`${this.date}: ${s}`);
	},
	checkPositions(){
		for (let x in this.positions)
			if (this.positions[x] && !this.positions[x].alive && this.position_backups[x]){
				// eslint-disable-next-line max-len
				this.alert(`filling ${x} (${this.positions[x].name}) with ${this.position_backups[x]} (${this.positions[this.position_backups[x]].name})...`);
				this.positions[x] = this.positions[this.position_backups[x]];
				this.positions[this.position_backups[x]] = undefined;
			}
	},
	holdElection(){
		this.alert('holding election...');
		this.flags.election_held = true;
		let d = 0;
		let r = 0;
		this.states.forEach(state => {
			if (Math.random() < state.p_rep)
				r += state.ev;
			else
				d += state.ev;
		});
		console.info(`RESULTS:
		${this.positions.nom_d_p.name} : ${d} EVs
		${this.positions.nom_r_p.name} : ${r} EVs`);
	}
};

class State {
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
		return ACTUARIAL_TABLE[this.age][this.gender];
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

// https://www.ssa.gov/oact/STATS/table4c6.html
const ACTUARIAL_TABLE = [
	[0.004907, 0.005837],
	[0.000316, 0.00041],
	[0.000196, 0.000254],
	[0.00016, 0.000207],
	[0.000129, 0.000167],
	[0.000109, 0.000141],
	[0.0001, 0.000123],
	[0.000096, 0.000113],
	[0.000092, 0.000108],
	[0.000089, 0.000114],
	[0.000092, 0.000127],
	[0.000104, 0.000146],
	[0.000123, 0.000174],
	[0.000145, 0.000228],
	[0.000173, 0.000312],
	[0.00021, 0.000435],
	[0.000257, 0.000604],
	[0.000314, 0.000814],
	[0.000384, 0.001051],
	[0.00044, 0.00125],
	[0.000485, 0.001398],
	[0.000533, 0.001524],
	[0.000574, 0.001612],
	[0.000617, 0.001682],
	[0.000655, 0.001747],
	[0.0007, 0.001812],
	[0.000743, 0.001884],
	[0.000796, 0.001974],
	[0.000851, 0.00207],
	[0.000914, 0.002172],
	[0.000976, 0.002275],
	[0.001041, 0.002368],
	[0.001118, 0.002441],
	[0.001186, 0.002517],
	[0.001241, 0.00259],
	[0.001306, 0.002673],
	[0.001386, 0.002791],
	[0.001472, 0.002923],
	[0.001549, 0.003054],
	[0.001637, 0.003207],
	[0.001735, 0.003333],
	[0.00185, 0.003464],
	[0.00195, 0.003587],
	[0.002072, 0.003735],
	[0.002217, 0.003911],
	[0.002383, 0.004137],
	[0.002573, 0.004452],
	[0.002777, 0.004823],
	[0.002984, 0.005214],
	[0.00321, 0.005594],
	[0.003476, 0.005998],
	[0.003793, 0.0065],
	[0.004136, 0.007081],
	[0.004495, 0.007711],
	[0.00487, 0.008394],
	[0.005261, 0.009109],
	[0.005714, 0.009881],
	[0.006227, 0.010687],
	[0.006752, 0.011566],
	[0.007327, 0.012497],
	[0.007926, 0.013485],
	[0.008544, 0.014595],
	[0.009173, 0.015702],
	[0.009841, 0.016836],
	[0.010529, 0.017908],
	[0.011265, 0.018943],
	[0.012069, 0.020103],
	[0.012988, 0.021345],
	[0.014032, 0.02275],
	[0.015217, 0.024325],
	[0.016634, 0.026137],
	[0.018294, 0.028125],
	[0.020175, 0.030438],
	[0.022321, 0.033249],
	[0.02503, 0.036975],
	[0.027715, 0.040633],
	[0.030631, 0.04471],
	[0.0339, 0.049152],
	[0.037831, 0.054265],
	[0.042249, 0.059658],
	[0.047148, 0.065568],
	[0.052545, 0.07213],
	[0.058685, 0.079691],
	[0.065807, 0.088578],
	[0.074052, 0.098388],
	[0.083403, 0.109139],
	[0.093798, 0.120765],
	[0.104958, 0.133763],
	[0.117435, 0.14837],
	[0.13154, 0.164535],
	[0.146985, 0.182632],
	[0.163592, 0.202773],
	[0.181562, 0.223707],
	[0.200724, 0.245124],
	[0.219958, 0.266933],
	[0.23946, 0.288602],
	[0.258975, 0.309781],
	[0.278225, 0.330099],
	[0.296912, 0.349177],
	[0.314727, 0.366635],
	[0.33361, 0.384967],
	[0.353627, 0.404215],
	[0.374844, 0.424426],
	[0.397335, 0.445648],
	[0.421175, 0.46793],
	[0.446446, 0.491326],
	[0.473232, 0.515893],
	[0.501626, 0.541687],
	[0.531724, 0.568772],
	[0.563627, 0.59721],
	[0.597445, 0.627071],
	[0.633292, 0.658424],
	[0.671289, 0.691346],
	[0.711567, 0.725913],
	[0.754261, 0.762209],
	[0.799516, 0.800319],
	[0.840335, 0.840335],
	[0.882352, 0.882352],
	[0.926469, 0.926469],
	[0.972793, 0.972793],
	[1, 1],
];

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
	CONST.positions.BACKUP_dem_vp = random.choice(
		CONST.politicians.filter(p => p.party === Party.DEMOCRATIC
			&& p !== CONST.positions.nom_d_p && p !== CONST.positions.nom_d_vp)
	);
	// if house speaker dies, a random republican representative is chosen (Other than Johnson)
	CONST.positions.BACKUP_house_speaker = random.choice(
		CONST.politicians.filter(p => p.party === Party.REPUBLICAN
			&& p.position === Position.REPRESENTATIVE && p !== CONST.positions.house_speaker)
	);
	// trump veep choice
	console.info(`${CONST.positions.nom_r_p.name} chose ${CONST.positions.nom_r_vp.name} as VP`);
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