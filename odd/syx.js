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
					case Profession.BAKER:
					case Profession.BREWER:
					case Profession.CHARCOALLER:
					case Profession.SMELTER:
					case Profession.WEAVER:
						return 1.1;
					case Profession.BOWYER:
					case Profession.CARPENTER:
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
					case Profession.SMITH:
						return 1.25;
					case Profession.CARPENTER:
					case Profession.POTTER:
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
					case Profession.SMELTER:
					case Profession.WEAVER:
						return 0.9;
					case Profession.BOWYER:
					case Profession.CARPENTER:
					case Profession.POTTER:
					case Profession.SMITH:
					case Profession.TAILOR:
						return 0.75;
					default:
						return 1;
				}
			}
			case Species.HUMAN: {
				switch (profession) {
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
	static ORCHARDIST = "orchardist";
	static POTTER = "potter";
	static MINER = "miner";
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
	static EGG = "egg";
	static FABRIC = "fabric";
	static FALCATA = "falcata";
	static FISH = "fish";
	static FRUIT = "fruit";
	static FURNITURE = "furniture";
	static GRAIN = "grain";
	static HERB = "herb";
	static LEATHER = "leather";
	static MEAT = "meat";
	static METAL = "metal";
	static MUSHROOM = "mushroom";
	static ORE = "ore";
	static POTTERY = "pottery";
	static RESTAURANT = "restaurant";
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
		new Recipe(Profession.FARMER, Item.MUSHROOM, 1, [], [], [2, 1, 0.5]),
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
		new Recipe(Profession.MINER, Item.CLAY, 1.5),
		new Recipe(Profession.MINER, Item.COAL, 4),
		new Recipe(Profession.MINER, Item.ORE, 1.5),
		new Recipe(Profession.ORCHARDIST, Item.FRUIT, 2.45),
		new Recipe(Profession.POTTER, Item.POTTERY, 1, [Item.CLAY], [1]),
		new Recipe(Profession.SMELTER, Item.METAL, 0.5, [Item.COAL, Item.ORE], [1.25, 1.25]),
		new Recipe(Profession.SMITH, Item.FALCATA, 0.5, [Item.COAL, Item.METAL], [2, 0.4]),
		new Recipe(Profession.TAILOR, Item.CLOTHING, 3, [Item.FABRIC], [4]),
		new Recipe(Profession.TAILOR, Item.CLOTHING, 3, [Item.LEATHER], [4]),
		new Recipe(Profession.WEAVER, Item.FABRIC, 2, [Item.COTTON], [2]),
		new Recipe(Profession.WOODCUTTER, Item.WOOD, 4),
	],
};

// compute chef data
[Item.BREAD, Item.EGG, Item.FISH, Item.FRUIT, Item.MEAT, Item.MUSHROOM].forEach(food => {
	// chef logic (I think): 1 Herb + any food -> 1 meal???
	// usable foods:
	// fish bread fruit vegetables mushrooms meat eggs rations
	DATA.recipes.push(new Recipe(Profession.CHEF, Item.RESTAURANT, 1, [Item.HERB, food], [1, 1]));
});

// compute table
['alcohol', 'bow', 'clothing', 'falcata', 'furniture', 'restaurant', 'warbeast']
.forEach(item_name => {
	/** @type {HTMLTableRowElement} */
	const row_falcata = document.getElementById(item_name);
	Species.species.forEach(species => {
		const recipe = Item.cheapest_recipe(item_name, species);
		const cell = row_falcata.children[species];
		const ipw = recipe.items_per_worker_recursive(species);
		cell.innerHTML = `${ipw.toFixed(3)}`;
	});
});