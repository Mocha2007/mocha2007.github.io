/* exported exportDict */
/* global download, elements */

'use strict';

function exportDict(){
	// converts the <dl> to a txt file and saves it for download
	// const elements.d is the dl
	let entry = {};
	let afterDefList = false;
	const dictionary = []; // list of objects
	Array.from(elements.d.children).forEach(elem => {
		// console.debug(elem.tagName);
		switch (elem.tagName){
			case 'DT':
				// push last def
				dictionary.push(entry);
				// reset
				entry = {
					title: elem.innerHTML,
				};
				afterDefList = false;
				break;
			case 'DD':
				if (elem.children.length
					&& Array.from(elem.children)[0].tagName === 'OL'){
					// must be a deflist
					entry.defList = defListToObj(elem.children[0]);
					afterDefList = true;
				}
				else if (elem.children.length
					&& Array.from(elem.children)[0].tagName === 'IMG')
					// must be an image
					entry.img = elem.children[0].src;
				// must be word cat or notes or etym...
				else if (afterDefList) // notes
					entry.notes = elem.innerHTML;
				// must be word cat or etym...
				else if (elem.innerHTML.toLowerCase().includes('etymology')) // etym
					entry.etym = elem.innerHTML.replace('Etymology: ', ''); // redundant
				else
					entry.cat = elem.innerHTML;
				break;
		}
	});
	// now we got our string in entryString
	download(JSON.stringify(dictionary), 'eremoran.json', 'application/json');
}

/**
 * @param {HTMLOListElement} elem
 */
function defListToObj(elem){
	return Array.from(elem.children).map(li => li.innerHTML); // .join(';')
}

/*
function entryToString(entry){
	let s = `${entry.title}=${entry.cat}=${entry.defList}`;
	if (s.etym)
		s += `;!${s.etym}`;
	if (s.notes)
		s += `;!${s.notes}`;
	return s;
}
*/

/* MAXIMAL EXAMPLE
esokhu=v, 1=approach, attempt, try;!e + sokhu
<dt>bokusam</dt>
	<dd>Etymology: <em>bo</em> 'with' + Proto-Eremo-Numoran *kusam 'many'</dd>
	<dd>n., 5th</dd>
	<dd>
		<ol>
			<li>a large quantity, many
				<ul>
					<li class="eremoran">mor i bokusam</li>
					<li>There are many people.</li>
				</ul>
			</li>
		</ol>
	</dd>
	<dd>cf. <em>udou</em>, the adjective form, and <em>pukusam</em>, the opposite form</dd>
*/