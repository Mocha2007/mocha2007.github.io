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
new PaleoMap(10, 'https://upload.wikimedia.org/wikipedia/commons/2/26/Mapa_amb_distibuci%C3%B3_al_Eoc%C3%A8.png');
new PaleoMap(30, 'http://www.scotese.com/images/B030_zonef.jpg');
new PaleoMap(60, 'http://www.scotese.com/images/E060_zonef.jpg');
new PaleoMap(90, 'https://upload.wikimedia.org/wikipedia/commons/d/d0/90_Ma_-_Late_Cretaceous_paleogeography_with_known_distribution_of_Arcellites_disciformis_indicated.jpg');
new PaleoMap(122.5, 'https://upload.wikimedia.org/wikipedia/commons/a/a3/The_distribution_of_paraves_in_Early_Cretaceous.png');
new PaleoMap(170, 'https://upload.wikimedia.org/wikipedia/commons/b/b3/MiddleJurassicMap.jpg');
new PaleoMap(220, 'https://upload.wikimedia.org/wikipedia/commons/e/ec/220Ma_Paleomap.svg');
new PaleoMap(250, 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Triassic_250.png');
new PaleoMap(270, 'https://upload.wikimedia.org/wikipedia/commons/9/90/Distribution_of_caseid_synapsids_in_late_Paleozoic_Pangea.jpg');
new PaleoMap(300, 'https://upload.wikimedia.org/wikipedia/commons/9/96/Karoo_Glaciation.png');
new PaleoMap(372, 'https://upload.wikimedia.org/wikipedia/commons/5/57/Late_Devonian_palaeogeographic_map.jpg');
new PaleoMap(420, 'http://www.scotese.com/images/V420_zonef.jpg');
new PaleoMap(440, 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Silurian_plate_tectonics.png');
new PaleoMap(458, 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Map_showing_the_paleogeography_of_the_Middle_Ordovician_%28approximately_458_million_years_ago%29._Most_researchers_place_western_%282de3cd16-15cc-4d0c-b553-71cbbeb4c7e3%29.jpg');
new PaleoMap(480, 'http://www.scotese.com/images/X480_zonef.jpg');
new PaleoMap(500, 'https://upload.wikimedia.org/wikipedia/commons/9/96/%E0%A6%95%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%AE%E0%A7%8D%E0%A6%AC%E0%A7%8D%E0%A6%B0%E0%A6%BF%E0%A6%AF%E0%A6%BC%E0%A6%BE%E0%A6%A8%E0%A7%AB%E0%A7%A6.png');
new PaleoMap(520, 'http://www.scotese.com/images/Y520_zonef.jpg');
new PaleoMap(540, 'http://www.scotese.com/images/Z540_zonef.jpg');
new PaleoMap(600, 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Ediacaran-Cambrian_boundary_plate_tectonics.png');
new PaleoMap(720, 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Earth_720Ma.gif');
new PaleoMap(1600, 'https://upload.wikimedia.org/wikipedia/commons/5/58/Columbia1600.png');
new PaleoMap(2050, 'https://upload.wikimedia.org/wikipedia/commons/d/d5/2050ma.png');


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
		this.elem.img.title = this.elem.img.alt = `Map of the Earth circa ${map.mya} MYA`;
	},
	get year(){
		return -this.elem.slider.children[1].value;
	},
};

paleomap.init();