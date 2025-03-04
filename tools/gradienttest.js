/* eslint-disable max-len */
/* global GRADIENT */

GRADIENT.print = function print(parent, gradient, steps = 240){
	function br(){
		parent.appendChild(document.createElement('br'));
	}
	const label = document.createElement('span');
	label.innerHTML = gradient;
	parent.appendChild(label);
	br();
	for (let i = 0; i < steps; i++){
		const x = i/steps;
		const swatch = document.createElement('span');
		swatch.classList.add('swatch');
		swatch.style.backgroundColor = this.gradient(x, gradient);
		parent.appendChild(swatch);
	}
	br();
};

GRADIENT.test = function test(){
	console.debug('testing gradient.js ...');
	const elem = document.createElement('div');
	elem.id = 'test';
	document.documentElement.appendChild(elem);
	for (const gradient in this.gradientData){
		console.debug('testing', gradient, '...');
		this.print(elem, gradient);
		// (1) i need to make sure valid rgb values are always given
		// (2) i'd like to also make sure the brightness for each cubic is monotonic increasing
		// which implies the derivative is always positive
		// this can be checked easily by taking the derivative, finding roots,
		// sectioning (0, 1) between roots, and testing each region for positivity
		// (3) I'd like to also make sure the brightness is approximately linear (this isn't essential, but might be useful?)
		this.verifyCubic(this.gradientData[gradient], gradient);
	}
	console.debug('gradient.js testing complete');
};
GRADIENT.verifyCubic = function verifyCubic(gradient, name){
	// verify monotonic increasing
	// https://stackoverflow.com/a/596243 (0.2126*R + 0.7152*G + 0.0722*B)
	const brightness = gradient.r.map((x, i) => 0.2126*x + 0.7152*gradient.g[i] + 0.0722*gradient.b[i]);
	console.info('brightness cubic for', name, 'is', brightness);
	// derivative
	const [c, b, a] = [brightness[1], 2*brightness[2], 3*brightness[3]];
	const f_ = x => a*x*x + b*x + c;
	const discriminant = b*b - 4*a*c;
	// if disc > 0, we need to check three zones at most.
	// if disc <= 0, we only need to check one zone.
	let mono = true;
	if (0 < discriminant){
		const r0 = (-b + Math.sqrt(discriminant))/(2*a);
		const r1 = (-b - Math.sqrt(discriminant))/(2*a);
		// if both lie outside (0, 1), we only need to check one zone out
		// if one lies in (0, 1), we need to check 2
		// else we need to check 3
		// in all three checks we need to check f'(0) = c
		// if r0 OR r1 is in range, we need to check f'(1) = a+b+c too
		// if r0 AND r1 are in range, we need to check f' of their midpoint too
		if (0 < r0 && r0 < 1 && 0 < r1 && r1 < 1){ // if both lie in the interval...
			if (f_((r0 + r1)/2) <= 0){
				mono = false;
			}
		}
		if (0 < r0 && r0 < 1 || 0 < r1 && r1 < 1){ // if only one lies in the interval...
			if (a+b+c <= 0){
				mono = false;
			}
		}
	}
	if (c <= 0){
		mono = false;
	}
	// now show
	if (mono){
		console.info('GOOD:', name, 'brightness is monotonic increasing');
	}
	else {
		console.error('BAD:', name, 'brightness is NOT monotonic increasing');
		return false;
	}
	// todo verify all rgb values in [0, 1] are in [0, 255]
	['r', 'g', 'b'].forEach(color => {
		// eslint-disable-next-line no-shadow
		const [c, b, a] = [gradient[color][1], 2*gradient[color][2], 3*gradient[color][3]];
		// eslint-disable-next-line no-shadow
		const discriminant = b*b - 4*a*c;
		if (0 <= discriminant){
			const r0 = (-b + Math.sqrt(discriminant))/(2*a);
			const r1 = (-b - Math.sqrt(discriminant))/(2*a);
			const f = x => gradient[color].map((r, i) => r*Math.pow(x, i)).reduce((aa, bb) => aa+bb, 0);
			if (0 < r0 && r0 < 1 && (f(r0) < 0 || 255 < f(r0))){
				console.error('BAD: value of', name, color, 'cubic does NOT entirely lie in [0, 255]');
				console.info('r0 =', r0, '; f(r0) =', f(r0));
				return false;
			}
			if (0 < r1 && r1 < 1 && (f(r1) < 0 || 255 < f(r1))){
				console.error('BAD: value of', name, color, 'cubic does NOT entirely lie in [0, 255]');
				console.info('r1 =', r1, '; f(r1) =', f(r1));
				return false;
			}
		}
		// derivative has no real roots - therefore, it is monotonic increasing or monotonic decreasing.
		// therefore, we only need to ensure the endpoints are in [0, 255].
		// f(0) = d, and f(1) = a+b+c+d
		if (gradient[color][0] < 0 || 255 < gradient[color][0]){
			console.error('BAD: value of', name, color, 'cubic does NOT entirely lie in [0, 255], specifically due to its constant coefficient:', gradient[color][0]);
			return false;
		}
		if (gradient[color].reduce((aa, bb) => aa+bb, 0) < 0 || 255 < gradient[color].reduce((aa, bb) => aa+bb, 0)){
			console.error('BAD: value of', name, color, 'cubic does NOT entirely lie in [0, 255], specifically due to a+b+c+d not in [0, 255]:', gradient[color].reduce((aa, bb) => aa+bb, 0));
			return false;
		}
	});
	// I also want to ensure the brightness curve is approximately linear.
	// It doesn't need to be PERFECTLY linear, just close.
	// To accomplish this, I will use the second derivative f''(x) = 6ax + 2b
	// we ideally want this derivative to be very small along the entire range [0, 1]
	// in order to make sure it's small, we need to find the maximum abs value along this range
	// since it is linear, we can just calculate the endpoints f''(0) = 2b and f''(1) = 6a + 2b
	const [b_, a_] = [b, 2*a];
	const max_bend = Math.max(Math.abs(2*b_), Math.abs(6*a_+2*b_));
	// console.debug('max(f\'\') =', max_bend);
	// magma has the highest value of the 'stock' color maps, at 5634.935199999999.
	// Therefore, we must make sure it's not WORSE than that.
	if (5635 < max_bend){
		console.error('BAD: brightness curve is too bendy: max(|f\'\'|) on [0, 1] =', max_bend, '>', 5635);
		return false;
	}
	return true;
};
GRADIENT.random = function random(max_attempts = 100){
	const brightness_coef = {
		r: 0.2126,
		g: 0.7152,
		b: 0.0722,
	};
	// todo
	// d probably in [0, 135]
	// c probably in [-102, 980]
	// b probably in [-2556, 482]
	// a probably in [-321, 1737]
	function randint(min, max){
		return Math.round((max - min) * Math.random() + min);
	}
	function randcoef(){
		return randint(-1000, 1000);
	}
	for (let attempt = 0; attempt < max_attempts; attempt++){
		console.clear();
		const gradient = {};
		// we want (0,0) and (1, 255) so d must be 0 for all and c must be 255-a-b for all
		const a_r = randcoef();
		const b_r = randcoef();
		const c_r = 255 - a_r - b_r;
		gradient.r = [0, c_r, b_r, a_r];
		const a_g = randcoef();
		const b_g = randcoef();
		const c_g = 255 - a_g - b_g;
		gradient.g = [0, c_g, b_g, a_g];
		// we can derive B from the brightness formula since we want brightness to be exactly y = 255x
		// (0.2126*R + 0.7152*G + 0.0722*B)
		// (0.2126*R + 0.7152*G)/-0.0722 = B
		const a_b = (brightness_coef.r * a_r + brightness_coef.g * a_g) / -brightness_coef.b;
		const b_b = (brightness_coef.r * b_r + brightness_coef.g * b_g) / -brightness_coef.b;
		const c_b = 255 - a_b - b_b;
		gradient.b = [0, c_b, b_b, a_b];
		if (this.verifyCubic(gradient)){
			console.info('found', gradient, 'after', attempt+1, 'attempt(s)');
			this.gradientData.test = gradient;
			this.print(document.getElementById('test'), 'test');
			return gradient;
		}
	}
	console.warn('No suitable gradient found in', max_attempts, 'attempts.');
};