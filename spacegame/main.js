/* jshint esversion: 6, strict: true, forin: false, loopfunc: true, strict: global */
/* exported downloadSave, Game, wipeMap */
// begin basic block
'use strict';

/** @param {number} number */
function round(number, digits = 0){
	number *= Math.pow(10, digits);
	number = Math.round(number);
	number /= Math.pow(10, digits);
	return number;
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

/** https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS
 * @param {string} name
 * @return {HTMLUnknownElement}
 */
function createSvgElement(name = 'svg'){
	return document.createElementNS('http://www.w3.org/2000/svg', name);
}
// end basic block
// begin math block
const pi = Math.PI;
const deg = pi/180;

function linspace(from = 0, to = 1, points = 1){
	return new Array(points).fill(0).map((_, i) => i/points * (to-from) + from);
}

/**
 * @param {number} n
 * @param {number} m
 */
function mod(n, m){
	return (n%m+m)%m;
}

function range(n = 0){
	return Array.from(Array(n).keys());
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

// end math block
// begin astro block
const minute = 60;
const hour = 60*minute;
const day = 24*hour;
const year = 365.2425 * day;
const universeAge = 13.799e9 * year;

const au = 149597870700;
const boltzmann = 1.380649e-23; // J/K; exact; https://en.wikipedia.org/wiki/Boltzmann_constant
const gravConstant = 6.674e-11;
const L_0 = 3.0128e28; // W; exact; zero point luminosity
const planck = 6.62607015e-34; // J*s; exact; https://en.wikipedia.org/wiki/Planck_constant
const speedOfLight = 299792458; // m/s; exact; https://en.wikipedia.org/wiki/Speed_of_light

const colorFreq = {
	red: 440e12,
	green: 550e12,
	blue: 640e12,
};

// infobox crap
const visibleProperties = [
	'name',
	'classification',
	'esi',
	'mass',
	'radius',
	'density',
	'surfaceGravity',
	'temp',
	'tempDelta',
	'v_e',
	// orbit
	'orbit',
	'period',
	'sma',
	'ecc',
];
const specialUnits = {
	'density': {
		'constant': 1000,
		'name': 'g/cm&sup3;',
	},
	'mass': {
		'constant': 5.97237e24,
		'name': 'Earths',
	},
	'period': {
		'constant': year,
		'name': 'yr',
	},
	'radius': {
		'constant': 1000,
		'name': 'km',
	},
	'sma': {
		'constant': au,
		'name': 'au',
	},
	'surfaceGravity': {
		'constant': 9.7,
		'name': 'g',
	},
	'temp': {
		'constant': 1,
		f(x){
			return x-273.2;
		},
		'name': '&deg;C',
	},
	'v_e': {
		'constant': 1000,
		'name': 'km/s',
	},
};

class Body {
	/**
	 * @param {number} mass
	 * @param {number} radius
	 * @param {number} albedo
	 * @param {Orbit} orbit
	 * @param {string} name
	 */
	constructor(mass, radius, albedo, orbit, name){
		this.mass = mass;
		this.radius = radius;
		this.albedo = albedo;
		this.orbit = orbit;
		this.name = name;
		this.destroyed = false;
	}
	get classification(){
		if (2e26 < this.mass){
			return 'gasGiant';
		}
		if (6e25 < this.mass){
			return 'iceGiant';
		}
		if (2e24 < this.mass){
			return 'terra';
		}
		if (5e23 < this.mass){
			return 'desert';
		}
		return 'rock';
	}
	get density(){
		return this.mass / this.volume;
	}
	get esi(){
		const r = this.radius;
		const rho = this.density;
		const T = this.temp;
		const rE = earth.radius;
		const rhoE = earth.density;
		const TE = 255;
		const esi1 = 1-Math.abs((r-rE)/(r+rE));
		const esi2 = 1-Math.abs((rho-rhoE)/(rho+rhoE));
		const esi3 = 1-Math.abs((this.v_e-earth.v_e)/(this.v_e+earth.v_e));
		const esi4 = 1-Math.abs((T-TE)/(T+TE));
		return Math.pow(esi1, 0.57/4) * Math.pow(esi2, 1.07/4) *
			Math.pow(esi3, 0.7/4) * Math.pow(esi4, 5.58/4);
	}
	/** @return {HTMLDivElement} */
	get getElement(){
		return document.getElementById(this.name);
	}
	get info(){
		const table = document.createElement('table');
		for (const i in visibleProperties){
			const property = visibleProperties[i];
			if (this[property] === undefined){
				continue;
			}
			let value = this[property];
			const row = document.createElement('tr');
			let cell = document.createElement('th');
			cell.innerHTML = property;
			row.appendChild(cell);
			cell = document.createElement('td');
			if (property === 'orbit'){
				cell.appendChild(this.orbit.info);
			}
			else if (specialUnits.hasOwnProperty(property)){
				if (specialUnits[property].hasOwnProperty('f')){
					value = specialUnits[property].f(value);
				}
				cell.innerHTML = round(value/specialUnits[property].constant, 2) + ' ' +
					specialUnits[property].name;
			}
			else {
				cell.innerHTML = typeof value === 'number'? round(value, 2) : value;
			}
			row.appendChild(cell);
			table.appendChild(row);
		}
		return table;
	}
	get isPHW(){
		// https://mocha2007.github.io/worldbuilding_guide
		return earth.mass/37 < this.mass && this.mass < 10*earth.mass &&
			205 < this.temp && this.temp < 305 && 0.73 < this.esi; // +/-50K from earth; mars is 0.73
	}
	get mu(){
		return this.mass * gravConstant;
	}
	get surfaceGravity(){
		return this.mu/Math.pow(this.radius, 2);
	}
	get temp(){
		return this.tempAt(this.orbit.sma);
	}
	// methods
	draw(){
		let planetIcon = document.getElementById(this.name);
		// check destruction
		if (this.destroyed){
			// icon
			planetIcon.classList.value = 'destroyed';
			// orbit
			document.getElementById(this.orbit.orbitId).classList.value = 'destroyed';
			// orbit bar
			document.getElementById('orbitBar' + this.name).classList.value = 'destroyed';
			return;
		}
		// else continue
		if (planetIcon === null){
			planetIcon = createSvgElement('circle');
			planetIcon.id = planetIcon.title = this.name;
			Game.svg.bodies.appendChild(planetIcon);
		}
		planetIcon.classList.value = 'planet ' + this.classification;
		if (this.isPHW){
			planetIcon.classList.add('phw');
		}
		const planetCoords = this.orbit.coords;
		planetIcon.setAttribute('cx', planetCoords[0]);
		planetIcon.setAttribute('cy', planetCoords[1]);
		// planetIcon.setAttribute('fill', this.color);
		const index = Game.system.secondaries.indexOf(this);
		planetIcon.onclick = () => setBody(index);
		// check if selection...
		if (getID() === index){
			planetIcon.classList.value += ' ' + selectionStyle[Game.settings.selectionStyle];
		}
		// check if colony
		if (Game.player.colonyID === index){
			planetIcon.classList.value += ' colony';
		}
		// orbit bar
		if (!document.getElementById('orbitBar' + this.name)){
			const orbitBarRect = this.orbit.orbitBarRect;
			orbitBarRect.id = 'orbitBar' + this.name;
			orbitBarRect.style['background-color'] = document.defaultView.getComputedStyle(planetIcon).fill;
			orbitBarRect.onclick = () => setBody(index);
			orbitBarRect.title = this.name;
			Game.orbitBar.appendChild(orbitBarRect);
		}
	}
	/** @param {number} dist */
	tempAt(dist){
		return this.orbit.parent.temperature * Math.pow(1-this.albedo, 0.25) *
			Math.sqrt(this.orbit.parent.radius/2/dist);
	}
	get tempDelta(){
		const mean = this.temp;
		const plus = round(this.tempAt(this.orbit.periapsis) - mean, 2);
		const minus = round(mean - this.tempAt(this.orbit.apoapsis), 2);
		const elem = document.createElement('span');
		const plusElement = document.createElement('sup');
		plusElement.classList = 'supsub';
		plusElement.innerHTML = '+' + plus;
		elem.appendChild(plusElement);
		const minusElement = document.createElement('sub');
		minusElement.classList = 'supsub';
		minusElement.innerHTML = '-' + minus;
		elem.appendChild(minusElement);
		return elem.innerHTML;
	}
	get volume(){
		return 4/3 * pi * Math.pow(this.radius, 3);
	}
	// eslint-disable-next-line camelcase
	get v_e(){
		return Math.pow(2*this.mu/this.radius, 0.5);
	}
	// static methods
	/** @param {number} mass */
	static densityFromMass(mass){
		if (2e26 < mass){
			return Game.rng.uniform(600, 1400);
		}
		if (6e25 < mass){
			return Game.rng.uniform(1200, 1700);
		}
		return Game.rng.uniform(3900, 5600);
	}
	/**
	 * @param {number} sma
	 * @param {Star} star
	*/
	static gen(sma, star){
		/** @param {number} s */
		function generateBody(s){
			s /= au * Math.sqrt(star.mass/sun.mass); // scale based on ~temp
			let mass;
			if (0.8 < s && s < 1.5){
				mass = Math.pow(10, Game.rng.uniform(23.8, 25.2));
			}
			else if (5 < s && s < 31){
				mass = Math.pow(10, Game.rng.uniform(25.9, 28.3));
			}
			else {
				mass = 2*Math.pow(10, Game.rng.uniform(17, 27));
			}
			const density = Body.densityFromMass(mass);
			const radius = Math.pow(mass/(density*4/3*pi), 1/3);
			const albedo = Game.rng.uniform(0.1, 0.7);
			return new Body(mass, radius, albedo);
		}
		/** @param {number} s */
		function generateOrbit(s){
			// http://exoplanets.org/plots
			// https://www.desmos.com/calculator/ixd7gm2hpy
			const parent = star;
			const ecc = Game.rng.uniform(0, 0.21); // Math.pow(Game.rng.random(), 2.2)
			const inc = Game.rng.uniform(0, 0.13);
			const aop = Game.rng.uniform(0, 2*pi);
			const lan = Game.rng.uniform(0, 2*pi);
			const man = Game.rng.uniform(0, 2*pi);
			return new Orbit(parent, s, ecc, inc, aop, lan, man);
		}
		const planet = generateBody(sma);
		planet.orbit = generateOrbit(sma);
		planet.name = 'Sol-' + Game.rng.randint(100000, 999999);
		return planet;
	}
	static test(){
		return range(100).map(() => Body.gen(au, sun));
	}
}

class Orbit {
	/**
	 * @param {Body} parent
	 * @param {number} sma
	 * @param {number} ecc
	 * @param {number} aop
	 * @param {number} man
	 */
	constructor(parent, sma, ecc, inc, aop, lan, man){
		this.parent = parent;
		this.sma = sma; // a
		this.ecc = ecc; // e
		this.inc = inc; // i
		this.aop = aop; // omega
		this.lan = lan; // Omega
		this.man = man; // M
		this.lastZoom = 0;
	}
	// functions
	get apoapsis(){
		return (1+this.ecc)*this.sma;
	}
	/** @param {number} t */
	cartesian(t){
		// 2
		const E = this.eccentricAnomaly(t);
		// 3
		const nu = this.trueAnomaly(t);
		// 4
		const [a, e] = [this.sma, this.ecc];
		const rC = a*(1-e*Math.cos(E));
		// 5
		// const mu = this.parent.mu;
		const o = [Math.cos(nu), Math.sin(nu), 0].map(z => rC*z);
		// const o_ = [-Math.sin(E), Math.sqrt(1-e*e)*Math.cos(E), 0].forEach(z => Math.sqrt(mu*a)/rC*z);
		// 6
		const i = this.inc;
		const [om, Om] = [this.aop, this.lan];
		const [c, C, s, S] = [Math.cos(om), Math.cos(Om), Math.sin(om), Math.sin(Om)];
		function r(x){
			return [
				x[0]*(c*C - s*Math.cos(i)*S) - x[1]*(s*C + c*Math.cos(i)*S),
				x[0]*(c*S + s*Math.cos(i)*C) + x[1]*(c*Math.cos(i)*C - s*S),
				x[0]*(s*Math.sin(i)) + x[1]*(c*Math.sin(i)),
			];
		}
		return r(o);
	}
	get coords(){
		return this.coordsAt(Game.time);
	}
	/**
	 * @param {number} t
	 * @return {[number, number]}
	*/
	coordsAt(t){
		const absCoords = this.cartesian(t);
		const x = remap(absCoords[0],
			[-Game.systemWidth, Game.systemWidth], [0, window.innerWidth]);
		const y = remap(absCoords[1],
			[-Game.systemHeight, Game.systemHeight], [0, window.innerHeight]);
		return [x, y];
	}
	draw(){
		const resolution = 64; // lines to draw
		// if group doesn't exist, create it, and its children.
		if (!document.getElementById(this.orbitId)){
			// create element and its children
			const g = createSvgElement('g');
			g.id = this.orbitId;
			Game.svg.orbits.appendChild(g);
			for (let i = 0; i < resolution; i++){
				const line = createSvgElement('line');
				line.id = this.orbitId + '-' + i;
				line.setAttribute('style', 'stroke:red;stroke-width:1');
				g.appendChild(line);
			}
		}
		if (this.lastZoom !== Game.systemHeight){
			const step = this.period/resolution;
			// update children endpoints
			for (let i = 0; i < resolution; i++){
				const line = document.getElementById(this.orbitId + '-' + i);
				const [x1, y1] = this.coordsAt(i*step);
				const [x2, y2] = this.coordsAt((i+1)*step);
				line.setAttribute('x1', x1);
				line.setAttribute('y1', y1);
				line.setAttribute('x2', x2);
				line.setAttribute('y2', y2);
			}
			this.lastZoom = Game.systemHeight;
		}
	}
	/** @param {number} t */
	eccentricAnomaly(t){
		const tol = 1e-10;
		const M = mod(this.man + 2*pi*t/this.period, 2*pi);
		let E = M;
		let oldE = E + 2*tol;
		while (tol < Math.abs(E-oldE)){
			oldE = E;
			E = M + this.ecc*Math.sin(E);
		}
		return E;
	}
	get info(){
		const table = document.createElement('table');
		for (const i in visibleProperties){
			const property = visibleProperties[i];
			if (this[property] === undefined){
				continue;
			}
			const value = this[property];
			const row = document.createElement('tr');
			let cell = document.createElement('th');
			cell.innerHTML = property;
			row.appendChild(cell);
			cell = document.createElement('td');
			if (property === 'parent'){
				cell.innerHTML = this.parent.name;
			}
			else if (specialUnits.hasOwnProperty(property)){
				cell.innerHTML = round(value/specialUnits[property].constant, 2) + ' ' +
					specialUnits[property].name;
			}
			else {
				cell.innerHTML = round(value, 2);
			}
			row.appendChild(cell);
			table.appendChild(row);
		}
		return table;
	}
	get orbitBarRect(){
		const rect = document.createElement('span');
		const p = remap(this.periapsis, [0, Game.system.maxOrbitRadius], [0, Game.orbitbarWidth]);
		const width = remap(this.apoapsis - this.periapsis,
			[0, Game.system.maxOrbitRadius], [0, Game.orbitbarWidth]);
		rect.style.width = width + 'px';
		rect.style.position = 'absolute';
		rect.style.left = p + 'px';
		rect.style.cursor = 'pointer';
		rect.innerHTML = '&nbsp;';
		return rect;
	}
	get orbitId(){
		return this.sma.toString();
	}
	get periapsis(){
		return (1-this.ecc)*this.sma;
	}
	get period(){
		return 2*pi*Math.pow(Math.pow(this.sma, 3)/this.parent.mu, 0.5);
	}
	/** @param {number} t */
	trueAnomaly(t){
		const E = this.eccentricAnomaly(t);
		const e = this.ecc;
		return 2 * Math.atan2(Math.pow(1+e, 0.5) * Math.sin(E/2),
			Math.pow(1-e, 0.5) * Math.cos(E/2));
	}
	// static methods
	/** @param {number} previousSMA */
	static nextSMA(previousSMA){
		return previousSMA * Game.rng.uniform(1.38, 2.01);
	}
}

class Star extends Body {
	/**
	 * @param {number} mass
	 * @param {number} radius (base radius, varies with age)
	 * @param {string} name
	 * @param {number} luminosity (base luminosity, varies with age)
	 * @param {number} temperature (base temperature, varies with age)
	 * @param {number} age
	 */
	constructor(mass, radius, name, luminosity, temperature, age){
		super(mass, radius, undefined, undefined, name);
		this.radius_ = radius;
		this.luminosity_ = luminosity;
		this.temperature_ = temperature;
		this.age_ = age;
	}
	get absMag(){
		return -2.5 * Math.log10(this.luminosity / L_0);
	}
	get age(){
		return this.age_ + Game.time;
	}
	get class(){
		return this.spectralType + this.luminosityClass;
	}
	get color(){
		const t = this.temperature;
		const rAbs = planckLaw(colorFreq.red, t);
		const gAbs = planckLaw(colorFreq.green, t);
		const bAbs = planckLaw(colorFreq.blue, t);
		const max = Math.max(rAbs, gAbs, bAbs)/255;
		// [800, 3500] => [black, red]
		const value = 3500 < t ? 1 : Math.max(0.1, (t - 800)/2700);
		const r = round(rAbs/max*value);
		const g = round(gAbs/max*value);
		const b = round(bAbs/max*value);
		return `rgb(${r}, ${g}, ${b})`;
	}
	get id(){
		return this.name.toLowerCase();
	}
	get info(){
		return `${this.name}

Class: ${this.class}
Mass: ${round(this.mass/sun.mass, 2)} M_sun
Temperature: ${round(this.temperature).toLocaleString()} K
Abs Mag: ${round(this.absMag, 2)}
Age: ${round(this.age/(1e6*year)).toLocaleString()} Myr`;
	}
	/** @return lifespan in seconds */
	get lifespan(){
		return 3e17*Math.pow(this.mass/sun.mass, -2.5162);
	}
	get luminosity(){
		const f = this.lifespanFraction;
		let l = 1;
		if (f < 0.6){
			l = 0.693 * Math.exp(0.991*f);
		}
		else if (f < 0.9){
			l = 0.42 * Math.exp(1.78*f);
		}
		else if (f < 0.93){
			l = 1.01 * Math.exp(0.814*f);
		}
		else if (f < 0.97){
			l = 3.62e-9 * Math.exp(21.7*f);
		}
		else if (f < 1){
			l = 7.08e-39 * Math.exp(91.9*f);
		}
		else { // white dwarf
			const x = (this.age - this.lifespan)/(1e6*year); // time since death, Myr
			l = 4.9 * Math.pow(x, -1.32);
		}
		return this.luminosity_ * l;
	}
	get lifespanFraction(){
		return this.age / this.lifespan;
	}
	get luminosityClass(){
		if (1 < this.lifespanFraction){
			// https://en.wikipedia.org/wiki/White_dwarf
			return 'VII';
		}
		if (11777 / 12474 < this.lifespanFraction){ // appx.
			// https://en.wikipedia.org/wiki/Giant_star
			return 'III';
		}
		if (10521 / 12474 < this.lifespanFraction){ // appx.
			// https://en.wikipedia.org/wiki/Subgiant
			return 'IV';
		}
		return 'V';
	}
	get radius(){
		let c = 1;
		let w = 0;
		if (this.lifespanFraction < 0.6){
			c = 0.878*Math.exp(0.373*this.lifespanFraction);
		}
		else if (this.lifespanFraction < 0.9){ // accurate [0.6, 0.9]
			c = 0.547*Math.exp(1.13*this.lifespanFraction);
		}
		else if (this.lifespanFraction < 0.975){ // accurate [0.9, 0.975]
			c = 2.33e-04*Math.exp(9.79*this.lifespanFraction);
		}
		else if (this.lifespanFraction < 1){ // accurate [0.975, 1]
			c = 4.5e-70*Math.exp(165*this.lifespanFraction); // ideally this would max out at ~258
		}
		else { // white dwarf
			w = 0.0126; // asymptotic radius
			const x = (this.age - this.lifespan)/(1e6*year); // time since death, Myr
			c = 8.32e-3 * Math.pow(x, -0.297);
		}
		return this.radius_ * (c + w);
	}
	set radius(_){}
	get spectralType(){
		/** @type {[string, number][]} */
		const classes = [
			['O', 30000],
			['B', 10000],
			['A', 7500],
			['F', 6000],
			['G', 5200],
			['K', 3700],
			['M', 2400],
			['X', 0],
		];
		const i = classes.findIndex(x => x[1] < this.temperature);
		if (!i){
			return classes[0][0]+9;
		}
		const c2 = linspace(classes[i-1][1], classes[i][1], 10);
		const i2 = c2.findIndex(x => x < this.temperature);
		return classes[i][0]+(i2 === -1 ? 9 : i2);
	}
	get temperature(){
		let c = 1;
		if (this.lifespanFraction < 0.6){
			c = 0.979 * Math.exp(0.0543 * this.lifespanFraction);
		}
		else if (this.lifespanFraction < 0.9){
			c = 1.09 * Math.exp(-0.124 * this.lifespanFraction);
		}
		else if (this.lifespanFraction < 1){
			c = 7.89 * Math.exp(-2.34 * this.lifespanFraction);
		}
		else { // white dwarf
			const x = (this.age - this.lifespan)/(1e6*year); // time since death, Myr
			c = 10.7 * Math.pow(x, -0.302);
		}
		return this.temperature_ * c;
	}
	// static methods
	/** @param {number} mass in suns */
	static ageGen(mass){
		const s = new Star(mass*sun.mass);
		return Game.rng.uniform(15.5e6*year, Math.min(universeAge, s.lifespan));
	}
	static debug(){
		setInterval(() => console.log(Game.system.primary.lifespanFraction,
			Game.system.primary.temperature), 1000);
		Game.speed = Game.system.primary.lifespan / 100;
	}
	/** @param {number} mass in suns */
	static gen(mass = this.massGen()){
		const luminosity = 0.45 < mass ? 1.148*Math.pow(mass, 3.4751) : 0.2264*Math.pow(mass, 2.52);
		return new Star(sun.mass*mass, sun.radius*Math.pow(mass, 0.96), 'Star',
			sun.luminosity_*luminosity, sun.temperature_*Math.pow(mass, 0.54), Star.ageGen(mass));
	}
	/** solar masses */
	static massGen(){
		return Math.exp(Game.rng.uniform(-0.9, 0.9)); // ~ [0.407, 2.460), expected value = 1
		// Generating a successful system below 0.43 M_sun is VERY rare... don't set the min below that!!!
		// 2.5 has a lifespan of 1 billion years
		// The lower limit is b/w 0.39 and 0.4; upper b/w 50 and ???
	}
}

class System {
	/**
	 * @param {Body} primary
	 * @param {Body[]} secondaries
	 */
	constructor(primary = Star.gen(), secondaries = System.gen(primary)){
		this.primary = primary;
		this.secondaries = secondaries;
	}
	/** maximum apoapsis */
	get maxOrbitRadius(){
		return Math.max(...this.secondaries.map(p => p.orbit.apoapsis));
	}
	/** minimum periapsis */
	get minOrbitRadius(){
		return Math.min(...this.secondaries.map(p => p.orbit.periapsis));
	}
	// static methods
	/** @param {Star} star */
	static gen(star, attempt = 0){
		if (9 < attempt && attempt % 10 === 0){
			console.warn(attempt + ' failed attempts');
		}
		else if (100 < attempt){
			// too many failed attempts... something is broken :(
			return window.location.reload();
		}
		const numberOfPlanets = Game.rng.randint(6, 12); // max observed = 8 (Sol)
		// (scaled) HD 10180b = 0.0216; Mercury = 0.3871
		// cf. https://en.wikipedia.org/wiki/List_of_multiplanetary_systems
		const c = Game.rng.uniform(0.1, 0.4);
		const startSMA = c*au*Math.pow(star.mass/sun.mass, 2);
		const SMAList = [startSMA];
		for (let i=1; i<numberOfPlanets; i+=1){
			SMAList[i] = Orbit.nextSMA(SMAList[i-1]);
		}
		const systemAttempt = SMAList.map(a => Body.gen(a, star));
		if (systemAttempt.some(x => x.isPHW)){
			console.log('Generated system with PHW on attempt #' + (attempt+1));
			return systemAttempt;
		}
		return this.gen(star, attempt+1);
	}
}

const sun = new Star(1.9885e30, 6.957e8, 'Sun', 3.828e26, 5778, 4.543e9*year);
/** @type {Body} */
const earth = new Body(5.97237e24, 6371000, 0.306,
	new Orbit(sun, 1.49598023e11, 0.0167086, 0, 114.20783*deg, 0, 0.1249), 'Earth');

// https://en.wikipedia.org/wiki/Planck's_law
function planckLaw(freq, temp){
	const c = speedOfLight;
	const h = planck;
	const k = boltzmann;
	return 2*h*Math.pow(freq, 3)/Math.pow(c, 2) / (Math.exp(h*freq/(k*temp))-1);
}
// end astro block
// begin gameplay block

class GameEventOption {
	constructor(text = 'OK', onClick = () => undefined){
		this.text = text;
		this.onClick = onClick;
	}
}

class GameEvent {
	/**
	 * @param {string} title
	 * @param {string} desc
	 * @param {number} mtth
	 */
	constructor(title, desc, mtth, condition = () => true, options = [new GameEventOption()]){
		this.title = title;
		this.desc = desc;
		this.mtth = mtth;
		this.condition = condition;
		this.options = options;
	}
	get id(){
		return Game.events.indexOf(this);
	}
	draw(){
		const eventElement = document.createElement('div');
		// title
		const title = document.createElement('h2');
		title.innerHTML = this.title;
		eventElement.appendChild(title);
		// desc
		const desc = document.createElement('p');
		desc.innerHTML = this.desc;
		eventElement.appendChild(desc);
		// options
		const optionList = document.createElement('ul');
		this.options.forEach(e => {
			const option = document.createElement('li');
			const optionButton = document.createElement('input');
			optionButton.type = 'submit';
			optionButton.value = e.text;
			optionButton.onclick = () => {
				e.onClick();
				this.remove();
				const eventNode = document.getElementById('event'+this.id);
				eventNode.parentNode.removeChild(eventNode);
			};
			option.appendChild(optionButton);
			optionList.appendChild(option);
		});
		eventElement.appendChild(optionList);
		return eventElement;
	}
	remove(){
		Game.player.events = Game.player.events.filter(id => id !== this.id);
	}
}

class Order {
	/**
	 * @param {string} type
	 * @param {number} progressNeeded
	 * @param {Object<string, number>} cost
	 * @param {Object<string, number>} shipCost
	 * @param {Object<string, number>} consumption
	 */
	constructor(type, progressNeeded, cost, shipCost, consumption, onComplete = () => undefined){
		this.type = type;
		this.progressNeeded = progressNeeded;
		this.cost = cost;
		this.shipCost = shipCost;
		this.consumption = consumption;
		this.onComplete = onComplete;
	}
	get affordable(){
		// check resource costs
		for (const resource in this.cost){
			if (Game.player.resources[resource] < this.cost[resource]){
				return false;
			}
		}
		// check ship costs
		for (const shipClass in this.shipCost){
			if (!Game.player.navy.hasOwnProperty(shipClass) ||
				Game.player.navy[shipClass] < this.shipCost[shipClass]){
				return false;
			}
		}
		return true;
	}
	get consumptionAfforable(){
		for (const resource in this.consumption){
			if (Game.player.resources[resource] < this.consumption[resource]){
				return false;
			}
		}
		return true;
	}
	get id(){
		return Game.orders.indexOf(this);
	}
	static create(){
		const orderID = getOrderID();
		/** @type {Order} */
		const order = Game.orders[orderID];
		if (!order.affordable){
			return;
		}
		// else, pay cost
		for (const resource in order.cost){
			Game.player.resources[resource] -= order.cost[resource];
		}
		for (const shipClass in order.shipCost){
			Game.player.navy[shipClass] -= order.shipCost[shipClass];
		}
		Game.player.orders.push([Number(new Date()), orderID, getID(), 0]);
	}
	// CreatedOrder => Specific Order ID, Order Type ID, target, progress
	/** @param {number} specificId */
	static remove(specificId){
		Game.player.orders = Game.player.orders.filter(
			SpecificOrder => SpecificOrder[0] !== specificId);
	}
}

class Quest {
	/**
	 * @param {string} title
	 * @param {Array<() => boolean>} conditions required to display
	 * @param {Array<() => boolean>} requirements required to execute
	 * @param {Array<() => void>} results
	 */
	constructor(title, desc = '', conditions = [], requirements = [], results = []){
		this.title = title;
		this.desc = desc;
		this.conditions = conditions;
		this.requirements = requirements;
		this.results = results;
		this.complete = false;
	}
	draw(){
		const id = Game.quests.indexOf(this);
		if (document.getElementById('quest'+id)){
			// update
			if (this.complete && !this.elementUpdated){
				document.getElementById('quest'+id+'completion').classList = 'green';
				document.getElementById('quest'+id+'completion').innerHTML = 'complete';
				this.elementUpdated = true;
				this.results.map(x => x());
			}
		}
		else { // create
			const questElement = document.createElement('div');
			questElement.classList = 'quest';
			questElement.id = 'quest'+id;
			// title
			const questTitle = document.createElement('h2');
			questTitle.innerHTML = this.title;
			questElement.appendChild(questTitle);
			// desc
			const questDesc = document.createElement('div');
			questDesc.innerHTML = this.desc;
			questElement.appendChild(questDesc);
			// quest status
			const questStatus = document.createElement('span');
			questStatus.innerHTML = 'incomplete';
			questStatus.classList = 'red';
			questStatus.id = 'quest'+id+'completion';
			questElement.appendChild(questStatus);
			// append to main
			document.getElementById('quests').appendChild(questElement);
		}
	}
	updateCompletion(){
		if (this.complete){
			return;
		}
		if (this.conditions.every(x => x())){
			this.complete = true;
		}
	}
	// static methods
	static update(){
		const quests = Game.player.quests.map(x => Game.quests[x]);
		// display/update current quests
		quests.map(q => q.draw());
		// see if new quests apply
		for (let i=0; i<Game.quests.length; i+=1){
			const quest = Game.quests[i];
			if (Game.player.quests.indexOf(i) >= 0){
				continue;
			}
			let success = true;
			for (let j=0; j<quest.requirements.length; j++){
				if (!quest.requirements[j]()){
					success = false;
					break;
				}
			}
			if (success){
				Game.player.quests.push(i);
			}
		}
		quests.map(q => q.updateCompletion());
	}
}

/** @param {[number, number, number, number]} order */
function drawOrder(order){
	const orderElement = document.createElement('table');
	for (const property in order.concat(-1)){
		const name = 'id type target progress '.split(' ')[property];
		// create new row
		const row = document.createElement('tr');
		// create header col
		const col1 = document.createElement('th');
		col1.innerHTML = name;
		row.appendChild(col1);
		// create value col
		const col2 = document.createElement('td');
		if (name === 'progress'){
			// create progress element
			const progressBar = document.createElement('progress');
			progressBar.value = order[3] / Game.orders[order[1]].progressNeeded;
			col2.appendChild(progressBar);
			// annotation
			const progressSpan = document.createElement('span');
			progressSpan.innerHTML = order[3] + '/' + Game.orders[order[1]].progressNeeded;
			col2.appendChild(progressSpan);
		}
		else if (name === ''){
			col1.innerHTML = '';
			col2.innerHTML = '<input type="submit" value="Cancel" onclick="Order.remove('+order[0]+')">';
		}
		else {
			col2.innerHTML = order[property];
		}
		row.appendChild(col2);
		// append row
		orderElement.appendChild(row);
	}
	return orderElement;
}

// end gameplay block
// begin interface block
const asciiEmoji = {
	'star': ['*', '🔆'],
	'planet': ['&middot;', '🌑'],
	'water': ['water', '💧'],
	'fuel': ['fuel', '⛽'],
	'steel': ['steel', '🔩'],
};
const selectionStyle = ['selected', 'selectedOld'];

function createOrderTypeList(){
	const selector = document.getElementById('input_order_type');
	Game.orders.forEach((o, i) => {
		const option = document.createElement('option');
		option.value = i;
		option.innerHTML = o.type;
		selector.appendChild(option);
	});
}

function drawStar(){
	const star = Game.system.primary;
	let planetIcon = document.getElementById(star.id);
	if (planetIcon === null){
		planetIcon = createSvgElement('text');
		planetIcon.classList.add('star');
		planetIcon.id = star.id;
		planetIcon.innerHTML = asciiEmoji.star[Game.settings.asciiEmoji];
		Game.svg.bodies.appendChild(planetIcon);
	}
	planetIcon.style.fill = star.color;
	planetIcon.setAttribute('x', Game.center[0]-Game.debug.iconOffset);
	planetIcon.setAttribute('y', Game.center[1]+Game.debug.iconOffset);
	// svg component
	let element = document.getElementById(star.id+'svg');
	let corona = document.getElementById(star.id+'coronasvg');
	if (!element){
		// create star
		element = createSvgElement('circle');
		element.setAttribute('cx', Game.center[0]);
		element.setAttribute('cy', Game.center[1]);
		element.id = star.id+'svg';
		element.classList.add('star');
		Game.svg.bodies.appendChild(element);
		// create corona
		corona = createSvgElement('circle');
		corona.setAttribute('cx', Game.center[0]);
		corona.setAttribute('cy', Game.center[1]);
		corona.id = star.id+'coronasvg';
		corona.classList.add('corona');
		Game.svg.bodies.appendChild(corona);
	}
	// update color and radius
	const r = star.radius/Game.systemHeight * window.innerHeight/2;
	element.setAttribute('r', r);
	corona.setAttribute('r', 2*r);
	range(4).forEach(i => document.getElementById('starColor'+(i+1)).setAttribute('stop-color', star.color));
}

function getID(){
	return Number(document.getElementById('input_id').value);
}

/** general order type, not specific order */
function getOrderID(){
	return Number(document.getElementById('input_order_type').value);
}

/**
 * @param {string} shipClass
 * @param {number} count
*/
function modifyNavy(shipClass, count){
	if (!Game.player.navy.hasOwnProperty(shipClass)){
		Game.player.navy[shipClass] = count;
	}
	else {
		Game.player.navy[shipClass] += count;
	}
}

/** @param {string} id */
function selectTab(id){
	Array.from(document.getElementById('rightdocs').children).forEach(c => c.style.display = 'none');
	document.getElementById(id).style.display = '';
}

function wipeMap(){
	document.getElementById('map').innerHTML = '';
}

// end interface block
// begin main program
const Game = {
	/** @return {[number, number]} */
	get center(){
		return [window.innerWidth/2, window.innerHeight/2];
	},
	cookie: {
		/** @param {string} name */
		delete(name){
			document.cookie = [name, '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/; domain=.',
				window.location.host.toString()].join('');
		},
		/** https://stackoverflow.com/a/11344672/2579798
		 * @param {string} name
		*/
		read(name){
			let result = document.cookie.match(new RegExp(name + '=([^;]+)'));
			if (result){
				result = JSON.parse(result[1]);
			}
			return result;
		},
		/** https://stackoverflow.com/a/11344672/2579798
		 * @param {string} name
		*/
		write(name, value){
			const cookie = [name, '=', JSON.stringify(value), '; domain=.',
				window.location.host.toString(), '; path=/;'].join('');
			document.cookie = cookie;
		},
	},
	debug: {
		iconOffset: 7,
		infoboxUpdateTime: 1e14,
		lastInfoboxUpdate: -Infinity,
		loaded: false,
		killStar(){
			/** @type {Star} */
			const star = Game.system.primary;
			Game.time = star.lifespan;
			Game.systemHeight = 1.2*star.radius;
			Game.speed = 2*star.lifespan;
			setInterval(() => console.info(round(star.temperature)), 1000);
		},
	},
	events: [
		new GameEvent(
			'Comet Sighted',
			'A comet was sighted. Ouf. Prepare for revolts...?',
			year,
			undefined,
			[
				new GameEventOption('Neat.'),
				new GameEventOption('Meh.'),
			]
		),
	],
	get orbitbarWidth(){
		return this.center[0];
	},
	/** @return {HTMLDivElement} */
	get orbitBar(){
		return document.getElementById('orbitbar');
	},
	orbitBarScale(){
		// todo: every 1 2 3 ... 10 20 30 ... 100 etc.
		/** in au */
		const systemRadius = this.system.maxOrbitRadius/au;
		/** px / au */
		const aupx = this.orbitbarWidth / systemRadius;
		// find min and max power of 2 to display
		let minPow2 = Math.floor(Math.log2(this.system.minOrbitRadius/au));
		const maxPow2 = Math.floor(Math.log2(systemRadius));
		minPow2 = Math.max(minPow2, maxPow2-4);
		linspace(minPow2, maxPow2+1, maxPow2-minPow2+1).map(round).forEach(p => {
			// element
			const dist = Math.pow(2, p);
			const distString = 1 <= dist ? dist : '1/'+round(1/dist);
			const elem = document.createElement('span');
			elem.classList.add('orbitBarScale');
			elem.style.left = dist*aupx + 'px';
			elem.style.bottom = '16px';
			elem.innerHTML = distString;
			elem.title = distString + ' au';
			Game.orbitBar.appendChild(elem);
		});
	},
	orders: [
		new Order(
			'Assay',
			50,
			{'fuel': 10},
			{'surveyor': 1},
			{'water': 1},
			() => {
				Game.player.resources.steel += 100;
			}
		),
		new Order(
			'Convert Water to Fuel',
			50,
			{},
			{'constructor': 1},
			{'fuel': -1, 'water': 1}
		),
		new Order(
			'Mine Ice',
			50,
			{'fuel': 10},
			{'constructor': 1},
			{'water': -1}
		),
	],
	player: {
		colonyID: -1,
		/** @type {number[]} */
		quests: [],
		/** @type {number[]} */
		events: [],
		resources: {
			water: 1000,
			fuel: 1000,
			steel: 1000,
		},
		navy: {
			surveyor: 1,
		},
		orders: [],
	},
	quests: [
		new Quest(
			'Select World',
			`Select a world to colonize. An ideal world is one with (in order of importance):<ol>
			<li>temperature around -18&deg;C</li><li>mass within a factor of two of Earth's</li>
			<li>near bodies which could be exploited in the future</li></ol><center class='red'>
			(WARNING: cannot be undone!)<br><input id='world_selector' type='submit'
			value='Confirm Selection' onclick='Game.player.colonyID=getID();'>
			</center><br>Reward: 1 Constructor`,
			undefined, // Q0COND
			undefined,
			[
				() => {
					// remove button
					const node = document.getElementById('world_selector');
					node.parentNode.removeChild(node);
					// add constructor
					modifyNavy('constructor', 1);
				},
			]
		),
	],
	reset(){
		console.warn('Hard Reset!');
		this.cookie.delete('seed');
		this.cookie.delete('player');
		location.reload();
	},
	rng: {
		debug(){
			let x = Number(new Date());
			x ^= x << 13;
			x ^= x >> 17;
			x ^= x << 5;
			return x;
		},
		/** number of times random has been run */
		i: 0,
		init(){
			/** @type {number} */
			const loaded = Game.cookie.read('seed');
			if (loaded){
				this.seed = Game.cookie.read('seed');
			}
			else {
				this.seed = Math.floor(Math.random()*this.max32Bit);
				Game.cookie.write('seed', this.seed);
			}
			this.value = this.seed;
			return Boolean(loaded);
		},
		max31Bit: Math.pow(2, 31) - 1,
		max32Bit: Math.pow(2, 32) - 1,
		/**
		 * @param {number} min
		 * @param {number} max
		 */
		randint(min, max){ // random integer in range
			return Math.floor(this.uniform(min, max+1));
		},
		/** [0, 1) */
		random(){
			/* jshint bitwise: false */
			let x = this.value;
			x ^= x << 13;
			x ^= x >> 17;
			x ^= x << 5;
			this.value = x;
			this.i++;
			return (this.value+this.max31Bit)/this.max32Bit;
		},
		/** seed = R_0 */
		seed: Number(new Date()),
		/**
		 * @param {number} min
		 * @param {number} max
		 */
		uniform(min, max){ // random real in range
			return this.random() * (max-min) + min;
		},
		/** R_n = random(R_(n-1)) */
		value: 0,
	},
	save: {
		download(){
			download(this.export(), 'mochaSpaceGameSave.txt', 'text/plain');
		},
		export(){
			const data = btoa(document.cookie);
			document.getElementById('saveData').value = data;
			console.log('Exported Save.');
			return data;
		},
		import(){
			const saveData = document.getElementById('saveData').value;
			document.cookie = atob(saveData);
			location.reload();
		},
		save(isManual = false){
			// store cookie https://www.w3schools.com/js/js_cookies.asp
			Game.cookie.write('settings', Game.settings);
			Game.cookie.write('player', Game.player);
			Game.cookie.write('time', Game.time);
			Game.debug.lastSave = new Date();
			if (isManual){
				console.log('Successfully manually saved game!');
			}
		},
	},
	settings: {
		/** in seconds */
		autosaveInterval: 30,
		/** in hz */
		fps: 20,
		asciiEmoji: 0,
		selectionStyle: 0,
	},
	speed: 16*hour,
	speedSetup(){
		// nearest power of 2 au to...
		const tgt = 1/4 * this.system.secondaries[0].orbit.period; // in s
		this.speed = Math.pow(2, round(Math.log2(tgt)));
	},
	svg: {
		bodies: document.getElementById('bodies'),
		orbits: document.getElementById('orbits'),
	},
	/** @type {System} */
	system: undefined,
	systemHeight: 3*au,
	systemHeightSetup(){
		// nearest power of 2 au to...
		const tgt = 10*this.system.secondaries[0].orbit.sma/au; // in au
		this.systemHeight = au*Math.pow(2, round(Math.log2(tgt)));
	},
	get systemWidth(){
		return window.innerWidth/window.innerHeight * this.systemHeight;
	},
	/** in seconds from epoch t=0 */
	time: 0,
	/** @param {number} s seconds */
	timeFormat(s){
		// yr mo d h min s
		/** @param {number} x */
		const pad = x => x < 10 ? '0'+x : x;
		const yr = Math.floor(s/year).toLocaleString();
		s %= year;
		const mo = pad(Math.floor(s/(30*day)));
		s %= 30*day;
		const d = pad(Math.floor(s/day));
		s %= day;
		const h = pad(Math.floor(s/hour));
		s %= hour;
		const min = pad(Math.floor(s/minute));
		s %= minute;
		s = pad(round(s));
		return `${yr} yr ${mo} mo ${d} d<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${h}:${min}:${s}`;
	},
	// methods
	get playerHasColony(){
		return 0 <= this.player.colonyID;
	},
};
// Q0COND
Game.quests[0].conditions = [() => Game.playerHasColony];

function main(){
	console.info('Mocha\'s Space Game Alpha loading...');
	if (Game.cookie.read('settings')){
		Game.settings = Game.cookie.read('settings');
		document.getElementById('input_fps').value = Game.settings.fps;
	}
	// set up RNG
	Game.debug.loaded = Game.rng.init();
	document.getElementById('seed').innerHTML = Game.rng.seed;
	// set up system
	Game.system = new System();
	// set up systemHeight and speed
	Game.speedSetup();
	Game.systemHeightSetup();
	// set up orbitbar scale
	Game.orbitBarScale();
	// set up ticks
	updateFPS();
	setInterval(redrawInterface, 1000);
	setInterval(gameTick, 1000/Game.settings.fps);
	setInterval(redrawMap, 1000/Game.settings.fps);
	setInterval(Game.save.save, 1000*Game.settings.autosaveInterval);
	// select welcome tab
	selectTab('welcome');
	// load?
	if (Game.cookie.read('player')){
		Game.player = Game.cookie.read('player');
	}
	if (Game.cookie.read('time')){
		Game.time = Game.cookie.read('time');
	}
	// save
	Game.save.save();
	// set up order type list
	createOrderTypeList();
	// successful loading
	document.getElementById('nojs').style.visibility = 'hidden';
	console.info('Mocha\'s Space Game Alpha loaded.');
}

function gameTick(){
	Game.time += Game.paused ? 0 : Game.speed/Game.settings.fps;
}

function redrawInterface(){
	// update quests
	Quest.update();
	// update navy
	updateNavy();
	// update orders
	updateOrders();
	// update events
	updateEvents();
}

function redrawMap(){
	// update infobox
	const selectionId = getID();
	const infoboxElement = document.getElementById('leftinfo');
	if (infoboxElement.benisData !== selectionId ||
			Game.debug.lastInfoboxUpdate + Game.debug.infoboxUpdateTime < Game.time){
		infoboxElement.innerHTML = '';
		infoboxElement.appendChild(Game.system.secondaries[selectionId].info);
		infoboxElement.benisData = selectionId;
	}
	// update time
	document.getElementById('time').innerHTML = '&nbsp;t = ' + Game.timeFormat(Game.time);
	document.getElementById('timerate').innerHTML = '&Delta;t = ' + Game.timeFormat(Game.speed);
	// update zoom
	document.getElementById('zoom').innerHTML = Game.systemHeight/au;
	// update resource count
	updateResources();
	// update map
	Game.system.secondaries.map(p => p.draw());
	drawStar();
	// redraw orbits
	Game.system.secondaries.map(p => p.orbit.draw());
	// update star info
	Game.orbitBar.title = Game.system.primary.info;
	// check if red giant star engulfs inner planets
	Game.system.secondaries.forEach(p => {
		if (!p.destroyed && p.orbit.periapsis < Game.system.primary.radius){
			p.destroyed = true;
		}
	});
}

/** @param {number} id */
function setBody(id){
	document.getElementById('input_id').value = id;
}

function updateFPS(){
	Game.settings.fps = Number(document.getElementById('input_fps').value);
	Game.save.save();
}

function updateNavy(){
	// display/update current quests
	const navyTable = document.getElementById('navy');
	for (const shipClass in Game.player.navy){
		if (document.getElementById('col2_'+shipClass)){
			// just update count
			document.getElementById('col2_'+shipClass).innerHTML = Game.player.navy[shipClass];
		}
		else {
			// row
			const row = document.createElement('tr');
			row.id = 'row_'+shipClass;
			// col 1
			const nameCell = document.createElement('th');
			nameCell.innerHTML = shipClass;
			nameCell.id = 'col1_'+shipClass;
			row.appendChild(nameCell);
			// col 2
			const countCell = document.createElement('td');
			countCell.innerHTML = Game.player.navy[shipClass];
			countCell.id = 'col2_'+shipClass;
			row.appendChild(countCell);
			// finish
			navyTable.appendChild(row);
		}
	}
}

function updateEvents(){
	// relist events
	const eventListElement = document.getElementById('eventlist');
	Game.player.events.forEach(e => {
		const id = 'event'+e;
		if (!document.getElementById(id)){
			const itemElement = document.createElement('li');
			itemElement.appendChild(Game.events[e].draw());
			itemElement.id = id;
			eventListElement.appendChild(itemElement);
		}
	});
	// check if new events apply
	if (Game.paused){
		return;
	}
	Game.events.forEach((e, j) => {
		if (0 <= Game.player.events.indexOf(j) || !e.condition()){
			return;
		}
		if (Game.rng.random() < Game.speed/e.mtth){
			Game.player.events.push(j);
		}
	});
}

function updateOrders(){
	// if changed, update
	const orderListElement = document.getElementById('orderlist');
	orderListElement.innerHTML = '';
	for (let i=0; i<Game.player.orders.length; i+=1){
		const itemElement = document.createElement('li');
		itemElement.appendChild(drawOrder(Game.player.orders[i]));
		orderListElement.appendChild(itemElement);
		// check if conditions are fulfilled
		// if done, finish order and delete it
		const thisOrder = Game.player.orders[i];
		const orderType = Game.orders[thisOrder[1]];
		if (thisOrder[3] >= orderType.progressNeeded){
			// give bonus
			orderType.onComplete();
			// return ships
			// delete it
			Order.remove(thisOrder[0]);
		}
		// if enough resources to continue, continue
		else if (orderType.consumptionAfforable){
			for (const resource in orderType.consumption){
				Game.player.resources[resource] -= orderType.consumption[resource];
			}
			thisOrder[3] += 1;
		}
	}
	// update selection
	document.getElementById('orderSelectionID').innerHTML = getID();
	const order = Game.orders[getOrderID()];
	const shipTable = document.getElementById('shipTable');
	shipTable.innerHTML = '';
	for (const shipClass in order.shipCost){
		const row = document.createElement('tr');
		const col1 = document.createElement('th');
		col1.innerHTML = shipClass;
		row.appendChild(col1);
		const col2 = document.createElement('td');
		col2.innerHTML = order.shipCost[shipClass];
		row.appendChild(col2);
		shipTable.appendChild(row);
	}
	// update "can afford?"
	document.getElementById('orderAffordable').innerHTML = 'Can' +
		(order.affordable ? '': '&rsquo;t') + ' afford';
	document.getElementById('orderAffordable').classList = order.affordable ? 'green' : 'red';
}

function updateResources(){
	'water fuel steel'.split(' ').forEach(s => {
		document.getElementById(s).innerHTML = Game.player.resources[s];
		document.getElementById(s+'label').innerHTML = asciiEmoji[s][Game.settings.asciiEmoji];
	});
}

main();