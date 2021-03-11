/* exported compileDict, compileInitials, compileMedials, compileFinals */

"use strict";

// tools for main
const p = document.getElementById("wordlist");

function dict(){
	return new Array(...
		document.getElementsByClassName('dictionary')[0].getElementsByTagName('dt')
	).map(e => e.innerHTML);
}

// main
function compileDict(){
	p.innerHTML = dict().join(" ");
}

function compileFinals(){
	p.innerHTML = dict().map(w => w[w.length-1]).join("");
}

function compileInitials(){
	p.innerHTML = dict().map(w => w[0]).join("");
}

function compileMedials(){
	p.innerHTML = dict().map(w => w.slice(1, -1)).join("");
}