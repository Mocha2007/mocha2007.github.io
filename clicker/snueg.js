/* jshint esversion: 6, strict: true, strict: global */
/* globals ages, life_data */
/* exported open_age, search_button, toggle, main */
"use strict";

// classes

class Building{
	constructor(name, base_price, production){
		this.name = name;
		this.base_price = base_price;
		this.production = production;
		// this.storage = 0; // excess snueg storage eg 10.1 production -> 10 snueg and 0.1 storage
	}
	// getters
	get amount(){
		if (game.player.buildings[this.id] !== undefined){
			return game.player.buildings[this.id];
		}
		return 0;
	}
	get createElement(){
		// button
		var buy_button = document.createElement('div');
		buy_button.classList.add('buy_button');
		buy_button.id = this.elementId;
		buy_button.innerHTML = this.name;
		buy_button.onclick = () => this.buy();
		// amount
		var item_amount = document.createElement('div');
		item_amount.classList.add('item_amount');
		item_amount.innerHTML = this.amount;
		buy_button.appendChild(item_amount)
		// price
		var item_price = document.createElement('div');
		item_price.classList.add('item_price');
		item_price.innerHTML = this.next_price;
		buy_button.appendChild(item_price)
		return buy_button;
	}
	get elementId(){
		return this.name + "_button";
	}
	get id(){
		return game.buildings.indexOf(this);
	}
	get next_price(){
		return this.price_at(this.amount);
	}
	get totalProduction(){
		return this.production * this.amount;
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
		if (this.next_price <= game.player.snueg){
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
		// var snueg = this.totalProduction*time + this.storage;
		// var output = Math.floor(snueg);
		addSnueg(this.totalProduction*time);
		// this.storage = snueg - output;
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
	new Building('Snueg', 10, 0.1),
	new Building('Megasnueg', 100, 0.5),
];
game.news = [
	"I like snueg.",
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
	var saveData = document.getElementById("saveData").value;
	document.cookie = atob(saveData);
	location.reload();
}
function exportSave(){
	var data = btoa(document.cookie);
	document.getElementById("saveData").value = data;
	log("Exported Save.");
	return data;
}
function downloadSave(){
	download(exportSave(), 'mochaSpaceGameSave.txt', 'text/plain');
}

// other

function addSnueg(amount){
	game.player.snueg += amount;
}

function choice(array){
	return array[Math.floor(Math.random() * array.length)];
}

function gameTick(){
	// production
	var t = 1/game.settings.fps;
	for (var i=0; i < game.buildings.length; i++){
		var building = game.buildings[i];
		building.produce(t);
	}
	updateSnuegCount();
}

function log(string){
	game.debug.log.push(string);
	console.log(string);
}

function news(){
	document.getElementById('news').innerHTML = choice(game.news);
}

function redrawInterface(){
	// autosave notification
	var autosaveCountdown = round((+game.debug.lastSave + game.settings.autosaveInterval - new Date())/1000);
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
	saveFile.player = game.player;
	write_cookie("snueg", saveFile);
	game.debug.lastSave = new Date();
	if (isManual){
		log("Successfully manually saved game!");
	}
}

function snuegButton(){
	// add snueg
	game.player.snueg += 1;
	// update snueg amount
	updateSnuegCount();
	// log action
	log("Clicked snueg button");
}

function updateSnuegCount(){
	document.getElementById("snueg_counter").innerHTML = round(game.player.snueg);
	document.getElementById("snueg_production_counter").innerHTML = "Production: " + round(game.production, 1) + "/s";
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
		// settings
		game.settings = {};
		game.settings.autosaveInterval = 30 * 1000;
		game.settings.fps = 20;
		game.settings.newsUpdateInterval = 30 * 1000;
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
	// save!!!
	saveGame();
}