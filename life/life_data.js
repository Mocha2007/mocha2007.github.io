var life_data = [
	{
		'name': 'animalia',
		'rank': 'kingdom',
		'parent': 'life',
	},
	{
		'name': 'chordata',
		'rank': 'phylum',
		'parent': 'animalia',
		'desc': 'During some period of their life cycle, chordates possess a notochord, a dorsal nerve cord, pharyngeal slits, an endostyle, and a post-anal tail: these five anatomical features define this phylum.'
	},
	{
		'name': 'hominidae',
		'rank': 'family',
		'parent': 'primates',
	},
	{
		'name': 'homo',
		'rank': 'genus',
		'parent': 'hominidae',
	},
	{
		'name': 'homo sapiens',
		'rank': 'species',
		'parent': 'homo',
		'important': true,
		'desc': 'you',
	},
	{
		'name': 'life',
		'rank': 'life',
		'parent': '*',
	},
	{
		'name': 'mammalia',
		'rank': 'class',
		'parent': 'chordata',
	},
	{
		'name': 'primates',
		'rank': 'order',
		'parent': 'mammalia',
	},
];