/* eslint-disable max-len */
/* exported GRADIENT */

// Rough approximations of these gradients:
// https://sjmgarnier.github.io/viridis/reference/figures/maps.png
const GRADIENT = {
	// GRADIENTS
	/** @param {number} x */
	gradient(x, name = 'viridis'){
		const color = this.gradient_raw(x, this.gradientData[name]);
		return `rgb(${Math.round(color.R)}, ${Math.round(color.G)}, ${Math.round(color.B)})`;
	},
	gradient_raw(x, gradient){
		x = x < 0 ? 0 : x > 1 ? 1 : x;
		const R = gradient.r.map((c, i) => c*Math.pow(x, i)).reduce((a, b) => a+b, 0);
		const G = gradient.g.map((c, i) => c*Math.pow(x, i)).reduce((a, b) => a+b, 0);
		const B = gradient.b.map((c, i) => c*Math.pow(x, i)).reduce((a, b) => a+b, 0);
		return {R, G, B};
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
		// https://personal.sron.nl/%7Epault/
		// errors: not monotonic increasing, too bendy
		sunset: {
			r: [57, 210, 576, -675],
			g: [78, 596, -563, -108],
			b: [157, 730, -1877, 1031],
		},
		// errors: not monotonic increasing
		nightfall: {
			r: [18, 326, 486, -670],
			g: [90, 542, -581, -27],
			b: [86, 1319, -3177, 1791],
		},
		burd: {
			r: [33, 720, -584, 0],
			g: [102, 658, -736, 0],
			b: [172, 429, -558, 0],
		},
		prgn: {
			r: [118, 607, -698, 0],
			g: [42, 742, -664, 0],
			b: [131, 540, -616, 0],
		},
		// https://upload.wikimedia.org/wikipedia/commons/0/0a/Parrot_GB_example.png
		gameboy: {
			r: [41, 5.5, 153, -76.5],
			g: [65, 29, 175.5, -139.5],
			b: [57, 71.5, -36, -76.5],
		},
		// luna-made <3
		elevation: {
			r: [81, 366, -132, -70],
			g: [167, 314, -747, 512],
			b: [0, 734, -1618, 1130],
		},
		bathymetry: {
			r: [0, 5, 669, -420],
			g: [137, 139, 7, -28],
			b: [186, 76, 21, -28],
		},
	},
};