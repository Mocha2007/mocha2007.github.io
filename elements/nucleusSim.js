const timestep = 1e-4; // elapsed seconds per tick
const width_abs = 1e-9; // 1 nanometer
const fps = 30;
const FORCE_CUTOFF_RATIO = 0; // prevent yeeting
const DESIRED_E_DIST = 100e-12;
const DESIRED_2_DIST = 5e-12;
const FORCE_E_STRENGTH = 1e-32; // electromagnetic force analogue
const FORCE_2_STRENGTH = 1e-28; // nuclear force analogue
const MEDIUM_DECEL_CONST = -1e11;
const MAX_V = 3.5e-8; // any slower and electrons get trapped

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
	static neutron = new Particle(1, 0, true, 'grey', 5);
	static electron = new Particle(1e-3, -1, false, '#8ff', 1);
}

class ParticleInstance {
	constructor(particle){
		/** @type {Particle} */
		this.particle = particle;
		this.coords = randomCoords();
		this.v = [random.uniform(-1, 1), random.uniform(-1, 1)].map(x => 1e-9*x);
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
			ParticleInstance.particles.filter(p => this !== p && p.particle.charge).forEach(p => {
				let d2 = this.distSquared(p);
				if (d2 < Math.pow(DESIRED_E_DIST * FORCE_CUTOFF_RATIO, 2))
					d2 = Math.pow(DESIRED_E_DIST * FORCE_CUTOFF_RATIO, 2); // don't break pls
				const acc = FORCE_E_STRENGTH * this.particle.charge * p.particle.charge
					* stayCloseishForce(d2, DESIRED_E_DIST)
					/ this.particle.mass * timestep;
				const dx = [p.coords[1] - this.coords[1], p.coords[0] - this.coords[0]];
				const accVector = splitForceXY(acc, Math.atan2(...dx));
				this.future_v = this.future_v.map((x, i) => x + accVector[i]);
			});
		// (2) the "stay kinda close but not too close" force
		if (this.particle.nucleon)
			ParticleInstance.particles.filter(p => this !== p && p.particle.nucleon).forEach(p => {
				let d2 = this.distSquared(p);
				if (d2 < Math.pow(DESIRED_2_DIST * FORCE_CUTOFF_RATIO, 2))
					d2 = Math.pow(DESIRED_2_DIST * FORCE_CUTOFF_RATIO, 2); // don't break pls
				const acc = FORCE_2_STRENGTH
					* stayCloseishForce(d2, DESIRED_2_DIST)
					/ this.particle.mass * timestep;
				const dx = [p.coords[1] - this.coords[1], p.coords[0] - this.coords[0]];
				const accVector = splitForceXY(acc, Math.atan2(...dx));
				this.future_v = this.future_v.map((x, i) => x + accVector[i]);
			});
		// (3) "YOU'RE GOING TOO FAST" universal force
		this.future_v = this.future_v.map(x => x + Math.sign(x)*MEDIUM_DECEL_CONST*timestep*x**2);
		// make sure v < c
		this.future_v = this.future_v.map(x => clamp(x, -MAX_V, MAX_V));
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

/** Attractive force beyond r; repulsive force within r 
 * the maximum of this function is (sqrt(2)r, 1/(4r^2)) and the root is (r, 0)
*/
function stayCloseishForce(dist, r){
	return -Math.pow(r/dist, 2) + 1/dist;
}

function randomCoords(){
	return [random.uniform(0, width_abs), random.uniform(0, width_abs) * window.outerHeight / window.outerWidth];
}

function splitForceXY(force, angle){
	return [force*Math.cos(angle), force*Math.sin(angle)];
}

function init(){
	console.info("Atom Bullshit");
	// Zn-64
	range(34).forEach(_ => new ParticleInstance(Particle.neutron));
	range(30).forEach(_ => {
		new ParticleInstance(Particle.proton);
		new ParticleInstance(Particle.electron);
	});
	// sim
	setInterval(() => {
		ParticleInstance.particles.forEach(p => p.pre_tick());
		ParticleInstance.particles.forEach(p => p.tick());
	}, 1000/fps);
}