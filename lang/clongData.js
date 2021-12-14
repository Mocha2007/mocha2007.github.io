/* exported data, phones, syllables */
'use strict';

/* further reading
	https://phoible.org/parameters
	https://typo.uni-konstanz.de/rara/category/universals-archive/
*/

const data = {
	filters: {
		consonant: x => !x.properties.isVowel,
		vowel: x => x.properties.isVowel,
	},
	MOA: [
		'nasal',
		'plosive',
		'affricate',
		'fricative',
		'approximant',
		'trill',
	],
	POA: [
		'bilabial',
		'labiodental',
		'alveolar',
		'postalveolar',
		'palatal',
		'velar',
		'labiovelar',
		'uvular',
		'glottal',
	],
};

const syllables = [
	// CV
	[
		[data.filters.consonant, data.filters.vowel],
		[true, true],
	],
	// (C)V
	[
		[data.filters.consonant, data.filters.vowel],
		[false, true],
	],
	// CV(C)
	[
		[data.filters.consonant, data.filters.vowel, data.filters.consonant],
		[true, true, false],
	],
	// (C)V(C)
	[
		[data.filters.consonant, data.filters.vowel, data.filters.consonant],
		[false, true, false],
	],
];

const phones = [
	{
		name: 'a',
		properties: {
			isVowel: true,
			freq: 2600/3183,
		},
	},
	{
		name: 'b',
		properties: {
			manner: 'plosive',
			place: 'bilabial',
			voiced: true,
			freq: 1906/3183,
			implications: ['m'],
		},
	},
	{
		name: 'c',
		properties: {
			manner: 'plosive',
			place: 'palatal',
			voiced: false,
			freq: 418/3183,
			implications: ['j', 'k', 't'],
		},
	},
	{
		name: 'd',
		properties: {
			manner: 'plosive',
			place: 'alveolar',
			voiced: true,
			freq: 1376/3183,
			implications: ['n'],
		},
	},
	{
		name: 'd̠ʒ',
		properties: {
			manner: 'affricate',
			place: 'postalveolar',
			voiced: true,
			freq: 820/3183,
			implications: ['j', 'g', 'd'], // guess. todo: verify
		},
	},
	{
		name: 'e',
		properties: {
			isVowel: true,
			freq: 1841/3183,
		},
	},
	{
		name: 'f',
		properties: {
			manner: 'fricative',
			place: 'labiodental',
			voiced: false,
			freq: 1329/3183,
		},
	},
	{
		name: 'g',
		properties: {
			manner: 'plosive',
			place: 'velar',
			voiced: true,
			freq: 1712/3183,
			implications: ['b'],
		},
	},
	{
		name: 'h',
		properties: {
			manner: 'approximant',
			place: 'glottal',
			voiced: false,
			freq: 1703/3183,
			implications: ['k'],
		},
	},
	{
		name: 'i',
		properties: {
			isVowel: true,
			freq: 2779/3183,
		},
	},
	{
		name: 'j',
		properties: {
			manner: 'approximant',
			place: 'palatal',
			voiced: true,
			freq: 2716/3183,
		},
	},
	{
		name: 'k',
		properties: {
			manner: 'plosive',
			place: 'velar',
			voiced: false,
			freq: 2730/3183,
		},
	},
	{
		name: 'l',
		properties: {
			manner: 'approximant',
			place: 'alveolar',
			voiced: true,
			lateral: true,
			freq: 2044/3183,
			implications: ['n'],
		},
	},
	{
		name: 'm',
		properties: {
			manner: 'nasal',
			place: 'bilabial',
			voiced: true,
			freq: 2914/3183,
		},
	},
	{
		name: 'n',
		properties: {
			manner: 'nasal',
			place: 'alveolar',
			voiced: true,
			freq: 2349/3183,
			implications: ['m'],
		},
	},
	{
		name: 'ŋ',
		properties: {
			manner: 'nasal',
			place: 'velar',
			voiced: true,
			freq: 1897/3183,
			implications: ['m', 'k'],
		},
	},
	{
		name: 'ɲ',
		properties: {
			manner: 'nasal',
			place: 'palatal',
			voiced: true,
			freq: 1255/3183,
			implications: ['n', 'j'],
		},
	},
	{
		name: 'o',
		properties: {
			isVowel: true,
			freq: 1826/3183,
		},
	},
	{
		name: 'p',
		properties: {
			manner: 'plosive',
			place: 'bilabial',
			voiced: false,
			freq: 2594/3183,
			implications: ['k'],
		},
	},
	{
		name: 'q',
		properties: {
			manner: 'plosive',
			place: 'uvular',
			voiced: false,
			freq: 256/3183,
			implications: ['h', 'k', 'x'],
		},
	},
	{
		name: 'r',
		properties: {
			manner: 'trill',
			place: 'alveolar',
			voiced: true,
			freq: 1332/3183,
			implications: ['n'],
		},
	},
	{
		name: 's',
		properties: {
			manner: 'fricative',
			place: 'alveolar',
			voiced: false,
			freq: 2020/3183,
		},
	},
	{
		name: 'ʃ',
		properties: {
			manner: 'fricative',
			place: 'postalveolar',
			voiced: false,
			freq: 1104/3183,
			implications: ['j', 's'], // guess. todo: verify
		},
	},
	{
		name: 't',
		properties: {
			manner: 'plosive',
			place: 'alveolar',
			voiced: false,
			freq: 2064/3183,
			implications: ['k'],
		},
	},
	{
		name: 't̠ʃ',
		properties: {
			manner: 'affricate',
			place: 'postalveolar',
			voiced: false,
			freq: 1218/3183,
			implications: ['j', 'k', 't'], // guess. todo: verify
		},
	},
	{
		name: 'u',
		properties: {
			isVowel: true,
			freq: 2646/3183,
		},
	},
	{
		name: 'v',
		properties: {
			manner: 'fricative',
			place: 'labiodental',
			voiced: true,
			freq: 816/3183,
			implications: ['b', 'f'],
		},
	},
	{
		name: 'w',
		properties: {
			manner: 'approximant',
			place: 'labiovelar',
			voiced: true,
			freq: 2483/3183,
			implications: ['j'],
		},
	},
	{
		name: 'x',
		properties: {
			manner: 'fricative',
			place: 'velar',
			voiced: false,
			freq: 576/3183,
			implications: ['k'],
		},
	},
	{
		name: 'y',
		properties: {
			isVowel: true,
			freq: 175/3183,
			implications: ['i', 'u'],
		},
	},
	{
		name: 'z',
		properties: {
			manner: 'fricative',
			place: 'alveolar',
			voiced: true,
			freq: 893/3183,
			implications: ['s'],
		},
	},
	{
		name: 'ʔ',
		properties: {
			manner: 'plosive',
			place: 'glottal',
			voiced: false,
			freq: 1131/3183,
			implications: ['k'], // todo guess
		},
	},
];