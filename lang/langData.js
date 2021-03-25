/* exported authorData, categoryData, entryData, languageData, meaningData, sourceData */
'use strict';

const shortcuts = {
	edob: 'Etymological Dictionary of Basque',
	rhaetian: 'Thesaurus Inscriptionum Raeticarum',
};

const authorData = [
	{
		name: 'mocha',
	},
	{
		name: 'R. L. Trask',
	},
	{
		name: 'Sergei Starostin',
	},
	{
		name: 'Stefan Schumacher',
	},
	{
		name: 'wikimedia',
	},
];

const sourceData = [
	{
		name: shortcuts.edob,
		author: 'R. L. Trask',
		url: 'https://www.sussex.ac.uk/webteam/gateway/file.php?name=lxwp23-08-edb.pdf&site=1',
		date: '2008',
	},
	{
		name: 'mocha',
		author: 'mocha',
		url: 'https://mocha2007.github.io',
		date: '2021',
	},
	{
		name: 'starling',
		author: 'Sergei Starostin',
		url: 'https://starling.rinet.ru/cgi-bin/main.cgi?flags=eygtnnl',
		date: '2021',
	},
	{
		name: shortcuts.rhaetian,
		author: 'Stefan Schumacher',
		url: 'https://www.univie.ac.at/raetica/wiki/Category:Word',
		date: '2016',
	},
	{
		name: 'uralonet',
		url: 'http://uralonet.nytud.hu/search.cgi?id_eintrag=&rkn_l=%25&rkn_c=0&skeleton=&skeletonjoker=fixfix&taxonomy=&rkn_BED=they&rkn_BED_l=en&lexem=&verg_DI=&dialect_from=&dialect_to=&kme_fulltext=&author=&abbr=&submit=Search',
		date: '2021',
	},
	{
		name: 'wiktionary',
		author: 'wikimedia',
		url: 'https://en.wiktionary.org',
		date: '2021',
	},
];

const languageData = [
	// eremoran (sample)
	{
		name: 'eremoran',
		parent: 'proto-eremo-numoran',
		location: 'eremora',
		period: 'before Temer the great',
	},
	// real
	{
		name: 'etruscan',
		parent: 'proto-tyrsenian',
		location: 'italy',
		period: 'c. 500 BCE',
	},
	{
		name: 'hattic',
		location: 'anatolia',
		period: 'c. 2000 BCE',
	},
	{
		name: 'oe',
		parent: 'pwger',
		location: 'england',
		period: 'c. 1000 CE',
	},
	{
		name: 'pie',
		location: 'pontic-caspian steppe',
		period: 'c. 3000 BCE',
	},
	{
		name: 'pger',
		parent: 'pie',
		location: 'central europe',
		period: 'c. 500 BCE',
	},
	{
		name: 'pnec',
		location: 'caucasus',
	},
	{
		name: 'pnwc',
		location: 'caucasus',
	},
	{
		name: 'proto-afro-asiatic',
		location: 'ethiopia',
	},
	{
		name: 'proto-kartvelian',
		location: 'caucasus',
	},
	{
		name: 'proto-semitic',
		parent: 'proto-afro-asiatic',
	},
	{
		name: 'proto-tyrsenian',
	},
	{
		name: 'proto-uralic',
		location: 'urals',
		period: 'c. 2000 BCE',
	},
	{
		name: 'proto-vasconic',
		location: 'iberia',
		period: 'c. 500 BCE',
	},
	{
		name: 'pwger',
		parent: 'pger',
		location: 'northwest germany',
		period: 'c. 500 CE',
	},
	{
		name: 'rhaetian',
		parent: 'proto-tyrsenian',
		location: 'alps',
		period: 'c. 500 BCE',
	},
];

const categoryData = [
	// pos
	{
		name: 'adjective',
	},
	{
		name: 'affix',
	},
	{
		name: 'article',
		categories: 'determiner',
	},
	{
		name: 'conjunction',
	},
	{
		name: 'determiner',
	},
	{
		name: 'noun',
	},
	{
		name: 'numeral',
	},
	{
		name: 'particle',
	},
	{
		name: 'pronoun',
	},
	{
		name: 'verb',
	},
	// sets
	{
		name: 'anatomy',
	},
	{
		name: 'animal',
		categories: 'life',
	},
	{
		name: 'celestial.object',
	},
	{
		name: 'color',
	},
	{ // words specifically having to do with the creation or interpretation of language, eg. "write, word"
		name: 'language',
	},
	{
		name: 'life',
	},
	{
		name: 'motion',
	},
	{
		name: 'person',
		categories: 'society',
	},
	{
		name: 'plant',
		categories: 'life',
	},
	{
		name: 'religion',
		categories: 'society',
	},
	{
		name: 'society',
	},
	{
		name: 'time',
	},
	{
		name: 'weather',
	},
	// todo: swadesh list items
	{
		name: 'swadesh',
	},
];

const meaningData = [
	// numerals
	{
		name: 'eight',
		categories: 'numeral',
	},
	{
		name: 'five',
		categories: 'numeral',
	},
	{
		name: 'four',
		categories: 'numeral',
	},
	{
		name: 'hundred',
		categories: 'numeral',
	},
	{
		name: 'nine',
		categories: 'numeral',
	},
	{
		name: 'one',
		categories: 'numeral',
	},
	{
		name: 'seven',
		categories: 'numeral',
	},
	{
		name: 'six',
		categories: 'numeral',
	},
	{
		name: 'ten',
		categories: 'numeral',
	},
	{
		name: 'three',
		categories: 'numeral',
	},
	{
		name: 'thousand',
		categories: 'numeral',
	},
	{
		name: 'two',
		categories: 'numeral',
	},
	// misc determiners
	{
		name: 'an',
		categories: 'article',
	},
	{
		name: 'some.certain',
		categories: 'determiner',
	},
	{
		name: 'some.quelques',
		categories: 'determiner',
	},
	// prepositions
	{
		name: 'away',
		categories: 'preposition',
	},
	{
		name: 'out',
		categories: 'preposition',
	},
	{
		name: 'up',
		categories: 'preposition',
	},
	// misc morphemes
	{
		name: 'GEN',
	},
	{
		name: 'NEG',
	},
	{
		name: 'PL',
	},
	{
		name: 'PROH',
	},
	// pronouns
	{
		name: '1s',
		categories: 'pronoun',
	},
	{
		name: '1pl',
		categories: 'pronoun',
	},
	{
		name: '2s',
		categories: 'pronoun',
	},
	{
		name: '2pl',
		categories: 'pronoun',
	},
	{
		name: '3s',
		categories: 'pronoun',
	},
	{
		name: '3pl',
		categories: 'pronoun',
	},
	{
		name: 'REFL',
		categories: 'pronoun',
	},
	{
		name: 'this',
		categories: 'pronoun',
	},
	{
		name: 'that', // PROXIMAL or unspecified
		categories: 'pronoun',
	},
	{
		name: 'yon',
		categories: 'pronoun',
	},
	{
		name: 'what',
		categories: 'pronoun',
	},
	{
		name: 'which',
		categories: 'pronoun',
	},
	{
		name: 'who',
		categories: 'pronoun',
	},
	{
		name: 'he', // for languages that distinguish gender
		categories: 'pronoun',
	},
	{
		name: 'she',
		categories: 'pronoun',
	},
	{
		name: 'it',
		categories: 'pronoun',
	},
	// conjunctions
	{
		name: 'and',
		categories: 'conjunction',
	},
	{
		name: 'or',
		categories: 'conjunction',
	},
	{
		name: 'or.excl',
		categories: 'conjunction',
	},
	// adjectives
	{
		name: 'alone',
		categories: 'adjective',
	},
	{
		name: 'big',
		categories: 'adjective',
	},
	{
		name: 'favorable',
		categories: 'adjective',
	},
	{
		name: 'good',
		categories: 'adjective',
	},
	{
		name: 'great',
		categories: 'adjective',
	},
	{
		name: 'higher',
		categories: 'adjective',
	},
	{
		name: 'new',
		categories: 'adjective',
	},
	{
		name: 'only.adj',
		categories: 'adjective',
	},
	{
		name: 'red',
		categories: 'adjective;color',
	},
	{
		name: 'sharp',
		categories: 'adjective',
	},
	{
		name: 'upper',
		categories: 'adjective',
	},
	// nouns
	{
		name: 'abdomen',
		categories: 'noun;anatomy',
	},
	{
		name: 'arm',
		categories: 'noun;anatomy',
	},
	{
		name: 'back',
		categories: 'noun;anatomy',
	},
	{
		name: 'bird',
		categories: 'noun;animal',
	},
	{
		name: 'blood',
		categories: 'noun;anatomy',
	},
	{
		name: 'brain',
		categories: 'noun;anatomy',
	},
	{
		name: 'breast',
		categories: 'noun;anatomy',
	},
	{
		name: 'bone',
		categories: 'noun;anatomy',
	},
	{
		name: 'bowels',
		categories: 'noun;anatomy',
	},
	{
		name: 'butt',
		categories: 'noun;anatomy',
	},
	{
		name: 'cheek',
		categories: 'noun;anatomy',
	},
	{
		name: 'chest',
		categories: 'noun;anatomy',
	},
	{
		name: 'chin',
		categories: 'noun;anatomy',
	},
	{
		name: 'community',
		categories: 'noun;society',
	},
	{
		name: 'ear',
		categories: 'noun;anatomy',
	},
	{
		name: 'eye',
		categories: 'noun;anatomy',
	},
	{
		name: 'face',
		categories: 'noun;anatomy',
	},
	{
		name: 'feather',
		categories: 'noun;anatomy',
	},
	{
		name: 'fingernail',
		categories: 'noun;anatomy',
	},
	{
		name: 'fire',
		categories: 'noun',
	},
	{
		name: 'foliage',
		categories: 'noun;plant',
	},
	{
		name: 'foot',
		categories: 'noun;anatomy',
	},
	{
		name: 'forehead',
		categories: 'noun;anatomy',
	},
	{
		name: 'four.fingers',
		categories: 'noun;anatomy',
	},
	{
		name: 'front',
		categories: 'noun',
	},
	{
		name: 'gift',
		categories: 'noun',
	},
	{
		name: 'ground',
		categories: 'noun',
	},
	{
		name: 'hand',
		categories: 'noun;anatomy',
	},
	{
		name: 'head',
		categories: 'noun;anatomy',
	},
	{
		name: 'heart',
		categories: 'noun;anatomy',
	},
	{
		name: 'heel',
		categories: 'noun;anatomy',
	},
	{
		name: 'hip',
		categories: 'noun;anatomy',
	},
	{
		name: 'hoof',
		categories: 'noun;anatomy',
	},
	{
		name: 'horn',
		categories: 'noun;anatomy',
	},
	{
		name: 'intestines',
		categories: 'noun;anatomy',
	},
	{
		name: 'jaw',
		categories: 'noun;anatomy',
	},
	{
		name: 'kidney',
		categories: 'noun;anatomy',
	},
	{
		name: 'knee',
		categories: 'noun;anatomy',
	},
	{
		name: 'liver',
		categories: 'noun;anatomy',
	},
	{
		name: 'lung',
		categories: 'noun;anatomy',
	},
	{
		name: 'marrow',
		categories: 'noun;anatomy',
	},
	{
		name: 'month',
		categories: 'noun;time',
	},
	{
		name: 'moon',
		categories: 'noun;celestial.object',
	},
	{
		name: 'mountain',
		categories: 'noun',
	},
	{
		name: 'mouth',
		categories: 'noun;anatomy',
	},
	{
		name: 'navel',
		categories: 'noun;anatomy',
	},
	{
		name: 'nose',
		categories: 'noun;anatomy',
	},
	{
		name: 'peg',
		categories: 'noun',
	},
	{
		name: 'penis',
		categories: 'noun;anatomy',
	},
	{
		name: 'rain',
		categories: 'noun;weather',
	},
	{
		name: 'rib',
		categories: 'noun;anatomy',
	},
	{
		name: 'root',
		categories: 'noun;plant',
	},
	{
		name: 'row.of.teeth',
		categories: 'noun;anatomy',
	},
	{
		name: 'sacrifice.n',
		categories: 'noun;religion',
	},
	{
		name: 'shoulder',
		categories: 'noun;anatomy',
	},
	{
		name: 'stomach',
		categories: 'noun;anatomy',
	},
	{
		name: 'stone',
		categories: 'noun',
	},
	{
		name: 'sun',
		categories: 'noun;celestial.object',
	},
	{
		name: 'tear.eye',
		categories: 'noun;anatomy',
	},
	{
		name: 'teat',
		categories: 'noun;anatomy',
	},
	{
		name: 'testicle',
		categories: 'noun;anatomy',
	},
	{
		name: 'tongue',
		categories: 'noun;anatomy',
	},
	{
		name: 'tooth',
		categories: 'noun;anatomy',
	},
	{
		name: 'top',
		categories: 'noun',
	},
	{
		name: 'udder',
		categories: 'noun;anatomy',
	},
	{
		name: 'upper.thigh',
		categories: 'noun;anatomy',
	},
	{
		name: 'vulva',
		categories: 'noun;anatomy',
	},
	{
		name: 'water',
		categories: 'noun',
	},
	{
		name: 'wind',
		categories: 'noun',
	},
	{
		name: 'wing',
		categories: 'noun;anatomy',
	},
	{
		name: 'woman',
		categories: 'noun;person',
	},
	{
		name: 'year',
		categories: 'noun;time',
	},
	// verbs
	{
		name: 'be',
		categories: 'verb',
	},
	{
		name: 'be.aware',
		categories: 'verb',
	},
	{
		name: 'bite',
		categories: 'verb',
	},
	{
		name: 'come',
		categories: 'verb;motion',
	},
	{
		name: 'do',
		categories: 'verb',
	},
	{
		name: 'drink',
		categories: 'verb',
	},
	{
		name: 'eat',
		categories: 'verb',
	},
	{
		name: 'exclaim',
		categories: 'verb;language',
	},
	{
		name: 'fall',
		categories: 'verb;motion',
	},
	{
		name: 'flow',
		categories: 'verb',
	},
	{
		name: 'fly',
		categories: 'verb;motion',
	},
	{
		name: 'give',
		categories: 'verb',
	},
	{
		name: 'go',
		categories: 'verb;motion',
	},
	{
		name: 'hear',
		categories: 'verb',
	},
	{
		name: 'lay',
		categories: 'verb',
	},
	{
		name: 'lie.down',
		categories: 'verb',
	},
	{
		name: 'listen',
		categories: 'verb',
	},
	{
		name: 'look',
		categories: 'verb',
	},
	{
		name: 'make',
		categories: 'verb',
	},
	{
		name: 'perceive',
		categories: 'verb',
	},
	{
		name: 'pronounce',
		categories: 'verb;language',
	},
	{
		name: 'run',
		categories: 'verb;motion',
	},
	{
		name: 'see',
		categories: 'verb',
	},
	{
		name: 'sit',
		categories: 'verb',
	},
	{
		name: 'stand',
		categories: 'verb',
	},
	{
		name: 'stay',
		categories: 'verb',
	},
	{
		name: 'spread.out',
		categories: 'verb',
	},
	{
		name: 'step',
		categories: 'verb',
	},
	{
		name: 'stumble',
		categories: 'verb',
	},
	{
		name: 'take',
		categories: 'verb',
	},
	{
		name: 'urinate',
		categories: 'verb;anatomy',
	},
	{
		name: 'walk',
		categories: 'verb;motion',
	},
	{
		name: 'write',
		categories: 'verb;language',
	},
	// derivational morphemes
	{
		name: '*>adj.contrastive',
		categories: 'affix',
	},
	{
		name: '*>body.part',
		categories: 'affix;anatomy',
	},
	{
		name: '*>n', // nominalizer
		categories: 'affix',
	},
	{
		name: 'v>n', // v. -> n.
		categories: 'affix',
	},
	{
		name: 'v>n.agent', // v. -> agent n.
		categories: 'affix',
	},
];

const entryData = [
	// eremoran (sample)
	/*
	{
		language: 'eremoran',
		word: 'id',
		meanings: 'one;some.certain;or.excl',
		etymology: 'proto-eremo-numoran:id',
		source: 'mocha',
		notes: 'this is a sample entry',
	},
	*/
	// PIE
	{
		language: 'pie',
		word: 'bʰeh₂ǵʰús',
		meanings: 'arm',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'dáḱru',
		meanings: 'tear.eye',
		etymology: 'pie:derḱ-;pie:h₂éḱru',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'deh₃-',
		meanings: 'give',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'déh₃tis',
		meanings: 'gift',
		etymology: 'pie:deh₃-;pie:-tis',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'déḱm̥',
		meanings: 'ten',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'derḱ-',
		meanings: 'see',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'dn̥ǵʰwéh₂s',
		meanings: 'tongue',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'dóws',
		meanings: 'arm',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'dwóh₁',
		meanings: 'two',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'éǵh₂',
		meanings: '1s',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'gʷeh₂-',
		meanings: 'step;go;stand',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'gʷem-',
		meanings: 'step;go;stand',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'ǵénus',
		meanings: 'cheek;jaw;chin',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'ǵʰer-',
		meanings: 'bowels;intestines',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'ǵʰes-',
		meanings: 'hand;take;give',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'ǵʰéslom',
		meanings: 'thousand',
		etymology: 'pie:ǵʰes-;pie:-lom',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'ǵʰésōr',
		meanings: 'hand',
		etymology: 'pie:ǵʰes-;pie:-ōr',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'ǵómbʰos',
		meanings: 'tooth;row.of.teeth;peg',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'ǵónu',
		meanings: 'knee',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'h₃dónts',
		meanings: 'tooth',
		etymology: 'pie:h₃ed-;pie:-ónts',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'h₃ed-',
		meanings: 'bite',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'h₂eḱ-',
		meanings: 'sharp',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'h₃ekʷ-',
		meanings: 'see;eye',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'h₂éḱru',
		meanings: 'tear.eye',
		etymology: 'pie:h₂eḱ-',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'h₁énos',
		meanings: 'yon',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'h₂ent-',
		meanings: 'face;forehead;front',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'h₂énts',
		meanings: 'forehead;front',
		etymology: 'pie:h₂ent-;pie:-s',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'h₂entíos',
		meanings: 'front;forehead',
		etymology: 'pie:h₂ent-',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'h₁ésh₂r̥',
		meanings: 'blood',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'h₃ésth₁',
		meanings: 'bone',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'h₂ew-',
		meanings: 'perceive;see;be.aware',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'h₂éwis',
		meanings: 'bird',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'h₃meyǵʰ-',
		meanings: 'urinate',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'h₁néwn̥',
		meanings: 'nine',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'h₃nóbʰōl',
		meanings: 'navel',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'h₃nṓgʰs',
		meanings: 'fingernail',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'h₃ókʷs',
		meanings: 'eye',
		etymology: 'pie:h₃ekʷ-;pie:-s',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: '(H)oḱto-',
		meanings: 'four.fingers',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'h₁óh₃s',
		meanings: 'mouth',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'h₂ṓms',
		meanings: 'shoulder',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'h₄órǵʰis',
		meanings: 'testicle',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'h₁ówHdʰr̥',
		meanings: 'udder',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'h₂ṓws',
		meanings: 'ear',
		etymology: 'pie:h₂ew-;pie:-s',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'ís',
		meanings: '3s',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'káput',
		meanings: 'head',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: '-kʷe',
		meanings: 'and',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'ḱḗr',
		meanings: 'heart',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'ḱerh₂-',
		meanings: 'head;top;horn',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'kʷetwóres',
		meanings: 'four',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'kʷís',
		meanings: 'what;who;which',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'ḱlównis',
		meanings: 'butt;hip',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'ḱm̥tóm',
		meanings: 'hundred',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'ḱoph₂ós',
		meanings: 'hoof',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'kréwh₂s',
		meanings: 'blood',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'meh₁',
		meanings: 'PROH',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'mḗh₁n̥s',
		meanings: 'moon;month',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: '-mō',
		meanings: 'v>n.agent',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'mosgʰós',
		meanings: 'marrow;brain',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'ne',
		meanings: 'NEG',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'negʷʰrós',
		meanings: 'kidney',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'néh₂s',
		meanings: 'nose',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'oḱtṓw',
		meanings: 'eight',
		etymology: 'pie:(H)oḱto-',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: '-ónts',
		meanings: '*>body.part',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'óynos',
		meanings: 'one',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'ped-',
		meanings: 'walk;step;stumble;fall',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'penkʷ-',
		meanings: 'hand',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'pénkʷe',
		meanings: 'five',
		etymology: 'pie:penkʷ-',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'pérḱus',
		meanings: 'chest;rib',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'pes-',
		meanings: 'penis',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'peth₂-',
		meanings: 'spread.out;fly',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'péth₂r̥',
		meanings: 'wing;feather',
		etymology: 'pie:peth₂-;pie:-r̥',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'písdeh₂',
		meanings: 'vulva',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'plew-',
		meanings: 'fly;flow;run',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'pléwmō',
		meanings: 'lung',
		etymology: 'pie:plew-;pie:-mō',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'pṓds',
		meanings: 'foot',
		etymology: 'pie:ped-;pie:-s',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'pstḗn',
		meanings: 'breast;teat',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: '-r̥',
		meanings: '*>n',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: '-s',
		meanings: '*>n',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'sḗm',
		meanings: 'one',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'septḿ̥',
		meanings: 'seven',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'só',
		meanings: 'this;that',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'sóh₂wl̥',
		meanings: 'sun',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'steh₂-',
		meanings: 'stand',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'swé',
		meanings: 'REFL',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'swéḱs',
		meanings: 'six',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: '-teros',
		meanings: '*>adj.contrastive',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: '-tis',
		meanings: 'v>n',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'tpḗrsneh₂',
		meanings: 'heel;upper.thigh',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'tréyes',
		meanings: 'three',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'túh₂',
		meanings: '2s',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'tuHsont-',
		meanings: 'thousand',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'úd',
		meanings: 'up;away;out',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'úderos',
		meanings: 'abdomen;stomach',
		etymology: 'pie:údteros',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'údteros',
		meanings: 'higher;upper',
		etymology: 'pie:úd;pie:-teros',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: '-wē',
		meanings: 'or',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'wéy',
		meanings: '1pl',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'yókʷr̥',
		meanings: 'liver',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'yós',
		meanings: 'that;who;which',
		source: 'wiktionary',
	},
	{
		language: 'pie',
		word: 'yū́',
		meanings: '2pl',
		source: 'wiktionary',
	},
	// proto-germanic
	{
		language: 'pger',
		word: 'ainaz',
		meanings: 'one;some.quelques',
		etymology: 'pie:óynos',
		source: 'wiktionary',
	},
	{
		language: 'pger',
		word: 'ek',
		meanings: '1s',
		etymology: 'pie:éǵh₂',
		source: 'wiktionary',
	},
	{
		language: 'pger',
		word: 'fedwōr',
		meanings: 'four',
		etymology: 'pie:kʷetwóres',
		source: 'wiktionary',
	},
	{
		language: 'pger',
		word: 'fimf',
		meanings: 'five',
		etymology: 'pie:pénkʷe',
		source: 'wiktionary',
	},
	{
		language: 'pger',
		word: 'jūz',
		meanings: '2pl',
		etymology: 'pie:yū́',
		source: 'wiktionary',
	},
	{
		language: 'pger',
		word: 'nabalô',
		meanings: 'navel',
		etymology: 'pie:h₃nóbʰōl',
		source: 'wiktionary',
	},
	{
		language: 'pger',
		word: 'sek',
		meanings: 'REFL',
		etymology: 'pie:swé',
		source: 'wiktionary',
	},
	{
		language: 'pger',
		word: 'þrīz',
		meanings: 'navel',
		etymology: 'pie:tréyes',
		source: 'wiktionary',
	},
	{
		language: 'pger',
		word: 'þū',
		meanings: '2s',
		etymology: 'pie:túh₂',
		source: 'wiktionary',
	},
	{
		language: 'pger',
		word: 'twai',
		meanings: 'navel',
		etymology: 'pie:dwóh₁',
		source: 'wiktionary',
	},
	{
		language: 'pger',
		word: 'wīz',
		meanings: '1pl',
		etymology: 'pie:wéy',
		source: 'wiktionary',
	},
	// proto-west germanic
	{
		language: 'pwger',
		word: 'ain',
		meanings: 'one',
		etymology: 'pger:ainaz',
		source: 'wiktionary',
	},
	{
		language: 'pwger',
		word: 'fauwar',
		meanings: 'four',
		etymology: 'pger:fedwōr',
		source: 'wiktionary',
	},
	{
		language: 'pwger',
		word: 'fimf',
		meanings: 'five',
		etymology: 'pger:fimf',
		source: 'wiktionary',
	},
	{
		language: 'pwger',
		word: 'ik',
		meanings: '1s',
		etymology: 'pger:ek',
		source: 'wiktionary',
	},
	{
		language: 'pwger',
		word: 'jiʀ',
		meanings: '2pl',
		etymology: 'pger:jūz',
		source: 'wiktionary',
	},
	{
		language: 'pwger',
		word: 'nabulō',
		meanings: 'navel',
		etymology: 'pger:nabalô',
		source: 'wiktionary',
	},
	{
		language: 'pwger',
		word: 'sik',
		meanings: 'REFL',
		etymology: 'pger:sek',
		source: 'wiktionary',
	},
	{
		language: 'pwger',
		word: 'twai-',
		meanings: 'two',
		etymology: 'pger:twai',
		source: 'wiktionary',
	},
	{
		language: 'pwger',
		word: 'þrīʀ',
		meanings: 'three',
		etymology: 'pger:þrīz',
		source: 'wiktionary',
	},
	{
		language: 'pwger',
		word: 'þū',
		meanings: '2s',
		etymology: 'pger:þū',
		source: 'wiktionary',
	},
	{
		language: 'pwger',
		word: 'wiʀ',
		meanings: '1pl',
		etymology: 'pger:wīz',
		source: 'wiktionary',
	},
	// OE
	{
		language: 'oe',
		word: 'ān',
		meanings: 'one;an;only.adj;alone',
		etymology: 'pwger:ain',
		source: 'wiktionary',
	},
	{
		language: 'oe',
		word: 'fēower',
		meanings: 'four',
		etymology: 'pwger:feuwar',
		source: 'wiktionary',
	},
	{
		language: 'oe',
		word: 'fīf',
		meanings: 'five',
		etymology: 'pwger:fimf',
		source: 'wiktionary',
	},
	{
		language: 'oe',
		word: 'ġē',
		meanings: '2pl',
		etymology: 'pwger:jiʀ',
		source: 'wiktionary',
	},
	{
		language: 'oe',
		word: 'iċ',
		meanings: '1s',
		etymology: 'pwger:ik',
		source: 'wiktionary',
	},
	{
		language: 'oe',
		word: 'nafola',
		meanings: 'navel',
		etymology: 'pwger:nabulō',
		source: 'wiktionary',
	},
	{
		language: 'oe',
		word: 'þrī',
		meanings: 'three',
		etymology: 'pwger:þrīʀ',
		source: 'wiktionary',
	},
	{
		language: 'oe',
		word: 'þū',
		meanings: '2s',
		etymology: 'pwger:þū',
		source: 'wiktionary',
	},
	{
		language: 'oe',
		word: 'twēġen',
		meanings: 'two',
		etymology: 'pwger:twai-',
		source: 'wiktionary',
	},
	{
		language: 'oe',
		word: 'wē',
		meanings: '1pl',
		etymology: 'pwger:wiʀ',
		source: 'wiktionary',
	},
	// Proto-Vasconic
	{
		language: 'proto-vasconic',
		word: 'bade',
		meanings: 'one',
		source: shortcuts.edob,
	},
	{
		language: 'proto-vasconic',
		word: '-ban-',
		meanings: 'give',
		source: shortcuts.edob,
	},
	{
		language: 'proto-vasconic',
		word: 'bederatzu',
		meanings: 'nine',
		source: shortcuts.edob,
	},
	{
		language: 'proto-vasconic',
		word: 'beso',
		meanings: 'and',
		source: shortcuts.edob,
	},
	{
		language: 'proto-vasconic',
		word: 'biga',
		meanings: 'two',
		source: shortcuts.edob,
	},
	{
		language: 'proto-vasconic',
		word: 'bizkar',
		meanings: 'back',
		source: shortcuts.edob,
	},
	{
		language: 'proto-vasconic',
		word: 'bortz',
		meanings: 'five',
		source: shortcuts.edob,
	},
	{
		language: 'proto-vasconic',
		word: 'eta',
		meanings: 'and',
		source: shortcuts.edob,
	},
	{
		language: 'proto-vasconic',
		word: 'ez',
		meanings: 'NEG',
		source: shortcuts.edob,
	},
	{
		language: 'proto-vasconic',
		word: '-gin-',
		meanings: 'make;do',
		source: shortcuts.edob,
	},
	{
		language: 'proto-vasconic',
		word: 'gu',
		meanings: '1pl',
		source: shortcuts.edob,
	},
	{
		language: 'proto-vasconic',
		word: '[h]anbar',
		meanings: 'ten',
		source: shortcuts.edob,
	},
	{
		language: 'proto-vasconic',
		word: '[h]i',
		meanings: '2s',
		source: shortcuts.edob,
	},
	{
		language: 'proto-vasconic',
		word: '[h]irur',
		meanings: 'three',
		source: shortcuts.edob,
	},
	{
		language: 'proto-vasconic',
		word: '-(i)zan-',
		meanings: 'be',
		source: shortcuts.edob,
	},
	{
		language: 'proto-vasconic',
		word: 'laur',
		meanings: 'four',
		source: shortcuts.edob,
	},
	{
		language: 'proto-vasconic',
		word: 'ni',
		meanings: '1s',
		source: shortcuts.edob,
	},
	{
		language: 'proto-vasconic',
		word: 'sei',
		meanings: 'six',
		source: shortcuts.edob,
	},
	{
		language: 'proto-vasconic',
		word: 'su',
		meanings: 'fire',
		source: shortcuts.edob,
	},
	{
		language: 'proto-vasconic',
		word: 'ur',
		meanings: 'water',
		source: shortcuts.edob,
	},
	{
		language: 'proto-vasconic',
		word: 'zazpi',
		meanings: 'seven',
		source: shortcuts.edob,
	},
	{
		language: 'proto-vasconic',
		word: 'zortzi',
		meanings: 'eight',
		source: shortcuts.edob,
	},
	{
		language: 'proto-vasconic',
		word: 'zu',
		meanings: '2pl',
		source: shortcuts.edob,
	},
	// etruscan
	{
		language: 'etruscan',
		word: '-(a)cvil',
		meanings: 'gift',
		etymology: 'proto-tyrsenian:akvil',
		source: 'wiktionary',
	},
	{
		language: 'etruscan',
		word: 'am-',
		meanings: 'be',
		source: 'wiktionary',
	},
	{
		language: 'etruscan',
		word: 'an',
		meanings: 'he;she',
		source: 'wiktionary',
	},
	{
		language: 'etruscan',
		word: '-(a)r',
		meanings: 'PL',
		etymology: 'proto-tyrsenian:-r',
		source: 'wiktionary',
	},
	{
		language: 'etruscan',
		word: 'cer-',
		meanings: 'make',
		source: 'wiktionary',
	},
	{
		language: 'etruscan',
		word: 'cezp',
		meanings: 'eight',
		source: 'wiktionary',
	},
	{
		language: 'etruscan',
		word: 'ci',
		meanings: 'three',
		source: 'wiktionary',
	},
	{
		language: 'etruscan',
		word: 'ein',
		meanings: '3pl',
		source: 'wiktionary',
	},
	{
		language: 'etruscan',
		word: 'huθ',
		meanings: 'four',
		source: 'wiktionary',
	},
	{
		language: 'etruscan',
		word: '-(i)a',
		meanings: 'GEN',
		etymology: 'proto-tyrsenian:-(i)a',
		source: 'wiktionary',
	},
	{
		language: 'etruscan',
		word: 'in',
		meanings: 'it',
		source: 'wiktionary',
	},
	{
		language: 'etruscan',
		word: 'ipa',
		meanings: 'what',
		source: 'wiktionary',
	},
	{
		language: 'etruscan',
		word: 'maχ',
		meanings: 'five',
		source: 'wiktionary',
	},
	{
		language: 'etruscan',
		word: 'mi',
		meanings: '1s',
		etymology: 'proto-tyrsenian:mi',
		source: 'wiktionary',
	},
	{
		language: 'etruscan',
		word: 'mir',
		meanings: '1pl',
		etymology: 'etruscan:mi;etruscan:-(a)r',
		source: 'wiktionary',
	},
	{
		language: 'etruscan',
		word: 'neri',
		meanings: 'water',
		source: 'wiktionary',
	},
	{
		language: 'etruscan',
		word: 'nurφ',
		meanings: 'nine',
		source: 'wiktionary',
	},
	{
		language: 'etruscan',
		word: '-s',
		meanings: 'GEN',
		etymology: 'proto-tyrsenian:-s',
		source: 'wiktionary',
	},
	{
		language: 'etruscan',
		word: 'śa',
		meanings: 'six',
		source: 'wiktionary',
	},
	{
		language: 'etruscan',
		word: 'śar',
		meanings: 'ten',
		source: 'wiktionary',
	},
	{
		language: 'etruscan',
		word: 'semφ',
		meanings: 'seven',
		source: 'wiktionary',
	},
	{
		language: 'etruscan',
		word: 'θi',
		meanings: 'water',
		source: 'wiktionary',
	},
	{
		language: 'etruscan',
		word: 'θu',
		meanings: 'one',
		source: 'wiktionary',
	},
	{
		language: 'etruscan',
		word: 'tur-',
		meanings: 'give',
		source: 'wiktionary',
	},
	{
		language: 'etruscan',
		word: 'un',
		meanings: '2s',
		source: 'wiktionary',
	},
	{
		language: 'etruscan',
		word: 'unu',
		meanings: '2pl',
		source: 'wiktionary',
	},
	{
		language: 'etruscan',
		word: 'vers-',
		meanings: 'fire',
		source: 'wiktionary',
	},
	{
		language: 'etruscan',
		word: 'zal',
		meanings: 'two',
		etymology: 'proto-tyrsenian:zal',
		source: 'wiktionary',
	},
	{
		language: 'etruscan',
		word: 'ziχ-',
		meanings: 'write',
		source: 'wiktionary',
	},
	// rhaetian
	{
		language: 'rhaetian',
		word: 'akvil',
		meanings: 'gift',
		etymology: 'proto-tyrsenian:akvil',
		source: 'wiktionary',
	},
	{
		language: 'rhaetian',
		word: 'eluku',
		meanings: 'sacrifice.n',
		source: shortcuts.rhaetian,
	},
	{
		language: 'rhaetian',
		word: '-(i)a',
		meanings: 'GEN',
		etymology: 'proto-tyrsenian:-(i)a',
		source: 'wiktionary',
	},
	{
		language: 'rhaetian',
		word: '-ka',
		meanings: 'and',
		source: shortcuts.rhaetian,
	},
	{
		language: 'rhaetian',
		word: '-le',
		meanings: 'GEN',
		source: shortcuts.rhaetian,
	},
	{
		language: 'rhaetian',
		word: 'mi',
		meanings: '1s',
		source: shortcuts.rhaetian,
	},
	{
		language: 'rhaetian',
		word: '-r(a)',
		meanings: 'PL',
		etymology: 'proto-tyrsenian:-s',
		source: 'wiktionary',
	},
	{
		language: 'rhaetian',
		word: '-s',
		meanings: 'GEN',
		etymology: 'proto-tyrsenian:-s',
		source: 'wiktionary',
	},
	{
		language: 'rhaetian',
		word: '-si',
		meanings: 'GEN',
		etymology: 'proto-tyrsenian:-s',
		source: shortcuts.rhaetian,
	},
	{
		language: 'rhaetian',
		word: 'sφura',
		meanings: 'community',
		source: shortcuts.rhaetian,
	},
	{
		language: 'rhaetian',
		word: 'ta',
		meanings: 'this',
		source: shortcuts.rhaetian,
	},
	{
		language: 'rhaetian',
		word: '-u',
		meanings: 'v>n',
		source: shortcuts.rhaetian,
	},
	{
		language: 'rhaetian',
		word: 'zal',
		meanings: 'two',
		etymology: 'proto-tyrsenian:zal',
		source: 'wiktionary',
	},
	// proto-tyrsenian
	{
		language: 'proto-tyrsenian',
		word: 'akvil',
		meanings: 'gift',
		source: 'mocha',
	},
	{
		language: 'proto-tyrsenian',
		word: '-(i)a',
		meanings: 'GEN',
		source: 'mocha',
	},
	{
		language: 'proto-tyrsenian',
		word: 'mi',
		meanings: '1s',
		source: 'mocha',
	},
	{
		language: 'proto-tyrsenian',
		word: '-r',
		meanings: 'PL',
		source: 'mocha',
	},
	{
		language: 'proto-tyrsenian',
		word: '-s',
		meanings: 'GEN',
		source: 'mocha',
	},
	{
		language: 'proto-tyrsenian',
		word: 'zal',
		meanings: 'two',
		source: 'mocha',
	},
	// proto-uralic
	{
		language: 'proto-uralic',
		word: 'kakta',
		meanings: 'two',
		source: 'uralonet',
	},
	{
		language: 'proto-uralic',
		word: 'kolme',
		meanings: 'three',
		source: 'uralonet',
	},
	{
		language: 'proto-uralic',
		word: 'küme',
		meanings: 'ten',
		source: 'uralonet',
	},
	{
		language: 'proto-uralic',
		word: 'kutte',
		meanings: 'six',
		source: 'uralonet',
	},
	{
		language: 'proto-uralic',
		word: 'neljä',
		meanings: 'four',
		source: 'uralonet',
	},
	{
		language: 'proto-uralic',
		word: 'śäjćem',
		meanings: 'seven',
		source: 'uralonet',
	},
	{
		language: 'proto-uralic',
		word: 'ükte',
		meanings: 'one',
		source: 'uralonet',
	},
	{
		language: 'proto-uralic',
		word: 'ükteksä',
		meanings: 'nine',
		source: 'uralonet',
	},
	{
		language: 'proto-uralic',
		word: 'witte',
		meanings: 'five',
		source: 'uralonet',
	},
	// pnwc
	{
		language: 'pnwc',
		word: 'bć’ʷə',
		meanings: 'ten',
		source: 'wiktionary',
	},
	{
		language: 'pnwc',
		word: 'bδə',
		meanings: 'seven',
		source: 'wiktionary',
	},
	{
		language: 'pnwc',
		word: 'bğʷʲə',
		meanings: 'nine',
		source: 'wiktionary',
	},
	{
		language: 'pnwc',
		word: 'λ:ə',
		meanings: 'three',
		source: 'wiktionary',
	},
	{
		language: 'pnwc',
		word: 'ɬʷə',
		meanings: 'six',
		source: 'wiktionary',
	},
	{
		language: 'pnwc',
		word: 'p’λ’a',
		meanings: 'four',
		source: 'wiktionary',
	},
	{
		language: 'pnwc',
		word: 'sx̂ʷə',
		meanings: 'five',
		source: 'wiktionary',
	},
	{
		language: 'pnwc',
		word: 't’qʷ’a',
		meanings: 'two',
		source: 'wiktionary',
	},
	{
		language: 'pnwc',
		word: '(w/y)ɣə/a',
		meanings: 'eight',
		source: 'wiktionary',
	},
	{
		language: 'pnwc',
		word: 'za',
		meanings: 'one',
		source: 'wiktionary',
	},
	// pnec
	{
		language: 'pnec',
		word: 'bǖnŁ_e',
		meanings: 'eight',
		source: 'starling',
	},
	{
		language: 'pnec',
		word: 'cV',
		meanings: 'one',
		source: 'wiktionary',
	},
	{
		language: 'pnec',
		word: 'hĕmq̇ɨ',
		meanings: 'four',
		source: 'starling',
	},
	{
		language: 'pnec',
		word: 'ʡĕnc̣Ĕ',
		meanings: 'ten',
		source: 'starling',
	},
	{
		language: 'pnec',
		word: 'ʡĕrŁ_ɨ̆',
		meanings: 'seven',
		source: 'starling',
	},
	{
		language: 'pnec',
		word: 'ʔĭlć̣wɨ',
		meanings: 'nine',
		source: 'starling',
	},
	{
		language: 'pnec',
		word: 'ʔrǟnƛ_E',
		meanings: 'six',
		source: 'starling',
	},
	{
		language: 'pnec',
		word: 'ƛHĕ',
		meanings: 'three',
		source: 'starling',
	},
	{
		language: 'pnec',
		word: 'ƛƛwi',
		meanings: 'five',
		source: 'wiktionary',
	},
	{
		language: 'pnec',
		word: 'q̇Hwǟ',
		meanings: 'five',
		source: 'starling',
	},
	// kartvelian
	{
		language: 'proto-kartvelian',
		word: 'arwa-',
		meanings: 'eight',
		etymology: 'proto-semitic:ʔarbaʕ-',
		source: 'wiktionary',
	},
	{
		language: 'proto-kartvelian',
		word: 'at',
		meanings: 'ten',
		source: 'wiktionary',
	},
	{
		language: 'proto-kartvelian',
		word: 'c̣q̇al-',
		meanings: 'water',
		source: 'wiktionary',
	},
	{
		language: 'proto-kartvelian',
		word: 'čwen',
		meanings: '1pl',
		source: 'wiktionary',
	},
	{
		language: 'proto-kartvelian',
		word: 'c₁xar-',
		meanings: 'nine',
		source: 'wiktionary',
	},
	{
		language: 'proto-kartvelian',
		word: 'eks₁w-',
		meanings: 'six',
		etymology: 'pie:swéḱs',
		source: 'wiktionary',
	},
	{
		language: 'proto-kartvelian',
		word: 'ert-',
		meanings: 'one',
		source: 'wiktionary',
		notes: 'Proto-Georgian-Zan',
	},
	{
		language: 'proto-kartvelian',
		word: 'jor-',
		meanings: 'two',
		source: 'wiktionary',
	},
	{
		language: 'proto-kartvelian',
		word: 'ma-',
		meanings: 'what',
		source: 'starling',
	},
	{
		language: 'proto-kartvelian',
		word: 'me',
		meanings: '1s',
		source: 'wiktionary',
	},
	{
		language: 'proto-kartvelian',
		word: 'otxo-',
		meanings: 'four',
		etymology: 'pie:oḱtṓw',
		source: 'wiktionary',
	},
	{
		language: 'proto-kartvelian',
		word: 'sam-',
		meanings: 'three',
		source: 'wiktionary',
	},
	{
		language: 'proto-kartvelian',
		word: 'š(w)en-',
		meanings: '2s',
		source: 'wiktionary',
	},
	{
		language: 'proto-kartvelian',
		word: 'šwid-',
		meanings: 'seven',
		source: 'wiktionary',
	},
	{
		language: 'proto-kartvelian',
		word: 'tkwen-',
		meanings: '2pl',
		source: 'wiktionary',
	},
	{
		language: 'proto-kartvelian',
		word: 'xut-',
		meanings: 'five',
		source: 'wiktionary',
	},
	{
		language: 'proto-kartvelian',
		word: 'ʒećx-',
		meanings: 'fire',
		source: 'starling',
	},
	// proto-semitic
	{
		language: 'proto-semitic',
		word: 'ḫamš-',
		meanings: 'five',
		source: 'wiktionary',
	},
	{
		language: 'proto-semitic',
		word: 'ʔarbaʕ-',
		meanings: 'four',
		source: 'wiktionary',
	},
	{
		language: 'proto-semitic',
		word: 'ʕaśar-',
		meanings: 'ten',
		etymology: 'proto-afro-asiatic:ʕaĉir-',
		source: 'wiktionary',
	},
	{
		language: 'proto-semitic',
		word: 'ʕašt-',
		meanings: 'one',
		source: 'wiktionary',
	},
	{
		language: 'proto-semitic',
		word: 'šabʕ-',
		meanings: 'seven',
		source: 'wiktionary',
	},
	{
		language: 'proto-semitic',
		word: 'šidṯ-',
		meanings: 'six',
		source: 'wiktionary',
	},
	{
		language: 'proto-semitic',
		word: 'ṯalāṯ-',
		meanings: 'three',
		source: 'wiktionary',
	},
	{
		language: 'proto-semitic',
		word: 'ṯamāniy-',
		meanings: 'eight',
		source: 'wiktionary',
	},
	{
		language: 'proto-semitic',
		word: 'ṯin-',
		meanings: 'two',
		etymology: 'proto-afro-asiatic:tsan-',
		source: 'wiktionary',
	},
	{
		language: 'proto-semitic',
		word: 'tišʕ-',
		meanings: 'nine',
		source: 'wiktionary',
	},
	// proto-afro-asiatic
	{
		language: 'proto-afro-asiatic',
		word: 'fâzw-',
		meanings: 'four',
		source: 'wiktionary',
	},
	{
		language: 'proto-afro-asiatic',
		word: 'ʕaĉir-',
		meanings: 'ten',
		source: 'starling',
	},
	{
		language: 'proto-afro-asiatic',
		word: 'tsan-',
		meanings: 'two',
		source: 'wiktionary',
	},
	{
		language: 'proto-afro-asiatic',
		word: 'xaynz-',
		meanings: 'three',
		source: 'wiktionary',
	},
	// hattic
	{
		language: 'hattic',
		word: '(a)nti',
		meanings: 'stand;stay',
		source: 'wiktionary',
	},
	{
		language: 'hattic',
		word: 'alef',
		meanings: 'tongue',
		source: 'wiktionary',
	},
	{
		language: 'hattic',
		word: 'aš',
		meanings: 'come',
		source: 'wiktionary',
	},
	{
		language: 'hattic',
		word: 'ašti',
		meanings: 'bird',
		source: 'wiktionary',
	},
	{
		language: 'hattic',
		word: 'eštan',
		meanings: 'sun',
		source: 'wiktionary',
	},
	{
		language: 'hattic',
		word: 'fa-',
		meanings: '1s',
		source: 'wiktionary',
	},
	{
		language: 'hattic',
		word: 'hu',
		meanings: 'exclaim;pronounce',
		source: 'wiktionary',
	},
	{
		language: 'hattic',
		word: 'hukur',
		meanings: 'see;look',
		source: 'wiktionary',
	},
	{
		language: 'hattic',
		word: 'imallen',
		meanings: 'this',
		source: 'wiktionary',
	},
	{
		language: 'hattic',
		word: 'kaiš',
		meanings: 'horn',
		source: 'wiktionary',
	},
	{
		language: 'hattic',
		word: 'kap',
		meanings: 'moon',
		source: 'wiktionary',
	},
	{
		language: 'hattic',
		word: 'kaš',
		meanings: 'head',
		source: 'wiktionary',
	},
	{
		language: 'hattic',
		word: 'kazza',
		meanings: 'red',
		source: 'wiktionary',
	},
	{
		language: 'hattic',
		word: 'liš',
		meanings: 'year',
		source: 'wiktionary',
	},
	{
		language: 'hattic',
		word: 'lin-',
		meanings: 'drink',
		source: 'wiktionary',
	},
	{
		language: 'hattic',
		word: 'malhip',
		meanings: 'good;favorable',
		source: 'wiktionary',
	},
	{
		language: 'hattic',
		word: 'nif',
		meanings: 'sit',
		source: 'wiktionary',
	},
	{
		language: 'hattic',
		word: 'nimah',
		meanings: 'eye',
		source: 'wiktionary',
	},
	{
		language: 'hattic',
		word: 'nimhu-',
		meanings: 'woman',
		source: 'wiktionary',
	},
	{
		language: 'hattic',
		word: 'nu-',
		meanings: 'come;go',
		source: 'wiktionary',
	},
	{
		language: 'hattic',
		word: 'pezil',
		meanings: 'wind',
		source: 'wiktionary',
	},
	{
		language: 'hattic',
		word: 'pip',
		meanings: 'stone',
		source: 'wiktionary',
	},
	{
		language: 'hattic',
		word: 'puluku',
		meanings: 'foliage',
		source: 'wiktionary',
	},
	{
		language: 'hattic',
		word: 'šahhu',
		meanings: 'ground',
		source: 'wiktionary',
	},
	{
		language: 'hattic',
		word: 'šaki-',
		meanings: 'heart',
		source: 'wiktionary',
	},
	{
		language: 'hattic',
		word: 'šam(a)',
		meanings: 'hear;listen',
		source: 'wiktionary',
	},
	{
		language: 'hattic',
		word: 'tahalai',
		meanings: 'liver',
		source: 'wiktionary',
	},
	{
		language: 'hattic',
		word: 'tataet',
		meanings: 'new',
		source: 'wiktionary',
	},
	{
		language: 'hattic',
		word: 'te',
		meanings: 'great;big',
		source: 'wiktionary',
	},
	{
		language: 'hattic',
		word: 'ti',
		meanings: 'lie.down;lay',
		source: 'wiktionary',
	},
	{
		language: 'hattic',
		word: 'tu',
		meanings: 'eat',
		source: 'wiktionary',
	},
	{
		language: 'hattic',
		word: 'tumil',
		meanings: 'rain',
		source: 'wiktionary',
	},
	{
		language: 'hattic',
		word: 'tup',
		meanings: 'root',
		source: 'wiktionary',
	},
	{
		language: 'hattic',
		word: 'we',
		meanings: '2s',
		source: 'wiktionary',
	},
	{
		language: 'hattic',
		word: 'yay',
		meanings: 'give',
		source: 'wiktionary',
	},
	{
		language: 'hattic',
		word: 'ziš',
		meanings: 'mountain',
		source: 'wiktionary',
	},
];