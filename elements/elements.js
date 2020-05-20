/* jshint esversion: 6, strict: true, strict: global */
/* globals elementData, range, round */
'use strict';

const typeColors = {
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
/** @type {Element[]} */
const elements = [];
class Element {
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
	get type(){
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
		mass.innerHTML = round(this.mass, 3);
		mass.classList.add('smaller');
		div.appendChild(mass);
		// styling
		div.style.border = '2px solid darkGrey';
		div.style.backgroundColor = typeColors[this.type];
		// place element
		const [x, y] = this.coords;
		/** @type {HTMLTableDataCellElement} */
		const cell = document.getElementById(`cell${x}-${y}`);
		cell.appendChild(div);
	}
	static fromJSON(o){
		return new Element(o.z, o.name, o.symbol, o.mass, o.group, o.period);
	}
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
	elementData.forEach(e => Element.fromJSON(e));
	// log
	console.info('elements.js successfully loaded.');
}

main();