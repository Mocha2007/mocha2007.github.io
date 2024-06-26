/* exported ACTUARIAL_TABLE, EVENTS, Gender, Party, Position */

class Gender {
	static #id_ = 0;
	constructor(name, pronouns, color = 'white'){
		this.name = name;
		this.pronouns = pronouns;
		this.color = color;
		this.id = Gender.#id_++;
	}
	get abbr(){
		return this.name[0];
	}
	get html(){
		return `<span class="gender" style="color: ${this.color}" title="${this.pronouns}">${this.abbr}</span>`;
	}
	static FEMALE = new Gender('Female', 'she/her', '#f8f');
	static MALE = new Gender('Male', 'he/him', '#08f');
	static NONBINARY = new Gender('Nonbinary', 'they/them', 'white');
}

class Party {
	/** @param {string} name */
	constructor(name){
		/** @type {string} */
		this.name = name;
		Party.parties.push(this);
	}
	get abbr(){
		return this.name[0];
	}
	/** @type {Party[]} */
	static parties = [];
	static INDEPENDENT = new Party('Independent');
	static DEMOCRATIC = new Party('Democratic');
	static REPUBLICAN = new Party('Republican');
	static LIBERTARIAN = new Party('Libertarian');
	static GREEN = new Party('Green');
	static JFA = new Party('Justice For All');
}

class Position {
	static NONE = -1;
	static GOVERNOR = 0;
	static REPRESENTATIVE = 1;
	static SENATOR = 2;
	static VICE_PRESIDENT = 3;
	static PRESIDENT = 4;
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

const EVENTS = [
	// https://www.nytimes.com/live/2024/05/15/us/biden-trump-election
	[new Date(2024, 4, 30), 'Donald Trump is convicted of financial crimes.'],
	[new Date(2024, 5, 11), '538 Releases their election tracker.'],
	[new Date(2024, 5, 27), 'The first private debate between the two major party candidates is hosted on CNN.'],
	[new Date(2024, 6, 11), 'The Green National Convention is held online.'],
	[new Date(2024, 6, 11), 'Donald Trump is sentenced.'],
	[new Date(2024, 6, 15), 'The Republican National Convention is held in Milwaukee, WI.'],
	[new Date(2024, 7, 19), 'The Democratic National Convention is held in Chicago, IL.'],
	[new Date(2024, 8, 10), 'The second private debate between the two major party candidates is hosted on ABC.'],
	[new Date(2024, 8, 16), 'The first presidential debate is held at the Texas State University in San Marcos, TX.'],
	[new Date(2024, 8, 25), 'The only vice presidential debate is held at the Lafayette College in Easton, PA.'],
	[new Date(2024, 9, 1), 'The second presidential debate is held at the Virginia State University in Petersburg, VA.'],
	[new Date(2024, 9, 9), 'The third presidential debate is held at the University of Utah in Salt Lake City, UT.'],
	[new Date(2025, 0, 6), 'Electoral votes are formally counted before a joint session of Congress; the president of the Senate formally announces the electoral result.'],
];
EVENTS.i = 0;