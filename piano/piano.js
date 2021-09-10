/* global range */
'use strict';

const waveTypes = 'sine square triangle sawtooth'.split(' ');
let selectedWave = 'sine';

function note2freq(id){
	return 27.5 * Math.pow(2, (id-1)/12);
}

function xy2id(x, y){
	return 7*(y+1) + 5*(x-6);
}

function keySpan(id){
	// https://en.wikipedia.org/wiki/Piano_key_frequencies
	const names = 'G♯ A A♯ B C C♯ D D♯ E F F♯ G'.split(' ');
	/** @type {HTMLSpanElement} */
	const span = document.createElement('span');
	span.innerHTML = names[id % 12];
	const sub = document.createElement('sub');
	sub.innerHTML = Math.floor((id+8)/12);
	span.appendChild(sub);
	return span;
}

// https://stackoverflow.com/a/32632007/2579798
const audio = new(window.AudioContext || window.webkitAudioContext)();

/**
 * @param {number} id piano key id
 */
function noteOnClick(id){
	const attack = 100, //duration it will take to increase volume full sound volume, makes it more natural
		gain = audio.createGain(),
		osc = audio.createOscillator();

	gain.connect(audio.destination);
	gain.gain.setValueAtTime(0, audio.currentTime); //change to "1" if you're not fadding in/out
	gain.gain.linearRampToValueAtTime(1, audio.currentTime + attack / 1000); //remove if you don't want to fade in

	osc.frequency.value = note2freq(id);
	osc.type = selectedWave;
	osc.connect(gain);
	osc.start(0);

	// console.log(`pressing key ${id} (${osc.frequency.value} hz)`);
	document.getElementById(`key${id}`).onmouseup = () => {
		// console.log(`depressing key ${id}`);
		gain.gain.linearRampToValueAtTime(0, audio.currentTime + 1); //remove if you don't want to fade out
		setTimeout(() => {
			// console.log('this should fire 1s later');
			osc.stop(0);
			osc.disconnect(gain);
			gain.disconnect(audio.destination);
		}, 1000);
	};
}

function generatePiano(){
	/** @type {HTMLTableElement} */
	const piano = document.getElementById('piano');
	// FOURTEEN COLUMNS and ELEVEN ROWS
	// each row is +7, each col is +5 keys
	range(12).forEach(y => {
		const tr = document.createElement('tr');
		tr.id = `row${y}`;
		piano.appendChild(tr);
		range(13).forEach(x => {
			const td = document.createElement('td');
			tr.appendChild(td);
			const id = xy2id(x, y);
			if (y === 0 && x < 4){ // waveform buttons
				td.innerHTML = waveTypes[x];
				td.classList.add('waveformButton');
				td.onclick = () => selectedWave = waveTypes[x];
				return;
			}
			if (id < 1 || 88 < id || 6 < x-y || x-y < -5)
				return td.classList.add('bungus');
			if (id < 18) // D2, the lowest sound playable on my laptop
				td.classList.add('tooLow');
			td.id = `key${id}`;
			// black keys
			if (-1 < [0, 2, 5, 7, 10].indexOf(id % 12))
				td.classList.add('black');
			td.appendChild(keySpan(id));
			td.onmousedown = () => noteOnClick(id);
		});
	});
}

generatePiano();