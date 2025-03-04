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
		// simple crap
		// most saturated orange/yellow possible
		grey: {
			r: [0, 255, 0, 0],
			g: [0, 255, 0, 0],
			b: [0, 255, 0, 0],
		},
		blue: {
			r: [0, 0, 255, 0],
			g: [0, 0, 255, 0],
			b: [0, 509, -254, 0],
		},
		blueyellow: {
			r: [0, 93, 486, -324],
			g: [0, 93, 486, -324],
			b: [0, 2293.5, -6115.5, 4077],
		},
		purpleorange: {
			r: [128, -275, 402, 0],
			g: [0, 236, -108, 0],
			b: [128, -20, -108, 0],
		},
		reddit: {
			r: [148, -67, 174, 0],
			g: [148, 50, -60, 0],
			b: [255, -227, 66, 0],
		},
		// https://www.desmos.com/calculator/pfkgnr5z6z
		// test, loosely based on Princess Luna's color palette
		/*luna0: {
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
			g: [43, -165, 1024, -671],
			b: [43, 283, -546, 441],
		},
		// https://www.desmos.com/calculator/pecwugvins
		// test: red dominant in first third, green in second, blue in third,
		// roughly linear brightness increase
		luna3: {
			r: [7, 541, -974, 664],
			g: [0, 334, -63, -32],
			// original: 0, -167, 1157, -731 ... problem is that goes slightly outside [0, 255]
			// this introduces a nearly imperceptible change that fixes that.
			b: [7, -167, 1157, -756],
		},*/
		// luna3 but cubic fit on
		/*
			x	r	g	b
			0	0	0	0
			1/3	85	85	B1
			2/3	R1	170	170
			1	255	255	255
			where B1 = 57 chosen st. the minimum is positive,
			and R1 = 100 chosen st. the bendiness is just barely within limits
		*/
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
		// most saturated orange/yellow possible
		luna2alt: {
			r: [192, 12, 135, -189],
			g: [0, 255, 229.5, -229.5],
			b: [0, 379.5, -904.5, 675],
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
	},
};