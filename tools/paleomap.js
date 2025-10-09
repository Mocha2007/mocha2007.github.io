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
		// PaleoMap.maps.push(this);
		// preload images
		// https://stackoverflow.com/questions/3646036/preloading-images-with-javascript
		const img = new Image();
		img.src = src;
	}
	score(year){
		return Math.abs(this.mya - year);
	}
}
/** @type {PaleoMap[]} */
PaleoMap.maps = [
	// cf. https://commons.wikimedia.org/wiki/Category:Palaeomaps_by_year
	new PaleoMap(0, 'https://upload.wikimedia.org/wikipedia/commons/7/78/Mollweide-projection.jpg'),
	new PaleoMap(1, 'https://upload.wikimedia.org/wikipedia/commons/6/60/1_Ma_paleoglobe.png'),
	new PaleoMap(5, 'https://upload.wikimedia.org/wikipedia/commons/f/fc/Mollweide_Paleographic_Map_of_Earth%2C_5_Ma_%28Zanclean_Age%29.jpg'),
	new PaleoMap(10, 'https://upload.wikimedia.org/wikipedia/commons/5/56/010_mya.png'),
	new PaleoMap(15, 'https://upload.wikimedia.org/wikipedia/commons/6/6a/15_Ma_paleoglobe.png'),
	new PaleoMap(21, 'https://upload.wikimedia.org/wikipedia/commons/8/80/Mollweide_Paleographic_Map_of_Earth%2C_21_Ka_%28Late_Pleistocene_Age%29.png'),
	new PaleoMap(30, 'https://upload.wikimedia.org/wikipedia/commons/2/27/Mollweide_Paleographic_Map_of_Earth%2C_30_Ma_%28Rupelian_Age%29.png'),
	new PaleoMap(50, 'https://upload.wikimedia.org/wikipedia/commons/0/03/Ypresian_Earth_50_mya.jpg'),
	new PaleoMap(60, 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Mollweide_Paleographic_Map_of_Earth%2C_60_Ma_%28Selandian_Age%29.png'),
	new PaleoMap(90, 'https://upload.wikimedia.org/wikipedia/commons/d/d0/90_Ma_-_Late_Cretaceous_paleogeography_with_known_distribution_of_Arcellites_disciformis_indicated.jpg'),
	new PaleoMap(120, 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Mollweide_Paleographic_Map_of_Earth%2C_120_Ma_%28Aptian_Age%29.jpg'),
	new PaleoMap(170, 'https://upload.wikimedia.org/wikipedia/commons/9/9a/170_Ma.png'), // https://upload.wikimedia.org/wikipedia/commons/b/b3/MiddleJurassicMap.jpg
	new PaleoMap(220, 'https://upload.wikimedia.org/wikipedia/commons/e/ec/220Ma_Paleomap.svg'),
	new PaleoMap(250, 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Triassic_250.png'),
	new PaleoMap(270, 'https://upload.wikimedia.org/wikipedia/commons/9/90/Distribution_of_caseid_synapsids_in_late_Paleozoic_Pangea.jpg'),
	new PaleoMap(275, 'https://upload.wikimedia.org/wikipedia/commons/e/e7/275_Ma_paleoglobe.png'),
	new PaleoMap(300, 'https://upload.wikimedia.org/wikipedia/commons/9/96/Karoo_Glaciation.png'),
	new PaleoMap(330, 'https://upload.wikimedia.org/wikipedia/commons/6/6d/330_Ma_paleoglobe.png'),
	new PaleoMap(370, 'https://upload.wikimedia.org/wikipedia/commons/c/ce/370_Ma_paleoglobe.png'),
	new PaleoMap(372, 'https://upload.wikimedia.org/wikipedia/commons/5/57/Late_Devonian_palaeogeographic_map.jpg'),
	new PaleoMap(420, 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Mollweide_Paleographic_Map_of_Earth%2C_420_Ma_%28P%C5%99%C3%ADdol%C3%AD_Epoch%29.png'),
	new PaleoMap(430, 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Mollweide_Paleographic_Map_of_Earth%2C_430_Ma_%28Homerian_Age%29.png'),
	new PaleoMap(440, 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Silurian_plate_tectonics.png'),
	new PaleoMap(458, 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Map_showing_the_paleogeography_of_the_Middle_Ordovician_%28approximately_458_million_years_ago%29._Most_researchers_place_western_%282de3cd16-15cc-4d0c-b553-71cbbeb4c7e3%29.jpg'),
	new PaleoMap(465, 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Mollweide_Paleographic_Map_of_Earth%2C_465_Ma_%28Darriwilian_Age%29.png'),
	new PaleoMap(495, 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Mollweide_Paleographic_Map_of_Earth%2C_495_Ma_%28Paibian_Stage%29.png'),
	new PaleoMap(505, 'https://upload.wikimedia.org/wikipedia/commons/4/41/Mollweide_Paleographic_Map_of_Earth%2C_505_Ma_%28Wuliuan_Stage%29.png'),
	new PaleoMap(510, 'https://upload.wikimedia.org/wikipedia/commons/2/25/Mollweide_Paleographic_Map_of_Earth%2C_510_Ma.png'),
	new PaleoMap(515, 'https://upload.wikimedia.org/wikipedia/commons/6/63/Mollweide_Paleographic_Map_of_Earth%2C_515_Ma.png'),
	new PaleoMap(530, 'https://upload.wikimedia.org/wikipedia/commons/1/13/Mollweide_Paleographic_Map_of_Earth%2C_530_Ma_%28Fortunian_Age%29.png'),
	new PaleoMap(600, 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Mollweide_Paleographic_Map_of_Earth%2C_600_Ma_%28Ediacaran_Period%29.png'),
	new PaleoMap(690, 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Mollweide_Paleographic_Map_of_Earth%2C_690_Ma_%28Cryogenian_Period%29.png'),
	new PaleoMap(720, 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Earth_720Ma.gif'),
	new PaleoMap(750, 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Mollweide_Paleographic_Map_of_Earth%2C_750_Ma_%28Tonian_Period%29.png'),
	new PaleoMap(1040, 'https://upload.wikimedia.org/wikipedia/commons/8/8c/1040_Ma_paleoglobe.png'),
	new PaleoMap(1260, 'https://upload.wikimedia.org/wikipedia/commons/9/93/1260_Ma_paleoglobe.png'),
	new PaleoMap(1590, 'https://upload.wikimedia.org/wikipedia/commons/6/63/1590_Ma.png'),
	new PaleoMap(1600, 'https://upload.wikimedia.org/wikipedia/commons/5/58/Columbia1600.png'),
	new PaleoMap(1740, 'https://upload.wikimedia.org/wikipedia/commons/3/34/1740_Ma_paleoglobe.png'),
	new PaleoMap(2000, 'https://upload.wikimedia.org/wikipedia/commons/5/51/2000_Ma_paleoglobe.png'),
	new PaleoMap(2050, 'https://upload.wikimedia.org/wikipedia/commons/d/d5/2050ma.png'),
	new PaleoMap(2200, 'https://upload.wikimedia.org/wikipedia/commons/4/4a/2200_Ma.png'),
	new PaleoMap(2400, 'https://upload.wikimedia.org/wikipedia/commons/5/5c/2400_Ma_paleoglobe.png'),
	new PaleoMap(2650, 'https://upload.wikimedia.org/wikipedia/commons/9/9a/2650_Ma_paleoglobe.png'),
	new PaleoMap(3000, 'https://upload.wikimedia.org/wikipedia/commons/d/d9/3000_Ma_paleoglobe.png'),
];


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
			container.appendChild(document.createElement('br'));
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
			const container = document.createElement('span');
			const span = document.createElement('span');
			span.id = 'paleomap_year';
			container.appendChild(span);
			container.appendChild(document.createTextNode(' Mya'));
			return container;
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
		if (this.initialized) {
			return;
		}
		if (document.readyState === 'loading'){
			return setTimeout(() => this.init(), 100);
		}
		const cC = document.createElement('div');
		cC.id = 'paleomap_super';
		cC.appendChild(this.create.container);
		document.body.appendChild(cC);
		this.update();
		console.info('paleomap.js loaded.');
		this.initialized = true;
	},
	initialized: false,
	/** @param {number} delta */
	move(delta){
		const v = +this.elem.slider.children[1].value;
		this.elem.slider.children[1].value = v + delta;
		this.update();
	},
	update(){
		this.elem.year.innerHTML = this.year;
		// find closest year...
		const year = this.year;
		const map = PaleoMap.maps.sort((a, b) => a.score(year) - b.score(year))[0];
		this.elem.img.src = map.src;
		this.elem.img.title = this.elem.img.alt = `Map of the Earth circa ${map.mya} MYA`;
	},
	get year(){
		return -this.elem.slider.children[1].value;
	},
};

paleomap.init();