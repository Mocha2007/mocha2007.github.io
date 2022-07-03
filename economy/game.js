/* globals Building, buildingData, Good, goodData, localization */

const Game = {
	get buildings(){
		return Building.buildings;
	},
	get goods(){
		return Good.goods;
	},
	language: 'english',
	/** @param {string} key */
	localization(key){
		if (key in localization[this.language])
			return localization[this.language][key];
		return `<${key}>`;
	},
	run(){
		Good.parse(goodData);
		Building.parse(buildingData);
		console.log('Game loaded.');
	},
};

Game.run();