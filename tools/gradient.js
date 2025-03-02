/* exported GRADIENT */

// Rough approximations of these gradients:
// https://sjmgarnier.github.io/viridis/reference/figures/maps.png
const GRADIENT = {
	/** @param {number} x */
	clamp(x){
		return x < 0 ? 0 : x > 1 ? 1 : x;
	},
	// GRADIENTS
	/** @param {number} x */
	cividis(x){
		x = this.clamp(x);
		const R = 251 * x;
		const G = 198 * x + 27;
		const B = -194 * x*x*x + 108 * x*x + 73 * x + 79;
		return `rgb(${R}, ${G}, ${B})`;
	},
	/** @param {number} x */
	inferno(x){
		x = this.clamp(x);
		const R = -194 * x*x + 449 * x;
		const G = 289 * x*x - 40 * x;
		const B = 1598 * x*x*x - 2394 * x*x + 951 * x;
		return `rgb(${R}, ${G}, ${B})`;
	},
	/** @param {number} x */
	mako(x){
		x = this.clamp(x);
		const R = 1116 * x*x*x - 1458 * x*x + 557 * x;
		const G = 240 * x;
		const B = 464 * x*x*x - 873 * x*x + 633 * x;
		return `rgb(${R}, ${G}, ${B})`;
	},
	/** @param {number} x */
	rocket(x){
		x = this.clamp(x);
		const R = -233 * x*x + 488 * x;
		const G = 250 * x*x - 21 * x;
		const B = 1188 * x*x*x - 1580 * x*x + 581 * x + 27;
		return `rgb(${R}, ${G}, ${B})`;
	},
	/** @param {number} x */
	viridis(x){
		x = this.clamp(x);
		const R = 237 * Math.pow(x, 6) - 61 * x + 69;
		const G = 221*x + 20;
		const B = -329*x*x + 274*x + 87;
		return `rgb(${R}, ${G}, ${B})`;
	},
	// TEST
	/** finds the TEST element and outputs test to it */
	test(steps = 96){
		function br(){
			elem.appendChild(document.createElement('br'));
		}
		const ignore = ['clamp', 'test'];
		console.debug('testing gradient.js ...');
		const elem = document.createElement('div');
		elem.id = 'test';
		document.documentElement.appendChild(elem);
		for (const gradient in this){
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
				swatch.style.backgroundColor = this[gradient](x);
				elem.appendChild(swatch);
			}
			br();
		}
		console.debug('gradient.js testing complete');
	},
};