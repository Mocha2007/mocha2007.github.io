/* jshint esversion: 6, strict: true, forin: false, loopfunc: true, strict: global */
/* exported importSave, downloadSave, createOrder, wipeMap, hardReset */
"use strict";

// https://stackoverflow.com/a/5574446/2579798
String.prototype.title = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

var objects = {};
var open = true;

function main(){
	// first, add everything in life_data to objects
	for (var i = 0; i < life_data.length; i++){
		// create DOM object
		var details = document.createElement("details");
		details.open = open;
		var rank = life_data[i].rank;
		details.classList.add(rank);
		var name = life_data[i].name;
		objects[name] = details;
		details.id = name;
		// title
		var title = document.createElement("summary");
		/* important
		if (life_data[i].hasOwnProperty('important') && life_data[i].important){
			var important = document.createElement("span");
			important.classList.add('important');
			important.innerHTML = '(!) ';
			title.appendChild(important);
		}
		*/
		var b = document.createElement('b');
		b.innerHTML = rank.title() + ' ';
		title.appendChild(b)
		var a = document.createElement('a');
		a.innerHTML = name.title();
		a.href = 'https://en.wikipedia.org/wiki/' + name.title();
		title.appendChild(a)
		details.appendChild(title);
		// desc
		if (life_data[i].hasOwnProperty('desc')){
			var desc = document.createElement("p");
			desc.innerHTML = life_data[i].desc;
			details.appendChild(desc);
		}
	}
	// next, nest everything accordingly. add * to root.
	for (var i = 0; i < life_data.length; i++){
		var name = life_data[i].name;
		console.log("Loading " + name + "...");
		var parent_id = life_data[i].parent;
		var child = objects[name];
		if (parent_id === '*'){
			var parent = document.getElementById('root');
		}
		else {
			var parent = objects[parent_id];
		}
		parent.appendChild(child);
	}
	console.log("Loaded.");
}