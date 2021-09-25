/* exported getEreDict */
'use strict';

// shamelessly stolen from verdurian dict,
// didn't know this was even possible so I'm hyped to get this working!
const reader = new XMLHttpRequest() || new ActiveXObject('MSXML2.XMLHTTP');
function getEreDict(){
	reader.open('get', 'eremoran.txt', true);
	reader.onreadystatechange = printEreDict; // generates dict
	reader.send(null);
}

function printEreDict(){
	/** @type {HTMLDListElement} */
	const list = document.getElementById('dictlist');
	reader.responseText.split('\n').forEach(line => {
		// todo!
		const dt = document.createElement('dt');
		dt.innerHTML = line;
		list.appendChild(dt);
	});
}