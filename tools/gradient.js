/* exported GRADIENT */

// https://sjmgarnier.github.io/viridis/reference/figures/maps.png
const GRADIENT = {
	clamp(x){
		return x < 0 ? 0 : x > 1 ? 1 : x;
	},
	viridis(x){
		const R = 237 * Math.pow(x, 6) - 61 * x + 69;
		const G = 221*x + 20;
		const B = -329*x*x + 274*x + 87;
		return `rgb(${R}, ${G}, ${B})`;
	},
};