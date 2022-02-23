/* eslint-disable no-var, prefer-arrow-callback */
/* jshint esversion: 3, strict: true, strict: global, eqeqeq: true */
'use strict';
// Modelled on Bhavnagar, India
var highs = [27.7, 30.2, 34.7, 37.6, 39.4, 34.5, 33, 32.2, 33, 34.2, 31.7, 28.6];
var lows = [11.2, 14.7, 19.5, 23.8, 25.9, 27.1, 26, 24.8, 24.1, 22.4, 17.9, 14.1];
var rains = [0, 0, 0, 0, 1/31, 6/30, 10/31, 8/31, 5/30, 1/31, 0, 0];
var epoch =	1497151176; // SUN 2017 JUN 11 03:19:36 UTC
var oday = 104148; // oneian
var month =	6477407.605917404/12; // oneian
var currenttime = Date.now()/1000;

function oneiaMonth(){
	return Math.floor((currenttime-epoch)/month+3) % 12;
}

function oneiaDay(){
	return Math.floor((currenttime-epoch)/oday);
}

/** @param {number} n */
function seededRandom(n){
	return (Math.pow(n, 15)+1)%65521/65521;
}

/**
 * @param {number} x
 * @param {number} y
 * @param {number} n
*/
function seededRandomRange(x, y, n){
	return (y-x)*seededRandom(n)+x;
}

/** @param {number} t */
function c2f(t){
	return 9/5*t+32;
}

/** @param {number} t */
function bareOneiaMonth(t){
	return Math.floor((t/1000-epoch)/month+3) % 12;
}

/**
 * @param {number} m
 * @param {number} d
*/
function bareWeather(m, d){
	var temp = seededRandomRange(lows[m], highs[m], d);
	var state = seededRandom(d) < rains[m] ? 'Rainy">&#x2614;' : 'Sunny">&#x2600;';
	return '<abbr title="'+Math.round(c2f(temp))+'&#176;F">'+Math.round(temp)
		+ '&#176;C</abbr> <abbr title="'+state+'</abbr>';
}

function weather(){
	var temp = seededRandomRange(lows[oneiaMonth()], highs[oneiaMonth()], oneiaDay());
	var state = seededRandom(oneiaDay())<rains[oneiaMonth()] ? 'Rainy">&#x2614;' : 'Sunny">&#x2600;';
	var day = 104148000;
	var fiveday = '<details><summary>5-Day Forecast</summary>'
			+ [1, 2, 3, 4, 5].map(function(i){
				return bareWeather(bareOneiaMonth(Date.now()+i*day), oneiaDay()+i);
			}).join('<br>') + '</details>';
	document.getElementById('eremorweather').innerHTML = 'Weather in Eremor: <abbr title="'
		+ Math.round(c2f(temp))+'&#176;F">'+Math.round(temp)+'&#176;C</abbr> <abbr title="'+state
		+ '</abbr>'+fiveday;
}

weather();