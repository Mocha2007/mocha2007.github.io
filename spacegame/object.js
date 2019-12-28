/* jshint esversion: 6, strict: true, forin: false, loopfunc: true, strict: global */
/* exported importSave, downloadSave, createOrder, wipeMap, hardReset */
"use strict";

var pi = Math.PI;

function main(){
}

// abstract

class Thing{
	constructor(name, children){
		this.name = name;
	}
}

class Instance extends Thing{
	constructor(name, children){
		super(name);
		this.children = children;
	}
}

// units

class Value extends Thing{
	constructor(name, value) {
		super(name);
		this.value = value;
	}
}

class Length extends Value{
	constructor(value) {
		super("Length", value);
	}
	get toFeet(){
		return this.value / .3048;
	}
}

class Area extends Value{
	constructor(value) {
		super("Area", value);
	}
}

class Volume extends Value{
	constructor(value) {
		super("Volume", value);
	}
}

class Mass extends Value{
	constructor(value) {
		super("Mass", value);
	}
	get toPounds(){
		return this.value / .45359237;
	}
}

class Density extends Value{
	constructor(value) {
		super("Density", value);
	}
}

// math

class Sphere extends Thing{
	constructor(radius) {
		super("Sphere");
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
	constructor(name, mass, solid) {
		super(name);
		this.mass = mass;
		this.solid = solid;
	}
	get density(){
		return new Density(this.mass.value / this.solid.volume.value);
	}
}

// Things
var universe = new Instance("universe");
var earth = new CelestialBody("earth", 
	new Mass(5.97237e24),
	new Sphere(new Length(6371000))
);
universe.children = [earth];

console.log(universe);
