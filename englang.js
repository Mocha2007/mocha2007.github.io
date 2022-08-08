/* eslint-disable no-var */
/* eslint-env es3 */
/* jshint esversion: 3, strict: true, strict: global, eqeqeq: true, nonew: false */
/* exported parse */
'use strict';

function parse(){
	/** @type {string[]} */
	var stack = [];
	/** @type {string[]} */
	var input = document.getElementById('text').value.split(' ');
	input.reverse();
	while (input.length){
		var x = input.pop();
		if (x){
			var valency = 0;
			while (input[input.length-1] === 'ba'){
				input.pop();
				valency += 1;
			}
			stack.push('<span class="v'+valency+'">'+x+'</span>');
		}
	}
	document.getElementById('translation').innerHTML = stack.join(' ');
}