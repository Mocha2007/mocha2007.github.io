/* jshint esversion: 6, strict: true, strict: global */
/* globals ages, life_data */
/* exported open_age, search_button, toggle, main */
"use strict";

// classes

class Building{
	constructor(name, base_price){
		this.name = name;
		this.base_price = base_price;
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
			log("Player bought 1 " + this.name);
			return;
		}
		log("Player tried to buy 1 " + this.name + ", but did not have enough snueg. (" +
			game.player.snueg + " < " + this.next_price + ")");
	}
	price_at(level){
		return Math.round(this.base_price * Math.pow(1.15, level));
	}
	updateElement(){
		document.getElementById(this.elementId) = createElement();
	}
}

// constants

var game = {};
game.buildings = [
	new Building('Snueg', 1),
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
	console.log("Exported Save.");
	return data;
}
function downloadSave(){
	download(exportSave(), 'mochaSpaceGameSave.txt', 'text/plain');
}

// other

function gameTick(){
}

function log(string){
	game.debug.log.push(string);
	console.log(string);
}

function redrawInterface(){
}

function saveGame(isManual = false){
	write_cookie("settings", game.settings);
	write_cookie("player", game.player);
	game.debug.lastSave = new Date();
	if (isManual){
		console.log("Successfully manually saved game!");
	}
}

// main only beyond here

function main(){
	game.debug = {};
	game.debug.loadTime = new Date();
	game.debug.log = [];
	game.debug.version = "a200329";
	// load settings
	if (read_cookie("settings")){
		game.settings = read_cookie("settings");
	}
	else{
		game.settings = {};
		game.settings.autosaveInterval = 30 * 1000;
		game.settings.fps = 20;
	}
	// load player
	if (read_cookie("player")){
		game.player = read_cookie("player");
	}
	else{
		game.player = {};
		game.player.buildings = [];
		game.player.snueg = 0;
		game.player.startTime = +new Date();
	}
	// set up ticks
	setInterval(redrawInterface, 1000/game.settings.fps);
	setInterval(gameTick, 1000/game.settings.fps);
	setInterval(saveGame, game.settings.autosaveInterval);
	// set up buildings
	document.getElementById("building_panel").innerHTML = "";
	for (var i = 0; i < game.buildings.length; i++){
		var building = game.buildings[i];
		building.addToDocument();
	}
	// save!!!
	saveGame();
}