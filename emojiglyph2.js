class Word {
	constructor(gloss, root, marks_semantic, marks_syntactic, notes){
		/** @type {string} */
		this.gloss = gloss;
		/** @type {string} */
		this.root = root || "";
		/** @type {string[]} */
		this.marks_semantic = marks_semantic || [];
		/** @type {string[]} */
		this.marks_syntactic = marks_syntactic || [];
		/** @type {string} */
		this.notes = notes || "";
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
}

const EG2 = {
	/** @param {string} s */
	charOrImg(s){
		return s.startsWith('http') ? `<img src="${s}">` : s;
	},
	init(){
		const dict = document.getElementById('dictionary');
		this.lexicon.sort((a, b) => a.gloss.toLowerCase() < b.gloss.toLowerCase() ? -1 : 1);
		this.lexicon.forEach(w => dict.appendChild(w.tr()));
		const sources = document.getElementById('sources');
		this.sources.forEach(s => {
			const li = document.createElement('li');
			const a = document.createElement('a');
			a.innerHTML = a.href = s;
			li.appendChild(a);
			sources.appendChild(li);
		});
		console.info('emojiglyph2.js loaded.');
	},
	lexicon: [
		new Word('1', null, null, ['1'], 'I/me/my'),
		new Word('2', null, null, ['2'], 'you/your'),
		new Word('3', null, null, ['3'], 'it/they/its/their'),
		new Word('3.M', null, null, ['3', '♂'], 'he/him/his'),
		new Word('3.F', null, null, ['3', '♀'], 'she/her'),
		new Word('all', null, null, ['∀'], 'each/every'),
		new Word('and', '&'),
		new Word('at', '@'),
		new Word('iron', '♂', ['🜃']),
		new Word('man', '☺︎', ['♂']),
		new Word('Mars', '♂', ['🪐']),
		new Word('not', '¬'),
		new Word('person', '☺︎'),
		new Word('red', '♂', ['🎨']),
		new Word('that', null, null, ['↑']),
		new Word('this', null, null, ['↓']),
		new Word('what', null, null, ['↓', '?'], 'which'),
		new Word('woman', '☺︎', ['♀']),
		new Word('Tuesday', '♂', ['☌']),
	],
	sources: [
		'https://en.wikipedia.org/wiki/Alchemical_symbol',
	],
};

EG2.init();