/* exported AA */

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
Aspect.IMPERFECT = new Aspect('Imperfect', 'H₁a{c1}{c2}a{c3}');
Aspect.PERFECT = new Aspect('Perfect', '{c1}a{c2}a{c3}k');

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
Mood.DEBITIVE = new Mood('Imperative', '--', true);
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
		this.f = f || m;
		Person.persons.push(this);
	}
	ending(gender){
		return gender === Gender.M ? this.m : this.f;
	}
}
/** @type {Person[]} */
Person.persons = [];
Person._1 = new Person(1, 'u', 'um');
Person._2 = new Person(2, 'ā', 'i');
Person._3 = new Person(3, 'a', 'at');


const AA = {
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
			.replace(/(?<=[iī])(?=[uū])/g, 'w');
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
	run(){
		const root = this.elem.input.value;
		console.info(`Conjugating ${root}`);
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
			const tr_mood = document.createElement('tr');
			elem.appendChild(tr_mood);
			const th_mood = document.createElement('th');
			th_mood.classList.add(`mood_${mood.name.toLowerCase()}`);
			th_mood.innerHTML = mood.name;
			th_mood.rowSpan = Aspect.aspects.length - 1;
			th_mood.colSpan = mood.perf_only ? 2 : 1;
			tr_mood.appendChild(th_mood);
			Aspect.aspects.forEach((aspect, i) => {
				if (!aspect.display || (mood.perf_only && aspect !== Aspect.PERFECT))
					return;
				const tr_aspect = document.createElement('tr');
				const th_aspect = document.createElement('th');
				th_aspect.innerHTML = aspect.name;
				const tr = i === 1 ? tr_mood : tr_aspect;
				if (i !== 1)
					elem.appendChild(tr_aspect);
				if (!mood.perf_only)
					tr.appendChild(th_aspect);
				GNumber.numbers.forEach(n => {
					Person.persons.forEach(p => {
						Gender.genders.forEach(g => {
							const td = document.createElement('td');
							td.title = `${p.name} person ${n.name} ${g.name} ${mood.name} ${aspect.name}`;
							td.innerHTML = this.verb(root, mood, aspect, p, g, n);
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
			['Passive Root', consonantality < 3 ? 'n-{c1}-{c2}' : 'na{c1}-{c2}-{c3}', '(only applies to active verbs)'],
			// derived nouns
			['Instrument Noun (M)', 'ma{c1}a{c2}{c3}atrum', 'instrument used to ~'],
			['Agent Noun (M)',      'ma{c1}{c2}a{c3}', '~er (male)'],
			['Agent Noun (F)',      'ma{c1}a{c2}{c3}at', '~er (female)'],
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
		['-', 'Unpossessed', 'Possessed'].forEach(s => {
			const th = document.createElement('th');
			th.innerHTML = s;
			tr_head.appendChild(th);
		});
		// content
		[
			['Singular', ['{c1}a{c2}a{c3}', '{c1}a{c2}{c3}a-']],
			['Dual', ['{c1}a{c2}i{c3}', '{c1}a{c2}{c3}i-']],
			['Plural', ['{c1}a{c2}u{c3}', '{c1}a{c2}{c3}u-']],
		].forEach(ab => {
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
		person = Person._3, gender = Gender.M, number = GNumber.S){
		return this.cleanup(mood.x(root, aspect)
			+ person.ending(gender)
			+ number.v_verb);
	},
};