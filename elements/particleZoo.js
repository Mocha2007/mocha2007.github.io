/* global createSvgElement, particleData, random, range */
/* exported fps, init */
'use strict';

let fps = 30; // todo: temporary

/** @type {Particle[]} */
const particles = [];
class Particle {
	/**
	 * @param {string} name
	 * @param {string} category
	 * @param {{char: string, sup: string, sub: string}} symbol
	 * @param {number} spin
	 * @param {number} charge
	 * @param {number} mass
	 */
	constructor(name, category, symbol, spin, charge, mass){
		this.name = name;
		this.category = category;
		this.symbol = symbol;
		this.spin = spin;
		this.charge = charge;
		this.mass = mass;
	}
	get color(){
		// todo
		return {
			baryon: 'skyBlue',
			boson: 'pink',
			lepton: 'lime',
			quark: 'lavender',
		}[this.category];
	}
	get element(){
		// todo
		const g = createSvgElement('g');
		g.classList.add('particleGroup');
		const circle = createSvgElement('circle');
		circle.setAttribute('fill', this.color);
		circle.setAttribute('r', this.radius);
		circle.classList.add('particle');
		g.appendChild(circle);
		g.appendChild(this.textElement);
		return g;
	}
	/** radius for circle element */
	get radius(){
		return Math.log(this.mass)/2+43; // todo: fine-tune this
	}
	get textElement(){
		const g = createSvgElement('g');
		g.classList.add('symbolGroup');
		const char = createSvgElement('text');
		char.innerHTML = this.symbol.char;
		char.classList.add('char');
		g.appendChild(char);
		if (this.symbol && this.symbol.sup){
			const sup = createSvgElement('text');
			sup.innerHTML = this.symbol.sup;
			sup.classList.add('sup');
			sup.setAttribute('transform', 'translate(15, -10)');
			g.appendChild(sup);
		}
		if (this.symbol && this.symbol.sub){
			const sub = createSvgElement('text');
			sub.innerHTML = this.symbol.sub;
			sub.classList.add('sub');
			sub.setAttribute('transform', 'translate(15, 5)');
			g.appendChild(sub);
		}
		if (this.symbol && this.symbol.overline){
			const sub = createSvgElement('text');
			sub.innerHTML = '_';
			sub.classList.add('overline');
			sub.setAttribute('transform', 'translate(0, -25)');
			g.appendChild(sub);
		}
		g.setAttribute('transform', `translate(${this.radius}, ${this.radius+10})`);
		return g;
	}
	static fromObject(o){
		const p = new Particle(
			o.name,
			o.category,
			o.symbol,
			o.spin,
			o.charge,
			o.mass
		);
		return p;
	}
}

class Instance {
	/**
	 * @param {Particle} type
	 */
	constructor(type){
		this.type = type;
		[this.x, this.y, this.vx, this.vy] = Instance.spawnPoint();
		// eslint-disable-next-line no-extra-parens
		this.id = 'particle'+random.random();
	}
	get element(){
		return document.getElementById(this.id);
	}
	get outOfBounds(){
		const buffer = 50;
		return this.x < -buffer || window.innerWidth+buffer < this.x
			|| this.y < -buffer || window.innerHeight+buffer < this.y;
	}
	createElement(){
		const testParticle = this.type.element;
		testParticle.id = this.id;
		document.getElementById('canvas').appendChild(testParticle);
		this.tick();
	}
	delete(){
		this.element.remove();
		// new particle
		Instance.random();
	}
	tick(){
		const c = this.type.name === 'photon' ? 20 : 1;
		this.x += this.vx*c;
		this.y += this.vy*c;
		this.element.setAttribute('transform', `translate(${this.x}, ${this.y})`);
		if (this.outOfBounds)
			this.delete();
		else
			setTimeout(() => this.tick(), 1000/fps);
	}
	static random(){
		const p = new Instance(random.choice(particles));
		p.createElement();
		console.info(p.id);
		return p;
	}
	static spawnPoint(){
		return [
			random.uniform(0, window.innerWidth),
			random.uniform(0, window.innerHeight),
			random.uniform(-1, 1),
			random.uniform(-1, 1),
		]; // todo
	}
}

/** main function */
function init(){
	// read particle data
	particleData.forEach(p => particles.push(Particle.fromObject(p)));
	// test
	range(20).forEach(() => Instance.random());
	// done!
	console.info('particleZoo.js loaded.');
}