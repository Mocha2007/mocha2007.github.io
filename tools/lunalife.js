/* exported LUNALIFE, LUNALIFE_LOADED */

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
	ZONE_CURRENT: 0,
	ZONES: [
		['Early Childhood', 332, '#000'], // 98-04
		['Elementary School', 593, '#00c'], // 04-09
		['Middle School', 749, '#408'], // 09-12
		['High School', 896, '#60f'], // 12-15
		['(Gap Year)', 953, '#808'], // 15-16
		['College', 1149, '#c0c'], // 16-20
		['Manhood', 1320, '#c8c'], // 20-23
		['Womanhood', (new Date() - Date.UTC(1998, 3, 27, 13+7, 20))/(7*24*60*60*1000), '#84f'],
		['Future', Infinity, '#ecf'],
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
				if (this.ZONES[this.ZONE_CURRENT][1] < WEEK_NUMBER)
					this.ZONE_CURRENT++;
				// style!~
				td.title = this.ZONES[this.ZONE_CURRENT][0];
				td.style.backgroundColor = this.ZONES[this.ZONE_CURRENT][2];
			}
		}
		console.info('lunalife.js ran successfully');
	},
};

const LUNALIFE_LOADED = true;