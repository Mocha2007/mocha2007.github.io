/* jshint esversion: 6, strict: true, forin: false, loopfunc: true, strict: global */
/* exported importSave, downloadSave, createOrder, wipeMap, hardReset */
// begin basic block
"use strict";
function alwaysTrue(){
	return true;
}
function clone(object){
	return JSON.parse(JSON.stringify(object));
}
function nop(){
	return;
}
function round(number, digits){
	number *= Math.pow(10, digits);
	number = Math.round(number);
	number /= Math.pow(10, digits);
	return number;
}
function seededRandom(){
	/* jshint bitwise: false */
	var max31Bit = Math.pow(2, 31) - 1;
	var max32Bit = Math.pow(2, 32) - 1;
	var x = Game.rng.value;
	x ^= x << 13;
	x ^= x >> 17;
	x ^= x << 5;
	Game.rng.value = x;
	Game.rng.i += 1;
	return (Game.rng.value+max31Bit)/max32Bit;
}
function seededRandomSetup(){
	Game.rng = {};
	var loaded = false;
	if (read_cookie("seed")){
		Game.rng.seed = read_cookie("seed");
		loaded = true;
	}
	else{
		Game.rng.seed = Number(new Date());
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
	if (result){
		result = JSON.parse(result[1]);
	}
	return result;
}
function write_cookie(name, value){ // https://stackoverflow.com/a/11344672/2579798
	var cookie = [name, '=', JSON.stringify(value), '; domain=.', window.location.host.toString(), '; path=/;'].join('');
	document.cookie = cookie;
}
function download(content, fileName, contentType){ // https://stackoverflow.com/questions/34156282/how-do-i-save-json-to-local-text-file/34156339#34156339
	var a = document.createElement("a");
	var file = new Blob([content], {type: contentType});
	a.href = URL.createObjectURL(file);
	a.download = fileName;
	a.click();
}
function importSave(){
	var saveData = document.getElementById("saveData").value;
	document.cookie = atob(saveData);
	location.reload();
}
function exportSave(){
	var data = btoa(document.cookie);
	document.getElementById("saveData").value = data;
	console.log("Exported Save.");
	return data;
}
function downloadSave(){
	download(exportSave(), 'mochaSpaceGameSave.txt', 'text/plain');
}
// end basic block
// begin math block
var pi = Math.PI;

function mod(n,m){
	return ((n%m)+m)%m;
}

function randint(min, max){ // random integer in range
	return Math.floor(uniform(min, max+1));
}

function remap(value, range1, range2){
	var range1range = range1[1] - range1[0];
	var range2range = range2[1] - range2[0];
	var fraction = (value - range1[0]) / range1range;
	return fraction * range2range + range2[0];
}

function uniform(min, max){ // random real in range
	return seededRandom() * (max-min) + min;
}

function zeros(n){
	var zeroArray = [];
	for (var i=0;i<n;i+=1){
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
// var month = year/12;

var au = 149597870700;
var gravConstant = 6.674e-11;
var visibleProperties = [
	"name",
	"classification",
	"esi",
	"mass",
	"radius",
	"density",
	"surfaceGravity",
	"temp",
	"tempDelta",
	"v_e",
	// orbit
	"orbit",
	"period",
	"sma",
	"ecc"
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
	},
	"temp": {
		"constant": 1,
		f(x){
			return x-273.2;
		},
		"name": "&deg;C"
	},
	"v_e": {
		"constant": 1000,
		"name": "km/s"
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
	get classification(){
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
	get density(){
		return this.mass / this.volume;
	}
	get esi(){
		var r = this.radius;
		var rho = this.density;
		var T = this.temp;
		var r_e = earth.radius;
		var rho_e = earth.density;
		var T_e = earth.temp;
		var esi1 = 1-Math.abs((r-r_e)/(r+r_e));
		var esi2 = 1-Math.abs((rho-rho_e)/(rho+rho_e));
		var esi3 = 1-Math.abs((this.v_e-earth.v_e)/(this.v_e+earth.v_e));
		var esi4 = 1-Math.abs((T-T_e)/(T+T_e));
		// console.log(esi1, esi2, esi3, esi4);
		return Math.pow(esi1, 0.57/4) * Math.pow(esi2, 1.07/4) * Math.pow(esi3, 0.7/4) * Math.pow(esi4, 5.58/4);
	}
	get getElement(){
		return document.getElementById(this.name);
	}
	get info(){
		var table = document.createElement("table");
		var row, cell, property;
		for (var i in visibleProperties){
			property = visibleProperties[i];
			if (this[property] === undefined){
				continue;
			}
			var value = this[property];
			row = document.createElement("tr");
			cell = document.createElement("th");
			cell.innerHTML = property;
			row.appendChild(cell);
			cell = document.createElement("td");
			if (property === "orbit"){
				cell.appendChild(this.orbit.info);
			}
			else if (specialUnits.hasOwnProperty(property)){
				if (specialUnits[property].hasOwnProperty("f")){
					value = specialUnits[property].f(value);
				}
				cell.innerHTML = round(value/specialUnits[property].constant, 2) + " " + specialUnits[property].name;
			}
			else{
				cell.innerHTML = typeof value === "number"? round(value, 2) : value;
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
	tempAt(dist){
		return this.orbit.parent.temperature * Math.pow(1-this.albedo, 0.25) * Math.pow(this.orbit.parent.radius/2/dist, 0.5);
	}
	get tempDelta(){
		var mean = this.temp;
		var plus = round(this.tempAt(this.orbit.periapsis) - mean, 2);
		var minus = round(mean - this.tempAt(this.orbit.apoapsis), 2);
		var elem = document.createElement("span");
		var plusElement = document.createElement("sup");
		plusElement.classList = "supsub";
		plusElement.innerHTML = "+" + plus;
		elem.appendChild(plusElement);
		var minusElement = document.createElement("sub");
		minusElement.classList = "supsub";
		minusElement.innerHTML = "-" + minus;
		elem.appendChild(minusElement);
		return elem.innerHTML;
	}
	get volume(){
		return 4/3 * pi * Math.pow(this.radius, 3);
	}
	get v_e(){
		return Math.pow(2*this.mu/this.radius, 0.5);
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
	get apoapsis(){
		return (1+this.ecc)*this.sma;
	}
	cartesian(t){
		var E = this.eccentricAnomaly(t);
		var nu = this.trueAnomaly(t);
		var r_c = this.sma*(1-this.ecc*Math.cos(E));
		return [r_c*Math.cos(nu), r_c*Math.sin(nu)];
	}
	eccentricAnomaly(t){
		var tol = 1e-10;
		var M = mod(this.man + 2*pi*t/this.period, 2*pi);
		var E = M;
		var oldE = E + 2*tol;
		while (tol < Math.abs(E-oldE)){
			oldE = E;
			E = M + this.ecc*Math.sin(E);
		}
		return E;
	}
	get info(){
		var table = document.createElement("table");
		var row, cell, property;
		for (var i in visibleProperties){
			property = visibleProperties[i];
			if (this[property] === undefined){
				continue;
			}
			var value = this[property];
			row = document.createElement("tr");
			cell = document.createElement("th");
			cell.innerHTML = property;
			row.appendChild(cell);
			cell = document.createElement("td");
			if (property === "parent"){
				cell.innerHTML = this.parent.name;
			}
			else if (specialUnits.hasOwnProperty(property)){
				cell.innerHTML = round(value/specialUnits[property].constant, 2) + " " + specialUnits[property].name;
			}
			else{
				cell.innerHTML = round(value, 2);
			}
			row.appendChild(cell);
			table.appendChild(row);
		}
		return table;
	}
	get orbitBarRect(){
		var rect = document.createElement("span");
		var barWidth = window.innerWidth / 2;
		var p = remap(this.periapsis, [0, Game.system.maxOrbitRadius], [0, barWidth]);
		var width = remap(this.apoapsis - this.periapsis, [0, Game.system.maxOrbitRadius], [0, barWidth]);
		rect.style.width = width + "px";
		rect.style.position = "absolute";
		rect.style.left = p + "px";
		rect.style.cursor = "pointer";
		rect.innerHTML = "&nbsp;"
		return rect;
	}
	get periapsis(){
		return (1-this.ecc)*this.sma;
	}
	get period(){
		return 2*pi*Math.pow((Math.pow(this.sma, 3)/this.parent.mu), 0.5);
	}
	trueAnomaly(t){
		var E = this.eccentricAnomaly(t);
		var e = this.ecc;
		return 2 * Math.atan2(Math.pow(1+e, 0.5) * Math.sin(E/2), Math.pow(1-e, 0.5) * Math.cos(E/2));
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
	get maxOrbitRadius(){
		var maximum = 0;
		var currentApoapsis;
		for (var i=0; i<this.secondaries.length; i+=1){
			if (maximum < (currentApoapsis = this.secondaries[i].orbit.apoapsis)){
				maximum = currentApoapsis;
			}
		}
		return maximum;
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

var sun = new Star(1.9885e30, 6.957e8, "Sun", 3.828e26, 5778);
var earth = new Body(5.97237e24, 6371000, 0.306, new Orbit(sun, 1.49598023e11, 0.0167086, 1.9933027, 6.25905), "Earth");

// end astro block
// begin gameplay block
var eventList = [
	{
		'title': 'Comet Sighted',
		'desc': 'A comet was sighted. Ouf. Prepare for revolts...?',
		'condition': alwaysTrue,
		'mtth': year,
		'options': [
			{
				'text': 'Neat.',
				'onClick': nop
			},
			{
				'text': 'Meh.',
				'onClick': nop
			}
		]
	}
];
var questList = [
	{
		'title': "Select World",
		'desc': "Select a world to colonize. An ideal world is one with (in order of importance):<ol><li>temperature around -18&deg;C</li><li>mass within a factor of two of Earth's</li><li>near bodies which could be exploited in the future</li></ol><center class='red'>(WARNING: cannot be undone!)<br><input id='world_selector' type='submit' value='Confirm Selection' onclick='Game.player.colonyID=getID();'></center><br>Reward: 1 Constructor",
		'conditions': [
			function(){
				return Game.player.colonyID >= 0;
			}
		],
		'requirements': [
			// function(){return true;}
		],
		'results': [
			function(){
				// remove button
				var node = document.getElementById("world_selector");
				node.parentNode.removeChild(node);
				// add constructor
				modifyNavy("constructor", 1);
			}
		]
	}
];
var orderList = [
	{
		'type': 'Assay',
		'progressNeeded': 50,
		'cost': {
			'fuel': 10
		},
		'shipCost': {
			'surveyor': 1
		},
		'consumption': { // per day
			'water': 1
		},
		onComplete(){
			Game.player.resources.steel += 100;
		}
	},
	{
		'type': 'Convert Water to Fuel',
		'progressNeeded': 50,
		'cost': {},
		'shipCost': {
			'constructor': 1
		},
		'consumption': {
			'fuel': -1,
			'water': 1
		},
		'onComplete': nop
	},
	{
		'type': 'Mine Ice',
		'progressNeeded': 50,
		'cost': {
			'fuel': 10
		},
		'shipCost': {
			'constructor': 1
		},
		'consumption': {
			'water': -1
		},
		'onComplete': nop
	}
];
/*
var sampleOrder = {
	'type': 'survey',
	'target': 2,
	'progress': 12,
	'progressNeeded': 46,
	'consumption': { // per day
		'water': 1
	},
	'onComplete': function(){console.log("benis");}
};
*/

function drawQuests(quest){
	var id = questList.indexOf(quest);
	if (document.getElementById("quest"+id)){
		// update
		if (quest.complete && !quest.elementUpdated){
			document.getElementById("quest"+id+"completion").classList = "green";
			document.getElementById("quest"+id+"completion").innerHTML = "complete";
			quest.elementUpdated = true;
			quest.results.map(function(x){x();});
		}
	}
	else{ // create
		var questElement = document.createElement("div");
		questElement.classList = "quest";
		questElement.id = "quest"+id;
		// title
		var questTitle = document.createElement("h2");
		questTitle.innerHTML = quest.title;
		questElement.appendChild(questTitle);
		// desc
		var questDesc = document.createElement("div");
		questDesc.innerHTML = quest.desc;
		questElement.appendChild(questDesc);
		// quest status
		var questStatus = document.createElement("span");
		questStatus.innerHTML = "incomplete";
		questStatus.classList = "red";
		questStatus.id = "quest"+id+"completion";
		questElement.appendChild(questStatus);
		// append to main
		document.getElementById("quests").appendChild(questElement);
	}
}
function canAffordOrder(order){
	// check resource costs
	for (var resource in order.cost){
		if (Game.player.resources[resource] < order.cost[resource]){
			return false;
		}
	}
	// check ship costs
	for (var shipClass in order.shipCost){
		if (!Game.player.navy.hasOwnProperty(shipClass) || Game.player.navy[shipClass] < order.shipCost[shipClass]){
			return false;
		}
	}
	return true;
}
function createOrder(){
	var orderID = getOrderID();
	var order = orderList[orderID];
	if (!canAffordOrder(order)){
		return;
	}
	// else, pay cost
	for (var resource in order.cost){
		Game.player.resources[resource] -= order.cost[resource];
	}
	for (var shipClass in order.shipCost){
		Game.player.navy[shipClass] -= order.shipCost[shipClass];
	}
	var newOrder = clone(orderList[orderID]);
	newOrder.onComplete = orderList[orderID].onComplete; // trust me, this is indeed necessary
	newOrder.progress = 0;
	newOrder.target = getID();
	newOrder.id = Number(new Date());
	newOrder[""] = '<input type="submit" value="Cancel" onclick="deleteOrderById('+newOrder.id+')">';
	Game.player.orders.push(newOrder);
}
function deleteOrderById(id){
	// console.log("Deleting order", id);
	var order;
	for (var i=0; i<Game.player.orders.length; i+=1){
		if (Game.player.orders[i].id === id){
			order = Game.player.orders.pop(i);
			break;
		}
	}
	// return ships
	for (var shipClass in order.shipCost){
		Game.player.navy[shipClass] += order.shipCost[shipClass];
	}
}
function drawOrder(order){
	var orderElement = document.createElement("table");
	for (var property in order){
		if (0 <= ["progressNeeded", "consumption", "onComplete", "cost", "shipCost"].indexOf(property)){
			continue;
		}
		// create new row
		var row = document.createElement("tr");
		// create header col
		var col1 = document.createElement("th");
		col1.innerHTML = property;
		row.appendChild(col1);
		// create value col
		var col2 = document.createElement("td");
		if (property === "progress"){
			// create progress element
			var progressBar = document.createElement("progress");
			progressBar.value = order.progress / order.progressNeeded;
			col2.appendChild(progressBar);
			// annotation
			var progressSpan = document.createElement("span");
			progressSpan.innerHTML = order.progress + "/" + order.progressNeeded;
			col2.appendChild(progressSpan);
		}
		else{
			col2.innerHTML = order[property];
		}
		row.appendChild(col2);
		// append row
		orderElement.appendChild(row);
	}
	return orderElement;
}
function drawEvent(event){
	var eventElement = document.createElement("div");
	// title
	var title = document.createElement("h2");
	title.innerHTML = event.title;
	eventElement.appendChild(title);
	// desc
	var desc = document.createElement("p");
	desc.innerHTML = event.desc;
	eventElement.appendChild(desc);
	// options
	var optionList = document.createElement("ul");
	for (var i=0; i<event.options.length; i+=1){
		var option = document.createElement("li");
		var optionButton = document.createElement("input");
		optionButton.type = "submit";
		optionButton.value = event.options[i].text;
		optionButton.onclick = function(){
			event.options[i].onClick();
			removeEvent(getEventID(event));
			var eventNode = document.getElementById('event'+getEventID(event));
			eventNode.parentNode.removeChild(eventNode);
		};
		// console.log(event.options[i].onClick);
		option.appendChild(optionButton);
		optionList.appendChild(option);
	}
	eventElement.appendChild(optionList);
	return eventElement;
}
function getEventID(event){
	for (var i=0; i<eventList.length; i+=1){
		if (event === eventList[i]){
			return i;
		}
	}
}
function removeEvent(id){
	for (var i=0; i<Game.player.events.length; i+=1){
		if (id === Game.player.events[i]){
			return Game.player.events.pop(i);
		}
	}
}
function enoughResourcesToSupportOrder(order){
	for (var resource in order.consumption){
		if (Game.player.resources[resource] < order.consumption[resource]){
			return false;
		}
	}
	return true;
}

// end gameplay block
// begin interface block
var asciiEmoji = {
	'star': ['*', '🔆'],
	'planet': ['&middot;', '🌑'],
	'water': ['water', '💧'],
	'fuel': ['fuel', '⛽'],
	'steel': ['steel', '🔩']
};
var selectionStyle = ["selected", "selectedOld"];

function createOrderTypeList(){
	var selector = document.getElementById("input_order_type");
	for (var i=0; i<orderList.length; i+=1){
		var option = document.createElement("option");
		option.value = i;
		option.innerHTML = orderList[i].type;
		selector.appendChild(option);
	}
}

function drawPlanet(planet){
	var planetIcon = document.getElementById(planet.name);
	if (planetIcon === null){
		planetIcon = document.createElement("div");
		document.getElementById("map").appendChild(planetIcon);
		planetIcon.id = planet.name;
		planetIcon.innerHTML = asciiEmoji.planet[Game.settings.asciiEmoji];
		planetIcon.style.position = "absolute";
		planetIcon.title = planet.name;
	}
	planetIcon.classList.value = "planet " + planet.classification;
	if (planet.isPHW){
		planetIcon.classList.value += ' phw';
	}
	var planetCoords = getPlanetCoods(planet);
	planetIcon.style.left = planetCoords[0]+"px";
	planetIcon.style.top = planetCoords[1]+"px";
	var index = Game.system.secondaries.indexOf(planet);
	planetIcon.onclick = function(){setBody(index);};
	// check if selection...
	if (getID() === index){
		planetIcon.classList.value += " " + selectionStyle[Game.settings.selectionStyle];
	}
	// check if colony
	if (Game.player.colonyID === index){
		planetIcon.classList.value += " colony";
	}
	// orbit bar
	if (!document.getElementById("orbitBar" + planet.name)){
		var orbitBarRect = planet.orbit.orbitBarRect;
		orbitBarRect.id = "orbitBar" + planet.name;
		orbitBarRect.style["background-color"] = document.defaultView.getComputedStyle(planetIcon).color;
		orbitBarRect.onclick = function(){setBody(index);};
		orbitBarRect.title = planet.name;
		document.getElementById("orbitbar").appendChild(orbitBarRect);
	}
}

function drawStar(){
	var planetIcon = document.getElementById(sun.name);
	if (planetIcon === null){
		planetIcon = document.createElement("div");
		document.getElementById("map").appendChild(planetIcon);
		planetIcon.classList.value = "star";
		planetIcon.id = sun.name;
		planetIcon.innerHTML = asciiEmoji.star[Game.settings.asciiEmoji];
		planetIcon.style.position = "absolute";
	}

	var planetCoords = [window.innerWidth/2, window.innerHeight/2];
	planetIcon.style.left = planetCoords[0]+"px";
	planetIcon.style.top = planetCoords[1]+"px";
}

function getID(){
	return Number(document.getElementById("input_id").value);
}

function getOrderID(){
	return Number(document.getElementById("input_order_type").value);
}

function getPlanetCoods(planet){
	var absCoords = planet.orbit.cartesian(Game.time);
	var x = remap(absCoords[0], [-Game.systemWidth, Game.systemWidth], [0, window.innerWidth]);
	var y = remap(absCoords[1], [-Game.systemHeight, Game.systemHeight], [0, window.innerHeight]);
	return [x, y];
}

function modifyNavy(shipClass, count){
	if (!Game.player.navy.hasOwnProperty(shipClass)){
		Game.player.navy[shipClass] = count;
	}
	else{
		Game.player.navy[shipClass] += count;
	}
}

function selectTab(id){
	var children = document.getElementById('rightdocs').children;
	for (var i=0; i<children.length; i+=1){
		children[i].style.display = "none";
	}
	document.getElementById(id).style.display = "";
}

function wipeMap(){
	document.getElementById("map").innerHTML = "";
}

// end interface block
// begin main program
var Game = {};

function generateBody(sma){
	sma /= au;
	var mass;
	if (0.8 < sma && sma < 1.5){
		mass = Math.pow(10, uniform(23.8, 25.2));
	}
	else if (5 < sma && sma < 31){
		mass = Math.pow(10, uniform(25.9, 28.3));
	}
	else{
		mass = 2*Math.pow(10, uniform(17, 27));
	}
	var density = densityFromMass(mass);
	var radius = Math.pow(mass/(density*4/3*pi), 1/3);
	var albedo = uniform(0.1, 0.7);
	return new Body(mass, radius, albedo);
}

function generateOrbit(sma){
	var parent = sun;
	var ecc = uniform(0, 0.25);
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
		console.log(systemAttempt);
		throw "too many failed attempts... something is broken :(";
	}
	var numberOfPlanets = randint(7, 9);
	var startSMA = 0.39*au;
	var SMAList = zeros(numberOfPlanets);
	SMAList[0] = startSMA;
	for (var i=1; i<SMAList.length; i+=1){
		SMAList[i] = nextSMA(SMAList[i-1]);
	}
	var systemAttempt = SMAList.map(generatePlanet);
	return systemAttempt.some(function(x){return x.isPHW;}) ? systemAttempt : generateSystem(attempt+1);
}

function getQuestsFromIds(){
	return Game.player.quests.map(function(x){return questList[x];});
}

function main(){
	console.log("Mocha's weird-ass space game test");
	Game.debug = {};
	if (read_cookie("settings")){
		Game.settings = read_cookie("settings");
		document.getElementById("input_fps").value = Game.settings.fps;
	}
	else{
		Game.settings = {};
		Game.settings.autosaveInterval = 1;
		Game.settings.fps = 20;
		Game.settings.asciiEmoji = 0;
		Game.settings.selectionStyle = 0;
	}
	// set up RNG
	Game.debug.loaded = seededRandomSetup();
	document.getElementById("seed").innerHTML = Game.rng.seed;
	// set up system
	Game.system = new System(sun, generateSystem(0));
	// console.log(Game.system);
	// set variables up
	Game.speed = hour;
	Game.systemHeight = 3*au;
	// set up ticks
	updateFPS();
	setInterval(redrawInterface, 1000);
	setInterval(gameTick, 1000/Game.settings.fps);
	setInterval(redrawMap, 1000/Game.settings.fps);
	// select welcome tab
	selectTab("welcome");
	// load?
	if (read_cookie("player")){
		Game.player = read_cookie("player");
	}
	else{
		Game.player = {};
		Game.player.quests = [];
		Game.player.events = [];
		Game.player.resources = {};
		Game.player.resources.water = 1000;
		Game.player.resources.fuel = 1000;
		Game.player.resources.steel = 1000;
		Game.player.navy = {};
		Game.player.navy.surveyor = 1;
		Game.player.orders = [];
	}
	if (read_cookie("time")){
		Game.time = read_cookie("time");
	}
	else{
		Game.time = 0;
	}
	// save
	saveGame();
	// set up order type list
	createOrderTypeList();
}

function gameTick(){
	Game.time = Game.paused ? Game.time : Game.time + Game.speed;
	Game.systemWidth = window.innerWidth/window.innerHeight * Game.systemHeight;
}

function hardReset(){
	console.warn("Hard Reset!");
	delete_cookie("seed");
	delete_cookie("player");
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
	var selectionId = getID();
	var infoboxElement = document.getElementById("leftinfo");
	if (infoboxElement.benisData !== selectionId){
		infoboxElement.innerHTML = "";
		infoboxElement.appendChild(Game.system.secondaries[selectionId].info);
		infoboxElement.benisData = selectionId;
	}
	// update time
	document.getElementById("time").innerHTML = "t = " + Game.time/hour + " h";
	document.getElementById("timerate").innerHTML = "dt = " + Game.speed/hour + " h";
	// update zoom
	document.getElementById("zoom").innerHTML = Game.systemHeight/au;
	// update resource count
	updateResources();
	// update map
	if (!Game.paused){
		Game.system.secondaries.map(drawPlanet);
		drawStar();
	}
}

function saveGame(isManual){
	// store cookie https://www.w3schools.com/js/js_cookies.asp
	write_cookie("settings", Game.settings);
	write_cookie("player", Game.player);
	write_cookie("time", Game.time);
	Game.debug.lastSave = new Date();
	if (isManual){
		console.log("Successfully manually saved game!");
	}
}

function setBody(id){
	document.getElementById("input_id").value = id;
}

function updateFPS(){
	Game.settings.fps = Number(document.getElementById('input_fps').value);
	saveGame();
}

function updateNavy(){
	// display/update current quests
	var navyTable = document.getElementById("navy");
	for (var shipClass in Game.player.navy){
		if (document.getElementById("col2_"+shipClass)){
			// just update count
			document.getElementById("col2_"+shipClass).innerHTML = Game.player.navy[shipClass];
		}
		else{
			// row
			var row = document.createElement("tr");
			row.id = "row_"+shipClass;
			// col 1
			var nameCell = document.createElement("th");
			nameCell.innerHTML = shipClass;
			nameCell.id = "col1_"+shipClass;
			row.appendChild(nameCell);
			// col 2
			var countCell = document.createElement("td");
			countCell.innerHTML = Game.player.navy[shipClass];
			countCell.id = "col2_"+shipClass;
			row.appendChild(countCell);
			// finish
			navyTable.appendChild(row);
		}
	}
}

function updateEvents(){
	// relist events
	var eventListElement = document.getElementById("eventlist");
	for (var i=0; i<Game.player.events.length; i+=1){
		var id = 'event'+Game.player.events[i];
		if (!document.getElementById(id)){
			var itemElement = document.createElement("li");
			itemElement.appendChild(drawEvent(eventList[Game.player.events[i]]));
			itemElement.id = id;
			eventListElement.appendChild(itemElement);
		}
	}
	// check if new events apply
	if (Game.paused){
		return;
	}
	for (var j=0; j<eventList.length; j+=1){
		var e = eventList[j];
		if (0 <= Game.player.events.indexOf(j) || !e.condition()){
			continue;
		}
		if (seededRandom() < Game.speed/e.mtth){
			Game.player.events.push(j);
		}
	}
}

function updateOrders(){
	// if changed, update
	var orderListElement = document.getElementById("orderlist");
	orderListElement.innerHTML = '';
	for (var i=0; i<Game.player.orders.length; i+=1){
		var itemElement = document.createElement("li");
		itemElement.appendChild(drawOrder(Game.player.orders[i]));
		orderListElement.appendChild(itemElement);
		// check if conditions are fulfilled
		// if done, finish order and delete it
		var thisOrder = Game.player.orders[i];
		if (thisOrder.progress >= thisOrder.progressNeeded){
			// give bonus
			thisOrder.onComplete();
			// return ships
			// delete it
			deleteOrderById(thisOrder.id);
		}
		// if enough resources to continue, continue
		else if (enoughResourcesToSupportOrder(thisOrder)){
			for (var resource in thisOrder.consumption){
				Game.player.resources[resource] -= thisOrder.consumption[resource];
			}
			thisOrder.progress += 1;
		}
	}
	// update selection
	document.getElementById("orderSelectionID").innerHTML = getID();
	var order = orderList[getOrderID()];
	var shipTable = document.getElementById("shipTable");
	shipTable.innerHTML = "";
	for (var shipClass in order.shipCost){
		var row = document.createElement("tr");
		var col1 = document.createElement("th");
		col1.innerHTML = shipClass;
		row.appendChild(col1);
		var col2 = document.createElement("td");
		col2.innerHTML = order.shipCost[shipClass];
		row.appendChild(col2);
		shipTable.appendChild(row);
	}
	// update "can afford?"
	document.getElementById("orderAffordable").innerHTML = "Can" + (canAffordOrder(order) ? "": "&rsquo;t") + " afford";
	document.getElementById("orderAffordable").classList = canAffordOrder(order) ? "green" : "red";
}

function updateQuests(){
	// display/update current quests
	getQuestsFromIds(Game.player.quests).map(drawQuests);
	// see if new quests apply
	for (var i=0; i<questList.length; i+=1){
		var quest = questList[i];
		if (Game.player.quests.indexOf(i) >= 0){
			continue;
		}
		var success = true;
		for (var j=0; j<quest.requirements.length; j++){
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
	if (quest.conditions.every(function(x){return x();})){
		quest.complete = true;
	}
}

function updateResources(){
	document.getElementById("water").innerHTML = Game.player.resources.water;
	document.getElementById("fuel").innerHTML = Game.player.resources.fuel;
	document.getElementById("steel").innerHTML = Game.player.resources.steel;
	document.getElementById("waterlabel").innerHTML = asciiEmoji.water[Game.settings.asciiEmoji];
	document.getElementById("fuellabel").innerHTML = asciiEmoji.fuel[Game.settings.asciiEmoji];
	document.getElementById("steellabel").innerHTML = asciiEmoji.steel[Game.settings.asciiEmoji];
}

document.onload = function(){main();};