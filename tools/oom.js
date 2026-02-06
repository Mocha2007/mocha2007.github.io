class Mass {
	constructor(x, uncertainty){
		// if x is a single number, we interpret it as the mean/reference value
		// otherwise, it must be a range with {min} and {max}
		if (typeof x === "number") {
			/** @type {number} */
			this.min = this.max = this.x = x;
		}
		else {
			this.min = x.min;
			this.max = x.max;
			this.x = (this.min + this.max)/2;
		}
		// if uncertainty is a single number, we interpret it as +/- x
		if (typeof uncertainty === "number"){
			this.min -= uncertainty;
			this.max += uncertainty;
		}
		else if (typeof uncertainty === "object"){
			this.min -= uncertainty.min;
			this.max += uncertainty.max;
		}
	}
	get pretty(){
		const q = Math.floor(Math.log10(this.x)/3);
		const i = CONSTANT.si_prefix_offset + 1 + q;
		const p = Math.pow(10, 3*q);
		if (i < 0){
			return `${1e-3*Math.round(1e3*this.x/p)}&middot;10<sup>${3*q}</sup> kg`;
		}
		else {
			const prefix = CONSTANT.si_prefix[i];
			return `${Math.round(this.x/p)} ${prefix}g`;
		}
	}
}

class MassDatum {
	/**
	 * @param {string} name
	 * @param {number|Mass} mass
	 * @param {string} source
	 */
	constructor(name, mass, source){
		/** @type {string} */
		this.name = name;
		/** @type {Mass} */
		this.mass = typeof mass === "number" ? new Mass(mass) : mass;
		/** @type {string} */
		this.source = source;
		if (!source){
			console.warn(`no source for |${name}|, mass |${mass}|`);
		}
	}
	elem(e2y){
		const e = document.createElement('span');
		e.classList.add('datum');
		const permalink = document.createElement('a');
		permalink.classList.add('permalink');
		permalink.href = `#${this.id}`;
		e.appendChild(permalink);
		e.innerHTML += `${this.mass.pretty}: ${this.name} <sup><a href="${this.source}">src</a></sup>`;
		e.style.top = `${100*e2y(Math.log10(this.mass.x))}%`;
		e.id = this.id;
		return e;
	}
	get id(){
		return this.name.replaceAll(' ', '_');
	}
}

const CONSTANT = {
	/** in kg */
	da: 1.66053906892e-27,
	/** in m/s https://physics.nist.gov/cgi-bin/cuu/Value?c */
	c: 299792458,
	/** in J */
	eV: 1.602176634e-19,
	/** in kg */
	lb: 0.45359237,
	get MeVc2(){
		return 1e6*this.eV/Math.pow(this.c, 2);
	},
	get oz(){
		return this.lb/16;
	},
	si_prefix: "qryzafpnμm kMGTPEZYRQ",
	si_prefix_offset: 10,
};

const OOM = {
	config: {
		vscale: 11,
	},
	data: [
		new MassDatum("Muon Neutrino (upper bound)", 0.17e-6*CONSTANT.MeVc2, "https://en.wikipedia.org/wiki/Neutrino#Flavor,_mass,_and_their_mixing"),
		new MassDatum("Electron Neutrino (upper bound)", 0.80e-6*CONSTANT.MeVc2, "https://en.wikipedia.org/wiki/Neutrino#Flavor,_mass,_and_their_mixing"),
		new MassDatum("Tau Neutrino (upper bound)", 18.2e-6*CONSTANT.MeVc2, "https://en.wikipedia.org/wiki/Neutrino#Flavor,_mass,_and_their_mixing"),
		new MassDatum("Electron", 9.1093837139e-31, "https://physics.nist.gov/cgi-bin/cuu/Value?me"),
		new MassDatum("Up quark", 2.2*CONSTANT.MeVc2),
		new MassDatum("Down quark", 4.7*CONSTANT.MeVc2),
		new MassDatum("Strange quark", 95*CONSTANT.MeVc2),
		new MassDatum("Muon", 1.883531627e-28, "https://physics.nist.gov/cgi-bin/cuu/Value?mmu"),
		new MassDatum("Proton", 1.67262192595e-27, "https://physics.nist.gov/cgi-bin/cuu/Value?mp"),
		new MassDatum("Neutron", 1.67492750056e-27, "https://physics.nist.gov/cgi-bin/cuu/Value?mn"),
		new MassDatum("Hydrogen-1 atom", 1.0078250322*CONSTANT.da, "https://www.ciaaw.org/hydrogen.htm"),
		new MassDatum("Charm quark", 1.27e3*CONSTANT.MeVc2),
		new MassDatum("Tauon", 3.16754e-27, "https://physics.nist.gov/cgi-bin/cuu/Value?mtau"),
		new MassDatum("Bottom quark", 4.18e3*CONSTANT.MeVc2),
		new MassDatum("Carbon-12 atom", 12*CONSTANT.da, "https://www.ciaaw.org/carbon.htm"),
		new MassDatum("Iron-56 atom", 55.934936*CONSTANT.da, "https://www.ciaaw.org/iron.htm"),
		new MassDatum("W Boson", 80.3692e3*CONSTANT.MeVc2),
		new MassDatum("Z Boson", 91.1880e3*CONSTANT.MeVc2),
		new MassDatum("Higgs Boson", 125.11e3*CONSTANT.MeVc2, "https://home.cern/news/news/physics/atlas-sets-record-precision-higgs-bosons-mass"),
		new MassDatum("Top quark", 172.76e3*CONSTANT.MeVc2),
		new MassDatum("Caffeine molecule", 194.194*CONSTANT.da),
		new MassDatum("Lead-206 atom", 205.974465*CONSTANT.da, "https://www.ciaaw.org/lead.htm"),
		new MassDatum("Uranium-238 atom", 238.05079*CONSTANT.da, "https://www.ciaaw.org/uranium.htm"),
		new MassDatum("Hemaglobin protein", 16e3*CONSTANT.da, "https://en.wikipedia.org/wiki/Hemoglobin#Diagnostic_uses"),
		new MassDatum("Ribosome (Eukaryotic)", 3.2e6*CONSTANT.da, "https://en.wikipedia.org/wiki/Eukaryotic_ribosome#Composition"),
		new MassDatum("Ounce", CONSTANT.oz),
		new MassDatum("Pound", CONSTANT.lb),
	],
	elem: {
		/** @returns {HTMLDivElement} */
		get main(){
			return document.getElementById('main');
		}
	},
	init(){
		const main = this.elem.main;
		main.style.height = `${this.config.vscale*100}vh`;
		const e2y = this.initScale();
		this.data.forEach(datum => main.appendChild(datum.elem(e2y)));
		console.info('oom.js initialized.');
	},
	initScale(){
		const range = this.range;
		const min_exponent = Math.floor(Math.log10(range.min));
		const max_exponent = Math.ceil(Math.log10(range.max));
		const e2y = e => (e - min_exponent)/(max_exponent-min_exponent);
		const main = this.elem.main;
		for (let exponent = min_exponent; exponent <= max_exponent; exponent++){
			const elem = document.createElement('span');
			elem.classList.add('scale');
			elem.innerHTML = `10<sup>${exponent}</sup> kg`;
			elem.style.top = `${100*e2y(exponent)}%`;
			main.appendChild(elem);
		}
		return e2y;
	},
	get range(){
		const sorted = this.data.map(x => x);
		sorted.sort((a, b) => a.mass.x - b.mass.x);
		const [min, max] = [sorted[0].mass.x, sorted[sorted.length-1].mass.x];
		return {min, max};
	},
};

OOM.init();