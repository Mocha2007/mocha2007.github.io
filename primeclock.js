/* eslint-disable comma-dangle, no-var, prefer-arrow-callback */
/* eslint-env es3 */
/* jshint esversion: 3, strict: true, strict: global */
/* globals a, currentyear, diff, events */
/* exported primeclock, enableDebug */
'use strict';
var isLeapYear = new Date(currentyear, 1, 29).getDate() === 29;
/** @type {365|366} number of days this year */
var days = isLeapYear ? 366 : 365;
/** @type {31622400|31536000} number of seconds this year, eg. 31622400 = 366 * 86400 */
var seconds = 86400*(isLeapYear?366:365);
var cye = new Date(currentyear+'-01-01T00:00:00')/1000; // current year epoch - jan 1 XXXX 00:00 local
// new Date("2020-01-01T00:00:00")
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
	[diff(628387200), 'information'], // 1990
	[0, 'future']
];

/**
 * @param {number} a
 * @param {number} b
 * @return {number}
 *
function gcd(a, b){
	return b ? gcd(b, a % b) : a;
}*/

/** @param {number} n */
function factorize(n){
	// only works for natual numbers greater than one
	/** @type {number[][]} */
	var pf = [];
	var t = 2;
	while (t*t <= n){
		if (n%t===0){
			if (pf.length && pf[pf.length-1][0]===t)
				pf[pf.length-1][1]++;
			else
				pf.push([t, 1]);
			n /= t;
		}
		else
			t += t === 2 ? 1 : 2;
	}
	if (pf.length && pf[pf.length-1][0]===n)
		pf[pf.length-1][1]++;
	else
		pf.push([n, 1]);
	return pf;
}

/** @param {number[][]} factorization */
function getFactorN(factorization){
	// eslint-disable-next-line brace-style
	return factorization.map(function(xn){return xn[1];}).reduce(function(a, b){return a+b;}, 0);
}

/**
 * @param {string} s
 * @return {string}
*/
function commaconvert(s){
	s = s.split('');
	var n = 0;
	for (var i=0; i<s.length; i++)
		if (s[i]===',')
			s[i]= n++ % 2 ? ' &times; ' : '^';
	return s.join('');
}

/**
 * @param {number} n max (exclusive)
 * @returns {number[]}
 * */
function range(n){
	// eslint-disable-next-line prefer-spread
	return Array.apply(null, {length: n}).map(Number.call, Number);
}

/*
x is seconds since 1 Jan
y is seconds before 2018

ae^-(bx/year) = y

ae^-(bx/year) = 14e9 * year

a = 14e9
*/

/** @return {number} seconds since year beginning */
function timeSinceYear(){
	return new Date()/1000-cye;
}

/** @param {number} y */
function ialc(y){
	// logarithmically maps time from the beginning (1 Jan) to 1 yr ago (31 Dec)
	var otherx = timeSinceYear(); // REAL seconds since year beginning
	var x = Math.floor(seconds*(1-Math.log(y)/Math.log(a))); // FAKE seconds after beginning of year
	var wannadate = new Date(Date.now()-1000*(otherx-x)); // convert FAKE 2 DATE
	return String(wannadate).slice(4, 24)
		.replace(new Date().getFullYear()+' ', '');
}

/**
 * @param {number} age
 * @return {string}
*/
function getClass(age){
	if (color)
		for (var i=0; i<geoera.length; i++)
			if (geoera[i][0] < age)
				return geoera[i-1][1];
	return 'none';
}

function alc(){
	var x = timeSinceYear(); // seconds since year beginning
	var y = Math.pow(a, 1-x/seconds);
	var str = '';
	for (var i=0; i<events.length; i++){
		if (debug || events[i][0]>y)
			str += '<div class="' + getClass(events[i][0]) + '">'
				+ ialc(events[i][0]) + ' - ' + events[i][1] + '</div>';
		else
			break;
	}
	var alcElem = document.getElementById('alc');
	alcElem.innerHTML = str;
	var nowTime = document.createElement('span');
	nowTime.id = 'nowtime';
	alcElem.appendChild(nowTime);
	// now create key
	for (var j=0; j<geoera.length-1; j++){
		// create div
		var elem = document.createElement('div');
		// add class
		/** @type {string} */
		var name = geoera[j][1];
		elem.classList.add(name);
		// create link
		var link = document.createElement('a');
		link.href = 'https://en.wikipedia.org/wiki/' + name;
		if (j === 0 || 24 < j)
			link.href += '_era';
		link.innerHTML = name;
		elem.appendChild(link);
		// add as child to #key
		document.getElementById('key').appendChild(elem);
	}
}

function header(){
	var sec = Math.floor(new Date()/1000);
	var str = factorize(sec);
	var factorization = commaconvert(String(str)).replace(/\^1/g, '')
		.replace(/\^/g, '<sup>').replace(/\s&times;/g, '</sup> &times;');
	var factors = getFactorN(str);

	var title = document.getElementById('c1');
	title.innerHTML = sec;
	title.className = factors === 1
		? 'prime'
		: factors === 2
			? 'semiprime'
			: factors === 3
				? 'sphenic' : 'composite';
	document.getElementById('c2Inner').innerHTML = factorization;
}

/** @param {number} r - years before present */
function getDateBeforeNow(r){
	var now = new Date();
	var y = now.getFullYear() - Math.floor(r);
	r -= Math.floor(r);
	r *= 12;
	var mo = now.getMonth() - Math.floor(r);
	r -= Math.floor(r);
	r *= 365.2425/12;
	var d = now.getDay() - Math.floor(r);
	r -= Math.floor(r);
	r *= 24;
	var h = now.getHours() - Math.floor(r);
	r -= Math.floor(r);
	r *= 60;
	var min = now.getMinutes() - Math.floor(r);
	r -= Math.floor(r);
	r *= 60;
	return new Date(y, mo, d, h, min, r);
}

function footer(){
	var y = Math.pow(a, 1-timeSinceYear()/seconds);
	var yprime = Math.round(y*Math.log(a)).toLocaleString();
	var dateString = String(getDateBeforeNow(y)).slice(4, 24) + ' ';

	document.getElementById('nowtime').innerHTML = String(new Date()).slice(4, 24)
		.replace(new Date().getFullYear()+' ', '')
		+ ' - '+(dateString[0] === 'l' ? '' : dateString)
		+ '('+Math.round(y).toLocaleString()+' Years Ago, '+yprime+'x Speed)';
}

/** find dates without events */
function checkDates(){
	// https://stackoverflow.com/a/8619946
	function getDay(now){
		var start = new Date(now.getFullYear(), 0, 0);
		var diff = now - start
			+ (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
		var oneDay = 1000 * 60 * 60 * 24;
		return Math.floor(diff / oneDay);
	}
	var s = range(days).map(function(x){
		return x+1;
	});
	events.forEach(function(e){
		var i = s.indexOf(getDay(new Date(currentyear + ' ' + ialc(e[0]))));
		if (-1 < i)
			s.splice(i, 1);
	});
	console.info('Missing days:');
	s.forEach(function(x){
		console.info(new Date(currentyear, 0, x));
	});
}

function enableDebug(){
	debug = true;
	alc();
	checkDates();
}

alc();
header();
setInterval(header, 1000);
setInterval(footer, 50);