/* Thanks to https://stackoverflow.com/questions/4467539/javascript-modulo-gives-a-negative-result-for-negative-numbers/17323608#17323608
Fixes a bug in javascript where the entire fucking language is retarded and should burn in hell for all eternity.
*/
function mod(n, m){
	return ((n % m) + m) % m;
}

// https://stackoverflow.com/questions/37398871/javascript-get-current-date-using-utc-offset/37399351#37399351

function getDateWithUTCOffset(inputTzOffset){
	var now = new Date(); // get the current time

	var currentTzOffset = -now.getTimezoneOffset() / 60 // in hours, i.e. -4 in NY
	var deltaTzOffset = inputTzOffset - currentTzOffset; // timezone diff

	var nowTimestamp = now.getTime(); // get the number of milliseconds since unix epoch 
	var deltaTzOffsetMilli = deltaTzOffset * 1000 * 60 * 60; // convert hours to milliseconds (tzOffsetMilli*1000*60*60)
	var outputDate = new Date(nowTimestamp + deltaTzOffsetMilli) // your new Date object with the timezone offset applied.

	return outputDate;
}

// https://stackoverflow.com/questions/14926306/javascript-play-sound-on-hover-stop-and-reset-on-hoveroff/14926552#14926552

function PlaySound(soundobj) {
	var thissound=document.getElementById(soundobj);
	thissound.play();
}

function StopSound(soundobj) {
	var thissound=document.getElementById(soundobj);
	thissound.pause();
	thissound.currentTime = 0;
}

function HolidayCSS(){
	monthmonth = new Date().getMonth() + 1;
	dayday = (new Date().getDate())==(monthmonth*7-1);
	console.log(monthmonth,new Date().getDate());
	
	ReplacementImage = 'Steve'
	
	if (monthmonth==1){
		ReplacementImage = 'Steve'
	}
	
	else if (monthmonth==2){
		ReplacementImage = '<img id="m" src="img/mochentines.png" width="200" title="Fuck merrily!" alt="Mochadian Valentines\' Squiggles">'
	}
	
	else if (monthmonth==3){
		ReplacementImage = '<img id="m" src="img/mochricks.png" width="200" title="Drink, ye bastard!" alt="Mochadian St. Patrick\'s day Squiggle">'
	}
	
	else if (dayday){
		ReplacementImage = '<img id="m" src="img/mopril.png" width="200" alt="Mochadian Birthday Squiggle" onmouseover="PlaySound(\'sfx\')" onmouseout="StopSound(\'sfx\')"> <audio id="sfx" src="snd/partyhorn.mp3"/>'
	}
	
	else if (monthmonth==10){
		ReplacementImage = '<img id="m" src="img/mochaween.png" width="200" title="Boo, motherfucker!" alt="Mochadian Halloween Squiggle">'
	}
	
	else if (monthmonth==12){
		ReplacementImage = '<img id="m" src="img/mochristmas.png" width="200" title="Have a joyous Saturnalia!" alt="Mochadian Christmas Squiggle">'
	}
	
	if (ReplacementImage!='Steve'){
		document.getElementById("m").outerHTML = ReplacementImage
	}
}

function OneiaTime() {
	phases = ['New','Waxing Crescent','First Quarter','Waxing Gibbous','Full','Waning Gibbous','Third Quarter','Waning Crescent'];
	var epoch =	1497151176;/*SUN 2017 JUN 11 03:19:36 UTC*/
	var year =	6477407.605917404;
	var day =	105850.25205028882; //104148

	var currenttime = Date.now()/1000
	// 00:00 is at roughly local noon
	var remainder = currenttime-epoch;
	var years = 950+Math.floor(remainder/year);
	var remainder = remainder%year;
	var yearprogress = remainder/year;
	var days = Math.floor(remainder/day);
	var remainder = remainder%day;
	var nikkiphase = Math.round(8*(remainder/day-.1)%8)
	//console.log((remainder/day-.1)%8);
	var first = Math.floor(remainder/(day/10));
	var remainder = remainder%(day/10);
	var second = Math.floor(remainder/(day/100));
	var remainder = remainder%(day/100);
	var third = Math.floor(remainder/(day/1000));
	var remainder = remainder%(day/1000);
	var fourth = Math.floor(remainder/(day/10000));
	var remainder = remainder%(day/10000);
	var fifth = Math.floor(remainder/(day/100000));

	var currentTimeString = years + " AT, Day " + days + ", " + first + ":" + second + ":" + third + ":" + fourth + ":" + fifth;
	
	var timetime = getDateWithUTCOffset(-5).toString()
	var utc1 = timetime.slice(0,16);
	var utc2 = timetime.slice(16,18);
	var utc3 = timetime.slice(18,24);

	var medidiem = ' AM'
	if (utc2>12){
		medidiem = ' PM'
		utc2 -= 12
	}

	var yy =		31556952000;
	var vernal =	6884100000;/*20 Mar 16:15 (2018)*/
	// 642900 = 7 Jan 1970 10:35:00 UTC
	// 2551442.9 = Lunar Synodic Period
	var moonphase = Math.round(8*((currenttime-642900)%2551442.9)/2551442.9)%8

	document.getElementById("clock").innerHTML = '<img src="img/phase/'+nikkiphase+'.png" height=9 alt="Nikki Phase: '+phases[nikkiphase]+'" title="Nikki Phase: '+phases[nikkiphase]+'"> Eremoran Time:<br/>'+currentTimeString+'<br/>\n<progress value="'+yearprogress+'"></progress><br/>\n<img src="img/phase/'+moonphase+'.png" height=9 alt="Moon Phase: '+phases[moonphase]+'" title="Moon Phase: '+phases[moonphase]+'"> Earth Time:<br/>'+utc1+utc2+utc3+medidiem+' EST<br/>\n<progress value="'+((Date.now()-vernal)%yy)/yy+'"></progress>';
}