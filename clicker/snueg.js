/* jshint esversion: 6, strict: true, strict: global */
/* globals ages, life_data */
/* exported open_age, search_button, toggle, main */
"use strict";

// classes

class Building{
	constructor(name, base_price){
		this.name = name;
		this.base_price = base_price;
		this.amount = 0;
	}
	// functions
	get next_price(){
		return;
	}
	price_at(level){
		return Math.round(base_price * Math.pow(1.15, level));
	}
}

// constants

var game = {};
game.debug = {};
game.upgrades = [
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
		game.player.startTime = +new Date();
	}
	// set up ticks
	setInterval(redrawInterface, 1000/game.settings.fps);
	setInterval(gameTick, 1000/game.settings.fps);
	setInterval(saveGame, game.settings.autosaveInterval);
	// save!!!
	saveGame();
}