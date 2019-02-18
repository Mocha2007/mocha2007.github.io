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
		name: "Afanasievo Culture",
		type: "box",
		periods: [
			{
				year_range: [-3300, -2500],
				coords: [54, 73],
				bottom_right: [46, 94],
			},
		],
		period_info: [],
		desc: "",
		color: "red",
		source: "https://en.wikipedia.org/wiki/Afanasievo_culture"
	},
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
		name: "Bactria-Margiana Archaeological Complex",
		type: "box",
		periods: [
			{
				year_range: [-2300, -1700],
				coords: [40, 59],
				bottom_right: [36, 68],
			},
		],
		period_info: [],
		desc: "",
		color: "orange",
		source: "https://en.wikipedia.org/wiki/Bactria–Margiana_Archaeological_Complex"
	},
	{
		name: "Boian Culture",
		type: "box",
		periods: [
			{
				year_range: [-4300, -3500],
				coords: [45, 23],
				bottom_right: [40, 28],
			},
		],
		period_info: [],
		desc: "",
		color: "yellow",
		source: "https://en.wikipedia.org/wiki/Boian_culture"
	},
	{
		name: "Cardium Pottery Culture",
		type: "box",
		periods: [
			{
				year_range: [-6400, -5500],
				coords: [46, -2],
				bottom_right: [38, 22],
			},
		],
		period_info: [],
		desc: "",
		color: "green",
		source: "https://en.wikipedia.org/wiki/Cardium_pottery"
	},
	{
		name: "Catacomb Culture",
		type: "box",
		periods: [
			{
				year_range: [-2800, -2200],
				coords: [52, 31],
				bottom_right: [43, 42],
			},
		],
		period_info: [],
		desc: "",
		color: "black",
		source: "https://en.wikipedia.org/wiki/Catacomb_culture"
	},
	{
		name: "Comb Ceramic Culture",
		type: "box",
		periods: [
			{
				year_range: [-4200, -2000],
				coords: [62, 21],
				bottom_right: [54, 35],
			},
		],
		period_info: [],
		desc: "",
		color: "purple",
		source: "https://en.wikipedia.org/wiki/Pit–Comb_Ware_culture"
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
		name: "Dimini Culture",
		type: "box",
		periods: [
			{
				year_range: [-5000, -4400],
				coords: [40, 21],
				bottom_right: [34, 27],
			},
		],
		period_info: [],
		desc: "",
		color: "teal",
		source: "https://en.wikipedia.org/wiki/Dimini#History"
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
		name: "Hamangia Culture",
		type: "box",
		periods: [
			{
				year_range: [-5250, -4500],
				coords: [45, 27],
				bottom_right: [40, 30],
			},
		],
		period_info: [],
		desc: "",
		color: "yellow",
		source: "https://en.wikipedia.org/wiki/Hamangia_culture"
	},
	{
		name: "Indus Valley Civilization",
		type: "box",
		periods: [
			{
				year_range: [-3300, -1300],
				coords: [32, 64],
				bottom_right: [20, 78],
			},
		],
		period_info: [],
		desc: "",
		color: "brown",
		source: "https://en.wikipedia.org/wiki/Indus_Valley_Civilisation"
	},
	{
		name: "Poltavka Culture",
		type: "box",
		periods: [
			{
				year_range: [-2700, -2100],
				coords: [53, 44],
				bottom_right: [46, 50],
			},
		],
		period_info: [],
		desc: "",
		color: "purple",
		source: "https://en.wikipedia.org/wiki/Poltavka_culture"
	},
	{
		name: "Samarra Culture",
		type: "box",
		periods: [
			{
				year_range: [-5500, -4800],
				coords: [36, 41],
				bottom_right: [31, 48],
			},
		],
		period_info: [],
		desc: "",
		color: "green",
		source: "https://en.wikipedia.org/wiki/Samarra_culture"
	},
	{
		name: "Srubnaya Culture",
		type: "box",
		periods: [
			{
				year_range: [-1800, -1200],
				coords: [52, 33],
				bottom_right: [43, 50],
			},
		],
		period_info: [],
		desc: "",
		color: "brown",
		source: "https://en.wikipedia.org/wiki/Srubnaya_culture"
	},
	{
		name: "Sumer",
		type: "box",
		periods: [
			{
				year_range: [-4500, -1900],
				coords: [34, 41],
				bottom_right: [30, 48],
			},
		],
		period_info: [],
		desc: "Mesopotamian Civilization",
		color: "teal",
		source: "https://en.wikipedia.org/wiki/Sumer"
	},
	{
		name: "Swiderian Culture",
		type: "box",
		periods: [
			{
				year_range: [-9000, -6200],
				coords: [56, 15],
				bottom_right: [48, 31],
			},
		],
		period_info: [],
		desc: "",
		color: "black",
		source: "https://en.wikipedia.org/wiki/Swiderian_culture"
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
		name: "Vinča Culture",
		type: "box",
		periods: [
			{
				year_range: [-5700, -4500],
				coords: [47, 18],
				bottom_right: [41, 26],
			},
		],
		period_info: [],
		desc: "",
		color: "lavender",
		source: "https://en.wikipedia.org/wiki/Vinča_culture"
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
	{
		name: "Assur",
		type: "point",
		periods: [
			{
				year_range: [-2500, 1400],
				coords: [35, 43],
			},
		],
		period_info: [],
		desc: "",
		color: "red",
		source: "https://en.wikipedia.org/wiki/Assur"
	},
	{
		name: "Babylon",
		type: "point",
		periods: [
			{
				year_range: [-1894, 1000],
				coords: [33, 44],
			},
		],
		period_info: [],
		desc: "",
		color: "red",
		source: "https://en.wikipedia.org/wiki/Babylon"
	},
	{
		name: "Ganweriwal",
		type: "point",
		periods: [
			{
				year_range: [-2500, -1900], // latter is an estimate
				coords: [29, 71],
			},
		],
		period_info: [],
		desc: "",
		color: "red",
		source: "https://en.wikipedia.org/wiki/Ganweriwal"
	},
	{
		name: "Harappa",
		type: "point",
		periods: [
			{
				year_range: [-2600, -1300],
				coords: [31, 73],
			},
		],
		period_info: [],
		desc: "",
		color: "red",
		source: "https://en.wikipedia.org/wiki/Harappa"
	},
	{
		name: "Hattusa",
		type: "point",
		periods: [
			{
				year_range: [-6000, -1200],
				coords: [40, 35],
			},
		],
		period_info: [],
		desc: "",
		color: "red",
		source: "https://en.wikipedia.org/wiki/Hattusa"
	},
	{
		name: "Mehrgarh",
		type: "point",
		periods: [
			{
				year_range: [-7000, -2600],
				coords: [29, 67],
			},
		],
		period_info: [],
		desc: "",
		color: "red",
		source: "https://en.wikipedia.org/wiki/Mehrgarh"
	},
	{
		name: "Mohenjo-daro",
		type: "point",
		periods: [
			{
				year_range: [-2500, -1900],
				coords: [27, 68],
			},
		],
		period_info: [],
		desc: "",
		color: "red",
		source: "https://en.wikipedia.org/wiki/Mohenjo-daro"
	},
	{
		name: "Troy",
		type: "point",
		periods: [
			{
				year_range: [-3000, 500],
				coords: [40, 26],
			},
		],
		period_info: [
			{
				year_range: [-3000, -2600],
				desc: 'Troy I',
			},
			{
				year_range: [-2600, -2250],
				desc: 'Troy II',
			},
			{
				year_range: [-2250, -2100],
				desc: 'Troy III',
			},
			{
				year_range: [-2100, -1950],
				desc: 'Troy IV',
			},
			{
				year_range: [-1950, -1800],
				desc: 'Troy V',
			},
			{
				year_range: [-1800, -1500],
				desc: 'Troy VI',
			},
			{
				year_range: [-1500, -1400],
				desc: 'Troy VIh',
			},
			{
				year_range: [-1300, -1190],
				desc: 'Troy VIIa',
			},
			{
				year_range: [-1190, -1100],
				desc: 'Troy VIIb1',
			},
			{
				year_range: [-1100, -1000],
				desc: 'Troy VIIb2',
			},
			{
				year_range: [-1000, -950],
				desc: 'Troy VIIb3',
			},
			{
				year_range: [-950, -85],
				desc: 'Troy VIII',
			},
			{
				year_range: [-85, 500],
				desc: 'Troy IX',
			},
		],
		desc: "",
		color: "red",
		source: "https://en.wikipedia.org/wiki/Troy"
	},
	{
		name: "Ur",
		type: "point",
		periods: [
			{
				year_range: [-3800, -500],
				coords: [31, 46],
			},
		],
		period_info: [],
		desc: "",
		color: "red",
		source: "https://en.wikipedia.org/wiki/Ur"
	},
	{
		name: "Uruk",
		type: "point",
		periods: [
			{
				year_range: [-4000, 700],
				coords: [31, 46],
			},
		],
		period_info: [],
		desc: "",
		color: "red",
		source: "https://en.wikipedia.org/wiki/Uruk"
	},
	{
		name: "Yaz Culture",
		type: "point",
		periods: [
			{
				year_range: [-1500, -500],
				coords: [38, 58],
			},
		],
		period_info: [],
		desc: "",
		color: "black",
		source: "https://en.wikipedia.org/wiki/Yaz_culture"
	},
];