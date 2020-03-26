var life_data = [
	{
		'name': 'animalia',
		'rank': 'kingdom',
		'parent': 'life',
	},
	{
		'name': 'aves',
		'rank': 'class',
		'parent': 'chordata',
		'desc': 'Birds',
	},
	{
		'name': 'chordata',
		'rank': 'phylum',
		'parent': 'animalia',
		'desc': 'During some period of their life cycle, chordates possess a notochord, a dorsal nerve cord, pharyngeal slits, an endostyle, and a post-anal tail: these five anatomical features define this phylum.'
	},
	{
		'name': 'galliformes',
		'rank': 'order',
		'parent': 'aves',
	},
	{
		'name': 'gallus',
		'rank': 'genus',
		'parent': 'phasianidae',
	},
	{
		'name': 'gallus gallus',
		'rank': 'species',
		'parent': 'gallus',
	},
	{
		'name': 'gallus gallus domesticus',
		'rank': 'subspecies',
		'parent': 'gallus gallus',
		'important': true,
		'desc': 'Chicken',
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
		'desc': 'Human',
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
		'name': 'phasianidae',
		'rank': 'family',
		'parent': 'galliformes',
	},
	{
		'name': 'primates',
		'rank': 'order',
		'parent': 'mammalia',
	},
];