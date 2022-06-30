/* exported debug */
/* global body, names, random, range */

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
		const personality = Personality.gen();
		return new Person(
			Name.gen(personality.gender),
			Vital.gen(),
			personality,
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
	/** @param {string} gender */
	static gen(gender){
		return new Name(
			this.genFirst(gender),
			random.choice(names.last)
		);
	}
	/** @param {string} gender */
	static genFirst(gender){
		return random.choice(names.inSets(gender + 'n'));
	}
}
class Vital {
	// todo
	// static methods
	static gen(){
		return new Vital();
	}
}
class Personality {
	/** 
	 * @param {string} gender a single char denoting gender 
	 * @param {string} romantic_orientation a string of chars denoting what genders they are attracted to
	 * @param {string} sexual_orientation a string of chars denoting what genders they are attracted to
	 */
	constructor(gender, romantic_orientation, sexual_orientation){
		this.gender = gender;
		this.romantic_orientation = romantic_orientation;
		this.sexual_orientation = sexual_orientation;
	}
	/** @returns {'female'|'male'|'nonbinary'} */
	get genderName(){
		return {
			f: 'female',
			m: 'male',
			n: 'nonbinary',
		}[this.gender];
	}
	get identityName(){
		return `${Personality.orientationName(this.romantic_orientation)}romantic ${Personality.orientationName(this.sexual_orientation)}sexual ${this.genderName}`;
	}
	// static methods
	static gen(){
		return new Personality(
			random.choice(this.genders),
			this.genOrientation(),
			this.genOrientation()
		);
	}
	static genOrientation(){
		let o = '';
		Array.from(this.genders).forEach(g => {
			if (random.bool())
				o += g;
		})
		return o;
	}
	/** @param {string} genders */
	static orientationName(genders){
		switch (genders){
			case 'fmn':
				return 'pan';
			case 'fm':
				return 'bi';
			case 'fn':
			case 'f':
				return 'gyneco';
			case 'mn':
			case 'm':
				return 'andro';
			case 'n':
				return 'skolio';
			default:
				return 'a';
		}
	}
	// static vars
	static genders = 'fmn';
}

class Body {
	/** @param {[Bodypart, {string: string}][]} partPropertyPairs */
	constructor(partPropertyPairs){
		/** @type {[Bodypart, {string: string}][]} 
		 * a string -> css color mapping
		 */
		this.partPropertyPairs = partPropertyPairs;
	}
	// static methods
	static gen(){
		return new Body(
			Bodypart.bodyparts.map(p => [p, p.gen()])
		);
	}
}

class Bodypart {
	/**
	 * @param {string} name
	 * @param {{string: boolean}} validProperties a list of properties and whether they're valid for this part or not
	 */
	constructor(name, validProperties){
		this.name = name;
		this.validProperties = validProperties;
	}
	gen(){
		const o = {};
		for(let property in this.validProperties)
			if (this.validProperties[property])
				o[property] = random.choice(body.properties[property]);
		return o;
	}
	// static methods
	static parse(){
		body.parts.forEach(obj => {
			this.bodyparts.push(new Bodypart(obj.name, obj.validProperties));
		});
	}
	// static vars
	/** @type {Bodypart[]} */
	static bodyparts = [];
}
Bodypart.parse();

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