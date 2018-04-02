var a = 14e9;
var b = 21;
var i;
var currentyear = ((new Date()).getFullYear());
var year = 31557600;//31556952;//currentyear%400===0?31622400:(currentyear%100===0?31536000:(currentyear%4===0?31622400:31536000))
var yy = 365.2425;
var events = [ // MUST BE REVERSE CHRONO ORDER!!! time before 01 jan 2018
[14e9,'<a href="https://en.wikipedia.org/wiki/Big_Bang">Big Bang</a>'],
[14e9-600e6,'Depth of the <a href="https://en.wikipedia.org/wiki/Hubble_Ultra-Deep_Field#Hubble_eXtreme_Deep_Field">Hubble Extreme Deep Field</a>'],
[14e9-630e6,'<a href="https://en.wikipedia.org/wiki/GRB_090423">GRB 090423</a>, one of the oldest supernovae'],
[14e9-670e6,'Formation of <a href="https://en.wikipedia.org/wiki/EGS-zs8-1">EGS-zs8-1</a>, one of the oldest known galaxies'],
[12.8e9,'Formation of <a href="https://en.wikipedia.org/wiki/HCM-6A">HCM-6A</a>, the oldest known regular galaxy'],
[12.7e9,'Formation of the <a href="https://en.wikipedia.org/wiki/Milky_Way">Milky Way</a>'],
[12.67e9,'Formation of <a href="https://en.wikipedia.org/wiki/Messier_12">Messier 12</a>'],
[12.54e9,'Formation of <a href="https://en.wikipedia.org/wiki/Messier_80">Messier 80</a>'],
[12.3e9,'Formation of <a href="https://en.wikipedia.org/wiki/Messier_55">Messier 55</a>'],
[11.78e9,'Formation of <a href="https://en.wikipedia.org/wiki/Messier_62">Messier 62</a>'],
[11.52e9,'Formation of <a href="https://en.wikipedia.org/wiki/Omega_Centauri">Omega Centauri</a>'],
[11.39e9,'Formation of <a href="https://en.wikipedia.org/wiki/Messier_10">Messier 10</a>'],
[1e10,'Formation of <a href="https://en.wikipedia.org/wiki/Barnard\'s_Star">Barnard\'s Star</a>'],
[4.85e9,'Formation of the <a href="https://en.wikipedia.org/wiki/Alpha_Centauri">Alpha Centauri</a> System'],
[4.6e9,'Formation of the Solar System'],
[4.57e9,'Formation of <a href="https://en.wikipedia.org/wiki/Ceres_(dwarf_planet)">Ceres</a>'],
[4.55e9,'<a href="https://en.wikipedia.org/wiki/Giant-impact_hypothesis">Formation</a> of the <a href="https://en.wikipedia.org/wiki/Earth">Earth</a>'],
[4.1e9,'Beginning of the <a href="https://en.wikipedia.org/wiki/Late_Heavy_Bombardment">Late Heavy Bombardment</a>'],
[3.8e9,'End of the Late Heavy Bombardment'],
[3.465e9,'Life forms on Earth'],
[3.2e9,'Earliest Photosynthesis'],
[2.4e9,'Huronian Glaciation'],
[1.7e9,'First <a href="https://en.wikipedia.org/wiki/Mitochondrion">Mitochondia</a>'],
[1.6e9,'First Multicellular Life on Earth'],
[1.2e9,'First Sexual Reproduction'],
[541e6,'Cambrian Explosion'],
[485.4e6,'Cambrian-Ordovician Extinction Event'],
[430e6,'Final Ordovician–Silurian Extinction Event'],
[428e6,'Earliest Land Animals'],
[367.5e6,'Late Devonian Extinction Event'],
[335e6,'Pangaea Forms'],
[252e6,'Permian-Triassic Extinction Event'],
[242e6,'Formation of <a href="https://en.wikipedia.org/wiki/Sirius">Sirius</a>'],
[231.4e6,'Earliest <a href="https://en.wikipedia.org/wiki/Dinosaur">Dinosaurs</a>'],
[225e6,'Earliest <a href="https://en.wikipedia.org/wiki/Mammal">Mammals</a>'],
[201.3e6,'Triassic-Jurassic Extinction Event'],
[175e6,'Pangaea Separates'],
[145e6,'Beginning of the Cretaceous Period'],
[140e6,'Beginning of the <a href="https://en.wikipedia.org/wiki/Sevier_orogeny">Sevier Orogeny</a>'],
[125e6,'Beginning of the <a href="https://en.wikipedia.org/wiki/Cretaceous_Terrestrial_Revolution">Cretaceous Terrestrial Revolution</a>'],
[120e6,'Formation of the <a href="https://en.wikipedia.org/wiki/BP_Structure">BP Structure</a>'],
[115e6,'<a href="https://en.wikipedia.org/wiki/Carswell_crater">Carswell Impact</a>'],
[94e6,'Cenomanian-Turonian Boundary Event'],
[90e6,'Beginning of the <a href="https://en.wikipedia.org/wiki/Andean_orogeny">Andean Orogeny</a>'],
[80e6,'Beginning of the <a href="https://en.wikipedia.org/wiki/Laramide_orogeny">Laramide Orogeny</a>'],
[7e7,'Formation of <a href="https://en.wikipedia.org/wiki/Polaris">Polaris</a>'],
[68e6,'Earliest <a href="https://en.wikipedia.org/wiki/Tyrannosaurus">Tyrannosaurs</a>'],
[66e6,'Cretaceous-Tertiary Extinction Event'],
[65.17e6,'<a href="https://en.wikipedia.org/wiki/Boltysh_crater">Boltysh Impact</a>'],
[42e6,'Earliest <i><a href="https://en.wikipedia.org/wiki/Carnivora">Carnivoran</a></i> Fossils'],
[33.9e6,'Eocene-Oligocene Extinction Event'],
[14.5e6,'Middle Miocene Disruption'],
[7e6,'Earliest <i><a href="https://en.wikipedia.org/wiki/Vulpes">Vupes</a></i> Fossils'],
[3330,'<a href="https://en.wikipedia.org/wiki/Mursili\'s_eclipse">Mursili\'s Eclipse'],
[242,'Formation of the United States'],
[104,'Beginning of the Great War'],
[79,'Beginning of the Second World War'],
[68,'Beginning of the Korean War'],
[63,'Beginning of the Vietnam War'],
// Precise number of days for events before 2000 unnecessary.
[5956/yy,'<a href="https://en.wikipedia.org/wiki/September_11_attacks">September 11 Attacks</a>'],
[5949/yy,'<a href="https://en.wikipedia.org/wiki/2001_anthrax_attacks">2001 Anthrax Attacks</a>'],
[419/yy,'Trump Elected!']
];

function arraysEqual(arr1,arr2){
	"use strict";
	if (arr1.length !== arr2.length){
		return false;
	}
	for (i=0;i<arr1.length;i+=1){
		if (arr1[i] !== arr2[i]){
			return false;
		}
	}
	return true;
}

function gcd(a,b){
	"use strict";
	if (b===0){
		return a;
	}
	return gcd(b,a%b);
}

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
		if (t*t>n){
			if (pf.length && pf[pf.length-1][0]===n){
				pf[pf.length-1][1]+=1;
			}
			else {
				pf.push([n,1]);
			}
			break;
		}
	}
	return pf;
}

function ispower(factorization){
	"use strict";
	var powertable = factorization.map(function f(x){return x[1];});
	var gggcd = 0;
	for (i=0;i<powertable.length;i+=1){
		if (gggcd){
			gggcd = gcd(gggcd,powertable[i]);
		}
		else {
			gggcd = powertable[i];
		}
		if (gggcd===1){
			return false;
		}
	}
	return arraysEqual(new Array(factorization.length).fill(factorization[0][1]),powertable);
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

ae^-(bx/year) = y

ae^-(bx/year) = 14e9 * year

a = 14e9
*/

function ialc(y){
	"use strict";
	var otherx = Math.floor(new Date()/1000)%year; // seconds since year beginning
	var x = Math.floor(Math.log(a/y)*year/b);
	var wannadate = new Date(Date.now()-1000*(otherx-x));
	return String(wannadate).slice(4,24);
}

function alc(){
	"use strict";
	var x = Math.floor(new Date()/1000)%year; // seconds since year beginning
	var y = a*Math.exp(-b*x/year);
	var str = '';
	for (i=0;i<events.length;i+=1){
		if (events[i][0]>y){
			str+='<br>'+(i===0?'Jan 01 '+currentyear+' 00:00:00':ialc(events[i][0]))+' - '+events[i][1];
		}
		else {
			break;
		}
	}
	document.getElementById("alc").innerHTML = str+'<br><span id="nowtime"></span>';
}

function primeclock(){
	"use strict";
	var sec = Math.floor(new Date()/1000);
	var str = factorize(sec);
	var factorization = commaconvert(String(str)).replace(/\^1/g,'').replace(/\^/g,'<sup>').replace(/\s&times;/g,'</sup> &times;');
	var isprime = factorization.length === String(sec).length;

	document.getElementById("clock").innerHTML = '<span class="'+(isprime?'prime':(ispower(str)?'ppower':(issemiprime(str)?'semiprime':'composite')))+'">' + sec + '</span><div id="c2">' + factorization + '</div>';

	var x = Math.floor(new Date()/1000)%year; // seconds since year beginning
	var y = a*Math.exp(-b*x/year);

	document.getElementById("nowtime").innerHTML = (String(new Date()).slice(4,24))+' - Now ('+Math.round(y).toLocaleString()+') Years Ago';
}