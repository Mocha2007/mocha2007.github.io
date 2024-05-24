/* exported AA */
/* global random */

class Aspect {
	constructor(name, form, display = true){
		this.name = name;
		this.form = form;
		this.display = display;
		Aspect.aspects.push(this);
	}
	fill(c1 = '', c2 = '', c3 = ''){
		return this.form
			.replace(/{c1}/g, c1)
			.replace(/{c2}/g, c2)
			.replace(/{c3}/g, c3);
	}
}
/** @type {Aspect[]} */
Aspect.aspects = [];
Aspect.INFINITIVE = new Aspect('Infinitive', '{c1}a{c2}{c3}a', false);
Aspect.PERFECT = new Aspect('Perfective', '{c1}a{c2}a{c3}k');
Aspect.IMPERFECT = new Aspect('Continuous', 'H₁a{c1}{c2}a{c3}');
Aspect.IMPERFECT1 = new Aspect('Habitual', 'h₅i{c1}{c2}a{c3}');

class Mood {
	constructor(name, root = '', perf_only = false){
		this.name = name;
		this.root = root;
		this.perf_only = perf_only;
		Mood.moods.push(this);
	}
	x(root, aspect){
		return this.root
			? Aspect.INFINITIVE.fill(...root.split('-')) + aspect.fill(...this.root.split('-'))
			: aspect.fill(...root.split('-'));
	}
}
/** @type {Mood[]} */
Mood.moods = [];
// compound
Mood.INDICATIVE = new Mood('Indicative');
Mood.IMPERATIVE = new Mood('Imperative', '--', true);
Mood.PROHIBITIVE = new Mood('Prohibitive', 'n--', true);
Mood.DEBITIVE = new Mood('Debitive', 'h₃-r-');
Mood.POTENTIAL = new Mood('Potential', 'k-H₁-');
Mood.VOLITIVE = new Mood('Volitive', 'h₂--');

class Gender {
	constructor(name, v = 'a', c = ''){
		this.name = name;
		this.v = v;
		this.c = c;
		Gender.genders.push(this);
	}
}
/** @type {Gender[]} */
Gender.genders = [];
Gender.M = new Gender('Masculine', 'u');
Gender.F = new Gender('Feminine', 'i', 't');

class GNumber {
	constructor(name, v_verb = 'a', v_noun = 'a'){
		this.name = name;
		this.v_verb = v_verb;
		this.v_noun = v_noun;
		GNumber.numbers.push(this);
	}
}
/** @type {GNumber[]} */
GNumber.numbers = [];
GNumber.S = new GNumber('Singular', '');
GNumber.D = new GNumber('Dual', 'ā', 'i');
GNumber.P = new GNumber('Plural', 'u', 'u'); // ū u

class Person {
	constructor(name, m, f){
		this.name = name;
		this.m = m;
		this.f = f;
		Person.persons.push(this);
	}
	ending(gender){
		return gender === Gender.M ? this.m : this.f;
	}
}
/** @type {Person[]} */
Person.persons = [];
Person._1 = new Person(1, 'ama', 'u');
Person._2 = new Person(2, 'ā', 'i');
Person._3 = new Person(3, 'ā', 'a');


const AA = {
	choice: {
		/** @type {"Durative"|"Punctual"|"Stative"} */
		get aktionsart(){
			return Array.from(document.getElementsByName('stativeness')).find(e => e.checked).value;
		},
		get gender(){
			return Array.from(document.getElementsByName('gender')).find(e => e.checked).value === 'Feminine' ? Gender.F : Gender.M;
		},
		get object(){
			const value = document.getElementById('obj').value;
			if (value === 'xxx')
				return '';
			const [p, n, g] = value.split('');
			const _0 = {
				m1: 'y',
				f1: 'H₁',
				m2: 'k',
				f2: 'c',
				m3: 'f',
				f3: 't',
			}[g + p];
			const _1 = {s: '', d: 'i', p: 'un'}[n];
			return _0 + _1;
		},
	},
	cleanup(s){
		return s
			// merge same vowels
			.replace(/[aā]{2,}/g, 'ā')
			.replace(/[iī]{2,}/g, 'i') // ī
			.replace(/[uū]{2,}/g, 'u') // ū
			// y-ing
			.replace(/(?<=[iī])(?=[aā])/g, 'y')
			.replace(/(?<=[aā])(?=[iī])/g, 'y')
			.replace(/(?<=[uū])(?=[iī])/g, 'y')
			// w-ing
			.replace(/(?<=[uū])(?=[aā])/g, 'w')
			.replace(/(?<=[aā])(?=[uū])/g, 'w')
			.replace(/(?<=[iī])(?=[uū])/g, 'w')
			// contractions
			.replace(/[aā]w[aā]/g, 'u') // ū
			.replace(/[aā]y[aā]/g, 'i'); // ī
			// delete -
			//.replace(/-/g, '');
	},
	elem: {
		/** @type {HTMLDivElement} */
		get container(){
			return document.getElementById('conj');
		},
		/** @type {HTMLInputElement} */
		get input(){
			return document.getElementById('root');
		},
	},
	fill(s, c1 = '', c2 = '', c3 = ''){
		return s
			.replace(/{c1}/g, c1)
			.replace(/{c2}/g, c2)
			.replace(/{c3}/g, c3);
	},
	header(content, level = 2){
		const elem = document.createElement('h' + level);
		elem.innerHTML = content;
		return elem;
	},
	random: {
		consList: 'm n tʼ cʼ kʼ qʼ t c k q H₁ b d j g fʼ sʼ šʼ h₅ʼ h₄ʼ h₃ʼ f s š h₅ h₄ h₃ h₂ h₁ Lʼ L w l y H₃ H₂ r'.split(' '),
		/** inverse of Polish */
		consWeights: {
			DEFAULT: 322,
			b: 67,
			c: 223,
			d: 30,
			f: 321,
			'h₄': 93,
			g: 73,
			k: 29,
			l: 47,
			m: 34,
			n: 13,
			r: 22,
			s: 23,
			š: 100, // guess
			t: 25,
			// I want these to be common because they lead to good reductions - they're 57 / 43 by default
			w: 400,
			y: 400,
		},
		/** @type {string} */
		get cons(){
			this.init();
			return random.weightedChoice(this.consList, this.cW2);
		},
		/** initialize consWeights */
		init(){
			if (this.initialized)
				return;
			this.cW2 = this.consList.map(c => this.consWeights[c] || this.consWeights.DEFAULT);
			this.initialized = true;
		},
		root(c = 0){
			return range(c || random.randint(1, 3)).map(_ => this.cons).join('-');
		},
		run(c = 0){
			AA.elem.input.value = this.root(c);
			AA.run();
		},
	},
	run(){
		const root = this.elem.input.value;
		// console.info(`Conjugating ${root}`);
		this.elem.container.innerHTML = '';
		this.elem.container.appendChild(this.header('Verb'));
		this.elem.container.appendChild(this.table(root));
		this.elem.container.appendChild(this.table2(root));
		this.elem.container.appendChild(this.header('Noun'));
		this.elem.container.appendChild(this.table3(root));
	},
	table(root){
		// each "big row" in the table represents one mood
		// each individual row is an aspect of that mood
		// cols are split into number (s, pl), then person (1, 2, 3), then gender
		const elem = document.createElement('table');
		// first create headers
		const buffer = () => {
			const e = document.createElement('th');
			e.colSpan = 2;
			e.rowSpan = 3;
			e.innerHTML = root;
			return e;
		};
		const tr_n = document.createElement('tr');
		elem.appendChild(tr_n);
		tr_n.appendChild(buffer());
		const tr_p = document.createElement('tr');
		elem.appendChild(tr_p);
		const tr_g = document.createElement('tr');
		elem.appendChild(tr_g);
		GNumber.numbers.forEach(n => {
			const th_num = document.createElement('th');
			th_num.innerHTML = n.name;
			th_num.colSpan = Person.persons.length * Gender.genders.length;
			tr_n.appendChild(th_num);
			Person.persons.forEach(p => {
				const th_per = document.createElement('th');
				th_per.innerHTML = p.name;
				th_per.colSpan = Gender.genders.length;
				tr_p.appendChild(th_per);
				Gender.genders.forEach(g => {
					const th_gen = document.createElement('th');
					th_gen.innerHTML = g.name;
					tr_g.appendChild(th_gen);
				});
			});
		});
		// then create body
		Mood.moods.forEach(mood => {
			const NO_IMP = this.choice.aktionsart === 'Stative';
			if (NO_IMP && (mood === Mood.PROHIBITIVE || mood === Mood.IMPERATIVE))
				return;
			const tr_mood = document.createElement('tr');
			elem.appendChild(tr_mood);
			const th_mood = document.createElement('th');
			th_mood.classList.add(`mood_${mood.name.toLowerCase()}`);
			th_mood.innerHTML = mood.name;
			const PERF_ONLY = mood.perf_only || this.choice.aktionsart !== 'Durative';
			th_mood.rowSpan = PERF_ONLY ? 1 : Aspect.aspects.length - 1;
			th_mood.colSpan = PERF_ONLY ? 2 : 1;
			tr_mood.appendChild(th_mood);
			Aspect.aspects.forEach((aspect, i) => {
				if (!aspect.display || (PERF_ONLY && aspect !== Aspect.PERFECT))
					return;
				const tr_aspect = document.createElement('tr');
				const th_aspect = document.createElement('th');
				th_aspect.innerHTML = aspect.name;
				const tr = i === 1 ? tr_mood : tr_aspect;
				if (i !== 1)
					elem.appendChild(tr_aspect);
				if (!PERF_ONLY)
					tr.appendChild(th_aspect);
				GNumber.numbers.forEach(n => {
					Person.persons.forEach(p => {
						Gender.genders.forEach(g => {
							const td = document.createElement('td');
							td.title = `${p.name} person ${n.name} ${g.name} ${mood.name} ${aspect.name}`;
							td.innerHTML = this.verb(root, mood, aspect, p, g, n, this.choice.object);
							tr.appendChild(td);
						});
					});
				});
			});
		});
		return elem;
	},
	table2(root){
		// misc verb forms
		const consonantality = root.split('-').length;
		const elem = document.createElement('table');
		[
			['Infinitive', Aspect.INFINITIVE.form],
			['Gerund (M)', '{c1}a{c2}a{c3}'],
			['Adverbial', 'ni{c1}{c2}a{c3}', 'creates a dependent clause providing context'],
			['Causative Root', consonantality < 3 ? 's-{c1}-{c2}' : 'sa{c1}-{c2}-{c3}'],
			['Reflexive Root', consonantality < 3 ? 't-{c1}-{c2}' : 'ta{c1}-{c2}-{c3}', '(only applies to active verbs)'],
			// ['Passive Root', consonantality < 3 ? 'n-{c1}-{c2}' : 'na{c1}-{c2}-{c3}', '(only applies to active verbs)'],
			// derived nouns
			['Instrument Noun (M)', 'ma{c1}a{c2}{c3}atrum', 'instrument used to ~'],
			['Agent Noun (M)',      'ma{c1}{c2}a{c3}fa-', '~er (male; requires possessor)'],
			['Agent Noun (F)',      'ma{c1}{c2}a{c3}', '~er (female)'],
			['Location Noun (F)',   'ma{c1}a{c2}{c3}aryut', 'location where ~ happens'],
		].forEach(ab => {
			const [name, form, desc] = ab;
			const tr = document.createElement('tr');
			elem.appendChild(tr);
			const th = document.createElement('th');
			th.innerHTML = name;
			tr.appendChild(th);
			const td = document.createElement('td');
			td.innerHTML = this.cleanup(this.fill(form, ...root.split('-')));
			tr.appendChild(td);
			const td2 = document.createElement('td');
			td2.innerHTML = desc || '-';
			tr.appendChild(td2);
		})
		return elem;
	},
	table3(root){
		// noun forms
		const consonantality = root.split('-').length;
		const elem = document.createElement('table');
		// headers
		const tr_head = document.createElement('tr');
		elem.appendChild(tr_head);
		['-', 'Free', 'Bound'].forEach(s => {
			const th = document.createElement('th');
			th.innerHTML = s;
			tr_head.appendChild(th);
		});
		// content
		const IS_F = this.choice.gender === Gender.F;
		[
			[IS_F ? 'Singular' : '(All numbers)', [IS_F ? '{c1}a{c2}a{c3}' : '', '{c1}a{c2}{c3}a-']],
			['Dual', [IS_F ? '{c1}i{c2}i{c3}' : '', '{c1}i{c2}{c3}i-']],
			['Plural', [IS_F ? '{c1}u{c2}u{c3}' : '', '{c1}u{c2}{c3}u-']],
			['Augmentative (M)', ['{c1}a{c2}{c3}af', '']],
			['Diminutive (F)', ['{c1}a{c2}{c3}at', '']],
		].forEach((ab, i) => {
			if (!IS_F && i)
				return;
			const [name, forms] = ab;
			const tr = document.createElement('tr');
			elem.appendChild(tr);
			const th = document.createElement('th');
			th.innerHTML = name;
			tr.appendChild(th);
			forms.forEach(form => {
				const td = document.createElement('td');
				td.innerHTML = this.cleanup(this.fill(form, ...root.split('-')));
				tr.appendChild(td);
			})
		})
		return elem;
	},
	verb(root, mood = Mood.INDICATIVE, aspect = Aspect.IMPERFECT,
		person = Person._3, gender = Gender.M, number = GNumber.S, obj = ''){
		return this.cleanup(mood.x(root, aspect)
			+ person.ending(gender)
			+ number.v_verb
			+ obj);
	},
};