/* exported LUNALIFE, LUNALIFE_LOADED */

const _1d = 24*60*60*1000;
const _1w = 7*_1d;

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
		return Math.floor((this.date - LunaEvent.epoch)/_1w);
	}
	/** @param {number} wID */
	static fromWeekID(wID){
		return new Date(+LunaEvent.epoch + _1w*wID);
	}
}
LunaEvent.epoch = new Date(Date.UTC(1998, 3, 27, 13+7, 20));

const LUNALIFE = {
	CONFIG: {
		LIFESPAN: 91, // guess
		get DIM(){
			return Math.round(Math.sqrt(91 * 365.25 / 7));
		},
		get H(){
			return this.DIM;
		},
		get LEN(){
			return this.H * this.W;
		},
		get W(){
			return this.DIM;
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
		new LunaEvent('Death of my maternal grandfather (before my memories)', new Date(2000, 6, 17)),
		new LunaEvent('Roughly the time of my earliest memories', new Date(2003, 0)),
		new LunaEvent('(appx) I remember tossing my favorite stuffed animal into the air, and the tail falling off, and panicking.', new Date(2003, 1)), // appx
		new LunaEvent('(appx) Moved in to my childhood home', new Date(2003, 6)), // appx
		new LunaEvent('I remember getting SimCity 4: Deluxe edition for christmas and playing the game all the time. To this day I still occasionally play it!', new Date(2003, 11, 25)),
		new LunaEvent('I remember buying a copy of CotN (I think it was left discarded on a palette at Costco) and loving it.', new Date(2004, 10, 9)),
		new LunaEvent('(appx) dog died ;-;', new Date(2007, 0)), // appx
		new LunaEvent('By this point I was definitely obsessed with flash games. Today marks the release of Ocean Explorer, the earliest game from jmtb02 where I remember playing it on release.', new Date(2007, 8, 14)),
		new LunaEvent('Submachine 5 released - this is the game that first got me into the series!', new Date(2008, 0, 30)),
		new LunaEvent('About the time I got Spore (maybe as a christmas gift?). I was obsessed with this game for years.', new Date(2008, 11, 25)),
		new LunaEvent('Played Pokemon Platinum, the only Pokemon game I spent a lot of time on.', new Date(2009, 2, 22)),
		new LunaEvent('First hints of dysphoria', new Date(2009, 8, 7)),
		new LunaEvent('Some time between v6.5 and v7.1 I started playing Dan-Ball\'s powder game. I recall playing it a lot in middle school...', new Date(2009, 8, 11)),
		new LunaEvent('An earthquake hit San Diego on Easter, the strongest quake I experienced (about magnitude 5 at my location).', new Date(2010, 3, 4)),
		new LunaEvent('I got Civ5 for christmas and LOVED it, and only stopped playing once EU4 came out 3 years later.', new Date(2010, 11, 25)),
		new LunaEvent('Joined Youtube', new Date(2011, 0, 6)),
		new LunaEvent('Start conworlding (then, about Mochadia)', new Date(2011, 3, 22)),
		new LunaEvent('Join cult of bronydom', new Date(2011, 3, 30)),
		new LunaEvent('Joined Twitter (and then proceeded to never use it...)', new Date(2011, 4)),
		new LunaEvent('I started playing Minecraft in B1.8.1', new Date(2011, 8, 15)),
		new LunaEvent('I started playing Terraria shortly before 1.1, after watching SirEldricIV\'s Hardcore Saga LP series.', new Date(2011, 10)), // I played Terraria AFTER MC but before 1.1... so between Sep 15th and Dec 1st...
		new LunaEvent('Taught myself how to code (Python at the time)', new Date(2012, 0)), // appx
		new LunaEvent('Joined Cloudsdale', new Date(2012, 0, 7)), // appx
		new LunaEvent('I started playing KSP in 0.13.3', new Date(2012, 2, 3)),
		new LunaEvent('Observed the 2012 transit of Venus - my first memorable astronomical observation. I projected it onto a sheet of paper with binoculars and took some crude photos.', new Date(2012, 5, 5)),
		new LunaEvent('Met the one who would eventually be my BF', new Date(2012, 6)), // appx
		new LunaEvent('Moved across the country', new Date(2013, 5)),
		new LunaEvent('I started playing EU4, thus initiating my map game obsession', new Date(2013, 7, 13)),
		new LunaEvent('About the time I started consistently getting gender envy', new Date(2013, 8, 2)), // appx
		new LunaEvent('Joined Reddit after watching a CGPGrey video', new Date(2013, 8, 10)),
		new LunaEvent('Started playing KoL, which I was OBSESSED with in HS...', new Date(2013, 10, 27)),
		new LunaEvent('(appx) Started consciously questioning my gender', new Date(2014, 6)), // very rough estimate - must've been pre-Discord...
		new LunaEvent('Coming Out Simulator 2014 released. It was something I thought back to a lot when sorting out my identity.', new Date(2014, 6, 1)),
		new LunaEvent('Discovered Dwarf Fortress 0.40, which quickly became my favorite game EVER', new Date(2014, 6, 7)), // appx - I started playing IN 2014, but after 0.40 was released...
		new LunaEvent('Watched that vihart video on gender identity that made me question myself even more lmao', new Date(2015, 5, 8)), // https://www.youtube.com/watch?v=hmKix-75dsg
		new LunaEvent('Joined Discord after watching a JiggyWiggy video', new Date(2015, 10, 8)), // I was using it like maybe a month or two prior as well
		new LunaEvent('I started playing Rimworld in... I think... Alpha 13?', new Date(2016, 3, 6)),
		new LunaEvent('I started playing Stellaris on release. I remember being particularly excited for it, since I enjoyed other Paradox games, and was disappointed by the similar but worse Endless Space, released 4 years prior.', new Date(2016, 4, 9)),
		new LunaEvent('I started playing HOI4 on release. I remember trying HOI3 briefly and being excited HOI4 was just around the corner.', new Date(2016, 5, 6)),
		new LunaEvent('Migrated to Telegram from Kik', new Date(2016, 6, 4)),
		new LunaEvent('Realized I enjoyed the thought of being a woman', new Date(2016, 7, 29)), // appx. (date I joined PPP)
		new LunaEvent('I get mistaken for a trans man in a VC because "my voice sounded too feminine to be cis"... and somehow, that made me feel good :^)', new Date(2017, 4, 11)),
		new LunaEvent('Publish mocha2007.github.io', new Date(2017, 4, 16)), // https://github.com/Mocha2007/mocha2007.github.io/commit/4e1bbc0bc41c4f75681c539cd09e164594e6ba7c
		new LunaEvent('Observed totality of the Great American Eclipse in Greenville, SC.', new Date(2017, 7, 21)),
		new LunaEvent('First job (includes bonus moment where my egg almost cracked four years early!)', new Date(2017, 8)),
		new LunaEvent('Hurricane Michael knocked our power out for days, and kicked up probably the craziest storm I\'ve been through!', new Date(2018, 9, 11)),
		new LunaEvent('Started dating BF (online)', new Date(2019, 10, 24)),
		new LunaEvent('Met BF IRL first time', new Date(2020, 0, 24)),
		new LunaEvent('Almost died from Ehrlichia (and my bastard prof wouldn\'t let me redo my midterm...)', new Date(2020, 2, 3)),
		new LunaEvent('Tried on women\'s clothing for the first time... and liked it OwO', new Date(2020, 5, 1)), // it was after 4/1 before 8/1...
		new LunaEvent('Discovered TFGames :^)', new Date(2020, 10, 11)), // appx
		new LunaEvent('Had a moment at work where my egg almost cracked a couple months early!', new Date(2021, 10, 1)), // appx
		new LunaEvent('Went to MFF 2021 w/ BF, met a long-time online friend', new Date(2021, 11, 2)),
		new LunaEvent('Went to BRFF 2022 w/ BF', new Date(2022, 2, 10)),
		new LunaEvent('(appx) Egg Cracked', new Date(2022, 4)), // appx
		new LunaEvent('Observed my first lunar eclipse after two previous attempts thwarted by clouds!', new Date(2022, 4, 15)),
		new LunaEvent('Came out to BF', new Date(2022, 6, 15)),
		new LunaEvent('Discovered and binge-read Rain', new Date(2022, 9, 24)), // appx
		new LunaEvent('Came out to friends', new Date(2023, 0)), // appx
		new LunaEvent('Move in with BF', new Date(2023, 5, 14)), // appx
		new LunaEvent('After a bout of severe depression, I resolved to transition, and set up my first HRT appointment', new Date(2023, 6, 25)),
		new LunaEvent('Started HRT', new Date(2023, 7, 16)),
		new LunaEvent('Fully came out to everyone, started living as my true self 24/7', new Date(2023, 10, 10)), // appx
		new LunaEvent('Met BF\'s family', new Date(2023, 11, 16)),
		new LunaEvent('I plan to observe the 2024 Solar Eclipse in Texas.', new Date(2024, 3, 8)),
		new LunaEvent('If I am alive by this date, I could observe Halley\'s comet.', new Date(2061, 6, 28)),
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
		for (let i = 0; i < this.CONFIG.H; i++){
			const tr = document.createElement('tr');
			table.appendChild(tr);
			for (let j = 0; j < this.CONFIG.W; j++){
				const td = document.createElement('td');
				tr.appendChild(td);
				const WEEK_NUMBER = this.CONFIG.W*i + j;
				if (this.ZONES[this.ZONE_CURRENT].weekID < WEEK_NUMBER)
					this.ZONE_CURRENT++;
				// style!~
				td.title = this.ZONES[this.ZONE_CURRENT].title
					+ ',\nWeek of '
					+ LunaEvent.fromWeekID(WEEK_NUMBER).toDateString()
					+ ':\n--------------------';
				td.style.backgroundColor = this.ZONES[this.ZONE_CURRENT].desc;
				// check events
				const THIS_EVENTS = [];
				while (this.EVENT_CURRENT < this.EVENTS.length
						&& this.EVENTS[this.EVENT_CURRENT].weekID <= WEEK_NUMBER)
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