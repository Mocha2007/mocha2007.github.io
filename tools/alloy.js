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
		new Alloy('billon', {
			Cu: 0.6,
			Ag: 0.4,
		}),
		new Alloy('bismuth bronze', {
			Cu: 0.86,
			Sn: 0.12,
			Bi: 0.02,
		}),
		new Alloy('brass', {
			Cu: 2/3,
			Zn: 1/3,
		}),
		new Alloy('bronze', {
			Cu: 0.88,
			Sn: 0.12,
		}),
		new Alloy('electrum', {
			Ag: 0.5,
			Au: 0.5,
		}),
		new Alloy('hepatizon', {
			Cu: 0.84,
			Ag: 0.08,
			Au: 0.08,
		}),
		new Alloy('nickel silver', {
			Cu: 0.6,
			Ni: 0.2,
			Zn: 0.2,
		}),
		new Alloy('pewter (fine)', {
			Sn: 0.99,
			Cu: 0.01,
		}),
		new Alloy('pewter (lay)', {
			Sn: 0.85,
			Pb: 0.15,
		}),
		new Alloy('pewter (modern)', {
			Sn: 0.905,
			Sb: 0.075,
			Cu: 0.02,
		}),
		new Alloy('pewter (trifle)', {
			Sn: 0.95,
			Pb: 0.04,
			Cu: 0.01,
		}),
		new Alloy('pig iron', {
			Fe: 0.9575,
			C: 0.0425,
		}),
		new Alloy('rose gold', {
			Au: 0.75,
			Cu: 0.25,
		}),
		new Alloy('steel', {
			Fe: 0.9892,
			C: 0.0108,
		}),
		new Alloy('steel (stainless)', {
			Fe: 0.8092,
			Cr: 0.18,
			C: 0.0108,
		}),
		new Alloy('sterling silver', {
			Ag: 0.925,
			Cu: 0.075,
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
		new ChemicalElement('antimony', 'Sb'),
		new ChemicalElement('bismuth', 'Bi'),
		new ChemicalElement('carbon', 'C'),
		new ChemicalElement('chromium', 'Cr'),
		new ChemicalElement('copper', 'Cu'),
		new ChemicalElement('gold', 'Au'),
		new ChemicalElement('iron', 'Fe'),
		new ChemicalElement('lead', 'Pb'),
		new ChemicalElement('nickel', 'Ni'),
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