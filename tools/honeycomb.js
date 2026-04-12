class Hint {
	constructor(hint, category, img = ''){
		/** @type {string} */
		this.hint = hint;
		/** @type {Category} */
		this.category = category;
		/** @type {string} */
		this.img = img; // todo
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
	static ASTROLOGY = "astrology";
	static ASTRONOMY = "astronomy";
	static ENGLISH = "english";
	static GEOGRAPHY = "geography";
	static MISC = "miscellaneous";
	static MUSIC = "music";
	static FILM = "film";
	static RELIGION = "religion";
	static TRANSPORT = "transport";
	static ZOOLOGY = "zoology";
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
	constructor(word, start_index = 0){
		/** @type {Word} */
		this.word = word;
		/** @type {number} */
		this.start_index = start_index;
	}
	createElement(id){
		const e = document.createElement('div');
		e.classList.add('hex');
		e.id = `hex${id}`;
		e.innerHTML = this.word.word;
		// todo: if id is 1-6, we need to create 4 of 6 letter spaces
		// else, if id is 0, we need to create all 6...
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
			case Direction.UL:
				return this.word.word[(11 - this.start_index) % 6];
			case Direction.DL:
				return this.word.word[(10 - this.start_index) % 6];
			case Direction.DN:
				return this.word.word[(9 - this.start_index) % 6];
			case Direction.DR:
				return this.word.word[(8 - this.start_index) % 6];
			case Direction.UR:
				return this.word.word[(7 - this.start_index) % 6];
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
			- todo: https://en.wikipedia.org/wiki/List_of_animal_names
		*/
		new Word("adverb", new Hint("can modify adjectives and verbs", Category.ENGLISH)),
		new Word("aether", new Hint("the luminiferous variety was said to carry light", Category.MISC)),
		new Word("angola", new Hint("its capital, Luanda", Category.GEOGRAPHY)),
		new Word("ankara", new Hint("capital of Turkey", Category.GEOGRAPHY)),
		new Word("antlia", new Hint("air pump constellation", Category.ASTRONOMY)),
		new Word("aquila", new Hint("eagle constellation", Category.ASTRONOMY)),
		new Word("astana", new Hint("capital of Kazakhstan", Category.GEOGRAPHY)),
		new Word("auriga", new Hint("charioteer constellation", Category.ASTRONOMY)),
		new Word("beaver", new Hint("dam-building rodent", Category.ZOOLOGY)),
		new Word("belize", new Hint("its capital, Belmopan", Category.GEOGRAPHY)),
		new Word("bhutan", new Hint("its capital, Thimphu", Category.GEOGRAPHY)),
		new Word("bootes", new Hint("herdsman constellation", Category.ASTRONOMY)),
		new Word("bovine", new Hint("of cattle", Category.ZOOLOGY)),
		new Word("brazil", new Hint("its capital, Brasília", Category.GEOGRAPHY)),
		new Word("brunei", new Hint("its capital, Bandar Seri Begawan", Category.GEOGRAPHY)),
		new Word("caelum", new Hint("chisel constellation", Category.ASTRONOMY)),
		new Word("canada", [
			new Hint("its capital, Ottawa", Category.GEOGRAPHY),
			new Hint("maple leaf flag", Category.GEOGRAPHY),
		]),
		new Word("cancer", new Hint("crab sign", Category.ASTROLOGY)),
		new Word("canine", new Hint("of dogs", Category.ZOOLOGY)),
		new Word("cattle", new Hint("a cow or ox", Category.ZOOLOGY)),
		new Word("carina", new Hint("keel constellation", Category.ASTRONOMY)),
		new Word("corvus", new Hint("crow constellation", Category.ASTRONOMY)),
		new Word("crater", new Hint("cup constellation", Category.ASTRONOMY)),
		new Word("cygnus", new Hint("swan constellation", Category.ASTRONOMY)),
		new Word("cyprus", new Hint("its capital, Nicosia", Category.GEOGRAPHY)),
		new Word("donkey", [
			new Hint("Shrek's partner", Category.FILM),
			new Hint("presumably, a large burrito", Category.SPANISH),
		]),
		new Word("dorado", new Hint("mahi-mahi constellation", Category.ASTRONOMY)),
		new Word("equine", new Hint("of horses", Category.ZOOLOGY)),
		new Word("euboea", new Hint("large island off Boeotia", Category.GEOGRAPHY)),
		new Word("falcon", [
			new Hint("bird of prey, eg. peregrine", Category.ZOOLOGY),
			new Hint("millennium or maltese", Category.FILM),
			new Hint("SpaceX launch vehicle", Category.TRANSPORT),
		]),
		new Word("feline", new Hint("of cats", Category.ZOOLOGY)),
		new Word("ferret", new Hint("domesticated polecat", Category.ZOOLOGY)),
		new Word("fornax", new Hint("furnace constellation", Category.ASTRONOMY)),
		new Word("france", [
			new Hint("country with the most francophones", Category.GEOGRAPHY),
			new Hint("its capital, Paris", Category.GEOGRAPHY),
		]),
		new Word("gambia", new Hint("its capital, Banjul", Category.GEOGRAPHY)),
		new Word("gemini", new Hint("twin sign", Category.ASTROLOGY)),
		new Word("greece", new Hint("its capital, Athens", Category.GEOGRAPHY)),
		new Word("grouse", new Hint("landfowl, eg. ruffed, spruce, sooty", Category.ZOOLOGY)),
		new Word("guinea", new Hint("its capital, Conakry", Category.GEOGRAPHY)),
		new Word("guyana", new Hint("its capital, Georgetown", Category.GEOGRAPHY)),
		new Word("hawaii", new Hint("Pacific kingdom invaded by the United States", Category.GEOGRAPHY)),
		new Word("hornet", new Hint("large wasp", Category.ZOOLOGY)),
		new Word("horses", new Hint("stallions or mares", Category.ZOOLOGY)),
		new Word("hydrus", new Hint("lesser water snake constellation", Category.ASTRONOMY)),
		new Word("itself", new Hint("third person singular neuter reflexive", Category.ENGLISH)),
		new Word("jordan", new Hint("its capital, Amman", Category.GEOGRAPHY)),
		new Word("latvia", new Hint("its capital, Riga", Category.GEOGRAPHY)),
		new Word("lesbos", new Hint("island of Sappho", Category.GEOGRAPHY)),
		new Word("lizard", new Hint("common quadrupedal reptile", Category.ZOOLOGY)),
		new Word("locust", new Hint("swarming grasshopper", Category.ZOOLOGY)),
		new Word("mexico", new Hint("most populous Spanish-speaking country", Category.GEOGRAPHY)),
		new Word("myself", new Hint("first person singular reflexive", Category.ENGLISH)),
		new Word("norway", new Hint("its capital, Oslo", Category.GEOGRAPHY)),
		new Word("octans", new Hint("octant constellation", Category.ASTRONOMY)),
		new Word("pictor", new Hint("painter constellation", Category.ASTRONOMY)),
		new Word("pisces", new Hint("fish sign", Category.ASTROLOGY)),
		new Word("poland", new Hint("its capital, Warsaw", Category.GEOGRAPHY)),
		new Word("puppis", new Hint("poop deck constellation", Category.ASTRONOMY)),
		new Word("rabbit", new Hint("small hopping mammal", Category.ZOOLOGY)),
		new Word("rhodes", new Hint("Greek island known for its Colossus", Category.GEOGRAPHY)),
		new Word("russia", new Hint("its capital, Moscow", Category.GEOGRAPHY)),
		new Word("rwanda", new Hint("its capital, Kigali", Category.GEOGRAPHY)),
		new Word("saturn", [
			new Hint("greatly ringed giant", Category.ASTRONOMY),
			new Hint("greater malefic", Category.ASTROLOGY),
			new Hint("to Holst, the bringer of old age", Category.MUSIC),
			new Hint("Roman god of agriculture and wealth", Category.RELIGION),
			new Hint("father of Jupiter", Category.RELIGION),
		]),
		new Word("scutum", new Hint("shield constellation", Category.ASTRONOMY)),
		new Word("serbia", new Hint("its capital, Belgrade", Category.GEOGRAPHY)),
		new Word("sicily", new Hint("largest Mediterranean island", Category.GEOGRAPHY)),
		new Word("sweden", new Hint("its capital, Stockholm", Category.GEOGRAPHY)),
		new Word("taurus", new Hint("bull sign", Category.ASTROLOGY)),
		new Word("tucana", new Hint("toucan constellation", Category.ASTRONOMY)),
		new Word("turkey", [
			new Hint("american landfowl", Category.ZOOLOGY),
			new Hint("its capital, Ankara", Category.GEOGRAPHY),
		]),
		new Word("tuvalu", new Hint("its capital, Funafuti", Category.GEOGRAPHY)),
		new Word("uganda", new Hint("its capital, Kampala", Category.GEOGRAPHY)),
		new Word("uranus", [
			new Hint("greatly tilted giant", Category.ASTRONOMY),
			new Hint("to Holst, the magician", Category.MUSIC),
			new Hint("Greek god of the sky", Category.RELIGION),
			new Hint("father of the Titans", Category.RELIGION),
		]),
		new Word("volans", new Hint("flying fish constellation", Category.ASTRONOMY)),
		new Word("zambia", new Hint("its capital, Lusaka", Category.GEOGRAPHY)),
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
		// console.debug(CLUE0);
		// next, choose the word above
		const WORD1 = this.randomWordMatching(dictionary, w => w.word.includes(CLUE0.getLetter(Direction.UP)));
		dictionary.splice(dictionary.indexOf(WORD1), 1);
		const WORD1_START = (9-WORD1.word.indexOf(CLUE0.getLetter(Direction.UP))) % 6;
		const CLUE1 = new Clue(WORD1, WORD1_START);
		// console.debug(CLUE1, WORD0.word[WORD0_START]);
		// next, choose the word above-left
		const WORD6 = this.randomWordMatching(dictionary, w => new RegExp(`${CLUE1.getLetter(Direction.DL)}${CLUE0.getLetter(Direction.UL)}`).test(w.word));
		dictionary.splice(dictionary.indexOf(WORD6), 1);
		const WORD6_START = (8-WORD1.word.indexOf(CLUE0.getLetter(Direction.UL))) % 6;
		const CLUE6 = new Clue(WORD6, WORD6_START);
		// console.debug(CLUE2, WORD0.word[(WORD0_START + 5) % 6]);
		// next, choose the word above-right
		const WORD2 = this.randomWordMatching(dictionary, w => new RegExp(`${CLUE0.getLetter(Direction.UR)}${CLUE1.getLetter(Direction.DR)}`).test(w.word));
		dictionary.splice(dictionary.indexOf(WORD2), 1);
		const WORD2_START = (10-WORD1.word.indexOf(CLUE0.getLetter(Direction.UR))) % 6;
		const CLUE2 = new Clue(WORD2, WORD2_START);
		// console.debug(CLUE3, WORD0.word[(WORD0_START + 1) % 6]);
		// next, choose the word down-left
		const WORD5 = this.randomWordMatching(dictionary, w => new RegExp(`${CLUE6.getLetter(Direction.DN)}${CLUE0.getLetter(Direction.DL)}`).test(w.word));
		dictionary.splice(dictionary.indexOf(WORD5), 1);
		const WORD5_START = (7-WORD1.word.indexOf(CLUE0.getLetter(Direction.DL))) % 6;
		const CLUE5 = new Clue(WORD5, WORD5_START);
		// console.debug(CLUE4, WORD0.word[(WORD0_START + 4) % 6]);
		// next, choose the word down-right
		const WORD3 = this.randomWordMatching(dictionary, w => new RegExp(`${CLUE0.getLetter(Direction.DR)}${CLUE2.getLetter(Direction.DN)}`).test(w.word));
		dictionary.splice(dictionary.indexOf(WORD3), 1);
		const WORD3_START = (11-WORD1.word.indexOf(CLUE0.getLetter(Direction.DR))) % 6;
		const CLUE3 = new Clue(WORD3, WORD3_START);
		// console.debug(CLUE5, WORD0.word[(WORD0_START + 2) % 6]);
		// next, choose the word down
		const WORD4 = this.randomWordMatching(dictionary, w => new RegExp(`${CLUE5.getLetter(Direction.DR)}${CLUE0.getLetter(Direction.DN)}${CLUE3.getLetter(Direction.DL)}`).test(w.word));
		dictionary.splice(dictionary.indexOf(WORD4), 1);
		const WORD4_START = (6-WORD1.word.indexOf(CLUE0.getLetter(Direction.DR))) % 6;
		const CLUE4 = new Clue(WORD4, WORD4_START);
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
		let success = false;
		while (!success){
			try {
				this.new();
				success = true;
			}
			catch {
				// pass...
			}
		}
		this.initControls();
	},
	/** @returns {Word} */
	randomWordMatching(dictionary, filter = () => true){
		const matches = dictionary.filter(filter);
		if (matches.length < 1) console.warn('no matches'); 
		return matches[Math.floor(Math.random() * matches.length)];
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