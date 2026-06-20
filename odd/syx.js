class Species {
	static AMEVIA = 1;
	static CRETONIAN = 2;
	static DONDORIAN = 3;
	static GARTHIMI = 4;
	static HUMAN = 5;
	static TILAPI = 6;
	static climate(species){
		switch (species){
			case Species.AMEVIA:
			case Species.CRETONIAN:
			case Species.GARTHIMI:
				return Climate.WARM;
			case Species.DONDORIAN:
				return Climate.COLD;
			default:
				return Climate.TEMPERATE;
		}
	}
	/**
	 * @param {Species} species 
	 * @param {Profession} profession 
	 */
	static profession_bonus(species, profession){
		switch (species) {
			case Species.AMEVIA: {
				switch (profession) {
					case Profession.FISHER:
						return 1.25;
					case Profession.FARMER_PASTURE_GLOBDIEN:
						return 1.2;
					case Profession.FARMER:
					case Profession.FARMER_MUSHROOM:
					case Profession.FARMER_PASTURE:
					case Profession.FARMER_PASTURE_BALTICRAWLER:
					case Profession.ORCHARDIST:
						return 0.8;
					default:
						return 1;
				}
			}
			case Species.CRETONIAN: {
				switch (profession) {
					case Profession.FARMER:
					case Profession.FARMER_MUSHROOM:
					case Profession.ORCHARDIST:
						return 1.25;
					case Profession.RATIONMAKER:
						return 1.2;
					case Profession.BAKER:
					case Profession.BREWER:
					case Profession.CHARCOALLER:
					case Profession.SMELTER:
					case Profession.WEAVER:
						return 1.1;
					case Profession.BOWYER:
					case Profession.CARPENTER:
					case Profession.JEWELLER:
					case Profession.MASON:
					case Profession.MECHANIC:
					case Profession.PAPERMAKER:
					case Profession.POTTER:
					case Profession.SMITH:
					case Profession.TAILOR:
						return 0.8;
					default:
						return 1;
				}
			}
			case Species.DONDORIAN: {
				switch (profession) {
					case Profession.FARMER:
						return 0.75; // excl. mushroom
					case Profession.FARMER_PASTURE:
					case Profession.FARMER_PASTURE_BALTICRAWLER:
					case Profession.FARMER_PASTURE_GLOBDIEN:
						return 0.85;
					case Profession.MINER:
						return 1.15;
					case Profession.JEWELLER:
					case Profession.SMITH:
						return 1.25;
					case Profession.CARPENTER:
					case Profession.MASON:
					case Profession.MECHANIC:
					case Profession.PAPERMAKER:
					case Profession.POTTER:
					case Profession.RATIONMAKER:
					case Profession.TAILOR:
						return 1.2;
					case Profession.BOWYER:
						return 0.8;
					case Profession.ORCHARDIST:
						return 0.65;
					default:
						return 1;
				}
			}
			case Species.GARTHIMI: {
				switch (profession) {
					case Profession.FARMER_PASTURE_BALTICRAWLER:
						return 3;
					case Profession.MASON:
						return 1.3;
					case Profession.FARMER:
					case Profession.FARMER_MUSHROOM:
					case Profession.FARMER_PASTURE:
					case Profession.FARMER_PASTURE_GLOBDIEN:
					case Profession.ORCHARDIST:
						return 0.75;
					case Profession.MINER:
						return 1.25;
					case Profession.BAKER:
					case Profession.BREWER:
					case Profession.CHARCOALLER:
					case Profession.RATIONMAKER:
					case Profession.SMELTER:
					case Profession.WEAVER:
						return 0.9;
					case Profession.RESEARCHER:
						return 0.8;
					case Profession.BOWYER:
					case Profession.CARPENTER:
					case Profession.JEWELLER:
					case Profession.MECHANIC:
					case Profession.PAPERMAKER:
					case Profession.POTTER:
					case Profession.SMITH:
					case Profession.TAILOR:
						return 0.75;
					case Profession.SCRIBE:
						return 0.6;
					default:
						return 1;
				}
			}
			case Species.HUMAN: {
				switch (profession) {
					case Profession.RESEARCHER:
					case Profession.SCRIBE:
						return 1.25;
					case Profession.FARMER:
					case Profession.FARMER_MUSHROOM:
					case Profession.ORCHARDIST:
						return 1.1;
					default:
						return 1;
				}
			}
			case Species.TILAPI: {
				switch (profession) {
					case Profession.ORCHARDIST:
					case Profession.WOODCUTTER:
						return 1.4;
					case Profession.BOWYER:
						return 1.2;
					case Profession.FARMER_PASTURE:
					case Profession.FARMER_PASTURE_BALTICRAWLER:
						return 1.2; // excl. Globdien
					case Profession.MINER:
						return 0.25;
					default:
						return 1;
				}
			}
			default:
				return 1;
		}
	}
}
/** @type {Species[]} */
Species.species = [
	Species.AMEVIA,
	Species.CRETONIAN,
	Species.DONDORIAN,
	Species.GARTHIMI,
	Species.HUMAN,
	Species.TILAPI,
]

class Climate {
	static COLD = 0;
	static TEMPERATE = 1;
	static WARM = 2;
}

class Profession {
	static BAKER = "baker";
	static BREWER = "brewer";
	static BOWYER = "bowyer";
	static CARPENTER = "carpenter";
	static CHARCOALLER = "charcoaller";
	static CHEF = "chef";
	static FARMER = "farmer";
	static FARMER_MUSHROOM = "mushroom farmer";
	static FARMER_PASTURE = "pasture farmer";
	static FARMER_PASTURE_BALTICRAWLER = "balticrawler farmer";
	static FARMER_PASTURE_GLOBDIEN = "globdien farmer";
	static FISHER = "fisher";
	static JEWELLER = "jeweller";
	static MASON = "mason";
	static MECHANIC = "mechanic";
	static MINER = "miner";
	static ORCHARDIST = "orchardist";
	static PAPERMAKER = "papermaker";
	static POTTER = "potter";
	static RATIONMAKER = "rationmaker";
	static RESEARCHER = "researcher";
	static SCRIBE = "scribe";
	static SMELTER = "smelter";
	static SMITH = "smith";
	static TAILOR = "tailor";
	static WEAVER = "weaver";
	static WOODCUTTER = "woodcutter";
}

class Item {
	static ALCOHOL = "alcohol";
	static BREAD = "bread";
	static BOW = "bow";
	static CLAY = "clay";
	static CLOTHING = "clothing";
	static COAL = "coal";
	static COTTON = "cotton";
	static CUT_STONE = "cut stone";
	static EGG = "egg";
	static FABRIC = "fabric";
	static FALCATA = "falcata";
	static FISH = "fish";
	static FRUIT = "fruit";
	static FURNITURE = "furniture";
	static GEM = "gem";
	static GRAIN = "grain";
	static HERB = "herb";
	static INNOVATION = "innovation";
	static JEWELLERY = "jewellery";
	static KNOWLEDGE = "knowledge";
	static LEATHER = "leather";
	static MACHINERY = "machinery";
	static MEAT = "meat";
	static METAL = "metal";
	static MUSHROOM = "mushroom";
	static OPIUM = "opium";
	static ORE = "ore";
	static PAPER = "paper";
	static POTTERY = "pottery";
	static RATION = "ration";
	static RESTAURANT = "restaurant";
	static STONE = "stone";
	static TOOL = "tool";
	static WARBEAST = "warbeast";
	static WOOD = "wood";
	static cheapest_recipe(item, species){
		const possible_recipes = this.recipes(item);
		const possible_recipe_costs = possible_recipes.map(recipe => recipe.workers_per_item_recurse(species));
		const cheapest_cost = Math.min(...possible_recipe_costs);
		return possible_recipes[possible_recipe_costs.indexOf(cheapest_cost)];
	}
	/** @param {Item} item */
	static recipes(item){
		return DATA.recipes.filter(r => r.output === item);
	}
}

class Recipe {
	constructor(profession, output, out_amt = 0, inputs = [], input_amts = [], climate_bonuses = [1, 1, 1]){
		this.profession = profession;
		this.output = output;
		this.out_amt = out_amt;
		/** @type {Item[]} */
		this.inputs = inputs;
		this.input_amts = input_amts;
		/** @type {[number, number, number]} */
		this.climate_bonuses = climate_bonuses;
	}
	get inputs_per_item(){
		return this.input_amts.map(x => x / this.out_amt);
	}
	items_per_worker(species){
		return Species.profession_bonus(species, this.profession)
			* this.climate_bonuses[Species.climate(species)]
			* this.out_amt;
	}
	items_per_worker_recursive(species){
		return 1 / this.workers_per_item_recurse(species);
	}
	workers_per_item(species){
		return 1 / this.items_per_worker(species);
	}
	/** @returns {number} */
	workers_per_item_recurse(species){
		const for_this = this.workers_per_item(species);
		const res_amt = this.inputs_per_item;
		const input_workers = this.inputs.map((item, i) => {
			const amt = res_amt[i];
			const recipe = Item.cheapest_recipe(item, species);
			const wpi = recipe.workers_per_item_recurse(species);
			return wpi * amt;
		});
		return for_this + input_workers.reduce((a, b) => a + b, 0);
	}
}

const DATA = {
	recipes: [
		new Recipe(Profession.BAKER, Item.BREAD, 6, [Item.GRAIN, Item.WOOD], [6, 1]),
		new Recipe(Profession.BAKER, Item.BREAD, 7, [Item.GRAIN, Item.COAL], [7, 0.5]),
		new Recipe(Profession.BREWER, Item.ALCOHOL, 2.25, [Item.FRUIT, Item.COAL, Item.POTTERY], [2, 0.5, 0.25]),
		new Recipe(Profession.BREWER, Item.ALCOHOL, 2.5, [Item.GRAIN, Item.COAL, Item.POTTERY], [2, 0.5, 0.25]),
		new Recipe(Profession.BOWYER, Item.BOW, 0.4, [Item.WOOD, Item.LEATHER], [4, 1]),
		new Recipe(Profession.CARPENTER, Item.FURNITURE, 0.5, [Item.WOOD], [2]),
		new Recipe(Profession.CHARCOALLER, Item.COAL, 6, [Item.WOOD], [2]),
		new Recipe(Profession.FARMER, Item.COTTON, 3, [], [], [0.5, 1, 1.5]),
		new Recipe(Profession.FARMER, Item.FRUIT, 2.1),
		new Recipe(Profession.FARMER, Item.GRAIN, 4),
		new Recipe(Profession.FARMER, Item.HERB, 0.25, [], [], [2, 1, 0.5]),
		new Recipe(Profession.FARMER, Item.OPIUM, 0.25, [], [], [0.5, 1, 2]),
		new Recipe(Profession.FARMER_MUSHROOM, Item.MUSHROOM, 1, [], [], [2, 1, 0.5]),
		new Recipe(Profession.FARMER_PASTURE, Item.COTTON, 1.8, [], [], [1.25, 1, 0.75]),
		new Recipe(Profession.FARMER_PASTURE, Item.LEATHER, 0.56, [], [], [0.75, 1.25, 0.75]),
		// entelodont
		new Recipe(Profession.FARMER_PASTURE, Item.MEAT, 1.12, [], [], [0.75, 1.1, 0.75]),
		// warbeast
		new Recipe(Profession.FARMER_PASTURE, Item.WARBEAST, 0.1, [], [], [1.1, 0.9, 0.9]),
		// globdien
		new Recipe(Profession.FARMER_PASTURE_BALTICRAWLER, Item.MEAT, 0.7),
		new Recipe(Profession.FARMER_PASTURE_GLOBDIEN, Item.EGG, 1.05, [], [], [0.5, 1, 2]),
		new Recipe(Profession.FISHER, Item.FISH, 1.4, [], [], [1.1, 1, 1]),
		new Recipe(Profession.JEWELLER, Item.JEWELLERY, 0.1, [Item.METAL, Item.GEM], [0.04, 0.1]),
		new Recipe(Profession.MASON, Item.CUT_STONE, 0.5, [Item.STONE], [2]),
		new Recipe(Profession.MECHANIC, Item.MACHINERY, 0.25, [Item.FURNITURE, Item.METAL], [1, 0.4]),
		new Recipe(Profession.MINER, Item.CLAY, 1.5),
		new Recipe(Profession.MINER, Item.COAL, 4),
		new Recipe(Profession.MINER, Item.GEM, 0.2),
		new Recipe(Profession.MINER, Item.ORE, 1.5),
		new Recipe(Profession.MINER, Item.STONE, 4.5),
		new Recipe(Profession.ORCHARDIST, Item.FRUIT, 2.45),
		new Recipe(Profession.PAPERMAKER, Item.PAPER, 0.75, [Item.WOOD], [2]),
		new Recipe(Profession.POTTER, Item.POTTERY, 1, [Item.CLAY], [1]),
		new Recipe(Profession.RATIONMAKER, Item.RATION, 2, [Item.BREAD], [6]),
		new Recipe(Profession.RATIONMAKER, Item.RATION, 2.5, [Item.BREAD, Item.HERB], [3, 0.025]),
		new Recipe(Profession.RATIONMAKER, Item.RATION, 3, [Item.MEAT, Item.HERB], [3, 0.125]),
		new Recipe(Profession.RATIONMAKER, Item.RATION, 3, [Item.FISH, Item.HERB], [3, 0.125]),
		new Recipe(Profession.RATIONMAKER, Item.RATION, 3, [Item.FRUIT, Item.ALCOHOL], [3, 1]),
		new Recipe(Profession.RESEARCHER, Item.INNOVATION, 1),
		new Recipe(Profession.RESEARCHER, Item.INNOVATION, 2, [Item.CLAY], [0.75]),
		new Recipe(Profession.SCRIBE, Item.KNOWLEDGE, 1),
		new Recipe(Profession.SCRIBE, Item.KNOWLEDGE, 2, [Item.LEATHER], [0.5]),
		new Recipe(Profession.SMELTER, Item.METAL, 0.5, [Item.COAL, Item.ORE], [1.25, 1.25]),
		new Recipe(Profession.SMITH, Item.FALCATA, 0.5, [Item.COAL, Item.METAL], [2, 0.4]),
		new Recipe(Profession.SMITH, Item.TOOL, 2, [Item.COAL, Item.METAL], [2, 0.4]),
		new Recipe(Profession.TAILOR, Item.CLOTHING, 3, [Item.FABRIC], [4]),
		new Recipe(Profession.TAILOR, Item.CLOTHING, 3, [Item.LEATHER], [4]),
		new Recipe(Profession.WEAVER, Item.FABRIC, 2, [Item.COTTON], [2]),
		new Recipe(Profession.WOODCUTTER, Item.WOOD, 4),
	],
	/** @param {string} s */
	title(s){
		return s ? s[0].toUpperCase() + s.slice(1).toLowerCase() : '';
	}
};

// compute chef data
[Item.BREAD, Item.EGG, Item.FISH, Item.FRUIT, Item.MEAT, Item.MUSHROOM, Item.RATION].forEach(food => {
	// chef logic (I think): 1 Herb + any food -> 1 meal???
	// usable foods:
	// fish bread fruit vegetables mushrooms meat eggs rations
	DATA.recipes.push(new Recipe(Profession.CHEF, Item.RESTAURANT, 1, [Item.HERB, food], [1, 1]));
});

// compute table
['alcohol', 'bow', 'clothing', 'cut stone', 'fabric', 'falcata', 'furniture',
	'gem', 'innovation', 'jewellery', 'knowledge', 'machinery', 'opium',
	'paper', 'ration', 'restaurant', 'tool', 'warbeast']
.forEach(item_name => {
	/** @type {HTMLTableRowElement} */
	const row = document.getElementById(item_name);
	const th = document.createElement('th');
	th.innerHTML = DATA.title(item_name);
	row.appendChild(th);
	const rank = new Array(7).fill(-1).map((x, i) => [i, x]);
	Species.species.forEach(species => {
		const recipe = Item.cheapest_recipe(item_name, species);
		const cell = document.createElement('td');
		row.appendChild(cell);
		const ipw = rank[species][1] = recipe.items_per_worker_recursive(species);
		cell.innerHTML = `${ipw.toFixed(3)}`;
	});
	rank.sort((a, b) => a[1] - b[1]);
	// first elem mathematically must be species "0", ie. null, so skip
	row.children[rank[1][0]].classList.add('bad');
	row.children[rank[2][0]].classList.add('bad');
	row.children[rank[3][0]].classList.add('mid');
	row.children[rank[4][0]].classList.add('mid');
	row.children[rank[5][0]].classList.add('good');
	row.children[rank[6][0]].classList.add('good');
});