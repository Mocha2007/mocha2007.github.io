/* jshint esversion: 6, strict: true, strict: global */
'use strict';

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
	/** @param {Complex} z */
	static exp(z){
		// e^x (cosy + isiny)
		return Complex.i.product(Math.sin(z.imag)).add(Math.cos(z.imag)).product(Math.exp(z.real));
	}
	// log, asin, acos, atan
	/** @param {Complex} z */
	static log(z){
		// log(r) + i*theta
		return Complex.i.product(z.argument).add(Math.log(z.magnitude));
	}
	// constants
	static get i(){
		return new Complex(0, 1);
	}
}