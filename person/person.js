/* exported debug */
/* global random, range */

class Person {
	/**
	 * @param {Name} name
	 * @param {Vital} vital
	 * @param {Personality} personality
	 * @param {Body} body
	 * @param {Social} social
	 */
	constructor(name, vital, personality, body, social){
		this.name = name;
		this.vital = vital;
		this.personality = personality;
		this.body = body;
		this.social = social;
	}
	// static methods
	static gen(){
		return new Person(
			Name.gen(),
			Vital.gen(),
			Personality.gen(),
			Body.gen(),
			Social.gen()
		);
	}
}
class Name {
	/**
	 * @param {string} first
	 * @param {string} last
	 */
	constructor(first, last){
		this.first = first;
		this.last = last;
	}
	// static methods
	static gen(gender){
		return new Name(
			random.choice(this.firsts),
			random.choice(this.firsts)
		);
	}
	// static vars
	static firsts = [
		'John',
	];
}
class Vital {
	// todo
	// static methods
	static gen(){
		return new Vital();
	}
}
class Personality {
	// todo
	// static methods
	static gen(){
		return new Personality();
	}
}
class Body {
	constructor(colors){
		/** a string -> css color mapping */
		this.colors = colors;
	}
	// static methods
	static gen(){
		return new Body();
	}
}

class Social {
	/** @param {Relation[]} relations */
	constructor(relations){
		this.relations = relations;
	}
	// static methods
	static gen(){
		return new Social(
			range(random.randint(0, 5)).map(() => Relation.gen())
		);
	}
}

class Relation {
	/**
	 * @param {string} relationType
	 * @param {Person} agent
	 * @param {Person} patient
	 */
	constrctor(relationType, agent, patient){
		this.relationType = relationType;
		this.agent = agent;
		this.patient = patient;
	}
	// static methods
	static gen(){
		return new Relation();
	}
}

function debug(){
	console.debug(Person.gen());
}