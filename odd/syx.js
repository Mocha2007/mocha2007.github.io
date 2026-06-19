class Species {
	static AMEVIA = 1;
	static CRETONIAN = 2;
	static DONDORIAN = 3;
	static GARTHIMI = 4;
	static HUMAN = 5;
	static TILAPI = 6;
	/**
	 * @param {Species} species 
	 * @param {Profession} profession 
	 */
	static profession_bonus(species, profession){
		switch (species) {
			case Species.CRETONIAN: {
				switch (profession) {
					case Profession.SMELTER:
						return 1.1;
					case Profession.SMITH:
						return 0.8;
					default:
						return 1;
				}
			}
			case Species.DONDORIAN: {
				switch (profession) {
					case Profession.MINER:
						return 1.15;
					case Profession.SMITH:
						return 1.2;
					default:
						return 1;
				}
			}
			case Species.GARTHIMI: {
				switch (profession) {
					case Profession.MINER:
						return 1.25;
					case Profession.SMELTER:
						return 0.9;
					case Profession.SMITH:
						return 0.75;
					default:
						return 1;
				}
			}
			case Species.TILAPI: {
				switch (profession) {
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

class Profession {
	static MINER = "miner";
	static SMELTER = "smelter";
	static SMITH = "smith";
}

class Item {
	static COAL = "coal";
	static FALCATA = "falcata";
	static METAL = "metal";
	static ORE = "ore";
	/** @returns {Recipe} */
	static recipe(item){
		return DATA.recipes.find(r => r.output === item);
	}
}

class Recipe {
	constructor(profession, output, out_amt = 0, inputs = [], input_amts = []){
		this.profession = profession;
		this.output = output;
		this.out_amt = out_amt;
		/** @type {Item[]} */
		this.inputs = inputs;
		this.input_amts = input_amts;
	}
	get input_recipes(){
		return this.inputs.map(i => Item.recipe(i));
	}
	get inputs_per_item(){
		return this.input_amts.map(x => x / this.out_amt);
	}
	items_per_worker(species){
		return Species.profession_bonus(species, this.profession) * this.out_amt;
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
			const recipe = Item.recipe(item);
			const wpi = recipe.workers_per_item_recurse(species);
			return wpi * amt;
		});
		return for_this + input_workers.reduce((a, b) => a + b, 0);
	}
}

const DATA = {
	recipes: [
		new Recipe(Profession.SMITH, Item.FALCATA, 0.5, [Item.COAL, Item.METAL], [2, 0.4]),
		new Recipe(Profession.MINER, Item.COAL, 4),
		new Recipe(Profession.MINER, Item.ORE, 1.5),
		new Recipe(Profession.SMELTER, Item.METAL, 0.5, [Item.COAL, Item.ORE], [1.25, 1.25]),
	],
};

// compute falcata
{
	/** @type {HTMLTableRowElement} */
	const row_falcata = document.getElementById('falcata');
	const recipe = Item.recipe(Item.FALCATA);
	Species.species.forEach(species => {
		const cell = row_falcata.children[species];
		const ipw = recipe.items_per_worker_recursive(species);
		cell.innerHTML = `${ipw.toFixed(3)}`;
	});
}