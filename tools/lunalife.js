/* exported LUNALIFE, LUNALIFE_LOADED */

class LunaEvent {
	constructor(title, date, desc = ''){
		/** @type {string} */
		this.title = title;
		/** @type {Date} */
		this.date = date;
		/** @type {string} */
		this.desc = desc;
	}
	get weekID(){
		return Math.floor((this.date - LunaEvent.epoch)/(7*24*60*60*1000));
	}
}
LunaEvent.epoch = Date.UTC(1998, 3, 27, 13+7, 20);

const LUNALIFE = {
	CONFIG: {
		LIFESPAN: 91, // guess
		get DIM(){
			return Math.round(Math.sqrt(91 * 365.25 / 7));
		},
		get LEN(){
			return this.DIM * this.DIM;
		},
	},
	ELEM: {
		/** @returns {HTMLDivElement} */
		get CONTAINER(){
			return document.getElementById('container');
		},
	},
	EVENT_CURRENT: 0,
	EVENTS: [
		new LunaEvent('Started HRT', new Date(2023, 7, 16)),
	],
	ZONE_CURRENT: 0,
	ZONES: [
		new LunaEvent('Early Childhood', new Date(2004, 8, 6), '#444'), // 98-04
		new LunaEvent('Elementary School', new Date(2009, 8, 7), '#00c'), // 04-09
		new LunaEvent('Middle School', new Date(2012, 8, 3), '#408'), // 09-12
		new LunaEvent('High School', new Date(2015, 5, 20), '#60f'), // 12-15
		new LunaEvent('(Gap Year)', new Date(2016, 7, 1), '#808'), // 15-16
		new LunaEvent('College', new Date(2020, 4, 7), '#c0c'), // 16-20
		new LunaEvent('Manhood', new Date(2023, 7, 16), '#c8c'), // 20-23
		new LunaEvent('Womanhood', new Date(), '#84f'),
		new LunaEvent('Future', new Date(9e99), '#ecf'),
	],
	main(){
		// construct table
		this.ELEM.CONTAINER.innerHTML = '';
		const table = document.createElement('table');
		this.ELEM.CONTAINER.appendChild(table);
		for (let i = 0; i < this.CONFIG.DIM; i++){
			const tr = document.createElement('tr');
			table.appendChild(tr);
			for (let j = 0; j < this.CONFIG.DIM; j++){
				const td = document.createElement('td');
				tr.appendChild(td);
				const WEEK_NUMBER = this.CONFIG.DIM*i + j;
				if (this.ZONES[this.ZONE_CURRENT].weekID < WEEK_NUMBER)
					this.ZONE_CURRENT++;
				// style!~
				td.title = this.ZONES[this.ZONE_CURRENT].title;
				td.style.backgroundColor = this.ZONES[this.ZONE_CURRENT].desc;
				// check events
				const THIS_EVENTS = [];
				while (this.EVENT_CURRENT < this.EVENTS.length
						&& this.EVENTS[this.EVENT_CURRENT].weekID < WEEK_NUMBER)
					THIS_EVENTS.push(this.EVENTS[this.EVENT_CURRENT++]);
				if (THIS_EVENTS.length){
					td.title += `\n${THIS_EVENTS.map(e => e.date.toDateString() + ': ' + e.title).join('\n')}`;
					td.innerHTML = '+';
				}
			}
		}
		console.info('lunalife.js ran successfully');
	},
};

const LUNALIFE_LOADED = true;