/* exported STATES */

function poll(r, d){
	const m = r - d;
	if (poll.certaintyMargin < Math.abs(m))
		return r > d ? 1 : 0;
	return 0.5 / poll.certaintyMargin * m + 0.5;
}
/** margin at which a local election becomes a certainty */
poll.certaintyMargin = 0.112; // based on https://docs.google.com/spreadsheets/d/1RI_mZUrYo_0q1MaZ6BGuq932FsdqabnUx4o0WWOz1IA/edit#gid=1973406276

// use if graph exists: https://projects.fivethirtyeight.com/polls/president-general/
// else: https://www.racetothewh.com/president/polls
// and... https://www.270towin.com/2024-presidential-election-polls/
const STATES = [
	['AK', 3, 1],
	['AL', 9, 1],
	['AR', 6, 1],
	['AZ', 11, poll(0.428, 0.392)], // 538
	['CA', 54, 0],
	['CO', 10, poll(0.398, 0.467)], // rttwh
	['CT', 7, 0],
	['DC', 3, 0],
	['DE', 3, 0],
	['FL', 30, poll(0.462, 0.367)], // 538
	['GA', 16, poll(0.444, 0.383)], // 538
	['HI', 4, 0],
	['IA', 6, 1],
	['ID', 4, 1],
	['IL', 19, 0],
	['IN', 11, 1],
	['KS', 6, 1],
	['KY', 8, 1],
	['LA', 8, 1],
	['MA', 11, 0],
	['MD', 10, 0],
	['ME', 2, poll(0.359, 0.472)], // rttwh
	['ME-1', 1, 0],
	['ME-2', 1, poll(0.434, 0.266)], // rttwh
	['MI', 15, poll(0.414, 0.408)], // 538
	['MN', 10, poll(0.404, 0.443)], // rttwh
	['MO', 10, 1],
	['MS', 6, 1],
	['MT', 4, 1],
	['NC', 16, poll(0.448, 0.385)], // 538
	['ND', 3, 1],
	['NE', 2, 1],
	['NE-1', 1, 1],
	['NE-2', 1, poll(0.46, 0.43)], // rttwh
	['NE-3', 1, 1],
	['NH', 4, poll(0.444, 0.512)], // rttwh
	['NJ', 14, poll(0.386, 0.466)], // rttwh
	['NM', 5, poll(0.411, 0.486)], // rttwh
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
	['TX', 40, poll(0.489, 0.405)], // rttwh
	['UT', 6, 1],
	['VA', 13, poll(0.464, 0.422)], // rttwh
	['VT', 3, 0],
	['WA', 12, 0],
	['WI', 10, poll(0.418, 0.405)], // 538
	['WV', 4, 1],
	['WY', 3, 1],
];