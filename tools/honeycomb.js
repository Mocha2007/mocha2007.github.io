class Hint {
	constructor(hint, category, img = ''){
		/** @type {string} */
		this.hint = hint;
		/** @type {Category} */
		this.category = category;
		/** @type {string} */
		this.img = img; // todo
	}
	elem(){
		const e = document.createElement('span');
		e.classList.add('hint');
		e.innerHTML = this.hint;
		const cat = document.createElement('span');
		cat.innerHTML = this.category;
		cat.classList.add('category');
		e.appendChild(cat);
		return e;
	}
}

class Word {
	constructor(word, hints){
		/** @type {string} */
		this.word = word;
		/** @type {Hint[]} */
		this.hints = hints.length ? hints : [hints];
	}
}

class Category {
	static ANIME = "Anime";
	static ASTROLOGY = "Astrology";
	static ASTRONOMY = "Astronomy";
	static BIOLOGY = "Biology";
	static CHEMISTRY = "Chemistry";
	static COLOR = "Color";
	static ENGLISH = "English";
	static FOOD = "Food";
	static GEOGRAPHY = "Geography";
	static GEOLOGY = "Geology";
	static HISTORY = "History";
	static LANGUAGE = "Language";
	static MEASUREMENT = "Measurement";
	static MEDICINE = "Medicine";
	static MINEROLOGY = "Minerology";
	static MISC = "Miscellaneous";
	static MUSIC = "Music";
	static FILM = "Film";
	static PHYSICS = "Physics";
	static RELIGION = "Religion";
	static TRANSPORT = "Transport";
	static VIDEOGAME = "Video games";
	static ZOOLOGY = "Zoology";
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
		this.hint = hint_index < 0 ? this.word.hints[Math.floor(Math.random() * this.word.hints.length)] : this.word.hints[hint_index];
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
		cell.id = `letter${cellId}`;
		cell.classList.add('letter');
		cell.classList.add(`direction${direction}`);
		cell.onclick = () => HONEYCOMB.letterNodes.select(cellId);
		cell.setAttribute('answer', this.getLetter(direction));
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
			- all 6-letter countries (excl. Israel Kuwait Monaco)
			- all 6-letter elements (excl. Cerium and Erbium)
			- all 6-letter minecraft mobs (excl. new ones)
			- partial: all 6-letter https://en.wikipedia.org/wiki/Planetary_nomenclature
			- partial: https://en.wikipedia.org/wiki/List_of_animal_names
		*/
		new Word("adverb", new Hint("can modify adjectives and verbs", Category.ENGLISH)),
		new Word("aether", [
			new Hint("common 19th century anaesthetic", Category.MEDICINE),
			new Hint("the luminiferous variety was said to carry light", Category.PHYSICS),
			new Hint("in a certain Minecraft mod, the opposite of the nether", Category.VIDEOGAME),
		]),
		new Word("albedo", [
			new Hint("an object's brightness", Category.ASTRONOMY),
			new Hint("overseer of the guardians of Nazarick", Category.ANIME),
		]),
		new Word("ampere", new Hint("SI unit of current", Category.MEASUREMENT)),
		new Word("angola", new Hint("its capital, Luanda", Category.GEOGRAPHY)),
		new Word("ankara", new Hint("capital of Turkey", Category.GEOGRAPHY)),
		new Word("antlia", new Hint("air pump constellation", Category.ASTRONOMY)),
		new Word("aquila", new Hint("eagle constellation", Category.ASTRONOMY)),
		new Word("astana", new Hint("capital of Kazakhstan", Category.GEOGRAPHY)),
		new Word("auriga", new Hint("charioteer constellation", Category.ASTRONOMY)),
		new Word("barium", new Hint("in pure form, this element is a common radiocontrast agent", Category.CHEMISTRY)),
		new Word("basalt", new Hint("dark extrusive igneous rock", Category.GEOLOGY)),
		new Word("beaver", new Hint("dam-building rodent", Category.ZOOLOGY)),
		new Word("belize", new Hint("its capital, Belmopan", Category.GEOGRAPHY)),
		new Word("bhutan", new Hint("its capital, Thimphu", Category.GEOGRAPHY)),
		new Word("biotic", new Hint("of biological origin", Category.ENGLISH)),
		new Word("bootes", new Hint("herdsman constellation", Category.ASTRONOMY)),
		new Word("bovine", new Hint("of cattle", Category.ZOOLOGY)),
		new Word("brazil", new Hint("its capital, Brasília", Category.GEOGRAPHY)),
		new Word("bronze", new Hint("copper-tin alloy", Category.CHEMISTRY)),
		new Word("brunei", new Hint("its capital, Bandar Seri Begawan", Category.GEOGRAPHY)),
		new Word("caelum", new Hint("chisel constellation", Category.ASTRONOMY)),
		new Word("canada", [
			new Hint("its capital, Ottawa", Category.GEOGRAPHY),
			new Hint("maple leaf flag", Category.GEOGRAPHY),
		]),
		new Word("cancer", new Hint("crab sign", Category.ASTROLOGY)),
		new Word("canine", new Hint("of dogs", Category.ZOOLOGY)),
		new Word("carbon", new Hint("main element of coal", Category.CHEMISTRY)),
		new Word("carina", new Hint("keel constellation", Category.ASTRONOMY)),
		new Word("catena", new Hint("chain of craters", Category.ASTRONOMY)),
		new Word("cattle", new Hint("a cow or ox", Category.ZOOLOGY)),
		new Word("cobble", new Hint("rock, between a pebble and boulder in size", Category.GEOLOGY)),
		new Word("iodine", new Hint("second-defining element", Category.CHEMISTRY)),
		new Word("chasma", new Hint("deep, elongated, steep-sided depression", Category.ASTRONOMY)),
		new Word("cobalt", new Hint("metal used in blue pigments", Category.CHEMISTRY)),
		new Word("collis", new Hint("small hill", Category.ASTRONOMY)),
		new Word("copper", new Hint("primary constituent of brass and bronze", Category.CHEMISTRY)),
		new Word("corona", [
			new Hint("outer stellar atmosphere", Category.ASTRONOMY),
			new Hint("Mexican beer", Category.MISC),
			new Hint("slang: disease which caused a pandemic in 2020", Category.MEDICINE),
		]),
		new Word("corvus", new Hint("crow constellation", Category.ASTRONOMY)),
		new Word("crater", [
			new Hint("cup constellation", Category.ASTRONOMY),
			new Hint("circular depression, usually due to an impact", Category.ASTRONOMY),
		]),
		new Word("craton", new Hint("part of a continental plate", Category.GEOLOGY)),
		new Word("curium", new Hint("actinide alpha source", Category.CHEMISTRY)),
		new Word("cygnus", new Hint("swan constellation", Category.ASTRONOMY)),
		new Word("cyprus", new Hint("its capital, Nicosia", Category.GEOGRAPHY)),
		new Word("dacite", new Hint("one type of felsic rock", Category.GEOLOGY)),
		new Word("dalton", new Hint("atomic mass unit", Category.MEASUREMENT)),
		new Word("degree", new Hint("1/360 of a circle", Category.MEASUREMENT)),
		new Word("desert", new Hint("biome with little precipitation", Category.GEOGRAPHY)),
		new Word("donkey", [
			new Hint("Shrek's partner", Category.FILM),
			new Hint("presumably, a large burrito", Category.SPANISH),
			new Hint("rideable Minecraft mob", Category.VIDEOGAME),
		]),
		new Word("dorado", [
			new Hint("mahi-mahi constellation", Category.ASTRONOMY),
			new Hint("mythical golden city (second word)", Category.HISTORY),
		]),
		new Word("equine", new Hint("of horses", Category.ZOOLOGY)),
		new Word("eroded", new Hint("worn away", Category.GEOLOGY)),
		new Word("euboea", new Hint("large island off Boeotia", Category.GEOGRAPHY)),
		new Word("falcon", [
			new Hint("bird of prey, eg. peregrine", Category.ZOOLOGY),
			new Hint("millennium or maltese", Category.FILM),
			new Hint("SpaceX launch vehicle", Category.TRANSPORT),
		]),
		new Word("feline", new Hint("of cats", Category.ZOOLOGY)),
		new Word("felsic", new Hint("of silicate-rich igneous", Category.GEOLOGY)),
		new Word("ferret", [
			new Hint("beastly synonym of uncover", Category.ENGLISH),
			new Hint("domesticated polecat", Category.ZOOLOGY),
		]),
		new Word("fornax", new Hint("furnace constellation", Category.ASTRONOMY)),
		new Word("fossil", new Hint("mineralized organism remains", Category.GEOLOGY)),
		new Word("france", [
			new Hint("country with the most francophones", Category.GEOGRAPHY),
			new Hint("its capital, Paris", Category.GEOGRAPHY),
		]),
		new Word("gambia", new Hint("its capital, Banjul", Category.GEOGRAPHY)),
		new Word("garnet", new Hint("red gem", Category.MINEROLOGY)),
		new Word("gemini", new Hint("twin sign", Category.ASTROLOGY)),
		new Word("gothic", [
			new Hint("2001 RPG", Category.VIDEOGAME),
			new Hint("of the east Germanic conquerers of Rome", Category.HISTORY),
			new Hint("sans-serif, in other words", Category.MISC),
		]),
		new Word("graben", new Hint("depressed block of crust bordered by parallel faults", Category.GEOLOGY)),
		new Word("greece", new Hint("its capital, Athens", Category.GEOGRAPHY)),
		new Word("grouse", new Hint("landfowl, eg. ruffed, spruce, sooty", Category.ZOOLOGY)),
		new Word("guinea", [
			new Hint("a coin, worth twenty shillings", Category.HISTORY),
			new Hint("its capital, Conakry", Category.GEOGRAPHY),
			new Hint("most linguistically diverse island, (second word)", Category.LANGUAGE),
			new Hint("preceding fowl and pig", Category.ZOOLOGY),
		]),
		new Word("guyana", new Hint("its capital, Georgetown", Category.GEOGRAPHY)),
		new Word("helium", new Hint("element discovered in the sun", Category.CHEMISTRY)),
		new Word("hawaii", [
			new Hint("American state surrounded entirely by ocean", Category.GEOGRAPHY),
			new Hint("Pacific kingdom invaded by the United States", Category.HISTORY),
		]),
		new Word("hornet", [
			new Hint("large wasp", Category.ZOOLOGY),
			new Hint("beastly name of the F-18", Category.TRANSPORT),
		]),
		new Word("horses", [
			new Hint("1988 Q Lazzarus song (second word)", Category.MUSIC),
			new Hint("stallions or mares", Category.ZOOLOGY),
		]),
		new Word("hydrus", new Hint("lesser water snake constellation", Category.ASTRONOMY)),
		new Word("indium", new Hint("element named for its bluish-purple spectral line", Category.CHEMISTRY)),
		new Word("iodine", new Hint("heaviest dietary element", Category.CHEMISTRY)),
		new Word("itself", new Hint("third person singular neuter reflexive", Category.ENGLISH)),
		new Word("jordan", new Hint("its capital, Amman", Category.GEOGRAPHY)),
		new Word("kelvin", new Hint("SI unit of temperature", Category.MEASUREMENT)),
		new Word("kidney", new Hint("blood filtration organ", Category.MEDICINE)),
		new Word("latvia", new Hint("its capital, Riga", Category.GEOGRAPHY)),
		new Word("lazuli", [
			new Hint("blue stone (second word)", Category.MINEROLOGY),
			new Hint("Minecraft ore used to enchant (second word)", Category.VIDEOGAME),
		]),
		new Word("lesbos", new Hint("island of Sappho", Category.GEOGRAPHY)),
		new Word("lizard", new Hint("common quadrupedal reptile", Category.ZOOLOGY)),
		new Word("locust", [
			new Hint("swarming grasshopper", Category.ZOOLOGY),
			new Hint("one of three plagues sent to Egypt", Category.RELIGION),
		]),
		new Word("luster", new Hint("how light interacts with a rock surface", Category.GEOLOGY)),
		new Word("mantle", new Hint("layer between the crust and core", Category.GEOLOGY)),
		new Word("marble", new Hint("white metamorphic rock", Category.GEOLOGY)),
		new Word("mexico", new Hint("most populous Spanish-speaking country", Category.GEOGRAPHY)),
		new Word("minute", new Hint("sixty seconds", Category.MEASUREMENT)),
		new Word("myself", new Hint("first person singular reflexive", Category.ENGLISH)),
		new Word("newton", new Hint("SI unit of force", Category.MEASUREMENT)),
		new Word("nickel", new Hint("most common impurity in meteoric iron", Category.CHEMISTRY)),
		new Word("norway", new Hint("its capital, Oslo", Category.GEOGRAPHY)),
		new Word("octans", new Hint("octant constellation", Category.ASTRONOMY)),
		new Word("orange", [
			new Hint("reddish yellow", Category.COLOR),
			new Hint("word said to have no rhymes", Category.ENGLISH),
			new Hint("citrus, eg. mandarin", Category.FOOD),
		]),
		new Word("oxygen", new Hint("second most abundant element in Earth's atmosphere", Category.CHEMISTRY)),
		new Word("parrot", [
			new Hint("imitative bird", Category.ZOOLOGY),
			new Hint("Minecraft mob, dies to cookies", Category.VIDEOGAME),
		]),
		new Word("pascal", new Hint("SI unit of pressure", Category.MEASUREMENT)),
		new Word("pebble", new Hint("rock, smaller than cobble", Category.GEOLOGY)),
		new Word("pictor", new Hint("painter constellation", Category.ASTRONOMY)),
		new Word("pisces", new Hint("fish sign", Category.ASTROLOGY)),
		new Word("pluton", new Hint("igneous intrusion", Category.GEOLOGY)),
		new Word("poland", [
			new Hint("its capital, Warsaw", Category.GEOGRAPHY),
			new Hint("its invasion brought about a world war", Category.HISTORY),
		]),
		new Word("pulley", new Hint("simple machine", Category.PHYSICS)),
		new Word("puppis", new Hint("poop deck constellation", Category.ASTRONOMY)),
		new Word("purple", [
			new Hint("reddish blue", Category.COLOR),
			new Hint("royal color", Category.HISTORY),
		]),
		new Word("quakes", new Hint("tremors of the crust, in short", Category.GEOLOGY)),
		new Word("quartz", new Hint("silica mineral", Category.MINEROLOGY)),
		new Word("rabbit", new Hint("small hopping mammal", Category.ZOOLOGY)),
		new Word("radian", new Hint("SI unit of angle", Category.MEASUREMENT)),
		new Word("radium", new Hint("radioactive alkaline earth metal", Category.CHEMISTRY)),
		new Word("rhodes", new Hint("Greek island known for its Colossus", Category.GEOGRAPHY)),
		new Word("russia", [
			new Hint("its capital, Moscow", Category.GEOGRAPHY),
			new Hint("invaded Ukraine in 2014 and 2022", Category.HISTORY),
		]),
		new Word("rwanda", new Hint("its capital, Kigali", Category.GEOGRAPHY)),
		new Word("salmon", [
			new Hint("fish used to make lox", Category.FOOD),
			new Hint("Minecraft mob, one of four fish", Category.VIDEOGAME),
		]),
		new Word("saturn", [
			new Hint("greatly ringed giant", Category.ASTRONOMY),
			new Hint("greater malefic", Category.ASTROLOGY),
			new Hint("to Holst, the bringer of old age", Category.MUSIC),
			new Hint("Roman god of agriculture and wealth", Category.RELIGION),
			new Hint("father of Jupiter", Category.RELIGION),
			new Hint("Sega console", Category.VIDEOGAME),
			new Hint("rocket family which first brought humans to the moon", Category.TRANSPORT),
		]),
		new Word("scutum", new Hint("shield constellation", Category.ASTRONOMY)),
		new Word("second", new Hint("SI unit of time", Category.MEASUREMENT)),
		new Word("serbia", [
			new Hint("its capital, Belgrade", Category.GEOGRAPHY),
			new Hint("its invasion brought about a world war", Category.HISTORY),
		]),
		new Word("shield", new Hint("exposed precambrian rock", Category.GEOLOGY)),
		new Word("sicily", new Hint("largest Mediterranean island", Category.GEOGRAPHY)),
		new Word("silver", new Hint("common coinage metal", Category.CHEMISTRY)),
		new Word("sodium", new Hint("secondary constituent of table salt", Category.CHEMISTRY)),
		new Word("spider", [
			new Hint("common eight-legged critter", Category.ZOOLOGY),
			new Hint("Minecraft string source", Category.VIDEOGAME),
		]),
		new Word("sulfur", new Hint("element said to smell of egg", Category.CHEMISTRY)),
		new Word("sweden", new Hint("its capital, Stockholm", Category.GEOGRAPHY)),
		new Word("switch", [
			new Hint("tops and bottoms", Category.MISC),
			new Hint("Nintendo console", Category.VIDEOGAME),
		]),
		new Word("taurus", new Hint("bull sign", Category.ASTROLOGY)),
		new Word("tephra", new Hint("volcanic ejecta", Category.GEOLOGY)),
		new Word("tongue", new Hint("organ of taste and language", Category.MEDICINE)),
		new Word("tucana", new Hint("toucan constellation", Category.ASTRONOMY)),
		new Word("tundra", new Hint("arctic biome", Category.GEOGRAPHY)),
		new Word("turkey", [
			new Hint("american landfowl", Category.ZOOLOGY),
			new Hint("its capital, Ankara", Category.GEOGRAPHY),
		]),
		new Word("turtle", new Hint("shelled reptile", Category.ZOOLOGY)),
		new Word("tuvalu", new Hint("its capital, Funafuti", Category.GEOGRAPHY)),
		new Word("uganda", new Hint("its capital, Kampala", Category.GEOGRAPHY)),
		new Word("uranus", [
			new Hint("greatly tilted giant", Category.ASTRONOMY),
			new Hint("to Holst, the magician", Category.MUSIC),
			new Hint("Greek god of the sky", Category.RELIGION),
			new Hint("father of the Titans", Category.RELIGION),
		]),
		new Word("volans", new Hint("flying fish constellation", Category.ASTRONOMY)),
		new Word("weight", new Hint("downward force", Category.PHYSICS)),
		new Word("zambia", new Hint("its capital, Lusaka", Category.GEOGRAPHY)),
		new Word("zombie", [
			new Hint("horror staple monster", Category.FILM),
			new Hint("second mob added to Minecraft", Category.VIDEOGAME),
		]),
		new Word("zircon", new Hint("key mineral of geochronology", Category.GEOLOGY)),
	],
	/** @type {Clue[]} */
	clues: new Array(7).fill(undefined),
	letterNodes: {
		get hex(){
			return this.selected % 5;
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
		elemSelected(){
			return this.elem(this.selected);
		},
		select(n = 0){
			this.elemSelected().classList.remove('selected');
			this.selected = n;
			this.elemSelected().classList.add('selected');
		},
		setLetter(char = ''){
			this.elemSelected().innerHTML = this.letters[this.selected] = char;
		},
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
		// prepare keyboard controls
		document.body.onkeydown = ev => {
			console.debug(`keypress`, ev);
			switch (ev.key) {
				case 'Backspace':
					HONEYCOMB.letterNodes.backspace();
					break;
				case 'Space':
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
	},
	new(){
		this.clear();
		let dictionary = this.words.map(w => w);
		// first, choose the mystery word for the center
		const WORD0 = this.randomWordMatching(dictionary);
		dictionary.splice(dictionary.indexOf(WORD0), 1);
		const WORD0_START = 0; // always
		/** @type {Clue} */
		const CLUE0 = new Clue(WORD0, WORD0_START);
		const USED_CATEGORIES = [CLUE0.hint.category];
		// console.debug(CLUE0);
		// next, choose the word above
		let re = new RegExp(`${CLUE0.getLetter(Direction.UP)}`);
		const WORD1 = this.randomWordMatching(dictionary, w => re.test(w.word), USED_CATEGORIES);
		dictionary.splice(dictionary.indexOf(WORD1), 1);
		const WORD1_START = (9-re.exec(WORD1.word).index) % 6;
		// choose a hint w/ a category that is NOT in USED_CATEGORIES
		let hint_id = WORD1.hints.findIndex(h => !USED_CATEGORIES.includes(h.category));
		const CLUE1 = new Clue(WORD1, WORD1_START, hint_id);
		USED_CATEGORIES.push(CLUE1.hint.category);
		// console.debug(CLUE1, WORD0.word[WORD0_START]);
		// next, choose the word above-left
		re = new RegExp(`${CLUE1.getLetter(Direction.DL)}${CLUE0.getLetter(Direction.UL)}`);
		const WORD6 = this.randomWordMatching(dictionary, w => re.test(w.word), USED_CATEGORIES);
		dictionary.splice(dictionary.indexOf(WORD6), 1);
		const WORD6_START = (7-re.exec(WORD6.word).index) % 6;
		hint_id = WORD6.hints.findIndex(h => !USED_CATEGORIES.includes(h.category));
		const CLUE6 = new Clue(WORD6, WORD6_START, hint_id);
		USED_CATEGORIES.push(CLUE6.hint.category);
		// console.debug(CLUE2, WORD0.word[(WORD0_START + 5) % 6]);
		// next, choose the word above-right
		re = new RegExp(`${CLUE0.getLetter(Direction.UR)}${CLUE1.getLetter(Direction.DR)}`);
		const WORD2 = this.randomWordMatching(dictionary, w => re.test(w.word), USED_CATEGORIES);
		dictionary.splice(dictionary.indexOf(WORD2), 1);
		const WORD2_START = (10-re.exec(WORD2.word).index) % 6;
		hint_id = WORD2.hints.findIndex(h => !USED_CATEGORIES.includes(h.category));
		const CLUE2 = new Clue(WORD2, WORD2_START, hint_id);
		USED_CATEGORIES.push(CLUE2.hint.category);
		// console.debug(CLUE3, WORD0.word[(WORD0_START + 1) % 6]);
		// next, choose the word down-left
		re = new RegExp(`${CLUE6.getLetter(Direction.DN)}${CLUE0.getLetter(Direction.DL)}`);
		const WORD5 = this.randomWordMatching(dictionary, w => re.test(w.word), USED_CATEGORIES);
		dictionary.splice(dictionary.indexOf(WORD5), 1);
		const WORD5_START = (6-re.exec(WORD5.word).index) % 6;
		hint_id = WORD5.hints.findIndex(h => !USED_CATEGORIES.includes(h.category));
		const CLUE5 = new Clue(WORD5, WORD5_START, hint_id);
		USED_CATEGORIES.push(CLUE5.hint.category);
		// console.debug(CLUE4, WORD0.word[(WORD0_START + 4) % 6]);
		// next, choose the word down-right
		re = new RegExp(`${CLUE0.getLetter(Direction.DR)}${CLUE2.getLetter(Direction.DN)}`);
		const WORD3 = this.randomWordMatching(dictionary, w => re.test(w.word), USED_CATEGORIES);
		dictionary.splice(dictionary.indexOf(WORD3), 1);
		const WORD3_START = (11-re.exec(WORD3.word).index) % 6;
		hint_id = WORD3.hints.findIndex(h => !USED_CATEGORIES.includes(h.category));
		const CLUE3 = new Clue(WORD3, WORD3_START, hint_id);
		USED_CATEGORIES.push(CLUE3.hint.category);
		// console.debug(CLUE5, WORD0.word[(WORD0_START + 2) % 6]);
		// next, choose the word down
		re = new RegExp(`${CLUE5.getLetter(Direction.DR)}${CLUE0.getLetter(Direction.DN)}${CLUE3.getLetter(Direction.DL)}`);
		const WORD4 = this.randomWordMatching(dictionary, w => re.test(w.word), USED_CATEGORIES);
		dictionary.splice(dictionary.indexOf(WORD4), 1);
		const WORD4_START = (5-re.exec(WORD4.word).index) % 6;
		hint_id = WORD4.hints.findIndex(h => !USED_CATEGORIES.includes(h.category));
		const CLUE4 = new Clue(WORD4, WORD4_START, hint_id);
		USED_CATEGORIES.push(CLUE4.hint.category);
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
		for (let i = 0; i < 100000; i++){
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
	randomWordMatching(dictionary, filter = () => true, used_categories = []){
		const matches = dictionary.filter(filter);
		if (matches.length < 1) console.warn('no matches'); 
		const catmatches = matches.filter(w => w.hints.some(h => !used_categories.includes(h.category)));
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