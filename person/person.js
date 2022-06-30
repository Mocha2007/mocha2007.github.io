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
		});
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