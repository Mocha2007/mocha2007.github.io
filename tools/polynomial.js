/* exported Polynomial */

class Polynomial {
	/** @param {number[]} coefficients */
	constructor(...coefficients){
		/** @type {number[]} */
		this.coefficients = coefficients;
	}
	/** derivative */
	get dx(){
		return new Polynomial(...this.coefficients.map((c, i) => c*i).slice(1));
	}
	get span(){
		const elem = document.createElement('span');
		elem.innerHTML = this.coefficients
			.map((c, i) => c ? 1 < i ? `${c}x<sup>${i}</sup>` : 0 < i ? `${c}x` : `${c}` : '')
			.reverse().join(' + ');
		elem.classList.add('polynomial'); // in case we want special styling for this
		return elem;
	}
	/**
	 * nth derivative
	 * @param {number} n
	 * @returns {Polynomial}
	 */
	dn(n){
		if (n < 0){
			throw new RangeError(`n < 0: ${n}`);
		}
		if (n === 0){
			return new Polynomial(...this.coefficients);
		}
		return this.dx.dn(n-1);
	}
	/** @param {number} x */
	f(x){
		return this.coefficients.map((c, i) => c*Math.pow(x, i)).reduce((a, b) => a+b, 0);
	}
}