/* globals localization */

const Game = {
	language: 'english',
	/** @param {string} key */
	localization(key){
		if (key in localization[this.language])
			return localization[this.language][key];
		return `<${key}>`;
	},
	run(){
		// todo
	},
};

Game.run();