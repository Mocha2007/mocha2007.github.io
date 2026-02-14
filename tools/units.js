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
		new Derived('', 'G', {length:3,mass:-1,time:-2}, 6.67430e-11),
		new Derived('', 'ħ', {length:2,mass:1,time:-1}, 1.054571817e-34),
		new Derived('', 'kB', {mass:1,length:2,time:-2,temperature:-1}, 1.380649e-23),
		// dimensions
		new Derived('J', 'energy', {mass:1,length:2,time:-2}),
		new Derived('N', 'force', {mass:1,length:1,time:-2}),
		new Derived('Pa', 'pressure', {mass:1,length:-1,time:-2}),
		new Derived('W', 'power', {mass:1,length:2,time:-3}),
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
			label.innerHTML += sym;
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
		main.appendChild(cont_pre);
		const cont_in = document.createElement('div');
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