/* exported getEreDict */
'use strict';
// shamelessly stolen from verdurian dict,
// didn't know this was even possible so I'm hyped to get this working!

// eslint-disable-next-line no-undef
const reader = new XMLHttpRequest() || new ActiveXObject('MSXML2.XMLHTTP');
function getEreDict(){
	reader.open('get', 'eremoran.txt', true);
	reader.onreadystatechange = printEreDict; // generates dict
	reader.send(null);
}

function printEreDict(){
	// this is required to prevent it from double-posting
	if (reader.readyState !== 4)
		return;
	/** @type {HTMLDListElement} */
	const list = document.getElementById('dictlist');
	reader.responseText.split('\n').forEach(line => {
		const [index, type, defs] = line.split('=');
		// entry title
		const dt = document.createElement('dt');
		dt.innerHTML = index;
		// type, eg. noun, verb, ...
		const typeelement = document.createElement('dd');
		typeelement.innerHTML = type;
		// def(s)
		const entryelement = document.createElement('dd');
		const deflist = document.createElement('ol');
		entryelement.appendChild(deflist);
		defs.split(';').forEach(def => {
			const d = document.createElement('li');
			d.innerHTML = def;
			deflist.appendChild(d);
		});
		list.appendChild(dt);
		list.appendChild(typeelement);
		list.appendChild(entryelement);
	});
}