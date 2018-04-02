var i;
var year = 31556952;
var events = [ // MUST BE REVERSE CHRONO ORDER!!!
[14e9,'<a href="https://en.wikipedia.org/wiki/Big_Bang">Big Bang</a>'],
[12.7e9,'Formation of the Milky Way'],
[4.6e9,'Formation of the Solar System'],
[4.55e9,'Formation of the Earth'],
[4e9,'End of the Late Heavy Bombardment'],
[3.465e9,'Life forms on Earth'],
[3.2e9,'Earliest Photosynthesis'],
[2.4e9,'Huronian Glaciation'],
[1.6e9,'First Multicellular Life on Earth'],
[1.2e9,'First Sexual Reproduction'],
[541e6,'Cambrian Explosion'],
[485.4e6,'Cambrian-Ordovician Extinction Event'],
[430e6,'Final Ordovician–Silurian Extinction Event'],
[367.5e6,'Late Devonian Extinction Event'],
[335e6,'Pangaea Forms'],
[252e6,'Permian-Triassic Extinction Event'],
[225e6,'Earliest <a href="https://en.wikipedia.org/wiki/Mammal">Mammals</a>'],
[201.3e6,'Triassic-Jurassic Extinction Event'],
[175e6,'Pangaea Separates'],
[145e6,'Beginning of the Cretaceous Period'],
[140e6,'Beginning of the <a href="https://en.wikipedia.org/wiki/Sevier_orogeny">Sevier Orogeny</a>'],
[125e6,'Beginning of the <a href="https://en.wikipedia.org/wiki/Cretaceous_Terrestrial_Revolution">Cretaceous Terrestrial Revolution</a>'],
[94e6,'Cenomanian-Turonian Boundary Event'],
[90e6,'Beginning of the <a href="https://en.wikipedia.org/wiki/Andean_orogeny">Andean Orogeny</a>'],
[80e6,'Beginning of the <a href="https://en.wikipedia.org/wiki/Laramide_orogeny">Laramide Orogeny</a>'],
[66e6,'Cretaceous-Tertiary Extinction Event'],
[42e6,'Earliest <i><a href="https://en.wikipedia.org/wiki/Carnivora">Carnivoran</a></i> Fossils'],
[33.9e6,'Eocene-Oligocene Extinction Event'],
[14.5e6,'Middle Miocene Disruption'],
[7e6,'Earliest <i><a href="https://en.wikipedia.org/wiki/Vulpes">Vupes</a></i> Fossils'],
[242,'Formation of the United States'],
[104,'Beginning of the Great War'],
[79,'Beginning of the Second World War'],
[68,'Beginning of the Korean War'],
[63,'Beginning of the Vietnam War'],
[17,'September 11 Attacks'],
[1,'Trump Elected!']
];

function factorize(n){
	"use strict";
	// only works for natual numbers greater than one
	var pf = [];
	var t = 2;
	while (true){
		if (n%t===0){
			if (pf.length && pf[pf.length-1][0]===t){
				pf[pf.length-1][1]+=1;
			}
			else {
				pf.push([t,1]);
			}
			n = n/t;
		}
		else {
			t+=t===2?1:2;
		}
		// check to break early
		if (t**2>n){
			pf.push([n,1]);
			break;
		}
	}
	return pf;
}

function issemiprime(factorization){
	"use strict";
	if (factorization.length === 2 && factorization[0][1]+factorization[1][1] === 2){
		return true;
	}
	if (factorization.length === 1 && factorization[0][1] === 2){
		return true;
	}
	return false;
}

function commaconvert(s){
	"use strict";
	s = s.split('');
	var n = 0;
	for (i=0;i<s.length;i+=1){
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

ae^-(x/year) = y

ae^-(x/year) = 14e9 * year

a = 14e9 * year
*/

function ialc(y){
	"use strict";
	var a = 14e9;
	var b = 21;
	var otherx = Math.floor(new Date()/1000)%year; // seconds since year beginning
	var x = Math.floor(Math.log(a/y)*year/b)
	var wannadate = new Date(new Date().getTime() - 1000*(otherx - x));
	return String(wannadate).slice(4,24);
}

function alc(){
	"use strict";
	var a = 14e9;
	var b = 21;
	var x = Math.floor(new Date()/1000)%year; // seconds since year beginning
	var y = a*Math.exp(-b*x/year);
	var str = '<div id="alc">';
	for (i=0;i<events.length;i+=1){
		if (events[i][0]>y){
			str+='<br>'+(i===0?'Jan 01 '+((new Date()).getFullYear())+' 00:00:00':ialc(events[i][0]))+' - '+events[i][1];
		}
		else {
			break;
		}
	}
	return str+'<br>'+(String(new Date()).slice(4,24))+' - Now ('+Math.round(y).toLocaleString()+') Years Ago</div>';
}

function primeclock(){
	"use strict";
	var sec = Math.floor(new Date()/1000);
	var str = factorize(sec);
	var factorization = commaconvert(String(str)).replace(/\^1/g,'').replace(/\^/g,'<sup>').replace(/\s&times;/g,'</sup> &times;');
	var isprime = factorization.length === String(sec).length;

	document.getElementById("clock").innerHTML = '<span class="'+(isprime?'prime':(issemiprime(str)?'semiprime':'composite'))+'">' + sec + '</span><div id="c2">' + factorization + '</div>' + alc();
}