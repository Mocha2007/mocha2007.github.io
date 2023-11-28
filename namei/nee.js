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
new MapMode('Biomes', '../img/pankair_biomes.png');
new MapMode('Climate', '../img/pankair.png');
new MapMode('Crops', '../img/pankair_staple.png');
new MapMode('Drinks', '../img/pankair_drink.png');

class Feature {
	constructor(x, y, name, src, importance = nee.orbsize, desc = '', tags = []){
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
		/** @type {string[]} */
		this.tags = tags;
		Feature.features.push(this);
	}
	get dead(){
		return this.tags.includes('dead');
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
		const elem = document.createElement('div');
		const img = document.createElement('img');
		elem.appendChild(img);
		img.id = this.orbID;
		img.classList.add('orb');
		elem.classList.add('orbContainer');
		elem.title = this.name;
		img.src = this.src;
		elem.onclick = () => this.select();
		const size = elem.style.zIndex = this.importance;
		const [x, y] = [this.x * nee.imgScale - size/2,
			this.y * nee.imgScale - size/2];
		elem.style.left = x + 'px';
		elem.style.top = y + 'px';
		img.style.borderRadius = img.style.height = img.style.width = size + 'px';
		// subtitle
		elem.appendChild(this.subtitle);
		return elem;
	}
	get orbID(){
		return `orb_${this.name.toLowerCase()}`;
	}
	get subtitle(){
		const size = this.importance;
		const sub = document.createElement('span');
		sub.innerHTML = this.name;
		if (this.dead)
			sub.innerHTML += '&nbsp;&dagger;';
		sub.style.left = 0;
		sub.style.top = sub.style.width = size + 'px';
		sub.style.fontSize = `${size + 35}%`;
		return sub;
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
const featureSize = {
	maj: 2 * nee.orbsize,
	semi: 1.6 * nee.orbsize,
	mount: 1.2 * nee.orbsize,
	min: nee.orbsize,
}
// countries / nations / cities
// murans
new Feature(1517/3000, 1872/3000, 'Eremor', 'https://upload.wikimedia.org/wikipedia/commons/f/f4/Kirthar_park.jpg',
	featureSize.maj, 'Eremor is an interesting land...');
new Feature(1290/3000, 1660/3000, 'Mur', 'https://upload.wikimedia.org/wikipedia/commons/6/62/TigrisRiver.JPG',
	featureSize.min, 'The Murans are related to the Eremorans.');
// near murans
new Feature(1630/3000, 1890/3000, 'Tepu', 'https://upload.wikimedia.org/wikipedia/commons/6/66/Periyar_National_Park.JPG');
new Feature(1740/3000, 1860/3000, 'Kuren', 'https://upload.wikimedia.org/wikipedia/commons/2/23/Sundarban_Tiger.jpg');
new Feature(1770/3000, 1770/3000, 'Taika', 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Restaurant_on_stilts_on_the_Outskirts_of_Dhaka.jpg');
new Feature(1670/3000, 1700/3000, 'Wu', 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Shah_Rukn-e-Alam_tomb_in_Multan%2C_Pakistan_01.jpg');
new Feature(1760/3000, 1600/3000, 'Dako', 'https://upload.wikimedia.org/wikipedia/commons/6/66/Kumrat_valley%2C_Upper_Dir.jpg');
new Feature(1100/3000, 1340/3000, 'Irikar', 'https://upload.wikimedia.org/wikipedia/commons/2/23/Azerbaijan_Nature_Shaki.jpg');
// other majors
new Feature(2640/3000, 1560/3000, 'Važcud', 'https://upload.wikimedia.org/wikipedia/commons/2/2a/%E4%B8%B9%E9%9C%9E%E5%B1%B1_04.jpg', featureSize.maj, '', ['dead']);
new Feature(1680/3000, 1060/3000, 'Iwemälre', 'https://savannahinkyrgyzstan.files.wordpress.com/2013/08/dsc_0234.jpg', featureSize.maj, '', ['dead']);
new Feature(2070/3000, 1630/3000, 'Nekang', 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Tak_province_Burmese_mountains.jpg', featureSize.semi);
new Feature(1650/3000, 1390/3000, 'Nuzdexax', 'https://upload.wikimedia.org/wikipedia/commons/3/3b/FrontLines_Environment_Photo_Contest_Winner_-5_%285808476109%29.jpg', featureSize.semi);
new Feature(740/3000, 890/3000, 'Półtaś', 'https://upload.wikimedia.org/wikipedia/commons/2/29/Green_and_rolling_countryside_in_northern_Portugal_%2852712607091%29.jpg', featureSize.maj);
new Feature(910/3000, 550/3000, 'Porön', 'https://upload.wikimedia.org/wikipedia/commons/9/91/German_Countryside_%2873864589%29.jpeg', featureSize.maj);
new Feature(2230/3000, 2800/3000, 'Nizhind', 'https://upload.wikimedia.org/wikipedia/commons/4/46/Lake_Toba%2C_North_Sumatra%2C_Indonesia.jpg', featureSize.maj);
new Feature(1200/3000, 1080/3000, '"PlainsLang"', 'https://upload.wikimedia.org/wikipedia/commons/7/74/Patagonian_Steppe_%283260842962%29.jpg', featureSize.maj);
new Feature(230/3000, 1900/3000, '"Boizone"', 'https://i.imgflip.com/7tz40i.jpg', featureSize.maj, 'The Boizone (name to be determined) is where much of Pankair\'s supply of millet comes from.');
// topological features
new Feature(840/3000, 1070/3000, 'Sinônô', 'https://upload.wikimedia.org/wikipedia/commons/c/cf/Karachay-Cherkessia%2C_Caucasus_Mountains%2C_Abishira-Akhuba%2C_Black_Rock_Ridge_2.jpg', featureSize.mount,
	'The great western mountain range.');
new Feature(1900/3000, 1310/3000, 'Nadnekis', 'https://upload.wikimedia.org/wikipedia/commons/2/29/Himalayas%2C_Ama_Dablam%2C_Nepal.jpg', featureSize.mount,
	'The great eastern mountain range.');

nee.main();