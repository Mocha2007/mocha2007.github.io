/* exported convert */
/* global createSvgElement, range, title */

const convert = {
	constants: {
		e: {
			extrema: [[30, 400], [10, 50]],
			literFactor: 1000, // mL -> L
			mm: 272.38, // g/mol
			units: ['pg/mL', 'pmol/L'],
		},
		t: {
			extrema: [[15, 70], [300, 1000]],
			literFactor: 10, // dL -> L
			mm: 288.431, // g/mol
			units: ['ng/dL', 'nmol/L'],
		},
	},
	elem: {
		/** @returns {HTMLInputElement} */
		get molar(){
			return document.getElementById('molar');
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
	/** make the hormone elements/functions */
	hormone(id){
		function update(fromMol){
			const G = +inputs[0].value;
			const MOL = +inputs[1].value;
			const C = convert.constants[id].literFactor / convert.constants[id].mm; // cause mL -> L
			if (fromMol)
				inputs[0].value = MOL / C;
			else
				inputs[1].value = G * C;
			// do bars
			barContainer.innerHTML = '';
			barContainer.appendChild(
				convert.svg.range(+inputs[0].value, convert.constants[id].extrema));
		}
		// elem
		const container = document.createElement('div');
		container.id = `container_${id}`;
		this.elem.molar.appendChild(container);
		const header = document.createElement('h3');
		header.innerHTML = title(id);
		container.appendChild(header);
		// inputs
		const inputs = range(2).map(i => {
			const input = document.createElement('input');
			input.onkeyup = input.onmouseup = () => update(i);
			container.appendChild(input);
			container.appendChild(document.createTextNode(this.constants[id].units[i]));
			container.appendChild(document.createElement('br'));
			input.type = 'number';
			input.value = 0;
			return input;
		});
		// bar container
		const barContainer = document.createElement('div');
		container.appendChild(barContainer);
		// first update
		update();
	},
	init(){
		Object.keys(this.constants).forEach(id => this.hormone(id));
	},
	svg: {
		// TODO THIS IS NOT WORKING FOR SOME REASON
		constants: {
			barHeight: 50, // px
			sexes: ['magenta', 'blue'], // trying to design this to be as extensible as possible
			// width: 200, // px
		},
		range(x, extrema = []){
			const svg = createSvgElement('svg');
			const W = 4;
			const H = extrema.length + 1;
			svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
			svg.setAttribute('width', W * this.constants.barHeight);
			svg.setAttribute('height', H * this.constants.barHeight);
			svg.setAttribute('aria-label', 'Reference Intervals by Sex (Cis)');
			const MAX = Math.max(x, ...extrema.flat());
			const MIN = Math.min(x, ...extrema.flat());
			const RANGE = MAX - MIN;
			// reference intervals by sex
			this.constants.sexes.forEach((color, i) => {
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
			// measurement disk
			const MEASUREMENT = createSvgElement('circle');
			MEASUREMENT.setAttribute('fill', 'white');
			MEASUREMENT.setAttribute('cx', (x - MIN)/RANGE);
			MEASUREMENT.setAttribute('cy', H - 0.5);
			MEASUREMENT.setAttribute('r', 0.1);
			svg.appendChild(MEASUREMENT);
			return svg;
		},
	},
	wait(){
		if (typeof createSvgElement === 'undefined')
			setTimeout(() => this.wait(), 100);
		else
			this.init();
	},
};

// wait for common.js to be loaded, then run
convert.wait();