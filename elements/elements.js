/* jshint esversion: 6, strict: true, strict: global, laxbreak: true, nonew: false */
/* globals createSvgElement, day, deg, elementData, hour, isotopeData, logLogInterpolate,
	mean, minute, nobleMetalColors, nucleosynthesisColors, nucleus, nutritionColors,
	range, remap, round, sum, trace, unitString, year */
/* exported highlightCategory, highlightFunction, hlCull, setDecayChainLength, tableColor */
'use strict';

const electron_mass = 9.1093837015e-31; // kg; appx; electron mass
const eV = 1.602176634e-19; // J; exact; electronvolt
const k_e = 8.9875517923e9; // N m^2 / C^2; appx; Coulomb constant
const lightSpeed = 299792458; // m/s; exact; speed of light in a vacuum
const standardTemperature = 273.15; // K; exact; melting point of water
const stp = [273.15, 1e5]; // [K, Pa]

const minX = 1; // constant used to determine origin of x-values
const maxZ = 100; // Z of top of charts
const r = 30; // px
const corner = r/Math.sqrt(2);
const decayArrows = {
	'a': [0, r, 0, 3*r],
	'b+': [-corner, corner, corner-2*r, 2*r-corner],
	'b+b+': [-corner, corner, corner-4*r, 4*r-corner],
	'b-': [corner, -corner, 2*r-corner, corner-2*r],
	'b-b-': [corner, -corner, 4*r-corner, corner-4*r],
	'sf': [r, 0, r+8, 0],
	'cd': [corner, corner, corner+6, corner+6],
};
decayArrows.ec = decayArrows['b+'];
decayArrows.ecec = decayArrows['b+b+'];
const hingedArrowTypes = ['b+b+', 'b-b-', 'ecec'];

const elemCatColors = {
	'Alkali metal': '#f66',
	'Alkaline earth metal': '#fda',
	'Lanthanide': '#fbf',
	'Actinide': '#f9c',
	'Transition metal': '#fcc',
	'Post-transition metal': '#ccc',
	'Metalloid': '#cc9',
	'Reactive nonmetal': '#ff8',
	'Noble gas': '#cff',
	'Superactinide': '#f7a',
};

const elemGoldschmidtColors = [
	'#bff', // atmophile
	'#ff8', // chalcophile
	'#fb7', // lithophile
	'#fde', // siderophile
];
elemGoldschmidtColors[undefined] = 'white';

const elemGoldschmidt = [
	// p1
	0, 0,
	// p2
	2, 2,
	2, 0, 0, 2, 2, 0,
	// p3
	2, 2,
	2, 2, 2, 1, 2, 0,
	// p4
	2, 2,
	2, 2, 2, 2, 3, 3, 3, 3, 1, 1,
	1, 1, 1, 1, 2, 0,
	// p5
	2, 2,
	2, 2, 2, 3, undefined, 3, 3, 3, 1, 1,
	1, 1, 1, 1, 2, 0,
	// p6
	2, 2,
	2, 2, 2, 2, undefined, 2, 2, 2, 2, 2, 2, 2, 2, 2,
	2, 2, 2, 3, 3, 3, 3, 3, 3, 1,
	1, 1, 1,
];

const elemNaming = [
	// 0 = Individual, 1 = Place/Celestial Body,
	// 2 = Mineral/Stone, 3 = Color/Sheen
	// p1
	undefined, 1,
	// p2
	2, 2,
	2, 2, 2, undefined, 2, undefined,
	// p3
	2, 1,
	2, 2, 3, undefined, 3, undefined,
	// p4
	2, 2,
	1, 0, 0, 3, 1, 3, undefined, 2, 1, undefined,
	1, 1, 2, 1, undefined, undefined,
	// p5
	3, 2,
	2, 2, 0, 2, undefined, 1, 3, 0, undefined, 2,
	3, 3, undefined, 1, 3, undefined,
	// p6
	3, undefined,
	undefined, 1, 3, undefined, 0, 2, 1, 0, 1, undefined, 1, 1, 1, 2,
	1, 1, 0, undefined, 1, undefined, 3, 3, 3, 0,
	3, undefined, 3, 1, undefined, undefined,
	// p7
	1, undefined,
	undefined, 0, undefined, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0,
	0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0,
];
// p7
elemGoldschmidt[90] = elemGoldschmidt[92] = 2;

let hlCull = 0; // s, when to stop drawing isotopes

// classes
/** @type {ChemElement[]} */
const elements = [];
class ChemElement {
	/**
	 * @param {number} z - atomic number
	 * @param {string} name
	 * @param {string} symbol
	 * @param {number} mass
	 * @param {number} group - used in determining coord x
	 * @param {number} period - used in determining coord y
	 * @param {*} properties
	*/
	constructor(z, name, symbol, mass, group, period, properties){
		this.z = z;
		this.name = name;
		this.symbol = symbol;
		this.mass = mass;
		/** column */
		this.group = group;
		/** row */
		this.period = period;
		if (properties){
			/** @type {number} */
			this.abundance = properties.abundance;
			/** @type {string} */
			this.appearance = properties.appearance;
			/** @type {number} - in seconds */
			this.biologicalHalfLife = properties.biologicalHalfLife;
			/** @type {number} */
			this.speedOfSound = properties.speedOfSound;
			/** @type {number} - in Pa */
			this.bulkModulus = properties.bulkModulus;
			if (!properties.bulkModulus && properties.density && this.speedOfSound){
				this.bulkModulus = properties.density
					* this.speedOfSound * this.speedOfSound; // https://www.engineeringtoolbox.com/speed-sound-d_82.html
				// eslint-disable-next-line max-len
				console.warn(`Had to compute ${this.name}'s bulk modulus from its density and speed of sound`);
			}
			if (!properties.speedOfSound && properties.density && this.bulkModulus){
				this.speedOfSound = Math.sqrt(this.bulkModulus / properties.density); // https://www.engineeringtoolbox.com/speed-sound-d_82.html
				// eslint-disable-next-line max-len
				console.warn(`Had to compute ${this.name}'s speed of sound from its density and bulk modulus`);
			}
			/** string => true|false|0.5 */
			this.categories = properties.categories;
			/** @type {number} DO NOT USE THIS EXCEPT IN ESTIMATES. Use radius.covalent for "real" radius!!! */
			this.covalentRadius = properties.covalentRadius;
			/** @type {string} */
			this.crystal = properties.crystal;
			/** @type {number} - kg/m^3; divide by 1000 to get g/cm^3 */
			this.density = properties.density;
			/** @type {number} - year CE/BCE */
			this.discovery = properties.discovery;
			/** @type {number} - J/mol */
			this.electronAffinity = properties.electronAffinity;
			/** @type {string} */
			this._electronConfiguration = properties.electronConfiguration;
			/** @type {number} - Pauling */
			this.electronegativity = properties.electronegativity;
			/** @type {number[]} - J/mol */
			this.ionization = properties.ionization;
			/** @type {string} - color used in models */
			this.modelColor = properties.modelColor;
			/** @type {boolean} - used to override elements with stable nuclear isomers (currently only tantalum) */
			this.monoisotopic = properties.monoisotopic;
			/** @type {number} */
			this.nobleMetal = properties.nobleMetal;
			/** string => [0, 1] */
			this.nucleosynthesis = properties.nucleosynthesis;
			/** @type {number} */
			this.nutrition = properties.nutrition;
			/** @type {number[]} */
			this.oxidation = properties.oxidation;
			/** year => $/kg inflation-adjusted */
			this.prices = properties.prices;
			/** @type {number} t/yr */
			this.production = properties.production;
			/** @type {*} atomic/empirical, covalent, vanDerWaals - all are in pm */
			this.radius = properties.radius;
			/** @type {number} Ωm @ STP */
			this.resistivity = properties.resistivity;
			/** @type {string}
			 * Normalized Color:
			 * - A photograph of the element is taken.
			 * - White and Black are removed.
			 * - The rest is averaged and white-balanced.
			 */
			this.rgb = properties.rgb;
			/** string => number */
			this.temperatures = properties.temperatures;
			/** @type {number} LD50, as close to humans as possible, (0, 1) */
			this.toxicity = properties.toxicity;
			/** @type {number} - in Pa */
			this.youngsModulus = properties.youngsModulus;
		}
		// push to element list and create cell
		elements.push(this);
		this.createElement();
	}
	get aufbau(){
		if (this.period === 1)
			return '1s' + this.z;
		let valence = this.z; // - lng.z
		let s = '';
		for (let diag = 0; diag < 8 && 0 < valence; diag++){
			// eslint-disable-next-line no-loop-func
			Array.from('gfdps'.slice(4-Math.floor(diag/2))).forEach((char, i, a) => {
				if (!valence)
					return;
				const l = a.length-i-1;
				const e = Math.min(valence, 4*l+2);
				valence -= e;
				s += ` ${diag-l+1}${char}${e}`;
			});
		}
		return s.slice(1);
	}
	get aufbauConcise(){
		// use last noble gas as a shorthand
		const lng = elements.find(e => e.group === 18 && e.period === this.period-1);
		return this.aufbau.replace(lng.aufbau, `[${lng.symbol}]`);
	}
	/** @returns {number|undefined} - avg. ratio to Iron (thus dimensionless) */
	get avgRadius(){
		if (!this.radius)
			return undefined;
		const ratios = [];
		// iron has all the values we test - the specific element doesn't matter for our purposes as long as it does have all
		if (this.radius.atomic)
			ratios.push(this.radius.atomic / ChemElement.fromZ(26).radius.atomic);
		if (this.radius.covalent)
			ratios.push(this.radius.covalent / ChemElement.fromZ(26).radius.covalent);
		if (this.radius.vanDerWaals)
			ratios.push(this.radius.vanDerWaals / ChemElement.fromZ(26).radius.vanDerWaals);
		return mean(ratios);
	}
	get category(){
		if ([1, 6, 7, 8, 9, 15, 16, 17, 34, 35, 53].includes(this.z))
			return 'Reactive nonmetal';
		if ([5, 14, 32, 33, 51, 52, 85].includes(this.z))
			return 'Metalloid';
		if (this.group === 1)
			return 'Alkali metal';
		if (this.group === 2)
			return 'Alkaline earth metal';
		if (this.group === 18)
			return 'Noble gas';
		if (11 < this.group) // disputed
			return 'Post-transition metal';
		if (this.period === 6 && this.z < 71)
			return 'Lanthanide';
		if (this.period === 7 && this.z < 103)
			return 'Actinide';
		if (this.period === 8 && this.z < 158)
			return 'Superactinide';
		return 'Transition metal';
	}
	get color(){
		return elemCatColors[this.category];
	}
	/** @return {[number, number]} zero-indexed coord of the square */
	get coords(){
		switch (this.electronShell){
			// lanthanides and actinides
			case 'f':{
				const x = this.z - (this.z < 72 ? 55 : this.z < 104 ? 87 : 137);
				const y = this.period + 2;
				return [x, y];
			}
			// superactinides
			case 'g':
				return [this.z - 121, this.period + 3];
		}
		// most elements
		return [this.group - 1, this.period - 1];
	}
	get electronConfiguration(){
		return this._electronConfiguration || this.aufbauConcise;
	}
	get electronShell(){
		if (this.group < 3 || this.z === 2)
			return 's';
		if (12 < this.group)
			return 'p';
		// this is correct up to z = 170, highly unlikely I'll be around to ever see this table broken
		return this.group ? 'd' : 120 < this.z && this.z < 139 ? 'g' : 'f';
	}
	get electronSpeed(){
		if (!this.radius)
			return undefined;
		// https://en.wikipedia.org/wiki/Bohr_model#Electron_energy_levels
		const re = this.radius.atomic || this.radius.covalent || this.radius.vanDerWaals; // atomic should be most accurate
		return Math.sqrt(this.z * k_e * eV * eV / (electron_mass * re));
		// see also the answers on https://physics.stackexchange.com/questions/20187/how-fast-do-electrons-travel-in-an-atomic-orbital
	}
	/** @return {HTMLDivElement} DOM element */
	get element(){
		return document.getElementById(this.name);
	}
	/** rough estimate; J/(K*mol)
	 * https://en.wikipedia.org/wiki/Trouton%27s_rule
	*/
	get heatOfFusion(){
		// used Tungsten to guess constant
		return 14.16 * this.temperatures.melt;
	}
	/** rough estimate; J/(K*mol)
	 * https://en.wikipedia.org/wiki/Trouton%27s_rule
	*/
	get heatOfVaporization(){
		return 86.5 * this.temperatures.boil;
	}
	/** @return {Isotope[]} this element's isotopes */
	get isotopes(){
		return isotopes.filter(i => i.element === this);
	}
	get latestPrice(){
		// list of years
		const years = Object.keys(this.prices).map(x => parseInt(x)); // for some retarded reason, using just parseInt doesn't work
		// sort descending
		years.sort((a, b) => b-a);
		// return most recent year's price
		return this.prices[years[0]];
	}
	/** rough estimate; J/(K*mol)
	 * https://en.wikipedia.org/wiki/Molar_heat_capacity#Dulong%E2%80%93Petit_law
	*/
	get molarHeatCapacity(){
		// used Tungsten to guess constant
		return 467198 / this.density;
	}
	get mullikenElectronegativity(){
		return 1.97e-6*(this.ionization[0] + this.electronAffinity) + 0.19;
	}
	/** most common stellar nucleosynthesis process */
	get nucleoMax(){
		if (!this.nucleosynthesis)
			return 'artificial';
		return Object.keys(this.nucleosynthesis)
			.sort((a, b) => this.nucleosynthesis[b] - this.nucleosynthesis[a])[0];
	}
	get poissonRatio(){
		// https://en.wikipedia.org/wiki/Shear_modulus#Explanation
		return this.youngsModulus / (-6*this.bulkModulus) + 0.5;
	}
	/** based on regressions I did; R^2 = 0.7302 */
	get predictedBulkModulus(){
		return 3.2288e-31
			* Math.pow(this.density, 1.39202)
			* Math.pow(this.ionization[0], -2.39998)
			* Math.pow(this.covalentRadius, -5.08269);
	}
	get predictedElectronegativity(){
		return 2.41602e-6 * this.ionization[0] - 6.12342e-2;
	}
	/** based on regressions I did; R^2 = 0.6188 */
	get predictedMelt(){
		return 6.3232e-9
			* Math.pow(this.z, -0.518875)
			* Math.pow(this.density, 0.914663)
			* Math.pow(this.ionization[0], -1.28273)
			* Math.pow(this.covalentRadius, -1.64164);
	}
	get shearModulus(){
		// https://en.wikipedia.org/wiki/Shear_modulus#Explanation
		return 0.5 * this.youngsModulus / (1 + this.poissonRatio);
	}
	get stable(){
		return this.isotopes.some(i => i.stable);
	}
	get valence(){
		if (this.z <= 2)
			return this.z;
		return this.z - elements.find(e => e.group === 18 && e.period === this.period-1).z;
	}
	createElement(){
		const div = document.createElement('div');
		div.id = this.name;
		// name
		const name = document.createElement('a');
		name.innerHTML = this.name;
		name.href = `https://en.wikipedia.org/wiki/${this.name}`;
		div.appendChild(name);
		// Z and symbol
		div.innerHTML += `<br>${this.z}<br>${this.symbol}<br>`;
		// mass
		const mass = document.createElement('span');
		mass.innerHTML = this.mass % 1 ? round(this.mass, 3) : `[${this.mass}]`;
		div.appendChild(mass);
		// styling
		div.style.backgroundColor = this.color;
		// place element
		const [x, y] = this.coords;
		/** @type {HTMLTableCellElement} */
		const cell = document.getElementById(`cell${x}-${y}`);
		cell.appendChild(div);
	}
	createSVGLabel(){
		range(4).forEach(i => {
			const svg = document.getElementById('decay'+i);
			const y = 2*r*(maxZ - this.z);
			// rect
			if (this.z % 2){
				const rect = createSvgElement('rect');
				rect.classList.add('darkRect');
				rect.setAttribute('y', y);
				svg.appendChild(rect);
			}
			// text label
			const text = createSvgElement('text');
			text.setAttribute('y', y + 35);
			text.innerHTML = this.name;
			text.classList.add('svgLabel');
			svg.appendChild(text);
		});
	}
	/**
	 * using the previous three periods, extrapolate this period's data
	 * @param {string} propertyName property to extrapolate
	 */
	extrapolate(propertyName){
		const p = this.period;
		const y0 = elements.find(e => e.group === this.group
			&& e.period === this.period-1)[propertyName];
		const y1 = elements.find(e => e.group === this.group
			&& e.period === this.period-2)[propertyName];
		const y2 = elements.find(e => e.group === this.group
			&& e.period === this.period-3)[propertyName];
		const a = (y2-y1)/(5-6*p);
		const b = -2*a*p + 3*a + y0 - y1;
		const c = -a*(p-1)*(p-1) - b*(p-2) + y0;
		return a*p*p + b*p + c;
	}
	/** @param {string} category */
	highlightCategory(category){
		this.highlightFunction(e => e.inCategory(category));
	}
	highlightFunction(f){
		const c = this.element.parentElement.classList;
		switch (f(this)){
			case undefined:
				c.value = '';
				break;
			case true:
				c.value = 'categoryHighlight';
				break;
			case 0.5:
				c.value = 'categoryHalfHighlight';
				break;
			default:
				c.value = 'categoryUnhighlight';
		}
	}
	/** @param {string} category
	 * @returns {boolean|0.5} */
	inCategory(category){
		return this.categories && this.categories.hasOwnProperty(category)
			? this.categories[category]
			: false;
	}
	/**
	 * Like stateAt but tries to extrapolate a 2D phase diagram from four data
	 * @param {number} t - temperature (K)
	 * @param {number} p - pressure (Pa)
	 */
	phaseAt(t, p){
		const meltTripLine = logLogInterpolate(
			this.temperatures.melt, stp[1], ...this.temperatures.trip);
		// p > melt-trip line anywhere? if so, then solid
		if (meltTripLine(t) < p)
			return 'Solid';
		// above critical temp?
		if (this.temperatures.crit[0] < t){
			if (this.temperatures.crit[1] < p)
				return 'Supercritical Fluid';
			return 'Gas';
		}
		const boilCritLine = logLogInterpolate(
			this.temperatures.boil, stp[1], ...this.temperatures.crit);
		const boilTripLine = logLogInterpolate(
			this.temperatures.boil, stp[1], ...this.temperatures.trip);
		// above SP?
		if (stp[1] < p){
			if (p < boilCritLine(t))
				return 'Gas';
			return 'Liquid';
		}
		// below boil-trip line?
		if (p < boilTripLine(t))
			return 'Gas';
		// below melt-trip line?
		if (p < meltTripLine(t))
			return 'Liquid';
		return 'Solid';
	}
	/** @param {number} t */
	stateAt(t){
		/* eslint-disable */
		return this.temperatures
				? this.temperatures.boil < t
					? 'gas'
					: this.temperatures.melt < t
						? 'liquid'
						: 'solid'
				: 'unknown';
		/* eslint-enable */
	}
	/** @param {string} type */
	updateColor(type){
		/** @type {HTMLDivElement} */
		const div = document.getElementById(this.name);
		const c4 = ['red', 'yellow', '#4c4', 'skyBlue'];
		let c, x;
		switch (type){
			case 'abundanceEarth':
				if (!this.abundance || !this.abundance.earth)
					c = '#ccc';
				else if (this.abundance.earth < 1e-9) // trace
					c = '#fc8';
				else {
					const abundances = elements
						.filter(e => e.abundance && 1e-9 < e.abundance.earth)
						.map(e => Math.log(e.abundance.earth));
					c = gradient1(remap(
						Math.log(this.abundance.earth),
						[Math.min(...abundances), Math.max(...abundances)], [0, 1]));
				}
				break;
			case 'abundanceHuman':
				if (!this.abundance || !this.abundance.human)
					c = '#ccc';
				else if (this.abundance.human < 1e-9) // trace
					c = '#fc8';
				else {
					const abundances = elements
						.filter(e => e.abundance && 1e-9 < e.abundance.human)
						.map(e => Math.log(e.abundance.human));
					c = gradient1(remap(
						Math.log(this.abundance.human),
						[Math.min(...abundances), Math.max(...abundances)], [0, 1]));
				}
				break;
			case 'abundanceUniverse':
				if (!this.abundance || !this.abundance.universe)
					c = '#ccc';
				else if (this.abundance.universe < 1e-9) // trace
					c = '#fc8';
				else {
					const abundances = elements
						.filter(e => e.abundance && 1e-9 < e.abundance.universe)
						.map(e => Math.log(e.abundance.universe));
					c = gradient1(remap(
						Math.log(this.abundance.universe),
						[Math.min(...abundances), Math.max(...abundances)], [0, 1]));
				}
				break;
			case 'appearance':
				c = {
					// colors
					'black brown': '#840',
					'bluish metallic': '#88c',
					'gold': '#fc0',
					'pale gold': '#fec',
					'pale yellow': '#ff8',
					'pale yellow green': '#cf8',
					'red orange metallic': '#ca6',
					'reddish brown': '#c40',
					'yellow': '#ff0',
					// off-greys
					'blue grey': '#88a',
					'blue grey metallic': '#88a',
					'brownish silver': '#ba9',
					'silvery blue': '#99b',
					'blue silvery grey metallic': '#aac',
					'gold silvery grey metallic': '#cca',
					// greys
					'black': '#444',
					'dull grey': '#777',
					'grey': '#888',
					'shiny grey': '#999',
					'semimetallic': '#999',
					'metallic': '#999',
					'grey metallic': '#999',
					'silvery': '#999',
					'silvery grey': '#999',
					'silvery grey metallic': '#aaa',
					'silvery grey white metallic': '#ccc',
					'grey white': '#ddd',
					'greyish white': '#ddd',
					'silvery white': '#ddd',
					'silvery metallic': '#eee',
					'silvery white metallic': '#eee',
					'white grey metallic': '#eee',
					'white': '#ffd',
					'colorless': '#fff',
				}[this.appearance] || '#f0f';
				break;
			case 'block':
				c = '#'+{s: 'f99', p: 'ff8', d: '9cf', f: '9f9', g: 'f9f'}[this.electronShell];
				break;
			case 'boil':
				if (!this.temperatures)
					c = '#ccc';
				else {
					const boils = elements.filter(e => e.temperatures && e.temperatures.boil)
						.map(e => Math.log(e.temperatures.boil));
					c = gradient1(remap(
						Math.log(this.temperatures.boil),
						[Math.min(...boils), Math.max(...boils)], [0, 1]));
				}
				break;
			case 'bulkModulus':{
				const bm = Math.max(...elements
					.filter(e => e.bulkModulus)
					.map(e => e.bulkModulus));
				c = gradient1(this.bulkModulus/bm);
				break;
			}
			case 'category':
				c = this.color;
				break;
			case 'covalent':{
				if (!this.covalentRadius)
					c = 'grey';
				else {
					const cr = elements.filter(e => e.covalentRadius).map(e => e.covalentRadius);
					c = gradient1(remap(this.covalentRadius,
						[Math.min(...cr), Math.max(...cr)], [0, 1]));
				}
				break;
			}
			case 'crystal':{
				if (this.crystal)
					c = {
						//	color		*white		*black		*grey
						aP: '#f00',
						mP: '#f80', mS: '#fc8',
						oP: '#ff0', oS: '#ffc', oI: '#880', oF: '#cc4',
						tP: '#0f0',				tI: '#080',
						hR: '#0ff',
						hP: '#00f',
						cP: '#f0f',				cI: '#808', cF: '#c4c',
					}[this.crystal];
				else
					c = 'grey';
				break;
			}
			case 'density':{
				const densest = Math.sqrt(
					Math.max(...elements.filter(e => e.density).map(e => e.density)));
				c = gradient1(Math.sqrt(this.density)/densest);
				break;
			}
			case 'density2':{
				const rr = elements.filter(e => e.avgRadius)
					.map(e => e.mass/Math.pow(e.avgRadius, 3));
				c = gradient1(remap(this.mass/Math.pow(this.avgRadius, 3),
					[Math.min(...rr), Math.max(...rr)], [0, 1]));
				break;
			}
			case 'discovery':{
				const ages = elements.filter(e => isFinite(e.discovery))
					.map(e => Math.log(new Date().getFullYear() - Math.max(-4000, e.discovery)));
				c = gradient1(remap(
					Math.log(new Date().getFullYear() - Math.max(-4000, this.discovery)),
					[Math.min(...ages), Math.max(...ages)], [0, 1]));
				break;
			}
			case 'electronAffinity':
				if (!this.electronAffinity)
					c = 'grey';
				else {
					const ee = elements
						.filter(e => e.electronAffinity)
						.map(e => e.electronAffinity);
					c = gradient1(remap(
						this.electronAffinity,
						[Math.min(...ee), Math.max(...ee)], [0, 1]));
				}
				break;
			case 'electronegativity':
				if (!this.electronegativity)
					c = 'grey';
				else {
					const ee = elements
						.filter(e => e.electronegativity)
						.map(e => e.electronegativity);
					c = gradient1(remap(
						this.electronegativity,
						[Math.min(...ee), Math.max(...ee)], [0, 1]));
				}
				break;
			case 'electronegativity2':
				if (!this.mullikenElectronegativity)
					c = 'grey';
				else {
					const ee = elements
						.filter(e => e.mullikenElectronegativity)
						.map(e => e.mullikenElectronegativity);
					c = gradient1(remap(
						this.mullikenElectronegativity,
						[Math.min(...ee), Math.max(...ee)], [0, 1]));
				}
				break;
			case 'electronegativityMelt':{
				const set = elements.filter(e => e.mullikenElectronegativity);
				const ee = set.map(e => e.electronegativity || e.predictedElectronegativity);
				const bb = set.map(e => e.bulkModulus || e.predictedBulkModulus);
				const mm = set.map(e => e.temperatures && e.temperatures.melt
					|| e.predictedMelt);
				const eee = remap(this.electronegativity || this.predictedElectronegativity,
					[Math.min(...ee), Math.max(...ee)], [0, 1]);
				const bbb = remap(this.bulkModulus || this.predictedBulkModulus,
					[Math.min(...bb), Math.max(...bb)], [0, 1]);
				const mmm = remap(this.temperatures && this.temperatures.melt
					|| this.predictedMelt,
				[Math.min(...mm), Math.max(...mm)], [0, 1]);
				c = `rgb(${127*mmm+128}, ${127*bbb+128}, ${127*eee+128})`;
				break;
			}
			case 'goldschmidt':
				c = elemGoldschmidtColors[elemGoldschmidt[this.z-1]];
				break;
			case 'ionization1':
				if (!this.ionization)
					c = '#ccc';
				else {
					const elems = elements.filter(e => e.ionization)
						.map(e => e.ionization[0]);
					c = gradient1(remap(
						this.ionization[0],
						[Math.min(...elems), Math.max(...elems)], [0, 1]));
				}
				break;
			case 'halflife':
				if (this.stable)
					c = '#f0f';
				else {
					x = Math.log(Math.max(...this.isotopes.map(i => i.halfLife)))
						/ Math.log(Isotope.maxHalfLife); // [0, 1]
					console.log(this, x);
					c = gradient1(x);
				}
				break;
			case 'halflifeb':
				if (!this.biologicalHalfLife)
					c = '#ccc';
				else {
					x = Math.cbrt(this.biologicalHalfLife)
						/ Math.cbrt(Math.max(...elements.filter(e => e.biologicalHalfLife)
							.map(e => e.biologicalHalfLife)));
					c = gradient1(x);
				}
				break;
			case 'melt':
				if (!this.temperatures)
					c = '#ccc';
				else {
					const melts = elements.filter(e => e.temperatures && e.temperatures.melt)
						.map(e => Math.log(e.temperatures.melt));
					c = gradient1(remap(
						Math.log(this.temperatures.melt),
						[Math.min(...melts), Math.max(...melts)], [0, 1]));
				}
				break;
			case 'meltBoil':
				if (!this.temperatures)
					c = '#ccc';
				else {
					const mbs = elements.filter(e => e.temperatures
							&& e.temperatures.melt && e.temperatures.boil)
						.map(e => e.temperatures.melt/e.temperatures.boil);
					c = gradient1(remap(
						this.temperatures.melt/this.temperatures.boil,
						[Math.min(...mbs), Math.max(...mbs)], [0, 1]));
				}
				break;
			case 'msi%4':
				if (this.stable){
					const stable = this.isotopes.filter(i => i.stable);
					// out of the stable isotopes, get the one with the HIGHEST binding energy per nucleon
					stable.sort((a, b) => b.nuclearBindingEnergy/b.mass - a.nuclearBindingEnergy/a.mass);
					c = c4[stable[0].mass % 4]
				}
				else {
					const isotopes = this.isotopes.map(i => [i.mass, i.halfLife]);
					isotopes.sort((a, b) => b[1] - a[1]);
					c = c4[isotopes[0][0] % 4];
				}
				// c = 'grey';
				break;
			case 'naming':
				c = elemGoldschmidtColors[elemNaming[this.z-1]];
				break;
			case 'nobleMetal':
				c = this.nobleMetal === undefined ? 'white' : nobleMetalColors[this.nobleMetal];
				break;
			case 'nuclearBinding':
				x = Math.max((Math.max(...this.isotopes.map(i => i.nuclearBindingEnergy/i.mass))
					- 1.13e-12) * 3.6e12, 0); // appx from 0 to 1
				c = gradient1(x);
				break;
			case 'nucleosynthesis':
				c = nucleosynthesisColors[this.nucleoMax];
				break;
			case 'n/z':
				x = this.stable ? mean(this.isotopes.filter(i => i.stable).map(i => i.n))
					: this.isotopes.filter(i => i.halfLife
						=== Math.max(...this.isotopes.map(i_ => i_.halfLife))
					)[0].n;
				c = gradient1((x/this.z-1)/0.6); // should be fine for everything except H1 and He3
				break;
			case 'nutrition':
				c = this.nutrition === undefined ? 'white' : nutritionColors[this.nutrition];
				break;
			case 'oxidation':{
				if (this.oxidation){
					const l = this.oxidation.length;
					let [red, gre, blu] = [0, 0, 0];
					const co = {
						'-5': [213, 230, 247],
						'-4': [223, 223, 223],
						'-3': [255, 192, 203],
						'-2': [255, 236, 211],
						'-1': [245, 222, 179],
						'0': [224, 255, 255],
						'1': [255, 160, 122],
						'2': [255, 222, 173],
						'3': [255, 191, 254],
						'4': [203, 203, 203],
						'5': [204, 204, 152],
						'6': [160, 254, 194],
						'7': [230, 254, 142],
						'8': [209, 221, 255],
						'9': [198, 221, 157],
					};
					this.oxidation.forEach(n => {
						red += co[n][0]/l;
						gre += co[n][1]/l;
						blu += co[n][2]/l;
					});
					console.debug(this.name, [red, gre, blu]);
					c = '#' + Math.round(red).toString(16)
						+ Math.round(gre).toString(16)
						+ Math.round(blu).toString(16);
				}
				else
					c = 'grey';
				break;
			}
			case 'poisson':
				if (!this.poissonRatio)
					c = 'silver';
				else {
					c = gradient1(remap(this.poissonRatio,
						[0, 0.5], [0, 1]));
				}
				break;
			case 'price':
				if (!this.prices)
					c = '#ccc';
				else if (1e6 <= this.latestPrice)
					c = '#f0f';
				else {
					const prices = elements
						.filter(e => e.prices && e.latestPrice < 1e6)
						.map(e => Math.log(e.latestPrice));
					c = gradient1(remap(
						Math.log(this.latestPrice),
						[Math.min(...prices), Math.max(...prices)], [0, 1]));
				}
				break;
			case 'production':{
				const maxProd = Math.max(...elements.filter(e => e.production)
					.map(e => Math.log(e.production)));
				c = gradient1(remap(Math.max(0, Math.log(this.production)), [0, maxProd], [0, 1]));
				break;
			}
			// there is deliberately no button for this, this is a personal utility accessed through tableColor('ptm');
			case 'ptm':{
				// post-transition metal categorization by electronegativity and melting point
				const en = this.electronegativity || this.predictedElectronegativity;
				const satisfies_en_lo = 1.5 < en;
				const satisfies_en_hi = en < 2.05;
				const satisfies_en = satisfies_en_lo && satisfies_en_hi;
				const satisfies_temp = (this.temperatures ? this.temperatures.melt : this.predictedMelt) < 950;
				if (satisfies_en) {
					if (satisfies_temp) {
						c = '#fff';
					}
					else {
						c = '#cc0';
					}
				}
				else if (satisfies_temp) {
					c = satisfies_en_lo ? '#08f' : '#80f';
				}
				else {
					c = '#000';
				}
				break;
			}
			case 'radius':{
				const rr = elements.filter(e => e.avgRadius).map(e => e.avgRadius);
				c = gradient1(remap(this.avgRadius, [Math.min(...rr), Math.max(...rr)], [0, 1]));
				break;
			}
			case 'resistivity':{
				const maxRes = Math.log(1.5e-6);
				if (maxRes < Math.log(this.resistivity)){
					c = '#979';
					break;
				}
				const rr = elements.filter(e => e.resistivity)
					.map(e => Math.log(e.resistivity));
				const mm = [Math.min(...rr), maxRes];
				c = gradient1(remap(Math.log(this.resistivity), mm, [0, 1]));
				break;
			}
			case 'shearModulus':{
				const bm = Math.max(...elements
					.filter(e => e.shearModulus)
					.map(e => e.shearModulus));
				c = gradient1(this.shearModulus/bm);
				break;
			}
			case 'speedOfSound':{
				const ee = elements.filter(e => e.speedOfSound).map(e => e.speedOfSound);
				c = gradient1(remap(this.speedOfSound, [Math.min(...ee), Math.max(...ee)], [0, 1]));
				break;
			}
			case 'stability':
				switch (this.isotopes.filter(i => i.stable).length){
					case 0:
						x = Math.max(...this.isotopes.map(i => i.halfLife));
						/* eslint-disable */
						c = x < minute ? 'red'
							: x < year ? 'orange'
							: x < 1e6 * year ? 'yellow'
							: 'lime';
						/* eslint-enable */
						break;
					case 1:
						c = 'cyan';
						break;
					default:
						c = 'skyblue';
				}
				break;
			case 'stable':
				c = gradient1(this.isotopes.filter(i => i.stable).length / 10);
				break;
			case 'state':{
				/** @type {number} */
				const t = document.getElementById('temperatureSelector').value;
				c = {gas: 'cyan', liquid: 'blue', solid: 'white', unknown: 'silver'}[this.stateAt(t)];
				break;
			}
			case 'synesthete':
				c = this.modelColor ? this.modelColor : '#ccc';
				break;
			case 'toxicity':{
				const tox = elements.filter(e => e.toxicity).map(e => Math.log(e.toxicity));
				c = gradient1(remap(
					Math.log(this.toxicity),
					[Math.min(...tox), Math.max(...tox)], [1, 0]));
				break;
			}
			case 'weight':
				c = gradient1(this.mass/ChemElement.maxWeight);
				break;
			case 'youngsModulus':{
				const bm = Math.max(...elements
					.filter(e => e.youngsModulus)
					.map(e => e.youngsModulus));
				c = gradient1(this.youngsModulus/bm);
				break;
			}
			default:
				c = 'white';
		}
		div.style.backgroundColor = c;
	}
	static get maxWeight(){
		return Math.max(...elements.map(e => e.mass));
	}
	static fromJSON(o){
		return new ChemElement(o.z, o.name, o.symbol, o.mass, o.group, o.period, o.properties);
	}
	/** @param {string} symbol */
	static fromSymbol(symbol){
		return elements.filter(e => e.symbol === symbol)[0];
	}
	/** @param {number} z */
	static fromZ(z){
		return elements.filter(e => e.z === z)[0];
	}
	/**
	 * @param {number} n number of rows
	 * @returns {number} number of elements in periodic table with n rows
	 */
	static periodic(n){
		return sum(range(1, n+1).map(i => 2*Math.pow(Math.floor(i/2 + 1), 2)));
	}
	/**
	 * get period and group from z programmatically
	 * @param {number} z
	 * @returns {[number, number]} - period, group - group is 0 if N/A (eg. lanthanoid)
	 */
	static getGroupPeriod(z){
		const p_max = Math.ceil(Math.pow(z, 0.41)); // turns out, this is a really good approximation!
		const row_sizes = range(p_max+1).map(this.periodic);
		const p = row_sizes.findIndex(x => z <= x);
		let g = z-this.periodic(p-1);
		// fix group #
		const this_row_size = 2 * Math.pow(Math.floor(p/2 + 1), 2);
		const rowDiff = 18-this_row_size;
		if (rowDiff === 16 && 1 < g)
			g -= 16;
		else if (rowDiff === 10 && 2 < g)
			g -= 10;
		else if (rowDiff < 0){
			if (g < 3){
				// pass
			}
			else if (this_row_size - g < 18)
				g += rowDiff;
			else
				g = 0;
		}
		return [p, g];
	}
}

/** @type {Decay[]} */
const decays = [];
class Decay {
	/** @param {string} name */
	constructor(name, deltaZ = 0, deltaN = 0){
		this.name = name;
		this.deltaZ = deltaZ;
		this.deltaN = deltaN;
		decays.push(this);
	}
	get deltaA(){
		return this.deltaN + this.deltaZ;
	}
	/** appx. energy released, in Joules */
	get energy(){
		const energies = {
			'a': 5e6*eV, // https://en.wikipedia.org/wiki/Alpha_particle
			'b+': 1e6*eV, // https://en.wikipedia.org/wiki/Q_value_(nuclear_science)#Applications
			'b-': 1e6*eV,
			'b-b-': 2e6*eV,
			'ec': 1e6*eV,
			'ecec': 2e6*eV,
		};
		return energies[this.name] ? energies[this.name] : 0;
	}
	get symbol(){
		return {
			'a': 'α',
			'b+': 'β+',
			'b+b+': 'β+β+',
			'b-': 'β-',
			'b-b-': 'β-β-',
			'ec': 'EC',
			'ecec': 'Double EC',
			'sf': 'SF',
			'cd': 'CD',
		}[this.name];
	}
	/** @param {number} p - probability */
	arrow(p){
		const g = createSvgElement('g');
		// line
		let line, x1, x2, y1, y2;
		// hinged arrows for b-b- and ecec/b+b+
		if (hingedArrowTypes.includes(this.name)){
			const d = this.name === 'b-b-' ? 1 : -1;
			line = hingedArrow(d);
			// used to determine label placement
			[x1, y1, x2, y2] = [0, -d*r, 2*d*r, -6*d*r];
		}
		else {
			line = createSvgElement('line');
			[x1, y1, x2, y2] = decayArrows[this.name];
			line.setAttribute('x1', x1);
			line.setAttribute('y1', y1);
			line.setAttribute('x2', x2);
			line.setAttribute('y2', y2);
		}
		// line styling
		if (p < 0.01)
			g.style.opacity = 0.5;
		if (p < 0.0001)
			line.style['stroke-dasharray'] = '2,2';
		else if (p < 0.01)
			line.style['stroke-dasharray'] = '4,4';
		g.appendChild(line);
		// label
		const text = createSvgElement('text');
		text.innerHTML = this.symbol;
		const [x, y] = [(x1+x2)/2, (y1+y2)/2];
		text.setAttribute('x', x+3);
		text.setAttribute('y', y+10);
		text.classList.add('decayLabel');
		g.appendChild(text);
		// fraction
		if (p < 1){
			const fraction = createSvgElement('text');
			// avoid silly "0%" for tiny p
			fraction.innerHTML = p === trace
				? 'rare'
				: prettyPercent(p);
			fraction.classList.add('fraction');
			fraction.setAttribute('x', 2); // so it's not right at the beginning
			fraction.setAttribute('y', -5); // so it's not right on the line
			let angle = Math.atan2(y, x)/deg;
			if (90 < angle){
				angle -= 180;
				fraction.setAttribute('x', -20);
			}
			fraction.setAttribute('transform', `translate(${x1}, ${y1}) rotate(${angle})`);
			g.appendChild(fraction);
		}
		return g;
	}
	/** @param {string} name */
	static find(name){
		return decays.filter(d => d.name === name)[0];
	}
}
new Decay('a', -2, -2); // Alpha Decay
new Decay('b+', -1, 1); // Beta+ Decay
new Decay('b+b+', -2, 2); // Double Beta+ Decay
new Decay('b-', 1, -1); // Beta- Decay
new Decay('b-b-', 2, -2); // Double Beta- Decay
new Decay('ec', -1, 1); // Electron Capture
new Decay('ecec', -2, 2); // Double Electron Capture
const sf = new Decay('sf'); // Spontaneous Fission
const cd = new Decay('cd'); // Cluster Decay

/** @type {Isotope[]} */
const isotopes = [];
class Isotope {
	/**
	 * @param {ChemElement} element
	 * @param {number} mass
	 * @param {[Decay, number][]} decayTypes
	 * @param {number} halfLife
	*/
	constructor(element, mass, decayTypes = [], halfLife = Infinity, abundance = 0){
		this.element = element;
		/** @type {number} - interger A */
		this.mass = mass;
		this.decayTypes = decayTypes;
		this.halfLife = halfLife;
		this.abundance = abundance;
		isotopes.push(this);
	}
	get coords(){
		// y-coord represents Z. x-coord represents A/2 - Z (?)
		// max z = seaborgium; Cf-256 => A = 256, Z = 98 => r; He-4 => A = 4, Z = 2 => 0
		const xFactor = Math.floor(this.mass/2) - this.element.z;
		const x = r + 2*r*(minX + r - xFactor);
		const y = r + 2*r*(maxZ - this.element.z);
		return [x, y];
	}
	/** TODO: kg estimated critical mass, in kg, based on what little data I have
	 * https://docs.google.com/spreadsheets/d/1ARdzYjBcXjnoQkj6AO55De_WOa7KMb4sFj6lqF5me8c
	*/
	get criticalMass(){
		const x = Math.pow(this.mass * Math.sqrt(this.halfLife/year), 3)
			/ Math.pow(this.element.density/1000, 2);
		return 10.7 * Math.pow(x, 0.0294);
	}
	get daughters(){
		return this.decayTypes.map(d => d[0]).filter(d => d !== sf && d !== cd).map(d => Isotope.find(
			ChemElement.fromZ(this.element.z + d.deltaZ).symbol
				+ '-' + (this.mass + d.deltaA))
		);
	}
	get n(){
		return this.mass - this.z;
	}
	get name(){
		return `${this.element.symbol}-${this.mass}`;
	}
	get nuclearBindingEnergy(){
		// http://www.dommelen.net/quantum2/style_a/ntld.html Section 14.10.2
		const cv = 15.409e6*eV;
		const cs = 16.873e6*eV;
		const cc = 0.695e6*eV;
		const cd = 22.439e6*eV;
		const cp = 11.155e6*eV;
		const oz = this.z % 2 === 1 ? 1 : 0;
		const on = this.n % 2 === 1 ? 1 : 0;
		return cv*this.mass - cs*Math.pow(this.mass, 2/3)
			- cc*this.z*(this.z-1)/Math.cbrt(this.mass) - cd*Math.pow(this.z - this.n, 2)/this.mass
			- cp * (oz + on - 1)/Math.sqrt(this.mass);
	}
	get nuclearRadius(){
		// http://www.dommelen.net/quantum2/style_a/ntld.html Section 14.10.1
		return 1.23e-15 * Math.cbrt(this.mass);
	}
	/** average power generated by decay, in Watts */
	get power(){
		return 0.5*sum(this.decayTypes.map(d => d[1]*d[0].energy))/this.halfLife;
	}
	get stable(){
		return this.halfLife === Infinity;
	}
	get z(){
		return this.element.z;
	}
	createElement(){
		const chain = 'decay' + this.mass % 4;
		const svg = document.getElementById(chain);
		const g = createSvgElement('g');
		g.id = this.name;
		const [x, y] = this.coords;
		g.setAttribute('transform', `translate(${x} ${y})`);
		svg.appendChild(g);
		// circle
		const circle = createSvgElement('circle');
		circle.setAttribute('fill', this.element.color);
		circle.setAttribute('r', r);
		g.appendChild(circle);
		// text
		const superscript = createSvgElement('text');
		superscript.innerHTML = this.mass;
		superscript.classList.add('superscript');
		superscript.setAttribute('dx', '-10px');
		superscript.setAttribute('dy', '-11px');
		g.appendChild(superscript);
		const subscript = createSvgElement('text');
		subscript.innerHTML = this.element.z;
		subscript.classList.add('subscript');
		subscript.setAttribute('dx', '-10px');
		g.appendChild(subscript);
		const symbol = createSvgElement('text');
		symbol.innerHTML = this.element.symbol;
		symbol.classList.add('symbol');
		symbol.setAttribute('dx', '-8px');
		g.appendChild(symbol);
		const halfLife = createSvgElement('text');
		const [c, u] = chooseTimeUnit(this.halfLife);
		halfLife.innerHTML = this.stable ? 'Stable' : unitString(this.halfLife/c, u);
		halfLife.classList.add('halfLife');
		halfLife.setAttribute('dy', '15px');
		g.appendChild(halfLife);
		const abundance = createSvgElement('text');
		abundance.innerHTML = this.abundance
			? this.abundance === trace
				? 'trace'
				: prettyPercent(this.abundance)
			: 'syn';
		abundance.classList.add('abundance');
		abundance.setAttribute('dy', '25px');
		g.appendChild(abundance);
		// draw arrows
		this.decayTypes.forEach(d => g.appendChild(d[0].arrow(d[1])));
	}
	static get maxHalfLife(){
		return Math.max(...isotopes.filter(i => !i.stable).map(i => i.halfLife));
	}
	/** @param {string} name */
	static find(name){
		return isotopes.filter(i => i.name === name)[0];
	}
	static fromJSON(o){
		const [symbol, massString] = o.name.split('-');
		const mass = parseInt(massString);
		const decayTypes = o.decayTypes
			? o.decayTypes.map(d => [Decay.find(d[0]), d[1]]) : undefined;
		return new Isotope(ChemElement.fromSymbol(symbol), mass,
			decayTypes, o.halfLife, o.abundance);
	}
}

// functions

/**
 * @param {number} value
 * @return {[number, string]}
 */
function chooseTimeUnit(value){
	if (value < minute)
		return [1, 's'];
	if (value < hour)
		return [minute, 'min'];
	if (value < day)
		return [hour, 'h'];
	if (value < year)
		return [day, 'd'];
	return [year, 'yr'];
}

/**
 * @param {number} x - value in [0, 1]; undefined/NaN -> grey
 * @return {string} - css color string; purple = high; blue = mid; white = low
 */
function gradient1(x){
	if (!isFinite(x))
		return '#ccc';
	return `hsl(${180+120*x}, 100%, ${100-65*x}%)`;
}

/** @param {string} category */
function highlightCategory(category){
	elements.forEach(e => e.highlightCategory(category));
}

function highlightFunction(f){
	elements.forEach(e => e.highlightFunction(f));
}

/** @param {1|-1} d - 1 = b-b-, -1 = ecec/b+b+ */
function hingedArrow(d){
	const path = createSvgElement('path');
	path.setAttribute('d', `M 0 ${-d*r} q ${0.5*d*r} ${-2.5*d*r} ${3*d*r} ${-3*d*r}`);
	path.setAttribute('class', 'hingedArrow');
	path.setAttribute('fill', 'none');
	return path;
}

/** @param {number} p - [0, 1]*/
function prettyPercent(p){
	return (p < 1e-3 ? (p*100).toExponential(1).replace('.0', '') : round(p*100, 2)) + '%';
}

function redrawDiagrams(){
	// blank
	range(4).forEach(i => document.getElementById('decay'+i).innerHTML = '');
	// draw
	elements.slice().reverse().forEach(e => e.createSVGLabel());
	isotopes.filter(i => hlCull <= i.halfLife).forEach(i => i.createElement());
	setDecayChainLength();
	console.info('drew isotope diagrams');
}

/**
 * @param {number} width - default = 14, max = 33
 * @param {number} height - default = 14, max = 118
 * @param {number} ystart - default = 94, max = 118
 * @param {number} xstart - default = 0, min = -2
 */
function setDecayChainLength(width=11, height=14, ystart=94, xstart=0){
	const svgs = document.getElementsByClassName('decay');
	Array.from(svgs).forEach(svg => {
		svg.style.width = `${width*r*2}px`;
		svg.style.height = `${height*r*2}px`;
		svg.setAttribute('viewBox', `${xstart*r*2} ${(maxZ-ystart)*r*2} ${width*r*2} ${height*r*2}`);
	});
}

/** @param {string} type */
function tableColor(type){
	elements.forEach(e => e.updateColor(type));
}

function updateTemperature(delta=0){
	const selector = document.getElementById('temperatureSelector');
	selector.value = parseInt(selector.value) + delta;
	document.getElementById('selectedTemperature').innerHTML = selector.value;
}

// main

function main(){
	// create rows/cols
	/** @type {HTMLTableElement} */
	const table = document.getElementById('table');
	range(12).forEach(y => {
		const row = document.createElement('tr');
		row.id = 'period' + (y+1);
		range(18).forEach(x => {
			const cell = document.createElement('td');
			cell.id = `cell${x}-${y}`;
			row.appendChild(cell);
		});
		table.appendChild(row);
	});
	// read data from elementData
	elementData.forEach(e => ChemElement.fromJSON(e));
	isotopeData.forEach(i => Isotope.fromJSON(i));
	// draw isotopes
	redrawDiagrams();
	// reset temperature
	document.getElementById('temperatureSelector').value = standardTemperature;
	updateTemperature();
	// draw nucleus
	nucleus.update();
	// add oxidation state buttons
	range(-4, 9).forEach(n => {
		const label = document.createElement('label');
		label.onclick = () => highlightFunction(
			e => e.oxidation !== undefined && e.oxidation.includes(n));
		// <input name="category" type="radio">
		const input = document.createElement('input');
		input.name = 'category';
		input.type = 'radio';
		label.appendChild(input);
		label.appendChild(document.createTextNode((0 < n ? '+' : '') + n));
		document.getElementById('oxidationStateRadio').appendChild(label);
	});
	// log
	console.info('elements.js successfully loaded.');
}

main();
// tableColor('density2');