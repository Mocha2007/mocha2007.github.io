/* exported startEreQuote */
/* global EremoranTooltip, random, range */

const eremorans = {
	philosopher1: 'Urisbazêsur Badmar, philosopher',
	philosopher2: 'Temêsur Saiur, princess and philosopher',
	philosopher3: 'Mánikasur Hisklenar, philosopher',
	poet1: 'Lusimarisur Siurisar, poet',
};

const quotes = [
	['Afêkkrum i hanum din id namboz', 'Philosophy devours the unready.', eremorans.philosopher2],
	['Liba ku mor i daret ku mok', 'One with a heart is already wealthy.', eremorans.philosopher2],
	['Dir nau sudôtamaz ne', 'What\'s to be done?', eremorans.philosopher1],
	['Lakum i anôm sudôz ku zurkum i annumum su sudôz', 'Thought makes good and haste makes evil.', eremorans.poet1],
	['Libam su zurkudoid bêm i dir nau sudôz tan', 'The worst part about crying is determining what to do after.', eremorans.poet1],
	['Lusik i dir lusik namz uid', 'Wolves do not eat wolves.', eremorans.philosopher3],
	['Mor su uid hod nau su i kekisuk tukilk ne', 'Of what is the soul of gods if not man?', eremorans.philosopher2],
	['Roraok i id mo', 'Only cats are above man.', eremorans.philosopher2],
	['Som ardo din ardo som din', 'Heat from fire; fire from heat.', '<abbr title="Metalsmith\'s Guild">Aramaêsur Temêmor</abbr> motto'],
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