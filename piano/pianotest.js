/* exported freq2note, playEFG */
/* global note2name, playTone, settings */
'use strict';

// https://stackoverflow.com/a/47147597/2579798
const getAllSubsets =
	theArray => theArray.reduce(
		(subsets, value) => subsets.concat(
			subsets.map(set => [value, ...set])
		),
		[[]]
	);

/**
 * @param {number} root frequency in hz
 * @param {number[]} primes list of primes > 2
 */
function eulerFokkerGenus(primes, root = 200){
	const productSet = Array.from(new Set(
		getAllSubsets(primes).map(s => s.reduce((a, b)=> a*b, 1))
	)).sort((a, b) => a - b);
	return productSet.map(n => root*n/Math.pow(2, Math.floor(Math.log(n, 2))));
}

function playEFG(primes, root = 200, t = 1){
	eulerFokkerGenus(primes, root).forEach((f, i) => setTimeout(() => {
		setTimeout(playTone(f), t*1000);
	}, i*t*1000));
}

// eg. playEFG([3, 3, 5]);
// Feb 2022 stuff
/** @param {number} freq - in hz */
function freq2note(freq){
	const id = Math.round(settings.scale*Math.log2(freq/settings.freq.min) + 1);
	console.debug(note2name(id));
	return id;
}