/* exported shiritori */
/* global elements, normalizeEremoran, random */

const shiritori = {
	/** @param {string} word */
	add(word){
		this.currentGame.push(word);
		const li = document.createElement('li');
		li.innerHTML = word;
		this.elem.answers.appendChild(li);
	},
	// computer plays...
	ai(){
		const play = this.currentGame.length ? this.random.continuation : this.random.start;
		if (play)
			this.add(play);
		else {
			alert(`You beat the AI! Score: ${this.elem.score.innerHTML}`);
			// console.debug(this.elem.answers.children.length, this.currentGame);
			this.restart();
		}
		return !!play;
	},
	/** @type {string} */
	get currentChar(){
		const cw = this.currentWord;
		return cw[cw.length-1];
	},
	/** @type {string[]} */
	currentGame: [],
	/** @type {string} */
	get currentWord(){
		return this.currentGame[shiritori.currentGame.length-1];
	},
	elem: {
		/** @returns {HTMLInputElement} */
		get answer(){
			return document.getElementById('shiritoriAnswer');
		},
		/** @returns {HTMLUListElement} */
		get answers(){
			return document.getElementById('shiritoriAnswers');
		},
		/** @returns {HTMLSpanElement} */
		get score(){
			return document.getElementById('shiritoriScore');
		},
	},
	/** @param {KeyboardEvent} event */
	keyHandler(event){
		if (event.key === 'Enter')
			this.validate();
	},
	random: {
		/** @type {string} */
		get continuation(){
			return random.choice(elements.dict
				.filter(w => w[0] === shiritori.currentChar
					&& !shiritori.currentGame.includes(w)));
		},
		/** @type {string} */
		get start(){
			return random.choice(elements.dict);
		},
	},
	restart(){
		this.currentGame = [];
		this.elem.answer.value = this.elem.answers.innerHTML = '';
		this.ai();
	},
	validate(){
		const answer = normalizeEremoran(this.elem.answer.value.toLowerCase());
		if (answer[0] === this.currentChar
			&& elements.dict.includes(answer)
			&& !this.currentGame.includes(answer)){
			this.elem.answer.value = '';
			this.add(answer);
			this.elem.score.innerHTML = this.currentGame.length/2;
			this.ai();
		}
		else
			alert(`${answer} either does not match final char or is not a word.`);
	},
};