/* global phones */
'use strict';


class Phone {
	/**
	 * individual phones usable by languages as phonemes or allophones
	 * @param {string} name eg 'p'
	 * @param {object} properties info about c/v, voicedness, ...
	*/
	constructor(name, properties){
		this.name = name;
		this.properties = properties;
		Phone.list.push(this);
	}
	static load(){
		// todo
		phones.forEach(phoneDatum => {
			new Phone(phoneDatum.name, phoneDatum.properties);
		});
	}
}
/** @type {Phone[]} */
Phone.list = [];


class Phoneme {
	/**
	 * phonemes of a language
	 * @param {string} primary eg 'p'
	 * @param {Allophone[]} allophones allophones and their conditions
	*/
	constructor(primary, allophones){
		this.primary = primary;
		this.allophones = allophones;
	}
}

function main(){
	// load all data
	Phone.load();
}