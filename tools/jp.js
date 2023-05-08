/* exported jp */
/* global jpData, play, random */

class CheckObj {
	/** @param {string} name */
	constructor(name){
		this.name = name;
	}
	get checked(){
		return this.elem.checked;
	}
	get elem(){
		return jp.elem.checkbox(this.name) || jp.create.checkbox(this.name);
	}
}

class Category extends CheckObj {
	/** @param {string} name */
	constructor(name){
		super(name);
		Category.categories.push(this);
	}
	/** @param {string} s */
	static fromString(s){
		return this.categories.find(c => c.name === s) || new Category(s);
	}
}
/** @type {Category[]} */
Category.categories = [];

class Lemma {
	/**
	 * @param {string} lemma
	 * @param {string} reading
	 * @param {string} gloss
	 * @param {Category} cat
	 */
	constructor(lemma, reading, gloss, cat){
		this.lemma = lemma;
		this.reading = reading;
		this.gloss = gloss;
		this.cat = cat;
		this.wins = 0;
		this.losses = 0;
		Lemma.lemmas.push(this);
	}
	get yourScore(){
		const d = this.wins + this.losses;
		return d === 0 ? 'unseen' : `${Math.round(100 * this.wins / d)}%`;
	}
	/** @param {() => {}} onclick */
	enElem(onclick){
		// todo
		return jp.create.card(this.gloss, undefined, onclick);
	}
	/** @param {() => {}} onclick */
	jpElem(onclick){
		// todo
		return jp.create.card(this.lemma, this.reading, onclick);
	}
	lose(){
		play('https://www.myinstants.com/media/sounds/donald-trump-wrong-sound-effect.mp3');
		this.losses++;
		jp.test.next();
	}
	win(){
		play('https://www.myinstants.com/media/sounds/ding-sound-effect_1.mp3');
		this.wins++;
		jp.test.next();
	}
	static fromObject(o){
		const reading = o.reading || o.lemma;
		return new Lemma(o.lemma, reading, o.gloss, Category.fromString(o.cat));
	}
}
/** @type {Lemma[]} */
Lemma.lemmas = [];

class Chapter extends CheckObj {
	/**
	 * @param {string} name
	 * @param {Lemma[]} lemmas
	 */
	constructor(name, lemmas){
		super(name);
		this.lemmas = lemmas;
		Chapter.chapters.push(this);
	}
	static fromObject(o){
		return new Chapter(o.name, o.lemmas.map(o_ => Lemma.fromObject(o_)));
	}
}
/** @type {Chapter[]} */
Chapter.chapters = [];

const jp = {
	acceptable: {
		get categories(){
			return Category.categories.filter(c => c.checked);
		},
		get chapters(){
			return Chapter.chapters.filter(ch => ch.checked);
		},
		get lemmas(){
			const c = this.categories;
			const ch = this.chapters;
			return Lemma.lemmas.filter(l => c.includes(l.cat)
				&& ch.some(x => x.lemmas.includes(l)));
		},
	},
	create: {
		/**
		 * @param {string} s
		 * @param {() => {}} onclick
		 */
		card(s, hover, onclick){
			const elem = document.createElement('ruby');
			elem.classList.add('button');
			elem.innerHTML = s;
			if (hover){
				const rt = document.createElement('rt');
				rt.innerHTML = hover;
				elem.appendChild(rt);
				elem.style.paddingTop = '10px';
				elem.title = hover;
			}
			elem.onclick = onclick;
			return elem;
		},
		/** @param {string} s innerHTML */
		checkbox(s){
			const label = document.createElement('label');
			label.classList.add('bubble');
			label.style.backgroundColor = '#004';
			label.innerHTML = s;
			const input = document.createElement('input');
			label.appendChild(input);
			input.type = 'checkbox';
			input.checked = true;
			label.for = input.id = input.name = `checkbox-${s}`;
			return label;
		},
	},
	elem: {
		get categories(){
			return document.getElementById('categories');
		},
		/**
		 * @param {string} s
		 * @returns {HTMLInputElement}
		 */
		checkbox(s){
			return document.getElementById(`checkbox-${s}`);
		},
		get levels(){
			return document.getElementById('levels');
		},
		get options(){
			return document.getElementById('options');
		},
		get prompt(){
			return document.getElementById('prompt');
		},
		get seen(){
			return document.getElementById('seen');
		},
	},
	init(){
		console.log('Loading JP...');
		// interpret json as js objects
		jpData.forEach(o => Chapter.fromObject(o));
		// sort
		Chapter.chapters.sort((a, b) => a.name > b.name);
		Category.categories.sort((a, b) => a.name > b.name);
		// add HTML elements
		Chapter.chapters.forEach(ch => jp.elem.levels.appendChild(ch.elem));
		Category.categories.forEach(c => jp.elem.categories.appendChild(c.elem));
		// finally
		this.initialized = true;
		this.test.next();
		console.log(`Successfully loaded JP (${Lemma.lemmas.length} lemmas).`);
	},
	initialized: false,
	test: {
		next(){
			const pool = jp.acceptable.lemmas;
			/** @type {Lemma} */
			const lemma = random.choice(pool);
			pool.splice(pool.indexOf(lemma), 1); // remove real answer
			const decoys = pool.slice(0, 3);
			decoys.push(lemma);
			/** @type {Lemma[]} */
			const options = random.shuffle(decoys);
			// prompt
			jp.elem.prompt.innerHTML = '';
			jp.elem.prompt.appendChild(lemma.enElem());
			// seen
			jp.elem.seen.innerHTML = lemma.yourScore;
			// answers
			jp.elem.options.innerHTML = '';
			options.forEach(l => {
				jp.elem.options.appendChild(l.jpElem(l === lemma ? () => l.win() : () => l.lose()));
			});
		},
	},
	wait(){
		this.waitingOn--;
		console.debug(`One dependency loaded (${this.waitingOn} left)`);
		if (this.waitingOn === 0)
			this.init();
	},
	waitingOn: 0, // js modules
};

// wait for other modules to load first
if (typeof random !== 'object'){
	console.debug('Waiting on common.js');
	jp.waitingOn++;
	document.getElementById('common').onload = () => jp.wait();
}
if (typeof jpData !== 'object'){
	console.debug('Waiting on jpData.js');
	jp.waitingOn++;
	document.getElementById('jpData').onload = () => jp.wait();
}
else if (jp.waitingOn === 0)
	jp.init();