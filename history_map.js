var map_src = 'https://upload.wikimedia.org/wikipedia/commons/5/51/BlankMap-Equirectangular.svg';
var euromap_src = 'https://upload.wikimedia.org/wikipedia/commons/9/90/Europe_satellite_image_location_map.jpg';
var pointsize = 6;
var mapsize = window.innerWidth - 32;
var euromapcoords = [
	[72, -25], // ULHC
	[34,  60]  // BRHC
];
var maps = [
	['bigmap'],
	['bigeuromap', euromapcoords, 1.5, 2390],
]

function range(n){
	return [...Array(n).keys()];
}

function uncorrected_coord2px(coords){
	"use strict";
	var x = coords[1] * mapsize/360 + mapsize/2;
	var y = coords[0] * -mapsize/360 + mapsize/4;
	return [y,x];
}

function inset_coord2px(coords, selected_map){
	"use strict";
	var inset_coords = selected_map[1];
	var longitudes = inset_coords[1][1] - inset_coords[0][1]
	var latitudes = inset_coords[0][0] - inset_coords[1][0]
	var x = (coords[1] - inset_coords[0][1]) * mapsize/longitudes;
	var y = (inset_coords[0][1] - coords[0]) * mapsize/latitudes/selected_map[2] + selected_map[3];
	return [y,x];
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
	var begin = int2date(r[0]) === '9999 BCE' ? '' : int2date(r[0]);
	var end = int2date(r[1]) === 9999 ? '' : int2date(r[1]);
	return begin + '-' +end;
}

function tooltip(id){ // todo fix for inset
	"use strict";
	// console.log(id);
	// bigmap
	var newpoint = document.createElement("div");
	var y = id.periods[0];
	var coords = [window.event.clientY, window.event.clientX];
	console.log(coords);
	newpoint.id = "current_tooltip";
	newpoint.style.top = coords[0]-25 + "px";
	newpoint.style.left = coords[1]+25 + "px";
	newpoint.style.position = "fixed";
	// text
	newpoint.innerHTML = '<center><b>' + id.name + '</b></center>';
	if (id.hasOwnProperty('img')){
		newpoint.innerHTML += '<center><img src="'+id.img+'" height="100px"></center>';
	}
	if (id.hasOwnProperty('desc')){
		newpoint.innerHTML += id.desc;
	}
	// final
	document.getElementById('tooltip').appendChild(newpoint);
}

function bigmap(){
	"use strict";
	var bottom_right_coords, coords, newlink, newpoint, period_specific_info;
	var wants = document.getElementById("date").value;
	document.getElementById("bigmap").innerHTML = '<img id="mapimg" src="'+map_src+'" width="'+mapsize+'">';
	document.getElementById("bigeuromap").innerHTML = '<img id="euromapimg" src="'+euromap_src+'" width="'+mapsize+'">';
	features.forEach(function(x){
		period_specific_info = '';
		x.period_info.forEach(function(y){
			if ((wants < y.year_range[0]) || (y.year_range[1] < wants)){
				return false;
			}
			period_specific_info += '\n' + y.desc;
		});
		x.periods.forEach(function(y){
			maps.forEach(function(selected_map){
				if ((wants < y.year_range[0]) || (y.year_range[1] < wants)){
					return false;
				}
				// bottom of minimap cutoff
				if (selected_map[1] !== undefined){
					// console.log(y.coords[0], selected_map[1][1][0]);
					if ((y.coords[0] < selected_map[1][1][0]) || (selected_map[1][1][1] < y.coords[1])){
						return false;
					}
				}
				// bigmap
				newlink = document.createElement("a");
				newlink.href = x.source;
				newpoint = document.createElement("div");
				if (x.type === 'point'){
					newpoint.classList.value = "point";
					if (selected_map[1] === undefined){
						coords = coord2px(y.coords);
					}
					else {
						coords = inset_coord2px(y.coords, selected_map);
					}
					newpoint.style.height = pointsize+'px';
					newpoint.style.width = pointsize+'px';
				}
				else {
					newpoint.classList.value = "box";
					if (selected_map[1] === undefined){
						coords = uncorrected_coord2px(y.coords);
						bottom_right_coords = uncorrected_coord2px(y.bottom_right);
					}
					else {
						coords = inset_coord2px(y.coords, selected_map);
						bottom_right_coords = inset_coord2px(y.bottom_right, selected_map);
					}
					newpoint.style.height = bottom_right_coords[0] - coords[0]+'px';
					newpoint.style.width = bottom_right_coords[1] - coords[1]+'px';
				}
				newpoint.style.backgroundColor = x.color;
				// newpoint.title = x.name + '\n' + x.desc + period_specific_info; // + ' (' + range2dates(x.year_range) +
				newpoint.style.position = "absolute";
				newpoint.style.top = coords[0] + "px";
				newpoint.style.left = coords[1] + "px";
				// tooltip
				// console.log(coords);
				newpoint.onmouseover = () => tooltip(x);
				newpoint.onmouseout = () => document.getElementById("current_tooltip").outerHTML = "";
				// final
				newlink.appendChild(newpoint);
				document.getElementById(selected_map[0]).appendChild(newlink);
			});
		});
	});
}
// years start at 1 jan - so for america, since it didn't exist 1 jan 1776, it has to wait until 1 jan 1777
var features = [
	// these need to be out of order because they block other regions
	{
		name: "Urnfield Culture",
		type: "box",
		periods: [
			{
				year_range: [-1300, -750],
				coords: [55, -1],
				bottom_right: [40, 22],
			},
		],
		period_info: [],
		color: "yellow",
		source: "https://en.wikipedia.org/wiki/Urnfield_culture"
	},
	// alphabetical order
	{
		name: "A-Group Culture",
		type: "box",
		periods: [
			{
				year_range: [-3800, -3100],
				coords: [24, 31],
				bottom_right: [21, 33],
			},
		],
		period_info: [],
		color: "pink",
		source: "https://en.wikipedia.org/wiki/A-Group_culture"
	},
	{
		name: "Abashevo Culture",
		type: "box",
		periods: [
			{
				year_range: [-2500, -1900],
				coords: [59, 48],
				bottom_right: [53, 57],
			},
		],
		period_info: [],
		color: "green",
		source: "https://en.wikipedia.org/wiki/Abashevo_culture"
	},
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
		color: "black",
		source: "https://en.wikipedia.org/wiki/Ahrensburg_culture"
	},
	{
		name: "Akkadian Empire",
		type: "box",
		periods: [
			{
				year_range: [-2334, -2154],
				coords: [38, 38],
				bottom_right: [30, 48],
			},
		],
		period_info: [],
		desc: "Mesopotamian Civilization",
		color: "brown",
		source: "https://en.wikipedia.org/wiki/Akkadian_Empire"
	},
	{
		name: "Anarta Culture",
		type: "box",
		periods: [
			{
				year_range: [-3950, -1900],
				coords: [25, 68],
				bottom_right: [20, 74],
			},
		],
		period_info: [],
		color: "green",
		source: "https://en.wikipedia.org/wiki/Anarta_tradition"
	},
	{
		name: "Aurignacian Culture",
		type: "box",
		periods: [
			{
				year_range: [-41000, -26000],
				coords: [52, -10],
				bottom_right: [36, 37],
			},
		],
		period_info: [],
		color: "red",
		source: "https://en.wikipedia.org/wiki/Aurignacian"
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
		color: "#CFA7F8",
		img: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Museum_für_Vor-_und_Frühgeschichte_Berlin_034.jpg",
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
		color: "#FF7F27",
		source: "https://en.wikipedia.org/wiki/Beaker_culture"
	},
	{
		name: "Babylonia",
		type: "box",
		periods: [
			{
				year_range: [-1895, -539],
				coords: [38, 38],
				bottom_right: [30, 48],
			},
		],
		period_info: [],
		desc: "Mesopotamian Civilization",
		color: "gold",
		source: "https://en.wikipedia.org/wiki/Babylonia"
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
		color: "yellow",
		source: "https://en.wikipedia.org/wiki/Boian_culture"
	},
	{
		name: "Bolshemys Culture",
		type: "box",
		periods: [
			{
				year_range: [-4000, -3000],
				coords: [50, 80],
				bottom_right: [43, 98],
			},
		],
		period_info: [],
		color: "blue",
		source: "https://en.wikipedia.org/wiki/Bolshemys_culture"
	},
	{
		name: "C-Group Culture",
		type: "box",
		periods: [
			{
				year_range: [-2400, -1550],
				coords: [20, 30],
				bottom_right: [18, 34],
			},
		],
		period_info: [],
		color: "pink",
		source: "https://en.wikipedia.org/wiki/C-Group_culture"
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
		color: "black",
		source: "https://en.wikipedia.org/wiki/Catacomb_culture"
	},
	{
		name: "Clovis Culture",
		type: "box",
		periods: [
			{
				year_range: [-11200, -10900],
				coords: [49, -126],
				bottom_right: [7, -78],
			},
		],
		period_info: [],
		color: "cyan",
		source: "https://en.wikipedia.org/wiki/Clovis_culture"
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
		color: "purple",
		img: "https://upload.wikimedia.org/wikipedia/commons/d/d6/CombCeramicPottery.jpg",
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
		color: "#F97474",
		source: "https://en.wikipedia.org/wiki/Corded_Ware_culture"
	},
	{
		name: "Dacians",
		type: "box",
		periods: [
			{
				year_range: [-1000, 106], // estimate
				coords: [48.4, 19.7],
				bottom_right: [43.2, 30.8],
			},
		],
		period_info: [],
		desc: "Indo-European tribe",
		color: "slateblue",
		img: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Costantino_Dacia.JPG",
		source: "https://en.wikipedia.org/wiki/Dacians"
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
		color: "teal",
		source: "https://en.wikipedia.org/wiki/Dimini#History"
	},
	{
		name: "Elam",
		type: "box",
		periods: [
			{
				year_range: [-2700, -539],
				coords: [34, 48],
				bottom_right: [27, 55],
			},
		],
		period_info: [],
		desc: "Pre-Iranian Civilization",
		color: "orange",
		source: "https://en.wikipedia.org/wiki/Elam"
	},
	{
		name: "Erligang Culture",
		type: "box",
		periods: [
			{
				year_range: [-1510, -1460],
				coords: [39, 108],
				bottom_right: [30, 118],
			},
		],
		period_info: [],
		color: "teal",
		source: "https://en.wikipedia.org/wiki/Erligang_culture"
	},
	{
		name: "Erlitou Culture",
		type: "box",
		periods: [
			{
				year_range: [-1900, -1500],
				coords: [36, 108],
				bottom_right: [33, 116],
			},
		],
		period_info: [],
		color: "teal",
		source: "https://en.wikipedia.org/wiki/Erlitou_culture"
	},
	{
		name: "Fatyanovo-Balanovo Culture",
		type: "box",
		periods: [
			{
				year_range: [-3200, -2300],
				coords: [58, 31],
				bottom_right: [52, 53],
			},
		],
		period_info: [],
		color: "pink",
		source: "https://en.wikipedia.org/wiki/Fatyanovo–Balanovo_culture"
	},
	{
		name: "Egypt",
		type: "box",
		periods: [
			{
				year_range: [-3150, -30],
				coords: [32, 25],
				bottom_right: [22, 36],
			},
			{
				year_range: [868, 905],
				coords: [37, 23],
				bottom_right: [23, 39],
			},
			{
				year_range: [935, 969],
				coords: [37, 20],
				bottom_right: [12, 39],
			},
		],
		period_info: [
			{
				year_range: [-3150, -2686],
				desc: "Early Dynastic Period",
			},
			{
				year_range: [-2686, -2181],
				desc: "Old Kingdom",
			},
			{
				year_range: [-2181, -2055],
				desc: "First Intermediate Period",
			},
			{
				year_range: [-2055, -1650],
				desc: "Middle Kingdom",
			},
			{
				year_range: [-1650, -1550],
				desc: "Second Intermediate Period",
			},
			{
				year_range: [-1550, -1069],
				desc: "New Kingdom",
			},
			{
				year_range: [-1069, -664],
				desc: "Third Intermediate Period",
			},
			{
				year_range: [-664, -332],
				desc: "Late Period",
			},
			{
				year_range: [-305, -30],
				desc: "Ptolemaic Kingdom",
			},
			{
				year_range: [868, 905],
				desc: "Ṭūlūnid",
			},
			{
				year_range: [935, 969],
				desc: "Ikhshidid",
			},
		],
		desc: "North African Civilization",
		color: "red",
		source: "https://en.wikipedia.org/wiki/Egypt"
	},
	{
		name: "Ertebølle Culture",
		type: "box",
		periods: [
			{
				year_range: [-5300, -3950],
				coords: [59, 8],
				bottom_right: [53, 15],
			},
		],
		period_info: [],
		color: "red",
		source: "https://en.wikipedia.org/wiki/Ertebølle_culture"
	},
	{
		name: "Etruria",
		type: "box",
		periods: [
			{
				year_range: [-750, -290],
				coords: [43.7, 10.3],
				bottom_right: [42.0, 12.4],
			},
		],
		period_info: [],
		desc: "Pre-Indo-European tribe",
		color: "#CDCD65",
		img: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Danseur_avec_une_coupe_de_vin_Tombe_oes_Leopards%2C_Tarquinia.jpg",
		source: "https://en.wikipedia.org/wiki/Etruria"
	},
	{
		name: "Folsom Culture",
		type: "box",
		periods: [
			{
				year_range: [-9000, -8000],
				coords: [43, -107],
				bottom_right: [36, -103],
			},
		],
		period_info: [],
		color: "orange",
		source: "https://en.wikipedia.org/wiki/Folsom_tradition"
	},
	{
		name: "Frentani",
		type: "box",
		periods: [
			{
				year_range: [-750, -49],
				coords: [42.4, 14.1],
				bottom_right: [41.8, 15.0],
			},
		],
		period_info: [],
		desc: "Italic tribe",
		color: "yellow",
		img: "https://upload.wikimedia.org/wikipedia/commons/9/9f/Frentrum_Æ_sg0540.jpg",
		source: "https://en.wikipedia.org/wiki/Sabines"
	},
	{
		name: "Glacial Kame Culture",
		type: "box",
		periods: [
			{
				year_range: [-8000, -1000],
				coords: [46, -87],
				bottom_right: [39, -80],
			},
		],
		period_info: [],
		color: "cyan",
		img: "https://upload.wikimedia.org/wikipedia/commons/9/98/Zimmerman_Kame.jpg",
		source: "https://en.wikipedia.org/wiki/Glacial_Kame_Culture"
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
		color: "#FDBAAF",
		img: "https://upload.wikimedia.org/wikipedia/commons/6/67/GlobularAmphoraPiatraNeamt.JPG",
		source: "https://en.wikipedia.org/wiki/Globular_Amphora_culture"
	},
	{
		name: "Gojoseon",
		type: "box",
		periods: [
			{
				year_range: [-700, -108],
				coords: [41, 124],
				bottom_right: [38, 128],
			},
		],
		period_info: [],
		color: "blue",
		source: "https://en.wikipedia.org/wiki/Gojoseon"
	},
	{
		name: "Gravettian Culture",
		type: "box",
		periods: [
			{
				year_range: [-31000, -20000],
				coords: [52, -10],
				bottom_right: [36, 37],
			},
		],
		period_info: [],
		color: "tan",
		source: "https://en.wikipedia.org/wiki/Gravettian"
	},
	{
		name: "Halaf Culture",
		type: "box",
		periods: [
			{
				year_range: [-6100, -5100],
				coords: [39, 36],
				bottom_right: [35, 44],
			},
		],
		period_info: [],
		color: "purple",
		source: "https://en.wikipedia.org/wiki/Halaf_culture"
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
		color: "yellow",
		source: "https://en.wikipedia.org/wiki/Hamangia_culture"
	},
	{
		name: "Hittites",
		type: "box",
		periods: [
			{
				year_range: [-1600, -1178],
				coords: [43, 27],
				bottom_right: [36, 43],
			},
		],
		period_info: [],
		desc: "Anatolian Civilization",
		color: "blue",
		source: "https://en.wikipedia.org/wiki/Hittites"
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
		period_info: [
			{
				year_range: [-3500, -2800],
				desc: 'Early Phase',
			},
			{
				year_range: [-2800, -2600],
				desc: 'Period of Transition',
			},
			{
				year_range: [-2600, -1900],
				desc: 'Mature Phase',
			},
			{
				year_range: [-1900, -1600],
				desc: 'Late Phase',
			},
			{
				year_range: [-1600, -1500],
				desc: 'Final Phase',
			},
		],
		color: "brown",
		source: "https://en.wikipedia.org/wiki/Indus_Valley_Civilisation"
	},
	{
		name: "Jeulmun Culture",
		type: "box",
		periods: [
			{
				year_range: [-8000, -1500],
				coords: [38, 126],
				bottom_right: [34, 130],
			},
		],
		period_info: [],
		color: "blue",
		source: "https://en.wikipedia.org/wiki/Jeulmun_pottery_period"
	},
	{
		name: "Jōmon Culture",
		type: "box",
		periods: [
			{
				year_range: [-14000, -300],
				coords: [46, 130],
				bottom_right: [31, 145],
			},
		],
		period_info: [],
		color: "red",
		source: "https://en.wikipedia.org/wiki/Jōmon_period"
	},
	{
		name: "Khvalynsk Culture",
		type: "box",
		periods: [
			{
				year_range: [-5000, -4500],
				coords: [52, 37],
				bottom_right: [43, 52],
			},
		],
		period_info: [],
		color: "magenta",
		source: "https://en.wikipedia.org/wiki/Khvalynsk_culture"
	},
	{
		name: "Kongemose Culture",
		type: "box",
		periods: [
			{
				year_range: [-6000, -5200],
				coords: [59, 8],
				bottom_right: [53, 15],
			},
		],
		period_info: [],
		color: "red",
		source: "https://en.wikipedia.org/wiki/Kongemose_culture"
	},
	{
		name: "Ligures",
		type: "box",
		periods: [
			{
				year_range: [-750, -100],
				coords: [44.7, 6.9],
				bottom_right: [43.6, 10.1],
			},
		],
		period_info: [],
		desc: "Italic tribe",
		color: "green",
		source: "https://en.wikipedia.org/wiki/Ligures"
	},
	{
		name: "Longshan Culture",
		type: "box",
		periods: [
			{
				year_range: [-3000, -1900],
				coords: [39, 105],
				bottom_right: [33, 123],
			},
		],
		period_info: [],
		color: "green",
		source: "https://en.wikipedia.org/wiki/Longshan_culture"
	},
	{
		name: "Lucani",
		type: "box",
		periods: [
			{
				year_range: [-750, -88],
				coords: [40.8, 14.9],
				bottom_right: [39.8, 16.7],
			},
		],
		period_info: [],
		desc: "Italic tribe",
		color: "darkcyan",
		img: "https://upload.wikimedia.org/wikipedia/commons/9/9c/Grab_der_Granatäpfel_heimkehrender_Ritter.jpg",
		source: "https://en.wikipedia.org/wiki/Lucanians"
	},
	{
		name: "Magdalenian Culture",
		type: "box",
		periods: [
			{
				year_range: [-15000, -10000],
				coords: [52, -10],
				bottom_right: [36, 19],
			},
		],
		period_info: [],
		color: "pink",
		source: "https://en.wikipedia.org/wiki/Magdalenian"
	},
	{
		name: "Maglemosian Culture",
		type: "box",
		periods: [
			{
				year_range: [-9000, -6000],
				coords: [59, 8],
				bottom_right: [53, 15],
			},
		],
		period_info: [],
		color: "red",
		source: "https://en.wikipedia.org/wiki/Maglemosian"
	},
	{
		name: "Majiayao Culture",
		type: "box",
		periods: [
			{
				year_range: [-3300, -2000],
				coords: [38, 102],
				bottom_right: [34, 107],
			},
		],
		period_info: [],
		color: "red",
		source: "https://en.wikipedia.org/wiki/Majiayao_culture"
	},
	{
		name: "Mumun Culture",
		type: "box",
		periods: [
			{
				year_range: [-1500, -300],
				coords: [38, 126],
				bottom_right: [34, 130],
			},
		],
		period_info: [],
		color: "cyan",
		source: "https://en.wikipedia.org/wiki/Mumun_pottery_period"
	},
	{
		name: "Natufian Culture",
		type: "box",
		periods: [
			{
				year_range: [-13050, -7550],
				coords: [37, 33],
				bottom_right: [30, 39],
			},
		],
		period_info: [],
		color: "orange",
		source: "https://en.wikipedia.org/wiki/Natufian_culture"
	},
	{
		name: "Old Copper Complex",
		type: "box",
		periods: [
			{
				year_range: [-4000, -1000],
				coords: [49, -93],
				bottom_right: [44, -84],
			},
		],
		period_info: [],
		color: "orange",
		img: "https://upload.wikimedia.org/wikipedia/commons/a/ad/Copper_knife%2C_spearpoints%2C_awls%2C_and_spud%2C_Late_Archaic_period%2C_Wisconsin%2C_3000_BC-1000_BC_-_Wisconsin_Historical_Museum_-_DSC03436.JPG",
		source: "https://en.wikipedia.org/wiki/Old_Copper_Complex"
	},
	{
		name: "Paiján Culture",
		type: "box",
		periods: [
			{
				year_range: [-8700, -5900],
				coords: [-4, -82],
				bottom_right: [-11, -76],
			},
		],
		period_info: [],
		color: "red",
		source: "https://en.wikipedia.org/wiki/Paiján_culture"
	},
	{
		name: "Paleo-Arctic Culture",
		type: "box",
		periods: [
			{
				year_range: [-8000, -5000],
				coords: [72, -168],
				bottom_right: [54, -135],
			},
		],
		period_info: [],
		color: "cyan",
		source: "https://en.wikipedia.org/wiki/Paleo-Arctic_Tradition"
	},
	{
		name: "Plano Culture",
		type: "box",
		periods: [
			{
				year_range: [-9000, -6000],
				coords: [45, -110],
				bottom_right: [41, -104],
			},
		],
		period_info: [],
		color: "pink",
		source: "https://en.wikipedia.org/wiki/Plano_cultures"
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
		color: "purple",
		source: "https://en.wikipedia.org/wiki/Poltavka_culture"
	},
	{
		name: "Post Pattern Culture",
		type: "box",
		periods: [
			{
				year_range: [-11000, -7000],
				coords: [42, -125],
				bottom_right: [37, -121],
			},
		],
		period_info: [],
		color: "purple",
		source: "https://en.wikipedia.org/wiki/Post_Pattern"
	},
	{
		name: "Proto-Villanovan Culture",
		type: "box",
		periods: [
			{
				year_range: [-1200, -900],
				coords: [45, 10],
				bottom_right: [42, 13],
			},
		],
		period_info: [],
		color: "brown",
		source: "https://en.wikipedia.org/wiki/Proto-Villanovan_culture"
	},
	{
		name: "Sabines",
		type: "box",
		periods: [
			{
				year_range: [-750, -468],
				coords: [42.8, 12.4],
				bottom_right: [41.9, 13.5],
			},
		],
		period_info: [],
		desc: "Italic tribe",
		color: "green",
		source: "https://en.wikipedia.org/wiki/Sabines"
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
		color: "green",
		source: "https://en.wikipedia.org/wiki/Samarra_culture"
	},
	{
		name: "Samnites",
		type: "box",
		periods: [
			{
				year_range: [-750, -290],
				coords: [41.9, 13.9],
				bottom_right: [40.8, 15.6],
			},
		],
		period_info: [],
		desc: "Italic tribe",
		color: "pink",
		img: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Samnite_soldiers_from_a_tomb_frieze_in_Nola_4th_century_BCE.jpg",
		source: "https://en.wikipedia.org/wiki/Samnites"
	},
	{
		name: "Shang",
		type: "box",
		periods: [
			{
				year_range: [-1600, -1046],
				coords: [39, 108],
				bottom_right: [30, 118],
			},
		],
		period_info: [],
		color: "green",
		source: "https://en.wikipedia.org/wiki/Shang_dynasty"
	},
	{
		name: "Sintasha Culture",
		type: "box",
		periods: [
			{
				year_range: [-2100, -1800],
				coords: [57, 58],
				bottom_right: [51, 70],
			},
		],
		period_info: [],
		color: "magenta",
		source: "https://en.wikipedia.org/wiki/Sintasha_culture"
	},
	{
		name: "Solutrean Culture",
		type: "box",
		periods: [
			{
				year_range: [-20000, -15000],
				coords: [49, -10],
				bottom_right: [36, 5],
			},
		],
		period_info: [],
		color: "pink",
		source: "https://en.wikipedia.org/wiki/Solutrean"
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
		color: "black",
		source: "https://en.wikipedia.org/wiki/Swiderian_culture"
	},
	{
		name: "Terramare Culture",
		type: "box",
		periods: [
			{
				year_range: [-1700, -1150],
				coords: [46, 8],
				bottom_right: [44, 12],
			},
		],
		period_info: [],
		color: "pink",
		source: "https://en.wikipedia.org/wiki/Terramare_culture"
	},
	{
		name: "Thracians",
		type: "box",
		periods: [
			{
				year_range: [-1000, -168], // estimate
				coords: [43.2, 23.2],
				bottom_right: [40.6, 29.1],
			},
		],
		period_info: [],
		desc: "Indo-European tribe",
		color: "brown",
		img: "https://upload.wikimedia.org/wikipedia/commons/b/b5/Xerxes_I_tomb_Skudrian_soldier_circa_470_BCE_cleaned_up.jpg",
		source: "https://en.wikipedia.org/wiki/Thracians"
	},
	{
		name: "Tumulus Culture",
		type: "box",
		periods: [
			{
				year_range: [-1600, -1200],
				coords: [52, 11],
				bottom_right: [48, 20],
			},
		],
		period_info: [],
		color: "yellow",
		source: "https://en.wikipedia.org/wiki/Tumulus_culture"
	},
	{
		name: "Ubaid Culture",
		type: "box",
		periods: [
			{
				year_range: [-6500, -3800],
				coords: [34, 43],
				bottom_right: [31, 46],
			},
		],
		period_info: [],
		color: "brown",
		source: "https://en.wikipedia.org/wiki/Ubaid_culture"
	},
	{
		name: "Únětice Culture",
		type: "box",
		periods: [
			{
				year_range: [-2300, -1600],
				coords: [52, 11],
				bottom_right: [48, 20],
			},
		],
		period_info: [],
		color: "yellow",
		source: "https://en.wikipedia.org/wiki/Unetice_culture"
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
		name: "Veneti",
		type: "box",
		periods: [
			{
				year_range: [-750, -49],
				coords: [46.3, 11.3],
				bottom_right: [45.2, 13.6],
			},
		],
		period_info: [],
		desc: "Italic tribe",
		color: "blue",
		source: "https://en.wikipedia.org/wiki/Adriatic_Veneti"
	},
	{
		name: "Villanovan Culture",
		type: "box",
		periods: [
			{
				year_range: [-900, -700],
				coords: [45, 10],
				bottom_right: [42, 13],
			},
		],
		period_info: [],
		color: "brown",
		source: "https://en.wikipedia.org/wiki/Villanovan_culture"
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
		color: "lavender",
		source: "https://en.wikipedia.org/wiki/Vinča_culture"
	},
	{
		name: "Xindian Culture",
		type: "box",
		periods: [
			{
				year_range: [-1500, -1000],
				coords: [42, 92],
				bottom_right: [32, 105],
			},
		],
		period_info: [],
		color: "tan",
		source: "https://en.wikipedia.org/wiki/Xindian_culture"
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
		color: "#F8F885",
		img: "https://upload.wikimedia.org/wikipedia/commons/1/18/Yamna01.jpg",
		source: "https://en.wikipedia.org/wiki/Yamnaya_culture"
	},
	{
		name: "Yueshi Culture",
		type: "box",
		periods: [
			{
				year_range: [-1900, -1500],
				coords: [39, 116],
				bottom_right: [34, 123],
			},
		],
		period_info: [],
		color: "tan",
		source: "https://en.wikipedia.org/wiki/Yueshi_culture"
	},
	{
		name: "Zhou",
		type: "box",
		periods: [
			{
				year_range: [-1046, -249],
				coords: [41, 105],
				bottom_right: [28, 119],
			},
		],
		period_info: [],
		color: "red",
		source: "https://en.wikipedia.org/wiki/Zhou_dynasty"
	},
	// PRIORITY BOXES
	{
		name: "Maykop Culture",
		type: "box",
		periods: [
			{
				year_range: [-3700, -3000],
				coords: [47, 37],
				bottom_right: [43, 46],
			},
		],
		period_info: [],
		color: "brown",
		source: "https://en.wikipedia.org/wiki/Maykop_culture"
	},
	// POINTS
	{
		name: "Ahar-Banas culture",
		type: "point",
		periods: [
			{
				year_range: [-3000, -1500],
				coords: [25, 74],
			},
		],
		period_info: [],
		color: "black",
		source: "https://en.wikipedia.org/wiki/Ahar–Banas_culture"
	},
	{
		name: "Alepotrypa cave",
		type: "point",
		periods: [
			{
				year_range: [-4000, -1200],
				coords: [36.6, 22.4],
			},
		],
		period_info: [],
		color: "red",
		img: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Diros-cave-greece_16269357444_o.jpg",
		source: "https://en.wikipedia.org/wiki/Alepotrypa_cave"
	},
	{
		name: "Annaba",
		type: "point",
		periods: [
			{
				year_range: [-1200, 9999],
				coords: [37, 8],
			},
		],
		period_info: [],
		color: "red",
		source: "https://en.wikipedia.org/wiki/Annaba"
	},
	{
		name: "Areni-1 winery",
		type: "point",
		periods: [
			{
				year_range: [-4100, 4000],
				coords: [40, 45],
			},
		],
		period_info: [],
		color: "red",
		source: "https://en.wikipedia.org/wiki/Areni-1_winery"
	},
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
		color: "red",
		source: "https://en.wikipedia.org/wiki/Assur"
	},
	{
		name: "Athens",
		type: "point",
		periods: [
			{
				year_range: [-5000, 9999],
				coords: [38, 24],
			},
		],
		period_info: [],
		color: "red",
		img: "https://upload.wikimedia.org/wikipedia/commons/a/a7/The_Acropolis_of_Athens_viewed_from_the_Hill_of_the_Muses_(14220794964).jpg",
		source: "https://en.wikipedia.org/wiki/Athens"
	},
	{
		name: "Axum",
		type: "point",
		periods: [
			{
				year_range: [-400, 9999],
				coords: [14, 39],
			},
		],
		period_info: [],
		color: "red",
		source: "https://en.wikipedia.org/wiki/Axum"
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
		color: "red",
		source: "https://en.wikipedia.org/wiki/Babylon"
	},
	{
		name: "Beersheba Culture",
		type: "point",
		periods: [
			{
				year_range: [-4200, 4000],
				coords: [31, 35],
			},
		],
		period_info: [],
		color: "black",
		source: "https://en.wikipedia.org/wiki/Beersheba_culture"
	},
	{
		name: "Benin City",
		type: "point",
		periods: [
			{
				year_range: [-400, 9999],
				coords: [6, 6],
			},
		],
		period_info: [],
		color: "red",
		source: "https://en.wikipedia.org/wiki/Benin_City"
	},
	{
		name: "Berbera",
		type: "point",
		periods: [
			{
				year_range: [-400, 9999],
				coords: [10, 45],
			},
		],
		period_info: [],
		color: "red",
		source: "https://en.wikipedia.org/wiki/Berbera"
	},
	{
		name: "Bhirrana",
		type: "point",
		periods: [
			{
				year_range: [-7570, -2600],
				coords: [30, 76],
			},
		],
		period_info: [],
		color: "red",
		source: "https://en.wikipedia.org/wiki/Bhirrana"
	},
	{
		name: "Biniai Nou hypogea",
		type: "point",
		periods: [
			{
				year_range: [-2290, -2030],
				coords: [40, 4],
			},
		],
		period_info: [],
		color: "red",
		source: "https://en.wikipedia.org/wiki/Biniai_Nou_hypogea"
	},
	{
		name: "Bonstorf Barrows",
		type: "point",
		periods: [
			{
				year_range: [-1500, -1200],
				coords: [53, 10],
			},
		],
		period_info: [],
		color: "red",
		source: "https://en.wikipedia.org/wiki/Bonstorf_Barrows"
	},
	{
		name: "Borġ in-Nadur",
		type: "point",
		periods: [
			{
				year_range: [-2500, -500],
				coords: [36, 15],
			},
		],
		period_info: [],
		color: "red",
		source: "https://en.wikipedia.org/wiki/Borġ_in-Nadur"
	},
	{
		name: "Brú na Bóinne",
		type: "point",
		periods: [
			{
				year_range: [-4000, -2900],
				coords: [53.7, -6.4],
			},
		],
		period_info: [],
		desc: "Neolithic archaeological complex including monuments and passage graves",
		color: "red",
		img: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Newgrange.JPG",
		source: "https://en.wikipedia.org/wiki/Brú_na_Bóinne"
	},
	{
		name: "Byblos",
		type: "point",
		periods: [
			{
				year_range: [-8800, -7000],
				coords: [34, 36],
			},
			{
				year_range: [-5000, 9999],
				coords: [34, 36],
			},
		],
		period_info: [],
		color: "red",
		source: "https://en.wikipedia.org/wiki/Byblos"
	},
	{
		name: "Carthage",
		type: "point",
		periods: [
			{
				year_range: [-814, -146],
				coords: [37, 10],
			},
		],
		period_info: [],
		color: "red",
		source: "https://en.wikipedia.org/wiki/Carthage"
	},
	{
		name: "Çatalhöyük",
		type: "point",
		periods: [
			{
				year_range: [-7500, -5700],
				coords: [38, 33],
			},
		],
		period_info: [],
		color: "red",
		source: "https://en.wikipedia.org/wiki/Çatalhöyük"
	},
	{
		name: "Çukuriçi Höyük",
		type: "point",
		periods: [
			{
				year_range: [-6700, -6000],
				coords: [38, 27],
			},
			{
				year_range: [-3500, -2750],
				coords: [38, 27],
			},
		],
		period_info: [],
		color: "red",
		desc: "Settlement",
		img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/01_Cukurici_Höyük.tif/lossy-page1-800px-01_Cukurici_Höyük.tif.jpg",
		source: "https://en.wikipedia.org/wiki/Çukuriçi_Höyük"
	},
	{
		name: "Chalcolithic Temple of Ein Gedi",
		type: "point",
		periods: [
			{
				year_range: [-3500, -3500],
				coords: [31, 35],
			},
		],
		period_info: [],
		color: "red",
		source: "https://en.wikipedia.org/wiki/Chalcolithic_Temple_of_Ein_Gedi"
	},
	{
		name: "Cliff Palace",
		type: "point",
		periods: [
			{
				year_range: [1190, 1300],
				coords: [37, -108],
			},
		],
		period_info: [],
		color: "red",
		source: "https://en.wikipedia.org/wiki/Cliff_Palace"
	},
	{
		name: "Devil's Lair",
		type: "point",
		periods: [
			{
				year_range: [-46000, -10700],
				coords: [-34, 115],
			},
		],
		period_info: [],
		color: "red",
		source: "https://en.wikipedia.org/wiki/Devil's_Lair"
	},
	{
		name: "Dispilio",
		type: "point",
		periods: [
			{
				year_range: [-5600, -3000],
				coords: [40.5, 21.3],
			},
		],
		period_info: [],
		desc: "Settlement",
		color: "red",
		source: "https://en.wikipedia.org/wiki/Dispilio"
	},
	{
		name: "Domuztepe",
		type: "point",
		periods: [
			{
				year_range: [-6200, -5450],
				coords: [37, 37],
			},
		],
		period_info: [],
		color: "red",
		source: "https://en.wikipedia.org/wiki/Domuztepe"
	},
	{
		name: "Fox Farm Site",
		type: "point",
		periods: [
			{
				year_range: [1200, 1400],
				coords: [39, -84],
			},
		],
		period_info: [],
		color: "red",
		source: "https://en.wikipedia.org/wiki/Fox_Farm_Site_(Mays_Lick,_Kentucky)"
	},
	{
		name: "Franchthi Cave",
		type: "point",
		periods: [
			{
				year_range: [-38000, -3000],
				coords: [37, 23],
			},
		],
		period_info: [],
		color: "red",
		img: "https://upload.wikimedia.org/wikipedia/commons/5/57/Franchthi_Cave_from_Koilada_Argolidas.jpg",
		source: "https://en.wikipedia.org/wiki/Franchthi_Cave"
	},
	{
		name: "Frankleben Hoard",
		type: "point",
		periods: [
			{
				year_range: [-1500, -1250],
				coords: [51, 12],
			},
		],
		period_info: [],
		color: "red",
		source: "https://en.wikipedia.org/wiki/Frankleben_hoard"
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
		color: "red",
		source: "https://en.wikipedia.org/wiki/Ganweriwal"
	},
	{
		name: "Göbekli Tepe",
		type: "point",
		periods: [
			{
				year_range: [-10000, -8000],
				coords: [37, 39],
			},
		],
		period_info: [],
		color: "red",
		source: "https://en.wikipedia.org/wiki/Göbekli_Tepe"
	},
	{
		name: "Gortyn",
		type: "point",
		periods: [
			{
				year_range: [-3200, 9999],
				coords: [35.0, 24.9],
			},
		],
		period_info: [],
		desc: "Settlement",
		color: "red",
		source: "https://en.wikipedia.org/wiki/Gortyn"
	},
	{
		name: "Ħal-Saflieni Hypogeum",
		type: "point",
		periods: [
			{
				year_range: [-4000, -2500],
				coords: [35.9, 14.5],
			},
		],
		period_info: [],
		desc: "Sanctuary and Necropolis",
		color: "red",
		img: "https://upload.wikimedia.org/wikipedia/commons/0/06/Photo_Ellis_Hal_Salflieni.jpg",
		source: "https://en.wikipedia.org/wiki/Ħal-Saflieni_Hypogeum"
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
		color: "red",
		source: "https://en.wikipedia.org/wiki/Hattusa"
	},
	{
		name: "Hohlenstein-Stadel",
		type: "point",
		periods: [
			{
				year_range: [-39000, -33000],
				coords: [49, 10],
			},
		],
		period_info: [],
		desc: "Cave",
		color: "red",
		source: "https://en.wikipedia.org/wiki/Hohlenstein-Stadel"
	},
	{
		name: "Kerma",
		type: "point",
		periods: [
			{
				year_range: [-3500, -1100],
				coords: [20, 30],
			},
		],
		period_info: [],
		color: "red",
		source: "https://en.wikipedia.org/wiki/Kerma"
	},
	{
		name: "Krzemionki",
		type: "point",
		periods: [
			{
				year_range: [-3900, -1600],
				coords: [51, 21],
			},
		],
		period_info: [],
		desc: "Neolithic to Bronze Age flint mine complex",
		color: "red",
		img: "https://upload.wikimedia.org/wikipedia/commons/4/41/Krzemionki.JPG",
		source: "https://en.wikipedia.org/wiki/Krzemionki"
	},
	{
		name: "Kültəpə",
		type: "point",
		periods: [
			{
				year_range: [-4500, 9999],
				coords: [39.3, 45.5],
			},
		],
		period_info: [],
		color: "red",
		source: "https://en.wikipedia.org/wiki/Kültəpə"
	},
	{
		name: "Las Cogotas",
		type: "point",
		periods: [
			{
				year_range: [-1700, -1000],
				coords: [41, -5],
			},
		],
		period_info: [],
		color: "red",
		source: "https://en.wikipedia.org/wiki/Las_Cogotas"
	},
	{
		name: "Luxor",
		type: "point",
		periods: [
			{
				year_range: [-3200, 9999],
				coords: [26, 33],
			},
		],
		period_info: [],
		color: "red",
		source: "https://en.wikipedia.org/wiki/Luxor"
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
		color: "red",
		source: "https://en.wikipedia.org/wiki/Mehrgarh"
	},
	{
		name: "Merheleva Ridge",
		type: "point",
		periods: [
			{
				year_range: [-4000, -3000],
				coords: [48, 39],
			},
		],
		period_info: [],
		desc: "Chalcolithic temple and burial complex",
		color: "red",
		img: "http://photos.wikimapia.org/p/00/03/70/35/44_big.jpg",
		source: "https://en.wikipedia.org/wiki/Merheleva_Ridge"
	},
	{
		name: "Mogadishu",
		type: "point",
		periods: [
			{
				year_range: [-200, 9999],
				coords: [2, 45],
			},
		],
		period_info: [],
		color: "red",
		source: "https://en.wikipedia.org/wiki/Mogadishu"
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
		color: "red",
		source: "https://en.wikipedia.org/wiki/Mohenjo-daro"
	},
	{
		name: "Nakhchivan Tepe",
		type: "point",
		periods: [
			{
				year_range: [-5000, 9999],
				coords: [39.2, 45.4],
			},
		],
		period_info: [],
		color: "red",
		source: "https://en.wikipedia.org/wiki/Nakhchivan_Tepe"
	},
	{
		name: "Nanzhuangtou",
		type: "point",
		periods: [
			{
				year_range: [-9500, -9000],
				coords: [39, 116],
			},
		],
		period_info: [],
		color: "red",
		source: "https://en.wikipedia.org/wiki/Nanzhuangtou"
	},
	{
		name: "Nevalı Çori",
		type: "point",
		periods: [
			{
				year_range: [-8400, -8100],
				coords: [38, 39],
			},
		],
		period_info: [],
		color: "red",
		source: "https://en.wikipedia.org/wiki/Nevalı_Çori"
	},
	{
		name: "Osaka",
		type: "point",
		periods: [
			{
				year_range: [400, 9999],
				coords: [35, 135],
			},
		],
		period_info: [],
		color: "red",
		source: "https://en.wikipedia.org/wiki/Osaka"
	},
	{
		name: "Piedra Museo",
		type: "point",
		periods: [
			{
				year_range: [-9000, -9000],
				coords: [-49, -70],
			},
		],
		period_info: [],
		color: "red",
		source: "https://en.wikipedia.org/wiki/Piedra_Museo"
	},
	{
		name: "Poverty Point",
		type: "point",
		periods: [
			{
				year_range: [-1800, -1200],
				coords: [33, -91],
			},
		],
		period_info: [],
		color: "red",
		source: "https://en.wikipedia.org/wiki/Poverty_Point"
	},
	{
		name: "Priniatikos Pyrgos",
		type: "point",
		periods: [
			{
				year_range: [-3000, -1000],
				coords: [35.1, 25.7],
			},
		],
		period_info: [],
		color: "red",
		source: "https://en.wikipedia.org/wiki/Priniatikos_Pyrgos"
	},
	{
		name: "Rome",
		type: "point",
		periods: [
			{
				year_range: [-753, 9999],
				coords: [41.9, 12.5],
			},
		],
		period_info: [],
		color: "red",
		source: "https://en.wikipedia.org/wiki/Rome"
	},
	{
		name: "Schnidejoch",
		type: "point",
		periods: [
			{
				year_range: [-5000, 1500], // roughly
				coords: [46, 7],
			},
		],
		period_info: [],
		desc: "Mountain Pass",
		color: "red",
		img: "https://upload.wikimedia.org/wikipedia/commons/5/51/Aufstieg_wildhornhuette.jpg",
		source: "https://en.wikipedia.org/wiki/Schnidejoch"
	},
	{
		name: "Sechin Bajo",
		type: "point",
		periods: [
			{
				year_range: [-3500, -1500],
				coords: [-9, -78],
			},
		],
		period_info: [],
		color: "red",
		img: "https://upload.wikimedia.org/wikipedia/commons/6/6c/Sechin_casma_valley.JPG",
		source: "https://en.wikipedia.org/wiki/Sechin_Bajo"
	},
	{
		name: "Teleilat el Ghassul",
		type: "point",
		periods: [
			{
				year_range: [-4400, -3500],
				coords: [32, 36],
			},
		],
		period_info: [],
		color: "red",
		source: "https://en.wikipedia.org/wiki/Teleilat_el_Ghassul"
	},
	{
		name: "Tell Qaramel",
		type: "point",
		periods: [
			{
				year_range: [-10700, -9400],
				coords: [36, 37],
			},
		],
		period_info: [],
		color: "red",
		source: "https://en.wikipedia.org/wiki/Tell_Qaramel"
	},
	{
		name: "Tholos de El Romeral",
		type: "point",
		periods: [
			{
				year_range: [-1800, -1800],
				coords: [37, 5],
			},
		],
		period_info: [],
		color: "red",
		source: "https://en.wikipedia.org/wiki/Tholos_de_El_Romeral"
	},
	{
		name: "Tripoli",
		type: "point",
		periods: [
			{
				year_range: [-700, 9999],
				coords: [33, 13],
			},
		],
		period_info: [],
		color: "red",
		source: "https://en.wikipedia.org/wiki/Tripoli"
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
		color: "red",
		source: "https://en.wikipedia.org/wiki/Troy"
	},
	{
		name: "Upward Sun River Site",
		type: "point",
		periods: [
			{
				year_range: [-9500, -7000],
				coords: [64.4, -147.0],
			},
		],
		period_info: [],
		color: "red",
		source: "https://en.wikipedia.org/wiki/Upward_Sun_River_site"
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
		color: "red",
		source: "https://en.wikipedia.org/wiki/Uruk"
	},
	{
		name: "Xagħra Stone Circle",
		type: "point",
		periods: [
			{
				year_range: [-4100, -2000],
				coords: [36.0, 14.3],
			},
		],
		period_info: [],
		desc: "Funerary Complex",
		color: "red",
		img: "https://upload.wikimedia.org/wikipedia/commons/d/d8/Hypogée_de_Xaghra.jpg",
		source: "https://en.wikipedia.org/wiki/Xagħra_Stone_Circle"
	},
	{
		name: "Yanshi",
		type: "point",
		periods: [
			{
				year_range: [-1900, 0],
				coords: [35, 113],
			},
		],
		period_info: [],
		color: "red",
		source: "https://en.wikipedia.org/wiki/Yanshi"
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
		color: "black",
		source: "https://en.wikipedia.org/wiki/Yaz_culture"
	},
	{
		name: "Watson Brake",
		type: "point",
		periods: [
			{
				year_range: [-3500, -3000],
				coords: [32, -92],
			},
		],
		period_info: [],
		color: "red",
		img: "https://upload.wikimedia.org/wikipedia/commons/d/d3/Watson_Brake_Aerial_Illustration_HRoe_2014.jpg",
		source: "https://en.wikipedia.org/wiki/Watson_Brake"
	},
	{
		name: "Wieliczka Salt Mine",
		type: "point",
		periods: [
			{
				year_range: [1200, 2007],
				coords: [50, 20],
			},
		],
		period_info: [],
		color: "red",
		img: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Wieliczka_salt_mine.jpg/260px-Wieliczka_salt_mine.jpg",
		source: "https://en.wikipedia.org/wiki/Wieliczka_Salt_Mine"
	},
	// well-known buildings
	{
		name: "Alcántara Bridge",
		type: "point",
		periods: [
			{
				year_range: [106, 9999],
				coords: [39.7224, -6.8924],
			},
		],
		period_info: [],
		desc: "Roman bridge",
		color: "orange",
		img: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Bridge_Alcantara.JPG",
		source: "https://en.wikipedia.org/wiki/Alcántara_Bridge"
	},
	{
		name: "Alhambra",
		type: "point",
		periods: [
			{
				year_range: [889, 9999],
				coords: [37.17695, -3.59001],
			},
		],
		period_info: [],
		desc: "Palace and fortress complex",
		color: "orange",
		img: "https://upload.wikimedia.org/wikipedia/commons/d/de/Dawn_Charles_V_Palace_Alhambra_Granada_Andalusia_Spain.jpg",
		source: "https://en.wikipedia.org/wiki/Alhambra"
	},
	{
		name: "Colosseum",
		type: "point",
		periods: [
			{
				year_range: [80, 9999],
				coords: [41.890361, 12.4896418],
			},
		],
		period_info: [],
		desc: "Classical Roman amphitheater",
		color: "orange",
		img: "https://upload.wikimedia.org/wikipedia/commons/5/53/Colosseum_in_Rome%2C_Italy_-_April_2007.jpg",
		source: "https://en.wikipedia.org/wiki/Colosseum"
	},
	{
		name: "Colossus of Rhodes",
		type: "point",
		periods: [
			{
				year_range: [-280, -226],
				coords: [36.45111, 28.22778],
			},
		],
		period_info: [],
		desc: "One of the seven wonders of the ancient world",
		color: "orange",
		source: "https://en.wikipedia.org/wiki/Colossus_of_Rhodes"
	},
	{
		name: "Great Pyramid of Giza",
		type: "point",
		periods: [
			{
				year_range: [-2560, 9999],
				coords: [29.9791667, 31.13444],
			},
		],
		period_info: [],
		desc: "Tomb of Khufu and one of the seven wonders of the ancient world",
		color: "orange",
		img: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Kheops-Pyramid.jpg",
		source: "https://en.wikipedia.org/wiki/Great_Pyramid_of_Giza"
	},
	{
		name: "Haia Sophia",
		type: "point",
		periods: [
			{
				year_range: [532, 9999],
				coords: [41.0086111, 28.98],
			},
		],
		period_info: [],
		desc: "Former Greek Orthodox Christian patriarchal cathedral, later an Ottoman imperial mosque, now a museum",
		color: "orange",
		img: "https://upload.wikimedia.org/wikipedia/commons/2/22/Hagia_Sophia_Mars_2013.jpg",
		source: "https://en.wikipedia.org/wiki/Hagia_Sophia"
	},
	{
		name: "Maison Carrée",
		type: "point",
		periods: [
			{
				year_range: [2, 9999],
				coords: [43.838333, 4.356111],
			},
		],
		period_info: [],
		desc: "Roman temple",
		color: "orange",
		img: "https://upload.wikimedia.org/wikipedia/commons/1/10/MaisonCarrée.jpeg",
		source: "https://en.wikipedia.org/wiki/Maison_Carrée"
	},
	{
		name: "Mausoleum at Halicarnassus",
		type: "point",
		periods: [
			{
				year_range: [-351, 1494],
				coords: [37.03778, 27.4241667],
			},
		],
		period_info: [],
		desc: "Tomb of Mausolus and one of the wonders of the ancient world",
		color: "orange",
		img: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Mausoleum_at_Halicarnassus_at_the_Bodrum_Museum_of_Underwater_Archaeology.jpg",
		source: "https://en.wikipedia.org/wiki/Mausoleum_at_Halicarnassus"
	},
	{
		name: "Mont Saint-Michel",
		type: "point",
		periods: [
			{
				year_range: [460, 9999],
				coords: [48.636111, -1.5113889],
			},
		],
		period_info: [],
		desc: "Fortified island commune",
		color: "orange",
		img: "https://upload.wikimedia.org/wikipedia/commons/2/29/Mont-Saint-Michel_Drone.jpg",
		source: "https://en.wikipedia.org/wiki/Mont-Saint-Michel"
	},
	{
		name: "Lighthouse of Alexandria",
		type: "point",
		periods: [
			{
				year_range: [-246, 1307],
				coords: [31.213889, 29.88556],
			},
		],
		period_info: [],
		desc: "One of the wonders of the ancient world",
		color: "orange",
		img: "https://upload.wikimedia.org/wikipedia/commons/3/33/PHAROS2013-3000x2250.jpg",
		source: "https://en.wikipedia.org/wiki/Lighthouse_of_Alexandria"
	},
	{
		name: "Parthenon",
		type: "point",
		periods: [
			{
				year_range: [-432, 1687],
				coords: [37.9713889, 23.7263889],
			},
		],
		period_info: [],
		desc: "Temple to Athena",
		color: "orange",
		img: "https://upload.wikimedia.org/wikipedia/commons/d/da/The_Parthenon_in_Athens.jpg",
		source: "https://en.wikipedia.org/wiki/Parthenon"
	},
	{
		name: "St. Peter's Basilica",
		type: "point",
		periods: [
			{
				year_range: [1626, 9999],
				coords: [41.90222, 12.45333],
			},
		],
		period_info: [],
		desc: "Italian Renaissance church in Vatican City",
		color: "orange",
		img: "https://upload.wikimedia.org/wikipedia/commons/1/1f/Rome_San_Pietro.jpg",
		source: "https://en.wikipedia.org/wiki/St._Peter's_Basilica"
	},
	{
		name: "Statue of Zeus",
		type: "point",
		periods: [
			{
				year_range: [-435, 475], // rough estimate
				coords: [37.63786111, 21.63],
			},
		],
		period_info: [],
		desc: "One of the seven wonders of the ancient world",
		color: "orange",
		source: "https://en.wikipedia.org/wiki/Statue_of_Zeus_at_Olympia"
	},
	{
		name: "Stonehenge",
		type: "point",
		periods: [
			{
				year_range: [-3000, 9999], // rough estimate
				coords: [51.17889, -1.826111],
			},
		],
		period_info: [],
		desc: "Ring of standing stones",
		color: "orange",
		img: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Stonehenge2007_07_30.jpg",
		source: "https://en.wikipedia.org/wiki/Stonehenge"
	},
	{
		name: "Temple of Artemis",
		type: "point",
		periods: [
			{
				year_range: [-432, 262],
				coords: [37.9497222, 27.363889],
			},
		],
		period_info: [],
		desc: "Temple to Artemis and one of the seven wonders of the ancient world",
		color: "orange",
		img: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Miniaturk_009.jpg",
		source: "https://en.wikipedia.org/wiki/Temple_of_Artemis"
	},
	{
		name: "Tower of Hercules",
		type: "point",
		periods: [
			{
				year_range: [100, 9999],
				coords: [43.3858333, -8.4063889],
			},
		],
		period_info: [],
		desc: "Ancient Roman lighthouse",
		color: "orange",
		img: "https://upload.wikimedia.org/wikipedia/commons/e/eb/A_coruna_torre_de_hercules_sunset_edit.jpg",
		source: "https://en.wikipedia.org/wiki/Tower_of_Hercules"
	},
	// beyond cities and nations and cultures...
	{
		name: "Cheddar Man",
		type: "point",
		periods: [
			{
				year_range: [-7150, -7100], // age guess
				coords: [51, -3],
			},
		],
		period_info: [],
		desc: "Fossil",
		color: "cyan",
		source: "https://en.wikipedia.org/wiki/Cheddar_Man"
	},
	{
		name: "Anzick-1",
		type: "point",
		periods: [
			{
				year_range: [-10630, -10630],
				coords: [46, -111],
			},
		],
		period_info: [],
		desc: "Skeleton",
		color: "cyan",
		source: "https://en.wikipedia.org/wiki/Anzick-1"
	},
	{
		name: "Arlington Springs Man",
		type: "point",
		periods: [
			{
				year_range: [-11050, -11000], // age is guess
				coords: [34, -120],
			},
		],
		period_info: [],
		desc: "Skeleton",
		color: "cyan",
		source: "https://en.wikipedia.org/wiki/Arlington_Springs_Man"
	},
	{
		name: "Buhl Woman",
		type: "point",
		periods: [
			{
				year_range: [-8725, -8675], // age is guess
				coords: [34, -120],
			},
		],
		period_info: [],
		desc: "Skeleton",
		color: "cyan",
		source: "https://en.wikipedia.org/wiki/Buhl_Woman"
	},
	{
		name: "Eve of Naharon",
		type: "point",
		periods: [
			{
				year_range: [-11650, -11600], // age is guess
				coords: [20, -87],
			},
		],
		period_info: [],
		desc: "Skeleton",
		color: "cyan",
		source: "https://en.wikipedia.org/wiki/Eve_of_Naharon"
	},
	{
		name: "Kennewick Man",
		type: "point",
		periods: [
			{
				year_range: [-7000, -6950],
				coords: [46, -119],
			},
		],
		period_info: [],
		desc: "Skeleton",
		color: "cyan",
		source: "https://en.wikipedia.org/wiki/Kennewick_Man"
	},
	{
		name: "Koelbjerg Man",
		type: "point",
		periods: [
			{
				year_range: [-8025, -8000],
				coords: [55, 10],
			},
		],
		period_info: [],
		desc: "Bog body",
		color: "cyan",
		source: "https://en.wikipedia.org/wiki/Koelbjerg_Man"
	},
	{
		name: "La Brea Woman",
		type: "point",
		periods: [
			{
				year_range: [-8285, -8235], // age is guess
				coords: [34, -118],
			},
		],
		period_info: [],
		desc: "Skeleton",
		color: "cyan",
		source: "https://en.wikipedia.org/wiki/La_Brea_Woman"
	},
	{
		name: "Lansing Man",
		type: "point",
		periods: [
			{
				year_range: [-3629, -3579], // age is guess
				coords: [35, -95],
			},
		],
		period_info: [],
		desc: "Skeleton",
		color: "cyan",
		source: "https://en.wikipedia.org/wiki/Lansing_Man"
	},
	{
		name: "Luzia Woman",
		type: "point",
		periods: [
			{
				year_range: [-9527, -9477], // age is guess
				coords: [-20, -44],
			},
		],
		period_info: [],
		desc: "Skeleton",
		color: "cyan",
		source: "https://en.wikipedia.org/wiki/Luzia_Woman"
	},
	{
		name: "Minnesota Woman",
		type: "point",
		periods: [
			{
				year_range: [-5940, -5890], // age is guess
				coords: [47, -96],
			},
		],
		period_info: [],
		desc: "Skeleton",
		color: "cyan",
		source: "https://en.wikipedia.org/wiki/Minnesota_Woman"
	},
	{
		name: "Naia",
		type: "point",
		periods: [
			{
				year_range: [-10050, -10000], // age is guess
				coords: [20, -87],
			},
		],
		period_info: [],
		desc: "Skeleton",
		color: "cyan",
		source: "https://en.wikipedia.org/wiki/Naia_(skeleton)"
	},
	{
		name: "Ötzi",
		type: "point",
		periods: [
			{
				year_range: [-3345, -3300],
				coords: [47, 11],
			},
		],
		period_info: [],
		desc: "Natural mummy",
		color: "cyan",
		img: "https://upload.wikimedia.org/wikipedia/en/1/1d/OetzitheIceman02.jpg",
		source: "https://en.wikipedia.org/wiki/Ötzi"
	},
	{
		name: "Peñon Woman",
		type: "point",
		periods: [
			{
				year_range: [-10750, -10700], // age is guess
				coords: [19, -99],
			},
		],
		period_info: [],
		desc: "Skeleton",
		color: "cyan",
		source: "https://en.wikipedia.org/wiki/Peñon_woman"
	},
	{
		name: "Spirit Cave Mummy",
		type: "point",
		periods: [
			{
				year_range: [-9550, -9500], // age is guess
				coords: [39, -119],
			},
		],
		period_info: [],
		desc: "Mummy",
		color: "cyan",
		source: "https://en.wikipedia.org/wiki/Spirit_Cave_mummy"
	},
	{
		name: "Tollund Man",
		type: "point",
		periods: [
			{
				year_range: [-415, -375],
				coords: [56, 9],
			},
		],
		period_info: [],
		desc: "Bog body",
		color: "cyan",
		source: "https://en.wikipedia.org/wiki/Tollund_Man"
	},
	{
		name: "Tuqan Man",
		type: "point",
		periods: [
			{
				year_range: [-10050, -10000], // age is guess
				coords: [39, -119],
			},
		],
		period_info: [],
		desc: "Skeleton",
		color: "cyan",
		source: "https://en.wikipedia.org/wiki/Tuqan_man"
	},
];