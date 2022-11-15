/** exported walsData */

const val = {
	blueRed3: ['#00d', '#fff', '#d00'],
	blueRed5: ['#00d', '#99f', '#fff', '#f6f', '#d00'],
	bool2: ['#d00', '#fff'],
	bool3: ['#d00', '#f6f', '#fff'],
	present: ['Contrast present', 'Contrast absent'],
	size3: ['Small', 'Average', 'Large'],
	size5: ['Small', 'Moderately small', 'Average', 'Moderately large', 'Large'],
	vennColor: ['#fff', '#d00', '#00d', '#909'],
	vennColor2: ['#ff0', '#fff', '#d00', '#00d', '#909'],
};

const walsData = [
	{
		id: '1A',
		name: 'Consonant Inventories',
		values: val.size5,
		colors: val.blueRed5,
	},
	{
		id: '2A',
		name: 'Vowel Quality Inventories',
		values: val.size3,
		colors: val.blueRed3,
	},
	{
		id: '3A',
		name: 'Consonant-Vowel Ratio',
		values: val.size5,
		colors: val.blueRed5,
	},
	{
		id: '4A',
		name: 'Consonant-Vowel Ratio',
		values: ['No voicing contrast', 'In plosives alone', 'In fricatives alone', 'In both plosives and fricatives'],
		colors: val.vennColor,
	},
	{
		id: '5A',
		name: 'Voicing and Gaps in Plosive Systems',
		values: ['Other', 'None missing in /p t k b d g/', 'Missing /p/', 'Missing /g/', 'Both missing'],
		colors: val.vennColor,
	},
	{
		id: '6A',
		name: 'Uvular Consonants',
		values: ['None', 'Uvular stops only', 'Uvular continuants only', 'Uvular stops and continuants'],
		colors: val.vennColor,
	},
	{
		id: '7A',
		name: 'Glottalized Consonants',
		values: [
			'No glottalized consonants',
			'Ejectives only',
			'Implosives only',
			'Glottalized resonants only',
			'Ejectives and implosives',
			'Ejectives and glottalized resonants',
			'Implosives and glottalized resonants',
			'Ejectives, implosives, and glottalized resonants',
		],
		colors: ['#fff', '#00d', '#d00', '#ff0', '#909', '#00d', '#d00', '#909'],
	},
	{
		id: '8A',
		name: 'Lateral Consonants',
		values: [
			'No laterals',
			'/l/, no obstruent laterals',
			'Laterals, but no /l/, no obstruent laterals',
			'/l/ and lateral obstruent',
			'No /l/, but lateral obstruents',
		],
		colors: ['#fff', '#00d', '#ff0', '#909', '#f00'],
	},
	{
		id: '9A',
		name: 'Consonant-Vowel Ratio',
		values: ['Initial velar nasal', 'No initial velar nasal', 'No velar nasal'],
		colors: val.bool3,
	},
	{
		id: '10A',
		name: 'Vowel Nasalization',
		values: val.present,
		colors: val.bool2,
	},
	{
		id: '10B',
		name: 'Nasal Vowels in West Africa',
		values: [
			'no nasal vs. oral vowel contrast',
			'two-way nasal vs. oral vowel contrast (/ṽ/ vs. /V/) without nasal spreading',
			'two-way nasal vs. oral vowel contrast (/ṽ/ vs. /V/) with nasal spreading',
			'four-way nasal vs. oral vowel contrast (/ṽ/ vs. /ṽː/ vs. /V/ vs. /Vː/) without nasal spreading',
			'four-way nasal vs. oral vowel contrast (/ṽ/ vs. /ṽː/ vs. /V/ v /Vː/) with nasal spreading',
		],
		colors: ['#fff', '#d00', '#d00', '#00d', '#00d'],
	},
];