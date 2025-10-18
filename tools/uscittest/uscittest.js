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
		// todo: Q63+
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
			const passed = USCITTEST.config.min_pass_score <= this.answered_correct;
			if (passed){
				alert(`You scored ${this.answered_correct} of ${this.answered_total}. This means you PASSED.`);
			}
			else {
				alert(`You scored ${this.answered_correct} of ${this.answered_total}. This means you FAILED.`);
			}
			this.reset();
		},
		/** @type {Question[]} */
		unseen_questions: [],
	},
};


USCITTEST.init();