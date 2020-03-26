var life_data = [
	{
		'name': 'animalia',
		'rank': 'kingdom',
		'parent': 'life',
	},
	{
		'name': 'aves',
		'rank': 'class',
		'parent': 'ornithurae',
		'desc': 'Bird',
	},
	{
		'name': 'canidae',
		'rank': 'family',
		'parent': 'carnivora',
	},
	{
		'name': 'canis',
		'rank': 'genus',
		'parent': 'canidae',
	},
	{
		'name': 'canis lupus',
		'rank': 'species',
		'parent': 'canis',
		'desc': 'Wolf',
	},
	{
		'name': 'canis lupus familiaris',
		'rank': 'subspecies',
		'parent': 'canis lupus',
		'important': true,
		'desc': 'Dog',
	},
	{
		'name': 'carnivora',
		'rank': 'order',
		'parent': 'mammalia',
	},
	{
		'name': 'chordata',
		'rank': 'phylum',
		'parent': 'animalia',
		'desc': 'During some period of their life cycle, chordates possess a notochord, a dorsal nerve cord, pharyngeal slits, an endostyle, and a post-anal tail: these five anatomical features define this phylum.'
	},
	{
		'name': 'felidae',
		'rank': 'family',
		'parent': 'carnivora',
	},
	{
		'name': 'felis',
		'rank': 'genus',
		'parent': 'felidae',
	},
	{
		'name': 'felis catus',
		'rank': 'species',
		'parent': 'felis',
		'important': true,
		'desc': 'Cat',
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
		'desc': 'Red Junglefowl',
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
		'name': 'ornithurae',
		'rank': 'clade',
		'parent': 'theropoda',
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
	{
		'name': 'theropoda',
		'rank': 'clade',
		'parent': 'chordata',
	},
	{
		'name': 'tyrannosauridae',
		'rank': 'family',
		'parent': 'theropoda',
	},
	{
		'name': 'tyrannosaurus',
		'rank': 'genus',
		'parent': 'tyrannosauridae',
	},
	{
		'name': 'tyrannosaurus rex',
		'rank': 'species',
		'parent': 'tyrannosaurus',
	},
];