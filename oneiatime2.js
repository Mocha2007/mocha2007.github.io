/* eslint-disable no-var */
/* eslint-env es3 */
/* jshint esversion: 3, strict: true, strict: global, eqeqeq: true */
/* global phoonsvg */
/* exported holidayCSS, oneiaTime, oneiaTimeInitialize, playSound, stopSound */
'use strict';

var constants = {
	earth: {
		winter: 1513873380000, // ms winter solstace 21 Dec 2017 @ 16:23 UTC
		year: 31556952000, // ms
	},
	eremor: {
		// eremoran timekeeping is conveniently decimal... :^)
		base: 10,
		places: 5,
		seasons: ['Stum', 'Reram', 'Kokum'],
		seasonsAlt: ['Sowing', 'Harvest', 'Flood'],
		week: ['Nodrilm', 'Rilrilm', 'Kopkêrilm', 'Kosurilm', 'Bikêrilm', 'Samarrilm'],
	},
	moon: {
		epoch: 642900000, // ms; 7 Jan 1970 10:35:00 UTC
		period: 2551442890, // ms orbital period; Lunar Synodic Period
	},
	nikki: {
		epoch: 0.078, // fraction of orbit period?
	},
	oneia: {
		// 00:00 is at roughly local noon
		atEpoch: 1750,
		day: 105583056.7402678, // ms; solar day; the sideral day is 104148 s
		epoch: 1497151176000, // ms; SUN 2017 JUN 11 03:19:36 UTC
		year: 105583056.7402678 * (72.5 + 1/30), // ms; 72.52 local days; oneian tropical year = 7656856407.307186 s
	},
	timeOfDay: [
		// each represents a 3h period on earth
		'Dawn', 'Late Morning', 'Noon', 'Afternoon', 'Dusk', 'Evening', 'Midnight', 'Early Morning',
	],
	week: 7 * 24 * 60 * 60 * 1000, // ms
};

var phases = [
	'New', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous',
	'Full', 'Waning Gibbous', 'Third Quarter', 'Waning Crescent',
];

/**
 * https://stackoverflow.com/questions/4467539/javascript-modulo-gives-a-negative-result-for-negative-numbers/17323608#17323608
 * Fixes a bug in javascript where the entire fucking language is retarded and should burn in hell for all eternity.
 * @param {number} n - dividend
 * @param {number} m - divisor
*/
function mod(n, m){
	return (n % m + m) % m;
}


/** @param {string} id of audio to play */
function playSound(id){ // used in bd easter egg
	document.getElementById(id).play();
}

/** @param {string} id of audio to play */
function stopSound(id){ // used in bd easter egg
	document.getElementById(id).pause();
	document.getElementById(id).currentTime = 0;
}

/**
 * gets the lunar phase [0, 1), starting at new
 * @param {Date} t a time
 */
function moonPhase(t){
	return mod(t - constants.moon.epoch, constants.moon.period) / constants.moon.period;
}

/** @param {number} year */
function getChineseNewYear(year){
	var d;
	for (var i = 0; i < 30; i++)
		// if yesterday's % is greater than today's, that means it must now be a new moon
		if (moonPhase(d = new Date(year, 0, 21+i)) < moonPhase(new Date(year, 0, 20+i)))
			return d;
}

function oneiaTimeInitialize(t){
	var remainder = t-constants.oneia.epoch;
	remainder %= constants.oneia.year;
	var yearprogress = remainder/constants.oneia.year;
	remainder %= constants.oneia.day;
	var cnikkiphase = mod(remainder/constants.oneia.day-constants.nikki.epoch, 1);
	var nikkiphase = mod(Math.round(8*cnikkiphase), 8); // needs another mod in case it rounds up to 8
	var cmoonphase = moonPhase(t);
	var moonphase = mod(Math.round(8*cmoonphase), 8);
	// eremor time
	var titleEre = document.getElementById('clock_eremor_title');
	titleEre.title = 'Nikki Phase: ' + phases[nikkiphase];
	titleEre.appendChild(phoonsvg(cnikkiphase));
	titleEre.innerHTML += ' Eremoran Time:';
	document.getElementById('clock_eremor_progress').value = yearprogress;
	updateEremoranDate(t);
	// earth time
	var titleEarth = document.getElementById('clock_earth_title');
	titleEarth.title = 'Moon Phase: ' + phases[moonphase];
	titleEarth.appendChild(phoonsvg(cmoonphase));
	titleEarth.innerHTML += ' Earth Time:';
	document.getElementById('clock_earth_progress').value
		= (t-constants.earth.winter) % constants.earth.year/constants.earth.year;
}

/**
 * @param {number} y year
 * @param {number} d day of the season (seasons all start on the same DoW)
 * @returns {string}
*/
function eremoranWeekday(y, d){
	/** this is needed to make this tool match erecal.js */
	var ADJUSTMENT = -1;
	var dominical = Math.floor(y/2) + Math.floor((y+29)/30); // would be % 6 but that's redundant
	return constants.eremor.week[(dominical + d + ADJUSTMENT) % 6];
}

function updateEremoranDate(t){
	var remainder = t-constants.oneia.epoch;
	var years = constants.oneia.atEpoch+Math.floor(remainder/constants.oneia.year);
	remainder = mod(remainder, constants.oneia.year); // this first mod needs the better command in case year < 2017
	var days = Math.floor(remainder/constants.oneia.day);
	remainder %= constants.oneia.day;
	var days_per_season = Math.floor(constants.oneia.year
		/ constants.oneia.day / constants.eremor.seasons.length);
	var seasonId = Math.floor(days / days_per_season);
	days %= days_per_season;
	days++; // 1-indexed, not 0-indexed
	var seasonString = (constants.eremor.seasons[seasonId] || '') + ' ('
		+ (constants.eremor.seasonsAlt[seasonId] || 'Intercalary Day') + ')';
	document.getElementById('clock_eremor_date').innerHTML = years
		+ ' AT, ' + seasonString + ',  Day ' + days + ' (' + eremoranWeekday(years, days) + '), '
		+ constants.timeOfDay[Math.floor(8*remainder/constants.oneia.day)];
}

function oneiaTime(){
	document.getElementById('clock_earth_date').innerHTML = new Date().toLocaleString('en-US', {
		weekday: 'short', year: 'numeric', month: 'short', day: '2-digit',
		hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit',
	}).replace(/,/g, '');
}

function holidayCSS(){
	var alreadyUsedCustomCss = false;
	function labor(s){
		title = s;
		src = defaultSrc;
		document.body.style.filter = 'invert(1)';
		img.classList.add('social'); // so it remains unaffected by the pinkening
		var a = Array.from(document.getElementsByClassName('highlight'));
		a.push(...document.getElementsByTagName('progress'));
		for (var i = 0; i < a.length; i++)
			a[i].style.filter = 'invert(1)';
		alreadyUsedCustomCss = true;
	}
	var year = new Date().getFullYear();
	var month = new Date().getMonth() + 1;
	var day = new Date().getDate();
	function addExtraCss(){
		var css = document.createElement('link');
		css.href = 'css/extra.css';
		css.type = 'text/css';
		css.rel = 'stylesheet';
		document.getElementsByTagName('head')[0].appendChild(css);
	}
	// chinese new year stuff
	var cny = getChineseNewYear(year);
	var wkBefCNY = new Date(cny - constants.week);
	var wkAftCNY = new Date(+cny + constants.week);
	function runCny(){
		var animal = 'Monkey Rooster Dog Pig Rat Ox Tiger Rabbit Dragon Snake Horse Goat'.split(' ')[year % 12];
		img.style.filter = 'hue-rotate(225deg)';
		img.style.borderRadius = '30px';
		img.style.backgroundColor = '#082';
		img.style.padding = '10px';
		img.style.maskImage = 'linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(0, 0, 0, 1), rgba(0, 0, 0, 0))';
		img.classList.add('cny'); // so it remains unaffected by the pinkening
		title = 'Year of the ' + animal;
		// to counteract valentines:
		src = defaultSrc;
		alreadyUsedCustomCss = true;
	}

	var title = '';
	var defaultSrc = 'mo';
	var src = defaultSrc;
	var img = document.getElementById('m');
	var sub = document.getElementById('subtitle');
	switch (month){
		// special day stuff
		// https://docs.google.com/spreadsheets/d/15MYULhkoJDUTCci5a-9HOGTNycCjcgiwt0N_-HAoPzI/edit#gid=0
		case 2:
			if (7 <= day && day < 21){ // Valentine's day is on the 14th - this is a week before/after
				src = 'mochentines';
				title = 'Fuck merrily!';
			}
			else if (day === 29)
				title = 'Huh. Well this doesn\'t happen very often, does it?';
			break;
		case 3:
			if (10 <= day && day < 24) // St. Patrick's day is on the 17th - this is a week before/after
				src = 'mochricks';
			if (day === 18)
				labor('Founding of the Paris Commune');
			else if (day === 20)
				title = 'Happy vernal equinox ' + year + '! Happy Nowruz!';
			else if (day === 31) // TDoV
				img.classList.add('trans');
			break;
		case 4:
			if (day === 1){
				var temp_s = document.getElementById('title').innerHTML;
				document.getElementById('title').innerHTML = 'Sch' + temp_s[0].toLowerCase() + temp_s.slice(1);
				addExtraCss();
				img.style.animation = 'rainbow 5s linear infinite'; // tried this for pride but it didn't look as good
				img.style.transform = 'rotate(180deg)';
				sub.innerHTML = sub.innerHTML.split('').reverse().join('');
			}
			else if (day === 5) // first contact
				title = 'Live long and prosper. 2063 - Forever';
			else if (day === 22)
				labor('Lenin\'s Birthday');
			else if (day === 27)
				img.outerHTML = '<img id="m" src="img/mopril.png" width="200" alt="Mochadian Birthday Squiggle" onmouseover="playSound(\'sfx\')" onmouseout="stopSound(\'sfx\')"> <audio id="sfx" src="snd/partyhorn.mp3"/>';
			break;
		case 5:
			if (day === 1)
				labor('International Workers\' Day');
			else if (day === 5)
				labor('Marx\'s Birthday');
			else if (day === 29)
				title = 'Roma renascetur';
			break;
		case 6:
			src = 'mogay';
			title = 'Everyone gets a nice big hug!';
			if (day === 20 + (0 < year % 4))
				title = 'Happy summer solstice ' + year + '!';
			else if (day === 23)
				title = 'Happy birthday, MochaFiction Wiki! 2011-' + year;
			break;
		case 8:
			if (day === 16){
				var dy = year - 2023;
				title = dy + ' year' + (dy === 1 ? '' : 's') + ' HRT!!! :D';
				img.classList.add('trans');
			}
			break;
		case 9:
			if (day === 4)
				title = 'Eremorôm ad olol subôm!~\n' + (year-2016) + ' years of Eremoran';
			else if (day === 19)
				title = 'Yarrrr!';
			else if (day === 22 + (1 < year % 4))
				title = 'Happy autumnal equinox ' + year + '!';
			break;
		case 10:
			if (15 < day){ // latter half of the month
				// src = 'mochaween';
				img.style.filter = 'hue-rotate(-180deg) saturate(3)';
				title = 'Boo, motherfucker!';
			}
			break;
		case 11:
			if (day === 7)
				labor('October Revolution and Trotsky\'s Birthday');
			else if (day === 14)
				title = '<3';
			else if (13 <= day && day <= 20) // Trans Awareness Week and TDoR
				img.classList.add('trans');
			break;
		case 12:
			src = 'mochristmas';
			if (day === 21 + (year % 4 === 3))
				title = 'Happy winter solstice ' + year + '!';
			else if (17 <= day && day < 23)
				title = 'Have a joyous Saturnalia!';
			else if (day === 23)
				title = 'Happy Festivus!';
			else if (day === 31)
				title = 'Party Time!';
			break;
	}


	img.title = title;
	// compute Chinese new year
	if (!alreadyUsedCustomCss && wkBefCNY < Date.now() && Date.now() < wkAftCNY)
		runCny();
	else if (src !== defaultSrc)
		img.src = 'img/'+src+'.png';
	/*
	else if (!alreadyUsedCustomCss && !img.classList.length){ // THE PINKENING
		// compute
		var pinkeningFactor = Math.max(0, Math.min(1,
			(Date.now() - new Date(2023, 7, 16))/(1*constants.earth.year) // 1 year hrt OwO
		));
		// pinkeningFactor = 1; // debug
		var p1 = 120*pinkeningFactor;
		var p2 = 100 - 50*pinkeningFactor;
		document.getElementById('top').style.filter = 'hue-rotate(' + p1 + 'deg) saturate(' + p2 + '%)';
	}*/
	// random bg
	if (!alreadyUsedCustomCss){
		holidayCSS.randomBg();
		document.getElementById('m_bg').addEventListener('animationend', holidayCSS.randomBg);
		// setInterval(holidayCSS.randomBg, 10000);
	}
}
holidayCSS.bgs = [
	'img/bg/40.png',
	'img/bg/500 BCE.png',
	// 'img/bg/1000 BCE.png',
	// 'img/bg/1500 BCE.png',
	'img/bg/buydiyhrt.png',
	'img/bg/chaos.png',
	'img/bg/draw.png',
	'img/bg/dv.png',
	'img/bg/escapism.png',
	'img/bg/mlsc.png',
	'img/bg/page0.png',
	'img/bg/tetrahedron.png',
	'img/bg/unwind_juice.png',
	// 'img/bg/warplan.png',
	'img/china_collapse_meme_ere.png',
	// 'img/density.png',
	'img/eisen_system.png',
	'img/moost/moost.PNG',
	// 'img/oneia_drawing_1.png',
	'img/pankair_biomes.png',
	'img/phones.svg',
	'https://i.imgur.com/bCXJRhu.png', // SA langs pre-columbian map
];
holidayCSS.randomBg = function(){
	var img = document.getElementById('m_bg');
	// choose a random DIFFERENT image... so index is [i+1, i+L-1]
	holidayCSS.currentBg += 1 + Math.floor(Math.random() * (holidayCSS.bgs.length - 1));
	holidayCSS.currentBg %= holidayCSS.bgs.length;
	img.src = holidayCSS.bgs[holidayCSS.currentBg];
	// reset anim
	// https://stackoverflow.com/a/45036752/2579798
	img.style.animation = 'none';
	img.offsetHeight; /* trigger reflow */
	img.style.animation = 'scroll 10s linear';
};
holidayCSS.currentBg = 0;

// run
holidayCSS();
oneiaTimeInitialize(Date.now());
oneiaTime();
setInterval(oneiaTime, 1000);
// phoonTest();