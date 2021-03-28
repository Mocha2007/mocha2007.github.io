/* global data, ly, pi, proper */
/* exported main */
'use strict';

/** @type {HTMLBodyElement} */
const canvas = document.getElementById('canvas');
const [xIndex, yIndex] = [0, 2];

class Coords {
	/**
	 * @param {number} ra in radians
	 * @param {number} dec in radians
	 */
	constructor(ra, dec){
		this.ra = ra;
		this.dec = dec;
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
		const s = Math.sign(dec1);
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
	constructor(name, type, dist, coords, desc='', img='', href=''){
		this.name = name;
		this.type = type;
		this.dist = dist;
		this.coords = coords;
		this.desc = desc;
		this.img = img;
		this.href = href ? href : 'https://en.wikipedia.org/wiki/' + this.name;
		Body.list.push(this);
	}
	get color(){
		const colors = {
			'emission nebula': 'pink',
			'open cluster': '#CFF',
			'star': '#FFFFC0',
			'sun': '#FCC857',
			'supernova remnant': '#9C8AE4',
		};
		return colors[this.type] ? colors[this.type] : 'white';
	}
	/** @returns {[number, number, number]} xyz coords */
	get galacticCoords(){
		// set sgra_'s coords to ZERO ZERO
		const sgra_ = Body.fromName('Sgr A*');
		const ra_ = this.coords.ra - sgra_.coords.ra;
		const dec_ = this.coords.dec - sgra_.coords.dec;
		return [
			this.dist * Math.sin(ra_) * Math.cos(dec_),
			this.dist * Math.sin(ra_) * Math.sin(dec_),
			this.dist * Math.cos(ra_),
		];
	}
	get tooltip(){
		const tt = document.createElement('div');
		const coords = [window.event.clientY, window.event.clientX];
		tt.id = 'current_tooltip';
		tt.style.backgroundColor = this.color;
		tt.style.top = coords[0]-25 + 'px';
		tt.style.left = coords[1]+25 + 'px';
		tt.style.position = 'fixed';
		// text
		tt.innerHTML = '<center><b>' + this.name + '</b></center>' + proper(this.type);
		if (this.img)
			tt.innerHTML += '<center><img src="'+this.img+'" height="100px"></center>';
		if (this.desc)
			tt.innerHTML += this.desc;
		return tt;
	}
	createElement(){
		const a = document.createElement('a');
		a.href = this.href;
		const div = document.createElement('div');
		div.classList.add('datum');
		const gc = this.galacticCoords;
		const x = gc[xIndex]/Body.maxDim;
		const y = gc[yIndex]/Body.maxDim;
		console.debug(x, y);
		div.style.left = `calc(50% + ${45*x}%)`;
		div.style.top = `calc(50% + ${45*y}%)`;
		div.style.backgroundColor = this.color;
		this.element = div;
		// tooltip
		div.onmouseover = () => document.getElementById('tooltip').appendChild(this.tooltip);
		div.onmouseout = () => document.getElementById('current_tooltip').outerHTML = '';
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
			o.href
		);
	}
}
/** @type {Body[]} */
Body.list = [];

function main(){
	data.forEach(o => Body.fromObject(o));
	Body.maxDim = Math.max(...Body.list.map(b =>
		Math.max(Math.abs(b.galacticCoords[xIndex]), Math.abs(b.galacticCoords[yIndex]))
	));
	Body.list.forEach(b => b.createElement());
	const sgra_ = Body.fromName('Sgr A*');
	const disk = document.getElementById('galacticDisk');
	const scale = 45/Body.maxDim;// %/m
	const size = 2*52850*ly*scale;
	disk.style.paddingLeft = disk.style.height = size + '%';
	disk.style.left = `calc(50% - ${size/2}%)`;
	disk.style.top = `calc(50% + ${sgra_.dist*scale-size/2}%)`;
}