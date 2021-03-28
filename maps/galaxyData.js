/* global pi */
/* exported data */
'use strict';

const au = 149597870700; // m; exact
const ly = 9460730472580800; // m; exact
const pc = 648e3*au/pi; // m; exact

const data = [
	// Sun, as an example
	{
		name: 'Sun',
		type: 'sun',
		dist: 0, // in m
		ra: [0, 0, 0], // h min s
		dec: [0, 0, 0], // deg arcmin arcsec
		img: 'https://upload.wikimedia.org/wikipedia/commons/5/54/Sun_white.jpg',
	},
	{
		name: 'Sgr A*',
		type: 'star',
		dist: 26673*ly,
		ra: [17, 45, 40.0409],
		dec: [-29, 0, 28.118],
		img: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Sagittarius_A%2A.jpg',
	},
	// main
	// nearby stars
	{
		name: 'Proxima Centauri',
		type: 'star',
		dist: 4.2465*ly,
		ra: [14, 29, 42.94853],
		dec: [-60, 40, 46.1631],
		img: 'https://upload.wikimedia.org/wikipedia/commons/9/95/New_shot_of_Proxima_Centauri%2C_our_nearest_neighbour.jpg',
	},
	// sort by NGC identifier
	{ // NGC 1952
		name: 'Crab Nebula',
		type: 'supernova remnant',
		dist: 6500*ly,
		ra: [5, 34, 31.94],
		dec: [22, 0, 52.2],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Crab_Nebula.jpg/600px-Crab_Nebula.jpg',
	},
	{ // NGC 3372
		name: 'Carina Nebula',
		type: 'emission nebula',
		dist: 8500*ly,
		ra: [10, 45, 8.5],
		dec: [-59, 52, 4],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Eagle_Nebula_from_ESO.jpg/600px-Eagle_Nebula_from_ESO.jpg',
	},
	{ // NGC 6611
		name: 'Eagle Nebula',
		type: 'emission nebula',
		dist: 5700*ly,
		ra: [18, 18, 48],
		dec: [-13, 49, 0],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Eagle_Nebula_from_ESO.jpg/600px-Eagle_Nebula_from_ESO.jpg',
	},
];

const unusedData = [ // objects beyond ~50 kly are outside the galaxy
	// LMC
	{ // NGC 2070
		name: 'Tarantula Nebula',
		type: 'emission nebula',
		dist: 160e3*ly,
		ra: [5, 38, 38],
		dec: [-69, 5.7, 0],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Tarantula_Nebula_TRAPPIST.jpg/594px-Tarantula_Nebula_TRAPPIST.jpg',
		href: 'https://en.wikipedia.org/wiki/Tarantula_Nebula',
	},
];