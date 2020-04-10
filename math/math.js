/* jshint esversion: 6, strict: true, strict: global */
'use strict';

// classes

class Complex {
	/**
	 * @param {number} real
	 * @param {number} imag
	*/
	constructor(real = 0, imag = 0){
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
		return this.conjugate.product(Math.pow(this.magnitude, -2));
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
			return this.add(other.product(-1));
		}
		return this.sub(new Complex(other));
	}
	/** @param {number|Complex} other */
	product(other){
		if (other instanceof Complex){
			return new Complex(this.real * other.real - this.imag * other.imag,
				this.real * other.imag + this.imag * other.real);
		}
		return new Complex(this.real*other, this.imag*other);
	}
	/** @param {number|Complex} other */
	quotient(other){
		if (other instanceof Complex){
			return this.product(other.reciporical);
		}
		return this.product(1/other);
	}
	/** @param {number|Complex} other */
	pow(other){
		return Complex.exp(Complex.log(this).product(other));
	}
	// exp, sin, cos, tan
	/** @param {number|Complex} z */
	static exp(z){
		if (!(z instanceof Complex)){
			return new Complex(Math.exp(z));
		}
		// e^x (cosy + isiny)
		return Complex.i.product(Math.sin(z.imag)).add(Math.cos(z.imag)).product(Math.exp(z.real));
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
			return Complex.i.product(z.argument).add(Math.log(z.magnitude));
		}
		return Complex.log(z).quotient(Complex.log(base));
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
	toString(){
		return this.real + '+' + this.imag + 'i';
	}
}

// plot object

const plot = {
	/** @type {Function<number, number>} */
	f: Math.tan,
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
	/**
	 * @param {[number, number]} from
	 * @param {[number, number]} to
	 * @param {string} style
	 */
	line(from, to, style = 'stroke:red;stroke-width:2'){
		const element = createSvgElement('line');
		element.setAttribute('x1', from[0]);
		element.setAttribute('y1', from[1]);
		element.setAttribute('x2', to[0]);
		element.setAttribute('y2', to[1]);
		element.setAttribute('style', style);
		this.element.appendChild(element);
	},
	/**
	 * @param {Function<number, number>} f
	 * @param {number} from
	 * @param {number} to
	 * @param {number} resolution
	 */
	plot(f, from = this.view[0][0], to = this.view[0][1], resolution = 1e3){
		const xs = linspace(from, to, resolution);
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
		this.plot(this.f);
	},
	uwu(){
		const element = createSvgElement('text');
		element.innerHTML = 'UwU';
		element.setAttribute('x', this.origin[0]);
		element.setAttribute('y', this.origin[1]);
		this.element.appendChild(element);
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