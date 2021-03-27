/* jshint esversion: 6, strict: true, strict: global, boss: true */
/* eslint-disable no-unused-vars */
// this file provides functions used in many of my other js files
'use strict';

// math block
const pi = Math.PI;
/** degree / radian */
const deg = pi/180;

/**
 * @param {number} n
 * @return {number}
*/
function factorial(n){
	if (n % 1 !== 0 || n < 0)
		throw RangeError;
	if (factorial.precomputed[n])
		return factorial.precomputed[n];
	factorial.precomputed[n] = n ? factorial(n-1)*n : 1;
	return factorial(n);
}
/** @type {number[]} */
factorial.precomputed = [];

/**
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
function gcd(a, b){
	return b ? gcd(b, mod(a, b)) : a;
}

/** Levenshtein distance
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
function lev(a, b){
	if (!a.length)
		return b.length;
	if (!b.length)
		return a.length;
	if (a[0] === b[0])
		return lev(a.slice(1), b.slice(1));
	return 1 + Math.min(
		lev(a.slice(1), b),
		lev(a, b.slice(1)),
		lev(a.slice(1), b.slice(1))
	);
}

/** works identically to matlab and numpy */
function linspace(from = 0, to = 1, points = 1){
	return new Array(points).fill(0).map((_, i) => i/points * (to-from) + from);
}

/** find the mean of an array
 * @param {number[]} x
*/
function mean(x){
	return sum(x)/x.length;
}

/**
 * @param {number} n
 * @param {number} m
 */
function mod(n, m){
	return (n%m+m)%m;
}

/**
 * @param {number} n
 * @param {number} k
 */
function nCr(n, k){
	return nPr(n, k)/factorial(k);
}

/**
 * @param {number} n
 * @param {number} k
 */
function nPr(n, k){
	return factorial(n)/factorial(n-k);
}

/** NOT seeded like in spacegame, but based off its code... */
const random = {
	bool(){
		return this.random() < 0.5;
	},
	/** @param {string | any[] | Set} iterable*/
	choice(iterable){
		return Array.from(iterable)[this.randint(0, iterable.length-1)];
	},
	/**
	 * @param {number} min
	 * @param {number} max - inclusive
	 */
	randint(min, max){ // random integer in range
		return Math.floor(this.uniform(min, max+1));
	},
	/** [0, 1) */
	random: Math.random,
	/** @param {any[]} arr */
	shuffle(arr){
		const a = range(0, arr.length);
		const o = [];
		while (a.length){
			const i = a.splice(this.randint(0, a.length-1), 1)[0];
			o.push(arr[i]);
		}
		return o;
	},
	/**
	 * @param {number} min
	 * @param {number} max
	 */
	uniform(min, max){ // random real in range
		return this.random() * (max-min) + min;
	},
	/**
	 * @param {any[]} arr
	 * @param {number[]} weights
	 */
	weightedChoice(arr, weights){
		const s = sum(weights);
		weights = weights.map(w => w/s); // normalize
		const r = this.random();
		let z = 0;
		let i = 0;
		for (i = 0; i < arr.length; i++){
			z += weights[i];
			if (r <= z)
				break;
		}
		return arr[i];
	},
};

/** works just like in python
 * @param {number} m
 * @param {number} [n]
 * @return {number[]}
*/
function range(m, n, step = 1){
	if (step !== 1)
		return Array.from(Array(Math.ceil((n-m)/step)).keys()).map(i => i*step+m);
	if (n === undefined)
		return Array.from(Array(m).keys());
	return range(n-m).map(i => i + m);
}

/**
 * @param {number} value
 * @param {[number, number]} range1
 * @param {[number, number]} range2
 */
function remap(value, range1, range2){
	const range1range = range1[1] - range1[0];
	const range2range = range2[1] - range2[0];
	const fraction = (value - range1[0]) / range1range;
	return fraction * range2range + range2[0];
}

/** @param {number} number */
function round(number, digits = 0){
	number *= Math.pow(10, digits);
	number = Math.round(number);
	number /= Math.pow(10, digits);
	return number;
}

/** find the standard deviation of an array
 * @param {number[]} x
*/
function sd(x){
	return Math.sqrt(variance(x));
}

/** eg. sigFigs(pi, 3) = 3.14
 * @param {number} x round this number...
 * @param {number} s to this many digits of precision.
 */
function sigFigs(x, s){
	const l = Math.pow(10, 1 + Math.floor(Math.log10(x))); // 10^(number of digits)
	return round(x/l, s) * l;
}

/** @param {number[]} arr */
function sum(arr){
	return arr.reduce((a, b) => a + b, 0);
}

/** find the variance of an array
 * @param {number[]} x
*/
function variance(x){
	const meanOfArray = mean(x);
	const v = x.map(y => Math.pow(y - meanOfArray, 2));
	return sum(v) / (x.length - 1);
}

// other block
const alphabet = 'abcdefghijklmnopqrstuvwxyz';

/** https://stackoverflow.com/a/17663871/2579798
 * @param {number} x
*/
function commaNumber(x){
	return x.toLocaleString();
}

/** https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS
 * @param {string} name
 * @return {HTMLUnknownElement}
 */
function createSvgElement(name = 'svg'){
	return document.createElementNS('http://www.w3.org/2000/svg', name);
}

/** https://stackoverflow.com/questions/34156282/how-do-i-save-json-to-local-text-file/34156339#34156339
 * @param {string} content
 * @param {string} fileName
 * @param {string} contentType
*/
function download(content, fileName, contentType){
	const a = document.createElement('a');
	const file = new Blob([content], {type: contentType});
	a.href = URL.createObjectURL(file);
	a.download = fileName;
	a.click();
}

/** functions identically to python
 * @param {any[]} arr
 * @return {[number, any][]}
 */
function enumerate(arr, start=0){
	return arr.map((a, i) => [i+start, a]);
}

/** https://stackoverflow.com/a/16227294/2579798
 * @param {any[]} a
 * @param {any[]} b
*/
function intersect(a, b){
	if (b.length > a.length){
		const t = b; b = a; a = t;
	} // indexOf to loop over shorter
	// extra step to remove duplicates
	return a.filter(e => -1 < b.indexOf(e)).filter((e, i, c) => c.indexOf(e) === i);
}

/** @param {string} filename to play */
function play(filename){
	new Audio(filename).play();
}

/** https://stackoverflow.com/a/196991/2579798
 * @param {string} str
*/
function proper(str){
	return str.replace(
		/\w\S*/g,
		function(txt){
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		}
	);
}

const cookie = {
	/** @param {string} name */
	delete(name){
		document.cookie = [name, '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/; domain=.', window.location.host.toString()].join('');
	},
	/** https://stackoverflow.com/a/11344672/2579798
	 * @param {string} name
	*/
	read(name){
		let result = document.cookie.match(new RegExp(name + '=([^;]+)'));
		if (result)
			result = JSON.parse(result[1]);
		return result;
	},
	/** https://stackoverflow.com/a/11344672/2579798
	 * @param {string} name
	 * @param {any} value
	*/
	write(name, value){
		document.cookie = [name, '=', JSON.stringify(value), '; domain=.', window.location.host.toString(), '; path=/;'].join('');
	},
};

/** https://stackoverflow.com/a/27997088/2579798
 * @param {any[]} a
 * @param {any[]} b
*/
function union(a, b){
	return [...new Set([...a, ...b])];
}

/** https://stackoverflow.com/a/14438954/2579798
 *
 * usage: arr.filter(unique);
 * @param {any} v
 * @param {number} i
 * @param {any[]} a
*/
function unique(v, i, a){
	return a.indexOf(v) === i;
}

/**
 * @param {number} value
 * @param {string} name
 */
function unitString(value, name, rounding = 2, constant = 1){
	value *= constant;
	const prefixes = 'yzafpnμm kMGTPEZY'.split('');
	const i = Math.floor(Math.log10(value)/3) + 8;
	const c = Math.pow(10, 3*(i-8));
	const prefix = i !== 8 ? prefixes[i] : '';
	return round(value / c, rounding) + ' ' + prefix + name;
}

/**
 * time a function
 * @param {()} f
 * @param {number} n
 */
function timer(f, n){
	const start = +new Date();
	for (let i = 0; i < n; i++){
		f();
	}
	const end = +new Date();
	// console.log(`t = ${end-start} ms`);
	return end-start;
}

/**
 * run before and after a function to determine the time taken
 *
 * automatically prints avg in ms to console
 * @param {number} [everyNSamples=1000] - every N samples, print to console; default = 1000
*/
function debugPerf(everyNSamples = 1000){
	debugPerf.i++;
	if (debugPerf.i % 2)
		return debugPerf.t0 = performance.now();
	debugPerf.history.push(performance.now() - debugPerf.t0);
	if (debugPerf.history.length % everyNSamples === 0)
		console.debug(mean(debugPerf.history));
}
debugPerf.i = 0;
/** @type {number[]} */
debugPerf.history = [];