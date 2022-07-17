/* exported getDict */
/* global elements, EremoranTooltip */
'use strict';

// eslint-disable-next-line no-undef
const reader = new XMLHttpRequest() || new ActiveXObject('MSXML2.XMLHTTP');
/** @param {string} name */
function getDict(name){
	reader.open('get', `https://mocha2007.github.io/namei/${name}.json`, true);
	reader.onreadystatechange = printDict; // generates dict
	reader.send(null);
}

function printDict(){
	// this is required to prevent it from double-posting
	if (reader.readyState !== 4)
		return;
	/** @type {HTMLDListElement} */
	const list = document.getElementById('dictionary');
	/** @type {[]} */
	const dictionary = JSON.parse(reader.responseText);
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
		// hotlink to entry
		/** @type {HTMLAnchorElement} */
		const anchor = document.createElement('a');
		anchor.href = `#${entryDiv.id}`;
		anchor.innerHTML = '*';
		dt.appendChild(anchor);
		// entry title
		const ereTitle = document.createElement('span');
		ereTitle.innerHTML = obj.title;
		ereTitle.classList.add('eremoran');
		EremoranTooltip.setupWord(ereTitle);
		dt.appendChild(ereTitle);
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
		// etym
		const etymElement = document.createElement('dd');
		etymElement.classList.add('lemmaEtym');
		etymElement.innerHTML = 'Etymology: ' + obj.etym;
		entryDiv.appendChild(etymElement);
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
	});
}