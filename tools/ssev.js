class Time {
	constructor(mya = 0){
		/** @type {number} */
		this.mya = mya;
	}
	static fromEarthAge(age = 0){
		return new Time(CONSTANTS.ageEarth - age);
	}
	static fromSolarAge(age = 0){
		return new Time(CONSTANTS.ageSun - age);
	}
}

class PlanetCoords {
	constructor(time, sma){
		/** @type {Time} */
		this.time = time;
		/** @type {number} */
		this.sma = sma; // in au
	}
}

class PlanetPath {
	constructor(...points){
		/** @type {PlanetCoords[]} */
		this.points = points;
	}
}

class Planet {
	constructor(name, path, img){
		/** @type {string} */
		this.name = name;
		/** @type {PlanetPath} */
		this.path = path || new PlanetPath();
		/** @type {string} */
		this.img = img;
	}
	get elem(){
		return document.getElementById(this.name);
	}
	createElem(){
		const e = document.createElement('div');
		e.id = this.name;
		const img = document.createElement('img');
		img.src = this.img;
		img.style.width = img.style.height = '5vw';
		e.appendChild(img);
		e.appendChild(document.createTextNode(this.name));
		e.classList.add('planet');
		return e;
	}
	/** @param {Time} time */
	pos(time){
		const t = time.mya;
		// OOB = DNE
		if (this.path.points[0].time.mya < t || t < this.path.points[this.path.points.length-1].time.mya) {
			// console.debug(`${this.name} won't spawn because ... t = ${t} ... start = ${this.path.points[0].time.mya} ... end = ${this.path.points[this.path.points.length-1].time.mya}`);
			return '-100vw';
		}
		// step 1: find the two times surrounding t
		// binary search on the array (the array is sorted in DESCENDING order)
		let i_max = 0;
		let i_min = this.path.points.length;
		while (1 < i_min - i_max){
			const i_mid = Math.floor((i_max + i_min)/2);
			const mid = this.path.points[i_mid].time.mya;
			if (t < mid) {
				i_max = i_mid;
			}
			else {
				i_min = i_mid;
			}
		}
		// step 2: lerp
		const min = this.path.points[i_min];
		const max = this.path.points[i_max];
		// console.debug(`${this.name}'s SMA ... ${min.sma} au ... ${max.sma} au`);
		const range = (max.time.mya - min.time.mya) || 1;
		const f = (t - min.time.mya)/range;
		const a = f*(max.sma - min.sma) + min.sma;
		// console.debug(`${this.name}'s SMA = ${a} au`);
		return SSEV.au2pos(a);
	}
}

const CONSTANTS = {
	/** https://en.wikipedia.org/wiki/Age_of_Earth */
	ageEarth: 4540,
	/** https://en.wikipedia.org/wiki/Formation_and_evolution_of_the_Solar_System#Chronology */
	ageSun: 4600,
	t: {
		grandTack: {
			get end(){
				return Time.fromSolarAge(10.);
			},
			f(x = 0){
				return new Time((1-x)*this.start.mya + x*this.end.mya);
			},
			get start(){
				return Time.fromSolarAge(6.);
			},
		},
		nice: {
			get end(){
				return new Time(this.start.mya + 5);
			},
			f(x = 0){
				return new Time((1-x)*this.start.mya + x*this.end.mya);
			},
			get start(){
				return Time.fromSolarAge(500.);
			},
		},
	},
};

const SSEV = {
	au2pos(au = 0){
		const min = 0.35; // au
		const max = 35; // au
		const f = Math.log(au/min)/Math.log(max/min);
		return `${100*f}vw`;
	},
	config: {
		/** @type {number} setInterval of animation tick */
		interval: undefined,
		t: Time.fromSolarAge(0),
	},
	elem: {
		/** @type {HTMLDivElement} */
		clock: undefined,
		frame: 50,
		/** @type {HTMLDivElement} */
		main: undefined,
		time: {
			/** @type {HTMLSpanElement} */
			display: undefined,
			/** @type {HTMLSpanElement} */
			play: undefined,
			/** @type {HTMLSpanElement} */
			stepBackward: undefined,
			/** @type {HTMLSpanElement} */
			stepForward: undefined,
			stepSize: 0.04,
		},
	},
	init(){
		const main = this.elem.main = document.getElementById('main');
		// create clock
		const clock = this.elem.clock = document.createElement('div');
		clock.id = 'clock';
		main.appendChild(clock);
		// create time controls
		// step backward button
		const timeStepBackward = this.elem.time.stepForward = document.createElement('span');
		timeStepBackward.id = 'timeStepBackward';
		timeStepBackward.classList.add('button');
		timeStepBackward.innerHTML = '&larr;';
		timeStepBackward.onclick = () => {
			// increment time
			SSEV.config.t.mya++;
			// update
			SSEV.update();
		};
		main.appendChild(timeStepBackward);
		// play/pause button
		const timePlay = this.elem.time.play = document.createElement('span');
		timePlay.id = 'timePlay';
		timePlay.classList.add('button');
		timePlay.innerHTML = 'Play';
		timePlay.onclick = () => {
			// handle setInterval
			SSEV.config.interval = SSEV.config.interval
				? clearInterval(SSEV.config.interval)
				: setInterval(() => SSEV.tick(), SSEV.config.frame);
			// change symbol
			timePlay.innerHTML = SSEV.config.interval ? 'Pause' : 'Play';
		};
		main.appendChild(timePlay);
		// step forward button
		const timeStepForward = this.elem.time.stepForward = document.createElement('span');
		timeStepForward.id = 'timeStepForward';
		timeStepForward.classList.add('button');
		timeStepForward.innerHTML = '&rarr;';
		timeStepForward.onclick = () => {
			// decrement time
			SSEV.config.t.mya--;
			// update
			SSEV.update();
		};
		main.appendChild(timeStepForward);
		// display
		const timeDisplay = this.elem.time.display = document.createElement('span');
		timeDisplay.id = 'timeDisplay';
		main.appendChild(timeDisplay);
		// create planet elems
		this.planets.forEach(p => {
			const e = p.createElem();
			main.appendChild(e);
		});
		// update
		this.update();
		// finish
		console.info('ssev.js initialized.');
	},
	planets: [
		// "10 million – 100 million years terrestrial planets form"
		new Planet('Mercury', new PlanetPath(
			new PlanetCoords(Time.fromEarthAge(90), 0.387098),
			new PlanetCoords(new Time(0), 0.387098),
		), 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Mercury_in_true_color.jpg'),
		new Planet('Venus', new PlanetPath(
			new PlanetCoords(Time.fromEarthAge(30), 0.723332),
			new PlanetCoords(new Time(0), 0.723332),
		), 'https://upload.wikimedia.org/wikipedia/commons/0/08/Venus_from_Mariner_10.jpg'),
		new Planet('Earth', new PlanetPath(
			new PlanetCoords(Time.fromEarthAge(0), 1),
			new PlanetCoords(new Time(0), 1),
		), 'https://upload.wikimedia.org/wikipedia/commons/2/2d/Meteosat-12-fci-march-equinox-2025-noon.jpg'),
		new Planet('Mars', new PlanetPath(
			new PlanetCoords(Time.fromEarthAge(60), 1.52368055),
			new PlanetCoords(new Time(0), 1.52368055),
		), 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Mars_-_August_30_2021_-_Flickr_-_Kevin_M._Gill.png'),
		// Nice Model begins like ~ 6 Myr
		// Nice Model source: https://commons.wikimedia.org/wiki/File:Tsiganis2005-1.svg
		new Planet('Jupiter', new PlanetPath(
			// https://en.wikipedia.org/wiki/Grand_tack_hypothesis
			// (0 Myr, 3.5 au) -> (3 Myr, 1.5 au) -> (6 Myr, 5.2 au)
			new PlanetCoords(CONSTANTS.t.grandTack.f(0), 3.5),
			new PlanetCoords(CONSTANTS.t.grandTack.f(0.5), 1.5),
			new PlanetCoords(CONSTANTS.t.grandTack.f(1), 5.2038),
			new PlanetCoords(new Time(0), 5.2038),
		), 'https://upload.wikimedia.org/wikipedia/commons/e/e2/Jupiter_OPAL_2024.png'),
		new Planet('Saturn', new PlanetPath(
			new PlanetCoords(Time.fromSolarAge(10), 8.4),
			new PlanetCoords(CONSTANTS.t.nice.start, 8.4),
			new PlanetCoords(CONSTANTS.t.nice.end, 9.5826),
			new PlanetCoords(new Time(0), 9.5826),
		), 'https://upload.wikimedia.org/wikipedia/commons/5/51/Saturn_-_August_11_1981_%2850903906546%29.jpg'),
		new Planet('Uranus', new PlanetPath(
			new PlanetCoords(Time.fromSolarAge(15), 17.1),
			new PlanetCoords(CONSTANTS.t.nice.start, 17.1),
			new PlanetCoords(CONSTANTS.t.nice.end, 19.19126),
			new PlanetCoords(new Time(0), 19.19126),
		), 'https://upload.wikimedia.org/wikipedia/commons/6/69/Uranus_Voyager2_color_calibrated.png'),
		new Planet('Neptune', new PlanetPath(
			new PlanetCoords(Time.fromSolarAge(15), 12),
			new PlanetCoords(CONSTANTS.t.nice.start, 12),
			new PlanetCoords(CONSTANTS.t.nice.end, 30.07),
			new PlanetCoords(new Time(0), 30.07),
		), 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Neptune_Voyager2_color_calibrated.png'),
	],
	tick(){
		// increment step
		SSEV.config.t.mya -= SSEV.elem.time.stepSize;
		this.update();
	},
	update(){
		// update planet positions
		this.planets.forEach(p => p.elem.style.left = p.pos(SSEV.config.t));
		// update timer
		this.elem.time.display.innerHTML = `${Math.round(this.config.t.mya)} mya`;
	}
};

SSEV.init();