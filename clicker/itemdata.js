/* jshint esversion: 6, strict: true, strict: global */
/* exported itemData, recipeData */
'use strict';
// chems - ball-and-stick models preferred
const itemData = [
	// basic
	{
		name: 'Water',
		mass: 1,
		volume: 0.001,
		// Elegant Themes, GPL2
		imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Circle-icons-water.svg',
		tags: ['Whitelisted'],
	},
	{
		name: 'Wood',
		mass: 2,
		volume: 0.0025,
		// Pakmafafmr, cc-by-sa 4.0
		imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Tree-icon.png',
		tags: ['Whitelisted'],
	},
	{
		name: 'Mushroom',
		mass: 0.02,
		volume: 2e-5,
		// rugby471, Public Domain
		imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Tango_Style_Mushroom_icon.svg',
		tags: ['Whitelisted'],
	},
	// complex
	{
		name: 'Barrel',
		mass: 50,
		volume: 0.225,
		// Jerem43, cc-by-sa 3.0
		imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Barrel_icon.png',
		rarity: 1,
	},
	{
		name: 'Water Barrel',
		mass: 225,
		volume: 0.225,
		// Jerem43, cc-by-sa 3.0
		imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Barrel_icon.png',
		rarity: 1,
	},
];

// recipes
const recipeData = [
	{
		reagents: [
			['Wood', 25],
		],
		products: [
			['Barrel', 1],
		],
	},
	{
		reagents: [
			['Barrel', 1],
			['Water', 175],
		],
		products: [
			['Water Barrel', 1],
		],
	},
	{
		reagents: [
			['Water Barrel', 1],
		],
		products: [
			['Barrel', 1],
			['Water', 175],
		],
	},
];