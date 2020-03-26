/* jshint esversion: 6, strict: true, forin: false, loopfunc: true, strict: global */
/* exported importSave, downloadSave, createOrder, wipeMap, hardReset */
"use strict";

// https://stackoverflow.com/a/5574446/2579798
String.prototype.title = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

var objects = {};

function main(){
	// first, add everything in life_data to objects
	for (var key of Object.keys(life_data)){
		var details = document.createElement("details");
		objects[key] = details;
		var title = document.createElement("summary");
		details.appendChild(title);
		title.innerHTML = key.title();
	}
	// next, nest everything accordingly. add * to root.
	for (var key of Object.keys(life_data)){
		var parent_id = life_data[key];
		var child = objects[key];
		if (parent_id === '*'){
			var parent = document.getElementById('root');
		}
		else {
			var parent = objects[parent_id];
		}
		parent.appendChild(child);
	}
	console.log("Loaded.")
}