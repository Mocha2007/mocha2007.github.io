/* jshint esversion: 6, strict: true, strict: global, eqeqeq: true */
/* global mean, proper, random, sd */
/* exported avgprint, avgyear, randomSeason, seasonstats */
'use strict';

const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun',
	'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const offset = [-1, 30, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];

/** @param {string} name */
function n2n(name){ // name to number
	const date = name.split(' ');
	const day = Number(date[0]);
	const month = months.indexOf(date[1].toLowerCase());
	return offset[month] + day;
}

/** @param {number} n */
function n2n2(n){ // number to name
	for (let i = 12; 0 < i; i--){
		if (n > offset[i]){
			const day = n - offset[i];
			return day+' '+proper(months[i]);
		}
	}
	return n+1+' Jan';
}

// https://stackoverflow.com/a/9902282/2579798
function realsize(x){
	return x.filter(function(value){
		return typeof value !== 'undefined';
	}).length;
}

function avgduring(date){
	let n = 0;
	const years = realsize(hurricanelist);
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
	let maxcat = -1;
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
	const style = category > 0 ? 'c'+category : category === 0 ? 'ts' : 'td';
	return '<td class='+style+'>'+style.toUpperCase()+'</td>';
}

function maxcathtml(date){
	return catStyle(maxcatduring(date));
}

function fractionhurricane(date, m, n){
	// % of cat m hurricanes that turn into cat n hurricanes
	const maxcat = maxcatduring(date);
	let maxcatname = maxcat < n ? '0' : 1;
	let stormsondate = 0;
	let hurricanesondate = 0;
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
	return '<td class=\'p'+Math.floor(maxcatname/10)+'\'>'+maxcatname+'%</td>';
}

function yearsContaining(date){
	// % of years where ANY storm exists on a date
	let yearCount = 0;
	let stormsondate = 0;
	hurricanelist.forEach(function(x){ // for each year
		yearCount += 1;
		x.some(function(y){ // for each hurricane
			if (y[1] >= date && date >= y[0]){
				stormsondate += 1;
				return true;
			}
		});
	});
	const ratio = Math.floor(stormsondate / yearCount*100);
	return '<td class=\'p'+Math.floor(ratio/10)+'\'>'+ratio+'%</td>';
}

function avgDuration(category){
	// average category duration
	let d = 0;
	let n = 0;
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

function avgDurationSD(category){
	// average category duration standard deviation
	const durations = [];
	hurricanelist.forEach(function(x){ // for each year
		x.forEach(function(y){ // for each hurricane
			if (y[2] === category){
				durations.push(y[1]-y[0]);
			}
		});
	});
	return sd(durations);
}

function range1(n){
	return n?range1(n-1).concat(n):[]; // Array(n).fill().map((x,i)=>i);
}

function avgprint(){
	range1(356).forEach(function(x){
		console.log(x, avgduring(x));
	});
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/max
function getMaxOfArray(numArray){
	return Math.max.apply(null, numArray);
}

function maxyear(){
	const wholeyear = [];
	range1(356).forEach(function(x){
		wholeyear.push(avgduring(x));
	});
	return getMaxOfArray(wholeyear);
}

function avgyear(){
	const wholeyear = [];
	const maxinyear = maxyear();
	// reset
	document.getElementById('avgByDate').innerHTML = '<tr><th>Date</th><th>Quantity</th><th>Visual</th><th>Max</th><th>%D</th><th>%H</th><th>%M</th></tr>';
	range1(366).forEach(function(x){
		x = x-1;
		const newrow = document.createElement('tr');
		const newval = avgduring(x);
		wholeyear.push(newval);
		const datestring = n2n2(x);
		newrow.innerHTML = '<td>'+datestring+'</td><td>'+Math.round(newval*100)/100+'</td><td><progress value='+newval+' max='+maxinyear+'></progress></td>'+maxcathtml(x)+yearsContaining(x)+fractionhurricane(x, -1, 1)+fractionhurricane(x, 1, 3);
		document.getElementById('avgByDate').appendChild(newrow);
	});
	return wholeyear;
}

function seasonstats(year){
	const y = hurricanelist[year];
	// maj. hurricanes (3+)
	let majors = 0;
	// hurricanes
	let hurricanes = 0;
	// storms
	let storms = 0;
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
	const depressions = y.length;
	return [depressions, storms, hurricanes, majors];
}

// data follows
// hurricanelist[year][number] = [start,end,cat,name];

const hurricanelist = [];
hurricanelist[1995] = [
	[n2n('2 jun'), n2n('10 jun'), 1, 'Allison'],
	[n2n('6 jul'), n2n('10 jul'), 0, 'Barry'],
	[n2n('12 jul'), n2n('22 jul'), 0, 'Chantal'],
	[n2n('28 jul'), n2n('3 aug'), 0, 'Dean'],
	[n2n('31 jul'), n2n('6 aug'), 2, 'Erin'],
	[n2n('5 aug'), n2n('7 aug'), -1, 'Six'],
	[n2n('8 aug'), n2n('22 aug'), 4, 'Felix'],
	[n2n('9 aug'), n2n('12 aug'), 0, 'Gabrielle'],
	[n2n('21 aug'), n2n('1 sep'), 2, 'Humberto'],
	[n2n('22 aug'), n2n('4 sep'), 2, 'Iris'],
	[n2n('22 aug'), n2n('28 aug'), 0, 'Jerry'],
	[n2n('26 aug'), n2n('3 sep'), 0, 'Karen'],
	[n2n('27 aug'), n2n('11 sep'), 4, 'Luis'],
	[n2n('9 sep'), n2n('13 sep'), -1, 'Fourteen'],
	[n2n('12 sep'), n2n('22 sep'), 3, 'Marilyn'],
	[n2n('26 sep'), n2n('7 oct'), 1, 'Noel'],
	[n2n('27 sep'), n2n('5 oct'), 4, 'Opal'],
	[n2n('4 oct'), n2n('8 oct'), 0, 'Pablo'],
	[n2n('7 oct'), n2n('21 oct'), 3, 'Roxanne'],
	[n2n('20 oct'), n2n('25 oct'), 0, 'Sebastien'],
	[n2n('26 oct'), n2n('1 nov'), 1, 'Tanya'],
];
hurricanelist[1996] = [
	[n2n('17 jun'), n2n('21 jun'), 0, 'Arthur'],
	[n2n('5 jul'), n2n('14 jul'), 3, 'Bertha'],
	[n2n('24 jul'), n2n('29 jul'), 1, 'Cesar'],
	[n2n('19 aug'), n2n('26 aug'), 1, 'Dolly'],
	[n2n('19 aug'), n2n('3 sep'), 4, 'Edouard'],
	[n2n('23 aug'), n2n('8 sep'), 3, 'Fran'],
	[n2n('26 aug'), n2n('2 sep'), 0, 'Gustav'],
	[n2n('3 sep'), n2n('16 sep'), 4, 'Hortense'],
	[n2n('24 sep'), n2n('1 oct'), 3, 'Isidore'],
	[n2n('4 oct'), n2n('8 oct'), 0, 'Josephine'],
	[n2n('11 oct'), n2n('13 oct'), 0, 'Kyle'],
	[n2n('14 oct'), n2n('27 oct'), 3, 'Lili'],
	[n2n('16 nov'), n2n('26 nov'), 1, 'Marco'],
];
hurricanelist[1997] = [
	[n2n('1 jun'), n2n('2 jun'), 0, 'Unnamed'],
	[n2n('30 jun'), n2n('4 jul'), 0, 'Ana'],
	[n2n('11 jul'), n2n('13 jul'), 1, 'Bill'],
	[n2n('13 jul'), n2n('16 jul'), 0, 'Claudette'],
	[n2n('16 jul'), n2n('26 jul'), 1, 'Danny'],
	[n2n('17 jul'), n2n('19 jul'), -1, 'Five'],
	[n2n('3 sep'), n2n('20 sep'), 3, 'Erika'],
	[n2n('4 oct'), n2n('8 oct'), 0, 'Fabian'],
	[n2n('16 oct'), n2n('17 oct'), 0, 'Grace'],
];
hurricanelist[1998] = [
	[n2n('27 jul'), n2n('2 aug'), 0, 'Alex'],
	[n2n('19 jul'), n2n('30 aug'), 3, 'Bonnie'],
	[n2n('21 aug'), n2n('24 aug'), 0, 'Charlie'],
	[n2n('24 aug'), n2n('3 sep'), 2, 'Danielle'],
	[n2n('31 aug'), n2n('3 sep'), 2, 'Earl'],
	[n2n('8 sep'), n2n('13 sep'), 0, 'Frances'],
	[n2n('15 sep'), n2n('1 oct'), 4, 'Georges'],
	[n2n('17 sep'), n2n('20 sep'), 0, 'Hermine'],
	[n2n('19 sep'), n2n('27 sep'), 1, 'Ivan'],
	[n2n('21 sep'), n2n('1 oct'), 2, 'Jeanne'],
	[n2n('23 sep'), n2n('28 sep'), 2, 'Karl'],
	[n2n('5 oct'), n2n('9 oct'), 1, 'Lisa'],
	[n2n('22 oct'), n2n('5 nov'), 5, 'Mitch'],
	[n2n('24 oct'), n2n('1 dec'), 1, 'Nicole'],
];
hurricanelist[1999] = [
	[n2n('11 jun'), n2n('18 jun'), 0, 'Arlene'],
	[n2n('2 jul'), n2n('3 jul'), -1, 'Two'],
	[n2n('18 aug'), n2n('25 aug'), 4, 'Bret'],
	[n2n('19 aug'), n2n('31 aug'), 4, 'Cindy'],
	[n2n('24 aug'), n2n('9 sep'), 2, 'Dennis'],
	[n2n('24 aug'), n2n('28 aug'), 0, 'Emily'],
	[n2n('5 sep'), n2n('7 sep'), -1, 'Seven'],
	[n2n('7 sep'), n2n('17 sep'), 4, 'Floyd'],
	[n2n('11 sep'), n2n('23 sep'), 4, 'Gert'],
	[n2n('19 sep'), n2n('22 sep'), 0, 'Harvey'],
	[n2n('4 oct'), n2n('6 oct'), -1, 'Eleven'],
	[n2n('6 oct'), n2n('8 oct'), -1, 'Twelve'],
	[n2n('12 oct'), n2n('19 oct'), 2, 'Irene'],
	[n2n('17 oct'), n2n('25 oct'), 2, 'Jose'],
	[n2n('27 oct'), n2n('1 nov'), 0, 'Katrina'],
	[n2n('13 nov'), n2n('23 nov'), 4, 'Lenny'],
];
hurricanelist[2000] = [
	[n2n('7 jun'), n2n('8 jun'), -1, 'One'],
	[n2n('23 jun'), n2n('25 jun'), -1, 'Two'],
	[n2n('3 aug'), n2n('23 aug'), 3, 'Alberto'],
	[n2n('8 aug'), n2n('11 aug'), -1, 'Four'],
	[n2n('13 aug'), n2n('15 aug'), 0, 'Beryl'],
	[n2n('17 aug'), n2n('19 aug'), 0, 'Chris'],
	[n2n('19 aug'), n2n('24 aug'), 1, 'Debby'],
	[n2n('1 sep'), n2n('3 sep'), 0, 'Ernesto'],
	[n2n('8 sep'), n2n('9 sep'), -1, 'Nine'],
	[n2n('10 sep'), n2n('17 sep'), 1, 'Florence'],
	[n2n('14 sep'), n2n('21 sep'), 1, 'Gordon'],
	[n2n('15 sep'), n2n('25 sep'), 0, 'Helene'],
	[n2n('21 sep'), n2n('1 oct'), 4, 'Isaac'],
	[n2n('25 sep'), n2n('2 oct'), 1, 'Joyce'],
	[n2n('28 sep'), n2n('6 oct'), 4, 'Keith'],
	[n2n('4 oct'), n2n('7 oct'), 0, 'Leslie'],
	[n2n('15 oct'), n2n('20 oct'), 2, 'Michael'],
	[n2n('19 oct'), n2n('21 oct'), 0, 'Nadine'],
	[n2n('25 oct'), n2n('29 oct'), 0, 'Unnamed'],
];
hurricanelist[2001] = [
	[n2n('4 jun'), n2n('18 jun'), 0, 'Allison'],
	[n2n('11 jul'), n2n('12 jul'), -1, 'Two'],
	[n2n('2 aug'), n2n('8 aug'), 0, 'Barry'],
	[n2n('14 aug'), n2n('22 aug'), 0, 'Chantal'],
	[n2n('22 aug'), n2n('28 aug'), 0, 'Dean'],
	[n2n('1 sep'), n2n('5 sep'), 3, 'Erin'],
	[n2n('7 sep'), n2n('19 sep'), 3, 'Felix'],
	[n2n('11 sep'), n2n('19 sep'), 1, 'Gabrielle'],
	[n2n('19 sep'), n2n('20 sep'), -1, 'Nine'],
	[n2n('21 sep'), n2n('27 sep'), 2, 'Humberto'],
	[n2n('4 oct'), n2n('9 oct'), 4, 'Iris'],
	[n2n('6 oct'), n2n('8 oct'), 0, 'Jerry'],
	[n2n('12 oct'), n2n('15 oct'), 1, 'Karen'],
	[n2n('27 oct'), n2n('31 oct'), 0, 'Lorenzo'],
	[n2n('29 oct'), n2n('5 nov'), 4, 'Michelle'],
	[n2n('4 nov'), n2n('6 nov'), 1, 'Noel'],
	[n2n('24 nov'), n2n('4 dec'), 1, 'Olga'],
];
hurricanelist[2002] = [
	[n2n('14 jul'), n2n('16 jul'), 0, 'Arthur'],
	[n2n('4 aug'), n2n('9 aug'), 0, 'Bertha'],
	[n2n('5 aug'), n2n('8 aug'), 0, 'Cristobal'],
	[n2n('29 aug'), n2n('4 sep'), 0, 'Dolly'],
	[n2n('1 sep'), n2n('6 sep'), 0, 'Edouard'],
	[n2n('5 sep'), n2n('8 sep'), 0, 'Fay'],
	[n2n('7 sep'), n2n('8 sep'), -1, 'Seven'],
	[n2n('8 sep'), n2n('12 sep'), 2, 'Gustav'],
	[n2n('12 sep'), n2n('15 sep'), 2, 'Hanna'],
	[n2n('14 sep'), n2n('27 sep'), 3, 'Isidore'],
	[n2n('17 sep'), n2n('19 sep'), 0, 'Josephine'],
	[n2n('20 sep'), n2n('12 oct'), 1, 'Kyle'],
	[n2n('21 sep'), n2n('4 oct'), 4, 'Lili'],
	[n2n('14 oct'), n2n('16 oct'), 4, 'Fourteen'],
];
hurricanelist[2003] = [
	[n2n('20 apr'), n2n('24 apr'), 0, 'Ana'],
	[n2n('11 jun'), n2n('11 jun'), -1, 'Two'],
	[n2n('28 jun'), n2n('2 jul'), 0, 'Bill'],
	[n2n('8 jul'), n2n('17 jul'), 1, 'Claudette'],
	[n2n('16 jul'), n2n('21 jul'), 1, 'Danny'],
	[n2n('19 jul'), n2n('21 jul'), -1, 'Six'],
	[n2n('25 jul'), n2n('27 jul'), -1, 'Seven'],
	[n2n('14 aug'), n2n('17 aug'), 1, 'Erika'],
	[n2n('21 aug'), n2n('22 aug'), -1, 'Nine'],
	[n2n('25 aug'), n2n('8 sep'), 4, 'Fabian'],
	[n2n('30 aug'), n2n('2 sep'), 0, 'Grace'],
	[n2n('3 sep'), n2n('8 sep'), 0, 'Henri'],
	[n2n('6 sep'), n2n('19 sep'), 5, 'Isabel'],
	[n2n('8 sep'), n2n('10 sep'), -1, 'Fourteen'],
	[n2n('24 sep'), n2n('29 sep'), 2, 'Juan'],
	[n2n('25 sep'), n2n('7 oct'), 3, 'Kate'],
	[n2n('1 oct'), n2n('6 oct'), 0, 'Larry'],
	[n2n('10 oct'), n2n('14 oct'), 0, 'Mindy'],
	[n2n('13 oct'), n2n('23 oct'), 0, 'Nicholas'],
	[n2n('4 dec'), n2n('7 dec'), 0, 'Odette'],
	[n2n('7 dec'), n2n('11 dec'), 0, 'Peter'],
];
hurricanelist[2004] = [
	[n2n('31 jul'), n2n('6 aug'), 3, 'Alex'],
	[n2n('3 aug'), n2n('14 aug'), 0, 'Bonnie'],
	[n2n('9 aug'), n2n('14 aug'), 4, 'Charley'],
	[n2n('13 aug'), n2n('21 aug'), 2, 'Danielle'],
	[n2n('13 aug'), n2n('15 aug'), 0, 'Earl'],
	[n2n('24 aug'), n2n('10 sep'), 4, 'Frances'],
	[n2n('27 aug'), n2n('1 sep'), 1, 'Gaston'],
	[n2n('27 aug'), n2n('31 aug'), 1, 'Hermine'],
	[n2n('2 sep'), n2n('24 sep'), 5, 'Ivan'],
	[n2n('7 sep'), n2n('9 sep'), -1, 'Ten'],
	[n2n('13 sep'), n2n('28 sep'), 3, 'Jeanne'],
	[n2n('16 sep'), n2n('24 sep'), 4, 'Karl'],
	[n2n('19 sep'), n2n('3 oct'), 1, 'Lisa'],
	[n2n('8 oct'), n2n('10 oct'), 0, 'Matthew'],
	[n2n('10 oct'), n2n('11 oct'), 0, 'Nicole'],
	[n2n('29 nov'), n2n('3 dec'), 0, 'Otto'],
];
hurricanelist[2005] = [
	[n2n('8 jun'), n2n('13 jun'), 0, 'Arlene'],
	[n2n('28 jun'), n2n('30 jun'), 0, 'Bret'],
	[n2n('3 jul'), n2n('7 jul'), 1, 'Cindy'],
	[n2n('4 jul'), n2n('13 jul'), 4, 'Dennis'],
	[n2n('11 jul'), n2n('21 jul'), 5, 'Emily'],
	[n2n('21 jul'), n2n('29 jul'), 0, 'Franklin'],
	[n2n('23 jul'), n2n('25 jul'), 0, 'Gert'],
	[n2n('2 aug'), n2n('8 aug'), 0, 'Harvey'],
	[n2n('4 aug'), n2n('18 aug'), 2, 'Irene'],
	[n2n('13 aug'), n2n('14 aug'), -1, 'Ten'],
	[n2n('22 aug'), n2n('23 aug'), 0, 'Jose'],
	[n2n('23 aug'), n2n('30 aug'), 5, 'Katrina'],
	[n2n('28 aug'), n2n('2 sep'), 0, 'Lee'],
	[n2n('1 sep'), n2n('10 sep'), 3, 'Maria'],
	[n2n('5 sep'), n2n('10 sep'), 1, 'Nate'],
	[n2n('6 sep'), n2n('17 sep'), 1, 'Ophelia'],
	[n2n('17 sep'), n2n('23 sep'), 1, 'Philippe'],
	[n2n('18 sep'), n2n('26 sep'), 5, 'Rita'],
	[n2n('30 sep'), n2n('2 oct'), -1, 'Nineteen'],
	[n2n('1 oct'), n2n('5 oct'), 1, 'Stan'],
	[n2n('4 oct'), n2n('5 oct'), 0, 'Unnamed'],
	[n2n('5 oct'), n2n('6 oct'), 0, 'Tammy'],
	[n2n('8 oct'), n2n('10 oct'), -1, 'Twenty-Two'],
	[n2n('8 oct'), n2n('11 oct'), 1, 'Vince'],
	[n2n('15 oct'), n2n('26 oct'), 5, 'Wilma'],
	[n2n('22 oct'), n2n('24 oct'), 0, 'Alpha'],
	[n2n('26 oct'), n2n('31 oct'), 3, 'Beta'],
	[n2n('14 nov'), n2n('21 nov'), 0, 'Gamma'],
	[n2n('22 nov'), n2n('28 nov'), 0, 'Delta'],
	[n2n('29 nov'), n2n('8 dec'), 1, 'Epsilon'],
	[n2n('30 dec'), n2n('31 dec'), 0, 'Zeta'], // cont'd next year
];
hurricanelist[2006] = [
	[n2n('1 jan'), n2n('6 jan'), 0, 'Zeta'], // cont'd from last year
	[n2n('10 jun'), n2n('14 jun'), 0, 'Alberto'],
	[n2n('17 jul'), n2n('18 jul'), 0, 'Unnamed'],
	[n2n('18 jul'), n2n('21 jul'), 0, 'Beryl'],
	[n2n('1 aug'), n2n('4 aug'), 0, 'Chris'],
	[n2n('21 aug'), n2n('26 aug'), 0, 'Debby'],
	[n2n('24 aug'), n2n('1 sep'), 1, 'Ernesto'],
	[n2n('3 sep'), n2n('13 sep'), 1, 'Florence'],
	[n2n('11 sep'), n2n('20 sep'), 3, 'Gordon'],
	[n2n('12 sep'), n2n('24 sep'), 3, 'Helene'],
	[n2n('27 sep'), n2n('2 oct'), 1, 'Isaac'],
];
hurricanelist[2007] = [
	[n2n('9 may'), n2n('11 may'), 0, 'Andrea'],
	[n2n('1 jun'), n2n('5 jun'), 0, 'Barry'],
	[n2n('31 jul'), n2n('1 aug'), 0, 'Chantal'],
	[n2n('13 aug'), n2n('23 aug'), 5, 'Dean'],
	[n2n('15 aug'), n2n('17 aug'), 0, 'Erin'],
	[n2n('31 aug'), n2n('5 sep'), 5, 'Felix'],
	[n2n('8 sep'), n2n('11 sep'), 0, 'Gabrielle'],
	[n2n('12 sep'), n2n('17 sep'), 0, 'Ingrid'],
	[n2n('12 sep'), n2n('14 sep'), 1, 'Humberto'],
	[n2n('21 sep'), n2n('22 sep'), -1, 'Ten'],
	[n2n('23 sep'), n2n('24 sep'), 0, 'Jerry'],
	[n2n('25 sep'), n2n('29 sep'), 1, 'Karen'],
	[n2n('25 sep'), n2n('28 sep'), 1, 'Lorenzo'],
	[n2n('28 sep'), n2n('30 sep'), 0, 'Melissa'],
	[n2n('11 oct'), n2n('12 oct'), 0, 'Fifteen'],
	[n2n('28 oct'), n2n('2 nov'), 1, 'Noel'],
	[n2n('11 dec'), n2n('13 dec'), 0, 'Olga'],
];
hurricanelist[2008] = [
	[n2n('31 may'), n2n('2 jun'), 0, 'Arthur'],
	[n2n('3 jul'), n2n('20 jul'), 3, 'Bertha'],
	[n2n('19 jul'), n2n('23 jul'), 0, 'Cristobal'],
	[n2n('20 jul'), n2n('25 jul'), 2, 'Dolly'],
	[n2n('3 aug'), n2n('6 aug'), 0, 'Edouard'],
	[n2n('15 aug'), n2n('27 aug'), 0, 'Fay'],
	[n2n('25 aug'), n2n('4 sep'), 4, 'Gustav'],
	[n2n('28 aug'), n2n('7 sep'), 1, 'Hanna'],
	[n2n('1 sep'), n2n('14 sep'), 4, 'Ike'],
	[n2n('2 sep'), n2n('6 sep'), 0, 'Josephine'],
	[n2n('25 sep'), n2n('29 sep'), 1, 'Kyle'],
	[n2n('29 sep'), n2n('1 oct'), 0, 'Laura'],
	[n2n('6 oct'), n2n('7 oct'), 0, 'Marco'],
	[n2n('12 oct'), n2n('14 oct'), 0, 'Nana'],
	[n2n('13 oct'), n2n('18 oct'), 4, 'Omar'],
	[n2n('14 oct'), n2n('15 oct'), -1, 'Sixteen'],
	[n2n('5 nov'), n2n('10 nov'), 4, 'Paloma'],
];
hurricanelist[2009] = [
	[n2n('28 may'), n2n('29 may'), -1, 'One'],
	[n2n('11 aug'), n2n('16 aug'), 0, 'Ana'],
	[n2n('15 aug'), n2n('24 aug'), 4, 'Bill'],
	[n2n('16 aug'), n2n('18 aug'), 0, 'Claudette'],
	[n2n('26 aug'), n2n('29 aug'), 0, 'Danny'],
	[n2n('1 sep'), n2n('3 sep'), 0, 'Erika'],
	[n2n('7 sep'), n2n('12 sep'), 3, 'Fred'],
	[n2n('25 sep'), n2n('26 sep'), -1, 'Eight'],
	[n2n('4 oct'), n2n('6 oct'), 0, 'Grace'],
	[n2n('6 oct'), n2n('8 oct'), 0, 'Henri'],
	[n2n('4 nov'), n2n('10 nov'), 2, 'Ida'],
];
hurricanelist[2010] = [
	[n2n('25 jun'), n2n('2 jul'), 2, 'Alex'],
	[n2n('8 jul'), n2n('9 jul'), -1, 'Two'],
	[n2n('22 jul'), n2n('24 jul'), 0, 'Bonnie'],
	[n2n('2 aug'), n2n('8 aug'), 0, 'Colin'],
	[n2n('10 aug'), n2n('11 aug'), -1, 'Five'],
	[n2n('21 aug'), n2n('30 aug'), 4, 'Danielle'],
	[n2n('25 aug'), n2n('4 sep'), 4, 'Earl'],
	[n2n('30 aug'), n2n('3 sep'), 0, 'Fiona'],
	[n2n('1 sep'), n2n('2 sep'), 0, 'Gaston'],
	[n2n('5 sep'), n2n('9 sep'), 0, 'Hermine'],
	[n2n('8 sep'), n2n('21 sep'), 4, 'Igor'],
	[n2n('12 sep'), n2n('20 sep'), 4, 'Julia'],
	[n2n('14 sep'), n2n('18 sep'), 3, 'Karl'],
	[n2n('20 sep'), n2n('26 sep'), 1, 'Lisa'],
	[n2n('23 sep'), n2n('26 sep'), 0, 'Matthew'],
	[n2n('28 sep'), n2n('29 sep'), 0, 'Nicole'],
	[n2n('6 oct'), n2n('10 oct'), 1, 'Otto'],
	[n2n('11 oct'), n2n('15 oct'), 2, 'Paula'],
	[n2n('20 oct'), n2n('26 oct'), 2, 'Richard'],
	[n2n('28 oct'), n2n('30 oct'), 1, 'Shary'],
	[n2n('29 oct'), n2n('7 nov'), 2, 'Tomas'],
];
hurricanelist[2011] = [
	[n2n('28 jun'), n2n('1 jul'), 0, 'Arlene'],
	[n2n('17 jul'), n2n('22 jul'), 0, 'Bret'],
	[n2n('20 jul'), n2n('22 jul'), 0, 'Cindy'],
	[n2n('27 jul'), n2n('30 jul'), 0, 'Don'],
	[n2n('2 aug'), n2n('7 aug'), 0, 'Emily'],
	[n2n('12 aug'), n2n('13 aug'), 0, 'Franklin'],
	[n2n('13 aug'), n2n('16 aug'), 0, 'Gert'],
	[n2n('19 aug'), n2n('22 aug'), 0, 'Harvey'],
	[n2n('21 aug'), n2n('28 aug'), 3, 'Irene'],
	[n2n('25 aug'), n2n('26 aug'), -1, 'Ten'],
	[n2n('27 aug'), n2n('28 aug'), 0, 'Jose'],
	[n2n('29 aug'), n2n('10 sep'), 4, 'Katia'],
	[n2n('31 aug'), n2n('3 sep'), 0, 'Unnamed'],
	[n2n('1 sep'), n2n('5 sep'), 0, 'Lee'],
	[n2n('6 sep'), n2n('16 sep'), 1, 'Maria'],
	[n2n('7 sep'), n2n('11 sep'), 1, 'Nate'],
	[n2n('20 sep'), n2n('3 oct'), 4, 'Ophelia'],
	[n2n('24 sep'), n2n('8 oct'), 1, 'Philippe'],
	[n2n('23 oct'), n2n('28 oct'), 3, 'Rina'],
	[n2n('8 nov'), n2n('11 nov'), 0, 'Sean'],
];
hurricanelist[2012] = [
	[n2n('19 may'), n2n('22 may'), 0, 'Alberto'],
	[n2n('26 may'), n2n('30 may'), 0, 'Beryl'],
	[n2n('18 jun'), n2n('22 jun'), 1, 'Chris'],
	[n2n('23 jun'), n2n('27 jun'), 0, 'Debby'],
	[n2n('1 aug'), n2n('10 aug'), 2, 'Ernesto'],
	[n2n('3 aug'), n2n('6 aug'), 0, 'Florence'],
	[n2n('9 aug'), n2n('18 aug'), 0, 'Helene'],
	[n2n('15 aug'), n2n('20 aug'), 2, 'Gordon'],
	[n2n('21 aug'), n2n('1 sep'), 1, 'Isaac'],
	[n2n('22 aug'), n2n('24 aug'), 0, 'Joyce'],
	[n2n('28 aug'), n2n('2 sep'), 2, 'Kirk'],
	[n2n('30 aug'), n2n('11 sep'), 1, 'Leslie'],
	[n2n('3 sep'), n2n('11 sep'), 3, 'Michael'],
	[n2n('10 sep'), n2n('4 oct'), 1, 'Nadine'],
	[n2n('3 oct'), n2n('5 oct'), 0, 'Oscar'],
	[n2n('11 oct'), n2n('13 oct'), 0, 'Patty'],
	[n2n('12 oct'), n2n('17 oct'), 1, 'Rafael'],
	[n2n('22 oct'), n2n('29 oct'), 3, 'Sandy'],
	[n2n('22 oct'), n2n('25 oct'), 0, 'Tony'],
];
hurricanelist[2013] = [
	[n2n('5 jun'), n2n('7 jun'), 0, 'Andrea'],
	[n2n('17 jun'), n2n('20 jun'), 0, 'Barry'],
	[n2n('7 jul'), n2n('10 jul'), 0, 'Chantal'],
	[n2n('23 jul'), n2n('3 aug'), 0, 'Dorian'],
	[n2n('15 aug'), n2n('18 aug'), 0, 'Erin'],
	[n2n('25 aug'), n2n('26 aug'), 0, 'Fernand'],
	[n2n('4 sep'), n2n('13 sep'), 0, 'Gabrielle'],
	[n2n('6 sep'), n2n('7 sep'), -1, 'Eight'],
	[n2n('8 sep'), n2n('19 sep'), 1, 'Humberto'],
	[n2n('12 sep'), n2n('17 sep'), 1, 'Ingrid'],
	[n2n('29 sep'), n2n('3 oct'), 0, 'Jerry'],
	[n2n('3 oct'), n2n('6 oct'), 0, 'Karen'],
	[n2n('21 oct'), n2n('24 oct'), 0, 'Lorenzo'],
	[n2n('18 nov'), n2n('21 nov'), 0, 'Melissa'],
	[n2n('5 dec'), n2n('7 dec'), 0, 'Unnamed'],
];
hurricanelist[2014] = [
	[n2n('1 jul'), n2n('5 jul'), 2, 'Arthur'],
	[n2n('21 jul'), n2n('23 jul'), -1, 'Two'],
	[n2n('1 aug'), n2n('6 aug'), 1, 'Bertha'],
	[n2n('23 aug'), n2n('29 aug'), 1, 'Cristobal'],
	[n2n('1 sep'), n2n('3 sep'), 0, 'Dolly'],
	[n2n('11 sep'), n2n('19 sep'), 3, 'Edouard'],
	[n2n('10 oct'), n2n('13 oct'), 1, 'Fay'],
	[n2n('12 oct'), n2n('19 oct'), 4, 'Gonzalo'],
	[n2n('22 oct'), n2n('28 oct'), 0, 'Hanna'],
];
hurricanelist[2015] = [
	[n2n('8 may'), n2n('11 may'), 0, 'Ana'],
	[n2n('16 jun'), n2n('18 jun'), 0, 'Bill'],
	[n2n('13 jul'), n2n('14 jul'), 0, 'Claudette'],
	[n2n('18 aug'), n2n('24 aug'), 3, 'Danny'],
	[n2n('25 aug'), n2n('29 aug'), 0, 'Erika'],
	[n2n('30 aug'), n2n('6 sep'), 1, 'Fred'],
	[n2n('5 sep'), n2n('9 sep'), 0, 'Grace'],
	[n2n('8 sep'), n2n('11 sep'), 0, 'Henri'],
	[n2n('16 sep'), n2n('19 sep'), -1, 'Nine'],
	[n2n('18 sep'), n2n('27 sep'), 0, 'Ida'],
	[n2n('28 sep'), n2n('8 oct'), 4, 'Juaquin'],
	[n2n('8 nov'), n2n('11 nov'), 1, 'Kate'],
];
hurricanelist[2016] = [
	[11, 14, 1, 'Alex'],
	[147, 155, 0, 'Bonnie'],
	[156, 158, 0, 'Colin'],
	[170, 172, 0, 'Danielle'],
	[214, 218, 1, 'Earl'],
	[228, 235, 0, 'Fiona'],
	[234, 245, 3, 'Gaston'],
	[240, 244, -1, 'Eight'],
	[240, 246, 1, 'Hermine'],
	[255, 259, 0, 'Ian'],
	[256, 261, 0, 'Julia'],
	[257, 268, 0, 'Karl'],
	[262, 268, 0, 'Lisa'],
	[271, 282, 5, 'Matthew'],
	[277, 291, 4, 'Nicole'],
	[324, 329, 3, 'Otto'],
];
hurricanelist[2017] = [
	[109, 111, 0, 'Arlene'],
	[170, 171, 0, 'Bret'],
	[171, 174, 0, 'Cindy'],
	[186, 188, -1, 'Four'],
	[198, 199, 0, 'Don'],
	[211, 214, 0, 'Emily'],
	[219, 222, 1, 'Franklin'],
	[224, 229, 2, 'Gert'],
	[229, 244, 4, 'Harvey'],
	[242, 255, 5, 'Irma'],
	[248, 265, 4, 'Jose'],
	[248, 252, 2, 'Katia'],
	[257, 273, 3, 'Lee'],
	[259, 273, 5, 'Maria'],
	[277, 282, 1, 'Nate'],
	[282, 289, 3, 'Ophelia'],
	[301, 302, 0, 'Philippe'],
	[309, 313, 0, 'Rina'],
];
hurricanelist[2018] = [
	[117, 123, 0, 'Alberto'],
	[186, 197, 1, 'Beryl'],
	[187, 193, 2, 'Chris'],
	[219, 221, 0, 'Debby'],
	[227, 230, 0, 'Ernesto'],
	[243, 262, 4, 'Florence'],
	[246, 251, 0, 'Gordon'],
	[250, 259, 2, 'Helene'],
	[250, 258, 1, 'Isaac'],
	[255, 262, 0, 'Joyce'],
	[265, 266, -1, 'Eleven'],
	[265, 272, 0, 'Kirk'],
	[266, 286, 1, 'Leslie'],
	[280, 285, 4, 'Michael'],
	[282, 286, 0, 'Nadine'],
	[300, 304, 0, 'Oscar'],
];
hurricanelist[2019] = [
	[140, 141, 0, 'Andrea'],
	[192, 196, 1, 'Barry'],
	[203, 204, -1, 'Three'],
	[233, 236, 0, 'Chantal'],
	[236, 250, 5, 'Dorian'],
	[238, 241, 0, 'Erin'],
	[246, 248, 0, 'Fernand'],
	[246, 253, 0, 'Gabrielle'],
	[256, 263, 3, 'Humberto'],
	[260, 262, 0, 'Imelda'],
	[260, 268, 2, 'Jerry'],
	[265, 270, 0, 'Karen'],
	[266, 276, 5, 'Lorenzo'],
	[284, 287, 0, 'Melissa'],
	[287, 289, -1, 'Fifteen'],
	[291, 292, 0, 'Nestor'],
	[298, 299, 0, 'Olga'],
	[298, 301, 1, 'Pablo'],
	[303, 305, 0, 'Rebekah'],
	[323, 329, 0, 'Sebastien'],
];
hurricanelist[2020] = [
	[136, 139, 0, 'Arthur'],
	[147, 148, 0, 'Bertha'],
	[152, 161, 0, 'Cristobal'],
	[173, 175, 0, 'Dolly'],
	[185, 188, 0, 'Edouard'],
	[190, 192, 0, 'Fay'],
	[202, 206, 0, 'Gonzalo'],
	[204, 208, 1, 'Hanna'],
	[211, 217, 1, 'Isaias'],
	[212, 214, -1, 'Ten'],
	[223, 228, 0, 'Josephine'],
	[226, 228, 0, 'Kyle'],
	[232, 241, 4, 'Laura'],
	[232, 237, 1, 'Marco'],
	[244, 247, 1, 'Nana'],
	[243, 248, 0, 'Omar'],
	[252, 261, 2, 'Paulette'],
	[252, 259, 0, 'Rene'],
	[254, 260, 2, 'Sally'],
	[255, 266, 4, 'Teddy'],
	[257, 260, 2, 'Vicky'],
	[261, 264, 0, 'Wilfred'],
	[261, 262, 0, 'Alpha'],
	[260, 266, 0, 'Beta'],
	[275, 279, 0, 'Gamma'],
	[278, 283, 4, 'Delta'],
	[292, 299, 3, 'Epsilon'],
	[297, 302, 2, 'Zeta'],
	[304, 317, 4, 'Eta'],
	[314, 319, 0, 'Theta'],
	[317, 322, 5, 'Iota'],
];
hurricanelist[2021] = [
	[142, 143, 0, 'Ana'],
	[165, 166, 0, 'Bill'],
	[170, 173, 0, 'Claudette'],
	[178, 180, 0, 'Danny'],
	[181, 190, 1, 'Elsa'],
	[214, 220, 0, 'Fred'],
	[225, 233, 3, 'Grace'],
	[227, 235, 1, 'Henri'],
	[238, 244, 4, 'Ida'],
	[240, 243, 0, 'Julian'],
	[240, 244, 0, 'Kate'],
	[243, 254, 3, 'Larry'],
	[251, 253, 0, 'Mindy'],
	[255, 259, 1, 'Nicholas'],
	[260, 261, 0, 'Odette'],
	[262, 265, 0, 'Peter'],
	[262, 266, 0, 'Rose'],
	[265, 278, 4, 'Sam'],
	[267, 268, 0, 'Teresa'],
	[272, 277, 0, 'Victor'],
	[304, 311, 0, 'Wanda'],
];
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

const greek = [
	'alpha',
	'beta',
	'gamma',
	'delta',
	'epsilon',
	'zeta',
	'eta',
	'theta',
	'iota',
	'kappa',
	'lambda',
	'mu',
	'nu',
	'xi',
	'omicron',
	'pi',
	'rho',
	'sigma',
	'tau',
	'tau',
	'upsilon',
	'phi',
	'chi',
	'psi',
	'omega',
];
const greek2 = [ // https://public.wmo.int/en/media/news/supplemental-list-of-tropical-cyclone-names-raiv
	'adria',
	'braylen',
	'caridad',
	'deshawn',
	'emery',
	'foster',
	'gemma',
	'heath',
	'isla',
	'jacobus',
	'kenzie',
	'lucio',
	'makayla',
	'nolan',
	'orlanda',
	'pax',
	'ronin',
	'sophie',
	'tayshaun',
	'viviana',
	'will',
];
const numbers = [
	'one',
	'two',
	'three',
	'four',
	'five',
	'six',
	'seven',
	'eight',
	'nine',
	'ten',
	'eleven',
	'twelve',
	'thirteen',
	'fourteen',
	'fifteen',
	'sixteen',
	'seventeen',
	'eighteen',
	'nineteen',
	'twenty',
];

// for the random generator

function volumes(){
	const v = [];
	hurricanelist.forEach(function(x){ // for each year
		v.push(x.length);
	});
	return v;
}

const averagePerYear = mean(volumes());
const sdPerYear = sd(volumes());

function pseudoNormal(m, s){ // I couldn't find any way to do a TRUE normal distr., so this is my close approximation.
	const r = Math.random();
	let lower, upper;
	if (r < 0.022){
		lower = m-3*s;
		upper = m-2*s;
	}
	else if (r < 0.158){
		lower = m-2*s;
		upper = m-s;
	}
	else if (r < 0.5){
		lower = m-s;
		upper = m;
	}
	else if (r < 0.841){
		lower = m;
		upper = m+s;
	}
	else if (r < 0.977){
		lower = m+s;
		upper = m+2*s;
	}
	else {
		lower = m+2*s;
		upper = m+3*s;
	}
	return random.uniform(lower, upper);
}

function randomVolume(){
	// I couldn't find any way to do a TRUE normal distr., so this is my close approximation.
	return Math.round(pseudoNormal(averagePerYear, sdPerYear));
}

function randomSeason(){
	let name;
	// setup
	const volume = randomVolume();
	document.getElementById('randomSeason').innerHTML = '<tr><th>Name</th><th>From</th><th>Until</th><th>Category</th></tr>';
	const starts = [];
	// main
	range1(volume).forEach(function(){
		const randomYear = Math.round(random.uniform(1995, 2018));
		const randomStorm = Math.round(random.uniform(0, hurricanelist[randomYear].length-1));
		const randomStart = hurricanelist[randomYear][randomStorm][0];
		starts.push(randomStart);
	});
	starts.sort();
	// for each date, use the date to generate a random END and CATEGORY
	let currentDepression = 0;
	let currentStorm = 0;
	/* eslint-disable */
	/** @type {string[]} */
	const nameList = new Array(...
		random.choice(document.getElementsByClassName('names')) // select random name table
		.children[0] // select tbody
		.children[1] // select first row (excluding header row)
		.children // select cells of first row
		).slice(1) // deselect first cell (the year)
		.map(e => e.innerHTML); // select innerHTML of all cells
	/* eslint-enable */
	starts.forEach(function(x){
		const category = Math.round(random.uniform(-1, maxcatduring(x)));
		const end = x + Math.max(1, Math.round(
			pseudoNormal(avgDuration(category), avgDurationSD(category))));
		const newrow = document.createElement('tr');
		if (category > -1){
			if (currentStorm < nameList.length) // names
				name = nameList[currentStorm];
			else { // greek
				const supplementalList = document.getElementById('supplementalListType').checked ? greek : greek2;
				name = supplementalList[currentStorm - nameList.length];
			}
			currentStorm += 1;
		}
		// numbers
		else if (currentDepression < 20)
			name = numbers[currentDepression];
		else
			name = 'twenty-' + numbers[currentDepression-20];
		currentDepression += 1;
		// print
		newrow.innerHTML = '<td>'+proper(name)+'</td><td>'+n2n2(x)+'</td><td>'+n2n2(end)+'</td>'+catStyle(category);
		document.getElementById('randomSeason').appendChild(newrow);
	});
}