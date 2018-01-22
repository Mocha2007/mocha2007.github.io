// temps
var a,b,i; // add b c d etc as needed
var versionno = '1.1';
/* Introduce l8r
// https://stackoverflow.com/questions/3959211/fast-factorial-function-in-javascript/3959275#3959275
var f = [];
function factorial(n){
	if (n === 0 || n === 1){
		return 1;
	}
	if (f[n] > 0){
		return f[n];
	}
	return f[n] = factorial(n-1) * n;
}

function nPr(n,k){
	return factorial(n)/factorial(n-k);
}

function nCr(n,k){
	return nPr(n,k)/factorial(k);
}
*/
function mod(n,m){
	'use strict';
	return ((n%m)+m)%m;
}

function drop(x,a){
	'use strict';
	var s=[];
	for (i=0;i<a.length;i+=1){
		if (a[i]!==x){
			s.push(a[i]);
		}
	}
	return s;
}

function sum(x){
	'use strict';
	var s=0;
	for (i=0;i<x.length;i+=1){
		s+=x[i];
	}
	return s;
}

// MAIN

// Console
function mconsole(MessageClass,Message){
	'use strict';
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

var commandlist = [];
commandlist.zero = 0;
commandlist.quarter = 0;
commandlist.half = 0;
commandlist.one = 0;
commandlist.two = 0;
commandlist.three = 0;
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
commandlist.thousand = 0;
// non-numerals
commandlist.decimated = 1;
commandlist.divides = 2;
commandlist.doubled = 1;
commandlist.dozen = 1;
commandlist.drop = 1;
commandlist.equals = 2;
commandlist.from = 2;
commandlist.gross = 1;
commandlist.halved = 1;
commandlist["isn't"] = 2;
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
commandlist.squared = 1;
commandlist.sum = 1;
commandlist.thrice = 1;
commandlist.times = 2;
commandlist.tripled = 1;
commandlist.twice = 1;
var program = '';
var oplist = []; // split by the word
var opwaitlist = [];
var stack = [];
var pointer = 0;
var command = '';

function err(errMsg){
	"use strict";
	console.error(errMsg+'\n@ Char '+pointer+'\n\t'+command);
	mconsole('e',errMsg+'\n@ Char '+pointer+'\n\t'+command);
	return true;
}

function warn(warnMsg){
	"use strict";
	console.warn(warnMsg+'\n@ Char '+pointer+'\n\t'+command);
	mconsole('w',warnMsg+'\n@ Char '+pointer+'\n\t'+command);
	return false;
}

function cclr(){
	'use strict';
	document.getElementById('console').innerHTML = '<i>MoCalc rev '+versionno+'</i>';
	return false;
}

function reset(){
	'use strict';
	// pointer
	pointer = 0;
	// Reset line
	document.getElementById('line').innerHTML = pointer;
	// Stack opwaitlist
	stack = [];
	opwaitlist = [];
	// Load Program
	program = document.getElementById('code').value.replace(/[^A-Za-z]+/g,' ').toLowerCase();
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
	'use strict';
	// ended?
	if (oplist.length===0 && opwaitlist.length===0){
		if (document.getElementById('console').innerHTML.slice(-44)!=='<span class="ci">info</span>: End of Program'){
			if (stack.length>1){
				a = '['+stack.join(',')+']';
			}
			else {
				a = stack.join();
			}
			mconsole('o',a);
			mconsole('i','End of Program');
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
			opwaitlist.push(['times',2]);
			opwaitlist.push([command.slice(0,-4),0]);
		}
		else {
			switch (command){
				case 'a':
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
				case 'is':
					command = 'equals';
					break;
				case "that's":
					command = 'equals';
					break;
				case "to":
					command = 'over';
					break;
				case "too":
					command = 'plus';
					break;
				default:
					command = command.replace('also','plus');
					command = command.replace('false','zero');
					command = command.replace('halve','halved');
					command = command.replace('less','minus');
					command = command.replace('modulo','mod');
					command = command.replace('more','plus');
					command = command.replace('negative','negated');
					command = command.replace('thrice','tripled');
					command = command.replace('true','one');
					command = command.replace('twice','doubled');
			}
			// end replace
			opwaitlist.push([command,commandlist[command]]);
		}
	}
	else { // else perform next word
		command = opwaitlist.pop()[0];
		console.log('able to perform '+command);
		switch (command) {
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
			case 'three':
				stack.push(3);
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
			case 'thousand':
				stack.push(1000);
				break;
			// non-numerals
			case 'decimated':
				a = stack.pop();
				stack.push(9/10*a);
				break;
			case 'divides':
				b = stack.pop();
				a = stack.pop();
				stack.push(Number(mod(a,b)===0));
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
				stack = drop(a,stack);
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
			case 'minus':
				b = stack.pop();
				a = stack.pop();
				stack.push(a-b);
				break;
			case 'mod':
				b = stack.pop();
				a = stack.pop();
				stack.push(mod(a,b));
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
				stack.push(Math.pow(b,1/a));
				break;
			case 'score':
				a = stack.pop();
				stack.push(20*a);
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
	'use strict';
	for (i=0;i<100;i+=1){
		fstep();
	}
	return false;
}