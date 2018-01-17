var versionno = '1';
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
	return ((n%m)+m)%m;
}
// MAIN

// Console
function mconsole(MessageClass,Message){
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
var bracebalance = 0;
// temps
var a,b,c;

function cclr(){
	document.getElementById('console').innerHTML = '<i>MOKI rev '+versionno+'</i>';
	return false;
}

function reset(){
	// Reset line
	line = 0;
	document.getElementById('line').innerHTML = line;
	// Stack
	stack = [0];
	// tempstring
	tempstring = '';
	stringcreation = 0;
	// Load Program
	commandlist = document.getElementById('code').value;
	console.log(commandlist);
	// blank warn
	if (commandlist===''){
			console.warn('Empty Program');
			mconsole('w','Empty Program');
	}
	inputline = 0;
	console.log('Reset');
	return false;
}

// Main
function fstep(){
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
	else if (stringcreation && command!=="'"){
		tempstring+=command;
	}
	// do
	else {
		switch (command){
			// ignore whitespace
			case '\t':
				console.warn('whitespace\n@ Char '+line);
				mconsole('w','whitespace\n@ Char '+line);
				break;
			case '\n':
				console.warn('whitespace\n@ Char '+line);
				mconsole('w','whitespace\n@ Char '+line);
				break;
			case ' ':
				console.warn('whitespace\n@ Char '+line);
				mconsole('w','whitespace\n@ Char '+line);
				break;
			// ! NOT
			case '!':
				if (stack[stack.length-1]===0){
					stack[stack.length-1] = 1;
				}
				else {
					stack[stack.length-1] = 0;
				}
				break;
			// " turn top of stack into a char, ignore if already
			case '"':
				if (Number.isFinite(stack[stack.length-1])){
					stack[stack.length-1] = String.fromCharCode(stack[stack.length-1]);
				}
				else {
					console.warn('superfluous charconverter\n@ Char '+line);
					mconsole('w','superfluous charconverter\n@ Char '+line);
				}
				break;
			// # comment toggle
			case '#':
				iscommented = 1-iscommented; // toggle
				console.log('comment toggle');
				break;
			// $ accept next line of input. if no input, then zero.
			case '$':
				if (0==document.getElementById('input').value.split("\n")[inputline]){// must be ==
					stack.push(0);
					console.warn('superfluous input\n@ Char '+line);
					mconsole('w','superfluous input\n@ Char '+line);
				}
				else {
					stack.push(document.getElementById('input').value.split("\n")[inputline]);
				}
				inputline+=1
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
					console.error('string division\n@ Char '+line+'\n\t'+command);
					mconsole('e','string division\n@ Char '+line+'\n\t'+command);
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
					// if tempstring is equivalent to a #
					if (Number.isFinite(Number(tempstring))){
						stack.push(Number(tempstring));
					}
					else {
						stack.push(tempstring);
					}
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
					console.log((new Array(b+1)).join(a))
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
			// - sub
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
				// ZeroDivisionError
				if (b===0){
					console.error('zero divisor\n@ Char '+line+'\n\t'+command);
					mconsole('e','zero divisor\n@ Char '+line+'\n\t'+command);
					return true;
				}
				// bitch and whine if either var is a string
				if (typeof a+b === 'string'){
					console.error('string division\n@ Char '+line+'\n\t'+command);
					mconsole('e','string division\n@ Char '+line+'\n\t'+command);
					return true;
				}
				stack.push(a/b);
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
				stack.push((a<b)+0);
				break;
			// = equal to
			case '=':
				b = stack.pop();
				a = stack.pop();
				stack.push((a===b)+0);
				break;
			// > greater than; javascript's handling of it with strings is already perfect
			case '>':
				b = stack.pop();
				a = stack.pop();
				stack.push((a>b)+0);
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
			// [ floor
			case '[':
				a = stack[stack.length-1];
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
				a = stack[stack.length-1];
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
				// 0^0Error
				if (a===0 && b===0){
					console.error('zero power\n@ Char '+line+'\n\t'+command);
					mconsole('e','zero power\n@ Char '+line+'\n\t'+command);
					return true;
				}
				// string error
				if (typeof a+b === 'string'){
					console.error('string exponentiation\n@ Char '+line+'\n\t'+command);
					mconsole('e','string exponentiation\n@ Char '+line+'\n\t'+command);
					return true;
				}
				stack.push(Math.pow(a,b));
				break;
			// _ undefined
			// ` undefined
			// abc
			// { begin loop
			case '{':
				break;
			// | absolute value
			case '|':
				stack[stack.length-1] = Math.abs(stack[stack.length-1]);
				break;
			// } end loop iff top of stack === 0
			case '}':
				if (stack[stack.length-1] !== 0){
					console.log('Loop check at '+line+' failed; val='+stack[stack.length-1]);
					var backupline = line;
					var backupcommand = command;
					line-=1; // undoes change near beginning
					bracebalance = -1;
					while (bracebalance!==0) {
						line-=1;//look next character over
						// immediately error out if past beginning
						if (line<0){
							console.error('Mismatched braces\n@ Char '+backupline+'\n\t'+backupcommand);
							mconsole('e','Mismatched braces\n@ Char '+backupline+'\n\t'+backupcommand);
							return true;
						}
						//otherwise
						command = commandlist[line];//get command
						if (command==='{'){
							bracebalance+=1;
						}
						else if (command==='}'){
							bracebalance-=1;
						}
					}
				}
				break;
			// ~ undefined
			// error
			default:
				console.error('Operation not in dictionary: '+command+'\n@ Char '+line+'\n\t'+command);
				mconsole('e','Operation not in dictionary: '+command+'\n@ Char '+line+'\n\t'+command);
				return true;
		}
	}
	// final touches
	return false;
}

function fstep100(){
	for (i=0;i<100;i+=1){
		fstep();
	}
	return false;
}