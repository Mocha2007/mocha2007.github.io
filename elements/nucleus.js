/* exported nucleus */
/* global createSvgElement, ChemElement, chooseTimeUnit, Isotope, sigFigs, unitString */
const nucleus = {
	neutrons: 146,
	protons: 92,
	scale: 5,
	get nucleons(){
		return this.neutrons + this.protons;
	},
	/** @returns {SVGAElement} */
	get svg(){
		return document.getElementById('nucleus');
	},
	/** @param {'proton'|'neutron'} type */
	nucleonElement(type){
		const elem = createSvgElement('circle');
		elem.classList.add(type);
		elem.setAttribute('r', this.scale);
		return elem;
	},
	update(){
		// console.debug(this.protons, this.neutrons);
		this.svg.innerHTML = '';
		let remainingProtons = this.protons;
		let remainingNeutrons = this.neutrons;
		for (let i = this.nucleons-1; 0 <= i; i--){
			// draw nucleon a fixed distance from the origin with certain angle
			const r = 0.7*this.scale*Math.sqrt(i);
			const theta = 2 * Math.PI * r / this.scale;
			const x = r*Math.cos(theta);
			const y = r*Math.sin(theta);
			const type = this.neutrons === 0
				|| remainingNeutrons * this.protons < remainingProtons * this.neutrons
				? 'proton' : 'neutron';
			if (type === 'proton')
				remainingProtons--;
			else
				remainingNeutrons--;
			const elem = this.nucleonElement(type);
			elem.setAttribute('cx', x);
			elem.setAttribute('cy', y);
			this.svg.appendChild(elem);
		}
		// todo: display isotope name and data (if in the database)
		const text = createSvgElement('text');
		text.setAttribute('x', -100);
		text.setAttribute('y', -85);
		const e = ChemElement.fromZ(this.protons);
		text.innerHTML = `${e.name}-${this.nucleons}`;
		this.svg.appendChild(text);
		// isotope data
		const isotope = Isotope.find(`${e.symbol}-${this.nucleons}`);
		if (isotope === undefined)
			return;
		console.debug(isotope);
		const isoText = createSvgElement('text');
		isoText.setAttribute('x', -95);
		isoText.setAttribute('y', -85);
		isoText.classList.add('isoText');
		const decayString = isotope.decayTypes
			.map(d => `${d[0].name} (${sigFigs(d[1]*100, 3)}%)`)
			.join(' ; ');
		const [c, u] = chooseTimeUnit(isotope.halfLife);
		const hlString = isotope.halfLife === Infinity ? 'Stable' : unitString(isotope.halfLife/c, u);
		const t = [`Abundance: ${isotope.abundance*100}%`,
			`decayTypes: ${decayString}`,
			`halfLife: ${hlString}`];
		t.forEach(s => {
			const tspan = createSvgElement('tspan');
			tspan.innerHTML = s;
			tspan.setAttribute('x', -95);
			tspan.setAttribute('dy', '1.2em');
			isoText.appendChild(tspan);
		});
		this.svg.appendChild(isoText);
	},
	updateProtons(n = 0){
		if (n === 0)
			this.protons = parseInt(document.getElementById('protonSelector').value);
		else if (0 < this.protons + n)
			this.protons += n;
		document.getElementById('protonSelector').value = this.protons;
		this.update();
	},
	updateNeutrons(n = 0){
		if (n === 0)
			this.neutrons = parseInt(document.getElementById('neutronSelector').value);
		else if (0 <= this.neutrons + n)
			this.neutrons += n;
		document.getElementById('neutronSelector').value = this.neutrons;
		this.update();
	},
};