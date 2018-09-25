var months = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
var offset = [-1,30,59,90,120,151,181,212,243,273,304,334];
// I assume the season starts 1 Mar and ends 28 Feb
// var firstday = 60;
/*
0	1 Jan
31	1 Feb (So leap years are incl.)
60	1 Mar
91	1 Apr
121	1 May
152	1 Jun
182	1 Jul
213	1 Aug
244	1 Sep
274	1 Oct
305 1 Nov
335 1 Dec
*/

// begin math block

function sum(x){ // find the sum of an array
	"use strict";
	var s = 0;
	x.forEach(function(y){ // for each year
		s += y;
	});
	return s;
}

function mean(x){ // find the mean of an array
	"use strict";
	return sum(x)/x.length;
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

function sd(x){ // find the standard deviation of an array
	"use strict";
	return Math.sqrt(variance(x));
}

function randomRange(min, max){ // random real in range
	"use strict";
	return Math.random() * (max-min) + min;
}

// end math block

function proper(word){
	"use strict";
	if (word === ""){
		return "";
	}
	word = word.split("");
	word[0] = word[0].toUpperCase();
	return word.join("");
}

function n2n(name){ // name to number
	"use strict";
	var date = name.split(' ');
	var day = Number(date[0]);
	var month = months.indexOf(date[1].toLowerCase());
	return offset[month] + day;
}

function n2n2(n){ // number to name
	"use strict";
	var day, i;
	var month = 1;
	for (i = 12; i > 0; i -= 1){
		if (n > offset[i]){
			month = i;
			day = n - offset[i];
			return day+' '+proper(months[month]);
		}
	}
	return (n+1)+' Jan';
}

// https://stackoverflow.com/a/9902282/2579798
function realsize(x){
	"use strict";
	return x.filter(function(value){
		return value !== undefined;
	}).length;
}

function avgduring(date){
	"use strict";
	var n = 0;
	var years = realsize(hurricanelist);
	// date is an integer between 0 and 365
	hurricanelist.forEach(function(x){ // for each year
		x.forEach(function(y){ // for each hurricane
			if (y[1] >= date && date >= y[0]){
				n += 1;
			}
		});
	});
	return n/years;
}

function maxcatduring(date){
	"use strict";
	var maxcat = -1;
	// date is an integer between 0 and 365
	hurricanelist.forEach(function(x){ // for each year
		x.forEach(function(y){ // for each hurricane
			if (y[2] > maxcat && y[1] >= date && date >= y[0]){
				maxcat = y[2];
			}
		});
	});
	return maxcat;
}

function catStyle(category){
	"use strict";
	var style = (category > 0) ? ("c"+category) : ((category === 0) ? "ts" : "td");
	return "<td class="+style+">"+style.toUpperCase()+"</td>";
}

function maxcathtml(date){
	"use strict";
	var maxcat = maxcatduring(date);
	return catStyle(maxcat);
}

function fractionhurricane(date, m, n){ // % of cat m hurricanes that turn into cat n hurricanes
	"use strict";
	var maxcat = maxcatduring(date);
	var maxcatname = maxcat < n ? '0' : 1;
	var stormsondate = 0;
	var hurricanesondate = 0;
	if (maxcatname === 1){
		hurricanelist.forEach(function(x){ // for each year
			x.forEach(function(y){ // for each hurricane
				if (y[2] >= m && y[1] >= date && date >= y[0]){
					stormsondate += 1;
					if (y[2] >= n){
						hurricanesondate += 1;
					}
				}
			});
		});
		maxcatname = Math.round(hurricanesondate/stormsondate*100);
	}
	var style = Math.floor(maxcatname/10);
	var html = "<td class='p"+style+"'>"+maxcatname+"%</td>";
	return html;
}

function yearsContaining(date){ // % of years where ANY storm exists on a date
	"use strict";
	var yearCount = 0;
	var stormsondate = 0;
	hurricanelist.forEach(function(x){ // for each year
		yearCount += 1;
		x.some(function(y){ // for each hurricane
			if (y[1] >= date && date >= y[0]){
				stormsondate += 1;
				return true;
			}
		});
	});
	var ratio = Math.floor(stormsondate / yearCount*100);
	var style = Math.floor(ratio/10);
	var html = "<td class='p"+style+"'>"+ratio+"%</td>";
	return html;
}

function avgDuration(category){ // average category duration
	"use strict";
	var d = 0;
	var n = 0;
	hurricanelist.forEach(function(x){ // for each year
		x.forEach(function(y){ // for each hurricane
			if (y[2] === category){
				d += y[1]-y[0];
				n += 1;
			}
		});
	});
	return d/n;
}

function range1(n){
	"use strict";
	return n?range1(n-1).concat(n):[]; // Array(n).fill().map((x,i)=>i);
}

function avgprint(){
	"use strict";
	range1(356).forEach(function(x){
		console.log(x,avgduring(x));
	});
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/max
function getMaxOfArray(numArray) {
	"use strict";
	return Math.max.apply(null, numArray);
}

function maxyear(){
	"use strict";
	var wholeyear = [];
	range1(356).forEach(function(x){
		wholeyear.push(avgduring(x));
	});
	return getMaxOfArray(wholeyear);
}

function avgyear(){
	"use strict";
	var datestring, newrow, newval;
	var wholeyear = [];
	var maxinyear = maxyear();
	// reset
	document.getElementById("avgByDate").innerHTML = "<tr><th>Date</th><th>Quantity</th><th>Visual</th><th>Max</th><th>%D</th><th>%H</th><th>%M</th></tr>";
	range1(366).forEach(function(x){
		x = x-1;
		newrow = document.createElement("tr");
		newval = avgduring(x);
		wholeyear.push(newval);
		datestring = n2n2(x);
		newrow.innerHTML = "<td>"+datestring+"</td><td>"+Math.round(newval*100)/100+"</td><td><progress value="+newval+" max="+maxinyear+"></progress></td>"+maxcathtml(x)+yearsContaining(x)+fractionhurricane(x,-1,1)+fractionhurricane(x,1,3);
		document.getElementById("avgByDate").appendChild(newrow);
	});
	return wholeyear;
}

function seasonstats(year){
	"use strict";
	var y = hurricanelist[year];
	// maj. hurricanes (3+)
	var majors = 0;
	// hurricanes
	var hurricanes = 0;
	// storms
	var storms = 0;
	y.forEach(function(x){ // for each depression
		switch (x[2]){
			case 0:
				storms += 1;
				break;
			case 1:
				storms += 1;
				hurricanes += 1;
				break;
			case 2:
				storms += 1;
				hurricanes += 1;
				break;
			case 3:
				storms += 1;
				hurricanes += 1;
				majors += 1;
				break;
			case 4:
				storms += 1;
				hurricanes += 1;
				majors += 1;
				break;
			case 5:
				storms += 1;
				hurricanes += 1;
				majors += 1;
				break;
		}
	});
	// depressions
	var depressions = y.length;
	return [depressions,storms,hurricanes,majors];
}

// data follows
// hurricanelist[year][number] = [start,end,cat,name];

var hurricanelist = [];
hurricanelist[1995] = [
	[n2n("2 jun"),n2n("10 jun"),1,"Allison"],
	[n2n("6 jul"),n2n("10 jul"),0,"Barry"],
	[n2n("12 jul"),n2n("22 jul"),0,"Chantal"],
	[n2n("28 jul"),n2n("3 aug"),0,"Dean"],
	[n2n("31 jul"),n2n("6 aug"),2,"Erin"],
	[n2n("5 aug"),n2n("7 aug"),-1,"Six"],
	[n2n("8 aug"),n2n("22 aug"),4,"Felix"],
	[n2n("9 aug"),n2n("12 aug"),0,"Gabrielle"],
	[n2n("21 aug"),n2n("1 sep"),2,"Humberto"],
	[n2n("22 aug"),n2n("4 sep"),2,"Iris"],
	[n2n("22 aug"),n2n("28 aug"),0,"Jerry"],
	[n2n("26 aug"),n2n("3 sep"),0,"Karen"],
	[n2n("27 aug"),n2n("11 sep"),4,"Luis"],
	[n2n("9 sep"),n2n("13 sep"),-1,"Fourteen"],
	[n2n("12 sep"),n2n("22 sep"),3,"Marilyn"],
	[n2n("26 sep"),n2n("7 oct"),1,"Noel"],
	[n2n("27 sep"),n2n("5 oct"),4,"Opal"],
	[n2n("4 oct"),n2n("8 oct"),0,"Pablo"],
	[n2n("7 oct"),n2n("21 oct"),3,"Roxanne"],
	[n2n("20 oct"),n2n("25 oct"),0,"Sebastien"],
	[n2n("26 oct"),n2n("1 nov"),1,"Tanya"]
];
hurricanelist[1996] = [
	[n2n("17 jun"),n2n("21 jun"),0,"Arthur"],
	[n2n("5 jul"),n2n("14 jul"),3,"Bertha"],
	[n2n("24 jul"),n2n("29 jul"),1,"Cesar"],
	[n2n("19 aug"),n2n("26 aug"),1,"Dolly"],
	[n2n("19 aug"),n2n("3 sep"),4,"Edouard"],
	[n2n("23 aug"),n2n("8 sep"),3,"Fran"],
	[n2n("26 aug"),n2n("2 sep"),0,"Gustav"],
	[n2n("3 sep"),n2n("16 sep"),4,"Hortense"],
	[n2n("24 sep"),n2n("1 oct"),3,"Isidore"],
	[n2n("4 oct"),n2n("8 oct"),0,"Josephine"],
	[n2n("11 oct"),n2n("13 oct"),0,"Kyle"],
	[n2n("14 oct"),n2n("27 oct"),3,"Lili"],
	[n2n("16 nov"),n2n("26 nov"),1,"Marco"]
];
hurricanelist[1997] = [
	[n2n("1 jun"),n2n("2 jun"),0,"Unnamed"],
	[n2n("30 jun"),n2n("4 jul"),0,"Ana"],
	[n2n("11 jul"),n2n("13 jul"),1,"Bill"],
	[n2n("13 jul"),n2n("16 jul"),0,"Claudette"],
	[n2n("16 jul"),n2n("26 jul"),1,"Danny"],
	[n2n("17 jul"),n2n("19 jul"),-1,"Five"],
	[n2n("3 sep"),n2n("20 sep"),3,"Erika"],
	[n2n("4 oct"),n2n("8 oct"),0,"Fabian"],
	[n2n("16 oct"),n2n("17 oct"),0,"Grace"]
];
hurricanelist[1998] = [
	[n2n("27 jul"),n2n("2 aug"),0,"Alex"],
	[n2n("19 jul"),n2n("30 aug"),3,"Bonnie"],
	[n2n("21 aug"),n2n("24 aug"),0,"Charlie"],
	[n2n("24 aug"),n2n("3 sep"),2,"Danielle"],
	[n2n("31 aug"),n2n("3 sep"),2,"Earl"],
	[n2n("8 sep"),n2n("13 sep"),0,"Frances"],
	[n2n("15 sep"),n2n("1 oct"),4,"Georges"],
	[n2n("17 sep"),n2n("20 sep"),0,"Hermine"],
	[n2n("19 sep"),n2n("27 sep"),1,"Ivan"],
	[n2n("21 sep"),n2n("1 oct"),2,"Jeanne"],
	[n2n("23 sep"),n2n("28 sep"),2,"Karl"],
	[n2n("5 oct"),n2n("9 oct"),1,"Lisa"],
	[n2n("22 oct"),n2n("5 nov"),5,"Mitch"],
	[n2n("24 oct"),n2n("1 dec"),1,"Nicole"]
];
hurricanelist[1999] = [
	[n2n("11 jun"),n2n("18 jun"),0,"Arlene"],
	[n2n("2 jul"),n2n("3 jul"),-1,"Two"],
	[n2n("18 aug"),n2n("25 aug"),4,"Bret"],
	[n2n("19 aug"),n2n("31 aug"),4,"Cindy"],
	[n2n("24 aug"),n2n("9 sep"),2,"Dennis"],
	[n2n("24 aug"),n2n("28 aug"),0,"Emily"],
	[n2n("5 sep"),n2n("7 sep"),-1,"Seven"],
	[n2n("7 sep"),n2n("17 sep"),4,"Floyd"],
	[n2n("11 sep"),n2n("23 sep"),4,"Gert"],
	[n2n("19 sep"),n2n("22 sep"),0,"Harvey"],
	[n2n("4 oct"),n2n("6 oct"),-1,"Eleven"],
	[n2n("6 oct"),n2n("8 oct"),-1,"Twelve"],
	[n2n("12 oct"),n2n("19 oct"),2,"Irene"],
	[n2n("17 oct"),n2n("25 oct"),2,"Jose"],
	[n2n("27 oct"),n2n("1 nov"),0,"Katrina"],
	[n2n("13 nov"),n2n("23 nov"),4,"Lenny"]
];
hurricanelist[2000] = [
	[n2n("7 jun"),n2n("8 jun"),-1,"One"],
	[n2n("23 jun"),n2n("25 jun"),-1,"Two"],
	[n2n("3 aug"),n2n("23 aug"),3,"Alberto"],
	[n2n("8 aug"),n2n("11 aug"),-1,"Four"],
	[n2n("13 aug"),n2n("15 aug"),0,"Beryl"],
	[n2n("17 aug"),n2n("19 aug"),0,"Chris"],
	[n2n("19 aug"),n2n("24 aug"),1,"Debby"],
	[n2n("1 sep"),n2n("3 sep"),0,"Ernesto"],
	[n2n("8 sep"),n2n("9 sep"),-1,"Nine"],
	[n2n("10 sep"),n2n("17 sep"),1,"Florence"],
	[n2n("14 sep"),n2n("21 sep"),1,"Gordon"],
	[n2n("15 sep"),n2n("25 sep"),0,"Helene"],
	[n2n("21 sep"),n2n("1 oct"),4,"Isaac"],
	[n2n("25 sep"),n2n("2 oct"),1,"Joyce"],
	[n2n("28 sep"),n2n("6 oct"),4,"Keith"],
	[n2n("4 oct"),n2n("7 oct"),0,"Leslie"],
	[n2n("15 oct"),n2n("20 oct"),2,"Michael"],
	[n2n("19 oct"),n2n("21 oct"),0,"Nadine"],
	[n2n("25 oct"),n2n("29 oct"),0,"Unnamed"]
];
hurricanelist[2001] = [
	[n2n("4 jun"),n2n("18 jun"),0,"Allison"],
	[n2n("11 jul"),n2n("12 jul"),-1,"Two"],
	[n2n("2 aug"),n2n("8 aug"),0,"Barry"],
	[n2n("14 aug"),n2n("22 aug"),0,"Chantal"],
	[n2n("22 aug"),n2n("28 aug"),0,"Dean"],
	[n2n("1 sep"),n2n("5 sep"),3,"Erin"],
	[n2n("7 sep"),n2n("19 sep"),3,"Felix"],
	[n2n("11 sep"),n2n("19 sep"),1,"Gabrielle"],
	[n2n("19 sep"),n2n("20 sep"),-1,"Nine"],
	[n2n("21 sep"),n2n("27 sep"),2,"Humberto"],
	[n2n("4 oct"),n2n("9 oct"),4,"Iris"],
	[n2n("6 oct"),n2n("8 oct"),0,"Jerry"],
	[n2n("12 oct"),n2n("15 oct"),1,"Karen"],
	[n2n("27 oct"),n2n("31 oct"),0,"Lorenzo"],
	[n2n("29 oct"),n2n("5 nov"),4,"Michelle"],
	[n2n("4 nov"),n2n("6 nov"),1,"Noel"],
	[n2n("24 nov"),n2n("4 dec"),1,"Olga"]
];
hurricanelist[2002] = [
	[n2n("14 jul"),n2n("16 jul"),0,"Arthur"],
	[n2n("4 aug"),n2n("9 aug"),0,"Bertha"],
	[n2n("5 aug"),n2n("8 aug"),0,"Cristobal"],
	[n2n("29 aug"),n2n("4 sep"),0,"Dolly"],
	[n2n("1 sep"),n2n("6 sep"),0,"Edouard"],
	[n2n("5 sep"),n2n("8 sep"),0,"Fay"],
	[n2n("7 sep"),n2n("8 sep"),-1,"Seven"],
	[n2n("8 sep"),n2n("12 sep"),2,"Gustav"],
	[n2n("12 sep"),n2n("15 sep"),2,"Hanna"],
	[n2n("14 sep"),n2n("27 sep"),3,"Isidore"],
	[n2n("17 sep"),n2n("19 sep"),0,"Josephine"],
	[n2n("20 sep"),n2n("12 oct"),1,"Kyle"],
	[n2n("21 sep"),n2n("4 oct"),4,"Lili"],
	[n2n("14 oct"),n2n("16 oct"),4,"Fourteen"]
];
hurricanelist[2003] = [
	[n2n("20 apr"),n2n("24 apr"),0,"Ana"],
	[n2n("11 jun"),n2n("11 jun"),-1,"Two"],
	[n2n("28 jun"),n2n("2 jul"),0,"Bill"],
	[n2n("8 jul"),n2n("17 jul"),1,"Claudette"],
	[n2n("16 jul"),n2n("21 jul"),1,"Danny"],
	[n2n("19 jul"),n2n("21 jul"),-1,"Six"],
	[n2n("25 jul"),n2n("27 jul"),-1,"Seven"],
	[n2n("14 aug"),n2n("17 aug"),1,"Erika"],
	[n2n("21 aug"),n2n("22 aug"),-1,"Nine"],
	[n2n("25 aug"),n2n("8 sep"),4,"Fabian"],
	[n2n("30 aug"),n2n("2 sep"),0,"Grace"],
	[n2n("3 sep"),n2n("8 sep"),0,"Henri"],
	[n2n("6 sep"),n2n("19 sep"),5,"Isabel"],
	[n2n("8 sep"),n2n("10 sep"),-1,"Fourteen"],
	[n2n("24 sep"),n2n("29 sep"),2,"Juan"],
	[n2n("25 sep"),n2n("7 oct"),3,"Kate"],
	[n2n("1 oct"),n2n("6 oct"),0,"Larry"],
	[n2n("10 oct"),n2n("14 oct"),0,"Mindy"],
	[n2n("13 oct"),n2n("23 oct"),0,"Nicholas"],
	[n2n("4 dec"),n2n("7 dec"),0,"Odette"],
	[n2n("7 dec"),n2n("11 dec"),0,"Peter"]
];
hurricanelist[2004] = [
	[n2n("31 jul"),n2n("6 aug"),3,"Alex"],
	[n2n("3 aug"),n2n("14 aug"),0,"Bonnie"],
	[n2n("9 aug"),n2n("14 aug"),4,"Charley"],
	[n2n("13 aug"),n2n("21 aug"),2,"Danielle"],
	[n2n("13 aug"),n2n("15 aug"),0,"Earl"],
	[n2n("24 aug"),n2n("10 sep"),4,"Frances"],
	[n2n("27 aug"),n2n("1 sep"),1,"Gaston"],
	[n2n("27 aug"),n2n("31 aug"),1,"Hermine"],
	[n2n("2 sep"),n2n("24 sep"),5,"Ivan"],
	[n2n("7 sep"),n2n("9 sep"),-1,"Ten"],
	[n2n("13 sep"),n2n("28 sep"),3,"Jeanne"],
	[n2n("16 sep"),n2n("24 sep"),4,"Karl"],
	[n2n("19 sep"),n2n("3 oct"),1,"Lisa"],
	[n2n("8 oct"),n2n("10 oct"),0,"Matthew"],
	[n2n("10 oct"),n2n("11 oct"),0,"Nicole"],
	[n2n("29 nov"),n2n("3 dec"),0,"Otto"]
];
hurricanelist[2005] = [
	[n2n("8 jun"),n2n("13 jun"),0,"Arlene"],
	[n2n("28 jun"),n2n("30 jun"),0,"Bret"],
	[n2n("3 jul"),n2n("7 jul"),1,"Cindy"],
	[n2n("4 jul"),n2n("13 jul"),4,"Dennis"],
	[n2n("11 jul"),n2n("21 jul"),5,"Emily"],
	[n2n("21 jul"),n2n("29 jul"),0,"Franklin"],
	[n2n("23 jul"),n2n("25 jul"),0,"Gert"],
	[n2n("2 aug"),n2n("8 aug"),0,"Harvey"],
	[n2n("4 aug"),n2n("18 aug"),2,"Irene"],
	[n2n("13 aug"),n2n("14 aug"),-1,"Ten"],
	[n2n("22 aug"),n2n("23 aug"),0,"Jose"],
	[n2n("23 aug"),n2n("30 aug"),5,"Katrina"],
	[n2n("28 aug"),n2n("2 sep"),0,"Lee"],
	[n2n("1 sep"),n2n("10 sep"),3,"Maria"],
	[n2n("5 sep"),n2n("10 sep"),1,"Nate"],
	[n2n("6 sep"),n2n("17 sep"),1,"Ophelia"],
	[n2n("17 sep"),n2n("23 sep"),1,"Philippe"],
	[n2n("18 sep"),n2n("26 sep"),5,"Rita"],
	[n2n("30 sep"),n2n("2 oct"),-1,"Nineteen"],
	[n2n("1 oct"),n2n("5 oct"),1,"Stan"],
	[n2n("4 oct"),n2n("5 oct"),0,"Unnamed"],
	[n2n("5 oct"),n2n("6 oct"),0,"Tammy"],
	[n2n("8 oct"),n2n("10 oct"),-1,"Twenty-Two"],
	[n2n("8 oct"),n2n("11 oct"),1,"Vince"],
	[n2n("15 oct"),n2n("26 oct"),5,"Wilma"],
	[n2n("22 oct"),n2n("24 oct"),0,"Alpha"],
	[n2n("26 oct"),n2n("31 oct"),3,"Beta"],
	[n2n("14 nov"),n2n("21 nov"),0,"Gamma"],
	[n2n("22 nov"),n2n("28 nov"),0,"Delta"],
	[n2n("29 nov"),n2n("8 dec"),1,"Epsilon"],
	[n2n("30 dec"),n2n("31 dec"),0,"Zeta"] // cont'd next year
];
hurricanelist[2006] = [
	[n2n("1 jan"),n2n("6 jan"),0,"Zeta"], // cont'd from last year
	[n2n("10 jun"),n2n("14 jun"),0,"Alberto"],
	[n2n("17 jul"),n2n("18 jul"),0,"Unnamed"],
	[n2n("18 jul"),n2n("21 jul"),0,"Beryl"],
	[n2n("1 aug"),n2n("4 aug"),0,"Chris"],
	[n2n("21 aug"),n2n("26 aug"),0,"Debby"],
	[n2n("24 aug"),n2n("1 sep"),1,"Ernesto"],
	[n2n("3 sep"),n2n("13 sep"),1,"Florence"],
	[n2n("11 sep"),n2n("20 sep"),3,"Gordon"],
	[n2n("12 sep"),n2n("24 sep"),3,"Helene"],
	[n2n("27 sep"),n2n("2 oct"),1,"Isaac"]
];
hurricanelist[2007] = [
	[n2n("9 may"),n2n("11 may"),0,"Andrea"],
	[n2n("1 jun"),n2n("5 jun"),0,"Barry"],
	[n2n("31 jul"),n2n("1 aug"),0,"Chantal"],
	[n2n("13 aug"),n2n("23 aug"),5,"Dean"],
	[n2n("15 aug"),n2n("17 aug"),0,"Erin"],
	[n2n("31 aug"),n2n("5 sep"),5,"Felix"],
	[n2n("8 sep"),n2n("11 sep"),0,"Gabrielle"],
	[n2n("12 sep"),n2n("17 sep"),0,"Ingrid"],
	[n2n("12 sep"),n2n("14 sep"),1,"Humberto"],
	[n2n("21 sep"),n2n("22 sep"),-1,"Ten"],
	[n2n("23 sep"),n2n("24 sep"),0,"Jerry"],
	[n2n("25 sep"),n2n("29 sep"),1,"Karen"],
	[n2n("25 sep"),n2n("28 sep"),1,"Lorenzo"],
	[n2n("28 sep"),n2n("30 sep"),0,"Melissa"],
	[n2n("11 oct"),n2n("12 oct"),0,"Fifteen"],
	[n2n("28 oct"),n2n("2 nov"),1,"Noel"],
	[n2n("11 dec"),n2n("13 dec"),0,"Olga"]
];
hurricanelist[2008] = [
	[n2n("31 may"),n2n("2 jun"),0,"Arthur"],
	[n2n("3 jul"),n2n("20 jul"),3,"Bertha"],
	[n2n("19 jul"),n2n("23 jul"),0,"Cristobal"],
	[n2n("20 jul"),n2n("25 jul"),2,"Dolly"],
	[n2n("3 aug"),n2n("6 aug"),0,"Edouard"],
	[n2n("15 aug"),n2n("27 aug"),0,"Fay"],
	[n2n("25 aug"),n2n("4 sep"),4,"Gustav"],
	[n2n("28 aug"),n2n("7 sep"),1,"Hanna"],
	[n2n("1 sep"),n2n("14 sep"),4,"Ike"],
	[n2n("2 sep"),n2n("6 sep"),0,"Josephine"],
	[n2n("25 sep"),n2n("29 sep"),1,"Kyle"],
	[n2n("29 sep"),n2n("1 oct"),0,"Laura"],
	[n2n("6 oct"),n2n("7 oct"),0,"Marco"],
	[n2n("12 oct"),n2n("14 oct"),0,"Nana"],
	[n2n("13 oct"),n2n("18 oct"),4,"Omar"],
	[n2n("14 oct"),n2n("15 oct"),-1,"Sixteen"],
	[n2n("5 nov"),n2n("10 nov"),4,"Paloma"]
];
hurricanelist[2009] = [
	[n2n("28 may"),n2n("29 may"),-1,"One"],
	[n2n("11 aug"),n2n("16 aug"),0,"Ana"],
	[n2n("15 aug"),n2n("24 aug"),4,"Bill"],
	[n2n("16 aug"),n2n("18 aug"),0,"Claudette"],
	[n2n("26 aug"),n2n("29 aug"),0,"Danny"],
	[n2n("1 sep"),n2n("3 sep"),0,"Erika"],
	[n2n("7 sep"),n2n("12 sep"),3,"Fred"],
	[n2n("25 sep"),n2n("26 sep"),-1,"Eight"],
	[n2n("4 oct"),n2n("6 oct"),0,"Grace"],
	[n2n("6 oct"),n2n("8 oct"),0,"Henri"],
	[n2n("4 nov"),n2n("10 nov"),2,"Ida"]
];
hurricanelist[2010] = [
	[n2n("25 jun"),n2n("2 jul"),2,"Alex"],
	[n2n("8 jul"),n2n("9 jul"),-1,"Two"],
	[n2n("22 jul"),n2n("24 jul"),0,"Bonnie"],
	[n2n("2 aug"),n2n("8 aug"),0,"Colin"],
	[n2n("10 aug"),n2n("11 aug"),-1,"Five"],
	[n2n("21 aug"),n2n("30 aug"),4,"Danielle"],
	[n2n("25 aug"),n2n("4 sep"),4,"Earl"],
	[n2n("30 aug"),n2n("3 sep"),0,"Fiona"],
	[n2n("1 sep"),n2n("2 sep"),0,"Gaston"],
	[n2n("5 sep"),n2n("9 sep"),0,"Hermine"],
	[n2n("8 sep"),n2n("21 sep"),4,"Igor"],
	[n2n("12 sep"),n2n("20 sep"),4,"Julia"],
	[n2n("14 sep"),n2n("18 sep"),3,"Karl"],
	[n2n("20 sep"),n2n("26 sep"),1,"Lisa"],
	[n2n("23 sep"),n2n("26 sep"),0,"Matthew"],
	[n2n("28 sep"),n2n("29 sep"),0,"Nicole"],
	[n2n("6 oct"),n2n("10 oct"),1,"Otto"],
	[n2n("11 oct"),n2n("15 oct"),2,"Paula"],
	[n2n("20 oct"),n2n("26 oct"),2,"Richard"],
	[n2n("28 oct"),n2n("30 oct"),1,"Shary"],
	[n2n("29 oct"),n2n("7 nov"),2,"Tomas"]
];
hurricanelist[2011] = [
	[n2n("28 jun"),n2n("1 jul"),0,"Arlene"],
	[n2n("17 jul"),n2n("22 jul"),0,"Bret"],
	[n2n("20 jul"),n2n("22 jul"),0,"Cindy"],
	[n2n("27 jul"),n2n("30 jul"),0,"Don"],
	[n2n("2 aug"),n2n("7 aug"),0,"Emily"],
	[n2n("12 aug"),n2n("13 aug"),0,"Franklin"],
	[n2n("13 aug"),n2n("16 aug"),0,"Gert"],
	[n2n("19 aug"),n2n("22 aug"),0,"Harvey"],
	[n2n("21 aug"),n2n("28 aug"),3,"Irene"],
	[n2n("25 aug"),n2n("26 aug"),-1,"Ten"],
	[n2n("27 aug"),n2n("28 aug"),0,"Jose"],
	[n2n("29 aug"),n2n("10 sep"),4,"Katia"],
	[n2n("31 aug"),n2n("3 sep"),0,"Unnamed"],
	[n2n("1 sep"),n2n("5 sep"),0,"Lee"],
	[n2n("6 sep"),n2n("16 sep"),1,"Maria"],
	[n2n("7 sep"),n2n("11 sep"),1,"Nate"],
	[n2n("20 sep"),n2n("3 oct"),4,"Ophelia"],
	[n2n("24 sep"),n2n("8 oct"),1,"Philippe"],
	[n2n("23 oct"),n2n("28 oct"),3,"Rina"],
	[n2n("8 nov"),n2n("11 nov"),0,"Sean"]
];
hurricanelist[2012] = [
	[n2n("19 may"),n2n("22 may"),0,"Alberto"],
	[n2n("26 may"),n2n("30 may"),0,"Beryl"],
	[n2n("18 jun"),n2n("22 jun"),1,"Chris"],
	[n2n("23 jun"),n2n("27 jun"),0,"Debby"],
	[n2n("1 aug"),n2n("10 aug"),2,"Ernesto"],
	[n2n("3 aug"),n2n("6 aug"),0,"Florence"],
	[n2n("9 aug"),n2n("18 aug"),0,"Helene"],
	[n2n("15 aug"),n2n("20 aug"),2,"Gordon"],
	[n2n("21 aug"),n2n("1 sep"),1,"Isaac"],
	[n2n("22 aug"),n2n("24 aug"),0,"Joyce"],
	[n2n("28 aug"),n2n("2 sep"),2,"Kirk"],
	[n2n("30 aug"),n2n("11 sep"),1,"Leslie"],
	[n2n("3 sep"),n2n("11 sep"),3,"Michael"],
	[n2n("10 sep"),n2n("4 oct"),1,"Nadine"],
	[n2n("3 oct"),n2n("5 oct"),0,"Oscar"],
	[n2n("11 oct"),n2n("13 oct"),0,"Patty"],
	[n2n("12 oct"),n2n("17 oct"),1,"Rafael"],
	[n2n("22 oct"),n2n("29 oct"),3,"Sandy"],
	[n2n("22 oct"),n2n("25 oct"),0,"Tony"]
];
hurricanelist[2013] = [
	[n2n("5 jun"),n2n("7 jun"),0,"Andrea"],
	[n2n("17 jun"),n2n("20 jun"),0,"Barry"],
	[n2n("7 jul"),n2n("10 jul"),0,"Chantal"],
	[n2n("23 jul"),n2n("3 aug"),0,"Dorian"],
	[n2n("15 aug"),n2n("18 aug"),0,"Erin"],
	[n2n("25 aug"),n2n("26 aug"),0,"Fernand"],
	[n2n("4 sep"),n2n("13 sep"),0,"Gabrielle"],
	[n2n("6 sep"),n2n("7 sep"),-1,"Eight"],
	[n2n("8 sep"),n2n("19 sep"),1,"Humberto"],
	[n2n("12 sep"),n2n("17 sep"),1,"Ingrid"],
	[n2n("29 sep"),n2n("3 oct"),0,"Jerry"],
	[n2n("3 oct"),n2n("6 oct"),0,"Karen"],
	[n2n("21 oct"),n2n("24 oct"),0,"Lorenzo"],
	[n2n("18 nov"),n2n("21 nov"),0,"Melissa"],
	[n2n("5 dec"),n2n("7 dec"),0,"Unnamed"]
];
hurricanelist[2014] = [
	[n2n("1 jul"),n2n("5 jul"),2,"Arthur"],
	[n2n("21 jul"),n2n("23 jul"),-1,"Two"],
	[n2n("1 aug"),n2n("6 aug"),1,"Bertha"],
	[n2n("23 aug"),n2n("29 aug"),1,"Cristobal"],
	[n2n("1 sep"),n2n("3 sep"),0,"Dolly"],
	[n2n("11 sep"),n2n("19 sep"),3,"Edouard"],
	[n2n("10 oct"),n2n("13 oct"),1,"Fay"],
	[n2n("12 oct"),n2n("19 oct"),4,"Gonzalo"],
	[n2n("22 oct"),n2n("28 oct"),0,"Hanna"]
];
hurricanelist[2015] = [
	[n2n("8 may"),n2n("11 may"),0,"Ana"],
	[n2n("16 jun"),n2n("18 jun"),0,"Bill"],
	[n2n("13 jul"),n2n("14 jul"),0,"Claudette"],
	[n2n("18 aug"),n2n("24 aug"),3,"Danny"],
	[n2n("25 aug"),n2n("29 aug"),0,"Erika"],
	[n2n("30 aug"),n2n("6 sep"),1,"Fred"],
	[n2n("5 sep"),n2n("9 sep"),0,"Grace"],
	[n2n("8 sep"),n2n("11 sep"),0,"Henri"],
	[n2n("16 sep"),n2n("19 sep"),-1,"Nine"],
	[n2n("18 sep"),n2n("27 sep"),0,"Ida"],
	[n2n("28 sep"),n2n("8 oct"),4,"Juaquin"],
	[n2n("8 nov"),n2n("11 nov"),1,"Kate"]
];
hurricanelist[2016] = [
	[11,14,1,"Alex"],
	[147,155,0,"Bonnie"],
	[156,158,0,"Colin"],
	[170,172,0,"Danielle"],
	[214,218,1,"Earl"],
	[228,235,0,"Fiona"],
	[234,245,3,"Gaston"],
	[240,244,-1,"Eight"],
	[240,246,1,"Hermine"],
	[255,259,0,"Ian"],
	[256,261,0,"Julia"],
	[257,268,0,"Karl"],
	[262,268,0,"Lisa"],
	[271,282,5,"Matthew"],
	[277,291,4,"Nicole"],
	[324,329,3,"Otto"]
];
hurricanelist[2017] = [
	[109,111,0,"Arlene"],
	[170,171,0,"Bret"],
	[171,174,0,"Cindy"],
	[186,188,-1,"Four"],
	[198,199,0,"Don"],
	[211,214,0,"Emily"],
	[219,222,1,"Franklin"],
	[224,229,2,"Gert"],
	[229,244,4,"Harvey"],
	[242,255,5,"Irma"],
	[248,265,4,"Jose"],
	[248,252,2,"Katia"],
	[257,273,3,"Lee"],
	[259,273,5,"Maria"],
	[277,282,1,"Nate"],
	[282,289,3,"Ophelia"],
	[301,302,0,"Philippe"],
	[309,313,0,"Rina"]
];
hurricanelist[2018] = [
	[117,123,0,"Alberto"],
	[186,197,1,"Beryl"],
	[187,193,2,"Chris"],
	[219,221,0,"Debby"],
	[227,230,0,"Ernesto"],
	[243,262,4,"Florence"],
	[246,251,0,"Gordon"],
	[250,259,2,"Helene"],
	[250,258,1,"Isaac"],
	[255,262,0,"Joyce"],
	[265,266,-1,"Eleven"],
	[265,267,0,"Kirk"],
	[266,268,0,"Leslie"]
];

var alphabet = "abcdefghijklmnoprstvw".split("");
var greek = [
	"alpha",
	"beta",
	"gamma",
	"delta",
	"epsilon",
	"zeta",
	"eta",
	"theta",
	"iota",
	"kappa",
	"lambda",
	"mu",
	"nu",
	"xi",
	"omicron",
	"pi",
	"rho",
	"sigma",
	"tau",
	"tau",
	"upsilon",
	"phi",
	"chi",
	"psi",
	"omega"
];
var numbers = [
	"one",
	"two",
	"three",
	"four",
	"five",
	"six",
	"seven",
	"eight",
	"nine",
	"ten",
	"eleven",
	"twelve",
	"thirteen",
	"fourteen",
	"fifteen",
	"sixteen",
	"seventeen",
	"eighteen",
	"nineteen",
	"twenty"
];

// for the random generator

function volumes(){
	"use strict";
	var v = [];
	hurricanelist.forEach(function(x){ // for each year
		v.push(x.length);
	});
	return v;
}

var averagePerYear = mean(volumes());
var sdPerYear = sd(volumes());

function pseudoNormal(mean, sd){ // I couldn't find any way to do a TRUE normal distr., so this is my close approximation.
	"use strict";
	var r = Math.random();
	var lower, upper;
	if (r < 0.022){
		lower = mean-3*sd;
		upper = mean-2*sd;
	}
	else if (r < 0.158){
		lower = mean-2*sd;
		upper = mean-sd;
	}
	else if (r < 0.5){
		lower = mean-sd;
		upper = mean;
	}
	else if (r < 0.841){
		lower = mean;
		upper = mean+sd;
	}
	else if (r < 0.977){
		lower = mean+sd;
		upper = mean+2*sd;
	}
	else {
		lower = mean+2*sd;
		upper = mean+3*sd;
	}
	return randomRange(lower, upper);
}

function randomVolume(){ // I couldn't find any way to do a TRUE normal distr., so this is my close approximation.
	"use strict";
	return Math.round(pseudoNormal(averagePerYear, sdPerYear));
}

function randomSeason(){
	"use strict";
	var name;
	// setup
	var volume = randomVolume();
	document.getElementById("randomSeason").innerHTML = "<tr><th>Name</th><th>From</th><th>Until</th><th>Category</th></tr>";
	var starts = [];
	// main
	range1(volume).forEach(function(x){
		var randomYear = Math.round(randomRange(1995,2018));
		var randomStorm = Math.round(randomRange(0,hurricanelist[randomYear].length-1));
		var randomStart = hurricanelist[randomYear][randomStorm][0];
		starts.push(randomStart);
	});
	starts.sort();
	// for each date, use the date to generate a random END and CATEGORY
	var currentDepression = 0;
	var currentStorm = 0;
	starts.forEach(function(x){
		var category = Math.round(randomRange(-1,maxcatduring(x)));
		var end = x + Math.round(avgDuration(category)); // fixme - better, but still suboptimal
		var newrow = document.createElement("tr");
		if (category > -1){
			if (currentStorm < alphabet.length){ // names
				name = alphabet[currentStorm];
			}
			else { // greek
				name = greek[currentStorm - alphabet.length];
			}
			currentStorm += 1;
		}
		else { // numbers
			if (currentDepression < 20){
				name = numbers[currentDepression];
			}
			else {
				name = "twenty-" + numbers[currentDepression-20];
			}
		}
		currentDepression += 1;
		// print
		newrow.innerHTML = "<td>"+proper(name)+"</td><td>"+n2n2(x)+"</td><td>"+n2n2(end)+"</td>"+catStyle(category);
		document.getElementById("randomSeason").appendChild(newrow);
	});
}