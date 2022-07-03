/* globals Building, buildingData, GameWindow, Good, goodData, localization */

const Game = {
	get buildings(){
		return Building.buildings;
	},
	debug(){
		GameWindow.popup('test');
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
		GameWindow.root = new GameWindow(document.getElementById('root'));
		console.log('Game loaded.');
	},
};

Game.run();