/* exported authorData, categoryData, entryData, languageData, meaningData, sourceData */
'use strict';

const authorData = [
	{
		name: 'mocha',
	},
	{
		name: 'wikimedia',
	},
];

const sourceData = [
	{
		name: 'mocha',
		author: 'mocha',
		url: 'https://mocha2007.github.io',
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
		name: 'pwger',
		parent: 'pger',
		location: 'northwest germany',
		period: 'c. 500 CE',
	},
	{
		name: 'oe',
		parent: 'pwger',
		location: 'england',
		period: 'c. 1000 CE',
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
		name: 'motion',
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
	// particles
	{
		name: 'NEG',
		categories: 'particle',
	},
	{
		name: 'PROH',
		categories: 'particle',
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
		name: 'higher',
		categories: 'adjective',
	},
	{
		name: 'only.adj',
		categories: 'adjective',
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
		name: 'four.fingers',
		categories: 'noun;anatomy',
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
		name: 'front',
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
		name: 'rib',
		categories: 'noun;anatomy',
	},
	{
		name: 'row.of.teeth',
		categories: 'noun;anatomy',
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
		name: 'wing',
		categories: 'noun;anatomy',
	},
	// verbs
	{
		name: 'be.aware',
		categories: 'verb',
	},
	{
		name: 'bite',
		categories: 'verb',
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
		name: 'perceive',
		categories: 'verb',
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
	// morphemes
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
		name: 'v>n.agent', // v. -> agent n.
		categories: 'affix',
	},
];

const entryData = [
	// eremoran (sample)
	{
		language: 'eremoran',
		word: 'id',
		meanings: 'one;some.certain;or.excl',
		etymology: 'proto-eremo-numoran:id',
		source: 'mocha',
		notes: 'this is a sample entry',
	},
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
	// proto-west germanic
	{
		language: 'pwger',
		word: 'ain',
		meanings: 'one',
		etymology: 'pger:ainaz',
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
];