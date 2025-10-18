class QuestionType {
	constructor(name){
		this.name = name;
	}
}
QuestionType.MULTIPLE_CHOICE = new QuestionType('multiple_choice');
QuestionType.TEXT = new QuestionType('text');

class Question {
	constructor(o){
		/** @type {string} */
		this.question = o.question;
		/** @type {string[]} */
		this.fake_answers = o.fake_answers;
		/** @type {string[]} */
		this.real_answers = o.real_answers;
		/** @type {QuestionType} */
		this.type = o.type || QuestionType.TEXT;
	}
	/** @param {number?} n */
	answer_elems(n){
		if (!n){
			n = USCITTEST.config.answers_per_question;
		}
		const answers = this.fake_answer_elems(n-1);
		answers.push(this.real_answer_elem);
		USCITTEST.random.shuffle(answers);
		const container = document.createElement('div');
		container.classList.add('answer_container');
		answers.forEach(e => container.appendChild(e));
		return container;
	}
	/** @param {number?} n */
	fake_answer_elems(n){
		if (!n){
			n = USCITTEST.config.fake_answers_per_question;
		}
		const answer_pool = this.fake_answers.map(x => x); // clone
		const answers = [];
		for (let i = 0; i < n; i++){
			const answer = USCITTEST.random.choice(answer_pool);
			answer_pool.splice(answer_pool.indexOf(answer), 1);
			answers.push(USCITTEST.elem.answer(this, false, answer));
		}
		return answers;
	}
	/** @param {number?} n */
	elem(n){
		if (!n){
			n = USCITTEST.config.answers_per_question;
		}
		const elem = document.createElement('div');
		elem.classList.add('question');
		const h = document.createElement('h2');
		h.innerHTML = this.question;
		elem.appendChild(h);
		elem.appendChild(this.answer_elems(n));
		return elem;
	}
	get real_answer_elem(){
		return USCITTEST.elem.answer(this, true, USCITTEST.random.choice(this.real_answers));
	}
}

const USCITTEST = {
	config: {
		answers_per_question: 4,
		get fake_answers_per_question(){
			return this.answers_per_question - 1;
		},
		min_pass_score: 12, // use an int, not a float, cause floating point nonsense
		questions: 20,
	},
	elem: {
		/** @param {Question} question; @param {boolean} is_correct; @param {string} text */
		answer(question, is_correct, text){
			const elem = document.createElement('div');
			elem.classList.add('answer');
			elem.innerHTML = text;
			elem.onclick = () => {
				USCITTEST.test_state.answer(is_correct);
				USCITTEST.test_state.unseen_questions.splice(USCITTEST.test_state.unseen_questions.indexOf(question), 1);
			};
			return elem;
		},
		/** @returns {HTMLDivElement} */
		get score(){
			const elem = document.createElement('div');
			const h = document.createElement('h2');
			h.innerHTML = 'Result';
			elem.appendChild(h);
			const inner = document.createElement('div');
			elem.appendChild(inner);
			inner.innerHTML =
			`Correct: ${USCITTEST.test_state.answered_correct}<br>
			Incorrect: ${USCITTEST.test_state.answered_incorrect}<br>
			Score: ${Math.round(100 * USCITTEST.test_state.answered_correct / USCITTEST.test_state.answered_total)}%<br>
			Result: ${USCITTEST.config.min_pass_score <= USCITTEST.test_state.answered_correct ? 'PASS' : 'FAIL'}<br>
			`;
			const retry_button = document.createElement('div');
			retry_button.innerHTML = 'Retry';
			retry_button.onclick = () => USCITTEST.test_state.reset();
			retry_button.classList.add('answer');
			inner.appendChild(retry_button);
			return elem;
		},
		/** @returns {HTMLDivElement} */
		get test(){
			return document.getElementById('test');
		}
	},
	init(){
		if (document.readyState === 'loading'){
			console.debug('awaiting document to load ... sleeping 100 ms');
			return setTimeout(() => this.init(), 100);
		}
		console.log('uscittest.js loaded.');
		this.test_state.reset();
	},
	// https://www.uscis.gov/sites/default/files/document/questions-and-answers/2025-Civics-Test-128-Questions-and-Answers.pdf
	questions: [
		{
			question: 'What is the form of government of the United States?',
			real_answers: ['Republic', 'Constitution-based federal republic', 'Representative democracy'],
			fake_answers: ['Constitutional monarchy', 'Direct democracy', 'Federal oligarchy'],
		},
		{
			question: 'What is the supreme law of the land?',
			real_answers: ['The Constitution'],
			fake_answers: ['The Bill of Rights', 'The Declaration of Independence', 'The Articles of Confederation'],
		},
		{
			question: 'Name one thing the U.S. Constitution does.',
			real_answers: ['Forms the government', 'Defines the powers of government', 'Defines the parts of government', 'Protects the rights of the people'],
			fake_answers: ['Establishes a national bank', 'Regulates interstate commerce directly', 'Sets the official language of the United States'],
		},
		{
			question: 'The U.S. Constitution starts with the words “We the People.” What does “We the People” mean',
			real_answers: ['Self-government', 'Popular sovereignty', 'Consent of the governed', 'People should govern themselves', 'It is an example of social contract'],
			fake_answers: ['A reference to the founding fathers', 'A statement of national unity', 'A declaration of independence from Britain'],
		},
		{
			question: 'How are changes made to the U.S. Constitution?',
			real_answers: ['Amendments', 'The amendment process'],
			fake_answers: ['Executive orders by the President', 'Supreme Court decisions', 'Congressional resolutions'],
		},
		{
			question: 'What does the Bill of Rights protect?',
			real_answers: ['The rights of people living in the United States'],
			fake_answers: ['The power of the executive branch', 'The structure of state governments', 'The interests of corporations', 'The authority of law enforcement', 'The privileges of Congress'],
		},
		{
			question: 'How many amendments does the U.S. Constitution have?',
			real_answers: ['27'],
			fake_answers: ['25', '26', '28', '29'],
		},
		{
			question: 'Why is the Declaration of Independence important?',
			real_answers: ['It says America is free from British control', 'It says all people are created equal', 'It identifies inherent rights', 'It identifies individual freedoms'],
			fake_answers: ['It established the rules for the new government', 'It marked the end of the American Revolution', 'It created a formal alliance with European nations'],
		},
		{
			question: 'What founding document said the American colonies were free from Britain',
			real_answers: ['The Declaration of Independence'],
			fake_answers: ['The Articles of Confederation', 'The Treaty of Paris', 'The Constitution'],
		},
		// todo Q10
		{
			question: 'The words “Life, Liberty, and the pursuit of Happiness” are in what founding document?',
			real_answers: ['The Declaration of Independence'],
			fake_answers: ['The Constitution', 'The Bill of Rights', 'The Articles of Confederation'],
		},
		{
			question: 'What is the economic system of the United States?',
			real_answers: ['Capitalism', 'Free market economy'],
			fake_answers: ['Socialism', 'Communism', 'Mercantilism'],
		},
		{
			question: 'What is the rule of law?',
			real_answers: ['Everyone must follow the law', 'Leaders must obey the law', 'Government must obey the law', 'No one is above the law'],
			fake_answers: ['The power of the judiciary to make laws', 'The system of checks and balances', 'The principle of majority rule'],
		},
		{
			question: 'Many documents influenced the U.S. Constitution. Name one.',
			real_answers: ['The Declaration of Independence', 'The Articles of Confederation', 'The Federalist Papers', 'The Anti-Federalist Papers', 'The Virginia Declaration of Rights', 'The Fundamental Orders of Connecticut', 'The Mayflower Compact', 'The Iroquois Great Law of Peace'],
			fake_answers: ['The Emancipation Proclamation', 'The Louisiana Purchase', 'The Kansas-Nebraska Act', 'The Monroe Doctrine', 'The Homestead Act'],
		},
		{
			question: 'There are three branches of government. Why?',
			real_answers: ['So one part does not become too powerful', 'Checks and balances', 'Separation of powers'],
			fake_answers: ['To ensure a single leader', 'To reduce the number of elected officials', 'To increase the power of the executive branch'],
		},
		// todo Q16
		{
			question: 'The President of the United States is in charge of which branch of Government?',
			real_answers: ['The executive branch'],
			fake_answers: ['The legislative branch', 'The judicial branch', 'All of the above'],
		},
		{
			question: 'What part of the federal government writes laws?',
			real_answers: ['Congress', 'The national legislature', 'The legislative branch'],
			fake_answers: ['The Supreme Court', 'The President', 'The Federal Reserve', 'The executive branch', 'The judicial branch'],
		},
		{
			question: 'What are the two parts of the U.S. Congress?',
			real_answers: ['The Senate and House'],
			fake_answers: ['The legislative and executive branches', 'The presidency and vice-presidency', 'National and local governments'],
		},
		{
			question: 'Name one power of the U.S. Congress.',
			real_answers: ['To write laws', 'To declare war', 'To set the federal budget'],
			fake_answers: ['To appoint federal judges', 'To negotiate treaties', 'To command the military'],
		},
		{
			question: 'How many U.S. senators are there?',
			real_answers: ['100'],
			fake_answers: ['50', '435', '538'],
		},
		{
			question: 'How long is a term for a U.S. senator?',
			real_answers: ['6 years'],
			fake_answers: ['2 years', '4 years', '8 years'],
		},
		// todo Q23
		{
			question: 'How many voting members are in the House of Representatives?',
			real_answers: ['435'],
			fake_answers: ['50', '100', '538'],
		},
		{
			question: 'How long is a term for a member of the House of Representatives?',
			real_answers: ['2 years'],
			fake_answers: ['6 years', '4 years', '8 years'],
		},
		{
			question: 'Why do U.S. representatives serve shorter terms than U.S. senators?',
			real_answers: ['To more closely follow public opinion'],
			fake_answers: ['To allow for more experienced leadership', 'To provide stability in government', 'To give them more time to focus on their careers'],
		},
		{
			question: 'How many senators does each state have?',
			real_answers: ['2'],
			fake_answers: ['1', 'An amount proportional to its population', '10'],
		},
		{
			question: 'Why does each state have two senators?',
			real_answers: ['Equal representation for small states', 'The Great Compromise'],
			fake_answers: ['To give more power to larger states', 'To ensure representation for urban areas', 'To provide a rotating presidency'],
		},
		// todo Q29
		{
			question: 'Who is the current Speaker of the House?',
			real_answers: ['Mike Johnson'],
			fake_answers: ['Kevin McCarthy', 'Paul Ryan', 'James Vance'],
		},
		{
			question: 'Who does a U.S. senator represent?',
			real_answers: ['People of their state'],
			fake_answers: ['People of their district', 'People of their party', 'People of their region'],
		},
		{
			question: 'Who elects U.S. senators?',
			real_answers: ['Citizens of their state'],
			fake_answers: ['The President', 'Members of Congress', 'State legislatures'],
		},
		{
			question: 'Who does a member of the House of Representatives represent?',
			real_answers: ['People of their district'],
			fake_answers: ['People of their state', 'People of their party', 'People of their region'],
		},
		{
			question: 'Who elects members of the House of Representatives?',
			real_answers: ['Citizens of their district'],
			fake_answers: ['The President', 'Members of Congress', 'State legislatures'],
		},
		{
			question: 'Some states have more representatives than other states. Why?',
			real_answers: ['Their state\'s population'],
			fake_answers: ['Their state\'s wealth', 'Their state\'s location', 'Their state\'s history'],
		},
		{
			question: 'The President of the United States is elected for how many years?',
			real_answers: ['4 years'],
			fake_answers: ['2 years', '8 years', 'For life'],
		},
		{
			question: 'The President of the United States can serve only two terms. Why?',
			real_answers: ['The 22<sup>nd</sup> Amendment', 'To keep the president from becoming too powerful'],
			fake_answers: ['Historical precendent', 'Marbury v. Madison', 'They must serve additional terms in the role of Vice President instead'],
		},
		{
			question: 'Who is the current President of the United States?',
			real_answers: ['Donald Trump'],
			fake_answers: ['Joe Biden', 'Barack Obama', 'George Bush'],
		},
		{
			question: 'Who is the current Vice President of the United States?',
			real_answers: ['James Vance'],
			fake_answers: ['Mike Pence', 'Kamala Harris', 'Joe Biden'],
		},
		{
			question: 'If the president can no longer serve, who becomes president?',
			real_answers: ['The Vice President'],
			fake_answers: ['The Speaker of the House', 'The President pro tempore of the Senate', 'The Secretary of State'],
		},
		{
			question: 'Name one power of the president.',
			real_answers: ['Signs bills into law', 'Vetoes bills', 'Enforces laws', 'Leads the military', 'Chief Diplomat', 'Appoints federal judges'],
			fake_answers: ['Makes laws', 'Appoints state governors', 'Interprets the constitution'],
		},
		{
			question: 'Who is the Commander in Chief of the U.S. military?',
			real_answers: ['The President'],
			fake_answers: ['Congress', 'The Supreme Court', 'The Secretary of Defense'],
		},
		{
			question: 'Who signs bills to become laws?',
			real_answers: ['The President'],
			fake_answers: ['Congress', 'The Supreme Court', 'The Secretary of State'],
		},
		{
			question: 'Who vetoes bills?',
			real_answers: ['The President'],
			fake_answers: ['Congress', 'The Supreme Court', 'The Secretary of State'],
		},
		{
			question: 'Who appoints federal judges?',
			real_answers: ['The President'],
			fake_answers: ['Congress', 'The Supreme Court', 'The Secretary of Justice'],
		},
		{
			question: 'The executive branch has many parts. Name one.',
			real_answers: ['The President', 'The Cabinet', 'Federal departments and agencies'],
			fake_answers: ['Congress', 'The Supreme Court', 'State governments'],
		},
		{
			question: 'What does the President\'s Cabinet do?',
			real_answers: ['Advises the President'],
			fake_answers: ['Makes laws for the states', 'Interprets the Constitution', 'Commands the military directly'],
		},
		// todo Q48
		{
			question: 'Why is the Electoral College important?',
			real_answers: ['It decides who is elected president', 'It provides a compromise between the popular election of the president and congressional selection.'],
			fake_answers: ['It determines the order of presidential succession', 'It decides the outcome of congressional elections', 'It allows for a direct popular vote for President', 'It eliminates the need for a runoff election'],
		},
		{
			question: 'What is one part of the judicial branch?',
			real_answers: ['Supreme Court', 'Federal Courts'],
			fake_answers: ['State Courts', 'Congress', 'The Presidency'],
		},
		{
			question: 'What does the judicial branch do?',
			real_answers: ['Reviews laws', 'Explains laws', 'Resolves disputes about the law', 'Decides if a law goes against the U.S. Constitution'],
			fake_answers: ['Makes laws for the country', 'Commands the military', 'Negotiates treaties'],
		},
		{
			question: 'What is the highest court in the United States?',
			real_answers: ['The Supreme Court'],
			fake_answers: ['The Court of Public Opinion', 'The Presidency', 'The Senate'],
		},
		{
			question: 'How many seats are on the Supreme Court?',
			real_answers: ['9'],
			fake_answers: ['8', '10', '12'],
		},
		{
			question: 'How many Supreme Court justices are usually needed to decide a case?',
			real_answers: ['A majority'],
			fake_answers: ['A plurality', 'Unanimity', 'At least one'],
		},
		{
			question: 'How long do Supreme Court justices serve?',
			real_answers: ['For life', 'Until retirement'],
			fake_answers: ['4 years', '6 years', '8 years'],
		},
		{
			question: 'Supreme Court justices serve for life. Why?',
			real_answers: ['To be independent of politics', 'To limit outside influence'],
			fake_answers: ['To ensure the continuance of tradition', 'The principle of <i>Stare decisis</i>', 'To prevent frequent overturning of precedent'],
		},
		{
			question: 'Who is the current Chief Justice of the United States?',
			real_answers: ['John Roberts'],
			fake_answers: ['William Rehnquist', 'Clarence Thomas', 'Samuel Alito', 'Sonia Sotomayor', 'Elena Kagan', 'Neil Gorsuch', 'Brett Kavanaugh', 'Amy Coney Barrett', 'Ketanji Brown Jackson'],
		},
		{
			question: 'Name one power that is only for the federal government.',
			real_answers: ['Print money', 'Declare war', 'Create armies', 'Make treaties', 'Set foreign policy'],
			fake_answers: ['Regulate intrastate commerce', 'Make local laws', 'Collect state taxes'],
		},
		{
			question: 'Name one power that is only for the states.',
			real_answers: ['Provide schooling and education', 'Provide protection', 'Provide public safety', 'Grant driver\'s licenses', 'Approve zoning and land use'],
			fake_answers: ['Regulate foreign policy', 'Declare war', 'Negotiate treaties'],
		},
		{
			question: 'What is the purpose of the 10<sup>th</sup> Amendment?',
			real_answers: ['To grant powers not given to the federal government to the states'],
			fake_answers: ['To prohibit cruel and unusual punishment', 'To prevent unreasonable search and seizure', 'To affirm the rights of all citizens to vote'],
		},
		// todo Q60, 61, 62
		{
			question: 'There are four amendments to the U.S. Constitution about who can vote. Describe one of them.',
			real_answers: ['Citizens 18 and older can vote', 'You don\'t have to pay a poll tax to vote', 'Any citizen can vote', 'A male citizen of any race can vote'],
			fake_answers: ['A literacy test is required to vote', 'Voting is limited to property owners', 'A poll tax is required to vote'],
		},
		{
			question: 'Who can vote in federal elections, run for federal office, and serve on a jury in the United States?',
			real_answers: ['U.S. citizens excepting residents of U.S. territories'],
			fake_answers: ['Residents of the United States', 'U.S. citizens, or residents who have lived in the United States for at least 10 years', 'All U.S. citizens'],
		},
		// todo Q65
		{
			question: 'What do we show loyalty to when we say the Pledge of Allegiance?',
			real_answers: ['The flag', 'The United States'],
			fake_answers: ['The President', 'The Constitution', 'The American People'],
		},
		// todo Q67, Q68, Q69
		{
			question: 'What is one way Americans can serve their country?',
			real_answers: ['Vote', 'Pay taxes', 'Obey the law', 'Serve in the military', 'Run for office', 'Work for local, state, or federal government'],
			fake_answers: ['Ignore public issues', 'Avoid taxes', 'Move to another country'],
		},
		{
			question: 'Why is it important to pay federal taxes?',
			real_answers: ['It\'s required by law', 'All people pay to fund the federal government', 'It is required by the 16th amendment to the U.S. constitution', 'It is one\'s civic duty'],
			fake_answers: ['You must pay a poll tax to vote in federal elections', 'You must pay to run for public office', 'You must pay to travel abroad'],
		},
		{
			question: 'It is important for all men age 18 through 25 to register for the Selective Service. Name one reason why.',
			real_answers: ['It\'s required by law', 'It makes the draft fair', 'It is one\'s civic duty'],
			fake_answers: ['You receive preferential treatment in college admissions', 'You are exempted from jury duty', 'It qualifies one for certain types of financial aid'],
		},
		{
			question: 'The colonists came to America for many reasons. Name one.',
			real_answers: ['Freedom', 'Economic opportunity', 'To escape persecution'],
			fake_answers: ['To establish a new monarchy', 'To spread Christianity to the Native Americans', 'To escape European city life'],
		},
		{
			question: 'Who lived in America before the Europeans arrived?',
			real_answers: ['Native Americans'],
			fake_answers: ['The Dutch', 'Mexicans', 'African-Americans'],
		},
		{
			question: 'What group of people was taken and sold as slaves?',
			real_answers: ['Africans'],
			fake_answers: ['The Dutch', 'Italians', 'The Irish'],
		},
		{
			question: 'What war did the Americans fight to win independence from Britain?',
			real_answers: ['The American Revolution'],
			fake_answers: ['The War of 1812', 'The Mexican-American War', 'The French and Indian War'],
		},
		{
			question: 'Name one reason why the Americans declared independence from Britain',
			real_answers: ['High taxes', 'Taxation without representation', 'Quartering of British soldiers in Americans\' homes', 'Self-government', 'The Boston Massacre', 'The Intolerable Acts'],
			fake_answers: ['To establish a new monarchy', 'To protest British trade policies that unfairly benefited the colonies', 'To align with other European powers'],
		},
		{
			question: 'Who wrote the Declaration of Independence?',
			real_answers: ['Thomas Jefferson'],
			fake_answers: ['Benjamin Franklin', 'James Madison', 'George Washington'],
		},
		{
			question: 'When was the Declaration of Independence adopted?',
			real_answers: ['July 4, 1776'],
			fake_answers: ['February 2, 1781', 'June 21, 1788', 'April 7, 1776'],
		},
		{
			question: 'The American Revolution had many important events. Name one.',
			real_answers: ['Battle of Bunker Hill', 'Declaration of Independence', 'Battle of Trenton', 'Battle of Saratoga', 'Valley Forge', 'Battle of Yorktown'],
			fake_answers: ['Battle of Gettysburg', 'The Emancipation Proclamation', 'The California Gold Rush'],
		},
		// todo 81
		{
			question: 'What founding document was written in 1787?',
			real_answers: ['The Constitution'],
			fake_answers: ['The Declaration of Independence', 'The Articles of Confederation', 'The Bill of Rights'],
		},
		{
			question: 'The Federalist Papers supported the passage of the U.S. Constitution. Name one of the writers.',
			real_answers: ['Alexander Hamilton', 'James Madison', 'John Jay', 'Publius'],
			fake_answers: ['Thomas Jefferson', 'Benjamin Franklin', 'George Washington'],
		},
		{
			question: 'Why were the Federalist Papers important?',
			real_answers: ['They supported passing the Constitution'],
			fake_answers: ['They established the Bill of Rights', 'They created the system of checks and balances', 'They established the Declaration of Independence'],
		},
		{
			question: 'Benjamin Franklin is famous for many things. Name one.',
			real_answers: ['Founded the first free public libraries', 'First Postmaster General of the United States', 'Helped write the Declaration of Independence', 'Inventor', 'U.S. Diplomat'],
			fake_answers: ['He led the Continental Army to victory in the American Revolution', 'He created the Connecticut Compromise', 'He was the first governor of Virginia'],
		},
		{
			question: 'George Washington is famous for many things. Name one.',
			real_answers: ['First president', 'General of the Continental Army', 'President of the Constitutional Convention'],
			fake_answers: ['Wrote the Declaration of Independence', 'First governor of Virginia', 'Inventor'],
		},
		{
			question: 'Thomas Jefferson is famous for many things. Name one.',
			real_answers: ['Wrote the Declaration of Independence', 'Doubled the size of the United States', 'Third president of the United States', 'First Secretary of State', 'Founded the University of Virginia', 'Writer of the Virginia Statute on Religious Freedom'],
			fake_answers: ['General of the Continental Army', 'First President', 'He was the first Governor of Virginia'],
		},
		{
			question: 'James Madison is famous for many things. Name one.',
			real_answers: ['Wrote the Constitution', 'Fourth president of the United States', 'One of the writers of the Federalist Papers'],
			fake_answers: ['President during the Mexican-American war', 'Primary author of the Declaration of Independence', 'First president of the United States'],
		},
		{
			question: 'Alexander Hamilton is famous for many things. Name one.',
			real_answers: ['First Secretary of the Treasury', 'One of the writers of the Federalist Papers', 'Helped establish the First Bank of the United States', 'Aide to General George Washington', 'Member of the Continental Congress'],
			fake_answers: ['Founder of the University of Virginia', 'Primary author of the Declaration of Independence', 'First president of the United States'],
		},
		{
			question: 'What territory did the United States buy from France in 1803?',
			real_answers: ['Louisiana'],
			fake_answers: ['Florida', 'Ohio', 'New Mexico', 'Oregon'],
		},
		{
			question: 'Name one war fought by the United States in the 1800s.',
			// https://en.wikipedia.org/wiki/List_of_wars_involving_the_United_States_in_the_19th_century
			real_answers: ['Barbary Wars', 'War of 1812', 'American Indian Wars', 'Patriot War', 'Mexican-American War', 'Second Opium War', 'Mormon Wars', 'Reform War', 'Pig War', 'American Civil War', 'Liberian-Grebo War', 'Las Cuevas War', 'Garza War', 'Spanish-American War'],
			fake_answers: [
				// late 18th c. American wars
				'American-Algerian War', 'Revolutionary War',
				// early 20th c. American wars
				'World War I',
				// 18th century non-American wars
				'Napoleonic Wars', 'First Opium War', 'Crimean War', 'Boer Wars',
			],
		},
		{
			question: 'Name the U.S. war between the North and the South',
			real_answers: ['The Civil War'],
			fake_answers: ['The Revolutionary War', 'The War of Northern Aggression', 'The Border Wars'],
		},
		// todo: Q93+
	],
	random: {
		/** @param {Array|String} iterable */
		choice(iterable){
			const i = Math.floor(Math.random() * iterable.length);
			return iterable[i];
		},
		/** shuffles array in place; @param {Array} arr */
		shuffle(arr){
			// https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
			for (let i = arr.length - 1; i > 0; i--){
				const j = Math.floor(Math.random() * (i+1));
				[arr[i], arr[j]] = [arr[j], arr[i]];
			}
		},
	},
	test_state: {
		/** @param {boolean} is_correct */
		answer(is_correct){
			if (is_correct){
				this.answered_correct++;
			}
			else {
				this.answered_incorrect++;
			}
			if (USCITTEST.config.questions <= this.answered_total){
				this.score();
			}
			else {
				this.next();
			}
		},
		answered_correct: 0,
		answered_incorrect: 0,
		get answered_total(){
			return this.answered_correct + this.answered_incorrect;
		},
		next(){
			const container = USCITTEST.elem.test;
			container.innerHTML = '';
			/** @type {Question} */
			const q = USCITTEST.random.choice(this.unseen_questions);
			container.appendChild(q.elem());
		},
		reset(){
			console.log('resetting test...');
			this.answered_correct = this.answered_incorrect = 0;
			this.unseen_questions = USCITTEST.questions.map(o => new Question(o));
			this.next();
		},
		score(){
			const container = USCITTEST.elem.test;
			container.innerHTML = '';
			container.appendChild(USCITTEST.elem.score);
		},
		/** @type {Question[]} */
		unseen_questions: [],
	},
};


USCITTEST.init();