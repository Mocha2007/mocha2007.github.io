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
	get magnitude(){
		return Math.sqrt(this.real * this.real + this.imag * this.imag);
	}
	// basic binary operations (also recip.)
	/** @param {number|Complex} other */
	add(other){
		if (other instanceof Complex){
			return new Complex(this.real + other.real, this.imag + other.imag);
		}
		return new Complex(this.real + other, this.imag);
	}
	// constants
	static get i(){
		return new Complex(0, 1);
	}
}