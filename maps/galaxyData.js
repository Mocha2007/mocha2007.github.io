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
		desc: 'wowie zowie itta starz',
		img: 'https://upload.wikimedia.org/wikipedia/commons/5/54/Sun_white.jpg',
		href: 'https://en.wikipedia.org/wiki/Sun',
	},
	{
		name: 'Sgr A*',
		type: 'star',
		dist: 26673*ly,
		ra: [17, 45, 40.0409],
		dec: [-29, 0, 28.118],
		desc: 'black holes UwU',
		img: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Sagittarius_A%2A.jpg',
		href: 'https://en.wikipedia.org/wiki/Sagittarius_A*',
	},
	// main
	// nearby stars
	{
		name: 'Proxima Centauri',
		type: 'star',
		dist: 4.2465*ly,
		ra: [14, 29, 42.94853],
		dec: [-60, 40, 46.1631],
		desc: 'close boi',
		img: 'https://upload.wikimedia.org/wikipedia/commons/9/95/New_shot_of_Proxima_Centauri%2C_our_nearest_neighbour.jpg',
		href: 'https://en.wikipedia.org/wiki/Proxima_Centauri',
	},
	// messier objects
	{
		name: 'Crab Nebula',
		type: 'supernova remnant',
		dist: 6500*ly,
		ra: [5, 34, 31.94],
		dec: [22, 0, 52.2],
		desc: 'colorful boi',
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Crab_Nebula.jpg/600px-Crab_Nebula.jpg',
		href: 'https://en.wikipedia.org/wiki/Crab_Nebula',
	},
];