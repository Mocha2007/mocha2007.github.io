var map_src = 'https://upload.wikimedia.org/wikipedia/commons/5/51/BlankMap-Equirectangular.svg';
var pointsize = 8;
var mapsize = window.innerWidth - 32;

function range(n){
	return [...Array(n).keys()];
}

function coord2px(coords){
	"use strict";
	var x = coords[1] * mapsize/360 + mapsize/2 - pointsize/2;
	var y = coords[0] * -mapsize/360 + mapsize/4 - pointsize/2;
	return [y,x];
}

function int2date(int){
	"use strict";
	if (int < 0){
		int = -int;
		int += ' BCE';
	}
	return int;
}

function range2dates(r){
	"use strict";
	var begin = int2date(r[0]) == '9999 BCE' ? '' : int2date(r[0]);
	var end = int2date(r[1]) == 9999 ? '' : int2date(r[1]);
	return begin + '-' +end;
}

function bigmap(){
	"use strict";
	var bottom_right_coords, coords, newlink, newpoint, wants;
	document.getElementById("bigmap").innerHTML = '<img id="mapimg" src="'+map_src+'" width="'+mapsize+'">';
	features.forEach(function(x){
		wants = document.getElementById("date").value;
		if ((wants < x.year_range[0]) || (x.year_range[1] < wants)){
			return false;
		}
		// bigmap
		coords = coord2px(x.coords);
		newlink = document.createElement("a");
		newlink.href = x.source;
		newpoint = document.createElement("div");
		if (x.type == 'point'){
			newpoint.classList.value = "point";
			newpoint.style.height = pointsize+'px';
			newpoint.style.width = pointsize+'px';
		}
		else {
			newpoint.classList.value = "box";
			bottom_right_coords = coord2px(x.bottom_right);
			newpoint.style.height = bottom_right_coords[0] - coords[0]+'px';
			newpoint.style.width = bottom_right_coords[1] - coords[1]+'px';
		}
		newpoint.style.backgroundColor = x.color;
		newpoint.alt = x.name;
		newpoint.title = x.name + '\n' + x.desc; // + ' (' + range2dates(x.year_range) +
		newpoint.style.position = "absolute";
		newpoint.style.top = coords[0] + "px";
		newpoint.style.left = coords[1] + "px";
		newlink.appendChild(newpoint);
		document.getElementById("bigmap").appendChild(newlink);
	});
}

var features = [
	/*{
		name: "Ainu",
		type: "point",
		color: "red",
		coords: [43, 142],
		year_range: [0, 9999], // lower bound total guess
		source: "https://en.wikipedia.org/wiki/Ainu_language"
	},*/
	{ // Original Territory
		name: "United States",
		type: "box",
		coords: [48, -95],
		bottom_right: [30, -65],
		year_range: [1776, 1803],
		desc: "Country",
		color: "blue",
		source: "https://en.wikipedia.org/wiki/United_States"
	},
	{ // + Louisiana
		name: "United States",
		type: "box",
		coords: [48, -114],
		bottom_right: [29, -65],
		year_range: [1804, 1818],
		desc: "Country",
		color: "blue",
		source: "https://en.wikipedia.org/wiki/United_States"
	},
	{ // + Oregon
		name: "United States",
		type: "box",
		coords: [48, -124],
		bottom_right: [29, -65],
		year_range: [1819, 1820],
		desc: "Country",
		color: "blue",
		source: "https://en.wikipedia.org/wiki/United_States"
	},
	{ // + Florida
		name: "United States",
		type: "box",
		coords: [48, -124],
		bottom_right: [24, -65],
		year_range: [1821, 9999],
		desc: "Country",
		color: "blue",
		source: "https://en.wikipedia.org/wiki/United_States"
	}
];