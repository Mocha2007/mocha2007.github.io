class Hint {
	constructor(hint, category, difficulty = Difficulty.NORMAL){
		/** @type {string} */
		this.hint = hint;
		/** @type {Category} */
		this.category = category;
		/** @type {Difficulty} */
		this.difficulty = difficulty;
	}
	elem(){
		const e = document.createElement('span');
		e.classList.add('hint');
		e.innerHTML = this.hint;
		const cat = document.createElement('span');
		cat.innerHTML = this.category;
		cat.classList.add('category');
		e.appendChild(cat);
		const dif = document.createElement('span');
		dif.innerHTML = Difficulty.string(this.difficulty);
		dif.title = Difficulty.title(this.difficulty);
		dif.classList.add('difficulty');
		e.appendChild(dif);
		return e;
	}
}

class Word {
	constructor(word, hints){
		/** @type {string} */
		this.word = word;
		if (word.length !== 6) console.warn(`${word} is not 6 letters`);
		/** @type {Hint[]} */
		this.hints = hints.length ? hints : [hints];
	}
	get id(){
		return HONEYCOMB.words.indexOf(this);
	}
}

class Category {
	static AGRICULTURE = "Agriculture";
	static ANATOMY = "Anatomy";
	static ANIME = "Anime";
	static ASTROLOGY = "Astrology";
	static ASTRONOMY = "Astronomy";
	static BIOLOGY = "Biology";
	static BOARDGAME = "Board Game";
	static BOTANY = "Botany";
	static CHEMISTRY = "Chemistry";
	static COLOR = "Color";
	/* specifically meta-English, NOT grammar, NOT literature */
	static ENGLISH = "English";
	static FANTASY = "Fantasy";
	static FOOD = "Food";
	static GEOGRAPHY = "Geography";
	static GEOLOGY = "Geology";
	static GRAMMAR = "Grammar";
	static HISTORY = "History";
	static HOLIDAY_WINTER = "Winter Holidays";
	static LANGUAGE = "Language";
	static LAW = "Law";
	static LGBT = "LGBT";
	static MATH = "Mathematics";
	static MEASUREMENT = "Measurement";
	static MEDICINE = "Medicine";
	static METEOROLOGY = "Meteorology";
	static MINEROLOGY = "Minerology";
	static MISC = "Miscellaneous";
	static MUSIC = "Music";
	static FILM = "Film";
	static PHYSICS = "Physics";
	static PROGRAMMING = "Programming";
	static RELIGION = "Religion";
	static TECH = "Technology";
	static TEXTILE = "Textile";
	static TRANSPORT = "Transport";
	static VEXILLOLOGY = "Vexilollogy";
	static VIDEOGAME = "Video games";
	static ZOOLOGY = "Zoology";
}
/** @type {Category[]} */
Category.categories = Object.keys(Category).map(k => Category[k]);

class Difficulty {
	static EASY = 0;
	/* easter egg */
	static SIMPLE = 0.5;
	static NORMAL = 1;
	static HARD = 2;
	static TRICKY = 3;
	static string(difficulty){
		switch (difficulty){
			case this.EASY:
				return 'Easy';
			case this.NORMAL:
				return 'Normal';
			case this.HARD:
				return 'Hard';
			case this.TRICKY:
				return 'Tricky';
		}
	}
	static title(difficulty){
		switch (difficulty){
			case this.TRICKY:
				return 'Think carefully; the answer is not straightforward.';
			default:
				return this.string(difficulty);
		}
	}
}

class Direction {
	static UP = 0;
	static UR = 1;
	static DR = 2;
	static DN = 3;
	static DL = 4;
	static UL = 5;
	static from(n = 0){
		switch (n){
			case 0:
				return this.UP;
			case 1:
				return this.UR;
			case 2:
				return this.DR;
			case 3:
				return this.DN;
			case 4:
				return this.DL;
			case 5:
				return this.UL;
			default:
				throw `invalid direction: ${n}`;
		}
	}
}

class Clue {
	constructor(word, start_index = 0, hint_index = -1){
		/** @type {Word} */
		this.word = word;
		/** @type {Hint} */
		// choose a random hint, if unspecified...
		this.hint = hint_index < 0
			? HONEYCOMB.config.forcecat ? this.word.hints.find(h => h.category === HONEYCOMB.config.forcecat) : this.word.hints[Math.floor(Math.random() * this.word.hints.length)]
			: this.word.hints[hint_index];
		/** @type {number} I don't remember what this represents */
		this.start_index = start_index;
	}
	createElement(id){
		const e = document.createElement('div');
		e.classList.add('hex');
		e.id = `hex${id}`;
		// display hint, if not center cell
		if (id) e.appendChild(this.hint.elem());
		// create start indicator
		const start = document.createElement('div');
		start.classList.add('start');
		start.classList.add(`direction${this.start_index}`);
		start.innerHTML = '⇘⇓⇙⇖⇑⇗'[this.start_index];
		e.appendChild(start);
		return e;
	}
	/**
	 * @param {number} i nth hex
	 * @param {number} j nth letter within this hex
	 */
	createTextCell(i, j){
		const cellId = 5*(i-1)+j;
		const direction = (4 + i + j) % 6;
		// console.debug('\t->', direction);
		/** @type {HTMLDivElement} */
		const elem = document.getElementById(`hex${i}`);
		const cell = document.createElement('div');
		// cell.innerHTML = cellId;
		cell.id = `letter${cellId}`;
		cell.classList.add('letter');
		cell.classList.add(`direction${direction}`);
		cell.onclick = () => HONEYCOMB.letterNodes.select(cellId);
		cell.setAttribute('answer', this.getLetter(direction));
		const otherNeighbor = [
			// 0-9 (Hexes 1 and 2)
			-1, -1, -1, 2, 0, -1, -1, -1, 3, 0,
			// 10-19 (Hexes 3 and 4)
			-1, -1, -1, 4, 0, -1, -1, -1, 5, 0,
			// 20-29 (Hexes 5 and 6)
			-1, -1, -1, 6, 0, -1, -1, -1, 1, 0,
		]
		cell.setAttribute('hexes', JSON.stringify([i, otherNeighbor[cellId]]));
		elem.appendChild(cell);
	}
	/** @param {Direction} direction */
	getLetter(direction){
		switch (direction) {
			case Direction.UP:
				return this.word.word[(6 - this.start_index) % 6];
			case Direction.UR:
				return this.word.word[(7 - this.start_index) % 6];
			case Direction.DR:
				return this.word.word[(8 - this.start_index) % 6];
			case Direction.DN:
				return this.word.word[(9 - this.start_index) % 6];
			case Direction.DL:
				return this.word.word[(10 - this.start_index) % 6];
			case Direction.UL:
				return this.word.word[(11 - this.start_index) % 6];
			default:
				throw `invalid direction: ${direction}`;
		}
	}
}

const HONEYCOMB = {
	words: [
		/*
			Things added:
			- all 6-letter constellations and planets
			- all 6-letter countries (excl. Kuwait Monaco)
			- all 6-letter elements (excl. Cerium and Erbium)
			- all 6-letter minecraft mobs (excl. new ones)
			- partial: all 6-letter https://en.wikipedia.org/wiki/Planetary_nomenclature
			- partial: https://en.wikipedia.org/wiki/List_of_animal_names
		*/
		new Word("acacia", [
			new Hint("southern hemisphere flowering tree, also called wattle", Category.BOTANY, Difficulty.HARD),
			new Hint("reddish Minecraft wood", Category.VIDEOGAME),
		]),
		new Word("acidic", new Hint("not basic", Category.CHEMISTRY)),
		new Word("adverb", new Hint("modifies adjectives and verbs", Category.GRAMMAR)),
		new Word("aether", [
			new Hint("common 19th century anaesthetic", Category.MEDICINE, Difficulty.HARD),
			new Hint("the luminiferous variety was said to carry light", Category.PHYSICS),
			new Hint("in a certain Minecraft mod, the opposite of the nether", Category.VIDEOGAME),
		]),
		new Word("alaska", new Hint("largest American state", Category.GEOGRAPHY)),
		new Word("albedo", [
			new Hint("an object's brightness", Category.ASTRONOMY),
			new Hint("overseer of the guardians of Nazarick", Category.ANIME),
		]),
		new Word("albion", [
			new Hint("archaic term for the British isles", Category.GEOGRAPHY),
			new Hint("second discovered trans-neptunian object", Category.ASTRONOMY),
		]),
		new Word("alkaid", new Hint("easternmost star of the big dipper", Category.ASTRONOMY)),
		new Word("alkali", new Hint("basic", Category.CHEMISTRY)),
		new Word("alkane", new Hint("eg. methane, propane", Category.CHEMISTRY)),
		new Word("almond", new Hint("nut related to the peach", Category.FOOD)),
		new Word("altair", new Hint("brightest star in Aquila", Category.ASTRONOMY)),
		new Word("amazon", [
			new Hint("mythical warrior woman", Category.RELIGION),
			new Hint("largest tropical rainforest", Category.GEOGRAPHY),
			new Hint("technology company that began as a bookseller", Category.TECH),
		]),
		new Word("ampere", new Hint("SI unit of current", Category.MEASUREMENT)),
		new Word("angola", new Hint("its capital, Luanda", Category.GEOGRAPHY)),
		new Word("ankara", new Hint("capital of Turkey", Category.GEOGRAPHY)),
		new Word("antlia", new Hint("air pump constellation", Category.ASTRONOMY)),
		new Word("apogee", new Hint("furthest part of an orbit from Earth", Category.ASTROLOGY)),
		new Word("apollo", new Hint("Greek god of healing and prophecy", Category.RELIGION)),
		new Word("aquila", new Hint("eagle constellation", Category.ASTRONOMY)),
		new Word("aroace", new Hint("slang: aromantic and asexual", Category.LGBT)),
		new Word("astana", new Hint("capital of Kazakhstan", Category.GEOGRAPHY)),
		new Word("athena", new Hint("Greek goddess of wisdom", Category.RELIGION)),
		new Word("attack", new Hint("antonym of defend", Category.ENGLISH)),
		new Word("auburn", new Hint("dark reddish brown", Category.COLOR)),
		new Word("august", new Hint("eighth month", Category.MEASUREMENT, Difficulty.EASY)),
		new Word("auriga", new Hint("charioteer constellation", Category.ASTRONOMY)),
		new Word("autumn", new Hint("season after summer", Category.MEASUREMENT, Difficulty.EASY)),
		new Word("aurora", new Hint("norther or southern lights", Category.ASTRONOMY, Difficulty.EASY)),
		new Word("azalea", new Hint("rhododendron", Category.BOTANY, Difficulty.HARD)),
		new Word("baikal", new Hint("largest Asian freshwater lake", Category.GEOGRAPHY)),
		new Word("bamboo", new Hint("fast-growing grass used like wood", Category.BOTANY)),
		new Word("banana", new Hint("long yellow fruit", Category.FOOD)),
		new Word("barium", new Hint("in pure form, this element is a common radiocontrast agent", Category.CHEMISTRY)),
		new Word("barley", new Hint("major cereal grain", Category.BOTANY)),
		new Word("barred", new Hint("spiral galaxies may be this, like the Milky Way", Category.ASTRONOMY)),
		new Word("basalt", new Hint("dark extrusive igneous rock", Category.GEOLOGY)),
		new Word("bazaar", new Hint("middle-eastern marketplace", Category.MISC)),
		new Word("beaker", new Hint("flat-bottomed, straight-sided glass vessel", Category.CHEMISTRY)),
		new Word("beaver", new Hint("dam-building rodent", Category.ZOOLOGY)),
		new Word("belize", new Hint("its capital, Belmopan", Category.GEOGRAPHY)),
		new Word("beluga", new Hint("arctic whale", Category.ZOOLOGY)),
		new Word("berlin", new Hint("German capital", Category.GEOGRAPHY)),
		new Word("bhutan", new Hint("its capital, Thimphu", Category.GEOGRAPHY)),
		new Word("binary", [
			new Hint("system with two stars", Category.ASTRONOMY),
			new Hint("numeric data on computers is stored in this", Category.PROGRAMMING, Difficulty.TRICKY),
		]),
		new Word("biotic", new Hint("of biological origin", Category.BIOLOGY)),
		new Word("bishop", new Hint("diagonal slider in chess", Category.BOARDGAME)),
		new Word("bisque", [
			new Hint("pale pinkish brown", Category.COLOR),
			new Hint("thick creamy soup", Category.FOOD),
		]),
		new Word("blonde", new Hint("fair hair", Category.COLOR)),
		new Word("bobcat", new Hint("short-tailed wildcat", Category.ZOOLOGY)),
		new Word("bootes", new Hint("herdsman constellation", Category.ASTRONOMY)),
		new Word("botany", new Hint("study of plants", Category.BIOLOGY)),
		new Word("bovine", new Hint("of cattle", Category.ZOOLOGY)),
		new Word("branch", [
			new Hint("plant limb", Category.BOTANY),
			new Hint("repository offshoot", Category.PROGRAMMING),
		]),
		new Word("brazil", new Hint("its capital, Brasília", Category.GEOGRAPHY)),
		new Word("bremen", new Hint("smallest German state", Category.GEOGRAPHY)),
		new Word("bronze", new Hint("copper-tin alloy", Category.CHEMISTRY)),
		new Word("brunei", new Hint("its capital, Bandar Seri Begawan", Category.GEOGRAPHY)),
		new Word("burger", new Hint("ground beef in a bun", Category.FOOD)),
		new Word("bushel", new Hint("eight gallons", Category.MEASUREMENT, Difficulty.HARD)),
		new Word("butane", new Hint("C4H10", Category.CHEMISTRY)),
		new Word("butter", new Hint("churned cream", Category.FOOD)),
		new Word("cactus", new Hint("spiked desert plant", Category.BOTANY)),
		new Word("caelum", new Hint("chisel constellation", Category.ASTRONOMY)),
		new Word("camels", [
			new Hint("humped mounts", Category.ZOOLOGY),
			new Hint("said to be the mounts of the three wise men", Category.HOLIDAY_WINTER),
		]),
		new Word("canada", [
			new Hint("its capital, Ottawa", Category.GEOGRAPHY),
			new Hint("maple leaf flag", Category.GEOGRAPHY),
		]),
		new Word("canary", [
			new Hint("Atlantic archipelago of Spain (first word)", Category.GEOGRAPHY),
			new Hint("yellow finch", Category.ZOOLOGY),
		]),
		new Word("cancer", new Hint("crab sign", Category.ASTROLOGY)),
		new Word("canine", new Hint("of dogs", Category.ZOOLOGY)),
		new Word("canola", new Hint("rapeseed cultivar", Category.BOTANY)),
		new Word("canton", new Hint("flag quarter", Category.VEXILLOLOGY)),
		new Word("canvas", new Hint("durable fabric", Category.TEXTILE)),
		new Word("carbon", new Hint("main element of coal", Category.CHEMISTRY)),
		new Word("carina", new Hint("keel constellation", Category.ASTRONOMY)),
		new Word("carols", new Hint("sung around the holidays", Category.HOLIDAY_WINTER)),
		new Word("carpel", new Hint("female reproductive organ of flowering plants", Category.BOTANY, Difficulty.HARD)),
		new Word("carpet", new Hint("rug", Category.TEXTILE)),
		new Word("carrot", new Hint("orange root", Category.FOOD)),
		new Word("casein", new Hint("milk protein", Category.FOOD)),
		new Word("cashew", new Hint("crescent nut", Category.FOOD)),
		new Word("castor", new Hint("western twin of Gemini", Category.ASTRONOMY)),
		new Word("catena", new Hint("chain of craters", Category.ASTRONOMY)),
		new Word("cation", new Hint("positive ion", Category.CHEMISTRY)),
		new Word("catnip", new Hint("herb enjoyed by cats", Category.BOTANY)),
		new Word("cattle", new Hint("a cow or ox", Category.ZOOLOGY)),
		new Word("celery", new Hint("green stalks", Category.FOOD)),
		new Word("cesium", new Hint("second-defining element", Category.CHEMISTRY)),
		new Word("charge", [
			new Hint("symbol in the field of a flag", Category.VEXILLOLOGY),
			new Hint("measured in Coulombs", Category.MEASUREMENT),
		]),
		new Word("cheese", new Hint("solid milk product", Category.FOOD)),
		new Word("chakra", new Hint("bodily energy center", Category.RELIGION)),
		new Word("charon", new Hint("Pluto's largest moon", Category.ASTRONOMY)),
		new Word("chaser", new Hint("fetishizer of trans folks", Category.LGBT)),
		new Word("chiral", new Hint("of a molecule with L- and D- stereoisomers", Category.CHEMISTRY, Difficulty.HARD)),
		new Word("chrome", new Hint("Google browser", Category.TECH)),
		new Word("cishet", new Hint("slang: cisgender and heterosexual", Category.LGBT)),
		new Word("cobble", new Hint("rock, between a pebble and boulder in size", Category.GEOLOGY)),
		new Word("crimea", new Hint("invaded by Russia in 2014", Category.HISTORY)),
		new Word("chasma", new Hint("deep, elongated, steep-sided depression", Category.ASTRONOMY)),
		new Word("cherry", new Hint("small red fruit", Category.FOOD)),
		new Word("clover", new Hint("small trefoliate plant", Category.BOTANY)),
		new Word("cobalt", new Hint("metal used in blue pigments", Category.CHEMISTRY)),
		new Word("coffee", new Hint("dark caffeinated beverage", Category.FOOD)),
		new Word("collis", new Hint("small hill", Category.ASTRONOMY)),
		new Word("colony", new Hint("organization of conspecifics", Category.BIOLOGY)),
		new Word("cookie", new Hint("treat for Santa", Category.HOLIDAY_WINTER)),
		new Word("copper", new Hint("primary constituent of brass and bronze", Category.CHEMISTRY)),
		new Word("corona", [
			new Hint("outer stellar atmosphere", Category.ASTRONOMY),
			new Hint("Mexican beer", Category.FOOD),
			new Hint("slang: disease which caused a pandemic in 2020", Category.MEDICINE),
		]),
		new Word("corvus", new Hint("crow constellation", Category.ASTRONOMY)),
		new Word("cotton", new Hint("common plant fiber", Category.TEXTILE)),
		new Word("cougar", new Hint("mountain lion", Category.ZOOLOGY)),
		new Word("cowrie", new Hint("sea snail used as currency", Category.ZOOLOGY)),
		new Word("coyote", new Hint("American canid", Category.ZOOLOGY)),
		new Word("crater", [
			new Hint("cup constellation", Category.ASTRONOMY),
			new Hint("circular depression, usually due to an impact", Category.ASTRONOMY),
		]),
		new Word("craton", new Hint("part of a continental plate", Category.GEOLOGY, Difficulty.HARD)),
		new Word("cruise", new Hint("large recreational type of ship", Category.TRANSPORT)),
		new Word("cuboid", new Hint("rectangular prism", Category.MATH)),
		new Word("curium", new Hint("actinide alpha source", Category.CHEMISTRY)),
		new Word("cycler", new Hint("spacecraft on a closed transfer orbit", Category.TRANSPORT)),
		new Word("cygnus", new Hint("swan constellation", Category.ASTRONOMY)),
		new Word("cyprus", new Hint("its capital, Nicosia", Category.GEOGRAPHY)),
		new Word("dacite", new Hint("one type of felsic rock", Category.GEOLOGY)),
		new Word("dagger", new Hint("knife weapon", Category.MISC)),
		new Word("dancer", new Hint("second reindeer called on by Santa", Category.HOLIDAY_WINTER)),
		new Word("danube", new Hint("second-longest European river", Category.GEOGRAPHY)),
		new Word("dalton", new Hint("atomic mass unit", Category.MEASUREMENT)),
		new Word("dasher", new Hint("first reindeer called on by Santa", Category.HOLIDAY_WINTER)),
		new Word("dative", new Hint("case marking the indirect object", Category.GRAMMAR)),
		new Word("decade", new Hint("ten years", Category.MEASUREMENT, Difficulty.EASY)),
		new Word("decare", new Hint("unit of a thousand square meters", Category.MEASUREMENT)),
		new Word("defend", new Hint("antonym of attack", Category.ENGLISH)),
		new Word("degree", new Hint("1/360 of a circle", Category.MEASUREMENT)),
		new Word("delete", new Hint("key on keyboard similar to backspace", Category.MISC)),
		new Word("desert", new Hint("biome with little precipitation", Category.GEOGRAPHY)),
		new Word("donkey", [
			new Hint("Shrek's partner", Category.FILM),
			new Hint("rideable Minecraft mob", Category.VIDEOGAME),
		]),
		new Word("donner", new Hint("seventh reindeer called on by Santa", Category.HOLIDAY_WINTER)),
		new Word("dorado", [
			new Hint("mahi-mahi constellation", Category.ASTRONOMY, Difficulty.HARD),
			new Hint("mythical golden city (second word)", Category.HISTORY),
		]),
		new Word("drachm", new Hint("sixteenth of an ounce", Category.MEASUREMENT, Difficulty.HARD)),
		new Word("dragon", new Hint("mythological winged lizard", Category.FANTASY)),
		new Word("durian", new Hint("large smelly fruit", Category.FOOD)),
		new Word("dyeing", new Hint("textile coloring", Category.TEXTILE)),
		new Word("easter", new Hint("Christian spring holiday", Category.RELIGION)),
		new Word("eggnog", new Hint("wintry dairy drink", Category.HOLIDAY_WINTER)),
		new Word("embryo", new Hint("initial developmental stage", Category.BIOLOGY)),
		new Word("energy", new Hint("measured in Joules", Category.MEASUREMENT)),
		new Word("enzyme", new Hint("catalytic protein", Category.BIOLOGY)),
		new Word("eocene", new Hint("paleogene epoch preceding the oligocene", Category.GEOLOGY)),
		new Word("equine", new Hint("of horses", Category.ZOOLOGY)),
		new Word("ermine", new Hint("black-tailed white weasel", Category.ZOOLOGY)),
		new Word("eroded", new Hint("worn away", Category.GEOLOGY)),
		new Word("escape", new Hint("key in upper-left corner of keyboard", Category.MISC)),
		new Word("ethane", new Hint("C2H6", Category.CHEMISTRY)),
		new Word("euboea", new Hint("large island off Boeotia", Category.GEOGRAPHY)),
		new Word("europa", new Hint("Galileian moon", Category.ASTRONOMY)),
		new Word("europe", new Hint("continent of Rome", Category.GEOGRAPHY)),
		new Word("fabric", new Hint("cloth", Category.TEXTILE)),
		new Word("falcon", [
			new Hint("bird of prey, eg. peregrine", Category.ZOOLOGY),
			new Hint("millennium or maltese", Category.FILM),
			new Hint("SpaceX launch vehicle", Category.TRANSPORT),
		]),
		new Word("fathom", new Hint("thousandth of a nautical mile", Category.MEASUREMENT, Difficulty.HARD)),
		new Word("feline", new Hint("of cats", Category.ZOOLOGY)),
		new Word("felsic", new Hint("of silicate-rich igneous", Category.GEOLOGY)),
		new Word("family", new Hint("taxonomic rank under order", Category.BIOLOGY)),
		new Word("fennel", new Hint("mediterranean herb related to dill", Category.FOOD)),
		new Word("ferret", [
			new Hint("beastly synonym of uncover", Category.ENGLISH),
			new Hint("domesticated polecat", Category.ZOOLOGY),
		]),
		new Word("finger", new Hint("digit of the hand", Category.ANATOMY, Difficulty.EASY)),
		new Word("finial", new Hint("decorative flagpole cap", Category.VEXILLOLOGY)),
		new Word("firkin", new Hint("quarter of a barrel", Category.MEASUREMENT, Difficulty.HARD)),
		new Word("floret", new Hint("small flower", Category.BOTANY, Difficulty.HARD)),
		new Word("florin", new Hint("a coin, worth two shillings", Category.HISTORY)),
		new Word("flower", new Hint("inflorescence", Category.BOTANY)),
		new Word("forest", new Hint("biome of trees", Category.GEOGRAPHY, Difficulty.EASY)),
		new Word("fornax", new Hint("furnace constellation", Category.ASTRONOMY)),
		new Word("fossil", new Hint("mineralized organism remains", Category.GEOLOGY)),
		new Word("france", [
			new Hint("country with the most francophones", Category.GEOGRAPHY),
			new Hint("its capital, Paris", Category.GEOGRAPHY),
		]),
		new Word("freeze", new Hint("solidify", Category.CHEMISTRY)),
		new Word("french", new Hint("spoken in France", Category.LANGUAGE)),
		new Word("friday", new Hint("day before the weekend", Category.MEASUREMENT, Difficulty.EASY)),
		new Word("frosty", new Hint("animated snowman", Category.HOLIDAY_WINTER)),
		new Word("fungus", new Hint("mushrooms are a type of this", Category.BIOLOGY)),
		new Word("gallon", new Hint("eight pints", Category.MEASUREMENT, Difficulty.HARD)),
		new Word("galaxy", new Hint("the Milky Way is this", Category.ASTRONOMY)),
		new Word("gambia", new Hint("its capital, Banjul", Category.GEOGRAPHY)),
		new Word("gamete", new Hint("reproductive cell", Category.BIOLOGY)),
		new Word("garden", new Hint("outdoor plant cultivation area", Category.BOTANY)),
		new Word("garlic", new Hint("strong bulb", Category.BOTANY)),
		new Word("garnet", new Hint("red silicate mineral", Category.MINEROLOGY)),
		new Word("gaydar", new Hint("intuition of sexuality", Category.LGBT)),
		new Word("gemini", new Hint("twin sign", Category.ASTROLOGY)),
		new Word("genome", new Hint("entire set of genetic material", Category.BIOLOGY)),
		new Word("gelato", new Hint("Italian ice cream", Category.FOOD)),
		new Word("ginger", [
			new Hint("red hair", Category.COLOR),
			new Hint("strong root", Category.BOTANY),
		]),
		new Word("ginkgo", new Hint("'living fossil' monotypic tree division", Category.BOTANY)),
		new Word("goblin", new Hint("mischievous humanoid (often green)", Category.FANTASY)),
		new Word("gopher", new Hint("small burrowing rodent", Category.ZOOLOGY)),
		new Word("gothic", [
			new Hint("2001 RPG", Category.VIDEOGAME),
			new Hint("of the east Germanic conquerers of Rome", Category.HISTORY),
			new Hint("sans-serif, in other words", Category.ENGLISH),
		]),
		new Word("graben", new Hint("depressed block of crust bordered by parallel faults", Category.GEOLOGY)),
		new Word("greece", new Hint("its capital, Athens", Category.GEOGRAPHY)),
		new Word("grouse", new Hint("landfowl, eg. ruffed, spruce, sooty", Category.ZOOLOGY, Difficulty.HARD)),
		new Word("grinch", new Hint("who nemesis", Category.HOLIDAY_WINTER)),
		new Word("guinea", [
			new Hint("a coin, worth twenty-one shillings", Category.HISTORY),
			new Hint("its capital, Conakry", Category.GEOGRAPHY),
			new Hint("most linguistically diverse island, (second word)", Category.LANGUAGE),
			new Hint("preceding fowl and pig", Category.ZOOLOGY),
		]),
		new Word("guilty", new Hint("verdict to punish the accused", Category.LAW)),
		new Word("guyana", new Hint("its capital, Georgetown", Category.GEOGRAPHY)),
		new Word("hadean", new Hint("oldest eon", Category.GEOLOGY)),
		new Word("hadron", new Hint("meson or baryon", Category.PHYSICS)),
		new Word("halide", new Hint("halogen ion", Category.CHEMISTRY)),
		new Word("halite", new Hint("rock salt", Category.GEOLOGY)),
		new Word("haumea", new Hint("dwarf planet named for goddess of Hawaii", Category.ASTRONOMY)),
		new Word("hawaii", [
			new Hint("American state surrounded entirely by ocean", Category.GEOGRAPHY),
			new Hint("Pacific kingdom invaded by the United States", Category.HISTORY),
		]),
		new Word("helium", new Hint("element discovered in the sun", Category.CHEMISTRY)),
		new Word("hermes", new Hint("Greek messenger god", Category.RELIGION)),
		new Word("hestia", new Hint("Greek goddess of the hearth", Category.RELIGION)),
		new Word("hornet", [
			new Hint("large wasp", Category.ZOOLOGY),
			new Hint("beastly name of the F-18", Category.TRANSPORT),
		]),
		new Word("horses", [
			new Hint("1988 Q Lazzarus song (second word)", Category.MUSIC),
			new Hint("stallions or mares", Category.ZOOLOGY),
		]),
		new Word("hubble", new Hint("proved galaxies lay outside the Milky Way", Category.ASTRONOMY)),
		new Word("hyades", new Hint("nearest open cluster", Category.ASTRONOMY)),
		new Word("hybrid", new Hint("offspring of two varieties of organism", Category.BIOLOGY)),
		new Word("hydrus", new Hint("lesser water snake constellation", Category.ASTRONOMY)),
		new Word("hyssop", new Hint("mediterranean shrub used in herbal medicine", Category.BOTANY)),
		new Word("iberia", new Hint("peninsula of Spain and Portugal", Category.GEOGRAPHY)),
		new Word("icicle", new Hint("ice spear", Category.METEOROLOGY)),
		new Word("imbolc", new Hint("Wiccan end-of-winter holiday", Category.RELIGION)),
		new Word("indigo", new Hint("'I' of the rainbow", Category.COLOR)),
		new Word("indium", new Hint("element named for its bluish-purple spectral line", Category.CHEMISTRY)),
		new Word("iodine", new Hint("heaviest dietary element", Category.CHEMISTRY)),
		new Word("island", new Hint("land surrounded by water", Category.GEOGRAPHY)),
		new Word("istria", new Hint("Croatian peninsula", Category.GEOGRAPHY)),
		new Word("israel", new Hint("country responsible for the Gaza genocide", Category.HISTORY)),
		new Word("itself", new Hint("third person singular neuter reflexive", Category.GRAMMAR)),
		new Word("jingle", new Hint("what sleighbells do", Category.HOLIDAY_WINTER)),
		new Word("jordan", new Hint("its capital, Amman", Category.GEOGRAPHY)),
		new Word("junior", new Hint("senior antonym", Category.ENGLISH)),
		new Word("kelvin", new Hint("SI unit of temperature", Category.MEASUREMENT)),
		new Word("kepler", new Hint("astronomer known for his laws of planetary motion", Category.ASTRONOMY)),
		new Word("kernel", [
			new Hint("drupe", Category.BOTANY),
			new Hint("operating system core", Category.PROGRAMMING),
		]),
		new Word("kidney", new Hint("blood filtration organ", Category.MEDICINE)),
		new Word("knight", [
			new Hint("noble warrior", Category.HISTORY),
			new Hint("chess jumper", Category.BOARDGAME),
		]),
		new Word("kobold", new Hint("mischievous reptilian humanoid", Category.FANTASY)),
		new Word("kuiper", new Hint("Pluto lies in this belt", Category.ASTRONOMY)),
		new Word("labile", [
			new Hint("kinetically unstable", Category.CHEMISTRY),
			new Hint("valence-changing verb", Category.GRAMMAR),
		]),
		new Word("lacuna", new Hint("missing part of inscription", Category.HISTORY)),
		new Word("lambda", new Hint("Greek L", Category.LANGUAGE)),
		new Word("lammas", new Hint("Wiccan harvest holiday", Category.RELIGION)),
		new Word("latvia", new Hint("its capital, Riga", Category.GEOGRAPHY)),
		new Word("laurel", new Hint("bay leaf source", Category.BOTANY)),
		new Word("lazuli", [
			new Hint("blue stone (second word)", Category.MINEROLOGY),
			new Hint("Minecraft ore used to enchant (second word)", Category.VIDEOGAME),
		]),
		new Word("league", new Hint("three miles", Category.MEASUREMENT, Difficulty.HARD)),
		new Word("legume", new Hint("Fabaceae fruit", Category.BOTANY, Difficulty.HARD)),
		new Word("length", new Hint("dimesion measured by the meter", Category.MEASUREMENT)),
		new Word("lesbos", new Hint("island of Sappho", Category.GEOGRAPHY)),
		new Word("lichen", new Hint("algae-fungus symbiote", Category.BOTANY)),
		new Word("lights", new Hint("bright decorations strung on tree", Category.HOLIDAY_WINTER)),
		new Word("linear", new Hint("of a line", Category.MATH)),
		new Word("liquid", new Hint("product of melting", Category.CHEMISTRY)),
		new Word("lizard", new Hint("common quadrupedal reptile", Category.ZOOLOGY)),
		new Word("locust", [
			new Hint("swarming grasshopper", Category.ZOOLOGY),
			new Hint("one of three plagues sent to Egypt", Category.RELIGION),
		]),
		new Word("lovage", new Hint("parsley-like herb", Category.FOOD)),
		new Word("lumber", new Hint("wood", Category.MISC)),
		new Word("luster", new Hint("how light interacts with a rock surface", Category.GEOLOGY)),
		new Word("lychee", new Hint("small, bumpy south Asian fruit", Category.FOOD)),
		new Word("magpie", new Hint("intelligent black-and-white bird", Category.ZOOLOGY)),
		new Word("manger", new Hint("structure Jesus was said to be born in", Category.HOLIDAY_WINTER)),
		new Word("mantle", new Hint("layer between the crust and core", Category.GEOLOGY)),
		new Word("marble", new Hint("white metamorphic rock", Category.GEOLOGY)),
		new Word("marmot", new Hint("large ground-dwelling rodent", Category.ZOOLOGY)),
		new Word("marten", new Hint("weasel-like mammal", Category.ZOOLOGY)),
		new Word("maroon", new Hint("dark red", Category.COLOR)),
		new Word("matrix", [
			new Hint("material between eukaryotic cells", Category.BIOLOGY),
			new Hint("medium in which grains of material are embedded", Category.GEOLOGY),
			new Hint("rectangular array", Category.MATH),
			new Hint("1999 sci-fi action film", Category.FILM),
		]),
		new Word("meadow", new Hint("grassy field", Category.BOTANY)),
		new Word("medium", new Hint("neither small nor large", Category.ENGLISH)),
		new Word("medusa", new Hint("serpent-haired monster", Category.RELIGION)),
		new Word("memory", new Hint("data storage", Category.PROGRAMMING)),
		new Word("meteor", new Hint("shooting star", Category.ASTRONOMY)),
		new Word("metric", new Hint("system of units defined in terms of, eg. the second and meter", Category.MEASUREMENT)),
		new Word("mexico", new Hint("most populous Spanish-speaking country", Category.GEOGRAPHY)),
		new Word("miasma", new Hint("bad air said to spread disease", Category.MISC)),
		new Word("micron", new Hint("millionth of a meter", Category.MEASUREMENT)),
		new Word("midday", new Hint("noon", Category.MEASUREMENT, Difficulty.EASY)),
		new Word("minute", new Hint("sixty seconds", Category.MEASUREMENT)),
		new Word("molten", new Hint("of liquid metal", Category.CHEMISTRY)),
		new Word("moment", new Hint("ninety seconds", Category.MEASUREMENT)),
		new Word("monday", new Hint("day after the weekend", Category.MEASUREMENT, Difficulty.EASY)),
		new Word("mormon", new Hint("follower of Joseph Smith", Category.RELIGION)),
		new Word("morrow", new Hint("morning", Category.MEASUREMENT)),
		new Word("mortar", new Hint("pestle complement", Category.MISC)),
		new Word("murder", new Hint("unlawful killing", Category.LAW)),
		new Word("myosin", new Hint("motor protein", Category.BIOLOGY)),
		new Word("myself", new Hint("first person singular reflexive", Category.GRAMMAR)),
		new Word("nebula", new Hint("'cloudy' object, follows Crab and Orion", Category.ASTRONOMY)),
		new Word("nectar", new Hint("flower juice", Category.BOTANY)),
		new Word("needle", [
			new Hint("pine 'leaf'", Category.BOTANY),
			new Hint("sharp threader", Category.TEXTILE),
		]),
		new Word("neuron", new Hint("electrically exciteable cell", Category.BIOLOGY)),
		new Word("newton", new Hint("SI unit of force", Category.MEASUREMENT)),
		new Word("nickel", new Hint("most common impurity in meteoric iron", Category.CHEMISTRY)),
		new Word("norway", new Hint("its capital, Oslo", Category.GEOGRAPHY)),
		new Word("nutmeg", new Hint("seed which mace covers", Category.BOTANY)),
		new Word("oberon", new Hint("second-largest Uranian moon", Category.ASTRONOMY)),
		new Word("ocelot", [
			new Hint("small American felid", Category.ZOOLOGY),
			new Hint("Minecraft wild cat", Category.VIDEOGAME),
		]),
		new Word("octans", new Hint("octant constellation", Category.ASTRONOMY)),
		new Word("orange", [
			new Hint("reddish yellow", Category.COLOR, Difficulty.EASY),
			new Hint("word said to have no rhymes", Category.ENGLISH),
			new Hint("citrus, eg. mandarin", Category.FOOD),
		]),
		new Word("ostara", new Hint("Wiccan spring equinox holiday", Category.RELIGION)),
		new Word("oxgang", new Hint("fifteen acres", Category.MEASUREMENT, Difficulty.HARD)),
		new Word("oxygen", new Hint("second most abundant element in Earth's atmosphere", Category.CHEMISTRY)),
		new Word("paneer", new Hint("Indian cheese", Category.FOOD)),
		new Word("palate", [
			new Hint("roof of the mouth", Category.ANATOMY),
			new Hint("expanded lower lip of a flower", Category.BOTANY, Difficulty.HARD),
			new Hint("one's taste", Category.FOOD),
			new Hint("consonants like /c/ and /k/ are pronounced here", Category.LANGUAGE),
		]),
		new Word("papaya", new Hint("large tropical yellow fruit", Category.FOOD)),
		new Word("parrot", [
			new Hint("imitative bird", Category.ZOOLOGY),
			new Hint("Minecraft mob, dies to cookies", Category.VIDEOGAME),
		]),
		new Word("pascal", new Hint("SI unit of pressure", Category.MEASUREMENT)),
		new Word("peanut", new Hint("legume commonly ground to butter", Category.FOOD)),
		new Word("pebble", new Hint("rock, smaller than cobble", Category.GEOLOGY)),
		new Word("period", [
			new Hint("orbit repetition interval", Category.ASTRONOMY),
			new Hint("era subdivision", Category.GEOLOGY),
			new Hint("sine repetition interval", Category.MATH),
		]),
		new Word("pestle", new Hint("mortar complement", Category.MISC)),
		new Word("petals", new Hint("flower segments", Category.BOTANY)),
		new Word("pewter", new Hint("alloy, primarily tin", Category.CHEMISTRY)),
		new Word("phlegm", new Hint("one of four bodily humors", Category.MISC)),
		new Word("phloem", new Hint("photosynthesis product transport tissue", Category.BOTANY)),
		new Word("photon", new Hint("light particle", Category.PHYSICS)),
		new Word("phylum", new Hint("taxonomic rank under kingdom", Category.BIOLOGY)),
		new Word("pindus", new Hint("Greek mountain range", Category.GEOGRAPHY)),
		new Word("pistil", new Hint("free carpel", Category.BOTANY, Difficulty.HARD)),
		new Word("piazzi", new Hint("Ceres discoverer surname", Category.ASTRONOMY, Difficulty.HARD)),
		new Word("pictor", new Hint("painter constellation", Category.ASTRONOMY)),
		new Word("pisces", new Hint("fish sign", Category.ASTROLOGY)),
		new Word("plants", new Hint("organisms botanists study", Category.BOTANY)),
		new Word("plasma", new Hint("ionized gas", Category.CHEMISTRY)),
		new Word("pluton", new Hint("igneous intrusion", Category.GEOLOGY)),
		new Word("poison", [
			new Hint("harmful substance", Category.MEDICINE),
			new Hint("in D&D, damage type caused by eg. venom", Category.FANTASY),
		]),
		new Word("poland", [
			new Hint("its capital, Warsaw", Category.GEOGRAPHY),
			new Hint("its invasion brought about a world war", Category.HISTORY, Difficulty.TRICKY),
		]),
		new Word("pollen", new Hint("seed plant microspore", Category.BOTANY)),
		new Word("pollux", new Hint("eastern twin of Gemini", Category.ASTRONOMY)),
		new Word("pomelo", new Hint("large citrus", Category.FOOD)),
		new Word("poplar", new Hint("deciduous northern flowering tree", Category.BOTANY, Difficulty.HARD)),
		new Word("potato", new Hint("staple tuber", Category.FOOD)),
		new Word("potion", new Hint("magical concoction", Category.FANTASY)),
		new Word("prefix", new Hint("attached to end of word", Category.GRAMMAR)),
		new Word("prison", new Hint("carceral punishment building", Category.LAW)),
		new Word("proton", new Hint("positive nucleon", Category.CHEMISTRY)),
		new Word("pulley", new Hint("simple machine", Category.PHYSICS, Difficulty.SIMPLE)),
		new Word("puppis", new Hint("poop deck constellation", Category.ASTRONOMY)),
		new Word("purple", [
			new Hint("reddish blue", Category.COLOR, Difficulty.EASY),
			new Hint("royal color", Category.HISTORY),
		]),
		new Word("python", [
			new Hint("nonvenomous tropical snake", Category.ZOOLOGY),
			new Hint("widespread dynamically typed programming language", Category.PROGRAMMING),
		]),
		new Word("quakes", new Hint("tremors of the crust, in short", Category.GEOLOGY)),
		new Word("quaoar", new Hint("dwarf planet named for Tongva creator god", Category.ASTRONOMY)),
		new Word("quartz", new Hint("silica mineral", Category.MINEROLOGY)),
		new Word("quecto", new Hint("metric prefix for 10^-30", Category.MEASUREMENT)),
		new Word("quetta", new Hint("metric prefix for 10^30", Category.MEASUREMENT)),
		new Word("quiver", new Hint("arrow holder", Category.MISC)),
		new Word("rabbit", new Hint("small hopping mammal", Category.ZOOLOGY)),
		new Word("radian", new Hint("SI unit of angle", Category.MEASUREMENT)),
		new Word("radish", new Hint("round red root", Category.FOOD)),
		new Word("radium", new Hint("radioactive alkaline earth metal", Category.CHEMISTRY)),
		new Word("radius", [
			new Hint("bone next to ulna", Category.ANATOMY),
			new Hint("distance from center of circle to its edge", Category.MATH),
		]),
		new Word("raisin", new Hint("dried grape", Category.FOOD)),
		new Word("redder", new Hint("objects moving away appear this way", Category.PHYSICS)),
		new Word("rennet", new Hint("cheesemaking enzymes", Category.FOOD)),
		new Word("retort", new Hint("bent-necked flask", Category.CHEMISTRY)),
		new Word("rhodes", new Hint("Greek island known for its Colossus", Category.GEOGRAPHY)),
		new Word("ribbon", new Hint("thin cloth band", Category.TEXTILE)),
		new Word("ritual", new Hint("spell that can be cast without expending a spell slot, at the expense of time", Category.FANTASY)),
		new Word("russet", new Hint("reddish brown", Category.COLOR)),
		new Word("russia", [
			new Hint("its capital, Moscow", Category.GEOGRAPHY),
			new Hint("invaded Ukraine in 2014 and 2022", Category.HISTORY),
		]),
		new Word("rwanda", new Hint("its capital, Kigali", Category.GEOGRAPHY)),
		new Word("saline", new Hint("salty", Category.MISC)),
		new Word("salmon", [
			new Hint("fish used to make lox", Category.FOOD),
			new Hint("Minecraft mob, one of four fish", Category.VIDEOGAME),
		]),
		new Word("saturn", [
			new Hint("great ringed giant", Category.ASTRONOMY),
			new Hint("greater malefic", Category.ASTROLOGY),
			new Hint("to Holst, the bringer of old age", Category.MUSIC, Difficulty.HARD),
			new Hint("Roman god of agriculture and wealth", Category.RELIGION),
			new Hint("father of Jupiter", Category.RELIGION),
			new Hint("Sega console", Category.VIDEOGAME),
			new Hint("rocket family which first brought humans to the moon", Category.TRANSPORT),
		]),
		new Word("savory", new Hint("satureja herb", Category.BOTANY, Difficulty.HARD)),
		new Word("saxony", new Hint("state of Leipzig and Dresden", Category.GEOGRAPHY)),
		new Word("senior", new Hint("senior antonym", Category.ENGLISH)),
		new Word("sesame", new Hint("hamburger bun seed", Category.FOOD)),
		new Word("scurvy", new Hint("vitamin C deficiency", Category.MEDICINE)),
		new Word("scutum", new Hint("shield constellation", Category.ASTRONOMY)),
		new Word("scythe", new Hint("crop-harvesting tool", Category.AGRICULTURE)),
		new Word("season", new Hint("quarter of a year", Category.MEASUREMENT)),
		new Word("secant", new Hint("line intersecting a curve at two points", Category.MATH)),
		new Word("second", new Hint("SI unit of time", Category.MEASUREMENT)),
		new Word("serbia", [
			new Hint("its capital, Belgrade", Category.GEOGRAPHY),
			new Hint("its invasion brought about a world war", Category.HISTORY, Difficulty.TRICKY),
		]),
		new Word("sewing", new Hint("textile fastening", Category.TEXTILE)),
		new Word("shield", new Hint("exposed precambrian rock", Category.GEOLOGY)),
		new Word("sicily", new Hint("largest Mediterranean island", Category.GEOGRAPHY)),
		new Word("sienna", new Hint("reddish brown pigment", Category.COLOR)),
		new Word("silver", new Hint("common coinage metal", Category.CHEMISTRY)),
		new Word("sirius", new Hint("brightest nighttime star", Category.ASTRONOMY)),
		new Word("sleigh", new Hint("Santa's vehicle", Category.HOLIDAY_WINTER)),
		new Word("sodium", new Hint("secondary constituent of table salt", Category.CHEMISTRY)),
		new Word("source", new Hint("spring", Category.GEOLOGY)),
		new Word("sphere", new Hint("3D analogue of a circle", Category.MATH)),
		new Word("sphinx", new Hint("mythological creature with the head of a person and the body of a lion", Category.RELIGION)),
		new Word("spider", [
			new Hint("common eight-legged critter", Category.ZOOLOGY),
			new Hint("Minecraft string source", Category.VIDEOGAME),
		]),
		new Word("spinel", new Hint("red oxide mineral", Category.MINEROLOGY)),
		new Word("sponge", new Hint("most basal animal", Category.ZOOLOGY)),
		new Word("spring", [
			new Hint("source", Category.GEOLOGY),
			new Hint("season after winter", Category.MEASUREMENT, Difficulty.EASY),
		]),
		new Word("spruce", new Hint("conifer", Category.BOTANY)),
		new Word("steppe", new Hint("grassland plains, as in Eurasia", Category.GEOGRAPHY)),
		new Word("stevia", new Hint("sugar substitute", Category.FOOD)),
		new Word("strain", new Hint("deformation", Category.PHYSICS)),
		new Word("stress", new Hint("deformation force", Category.PHYSICS)),
		new Word("suffix", new Hint("attached to end of word", Category.GRAMMAR)),
		new Word("sulfur", new Hint("element said to smell of egg", Category.CHEMISTRY)),
		new Word("sunset", new Hint("dusk", Category.MEASUREMENT, Difficulty.EASY)),
		new Word("summer", new Hint("season after spring", Category.MEASUREMENT, Difficulty.EASY)),
		new Word("sunday", new Hint("second day of the weekend", Category.MEASUREMENT, Difficulty.EASY)),
		new Word("sweden", new Hint("its capital, Stockholm", Category.GEOGRAPHY)),
		new Word("switch", [
			new Hint("tops and bottoms", Category.LGBT),
			new Hint("Nintendo console", Category.VIDEOGAME),
		]),
		new Word("syzygy", new Hint("alignment of three objects", Category.ASTRONOMY)),
		new Word("taoism", new Hint("Chinese philosophical tradition", Category.RELIGION)),
		new Word("taurus", new Hint("bull sign", Category.ASTROLOGY)),
		new Word("tephra", new Hint("volcanic ejecta", Category.GEOLOGY)),
		new Word("tethys", new Hint("fifth-largest Saturnian moon", Category.ASTRONOMY)),
		new Word("thorns", new Hint("sharp things on roses", Category.BOTANY)),
		new Word("thread", new Hint("used with needles, found on spools", Category.TEXTILE)),
		new Word("timber", new Hint("wood", Category.MISC)),
		new Word("tinsel", new Hint("sparkly decoration strung on tree", Category.HOLIDAY_WINTER)),
		new Word("tomato", new Hint("fruit considered a vegetable", Category.FOOD)),
		new Word("tongue", new Hint("organ of taste and language", Category.MEDICINE)),
		new Word("tonian", new Hint("neoproterozoic period preceding the cryogenian", Category.GEOLOGY)),
		new Word("triton", new Hint("Neptune's largest moon", Category.ASTRONOMY)),
		new Word("trojan", [
			new Hint("small body in the lagrangian point of a planet", Category.ASTRONOMY),
			new Hint("disguised malware", Category.TECH),
			new Hint("war fought over Helen", Category.HISTORY),
		]),
		new Word("tropic", new Hint("northern- or southernmost latitude the sun can be directly overhead", Category.ASTRONOMY)),
		new Word("tucana", new Hint("toucan constellation", Category.ASTRONOMY)),
		new Word("tundra", new Hint("arctic biome", Category.GEOGRAPHY)),
		new Word("turkey", [
			new Hint("american landfowl", Category.ZOOLOGY),
			new Hint("its capital, Ankara", Category.GEOGRAPHY),
		]),
		new Word("turnip", new Hint("purple-white root", Category.FOOD)),
		new Word("turtle", new Hint("shelled reptile", Category.ZOOLOGY)),
		new Word("tuvalu", new Hint("its capital, Funafuti", Category.GEOGRAPHY)),
		new Word("tyrian", new Hint("reddish purple dye", Category.COLOR)),
		new Word("uganda", new Hint("its capital, Kampala", Category.GEOGRAPHY)),
		new Word("uranus", [
			new Hint("greatly tilted giant", Category.ASTRONOMY),
			new Hint("to Holst, the magician", Category.MUSIC, Difficulty.HARD),
			new Hint("Greek god of the sky", Category.RELIGION),
			new Hint("father of the Titans", Category.RELIGION),
		]),
		new Word("vacuum", new Hint("space devoid of matter", Category.PHYSICS)),
		new Word("violet", new Hint("bluish purple", Category.COLOR)),
		new Word("volans", new Hint("flying fish constellation", Category.ASTRONOMY)),
		new Word("volume", [
			new Hint("measure of 3D space", Category.MATH),
			new Hint("measured in liters", Category.MEASUREMENT),
		]),
		new Word("walnut", new Hint("hard-to-crack nut", Category.BOTANY)),
		new Word("walrus", new Hint("tusked marine mammal", Category.ZOOLOGY)),
		new Word("waning", new Hint("decrescent", Category.ASTRONOMY)),
		new Word("warmth", new Hint("heat", Category.MISC)),
		new Word("waxing", new Hint("excrescent", Category.ASTRONOMY)),
		new Word("weaver", new Hint("textile producer", Category.TEXTILE)),
		new Word("weight", new Hint("downward force", Category.PHYSICS)),
		new Word("winter", [
			new Hint("season after fall", Category.MEASUREMENT, Difficulty.EASY),
			new Hint("christmas season", Category.HOLIDAY_WINTER, Difficulty.EASY),
		]),
		new Word("wisdom", new Hint("in D&D, represents a character's practical intelligence", Category.FANTASY)),
		new Word("wreath", new Hint("decorative branch ring", Category.HOLIDAY_WINTER)),
		new Word("yellow", new Hint("color between orange and green", Category.COLOR, Difficulty.EASY)),
		new Word("yogurt", new Hint("fermented milk product", Category.FOOD)),
		new Word("zaffre", new Hint("cobalt blue pigment", Category.COLOR)),
		new Word("zambia", new Hint("its capital, Lusaka", Category.GEOGRAPHY)),
		new Word("zealot", new Hint("fanatic", Category.RELIGION)),
		new Word("zenith", new Hint("the point directly above the observer", Category.ASTRONOMY)),
		new Word("zither", new Hint("guitar ancestor", Category.MUSIC)),
		new Word("zodiac", new Hint("the twelve signs of the ecliptic", Category.ASTROLOGY)),
		new Word("zombie", [
			new Hint("horror staple monster", Category.FILM),
			new Hint("second mob added to Minecraft", Category.VIDEOGAME),
		]),
		new Word("zircon", new Hint("key mineral of geochronology", Category.GEOLOGY)),
		new Word("zygote", new Hint("diploid cell fromed from two haploid gametes", Category.BIOLOGY)),
	],
	config: {
		avoidDupeCats: true,
		avoidMultipleHardClues: true,
		date: new Date(),
		debug: document.URL[0].toLowerCase() === 'f', // file:// vs. http(s)://
		forcecat: '',
		get hashLength(){
			return this.debug ? Infinity : 4;
		},
		maxIter: 10000,
		get minCatSize(){
			return this.debug ? 7 : 28;
		},
		/** @param {Category} c */
		seasonalFilter(c){
			switch (c){
				case Category.HOLIDAY_WINTER:
					return HONEYCOMB.config.date.getMonth() === 11;
				default:
					return true;
			}
		}
	},
	/** @type {Clue[]} */
	clues: new Array(7).fill(undefined),
	get hash(){
		return this.clues
			// literally Java's string hashing algo
			.reduce((a, b) => 31*a+b.word.id, 0)
			.toString(16)
			.slice(-this.config.hashLength);
	},
	letterNodes: {
		get hex(){
			return Math.floor(this.selected / 5);
		},
		letters: new Array(30).fill(''),
		selected: 0,
		advance(reverse = false){
			this.select((this.selected + (reverse ? 29 : 1)) % 30);
		},
		advanceHex(reverse = false){
			const start = this.hex;
			while (this.hex === start){
				this.advance(reverse);
			}
		},
		backspace(){
			this.setLetter();
			this.advance(true);
		},
		check(){
			// mark solved cells
			this.solvedHexes.forEach((isSolved, i) => {
				const e = document.getElementById(`hex${i}`).classList;
				if (isSolved) e.add('solved');
				else e.remove('solved');
			});
			// see if whole solution is valid
			for (let i = 0; i < 30; i++){
				const letterNode = this.elem(i);
				if (letterNode.getAttribute('answer') !== letterNode.innerHTML)
					return false;
			}
			return true;
		},
		/** @returns {HTMLDivElement} */
		elem(n = 0){
			return document.getElementById(`letter${n}`);
		},
		get elemSelected(){
			return this.elem(this.selected);
		},
		select(n = 0){
			this.elemSelected.classList.remove('selected');
			this.selected = n;
			this.elemSelected.classList.add('selected');
		},
		setLetter(char = ''){
			const solved = this.solvedHexes;
			if (!JSON.parse(this.elemSelected.getAttribute('hexes')).some(i => solved[i]))
				this.elemSelected.innerHTML = this.letters[this.selected] = char;
		},
		get solvedHexes(){
			/** @type {number[]} */
			const hexes = new Array(7).fill(0);
			Array.from(document.getElementsByClassName('letter')).forEach(letter => {
				if (letter.getAttribute('answer') === letter.innerHTML) {
					/** @type {number[]} */
					const neighbors = JSON.parse(letter.getAttribute('hexes'));
					neighbors.forEach(hex => hexes[hex]++);
				}
			});
			return hexes.map(x => 5 < x);
		}
	},
	stats: {
		get categories(){
			const o = {};
			HONEYCOMB.words.forEach(w => {
				w.hints.forEach(h => {
					o[h.category] ||= 0;
					o[h.category]++;
				});
			});
			return o;
		},
	},
	clear(){
		document.body.innerHTML = '';
	},
	debug(){
		Array.from(document.getElementsByClassName('letter')).forEach(e => {
			const answer = e.getAttribute('answer');
			e.innerHTML = answer;
		});
	},
	init(){
		console.info(`${this.words.length} words`);
		console.info('category statistics:', this.stats.categories);
		if (this.config.debug) console.info('debug mode');
		// prepare keyboard controls
		document.body.onkeydown = ev => {
			if (HONEYCOMB.config.debug) console.debug(`keypress`, ev);
			switch (ev.key) {
				case 'Backspace':
				case 'Delete':
					HONEYCOMB.letterNodes.backspace();
					break;
				case 'ArrowLeft':
				case 'ArrowUp':
				case ',':
					HONEYCOMB.letterNodes.advance(true);
					break;
				case 'ArrowDown':
				case 'ArrowRight':
				case '.':
					HONEYCOMB.letterNodes.advance();
					break;
				case ' ':
				case 'Tab':
					if (ev.shiftKey) {
						HONEYCOMB.letterNodes.advanceHex(true);
					}
					else {
						HONEYCOMB.letterNodes.advanceHex();
					}
					break;
				default:
					if (ev.key.length === 1) {
						const char = ev.key.toLowerCase();
						if (char !== char.toUpperCase()){
							// alphabetic
							HONEYCOMB.letterNodes.setLetter(char);
							HONEYCOMB.letterNodes.advance();
						}
					}
			}
			// check
			if (HONEYCOMB.letterNodes.check()){
				alert('Congratulations! You win! Press NEW to start a new game!');
			}
		};
		// new game
		this.new_wrapper();
	},
	initControls(){
		// prepare control panel
		const controls = document.createElement('div');
		controls.id = 'controls';
		document.body.appendChild(controls);
		// "new" button
		const button_new = document.createElement('span');
		button_new.classList.add('button');
		button_new.innerHTML = 'new';
		button_new.onclick = () => HONEYCOMB.new_wrapper();
		controls.appendChild(button_new);
		// "avoid duplicate categories" button
		const button_adc_label = document.createElement('label');
		const button_adc = document.createElement('input');
		button_adc.type = 'checkbox';
		button_adc.id = 'adc';
		button_adc.checked = this.config.avoidDupeCats;
		button_adc_label.appendChild(button_adc);
		button_adc_label.appendChild(document.createTextNode('Balance Categories'));
		button_adc_label.onclick = () => {
			button_adc.checked = !button_adc.checked;
			HONEYCOMB.config.avoidDupeCats = button_adc.checked;
		};
		controls.appendChild(button_adc_label);
		// "avoid multiple hard clues" button
		const button_amhc_label = document.createElement('label');
		const button_amhc = document.createElement('input');
		button_amhc.type = 'checkbox';
		button_amhc.id = 'ahmc';
		button_amhc.checked = this.config.avoidMultipleHardClues;
		button_amhc_label.appendChild(button_amhc);
		button_amhc_label.appendChild(document.createTextNode('Balance Difficulty'));
		button_amhc_label.onclick = () => {
			button_amhc.checked = !button_amhc.checked;
			HONEYCOMB.config.avoidMultipleHardClues = button_amhc.checked;
		};
		controls.appendChild(button_amhc_label);
		// force category dropdown
		const cat_dropdown = document.createElement('select');
		cat_dropdown.id = 'forcecat';
		const catcounts = this.stats.categories;
		const options = ['', ...Category.categories.filter(c => this.config.minCatSize <= catcounts[c])];
		options.forEach(c => {
			const option = document.createElement('option');
			option.value = c;
			option.innerHTML = c ? `${c} (${catcounts[c]})` : 'All Categories';
			cat_dropdown.appendChild(option);
		});
		cat_dropdown.onclick = () => HONEYCOMB.config.forcecat = cat_dropdown.value;
		cat_dropdown.value = this.config.forcecat
		controls.appendChild(cat_dropdown);
		// show id
		const puzzle_id = document.createElement('span');
		puzzle_id.id = 'puzzleId';
		puzzle_id.innerHTML = this.hash;
		puzzle_id.title = 'Puzzle ID';
		document.body.appendChild(puzzle_id);
		this.initOnscreenKeyboard();
	},
	initOnscreenKeyboard(){
		const KEYBOARD = [
			'qwertyuiop',
			'asdfghjkl',
			'zxcvbnm'
		];
		const elem_osc = document.createElement('div');
		elem_osc.id = 'osc';
		KEYBOARD.forEach(row => {
			const kbrow = document.createElement('div');
			elem_osc.appendChild(kbrow);
			Array.from(row).forEach(char => {
				const elem_char = document.createElement('span');
				kbrow.appendChild(elem_char);
				elem_char.innerHTML = char.toUpperCase();
				elem_char.classList.add('kbkey');
				elem_char.onclick = () => {
					HONEYCOMB.letterNodes.setLetter(char);
					HONEYCOMB.letterNodes.advance();
				}
			});
		});
		document.body.appendChild(elem_osc);
	},
	new(){
		// word must also pass seasonal filter here, because some words have hints in multiple categories
		const fi = h => HONEYCOMB.config.seasonalFilter(h.category)
			&& (HONEYCOMB.config.forcecat ? h.category === HONEYCOMB.config.forcecat : !USED_CATEGORIES.includes(h.category));
		this.clear();
		let dictionary = this.words
			// word MUST pass seasonal filter.
			.filter(w => w.hints.some(h => HONEYCOMB.config.seasonalFilter(h.category)));
		let n_hard = 0;
		// first, choose the mystery word for the center
		const WORD0 = this.randomWordMatching(dictionary);
		dictionary.splice(dictionary.indexOf(WORD0), 1);
		const WORD0_START = 0; // always
		/** @type {Clue} */
		const CLUE0 = new Clue(WORD0, WORD0_START);
		n_hard += Difficulty.NORMAL < CLUE0.hint.difficulty;
		const USED_CATEGORIES = [CLUE0.hint.category];
		// console.debug(CLUE0);
		// next, choose the word above
		let re = new RegExp(`${CLUE0.getLetter(Direction.UP)}`);
		const WORD1 = this.randomWordMatching(dictionary, re, USED_CATEGORIES, n_hard);
		dictionary.splice(dictionary.indexOf(WORD1), 1);
		const WORD1_START = (9-re.exec(WORD1.word).index) % 6;
		// choose a hint w/ a category that is NOT in USED_CATEGORIES
		let hint_id = WORD1.hints.findIndex(fi);
		const CLUE1 = new Clue(WORD1, WORD1_START, hint_id);
		USED_CATEGORIES.push(CLUE1.hint.category);
		n_hard += Difficulty.NORMAL < CLUE1.hint.difficulty;
		// console.debug(CLUE1, WORD0.word[WORD0_START]);
		// next, choose the word above-left
		re = new RegExp(`${CLUE1.getLetter(Direction.DL)}${CLUE0.getLetter(Direction.UL)}`);
		const WORD6 = this.randomWordMatching(dictionary, re, USED_CATEGORIES, n_hard);
		dictionary.splice(dictionary.indexOf(WORD6), 1);
		const WORD6_START = (7-re.exec(WORD6.word).index) % 6;
		hint_id = WORD6.hints.findIndex(fi);
		const CLUE6 = new Clue(WORD6, WORD6_START, hint_id);
		USED_CATEGORIES.push(CLUE6.hint.category);
		n_hard += Difficulty.NORMAL < CLUE6.hint.difficulty;
		// console.debug(CLUE2, WORD0.word[(WORD0_START + 5) % 6]);
		// next, choose the word above-right
		re = new RegExp(`${CLUE0.getLetter(Direction.UR)}${CLUE1.getLetter(Direction.DR)}`);
		const WORD2 = this.randomWordMatching(dictionary, re, USED_CATEGORIES, n_hard);
		dictionary.splice(dictionary.indexOf(WORD2), 1);
		const WORD2_START = (10-re.exec(WORD2.word).index) % 6;
		hint_id = WORD2.hints.findIndex(fi);
		const CLUE2 = new Clue(WORD2, WORD2_START, hint_id);
		USED_CATEGORIES.push(CLUE2.hint.category);
		n_hard += Difficulty.NORMAL < CLUE2.hint.difficulty;
		// console.debug(CLUE3, WORD0.word[(WORD0_START + 1) % 6]);
		// next, choose the word down-left
		re = new RegExp(`${CLUE6.getLetter(Direction.DN)}${CLUE0.getLetter(Direction.DL)}`);
		const WORD5 = this.randomWordMatching(dictionary, re, USED_CATEGORIES, n_hard);
		dictionary.splice(dictionary.indexOf(WORD5), 1);
		const WORD5_START = (6-re.exec(WORD5.word).index) % 6;
		hint_id = WORD5.hints.findIndex(fi);
		const CLUE5 = new Clue(WORD5, WORD5_START, hint_id);
		USED_CATEGORIES.push(CLUE5.hint.category);
		n_hard += Difficulty.NORMAL < CLUE5.hint.difficulty;
		// console.debug(CLUE4, WORD0.word[(WORD0_START + 4) % 6]);
		// next, choose the word down-right
		re = new RegExp(`${CLUE0.getLetter(Direction.DR)}${CLUE2.getLetter(Direction.DN)}`);
		const WORD3 = this.randomWordMatching(dictionary, re, USED_CATEGORIES, n_hard);
		dictionary.splice(dictionary.indexOf(WORD3), 1);
		const WORD3_START = (11-re.exec(WORD3.word).index) % 6;
		hint_id = WORD3.hints.findIndex(fi);
		const CLUE3 = new Clue(WORD3, WORD3_START, hint_id);
		USED_CATEGORIES.push(CLUE3.hint.category);
		n_hard += Difficulty.NORMAL < CLUE3.hint.difficulty;
		// console.debug(CLUE5, WORD0.word[(WORD0_START + 2) % 6]);
		// next, choose the word down
		re = new RegExp(`${CLUE5.getLetter(Direction.DR)}${CLUE0.getLetter(Direction.DN)}${CLUE3.getLetter(Direction.DL)}`);
		const WORD4 = this.randomWordMatching(dictionary, re, USED_CATEGORIES, n_hard);
		dictionary.splice(dictionary.indexOf(WORD4), 1);
		const WORD4_START = (5-re.exec(WORD4.word).index) % 6;
		hint_id = WORD4.hints.findIndex(fi);
		const CLUE4 = new Clue(WORD4, WORD4_START, hint_id);
		USED_CATEGORIES.push(CLUE4.hint.category);
		n_hard += Difficulty.NORMAL < CLUE4.hint.difficulty;
		// console.debug(CLUE6, WORD0.word[(WORD0_START + 3) % 6]);
		// create elements
		document.body.appendChild(CLUE1.createElement(1));
		document.body.appendChild(CLUE6.createElement(6));
		document.body.appendChild(CLUE2.createElement(2));
		document.body.appendChild(CLUE0.createElement(0));
		document.body.appendChild(CLUE5.createElement(5));
		document.body.appendChild(CLUE3.createElement(3));
		document.body.appendChild(CLUE4.createElement(4));
		this.clues = [
			CLUE0,
			CLUE1,
			CLUE2,
			CLUE3,
			CLUE4,
			CLUE5,
			CLUE6,
		];
		// create letter buttons
		this.clues.forEach((c, i) => {
			if (!i) return; // don't create any for center cell
			// create 5 cells
			for (let j = 0; j < 5; j++){
				// console.debug(i, j);
				c.createTextCell(i, j);
			}
		});
	},
	new_wrapper(){
		for (let i = 0; i < this.config.maxIter; i++){
			try {
				this.new();
				break;
			}
			catch (e) {
				// pass...
				// console.warn(e);
			}
		}
		this.initControls();
	},
	/**
	 * @param {Word[]} dictionary
	 * @param {Category[]} used_categories
	 * @returns {Word}
	 */
	randomWordMatching(dictionary, re = new RegExp('.'), used_categories = [], n_hard = 0){
		const matches = dictionary
			// if a category is forced, it MUST be that category
			.filter(w => re.test(w.word) && w.hints.some(h => !HONEYCOMB.config.forcecat || h.category === HONEYCOMB.config.forcecat));
		if (matches.length < 1) console.warn('no matches', this.config.debug && re.source);
		// if possible, avoid duplicate categories, and multiple hard clues
		const catmatches = matches.filter(w => w.hints.some(h => (HONEYCOMB.config.forcecat || !HONEYCOMB.config.avoidDupeCats || !used_categories.includes(h.category)) && (!HONEYCOMB.config.avoidMultipleHardClues || n_hard <= 0 || h.difficulty <= Difficulty.NORMAL)));
		const arr = catmatches.length ? catmatches : matches;
		return arr[Math.floor(Math.random() * arr.length)];
	}
};

HONEYCOMB.init();
/* ARRANGEMENT:
		1
	6		2
		0
	5		3
		4
	which means I'll need 30 slots total for the letters...
*/