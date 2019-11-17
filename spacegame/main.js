// begin math block

var pi = Math.PI;

function mod(n,m){
	"use strict";
	return ((n%m)+m)%m;
}

function randint(min, max){ // random integer in range
	"use strict";
	return Math.floor(uniform(min, max+1));
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

function zeros(n){
	zeroArray = [];
	for (i=0;i<n;i++){
		zeroArray.push(0);
	}
	return zeroArray;
}

// end math block
// begin astro block

var au = 149597870700;

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

var width = window.innerWidth;
var height = window.innerHeight;

function generateBody(){
	var body = {};
	body.mass = 2*Math.pow(10, uniform(17, 27));
	var density = uniform(687, 5514);
	body.radius = Math.pow(body.mass/(density*4/3*pi), 1/3);
	body.albedo = uniform(0, 1);
	return body;
}

function generateOrbit(){
	var orbit = {};
	orbit.sma = uniform(.3, 3)*au;
	orbit.ecc = uniform(0, .25);
	orbit.aop = uniform(0, 2*pi);
	orbit.man = uniform(0, 2*pi);
	return orbit;
}

function generatePlanet(){
	var planet = {};
	planet.orbit = generateOrbit();
	planet.body = generateBody();
	return planet;
}

function generateInner(){
	var numberOfPlanets = randint(3, 5);
	return (zeros(numberOfPlanets)).map(generatePlanet);
}

function main(){
	"use strict";
	console.log("Mocha's weird-ass space game test");
	console.log(generateInner());
}

document.onload = function(){main();};