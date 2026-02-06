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
		if (i < 0 || CONSTANT.si_prefix.length <= i){
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
	density: {
		/** kg/m^3, at 25 C */
		water: 997.04702,
	},
	/** in m/s https://physics.nist.gov/cgi-bin/cuu/Value?c */
	c: 299792458,
	/** in J */
	eV: 1.602176634e-19,
	/** in kg */
	lb: 0.45359237,
	get long_ton(){
		return 2240*this.lb;
	},
	get MeVc2(){
		return 1e6*this.eV/Math.pow(this.c, 2);
	},
	get oz(){
		return this.lb/16;
	},
	si_prefix: "qryzafpnμm kMGTPEZYRQ",
	si_prefix_offset: 10,
	solar_mass: 1988475000e21,
};

const OOM = {
	config: {
		vscale: 13,
	},
	data: [
		// Subatomic particles
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
		new MassDatum("Charm quark", 1.27e3*CONSTANT.MeVc2),
		new MassDatum("Tauon", 3.16754e-27, "https://physics.nist.gov/cgi-bin/cuu/Value?mtau"),
		new MassDatum("Bottom quark", 4.18e3*CONSTANT.MeVc2),
		new MassDatum("W Boson", 80.3692e3*CONSTANT.MeVc2),
		new MassDatum("Z Boson", 91.1880e3*CONSTANT.MeVc2),
		new MassDatum("Higgs Boson", 125.11e3*CONSTANT.MeVc2, "https://home.cern/news/news/physics/atlas-sets-record-precision-higgs-bosons-mass"),
		new MassDatum("Top quark", 172.76e3*CONSTANT.MeVc2),
		// Atoms
		new MassDatum("Hydrogen-1 atom", 1.0078250322*CONSTANT.da, "https://www.ciaaw.org/hydrogen.htm"),
		new MassDatum("Carbon-12 atom", 12*CONSTANT.da, "https://www.ciaaw.org/carbon.htm"),
		new MassDatum("Iron-56 atom", 55.934936*CONSTANT.da, "https://www.ciaaw.org/iron.htm"),
		new MassDatum("Lead-206 atom", 205.974465*CONSTANT.da, "https://www.ciaaw.org/lead.htm"),
		new MassDatum("Uranium-238 atom", 238.05079*CONSTANT.da, "https://www.ciaaw.org/uranium.htm"),
		// Molecules
		new MassDatum("Caffeine molecule", 194.194*CONSTANT.da),
		// Proteins, Enzymes, ...
		new MassDatum("Hemaglobin protein", 16e3*CONSTANT.da, "https://en.wikipedia.org/wiki/Hemoglobin#Diagnostic_uses"),
		new MassDatum("Ribosome (Eukaryotic)", 3.2e6*CONSTANT.da, "https://en.wikipedia.org/wiki/Eukaryotic_ribosome#Composition"),
		// vaguely human-sized
		new MassDatum("Penny (US)", 2.5e-6, "https://hypertextbook.com/facts/2002/MillicentOkereke.shtml"),
		new MassDatum("Snowflake", 3e-6, "https://hypertextbook.com/facts/2001/JudyMoy.shtml"),
		new MassDatum("Golfball", 0.04593, "https://hypertextbook.com/facts/1999/ImranArif.shtml"),
		new MassDatum("Baseball", 0.145, "https://hypertextbook.com/facts/1999/ChristinaLee.shtml"),
		new MassDatum("Soccerball", 0.43, "https://hypertextbook.com/facts/2002/LouiseHuang.shtml"),
		new MassDatum("Grain of sand (medium)", 2e-9, "https://hypertextbook.com/facts/2003/MarinaTheodoris.shtml"),
		new MassDatum("Ounce", CONSTANT.oz),
		new MassDatum("Pound", CONSTANT.lb),
		// Organisms
		new MassDatum("Escherichia coli cell", 0.65e-18*CONSTANT.density.water, "https://en.wikipedia.org/wiki/Escherichia_coli#Type_and_morphology"),
		new MassDatum("Human", 70, "https://hypertextbook.com/facts/2003/AlexSchlessingerman.shtml"),
		new MassDatum("Elephant (African)", (7e3+3.6e3)/2, "https://hypertextbook.com/facts/2003/EugeneShnayder.shtml"),
		new MassDatum("Whale (Blue)", 150e3, "https://hypertextbook.com/facts/2003/MichaelShmukler.shtml"),
		// Vehicles
		new MassDatum("Car", 2e3, "https://hypertextbook.com/facts/2000/YanaZorina.shtml"),
		new MassDatum("Locomotive (EMD GP9)", 117.7e3, "https://en.wikipedia.org/wiki/EMD_GP9"),
		new MassDatum("Large aircraft (A380, MTOW)", 575e3, "https://en.wikipedia.org/wiki/Airbus_A380#Specifications"),
		new MassDatum("Aircraft carrier (Gerald R. Ford-class)", 100e3*CONSTANT.long_ton, "https://en.wikipedia.org/wiki/Gerald_R._Ford-class_aircraft_carrier"),
		// misc big things
		new MassDatum("Earth's biosphere", 1841e15, "https://hypertextbook.com/facts/2001/AmandaMeyer.shtml"),
		new MassDatum("Earth's atmosphere", 5e18, "https://hypertextbook.com/facts/1999/LouiseLiu.shtml"),
		new MassDatum("Earth's oceans", 1.4e21, "https://hypertextbook.com/facts/1998/AvijeetDut.shtml"),
		// Astro
		new MassDatum("Pallas", 2.04e20),
		new MassDatum("Vesta", 2.590271e20),
		new MassDatum("Ceres", 9.3839e20),
		new MassDatum("Pluto", 1.3025e22),
		new MassDatum("Moon", 7.346e22),
		new MassDatum("Mercury", 3.3011e23),
		new MassDatum("Mars", 6.4171e23),
		new MassDatum("Venus", 4.86731e24),
		new MassDatum("Earth", 5.9722e24),
		new MassDatum("Uranus", 8.68099e25),
		new MassDatum("Neptune", 1.024092e26),
		new MassDatum("Saturn", 5.68317e26),
		new MassDatum("Jupiter", 1.898125e27),
		new MassDatum("Sun", CONSTANT.solar_mass),
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