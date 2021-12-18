/* exported data, phones, syllables, wordLists */
'use strict';

/* further reading
	https://phoible.org/parameters
	https://typo.uni-konstanz.de/rara/category/universals-archive/
*/

const data = {
	cases: {
		alignment: [
			['DIR'],
			['NOM', 'ACC'],
			['ABS', 'ERG'],
			['INTR', 'ERG', 'ACC'],
			['TRANS', 'INTR'],
		],
		numbers: ['S', 'PL', 'DU', 'PAUC', 'TRI'],
		other: [
			'DAT',
			'GEN',
			'ABL',
		],
	},
	filters: {
		approximant: x => x.properties.manner === 'approximant',
		approxOrLiquid(x){
			return data.filters.approximant(x) || data.filters.liquid(x);
		},
		consonant: x => !x.properties.isVowel,
		fricative: x => x.properties.manner === 'fricative',
		liquid: x => x.properties.lateral
			|| x.properties.manner === 'trill'
			|| x.properties.manner === 'tap',
		liquidOrS(x){
			return data.filters.liquid(x) || data.filters.s(x);
		},
		nasal: x => x.properties.manner === 'nasal',
		plosive: x => x.properties.manner === 'plosive',
		plosiveOrFricative(x){
			return data.filters.plosive(x) || data.filters.fricative(x);
		},
		s: x => x.name === 's',
		vowel: x => x.properties.isVowel,
	},
	implications: {
		/** these are all pass/fail. if it fails, it's rerolled.
		 * @type {((x: Phone[]) => boolean)[]}
		 */
		phonology: [
			// https://typo.uni-konstanz.de/rara/universals-archive/284/
			phonology => phonology.some(phone => phone.properties.place === 'postalveolar')
				? phonology.some(phone => phone.properties.place === 'alveolar')
				: true,
			// https://typo.uni-konstanz.de/rara/universals-archive/706/
			phonology => phonology.filter(phone => phone.properties.backness === 'central').length
				<= Math.max(phonology.filter(phone => phone.properties.backness === 'front').length,
					phonology.filter(phone => phone.properties.backness === 'back').length),
			// https://typo.uni-konstanz.de/rara/universals-archive/781/
			phonology => phonology.filter(phone => phone.properties.manner === 'plosive').length === 3
				? phonology.filter(phone => 'ptk'.includes(phone.name)).length === 3
				: true,
			// https://typo.uni-konstanz.de/rara/universals-archive/782/
			phonology => phonology.some(phone => phone.properties.manner === 'affricate')
				? 3 <= phonology.filter(phone => phone.properties.manner === 'plosive').length
				: true,
			// https://typo.uni-konstanz.de/rara/universals-archive/889/
			phonology => phonology.some(phone => phone.properties.backness === 'back' && !phone.properties.rounding)
				? phonology.some(phone => phone.properties.backness === 'front' && !phone.properties.rounding)
				: true,
			// https://typo.uni-konstanz.de/rara/universals-archive/923/
			// interpreted as "all languages have a voiceless labial"
			phonology => phonology.some(phone => !phone.properties.voiced && phone.properties.place.includes('labi')),
			// https://typo.uni-konstanz.de/rara/universals-archive/1014/
			phonology => {
				const labial = phonology.filter(phone => phone.properties.place.includes('labi'));
				const alveolar = phonology.filter(phone => phone.properties.place === 'alveolar');
				const velar = phonology.filter(phone => phone.properties.place.includes('velar'));
				return labial <= alveolar && velar <= alveolar;
			},
			// https://typo.uni-konstanz.de/rara/universals-archive/1331/
			phonology => 1 < phonology.filter(phone => phone.properties.isVowel).length,
			// todo later on when more advanced fxs are available:
			// https://typo.uni-konstanz.de/rara/universals-archive/798/
			// https://typo.uni-konstanz.de/rara/universals-archive/836/
			// todo for phone section:
			// palatal g https://typo.uni-konstanz.de/rara/universals-archive/1814/
			// t' https://typo.uni-konstanz.de/rara/universals-archive/1816/
		],
		syntax: [
			/* causes breaks; WALS contradicts both claims
			{
				name: 'UA15a',
				url: 'https://typo.uni-konstanz.de/rara/universals-archive/15/ ; https://typo.uni-konstanz.de/rara/universals-archive/831/',
				conditions: { // OV
					'SVO': ['SOV', 'OSV', 'OVS'],
				},
				results: {
					'RelN': 'RelN',
					'VNeg': 'VNeg',
				},
			},
			*/
			{
				name: 'UA15',
				url: 'https://typo.uni-konstanz.de/rara/universals-archive/15/ ; https://typo.uni-konstanz.de/rara/universals-archive/109/',
				conditions: { // VO
					'SVO': ['SVO', 'VSO', 'VOS'],
				},
				results: {
					'VNeg': 'NegV',
				},
			},
			{
				name: 'UA56',
				url: 'https://typo.uni-konstanz.de/rara/universals-archive/56/ ; https://typo.uni-konstanz.de/rara/universals-archive/67/ ; https://typo.uni-konstanz.de/rara/universals-archive/499/',
				conditions: {
					'SVO': ['VSO'],
				},
				results: {
					'AdjN': 'NAdj',
					'GenN': 'NGen',
					'QS': 'QS',
				},
			},
			{
				name: 'UA57',
				url: 'https://typo.uni-konstanz.de/rara/universals-archive/57/ ; https://typo.uni-konstanz.de/rara/universals-archive/71/ ; https://typo.uni-konstanz.de/rara/universals-archive/73/ ; https://typo.uni-konstanz.de/rara/universals-archive/75/ ; https://typo.uni-konstanz.de/rara/universals-archive/95/ ; https://typo.uni-konstanz.de/rara/universals-archive/1338/',
				conditions: {
					'AdjN': ['AdjN'],
				},
				results: {
					'DemN': 'DemN',
					'NumN': 'NumN',
				},
			},
			{
				name: 'UA66',
				url: 'https://typo.uni-konstanz.de/rara/universals-archive/66/',
				conditions: { // OV
					'SVO': ['SOV', 'OSV', 'OVS'],
					'AdjN': ['AdjN'],
				},
				results: {
					'GenN': 'GenN',
				},
			},
			{
				name: 'UA73',
				url: 'https://typo.uni-konstanz.de/rara/universals-archive/73/ ; https://typo.uni-konstanz.de/rara/universals-archive/88/ ; https://typo.uni-konstanz.de/rara/universals-archive/114/ ; https://typo.uni-konstanz.de/rara/universals-archive/92/ ; https://typo.uni-konstanz.de/rara/universals-archive/72/',
				conditions: {
					'DemN': ['NDem'],
				},
				results: {
					'AdjN': 'NAdj',
					'RelN': 'NRel',
				},
			},
			{
				name: 'UA75',
				url: 'https://typo.uni-konstanz.de/rara/universals-archive/75/ ; https://typo.uni-konstanz.de/rara/universals-archive/92/ ; https://typo.uni-konstanz.de/rara/universals-archive/74/ ; https://typo.uni-konstanz.de/rara/universals-archive/121/ ; https://typo.uni-konstanz.de/rara/universals-archive/174/',
				conditions: {
					'NumN': ['NNum'],
				},
				results: {
					'AdjN': 'NAdj',
				},
			},
			{
				name: 'UA88',
				url: 'https://typo.uni-konstanz.de/rara/universals-archive/88/ ; https://typo.uni-konstanz.de/rara/universals-archive/176/ ; https://typo.uni-konstanz.de/rara/universals-archive/1338/',
				conditions: {
					'RelN': ['RelN'],
				},
				results: {
					'DemN': 'DemN',
					'GenN': 'GenN',
				},
			},
			{
				name: 'UA92',
				url: 'https://typo.uni-konstanz.de/rara/universals-archive/92/ ; https://typo.uni-konstanz.de/rara/universals-archive/91/',
				conditions: {
					'AdpN': ['AdpN'],
					'AdjN': ['NAdj'],
				},
				results: {
					'GenN': 'NGen',
				},
			},
			{
				name: 'UA95a',
				url: 'https://typo.uni-konstanz.de/rara/universals-archive/95/ ; https://typo.uni-konstanz.de/rara/universals-archive/71/',
				conditions: {
					'AdpN': ['NAdp'],
					'RelN': ['RelN'],
				},
				results: {
					'NumN': 'NumN',
				},
			},
			{
				name: 'UA95b',
				url: 'https://typo.uni-konstanz.de/rara/universals-archive/95/ ; https://typo.uni-konstanz.de/rara/universals-archive/177/',
				conditions: {
					'AdpN': ['NAdp'],
					'DemN': ['DemN'],
				},
				results: {
					'GenN': 'GenN',
				},
			},
			{
				name: 'UA95c',
				url: 'https://typo.uni-konstanz.de/rara/universals-archive/95/',
				conditions: {
					'AdpN': ['NAdp'],
					'NumN': ['NumN'],
				},
				results: {
					'GenN': 'GenN',
				},
			},
			{
				name: 'UA121',
				url: 'https://typo.uni-konstanz.de/rara/universals-archive/121/',
				conditions: {
					'AdpN': ['AdpN'],
					'NumN': ['NNum'],
				},
				results: {
					'RelN': 'NRel',
				},
			},
			{
				name: 'UA176',
				url: 'https://typo.uni-konstanz.de/rara/universals-archive/176/ ; https://typo.uni-konstanz.de/rara/universals-archive/175/ ; https://typo.uni-konstanz.de/rara/universals-archive/92/',
				conditions: {
					'GenN': ['NGen'],
				},
				results: {
					'RelN': 'NRel',
				},
			},
			{
				name: 'UA423',
				url: 'https://typo.uni-konstanz.de/rara/universals-archive/424/',
				conditions: { // ¬ SOV
					'AdpN': ['AdpN'],
					'SVO': ['SVO', 'VSO', 'VOS', 'OSV', 'OVS'],
				},
				results: {
					'RelN': 'NRel',
				},
			},
			{
				name: 'UA443',
				url: 'https://typo.uni-konstanz.de/rara/universals-archive/444/ ; https://typo.uni-konstanz.de/rara/universals-archive/1021/ ; https://typo.uni-konstanz.de/rara/universals-archive/1553/',
				conditions: { // V1
					'SVO': ['VSO', 'VOS'],
				},
				results: {
					'AdpN': 'AdpN', // prevents conflict w/ 95c; basis: WALS, virtually universal
					'GenN': 'NGen',
					'VNeg': 'NegV',
				},
			},
			{
				name: 'UA489',
				url: 'https://typo.uni-konstanz.de/rara/universals-archive/491/ ; https://typo.uni-konstanz.de/rara/universals-archive/499/',
				conditions: { // SOV
					'SVO': ['SOV'],
				},
				results: {
					'AdpN': 'NAdp',
					'QS': 'SQ',
				},
			},
			{
				name: 'UA1334',
				url: 'https://typo.uni-konstanz.de/rara/universals-archive/1338/',
				conditions: {
					'AdpN': ['AdpN'],
					'GenN': ['GenN'],
				},
				results: {
					'AdjN': 'AdjN',
				},
			},
			{
				name: 'UA1520',
				url: 'https://typo.uni-konstanz.de/rara/universals-archive/1524/',
				conditions: { // OS
					'SVO': ['VOS', 'OVS', 'OSV'],
				},
				results: {
					'ArtN': 'ArtN',
					'GenN': 'NGen',
					'NumN': 'NumN',
					'RelN': 'NRel',
					'VNeg': 'NegV',
				},
			},
			/*
			OV
			VO
			VSO
			AdjN
			OV & AdjN
			NDem
			NNum
			RelN
			AdpN & NAdj
			NAdp & RelN
			NAdp & DemN
			NAdp & NumN
			AdpN & NNum
			NGen
			not SOV
			V1
			SOV
			AdpN & GenN
			OS
			*/
		],
	},
	MOA: [
		'nasal',
		'plosive',
		'affricate',
		'fricative',
		'approximant',
		'trill',
		'tap',
	],
	POA: [
		'bilabial',
		'labiodental',
		'dental',
		'alveolar',
		'postalveolar',
		'palatal',
		'velar',
		'labiovelar',
		'uvular',
		'glottal',
	],
	order: {
		AdjN: [
			['Adj', '{adjective}'],
			['N', '{noun}'],
		],
		AdjAdv: [
			['Adj', '{adjective}'],
			['Adv', '{adverb}'],
		],
		AdpN: [
			['Adp', '{adposition}'],
			['N', '{noun}'],
		],
		ArtN: [
			['Art', '{article}'],
			['N', '{noun}'],
		],
		DemN: [
			['Dem', '{demonstrative}'],
			['N', '{noun}'],
		],
		GenN: [
			['Gen', '{genitive}'],
			['N', '{noun}'],
		],
		NumN: [
			['Num', '{numeral}'],
			['N', '{noun}'],
		],
		QS: [
			['Q', '{question}'],
			['S', '{sentence}'],
		],
		RelN: [
			['Rel', '{relc}'],
			['N', '{noun}'],
		],
		SVO: [
			['S', '{subject}'],
			['V', '{verb}'],
			['O', '{object}'],
		],
		VNeg: [
			['Neg', '{neg}'],
			['V', '{verb}'],
		],
	},
	vowels: {
		dx: [
			'front',
			'near-front',
			'central',
			'near-back',
			'back',
		],
		dy: [
			'close',
			'near-close',
			'close-mid',
			'mid',
			'open-mid',
			'near-open',
			'open',
		],
	},
};

const syllables = [
	// CV
	[
		[data.filters.consonant, data.filters.vowel],
		[true, true],
		'CV',
	],
	// (C)V
	[
		[data.filters.consonant, data.filters.vowel],
		[false, true],
		'(C)V',
	],
	// CV(C)
	[
		[data.filters.consonant, data.filters.vowel, data.filters.consonant],
		[true, true, false],
		'CV(C)',
	],
	// (C)V(N) (Japonic)
	[
		[data.filters.consonant, data.filters.vowel, data.filters.nasal],
		[false, true, false],
		'(C)V(N)',
	],
	// (C)V(C)
	[
		[data.filters.consonant, data.filters.vowel, data.filters.consonant],
		[false, true, false],
		'(C)V(C)',
	],
	// (C)(C)V(C)
	[
		[data.filters.consonant, data.filters.consonant,
			data.filters.vowel, data.filters.consonant],
		[false, false, true, false],
		'(C)(C)V(C)',
	],
	// (C)(C)V(C)(C) - verdurian style
	// https://www.zompist.com/vergram.html#Phonotactics
	[
		[data.filters.plosiveOrFricative, data.filters.liquidOrS,
			data.filters.vowel,
			data.filters.liquidOrS, data.filters.plosiveOrFricative],
		[false, false, true, false, false],
		'(P/F)(L/s)V(L/s)(P/F)',
	],
	// (s)(C)(A/L)V(A/L)(C)(s) - latin style
	// https://christianlehmann.eu/publ/Latin_syllable_in_typological_perspective.pdf
	[
		[data.filters.s, data.filters.consonant, data.filters.approxOrLiquid,
			data.filters.vowel,
			data.filters.approxOrLiquid, data.filters.consonant, data.filters.s],
		[false, false, false, true, false, false, false],
		'(s)(C)(A/L)V(A/L)(C)(s)',
	],
];

const phones = [
	{
		name: 'a',
		properties: {
			isVowel: true,
			freq: 2600/3183,
			backness: 'central',
			openness: 'open',
			rounding: false,
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
		name: 'ð',
		properties: {
			manner: 'fricative',
			place: 'dental',
			voiced: true,
			freq: 160/3183,
			// todo implications
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
			backness: 'front',
			openness: 'mid',
			rounding: false,
		},
	},
	{
		name: 'ɛ',
		properties: {
			isVowel: true,
			freq: 1129/3183,
			backness: 'front',
			openness: 'open-mid',
			rounding: false,
			implications: ['e'],
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
			backness: 'front',
			openness: 'close',
			rounding: false,
		},
	},
	{
		name: 'ɨ',
		properties: {
			isVowel: true,
			freq: 491/3183,
			backness: 'central',
			openness: 'close',
			rounding: false,
			// todo implications
		},
	},
	{
		name: 'ɪ',
		properties: {
			isVowel: true,
			freq: 444/3183,
			backness: 'near-front',
			openness: 'near-close',
			rounding: false,
			implications: ['i', 'e'],
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
			backness: 'back',
			openness: 'mid',
			rounding: true,
		},
	},
	{
		name: 'ɔ',
		properties: {
			isVowel: true,
			freq: 1070/3183,
			backness: 'back',
			openness: 'open-mid',
			rounding: true,
			implications: ['o'],
		},
	},
	{
		name: 'ø',
		properties: {
			isVowel: true,
			freq: 94/3183,
			backness: 'front',
			openness: 'mid',
			rounding: true,
			implications: ['e', 'o'],
		},
	},
	{
		name: 'œ',
		properties: {
			isVowel: true,
			freq: 89/3183,
			backness: 'front',
			openness: 'open-mid',
			rounding: true,
			implications: ['ɛ', 'ɔ', 'ø'],
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
		name: 'ɾ',
		properties: {
			manner: 'tap',
			place: 'alveolar',
			voiced: true,
			freq: 774/3183,
			// todo implications
		},
	},
	{
		name: 'ʀ',
		properties: {
			manner: 'trill',
			place: 'uvular',
			voiced: true,
			freq: 19/3183,
			// todo implications
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
		name: 'θ',
		properties: {
			manner: 'fricative',
			place: 'dental',
			voiced: false,
			freq: 123/3183,
			// todo implications
		},
	},
	{
		name: 'u',
		properties: {
			isVowel: true,
			freq: 2646/3183,
			backness: 'back',
			openness: 'close',
			rounding: true,
		},
	},
	{
		name: 'ʊ',
		properties: {
			isVowel: true,
			freq: 409/3183,
			backness: 'near-back',
			openness: 'near-close',
			rounding: true,
			implications: ['u', 'o'],
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
			backness: 'front',
			openness: 'close',
			rounding: true,
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

const wordLists = {
	swadesh: [
		'I',
		'you (singular)',
		'he',
		'we',
		'you (plural)',
		'they',
		'this',
		'that',
		'here',
		'there',
		'who',
		'what',
		'where',
		'when',
		'how',
		'not',
		'all',
		'many',
		'some',
		'few',
		'other',
		'one',
		'two',
		'three',
		'four',
		'five',
		'big',
		'long',
		'wide',
		'thick',
		'heavy',
		'small',
		'short',
		'narrow',
		'thin',
		'woman',
		'man (adult male)',
		'man (human being)',
		'child',
		'wife',
		'husband',
		'mother',
		'father',
		'animal',
		'fish',
		'bird',
		'dog',
		'louse',
		'snake',
		'worm',
		'tree',
		'forest',
		'stick',
		'fruit',
		'seed',
		'leaf',
		'root',
		'bark (of a tree)',
		'flower',
		'grass',
		'rope',
		'skin',
		'meat',
		'blood',
		'bone',
		'fat (noun)',
		'egg',
		'horn',
		'tail',
		'feather',
		'hair',
		'head',
		'ear',
		'eye',
		'nose',
		'mouth',
		'tooth',
		'tongue (organ)',
		'fingernail',
		'foot',
		'leg',
		'knee',
		'hand',
		'wing',
		'belly',
		'guts',
		'neck',
		'back',
		'breast',
		'heart',
		'liver',
		'to drink',
		'to eat',
		'to bite',
		'to suck',
		'to spit',
		'to vomit',
		'to blow',
		'to breathe',
		'to laugh',
		'to see',
		'to hear',
		'to know',
		'to think',
		'to smell',
		'to fear',
		'to sleep',
		'to live',
		'to die',
		'to kill',
		'to fight',
		'to hunt',
		'to hit',
		'to cut',
		'to split',
		'to stab',
		'to scratch',
		'to dig',
		'to swim',
		'to fly',
		'to walk',
		'to come',
		'to lie (as in a bed)',
		'to sit',
		'to stand',
		'to turn (intransitive)',
		'to fall',
		'to give',
		'to hold',
		'to squeeze',
		'to rub',
		'to wash',
		'to wipe',
		'to pull',
		'to push',
		'to throw',
		'to tie',
		'to sew',
		'to count',
		'to say',
		'to sing',
		'to play',
		'to float',
		'to flow',
		'to freeze',
		'to swell',
		'sun',
		'moon',
		'star',
		'water',
		'rain',
		'river',
		'lake',
		'sea',
		'salt',
		'stone',
		'sand',
		'dust',
		'earth',
		'cloud',
		'fog',
		'sky',
		'wind',
		'snow',
		'ice',
		'smoke',
		'fire',
		'ash',
		'to burn',
		'road',
		'mountain',
		'red',
		'green',
		'yellow',
		'white',
		'black',
		'night',
		'day',
		'year',
		'warm',
		'cold',
		'full',
		'new',
		'old',
		'good',
		'bad',
		'rotten',
		'dirty',
		'straight',
		'round',
		'sharp (as a knife)',
		'dull (as a knife)',
		'smooth',
		'wet',
		'dry',
		'correct',
		'near',
		'far',
		'right',
		'left',
		'at',
		'in',
		'with',
		'and',
		'if',
		'because',
		'name',
		'(Name of the Language)',
	],
};