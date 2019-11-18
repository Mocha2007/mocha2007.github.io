// begin basic block
var max31Bit = Math.pow(2, 31) - 1;
var max32Bit = Math.pow(2, 32) - 1;
function isFunction(functionToCheck) { // https://stackoverflow.com/a/7356528/2579798
	return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}
function seededRandom(){
	x = Game.rng.value;
	x ^= x << 13;
	x ^= x >> 17;
	x ^= x << 5;
	Game.rng.value = x;
	Game.rng.i += 1;
	return (Game.rng.value+max31Bit)/max32Bit;
}
function seededRandomSetup(){
	Game.rng = {};
	if (read_cookie("seed")){
		Game.rng.seed = read_cookie("seed");
		var loaded = true;
	}
	else{
		Game.rng.seed = Number(new Date());
		var loaded = false;
		write_cookie("seed", Game.rng.seed);
	}
	Game.rng.value = Game.rng.seed;
	Game.rng.i = 0;
	return loaded;
}
function delete_cookie(name) {
	document.cookie = [name, '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/; domain=.', window.location.host.toString()].join('');
}
function read_cookie(name){ // https://stackoverflow.com/a/11344672/2579798
	var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
	result && (result = JSON.parse(result[1]));
	return result;
}
function write_cookie(name, value){ // https://stackoverflow.com/a/11344672/2579798
	var cookie = [name, '=', JSON.stringify(value), '; domain=.', window.location.host.toString(), '; expires=Fri, 31 Dec 9999 23:59:59 UTC; path=/;'].join('');
	document.cookie = cookie;
}
// end basic block
// begin math block
var pi = Math.PI;

function mod(n,m){
	"use strict";
	return ((n%m)+m)%m;
}

function randint(min, max){ // random integer in range
	"use strict";
	return Math.floor(uniform(min, max+1));
}

function remap(value, range1, range2){
	"use strict";
	var range1range = range1[1] - range1[0];
	var range2range = range2[1] - range2[0];
	var fraction = (value - range1[0]) / range1range;
	return fraction * range2range + range2[0];
}

function sd(x){ // find the standard deviation of an array
	"use strict";
	return Math.sqrt(variance(x));
}

function sum(x){ // find the sum of an array
	"use strict";
	var s = 0;
	x.forEach(function(y){
		s += y;
	});
	return s;
}

function uniform(min, max){ // random real in range
	"use strict";
	return seededRandom() * (max-min) + min;
}

function variance(x){ // find the variance of an array
	"use strict";
	var meanOfArray = mean(x);
	var v = x.map(function(y){
		var z = y - meanOfArray;
		return z * z;
	});
	return sum(v) / (x.length - 1);
}

function zeros(n){
	zeroArray = [];
	for (i=0;i<n;i++){
		zeroArray.push(0);
	}
	return zeroArray;
}

// end math block
// begin astro block
var minute = 60;
var hour = 60*minute;
var day = 24*hour;
var year = 365.2425 * day;

var au = 149597870700;
var gravConstant = 6.674e-11;
var dataExceptions = [
	"classification",
	"density",
	"period",
	"surfaceGravity",
	"temp",
];
var specialUnits = {
	"density": {
		"constant": 1000,
		"name": "g/cm&sup3;"
	},
	"mass": {
		"constant": 5.97237e24,
		"name": "Earths"
	},
	"period": {
		"constant": year,
		"name": "yr"
	},
	"radius": {
		"constant": 1000,
		"name": "km"
	},
	"sma": {
		"constant": au,
		"name": "au"
	},
	"surfaceGravity": {
		"constant": 9.7,
		"name": "g"
	}
};

class Body{
	constructor(mass, radius, albedo, orbit, name){
		this.mass = mass;
		this.radius = radius;
		this.albedo = albedo;
		this.orbit = orbit;
		this.name = name;
	}
	classification = function(){
		if (2e26 < this.mass){
			return "gasGiant";
		}
		if (6e25 < this.mass){
			return "iceGiant";
		}
		if (2e24 < this.mass){
			return "terra";
		}
		if (5e23 < this.mass){
			return "desert";
		}
		return "rock";
	}
	density = function(){
		return this.mass / this.volume();
	}
	getElement = function(){
		return document.getElementById(this.name);
	}
	info = function(){
		var table = document.createElement("table");
		var row, cell;
		for (var property in this){
			var value = this[property]
			if (isFunction(value)){
				if (dataExceptions.indexOf(property) === -1){
					continue;
				}
				value = this[property]();
			}
			row = document.createElement("tr");
			cell = document.createElement("th");
			cell.innerHTML = property;
			row.appendChild(cell);
			cell = document.createElement("td");
			if (property === "orbit"){
				cell.appendChild(this.orbit.info());
			}
			else if (specialUnits.hasOwnProperty(property)){
				cell.innerHTML = value/specialUnits[property].constant + " " + specialUnits[property].name;
			}
			else{
				cell.innerHTML = value;
			}
			row.appendChild(cell);
			table.appendChild(row);
		}
		return table;
	}
	isPHW = function(){
		return 6e23 < this.mass && this.mass < 6e25 && 205 < this.temp() && this.temp() < 305;
	}
	mu = function(){
		return this.mass * gravConstant;
	}
	surfaceGravity = function(){
		return this.mu()/Math.pow(this.radius, 2);
	}
	temp = function(){
		return this.orbit.parent.temperature * Math.pow(1-this.albedo, 0.25) * Math.pow(this.orbit.parent.radius/2/this.orbit.sma, 0.5);
	}
	volume = function(){
		return 4/3 * pi * Math.pow(this.radius, 3);
	}
}

class Orbit{
	constructor(parent, sma, ecc, aop, man){
		this.parent = parent;
		this.sma = sma;
		this.ecc = ecc;
		this.aop = aop;
		this.man = man;
	}
	// functions
	cartesian = function(t){
		"use strict";
		var E = this.eccentricAnomaly(t);
		var nu = this.trueAnomaly(t);
		var r_c = this.sma*(1-this.ecc*Math.cos(E));
		return [r_c*Math.cos(nu), r_c*Math.sin(nu)];
	}
	eccentricAnomaly = function(t){
		"use strict";
		var tol = 1e-10;
		var M = mod(this.man + 2*pi*t/this.period(), 2*pi);
		var E = M;
		var E_;
		while (true){
			E_ = M + this.ecc*Math.sin(E);
			if (Math.abs(E-E_) > tol){
				return E;
			}
			E = E_;
			return E; // fixme
		}
	}
	info = function(){
		var table = document.createElement("table");
		var row, cell;
		for (var property in this){
			var value = this[property]
			if (isFunction(value)){
				if (dataExceptions.indexOf(property) === -1){
					continue;
				}
				value = this[property]();
			}
			row = document.createElement("tr");
			cell = document.createElement("th");
			cell.innerHTML = property;
			row.appendChild(cell);
			cell = document.createElement("td");
			if (property === "parent"){
				cell.innerHTML = this.parent.name;
			}
			else if (specialUnits.hasOwnProperty(property)){
				cell.innerHTML = value/specialUnits[property].constant + " " + specialUnits[property].name;
			}
			else{
				cell.innerHTML = value;
			}
			row.appendChild(cell);
			table.appendChild(row);
		}
		return table;
	}
	period = function(){
		"use strict";
		return 2*pi*Math.pow((Math.pow(this.sma, 3)/this.parent.mu()), .5);
	}
	trueAnomaly = function(t){
		var E = this.eccentricAnomaly(t);
		var e = this.ecc;
		return 2 * Math.atan2((1+e)**.5 * Math.sin(E/2), (1-e)**.5 * Math.cos(E/2));
	}
}

class Star extends Body{
	constructor(mass, radius, name, luminosity, temperature) {
		super(mass, radius, undefined, undefined, name);
		this.luminosity = luminosity;
		this.temperature = temperature;
	}
}

class System{
	constructor(primary, secondaries){
		this.primary = primary;
		this.secondaries = secondaries;
	}
}

function densityFromMass(mass){
	if (2e26 < mass){
		return uniform(600, 1400);
	}
	if (6e25 < mass){
		return uniform(1200, 1700);
	}
	return uniform(3900, 5600);
}

function nextSMA(previousSMA){
	return previousSMA * uniform(1.38, 2.01);
}

// end astro block
// begin interface block

function drawPlanet(planet){
	var planetIcon = document.getElementById(planet.name);
	if (planetIcon === null){
		var planetIcon = document.createElement("div");
		document.getElementById("map").appendChild(planetIcon);
		planetIcon.id = planet.name;
		planetIcon.innerHTML = "&middot;";
		planetIcon.style.position = "absolute";
	}
	planetIcon.classList.value = "planet " + planet.classification();
	if (planet.isPHW()){
		planetIcon.classList.value += ' phw';
	}
	var planetCoords = getPlanetCoods(planet);
	planetIcon.style.left = planetCoords[0]+"px";
	planetIcon.style.top = planetCoords[1]+"px";
	var index = Game.system.secondaries.indexOf(planet);
	planetIcon.onclick = function(){document.getElementById("input_id").value = index;};
	// check if selection...
	if (Number(document.getElementById("input_id").value) === index){
		planetIcon.classList.value += " selected";
	}
}

function drawStar(){
	var planetIcon = document.getElementById(sun.name);
	if (planetIcon === null){
		var planetIcon = document.createElement("div");
		document.getElementById("map").appendChild(planetIcon);
		planetIcon.classList.value = "star";
		planetIcon.id = sun.name;
		planetIcon.innerHTML = "*";
		planetIcon.style.position = "absolute";
	}
	var planetCoords = [Game.width/2, Game.height/2];
	planetIcon.style.left = planetCoords[0]+"px";
	planetIcon.style.top = planetCoords[1]+"px";
}

function getPlanetCoods(planet){
	var absCoords = planet.orbit.cartesian(Game.time);
	var x = remap(absCoords[0], [-Game.systemWidth, Game.systemWidth], [0, Game.width])
	var y = remap(absCoords[1], [-Game.systemHeight, Game.systemHeight], [0, Game.height])
	return [x, y];
}

function selectTab(id){
	var children = document.getElementById('rightdocs').children;
	for (i=0; i<children.length; i++){
		children[i].style.display = "none";
	}
	document.getElementById(id).style.display = "";
}

// end interface block
// begin main program
var Game = {};
var sun = new Star(1.9885e30, 6.957e8, "Sun", 3.828e26, 5778);

function generateBody(sma){
	sma /= au;
	if (0.8 < sma && sma < 1.5){
		var mass = Math.pow(10, uniform(23.8, 25.2));
	}
	else if (5 < sma && sma < 31){
		var mass = Math.pow(10, uniform(25.9, 28.3));
	}
	else{
		var mass = 2*Math.pow(10, uniform(17, 27));
	}
	var density = densityFromMass(mass);
	var radius = Math.pow(mass/(density*4/3*pi), 1/3);
	var albedo = uniform(.1, .7);
	return new Body(mass, radius, albedo);
}

function generateOrbit(sma){
	var parent = sun;
	var ecc = uniform(0, .25);
	var aop = uniform(0, 2*pi);
	var man = uniform(0, 2*pi);
	return new Orbit(parent, sma, ecc, aop, man);
}

function generatePlanet(sma){
	var planet = generateBody(sma);
	planet.orbit = generateOrbit(sma);
	planet.name = "Sol-" + randint(100000, 999999);
	return planet;
}

function generateSystem(attempt){
	if (attempt >= 100){
		console.error("too many failed attempts... something is broken :(");
		console.log(systemAttempt);
		return;
	}
	var numberOfPlanets = randint(7, 9);
	var startSMA = .39*au;
	var SMAList = zeros(numberOfPlanets);
	SMAList[0] = startSMA;
	for (i=1; i<SMAList.length; i++){
		SMAList[i] = nextSMA(SMAList[i-1]);
	}
	var systemAttempt = SMAList.map(generatePlanet);
	return systemAttempt.some(function(x){return x.isPHW();}) ? systemAttempt : generateSystem(attempt+1);
}

function main(){
	"use strict";
	console.log("Mocha's weird-ass space game test");
	Game.debug = {}
	if (read_cookie("settings")){
		Game.settings = read_cookie("settings");
	}
	else{
		Game.settings = {};
		Game.settings.autosaveInterval = 1;
		Game.settings.fps = 10;
		document.getElementById("input_fps").value = Game.settings.fps;
	}
	// set up RNG
	Game.debug.loaded = seededRandomSetup();
	document.getElementById("seed").innerHTML = Game.rng.seed;
	// set up system
	Game.system = new System(sun, generateSystem(0));
	// console.log(Game.system);
	// set variables up
	Game.speed = 21600; // 6h
	Game.time = 0;
	Game.systemHeight = 3*au;
	Game.resources = {};
	Game.resources.water = 0;
	Game.resources.fuel = 0;
	Game.resources.steel = 0;
	// set up ticks
	updateFPS();
	setInterval(gameTick, 1000/Game.settings.fps);
	// select welcome tab
	selectTab("welcome");
	// save
	saveGame();
}

function gameTick(){
	Game.time = Game.time + Game.speed;
	Game.width = window.innerWidth;
	Game.height = window.innerHeight;
	Game.systemWidth = Game.width/Game.height * Game.systemHeight;
	// finally, update interface
	redraw();
}

function hardReset(){
	console.warn("Hard Reset!");
	delete_cookie("seed");
	delete_cookie("resources");
	location.reload();
}

function redraw(){
	// update map
	Game.system.secondaries.map(drawPlanet);
	drawStar();
	// update infobox
	var selectionId = Number(document.getElementById("input_id").value);
	document.getElementById("leftinfo").innerHTML = "";
	document.getElementById("leftinfo").appendChild(Game.system.secondaries[selectionId].info());
	// update time
	document.getElementById("time").innerHTML = "t = " + Game.time/hour + " h";
	document.getElementById("timerate").innerHTML = "dt = " + Game.speed/hour + " h";
	// update zoom
	document.getElementById("zoom").innerHTML = Game.systemHeight/au;
	// update resource count
	document.getElementById("water").innerHTML = Game.resources.water;
	document.getElementById("fuel").innerHTML = Game.resources.fuel;
	document.getElementById("steel").innerHTML = Game.resources.steel;
	// save
	if (minute < new Date() - Game.debug.lastSave){
		saveGame(false);
	}
}

function saveGame(isManual){
	// store cookie https://www.w3schools.com/js/js_cookies.asp
	write_cookie("resources", Game.resources);
	write_cookie("settings", Game.settings);
	Game.debug.lastSave = new Date();
	if (isManual){
		console.log("Successfully manually saved game!");
	}
}

function updateFPS(){
	Game.settings.fps = Number(document.getElementById('input_fps').value);
	saveGame();
}

document.onload = function(){main();};