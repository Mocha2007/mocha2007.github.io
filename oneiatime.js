/* eslint-disable comma-dangle, no-var */
/* jshint esversion: 3, strict: true, strict: global, eqeqeq: true */
/* exported bonus, holidayCSS, oneiaTime, oneiaTimeInitialize, playSound, stopSound */
'use strict';
var vernal = 6884100000; // ms after first vernal equinox 20 Mar 16:15 (2018)

var egyptmonths = [
	'Thoth', 'Paopi', 'Hathor', 'Koiak', 'Tobi', 'Meshir', 'Paremhat', 'Paremoude',
	'Pashons', 'Paoni', 'Epip', 'Mesori'
];
var egyptseasons = ['Akhet', 'Peret', 'Shemu'];
var chineseelements = [
	'Wood"><ruby>木<rt>き</rt></ruby>', 'Fire"><ruby>火<rt>ひ</rt></ruby>',
	'Earth"><ruby>土<rt>つち</rt></ruby>', 'Metal"><ruby>金<rt>か</rt></ruby>',
	'Water"><ruby>水<rt>みず</rt></ruby>'
];
var chinesesigns = [
	'Rat"><ruby>子<rt>ね</rt></ruby>', 'Ox"><ruby>丑<rt>うし</rt></ruby>',
	'Tiger"><ruby>寅<rt>とら</rt></ruby>', 'Rabbit"><ruby>卯<rt>う</rt></ruby>',
	'Dragon"><ruby>辰<rt>たつ</rt></ruby>', 'Snake"><ruby>巳<rt>み</rt></ruby>',
	'Horse"><ruby>午<rt>うま</rt></ruby>', 'Goat"><ruby>未<rt>ひつじ</rt></ruby>',
	'Monkey"><ruby>申<rt>さる</rt></ruby>', 'Rooster"><ruby>酉<rt>とり</rt></ruby>',
	'Dog"><ruby>戌<rt>いぬ</rt></ruby>', 'Pig"><ruby>亥<rt>い</rt></ruby>'
];
var signs = [
	'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
	'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];
var signelements = [
	'Fire (Enthusiasm; drive to express self; faith)',
	'Earth (Practicality; caution; material world)',
	'Air (Communication; socialization; conceptualization)',
	'Water (Emotion; empathy; sensitivity)'
];
var signqualities= [
	'Cardinal (active; self-motivated; insightful; ambitious)',
	'Fixed (stabilization; determination; depth; persistence)',
	'Mutable (adaptability; flexibility; sympathy)'
];
var signrulers= [
	'Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury',
	'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'
];
var marsmonths = [
	'Sagittarius', 'Dhanus', 'Capricornus', 'Makara', 'Aquarius', 'Kumbha',
	'Pisces', 'Mina', 'Aries', 'Mesha', 'Taurus', 'Rishabha',
	'Gemini', 'Mithuna', 'Cancer', 'Karka', 'Leo', 'Simha',
	'Virgo', 'Kanya', 'Libra', 'Tula', 'Scorpius', 'Vrishika'
];
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

/**
 * https://stackoverflow.com/questions/14926306/javascript-play-sound-on-hover-stop-and-reset-on-hoveroff/14926552#14926552
 * @param {string} elementId - id
*/
function playSound(elementId){
	document.getElementById(elementId).play();
}

/** @param {string} elementId - id */
function stopSound(elementId){
	/** @type {HTMLAudioElement} */
	var thissound = document.getElementById(elementId);
	thissound.pause();
	thissound.currentTime = 0;
}

function egypt(){
	var epoch =	21852000; // 1970 SEP 11 00:00:00 UTC+2; first akhet after epoch
	var reltime = mod(new Date()/1000-epoch, 31556952); // time (s) since beginning of akhet
	var wutwut = Math.floor(reltime/10518984); // season number
	var wutmonth = Math.floor(reltime/2629746); // month number
	var wutday = Math.floor(reltime/86400)-wutmonth*30; // day number
	return wutday+' '+egyptmonths[wutmonth]+' ('+egyptseasons[wutwut]+')';
}

function maya(){
	// 144000 days : 7200 days : 360 days : 20 days : day
	var epoch = 1356069600; // 13th b'ak'tun : 21 Dec 2012 00:00:00 UTC-6
	var remainder = Math.floor((new Date()/1000-epoch)/86400); // days since beginning of 13th b'ak'tun

	var mayaTime = [mod(remainder, 20)];
	var temp = Math.floor(remainder/20);

	mayaTime.unshift(mod(temp, 18));
	temp = Math.floor(temp/18);

	mayaTime.unshift(mod(temp, 20));
	temp = Math.floor(temp/20);

	mayaTime.unshift(mod(temp, 20));
	temp = Math.floor(temp/20);

	mayaTime.unshift(13+mod(temp, 20));
	return mayaTime.join(':');
}

function china(){
	// naive; does not account for time between new year's and chinese new year's well
	var epoch = 444440000; // appx 1 FEB 1984
	var y = Math.floor((new Date()/1000-epoch)/31556952); // years since epoch
	var yy = '<abbr title="'+(mod(y, 2)?'Yin"><ruby>兄<rt>え</rt></ruby>':'Yang"><ruby>弟<rt>と</rt></ruby>')+'</abbr>';
	var element = '<abbr title="'+chineseelements[mod(Math.floor(y/2), 5)]+'</abbr>の'+yy;
	var animal = '<abbr title="'+chinesesigns[mod(y, 12)]+'</abbr>';
	return [element, animal].join(' - ');
}

function zodiac(){
	var n = Math.floor(mod(new Date()-vernal, 31556952000)/2629746000); // sign number 0-11
	return '<abbr title="Element: '+signelements[mod(n, 4)]+'&#013;Quality: ' +
		signqualities[mod(n, 3)]+'&#013;Ruler: '+signrulers[n] +
		' (this planet\'s influence heightens when inside this constellation)&#013;Detriment: ' +
		signrulers[mod(n+6, 12)] + ' (this planet\'s influence weakens when inside this constellation)">' +
		signs[n]+'</abbr>';
}

function jd(){
	return new Date()/86400000+2440587.5;
}

/** @param {number} year */
function dhelp(){
	return 668.591;
	/*if (year < 2001){
		return (year-1)/2+year/10-year/100+year/1000;
	}
	if (year < 4801){
		return (year-1)/2+year/10-year/150;
	}
	if (year < 6801){
		return (year-1)/2+year/10-year/200;
	}
	if (year < 8401){
		return (year-1)/2+year/10-year/300;
	}
	return (year-1)/2+year/10-year/600;*/
}

/** @param {number} month */
function dhelp2(month){
	return mod(month, 6) === 5 ? 27 : 28;
}

/** @param {number} day */
function dhelp3(day){
	var m = 0;
	while (dhelp2(m) <= day){
		day -= dhelp2(m);
		m += 1;
	}
	return [m, Math.floor(day), Math.floor(mod(day, 1)*1000)];
}

function darian(){
	var sol = 88775244; // Martian Sol; milliseconds
	var n = (Number(new Date())+11392059672000)/sol; // sols past epoch
	var tn = n;
	var marsy = 0;
	var marsd = 0;
	while (dhelp(marsy+1) <= tn){
		tn -= dhelp(marsy+1);
		marsy += 1;
	}
	marsd = tn;
	var marsmonth = marsmonths[dhelp3(marsd)[0]];
	var marsday = dhelp3(marsd)[1]+1;
	var marshour = dhelp3(marsd)[2];
	return [marsday, marsmonth, marsy, marshour,
		'<a href="https://en.wikipedia.org/wiki/Darian_calendar">UMST</a>'].join(' ');
}

/** DF time */
function dorf(){
	var dorfMonths = [
		'Granite', 'Slate', 'Felsite', 'Hematite', 'Malachite', 'Galena',
		'Limestone', 'Sandstone', 'Timber', 'Moonstone', 'Opal', 'Obsidian',
	];
	var dorfSeasons = ['Spring', 'Summer', 'Autumn', 'Winter'];
	var dorfCaravans = ['Elven', 'Human', 'Dwarven', 'No'];
	var dorfSeasonModifiers = ['Early', 'Mid', 'Late'];
	var yearLength = 60*60*24*365.2425;
	var epoch = 1142878500; // 1:15 PM EST 20 MAR 2006, the first vernal equinox before release
	var remainder = new Date()/1000 - epoch; // seconds since epoch
	var y = Math.floor(remainder / yearLength);
	remainder -= y*yearLength;
	var m = Math.floor(remainder / (yearLength/12));
	var s = Math.floor(m/3);
	var sm = m - s*3;
	remainder -= m*yearLength/12;
	var d = Math.floor(remainder / (yearLength/12/28));
	remainder -= d*yearLength/12/28;
	var h = Math.floor(remainder / (yearLength/12/28/24));
	remainder -= h*yearLength/12/28/24;
	var t = Math.floor(remainder / 72); // ticks
	return d + ' ' + dorfMonths[m] + ' (<abbr title="' + dorfCaravans[s] + ' caravan">' +
		dorfSeasonModifiers[sm] + ' ' + dorfSeasons[s] +
		'</abbr>), <abbr title="Age of Civilization">Year ' + y + '</abbr> - Hour ' + h +
		', Tick ' + t;
}

/** ab urbe condita */
function auc(){
	return new Date().getFullYear() + 753 + ' <abbr title="ab urbe condita">AUC</abbr>';
}

/** japanese era */
function japan(){
	var eras = [ // older ones included in case some weirdo sets their system time to 1970
		[2019, '令和', 'Reiwa', 'Naruhito', 'れいわ'],
		[1989, '平成', 'Heisei', 'Akihito', 'へいせい'],
		[1926, '昭和', 'Shōwa', 'Hirohito', 'しょうわ'],
	];
	var y = new Date().getFullYear();
	var i; // need this outside the for scope
	for (i = 0; i < eras.length; i++){
		if (y > eras[i][0])
			break;
	}
	y -= eras[i][0] - 1;
	return '<abbr title="' + eras[i][2] + ' era\nEmperor ' + eras[i][3] + '"><ruby>' + eras[i][1] +
		'<rt>' + eras[i][4] + '</rt></ruby></abbr>' + y + '年';
}

function holidayCSS(){
	var month = new Date().getMonth() + 1;
	var day = new Date().getDate();
	console.log(month, day);

	var title = '';
	var defaultSrc = 'mo';
	var src = defaultSrc;
	var img = document.getElementById('m');
	switch (month){
		case 2:
			src = 'mochentines';
			if (day === 4){
				title = 'Day of the Republic. Wiwie Erdeka! Long live the RTC!';
			}
			else {
				title = 'Fuck merrily!';
			}
			break;
		case 3:
			src = 'mochricks';
			title = 'Drink, ye bastard!';
			break;
		case 4:
			if (day === 1){
				document.getElementById('title').innerHTML = 'Schmocha&rsquo;s Site';
				img.style.transform = 'rotate(180deg)';
			}
			break;
		case 6:
			src = 'mogay';
			if (day === 23){
				title = 'Happy birthday, MochaFiction Wiki! 2011-' + new Date().getFullYear();
			}
			else {
				title = 'Everyone gets a nice big hug!';
			}
			break;
		case 7:
			if (day === 12){
				title = 'King Witold\'s Birthday';
			}
			break;
		case 9:
			if (day === 19){
				title = 'Yarrrr!';
			}
			break;
		case 10:
			src = 'mochaween';
			if (day === 18){
				title = 'Memorial Day for the Victims of the Bombing of Łódź';
			}
			else {
				title = 'Boo, motherfucker!';
			}
			break;
		case 11:
			if (day === 7){
				title = 'The Feast of Boris is today! \'Tis the season to be gorging!';
			}
			else if (day === 14){
				title = '<3';
			}
			break;
		case 12:
			src = 'mochristmas';
			if (day === 4){
				title = 'Today is Yuletide! Roast marshmallows and listen to spooky ghost stories in Seaside Town!';
			}
			else if (17 <= day && day < 23){
				title = 'Have a joyous Saturnalia!';
			}
			else if (day === 23){
				title = 'Happy Festivus!';
			}
			else if (day === 31){
				title = 'Party Time!';
			}
			else {
				title = 'Have a frosty winter solstice!';
			}
			break;
	}

	img.title = title;
	if (src !== defaultSrc)
		img.src = 'img/'+src+'.png';

	if (day === 11*month-17 && day === month*month + 3*month - 1)
		img.outerHTML = '<img id="m" src="img/mopril.png" width="200" alt="Mochadian Birthday Squiggle" onmouseover="playSound(\'sfx\')" onmouseout="stopSound(\'sfx\')"> <audio id="sfx" src="snd/partyhorn.mp3"/>';
}

function oneiaTime(){
	var epoch =	1497151176; // SUN 2017 JUN 11 03:19:36 UTC
	var year =	6477407.605917404;
	var day =	105850.25205028882; //104148

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

function bonus(){
	document.getElementById('clockbonus').innerHTML = [zodiac(), china(), egypt(), japan(), auc(),
		maya(), 'JD '+jd().toFixed(3), darian(), dorf()].join('<br>');
}

function oneiaTimeInitialize(){
	var epoch =	1497151176; // SUN 2017 JUN 11 03:19:36 UTC
	var year =	6477407.605917404;
	var day =	105850.25205028882; //104148

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