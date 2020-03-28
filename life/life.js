/* jshint esversion: 6, strict: true, forin: false, loopfunc: true, strict: global */
/* exported importSave, downloadSave, createOrder, wipeMap, hardReset */
"use strict";

// https://stackoverflow.com/a/5574446/2579798
String.prototype.title = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

var ages = [
	{
		'start': 4600,
		'name': 'Hadean',
	},
	{
		'start': 4000,
		'name': 'Archean',
	},
	{
		'start': 2500,
		'name': 'Paleoproterozoic',
	},
	{
		'start': 1600,
		'name': 'Mesoproterozoic',
	},
	{
		'start': 1000,
		'name': 'Tonian',
	},
	{
		'start': 720,
		'name': 'Cryogenian',
	},
	{
		'start': 635,
		'name': 'Ediacrian',
	},
	{
		'start': 541,
		'name': 'Cambrian',
	},
	{
		'start': 485.4,
		'name': 'Ordovician',
	},
	{
		'start': 443.8,
		'name': 'Silurian',
	},
	{
		'start': 419.2,
		'name': 'Devonian',
	},
	{
		'start': 358.9,
		'name': 'Carboniferous',
	},
	{
		'start': 298.9,
		'name': 'Permian',
	},
	{
		'start': 251.902,
		'name': 'Triassic',
	},
	{
		'start': 201.3,
		'name': 'Jurassic',
	},
	{
		'start': 145,
		'name': 'Cretaceous',
	},
	{
		'start': 66,
		'name': 'Paleogene',
	},
	{
		'start': 23.03,
		'name': 'Neogene',
	},
	{
		'start': 2.58,
		'name': 'Quaternary',
	},
];
var objects = {}; // string -> DOM object map
var open = false; // default setting
var regions = {
	'WW': 'Worldwide',
		'AN': 'Antarctica',
		'NW': 'New World',
			'NA': 'North America',
			'SA': 'South America',
		'OC': 'Oceania',
		'OW': 'Old World',
			'AF': 'Africa',
			'EA': 'Eurasia',
				'AS': 'Asia',
				'EU': 'Europe',
		// alternatively
		'NH': 'Northern Hemisphere',
		'EQ': 'Equatorial Regions',
		'SH': 'Southern Hemisphere',
		// oceans
		'AL': 'Atlantic',
	'XX': 'Extinct',
};

// helper functions

function get_age(age){
	if (1 < age){
		return age + ' mya';
	}
		return age*1000 + ' kya';
}

function get_era(age){
	// console.log('get_era', age);
	for (var i = 0; i < ages.length; i++){
		if (ages[i].start < age){
			return ages[i-1].name;
		}
	}
	return ages[ages.length-1].name;
}

function is_important(i){
	// console.log('is_important', i, life_data[i]);
	return life_data[i].hasOwnProperty('important') && life_data[i].important;
}

function open_age(age){
	// open all clades older than age mya
	for (var i = 0; i < life_data.length; i++){
		var clade = life_data[i]
		if (clade.hasOwnProperty('age') && age < clade.age){
			open_parents(objects[clade.name]);
		}
	}
}

function open_parents(object){
	// console.log('open_parents', object);
	// open object
	object.open = true;
	// get parent
	var parent = object.parentElement;
	// if parent === details then call for parent
	if (parent.tagName === 'DETAILS'){
		open_parents(parent);
	}
}

function refresh_buttons(){
	document.getElementById('toggle_button_inner').innerHTML = open ? 'Close' : 'Open';
}

function search(string){
	var indices = [];
	// return all life_data indices matching search string
	for (var i = 0; i < life_data.length; i++){
		// if name or desc contains string
		if ((life_data[i].hasOwnProperty('name') && life_data[i].name.includes(string)) ||
			(life_data[i].hasOwnProperty('desc') && life_data[i].desc.includes(string))){
			indices.push(i);
		}
	}
	return indices;
}

function search_button(){
	var search_string = document.getElementById('search_clade').value;
	// clear results
	document.getElementById("results").innerHTML = "";
	search(search_string).forEach((i) => {
		var name = life_data[i].name;
		// open element
		open_parents(objects[name]);
		// show result
		var li = document.createElement("li");
		li.value = i;
		if (name.includes(search_string)){
			li.innerHTML = name.replace(new RegExp(search_string, "g"), "<b>" + search_string + "</b>");
		}
		else {
			li.innerHTML = name + " (matched description)";
		}
		document.getElementById('results').appendChild(li);
	});
}

function toggle(){
	// make everything closed or open (toggle)
	open = !open;
	refresh_buttons();
	var elements = document.getElementsByTagName("DETAILS");
	for (var i = 0; i < elements.length; i++){
		elements[i].open = open;
	}
}

// main program

function main(){
	// print appropriate text to toggle button
	refresh_buttons();
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
		if (is_important(i)){
			var important = document.createElement("span");
			important.classList.add('important');
			important.innerHTML = '(!) ';
			title.appendChild(important);
		}
		*/
		// rank
		var b = document.createElement('b');
		b.innerHTML = rank.title() + ' ';
		title.appendChild(b)
		// extinct?
		if (life_data[i].hasOwnProperty('extinct') && life_data[i].hasOwnProperty('extinct')){
			title.innerHTML += '&dagger; ';
		}
		// name
		var a = document.createElement('a');
		a.innerHTML = name.title();
		a.href = 'https://en.wikipedia.org/wiki/' + name.title();
		title.appendChild(a)
		// range
		if (life_data[i].hasOwnProperty('range')){
			var range_abbr = life_data[i].range.toUpperCase();
			title.innerHTML += ' ';
			var range = document.createElement('abbr');
			range.classList.add('range');
			range.title = regions[range_abbr];
			range.innerHTML = range_abbr;
			title.appendChild(range);
		}
		// age
		if (life_data[i].hasOwnProperty('age')){
			var a = life_data[i].age; // mya
			title.innerHTML += ' ';
			var age = document.createElement('abbr');
			age.classList.add('age');
			age.title = get_era(a);
			age.innerHTML = get_age(a);
			title.appendChild(age);
		}
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
	// next, if important, open every parent
	for (var i = 0; i < life_data.length; i++){
		if (is_important(i)){
			open_parents(objects[life_data[i].name]);
		}
	}
	console.log("Loaded.");
}