/* exported main */
/* global phones, random */
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
	testIfGenerates(){
		return random.random() < this.properties.freq;
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
	static generatePhonology(){
		// todo
		return Phone.list.filter(p => p.testIfGenerates());
	}
}

class Language {
	/**
	 * currently, languages have only phonologies
	 * @param {Phoneme[]} phonology set of phonemes
	*/
	constructor(phonology){
		this.phonology = phonology;
	}
	static generate(){
		return new Language(Phoneme.generatePhonology());
	}
}

function main(){
	// load all data
	Phone.load();
	console.debug(Language.generate());
}