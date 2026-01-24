class Alloy {
	/** @param {string} name */
	constructor(name, composition){
		/** @type {string} */
		this.name = name;
		/** elem name -> fraction */
		this.composition = composition;
	}
	dist(other_composition){
		let ssq = 0;
		for (let sym in this.composition){
			let my_amt = this.composition[sym] || 0;
			let other_amt = other_composition[sym] || 0;
			ssq += Math.pow(my_amt-other_amt, 2);
		}
		return ssq;
	}
}

class ChemicalElement {
	/**
	 * @param {string} name 
	 * @param {string} sym 
	 */
	constructor(name, sym){
		/** @type {string} */
		this.name = name;
		/** @type {string} */
		this.sym = sym;
	}
	get slider_id(){
		return `slider-${this.sym}`;
	}
}

const ALLOY = {
	/** @type {Alloy[]} */
	alloys: [
		new Alloy('Billon', {
			Cu: 0.6,
			Ag: 0.4,
		}),
		new Alloy('Brass (Common)', {
			Cu: 0.63,
			Zn: 0.37,
		}),
		new Alloy('Brass (Dutch metal)', {
			Cu: 0.865,
			Zn: 0.135,
		}),
		new Alloy('Brass (Gilding metal)', {
			Cu: 0.92,
			Zn: 0.08,
		}),
		new Alloy('Brass (Gunmetal)', {
			Cu: 0.88,
			Zn: 0.1,
			Sn: 0.02,
		}),
		new Alloy('Brass (Muntz metal)', {
			Cu: 0.6,
			Zn: 0.4,
		}),
		new Alloy('Brass (Naval)', {
			Cu: 0.59,
			Zn: 0.4,
			Sn: 0.01,
		}),
		new Alloy('Brass (Pinchbeck)', {
			Cu: 0.91,
			Zn: 0.09,
		}),
		new Alloy('Bronze', {
			Cu: 0.88,
			Sn: 0.12,
		}),
		new Alloy('Bronze (Aluminum)', {
			Cu: 0.92,
			Al: 0.08,
		}),
		new Alloy('Bronze (Bismuth)', {
			Cu: 0.86,
			Sn: 0.12,
			Bi: 0.02,
		}),
		new Alloy('Bronze (White)', {
			Cu: 0.55,
			Sn: 0.3,
			Zn: 0.15,
		}),
		new Alloy('Cast iron', {
			Fe: 0.95,
			C: 0.03,
			Si: 0.02,
		}),
		new Alloy('Electrum', {
			Ag: 0.5,
			Au: 0.5,
		}),
		new Alloy('Ferrochrome', {
			Fe: 0.4,
			Cr: 0.6,
		}),
		new Alloy('Hepatizon', {
			Cu: 0.84,
			Ag: 0.08,
			Au: 0.08,
		}),
		// https://oxfordre.com/planetaryscience/display/10.1093/acrefore/9780190647926.001.0001/acrefore-9780190647926-e-206
		new Alloy('Meteoric iron', {
			// typical composition
			Fe: 0.91,
			Ni: 0.08,
			Co: 0.005,
			C: 0.0004,
			Cr: 20e-6,
			Au: 1e-6,
			Zn: 1e-6,
			Si: 0.2e-6,
			Sb: 0.05e-6,
			Ag: 0.03e-6,
		}),
		new Alloy('Nichrome', {
			Ni: 0.8,
			Cr: 0.2,
		}),
		new Alloy('Nickel silver', {
			Cu: 0.6,
			Ni: 0.2,
			Zn: 0.2,
		}),
		new Alloy('Nordic gold', {
			Cu: 0.89,
			Al: 0.05,
			Zn: 0.05,
			Sn: 0.01,
		}),
		new Alloy('Pewter (fine)', {
			Sn: 0.99,
			Cu: 0.01,
		}),
		new Alloy('Pewter (lay)', {
			Sn: 0.85,
			Pb: 0.15,
		}),
		new Alloy('Pewter (modern)', {
			Sn: 0.905,
			Sb: 0.075,
			Cu: 0.02,
		}),
		new Alloy('Pewter (trifle)', {
			Sn: 0.95,
			Pb: 0.04,
			Cu: 0.01,
		}),
		new Alloy('Pig iron', {
			Fe: 0.9575,
			C: 0.0425,
		}),
		new Alloy('Purple gold', {
			Au: 0.79,
			Al: 0.21,
		}),
		new Alloy('Rose gold', {
			Au: 0.75,
			Cu: 0.25,
		}),
		new Alloy('Rose\'s metal', {
			Bi: 0.5,
			Pb: 0.265,
			Sn: 0.235,
		}),
		new Alloy('Steel', {
			Fe: 0.9892,
			C: 0.0108,
		}),
		new Alloy('Steel (stainless)', {
			Fe: 0.8092,
			Cr: 0.18,
			C: 0.0108,
		}),
		new Alloy('Sterling silver', {
			Ag: 0.925,
			Cu: 0.075,
		}),
		new Alloy('White gold', {
			Au: 0.9,
			Ni: 0.1,
		}),
	],
	config: {
		slider_notches: 100,
	},
	elem: {
		/** @returns {HTMLDivElement} */
		get container(){
			return document.getElementById('alloy_container');
		},
		/** @returns {HTMLDivElement} */
		get result(){
			return document.getElementById('result');
		},
	},
	/** @type {ChemicalElement[]} */
	elements: [
		new ChemicalElement('aluminum', 'Al'),
		new ChemicalElement('antimony', 'Sb'),
		new ChemicalElement('bismuth', 'Bi'),
		new ChemicalElement('carbon', 'C'),
		new ChemicalElement('chromium', 'Cr'),
		new ChemicalElement('copper', 'Cu'),
		new ChemicalElement('gold', 'Au'),
		new ChemicalElement('iron', 'Fe'),
		new ChemicalElement('lead', 'Pb'),
		new ChemicalElement('nickel', 'Ni'),
		new ChemicalElement('silicon', 'Si'),
		new ChemicalElement('silver', 'Ag'),
		new ChemicalElement('tin', 'Sn'),
		new ChemicalElement('zinc', 'Zn'),
	],
	init(){
		if (typeof this.elem.container === 'undefined'){
			setTimeout(() => this.init(), 100);
			return;
		}
		// ok now continue
		this.initSliders();
		this.initResult();
		console.info('alloy.js initialized');
	},
	initResult(){
		const result = document.createElement('div');
		result.id = 'result';
		this.elem.container.appendChild(result);
		this.refresh();
	},
	initSliders(){
		const slider_container = document.createElement('div');
		slider_container.id = 'slider_container';
		this.elem.container.appendChild(slider_container);
		this.elements.forEach(e => {
			const slider = document.createElement('input');
			slider.type = 'range';
			slider.min = 0;
			slider.max = this.config.slider_notches;
			slider.value = 0;
			slider.class = 'slider';
			// label
			const label = document.createElement('label');
			label.for = slider.name = slider.id = e.slider_id;
			label.innerHTML = `<div><a href="https://en.wikipedia.org/wiki/${e.name}">${e.name}</a> (${e.sym}) = <span id="${e.slider_id}-n">${slider.value}</span>%</div>`;
			label.onmousemove = label.onclick = () => {
				// update the n for this slider
				document.getElementById(`${e.slider_id}-n`).innerHTML = document.getElementById(e.slider_id).value;
				// update result
				this.refresh();
			};
			label.appendChild(slider);
			slider_container.appendChild(label);
		});
	},
	refresh(){
		// get current slider states
		const composition = {};
		this.elements.forEach(e => composition[e.sym] = document.getElementById(e.slider_id).value/this.config.slider_notches);
		const errors = this.alloys.map(a => [a, a.dist(composition)]);
		errors.sort((a, b) => a[1] - b[1]);
		// blank current output
		const result = this.elem.result;
		result.innerHTML = '';
		// list all items in errors, up to 10 max!
		for (let i = 0; i < Math.min(errors.length, 10); i++) {
			const entry = document.createElement('div');
			const name = errors[i][0].name;
			entry.innerHTML = `#${i+1} (dist: ${Math.sqrt(errors[i][1])}): <a href="https://en.wikipedia.org/wiki/${name}">${name}</a>`;
			result.appendChild(entry);
		}
	},
};

ALLOY.init();