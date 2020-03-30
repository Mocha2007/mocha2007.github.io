/* jshint esversion: 6, strict: true, strict: global */
/* exported delete_cookie, downloadSave, importSave, main, prestige, snuegButton */
"use strict";

// classes

class Building{
	constructor(name, base_price, production, desc = ""){
		this.name = name;
		this.base_price = base_price;
		this.production = production;
		this.desc = desc;
	}
	// getters
	get amount(){
		if (game.player.buildings[this.id] !== undefined){
			return game.player.buildings[this.id];
		}
		return 0;
	}
	get bonus(){
		return globalBonus(); // for now...
	}
	get canAfford(){
		return this.next_price <= game.player.snueg;
	}
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
	get elementId(){
		return this.name + "_button";
	}
	get id(){
		return game.buildings.indexOf(this);
	}
	get individualProduction(){
		return this.production * this.bonus;
	}
	get next_price(){
		return this.price_at(this.amount);
	}
	get productionFraction(){
		return game.production ? this.totalProduction / game.production : 0;
	}
	get totalProduction(){
		return this.production * this.amount * this.bonus;
	}
	// functions
	addToDocument(){
		document.getElementById("building_panel").appendChild(this.createElement);
	}
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
	price_at(level){
		return round(this.base_price * Math.pow(1.15, level));
	}
	produce(time){
		addSnueg(this.totalProduction*time);
	}
	tooltip(){
		// function to update the tooltip
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

// constants

var game = {
	get production(){
		var sum = 0;
		for (var i=0; i < this.buildings.length; i++){
			sum += this.buildings[i].totalProduction;
		}
		return sum;
	}
};
game.buildings = [
	new Building('Snueg', 10, 0.1, "A warm snueg."),
	new Building('Megasnueg', 60, 0.5, "A really big snueg, more efficiently transferring warmth and affection."),
	new Building('Snueggr', 400, 4, "An unpaid intern to snueg you cheaply."),
	new Building('Snueggotron', 2000, 10, "A simple robot designed to automatically snueg you."),
];
game.news = [
	"I like snueg.",
	"licc",
	"Must... forevrially... snueg...",
	"Snueg is love, snueg is life.",
	"That's the power of snueg.",
	"UwU",
];

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

function addSnueg(amount){
	game.player.snueg += amount;
}

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

function choice(array){
	return array[Math.floor(Math.random() * array.length)];
}

function clearTooltip(array){
	// erase current tooltip
	var tooltip = document.getElementById("tooltip")
	tooltip.innerHTML = "";
	tooltip.style.top = "-5%";
	tooltip.style.left = "0px";
}

function gameTick(){
	var t = 1/game.settings.fps;
	// was the player away?
	if (2*game.settings.autosaveInterval < new Date() - game.player.lastSave){
		// offline rewards
		t = (new Date() - game.player.lastSave)/1000;
		saveGame();
	}
	// production
	for (var i=0; i < game.buildings.length; i++){
		var building = game.buildings[i];
		building.produce(t);
	}
	updateSnuegCount();
}

function globalBonus(){
	return 1 + 0.01 * game.player.prestige;
}

function log(string){
	game.debug.log.push(string);
	console.log(string);
}

function news(){
	document.getElementById('news').innerHTML = choice(game.news);
}

function nextPrestige(){
	// return number of snuegs for next prestige level
	if (game.player.snueg <= 0){
		return 1e9;
	}
	var nextNumber = thisPrestigeNumber() + 1;
	return Math.pow(nextNumber, 5) * 1e9;
}

function thisPrestigeNumber(){
	// return prestige gain if prestiged now
	return Math.floor(Math.pow(game.player.snueg/1e9, 1/5));
}

function play(filename){
	(new Audio(filename)).play();
}

function prestige(){
	// confirm
	var pp = thisPrestigeNumber();
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
	game.player.snueg = 0;
	game.player.buildings = [];
	// play sound
	play('prestige.mp3');
}

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

function round(number, digits = 0){
	number *= Math.pow(10, digits);
	number = Math.round(number);
	number /= Math.pow(10, digits);
	return number;
}

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
	game.player.snueg += globalBonus();
	// update snueg amount
	updateSnuegCount();
	// log action
	log("Clicked snueg button");
}

function updatePrestige(){
	document.getElementById('prestigeNumber').innerHTML = thisPrestigeNumber();
	document.getElementById('prestigeProgress').innerHTML = '';
	var progress = game.player.snueg / nextPrestige();
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
	game.debug.version = "a200329";
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
		// player
		game.player = {};
		game.player.buildings = [];
		game.player.snueg = 0;
		game.player.startTime = +new Date();
		game.player.prestige = 0;
		// settings
		game.settings = {};
		game.settings.autosaveInterval = 30 * 1000;
		game.settings.fps = 20;
		game.settings.newsUpdateInterval = 30 * 1000;
		// save!!!
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
	// clear tooltip
	clearTooltip();
}