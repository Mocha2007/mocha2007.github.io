/* eslint-disable no-var */
/* jshint esversion: 3, strict: true, strict: global */
'use strict';

function makeTOC(){
	var namedheaders = document.querySelectorAll('h1[id],h2[id],h3[id],h4[id],h5[id],h6[id],span.sub,span.super');
	var text = '<details><summary>Navigation</summary><div class="desc"><a href="'
		+ window.location.origin + '/index.html">Home</a></div>On This Page<br/>';
	var depth, formattedname, i;
	for (i=0; i<namedheaders.length; i += 1){
		if (namedheaders[i].tagName === 'SPAN'){
			namedheaders[i].id = namedheaders[i].innerHTML.replace(/\s/g, '_');
			formattedname = namedheaders[i].innerHTML;
			depth = namedheaders[i].className === 'super' ? '2' : '3';
		}
		else {
			formattedname = namedheaders[i].id.replace(/_/g, ' ');
			depth = namedheaders[i].tagName.slice(-1);
		}
		text += '<span class="nav'+depth+'"><a href="#'+namedheaders[i].id+'">'+formattedname+'</a></span><br>';
		// console.log('\t'.repeat(parseInt(depth, 10)-1), formattedname);
	}
	text += '</details>';
	document.getElementById('nav').innerHTML = text;
}

window.onload = makeTOC;