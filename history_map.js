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
	var bottom_right_coords, coords, newlink, newpoint, period_specific_info, wants;
	document.getElementById("bigmap").innerHTML = '<img id="mapimg" src="'+map_src+'" width="'+mapsize+'">';
	wants = document.getElementById("date").value;
	features.forEach(function(x){
		period_specific_info = '';
		x.period_info.forEach(function(y){
			if ((wants < y.year_range[0]) || (y.year_range[1] < wants)){
				return false;
			}
			period_specific_info += '\n' + y.desc;
		});
		x.periods.forEach(function(y){
			if ((wants < y.year_range[0]) || (y.year_range[1] < wants)){
				return false;
			}
			// bigmap
			coords = coord2px(y.coords);
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
				bottom_right_coords = coord2px(y.bottom_right);
				newpoint.style.height = bottom_right_coords[0] - coords[0]+'px';
				newpoint.style.width = bottom_right_coords[1] - coords[1]+'px';
			}
			newpoint.style.backgroundColor = x.color;
			newpoint.alt = x.name;
			newpoint.title = x.name + '\n' + x.desc + period_specific_info; // + ' (' + range2dates(x.year_range) +
			newpoint.style.position = "absolute";
			newpoint.style.top = coords[0] + "px";
			newpoint.style.left = coords[1] + "px";
			newlink.appendChild(newpoint);
			document.getElementById("bigmap").appendChild(newlink);
		});
	});
}
// years start at 1 jan - so for america, since it didn't exist 1 jan 1776, it has to wait until 1 jan 1777
var features = [
	{
		name: "Ahrensburg Culture",
		type: "box",
		periods: [
			{
				year_range: [-10900, -9700],
				coords: [54, -2],
				bottom_right: [50, 17],
			},
		],
		period_info: [],
		desc: "",
		color: "black",
		source: "https://en.wikipedia.org/wiki/Ahrensburg_culture"
	},
	{
		name: "Baden Culture",
		type: "box",
		periods: [
			{
				year_range: [-3600, -2800],
				coords: [51, 12],
				bottom_right: [44, 24],
			},
		],
		period_info: [],
		desc: "",
		color: "#CFA7F8",
		source: "https://en.wikipedia.org/wiki/Baden_culture"
	},
	{
		name: "Beaker Culture",
		type: "box",
		periods: [
			{
				year_range: [-2800, -1800],
				coords: [58, -9],
				bottom_right: [35, 19],
			},
		],
		period_info: [],
		desc: "",
		color: "#FF7F27",
		source: "https://en.wikipedia.org/wiki/Beaker_culture"
	},
	{
		name: "Corded Ware Culture",
		type: "box",
		periods: [
			{
				year_range: [-2900, -2350],
				coords: [59, 4],
				bottom_right: [47, 31],
			},
		],
		period_info: [],
		desc: "",
		color: "#F97474",
		source: "https://en.wikipedia.org/wiki/Corded_Ware_culture"
	},
	{
		name: "Funnelbeaker Culture",
		type: "box",
		periods: [
			{
				year_range: [-5300, -3950],
				coords: [59, 8],
				bottom_right: [53, 15],
			},
		],
		period_info: [],
		desc: "",
		color: "red",
		source: "https://en.wikipedia.org/wiki/Funnelbeaker_culture"
	},
	{
		name: "Globular Amphora Culture",
		type: "box",
		periods: [
			{
				year_range: [-3400, -2800],
				coords: [55, 8],
				bottom_right: [47, 30],
			},
		],
		period_info: [],
		desc: "",
		color: "#FDBAAF",
		source: "https://en.wikipedia.org/wiki/Globular_Amphroa_culture"
	},
	{
		name: "United States",
		type: "box",
		periods: [
			{
				year_range: [1777, 1803],
				coords: [48, -95],
				bottom_right: [30, -65],
			}, // + louisiana
			{
				year_range: [1804, 1819],
				coords: [48, -114],
				bottom_right: [29, -65],
			}, // + oregon
			{
				year_range: [1820, 1821],
				coords: [48, -124],
				bottom_right: [29, -65],
			}, // + florida
			{
				year_range: [1822, 9999],
				coords: [48, -124],
				bottom_right: [24, -65],
			},
		],
		period_info: [
			{ // Trump
				year_range: [2018, 2026],
				desc: 'President: Donald Trump',
			},
		],
		desc: "Country",
		color: "blue",
		source: "https://en.wikipedia.org/wiki/United_States"
	},
	{
		name: "Yamna Culture",
		type: "box",
		periods: [
			{
				year_range: [-3300, -2600],
				coords: [52, 30],
				bottom_right: [43, 51],
			},
		],
		period_info: [],
		desc: "",
		color: "#F8F885",
		source: "https://en.wikipedia.org/wiki/Yamnaya_culture"
	},
	// POINTS
	/*{
		name: "Funnelbeaker Culture",
		type: "point",
		periods: [
			{
				year_range: [-4300, -2800],
				coords: [55, 12],
			},
		],
		period_info: [],
		desc: "",
		color: "black",
		source: "https://en.wikipedia.org/wiki/Funnelbeaker_culture"
	},*/
];