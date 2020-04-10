/* jshint esversion: 6, strict: true, strict: global */
'use strict';

// classes

class Complex {
	/**
	 * @param {number|string} real - alternatively, a string
	 * @param {number} imag
	*/
	constructor(real = 0, imag = 0){
		if (typeof real === "string"){
			return Complex.parse(real);
		}
		this.real = real;
		this.imag = imag;
	}
	// basic properties
	get argument(){
		return Math.atan2(this.imag, this.real);
	}
	get conjugate(){
		return new Complex(this.real, -this.imag);
	}
	get magnitude(){
		return Math.sqrt(this.real * this.real + this.imag * this.imag);
	}
	get reciporical(){
		return this.conjugate.mul(Math.pow(this.magnitude, -2));
	}
	// basic binary operations (also recip.)
	/**
	 * @param {number|Complex} other
	 * @return {Complex}
	*/
	add(other){
		if (other instanceof Complex){
			return new Complex(this.real + other.real, this.imag + other.imag);
		}
		return this.add(new Complex(other));
	}
	/**
	 * @param {number|Complex} other
	 * @return {Complex}
	*/
	sub(other){
		if (other instanceof Complex){
			return this.add(other.mul(-1));
		}
		return this.sub(new Complex(other));
	}
	/** @param {number|Complex} other */
	mul(other){
		if (other instanceof Complex){
			return new Complex(this.real * other.real - this.imag * other.imag,
				this.real * other.imag + this.imag * other.real);
		}
		return new Complex(this.real*other, this.imag*other);
	}
	/** @param {number|Complex} other */
	div(other){
		if (other instanceof Complex){
			return this.mul(other.reciporical);
		}
		return this.mul(1/other);
	}
	/** @param {number|Complex} other */
	pow(other){
		return Complex.exp(Complex.log(this).mul(other));
	}
	// exp, sin, cos, tan
	/** @param {number|Complex} z */
	static exp(z){
		if (!(z instanceof Complex)){
			return new Complex(Math.exp(z));
		}
		// e^x (cosy + isiny)
		return Complex.i.mul(Math.sin(z.imag)).add(Math.cos(z.imag)).mul(Math.exp(z.real));
	}
	// log, asin, acos, atan
	/**
	 * @param {number|Complex} z
	 * @param {number|Complex} base
	 * @return {Complex}
	*/
	static log(z, base = Math.E){
		if (!(z instanceof Complex)){
			return Complex.log(new Complex(z), base);
		}
		if (!(base instanceof Complex)){
			return Complex.log(z, new Complex(base));
		}
		// log(r) + i*theta
		if (base.equals(Math.E)){
			return Complex.i.mul(z.argument).add(Math.log(z.magnitude));
		}
		return Complex.log(z).div(Complex.log(base));
	}
	// constants
	static get i(){
		return new Complex(0, 1);
	}
	// etc
	/** @param {number|Complex} other */
	equals(other){
		if (other instanceof Complex){
			return this.real === other.real && this.imag === other.imag;
		}
		return this.real === other && this.imag === 0;
	}
	/** @param {Complex} z*/
	static isFinite(z){
		return isFinite(z.real) && isFinite(z.imag);
	}
	/** @param {string} string */
	static parse(string){
		if (/[^\di.+-]/.test(string)){
			throw RangeError('invalid complex string');
		}
		if (!string.includes('i')){
			return new Complex(parseFloat(string));
		}
		// turn bare i into + or - 1i
		string = string.replace(/(?<=[+-])i/g, '1i');
		// remove i
		string = string.replace('i', '');
		// force -------... into +++++++(-)
		string = string.replace(/--/g, '+');
		// force - and +- and +++++- to +-
		string = string.replace(/\+*-/g, '+-');
		// string now MUST be of form 1.23+(-)4.56
		const [rString, iString] = string.split('+');
		const [r, i] = [parseFloat(rString), parseFloat(iString)];
		return new Complex(r, i);
	}
	toString(){
		return this.real + '+' + this.imag + 'i';
	}
}

// plot object

const plot = {
	/** @type {Function<number, number>} */
	f: Math.tan,
	resolution: 1e3,
	/** @type {[[number, number], [number, number]]} minx maxx miny maxy */
	view: [[-1, 1], [-1, 1]],
	/** @return {HTMLUnknownElement} */
	get element(){
		return document.getElementById('plot');
	},
	/** @return {[number, number]} x, y in px*/
	get origin(){
		return [window.innerWidth/2, window.innerHeight/4];
	},
	/** @return {[number, number]} width, height in px of svg*/
	get screen(){
		return [window.innerWidth, window.innerHeight/2];
	},
	clear(){
		this.element.innerHTML = '';
	},
	/** @param {Function<Complex, Complex>} f */
	cplot(f){
		const xs = linspace(this.view[0][0], this.view[0][1], this.resolution);
		/** @type {Complex[]} */
		const ys = xs.map(f);
		// now, draw the line...
		xs.forEach((x, i) => {
			if (xs.length - 1 <= i){
				return;
			}
			/** @type {[number, Complex]} */
			const coords = [x, ys[i]];
			/** @type {[number, Complex]} */
			const nextCoords = [xs[i+1], ys[i+1]];
			// check for NaN
			if (!Complex.isFinite(ys[i]) || !Complex.isFinite(ys[i+1])){
				return;
			}
			// plot real line
			this.line(this.toPx(coords[0], coords[1].real), this.toPx(nextCoords[0], nextCoords[1].real));
			// plot imag line
			this.line(this.toPx(coords[0], coords[1].imag), this.toPx(nextCoords[0], nextCoords[1].imag), 'orange');
		});
	},
	/**
	 * @param {[number, number]} from
	 * @param {[number, number]} to
	 * @param {string} color
	 */
	line(from, to, color = 'blue'){
		const element = createSvgElement('line');
		element.setAttribute('x1', from[0]);
		element.setAttribute('y1', from[1]);
		element.setAttribute('x2', to[0]);
		element.setAttribute('y2', to[1]);
		element.setAttribute('style', 'stroke:'+color+';stroke-width:2');
		this.element.appendChild(element);
	},
	/** @param {Function<number, number>} f */
	plot(f){
		const xs = linspace(this.view[0][0], this.view[0][1], this.resolution);
		/** @type {number[]} */
		const ys = xs.map(f);
		// now, draw the line...
		xs.forEach((x, i) => {
			if (xs.length - 1 <= i){
				return;
			}
			const coords = [x, ys[i]];
			// confirmed that all before this is correct
			const nextCoords = [xs[i+1], ys[i+1]];
			// check for NaN
			if (!isFinite(ys[i]) || !isFinite(ys[i+1])){
				return;
			}
			// plot line
			this.line(this.toPx(coords[0], coords[1]), this.toPx(nextCoords[0], nextCoords[1]));
		});
	},
	status(e){
		const status = document.getElementById('status');
		if (!e){
			status.classList = 'success';
			status.innerHTML = '✔';
			return;
		}
		status.classList = 'error';
		status.innerHTML = e;
	},
	/**
	 * transform absolute coords to px coords
	 * @param {number} x
	 * @param {number} y
	 * @return {[number, number]}
	 */
	toPx(x, y){
		// x [-1, 1] => [0, 1920]
		// y [-1, 1] => [1080, 0]
		return [remap(x, this.view[0], [0, this.screen[0]]),
			remap(y, this.view[1], [this.screen[1], 0])];
	},
	update(){
		this.status('X');
		// update values
		this.view[0][0] = parseFloat(document.getElementById('xmin').value);
		this.view[0][1] = parseFloat(document.getElementById('xmax').value);
		this.view[1][0] = parseFloat(document.getElementById('ymin').value);
		this.view[1][1] = parseFloat(document.getElementById('ymax').value);
		try {
			if (this.view[0][0] === this.view[0][1] || this.view[1][0] === this.view[1][1]){
				throw new RangeError('min and max can\'t be the same value');
			}
			if (!isFinite(this.view[0][0]) || !isFinite(this.view[0][1]) ||
				!isFinite(this.view[1][0]) || !isFinite(this.view[1][1])){
				throw new RangeError('invalid number');
			}
			this.f = eval('x=>' + document.getElementById('f').value);
		}
		catch (e){
			this.status(e);
			return;
		}
		this.status();
		// plot
		this.clear();
		if (document.getElementById('cmathCheckbox').checked){
			this.cplot(this.f);
		}
		else {
			this.plot(this.f)
		}
	},
	uwu(){
		const element = createSvgElement('text');
		element.innerHTML = 'UwU';
		element.setAttribute('x', this.origin[0]);
		element.setAttribute('y', this.origin[1]);
		this.element.appendChild(element);
	},
	zoom(factor = 1){
		'xmin xmax ymin ymax'.split(' ').forEach(name => {
			const element = document.getElementById(name);
			element.value = parseFloat(element.value) * factor;
		});
		this.update();
	},
};

// functions

// math functions

function linspace(from = 0, to = 1, points = 1){
	return new Array(points).fill(0).map((_, i) => i/points * (to-from) + from);
}

/**
 * n in [a, b] => n* in [c, d] linearly
 * @param {number} n
 * @param {[number, number]} from
 * @param {[number, number]} to
 */
function remap(n, from, to){
	return (n - from[0]) / (from[1] - from[0]) * (to[1] - to[0]) + to[0];
}

// doc functions

/**
 * @param {string} name
 * @return {HTMLUnknownElement}
 */
function createSvgElement(name = 'svg'){
	// https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS
	return document.createElementNS('http://www.w3.org/2000/svg', name);
}

plot.update();
window.addEventListener('error', e => plot.status(e.message));