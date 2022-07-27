/* exported startEreQuote */
/* global EremoranTooltip, random, range */

const eremorans = {
	aphorism: 'an Eremoran aphorism',
	guild1: '<abbr title="Metalsmith\'s Guild">Aramaêsur Temêmor</abbr> motto',
	guild2: 'common Enklar challenge and response',
	philosopher1: 'Urisbazêsur Badmar, philosopher', // political
	philosopher2: 'Temêsur Saiur, princess and philosopher', // infp
	philosopher3: 'Manikasur Hisklenar, philosopher', // serious/depresso
	poet1: 'Lusimarisur Siurisar, poet', // more abstract / misc
	pun: 'an Eremoran pun',
};

const quotes = [
	['Ad bibi bibimat ad balitômz uid i ad nau dinrôz ne : Ad nasisu nau bibimat ad baliz ne',
		'What do you mean I can&apos;t buy breasts at a tavern? What else would a tavern sell?', eremorans.pun],
	['Afêkkruêr uid : Afêkkruêr i dir momam dindôz kubatu dir kom spesudôz mok',
		'I am not a philosopher. Philosophers interpret the world; I have changed it.', eremorans.philosopher1],
	['Afêkkrum i hanum din id namboz', 'Philosophy devours the unready.', eremorans.philosopher3],
	['Baim i mom din mok kubatu baisulk uid', 'Reason has always existed, but not always in a reasonable way.', eremorans.philosopher1],
	['Dir nau sudôtamaz ne', 'What\'s to be done?', eremorans.philosopher1],
	['Habim endum sudôm undum', 'Ars longa, vita brevis.', eremorans.aphorism],
	['Id bi i dir hirak sudôz uid kubatu nasu hona', 'One leaf does not produce milk, but two do.', eremorans.pun],
	['Id mor sesum afkam / Id afkam sesur mor', 'One person, a hundred journeys. One journey, a hundred people.', eremorans.guild2],
	['Lakum i anôm sudôz ku zurkum i annumum su sudôz', 'Thought makes good and haste makes evil.', eremorans.philosopher2],
	['Liba ku mor i daret ku mok', 'One with a heart is already wealthy.', eremorans.philosopher2],
	['Libam su zurkudoid bêm i dir nau sudôz tan', 'The worst part about crying is determining what to do after.', eremorans.philosopher2],
	['Lusik i dir lusik namz uid', 'Wolves do not eat wolves.', eremorans.philosopher3],
	['Mor i una kubatu hans nau tamaz', 'Man is nothing yet must be everything.', eremorans.philosopher1],
	['Mor su uid hod nau su i kekisuk tukilk ne', 'Of what is the soul of gods if not man?', eremorans.poet1],
	['Roraok i mor mo id', 'Only cats are above man.', eremorans.poet1],
	['Som ardo din ardo som din', 'Heat from fire; fire from heat.', eremorans.guild1],
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
	qEre.lang = 'Eremoran';
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
			elem.style.opacity = 0.9 - i/ereQuoteFadeT;
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
			elem.style.opacity = (i - ereQuoteFadeT)/ereQuoteFadeT + 0.1;
		}, i);
	});
}

function startEreQuote(){
	nextQuote();
	setInterval(nextQuote, ereQuoteT);
}