/* jshint esversion: 6, strict: true, strict: global, boss: true */
/* eslint-disable no-unused-vars */
// this file provides functions used in many of my other js files
'use strict';

const constants = {
	get day(){
		return 24 * this.hour;
	},
	get hour(){
		return 60 * this.minute;
	},
	get minute(){
		return 60;
	},
	get month(){
		return this.year / 12;
	},
	get week(){
		return 7 * this.day;
	},
	get year(){
		return 365.2425 * this.day;
	},
};

// math block

const pi = Math.PI;
/** degree / radian */
const deg = pi/180;

/** force a number to lie within an interval
 * @param {number} x
 * @param {number} min
 * @param {number} max
 */
function clamp(x, min, max){
	return Math.min(max, Math.max(min, x));
}

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
/** @type {number[]} cache */
factorial.precomputed = [];

/** greatest common denominator
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
function gcd(a, b){
	return b ? gcd(b, mod(a, b)) : a;
}

/**
 * returns true if A is a subset of B
 * @param {Set} a
 * @param {Set} b
 */
function isSubsetOf(a, b){
	return Array.from(a).every(i => b.has(i));
}

/** Levenshtein distance
 * https://en.wikipedia.org/wiki/Levenshtein_distance
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

/** works identically to matlab and numpy;
 * creates an array between two values with a given number of intermediate points
 */
function linspace(from = 0, to = 1, points = 1){
	return new Array(points).fill(0).map((_, i) => i/points * (to-from) + from);
}

/**
 * compute the log of a number in an arbitrary base
 * @param {number} n
 * @param {number} b base
 */
function log(n, b = Math.E){
	return Math.log(n) / Math.log(b);
}

/**
 * returns a function representing an interpolation between the two given points that is linear on a log-log plot
 * @param {number} x0
 * @param {number} y0
 * @param {number} x1
 * @param {number} y1
 * @returns {(x: number) => number} interpolation
 */
function logLogInterpolate(x0, y0, x1, y1){
	const b = (Math.log(x1)*Math.log(y0) - Math.log(x0)*Math.log(y1))
		/ (Math.log(x1) - Math.log(x0));
	const a = (Math.log(y0) - b) / Math.log(x0);
	return x => Math.exp(a*Math.log(x) + b);
}

/** find the mean of an array
 * @param {number[]} x
*/
function mean(x){
	return sum(x)/x.length;
}

/** fixes a bug with the js % operator with negative numbers
 * @param {number} n
 * @param {number} m
 */
function mod(n, m){
	return (n%m+m)%m;
}

/** https://en.wikipedia.org/wiki/Combination
 * it's the one where order doesn't matter
 * @param {number} n
 * @param {number} k
 */
function nCr(n, k){
	return nPr(n, k)/factorial(k);
}

/** https://en.wikipedia.org/wiki/Permutation
 * it's the one where order matters
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
	/** @param {string | any[] | Set} iterable */
	choice(iterable){
		return Array.from(iterable)[this.randint(0, iterable.length-1)];
	},
	/**
	 * generate a normally-distributed number with the given mean and standard deviation
	 * @param {number} mu mean
	 * @param {number} sigma standard deviation
	 * @returns {number}
	 */
	normal(mu = 0, sigma = 1){
		/**
		 * https://stackoverflow.com/a/196941/2579798
		 * @returns {number}
		 */
		function gaussRandom(){
			const u = 2*random.random()-1;
			const v = 2*random.random()-1;
			const r = u*u + v*v;
			/*if outside interval [0,1] start over*/
			if (r === 0 || r >= 1)
				return gaussRandom();
			const c = Math.sqrt(-2*Math.log(r)/r);
			return u*c;
		}
		return mu + gaussRandom()*sigma;
	},
	/**
	 * @param {number} min
	 * @param {number} max - inclusive
	 */
	randint(min, max){ // random integer in range
		return Math.floor(this.uniform(min, max+1));
	},
	/** [0, 1) ; just alias to Math.random */
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
 * @param {number} m min (inclusive)
 * @param {number} [n] max (exclusive)
 * @return {number[]}
*/
function range(m, n, step = 1){
	if (step !== 1)
		return Array.from(Array(Math.ceil((n-m)/step)).keys()).map(i => i*step+m);
	if (n === undefined)
		return Array.from(Array(m).keys());
	return range(n-m).map(i => i + m);
}

/** maps a value from one range to another
 * @param {number} value value within source range
 * @param {[number, number]} range1 source range
 * @param {[number, number]} range2 destination range
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

/**
 * tests whether two sets are equivalent
 * @param {Set} a
 * @param {Set} b
 */
function setEquality(a, b){
	return a.size === b.size && isSubsetOf(a, b);
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

/** write a number with commas
 * https://stackoverflow.com/a/17663871/2579798
 * @param {number} x
*/
function commaNumber(x){
	return x.toLocaleString();
}

/** DEPRECATED USE storage INSTEAD */
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

/** https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS
 * @param {string} name
 * @return {HTMLUnknownElement}
 */
function createSvgElement(name = 'svg'){
	return document.createElementNS('http://www.w3.org/2000/svg', name);
}

/** https://stackoverflow.com/a/24285947/2579798
 * @return {CSSStyleSheet}
 */
function createStyleSheet(){
	const style = document.createElement('style');
	document.head.appendChild(style);
	return style.sheet;
}

/** https://stackoverflow.com/a/49531759
 * @return {CSSStyleSheet}
 */
function createSvgStyleSheet(){
	const style = createSvgElement('style');
	document.documentElement.appendChild(style);
	return style.sheet;
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

/** https://stackoverflow.com/questions/34156282/how-do-i-save-json-to-local-text-file/34156339#34156339
 * @param {string} content - eg 'hello!
 * @param {string} fileName - eg 'mochaSpaceGameSave.txt'
 * @param {string} contentType - eg 'text/plain'
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

/** https://stackoverflow.com/a/14521482
 * load js file using js
 * @param {string} url
 * @param {() => void} onload
 */
function loadScript(url, onload){
	const script = document.createElement('script');
	script.onload = onload;
	script.src = url;
	document.head.appendChild(script);
}

/** @param {string} filename of audio to play */
function play(filename){
	new Audio(filename).play();
}

/** https://stackoverflow.com/a/196991/2579798
 * @param {string} str
*/
function proper(str){
	return str.replace(
		/\w\S*/g,
		txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
	);
}

/** https://stackoverflow.com/a/37511463
 * @param {string} str
 */
function removeAccents(str){
	return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/** https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API */
const storage = {
	/** @param {string} name */
	delete(name){
		window.localStorage.removeItem(name);
	},
	exists(name){
		return window.localStorage.getItem(name) !== null;
	},
	/** https://stackoverflow.com/a/11344672/2579798
	 * @param {string} name
	*/
	read(name){
		return JSON.parse(window.localStorage.getItem(name));
	},
	/**
	 * @param {string} name
	 * @param {any} value
	*/
	write(name, value){
		window.localStorage.setItem(name, JSON.stringify(value));
	},
};

/**
 * Converts string to title case. identical to str.title in python.
 * @param {string} s
 */
function title(s){
	return s[0].toUpperCase() + s.slice(1);
}

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
	if (!value)
		return `${value} ${name}`;
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