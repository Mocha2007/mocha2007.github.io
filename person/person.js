/* exported debug */
/* global body, names, random, range */

/** if obj has table prop, use that, otherwise create span 
 * @returns {HTMLTableElement|HTMLSpanElement}
*/
function getTableOrSpan(obj){
	if (obj !== undefined){
		const maybeTable = obj.table;
		if (maybeTable)
			return maybeTable
	}
	const span = document.createElement('span');
	span.innerHTML = obj;
	return span;
}

/** generates pretty tables based on key value pairs of objects */
function kvpTable(obj){
	const table = document.createElement('table');
	table.classList.add('kvpTable');
	const header = document.createElement('tr');
	table.appendChild(header);
	const headerKey = document.createElement('th');
	headerKey.innerHTML = 'Key';
	header.appendChild(headerKey);
	const headerValue = document.createElement('th');
	headerValue.innerHTML = 'Value';
	header.appendChild(headerValue);
	// main
	for (let key in obj){
		const tr = document.createElement('tr');
		const tdKey = document.createElement('td');
		tdKey.classList.add('kvpKey');
		tdKey.innerHTML = key;
		tr.appendChild(tdKey)
		// value
		const tdValue = document.createElement('td');
		const value = obj[key];
		console.debug(Array.isArray(value), value);
		if (Array.isArray(value)) // todo create special array table function
			tdValue.innerHTML = '[' + value.map(e => getTableOrSpan(e).outerHTML).join(', ') + ']';
		else
			tdValue.appendChild(getTableOrSpan(value));
		tr.appendChild(tdValue);
		table.appendChild(tr);
	}
	return table;
}

class Person {
	/**
	 * @param {Name} name - should this be under personality instead?
	 * @param {Vital} vital
	 * @param {Personality} personality -  should personality be renamed "mind"???
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
	get table(){
		return kvpTable({
			name: this.name,
			vital: this.vital,
			personality: this.personality,
			body: this.body,
			social: this.social,
		});
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
	get table(){
		return kvpTable({
			first: this.first,
			last: this.last,
		});
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
	get table(){
		return kvpTable({
		});
	}
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
	 * @param {OCEAN} ocean big five personality values
	 */
	constructor(gender, romantic_orientation, sexual_orientation, ocean){
		/** @type {string} */
		this.gender = gender;
		/** @type {string} */
		this.romantic_orientation = romantic_orientation;
		/** @type {string} */
		this.sexual_orientation = sexual_orientation;
		/** @type {OCEAN} */
		this.ocean = ocean;
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
		return `${this.romanticOrientationName} ${this.sexualOrientationName} ${this.genderName}`;
	}
	get romanticOrientationName(){
		return Personality.orientationName(this.romantic_orientation) + 'romantic';
	}
	get sexualOrientationName(){
		return Personality.orientationName(this.sexual_orientation) + 'sexual';
	}
	get table(){
		return kvpTable({
			gender: this.genderName,
			romantic_orientation: this.romanticOrientationName,
			sexual_orientation: this.sexualOrientationName,
			ocean: this.ocean,
		});
	}
	// static methods
	static gen(){
		const gender = random.choice(this.genders);
		return new Personality(
			gender,
			this.genOrientation(gender),
			this.genOrientation(gender),
			OCEAN.gen(gender)
		);
	}
	/** @param {string} gender */
	static genOrientation(gender){
		// todo account for gender biases
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

class OCEAN {
	/**
	 * Big 5 personality values - all in [0, 1]
	 * @param {number} openness 
	 * @param {number} conscientiousness 
	 * @param {number} extraversion 
	 * @param {number} agreeableness 
	 * @param {number} neuroticism 
	 */
	constructor(openness, conscientiousness, extraversion, agreeableness, neuroticism){
		this.openness = openness;
		this.conscientiousness = conscientiousness;
		this.extraversion = extraversion;
		this.agreeableness = agreeableness;
		this.neuroticism = neuroticism;
	}
	get table(){
		return kvpTable({
			openness: this.openness,
			conscientiousness: this.conscientiousness,
			extraversion: this.extraversion,
			agreeableness: this.agreeableness,
			neuroticism: this.neuroticism,
		});
	}
	// static methods
	/** @param {string} gender */
	static gen(gender){
		const o = random.normal(...this.genderData[gender].o);
		const c = random.normal(...this.genderData[gender].c);
		const e = random.normal(...this.genderData[gender].e);
		const a = random.normal(...this.genderData[gender].a);
		const n = random.normal(...this.genderData[gender].n);
		return new OCEAN(o, c, e, a, n);
	}
	// https://www.researchgate.net/figure/Means-and-standard-deviations-in-Adjective-Checklist-for-Personality-Assessment-AEP_tbl1_49707967
	static genderData = {
		f: {
			o: [3.03, 0.62],
			c: [3.68, 0.59],
			e: [3.73, 0.68],
			a: [4.01, 0.52],
			n: [3.07, 0.65],
		},
		m: {
			o: [3.09, 0.62],
			c: [3.74, 0.62],
			e: [3.74, 0.69],
			a: [3.96, 0.53],
			n: [2.74, 0.60],
		},
		n: {
			/** @param {string} dimension char */
			getValues(dimension){
				return [
					(OCEAN.genderData.f[dimension][0] + OCEAN.genderData.m[dimension][0])/2,
					(OCEAN.genderData.f[dimension][1] + OCEAN.genderData.m[dimension][1])/2,
				];
			},
			get o(){
				return this.getValues('o');
			},
			get c(){
				return this.getValues('c');
			},
			get e(){
				return this.getValues('e');
			},
			get a(){
				return this.getValues('a');
			},
			get n(){
				return this.getValues('n');
			},
		},
	};
}

class Body {
	/** @param {[Bodypart, {string: string}][]} partPropertyPairs */
	constructor(partPropertyPairs){
		/** @type {[Bodypart, {string: string}][]} 
		 * a string -> css color mapping
		 */
		this.partPropertyPairs = partPropertyPairs;
	}
	get table(){
		return kvpTable({
			partPropertyPairs: this.partPropertyPairs,
		});
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
	get table(){
		return kvpTable({
			name: this.name,
			validProperties: this.validProperties,
		});
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
	get table(){
		return kvpTable({
			relations: this.relations,
		});
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
	get table(){
		return kvpTable({
			relationType: this.relationType,
			agent: this.agent,
			patient: this.patient,
		});
	}
	// static methods
	static gen(){
		return new Relation();
	}
}

function debug(){
	const person = Person.gen();
	console.debug(person);
	/** @param {HTMLDivElement} */
	const infobox = document.getElementById('infobox');
	infobox.innerHTML = '';
	infobox.appendChild(person.table);
}