var alphabet = 'abcdefghijklmnopqrstuvwxyz';

function freqcalc(){
	"use strict";
	var letterindex = [];
	var corpus, count, letter;
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
	var s = 0;
	for (var i in alphabet){
		letter = alphabet[i];
		count = (bigdick.match(new RegExp(letter,'g')) || []).length;
		letterindex[letter] = count;
		s += count;
	}
	document.getElementById('lettercount').innerHTML = s;
	document.getElementById('wordcount').innerHTML = (bigdick.match(/\s/g)).length;
	for (var i in letterindex){
		letterindex[i] = letterindex[i]/s;
		letterindex[i] = Math.round(letterindex[i]*100000)/1000;
	}
	return letterindex;
}

var oof = freqcalc();

function delta(a,b){
	"use strict";
	return (b>a)?Math.round(100*(b/a-1)):Math.round(100*(1-b/a));
}

function tabledelta(){
	"use strict";
	var child,bef,aft;
	var t = document.getElementById('letterstats');
	for (var i in t.children[0].children){
		child = t.children[0].children[i];
		try {
			if (child.className !== ""){
				// work on col 3
				child.children[3].innerHTML = oof[alphabet[i-1]];
				// work on col 2
				bef = Number(child.children[1].innerHTML)/100;
				aft = Number(child.children[3].innerHTML)/100;
				child.children[2].innerHTML = delta(bef,aft);
				if (aft > bef){
					child.className = "green";
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
	"use strict";
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
	"use strict";
	// returns an array of all vowelthingies
	corpus = corpus.toLowerCase();
	corpus = corpus.replace('ng', 'N');
	corpus = corpus.replace('-', ' ');
	corpus = corpus.replace('\t', ' ');
	corpus = corpus.replace('\n', ' ');
	return corpus.match(/[ao]i|au|([aeiou])\1?[^aeiou]?/g);
}

function vowelstats(){
	"use strict";
	var letterindex = [];
	var corpus, count, letter;
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
	for (var i in vowels){
		summation += 1;
		v = vowels[i];
		if (document.getElementById(v) === null){
			newrow = document.createElement("tr");
			newrow.id = v;
			newrow.innerHTML = "<td>"+v+"</td><td id=%"+v+">1</td>";
			document.getElementById("vowelstats").appendChild(newrow);
		}
		else {
			document.getElementById('%'+v).innerHTML = Number(document.getElementById('%'+v).innerHTML) + 1;
		}
	}
	document.getElementById('vcount').innerHTML = summation;
	var colstring, element, fraction, percentage;
	for (var i in document.getElementById("vowelstats").getElementsByTagName("tr")){
		element = document.getElementById("vowelstats").getElementsByTagName("tr")[i];
		if (element.childNodes !== undefined){
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