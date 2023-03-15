/* exported getDict */
/* global elements, linkCard, phono, titleCard */
'use strict';

// eslint-disable-next-line no-undef
const reader = new XMLHttpRequest() || new ActiveXObject('MSXML2.XMLHTTP');
/** @param {string} name */
function getDict(name, onComplete = () => undefined){
	reader.open('get', `https://mocha2007.github.io/namei/${name}.json`, true);
	reader.onload = () => {
		printDict(); // generates dict
		onComplete(); // stuff to do after
	};
	reader.send(null);
}

function printDict(){
	/** @type {HTMLDListElement} */
	const list = document.getElementById('dictionary');
	/** @type {[]} */
	const dictionary = elements.raws = JSON.parse(reader.responseText);
	dictionary.forEach(obj => {
		elements.dict.push(obj.title);
		// entry div - for organization!
		// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dl#wrapping_name-value_groups_in_div_elements
		const entryDiv = document.createElement('div');
		entryDiv.id = `lemma-${obj.title}`;
		// entry title
		const dt = document.createElement('dt');
		dt.classList.add('lemmaTitle');
		dt.appendChild(titleCard(obj.title));
		entryDiv.appendChild(dt);
		// img
		if (obj.img){
			const imgdd = document.createElement('dd');
			imgdd.classList.add('lemmaImage');
			const img = document.createElement('img');
			img.src = obj.img;
			imgdd.appendChild(img);
			entryDiv.appendChild(imgdd);
		}
		// pron
		const pronElement = phono.elem(obj.title);
		pronElement.classList.add('lemmaPron');
		entryDiv.appendChild(pronElement);
		// etym
		try {
			entryDiv.appendChild(etymElement(obj.etym));
		}
		catch (e){
			console.error(`${obj.title}\n\t=> ${e}`);
		}
		// type, eg. noun, verb, ...
		const typeelement = document.createElement('dd');
		typeelement.classList.add('lemmaType');
		typeelement.innerHTML = obj.cat;
		entryDiv.appendChild(typeelement);
		// def(s)
		const entryelement = document.createElement('dd');
		entryelement.classList.add('lemmaDefs');
		const deflist = document.createElement('ol');
		entryelement.appendChild(deflist);
		entryDiv.appendChild(entryelement);
		obj.defList.forEach(def => {
			const d = document.createElement('li');
			d.innerHTML = defFormat(def);
			deflist.appendChild(d);
		});
		// notes
		if (obj.notes){
			const noteElement = document.createElement('dd');
			noteElement.classList.add('lemmaNotes');
			noteElement.innerHTML = defFormat(obj.notes);
			entryDiv.appendChild(noteElement);
		}
		list.appendChild(entryDiv);
		// anagram list
		const anagramElement = document.createElement('dd');
		anagramElement.innerHTML = '(Find Anagrams)';
		anagramElement.classList.add('button');
		anagramElement.onclick = () => {
			anagramElement.classList.remove('button');
			anagramElement.classList.add('revealedButton');
			anagramElement.innerHTML = '';
			elements.dict.filter(other => obj.title !== other && isAnagram(obj.title, other))
				.map(linkCard).forEach(elem => anagramElement.appendChild(elem));
		};
		entryDiv.appendChild(anagramElement);
		// compound list
		const compoundElement = document.createElement('dd');
		compoundElement.innerHTML = '(Find Compounds)';
		compoundElement.classList.add('button');
		compoundElement.onclick = () => {
			compoundElement.classList.remove('button');
			compoundElement.classList.add('revealedButton');
			compoundElement.innerHTML = '';
			elements.raws.filter(otherRaw => otherRaw.etym.split('/').includes(obj.title))
				.map(otherRaw => linkCard(otherRaw.title))
				.forEach(elem => {
					compoundElement.appendChild(elem); // link card
					compoundElement.appendChild(document.createTextNode(' ')); // space
				});
		};
		entryDiv.appendChild(compoundElement);
		// add categories
		if (obj.categories)
			obj.categories.forEach(category => {
				if (!elements.categories.includes(category))
					elements.categories.push(category);
			});
	});
}

/** @param {string} etymString */
function etymElement(etymString){
	const e = document.createElement('dd');
	e.classList.add('lemmaEtym');
	e.innerHTML = 'Etymology: ';
	// begin etym format parsing
	const etymologies = etymString.split('//');
	etymologies.forEach((etymology, i) => {
		if (i)
			e.appendChild(document.createTextNode(', '));
		const tokens = etymology.split('/');
		const etymElem = document.createElement('span');
		etymElement.stats.type.push(tokens[0]);
		switch (tokens[0]){
			case 'A': // augmentative
				etymElem.innerHTML = 'Augmentative of ';
				etymElem.appendChild(linkCard(tokens[1]));
				break;
			case 'a': // alteration
				etymElem.innerHTML = 'Alteration of ';
				etymElem.appendChild(linkCard(tokens[1]));
				break;
			case 'B': // blend
				etymElem.innerHTML = 'Blend of ';
				etymElem.appendChild(linkCard(tokens[1]));
				etymElem.appendChild(document.createTextNode(' and '));
				etymElem.appendChild(linkCard(tokens[2]));
				break;
			case 'C': // intralanguage compound
				etymElem.innerHTML = 'Compound of ';
				etymElem.appendChild(linkCard(tokens[1]));
				etymElem.appendChild(document.createTextNode(' and '));
				etymElem.appendChild(linkCard(tokens[2]));
				break;
			case 'D': // diminutive
				etymElem.innerHTML = 'Diminutive of ';
				etymElem.appendChild(linkCard(tokens[1]));
				break;
			case 'L': // loanword
				etymElement.stats.source.push(tokens[1]);
				etymElem.appendChild(loanElem(...tokens.splice(1)));
				break;
			case 'M': // metathesis
				etymElem.innerHTML = 'Metathesis from ';
				etymElem.appendChild(linkCard(tokens[1]));
				break;
			case 'P': // phrase
				etymElem.innerHTML = '(Phrase)';
				break;
			case 'R': // reduplication
				etymElem.innerHTML = 'Reduplication of ';
				etymElem.appendChild(linkCard(tokens[1]));
				break;
			case 'r': // reduction
				etymElem.innerHTML = 'Reduction of ';
				etymElem.appendChild(linkCard(tokens[1]));
				break;
			case '~': // related to
				etymElem.innerHTML = 'Related to ';
				etymElem.appendChild(linkCard(tokens[1]));
				break;
			default: // custom
				etymElement.stats.type.pop();
				etymElement.stats.type.push('?');
				etymElem.classList.add('warn');
				console.warn(`custom etym format: ${etymology}`);
				etymElem.innerHTML = etymology;
		}
		e.appendChild(etymElem);
	});
	// end
	return e;
}
etymElement.languages = {
	ERE: {
		name: 'Eremoran',
		lemma: '#lemma-{0}',
		url: 'eremoran.html',
	},
	IRI: {
		name: 'Irikar',
	},
	NEK: {
		name: 'Nekaŋ',
	},
	NUZ: {
		name: 'Nuzdexax',
	},
	OER: {
		name: 'Old Eremoran',
		url: 'eremoran.html#History',
	},
	PEN: {
		name: 'Proto-Eremo-Numoran',
		url: 'eremoran.html#History',
	},
	PMU: {
		name: 'Proto-Muran',
	},
	POL: {
		name: 'P&oacute;&lstrok;ta&sacute;',
		url: 'poltas.html',
	},
	POR: {
		name: 'Por&ouml;n',
		url: 'poron.html',
	},
	PRE: {
		name: 'Pre-Eremoran',
	},
	TAI: {
		name: 'Taika',
	},
	VAZ: {
		name: 'Va&zcaron;cud',
		lemma: '#lemma-{0}',
		url: 'vazcud.html',
	},
};
etymElement.stats = {
	/** @type {string[]} */
	source: [],
	/** @type {string[]} */
	type: [],
};

/**
 * @param {string} id
 * @param {string} word
 */
function loanElem(id, word, gloss = ''){
	const span = document.createElement('span');
	span.innerHTML = 'From ';
	const lang = etymElement.languages[id];
	if (lang.url){
		const a = document.createElement('a');
		a.innerHTML = lang.name;
		a.href = lang.url;
		span.appendChild(a);
	}
	else
		span.appendChild(document.createTextNode(lang.name));
	span.appendChild(document.createTextNode(' '));
	if (lang.lemma){
		const a = document.createElement('a');
		a.innerHTML = word;
		a.href = lang.url + lang.lemma.replace(/\{0\}/g, word);
		span.appendChild(a);
	}
	else
		span.appendChild(document.createTextNode(word));
	if (gloss)
		span.appendChild(document.createTextNode(` “${gloss}”`));
	return span;
}

/** compares two strings and returns true if the count of each character matches exactly
 * @param {string} a
 * @param {string} b
 */
function isAnagram(a, b){
	return Array.from(a).sort().join('') === Array.from(b).sort().join('');
}

/** @param {string} def */
function defFormat(def){
	defFormat.re.forEach(a => [...def.matchAll(a[0])]
		.forEach(m => def = def.replace(m[0], a[1](m))));
	return def;
}
defFormat.re = [
	// bold
	[/'''([^']+?)'''/g, m => `<strong>${m[1]}</strong>`],
	// italics
	[/''([^']+?)''/g, m => `<em>${m[1]}</em>`],
	// links
	[/\[\[([^\]]+?)\]\]/g, m => linkCard(m[1]).outerHTML],
	// templates
	// eg. {{w|orange|Orange (fruit)}}
	[/{{w\|([^|}]+)\|?([^}]+?)?}}/g, m => `<a href="https://en.wikipedia.org/wiki/${m[2] || m[1]}">${m[1]}</a>`],
	// eg. {{wt|la|-eus}}
	[/{{wt\|(\w+?)\|([^}]+?)}}/g, m => `<cite>${m[1]}. <a href="https://en.wiktionary.org/wiki/${m[2]}">${m[2]}</a></cite>`],
];