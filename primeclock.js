var i;

function factorize(n){
	"use strict";
	// only works for natual numbers greater than one
	var pf = [];
	var t = 2;
	while (n>1){
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

function commaconvert(s){
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

function primeclock(){
	"use strict";
	var str = factorize(Math.floor(new Date()/1000));
	//console.log(str);
	document.getElementById("clock").innerHTML = Math.floor(new Date/1000) + '<br>' + commaconvert(String(str)).replace(/\^1/g,'').replace(/\^/g,'<sup>').replace(/ &times;/g,'</sup> &times;');
}