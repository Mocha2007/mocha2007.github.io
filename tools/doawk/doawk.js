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
			: this.date.getMonth() < LunaEvent.epoch.getMonth() ? dy - 1 : dy;
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
// per Dog Days, his birthday is during late June. I use the last sunday of June as a guess.
LunaEvent.epoch = new Date(DOAWK_EPOCH-11, 5, 30);
const RODRICK_AGE_GAP = 5; // In book 2, Rodrick is either a junior or senior, because his sophomore year is referred to in the past tense. thus he must be 16-18 years old
const MANNY_AGE_GAP = 8; // "I'm onwy thwee" when Greg is in 6th grade

const LUNALIFE = {
	BOOKS: [
		"???",
		"Diary of a Wimpy Kid",
		"Rodrick Rules",
		"The Last Straw",
		"Dog Days",
		"The Ugly Truth",
		"Cabin Fever",
		"The Third Wheel",
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
		new LunaEvent(LunaEvent.epoch, 'Greg is born 3 weeks early. At birth he is 5 lb., 7 oz.', 7),
		new LunaEvent(new Date(+LunaEvent.epoch+_1w), 'Greg meets his older brother Rodrick a few days after he is born.', 7),
		new LunaEvent(new Date(DOAWK_EPOCH-7, 0), 'According to Greg\'s mother, Holly Hills was the only preschooler in her class that wasn\'t potty trained.', 3),
		new LunaEvent(new Date(DOAWK_EPOCH-7, 0), 'In preschool, Greg wouldn\'t actually clean toys up.', 4),
		new LunaEvent(new Date(DOAWK_EPOCH-6, 0), 'Greg\'s parents go off on a vacation and leave his grandfather to watch over them, leaving behind a manual on how to take care of Greg and Rodrick.', 5),
		new LunaEvent(new Date(DOAWK_EPOCH-6, 11), 'Greg and Rodrick visit Santa\'s village.', 5),
		new LunaEvent(new Date(DOAWK_EPOCH-5, 5, 30), 'Greg gets a magic set for his sixth birthday.', 6),
		// exact time unknown, happened when he was 6
		new LunaEvent(new Date(DOAWK_EPOCH-5, 6), 'Greg gets mad his grandmother won\'t give him any ice cream before dinner, so writes a note saying he hates her.', 2),
		new LunaEvent(new Date(DOAWK_EPOCH-RODRICK_AGE_GAP, 8), 'When Rodrick was in middle school, he had a seventeen-year-old girl from Holland as his pen pal.', 2),
		new LunaEvent(new Date(DOAWK_EPOCH-4, 11, 25), 'Greg receives a doll, Alfrendo, for christmas from his mother to "practice taking care of Manny" when he\'s born.', 1),
		// exact time unknown
		new LunaEvent(new Date(DOAWK_EPOCH-3, 0), 'Manny is born.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH-3, 0), 'Gammie gives the Heffleys a "spoon carousel" "five or six" years ago. Since this time, the only foreign country they visit is Canada.', 6),
		new LunaEvent(new Date(DOAWK_EPOCH-3, 6), 'Rodrick convinces Greg to jump off the diving board in the deep end of the pool.', 4),
		new LunaEvent(new Date(DOAWK_EPOCH-3, 7), 'When Greg was 8, he borrowed a book from the library, and forgot it behind his desk.', 4),
		new LunaEvent(new Date(DOAWK_EPOCH-2, 0), 'Greg\'s mom knits a blue blanket, Tingy, for Manny\'s first birthday.', 3),
		// this event acutually has an illustration with an exact date
		new LunaEvent(new Date(DOAWK_EPOCH-2, 2, 25), 'Greg has a bedwetting calendar when he was eight years old.', 6),
		// this happened two years before Manny can speak
		new LunaEvent(new Date(DOAWK_EPOCH-2, 8), 'Greg throws a rock through the sliding glass door, but won\'t get caught for another two years.', 2),
		// 4th grade
		new LunaEvent(new Date(DOAWK_EPOCH-1, 0), 'Manny starts calling Greg Bubby.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH-1, 0), 'Tingy becomes so degraded it turns into a couple pieces of yarn held together by raisins.', 3),
		// 5th grade
		new LunaEvent(new Date(DOAWK_EPOCH-1, 6), 'Greg\'s first swim meet.', 2),
		new LunaEvent(new Date(DOAWK_EPOCH-1, 7), 'Rowley and his family go to Europe.', 2),
		new LunaEvent(new Date(DOAWK_EPOCH-1, 8), 'Greg\'s wins "Most Improved" on his swim team.', 2),
		new LunaEvent(new Date(DOAWK_EPOCH-RODRICK_AGE_GAP+4, 8), 'When Rodrick was a sophomore, he was sick the day they did school photos.', 2),
		new LunaEvent(new Date(DOAWK_EPOCH-1, 8), 'Greg and Rowley present a Spanish project, and messed up while doing a handstand.', 2),
		new LunaEvent(new Date(DOAWK_EPOCH-1, 11), 'Greg\'s family runs out of toilet paper. He tricks Rowley into thinking their napkins were fancy toilet paper for rich people.', 4),
		new LunaEvent(new Date(DOAWK_EPOCH, 2, 20), 'The cheese falls onto the blacktop.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH, 3), 'Abe Hall gets the Cheese Touch.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH, 5, 1), 'In the fifth grade, the fastest runner is Ronnie McCoy.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH, 7), 'Abe moves away to California and takes the Cheese Touch with him.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH, 7), 'A couple of days into summer vacation, Rodrick wakes Greg up in the middle of the night, and tells Greg he slept through the whole summer.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH, 7), 'Rowley and his family go to Australia for ten days.', 2),
		// 6th grade = book 1
		new LunaEvent(new Date(DOAWK_EPOCH, 8, 4), 'Greg gets his diary.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH, 8, 9), 'Manny draws a self-portrait on Greg\'s bedroom door in permanent marker.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH, 8, 14), 'Greg sneaks downstairs to listen to Rodrick\'s CD on the stereo in the family room.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH, 8, 17), 'Manny gets a hold of one of Rodrick\'s heavy metal magazines, and brings it into day care for show-and-tell.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH, 8, 21), 'Greg runs for treasurer.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH, 9), 'Rodrick slept for 36 hours straight through an entire Monday sometime this fall.', 2),
		new LunaEvent(new Date(DOAWK_EPOCH, 9, 1), 'Opening night of the Crossland High School haunted house.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH, 9, 6), 'Greg and Rowley make their OWN haunted house.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH, 9, 31), 'Greg and Rowley get chased by teenagers on halloween.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH, 10, 8), 'Mr. Underwood begins a wrestling unit for PE; Greg is paired with Fregley.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH, 10, 13), 'Students are wrestling everywhere.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH, 10, 17), 'Greg and Rowley try a makeshift weight-training program.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH, 10, 21), 'Greg fails a geography quiz.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH, 10, 22), 'Uncle Joe scares Manny out of potty training.', 2),
		new LunaEvent(new Date(DOAWK_EPOCH, 10, 23), 'Winter play tryouts.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH, 11), 'Rodrick’s science project was called "Does Watching Violent Movies Make People Think Violent Thoughts?"', 2),
		new LunaEvent(new Date(DOAWK_EPOCH, 11, 10), 'Wizard of Oz play.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH, 11, 18), 'Greg\'s mother makes a gingerbread house, but Greg eats most of it secretly, so it\'s ruined by Christmas eve. His mother just became a parenting columnist and wrote about this in the paper.', 2),
		new LunaEvent(new Date(DOAWK_EPOCH, 11, 20), 'Greg and his mother go out to get a gift for the Giving Tree at church.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH, 11, 25), 'Greg celebrates christmas.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH, 11, 31), 'Greg makes Manny eat a "spider" (actually a ball of thread).', 1),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 0), 'Greg\'s parents get Rodrick a phone this year, and he racks up a bill of $300 in the first month.', 4),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 0, 4), 'Greg knocks Rowley off the big wheel with a football.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 0, 7), 'Christmas break ends.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 0, 15), 'Greg has a new Independent Study course.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 0, 17), 'In school they have a general assembly and show the movie "It\'s Great to Be Me".', 1),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 0, 22), 'Greg joins the safety patrol.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 0, 23), 'It snows for the first time this winter.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 0, 31), 'Greg and Rowley make the first Zoo-Wee Mama comics.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 1), 'Greg steals snacks from the snack bin at home.', 3),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 1, 7), '"Creighton the Curious" comic printed in the school paper.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 1, 27), 'Greg terrorizes the kindergarteners with a worm on a stick.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 2, 5), 'Rowley is suspended from the safety patrol.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 2, 11), 'Greg is suspended from the safety patrol.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 3, 4), 'Rowley has been hanging out with Collin Lee every day after school, so Greg has a sleepover with Fregley.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 3, 9), 'Greg aims to be class clown.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 4, 2), 'Greg\'s mother substitutes for his history teacher.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 4, 7), 'Zoo-Wee Mama is now in the school papers.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 4, 12), 'Greg and Rowley almost get into a fight, and the teenagers make them eat the cheese.', 1),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 5), 'Chirag Gupta moves away.', 2),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 5), 'Manny resumes potty training after being scared by Uncle Joe six months earlier.', 2),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 5, 6), 'Greg and Rowley are friends again.', 1),
		// 7th grade, fall semester = book 2
		new LunaEvent(new Date(DOAWK_EPOCH+1, 6), 'Greg joins the swim team.', 2),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 6), 'Greg dogsat Princess for the Fullers.', 2),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 6), 'In Summer, Rowley spends the night at Greg\'s house, and they sleep in the basement.', 4),
		// "a few weeks back"
		new LunaEvent(new Date(DOAWK_EPOCH+1, 7), 'Rodrick steals Greg\'s first journal.', 2),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 7), 'Greg spends $50 playing Thunder Volt to get on the high score list.', 4),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 8), 'Greg\'s health class shows a video about smoking that scares Rowley away from Greg for a month.', 5),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 8), 'Rowley quits his comic strip job to focus on dinoblazers.', 2),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 8, 1), 'Greg starts his second journal.', 2),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 8, 2), 'Greg passes the cheese touch to Jeremy Pindle.', 2),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 8, 5), 'Rodrick picks up Greg after school, and they get into a fight.', 2),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 8, 10), 'Greg\' dad has been working on a miniature civil war battlefield.', 2),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 8, 16), 'Rowley talks about his trip to South America at school.', 2),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 8, 21), 'Greg makes Manny laugh so hard he snorts apple juice through his nose. Greg gets a ball of tinfoil with toothpicks from Manny.', 2),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 8, 22), 'Greg is assigned Mamadou Montpierre as his French pen-pal.', 2),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 8, 25), 'Rodrick turns his English paper in.', 2),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 9), 'Greg and Rowley carve pumpkins at Red Apple Farm to try to get onto the local news.', 5),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 9, 6), 'Chirag Gupta returns to school. Everyone pretends he\'s invisible.', 2),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 9, 9), 'Chirag Gupta uses a corndog in a failed attempt to get Rowley to acknowledge him.', 2),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 9, 11), 'Mom bucks.', 2),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 9, 12), 'Rowley\'s birthday party.', 2),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 9, 13), 'Greg finally gets in trouble for the invisible Chirag gag.', 2),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 9, 18), 'Greg forces his mother outside to pick up a call from the PTA because his mother has been making him be honest.', 2),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 9, 20), 'School career day.', 2),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 9, 25), 'Greg and Rodrick rake leaves for their grandmother.', 2),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 9, 27), 'Rodrick\'s party.', 2), // "Saturday October 27"
		new LunaEvent(new Date(DOAWK_EPOCH+1, 9, 29), 'Manny\'s finishes potty training.', 2),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 9, 30), 'Greg reads Rowley\'s diary.', 2),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 10, 3), 'Greg\'s dad notices something strange about the bathroom door.', 2),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 10, 4), 'Greg\'s gets his first letter from Mamadou.', 2),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 10, 5), 'Manny\'s first day of preschool.', 2),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 10, 7), 'Greg plays D&D with Rowley and Leland.', 2),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 10, 12), 'Greg\'s mother plays D&D with them.', 2),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 10, 13), 'Greg\'s mother makes Rodrick DM.', 2),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 10, 13), 'Greg turns in his "The Amazing Moose" paper.', 2),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 10, 17), 'Greg\'s and Rowley get a "drum lesson" from Rodrick.', 2),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 10, 24), 'Greg discovers a source of Mom bucks. He also gets a photo from Mamadou.', 2),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 10, 26), 'Greg turns in Rodrick\'s "A Hundred Years Ago" paper. Mom bucks program ends.', 2),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 10, 27), 'Greg celebrates thanksgiving.', 2),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 10, 27), 'Greg\'s grandfather smokes in the family bathroom during Thanksgiving. Greg put a whoopee cushion under Gammie\'s seat.', 5),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 11), 'Greg\'s school is in the bottom 10% in the country in the presidential fitness test.', 6),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 11, 6), 'Greg\'s parents find out about Rodrick\'s party.', 2),
		// "two months ago", February 11th
		new LunaEvent(new Date(DOAWK_EPOCH+1, 11, 6), 'Seth Snella is born.', 3),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 11, 13), 'Greg and Rodrick stay over with their grandfather.', 2),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 11, 16), 'Rodrick starts working on his "Zero G" science project.', 2),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 11, 22), 'Greg and Scotty fail talent show tryouts.', 2),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 11, 24), 'Winter talent show.', 2),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 11, 25), 'Greg receives a hand-knit blanket for christmas.', 6),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 11, 25), 'Jared Pyle gets a dirt bike for christmas.', 6),
		// 7th grade, spring semester = book 3
		new LunaEvent(new Date(DOAWK_EPOCH+2, 0, 1), 'Greg starts his third diary.', 3),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 0, 11), 'Rodrick gets a tattoo.', 3),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 0, 24), 'Greg and Rowley try digging a hole. The next day they bury a time capsule in it.', 3),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 0, 25), 'Greg\'s dad throws away all Manny\'s pacifiers, and Manny needs Tingy to calm down.', 3),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 0, 30), 'Rowley gives Greg a piggyback ride.', 3),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 1, 3), 'Mrs. Craig starts keeping students in for recess until her dictionary is returned.', 3),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 1, 5), 'Greg plays bingo with his grandmother.', 3),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 1, 6), 'Greg digs the time capsule back up.', 3),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 1, 9), 'Greg gets detention.', 3),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 1, 10), 'Greg catches his father stealing the snacks.', 3),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 1, 14), 'Greg gives valentines to everyone in his class.', 3),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 2, 5), 'Greg\'s father throws Tingy away.', 3),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 2, 7), 'Manny starts calling Greg "Ploopy".', 3),
		// "easter", which is March 22 at earliest
		new LunaEvent(new Date(DOAWK_EPOCH+2, 2, 22), 'Greg sits in Manny\'s chocolate on easter, and goes to church in his mother\'s sweater. He calls Manny "Ploopy" back.', 3),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 2, 22), 'Gammie invites the Heffleys to Easter dinner, but they don\'t go until she pretends to have a winning lottery ticket.', 5),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 2, 28), 'Greg has a sleepover with Rowley.', 3),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 2, 29), 'Greg\'s first soccer game, as a "shag".', 3),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 3, 1), 'Rodrick punches Greg as a "prank" for April fools.', 3),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 3, 3), 'Greg\'s second soccer game, on the bench.', 3),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 3, 12), 'Greg\'s fails to block a goal because he is distracted by dandelions, costing the team the game.', 3),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 3, 13), 'Twisted Wizard 2 comes out.', 3),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 3, 17), 'Greg\'s dad takes him and Rodrick to the movies, and learned Lenwood Heath went to a military academy, and gets an idea for Greg.', 3),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 3, 17), 'Greg\'s last dentist appointment at Tender Hugs dental care with Rachel.', 5),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 3, 26), 'Greg\'s first boyscout meeting with troop 133.', 3),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 4, 2), 'Greg gets sick.', 3),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 4, 10), 'Greg\'s father gets his mother a camera for mother\'s day.', 4),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 4, 16), 'Greg, his father, and Rodrick go camping.', 3),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 4, 17), 'Greg shakes Holly Hills\' hand at church.', 3),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 4, 22), 'Holly Hills mistakes Greg for Fregley, causing Greg to lose interest in her.', 3),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 5, 5), 'Last day of school.', 3),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 5, 6), 'Seth Snella\'s half-birthday party.', 3),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 5, 6), 'Greg dumps a plate of deviled eggs into a potted plant at Seth\'s half-birthday party, ultimately driving the Snellas to move out.', 5),
		// 7th grade, summer break = book 4
		new LunaEvent(new Date(DOAWK_EPOCH+2, 5, 12), 'Greg starts his fourth diary.', 4),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 5, 19), 'Greg has a sleepover with Rowley.', 4),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 5, 23), 'First meeting of Greg\'s mother\'s "Reading is Fun" club.', 4),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 5, 25), 'Greg\'s "VIP Lawn Service" gets its first job at Mrs. Canfield\'s.', 4),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 5, 27), 'Greg\'s birthday. He gets a fish.', 4),
		// June has like a thousand weeks in this book, I tried my best to move things around correctly...
		new LunaEvent(new Date(DOAWK_EPOCH+2, 5, 28), 'Greg\'s family visits the Slipslide Waterpark.', 4),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 5, 29), 'Greg\'s father gets a dog, "Sweetie".', 4),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 6), 'Over the summer, Uncle Gary works as a test subject for a pepper spray company.', 7),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 6), 'During the summer, Greg\'s father takes Greg to a work "bring your child to work" day.', 7),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 6, 4), 'Greg\'s visits a pool for the 4th of July.', 4),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 6, 8), 'Greg starts regularly visiting the pool to woo Heather Hills.', 4),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 6, 17), 'Greg finds a bike.', 4),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 7), 'Ms. Grove hires Greg to water her plants.', 5),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 7, 10), 'Greg goes on a beach trip with the Jeffersons.', 4),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 7, 13), 'Greg goes on the Cranium Shaker.', 4),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 7, 17), 'In August, the final Li\'l Cutie comic was supposed to be printed, but instead it continues.', 4),
		// "Sunday August 22"
		new LunaEvent(new Date(DOAWK_EPOCH+2, 7, 22), 'Greg\'s father tries taking Greg to a baseball game, but is stopped by police summoned by Greg.', 4),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 7, 25), 'Greg\'s father gives Sweetie to Greg\'s grandmother.', 4),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 7, 29), 'Game Hut video game competition.', 4),
		// 8th grade, fall semester, first half = book 5
		new LunaEvent(new Date(DOAWK_EPOCH+2, 8), 'Uncle Gary was about to dump Sonya, but a plane carrying a banner with a proposal to a "Sonya" prevented that.', 5),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 8, 3), 'Greg starts his fifth diary.', 5),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 8, 8), 'School begins.', 5),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 8, 11), 'Rowley goes to a Joshie concert.', 5),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 8, 16), 'Greg\'s class watches a video on puberty.', 5),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 8, 17), 'Peachy Breeze ice cream posts an ad seeking a new child actor.', 5),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 8, 19), 'Greg auditions for Peachy Breeze.', 5),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 8, 21), 'Greg\'s uncle Gary gets engaged to his girlfriend, Sonja.', 5),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 8, 24), 'Greg\'s new math teacher is Mrs. Mackelroy.', 5),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 8, 27), 'Greg\'s mother calls a family meeting to announce she was returning to school.', 5),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 8, 28), 'Greg\'s father twists his ankle chasing Rodrick.', 5),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 9), 'Francis Knott flies off the school swingset and lands on the see-saw.', 6),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 9), 'Greg and his mother get lost in a corn maze in the fall.', 7),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 9, 9), 'Greg tries a new alarm clock to help prevent sleeping in. He accidentally sets of the school fire alarm.', 5),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 9, 14), 'Greg starts "The Facts of Life" health class unit.', 5),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 9, 17), 'Greg visits his new dentist, Dr. Kagan.', 5),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 9, 19), 'Greg has to take care of an Egg.', 5),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 9, 23), 'Greg\'s parents go off on a romantic getaway and leave his grandfather to watch over them.', 5),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 9, 26), 'The Heffleys hire a maid, Isabella.', 5),
		// should be a friday, but must be the first entry in november :/ 
		new LunaEvent(new Date(DOAWK_EPOCH+2, 9, 30), 'Greg attends the school\'s "lock-in" event.', 5),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 9, 31), 'Greg\'s dad meets Mr. Alexander, and thinks his teeth aren\'t real.', 6),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 10), 'Amazing Andrew visits the school during a school assembly.', 7),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 10, 2), 'Greg gets sick. Isabella is fired.', 5),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 10, 3), 'Rowley gets a zit.', 5),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 10, 6), 'Greg\'s family has dinner with Uncle Gary and Sonya.', 5),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 10, 7), 'Greg gets "the talk" from Gammie.', 5),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 10, 9), 'Scotty Douglas wins the Peachy Breeze contest.', 5),
		// 8th grade, fall semester, second half = book 6
		new LunaEvent(new Date(DOAWK_EPOCH+2, 10, 14), 'Greg starts his sixth diary.', 6),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 10, 16), 'Anti-bullying slogan contest.', 6),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 10, 21), 'Rowley has a sleepover with Greg.', 6),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 10, 30), 'Greg\'s school replaces the soda machine with a bottled water machine.', 6),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 11, 2), 'Greg tries to sell his snow-shovelling service.', 6),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 11, 7), 'Greg watches "Nutritionauts vs. the Greasy Grimelicks" at a school assembly.', 6),
		// "A few weeks back"
		new LunaEvent(new Date(DOAWK_EPOCH+2, 11, 9), 'Uncle Gary calls the Heffleys to ask for a loan.', 7),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 11, 14), 'Greg and Rowley try to sell their newspaper.', 6),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 11, 15), 'Manny ruins Greg\'s Krazy Kritters account.', 6),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 11, 16), 'Greg\'s punishment is to scrape green dye off the school. It lasts two hours.', 6),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 11, 18), 'It snows three feet overnight due to a blizzard, so school is cancelled.', 6),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 11, 20), 'The Heffley\'s house floods.', 6),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 11, 21), 'Greg rediscovers Alfrendo.', 6),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 11, 25), 'Greg celebrates christmas after the blizzard. He receives a signed Tower of the Druids novel.', 6),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 11, 31), 'The Heffleys visit Corny\'s.', 7),
		// 8th grade, spring semester, first half = book 7
		new LunaEvent(new Date(DOAWK_EPOCH+3, 0, 3), 'Greg starts his seventh diary.', 7),
		new LunaEvent(new Date(DOAWK_EPOCH+3, 0, 9), 'Uncle Gary moves in with the Heffleys.', 7),
		new LunaEvent(new Date(DOAWK_EPOCH+3, 0, 11), 'Uncle Gary has a bad nightmare that wakes Manny up.', 7),
		new LunaEvent(new Date(DOAWK_EPOCH+3, 0, 16), 'The Heffleys hire a plumber to unclog their toilet.', 7),
		new LunaEvent(new Date(DOAWK_EPOCH+3, 0, 19), 'Greg begins a ballroom dancing unit in his PE class at school.', 7),
		new LunaEvent(new Date(DOAWK_EPOCH+3, 0, 25), 'Greg attends a school assembly during fourth period to announce a special election to replace the student council.', 7),
		new LunaEvent(new Date(DOAWK_EPOCH+3, 0, 27), 'Rowley starts campaigning for the school\'s "Social Chairperson" role.', 7),
		new LunaEvent(new Date(DOAWK_EPOCH+3, 0, 28), 'Eugene Ellis wins the student council elections in a landslide. Rowley also wins.', 7),
		new LunaEvent(new Date(DOAWK_EPOCH+3, 1, 1), 'The school now allows students to bring their own toilet paper from home.', 7),
		new LunaEvent(new Date(DOAWK_EPOCH+3, 1, 4), 'The school sets a five-square limit on toilet paper.', 7),
		new LunaEvent(new Date(DOAWK_EPOCH+3, 1, 9), 'The school introduces "candy grams".', 7),
		new LunaEvent(new Date(DOAWK_EPOCH+3, 1, 9), 'Greg spends $2 giving himself candy grams to try to make himself more attractive.', 7),
		new LunaEvent(new Date(DOAWK_EPOCH+3, 1, 9), 'Tries to ask Bethany out.', 7),
		new LunaEvent(new Date(DOAWK_EPOCH+3, 1, 10), 'Students have been pantsing each other during PE.', 7),
		new LunaEvent(new Date(DOAWK_EPOCH+3, 1, 11), 'Greg\'s secret toilet paper hoard is discovered.', 7),
		new LunaEvent(new Date(DOAWK_EPOCH+3, 1, 13), 'Greg babysits for the Stringers.', 7),
		new LunaEvent(new Date(DOAWK_EPOCH+3, 1, 14), 'The school hosts a Valentine\'s day dance. Greg takes Abagail on a date to Spriggo\'s.', 7),
		new LunaEvent(new Date(DOAWK_EPOCH+3, 1, 15), 'Uncle Gary wins $40k from a scratch-off ticket and moves out.', 7),
		new LunaEvent(new Date(DOAWK_EPOCH+3, 1, 17), 'Greg gets chickenpox.', 7),
	],
	ZONE_CURRENT: 0,
	ZONES: [
		new LunaEvent(new Date(DOAWK_EPOCH, 8), 'Pre-books', '#444'),
		new LunaEvent(new Date(DOAWK_EPOCH+1, 5, 7), 'Diary of a Wimpy Kid', '#b00'),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 0), 'Rodrick Rules', '#159'),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 5, 7), 'The Last Straw', '#483'),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 8), 'Dog Days', '#fd1'),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 10, 10), 'The Ugly Truth', '#737'),
		new LunaEvent(new Date(DOAWK_EPOCH+2, 11, 26), 'Cabin Fever', '#5ac'),
		new LunaEvent(new Date(DOAWK_EPOCH+3, 1, 18), 'The Third Wheel', '#941'),
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