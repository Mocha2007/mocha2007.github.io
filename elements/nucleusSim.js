const timestep = 1e-4; // elapsed seconds per tick
const width_abs = 1e-9; // 1 nanometer
const c = 299792458;
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
	static proton = new Particle(1, 1, true, 'red', 5);
	// static neutron = new Particle(1, 0, true, 'grey', 5);
	static electron = new Particle(1e-3, -1, false, 'blue', 1);
}

class ParticleInstance {
	constructor(particle){
		/** @type {Particle} */
		this.particle = particle;
		this.coords = randomCoords();
		this.v = [random.uniform(-1, 1), random.uniform(-1, 1)].map(x => 1e-8*x);
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
		this.future_v = this.v.map(x => x); // copy
		// (1) "electromagnetic force"
		if (this.particle.charge)
			ParticleInstance.particles.filter(p => this !== p).forEach(p => {
				const d2 = this.distSquared(p);
				const acc = -1e-8 * this.particle.charge * p.particle.charge * stayCloseishForce(d2, 10e-15) / (this.particle.mass) * timestep;
				const dx = [p.coords[1] - this.coords[1], p.coords[0] - this.coords[0]];
				const accVector = splitForceXY(acc, Math.atan2(...dx));
				this.future_v = this.future_v.map((x, i) => x + accVector[i]);
			});
		// (2) the "stay kinda close but not too close" force
		if (this.particle.nucleon)
			ParticleInstance.particles.filter(p => this !== p).forEach(p => {
				const d2 = this.distSquared(p);
				const acc = 1e-7 * stayCloseishForce(d2, 1e-15) / (this.particle.mass) * timestep;
				const dx = [p.coords[1] - this.coords[1], p.coords[0] - this.coords[0]];
				const accVector = splitForceXY(acc, Math.atan2(...dx));
				this.future_v = this.future_v.map((x, i) => x + accVector[i]);
			});
		// (3) "YOU'RE GOING TOO FAST" universal force
		const MEDIUM_DECEL_CONST = -1e10;
		this.future_v = this.future_v.map(x => x + Math.sign(x)*MEDIUM_DECEL_CONST*timestep*x**2);
		// make sure v < c
		this.future_v = this.future_v.map(x => clamp(x, -c, c));
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

function stayCloseishForce(dist, r){
	dist /= r;
	return (-Math.exp(-Math.pow(5/3 * dist - 5/6, 2)) + 0.5)/dist;
}

function randomCoords(){
	return [random.uniform(0, width_abs), random.uniform(0, width_abs) * window.outerHeight / window.outerWidth];
}

function splitForceXY(force, angle){
	return [force*Math.cos(angle), force*Math.sin(angle)];
}

function init(){
	console.info("Atom Bullshit");
	// randomly generate shit
	range(particle_count).forEach(_ => new ParticleInstance(random.choice(Particle.particles)));
	// sim
	setInterval(() => {
		ParticleInstance.particles.forEach(p => p.pre_tick());
		ParticleInstance.particles.forEach(p => p.tick());
	}, 1000/fps);
}