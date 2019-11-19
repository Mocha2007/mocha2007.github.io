// begin basic block
var max31Bit = Math.pow(2, 31) - 1;
var max32Bit = Math.pow(2, 32) - 1;
function clone(object){
	return JSON.parse(JSON.stringify(object));
}
function isFunction(functionToCheck) { // https://stackoverflow.com/a/7356528/2579798
	return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}
function nop(){
	"use strict";
	return;
}
function ping(){
	"use strict";
	console.log("ping");
}
function round(number, digits){
	"use strict";
	number *= Math.pow(10, digits);
	number = Math.round(number);
	number /= Math.pow(10, digits);
	return number;
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
var month = year/12;

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
	period = function(){
		"use strict";
		return 2*pi*Math.pow((Math.pow(this.sma, 3)/this.parent.mu()), 0.5);
	}
	trueAnomaly = function(t){
		var E = this.eccentricAnomaly(t);
		var e = this.ecc;
		return 2 * Math.atan2((1+e)**0.5 * Math.sin(E/2), (1-e)**0.5 * Math.cos(E/2));
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
// begin gameplay block
var eventList = [
	{
		'title': 'Comet Sighted',
		'desc': 'A comet was sighted. Ouf. Prepare for revolts...?',
		'condition': function(){return true;},
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
		'desc': "Select a world to colonize. An ideal world is one with (in order of importance):<ol><li>temperature around 255K</li><li>mass within a factor of two of Earth's</li><li>near bodies which could be exploited in the future</li></ol><center class='incomplete'>(WARNING: cannot be undone!)<br><input id='world_selector' type='submit' value='Confirm Selection' onclick='Game.player.colonyID=getID();'></center><br>Reward: 1 Constructor",
		'conditions': [
			function(){return Game.player.colonyID >= 0;}
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
		'onComplete': function(){Game.player.resources.steel += 100;}
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

function drawQuests(quest){
	var id = questList.indexOf(quest);
	if (document.getElementById("quest"+id)){
		// todo update
		if (quest.complete && !quest.elementUpdated){
			document.getElementById("quest"+id+"completion").classList = "complete";
			document.getElementById("quest"+id+"completion").innerHTML = "complete";
			quest.elementUpdated = true;
			quest.results.map(function(x){x();});
		}
	}
	else{ // create
		questElement = document.createElement("div");
		questElement.classList = "quest";
		questElement.id = "quest"+id;
		// title
		questTitle = document.createElement("h2");
		questTitle.innerHTML = quest.title;
		questElement.appendChild(questTitle)
		// desc
		questDesc = document.createElement("div");
		questDesc.innerHTML = quest.desc;
		questElement.appendChild(questDesc);
		// quest status
		questStatus = document.createElement("span");
		questStatus.innerHTML = "incomplete";
		questStatus.classList = "incomplete";
		questStatus.id = "quest"+id+"completion";
		questElement.appendChild(questStatus);
		// append to main
		document.getElementById("quests").appendChild(questElement);
	}
}
function canAffordOrder(order){
	// check resource costs
	for (resource in order.cost){
		if (Game.player.resources[resource] < order.cost[resource]){
			return false;
		}
	}
	// check ship costs
	for (shipClass in order.shipCost){
		if (!Game.player.navy.hasOwnProperty(shipClass) || Game.player.navy[shipClass] < order.shipCost[shipClass]){
			return false;
		}
	}
	return true;
}
function createOrder(){
	// todo cost
	var orderID = getOrderID();
	var order = orderList[orderID]
	if (!canAffordOrder(order)){
		return;
	}
	// else, pay cost
	for (resource in order.cost){
		Game.player.resources[resource] -= order.cost[resource];
	}
	for (shipClass in order.shipCost){
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
	for (i=0; i<Game.player.orders.length; i++){
		if (Game.player.orders[i].id === id){
			order = Game.player.orders.pop(i);
			break;
		}
	}
	// return ships
	for (shipClass in order.shipCost){
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
		row = document.createElement("tr");
		// create header col
		col1 = document.createElement("th");
		col1.innerHTML = property;
		row.appendChild(col1);
		// create value col
		col2 = document.createElement("td");
		if (property === "progress"){
			// create progress element
			progressBar = document.createElement("progress");
			progressBar.value = order.progress / order.progressNeeded;
			col2.appendChild(progressBar);
			// annotation
			progressSpan = document.createElement("span");
			progressSpan.innerHTML = order.progress + "/" + order.progressNeeded;
			col2.appendChild(progressSpan);
		}
		else{
			col2.innerHTML = order[property];
		}
		row.appendChild(col2)
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
	for (i=0; i<event.options.length; i++){
		option = document.createElement("li");
		optionButton = document.createElement("input");
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
	for (i=0; i<eventList.length; i++){
		if (event === eventList[i]){
			return i;
		}
	}
}
function removeEvent(id){
	for (i=0; i<Game.player.events.length; i++){
		if (id === Game.player.events[i]){
			return Game.player.events.pop(i);
		}
	}
}
function enoughResourcesToSupportOrder(order){
	for (resource in order.consumption){
		if (Game.player.resources[resource] < order.consumption[resource]){
			return false;
		}
	}
	return true;
}

// end gameplay block
// begin interface block

function createOrderTypeList(){
	var selector = document.getElementById("input_order_type");
	for (i=0; i<orderList.length; i++){
		option = document.createElement("option");
		option.value = i;
		option.innerHTML = orderList[i].type;
		selector.appendChild(option);
	}
}

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
	if (getID() === index){
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

function getID(){
	return Number(document.getElementById("input_id").value);
}

function getOrderID(){
	return Number(document.getElementById("input_order_type").value);
}

function getPlanetCoods(planet){
	var absCoords = planet.orbit.cartesian(Game.time);
	var x = remap(absCoords[0], [-Game.systemWidth, Game.systemWidth], [0, Game.width])
	var y = remap(absCoords[1], [-Game.systemHeight, Game.systemHeight], [0, Game.height])
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
		console.error("too many failed attempts... something is broken :(");
		console.log(systemAttempt);
		return;
	}
	var numberOfPlanets = randint(7, 9);
	var startSMA = 0.39*au;
	var SMAList = zeros(numberOfPlanets);
	SMAList[0] = startSMA;
	for (i=1; i<SMAList.length; i++){
		SMAList[i] = nextSMA(SMAList[i-1]);
	}
	var systemAttempt = SMAList.map(generatePlanet);
	return systemAttempt.some(function(x){return x.isPHW();}) ? systemAttempt : generateSystem(attempt+1);
}

function getQuestsFromIds(){
	return Game.player.quests.map(function(x){return questList[x];});
}

function main(){
	"use strict";
	console.log("Mocha's weird-ass space game test");
	Game.debug = {}
	if (read_cookie("settings")){
		Game.settings = read_cookie("settings");
		document.getElementById("input_fps").value = Game.settings.fps;
	}
	else{
		Game.settings = {};
		Game.settings.autosaveInterval = 1;
		Game.settings.fps = 20;
	}
	// set up RNG
	Game.debug.loaded = seededRandomSetup();
	document.getElementById("seed").innerHTML = Game.rng.seed;
	// set up system
	Game.system = new System(sun, generateSystem(0));
	// console.log(Game.system);
	// set variables up
	Game.speed = hour;
	Game.time = 0;
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
	// save
	saveGame();
	// set up order type list
	createOrderTypeList();
}

function gameTick(){
	Game.time = Game.paused ? Game.time : Game.time + Game.speed;
	Game.width = window.innerWidth;
	Game.height = window.innerHeight;
	Game.systemWidth = Game.width/Game.height * Game.systemHeight;
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
	var selectionId = Number(document.getElementById("input_id").value);
	var infoboxElement = document.getElementById("leftinfo");
	if (infoboxElement.benisData !== selectionId){
		infoboxElement.innerHTML = "";
		infoboxElement.appendChild(Game.system.secondaries[selectionId].info());
		infoboxElement.benisData = selectionId;
	}
	// update time
	document.getElementById("time").innerHTML = "t = " + Game.time/hour + " h";
	document.getElementById("timerate").innerHTML = "dt = " + Game.speed/hour + " h";
	// update zoom
	document.getElementById("zoom").innerHTML = Game.systemHeight/au;
	// update resource count
	document.getElementById("water").innerHTML = Game.player.resources.water;
	document.getElementById("fuel").innerHTML = Game.player.resources.fuel;
	document.getElementById("steel").innerHTML = Game.player.resources.steel;
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
	Game.debug.lastSave = new Date();
	if (isManual){
		console.log("Successfully manually saved game!");
	}
}

function updateFPS(){
	Game.settings.fps = Number(document.getElementById('input_fps').value);
	saveGame();
}

function updateNavy(){
	// display/update current quests
	navyTable = document.getElementById("navy");
	for (var shipClass in Game.player.navy){
		if (document.getElementById("col2_"+shipClass)){
			// just update count
			document.getElementById("col2_"+shipClass).innerHTML = Game.player.navy[shipClass];
		}
		else{
			// row
			row = document.createElement("tr");
			row.id = "row_"+shipClass;
			// col 1
			nameCell = document.createElement("th");
			nameCell.innerHTML = shipClass;
			nameCell.id = "col1_"+shipClass;
			row.appendChild(nameCell);
			// col 2
			countCell = document.createElement("td");
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
	eventListElement = document.getElementById("eventlist");
	for (i=0; i<Game.player.events.length; i++){
		id = 'event'+Game.player.events[i];
		if (!document.getElementById(id)){
			itemElement = document.createElement("li");
			itemElement.appendChild(drawEvent(eventList[Game.player.events[i]]));
			itemElement.id = id;
			eventListElement.appendChild(itemElement);
		}
	}
	// check if new events apply
	if (Game.paused){
		return;
	}
	for (i=0; i<eventList.length; i++){
		event = eventList[i];
		if (0 <= Game.player.events.indexOf(i) || !event.condition()){
			continue;
		}
		if (seededRandom() < Game.speed/event.mtth){
			Game.player.events.push(i);
		}
	}
}

function updateOrders(){
	// if changed, update
	orderListElement = document.getElementById("orderlist");
	orderListElement.innerHTML = '';
	for (i=0; i<Game.player.orders.length; i++){
		itemElement = document.createElement("li");
		itemElement.appendChild(drawOrder(Game.player.orders[i]));
		orderListElement.appendChild(itemElement);
		// check if conditions are fulfilled
		// if done, finish order and delete it
		thisOrder = Game.player.orders[i];
		if (thisOrder.progress >= thisOrder.progressNeeded){
			// give bonus
			thisOrder.onComplete();
			// return ships
			// delete it
			deleteOrderById(thisOrder.id);
		}
		// if enough resources to continue, continue
		else if (enoughResourcesToSupportOrder(thisOrder)){
			for (resource in thisOrder.consumption){
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
	for (shipClass in order.shipCost){
		row = document.createElement("tr");
		col1 = document.createElement("th");
		col1.innerHTML = shipClass;
		row.appendChild(col1);
		col2 = document.createElement("td");
		col2.innerHTML = order.shipCost[shipClass];
		row.appendChild(col2);
		shipTable.appendChild(row);
	}
	// update "can afford?"
	document.getElementById("orderAffordable").innerHTML = "Can" + (canAffordOrder(order) ? "": "&rsquo;t") + " afford";
	document.getElementById("orderAffordable").classList = canAffordOrder(order) ? "complete" : "incomplete";
}

function updateQuests(){
	// display/update current quests
	getQuestsFromIds(Game.player.quests).map(drawQuests);
	// see if new quests apply
	for (i=0; i<questList.length; i++){
		quest = questList[i];
		if (Game.player.quests.indexOf(i) >= 0){
			continue;
		}
		success = true;
		for (j=0; j<quest.requirements.length; j++){
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

document.onload = function(){main();};