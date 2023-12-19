/* global createSvgElement, random, range */

/** J/K; exact; https://en.wikipedia.org/wiki/Boltzmann_constant */
const boltzmann = 1.380649e-23;
/** W; exact; zero point luminosity */
const L_0 = 3.0128e28;
/** J*s; exact; https://en.wikipedia.org/wiki/Planck_constant */
const planck = 6.62607015e-34;
/** m/s; exact; https://en.wikipedia.org/wiki/Speed_of_light */
const speedOfLight = 299792458;

const RANDSKY = {
	ELEM: {
		get SKYMAP(){
			return document.getElementById('skymap');
		},
	},
	/** side length of the rng cube in pc */
	get SIZE(){
		return Math.cbrt(this.STAR_TARGET/this.STELLAR_DENSITY)/2;
	},
	/** stars */
	STAR_TARGET: 1000000,
	/** stars per pc^3 https://en.wikipedia.org/wiki/Stellar_density */
	STELLAR_DENSITY: 0.14,
	SUN: {
		/** W */
		LUM: 3.828e26,
		/** K */
		TEMP: 5772,
	},
	// fx
	debug(){
		const cluster = Cluster.random();
		console.debug(cluster);
		console.debug(cluster.stars[0]);
	},
};

// https://en.wikipedia.org/wiki/Planck's_law
function planckLaw(freq, temp){
	const c = speedOfLight;
	const h = planck;
	const k = boltzmann;
	return 2*h*Math.pow(freq, 3)/Math.pow(c, 2) / (Math.exp(h*freq/(k*temp))-1);
}

class Coords {
	constructor(x = 0, y = 0, z = 0){
		/** @type {number} */
		this.x = x;
		/** @type {number} */
		this.y = y;
		/** @type {number} */
		this.z = z;
	}
	get el(){
		return Math.PI/2 - this.theta;
	}
	get phi(){
		return Math.atan2(this.y, this.x);
	}
	get r(){
		return Math.hypot(this.x, this.y, this.z);
	}
	get theta(){
		return Math.acos(this.z / this.r);
	}
}

class Cluster {
	constructor(stars = []){
		/** @type {Star[]} */
		this.stars = stars;
	}
	printDistr(){
		const data = {o: 0, b: 0, a: 0, f: 0, g: 0, k: 0, m: 0};
		this.stars.forEach(star => {
			if (star.mass < 0.45)
				data.m++;
			else if (star.mass < 0.8)
				data.k++;
			else if (star.mass < 1.04)
				data.g++;
			else if (star.mass < 1.4)
				data.f++;
			else if (star.mass < 2.1)
				data.a++;
			else if (star.mass < 16)
				data.b++;
			else
				data.o++;
		});
		console.debug(data);
	}
	static random(){
		return new Cluster(range(RANDSKY.STAR_TARGET).map(Star.random));
	}
}

class Star {
	constructor(coords, mass = 1){
		/** @type {Coords} */
		this.coords = coords;
		/** @type {number} */
		this.mass = mass;
	}
	get absMag(){
		return -2.5 * Math.log10(this.luminosity / L_0);
	}
	get appMag(){
		return this.absMag + 5*(Math.log10(this.coords.r) - 1);
	}
	get color(){
		const t = this.temp;
		const rAbs = planckLaw(speedOfLight/680e-9, t);
		const gAbs = planckLaw(speedOfLight/530e-9, t);
		const bAbs = planckLaw(speedOfLight/470e-9, t);
		const max = Math.max(rAbs, gAbs, bAbs)/255;
		// [800, 3500] => [black, red]
		let value = 1;
		if (t < 3500)
			value = Math.max(0.1, (t - 800)/2700);
		const r = Math.round(rAbs/max*value);
		const g = Math.round(gAbs/max*value);
		const b = Math.round(bAbs/max*value);
		return `rgb(${r}, ${g}, ${b})`;
	}
	get luminosity(){
		return RANDSKY.SUN.LUM * (0.45 < this.mass
			? 1.148*Math.pow(this.mass, 3.4751)
			: 0.2264*Math.pow(this.mass, 2.52));
	}
	get radius(){
		return Math.pow(this.mass, 0.96);
	}
	get temp(){
		return RANDSKY.SUN.TEMP * Math.pow(this.mass, 0.54);
	}
	static random(){
		return new Star(Star.randomCoords(), Star.randomMass());
	}
	static randomCoords(){
		return new Coords(...range(3).map(() => random.uniform(-RANDSKY.SIZE, RANDSKY.SIZE)));
	}
	static randomMass(){
		const M_MIN = 0.08; // min M
		const M_MAX = 16; // O-B cutoff
		const e = 1.9; // tweak as necessary
		const max = Math.pow(M_MIN, -1/e);
		const min = Math.pow(M_MAX, -1/e);
		const m = Math.pow(random.uniform(min, max), -e);
		return 2.1 < m && random.random() < 0.93 ? this.randomMass()
			: 1.25 < m && random.random() < 0.87 ? this.randomMass() : m;
	}
}

function mag2radius(mag = 0){
	return Math.sqrt(Math.pow(100, -mag/5));
}

function main(){
	const starSize = 0.02;
	// svg
	const svg = createSvgElement('svg');
	svg.classList.add('sundial');
	svg.setAttribute('viewBox', [-Math.PI, -Math.PI/2,
		2*Math.PI, Math.PI].join(' '));
	svg.setAttribute('width', 1024);
	svg.setAttribute('height', 512);
	svg.setAttribute('aria-label', 'SkyMap');
	svg.style.border = '1px solid white';
	svg.style.height = '49vw';
	svg.style.width = '98vw';
	RANDSKY.ELEM.SKYMAP.innerHTML = '';
	RANDSKY.ELEM.SKYMAP.appendChild(svg);
	// background
	const bg = createSvgElement('rect');
	svg.appendChild(bg);
	bg.setAttribute('x', -Math.PI);
	bg.setAttribute('y', -Math.PI/2);
	bg.setAttribute('width', 2*Math.PI);
	bg.setAttribute('height', Math.PI);
	bg.style.fill = 'black';
	// main
	const cluster = Cluster.random();
	// console.debug(cluster);
	// cluster.printDistr();
	let printed = 0;
	cluster.stars.forEach((star, i) => {
		const mag = star.appMag;
		if (7 < mag)
			return;
		const [ra, dec] = [star.coords.phi, star.coords.el];
		const [x, y] = [ra, -dec];
		// elem
		const starDisk = createSvgElement('circle');
		svg.appendChild(starDisk);
		starDisk.setAttribute('r', starSize * mag2radius(mag));
		starDisk.style.fill = star.color;
		starDisk.setAttribute('cx', x);
		starDisk.setAttribute('cy', y);
		starDisk.id = 'star_' + i;
		printed++;
	});
	console.debug(printed);
}

main();