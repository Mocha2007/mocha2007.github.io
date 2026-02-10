/**
 * @param {number} x 
 * @param {number} n max digits
 * @returns string rep of that number, rounded to AT MOST n digits
 */
const round = (x, n) => {
	return x.toFixed(n || 0).replace(/\.?0+$/, '');
}

class Dimension {
	constructor(unit, si_pref_off, scale_factor, x, uncertainty){
		this.unit = unit;
		this.si_pref_off = si_pref_off;
		this.scale_factor = scale_factor;
		// if x is a single number, we interpret it as the mean/reference value
		// otherwise, it must be a range with {min} and {max}
		if (typeof x === "number") {
			/** @type {number} */
			this.min = this.max = this.x = x;
		}
		else {
			this.min = x.min;
			this.max = x.max;
			this.x = x.x || (this.min + this.max)/2;
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
	error_elem(p){
		if (this.min !== this.x || this.max !== this.x){
			const plus = round((this.max - this.x)/p, 3);
			const minus = round((this.x - this.min)/p, 3);
			if (plus !== minus){
				return `<span class='errors'>+${plus}<br>-${minus}</span>`;
			}
			else {
				return ` &plusmn; ${plus}`;
			}
		}
		else {
			return ``;
		}
	}
	get pretty(){
		const q = Math.floor(Math.log10(this.x)/3);
		const i = CONSTANT.si_prefix_offset + this.si_pref_off + q;
		const p = Math.pow(10, 3*q);
		const error_elem = this.error_elem(p);
		if (i < 0 || CONSTANT.si_prefix.length <= i){
			return `${round(this.x/p, 3)}${error_elem}&middot;10<sup>${3*q}</sup> ${CONSTANT.si_prefix[CONSTANT.si_prefix_offset+this.si_pref_off]}${this.unit}`;
		}
		else {
			const prefix = CONSTANT.si_prefix[i];
			return `${round(this.x/p, 3)}${error_elem} ${prefix}${this.unit}`;
		}
	}
}

class Mass extends Dimension {
	constructor(x, uncertainty){
		super("g", 1, 1, x, uncertainty);
	}
}

class Energy extends Dimension {
	constructor(x, uncertainty){
		super("J", 0, Math.pow(CONSTANT.c, -2), x, uncertainty);
	}
}

class Time extends Dimension {
	constructor(x, uncertainty){
		super("s", 0, Math.pow(CONSTANT.c, 3)/CONSTANT.G, x, uncertainty);
	}
}

class Length extends Dimension {
	constructor(x, uncertainty){
		super("m", 0, Math.pow(CONSTANT.c, 2)/CONSTANT.G, x, uncertainty);
	}
}

class Temperature extends Dimension {
	constructor(x, uncertainty){
		super("K", 0, CONSTANT.kB/Math.pow(CONSTANT.c, 2), x, uncertainty);
	}
}

class Datum {
	/**
	 * @param {string} name
	 * @param {number|Dimension} amt
	 * @param {string?} source
	 * @param {Category[]?} categories
	 */
	constructor(dimension, name, amt, source, categories){
		this.dimension = dimension;
		/** @type {string} */
		this.name = name;
		/** @type {Mass} */
		this.mass = typeof amt === "number" ? new dimension(amt) : amt;
		/** @type {string} */
		this.source = source;
		if (!source){
			console.warn(`no source for |${name}|, mass |${amt}|`);
		}
		/** @type {Category[]} */
		this.categories = categories || [];
		/** @type {HTMLSpanElement} */
		this.elem_cache;
	}
	elem(e2y){
		const e = document.createElement('span');
		this.elem_cache = e;
		e.classList.add('datum');
		e.classList.add(this.dimension === Mass ? 'larr' : 'rarr');
		const permalink = document.createElement('a');
		permalink.classList.add('permalink');
		permalink.href = `#${this.id}`;
		const amount = document.createElement('span');
		amount.classList.add('amount');
		amount.innerHTML = this.mass.pretty;
		const src = document.createElement('sup');
		src.innerHTML = `<a href="${this.source}">src</a>`;
		e.style.top = `${100*e2y(Math.log10(this.mass.x*this.mass.scale_factor))}%`;
		e.id = this.id;
		// ok now we combine everything depending on arrow direction
		if (this.dimension === Mass) {
			e.appendChild(permalink);
			e.appendChild(amount);
			e.innerHTML += `: ${this.name}`;
			if (this.source){
				e.appendChild(src);
			}
		}
		else {
			if (this.source){
				e.appendChild(src);
			}
			e.innerHTML += `${this.name}: `;
			e.appendChild(amount);
			e.appendChild(permalink);
		}
		return e;
	}
	get id(){
		return this.name.replaceAll(' ', '_');
	}
}

class MassDatum extends Datum {
	/**
	 * @param {string} name
	 * @param {number|Mass} amt
	 * @param {string?} source
	 * @param {Category[]?} categories
	 */
	constructor(name, amt, source, categories){
		super(Mass, name, amt, source, categories);
	}
}

class EnergyDatum extends Datum {
	/**
	 * @param {string} name
	 * @param {number|Energy} amt
	 * @param {string?} source
	 * @param {Category[]?} categories
	 */
	constructor(name, amt, source, categories){
		super(Energy, name, amt, source, categories);
	}
}

class TimeDatum extends Datum {
	/**
	 * @param {string} name
	 * @param {number|Time} amt
	 * @param {string?} source
	 * @param {Category[]?} categories
	 */
	constructor(name, amt, source, categories){
		super(Time, name, amt, source, categories);
	}
}

class LengthDatum extends Datum {
	/**
	 * @param {string} name
	 * @param {number|Length} amt
	 * @param {string?} source
	 * @param {Category[]?} categories
	 */
	constructor(name, amt, source, categories){
		super(Length, name, amt, source, categories);
	}
}

class TemperatureDatum extends Datum {
	/**
	 * @param {string} name
	 * @param {number|Temperature} amt
	 * @param {string?} source
	 * @param {Category[]?} categories
	 */
	constructor(name, amt, source, categories){
		super(Temperature, name, amt, source, categories);
	}
}

class MassRange {
	/**
	 * @param {string} name 
	 * @param {Mass} min 
	 * @param {Mass} max 
	 * @param {string} color 
	 */
	constructor(name, min, max, color){
		/** @type {string} */
		this.name = name;
		/** @type {Mass} */
		this.min = typeof min === "number" ? new Mass(min) : min;
		/** @type {Mass} */
		this.max = typeof max === "number" ? new Mass(max) : max;
		/** @type {string} */
		this.color = color;
	}
	elem(e2y, i, a){
		const e = document.createElement('div');
		e.classList.add('range');
		const [bottom, top] = [100*e2y(Math.log10(this.min.min)), 100*e2y(Math.log10(this.max.max))];
		e.style.top = `${bottom}%`;
		e.style.lineHeight = e.style.height = `${top-bottom}%`;
		e.style.backgroundColor = this.color;
		e.style.left = `${50+50/3*(i%3)}vw`;
		e.title = this.name;
		const inner = document.createElement('span');
		inner.innerHTML = this.name.replaceAll(' ', '&nbsp;');
		e.appendChild(inner);
		return e;
	}
}

class Category {
	static COIN = "Coin";
	static DRV = "DRV";
	static HYPOTHETICAL = "Hypothetical";
	static FICTIONAL = "Fictional";
	static MINORPLANET = "Minor Planet"; // (or comet)
	static UNIT = "Unit of Measurement";
}

const CONSTANT = {
	/** in Pa */
	atm: 101325,
	/**
	 * total mass of atmosphere
	 * @param {number} r Planet's radius (m)
	 * @param {number} m Planet's mass (kg)
	 * @param {number} sp Surface pressure (Pa)
	 */
	atmosphere_mass(r, m, sp){
		// see mochalib mochaastro-body.py
		const sa = 4*Math.PI*Math.pow(r, 2);
		const g = this.G*m/Math.pow(r, 2);
		return sp * sa / g;
	},
	/** in mol^-1 */
	avogadro: 6.02214076e23,
	/** in kg, DNA base pair */
	get bp_dna(){
		return 618*this.da;
	},
	/** in kg, RNA base pair */
	get bp_rna(){
		return 643*this.da;
	},
	/** in kg */
	da: 1.66053906892e-27,
	density: {
		asteroid: {
			/** https://en.wikipedia.org/wiki/C-type_asteroid */
			c: 1700,
			/** https://en.wikipedia.org/wiki/64_Angelina */
			e: 2000,
			/** https://en.wikipedia.org/wiki/S-type_asteroid#Characteristics */
			s: 3000,
		},
		/** in kg/m^3, avg. https://en.wikipedia.org/wiki/Comet */
		comet: 600,
		/** in kg/m^3 https://www.engineeringtoolbox.com/concrete-properties-d_1223.html */
		concrete: (2240+2400)/2,
		crust: {
			/** kg/m^3 https://en.wikipedia.org/wiki/Earth%27s_crust#Composition */
			continental: 2835,
		},
		ice: 916.75,
		iron: 7874,
		/** in kg/m^3 https://en.wikipedia.org/wiki/List_of_largest_monoliths#Density */
		rock: 2500,
		/** kg/m^3, at 25 C */
		water: 997.04702,
		water50c: 987.5,
	},
	/** in m/s https://physics.nist.gov/cgi-bin/cuu/Value?c */
	c: 299792458,
	c2k: 273.15,
	/** in s */
	get d(){
		return this.h*24;
	},
	/** in kg */
	get dr(){
		return this.oz/16;
	},
	/** in kg */
	earth_mass: 5.9722e24,
	/** in m, mean */
	earth_radius: 6371e3,
	/** in J */
	eV: 1.602176634e-19,
	/** in m */
	ft: 0.3048,
	/** m^3/(kg*s^2) */
	G: 6.67430e-11,
	/** in kg */
	get gr(){
		return this.lb/7000;
	},
	/** in s */
	get h(){
		return this.min*60;
	},
	/** in kg */
	jupiter_mass: 1.898125e27,
	/** in J/K */
	kB: 1.380649e-23,
	/** in m/s (knot) */
	get kt(){
		return this.nmi/this.h;
	},
	/** in kg */
	lb: 0.45359237,
	/** in kg */
	get long_ton(){
		return 2240*this.lb;
	},
	get ly(){
		return this.c*this.yr;
	},
	/** in kg */
	get MeVc2(){
		return 1e6*this.eV/Math.pow(this.c, 2);
	},
	/** in s */
	min: 60,
	/** in m https://en.wikipedia.org/wiki/Nautical_mile */
	nmi: 1852,
	/** in kg */
	get oz(){
		return this.lb/16;
	},
	/** in J*s */
	planck: 6.62607015e-34,
	/** in kg */
	get short_ton(){
		return 2000*this.lb;
	},
	si_prefix: "qryzafpnμm kMGTPEZYRQ",
	si_prefix_offset: 10,
	/** in kg */
	solar_mass: 1988475000e21,
	thickness: {
		/** https://en.wikipedia.org/wiki/Earth%27s_crust#Composition */
		crust: {
			continental: (25e3+70e3)/2,
			oceanic: (5e3+10e3)/2,
		}
	},
	/** in J: tons of TNT equivalent */
	tTNT: 4.184e9,
	volume: {
		/** a, b, c are major axes (diameters) */
		ellipsoid(a, b, c){
			b ||= a;
			c ||= b;
			// https://en.wikipedia.org/wiki/Ellipsoid#Volume
			return Math.PI/6 * a * b * c;
		}
	},
	/** in s */
	get yr(){
		return this.d*365.2425;
	},
};

const OOM = {
	get active_categories(){
		return Object.keys(Category).filter(c => document.getElementById(`cat_${c}`).checked);
	},
	config: {
		default_categories: [
			Category.COIN,
			Category.MINORPLANET,
		],
		/** @type {string?} */
		shiftTo: null,
		shifted: false,
		get vscale(){
			return this._vscale;
		},
		set vscale(x){
			this._vscale = x;
			OOM.elem.tabs.forEach(elem => elem.style.height = `${x*100}vh`);
		},
		_vscale: 29,
	},
	data: [
		// Subatomic particles
		new MassDatum("Muon Neutrino (upper bound)", 0.17e-6*CONSTANT.MeVc2, "https://en.wikipedia.org/wiki/Neutrino#Flavor,_mass,_and_their_mixing"),
		new MassDatum("Electron Neutrino (upper bound)", 0.80e-6*CONSTANT.MeVc2, "https://en.wikipedia.org/wiki/Neutrino#Flavor,_mass,_and_their_mixing"),
		new MassDatum("Tau Neutrino (upper bound)", 18.2e-6*CONSTANT.MeVc2, "https://en.wikipedia.org/wiki/Neutrino#Flavor,_mass,_and_their_mixing"),
		new MassDatum("Electron", 9.1093837139e-31, "https://physics.nist.gov/cgi-bin/cuu/Value?me"),
		new MassDatum("Positronium", 1.022*CONSTANT.MeVc2),
		new MassDatum("Up quark", 2.2*CONSTANT.MeVc2),
		new MassDatum("Down quark", 4.7*CONSTANT.MeVc2),
		new MassDatum("Strange quark", 95*CONSTANT.MeVc2),
		new MassDatum("Muon", 1.883531627e-28, "https://physics.nist.gov/cgi-bin/cuu/Value?mmu"),
		new MassDatum("Pion", 134.9768*CONSTANT.MeVc2), // pi0
		new MassDatum("Kaon", 497.611*CONSTANT.MeVc2),
		new MassDatum("Eta meson", 547.862*CONSTANT.MeVc2),
		new MassDatum("Rho meson", 770*CONSTANT.MeVc2),
		// new MassDatum("Phi meson", 1019.461*CONSTANT.MeVc2),
		// new MassDatum("Omega meson", 782.66*CONSTANT.MeVc2),
		// new MassDatum("Eta prime meson", 957.78*CONSTANT.MeVc2),
		// new MassDatum("Proton", 1.67262192595e-27, "https://physics.nist.gov/cgi-bin/cuu/Value?mp"),
		// new MassDatum("Neutron", 1.67492750056e-27, "https://physics.nist.gov/cgi-bin/cuu/Value?mn"),
		new MassDatum("Charm quark", 1.27e3*CONSTANT.MeVc2),
		new MassDatum("Tauon", 3.16754e-27, "https://physics.nist.gov/cgi-bin/cuu/Value?mtau"),
		new MassDatum("Bottom quark", 4.18e3*CONSTANT.MeVc2),
		// new MassDatum("Bottom eta meson", 9388.9*CONSTANT.MeVc2),
		// new MassDatum("Upsilon Boson", 9460.30*CONSTANT.MeVc2),
		new MassDatum("W Boson", 80.3692e3*CONSTANT.MeVc2),
		new MassDatum("Z Boson", 91.1880e3*CONSTANT.MeVc2),
		new MassDatum("WIMP", 100e3*CONSTANT.MeVc2, null, [Category.HYPOTHETICAL]),
		new MassDatum("Higgs Boson", 125.11e3*CONSTANT.MeVc2, "https://home.cern/news/news/physics/atlas-sets-record-precision-higgs-bosons-mass"),
		new MassDatum("Top quark", 172.76e3*CONSTANT.MeVc2),
		// Atoms
		new MassDatum("Hydrogen-1 atom", 1.0078250322*CONSTANT.da, "https://www.ciaaw.org/hydrogen.htm"),
		new MassDatum("Deuterium atom", 2.0141017781*CONSTANT.da, "https://www.ciaaw.org/hydrogen.htm"),
		new MassDatum("Tritium atom", 3.01604928*CONSTANT.da),
		new MassDatum("Helium-4 atom", 6.6446573450e-27, "https://physics.nist.gov/cgi-bin/cuu/Value?mal"),
		new MassDatum("Lithium-7 atom", 7.01600344*CONSTANT.da, "https://www.ciaaw.org/lithium.htm"),
		new MassDatum("Beryllium-9 atom", 9.0121831*CONSTANT.da, "https://www.ciaaw.org/beryllium.htm"),
		new MassDatum("Boron-11 atom", 11.00930517*CONSTANT.da, "https://www.ciaaw.org/boron.htm"),
		new MassDatum("Carbon-12 atom", 12*CONSTANT.da, "https://www.ciaaw.org/carbon.htm"),
		new MassDatum("Nitrogen-14 atom", 14.003074004*CONSTANT.da, "https://www.ciaaw.org/nitrogen.htm"),
		new MassDatum("Oxygen-16 atom", 15.994914619*CONSTANT.da, "https://www.ciaaw.org/oxygen.htm"),
		new MassDatum("Sodium-23 atom", 22.98976928*CONSTANT.da, "https://www.ciaaw.org/sodium.htm"),
		new MassDatum("Aluminum-27 atom", 26.9815384*CONSTANT.da, "https://www.ciaaw.org/aluminium.htm"),
		new MassDatum("Sulfur-32 atom", 31.972071174*CONSTANT.da, "https://www.ciaaw.org/sulfur.htm"),
		new MassDatum("Argon-40 atom", 39.96238312*CONSTANT.da, "https://www.ciaaw.org/argon.htm"),
		new MassDatum("Iron-56 atom", 55.934936*CONSTANT.da, "https://www.ciaaw.org/iron.htm"),
		new MassDatum("Copper-63 atom", 62.929597*CONSTANT.da, "https://www.ciaaw.org/copper.htm"),
		new MassDatum("Silver-107 atom", 106.90509*CONSTANT.da, "https://www.ciaaw.org/silver.htm"),
		// new MassDatum("Gold-197 atom", 196.966570*CONSTANT.da, "https://www.ciaaw.org/gold.htm"),
		new MassDatum("Lead-208 atom", 207.976652*CONSTANT.da, "https://www.ciaaw.org/lead.htm"),
		new MassDatum("Uranium-238 atom", 238.05079*CONSTANT.da, "https://www.ciaaw.org/uranium.htm"),
		// Molecules
		new MassDatum("Water", 18.01528*CONSTANT.da),
		new MassDatum("Ethanol", 46.069*CONSTANT.da),
		new MassDatum("Glycine", 75.06714*CONSTANT.da),
		new MassDatum("Niacin (Vitamin B3)", 123.111*CONSTANT.da),
		// new MassDatum("Ascorbic acid (Vitamin C)", 176.124*CONSTANT.da),
		// new MassDatum("Glucose", 180.156*CONSTANT.da),
		// new MassDatum("Caffeine", 194.194*CONSTANT.da),
		// new MassDatum("Pyrrolysine", 255.31 *CONSTANT.da),
		new MassDatum("Estradiol", 272.38*CONSTANT.da),
		// new MassDatum("Psilocybin", 284.252*CONSTANT.da),
		new MassDatum("THC", 314.469*CONSTANT.da),
		// new MassDatum("LSD", 323.440*CONSTANT.da),
		new MassDatum("Ergocalciferol (Vitamin D2)", 396.659*CONSTANT.da),
		new MassDatum("Folate (Vitamin B9)", 441.404*CONSTANT.da),
		new MassDatum("ATP", 507.18*CONSTANT.da),
		new MassDatum("β-Carotene (Vitamin A)", 536.888*CONSTANT.da),
		new MassDatum("NADP", 744.4*CONSTANT.da),
		new MassDatum("Chlorophyll a", 893.509*CONSTANT.da),
		new MassDatum("Cobalamin (Vitamin B12)", 1355.388*CONSTANT.da),
		new MassDatum("Nanocar", 5632.769*CONSTANT.da),
		// Proteins, Enzymes, ...
		new MassDatum("Humanin", 2687.27*CONSTANT.da),
		new MassDatum("Insulin", 5808*CONSTANT.da, "https://en.wikipedia.org/wiki/Insulin"),
		new MassDatum("Ubiquitin", 8.6e3*CONSTANT.da, "https://en.wikipedia.org/wiki/Ubiquitin"),
		new MassDatum("Hemoglobin", 16e3*CONSTANT.da, "https://en.wikipedia.org/wiki/Hemoglobin#Diagnostic_uses"),
		new MassDatum("Lectin", 71e3*CONSTANT.da, "https://bionumbers.hms.harvard.edu/bionumber.aspx?id=104340&ver=2&trm=mass&org="),
		new MassDatum("tRNA", (76+90)/2*CONSTANT.bp_rna),
		new MassDatum("Chaperonin", 60e3*CONSTANT.da, "https://en.wikipedia.org/wiki/Chaperonin"),
		new MassDatum("Hemerythrin", 8*13.5e3*CONSTANT.da, "https://en.wikipedia.org/wiki/Hemerythrin#Quaternary_structure_and_cooperativity"),
		new MassDatum("Immunoglobulin G", 150e3*CONSTANT.da, "https://en.wikipedia.org/wiki/Immunoglobulin_G#Structure"),
		new MassDatum("Calcium channel (L-type)", ((170e3+240e3)/2 + 150e3 + (17e3+25e3)/2 + (50e3+78e3)/2 + 32e3)*CONSTANT.da, "https://en.wikipedia.org/wiki/L-type_calcium_channel#Structure"),
		// new MassDatum("Dynein", 1.5e6*CONSTANT.da),
		new MassDatum("Ribosome (Bacterial)", 2.5e6*CONSTANT.da, "https://bionumbers.hms.harvard.edu/bionumber.aspx?id=106864&ver=3&trm=mass&org="),
		new MassDatum("Ribosome (Eukaryotic)", 3.2e6*CONSTANT.da, "https://en.wikipedia.org/wiki/Eukaryotic_ribosome#Composition"),
		// new MassDatum("Erythrocruorin", 3600e3*CONSTANT.da, "https://en.wikipedia.org/wiki/Erythrocruorin"),
		new MassDatum("Hemocyanin (Japanese Flying Squid)", 3.8e6*CONSTANT.da, "https://en.wikipedia.org/wiki/Hemocyanin#Structure_and_mechanism"),
		new MassDatum("Titin", 4200e3*CONSTANT.da, "https://en.wikipedia.org/wiki/Titin"),
		new MassDatum("Chloroplast genome", 105e6*CONSTANT.da, "https://en.wikipedia.org/wiki/Chloroplast#Molecular_structure"),
		new MassDatum("Escherichia coli genome", 4.6e6*CONSTANT.bp_dna, "https://en.wikipedia.org/wiki/Escherichia_coli#Genomics"),
		new MassDatum("Chromosome (Human 21)", 46944323*CONSTANT.bp_dna),
		new MassDatum("Lysosome (Animal)", new Mass({x:CONSTANT.volume.ellipsoid(300e-9)*CONSTANT.density.water,min:CONSTANT.volume.ellipsoid(100e-9)*CONSTANT.density.water,max:CONSTANT.volume.ellipsoid(500e-9)*CONSTANT.density.water}), "https://bionumbers.hms.harvard.edu/bionumber.aspx?id=117093&ver=2&trm=lysosome&org="),
		new MassDatum("Chromosome (Human X)", 154913754*CONSTANT.bp_dna),
		new MassDatum("Chromosome (Human 1)", 248387328*CONSTANT.bp_dna),
		new MassDatum("Mitochondrion", 1.0754507267897768e-17*CONSTANT.density.water), // "Mitochondria are commonly between 0.75 and 3 μm2 in cross section,"
		new MassDatum("Chloroplast", 20e-18*CONSTANT.density.water, "https://en.wikipedia.org/wiki/Chloroplast#Structure"), // "Corn seedling chloroplasts are ≈20 μm3 in volume"
		new MassDatum("Nucleus (Human)", CONSTANT.volume.ellipsoid(6e-6)*CONSTANT.density.water, "https://en.wikipedia.org/wiki/Cell_nucleus#Nuclear_structures_and_landmarks"), // "In human cells, the diameter of the nucleus is approximately six micrometres (μm)"
		// Viruses
		new MassDatum("Potato spindle tuber viroid", 359*CONSTANT.bp_rna, "https://en.wikipedia.org/wiki/Potato_spindle_tuber_viroid#Primary_and_secondary_structure_of_PSTVd"),
		new MassDatum("Porcine circovirus", CONSTANT.volume.ellipsoid(6e-6) * CONSTANT.density.water, "https://en.wikipedia.org/wiki/SARS-CoV-2#Virus_structure"),
		new MassDatum("Rhinovirus Genome", new Mass({min: 7200*CONSTANT.bp_rna, max: 8500*CONSTANT.bp_rna}), "https://en.wikipedia.org/wiki/Rhinovirus#Structure"),
		new MassDatum("Adenovirus Genome", new Mass({min: 35e3*CONSTANT.bp_rna, max: 36e3*CONSTANT.bp_rna}), "https://en.wikipedia.org/wiki/Mastadenovirus#Structure"),
		new MassDatum("COVID-19 virus", CONSTANT.volume.ellipsoid((60e-9+140e-9)/2) * CONSTANT.density.water, "https://en.wikipedia.org/wiki/SARS-CoV-2#Virus_structure"),
		new MassDatum("Megaklothovirus horridgei", 3.9e-6 * Math.PI*Math.pow(500e-9/2, 2) * CONSTANT.density.water, "https://en.wikipedia.org/wiki/Megaklothovirus_horridgei"),
		// Pollen
		new MassDatum("Forget-me-not pollen", new Mass({min:CONSTANT.volume.ellipsoid(2.5e-6) * CONSTANT.density.water, max:CONSTANT.volume.ellipsoid(5e-6) * CONSTANT.density.water}), "https://en.wikipedia.org/wiki/Pollen#Structure_and_formation"),
		new MassDatum("Grass pollen", new Mass({min:CONSTANT.volume.ellipsoid(20e-6) * CONSTANT.density.water, max:CONSTANT.volume.ellipsoid(25e-6) * CONSTANT.density.water}), "https://en.wikipedia.org/wiki/Pollen#Structure_and_formation"),
		new MassDatum("Maize pollen", new Mass({min:CONSTANT.volume.ellipsoid(90e-6) * CONSTANT.density.water, max:CONSTANT.volume.ellipsoid(100e-6) * CONSTANT.density.water}), "https://en.wikipedia.org/wiki/Pollen#Structure_and_formation"),
		new MassDatum("Pine pollen", new Mass({min:CONSTANT.volume.ellipsoid(50e-6) * CONSTANT.density.water, max:CONSTANT.volume.ellipsoid(150e-6) * CONSTANT.density.water}), "https://www.unlv.edu/sites/default/files/page_files/27/PublicHealth_Lied-PollenLecture2019.pdf"),
		new MassDatum("Mulberry pollen", new Mass({min:CONSTANT.volume.ellipsoid(14e-6) * CONSTANT.density.water, max:CONSTANT.volume.ellipsoid(22e-6) * CONSTANT.density.water}), "https://www.unlv.edu/sites/default/files/page_files/27/PublicHealth_Lied-PollenLecture2019.pdf"),
		new MassDatum("Ash pollen", new Mass({min:CONSTANT.volume.ellipsoid(19e-6) * CONSTANT.density.water, max:CONSTANT.volume.ellipsoid(33e-6) * CONSTANT.density.water}), "https://www.unlv.edu/sites/default/files/page_files/27/PublicHealth_Lied-PollenLecture2019.pdf"),
		new MassDatum("Ragweed pollen", new Mass({min:CONSTANT.volume.ellipsoid(15e-6) * CONSTANT.density.water, max:CONSTANT.volume.ellipsoid(28e-6) * CONSTANT.density.water}), "https://www.unlv.edu/sites/default/files/page_files/27/PublicHealth_Lied-PollenLecture2019.pdf"),
		// Body parts
		new MassDatum("Heart (Human)", 0.3, "https://en.wikipedia.org/wiki/Heart#Location_and_shape"),
		new MassDatum("Liver (Human)", 1.5, "https://en.wikipedia.org/wiki/Liver#Structure"),
		// DRV
		new MassDatum("Water DRV", 2.25e-3*CONSTANT.density.water, "https://en.wikipedia.org/wiki/Dietary_Reference_Value", [Category.DRV]),
		new MassDatum("Carbohydrate DRV", 2000*0.5/4 * 1e-3, "https://en.wikipedia.org/wiki/Dietary_Reference_Value", [Category.DRV]),
		new MassDatum("Protein DRV", 55e-3, "https://en.wikipedia.org/wiki/Dietary_Reference_Value", [Category.DRV]),
		new MassDatum("Salt DRV", 6e-3, "https://en.wikipedia.org/wiki/Dietary_Reference_Value", [Category.DRV]),
		new MassDatum("Vitamin C DRV", 40e-6, "https://en.wikipedia.org/wiki/Dietary_Reference_Value", [Category.DRV]),
		new MassDatum("Vitamin E DRV", 15e-6, "https://en.wikipedia.org/wiki/Vitamin_E#Dietary_recommendations", [Category.DRV]),
		new MassDatum("Iron DRV", 14.8e-6, "https://en.wikipedia.org/wiki/Dietary_Reference_Value", [Category.DRV]),
		new MassDatum("Zinc DRV", 9.5e-6, "https://en.wikipedia.org/wiki/Dietary_Reference_Value", [Category.DRV]),
		new MassDatum("Vitamin A DRV", 700e-9, "https://en.wikipedia.org/wiki/Dietary_Reference_Value", [Category.DRV]),
		new MassDatum("Folate DRV", 200e-9, "https://en.wikipedia.org/wiki/Dietary_Reference_Value", [Category.DRV]),
		new MassDatum("Vitamin E DRV", 115e-9, "https://en.wikipedia.org/wiki/Vitamin_K#Dietary_recommendations", [Category.DRV]),
		new MassDatum("Vitamin D DRV", 15e-9, "https://en.wikipedia.org/wiki/Vitamin_D#European_Union", [Category.DRV]),
		// sand/gravel/etc
		// using "number of grains per mg"
		new MassDatum("Grain of clay (fine)", 1e-6/86716444.444444444, "https://upload.wikimedia.org/wikipedia/commons/a/a0/Wentworth_scale.png"),
		new MassDatum("Grain of clay (coarse)", 1e-6/11902984.948002813, "https://upload.wikimedia.org/wikipedia/commons/a/a0/Wentworth_scale.png"),
		new MassDatum("Grain of silt (fine)", 1e-6/224266.666666667, "https://upload.wikimedia.org/wikipedia/commons/a/a0/Wentworth_scale.png"),
		new MassDatum("Grain of silt (medium)", 1e-6/30783.581762076, "https://upload.wikimedia.org/wikipedia/commons/a/a0/Wentworth_scale.png"),
		new MassDatum("Grain of silt (coarse)", 1e-6/4225.455883334, "https://upload.wikimedia.org/wikipedia/commons/a/a0/Wentworth_scale.png"),
		new MassDatum("Grain of sand (fine)", 1e-6/91, "https://upload.wikimedia.org/wikipedia/commons/a/a0/Wentworth_scale.png"),
		new MassDatum("Grain of sand (medium)", 1e-6/13, "https://upload.wikimedia.org/wikipedia/commons/a/a0/Wentworth_scale.png"),
		new MassDatum("Grain of sand (coarse)", 1e-6/1.5, "https://upload.wikimedia.org/wikipedia/commons/a/a0/Wentworth_scale.png"),
		new MassDatum("Gravel (medium)", 1/532.487, "https://upload.wikimedia.org/wikipedia/commons/a/a0/Wentworth_scale.png"),
		// Batteries
		new MassDatum("AAA Battery (Alkaline)", 0.0115, "https://en.wikipedia.org/wiki/AAA_battery"),
		new MassDatum("AA Battery (Alkaline)", 0.023, "https://en.wikipedia.org/wiki/AA_battery#Dimensions"),
		// AA battery dimensions implies a density of ~2946 kg/m^3
		new MassDatum("C Battery (Alkaline)", 2946*0.05*Math.PI*Math.pow(0.0262/2, 2), "https://en.wikipedia.org/wiki/C_battery#Properties"),
		new MassDatum("D Battery (Alkaline)", 2946*0.0615*Math.PI*Math.pow(0.0332/2, 2), "https://en.wikipedia.org/wiki/C_battery#Properties"),
		// fruits/seeds
		new MassDatum("Sesame seed", CONSTANT.oz/1e3, "https://corn.agronomy.wisc.edu/Crops/Sesame.aspx"),
		new MassDatum("Apricot kernel", 600e-6, "https://en.wikipedia.org/wiki/Apricot#Toxicity"),
		new MassDatum("Grain (wheat)", 50e-6, "https://en.wikipedia.org/wiki/Grain_(unit)#History"),
		new MassDatum("Grain (rice, medium-grain)", 0.4e-2 * Math.PI*Math.pow(0.25e-2, 2) * CONSTANT.density.water, "https://scaleofuniverse.com/en/universe/grain-of-rice"),
		new MassDatum("Coffee Bean (Ethiopian Arabica)", 0.155e-3, "https://www.academia.edu/92088616/Physical_and_Mechanical_Properties_of_Coffee_Cherries_and_Beans_in_Africa_Review_and_the_State_of_Arts"),
		new MassDatum("Pea", new Mass({min:100e-6,max:360e-6}), "https://en.wikipedia.org/wiki/Pea"),
		new MassDatum("Blueberry", 0.3e-3, "https://en.wikipedia.org/wiki/Blueberry#Description"),
		new MassDatum("Tic Tac", 16.5e-3/38, "https://en.wikipedia.org/wiki/Tic_Tac#Ingredients"),
		new MassDatum("Raspberry", new Mass({min:3e-3,max:5e-3}), "https://en.wikipedia.org/wiki/Raspberry#Description"),
		new MassDatum("Grape", 1.6e-3, "http://www.hort.cornell.edu/reisch/grapegenetics/bulletin/table/tabletext3.html"),
		new MassDatum("Peanut (Pod, Virginia)", 1.8e-3, "https://precisionag.sites.clemson.edu/Calculators/EstimatePeanutYield/"),
		new MassDatum("Walnut", CONSTANT.oz/7, "https://www.urmc.rochester.edu/encyclopedia/content?contenttypeid=76&contentid=12155-6"),
		new MassDatum("Kumquat", new Mass({min:11e-3,max:20e-3}), "https://en.wikipedia.org/wiki/Kumquat#Varieties"),
		new MassDatum("Apple", 0.25, "https://diabetesteachingcenter.ucsf.edu/living-diabetes/diet-nutrition/understanding-carbohydrates/weighing-food"),
		new MassDatum("Cabbage", new Mass({min:0.5,max:1}), "https://en.wikipedia.org/wiki/Cabbage"),
		new MassDatum("Durian", new Mass({min:1,max:3}), "https://en.wikipedia.org/wiki/Durian"),
		// coins
		new MassDatum("Dime (US)", 2.268e-3, null, [Category.COIN]),
		new MassDatum("Penny (US)", 2.5e-3, "https://hypertextbook.com/facts/2002/MillicentOkereke.shtml", [Category.COIN]),
		new MassDatum("Nickel (US)", 5e-3, null, [Category.COIN]),
		new MassDatum("Ducat", 3.5e-3, null, [Category.COIN]),
		new MassDatum("Quarter (US)", 5.67e-3, null, [Category.COIN]),
		new MassDatum("Dollar coin (US)", 8.100e-3, null, [Category.COIN]),
		new MassDatum("Half-Dollar (US)", 11.340e-3, null, [Category.COIN]),
		// units
		new MassDatum("Planck mass", 2.176434e-8, "https://en.wikipedia.org/wiki/Planck_units", [Category.UNIT]),
		new MassDatum("Dalton (unit)", CONSTANT.da, null, [Category.UNIT]),
		new MassDatum("RNA Base Pair (unit)", CONSTANT.bp_rna, null, [Category.UNIT]),
		new MassDatum("Grain (unit)", CONSTANT.gr, null, [Category.UNIT]),
		new MassDatum("Carat (unit)", 200e-6, null, [Category.UNIT]),
		new MassDatum("Scruple (unit)", CONSTANT.gr*20, null, [Category.UNIT]),
		new MassDatum("Dram (unit)", CONSTANT.dr, null, [Category.UNIT]),
		new MassDatum("Pennyweight (unit)", CONSTANT.gr*24, null, [Category.UNIT]),
		new MassDatum("Ounce (unit)", CONSTANT.oz, null, [Category.UNIT]),
		new MassDatum("Pound (unit)", CONSTANT.lb, null, [Category.UNIT]),
		new MassDatum("Stone (unit)", 14*CONSTANT.lb, null, [Category.UNIT]),
		new MassDatum("Quarter (unit)", 28*CONSTANT.lb, null, [Category.UNIT]),
		new MassDatum("Slug (unit)", CONSTANT.lb*9.80665/CONSTANT.ft, null, [Category.UNIT]),
		new MassDatum("Firkin (unit)", 90*CONSTANT.lb, null, [Category.UNIT]),
		new MassDatum("Hundredweight (unit)", 112*CONSTANT.lb, null, [Category.UNIT]),
		new MassDatum("Short ton (unit)", 2000*CONSTANT.lb, null, [Category.UNIT]),
		new MassDatum("Long ton (unit)", 2240*CONSTANT.lb, null, [Category.UNIT]),
		// verdurian units
		new MassDatum("Ris (Verdurian unit)", 60.71e-6, "https://www.zompist.com/thematic.htm#07", [Category.FICTIONAL, Category.UNIT]),
		new MassDatum("Hecur (Verdurian unit)", 6.071e-3, "https://www.zompist.com/thematic.htm#07", [Category.FICTIONAL, Category.UNIT]),
		new MassDatum("Süro (Verdurian unit)", 0.6071, "https://www.zompist.com/thematic.htm#07", [Category.FICTIONAL, Category.UNIT]),
		new MassDatum("Cucuri (Verdurian unit)", 6.071, "https://www.zompist.com/thematic.htm#07", [Category.FICTIONAL, Category.UNIT]),
		new MassDatum("Pavona (Verdurian unit)", 288*6.071, "https://www.zompist.com/thematic.htm#07", [Category.FICTIONAL, Category.UNIT]),
		// vaguely human-sized
		new MassDatum("Snowflake", 3e-6, "https://hypertextbook.com/facts/2001/JudyMoy.shtml"),
		new MassDatum("Paperclip (small)", 0.25e-3, "https://howthingsfly.si.edu/sites/default/files/attachment/LighterThanAir.pdf"),
		new MassDatum("Paperclip (large)", 1.2e-3, "https://inquiryproject.terc.edu/curriculum/curriculum3/standard-measures/investigation1/index.html"),
		new MassDatum("Bullet (5.56 NATO Cartridge)", 62*CONSTANT.gr, "https://en.wikipedia.org/wiki/5.56%C3%9745mm_NATO#Performance"),
		new MassDatum("Paper (A4 sheet)", 0.08*0.21*0.297, "https://en.wikipedia.org/wiki/Letter_(paper_size)#Details"),
		// a regulation standard shuttlecock weighs between 4.75 and 5.5 g, has 16 feathers, and a cork w/ diam. b/w 25 and 28 mm
		// src: https://en.wikipedia.org/wiki/Shuttlecock#Specifications
		// cork density is b/w 200 and 250 kg/m^3
		// src: https://www.engineeringtoolbox.com/density-solids-d_1265.html
		// cork max mass: 250 * 4/3 * pi * 14e-3**3 = 2.8735100804834646 g
		// cork min mass: 200 * 4/3 * pi * 12.5e-3**3 = 1.6362461737446845 g
		// 16 feathers weigh between 1.8764899195165352 and 3.8637538262553157 g
		new MassDatum("Feather (Shuttlecock)", new Mass({min: 1.8764899195165352e-3/16,max:3.8637538262553157e-3/16}), "https://en.wikipedia.org/wiki/Shuttlecock#Specifications"),
		new MassDatum("Shuttlecock", new Mass({min: 0.00475,max:0.0055}), "https://en.wikipedia.org/wiki/Shuttlecock#Specifications"),
		new MassDatum("Soul (according to the 21-gram experiment)", 0.021, "https://en.wikipedia.org/wiki/21_grams_experiment"),
		new MassDatum("Golfball", 0.04593, "https://hypertextbook.com/facts/1999/ImranArif.shtml"),
		new MassDatum("Baseball", 0.145, "https://hypertextbook.com/facts/1999/ChristinaLee.shtml"),
		new MassDatum("Soccerball", 0.43, "https://hypertextbook.com/facts/2002/LouiseHuang.shtml"),
		new MassDatum("Phone (iPhone 17)", 117e-3, "https://en.wikipedia.org/wiki/IPhone_17"),
		new MassDatum("Physics Textbook", 1.65, "https://hypertextbook.com/facts/2003/BettyTan.shtml"),
		new MassDatum("Hitachi Magic Wand", 1.2*CONSTANT.lb, "https://en.wikipedia.org/wiki/Hitachi_Magic_Wand"),
		new MassDatum("Blåhaj (Big)", 0.66, "https://www.reddit.com/r/BLAHAJ/comments/10x33so/whats_the_volume_and_weight_of_a_blahaj/j7q4h5r/"),
		new MassDatum("Cup of tea", 227.3e-6*CONSTANT.density.water50c, "https://en.wikipedia.org/wiki/Breakfast_cup"),
		new MassDatum("Gold bar", 12.4, "https://en.wikipedia.org/wiki/Gold_bar"),
		new MassDatum("Electric Scooter", 40.8*CONSTANT.lb, "https://www.amazon.com/Electric-Inflatable-Electronic-Capacity-eScooter/dp/B0BV88TGYY?th=1"),
		new MassDatum("Canadarm", 450, "https://en.wikipedia.org/wiki/Canadarm"),
		new MassDatum("Olmec colossal head", new Mass({min:5e3,max:45e3}), "https://en.wikipedia.org/wiki/Olmec_colossal_heads"),
		// Organisms
		new MassDatum("Pelagibacter communis", (0.37e-6+0.89e-6)/2 * Math.PI*Math.pow((0.12e-6+0.2e-6)/4, 2) * CONSTANT.density.water, "https://en.wikipedia.org/wiki/Pelagibacter_communis"),
		new MassDatum("Mycoplasma pneumoniae", new Mass({x:CONSTANT.volume.ellipsoid(1.5e-6,0.15e-6)*CONSTANT.density.water,min:CONSTANT.volume.ellipsoid(1e-6,0.1e-6)*CONSTANT.density.water,max:CONSTANT.volume.ellipsoid(2e-6,0.2e-6)*CONSTANT.density.water}), "https://en.wikipedia.org/wiki/Mycoplasma_pneumoniae#Cell_biology"),
		new MassDatum("Yeast (Saccharomyces cerevisiae)", 60e-15, "https://bionumbers.hms.harvard.edu/bionumber.aspx?id=101795&ver=6&trm=mass&org="),
		new MassDatum("Common bean cell", 8e-11, "https://bionumbers.hms.harvard.edu/bionumber.aspx?id=107824&ver=0&trm=mass&org="),
		new MassDatum("Myxozoa", 300e-6 * Math.PI*Math.pow(10e-6/2, 2) * CONSTANT.density.water, "https://en.wikipedia.org/wiki/https://en.wikipedia.org/wiki/Myxozoa#Anatomy"),
		new MassDatum("Escherichia coli cell", 0.65e-18*CONSTANT.density.water, "https://en.wikipedia.org/wiki/Escherichia_coli#Type_and_morphology"),
		new MassDatum("Red blood cell (Human)", 90e-18*CONSTANT.density.water, "https://en.wikipedia.org/wiki/Red_blood_cell#Human"),
		new MassDatum("White blood cell (Human Neutrophil)", CONSTANT.volume.ellipsoid((12e-6+15e-6)/2) * CONSTANT.density.water, "https://en.wikipedia.org/wiki/White_blood_cell#Overview"),
		new MassDatum("Thiomargarita magnifica cell", 1e-2 * Math.PI*Math.pow(45e-6/2, 2) * CONSTANT.density.water, "https://en.wikipedia.org/wiki/Thiomargarita_magnifica"),
		new MassDatum("Fruit Fly", (0.219e-6 + 0.304e-6)/2, "https://bionumbers.hms.harvard.edu/bionumber.aspx?id=102570"),
		new MassDatum("Stout Infantfish", 2e-6, "https://en.wikipedia.org/wiki/Paedophryne_amauensis#Characteristics"),
		new MassDatum("Mosquito", 96e6*CONSTANT.lb/17489393939393, "https://www.uaf.edu/news/pound-for-pound-alaska-mosquito-packs-punch.php"),
		new MassDatum("Smallest Frog (Paedophryne amauensis)", 10e-6, "https://en.wikipedia.org/wiki/Paedophryne_amauensis#Characteristics"),
		new MassDatum("Dwarf Pygmy Goby", 425e-6, "https://en.wikipedia.org/wiki/Dwarf_pygmy_goby"),
		new MassDatum("Siamese Fighting Fish", CONSTANT.volume.ellipsoid(7e-2, 121/350*7e-2, 121/350*7e-2/2)*CONSTANT.density.water, "https://en.wikipedia.org/wiki/Siamese_fighting_fish#Description"),
		new MassDatum("Antarctic krill", 2e-3, "https://en.wikipedia.org/wiki/Antarctic_krill"),
		new MassDatum("Bee Hummingbird", new Mass({min:1.95e-3,max:2.6e-3}), "https://en.wikipedia.org/wiki/Bee_hummingbird#Description"),
		new MassDatum("Zebrafish", new Mass({min:0.18e-3,max:0.73e-3}), "https://bionumbers.hms.harvard.edu/bionumber.aspx?id=102573&ver=1&trm=mass&org="),
		new MassDatum("Mouse", (11e-3+30e-3)/2, "https://en.wikipedia.org/wiki/House_mouse#Characteristics"),
		new MassDatum("Sparrow", (24e-3+39.5e-3)/2, "https://en.wikipedia.org/wiki/House_sparrow"),
		new MassDatum("Cat", 4.5, "https://en.wikipedia.org/wiki/Cat#Size"),
		new MassDatum("Human (Infant)", 3.5, "https://en.wikipedia.org/wiki/Birth_weight"),
		new MassDatum("Human (Global average)", 62, "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3408371"),
		new MassDatum("Human biomass", 62*8.165e9, "https://www.census.gov/popclock/world"),
		new MassDatum("Troll (D&D)", 500*CONSTANT.lb, "https://en.wikipedia.org/wiki/Troll_(Dungeons_%26_Dragons)#Typical_physical_characteristics", [Category.FICTIONAL]),
		new MassDatum("Elephant (African)", (7e3+3.6e3)/2, "https://hypertextbook.com/facts/2003/EugeneShnayder.shtml"),
		new MassDatum("Whale (Blue)", 150e3, "https://hypertextbook.com/facts/2003/MichaelShmukler.shtml"),
		// Vehicles
		new MassDatum("Sojourner", 11.5, "https://en.wikipedia.org/wiki/Sojourner_(rover)"),
		new MassDatum("Spirit/Opportunity", 185, "https://en.wikipedia.org/wiki/Opportunity_(rover)"),
		new MassDatum("New Horizons", 478, "https://en.wikipedia.org/wiki/New_Horizons"),
		new MassDatum("Curiosity/Perseverence", 899, "https://en.wikipedia.org/wiki/Curiosity_(rover)"),
		new MassDatum("Ferrari 250 GT California Spyder", 1100, "https://en.wikipedia.org/wiki/Ferrari_250_GT_California_Spyder"),
		new MassDatum("DMC DeLorean", 1233, "https://en.wikipedia.org/wiki/DMC_DeLorean"),
		new MassDatum("Car (Typical, 1990s)", 1.6e3, "https://hypertextbook.com/facts/2000/YanaZorina.shtml"),
		new MassDatum("Hummer H3", new Mass({min:4600*CONSTANT.lb,max:4900*CONSTANT.lb}), "https://en.wikipedia.org/wiki/Hummer_H3"),
		new MassDatum("Tucker 48", 1.9e3, "https://en.wikipedia.org/wiki/Tucker_48"),
		new MassDatum("Soyuz MS", 7290, "https://en.wikipedia.org/wiki/Soyuz_MS"),
		new MassDatum("Double-decker bus (New Routemaster)", 12.65e3, "https://en.wikipedia.org/wiki/New_Routemaster"),
		new MassDatum("Semi (Max weight)", 40e3, "https://en.wikipedia.org/wiki/Semi-trailer_truck"),
		new MassDatum("Tank (M1 Abrams)", 60*CONSTANT.short_ton, "https://en.wikipedia.org/wiki/M1_Abrams"),
		new MassDatum("Aircraft (A320, MTOW)", 78e3, "https://en.wikipedia.org/wiki/Airbus_A320_family#Specifications"),
		new MassDatum("Steam Locomotive (Union Pacific Big Boy)", 1477000*CONSTANT.lb, "https://en.wikipedia.org/wiki/Union_Pacific_4014"),
		new MassDatum("Diesel Locomotive (EMD GP9)", 117.7e3, "https://en.wikipedia.org/wiki/EMD_GP9"),
		new MassDatum("Soyuz-2", 312000, "https://en.wikipedia.org/wiki/Soyuz-2"),
		new MassDatum("ISS", 450e3, "https://en.wikipedia.org/wiki/International_Space_Station"),
		new MassDatum("Large aircraft (A380, MTOW)", 575e3, "https://en.wikipedia.org/wiki/Airbus_A380#Specifications"),
		new MassDatum("Space Shuttle", 2030000, "https://en.wikipedia.org/wiki/Space_Shuttle"),
		new MassDatum("SLS Rocket", 2610000, "https://en.wikipedia.org/wiki/Space_Launch_System"),
		new MassDatum("N1", 2750000, "https://en.wikipedia.org/wiki/N1_(rocket)"),
		new MassDatum("Saturn V", (2822171+2965241)/2, "https://en.wikipedia.org/wiki/Saturn_V"),
		new MassDatum("Destroyer (Arleigh Burke-class)", 9e3*CONSTANT.long_ton, "https://en.wikipedia.org/wiki/Arleigh_Burke-class_destroyer"),
		new MassDatum("Battleship (Yamato-class)", 65027e3, "https://en.wikipedia.org/wiki/Japanese_battleship_Yamato"),
		new MassDatum("Titanic", 52.31e3*CONSTANT.long_ton, "https://en.wikipedia.org/wiki/Titanic"),
		new MassDatum("Aircraft carrier (Gerald R. Ford-class)", 100e3*CONSTANT.long_ton, "https://en.wikipedia.org/wiki/Gerald_R._Ford-class_aircraft_carrier"),
		new MassDatum("Queen Mary 2", 149215e3, "https://en.wikipedia.org/wiki/Queen_Mary_2"),
		new MassDatum("Pioneering Spirit", 403342e3, "https://en.wikipedia.org/wiki/Pioneering_Spirit"),
		new MassDatum("Seawise Giant (full load)", 646642*CONSTANT.long_ton, "https://en.wikipedia.org/wiki/Seawise_Giant"),
		// mineral production
		new MassDatum("Annual global palladium production (2022)", 190e3, "https://en.wikipedia.org/wiki/List_of_countries_by_palladium_production"),
		new MassDatum("Annual global gold production (2024)", 3300e3, "https://en.wikipedia.org/wiki/Lists_of_countries_by_mineral_production#Gold"),
		new MassDatum("Annual global silver production (2024)", 25790e3, "https://en.wikipedia.org/wiki/Lists_of_countries_by_mineral_production#Silver"),
		new MassDatum("Annual global uranium production (2022)", 49355e3, "https://en.wikipedia.org/wiki/List_of_countries_by_uranium_production"),
		new MassDatum("Annual global nickel production (2024)", 3700000e3, "https://en.wikipedia.org/wiki/Lists_of_countries_by_mineral_production#Nickel"),
		new MassDatum("Annual global coal production (2023)", 8694.9e3*1e3, "https://en.wikipedia.org/wiki/List_of_countries_by_coal_production"),
		new MassDatum("Annual global chromite production (2013)", 28.8e9, "https://en.wikipedia.org/wiki/Chromium#Production"),
		new MassDatum("Annual global aluminum production (2024)", 72000*1e6, "https://en.wikipedia.org/wiki/Aluminium#Production_and_refinement"),
		new MassDatum("Annual global copper production (2024)", 980e9, "https://en.wikipedia.org/wiki/Lists_of_countries_by_mineral_production#Copper"),
		new MassDatum("Annual global iron ore production (2024)", 2500000*1e6, "https://en.wikipedia.org/wiki/Iron_ore#Production_and_consumption"),
		new MassDatum("CO2 emitted from one Gemini query (2025)", 502e3/1287e6*0.24, "https://arxiv.org/abs/2508.15734"),
		new MassDatum("CO2 emitted from one ChatGPT query (2025)", 502e3/1287e6*0.34, "https://blog.samaltman.com/the-gentle-singularity"),
		new MassDatum("CO2 emitted by training GPT-3", 502e6, "https://news.climate.columbia.edu/2023/06/09/ais-growing-carbon-footprint/"),
		new MassDatum("CO2 emitted annually by training AI", 102e9, "https://scienceblog.com/ais-hidden-environmental-cost-china-study-reveals-massive-carbon-footprint/"),
		new MassDatum("Annual CO2 emissions (2024)", 54.43e12, "https://ourworldindata.org/greenhouse-gas-emissions"),
		new MassDatum("Cumulative CO2 emissions (1870-2022)", 2575e12, "https://en.wikipedia.org/wiki/Greenhouse_gas_emissions"),
		// misc big things
		new MassDatum("Statue of Ahimsa", 8712e3, "https://en.wikipedia.org/wiki/List_of_largest_monoliths"),
		new MassDatum("Great Bell of Dhammazedi", 294e3, "https://en.wikipedia.org/wiki/Great_Bell_of_Dhammazedi"),
		new MassDatum("Pando", 6e6, "https://en.wikipedia.org/wiki/Pando_(tree)"),
		new MassDatum("Space Needle", 9550*CONSTANT.short_ton, "https://en.wikipedia.org/wiki/Space_Needle"),
		new MassDatum("Eiffel Tower", 10100e3, "https://en.wikipedia.org/wiki/Eiffel_Tower"),
		new MassDatum("Empire State Building", 365e3*CONSTANT.short_ton, "https://en.wikipedia.org/wiki/Empire_State_Building#Interior"),
		new MassDatum("Burj Khalifa", 450e6, "https://en.wikipedia.org/wiki/Burj_Khalifa#Construction"),
		new MassDatum("Bent Pyramid", 1237040*2323, "https://en.wikipedia.org/wiki/List_of_Egyptian_pyramids"),
		new MassDatum("Red Pyramid", 1694000*2323, "https://en.wikipedia.org/wiki/List_of_Egyptian_pyramids"),
		new MassDatum("Pyramid of Khafre", 2211096*2323, "https://en.wikipedia.org/wiki/List_of_Egyptian_pyramids"),
		// the 3.43 m model weighs 125 kg.
		// according to https://www.trekbbs.com/threads/actual-size-of-ships-in-star-trek.254521/
		// the actual ship is 288.6 m.
		new MassDatum("Enterprise (NCC-1701, estimate)", 125 * Math.pow(288.6/3.43,3)),
		new MassDatum("Imperial Star Destroyer", 40e9, "https://en.wikipedia.org/wiki/Star_Destroyer#Concept_and_design", [Category.FICTIONAL]),
		new MassDatum("Dyson Sphere (estimate)", 1.5*0.959e23, "../dyson.html#Sun_Reasonable", [Category.HYPOTHETICAL]), // original concept was 3m thickness, I used a 2m estimate originally, hence x1.5
		new MassDatum("Death Star (estimate)", CONSTANT.volume.ellipsoid(160e3)*CONSTANT.density.iron/4, [Category.FICTIONAL]),
		// Giza density ~2323
		new MassDatum("Great Pyramid of Giza", 6e9, "https://en.wikipedia.org/wiki/Great_Pyramid_of_Giza"),
		new MassDatum("Three Gorges Dam (estimate)", 27.2e6*CONSTANT.density.concrete + 463e6, "https://en.wikipedia.org/wiki/Three_Gorges_Dam#Composition_and_dimensions"),
		new MassDatum("Great Wall of China (estimate)", 21196.18e3*6.5*5.5 *CONSTANT.density.rock), // "There it runs 11 km (7 mi) long, ranges from 5 to 8 m (16 ft 5 in to 26 ft 3 in) in height, and 6 m (19 ft 8 in) across the bottom, narrowing up to 5 m (16 ft 5 in) across the top."
		new MassDatum("Atlantropa (Gibraltar, estimate)", (27.2e6*CONSTANT.density.concrete + 463e6)*14.2/2.335*300/185, [Category.HYPOTHETICAL]),
		new MassDatum("Large Hadron Collider (estimate)", 26.7e3*Math.PI*Math.pow(3.8/2,2)*CONSTANT.density.concrete, "https://en.wikipedia.org/wiki/Large_Hadron_Collider#Design"),
		new MassDatum("Danube annual discharge", 6452*CONSTANT.density.water*CONSTANT.yr, "https://en.wikipedia.org/wiki/Danube"),
		new MassDatum("Earth's biosphere", 1841e15, "https://hypertextbook.com/facts/2001/AmandaMeyer.shtml"),
		new MassDatum("Greenland ice sheet", 1710000e6*1673*CONSTANT.density.ice, "https://en.wikipedia.org/wiki/Greenland_ice_sheet"),
		new MassDatum("Antarctic ice sheet", 14e6*1e6*2200*CONSTANT.density.ice, "https://en.wikipedia.org/wiki/Antarctic_ice_sheet"),
		new MassDatum("Earth's oceans", 1.4e21, "https://hypertextbook.com/facts/1998/AvijeetDut.shtml"),
		new MassDatum("Earth's core", 1e23, "https://en.wikipedia.org/wiki/Earth%27s_inner_core#Density_and_mass"),
		new MassDatum("Vatican City (Crust)", 0.49e6*CONSTANT.thickness.crust.continental*CONSTANT.density.crust.continental),
		new MassDatum("Australia (Crust)", 7688287e6*CONSTANT.thickness.crust.continental*CONSTANT.density.crust.continental),
		new MassDatum("Europe (Crust)", 10186000e6*CONSTANT.thickness.crust.continental*CONSTANT.density.crust.continental),
		new MassDatum("Antarctica (Crust)", 14200000e6*CONSTANT.thickness.crust.continental*CONSTANT.density.crust.continental),
		new MassDatum("South America (Crust)", 17840000e6*CONSTANT.thickness.crust.continental*CONSTANT.density.crust.continental),
		new MassDatum("North America (Crust)", 24709000e6*CONSTANT.thickness.crust.continental*CONSTANT.density.crust.continental),
		new MassDatum("Africa (Crust)", 30370000e6*CONSTANT.thickness.crust.continental*CONSTANT.density.crust.continental),
		new MassDatum("Asia (Crust)", 44579000e6*CONSTANT.thickness.crust.continental*CONSTANT.density.crust.continental),
		// Atmospheres
		new MassDatum("Mercury's atmosphere", CONSTANT.atmosphere_mass(2439.7e3, 3.3011e23, 0.5e-9)),
		new MassDatum("Moon's atmosphere", CONSTANT.atmosphere_mass(1737.4e3, 7.346e22, (1e-7 + 1e-10)/2)),
		new MassDatum("Europa's atmosphere", CONSTANT.atmosphere_mass(1560.8e3, 4.79984e22, 0.5e-6)),
		new MassDatum("Ganymede's atmosphere", CONSTANT.atmosphere_mass(2634.1e3, 1.4819e23, (0.2e-6+1.2e-6)/2)),
		new MassDatum("Callisto's atmosphere", CONSTANT.atmosphere_mass(2410.3e3, 1.075938e23, 0.75e-6)),
		new MassDatum("Io's atmosphere", CONSTANT.atmosphere_mass(1821.6e3, 8.931938e22, (0.5e-3+4e-3)/2)),
		new MassDatum("Pluto's atmosphere", CONSTANT.atmosphere_mass(1188.3e3, 1.3025e22, 1)),
		new MassDatum("Triton's atmosphere", CONSTANT.atmosphere_mass(1353.4e3, 2.1389e22, 1.454)),
		new MassDatum("Mars's atmosphere", CONSTANT.atmosphere_mass(3389.5e3, 6.4171e23, 636)),
		new MassDatum("Earth's atmosphere", CONSTANT.atmosphere_mass(CONSTANT.earth_radius, CONSTANT.earth_mass, CONSTANT.atm)),
		new MassDatum("Titan's atmosphere", CONSTANT.atmosphere_mass(2574.73e3, 1.34518e23, 146.7e3)),
		new MassDatum("Venus's atmosphere", CONSTANT.atmosphere_mass(6051.8e3, 4.86731e24, 92*CONSTANT.atm)),
		// Astro
		new MassDatum("Tunguska meteor", CONSTANT.volume.ellipsoid(55) * CONSTANT.density.rock, null, [Category.MINORPLANET]),
		new MassDatum("Barringer impactor", CONSTANT.volume.ellipsoid(50) * CONSTANT.density.iron, null, [Category.MINORPLANET]),
		// new MassDatum("Siljan impactor", CONSTANT.volume.ellipsoid(5e3) * CONSTANT.density.rock, "https://en.wikipedia.org/wiki/Siljan_Ring#Geology", [Category.MINORPLANET]),
		new MassDatum("Manicouagan impactor", CONSTANT.volume.ellipsoid(5e3) * CONSTANT.density.rock, null, [Category.MINORPLANET]),
		new MassDatum("Chicxulub impactor", CONSTANT.volume.ellipsoid(12.5e3) * CONSTANT.density.rock, null, [Category.MINORPLANET]),
		new MassDatum("1I/ʻOumuamua", CONSTANT.volume.ellipsoid(115,111,19) * CONSTANT.density.rock, "https://en.wikipedia.org/wiki/1I/%CA%BBOumuamua", [Category.MINORPLANET]),
		new MassDatum("3I/ATLAS", 4.4e10, "https://en.wikipedia.org/wiki/3I/ATLAS", [Category.MINORPLANET]),
		new MassDatum("2I/Borisov", CONSTANT.volume.ellipsoid(400) * CONSTANT.density.rock, "https://en.wikipedia.org/wiki/2I/Borisov", [Category.MINORPLANET]),
		new MassDatum("Comet Shoemaker-Levy 9", CONSTANT.volume.ellipsoid(1.8e3) * CONSTANT.density.comet, "https://en.wikipedia.org/wiki/Comet_Shoemaker%E2%80%93Levy_9", [Category.MINORPLANET]),
		new MassDatum("Comet Hale-Bopp", new Mass(1.9e14, 1.9e14*0.13*2), "https://academic.oup.com/mnras/article-pdf/416/1/767/4051800/mnras0416-0767.pdf", [Category.MINORPLANET]),
		new MassDatum("Great Comet of 1843", 7.3e17, "https://iopscience.iop.org/article/10.1088/0004-6256/139/3/926", [Category.MINORPLANET]),
		new MassDatum("Great Southern Comet of 1880", 2e15, "https://iopscience.iop.org/article/10.1088/0004-6256/139/3/926", [Category.MINORPLANET]),
		new MassDatum("Great Comet of 1882", 4.2e19, "https://iopscience.iop.org/article/10.1088/0004-6256/139/3/926", [Category.MINORPLANET]),
		new MassDatum("Comet du Toit", 3.9e14, "https://iopscience.iop.org/article/10.1088/0004-6256/139/3/926", [Category.MINORPLANET]),
		new MassDatum("Comet Pereyra", 3.8e18, "https://iopscience.iop.org/article/10.1088/0004-6256/139/3/926", [Category.MINORPLANET]),
		new MassDatum("Comet Ikeya-Seki", 1.2e17, "https://iopscience.iop.org/article/10.1088/0004-6256/139/3/926", [Category.MINORPLANET]),
		new MassDatum("Halley's Comet", 2.2e14, null, [Category.MINORPLANET]),
		new MassDatum("486958 Arrokoth", 7.485e14, null, [Category.MINORPLANET]),
		new MassDatum("162173 Ryugu", new Mass(4.5e11,0.06e11), null, [Category.MINORPLANET]),
		new MassDatum("152830 Dinkinesh", 4.67e11, null, [Category.MINORPLANET]),
		new MassDatum("101955 Bennu", new Mass(7.329e10,0.009e10), null, [Category.MINORPLANET]),
		new MassDatum("99942 Apophis", 6.1e10, null, [Category.MINORPLANET]),
		new MassDatum("65803 Didymos", new Mass(5.4e11,0.4e11), null, [Category.MINORPLANET]),
		new MassDatum("52246 Donaldjohanson", CONSTANT.volume.ellipsoid(8.8e3,4.4e3,3.1e3)*CONSTANT.density.asteroid.c, null, [Category.MINORPLANET]),
		new MassDatum("25143 Itokawa", new Mass(3.51e10,0.105e10), null, [Category.MINORPLANET]),
		new MassDatum("9969 Braille", 7.8e12, null, [Category.MINORPLANET]),
		new MassDatum("5535 Annefrank", CONSTANT.volume.ellipsoid(6.6e3,5e3,3.4e3)*CONSTANT.density.asteroid.s, null, [Category.MINORPLANET]),
		new MassDatum("4179 Touatis", 1.9e13, null, [Category.MINORPLANET]),
		new MassDatum("2867 Šteins", CONSTANT.volume.ellipsoid(6.83e3,5.7e3,4.42e3)*CONSTANT.density.asteroid.e, null, [Category.MINORPLANET]),
		new MassDatum("951 Gaspra", new Mass({min:2e15,max:3e15}), null, [Category.MINORPLANET]),
		new MassDatum("704 Interamnia", 35e18, null, [Category.MINORPLANET]),
		// new MassDatum("511 Davida", 26.6e18, null, [Category.MINORPLANET]),
		new MassDatum("433 Eros", new Mass(6.687e15, 0.003e15), null, [Category.MINORPLANET]),
		new MassDatum("253 Mathilde", new Mass(1.033e17, 0.044e17), null, [Category.MINORPLANET]),
		new MassDatum("243 Ida", new Mass(4.2e16, 0.6e16), null, [Category.MINORPLANET]),
		new MassDatum("52 Europa", 24e18, null, [Category.MINORPLANET]),
		new MassDatum("21 Lutetia", new Mass(1.7e18, 0.017e18), null, [Category.MINORPLANET]),
		// new MassDatum("16 Psyche", 22.9e18, null, [Category.MINORPLANET]),
		new MassDatum("15 Eunomia", 30.5e18, null, [Category.MINORPLANET]),
		new MassDatum("10 Hygiea", 8.74e19, null, [Category.MINORPLANET]),
		new MassDatum("4 Vesta", 2.590271e20, null, [Category.MINORPLANET]),
		new MassDatum("3 Juno", 27e18, null, [Category.MINORPLANET]),
		new MassDatum("2 Pallas", 2.04e20, null, [Category.MINORPLANET]),
		new MassDatum("1 Ceres", 9.3839e20, null, [Category.MINORPLANET]),
		new MassDatum("Dione", 1.0954868e21, null, [Category.MINORPLANET]),
		// new MassDatum("Ariel", 1.2331e21),
		new MassDatum("Umbriel", 1.2885e21),
		new MassDatum("Charon", 1.5897e21),
		// new MassDatum("Gonggong", 1.75e21, null, [Category.MINORPLANET]),
		new MassDatum("Iapetus", 1.8056591e21),
		// new MassDatum("Rhea", 2.3064854e21),
		new MassDatum("Asteroid Belt", 9.3839e20/.392, "https://en.wikipedia.org/wiki/Asteroid_belt#Characteristics", [Category.MINORPLANET]),
		new MassDatum("Makemake", 2.69e21),
		new MassDatum("Oberon", 3.1104e21),
		new MassDatum("Titania", 3.4550e21),
		new MassDatum("Haumea", 3.95244e21, null, [Category.MINORPLANET]),
		new MassDatum("Pluto", 1.3025e22, null, [Category.MINORPLANET]),
		new MassDatum("Eris", 1.6466e22, null, [Category.MINORPLANET]),
		new MassDatum("Triton", 2.1389e22),
		new MassDatum("Europa", 4.79984e22),
		new MassDatum("Moon", 7.346e22),
		new MassDatum("Io", 8.931938e22),
		new MassDatum("Callisto", 1.075938e23),
		new MassDatum("Titan", 1.34518e23),
		new MassDatum("Ganymede", 1.4819e23),
		new MassDatum("Mercury", 3.3011e23),
		new MassDatum("Mars", 6.4171e23),
		new MassDatum("Theia", new Mass({min:0.1*CONSTANT.earth_mass,max:0.45*CONSTANT.earth_mass}),"https://en.wikipedia.org/wiki/Theia_(hypothetical_planet)"),
		new MassDatum("Venus", 4.86731e24),
		new MassDatum("Earth", CONSTANT.earth_mass),
		new MassDatum("Uranus", 8.68099e25),
		new MassDatum("Neptune", 1.024092e26),
		new MassDatum("Saturn", 5.68317e26),
		new MassDatum("Jupiter", CONSTANT.jupiter_mass),
		// Namei/Oneia
		new MassDatum("Oneia", 1.28*CONSTANT.earth_mass, "../namei/namei.html#oneia", [Category.FICTIONAL]),
		new MassDatum("Eisen", 9.0586*CONSTANT.jupiter_mass, "../namei/namei.html#eisen", [Category.FICTIONAL]),
		// Stars
		new MassDatum("WISE 0855-0714", new Mass({min:3*CONSTANT.jupiter_mass,max:10*CONSTANT.jupiter_mass}), "https://en.wikipedia.org/wiki/WISE_0855%E2%88%920714"),
		new MassDatum("Luhman 16 system", (35.4+29.4)*CONSTANT.jupiter_mass),
		new MassDatum("Proxima Centauri", 0.1221*CONSTANT.solar_mass),
		new MassDatum("Barnard's Star", 0.162*CONSTANT.solar_mass),
		new MassDatum("Solar core", 0.34*CONSTANT.solar_mass, "https://en.wikipedia.org/wiki/Solar_core"),
		new MassDatum("Sun", CONSTANT.solar_mass),
		new MassDatum("Chandrasekhar limit", 1.44*CONSTANT.solar_mass),
		new MassDatum("Sirius A", 2.063*CONSTANT.solar_mass),
		new MassDatum("Tolman-Oppenheimer-Volkoff limit", new Mass({min:1.97*CONSTANT.solar_mass,max:2.33*CONSTANT.solar_mass}), "https://iopscience.iop.org/article/10.3847/2041-8213/aaa401"),
		new MassDatum("Polaris A", 5.13*CONSTANT.solar_mass),
		new MassDatum("Betelgeuse", (14+19)/2*CONSTANT.solar_mass),
		new MassDatum("R136a1", 291*CONSTANT.solar_mass),
		// Clusters
		new MassDatum("Pleiades", 800*CONSTANT.solar_mass),
		new MassDatum("M2", 1.04e5*CONSTANT.solar_mass),
		// Galaxies
		new MassDatum("Sagittarius A*", 4.297e6*CONSTANT.solar_mass),
		new MassDatum("Sagittarius Dwarf Galaxy", 4e8*CONSTANT.solar_mass),
		new MassDatum("Small Magellanic Cloud", 7e9*CONSTANT.solar_mass),
		new MassDatum("Large Magellanic Cloud", 1e10*CONSTANT.solar_mass),
		new MassDatum("Triangulum Galaxy", 5e10*CONSTANT.solar_mass),
		new MassDatum("Milky Way", 1.15e12*CONSTANT.solar_mass),
		new MassDatum("Andromeda Galaxy", 1.5e12*CONSTANT.solar_mass),
		new MassDatum("Local Group", 2.47e12*CONSTANT.solar_mass),
		new MassDatum("Local Sheet", 1.6e13*CONSTANT.solar_mass),
		new MassDatum("Virgo Supercluster", 1.48e15*CONSTANT.solar_mass),
		new MassDatum("Laniakea Supercluster", 1e17*CONSTANT.solar_mass),
		new MassDatum("Pisces-Cetus Supercluster Complex", 1e18*CONSTANT.solar_mass),
		new MassDatum("Huge-LQG", 6.1e18*CONSTANT.solar_mass),
		new MassDatum("Observable universe", 1.5e53),
	],
	dataEnergy: [
		// Photon energies
		// new EnergyDatum("Infrared (far)", 300e9*CONSTANT.planck), too small
		new EnergyDatum("Infrared (near)", 380e12*CONSTANT.planck),
		new EnergyDatum("Visible light (Red)", 440e12*CONSTANT.planck),
		new EnergyDatum("Visible light (Green)", 550e12*CONSTANT.planck),
		new EnergyDatum("Visible light (Blue)", 640e12*CONSTANT.planck),
		new EnergyDatum("Ultraviolet", 6*CONSTANT.eV),
		new EnergyDatum("X-ray (soft)", 100*CONSTANT.eV),
		new EnergyDatum("Gamma ray (minimum)", 10e3*CONSTANT.eV),
		new EnergyDatum("Electronvolt", CONSTANT.eV, null, [Category.UNIT]),
		new EnergyDatum("Erg", 1e-7, null, [Category.UNIT]),
		new EnergyDatum("Joule", 1, null, [Category.UNIT]),
		new EnergyDatum("Watt-hour", 60*60, null, [Category.UNIT]),
		new EnergyDatum("Nutritional calorie", 4184, "https://en.wikipedia.org/wiki/Calorie", [Category.UNIT]),
		new EnergyDatum("kg TNT equivalent", 4.184e6, "https://en.wikipedia.org/wiki/TNT_equivalent", [Category.UNIT]),
		new EnergyDatum("Therm", 105e6, "https://en.wikipedia.org/wiki/Therm", [Category.UNIT]),
		new EnergyDatum("Planck Energy", 1.9561e9, "https://en.wikipedia.org/wiki/Planck_units", [Category.UNIT]),
		new EnergyDatum("Barrel of oil equivalent", 6e9, "https://en.wikipedia.org/wiki/Barrel_of_oil_equivalent", [Category.UNIT]),
		// new EnergyDatum("Enthalpy of formation of water", 285.83e3/CONSTANT.avogadro),
		// CH4 + 2O2 -> CO2 + 2H20
		new EnergyDatum("Combustion of one hydrogen molecule", 285.83e3/CONSTANT.avogadro),
		new EnergyDatum("Combustion of one carbon atom", 393.5e3/CONSTANT.avogadro),
		new EnergyDatum("Combustion of one formic acid molecule", (393.5e3+285.83e3)/CONSTANT.avogadro),
		new EnergyDatum("Combustion of one methane molecule", (393.5e3+2*285.83e3)/CONSTANT.avogadro),
		new EnergyDatum("Combustion of one ethanol molecule", (2*393.5e3+3*285.83e3)/CONSTANT.avogadro),
		new EnergyDatum("Combustion of one isopropyl alcohol molecule", (3*393.5e3+4*285.83e3)/CONSTANT.avogadro),
		new EnergyDatum("Combustion of one diethyl ether molecule", (4*393.5e3+5*285.83e3)/CONSTANT.avogadro),
		new EnergyDatum("Combustion of one benzene molecule", (6*393.5e3+3*285.83e3)/CONSTANT.avogadro),
		new EnergyDatum("Combustion of one naphthalene molecule", (10*393.5e3+4*285.83e3)/CONSTANT.avogadro),
		new EnergyDatum("Combustion of one octane molecule", (8*393.5e3+9*285.83e3)/CONSTANT.avogadro),
		new EnergyDatum("Combustion of one turpentine molecule", (10*393.5e3+8*285.83e3)/CONSTANT.avogadro),
		new EnergyDatum("Combustion of one oleic acid molecule", (18*393.5e3+17*285.83e3)/CONSTANT.avogadro),
		new EnergyDatum("Combustion of one buckyball", 60*393.5e3/CONSTANT.avogadro),
		// (heat of combustion)
		new EnergyDatum("Combustion of one TNT molecule", 14.5e6/0.227132/CONSTANT.avogadro),
		new EnergyDatum("Combustion of one nitroglycerin molecule", 1.529e6/CONSTANT.avogadro),
		// fusion (sort by smaller-larger nuclei):
		new EnergyDatum("Proton-Proton fusion", 1.442e6*CONSTANT.eV, "https://en.wikipedia.org/wiki/Proton%E2%80%93proton_chain#The_proton%E2%80%93proton_chain"),
		new EnergyDatum("Proton-Deuterium fusion", 5.493e6*CONSTANT.eV, "https://en.wikipedia.org/wiki/Proton%E2%80%93proton_chain#The_proton%E2%80%93proton_chain"),
		new EnergyDatum("Proton-Helium-3 fusion", 19.795e6*CONSTANT.eV, "https://en.wikipedia.org/wiki/Proton%E2%80%93proton_chain#The_proton%E2%80%93proton_chain"),
		new EnergyDatum("Proton-Lithium-7 fusion", 17.35e6*CONSTANT.eV, "https://en.wikipedia.org/wiki/Proton%E2%80%93proton_chain#The_proton%E2%80%93proton_chain"),
		new EnergyDatum("Deuterium-Deuterium fusion", new Energy({min:2.45e6*CONSTANT.eV,max:3.02e6*CONSTANT.eV}), "https://en.wikipedia.org/wiki/Deuterium_fusion#Other_reactions"),
		new EnergyDatum("Deuterium-Tritium fusion", 17.6e6*CONSTANT.eV, "https://en.wikipedia.org/wiki/Deuterium%E2%80%93tritium_fusion"),
		new EnergyDatum("Deuterium-Helium-3 fusion", 14.7e6*CONSTANT.eV, "https://en.wikipedia.org/wiki/Deuterium_fusion#Other_reactions"),
		new EnergyDatum("Helium-3-Helium-3 fusion", 12.859e6*CONSTANT.eV, "https://en.wikipedia.org/wiki/Proton%E2%80%93proton_chain#The_proton%E2%80%93proton_chain"),
		new EnergyDatum("Helium-3-Helium-4 fusion", 1.59e6*CONSTANT.eV, "https://en.wikipedia.org/wiki/Proton%E2%80%93proton_chain#The_proton%E2%80%93proton_chain"),
		new EnergyDatum("Triple-alpha fusion", 7.275e6*CONSTANT.eV, "https://en.wikipedia.org/wiki/Triple-alpha_process"),
		new EnergyDatum("Uranium-235 fission", 215e6*CONSTANT.eV, "http://hyperphysics.phy-astr.gsu.edu/hbase/NucEne/U235chn.html#c3"),
		// MORE
		new EnergyDatum("Stick of dynamite", 1e6, "https://en.wikipedia.org/wiki/Dynamite#Form"),
		new EnergyDatum("Oh-My-God particle", 3.2e20*CONSTANT.eV, "https://en.wikipedia.org/wiki/Oh-My-God_particle"),
		new EnergyDatum("Lightning", new Energy({min:1e9,max:10e9}), "https://www.thenakedscientists.com/articles/science-features/how-do-thunderstorms-and-lightning-work"),
		new EnergyDatum("Airbus A380 kinetic energy (Cruise)", 0.5*575e3*Math.pow(488*CONSTANT.kt,2), "https://en.wikipedia.org/wiki/Airbus_A380#Specifications"),
		new EnergyDatum("SR-71 Blackbird kinetic energy (Max)", 0.5*78018*Math.pow(1910*CONSTANT.kt,2), "https://en.wikipedia.org/wiki/Lockheed_SR-71_Blackbird#Specifications_(SR-71A)"),
		new EnergyDatum("MOAB", 46e9, "https://en.wikipedia.org/wiki/GBU-43/B_MOAB"),
		new EnergyDatum("Kori nuclear power plant annual output", 43148e9*CONSTANT.h, "https://en.wikipedia.org/wiki/Kori_Nuclear_Power_Plant"),
		new EnergyDatum("Little Boy", new Energy({min:13e3*CONSTANT.tTNT,max:16e3*CONSTANT.tTNT}), "https://en.wikipedia.org/wiki/Little_Boy"),
		new EnergyDatum("Fat Man", 21e3*CONSTANT.tTNT, "https://en.wikipedia.org/wiki/Fat_Man"),
		new EnergyDatum("Trinity test", new Energy(24.8e3*CONSTANT.tTNT,2e3*CONSTANT.tTNT), "https://en.wikipedia.org/wiki/Trinity_(nuclear_test)"),
		new EnergyDatum("Castle Bravo", 15e6*CONSTANT.tTNT, "https://en.wikipedia.org/wiki/Castle_Bravo"),
		new EnergyDatum("Tsar Bomba", new Energy({min:50e6*CONSTANT.tTNT,max:58e6*CONSTANT.tTNT}), "https://en.wikipedia.org/wiki/Tsar_Bomba"),
		new EnergyDatum("Chelyabinsk meteor", 2100e12, "https://en.wikipedia.org/wiki/Chelyabinsk_meteor#Atmospheric_entry"),
		new EnergyDatum("2004 Indian Ocean earthquake", 1.1e17, "https://en.wikipedia.org/wiki/2004_Indian_Ocean_earthquake_and_tsunami#Energy_released"),
		new EnergyDatum("2022 Hunga Tonga eruption", new Energy({min:100e6*CONSTANT.tTNT,max:200e6*CONSTANT.tTNT}), "https://en.wikipedia.org/wiki/2022_Hunga_Tonga%E2%80%93Hunga_Ha%CA%BBapai_eruption_and_tsunami#Academic_research"),
		new EnergyDatum("1883 Krakatoa eruption", 200e6*CONSTANT.tTNT, "https://en.wikipedia.org/wiki/1883_eruption_of_Krakatoa"),
		new EnergyDatum("Daily hurricane energy release", 5.2e19, "https://www.aoml.noaa.gov/hrd-faq/#hurricane-energy-production"),
		new EnergyDatum("Chicxulub impact", 300e21, "https://en.wikipedia.org/wiki/Chicxulub_crater#Effects"),
		new EnergyDatum("Carrington event", 4e25, "https://www.annualreviews.org/doi/10.1146/annurev-astro-112420-023324"),
		new EnergyDatum("Energy needed to boil Earth's oceans", 5.19e27, "https://en.wikipedia.org/wiki/Orders_of_magnitude_(energy)"),
		// Planet info
		new EnergyDatum("Mercury kinetic energy", 0.5*3.3011e23*Math.pow(47360,2), "https://en.wikipedia.org/wiki/Mercury_(planet)"),
		new EnergyDatum("Venus kinetic energy", 0.5*4.86731e24*Math.pow(35020,2), "https://en.wikipedia.org/wiki/Venus"),
		new EnergyDatum("Earth gravitational binding energy", 0.6*CONSTANT.G*Math.pow(CONSTANT.earth_mass,2)/CONSTANT.earth_radius, "https://en.wikipedia.org/wiki/Earth"),
		new EnergyDatum("Earth kinetic energy", 0.5*CONSTANT.earth_mass*Math.pow(29782.7,2), "https://en.wikipedia.org/wiki/Earth"),
		new EnergyDatum("Earth rotational energy", 0.5*Math.pow(2*Math.PI / (0.99726968*CONSTANT.d), 2) * 0.3307 * CONSTANT.earth_mass * Math.pow(CONSTANT.earth_radius, 2), "https://en.wikipedia.org/wiki/Earth"),
		new EnergyDatum("Mars kinetic energy", 0.5*6.4171e23*Math.pow(24070,2), "https://en.wikipedia.org/wiki/Mars"),
		new EnergyDatum("Ceres kinetic energy", 0.5*9.3839e20*Math.pow(17900,2), "https://en.wikipedia.org/wiki/Ceres", [Category.MINORPLANET]),
		new EnergyDatum("Jupiter kinetic energy", 0.5*1.898125e27*Math.pow(13060,2), "https://en.wikipedia.org/wiki/Jupiter"),
		new EnergyDatum("Saturn kinetic energy", 0.5*5.68317e26*Math.pow(9680,2), "https://en.wikipedia.org/wiki/Saturn"),
		new EnergyDatum("Uranus kinetic energy", 0.5*8.68099e25*Math.pow(6800,2), "https://en.wikipedia.org/wiki/Uranus"),
		new EnergyDatum("Neptune kinetic energy", 0.5*1.024092e26*Math.pow(5450,2), "https://en.wikipedia.org/wiki/Neptune"),
		new EnergyDatum("Pluto kinetic energy", 0.5*1.3025e22*Math.pow(4743,2), "https://en.wikipedia.org/wiki/Pluto", [Category.MINORPLANET]),
		// faint young sun https://en.wikipedia.org/wiki/Faint_young_Sun_paradox
		// means that the sun started out 0.7x wattage, gradually increased to 1x,
		// so avg. 0.85x overall about
		new EnergyDatum("Energy produced by the sun each second", 3.828e26, "https://en.wikipedia.org/wiki/Sun"),
		new EnergyDatum("Cumulative energy produced by the sun", 0.85*3.828e26*4.6e9*CONSTANT.yr, "https://en.wikipedia.org/wiki/Sun"),
		new EnergyDatum("Sun kinetic energy (about Milky Way)", 0.5*CONSTANT.solar_mass*Math.pow(2*Math.PI*26e3*CONSTANT.ly/(237.5e6*CONSTANT.yr),2), "https://en.wikipedia.org/wiki/Sun"),
		new EnergyDatum("Sun gravitational binding energy", 0.6*CONSTANT.G*Math.pow(CONSTANT.solar_mass,2)/695700e3, "https://en.wikipedia.org/wiki/Earth"),
		new EnergyDatum("Sun rotational energy", 0.5*Math.pow(2*Math.PI / (30*CONSTANT.d), 2) * 0.059 * CONSTANT.solar_mass * Math.pow(695700e3, 2), "https://en.wikipedia.org/wiki/Sun"),
		new EnergyDatum("Fast optical blue transient (min)", 1e43, "https://academic.oup.com/mnras/article/515/2/2293/6612740?__cf_chl_tk=3C.zhiXCiZ91h7QXYMQtMMDPcPHvRYHUCwSOn23.blk-1770640010-1.0.1.1-t_72S2lwEhqPpqyRpukA_Z4eiRoc2Q_9z5OVvmd82mU"),
		new EnergyDatum("Supernova", 1e44, "https://en.wikipedia.org/wiki/Foe_(unit)"),
		new EnergyDatum("Gamma-ray burst (typical)", 3e44, "https://iopscience.iop.org/article/10.1086/338119/meta"),
		new EnergyDatum("Hypernova (min)", 1e45, "https://en.wikipedia.org/wiki/Hypernova#Properties"),
	],
	dataTime: [
		// units
		new TimeDatum("Planck Time", 5.391247e-44, null, [Category.UNIT]),
		new TimeDatum("Second", 1, null, [Category.UNIT]),
		new TimeDatum("Minute", CONSTANT.min, null, [Category.UNIT]),
		new TimeDatum("Hour", CONSTANT.h, null, [Category.UNIT]),
		new TimeDatum("Day", CONSTANT.d, null, [Category.UNIT]),
		new TimeDatum("Week", 7*CONSTANT.d, null, [Category.UNIT]),
		new TimeDatum("Fortnight", 14*CONSTANT.d, null, [Category.UNIT]),
		new TimeDatum("Month", CONSTANT.yr/12, null, [Category.UNIT]),
		new TimeDatum("Year", CONSTANT.yr, null, [Category.UNIT]),
		new TimeDatum("Decade", 10*CONSTANT.yr, null, [Category.UNIT]),
		new TimeDatum("Century", 100*CONSTANT.yr, null, [Category.UNIT]),
		new TimeDatum("Millennium", 1e3*CONSTANT.yr, null, [Category.UNIT]),
		// orbits
		new TimeDatum("Lunar synodic month", 29.530588861*CONSTANT.d),
		// half-lives
		new TimeDatum("W and Z boson half-life", 3e-25),
		new TimeDatum("Hydrogen-5 half-life", 86e-24),
		new TimeDatum("Plutonium-244 half-life", 8.13e7*CONSTANT.yr),
		new TimeDatum("Uranium-235 half-life", 7.04e8*CONSTANT.yr),
		new TimeDatum("Uranium-238 half-life", 4.463e9*CONSTANT.yr),
		new TimeDatum("Thorium-232 half-life", 1.40e10*CONSTANT.yr),
		// ages
		new TimeDatum("Age of the Earth", 4.54e9*CONSTANT.yr),
		new TimeDatum("Age of the Universe", 13.79e9*CONSTANT.yr),
		// misc
		new TimeDatum("Time since the creation of this webtool", (new Date() - new Date("2026-02-06T12:49:19.000Z"))/1e3, "https://github.com/Mocha2007/mocha2007.github.io/commit/d901d1ae1d29255cb2bba470393e7c4ede485fef"),
		new TimeDatum("Time since the creation of this website", (new Date() - new Date("2017-05-17T01:50:57.000Z"))/1e3, "https://github.com/Mocha2007/mocha2007.github.io/commit/4e1bbc0bc41c4f75681c539cd09e164594e6ba7c"),
		new TimeDatum("Caesium frequency", 1/9192631770, "https://www.bipm.org/documents/20126/41483022/SI-Brochure-9.pdf/fcf090b2-04e6-88cc-1149-c3e029ad8232")
	],
	dataLength: [
		// units
		new LengthDatum("Planck Length", 1.616255e-35, null, [Category.UNIT]),
		new LengthDatum("Ångström", 1e-10, null, [Category.UNIT]),
		new LengthDatum("Twip", CONSTANT.ft/17280, null, [Category.UNIT]),
		new LengthDatum("Thou", CONSTANT.ft/12000, null, [Category.UNIT]),
		new LengthDatum("Point (unit)", CONSTANT.ft/864, null, [Category.UNIT]),
		new LengthDatum("Pica", CONSTANT.ft/72, null, [Category.UNIT]),
		new LengthDatum("Barleycorn", CONSTANT.ft/36, null, [Category.UNIT]),
		new LengthDatum("Inch", CONSTANT.ft/12, null, [Category.UNIT]),
		new LengthDatum("Hand (unit)", CONSTANT.ft/3, null, [Category.UNIT]),
		new LengthDatum("Link (unit)", CONSTANT.ft*33/50, null, [Category.UNIT]),
		new LengthDatum("Foot (unit)", CONSTANT.ft, null, [Category.UNIT]),
		new LengthDatum("Yard (unit)", CONSTANT.ft*3, null, [Category.UNIT]),
		new LengthDatum("Meter", 1, null, [Category.UNIT]),
		new LengthDatum("Rod (unit)", CONSTANT.ft*33/2, null, [Category.UNIT]),
		new LengthDatum("Chain (unit)", CONSTANT.ft*66, null, [Category.UNIT]),
		new LengthDatum("Furlong", CONSTANT.ft*660, null, [Category.UNIT]),
		new LengthDatum("Mile", CONSTANT.ft*5280, null, [Category.UNIT]),
		new LengthDatum("Fathom (unit)", CONSTANT.nmi/1000, null, [Category.UNIT]),
		new LengthDatum("Cable (unit)", CONSTANT.nmi/10, null, [Category.UNIT]),
		new LengthDatum("Nautical Mile", CONSTANT.nmi, null, [Category.UNIT]),
		new LengthDatum("League (unit)", CONSTANT.ft*15840, null, [Category.UNIT]),
		new LengthDatum("Lunar distance", 384399e3, null, [Category.UNIT]),
		new LengthDatum("Astronomical unit", 149597870700, null, [Category.UNIT]),
		new LengthDatum("Light-year", CONSTANT.c*CONSTANT.yr, null, [Category.UNIT]),
		new LengthDatum("Parsec", 3.0857e16, null, [Category.UNIT]),
		// misc tiny
		new LengthDatum("Range of the weak force", 1e-16, "https://en.wikipedia.org/wiki/Weak_interaction#Properties"),
		new LengthDatum("Proton (charge radius)", 8.4075e-16, "https://physics.nist.gov/cgi-bin/cuu/Value?rp"),
		new LengthDatum("Range of the strong force", 1e-15, "https://en.wikipedia.org/wiki/Strong_interaction"),
		new LengthDatum("Classical electron radius", 2.8179403205e-15, "https://physics.nist.gov/cgi-bin/cuu/Value?re"),
		new LengthDatum("Uranium nucleus (diameter)", 11.7e-15, "https://en.wikipedia.org/wiki/Atomic_nucleus"),
		new LengthDatum("Hydrogen (atomic radius)", 25e-12, "https://en.wikipedia.org/wiki/Hydrogen"),
		new LengthDatum("Bohr radius", 5.29177210544e-11, "https://en.wikipedia.org/wiki/Bohr_radius"),
		new LengthDatum("Uranium (atomic radius)", 156e-12, "https://en.wikipedia.org/wiki/Uranium"),
		new LengthDatum("Water molecule (diameter)", 152e-12+2*25e-12, "https://commons.wikimedia.org/wiki/File:H2O_2D_labelled.svg"),
		new LengthDatum("DNA (width)", new Length({min: 22e-10,max:26e-10}), "https://en.wikipedia.org/wiki/DNA#Properties"),
		new LengthDatum("Ribosome (eukaryotic, diameter)", new Length({min: 25e-9,max:30e-9}), "https://en.wikipedia.org/wiki/Ribosome#Bacteria"),
		new LengthDatum("COVID virus (diameter)", new Length({min: 60e-9,max:140e-9}), "https://en.wikipedia.org/wiki/SARS-CoV-2"),
		// light
		new LengthDatum("Blue light wavelength", new Length({min: 450e-9,max:495e-9}), "https://en.wikipedia.org/wiki/Blue"),
		new LengthDatum("Green light wavelength", new Length({min: 495e-9,max:570e-9}), "https://en.wikipedia.org/wiki/Green"),
		new LengthDatum("Red light wavelength", new Length({min: 625e-9,max:740e-9}), "https://en.wikipedia.org/wiki/Red"),
		// misc big
		new LengthDatum("Nucleus (human, diameter)", 6e-6, "https://en.wikipedia.org/wiki/Cell_nucleus#Nuclear_structures_and_landmarks"),
		new LengthDatum("Human hair (width)", 50e-6, "https://en.wikipedia.org/wiki/Micrometre"),
		new LengthDatum("Human (height, avg., Poland, 2010)", 1.719, "https://en.wikipedia.org/wiki/Average_human_height_by_country"),
		new LengthDatum("Marathon", 42195, "https://en.wikipedia.org/wiki/Marathon"),
		new LengthDatum("Earth Radius", CONSTANT.earth_radius, "https://en.wikipedia.org/wiki/Earth"),
		new LengthDatum("Jupiter Radius", 69886e3, "https://en.wikipedia.org/wiki/Jupiter"),
		new LengthDatum("Solar Radius", 695700e3, "https://en.wikipedia.org/wiki/Sun"),
		new LengthDatum("Distance from the sun to Proxima Centauri", 4.2465*CONSTANT.c*CONSTANT.yr, "https://en.wikipedia.org/wiki/Proxima_Centauri"),
		new LengthDatum("Observable Universe (radius)", 4.4e26, null),
	],
	dataTemperature: [
		new TemperatureDatum("Rankine", 5/9, null, [Category.UNIT]),
		new TemperatureDatum("Kelvin", 1, null, [Category.UNIT]),
		new TemperatureDatum("Planck Temperature", 1.416784e32, null, [Category.UNIT]),
		// misc
		new TemperatureDatum("Room temperature", 294, "https://en.wikipedia.org/wiki/Room_temperature"),
		new TemperatureDatum("Human body temperature", new Temperature({min:36.5+CONSTANT.c2k,max:37.5+CONSTANT.c2k}), "https://en.wikipedia.org/wiki/Human_body_temperature"),
		new TemperatureDatum("Draper point", 798, "https://en.wikipedia.org/wiki/Draper_point"),
		new TemperatureDatum("Lava", new Temperature({min:800+CONSTANT.c2k,max:1200+CONSTANT.c2k}), "https://en.wikipedia.org/wiki/Lava"),
		new TemperatureDatum("Dragonfire (Dwarf Fortress)", 200e3/9+CONSTANT.c2k, "https://dwarffortresswiki.org/index.php/Dragonfire", [Category.FICTIONAL]),
		new TemperatureDatum("Hagedorn temperature", 1.7e12, "https://en.wikipedia.org/wiki/Hagedorn_temperature"),
		// chemistry
		new TemperatureDatum("Melting point of water (1 atm)", CONSTANT.c2k, "https://en.wikipedia.org/wiki/Water"),
		new TemperatureDatum("Melting point of iron", 1811, "https://en.wikipedia.org/wiki/Iron"),
		new TemperatureDatum("Sublimation of carbon", 3915, "https://en.wikipedia.org/wiki/Carbon"),
		new TemperatureDatum("Boiling point of tungsten", 6203, "https://en.wikipedia.org/wiki/Tungsten"),
		// space
		new TemperatureDatum("Y-type Brown Dwarf (max)", 600, "https://en.wikipedia.org/wiki/Brown_dwarf"),
		new TemperatureDatum("Venus", 737, "https://en.wikipedia.org/wiki/Venus"),
		new TemperatureDatum("T-type Brown Dwarf", new Temperature({min:600,max:1300}), "https://en.wikipedia.org/wiki/Brown_dwarf"),
		new TemperatureDatum("L-type Brown Dwarf", new Temperature({min:1300,max:2100}), "https://en.wikipedia.org/wiki/Brown_dwarf"),
		new TemperatureDatum("Red Dwarf", new Temperature({min:2380,max:3850}), "https://en.wikipedia.org/wiki/Red_dwarf"),
		new TemperatureDatum("Earth (Core)", 5700, "https://en.wikipedia.org/wiki/Earth%27s_inner_core"),
		new TemperatureDatum("Sun (Photosphere)", 5772, "https://en.wikipedia.org/wiki/Sun"),
		new TemperatureDatum("Sirius B", new Temperature(25000, 200), "https://en.wikipedia.org/wiki/Sirius"),
		new TemperatureDatum("WR 142", 200000, "https://en.wikipedia.org/wiki/WR_142"),
		new TemperatureDatum("Sun (Corona)", 5e6, "https://en.wikipedia.org/wiki/Sun"),
		new TemperatureDatum("Sun (Core)", 15.7e6, "https://en.wikipedia.org/wiki/Sun"),
	],
	elem: {
		/** @type {HTMLDivElement} */
		cat_container: undefined,
		/** @returns {HTMLDivElement} */
		main: undefined,
		/** @returns {HTMLDivElement} */
		mainEnergy: undefined,
		/** @returns {HTMLDivElement} */
		mainLength: undefined,
		/** @returns {HTMLDivElement} */
		mainTemperature: undefined,
		/** @returns {HTMLDivElement} */
		mainTime: undefined,
		/** @returns {HTMLDivElement[]} */
		get tabs(){
			return [this.main, this.mainEnergy, this.mainLength, this.mainTemperature, this.mainTime];
		}
	},
	init(){
		const main = this.elem.main = document.getElementById('main');
		const e2y = this.initScale();
		this.data.forEach(datum => main.appendChild(datum.elem(e2y)));
		this.ranges.forEach((range, i, a) => main.appendChild(range.elem(e2y, i, a)));
		// now for energy
		['Energy', 'Length', 'Temperature', 'Time'].forEach(s => {
			const mainX = this.elem[`main${s}`] = document.createElement('div');
			mainX.id = `main${s}`;
			mainX.classList.add('main');
			document.body.appendChild(mainX);
			this[`data${s}`].forEach(datum => mainX.appendChild(datum.elem(e2y)));
		})
		this.config.vscale = this.config._vscale;
		this.initCats();
		this.initTabs();
		// i need to toggle shift twice to unbreak hover for some reason?
		this.toggleShift();
		this.toggleShift();
		console.info('oom.js initialized.');
	},
	initCats(){
		const container = this.elem.cat_container = document.createElement('div');
		container.id = "cat_container";
		document.body.appendChild(container);
		this.initScaler();
		Object.keys(Category).forEach(c => {
			const label = document.createElement('label');
			container.appendChild(label);
			const cat = document.createElement('input');
			cat.type = 'checkbox';
			cat.checked = this.config.default_categories.includes(Category[c]);
			// console.debug(cat.checked, this.config.default_categories, c, Category[c]);
			label.for = cat.name = cat.id = `cat_${c}`;
			label.appendChild(cat);
			label.onmouseup = () => {
				// toggle visibility of all data with this tag
				console.debug(`toggling category |${c}|...`);
				// console.debug(`this category is now ${cat.checked}`);
				const active = OOM.active_categories.map(c => Category[c]);
				if (cat.checked) { // was checked, now we are unchecking it
					active.splice(active.indexOf(Category[c]), 1); // we must remove it
				}
				else {
					active.push(Category[c]); // we must add it
				}
				OOM.refreshCats(active);
			};
			label.appendChild(document.createTextNode(Category[c]));
		});
		OOM.refreshCats(this.config.default_categories);
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
	initScaler(){
		const scaler = document.createElement('span');
		this.elem.cat_container.appendChild(scaler);
		// reduce
		const reduce = document.createElement('span');
		reduce.classList.add('button');
		reduce.innerHTML = '-';
		reduce.onmouseup = () => scale.innerHTML = --this.config.vscale;
		scaler.appendChild(reduce);
		// label
		scaler.appendChild(document.createTextNode('Scale: '));
		// number
		const scale = document.createElement('span');
		scale.innerHTML = this.config.vscale;
		scaler.appendChild(scale);
		// increase
		const increase = document.createElement('span');
		increase.classList.add('button');
		increase.innerHTML = '+';
		increase.onmouseup = () => scale.innerHTML = ++this.config.vscale;
		scaler.appendChild(increase);
	},
	initTabs(){
		const tabContainer = document.createElement('div');
		tabContainer.id = 'tabContainer';
		document.body.appendChild(tabContainer);
		[['E', 'Energy'], ['L', 'Length'], ['Θ', 'Temperature'], ['T', 'Time']].forEach(x => {
			const [abbr, tabName] = x;
			const button = document.createElement('div');
			button.innerHTML = abbr;
			button.title = tabName;
			tabContainer.appendChild(button);
			button.onclick = () => this.toggleShift(`main${tabName}`);
		});
	},
	get range(){
		const sorted = this.data.map(x => x);
		sorted.sort((a, b) => a.mass.x - b.mass.x);
		const [min, max] = [sorted[0].mass.x, sorted[sorted.length-1].mass.x];
		return {min, max};
	},
	ranges: [
		new MassRange("Elementary Particles", 9e-31, 172.76e3*CONSTANT.MeVc2, 'green'),
		new MassRange("Atoms", CONSTANT.da, 294*CONSTANT.da, 'pink'),
		new MassRange("Molecules", 2*CONSTANT.da, 3e-24, 'beige'),
		new MassRange("Proteins", 10*75.06714*CONSTANT.da, 7e-21, 'orange'),
		new MassRange("Viroids", 246*CONSTANT.bp_rna, 467*CONSTANT.bp_rna, 'maroon'),
		new MassRange("Viruses", 3e-21, 8e-16, 'magenta'),
		new MassRange("Bacteria", 1.3e-17, 1.6e-8, 'cyan'),
		new MassRange("Animals", 2e-11, 1.5e5, 'purple'),
		new MassRange("Coins", 2e-3, 12e-3, 'gold'),
		// min is geometric mean between Eris and Mercury
		new MassRange("Planets", 7e22, 13*CONSTANT.jupiter_mass, 'skyblue'),
		new MassRange("Stars", 0.08*CONSTANT.solar_mass, 300*CONSTANT.solar_mass, 'yellow'),
	],
	/** @param {string[]} active */
	refreshCats(active){
		// console.debug(`active = `, active);
		OOM.data
			.concat(...OOM.dataEnergy)
			.concat(...OOM.dataLength)
			.concat(...OOM.dataTemperature)
			.concat(...OOM.dataTime)
			.forEach(datum => {
			datum.elem_cache.style.display
				= datum.categories.every(c => active.includes(c))
				? "" : "none";
		});
	},
	toggleShift(shiftTo){
		this.config.shifted = !this.config.shifted;
		console.debug(`toggleShift(|${shiftTo}|) -> `, this.config.shifted);
		this.elem.tabs.forEach(elem => {
			elem.style.transform = this.config.shifted ? 'translate(50vw, 0)' : '';
			elem.style.display = elem.id === 'main' || (this.config.shifted && elem.id === shiftTo) ? '' : 'none';
		});
	},
};

OOM.init();