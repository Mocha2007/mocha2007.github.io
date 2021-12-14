/* exported data, phones */
'use strict';

const data = {
	MOA: [
		'nasal',
		'plosive',
		'fricative',
		'approximant',
		'trill',
	],
	POA: [
		'bilabial',
		'labiodental',
		'alveolar',
		'palatal',
		'velar',
		'labiovelar',
		'uvular',
		'glottal',
	],
};

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
		},
	},
	{
		name: 'r',
		properties: {
			manner: 'trill',
			place: 'alveolar',
			voiced: true,
			freq: 1332/3183,
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
		},
	},
	{
		name: 'z',
		properties: {
			manner: 'fricative',
			place: 'alveolar',
			voiced: true,
			freq: 893/3183,
		},
	},
];