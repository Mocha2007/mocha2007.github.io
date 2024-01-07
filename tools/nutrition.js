/* exported NUTRITION_LOADED, nutrition_main, SCATTER_CONTROL */
/* global elementData, toURL */
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
	Co: 58.933194,
	Cu: 63.546,
	Zn: 65.38,
	Se: 78.971,
	Mo: 95.95,
	I: 126.9,
};

/** @param {string} symbol */
function getElemColor(symbol){
	return elementData.find(datum => datum.symbol === symbol).properties.modelColor;
}

function fancyList(header = '', items = [], headerLevel = 3, listType = 'ul'){
	const container = document.createElement('div');
	container.classList.add('fancyList');
	// header
	const h = document.createElement('h' + headerLevel);
	h.innerHTML = header;
	container.appendChild(h);
	// list
	const l = document.createElement(listType);
	container.appendChild(l);
	items.forEach(item => {
		const li = document.createElement('li');
		li.appendChild(typeof item === 'string' ? document.createTextNode(item) : item);
		l.appendChild(li);
	});
	return container;
}

/**
 * @param {Nutrient} nutrient_x
 * @param {Nutrient} nutrient_y
 */
function showScatter(nutrient_x, nutrient_y){
	const composition = this.composition;
	const pairs = [];
	for (const elem in composition){
		pairs.push([elem, composition[elem], getElemColor(elem)]);
	}
	const [x, y, text] = [
		Food.foods.map(food => food.nutrient(nutrient_x)),
		Food.foods.map(food => food.nutrient(nutrient_y)),
		Food.foods.map(food => food.name),
	];
	const scatterURL = 'chart.html?data=' + toURL({
		type: 'scatter',
		x,
		y,
		text,
		fill: 'green',
		labels: true,
		logx: true,
		logy: true,
	});
	document.getElementById('scatter').src = scatterURL;
}

function nutrition_main(){
	// foods
	Food.foods.sort((a, b) => a.name < b.name ? -1 : 1);
	const foodContainer = document.getElementById('food');
	foodContainer.innerHTML = '';
	foodContainer.appendChild(fancyList('Foods',
		Food.foods.map(food => food.linkShowPie)
	));
	// nutrients
	const nutrientContainer = document.getElementById('nutrient');
	nutrientContainer.innerHTML = '';
	nutrientContainer.appendChild(fancyList('Nutrients',
		Nutrient.nutrients.map(nutrient => nutrient.linkShowBar)
	));
	// list of todo
	const todoContainer = document.getElementById('todo');
	todoContainer.innerHTML = '';
	todoContainer.appendChild(fancyList('Missing Densities',
		Nutrient.nutrients
			.filter(nutrient => nutrient.density === 1)
			.map(nutrient => nutrient.a)
	));
	// scatter
	SCATTER_CONTROL.init();
	// defaults...
	Food.OnionYellow.show();
	Nutrient.POTASSIUM.showBar();
	// done
	console.info('nutrition.js ran successfully');
}

/**
 * @param {Nutrient} nutrient
 * @param {number} value
 */
function fdaround(nutrient, value){
	// https://www.fda.gov/files/food/published/Food-Labeling-Guide-%28PDF%29.pdf
	let interval = 0.1; // nearest integer; 0.5 = "nearest half"
	switch (nutrient){
		// p. 129 (Appendix H)
		case NutrientGroup.CALORIES:
			interval = 50 < value ? 10 : 5;
			break;
		case Nutrient.FAT:
			interval = value < 0.5 ? 1 : value < 5 ? 0.5 : 1;
			break;
		case Nutrient.CHOLESTEROL:
			interval = value < 2 ? 4 : value < 5 ? 1 : 5;
			break;
		case Nutrient.SODIUM:
		case Nutrient.POTASSIUM:
			interval = value < 5 ? 10 : value < 140 ? 5 : 10;
			break;
		case NutrientGroup.CARBOHYDRATES:
		case Nutrient.FIBER:
		case NutrientGroup.SUGARS:
		case Nutrient.ALCOHOL:
		case Nutrient.PROTEIN:
			interval = 1;
	}
	return Math.round(value / interval) * interval;
}

const SCATTER_CONTROL = {
	elem: {
		/** @returns {HTMLSelectElement} */
		get x(){
			return document.getElementById('nutrientX');
		},
		/** @returns {HTMLSelectElement} */
		get y(){
			return document.getElementById('nutrientY');
		},
	},
	/** @type {Nutrient} */
	x: undefined,
	/** @type {Nutrient} */
	y: undefined,
	init(){
		// add nutrients to selectors...
		Nutrient.nutrients.forEach(nutrient => {
			[this.elem.x, this.elem.y].forEach((selector, i) => {
				const option = document.createElement('option');
				option.innerHTML = option.value = nutrient.name;
				option.id = `SELECTOR_${i}_${nutrient.name}`;
				selector.appendChild(option);
			});
		});
		document.getElementById('SELECTOR_0_Sodium').selected = 'selected';
		document.getElementById('SELECTOR_1_Potassium').selected = 'selected';
		this.reread();
	},
	reread(){
		// reread x
		this.x = Nutrient.fromString(this.elem.x.value);
		this.y = Nutrient.fromString(this.elem.y.value);
		// reread y
		this.update();
	},
	update(){
		showScatter(this.x, this.y);
	},
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
	 * @param {number} DV - p. 167 https://www.fda.gov/files/food/published/Food-Labeling-Guide-%28PDF%29.pdf
	 * @param {number} density g/cm^3 - as close to 37C @ 1 atm as I can find...
	 * @param {string?} source URL
	 */
	constructor(name, composition, DV = 0, density = 1, source = undefined){
		super(name, source);
		this.DV = DV;
		this.compositionAmt = composition;
		/** @type {number} g/cm^3 */
		this.density = density;
		Nutrient.nutrients.push(this);
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
	// HTML crap
	get linkShowBar(){
		const elem = document.createElement('span');
		elem.classList.add('button');
		elem.innerHTML = this.name;
		elem.onclick = () => this.showBar();
		return elem;
	}
	// methods
	showBar(){
		const x = [], y = [];
		Food.foods.forEach(food => {
			const fy = food.nutrient(this);
			// console.debug(food.name, fy, this.name);
			if (fy){
				x.push(food.name);
				y.push(fy);
			}
		});
		const data = {
			pruneY: Number.MIN_VALUE,
			reverse: true,
			sort: true,
			type: 'bar',
			x,
			y,
			maxBars: 20,
		};
		const barURL = 'chart.html?data=' + toURL(data);
		document.getElementById('bar').src = barURL;
		console.info(`nutrition.js displaying foods rich in ${this.name}`);
	}
	// static
	/** @param {string} s */
	static fromString(s){
		return Nutrient.nutrients.find(nutrient => nutrient.name === s);
	}
}
/** @type {Nutrient[]} */
Nutrient.nutrients = [];


class NutrientGroup extends Nutrient {
	/** Eg. "Calories", "Carbohydrates"
	 * @param {string} name
	 * @param {number} DV
	 * @param {NutrientAmount[]} nutrientWeights [Nutrient, Weight]
	 */
	constructor(name, DV = 0, nutrientWeights = []){
		super(name, {}, DV);
		this.nutrientWeights = nutrientWeights;
		NutrientGroup.groups.push(this);
	}
	/** @param {Food} food */
	value(food, useUnitMass = false){
		return this.nutrientWeights
			.map(na => food.nutrient(na.nutrient, useUnitMass) * na.amount)
			.reduce((a, b) => a+b);
	}
}
/** @type {NutrientGroup[]} */
NutrientGroup.groups = [];


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
		Food.foods.push(this);
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
	get densityEstimate(){
		return this.nutrients
			.map(na => na.nutrient.density * na.amount / this.unitMass)
			.reduce((a, b) => a+b, 0);
	}
	get measures(){
		return this.properties.measures || {};
	}
	get nutritionLabel(){
		// https://upload.wikimedia.org/wikipedia/commons/7/75/US_Nutritional_Fact_Label_2.svg
		// https://www.fda.gov/files/food/published/Food-Labeling-Guide-%28PDF%29.pdf
		function appendHR(){
			elem.appendChild(document.createElement('hr'));
		}
		const elem = document.createElement('div');
		const title = document.createElement('h3');
		title.innerHTML = 'Nutrition Facts';
		elem.appendChild(title);
		// measures
		const measureContainer = document.createElement('div');
		elem.appendChild(measureContainer);
		for (const measure in this.measures){
			const measureElem = document.createElement('div');
			measureElem.innerHTML = `${measure}: ${this.measures[measure]} g`;
			measureContainer.appendChild(measureElem);
		}
		// calories
		appendHR();
		const calories = document.createElement('div');
		// eslint-disable-next-line max-len
		calories.innerHTML = `<b>Calories</b> ${Math.round(this.nutrient(NutrientGroup.CALORIES, true))}<br>
		Calories from Fat ${Math.round(9*this.nutrient(Nutrient.FAT, true))}`;
		elem.appendChild(calories);
		// central sector
		appendHR();
		const MAIN_NUTRIENTS = [
			[Nutrient.FAT, true],
			[Nutrient.CHOLESTEROL, true],
			[Nutrient.SODIUM, true],
			[NutrientGroup.CARBOHYDRATES, true],
			[Nutrient.FIBER, false],
			[NutrientGroup.SUGARS, false],
			[Nutrient.STARCH, false],
			[Nutrient.PROTEIN, true],
		];
		MAIN_NUTRIENTS.forEach(datum => {
			const [nutrient, bold] = datum;
			const trueValue = this.nutrient(nutrient, true);
			const value = fdaround(nutrient, trueValue);
			if (!value)
				return;
			const lineItem = document.createElement('div');
			if (bold)
				lineItem.innerHTML = `<b>${nutrient.name}</b>`;
			else
				lineItem.innerHTML = '&mdash; ' + nutrient.name;
			lineItem.innerHTML += ' ' + value + 'g';
			// % Daily Value
			if (nutrient.DV)
				lineItem.innerHTML += ' &mdash; ' + Math.round(100 * trueValue / nutrient.DV) + '%';
			elem.appendChild(lineItem);
		});
		// vitamins and minerals w/ %DV
		appendHR();
		// eslint-disable-next-line max-len
		Nutrient.nutrients.filter(nutrient => nutrient.DV && !MAIN_NUTRIENTS.map(x => x[0]).includes(nutrient))
			.forEach(nutrient => {
				const value = Math.round(100 * this.nutrient(nutrient, true));
				if (!value)
					return;
				const lineItem = document.createElement('div');
				lineItem.innerHTML = nutrient.name + ' &mdash; ' + value + '%';
				elem.appendChild(lineItem);
			});
		return elem;
	}
	/** @returns {NutrientAmount[]} */
	get nutrients(){
		return this.properties.nutrients;
	}
	/** @returns {number} g */
	get unitMass(){
		return this.properties.unitMass || 100;
	}
	// HTML crap
	get linkShowPie(){
		const elem = document.createElement('span');
		elem.classList.add('button');
		elem.innerHTML = this.name;
		elem.onclick = () => this.show();
		return elem;
	}
	// methods
	/**
	 * @param {Nutrient} n
	 * @param {boolean} useUnitMass
	 */
	nutrient(n, useUnitMass = false){
		const DIVISOR = useUnitMass ? 1 : this.unitMass;
		if (n instanceof NutrientGroup)
			return n.value(this, useUnitMass);
		// eslint-disable-next-line max-len
		return (maybe_n => maybe_n ? maybe_n.amount / DIVISOR : 0)(this.nutrients.find(na => na.nutrient === n));
	}
	show(){
		this.showNutrition();
		this.showPie();
	}
	showNutrition(){
		const container = document.getElementById('foodLabel');
		container.innerHTML = '';
		container.appendChild(this.nutritionLabel);
	}
	showPie(){
		const composition = this.composition;
		const pairs = [];
		for (const elem in composition){
			pairs.push([elem, composition[elem], getElemColor(elem)]);
		}
		const pieURL = 'chart.html?data=' + toURL({
			type: 'pie',
			pairs,
			labels: true,
		});
		document.getElementById('pie').src = pieURL;
		console.info(`nutrition.js displaying composition of ${this.name}`);
	}
}
/** @type {Food[]} */
Food.foods = [];


// NUTRIENTS
Nutrient.WATER = new Nutrient('Water', {H: 2, O: 1}, 0, 0.99336);
Nutrient.NITROGEN = new Nutrient('Nitrogen', {N: 2}); // ???
Nutrient.PROTEIN = new Nutrient('Protein', {C: 6, H: 13, N: 1, O: 2}, 50, 1.5); // Leucine
Nutrient.FAT = new Nutrient('Fat', {C: 18, H: 36, O: 2}, 65, 0.895); // Stearic Acid
Nutrient.ASH = new Nutrient('Ash', {C: 1, H: 1, N: 1, O: 1}); // ???
Nutrient.FIBER = new Nutrient('Fiber', {C: 12, H: 20, O: 10}, 25, 1.5); // Cellulose
Nutrient.SUGAR = new Nutrient('Sugar (Unspecified)', {C: 6, H: 12, O: 6}, 0, 1.55);
Nutrient.SUCROSE = new Nutrient('Sucrose', {C: 12, H: 22, O: 11}, 0, 1.587);
Nutrient.GLUCOSE = new Nutrient('Glucose', {C: 6, H: 12, O: 6}, 0, 1.54);
Nutrient.FRUCTOSE = new Nutrient('Fructose', {C: 6, H: 12, O: 6}, 0, 1.694);
Nutrient.LACTOSE = new Nutrient('Lactose', {C: 12, H: 22, O: 11}, 0, 1.525);
Nutrient.MALTOSE = new Nutrient('Maltose', {C: 12, H: 22, O: 11}, 0, 1.54);
Nutrient.STARCH = new Nutrient('Starch', {C: 6, H: 10, O: 5});
// Minerals
Nutrient.CALCIUM = new Nutrient('Calcium', {Ca: 1}, 1);
Nutrient.IRON = new Nutrient('Iron', {Fe: 1}, 18e-3);
Nutrient.MAGNESIUM = new Nutrient('Magnesium', {Mg: 1}, 400e-3);
Nutrient.PHOSPHORUS = new Nutrient('Phosphorus', {P: 1}, 1);
Nutrient.POTASSIUM = new Nutrient('Potassium', {K: 1});
Nutrient.SODIUM = new Nutrient('Sodium', {Na: 1}, 2.4);
Nutrient.ZINC = new Nutrient('Zinc', {Zn: 1}, 15e-3);
Nutrient.COPPER = new Nutrient('Copper', {Cu: 1}, 2e-3);
Nutrient.MANGANESE = new Nutrient('Manganese', {Mn: 1}, 2e-3);
Nutrient.IODINE = new Nutrient('Iodine', {I: 1}, 150e-6);
Nutrient.SELENIUM = new Nutrient('Selenium', {Se: 1}, 70e-6);
Nutrient.MOLYBDENUM = new Nutrient('Molybdenum', {Mo: 1}, 75e-6);
// A
Nutrient.RETINOL = new Nutrient('Retinol', {C: 20, H: 30, O: 1});
Nutrient.CAROTENE_ALPHA = new Nutrient('α-Carotene', {C: 40, H: 56});
Nutrient.CAROTENE_BETA = new Nutrient('β-Carotene', {C: 40, H: 56}, 1, 'https://en.wikipedia.org/wiki/%CE%92-Carotene');
Nutrient.CRYPTOXANTHIN_BETA = new Nutrient('β-Cryptoxanthin', {C: 40, H: 56, O: 1});
Nutrient.CRYPTOXANTHIN_ALPHA = new Nutrient('α-Cryptoxanthin', {C: 40, H: 56, O: 1}); // ???
// B
Nutrient.THIAMIN = new Nutrient('Vitamin B1 (Thiamin)', {C: 12, H: 17, N: 4, O: 1, S: 1}, 1.5e-3);
Nutrient.RIBOFLAVIN = new Nutrient('Vitamin B2 (Riboflavin)', {C: 17, H: 20, N: 4, O: 6}, 1.7e-3);
Nutrient.NIACIN = new Nutrient('Vitamin B3 (Niacin)', {C: 6, H: 5, N: 1, O: 2}, 20e-3, 1.473, 'https://en.wikipedia.org/wiki/Vitamin_B3');
Nutrient.CHOLINE = new Nutrient('Vitamin B4 (Choline)', {C: 5, H: 14, N: 1, O: 1});
Nutrient.PANTOTHENIC_ACID = new Nutrient('Vitamin B5 (Pantothenic Acid)', {C: 9, H: 17, N: 1, O: 5}, 10e-3, 1.266);
Nutrient.VITAMIN_B6 = new Nutrient('Vitamin B6', {C: 8, H: 10, N: 1, O: 6, P: 1}, 2e-3, 1.638); // Pyridoxal Phosphate
Nutrient.BIOTIN = new Nutrient('Vitamin B7 (Biotin)', {C: 10, H: 16, N: 2, O: 3, S: 1}, 300e-6);
Nutrient.FOLATE = new Nutrient('Vitamin B9 (Folate)', {C: 19, H: 19, N: 7, O: 6}, 400e-6, 1.6, 'https://en.wikipedia.org/wiki/Folate');
Nutrient.VITAMIN_B12 = new Nutrient('Vitamin B12 (Cobalamin)', {C: 63, H: 88, Co: 1, N: 14, O: 14, P: 1}, 6e-6);
// C
Nutrient.VITAMIN_C = new Nutrient('Vitamin C', {C: 6, H: 8, O: 6}, 60e-3, 1.694);
// D
Nutrient.VITAMIN_D3 = new Nutrient('Vitamin D3 (Cholecalciferol)', {C: 27, H: 44, O: 1});
Nutrient._25_HYDROXYCHOLECALCIFEROL = new Nutrient('Calcifediol', {C: 27, H: 44, O: 2});
// E
Nutrient.VITAMIN_E = new Nutrient('Vitamin E (Unspecified)', {C: 29, H: 50, O: 2}, 0, 0.95, 'https://en.wikipedia.org/wiki/Vitamin_E'); // α-Tocopherol
Nutrient.TOCOPHEROL_BETA = new Nutrient('β-Tocopherol', {C: 28, H: 48, O: 2});
Nutrient.TOCOPHEROL_GAMMA = new Nutrient('γ-Tocopherol', {C: 28, H: 48, O: 2});
Nutrient.TOCOPHEROL_DELTA = new Nutrient('δ-Tocopherol', {C: 27, H: 46, O: 2});
Nutrient.TOCOTRIENOL_GAMMA = new Nutrient('γ-Tocotrienol', {C: 28, H: 42, O: 2});
// K
Nutrient.PHYLLOQUINONE = new Nutrient('Phytomenadione', {C: 31, H: 46, O: 2}); // Phytomenadione
Nutrient.DIHYDROPHYLLOQUINONE = new Nutrient('Dihydrophylloquinone', {C: 31, H: 50, O: 4}); // ???
Nutrient.MENAQUINONE_4 = new Nutrient('Menatetrenone', {C: 31, H: 40, O: 2});
// Cholesterol and Phytosterols
Nutrient.CHOLESTEROL = new Nutrient('Cholesterol', {C: 27, H: 46, O: 1}, 300e-3, 1.052, 'https://en.wikipedia.org/wiki/Cholesterol');
Nutrient.CAMPESTEROL = new Nutrient('Campesterol', {C: 28, H: 48, O: 1});
Nutrient.SITOSTEROL_BETA = new Nutrient('β-Sitosterol', {C: 29, H: 50, O: 1});
Nutrient.STIGMASTEROL = new Nutrient('Stigmasterol', {C: 29, H: 48, O: 1});
// misc Carotenoids
Nutrient.CIS_LUTEIN = new Nutrient('Cis-Lutein', {C: 40, H: 56, O: 2}); // ???
Nutrient.LUTEIN = new Nutrient('Lutein', {C: 40, H: 56, O: 2});
Nutrient.ZEAXANTHIN = new Nutrient('Zeaxanthin', {C: 40, H: 56, O: 2});
// ?????
Nutrient.ALCOHOL = new Nutrient('Alcohol', {C: 2, H: 6, O: 1}, 0, 0.78945, 'https://en.wikipedia.org/wiki/Ethanol'); // Ethanol
Nutrient.BETAINE = new Nutrient('Betaine', {C: 5, H: 11, N: 1, O: 2}); // Trimethylglycine
Nutrient.CAFFEINE = new Nutrient('Caffeine', {C: 8, H: 10, N: 4, O: 2});
Nutrient.THEOBROMINE = new Nutrient('Theobromine', {C: 7, H: 8, N: 4, O: 2});

NutrientGroup.SUGARS = new NutrientGroup('Sugars', 0, [
	new NutrientAmount(Nutrient.SUCROSE, 1),
	new NutrientAmount(Nutrient.GLUCOSE, 1),
	new NutrientAmount(Nutrient.FRUCTOSE, 1),
	new NutrientAmount(Nutrient.LACTOSE, 1),
	new NutrientAmount(Nutrient.MALTOSE, 1),
	new NutrientAmount(Nutrient.SUGAR, 1),
]);

NutrientGroup.CALORIES_FROM_SUGAR = new NutrientGroup('Calories from Sugar', 0, [
	new NutrientAmount(Nutrient.SUCROSE, 3.943),
	new NutrientAmount(Nutrient.GLUCOSE, 3.719),
	new NutrientAmount(Nutrient.FRUCTOSE, 3.75),
	new NutrientAmount(Nutrient.LACTOSE, 3.94),
	new NutrientAmount(Nutrient.MALTOSE, 3.8), // unknown
	new NutrientAmount(Nutrient.SUGAR, 3.8),
]);

NutrientGroup.CALORIES = new NutrientGroup('Calories', 0, [
	new NutrientAmount(NutrientGroup.CALORIES_FROM_SUGAR, 1),
	new NutrientAmount(Nutrient.FIBER, 2),
	new NutrientAmount(Nutrient.STARCH, 4.1788), // heat of combustion
	new NutrientAmount(Nutrient.FAT, 9),
	new NutrientAmount(Nutrient.PROTEIN, 4),
	new NutrientAmount(Nutrient.ALCOHOL, 7.112), // ditto
]);

NutrientGroup.CARBOHYDRATES = new NutrientGroup('Carbohydrates', 0, [
	new NutrientAmount(NutrientGroup.SUGARS, 1),
	new NutrientAmount(Nutrient.FIBER, 1),
	new NutrientAmount(Nutrient.STARCH, 1),
]);

NutrientGroup.VITAMIN_A = new NutrientGroup('Vitamin A (μg RAE)', 5000/3.3, [
	new NutrientAmount(Nutrient.RETINOL, 1),
	new NutrientAmount(Nutrient.CAROTENE_BETA, 1/12),
	new NutrientAmount(Nutrient.CAROTENE_ALPHA, 1/24),
	// new NutrientAmount(Nutrient.CAROTENE_GAMMA, 1/24),
	new NutrientAmount(Nutrient.CRYPTOXANTHIN_BETA, 1/24),
	new NutrientAmount(Nutrient.CRYPTOXANTHIN_ALPHA, 1/24), // ???
]);

NutrientGroup.VITAMIN_B = new NutrientGroup('Vitamin B (total)', 0, [
	new NutrientAmount(Nutrient.THIAMIN, 1),
	new NutrientAmount(Nutrient.RIBOFLAVIN, 1),
	new NutrientAmount(Nutrient.NIACIN, 1),
	new NutrientAmount(Nutrient.CHOLINE, 1),
	new NutrientAmount(Nutrient.PANTOTHENIC_ACID, 1),
	new NutrientAmount(Nutrient.VITAMIN_B6, 1),
	new NutrientAmount(Nutrient.BIOTIN, 1),
	new NutrientAmount(Nutrient.FOLATE, 1),
	new NutrientAmount(Nutrient.VITAMIN_B12, 1),
]);

NutrientGroup.VITAMIN_D = new NutrientGroup('Vitamin D (total)', 400e-3*40, [
	// new NutrientAmount(Nutrient.VITAMIN_D1, 1),
	// new NutrientAmount(Nutrient.VITAMIN_D2, 1),
	new NutrientAmount(Nutrient.VITAMIN_D3, 1),
	// new NutrientAmount(Nutrient.VITAMIN_D4, 1),
	// new NutrientAmount(Nutrient.VITAMIN_D5, 1),
	new NutrientAmount(Nutrient._25_HYDROXYCHOLECALCIFEROL, 1),
]);

NutrientGroup.VITAMIN_E = new NutrientGroup('Vitamin E (total)', 15e-3, [
	new NutrientAmount(Nutrient.VITAMIN_E, 1),
	new NutrientAmount(Nutrient.TOCOPHEROL_BETA, 1),
	new NutrientAmount(Nutrient.TOCOPHEROL_GAMMA, 1),
	new NutrientAmount(Nutrient.TOCOPHEROL_DELTA, 1),
	new NutrientAmount(Nutrient.TOCOTRIENOL_GAMMA, 1),
]);

NutrientGroup.VITAMIN_K = new NutrientGroup('Vitamin K', 80e-6, [
	new NutrientAmount(Nutrient.PHYLLOQUINONE, 1),
	new NutrientAmount(Nutrient.DIHYDROPHYLLOQUINONE, 1),
	new NutrientAmount(Nutrient.MENAQUINONE_4, 1),
]);

NutrientGroup.PHYTOSTEROLS = new NutrientGroup('Phytosterols', 0, [
	new NutrientAmount(Nutrient.CAMPESTEROL, 1),
	new NutrientAmount(Nutrient.SITOSTEROL_BETA, 1),
	new NutrientAmount(Nutrient.STIGMASTEROL, 1),
]);

NutrientGroup.XANTHOPHYLLS = new NutrientGroup('Xanthophylls', 0, [
	new NutrientAmount(Nutrient.CIS_LUTEIN, 1),
	new NutrientAmount(Nutrient.LUTEIN, 1),
	new NutrientAmount(Nutrient.ZEAXANTHIN, 1),
]);

NutrientGroup.CAROTENOIDS = new NutrientGroup('Carotenoids', 0, [
	new NutrientAmount(NutrientGroup.XANTHOPHYLLS, 1),
	new NutrientAmount(Nutrient.CAROTENE_ALPHA, 1),
	new NutrientAmount(Nutrient.CAROTENE_BETA, 1),
]);

NutrientGroup.MINERALS = new NutrientGroup('Minerals (total)', 0, [
	new NutrientAmount(Nutrient.CALCIUM, 1),
	new NutrientAmount(Nutrient.IRON, 1),
	new NutrientAmount(Nutrient.MAGNESIUM, 1),
	new NutrientAmount(Nutrient.PHOSPHORUS, 1),
	new NutrientAmount(Nutrient.POTASSIUM, 1),
	new NutrientAmount(Nutrient.SODIUM, 1),
	new NutrientAmount(Nutrient.ZINC, 1),
	new NutrientAmount(Nutrient.COPPER, 1),
	new NutrientAmount(Nutrient.MANGANESE, 1),
	new NutrientAmount(Nutrient.IODINE, 1),
	new NutrientAmount(Nutrient.SELENIUM, 1),
	new NutrientAmount(Nutrient.MOLYBDENUM, 1),
]);

NutrientGroup.VITAMINS = new NutrientGroup('Vitamins (total)', 0, [
	new NutrientAmount(NutrientGroup.VITAMIN_A, 1),
	new NutrientAmount(NutrientGroup.VITAMIN_B, 1),
	new NutrientAmount(Nutrient.VITAMIN_C, 1),
	new NutrientAmount(NutrientGroup.VITAMIN_D, 1),
	new NutrientAmount(NutrientGroup.VITAMIN_E, 1),
	new NutrientAmount(NutrientGroup.VITAMIN_K, 1),
]);

NutrientGroup.VITAMINS_AND_MINERALS = new NutrientGroup('Vitamins & Minerals (total)', 0, [
	new NutrientAmount(NutrientGroup.VITAMINS, 1),
	new NutrientAmount(NutrientGroup.MINERALS, 1),
]);

// FOODS
Food.OnionYellow = new Food('Yellow Onion', {
	measures: {
		unit: 143,
	},
	nutrients: [
		new NutrientAmount(Nutrient.WATER, 90.1),
		new NutrientAmount(Nutrient.PROTEIN, 0.83),
		new NutrientAmount(Nutrient.FAT, 0.05),
		new NutrientAmount(Nutrient.ASH, 0.41),
		new NutrientAmount(Nutrient.FIBER, 2.71),
		new NutrientAmount(Nutrient.SUCROSE, 1.6),
		new NutrientAmount(Nutrient.GLUCOSE, 2.31),
		new NutrientAmount(Nutrient.FRUCTOSE, 1.91),
		new NutrientAmount(Nutrient.CALCIUM, 15e-3),
		new NutrientAmount(Nutrient.IRON, 0.28e-3),
		new NutrientAmount(Nutrient.MAGNESIUM, 9e-3),
		new NutrientAmount(Nutrient.PHOSPHORUS, 34e-3),
		new NutrientAmount(Nutrient.POTASSIUM, 182e-3),
		new NutrientAmount(Nutrient.SODIUM, 1e-3),
		new NutrientAmount(Nutrient.ZINC, 0.2e-3),
		new NutrientAmount(Nutrient.COPPER, 0.035e-3),
		new NutrientAmount(Nutrient.MANGANESE, 0.144e-3),
		new NutrientAmount(Nutrient.VITAMIN_C, 8.2e-3),
	],
}, 'https://fdc.nal.usda.gov/fdc-app.html#/food-details/790646/nutrients');
Food.PotatoSweet = new Food('Sweet Potato', {
	measures: {
		unit: 271, // self-measurement
	},
	nutrients: [
		new NutrientAmount(Nutrient.WATER, 79.5),
		new NutrientAmount(Nutrient.NITROGEN, 0.25),
		new NutrientAmount(Nutrient.PROTEIN, 1.58),
		new NutrientAmount(Nutrient.FAT, 0.38),
		new NutrientAmount(Nutrient.ASH, 1.18),
		new NutrientAmount(Nutrient.FIBER, 4.44),
		new NutrientAmount(Nutrient.SUCROSE, 3.06),
		new NutrientAmount(Nutrient.GLUCOSE, 0.98),
		new NutrientAmount(Nutrient.FRUCTOSE, 0.93),
		new NutrientAmount(Nutrient.MALTOSE, 1.1),
		new NutrientAmount(Nutrient.CALCIUM, 22e-3),
		new NutrientAmount(Nutrient.IRON, 0.4e-3),
		new NutrientAmount(Nutrient.MAGNESIUM, 19.1e-3),
		new NutrientAmount(Nutrient.PHOSPHORUS, 37e-3),
		new NutrientAmount(Nutrient.POTASSIUM, 486e-3),
		new NutrientAmount(Nutrient.ZINC, 0.34e-3),
		new NutrientAmount(Nutrient.COPPER, 0.187e-3),
		new NutrientAmount(Nutrient.MANGANESE, 0.417e-3),
		new NutrientAmount(Nutrient.VITAMIN_C, 14.8e-3),
		new NutrientAmount(Nutrient.THIAMIN, 0.045e-3),
		new NutrientAmount(Nutrient.NIACIN, 0.432e-3),
		new NutrientAmount(Nutrient.VITAMIN_B6, 0.124e-3),
		new NutrientAmount(Nutrient.PHYLLOQUINONE, 0.2e-6),
	],
}, 'https://fdc.nal.usda.gov/fdc-app.html#/food-details/2346404/nutrients');
Food.Carrot = new Food('Carrot', {
	nutrients: [
		new NutrientAmount(Nutrient.WATER, 87.7),
		new NutrientAmount(Nutrient.NITROGEN, 0.15),
		new NutrientAmount(Nutrient.PROTEIN, 0.94),
		new NutrientAmount(Nutrient.FAT, 0.35),
		new NutrientAmount(Nutrient.ASH, 0.72),
		new NutrientAmount(Nutrient.FIBER, 3.1),
		new NutrientAmount(Nutrient.SUGAR, 10.3 - 3.1),
		new NutrientAmount(Nutrient.CALCIUM, 30e-3),
		new NutrientAmount(Nutrient.IRON, 0.15e-3),
		new NutrientAmount(Nutrient.MAGNESIUM, 12.4e-3),
		new NutrientAmount(Nutrient.PHOSPHORUS, 40e-3),
		new NutrientAmount(Nutrient.POTASSIUM, 280e-3),
		new NutrientAmount(Nutrient.SODIUM, 87e-3),
		new NutrientAmount(Nutrient.ZINC, 0.24e-3),
		new NutrientAmount(Nutrient.COPPER, 0.061e-3),
		new NutrientAmount(Nutrient.MANGANESE, 0.13e-3),
		new NutrientAmount(Nutrient.THIAMIN, 0.065e-3),
		new NutrientAmount(Nutrient.RIBOFLAVIN, 0.095e-3),
		new NutrientAmount(Nutrient.NIACIN, 1.41e-3),
		new NutrientAmount(Nutrient.VITAMIN_B6, 0.146e-3),
		new NutrientAmount(Nutrient.BIOTIN, 2.22e-6),
		new NutrientAmount(Nutrient.FOLATE, 37e-6),
	],
}, 'https://fdc.nal.usda.gov/fdc-app.html#/food-details/2258586/nutrients');
Food.Peanut = new Food('Peanut', {
	nutrients: [
		new NutrientAmount(Nutrient.WATER, 4.82),
		new NutrientAmount(Nutrient.NITROGEN, 4.25),
		new NutrientAmount(Nutrient.PROTEIN, 23.2),
		new NutrientAmount(Nutrient.FAT, 43.3),
		new NutrientAmount(Nutrient.ASH, 2.2),
		new NutrientAmount(Nutrient.FIBER, 8),
		new NutrientAmount(Nutrient.SUGAR, 26.5 - 8),
		new NutrientAmount(Nutrient.CALCIUM, 49e-3),
		new NutrientAmount(Nutrient.IRON, 1.55e-3),
		new NutrientAmount(Nutrient.MAGNESIUM, 180e-3),
		new NutrientAmount(Nutrient.PHOSPHORUS, 380e-3),
		new NutrientAmount(Nutrient.POTASSIUM, 636e-3),
		new NutrientAmount(Nutrient.SODIUM, 1e-3),
		new NutrientAmount(Nutrient.ZINC, 2.78e-3),
		new NutrientAmount(Nutrient.COPPER, 0.46e-3),
		new NutrientAmount(Nutrient.MANGANESE, 1.68e-3),
		new NutrientAmount(Nutrient.SELENIUM, 17.8e-6),
	],
}, 'https://fdc.nal.usda.gov/fdc-app.html#/food-details/2515376/nutrients');
Food.Lime = new Food('Lime', { // todo create nutrient groups for all this other shit
	measures: {
		fruit: 65,
		slice: 8,
		cup: 200,
	},
	nutrients: [
		new NutrientAmount(Nutrient.WATER, 88.3),
		new NutrientAmount(Nutrient.PROTEIN, 0.7),
		new NutrientAmount(Nutrient.FAT, 0.2),
		new NutrientAmount(Nutrient.FIBER, 2.8),
		new NutrientAmount(Nutrient.SUGAR, 1.69),
		new NutrientAmount(Nutrient.CALCIUM, 33e-3),
		new NutrientAmount(Nutrient.IRON, 0.6e-3),
		new NutrientAmount(Nutrient.MAGNESIUM, 6e-3),
		new NutrientAmount(Nutrient.PHOSPHORUS, 18e-3),
		new NutrientAmount(Nutrient.POTASSIUM, 102e-3),
		new NutrientAmount(Nutrient.SODIUM, 2e-3),
		new NutrientAmount(Nutrient.ZINC, 0.11e-3),
		new NutrientAmount(Nutrient.COPPER, 0.065e-3),
		new NutrientAmount(Nutrient.SELENIUM, 0.4e-6),
		new NutrientAmount(Nutrient.VITAMIN_C, 29.1e-3),
		new NutrientAmount(Nutrient.THIAMIN, 0.03e-3),
		new NutrientAmount(Nutrient.RIBOFLAVIN, 0.02e-3),
		new NutrientAmount(Nutrient.NIACIN, 0.2e-3),
		new NutrientAmount(Nutrient.VITAMIN_B6, 0.043e-3),
		new NutrientAmount(Nutrient.FOLATE, 8e-6),
		new NutrientAmount(Nutrient.CHOLINE, 5.1e-3),
		new NutrientAmount(Nutrient.CAROTENE_BETA, 30e-6),
		new NutrientAmount(Nutrient.VITAMIN_E, 0.22e-3),
		new NutrientAmount(Nutrient.PHYLLOQUINONE, 0.6e-6),
	],
}, 'https://fdc.nal.usda.gov/fdc-app.html#/food-details/2344664/nutrients');
Food.RiceWhite = new Food('White Rice', {
	nutrients: [
		new NutrientAmount(Nutrient.WATER, 11.2),
		new NutrientAmount(Nutrient.NITROGEN, 1.18),
		new NutrientAmount(Nutrient.PROTEIN, 7.04),
		new NutrientAmount(Nutrient.FAT, 1.03),
		new NutrientAmount(Nutrient.ASH, 0.42),
		new NutrientAmount(Nutrient.FIBER, 2.77),
		new NutrientAmount(Nutrient.STARCH, 74.4),
		new NutrientAmount(Nutrient.CALCIUM, 4e-3),
		new NutrientAmount(Nutrient.IRON, 0.14e-3),
		new NutrientAmount(Nutrient.MAGNESIUM, 26.5e-3),
		new NutrientAmount(Nutrient.PHOSPHORUS, 108e-3),
		new NutrientAmount(Nutrient.POTASSIUM, 82e-3),
		new NutrientAmount(Nutrient.ZINC, 1.45e-3),
		new NutrientAmount(Nutrient.COPPER, 0.214e-3),
		new NutrientAmount(Nutrient.MANGANESE, 0.981e-3),
		new NutrientAmount(Nutrient.SELENIUM, 6.6e-6),
		new NutrientAmount(Nutrient.MOLYBDENUM, 64.2e-6),
		new NutrientAmount(Nutrient.THIAMIN, 0.065e-3),
		new NutrientAmount(Nutrient.RIBOFLAVIN, 0.08e-3),
		new NutrientAmount(Nutrient.NIACIN, 1.43e-3),
		new NutrientAmount(Nutrient.VITAMIN_B6, 0.058e-3),
	],
}, 'https://fdc.nal.usda.gov/fdc-app.html#/food-details/2512381/nutrients');
Food.Egg = new Food('Egg', { // todo create nutrient groups for all this other shit
	measures: {
		egg: 50.3,
	},
	nutrients: [
		new NutrientAmount(Nutrient.WATER, 75.8),
		new NutrientAmount(Nutrient.NITROGEN, 1.99),
		new NutrientAmount(Nutrient.PROTEIN, 12.4),
		new NutrientAmount(Nutrient.FAT, 9.96),
		new NutrientAmount(Nutrient.ASH, 0.85),
		new NutrientAmount(Nutrient.GLUCOSE, 0.2),
		new NutrientAmount(Nutrient.CALCIUM, 48e-3),
		new NutrientAmount(Nutrient.IRON, 1.67e-3),
		new NutrientAmount(Nutrient.MAGNESIUM, 11.4e-3),
		new NutrientAmount(Nutrient.PHOSPHORUS, 184e-3),
		new NutrientAmount(Nutrient.POTASSIUM, 132e-3),
		new NutrientAmount(Nutrient.SODIUM, 129e-3),
		new NutrientAmount(Nutrient.ZINC, 1.24e-3),
		new NutrientAmount(Nutrient.IODINE, 49.1e-6),
		new NutrientAmount(Nutrient.SELENIUM, 31.1e-6),
		new NutrientAmount(Nutrient.THIAMIN, 0.077e-3),
		new NutrientAmount(Nutrient.RIBOFLAVIN, 0.419e-3),
		new NutrientAmount(Nutrient.VITAMIN_B6, 0.063e-3),
		new NutrientAmount(Nutrient.FOLATE, 71e-6),
		new NutrientAmount(Nutrient.CHOLINE, 335e-3),
		new NutrientAmount(Nutrient.BETAINE, 0.3e-3),
		new NutrientAmount(Nutrient.RETINOL, 179e-6),
		new NutrientAmount(Nutrient.CRYPTOXANTHIN_BETA, 13e-6),
		new NutrientAmount(Nutrient.CRYPTOXANTHIN_ALPHA, 13e-6),
		new NutrientAmount(Nutrient.CIS_LUTEIN, 57e-6),
		new NutrientAmount(Nutrient.LUTEIN, 230e-6),
		new NutrientAmount(Nutrient.ZEAXANTHIN, 229e-6),
		new NutrientAmount(Nutrient.VITAMIN_D3, 2.46e-6),
		new NutrientAmount(Nutrient._25_HYDROXYCHOLECALCIFEROL, 0.56e-6),
	],
}, 'https://fdc.nal.usda.gov/fdc-app.html#/food-details/2344664/nutrients');
Food.Bacon = new Food('Bacon', { // todo create nutrient groups for all this other shit
	measures: {
		slice: 6.3,
	},
	nutrients: [
		new NutrientAmount(Nutrient.WATER, 14.2),
		new NutrientAmount(Nutrient.NITROGEN, 6.54),
		new NutrientAmount(Nutrient.PROTEIN, 40.9),
		new NutrientAmount(Nutrient.FAT, 36.5),
		new NutrientAmount(Nutrient.ASH, 6.33),
		new NutrientAmount(Nutrient.SUCROSE, 3.09),
		new NutrientAmount(Nutrient.GLUCOSE, 0.04),
		new NutrientAmount(Nutrient.FRUCTOSE, 0.01),
		new NutrientAmount(Nutrient.CALCIUM, 13e-3),
		new NutrientAmount(Nutrient.IRON, 1.28e-3),
		new NutrientAmount(Nutrient.MAGNESIUM, 36.5e-3),
		new NutrientAmount(Nutrient.PHOSPHORUS, 415e-3),
		new NutrientAmount(Nutrient.POTASSIUM, 557e-3),
		new NutrientAmount(Nutrient.SODIUM, 1830e-3),
		new NutrientAmount(Nutrient.ZINC, 3.56e-3),
		new NutrientAmount(Nutrient.COPPER, 0.13e-3),
		new NutrientAmount(Nutrient.MANGANESE, 0.02e-3),
	],
}, 'https://fdc.nal.usda.gov/fdc-app.html#/food-details/749420/nutrients');
Food.BreadRye = new Food('Rye Bread', { // todo create nutrient groups for all this other shit
	measures: {
		slice: 32,
	},
	nutrients: [
		new NutrientAmount(Nutrient.WATER, 37.3),
		new NutrientAmount(Nutrient.PROTEIN, 8.5),
		new NutrientAmount(Nutrient.FAT, 3.3),
		new NutrientAmount(Nutrient.FIBER, 5.8),
		new NutrientAmount(Nutrient.SUGAR, 3.85),
		new NutrientAmount(Nutrient.CALCIUM, 73e-3),
		new NutrientAmount(Nutrient.IRON, 2.83e-3),
		new NutrientAmount(Nutrient.MAGNESIUM, 40e-3),
		new NutrientAmount(Nutrient.PHOSPHORUS, 125e-3),
		new NutrientAmount(Nutrient.POTASSIUM, 166e-3),
		new NutrientAmount(Nutrient.SODIUM, 603e-3),
		new NutrientAmount(Nutrient.ZINC, 1.14e-3),
		new NutrientAmount(Nutrient.COPPER, 0.186e-3),
		new NutrientAmount(Nutrient.SELENIUM, 30.9e-6),
		new NutrientAmount(Nutrient.VITAMIN_C, 0.4e-3),
		new NutrientAmount(Nutrient.THIAMIN, 0.434e-3),
		new NutrientAmount(Nutrient.RIBOFLAVIN, 0.335e-3),
		new NutrientAmount(Nutrient.NIACIN, 3.8e-3),
		new NutrientAmount(Nutrient.VITAMIN_B6, 0.075e-3),
		new NutrientAmount(Nutrient.FOLATE, 110e-6),
		new NutrientAmount(Nutrient.CHOLINE, 14.6e-3),
		new NutrientAmount(Nutrient.CAROTENE_BETA, 4e-6),
		new NutrientAmount(Nutrient.CRYPTOXANTHIN_BETA, 1e-6),
		new NutrientAmount(Nutrient.LUTEIN, 54e-3),
		new NutrientAmount(Nutrient.PHYLLOQUINONE, 1.2e-6),
	],
}, 'https://fdc.nal.usda.gov/fdc-app.html#/food-details/2343235/nutrients');
Food.ChocolateDark = new Food('Dark Chocolate (70-85%)', { // todo create nutrient groups for all this other shit
	measures: {
		bar: 101,
	},
	nutrients: [
		new NutrientAmount(Nutrient.WATER, 1.37),
		new NutrientAmount(Nutrient.PROTEIN, 7.79),
		new NutrientAmount(Nutrient.FAT, 42.6),
		new NutrientAmount(Nutrient.ASH, 2.32),
		new NutrientAmount(Nutrient.FIBER, 10.9),
		new NutrientAmount(Nutrient.SUCROSE, 24),
		new NutrientAmount(Nutrient.CALCIUM, 73e-3),
		new NutrientAmount(Nutrient.IRON, 11.9e-3),
		new NutrientAmount(Nutrient.MAGNESIUM, 228e-3),
		new NutrientAmount(Nutrient.PHOSPHORUS, 308e-3),
		new NutrientAmount(Nutrient.POTASSIUM, 715e-3),
		new NutrientAmount(Nutrient.SODIUM, 20e-3),
		new NutrientAmount(Nutrient.ZINC, 3.31e-3),
		new NutrientAmount(Nutrient.COPPER, 1.77e-3),
		new NutrientAmount(Nutrient.MANGANESE, 1.95e-3),
		new NutrientAmount(Nutrient.SELENIUM, 6.8e-6),
		new NutrientAmount(Nutrient.THIAMIN, 0.034e-3),
		new NutrientAmount(Nutrient.RIBOFLAVIN, 0.078e-3),
		new NutrientAmount(Nutrient.NIACIN, 1.05e-3),
		new NutrientAmount(Nutrient.PANTOTHENIC_ACID, 0.418e-3),
		new NutrientAmount(Nutrient.VITAMIN_B6, 0.038e-3),
		new NutrientAmount(Nutrient.VITAMIN_B12, 0.28e-6),
		new NutrientAmount(Nutrient.CAROTENE_BETA, 19e-6),
		new NutrientAmount(Nutrient.CAROTENE_ALPHA, 7e-6),
		new NutrientAmount(Nutrient.CRYPTOXANTHIN_BETA, 1e-6),
		new NutrientAmount(Nutrient.LUTEIN, 27e-3),
		new NutrientAmount(Nutrient.VITAMIN_E, 0.59e-3),
		new NutrientAmount(Nutrient.TOCOPHEROL_BETA, 0.01e-3),
		new NutrientAmount(Nutrient.TOCOPHEROL_GAMMA, 9.19e-3),
		new NutrientAmount(Nutrient.TOCOPHEROL_DELTA, 0.29e-3),
		new NutrientAmount(Nutrient.TOCOTRIENOL_GAMMA, 0.14e-3),
		new NutrientAmount(Nutrient.PHYLLOQUINONE, 7.3e-6),
		new NutrientAmount(Nutrient.CHOLESTEROL, 3e-3),
		new NutrientAmount(Nutrient.STIGMASTEROL, 31e-3),
		new NutrientAmount(Nutrient.CAMPESTEROL, 12e-3),
		new NutrientAmount(Nutrient.SITOSTEROL_BETA, 86e-3),
		new NutrientAmount(Nutrient.CAFFEINE, 80e-3),
		new NutrientAmount(Nutrient.THEOBROMINE, 802e-3),
	],
}, 'https://fdc.nal.usda.gov/fdc-app.html#/food-details/170273/nutrients');

const NUTRITION_LOADED = true;