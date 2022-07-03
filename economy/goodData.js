/* exported buildingData, goodData */
/* global constants */

const goodData = [
	{
		name: 'copper',
		categories: ['metal'],
	},
	{
		name: 'copper_ore',
		categories: ['stone'],
	},
	{
		name: 'malachite',
		categories: ['copper_ore'],
	},
	{
		name: 'metal',
	},
	{
		name: 'person',
	},
	{
		name: 'stone',
	},
	{
		name: 'worker',
		categories: ['person'],
	},
];

const buildingData = [
	{
		name: 'copper_ore_mine',
		costBuild: [],
		costBuildLock: [{
			id: 'worker',
			amount: 1,
		}],
		costOngoing: [],
		produces: [{
			id: 'copper_ore',
			amount: 1,
			time: constants.hour,
		}],
	},
	{
		name: 'copper_ore_smelter',
		costBuild: [],
		costBuildLock: [{
			id: 'worker',
			amount: 1,
		}],
		costOngoing: [{
			id: 'copper_ore',
			amount: 1,
			time: constants.hour,
		}],
		produces: [{
			id: 'copper',
			amount: 1,
			time: constants.hour,
		}],
	},
];