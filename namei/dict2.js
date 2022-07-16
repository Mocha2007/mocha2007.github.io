/* exported getDict */
'use strict';
// shamelessly stolen from verdurian dict,
// didn't know this was even possible so I'm hyped to get this working!

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
	console.debug(dictionary);
	dictionary.forEach(obj => {
		// const [index, type, defs] = line.split('=');
		// entry div - for organization!
		// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dl#wrapping_name-value_groups_in_div_elements
		const entryDiv = document.createElement('div');
		entryDiv.id = `lemma-${obj.title}`;
		// entry title
		const dt = document.createElement('dt');
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
		dt.appendChild(ereTitle);
		// type, eg. noun, verb, ...
		const typeelement = document.createElement('dd');
		typeelement.innerHTML = obj.cat;
		// def(s)
		const entryelement = document.createElement('dd');
		const deflist = document.createElement('ol');
		entryelement.appendChild(deflist);
		list.appendChild(entryDiv);
		entryDiv.appendChild(dt);
		entryDiv.appendChild(typeelement);
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
	});
}