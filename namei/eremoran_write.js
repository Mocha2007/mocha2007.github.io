/* exported ereWrite */
/* global elements, EremoranTooltip, linkCard, titleCard */
// a tool for easily writing/translating to Eremoran...

const ereWrite = {
	/** @param {string} word */
	add(word){
		const elem = titleCard(word);
		if (this.words.length) // add space beforehand
			this.elem.canvas.appendChild(document.createTextNode(' '));
		this.elem.canvas.appendChild(elem);
		this.words.push(word);
		// element
		elem.innerHTML = word;
		elem.classList.add('eremoran');
		EremoranTooltip.setupWord(elem);
		return elem;
	},
	addRaw(){
		this.add(this.elem.input.value);
	},
	elem: {
		/** @returns {HTMLDivElement} */
		get canvas(){
			return document.getElementById('erewrite_canvas');
		},
		/** @returns {HTMLInputElement} */
		get input(){
			return document.getElementById('erewrite_input');
		},
		/** @returns {HTMLUListElement} */
		get list(){
			return document.getElementById('erewrite_suggest');
		},
	},
	removeLast(){
		this.elem.canvas.children[this.elem.canvas.children.length-1].remove();
		this.words.pop();
	},
	reset(){
		this.words = [];
		this.elem.canvas.innerHTML = '';
	},
	update(){
		this.elem.list.innerHTML = '';
		// update suggestions...
		const search = this.elem.input.value;
		const re = new RegExp(search, 'g');
		const results = elements.raws.filter(raw => raw.defList.some(def => re.test(def)));
		results.slice(0, 10).forEach(raw => {
			const li = document.createElement('li');
			const linkElem = linkCard(raw.title);
			linkElem.href = '#Write_Eremoran';
			linkElem.onclick = () => this.add(raw.title);
			li.appendChild(linkElem);
			this.elem.list.appendChild(li);
		});
	},
	/** @type {string[]} */
	words: [],
};