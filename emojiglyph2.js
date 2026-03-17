class Word {
	constructor(gloss, root, marks_semantic, marks_syntactic, notes){
		/** @type {string} */
		this.gloss = gloss;
		/** @type {string} */
		this.root = root || "";
		/** @type {string[]} */
		this.marks_semantic = marks_semantic || ['&nbsp;'];
		/** @type {string[]} */
		this.marks_syntactic = marks_syntactic || [];
		/** @type {string} */
		this.notes = notes || "";
	}
	clone(){
		return new Word(this.gloss, this.root, this.marks_semantic.map(x => x), this.marks_syntactic.map(x => x), this.notes);
	}
	elem(){
		const e = document.createElement('span');
		e.classList.add('word');
		e.title = this.gloss;
		// semantic marks
		const mc = document.createElement('div');
		mc.innerHTML = this.marks_semantic.map(EG2.charOrImg).join(' ');
		e.appendChild(mc);
		// root
		const root = document.createElement('div');
		root.innerHTML = EG2.charOrImg(this.root);
		e.appendChild(root);
		// syntactic marks
		const sm = document.createElement('div');
		sm.innerHTML = this.marks_syntactic.map(EG2.charOrImg).join(' ');
		e.appendChild(sm);
		return e;
	}
	tr(){
		const o = document.createElement('tr');
		const th = document.createElement('th');
		th.innerHTML = this.gloss;
		o.appendChild(th);
		const col1 = document.createElement('td');
		col1.appendChild(this.elem());
		o.appendChild(col1);
		const notes = document.createElement('td');
		notes.innerHTML = this.notes;
		o.appendChild(notes);
		return o;
	}
	/** @param {string} gloss */
	static fromGloss(gloss){
		let mods = gloss.split('.');
		const root = mods.shift();
		const o = EG2.lexicon.find(w => w.gloss == root).clone();
		o.gloss = gloss;
		mods.forEach(mod => EG2.lexicon.find(w => w.gloss == mod).marks_syntactic.forEach(syn => o.marks_syntactic.push(syn)));
		return o;
	}
}

class Sample {
	constructor(meaning, gloss, define){
		/** @type {string} */
		this.meaning = meaning || "";
		/** @type {string} */
		this.gloss = gloss || "";
		this.define = define || {};
	}
	elem(){
		const div = document.createElement('div');
		div.classList.add('sample');
		div.innerHTML = `&ldquo;${this.meaning}&rdquo;<br>`;
		this.words().forEach(w => div.appendChild(w.elem()));
		return div;
	}
	/** @returns {Word[]} */
	words(){
		return this.gloss.split(' ').map(w => this.define[w] || Word.fromGloss(w));
	}
}

const EG2 = {
	/** @param {string} s */
	charOrImg(s){
		return s.startsWith('http') ? `<img src="${s}">` : s;
	},
	init(){
		const dict = document.getElementById('dictionary');
		this.lexicon.sort((a, b) => a.gloss < b.gloss ? -1 : 1);
		this.lexicon.forEach(w => dict.appendChild(w.tr()));
		const sources = document.getElementById('sources');
		this.sources.forEach(s => {
			const li = document.createElement('li');
			const a = document.createElement('a');
			a.innerHTML = a.href = s;
			li.appendChild(a);
			sources.appendChild(li);
		});
		const samples = document.getElementById('samples');
		this.samples.forEach(s => samples.appendChild(s.elem()));
		console.info('emojiglyph2.js loaded.');
	},
	lexicon: [
		new Word('1', null, null, ['1'], 'I/me/my'),
		new Word('2', null, null, ['2'], 'you/your'),
		new Word('3', null, null, ['3'], 'it/they/its/their'),
		new Word('ADJ', null, null, ['~'], '(subject to change)'),
		new Word('ADV', null, null, ['≈'], '(subject to change)'),
		new Word('FUT', null, null, ['⏩']),
		new Word('PRES', null, null, ['▶'], 'also indicates verbs'),
		new Word('PRON', '·', null, null, 'asemic carrier'),
		new Word('PST', null, null, ['⏪']),
		new Word('again', '🔂'),
		new Word('all', null, null, ['∀'], 'each/every'),
		new Word('and', '&'),
		new Word('at', '@'),
		new Word('go', '👉', null, null, '(subject to change)'),
		new Word('iron', '♂', ['🜃']),
		new Word('love', '♥'),
		new Word('man', '☺︎', ['♂']),
		new Word('mars', '♂', ['🪐']),
		new Word('not', '¬'),
		new Word('now', '▶'),
		new Word('person', '☺︎'),
		new Word('red', '♂', ['🎨']),
		new Word('rise', '👉', ['↑'], null, '(subject to change)'),
		new Word('shine', '🔆', null, null, 'be bright'),
		new Word('sun', '☉'),
		new Word('that', null, null, ['↑']),
		new Word('this', null, null, ['↓']),
		new Word('what', null, null, ['↓', '?'], 'which'),
		new Word('woman', '☺︎', ['♀']),
		new Word('tomorrow', '☌', ['⏩']),
		new Word('tuesday', '♂', ['☌']),
		new Word('yesterday', '☌', ['⏪']),
	],
	samples: [
		new Sample("I love you", "love.PRES.1 PRON.2"),
		// todo https://cofl.github.io/conlang/resources/mirror/conlang-syntax-test-cases.html
		new Sample("The sun shines", "sun shine.PRES"),
		new Sample("The sun shone", "sun shine.PST"),
		new Sample("The sun will shine", "sun shine.FUT"),
		new Sample("The sun is shining again", "sun shine.PRES again"),
		new Sample("The sun will shine tomorrow", "sun shine.FUT tomorrow"),
		new Sample("The sun shines brightly", "sun shine.PRES shine.ADV"),
		new Sample("The bright sun shines", "shine.ADJ sun shine.PRES"),
		new Sample("The sun is rising now", "sun rise.PRES now"),
	],
	sources: [
		'https://en.wikipedia.org/wiki/Alchemical_symbol',
		'https://en.wikipedia.org/wiki/Media_control_symbols',
	],
};

EG2.init();