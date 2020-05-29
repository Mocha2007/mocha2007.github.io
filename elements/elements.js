/* jshint esversion: 6, strict: true, strict: global */
/* globals createSvgElement, day, deg, elementData, hour,
	isotopeData, minute, range, round, sum, unitString, year */
/* exported setDecayChainLength, tableColor */
'use strict';

const eV = 1.602176634e-19; // J; exact; electronvolt

const maxZ = 98;
const corner = 30/Math.sqrt(2);
const decayArrows = {
	'a': [0, 30, 0, 90],
	'b+': [-corner, corner, corner-60, 60-corner],
	'b+b+': [-corner, corner, corner-120, 120-corner],
	'b-': [corner, -corner, 60-corner, corner-60],
	'b-b-': [corner, -corner, 120-corner, corner-120], // todo make this not intersect shit
	'sf': [30, 0, 38, 0],
};
decayArrows.ec = decayArrows['b+'];
decayArrows.ecec = decayArrows['b+b+'];

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
};

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
	*/
	constructor(z, name, symbol, mass, group, period){
		this.z = z;
		this.name = name;
		this.symbol = symbol;
		this.mass = mass;
		/** column */
		this.group = group;
		/** row */
		this.period = period;
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
		if (11 < this.group)
			return 'Post-transition metal';
		if (this.period === 6 && this.z < 72)
			return 'Lanthanide';
		if (this.period === 7 && this.z < 104)
			return 'Actinide';
		return 'Transition metal';
	}
	get color(){
		return elemCatColors[this.category];
	}
	/** @return {[number, number]} zero-indexed coord of the square */
	get coords(){
		// lanthanides and actinides
		if (this.electronShell === 'f'){
			const x = this.z - (this.z < 72 ? 55 : 87);
			const y = this.period + 2;
			return [x, y];
		}
		return [this.group - 1, this.period - 1];
	}
	get electronShell(){
		if (this.group < 3 || this.z === 2)
			return 's';
		if (12 < this.group)
			return 'p';
		// undefined = lantanide or actinide
		return this.group ? 'd' : 'f';
	}
	/** @return {HTMLDivElement} DOM element */
	get element(){
		return document.getElementById(this.name);
	}
	/** @return {Isotope[]} this element's isotopes */
	get isotopes(){
		return isotopes.filter(i => i.element === this);
	}
	get stable(){
		return this.isotopes.some(i => i.stable);
	}
	/** Normalized Color:
	 * - A photograph of the element is taken.
	 * - White and Black are removed.
	 * - The rest is averaged and white-balanced.
	 */
	get rgb(){
		return {
			// 2
			Li: 'rgb(249, 255, 252)',
			Be: 'rgb(255, 255, 255)',
			B: 'rgb(255, 232, 219)',
			C: 'rgb(255, 251, 239)',
			F: 'rgb(255, 207, 112)',
			// 3
			P: 'rgb(255, 235, 186)',
			S: 'rgb(255, 218, 86)',
			Cl: 'rgb(246, 255, 188)',
			// 4
			Fe: 'rgb(255, 252, 252)',
			Co: 'rgb(255, 249, 244)',
			Ni: 'rgb(255, 245, 224)',
			Cu: 'rgb(255, 121, 76)',
			Br: 'rgb(255, 94, 35)',
			// 5
			I: 'rgb(216, 229, 255)',
			// 6
			Cs: 'rgb(255, 212, 153)',
			Au: 'rgb(255, 211, 109)',
			// 7
			U: 'rgb(255, 251, 242)',
			Pu: 'rgb(255, 226, 249)',
			Am: 'rgb(255, 233, 224)',
			Cm: 'rgb(255, 255, 216)',
		}[this.symbol];
	}
	createElement(){
		const div = document.createElement('div');
		div.id = this.name;
		// content
		const name = document.createElement('span');
		name.innerHTML = this.name;
		name.classList.add('smaller');
		div.appendChild(name);
		div.innerHTML += `<br>${this.z}<br>${this.symbol}<br>`;
		const mass = document.createElement('span');
		mass.innerHTML = this.mass % 1 ? round(this.mass, 3) : `[${this.mass}]`;
		mass.classList.add('smaller');
		div.appendChild(mass);
		// styling
		div.style.border = '2px solid darkGrey';
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
			const y = 60*(maxZ - this.z);
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
	/** @param {string} type */
	updateColor(type){
		/** @type {HTMLDivElement} */
		const div = document.getElementById(this.name);
		let c, x;
		switch (type){
			case 'color': // normalized color
				c = this.rgb ? this.rgb : 'grey';
				break;
			case 'category':
				c = this.color;
				break;
			case 'halflife':
				if (this.stable){
					c = '#0c0';
					break;
				}
				x = Math.log(Math.max(...this.isotopes.map(i => i.halfLife))) /
					Math.log(Isotope.maxHalfLife) * 255;
				c = `rgb(${255-x}, 128, ${255-x})`;
				break;
			case 'stable':
				x = this.isotopes.filter(i => i.stable).length / 10 * 255;
				c = `rgb(255, ${255-x}, 255)`;
				break;
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
		return new ChemElement(o.z, o.name, o.symbol, o.mass, o.group, o.period);
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
		const line = createSvgElement('line');
		const [x1, y1, x2, y2] = decayArrows[this.name];
		line.setAttribute('x1', x1);
		line.setAttribute('y1', y1);
		line.setAttribute('x2', x2);
		line.setAttribute('y2', y2);
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
			fraction.innerHTML = round(p*100, 2) + '%';
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
	constructor(element, mass, decayTypes = [], halfLife = 0, abundance = 0){
		this.element = element;
		this.mass = mass;
		this.decayTypes = decayTypes;
		this.halfLife = halfLife;
		this.abundance = abundance;
		isotopes.push(this);
	}
	get coords(){
		// y-coord represents Z. x-coord represents A/2 - Z (?)
		// max z = seaborgium; Cf-256 => A = 256, Z = 98 => 30; He-4 => A = 4, Z = 2 => 0
		const xFactor = Math.floor(this.mass/2) - this.element.z;
		const x = 30 + 60*(30 - xFactor);
		const y = 30 + 60*(maxZ - this.element.z);
		return [x, y];
	}
	get daughters(){
		return this.decayTypes.map(d => d[0]).filter(d => d !== sf).map(d =>
			Isotope.find(ChemElement.fromZ(this.element.z + d.deltaZ).symbol +
				'-' + (this.mass + d.deltaA))
		);
	}
	get name(){
		return `${this.element.symbol}-${this.mass}`;
	}
	/** average power generated by decay, in Watts */
	get power(){
		return sum(this.decayTypes.map(d => d[1]*d[0].energy))/this.halfLife;
	}
	get stable(){
		return this.halfLife === 0;
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
		// draw arrows
		this.decayTypes.forEach(d => g.appendChild(d[0].arrow(d[1])));
	}
	static get maxHalfLife(){
		return Math.max(...isotopes.map(i => i.halfLife));
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

/** @param {number} width - default = 14, max = 32 */
/** @param {number} height - default = 23, max = 98 */
function setDecayChainLength(width, height){
	const svgs = document.getElementsByTagName('svg');
	Array.from(svgs).forEach(svg => {
		svg.style.width = `calc(${width}*60px)`;
		svg.style.height = `calc(${height}*60px)`;
	});
}

/** @param {string} type */
function tableColor(type){
	elements.forEach(e => e.updateColor(type));
}

// main

function main(){
	// create rows/cols
	/** @type {HTMLTableElement} */
	const table = document.getElementById('table');
	range(10).forEach(y => {
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
	elements.slice().reverse().forEach(e => e.createSVGLabel());
	isotopes.forEach(i => i.createElement());
	// log
	console.info('elements.js successfully loaded.');
}

main();
/* todo list
- add a "circle radius" variable for convenience
*/
// DEBUG DONT PUSH
// setDecayChainLength(32, 98);