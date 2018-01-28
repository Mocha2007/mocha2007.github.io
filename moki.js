var versionno = '1.5.2';

// https://stackoverflow.com/questions/3959211/fast-factorial-function-in-javascript/3959275#3959275
var f = [];
function factorial(n){
	"use strict";
	if (n === 0 || n === 1){
		return 1;
	}
	if (f[n] > 0){
		return f[n];
	}
	f[n] = factorial(n-1)*n;
	return f[n];
}

function nPr(n,k){
	"use strict";
	return factorial(n)/factorial(n-k);
}

function nCr(n,k){
	"use strict";
	return nPr(n,k)/factorial(k);
}


function mod(n,m){
	"use strict";
	return ((n%m)+m)%m;
}
// MAIN

// Console
function mconsole(MessageClass,Message){
	"use strict";
	var showErrors = !document.getElementById('suppresse').checked;
	var showWarns = !document.getElementById('suppressw').checked;
	if (MessageClass==='i'){
		document.getElementById('console').innerHTML += '\n<span class="ci">info</span>: '+Message;
	}
	else if (MessageClass==='w'){
		if (showWarns){
			document.getElementById('console').innerHTML += '\n<span class="cw">warning</span>:\n'+Message;
		}
	}
	else if (MessageClass==='e'){
		if (showErrors){
			document.getElementById('console').innerHTML += '\n<span class="ce">error</span>:\n'+Message;
		}
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

var commandlist = '';
var command = '';
var stack = [0];
var inputline = 0;
var line = 0;
var iscommented = 0;
var tempstring = '';
var stringcreation = 0;
// braces
var bracebalance = 0;
var templine = 0;
var tempcommand = '';
// libs
var mathlibrary = 0;
var timelibrary = 0;
// escapes
var escaped = 0;
// temps
var a,b,c,d,i;
// ascii
// var ascii = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';
var validascii = '!"$%&\'()*+,-./0123456789;<=>?@AGILMPTVW[\\]^aelp{|}~γπ'; // excludes whitespace & comments includes γπ
//var validgolfascii = '!"%&\'()+,-.;<=>?@AGILMPSTVW[\\]adehlmptwy{|}~γπ'; // for that codegolf challenge
var unaryops = '"(),?AGLMP[]elp|~'; // require at least 1 in stack; excludes whitespace, comments, digits, and ;
var binaryops = '&^'; // require at least 2 in stack; excludes whitespace & comments
var digits = '0123456789';

function cclr(){
	"use strict";
	document.getElementById('console').innerHTML = '<i>Moki rev '+versionno+'</i>';
	return false;
}

function reset(){
	"use strict";
	// Reset line
	line = 0;
	document.getElementById('line').innerHTML = line;
	// Stack
	stack = [0];
	document.getElementById('stack').innerHTML = stack;
	// tempstring
	tempstring = '';
	stringcreation = 0;
	// Load Program
	commandlist = document.getElementById('code').value;
	console.log(commandlist);
	// input
	inputline = 0;
	// specials
	mathlibrary = 0;
	timelibrary = 0;
	escaped = 0;
	stringcreation = 0;
	tempstring = '';
	iscommented = 0;
	// finishing touches
	cclr();
	console.log('Reset');
	return false;
}

function rchoice(x){
	"use strict";
	return x[Math.floor(Math.random()*x.length)];
}

function rprog(){
	"use strict";
	var n = Number(document.getElementById('rlen').value);
	if (Number.isNaN(n) || n<=0 || n%1!==0){
		n = 10;
	}
	var randomProgram = '';
	for (i=0;i<n;i+=1){
		randomProgram+=rchoice(validascii);
	}
	document.getElementById('code').value = randomProgram;
	console.log('rprog');
	reset();
	return false;
}

function err(errMsg){
	"use strict";
	console.error(errMsg+'\n@ Char '+line+'\n\t'+command);
	mconsole('e',errMsg+'\n@ Char '+line+'\n\t'+command);
	return true;
}
function warn(warnMsg){
	"use strict";
	console.warn(warnMsg+'\n@ Char '+line+'\n\t'+command);
	mconsole('w',warnMsg+'\n@ Char '+line+'\n\t'+command);
	return false;
}

// Main
function fstep(){
	"use strict";
	// noting initial stack state (see end for reason)
	//var oldstack = stack;
	// Determining the command
	command = commandlist[line];
	// Reject
	if (command===undefined || command===''){
		if (document.getElementById('console').innerHTML.slice(-44)!=='<span class="ci">info</span>: End of Program'){
			a = stack.join('');
			mconsole('o',a);
			mconsole('i','End of Program');
		}
		return true;
	}
	// Set Line
	document.getElementById('line').innerHTML=line;
	line+=1;
	// debug log
	console.log(stack,command);
	document.getElementById('stack').innerHTML = stack;
	// commented?
	if (iscommented && command!=='#'){
		console.log('comment'+command);
	}
	// stringcreation?
	else if (stringcreation && !(command==="'" && !escaped)){ // stringcreation enabled AND NOT unescaped '
		if (escaped){
			tempstring+=command;
			escaped = 0;
		}
		else if (command!=="\\"){
			tempstring+=command;
		}
		else {
			escaped = 1;
		}
	}
	// libs
	else if (mathlibrary){
		mathlibrary = 0;
		switch (command){
			// ignore whitespace
			case '\t':
				mathlibrary = 1; // still on
				break;
			case '\n':
				mathlibrary = 1; // still on
				break;
			case ' ':
				mathlibrary = 1; // still on
				break;
			// ! factorial
			case '!':
				a = stack.pop();
				if (typeof a === 'number'){
					stack.push(factorial(a));
				}
				else {
					stack.push(a);
					return err('factorial of a string');
				}
				break;
			// / inverse
			case '/':
				a = stack.pop();
				if (typeof a === 'number'){
					if (a){
						stack.push(1/a);
					}
					else {
						stack.push(0);
						return err('zero divisor');
					}
				}
				else {
					stack.push(a);
					return err('inverse of string/array');
				}
				break;
			// M Max, ignores strings unless there are only strings
			/*case 'M':
				var anynumbers = 0;
				for (i=0;i<stack.length;i+=1){
					if (typeof stack[i] ==='number'){
						anynumbers = 1;
						break;
					}
				}
				if (anynumbers){
					// delete strings
					for (i=0;i<stack.length;i+=1){
						if (typeof stack[i] ==='string'){
							stack.splice(i,i+1);
						}
					}
					// https://stackoverflow.com/a/6102340/2579798
					stack = [Math.max.apply(Math,stack)];
				}
				else {
					// https://stackoverflow.com/a/6521513/2579798
					stack = [stack.sort(function (a, b) { return b.length - a.length; })[0]];
				}
				break;*/
			// P multiply entire stack
			case 'P':
				a = 1;
				for (i=0;i<stack.length;i+=1){
					a = a*stack[i];
				}
				if (Number.isNaN(a)){
					return err('Attempted product of a mixed stack');
				}
				stack = [a];
				break;
			// S sum entire stack, or concatenate if ANY item is a string
			case 'S':
				a = 0;
				for (i=0;i<stack.length;i+=1){
					a+=stack[i];
				}
				if (typeof a === 'number'){
					stack = [a];
				}
				else {
					stack = [stack.join('')];
				}
				break;
			// T nth Triangular #
			case 'T':
				a = stack.pop();
				stack.push((a+a*a)/2);
				break;
			// m Min, ignores strings unless there are only strings
			/*case 'm':
				var anynumbers = 0;
				for (i=0;i<stack.length;i+=1){
					if (typeof stack[i] ==='number'){
						anynumbers = 1;
						break;
					}
				}
				if (anynumbers){
					// delete strings
					for (i=0;i<stack.length;i+=1){
						if (typeof stack[i] ==='string'){
							stack.splice(i,i+1);
						}
					}
					// https://stackoverflow.com/a/6102340/2579798
					stack = [Math.min.apply(Math,stack)];
				}
				else {
					var minimum = stack[0];
					for (i=1;i<stack.length;i+=1) {
						if (stack[i].length>minimum.length){
							minimum = stack[i];
						}
					}
					stack = [minimum]
				}
				break;*/
			// c cosine
			case 'c':
				a = stack.pop();
				if (typeof a === 'number'){
					stack.push(Math.cos(a));
				}
				else {
					stack.push(a);
					return err('cosine of string/array');
				}
				break;
			// l log base a of b
			case 'l':
				if (stack.length>1){
					b = stack.pop();
					a = stack.pop();
					if (typeof (a+b) !== 'number'){
						stack.push(a);
						return err('log of string/array');
					}
					if (a<=0 || b<=0){
						stack.push(a);
						return err('nonpositive log');
					}
					stack.push(Math.log(b)/Math.log(a));
				}
				else {
					return err('stack too small');
				}
				break;
			// s sine
			case 's':
				a = stack.pop();
				if (typeof a === 'number'){
					stack.push(Math.sin(a));
				}
				else {
					stack.push(a);
					return err('sine of string/array');
				}
				break;
			// t tangent
			case 't':
				a = stack.pop();
				if (typeof a === 'number'){
					stack.push(Math.tan(a));
				}
				else {
					stack.push(a);
					return err('tangent of string/array');
				}
				break;
			// x secant
			case 'x':
				a = stack.pop();
				if (typeof a === 'number'){
					stack.push(Math.sec(a));
				}
				else {
					stack.push(a);
					return err('secant of string/array');
				}
				break;
			// 265 ĉ arccosine
			case 'ĉ':
				a = stack.pop();
				if (typeof a === 'number'){
					stack.push(Math.acos(a));
				}
				else {
					stack.push(a);
					return err('arccosine of string/array');
				}
				break;
			// 349 ŝ arcsine
			case 'ŝ':
				a = stack.pop();
				if (typeof a === 'number'){
					stack.push(Math.asin(a));
				}
				else {
					stack.push(a);
					return err('arccosine of string/array');
				}
				break;
			// error
			default:
				return err('operation not in Math dictionary');
		}
	}
	else if (timelibrary){// TODO
		timelibrary = 0;
		switch (command){
			// ignore whitespace
			case '\t':
				timelibrary = 1; // still on
				break;
			case '\n':
				timelibrary = 1; // still on
				break;
			case ' ':
				timelibrary = 1; // still on
				break;
			// M months since epoch
			case 'M':
				stack.push(Date.now()/1000/60/60/24/365.2425*12);
				break;
			// d days since epoch
			case 'd':
				stack.push(Date.now()/1000/60/60/24);
				break;
			// h hours since epoch
			case 'h':
				stack.push(Date.now()/1000/60/60);
				break;
			// m minutes since epoch
			case 'm':
				stack.push(Date.now()/1000/60);
				break;
			// t seconds since epoch
			case 't':
				stack.push(Date.now()/1000);
				break;
			// w weeks since epoch
			case 'w':
				stack.push(Date.now()/1000/60/60/24/7);
				break;
			// y years since epoch
			case 'y':
				stack.push(Date.now()/1000/60/60/24/365.2425);
				break;
			// error
			default:
				return err('operation not in Time dictionary');
		}
	}
	// do
	else {
		if (unaryops.indexOf(command)!==-1 && stack.length<1){ // insufficient stacksize
			return err('stack too small');
		}
		if (binaryops.indexOf(command)!==-1 && stack.length<2){ // insufficient stacksize
			return err('stack too small');
		}
		if (!stack.length && digits.indexOf(command) !== -1){ // number applied to empty stack
			console.log('2',stack);
			stack = [Number(command)];
		}
		else if (typeof stack[stack.length-1] === 'object' && digits.indexOf(command) !== -1){ // number applied to an array
			a = stack.pop();
			b = a;
			for (i=1;i<Number(command);i+=1){
				a = a.concat(b);
			}
			stack.push(a);
		}
		else {
		switch (command){
			// ignore whitespace
			case '\t':
				break;
			case '\n':
				break;
			case ' ':
				break;
			// ! NOT
			case '!':
				a = stack.pop();
				stack.push(!a+0);
				break;
			// " turn top of stack into a char, or to a number if already that
			case '"':
				a = stack.pop();
				if (Number.isFinite(a)){
					stack.push(String.fromCharCode(a));
				}
				else if (typeof a === 'object'){ // concat into string
					stack.push(a.join(''));
				}
				else {
					if (a.length){
						stack.push(a.charCodeAt(0));
					}
					else {
						stack.push(0);
					}
				}
				break;
			// # comment toggle
			case '#':
				iscommented = 1-iscommented; // toggle
				console.log('comment toggle');
				break;
			// $ accept next line of input. if no input, then zero.
			case '$':
				a = document.getElementById('input').value.split("\n")[inputline];
				if (a==='' || a===undefined){
					stack.push(0);
					warn('superfluous $');
				}
				else {
					if (!Number.isNaN(Number(a))){ // number
						a = Number(a);
					}
					stack.push(a);
				}
				inputline+=1;
				break;
			// % mod
			case '%':
				if (stack.length>1){
					b = stack.pop();
					a = stack.pop();
					// ZeroDivisionError
					if (b===0){
						stack.push(a);
						stack.push(b);
						return err('zero divisor');
					}
					// StringModuloError
					if (typeof a === 'string' || typeof b === 'string'){
						stack.push(a);
						stack.push(b);
						return err('string modulo');
					}
					// ArrayModuloError
					if (typeof a !== 'number' || typeof b !== 'number'){
						stack.push(a);
						stack.push(b);
						return err('array modulo');
					}
					stack.push(mod(a,b));
				}
				else if (stack.length){
					a = stack.pop();
					// ZeroDivisionError
					if (a===0){
						stack.push(a);
						return err('zero divisor');
					}
					stack.push(0);
				}
				else {
					return err('zero divisor');
				}
				break;
			// & returns a if a and b aren't 0, else 0
			case "&":
				b = stack.pop();
				a = stack.pop();
				if (a!==0 && b!==0){
					stack.push(a);
				}
				else {
					stack.push(0);
				}
				break;
			// ' toggle stringcreation
			case "'":
				if (stringcreation===1){
					stack.push(tempstring);
					tempstring = '';
				}
				stringcreation = 1-stringcreation; // toggle
				console.log('string toggle');
				break;
			// ( decrement
			case '(':
				a = stack.pop();
				if (typeof a === 'string'){
					stack.push(String.fromCharCode(a.charCodeAt(0)-1));
				}
				// iterate over whole array
				else if (typeof a === 'object'){
					for (i=0;i<a.length;i+=1){
						if (typeof a[i] === 'string'){
							a[i] = String.fromCharCode(a[i].charCodeAt(0)-1);
						}
						else {
							a[i] -= 1;
						}
					}
					stack.push(a);
				}
				else {
					stack.push(a-1);
				}
				break;
			// ) increment
			case ')':
				a = stack.pop();
				if (typeof a === 'string'){
					stack.push(String.fromCharCode(a.charCodeAt(0)+1));
				}
				// iterate over whole array
				else if (typeof a === 'object'){
					for (i=0;i<a.length;i+=1){
						if (typeof a[i] === 'string'){
							a[i] = String.fromCharCode(a[i].charCodeAt(0)+1);
						}
						else {
							a[i] += 1;
						}
					}
					stack.push(a);
				}
				else {
					stack.push(a+1);
				}
				break;
			// * mul
			case '*':
				if (stack.length>1){
					b = stack.pop();
					a = stack.pop();
					// use charcode if b is string
					if (typeof b === 'object'){
						c = a;//swap
						a = b;
						b = c;
					}
					if (typeof b === 'object'){
						stack.push(b);
						stack.push(a);
						return err('both multiplicands are arrays');
					}
					if (typeof b === 'string'){
						if (b.length){ // empty string catch
							b = b.charCodeAt(0);
						}
						else {
							b = 0;
						}
					}
					// duplicate string if a is string
					if (typeof a === 'string'){
						stack.push((new Array(b+1)).join(a));
					}
					// duplicate array if a is array
					else if (typeof a === 'object'){
						c = a;
						for (i=1;i<b;i+=1){
							a = a.concat(c); // concat
						}
						stack.push(a);
					}
					else {
						stack.push(a*b);
					}
				}
				else {
					if (stack.length){
						stack.pop();
					}
					stack.push(0);
				}
				break;
			// + add
			case '+':
				if (stack.length>1){
					b = stack.pop();
					a = stack.pop();
					stack.push(a+b);
				} // else leave unchanged
				break;
			// , push 0 onto stack
			case ',':
				stack.push(0);
				break;
			// - sub TODO - allow string-string instead of just string-char
			case '-':
				if (stack.length>1){
					b = stack.pop();
					a = stack.pop();
					// use charcode if b is string
					if (typeof b === 'string'){
						b = b.charCodeAt(0);
					}
					// err if b is array
					if (typeof b === 'object'){
						return err('array subtrahend');
					}
					// use charcode if a is string
					if (typeof a === 'string'){
						stack.push(String.fromCharCode(a.charCodeAt(0)-b));
					}
					// iterate over whole array
					else if (typeof a === 'object'){
						for (i=0;i<a.length;i+=1){
							if (typeof a[i] === 'string'){
								a[i] = String.fromCharCode(a[i].charCodeAt(0)-b);
							}
							else {
								a[i] -= b;
							}
						}
						stack.push(a);
					}
					else {
						stack.push(a-b);
					}
				}
				else if (stack.length && typeof stack[0] === 'number'){ // change only if number
					a = stack.pop();
					stack.push(-a);
				}
				else {
					stack.push(0);
				}
				break;
			// . dupe top of stack
			case '.':
				if (stack.length){
					stack.push(stack[stack.length-1]);
				}
				else {
					warn('superfluous .');
				}
				break;
			// / div
			case '/':
				if (stack.length>1){
					b = stack.pop();
					a = stack.pop();
					// use charcode if b is string
					if (typeof b === 'string'){
						if (b.length){
							b = b.charCodeAt(0);
						}
						else {
							stack.push(a);
							stack.push(b);
							return err('zero divisor');
						}
					}
					// err b is array
					if (typeof b !== 'number'){
						stack.push(a);
						stack.push(b);
						return err('array divisor');
					}
					// ZeroDivisionError
					if (b===0){
						stack.push(a);
						stack.push(b);
						return err('zero divisor');
					}
					// yes, strings / arrays can be divided too!
					if (typeof a !== 'number'){
						c = a.slice(0,Math.floor(a.length/b));
						if (c!==''){
							stack.push(c);
						}
						else {
							stack.push(0);
						}
					}
					else {
						stack.push(a/b);
					}
				}
				else if (stack.length){
					a = stack.pop();
					if (typeof a === 'string'){
						if (a.length){
							a = a.charCodeAt(0);
						}
						else {
							stack.push(a);
							return err('zero divisor');
						}
					}
					// ZeroDivisionError
					if (a===0){
						stack.push(a);
						return err('zero divisor');
					}
					stack.push(0);
				}
				else {
					return err('zero divisor');
				}
				break;
			// #s
			case '0':
				a = stack.pop();
				if (typeof a === 'string'){
					stack.push(a+0);
				}
				else {
					stack.push(a*10);
				}
				break;
			case '1':
				a = stack.pop();
				if (typeof a === 'string'){
					stack.push(a+1);
				}
				else {
					stack.push(a*10+1);
				}
				break;
			case '2':
				a = stack.pop();
				if (typeof a === 'string'){
					stack.push(a+2);
				}
				else {
					stack.push(a*10+2);
				}
				break;
			case '3':
				a = stack.pop();
				if (typeof a === 'string'){
					stack.push(a+3);
				}
				else {
					stack.push(a*10+3);
				}
				break;
			case '4':
				a = stack.pop();
				if (typeof a === 'string'){
					stack.push(a+4);
				}
				else {
					stack.push(a*10+4);
				}
				break;
			case '5':
				a = stack.pop();
				if (typeof a === 'string'){
					stack.push(a+5);
				}
				else {
					stack.push(a*10+5);
				}
				break;
			case '6':
				a = stack.pop();
				if (typeof a === 'string'){
					stack.push(a+6);
				}
				else {
					stack.push(a*10+6);
				}
				break;
			case '7':
				a = stack.pop();
				if (typeof a === 'string'){
					stack.push(a+7);
				}
				else {
					stack.push(a*10+7);
				}
				break;
			case '8':
				a = stack.pop();
				if (typeof a === 'string'){
					stack.push(a+8);
				}
				else {
					stack.push(a*10+8);
				}
				break;
			case '9':
				a = stack.pop();
				if (typeof a === 'string'){
					stack.push(a+9);
				}
				else {
					stack.push(a*10+9);
				}
				break;
			// : undefined
			// ; pop top of stack
			case ';':
				if (stack.length){
					stack.pop();
				}
				else {
					warn('superfluous ;');
				}
				break;
			// < less than; javascript's handling of it with strings is already perfect
			case '<':
				if (stack.length>1){
					b = stack.pop();
					a = stack.pop();
					stack.push(Number(a<b));
				}
				else if (stack.length){
					a = stack.pop();
					stack.push(Number(0<b));
				}
				else {
					stack.push(0);
				}
				break;
			// = equal to
			case '=':
				if (stack.length>1){
					b = stack.pop();
					a = stack.pop();
					stack.push(Number(a===b));
				}
				else {
					if (stack.length){
						stack.pop();
					}
					stack.push(1);
				}
				break;
			// > greater than; javascript's handling of it with strings is already perfect
			case '>':
				if (stack.length>1){
					b = stack.pop();
					a = stack.pop();
					stack.push(Number(a>b));
				}
				else if (stack.length){
					a = stack.pop();
					stack.push(Number(0>b));
				}
				else {
					stack.push(0);
				}
				break;
			// ? = [condition, val if true, val if false]?
			case '?':
				if (stack.length>2){
					c = stack.pop();
					b = stack.pop();
					a = stack.pop();
					if (a===0){
						stack.push(b);
					}
					else {
						stack.push(c);
					}
				}
				else if (stack.length>1){
					b = stack.pop();
					a = stack.pop();
					stack.push(b);
				}
				// if len = 1, pass
				break;
			// @ rotate entire array
			case '@':
				if (stack.length>1){
					stack.unshift(stack.pop());
				}
				break;
			// ABC
			// RESERVING C D S S{'test'C{}D{}}
			// A arithmetic mean ~ average
			case 'A':
				a = 0;
				for (i=0;i<stack.length;i+=1){
					a+=stack[i];
				}
				if (typeof a === 'number'){
					stack = [a/stack.length];
				}
				else {
					return err('arithmetic mean of mixed stack');
				}
				break;
			// TODO C
			// TODO D
			// TODO F{x} array.forEach(x)
			// G geometric mean
			case 'G':
				a = 1;
				for (i=0;i<stack.length;i+=1){
					a = a*stack[i];
				}
				if (typeof a === 'number' && !Number.isNaN(a)){
					stack = [Math.pow(Math.abs(a),1/stack.length)]; // Math.abs needed to prevent negative roots!
				}
				else {
					return err('geometric mean of mixed stack');
				}
				break;
			// I if - if TOS false, skip to next }
			case 'I':
				if (stack[stack.length-1]===0){
					templine = line;
					tempcommand = command;
					bracebalance = 1;
					while (bracebalance!==0) {
						templine+=1;//look next character over
						// immediately error out if past end
						if (templine>=commandlist.length){
							return err('mismatched braces');
						}
						//otherwise
						tempcommand = commandlist[templine];//get command
						if (tempcommand==='{'){
							bracebalance+=1;
						}
						else if (tempcommand==='}'){
							bracebalance-=1;
						}
					}
					line = templine+1;//skip to next character over
				}
				else {
					line+=1;
				}
				break;
			// L length
			case 'L':
				a = stack.pop();
				stack.push(String(a).length);
				break;
			// M Mathfunctions
			case 'M':
				mathlibrary = 1;
				break;
			// P push to array. prefers the array to be FIRST.
			case 'P':
				if (stack.length>1){
					b = stack.pop();
					a = stack.pop();
					if (typeof a === 'object'){
						a.push(b);
						stack.push(a);
					}
					else if (typeof b === 'object'){
						b.push(a);
						stack.push(b);
					}
					else {
						stack.push([a,b]);
					}
				}
				else {
					a = stack.pop();
					stack.push([a]);
				}
				break;
			// TODO S
			// T Timefunctions
			case 'T':
				timelibrary = 1;
				break;
			// V push current version to stack
			case 'V':
				stack.push(versionno);
				break;
			// W while - if TOS false, skip to next }
			case 'W':
				if (stack[stack.length-1]===0){//if false, skip past block
					templine = line;
					tempcommand = command;
					bracebalance = 1;
					while (bracebalance!==0) {
						templine+=1;//look next character over
						// immediately error out if past end
						if (templine>=commandlist.length){
							return err('mismatched braces');
						}
						//otherwise
						tempcommand = commandlist[templine];//get command
						if (tempcommand==='{'){
							bracebalance+=1;
						}
						else if (tempcommand==='}'){
							bracebalance-=1;
						}
					}
					line = templine+1;//skip to next character over
				}
				else {
					line+=1;
				}
				break;
			// [ floor
			case '[':
				a = stack.pop();
				if (typeof a === 'string'){//lowecase
					stack.push(a.toLowerCase());
				}
				else if (typeof a === 'object'){//array
					for (i=0;i<a.length;i+=1){
						if (typeof a[i]==='string'){
							a[i] = a[i].toUpperCase();
						}
						else {
							a[i] = Math.ceil(a[i]);
						}
					}
					stack.push(a);
				}
				else {
					stack.push(Math.floor(a));
				}
				break;
			// [blackslash symbol] swap top two of stack
			case '\\':
				if (stack.length>1){
					b = stack.pop();
					a = stack.pop();
					stack.push(b);
					stack.push(a);
				} // else no change
				break;
			// ] ceil
			case ']':
				a = stack.pop();
				if (typeof a === 'string'){//capitalize
					stack.push(a.toUpperCase());
				}
				else if (typeof a === 'object'){//array
					for (i=0;i<a.length;i+=1){
						if (typeof a[i]==='string'){
							a[i] = a[i].toUpperCase();
						}
						else {
							a[i] = Math.ceil(a[i]);
						}
					}
					stack.push(a);
				}
				else {
					stack.push(Math.ceil(a));
				}
				break;
			// ^ power
			case '^':
				b = stack.pop();
				a = stack.pop();
				// use charcode if b is string
				if (typeof b === 'string'){
					if (b.length){
						b = b.charCodeAt(0);
					}
					else {
						b = 0; // i sure hope i never get a 0^0 error from this...
					}
				}
				// 0^0 Error
				if (a===0 && b<=0){
					stack.push(a);
					stack.push(b);
					return err('zero to the zero');
				}
				// -x^R Error
				if (a<0 && b%1!==0){
					stack.push(a);
					stack.push(b);
					return err('complex exponentiation');
				}
				// string
				if (typeof a === 'object' || typeof b === 'object'){
					stack.push(a);
					stack.push(b);
					return err('array exponentiation');
				}
				if (typeof a === 'string'){
					if (b<0 || b%1!==0){ // uh oh
						stack.push(a);
						stack.push(b);
						return err('bad string exponentiation');
					}
					if (b===0){ // anything^0 = 1 mostly
						stack.push(1);
					}
					else if (b===1){ // anything^1 = itself mostly
						stack.push(a);
					}
					else {
						c = a.charCodeAt(0);
						d = '';
						for (i=1;i<b;i+=1){ // multiply a by itself b times
							d+=(new Array(c+1)).join(a);
						}
						stack.push(d);
					}
				}
				else {
					stack.push(Math.pow(a,b));
				}
				break;
			// _ undefined
			// ` undefined
			// abc
			// a new array
			case 'a':
				stack.push([]);
				break;
			// e
			case 'e':
				if (stack.length){
					a = stack.pop();
					if (typeof a === 'number'){
						stack.push(a*Math.E);
					}
					else {
						stack.push(a);
						return err('erroneous euler');
					}
				}
				else {
					stack.push(Math.E);
				}
				break;
			// l ln of a
			case 'l':
				a = stack.pop();
				if (typeof a !== 'number'){
					stack.push(a);
					return err('log of string/array');
				}
				if (a<=0){
					stack.push(a);
					return err('nonpositive log');
				}
				stack.push(Math.log(a));
				break;
			// p pop from array
			case 'p':
				a = stack.pop();
				if (typeof a === 'object'){
					if (a.length>0){
						b = a.pop();
					}
					else { // pop from empty array!
						b = 0;
					}
					stack.push(a);
					stack.push(b);
				}
				else if (typeof a === 'string'){ // pop off last char
					stack.push(a.slice(0,-1));
					stack.push(a.slice(-1));
				}
				else { // pop off a 1
					stack.push(a-1);
					stack.push(1);
				}
				break;
			// s sort: if only numbers, L->G else alphabetically
			/*case 's':
				var anystrings = 0;
				for (i=0;i<stack.length;i+=1){
					if (typeof stack[i] ==='number'){
						anystrings = 1;
						break;
					}
				}
				if (anystrings){
					stack.sort();
				}
				else {
					// https://stackoverflow.com/a/1063027/2579798
					stack.sort((a,b)=>a-b);
				}
				break;*/
			// { begin loop
			case '{':
				break;
			// | absolute value ; does nothing to strings
			case '|':
				a = stack.pop();
				if (typeof a === 'number'){
					stack.push(Math.abs(a));
				}
				else {
					stack.push(a);
				}
				break;
			// } end loop iff top of stack === 0 W{} I{}
			case '}':
				// WHO initiated this?
				templine = line-1; // undoes change near beginning
				tempcommand = command;
				bracebalance = -1;
				while (bracebalance!==0) {
					templine-=1;//look next character over
					// immediately error out if past beginning
					if (templine<0){
						return err('mismatched braces');
					}
					//otherwise
					tempcommand = commandlist[templine];//get command
					console.log('checking '+tempcommand);
					if (tempcommand==='{'){
						bracebalance+=1;
					}
					else if (tempcommand==='}'){
						bracebalance-=1;
					}
					console.log(bracebalance);
				}
				// Now check the character to the LEFT
				templine-=1;//look next character over
				tempcommand = commandlist[templine];//get command
				// now we know WHO!
				if (tempcommand==='W' && stack[stack.length-1]!==0){
					line = templine+2;
				}
				// Otherwise, we don't care.
				break;
			// ~ negate top of stack, or reverse it if string
			case '~':
				a = stack.pop();
				if (typeof a === 'string'){
					stack.push(a.split("").reverse().join("")); // future: https://github.com/mathiasbynens/esrever ?
				}
				else if (typeof a === 'object'){
					stack.push(a.reverse());
				}
				else if (a){
					stack.push(-a);
				}
				else {
					stack.push(0);
				}
				break;
			// 262 Ć nCr
			case 'Ć':
				b = stack.pop();
				a = stack.pop();
				if (typeof (a+b) === 'number'){
					stack.push(nCr(a,b));
				}
				else {
					stack.push(b);
					stack.push(a);
					return err('nPr of string/array');
				}
				break;
			// γ 947
			case 'γ':
				if (stack.length){
					a = stack.pop();
					if (typeof a === 'number'){
						stack.push(a*0.5772156649015329);
					}
					else {
						stack.push(a);
						return err('erroneous euler-mascheroni');
					}
				}
				else {
					stack.push(0.5772156649015329);
				}
				break;
			// π 960
			case 'π':
				if (stack.length){
					a = stack.pop();
					if (typeof a === 'number'){
						stack.push(a*Math.PI);
					}
					else {
						stack.push(a);
						return err('erroneous pi');
					}
				}
				else {
					stack.push(Math.PI);
				}
				break;
			// 7764 Ṕ nPr
			case 'Ṕ':
				b = stack.pop();
				a = stack.pop();
				if (typeof (a+b) === 'number'){
					stack.push(nPr(a,b));
				}
				else {
					stack.push(b);
					stack.push(a);
					return err('nPr of string/array');
				}
				break;
			//.charCodeAt(0)
			// error
			default:
				return err('operation '+command+' not in dictionary');
		}}
	}
	/* Stack unchanged?
	if (oldstack === stack && !(stringcreation || iscommented || mathlibrary || timelibrary || escaped)){
		warn('meaningless '+command);
	}*/
	// final touches
	document.getElementById('stack').innerHTML = stack;/*
	// shows me erroneous programs DELETE PLS DONT PUSH
	if (Number.isNaN(stack[0]) || stack[0]===Infinity){
		document.getElementById('Moki').innerHTML=commandlist;
	}*/
	return false;
}

function fstep100(){
	"use strict";
	for (i=0;i<100;i+=1){
		fstep();
	}
	return false;
}