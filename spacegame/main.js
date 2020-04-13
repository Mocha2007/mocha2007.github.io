/* jshint esversion: 6, strict: true, forin: false, loopfunc: true, strict: global */
/* exported importSave, downloadSave, wipeMap, hardReset */
// begin basic block
'use strict';

function round(number, digits = 0){
	number *= Math.pow(10, digits);
	number = Math.round(number);
	number /= Math.pow(10, digits);
	return number;
}
function deleteCookie(name){
	document.cookie = [name, '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/; domain=.', window.location.host.toString()].join('');
}
function readCookie(name){ // https://stackoverflow.com/a/11344672/2579798
	let result = document.cookie.match(new RegExp(name + '=([^;]+)'));
	if (result){
		result = JSON.parse(result[1]);
	}
	return result;
}
function writeCookie(name, value){ // https://stackoverflow.com/a/11344672/2579798
	const cookie = [name, '=', JSON.stringify(value), '; domain=.', window.location.host.toString(), '; path=/;'].join('');
	document.cookie = cookie;
}
function download(content, fileName, contentType){ // https://stackoverflow.com/questions/34156282/how-do-i-save-json-to-local-text-file/34156339#34156339
	const a = document.createElement('a');
	const file = new Blob([content], {type: contentType});
	a.href = URL.createObjectURL(file);
	a.download = fileName;
	a.click();
}
function importSave(){
	const saveData = document.getElementById('saveData').value;
	document.cookie = atob(saveData);
	location.reload();
}
function exportSave(){
	const data = btoa(document.cookie);
	document.getElementById('saveData').value = data;
	console.log('Exported Save.');
	return data;
}
function downloadSave(){
	download(exportSave(), 'mochaSpaceGameSave.txt', 'text/plain');
}
// end basic block
// begin math block
const pi = Math.PI;

/**
 * @param {number} n
 * @param {number} m
 */
function mod(n, m){
	return (n%m+m)%m;
}

/**
 * @param {number} value
 * @param {[number, number]} range1
 * @param {[number, number]} range2
 */
function remap(value, range1, range2){
	const range1range = range1[1] - range1[0];
	const range2range = range2[1] - range2[0];
	const fraction = (value - range1[0]) / range1range;
	return fraction * range2range + range2[0];
}

/**
 * @param {number} n
 * @return {0[]}
*/
function zeros(n){
	return Array(n).map(() => 0);
}

// end math block
// begin astro block
const minute = 60;
const hour = 60*minute;
const day = 24*hour;
const year = 365.2425 * day;
// var month = year/12;

const au = 149597870700;
const gravConstant = 6.674e-11;
const visibleProperties = [
	'name',
	'classification',
	'esi',
	'mass',
	'radius',
	'density',
	'surfaceGravity',
	'temp',
	'tempDelta',
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
		'constant': year,
		'name': 'yr',
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
	'temp': {
		'constant': 1,
		f(x){
			return x-273.2;
		},
		'name': '&deg;C',
	},
	'v_e': {
		'constant': 1000,
		'name': 'km/s',
	},
};

class Body {
	/**
	 * @param {number} mass
	 * @param {number} radius
	 * @param {number} albedo
	 * @param {Orbit} orbit
	 * @param {string} name
	 */
	constructor(mass, radius, albedo, orbit, name){
		this.mass = mass;
		this.radius = radius;
		this.albedo = albedo;
		this.orbit = orbit;
		this.name = name;
	}
	get classification(){
		if (2e26 < this.mass){
			return 'gasGiant';
		}
		if (6e25 < this.mass){
			return 'iceGiant';
		}
		if (2e24 < this.mass){
			return 'terra';
		}
		if (5e23 < this.mass){
			return 'desert';
		}
		return 'rock';
	}
	get density(){
		return this.mass / this.volume;
	}
	get esi(){
		const r = this.radius;
		const rho = this.density;
		const T = this.temp;
		const rE = earth.radius;
		const rhoE = earth.density;
		const TE = earth.temp;
		const esi1 = 1-Math.abs((r-rE)/(r+rE));
		const esi2 = 1-Math.abs((rho-rhoE)/(rho+rhoE));
		const esi3 = 1-Math.abs((this.v_e-earth.v_e)/(this.v_e+earth.v_e));
		const esi4 = 1-Math.abs((T-TE)/(T+TE));
		// console.log(esi1, esi2, esi3, esi4);
		return Math.pow(esi1, 0.57/4) * Math.pow(esi2, 1.07/4) *
			Math.pow(esi3, 0.7/4) * Math.pow(esi4, 5.58/4);
	}
	/** @return {HTMLDivElement} */
	get getElement(){
		return document.getElementById(this.name);
	}
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
			if (property === 'orbit'){
				cell.appendChild(this.orbit.info);
			}
			else if (specialUnits.hasOwnProperty(property)){
				if (specialUnits[property].hasOwnProperty('f')){
					value = specialUnits[property].f(value);
				}
				cell.innerHTML = round(value/specialUnits[property].constant, 2) + ' ' + specialUnits[property].name;
			}
			else {
				cell.innerHTML = typeof value === 'number'? round(value, 2) : value;
			}
			row.appendChild(cell);
			table.appendChild(row);
		}
		return table;
	}
	get isPHW(){
		return 6e23 < this.mass && this.mass < 6e25 && 205 < this.temp && this.temp < 305;
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
	/** @param {number} dist */
	tempAt(dist){
		return this.orbit.parent.temperature * Math.pow(1-this.albedo, 0.25) *
			Math.pow(this.orbit.parent.radius/2/dist, 0.5);
	}
	get tempDelta(){
		const mean = this.temp;
		const plus = round(this.tempAt(this.orbit.periapsis) - mean, 2);
		const minus = round(mean - this.tempAt(this.orbit.apoapsis), 2);
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
}

class Orbit {
	/**
	 * @param {Body} parent
	 * @param {number} sma
	 * @param {number} ecc
	 * @param {number} aop
	 * @param {number} man
	 */
	constructor(parent, sma, ecc, aop, man){
		this.parent = parent;
		this.sma = sma;
		this.ecc = ecc;
		this.aop = aop;
		this.man = man;
	}
	// functions
	get apoapsis(){
		return (1+this.ecc)*this.sma;
	}
	/** @param {number} t */
	cartesian(t){
		const E = this.eccentricAnomaly(t);
		const nu = this.trueAnomaly(t);
		const rC = this.sma*(1-this.ecc*Math.cos(E));
		return [rC*Math.cos(nu), rC*Math.sin(nu)];
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
	get info(){
		const table = document.createElement('table');
		for (const i in visibleProperties){
			const property = visibleProperties[i];
			if (this[property] === undefined){
				continue;
			}
			const value = this[property];
			const row = document.createElement('tr');
			let cell = document.createElement('th');
			cell.innerHTML = property;
			row.appendChild(cell);
			cell = document.createElement('td');
			if (property === 'parent'){
				cell.innerHTML = this.parent.name;
			}
			else if (specialUnits.hasOwnProperty(property)){
				cell.innerHTML = round(value/specialUnits[property].constant, 2) + ' ' + specialUnits[property].name;
			}
			else {
				cell.innerHTML = round(value, 2);
			}
			row.appendChild(cell);
			table.appendChild(row);
		}
		return table;
	}
	get orbitBarRect(){
		const rect = document.createElement('span');
		const barWidth = window.innerWidth / 2;
		const p = remap(this.periapsis, [0, Game.system.maxOrbitRadius], [0, barWidth]);
		const width = remap(this.apoapsis - this.periapsis,
			[0, Game.system.maxOrbitRadius], [0, barWidth]);
		rect.style.width = width + 'px';
		rect.style.position = 'absolute';
		rect.style.left = p + 'px';
		rect.style.cursor = 'pointer';
		rect.innerHTML = '&nbsp;';
		return rect;
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
}

class Star extends Body {
	/**
	 * @param {number} mass
	 * @param {number} radius
	 * @param {string} name
	 * @param {number} luminosity
	 * @param {number} temperature
	 */
	constructor(mass, radius, name, luminosity, temperature){
		super(mass, radius, undefined, undefined, name);
		this.luminosity = luminosity;
		this.temperature = temperature;
	}
}

class System {
	/**
	 * @param {Body} primary
	 * @param {Body[]} secondaries
	 */
	constructor(primary, secondaries){
		this.primary = primary;
		this.secondaries = secondaries;
	}
	get maxOrbitRadius(){
		let maximum = 0;
		let currentApoapsis;
		this.secondaries.forEach(s => {
			if (maximum < (currentApoapsis = s.orbit.apoapsis)){
				maximum = currentApoapsis;
			}
		});
		return maximum;
	}
}

/** @param {number} mass */
function densityFromMass(mass){
	if (2e26 < mass){
		return Game.rng.uniform(600, 1400);
	}
	if (6e25 < mass){
		return Game.rng.uniform(1200, 1700);
	}
	return Game.rng.uniform(3900, 5600);
}

/** @param {number} previousSMA */
function nextSMA(previousSMA){
	return previousSMA * Game.rng.uniform(1.38, 2.01);
}

/** @param {number} mass in suns */
function starGen(mass = 1){
	const luminosity = 0.45 < mass ? 1.148*Math.pow(mass, 3.4751) : 0.2264*Math.pow(mass, 2.52);
	return new Star(mass, Math.pow(mass, 0.96), 'Star', luminosity, 5772*Math.pow(mass, 0.54));
}

const sun = new Star(1.9885e30, 6.957e8, 'Sun', 3.828e26, 5778);
const earth = new Body(5.97237e24, 6371000, 0.306, new Orbit(sun, 1.49598023e11, 0.0167086, 1.9933027, 6.25905), 'Earth');

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
	 * @param {string} title
	 * @param {string} desc
	 * @param {number} mtth
	 */
	constructor(title, desc, mtth, condition = () => true, options = [new GameEventOption()]){
		this.title = title;
		this.desc = desc;
		this.mtth = mtth;
		this.condition = condition;
		this.options = options;
	}
	get id(){
		return Game.events.indexOf(this);
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
		Game.player.orders.push([Number(new Date()), orderID, getID(), 0]);
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
	constructor(title, desc = '', conditions = [], requirements = [], results = []){
		this.title = title;
		this.desc = desc;
		this.conditions = conditions;
		this.requirements = requirements;
		this.results = results;
	}
}

function drawQuests(quest){
	const id = Game.quests.indexOf(quest);
	if (document.getElementById('quest'+id)){
		// update
		if (quest.complete && !quest.elementUpdated){
			document.getElementById('quest'+id+'completion').classList = 'green';
			document.getElementById('quest'+id+'completion').innerHTML = 'complete';
			quest.elementUpdated = true;
			quest.results.map(x => x());
		}
	}
	else { // create
		const questElement = document.createElement('div');
		questElement.classList = 'quest';
		questElement.id = 'quest'+id;
		// title
		const questTitle = document.createElement('h2');
		questTitle.innerHTML = quest.title;
		questElement.appendChild(questTitle);
		// desc
		const questDesc = document.createElement('div');
		questDesc.innerHTML = quest.desc;
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

/** @param {GameEvent} event */
function drawEvent(event){
	const eventElement = document.createElement('div');
	// title
	const title = document.createElement('h2');
	title.innerHTML = event.title;
	eventElement.appendChild(title);
	// desc
	const desc = document.createElement('p');
	desc.innerHTML = event.desc;
	eventElement.appendChild(desc);
	// options
	const optionList = document.createElement('ul');
	event.options.forEach(e => {
		const option = document.createElement('li');
		const optionButton = document.createElement('input');
		optionButton.type = 'submit';
		optionButton.value = e.text;
		optionButton.onclick = () => {
			e.onClick();
			event.remove();
			const eventNode = document.getElementById('event'+event.id);
			eventNode.parentNode.removeChild(eventNode);
		};
		option.appendChild(optionButton);
		optionList.appendChild(option);
	});
	eventElement.appendChild(optionList);
	return eventElement;
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

/** @param {Body} planet */
function drawPlanet(planet){
	let planetIcon = document.getElementById(planet.name);
	if (planetIcon === null){
		planetIcon = document.createElement('div');
		document.getElementById('map').appendChild(planetIcon);
		planetIcon.id = planet.name;
		planetIcon.innerHTML = asciiEmoji.planet[Game.settings.asciiEmoji];
		planetIcon.style.position = 'absolute';
		planetIcon.title = planet.name;
	}
	planetIcon.classList.value = 'planet ' + planet.classification;
	if (planet.isPHW){
		planetIcon.classList.value += ' phw';
	}
	const planetCoords = getPlanetCoods(planet);
	planetIcon.style.left = planetCoords[0]+'px';
	planetIcon.style.top = planetCoords[1]+'px';
	const index = Game.system.secondaries.indexOf(planet);
	planetIcon.onclick = () => setBody(index);
	// check if selection...
	if (getID() === index){
		planetIcon.classList.value += ' ' + selectionStyle[Game.settings.selectionStyle];
	}
	// check if colony
	if (Game.player.colonyID === index){
		planetIcon.classList.value += ' colony';
	}
	// orbit bar
	if (!document.getElementById('orbitBar' + planet.name)){
		const orbitBarRect = planet.orbit.orbitBarRect;
		orbitBarRect.id = 'orbitBar' + planet.name;
		orbitBarRect.style['background-color'] = document.defaultView.getComputedStyle(planetIcon).color;
		orbitBarRect.onclick = () => setBody(index);
		orbitBarRect.title = planet.name;
		document.getElementById('orbitbar').appendChild(orbitBarRect);
	}
}

function drawStar(){
	let planetIcon = document.getElementById(sun.name);
	if (planetIcon === null){
		planetIcon = document.createElement('div');
		document.getElementById('map').appendChild(planetIcon);
		planetIcon.classList.value = 'star';
		planetIcon.id = sun.name;
		planetIcon.innerHTML = asciiEmoji.star[Game.settings.asciiEmoji];
		planetIcon.style.position = 'absolute';
	}

	const planetCoords = [window.innerWidth/2, window.innerHeight/2];
	planetIcon.style.left = planetCoords[0]+'px';
	planetIcon.style.top = planetCoords[1]+'px';
}

function getID(){
	return Number(document.getElementById('input_id').value);
}

/** general order type, not specific order */
function getOrderID(){
	return Number(document.getElementById('input_order_type').value);
}

/**
 * @param {Body} planet
 * @return {[number, number]}
*/
function getPlanetCoods(planet){
	const absCoords = planet.orbit.cartesian(Game.time);
	const x = remap(absCoords[0], [-Game.systemWidth, Game.systemWidth], [0, window.innerWidth]);
	const y = remap(absCoords[1], [-Game.systemHeight, Game.systemHeight], [0, window.innerHeight]);
	return [x, y];
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
	debug: {
		loaded: false,
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
	quests: [
		new Quest(
			'Select World',
			'Select a world to colonize. An ideal world is one with (in order of importance):<ol><li>temperature around -18&deg;C</li><li>mass within a factor of two of Earth\'s</li><li>near bodies which could be exploited in the future</li></ol><center class=\'red\'>(WARNING: cannot be undone!)<br><input id=\'world_selector\' type=\'submit\' value=\'Confirm Selection\' onclick=\'Game.player.colonyID=getID();\'></center><br>Reward: 1 Constructor',
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
	rng: {
		i: 0,
		seed: Number(new Date()),
		value: 0,
		init(){
			/** @type {number} */
			const loaded = readCookie('seed');
			if (loaded){
				this.seed = readCookie('seed');
			}
			else {
				writeCookie('seed', this.seed);
			}
			this.value = this.seed;
			return Boolean(loaded);
		},
		/**
		 * @param {number} min
		 * @param {number} max
		 */
		randint(min, max){ // random integer in range
			return Math.floor(this.uniform(min, max+1));
		},
		random(){
			/* jshint bitwise: false */
			const max31Bit = Math.pow(2, 31) - 1;
			const max32Bit = Math.pow(2, 32) - 1;
			let x = this.value;
			x ^= x << 13;
			x ^= x >> 17;
			x ^= x << 5;
			this.value = x;
			this.i += 1;
			return (this.value+max31Bit)/max32Bit;
		},
		/**
		 * @param {number} min
		 * @param {number} max
		 */
		uniform(min, max){ // random real in range
			return this.random() * (max-min) + min;
		},
	},
	settings: {
		autosaveInterval: 1,
		fps: 20,
		asciiEmoji: 0,
		selectionStyle: 0,
	},
	speed: 16*hour,
	/** @type {System} */
	system: undefined,
	systemHeight: 3*au,
	time: 0,
	// methods
	get playerHasColony(){
		return 0 <= this.player.colonyID;
	}
};
// Q0COND
Game.quests[0].conditions = [() => Game.playerHasColony];

/** @param {number} sma */
function generateBody(sma){
	sma /= au;
	let mass;
	if (0.8 < sma && sma < 1.5){
		mass = Math.pow(10, Game.rng.uniform(23.8, 25.2));
	}
	else if (5 < sma && sma < 31){
		mass = Math.pow(10, Game.rng.uniform(25.9, 28.3));
	}
	else {
		mass = 2*Math.pow(10, Game.rng.uniform(17, 27));
	}
	const density = densityFromMass(mass);
	const radius = Math.pow(mass/(density*4/3*pi), 1/3);
	const albedo = Game.rng.uniform(0.1, 0.7);
	return new Body(mass, radius, albedo);
}

/** @param {number} sma */
function generateOrbit(sma){
	const parent = sun;
	const ecc = Game.rng.uniform(0, 0.21);
	const aop = Game.rng.uniform(0, 2*pi);
	const man = Game.rng.uniform(0, 2*pi);
	return new Orbit(parent, sma, ecc, aop, man);
}

/** @param {number} sma */
function generatePlanet(sma){
	const planet = generateBody(sma);
	planet.orbit = generateOrbit(sma);
	planet.name = 'Sol-' + Game.rng.randint(100000, 999999);
	return planet;
}

function generateSystem(attempt = 0){
	if (attempt >= 100){
		throw 'too many failed attempts... something is broken :(';
	}
	const numberOfPlanets = Game.rng.randint(7, 9);
	const startSMA = 0.39*au;
	const SMAList = zeros(numberOfPlanets);
	SMAList[0] = startSMA;
	for (let i=1; i<SMAList.length; i+=1){
		SMAList[i] = nextSMA(SMAList[i-1]);
	}
	const systemAttempt = SMAList.map(generatePlanet);
	return systemAttempt.some(x => x.isPHW) ? systemAttempt : generateSystem(attempt+1);
}

function getQuestsFromIds(){
	return Game.player.quests.map(x => Game.quests[x]);
}

function main(){
	console.info('Mocha\'s weird-ass space game test');
	if (readCookie('settings')){
		Game.settings = readCookie('settings');
		document.getElementById('input_fps').value = Game.settings.fps;
	}
	// set up RNG
	Game.debug.loaded = Game.rng.init();
	document.getElementById('seed').innerHTML = Game.rng.seed;
	// set up system
	Game.system = new System(starGen(), generateSystem());
	// set up ticks
	updateFPS();
	setInterval(redrawInterface, 1000);
	setInterval(gameTick, 1000/Game.settings.fps);
	setInterval(redrawMap, 1000/Game.settings.fps);
	// select welcome tab
	selectTab('welcome');
	// load?
	if (readCookie('player')){
		Game.player = readCookie('player');
	}
	if (readCookie('time')){
		Game.time = readCookie('time');
	}
	// save
	saveGame();
	// set up order type list
	createOrderTypeList();
}

function gameTick(){
	Game.time = Game.paused ? Game.time : Game.time + Game.speed/Game.settings.fps;
	Game.systemWidth = window.innerWidth/window.innerHeight * Game.systemHeight;
}

function hardReset(){
	console.warn('Hard Reset!');
	deleteCookie('seed');
	deleteCookie('player');
	location.reload();
}
function redrawInterface(){
	// update quests
	updateQuests();
	// update navy
	updateNavy();
	// update orders
	updateOrders();
	// update events
	updateEvents();
	// save
	if (minute < new Date() - Game.debug.lastSave){
		saveGame(false);
	}
}

function redrawMap(){
	// update infobox
	const selectionId = getID();
	const infoboxElement = document.getElementById('leftinfo');
	if (infoboxElement.benisData !== selectionId){
		infoboxElement.innerHTML = '';
		infoboxElement.appendChild(Game.system.secondaries[selectionId].info);
		infoboxElement.benisData = selectionId;
	}
	// update time
	document.getElementById('time').innerHTML = 't = ' + round(Game.time/hour) + ' h';
	document.getElementById('timerate').innerHTML = 'dt = ' + Game.speed/hour + ' h';
	// update zoom
	document.getElementById('zoom').innerHTML = Game.systemHeight/au;
	// update resource count
	updateResources();
	// update map
	if (!Game.paused){
		Game.system.secondaries.map(drawPlanet);
		drawStar();
	}
}

/** @param {boolean} isManual */
function saveGame(isManual){
	// store cookie https://www.w3schools.com/js/js_cookies.asp
	writeCookie('settings', Game.settings);
	writeCookie('player', Game.player);
	writeCookie('time', Game.time);
	Game.debug.lastSave = new Date();
	if (isManual){
		console.log('Successfully manually saved game!');
	}
}

/** @param {number} id */
function setBody(id){
	document.getElementById('input_id').value = id;
}

function updateFPS(){
	Game.settings.fps = Number(document.getElementById('input_fps').value);
	saveGame();
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
			itemElement.appendChild(drawEvent(Game.events[e]));
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
	document.getElementById('orderSelectionID').innerHTML = getID();
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
	document.getElementById('orderAffordable').innerHTML = 'Can' + (order.affordable ? '': '&rsquo;t') + ' afford';
	document.getElementById('orderAffordable').classList = order.affordable ? 'green' : 'red';
}

function updateQuests(){
	// display/update current quests
	getQuestsFromIds(Game.player.quests).map(drawQuests);
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
	getQuestsFromIds(Game.player.quests).map(updateQuestCompletion);
}

function updateQuestCompletion(quest){
	if (quest.complete){
		return;
	}
	if (quest.conditions.every(x => x())){
		quest.complete = true;
	}
}

function updateResources(){
	document.getElementById('water').innerHTML = Game.player.resources.water;
	document.getElementById('fuel').innerHTML = Game.player.resources.fuel;
	document.getElementById('steel').innerHTML = Game.player.resources.steel;
	document.getElementById('waterlabel').innerHTML = asciiEmoji.water[Game.settings.asciiEmoji];
	document.getElementById('fuellabel').innerHTML = asciiEmoji.fuel[Game.settings.asciiEmoji];
	document.getElementById('steellabel').innerHTML = asciiEmoji.steel[Game.settings.asciiEmoji];
}

main();