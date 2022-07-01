/* exported debug */
/* global body, icons, kvpTable, names, ObjectThumbnail, random, range */

class Person extends ObjectThumbnail {
	/**
	 * @param {Name} name - should this be under personality instead?
	 * @param {Vital} vital
	 * @param {Personality} personality -  should personality be renamed "mind"???
	 * @param {Body} body
	 * @param {Social} social - if undefined will randomly generate
	 */
	constructor(name, vital, personality, body, social){
		super(`${name.first} ${name.last}`, icons.person);
		this.fullName = name;
		Person.people.push(this);
		this.vital = vital;
		this.personality = personality;
		this.body = body;
		this.social = social || Social.gen(this);
	}
	/** @returns {Person|undefined} */
	get randomOtherPerson(){
		if (Person.people.length < 2)
			return undefined;
		return random.choice(Person.people.filter(p => p !== this));
	}
	get table(){
		return kvpTable({
			name: this.fullName,
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
			undefined // in order for the person to be passed into Social.gen
		);
	}
}
/** @type {Person[]} */
Person.people = [];

class Name extends ObjectThumbnail {
	/**
	 * @param {string} first
	 * @param {string} last
	 */
	constructor(first, last){
		super(`${first} ${last}`, icons.data);
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
		super('Vital', icons.data);
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
}
// static vars
Personality.genders = 'fmn';
Personality.genderBiases = {
	f: 0.5,
	m: 0.5,
	n: 0.0036, // https://docs.google.com/spreadsheets/d/1aP7c14dLNY46AljXM11aNLrQgMWdl8gQnycvPFcgtwc/edit#gid=656383138
};
Personality.orientationBiasesKeys = [
	'f', 'fm', 'fmn', 'fn', 'm', 'mn', 'n', '',
];
Personality.orientationBiases = {
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
		super(OCEAN.getAbbreviated(
			openness, conscientiousness, extraversion, agreeableness, neuroticism));
		this.openness = openness;
		this.conscientiousness = conscientiousness;
		this.extraversion = extraversion;
		this.agreeableness = agreeableness;
		this.neuroticism = neuroticism;
	}
	get abbreviated(){
		return OCEAN.getAbbreviated(
			this.openness, this.conscientiousness,
			this.extraversion, this.agreeableness, this.neuroticism);
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
}
// https://www.researchgate.net/figure/Means-and-standard-deviations-in-Adjective-Checklist-for-Personality-Assessment-AEP_tbl1_49707967
OCEAN.genderData = {
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

class Body extends ObjectThumbnail {
	/**
	 * @param {Item[]} inventory
	 * @param {[Bodypart, {string: string}][]} partPropertyPairs
	 * @param {Needs} needs
	 */
	constructor(inventory, partPropertyPairs, needs){
		super('Body');
		/** @type {[Bodypart, {string: string}][]}
		 * a string -> css color mapping
		 */
		this.inventory = inventory;
		this.partPropertyPairs = partPropertyPairs;
		this.needs = needs;
	}
	get table(){
		return kvpTable({
			inventory: this.inventory,
			partPropertyPairs: this.partPropertyPairs,
			needs: this.needs,
		});
	}
	// static methods
	static gen(){
		return new Body(
			[],
			Bodypart.bodyparts.map(p => [p, p.gen()]),
			Needs.gen()
		);
	}
}

class Needs extends ObjectThumbnail {
	// [0, 1]
	constructor(bladder = 1, hunger = 1, sleep = 1, thirst = 1){
		super('Needs');
		this.bladder = bladder;
		this.hunger = hunger;
		this.sleep = sleep;
		this.thirst = thirst;
	}
	get table(){
		return kvpTable({
			bladder: this.bladder,
			hunger: this.hunger,
			sleep: this.sleep,
			thirst: this.thirst,
		});
	}
	// static methods
	static gen(){
		return new Needs();
	}
}

class Bodypart extends ObjectThumbnail {
	/**
	 * @param {string} name
	 * @param {string} icon
	 * @param {{string: boolean}} validProperties a list of properties and whether they're valid for this part or not
	 */
	constructor(name, icon, validProperties){
		super(name, icon);
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
		for (const property in this.validProperties)
			if (this.validProperties[property])
				o[property] = random.choice(body.properties[property]);
		return o;
	}
	// static methods
	static parse(){
		body.parts.forEach(obj => {
			this.bodyparts.push(new Bodypart(obj.name, obj.icon, obj.validProperties));
		});
		console.log('Bodyparts successfully parsed');
	}
}
// static vars
/** @type {Bodypart[]} */
Bodypart.bodyparts = [];
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
	/** @param {Person} person */
	static gen(person){
		return new Social(
			range(random.randint(0, 5)).map(() => Relation.gen(person))
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
	get table(){
		return kvpTable({
			name: this.name,
			agentTypes: this.agentTypes,
		});
	}
}

class Relation extends ObjectThumbnail {
	/**
	 * @param {RelationType} relationType
	 * @param {Person[]} agents (in same order as relationType.agentTypes)
	 */
	constructor(relationType, agents){
		super('Relation');
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
	/** @param {Person} person */
	static gen(person){
		/** @type {RelationType} */
		const relation = random.choice(this.relations);
		return new Relation(
			relation,
			relation.agentTypes.map((_, i) => i ? person.randomOtherPerson : person)
		);
	}
}
Relation.relations = [
	new RelationType('apprenticeship', ['master', 'apprentice']),
	new RelationType('employment', ['employer', 'employee']),
	new RelationType('friendship', ['friend', 'friend']),
	new RelationType('parenthood (adoptive)', ['parent', 'parent', 'child']),
	new RelationType('parenthood (biological)', ['parent', 'parent', 'child']),
];