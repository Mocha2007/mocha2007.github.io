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
		/** @returns {HTMLTableCellElement} */
		get list(){
			return document.getElementById('erewrite_suggest');
		},
		/** @returns {HTMLInputElement} */
		get matchcase(){
			return document.getElementById('erewrite_case');
		},
		/** @returns {HTMLInputElement} */
		get wholeword(){
			return document.getElementById('erewrite_wholeword');
		},
	},
	removeLast(){
		this.elem.canvas.children[this.elem.canvas.children.length-1].remove();
		this.words.pop();
	},
	reset(){
		this.words = [];
		this.elem.input.value = this.elem.list.innerHTML = this.elem.canvas.innerHTML = '';
	},
	update(){
		this.elem.list.innerHTML = '';
		// update suggestions...
		const wholeWord = this.elem.wholeword.checked;
		const search = wholeWord ? '\\b' + this.elem.input.value + '\\b' : this.elem.input.value;
		const matchCase = this.elem.matchcase.checked;
		let re;
		try {
			re = new RegExp(search, matchCase ? 'g' : 'gi');
		}
		catch (_){
			return;
		}
		const results = elements.raws.filter(raw => raw.defList.some(def => re.test(def)));
		results.slice(0, 10).forEach((raw, i) => {
			const linkElem = linkCard(raw.title);
			linkElem.href = '#Write_Eremoran';
			linkElem.onclick = () => this.add(raw.title);
			if (i) // add space beforehand
				this.elem.list.appendChild(document.createTextNode(' '));
			this.elem.list.appendChild(linkElem);
		});
	},
	/** @type {string[]} */
	words: [],
};