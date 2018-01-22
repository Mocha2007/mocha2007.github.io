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
commandlist.hundred = 0;
// non-numerals
commandlist.divides = 2;
commandlist.equals = 2;
commandlist.from = 2;
commandlist.minus = 2;
commandlist.mod = 2;
commandlist.over = 2;
commandlist.plus = 2;
commandlist.times = 2;
commandlist["isn't"] = 2;
var program = '';
var oplist = []; // split by the word
var opwaitlist = [];
var stack = [];
var pointer = 0;
var command = '';
// temps
var a,b,i; // add b c d etc as needed

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
	program = document.getElementById('code').value.replace('\n',' ').replace('\t',' ');
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
		switch (command){
			case 'is':
				command = 'equals';
				break;
			case "that's":
				command = 'equals';
				break;
			default:
				command.replace('false','zero');
				command.replace('modulo','mod');
				command.replace('true','one');
		}
		// end replace
		opwaitlist.push([command,commandlist[command]]);
	}
	else { // else perform next word
		command = opwaitlist.pop()[0];
		console.log('able to perform '+command);
		switch (command) {
			case 'zero':
				stack.push(0);
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
			case 'hundred':
				stack.push(100);
				break;
			// non-numerals
			case 'divides':
				b = stack.pop();
				a = stack.pop();
				stack.push(mod(a,b)==0);
				break;
			case 'equals':
				b = stack.pop();
				a = stack.pop();
				stack.push(a==b);
				break;
			case 'from':
				b = stack.pop();
				a = stack.pop();
				stack.push(b-a);
				break;
			case 'isn\'t':
				b = stack.pop();
				a = stack.pop();
				stack.push(a!=b);
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
			case 'times':
				b = stack.pop();
				a = stack.pop();
				stack.push(a*b);
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