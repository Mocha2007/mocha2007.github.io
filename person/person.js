/* exported debug */
/* global body, names, random, range */

/** if obj has table prop, use that, otherwise create span
 * @returns {HTMLTableElement|HTMLSpanElement}
*/
function getTableOrSpan(obj){
	// try to give the thumbnail
	if (obj !== undefined && obj instanceof ObjectThumbnail)
		return obj.thumbnail;
	if (Array.isArray(obj)) // todo create special array table function
		obj = '[' + obj.map(e => getTableOrSpan(e).outerHTML).join(', ') + ']'
	else if (typeof obj === "string" || obj instanceof String || obj === undefined){}
		// https://stackoverflow.com/a/24844091/2579798
		// empty block because I need it to fall below object BUT I need to check it before
	else if (Object.keys(obj).length) // normal js object
		return kvpTable(obj);
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
		const value = obj[key];
		const tdValue = document.createElement('td');
		tdValue.appendChild(getTableOrSpan(value));
		tr.appendChild(tdValue);
		table.appendChild(tr);
	}
	return table;
}

class ObjectThumbnail {
	/** @param {string} name */
	constructor(name){
		this.name = name;
		// todo thumbnail icons for each object
	}
	get thumbnail(){
		const span = document.createElement('span');
		span.classList.add('thumbnail');
		span.innerHTML = this.name;
		span.onclick = () => this.showTable();
		return span;
	}
	showTable(){
		// edit history
		history.go(this);
	}
}

class Person extends ObjectThumbnail {
	/**
	 * @param {Name} name - should this be under personality instead?
	 * @param {Vital} vital
	 * @param {Personality} personality -  should personality be renamed "mind"???
	 * @param {Body} body
	 * @param {Social} social
	 */
	constructor(name, vital, personality, body, social){
		super(name);
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
class Name extends ObjectThumbnail {
	/**
	 * @param {string} first
	 * @param {string} last
	 */
	constructor(first, last){
		super(`${first} ${last}`);
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
class Vital extends ObjectThumbnail {
	constructor(){
		super('Vital');
	}
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
class Personality extends ObjectThumbnail {
	/** 
	 * @param {string} gender a single char denoting gender 
	 * @param {string} romantic_orientation a string of chars denoting what genders they are attracted to
	 * @param {string} sexual_orientation a string of chars denoting what genders they are attracted to
	 * @param {OCEAN} ocean big five personality values
	 * @param {[Bodypart, {string: [number, number]}][]} partPrefs - an array of Bodypart - x pairs, where X is a dict of property-(mean, sd) pairs
	 */
	constructor(gender, romantic_orientation, sexual_orientation, ocean){
		super('Personality');
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
		const gender = random.weightedChoice(this.genders,
			Object.entries(this.genderBiases).map(kvp => kvp[1])
		);
		return new Personality(
			gender,
			this.genOrientation(gender),
			this.genOrientation(gender),
			OCEAN.gen(gender)
		);
	}
	/** @param {string} gender */
	static genOrientation(gender){
		return random.weightedChoice(this.orientationBiasesKeys, 
			Object.entries(this.orientationBiases[gender]).map(kvp => kvp[1])
		);
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
	static genderBiases = {
		f: 0.5,
		m: 0.5,
		n: 0.0036, // https://docs.google.com/spreadsheets/d/1aP7c14dLNY46AljXM11aNLrQgMWdl8gQnycvPFcgtwc/edit#gid=656383138
	};
	static orientationBiasesKeys = [
		'f', 'fm', 'fmn', 'fn', 'm', 'mn', 'n', '',
	];
	static orientationBiases = {
		// https://news.gallup.com/poll/389792/lgbt-identification-ticks-up.aspx
		// https://docs.google.com/spreadsheets/d/1aP7c14dLNY46AljXM11aNLrQgMWdl8gQnycvPFcgtwc/edit#gid=0
		f: {
			f: 0.0449,
			fm: 0.2250,
			fmn: 0.2250,
			fn: 0.0449,
			m: 0.7549,
			mn: 0.7549,
			n: 0.0160,
			'': 0.0160,
		},
		m: {
			f: 0.7891,
			fm: 0.0750,
			fmn: 0.0750,
			fn: 0.7891,
			m: 0.0451,
			mn: 0.0451,
			n: 0.0080,
			'': 0.0080,
		},
		n: {
			// based solely on genZ row
			f: 0.772/4,
			fm: 0.15/2,
			fmn: 0.15/2,
			fn: 0.772/4,
			m: 0.772/4,
			mn: 0.772/4,
			n: 0.012/2,
			'': 0.012/2,
		},
	};
}

class OCEAN extends ObjectThumbnail {
	/**
	 * Big 5 personality values - all in [0, 1]
	 * @param {number} openness 
	 * @param {number} conscientiousness 
	 * @param {number} extraversion 
	 * @param {number} agreeableness 
	 * @param {number} neuroticism 
	 */
	constructor(openness, conscientiousness, extraversion, agreeableness, neuroticism){
		super(OCEAN.getAbbreviated(openness, conscientiousness, extraversion, agreeableness, neuroticism));
		this.openness = openness;
		this.conscientiousness = conscientiousness;
		this.extraversion = extraversion;
		this.agreeableness = agreeableness;
		this.neuroticism = neuroticism;
	}
	get abbreviated(){
		return OCEAN.getAbbreviated(this.openness, this.conscientiousness, this.extraversion, this.agreeableness, this.neuroticism);
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
	/**
	 * get abbreviated string for quick personality reference
	 * @param {number} o
	 * @param {number} c
	 * @param {number} e
	 * @param {number} a
	 * @param {number} n
	 */
	static getAbbreviated(o, c, e, a, n){
		const oo = o < 3 ? 'o' : 'O';
		const cc = c < 3 ? 'c' : 'C';
		const ee = e < 3 ? 'e' : 'E';
		const aa = a < 3 ? 'a' : 'A';
		const nn = n < 3 ? 'n' : 'N';
		return oo+cc+ee+aa+nn;
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

class Body extends ObjectThumbnail {
	/** @param {[Bodypart, {string: string}][]} partPropertyPairs */
	constructor(partPropertyPairs){
		super('Body');
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

class Bodypart extends ObjectThumbnail {
	/**
	 * @param {string} name
	 * @param {{string: boolean}} validProperties a list of properties and whether they're valid for this part or not
	 */
	constructor(name, validProperties){
		super(name);
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

class Social extends ObjectThumbnail {
	/** @param {Relation[]} relations */
	constructor(relations){
		super('Social');
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

class RelationType extends ObjectThumbnail {
	/**
	 * @param {string} name 
	 * @param {string[]} agentTypes 
	 */
	constructor(name, agentTypes){
		super(name);
		this.agentTypes = agentTypes;
	}
}

class Relation extends ObjectThumbnail {
	/**
	 * @param {RelationType} relationType
	 * @param {Person[]} agents (in same order as relationType.agentTypes)
	 */
	constructor(relationType, agents){
		super('RelationType');
		this.relationType = relationType;
		this.agents = agents;
	}
	get table(){
		return kvpTable({
			relationType: this.relationType,
			agents: this.agents,
		});
	}
	// static methods
	static gen(){
		const relation = random.choice(this.relations);
		return new Relation(
			relation
		);
	}
	static relations = [
		new RelationType('apprenticeship', ['master', 'apprentice']),
		new RelationType('employment', ['employer', 'employee']),
		new RelationType('friendship', ['friend', 'friend']),
		new RelationType('parenthood', ['parent', 'parent', 'child']),
	];
}

const history = {
	/** @type {ObjectThumbnail[]} */
	backData: [],
	/** @type {ObjectThumbnail} */
	current: undefined,
	/** @type {ObjectThumbnail[]} */
	forwardData: [],
	// methods
	back(){
		if (!this.backData.length)
			return;
		this.forwardData.push(this.current);
		this.current = this.backData.pop();
		this.set(this.current);
	},
	forward(){
		if (!this.forwardData.length)
			return;
		this.backData.push(this.current);
		this.current = this.forwardData.pop();
		this.set(this.current);
	},
	/** equivalent to clicking on a hyperlink
	 * @param {ObjectThumbnail} obj */
	go(obj){
		this.forwardData = [];
		this.backData.push(this.current);
		this.current = obj;
		this.set(obj);
	},
	/** ONLY set the current displayed object, do not touch history
	 * @param {ObjectThumbnail} obj */
	set(obj){
		/** @param {HTMLDivElement} */
		const infobox = document.getElementById('infobox');
		infobox.innerHTML = '';
		infobox.appendChild(obj.table);
	}
};

function debug(){
	// console.debug();
}