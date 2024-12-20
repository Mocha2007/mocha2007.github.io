/* exported STATES */
/* global CONST, Party, random */

class Polling {
	constructor(r = 0.5, d = 0.5, error = Polling.DEFAULT_ERROR, other = {}){
		this.r = r;
		this.d = d;
		this.error = error;
		this.other = other; // incl. rfk
		/** @type {State} */
		this.state = undefined; // initialized by State constructor
	}
	get indy(){
		let sum = 0;
		for (const key in this.other)
			sum += this.other[key];
		return sum;
	}
	/** normalize result to 100% */
	actual(x = 0.5){
		const error = 2 * (x - 0.5) * this.error;
		const R_ = (this.r + error)
			* this.bonus(Party.REPUBLICAN);
		const D_ = (this.d - error)
			* this.bonus(Party.DEMOCRATIC);
		const RFK_ = (this.v('rfk') + random.uniform(-this.e('rfk'), this.e('rfk')))
			* this.bonus(Party.INDEPENDENT);
		const WEST_ = (this.v('west') + random.uniform(-this.e('west'), this.e('west')))
			* this.bonus(Party.JFA);
		const G_ = (this.v('g') + random.uniform(-this.e('g'), this.e('g')))
			* this.bonus(Party.GREEN);
		const L_ = (this.v('l') + random.uniform(-this.e('l'), this.e('l')))
			* this.bonus(Party.LIBERTARIAN);
		const S_ = (this.v('s') + random.uniform(-this.e('s'), this.e('s')))
			* this.bonus(Party.SAL);
		const sum = R_ + D_ + RFK_ + WEST_ + G_ + L_ + S_;
		const R = R_ / sum;
		const D = D_ / sum;
		const RFK = RFK_ / sum;
		const WEST = WEST_ / sum;
		const G = G_ / sum;
		const L = L_ / sum;
		const S = S_ / sum;
		return {R, D, RFK, WEST, G, L, S};
	}
	/** @param {Party} party */
	bonus(party){
		const DEATH = CONST.flags.partyNomDeath[party.abbr] ? CONST.config.deathPenalty : 1;
		const KEY = party === 'west' ? 'j' : party === 'jfk' ? 'i' : party.abbr.toLowerCase();
		const HOME = !this.other[KEY] && CONST.positions[`nom_${KEY}_p`].state === this.state
			? CONST.config.homeStateBuff : 1;
		return DEATH * HOME;
	}
	/** @param {string} candidate */
	e(candidate){
		return this.v(candidate) * this.error / 0.5;
	}
	/** @param {string} candidate */
	v(candidate){
		return (this.other[candidate] || Polling.DEFAULT_THIRD[1][candidate])
			* CONST.config.thirdPartyBuff;
	}
}
Polling.DEFAULT_ERROR = 0.05;
// https://www.realclearpolling.com/polls/president/general/2024/trump-vs-biden-vs-kennedy-vs-west-vs-stein
// Lib from avg of https://en.wikipedia.org/wiki/Nationwide_opinion_polling_for_the_2024_United_States_presidential_election
// SAL from 2020 results
Polling.DEFAULT_THIRD = [Polling.DEFAULT_ERROR, {
	rfk: 0.067, west: 0.016, g: 0.011, l: 0.02/3, s: 0.0005,
}];

// use if graph exists: https://projects.fivethirtyeight.com/polls/president-general/
// else: https://www.racetothewh.com/president/polls
// and... https://www.270towin.com/2024-presidential-election-polls/

// recount margins https://ballotpedia.org/Vote_margins_required_for_election_recounts,_2020

/* updated
	538		6/25/24
	rttwh	6/3/24
*/

// Poll closing source https://ballotpedia.org/State_Poll_Opening_and_Closing_Times_(2024)

const STATES = [
	// ABBR, EV, POLLING, POP, RECOUNT_MOE, POLL_CLOSE
	['AK', 3, new Polling(0.487, 0.26, Polling.DEFAULT_ERROR, {rfk: 0.102, west: 0.01}), 733406, 0, 8, -4], // rttwh
	['AL', 9, new Polling(0.561, 0.361, ...Polling.DEFAULT_THIRD), 5108468, 0.005, 7, -1], // rttwh
	['AR', 6, new Polling(0.562, 0.249, ...Polling.DEFAULT_THIRD), 3067732, 0, 7.5, -1], // rttwh
	['AZ', 11, new Polling(0.440, 0.396, 0.03, {rfk: 0.086}), 7431344, 0.001, 7, -2], // 538
	['CA', 54, new Polling(0.296, 0.495, 0.06, {rfk: 0.104}), 38965193, 0, 8, -3], // 538
	['CO', 10, new Polling(0.403, 0.498, Polling.DEFAULT_ERROR, {rfk: 0.099}), 5877610, 0.005, 7, -2], // 538EF
	['CT', 7, new Polling(0.388, 0.499, ...Polling.DEFAULT_THIRD), 3617176, 0.005, 8, 0], // rttwh
	['DC', 3, new Polling(0.054, 0.9215, Polling.DEFAULT_ERROR, {g: 0.0050, l: 0.0059}), 678972, 0, 8, 0], // 2020
	['DE', 3, new Polling(0.3977, 0.5874, ...Polling.DEFAULT_THIRD), 1031890, 0.005, 8, 0], // 2020
	['FL', 30, new Polling(0.463, 0.370, 0.03, {rfk: 0.079}), 22610726, 0.005, 7, 0], // 538
	['GA', 16, new Polling(0.443, 0.392, 0.03, {rfk: 0.081}), 11029227, 0, 7, 0], // 538
	['HI', 4, new Polling(0.34, 0.42, Polling.DEFAULT_ERROR, {rfk: 0.08, west: 0.03}), 1435138, 0.0025, 6, -5], // rttwh
	// IA Lib data https://en.wikipedia.org/wiki/Chase_Oliver_2024_presidential_campaign#Polling
	['IA', 6, new Polling(0.485, 0.363, Polling.DEFAULT_ERROR, {rfk: 0.09, l: 0.02}), 3207004, 0, 8, -1], // rttwh
	['ID', 4, new Polling(0.535, 0.268, ...Polling.DEFAULT_THIRD), 1964726, 0, 8, -2], // rttwh
	['IL', 19, new Polling(0.335, 0.46, ...Polling.DEFAULT_THIRD), 12549689, 0, 7, -1], // rttwh
	['IN', 11, new Polling(0.539, 0.344, ...Polling.DEFAULT_THIRD), 6862199, 0, 6, 0], // rttwh
	['KS', 6, new Polling(0.462, 0.319, ...Polling.DEFAULT_THIRD), 2940546, 0, 7, -1], // rttwh
	['KY', 8, new Polling(0.55, 0.284, ...Polling.DEFAULT_THIRD), 4526154, 0, 6, 0], // rttwh
	['LA', 8, new Polling(0.48, 0.33, Polling.DEFAULT_ERROR, {rfk: 0.10, west: 0.02}), 4573749, 0, 8, -1], // rttwh
	['MA', 11, new Polling(0.274, 0.462, Polling.DEFAULT_ERROR, {rfk: 0.091, west: 0.011}), 7001399, 0, 8, 0], // rttwh
	['MD', 10, new Polling(0.319, 0.507, Polling.DEFAULT_ERROR, {rfk: 0.066, west: 0.029}), 6180253, 0, 8, 0], // rttwh
	['ME', 2, new Polling(0.424, 0.477, Polling.DEFAULT_ERROR, {rfk: 0.099}), 1395722, 0, 8, 0], // 538EF
	['ME-1', 1, new Polling(0.293, 0.407, ...Polling.DEFAULT_THIRD), 697698, 0, 8, 0], // rttwh
	['ME-2', 1, new Polling(0.490, 0.405, Polling.DEFAULT_ERROR, {rfk: 0.105}), 687642, 0, 8, 0], // 538EF
	['MI', 15, new Polling(0.423, 0.418, 0.03, {rfk: 0.087}), 10037261, 0.0002, 8, 0], // 538
	['MN', 10, new Polling(0.409, 0.419, 0.06, {rfk: 0.085}), 5737915, 0, 8, -1], // 538
	['MO', 10, new Polling(0.499, 0.331, Polling.DEFAULT_ERROR, {rfk: 0.09, west: 0}), 6196156, 0, 7, -1], // rttwh
	['MS', 6, new Polling(0.545, 0.355, ...Polling.DEFAULT_THIRD), 2939690, 0, 7, -1], // rttwh
	['MT', 4, new Polling(0.482, 0.289, Polling.DEFAULT_ERROR, {rfk: 0.08, west: 0.01}), 1132812, 0, 8, -2], // rttwh
	['NC', 16, new Polling(0.448, 0.387, 0.03, {rfk: 0.085}), 10835491, 0, 7.5, 0], // 538
	['ND', 3, new Polling(0.532, 0.179, ...Polling.DEFAULT_THIRD), 783926, 0.01, 9, -1], // rttwh
	['NE', 2, new Polling(0.573, 0.335, ...Polling.DEFAULT_THIRD), 1978379, 0.01, 8, -1], // rttwh
	['NE-1', 1, new Polling(0.5601, 0.4109, ...Polling.DEFAULT_THIRD), 659903, 0, 8, -1], // 2020
	['NE-2', 1, new Polling(0.375, 0.336, Polling.DEFAULT_ERROR, {rfk: 0.09, west: 0.04}), 	658116, 0, 8, -1], // rttwh
	['NE-3', 1, new Polling(0.7536, 0.2234, ...Polling.DEFAULT_THIRD), 	649904, 0, 8, -1], // 2020
	['NH', 4, new Polling(0.445, 0.490, Polling.DEFAULT_ERROR, {rfk: 0.065}), 1402054, 0, 8, 0], // 538EF
	['NJ', 14, new Polling(0.424, 0.521, Polling.DEFAULT_ERROR, {rfk: 0.055}), 9290841, 0, 8, 0], // 538EF
	['NM', 5, new Polling(0.411, 0.486, ...Polling.DEFAULT_THIRD), 2114371, 0.0025, 7, -2], // rttwh
	['NV', 6, new Polling(0.433, 0.385, 0.03, {rfk: 0.090}), 3194176, 0, 7, -3], // 538
	['NY', 28, new Polling(0.366, 0.445, Polling.DEFAULT_ERROR, {rfk: 0.067, west: 0.024}), 19571216, 0, 9, 0], // rttwh
	['OH', 17, new Polling(0.461, 0.368, 0.02, {rfk: 0.071}), 11785935, 0.0025, 7.5, 0], // 538
	['OK', 7, new Polling(0.577, 0.326, ...Polling.DEFAULT_THIRD), 4053824, 0, 7, -1], // rttwh
	['OR', 8, new Polling(0.29, 0.40, Polling.DEFAULT_ERROR, {rfk: 0.19, west: 0.03}), 4233358, 0.002, 8, -3], // rttwh
	['PA', 19, new Polling(0.443, 0.410, 0.02, {rfk: 0.084}), 12961683, 0.005, 8, 0], // 538
	['RI', 4, new Polling(0.34, 0.51, Polling.DEFAULT_ERROR, {rfk: 0.06, west: 0.01}), 1095962, 0, 8, 0], // rttwh
	['SC', 9, new Polling(0.513, 0.356, ...Polling.DEFAULT_THIRD), 5373555, 0.01, 7, 0], // rttwh
	['SD', 3, new Polling(0.498, 0.313, Polling.DEFAULT_ERROR, {rfk: 0.11, west: 0}), 919318, 0, 7, -1], // rttwh
	['TN', 11, new Polling(0.481, 0.264, Polling.DEFAULT_ERROR, {rfk: 0.148, west: 0}), 7126489, 0, 7, -1], // rttwh
	['TX', 40, new Polling(0.449, 0.364, 0.03, {rfk: 0.097}), 30503301, 0, 7, -1], // 538
	['UT', 6, new Polling(0.467, 0.234, Polling.DEFAULT_ERROR, {rfk: 0.13, west: 0.01}), 3417734, 0, 8, -2], // rttwh
	['VA', 13, new Polling(0.434, 0.497, Polling.DEFAULT_ERROR, {rfk: 0.070}), 8715698, 0, 7, 0], // 538EF
	['VT', 3, new Polling(0.284, 0.577, ...Polling.DEFAULT_THIRD), 647464, 0, 7, 0], // rttwh
	['WA', 12, new Polling(0.369, 0.512, Polling.DEFAULT_ERROR, {rfk: 0.119}), 7812880, 0.005, 8, -3], // 538EF
	['WI', 10, new Polling(0.432, 0.418, 0.02, {rfk: 0.076}), 5910955, 0, 8, -1], // 538
	['WV', 4, new Polling(0.582, 0.239, ...Polling.DEFAULT_THIRD), 1770071, 0, 7.5, 0], // rttwh
	['WY', 3, new Polling(0.672, 0.159, ...Polling.DEFAULT_THIRD), 584057, 0.01, 7, -2], // rttwh
];