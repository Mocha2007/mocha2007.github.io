/* exported paleomap */

class PaleoMap {
	/**
	 * @param {number} mya date of this frame
	 * @param {string} src image URL
	 */
	constructor(mya, src){
		/** @type {number} */
		this.mya = mya;
		/** @type {string} */
		this.src = src;
		PaleoMap.maps.push(this);
	}
	get score(){
		return Math.abs(this.mya - paleomap.year);
	}
}
/** @type {PaleoMap[]} */
PaleoMap.maps = [];

new PaleoMap(0, 'https://upload.wikimedia.org/wikipedia/commons/7/78/Mollweide-projection.jpg');
new PaleoMap((385 + 359)/2, 'https://upload.wikimedia.org/wikipedia/commons/5/57/Late_Devonian_palaeogeographic_map.jpg');
new PaleoMap(500, 'https://upload.wikimedia.org/wikipedia/commons/9/96/%E0%A6%95%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%AE%E0%A7%8D%E0%A6%AC%E0%A7%8D%E0%A6%B0%E0%A6%BF%E0%A6%AF%E0%A6%BC%E0%A6%BE%E0%A6%A8%E0%A7%AB%E0%A7%A6.png');


const paleomap = {
	ageOfTheEarth: 4540,
	create: {
		get buttonLeft(){
			const e = document.createElement('span');
			e.id = 'paleomap_buttonLeft';
			e.classList.add('button');
			e.innerHTML = '&lt;';
			e.onclick = () => paleomap.move(-10);
			return e;
		},
		get buttonRight(){
			const e = document.createElement('span');
			e.id = 'paleomap_buttonRight';
			e.classList.add('button');
			e.innerHTML = '&gt;';
			e.onclick = () => paleomap.move(10);
			return e;
		},
		get container(){
			const container = document.createElement('div');
			container.id = 'paleomap_container';
			container.appendChild(this.img);
			container.appendChild(document.createElement('br'));
			container.appendChild(this.year);
			container.appendChild(this.slider);
			return container;
		},
		get img(){
			const img = document.createElement('img');
			img.id = 'paleomap_img';
			return img;
		},
		get slider(){
			// todo
			const label = document.createElement('label');
			label.innerHTML = '&nbsp;MYA';
			label.appendChild(this.buttonLeft);
			const input = document.createElement('input');
			input.type = 'range';
			input.min = -paleomap.ageOfTheEarth;
			input.max = 0;
			label.id = label.for = input.name = 'paleomap_slider';
			label.appendChild(input);
			label.onclick = () => paleomap.update();
			label.appendChild(this.buttonRight);
			return label;
		},
		get year(){
			const span = document.createElement('span');
			span.id = 'paleomap_year';
			return span;
		},
	},
	elem: {
		/** @returns {HTMLDivElement} */
		get container(){
			return document.getElementById('paleomap_container');
		},
		/** @returns {HTMLImageElement} */
		get img(){
			return document.getElementById('paleomap_img');
		},
		/** @returns {HTMLLabelElement} */
		get slider(){
			return document.getElementById('paleomap_slider');
		},
		/** @returns {HTMLSpanElement} */
		get year(){
			return document.getElementById('paleomap_year');
		},
	},
	init(){
		const cC = document.createElement('div');
		cC.id = 'paleomap_super';
		cC.appendChild(this.create.container);
		document.body.appendChild(cC);
		this.update();
	},
	/** @param {number} delta */
	move(delta){
		const v = +this.elem.slider.children[1].value;
		this.elem.slider.children[1].value = v + delta;
		this.update();
	},
	update(){
		this.elem.year.innerHTML = this.year;
		// find closest year...
		const map = PaleoMap.maps.sort((a, b) => a.score - b.score)[0];
		this.elem.img.src = map.src;
		this.elem.img.alt = `Map of the Earth circa ${map.mya} MYA`;
	},
	get year(){
		return -this.elem.slider.children[1].value;
	},
};

paleomap.init();