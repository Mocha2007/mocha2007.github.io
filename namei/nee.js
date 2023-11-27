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
		// add orbs
		const orbContainer = document.getElementById('orbs');
		orbContainer.innerHTML = '';
		Feature.features.filter(feature => feature.mode === this)
			.forEach(feature => orbContainer.appendChild(feature.orb));
	}
}
/** @type {MapMode[]} */
MapMode.mapmodes = [];
const mm_climate = new MapMode('Climate', '../img/pankair.png');

class Feature {
	constructor(mode, x, y, name, src, desc = ''){
		/** @type {MapMode} */
		this.mode = mode;
		/** @type {number} in % */
		this.x = x;
		/** @type {number} in % */
		this.y = y;
		/** @type {string} */
		this.name = name;
		/** @type {string} */
		this.src = src;
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
		const [x, y] = [this.x * nee.imgScale - nee.orbsize/2,
			this.y * nee.imgScale - nee.orbsize/2];
		elem.style.left = x + 'px';
		elem.style.top = y + 'px';
		elem.style.borderRadius = nee.orbsize + 'px';
		elem.style.height = nee.orbsize + 'px';
		elem.style.width = nee.orbsize + 'px';
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
new Feature(mm_climate, 1517/3000, 1872/3000, 'Eremor', 'https://upload.wikimedia.org/wikipedia/commons/f/f4/Kirthar_park.jpg',
	'Eremor is an interesting land...');

const nee = {
	/** the map will be 700 px wide */
	imgScale: 700,
	main(){
		// create mapmode buttons
		const mapmodeSelector = document.getElementById('mapmodes');
		MapMode.mapmodes.forEach(mode => mapmodeSelector.appendChild(mode.label));
		// select first mapmode
		MapMode.mapmodes[0].select();
		// select first feature
		Feature.features[0].select();
	},
	orbsize: 50,
};

nee.main();