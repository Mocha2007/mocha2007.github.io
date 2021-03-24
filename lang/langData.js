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
];

const categoryData = [
	{
		name: 'numeral',
	},
];

const meaningData = [
	{
		name: 'one',
		categories: 'numeral',
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
		word: 'sḗm',
		meanings: 'one',
		source: 'wiktionary',
	},
];