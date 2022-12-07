/* exported timeline */
/* global createSvgElement, getData, range, timelineTest */

class Period {
	constructor(datum){
		/** @type {string} */
		this.name = datum.name;
		/** @type {Date} */
		this.start = new Date(datum.start);
		/** @type {Date} */
		this.end = new Date(datum.end);
		/** @type {string} */
		this.href = datum.href;
		/** @type {string} */
		this.color = datum.color || timeline.default.color;
		/** @type {string} */
		this.borderColor = datum.borderColor || timeline.default.borderColor;
		/** @type {string} */
		this.textColor = datum.textColor || timeline.default.textColor;
		/** @type {Number} */
		this.forceY = datum.forceY;
		/** @type {Array} */
		this.insets = datum.insets || [];
	}
	get a(){
		if (this.a_cache)
			return this.a_cache;
		const e = createSvgElement('a');
		e.setAttribute('href', this.href);
		const text = createSvgElement('text');
		text.innerHTML = this.name;
		text.setAttribute('x', timeline.settings.textXOffset);
		text.setAttribute('y', timeline.settings.textYOffset);
		text.setAttribute('fill', this.textColor);
		e.appendChild(text);
		return this.a_cache = e;
	}
	get g(){
		if (this.g_cache)
			return this.g_cache;
		const e = createSvgElement('g');
		e.classList.add('period');
		e.appendChild(this.rect);
		this.insetRects.forEach(r => e.appendChild(r));
		e.appendChild(this.a);
		// pos
		const x = (this.start - timeline.settings.min) * timeline.settings.horizontalScale;
		const y = this.forceY || (this.id+1) * timeline.settings.elemHeight;
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
		e.setAttribute('stroke', this.borderColor);
		return this.rect_cache = e;
	}
	get insetRects(){
		if (this.insetRects_cache)
			return this.insetRects_cache;
		return this.rect_cache = this.insets.map(inset => {
			const e = createSvgElement('rect');
			const x = new Date(inset.start) - this.start;
			const range = new Date(inset.end) - new Date(inset.start);
			e.setAttribute('width', range * timeline.settings.horizontalScale);
			e.setAttribute('fill', inset.color || timeline.default.color);
			e.setAttribute('stroke', inset.borderColor || timeline.default.borderColor);
			e.setAttribute('x', x * timeline.settings.horizontalScale);
			e.setAttribute('rx', timeline.settings.insetBorderRadius);
			return e;
		});
	}
}

const timeline = {
	default: {
		color: 'silver',
		borderColor: 'white',
		textColor: 'black',
	},
	/** @type {Period[]} */
	periods: [],
	main(){
		/** @type {Array} */
		const timelineData = getData() || timelineTest;
		const start = this.settings.min = Math.min(...timelineData.map(o => new Date(o.start)));
		const end = this.settings.max = Math.max(...timelineData.map(o => new Date(o.end)));
		// process data
		timelineData.concat(this.rules(start, end))
			.forEach(datum => this.periods.push(new Period(datum)));
		// sort
		// this.periods.sort((a, b) => a.start - b.start);
		// background
		const bg = createSvgElement('rect');
		bg.id = 'bg';
		document.getElementById('canvas').appendChild(bg);
		// draw all
		this.periods.forEach(p => document.getElementById('canvas').appendChild(p.g));
	},
	/** create vertical rules every [interval]
	 * @param {number} start unix time
	 * @param {number} end unix time
	 * @param {number} interval in years
	 * @returns {Array}
	 */
	rules(start, end, interval = 10){
		const startYear = new Date(start).getFullYear();
		const endYear = new Date(end).getFullYear();
		const modifiedStartYear = Math.floor(startYear/interval)*interval;
		const modifiedEndYear = Math.ceil(endYear/interval)*interval;
		// markers
		return range(modifiedStartYear, modifiedEndYear, 10).map(i => {
			const p = {
				name: i,
				start: `1 January ${i}`,
				end: `2 January ${i}`,
				color: 'black',
				borderColor: 'white',
				textColor: 'white',
				href: `https://en.wikipedia.org/wiki/${i}`,
				forceY: 1,
			};
			return p;
		});
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
		insetBorderRadius: 0,
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