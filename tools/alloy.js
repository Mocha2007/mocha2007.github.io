class Alloy {
	/** @param {string} name */
	constructor(name, composition){
		/** @type {string} */
		this.name = name;
		/** elem name -> fraction */
		this.composition = composition;
	}
	/** @returns {HTMLSpanElement} button to set sliders to this alloy */
	get gotoElem(){
		const elem = document.createElement('span');
		elem.classList.add('button');
		elem.innerHTML = '&rarr;';
		elem.onclick = () => ALLOY.setSliders(this.composition);
		return elem;
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

class AlloyCategory {
	/**
	 * @param {string} name
	 * @param {PhaseDiagram?} phaseDiagram
	 * */
	constructor(name, filter, phaseDiagram){
		/** @type {string} */
		this.name = name;
		this.filter = filter;
		/** @type {PhaseDiagram?} */
		this.phaseDiagram = phaseDiagram;
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
	get slider_id(){
		return `slider-${this.sym}`;
	}
	updateSliderNumber(){
		document.getElementById(`${this.slider_id}-n`).innerHTML = document.getElementById(this.slider_id).value;
	}
}

class ElementCategory {
	static NULL = "null";
	static METALLOID = "Metalloid";
	static METAL_TRANS = "Transition Metal";
	static METAL_POSTTRANS = "Post-Transition Metal";
	static NONMETAL = "Nonmetal";
	static color(self){
		switch (self){
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
		console.debug(inputs);
		const coords = this.coords(inputs.var0, inputs.var1);
		marker.style.left = `${coords.x*100}%`;
		marker.style.top = `${coords.y*100}%`;
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
			case "ternary": {
				const var2 = 1-var0-var1;
				// console.debug(var0, var1, var2);
				const y_raw = 1-var2;
				const x_raw = var0 + var2 / 2; //Math.tan(60.0 / 180.0 * Math.PI);
				console.debug(x_raw, y_raw);
				const x = x_raw*(this.x_max - this.x_min) + this.x_min;
				const y = y_raw*(this.y_max - this.y_min) + this.y_min;
				// todo: verify correctness - this formula is a guess
				return {x, y};
			}
			default:
				console.error("unimplemented");
				return {x: 0, y: 0};
		}
	}
}

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
		}),
		new Alloy('Alperm', {
			Fe: 0.84,
			Al: 0.16,
		}),
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
		}),
		new Alloy('Amalgam (Temagamite)', {
			Te: 0.42,
			Pd: 0.36,
			Hg: 0.22,
		}),
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
			Sn: 0.91,
			Cu: 0.045,
			Sb: 0.045,
		}),
		new Alloy('Beryllium Copper', {
			Cu: 0.9825,
			Be: 0.0175,
		}),
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
		}),
		new Alloy('Brass (Cartridge)', {
			Cu: 0.7,
			Zn: 0.3,
		}),
		new Alloy('Brass (Common)', {
			Cu: 0.63,
			Zn: 0.37,
		}),
		new Alloy('Brass (Devarda\'s alloy)', {
			Cu: 0.5,
			Al: 0.45,
			Zn: 0.05,
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
		}),
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
		}),
		new Alloy('Bronze', {
			Cu: 0.88,
			Sn: 0.12,
		}),
		new Alloy('Bronze (Aluminum)', {
			Cu: 0.92,
			Al: 0.08,
		}),
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
		}),
		new Alloy('Bronze (Bismuth)', {
			Cu: 0.86,
			Sn: 0.12,
			Bi: 0.02,
		}),
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
		}),
		new Alloy('Bronze (Phosphor)', {
			Cu: 0.9407,
			Sn: 0.0575,
			P: 0.0018,
		}),
		new Alloy('Bronze (Plastic)', {
			// based on https://encyclopedia2.thefreedictionary.com/plastic+bronze
			Cu: 0.62,
			Pb: 0.3,
			Sn: 0.08,
		}),
		new Alloy('Bronze (Silicon)', {
			Cu: 0.8,
			Zn: 0.14,
			Si: 0.04,
		}),
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
		}),
		new Alloy('Cast Iron (Grey)', {
			Fe: 0.9475,
			C: 0.0325,
			Si: 0.02,
		}),
		new Alloy('Cast Iron (Malleable)', {
			Fe: 0.9595,
			C: 0.025,
			Si: 0.01,
			Mn: 0.0055,
		}),
		new Alloy('Cast Iron (Ni-resist)', {
			Fe: 0.715,
			Ni: 0.2,
			C: 0.03,
			Cr: 0.025,
			Si: 0.02,
			Mn: 0.01,
		}),
		new Alloy('Cast Iron (White)', {
			Fe: 0.953,
			C: 0.034,
			Si: 0.007,
			Mn: 0.006,
		}),
		new Alloy('Cerrosafe', {
			Bi: 0.425,
			Pb: 0.377,
			Sn: 0.113,
			Cd: 0.085,
		}),
		new Alloy('Coal (Anthracite)', {
			C: 0.915,
			S: 0.005,
		}),
		new Alloy('Coal (Bituminous)', {
			C: 0.844,
			O: 0.067,
			H: 0.054,
			S: 0.018,
			N: 0.017,
		}),
		new Alloy('Coal (Sub-bituminous)', {
			// based on https://www.researchgate.net/figure/Characteristics-of-petcoke-and-sub-bituminous-coal_tbl1_262849791
			C: 0.656,
			O: 0.2115,
			H: 0.0453,
			N: 0.0083,
			S: 0.0018,
			Cl: 0.001,
		}),
		new Alloy('Coal (Lignite)', {
			C: 0.3,
			// based on Obomkpa here:
			// https://www.researchgate.net/figure/EDX-Elemental-Composition-of-Nigerian-Lignite-Coals_tbl2_338124784
			// which seems typical?
			O: 0.45,
			Si: 0.15,
			Al: 0.05,
			H: 0.05,
		}),
		new Alloy('Constantan', {
			Cu: 0.55,
			Ni: 0.45,
		}),
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
		}),
		new Alloy('Duralumin', {
			Al: 0.9355,
			Cu: 0.0435,
			Mg: 0.015,
			Mn: 0.006,
		}),
		new Alloy('Dymalloy', {
			Ag: 0.8,
			Cu: 0.2,
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
		}),
		new Alloy('Ferroaluminum', {
			Fe: 0.5,
			Al: 0.5,
		}),
		new Alloy('Ferrochrome', {
			Fe: 0.4,
			Cr: 0.6,
		}),
		new Alloy('Ferrovanadium', {
			Fe: 0.4,
			V: 0.6,
		}),
		new Alloy('Field\'s metal', {
			In: 0.51,
			Bi: 0.325,
			Sn: 0.165,
		}),
		new Alloy('Galinstan', {
			Ga: 0.685,
			In: 0.215,
			Sn: 0.1,
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
		}),
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
		}),
		new Alloy('Invar', {
			Fe: 0.64,
			Ni: 0.36,
		}),
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
		}),
		new Alloy('Kovar', {
			Fe: 0.535,
			Ni: 0.29,
			Co: 0.17,
			Mn: 0.003,
			Si: 0.002,
		}),
		new Alloy('Manganin', {
			Cu: 0.842,
			Mn: 0.121,
			Ni: 0.037,
		}),
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
		}),
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
		}),
		new Alloy('Meteoric Iron (Taenite)', {
			Ni: 0.51,
			Fe: 0.49,
		}),
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
		}),
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
		}),
		new Alloy('Newton\'s metal', {
			Bi: 8/16,
			Pb: 5/16,
			Sn: 3/16,
		}),
		new Alloy('Nichrome', {
			Ni: 0.8,
			Cr: 0.2,
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
		}),
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
		}),
		new Alloy('Samarium-Cobalt magnet', {
			Co: 0.66,
			Sm: 0.34,
		}),
		new Alloy('Sodium-Potassium alloy (Eutectic)', {
			K: 0.77,
			Na: 0.23,
		}),
		new Alloy('Steel', {
			Fe: 0.9892,
			C: 0.0108,
		}),
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
		}),
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
		}),
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
		new Alloy('Silver (Brittania)', {
			Ag: 23/24,
			Cu: 1/24,
		}),
		new Alloy('Silver (Coin)', {
			Ag: 0.9,
			Cu: 0.1,
		}),
		new Alloy('Silver (Sterling)', {
			Ag: 0.925,
			Cu: 0.075,
		}),
		new Alloy('Solder (Lead)', {
			// typical
			Sn: 0.6,
			Pb: 0.4,
		}),
		new Alloy('Solder (Lead-free)', {
			// typical
			Ag: 0.64,
			Sn: 0.18,
			Cu: 0.14,
			Zn: 0.04,
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
		new Alloy('Wood\'s metal', {
			Bi: 0.5,
			Pb: 0.267,
			Sn: 0.133,
			Cd: 0.1,
		}),
		new Alloy('Wrought Iron', {
			Fe: 0.995,
			C: 0.0015,
			P: 0.00125,
			Si: 0.0011,
			S: 0.0006,
			Mn: 0.00055,
		}),
	],
	categories: [
		new AlloyCategory('Ag-Au-Cu', c => 0.5 <= (c.Au||0) + (c.Ag||0) + (c.Cu||0),
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
		new AlloyCategory('Amalgam', c => 0 < c.Hg),
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
		new AlloyCategory('High-entropy alloy', c => {let s = 0; for (let e in c){if (0.05 <= c[e]) s+=1;} return 5 <= s;}),
		new AlloyCategory('Pewter', c => 0.5 < c.Sn),
		new AlloyCategory('Steel', c => 0.5 < c.Fe && 0.0002 <= c.C && c.C <= 0.0214),
		new AlloyCategory('Stainless Steel', c => 0.5 < c.Fe && 0.0002 <= c.C && c.C <= 0.0214 && 0.105 <= c.Cr),
		new AlloyCategory('Cast Iron', c => 0.5 < c.Fe && 0.0214 < c.C && c.C <= 0.0667),
	],
	config: {
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
		/** @type {HTMLDivElement} */
		phases: undefined,
		/** @type {HTMLDivElement} */
		result: undefined,
	},
	/** @type {ChemicalElement[]} */
	elements: [
		new ChemicalElement('aluminum', 'Al', ElementCategory.METAL_POSTTRANS),
		new ChemicalElement('antimony', 'Sb', ElementCategory.METALLOID),
		new ChemicalElement('bismuth', 'Bi', ElementCategory.METAL_POSTTRANS),
		new ChemicalElement('carbon', 'C', ElementCategory.NONMETAL),
		new ChemicalElement('chromium', 'Cr', ElementCategory.METAL_TRANS),
		new ChemicalElement('copper', 'Cu', ElementCategory.METAL_TRANS),
		new ChemicalElement('gold', 'Au', ElementCategory.METAL_TRANS),
		new ChemicalElement('iron', 'Fe', ElementCategory.METAL_TRANS),
		new ChemicalElement('lead', 'Pb', ElementCategory.METAL_POSTTRANS),
		new ChemicalElement('mercury', 'Hg', ElementCategory.METAL_POSTTRANS),
		new ChemicalElement('manganese', 'Mn', ElementCategory.METAL_TRANS),
		new ChemicalElement('nickel', 'Ni', ElementCategory.METAL_TRANS),
		new ChemicalElement('silicon', 'Si', ElementCategory.METALLOID),
		new ChemicalElement('silver', 'Ag', ElementCategory.METAL_TRANS),
		new ChemicalElement('tin', 'Sn', ElementCategory.METAL_POSTTRANS),
		new ChemicalElement('zinc', 'Zn', ElementCategory.METAL_POSTTRANS),
	],
	init(){
		if (typeof this.elem.container === 'undefined'){
			setTimeout(() => this.init(), 100);
			return;
		}
		// ok now continue
		this.initSliders();
		this.initResult();
		this.initCategories();
		this.initPhases();
		this.refresh();
		console.info('alloy.js initialized');
	},
	initCategories(){
		const cat_header = document.createElement('h2');
		cat_header.innerHTML = 'Categories';
		this.elem.container.appendChild(cat_header);
		const category_container = this.elem.categories = document.createElement('ul');
		category_container.id = 'categoryContainer';
		this.elem.container.appendChild(category_container);
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
		this.elem.container.appendChild(phases_header);
		const phases = this.elem.phases = document.createElement('div');
		phases.id = 'phases';
		this.elem.container.appendChild(phases);
	},
	initResult(){
		const result_header = document.createElement('h2');
		result_header.innerHTML = 'Matches';
		this.elem.container.appendChild(result_header);
		const result = this.elem.result = document.createElement('div');
		result.id = 'result';
		this.elem.container.appendChild(result);
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
			label.onmousemove = label.onclick = () => {
				// update the n for this slider
				e.updateSliderNumber();
				// update result
				this.refresh();
			};
			label.appendChild(slider);
			slider_container.appendChild(label);
		});
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
		this.elements.forEach(e => composition[e.sym] = document.getElementById(e.slider_id).value/this.config.slider_notches);
		const errors = this.alloys.map(a => [a, a.dist(composition)]);
		errors.sort((a, b) => a[1] - b[1]);
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
				this.elem.categories.appendChild(cat.matchElem);
				// refresh phases
				if (typeof cat.phaseDiagram !== 'undefined'){
					this.elem.phases.appendChild(cat.phaseDiagram.elem(composition));
				}
			}
		});
	},
	setSliders(composition = {}){
		this.elements.forEach(e => {
			const slider = document.getElementById(e.slider_id);
			slider.value = composition[e.sym]*this.config.slider_notches || 0;
			// refresh slider numbers
			e.updateSliderNumber();
		});
		this.refresh();
	}
};

ALLOY.init();