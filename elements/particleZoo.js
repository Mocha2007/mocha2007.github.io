/* global createSvgElement, particleData, pi, random, range, reactionData */
/* exported fps, init, spawnClick */
'use strict';

let fps = 30; // todo: temporary
const desiredParticles = 20;
const interactionRadius = 50; // todo: temporary

/** @type {Particle[]} */
const particles = [];
class Particle {
	/**
	 * @param {string} name
	 * @param {string} category
	 * @param {{char: string, sup: string, sub: string, overline: boolean, presup: string}} symbol
	 * @param {number} spin
	 * @param {number} charge
	 * @param {number} mass
	 * @param {string[][]} decays
	 * @param {number} halfLife
	 */
	constructor(name, category, symbol, spin, charge, mass, decays, halfLife){
		this.name = name;
		this.category = category;
		this.symbol = symbol;
		this.spin = spin;
		this.charge = charge;
		this.mass = mass;
		this.decays = decays;
		this.halfLife = halfLife;
	}
	get antiparticle(){
		// look for SAME MASS but OPPOSITE CHARGE
		return particles.filter(p => p.mass === this.mass && p.charge === -this.charge)[0];
	}
	get color(){
		// todo
		return {
			atom: 'magenta',
			baryon: 'skyBlue',
			boson: 'pink', // sorta unused
			meson: 'orange',
			lepton: 'lime',
			quark: 'lavender', // unused
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
		return Math.max(0, Math.log(this.mass)/2+43); // todo: fine-tune this
	}
	get stable(){
		return !isFinite(this.halfLife);
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
		if (this.symbol && this.symbol.presup){
			const presup = createSvgElement('text');
			presup.innerHTML = this.symbol.presup;
			presup.classList.add('presup');
			presup.setAttribute('transform', 'translate(-15, -10)');
			g.appendChild(presup);
		}
		g.setAttribute('transform', `translate(${this.radius}, ${this.radius+10})`);
		return g;
	}
	/** @param {string} name */
	static fromName(name){
		return particles.filter(p => p.name === name)[0];
	}
	static fromObject(o){
		const p = new Particle(
			o.name,
			o.category,
			o.symbol,
			o.spin,
			o.charge,
			o.mass,
			o.decays,
			o.halfLife
		);
		return p;
	}
}

/** @type {Reaction[]} */
const reactions = [];
class Reaction {
	/**
	 * @param {Particle[]} reagents
	 * @param {Particle[]} products
	 */
	constructor(reagents, products){
		this.reagents = reagents;
		this.products = products;
		reactions.push(this);
	}
	/** Are the inputs enough for this reaction? */
	satisfies(){
		const args = new Array(...arguments);
		return this.reagents.every(reagent => args.includes(reagent));
	}
	static fromObject(o){
		new Reaction(o.reagents.map(name => Particle.fromName(name)),
			o.products.map(name => Particle.fromName(name)));
	}
}

/** @type {Instance[]} */
const instances = [];
class Instance {
	/**
	 * @param {Particle} type
	 * @param {number} x
	 * @param {number} y
	 */
	constructor(type, x, y){
		this.type = type;
		[this.x, this.y, this.vx, this.vy] = Instance.spawnPoint();
		if (isFinite(x))
			this.x = x;
		if (isFinite(y))
			this.y = y;
		// eslint-disable-next-line no-extra-parens
		this.id = 'particle'+random.random();
		instances.push(this);
		this.createElement();
	}
	get element(){
		return document.getElementById(this.id);
	}
	get outOfBounds(){
		const buffer = 50;
		return this.x < -buffer || window.innerWidth+buffer < this.x
			|| this.y < -buffer || window.innerHeight+buffer < this.y;
	}
	/** if a reactable particle is nearby, react! */
	checkreactions(){
		const interactable = instances.filter(i => i !== this
			&& this.distanceTo(i) < interactionRadius);
		for (const other of interactable){
			if (this.type.antiparticle !== this.type
				&& other.type.antiparticle === this.type){ // annihilation
				range(2).forEach(() => { // create two photons
					new Instance(Particle.fromName('photon'),
						(this.x + other.x)/2,
						(this.y + other.y)/2);
				});
				other.delete();
				this.delete();
				// console.log('ANNIHILATION!!!');
				return true;
			}
		}
		// other reactions
		for (const reaction of reactions){
			if (reaction.satisfies(this, ...interactable)){
				// REACT!!!
				this.delete();
				// delete other reagents
				reaction.reagents.filter(r => r !== this.type).forEach(r => {
					interactable.filter(ii => ii.type === r)[0].delete();
				});
				// create products!!!
				reaction.products.forEach(product => {
					new Instance(product, this.x, this.y);
				});
				return true;
			}
		}
		return false;
	}
	createElement(){
		const testParticle = this.type.element;
		testParticle.id = this.id;
		document.getElementById('canvas').appendChild(testParticle);
		this.tick();
	}
	decay(){
		// console.log('DECAY!!!');
		// choose random decay mode
		/** @type {Particle[]} */
		const pp = random.choice(this.type.decays).map(name => Particle.fromName(name));
		pp.map(p => new Instance(p, this.x, this.y));
		// delete without replacement
		this.delete(false);
	}
	delete(replace = true){
		if (this.element)
			this.element.remove();
		// new particle
		if (replace && document.getElementById('canvas').children.length < desiredParticles)
			Instance.random();
		// remove from instance list
		const i = instances.indexOf(this);
		instances.splice(i, 1);
	}
	/** @param {Instance} other */
	distanceTo(other){
		return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2));
	}
	tick(){
		const c = this.type.name === 'photon' ? 20 : 1;
		this.x += this.vx*c;
		this.y += this.vy*c;
		if (!this.element) // should never trigger, but ...
			return;
		this.element.setAttribute('transform', `translate(${this.x}, ${this.y})`);
		if (this.outOfBounds)
			this.delete();
		else if (!this.type.stable && random.random() < 1/100) // todo
			this.decay();
		else if (!this.checkreactions())
			setTimeout(() => this.tick(), 1000/fps);
	}
	static random(){
		const p = new Instance(random.choice(particles.filter(p => p.category !== 'atom')));
		return p;
	}
	/** @returns {[number, number, number, number]} */
	static spawnPoint(){
		const theta = random.uniform(0, 2*pi);
		return [
			random.uniform(0, window.innerWidth),
			random.uniform(0, window.innerHeight),
			Math.cos(theta),
			Math.sin(theta),
		]; // todo
	}
}

function spawnClick(event){
	const e = Instance.random();
	e.x = event.clientX;
	e.y = event.clientY;
	console.log('spawned ' + e.type.name);
}

/** main function */
function init(){
	// read particle data
	particleData.forEach(p => particles.push(Particle.fromObject(p)));
	// read reaction data
	reactionData.forEach(r => Reaction.fromObject(r));
	// test
	range(20).forEach(() => Instance.random());
	// done!
	console.info('particleZoo.js loaded.');
}
/** TODO
 * - decay
 * - combinations - eg. proton + electron = H
 */