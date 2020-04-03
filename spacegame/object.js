/* jshint esversion: 6, strict: true, forin: false, loopfunc: true, strict: global */
/* exported importSave, downloadSave, createOrder, wipeMap, hardReset */
"use strict";

var pi = Math.PI;

function main(){
}

// abstract

class Instance{
	/**
	 * @param {string} name
	 * @param {any[]} children
	*/
	constructor(name, children){
		this.name = name;
		this.children = children;
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
	constructor(given, family) {
		this.given = given;
		this.family = family;
	}
}

class Vital{
	constructor(birth, death) {
		this.birth = birth;
		this.death = death;
	}
	get ageAtDeath(){
		return new Time((death - birth)/1000);
	}
}

class Person{
	constructor(name, mother, father, vital) {
		this.name = name;
		this.mother = mother;
		this.father = father;
		this.vital = vital;
	}
	get parents(){
		return [this.father, this.mother];
	}
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
var phoenix = new Person(new PersonalName("Phoenix"));
phoenix.mother = phoenix.father = phoenix;

universe.children = [earth];

console.log(universe);
