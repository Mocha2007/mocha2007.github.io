/* jshint esversion: 6, strict: true, strict: global, laxbreak: true, nonew: false */
/* globals createSvgElement, day, deg, elementData, hour, isotopeData, mean, minute,
	nobleMetalColors, nucleosynthesisColors, nutritionColors, range, remap, round, sum, trace,
	unitString, year */
/* exported highlightCategory, highlightFunction, hlCull, setDecayChainLength, tableColor */
'use strict';

const eV = 1.602176634e-19; // J; exact; electronvolt
const standardTemperature = 273.15; // K; exact; melting point of water

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
	 * @param {{rgb: string}} properties
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
			/** @type {number} - in seconds */
			this.biologicalHalfLife = properties.biologicalHalfLife;
			/** string => true|false|0.5 */
			this.categories = properties.categories;
			/** @type {number} - kg/m^3; divide by 1000 to get g/cm^3 */
			this.density = properties.density;
			/** @type {number} - year CE/BCE */
			this.discovery = properties.discovery;
			/** @type {string} - color used in models */
			this.modelColor = properties.modelColor;
			/** @type {number} */
			this.nobleMetal = properties.nobleMetal;
			/** string => [0, 1] */
			this.nucleosynthesis = properties.nucleosynthesis;
			/** @type {number} */
			this.nutrition = properties.nutrition;
			/** year => $/kg inflation-adjusted */
			this.prices = properties.prices;
			/** @type {number} t/yr */
			this.production = properties.production;
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
		}
		// push to element list and create cell
		elements.push(this);
		this.createElement();
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
		if (this.period === 6 && this.z < 72)
			return 'Lanthanide';
		if (this.period === 7 && this.z < 104)
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
	get electronShell(){
		if (this.group < 3 || this.z === 2)
			return 's';
		if (12 < this.group)
			return 'p';
		// this is correct up to z = 170, highly unlikely I'll be around to ever see this table broken
		return this.group ? 'd' : 120 < this.z && this.z < 139 ? 'g' : 'f';
	}
	/** @return {HTMLDivElement} DOM element */
	get element(){
		return document.getElementById(this.name);
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
	/** most common stellar nucleosynthesis process */
	get nucleoMax(){
		if (!this.nucleosynthesis)
			return 'artificial';
		return Object.keys(this.nucleosynthesis)
			.sort((a, b) => this.nucleosynthesis[b] - this.nucleosynthesis[a])[0];
	}
	get stable(){
		return this.isotopes.some(i => i.stable);
	}
	createElement(){
		const div = document.createElement('div');
		div.id = this.name;
		// name
		const name = document.createElement('span');
		name.innerHTML = this.name;
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
		/** @type {HTMLTableDataCellElement} */
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
					c = 'white';
				else if (this.abundance.earth < 1e-9) // trace
					c = 'magenta';
				else // 13 * -9 = -117 ~ -120
					c = `hsl(${120+13*Math.log10(this.abundance.earth)}, 100%, 50%)`;
				break;
			case 'abundanceHuman':
				if (!this.abundance || !this.abundance.human)
					c = 'white';
				else if (this.abundance.human < 1e-9) // trace
					c = 'magenta';
				else
					c = `hsl(${120+13*Math.log10(this.abundance.human)}, 100%, 50%)`;
				break;
			case 'abundanceUniverse':
				if (!this.abundance || !this.abundance.universe)
					c = 'white';
				else if (this.abundance.universe < 1e-9) // trace
					c = 'magenta';
				else
					c = `hsl(${120+13*Math.log10(this.abundance.universe)}, 100%, 50%)`;
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
			case 'color': // normalized color
				c = this.rgb ? this.rgb : 'grey';
				break;
			case 'category':
				c = this.color;
				break;
			case 'density':{
				const densest = Math.sqrt(
					Math.max(...elements.filter(e => e.density).map(e => e.density)));
				c = gradient1(Math.sqrt(this.density)/densest);
				break;
			}
			case 'discovery':{
				const ages = elements.filter(e => isFinite(e.discovery))
					.map(e => Math.log(new Date().getFullYear() - e.discovery));
				c = gradient1(remap(
					Math.log(new Date().getFullYear() - this.discovery),
					[Math.min(...ages), Math.max(...ages)], [0, 1]));
				break;
			}
			case 'halflife':
				if (this.stable)
					c = '#f0f';
				else {
					x = Math.log(Math.max(...this.isotopes.map(i => i.halfLife))) /
						Math.log(Isotope.maxHalfLife); // [0, 1]
					console.log(this, x);
					c = gradient1(x);
				}
				break;
			case 'halflifeb':
				if (!this.biologicalHalfLife)
					c = '#ccc';
				else {
					x = Math.cbrt(this.biologicalHalfLife) /
						Math.cbrt(Math.max(...elements.filter(e => e.biologicalHalfLife)
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
			case 'msi%4':
				if (this.stable){
					if (new Set(this.isotopes.filter(i => i.stable).map(
						i => i.mass % 4)).size === 1){
						c = c4[this.isotopes.filter(i => i.stable)[0].mass % 4];
					}
					// otherwise multiple options
					else if (new Set(this.isotopes.filter(i => i.stable && i.n % 2 === 0).map(
						i => i.mass % 4)).size === 1){ // only one stable isotope with even # of neutrons?
						c = c4[this.isotopes.filter(i => i.stable && i.n % 2 === 0)[0].mass % 4];
					}
					else
						c = 'grey';
				}
				else {
					const isotopeMasses = this.isotopes.map(i => i.mass);
					c = c4[this.isotopes[isotopeMasses.indexOf(
						Math.max(...isotopeMasses))].mass % 4];
				}
				break;
			case 'nobleMetal':
				c = this.nobleMetal === undefined ? 'white' : nobleMetalColors[this.nobleMetal];
				break;
			case 'nuclearBinding':
				x = Math.max((Math.max(...this.isotopes.map(i => i.nuclearBindingEnergy/i.mass)) -
					1.13e-12) * 3.6e12, 0); // appx from 0 to 1
				c = gradient1(x);
				break;
			case 'nucleosynthesis':
				c = nucleosynthesisColors[this.nucleoMax];
				break;
			case 'n/z':
				x = this.stable ? mean(this.isotopes.filter(i => i.stable).map(i => i.n)) :
					this.isotopes.filter(i =>
						i.halfLife === Math.max(...this.isotopes.map(i_ => i_.halfLife))
					)[0].n;
				c = gradient1((x/this.z-1)/0.6); // should be fine for everything except H1 and He3
				break;
			case 'nutrition':
				c = this.nutrition === undefined ? 'white' : nutritionColors[this.nutrition];
				break;
			case 'price':
				if (!this.prices)
					c = '#ccc';
				else {
					const prices = elements.filter(e => e.prices).map(e => Math.log(e.latestPrice));
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
				x = this.isotopes.filter(i => i.stable).length / 10 * 255;
				c = `rgb(255, ${255-x}, 255)`;
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
				x = 255*this.mass/ChemElement.maxWeight;
				c = `rgb(255, ${255-x}, ${255-x})`;
				break;
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
		return this.decayTypes.map(d => d[0]).filter(d => d !== sf).map(d =>
			Isotope.find(ChemElement.fromZ(this.element.z + d.deltaZ).symbol +
				'-' + (this.mass + d.deltaA))
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
		return cv*this.mass - cs*Math.pow(this.mass, 2/3) -
			cc*this.z*(this.z-1)/Math.cbrt(this.mass) - cd*Math.pow(this.z - this.n, 2)/this.mass -
			cp * (oz + on - 1)/Math.sqrt(this.mass);
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
		const decayTypes = o.decayTypes ?
			o.decayTypes.map(d => [Decay.find(d[0]), d[1]]) : undefined;
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
function setDecayChainLength(width=14, height=14, ystart=94, xstart=0){
	const svgs = document.getElementsByTagName('svg');
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
	// log
	console.info('elements.js successfully loaded.');
}

main();