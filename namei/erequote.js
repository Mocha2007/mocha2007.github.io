/* exported startEreQuote, translationChallenges */
/* global EremoranTooltip, random, range */

const eremorans = {
	aphorism: 'an Eremoran aphorism',
	guild1: '<abbr title="Metalsmith\'s Guild">Aramaêsur Temêmor</abbr> motto',
	guild2: 'common Enklar challenge and response',
	philosopher1: 'Urisbazêsur Badmar, philosopher', // political
	philosopher2: 'Ôkar Temêsur Saur, philosopher', // infp
	philosopher3: 'Manikasur Hislenar, philosopher', // serious/depresso
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
	['Rurauk i mor mo id', 'Only cats are above man.', eremorans.poet1],
	['Som ardo din ardo som din', 'Heat from fire; fire from heat.', eremorans.guild1],
	['Da dir mor tamaz i mor dir da numsudôtamaz', 'Those who own the country should control it.', eremorans.philosopher3],
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

const translationChallenges = [
	// AUGUST 2022
	// https://www.reddit.com/r/conlangs/comments/wga92w/how_does_your_conlang_handle_recursive/iiz7ryn/
	'Elaôr su kikir as su hanu ad dir zurkum sudôz din, nom ad kaflaz i elaôr ad kopbatômdoum.',
	// https://www.reddit.com/r/conlangs/comments/wha5ws/world_color_survey_for_your_conlangs/ij4xwy9/
	'Dir ereulum erem din sukaz i uzurkum, erem i uzurkudoid din, Eremorôm sukaz uid mok ad.',
	// https://www.reddit.com/r/conlangs/comments/wha5ws/world_color_survey_for_your_conlangs/ij4zfrg/
	'Tanasum erem ne?! Sazasudôsum obo! Ô imôkam su bokusam i rôz hoz ne???',
	// https://www.reddit.com/r/conlangs/comments/wi1x8z/1721st_just_used_5_minutes_of_your_day/ijatb97/
	'Dôkaz addam kasraz ku, ad Madan afkaz kasraz.',
	// https://www.reddit.com/r/conlangs/comments/wi3het/write_a_scam_call_ad_in_your_conlang/ijay68s/
	`Nadnekis dô belaêr i balitz mok ku,
	saurêkair i sesusesut drudot su daret su mêur hal habinz mok.
	Dir kuafkar balitamaz kubatu, kuafkar i id nudot.
	Numêr bo dir nudot dinbamz hod tômz ku dir daret dinbamz batu.`,
	// https://www.reddit.com/r/conlangs/comments/wiuemi/1722nd_just_used_5_minutes_of_your_day/ijdta4h/
	'Nanaur buni su elaêr i kinam ad ne?!',
	// https://www.reddit.com/r/conlangs/comments/wkjk9m/1722nd_just_used_5_minutes_of_your_day/ijpgkjk/
	'Tar setemêmom su mumast i dôkaz mok.',
	// https://www.reddit.com/r/conlangs/comments/wngky7/how_good_you_can_speakwrite_in_your_conlang/ik597ed/
	'Eremorôm bo i saurz uku nanaum daktarm ad rôratômz kubatu, rômat i utôzmut mok.',
	// https://www.reddit.com/r/conlangs/comments/wnspzt/1725th_just_used_5_minutes_of_your_day/ik97n6i/
	'Tan, Anasir i dir libam dinkaltamaz, ad busmat dô sudôz abelk din.',
	// https://www.reddit.com/r/conlangs/comments/wol6a6/1726th_just_used_5_minutes_of_your_day/ikdbr7n/
	'Dir tuut nindat bodôt kubôz.',
	// https://www.reddit.com/r/conlangs/comments/wqcxsd/write_a_short_description_about_your_conlang_in/ikn85y0/
	`Eremorôm bo i Pankair su huku buni dô rôz.
	Endum Nizitnôsum hanum din i temêmosur speudoid elaêr.
	Imôkam i pukusam; tanid kul, buni hal.
	Attukum i ad temêmor spez mok udoulk ku,
	amzralam su id bokusam i ad Nizitnôr din`,
	// https://en.wikipedia.org/wiki/Reiwa_era#Origin_and_meaning
	`Tar sumstum i astedum neurm mok,
	hu i linku ku tukil i kru,
	lennama su seba i astedum ku dinastedz sim ad sebaz ku,
	sebasum manam i amut kumanat.`,
	// https://www.goodreads.com/author/quotes/16535395.Gaius_Julius_Caesar
	// iacta alea esto
	'Dir zetidot bamkaldoz.',
	// In the end, it is impossible not to become what others believe you are.
	'Nami i nasisur hal nanaur eto i kudam ad dindôkaz uid tômz uid.',
];