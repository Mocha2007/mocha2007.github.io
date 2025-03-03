/* eslint-disable max-len */
/* exported GRADIENT */

// Rough approximations of these gradients:
// https://sjmgarnier.github.io/viridis/reference/figures/maps.png
const GRADIENT = {
	// GRADIENTS
	/** @param {number} x */
	gradient(x, name = 'viridis'){
		x = x < 0 ? 0 : x > 1 ? 1 : x;
		const R = this.gradientData[name].r.map((c, i) => c*Math.pow(x, i)).reduce((a, b) => a+b, 0);
		const G = this.gradientData[name].g.map((c, i) => c*Math.pow(x, i)).reduce((a, b) => a+b, 0);
		const B = this.gradientData[name].b.map((c, i) => c*Math.pow(x, i)).reduce((a, b) => a+b, 0);
		return `rgb(${R}, ${G}, ${B})`;
	},
	gradientData: {
		cividis: {
			r: [0, 255, 0, 0],
			g: [33, 163, 38, 0],
			b: [77, 101, 32, -140],
		},
		inferno: {
			r: [0, 316, 191, -255],
			g: [0, 15, 180, 59],
			b: [3, 980, -2556, 1737],
		},
		magma: {
			r: [0, 262, 311, -321],
			g: [0, 73, -14, 193],
			b: [3, 922, -2079, 1346],
		},
		mako: {
			r: [0, 546, -1431, 1107],
			g: [0, 110, 396, -261],
			b: [0, 706, -1062, 585],
		},
		plasma: {
			r: [13, 475, -122, -126],
			g: [22, -102, 482, -153],
			b: [135, 356, -1049, 590],
		},
		rocket: {
			r: [2, 381, 68, -201],
			g: [4, 38, 86, 108],
			b: [26, 578, -1544, 1161],
		},
		viridis: {
			r: [68, 68, -621, 738],
			g: [13, 245, 113, -140],
			b: [84, 318, -464, 99],
		},
	},
	// TEST
	/** finds the TEST element and outputs test to it */
	test(steps = 240){
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
		}
		console.debug('gradient.js testing complete');
	},
};