/* 'Welcome!','Bonvenon!','Bienvenue!','Salve!','Geti!','Bienvenido!','ようこそ!', */
var subtitles =	[
				'Math, &#x1F44F; Cities, &#x1F44F; Math &#x1F44F; \'n Cities! &#x1F44F;',
				'Gluten-free Mocha: now with real sugar!',
				'The fruitiest of all fruity-ass fruitbowls!',
				'"Gay and Fake" - NYT review of Mocha\'s Site',
				'The antonym of <i>Mocha</i> is <i>Lesscha</i>.',
				'The antonym of <i>Mocha</i> is <i>Lesscha</i>.',
				'&iexcl;Mundos Interminables, Historias Interminables!',
				'Ab <i>owo</i> usque ad <i>What\'s this???</i>',
				'Is <i>*(é)-trom</i> an instrument?',
				'The pizza doesn’t scream when you put it in the oven.',
				'Poorly-transed Japanese for <i>also tea</i>? You decide.',
				'The med curse is real',
				'I have discovered a truly marvelous proof of this theorem, which this randomly-generated subtitle is too small to contain.',
				'Mocha &isin; Fags',
				'&lambda;x.x is Mocha',
				'/me huggu',
				'#ThingsISayBeforeSex: <i>quinque</i>',
				'Zen and the Art of Conworlding',
				'You spice?',
				'<i>Real</i> News.',
				'The Senate and the Poplar of Rome',
				'Mentula Culusque Moechi',
				'<a href="https://en.wikipedia.org/wiki/Bet_(letter)">Bet</a>, <a href="https://en.wikipedia.org/wiki/Click_consonant">clicks</a>, and <a href="https://en.wikipedia.org/wiki/Trill_consonant">trills</a>?',
				'Culus Invictus'
				]
window.onload = function Sub() {
	var index = Math.floor(Math.random()*(subtitles.length));
	document.getElementById('subtitle').innerHTML = subtitles[index];
	console.info('C3692 6510 QT4420');
}