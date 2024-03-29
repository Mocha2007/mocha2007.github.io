/* jshint esversion: 6, strict: true, strict: global */
/* exported fstep, fstep100, reset, rprog */
/* globals mod, sum */
// temps
'use strict';
let a, b, i; // add b c d etc as needed
const versionno = '1.2';

function drop(x, arr){
	const s=[];
	for (i=0; i<arr.length; i+=1){
		if (arr[i]!==x){
			s.push(arr[i]);
		}
	}
	return s;
}

// MAIN

// Console
function mconsole(MessageClass, Message){
	if (MessageClass==='i'){
		document.getElementById('console').innerHTML += '\n<span class="ci">info</span>: '+Message;
	}
	else if (MessageClass==='w'){
		document.getElementById('console').innerHTML += '\n<span class="cw">warning</span>:\n'+Message;
	}
	else if (MessageClass==='e'){
		document.getElementById('console').innerHTML += '\n<span class="ce">error</span>:\n'+Message;
	}
	else if (MessageClass==='o'){
		if (Message==='sfx'){
			document.getElementById('console').innerHTML += '\n<span class="co">&rdca; &#x266B;</span>';
		}
		else {
			document.getElementById('console').innerHTML += '\n<span class="co">&rdca;</span> '+Message;
		}
	}
	/*else if (MessageClass==='I'){
		document.getElementById('console').innerHTML += '\n<span class="ci">&ldca;</span> '+Message;
	}*/
	else {
		document.getElementById('console').innerHTML += '\n> '+Message;
	}
	return false;
}

const commandlist = [];
commandlist.zero = 0;
commandlist.quarter = 0;
commandlist.half = 0;
commandlist.one = 0;
commandlist.two = 0;
commandlist.e = 0;
commandlist.three = 0;
commandlist.pi = 0;
commandlist.four = 0;
commandlist.five = 0;
commandlist.six = 0;
commandlist.seven = 0;
commandlist.eight = 0;
commandlist.nine = 0;
commandlist.ten = 0;
commandlist.eleven = 0;
commandlist.twelve = 0;
commandlist.thirteen = 0;
commandlist.fourteen = 0;
commandlist.fifteen = 0;
commandlist.sixteen = 0;
commandlist.seventeen = 0;
commandlist.eighteen = 0;
commandlist.nineteen = 0;
commandlist.twenty = 0;
commandlist.hundred = 0;
commandlist.eleventy = 0;
commandlist.twelfty = 0;
commandlist.thousand = 0;
commandlist.myriad = 0;
commandlist.million = 0;
commandlist.billion = 0;
commandlist.trillion = 0;
// non-numerals
commandlist['baker\'s'] = 1;
commandlist['banker\'s'] = 1;
commandlist.decimated = 1;
commandlist.divides = 2;
commandlist.doubled = 1;
commandlist.cent = 1;
commandlist.dozen = 1;
commandlist.drop = 1;
commandlist.equals = 2;
commandlist.from = 2;
commandlist.grand = 1;
commandlist.gross = 1;
commandlist.halved = 1;
commandlist['isn\'t'] = 2;
commandlist.long = 1;
commandlist.mil = 1;
commandlist.minus = 2;
commandlist.mod = 2;
commandlist.negated = 1;
commandlist.not = 1;
commandlist.once = 1;
commandlist.over = 2;
commandlist.plus = 2;
commandlist.pop = 1;
commandlist.quartered = 1;
commandlist.root = 2;
commandlist.score = 1;
commandlist.short = 1;
commandlist.squared = 1;
commandlist.sum = 1;
commandlist.thrice = 1;
commandlist.times = 2;
commandlist.tripled = 1;
commandlist.twice = 1;
let program = '';
let oplist = []; // split by the word
let opwaitlist = [];
let stack = [];
let pointer = 0;
let command = '';

function err(errMsg){
	console.error(errMsg+'\n@ Char '+pointer+'\n\t'+command);
	mconsole('e', errMsg+'\n@ Char '+pointer+'\n\t'+command);
	return true;
}

function warn(warnMsg){
	console.warn(warnMsg+'\n@ Char '+pointer+'\n\t'+command);
	mconsole('w', warnMsg+'\n@ Char '+pointer+'\n\t'+command);
	return false;
}

function cclr(){
	document.getElementById('console').innerHTML = '<i>MoCalc rev '+versionno+'</i>';
	return false;
}

function reset(){
	// pointer
	pointer = 0;
	// Reset line
	document.getElementById('line').innerHTML = pointer;
	// Stack opwaitlist
	stack = [];
	opwaitlist = [];
	// Load Program
	program = document.getElementById('code').value.replace(/[^A-Za-z']+/g, ' ').toLowerCase();
	oplist = program.split(' ').reverse(); // split by the word
	console.log(program);
	// blank warn
	if (commandlist===''){
		warn('Empty Program');
	}
	console.log('Reset');
	cclr();
	return false;
}

// Main
function fstep(){
	// ended?
	if (oplist.length===0 && opwaitlist.length===0){
		if (document.getElementById('console').innerHTML.slice(-44)!=='<span class="ci">info</span>: End of Program'){
			if (stack.length>1){
				a = '['+stack.join(',')+']';
			}
			else {
				a = stack.join();
			}
			mconsole('o', a);
			mconsole('i', 'End of Program');
		}
		return 1;
	}
	// undended
	if (opwaitlist.length===0 || opwaitlist[opwaitlist.length-1][1]>stack.length){ // then read next word if possible
		if (opwaitlist.length){
			console.log('unable to perform '+opwaitlist[opwaitlist.length-1][0]);
		}
		else {
			console.log('no operation to perform');
		}
		command = oplist.pop(); // add next op to opwaitlist
		// replacements
		if (command.slice(-4)==='fold'){ // n-fold
			// end replace
			opwaitlist.push(['times', 2]);
			opwaitlist.push([command.slice(0, -4), 0]);
		}
		else {
			switch (command){
				case 'a':
					command = 'one';
					break;
				case 'ace':
					command = 'one';
					break;
				case 'an':
					command = 'one';
					break;
				case 'and':
					command = 'plus';
					break;
				case 'by':
					command = 'times';
					break;
				case 'halve':
					command = 'halved';
					break;
				case 'in':
					command = 'over';
					break;
				case 'into':
					command = 'over';
					break;
				case 'is':
					command = 'equals';
					break;
				case 'of':
					command = 'times';
					break;
				case 'on':
					command = 'plus';
					break;
				case 'onto':
					command = 'plus';
					break;
				case 'that\'s':
					command = 'equals';
					break;
				case 'to':
					command = 'over';
					break;
				case 'too':
					command = 'plus';
					break;
				default:
					command = command.replace('all', 'sum');
					command = command.replace('also', 'plus');
					command = command.replace('cents', 'cent');
					command = command.replace('couples', 'doubled'); // keep before
					command = command.replace('couple', 'doubled');
					command = command.replace('deuce', 'two');
					command = command.replace('dozens', 'dozen');
					command = command.replace('dust', 'zero');
					command = command.replace('false', 'zero');
					command = command.replace('fewer', 'minus');
					command = command.replace('great', 'dozen');
					command = command.replace('grosses', 'gross');
					command = command.replace('less', 'minus');
					command = command.replace('modulo', 'mod');
					command = command.replace('more', 'plus');
					command = command.replace('negative', 'negated');
					command = command.replace('niner', 'nine');
					command = command.replace('nothing', 'zero');
					command = command.replace('pairs', 'doubled');
					command = command.replace('pair', 'doubled');
					command = command.replace('small', 'short');
					command = command.replace('surd', 'root');
					command = command.replace('thrice', 'tripled');
					command = command.replace('true', 'one');
					command = command.replace('twain', 'two');
					command = command.replace('twice', 'doubled');
					command = command.replace('unity', 'one');
			}
			// end replace
			opwaitlist.push([command, commandlist[command]]);
		}
	}
	else { // else perform next word
		command = opwaitlist.pop()[0];
		console.log('able to perform '+command);
		switch (command){
			case 'zero':
				stack.push(0);
				break;
			case 'quarter':
				stack.push(1/4);
				break;
			case 'half':
				stack.push(1/2);
				break;
			case 'one':
				stack.push(1);
				break;
			case 'two':
				stack.push(2);
				break;
			case 'e':
				stack.push(Math.E);
				break;
			case 'three':
				stack.push(3);
				break;
			case 'pi':
				stack.push(Math.PI);
				break;
			case 'four':
				stack.push(4);
				break;
			case 'five':
				stack.push(5);
				break;
			case 'six':
				stack.push(6);
				break;
			case 'seven':
				stack.push(7);
				break;
			case 'eight':
				stack.push(8);
				break;
			case 'nine':
				stack.push(9);
				break;
			case 'ten':
				stack.push(10);
				break;
			case 'eleven':
				stack.push(11);
				break;
			case 'twelve':
				stack.push(12);
				break;
			case 'thirteen':
				stack.push(13);
				break;
			case 'fourteen':
				stack.push(14);
				break;
			case 'fiveteen':
				stack.push(15);
				break;
			case 'sixteen':
				stack.push(16);
				break;
			case 'seventeen':
				stack.push(17);
				break;
			case 'eighteen':
				stack.push(18);
				break;
			case 'nineteen':
				stack.push(19);
				break;
			case 'twenty':
				stack.push(20);
				break;
			case 'hundred':
				stack.push(100);
				break;
			case 'eleventy':
				stack.push(110);
				break;
			case 'twelfty':
				stack.push(120);
				break;
			case 'thousand':
				stack.push(1000);
				break;
			case 'myriad':
				stack.push(10000);
				break;
			case 'million':
				stack.push(1000000);
				break;
			case 'billion':
				stack.push(1000000000);
				break;
			case 'trillion':
				stack.push(1000000000000);
				break;
			// non-numerals
			case 'baker\'s':
				a = stack.pop();
				stack.push(13/12*a);
				break;
			case 'banker\'s':
				a = stack.pop();
				stack.push(11/12*a);
				break;
			case 'decimated':
				a = stack.pop();
				stack.push(9/10*a);
				break;
			case 'cent':
				a = stack.pop();
				stack.push(a/100);
				break;
			case 'divides':
				b = stack.pop();
				a = stack.pop();
				stack.push(Number(mod(a, b)===0));
				break;
			case 'doubled':
				a = stack.pop();
				stack.push(2*a);
				break;
			case 'dozen':
				a = stack.pop();
				stack.push(12*a);
				break;
			case 'drop':
				a = stack.pop();
				stack = drop(a, stack);
				break;
			case 'equals':
				b = stack.pop();
				a = stack.pop();
				stack.push(Number(a===b));
				break;
			case 'from':
				b = stack.pop();
				a = stack.pop();
				stack.push(b-a);
				break;
			case 'grand':
				a = stack.pop();
				stack.push(1000*a);
				break;
			case 'gross':
				a = stack.pop();
				stack.push(144*a);
				break;
			case 'halved':
				a = stack.pop();
				stack.push(a/2);
				break;
			case 'isn\'t':
				b = stack.pop();
				a = stack.pop();
				stack.push(Number(a!==b));
				break;
			case 'long':
				a = stack.pop();
				if (a%12===0){
					stack.push(13/12*a);
				}
				else {
					stack.push(6/5*a);
				}
				break;
			case 'mil':
				a = stack.pop();
				stack.push(a/1000);
				break;
			case 'minus':
				b = stack.pop();
				a = stack.pop();
				stack.push(a-b);
				break;
			case 'mod':
				b = stack.pop();
				a = stack.pop();
				stack.push(mod(a, b));
				break;
			case 'negated':
				a = stack.pop();
				stack.push(-a);
				break;
			case 'not':
				a = stack.pop();
				if (a===0){
					stack.push(1);
				}
				else {
					stack.push(0);
				}
				break;
			case 'once':
				break;
			case 'over':
				b = stack.pop();
				a = stack.pop();
				stack.push(a/b);
				break;
			case 'plus':
				b = stack.pop();
				a = stack.pop();
				stack.push(a+b);
				break;
			case 'pop':
				stack.pop();
				break;
			case 'quartered':
				a = stack.pop();
				stack.push(a/4);
				break;
			case 'root':
				b = stack.pop();
				a = stack.pop();
				stack.push(Math.pow(b, 1/a));
				break;
			case 'score':
				a = stack.pop();
				stack.push(20*a);
				break;
			case 'short':
				a = stack.pop();
				stack.push(5/6*a);
				break;
			case 'squared':
				a = stack.pop();
				stack.push(a*a);
				break;
			case 'summed':
				stack = [sum(stack)];
				break;
			case 'times':
				b = stack.pop();
				a = stack.pop();
				stack.push(a*b);
				break;
			case 'tripled':
				a = stack.pop();
				stack.push(3*a);
				break;
			case undefined:
				if (document.getElementById('console').innerHTML.slice(-9)!=='undefined'){
					a = opwaitlist[opwaitlist.length-1][0];
					if (opwaitlist.length>1){
						return err(opwaitlist.length+' operations still remaining at end of program, including '+a);
					}
					return err('1 operation still remaining at end of program: '+a);
				}
				break;
			default:
				return err('unindexed word');
		}
	}
	// final touches
	document.getElementById('stack').innerHTML = stack;
	return false;
}

function fstep100(){
	for (i=0; i<100; i+=1){
		fstep();
	}
	return false;
}

reset();