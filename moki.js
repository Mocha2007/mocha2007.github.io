var versionno = '1.4.1';

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

/*function nPr(n,k){
	return factorial(n)/factorial(n-k);
}

function nCr(n,k){
	return nPr(n,k)/factorial(k);
}
*/
function mod(n,m){
	"use strict";
	return ((n%m)+m)%m;
}
// MAIN

// Console
function mconsole(MessageClass,Message){
	"use strict";
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

var commandlist = '';
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
	// finishing touches
	cclr();
	console.log('Reset');
	return false;
}

// Main
function fstep(){
	"use strict";
	// Determining the command
	var command = commandlist[line];
	// Reject
	if (command===undefined || command===''){
		if (document.getElementById('console').innerHTML.slice(-44)!=='<span class="ci">info</span>: End of Program'){
			mconsole('o',stack.join(''));
			mconsole('i','End of Program');
		}
		return true;
	}
	// Set Line
	document.getElementById('line').innerHTML=line;
	line+=1;
	// debug log
	console.log(stack,command);
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
				stack.push(factorial(a));
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
					console.error('Attempted product of a mixed stack\n@ Char '+line+'\n\t'+command);
					mconsole('e','Attempted product of a mixed stack\n@ Char '+line+'\n\t'+command);
					return true;
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
			// error
			default:
				console.error('Operation not in Math dictionary: '+command+'\n@ Char '+line+'\n\t'+command);
				mconsole('e','Operation not in Math dictionary: '+command+'\n@ Char '+line+'\n\t'+command);
				return true;
		}
	}
	else if (timelibrary){// TODO
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
			// t seconds since epoch
			case 't':
				stack.push(Date.now()/1000);
				break;
			// error
			default:
				console.error('Operation not in Time dictionary: '+command+'\n@ Char '+line+'\n\t'+command);
				mconsole('e','Operation not in Time dictionary: '+command+'\n@ Char '+line+'\n\t'+command);
				return true;
		}
	}
	// do
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
				else {
					stack.push(a.charCodeAt(0));
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
				if (a===''){
					stack.push(0);
					console.warn('superfluous input\n@ Char '+line);
					mconsole('w','superfluous input\n@ Char '+line);
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
				b = stack.pop();
				a = stack.pop();
				// ZeroDivisionError
				if (b===0){
					console.error('zero divisor\n@ Char '+line+'\n\t'+command);
					mconsole('e','zero divisor\n@ Char '+line+'\n\t'+command);
					return true;
				}
				// StringModuloError
				if (typeof a+b === 'string'){
					console.error('string modulo\n@ Char '+line+'\n\t'+command);
					mconsole('e','string modulo\n@ Char '+line+'\n\t'+command);
					return true;
				}
				stack.push(mod(a,b));
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
				console.log('stringcreation toggle');
				break;
			// ( decrement
			case '(':
				a = stack.pop();
				if (typeof a === 'string'){
					stack.push(String.fromCharCode(a.charCodeAt(0)-1));
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
				else {
					stack.push(a+1);
				}
				break;
			// * mul
			case '*':
				b = stack.pop();
				a = stack.pop();
				// use charcode if b is string
				if (typeof b === 'string'){
					b = b.charCodeAt(0);
				}
				// duplicate string if a is string
				if (typeof a === 'string'){
					stack.push((new Array(b+1)).join(a));
				}
				else {
					stack.push(a*b);
				}
				break;
			// + add
			case '+':
				b = stack.pop();
				a = stack.pop();
				stack.push(a+b);
				break;
			// , push 0 onto stack
			case ',':
				stack.push(0);
				break;
			// - sub TODO - allow string-string instead of just string-char
			case '-':
				b = stack.pop();
				a = stack.pop();
				// use charcode if b is string
				if (typeof b === 'string'){
					b = b.charCodeAt(0);
				}
				// use charcode if a is string
				if (typeof a === 'string'){
					stack.push(String.fromCharCode(a.charCodeAt(0)-b));
				}
				else {
					stack.push(a-b);
				}
				break;
			// . dupe top of stack
			case '.':
				stack.push(stack[stack.length-1]);
				break;
			// / div
			case '/':
				b = stack.pop();
				a = stack.pop();
				// use charcode if b is string
				if (typeof b === 'string'){
					b = b.charCodeAt(0);
				}
				// ZeroDivisionError
				if (b===0){
					console.error('zero divisor\n@ Char '+line+'\n\t'+command);
					mconsole('e','zero divisor\n@ Char '+line+'\n\t'+command);
					return true;
				}
				// yes, strings can be divided too!
				if (typeof a === 'string'){
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
				stack.pop();
				break;
			// < less than; javascript's handling of it with strings is already perfect
			case '<':
				b = stack.pop();
				a = stack.pop();
				stack.push(Number(a<b));
				break;
			// = equal to
			case '=':
				b = stack.pop();
				a = stack.pop();
				stack.push(Number(a===b));
				break;
			// > greater than; javascript's handling of it with strings is already perfect
			case '>':
				b = stack.pop();
				a = stack.pop();
				stack.push(Number(a>b));
				break;
			// ? = [condition, val if true, val if false]?
			case '?':
				c = stack.pop();
				b = stack.pop();
				a = stack.pop();
				if (a===0){
					stack.push(b);
				}
				else {
					stack.push(c);
				}
				break;
			// @ rotate entire array
			case '@':
				stack.unshift(stack.pop());
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
					console.error('Attempted mean of a mixed stack\n@ Char '+line+'\n\t'+command);
					mconsole('e','Attempted mean of a mixed stack\n@ Char '+line+'\n\t'+command);
					return true;
				}
				break;
			// TODO C
			// TODO D
			// TODO F{x} array.forEach(x)
			// G geometric mean
			case 'G':
				a = 0;
				for (i=0;i<stack.length;i+=1){
					a = a*stack[i];
				}
				if (typeof a === 'number'){
					stack = [Math.pow(a,1/stack.length)];
				}
				else {
					console.error('Attempted mean of a mixed stack\n@ Char '+line+'\n\t'+command);
					mconsole('e','Attempted mean of a mixed stack\n@ Char '+line+'\n\t'+command);
					return true;
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
							console.error('Mismatched braces\n@ Char '+line+'\n\t'+command);
							mconsole('e','Mismatched braces\n@ Char '+line+'\n\t'+command);
							return true;
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
			// P push to array
			case 'P':
				b = stack.pop();
				a = stack.pop();
				a.push(b);
				stack.push(a);
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
							console.error('Mismatched braces\n@ Char '+line+'\n\t'+command);
							mconsole('e','Mismatched braces\n@ Char '+line+'\n\t'+command);
							return true;
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
				else {
					stack.push(Math.floor(a));
				}
				break;
			// [blackslash symbol] swap top two of stack
			case '\\':
				b = stack.pop();
				a = stack.pop();
				stack.push(b);
				stack.push(a);
				break;
			// ] ceil
			case ']':
				a = stack.pop();
				if (typeof a === 'string'){//capitalize
					stack.push(a.toUpperCase());
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
					b = b.charCodeAt(0);
				}
				// 0^0 Error
				if (a===0 && b<=0){
					console.error('zero power\n@ Char '+line+'\n\t'+command);
					mconsole('e','zero power\n@ Char '+line+'\n\t'+command);
					return true;
				}
				// -x^R Error
				if (a<0 && b%1!==0){
					console.error('complex exponentiation\n@ Char '+line+'\n\t'+command);
					mconsole('e','complex exponentiation\n@ Char '+line+'\n\t'+command);
					return true;
				}
				// string
				if (typeof a === 'string'){
					if (b===0){
						stack.push(1);
					}
					if (b===1){
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
				a = stack.pop();
				if (typeof a === 'number'){
					stack.push(a*Math.E);
				}
				else {
					console.error('Erroneous Euler\n@ Char '+line+'\n\t'+command);
					mconsole('e','Erroneous Euler\n@ Char '+line+'\n\t'+command);
				}
				break;
			// l ln of a
			case 'l':
				a = stack.pop();
				if (typeof a !== 'number'){
					console.error('Attempted log of a string\n@ Char '+line+'\n\t'+command);
					mconsole('e','Attempted log of a string\n@ Char '+line+'\n\t'+command);
				}
				stack.push(Math.log(a));
				break;
			// p pop from array
			case 'p':
				a = stack.pop();
				b = a.pop();
				stack.push(a);
				stack.push(b);
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
			// | absolute value
			case '|':
				a = stack.pop();
				stack.push(Math.abs(stack[stack.length-1]));
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
						console.error('Mismatched braces\n@ Char '+line+'\n\t'+command);
						mconsole('e','Mismatched braces\n@ Char '+line+'\n\t'+command);
						return true;
					}
					//otherwise
					tempcommand = commandlist[templine];//get command
					console.log('checking'+tempcommand);
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
				else {
					stack.push(-a);
				}
				break;
			// γ 947
			case 'γ':
				a = stack.pop();
				if (typeof a === 'number'){
					stack.push(a*0.5772156649015329);
				}
				else {
					console.error('Erroneous Euler-Mascheroni\n@ Char '+line+'\n\t'+command);
					mconsole('e','Erroneous Euler-Mascheroni\n@ Char '+line+'\n\t'+command);
					return true;
				}
				break;
			// π 960
			case 'π':
				a = stack.pop();
				if (typeof a === 'number'){
					stack.push(a*Math.PI);
				}
				else {
					console.error('Erroneous Pi\n@ Char '+line+'\n\t'+command);
					mconsole('e','Erroneous Pi\n@ Char '+line+'\n\t'+command);
					return true;
				}
				break;
			//.charCodeAt(0)
			// error
			default:
				console.error('Operation not in dictionary: '+command+'\n@ Char '+line+'\n\t'+command);
				mconsole('e','Operation not in dictionary: '+command+'\n@ Char '+line+'\n\t'+command);
				return true;
		}
	}
	// final touches
	document.getElementById('stack').innerHTML = stack;
	return false;
}

function fstep100(){
	"use strict";
	for (i=0;i<100;i+=1){
		fstep();
	}
	return false;
}