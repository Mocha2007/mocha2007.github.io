/* exported LUNALIFE, LUNALIFE_LOADED */

const _1h = 60*60*1000;
const _1d = 24*_1h;
const _1w = 7*_1d;

class LunaEvent {
	constructor(date, title, desc = 0){
		/** @type {Date} */
		this.date = date;
		/** @type {string} */
		this.title = title;
		/** @type {string} */
		this[typeof desc === "number" ? "source" : "desc"] = desc;
	}
	get age(){
		const dy = this.date.getFullYear() - LunaEvent.epoch.getFullYear();
		return this.date.getMonth() === LunaEvent.epoch.getMonth()
			? LunaEvent.epoch.getDate() <= this.date.getDate() ? dy : dy - 1
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
// september 1st
// in book 1, halloween is on a wednesday. In the 2000s that only happens in 2001 and 2007.
const DOAWK_EPOCH = 2007;
LunaEvent.epoch = new Date(DOAWK_EPOCH-11, 0, 7);

const LUNALIFE = {
	BOOKS: [
		"???",
		"Diary of a Wimpy Kid",
	],
	CONFIG: {
		LIFESPAN: 18,
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
		// 4th grade
		new LunaEvent(new Date(DOAWK_EPOCH-1, 0), 'Manny starts calling Greg Bubby.', 1),
		// 5th grade
		new LunaEvent(new Date(DOAWK_EPOCH-1, 8, 1), 'In the fifth grade, the fastest runner is Ronnie McCoy.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH, 2, 20), 'The cheese falls onto the blacktop.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH, 3), 'Abe Hall gets the Cheese Touch.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH, 7), 'Abe moves away to California and takes the Cheese Touch with him.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH, 7), 'A couple of days into summer vacation, Rodrick wakes Greg up in the middle of the night, and tells Greg he slept through the whole summer.', 1),
		// 6th grade = book 1
		new LunaEvent(new Date(DOAWK_EPOCH, 8, 4), 'Greg gets his diary.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH, 8, 9), 'Manny draws a self-portrait on Greg\'s bedroom door in permanent marker.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH, 8, 14), 'Greg sneaks downstairs to listen to Rodrick\'s CD on the stereo in the family room.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH, 8, 17), 'Manny gets a hold of one of Rodrick\'s heavy metal magazines, and brings it into day care for show-and-tell.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH, 8, 21), 'Greg runs for treasurer.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH, 9, 1), 'Opening night of the Crossland High School haunted house.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH, 9, 6), 'Greg and Rowley make their OWN haunted house.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH, 9, 31), 'Greg and Rowley get chased by teenagers on halloween.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH, 10, 8), 'Mr. Underwood begins a wrestling unit for PE; Greg is paired with Fregley.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH, 10, 13), 'Students are wrestling everywhere.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH, 10, 17), 'Greg and Rowley try a makeshift weight-training program.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH, 10, 21), 'Greg fails a geography quiz.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH, 10, 23), 'Winter play tryouts.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH, 11, 10), 'Wizard of Oz play.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH, 11, 20), 'Greg and his mother go out to get a gift for the Giving Tree at church.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH, 11, 25), 'Greg celebrates christmas.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH, 11, 31), 'Greg makes Manny eat a "spider" (actually a ball of thread).', 1),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 0, 4), 'Greg knocks Rowley off the big wheel with a football.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 0, 7), 'Christmas break ends.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 0, 15), 'Greg has a new Independent Study course.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 0, 17), 'In school they have a general assembly and show the movie "It\'s Great to Be Me".', 1),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 0, 22), 'Greg joins the safety patrol.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 0, 23), 'It snows for the first time this winter.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 0, 31), 'Greg and Rowley make the first Zoo-Wee Mama comics.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 1, 7), '"Creighton the Curious" comic printed in the school paper.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 1, 27), 'Greg terrorizes the kindergarteners with a worm on a stick.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 2, 5), 'Rowley is suspended from the safety patrol.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 2, 11), 'Greg is suspended from the safety patrol.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 3, 4), 'Rowley has been hanging out with Collin Lee every day after school, so Greg has a sleepover with Fregley.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 3, 9), 'Greg aims to be class clown.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 4, 2), 'Greg\'s mother substitutes for his history teacher.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 4, 7), 'Zoo-Wee Mama is now in the school papers.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 4, 12), 'Greg and Rowley almost get into a fight, and the teenagers make them eat the cheese.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 5, 6), 'Greg and Rowley are friends again.', 1),
	],
	ZONE_CURRENT: 0,
	ZONES: [
		new LunaEvent(new Date(DOAWK_EPOCH, 8), 'Pre-books', '#444'),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 6), 'Diary of a Wimpy Kid', '#b00'),
		new LunaEvent(new Date(9e99, 0), 'Future', 'rgba(224, 192, 255, 0.15)'),
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
					td.title += `\n${THIS_EVENTS.map(e => `${e.dateString}: ${e.title} (source: ${this.BOOKS[e.source]})`).join('\n')}`;
					td.innerHTML = '+';
				}
			}
		}
		console.info('doawk.js ran successfully');
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