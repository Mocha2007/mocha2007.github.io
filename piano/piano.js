/* exported stopAllAudio */
/* global createStyleSheet, createSvgElement, range, waves */
'use strict';

const waveTypes = 'sine square triangle sawtooth'.split(' ');
const allWaveTypes = 'sine square triangle sawtooth organ trumpet'.split(' ');
let selectedWave = 'sine';

const settings = {
	freq: {
		// just above max piano key
		max: 4186.01, // hz
		// D2, the lowest sound playable on my laptop
		softmin: 70, // hz
		min: 27.5, // hz
	},
	get keys(){
		return 1 + Math.floor(Math.log2(settings.freq.max/settings.freq.min) * settings.scale);
	},
	names: 'A A♯ B C C♯ D D♯ E F F♯ G G♯ H I I♯ J J♯ K L L♯ M M♯ N O O♯ P P♯ Q R R♯ S S♯ T U U♯ V V♯ W X X♯ Y Y♯'.split(' '),
	scale: 12,
	get tableCols(){
		return Math.floor(settings.scale/2 + 8.5);
	},
	get tableRows(){
		return Math.max(10, Math.floor(settings.scale/2 + 6));
	},
	get xScale(){
		// it's where it's closest to 4/3
		// theoretically should be 12 - 7 = 5
		return settings.scale - settings.yScale;
	},
	get xShift(){
		return -Math.ceil(settings.scale/2);
	},
	get yScale(){
		// it's where it's closest to 3/2
		const errors = range(settings.scale).map(i => Math.abs(3/2-Math.pow(2, i/settings.scale)));
		return errors.indexOf(Math.min(...errors));
	},
	get yShift(){
		return 0;
	},
};

function note2freq(id){
	return settings.freq.min * Math.pow(2, (id-1)/settings.scale);
}

function note2name(id){
	// https://en.wikipedia.org/wiki/Piano_key_frequencies
	return `${settings.names[(id - 1) % settings.scale]} ${Math.floor((id+8)/settings.scale)}`;
}

function xy2id(x, y){
	return settings.yScale*(y+settings.yShift) + settings.xScale*(x+settings.xShift);
}

function keySpan(id){
	/** @type {HTMLSpanElement} */
	const span = document.createElement('span');
	const sub = document.createElement('sub');
	[span.innerHTML, sub.innerHTML] = note2name(id).split(' ');
	span.appendChild(sub);
	return span;
}

function stopAllAudio(){
	range(settings.keys).forEach(id => {
		try {
			document.getElementById(`key${id}`).onmouseup();
		}
		// eslint-disable-next-line no-empty
		catch (_){}
	});
}

// https://stackoverflow.com/a/32632007/2579798
/** @type {AudioContext} */
const audio = new(window.AudioContext || window.webkitAudioContext)();

/** returns the stop function */
function playTone(freq){
	const attack = 100, // duration it will take to increase volume full sound volume, makes it more natural
		gain = audio.createGain(),
		osc = audio.createOscillator();

	gain.connect(audio.destination);
	gain.gain.setValueAtTime(0, audio.currentTime); // change to "1" if you're not fading in/out
	gain.gain.linearRampToValueAtTime(1, audio.currentTime + attack / 1000); // remove if you don't want to fade in

	osc.frequency.value = freq;
	if (waveTypes.includes(selectedWave))
		osc.type = selectedWave;
	else
		osc.setPeriodicWave(waves[selectedWave].wave);
	osc.connect(gain);
	// effects.apply(osc).connect(gain);
	osc.start(0);

	// console.log(`pressing key ${id} (${osc.frequency.value} hz)`);
	return () => {
		// console.log(`depressing key ${id}`);
		gain.gain.linearRampToValueAtTime(0, audio.currentTime + 1); // remove if you don't want to fade out
		setTimeout(() => {
			// console.log('this should fire 1s later');
			try {
				osc.stop(0);
				osc.disconnect(gain);
				gain.disconnect(audio.destination);
			}
			// eslint-disable-next-line no-empty
			catch (_){}
		}, 1000);
	};
}

/** returns the stop function */
function playTones(...tones){
	const stops = tones.map(tone => playTone(tone));
	return () => stops.forEach(f => f());
}

/** str -> boolean */
const keyStates = {
	/** @param {Event} e */
	keydown(e){
		// console.debug('KD', e.key);
		keyStates[e.key] = true;
	},
	/** @param {Event} e */
	keyup(e){
		// console.debug('KU', e.key);
		keyStates[e.key] = false;
	},
};

/**
 * @param {number} id piano key id
 */
function noteOnClick(id){
	const notes = [id];
	// modifiers
	// this allows chords to be played
	// ranges from -12 to +12
	'][poiuytrewq`1234567890-='.split('').forEach((key, i) => {
		if (keyStates[key])
			notes.push(id + i - 12);
	});
	// root
	document.getElementById(`key${id}`).onmouseup = playTones(...notes.map(note2freq));
}

/** @param {number} octaveSize */
function numberline(){
	const svg = createSvgElement();
	svg.setAttribute('viewBox', '-5 -5 110 10');
	svg.setAttribute('width', '95%');
	// svg.setAttribute('height', '100%');
	// line
	const line = createSvgElement('line');
	line.setAttribute('x1', 100);
	svg.appendChild(line);
	// mark number line
	function mark(x, t, below = false){
		const m = createSvgElement('line');
		m.setAttribute('x1', x*100);
		m.setAttribute('x2', x*100);
		m.setAttribute('y1', below ? 0 : -2);
		m.setAttribute('y2', below ? 2 : 0);
		svg.appendChild(m);
		const label = createSvgElement('text');
		label.innerHTML = t;
		label.setAttribute('x', x*100);
		label.setAttribute('y', below ? 4 : -3);
		svg.appendChild(label);
	}
	[
		[0, 1], [1/6, '7/6'], [1/5, '6/5'], [1/4, '5/4'], [1/3, '4/3'], [2/5, '7/5'],
		[0.5, '3/2'], [3/5, '8/5'], [2/3, '5/3'], [3/4, '7/4'], [4/5, '9/5'], [5/6, '11/6'], [1, 2],
	].forEach(x => mark(...x));
	range(settings.scale+1).map(x => Math.pow(2, x/settings.scale))
		.forEach((x, i) => mark(x-1, settings.names[i % settings.scale], true));
	return svg;
}

function generatePiano(){
	/** @type {HTMLTableElement} */
	const piano = document.getElementById('piano');
	// FOURTEEN COLUMNS and ELEVEN ROWS
	// each row is +7, each col is +5 keys
	range(settings.tableRows).forEach(y => {
		const tr = document.createElement('tr');
		tr.id = `row${y}`;
		piano.appendChild(tr);
		range(settings.tableCols).forEach(x => {
			const td = document.createElement('td');
			tr.appendChild(td);
			const id = xy2id(x, y);
			// top bar
			if (y === 0){
				// waveform buttons
				if (x < allWaveTypes.length){
					td.innerHTML = allWaveTypes[x];
					td.classList.add('waveformButton');
					td.onclick = () => selectedWave = allWaveTypes[x];
				}
				// number line
				else if (x === allWaveTypes.length){
					td.colSpan = settings.tableCols - y;
					td.appendChild(numberline());
				}
				else
					tr.removeChild(td);
				return;
			}
			/*
			if (y === 1 && x < effects.length){ // effect buttons
				const effectName = effects.getEffectNumber(x);
				td.id = td.innerHTML = effectName;
				td.classList.add('effectButton');
				td.onclick = () => effects.toggle(effectName);
				return;
			}
			*/
			if (id < 1 || settings.keys < id // outside key range
					|| settings.scale/2 < x-y || x-y < Math.floor(-settings.scale/2) + 1) // outside central diagonal range (upper || lower)
				return td.classList.add('bungus');
			if (note2freq(id) < settings.freq.softmin)
				td.classList.add('tooLow');
			td.id = `key${id}`;
			// black keys
			if (-1 < [0, 2].indexOf(id % settings.scale % 5))
				td.classList.add('black');
			// title
			td.title = `${Math.round(note2freq(id))} hz`;
			td.appendChild(keySpan(id));
			td.onmousedown = () => noteOnClick(id);
		});
	});
	// tweak css
	const sheet = createStyleSheet();
	sheet.insertRule(
		`td{height:calc(100%/${settings.tableRows});width:calc(100%/${settings.tableCols});}`);
	sheet.insertRule(`body,html,table{font-size:calc(48vh/${settings.tableRows})}`);
	// misc setup
	document.onmouseup = stopAllAudio;
	document.onkeydown = keyStates.keydown;
	document.onkeyup = keyStates.keyup;
}

generatePiano();