/* jshint esversion: 6, strict: true, strict: global */
/* exported itemData, recipeData */
'use strict';
// items
// todo https://commons.wikimedia.org/wiki/Category:Fruit_icons
// todo https://commons.wikimedia.org/wiki/Category:Vegetable_icons
// food densities from https://fdc.nal.usda.gov/fdc-app.html
const itemData = [
	// basic
	{
		name: 'Water',
		mass: 1,
		volume: 0.001,
		// Elegant Themes, GPL2
		imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Circle-icons-water.svg',
		tags: ['Whitelisted'],
		rarity: 0,
	},
	{
		name: 'Wood',
		mass: 2,
		volume: 0.0025,
		// Pakmafafmr, cc-by-sa 4.0
		imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Tree-icon.png',
		tags: ['Whitelisted'],
		rarity: 0,
	},
	{
		name: 'Stone',
		mass: 1,
		volume: 0.0003,
		// 7Soul1, Public Domain
		imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/I_Rock01.png',
		tags: ['Whitelisted'],
		rarity: 0,
	},
	{
		name: 'Feather',
		mass: 1e-3, // guess
		volume: 1e-6,
		// 7Soul1, Public Domain
		imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/I_Feather01.png',
		tags: ['Whitelisted'],
		rarity: 1,
	},
	{
		name: 'Bone',
		mass: 0.25,
		volume: 1.7e-4, // 1500 kg/m^3 https://hypertextbook.com/facts/2002/AnnaYarusskaya.shtml
		// 7Soul1, Public Domain
		imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/I_Bone.png',
		tags: ['Whitelisted'],
		rarity: 0,
	},
	{
		name: 'Mushroom',
		mass: 0.02,
		volume: 4.9e-5,
		// rugby471, Public Domain
		imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Tango_Style_Mushroom_icon.svg',
		tags: ['Whitelisted'],
		rarity: 0,
	},
	{
		name: 'Onion',
		mass: 0.15,
		volume: 2.22e-4,
		// DBCLS, cc-by-4.0
		imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/202002_Model_plant_bulb.svg',
		tags: ['Whitelisted'],
		rarity: 1,
	},
	{
		name: 'Soybeans',
		mass: 0.1,
		volume: 1.94e-4,
		// DBCLS, cc-by-4.0
		imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/93/202002_Model_plant_glycine_max.svg',
		tags: ['Whitelisted'],
		rarity: 1,
	},
	// complex
	{
		name: 'Barrel',
		mass: 50,
		volume: 0.225,
		// Jerem43, cc-by-sa 3.0
		imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Barrel_icon.png',
		rarity: 2,
	},
	{
		name: 'Water Barrel',
		mass: 225,
		volume: 0.225,
		// Jerem43, cc-by-sa 3.0
		imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Barrel_icon.png',
		rarity: 2,
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