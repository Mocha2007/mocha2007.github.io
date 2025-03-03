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
		// https://www.desmos.com/calculator/pfkgnr5z6z
		// test, loosely based on Princess Luna's color palette
		luna0: {
			r: [0, 649, -1810, 1416],
			g: [0, 404, -951, 766],
			b: [0, 261, 8, -23],
		},
		// test, loosely based on Princess Celestia's color palette
		luna1: {
			r: [14, 151, 521, -460],
			g: [37, -77, 664, -406],
			b: [44, 481, -1095, 794],
		},
		// test, loosely based on Fluttershy's color palette
		luna2: {
			r: [10, 460, -451, 236],
			g: [43, -167, 1024, -704],
			b: [43, 283, -546, 441],
		},
		// https://www.desmos.com/calculator/pecwugvins
		// test: red dominant in first third, green in second, blue in third,
		// roughly linear brightness increase
		luna3: {
			r: [0, 561, -974, 666],
			g: [0, 335, -63, -32],
			// original: 0, -167, 1157, -731 ... problem is that goes slightly outside [0, 255]
			// this introduces a nearly imperceptible change that fixes that.
			b: [7, -167, 1157, -744],
		},
	},
};