/* exported buildingData, goodData */
/* global constants */

const goodData = [
	{
		name: 'copper',
		categories: ['metal'],
		basePrice: 6, // https://www.dailymetalprice.com/metalpricecharts.php?c=cu&u=lb&d=20
	},
	{
		name: 'copper_ore',
		categories: ['stone'],
	},
	{
		name: 'lumber',
		// rough estimate based on 144 cubic inches * 0.7g/cm^3
		// https://tradingeconomics.com/commodity/lumber
		basePrice: 0.5,
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
		name: 'wood',
		// guess
		basePrice: 0.25,
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
	{
		name: 'logging_camp',
		costBuild: [],
		costBuildLock: [{
			id: 'worker',
			amount: 1,
		}],
		costOngoing: [],
		produces: [{
			id: 'wood',
			amount: 1,
			time: constants.hour,
		}],
	},
	{
		name: 'sawmill',
		costBuild: [],
		costBuildLock: [{
			id: 'worker',
			amount: 1,
		}],
		costOngoing: [{
			id: 'wood',
			amount: 1,
			time: constants.hour,
		}],
		produces: [{
			id: 'lumber',
			amount: 1,
			time: constants.hour,
		}],
	},
	{
		name: 'warehouse',
		costBuild: [],
		costBuildLock: [{
			id: 'worker',
			amount: 1,
		}],
		costOngoing: [],
		produces: [],
		storage: 1000,
	},
];