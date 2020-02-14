var subtitles =	[
				'Math, &#x1F44F; Cities, &#x1F44F; Math &#x1F44F; &rsquo;n Cities! &#x1F44F;',
				// vaguely linguistics/language
				'The antonym of <em>Mocha</em> is <em>Lesscha</em>.',
				'The antonym of <em>subtraction</em> is <em>domdition</em>.',
				'&iexcl;Mundos Interminables, Historias Interminables!',
				'Ab <em>owo</em> usque ad <em>What&rsquo;s this???</em>',
				'Is <em>*(é)-trom</em> an instrument?',
				'Poorly-transed Japanese for <em>also tea</em>? You decide.',
				'<a href="https://en.wikipedia.org/wiki/Bet_(letter)">Bet</a>, <a href="https://en.wikipedia.org/wiki/Click_consonant">clicks</a>, and <a href="https://en.wikipedia.org/wiki/Trill_consonant">trills</a>?',
				'#ThingsISayBeforeSex: <em>quinque</em>',
				'The Senate and Poplar of Rome',
				'Mentula Culusque Moechi',
				'I neither misspell nor use bad grammar;<br/>I just use a different style guide.',
				'Hey man, at least <em>my</em> conlangs don&rsquo;t use words like <em>boato</em> and <em>farmo</em>',
				'Je transforme les plan&egrave;tes en mondes.',
				'I speak no language; I just toy with words until they do what I want.',
				'First to contact me in my conlangs gets an e-cookie.',
				'"My marker was stolen!",<br/>cried the professor after condemning the passive.',
				'The passive is not used often enough.',
				'Culus Invictus',
				'Construo ergo sum.',
				'/ɑ\'wu/',
				'This is Mocha&rsquo;s Site<br>I discuss everything here<br>just one haiku though',
				'So does the text contain just iambs there?<br>Then does it have five iambs total, too?',
				'Roll for consonant mutation save.',
				'Are noun countability stuffs that hard?',
				'English sucks, and then you die.', // https://meta.stackexchange.com/questions/336005/neopronouns-or-trolling?newreg=7d69c4a9e87042df92f32d4bf2487f37#comment1109688_336011
				'Common sense is a term we use for things obvious to us, but not others.', // https://meta.stackexchange.com/questions/335708/under-what-circumstances-will-stack-exchange-inc-share-private-sensitive-infor/335749#comment1106974_335749
				// mat
				'I have created a truly marvelous conworld,<br/>which this randomly generated subtitle is too small to contain.',
				'Mocha &isin; Fags',
				'&lambda;x.x is Mocha',
				// his
				'<span class="highlight">aragoscope</span> <em>n</em>. : the act of <a href="https://en.wikipedia.org/wiki/Kingdom_of_Castile#Union_of_the_Crowns_of_Castile_and_Aragon">noscoping Aragon</a>',
				// sci
				'If eyes are round, then why is the image we see flat?',
				// etc gaming
				'The med curse is real',
				'contown retarded; gg maf',
				'Certified Elf-Kosher',
				'More struts and boosters than the leading brand!',
				'We can finally invade the heart of Eremor.<br/>Unfortunately for you, your adventure ends here.',
				'I can hear them breaching the defenses of my RigFives ship.',
				'You require more Mochas',
				'You must construct additional Mochas',
				'Plura pyla debes construere',
				'Plura mineralia requirimus',
				'Plus gasem vespinum requiris',
				'Non satis energiam',
				'Nos aggrediuntur',
				'Iactans nucleare detegitur',
				'I have seen the river.',
				'Beavaria&rsquo;s most obedient human slave',
				'Non-acidic plutonics, glaciation, fjords, biome-aware migratory automata, and fluvial sediment dispersal - everything marshmallows hate!',
				// quotations
				'In theory, theory and practice are the same. In practice, they are not.',
				'Sail Hatan!',
				// media allusion
				'Gluten-free Mocha: now with real sugar!',
				'The fruitiest of all fruity-ass fruitbowls!',
				'"Gay and Fake" - NYT review',
				'Zen and the Art of Conworlding',
				'You spice?',
				'<em>Real</em> News.',
				'The coneconomy, stupid!',
				'Make Namei Great Again',
				'But I would walk <abbr title="878 km, 546 mi">200 abakêum</abbr>, and I would walk 200 more!',
				'I did <em>not</em> have sexual relations with that map.',
				'⬇ 🌀 🆘',
				'Pay no attention to that Mocha in the closet!',
				'Namei crawling through my windowpane',
				'Splunge is for Splunge',
				'Patterns are traps.',
				'Kiss me under the kissing fern!~',
				// mochisms
				'slash-me huggu',
				'Enkl&aacute;r&rsquo;s Stead, by Enkl&aacute;r&rsquo;s Head',
				'Why many, when few?',
				'Thanks to Isoraķatheð for getting me into conworlding',
				'Drink me.',
				'gib snuggu',
				'insert dong',
				// etc allusion
				'The pizza doesn&rsquo;t scream when you put it in the oven.',
				'/mo(ch|k|hx|\\u0125)[aeiou]r?/gi',
				'Perihelion * Date of perihelion passage * 3.14',
				'Looks like we got ourselves a li&rsquo;l Mike-Oscar-Charlie-Hotel-Alfa!',
				'49206a757374207761737465642061206d696e757465206f6620796f75722074696d652e203b33',
				'.... .- ...- . / -.-- --- ..- / -. --- / .-.. .. ..-. .',
				'<em>"No"</em>',
				'...baka!',
				'Update Furrygram',
				'MOW! MOW! MOW!',
				'HAAAAAAAAAAAA YOUR CAMERA IS TRAAAAASH',
				'My thesis was on the rind of Zayo Dadong'
				];
function Sub(){
	"use strict";
	var index = Math.floor(Math.random()*(subtitles.length));
	document.getElementById('subtitle').innerHTML = subtitles[index];
	console.info('C3692 6510 QT4420');
}