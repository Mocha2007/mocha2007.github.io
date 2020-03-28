/* jshint esversion: 6, strict: true, strict: global */
/* globals ages, life_data */
/* exported open_age, search_button, toggle, main */
"use strict";

// https://stackoverflow.com/a/196991/2579798
function toTitleCase(str) {
	return str.replace(
		/\w\S*/g,
		function(txt) {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		}
	);
}

var objects = {}; // string -> DOM object map
var open_setting = false; // default setting
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

function get_era(age, age_list = ages, depth = 0){
	var i;
	var names = ['eon', 'era', 'period', 'epoch', 'age'];
	/* console.log(
		age,
		age_list,
		depth
	); */
	for (i = 1; i < age_list.length; i++){
		if (age_list[i].start < age){
			break;
		}
	}
	/* console.log(
		' =>',
		age_list[i-1].name,
		age_list[i-1].type,
		age_list[i-1].hasOwnProperty('divisions')
	); */
	return (age_list[i-1].hasOwnProperty('divisions') ?  get_era(age, age_list[i-1].divisions, depth+1) + ', ' : '') +
	age_list[i-1].name + ' ' + names[depth];
}

function is_important(i){
	// console.log('is_important', i, life_data[i]);
	return life_data[i].hasOwnProperty('important') && life_data[i].important;
}

function open_age(age){
	// open all clades older than age mya
	for (var i = 0; i < life_data.length; i++){
		var clade = life_data[i];
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
	document.getElementById('toggle_button_inner').innerHTML = open_setting ? 'Close' : 'Open';
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
	open_setting = !open_setting;
	refresh_buttons();
	var elements = document.getElementsByTagName("DETAILS");
	for (var i = 0; i < elements.length; i++){
		elements[i].open = open_setting;
	}
}

// main program

function main(){
	var i, name;
	// print appropriate text to toggle button
	refresh_buttons();
	// first, add everything in life_data to objects
	for (i = 0; i < life_data.length; i++){
		// create DOM object
		var details = document.createElement("details");
		details.open = open_setting;
		var rank = life_data[i].rank;
		details.classList.add(rank);
		name = life_data[i].name;
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
		b.innerHTML = toTitleCase(rank) + ' ';
		title.appendChild(b);
		// extinct?
		if (life_data[i].hasOwnProperty('extinct') && life_data[i].hasOwnProperty('extinct')){
			title.innerHTML += '&dagger; ';
		}
		// name
		var a = document.createElement('a');
		a.innerHTML = toTitleCase(name);
		a.href = 'https://en.wikipedia.org/wiki/' + toTitleCase(name);
		title.appendChild(a);
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
			a = life_data[i].age; // mya
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
	for (i = 0; i < life_data.length; i++){
		name = life_data[i].name;
		console.log("Loading " + name + "...");
		var parent_id = life_data[i].parent;
		var child = objects[name];
		var parent = document.getElementById('root');
		if (parent_id !== '*'){
			parent = objects[parent_id];
		}
		parent.appendChild(child);
	}
	// next, if important, open every parent
	for (i = 0; i < life_data.length; i++){
		if (is_important(i)){
			open_parents(objects[life_data[i].name]);
		}
	}
	console.log("Loaded.");
}