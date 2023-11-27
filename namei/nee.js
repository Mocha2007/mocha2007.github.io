const nee = {
	/** the map will be 700 px wide */
	imgScale: 700,
	main(){
		// create mapmode buttons
		const mapmodeSelector = document.getElementById('mapmodes');
		MapMode.mapmodes.forEach(mode => mapmodeSelector.appendChild(mode.label));
		// add orbs
		const orbContainer = document.getElementById('orbs');
		Feature.features.forEach(feature => orbContainer.appendChild(feature.orb));
		// select first mapmode
		MapMode.mapmodes[0].select();
		// select first feature
		Feature.features[0].select();
	},
	orbsize: 25,
};

class MapMode {
	constructor(name, src){
		/** @type {string} */
		this.name = name;
		/** @type {string} */
		this.src = src;
		MapMode.mapmodes.push(this);
	}
	get inputID(){
		return `mode_${this.name.toLowerCase()}`;
	}
	get label(){
		const elem = document.createElement('label');
		elem.classList.add('button');
		elem.onclick = () => this.select();
		const input = document.createElement('input');
		input.id = this.inputID;
		elem.appendChild(input);
		input.type = 'radio';
		input.name = 'composition';
		input.value = this.name;
		elem.appendChild(document.createTextNode(this.name));
		return elem;
	}
	select(){
		document.getElementById(this.inputID).checked = true;
		document.getElementById('map').src = this.src;
	}
}
/** @type {MapMode[]} */
MapMode.mapmodes = [];
new MapMode('Climate', '../img/pankair.png');

class Feature {
	constructor(x, y, name, src, importance = nee.orbsize, desc = ''){
		/** @type {number} in % */
		this.x = x;
		/** @type {number} in % */
		this.y = y;
		/** @type {string} */
		this.name = name;
		/** @type {string} */
		this.src = src;
		/** @type {number} */
		this.importance = importance;
		/** @type {string} */
		this.desc = desc;
		Feature.features.push(this);
	}
	get infobox(){
		// todo
		const elem = document.createElement('div');
		const h = document.createElement('h2');
		elem.appendChild(h);
		h.innerHTML = this.name;
		const img = document.createElement('img');
		img.src = this.src;
		elem.appendChild(img);
		const p = document.createElement('p');
		elem.appendChild(p);
		p.innerHTML = this.desc;
		return elem;
	}
	get orb(){
		const elem = document.createElement('img');
		elem.id = this.orbID;
		elem.classList.add('orb');
		elem.title = this.name;
		elem.src = this.src;
		elem.onclick = () => this.select();
		const size = elem.style.zIndex = this.importance;
		const [x, y] = [this.x * nee.imgScale - size/2,
			this.y * nee.imgScale - size/2];
		elem.style.left = x + 'px';
		elem.style.top = y + 'px';
		elem.style.borderRadius = size + 'px';
		elem.style.height = size + 'px';
		elem.style.width = size + 'px';
		return elem;
	}
	get orbID(){
		return `orb_${this.name.toLowerCase()}`;
	}
	select(){
		const desc = document.getElementById('description');
		desc.innerHTML = '';
		desc.appendChild(this.infobox);
		// deselect all orbs
		document.querySelectorAll('.selectedOrb').forEach(e => e.classList.remove('selectedOrb'));
		// select orb
		document.getElementById(this.orbID).classList.add('selectedOrb');
	}
}
/** @type {Feature[]} */
Feature.features = [];
// countries / nations / cities
new Feature(1517/3000, 1872/3000, 'Eremor', 'https://upload.wikimedia.org/wikipedia/commons/f/f4/Kirthar_park.jpg',
	50, 'Eremor is an interesting land...');
new Feature(1290/3000, 1660/3000, 'Mur', 'https://upload.wikimedia.org/wikipedia/commons/6/62/TigrisRiver.JPG',
	25, 'The Murans are related to the Eremorans.');
new Feature(1630/3000, 1890/3000, 'Tepu', 'https://upload.wikimedia.org/wikipedia/commons/6/66/Periyar_National_Park.JPG');
new Feature(1740/3000, 1860/3000, 'Kuren', 'https://upload.wikimedia.org/wikipedia/commons/2/23/Sundarban_Tiger.jpg');
new Feature(1770/3000, 1770/3000, 'Taika', 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Restaurant_on_stilts_on_the_Outskirts_of_Dhaka.jpg');
new Feature(2640/3000, 1560/3000, 'Važcud', 'https://upload.wikimedia.org/wikipedia/commons/2/2a/%E4%B8%B9%E9%9C%9E%E5%B1%B1_04.jpg', 50);
new Feature(2070/3000, 1630/3000, 'Nekang', 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Tak_province_Burmese_mountains.jpg', 50);
new Feature(760/3000, 940/3000, 'Półtaś', 'https://upload.wikimedia.org/wikipedia/commons/2/29/Green_and_rolling_countryside_in_northern_Portugal_%2852712607091%29.jpg', 50);
new Feature(910/3000, 610/3000, 'Porön', 'https://upload.wikimedia.org/wikipedia/commons/9/91/German_Countryside_%2873864589%29.jpeg', 50);
new Feature(1210/3000, 1340/3000, 'Irikar', 'https://upload.wikimedia.org/wikipedia/commons/2/23/Azerbaijan_Nature_Shaki.jpg');
new Feature(2230/3000, 2800/3000, 'Nizhind', 'https://upload.wikimedia.org/wikipedia/commons/4/46/Lake_Toba%2C_North_Sumatra%2C_Indonesia.jpg', 50);
// topological features
new Feature(840/3000, 1070/3000, 'Sinônô', 'https://upload.wikimedia.org/wikipedia/commons/c/cf/Karachay-Cherkessia%2C_Caucasus_Mountains%2C_Abishira-Akhuba%2C_Black_Rock_Ridge_2.jpg', 40);
new Feature(1900/3000, 1310/3000, 'Nadnekis', 'https://upload.wikimedia.org/wikipedia/commons/2/29/Himalayas%2C_Ama_Dablam%2C_Nepal.jpg', 40);

nee.main();