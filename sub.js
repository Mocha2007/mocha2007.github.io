/* 'Welcome!','Bonvenon!','Bienvenue!','Salve!','Geti!','Bienvenido!','ようこそ!', */
var subtitles =	[
				'Math, &#x1F44F; Cities, &#x1F44F; Math \'n Cities! &#x1F44F;',
				'Gluten-free Mocha: now with real sugar!',
				'The fruitiest of all fruity-ass fruitbowls!',
				'"Gay and Fake" - NYT review of Mocha\'s Site',
				'The antonym of <i>Mocha</i> is <i>Lesscha</i>.',
				'The antonym of <i>Mocha</i> is <i>Lesscha</i>.',
				'&iexcl;Mundos Interminables, Historias Interminables!',
				'Ab <i>owo</i> usque ad <i>What\'s this???</i>',
				'Is <i>*(é)-trom</i> an instrument?'
				]
window.onload = function Sub() {
	var index = Math.floor(Math.random()*(subtitles.length));
	document.getElementById('subtitle').innerHTML = subtitles[index];
}