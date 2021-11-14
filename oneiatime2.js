/* eslint-disable comma-dangle, no-var */
/* jshint esversion: 3, strict: true, strict: global, eqeqeq: true */
/* exported holidayCSS, oneiaTime, oneiaTimeInitialize */
'use strict';

var vernal = 6884100000; // ms after first vernal equinox 20 Mar 16:15 (2018)

var phases = [
	'New', 'Waxing Crescent', 'First Quarter', ' Waxing Gibbous',
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

function oneiaTimeInitialize(){
	var epoch =	1497151176; // SUN 2017 JUN 11 03:19:36 UTC
	var year =	7662598.89579935; // oneian orbital period
	var day =	105583.0567402678; // solar day; the sideral day is 104148 s

	var currenttime = Date.now()/1000;
	// 00:00 is at roughly local noon
	var remainder = currenttime-epoch;
	remainder = remainder % year;
	var yearprogress = remainder/year;
	remainder = remainder % day;
	var cnikkiphase = mod(remainder/day-0.078, 1);
	var nikkiphase = mod(Math.round(8*cnikkiphase), 8); // idk why it needs another mod, but the code breaks without it
	var yy = 31556952000;
	// 642900 = 7 Jan 1970 10:35:00 UTC
	// 2551442.9 = Lunar Synodic Period
	var moonphase = Math.round(8*((currenttime-642900) % 2551442.9)/2551442.9) % 8;
	// eremor time
	document.getElementById('clock_eremor_title').innerHTML = '<img src="img/phase/'+nikkiphase +
		'.png" height="9" width="9" alt="Nikki Phase: '+phases[nikkiphase]+'" title="Nikki Phase: ' +
		phases[nikkiphase]+'"> Eremoran Time:';
	document.getElementById('clock_eremor_progress').value = yearprogress;
	// earth time
	document.getElementById('clock_earth_title').innerHTML = '<img src="img/phase/'+moonphase +
		'.png" height="9" width="9" alt="Moon Phase: '+phases[moonphase]+'" title="Moon Phase: ' +
		phases[moonphase]+'"> Earth Time:';
	document.getElementById('clock_earth_progress').value = (Date.now()-vernal) % yy/yy;
}

function oneiaTime(){
	var epoch =	1497151176; // SUN 2017 JUN 11 03:19:36 UTC
	var year =	7662598.89579935; // oneian orbital period
	var day =	105583.0567402678; // solar day; the sideral day is 104148 s

	var currenttime = Date.now()/1000;
	// 00:00 is at roughly local noon
	var remainder = currenttime-epoch;
	var years = 950+Math.floor(remainder/year);
	remainder = remainder % year;
	var days = Math.floor(remainder/day);
	remainder = remainder % day;
	var currentTimeString = years + ' AT, Day ' + days + ', ';

	for (var i = 1; i < 6; i += 1){
		// oneian clock is conveniently decimal... :^)
		currentTimeString += Math.floor(remainder/(day/Math.pow(10, i)))+(i !== 5 ? ':' : '');
		remainder = remainder % (day/Math.pow(10, i));
	}

	var timetime = new Date().toString();
	var utc1 = timetime.slice(0, 16);
	var utc2 = timetime.slice(16, 18);
	var utc3 = timetime.slice(18, 24);

	var medidiem = utc2 > 11 ? ' PM' : ' AM';
	utc2 = utc2 > 12 ? utc2-12 : utc2;

	document.getElementById('clock_eremor_date').innerHTML = currentTimeString;
	document.getElementById('clock_earth_date').innerHTML = utc1+utc2+utc3+medidiem;
}

function holidayCSS(){
	var year = new Date().getFullYear();
	var month = new Date().getMonth() + 1;
	var day = new Date().getDate();
	// console.log(month, day);

	var title = '';
	var defaultSrc = 'mo';
	var src = defaultSrc;
	var img = document.getElementById('m');
	switch (month){
		case 2:
			src = 'mochentines';
			if (day === 4)
				title = 'Day of the Republic. Wiwie Erdeka! Long live the RTC!';
			else
				title = 'Fuck merrily!';
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