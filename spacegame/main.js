/* jshint esversion: 6, strict: true, forin: false, loopfunc: true, strict: global */
/* exported downloadSave, Game, updatePersonSearch, wipeMap */
/* globals createSvgElement, deg, download, linspace, mod, pi, proper, range, remap, round, sum */
'use strict';

// begin constants block
const minute = 60;
const hour = 60*minute;
const day = 24*hour;
const year = 365.2425 * day;
const universeAge = 13.799e9 * year;

const atm = 101325; // Pa; exact; https://en.wikipedia.org/wiki/Standard_atmosphere_(unit)
const au = 149597870700; // m; exact
const boltzmann = 1.380649e-23; // J/K; exact; https://en.wikipedia.org/wiki/Boltzmann_constant
const gravConstant = 6.674e-11;
const L_0 = 3.0128e28; // W; exact; zero point luminosity
const planck = 6.62607015e-34; // J*s; exact; https://en.wikipedia.org/wiki/Planck_constant
const speedOfLight = 299792458; // m/s; exact; https://en.wikipedia.org/wiki/Speed_of_light

const colorL = {
	ultraviolet: {
		min: 10e-9,
		max: 400e-9, // x40
	},
	visible: {
		min: 400e-9,
		b: 470e-9,
		g: 530e-9,
		r: 680e-9,
		max: 700e-9, // x1.75
	},
	ira: {
		min: 700e-9,
		max: 1.4e-6, // x2
	},
	irb: {
		min: 1.4e-6,
		max: 3e-6, // x2.14
	},
	irc: {
		min: 3e-6,
		max: 15e-6, // x5
	},
	fir: {
		min: 15e-6,
		max: 1e-3, // x67
	},
	microwave: {
		min: 1e-3,
		max: 1, // x1,000
	},
	make(spectrum){
		'rgb'.split('').forEach(color => colorL[spectrum][color] = remap(
			colorL.visible[color], // map this color
			[colorL.visible.min, colorL.visible.max], // from this range
			[colorL[spectrum].min, colorL[spectrum].max] // to this range
		));
	},
};
colorL.make('ultraviolet');
colorL.make('ira');
colorL.make('irb');
colorL.make('irc');
colorL.make('fir');
colorL.make('microwave');
// end constants block
// begin chem block
class Chem {
	/**
	 * @param {string} name
	 * @param {number} molarMass kg/mol, not g/mol
	 * @param {number} melt at 1 atm
	 * @param {number} boil at 1 atm
	 * @param {[number, number]} triple [t, p]
	 * @param {[number, number]} critical [t, p]
	 */
	constructor(name, molarMass, melt, boil, triple, critical){
		this.name = name;
		this.molarMass = molarMass;
		this.melt = melt;
		this.boil = boil;
		this.triple = triple;
		this.critical = critical;
	}
	phase(temp = water.melt, pressure = atm){
		// if triple or critical absent, assume 1 atm
		if (!this.triple || !this.critical){
			return temp < this.melt ? 'solid' : temp < this.boil ? 'liquid' : 'gas';
		}
		if (temp < this.triple[0]){
			return 'solid';
		}
		// for the purposes of the game, a supercritical fluid is the same as a gas
		if (this.critical[0] < temp){
			return 'gas';
		}
		// the problem we are faced with now is we have to appx. a curve on a log-linear plot
		// our hacky solution is to split the curve into two lines of form y = b*exp(ax)
		const [x2, y2] = [this.boil, atm];
		/** @type {(t: number) => number} */
		let f;
		// left line
		if (temp < this.boil){
			const [x1, y1] = this.triple;
			const a1 = Math.log(y1 * y2)/(x1 + x2);
			const b1 = Math.exp(a1 * x1)/y1;
			f = t => b1*Math.exp(a1*t);
		}
		// right line
		else {
			const [x3, y3] = this.critical;
			const a2 = Math.log(y2 * y3)/(x2 + x3);
			const b2 = Math.exp(a2 * x2)/y2;
			f = t => b2*Math.exp(a2*t);
		}
		return f(temp) < pressure ? 'liquid' : 'gas';
	}
	/** @param {Body} planet */
	phaseOn(planet){
		return this.phase(planet.temperature, planet.atmosphere.surfacePressure);
	}
}
// person block

class HasInfo {
	constructor(){}
	get info(){
		const table = document.createElement('table');
		for (const i in visibleProperties){
			const property = visibleProperties[i];
			if (this[property] === undefined){
				continue;
			}
			let value = this[property];
			const row = document.createElement('tr');
			let cell = document.createElement('th');
			cell.innerHTML = property;
			row.appendChild(cell);
			cell = document.createElement('td');
			if (property === 'parent'){
				cell.innerHTML = this.parent.name;
			}
			else if (property === 'orbit'){
				cell.appendChild(this.orbit.info);
			}
			else if (specialUnits.hasOwnProperty(property)){
				if (specialUnits[property].hasOwnProperty('f')){
					value = specialUnits[property].f(value);
					cell.innerHTML = value;
				}
				else {
					cell.innerHTML = round(value/specialUnits[property].constant, 2) + ' ' +
						specialUnits[property].name;
				}
			}
			else {
				cell.innerHTML = typeof value === 'number' ? round(value, 2) : value;
			}
			row.appendChild(cell);
			table.appendChild(row);
		}
		return table;
	}
}

// todo toJSON and fromJSON static methods for all these classes for savegames...
// eslint-disable-next-line no-unused-vars
class Person extends HasInfo {
	/**
	 * @param {Name} name
	 * In the future, this will be an object containing the following properties:
	 * - given name(s)
	 * - family name(s)
	 * - patrynomics/matrynomics
	 * - name ordering
	 * - nicknames
	 * - translations
	 * @param {Vital[]} vital birth/death/marriage data.
	 * In the future, this will be a SET of VITAL objects.
	 * These objects will contain a TYPE, DATE, and RELEVANT PARTIES.
	 * an example would be BIRTH / 1 Jan 2020 / JOHN DOE + JANE DOE
	 * this will allow distinguishing between biological and adoptive parents
	 * it will additionally allow simple computation of complex family structures without the need for another Person property
	 * @param {Personality} personality
	 * In the future, this will determine the character's interaction with you and others, including
	 * - willingness to support a coup
	 * - happiness with appointments, gifts, and property
	 * - decisions they cause
	 * @param {Physicality} physicality
	 * In the future, this will determine the character's physical attributes and biology
	 * - traits, incl.:
	 *   - strength, and hair / eye / body color
	 *   - sex (cf. gender in personality) => false = female, true = male
	 *   - anything which can be randomly inherited from the mother or father
	 *   - in the future these may belong to their own Gene class
	 * - statuses, incl.:
	 *   - pregnancy
	 *   - other diseases
	 */
	constructor(name = new Name(), vital = [],
		personality = new Personality(), physicality = new Physicality()){
		super();
		this.id = Game.rng.i;
		this.name = name;
		this.vital = vital;
		this.personality = personality;
		this.physicality = physicality;
		Game.people.push(this);
		Game.queue.add([Game.time, () => this.checkLife(), 'checkLife', this, Game.time]);
	}
	/** current age or age at death */
	get age(){
		const start = this.dead ? this.vital.filter(v => v.type === 'death')[0].date : Game.time;
		return start - this.vital.filter(v => v.type === 'birth')[0].date;
	}
	/** from closest to furthest */
	get ancestors(){
		let a = this.parents;
		a.forEach(p => a = a.concat(p.ancestors));
		return a;
	}
	get children(){
		return Game.people.filter(p => p.parents.includes(this));
	}
	get dead(){
		return Boolean(this.vital.filter(v => v.type === 'death').length);
	}
	get father(){
		const ps = this.parents;
		if (ps.length){
			return ps.filter(p => p.physicality.sex)[0];
		}
		return undefined;
	}
	get getCheckLife(){
		return Game.queue.queue.filter(e => e[2] === 'checkLife' && e[3] === this)[0];
	}
	get JSON(){
		return JSON.stringify({id: this.id, vital: this.vital.map(v => v.JSON)});
	}
	get mother(){
		const ps = this.parents;
		if (ps.length){
			return ps.filter(p => !p.physicality.sex)[0];
		}
		return undefined;
	}
	/** preferably father first, but not a hard-and-fast rule */
	get parents(){
		const birthEvent = this.vital.filter(v => v.type === 'birth');
		return birthEvent.length ? birthEvent[0].parties : [];
	}
	/** full siblings */
	get siblings(){
		const f = this.father;
		return f ? f.children.filter(p => p.mother === this.mother && p !== this) : [];
	}
	get sex(){
		return this.physicality.sex;
	}
	// methods
	ahnentafel(n = 1){
		/** @type {[number, string][]} */
		let a = [[n, this.name.toString()]];
		this.parents.map(p => p.ahnentafel(2*n + (p.sex ? 0 : 1))).forEach(p => a = a.concat(p));
		if (n !== 1){
			return a;
		}
		// else return string
		a.sort((x, y) => x[0] - y[0]); // sort in place
		return a.map(e => e[0] + '. ' + e[1]).join('\n');
	}
	/** produce child */
	bear(){
		this.physicality.pregnant = false;
		const child = new Person();
		// physicality random mix of parents' traits
		const father = this.physicality.father; // bio father
		child.physicality.traits = this.physicality.traits.map((trait, i) =>
			Game.rng.bool() ? father.physicality.traits[i] : trait);
		// birth info
		const birth = new Vital('birth', Game.time, [father, this]);
		child.vital.push(birth);
		// name
		child.name = Name.gen(child);
		child.name.family = father.name.family;
	}
	/** @return {boolean} true if alive, false if dead */
	checkLife(){
		/** @type {[number, () => boolean, string, Person, number]} */
		const event = this.getCheckLife;
		const timeSinceLastCheck = Game.time - event[4];
		// reset timer
		event[4] = Game.time;
		const yslc = timeSinceLastCheck/year;
		// once every 10 years or so, if male, bone a random female
		if (this.physicality.sex && Game.rng.random() < Math.pow(0.5, yslc/10)){
			try {
				Game.rng.choice(Person.allInSex()).impregnate(this);
			}
			catch (e){
				// unknown what causes the occasional TypeError but it doesn't seem to affect anything
			}
		}
		// 99% survival per year
		return Game.rng.random() < Math.pow(0.99, yslc) ? true : this.die();
	}
	/** @return {false} */
	die(){
		this.vital.push(new Vital('death', Game.time, []));
		return false;
	}
	/** @param {Person} father */
	impregnate(father){
		this.physicality.father = father;
		this.physicality.pregnant = true;
		this.physicality.impregnationTime = Game.time;
		this.physicality.dueDate = Game.time + Physicality.pregnancyTime();
		// add event to queue
		Game.queue.add([this.physicality.dueDate, () => this.bear()]);
	}
	/** most recent common ancestor; returns undefined if none exist
	 * @param {Person} other
	*/
	mrca(other){
		if (this === other){
			return this;
		}
		const b = other.ancestors;
		if (b.includes(this)){
			return this;
		}
		const a = this.ancestors;
		if (a.includes(other)){
			return other;
		}
		for (let i = 0; i < a.length; i++){
			if (b.includes(a[i])){
				return a[i];
			}
		}
	}
	// static methods
	static allInSex(sex = false){
		return Game.people.filter(p => p.physicality.sex === sex);
	}
	/** @param {string} json */
	static fromJSON(json){
		const j = JSON.parse(json);
		Game.rng.i = j.id;
		const p = Person.gen();
		p.vital = j.vital.map(v => Vital.fromJSON(v));
		return p;
	}
	static gen(){
		const p = new Person();
		p.vital = Vital.gen();
		p.personality = Personality.gen();
		p.physicality = Physicality.gen();
		p.name = Name.gen(p);
		return p;
	}
	/** @param {number} id */
	static getPersonById(id){
		return Game.people.filter(p => p.id === id)[0];
	}
	static test(){
		// gregnancy test
		Person.gen().physicality.traits[0][1] = false;
		Person.gen().physicality.traits[0][1] = true;
		Game.people[0].impregnate(Game.people[1]);
		Game.time = Game.people[0].physicality.dueDate;
	}
}

class Vital {
	/**
	 * @param {string} type
	 * @param {number} date
	 * @param {Person[]} parties
	 * example:
	 * new Vital('birth', year*20, [johnDoe, janeDoe]);
	 */
	constructor(type, date, parties = []){
		this.type = type;
		this.date = date;
		this.parties = parties;
	}
	get JSON(){
		return JSON.stringify({
			type: this.type,
			date: this.date,
			parties: this.parties.map(p => p.id),
		});
	}
	// static methods
	/** @param {string} json */
	static fromJSON(json){
		const j = JSON.parse(json);
		return new Vital(j.type, j.date, j.parties.map(p => Person.getPersonById(p)));
	}
	static gen(){
		/** @type {Vital[]} */
		const v = [];
		// born [20, 50] years ago
		const birthDate = Game.rng.uniform(Game.time - 50*year, Game.time - 20*year);
		v.push(new Vital('birth', birthDate));
		return v;
	}
}

class Personality {
	constructor(){
		// todo
		this.likes = [];
		this.dislikes = [];
	}
	// static methods
	static gen(){
		return new Personality();
	}
}

class Physicality {
	constructor(){
		/** @type {[string, any][]} */
		this.traits = [];
		/** @type {Person} */
		this.father;
		this.pregnant = false;
		/** @type {number} */
		this.impregnationTime;
		/** @type {number} */
		this.dueDate;
	}
	/** @type {boolean} */
	get sex(){
		const s = this.traits.filter(t => t[0] === 'sex');
		return s.length ? s[0][1] : undefined;
	}
	// static methods
	static gen(){
		const p = new Physicality();
		// sex
		p.traits.push(['sex', Game.rng.bool()]);
		return p;
	}
	static pregnancyTime(){
		// https://en.wikipedia.org/wiki/Estimated_date_of_delivery
		return Game.rng.uniform(37*7*day, 42*7*day);
	}
}

class Name {
	constructor(given = '', family = ''){
		this.given = given;
		this.family = family;
		this.style = 'western'; // JOHN SMITH; cf. eastern => SMITH JOHN
	}
	// static methods
	static get family(){
		return ['Brown', 'Clark', 'Davis', 'Johnson', 'Jones', 'Miller', 'Smith', 'Williams'];
	}
	static get female(){
		return ['Alice', 'Jane', 'Mary'];
	}
	static get male(){
		return ['Bob', 'Chris', 'Joe', 'John', 'Mike'];
	}
	// methods
	toString(){
		return this.given + ' ' + this.family;
	}
	// static methods
	// todo /** @type {string} gender */
	/** @param {Person} person */
	static gen(person){
		const sex = person.physicality.sex; // todo change to gender
		return new Name(
			Game.rng.choice(sex ? Name.male : Name.female),
			Game.rng.choice(Name.family)
		);
	}
}

// end person block
const water = new Chem('H2O', 0.01801528, 373.13, 373.13, [273.16, 611.657], [647, 22.064e6]);
// end chem block
// begin astro block

// infobox crap
const visibleProperties = [
	'name',
	'classification',
	'esi',
	'mass',
	'radius',
	'density',
	'surfaceGravity',
	'temperature',
	'tempDelta',
	'greenhouse',
	'v_e',
	// orbit
	'orbit',
	'period',
	'sma',
	'ecc',
];
const specialUnits = {
	'density': {
		'constant': 1000,
		'name': 'g/cm&sup3;',
	},
	'mass': {
		'constant': 5.97237e24,
		'name': 'Earths',
	},
	'period': {
		f(t){ // Game not initialized yet
			return Game.timeFormat(t);
		},
	},
	'radius': {
		'constant': 1000,
		'name': 'km',
	},
	'sma': {
		'constant': au,
		'name': 'au',
	},
	'surfaceGravity': {
		'constant': 9.7,
		'name': 'g',
	},
	'temperature': {
		f(x){
			return round(x-273.15, 2)+'&deg;C'; // not actual melting point anymore
		},
	},
	'greenhouse': {
		'constant': 1,
		'name': '&deg;C',
	},
	'v_e': {
		'constant': 1000,
		'name': 'km/s',
	},
};

class Body extends HasInfo {
	/**
	 * @param {number} mass
	 * @param {number} radius
	 * @param {number} albedo
	 * @param {Orbit} orbit
	 * @param {string} name
	 * @param {Atmosphere} atmosphere
	 */
	constructor(mass, radius, albedo, orbit, name, atmosphere){
		super();
		this.mass = mass;
		this.radius = radius;
		this.albedo = albedo;
		this.orbit = orbit;
		this.name = name;
		this.atmosphere = atmosphere;
		this.destroyed = false;
	}
	/**
	 * smallest molecular mass in kg/mol retained by the atm
	 * based on my python algorithm mochalib/mochaastro2.py : Body.atm_retention
	 * please see that implementation for sources and further details
	*/
	get atmRetention(){
		const c = 6; // to account for slow leakage
		return 887.364 * this.temp / Math.pow(this.v_e, 2) * c;
	}
	get classification(){
		if (2e26 < this.mass){
			return 'gasGiant';
		}
		if (6e25 < this.mass){
			return 'iceGiant';
		}
		if (1300 < this.temperature){
			// cf. https://en.wikipedia.org/wiki/CoRoT-7b
			return 'lava';
		}
		// rockies mars+ or just under
		if (5e23 < this.mass){
			switch (water.phaseOn(this)){
				case 'gas':
					return 'desert';
				case 'liquid':
					return 'terra';
				default: // solid
					return 'tundra';
			}
		}
		// rocks
		// 0 C
		if (water.phaseOn(this) === 'solid'){ // pluto-like
			return 'iceball';
		}
		return 'rock'; // mercury-like
	}
	get density(){
		return this.mass / this.volume;
	}
	get esi(){
		const r = this.radius;
		const rho = this.density;
		const T = this.temperature;
		const rE = earth.radius;
		const rhoE = earth.density;
		const TE = 287.16;
		const esi1 = 1-Math.abs((r-rE)/(r+rE));
		const esi2 = 1-Math.abs((rho-rhoE)/(rho+rhoE));
		const esi3 = 1-Math.abs((this.v_e-earth.v_e)/(this.v_e+earth.v_e));
		const esi4 = 1-Math.abs((T-TE)/(T+TE));
		return Math.pow(esi1, 0.57/4) * Math.pow(esi2, 1.07/4) *
			Math.pow(esi3, 0.7/4) * Math.pow(esi4, 5.58/4);
	}
	/** @return {HTMLDivElement} */
	get getElement(){
		return document.getElementById(this.name);
	}
	/** total temp increase from greenhouse effect */
	get greenhouse(){
		return this.temperature - this.temp;
	}
	get iconRadius(){
		const r = this.radius / Game.systemHeight * window.innerHeight;
		return Math.max(3, r); // min = 3px
	}
	get isPHW(){
		// https://mocha2007.github.io/worldbuilding_guide
		return earth.mass/37 < this.mass && this.mass < 10*earth.mass &&
			water.phaseOn(this) === 'liquid' && 0.73 < this.esi; // mars is 0.73
	}
	get mu(){
		return this.mass * gravConstant;
	}
	get surfaceGravity(){
		return this.mu/Math.pow(this.radius, 2);
	}
	get temp(){
		return this.tempAt(this.orbit.sma);
	}
	get temperature(){
		return this.temp * (this.mass < 10*earth.mass ? this.atmosphere.greenhouse : 1);
	}
	// methods
	draw(){
		let planetIcon = document.getElementById(this.name);
		// check destruction
		if (this.destroyed){
			// icon
			planetIcon.classList.value = 'destroyed';
			// orbit
			document.getElementById(this.orbit.orbitId).classList.value = 'destroyed';
			// orbit bar
			document.getElementById('orbitBar' + this.name).classList.value = 'destroyed';
			return;
		}
		// else continue
		if (planetIcon === null){
			planetIcon = createSvgElement('circle');
			planetIcon.id = planetIcon.title = this.name;
			Game.svg.bodies.appendChild(planetIcon);
		}
		planetIcon.classList.value = 'planet ' + this.classification;
		if (this.isPHW){
			planetIcon.classList.add('phw');
		}
		const planetCoords = this.orbit.coords;
		planetIcon.setAttribute('cx', planetCoords[0]);
		planetIcon.setAttribute('cy', planetCoords[1]);
		// planetIcon.setAttribute('fill', this.color);
		const index = Game.system.secondaries.indexOf(this);
		planetIcon.onclick = () => setBody(index);
		// check if selection...
		if (Game.planet.id === index){
			planetIcon.classList.add(selectionStyle[Game.settings.selectionStyle]);
		}
		// check if colony
		if (Game.player.colonyID === index){
			planetIcon.classList.add('colony');
		}
		// set radius
		planetIcon.setAttribute('r', this.iconRadius);
		// orbit bar
		/** @type {HTMLDivElement} */
		let orbitBarRect = document.getElementById('orbitBar' + this.name);
		if (!orbitBarRect){
			orbitBarRect = this.orbit.orbitBarRect;
			orbitBarRect.id = 'orbitBar' + this.name;
			orbitBarRect.onclick = () => setBody(index);
			orbitBarRect.title = this.name;
			Game.orbitBar.appendChild(orbitBarRect);
		}
		orbitBarRect.style['background-color'] = document.defaultView.getComputedStyle(planetIcon).fill;
	}
	/** @param {number} dist */
	tempAt(dist){
		return this.orbit.parent.temperature * Math.pow(1-this.albedo, 0.25) *
			Math.sqrt(this.orbit.parent.radius/2/dist);
	}
	get tempDelta(){
		const mean = this.temperature;
		const plus = round(this.tempAt(this.orbit.periapsis)/this.temp * mean - mean, 2);
		const minus = round(mean - this.tempAt(this.orbit.apoapsis)/this.temp * mean, 2);
		const elem = document.createElement('span');
		const plusElement = document.createElement('sup');
		plusElement.classList = 'supsub';
		plusElement.innerHTML = '+' + plus;
		elem.appendChild(plusElement);
		const minusElement = document.createElement('sub');
		minusElement.classList = 'supsub';
		minusElement.innerHTML = '-' + minus;
		elem.appendChild(minusElement);
		return elem.innerHTML;
	}
	get volume(){
		return 4/3 * pi * Math.pow(this.radius, 3);
	}
	// eslint-disable-next-line camelcase
	get v_e(){
		return Math.pow(2*this.mu/this.radius, 0.5);
	}
	// static methods
	/** @param {number} mass */
	static densityFromMass(mass){
		if (2e26 < mass){
			return Game.rng.uniform(600, 1400);
		}
		if (6e25 < mass){
			return Game.rng.uniform(1200, 1700);
		}
		return Game.rng.uniform(3900, 5600);
	}
	/**
	 * @param {number} sma
	 * @param {Star} star
	*/
	static gen(sma, star){
		/** @param {number} s */
		function generateBody(s){
			s /= au * Math.sqrt(star.mass/sun.mass); // scale based on ~temp
			let mass;
			if (0.8 < s && s < 1.5){
				mass = Math.pow(10, Game.rng.uniform(23.8, 25.2));
			}
			else if (5 < s && s < 31){
				mass = Math.pow(10, Game.rng.uniform(25.9, 28.3));
			}
			else {
				mass = 2*Math.pow(10, Game.rng.uniform(17, 27));
			}
			const density = Body.densityFromMass(mass);
			const radius = Math.pow(mass/(density*4/3*pi), 1/3);
			const albedo = Game.rng.uniform(0.1, 0.7);
			return new Body(mass, radius, albedo);
		}
		/** @param {number} s */
		function generateOrbit(s){
			// http://exoplanets.org/plots
			// https://www.desmos.com/calculator/ixd7gm2hpy
			const parent = star;
			const ecc = Game.rng.uniform(0, 0.21); // Math.pow(Game.rng.random(), 2.2)
			const inc = Game.rng.uniform(0, 0.13);
			const aop = Game.rng.uniform(0, 2*pi);
			const lan = Game.rng.uniform(0, 2*pi);
			const man = Game.rng.uniform(0, 2*pi);
			return new Orbit(parent, s, ecc, inc, aop, lan, man);
		}
		const planet = generateBody(sma);
		planet.orbit = generateOrbit(sma);
		planet.name = 'Sol-' + Game.rng.randint(100000, 999999);
		planet.atmosphere = Atmosphere.gen(planet);
		return planet;
	}
	static test(){
		return range(100).map(() => Body.gen(au, sun));
	}
}

class Atmosphere {
	/**
	 * @param {number} surfacePressure
	 * @param {number} scaleHeight
	 * @param {[Chem, number][]} composition
	 */
	constructor(surfacePressure, scaleHeight, composition){
		this.surfacePressure = surfacePressure;
		this.scaleHeight = scaleHeight;
		this.composition = composition;
	}
	// methods
	/** based on mochalib/mochaastro2.py : Atmosphere.greenhouse, in turn mostly based on Aurora alg */
	get greenhouse(){
		const ghp = this.greenhousePressure / atm;
		const atmPressure = this.surfacePressure / earth.atmosphere.surfacePressure;
		const correctionFactor = 1.319714531668124;
		const gheMax = 3.2141846382913877;
		return Math.min(gheMax, 1 + (atmPressure/10 + ghp) * correctionFactor);
	}
	// ditto
	get greenhousePressure(){
		const ghg = ['CH4', 'CO2']; // todo add water/H2O and fix orig python code
		const g = ghg.map(name => Game.getChem(name)).filter(c => this.composition.includes(c));
		return sum(g.map(c => this.partialPressure(c)));
	}
	// methods
	// ditto
	/** @param {Chem} chem */
	compositionOf(chem){
		const contents = this.composition.map(cn => cn[0]);
		return contents.includes(chem) ? this.composition.filter(cn => cn[0] === chem)[0][1] : 0;
	}
	/** @param {Chem} chem */
	partialPressure(chem){
		return this.surfacePressure * this.compositionOf(chem);
	}
	// static methods
	/** name, ln(min), ln(max) of X/H2 ratio
	 * @return {[string, number, number][]}
	*/
	static get chemRatios(){
		return [
			['H2', 0, 0],
			['He', -3.388813322, -1.437587656],
			['CH4', -5.888516578, -3.976561527],
			['NH3', -8.949494953, -8.138295111],
			['H2O', -10.48034615, -10.48034615], // only jupiter has data
			['C2H6', -13.1869019, -11.83189854],
			// based on X/H2O ratios
			['N2', -6.122612208, -5.315560176],
			['O2', -9.969520526, -7.438207504],
			['CO2', -13.67941935, -13.67941935], // ignoring 2 outliers
			// non-He noble gases
			['Ne', -16.78926493, -11.53016827],
			['Ar', -11.3013267, -5.959593306],
			['Kr', -19.59537634, -17.03142649],
			['Xe', -22.13253368, -18.13003877],
		];
	}
	/** @param {Body} planet */
	static gen(planet){ // todo
		return new Atmosphere(
			Atmosphere.genPressure(planet),
			Atmosphere.genScaleHeight(planet),
			Atmosphere.genComposition(planet)
		);
	}
	/**
	 * @param {Body} planet
	 * @return {[Chem, number][]}
	*/
	static genComposition(planet){
		/** @type {[Chem, number][]} */
		const localDust = this.chemRatios.map(c => [
			Game.chems[Game.chems.map(ch => ch.name).indexOf(c[0])], // Chem
			Math.exp(Game.rng.uniform(c[1], c[2])), // Ratio
		]);
		// chems planet can retain
		const validChems = Game.chems.filter(c => planet.atmRetention < c.molarMass);
		// collected ratios
		const collected = localDust.filter(cn => validChems.includes(cn[0]));
		const s = sum(collected.map(cn => cn[1]));
		// normalize
		return collected.map(cn => [cn[0], cn[1]/s]);
	}
	/** @param {Body} planet */
	static genPressure(planet){
		// https://docs.google.com/spreadsheets/d/1LPoczfWn3NOKlbP93gkvMylK_30I7Tg37-0UnAdHvAg
		const c = Math.pow(10, Game.rng.uniform(-1, 1));
		return c * 8.14e-43 * Math.pow(planet.mass, 1.94);
	}
	/** @param {Body} planet */
	static genScaleHeight(){ // todo
		return Game.rng.uniform(8.5e3, 60e3);
	}
}

class Orbit extends HasInfo {
	/**
	 * @param {Body} parent
	 * @param {number} sma
	 * @param {number} ecc
	 * @param {number} aop
	 * @param {number} man
	 */
	constructor(parent, sma, ecc, inc, aop, lan, man){
		super();
		this.parent = parent;
		this.sma = sma; // a
		this.ecc = ecc; // e
		this.inc = inc; // i
		this.aop = aop; // omega
		this.lan = lan; // Omega
		this.man = man; // M
		this.lastCenter = [0, 0];
		this.lastView = '+z';
		this.lastZoom = 0;
	}
	// functions
	get apoapsis(){
		return (1+this.ecc)*this.sma;
	}
	/** @param {number} t */
	cartesian(t){
		// 2
		const E = this.eccentricAnomaly(t);
		// 3
		const nu = this.trueAnomaly(t);
		// 4
		const [a, e] = [this.sma, this.ecc];
		const rC = a*(1-e*Math.cos(E));
		// 5
		// const mu = this.parent.mu;
		const o = [Math.cos(nu), Math.sin(nu), 0].map(z => rC*z);
		// const o_ = [-Math.sin(E), Math.sqrt(1-e*e)*Math.cos(E), 0].forEach(z => Math.sqrt(mu*a)/rC*z);
		// 6
		const i = this.inc;
		const [om, Om] = [this.aop, this.lan];
		const [c, C, s, S] = [Math.cos(om), Math.cos(Om), Math.sin(om), Math.sin(Om)];
		/** @return {[number, number, number]} */
		function r(x){
			return [
				x[0]*(c*C - s*Math.cos(i)*S) - x[1]*(s*C + c*Math.cos(i)*S),
				x[0]*(c*S + s*Math.cos(i)*C) + x[1]*(c*Math.cos(i)*C - s*S),
				x[0]*(s*Math.sin(i)) + x[1]*(c*Math.sin(i)),
			];
		}
		const [x, y, z] = r(o);
		switch (Game.view){
			case '+x':
				return [y, z, x];
			case '-x':
				return [-y, z, -x];
			case '+y':
				return [x, -z, y];
			case '-y':
				return [x, z, -y];
			case '-z':
				return [-x, y, -z];
			default: // +z
				return [x, y, z];
		}
	}
	get coords(){
		return this.coordsAt(Game.time);
	}
	/**
	 * @param {number} t
	 * @return {[number, number]}
	*/
	coordsAt(t){
		const absCoords = this.cartesian(t);
		const x = remap(absCoords[0],
			[-Game.systemWidth, Game.systemWidth], [0, window.innerWidth]);
		const y = remap(absCoords[1],
			[-Game.systemHeight, Game.systemHeight], [0, window.innerHeight]);
		return [x, y];
	}
	draw(){
		const resolution = 64; // lines to draw
		// if group doesn't exist, create it, and its children.
		if (!document.getElementById(this.orbitId)){
			// create element and its children
			const g = createSvgElement('g');
			g.id = this.orbitId;
			Game.svg.orbits.appendChild(g);
			for (let i = 0; i < resolution; i++){
				const line = createSvgElement('line');
				line.id = this.orbitId + '-' + i;
				line.setAttribute('style', 'stroke:red;stroke-width:1');
				g.appendChild(line);
			}
		}
		if (this.lastZoom !== Game.systemHeight ||
				this.lastCenter !== Game.center ||
				this.lastView !== Game.view){
			const step = this.period/resolution;
			// update children endpoints
			for (let i = 0; i < resolution; i++){
				const line = document.getElementById(this.orbitId + '-' + i);
				const [x1, y1] = this.coordsAt(i*step);
				const [x2, y2] = this.coordsAt((i+1)*step);
				line.setAttribute('x1', x1);
				line.setAttribute('y1', y1);
				line.setAttribute('x2', x2);
				line.setAttribute('y2', y2);
			}
			this.lastCenter = Game.center;
			this.lastView = Game.view;
			this.lastZoom = Game.systemHeight;
		}
	}
	/** @param {number} t */
	eccentricAnomaly(t){
		const tol = 1e-10;
		const M = mod(this.man + 2*pi*t/this.period, 2*pi);
		let E = M;
		let oldE = E + 2*tol;
		while (tol < Math.abs(E-oldE)){
			oldE = E;
			E = M + this.ecc*Math.sin(E);
		}
		return E;
	}
	get orbitBarRect(){
		const rect = document.createElement('div');
		const p = remap(this.periapsis, [0, Game.system.maxOrbitRadius], [0, Game.orbitbarWidth]);
		const width = Math.max(1, remap(this.apoapsis - this.periapsis, // minimum width: 1px
			[0, Game.system.maxOrbitRadius], [0, Game.orbitbarWidth]));
		rect.style.width = width + 'px';
		rect.style.left = p + 'px';
		return rect;
	}
	get orbitId(){
		return this.sma.toString();
	}
	get periapsis(){
		return (1-this.ecc)*this.sma;
	}
	get period(){
		return 2*pi*Math.pow(Math.pow(this.sma, 3)/this.parent.mu, 0.5);
	}
	/** @param {number} t */
	trueAnomaly(t){
		const E = this.eccentricAnomaly(t);
		const e = this.ecc;
		return 2 * Math.atan2(Math.pow(1+e, 0.5) * Math.sin(E/2),
			Math.pow(1-e, 0.5) * Math.cos(E/2));
	}
	// static methods
	/** @param {number} previousSMA */
	static nextSMA(previousSMA){
		return previousSMA * Game.rng.uniform(1.38, 2.01);
	}
}

class Star extends Body {
	/**
	 * @param {number} mass
	 * @param {number} radius (base radius, varies with age)
	 * @param {string} name
	 * @param {number} luminosity (base luminosity, varies with age)
	 * @param {number} temperature (base temperature, varies with age)
	 * @param {number} age
	 */
	constructor(mass, radius, name, luminosity, temperature, age){
		super(mass, radius, undefined, undefined, name);
		this.radius_ = radius;
		this.luminosity_ = luminosity;
		this.temperature_ = temperature;
		this.age_ = age;
	}
	get absMag(){
		return -2.5 * Math.log10(this.luminosity / L_0);
	}
	get age(){
		return this.age_ + Game.time;
	}
	get class(){
		return this.spectralType + this.luminosityClass;
	}
	get color(){
		const t = this.temperature;
		const rAbs = planckLaw(speedOfLight/colorL[Game.spectrum].r, t);
		const gAbs = planckLaw(speedOfLight/colorL[Game.spectrum].g, t);
		const bAbs = planckLaw(speedOfLight/colorL[Game.spectrum].b, t);
		const max = Math.max(rAbs, gAbs, bAbs)/255;
		// [800, 3500] => [black, red]
		let value = 1;
		if (Game.spectrum === 'visible' && t < 3500){
			value = Math.max(0.1, (t - 800)/2700);
		}
		const r = round(rAbs/max*value);
		const g = round(gAbs/max*value);
		const b = round(bAbs/max*value);
		return `rgb(${r}, ${g}, ${b})`;
	}
	/** get a <circle> of the star on the celestial sphere */
	get celestial(){
		const element = createSvgElement('circle');
		element.classList.add('backgroundStar');
		element.setAttribute('fill', this.color);
		return element;
	}
	draw(){
		// svg component
		let element = document.getElementById(this.id+'svg');
		let corona = document.getElementById(this.id+'coronasvg');
		if (!element){
			// create star
			element = createSvgElement('circle');
			element.id = this.id+'svg';
			element.classList.add('star');
			Game.svg.bodies.appendChild(element);
			// create corona
			corona = createSvgElement('circle');
			corona.id = this.id+'coronasvg';
			corona.classList.add('corona');
			Game.svg.bodies.appendChild(corona);
		}
		// update color and radius
		// min star radius = 0.5px
		const r = Math.max(0.5, this.radius/Game.systemHeight * window.innerHeight/2);
		element.setAttribute('r', r);
		corona.setAttribute('r', 2*r);
		range(4).forEach(i => document.getElementById('starColor'+(i+1)).setAttribute('stop-color', this.color));
	}
	get frostLine(){
		// https://en.wikipedia.org/wiki/Frost_line_(astrophysics)
		return this.tempRadius(143);
	}
	get habitableZoneCenter(){
		// cf. https://en.wikipedia.org/wiki/Circumstellar_habitable_zone#Extrasolar_extrapolation
		return this.tempRadius(220);
	}
	get id(){
		return this.name.toLowerCase();
	}
	get info(){
		return `${this.name}

Class: ${this.class}
Mass: ${round(this.mass/sun.mass, 2)} M_sun
Temperature: ${round(this.temperature).toLocaleString()} K
Abs Mag: ${round(this.absMag, 2)}
Age: ${round(this.age/(1e6*year)).toLocaleString()} Myr`;
	}
	/** @return lifespan in seconds */
	get lifespan(){
		return 3e17*Math.pow(this.mass/sun.mass, -2.5162);
	}
	get luminosity(){
		const f = this.lifespanFraction;
		let l = 1;
		if (f < 0.6){
			l = 0.693 * Math.exp(0.991*f);
		}
		else if (f < 0.9){
			l = 0.42 * Math.exp(1.78*f);
		}
		else if (f < 0.93){
			l = 1.01 * Math.exp(0.814*f);
		}
		else if (f < 0.97){
			l = 3.62e-9 * Math.exp(21.7*f);
		}
		else if (f < 1){
			l = 7.08e-39 * Math.exp(91.9*f);
		}
		else { // white dwarf
			const x = (this.age - this.lifespan)/(1e6*year); // time since death, Myr
			l = 4.9 * Math.pow(x, -1.32);
		}
		return this.luminosity_ * l;
	}
	get lifespanFraction(){
		return this.age / this.lifespan;
	}
	get luminosityClass(){
		if (1 < this.lifespanFraction){
			// https://en.wikipedia.org/wiki/White_dwarf
			return 'VII';
		}
		if (11777 / 12474 < this.lifespanFraction){ // appx.
			// https://en.wikipedia.org/wiki/Giant_star
			return 'III';
		}
		if (10521 / 12474 < this.lifespanFraction){ // appx.
			// https://en.wikipedia.org/wiki/Subgiant
			return 'IV';
		}
		return 'V';
	}
	get radius(){
		let c = 1;
		let w = 0;
		if (this.lifespanFraction < 0.6){
			c = 0.878*Math.exp(0.373*this.lifespanFraction);
		}
		else if (this.lifespanFraction < 0.9){ // accurate [0.6, 0.9]
			c = 0.547*Math.exp(1.13*this.lifespanFraction);
		}
		else if (this.lifespanFraction < 0.975){ // accurate [0.9, 0.975]
			c = 2.33e-04*Math.exp(9.79*this.lifespanFraction);
		}
		else if (this.lifespanFraction < 1){ // accurate [0.975, 1]
			c = 4.5e-70*Math.exp(165*this.lifespanFraction); // ideally this would max out at ~258
		}
		else { // white dwarf
			w = 0.0126; // asymptotic radius
			const x = (this.age - this.lifespan)/(1e6*year); // time since death, Myr
			c = 8.32e-3 * Math.pow(x, -0.297);
		}
		return this.radius_ * (c + w);
	}
	set radius(_){}
	get spectralType(){
		/** @type {[string, number][]} */
		const classes = [
			['O', 30000],
			['B', 10000],
			['A', 7500],
			['F', 6000],
			['G', 5200],
			['K', 3700],
			['M', 2400],
			['X', 0],
		];
		const i = classes.findIndex(x => x[1] < this.temperature);
		if (!i){
			return classes[0][0]+9;
		}
		const c2 = linspace(classes[i-1][1], classes[i][1], 10);
		const i2 = c2.findIndex(x => x < this.temperature);
		return classes[i][0]+(i2 === -1 ? 9 : i2);
	}
	get temperature(){
		let c = 1;
		if (this.lifespanFraction < 0.6){
			c = 0.979 * Math.exp(0.0543 * this.lifespanFraction);
		}
		else if (this.lifespanFraction < 0.9){
			c = 1.09 * Math.exp(-0.124 * this.lifespanFraction);
		}
		else if (this.lifespanFraction < 1){
			c = 7.89 * Math.exp(-2.34 * this.lifespanFraction);
		}
		else { // white dwarf
			const x = (this.age - this.lifespan)/(1e6*year); // time since death, Myr
			c = 10.7 * Math.pow(x, -0.302);
		}
		return this.temperature_ * c;
	}
	tempRadius(temperature = 255){
		return this.radius / 2 * Math.sqrt(1-earth.albedo) /
			Math.pow(temperature / this.temperature, 2);
	}
	// static methods
	/** @param {number} mass in suns */
	static ageGen(mass){
		const s = new Star(mass*sun.mass);
		return Game.rng.uniform(15.5e6*year, Math.min(universeAge, s.lifespan));
	}
	static debug(){
		setInterval(() => console.log(Game.system.primary.lifespanFraction), 1000);
		Game.speed = Game.system.primary.lifespan / 100;
	}
	/** @param {number} mass in suns */
	static gen(mass = this.massGen()){
		const luminosity = 0.45 < mass ? 1.148*Math.pow(mass, 3.4751) : 0.2264*Math.pow(mass, 2.52);
		return new Star(sun.mass*mass, sun.radius*Math.pow(mass, 0.96), 'Star',
			sun.luminosity_*luminosity, sun.temperature_*Math.pow(mass, 0.54), Star.ageGen(mass));
	}
	/** solar masses */
	static massGen(){
		return Math.exp(Game.rng.uniform(-1, 1)); // ~ [0.368, 2.718), expected value = 1
		// 2.718 has a lifespan of ~800 Myr
		// No longer true:
		// Generating a successful system below 0.43 M_sun is VERY rare... don't set the min below that!!!
		// The lower limit is b/w 0.39 and 0.4; upper b/w 50 and ???
	}
}

class System {
	/**
	 * @param {Body} primary
	 * @param {Body[]} secondaries
	 */
	constructor(primary = Star.gen(), secondaries = System.gen(primary)){
		this.primary = primary;
		this.secondaries = secondaries;
		this.celestialSphere = System.genCelestialSphere();
	}
	/** maximum apoapsis */
	get maxOrbitRadius(){
		return Math.max(...this.secondaries.map(p => p.orbit.apoapsis));
	}
	/** minimum periapsis */
	get minOrbitRadius(){
		return Math.min(...this.secondaries.map(p => p.orbit.periapsis));
	}
	// methods
	draw(){
		this.drawCelestialSphere();
		this.secondaries.map(p => p.draw());
		this.primary.draw();
		this.secondaries.map(p => p.orbit.draw());
	}
	drawCelestialSphere(){
		this.celestialSphere.forEach((snn, i) => {
			const id = 'celestial'+i;
			let elem = document.getElementById(id);
			if (!elem || Game.debug.lastCelestialUpdate + Game.debug.infoboxUpdateTime < Game.time){
				elem = snn[0].celestial;
				elem.id = 'celestial'+i;
				document.getElementById('celestialSphere').appendChild(elem);
			}
			// x, y
			const [x, y] = [snn[1]*window.innerWidth, snn[2]*window.innerHeight];
			elem.setAttribute('cx', x);
			elem.setAttribute('cy', y);
		});
	}
	// static methods
	/** @param {Star} star */
	static gen(star, attempt = 0){
		if (9 < attempt && attempt % 10 === 0){
			console.warn(attempt + ' failed attempts');
		}
		else if (100 < attempt){
			// too many failed attempts... something is broken :(
			return window.location.reload();
		}
		const numberOfPlanets = Game.rng.randint(6, 12); // max observed = 8 (Sol)
		// (scaled) HD 10180b = 0.0216; Mercury = 0.3871
		// cf. https://en.wikipedia.org/wiki/List_of_multiplanetary_systems
		const c = Game.rng.uniform(0.1, 0.4);
		const startSMA = c*au*Math.pow(star.mass/sun.mass, 2);
		const SMAList = [startSMA];
		for (let i=1; i<numberOfPlanets; i+=1){
			SMAList[i] = Orbit.nextSMA(SMAList[i-1]);
		}
		const systemAttempt = SMAList.map(a => Body.gen(a, star));
		if (systemAttempt.some(x => x.isPHW)){
			console.log('Generated system with PHW on attempt #' + (attempt+1));
			return systemAttempt;
		}
		return this.gen(star, attempt+1);
	}
	/** @return {[Star, number, number][]} */
	static genCelestialSphere(){
		const count = 0; // too laggy
		return linspace(0, 0, count).map(() => {
			// todo
			const star = Star.gen();
			const [x, y] = [
				Game.rng.random(),
				Game.rng.random(),
			];
			return [star, x, y];
		});
	}
}

const sun = new Star(1.9885e30, 6.957e8, 'Sun', 3.828e26, 5778, 4.543e9*year);
/** @type {Body} */
const earth = new Body(5.97237e24, 6371000, 0.306,
	new Orbit(sun, 1.49598023e11, 0.0167086, 0, 114.20783*deg, 0, 0.1249), 'Earth',
	new Atmosphere(101.325e3, 8500, [])
);

// https://en.wikipedia.org/wiki/Planck's_law
function planckLaw(freq, temp){
	const c = speedOfLight;
	const h = planck;
	const k = boltzmann;
	return 2*h*Math.pow(freq, 3)/Math.pow(c, 2) / (Math.exp(h*freq/(k*temp))-1);
}
// end astro block
// begin gameplay block

class GameEventOption {
	constructor(text = 'OK', onClick = () => undefined){
		this.text = text;
		this.onClick = onClick;
	}
}

class GameEvent {
	/**
	 * @param {string} eventTitle
	 * @param {string} desc
	 * @param {number} mtth
	 */
	constructor(eventTitle, desc, mtth, condition = () => true, options = [new GameEventOption()]){
		this.title = eventTitle;
		this.desc = desc;
		this.mtth = mtth;
		this.condition = condition;
		this.options = options;
	}
	get id(){
		return Game.events.indexOf(this);
	}
	draw(){
		const eventElement = document.createElement('div');
		// title
		const t = document.createElement('h2');
		t.innerHTML = this.title;
		eventElement.appendChild(t);
		// desc
		const desc = document.createElement('p');
		desc.innerHTML = this.desc;
		eventElement.appendChild(desc);
		// options
		const optionList = document.createElement('ul');
		this.options.forEach(e => {
			const option = document.createElement('li');
			const optionButton = document.createElement('input');
			optionButton.type = 'submit';
			optionButton.value = e.text;
			optionButton.onclick = () => {
				e.onClick();
				this.remove();
				const eventNode = document.getElementById('event'+this.id);
				eventNode.parentNode.removeChild(eventNode);
			};
			option.appendChild(optionButton);
			optionList.appendChild(option);
		});
		eventElement.appendChild(optionList);
		return eventElement;
	}
	remove(){
		Game.player.events = Game.player.events.filter(id => id !== this.id);
	}
}

class Order {
	/**
	 * @param {string} type
	 * @param {number} progressNeeded
	 * @param {Object<string, number>} cost
	 * @param {Object<string, number>} shipCost
	 * @param {Object<string, number>} consumption
	 */
	constructor(type, progressNeeded, cost, shipCost, consumption, onComplete = () => undefined){
		this.type = type;
		this.progressNeeded = progressNeeded;
		this.cost = cost;
		this.shipCost = shipCost;
		this.consumption = consumption;
		this.onComplete = onComplete;
	}
	get affordable(){
		// check resource costs
		for (const resource in this.cost){
			if (Game.player.resources[resource] < this.cost[resource]){
				return false;
			}
		}
		// check ship costs
		for (const shipClass in this.shipCost){
			if (!Game.player.navy.hasOwnProperty(shipClass) ||
				Game.player.navy[shipClass] < this.shipCost[shipClass]){
				return false;
			}
		}
		return true;
	}
	get consumptionAfforable(){
		for (const resource in this.consumption){
			if (Game.player.resources[resource] < this.consumption[resource]){
				return false;
			}
		}
		return true;
	}
	get id(){
		return Game.orders.indexOf(this);
	}
	static create(){
		const orderID = getOrderID();
		/** @type {Order} */
		const order = Game.orders[orderID];
		if (!order.affordable){
			return;
		}
		// else, pay cost
		for (const resource in order.cost){
			Game.player.resources[resource] -= order.cost[resource];
		}
		for (const shipClass in order.shipCost){
			Game.player.navy[shipClass] -= order.shipCost[shipClass];
		}
		Game.player.orders.push([Number(new Date()), orderID, Game.planet.id, 0]);
	}
	// CreatedOrder => Specific Order ID, Order Type ID, target, progress
	/** @param {number} specificId */
	static remove(specificId){
		Game.player.orders = Game.player.orders.filter(
			SpecificOrder => SpecificOrder[0] !== specificId);
	}
}

class Quest {
	/**
	 * @param {string} title
	 * @param {Array<() => boolean>} conditions required to display
	 * @param {Array<() => boolean>} requirements required to execute
	 * @param {Array<() => void>} results
	 */
	constructor(questTitle, desc = '', conditions = [], requirements = [], results = []){
		this.title = questTitle;
		this.desc = desc;
		this.conditions = conditions;
		this.requirements = requirements;
		this.results = results;
		this.complete = false;
	}
	draw(){
		const id = Game.quests.indexOf(this);
		if (document.getElementById('quest'+id)){
			// update
			if (this.complete && !this.elementUpdated){
				document.getElementById('quest'+id+'completion').classList = 'green';
				document.getElementById('quest'+id+'completion').innerHTML = 'complete';
				this.elementUpdated = true;
				this.results.map(x => x());
			}
		}
		else { // create
			const questElement = document.createElement('div');
			questElement.classList = 'quest';
			questElement.id = 'quest'+id;
			// title
			const questTitle = document.createElement('h2');
			questTitle.innerHTML = this.title;
			questElement.appendChild(questTitle);
			// desc
			const questDesc = document.createElement('div');
			questDesc.innerHTML = this.desc;
			questElement.appendChild(questDesc);
			// quest status
			const questStatus = document.createElement('span');
			questStatus.innerHTML = 'incomplete';
			questStatus.classList = 'red';
			questStatus.id = 'quest'+id+'completion';
			questElement.appendChild(questStatus);
			// append to main
			document.getElementById('quests').appendChild(questElement);
		}
	}
	updateCompletion(){
		if (this.complete){
			return;
		}
		if (this.conditions.every(x => x())){
			this.complete = true;
		}
	}
	// static methods
	static update(){
		const quests = Game.player.quests.map(x => Game.quests[x]);
		// display/update current quests
		quests.map(q => q.draw());
		// see if new quests apply
		for (let i=0; i<Game.quests.length; i+=1){
			const quest = Game.quests[i];
			if (Game.player.quests.indexOf(i) >= 0){
				continue;
			}
			let success = true;
			for (let j=0; j<quest.requirements.length; j++){
				if (!quest.requirements[j]()){
					success = false;
					break;
				}
			}
			if (success){
				Game.player.quests.push(i);
			}
		}
		quests.map(q => q.updateCompletion());
	}
}

/** @param {[number, number, number, number]} order */
function drawOrder(order){
	const orderElement = document.createElement('table');
	for (const property in order.concat(-1)){
		const name = 'id type target progress '.split(' ')[property];
		// create new row
		const row = document.createElement('tr');
		// create header col
		const col1 = document.createElement('th');
		col1.innerHTML = name;
		row.appendChild(col1);
		// create value col
		const col2 = document.createElement('td');
		if (name === 'progress'){
			// create progress element
			const progressBar = document.createElement('progress');
			progressBar.value = order[3] / Game.orders[order[1]].progressNeeded;
			col2.appendChild(progressBar);
			// annotation
			const progressSpan = document.createElement('span');
			progressSpan.innerHTML = order[3] + '/' + Game.orders[order[1]].progressNeeded;
			col2.appendChild(progressSpan);
		}
		else if (name === ''){
			col1.innerHTML = '';
			col2.innerHTML = '<input type="submit" value="Cancel" onclick="Order.remove('+order[0]+')">';
		}
		else {
			col2.innerHTML = order[property];
		}
		row.appendChild(col2);
		// append row
		orderElement.appendChild(row);
	}
	return orderElement;
}

// end gameplay block
// begin interface block
const asciiEmoji = {
	'star': ['*', '🔆'],
	'planet': ['&middot;', '🌑'],
	'water': ['water', '💧'],
	'fuel': ['fuel', '⛽'],
	'steel': ['steel', '🔩'],
};
const selectionStyle = ['selected', 'selectedOld'];

function createOrderTypeList(){
	const selector = document.getElementById('input_order_type');
	Game.orders.forEach((o, i) => {
		const option = document.createElement('option');
		option.value = i;
		option.innerHTML = o.type;
		selector.appendChild(option);
	});
}

/** general order type, not specific order */
function getOrderID(){
	return Number(document.getElementById('input_order_type').value);
}

/**
 * @param {string} shipClass
 * @param {number} count
*/
function modifyNavy(shipClass, count){
	if (!Game.player.navy.hasOwnProperty(shipClass)){
		Game.player.navy[shipClass] = count;
	}
	else {
		Game.player.navy[shipClass] += count;
	}
}

/** @param {string} id */
function selectTab(id){
	Array.from(document.getElementById('rightdocs').children).forEach(c => c.style.display = 'none');
	document.getElementById(id).style.display = '';
}

function wipeMap(){
	document.getElementById('map').innerHTML = '';
}

// end interface block
// begin main program
const Game = {
	/** @return {[number, number]} */
	get center(){
		return [window.innerWidth/2, window.innerHeight/2];
	},
	chems: [ // name mass melt boil triple crit
		new Chem('H2', 2*1.00784e-3, 13.99, 20.271, [13.8033, 7041], [32.938, 1.2858e6]),
		new Chem('He', 4.002602e-3, 0.95, 4.222, [2.177, 5043], [5.1953, 227460]),
		new Chem('N2', 2*14.00643e-3, 63.15, 77.355, [63.151, 12520], [126.21, 3.39e6]),
		new Chem('O2', 2*15.99903e-3, 54.36, 90.188, [54.361, 146.3], [154.581, 5.043e6]),
		// https://en.wikipedia.org/wiki/Methane_(data_page)
		new Chem('CH4', 16.043e-3, 90.7, 111.65, [90.67, 0.117*atm], [190.6, 46*atm]),
		new Chem('NH3', 17.031e-3, 195.42, 239.81, [195.4, 6060], [405.5, 111.3*atm]),
		water,
		new Chem('Ne', 20.1797e-3, 24.56, 27.104, [24.556, 43.37e3], [44.4918, 2.7686e6]),
		// https://en.wikipedia.org/wiki/Ethane_(data_page)
		new Chem('C2H6', 30.07e-3, 90.4, 184.6, [91, 1.1], [305.3, 4.9e6]),
		new Chem('Ar', 39.95e-3, 83.81, 87.302, [83.8058, 68.89e3], [150.687, 4.863e6]),
		new Chem('CO2', 44.009e-3, 216.6, 216.6, [216.5944, 5.1*atm], [304.2, 7.38e6]), // todo check if the trip being above atm breaks phase code
		new Chem('Kr', 83.798e-3, 115.78, 119.93, [115.775, 73.53e3], [209.48, 5.525e6]),
		new Chem('Xe', 131.293e-3, 161.4, 165.051, [161.405, 81.77e3], [289.733, 5.842e6]),
	],
	cookie: {
		// store cookie https://www.w3schools.com/js/js_cookies.asp
		/** @param {string} name */
		delete(name){
			document.cookie = [name, '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/; domain=.',
				window.location.host.toString()].join('');
		},
		/** https://stackoverflow.com/a/11344672/2579798
		 * @param {string} name
		*/
		read(name){
			let result = document.cookie.match(new RegExp(name + '=([^;]+)'));
			if (result){
				result = JSON.parse(result[1]);
			}
			return result;
		},
		/** https://stackoverflow.com/a/11344672/2579798
		 * @param {string} name
		*/
		write(name, value){
			const cookie = [name, '=', JSON.stringify(value), '; domain=.',
				window.location.host.toString(), '; path=/;'].join('');
			document.cookie = cookie;
		},
	},
	debug: {
		infoboxUpdateTime: 1e13,
		killStar(){
			Game.time = Game.system.primary.lifespan;
		},
		lastCelestialUpdate: -Infinity,
		lastInfoboxUpdate: -Infinity,
		lastOrbitBarUpdate: -Infinity,
		/** @type {Date} */
		lastSave: undefined,
	},
	events: [
		new GameEvent(
			'Comet Sighted',
			'A comet was sighted. Ouf. Prepare for revolts...?',
			year,
			undefined,
			[
				new GameEventOption('Neat.'),
				new GameEventOption('Meh.'),
			]
		),
	],
	/** @param {string} name */
	getChem(name){
		return this.chems.filter(c => c.name === name)[0];
	},
	keybinds: {
		// https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code
		Escape: () => selectTab('options'),
		l: () => Game.speed = 1,
		p: () => Game.pause,
		'=': () => Game.zoom(1/2), // unshifted +
		'+': () => Game.zoom(1/2),
		'-': () => Game.zoom(2),
		',': () => Game.speed /= 2,
		'.': () => Game.speed *= 2,
		'?': () => selectTab('about'),
		'0': () => Game.planet.id = 0,
		'1': () => Game.planet.id = 1,
		'2': () => Game.planet.id = 2,
		'3': () => Game.planet.id = 3,
		'4': () => Game.planet.id = 4,
		'5': () => Game.planet.id = 5,
		'6': () => Game.planet.id = 6,
		'7': () => Game.planet.id = 7,
		'8': () => Game.planet.id = 8,
		'9': () => Game.planet.id = 9,
	},
	get orbitbarWidth(){
		return window.innerWidth;
	},
	/** @return {HTMLDivElement} */
	get orbitBar(){
		return document.getElementById('orbitbar');
	},
	orbitBarScale(){
		if (Game.time < Game.debug.lastOrbitBarUpdate + Game.debug.infoboxUpdateTime){
			return;
		}
		Game.orbitBarUpper.innerHTML = '';
		/** in au */
		const systemRadius = this.system.maxOrbitRadius/au;
		/** px / au */
		const pxau = this.orbitbarWidth / systemRadius;
		// hab zone line
		const HLine = document.createElement('div');
		HLine.id = 'orbitBarHLine';
		// https://en.wikipedia.org/wiki/Circumstellar_habitable_zone#Solar_System_estimates
		/** @type {[number, number]} */
		const [min, max] = [294, 147].map(x => this.system.primary.tempRadius(x));
		HLine.style.left = min/au*pxau + 'px';
		HLine.style.width = (max - min)/au*pxau + 'px';
		HLine.title = 'Habitable zone';
		Game.orbitBarUpper.appendChild(HLine);
		// find min and max power of 2 to display
		let minPow2 = Math.floor(Math.log2(this.system.minOrbitRadius/au));
		const maxPow2 = Math.floor(Math.log2(systemRadius));
		minPow2 = Math.max(minPow2, maxPow2-4);
		linspace(minPow2, maxPow2+1, maxPow2-minPow2+1).map(round).forEach(p => {
			// numeric elements
			const dist = Math.pow(2, p);
			const distString = 1 <= dist ? dist : '1/'+round(1/dist);
			const elem = document.createElement('span');
			elem.classList.add('orbitBarScale');
			elem.style.left = dist*pxau + 'px';
			elem.innerHTML = distString;
			elem.title = distString + ' au';
			Game.orbitBarUpper.appendChild(elem);
		});
		// hab zone one
		const H = document.createElement('span');
		H.id = 'orbitBarH';
		H.style.left = this.system.primary.habitableZoneCenter/au*pxau + 'px';
		H.innerHTML = 'H';
		H.title = 'Habitable zone centerline';
		Game.orbitBarUpper.appendChild(H);
		// frost zone one
		const F = document.createElement('span');
		F.id = 'orbitBarF';
		F.style.left = this.system.primary.frostLine/au*pxau + 'px';
		F.innerHTML = 'F';
		F.title = 'Frost Line';
		Game.orbitBarUpper.appendChild(F);
		// update time
		Game.debug.lastOrbitBarUpdate = Game.time;
	},
	/** @return {HTMLDivElement} */
	get orbitBarUpper(){
		return document.getElementById('orbitbarUpper');
	},
	orders: [
		new Order(
			'Assay',
			50,
			{'fuel': 10},
			{'surveyor': 1},
			{'water': 1},
			() => {
				Game.player.resources.steel += 100;
			}
		),
		new Order(
			'Convert Water to Fuel',
			50,
			{},
			{'constructor': 1},
			{'fuel': -1, 'water': 1}
		),
		new Order(
			'Mine Ice',
			50,
			{'fuel': 10},
			{'constructor': 1},
			{'water': -1}
		),
	],
	pause(){
		this.paused = !this.paused;
	},
	paused: false,
	/** @type {Person[]} */
	people: [],
	planet: {
		get body(){
			return Game.system.secondaries[this.id];
		},
		get id(){
			return Number(document.getElementById('input_id').value);
		},
		/** @param {number} n */
		set id(n){
			if (this.idExists(n)){
				document.getElementById('input_id').value = n;
			}
		},
		/** @param {number} n */
		idExists(n){
			return n < Game.system.secondaries.length && !Game.system.secondaries[n].destroyed;
		},
	},
	player: {
		colonyID: -1,
		/** @type {number[]} */
		quests: [],
		/** @type {number[]} */
		events: [],
		resources: {
			water: 1000,
			fuel: 1000,
			steel: 1000,
		},
		navy: {
			surveyor: 1,
		},
		orders: [],
	},
	get playerHasColony(){
		return 0 <= this.player.colonyID;
	},
	/** population statistics */
	population: {
		/** specific people alive */
		get alive(){
			return Game.people.filter(p => !p.dead);
		},
		/** specific people dead */
		get dead(){
			return Game.people.filter(p => p.dead);
		},
		get meanAge(){
			const a = this.alive;
			return sum(a.map(p => p.age))/a.length;
		},
		get lifeExpectancy(){
			const a = this.dead;
			return sum(a.map(p => p.age))/a.length;
		},
		/** number alive */
		get n(){
			return this.alive.length;
		},
		/** males per female */
		get sexRatio(){
			const a = this.alive;
			const m = a.filter(p => p.sex).length;
			return m / (a.length - m);
		},
	},
	quests: [
		new Quest(
			'Select World',
			`Select a world to colonize. An ideal world is one with (in order of importance):<ol>
			<li>temperature around -18&deg;C</li><li>mass within a factor of two of Earth's</li>
			<li>near bodies which could be exploited in the future</li></ol><center class='red'>
			(WARNING: cannot be undone!)<br><input id='world_selector' type='submit'
			value='Confirm Selection' onclick='Game.player.colonyID=Game.planet.id;'>
			</center><br>Reward: 1 Constructor`,
			undefined, // Q0COND
			undefined,
			[
				() => {
					// remove button
					const node = document.getElementById('world_selector');
					node.parentNode.removeChild(node);
					// add constructor
					modifyNavy('constructor', 1);
				},
			]
		),
	],
	queue: {
		/** @param {[number, () => boolean]} event */
		add(event){
			this.addenda.push(event);
		},
		/** @type {[number, () => boolean][]} */
		addenda: [],
		/** events that will fire after the given date
		 * the boolean will determine whether the event remains in the queue
		 * indices >1 reserved for additional details.
		 * @type {[number, () => boolean][]}
		*/
		queue: [],
		/** @param {[number, () => boolean]} event */
		remove(event){
			this.queue.splice(this.queue.indexOf(event));
		},
		update(){
			// remove
			Game.queue.queue.filter(e => e[0] < Game.time ? !e[1]() : false).forEach(
				e => Game.queue.remove(e));
			// add
			Game.queue.addenda.forEach(e => Game.queue.queue.push(e));
			Game.queue.addenda = [];
		},
	},
	rng: {
		bool(){
			return this.random() < 0.5;
		},
		/** @param {string | any[] | Set} iterable*/
		choice(iterable){
			return Array.from(iterable)[this.randint(0, iterable.length-1)];
		},
		debug(){
			let x = Number(new Date());
			x ^= x << 13;
			x ^= x >> 17;
			x ^= x << 5;
			return x;
		},
		/** number of times random has been run */
		i: 0,
		init(){
			if (!Game.save.loaded){
				this.seed = Math.floor(Math.random()*this.max32Bit);
			}
			this.value = this.seed;
		},
		max31Bit: Math.pow(2, 31) - 1,
		max32Bit: Math.pow(2, 32) - 1,
		/**
		 * @param {number} min
		 * @param {number} max
		 */
		randint(min, max){ // random integer in range
			return Math.floor(this.uniform(min, max+1));
		},
		/** [0, 1) */
		random(){
			/* jshint bitwise: false */
			let x = this.value;
			x ^= x << 13;
			x ^= x >> 17;
			x ^= x << 5;
			this.value = x;
			this.i++;
			return (this.value+this.max31Bit)/this.max32Bit;
		},
		/** seed = R_0 */
		seed: Number(new Date()),
		/**
		 * @param {number} min
		 * @param {number} max
		 */
		uniform(min, max){ // random real in range
			return this.random() * (max-min) + min;
		},
		/** R_n = random(R_(n-1)) */
		value: 0,
	},
	save: {
		download(){
			download(this.export(), 'mochaSpaceGameSave.txt', 'text/plain');
		},
		export(){
			const data = btoa(JSON.stringify(this.json));
			document.getElementById('saveData').value = data;
			console.log('Exported Save.');
			return data;
		},
		import(){
			const saveData = document.getElementById('saveData').value;
			this.load(JSON.parse(atob(saveData)));
		},
		get json(){
			return {
				settings: Game.settings,
				seed: Game.rng.seed,
				player: Game.player,
				time: Game.time,
			};
		},
		load(saveFile){
			console.log('Attempting to load savefile...');
			// savefile exists?
			if (!saveFile){
				console.log('\t... none found.');
				return this.loaded = false;
			}
			// settings
			Game.settings = saveFile.settings;
			// rng
			Game.rng.seed = saveFile.seed;
			// player
			Game.player = saveFile.player;
			// time
			Game.time = saveFile.time;
			// finish
			console.log('\t... success.');
			return this.loaded = true;
		},
		loaded: false,
		reset(){
			Game.cookie.delete('spacegame');
			location.reload();
		},
		save(){
			Game.cookie.write('spacegame', this.json);
			Game.debug.lastSave = new Date();
		},
	},
	selectedPerson: 0,
	settings: {
		asciiEmoji: 0,
		/** in seconds */
		autosaveInterval: 30,
		/** in hz */
		fps: 20,
		selectionStyle: 0,
		/** in hours */
		userHealthWarningInterval: 2,
	},
	/** @return {string} */
	get spectrum(){
		return document.getElementById('spectrum').value;
	},
	speed: 16*hour,
	speedSetup(){
		// nearest power of 2 au to...
		const tgt = 1/4 * this.system.secondaries[0].orbit.period; // in s
		this.speed = Math.pow(2, round(Math.log2(tgt)));
	},
	svg: {
		bodies: document.getElementById('bodies'),
		orbits: document.getElementById('orbits'),
	},
	/** @type {System} */
	system: undefined,
	systemHeight: 3*au,
	systemHeightSetup(){
		// nearest power of 2 au to...
		const tgt = 10*this.system.secondaries[0].orbit.sma/au; // in au
		this.systemHeight = au*Math.pow(2, round(Math.log2(tgt)));
	},
	get systemWidth(){
		return window.innerWidth/window.innerHeight * this.systemHeight;
	},
	/** in seconds from epoch t=0 */
	time: 0,
	/** @param {number} s seconds */
	timeFormat(s){
		// yr mo d h min s
		/** @param {number} x */
		const pad = x => x < 10 ? '0'+x : x;
		const yr = Math.floor(s/year).toLocaleString();
		s %= year;
		const mo = pad(Math.floor(s/(30*day)));
		s %= 30*day;
		const d = pad(Math.floor(s/day));
		s %= day;
		const h = pad(Math.floor(s/hour));
		s %= hour;
		const min = pad(Math.floor(s/minute));
		s %= minute;
		s = pad(round(s));
		return `${yr} yr ${mo} mo ${d} d ${h}:${min}:${s}`;
	},
	/** @return {string} */
	get view(){
		return document.getElementById('view').value;
	},
	zoom(c = 1){
		this.systemHeight *= c;
	},
};
// Q0COND
Game.quests[0].conditions = [() => Game.playerHasColony];

function main(){
	console.info('%cMocha\'s Space Game Alpha',
		'background-color: black; border-radius: 20px; color: cyan; font-size: 4.5em; font-weight: bolder; padding: 0 10px 0 10px;');
	// load
	Game.save.load(Game.cookie.read('spacegame')); // sadly can't specify as default cause VSC bitches about it
	document.getElementById('input_fps').value = Game.settings.fps;
	// set up RNG
	Game.rng.init();
	document.getElementById('seed').innerHTML = Game.rng.seed;
	// set up system
	Game.system = new System();
	// change max
	document.getElementById('input_id').max = Game.system.secondaries.length-1;
	// set up systemHeight and speed
	Game.speedSetup();
	Game.systemHeightSetup();
	// set up ticks
	setInterval(redrawInterface, 1000);
	setInterval(gameTick, 1000/Game.settings.fps);
	setInterval(redrawMap, 1000/Game.settings.fps);
	setInterval(Game.queue.update, 1000);
	setInterval(Game.save.save, 1000*Game.settings.autosaveInterval);
	// "Annie, are you okay?" every 2h
	const uhwi = Game.settings.userHealthWarningInterval*hour*1000;
	if (uhwi){
		setInterval(userHealth, uhwi);
	}
	// set up tabs
	const rightTabs = document.getElementById('righttabs');
	Array.from(document.getElementById('rightdocs').children).forEach(elem => {
		const span = document.createElement('span');
		span.id = elem.id + '-tab';
		// for some dumb fuckin reason directly setting onclick doesn't work heres
		span.setAttribute('onclick', 'selectTab("' + elem.id + '");');
		span.innerHTML = proper(elem.id);
		rightTabs.appendChild(span);
		rightTabs.innerHTML += ' ';
	});
	// select welcome tab
	selectTab('welcome');
	// set up order type list
	createOrderTypeList();
	// set up keybinds
	document.addEventListener('keydown', event => {
		if (Game.keybinds.hasOwnProperty(event.key)){
			Game.keybinds[event.key]();
		}
	});
	// save
	Game.save.save();
	// successful loading
	document.getElementById('nojs').style.visibility = 'hidden';
	console.info('Mocha\'s Space Game Alpha loaded.');
}

function gameTick(){
	Game.time += Game.paused ? 0 : Game.speed/Game.settings.fps;
}

/** update the right menu */
function redrawInterface(){
	// update quests
	Quest.update();
	// update people tab
	updatePeople();
	// update navy
	updateNavy();
	// update orders
	updateOrders();
	// update events
	updateEvents();
}

function redrawMap(){
	// update infobox
	const selectionId = Game.planet.id;
	const infoboxElement = document.getElementById('leftinfo');
	if (infoboxElement.benisData !== selectionId ||
			Game.debug.lastInfoboxUpdate + Game.debug.infoboxUpdateTime < Game.time){
		infoboxElement.innerHTML = '';
		infoboxElement.appendChild(Game.system.secondaries[selectionId].info);
		infoboxElement.benisData = selectionId;
		Game.debug.lastInfoboxUpdate = Game.time;
	}
	// update time
	document.getElementById('time').innerHTML = '&nbsp;t = ' + Game.timeFormat(Game.time);
	document.getElementById('timerate').innerHTML = '&Delta;t = ' + Game.timeFormat(Game.speed);
	// update zoom
	document.getElementById('zoom').innerHTML = Game.systemHeight/au;
	// update planetId min
	document.getElementById('input_id').min = Game.system.secondaries.filter(p => p.destroyed).length;
	// update resource count
	updateResources();
	// update map
	Game.system.draw();
	// update orbitBar scale
	Game.orbitBarScale();
	// update star info
	Game.orbitBar.title = Game.system.primary.info;
	// check if red giant star engulfs inner planets
	Game.system.secondaries.forEach(p => {
		if (!p.destroyed && p.orbit.periapsis < Game.system.primary.radius){
			p.destroyed = true;
		}
	});
}

/** @param {number} id */
function setBody(id){
	document.getElementById('input_id').value = id;
}

function updateNavy(){
	// display/update current quests
	const navyTable = document.getElementById('navy');
	for (const shipClass in Game.player.navy){
		if (document.getElementById('col2_'+shipClass)){
			// just update count
			document.getElementById('col2_'+shipClass).innerHTML = Game.player.navy[shipClass];
		}
		else {
			// row
			const row = document.createElement('tr');
			row.id = 'row_'+shipClass;
			// col 1
			const nameCell = document.createElement('th');
			nameCell.innerHTML = shipClass;
			nameCell.id = 'col1_'+shipClass;
			row.appendChild(nameCell);
			// col 2
			const countCell = document.createElement('td');
			countCell.innerHTML = Game.player.navy[shipClass];
			countCell.id = 'col2_'+shipClass;
			row.appendChild(countCell);
			// finish
			navyTable.appendChild(row);
		}
	}
}

function updateEvents(){
	// relist events
	const eventListElement = document.getElementById('eventlist');
	Game.player.events.forEach(e => {
		const id = 'event'+e;
		if (!document.getElementById(id)){
			const itemElement = document.createElement('li');
			itemElement.appendChild(Game.events[e].draw());
			itemElement.id = id;
			eventListElement.appendChild(itemElement);
		}
	});
	// check if new events apply
	if (Game.paused){
		return;
	}
	Game.events.forEach((e, j) => {
		if (0 <= Game.player.events.indexOf(j) || !e.condition()){
			return;
		}
		if (Game.rng.random() < Game.speed/e.mtth){
			Game.player.events.push(j);
		}
	});
}

function updateOrders(){
	// if changed, update
	const orderListElement = document.getElementById('orderlist');
	orderListElement.innerHTML = '';
	for (let i=0; i<Game.player.orders.length; i+=1){
		const itemElement = document.createElement('li');
		itemElement.appendChild(drawOrder(Game.player.orders[i]));
		orderListElement.appendChild(itemElement);
		// check if conditions are fulfilled
		// if done, finish order and delete it
		const thisOrder = Game.player.orders[i];
		const orderType = Game.orders[thisOrder[1]];
		if (thisOrder[3] >= orderType.progressNeeded){
			// give bonus
			orderType.onComplete();
			// return ships
			// delete it
			Order.remove(thisOrder[0]);
		}
		// if enough resources to continue, continue
		else if (orderType.consumptionAfforable){
			for (const resource in orderType.consumption){
				Game.player.resources[resource] -= orderType.consumption[resource];
			}
			thisOrder[3] += 1;
		}
	}
	// update selection
	document.getElementById('orderSelectionID').innerHTML = Game.planet.id;
	const order = Game.orders[getOrderID()];
	const shipTable = document.getElementById('shipTable');
	shipTable.innerHTML = '';
	for (const shipClass in order.shipCost){
		const row = document.createElement('tr');
		const col1 = document.createElement('th');
		col1.innerHTML = shipClass;
		row.appendChild(col1);
		const col2 = document.createElement('td');
		col2.innerHTML = order.shipCost[shipClass];
		row.appendChild(col2);
		shipTable.appendChild(row);
	}
	// update "can afford?"
	document.getElementById('orderAffordable').innerHTML = 'Can' +
		(order.affordable ? '': '&rsquo;t') + ' afford';
	document.getElementById('orderAffordable').classList = order.affordable ? 'green' : 'red';
}

// hey mocha continue here okay?
function updatePeople(){
	if (!Game.people.length){
		return;
	}
	// todo
	const p = Game.people[Game.selectedPerson];
	document.getElementById('personInfo').innerHTML = p.info.innerHTML;
}

function updatePersonSearch(){
	// create tables with clickable names that change Game.selectedPerson
}

function updateResources(){
	'water fuel steel'.split(' ').forEach(s => {
		document.getElementById(s).innerHTML = Game.player.resources[s];
		document.getElementById(s+'label').innerHTML = asciiEmoji[s][Game.settings.asciiEmoji];
	});
}

function userHealth(){
	const uhwi = Game.settings.userHealthWarningInterval;
	const h = uhwi === 1 ? '' : 's';
	alert('Hey there! I see you\'ve been playing the game for over ' + uhwi +
		' hour' + h + ' straight! Do you wanna take a break for a bit?' +
		' You can disable me or change my interval in the settings! :)');
}

main();