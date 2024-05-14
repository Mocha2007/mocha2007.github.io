/* exported STATES */
/* global random */

class Polling {
	constructor(r = 0.5, d = 0.5, error = 0.05, other = {}){
		this.r = r;
		this.d = d;
		this.error = error;
		this.other = other; // incl. rfk
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
		const R_ = this.r + error;
		const D_ = this.d - error;
		const RFK_ = Math.max(0, (this.other.rfk || 0) + random.uniform(-this.error, this.error));
		const sum = R_ + D_ + RFK_;
		const R = R_ / sum;
		const D = D_ / sum;
		const RFK = RFK_ / sum;
		return {R, D, RFK};
	}
}

// use if graph exists: https://projects.fivethirtyeight.com/polls/president-general/
// else: https://www.racetothewh.com/president/polls
// and... https://www.270towin.com/2024-presidential-election-polls/

// recount margins https://ballotpedia.org/Vote_margins_required_for_election_recounts,_2020
// ME-1 &c need a few people (I use 10...) so there are actually people who vote
const STATES = [
	['AK', 3, new Polling(0.529, 0.386), 733406, 0], // rttwh
	['AL', 9, new Polling(0.561, 0.361), 5108468, 0.005], // rttwh
	['AR', 6, new Polling(0.562, 0.249), 3067732, 0], // rttwh
	['AZ', 11, new Polling(0.428, 0.392, 0.03, {rfk: 0.103}), 7431344, 0.001], // 538
	['CA', 54, new Polling(0.296, 0.503, 0.05, {rfk: 0.109}), 38965193, 0], // 538
	['CO', 10, new Polling(0.398, 0.467), 5877610, 0.005], // rttwh
	['CT', 7, new Polling(0.388, 0.499), 3617176, 0.005], // rttwh
	['DC', 3, new Polling(0.054, 0.9215), 678972, 0], // 2020
	['DE', 3, new Polling(0.3977, 0.5874), 1031890, 0.005], // 2020
	['FL', 30, new Polling(0.462, 0.367, 0.03, {rfk: 0.084}), 22610726, 0.005], // 538
	['GA', 16, new Polling(0.444, 0.384, 0.03, {rfk: 0.084}), 11029227, 0], // 538
	['HI', 4, new Polling(0.38, 0.57), 1435138, 0.0025], // rttwh
	['IA', 6, new Polling(0.485, 0.363), 3207004, 0], // rttwh
	['ID', 4, new Polling(0.535, 0.268), 1964726, 0], // rttwh
	['IL', 19, new Polling(0.335, 0.46), 12549689, 0], // rttwh
	['IN', 11, new Polling(0.539, 0.344), 6862199, 0], // rttwh
	['KS', 6, new Polling(0.462, 0.319), 2940546, 0], // rttwh
	['KY', 8, new Polling(0.55, 0.284), 4526154, 0], // rttwh
	['LA', 8, new Polling(0.515, 0.355), 4573749, 0], // rttwh
	['MA', 11, new Polling(0.254, 0.531), 7001399, 0], // rttwh
	['MD', 10, new Polling(0.332, 0.579), 6180253, 0], // rttwh
	['ME', 2, new Polling(0.359, 0.472), 1395722, 0], // rttwh
	['ME-1', 1, new Polling(0.293, 0.407), 10, 0], // rttwh
	['ME-2', 1, new Polling(0.434, 0.266), 10, 0], // rttwh
	['MI', 15, new Polling(0.414, 0.408, 0.03, {rfk: 0.092}), 10037261, 0.0002], // 538
	['MN', 10, new Polling(0.404, 0.443), 5737915, 0], // rttwh
	['MO', 10, new Polling(0.488, 0.331), 6196156, 0], // rttwh
	['MS', 6, new Polling(0.545, 0.355), 2939690, 0], // rttwh
	['MT', 4, new Polling(0.533, 0.328), 1132812, 0], // rttwh
	['NC', 16, new Polling(0.448, 0.385, 0.03, {rfk: 0.091}), 10835491, 0], // 538
	['ND', 3, new Polling(0.532, 0.179), 783926, 0.01], // rttwh
	['NE', 2, new Polling(0.573, 0.335), 1978379, 0.01], // rttwh
	['NE-1', 1, new Polling(0.5601, 0.4109), 10, 0], // 2020
	['NE-2', 1, new Polling(0.46, 0.43), 10, 0], // rttwh
	['NE-3', 1, new Polling(0.7536, 0.2234), 10, 0], // 2020
	['NH', 4, new Polling(0.444, 0.512), 1402054, 0], // rttwh
	['NJ', 14, new Polling(0.386, 0.466), 9290841, 0], // rttwh
	['NM', 5, new Polling(0.411, 0.486), 2114371, 0.0025], // rttwh
	['NV', 6, new Polling(0.43, 0.36, 0.03, {rfk: 0.116}), 3194176, 0], // 538
	['NY', 28, new Polling(0.37, 0.508), 19571216, 0], // rttwh
	['OH', 17, new Polling(0.453, 0.357, 0.02, {rfk: 0.100}), 11785935, 0.0025], // 538
	['OK', 7, new Polling(0.577, 0.326), 4053824, 0], // rttwh
	['OR', 8, new Polling(0.40, 0.52), 4233358, 0.002], // rttwh
	['PA', 19, new Polling(0.429, 0.41, 0.02, {rfk: 0.094}), 12961683, 0.005], // 538
	['RI', 4, new Polling(0.33, 0.496), 1095962, 0], // rttwh
	['SC', 9, new Polling(0.513, 0.356), 5373555, 0.01], // rttwh
	['SD', 3, new Polling(0.544, 0.273), 919318, 0], // rttwh
	['TN', 11, new Polling(0.573, 0.315), 7126489, 0], // rttwh
	['TX', 40, new Polling(0.455, 0.355, 0.03, {rfk: 0.126}), 30503301, 0], // 538
	['UT', 6, new Polling(0.506, 0.298), 3417734, 0], // rttwh
	['VA', 13, new Polling(0.422, 0.464), 8715698, 0], // rttwh
	['VT', 3, new Polling(0.284, 0.577), 647464, 0], // rttwh
	['WA', 12, new Polling(0.425, 0.469), 7812880, 0.005], // rttwh
	['WI', 10, new Polling(0.418, 0.405, 0.02, {rfk: 0.095}), 5910955, 0], // 538
	['WV', 4, new Polling(0.582, 0.239), 1770071, 0], // rttwh
	['WY', 3, new Polling(0.672, 0.159), 584057, 0.01], // rttwh
];