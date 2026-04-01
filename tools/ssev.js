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

class PlanetEvent {
	constructor(name, start, end = start){
		/** @type {string} */
		this.name = name;
		/** @type {number} */
		this.start = start;
		/** @type {number} */
		this.end = end;
	}
	elem(){
		const e = document.createElement('span');
		e.classList.add('event');
		e.innerHTML = this.name.replace('-', '&#8209;');
		e.title = `${this.start.toFixed(0)} Mya - ${this.end.toFixed(0)} Mya`;
		return e;
	}
	/** @param {Time} time */
	is_active(time){
		return this.start <= time.mya && time.mya < this.end;
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
	constructor(name, path, img, settings){
		/** @type {string} */
		this.name = name;
		/** @type {PlanetPath} */
		this.path = path || new PlanetPath();
		/** @type {(n: number) => string} */
		this.img = typeof img === "string" ? () => img : img;
		// preload images
		// https://stackoverflow.com/questions/3646036/preloading-images-with-javascript
		this.img_preload = new Image();
		this.img_preload.crossOrigin = "anonymous"; // prevent error spam
		this.img_preload.src = this.img(0);
		this.settings = settings || {};
		const albedo = this.settings.albedo || 0.25;
		if (typeof albedo !== "function") this.settings.albedo = () => albedo;
		const ghe = this.settings.ghe || 1;
		if (typeof ghe !== "function") this.settings.ghe = () => ghe;
		/** @type {PlanetEvent[]} */
		this.settings.events = this.settings.events || [];
	}
	get elem(){
		return document.getElementById(this.name);
	}
	createElem(){
		const e = document.createElement('div');
		e.id = this.name;
		const img = this.img_preload;
		img.src = this.img(CONSTANTS.ageSun);
		img.style.width = img.style.height = `${SSEV.config.imgSize}vw`;
		e.appendChild(img);
		e.appendChild(document.createTextNode(this.name));
		e.classList.add('planet');
		if (this.settings.offset) e.classList.add('offset');
		this.status = document.createElement('span');
		this.status.id = `${this.name}_status`;
		this.status.classList.add('status');
		e.appendChild(this.status);
		if (this.settings.minor) e.classList.add('minor');
		return e;
	}
	/** @param {Time} time */
	pos(time){
		return SSEV.au2pos(this.sma(time), true);
	}
	/** @param {Time} time */
	sma(time){
		const t = time.mya;
		// OOB = DNE
		if (this.path.points[0].time.mya < t || t < this.path.points[this.path.points.length-1].time.mya) {
			// console.debug(`${this.name} won't spawn because ... t = ${t} ... start = ${this.path.points[0].time.mya} ... end = ${this.path.points[this.path.points.length-1].time.mya}`);
			return 1e-10;
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
		return a;
	}
	temp(time){
		const albedo = this.settings.albedo(time.mya);
		return CONSTANTS.sun.temp(time) * Math.sqrt(CONSTANTS.sun.radius(time)/(2*this.sma(time))) * Math.pow(1-albedo, 0.25)
			// greenhouse
			* this.settings.ghe(time.mya);
	}
	/** @param {Time} time */
	updateStatus(time){
		const status = this.status;
		const a = this.sma(time);
		const p = 1.00001742096 * Math.pow(a, 1.5); // 2.7365 ~ 999d when rounded
		status.innerHTML = `<br>${a.toFixed(1)} au<br>
		${2.7365 < p ? `${p.toFixed(1)} yr` : `${(p*365.25).toFixed(0)} d`}<br>
		${(this.temp(time) - 273.15).toFixed(0)}°C`;
		// add events
		this.settings.events.filter(e => e.is_active(time)).forEach(e => status.appendChild(e.elem()));
	}
}

const CONSTANTS = {
	/** https://en.wikipedia.org/wiki/Age_of_Earth */
	ageEarth: 4540,
	/** https://en.wikipedia.org/wiki/Formation_and_evolution_of_the_Solar_System#Chronology */
	ageSun: 4600,
	/** @param {number} t - Mya */
	glacial(t){
		return (2837 < t && t < 2985) // Pongola
				|| (2200 < t && t < 2500) // Huronian
				|| (660 < t && t < 717) // Sturtian
				|| (632.3 < t && t < 654.5) // Marinoan
				|| (579.63 < t && t < 579.88) // Gaskiers
				|| (530 < t && t < 549); // Baykonurian
	},
	/** https://commons.wikimedia.org/wiki/File:Solar_evolution_(English).svg */
	sun: {
		/** @param {Time} time */
		radius(time){
			const t = CONSTANTS.ageSun - time.mya;
			// for first 300 Myr, goes from 0.86 -> 0.74. from then til now, gradual increase.
			return 0.00465047 *  (t < 300 ? t/300 * (0.74-0.86) + 0.86 : (t-300)/4300 * (1-0.74) + 0.74);
		},
		/** @param {Time} time */
		temp(time){
			const t = CONSTANTS.ageSun - time.mya;
			// for first 300 Myr, goes from 5772 -> 5666. from then til now, gradual increase.
			return t < 300 ? t/300 * (5666-5772) + 5772 : (t-300)/4300 * (5772-5666) + 5666;
		},
	},
	t: {
		grandTack: {
			get end(){
				return new Time(this.start.mya - this.length);
			},
			f(x = 0){
				return new Time((1-x)*this.start.mya + x*this.end.mya);
			},
			length: 0.6,
			get start(){
				// to give time for ice giants to form
				return Time.fromSolarAge(15.);
			},
		},
		nice: {
			get end(){
				return new Time(this.start.mya - this.length);
			},
			f(x = 0){
				return new Time((1-x)*this.start.mya + x*this.end.mya);
			},
			length: 30,
			get start(){
				return Time.fromSolarAge(500.);
			},
		},
	},
};

const SSEV = {
	au2pos(au = 0, img_offset = false){
		const min = 0.35; // au
		const max = 45; // au
		const f = Math.log(au/min)/Math.log(max/min);
		return `${100*f - (img_offset ? this.config.imgSize/2 : 0)}vw`;
	},
	config: {
		frame: 20,
		/** @type {number} setInterval of animation tick */
		interval: undefined,
		imgSize: 4,
		stepSize: 0.2,
		t: Time.fromSolarAge(0),
	},
	createButton(id, icon, label, onclick){
		const timeStepBackward = this.elem.time.stepForward = document.createElement('span');
		timeStepBackward.id = id;
		timeStepBackward.classList.add('button');
		timeStepBackward.innerHTML = icon;
		timeStepBackward.title = label;
		timeStepBackward.onclick = () => {
			onclick();
			SSEV.update();
		};
		return timeStepBackward;
	},
	elem: {
		/** @type {HTMLDivElement} */
		clock: undefined,
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
		},
	},
	init(){
		const main = this.elem.main = document.getElementById('main');
		// create clock
		const clock = this.elem.clock = document.createElement('div');
		clock.id = 'clock';
		main.appendChild(clock);
		// create time controls
		// reset button
		main.appendChild(this.createButton('timeReset', 'Reset', 'reset', () => {
			SSEV.config.t.mya = CONSTANTS.ageSun;
			SSEV.update();
		}));
		// step backward button
		main.appendChild(this.createButton('timeStepBackward', '&larr;', 'step backwards', () => SSEV.config.t.mya++));
		// speed down button
		main.appendChild(this.createButton('timeSlow', '--', 'decrease playback speed', () => SSEV.config.stepSize /= 2));
		// play/pause button
		main.appendChild(this.createButton('timePlay', '▶', 'play', () => {
			// handle setInterval
			SSEV.config.interval = SSEV.config.interval
				? clearInterval(SSEV.config.interval)
				: setInterval(() => SSEV.tick(), SSEV.config.frame);
			// change symbol
			timePlay.innerHTML = SSEV.config.interval ? '⏸' : '▶';
			timePlay.title = SSEV.config.interval ? 'pause' : 'play';
		}));
		// speed up button
		main.appendChild(this.createButton('timeFast', '++', 'increase playback speed', () => SSEV.config.stepSize *= 2));
		// step forward button
		main.appendChild(this.createButton('timeStepForward', '&rarr;', 'step forewards', () => SSEV.config.t.mya--));
		// display
		const timeDisplay = this.elem.time.display = document.createElement('span');
		timeDisplay.id = 'timeDisplay';
		main.appendChild(timeDisplay);
		// create planet elems
		this.planets.forEach(p => {
			const e = p.createElem();
			main.appendChild(e);
		});
		// create graticule
		[0.3, 0.4, 0.5, 0.75, 1, 2, 3, 4, 5, 7.5, 10, 20, 30, 40].forEach(g => {
			const e = document.createElement('div');
			e.classList.add('graticule');
			e.innerHTML = g;
			e.style.left = this.au2pos(g);
			main.appendChild(e);
		});
		// update
		this.update();
		// finish
		console.info('ssev.js initialized.');
	},
	planets: [
		// "10 million – 100 million years terrestrial planets form" [-50 to +40 rel to earth]
		// placeholder for inner SS evolution: https://www.youtube.com/watch?v=d27exZfXzsc edit: after checking all Algol's sources,
		// I suspect the orbital evolution of the inner ss shown in the video is made-up
		new Planet('Mercury', new PlanetPath(
			new PlanetCoords(Time.fromEarthAge(40), 0.387098),
			new PlanetCoords(new Time(0), 0.387098),
		), t => CONSTANTS.ageEarth-50 < t ? 'https://mocha2007.github.io/tools/ssev/proto.jpg'
			: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Mercury_in_true_color.jpg',
		{albedo: 0.088, events: [
			new PlanetEvent('Rembrandt Impact', 3890, 3910), // guessing +/- 10 Myr
		]}),
		new Planet('Venus', new PlanetPath(
			new PlanetCoords(Time.fromEarthAge(-30), 0.723332),
			new PlanetCoords(new Time(0), 0.723332),
		), t => CONSTANTS.ageEarth-50 < t ? 'https://mocha2007.github.io/tools/ssev/proto.jpg'
			// https://en.wikipedia.org/wiki/Venus#Magnetic_field_and_core
			// Possibly retained water for first 2-3 Byr - let's say this period ended 2000 Mya
			: 2000 < t ? 'https://mocha2007.github.io/tools/ssev/earth_archaean.jpg'
			: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Venus_from_Mariner_10.jpg',
		{albedo: t => 2000 < t ? 0.3 : 0.76, ghe: t => 2000 <= t ? 1.13 : 3.176724138, events: [
			new PlanetEvent('Global Resurfacing Event', 300, 500),
		]}),
		new Planet('Earth', new PlanetPath(
			new PlanetCoords(Time.fromEarthAge(-50), 1),
			new PlanetCoords(new Time(0), 1),
		), t => CONSTANTS.ageEarth-50 < t ? 'https://mocha2007.github.io/tools/ssev/proto.jpg'
			: 3500 < t ? 'https://mocha2007.github.io/tools/ssev/earth_archaean.jpg'
			// Glaciations
			: CONSTANTS.glacial(t) ? 'https://mocha2007.github.io/tools/ssev/snowball.jpg'
			: 'https://upload.wikimedia.org/wikipedia/commons/2/2d/Meteosat-12-fci-march-equinox-2025-noon.jpg',
			{albedo: t => CONSTANTS.glacial(t) ? 0.75 : 0.294, ghe: t => 500 < t ? 1.21
			// ghe fit to https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/All_palaeotemps.svg/3840px-All_palaeotemps.svg.png
			// use command SSEV.planets[2].temp(SSEV.config.t); 
			// (500, 1.21) -> (450, 1.16)
			: 450 < t ? 0.001*t + 0.71
			// (450, 1.16) -> (400, 1.19)
			: 400 < t ? -0.0006*t + 1.43
			// (400, 1.19) -> (300, 1.13)
			: 300 < t ? 0.0006*t + 0.96
			// (300, 1.13) -> (250, 1.18)
			: 250 < t ? -0.001*t + 1.43
			// (250, 1.18) -> (200, 1.15)
			: 200 < t ? 0.0006*t + 1.03
			// (200, 1.15) -> (100, 1.16)
			: 100 < t ? -0.0001*t + 1.17
			: 0.0003*t + 1.129058824
		, events: [
			new PlanetEvent('Hadean', 4031, 4567.3),
			new PlanetEvent('Eoarchean', 3600, 4031),
			new PlanetEvent('Paleoarchean', 3200, 3600),
			new PlanetEvent('Mesoarchean', 2800, 3200),
			new PlanetEvent('Neoarchean', 2500, 2800),
			new PlanetEvent('Paleoproterozoic', 1600, 2500),
			new PlanetEvent('Mesoproterozoic', 1000, 1600),
			new PlanetEvent('Tonian', 720, 1000),
			new PlanetEvent('Cryogenian', 635, 720),
			new PlanetEvent('Ediacaran', 538.8, 635),
			new PlanetEvent('Cambrian', 486.85, 538.8),
			new PlanetEvent('Ordovician', 443.1, 486.85),
			new PlanetEvent('Silurian', 419.62, 443.1),
			new PlanetEvent('Devonian', 358.9, 419.62),
			new PlanetEvent('Carboniferous', 298.9, 358.9),
			new PlanetEvent('Permian', 251.902, 298.9),
			new PlanetEvent('Triassic', 201.4, 251.902),
			new PlanetEvent('Jurassic', 143.1, 201.4),
			new PlanetEvent('Cretaceous', 66, 143.1),
			new PlanetEvent('Cenozoic', 0, 66),
		]}),
		new Planet('Theia', new PlanetPath(
			new PlanetCoords(Time.fromEarthAge(-10), 1),
			new PlanetCoords(Time.fromEarthAge(0), 1),
		), 'https://mocha2007.github.io/tools/ssev/proto.jpg', {offset:true}),
		new Planet('Ryugu', new PlanetPath(
			// https://www.science.org/doi/10.1126/sciadv.add8141
			// Its orgin lies between Saturn and Neptune. For clarity, I put it in the geometric mean of Uranus and Neptune (16.8 au)
			new PlanetCoords(Time.fromSolarAge(2), 16.8),
			new PlanetCoords(CONSTANTS.t.nice.start, 16.8),
			new PlanetCoords(CONSTANTS.t.nice.end, 1.1896),
			new PlanetCoords(new Time(0), 1.1896),
		), 'https://upload.wikimedia.org/wikipedia/commons/d/de/Ryugu_colored.jpg',
		{albedo: 0.037, minor: true, offset: true}),
		new Planet('Mars', new PlanetPath(
			new PlanetCoords(Time.fromEarthAge(-10), 1.52368055),
			new PlanetCoords(new Time(0), 1.52368055),
		), t => CONSTANTS.ageEarth-50 < t ? 'https://mocha2007.github.io/tools/ssev/proto.jpg'
			: 4000 < t ? 'https://mocha2007.github.io/tools/ssev/mars_4.0bya.jpg'
			: 3800 < t ? 'https://mocha2007.github.io/tools/ssev/mars_3.8bya.jpg'
			: 3500 < t ? 'https://mocha2007.github.io/tools/ssev/mars_3.5bya.jpg'
			: 2000 < t ? 'https://mocha2007.github.io/tools/ssev/mars_2.0bya.jpg'
			: 1000 < t ? 'https://mocha2007.github.io/tools/ssev/mars_1.0bya.jpg'
			: 'https://mocha2007.github.io/tools/ssev/mars.jpg'
		// ghe is smooth decay from +45% to modern +2%
		, {albedo: 0.25, ghe: t => 1.019856459 * Math.pow(1.45, t/CONSTANTS.ageEarth), events: [
			new PlanetEvent('Pre-Noachian', 4100, 4500),
			new PlanetEvent('Noachian', 3700, 4100),
			new PlanetEvent('Hesperian', 3000, 3700),
			new PlanetEvent('Amazonian', 0, 3000),
			// impacts
			new PlanetEvent('Utopia Planitia', 4100, 4300),
			new PlanetEvent('Isidis Planitia', 3890, 3910), // guessing +/- 10 Myr
			new PlanetEvent('Hellas Planitia', 3800, 4100),
			new PlanetEvent('Argyre Planitia', 3800, 4000),
		]}),
		new Planet('Vesta', new PlanetPath(
			// https://astrobiology.nasa.gov/news/where-did-vesta-come-from/?linkId=469571005
			new PlanetCoords(Time.fromSolarAge(15), 4),
			new PlanetCoords(CONSTANTS.t.grandTack.f(0), 4),
			new PlanetCoords(CONSTANTS.t.grandTack.f(1), 2.36),
			new PlanetCoords(new Time(0), 2.36),
		), 'https://upload.wikimedia.org/wikipedia/commons/5/51/Vesta_in_natural_color.jpg',
		{albedo: 0.423, minor: true}),
		new Planet('Lutetia', new PlanetPath(
			// https://www.space.com/13597-asteroid-lutetia-earth-birth.html
			new PlanetCoords(Time.fromSolarAge(15), 0.85),
			new PlanetCoords(new Time(4050), 0.85),
			new PlanetCoords(new Time(3950), 2.435),
			new PlanetCoords(new Time(0), 2.435),
		), 'https://upload.wikimedia.org/wikipedia/commons/1/17/Rosetta_triumphs_at_asteroid_Lutetia.jpg',
		{albedo: 0.073, minor: true, offset: true}),
		new Planet('Ceres', new PlanetPath(
			// https://en.wikipedia.org/wiki/Ceres_(dwarf_planet)#Origin_and_evolution
			new PlanetCoords(Time.fromSolarAge(15), 4),
			new PlanetCoords(CONSTANTS.t.grandTack.f(0), 4),
			new PlanetCoords(CONSTANTS.t.grandTack.f(1), 2.77),
			new PlanetCoords(new Time(0), 2.77),
		), 'https://upload.wikimedia.org/wikipedia/commons/7/76/Ceres_-_RC3_-_Haulani_Crater_%2822381131691%29_%28cropped%29.jpg',
		{albedo: 0.09, minor: true}),
		new Planet('Hygiea', new PlanetPath(
			new PlanetCoords(new Time(2500), 3.144),
			new PlanetCoords(new Time(0), 3.144),
		), 'https://upload.wikimedia.org/wikipedia/commons/8/88/SPHERE_image_of_Hygiea.jpg',
		{albedo: 0.063, minor: true, offset: true}),
		// Nice Model begins like ~ 6 Myr
		// PRIMARY source: Deienno 2017
		// cf: https://commons.wikimedia.org/wiki/File:Tsiganis2005-1.svg
		// cf: https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Nesvorny2011-1.svg/3840px-Nesvorny2011-1.svg.png
		// 3:2 3:2 2:1 3:2
		new Planet('Jupiter', new PlanetPath(
			// https://en.wikipedia.org/wiki/Grand_tack_hypothesis
			// https://image1.slideserve.com/2642524/grand-tack-scenario-l.jpg
			// (0 Myr, 3.5 au) -> (3 Myr, 1.5 au) -> (6 Myr, 5.2 au)
			new PlanetCoords(Time.fromSolarAge(5), 3.5),
			new PlanetCoords(CONSTANTS.t.grandTack.f(0), 3.5),
			new PlanetCoords(CONSTANTS.t.grandTack.f(1/6), 1.5),
			new PlanetCoords(CONSTANTS.t.grandTack.f(1), 5.4),
			new PlanetCoords(CONSTANTS.t.nice.f(17/30), 5.4),
			new PlanetCoords(CONSTANTS.t.nice.f(18/30), 5.2038),
			new PlanetCoords(new Time(0), 5.2038),
		), 'https://upload.wikimedia.org/wikipedia/commons/e/e2/Jupiter_OPAL_2024.png',
		{albedo: 0.503}),
		new Planet('Saturn', new PlanetPath(
			new PlanetCoords(Time.fromSolarAge(10), 4.5),
			new PlanetCoords(CONSTANTS.t.grandTack.f(0), 4.5),
			new PlanetCoords(CONSTANTS.t.grandTack.f(0.9/6), 4.5),
			new PlanetCoords(CONSTANTS.t.grandTack.f(1/6), 2),
			new PlanetCoords(CONSTANTS.t.grandTack.f(1), 7),
			new PlanetCoords(CONSTANTS.t.nice.f(17/30), 5.4 * Math.pow(1.5, 2/3)),
			new PlanetCoords(CONSTANTS.t.nice.f(18/30), 9.5826),
			new PlanetCoords(new Time(0), 9.5826),
		), t => 100 < t ? 'https://mocha2007.github.io/tools/ssev/saturn_no_rings.jpg'
			: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Saturn_-_August_11_1981_%2850903906546%29.jpg',
		{albedo: 0.342}),
		new Planet('Phoebe', new PlanetPath(
			new PlanetCoords(Time.fromSolarAge(3), 25),
			new PlanetCoords(CONSTANTS.t.nice.start, 25),
			new PlanetCoords(CONSTANTS.t.nice.end, 9.5826),
		), 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Phoebe_cassini_full.jpg',
		{albedo: 0.023, minor: true}),
		new Planet('5th Giant', new PlanetPath(
			new PlanetCoords(Time.fromSolarAge(15), 5.2),
			new PlanetCoords(CONSTANTS.t.grandTack.f(0), 5.2),
			new PlanetCoords(CONSTANTS.t.grandTack.f(1), 5.4 * Math.pow(1.5*1.5, 2/3)),
			new PlanetCoords(CONSTANTS.t.nice.start, 5.4 * Math.pow(1.5*1.5, 2/3)),
			new PlanetCoords(CONSTANTS.t.nice.f(18/30), 10.8),
		), 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Fifth_Giant.png',
		{albedo: 0.3}),
		new Planet('Uranus', new PlanetPath(
			new PlanetCoords(Time.fromSolarAge(15), 6),
			new PlanetCoords(CONSTANTS.t.grandTack.f(0), 6),
			new PlanetCoords(CONSTANTS.t.grandTack.f(1/3), 5),
			new PlanetCoords(CONSTANTS.t.grandTack.f(1), 5.4 * Math.pow(1.5*1.5*2, 2/3)),
			new PlanetCoords(CONSTANTS.t.nice.start, 5.4 * Math.pow(1.5*1.5*2, 2/3)),
			new PlanetCoords(CONSTANTS.t.nice.f(17/30), 17.2),
			new PlanetCoords(CONSTANTS.t.nice.f(18/30), 19.19126),
			new PlanetCoords(new Time(0), 19.19126),
		), 'https://upload.wikimedia.org/wikipedia/commons/6/69/Uranus_Voyager2_color_calibrated.png',
		{albedo: 0.3}),
		new Planet('Neptune', new PlanetPath(
			new PlanetCoords(Time.fromSolarAge(15), 8),
			new PlanetCoords(CONSTANTS.t.grandTack.f(0), 8),
			new PlanetCoords(CONSTANTS.t.grandTack.f(1/3), 7.5),
			new PlanetCoords(CONSTANTS.t.grandTack.f(1), 5.4 * Math.pow(1.5*1.5*2*1.5, 2/3)),
			new PlanetCoords(CONSTANTS.t.nice.start, 5.4 * Math.pow(1.5*1.5*2*1.5, 2/3)),
			new PlanetCoords(CONSTANTS.t.nice.f(0.25), 22),
			new PlanetCoords(CONSTANTS.t.nice.f(0.375), 27.2),
			new PlanetCoords(CONSTANTS.t.nice.end, 30.07),
			new PlanetCoords(new Time(0), 30.07),
		), 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Neptune_Voyager2_color_calibrated.png',
		{albedo: 0.29}),
		// Kuiper belt WAS 20-35 au before Nice
		new Planet('Triton', new PlanetPath(
			new PlanetCoords(Time.fromSolarAge(15), 30),
			new PlanetCoords(CONSTANTS.t.nice.end, 30),
			// https://en.wikipedia.org/wiki/Capture_of_Triton
		), 'https://upload.wikimedia.org/wikipedia/commons/6/65/Triton_True_Color.png',
		{albedo: 0.76, minor: true}),
		new Planet('Pluto', new PlanetPath(
			new PlanetCoords(Time.fromSolarAge(15), 35),
			new PlanetCoords(CONSTANTS.t.nice.f(0.375), 35),
			new PlanetCoords(CONSTANTS.t.nice.end, 39.482),
			new PlanetCoords(new Time(0), 39.482),
		), 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Pluto_in_True_Color_-_High-Res.png',
		{albedo: 0.72, minor: true}),
		// new Planet('Haumea', new PlanetPath(
		// 	new PlanetCoords(Time.fromSolarAge(15), 31.5),
		// 	new PlanetCoords(CONSTANTS.t.nice.f(0.25), 31.5),
		// 	new PlanetCoords(CONSTANTS.t.nice.f(0.375), 39),
		// 	new PlanetCoords(CONSTANTS.t.nice.end, 43.116),
		// 	new PlanetCoords(new Time(0), 43.116),
		// ), 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Haumea_Rotation.gif',
		// {albedo: 0.33, minor: true, offset: true}),
	],
	set(mya){
		this.config.t.mya = mya;
		this.update();
	},
	tick(){
		// increment step
		this.config.t.mya -= this.config.stepSize;
		this.config.t.mya = Math.max(0, this.config.t.mya);
		this.update();
	},
	update(){
		// update planet positions
		this.planets.forEach(p => {
			p.elem.style.left = p.pos(this.config.t);
			p.updateStatus(this.config.t);
			const newSrc = p.img(this.config.t.mya);
			if (p.img_preload.src !== newSrc) p.img_preload.src = newSrc;
		});
		// update timer
		const speed = 1000/this.config.frame * this.config.stepSize * 365.25e6 * 24 * 60 * 60 / 1e12;
		this.elem.time.display.innerHTML = `${this.config.t.mya.toFixed(1)} Myr ago -
		Solar Age: ${(CONSTANTS.ageSun - this.config.t.mya).toFixed(1)} Myr -
		Speed: ${speed.toFixed()} trillion &times;`;
	}
};

SSEV.init();