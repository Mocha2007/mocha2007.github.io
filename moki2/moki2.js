/* jshint esversion: 6, strict: true, strict: global */
/* globals alphabet */
'use strict';

const whitespace = ' \n\r\t';
const uppercase = alphabet.toUpperCase();
const identchars = alphabet + uppercase + '_';
const numbers = '0123456789';
const innerIdentChars = identchars + numbers;
const operators = {
	'=': -Infinity, // evaluate last
	'+': 0,
	'-': 0,
	'(': Infinity, // evaluate first
	')': Infinity,
};



// turn source into tokens
class Tokenizer {
	constructor(source = ''){
		this.source = source.split('');
		this.tokens = [];
	}
	eof(){
		return this.source.length === 0;
	}
	/** return next char without popping */
	peek(){
		return this.source[0];
	}
	/** pop next char */
	pop(){
		return this.source.shift();
	}
	readComment(type = '//'){
		// read a comment
		while (!this.eof()){
			const current = this.pop();
			if (type === '//' && current === '\n')
				return;
			if (type === '/*' && current === '*' && this.peek() === '/')
				return;
		}
	}
	readIdent(id = ''){
		// read an identifier
		while (innerIdentChars.includes(this.peek())){
			id += this.pop();
		}
		this.tokens.push(id);
	}
	readNum(num = ''){
		const acceptable = numbers + '.';
		// read an identifier
		while (acceptable.includes(this.peek())){
			num += this.pop();
		}
		this.tokens.push(num);
	}
	readOperator(op = ''){
		// read an operator
		while (Array.from(operators.keys()).includes(op+this.peek())){
			op += this.pop();
		}
		this.tokens.push(op);
	}
	readString(type = '\''){
		// read a string
		let escaped = false;
		let string = '';
		while (escaped || this.peek() !== type){
			const next = this.pop();
			if (escaped){
				string += next;
				escaped = false;
				continue;
			}
			if (next === '\\'){
				escaped = true;
				continue;
			}
			string += next;
		}
		this.tokens.push('"'+string+'"');
	}
	tokenize(){
		while (!this.eof()){
			// currently not a comment, not a string.
			const char = this.pop();
			// whitespace?
			if (whitespace.includes(char)){
				continue;
			}
			// identifier?
			if (identchars.includes(char)){
				this.readIdent(char);
				continue;
			}
			// number?
			if (numbers.includes(char)){
				this.readNum(char);
				continue;
			}
			// not identifier
			// todo: code block {}
			switch (char){
				// string
				case '"':
				case '\'':
					this.readString(char);
					continue;
				case '/':
					if (this.peek() === '/'){
						this.pop();
						this.readComment('//');
						continue;
					}
					if (this.peek() === '*'){
						this.pop();
						this.readComment('/*');
						continue;
					}
					// fall through
				default:
					this.readOperator(char); // incl. parens
			}
		}
	}
}
// turn tokens into ast
// run ast