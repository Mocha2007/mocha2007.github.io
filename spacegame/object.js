/* jshint esversion: 6, strict: true, forin: false, loopfunc: true, strict: global */
/* exported importSave, downloadSave, createOrder, wipeMap, hardReset */
"use strict";

var pi = Math.PI;

function main(){
}

// abstract

class Instance{
	/** tangibles or abstractions with parents and children
	 * @param {string} name
	*/
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
	/** @param {Instance} parent */
	addParent(parent){
		parent.add(this);
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

// bio

class Clade extends Instance{
	/**
	 * @param {string} name
	 * @param {string} rank
	 * @param {Clade} parent
	*/
	constructor(name, rank = "clade", parent = undefined) {
		super(name);
		this.rank = rank;
		if (parent){
			this.addParent(parent);
		}
	}
	get hasParent(){
		return 0 < this.parents.size && this.rank !== "life";
	}
	/** @return {Clade[]} */
	get ladder(){
		if (!this.hasParent){
			return [this];
		}
		return [this].concat(this.parent.ladder);
	}
	/** @return {Clade} */
	get parent(){
		return Array.from(this.parents)[0];
	}
	/** @return {number} to sort ranks*/
	get rankLevel(){
		if (this.rank === "clade"){
			return Infinity; // not enough info
		}
		var ranks = [
			['life', 0],
			['domain', 10],
			['kingdom', 20],
			['phylum', 30],
			['division', 30], // botanical def., otherwise b/w 40 and 50
			['class', 40],
			['legion', 50], // zoology only
			['cohort', 60], // zoology only
			['order', 70],
			['family', 80],
			['tribe', 90],
			['genus', 100],
			['section', 110], // botanical def., otherwise b/w 70 and 80
			['series', 120], // botanical def., zoology subfield defs too complex to code anyways
			['species', 130],
			['variety', 140], // botany only
			['form', 150], // botanical def., but doesn't matter overall
			['morph', 150], // zoology only
			['abberation', 150], // lepidopterology only
		];
		var modifiers = [
			['giga', 6],
			['magn', 5],
			['mega', 5],
			['capax', 4],
			['grand', 4],
			['hyper', 3],
			['mir', 3],
			['super', 2],
			['epi', 1],
			['sub', -1],
			['infra', -2],
			['micro', -3],
			['parv', -3],
		];
		for (var i in ranks){
			if (this.rank.includes(ranks[i][0])){
				var value = ranks[i][1];
				break;
			}
		}
		for (var i in modifiers){
			if (this.rank.includes(modifiers[i][0])){
				value += modifiers[i][1];
				break;
			}
		}
		return value;
	}
	/**
	 * returns most specific common clade
	 * @param {Clade} other
	 * @return {Clade}
	*/
	commonClade(other){
		var otherLadder = other.ladder;
		var thisLadder = this.ladder;
		for (var i in thisLadder){
			if (-1 !== otherLadder.indexOf(thisLadder[i])){
				return thisLadder[i];
			}
		}
	}
	/**
	 * returns clade with the given name
	 * @param {string} name
	 * @return {Clade}
	*/
	static fromName(name){
		return clades[cladeNameIndex.indexOf(name)];
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
var reality = new Instance("reality");
var universe = new Instance("universe");
reality.add(universe);
var earth = new CelestialBody("earth", 
	new Mass(5.97237e24),
	new Sphere(new Length(6371000))
);
universe.add(earth);
// var phoenix = new Person(new PersonalName(new Name("Phoenix")));
// phoenix.mother = phoenix.father = phoenix;

// GENERATE CLADES
/** @type {Clade[]} */
var clades = [];
/** @type {string[]} */
var cladeNameIndex = [];

life_data.forEach(
	clade => {
		clades.push(new Clade(clade.name, clade.rank));
		cladeNameIndex.push(clade.name);
	}
);

clades.forEach(
	(clade, i) => {
		var index = cladeNameIndex.indexOf(life_data[i].parent);
		if (index !== -1){
			clade.addParent(clades[index]);
		}
	}
);

var life = clades[cladeNameIndex.indexOf('life')];
reality.add(life);

// display in console
console.log(reality);

function test(){
	var human = Clade.fromName('homo sapiens');
	var fox = Clade.fromName('vulpes vulpes');
	console.log(human.commonClade(fox));
}