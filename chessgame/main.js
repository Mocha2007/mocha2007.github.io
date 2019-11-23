/* jshint esversion: 6, strict: true, forin: false, loopfunc: true, strict: global */
/* exported importSave, downloadSave, createOrder, wipeMap, hardReset */
"use strict";
var Game = {};

function main(){
	console.info("Mocha's weird-ass chess test");
	makeBoard();
	// set up ticks
	setInterval(reloadNotes, 1000);
}

function makeBoard(){
}

function reloadNotes(){
}

document.onload = function(){main();};