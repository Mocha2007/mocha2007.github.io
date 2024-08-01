/* exported recTable, run */
/* global random, range, round, sum */
const BOOST_RATIO = 0.425; // "between 40 and 45%"
const AI_ROLLS_DICE_THRESHOLD_LOWER = -11; // https://web.archive.org/web/20211220170105/https://www.reddit.com/r/enderal/comments/rkrrsx/battle_for_treomar_is_really_unfair_an_analysis/
const AI_ROLLS_DICE_THRESHOLD_UPPER = -1;

/**
 * @param {number} player_hand
 * @param {number} player_bet
 * @param {number} opponent_bet
 * @param {number} n
 */
function test(player_hand, player_bet, opponent_bet, n = 10000){
	function boost(m = 2, n_ = 6){
		function dn(){
			return random.randint(1, n_);
		}
		return sum(range(m).map(dn));
	}
	function simulate_opponent_hand(you_boost = false){
		const PLAYER = player_hand + you_boost * boost();
		let boosted = false;
		let value = boost(3, 10);
		if (AI_ROLLS_DICE_THRESHOLD_LOWER <= value - PLAYER
				&& value - PLAYER <= AI_ROLLS_DICE_THRESHOLD_UPPER){
			value += boost();
			boosted = true;
		}
		const result = value > PLAYER ? 'LOSS' : 'WIN';
		return {value, boosted, result};
	}
	// simulate opponent hands
	const opponent_hands = range(n).map(() => simulate_opponent_hand());
	const they_boosted = sum(opponent_hands.map(x => x.boosted));
	const WIN = 100/n*opponent_hands.filter(x => x.result === 'WIN').length;
	const LOSS = 100/n*opponent_hands.filter(x => x.result === 'LOSS').length;
	// const DRAW = 100/n*opponent_hands.filter(x => x.result === 'DRAW').length;
	// console.info('WIN % = ', 100 * WIN / n);
	// console.info('LOSS % = ', 100 * LOSS / n);
	// console.info('DRAW % = ', 100 * DRAW / n);
	const EV = WIN/n*opponent_bet - LOSS/n*player_bet
		+ they_boosted/n*Math.round(BOOST_RATIO * opponent_bet);
	// console.info('EV = ', EV);
	// you boost
	// simulate opponent hands
	const opponent_handsB = range(n).map(() => simulate_opponent_hand(true));
	const they_boostedB = sum(opponent_handsB.map(x => x.boosted));
	const WINB = 100/n*opponent_handsB.filter(x => x.result === 'WIN').length;
	const LOSSB = 100/n*opponent_handsB.filter(x => x.result === 'LOSS').length;
	// const DRAWB = 100/n*opponent_handsB.filter(x => x.result === 'DRAW').length;
	// console.info('YOU BOOSTED WIN % = ', 100 * WINB / n);
	// console.info('YOU BOOSTED LOSS % = ', 100 * LOSSB / n);
	// console.info('YOU BOOSTED DRAW % = ', 100 * DRAWB / n);
	const EVB = WINB/n*opponent_bet - LOSSB/n*player_bet - Math.round(BOOST_RATIO * player_bet)
		+ they_boostedB/n*Math.round(BOOST_RATIO * opponent_bet);
	// console.info('YOU BOOSTED EV = ', EVB);
	const RECOMMENDATION = EVB > EV ? 'BOOST' : 'DO NOT BOOST';
	return {WIN, LOSS, EV, WINB, LOSSB, EVB, RECOMMENDATION};
}

function run(){
	function get(id){
		return +document.getElementById(id).value;
	}
	function set(id, val){
		document.getElementById(id).innerHTML = val;
	}
	const RESULT = test(get('player_hand'), get('player_bet'), get('opponent_bet'));
	set('WIN', RESULT.WIN);
	set('LOSS', RESULT.LOSS);
	set('EV', RESULT.EV);
	set('WINB', RESULT.WINB);
	set('LOSSB', RESULT.LOSSB);
	set('EVB', RESULT.EVB);
	set('RECOMMENDATION', RESULT.RECOMMENDATION);
	document.getElementById('RECOMMENDATION').className = `REC_${RESULT.RECOMMENDATION[0]}`;
}

function speedTest(desired_time = 1000, needed_calculations = 280, n = 100){
	const DEBUG_T = new Date();
	for (let i = 0; i < needed_calculations; i++)
		test(random.randint(3, 30), 5, 10, n);
	const T = new Date() - DEBUG_T;
	const o = Math.floor(n * desired_time / T);
	// eslint-disable-next-line max-len
	console.debug(`Tested ${needed_calculations} random calculations @ ${T} ms when n = ${n}; recommend n = ${o}`);
	return o;
}
speedTest.reThink = () => {
	const desired_time = 1000 * document.getElementById('thinkTime').value;
	rec_n = speedTest(desired_time);
	recTable();
};
let rec_n = 0;

function recTable(){
	const n = rec_n || speedTest();
	const opponent_bet = 100;
	const player_hands = range(3, 31); // 28 cols + header
	const player_bets = range(5, 51, 5);
	const TABLE = document.getElementById('recTable');
	TABLE.innerHTML = '';
	// headers
	const TRH = document.createElement('tr');
	TRH.innerHTML = '<th></th>';
	TABLE.appendChild(TRH);
	player_hands.forEach(player_hand => {
		const TH = document.createElement('th');
		TH.innerHTML = player_hand;
		TRH.appendChild(TH);
	});
	// main rows
	player_bets.forEach(player_bet => {
		// header
		const TR = document.createElement('tr');
		TABLE.appendChild(TR);
		const TH = document.createElement('th');
		TH.innerHTML = round(player_bet/opponent_bet, 2);
		TR.appendChild(TH);
		// main
		player_hands.forEach(player_hand => {
			const TD = document.createElement('td');
			const RESULT = test(player_hand, player_bet, opponent_bet, n);
			TD.className = `REC_${RESULT.RECOMMENDATION[0]}`;
			TD.innerHTML = RESULT.RECOMMENDATION === 'BOOST' ? '✔️' : '❌';
			TR.appendChild(TD);
		});
	});
}

console.info('loaded enderal_minigame.js');