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
		new Word('ADJ', null, null, ['≃'], '(subject to change)'),
		new Word('ADV', null, null, ['≅'], '(subject to change)'),
		new Word('AUG', null, null, ['⏫']),
		new Word('DIM', null, null, ['⏬']),
		new Word('DU', null, null, ['||']),
		new Word('HYPER', null, null, ['↔'], 'interpret sign more broadly (hypernym)'),
		new Word('IMP', null, null, ['!']),
		new Word('INCH', null, null, ['🏁']),
		new Word('LIT', null, null, ['⊥'], 'interpret sign literally'),
		new Word('FUT', null, null, ['⏩']),
		new Word('PL', null, null, ['|||'], 'many'),
		new Word('PRES', null, null, ['▶'], 'also indicates verbs'),
		new Word('PRON', '·', null, null, 'asemic carrier'),
		new Word('PST', null, null, ['⏪']),
		new Word('Q', null, null, ['?']),
		new Word('again', '🔂'),
		new Word('all', null, null, ['∀'], 'each/every'),
		new Word('and', '&'),
		new Word('animal', '🐁', null, ['↔']),
		new Word('around', null, null, ['~'], 'about'),
		new Word('at', null, null, ['@']),
		new Word('ball', '⚽', null, ['↔']),
		new Word('can', null, null, ['◇']),
		new Word('cat', '🐱'),
		new Word('fall', '👉', ['↓'], null, '(subject to change)'),
		new Word('flower', '❀'),
		new Word('fog', '≡', ['☁︎']),
		new Word('from', null, null, ['←'], 'away'),
		new Word('game', '🎲', null, null, 'play'),
		new Word('go', '👉', null, null, '(subject to change)'),
		new Word('grow', '📈'),
		new Word('happy', ':)'),
		new Word('here', '🏠', null, ['↔', '↓']),
		new Word('hour', '🝮', null, null, 'time'),
		new Word('in', null, null, ['⊡']),
		new Word('inhabit', '🏠', null, null, 'live'),
		new Word('iron', '♂', ['🜃']),
		new Word('jump', '🤾', ['👉']),
		new Word('long_ago', '⏪', ['⏪']),
		new Word('love', '♥'),
		new Word('man', '☺︎', ['♂']),
		new Word('mars', '♂', ['🪐']),
		new Word('mist', '=', ['☁︎']),
		new Word('must', null, null, ['□'], 'should'),
		new Word('not', '¬'),
		new Word('now', '▶'),
		new Word('of', null, null, ['✊']),
		new Word('on', null, null, ['🔛']),
		new Word('one', '1'),
		new Word('person', '☺︎'),
		new Word('place', '🏠', null, ['↔']),
		new Word('pray', '🙏', null, null, 'beg/hope'),
		new Word('rain', '☔'),
		new Word('red', '♂', ['🎨']),
		new Word('rise', '👉', ['↑'], null, '(subject to change)'),
		new Word('see', '👁️', null, null, 'look'),
		new Word('shine', '🔆', null, null, 'be bright'),
		new Word('shout', '🗣️', ['🔊'], null, 'yell'),
		new Word('slow', '🐌'),
		new Word('small', '⏬'),
		new Word('some', null, null, ['∃'], 'any'),
		new Word('soon', '🔜'),
		new Word('speak', '🗣️', null, null, 'say/talk'),
		new Word('stop', '🛑'),
		new Word('sun', '☉'),
		new Word('table', '⛩'),
		new Word('that', null, null, ['↑']),
		new Word('this', null, null, ['↓']),
		new Word('to', null, null, ['→']),
		new Word('together', null, null, ['🤝']),
		new Word('turn', '⥁', null, null, 'roll'),
		new Word('two', '2', null, null, 'cf. DU'),
		new Word('up', '↑'),
		new Word('what', null, null, ['↓', '?'], 'which'),
		new Word('walk', '🚶'),
		new Word('wild', '🤪', null, null, 'zany'),
		new Word('woman', '☺︎', ['♀']),
		new Word('work', '👷'),
		new Word('tomorrow', '☌', ['⏩']),
		new Word('tuesday', '♂', ['☌']),
		new Word('yesterday', '☌', ['⏪']),
	],
	samples: [
		new Sample("I love you", "love.PRES.1 PRON.2"),
		// todo https://cofl.github.io/conlang/resources/mirror/conlang-syntax-test-cases.html
		new Sample("The sun shines", "sun shine.PRES"),
		new Sample("The sun is shining", "sun shine.PRES"),
		new Sample("The sun shone", "sun shine.PST"),
		new Sample("The sun will shine", "sun shine.FUT"),
		new Sample("The sun is shining again", "sun shine.PRES again"),
		new Sample("The sun will shine tomorrow", "sun shine.FUT tomorrow"),
		new Sample("The sun shines brightly", "sun shine.PRES shine.ADV"),
		new Sample("The bright sun shines", "shine.ADJ sun shine.PRES"),
		new Sample("The sun is rising now", "sun rise.PRES now"),
		new Sample("All the people shouted", "person.all shout.PST"),
		new Sample("Some of the people shouted", "person.some shout.PST"),
		new Sample("Many of the people shouted twice", "person.PL shout.PST two.ADV"),
		new Sample("Happy people often shout", "happy.ADJ person.PL shout.PRES hour.PL.ADV"),
		new Sample("The kitten jumped up", "cat.DIM jump.PST up"),
		new Sample("The kitten jumped onto the table", "cat.DIM jump.PST table.on.to"),
		new Sample("My little kitten walked away", "small.ADJ cat.DIM.1 walk.from.PST"),
		new Sample("It's raining", "rain.PRES"),
		new Sample("The rain came down", "rain fall.PST"),
		new Sample("The kitten is playing in the rain", "cat.DIM game.PRES rain.in"),
		new Sample("The rain has stopped", "rain stop.PST"),
		new Sample("Soon the rain will stop", "soon rain stop.FUT"),
		new Sample("I hope the rain stops soon", "pray.PRES.1 rain stop.FUT soon"),
		new Sample("Once wild animals lived here", "long_ago wild.ADJ animal.PL inhabit.PST here"),
		new Sample("Slowly she looked around", "slow.ADV see.around.PST"),
		new Sample("Go away", "go.from.IMP"),
		new Sample("Let's go", "go.IMP.1"),
		new Sample("You should go", "go.must.2"),
		new Sample("I will be happy to go", "happy.FUT.1 go"),
		new Sample("He will arrive soon", "go.to.FUT soon"),
		new Sample("The baby's ball has rolled away", "person.DIM.of ball turn.from.PST"),
		new Sample("The two boys are working together", "man.DIM.DU work.together.PRES"),
		new Sample("This mist will probably clear away", "mist.this go.from.FUT"), // todo: probably
		new Sample("Lovely flowers are growing everywhere", "love.ADJ flower.PL grow.PRES place.all"),
	],
	sources: [
		'https://en.wikipedia.org/wiki/Alchemical_symbol',
		'https://en.wikipedia.org/wiki/List_of_logic_symbols',
		'https://en.wikipedia.org/wiki/Media_control_symbols',
		'https://real-world-systems.com/docs/U2600.html',
		'https://emojipedia.org/',
	],
};

EG2.init();