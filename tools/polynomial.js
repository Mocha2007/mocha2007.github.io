/* exported Polynomial */

/**
 * this function assumes there is at least one real root.
 * @param {Polynomial} f polynomial
 * @param {number} x0 real number, seed value (can be left blank)
 * @param {number} i_max positive integer, maximum number of iterations
 * @param {number} threshold positive real number, threshold of "success", should be very small
 */
function rootfind(f, x0 = undefined, i_max = 100, threshold = 1e-10){
	let i = 0;
	// check for obvious roots: 0, 1, -1
	// 0
	if (f.coefficients[0] === 0){
		x0 = 0;
	}
	// 1
	else if (f.coefficients.reduce((a, b) => a+b, 0) === 0){
		x0 = 1;
	}
	// -1
	else if (f.coefficients.map((x, n) => x * Math.pow(-1, n)).reduce((a, b) => a+b, 0) === 0){
		x0 = -1;
	}
	// okay i give up, use newton-raphson method
	else {
		if (!isFinite(x0)){
			x0 = -f.coefficients[0] / f.coefficients[1];
		}
		const f_ = x => f.dx.f(x);
		const _f = x => f.f(x);
		for (; i < i_max; i++){
			const fx = _f(x0);
			if (Math.abs(fx) < threshold){
				break;
			}
			x0 -= fx / f_(x0);
		}
	}
	// give up
	return {x0, i, failed: i === i_max};
}

class Polynomial {
	/** @param {number[]} coefficients */
	constructor(...coefficients){
		/** @type {number[]} */
		this.coefficients = coefficients;
	}
	get degree(){
		while (this.leading_coefficient === 0){
			this.coefficients.pop();
		}
		return Math.max(0, this.coefficients.length - 1);
	}
	/** derivative */
	get dx(){
		return new Polynomial(...this.coefficients.map((c, i) => c*i).slice(1));
	}
	get leading_coefficient(){
		while (this.coefficients.length && this.coefficients[this.coefficients.length-1] === 0){
			this.coefficients.pop();
		}
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
	get nonzero(){
		// eslint-disable-next-line max-len
		return !(this.degree === 0 && (this.coefficients.length === 0 || this.coefficients[0] === 0));
	}
	/** returns all real roots of a polynomial (degrees <= 2 implemented) */
	get roots(){
		const roots = new Set();
		let a, b, c, discriminant, root0;
		switch (this.degree){
			case 0:
				break;
			case 1:
				[b, a] = this.coefficients;
				roots.add(-b/a);
				break;
			case 2:
				[c, b, a] = this.coefficients;
				discriminant = b*b - 4*a*c;
				if (0 <= discriminant){
					roots.add((-b - Math.sqrt(discriminant))/(2*a));
					roots.add((-b + Math.sqrt(discriminant))/(2*a));
				}
				break;
			default:
				// debugger;
				root0 = rootfind(this).x0;
				roots.add(root0);
				this.div(new Polynomial(-root0, 1)).q.roots.forEach(root => roots.add(root));
		}
		return roots;
	}
	get span(){
		const elem = document.createElement('span');
		elem.innerHTML = this.coefficients
			.map((c, i) => c ? 1 < i ? `${c}x<sup>${i}</sup>` : 0 < i ? `${c}x` : `${c}` : '')
			.filter(s => s) // remove blanks
			.reverse().join(' + ');
		elem.classList.add('polynomial'); // in case we want special styling for this
		// hovering over this element should display a small svg of the function on [0, 1] from [0, 255]
		elem.onmouseover = e => {
			const svg = this.svg;
			document.documentElement.appendChild(svg);
			svg.style.left = `${e.pageX + 20}px`;
			svg.style.top = `${e.pageY + 20}px`;
		};
		elem.onmousemove = e => {
			const svg = document.getElementById(this.svg_id);
			svg.style.left = `${e.pageX + 20}px`;
			svg.style.top = `${e.pageY + 20}px`;
		};
		elem.onmouseout = () => document.getElementById(this.svg_id).remove();
		return elem;
	}
	get svg(){
		function clampunit(x){
			return 1 / Math.PI * Math.atan(x/100) + 0.5;
		}
		const resolution = 100;
		// cloned from common.js, look there for docs
		/** @returns {SVGElement} */
		function createSvgElement(name){
			return document.createElementNS('http://www.w3.org/2000/svg', name);
		}
		const elem = createSvgElement('svg');
		elem.style.backgroundColor = '#222';
		elem.style.position = 'absolute';
		elem.style.border = '0.5vw solid #242';
		elem.style.borderRadius = '1vw';
		elem.setAttribute('viewBox', '0 0 1 1');
		elem.setAttribute('preserveAspectRatio', 'none');
		elem.setAttribute('width', 200);
		elem.setAttribute('height', 200);
		elem.id = this.svg_id;
		elem.classList.add('polyGraph');
		function coord_to_svg(x, y){
			return {x, y: 1-y/255};
		}
		for (let i = 0; i < resolution; i++){
			const x0 = i/resolution;
			const x1 = (i+1)/resolution;
			const coords0 = coord_to_svg(x0, this.f(x0));
			const coords1 = coord_to_svg(x1, this.f(x1));
			const slope = clampunit(this.dx.f(x0));
			const concavity = clampunit(this.dx.dx.f(x0));
			const line = createSvgElement('line');
			line.setAttribute('x1', coords0.x);
			line.setAttribute('y1', coords0.y);
			line.setAttribute('x2', coords1.x);
			line.setAttribute('y2', coords1.y);
			const [r, g, b] = [
				-584 * slope * slope + 720 * slope + 33,
				-736 * slope * slope + 658 * slope + 102,
				-558 * concavity * concavity + 429 * concavity + 172,
			];
			line.setAttribute('stroke', `rgb(${r}, ${g}, ${b})`);
			line.setAttribute('stroke-width', 0.01);
			elem.appendChild(line);
		}
		return elem;
	}
	get svg_id(){
		return `polySVG${this.coefficients.join('_')}`;
	}
	// math operations
	/** @param {Polynomial} other */
	add(other){
		// eslint-disable-next-line max-len
		return other.degree <= this.degree ? new Polynomial(...this.coefficients.map((c, i) => c + (other.coefficients[i] || 0))) : other.add(this);
	}
	/** @param {Polynomial} d divisor */
	div(d){
		// https://en.wikipedia.org/wiki/Polynomial_long_division#Pseudocode
		console.assert(d.nonzero);
		let q = new Polynomial(0);
		let r = this.clone();
		while (r.nonzero && r.degree >= d.degree){
			// eslint-disable-next-line max-len
			const t = Polynomial.monomial(r.leading_coefficient / d.leading_coefficient, r.degree - d.degree);
			// console.debug(q.span.innerHTML, r.span.innerHTML, t.span.innerHTML);
			q = q.add(t);
			r = r.sub(t.mul(d));
		}
		return {q, r};
	}
	/** @param {Polynomial} other */
	eq(other){
		return this.coefficients.every((c, i) => c === other.coefficients[i]);
	}
	/**
	 * returns the local min and max of the polynomial in the given
	 * @param {number} x_min
	 * @param {number} x_max
	 */
	local_extrema(x_min, x_max){
		// points of interest: min, max, and all roots of the derivative.
		// eslint-disable-next-line max-len
		const poi = [x_min, x_max].concat(...Array.from(this.dx.roots).filter(r => x_min <= r && r <= x_max));
		const fpoi = poi.map(x => this.f(x));
		const min = Math.min(...fpoi);
		const min_x = poi[fpoi.indexOf(min)];
		const max = Math.max(...fpoi);
		const max_x = poi[fpoi.indexOf(max)];
		return {min, max, min_x, max_x};
	}
	/** @param {Polynomial} other */
	mul(other){
		const product_degree = this.degree + other.degree;
		const product = Array(product_degree+1).fill(0);
		// eslint-disable-next-line max-len
		this.coefficients.forEach((c, i) => other.coefficients.forEach((o, j) => product[i+j] += c*o));
		return new Polynomial(...product);
	}
	/** @param {number} scalar to multiply coefficients by */
	scalar(r){
		return new Polynomial(...this.coefficients.map(c => c*r));
	}
	/** @param {Polynomial} other */
	sub(other){
		return this.add(other.scalar(-1));
	}
	// rest
	clone(){
		return new Polynomial(...this.coefficients);
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
			return this.clone();
		}
		return this.dx.dn(n-1);
	}
	/** @param {number} x */
	f(x){
		return this.coefficients.map((c, i) => c*Math.pow(x, i)).reduce((a, b) => a+b, 0);
	}
	// static
	/**
	 * create a new monomial cx^n
	 * @param {number} c coefficient
	 * @param {number} n power
	 */
	static monomial(c, n){
		const coef = Array(n+1).fill(0);
		coef[n] = c;
		return new Polynomial(...coef);
	}
	static test(){
		// test rootfinding, addition, subtraction, multiplication, division
		const a = new Polynomial(1, 1);
		const b = new Polynomial(-1, 1);
		if (a.degree === 1){
			console.info('polynomial.js: degree test passed');
		}
		else {
			console.info('polynomial.js: degree test failed: expected 1, got', a.degree);
		}
		const product = a.mul(b);
		if (product.coefficients.join(' ') === '-1 0 1'){
			console.info('polynomial.js: MUL test passed');
		}
		else {
			console.info('polynomial.js: MUL test failed: expected -1 0 1, got', product.coefficients.join(' '));
		}
		let quotient = new Polynomial(1);
		let divisor = new Polynomial(1);
		function random_coef(){
			return Math.round(20 * Math.random() - 10);
		}
		for (let i = 1; i < 5; i++){
			quotient = quotient.mul(new Polynomial(random_coef(), 1));
			divisor = divisor.mul(new Polynomial(random_coef(), 1));
			const dividend = quotient.mul(divisor);
			const maybe_quotient = dividend.div(divisor).q;
			if (maybe_quotient.eq(quotient)){
				console.info('polynomial.js: DIV test passed');
			}
			else {
				console.info('polynomial.js: DIV test failed: expected', quotient, ', got', maybe_quotient);
			}
		}
		let p = new Polynomial(1);
		for (let i = 1; i <= 5; i++){
			p = p.mul(new Polynomial(-i, 1));
			// the roots should be 1 ... i
			console.info('polynomial.js: testing rootfinding for degree', i);
			console.info(p.roots);
		}
	}
}