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
	get age(){
		const dy = this.date.getFullYear() - LunaEvent.epoch.getFullYear();
		return this.date.getMonth() === 3
			? 27 <= this.date.getDate() ? dy : dy - 1
			: this.date.getMonth() < 3 ? dy - 1 : dy;
	}
	get dateString(){
		return `${this.date.toDateString()} (${this.age} years old)`;
	}
	get weekID(){
		return Math.floor((this.date - LunaEvent.epoch)/(7*24*60*60*1000));
	}
}
LunaEvent.epoch = new Date(Date.UTC(1998, 3, 27, 13+7, 20));

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
		new LunaEvent('Roughly the time of my earliest memories', new Date(2003, 0)),
		new LunaEvent('First hints of dysphoria', new Date(2009, 8, 7)),
		new LunaEvent('Joined Youtube', new Date(2011, 0, 6)),
		new LunaEvent('Start conworlding (then, about Mochadia)', new Date(2011, 3, 22)),
		new LunaEvent('Join cult of bronydom', new Date(2011, 3, 30)),
		new LunaEvent('Joined Twitter (and then proceeded to never use it...)', new Date(2011, 4)),
		new LunaEvent('Taught myself how to code (Python at the time)', new Date(2012, 0, 1)), // appx
		new LunaEvent('Joined Cloudsdale', new Date(2012, 0, 7)), // appx
		new LunaEvent('Met the one who would eventually be my BF', new Date(2012, 6, 1)), // appx
		new LunaEvent('Moved across the country', new Date(2013, 5)),
		new LunaEvent('About the time I started consistently getting gender envy', new Date(2013, 8, 2)), // appx
		new LunaEvent('Joined Reddit after watching a CGPGrey video', new Date(2013, 8, 10)),
		new LunaEvent('Started playing KoL, which I was OBSESSED with in HS...', new Date(2013, 10, 27)),
		new LunaEvent('Started consciously questioning my gender', new Date(2014, 6, 1)), // very rough estimate - must've been pre-Discord...
		new LunaEvent('Discovered Dwarf Fortress, which quickly became my favorite game EVER', new Date(2014, 6, 7)), // appx
		new LunaEvent('Watched that vihart video on gender identity that made me question myself even more lmao', new Date(2015, 5, 8)), // https://www.youtube.com/watch?v=hmKix-75dsg
		new LunaEvent('Joined Discord after watching a JiggyWiggy video', new Date(2015, 10, 8)), // I was using it like maybe a month or two prior as well
		new LunaEvent('Migrated to Telegram from Kik', new Date(2016, 6, 4)),
		new LunaEvent('Realized I enjoyed the thought of being a woman', new Date(2016, 7, 29)), // appx. (date I joined PPP)
		new LunaEvent('I get mistaken for a trans man in a VC because "my voice sounded too feminine to be cis"... and somehow, that made me feel good :^)', new Date(2017, 4, 11)),
		new LunaEvent('Publish mocha2007.github.io', new Date(2017, 4, 16)), // https://github.com/Mocha2007/mocha2007.github.io/commit/4e1bbc0bc41c4f75681c539cd09e164594e6ba7c
		new LunaEvent('First job (includes bonus moment where my egg almost cracked four years early!)', new Date(2017, 8)),
		new LunaEvent('Started dating BF (online)', new Date(2019, 10, 24)),
		new LunaEvent('Met BF IRL first time', new Date(2020, 0, 24)),
		new LunaEvent('Almost died from Ehrlichia (and my bastard prof wouldn\'t let me redo my midterm...)', new Date(2020, 2, 3)),
		new LunaEvent('Tried on women\'s clothing for the first time... and liked it OwO', new Date(2020, 5, 1)), // it was after 4/1 before 8/1...
		new LunaEvent('Discovered TFGames :^)', new Date(2020, 10, 11)), // appx
		new LunaEvent('Had a moment at work where my egg almost cracked a couple months early!', new Date(2021, 10, 1)), // appx
		new LunaEvent('Went to MFF 2021 w/ BF, met a long-time online friend', new Date(2021, 11, 2)),
		new LunaEvent('Went to BRFF 2022 w/ BF', new Date(2022, 2, 10)),
		new LunaEvent('Egg Cracked', new Date(2022, 4)), // appx
		new LunaEvent('Came out to BF', new Date(2022, 6, 15)),
		new LunaEvent('Discovered and binge-read Rain', new Date(2022, 9, 24)), // appx
		new LunaEvent('Came out to friends', new Date(2023, 0)), // appx
		new LunaEvent('Move in with BF', new Date(2023, 5, 14)), // appx
		new LunaEvent('After a bout of severe depression, I resolved to transition, and set up my first HRT appointment', new Date(2023, 6, 25)),
		new LunaEvent('Started HRT', new Date(2023, 7, 16)),
		new LunaEvent('Fully came out to everyone, started living as my true self 24/7', new Date(2023, 10, 10)), // appx
		new LunaEvent('Met BF\'s family', new Date(2023, 11, 16)),
	],
	ZONE_CURRENT: 0,
	ZONES: [
		new LunaEvent('Early Childhood', new Date(2004, 8, 7), '#444'), // 98-04
		new LunaEvent('Elementary School', new Date(2009, 8, 7), '#00c'), // 04-09 CONFIRMED (Steve Irwin's death, arson)
		new LunaEvent('Middle School', new Date(2012, 8, 4), '#408'), // 09-12 START CONFIRMED (MJ's death)
		new LunaEvent('High School', new Date(2015, 5, 20), '#60f'), // 12-15 END CONFIRMED (I just know it)
		new LunaEvent('Gap Year', new Date(2016, 7, 1), '#808'), // 15-16
		new LunaEvent('College', new Date(2020, 4, 7), '#c0c'), // 16-20
		new LunaEvent('"""Manhood"""', new Date(2023, 7, 16), '#c8c'), // 20-23
		new LunaEvent('Womanhood', new Date(), '#f4c'),
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
					td.title += `\n${THIS_EVENTS.map(e => e.dateString + ': ' + e.title).join('\n')}`;
					td.innerHTML = '+';
				}
			}
		}
		console.info('lunalife.js ran successfully');
	},
};

const LUNALIFE_LOADED = true;