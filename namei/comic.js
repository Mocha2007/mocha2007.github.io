/* exported comic */
/* global comicData */
/** eremoran comic thingy
 * reads a list of images, along with rectangles where text can go and the text to be placed there
 * text will automatically be sized to the speech bubbles
 * in the future, I want text formatting as well, but that can wait...
 * there should be a native-eremoran-script mode, a latin ortho mode, and an english mode
 * modes:
 * 	- ERE
 * 	- ere
 *  - en
 */

class ComicFrame {
	constructor(o){
		this.title = o.title;
		this.rects = o.rects;
		this.size = o.size;
		this.texts = o.texts;
	}
	get img(){
		const img = document.createElement('img');
		img.src = `../img/comic/${this.title.replace(/\s/g, '_')}.png`;
		img.classList.add('comicImg');
		return img;
	}
	get scaleH(){
		return 100 / this.size[0];
	}
	get scaleV(){
		return 100 / this.size[1];
	}
	elem(lang = 'en'){
		const container = document.createElement('div');
		container.classList.add('comicContainer');
		container.appendChild(this.img);
		this.textBoxes(lang).forEach(elem => container.appendChild(elem));
		return container;
	}
	/** @returns {HTMLDivElement[]} */
	textBoxes(lang = 'en'){
		return this.rects.map((nums, i) => {
			const [left, top, width, height] = nums;
			const div = document.createElement('div');
			div.classList.add('textBox');
			div.style.top = top*this.scaleV + '%';
			div.style.left = left*this.scaleH + '%';
			div.style.width = width*this.scaleH + '%';
			div.style.lineHeight = div.style.height = height*this.scaleV + '%';
			div.innerHTML = this.texts[i][lang];
			if (lang === 'ERE')
				div.classList.add('eremoran');
			return div;
		});
	}
}
/** @type {ComicFrame[]} */
ComicFrame.frames = [];

const comic = {
	/** @param {string} */
	changeLang(to){
		this.lang = to;
		this.refresh();
	},
	get comicBox(){
		return document.getElementById('comicBox');
	},
	currentFrame: {
		id: 0,
		get obj(){
			return ComicFrame.frames[this.id];
		},
	},
	init(){
		ComicFrame.frames = comicData.map(o => new ComicFrame(o));
		this.refresh();
	},
	lang: 'en',
	refresh(){
		this.comicBox.innerHTML = '';
		this.comicBox.appendChild(this.currentFrame.obj.elem(this.lang));
	},
};