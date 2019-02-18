var map_src = 'https://upload.wikimedia.org/wikipedia/commons/5/51/BlankMap-Equirectangular.svg';
var pointsize = 8;
var mapsize = window.innerWidth - 32;

function range(n){
	return [...Array(n).keys()];
}

function uncorrected_coord2px(coords){
	"use strict";
	var x = coords[1] * mapsize/360 + mapsize/2;
	var y = coords[0] * -mapsize/360 + mapsize/4;
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
			newlink = document.createElement("a");
			newlink.href = x.source;
			newpoint = document.createElement("div");
			if (x.type == 'point'){
				newpoint.classList.value = "point";
				coords = coord2px(y.coords);
				newpoint.style.height = pointsize+'px';
				newpoint.style.width = pointsize+'px';
			}
			else {
				newpoint.classList.value = "box";
				coords = uncorrected_coord2px(y.coords);
				bottom_right_coords = uncorrected_coord2px(y.bottom_right);
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
		desc: "",
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
		desc: "",
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
		desc: "",
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
		desc: "",
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
		desc: "",
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
		desc: "",
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
		desc: "",
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
		desc: "",
		color: "pink",
		source: "https://en.wikipedia.org/wiki/Fatyanovo–Balanovo_culture"
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
		desc: "",
		color: "red",
		source: "https://en.wikipedia.org/wiki/Ertebølle_culture"
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
		desc: "",
		color: "orange",
		source: "https://en.wikipedia.org/wiki/Folsom_tradition"
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
		desc: "",
		color: "cyan",
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
		desc: "",
		color: "#FDBAAF",
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
		desc: "",
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
		desc: "",
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
		desc: "",
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
		desc: "",
		color: "brown",
		source: "https://en.wikipedia.org/wiki/Indus_Valley_Civilisation"
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
		desc: "",
		color: "red",
		source: "https://en.wikipedia.org/wiki/Jōmon_period"
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
		desc: "",
		color: "red",
		source: "https://en.wikipedia.org/wiki/Kongemose_culture"
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
		desc: "",
		color: "green",
		source: "https://en.wikipedia.org/wiki/Longshan_culture"
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
		desc: "",
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
		desc: "",
		color: "red",
		source: "https://en.wikipedia.org/wiki/Maglemosian"
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
		desc: "",
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
		desc: "",
		color: "orange",
		source: "https://en.wikipedia.org/wiki/Old_Copper_Complex"
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
		desc: "",
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
		desc: "",
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
		desc: "",
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
		desc: "",
		color: "brown",
		source: "https://en.wikipedia.org/wiki/Proto-Villanovan_culture"
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
		desc: "",
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
		desc: "",
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
		desc: "",
		color: "pink",
		source: "https://en.wikipedia.org/wiki/Terramare_culture"
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
		desc: "",
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
		desc: "",
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
		desc: "",
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
		desc: "",
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
		name: "Ahar-Banas culture",
		type: "point",
		periods: [
			{
				year_range: [-3000, -1500],
				coords: [25, 74],
			},
		],
		period_info: [],
		desc: "",
		color: "black",
		source: "https://en.wikipedia.org/wiki/Ahar–Banas_culture"
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
		desc: "",
		color: "red",
		source: "https://en.wikipedia.org/wiki/Annaba"
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
		desc: "",
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
		desc: "",
		color: "red",
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
		desc: "",
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
		desc: "",
		color: "red",
		source: "https://en.wikipedia.org/wiki/Babylon"
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
		desc: "",
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
		desc: "",
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
		desc: "",
		color: "red",
		source: "https://en.wikipedia.org/wiki/Bhirrana"
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
		desc: "",
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
		desc: "",
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
		desc: "",
		color: "red",
		source: "https://en.wikipedia.org/wiki/Çatalhöyük"
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
		desc: "",
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
		desc: "",
		color: "red",
		source: "https://en.wikipedia.org/wiki/Devil's_Lair"
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
		desc: "",
		color: "red",
		source: "https://en.wikipedia.org/wiki/Franchthi_Cave"
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
		name: "Göbekli Tepe",
		type: "point",
		periods: [
			{
				year_range: [-10000, -8000],
				coords: [37, 39],
			},
		],
		period_info: [],
		desc: "",
		color: "red",
		source: "https://en.wikipedia.org/wiki/Göbekli_Tepe"
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
		name: "Kerma",
		type: "point",
		periods: [
			{
				year_range: [-3500, -1100],
				coords: [20, 30],
			},
		],
		period_info: [],
		desc: "",
		color: "red",
		source: "https://en.wikipedia.org/wiki/Kerma"
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
		desc: "",
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
		desc: "",
		color: "red",
		source: "https://en.wikipedia.org/wiki/Mehrgarh"
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
		desc: "",
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
		desc: "",
		color: "red",
		source: "https://en.wikipedia.org/wiki/Mohenjo-daro"
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
		desc: "",
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
		desc: "",
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
		desc: "",
		color: "red",
		source: "https://en.wikipedia.org/wiki/Osaka"
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
		desc: "",
		color: "red",
		source: "https://en.wikipedia.org/wiki/Poverty_Point"
	},
	{
		name: "Rome",
		type: "point",
		periods: [
			{
				year_range: [-753, 9999],
				coords: [42, 13],
			},
		],
		period_info: [],
		desc: "",
		color: "red",
		source: "https://en.wikipedia.org/wiki/Rome"
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
		desc: "",
		color: "red",
		source: "https://en.wikipedia.org/wiki/Sechin_Bajo"
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
		desc: "",
		color: "red",
		source: "https://en.wikipedia.org/wiki/Tell_Qaramel"
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
		desc: "",
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
		name: "Yanshi",
		type: "point",
		periods: [
			{
				year_range: [-1900, 0],
				coords: [35, 113],
			},
		],
		period_info: [],
		desc: "",
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
		desc: "",
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
		desc: "",
		color: "red",
		source: "https://en.wikipedia.org/wiki/Watson_Brake"
	},
	// beyond cities and nations and cultures...
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
		source: "https://en.wikipedia.org/wiki/Ötzi"
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
];