/* exported bee */
/* global elements, isSubsetOf, normalizeEremoran, random, range, sum */
'use strict';

// based on https://nytimes-spellingbee.com/game/bee2/

const bee = {
	alphabet: 'abdehiklmnoprstuzêô',
	current: {
		get answer(){
			return document.getElementById('beeAnswer').value;
		},
		answers: [],
		letters: [],
		maxScore: 0,
		score: 0,
		solutions: [],
	},
	get dict(){
		if (this.dict.cache)
			return this.dict.cache;
		return this.dict.cache = elements.dict.map(normalizeEremoran)
			.filter(word => 3 < word.length);
	},
	get invalidReason(){
		// too short?
		if (this.current.answer.length <= 3)
			return 'Too Short';
		// bad letters?
		if (Array.from(this.current.answer).some(l => !this.current.letters.includes(l)))
			return 'Bad Letters';
		// no central letter
		if (!this.current.answer.includes(this.current.letters[0]))
			return 'No Central Letter';
		// not in dict?
		if (!this.current.solutions.includes(this.current.answer))
			return 'Not in Dictionary';
		// already said?
		return 'Already Used';
	},
	/** @param {string} char */
	append(char){
		document.getElementById('beeAnswer').value += char;
	},
	clearAnswer(){
		document.getElementById('beeAnswer').value = '';
	},
	randomLetters(){
		// central - outer 1-6
		const remainder = Array.from(random.shuffle(this.alphabet));
		return range(7).map(() => remainder.pop());
	},
	refreshAnswers(){
		const ul = document.getElementById('beeAnswers');
		ul.innerHTML = '';
		this.current.answers.sort().forEach(word => {
			const li = document.createElement('li');
			li.innerHTML = word;
			ul.appendChild(li);
		});
		const score = document.getElementById('beeScoreCurrent');
		score.style.width = `calc(100% * ${this.current.score} / ${this.current.maxScore}`;
		score.innerHTML = this.current.score;
	},
	restart(){
		this.current.answers = [];
		this.current.score = 0;
		// keep generating letters until you get a workable prompt
		while (!this.current.solutions.length){
			this.current.letters = this.randomLetters();
			this.current.solutions = elements.dict.filter(word => isSubsetOf(
				new Set(word), new Set(this.current.letters))
				&& word.includes(this.current.letters[0])
				&& 3 < word.length
			);
			// console.debug(this.current.letters, this.current.solutions);
			// alert();
		}
		// determine max score
		this.current.maxScore
			= sum(this.current.solutions.map(word => this.score(word, this.current.letters)));
		// put up letter hexes
		document.getElementById('beeChars').innerHTML = '';
		this.current.letters.forEach(char => {
			const elem = document.createElement('abbr');
			elem.title = elem.innerHTML = char;
			elem.classList.add('eremoran');
			document.getElementById('beeChars').appendChild(elem);
		});
	},
	score(word, letters){
		let score = word.length - 3;
		if (new Set(word) === new Set(letters))
			score += 7;
		return score;
	},
	validate(){
		const answer = this.current.answer;
		if (this.current.solutions.includes(answer)
				&& !this.current.answers.includes(answer)){
			this.current.answers.push(answer);
			this.current.score += this.score(answer);
			this.refreshAnswers();
		}
		else {
			// todo show brief popup saying it's invalid
			// w/ invalidReason
			alert(this.invalidReason);
		}
		this.clearAnswer();
	},
};