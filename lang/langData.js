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
		name: 'verb',
	},
	// sets
	{
		name: 'anatomy',
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
	// conjunctions
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
		name: 'only.adj',
		categories: 'adjective',
	},
	// nouns
	{
		name: 'four.fingers',
		categories: 'noun;anatomy',
	},
	{
		name: 'hand',
		categories: 'noun;anatomy',
	},
	// verbs
	{
		name: 'give',
		categories: 'verb',
	},
	{
		name: 'take',
		categories: 'verb',
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
		word: 'déḱm̥',
		meanings: 'ten',
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
		word: 'h₁néwn̥',
		meanings: 'nine',
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
		word: 'kʷetwóres',
		meanings: 'four',
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
		word: 'oḱtṓw',
		meanings: 'eight',
		etymology: 'pie:(H)oḱto-',
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
		word: 'swéḱs',
		meanings: 'six',
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
		word: 'tuHsont-',
		meanings: 'thousand',
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