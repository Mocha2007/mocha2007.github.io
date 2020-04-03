/* eslint-disable no-var */
/* jshint esversion: 3, strict: true, strict: global, eqeqeq: true */
/* exported tabledelta, vowelstats */
'use strict';
var alphabet = 'abcdefghijklmnopqrstuvwxyz';

function freqcalc(){
	/** @type {number[]} */
	var letterindex = [];
	var bigdick = '';
	/** @type {(HTMLParagraphElement|HTMLPreElement)[]} */
	var corpora = Array.prototype.slice.call(document.getElementsByClassName('corpus'));
	corpora.forEach(function(corpus){
		bigdick += corpus.innerHTML.toLowerCase();
	});
	var s = 0;
	alphabet.split('').forEach(function(letter){
		var count = (bigdick.match(new RegExp(letter, 'g')) || []).length;
		letterindex[letter] = count;
		s += count;
	});
	document.getElementById('lettercount').innerHTML = s;
	document.getElementById('wordcount').innerHTML = bigdick.match(/\s/g).length;
	for (var k in letterindex){ // for no fucking reason a foreach breaks this
		letterindex[k] = letterindex[k]/s;
		letterindex[k] = Math.round(letterindex[k]*100000)/1000;
	}
	return letterindex;
}

var oof = freqcalc();

function delta(a, b){
	return b>a?Math.round(100*(b/a-1)):Math.round(100*(1-b/a));
}

function tabledelta(){
	var aft, bef, child;
	var t = document.getElementById('letterstats');
	for (var i in t.children[0].children){
		child = t.children[0].children[i];
		try {
			if (child.className !== ''){
				// work on col 3
				child.children[3].innerHTML = oof[alphabet[i-1]];
				// work on col 2
				bef = Number(child.children[1].innerHTML)/100;
				aft = Number(child.children[3].innerHTML)/100;
				child.children[2].innerHTML = delta(bef, aft);
				if (aft > bef){
					child.className = 'tintgreen';
				}
			}
		}
		catch (TypeError){
			break;
		}
	}
	return false;
}

function getIPA(matchstring){
	// matchstring is a match like "aad" or "ang"
	// it NEEDS the next two characters
	switch (matchstring.charAt(0)){
		case 'a':
			switch (matchstring.charAt(1)){
				case ' ':
					return 'ɑ';
				case 'a':
					return 'ɑ';
				case 'i':
					return 'ai';
				case 'r':
					return 'ɑ';
				case 'u':
					return 'au';
				default:
					return 'æ';
			}
		case 'e':
			switch (matchstring.charAt(1)){
				case ' ':
					return 'e';
				case 'e':
					return 'e';
				case 'N':
					return 'e';
				case 'r':
					return 'e';
				default:
					return 'ɛ';
			}
		case 'i':
			switch (matchstring.charAt(1)){
				case ' ':
					return 'i';
				case 'i':
					return 'i';
				case 'N':
					return 'i';
				case 'r':
					return 'i';
				default:
					return 'ɪ';
			}
		case 'o':
			switch (matchstring.charAt(1)){
				case ' ':
					return 'o';
				case 'i':
					return 'oi';
				case 'o':
					return 'o';
				case 'l':
					return 'o';
				case 'N':
					return 'o';
				case 'r':
					return 'o';
				default:
					return 'ʌ';
			}
		case 'u':
			switch (matchstring.charAt(1)){
				case 'u':
					return 'u';
				default:
					return 'ə';
			}
		default:
			console.warn(matchstring);
			return '';
	}
}

function getvowels(corpus){
	// returns an array of all vowelthingies
	corpus = corpus.toLowerCase();
	corpus = corpus.replace('ng', 'N');
	corpus = corpus.replace('-', ' ');
	corpus = corpus.replace('\t', ' ');
	corpus = corpus.replace('\n', ' ');
	return corpus.match(/[ao]i|au|([aeiou])\1?[^aeiou]?/g);
}

function vowelstats(){
	var corpus;
	var bigdick = '';
	var corpora = document.getElementsByClassName('corpus');
	for (var i in corpora){
		corpus = corpora[i];
		try {
			bigdick += corpus.innerHTML.toLowerCase();
		}
		catch (TypeError){
			break;
		}
	}
	var vowels = getvowels(bigdick).map(getIPA); // array of all vowels used
	var newrow, v;
	var summation = 0;
	for (var j in vowels){
		summation += 1;
		v = vowels[j];
		if (document.getElementById(v) === null){
			newrow = document.createElement('tr');
			newrow.id = v;
			newrow.innerHTML = '<td>'+v+'</td><td id=%'+v+'>1</td>';
			document.getElementById('vowelstats').appendChild(newrow);
		}
		else {
			document.getElementById('%'+v).innerHTML = Number(document.getElementById('%'+v).innerHTML) + 1;
		}
	}
	document.getElementById('vcount').innerHTML = summation;
	var colstring, element, fraction, percentage;
	for (var k in document.getElementById('vowelstats').getElementsByTagName('tr')){
		element = document.getElementById('vowelstats').getElementsByTagName('tr')[k];
		if (typeof element.childNodes !== 'undefined'){
			percentage = element.childNodes[1];
			if (percentage.innerHTML !== 'Vowel'){
				fraction = Number(percentage.innerHTML) / summation;
				colstring = Math.round(Math.min(fraction*2550, 255)).toString(16);
				colstring = colstring.length === 2 ? colstring : '0'+colstring;
				element.bgColor = '#ff' + colstring + colstring;
				percentage.innerHTML = Math.round(fraction * 100000) / 1000;
			}
			else {
				element.bgColor = '#fff';
			}
		}
	}
}