/* exported Polynomial */

class Polynomial {
	/** @param {number[]} coefficients */
	constructor(...coefficients){
		/** @type {number[]} */
		this.coefficients = coefficients;
	}
	get degree(){
		while (this.coefficients[this.coefficients.length-1] === 0){
			this.coefficients.pop();
		}
		return this.coefficients.length-1;
	}
	/** derivative */
	get dx(){
		return new Polynomial(...this.coefficients.map((c, i) => c*i).slice(1));
	}
	get leading_coefficient(){
		return this.coefficients[this.coefficients.length-1];
	}
	/** returns monotonicity, whether it's strictly monotonic or not, and increasing/decreasing as +1/-1 */
	get monotonicity(){
		const f_ = this.dx;
		const zero_slope_points = f_.roots.roots;
		const strict = zero_slope_points.size === 0;
		// it's monotonic if either no f' roots, or if all f' roots are also f'' roots
		const f__ = f_.dx;
		const monotonic = Array.from(zero_slope_points).every(x => f__.f(x) === 0);
		const direction = Math.sign(this.leading_coefficient);
		return {strict, monotonic, direction};
	}
	/** returns all real roots of a polynomial (degrees <= 2 implemented) */
	get roots(){
		let C, Delta0, Delta1, a, b, c, d, discriminant, roots = new Set(), xi;
		switch (this.degree){
			case 0:
			case 1:
				discriminant = 1;
				break;
			case 2:
				[c, b, a] = this.coefficients;
				discriminant = b*b - 4*a*c;
				if (0 <= discriminant){
					// eslint-disable-next-line max-len
					roots = new Set((-b - Math.sqrt(discriminant))/(2*a), (-b + Math.sqrt(discriminant))/(2*a));
				}
				break;
			case 3:
				[d, c, b, a] = this.coefficients;
				discriminant = b*b*c*c - 4*a*c*c*c - 4*b*b*b*d - 27*a*a*d*d + 18*a*b*c*d;
				Delta0 = b*b - 3*a*c;
				Delta1 = 2*b*b*b - 9*a*b*c + 27*a*a*d;
				C = Math.cbrt((Delta1 + Math.sqrt(Delta1*Delta1 - 4*Delta0*Delta0*Delta0))/2);
				xi = (-1 + Math.sqrt(-3))/2;
				// todo
				// eslint-disable-next-line max-len
				roots = new Set([0, 1, 2].map(k => -(b + Math.pow(xi, k)*C + Delta0/(Math.pow(xi, k) * C))/(3*a)));
				break;
			default:
				throw Error('unimplemented');
		}
		return {discriminant, roots, Delta0, Delta1, C};
	}
	get span(){
		const elem = document.createElement('span');
		elem.innerHTML = this.coefficients
			.map((c, i) => c ? 1 < i ? `${c}x<sup>${i}</sup>` : 0 < i ? `${c}x` : `${c}` : '')
			.filter(s => s) // remove blanks
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