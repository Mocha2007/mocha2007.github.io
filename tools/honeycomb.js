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
	static MUSIC = "music";
	static FILM = "film";
	static RELIGION = "religion";
	static TRANSPORT = "transport";
	static ZOOLOGY = "zoology";
}

class Direction {
	static UP = 0;
	static UL = 1;
	static UR = 2;
	static DL = 3;
	static DR = 4;
	static DN = 5;
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
		return e;
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
		new Word("antlia", new Hint("air pump constellation", Category.ASTRONOMY)),
		new Word("aquila", new Hint("eagle constellation", Category.ASTRONOMY)),
		new Word("astana", new Hint("capital of Turkey", Category.GEOGRAPHY)),
		new Word("auriga", new Hint("charioteer constellation", Category.ASTRONOMY)),
		new Word("bootes", new Hint("herdsman constellation", Category.ASTRONOMY)),
		new Word("caelum", new Hint("chisel constellation", Category.ASTRONOMY)),
		new Word("canada", new Hint("maple leaf flag", Category.GEOGRAPHY)),
		new Word("cancer", new Hint("crab sign", Category.ASTROLOGY)),
		new Word("carina", new Hint("keel constellation", Category.ASTRONOMY)),
		new Word("corvus", new Hint("crow constellation", Category.ASTRONOMY)),
		new Word("crater", new Hint("cup constellation", Category.ASTRONOMY)),
		new Word("cygnus", new Hint("swan constellation", Category.ASTRONOMY)),
		new Word("dorado", new Hint("mahi-mahi constellation", Category.ASTRONOMY)),
		new Word("falcon", [
			new Hint("bird of prey, eg. peregrine", Category.ZOOLOGY),
			new Hint("millennium or maltese", Category.FILM),
			new Hint("SpaceX launch vehicle", Category.TRANSPORT),
		]),
		new Word("fornax", new Hint("furnace constellation", Category.ASTRONOMY)),
		new Word("france", [
			new Hint("country with the most francophones", Category.GEOGRAPHY),
			new Hint("its capital, Paris", Category.GEOGRAPHY),
		]),
		new Word("gemini", new Hint("twin sign", Category.ASTROLOGY)),
		new Word("hydrus", new Hint("lesser water snake constellation", Category.ASTRONOMY)),
		new Word("itself", new Hint("third person singular neuter reflexive", Category.ENGLISH)),
		new Word("mexico", new Hint("most populous Spanish-speaking country", Category.GEOGRAPHY)),
		new Word("octans", new Hint("octant constellation", Category.ASTRONOMY)),
		new Word("pictor", new Hint("painter constellation", Category.ASTRONOMY)),
		new Word("pisces", new Hint("fish sign", Category.ASTROLOGY)),
		new Word("puppis", new Hint("poop deck constellation", Category.ASTRONOMY)),
		new Word("saturn", [
			new Hint("greatly ringed giant", Category.ASTRONOMY),
			new Hint("greater malefic", Category.ASTROLOGY),
			new Hint("to Holst, the bringer of old age", Category.MUSIC),
			new Hint("Roman god of agriculture and wealth", Category.RELIGION),
			new Hint("father of Jupiter", Category.RELIGION),
		]),
		new Word("scutum", new Hint("shield constellation", Category.ASTRONOMY)),
		new Word("taurus", new Hint("bull sign", Category.ASTROLOGY)),
		new Word("tucana", new Hint("toucan constellation", Category.ASTRONOMY)),
		new Word("turkey", [
			new Hint("american landfowl", Category.ZOOLOGY),
			new Hint("its capital, Astana", Category.GEOGRAPHY),
		]),
		new Word("uranus", [
			new Hint("greatly tilted giant", Category.ASTRONOMY),
			new Hint("to Holst, the magician", Category.MUSIC),
			new Hint("Greek god of the sky", Category.RELIGION),
			new Hint("father of the Titans", Category.RELIGION),
		]),
		new Word("volans", new Hint("flying fish constellation", Category.ASTRONOMY)),
	],
	clear(){
		document.body.innerHTML = '';
	},
	init(){
		this.new_wrapper();
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
		console.debug(CLUE0);
		// next, choose the word above
		const WORD1 = this.randomWordMatching(dictionary, w => w.word.includes(CLUE0.getLetter(Direction.UP)));
		dictionary.splice(dictionary.indexOf(WORD1), 1);
		const WORD1_START = (9-WORD1.word.indexOf(CLUE0.getLetter(Direction.UP))) % 6;
		const CLUE1 = new Clue(WORD1, WORD1_START);
		console.debug(CLUE1, WORD0.word[WORD0_START]);
		// next, choose the word above-left
		const WORD2 = this.randomWordMatching(dictionary, w => new RegExp(`${CLUE1.getLetter(Direction.DL)}${CLUE0.getLetter(Direction.UL)}`).test(w.word));
		dictionary.splice(dictionary.indexOf(WORD2), 1);
		const WORD2_START = (8-WORD1.word.indexOf(CLUE0.getLetter(Direction.UL))) % 6;
		const CLUE2 = new Clue(WORD2, WORD2_START);
		console.debug(CLUE2, WORD0.word[(WORD0_START + 5) % 6]);
		// create elements
		document.body.appendChild(CLUE1.createElement(1));
		document.body.appendChild(CLUE2.createElement(2));
		document.body.appendChild(CLUE0.createElement(0));
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
	2		3
		0
	4		5
		6
	which means I'll need 30 slots total for the letters...
*/