/* exported startEreQuote */
/* global EremoranTooltip, random, range */

const eremorans = {
	guild1: '<abbr title="Metalsmith\'s Guild">Aramaêsur Temêmor</abbr> motto',
	philosopher1: 'Urisbazêsur Badmar, philosopher', // political
	philosopher2: 'Temêsur Saiur, princess and philosopher', // infp
	philosopher3: 'Mánikasur Hisklenar, philosopher', // serious/depresso
	poet1: 'Lusimarisur Siurisar, poet', // more abstract / misc
	pun: 'An Eremoran pun',
};

const quotes = [
	['Ad bibi bibimat ad balitômz uid i ad nau dinrôz ne : Ad nasisu nau bibimat ad baliz ne',
		'What do you mean I can&apos;t buy breasts at a tavern? What else would a tavern sell?', eremorans.pun],
	['Afêkkrum i hanum din id namboz', 'Philosophy devours the unready.', eremorans.philosopher3],
	['Liba ku mor i daret ku mok', 'One with a heart is already wealthy.', eremorans.philosopher2],
	['Dir nau sudôtamaz ne', 'What\'s to be done?', eremorans.philosopher1],
	['Id bi i dir hirak sudôz uid kubatu nasu hona', 'One leaf does not produce milk, but two do.', eremorans.pun],
	['Lakum i anôm sudôz ku zurkum i annumum su sudôz', 'Thought makes good and haste makes evil.', eremorans.philosopher2],
	['Libam su zurkudoid bêm i dir nau sudôz tan', 'The worst part about crying is determining what to do after.', eremorans.philosopher2],
	['Lusik i dir lusik namz uid', 'Wolves do not eat wolves.', eremorans.philosopher3],
	['Mor su uid hod nau su i kekisuk tukilk ne', 'Of what is the soul of gods if not man?', eremorans.poet1],
	['Roraok i id mo', 'Only cats are above man.', eremorans.poet1],
	['Som ardo din ardo som din', 'Heat from fire; fire from heat.', eremorans.guild1],
	// todo common Enklár Shibboleth
];

/** ms */
const ereQuoteFadeT = 1000;
/** ms */
const ereQuoteT = 8000 + 2*ereQuoteFadeT;

function newQuote(){
	const elem = document.createElement('div');
	const [ere, eng, auth] = random.choice(quotes);
	const qEre = document.createElement('q');
	qEre.classList.add('eremoran');
	qEre.innerHTML = ere;
	EremoranTooltip.setupWord(qEre);
	elem.appendChild(qEre);
	elem.appendChild(document.createElement('br'));
	const qEng = document.createElement('q');
	qEng.innerHTML = eng;
	elem.appendChild(qEng);
	elem.appendChild(document.createElement('br'));
	const qAuth = document.createElement('span');
	qAuth.classList.add('quoteAuthor');
	qAuth.innerHTML = auth;
	elem.appendChild(qAuth);
	return elem;
}

function nextQuote(){
	const elem = document.getElementById('ereQuote');
	if (elem === null)
		return undefined;
	// fade current quote out
	range(0, ereQuoteFadeT, 100).forEach(i => {
		setTimeout(() => {
			elem.style.opacity = 1 - i/ereQuoteFadeT;
		}, i);
	});
	// swap quote
	setTimeout(() => {
		elem.innerHTML = '';
		elem.appendChild(newQuote());
	}, ereQuoteFadeT);
	// fade next quote in
	range(ereQuoteFadeT, 2*ereQuoteFadeT, 100).forEach(i => {
		setTimeout(() => {
			elem.style.opacity = (i - ereQuoteFadeT)/ereQuoteFadeT;
		}, i);
	});
}

function startEreQuote(){
	nextQuote();
	setInterval(nextQuote, ereQuoteT);
}