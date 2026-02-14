class Dimension {
	static TIME = "time";
	static LENGTH = "length";
	static MASS = "mass";
	static CURRENT = "current";
	static TEMPERATURE = "temperature";
	static AMOUNT = "amount";
	static LUMINOUS_INTENSITY = "luminous intensity";
}

class Derived {
	constructor(sym, name, dimensions, base = 1){
		/** @type {string} */
		this.sym = sym;
		/** @type {string} */
		this.name = name;
		this.dimensions = dimensions;
		/** @type {number} */
		this.base = base;
	}
	/** @returns {HTMLSpanElement} */
	get elem(){
		return document.getElementById(`output_${this.name}`);
	}
}

const UNITS = {
	get all_units(){
		// base units
		const base = Object.values(Dimension).map(name => {
			const sym = this.base_unit_symbols[name];
			const dimensions = {};
			dimensions[name] = 1;
			return new Derived(sym, name, dimensions);
		});
		return base.concat(...this.derived);
	},
	base_unit_symbols: {
		time: "s",
		length: "m",
		mass: "kg",
		current: "A",
		temperature: "K",
		amount: "mol",
		"luminous intensity": "cd",
	},
	derived: [
		// constants
		new Derived('', 'c', {length:1,time:-1}, 299792458),
		new Derived('', 'e', {current:1,time:1}, 1.602176634e-19),
		new Derived('', 'G', {length:3,mass:-1,time:-2}, 6.67430e-11),
		new Derived('', 'ħ', {length:2,mass:1,time:-1}, 1.054571817e-34),
		new Derived('', 'k<sub>B</sub>', {mass:1,length:2,time:-2,temperature:-1}, 1.380649e-23),
		new Derived('', 'm<sub>e</sub>', {mass:1}, 9.1093837139e-31),
		new Derived('', 'm<sub>p</sub>', {mass:1}, 1.67262192595e-27),
		new Derived('', 'r<sub>e</sub>', {length:1}, 2.8179403205e-15),
		new Derived('', 'R<sub>∞</sub>', {length:-1}, 10973731.568157),
		new Derived('', 'ε<sub>0</sub>', {mass:-1,length:-3,time:4,current:2}, 8.8541878188e-12),
		new Derived('', 'ƛ<sub>e</sub>', {length:1}, 1.054571817e-34/(9.1093837139e-31*299792458)),
		new Derived('', 'μ<sub>B</sub>', {length:2,current:1}, 9.2740100657e-24),
		// dimensions
		new Derived('C', 'electric charge', {current:1,time:1}),
		new Derived('F', 'capacitance', {mass:-1,length:-2,time:4,current:2}),
		new Derived('Gy', 'absorbed dose', {length:-2,time:-2}),
		new Derived('H', 'inductance', {mass:1,length:2,time:-2,current:-2}),
		new Derived('Hz', 'frequency', {time:-1}),
		new Derived('J', 'energy', {mass:1,length:2,time:-2}),
		new Derived('kat', 'catalytic activity', {amount:1,length:-1}),
		new Derived('N', 'force', {mass:1,length:1,time:-2}),
		new Derived('Pa', 'pressure', {mass:1,length:-1,time:-2}),
		new Derived('S', 'electrical conductance', {mass:-1,length:-2,time:3,current:2}),
		new Derived('T', 'magnetic flux density', {mass:1,time:-2,current:-1}),
		new Derived('V', 'electric potential difference', {mass:1,length:2,time:-3,current:-1}),
		new Derived('W', 'power', {mass:1,length:2,time:-3}),
		new Derived('Wb', 'magnetic flux', {mass:1,length:2,time:-2,current:-1}),
		new Derived('Ω', 'electrical resistance', {mass:1,length:2,time:-3,current:-2}),
		new Derived('m<sup>3</sup>', 'volume', {length:3}),
	],
	elem: {
		create_dim_input(name, sym){
			const label = document.createElement('label');
			label.innerHTML = `${name}: `;
			const input = document.createElement('input');
			input.type = 'text';
			input.placeholder = 1;
			label.for = input.name = input.id = `input_${name}`;
			label.appendChild(input);
			label.innerHTML += ` ${sym}`;
			label.onmouseup = label.onkeyup = () => UNITS.update();
			return label;
		},
		create_dim_output(name, sym, divider = ':'){
			const container = document.createElement('div');
			container.innerHTML = `${name}${divider} `;
			container.classList.add(divider === ':' ? 'out_dim' : 'out_const');
			const printout = document.createElement('span');
			printout.id = `output_${name}`;
			container.appendChild(printout);
			container.innerHTML += ` ${sym}`;
			return container;
		},
		/** @type {HTMLDivElement} */
		main: undefined,
	},
	init(){
		const main = this.elem.main = document.getElementById('main');
		const cont_pre = document.createElement('div');
		cont_pre.id = 'presets';
		main.appendChild(cont_pre);
		const cont_in = document.createElement('div');
		cont_in.id = 'inputs';
		main.appendChild(cont_in);
		const cont_out = document.createElement('div');
		cont_out.id = 'outputs';
		main.appendChild(cont_out);
		// we need preset buttons
		Object.keys(this.preset).forEach(system => {
			const button = document.createElement('span');
			button.classList.add('button');
			button.innerHTML = system;
			button.onclick = () => {
				Object.keys(this.base_unit_symbols).forEach(bu => {
					const elem = document.getElementById(`input_${bu}`);
					elem.value = this.preset[system][bu] || '';
				});
				this.update();
			};
			cont_pre.appendChild(button);
		});
		// we need inputs for all 7 base units
		Object.keys(this.base_unit_symbols).forEach(name => {
			const sym = this.base_unit_symbols[name];
			const elem = this.elem.create_dim_input(name, sym);
			cont_in.appendChild(elem);
		});
		// ... and then output info for each derived unit!
		this.derived.forEach(d => {
			const elem = this.elem.create_dim_output(d.name, d.sym, d.base !== 1 ? ' =' : ':');
			cont_out.appendChild(elem);
		});
		this.update(); // update once
		console.info('units.js loaded.');
	},
	preset: {
		metric: {
			time: 1,
			length: 1,
			mass: 1,
			current: 1,
			temperature: 1,
			amount: 1,
			"luminous intensity": 1,
		},
		imperial: {
			length: 0.3048,
			mass: 0.45359237,
			temperature: 5/9,
		},
		planck: {
			time: 5.391247e-44,
			length: 1.616255e-35,
			mass: 2.176434e-8,
			current: 5.290818e-19,
			temperature: 1.416784e32,
		},
		stoney: {
			time: 4.6054e-45,
			length: 1.3807e-36,
			mass: 1.8592e-9,
			current: 1.602176634e-19,
			temperature: 1.416784e32/11.705686242420583, // ???
		},
		atomic: {
			time: 2.4188843265864e-17,
			length: 5.29177210544e-11,
			mass: 9.1093837139e-31,
			current: 6.6236182375082e-3,
		},
		eremoran: {
			time: 29.33*60*60, // rilm
			length: 0.25125, // ki
			mass: 0.4041, // kuril
		},
		verdurian: {
			time: 24.5*60*60/24/10/120, // a verdurian "moment" - The Almean day is slightly longer than ours (by about half an hour).
			length: 0.758, // chima
			mass: 6.071, // cucuri
		},
		earth: {
			time: 0.99726968*24*60*60,
			length: 6371e3,
			mass: 5.97217e24,
			current: 36198615448.59541, // for 45 mcT
			temperature: 255,
		},
	},
	update(){
		const base_unit_values = {};
		Object.keys(this.base_unit_symbols).forEach(bu => {
			const elem = document.getElementById(`input_${bu}`);
			base_unit_values[bu] = parseFloat(elem.value || elem.placeholder);
		});
		// console.debug(`update -> `, base_unit_values);
		this.derived.forEach(d => {
			console.debug(d);
			let product = d.base;
			for (let key in d.dimensions){
				product /= Math.pow(base_unit_values[key], d.dimensions[key]);
			}
			d.elem.innerHTML = product;
		});
	},
};

UNITS.init();