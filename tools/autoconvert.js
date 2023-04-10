/*
	This script can be placed at the top by using defer:
	<script src="tools/autoconvert.js" defer></script>
	Or at the bottom:
	<script src="tools/autoconvert.js"></script>
	It can also be run at any time using:
	todo
*/
/* globals round */

const autoconvert = {
	className: {
		converted: 'autoconvert-converted',
		unconverted: 'autoconvert-unconverted',
	},
	/** @param {HTMLElement} elem */
	convertElem(elem){
		elem.classList.remove(this.className.unconverted);
		elem.classList.add(this.className.converted);
		// split into number and unit...
		const [number, unit, arg] = elem.innerHTML.split(' ');
		const n = number in this.fractions ? this.fractions[number] : number; // fix &frac12; &c
		if (arg === 'height') // for people's heights (eg 165 cm -> 5'5")
			return this.convertHeight(n, elem);
		if (unit in this.eremoranUnits)
			return this.convertEre(n, unit, elem);
		if (unit === 'K') // treat as temp
			return this.convertTemp(n, elem);
		const [ratio, newUnit] = this.units[unit];
		const decimals = n.split('.')[1];
		const precision = decimals !== undefined ? decimals.length : 0;
		// eslint-disable-next-line max-len
		elem.innerHTML = `<abbr title="${round(n/ratio, precision)} ${newUnit}">${elem.innerHTML}</abbr>`;
	},
	/** @param {HTMLElement} elem */
	convertElemWrapper(elem){
		try {
			this.convertElem(elem);
			this.count++;
		}
		catch (e){
			console.warn(`Error converting ${elem.innerHTML}\n${e}`);
		}
	},
	/**
	 * @param {number} n
	 * @param {string} unit
	 * @param {HTMLElement} elem
	 */
	convertEre(n, unit, elem){
		const u = this.eremoranUnits[unit];
		// eslint-disable-next-line max-len
		elem.innerHTML = `<abbr title="${round(n*u[0], u[2])} ${u[1]}; ${round(n*u[3], u[5])} ${u[4]}">${elem.innerHTML}</abbr>`;
	},
	/**
	 * @param {number} n in centimeters
	 * @param {HTMLElement} elem
	 */
	convertHeight(n, elem){
		const ft = Math.floor(n/30.48);
		const inches = Math.round((n - ft*30.48)/2.54);
		elem.innerHTML = `<abbr title="${ft}′ ${inches}″">${elem.innerHTML}</abbr>`;
	},
	/**
	 * @param {number} n in Kelvins
	 * @param {HTMLElement} elem
	 */
	convertTemp(n, elem){
		const c = Math.round(n - 273.15);
		const f = Math.round(1.8*n - 459.67);
		elem.innerHTML = `<abbr title="${c}°C; ${f}°F">${elem.innerHTML}</abbr>`;
	},
	count: 0,
	fractions: {
		'⅕': '0.2',
		'¼': '0.25',
		'½': '0.5',
		'¾': '0.75',
		'⅘': '0.8',
		'1½': '1.5',
	},
	run(){
		Array.from(document.getElementsByClassName(this.className.unconverted))
			.forEach(elem => this.convertElemWrapper(elem));
		console.info(`Autoconvert provided unit conversions for ${this.count} elements`);
	},
	units: {
		// example translation: IF m THEN USE ft @ RATE 0.3048
		m: [0.3048, 'ft'],
		// rest in alphabetical order
		a: [0.0009290304, 'ft²'],
		cm: [2.54, 'in'],
		ha: [0.40468564224, 'ac'],
		kg: [0.45359237, 'lbs'],
		km: [1.609344, 'mi'],
		'km/h': [1.609344, 'mi/h'],
		mm: [25.4, 'in'],
		mL: [236.6, 'cp'],
		'm²': [0.3048*0.3048, 'ft²'],
	},
	eremoranUnits: {
		// special eremoran units
		edzam: [16.67, 'g', 0, 16.67 / 28.349523125, 'oz', 1],
		se: [2.84, 'mm', 0, 0.284 / 2.54, 'in', 1],
	},
};

autoconvert.run();