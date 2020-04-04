/* eslint-disable comma-dangle, no-var */
/* jshint esversion: 3, strict: true, strict: global */
/* globals a, currentyear, diff, events */
/* exported primeclock, enableDebug */
'use strict';
var year = 86400*(currentyear%400?currentyear%100?currentyear%4?365:366:365:366); // number of seconds in this year, eg. 31622400 = 366 * 86400
var cye = new Date(currentyear+'-01-01T00:00:00'+String(new Date()).slice(28, 33))/1000; // current year epoch - jan 1 XXXX 00:00 utc
var debug = false; // enable to see all events at any time
var color = true; // enable to have lines color-coded
/*
Jan	~ until Paleoproterozoic
Feb	~ until Permian
Mar	~ until Eocene
Apr	~ until Pliocene
May	~ until Chibanian
Jun	~ until Tarantian
Jul	~ until 20 kya
Aug	~ until Iron Age
Sep	~ until Enlightenment
Oct	~ until 50 years ago
Nov	~ until 7 years ago
Dec	~ until 1 year ago
*/
var geoera = [
	[a, 'cosmological'],
	[4.6e9, 'hadean'],
	[4e9, 'eoarchean'],
	[3.6e9, 'paleoarchean'],
	[3.2e9, 'mesoarchean'],
	[2.8e9, 'neoarchean'],
	[2.5e9, 'paleoproterozoic'],
	[1.6e9, 'mesoproterozoic'],
	[1e9, 'neoproterozoic'],
	[541e6, 'cambrian'],
	[485.4e6, 'ordovician'],
	[443.8e6, 'silurian'],
	[419.2e6, 'devonian'],
	[358.9e6, 'carboniferous'],
	[298.9e6, 'permian'],
	[251.902e6, 'triassic'],
	[201.3e6, 'jurassic'],
	[145e6, 'cretaceous'],
	[66e6, 'paleogene'],
	[23.03e6, 'neogene'],
	[2.588e6, 'gelasian'],
	[1.8e6, 'calabrian'],
	[773e3, 'chibanian'],
	[126e3, 'tarantian'],
	[11.7e3, 'holocene'], // early holocene only
	// currentyear = 1 CE
	[currentyear+5000, 'copper'],
	[currentyear+3300, 'bronze'],
	[currentyear+1300, 'classical'],
	[currentyear-476, 'medieval'],
	[currentyear-1453, 'renaissance'],
	[currentyear-1760, 'industrial'],
	[diff(-2955225600), 'modern'], // internal combustion engine
	[diff(-771984000), 'atomic'], // atom bomb
	[diff(831873600), 'information'], // archive.org
	[0, 'future']
];

function arraysEqual(arr1, arr2){
	if (arr1.length !== arr2.length){
		return false;
	}
	for (var i=0;i<arr1.length;i+=1){
		if (arr1[i] !== arr2[i]){
			return false;
		}
	}
	return true;
}

function gcd(a, b){
	if (b===0){
		return a;
	}
	return gcd(b, a%b);
}

function factorize(n){
	// only works for natual numbers greater than one
	var pf = [];
	var t = 2;
	while (t*t <= n){
		if (n%t===0){
			if (pf.length && pf[pf.length-1][0]===t){
				pf[pf.length-1][1]+=1;
			}
			else {
				pf.push([t, 1]);
			}
			n = n/t;
		}
		else {
			t+=t===2?1:2;
		}
	}
	if (pf.length && pf[pf.length-1][0]===n){
		pf[pf.length-1][1]+=1;
	}
	else {
		pf.push([n, 1]);
	}
	return pf;
}

function ispower(factorization){
	var powertable = factorization.map(function(x){
		return x[1];
	});
	var gggcd = 0;
	for (var i=0;i<powertable.length;i+=1){
		if (gggcd){
			gggcd = gcd(gggcd, powertable[i]);
		}
		else {
			gggcd = powertable[i];
		}
		if (gggcd===1){
			return false;
		}
	}
	return arraysEqual(new Array(factorization.length).fill(factorization[0][1]), powertable);
}

function issemiprime(factorization){
	if (factorization.length === 2 && factorization[0][1]+factorization[1][1] === 2){
		return true;
	}
	if (factorization.length === 1 && factorization[0][1] === 2){
		return true;
	}
	return false;
}

function commaconvert(s){
	s = s.split('');
	var n = 0;
	for (var i=0;i<s.length;i+=1){
		if (s[i]===','){
			if (n%2===0){
				s[i]='^';
			}
			else {
				s[i]=' &times; ';
			}
			n+=1;
		}
	}
	return s.join('');
}
/*
x is seconds since 1 Jan
y is seconds before 2018

ae^-(bx/year) = y

ae^-(bx/year) = 14e9 * year

a = 14e9
*/

function timeSinceYear(){ // seconds since year start
	return new Date()/1000-cye;
}

function ialc(y){
	// logarithmically maps time from the beginning (1 Jan) to 1 yr ago (31 Dec)
	var otherx = timeSinceYear(); // REAL seconds since year beginning
	var x = Math.floor(year*(1-Math.log(y)/Math.log(a))); // FAKE seconds after beginning of year
	var wannadate = new Date(Date.now()-1000*(otherx-x)); // convert FAKE 2 DATE
	return String(wannadate).slice(4, 24);
}

function getClass(age){
	if (color){
		for (var i=0; i<geoera.length; i+=1){
			if (geoera[i][0] < age){
				return geoera[i-1][1];
			}
		}
	}
	return 'none';
}

function alc(){
	var x = timeSinceYear(); // seconds since year beginning
	var y = Math.pow(a, 1-x/year);
	var str = '';
	for (var i=0;i<events.length;i+=1){
		if (debug || events[i][0]>y){
			str+='<div class="' + getClass(events[i][0]) + '">'+(i===0?'Jan 01 '+currentyear+' 00:00:00':ialc(events[i][0]))+' - '+events[i][1] + '</div>';
		}
		else {
			break;
		}
	}
	document.getElementById('alc').innerHTML = str+'<span id="nowtime"></span>';
	// now create key
	for (var j=0; j<geoera.length-1; j+=1){
		// create div
		var elem = document.createElement('div');
		// add class
		var name = geoera[j][1];
		elem.classList += name;
		// create link
		var link = document.createElement('a');
		link.href = 'https://en.wikipedia.org/wiki/' + name;
		if (j === 0 || 24 < j){
			link.href += '_era';
		}
		link.innerHTML = name;
		elem.appendChild(link);
		// add as child to #key
		document.getElementById('key').appendChild(elem);
	}
}

function primeclock(){ // can't use strict mode because of IE
	var sec = Math.floor(new Date()/1000);
	var str = factorize(sec);
	var factorization = commaconvert(String(str)).replace(/\^1/g, '').replace(/\^/g, '<sup>').replace(/\s&times;/g, '</sup> &times;');
	var isprime = factorization.length === String(sec).length;

	var title = document.getElementById('c1');
	title.innerHTML = sec;
	title.classList = [isprime?'prime':ispower(str)?'ppower':issemiprime(str)?'semiprime':'composite'];
	var buffer = '<sup class="invisible">1</sup>'; // necessary to prevent text from jumping up and down; sadly, no css solution possible
	document.getElementById('c2').innerHTML = buffer+factorization+buffer;

	var x = timeSinceYear(); // seconds since year beginning
	var y = Math.pow(a, 1-x/year);
	var yprime = Math.round(y*Math.log(a)*24*60*60).toLocaleString();

	document.getElementById('nowtime').innerHTML = String(new Date()).slice(4, 24)+' - Now ('+Math.round(y).toLocaleString()+') Years Ago ('+yprime+'x Speed)';
}

function enableDebug(){
	debug = true;
	alc();
}