/* exported data, phones, syllables, wordLists */
'use strict';

/* further reading
	https://phoible.org/parameters
	https://typo.uni-konstanz.de/rara/category/universals-archive/
	https://wals.info/
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
		// more common, non-local cases
		common: [
			'GEN',
			'DAT',
			'LOC',
			'ABL',
			'INS',
		],
		numbers: ['S', 'PL', 'DU', 'PAUC', 'TRI'],
		// rarer, generally local cases
		rare: [
			'ADE',
			'ALL',
			'BEN',
			'CAUS',
			'COM',
			'DEL',
			'ELA',
			'ESS',
			'ILL',
			'INE',
			'SUBL',
			'SUPE',
			'TERM',
			'TRANSL',
			'VOC',
		],
	},
	/** @type {((x: Phone) => boolean)[]} */
	filters: {
		affricate: x => x.properties.manner === 'affricate',
		approximant: x => x.properties.manner === 'approximant',
		approxOrLiquid(x){
			return data.filters.approximant(x) || data.filters.liquid(x);
		},
		back: x => x.properties.backness === 'back',
		consonant: x => !x.properties.isVowel,
		fricative: x => x.properties.manner === 'fricative',
		front: x => x.properties.backness === 'front',
		liquid: x => x.properties.lateral
			|| x.properties.manner === 'trill'
			|| x.properties.manner === 'tap',
		liquidOrS(x){
			return data.filters.liquid(x) || data.filters.s(x);
		},
		nasal: x => x.properties.manner === 'nasal',
		obstruent(x){
			return data.filters.plosive(x)
				|| data.filters.affricate(x)
				|| data.filters.fricative(x);
		},
		plosive: x => x.properties.manner === 'plosive',
		plosiveOrFricative(x){
			return data.filters.plosive(x) || data.filters.fricative(x);
		},
		primary: x => {
			return !data.filters.secondary(x);
		},
		s: x => x.name === 's',
		secondary: x => x.properties.aspirated
			|| x.properties.ejective
			|| x.properties.labialized
			|| x.properties.pharyngealized
			|| x.properties.uvularized
			|| x.properties.velarized,
		voiced: x => x.properties.isVowel || x.properties.voiced,
		voiceless: x => {
			return !data.filters.voiced(x);
		},
		vowel: x => x.properties.isVowel,
	},
	implications: {
		/** these are all pass/fail. if it fails, it's rerolled. */
		phonology: [
			{
				name: 'UA224',
				url: 'https://typo.uni-konstanz.de/rara/universals-archive/224/',
				implication: phonology => phonology.some(phone => phone.properties.place === 'labial')
					&& phonology.some(phone => phone.properties.place === 'alveolar')
					? phonology.some(phone => phone.properties.place === 'nasal')
						&& phonology.some(phone => phone.properties.place === 'plosive')
					: true,
			},
			{
				name: 'UA283',
				url: 'https://typo.uni-konstanz.de/rara/universals-archive/284/',
				implication: phonology => phonology.some(phone => phone.properties.place === 'postalveolar')
					? phonology.some(phone => phone.properties.place === 'alveolar')
					: true,
			},
			{
				name: 'UA289',
				url: 'https://typo.uni-konstanz.de/rara/universals-archive/290/',
				implication: phonology => phonology.some(phone => phone.properties.aspirated)
					? phonology.some(phone => phone.name === 'h')
					: true,
			},
			{
				name: 'UA487',
				url: 'https://typo.uni-konstanz.de/rara/universals-archive/489/',
				implication: phonology => phonology.some(phone => phone.properties.long && phone.properties.manner === 'fricative')
					? phonology.some(phone => phone.properties.long && phone.properties.manner === 'stop')
						? phonology.some(phone => phone.properties.long && phone.properties.manner === 'affricate')
						: false
					: phonology.some(phone => phone.properties.long && phone.properties.manner === 'stop')
						? phonology.some(phone => phone.properties.long && phone.properties.manner === 'affricate')
						: true,
			},
			{
				name: 'UA703',
				url: 'https://typo.uni-konstanz.de/rara/universals-archive/706/',
				implication: phonology => phonology.filter(phone => phone.properties.backness === 'central').length
					<= Math.max(phonology.filter(phone => phone.properties.backness === 'front').length,
						phonology.filter(phone => phone.properties.backness === 'back').length),
			},
			{
				name: 'UA704',
				url: 'https://typo.uni-konstanz.de/rara/universals-archive/707/',
				implication: phonology => {
					const v = phonology.filter(data.filters.vowel);
					const fronts = new Set(v.filter(data.filters.front)
						.map(phone => phone.properties.openness)).size;
					const backs = new Set(v.filter(data.filters.back)
						.map(phone => phone.properties.openness)).size;
					return backs <= fronts;
				},
			},
			{
				name: 'UA764',
				url: 'https://typo.uni-konstanz.de/rara/universals-archive/767/',
				implication: phonology => phonology.some(phone => phone.ejective)
					? phonology.some(phone => phone.manner === 'plosive')
					: true,
			},
			{
				name: 'UA774',
				url: 'https://typo.uni-konstanz.de/rara/universals-archive/777/',
				implication: phonology => {
					const fricatives = phonology.filter(data.filters.fricative);
					const secondary = fricatives.filter(data.filters.secondary).length;
					return 2*secondary <= fricatives.length;
				},
			},
			{
				name: 'UA777',
				url: 'https://typo.uni-konstanz.de/rara/universals-archive/780/',
				implication: phonology => 3 <= phonology.filter(phone => phone.properties.manner === 'plosive').length,
			},
			{
				name: 'UA778',
				url: 'https://typo.uni-konstanz.de/rara/universals-archive/781/',
				implication: phonology => phonology.filter(phone => phone.properties.manner === 'plosive').length === 3
					? phonology.filter(phone => 'ptk'.includes(phone.name)).length === 3
					: true,
			},
			{
				name: 'UA779',
				url: 'https://typo.uni-konstanz.de/rara/universals-archive/782/',
				implication: phonology => phonology.some(phone => phone.properties.manner === 'affricate')
					? 3 <= phonology.filter(phone => phone.properties.manner === 'plosive').length
					: true,
			},
			{
				name: 'UA780',
				url: 'https://typo.uni-konstanz.de/rara/universals-archive/783/ ; https://typo.uni-konstanz.de/rara/universals-archive/882/',
				implication: phonology => phonology.filter(phone => phone.properties.manner === 'affricate').length === 1
					? phonology.find(phone => phone.properties.manner === 'affricate').properties.place === 'postalveolar'
					: true,
			},
			{
				name: 'UA790',
				url: 'https://typo.uni-konstanz.de/rara/universals-archive/793/',
				implication: phonology => {
					const primaryNasals = phonology.filter(data.filters.nasal)
						.filter(data.filters.primary).length;
					const obstruents = phonology.filter(data.filters.obstruent).length;
					return primaryNasals <= obstruents;
				},
			},
			{
				name: 'UA794',
				url: 'https://typo.uni-konstanz.de/rara/universals-archive/797/',
				implication: phonology => data.MOA.filter(m =>
					// filter out only MOAs with ONE phoneme
					phonology.filter(phone => phone.properties.manner === m).length === 1)
					// make sure all of them are alveolar
					.every(m => phonology.find(phone => phone.properties.manner === m).properties.place === 'alveolar'),
			},
			{
				name: 'UA795',
				url: 'https://typo.uni-konstanz.de/rara/universals-archive/798/',
				implication: phonology => {
					const obstruents = phonology.filter(data.filters.obstruent);
					const voiced = obstruents.filter(data.filters.voiced).length;
					return 2*voiced <= obstruents.length;
				},
			},
			{
				name: 'UA831',
				url: 'https://typo.uni-konstanz.de/rara/universals-archive/834/',
				implication: phonology => {
					const liquids = phonology.filter(data.filters.liquid);
					if (liquids.length < 2)
						return true;
					return liquids.some(phone => !phone.properties.lateral)
						? liquids.some(phone => phone.properties.lateral)
						: true;
				},
			},
			{
				name: 'UA832',
				url: 'https://typo.uni-konstanz.de/rara/universals-archive/835/',
				implication: phonology => phonology.some(phone => phone.properties.lateral)
					? phonology.some(phone => phone.properties.voiced
						&& phone.properties.lateral
						&& phone.properties.manner === 'approximant')
					: true,
			},
			{
				name: 'UA833',
				url: 'https://typo.uni-konstanz.de/rara/universals-archive/836/',
				implication: phonology => {
					const laterals = phonology.filter(phone => phone.properties.lateral);
					if (laterals.length < 3)
						return true;
					const manners = new Set(laterals.map(phone => phone.properties.manner)).size;
					const voices = new Set(laterals.map(phone => phone.properties.voiced)).size;
					return 1 < manners ^ 1 < voices;
				},
			},
			{
				name: 'UA882',
				url: 'https://typo.uni-konstanz.de/rara/universals-archive/885/',
				implication: phonology => {
					const v = phonology.filter(data.filters.vowel);
					const maxBackVowelHeight = Math.min(v.filter(data.filters.back)
						.map(phone => data.vowels.dy.indexOf(phone.properties.openness)));
					const maxFrontVowelHeight = Math.min(v.filter(data.filters.front)
						.map(phone => data.vowels.dy.indexOf(phone.properties.openness)));
					// lower = higher
					return maxFrontVowelHeight <= maxBackVowelHeight;
				},
			},
			{
				name: 'UA885',
				url: 'https://typo.uni-konstanz.de/rara/universals-archive/888/',
				implication: phonology => phonology.some(phone => phone.properties.backness === 'front' && phone.properties.rounding)
					? phonology.some(phone => phone.properties.backness === 'back' && phone.properties.rounding)
					: true,
			},
			{
				name: 'UA886',
				url: 'https://typo.uni-konstanz.de/rara/universals-archive/889/',
				implication: phonology => phonology.some(phone => phone.properties.backness === 'back' && !phone.properties.rounding)
					? phonology.some(phone => phone.properties.backness === 'front' && !phone.properties.rounding)
					: true,
			},
			{
				name: 'UA920',
				url: 'https://typo.uni-konstanz.de/rara/universals-archive/923/',
				// interpreted as "all languages have a voiceless labial"
				implication: phonology => phonology.some(phone => !phone.properties.isVowel
					&& !phone.properties.voiced && phone.properties.place.includes('labi')),
			},
			{
				name: 'UA1010',
				url: 'https://typo.uni-konstanz.de/rara/universals-archive/1014/',
				implication: phonology => {
					const labial = phonology.filter(phone => !phone.properties.isVowel && phone.properties.place.includes('labi'));
					const alveolar = phonology.filter(phone => phone.properties.place === 'alveolar');
					const velar = phonology.filter(phone => !phone.properties.isVowel && phone.properties.place.includes('velar'));
					return labial <= alveolar && velar <= alveolar;
				},
			},
			{
				name: 'UA1327',
				url: 'https://typo.uni-konstanz.de/rara/universals-archive/1331/',
				implication: phonology => 1 < phonology
					.filter(phone => phone.properties.isVowel).length,
			},
			{
				name: 'UA1331',
				url: 'https://typo.uni-konstanz.de/rara/universals-archive/1335/',
				// this is not quite the same as 780 but it is similar
				implication: phonology => 2 <= new Set(phonology.filter(phone => phone.properties.manner === 'plosive').map(phone => phone.properties.place)).size,
			},
			{
				name: 'UA1604',
				url: 'https://typo.uni-konstanz.de/rara/universals-archive/1608/',
				// this is not quite the same as 780 but it is similar
				implication: phonology => phonology.some(phone => phone.properties.isVowel && phone.properties.nasal && phone.properties.backness === 'front')
					? phonology.some(phone => phone.properties.isVowel && phone.properties.nasal && phone.properties.backness === 'back')
					: true,
			},
			{
				name: 'MOCHA1',
				url: 'based on PHOIBLE data',
				// no /k/ -> /b d g/
				// no /p/ -> /b g/
				implication: phonology => {
					if (phonology.findIndex(p => p.name === 'k') === -1)
						return -1 < phonology.findIndex(p => p.name === 'b')
							&& -1 < phonology.findIndex(p => p.name === 'd')
							&& -1 < phonology.findIndex(p => p.name === 'g');
					if (phonology.findIndex(p => p.name === 'p') === -1)
						return -1 < phonology.findIndex(p => p.name === 'b')
							&& -1 < phonology.findIndex(p => p.name === 'g');
					return true;
				},
			},
			// todo later on when more advanced fxs are available:
			// NOT UNIVERSAL; IGNORE: obstruent voiced/unvoiced counterpart https://typo.uni-konstanz.de/rara/universals-archive/799/
			// rhotic https://typo.uni-konstanz.de/rara/universals-archive/837/
			// todo for phone section:
			// voiced labiovelar stop https://typo.uni-konstanz.de/rara/universals-archive/1810/
			// palatal g https://typo.uni-konstanz.de/rara/universals-archive/1814/
			// t' https://typo.uni-konstanz.de/rara/universals-archive/1816/
			// ts' https://typo.uni-konstanz.de/rara/universals-archive/1820/
			// crazy uvular https://typo.uni-konstanz.de/rara/universals-archive/1826/
			// voiceless appx https://typo.uni-konstanz.de/rara/universals-archive/1838/
			// voiceless palatal nasal https://typo.uni-konstanz.de/rara/universals-archive/1844/
		],
		morphology: [
			{
				name: 'UA260',
				url: 'https://typo.uni-konstanz.de/rara/universals-archive/260/',
				// todo: fix this when conjugation is implemented
				implication: m => 1 < m.caseEndings.length && m.caseEndings[1].meaning === 'ERG'
					? m.suffixationRate < 0.5
					: true,
			},
			// todo
			// Person Number => TAM https://typo.uni-konstanz.de/rara/universals-archive/267/
			// VOS => no conj https://typo.uni-konstanz.de/rara/universals-archive/278/
			// n vs pron infl https://typo.uni-konstanz.de/rara/universals-archive/585/
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
					// 'GenN': 'NGen', seems to be false, causes issues regardless
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
	morphology: {
		derivational: [
			'Adj>Adv',
			'Adj>N',
			'Adj>V',
			'N>Adj',
			'N>V',
			'V>N (action)',
			'V>N (agent)',
			'V>N (patient)',
			'place',
			'DIM',
			'AUG',
		],
	},
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
			implications: ['m'], // 96%
		},
	},
	{
		name: 'c',
		properties: {
			manner: 'plosive',
			place: 'palatal',
			voiced: false,
			freq: 418/3183,
			implications: ['j', 'k'], // 94%, 97%
		},
	},
	{
		name: 'd',
		properties: {
			manner: 'plosive',
			place: 'alveolar',
			voiced: true,
			freq: 1376/3183,
			implications: ['n'], // 94%
		},
	},
	{
		name: 'ð',
		properties: {
			manner: 'fricative',
			place: 'dental',
			voiced: true,
			freq: 160/3183,
		},
	},
	{
		name: 'd̠ʒ',
		properties: {
			manner: 'affricate',
			place: 'postalveolar',
			voiced: true,
			freq: 820/3183,
			implications: ['j', 'g'], // 92%, 93%
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
			// implications: ['e'],
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
			implications: ['b'], // 96%
		},
	},
	{
		name: 'h',
		properties: {
			manner: 'approximant',
			place: 'glottal',
			voiced: false,
			freq: 1703/3183,
			implications: ['k'], // 94%
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
			implications: ['i', 'a'], // 97%, 93%
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
			implications: ['a'], // 90%
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
			implications: ['n'], // 95%
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
			implications: ['m', 'k'], // 99%, 93%
		},
	},
	{
		name: 'ŋ',
		properties: {
			manner: 'nasal',
			place: 'velar',
			voiced: true,
			freq: 1897/3183,
			implications: ['m', 'k'], // ~100%, 93%
		},
	},
	{
		name: 'ɲ',
		properties: {
			manner: 'nasal',
			place: 'palatal',
			voiced: true,
			freq: 1255/3183,
			implications: ['n', 'j'], // 93%, 92%
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
			// implications: ['o'],
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
			implications: ['m'], // 100%
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
			implications: ['m'], // 100%
		},
	},
	{
		name: 'p',
		properties: {
			manner: 'plosive',
			place: 'bilabial',
			voiced: false,
			freq: 2594/3183,
			implications: ['k'], // 98%
		},
	},
	{
		name: 'q',
		properties: {
			manner: 'plosive',
			place: 'uvular',
			voiced: false,
			freq: 256/3183,
			implications: ['k'], // 93%
		},
	},
	{
		name: 'r',
		properties: {
			manner: 'trill',
			place: 'alveolar',
			voiced: true,
			freq: 1332/3183,
			implications: ['n', 'l'], // 94%, 91%
		},
	},
	{
		name: 'ɾ',
		properties: {
			manner: 'tap',
			place: 'alveolar',
			voiced: true,
			freq: 774/3183,
			implications: ['n'], // 91%
		},
	},
	{
		name: 'ʀ',
		properties: {
			manner: 'trill',
			place: 'uvular',
			voiced: true,
			freq: 19/3183,
			implications: ['m'], // 100%
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
			implications: ['j'], // 94%
		},
	},
	{
		name: 't',
		properties: {
			manner: 'plosive',
			place: 'alveolar',
			voiced: false,
			freq: 2064/3183,
			implications: ['k', 'n'], // 98%, 96%
		},
	},
	{
		name: 't̠ʃ',
		properties: {
			manner: 'affricate',
			place: 'postalveolar',
			voiced: false,
			freq: 1218/3183,
			implications: ['k', 'j'], // 97%, 92%
		},
	},
	{
		name: 'θ',
		properties: {
			manner: 'fricative',
			place: 'dental',
			voiced: false,
			freq: 123/3183,
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
			// implications: ['u', 'o'],
		},
	},
	{
		name: 'v',
		properties: {
			manner: 'fricative',
			place: 'labiodental',
			voiced: true,
			freq: 816/3183,
			implications: ['m', 'f'], // 98%, 91%
		},
	},
	{
		name: 'w',
		properties: {
			manner: 'approximant',
			place: 'labiovelar',
			voiced: true,
			freq: 2483/3183,
			implications: ['j'], // 96%
		},
	},
	{
		name: 'x',
		properties: {
			manner: 'fricative',
			place: 'velar',
			voiced: false,
			freq: 576/3183,
			implications: ['k'], // 92%
		},
	},
	{
		name: 'y',
		properties: {
			isVowel: true,
			freq: 175/3183,
			backness: 'front',
			openness: 'close',
			rounding: true,
			implications: ['i', 'u'], // 94%, 93%
		},
	},
	{
		name: 'z',
		properties: {
			manner: 'fricative',
			place: 'alveolar',
			voiced: true,
			freq: 893/3183,
			implications: ['s', 'n'], // 99%, 93%
		},
	},
	{
		name: 'ʔ',
		properties: {
			manner: 'plosive',
			place: 'glottal',
			voiced: false,
			freq: 1131/3183,
			implications: ['k'], // 90%
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