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
	// nearby stars (sort by dist)
	/*
	{
		name: 'Proxima Centauri',
		type: 'star',
		dist: 4.2465*ly,
		ra: [14, 29, 42.94853],
		dec: [-60, 40, 46.1631],
		img: 'https://upload.wikimedia.org/wikipedia/commons/9/95/New_shot_of_Proxima_Centauri%2C_our_nearest_neighbour.jpg',
	},
	{
		name: 'Sirius',
		type: 'star',
		dist: 8.6*ly,
		ra: [6, 45, 8.91728],
		dec: [-16, 42, 58.0171],
	},
	*/
	{
		name: 'Canopus',
		type: 'star',
		dist: 310*ly,
		ra: [6, 23, 57.10988],
		dec: [-52, 41, 44.381],
	},
	{
		name: 'Pleiades',
		type: 'open cluster',
		dist: 444*ly,
		ra: [3, 47, 24],
		dec: [24, 7, 0],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Pleiades_large.jpg/640px-Pleiades_large.jpg',
	},
	{
		name: 'Betelgeuse',
		type: 'star',
		dist: 548*ly,
		ra: [5, 55, 10.30536],
		dec: [7, 24, 25.4304],
	},
	{
		name: 'Antares',
		type: 'star',
		dist: 550*ly,
		ra: [16, 29, 24.4597],
		dec: [-26, 25, 55.2094],
	},
	{
		name: 'Lambda Scorpii',
		type: 'star',
		dist: 570*ly,
		ra: [17, 33, 36.52],
		dec: [-37, 6, 13.76],
	},
	{
		name: 'Rigel',
		type: 'star',
		dist: 860*ly,
		ra: [5, 14, 32.2721],
		dec: [-8, 12, 5.8981],
	},
	{
		name: 'Alnilam',
		type: 'star',
		dist: 2000*ly,
		ra: [5, 36, 12.8],
		dec: [-1, 12, 6.9],
	},
	{
		name: 'Deneb',
		type: 'star',
		dist: 2615*ly,
		ra: [20, 41, 25.9],
		dec: [45, 16, 49],
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
	{ // NGC 2237
		name: 'Rosette Nebula',
		type: 'emission nebula',
		dist: 5200*ly,
		ra: [6, 33, 45],
		dec: [4, 49, 54],
		img: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/NGC_2244_Rosette_Nebula.jpg',
	},
	{
		name: 'NGC 2547',
		type: 'open cluster',
		dist: 1190*ly,
		ra: [8, 9, 52.36],
		dec: [-49, 10, 35.01],
		img: 'https://upload.wikimedia.org/wikipedia/commons/7/7f/Star_cluster_NGC_2547.jpg',
	},
	{ // NGC 3372
		name: 'Carina Nebula',
		type: 'emission nebula',
		dist: 8500*ly,
		ra: [10, 45, 8.5],
		dec: [-59, 52, 4],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Eagle_Nebula_from_ESO.jpg/600px-Eagle_Nebula_from_ESO.jpg',
	},
	{ // NGC 6334
		name: 'Cat&apos;s Paw Nebula',
		type: 'emission nebula',
		dist: 5540*ly,
		ra: [17, 20, 50.9],
		dec: [-36, 6, 54],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/PIA22568-CatsPawNebula-Spitzer-20181023.jpg/800px-PIA22568-CatsPawNebula-Spitzer-20181023.jpg',
	},
	{ // NGC 6405
		name: 'Butterfly Cluster',
		type: 'open cluster',
		dist: 1590*ly,
		ra: [17, 40.1, 0],
		dec: [-32, 13, 0],
		img: 'https://upload.wikimedia.org/wikipedia/commons/7/7f/M6a.jpg',
	},
	{ // NGC 6523
		name: 'Lagoon Nebula',
		type: 'emission nebula',
		dist: 4100*ly,
		ra: [18, 3, 37],
		dec: [-24, 23, 12],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/VST_images_the_Lagoon_Nebula.jpg/800px-VST_images_the_Lagoon_Nebula.jpg',
	},
	{ // NGC 6611
		name: 'Eagle Nebula',
		type: 'emission nebula',
		dist: 5700*ly,
		ra: [18, 18, 48],
		dec: [-13, 49, 0],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Eagle_Nebula_from_ESO.jpg/600px-Eagle_Nebula_from_ESO.jpg',
	},
	{ // NGC 6618
		name: 'Omega Nebula',
		type: 'emission nebula',
		dist: 5500*ly,
		ra: [18, 20, 26],
		dec: [-16, 10, 36],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/VST_image_of_the_spectacular_star-forming_region_Messier_17_%28Omega_Nebula%29.jpg/600px-VST_image_of_the_spectacular_star-forming_region_Messier_17_%28Omega_Nebula%29.jpg',
	},
	{
		name: 'NGC 6633',
		type: 'open cluster',
		dist: 1040*ly,
		ra: [18, 27.7, 0],
		dec: [6, 34, 0],
		img: 'https://upload.wikimedia.org/wikipedia/commons/1/14/NGC_6633.png',
	},
	{ // NGC 7092
		name: 'Messier 39',
		type: 'open cluster',
		dist: 1010*ly,
		ra: [21, 31, 48],
		dec: [48, 26, 0],
		img: 'https://upload.wikimedia.org/wikipedia/commons/8/83/M39_Mazur.jpg',
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