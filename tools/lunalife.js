/* exported LUNALIFE, LUNALIFE_LOADED */

const _1h = 60*60*1000;
const _1d = 24*_1h;
const _1w = 7*_1d;

class LunaEvent {
	constructor(date, title, desc = ''){
		/** @type {Date} */
		this.date = date;
		/** @type {string} */
		this.title = title;
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
		// round to nearest midnight to account for DST shifts
		// THEN div by 7...
		return Math.floor(Math.round((this.date - LunaEvent.epoch)/_1d) / 7);
	}
	/** @param {number} wID */
	static fromWeekID(wID){
		return new Date(+LunaEvent.epoch + _1w*wID + _1h); // 1h to account for DST
	}
}
LunaEvent.epoch = new Date(1998, 3, 27);

const LUNALIFE = {
	CONFIG: {
		LIFESPAN: 86, // median of tests
		/**
		 * 	80		https://www.annuity.org/retirement/planning/life-expectancy/calculator/
		 * 	81.4	https://www.seniorliving.org/research/life-expectancy/calculator/
		 * 	81.6	https://www.ssa.gov/cgi-bin/longevity.cgi
		 *  86		https://www.bankrate.com/retirement/life-expectancy-calculator/
		 * 	91		https://www.johnhancock.com/life-insurance/life-expectancy-calculator.html
		 * 	92		https://media.nmfn.com/tnetwork/lifespan/index.html#13
		 * 	94.3	https://calcuworld.com/health-calculators/life-expectancy-calculator/
		 */
		get DIM(){
			return Math.round(Math.sqrt(this.LIFESPAN * 365.25 / 7));
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
		new LunaEvent(new Date(2000, 0, 1), 'As the clock struck midnight on New Year\'s, a car, swerving to avoid an animal in the road, strikes a power box, knocking out power to our neighborhood. This freaky coincidence will be retold to me many times by my parents over the years.'),
		new LunaEvent(new Date(2000, 6, 17), 'Death of my maternal grandfather'),
		new LunaEvent(new Date(2001, 8, 11), '9/11 was happening as my mother was driving back from dropping me off at daycare. As she heard the events unfold on the radio, she decided to turn back and pick me up. I was too young to remember this, but if it happened, it happened...'),
		new LunaEvent(new Date(2003, 0), 'Roughly the time of my earliest memories'),
		new LunaEvent(new Date(2003, 1), '(appx) I remember tossing my favorite stuffed animal into the air, and the tail falling off, and panicking.'),
		new LunaEvent(new Date(2003, 6), '(appx) Moved in to my childhood home'),
		new LunaEvent(new Date(2003, 9, 26), 'Cedar Fire'), // c. 8 am
		new LunaEvent(new Date(2003, 11, 25), 'I remember getting SimCity 4: Deluxe edition for christmas and playing the game all the time. To this day I still occasionally play it!'),
		new LunaEvent(new Date(2004, 10, 9), 'I remember buying a copy of CotN (I think it was left discarded on a palette at Costco) and loving it.'),
		new LunaEvent(new Date(2007, 2), '(appx) Our dog died ;-;'),
		new LunaEvent(new Date(2007, 8, 14), 'By this point I was definitely obsessed with flash games. Today marks the release of Ocean Explorer, the earliest game from jmtb02 where I remember playing it on release.'),
		new LunaEvent(new Date(2007, 9, 21), 'Witch Fire'), // appx
		new LunaEvent(new Date(2008, 0, 30), 'Submachine 5 released - this is the game that first got me into the series!'),
		new LunaEvent(new Date(2008, 5, 9), 'Start of first period of regular journalling.'),
		new LunaEvent(new Date(2009, 2, 22), 'Played Pokemon Platinum, the only Pokemon game I spent a lot of time on.'),
		new LunaEvent(new Date(2009, 8, 11), 'Some time between v6.5 and v7.1 I started playing Dan-Ball\'s powder game. I recall playing it a lot in middle school...'),
		new LunaEvent(new Date(2009, 11), '(appx) First hints of dysphoria'),
		new LunaEvent(new Date(2010, 3, 4), 'An earthquake hit San Diego on Easter, the strongest quake I experienced (about magnitude 5 at my location).'),
		new LunaEvent(new Date(2010, 11, 20), '1/2 guinea pigs died ;-;'),
		new LunaEvent(new Date(2011, 0, 1), 'The other guinea pig died ;-;'),
		new LunaEvent(new Date(2011, 0, 6), 'Joined Youtube'),
		new LunaEvent(new Date(2011, 3, 22), 'Start conworlding (then, about Mochadia)'),
		new LunaEvent(new Date(2011, 3, 27), '(appx) I got Spore as a birthday gift. I was obsessed with this game for years.'),
		new LunaEvent(new Date(2011, 3, 30), 'Join cult of bronydom'),
		new LunaEvent(new Date(2011, 4), 'Joined Twitter (and then proceeded to never use it...)'),
		new LunaEvent(new Date(2011, 5, 13), 'End of first period of regular journalling.'),
		new LunaEvent(new Date(2011, 8, 15), 'I started playing Minecraft in B1.8.1', 'My first vid was Oct 19th, so before then, but after Sep 15th since that\'s when the update released.'),
		new LunaEvent(new Date(2011, 10), 'I started playing Terraria shortly before 1.1, after watching SirEldricIV\'s Hardcore Saga LP series.', 'I played Terraria AFTER MC but before 1.1... so between Sep 15th and Dec 1st...'),
		new LunaEvent(new Date(2011, 11, 25), 'I got Civ5 for christmas and LOVED it, and only stopped playing once EU4 came out a couple years later.'),
		new LunaEvent(new Date(2012, 0), '(appx) Taught myself how to code (Python at the time)'),
		new LunaEvent(new Date(2012, 2, 3), 'I started playing KSP in 0.13.3'),
		new LunaEvent(new Date(2012, 5, 5), 'Observed the 2012 transit of Venus - my first memorable astronomical observation. I projected it onto a sheet of paper with binoculars and took some crude photos.'),
		new LunaEvent(new Date(2013, 0, 28), '(appx) Joined Cloudsdale'),
		new LunaEvent(new Date(2013, 4), '(appx) Met K, my first and only long-term partner'),
		new LunaEvent(new Date(2013, 5, 23), 'Moved across the country'),
		new LunaEvent(new Date(2013, 7, 13), 'I started playing EU4, thus initiating my map game obsession'),
		new LunaEvent(new Date(2013, 8, 10), 'Joined Reddit after watching a CGPGrey video'),
		new LunaEvent(new Date(2013, 10, 27), 'Started playing KoL, which I was OBSESSED with in HS...'),
		new LunaEvent(new Date(2014, 0), '(appx) About the time I started learning JS'),
		new LunaEvent(new Date(2014, 0, 14), '(appx) Built my current, very old desktop.'),
		new LunaEvent(new Date(2014, 6), '(appx) Started consciously questioning my gender', 'very rough estimate - must\'ve been pre-Discord...'),
		new LunaEvent(new Date(2014, 6, 1), 'Coming Out Simulator 2014 released. It was something I thought back to a lot when sorting out my identity.'),
		new LunaEvent(new Date(2014, 6, 7), '(appx) Discovered Dwarf Fortress 0.40, which quickly became my favorite game EVER', 'I started playing IN 2014, but after 0.40 was released...'),
		new LunaEvent(new Date(2014, 8), '(appx) About the time I started consistently getting gender envy'),
		new LunaEvent(new Date(2015, 5, 8), 'Watched that vihart video on gender identity that made me question myself even more lmao', 'https://www.youtube.com/watch?v=hmKix-75dsg'),
		new LunaEvent(new Date(2015, 10, 8), 'Joined Discord after watching a JiggyWiggy video', 'I was using it like maybe a month or two prior as well'),
		new LunaEvent(new Date(2016, 3, 6), 'I started playing Rimworld in... I think... Alpha 13?'),
		new LunaEvent(new Date(2016, 4, 9), 'I started playing Stellaris on release. I remember being particularly excited for it, since I enjoyed other Paradox games, and was disappointed by the similar but worse Endless Space, released 4 years prior.'),
		new LunaEvent(new Date(2016, 5, 6), 'I started playing HOI4 on release. I remember trying HOI3 briefly and being excited HOI4 was just around the corner.'),
		new LunaEvent(new Date(2016, 6, 4), 'Migrated to Telegram from Kik'),
		new LunaEvent(new Date(2016, 7, 29), 'Realized I enjoyed the thought of being a woman', 'appx. (date I joined PPP)'),
		new LunaEvent(new Date(2016, 8, 16), 'Started coding mocha2007.github.io on or before this date, but only published it months later after accidentally deleting a good chunk of the repo.'),
		new LunaEvent(new Date(2017, 4, 11), 'I get mistaken for a trans man in a VC because "my voice sounded too feminine to be cis"... and somehow, that made me feel good :^)'),
		new LunaEvent(new Date(2017, 4, 16), 'Publish mocha2007.github.io', 'https://github.com/Mocha2007/mocha2007.github.io/commit/4e1bbc0bc41c4f75681c539cd09e164594e6ba7c'),
		new LunaEvent(new Date(2017, 7, 21), 'Observed totality of the Great American Eclipse in Greenville, SC.'),
		new LunaEvent(new Date(2017, 8), 'First job (includes bonus moment where my egg almost cracked four years early!)'),
		new LunaEvent(new Date(2017, 10, 28), 'Start of second period of regular journalling.'),
		new LunaEvent(new Date(2017, 11, 6), 'I stopped using IRC on this date.'),
		new LunaEvent(new Date(2018, 4, 16), 'End of second period of regular journalling.'),
		new LunaEvent(new Date(2018, 9), 'I started self-identifying as a femboy sometime prior to this date', 'I\'m shocked this sheet is as old as it is!'),
		new LunaEvent(new Date(2018, 9, 11), 'Hurricane Michael knocked our power out for days, and kicked up probably the craziest storm I\'ve been through!'),
		new LunaEvent(new Date(2018, 11, 4), 'SotE 0.1 released. I met a lot of my current friends through the "fanbase" (if it can be called that). Sadly, SotE died UwU.'),
		new LunaEvent(new Date(2019, 1, 22), '(appx) About the time I started learning C#'),
		new LunaEvent(new Date(2019, 3), '(appx) Briefly rejoined Cloudsdale before it shut down (thankfully, I\'m still in touch with folks!)'),
		new LunaEvent(new Date(2019, 10, 24), 'Started dating K (online)'),
		new LunaEvent(new Date(2020, 0, 24), 'Met K IRL first time'),
		new LunaEvent(new Date(2020, 2, 3), 'Almost died from Ehrlichia. I was convinced I was dying from this strange new disease brought over from China - Corona. Funnily enough, I was half right. Also, my bastard prof wouldn\'t let me redo my midterm...'),
		new LunaEvent(new Date(2020, 5), '(appx) Tried on women\'s clothing for the first time... and liked it OwO', 'it was after 4/1 before 8/1...'),
		new LunaEvent(new Date(2020, 10, 11), '(appx) Discovered TFGames :^)', 'Must\'ve been before Feb 28 2021 (per being log) and Apr 7 (per tracker sheet). File revision history suggests NLT Nov 11'),
		new LunaEvent(new Date(2021, 10), '(appx) Had a moment at work where my egg almost cracked a few months early!'),
		new LunaEvent(new Date(2021, 11, 2), 'Went to MFF 2021 w/ K, met a long-time online friend'),
		new LunaEvent(new Date(2022, 2, 10), 'Went to BRFF 2022 w/ K'),
		new LunaEvent(new Date(2022, 4), '(appx) Egg Cracked'),
		new LunaEvent(new Date(2022, 4, 15), 'Observed my first lunar eclipse after two previous attempts thwarted by clouds!'),
		new LunaEvent(new Date(2022, 4, 23), 'Tried (and failed) to secretly solicit female naming advice from my trans friends. Unsurprisingly, they all saw right through it. It probably didn\'t help I was the most obvious egg ever.'),
		new LunaEvent(new Date(2022, 6, 15), 'Came out to K'),
		new LunaEvent(new Date(2022, 7), '(appx) Came out to friends'),
		new LunaEvent(new Date(2022, 9, 25), 'Discovered and binge-read Rain'),
		new LunaEvent(new Date(2023, 5, 14), 'Moved in with K'),
		new LunaEvent(new Date(2023, 6, 25), 'After a bout of severe depression, I resolved to transition, and set up my first HRT appointment'),
		new LunaEvent(new Date(2023, 7, 16), 'Started HRT'),
		new LunaEvent(new Date(2023, 8, 15), 'Started laser treatments'),
		new LunaEvent(new Date(2023, 10, 6), 'Fully came out to everyone, started living as my true self 24/7'),
		new LunaEvent(new Date(2023, 11, 16), 'Met K\'s family'),
		new LunaEvent(new Date(2024, 2, 6), 'mówiła'),
		new LunaEvent(new Date(2024, 2, 21), 'I finally completed the process of legally changing my name!'),
		new LunaEvent(new Date(2024, 3, 8), 'I observed the 2024 Solar Eclipse in Oxford, Ohio.'),
		new LunaEvent(new Date(2024, 3, 28), 'Visited Cala in Tokyo'),
		new LunaEvent(new Date(2024, 4, 25), 'All legal documentation in new name acquired.'),
		new LunaEvent(new Date(2024, 5, 8), 'Started E injections'),
		new LunaEvent(new Date(2024, 6, 1), 'Visited Cala in Warsaw'),
		new LunaEvent(new Date(2024, 8, 27), 'End of Cala Warsaw Visit'),
		new LunaEvent(new Date(2024, 11, 9), 'laser done?'), // I will need to push L9 from 4 Sep to 30 Sep (+26 d), otherwise this would be Nov 13th...
		new LunaEvent(new Date(2026, 7, 16), 'Theoretically the effects of HRT should be largely complete by now.'),
		new LunaEvent(new Date(2028, 7, 16), 'Theoretically the effects of HRT should be totally complete by now.'),
		new LunaEvent(new Date(2048, 11, 4), 'If I am alive by this date, I will have been on HRT longer than not.'),
		new LunaEvent(new Date(2061, 6, 28), 'If I am alive by this date, I could observe Halley\'s comet.'),
	],
	ZONE_CURRENT: 0,
	ZONES: [
		new LunaEvent(new Date(2003, 0), 'Pre-Memory Era', '#444'), // 98-03
		new LunaEvent(new Date(2004, 8, 7), 'Early Childhood', '#666'), // 03-04
		new LunaEvent(new Date(2009, 8, 8), 'Elementary School', '#00c'), // 04-09 CONFIRMED (Steve Irwin's death, arson)
		new LunaEvent(new Date(2012, 8, 4), 'Middle School', '#408'), // 09-12 START CONFIRMED (MJ's death)
		new LunaEvent(new Date(2015, 7), 'High School', '#608'), // 12-15 END CONFIRMED (I just know it)
		new LunaEvent(new Date(2017, 7), 'College', '#c0c'), // 15-17
		new LunaEvent(new Date(2018, 7), 'Gap Year', '#808'), // 17-18
		new LunaEvent(new Date(2020, 4, 7), 'College', '#c0c'), // 18-20
		new LunaEvent(new Date(2023, 7, 16), '"""Manhood"""', '#c8c'), // 20-23
		new LunaEvent(new Date(), 'Womanhood', '#f4c'),
		new LunaEvent(new Date(9e99), 'Future', 'rgba(224, 192, 255, 0.15)'),
	],
	/** converting the class to the new order... */
	convert(){
		const s = this.EVENTS.concat(this.ZONES)
			.map(e => {
				// eslint-disable-next-line max-len
				let partial = `new LunaEvent(new Date(${e.date.getFullYear()}, ${e.date.getMonth()}, ${e.date.getDate()}), '${e.title}'`;
				if (e.desc)
					partial += `, '${e.desc}'`;
				return partial + ')';
			})
			.join(',\n');
		console.debug(s);
	},
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
					+ ' (#'
					+ WEEK_NUMBER
					+ '):\n--------------------';
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
		// warnings
		this.verify();
	},
	verify(){
		// make sure events are in order
		this.EVENTS.forEach((event, i, a) => {
			if (i+1 < a.length && a[i+1].date < event.date)
				console.warn(`Event ${i} (${event.title}) out of order!`);
		});
	},
};

const LUNALIFE_LOADED = true;