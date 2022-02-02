/* eslint-disable comma-dangle, no-var */
/* jshint esversion: 3, strict: true, strict: global, eqeqeq: true */
/* exported holidayCSS, oneiaTime, oneiaTimeInitialize */
'use strict';

var constants = {
	earth: {
		vernal: 6884100000, // ms after first vernal equinox 20 Mar 16:15 (2018)
		year: 31556952000, // ms
	},
	eremor: {
		base: 10,
		places: 5,
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
		atEpoch: 1150,
		day: 105583056.7402678, // ms; solar day; the sideral day is 104148 s
		epoch: 1497151176000, // ms; SUN 2017 JUN 11 03:19:36 UTC
		year: 7662598895.79935, // ms; oneian orbital period
	},
	week: 7 * 24 * 60 * 60 * 1000, // ms
};

var phases = [
	'New', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous',
	'Full', 'Waning Gibbous', 'Third Quarter', 'Waning Crescent'
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
		if (moonPhase(d = new Date(year, 0, 21+i)) < moonPhase(d = new Date(year, 0, 20+i)))
			return d;
}

function oneiaTimeInitialize(){
	var remainder = Date.now()-constants.oneia.epoch;
	remainder = remainder % constants.oneia.year;
	var yearprogress = remainder/constants.oneia.year;
	remainder = remainder % constants.oneia.day;
	var cnikkiphase = mod(remainder/constants.oneia.day-constants.nikki.epoch, 1);
	var nikkiphase = mod(Math.round(8*cnikkiphase), 8); // needs another mod in case it rounds up to 8
	var moonphase = Math.round(8*moonPhase(Date.now())) % 8;
	// eremor time
	document.getElementById('clock_eremor_title').innerHTML = '<img src="img/phase/'+nikkiphase +
		'.png" height="9" width="9" alt="Nikki Phase: '+phases[nikkiphase]+'" title="Nikki Phase: ' +
		phases[nikkiphase]+'"> Eremoran Time:';
	document.getElementById('clock_eremor_progress').value = yearprogress;
	// earth time
	document.getElementById('clock_earth_title').innerHTML = '<img src="img/phase/'+moonphase +
		'.png" height="9" width="9" alt="Moon Phase: '+phases[moonphase]+'" title="Moon Phase: ' +
		phases[moonphase]+'"> Earth Time:';
	document.getElementById('clock_earth_progress').value = (Date.now()-constants.earth.vernal) % constants.earth.year/constants.earth.year;
}

function oneiaTime(){
	var remainder = Date.now()-constants.oneia.epoch;
	var years = constants.oneia.atEpoch+Math.floor(remainder/constants.oneia.year);
	remainder = remainder % constants.oneia.year;
	var days = Math.floor(remainder/constants.oneia.day);
	remainder = remainder % constants.oneia.day;
	var currentTimeString = years + ' AT, Day ' + days + ', ';

	for (var i = 1; i < constants.eremor.places+1; i += 1){
		// oneian clock is conveniently decimal... :^)
		currentTimeString += Math.floor(remainder/
			(constants.oneia.day/Math.pow(constants.eremor.base, i)));
		if (i < constants.eremor.places)
			currentTimeString += ':';
		remainder = remainder % (constants.oneia.day/Math.pow(constants.eremor.base, i));
	}

	document.getElementById('clock_eremor_date').innerHTML = currentTimeString;
	document.getElementById('clock_earth_date').innerHTML = new Date().toLocaleString('en-US', {
		weekday: 'short', year: 'numeric', month: 'short', day: '2-digit',
		hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit'
	}).replace(/,/g, '');
}

function holidayCSS(){
	var year = new Date().getFullYear();
	var month = new Date().getMonth() + 1;
	var day = new Date().getDate();
	// chinese new year stuff
	var cny = getChineseNewYear(year);
	var wkBefCNY = new Date(cny - constants.week);
	var wkAftCNY = new Date(+cny + constants.week);
	function runCny(){
		var animal = 'Monkey Rooster Dog Pig Rat Ox Tiger Rabbit Dragon Snake Horse Goat'.split(' ')[year % 12];
		img.style.filter = 'hue-rotate(225deg)';
		img.style.borderRadius = '30px';
		img.style.backgroundColor = '#082';
		img.style.maskImage = 'linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(0, 0, 0, 1), rgba(0, 0, 0, 0))';
		title = 'Year of the ' + animal;
		// to counteract valentines:
		src = defaultSrc;
	}

	var title = '';
	var defaultSrc = 'mo';
	var src = defaultSrc;
	var img = document.getElementById('m');
	switch (month){
		case 2:
			// valentines
			src = 'mochentines';
			title = 'Fuck merrily!';
			// special day stuff
			if (day === 4)
				title = 'Day of the Republic. Wiwie Erdeka! Long live the RTC!';
			break;
		case 3:
			src = 'mochricks';
			if (day === 17)
				title = 'Drink, ye bastard!';
			else if (day === 20)
				title = 'Happy vernal equinox ' + year + '!';
			break;
		case 4:
			if (day === 1){
				document.getElementById('title').innerHTML = 'Schmocha&rsquo;s Site';
				img.style.transform = 'rotate(180deg)';
				document.getElementById('subtitle').innerHTML = document.getElementById('subtitle').innerHTML.split('').reverse().join('');
			}
			else if (day === 5)
				title = 'Live long and prosper. 2063 - Forever';
			break;
		case 5:
			if (day === 29)
				title = 'Roma renascetur';
			break;
		case 6:
			src = 'mogay';
			if (day === 20 + (0 < year % 4))
				title = 'Happy summer solstice ' + year + '!';
			else if (day === 23)
				title = 'Happy birthday, MochaFiction Wiki! 2011-' + year;
			else
				title = 'Everyone gets a nice big hug!';
			break;
		case 7:
			if (day === 12)
				title = 'King Witold\'s Birthday';
			break;
		case 9:
			if (day === 19)
				title = 'Yarrrr!';
			else if (day === 22 + (1 < year % 4))
				title = 'Happy autumnal equinox ' + year + '!';
			break;
		case 10:
			src = 'mochaween';
			if (day === 18)
				title = 'Memorial Day for the Victims of the Bombing of Łódź';
			else
				title = 'Boo, motherfucker!';
			break;
		case 11:
			if (day === 7)
				title = 'The Feast of Boris is today! \'Tis the season to be gorging!';
			else if (day === 11){
				title = '1918 - ' + year;
				img.style.filter = 'hue-rotate(180deg)';
			}
			else if (day === 14)
				title = '<3';
			break;
		case 12:
			src = 'mochristmas';
			if (day === 4)
				title = 'Today is Yuletide! Roast marshmallows and listen to spooky ghost stories in Seaside Town!';
			else if (day === 21 + (year % 4 === 3))
				title = 'Happy winter solstice ' + year + '!';
			else if (17 <= day && day < 23)
				title = 'Have a joyous Saturnalia!';
			else if (day === 23)
				title = 'Happy Festivus!';
			else if (day === 31)
				title = 'Party Time!';
			else
				title = 'Have a frosty winter solstice!';
			break;
	}

	// compute Chinese new year
	if (wkBefCNY < Date.now() && Date.now() < wkAftCNY)
		runCny();

	img.title = title;
	if (src !== defaultSrc)
		img.src = 'img/'+src+'.png';

	if (day === 11*month-17 && day === month*month + 3*month - 1)
		img.outerHTML = '<img id="m" src="img/mopril.png" width="200" alt="Mochadian Birthday Squiggle" onmouseover="playSound(\'sfx\')" onmouseout="stopSound(\'sfx\')"> <audio id="sfx" src="snd/partyhorn.mp3"/>';
}

// run
holidayCSS();
oneiaTimeInitialize();
setInterval(oneiaTime, 100);