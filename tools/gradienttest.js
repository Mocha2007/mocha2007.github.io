/* eslint-disable max-len */
/* global GRADIENT, Polynomial */
const brightness_coef = {
	r: 0.2126,
	g: 0.7152,
	b: 0.0722,
};

function uniform(min, max){
	return (max - min) * Math.random() + min;
}

// https://stackoverflow.com/a/26233318
function rgb2hsv(red, green, blue){
	const min = Math.min(red, green, blue);
	const max = Math.max(red, green, blue);

	let hue;
	if (min === max){
		hue = 0;
	}
	else if (max === red){
		hue = (green - blue) / (max - min);
	}
	else if (max === green){
		hue = 2 + (blue - red) / (max - min);
	}
	else {
		hue = 4 + (red - green) / (max - min);
	}

	hue *= 60;
	if (hue < 0){
		hue += 360;
	}
	const H = Math.round(hue);
	const S = max === min ? 0 : Math.round(100*(max-min)/max);
	const V = Math.round(max/2.5);
	return {H, S, V, hue};
}
// https://www.desmos.com/calculator/gtcwgixpqu

// computes change in hue across gradient
function delta_hue(gradient, epsilon = 1e-10){
	// need to compute this slightly above 0 and slightly below 1 because hue is messed up at the extrema
	const col0 = GRADIENT.gradient_raw(epsilon, gradient);
	const col1 = GRADIENT.gradient_raw(1-epsilon, gradient);
	const start = rgb2hsv(col0.R, col0.G, col0.B).H;
	const end = rgb2hsv(col1.R, col1.G, col1.B).H;
	const diff = Math.abs(start - end);
	const delta = Math.min(diff, 360-diff);
	return {delta, start, end};
}

function quadroot(a, b, c){
	const d = b*b - 4*a*c;
	const r0 = a === 0 ? -c/b : (-b - Math.sqrt(d))/(2*a);
	const r1 = (-b + Math.sqrt(d))/(2*a);
	return {d, r0, r1};
}

/**
 * @param {Polynomial} poly
 * @param {string} name
 * @param {string} color
 * @param {string} warning_color
 */
function root_parenthetical(poly, symbol = 'f', color = 'inherit', warning_color = 'yellow'){
	/** @param {number[]} */
	const roots = Array.from(poly.dx.roots);
	/** @param {string[]} */
	const rootgoodness = roots.map(r => 0 < r && r < 1 ? warning_color : 'green');
	const fr = roots.map(r => poly.f(r));
	const fr_goodness = fr.map((x, i) => (x < 0 || 255 < x) && rootgoodness[i] === warning_color ? 'red' : 'green');
	const elem = document.createElement('span');
	elem.classList.add('rootParenthetical');
	elem.innerHTML = `<br><span class="${color}">${symbol}</span>(x) = <span class='polyReplace'></span><br><span class="${color}">${symbol}&prime;</span>(x) = <span class='polyReplace'></span>`;
	if (roots.length){
		elem.innerHTML += ` (${roots.map((root, i) => `r<sub>${symbol}&prime;${i}</sub> = <span class="${rootgoodness[i]}">${root}</span>`).join(', ')},
		${fr.map((x, i) => `<span class='${color}'>${symbol}</span>(r<sub>${symbol}&prime;${i}</sub>) = <span class="${fr_goodness[i]}">${x}</span>`).join(', ')})`;
	}
	else {
		elem.innerHTML += ' (no roots)';
	}
	elem.getElementsByClassName('polyReplace')[0].appendChild(poly.span);
	elem.getElementsByClassName('polyReplace')[1].appendChild(poly.dx.span);
	return elem;
}

const GRADIENT_TEST = {};

GRADIENT_TEST.print = function print(parent, gradient, steps = 240, discs = 9, dh_steps = 1000){
	const label = document.createElement('span');
	label.innerHTML = gradient;
	GRADIENT.gradientData[gradient].w = GRADIENT.gradientData[gradient].r.map((x, i) => brightness_coef.r*x + brightness_coef.g*GRADIENT.gradientData[gradient].g[i] + brightness_coef.b*GRADIENT.gradientData[gradient].b[i]);
	['red', 'green', 'blue', 'white'].forEach(color => {
		const warning_color = color === 'white' ? 'red' : 'yellow';
		const symbol = color[0].toUpperCase();
		const poly = new Polynomial(...GRADIENT.gradientData[gradient][color[0]]);
		label.appendChild(root_parenthetical(poly, symbol, color, warning_color));
	});
	const dh = delta_hue(GRADIENT.gradientData[gradient]);
	// ok now compute min H'
	let min_hp = Infinity;
	let min_hp_x = Infinity;
	for (let i = 1; i < dh_steps-1; i++){
		const x0 = i/dh_steps;
		const x1 = (i+1)/dh_steps;
		const color0 = GRADIENT.gradient_raw(x0, GRADIENT.gradientData[gradient]);
		const h0 = rgb2hsv(color0.R, color0.G, color0.B).hue;
		const color1 = GRADIENT.gradient_raw(x1, GRADIENT.gradientData[gradient]);
		const h1 = rgb2hsv(color1.R, color1.G, color1.B).hue;
		const dh_check = Math.abs(h1-h0);
		const dh_chec2 = Math.min(dh_check, 360-dh_check);
		min_hp = Math.min(dh_steps*dh_chec2, min_hp);
		if (dh_steps*dh_chec2 === min_hp){
			min_hp_x = x0;
		}
	}
	const moreCrap0 = document.createElement('span');
	moreCrap0.innerHTML = `<br>&Delta;<sub class="rainbow">hue</sub> = ${dh.delta} (${dh.start} &rarr; ${dh.end}, min |<span class="rainbow">H&prime;</span>| = ${Math.round(min_hp)} at x = ${min_hp_x})`;
	label.appendChild(moreCrap0);
	// B E N D
	const concavity = new Polynomial(...GRADIENT.gradientData[gradient].w).dn(2);
	const bend_extrema = concavity.local_extrema(0, 1);
	const bend = Math.max(...[bend_extrema.min, bend_extrema.max].map(Math.abs));
	const bend_x = bend === Math.abs(bend_extrema.max) ? bend_extrema.max_x : bend_extrema.min_x;
	// TODO: get exact solution to entire interval!
	const moreCrap1 = document.createElement('span');
	moreCrap1.innerHTML = `<br>Highest Magnitude Concavity (<span class="concavityReplace"></span> in Interval: ${bend} (@ x = ${bend_x})`;
	moreCrap1.getElementsByClassName('concavityReplace')[0].appendChild(concavity.span);
	label.appendChild(moreCrap1);
	parent.appendChild(label);
	const disk_parent = document.createElement('div');
	parent.appendChild(disk_parent);
	disk_parent.classList.add('disk_parent');
	for (let i = 0; i < discs; i++){
		const x = i/(discs-1);
		const disc = document.createElement('div');
		disc.classList.add('disc');
		disc.style.backgroundColor = GRADIENT.gradient(x, gradient);
		const color = GRADIENT.gradient_raw(x, GRADIENT.gradientData[gradient]);
		const hsv = rgb2hsv(color.R, color.G, color.B);
		disc.innerHTML = `<span>${disc.style.backgroundColor}<br>hsv(${hsv.H}, ${hsv.S}, ${hsv.V})</span>`;
		disk_parent.appendChild(disc);
	}
	const bar_parent = document.createElement('div');
	parent.appendChild(bar_parent);
	bar_parent.classList.add('bar_parent');
	for (let i = 0; i < steps; i++){
		const x = i/steps;
		const swatch = document.createElement('span');
		swatch.classList.add('swatch');
		swatch.style.backgroundColor = GRADIENT.gradient(x, gradient);
		bar_parent.appendChild(swatch);
	}
};

GRADIENT_TEST.test = function test(){
	console.debug('testing gradient.js ...');
	const elem = document.createElement('div');
	elem.id = 'test';
	document.documentElement.appendChild(elem);
	for (const gradient in GRADIENT.gradientData){
		console.debug('testing', gradient, '...');
		try {
			this.print(elem, gradient);
			// (1) i need to make sure valid rgb values are always given
			// (2) i'd like to also make sure the brightness for each cubic is monotonic increasing
			// which implies the derivative is always positive
			// this can be checked easily by taking the derivative, finding roots,
			// sectioning (0, 1) between roots, and testing each region for positivity
			// (3) I'd like to also make sure the brightness is approximately linear (this isn't essential, but might be useful?)
			this.verifyCubic(GRADIENT.gradientData[gradient], gradient);
		}
		catch (e){
			console.error(e);
		}
	}
	console.debug('gradient.js testing complete');
};
GRADIENT_TEST.verifyCubic = function verifyCubic(gradient, name){
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
GRADIENT_TEST.random = function random(max_attempts = 100){
	// todo
	// d probably in [0, 135]
	// c probably in [-102, 980]
	// b probably in [-2556, 482]
	// a probably in [-321, 1737]
	for (let attempt = 0; attempt < max_attempts; attempt++){
		console.clear();
		const gradient = {};
		// we want (0,0) and (1, 255) so d must be 0 for all and c must be 255-a-b for all
		// we also want to ensure for all x in [0, 1], f(x) is in [0, 255].
		// we can ensure this by making sure the cubic is monotonic increasing, which implies the min/max are at the bounds we already set (at the cost of losing some valid cubics)
		// it is monotonic increasing if f'(x) has no real roots - in other words, its determinant is less than 0
		// f'(x) = 3a x^2 + 2b x + c
		// determinant = (2b)^2 - 4*(3a) * c = 4b^2 - 12ac < 0
		// we can slightly simplify to b^2 < 3ac
		// we have defined c = 255 - a - b, substituting:
		// b^2 < 3a(255 - a - b)
		// b^2 < 765a - 3a^2 - 3ab
		// this is essentially a quadratic in b:
		// b^2 + 3ab + (3a^2 - 765a) < 0
		// since the quadratic coefficient is positive (1), the valid solutions to this MUST lie between the roots:
		// roots = (-3a +/- sqrt((3a)^2 - 4*1*(3a^2 - 765a)))/2
		// roots = (-3a +/- sqrt(-3a^2 + 3060a))/2
		// for real roots to exist, -3a^2 + 3060a must be greater than or equal to 0.
		// so we now gain an additional constraint on a:
		// 1020 >= a >= 0
		// https://www.desmos.com/calculator/zebxlysfca
		// https://www.desmos.com/calculator/hddwps88py
		const a_r = uniform(0, 1020);
		const b_r = uniform((-3*a_r - Math.sqrt(-3*a_r*a_r + 3060*a_r))/2, (-3*a_r + Math.sqrt(-3*a_r*a_r + 3060*a_r))/2);
		const c_r = 255 - a_r - b_r;
		gradient.r = [0, c_r, b_r, a_r];
		const a_b = uniform(0, 1020);
		const b_b = uniform((-3*a_b - Math.sqrt(-3*a_b*a_b + 3060*a_b))/2, (-3*a_b + Math.sqrt(-3*a_b*a_b + 3060*a_b))/2);
		const c_b = 255 - a_b - b_b;
		gradient.b = [0, c_b, b_b, a_b];
		// we can derive B from the brightness formula since we want brightness to be exactly y = 255x
		// (0.2126*R + 0.7152*G + 0.0722*B)
		// (0.2126*R + 0.7152*G)/-0.0722 = B
		const a_g = (brightness_coef.r * a_r + brightness_coef.b * a_b) / -brightness_coef.g;
		const b_g = (brightness_coef.r * b_r + brightness_coef.b * b_b) / -brightness_coef.g;
		const c_g = 255 - a_g - b_g;
		gradient.g = [0, c_g, b_g, a_g];
		if (this.verifyCubic(gradient)){
			console.info('found', gradient, 'after', attempt+1, 'attempt(s)');
			const test_elem = document.getElementById('test');
			test_elem.innerHTML = '';
			const test_name = 'test';
			GRADIENT.gradientData[test_name] = gradient;
			this.print(test_elem, test_name);
			return gradient;
		}
	}
	console.warn('No suitable gradient found in', max_attempts, 'attempts.');
};

// this generates colorblind-friendly cyclic color maps suitable for all types of colorblindness but Achromatopsia
// (which is mathematically impossible to accomodate for with a cyclic color map regardless)
GRADIENT_TEST.random_cyclic = function random_cyclic(){
	// condition 1: f(0) = f(1) => ax^3 + bx^2 + (-a-b)x + d
	/*
	we can force one of the maxima to be at x >= 0 (which is necessary, and also the previous condition forces the same root to be in [0, 1]) by doing this:
	f(x) = ax^3 + bx^2 + (-a-b)x + d
	f'(x) = 3ax^2 + 2bx -a -b
	root 0: (-b - sqrt(b^2 + 3a^2 + 3ab))/(3a)

	0 <= (-b - sqrt(b^2 + 3a^2 + 3ab))/(3a)
	0 <= -b - sqrt(b^2 + 3a^2 + 3ab)
	b <= -sqrt(b^2 + 3a^2 + 3ab)
	b is necessarily negative here, so squaring flips the sign:
	b^2 >= b^2 + 3a^2 + 3ab
	-a >= b (this means a is positive)
	In practice this reduces the number of attempts needed by about a factor of 10!
	*/
	const gradient = {};
	// R(x) = nG(x) AND B(x) = R(1-x) (so that the blue channel is offset by half the period)
	let a = uniform(0, 1000);
	let b = uniform(-1000, -a);
	let c = -a-b;
	let d = uniform(0, 255);
	const f = x => a*x*x*x + b*x*x + c*x + d;
	// now we need to ensure f(x) evaluated at {the roots of f'(x) that are in [0, 1]} is in [0, 255]
	const roots = quadroot(3*a, 2*b, c);
	// to optimize brightness, we multiply coefs by 255/(greater of the two extrema in the domain)
	const local_extrema = [0, roots.r0, roots.r1].filter(r => 0 <= r && r < 1).map(f);
	const local_maximum = Math.max(...local_extrema);
	const local_minimum = Math.min(...local_extrema);
	const y_variance = local_maximum - local_minimum;
	a *= 255/y_variance;
	b *= 255/y_variance;
	c *= 255/y_variance;
	d -= local_minimum;
	d *= 255/y_variance;
	// success!!!!
	gradient.r = [d, c, b, a];
	const n = uniform(0, 1);
	gradient.g = [n*d, n*c, n*b, n*a];
	gradient.b = [d, -2*a-b, 3*a+b, -a];
	// now disp
	console.info('found', gradient);
	const test_elem = document.getElementById('test');
	test_elem.innerHTML = '';
	const test_name = 'test';
	GRADIENT.gradientData[test_name] = gradient;
	this.print(test_elem, test_name);
	return gradient;
};

// this generates colorblind-friendly cyclic color maps suitable for all types of colorblindness but Achromatopsia
// (which is mathematically impossible to accomodate for with a cyclic color map regardless)
GRADIENT_TEST.random_peak = function random_peak(){
	// conditions: f(0) = f(1) = 0; f(1/2) = 255, f'(1/2) = 0
	// there is only a single cubic which satisfies this (which is a quadratic), so we need to look to quartics if we want variance...
	// quartics only provide single-hue gradients, so for more interesting patterns we need QUINTICS!!! poggers
	// boundary conditions require f(x) = ax^5 + bx^4 + cx^3 + dx^2 + (-a-b-c-d)x
	// f(1/2) condition requires d to be (-15*a-14*b-12*c-8160)/8
	// derivative is 5ax^4 + 4bx^3 + 3cx^2 + (-15*a-14*b-12*c-8160)/4x + (-a-b-c-(-15*a-14*b-12*c-8160)/8)
	// f'(1/2) condition requires c to be -11a/4 -2b
	// maybe we can force concavity of 1/2 to be neg? so f''(1/2) <= 0?
	// second derivative is 20ax^3 + 12bx^2 + 6(-11a/4 - 2b)x + (-15*a-14*b-12*(-11a/4 - 2b)-8160)/4
	// this means b must be greater than (-5*a - 8160)/2
	// we also need f'(0) >= 0 and f'(1) <= 0
	// 5ax^4 + 4bx^3 + 3(-11*a/4 - 2*b)x^2 + (-15*a-14*b-12*(-11*a/4 - 2*b)-8160)/4x + (-a-b-(-11*a/4 - 2*b)-(-15*a-14*b-12*(-11*a/4 - 2*b)-8160)/8)
	// 0 <= (-a-b-(-11*a/4 - 2*b)-(-15*a-14*b-12*(-11*a/4 - 2*b)-8160)/8)
	// THUS b <= 4080-2a
	// the f'(1) <= 0 condition requires b <= 4080-3a
	// https://www.desmos.com/calculator/asvbmeblny
	const gradient = {};
	['r', 'g', 'b'].forEach(color => {
		const a = uniform(-16320, 16320); // these bounds are needed for b to be possible
		const b = uniform((-5*a - 8160)/2, 4080 - Math.max(2*a, 3*a));
		const c = -11*a/4 - 2*b;
		const d = (-15*a-14*b-12*c-8160)/8;
		const e = -a-b-c-d;
		// success!!!!
		gradient[color] = [0, e, d, c, b, a];
	});
	// now disp
	console.info('found', gradient);
	const test_elem = document.getElementById('test');
	test_elem.innerHTML = '';
	const test_name = 'test';
	GRADIENT.gradientData[test_name] = gradient;
	this.print(test_elem, test_name);
	return gradient;
};

GRADIENT_TEST.random_peak2 = function random_peak2(){
	// conditions: f(1/2) = 255, f'(1/2) = 0, 0 <= f(0) <= 255, 0 <= f(1) <= 255, f'(0) >= 0, f'(1) <= 0
	const gradient = {};
	['r', 'g', 'b'].forEach(color => {
		const a = uniform(-816, 816); // these bounds are needed for b to be possible
		const b = uniform(-Math.min(a, 2*a) - 1020, -Math.max(3*a, 9*a)/4);
		const c = -3*a/4 - b;
		const d = 255 - (a/8 + b/4 + c/2);
		// success!!!!
		gradient[color] = [d, c, b, a];
	});
	// now disp
	console.info('found', gradient);
	const test_elem = document.getElementById('test');
	test_elem.innerHTML = '';
	const test_name = 'test';
	GRADIENT.gradientData[test_name] = gradient;
	this.print(test_elem, test_name);
	return gradient;
};

/*
	Color Diff:
	RED<>PURPLE	36.2418
	BLUE<>PURPLE	36.3822
	YELLOW<>GREEN	54.213
	RED<>BLUE	72.624
	ORANGE<>YELLOW	90.8304
	RED<>ORANGE	91.5456
	ORANGE<>PURPLE	127.7874
	ORANGE<>GREEN	145.0434
	ORANGE<>BLUE	164.1696
	RED<>YELLOW	182.376
	GREEN<>BLUE	200.787
	YELLOW<>PURPLE	218.6178
	GREEN<>PURPLE	218.8304
	RED<>GREEN	236.589
	YELLOW<>BLUE	255
 */
GRADIENT_TEST.color_diff = function color_diff(r0, g0, b0, r1, g1, b1){
	return Math.abs(r0-r1)*brightness_coef.r
		+ Math.abs(g0-g1)*brightness_coef.g
		+ Math.abs(b0-b1)*brightness_coef.b;
};

// extra gradients

const EXTRA_GRADIENTS = {
	// simple crap
	// most saturated orange/yellow possible
	grey: {
		r: [0, 255, 0, 0],
		g: [0, 255, 0, 0],
		b: [0, 255, 0, 0],
	},
	// linear brightness curve, with integral B(x) maximized and R(x)=G(x) minimized...
	/*
	 R(x) = (255x - Wb B(x))/(Wr+Wg)

	B(x) = ax^3 + bx^2 + (255-a-b)x
	MAXIMIZE integral of B(x)

	integral is 1/4 ax^4 + 1/3 bx^3 + 1/2 (255-a-b) x^2
	i(0) = 0
	i(1) = 1/4 a + 1/3 b + 1/2 (255-a-b)

	-1/4 a - 1/6 b + 255/2

	we want to choose a,b to MAXIMIZE -1/4 a - 1/6 b + 255/2

	we need to make sure it doesn't exceed bounds, so it must be monotonic increasing
	B'(x) must have no zeroes (so discriminant must be negative, and also a>0)
	B'(x) = 3ax^2 + 2bx + (255-a-b)
	4b^2 - 3060a + 12a^2 + 12ab < 0
	b^2 + 3ab - 765a + 3a^2 < 0
	find roots of b

	-3a +/- sqrt(-3a^2 + 3060a)
	/////////////////////
			2

	which also implies 0 <= a <= 1020

	the maximum is at a = 510
	b = -765 - 255*sqrt(3)
	*/
	blue: {
		get r(){
			return [0, 255, 0, 0].map((x, i) => (x - brightness_coef.b*this.b[i])/(brightness_coef.r+brightness_coef.g));
		},
		get g(){
			return this.r;
		},
		b: [0, 510+255*Math.sqrt(3), -765-255*Math.sqrt(3), 510],
	},
	luna0: {
		r: [0, 570, -1260, 945],
		g: [0, 255, 0, 0],
		b: [0, 3, 630, -378],
	},
	// luna4 but blue->red instead of backwards
	luna1: {
		r: [0, 3, 630, -378],
		g: [0, 255, 0, 0],
		b: [0, 1020, -3060, 2295],
	},
	// ROYG, but colorblind-friendly
	// flat brightness curve
	// https://www.desmos.com/calculator/vum6et5vrr
	luna2: {
		r: [192, 84.5, -63, -85.5],
		g: [0, 322.5, 0, -67.5],
		b: [0, 308, -1012.5, 832.5],
	},
	// purplish -> orangish?
	luna3: {
		r: [0, 694, -629, 190],
		g: [0, 87, 318, -150],
		b: [0, 625, -1300, 930],
	},
	// purplish -> cyanish?
	luna4: {
		r: [0, 744, -1502, 1013],
		g: [0, 88, 473, -306],
		b: [0, 471, -266, 50],
	},
	// reddish -> yellowish -> greenish?
	luna5: {
		r: [0, 874, -1519, 900],
		g: [0, 70, 530, -345],
		b: [0, 240, -755, 770],
	},
	// only cubic st. f(0) = f(1) = 0 and f(1/2) = 255 and f'(1/2) = 0
	midpeak: {
		r: [0, 1020, -1020, 0],
		g: [0, 1020, -1020, 0],
		b: [0, 1020, -1020, 0],
	},
	// republican red -> democratic blue but with constant brightness
	lunaredblue: {
		r: [233, -233, 0, 0],
		g: [17, 52, 0, 0],
		b: [30, 172, 0, 0],
	},
	// an elevation colormap i found, rescaled
	/*elevation: {
		r: [249, 65, -220, 0],
		g: [104, 397, -328, 0],
		b: [1, 504, -486, 0],
	},
	// the same, but tweaked minimally to ensure monotonically increasing brightness
 	elevation2: {
		r: [81, 366, -132, -70],
		g: [167, 314, -747, 512],
		b: [0, 734, -1618, 1130],
	}, */
};

GRADIENT_TEST.interval = setInterval(() => {
	if (GRADIENT && Polynomial){
		console.info('gradient.js and polynomial.js loaded');
		clearInterval(GRADIENT_TEST.interval);
		for (const gradient in EXTRA_GRADIENTS){
			console.info('adding new gradient:', gradient);
			GRADIENT.gradientData[gradient] = EXTRA_GRADIENTS[gradient];
		}
		// GRADIENT_TEST.test();
	}
}, 100);
console.info('gradienttest.js loaded');