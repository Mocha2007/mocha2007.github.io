/* global createSvgElement, particleData, pi, random, range, reactionData */
/* exported fps, init, onlyNucleons, onlyProtium, spawnClick */
'use strict';

let fps = 30; // todo: temporary
const desiredParticles = 50;
const interactionRadius = 50; // todo: temporary
const reactionCooldown = 5; // s
let onlyNucleons = true;
let onlyProtium = false;

/** @type {Particle[]} */
const particles = [];
class Particle {
	/**
	 * @param {string} name
	 * @param {string} category
	 * @param {{char: string, sup: string, sub: string, overline: boolean, presup: string, presub: string}} symbol
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
	get hasHeavierIsotope(){
		if (this.category !== 'atom')
			return false;
		const [elementName, massString] = this.name.split('-');
		const mass = parseInt(massString);
		// console.log(elementName, mass);
		if (!isFinite(mass))
			return false;
		const targetName = elementName + '-' + (mass+1);
		return particles.some(p => p.name === targetName) ? targetName : false;
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
			sup.setAttribute('transform', 'translate(18, -15)');
			g.appendChild(sup);
		}
		if (this.symbol && this.symbol.sub){
			const sub = createSvgElement('text');
			sub.innerHTML = this.symbol.sub;
			sub.classList.add('sub');
			sub.setAttribute('transform', 'translate(18, 5)');
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
			presup.setAttribute('transform', 'translate(-15, -15)');
			g.appendChild(presup);
		}
		if (this.symbol && this.symbol.presub){
			const presub = createSvgElement('text');
			presub.innerHTML = this.symbol.presub;
			presub.classList.add('presub');
			presub.setAttribute('transform', 'translate(-15, 5)');
			g.appendChild(presub);
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
	 * @param {string} tags
	 */
	constructor(reagents, products, tags){
		this.reagents = reagents;
		this.products = products;
		this.tags = tags ? tags.split(' ') : [];
		reactions.push(this);
	}
	/** Are the inputs enough for this reaction? */
	satisfies(){
		const args = new Array(...arguments);
		for (const r of this.reagents){
			const i = args.indexOf(r);
			if (i === -1)
				return false;
			args.splice(i, 1);
		}
		return true;
	}
	static fromObject(o){
		new Reaction(
			o.reagents.map(name => Particle.fromName(name)),
			o.products.map(name => Particle.fromName(name)),
			o.tags);
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
		/** this many ticks must pass before it can react */
		this.cooldown = fps*reactionCooldown;
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
	bounce(){
		/* eslint-disable no-extra-parens */
		if ((this.x <= 0 && this.vx < 0)
			|| (window.innerWidth <= this.x && 0 < this.vx))
			this.vx *= -1;
		else if (this.y <= 0 && this.vy < 0
			|| (window.innerHeight <= this.y && 0 < this.vy))
			this.vy *= -1;
		/* eslint-enable no-extra-parens */
	}
	/** if a reactable particle is nearby, react! */
	checkreactions(){
		if (0 < this.cooldown) // can't react during cooldown
			return false;
		const interactable = instances.filter(i => i !== this
			&& this.distanceTo(i) < interactionRadius);
		for (const other of interactable){
			// annihilation
			if (this.type.antiparticle !== this.type
				&& other.type.antiparticle === this.type){
				// DELETE
				this.delete();
				other.delete();
				// CREATE
				range(2).forEach(() => { // create two photons
					new Instance(Particle.fromName('photon'),
						(this.x + other.x)/2,
						(this.y + other.y)/2);
				});
				return true;
			}
			// neutron addition
			const isoName = this.type.hasHeavierIsotope;
			if (isoName && other.type.name === 'neutron'){
				console.log('NEUTRON ADDITION!');
				// DELETE
				this.delete();
				other.delete();
				// CREATE
				new Instance(Particle.fromName(isoName),
					(this.x + other.x)/2,
					(this.y + other.y)/2);
			}
		}
		// other reactions
		for (const reaction of reactions){
			if (reaction.satisfies(this.type, ...interactable.map(i => i.type))){
				console.log(reaction.reagents.map(r => r.name).join(' + '),
					'=>', reaction.products.map(r => r.name).join(' + '));
				// REACT!!!
				// DELETE
				this.delete();
				reaction.reagents.forEach(r => {
					try {
						interactable.filter(ii => ii.type === r)[0].delete();
					}
					catch (e){
						// TypeError for when it doesnt exist...
					}
				});
				// CREATE
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
		// delete without replacement
		this.delete(false);
		// choose random decay mode
		/** @type {Particle[]} */
		const pp = random.choice(this.type.decays).map(name => Particle.fromName(name));
		pp.map(p => new Instance(p, this.x, this.y));
	}
	delete(replace = true){
		if (this.element)
			this.element.remove();
		// remove from instance list
		const i = instances.indexOf(this);
		instances.splice(i, 1);
		// new particle
		if (replace && document.getElementById('canvas').children.length < desiredParticles)
			Instance.random();
	}
	/** @param {Instance} other */
	distanceTo(other){
		return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2));
	}
	tick(){
		this.cooldown--;
		const c = this.type.name === 'photon' ? 20 : 1;
		this.x += this.vx*c;
		this.y += this.vy*c;
		if (!this.element) // should never trigger, but ...
			return;
		this.element.setAttribute('transform', `translate(${this.x}, ${this.y})`);
		if (this.outOfBounds){
			if (this.type.category === 'atom')
				this.bounce();
			else
				return this.delete();
		}
		if (!this.type.stable && random.random() < 1/1000) // todo
			this.decay();
		else if (!this.checkreactions())
			setTimeout(() => this.tick(), 1000/fps);
	}
	static random(){
		if (onlyProtium)
			return new Instance(Particle.fromName('proton'));
		const particle = new Instance(random.choice(particles.filter(p =>
			onlyNucleons ? ['protium', 'proton', 'neutron', 'electron']
				.includes(p.name): p.category !== 'atom')));
		return particle;
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

/** @param {Event} event */
function spawnClick(event){
	// const onlyBaryons = event.shiftKey;
	const i = Instance.random();
	i.x = event.clientX;
	i.y = event.clientY;
	// console.log('spawned ' + i.type.name);
}

/** main function */
function init(){
	// read particle data
	particleData.forEach(p => particles.push(Particle.fromObject(p)));
	// read reaction data
	reactionData.forEach(r => Reaction.fromObject(r));
	// test
	range(desiredParticles).forEach(() => Instance.random());
	// done!
	console.info('particleZoo.js loaded.');
}
/** TODO
 * - decay
 * - combinations - eg. proton + electron = H
 */