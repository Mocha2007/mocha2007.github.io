/* jshint esversion: 6, strict: true, strict: global, eqeqeq: true */
/* exported range2dates */
'use strict';
const mapSrc = 'https://upload.wikimedia.org/wikipedia/commons/5/51/BlankMap-Equirectangular.svg';
const euromapSrc = 'https://upload.wikimedia.org/wikipedia/commons/9/90/Europe_satellite_image_location_map.jpg';
const pointsize = 6;
const mapsize = window.innerWidth - 32;
const euromapcoords = [
	[72, -25], // ULHC
	[34,  60],  // BRHC
];
const maps = [
	['bigmap'],
	['bigeuromap', euromapcoords, 1.5, 1.704],
];

function uncorrectedCoordToPx(coords){
	const x = coords[1] * mapsize/360 + mapsize/2;
	const y = coords[0] * -mapsize/360 + mapsize/4;
	return [y, x];
}

function insetCoordToPx(coords, selectedMap){
	const insetCoords = selectedMap[1];
	const longitudes = insetCoords[1][1] - insetCoords[0][1];
	const latitudes = insetCoords[0][0] - insetCoords[1][0];
	const x = (coords[1] - insetCoords[0][1]) * mapsize/longitudes;
	const y = (insetCoords[0][1] - coords[0]) * mapsize/latitudes/selectedMap[2] +
		mapsize*selectedMap[3];
	return [y, x];
}

function coord2px(coords){
	const x = coords[1] * mapsize/360 + mapsize/2 - pointsize/2;
	const y = coords[0] * -mapsize/360 + mapsize/4 - pointsize/2;
	return [y, x];
}

function int2date(int){
	if (int < 0){
		int = -int;
		int += ' BCE';
	}
	return int;
}

function range2dates(r){
	const begin = int2date(r[0]) === '9999 BCE' ? '' : int2date(r[0]);
	const end = int2date(r[1]) === 9999 ? '' : int2date(r[1]);
	return begin + '-' +end;
}

function tooltip(id){ // todo fix for inset
	// console.log(id);
	// bigmap
	const newpoint = document.createElement('div');
	const coords = [window.event.clientY, window.event.clientX];
	// console.log(coords);
	newpoint.id = 'current_tooltip';
	newpoint.style.top = coords[0]-25 + 'px';
	newpoint.style.left = coords[1]+25 + 'px';
	newpoint.style.position = 'fixed';
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
	let bottomRightCoords, coords, newlink, newpoint; // , periodSpecificInfo;
	const wants = document.getElementById('date').value;
	document.getElementById('bigmap').innerHTML = '<img id="mapimg" src="'+mapSrc+'" width="'+mapsize+'">';
	document.getElementById('bigeuromap').innerHTML = '<img id="euromapimg" src="'+euromapSrc+'" width="'+mapsize+'">';
	features.forEach(function(x){
		// periodSpecificInfo = '';
		x.periodInfo.forEach(function(y){
			if (wants < y.yearRange[0] || y.yearRange[1] < wants){
				return false;
			}
			// periodSpecificInfo += '\n' + y.desc;
		});
		x.periods.forEach(function(y){
			maps.forEach(function(selectedMap){
				if (wants < y.yearRange[0] || y.yearRange[1] < wants){
					return false;
				}
				// bottom of minimap cutoff
				if (selectedMap[1] !== undefined){
					// console.log(y.coords[0], selectedMap[1][1][0]);
					if (y.coords[0] < selectedMap[1][1][0] || selectedMap[1][1][1] < y.coords[1]){
						return false;
					}
				}
				// bigmap
				newlink = document.createElement('a');
				newlink.href = x.source;
				newpoint = document.createElement('div');
				if (x.type === 'point'){
					newpoint.classList.value = 'point';
					if (selectedMap[1] === undefined){
						coords = coord2px(y.coords);
					}
					else {
						coords = insetCoordToPx(y.coords, selectedMap);
					}
					newpoint.style.height = pointsize+'px';
					newpoint.style.width = pointsize+'px';
				}
				else {
					newpoint.classList.value = 'box';
					if (selectedMap[1] === undefined){
						coords = uncorrectedCoordToPx(y.coords);
						bottomRightCoords = uncorrectedCoordToPx(y.bottomRight);
					}
					else {
						coords = insetCoordToPx(y.coords, selectedMap);
						bottomRightCoords = insetCoordToPx(y.bottomRight, selectedMap);
					}
					newpoint.style.height = bottomRightCoords[0] - coords[0]+'px';
					newpoint.style.width = bottomRightCoords[1] - coords[1]+'px';
				}
				newpoint.style.backgroundColor = x.color;
				// newpoint.title = x.name + '\n' + x.desc + periodSpecificInfo; // + ' (' + range2dates(x.yearRange) +
				newpoint.style.position = 'absolute';
				newpoint.style.top = coords[0] + 'px';
				newpoint.style.left = coords[1] + 'px';
				// tooltip
				// console.log(coords);
				newpoint.onmouseover = () => tooltip(x);
				newpoint.onmouseout = () => document.getElementById('current_tooltip').outerHTML = '';
				// final
				newlink.appendChild(newpoint);
				document.getElementById(selectedMap[0]).appendChild(newlink);
			});
		});
	});
}
// years start at 1 jan - so for america, since it didn't exist 1 jan 1776, it has to wait until 1 jan 1777
const features = [
	// these need to be out of order because they block other regions
	{
		name: 'Mousterian Complex',
		type: 'box',
		periods: [
			{
				yearRange: [-160000, -38000],
				coords: [51, -7],
				bottomRight: [33, 67],
			},
		],
		periodInfo: [],
		color: 'purple',
		img: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Production_of_points_%26_spearheads_from_a_flint_stone_core%2C_Levallois_technique%2C_Mousterian_Culture%2C_Tabun_Cave%2C_250%2C000-50%2C000_BP_%28detail%29.jpg',
		source: 'https://en.wikipedia.org/wiki/Mousterian',
	},
	{
		name: 'Urnfield Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-1300, -750],
				coords: [55, -1],
				bottomRight: [40, 22],
			},
		],
		periodInfo: [],
		desc: 'Associated with Italo-Celtic<br>Observed Y-DNA: R1a1a1b1a2<br>Observed mt-DNA: H23',
		color: 'yellow',
		source: 'https://en.wikipedia.org/wiki/Urnfield_culture',
	},
	// alphabetical order
	{
		name: 'A-Group Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-3800, -3100],
				coords: [24, 31],
				bottomRight: [21, 33],
			},
		],
		periodInfo: [],
		color: 'pink',
		source: 'https://en.wikipedia.org/wiki/A-Group_culture',
	},
	{
		name: 'Abashevo Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-2500, -1900],
				coords: [59, 48],
				bottomRight: [53, 57],
			},
		],
		periodInfo: [],
		desc: 'Associated with Indo-Iranian',
		color: 'green',
		source: 'https://en.wikipedia.org/wiki/Abashevo_culture',
	},
	{
		name: 'Afanasievo Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-3300, -2500],
				coords: [54, 73],
				bottomRight: [46, 94],
			},
		],
		periodInfo: [],
		desc: 'Associated with Indo-Europeans<br>Observed Y-DNA: Q1a2, R1b1a1a2a, R1b1a1a2a2<br>Observed mt-DNA: J2a2a, H, K, T2c1a2, U5a1a1',
		color: 'red',
		source: 'https://en.wikipedia.org/wiki/Afanasievo_culture',
	},
	{
		name: 'Afontova Gora',
		type: 'box',
		periods: [
			{
				yearRange: [-19000, -10000],
				coords: [57, 92],
				bottomRight: [55, 94],
			},
		],
		periodInfo: [],
		color: 'teal',
		img: 'https://upload.wikimedia.org/wikipedia/commons/6/66/Implements_from_Afontova_Gora%2C_Krasnoyarsk_Regional_Museum.jpg',
		source: 'https://en.wikipedia.org/wiki/Afontova_Gora',
	},
	{
		name: 'Ahrensburg Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-10900, -9700],
				coords: [54, -2],
				bottomRight: [50, 17],
			},
		],
		periodInfo: [],
		color: 'black',
		img: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Ahrensburg_point.png',
		source: 'https://en.wikipedia.org/wiki/Ahrensburg_culture',
	},
	{
		name: 'Akkadian Empire',
		type: 'box',
		periods: [
			{
				yearRange: [-2334, -2154],
				coords: [38, 38],
				bottomRight: [30, 48],
			},
		],
		periodInfo: [],
		desc: 'Mesopotamian Civilization',
		color: 'brown',
		source: 'https://en.wikipedia.org/wiki/Akkadian_Empire',
	},
	{
		name: 'Anarta Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-3950, -1900],
				coords: [25, 68],
				bottomRight: [20, 74],
			},
		],
		periodInfo: [],
		color: 'green',
		source: 'https://en.wikipedia.org/wiki/Anarta_tradition',
	},
	{
		name: 'Aterian Industry',
		type: 'box',
		periods: [
			{
				yearRange: [-150000, -18000],
				coords: [37, -9],
				bottomRight: [17, 76],
			},
		],
		periodInfo: [],
		color: 'green',
		img: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/At%C3%A9rien_%28Djelfa%29.JPG',
		source: 'https://en.wikipedia.org/wiki/Aterian',
	},
	{
		name: 'Aurignacian Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-41000, -26000],
				coords: [52, -10],
				bottomRight: [36, 37],
			},
		],
		periodInfo: [],
		desc: 'Observed Y-DNA: C1a<br>Observed mt-DNA: M',
		color: 'red',
		img: 'https://upload.wikimedia.org/wikipedia/commons/1/17/Rhinos_Chauvet_Cave.jpg',
		source: 'https://en.wikipedia.org/wiki/Aurignacian',
	},
	{
		name: 'Baden Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-3600, -2800],
				coords: [51, 12],
				bottomRight: [44, 24],
			},
		],
		periodInfo: [],
		desc: 'Observed Y-DNA: I, G2a2<br>Observed mt-DNA: H, HV, J, K, T2, U',
		color: '#CFA7F8',
		img: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Museum_für_Vor-_und_Frühgeschichte_Berlin_034.jpg',
		source: 'https://en.wikipedia.org/wiki/Baden_culture',
	},
	{
		name: 'Beaker Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-2800, -1800],
				coords: [58, -9],
				bottomRight: [35, 19],
			},
		],
		periodInfo: [],
		desc: 'Poss. Associated with Vasconic<br>Observed Y-DNA: R1b',
		color: '#FF7F27',
		source: 'https://en.wikipedia.org/wiki/Beaker_culture',
	},
	{
		name: 'Babylonia',
		type: 'box',
		periods: [
			{
				yearRange: [-1895, -539],
				coords: [38, 38],
				bottomRight: [30, 48],
			},
		],
		periodInfo: [],
		desc: 'Mesopotamian Civilization',
		color: 'gold',
		source: 'https://en.wikipedia.org/wiki/Babylonia',
	},
	{
		name: 'Bactria-Margiana Archaeological Complex',
		type: 'box',
		periods: [
			{
				yearRange: [-2300, -1700],
				coords: [40, 59],
				bottomRight: [36, 68],
			},
		],
		periodInfo: [],
		desc: 'Observed Y-DNA: E1b1a, E1b1b, G, J*, J1, J2, L, R*, R1b, R2, T',
		color: 'orange',
		source: 'https://en.wikipedia.org/wiki/Bactria–Margiana_Archaeological_Complex',
	},
	{
		name: 'Bohunician Industry',
		type: 'box',
		periods: [
			{
				yearRange: [-46000, -38000],
				coords: [51, 17],
				bottomRight: [41, 30],
			},
		],
		periodInfo: [],
		color: 'teal',
		img: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Bohunician_scrapers.jpg',
		source: 'https://en.wikipedia.org/wiki/Bohunician',
	},
	{
		name: 'Boian Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-4300, -3500],
				coords: [45, 23],
				bottomRight: [40, 28],
			},
		],
		periodInfo: [],
		color: 'yellow',
		source: 'https://en.wikipedia.org/wiki/Boian_culture',
	},
	{
		name: 'Bolshemys Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-4000, -3000],
				coords: [50, 80],
				bottomRight: [43, 98],
			},
		],
		periodInfo: [],
		color: 'blue',
		source: 'https://en.wikipedia.org/wiki/Bolshemys_culture',
	},
	{
		name: 'Bug-Dniester Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-6300, -5000],
				coords: [48, 24],
				bottomRight: [44, 32],
			},
		],
		periodInfo: [],
		color: 'yellow',
		source: 'https://en.wikipedia.org/wiki/Bug%E2%80%93Dniester_culture',
	},
	{
		name: 'C-Group Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-2400, -1550],
				coords: [20, 30],
				bottomRight: [18, 34],
			},
		],
		periodInfo: [],
		desc: 'Associated with Cushitic',
		color: 'pink',
		source: 'https://en.wikipedia.org/wiki/C-Group_culture',
	},
	{
		name: 'Cardium Pottery Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-6400, -5500],
				coords: [46, -2],
				bottomRight: [38, 22],
			},
		],
		periodInfo: [],
		desc: 'Observed Y-DNA: C1a2, E1b1b1a1b1, G2a2a1<br>Observed mt-DNA: H1, H3, H4a1a, H5a, H7c, K1a2a, K1a4a1, K1b1a, N1a1, X2c',
		color: 'green',
		source: 'https://en.wikipedia.org/wiki/Cardium_pottery',
	},
	{
		name: 'Catacomb Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-2800, -2200],
				coords: [52, 31],
				bottomRight: [43, 42],
			},
		],
		periodInfo: [],
		desc: 'Potential Associations: Armenian, Greek, Indo-Iranian, Thracian<br>Observed Y-DNA: R1b1a2<br>Observed mt-DNA: U4, U5, U5a, X4',
		color: 'black',
		source: 'https://en.wikipedia.org/wiki/Catacomb_culture',
	},
	{
		name: 'Châtelperronian Industry',
		type: 'box',
		periods: [
			{
				yearRange: [-42500, -34000],
				coords: [47, 3],
				bottomRight: [45, 8],
			},
		],
		periodInfo: [],
		color: 'green',
		img: 'https://upload.wikimedia.org/wikipedia/commons/7/77/Pointes_de_chatelperron.jpg',
		source: 'https://en.wikipedia.org/wiki/Ch%C3%A2telperronian',
	},
	{
		name: 'Cimmerians',
		type: 'box',
		periods: [
			{
				yearRange: [-1000, -600],
				coords: [50, 31],
				bottomRight: [45, 55],
			},
		],
		periodInfo: [],
		desc: 'Nomadic Indo-European group<br>Observed Y-DNA: Q1a1, R1a, R1a2c, R1b1a<br>Observed mt-DNA: C5c, H9a, H35, R, U2e2, U5a1b1',
		color: 'red',
		source: 'https://en.wikipedia.org/wiki/Cimmerians',
	},
	{
		name: 'Clovis Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-11200, -10900],
				coords: [49, -126],
				bottomRight: [7, -78],
			},
		],
		periodInfo: [],
		desc: 'Observed Y-DNA: Q-L54<br>Observed mt-DNA: D4h3a',
		color: 'cyan',
		img: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Clovis_Point.jpg',
		source: 'https://en.wikipedia.org/wiki/Clovis_culture',
	},
	{
		name: 'Comb Ceramic Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-4200, -2000],
				coords: [62, 21],
				bottomRight: [54, 35],
			},
		],
		periodInfo: [],
		desc: 'Observed Y-DNA: R1, R1a5<br>Observed mt-DNA: U2e1, U4a, U4d2, U5a1d2b, U5b1d1',
		color: 'purple',
		img: 'https://upload.wikimedia.org/wikipedia/commons/d/d6/CombCeramicPottery.jpg',
		source: 'https://en.wikipedia.org/wiki/Pit–Comb_Ware_culture',
	},
	{
		name: 'Corded Ware Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-2900, -2350],
				coords: [59, 4],
				bottomRight: [47, 31],
			},
		],
		periodInfo: [],
		desc: 'Associated with Balto-Slavic and Germanic<br>Observed Y-DNA: I2a2a2, R, R1, R1a, R1a1, R1a1a, R1a1a1, R1b, R1b1, R1b1a',
		color: '#F97474',
		source: 'https://en.wikipedia.org/wiki/Corded_Ware_culture',
	},
	{
		name: 'Dacians',
		type: 'box',
		periods: [
			{
				yearRange: [-1000, 106], // estimate
				coords: [48.4, 19.7],
				bottomRight: [43.2, 30.8],
			},
		],
		periodInfo: [],
		desc: 'Indo-European tribe',
		color: 'slateblue',
		img: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Costantino_Dacia.JPG',
		source: 'https://en.wikipedia.org/wiki/Dacians',
	},
	{
		name: 'Dimini Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-5000, -4400],
				coords: [40, 21],
				bottomRight: [34, 27],
			},
		],
		periodInfo: [],
		color: 'teal',
		img: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Clay_vase_with_polychrome_decoration%2C_Dimini%2C_Magnesia%2C_Late_or_Final_Neolithic_%285300-3300_BC%29.jpg',
		source: 'https://en.wikipedia.org/wiki/Dimini#History',
	},
	{
		name: 'Dnieper-Donets Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-5000, -4200],
				coords: [52, 25],
				bottomRight: [47, 39],
			},
		],
		periodInfo: [],
		desc: 'Pre-Indo-Europeans<br>Observed Y-DNA: I2, R1b<br>Observed mt-DNA: U2, U4, U5',
		color: 'black',
		source: 'https://en.wikipedia.org/wiki/Dnieper%E2%80%93Donets_culture',
	},
	{
		name: 'Elam',
		type: 'box',
		periods: [
			{
				yearRange: [-2700, -539],
				coords: [34, 48],
				bottomRight: [27, 55],
			},
		],
		periodInfo: [],
		desc: 'Pre-Iranian Civilization',
		color: 'orange',
		source: 'https://en.wikipedia.org/wiki/Elam',
	},
	{
		name: 'Emiran Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-58000, -38000],
				coords: [35, 34],
				bottomRight: [31, 38],
			},
		],
		periodInfo: [],
		color: 'yellow',
		img: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Emireh-Point.jpg',
		source: 'https://en.wikipedia.org/wiki/Emiran',
	},
	{
		name: 'Erligang Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-1510, -1460],
				coords: [39, 108],
				bottomRight: [30, 118],
			},
		],
		periodInfo: [],
		color: 'teal',
		source: 'https://en.wikipedia.org/wiki/Erligang_culture',
	},
	{
		name: 'Erlitou Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-1900, -1500],
				coords: [36, 108],
				bottomRight: [33, 116],
			},
		],
		periodInfo: [],
		color: 'teal',
		source: 'https://en.wikipedia.org/wiki/Erlitou_culture',
	},
	{
		name: 'Fatyanovo-Balanovo Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-3200, -2300],
				coords: [58, 31],
				bottomRight: [52, 53],
			},
		],
		periodInfo: [],
		desc: 'Associated with Baltic<br>Observed Y-DNA: R1a, R1a2<br>Observed mt-DNA: H, I, J, K, N1a, T, U2e, U4, U5, W',
		color: 'pink',
		source: 'https://en.wikipedia.org/wiki/Fatyanovo–Balanovo_culture',
	},
	{
		name: 'Egypt',
		type: 'box',
		periods: [
			{
				yearRange: [-3150, -30],
				coords: [32, 25],
				bottomRight: [22, 36],
			},
			{
				yearRange: [868, 905],
				coords: [37, 23],
				bottomRight: [23, 39],
			},
			{
				yearRange: [935, 969],
				coords: [37, 20],
				bottomRight: [12, 39],
			},
		],
		periodInfo: [
			{
				yearRange: [-3150, -2686],
				desc: 'Early Dynastic Period',
			},
			{
				yearRange: [-2686, -2181],
				desc: 'Old Kingdom',
			},
			{
				yearRange: [-2181, -2055],
				desc: 'First Intermediate Period',
			},
			{
				yearRange: [-2055, -1650],
				desc: 'Middle Kingdom',
			},
			{
				yearRange: [-1650, -1550],
				desc: 'Second Intermediate Period',
			},
			{
				yearRange: [-1550, -1069],
				desc: 'New Kingdom',
			},
			{
				yearRange: [-1069, -664],
				desc: 'Third Intermediate Period',
			},
			{
				yearRange: [-664, -332],
				desc: 'Late Period',
			},
			{
				yearRange: [-305, -30],
				desc: 'Ptolemaic Kingdom',
			},
			{
				yearRange: [868, 905],
				desc: 'Ṭūlūnid',
			},
			{
				yearRange: [935, 969],
				desc: 'Ikhshidid',
			},
		],
		desc: 'North African Civilization<br>Contemporary Y-DNA: E1b1b, J',
		color: 'red',
		source: 'https://en.wikipedia.org/wiki/Egypt',
	},
	{
		name: 'Ertebølle Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-5300, -3950],
				coords: [59, 8],
				bottomRight: [53, 15],
			},
		],
		periodInfo: [],
		desc: 'Observed Y-DNA: I2a1, I2c<br>Observed mt-DNA: U2e1, U5a',
		color: 'red',
		source: 'https://en.wikipedia.org/wiki/Ertebølle_culture',
	},
	{
		name: 'Etruria',
		type: 'box',
		periods: [
			{
				yearRange: [-750, -290],
				coords: [43.7, 10.3],
				bottomRight: [42.0, 12.4],
			},
		],
		periodInfo: [],
		desc: 'Pre-Indo-European tribe',
		color: '#CDCD65',
		img: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/Danseur_avec_une_coupe_de_vin_Tombe_oes_Leopards%2C_Tarquinia.jpg',
		source: 'https://en.wikipedia.org/wiki/Etruria',
	},
	{
		name: 'Epigravettian Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-19000, -8000],
				coords: [52, 8],
				bottomRight: [36, 39],
			},
		],
		periodInfo: [],
		color: 'purple',
		source: 'https://en.wikipedia.org/wiki/Epigravettian',
	},
	{
		name: 'Folsom Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-9000, -8000],
				coords: [43, -107],
				bottomRight: [36, -103],
			},
		],
		periodInfo: [],
		color: 'orange',
		img: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Folsom_point.png',
		source: 'https://en.wikipedia.org/wiki/Folsom_tradition',
	},
	{
		name: 'Frentani',
		type: 'box',
		periods: [
			{
				yearRange: [-750, -49],
				coords: [42.4, 14.1],
				bottomRight: [41.8, 15.0],
			},
		],
		periodInfo: [],
		desc: 'Italic tribe',
		color: 'yellow',
		img: 'https://upload.wikimedia.org/wikipedia/commons/9/9f/Frentrum_Æ_sg0540.jpg',
		source: 'https://en.wikipedia.org/wiki/Sabines',
	},
	{
		name: 'Glacial Kame Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-8000, -1000],
				coords: [46, -87],
				bottomRight: [39, -80],
			},
		],
		periodInfo: [],
		color: 'cyan',
		img: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Zimmerman_Kame.jpg',
		source: 'https://en.wikipedia.org/wiki/Glacial_Kame_Culture',
	},
	{
		name: 'Globular Amphora Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-3400, -2800],
				coords: [55, 8],
				bottomRight: [47, 30],
			},
		],
		periodInfo: [],
		desc: 'Observed Y-DNA: BT, CT, I2, I2a, I2a2, I2a2a1b<br>Observed mt-DNA: H, HV, J, K, T, U, W',
		color: '#FDBAAF',
		img: 'https://upload.wikimedia.org/wikipedia/commons/6/67/GlobularAmphoraPiatraNeamt.JPG',
		source: 'https://en.wikipedia.org/wiki/Globular_Amphora_culture',
	},
	{
		name: 'Gojoseon',
		type: 'box',
		periods: [
			{
				yearRange: [-700, -108],
				coords: [41, 124],
				bottomRight: [38, 128],
			},
		],
		periodInfo: [],
		color: 'blue',
		source: 'https://en.wikipedia.org/wiki/Gojoseon',
	},
	{
		name: 'Gravettian Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-31000, -20000],
				coords: [52, -10],
				bottomRight: [36, 37],
			},
		],
		periodInfo: [],
		desc: 'Observed Y-DNA: BT, C1a2, CT, F, I, IJK<br>Observed mt-DNA: M, U, U2, U5',
		color: 'tan',
		img: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Pointe_de_la_Gravette_MHNT_PRE.2009.0.231.2.fond_%282%29.jpg',
		source: 'https://en.wikipedia.org/wiki/Gravettian',
	},
	{
		name: 'Halaf Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-6100, -5100],
				coords: [39, 36],
				bottomRight: [35, 44],
			},
		],
		periodInfo: [],
		color: 'purple',
		source: 'https://en.wikipedia.org/wiki/Halaf_culture',
	},
	{
		name: 'Hamangia Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-5250, -4500],
				coords: [45, 27],
				bottomRight: [40, 30],
			},
		],
		periodInfo: [],
		color: 'yellow',
		source: 'https://en.wikipedia.org/wiki/Hamangia_culture',
	},
	{
		name: 'Hamburg Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-13500, -11100],
				coords: [55, 6],
				bottomRight: [53, 19],
			},
		],
		periodInfo: [],
		color: 'tan',
		img: 'https://upload.wikimedia.org/wikipedia/commons/7/78/K%C3%A6rvspids%2C_Bjerlev_Hede.jpg',
		source: 'https://en.wikipedia.org/wiki/Hamburg_culture',
	},
	{
		name: 'Hittites',
		type: 'box',
		periods: [
			{
				yearRange: [-1600, -1178],
				coords: [43, 27],
				bottomRight: [36, 43],
			},
		],
		periodInfo: [],
		desc: 'Anatolian Civilization',
		color: 'blue',
		source: 'https://en.wikipedia.org/wiki/Hittites',
	},
	{
		name: 'Indus Valley Civilization',
		type: 'box',
		periods: [
			{
				yearRange: [-3300, -1300],
				coords: [32, 64],
				bottomRight: [20, 78],
			},
		],
		periodInfo: [
			{
				yearRange: [-3500, -2800],
				desc: 'Early Phase',
			},
			{
				yearRange: [-2800, -2600],
				desc: 'Period of Transition',
			},
			{
				yearRange: [-2600, -1900],
				desc: 'Mature Phase',
			},
			{
				yearRange: [-1900, -1600],
				desc: 'Late Phase',
			},
			{
				yearRange: [-1600, -1500],
				desc: 'Final Phase',
			},
		],
		color: 'brown',
		source: 'https://en.wikipedia.org/wiki/Indus_Valley_Civilisation',
	},
	{
		name: 'Jeulmun Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-8000, -1500],
				coords: [38, 126],
				bottomRight: [34, 130],
			},
		],
		periodInfo: [],
		color: 'blue',
		source: 'https://en.wikipedia.org/wiki/Jeulmun_pottery_period',
	},
	{
		name: 'Jōmon Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-14000, -300],
				coords: [46, 130],
				bottomRight: [31, 145],
			},
		],
		periodInfo: [],
		desc: 'Observed Y-DNA: C1a1? D1a2a?<br>Observed mt-DNA: D4h2, G1b, M7a, N9b',
		color: 'red',
		source: 'https://en.wikipedia.org/wiki/Jōmon_period',
	},
	{
		name: 'Khvalynsk Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-5000, -4500],
				coords: [52, 37],
				bottomRight: [43, 52],
			},
		],
		periodInfo: [],
		desc: 'Indo-Europeans<br>Observed Y-DNA: I2a2, J, Q1a, R1a, R1b',
		color: 'magenta',
		source: 'https://en.wikipedia.org/wiki/Khvalynsk_culture',
	},
	{
		name: 'Kongemose Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-6000, -5200],
				coords: [59, 8],
				bottomRight: [53, 15],
			},
		],
		periodInfo: [],
		color: 'red',
		source: 'https://en.wikipedia.org/wiki/Kongemose_culture',
	},
	{
		name: 'Kura-Araxes Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-3400, -2000],
				coords: [44, 40],
				bottomRight: [37, 50],
			},
		],
		periodInfo: [],
		desc: 'Associated with either the Hurro-Urartian or Anatolian languages.',
		color: 'silver',
		img: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Saxs%C4%B1_k%C3%BCp%2C_T%C9%99p%C9%99yata%C4%9F%C4%B1.JPG',
		source: 'https://en.wikipedia.org/wiki/Kura%E2%80%93Araxes_culture',
	},
	{
		name: 'Ligures',
		type: 'box',
		periods: [
			{
				yearRange: [-750, -100],
				coords: [44.7, 6.9],
				bottomRight: [43.6, 10.1],
			},
		],
		periodInfo: [],
		desc: 'Italic tribe',
		color: 'green',
		source: 'https://en.wikipedia.org/wiki/Ligures',
	},
	{
		name: 'Lincombian-Ranisian-Jerzmanowician Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-41000, -30000],
				coords: [53, -6],
				bottomRight: [49, 21],
			},
		],
		periodInfo: [],
		color: 'grey',
		source: 'https://en.wikipedia.org/wiki/Lincombian-Ranisian-Jerzmanowician',
	},
	{
		name: 'Longshan Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-3000, -1900],
				coords: [39, 105],
				bottomRight: [33, 123],
			},
		],
		periodInfo: [],
		color: 'green',
		source: 'https://en.wikipedia.org/wiki/Longshan_culture',
	},
	{
		name: 'Lucani',
		type: 'box',
		periods: [
			{
				yearRange: [-750, -88],
				coords: [40.8, 14.9],
				bottomRight: [39.8, 16.7],
			},
		],
		periodInfo: [],
		desc: 'Italic tribe',
		color: 'darkcyan',
		img: 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Grab_der_Granatäpfel_heimkehrender_Ritter.jpg',
		source: 'https://en.wikipedia.org/wiki/Lucanians',
	},
	{
		name: 'Luwians',
		type: 'box',
		periods: [
			{
				yearRange: [-2000, -900],
				coords: [39, 25.5],
				bottomRight: [35.5, 37],
			},
		],
		periodInfo: [],
		desc: 'Anatolian Civilization',
		color: 'black',
		img: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Hetite_God_in_Aleppo.jpg',
		source: 'https://en.wikipedia.org/wiki/Luwians',
	},
	{
		name: 'Lydians',
		type: 'box',
		periods: [
			{
				yearRange: [-1200, -546],
				coords: [42, 26],
				bottomRight: [37, 34],
			},
		],
		periodInfo: [],
		desc: 'Anatolian Civilization',
		color: 'green',
		img: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Croesus_portrait.jpg',
		source: 'https://en.wikipedia.org/wiki/Lydians',
	},
	{
		name: 'Magdalenian Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-15000, -10000],
				coords: [52, -10],
				bottomRight: [36, 19],
			},
		],
		periodInfo: [],
		desc: 'Observed Y-DNA: HIJK, I<br>Observed mt-DNA: U, U5b, U8b',
		color: 'pink',
		img: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Magdalenian_tools_17000_9000_BCE_Abri_de_la_Madeleine_Tursac_Dordogne_France.jpg',
		source: 'https://en.wikipedia.org/wiki/Magdalenian',
	},
	{
		name: 'Maglemosian Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-9000, -6000],
				coords: [59, 8],
				bottomRight: [53, 15],
			},
		],
		periodInfo: [],
		color: 'red',
		source: 'https://en.wikipedia.org/wiki/Maglemosian',
	},
	{
		name: 'Majiayao Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-3300, -2000],
				coords: [38, 102],
				bottomRight: [34, 107],
			},
		],
		periodInfo: [],
		color: 'red',
		source: 'https://en.wikipedia.org/wiki/Majiayao_culture',
	},
	{
		name: 'Mal\'ta–Buret\' Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-22050, -13050],
				coords: [58, 93],
				bottomRight: [52, 109],
			},
		],
		periodInfo: [],
		desc: 'Observed Y-DNA: R*<br>Observed mt-DNA: U',
		color: 'tan',
		img: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Engraving_of_a_mammoth_on_a_slab_of_mammoth_ivory%2C_from_the_Upper_Paleolithic_Mal%27ta_deposits_at_Lake_Baikal%2C_Siberia.gif',
		source: 'https://en.wikipedia.org/wiki/Mal%27ta%E2%80%93Buret%27_culture',
	},
	{
		name: 'Micoquien Industry',
		type: 'box',
		periods: [
			{
				yearRange: [-130000, -60000],
				coords: [52, 1],
				bottomRight: [45, 8],
			},
		],
		periodInfo: [],
		color: 'red',
		img: 'https://upload.wikimedia.org/wikipedia/commons/7/7f/Biface_Micoquien_MHNT_PRE_.2009.0.193.1_%283%29.jpg',
		source: 'https://en.wikipedia.org/wiki/Micoquien',
	},
	{
		name: 'Mumun Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-1500, -300],
				coords: [38, 126],
				bottomRight: [34, 130],
			},
		],
		periodInfo: [],
		color: 'cyan',
		source: 'https://en.wikipedia.org/wiki/Mumun_pottery_period',
	},
	{
		name: 'Natufian Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-13050, -7550],
				coords: [37, 33],
				bottomRight: [30, 39],
			},
		],
		periodInfo: [],
		desc: 'Afroasiatic<br>Observed Y-DNA: CT, E1b1, E1b1b1b2',
		color: 'orange',
		img: 'https://upload.wikimedia.org/wikipedia/commons/d/d6/Basalt_%26_Limestone_Mortar_%26_Pestle%2C_Natufian_Culture.jpg',
		source: 'https://en.wikipedia.org/wiki/Natufian_culture',
	},
	{
		name: 'Old Copper Complex',
		type: 'box',
		periods: [
			{
				yearRange: [-4000, -1000],
				coords: [49, -93],
				bottomRight: [44, -84],
			},
		],
		periodInfo: [],
		color: 'orange',
		img: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Copper_knife%2C_spearpoints%2C_awls%2C_and_spud%2C_Late_Archaic_period%2C_Wisconsin%2C_3000_BC-1000_BC_-_Wisconsin_Historical_Museum_-_DSC03436.JPG',
		source: 'https://en.wikipedia.org/wiki/Old_Copper_Complex',
	},
	{
		name: 'Paiján Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-8700, -5900],
				coords: [-4, -82],
				bottomRight: [-11, -76],
			},
		],
		periodInfo: [],
		color: 'red',
		img: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Punta_Paij%C3%A1n.jpg',
		source: 'https://en.wikipedia.org/wiki/Paiján_culture',
	},
	{
		name: 'Paleo-Arctic Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-8000, -5000],
				coords: [72, -168],
				bottomRight: [54, -135],
			},
		],
		periodInfo: [],
		color: 'cyan',
		source: 'https://en.wikipedia.org/wiki/Paleo-Arctic_Tradition',
	},
	{
		name: 'Pavlovian Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-27000, -23000],
				coords: [51, 15],
				bottomRight: [48, 19],
			},
		],
		periodInfo: [],
		color: 'red',
		source: 'https://en.wikipedia.org/wiki/Pavlovian_culture',
	},
	{
		name: 'Plano Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-9000, -6000],
				coords: [45, -110],
				bottomRight: [41, -104],
			},
		],
		periodInfo: [],
		color: 'pink',
		source: 'https://en.wikipedia.org/wiki/Plano_cultures',
	},
	{
		name: 'Poltavka Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-2700, -2100],
				coords: [53, 44],
				bottomRight: [48, 55],
			},
		],
		periodInfo: [],
		desc: 'Associated with Indo-Iranian<br>Observed Y-DNA: R1a1a1b2a, R1b1a1a2a2, R1b1a2<br>Observed mt-DNA: U5a1b, U5a1g',
		color: 'purple',
		source: 'https://en.wikipedia.org/wiki/Poltavka_culture',
	},
	{
		name: 'Post Pattern Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-11000, -7000],
				coords: [42, -125],
				bottomRight: [37, -121],
			},
		],
		periodInfo: [],
		desc: 'Yuki-Wappo people',
		color: 'purple',
		source: 'https://en.wikipedia.org/wiki/Post_Pattern',
	},
	{
		name: 'Proto-Villanovan Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-1200, -900],
				coords: [45, 10],
				bottomRight: [42, 13],
			},
		],
		periodInfo: [],
		desc: 'Associated with Italic<br>Observed mt-DNA: U5a2b',
		color: 'brown',
		source: 'https://en.wikipedia.org/wiki/Proto-Villanovan_culture',
	},
	{
		name: 'Sabines',
		type: 'box',
		periods: [
			{
				yearRange: [-750, -468],
				coords: [42.8, 12.4],
				bottomRight: [41.9, 13.5],
			},
		],
		periodInfo: [],
		desc: 'Italic tribe',
		color: 'green',
		source: 'https://en.wikipedia.org/wiki/Sabines',
	},
	{
		name: 'Samarra Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-5500, -4800],
				coords: [36, 41],
				bottomRight: [31, 48],
			},
		],
		periodInfo: [],
		color: 'green',
		img: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Samarra_bowl.jpg',
		source: 'https://en.wikipedia.org/wiki/Samarra_culture',
	},
	{
		name: 'Samnites',
		type: 'box',
		periods: [
			{
				yearRange: [-750, -290],
				coords: [41.9, 13.9],
				bottomRight: [40.8, 15.6],
			},
		],
		periodInfo: [],
		desc: 'Italic tribe',
		color: 'pink',
		img: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Samnite_soldiers_from_a_tomb_frieze_in_Nola_4th_century_BCE.jpg',
		source: 'https://en.wikipedia.org/wiki/Samnites',
	},
	{
		name: 'Sangoan Industry',
		type: 'box',
		periods: [
			{
				yearRange: [-130000, -8000],
				coords: [14, 20],
				bottomRight: [-27, 47],
			},
		],
		periodInfo: [],
		color: 'orange',
		source: 'https://en.wikipedia.org/wiki/Sangoan',
	},
	{
		name: 'Scythians',
		type: 'box',
		periods: [
			{
				yearRange: [-900, 200],
				coords: [52, 45],
				bottomRight: [42, 95],
			},
		],
		periodInfo: [],
		desc: 'Nomadic Iranian group<br>Observed Y-DNA: Q, R1a, R1a1a1b2, R1a1a1b2a2a, R1b1a1a2',
		color: 'black',
		source: 'https://en.wikipedia.org/wiki/Scythians',
	},
	{
		name: 'Shang',
		type: 'box',
		periods: [
			{
				yearRange: [-1600, -1046],
				coords: [39, 108],
				bottomRight: [30, 118],
			},
		],
		periodInfo: [],
		color: 'green',
		source: 'https://en.wikipedia.org/wiki/Shang_dynasty',
	},
	{
		name: 'Sintashta Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-2100, -1800],
				coords: [57, 58],
				bottomRight: [51, 70],
			},
		],
		periodInfo: [],
		desc: 'Associated with Indo-Iranian<br>Observed Y-DNA: I2a1a1a, Q1a, R1, R1a, R1a1a1b, R1b, R1b1a1a2<br>Observed mt-DNA: H, J, J1c1b1a, J2b1a2a, T, U, U2, U2e1e, U2e1h, U5, W',
		color: 'magenta',
		source: 'https://en.wikipedia.org/wiki/Sintashta_culture',
	},
	{
		name: 'Solutrean Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-20000, -15000],
				coords: [49, -10],
				bottomRight: [36, 5],
			},
		],
		periodInfo: [],
		color: 'pink',
		img: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Solutrean_tools_22000_17000_Crot_du_Charnier_Solutre_Pouilly_Saone_et_Loire_France.jpg',
		source: 'https://en.wikipedia.org/wiki/Solutrean',
	},
	{
		name: 'Sredny Stog Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-4500, -3500],
				coords: [51, 31],
				bottomRight: [46, 41],
			},
		],
		periodInfo: [],
		desc: 'Indo-Europeans<br>Observed Y-DNA: R1a1a1<br>Observed mt-DNA: H2a1a',
		color: 'grey',
		source: 'https://en.wikipedia.org/wiki/Sredny_Stog_culture',
	},
	{
		name: 'Srubnaya Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-1800, -1200],
				coords: [52, 33],
				bottomRight: [43, 50],
			},
		],
		periodInfo: [],
		desc: 'Associated with Iranian<br>Observed Y-DNA: R1a1<br>Observed mt-DNA: I1a, J2b, K1b, H, T1, T2, U5',
		color: 'brown',
		source: 'https://en.wikipedia.org/wiki/Srubnaya_culture',
	},
	{
		name: 'Sumer',
		type: 'box',
		periods: [
			{
				yearRange: [-4500, -1900],
				coords: [34, 41],
				bottomRight: [30, 48],
			},
		],
		periodInfo: [],
		desc: 'Mesopotamian Civilization',
		color: 'teal',
		source: 'https://en.wikipedia.org/wiki/Sumer',
	},
	{
		name: 'Swiderian Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-9000, -6200],
				coords: [56, 15],
				bottomRight: [48, 31],
			},
		],
		periodInfo: [],
		color: 'black',
		img: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Swiderian_point_2.jpg',
		source: 'https://en.wikipedia.org/wiki/Swiderian_culture',
	},
	{
		name: 'Szeletian Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-39000, -35000],
				coords: [51, 15],
				bottomRight: [47, 23],
			},
		],
		periodInfo: [],
		color: 'silver',
		source: 'https://en.wikipedia.org/wiki/Szeletian',
	},
	{
		name: 'Terramare Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-1700, -1150],
				coords: [46, 8],
				bottomRight: [44, 12],
			},
		],
		periodInfo: [],
		desc: 'Associated with Ligurian, Tyrrhenian, or Italo-Celtic',
		color: 'pink',
		source: 'https://en.wikipedia.org/wiki/Terramare_culture',
	},
	{
		name: 'Thracians',
		type: 'box',
		periods: [
			{
				yearRange: [-1000, -168], // estimate
				coords: [43.2, 23.2],
				bottomRight: [40.6, 29.1],
			},
		],
		periodInfo: [],
		desc: 'Indo-European tribe',
		color: 'brown',
		img: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Xerxes_I_tomb_Skudrian_soldier_circa_470_BCE_cleaned_up.jpg',
		source: 'https://en.wikipedia.org/wiki/Thracians',
	},
	{
		name: 'Tumulus Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-1600, -1200],
				coords: [52, 11],
				bottomRight: [48, 20],
			},
		],
		periodInfo: [],
		desc: 'Associated with Italo-Celtic',
		color: 'yellow',
		source: 'https://en.wikipedia.org/wiki/Tumulus_culture',
	},
	{
		name: 'Ubaid Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-6500, -3800],
				coords: [34, 43],
				bottomRight: [31, 46],
			},
		],
		periodInfo: [],
		color: 'brown',
		source: 'https://en.wikipedia.org/wiki/Ubaid_culture',
	},
	{
		name: 'Únětice Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-2300, -1600],
				coords: [52, 11],
				bottomRight: [48, 20],
			},
		],
		periodInfo: [],
		desc: 'Observed Y-DNA: I2, I2a2, I2c2<br>Observed mt-DNA: H3, H4a1a1, H6a1b, I3a, K1a4a1, K1b1a, T2b, U2e1f1, U4, U5a1, U5a1b1, U5b2a1b, V, W3a1',
		color: 'yellow',
		source: 'https://en.wikipedia.org/wiki/Unetice_culture',
	},
	{
		name: 'United States',
		type: 'box',
		periods: [
			{
				yearRange: [1777, 1803],
				coords: [48, -95],
				bottomRight: [30, -65],
			}, // + louisiana
			{
				yearRange: [1804, 1819],
				coords: [48, -114],
				bottomRight: [29, -65],
			}, // + oregon
			{
				yearRange: [1820, 1821],
				coords: [48, -124],
				bottomRight: [29, -65],
			}, // + florida
			{
				yearRange: [1822, 9999],
				coords: [48, -124],
				bottomRight: [24, -65],
			},
		],
		periodInfo: [
			{ // Trump
				yearRange: [2018, 2026],
				desc: 'President: Donald Trump',
			},
		],
		desc: 'Country',
		color: 'blue',
		source: 'https://en.wikipedia.org/wiki/United_States',
	},
	{
		name: 'Urartu',
		type: 'box',
		periods: [
			{
				yearRange: [-860, -590],
				coords: [41, 38],
				bottomRight: [36, 47],
			},
		],
		periodInfo: [],
		desc: 'Urartian-speaking Kingdom',
		color: 'orange',
		source: 'https://en.wikipedia.org/wiki/Urartu',
	},
	{
		name: 'Usatovo Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-3500, -3000],
				coords: [47, 27],
				bottomRight: [45, 31],
			},
		],
		periodInfo: [],
		color: 'black',
		source: 'https://en.wikipedia.org/wiki/Usatovo_culture',
	},
	{
		name: 'Veneti',
		type: 'box',
		periods: [
			{
				yearRange: [-750, -49],
				coords: [46.3, 11.3],
				bottomRight: [45.2, 13.6],
			},
		],
		periodInfo: [],
		desc: 'Italic tribe',
		color: 'blue',
		source: 'https://en.wikipedia.org/wiki/Adriatic_Veneti',
	},
	{
		name: 'Villanovan Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-900, -700],
				coords: [45, 10],
				bottomRight: [42, 13],
			},
		],
		periodInfo: [],
		desc: 'Etruscan<br>Observed mt-DNA: K1a4',
		color: 'brown',
		source: 'https://en.wikipedia.org/wiki/Villanovan_culture',
	},
	{
		name: 'Vinča Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-5700, -4500],
				coords: [47, 18],
				bottomRight: [41, 26],
			},
		],
		periodInfo: [],
		desc: 'Observed Y-DNA: G2a2a, G2a2b2a1a, H2<br>Observed mt-DNA: H, K, T, U',
		color: 'lavender',
		img: 'https://upload.wikimedia.org/wikipedia/commons/1/16/Vinca_clay_figure_02.jpg',
		source: 'https://en.wikipedia.org/wiki/Vinča_culture',
	},
	{
		name: 'Xindian Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-1500, -1000],
				coords: [42, 92],
				bottomRight: [32, 105],
			},
		],
		periodInfo: [],
		color: 'tan',
		source: 'https://en.wikipedia.org/wiki/Xindian_culture',
	},
	{
		name: 'Yamna Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-3300, -2600],
				coords: [52, 30],
				bottomRight: [43, 51],
			},
		],
		periodInfo: [],
		desc: 'Associated with Indo-Europeans',
		color: '#F8F885',
		img: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Yamna01.jpg',
		source: 'https://en.wikipedia.org/wiki/Yamnaya_culture',
	},
	{
		name: 'Yueshi Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-1900, -1500],
				coords: [39, 116],
				bottomRight: [34, 123],
			},
		],
		periodInfo: [],
		color: 'tan',
		source: 'https://en.wikipedia.org/wiki/Yueshi_culture',
	},
	{
		name: 'Zhou',
		type: 'box',
		periods: [
			{
				yearRange: [-1046, -249],
				coords: [41, 105],
				bottomRight: [28, 119],
			},
		],
		periodInfo: [],
		color: 'red',
		source: 'https://en.wikipedia.org/wiki/Zhou_dynasty',
	},
	// PRIORITY BOXES
	{
		name: 'Maykop Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-3700, -3000],
				coords: [47, 37],
				bottomRight: [43, 46],
			},
		],
		periodInfo: [],
		desc: 'Associated with Northwest Caucasian',
		color: 'brown',
		img: 'https://upload.wikimedia.org/wikipedia/en/4/48/R3_2_2d_eneolith_bull.jpg',
		source: 'https://en.wikipedia.org/wiki/Maykop_culture',
	},
	{
		name: 'Périgordian Culture',
		type: 'box',
		periods: [
			{
				yearRange: [-33000, -18000],
				coords: [45, 0],
				bottomRight: [39, 1],
			},
		],
		periodInfo: [],
		color: 'lime',
		source: 'https://en.wikipedia.org/wiki/Périgordian',
	},
	// POINTS
	{
		name: 'Ahar-Banas culture',
		type: 'point',
		periods: [
			{
				yearRange: [-3000, -1500],
				coords: [25, 74],
			},
		],
		periodInfo: [],
		color: 'black',
		source: 'https://en.wikipedia.org/wiki/Ahar–Banas_culture',
	},
	{
		name: 'Alepotrypa cave',
		type: 'point',
		periods: [
			{
				yearRange: [-4000, -1200],
				coords: [36.6, 22.4],
			},
		],
		periodInfo: [],
		color: 'red',
		img: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Diros-cave-greece_16269357444_o.jpg',
		source: 'https://en.wikipedia.org/wiki/Alepotrypa_cave',
	},
	{
		name: 'Annaba',
		type: 'point',
		periods: [
			{
				yearRange: [-1200, 9999],
				coords: [37, 8],
			},
		],
		periodInfo: [],
		color: 'red',
		source: 'https://en.wikipedia.org/wiki/Annaba',
	},
	{
		name: 'Assur',
		type: 'point',
		periods: [
			{
				yearRange: [-2500, 1400],
				coords: [35, 43],
			},
		],
		periodInfo: [],
		color: 'red',
		source: 'https://en.wikipedia.org/wiki/Assur',
	},
	{
		name: 'Athens',
		type: 'point',
		periods: [
			{
				yearRange: [-5000, 9999],
				coords: [38, 24],
			},
		],
		periodInfo: [],
		color: 'red',
		img: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/The_Acropolis_of_Athens_viewed_from_the_Hill_of_the_Muses_(14220794964).jpg',
		source: 'https://en.wikipedia.org/wiki/Athens',
	},
	{
		name: 'Axum',
		type: 'point',
		periods: [
			{
				yearRange: [-400, 9999],
				coords: [14, 39],
			},
		],
		periodInfo: [],
		color: 'red',
		source: 'https://en.wikipedia.org/wiki/Axum',
	},
	{
		name: 'Babylon',
		type: 'point',
		periods: [
			{
				yearRange: [-1894, 1000],
				coords: [33, 44],
			},
		],
		periodInfo: [],
		color: 'red',
		source: 'https://en.wikipedia.org/wiki/Babylon',
	},
	{
		name: 'Beersheba Culture',
		type: 'point',
		periods: [
			{
				yearRange: [-4200, 4000],
				coords: [31, 35],
			},
		],
		periodInfo: [],
		color: 'black',
		source: 'https://en.wikipedia.org/wiki/Beersheba_culture',
	},
	{
		name: 'Benin City',
		type: 'point',
		periods: [
			{
				yearRange: [-400, 9999],
				coords: [6, 6],
			},
		],
		periodInfo: [],
		color: 'red',
		source: 'https://en.wikipedia.org/wiki/Benin_City',
	},
	{
		name: 'Berbera',
		type: 'point',
		periods: [
			{
				yearRange: [-400, 9999],
				coords: [10, 45],
			},
		],
		periodInfo: [],
		color: 'red',
		source: 'https://en.wikipedia.org/wiki/Berbera',
	},
	{
		name: 'Bhirrana',
		type: 'point',
		periods: [
			{
				yearRange: [-7570, -2600],
				coords: [30, 76],
			},
		],
		periodInfo: [],
		color: 'red',
		source: 'https://en.wikipedia.org/wiki/Bhirrana',
	},
	{
		name: 'Bonstorf Barrows',
		type: 'point',
		periods: [
			{
				yearRange: [-1500, -1200],
				coords: [53, 10],
			},
		],
		periodInfo: [],
		color: 'red',
		source: 'https://en.wikipedia.org/wiki/Bonstorf_Barrows',
	},
	{
		name: 'Brú na Bóinne',
		type: 'point',
		periods: [
			{
				yearRange: [-4000, -2900],
				coords: [53.7, -6.4],
			},
		],
		periodInfo: [],
		desc: 'Neolithic archaeological complex including monuments and passage graves',
		color: 'red',
		img: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Newgrange.JPG',
		source: 'https://en.wikipedia.org/wiki/Brú_na_Bóinne',
	},
	{
		name: 'Byblos',
		type: 'point',
		periods: [
			{
				yearRange: [-8800, -7000],
				coords: [34, 36],
			},
			{
				yearRange: [-5000, 9999],
				coords: [34, 36],
			},
		],
		periodInfo: [],
		color: 'red',
		source: 'https://en.wikipedia.org/wiki/Byblos',
	},
	{
		name: 'Carthage',
		type: 'point',
		periods: [
			{
				yearRange: [-814, -146],
				coords: [37, 10],
			},
		],
		periodInfo: [],
		color: 'red',
		source: 'https://en.wikipedia.org/wiki/Carthage',
	},
	{
		name: 'Çatalhöyük',
		type: 'point',
		periods: [
			{
				yearRange: [-7500, -5700],
				coords: [38, 33],
			},
		],
		periodInfo: [],
		color: 'red',
		source: 'https://en.wikipedia.org/wiki/Çatalhöyük',
	},
	{
		name: 'Çukuriçi Höyük',
		type: 'point',
		periods: [
			{
				yearRange: [-6700, -6000],
				coords: [38, 27],
			},
			{
				yearRange: [-3500, -2750],
				coords: [38, 27],
			},
		],
		periodInfo: [],
		color: 'red',
		desc: 'Settlement',
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/01_Cukurici_Höyük.tif/lossy-page1-800px-01_Cukurici_Höyük.tif.jpg',
		source: 'https://en.wikipedia.org/wiki/Çukuriçi_Höyük',
	},
	{
		name: 'Cliff Palace',
		type: 'point',
		periods: [
			{
				yearRange: [1190, 1300],
				coords: [37, -108],
			},
		],
		periodInfo: [],
		color: 'red',
		source: 'https://en.wikipedia.org/wiki/Cliff_Palace',
	},
	{
		name: 'Devil\'s Lair',
		type: 'point',
		periods: [
			{
				yearRange: [-46000, -10700],
				coords: [-34, 115],
			},
		],
		periodInfo: [],
		color: 'red',
		source: 'https://en.wikipedia.org/wiki/Devil\'s_Lair',
	},
	{
		name: 'Dispilio',
		type: 'point',
		periods: [
			{
				yearRange: [-5600, -3000],
				coords: [40.5, 21.3],
			},
		],
		periodInfo: [],
		desc: 'Settlement',
		color: 'red',
		source: 'https://en.wikipedia.org/wiki/Dispilio',
	},
	{
		name: 'Domuztepe',
		type: 'point',
		periods: [
			{
				yearRange: [-6200, -5450],
				coords: [37, 37],
			},
		],
		periodInfo: [],
		color: 'red',
		source: 'https://en.wikipedia.org/wiki/Domuztepe',
	},
	{
		name: 'Fox Farm Site',
		type: 'point',
		periods: [
			{
				yearRange: [1200, 1400],
				coords: [39, -84],
			},
		],
		periodInfo: [],
		color: 'red',
		source: 'https://en.wikipedia.org/wiki/Fox_Farm_Site_(Mays_Lick,_Kentucky)',
	},
	{
		name: 'Franchthi Cave',
		type: 'point',
		periods: [
			{
				yearRange: [-38000, -3000],
				coords: [37, 23],
			},
		],
		periodInfo: [],
		color: 'red',
		img: 'https://upload.wikimedia.org/wikipedia/commons/5/57/Franchthi_Cave_from_Koilada_Argolidas.jpg',
		source: 'https://en.wikipedia.org/wiki/Franchthi_Cave',
	},
	{
		name: 'Frankleben Hoard',
		type: 'point',
		periods: [
			{
				yearRange: [-1500, -1250],
				coords: [51, 12],
			},
		],
		periodInfo: [],
		color: 'red',
		source: 'https://en.wikipedia.org/wiki/Frankleben_hoard',
	},
	{
		name: 'Ganweriwal',
		type: 'point',
		periods: [
			{
				yearRange: [-2500, -1900], // latter is an estimate
				coords: [29, 71],
			},
		],
		periodInfo: [],
		color: 'red',
		source: 'https://en.wikipedia.org/wiki/Ganweriwal',
	},
	{
		name: 'Göbekli Tepe',
		type: 'point',
		periods: [
			{
				yearRange: [-10000, -8000],
				coords: [37, 39],
			},
		],
		periodInfo: [],
		color: 'red',
		source: 'https://en.wikipedia.org/wiki/Göbekli_Tepe',
	},
	{
		name: 'Gortyn',
		type: 'point',
		periods: [
			{
				yearRange: [-3200, 9999],
				coords: [35.0, 24.9],
			},
		],
		periodInfo: [],
		desc: 'Settlement',
		color: 'red',
		source: 'https://en.wikipedia.org/wiki/Gortyn',
	},
	{
		name: 'Harappa',
		type: 'point',
		periods: [
			{
				yearRange: [-2600, -1300],
				coords: [31, 73],
			},
		],
		periodInfo: [],
		color: 'red',
		source: 'https://en.wikipedia.org/wiki/Harappa',
	},
	{
		name: 'Hattusa',
		type: 'point',
		periods: [
			{
				yearRange: [-6000, -1200],
				coords: [40, 35],
			},
		],
		periodInfo: [],
		color: 'red',
		source: 'https://en.wikipedia.org/wiki/Hattusa',
	},
	{
		name: 'Hohlenstein-Stadel',
		type: 'point',
		periods: [
			{
				yearRange: [-39000, -33000],
				coords: [49, 10],
			},
		],
		periodInfo: [],
		desc: 'Cave',
		color: 'red',
		source: 'https://en.wikipedia.org/wiki/Hohlenstein-Stadel',
	},
	{
		name: 'Kerma',
		type: 'point',
		periods: [
			{
				yearRange: [-3500, -1100],
				coords: [20, 30],
			},
		],
		periodInfo: [],
		color: 'red',
		source: 'https://en.wikipedia.org/wiki/Kerma',
	},
	{
		name: 'Krzemionki',
		type: 'point',
		periods: [
			{
				yearRange: [-3900, -1600],
				coords: [51, 21],
			},
		],
		periodInfo: [],
		desc: 'Neolithic to Bronze Age flint mine complex',
		color: 'red',
		img: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Krzemionki.JPG',
		source: 'https://en.wikipedia.org/wiki/Krzemionki',
	},
	{
		name: 'Kültəpə',
		type: 'point',
		periods: [
			{
				yearRange: [-4500, 9999],
				coords: [39.3, 45.5],
			},
		],
		periodInfo: [],
		color: 'red',
		source: 'https://en.wikipedia.org/wiki/Kültəpə',
	},
	{
		name: 'Las Cogotas',
		type: 'point',
		periods: [
			{
				yearRange: [-1700, -1000],
				coords: [41, -5],
			},
		],
		periodInfo: [],
		color: 'red',
		source: 'https://en.wikipedia.org/wiki/Las_Cogotas',
	},
	{
		name: 'Luxor',
		type: 'point',
		periods: [
			{
				yearRange: [-3200, 9999],
				coords: [26, 33],
			},
		],
		periodInfo: [],
		color: 'red',
		source: 'https://en.wikipedia.org/wiki/Luxor',
	},
	{
		name: 'Mehrgarh',
		type: 'point',
		periods: [
			{
				yearRange: [-7000, -2600],
				coords: [29, 67],
			},
		],
		periodInfo: [],
		color: 'red',
		source: 'https://en.wikipedia.org/wiki/Mehrgarh',
	},
	{
		name: 'Merheleva Ridge',
		type: 'point',
		periods: [
			{
				yearRange: [-4000, -3000],
				coords: [48, 39],
			},
		],
		periodInfo: [],
		desc: 'Chalcolithic temple and burial complex',
		color: 'red',
		img: 'https://photos.wikimapia.org/p/00/03/70/35/44_big.jpg',
		source: 'https://en.wikipedia.org/wiki/Merheleva_Ridge',
	},
	{
		name: 'Mogadishu',
		type: 'point',
		periods: [
			{
				yearRange: [-200, 9999],
				coords: [2, 45],
			},
		],
		periodInfo: [],
		color: 'red',
		source: 'https://en.wikipedia.org/wiki/Mogadishu',
	},
	{
		name: 'Mohenjo-daro',
		type: 'point',
		periods: [
			{
				yearRange: [-2500, -1900],
				coords: [27, 68],
			},
		],
		periodInfo: [],
		color: 'red',
		source: 'https://en.wikipedia.org/wiki/Mohenjo-daro',
	},
	{
		name: 'Nakhchivan Tepe',
		type: 'point',
		periods: [
			{
				yearRange: [-5000, 9999],
				coords: [39.2, 45.4],
			},
		],
		periodInfo: [],
		color: 'red',
		source: 'https://en.wikipedia.org/wiki/Nakhchivan_Tepe',
	},
	{
		name: 'Nanzhuangtou',
		type: 'point',
		periods: [
			{
				yearRange: [-9500, -9000],
				coords: [39, 116],
			},
		],
		periodInfo: [],
		color: 'red',
		source: 'https://en.wikipedia.org/wiki/Nanzhuangtou',
	},
	{
		name: 'Nevalı Çori',
		type: 'point',
		periods: [
			{
				yearRange: [-8400, -8100],
				coords: [38, 39],
			},
		],
		periodInfo: [],
		color: 'red',
		source: 'https://en.wikipedia.org/wiki/Nevalı_Çori',
	},
	{
		name: 'Osaka',
		type: 'point',
		periods: [
			{
				yearRange: [400, 9999],
				coords: [35, 135],
			},
		],
		periodInfo: [],
		color: 'red',
		source: 'https://en.wikipedia.org/wiki/Osaka',
	},
	{
		name: 'Piedra Museo',
		type: 'point',
		periods: [
			{
				yearRange: [-9000, -9000],
				coords: [-49, -70],
			},
		],
		periodInfo: [],
		color: 'red',
		source: 'https://en.wikipedia.org/wiki/Piedra_Museo',
	},
	{
		name: 'Poverty Point',
		type: 'point',
		periods: [
			{
				yearRange: [-1800, -1200],
				coords: [33, -91],
			},
		],
		periodInfo: [],
		color: 'red',
		source: 'https://en.wikipedia.org/wiki/Poverty_Point',
	},
	{
		name: 'Priniatikos Pyrgos',
		type: 'point',
		periods: [
			{
				yearRange: [-3000, -1000],
				coords: [35.1, 25.7],
			},
		],
		periodInfo: [],
		color: 'red',
		source: 'https://en.wikipedia.org/wiki/Priniatikos_Pyrgos',
	},
	{
		name: 'Rome',
		type: 'point',
		periods: [
			{
				yearRange: [-753, 9999],
				coords: [41.9, 12.5],
			},
		],
		periodInfo: [],
		color: 'red',
		source: 'https://en.wikipedia.org/wiki/Rome',
	},
	{
		name: 'Schnidejoch',
		type: 'point',
		periods: [
			{
				yearRange: [-5000, 1500], // roughly
				coords: [46, 7],
			},
		],
		periodInfo: [],
		desc: 'Mountain Pass',
		color: 'red',
		img: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Aufstieg_wildhornhuette.jpg',
		source: 'https://en.wikipedia.org/wiki/Schnidejoch',
	},
	{
		name: 'Sechin Bajo',
		type: 'point',
		periods: [
			{
				yearRange: [-3500, -1500],
				coords: [-9, -78],
			},
		],
		periodInfo: [],
		color: 'red',
		img: 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Sechin_casma_valley.JPG',
		source: 'https://en.wikipedia.org/wiki/Sechin_Bajo',
	},
	{
		name: 'Teleilat el Ghassul',
		type: 'point',
		periods: [
			{
				yearRange: [-4400, -3500],
				coords: [32, 36],
			},
		],
		periodInfo: [],
		color: 'red',
		source: 'https://en.wikipedia.org/wiki/Teleilat_el_Ghassul',
	},
	{
		name: 'Tell Qaramel',
		type: 'point',
		periods: [
			{
				yearRange: [-10700, -9400],
				coords: [36, 37],
			},
		],
		periodInfo: [],
		color: 'red',
		source: 'https://en.wikipedia.org/wiki/Tell_Qaramel',
	},
	{
		name: 'Tholos de El Romeral',
		type: 'point',
		periods: [
			{
				yearRange: [-1800, -1800],
				coords: [37, 5],
			},
		],
		periodInfo: [],
		color: 'red',
		source: 'https://en.wikipedia.org/wiki/Tholos_de_El_Romeral',
	},
	{
		name: 'Tripoli',
		type: 'point',
		periods: [
			{
				yearRange: [-700, 9999],
				coords: [33, 13],
			},
		],
		periodInfo: [],
		color: 'red',
		source: 'https://en.wikipedia.org/wiki/Tripoli',
	},
	{
		name: 'Troy',
		type: 'point',
		periods: [
			{
				yearRange: [-3000, 500],
				coords: [40, 26],
			},
		],
		periodInfo: [
			{
				yearRange: [-3000, -2600],
				desc: 'Troy I',
			},
			{
				yearRange: [-2600, -2250],
				desc: 'Troy II',
			},
			{
				yearRange: [-2250, -2100],
				desc: 'Troy III',
			},
			{
				yearRange: [-2100, -1950],
				desc: 'Troy IV',
			},
			{
				yearRange: [-1950, -1800],
				desc: 'Troy V',
			},
			{
				yearRange: [-1800, -1500],
				desc: 'Troy VI',
			},
			{
				yearRange: [-1500, -1400],
				desc: 'Troy VIh',
			},
			{
				yearRange: [-1300, -1190],
				desc: 'Troy VIIa',
			},
			{
				yearRange: [-1190, -1100],
				desc: 'Troy VIIb1',
			},
			{
				yearRange: [-1100, -1000],
				desc: 'Troy VIIb2',
			},
			{
				yearRange: [-1000, -950],
				desc: 'Troy VIIb3',
			},
			{
				yearRange: [-950, -85],
				desc: 'Troy VIII',
			},
			{
				yearRange: [-85, 500],
				desc: 'Troy IX',
			},
		],
		color: 'red',
		source: 'https://en.wikipedia.org/wiki/Troy',
	},
	{
		name: 'Upward Sun River Site',
		type: 'point',
		periods: [
			{
				yearRange: [-9500, -7000],
				coords: [64.4, -147.0],
			},
		],
		periodInfo: [],
		color: 'red',
		source: 'https://en.wikipedia.org/wiki/Upward_Sun_River_site',
	},
	{
		name: 'Ur',
		type: 'point',
		periods: [
			{
				yearRange: [-3800, -500],
				coords: [31, 46],
			},
		],
		periodInfo: [],
		color: 'red',
		source: 'https://en.wikipedia.org/wiki/Ur',
	},
	{
		name: 'Uruk',
		type: 'point',
		periods: [
			{
				yearRange: [-4000, 700],
				coords: [31, 46],
			},
		],
		periodInfo: [],
		color: 'red',
		source: 'https://en.wikipedia.org/wiki/Uruk',
	},
	{
		name: 'Yanshi',
		type: 'point',
		periods: [
			{
				yearRange: [-1900, 0],
				coords: [35, 113],
			},
		],
		periodInfo: [],
		color: 'red',
		source: 'https://en.wikipedia.org/wiki/Yanshi',
	},
	{
		name: 'Yaz Culture',
		type: 'point',
		periods: [
			{
				yearRange: [-1500, -500],
				coords: [38, 58],
			},
		],
		periodInfo: [],
		color: 'black',
		source: 'https://en.wikipedia.org/wiki/Yaz_culture',
	},
	{
		name: 'Watson Brake',
		type: 'point',
		periods: [
			{
				yearRange: [-3500, -3000],
				coords: [32, -92],
			},
		],
		periodInfo: [],
		color: 'red',
		img: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Watson_Brake_Aerial_Illustration_HRoe_2014.jpg',
		source: 'https://en.wikipedia.org/wiki/Watson_Brake',
	},
	{
		name: 'Wieliczka Salt Mine',
		type: 'point',
		periods: [
			{
				yearRange: [1200, 2007],
				coords: [50, 20],
			},
		],
		periodInfo: [],
		color: 'red',
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Wieliczka_salt_mine.jpg/260px-Wieliczka_salt_mine.jpg',
		source: 'https://en.wikipedia.org/wiki/Wieliczka_Salt_Mine',
	},
	// well-known buildings
	{
		name: 'Alcántara Bridge',
		type: 'point',
		periods: [
			{
				yearRange: [106, 9999],
				coords: [39.7224, -6.8924],
			},
		],
		periodInfo: [],
		desc: 'Roman bridge',
		color: 'orange',
		img: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Bridge_Alcantara.JPG',
		source: 'https://en.wikipedia.org/wiki/Alcántara_Bridge',
	},
	{
		name: 'Alhambra',
		type: 'point',
		periods: [
			{
				yearRange: [889, 9999],
				coords: [37.17695, -3.59001],
			},
		],
		periodInfo: [],
		desc: 'Palace and fortress complex',
		color: 'orange',
		img: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Dawn_Charles_V_Palace_Alhambra_Granada_Andalusia_Spain.jpg',
		source: 'https://en.wikipedia.org/wiki/Alhambra',
	},
	{
		name: 'Areni-1 winery',
		type: 'point',
		periods: [
			{
				yearRange: [-4100, 4000],
				coords: [40, 45],
			},
		],
		periodInfo: [],
		color: 'orange',
		source: 'https://en.wikipedia.org/wiki/Areni-1_winery',
	},
	{
		name: 'Bent Pyramid',
		type: 'point',
		periods: [
			{
				yearRange: [-2580, 9999],
				coords: [29.388056, 31.156944],
			},
		],
		periodInfo: [],
		desc: 'Tomb',
		color: 'orange',
		img: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Snefru\'s_Bent_Pyramid_in_Dahshur.jpg',
		source: 'https://en.wikipedia.org/wiki/Bent_Pyramid',
	},
	{
		name: 'Biniai Nou hypogea',
		type: 'point',
		periods: [
			{
				yearRange: [-2290, -2030],
				coords: [40, 4],
			},
		],
		periodInfo: [],
		color: 'orange',
		source: 'https://en.wikipedia.org/wiki/Biniai_Nou_hypogea',
	},
	{
		name: 'Borġ in-Nadur',
		type: 'point',
		periods: [
			{
				yearRange: [-2500, -500],
				coords: [36, 15],
			},
		],
		periodInfo: [],
		color: 'orange',
		source: 'https://en.wikipedia.org/wiki/Borġ_in-Nadur',
	},
	{
		name: 'Chalcolithic Temple of Ein Gedi',
		type: 'point',
		periods: [
			{
				yearRange: [-3500, -3500],
				coords: [31, 35],
			},
		],
		periodInfo: [],
		color: 'orange',
		source: 'https://en.wikipedia.org/wiki/Chalcolithic_Temple_of_Ein_Gedi',
	},
	{
		name: 'Colosseum',
		type: 'point',
		periods: [
			{
				yearRange: [80, 9999],
				coords: [41.890361, 12.4896418],
			},
		],
		periodInfo: [],
		desc: 'Classical Roman amphitheater',
		color: 'orange',
		img: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Colosseum_in_Rome%2C_Italy_-_April_2007.jpg',
		source: 'https://en.wikipedia.org/wiki/Colosseum',
	},
	{
		name: 'Colossus of Rhodes',
		type: 'point',
		periods: [
			{
				yearRange: [-280, -226],
				coords: [36.45111, 28.22778],
			},
		],
		periodInfo: [],
		desc: 'One of the seven wonders of the ancient world',
		color: 'orange',
		source: 'https://en.wikipedia.org/wiki/Colossus_of_Rhodes',
	},
	{
		name: 'Great Pyramid of Giza',
		type: 'point',
		periods: [
			{
				yearRange: [-2560, 9999],
				coords: [29.9791667, 31.13444],
			},
		],
		periodInfo: [],
		desc: 'Tomb of Khufu and one of the seven wonders of the ancient world',
		color: 'orange',
		img: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Kheops-Pyramid.jpg',
		source: 'https://en.wikipedia.org/wiki/Great_Pyramid_of_Giza',
	},
	{
		name: 'Haia Sophia',
		type: 'point',
		periods: [
			{
				yearRange: [532, 9999],
				coords: [41.0086111, 28.98],
			},
		],
		periodInfo: [],
		desc: 'Former Greek Orthodox Christian patriarchal cathedral, later an Ottoman imperial mosque, now a museum',
		color: 'orange',
		img: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Hagia_Sophia_Mars_2013.jpg',
		source: 'https://en.wikipedia.org/wiki/Hagia_Sophia',
	},
	{
		name: 'Ħal-Saflieni Hypogeum',
		type: 'point',
		periods: [
			{
				yearRange: [-4000, -2500],
				coords: [35.9, 14.5],
			},
		],
		periodInfo: [],
		desc: 'Sanctuary and Necropolis',
		color: 'orange',
		img: 'https://upload.wikimedia.org/wikipedia/commons/0/06/Photo_Ellis_Hal_Salflieni.jpg',
		source: 'https://en.wikipedia.org/wiki/Ħal-Saflieni_Hypogeum',
	},
	{
		name: 'Maison Carrée',
		type: 'point',
		periods: [
			{
				yearRange: [2, 9999],
				coords: [43.838333, 4.356111],
			},
		],
		periodInfo: [],
		desc: 'Roman temple',
		color: 'orange',
		img: 'https://upload.wikimedia.org/wikipedia/commons/1/10/MaisonCarrée.jpeg',
		source: 'https://en.wikipedia.org/wiki/Maison_Carrée',
	},
	{
		name: 'Mausoleum at Halicarnassus',
		type: 'point',
		periods: [
			{
				yearRange: [-351, 1494],
				coords: [37.03778, 27.4241667],
			},
		],
		periodInfo: [],
		desc: 'Tomb of Mausolus and one of the wonders of the ancient world',
		color: 'orange',
		img: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Mausoleum_at_Halicarnassus_at_the_Bodrum_Museum_of_Underwater_Archaeology.jpg',
		source: 'https://en.wikipedia.org/wiki/Mausoleum_at_Halicarnassus',
	},
	{
		name: 'Mausoleum of Pozo Moro',
		type: 'point',
		periods: [
			{
				yearRange: [-600, 9999],
				coords: [38.836389, -1.696667],
			},
		],
		periodInfo: [],
		desc: 'Iberian Mausoleum',
		color: 'orange',
		img: 'https://upload.wikimedia.org/wikipedia/commons/6/65/Monumento_de_Pozo_Moro_(M.A.N._Inv.1999-76-A)_01.jpg',
		source: 'https://en.wikipedia.org/wiki/Mausoleum_of_Pozo_Moro',
	},
	{
		name: 'Mont Saint-Michel',
		type: 'point',
		periods: [
			{
				yearRange: [460, 9999],
				coords: [48.636111, -1.5113889],
			},
		],
		periodInfo: [],
		desc: 'Fortified island commune',
		color: 'orange',
		img: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Mont-Saint-Michel_Drone.jpg',
		source: 'https://en.wikipedia.org/wiki/Mont-Saint-Michel',
	},
	{
		name: 'Lighthouse of Alexandria',
		type: 'point',
		periods: [
			{
				yearRange: [-246, 1307],
				coords: [31.213889, 29.88556],
			},
		],
		periodInfo: [],
		desc: 'One of the wonders of the ancient world',
		color: 'orange',
		img: 'https://upload.wikimedia.org/wikipedia/commons/3/33/PHAROS2013-3000x2250.jpg',
		source: 'https://en.wikipedia.org/wiki/Lighthouse_of_Alexandria',
	},
	{
		name: 'Parthenon',
		type: 'point',
		periods: [
			{
				yearRange: [-432, 1687],
				coords: [37.9713889, 23.7263889],
			},
		],
		periodInfo: [],
		desc: 'Temple to Athena',
		color: 'orange',
		img: 'https://upload.wikimedia.org/wikipedia/commons/d/da/The_Parthenon_in_Athens.jpg',
		source: 'https://en.wikipedia.org/wiki/Parthenon',
	},
	{
		name: 'Pyramid of Djoser',
		type: 'point',
		periods: [
			{
				yearRange: [-2648, 9999],
				coords: [29.871267, 31.216394],
			},
		],
		periodInfo: [],
		desc: 'Tomb and oldest pyramid',
		color: 'orange',
		img: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Saqqara_pyramid_ver_2.jpg',
		source: 'https://en.wikipedia.org/wiki/Pyramid_of_Djoser',
	},
	{
		name: 'Pyramid of Khafre',
		type: 'point',
		periods: [
			{
				yearRange: [-2570, 9999],
				coords: [29.976111, 31.130833],
			},
		],
		periodInfo: [],
		desc: 'Tomb',
		color: 'orange',
		img: 'https://upload.wikimedia.org/wikipedia/commons/7/71/Pyramid_of_Khafre_Giza_Egypt_in_2015_2.jpg',
		source: 'https://en.wikipedia.org/wiki/Pyramid_of_Khafre',
	},
	{
		name: 'Pyramid of Meidum',
		type: 'point',
		periods: [
			{
				yearRange: [-2580, 9999],
				coords: [29.388056, 31.156944],
			},
		],
		periodInfo: [],
		desc: 'Tomb',
		color: 'orange',
		img: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Meidoum_pyramide_003.JPG',
		source: 'https://en.wikipedia.org/wiki/Meidum',
	},
	{
		name: 'St. Peter\'s Basilica',
		type: 'point',
		periods: [
			{
				yearRange: [1626, 9999],
				coords: [41.90222, 12.45333],
			},
		],
		periodInfo: [],
		desc: 'Italian Renaissance church in Vatican City',
		color: 'orange',
		img: 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Rome_San_Pietro.jpg',
		source: 'https://en.wikipedia.org/wiki/St._Peter\'s_Basilica',
	},
	{
		name: 'Statue of Zeus',
		type: 'point',
		periods: [
			{
				yearRange: [-435, 475], // rough estimate
				coords: [37.63786111, 21.63],
			},
		],
		periodInfo: [],
		desc: 'One of the seven wonders of the ancient world',
		color: 'orange',
		source: 'https://en.wikipedia.org/wiki/Statue_of_Zeus_at_Olympia',
	},
	{
		name: 'Stonehenge',
		type: 'point',
		periods: [
			{
				yearRange: [-3000, 9999], // rough estimate
				coords: [51.17889, -1.826111],
			},
		],
		periodInfo: [],
		desc: 'Ring of standing stones',
		color: 'orange',
		img: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Stonehenge2007_07_30.jpg',
		source: 'https://en.wikipedia.org/wiki/Stonehenge',
	},
	{
		name: 'Temple of Artemis',
		type: 'point',
		periods: [
			{
				yearRange: [-432, 262],
				coords: [37.9497222, 27.363889],
			},
		],
		periodInfo: [],
		desc: 'Temple to Artemis and one of the seven wonders of the ancient world',
		color: 'orange',
		img: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Miniaturk_009.jpg',
		source: 'https://en.wikipedia.org/wiki/Temple_of_Artemis',
	},
	{
		name: 'Tower of Hercules',
		type: 'point',
		periods: [
			{
				yearRange: [100, 9999],
				coords: [43.3858333, -8.4063889],
			},
		],
		periodInfo: [],
		desc: 'Ancient Roman lighthouse',
		color: 'orange',
		img: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/A_coruna_torre_de_hercules_sunset_edit.jpg',
		source: 'https://en.wikipedia.org/wiki/Tower_of_Hercules',
	},
	{
		name: 'Xagħra Stone Circle',
		type: 'point',
		periods: [
			{
				yearRange: [-4100, -2000],
				coords: [36.0, 14.3],
			},
		],
		periodInfo: [],
		desc: 'Funerary Complex',
		color: 'orange',
		img: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Hypogée_de_Xaghra.jpg',
		source: 'https://en.wikipedia.org/wiki/Xagħra_Stone_Circle',
	},
	// beyond cities and nations and cultures...
	{
		name: 'Anzick-1',
		type: 'point',
		periods: [
			{
				yearRange: [-10630, -10630],
				coords: [46, -111],
			},
		],
		periodInfo: [],
		desc: 'Skeleton',
		color: 'cyan',
		source: 'https://en.wikipedia.org/wiki/Anzick-1',
	},
	{
		name: 'Arlington Springs Man',
		type: 'point',
		periods: [
			{
				yearRange: [-11050, -11000], // age is guess
				coords: [34, -120],
			},
		],
		periodInfo: [],
		desc: 'Skeleton',
		color: 'cyan',
		source: 'https://en.wikipedia.org/wiki/Arlington_Springs_Man',
	},
	{
		name: 'Buhl Woman',
		type: 'point',
		periods: [
			{
				yearRange: [-8725, -8675], // age is guess
				coords: [34, -120],
			},
		],
		periodInfo: [],
		desc: 'Skeleton',
		color: 'cyan',
		source: 'https://en.wikipedia.org/wiki/Buhl_Woman',
	},
	{
		name: 'Cheddar Man',
		type: 'point',
		periods: [
			{
				yearRange: [-7200, -7000], // 7100 bc
				coords: [51, -3],
			},
		],
		periodInfo: [],
		desc: 'Fossil<br>Y-DNA haplogroup: I2a2<br>mt-DNA haplogroup: U5b1',
		color: 'cyan',
		img: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Cheddar_Man_scull.jpg',
		source: 'https://en.wikipedia.org/wiki/Cheddar_Man',
	},
	{
		name: 'Eve of Naharon',
		type: 'point',
		periods: [
			{
				yearRange: [-11650, -11600], // age is guess
				coords: [20, -87],
			},
		],
		periodInfo: [],
		desc: 'Skeleton',
		color: 'cyan',
		source: 'https://en.wikipedia.org/wiki/Eve_of_Naharon',
	},
	{
		name: 'Kennewick Man',
		type: 'point',
		periods: [
			{
				yearRange: [-7000, -6950],
				coords: [46, -119],
			},
		],
		periodInfo: [],
		desc: 'Skeleton<br>Y-DNA haplogroup: Q-M3<br>mt-DNA haplogroup: X2a',
		color: 'cyan',
		img: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Kennewick_Man.jpg',
		source: 'https://en.wikipedia.org/wiki/Kennewick_Man',
	},
	{
		name: 'Koelbjerg Man',
		type: 'point',
		periods: [
			{
				yearRange: [-8025, -8000],
				coords: [55, 10],
			},
		],
		periodInfo: [],
		desc: 'Bog body',
		color: 'cyan',
		source: 'https://en.wikipedia.org/wiki/Koelbjerg_Man',
	},
	{
		name: 'La Brea Woman',
		type: 'point',
		periods: [
			{
				yearRange: [-8285, -8235], // age is guess
				coords: [34, -118],
			},
		],
		periodInfo: [],
		desc: 'Skeleton',
		color: 'cyan',
		source: 'https://en.wikipedia.org/wiki/La_Brea_Woman',
	},
	{
		name: 'Lansing Man',
		type: 'point',
		periods: [
			{
				yearRange: [-3629, -3579], // age is guess
				coords: [35, -95],
			},
		],
		periodInfo: [],
		desc: 'Skeleton',
		color: 'cyan',
		source: 'https://en.wikipedia.org/wiki/Lansing_Man',
	},
	{
		name: 'Luzia Woman',
		type: 'point',
		periods: [
			{
				yearRange: [-9527, -9477], // age is guess
				coords: [-20, -44],
			},
		],
		periodInfo: [],
		desc: 'Skeleton',
		color: 'cyan',
		source: 'https://en.wikipedia.org/wiki/Luzia_Woman',
	},
	{
		name: 'Minnesota Woman',
		type: 'point',
		periods: [
			{
				yearRange: [-5940, -5890], // age is guess
				coords: [47, -96],
			},
		],
		periodInfo: [],
		desc: 'Skeleton',
		color: 'cyan',
		source: 'https://en.wikipedia.org/wiki/Minnesota_Woman',
	},
	{
		name: 'Mummy Juanita',
		type: 'point',
		periods: [
			{
				yearRange: [1440, 1480], // age is guess
				coords: [-15.8, -71.9],
			},
		],
		periodInfo: [],
		desc: 'Mummy of a young girl<br>mt-DNA haplogroup: A',
		color: 'cyan',
		source: 'https://en.wikipedia.org/wiki/Mummy_Juanita',
	},
	{
		name: 'Naia',
		type: 'point',
		periods: [
			{
				yearRange: [-10050, -10000], // age is guess
				coords: [20, -87],
			},
		],
		periodInfo: [],
		desc: 'Skeleton of a teenage girl<br>mt-DNA haplogroup D1',
		color: 'cyan',
		source: 'https://en.wikipedia.org/wiki/Naia_(skeleton)',
	},
	{
		name: 'Ötzi',
		type: 'point',
		periods: [
			{
				yearRange: [-3345, -3300],
				coords: [47, 11],
			},
		],
		periodInfo: [],
		desc: 'Natural mummy<br>Y-DNA haplogroup: G2a2b<br>mt-DNA haplogroup: K1',
		color: 'cyan',
		img: 'https://upload.wikimedia.org/wikipedia/en/1/1d/OetzitheIceman02.jpg',
		source: 'https://en.wikipedia.org/wiki/Ötzi',
	},
	{
		name: 'Pagliacci 23',
		type: 'point',
		periods: [
			{
				yearRange: [-27000, -25000], // 28kya
				coords: [42, 16],
			},
		],
		periodInfo: [],
		desc: 'Remains<br>mt-DNA haplogroup: R',
		color: 'cyan',
		source: 'https://en.wikipedia.org/wiki/Paglicci_23',
	},
	{
		name: 'Pagliacci 25',
		type: 'point',
		periods: [
			{
				yearRange: [-22000, -20000], // 23kya
				coords: [42, 16],
			},
		],
		periodInfo: [],
		desc: 'Remains<br>mt-DNA haplogroup: HV',
		color: 'cyan',
		source: 'https://en.wikipedia.org/wiki/Paglicci_25',
	},
	{
		name: 'Peñon Woman',
		type: 'point',
		periods: [
			{
				yearRange: [-10750, -10700], // age is guess
				coords: [19, -99],
			},
		],
		periodInfo: [],
		desc: 'Skeleton',
		color: 'cyan',
		source: 'https://en.wikipedia.org/wiki/Peñon_woman',
	},
	{
		name: 'Ramesses III',
		type: 'point',
		periods: [
			{
				yearRange: [-1217, -1155],
				coords: [25.739889, 32.601083],
			},
		],
		periodInfo: [],
		desc: 'Egyptian Pharaoh of the 20th dynasty (New Kingdom)<br>Y-DNA haplogroup: E1b1a',
		color: 'cyan',
		img: 'https://upload.wikimedia.org/wikipedia/commons/b/b7/KhonsuTemple-Karnak-RamessesIII-2.jpg',
		source: 'https://en.wikipedia.org/wiki/Ramesses_III',
	},
	{
		name: 'Spirit Cave Mummy',
		type: 'point',
		periods: [
			{
				yearRange: [-9550, -9500], // age is guess
				coords: [39, -119],
			},
		],
		periodInfo: [],
		desc: 'Mummy',
		color: 'cyan',
		source: 'https://en.wikipedia.org/wiki/Spirit_Cave_mummy',
	},
	{
		name: 'Tollund Man',
		type: 'point',
		periods: [
			{
				yearRange: [-415, -375],
				coords: [56, 9],
			},
		],
		periodInfo: [],
		desc: 'Bog body',
		color: 'cyan',
		source: 'https://en.wikipedia.org/wiki/Tollund_Man',
	},
	{
		name: 'Tutankhamun',
		type: 'point',
		periods: [
			{
				yearRange: [-1334, -1325],
				coords: [25.740222, 32.601333],
			},
		],
		periodInfo: [],
		desc: 'Egyptian Pharaoh of the 18th dynasty (New Kingdom)<br>Y-DNA haplogroup: R1b<br>mt-DNA haplogroup: K',
		color: 'cyan',
		img: 'https://upload.wikimedia.org/wikipedia/commons/2/27/CairoEgMuseumTaaMaskMostlyPhotographed.jpg',
		source: 'https://en.wikipedia.org/wiki/Tutankhamun',
	},
	{
		name: 'Tuqan Man',
		type: 'point',
		periods: [
			{
				yearRange: [-10050, -10000], // age is guess
				coords: [39, -119],
			},
		],
		periodInfo: [],
		desc: 'Skeleton',
		color: 'cyan',
		source: 'https://en.wikipedia.org/wiki/Tuqan_Man',
	},
	{
		name: 'Ust\'-Ishim Man',
		type: 'point',
		periods: [
			{
				yearRange: [-44000, -42000], // 45kya
				coords: [57.744, 71.2],
			},
		],
		periodInfo: [],
		desc: 'Skeleton<br>Y-DNA haplogroup: K2a*<br>mt-DNA haplogroup: R*',
		color: 'cyan',
		source: 'https://en.wikipedia.org/wiki/Ust%27-Ishim_man',
	},
	// haplogroup origins https://www.yfull.com/tree/R/
	{
		name: 'Haplogroup A',
		type: 'point',
		periods: [
			{
				yearRange: [-167900, -150900],
				coords: [5, 15],
			},
		],
		periodInfo: [],
		desc: 'Y-DNA',
		color: 'magenta',
		img: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Distribution_of_Y-Chromosome_Haplogroup_A_in_Africa.png',
		source: 'https://en.wikipedia.org/wiki/Haplogroup_A_(Y-DNA)',
	},
	{
		name: 'Haplogroup B',
		type: 'point',
		periods: [
			{
				yearRange: [-88300, -77400],
				coords: [0, 25],
			},
		],
		periodInfo: [],
		desc: 'Y-DNA; from BT',
		color: 'magenta',
		source: 'https://en.wikipedia.org/wiki/Haplogroup_B-M60',
	},
	{
		name: 'Haplogroup BT',
		type: 'point',
		periods: [
			{
				yearRange: [-90500, -81600],
				coords: [-4, 32],
			},
		],
		periodInfo: [],
		desc: 'Y-DNA; from A1b',
		color: 'magenta',
		source: 'https://en.wikipedia.org/wiki/Haplogroup_BT',
	},
	{
		name: 'Haplogroup C',
		type: 'point',
		periods: [
			{
				yearRange: [-69800, -60700],
				coords: [29, 53],
			},
		],
		periodInfo: [],
		desc: 'Y-DNA; from CF',
		color: 'magenta',
		img: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Geographic_distributions_of_Y_chromosome_haplogroups_C_in_East_Asia.png',
		source: 'https://en.wikipedia.org/wiki/Haplogroup_C-M130',
	},
	{
		name: 'Haplogroup CF',
		type: 'point',
		periods: [
			{
				yearRange: [-67100, -60700],
				coords: [14, 44],
			},
		],
		periodInfo: [],
		desc: 'Y-DNA; from CT',
		color: 'magenta',
		source: 'https://en.wikipedia.org/wiki/Haplogroup_CF',
	},
	{
		name: 'Haplogroup CT',
		type: 'point',
		periods: [
			{
				yearRange: [-69800, -63200],
				coords: [8, 33],
			},
		],
		periodInfo: [],
		desc: 'Y-DNA; from BT',
		color: 'magenta',
		source: 'https://en.wikipedia.org/wiki/Haplogroup_CT',
	},
	{
		name: 'Haplogroup DE',
		type: 'point',
		periods: [
			{
				yearRange: [-66300, -60100],
				coords: [12, 33],
			},
		],
		periodInfo: [],
		desc: 'Y-DNA; from CT',
		color: 'magenta',
		source: 'https://en.wikipedia.org/wiki/Haplogroup_DE',
	},
	{
		name: 'Haplogroup D',
		type: 'point',
		periods: [
			{
				yearRange: [-47300, -41700],
				coords: [17, 36],
			},
		],
		periodInfo: [],
		desc: 'Y-DNA; from DE',
		color: 'magenta',
		source: 'https://en.wikipedia.org/wiki/Haplogroup_D-CTS3946',
	},
	{
		name: 'Haplogroup E',
		type: 'point',
		periods: [
			{
				yearRange: [-54300, -46400],
				coords: [14, 25],
			},
		],
		periodInfo: [],
		desc: 'Y-DNA; from DE',
		color: 'magenta',
		source: 'https://en.wikipedia.org/wiki/Haplogroup_E-M96',
	},
	{
		name: 'Haplogroup E1b1b',
		type: 'point',
		periods: [
			{
				yearRange: [-33600, -28400],
				coords: [16, 38],
			},
		],
		periodInfo: [],
		desc: 'Y-DNA; from E1b1',
		color: 'magenta',
		source: 'https://en.wikipedia.org/wiki/Haplogroup_E-M215_(Y-DNA)',
	},
	{
		name: 'Haplogroup F',
		type: 'point',
		periods: [
			{
				yearRange: [-49400, -44300],
				coords: [24, 74],
			},
		],
		periodInfo: [],
		desc: 'Y-DNA; from CF',
		color: 'magenta',
		source: 'https://en.wikipedia.org/wiki/Haplogroup_F-M89',
	},
	{
		name: 'Haplogroup G',
		type: 'point',
		periods: [
			{
				yearRange: [-25200, -21300],
				coords: [48, 54],
			},
		],
		periodInfo: [],
		desc: 'Y-DNA; from CF',
		color: 'magenta',
		img: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Haplogrupo_G_%28ADN-Y%29.PNG',
		source: 'https://en.wikipedia.org/wiki/Haplogroup_G-M201',
	},
	{
		name: 'Haplogroup H',
		type: 'point',
		periods: [
			{
				yearRange: [-46400, -40900],
				coords: [18, 79],
			},
		],
		periodInfo: [],
		desc: 'Y-DNA; from HIJK',
		color: 'magenta',
		img: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Y_haplo_H.png',
		source: 'https://en.wikipedia.org/wiki/Haplogroup_H_(Y-DNA)',
	},
	{
		name: 'Haplogroup I',
		type: 'point',
		periods: [
			{
				yearRange: [-27800, -23200],
				coords: [50, 15],
			},
		],
		periodInfo: [],
		desc: 'Y-DNA; from IJ',
		color: 'magenta',
		source: 'https://en.wikipedia.org/wiki/Haplogroup_I-M170',
	},
	{
		name: 'Haplogroup J',
		type: 'point',
		periods: [
			{
				yearRange: [-32000, -27200],
				coords: [32, 45],
			},
		],
		periodInfo: [],
		desc: 'Y-DNA; from IJ',
		color: 'magenta',
		img: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Haplogroup_J_%28Y-DNA%29.PNG',
		source: 'https://en.wikipedia.org/wiki/Haplogroup_J_(Y-DNA)',
	},
	{
		name: 'Haplogroup K2b',
		type: 'point',
		periods: [
			{
				yearRange: [-43400, -41000],
				coords: [20, 100],
			},
		],
		periodInfo: [],
		desc: 'Y-DNA; from K2',
		color: 'magenta',
		source: 'https://en.wikipedia.org/wiki/Haplogroup_K2b_(Y-DNA)',
	},
	{
		name: 'Haplogroup L',
		type: 'point',
		periods: [
			{
				yearRange: [-23500, -18800],
				coords: [32, 68],
			},
		],
		periodInfo: [],
		desc: 'Y-DNA; from LT',
		color: 'magenta',
		img: 'https://upload.wikimedia.org/wikipedia/commons/4/42/Distribution_Haplogroup_L_Y-DNA.svg',
		source: 'https://en.wikipedia.org/wiki/Haplogroup_L-M20',
	},
	{
		name: 'Haplogroup LT',
		type: 'point',
		periods: [
			{
				yearRange: [-43500, -37700],
				coords: [34, 48],
			},
		],
		periodInfo: [],
		desc: 'Y-DNA; from LT',
		color: 'magenta',
		img: 'https://upload.wikimedia.org/wikipedia/commons/0/09/Haplogroup_LT_%28L298-P326%29.png',
		source: 'https://en.wikipedia.org/wiki/Haplogroup_LT',
	},
	{
		name: 'Haplogroup M',
		type: 'point',
		periods: [
			{
				yearRange: [-10400, -7300],
				coords: [-3, 126],
			},
		],
		periodInfo: [],
		desc: 'Y-DNA; from MS',
		color: 'magenta',
		source: 'https://en.wikipedia.org/wiki/Haplogroup_M-P256',
	},
	{
		name: 'Haplogroup MS',
		type: 'point',
		periods: [
			{
				yearRange: [-43400, -41000],
				coords: [20, 105],
			},
		],
		periodInfo: [],
		desc: 'Y-DNA; from K2b',
		color: 'magenta',
		source: 'https://en.wikipedia.org/wiki/Haplogroup_K2b1_(Y-DNA)',
	},
	{
		name: 'Haplogroup N',
		type: 'point',
		periods: [
			{
				yearRange: [-22300, -17800],
				coords: [25, 110],
			},
		],
		periodInfo: [],
		desc: 'Y-DNA; from NO',
		color: 'magenta',
		img: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Haplogrupo_N_%28ADN-Y%29.PNG',
		source: 'https://en.wikipedia.org/wiki/Haplogroup_N-M231',
	},
	{
		name: 'Haplogroup NO',
		type: 'point',
		periods: [
			{
				yearRange: [-37300, -32300],
				coords: [35, 110],
			},
		],
		periodInfo: [],
		desc: 'Y-DNA; from K2a1',
		color: 'magenta',
		img: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Haplogroup_NO.png',
		source: 'https://en.wikipedia.org/wiki/Haplogroup_NO',
	},
	{
		name: 'Haplogroup O',
		type: 'point',
		periods: [
			{
				yearRange: [-30400, -26700],
				coords: [35, 115],
			},
		],
		periodInfo: [],
		desc: 'Y-DNA; from NO',
		color: 'magenta',
		img: 'https://upload.wikimedia.org/wikipedia/commons/6/65/Haplogrupo_O_%28ADN-Y%29.PNG',
		source: 'https://en.wikipedia.org/wiki/Haplogroup_O-M175',
	},
	{
		name: 'Haplogroup P',
		type: 'point',
		periods: [
			{
				yearRange: [-40000, -38900],
				coords: [56, 104],
			},
		],
		periodInfo: [],
		desc: 'Y-DNA; from K2b',
		color: 'magenta',
		source: 'https://en.wikipedia.org/wiki/Haplogroup_P_(Y-DNA)',
	},
	{
		name: 'Haplogroup Q',
		type: 'point',
		periods: [
			{
				yearRange: [-29000, -24500],
				coords: [61, 92],
			},
		],
		periodInfo: [],
		desc: 'Y-DNA; from P1',
		color: 'magenta',
		img: 'https://upload.wikimedia.org/wikipedia/commons/6/67/Global_frequency_distribution_map_of_haplogroup_Q-M242_%28Y-DNA%29.png',
		source: 'https://en.wikipedia.org/wiki/Haplogroup_Q-M242',
	},
	{
		name: 'Haplogroup Q-M3',
		type: 'point',
		periods: [
			{
				yearRange: [-12300, -9100],
				coords: [65, -165],
			},
		],
		periodInfo: [],
		desc: 'Y-DNA; from Q',
		color: 'magenta',
		source: 'https://en.wikipedia.org/wiki/Haplogroup_Q-M3',
	},
	{
		name: 'Haplogroup R',
		type: 'point',
		periods: [
			{
				yearRange: [-28500, -23900],
				coords: [52, 104],
			},
		],
		periodInfo: [],
		desc: 'Y-DNA; from P1',
		color: 'magenta',
		source: 'https://en.wikipedia.org/wiki/Haplogroup_R_(Y-DNA)',
	},
	{
		name: 'Haplogroup R1',
		type: 'point',
		periods: [
			{
				yearRange: [-23100, -18500],
				coords: [49, 64],
			},
		],
		periodInfo: [],
		desc: 'Y-DNA; from R',
		color: 'magenta',
		source: 'https://en.wikipedia.org/wiki/Haplogroup_R1',
	},
	{
		name: 'Haplogroup R1a',
		type: 'point',
		periods: [
			{
				yearRange: [-18100, -14400],
				coords: [40, 42],
			},
		],
		periodInfo: [],
		desc: 'Y-DNA; from R1',
		color: 'magenta',
		source: 'https://en.wikipedia.org/wiki/Haplogroup_R1a',
	},
	{
		name: 'Haplogroup R1b',
		type: 'point',
		periods: [
			{
				yearRange: [-21300, -15500],
				coords: [52, 60],
			},
		],
		periodInfo: [],
		desc: 'Y-DNA; from R1',
		color: 'magenta',
		source: 'https://en.wikipedia.org/wiki/Haplogroup_R1b',
	},
	{
		name: 'Haplogroup R-M269',
		type: 'point',
		periods: [
			{
				yearRange: [-5100, -3700],
				coords: [46, 0],
			},
		],
		periodInfo: [],
		desc: 'Y-DNA; from R1b',
		color: 'magenta',
		img: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Geographical_distribution_of_haplogroup_frequency_of_hgR1b1b2.png',
		source: 'https://en.wikipedia.org/wiki/Haplogroup_R-M269',
	},
	{
		name: 'Haplogroup R2',
		type: 'point',
		periods: [
			{
				yearRange: [-16000, -12600],
				coords: [38, 72],
			},
		],
		periodInfo: [],
		desc: 'Y-DNA; from R',
		color: 'magenta',
		source: 'https://en.wikipedia.org/wiki/Haplogroup_R2',
	},
	{
		name: 'Haplogroup S',
		type: 'point',
		periods: [
			{
				yearRange: [-43400, -41000],
				coords: [-2, 138],
			},
		],
		periodInfo: [],
		desc: 'Y-DNA; from MS',
		color: 'magenta',
		source: 'https://en.wikipedia.org/wiki/Haplogroup_S-B254',
	},
	{
		name: 'Haplogroup T',
		type: 'point',
		periods: [
			{
				yearRange: [-26600, -21800],
				coords: [35, 36],
			},
		],
		periodInfo: [],
		desc: 'Y-DNA; from LT',
		color: 'magenta',
		img: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Distribution_Haplogroup_T_Y-DNA_II.svg',
		source: 'https://en.wikipedia.org/wiki/Haplogroup_T-M184',
	},
];

bigmap();