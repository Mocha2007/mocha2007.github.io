class Alloy {
	/** @param {string} name */
	constructor(name, composition, properties){
		/** @type {string} */
		this.name = name;
		/** elem name -> fraction */
		this.composition = composition;
		this.properties = properties || new AlloyProperties();
	}
	/** @returns {HTMLSpanElement} button to set sliders to this alloy */
	get gotoElem(){
		const elem = document.createElement('span');
		elem.classList.add('button');
		elem.innerHTML = '&rarr;';
		elem.onclick = () => ALLOY.setSliders(this.composition);
		return elem;
	}
	get is_pure_element(){
		let counted = false;
		for (let _ in this.composition){
			if (counted) return false;
			counted = true;
		}
		return counted;
	}
	get shortDescElem(){
		const list = [];
		for (let sym in this.composition){
			list.push([sym, this.composition[sym]]);
		}
		list.sort((a, b) => b[1] - a[1]);
		const elem = document.createElement('span');
		elem.classList.add('shortDescElem');
		list.forEach(x => {
			const [sym, f] = x;
			const color = ALLOY.rarityColor(f);
			const inner = document.createElement('span');
			elem.appendChild(inner);
			inner.innerHTML = sym;
			inner.title = `${(f*100).toFixed(1)}% ${sym}`;
			inner.style.color = color;
		});
		return elem;
	}
	dist(other_composition){
		let ssq = 0;
		for (let sym in this.composition){
			let my_amt = this.composition[sym] || 0;
			let other_amt = other_composition[sym] || 0;
			ssq += Math.pow(Math.abs(my_amt-other_amt), ALLOY.config.exponent);
		}
		for (let sym in other_composition){
			if (this.composition[sym]){
				continue; // don't double-count
			}
			let my_amt = this.composition[sym] || 0;
			let other_amt = other_composition[sym] || 0;
			ssq += Math.pow(Math.abs(my_amt-other_amt), ALLOY.config.exponent);
		}
		return ssq;
	}
}

class AlloyProperties {
	static PROPERTY_LIST = [
		['K', 'boil'],
		['A/m', 'coercivity'],
		['K', 'curie_temperature'],
		['kg/m&sup3;', 'density'],
		['Pa', 'elastic_modulus'],
		['S/m', 'electrical_conductivity'],
		['', 'elongation'],
		['H/m', 'magnetic_permeability'],
		['K', 'melt'],
		['', 'poissons_ratio'],
		['T', 'saturation_flux_density'],
		['J/kg·K', 'specific_heat_capacity'],
		['Pa', 'tensile_strength'],
		['W/m·K', 'thermal_conductivity'],
		['K<sup>-1</sup>', 'thermal_expansion_coefficient'],
		['Pa', 'transverse_modulus_of_rupture'],
		['Pa', 'yield_strength'],
		['Pa', 'youngs_modulus'],
	];
	constructor(o = {}){
		this.boil = o.boil;
		this.coercivity = o.coercivity;
		this.curie_temperature = o.curie_temperature;
		this.density = o.density;
		this.elastic_modulus = o.elastic_modulus;
		this.electrical_conductivity = o.electrical_conductivity;
		this.elongation = o.elongation;
		this.magnetic_permeability = o.magnetic_permeability;
		this.melt = o.melt;
		this.poissons_ratio = o.poissons_ratio;
		this.saturation_flux_density = o.saturation_flux_density;
		this.specific_heat_capacity = o.specific_heat_capacity;
		this.tensile_strength = o.tensile_strength;
		this.thermal_conductivity = o.thermal_conductivity;
		this.thermal_expansion_coefficient = o.thermal_expansion_coefficient;
		this.transverse_modulus_of_rupture = o.transverse_modulus_of_rupture;
		this.yield_strength = o.yield_strength;
		this.youngs_modulus = o.youngs_modulus;
	}
}

class AlloyCategory {
	/**
	 * @param {string} name
	 * @param {PhaseDiagram?} phaseDiagram
	 * */
	constructor(name, filter, hidden=false, phaseDiagram){
		/** @type {string} */
		this.name = name;
		this.filter = filter;
		/** @type {PhaseDiagram?} */
		this.phaseDiagram = phaseDiagram;
		/** @type {boolean} */
		this.hidden = hidden;
	}
	get matchElem(){
		const elem = document.createElement('li');
		elem.classList.add('catMatch');
		elem.innerHTML = this.name;
		return elem;
	}
}

class ChemicalElement {
	/**
	 * @param {string} name
	 * @param {string} sym
	 * @param {ElementCategory} cat
	 */
	constructor(name, sym, cat = ElementCategory.NULL){
		/** @type {string} */
		this.name = name;
		/** @type {string} */
		this.sym = sym;
		/** @type {ElementCategory} */
		this.cat = cat;
	}
	/** @returns {HTMLInputElement} */
	get slider(){
		return document.getElementById(this.slider_id);
	}
	get slider_id(){
		return `slider-${this.sym}`;
	}
	updateSliderNumber(){
		document.getElementById(`${this.slider_id}-n`).innerHTML = this.slider.value;
	}
}

class ElementCategory {
	static NULL = "null";
	static METALLOID = "Metalloid";
	static METAL_AE = "Alkaline Earth Metal";
	static METAL_TRANS = "Transition Metal";
	static METAL_POSTTRANS = "Post-Transition Metal";
	static NONMETAL = "Nonmetal";
	static color(self){
		switch (self){
			case ElementCategory.METAL_AE:
				return "#fda";
			case ElementCategory.METAL_POSTTRANS:
				return "#ccc";
			case ElementCategory.METAL_TRANS:
				return "#fcc";
			case ElementCategory.METALLOID:
				return "#cc9";
			case ElementCategory.NONMETAL:
				return "#ff8";
			default:
				return "grey";
		}
	}
}

class PhaseDiagram {
	constructor(data = {}){
		/** @type {string} */
		this.src = data.src;
		/** @type {string} */
		this.type = data.type || "linear";
		/** @type {number} */
		this.x = data.x || 0;
		/** @type {number} */
		this.y = data.y || 0;
		/** @type {string} */
		this.axis = data.axis || "x";
		/** @type {number} */
		this.x_min = data.x_min || 0;
		/** @type {number} */
		this.x_max = data.x_max || 1;
		/** @type {number} */
		this.y_min = data.y_min || 0;
		/** @type {number} */
		this.y_max = data.y_max || 1;
		/** function that takes a composition and returns var0, var1 */
		this.f = data.f || (() => {return {var0:0,var1:0};});
	}
	elem(composition){
		const container = document.createElement('div');
		container.classList.add('phaseDiagramContainer');
		container.style.width = ALLOY.config.phaseDiagrams.size;
		const img = document.createElement('img');
		img.src = this.src;
		img.classList.add('phaseDiagram');
		container.appendChild(img);
		const marker = document.createElement('div');
		marker.classList.add('phaseDiagramMarker');
		container.appendChild(marker);
		// set marker coords
		const inputs = this.f(composition);
		const coords = this.coords(inputs.var0, inputs.var1);
		if (0 <= coords.x && coords.x <= 1 && 0 <= coords.y && coords.y <= 1){
			marker.style.left = `${coords.x*100}%`;
			marker.style.top = `${coords.y*100}%`;
		}
		else {
			container.style.display = 'none';
		}
		return container;
	}
	coords(var0 = 0, var1 = 0){
		switch (this.type) {
			case "linear": {
				if (this.axis === "x") {
					const x = var0*(this.x_max - this.x_min) + this.x_min;
					const y = this.y;
					return {x, y};
				}
				else {
					const x = this.x;
					const y = var0*(this.y_max - this.y_min) + this.y_min;
					return {x, y};
				}
			}
			case "rect": {
				const x = var0*(this.x_max - this.x_min) + this.x_min;
				const y = var1*(this.y_max - this.y_min) + this.y_min;
				return {x, y};
			}
			case "ternary": {
				const var2 = 1-var0-var1;
				const y_raw = 1-var2;
				const x_raw = var0 + var2 / 2; //Math.tan(60.0 / 180.0 * Math.PI);
				const x = x_raw*(this.x_max - this.x_min) + this.x_min;
				const y = y_raw*(this.y_max - this.y_min) + this.y_min;
				return {x, y};
			}
			default:
				console.error("unimplemented");
				return {x: 0, y: 0};
		}
	}
}

const CONSTANTS = {
	/** in Kelvins */
	celsius: 273.15,
	/** in Ohms */
	iacs: 0.15292,
	/** in kg/m^3, at 20 Celsius */
	water_density: 998.2,
};

const ALLOY = {
	/** @type {Alloy[]} */
	alloys: [
		new Alloy('Alnico', {
			Fe: 0.515,
			Ni: 0.205,
			Co: 0.145,
			Al: 0.1,
			Cu: 0.03,
			Ti: 0.005,
		}, new AlloyProperties({
			// unknown type
			coercivity: 32e3,
			// Alnico 1
			density: 6900,
			electrical_conductivity: 1/(75e-3*1e-2),
			tensile_strength: 28e6,
			transverse_modulus_of_rupture: 97e6,
			thermal_expansion_coefficient: 12.6e-6,
			// Alnico 2
			curie_temperature: 810+CONSTANTS.celsius,
		})),
		new Alloy('Alperm', {
			Fe: 0.84,
			Al: 0.16,
		}, new AlloyProperties({
			coercivity: 5,
			electrical_conductivity: 1/140e-3,
			magnetic_permeability: 55e3,
			saturation_flux_density: 0.8,
		})),
		new Alloy('Aluminum (Aludur)', {
			Al: 0.985,
			Si: 0.007,
			Mg: 0.005,
			Fe: 0.005,
		}, new AlloyProperties({
			// Poisson's ratio article
			poissons_ratio: 0.32,
		})),
		new Alloy('Aluminum (Lockalloy)', {
			Be: 0.62,
			Al: 0.38,
		}, new AlloyProperties({
			density: 2071,
			// Poisson's ratio article
			poissons_ratio: 0.32,
			thermal_conductivity: 210,
		})),
		new Alloy('Aluminum (Y Alloy)', {
			Al: 0.925,
			Cu: 0.04,
			Ni: 0.02,
			Mg: 0.015,
		}, new AlloyProperties({
			// Poisson's ratio article
			poissons_ratio: 0.32,
		})),
		new Alloy('Aluminum (Duralumin, 2024)', {
			// https://en.wikipedia.org/wiki/2024_aluminium_alloy
			Al: 0.9355,
			Cu: 0.0435,
			Mg: 0.015,
			Mn: 0.006,
		}, new AlloyProperties({
			density: 2780,
			electrical_conductivity: 0.3*CONSTANTS.iacs,
			elongation: (0.1+0.25)/2,
			melt: 500+CONSTANTS.celsius,
			// Poisson's ratio article
			poissons_ratio: 0.32,
			// https://tpsx.arc.nasa.gov/Material?id=278
			specific_heat_capacity: 8.37e2,
			tensile_strength: (140e6+210e6)/2,
			// https://tpsx.arc.nasa.gov/Material?id=278
			thermal_conductivity: 1.76e2,
			yield_strength: 97e6,
			youngs_modulus: 73e9,
			// https://www.makeitfrom.com/material-properties/2024-O-Aluminum
			elastic_modulus: 71e9,
			thermal_expansion_coefficient: 23e-3,
		})),
		new Alloy('Aluminum (3004)', {
			Al: 0.977,
			Mn: 0.0125,
			Mg: 0.0105,
		}, new AlloyProperties({
			// Poisson's ratio article
			poissons_ratio: 0.32,
			// https://www.makeitfrom.com/material-properties/3004-O-Aluminum
			density: 2800,
			elastic_modulus: 70e9,
			electrical_conductivity: 0.42*CONSTANTS.iacs,
			elongation: 0.19,
			melt: 630+CONSTANTS.celsius,
			specific_heat_capacity: 900,
			tensile_strength: 170e6,
			thermal_conductivity: 160,
			thermal_expansion_coefficient: 24e-6,
			yield_strength: 69e6,
		})),
		new Alloy('Aluminum (4043)', {
			Al: 0.948,
			Si: 0.052,
		}, new AlloyProperties({
			// Poisson's ratio article
			poissons_ratio: 0.32,
		})),
		new Alloy('Aluminum (5456)', {
			Al: 0.94,
			Mg: 0.051,
			Mn: 0.008,
			Cr: 0.0012,
		}, new AlloyProperties({
			density: 2660,
			electrical_conductivity: 0.29*CONSTANTS.iacs,
			// Poisson's ratio article
			poissons_ratio: 0.32,
			tensile_strength: (310e6+350e6)/2,
			youngs_modulus: 69e9,
			thermal_conductivity: 120,
			thermal_expansion_coefficient: 23.9e-6,
			// https://www.makeitfrom.com/material-properties/5456-O-Aluminum
			elastic_modulus: 68e9,
			elongation: 0.18,
			melt: 570+CONSTANTS.celsius,
			tensile_strength: 320e6,
			yield_strength: 150e6,
		})),
		new Alloy('Aluminum (6066)', {
			Al: 0.957,
			Si: 0.014,
			Mg: 0.011,
			Cu: 0.01,
			Mn: 0.008,
		}, new AlloyProperties({
			// 6061
			density: 2700,
			// Poisson's ratio article
			poissons_ratio: 0.32,
			tensile_strength: 300e6,
			yield_strength: 241e6,
			// https://www.makeitfrom.com/material-properties/6066-O-Aluminum
			elastic_modulus: 70e6,
			electrical_conductivity: 0.4*CONSTANTS.iacs,
			elongation: 0.17,
			melt: 560+CONSTANTS.celsius,
			specific_heat_capacity: 890,
			thermal_conductivity: 150,
			thermal_expansion_coefficient: 23e6,
		})),
		new Alloy('Aluminum (7075)', {
			Al: 0.9,
			Zn: 0.056,
			Mg: 0.025,
			Cu: 0.016,
			Cr: 0.0023,
		}, new AlloyProperties({
			density: 2810,
			electrical_conductivity: 1/51.5e-9,
			elongation: 0.11,
			melt: 477+CONSTANTS.celsius,
			poissons_ratio: 0.33,
			specific_heat_capacity: 714.8,
			tensile_strength: 572e6,
			thermal_conductivity: 140,
			thermal_expansion_coefficient: 2.36e-5,
			youngs_modulus: 71.7e9,
			// https://www.makeitfrom.com/material-properties/7075-O-Aluminum
			elastic_modulus: 70e9,
			yield: 120e6,
		})),
		new Alloy('Aluminum (8006)', {
			Al: 0.98,
			Fe: 0.015,
			Mn: 0.005,
		}, new AlloyProperties({
			// Poisson's ratio article
			poissons_ratio: 0.32,
		})),
		new Alloy('Amalgam (Arquerite)', {
			Ag: 0.87,
			Hg: 0.13,
		}),
		new Alloy('Amalgam (Dental)', {
			Hg: 0.5,
			Ag: 0.28,
			Sn: 0.14,
			Zn: 0.08,
		}),
		new Alloy('Amalgam (Eugenite)', {
			Ag: 0.84,
			Hg: 0.16,
		}),
		new Alloy('Amalgam (Moschellandsbergite)', {
			Ag: 0.4,
			Hg: 0.6,
		}, new AlloyProperties({
			density: 13.48*CONSTANTS.water_density,
		})),
		new Alloy('Amalgam (Temagamite)', {
			Te: 0.42,
			Pd: 0.36,
			Hg: 0.22,
		}, new AlloyProperties({
			density: 9.5*CONSTANTS.water_density,
		})),
		new Alloy('Ashtadhatu', {
			Au: 1/8,
			Ag: 1/8,
			Cu: 1/8,
			Pb: 1/8,
			Zn: 1/8,
			Sn: 1/8,
			Fe: 1/8,
			Hg: 1/8,
		}),
		new Alloy('Babbitt metal', {
			// No. 1
			Sn: 0.91,
			Cu: 0.045,
			Sb: 0.045,
		}, new AlloyProperties({
			melt: 223+CONSTANTS.celsius,
			yield_strength: 30.3e6,
			// https://www.makeitfrom.com/material-properties/Grade-1-L13910-Tin-Base-Babbitt-Metal
			density: 7300,
			elastic_modulus: 53e9,
			electrical_conductivity: 0.13*CONSTANTS.iacs,
			elongation: 0.34,
			poissons_ratio: 0.35,
			specific_heat_capacity: 230,
			thermal_conductivity: 45,
			thermal_expansion_coefficient: 21e-6,
		})),
		new Alloy('Beryllium Copper', {
			Cu: 0.9825,
			Be: 0.0175,
		}, new AlloyProperties({
			// https://tpsx.arc.nasa.gov/Material?id=318
			density: 8260,
			melt: 866+CONSTANTS.celsius,
			thermal_conductivity: 107,
			// https://tpsx.arc.nasa.gov/Material?id=318
			specific_heat_capacity: 398,
		})),
		new Alloy('Billon', {
			Cu: 0.6,
			Ag: 0.4,
		}),
		new Alloy('Billon ("War Nickel")', {
			Cu: 0.56,
			Ag: 0.35,
			Mn: 0.09,
		}),
		new Alloy('Brass (Admiralty)', {
			Cu: 0.69,
			Zn: 0.3,
			Sn: 0.01,
		}, new AlloyProperties({
			// Electrical resistivity article
			electrical_conductivity: 33.4e6,
		})),
		new Alloy('Brass (Cartridge)', {
			Cu: 0.7,
			Zn: 0.3,
		}, new AlloyProperties({
			// Electrical resistivity article
			electrical_conductivity: 33.4e6,
		})),
		new Alloy('Brass (Common)', {
			Cu: 0.63,
			Zn: 0.37,
		}, new AlloyProperties({
			// Electrical resistivity article
			electrical_conductivity: 33.4e6,
			// Ultimate tensile strength article
			density: 8730,
			tensile_strength: 500e6,
			yield_strength: 200e6,
			// https://phys.libretexts.org/Bookshelves/University_Physics/University_Physics_(OpenStax)/Book%3A_University_Physics_I_-_Mechanics_Sound_Oscillations_and_Waves_(OpenStax)/12%3A_Static_Equilibrium_and_Elasticity/12.04%3A_Stress_Strain_and_Elastic_Modulus_(Part_1)
			youngs_modulus: 9e10,
		})),
		new Alloy('Brass (Devarda\'s alloy)', {
			Cu: 0.5,
			Al: 0.45,
			Zn: 0.05,
		}, new AlloyProperties({
			boil: 1179,
			// Electrical resistivity article
			electrical_conductivity: 33.4e6,
			density: 5790,
			melt: (763+833)/2,
		})),
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
		}, new AlloyProperties({
			density: 8.7*CONSTANTS.water_density,
			melt: 1000+CONSTANTS.celsius,
			tensile_strength: 221e6,
			// https://www.makeitfrom.com/material-properties/UNS-C83400-Red-Brass
			elastic_modulus: 110e9,
			electrical_conductivity: 0.44*CONSTANTS.iacs,
			elongation: 0.3,
			poissons_ratio: 0.33,
			specific_heat_capacity: 380,
			thermal_conductivity: 190,
			thermal_expansion_coefficient: 18e-6,
			yield_strength: 69e6,
		})),
		new Alloy('Brass (Manganese)', {
			// = Dollar coin cladding alloy
			Cu: 0.77,
			Zn: 0.12,
			Mn: 0.07,
			Ni: 0.04,
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
		new Alloy('Brass (Nickel silver)', {
			Cu: 0.6,
			Ni: 0.2,
			Zn: 0.2,
		}),
		new Alloy('Brass (Nordic gold)', {
			Cu: 0.89,
			Al: 0.05,
			Zn: 0.05,
			Sn: 0.01,
		}, new AlloyProperties({
			// Electrical resistivity article
			electrical_conductivity: 33.4e6,
		})),
		new Alloy('Brass (Orichalcum, Greek)', {
			// Caponetti, 2021
			// Ignoring trace elements (< 500 ppm)
			Cu: 0.7513,
			Zn: 0.1959,
			Pb: 0.0506,
			Fe: 0.0052,
		}),
		new Alloy('Brass (Orichalcum, Roman)', {
			// https://pmc.ncbi.nlm.nih.gov/articles/PMC6722059/
			// sample A (n=22)
			Cu: 0.7883,
			Zn: 0.2064,
			Fe: 0.0034,
			Sn: 0.0007,
			Pb: 0.0006,
			As: 0.0001,
		}),
		new Alloy('Brass (Pinchbeck)', {
			Cu: 0.91,
			Zn: 0.09,
		}),
		new Alloy('Brass (Silicon tombac)', {
			Cu: 0.8,
			Zn: 0.16,
			Si: 0.04,
		}, new AlloyProperties({
			melt: 975+CONSTANTS.celsius,
			// https://www.makeitfrom.com/material-properties/UNS-C87500-Silicon-Brass
			density: 8300,
			elastic_modulus: 110e9,
			electrical_conductivity: 0.067*CONSTANTS.iacs,
			elongation: 0.18,
			poissons_ratio: 0.33,
			specific_heat_capacity: 410,
			tensile_strength: 460e6,
			thermal_conductivity: 28,
			thermal_expansion_coefficient: 18e-6,
			yield_strength: 190e6,
		})),
		new Alloy('Bronze', {
			Cu: 0.88,
			Sn: 0.12,
		}),
		new Alloy('Bronze (Aluminum)', {
			Cu: 0.92,
			Al: 0.08,
		}, new AlloyProperties({
			// https://www.makeitfrom.com/material-properties/UNS-C95200-Aluminum-Bronze
			elastic_modulus: 110e9,
			electrical_conductivity: 0.11*CONSTANTS.iacs,
			elongation: 0.29,
			density: 8300,
			melt: 1040+CONSTANTS.celsius,
			poissons_ratio: 0.34,
			specific_heat_capacity: 430,
			tensile_strength: 520e6,
			thermal_conductivity: 50,
			thermal_expansion_coefficient: 18e-6,
			yield_strength: 190e6,
		})),
		new Alloy('Bronze (Architectural)', {
			Cu: 0.57,
			Zn: 0.4,
			Pb: 0.03,
		}),
		new Alloy('Bronze (Arsenical)', {
			Cu: 0.92,
			As: 0.08,
		}),
		new Alloy('Bronze (Bell)', {
			Cu: 0.78,
			Sn: 0.22,
		}, new AlloyProperties({
			// https://www.makeitfrom.com/material-properties/UNS-C91300-Alloy-A-Bell-Metal
			elastic_modulus: 100e9,
			electrical_conductivity: 0.07*CONSTANTS.iacs,
			elongation: 0.005,
			density: 8600,
			melt: 820+CONSTANTS.celsius,
			poissons_ratio: 0.34,
			specific_heat_capacity: 360,
			tensile_strength: 240e6,
			thermal_expansion_coefficient: 18e6,
			yield_strength: 210e6,
		})),
		new Alloy('Bronze (Bismuth)', {
			Cu: 0.86,
			Sn: 0.12,
			Bi: 0.02,
		}, new AlloyProperties({
			density: 8885,
			// https://www.makeitfrom.com/material-properties/UNS-C89320-Bismuth-Bronze
			elastic_modulus: 110e9,
			electrical_conductivity: 0.15*CONSTANTS.iacs,
			elongation: 0.17,
			melt: 930+CONSTANTS.celsius,
			poissons_ratio: 0.34,
			specific_heat_capacity: 360,
			tensile_strength: 270e6,
			thermal_conductivity: 56,
			thermal_expansion_coefficient: 17e-6,
			yield_strength: 140e6,
		})),
		new Alloy('Bronze (French)', {
			Cu: 0.91,
			Zn: 0.06,
			Sn: 0.02,
			Pb: 0.01,
		}),
		new Alloy('Bronze (Italian)', {
			// https://it.wikipedia.org/wiki/Bronzital
			Cu: 0.92,
			Al: 0.06,
			Ni: 0.02,
		}),
		new Alloy('Bronze (Oilite)', {
			Cu: 0.89,
			Sn: 0.1,
			Fe: 0.01,
		}, new AlloyProperties({
			density: 6600,
			tensile_strength: 97e6,
			yield_strength: 76e6,
		})),
		new Alloy('Bronze (Phosphor)', {
			Cu: 0.9407,
			Sn: 0.0575,
			P: 0.0018,
		}, new AlloyProperties({
			// Electrical resistivity article
			electrical_conductivity: 8.94e6,
			// https://www.makeitfrom.com/material-properties/EN-CC481K-CuSn11P-C-Phosphor-Bronze
			density: 8700,
			elastic_modulus: 110e6,
			elongation: 0.045,
			melt: 880+CONSTANTS.celsius,
			poissons_ratio: 0.34,
			specific_heat_capacity: 370,
			tensile_strength: 350e6,
			thermal_conductivity: 64,
			thermal_expansion_coefficient: 18e-6,
			yield_strength: 180e6,
		})),
		new Alloy('Bronze (Plastic)', {
			// based on https://encyclopedia2.thefreedictionary.com/plastic+bronze
			Cu: 0.62,
			Pb: 0.3,
			Sn: 0.08,
		}),
		new Alloy('Bronze (Silicon)', {
			Cu: 0.82,
			Zn: 0.14,
			Si: 0.04,
		}, new AlloyProperties({
			// https://www.makeitfrom.com/material-properties/UNS-C87200-Silicon-Bronze
			density: 8600,
			elastic_modulus: 110e6,
			electrical_conductivity: 0.06*CONSTANTS.iacs,
			elongation: 0.3,
			melt: 860+CONSTANTS.celsius,
			poissons_ratio: 0.34,
			specific_heat_capacity: 410,
			tensile_strength: 380e6,
			thermal_conductivity: 28,
			thermal_expansion_coefficient: 17e-6,
			yield_strength: 170e6,
		})),
		new Alloy('Bronze (Speculum metal)', {
			Cu: 2/3,
			Sn: 1/3,
		}),
		new Alloy('Bronze (White)', {
			Cu: 0.55,
			Sn: 0.3,
			Zn: 0.15,
		}),
		new Alloy('Cast Iron', {
			Fe: 0.95,
			C: 0.03,
			Si: 0.02,
		}),
		new Alloy('Cast Iron (Ductile)', {
			Fe: 0.9338,
			C: 0.0335,
			Si: 0.0175,
			Ni: 0.01,
			Mn: 0.0025,
			Cu: 0.001,
			Mg: 0.0007,
			Cr: 0.0007,
			P: 0.0003,
		}, new AlloyProperties({
			elongation: 0.18,
			tensile_strength: 483e6,
			yield_strength: 365e6,
			// https://www.makeitfrom.com/material-properties/Austempered-Ductile-Cast-Iron
			density: 7500,
			elastic_modulus: 180e6,
			elongation: (0.011+0.13)/2,
			melt: 1340+CONSTANTS.celsius,
			poissons_ratio: 0.29,
			specific_heat_capacity: 490,
			thermal_conductivity: 42,
			thermal_expansion_coefficient: 13e-6,
		})),
		new Alloy('Cast Iron (Grey)', {
			Fe: 0.9475,
			C: 0.0325,
			Si: 0.02,
		}, new AlloyProperties({
			elongation: 0.005,
			tensile_strength: 345e6,
			// https://www.makeitfrom.com/material-properties/Grey-Cast-Iron
			density: 7500,
			elastic_modulus: 180e9,
			electrical_conductivity: 0.074*CONSTANTS.iacs,
			melt: 1180+CONSTANTS.celsius,
			poissons_ratio: 0.29,
			specific_heat_capacity: 490,
			thermal_conductivity: 46,
			thermal_expansion_coefficient: 11e-6,
			yield_strength: (98e6+290e6)/2,
		})),
		new Alloy('Cast Iron (Malleable)', {
			Fe: 0.9595,
			C: 0.025,
			Si: 0.01,
			Mn: 0.0055,
		}, new AlloyProperties({
			elongation: 0.12,
			tensile_strength: 359e6,
			yield_strength: 228e6,
			// https://www.makeitfrom.com/material-properties/Automotive-Malleable-Cast-Iron
			density: 7600,
			elastic_modulus: 180e9,
			electrical_conductivity: 0.074*CONSTANTS.iacs,
			melt: 1370+CONSTANTS.celsius,
			poissons_ratio: 0.29,
			specific_heat_capacity: 480,
			thermal_conductivity: 41,
			thermal_expansion_coefficient: 14e-6,
		})),
		new Alloy('Cast Iron (Ni-resist)', {
			Fe: 0.715,
			Ni: 0.2,
			C: 0.03,
			Cr: 0.025,
			Si: 0.02,
			Mn: 0.01,
		}, new AlloyProperties({
			elongation: 0.02,
			tensile_strength: 186e6,
			// https://www.makeitfrom.com/material-properties/Austenitic-Grey-Cast-Iron-Ni-Resist
			density: 7900,
			elastic_modulus: 180e9,
			melt: (1290+1350)/2+CONSTANTS.celsius,
			poissons_ratio: 0.295,
			specific_heat_capacity: 480,
			thermal_expansion_coefficient: 13.5e-6,
		})),
		new Alloy('Cast Iron (White)', {
			Fe: 0.953,
			C: 0.034,
			Si: 0.007,
			Mn: 0.006,
		}, new AlloyProperties({
			elongation: 0,
			tensile_strength: 172e6,
		})),
		new Alloy('Cerrolow', {
			// 136
			Bi: 0.49,
			In: 0.21,
			Pb: 0.18,
			Sn: 0.12,
		}, new AlloyProperties({
			melt: 58+CONSTANTS.celsius,
		})),
		new Alloy('Cerrosafe', {
			Bi: 0.425,
			Pb: 0.377,
			Sn: 0.113,
			Cd: 0.085,
		}, new AlloyProperties({
			melt: 74+CONSTANTS.celsius,
		})),
		// for coal ash, see
		// https://en.wikipedia.org/wiki/Coal_combustion_products#Chemical_composition_and_classification
		// see coal composition helper spreadsheet
		// https://docs.google.com/spreadsheets/d/1bFXWlRE9ocEt8jXoN6eQbcedyx38dnhC3vkia68eJdg/edit?gid=0#gid=0
		new Alloy('Coal (Anthracite, Meta-)', {
			C:  0.8697,
			O:  0.0841,
			Si: 0.0122,
			Fe: 0.0115,
			H:  0.0085,
			Al: 0.0069,
			S:  0.0040,
			Ca: 0.0030,
		}, new AlloyProperties({
			// graphite
			density: (2090+2230)/2,
			// Electrical resistivity article
			electrical_conductivity: 2.5e5,
		})),
		new Alloy('Coal (Anthracite, Mid-)', {
			C:  0.8380,
			O:  0.0995,
			Si: 0.0153,
			H:  0.0145,
			Fe: 0.0143,
			Al: 0.0087,
			S:  0.0059,
			Ca: 0.0038,
		}),
		new Alloy('Coal (Anthracite, Semi-)', {
			C:  0.8115,
			O:  0.0994,
			H:  0.0208,
			Si: 0.0184,
			Fe: 0.0172,
			Al: 0.0104,
			S:  0.0077,
			Ca: 0.0046,
		}),
		new Alloy('Coal (Bituminous, Low-Volatile)', {
			C:  0.7910,
			O:  0.1117,
			H:  0.0301,
			S:  0.0235,
			Si: 0.0158,
			Fe: 0.0143,
			Al: 0.0087,
			Ca: 0.0038,
		}),
		new Alloy('Coal (Bituminous, Medium-Volatile)', {
			C:  0.7810,
			O:  0.1133,
			H:  0.0401,
			S:  0.0235,
			Si: 0.0153,
			Fe: 0.0143,
			Al: 0.0087,
			Ca: 0.0038,
		}),
		new Alloy('Coal (Bituminous, High-Volatile)', {
			C:  0.7739,
			O:  0.1139,
			H:  0.0472,
			S:  0.0235,
			Si: 0.0153,
			Fe: 0.0143,
			Al: 0.0087,
			Ca: 0.0038,
		}),
		new Alloy('Coal (Sub-bituminous)', {
			C:  0.6194,
			O:  0.2757,
			H:  0.0677,
			Si: 0.0137,
			Al: 0.0078,
			Ca: 0.0073,
			S:  0.0055,
			Fe: 0.0029,
		}),
		new Alloy('Coal (Lignite)', {
			C:  0.4574,
			O:  0.3988,
			H:  0.0669,
			Ca: 0.0274,
			Si: 0.0196,
			Al: 0.0166,
			Fe: 0.0093,
			S:  0.0040,
		}),
		new Alloy('Constantan', {
			Cu: 0.55,
			Ni: 0.45,
		}, new AlloyProperties({
			curie_temperature: 35,
			density: 8885,
			elastic_modulus: 162e9,
			electrical_conductivity: 1/0.56e-6,
			elongation: 0.45,
			melt: 1210+CONSTANTS.celsius,
			specific_heat_capacity: 390,
			tensile_strength: 450e6,
			thermal_expansion_coefficient: 14.9e-6,
			youngs_modulus: 162e9,
		})),
		new Alloy('Cunife', {
			Cu: 0.6,
			Ni: 0.2,
			Fe: 0.175,
			Co: 0.025,
		}),
		new Alloy('Cupronickel', {
			// https://en.wikipedia.org/wiki/Cupronickel#Physical_and_mechanical_properties
			// 90-10
			Cu: 0.876,
			Ni: 0.1,
			Fe: 0.014,
			Mn: 0.01
		}, new AlloyProperties({
			density: 8900,
			elastic_modulus: 135e9,
			electrical_conductivity: 1/(19e-6*1e-2),
			melt: (1100+1145)/2+CONSTANTS.celsius,
			specific_heat_capacity: 377,
			tensile_strength: 275e6,
			thermal_conductivity: 40,
			thermal_expansion_coefficient: 17e-6,
			yield_strength: 105e-6,
		})),
		new Alloy('CuSil', {
			Ag: 0.72,
			Cu: 0.28,
		}, new AlloyProperties({
			density: 10000,
			melt: 1050,
			thermal_conductivity: 371,
		})),
		new Alloy('Dymalloy', {
			Ag: 0.8,
			Cu: 0.2,
		}),
		new Alloy('Earth\'s Crust', {
			O: 0.461,
			Si: 0.282,
			Al: 0.0823,
			Fe: 0.0563,
			Ca: 0.0415,
			Na: 0.0236,
			Mg: 0.0233,
			K: 0.0209,
			Ti: 0.00565,
		}),
		new Alloy('Electrum', {
			Ag: 0.5,
			Au: 0.5,
		}),
		new Alloy('Elinvar', {
			Fe: 0.52,
			Ni: 0.36,
			Cr: 0.12,
		}),
		new Alloy('Fernico', {
			Fe: 0.535,
			Ni: 0.29,
			Co: 0.17,
			Mn: 0.003,
			Si: 0.002,
		}, new AlloyProperties({
			thermal_expansion_coefficient: 6.5e-6,
		})),
		new Alloy('Ferroaluminum', {
			Fe: 0.5,
			Al: 0.5,
		}, new AlloyProperties({
			melt: (1160+1250)/2 + CONSTANTS.celsius,
		})),
		new Alloy('Ferrochrome', {
			Fe: 0.4,
			Cr: 0.6,
		}),
		new Alloy('Ferrovanadium', {
			Fe: 0.4,
			V: 0.6,
		}, new AlloyProperties({
			melt: 1750,
		})),
		new Alloy('Field\'s metal', {
			In: 0.51,
			Bi: 0.325,
			Sn: 0.165,
		}, new AlloyProperties({
			melt: 62 + CONSTANTS.celsius,
		})),
		new Alloy('Galinstan', {
			Ga: 0.685,
			In: 0.215,
			Sn: 0.1,
		}, new AlloyProperties({
			density: 6440,
			melt: -19 + CONSTANTS.celsius,
			specific_heat_capacity: 296,
		})),
		new Alloy('Gold (American Bullion Coin)', {
			Au: 0.9167,
			Cu: 0.0533,
			Ag: 0.03,
		}),
		// https://web.archive.org/web/20180730063422/https://link.springer.com/content/pdf/10.1007/BF03214796.pdf
		new Alloy('Gold (Black)', {
			Au: 0.75,
			Co: 0.25,
		}),
		new Alloy('Gold (Blue, Gallium)', {
			Au: 0.585,
			Ga: 0.415,
		}),
		new Alloy('Gold (Blue, Indium)', {
			In: 0.54,
			Au: 0.46,
		}),
		new Alloy('Gold (Blue, Iron)', {
			Au: 0.75,
			Fe: 0.244,
			Ni: 0.006,
		}),
		new Alloy('Gold (Crown)', {
			Au: 11/12,
			Cu: 1/12,
		}),
		new Alloy('Gold (Green)', {
			Au: 0.785,
			Ag: 0.215,
		}),
		new Alloy('Gold (Pink)', {
			Au: 0.75,
			Cu: 0.2,
			Ag: 0.05,
		}),
		new Alloy('Gold (Purple)', {
			Au: 0.79,
			Al: 0.21,
		}),
		new Alloy('Gold (Red)', {
			Au: 0.75,
			Cu: 0.25,
		}),
		new Alloy('Gold (Rose)', {
			Au: 0.75,
			Cu: 0.2225,
			Ag: 0.0275,
		}),
		new Alloy('Gold (Spangold)', {
			Au: 0.76,
			Cu: 0.19,
			Al: 0.05,
		}),
		new Alloy('Gold (White)', {
			Au: 0.9,
			Ni: 0.1,
		}),
		new Alloy('Guanín', {
			Au: 18/32,
			Cu: 8/32,
			Ag: 6/32,
		}),
		new Alloy('Havar', {
			Co: 0.42,
			Cr: 0.195,
			Fe: 0.1905,
			Ni: 0.127,
			W: 0.027,
			Mo: 0.022,
			Mn: 0.016,
			C: 0.002,
			Be: 0.0005,
		}, new AlloyProperties({
			// https://www.azom.com/article.aspx?ArticleID=7658
			density: (7700+8030)/2,
			elastic_modulus: 200e9,
			elongation: 0.15,
			melt: 1480 + CONSTANTS.celsius,
			poissons_ratio: 0.285,
			tensile_strength: 1158e6,
			thermal_conductivity: 42.7,
			yield_strength: 1034e6,
		})),
		new Alloy('Hepatizon', {
			Cu: 0.84,
			Ag: 0.08,
			Au: 0.08,
		}),
		new Alloy('Iconel', {
			// 718
			Ni: 0.525,
			Cr: 0.19,
			Fe: 0.18925,
			Nb: 0.05125,
			Mo: 0.0305,
			Ti: 0.009,
			Al: 0.005,
		}, new AlloyProperties({
			melt: 1260 + CONSTANTS.celsius,
		})),
		new Alloy('Invar', {
			Fe: 0.64,
			Ni: 0.36,
		}, new AlloyProperties({
			density: 8050,
			electrical_conductivity: 1/(8.2e-5*1e-2),
			melt: 1427 + CONSTANTS.celsius,
			thermal_expansion_coefficient: 1.2e-6,
		})),
		new Alloy('Irogane (Karakane)', {
			Cu: 0.85,
			Pb: 0.1,
			Sn: 0.05,
		}),
		new Alloy('Irogane (Kuromido)', {
			Cu: 0.99,
			As: 0.01,
		}),
		new Alloy('Irogane (Shakudo)', {
			Cu: 0.955,
			Au: 0.045,
		}),
		new Alloy('Irogane (Shibuichi)', {
			Cu: 0.75,
			Ag: 0.25,
		}),
		new Alloy('Irogane (Shinchu)', {
			Cu: 0.795,
			Zn: 0.175,
			Pb: 0.03,
		}),
		new Alloy('Kanthal', {
			Fe: 0.6925,
			Cr: 0.25,
			Al: 0.0575,
		}, new AlloyProperties({
			electrical_conductivity: 1/(1.4e-6),
			melt: 1425 + CONSTANTS.celsius,
			thermal_expansion_coefficient: 49e-6,
		})),
		new Alloy('Kovar', {
			Fe: 0.535,
			Ni: 0.29,
			Co: 0.17,
			Mn: 0.003,
			Si: 0.002,
		}, new AlloyProperties({
			curie_temperature: 435+CONSTANTS.celsius,
			density: 8000,
			electrical_conductivity: 1/(0.49e-6),
			specific_heat_capacity: 0.46,
			thermal_conductivity: 17,
			thermal_expansion_coefficient: 5.5e-6,
			yield_strength: 270e6,
			youngs_modulus: 138e9,
		})),
		new Alloy('Manganin', {
			Cu: 0.842,
			Mn: 0.121,
			Ni: 0.037,
		}, new AlloyProperties({
			density: 8400,
			electrical_conductivity: 1/(45.5e-6*1e-2),
			elongation: 0.5,
			melt: 1020+CONSTANTS.celsius,
			specific_heat_capacity: 405.8,
			tensile_strength: 450e6,
			thermal_conductivity: 22,
			thermal_expansion_coefficient: 16.5e-6,
		})),
		new Alloy('Melchior', {
			Cu: 0.682,
			Ni: 0.3,
			Mn: 0.01,
			Fe: 0.008,
		}),
		// https://oxfordre.com/planetaryscience/display/10.1093/acrefore/9780190647926.001.0001/acrefore-9780190647926-e-206
		new Alloy('Meteoric Iron', {
			// typical composition
			Fe: 0.91,
			Ni: 0.08,
			S: 0.007,
			Co: 0.005,
			P: 0.002,
			C: 0.0004,
		}),
		new Alloy('Meteoric Iron (Antitaenite)', {
			Fe: 0.74,
			Ni: 0.26,
		}),
		new Alloy('Meteoric Iron (Awaruite)', {
			Fe: 0.7,
			Ni: 0.3,
		}, new AlloyProperties({
			density: 8.225*CONSTANTS.water_density,
		})),
		new Alloy('Meteoric Iron (Earth\'s core)', {
			// based primarily on
			// https://en.wikipedia.org/wiki/Planetary_core#Determining_primary_composition_%E2%80%93_Earth
			Fe: 0.85,
			Ni: 0.055,
			Si: 0.03225,
			O: 0.03225,
			S: 0.019,
			Cr: 0.009,
			Co: 0.0025,
			P: 0.002,
			C: 0.002,
			H: 0.001,
		}),
		new Alloy('Meteoric Iron (Kamacite)', {
			Fe: 0.895,
			Ni: 0.1,
			Co: 0.005,
		}, new AlloyProperties({
			density: 7.9*CONSTANTS.water_density,
		})),
		new Alloy('Meteoric Iron (Taenite)', {
			Ni: 0.51,
			Fe: 0.49,
		}, new AlloyProperties({
			density: 8.01*CONSTANTS.water_density,
		})),
		new Alloy('Meteoric Iron (Venus\'s core)', {
			// https://en.wikipedia.org/wiki/Planetary_core#Venus
			Fe: 0.886,
			Ni: 0.055,
			S: 0.051,
			Co: 0.0026,
			// assuming remainder is 50/50 Si and O
			Si: 0.0027,
			O: 0.0027,
		}),
		new Alloy('Mischmetal', {
			Ce: 0.55,
			La: 0.25,
			Nd: 0.15,
			Fe: 0.05,
		}),
		new Alloy('Monel', {
			Ni: 0.665,
			Cu: 0.31,
			Fe: 0.0125,
			Mn: 0.01,
			Si: 0.0025
		}, new AlloyProperties({
			density: 8.8*CONSTANTS.water_density,
			electrical_conductivity: 0.34*CONSTANTS.iacs,
			melt: (1300+1350)/2+CONSTANTS.celsius,
			// Young's modulus article
			youngs_modulus: 180e9
		})),
		new Alloy('Mu-metal', {
			Ni: 0.77,
			Fe: 0.16,
			Cu: 0.05,
			Cr: 0.02,
		}),
		new Alloy('Neodymium magnet', {
			Fe: 0.72,
			Nd: 0.27,
			B: 0.01,
		}, new AlloyProperties({
			// Coercivity article
			coercivity: 875e3,
			curie_temperature: 628,
		})),
		new Alloy('Newton\'s metal', {
			Bi: 8/16,
			Pb: 5/16,
			Sn: 3/16,
		}, new AlloyProperties({
			melt: 97+CONSTANTS.celsius,
		})),
		new Alloy('Nichrome', {
			Ni: 0.8,
			Cr: 0.2,
		}, new AlloyProperties({
			electrical_conductivity: 1/(1.12e-6),
			melt: 1400+CONSTANTS.celsius,
		})),
		new Alloy('Niello', {
			// https://www.researchgate.net/figure/Elemental-composition-of-the-niello-inlays-based-on-the-SEM-EDX-measurements-The-results_tbl2_351438672
			Ag: 0.567,
			Cu: 0.295,
			S: 0.092,
			Hg: 0.046,
		}),
		new Alloy('Nivaflex', {
			// https://generaleressorts.com/wp-content/uploads/2018/03/generale-ressorts-bienne-nivaflex-plus.pdf
			Co: 0.47, // the composition leaves 2% unspecified; I have allocated this to Co
			Ni: 0.21,
			Cr: 0.18,
			Fe: 0.05,
			W: 0.04,
			Mo: 0.04,
			Ti: 0.008,
			Be: 0.002,
		}),
		new Alloy('Panchaloha', {
			Au: 1/5,
			Ag: 1/5,
			Cu: 1/5,
			Zn: 1/5,
			Fe: 1/5,
		}),
		new Alloy('Cantor alloy', {
			Cr: 51.996/280.405,
			Mn: 54.938/280.405,
			Fe: 55.845/280.405,
			Co: 58.933/280.405,
			Ni: 58.693/280.405,
		}),
		new Alloy('Pewter (Asian)', {
			Sn: 0.975,
			Sb: 0.015,
			Cu: 0.01,
		}),
		new Alloy('Pewter (Brittania)', {
			Sn: 0.925,
			Sb: 0.055,
			Cu: 0.02,
		}),
		new Alloy('Pewter (Fine)', {
			Sn: 0.99,
			Cu: 0.01,
		}),
		new Alloy('Pewter (Lay)', {
			Sn: 0.85,
			Pb: 0.15,
		}),
		new Alloy('Pewter (Modern)', {
			Sn: 0.905,
			Sb: 0.075,
			Cu: 0.02,
		}, new AlloyProperties({
			melt: (170+230)/2+CONSTANTS.celsius,
			// https://www.makeitfrom.com/material-properties/Type-2-L13912-Sheet-Pewter
			density: 7300,
			elastic_modulus: 52e9,
			poissons_ratio: 0.35,
			specific_heat_capacity: 220,
			tensile_strength: 60e6,
			thermal_expansion_coefficient: 21e-6,
		})),
		new Alloy('Pewter (Queen\'s metal)', {
			Sn: 9/12,
			Sb: 1/12,
			Pb: 1/12,
			Bi: 1/12,
		}),
		new Alloy('Pewter (Trifle)', {
			Sn: 0.95,
			Pb: 0.04,
			Cu: 0.01,
		}),
		new Alloy('Pig Iron', {
			Fe: 0.9575,
			C: 0.0425,
		}),
		new Alloy('Pig Iron (Nickel)', {
			// formula guesstimated from https://en.wikipedia.org/wiki/Nickel_pig_iron
			Fe: 0.875,
			Ni: 0.085,
			C: 0.04,
		}),
		new Alloy('Pot metal', {
			// common late 19th c. formulation:
			Cu: 0.67,
			Pb: 0.29,
			Sb: 0.04,
		}),
		new Alloy('Rose\'s metal', {
			Bi: 0.5,
			Pb: 0.265,
			Sn: 0.235,
		}, new AlloyProperties({
			melt: 98+CONSTANTS.celsius,
		})),
		new Alloy('Samarium-Cobalt magnet', {
			Co: 0.66,
			Sm: 0.34,
		}, new AlloyProperties({
			// Coercivity article
			coercivity: 1400e3,
			curie_temperature: 1033,
		})),
		new Alloy('Silver (Brittania)', {
			Ag: 23/24,
			Cu: 1/24,
		}),
		new Alloy('Silver (Coin)', {
			Ag: 0.9,
			Cu: 0.1,
		}),
		new Alloy('Silver (Decoplata)', {
			Ag: 0.72,
			Cu: 0.28,
		}),
		new Alloy('Silver (Scandinavian)', {
			Ag: 0.83,
			Cu: 0.17,
		}),
		new Alloy('Silver (Sterling)', {
			Ag: 0.925,
			Cu: 0.075,
		}),
		new Alloy('Sodium-Potassium alloy (Eutectic)', {
			K: 0.77,
			Na: 0.23,
		}, new AlloyProperties({
			density: 866,
			electrical_conductivity: 1/(52.75e-6*1e-2),
			melt: -12.6+CONSTANTS.celsius,
			specific_heat_capacity: 982,
			thermal_conductivity: 22.4,
		})),
		new Alloy('Solder (Lead)', {
			// typical
			Sn: 0.6,
			Pb: 0.4,
		}, new AlloyProperties({
			melt: 183+CONSTANTS.celsius,
			// https://www.makeitfrom.com/material-properties/ISO-Solder-Alloy-114-Pb60Sn40
			density: 9700,
			elastic_modulus: 30e6,
			electrical_conductivity: 0.1*CONSTANTS.iacs,
			elongation: 0.25,
			poissons_ratio: 0.41,
			specific_heat_capacity: 170,
			tensile_strength: 37e6,
			thermal_conductivity: 44,
			thermal_expansion_coefficient: 26e-6,
		})),
		new Alloy('Solder (Lead-free)', {
			// typical
			Ag: 0.64,
			Sn: 0.18,
			Cu: 0.14,
			Zn: 0.04,
		}, new AlloyProperties({
			melt: 217+CONSTANTS.celsius,
		})),
		new Alloy('Steel', {
			Fe: 0.9892,
			C: 0.0108,
		}, new AlloyProperties({
			// article on thermal conductivity
			thermal_conductivity: 45,
			// thermal expansion article
			thermal_expansion_coefficient: 12e-6,
			// https://phys.libretexts.org/Bookshelves/University_Physics/University_Physics_(OpenStax)/Book%3A_University_Physics_I_-_Mechanics_Sound_Oscillations_and_Waves_(OpenStax)/12%3A_Static_Equilibrium_and_Elasticity/12.04%3A_Stress_Strain_and_Elastic_Modulus_(Part_1)
			youngs_modulus: 20e10,
		})),
		new Alloy('Steel (Acmonital)', {
			Fe: 0.799,
			Cr: 0.1825,
			Si: 0.0115,
			Mg: 0.005,
			C: 0.0014,
			S: 0.0003,
			P: 0.0003,
		}),
		new Alloy('Steel (CPM S30V)', {
			Fe: 0.7855,
			Cr: 0.14,
			V: 0.04,
			Mo: 0.02,
			C: 0.0145,
		}),
		new Alloy('Steel (High-speed)', {
			// T1
			Fe: 0.75725,
			W: 0.18,
			Cr: 0.04,
			V: 0.01,
			C: 0.00725,
			Si: 0.003,
			Mn: 0.0025,
		}),
		new Alloy('Steel (Maraging)', {
			// Grade 200
			Fe: 0.6995,
			Ni: 0.18,
			Co: 0.085,
			Mo: 0.0325,
			Ti: 0.002,
			Al: 0.001,
		}, new AlloyProperties({
			density: 8000,
			tensile_strength: 2693e6,
			yield_strength: 2617e6,
		})),
		new Alloy('Steel (Razorblade)', {
			Fe: 0.8615,
			Cr: 0.1325,
			C: 0.006,
		}),
		new Alloy('Steel (Silver)', {
			Fe: 0.97818,
			C: 0.0113,
			Cr: 0.0043,
			Mn: 0.0037,
			Si: 0.0022,
			S: 0.00018,
			P: 0.00014,
		}),
		new Alloy('Steel (Stainless)', {
			// https://en.wikipedia.org/wiki/SAE_304_stainless_steel#Chemical_composition
			Fe: 0.7144,
			Cr: 0.19,
			Ni: 0.095,
			// my impression is that this is a "medium" carbon amt
			C: 0.0006,
		}, new AlloyProperties({
			density: 7750,
			// Electrical resistivity article
			electrical_conductivity: 1.45e6,
			melt: 1427.5+CONSTANTS.celsius,
			// Poisson's ratio article
			poissons_ratio: 0.305,
			tensile_strength: 620e6,
			// thermal expansion article
			thermal_expansion_coefficient: 13.7e-6,
			yield_strength: 210e6,
		})),
		new Alloy('Steel (Stainless, Marine)', {
			// https://en.wikipedia.org/wiki/SAE_316L_stainless_steel
			Fe: 0.6944,
			Cr: 0.17,
			Ni: 0.11,
			Mo: 0.025,
			// based on SAE 304
			C: 0.0006,
		}),
		new Alloy('Steel (Tamahagane)', {
			Fe: 0.994,
			C: 0.006,
		}),
		new Alloy('Steel (Weathering)', {
			// ASTM A242
			Fe: 0.9697,
			Cr: 0.00875,
			Ni: 0.0065,
			Si: 0.005,
			Cu: 0.004,
			Mn: 0.0035,
			C: 0.0012,
			P: 0.00105,
			S: 0.0003,
		}),
		new Alloy('Steel (Wootz)', {
			Fe: 0.9811,
			C: 0.0134 + 0.0031,
			S: 0.0017,
			Si: 0.0004,
			As: 0.0003,
		}),
		new Alloy('Tellurium copper', {
			Cu: 0.994,
			Te: 0.006,
		}),
		new Alloy('Tumbaga', {
			Cu: 0.8,
			Ag: 0.15,
			Au: 0.05,
		}),
		new Alloy('Type metal', {
			Pb: 0.68,
			Sb: 0.205,
			Sn: 0.115,
		}, new AlloyProperties({
			// "Type 3" in table
			melt: 286+CONSTANTS.celsius,
		})),
		new Alloy('Wood\'s metal', {
			Bi: 0.5,
			Pb: 0.267,
			Sn: 0.133,
			Cd: 0.1,
		}, new AlloyProperties({
			elastic_modulus: 12.7e9,
			melt: 70+CONSTANTS.celsius,
			yield_strength: 26.2e6,
		})),
		// continue properties from here
		new Alloy('Wrought Iron', {
			Fe: 0.995,
			C: 0.0015,
			P: 0.00125,
			Si: 0.0011,
			S: 0.0006,
			Mn: 0.00055,
		}, new AlloyProperties({
			density: (7.6+7.9)/2*CONSTANTS.water_density,
			melt: 1540+CONSTANTS.celsius,
			tensile_strength: 303e6,
			yield_strength: 190e6,
			// Young's modulus article
			youngs_modulus: 180e9
		})),
		// pure metals
		new Alloy('Chromium', {Sn: 1}, new AlloyProperties({
			boil: 2944,
			density: 7172,
			electrical_conductivity: 1/125e-9,
			melt: 2180,
			poissons_ratio: 0.21,
			specific_heat_capacity: 449.073,
			thermal_conductivity: 93.9,
			thermal_expansion_coefficient: 4.81e-6,
			youngs_modulus: 279e9,
			//
		})),
		new Alloy('Copper', {Cu: 1}, new AlloyProperties({
			boil: 2835,
			density: 8935,
			electrical_conductivity: 1/16.78e-9,
			melt: 1357.77,
			poissons_ratio: 0.34,
			tensile_strength: 220e6,
			thermal_conductivity: 401,
			thermal_expansion_coefficient: 16.64e-6,
			yield_strength: 70e6,
			youngs_modulus: (110e9+128e9)/2,
		})),
		new Alloy('Gold', {Au: 1}, new AlloyProperties({
			boil: 3243,
			density: 19283,
			electrical_conductivity: 1/22.14e-9,
			melt: 1337.33,
			poissons_ratio: 0.4,
			tensile_strength: 120e6,
			thermal_conductivity: 318,
			thermal_expansion_coefficient: 14.13e-6,
			youngs_modulus: 79e9,
		})),
		new Alloy('Iron', {Fe: 1}, new AlloyProperties({
			boil: 3134,
			// Coercivity article
			coercivity: 0.16e3,
			curie_temperature: 1043,
			electrical_conductivity: 1/96.1e-9,
			density: 7874,
			melt: 1811,
			poissons_ratio: 0.29,
			specific_heat_capacity: 449.458,
			tensile_strength: 350e6,
			thermal_conductivity: 80.4,
			thermal_expansion_coefficient: 12.07e-6,
			yield_strength: 90e6,
			youngs_modulus: 211e9,
		})),
		new Alloy('Nickel', {Sn: 1}, new AlloyProperties({
			boil: 3003,
			density: 8907,
			electrical_conductivity: 1/69.3e-9,
			melt: 1728,
			poissons_ratio: 0.31,
			specific_heat_capacity: 444.176,
			thermal_conductivity: 90.9,
			thermal_expansion_coefficient: 12.83e-6,
			youngs_modulus: 200e9,
		})),
		new Alloy('Silver', {Ag: 1}, new AlloyProperties({
			boil: 2435,
			density: 10503,
			electrical_conductivity: 1/15.87e-9,
			melt: 1234.93,
			poissons_ratio: 0.37,
			thermal_conductivity: 429,
			thermal_expansion_coefficient: 18.92e-6,
			youngs_modulus: 83e9,
		})),
		new Alloy('Tin', {Sn: 1}, new AlloyProperties({
			// white tin unless otherwise specified
			boil: 2875,
			electrical_conductivity: 1/115e-9,
			density: 7289,
			melt: 505.08,
			poissons_ratio: 0.36,
			specific_heat_capacity: 228.389,
			thermal_conductivity: 66.8,
			thermal_expansion_coefficient: 21.76e-6,
			youngs_modulus: 50e9,
		})),
	],
	categories: [
		new AlloyCategory('Ag-Au-Cu', c => 0.5 <= (c.Au||0) + (c.Ag||0) + (c.Cu||0), true,
			new PhaseDiagram({
				src: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Ag-Au-Cu-colours-english.svg',
				type: 'ternary',
				x_min: 0.120833333,
				x_max: 0.885416667,
				y_min: 0.112186272,
				y_max: 0.883277895,
				f: c => {let s = (c.Cu||0)+(c.Ag||0)+(c.Au||0);return {var0: c.Cu/s, var1: c.Ag/s};},
			})
		),
		new AlloyCategory('Al-Cu-Mg', c => 0.5 <= (c.Al||0) + (c.Cu||0) + (c.Mg||0), true,
			new PhaseDiagram({
				src: 'https://mdpi-res.com/materials/materials-16-04384/article_deploy/html/images/materials-16-04384-g001.png',
				type: 'ternary',
				x_min: 0.10,
				x_max: 1.88,
				y_min: -1.27,
				y_max: 0.80,
				f: c => {let s = (c.Al||0)+(c.Cu||0)+(c.Mg||0);return {var0: c.Mg/s, var1: c.Al/s};},
			})
		),
		new AlloyCategory('Ag-Cu-Sn', c => 0.5 <= (c.Ag||0) + (c.Sn||0) + (c.Cu||0), true,
			new PhaseDiagram({
				src: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sn-Ag-Cu-phase-diagram-greek.svg',
				type: 'ternary',
				x_min: 0.175,
				x_max: 0.844010417,
				y_min: 0.213802083,
				y_max: 0.794791667,
				f: c => {let s = (c.Cu||0)+(c.Sn||0)+(c.Ag||0);return {var0: c.Cu/s, var1: c.Sn/s};},
			})
		),
		new AlloyCategory('Al-Fe-Si', c => 0.5 <= (c.Al||0) + (c.Fe||0) + (c.Si||0), true,
			new PhaseDiagram({
				src: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Al-Fe-Si_1.jpg',
				type: 'ternary',
				x_min: 0.133124287,
				x_max: 4.651368307,
				y_min: -3.753225805,
				y_max: 0.827419355,
				f: c => {let s = (c.Si||0)+(c.Fe||0)+(c.Al||0);return {var0: c.Si/s, var1: c.Fe/s};},
			})
		),
		new AlloyCategory('Amalgam', c => 0 < c.Hg),
		new AlloyCategory('Au-Bi-Te', c => 0.5 <= (c.Au||0) + (c.Bi||0) + (c.Te||0), true,
			new PhaseDiagram({
				src: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Ternary_Diagram_Au-Bi-Te.png',
				type: 'ternary',
				x_min: -0.15,
				x_max: 1.15,
				y_min: 0.10,
				y_max: 1.45,
				f: c => {let s = (c.Au||0)+(c.Te||0)+(c.Bi||0);return {var0: c.Au/s, var1: c.Te/s};},
			})
		),
		new AlloyCategory('Bi-Pb-Sn', c => 0.5 <= (c.Pb||0) + (c.Bi||0) + (c.Sn||0), true,
			new PhaseDiagram({
				src: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Britannica_Alloys_Text_Figure_9.jpg',
				type: 'ternary',
				x_min: 0.07,
				x_max: 0.94,
				y_min: 0.07,
				y_max: 0.92,
				f: c => {let s = (c.Sn||0)+(c.Bi||0)+(c.Pb||0);return {var0: c.Sn/s, var1: c.Bi/s};},
			})
		),
		new AlloyCategory('Billon', c => 0.5 < c.Cu && (0 < c.Ag || 0 < c.Au)),
		new AlloyCategory('Brass', c => 0.5 < c.Cu && 0 < c.Zn,
			new PhaseDiagram({
				src: 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Diagramme_binaire_Cu_Zn.svg',
				type: 'linear',
				axis: 'x',
				y: 0.911,
				x_min: 0.089132134,
				x_max: 0.916340891,
				f: c => {return {var0: c.Zn, var1: 0};},
			})
		),
		new AlloyCategory('Bronze', c => 0.5 < c.Cu && 0 < c.Sn,
			new PhaseDiagram({
				src: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Cu-Sn_phase_diagram.jpg',
				type: 'linear',
				axis: 'x',
				y: 0.86188579,
				x_min: 0.116080937,
				x_max: 0.973375932,
				// we need to convert %Sn mass to %Sn mol
				f: c => {return {var0: -10591*c.Sn/(9194*c.Sn - 19785), var1: 0};},
			})
		),
		new AlloyCategory('Cast Iron', c => 0.5 < c.Fe && 0.0214 < c.C && c.C <= 0.0667),
		new AlloyCategory('Coal', c => 0.2 <= c.C, true,
			new PhaseDiagram({
				src: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Coal_Rank_USGS.png',
				type: 'rect',
				x_min: 1.31,
				x_max: 0.14,
				y_min: 1.38,
				y_max: 0.04,
				f: c => {
					let dry = 0;
					let wet = 0;
					let dry_h = 0;
					for (let e in c) {
						wet += c[e];
						if (e === 'H') dry += dry_h = Math.max(0, c.H - 2/16 * (c.O||0));
						else if (e !== 'O') dry += c[e];
					}
					// "percentage of fixed carbon, dry"
					const var1 = (c.C||0) / dry;
					// https://en.wikipedia.org/wiki/Energy_value_of_coal#Chemical_composition
					// in kJ/kg
					const Q = 337*(c.C||0) + 1442*((c.H||0) - (c.O||0)/8) + 93*(c.S||0);
					// "Gross calorific value, BTU/lb, moist" [MAX 16,000]
					const var0 = 100*Q / 2.326 / 16e3;
					return {var0, var1};
				},
			})
		),
		new AlloyCategory('Cr-Fe-Ni', c => 0.5 <= (c.Cr||0) + (c.Fe||0) + (c.Ni||0), true,
			new PhaseDiagram({
				src: 'https://upload.wikimedia.org/wikipedia/commons/d/da/Fe-Cr-Ni-solidus-phase-diagram.svg',
				type: 'ternary',
				x_min: 0.175,
				x_max: 0.844010417,
				y_min: 0.213802083,
				y_max: 0.794791667,
				f: c => {let s = (c.Cr||0)+(c.Fe||0)+(c.Ni||0);return {var0: c.Ni/s, var1: c.Fe/s};},
			})
		),
		new AlloyCategory('Cupronickel', c => 0.5 < c.Cu && 0 < c.Ni),
		new AlloyCategory('Fe-C<8', c => 0.5 < c.Fe && c.C <= 0.08, true,
			new PhaseDiagram({
				src: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/FeC-phase-diagram--multilingual.svg',
				type: 'linear',
				axis: 'x',
				y: 0.76,
				x_min: 0.11,
				x_max: 11.37,
				f: c => {return {var0: c.C, var1: 0};},
			})
		),
		new AlloyCategory('High-entropy alloy', c => {let s = 0; for (let e in c){if (0.05 <= c[e]) s+=1;} return 5 <= s;}),
		new AlloyCategory('Li-O-W', c => 0.5 <= (c.Li||0) + (c.O||0) + (c.W||0), true,
			new PhaseDiagram({
				src: 'https://upload.wikimedia.org/wikipedia/commons/3/30/PhasendreieckLiWO.jpg',
				type: 'ternary',
				x_min: 0.03,
				x_max: 0.64,
				y_min: 0.08,
				y_max: 0.94,
				f: c => {let s = (c.W||0)+(c.Li||0)+(c.O||0);return {var0: c.W/s, var1: c.Li/s};},
			})
		),
		new AlloyCategory('Pewter', c => 0.5 < c.Sn),
		new AlloyCategory('Stainless Steel', c => 0.5 < c.Fe && 0.0002 <= c.C && c.C <= 0.0214 && 0.105 <= c.Cr),
		new AlloyCategory('Steel', c => 0.5 < c.Fe && 0.0002 <= c.C && c.C <= 0.0214),
	],
	config: {
		estimation: {
			exponent: 2,
		},
		exponent: 2,
		phaseDiagrams: {
			size: "50vh",
		},
		slider_notches: 100,
	},
	elem: {
		/** @type {HTMLUListElement} */
		categories: undefined,
		/** @returns {HTMLDivElement} */
		get container(){
			return document.getElementById('alloy_container');
		},
		/** @type {HTMLTableCellElement} */
		leftCol: undefined,
		/** @type {HTMLDivElement} */
		phases: undefined,
		/** @type {HTMLTableCellElement} */
		rightCol: undefined,
		/** @type {HTMLDivElement} */
		result: undefined,
	},
	/** @type {ChemicalElement[]} */
	elements: [
		// 24
		new ChemicalElement('aluminum', 'Al', ElementCategory.METAL_POSTTRANS),
		new ChemicalElement('antimony', 'Sb', ElementCategory.METALLOID),
		new ChemicalElement('bismuth', 'Bi', ElementCategory.METAL_POSTTRANS),
		new ChemicalElement('calcium', 'Ca', ElementCategory.METAL_AE),
		new ChemicalElement('carbon', 'C', ElementCategory.NONMETAL),
		new ChemicalElement('chromium', 'Cr', ElementCategory.METAL_TRANS),
		new ChemicalElement('cobalt', 'Co', ElementCategory.METAL_TRANS),
		new ChemicalElement('copper', 'Cu', ElementCategory.METAL_TRANS),
		new ChemicalElement('gold', 'Au', ElementCategory.METAL_TRANS),
		new ChemicalElement('iron', 'Fe', ElementCategory.METAL_TRANS),
		new ChemicalElement('lead', 'Pb', ElementCategory.METAL_POSTTRANS),
		new ChemicalElement('magnesium', 'Mg', ElementCategory.METAL_AE),
		new ChemicalElement('mercury', 'Hg', ElementCategory.METAL_POSTTRANS),
		new ChemicalElement('manganese', 'Mn', ElementCategory.METAL_TRANS),
		new ChemicalElement('molybdenum', 'Mo', ElementCategory.METAL_TRANS),
		new ChemicalElement('nickel', 'Ni', ElementCategory.METAL_TRANS),
		new ChemicalElement('oxygen', 'O', ElementCategory.NONMETAL),
		new ChemicalElement('phosphorus', 'P', ElementCategory.NONMETAL),
		new ChemicalElement('silicon', 'Si', ElementCategory.METALLOID),
		new ChemicalElement('silver', 'Ag', ElementCategory.METAL_TRANS),
		new ChemicalElement('sulfur', 'S', ElementCategory.NONMETAL),
		// new ChemicalElement('tellurium', 'Te', ElementCategory.METALLOID),
		new ChemicalElement('tin', 'Sn', ElementCategory.METAL_POSTTRANS),
		new ChemicalElement('titanium', 'Ti', ElementCategory.METAL_TRANS),
		new ChemicalElement('zinc', 'Zn', ElementCategory.METAL_POSTTRANS),
	],
	init(){
		if (typeof this.elem.container === 'undefined'){
			setTimeout(() => this.init(), 100);
			return;
		}
		// ok now continue
		// normalization button
		const normalize = document.createElement('span');
		normalize.classList.add('button');
		normalize.innerHTML = 'Normalize';
		normalize.onclick = () => this.normalize();
		this.elem.container.appendChild(normalize);
		// top row
		this.initSliders();
		const layoutTable = document.createElement('table');
		layoutTable.classList.add('layoutTable');
		this.elem.container.appendChild(layoutTable);
		const row = document.createElement('tr');
		layoutTable.appendChild(row);
		const leftCol = this.elem.leftCol = document.createElement('td');
		row.appendChild(leftCol);
		const rightCol = this.elem.rightCol = document.createElement('td');
		row.appendChild(rightCol);
		// left col
		this.initResult();
		this.initProperties();
		this.initCategories();
		// right col
		this.initPhases();
		this.refresh();
		console.info('alloy.js initialized');
		this.verify();
	},
	initCategories(){
		const cat_header = document.createElement('h2');
		cat_header.innerHTML = 'Categories';
		this.elem.leftCol.appendChild(cat_header);
		const category_container = this.elem.categories = document.createElement('ul');
		category_container.id = 'categoryContainer';
		this.elem.leftCol.appendChild(category_container);
		// generate gold purity categories
		for (let i = 1; i <= 24; i++){
			this.categories.push(new AlloyCategory(`${i}K Gold`,
				c => Math.round(c.Au * 24) == i
			));
		}
	},
	initPhases(){
		const phases_header = document.createElement('h2');
		phases_header.innerHTML = 'Phase Diagrams';
		this.elem.rightCol.appendChild(phases_header);
		const phases = this.elem.phases = document.createElement('div');
		phases.id = 'phases';
		this.elem.rightCol.appendChild(phases);
	},
	initProperties(){
		const prop_header = document.createElement('h2');
		prop_header.innerHTML = 'Properties';
		this.elem.leftCol.appendChild(prop_header);

		const warning = document.createElement('p');
		warning.innerHTML = 'WARNING: this section is very WIP';
		this.elem.leftCol.appendChild(warning);

		const property_table = this.elem.categories = document.createElement('table');
		property_table.id = 'propertyTable';
		this.elem.leftCol.appendChild(property_table);
		// gen rows
		AlloyProperties.PROPERTY_LIST.forEach(un => {
			const [unit, name] = un;
			const row = document.createElement('tr');
			property_table.appendChild(row);
			const th = document.createElement('th');
			th.innerHTML = name.replaceAll('_', ' ');
			row.appendChild(th);
			const td = document.createElement('td');
			td.id = `propertyTable_${name}`;
			row.appendChild(td);
		});
	},
	initResult(){
		const result_header = document.createElement('h2');
		result_header.innerHTML = 'Matches';
		this.elem.leftCol.appendChild(result_header);
		const result = this.elem.result = document.createElement('div');
		result.id = 'result';
		this.elem.leftCol.appendChild(result);
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
			label.innerHTML = `<div><a href="https://en.wikipedia.org/wiki/${e.name}">${e.name}</a> (<abbr style="color:${ElementCategory.color(e.cat)}" title="${e.cat}">${e.sym}</abbr>) = <span id="${e.slider_id}-n">${slider.value}</span>%</div>`;
			label.onkeyup = label.onmousemove = label.onclick = () => {
				// update the n for this slider
				e.updateSliderNumber();
				// update result
				this.refresh();
			};
			label.appendChild(slider);
			slider_container.appendChild(label);
		});
	},
	nearest(composition){
		const errors = this.alloys.map(a => [a, a.dist(composition)]);
		errors.sort((a, b) => a[1] - b[1]);
		return errors;
	},
	nearestProperties(composition){
		const nearest = this.nearest(composition);
		const o = new AlloyProperties();
		AlloyProperties.PROPERTY_LIST
			.forEach(x => {
				const [unit, name] = x;
				const matches = nearest.filter(a => typeof a[0].properties[name] !== 'undefined');
				if (matches.length === 0){
					return;
				}
				if (matches[0][1] === 0){
					// exact match
					o[name] = alloy.properties[name];
				}
				else {
					// Inverse distance weighting
					let weights = 0;
					let values = 0;
					matches.forEach(match => {
						const [alloy, dist] = match;
						const weight = Math.pow(dist, -this.config.estimation.exponent);
						weights += weight;
						values += alloy.properties[name] * weight;
					});
					o[name] = values/weights;
				}
				o[name+'_source'] = matches[0][0];
			});
		return o;
	},
	normalize(){
		const sum = this.elements.map(e => +e.slider.value).reduce((a, b) => a+b, 0);
		this.elements.forEach(e => {
			e.slider.value *= this.config.slider_notches/sum;
			e.updateSliderNumber();
		});
		this.refresh();
	},
	/** @param {number} f */
	rarityColor(f){
		return [
			'violet',
			'lightcoral',
			'burlywood',
			'palegreen',
			'cornflowerblue',
			'white',
			'silver',
		][Math.floor(-Math.log2(f))] || 'grey';
	},
	refresh(){
		// get current slider states
		const composition = {};
		this.elements.forEach(e => composition[e.sym] = e.slider.value/this.config.slider_notches);
		const errors = this.nearest(composition);
		// blank current output
		const result = this.elem.result;
		result.innerHTML = '';
		// list all items in errors, up to 10 max!
		for (let i = 0; i < Math.min(errors.length, 9); i++) {
			const entry = document.createElement('div');
			const alloy = errors[i][0];
			entry.innerHTML = `#${i+1} (dist: ${Math.pow(errors[i][1], 1/this.config.exponent).toFixed(3)}): <span class="answer">${alloy.name}</span>`;
			entry.appendChild(alloy.gotoElem);
			entry.appendChild(alloy.shortDescElem);
			result.appendChild(entry);
		}
		// refresh categories
		this.elem.categories.innerHTML = '';
		this.elem.phases.innerHTML = '';
		this.categories.forEach(cat => {
			if (cat.filter(composition)){
				if (!cat.hidden){
					this.elem.categories.appendChild(cat.matchElem);
				}
				// refresh phases
				if (typeof cat.phaseDiagram !== 'undefined'){
					this.elem.phases.appendChild(cat.phaseDiagram.elem(composition));
				}
			}
		});
		// refresh properties
		const properties = this.nearestProperties(composition);
		AlloyProperties.PROPERTY_LIST.forEach(x => {
			const [unit, name] = x;
			const td = document.getElementById(`propertyTable_${name}`);
			td.innerHTML = `${properties[name]} ${unit}`;
			/** @type {Alloy} */
			const src = properties[`${name}_source`];
			td.title = `primary source of estimate (full estimate uses IDW): ${src && src.name}`;
		});
	},
	setSliders(composition = {}){
		this.elements.forEach(e => {
			e.slider.value = composition[e.sym]*this.config.slider_notches || 0;
			// refresh slider numbers
			e.updateSliderNumber();
		});
		this.refresh();
	},
	verify(){
		const seen = [];
		this.alloys.forEach(a => {
			let sum = 0;
			for (let e in a.composition){
				seen.push(e);
				sum += a.composition[e];
			}
			// warn about alloy % not adding to 100
			if (0.01 < Math.abs(1-sum)){
				console.warn(`composition of |${a.name}| does not sum closely to 1: |${sum}|`);
			}
		});
		// warn about missing elements
		(new Set(seen)).forEach(x => {
			if (!this.elements.some(e => e.sym === x)){
				const count = seen.filter(e => e === x).length;
				console.warn(`element |${x}| appears in ${count} alloy(s) but is undefined`);
			}
		});
	}
};

ALLOY.init();