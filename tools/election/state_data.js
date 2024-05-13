/* exported STATES */

/**
	rule of thumb:
	0% margin = 50/50
	2% ~ 60%
	4% ~ 70%
	6% ~ 80%
	8% ~ 90%
	10% margin = certainty
*/
function poll(r, d){
	const m = r - d;
	if (0.1 < Math.abs(m))
		return r > d ? 1 : 0;
	return 5 * m + 0.5;
}
// use if graph exists: https://projects.fivethirtyeight.com/polls/president-general/
// else: https://www.270towin.com/2024-presidential-election-polls/
const STATES = [
	['AK', 3, 1],
	['AL', 9, 1],
	['AR', 6, 1],
	['AZ', 11, poll(0.428, 0.392)], // 538
	['CA', 54, 0],
	['CO', 10, 0],
	['CT', 7, 0],
	['DC', 3, 0],
	['DE', 3, 0],
	['FL', 30, poll(0.462, 0.367)], // 538
	['GA', 16, poll(0.444, 0.383)], // 538
	['HI', 4, 0],
	['IA', 6, 1],
	['ID', 4, 1],
	['IL', 19, poll(0.34, 0.43)], // 270
	['IN', 11, 1],
	['KS', 6, 1],
	['KY', 8, 1],
	['LA', 8, 1],
	['MA', 11, 0],
	['MD', 10, 0],
	['ME', 2, poll(0.38, 0.32)], // 270
	['ME-1', 1, 0],
	['ME-2', 1, 0.9],
	['MI', 15, poll(0.414, 0.408)], // 538
	['MN', 10, poll(0.42, 0.44)], // 270
	['MO', 10, 1],
	['MS', 6, 1],
	['MT', 4, 1],
	['NC', 16, poll(0.448, 0.385)], // 538
	['ND', 3, 1],
	['NE', 2, 1],
	['NE-1', 1, 1],
	['NE-2', 1, 0.3],
	['NE-3', 1, 1],
	['NH', 4, 0.1],
	['NJ', 14, poll(0.39, 0.46)], // 270
	['NM', 5, 0],
	['NV', 6, poll(0.428, 0.359)], // 538
	['NY', 28, 0],
	['OH', 17, poll(0.453, 0.357)], // 538
	['OK', 7, 1],
	['OR', 8, 0],
	['PA', 19, poll(0.428, 0.409)], // 538
	['RI', 4, 0],
	['SC', 9, 1],
	['SD', 3, 1],
	['TN', 11, 1],
	['TX', 40, 1],
	['UT', 6, 1],
	['VA', 13, poll(0.43, 0.49)], // 270
	['VT', 3, 0],
	['WA', 12, 0],
	['WI', 10, poll(0.418, 0.405)], // 538
	['WV', 4, 1],
	['WY', 3, 1],
];