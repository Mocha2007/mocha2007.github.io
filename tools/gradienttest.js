/* eslint-disable max-len */

/* global GRADIENT */
GRADIENT.test = function test(steps = 240){
	function br(){
		elem.appendChild(document.createElement('br'));
	}
	const ignore = ['clamp', 'test'];
	console.debug('testing gradient.js ...');
	const elem = document.createElement('div');
	elem.id = 'test';
	document.documentElement.appendChild(elem);
	for (const gradient in this.gradientData){
		if (ignore.includes(gradient)){
			continue;
		}
		console.debug('testing', gradient, '...');
		const label = document.createElement('span');
		label.innerHTML = gradient;
		elem.appendChild(label);
		br();
		for (let i = 0; i < steps; i++){
			const x = i/steps;
			const swatch = document.createElement('span');
			swatch.classList.add('swatch');
			swatch.style.backgroundColor = this.gradient(x, gradient);
			elem.appendChild(swatch);
		}
		br();
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
	const brightness = gradient.r.map((x, i) => x + gradient.g[i] + gradient.b[i]);
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
	return true;
};