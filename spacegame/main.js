// begin math block

function mod(n,m){
	"use strict";
	return ((n%m)+m)%m;
}

function sd(x){ // find the standard deviation of an array
	"use strict";
	return Math.sqrt(variance(x));
}

function sum(x){ // find the sum of an array
	"use strict";
	var s = 0;
	x.forEach(function(y){
		s += y;
	});
	return s;
}

function uniform(min, max){ // random real in range
	"use strict";
	return Math.random() * (max-min) + min;
}

function variance(x){ // find the variance of an array
	"use strict";
	var meanOfArray = mean(x);
	var v = x.map(function(y){
		var z = y - meanOfArray;
		return z * z;
	});
	return sum(v) / (x.length - 1);
}

// end math block
// begin astro block

sample_orbit = {
	'parent': 'sun',
	'sma': 1.49598023e11,
	'ecc': .0167086,
	'aop': 0,
	'man': .1249,
};

function keplerToCartesian(x){
	"use strict";
	var tol = 1e-10;
	var M = mod(self.man + 2*pi*t/p, 2*pi);
	var E = M;
	var E_;
	while (true){
		E_ = M + e*sin(E);
		if (abs(E-E_) < tol){
			return E;
		}
		E = E_;
	}
}

function keplerToCartesian(t, orbit){
	"use strict";
	var E = eccentric_anomaly(t);
	var nu = true_anomaly(t);
	var r_c = orbit.a*(1-orbit.e*cos(E));
	return [r_c*cos(nu), r_c*sin(nu)];
}
// end astro block
// begin main program

function main(){
	"use strict";
	console.log("test");
}