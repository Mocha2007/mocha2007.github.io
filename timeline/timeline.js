/* exported timeline */
/* global createSvgElement, timelineData */

class Period {
	/**
	 * @param {string} name
	 * @param {string} start
	 * @param {string} end
	 * @param {string} href
	 * @param {string} color
	 */
	constructor(name, start, end, href, color){
		this.name = name;
		this.start = new Date(start);
		this.end = new Date(end);
		this.href = href;
		this.color = color;
	}
	get a(){
		if (this.a_cache)
			return this.a_cache;
		const e = createSvgElement('a');
		e.setAttribute('xlink:href', this.href);
		const text = createSvgElement('text');
		text.innerHTML = this.name;
		text.setAttribute('x', timeline.settings.textXOffset);
		text.setAttribute('y', timeline.settings.textYOffset);
		e.appendChild(text);
		return this.a_cache = e;
	}
	get g(){
		if (this.g_cache)
			return this.g_cache;
		const e = createSvgElement('g');
		e.classList.add('period');
		e.appendChild(this.rect);
		e.appendChild(this.a);
		// pos
		const x = (this.start - timeline.settings.min) * timeline.settings.horizontalScale;
		const y = this.id * timeline.settings.elemHeight;
		e.setAttribute('transform', `translate(${x},${y})`);
		return this.g_cache = e;
	}
	get id(){
		return timeline.periods.indexOf(this);
	}
	get img(){
		return undefined; // todo
	}
	get range(){
		return this.end - this.start;
	}
	get rect(){
		if (this.rect_cache)
			return this.rect_cache;
		const e = createSvgElement('rect');
		e.setAttribute('width', this.range * timeline.settings.horizontalScale);
		e.setAttribute('fill', this.color);
		return this.rect_cache = e;
	}
}

const timeline = {
	/** @type {Period[]} */
	periods: [],
	main(){
		// process data
		timelineData.forEach(datum => {
			const p = new Period(datum.name, datum.start, datum.end, datum.href, datum.color);
			this.periods.push(p);
			// get min/max data
			if (p.start < this.settings.min)
				this.settings.min = +p.start;
			if (this.settings.max < p.end)
				this.settings.max = +p.end;
		});
		// sort
		this.periods.sort((a, b) => a.start - b.start);
		// background
		const bg = createSvgElement('rect');
		bg.id = 'bg';
		document.getElementById('canvas').appendChild(bg);
		// draw all
		this.periods.forEach(p => document.getElementById('canvas').appendChild(p.g));
	},
	settings: {
		get elemHeight(){
			return 20;
			// return window.getComputedStyle(document.querySelector('rect')).height;
		},
		height: 1080,
		get horizontalScale(){
			return this.width / this.range;
		},
		min: Infinity,
		max: -Infinity,
		get range(){
			return this.max - this.min;
		},
		textXOffset: 5,
		textYOffset: 15,
		width: 1920,
	},
};