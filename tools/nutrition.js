const MOLAR_MASS = {
	H: 1.008,
	C: 12.011,
	N: 14.007,
	O: 15.999,
	Na: 22.99,
	Mg: 24.305,
	P: 30.974,
	S: 32.06,
	K: 39.098,
	Ca: 40.078,
	Mn: 54.938,
	Fe: 55.845,
	Cu: 63.546,
	Zn: 65.38,
	Se: 78.971,
	Mo: 95.95,
	I: 126.9,
};


class SourcedObject {
	/**
	 * @param {string} name
	 * @param {string?} source URL
	 */
	constructor(name, source){
		this.name = name;
		this.source = source || `https://en.wikipedia.org/wiki/${name}`;
	}
	get a(){
		const elem = document.createElement('a');
		elem.innerHTML = this.name;
		elem.href = this.source;
		return elem;
	}
}


class Nutrient extends SourcedObject {
	/**
	 * @param {string} name
	 * @param {{string: number}} composition
	 * @param {number} density g/cm^3
	 * @param {string?} source URL
	 */
	constructor(name, composition, density = 1, source = undefined){
		super(name, source);
		this.compositionAmt = composition;
		this.density = density;
	}
	get composition(){
		const MM = this.molarMass;
		const mass = {};
		for (const elem in this.compositionAmt)
			mass[elem] = this.compositionAmt[elem] * MOLAR_MASS[elem] / MM;
		return mass;
	}
	get molarMass(){
		let s = 0;
		for (const elem in this.compositionAmt)
			s += this.compositionAmt[elem] * MOLAR_MASS[elem];
		return s;
	}
}


class NutrientAmount {
	/**
	 * @param {Nutrient} nutrient
	 * @param {number} amount
	 */
	constructor(nutrient, amount){
		this.nutrient = nutrient;
		this.amount = amount;
	}
}


class Food extends SourcedObject {
	/**
	 * @param {string} name
	 * @param {*} properties incl. composition := Nutrient[]
	 * @param {string?} source URL
	 */
	constructor(name, properties, source){
		super(name, source);
		this.properties = properties;
	}
	get composition(){
		const c = {};
		this.nutrients.forEach(nutrientAmount => {
			const [nutrient, amount] = [nutrientAmount.nutrient, nutrientAmount.amount];
			for (const elem in nutrient.composition){
				const delta = nutrient.composition[elem] * amount / this.unitMass;
				if (c[elem])
					c[elem] += delta;
				else
					c[elem] = delta;
			}
		});
		return c;
	}
	get compositionUnit(){
		const COMPOSITION = this.composition;
		const c = {};
		for (const nutrient in COMPOSITION)
			c[nutrient] = COMPOSITION[nutrient] * this.measures.unit;
		return c;
	}
	get measures(){
		return this.properties.measures;
	}
	/** @returns {NutrientAmount[]} */
	get nutrients(){
		return this.properties.nutrients;
	}
	/** @returns {number} g */
	get unitMass(){
		return this.properties.unitMass || 100;
	}
}


// NUTRIENTS
Nutrient.WATER = new Nutrient('Water', {H: 2, O: 1});
Nutrient.PROTEIN = new Nutrient('Protein', {C: 6, H: 14, N: 2, O: 2}); // Lysine
Nutrient.FAT = new Nutrient('Fat', {C: 18, H: 36, O: 2}); // Stearic Acid
Nutrient.FIBER = new Nutrient('Fiber', {C: 12, H: 20, O: 10}); // Cellulose
Nutrient.SUGAR = new Nutrient('Sugar', {C: 6, H: 12, O: 6}); // Glucose

Nutrient.CALCIUM = new Nutrient('Calcium', {Ca: 1});
Nutrient.IRON = new Nutrient('Iron', {Fe: 1});
Nutrient.MAGNESIUM = new Nutrient('Magnesium', {Mg: 1});
Nutrient.PHOSPHORUS = new Nutrient('Phosphorus', {P: 1});
Nutrient.POTASSIUM = new Nutrient('Potassium', {K: 1});
Nutrient.SODIUM = new Nutrient('Sodium', {Na: 1});
Nutrient.ZINC = new Nutrient('Zinc', {Zn: 1});
Nutrient.COPPER = new Nutrient('Copper', {Cu: 1});
Nutrient.MANGANESE = new Nutrient('Manganese', {Mn: 1});
Nutrient.IODINE = new Nutrient('Iodine', {I: 1});
Nutrient.SELENIUM = new Nutrient('Selenium', {Se: 1});
Nutrient.MOLYBDENUM = new Nutrient('Molybdenum', {Mo: 1});
Nutrient.VITAMIN_C = new Nutrient('Vitamin C', {C: 6, H: 8, O: 6});
Nutrient.THIAMIN = new Nutrient('Vitamin B1 (Thiamin)', {C: 12, H: 17, N: 4, O: 1, S: 1});
Nutrient.NIACIN = new Nutrient('Vitamin B3 (Niacin)', {C: 6, H: 5, N: 1, O: 2});
Nutrient.B6 = new Nutrient('Vitamin B6', {C: 8, H: 10, N: 1, O: 6, P: 1}); // Pyridoxal Phosphate
Nutrient.BIOTIN = new Nutrient('Vitamin B7 (Biotin)', {C: 10, H: 16, N: 2, O: 3, S: 1});
Nutrient.K = new Nutrient('Vitamin K', {C: 31, H: 46, O: 2}); // Phytomenadione


// FOODS
Food.OnionYellow = new Food('Yellow Onion', {
	measures: {
		unit: 143,
	},
	nutrients: [
		new NutrientAmount(Nutrient.WATER, 90.1),
		new NutrientAmount(Nutrient.PROTEIN, 0.83),
		new NutrientAmount(Nutrient.FAT, 0.05),
		new NutrientAmount(Nutrient.FIBER, 2.71),
		new NutrientAmount(Nutrient.SUGAR, 5.82),
		new NutrientAmount(Nutrient.CALCIUM, 15e-3),
		new NutrientAmount(Nutrient.IRON, 0.28e-3),
		new NutrientAmount(Nutrient.MAGNESIUM, 9e-3),
		new NutrientAmount(Nutrient.PHOSPHORUS, 34e-3),
		new NutrientAmount(Nutrient.POTASSIUM, 182e-3),
		new NutrientAmount(Nutrient.SODIUM, 1e-3),
		new NutrientAmount(Nutrient.ZINC, 0.2e-3),
		new NutrientAmount(Nutrient.COPPER, 0.035e-3),
		new NutrientAmount(Nutrient.MANGANESE, 0.144e-3),
		new NutrientAmount(Nutrient.IODINE, 10e-6),
		new NutrientAmount(Nutrient.SELENIUM, 2.5e-6),
		new NutrientAmount(Nutrient.VITAMIN_C, 8.2e-3),
		new NutrientAmount(Nutrient.BIOTIN, 0.004e-6),
	],
}, 'https://fdc.nal.usda.gov/fdc-app.html#/food-details/790646/nutrients');
Food.PotatoSweet = new Food('Sweet Potato', {
	measures: {
		unit: 271, // self-measurement
	},
	nutrients: [
		new NutrientAmount(Nutrient.WATER, 79.5),
		new NutrientAmount(Nutrient.PROTEIN, 1.58),
		new NutrientAmount(Nutrient.FAT, 0.38),
		new NutrientAmount(Nutrient.FIBER, 4.44),
		new NutrientAmount(Nutrient.SUGAR, 6.06),
		new NutrientAmount(Nutrient.CALCIUM, 22e-3),
		new NutrientAmount(Nutrient.IRON, 0.4e-3),
		new NutrientAmount(Nutrient.MAGNESIUM, 19.1e-3),
		new NutrientAmount(Nutrient.PHOSPHORUS, 37e-3),
		new NutrientAmount(Nutrient.POTASSIUM, 486e-3),
		new NutrientAmount(Nutrient.SODIUM, 2.5e-3),
		new NutrientAmount(Nutrient.ZINC, 0.34e-3),
		new NutrientAmount(Nutrient.COPPER, 0.187e-3),
		new NutrientAmount(Nutrient.MANGANESE, 0.417e-3),
		new NutrientAmount(Nutrient.SELENIUM, 2.5e-6),
		new NutrientAmount(Nutrient.MOLYBDENUM, 2.5e-6),
		new NutrientAmount(Nutrient.VITAMIN_C, 14.8e-3),
		new NutrientAmount(Nutrient.THIAMIN, 0.045e-3),
		new NutrientAmount(Nutrient.NIACIN, 0.432e-3),
		new NutrientAmount(Nutrient.B6, 0.124e-3),
		new NutrientAmount(Nutrient.K, 0.2e-6),
	],
}, 'https://fdc.nal.usda.gov/fdc-app.html#/food-details/2346404/nutrients');