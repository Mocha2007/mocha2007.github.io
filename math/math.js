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
	/** @return {HTMLUnknownElement} */
	get element(){
		return document.getElementById('plot');
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
};

// functions

/**
 * @param {string} name
 * @return {HTMLUnknownElement}
 */
function createSvgElement(name = 'svg'){
	// https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS
	return document.createElementNS('http://www.w3.org/2000/svg', name);
}

function main(){
	///** @type {HTMLDivElement} */
	/*
	const root = document.getElementById('main');
	root.innerHTML = '';
	// set up graph
	// https://developer.mozilla.org/en-US/docs/Web/SVG/Element/svg
	const svg = createSvgElement();
	*/
	// plot.element.setAttribute('height', window.innerHeight);
	// plot.element.setAttribute('width', window.innerWidth);
}

function test(){
	plot.line([0, 0], [200, 200]);
}

main();
test();