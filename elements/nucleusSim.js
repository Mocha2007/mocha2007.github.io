const timestep = 1e-4; // elapsed seconds per tick
const width_abs = 1e-9; // 1 nanometer
const grav = 6.6743e-11; // N m^2 kg
const c = 299792458;
const coulomb_const = 8.988e9; // N m^2 / C^2
const elementary_charge = 1.602176634e-19; // C
const fps = 30;
const particle_count = 100;

class Particle {
	constructor(mass, charge, nucleon, color, radius){
		/** @type {number} Mass in kg */
		this.mass = mass;
		/** @type {number} Charge in electrons */
		this.charge = charge;
		/** @type {boolean} is it a nucleon? */
		this.nucleon = nucleon;
		/** @type {string} color, purely aesthetic */
		this.color = color;
		/** @type {number} radius, purely aesthetic */
		this.radius = radius;
		Particle.particles.push(this);
	}
	get elem(){
		const circle = createSvgElement('circle');
		circle.setAttribute('fill', this.color);
		circle.setAttribute('r', this.radius);
		return circle;
	}
	/** @type {Particle[]} */
	static particles = [];
	static proton = new Particle(1.67262192369e-27, elementary_charge, true, 'red', 5);
	static neutron = new Particle(1.67492749804e-27, 0, true, 'grey', 5);
	static electron = new Particle(9.1093837015e-31, -elementary_charge, false, 'blue', 1);
}

class ParticleInstance {
	constructor(particle){
		/** @type {Particle} */
		this.particle = particle;
		this.coords = randomCoords();
		this.v = [random.uniform(-1, 1), random.uniform(-1, 1)].map(x => 0*1e-10*x);
		this.future_coords = [,];
		this.future_v = [,];
		ParticleInstance.particles.push(this);
		this.elem; // preload
	}
	get elem(){
		if (!this._elem){
			document.getElementById('canvas').appendChild(this._elem = this.particle.elem);
			this.updateElemCoords();
		}
		return this._elem;
	}
	/** @param {ParticleInstance} other */
	distSquared(other){
		return sum(this.coords.map((x, i) => (x-other.coords[i])**2));
	}
	pre_tick(){
		this.future_v = this.v.map(i => i); // copy
		// (1) gravity
		// F = G m1m2 / r^2
		// a = F/m
		// a = G m(other) / r^2
		/*
		ParticleInstance.particles.filter(p => this !== p).forEach(p => {
			const acc = grav * p.particle.mass / this.distSquared(p) * timestep;
			const dx = [p.coords[1] - this.coords[1], p.coords[0] - this.coords[0]];
			const accVector = splitForceXY(acc, Math.atan2(...dx));
			this.future_v = this.future_v.map((x, i) => x + accVector[i]);
		});
		*/
		// (2) electromagnetic force
		// https://en.wikipedia.org/wiki/Coulomb%27s_law
		// VERY similar to gravity...
		if (this.particle.charge)
			ParticleInstance.particles.filter(p => this !== p && p.particle.charge).forEach(p => {
				const acc = coulomb_const * p.particle.charge * -this.particle.charge / this.distSquared(p) * timestep;
				const dx = [p.coords[1] - this.coords[1], p.coords[0] - this.coords[0]];
				const accVector = splitForceXY(acc, Math.atan2(...dx));
				this.future_v = this.future_v.map((x, i) => x + accVector[i]);
			});
		// (3) nuclear force
		// rough estimate
		if (this.particle.nucleon)
			ParticleInstance.particles.filter(p => this !== p && p.particle.nucleon).forEach(p => {
				const d = Math.sqrt(this.distSquared(p));
				const acc = reidForce(d) / this.particle.mass * timestep;
				const dx = [p.coords[1] - this.coords[1], p.coords[0] - this.coords[0]];
				const accVector = splitForceXY(acc, Math.atan2(...dx));
				this.future_v = this.future_v.map((x, i) => x + accVector[i]);
			});
		// todo make sure v < c
		// now, update future coords
		this.future_coords = this.coords.map((x, i) => x + this.v[i]*timestep);
	}
	tick(){
		this.coords = this.future_coords;
		this.v = this.future_v;
		// update element
		this.updateElemCoords();
	}
	updateElemCoords(){
		const scale = window.outerWidth / width_abs; // px / m
		const [x, y] = this.coords.map(x => x * scale);
		this._elem.setAttribute('transform', `translate(${x}, ${y})`);
	}
	/** @type {ParticleInstance[]} */
	static particles = [];
}

/**
 * EXTREMELY approximate; based on
 * https://en.wikipedia.org/wiki/File:ReidForce2.jpg
 * https://www.desmos.com/calculator/o9grawqkdo
 * @param {number} x - distance in meters
 */
function reidForce(x){
	x *= 1e15; // convert from m to fm
	x = 3.2*x-4.2; // shift graph
	const y = -2.25*Math.exp(-x) + 0.5*Math.exp(-2*x);
	return y * 1e4; // convert from units of 10 kN to units of N
}

function randomCoords(){
	return range(2).map(_ => random.uniform(0, width_abs));
}

function splitForceXY(force, angle){
	return [force*Math.cos(angle), force*Math.sin(angle)];
}

function init(){
	// randomly generate shit
	range(particle_count).forEach(_ => new ParticleInstance(random.choice(Particle.particles)));
	// sim
	setInterval(() => {
		ParticleInstance.particles.forEach(p => p.pre_tick());
		ParticleInstance.particles.forEach(p => p.tick());
	}, 1000/fps);
}