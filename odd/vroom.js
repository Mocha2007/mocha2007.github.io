function play(name){
    "use strict";
	(new Audio('https://www.myinstants.com/media/sounds/'+name+'.mp3')).play();
}

function settilde(string){
    "use strict";
	document.getElementById('tilde').innerHTML = string;
}

function tildesize(){
    "use strict";
	var x = window.getComputedStyle(document.querySelector('#tilde')).fontSize;
	return parseFloat(x.slice(0,-2));
}

function setsize(x){
    "use strict";
	document.getElementById("tilde").style["font-size"] = String(x) + 'px';
}

function tilde(){
    "use strict";
	var i;
	var ratio = 0.99; // must be .99 < r < 1
	var duration = 600;
	var defaultsize = tildesize();
	// audio
	play('yandere-dev-woah-technology');
	// visual
	settilde("❄️");
	// initialize
	setsize(defaultsize * 0.62); // minimize jumping
	// main
	for (i = 0; i < duration; i += 1 ){
		// https://stackoverflow.com/a/16873849/2579798
		setTimeout(function(){
			setsize(tildesize() * ratio);
		}, i*4);
	}
	// reset
	setTimeout(function(){
		settilde("~️");
		setsize(defaultsize);
	}, duration*4);
}