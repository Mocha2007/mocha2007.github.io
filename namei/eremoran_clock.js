/* exported clockElement, clockUpdater */

'use strict';

const epoch	= 1497151176; // SUN 2017 JUN 11 03:19:36 UTC
const year	= 7662598.89579935; // oneian orbital period
const day	= 105583.0567402678; // solar day; the sideral day is 104148 s
const clockId = 'eremor_clock';
const seasons = ['spring', 'summer', 'fall', 'skum'];
// todo eclipse season yes/no
// todo day/night = rilm/urilm

/** @param {number} t - current time in ms */
function oneiaTime(t){
	t /= 1000;
	let remainder = t-epoch;
	const years = 950+Math.floor(remainder/year);
	remainder = remainder % year;
	const days = Math.floor(remainder/day);
	remainder = remainder % day;
	let currentTimeString =  `${years} AT, Day ${days}, `;

	for (let i = 1; i < 6; i += 1){
		// oneian clock is conveniently decimal... :^)
		currentTimeString += Math.floor(remainder/(day/Math.pow(10, i)))+(i !== 5 ? ':' : '');
		remainder = remainder % (day/Math.pow(10, i));
	}

	return currentTimeString;
}

/** returns the entire clock */
function clockElement(){
	const div = document.createElement('div');
	div.id = clockId;
	return div;
}

function clockUpdater(){
	document.getElementById(clockId).innerHTML
		= oneiaTime(Date.now());
}