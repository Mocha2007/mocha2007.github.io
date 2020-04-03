/* jshint esversion: 6, strict: true, forin: false, loopfunc: true, strict: global */
/* exported importSave, downloadSave, createOrder, wipeMap, hardReset */
"use strict";

var pi = Math.PI;

function main(){
}

// abstract

class Instance{
	/** @param {string} name */
	constructor(name){
		this.name = name;
		/** @type {Set<Instance>} */
		this.children = new Set();
		/** @type {Set<Instance>} */
		this.parents = new Set();
	}
	/** @param {Instance} child */
	add(child){
		child.parents.add(this);
		this.children.add(child);
	}
}

// units

class Value{
	/**
	 * @param {number} value
	*/
	constructor(value) {
		this.value = value;
	}
}

class Length extends Value{
	/**
	 * @param {number} value
	*/
	constructor(value) {
		super(value);
	}
	get toFeet(){
		return this.value / .3048;
	}
}

class Area extends Value{
	/**
	 * @param {number} value
	*/
	constructor(value) {
		super(value);
	}
}

class Volume extends Value{
	/**
	 * @param {number} value
	*/
	constructor(value) {
		super(value);
	}
}

class Mass extends Value{
	/**
	 * @param {number} value
	*/
	constructor(value) {
		super(value);
	}
	get toPounds(){
		return this.value / .45359237;
	}
}

class Density extends Value{
	/**
	 * @param {number} value
	*/
	constructor(value) {
		super(value);
	}
}

class Time extends Value{
	/**
	 * @param {number} value
	*/
	constructor(value) {
		super(value);
	}
}

// math

class Solid{
	constructor(){}
	/** @type {Area} */
	surfaceArea;
	/** @type {Volume} */
	volume;
}

class Sphere extends Solid{
	/**
	 * @param {number} radius
	*/
	constructor(radius) {
		super();
		this.radius = radius;
	}
	get circumference(){
		return new Length(2*pi*this.radius.value);
	}
	get surfaceArea(){
		return new Area(4*pi*Math.pow(this.radius.value, 2));
	}
	get volume(){
		return new Volume(4/3*pi*Math.pow(this.radius.value, 3));
	}
}

// ling lang

class Noun{
	/**
	 * @param {string} word - singular, or plural if alwaysPlural
	 * @param {boolean} countable - uses many and few rather than much and little
	 * @param {boolean} proper - requires capitalization of first letter
	 * @param {boolean} alwaysSingular
	 * @param {boolean} alwaysPlural
	 * @param {string} irregularPlural
	 * @param {boolean} definite - requires the
	 * @param {boolean} indefinite - requires a(n)
	*/
	constructor(word, countable = true, proper = false, alwaysSingular = false, alwaysPlural = false, irregularPlural = false, definite = false, indefinite = false) {
		this.word = word;
		this.countable = countable;
		this.proper = proper;
		this.alwaysSingular = alwaysSingular;
		this.alwaysPlural = alwaysPlural;
		if (alwaysSingular && alwaysPlural){
			throw 'a noun cannot be always singular and plural';
		}
		this.irregularPlural = irregularPlural;
		if (alwaysSingular && irregularPlural){
			throw 'a noun which is always singular cannot have an irregular plural';
		}
		this.definite = definite;
		this.indefinite = indefinite;
		if (definite && indefinite){
			throw 'a noun cannot be always indefinite and definite';
		}
	}
	get plural(){
		if (!this.countable || this.alwaysSingular){
			throw 'uncountable or singular-only nouns cannot be pluralized';
		}
		if (this.alwaysPlural){
			return this.word;
		}
		if (this.irregularPlural){
			return this.irregularPlural;
		}
		if (this.word[this.word.length-1] === 's' ||
			['ch', 'sh'].includes(this.name.slice(this.name.Length-2, this.name.Length))){
			return this.word + 'es';
		}
		return this.word + 's';
	}
	get singular(){
		if (this.alwaysPlural){
			throw 'pluralia tantum cannot be singularized';
		}
		return this.word;
	}
}

class ProperNoun extends Noun{
	/**
	 * @param {string} word - singular, or plural if alwaysPlural
	 * @param {boolean} alwaysPlural
	 * @param {boolean} definite - requires the
	*/
	constructor(word, alwaysPlural = false, definite = false) {
		super(word, false, true, !alwaysPlural, alwaysPlural, '', definite, false);
	}
}

class Name extends ProperNoun{
	/**
	 * eg. a first name, or a last name.
	 * @param {string} word
	*/
	constructor(word) {
		super(word, false, false);
	}
}
// astro

class CelestialBody extends Instance{
	/**
	 * @param {string} name
	 * @param {Mass} mass
	 * @param {Solid} solid
	*/
	constructor(name, mass, solid) {
		super(name);
		this.mass = mass;
		this.solid = solid;
	}
	get density(){
		return new Density(this.mass.value / this.solid.volume.value);
	}
}

// peepl

class PersonalName{
	/**
	 * @param {Name} given
	 * @param {Name} family
	*/
	constructor(given, family) {
		this.given = given;
		this.family = family;
	}
}

class Vital{
	/**
	 * @param {Date} birth
	 * @param {Date} death
	*/
	constructor(birth, death) {
		this.birth = birth;
		this.death = death;
	}
	get ageAtDeath(){
		return new Time((this.death - this.birth)/1000);
	}
}

class Person{
	/**
	 * @param {PersonalName} name
	 * @param {Person} mother
	 * @param {Person} father
	 * @param {Vital} vital
	*/
	constructor(name, mother, father, vital) {
		this.name = name;
		this.mother = mother;
		this.father = father;
		this.vital = vital;
	}
	get parents(){
		return [this.father, this.mother];
	}
	/**
	 * @param {number} n
	 * @return {Person[]}
	*/
	generation(n){
		if (n === 0){
			return [this];
		}
		return this.father.generation(n-1).concat(this.mother.generation(n-1));
	}
}

// Things
var universe = new Instance("universe");
var earth = new CelestialBody("earth", 
	new Mass(5.97237e24),
	new Sphere(new Length(6371000))
);
var phoenix = new Person(new PersonalName(new Name("Phoenix")));
phoenix.mother = phoenix.father = phoenix;

universe.add(earth);

console.log(universe);