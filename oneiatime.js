var i;
var vernal = 6884100000; // ms after first vernal equinox 20 Mar 16:15 (2018)

var egyptmonths = ['Thoth','Paopi','Hathor','Koiak','Tobi','Meshir','Paremhat','Paremoude','Pashons','Paoni','Epip','Mesori'];
var egyptseasons = ['Akhet','Peret','Shemu'];
var chineseelements = ['Wood">木','Fire">火','Earth">土','Metal">金','Water">水'];
var chinesesigns = ['Rat">鼠','Ox">牛','Tiger">虎','Rabbit">兔','Dragon">龍','Snake">蛇','Horse">馬','Goat">羊','Monkey">猴','Rooster">雞','Dog">狗','Pig">豬'];
var signs = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];

/* Thanks to https://stackoverflow.com/questions/4467539/javascript-modulo-gives-a-negative-result-for-negative-numbers/17323608#17323608
Fixes a bug in javascript where the entire fucking language is retarded and should burn in hell for all eternity.
*/
function mod(n, m){
	"use strict";
	return ((n%m)+m)%m;
}

// https://stackoverflow.com/questions/14926306/javascript-play-sound-on-hover-stop-and-reset-on-hoveroff/14926552#14926552

function PlaySound(soundobj) {
	"use strict";
	var thissound=document.getElementById(soundobj);
	thissound.play();
}

function StopSound(soundobj) {
	"use strict";
	var thissound=document.getElementById(soundobj);
	thissound.pause();
	thissound.currentTime = 0;
}

function egypt(){
	"use strict";
	var epoch =	21852000;// 1970 SEP 11 00:00:00 UTC+2; first akhet after epoch
	var reltime = mod((new Date()/1000)-epoch,31556952); // time since beginning of akhet
	var wutwut = Math.floor(reltime/10518984); // season number
	var wutmonth = Math.floor(reltime/2629746); // month number
	return egyptmonths[wutmonth]+' ('+egyptseasons[wutwut]+')';
}

function maya(){
	"use strict";
	// 144000 days : 7200 days : 360 days : 20 days : day
	var epoch = 1356069600; // 13th b'ak'tun : 21 Dec 2012 00:00:00 UTC-6
	var remainder = Math.floor(((new Date()/1000)-epoch)/86400); // days since beginning of 13th b'ak'tun

	var mayaTime = [mod(remainder,20)];
	var temp = Math.floor(remainder/20);

	mayaTime.unshift(mod(temp,18));
	temp = Math.floor(temp/18);

	mayaTime.unshift(mod(temp,20));
	temp = Math.floor(temp/20);

	mayaTime.unshift(mod(temp,20));
	temp = Math.floor(temp/20);

	mayaTime.unshift(13+mod(temp,20));
	return mayaTime.join(':');
}

function china(){ // naive; does not account for time between new year's and chinese new year's well
	"use strict";
	var epoch = 444440000; // appx 1 FEB 1984
	var y = Math.floor(((new Date()/1000)-epoch)/31556952); // years since epoch
	var yy = '<abbr title="'+(mod(y,2)?'Yin">陰':'Yang">陽')+'</abbr>';
	var element = '<abbr title="'+chineseelements[mod(Math.floor(y/2),5)]+'</abbr>';
	var animal = '<abbr title="'+chinesesigns[mod(y,12)]+'</abbr>';
	return [yy,element,animal].join('');
}

function zodiac(){
	"use strict";
	var n = Math.floor(mod(new Date()-vernal,31556952000)/2629746000); // sign number 0-11
	return signs[n];
}

function HolidayCSS(){
	"use strict";
	var monthmonth = new Date().getMonth() + 1;
	var dayday = (new Date().getDate())===(monthmonth*7-1);
	console.log(monthmonth,new Date().getDate());

	var ReplacementImage;

	if (dayday){
		ReplacementImage = '<img id="m" src="img/mopril.png" width="200" alt="Mochadian Birthday Squiggle" onmouseover="PlaySound(\'sfx\')" onmouseout="StopSound(\'sfx\')"> <audio id="sfx" src="snd/partyhorn.mp3"/>';
	}

	switch (monthmonth){
		case 1:
			ReplacementImage = 'Steve'; // Trust me, this is indeed necessary...
			break;
		case 2:
			ReplacementImage = '<img id="m" src="img/mochentines.png" width="200" title="Fuck merrily!" alt="Mochadian Valentines\' Squiggles">';
			break;
		case 3:
			ReplacementImage = '<img id="m" src="img/mochricks.png" width="200" title="Drink, ye bastard!" alt="Mochadian St. Patrick\'s day Squiggle">';
			break;
		case 10:
			ReplacementImage = '<img id="m" src="img/mochaween.png" width="200" title="Boo, motherfucker!" alt="Mochadian Halloween Squiggle">';
			break;
		case 12:
			ReplacementImage = '<img id="m" src="img/mochristmas.png" width="200" title="Have a joyous Saturnalia!" alt="Mochadian Christmas Squiggle">';
			break;
		default:
			ReplacementImage = 'Steve';
	}

	if (ReplacementImage!=='Steve'){
		document.getElementById("m").outerHTML = ReplacementImage;
	}
}

function OneiaTime(){
	"use strict";
	var phases = ['New','Waxing Crescent','First Quarter','Waxing Gibbous','Full','Waning Gibbous','Third Quarter','Waning Crescent'];
	var epoch =	1497151176;/*SUN 2017 JUN 11 03:19:36 UTC*/
	var year =	6477407.605917404;
	var day =	105850.25205028882; //104148

	var currenttime = Date.now()/1000;
	// 00:00 is at roughly local noon
	var remainder = currenttime-epoch;
	var years = 950+Math.floor(remainder/year);
	remainder = remainder%year;
	var yearprogress = remainder/year;
	var days = Math.floor(remainder/day);
	remainder = remainder%day;
	var cnikkiphase = mod(remainder/day-0.078,1);
	var nikkiphase = mod(Math.round(8*cnikkiphase),8); // idk why it needs another mod, but the code breaks without it
	//console.log(nikkiphase);

	var currentTimeString = years + " AT, Day " + days + ", ";
	
	for (i=1;i<6;i+=1){ // oneian clock is conveniently decimal... :^)
		currentTimeString+=Math.floor(remainder/(day/Math.pow(10,i)))+(i!==5?':':'');
		remainder = remainder%(day/Math.pow(10,i));
	}
	
	var timetime = new Date().toString();
	var utc1 = timetime.slice(0,16);
	var utc2 = timetime.slice(16,18);
	var utc3 = timetime.slice(18,24);

	var medidiem = utc2>11?' PM':' AM';
	utc2 = utc2>12?utc2-12:utc2;

	var yy =		31556952000;
	// 642900 = 7 Jan 1970 10:35:00 UTC
	// 2551442.9 = Lunar Synodic Period
	var moonphase = Math.round(8*((currenttime-642900)%2551442.9)/2551442.9)%8;

	document.getElementById("clock").innerHTML = '<img src="img/phase/'+nikkiphase+'.png" height=9 alt="Nikki Phase: '+phases[nikkiphase]+'" title="Nikki Phase: '+phases[nikkiphase]+'"> Eremoran Time:<br/>'+currentTimeString+'<br/>\n<progress value="'+yearprogress+'"></progress><br/>\n<img src="img/phase/'+moonphase+'.png" height=9 alt="Moon Phase: '+phases[moonphase]+'" title="Moon Phase: '+phases[moonphase]+'"> Earth Time:<br/>'+utc1+utc2+utc3+medidiem+'<br/>\n<progress value="'+((Date.now()-vernal)%yy)/yy+'"></progress>';
}

function bonus(){
	"use strict";
	document.getElementById("clockbonus").innerHTML = zodiac()+'<br/>'+china()+'<br/>'+egypt()+'<br/>'+maya();
}