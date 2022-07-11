/* exported startEreQuote */
/* global EremoranTooltip, random, range */
const quotes = [
	['Dir nau sudôtamaz ne', 'What\'s to be done?', 'Urisbazêsur Badmar, philosopher'],
	['Som ardo din ardo som din', 'Heat from fire; fire from heat.', '<abbr title="Metalsmith\'s Guild">Aramaêsur Temêmor</abbr> motto'],
	// Common Enklár Shibboleth
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