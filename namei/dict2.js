/* exported getDict */
/* global elements, linkCard, phono, titleCard */
'use strict';

// eslint-disable-next-line no-undef
const reader = new XMLHttpRequest() || new ActiveXObject('MSXML2.XMLHTTP');
/** @param {string} name */
function getDict(name, onComplete = () => undefined){
	reader.open('get', `https://mocha2007.github.io/namei/${name}.json`, true);
	reader.onreadystatechange = printDict; // generates dict
	reader.onload = onComplete; // stuff to do after
	reader.send(null);
}

function printDict(){
	// this is required to prevent it from double-posting
	if (reader.readyState !== 4)
		return;
	/** @type {HTMLDListElement} */
	const list = document.getElementById('dictionary');
	/** @type {[]} */
	const dictionary = elements.raws = JSON.parse(reader.responseText);
	// console.debug(dictionary);
	elements.dict = dictionary.map(o => o.title);
	dictionary.forEach(obj => {
		// const [index, type, defs] = line.split('=');
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
			img.width = 64;
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
			if (def[0] === '!'){ // note
				const noteElement = document.createElement('dd');
				noteElement.innerHTML = def.slice(1);
				entryDiv.appendChild(noteElement);
				return;
			}
			const d = document.createElement('li');
			d.innerHTML = def;
			deflist.appendChild(d);
		});
		// notes
		if (obj.notes){
			const noteElement = document.createElement('dd');
			noteElement.classList.add('lemmaNotes');
			noteElement.innerHTML = obj.notes;
			entryDiv.appendChild(noteElement);
		}
		list.appendChild(entryDiv);
		// anagram list
		const anagramElement = document.createElement('dd');
		anagramElement.innerHTML = '(Find Anagrams)';
		anagramElement.classList.add('button');
		anagramElement.onclick = () => {
			// anagramElement.classList.remove('button');
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
			// compoundElement.classList.remove('button');
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
	etymologies.forEach(etymology => {
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
				// eslint-disable-next-line max-len
				etymElem.innerHTML = `From ${etymElement.languages[tokens[1]]} ${tokens[2]}`;
				if (tokens[3])
					etymElem.innerHTML += ` &ldquo;${tokens[3]}&rdquo;`;
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
	ERE: 'Eremoran',
	IRI: 'Irikar',
	NEK: 'Nekaŋ',
	NUZ: 'Nuzdexax',
	OER: 'Old Eremoran',
	PEN: 'Proto-Eremo-Numoran',
	PMU: 'Proto-Muran',
	POL: 'P&oacute;&lstrok;ta&sacute;',
	PRE: 'Pre-Eremoran',
	TAI: 'Taika',
	VAZ: 'Va&zcaron;cud',
};
etymElement.stats = {
	/** @type {string[]} */
	source: [],
	/** @type {string[]} */
	type: [],
};

/** compares two strings and returns true if the count of each character matches exactly
 * @param {string} a
 * @param {string} b
 */
function isAnagram(a, b){
	return Array.from(a).sort().join('') === Array.from(b).sort().join('');
}

// todo: link to vazcud words!!!