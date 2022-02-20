/* exported effectList, effects, freq2note, numberline, playEFG, waves */
/* global audio, note2name, playTone, range, settings */
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
// yuck
/** @param {number} freq - in hz */
function freq2note(freq){
	const id = Math.round(settings.scale*Math.log2(freq/settings.freq.min) + 1);
	console.debug(note2name(id));
	return id;
}

class MochaWave {
	constructor(realGenerator, n = 10, imagGenerator = () => 0){
		this.real = range(n).map(realGenerator);
		this.imag = range(n).map(imagGenerator);
	}
	// https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/createPeriodicWave
	/** @type {PeriodicWave} */
	get wave(){
		return audio.createPeriodicWave(this.real, this.imag); // {disableNormalization: true}
	}
}

function isPowerOfTwo(n){
	if (n === 1)
		return true;
	if (n <= 0 || n % 1 !== 0)
		return false;
	return isPowerOfTwo(n/2);
}

const waves = {
	organ: new MochaWave(x => x && isPowerOfTwo(x) / x, 17),
	trumpet: new MochaWave(x => x && 1),
};

const effectList = {
	convolver: {
		active: false,
		/** @param {AudioNode} x */
		get node(){
			return audio.createConvolver();
		},
	},
};

const effects = {
	// keep at the bottom
	/** @param {AudioNode} node - input node */
	apply(node){
		range(effectList.length).map(i => effectList[this.getEffectNumber(i)])
			.filter(x => x.active).forEach(x => {
				const newNode = x.node;
				node.connect(newNode);
				node = newNode;
			});
		return node;
	},
	/** @param {number} id */
	getEffectNumber(id){
		return Object.keys(effectList)[id];
	},
	get length(){
		return Object.keys(effectList).length;
	},
	/** @param {string} effectName */
	toggle(effectName){
		effectList[effectName].active = !effectList[effectName].active;
		const elem = document.getElementById(effectName);
		if (effectList[effectName].active){
			elem.title = 'ON';
			elem.classList.add('activeEffect');
		}
		else {
			elem.title = 'OFF';
			elem.classList.remove('activeEffect');
		}
	},
};