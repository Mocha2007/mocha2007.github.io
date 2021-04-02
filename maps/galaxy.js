/* global data, ly, mod, pi, proper, round, unitString */
/* exported main */
'use strict';

/** @type {HTMLBodyElement} */
const canvas = document.getElementById('canvas');
let [xIndex, yIndex, zIndex] = [1, 0, 2];
const rotations = [
	[1, 0, 2],
	[2, 1, 0],
	[0, 2, 1],
];
let altitude = false;
const colors = {
	'dwarf galaxy': 'rgba(192, 192, 192, 0.5)',
	'galaxy': 'rgba(170, 170, 255, 0.5)',
	'globular cluster': '#FC9',
	'emission nebula': 'pink',
	'moving group': '#DEC',
	'open cluster': '#CFF',
	'planetary nebula': '#a0d8a0',
	'reflection nebula': 'lightblue',
	'star': '#FFFFC0',
	'star cloud': '#ACC',
	'stellar association': '#CDB',
	'sun': '#FCC857',
	'supernova remnant': '#9C8AE4',
};

class Coords {
	/**
	 * @param {number} ra in radians
	 * @param {number} dec in radians
	 */
	constructor(ra, dec){
		this.ra = ra;
		this.dec = dec;
	}
	get galactic(){ // CONFIRMED CORRECT
		// https://en.wikipedia.org/wiki/Galactic_coordinate_system
		const alphaG = 192.85948*pi/180;
		const deltaG = 27.12825*pi/180;
		const lNCP = 122.93192*pi/180;
		const lat = Math.asin(
			Math.sin(this.dec)*Math.sin(deltaG)
			+ Math.cos(this.dec)*Math.cos(deltaG)
			* Math.cos(this.ra - alphaG)
		);
		// Wikipedia's formulas don't work so I used this
		// https://www.atnf.csiro.au/people/Tobias.Westmeier/tools_coords.php
		const long = lNCP - Math.atan2(
			Math.cos(this.dec) * Math.sin(this.ra - alphaG),
			Math.sin(this.dec)*Math.cos(deltaG)
				- Math.cos(this.dec)*Math.sin(deltaG)
				* Math.cos(this.ra - alphaG)
		);
		return [lat, long];
	}
	/**
	 * @param {number} ra1 hours
	 * @param {number} ra2 minutes
	 * @param {number} ra3 seconds
	 * @param {number} dec1 degrees
	 * @param {number} dec2 arcminutes
	 * @param {number} dec3 arcseconds
	 */
	static fromThreeThree(ra1, ra2, ra3, dec1, dec2, dec3){
		// 17h 45m 40.0409s; −29° 0′ 28.118″
		const ra = ra1/12*pi + ra2/720*pi + ra3/43200*pi;
		const s = dec1 ? Math.sign(dec1)
			: dec2 ? Math.sign(dec2) : 1;
		const dec = dec1/180*pi + s*dec2/10800*pi + s*dec3/648e3*pi;
		return new Coords(ra, dec);
	}
}

class Body {
	/**
	 * @param {string} name
	 * @param {string} type
	 * @param {number} dist
	 * @param {Coords} coords
	 * @param {string} desc
	 * @param {string} img
	 * @param {string} href
	 */
	constructor(name, type, dist, coords, desc='', img='', href='', radius=0){
		this.name = name;
		this.type = type;
		this.dist = dist;
		this.coords = coords;
		this.desc = desc;
		this.img = img;
		this.href = href ? href : 'https://en.wikipedia.org/wiki/' + this.name;
		this.radius = radius;
		Body.list.push(this);
	}
	get altitudeDiv(){
		const div = document.createElement('div');
		div.classList.add('altitude');
		[div.style.left, div.style.top] = this.divCoords;
		const h = -45*this.galacticXYZ[zIndex]/Game.scale;
		const hs = `${h}vh`;
		if (h < 0){
			div.style.top = `calc(${div.style.top} + ${hs})`;
			div.style.height = `${-h}vh`;
			console.debug(div.style.height);
		}
		else
			div.style.height = hs;
		return div;
	}
	get color(){
		return colors[this.type] ? colors[this.type] : 'white';
	}
	get descDiv(){
		const div = document.createElement('p');
		div.classList.add('desc');
		div.innerHTML = this.desc;
		return div;
	}
	get divSize(){
		return Math.max(5, this.radius/Game.scale*window.innerHeight);
	}
	get divCoords(){
		const gc = this.galacticXYZ;
		const x = gc[xIndex]/Game.scale;
		let y = gc[yIndex]/Game.scale;
		if (altitude)
			y += gc[zIndex]/Game.scale;
		return [
			`calc(50% + ${45*x}vh)`,
			`calc(50% + ${45*y}vh)`,
		];
	}
	/** @returns {[number, number, number]} xyz coords */
	get galacticXYZ(){
		// https://en.wikipedia.org/wiki/Spherical_coordinate_system#Cartesian_coordinates
		// dec = up-down; ra = left-right
		const [dec, ra] = this.coords.galactic;
		return [
			this.dist * Math.cos(dec) * Math.cos(ra),
			this.dist * Math.cos(dec) * Math.sin(ra),
			this.dist * Math.sin(dec),
		];
	}
	get tooltip(){
		const tt = document.createElement('div');
		const coords = [window.event.clientY, window.event.clientX];
		tt.style.backgroundColor = this.color;
		tt.style.top = coords[0]-25 + 'px';
		tt.style.left = coords[1]+25 + 'px';
		tt.style.position = 'fixed';
		// text
		tt.innerHTML = '<h1>' + this.name + '</h1><h2>' + proper(this.type) + '</h2>';
		if (this.img)
			tt.innerHTML += '<img src="'+this.img+'" height="100px">';
		tt.innerHTML += `<br>RA: ${round(this.coords.ra/pi*180, 2)}&deg;<br>
		DEC: ${round(this.coords.dec/pi*180, 2)}&deg;<br>
		DIST: ${unitString(this.dist/ly, 'ly')}`;
		tt.appendChild(this.descDiv);
		return tt;
	}
	createElement(){
		// don't render bodies close
		if (2*Math.max(window.innerHeight, window.innerWidth) < this.divSize)
			return;
		const a = document.createElement('a');
		a.href = this.href;
		// altitude
		if (altitude)
			a.appendChild(this.altitudeDiv);
		const div = document.createElement('div');
		div.classList.add('datum');
		const s = this.divSize/2;
		[div.style.left, div.style.top] = this.divCoords.map(x => `calc(${x} - ${s}px)`);
		div.style.height = div.style.width = `${this.divSize}px`;
		div.style.backgroundColor = this.color;
		this.element = div;
		// tooltip
		div.onmouseover = () => document.getElementById('tooltip').appendChild(this.tooltip);
		div.onmouseout = () => document.getElementById('tooltip').innerHTML = '';
		// end
		a.appendChild(div);
		canvas.appendChild(a);
	}
	/** @param {string} s */
	static fromName(s){
		return Body.list.find(b => b.name === s);
	}
	static fromObject(o){
		new Body(
			o.name,
			o.type,
			o.dist,
			Coords.fromThreeThree(...o.ra, ...o.dec),
			o.desc,
			o.img,
			o.href,
			o.radius
		);
	}
}
/** @type {Body[]} */
Body.list = [];

const Game = {
	keybinds: {
		'=': () => Game.zoom(1), // unshifted +
		'+': () => Game.zoom(1),
		'-': () => Game.zoom(-1),
		'q': () => Game.rotate(-1),
		'e': () => Game.rotate(1),
		'z': () => Game.toggleAltitude(),
		// todo controls
		// ? => about
		// m => mapmode toggle
		// federation/klingon control mode? lol
	},
	scale: 32768*ly,
	redraw(){
		canvas.innerHTML = '';
		Body.list.forEach(b => b.createElement());
	},
	rotate(direction=0){
		const i = mod(rotations.map(x => x[0]).indexOf(xIndex) + direction, rotations.length);
		[xIndex, yIndex, zIndex] = rotations[i];
		this.redraw();
	},
	toggleAltitude(){
		altitude = !altitude;
		this.redraw();
	},
	/** @param {number} factor - 1=in; -1=out; 0=no change */
	zoom(factor=0){
		this.scale *= Math.pow(2, -factor);
		this.redraw();
		document.getElementById('scale').innerHTML = unitString(2*this.scale/ly, 'ly');
	},
};

function main(){
	// reverse to draw closer objects later
	data.reverse().forEach(o => Body.fromObject(o));
	Game.zoom();
	// set up keybinds
	document.addEventListener('keydown', event => {
		if (Game.keybinds[event.key]){
			Game.keybinds[event.key]();
		}
	});
}