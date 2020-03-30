/* jshint esversion: 6, strict: true, strict: global, eqeqeq: true */
/* exported delete_cookie, downloadSave, importSave, main, prestige, snuegButton */
"use strict";
var version = "a200330";

// classes

class Purchase{
	/**
	 * Buildings to improve snueg production
	 * @param {string} name - Name of the building
	 * @param {number} price - Base price of the building, increases 15% each purchase
	 * @param {string} desc - Description of the building, given in the tooltip
	*/
	constructor(name, price, desc = ""){
		this.name = name;
		this.price = price;
		this.desc = desc;
	}
	// getters
	/** @returns {boolean} true if the player can afford to purchase another of this building */
	get canAfford(){
		return this.next_price <= game.player.snueg;
	}
	/** @returns {string} id of buy button */
	get elementId(){
		return this.name + "_button";
	}
	// functions
	/** @returns {boolean} success */
	buy(){
		if (this.canAfford){
			game.player.snueg -= this.next_price;
			this.addToPlayer(1);
			this.updateElement();
			log("Player bought 1 " + this.name);
			return true;
		}
		log("Player tried to buy 1 " + this.name + ", but did not have enough snueg. (" +
			game.player.snueg + " < " + this.next_price + ")");
		return false;
	}
	buyBye(){
		if (this.buy()){
			document.getElementById(this.elementId).remove();
		}
	}
	updateElement(){
		document.getElementById(this.elementId).innerHTML = this.createElement.innerHTML;
	}
}

class Building extends Purchase{
	/**
	 * Buildings to improve snueg production
	 * @param {string} name - Name of the building
	 * @param {number} base_price - Base price of the building, increases 15% each purchase
	 * @param {number} production - In snueg
	 * @param {string} desc - Description of the building, given in the tooltip
	*/
	constructor(name, base_price, production, desc = ""){
		super(name, base_price, desc);
		this.production = production;
	}
	// getters
	/** @returns {number} Amount of this building current purchased */
	get amount(){
		if (game.player.buildings[this.id] !== undefined){
			return game.player.buildings[this.id];
		}
		return 0;
	}
	/** @returns {number} Bonus to production */
	get bonus(){
		return game.globalBonus * this.upgradeBonus;
	}
	/** @returns {boolean} true if the player can afford to purchase another of this building */
	get canAfford(){
		return this.next_price <= game.player.snueg;
	}
	/** @returns {HTMLDivElement} buy button */
	get createElement(){
		// button
		var buy_button = document.createElement('div');
		buy_button.classList.add('buy_button');
		buy_button.id = this.elementId;
		buy_button.onclick = () => this.buy();
		buy_button.onmousemove = () => this.tooltip();
		buy_button.onmouseout = () => clearTooltip();
		// todo buy_button.style.opacity = this.canAfford ? "100%" : "50%";
		// name
		var item_name = document.createElement('span');
		item_name.classList.add('item_name');
		item_name.innerHTML = this.name;
		buy_button.appendChild(item_name);
		// amount
		var item_amount = document.createElement('span');
		item_amount.classList.add('item_amount');
		item_amount.innerHTML = this.amount;
		buy_button.appendChild(item_amount);
		// price
		var item_price = document.createElement('span');
		item_price.classList.add('item_price');
		item_price.innerHTML = bigNumber(this.next_price, true);
		buy_button.appendChild(item_price);
		return buy_button;
	}
	/** @returns {string} id of buy button */
	get elementId(){
		return this.name + "_button";
	}
	/** @returns {number} index of this in game.buildings */
	get id(){
		return game.buildings.indexOf(this);
	}
	/** @returns {number} production of one of these buildings */
	get individualProduction(){
		return this.production * this.bonus;
	}
	/** @returns {number} cost to buy another of these buildings */
	get next_price(){
		return this.price_at(this.amount);
	}
	/** @returns {number} fraction of total production provided by these buildings */
	get productionFraction(){
		return game.production ? this.totalProduction / game.production : 0;
	}
	/** @returns {Upgrade[]} upgrades affecting this building */
	get relevantUpgrades(){
		var upgrades = [];
		for (var i = 0; i < game.upgrades.length; i++){
			var upgrade = game.upgrades[i];
			if (upgrade.targets.includes(this.id)){
				upgrades.push(upgrade);
			}
		}
		return upgrades;
	}
	/** @returns {number} total production provided by all buildings of this type */
	get totalProduction(){
		return this.production * this.amount * this.bonus;
	}
	/** @returns {number} bonus from relevant upgrades */
	get upgradeBonus(){
		var bonus = 1;
		var us = this.relevantUpgrades;
		for (var i = 0; i < us.length; i++){
			var upgrade = us[i];
			if (upgrade.purchased){
				bonus *= upgrade.bonus;
			}
		}
		return bonus;
	}
	// functions
	addToDocument(){
		document.getElementById("building_panel").appendChild(this.createElement);
	}
	/** @param {number} n number of this to add to player */
	addToPlayer(n){
		if (game.player.buildings[this.id] !== undefined){
			game.player.buildings[this.id] += n;
		}
		else {
			game.player.buildings[this.id] = n;
		}
	}
	buy(){
		if (this.canAfford){
			game.player.snueg -= this.next_price;
			this.addToPlayer(1);
			this.updateElement();
			log("Player bought 1 " + this.name);
			return;
		}
		log("Player tried to buy 1 " + this.name + ", but did not have enough snueg. (" +
			game.player.snueg + " < " + this.next_price + ")");
	}
	/**
	 * @param {number} n number of buildings already purchased
	 * @return {number} price after already having n buildings
	*/
	price_at(n){
		return round(this.price * Math.pow(1.15, n));
	}
	/** @param {number} time simulate the production of these buildings over time */
	produce(time){
		addSnueg(this.totalProduction*time);
	}
	tooltip(){
		// function to update the tooltip
		/** @type {HTMLDivElement} */
		var div = document.getElementById("tooltip");
		div.style.top = window.event.clientY - 25 + "px";
		div.style.left = window.event.clientX - 450 + "px";
		// text
		div.innerHTML = '<b>' + this.name + '</b>';
		div.innerHTML += '<b style="float: right;">' + bigNumber(this.next_price, true) + '</b><br>';
		div.innerHTML += this.desc;
		// item stats
		var ul = document.createElement('ul');
		div.appendChild(ul);
		var li = document.createElement('li');
		li.innerHTML = "each " + this.name + " produces <b>" + bigNumber(this.individualProduction) + "</b> snueg per second";
		ul.appendChild(li);
		li = document.createElement('li');
		li.innerHTML = this.amount + " " + this.name + " producing <b>" + bigNumber(this.totalProduction) + "</b> snueg per second (<b>" + (100*this.productionFraction).toFixed(1)+ "%</b> of total SpS)";
		ul.appendChild(li);
	}
	updateElement(){
		document.getElementById(this.elementId).innerHTML = this.createElement.innerHTML;
	}
}

class Upgrade extends Purchase{
	/**
	 * Upgrades to improve snueg production
	 * @param {string} name - Name of the upgrade
	 * @param {number} price - Price of the upgrade
	 * @param {number} bonus - Bonus (1 = normal, 0.5 = halved, 2 = doubled)
	 * @param {number[]} targets - IDs of targetted buildings
	 * @param {string} desc - Description of the upgrade, given in the tooltip
	 * @param {string[]} special - Special effect(s) of the upgrade. Currently only "mouse" is supported.
	*/
	constructor(name, price, bonus, targets, desc = "", special = []){
		super(name, price, desc);
		this.bonus = bonus;
		this.targets = targets;
		this.special = special;
	}
	/** @returns {HTMLDivElement} buy button */
	get createElement(){
		// button
		var buy_button = document.createElement('div');
		buy_button.classList.add('upgrade_buy_button');
		buy_button.id = this.elementId;
		buy_button.onclick = () => this.buyBye();
		buy_button.onmousemove = () => this.tooltip();
		buy_button.onmouseout = () => clearTooltip();
		// todo buy_button.style.opacity = this.canAfford ? "100%" : "50%";
		// name
		buy_button.innerHTML = this.icon;
		return buy_button;
	}
	/** @returns {string} icon of buy button */
	get icon(){ // todo
		return this.name[0];
	}
	/** @returns {number} index of this in game.upgrades */
	get id(){
		return game.upgrades.indexOf(this);
	}
	/** @returns {number} upgrade price */
	get next_price(){
		return this.price;
	}
	/** @returns {boolean} is this upgrade purchased? */
	get purchased(){
		return game.player.upgrades.includes(this.id);
	}
	/** @returns {string} desc string for special abilities */
	get specialString(){
		var specials = "";
		if (this.special.includes("mouse")){
			specials += "<li>Also increases production from clicking by this much.</li>";
		}
		return specials;
	}
	/** @returns {string[]} the names of its targets */
	get targetNames(){
		var names = [];
		for (var i = 0; i < this.targets.length; i++){
			var building = game.buildings[this.targets[i]];
			names.push(building.name);
		}
		return names;
	}
	// functions
	addToDocument(){
		if (0 < game.player.upgrades[this.id]){
			return;
		}
		document.getElementById("upgrade_panel").appendChild(this.createElement);
	}
	addToPlayer(){
		game.player.upgrades.push(this.id);
	}
	tooltip(){
		// function to update the tooltip
		/** @type {HTMLDivElement} */
		var div = document.getElementById("tooltip");
		div.style.top = window.event.clientY - 25 + "px";
		div.style.left = window.event.clientX - 450 + "px";
		// text
		div.innerHTML = '<b>' + this.name + '</b>';
		div.innerHTML += '<b style="float: right;">' + bigNumber(this.price, true) + '</b><br>';
		div.innerHTML += this.desc;
		// item stats
		var ul = document.createElement('ul');
		div.appendChild(ul);
		var li = document.createElement('li');
		li.innerHTML = "improves production of each " + this.targetNames.join(" and ") + " by " + bigNumber((this.bonus-1)*100, true) + "%";
		ul.appendChild(li);
		ul.innerHTML += this.specialString;
	}
}

// constants

var game = {
	get globalBonus(){
		return 1 + 0.01 * game.player.prestige;
	},
	/** @return {number} number of snuegs for next prestige level */
	get nextPrestige(){
		if (game.player.snueg <= 0){
			return 1e9;
		}
		var nextNumber = game.thisPrestigeNumber + 1;
		return Math.pow(nextNumber, 5) * 1e9;
	},
	get production(){
		var sum = 0;
		for (var i=0; i < this.buildings.length; i++){
			sum += this.buildings[i].totalProduction;
		}
		return sum;
	},
	/** @return {number} prestige gain if prestiged now */
	get thisPrestigeNumber(){
		return Math.floor(Math.pow(game.player.snueg/1e9, 1/5));
	},
	buildings: [
		new Building('Snueg', 10, 0.1, "A warm snueg."),
		new Building('Megasnueg', 60, 0.5, "A really big snueg, more efficiently transferring warmth and affection."),
		new Building('Snueggr', 400, 4, "An unpaid intern to snueg you cheaply."),
		new Building('Snueggotron', 2e3, 10, "A simple robot designed to automatically snueg you."),
		new Building('SNG 9000', 6e3, 40, "A half-sentient robot designed to automatically snueg you."),
		new Building('SNG 69000', 25e3, 100, "A fully sentient robot designed to snueg you with maximum simulated affection."),
		new Building('It&apos;s newegg', 125e3, 400, "For a nominal fee you too can own your own snueg-themed website."),
	],
	mouse: {
		base: 1,
		/** @returns {number} bonus from relevant upgrades */
		get bonus(){
			var b = 1;
			for (var i = 0; i < game.upgrades.length; i++){
				var upgrade = game.upgrades[i];
				if (upgrade.special.includes("mouse") && upgrade.purchased){
					b *= upgrade.bonus;
				}
			}
			return b * game.globalBonus;
		},
	},
	news: [
		"I like snueg.",
		"I love to snueg.",
		"licc",
		"Must... forevrially... snueg...",
		"Snueg is love, snueg is life.",
		"Snuegging is the best!",
		"That's the power of snueg.",
		"UwU",
		"Wow, snueg is great.",
	],
	player: {
		/** @type {number[]} */
		buildings: [],
		lastSave: 0,
		prestige: 0,
		snueg: 0,
		startTime: +new Date(),
		/** @type {number[]} */
		upgrades: [],
	},
	settings: {
		autosaveInterval: 30 * 1000,
		fps: 20,
		newsUpdateInterval: 30 * 1000,
	},
	upgrades: [
		new Upgrade('Kilosnueg', 100, 1.1, [0], "A <i>really</i> warm snueg."),
		new Upgrade('Floofy Megasnuegs', 600, 1.1, [1], "Makes the megasnuegs even floofier!"),
		new Upgrade('Clickysnueg', 750, 2, [], "Makes the cursor floofier so the clicks are nice and soft UwU", "mouse"),
		new Upgrade('Minimum Wage Snueggrs', 4000, 1.1, [2], "Pays the unpaid interns to motivate them more."),
		new Upgrade('Beyond Minimum Wage Snueggrs', 40000, 1.1, [2], "Pays the slightly paid interns even more."),
	],
	softReset(){
		this.player.buildings = [];
		this.player.snueg = 0;
		this.player.upgrades = [];
	},
};

// functions

// cookie shit (borrowed from spacegame's main.js)
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
	navigator.clipboard.readText().then(
  		clipText => document.cookie = atob(clipText));
	location.reload();
}
function exportSave(){
	var data = btoa(document.cookie);
	log("Exported Save.");
	return data;
}
function downloadSave(){
	download(exportSave(), 'snuegClickerBackup.txt', 'text/plain');
}

// other

/** @param {number} amount amount of snueg to add to player */
function addSnueg(amount){
	game.player.snueg += amount;
}

/**
 * @param {number} amount number
 * @param {boolean} integer should the output be rounded?
 * @return {string} prettified number
*/
function bigNumber(amount, integer = false){
	// 245 -> 245
	// 3245 -> 3.245 k
	// 3950847 -> 3.950 M
	if (amount < 1000){
		return integer ? "" + round(amount) : amount.toFixed(3);
	}
	var prefixes = " k M B T Qa Qi Sx Sp Oc No Dc".split(" "); // todo add more varieties for settings: SI, 1.0e10, ...
	var i = Math.floor(Math.log(amount)/Math.log(1000));
	var factor = Math.pow(1000, i);
	return round(amount/factor, 3).toFixed(3) + " " + prefixes[i];
}

/**
 * @param {any[]} array
 * @return {any} random item from array
*/
function choice(array){
	return array[Math.floor(Math.random() * array.length)];
}

function clearTooltip(){
	// erase current tooltip
	var tooltip = document.getElementById("tooltip");
	tooltip.innerHTML = "";
	tooltip.style.top = "-5%";
	tooltip.style.left = "0px";
}

function gameTick(){
	var t = 1/game.settings.fps;
	// was the player away?
	if (2*game.settings.autosaveInterval < new Date() - game.player.lastSave){
		// offline rewards
		t = (new Date() - game.player.lastSave)/1000 * 0.01; // 1% offline efficiency
		saveGame();
	}
	// production
	for (var i=0; i < game.buildings.length; i++){
		var building = game.buildings[i];
		building.produce(t);
	}
	updateSnuegCount();
}

/** @param {string} string string to log */
function log(string){
	game.debug.log.push(string);
	console.log(string);
}

function news(){
	document.getElementById('news').innerHTML = choice(game.news);
}

/** @param {string} filename to play */
function play(filename){
	(new Audio(filename)).play();
}

function prestige(){
	// confirm
	var pp = game.thisPrestigeNumber;
	if (!confirm("Are you sure you want to prestige up? You will lose all your snueg and buildings, but will gain a permanent " +
		pp + "% boost to your snueg production from all sources.")){
		return;
	}
	// follow through
	if (game.player.prestige === undefined){
		game.player.prestige = pp;
	}
	else {
		game.player.prestige += pp;
	}
	// DELETE
	game.softReset();
	// play sound
	play('prestige.mp3');
}

/**
 * @param {number} progress fraction in [0, 1]
 * @return {HTMLDivElement} progress bar element
*/
function progressBar(progress){
	var progressBarContainer = document.createElement("div");
	progressBarContainer.classList.add('progressBarContainer');
	var progressBar = document.createElement("div");
	progressBar.classList.add('progressBar');
	progressBar.style.width = 100 * progress + "%";
	progressBarContainer.appendChild(progressBar);
	return progressBarContainer;
}

function redrawInterface(){
	// autosave notification
	var autosaveCountdown = Math.floor((+game.player.lastSave + game.settings.autosaveInterval - new Date())/1000);
	document.getElementById('autosave').innerHTML = "autosave in " + autosaveCountdown + "s";
}

/**
 * @param {number} number to round
 * @param {number} digits to round to (default 0)
 * @return {number} rounded number
*/
function round(number, digits = 0){
	number *= Math.pow(10, digits);
	number = Math.round(number);
	number /= Math.pow(10, digits);
	return number;
}

/**
 * @param {boolean} isManual is this save manually triggered, or automatic?
*/
function saveGame(isManual = false){
	var saveFile = {};
	saveFile.settings = game.settings;
	game.player.lastSave = +new Date();
	saveFile.player = game.player;
	write_cookie("snueg", saveFile);
	game.debug.lastSave = new Date();
	if (isManual){
		log("Successfully manually saved game!");
	}
}

function snuegButton(){
	// add snueg
	game.player.snueg += game.mouse.base * game.mouse.bonus;
	// update snueg amount
	updateSnuegCount();
	// log action
	log("Clicked snueg button");
}

/**
 * updates the prestige bar
 * @return {number} progress to next level
*/
function updatePrestige(){
	document.getElementById('prestigeNumber').innerHTML = game.thisPrestigeNumber;
	document.getElementById('prestigeProgress').innerHTML = '';
	var progress = game.player.snueg / game.nextPrestige;
	document.getElementById('prestigeProgress').appendChild(progressBar(progress));
	return progress;
}

function updateSnuegCount(){
	var n = bigNumber(game.player.snueg, true);
	document.getElementById("snueg_counter").innerHTML = n;
	document.getElementById("snueg_production_counter").innerHTML = "Production: " + bigNumber(game.production) + "/s";
	// update webpage title
	document.title = n + " snuegs - Snueg Clicker";
	// update prestige progress
	updatePrestige();
}

// main only beyond here

function main(){
	game.debug = {};
	game.debug.loadTime = new Date();
	game.debug.log = [];
	game.debug.version = version;
	game.debug.newsTime = new Date();
	// update version div
	document.getElementById("version").innerHTML = "v. " + game.debug.version;
	// load save
	if (read_cookie("snueg")){
		var saveFile = read_cookie("snueg");
		game.player = saveFile.player;
		game.settings = saveFile.settings;
	}
	else{
		saveGame();
	}
	// set up ticks
	setInterval(redrawInterface, 1000/game.settings.fps);
	setInterval(gameTick, 1000/game.settings.fps);
	setInterval(saveGame, game.settings.autosaveInterval);
	setInterval(news, game.settings.newsUpdateInterval);
	// set up buildings
	document.getElementById("building_panel").innerHTML = "";
	for (var i = 0; i < game.buildings.length; i++){
		var building = game.buildings[i];
		building.addToDocument();
	}
	// set up upgrades
	document.getElementById("upgrade_panel").innerHTML = "";
	for (var j = 0; j < game.upgrades.length; j++){
		var upgrade = game.upgrades[j];
		upgrade.addToDocument();
	}
	// clear tooltip
	clearTooltip();
}