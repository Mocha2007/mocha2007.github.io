function play(name){
    "use strict";
	(new Audio('https://www.myinstants.com/media/sounds/'+name+'.mp3')).play();
}

function tilde(){
    "use strict";
	var i;
	var ratio = 0.99; // must be .99 < r < 1
	var duration = 600;
	// audio
	play('yandere-dev-woah-technology');
	// visual
	document.getElementById('tilde').innerHTML = "❄️";
	// initialize
	var currentsize = window.getComputedStyle(document.querySelector('#tilde')).fontSize;
	var defaultsize = currentsize;
	currentsize = parseFloat(currentsize.slice(0,-2));
	var newsize = currentsize * 0.62; // minimize jumping
	newsize = String(newsize) + 'px';
	document.getElementById("tilde").style["font-size"] = newsize;
	// main
	for (i = 0; i < duration; i += 1 ){
		// https://stackoverflow.com/a/16873849/2579798
		setTimeout(function(){
			currentsize = window.getComputedStyle(document.querySelector('#tilde')).fontSize;
			currentsize = parseFloat(currentsize.slice(0,-2));
			newsize = currentsize * ratio;
			// console.log(currentsize,"->",newsize);
			newsize = String(newsize) + 'px';
			document.getElementById("tilde").style["font-size"] = newsize;
		}, i*4);
	}
	// reset
	setTimeout(function(){
		document.getElementById('tilde').innerHTML = "~️";
		document.getElementById("tilde").style["font-size"] = defaultsize;
	}, duration*4);
}