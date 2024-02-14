/* exported convert */
/* global createSvgElement */

const convert = {
	constants: {
		e: {
			mm: 272.38, // g/mol
		},
		t: {
			mm: 288.431, // g/mol
		},
	},
	e(fromMol){
		const E_G = +this.elem.e_g.value;
		const E_MOL = +this.elem.e_mol.value;
		const C = 1000 / this.constants.e.mm; // cause mL -> L
		if (fromMol)
			this.elem.e_g.value = E_MOL / C;
		else
			this.elem.e_mol.value = E_G * C;
		// do bars
		this.svg.e(+this.elem.e_g.value);
	},
	elem: {
		/** @returns {HTMLInputElement} */
		get e_g(){
			return document.getElementById('e_g');
		},
		/** @returns {HTMLInputElement} */
		get e_mol(){
			return document.getElementById('e_mol');
		},
		/** @returns {HTMLInputElement} */
		get t_g(){
			return document.getElementById('t_g');
		},
		/** @returns {HTMLInputElement} */
		get t_mol(){
			return document.getElementById('t_mol');
		},
	},
	hl(){
		const H0 = +document.getElementById('hl_0').value; // t between dose and measurement
		const H1 = +document.getElementById('hl_1').value; // hl
		const H2 = +document.getElementById('hl_2').value; // t between doses
		const MEASUREMENT = +document.getElementById('hl_3').value;
		const PEAK = MEASUREMENT * Math.pow(2, H0 / H1);
		const TROUGH = PEAK * Math.pow(0.5, H2 / H1);
		document.getElementById('hl_o0').innerHTML = PEAK;
		document.getElementById('hl_o1').innerHTML = TROUGH;
	},
	svg: {
		// TODO THIS IS NOT WORKING FOR SOME REASON
		constants: {
			barHeight: 50, // px
			sexes: [['f', 'magenta'], ['m', 'blue']], // trying to design this to be as extensible as possible
			// width: 200, // px
		},
		e(val){
			const extrema = [[30, 400], [10, 50]];
			const elem = document.getElementById('e_bars');
			const svg = this.range(val, extrema);
			elem.innerHTML = '';
			elem.appendChild(svg);
		},
		range(x, extrema = []){
			const svg = document.createElement('svg');
			const W = 4;
			const H = extrema.length + 1;
			svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
			svg.setAttribute('width', W * this.constants.barHeight);
			svg.setAttribute('height', H * this.constants.barHeight);
			svg.setAttribute('aria-label', 'Reference Intervals by Sex (Cis)');
			const MAX = Math.max(...extrema.flat());
			const MIN = Math.min(...extrema.flat());
			const RANGE = MAX - MIN;
			// reference intervals by sex
			this.constants.sexes.forEach((pair, i) => {
				const [sex, color] = pair;
				const bar = createSvgElement('rect');
				const THIS_EXTREMA = extrema[i];
				const X = (THIS_EXTREMA[0] - MIN) / RANGE * W;
				const WIDTH = (THIS_EXTREMA[1] - THIS_EXTREMA[0]) / RANGE * W;
				bar.setAttribute('fill', color);
				bar.setAttribute('x', X);
				bar.setAttribute('y', i);
				bar.setAttribute('width', WIDTH);
				bar.setAttribute('height', 1);
				svg.appendChild(bar);
			});
			return svg;
		},
		t(val){
			const extrema = [[15, 70], [300, 1000]];
			const elem = document.getElementById('t_bars');
			const svg = this.range(val, extrema);
			elem.innerHTML = '';
			elem.appendChild(svg);
		},
	},
	t(fromMol){
		const T_G = +this.elem.t_g.value;
		const T_MOL = +this.elem.t_mol.value;
		const C = 10 / this.constants.t.mm; // cause dL -> L
		if (fromMol)
			this.elem.t_g.value = T_MOL / C;
		else
			this.elem.t_mol.value = T_G * C;
		// do bars
		this.svg.t(+this.elem.t_g.value);
	},
};