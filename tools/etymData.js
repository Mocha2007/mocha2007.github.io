/* exported etymData, etymLangData */

// shortcuts
const EDS = {
	greek: 'Ancient Greek',
	latin: 'Latin',
	mocha: '(mochanoises)',
};

const etymData = [
	// make these alphabetical
	// LATIN
	{
		head: '-acea',
		lang: EDS.latin,
		gloss: '(suborder of animal or superfamily of non-animal)',
		forms: ['acea$'],
	},
	{
		head: '-aceae',
		lang: EDS.latin,
		gloss: '(family of non-animal)',
		forms: ['aceae$'],
	},
	{
		head: '-ales',
		lang: EDS.latin,
		gloss: '(order)',
		forms: ['ales$'],
	},
	{
		head: '-anae',
		lang: EDS.latin,
		gloss: '(superorder of non-animal)',
		forms: ['ales$'],
	},
	{
		head: '-ara',
		lang: EDS.latin,
		gloss: '(nothogenus)',
		forms: ['ara$'],
	},
	{
		head: '-aria',
		lang: EDS.latin,
		gloss: '(taxon)',
		forms: ['aria$'],
	},
	{
		head: '-atus',
		lang: EDS.latin,
		gloss: '(past participle)',
		forms: ['ate$', 'at'], // eg. choano-flagell-at-ea
	},
	{
		head: '-ea',
		lang: EDS.latin,
		gloss: '(taxon)',
		forms: ['ea$'],
	},
	{
		head: '-eae',
		lang: EDS.latin,
		gloss: '(tribe of non-animal)',
		forms: ['eae$'],
	},
	{
		head: '-ella',
		lang: EDS.latin,
		gloss: '(genus of bacteria)',
		forms: ['ella$'],
	},
	{
		head: '-ia',
		lang: EDS.latin,
		gloss: '(taxon)',
		forms: ['ia$'],
	},
	{
		head: '-ida',
		lang: EDS.latin,
		gloss: '(taxon)',
		forms: ['ida$'],
	},
	{
		head: '-idae',
		lang: EDS.latin,
		gloss: '(family of animal or subclass of plant)',
		forms: ['idae$'],
	},
	{
		head: '-iformes',
		lang: EDS.latin,
		gloss: '(order of animal)',
		forms: ['iformes$'],
	},
	{
		head: '-ina',
		lang: EDS.latin,
		gloss: '(subtribe or superorder of animal)',
		forms: ['ina$'],
	},
	{
		head: '-inae',
		lang: EDS.latin,
		gloss: '(superfamily of animal or subtribe of non-animal)',
		forms: ['inae$'],
	},
	{
		head: '-ini',
		lang: EDS.latin,
		gloss: '(tribe of animal)',
		forms: ['ini$'],
	},
	{
		head: '-ites',
		lang: EDS.latin,
		gloss: '(taxon)',
		forms: ['ites$'],
	},
	{
		head: '-odes',
		lang: EDS.latin,
		gloss: '(taxon)',
		forms: ['odes$'],
	},
	{
		head: '-oida',
		lang: EDS.latin,
		gloss: '(taxon)',
		forms: ['oida$'],
	},
	{
		head: '-oidea',
		lang: EDS.latin,
		gloss: '(superfamily of animal)',
		forms: ['oidea$'],
	},
	{
		head: '-oides',
		lang: EDS.latin,
		gloss: '(taxon)',
		forms: ['oides$'],
	},
	{
		head: '-ulus',
		lang: EDS.latin,
		gloss: '(genus)',
		forms: ['ulus$'],
	},
	{
		head: '-us',
		lang: EDS.latin,
		gloss: '(taxon)',
		forms: ['us$'],
	},
	{
		head: 'flagellum',
		lang: EDS.latin,
		gloss: 'whip',
		forms: ['flagell'],
	},
	// ANCIENT GREEK
	{
		head: '-ṓtēs',
		lang: EDS.greek,
		gloss: '(noun-forming suffix)',
		forms: ['ota$', 'ta$'],
	},
	{
		head: '-árkhēs',
		lang: EDS.greek,
		gloss: 'leader',
		forms: ['arch'],
	},
	{
		head: 'an-',
		lang: EDS.greek,
		gloss: 'un-',
		forms: ['an', 'a'],
	},
	{
		head: 'amníon',
		lang: EDS.greek,
		gloss: 'bowl',
		forms: ['amnio'],
	},
	{
		head: 'arkhaîos',
		lang: EDS.greek,
		gloss: 'ancient',
		forms: ['archaeo', 'archae'],
	},
	{
		head: 'Boréās',
		lang: EDS.greek,
		gloss: 'north',
		forms: ['boreo'],
	},
	{
		head: 'deúteros',
		lang: EDS.greek,
		gloss: 'second',
		forms: ['deutero'],
	},
	{
		head: 'dís',
		lang: EDS.greek,
		gloss: 'twice',
		forms: ['di'],
	},
	{
		head: 'eǘs',
		lang: EDS.greek,
		gloss: 'good',
		forms: ['eu'],
	},
	{
		head: 'génos',
		lang: EDS.greek,
		gloss: 'birth',
		forms: ['gen'],
	},
	{
		head: 'gnáthos',
		lang: EDS.greek,
		gloss: 'jaw',
		forms: ['gnatho', 'gnath'],
	},
	{
		head: 'haplóos',
		lang: EDS.greek,
		gloss: 'single',
		forms: ['haplo'],
	},
	{
		head: 'hólos',
		lang: EDS.greek,
		gloss: 'whole',
		forms: ['holo'],
	},
	{
		head: 'húdōr',
		lang: EDS.greek,
		gloss: 'water',
		forms: ['hydro'],
	},
	{
		head: 'ikhthū́s',
		lang: EDS.greek,
		gloss: 'fish',
		forms: ['ichthy'],
	},
	{
		head: 'káruon',
		lang: EDS.greek,
		gloss: 'nut',
		forms: ['kary'],
	},
	{
		head: 'katá',
		lang: EDS.greek,
		gloss: 'down',
		forms: ['cata'],
	},
	{
		head: 'khlōrós',
		lang: EDS.greek,
		gloss: 'pale green',
		forms: ['chloro'],
	},
	{
		head: 'khoánē',
		lang: EDS.greek,
		gloss: 'funnel',
		forms: ['choano'],
	},
	{
		head: 'khrôma',
		lang: EDS.greek,
		gloss: 'color',
		forms: ['chromo'], // chromosome
	},
	{
		head: 'khordḗ',
		lang: EDS.greek,
		gloss: 'guts',
		forms: ['chord'],
	},
	{
		head: 'kontós',
		lang: EDS.greek,
		gloss: 'pole',
		forms: ['kont'],
	},
	{
		head: 'kotulēdṓn',
		lang: EDS.greek,
		gloss: 'cup-shaped cavity',
		forms: ['cotyledon'],
	},
	{
		head: 'lúsis',
		lang: EDS.greek,
		gloss: 'loosening',
		forms: ['lysis', 'lyso', 'lys'],
	},
	{
		head: 'méros',
		lang: EDS.greek,
		gloss: 'part',
		forms: ['mere', 'mero'], // telomere, meronym
	},
	{
		head: 'metá',
		lang: EDS.greek,
		gloss: 'amid',
		forms: ['meta'],
	},
	{
		head: 'mónos',
		lang: EDS.greek,
		gloss: 'single',
		forms: ['mono'],
	},
	{
		head: 'morphḗ',
		lang: EDS.greek,
		gloss: 'shape',
		forms: ['morph'],
	},
	{
		head: 'múkēs',
		lang: EDS.greek,
		gloss: 'fungus',
		forms: ['mycetes$', 'mycet', 'myco'],
	},
	{
		head: 'néos',
		lang: EDS.greek,
		gloss: 'new',
		forms: ['neo'],
	},
	{
		head: 'nephrós',
		lang: EDS.greek,
		gloss: 'kidney',
		forms: ['nephro'],
	},
	{
		head: 'nítron',
		lang: EDS.greek,
		gloss: 'washing soda',
		forms: ['nitro'],
	},
	{
		head: 'odṓn',
		lang: EDS.greek,
		gloss: 'tooth',
		forms: ['odon'],
	},
	{
		head: 'oîstros',
		lang: EDS.greek,
		gloss: 'madness',
		forms: ['oestro', 'estro'],
	},
	{
		head: 'opísthios',
		lang: EDS.greek,
		gloss: 'rear',
		forms: ['opistho'],
	},
	{
		head: 'ópsis',
		lang: EDS.greek,
		gloss: 'appearance',
		forms: ['opsida$', 'ops$'],
	},
	{
		head: 'orthós',
		lang: EDS.greek,
		gloss: 'straight',
		forms: ['ortho'],
	},
	{
		head: 'ostéon',
		lang: EDS.greek,
		gloss: 'bone',
		forms: ['osteo', 'oste', 'ost'], // osteoarthritis, osteichthyes, teleost
	},
	{
		head: 'oxús',
		lang: EDS.greek,
		gloss: 'sharp',
		forms: ['oxy'],
	},
	{
		head: 'pará',
		lang: EDS.greek,
		gloss: 'beside',
		forms: ['para'],
	},
	{
		head: 'phûkos',
		lang: EDS.greek,
		gloss: 'seaweed',
		forms: ['phyco', 'phyc'],
	},
	{
		head: 'phutón',
		lang: EDS.greek,
		gloss: 'plant',
		forms: ['phyta$', 'phyte$', 'phyto', 'phyt'],
	},
	{
		head: 'pnoḗ',
		lang: EDS.greek,
		gloss: 'breath',
		forms: ['pno'],
	},
	{
		head: 'póa',
		lang: EDS.greek,
		gloss: 'fodder',
		forms: ['po'],
	},
	{
		head: 'poús',
		lang: EDS.greek,
		gloss: 'foot',
		forms: ['podo', 'pod'],
	},
	{
		head: 'Prōteús',
		lang: EDS.greek,
		gloss: 'Proteus',
		forms: ['proteo'],
	},
	{
		head: 'prôtos',
		lang: EDS.greek,
		gloss: 'first',
		forms: ['proto'],
	},
	{
		head: 'pterón',
		lang: EDS.greek,
		gloss: 'feather',
		forms: ['ptero'],
	},
	{
		head: 'ptérux',
		lang: EDS.greek,
		gloss: 'wing',
		forms: ['pteryg'],
	},
	{
		head: 'rhipídion',
		lang: EDS.greek,
		gloss: 'bellows',
		forms: ['rhipid'],
	},
	{
		head: 'rhī́s',
		lang: EDS.greek,
		gloss: 'nose',
		forms: ['rhino'],
	},
	{
		head: 'sárx',
		lang: EDS.greek,
		gloss: 'flesh',
		forms: ['sarco'],
	},
	{
		head: 'skótos',
		lang: EDS.greek,
		gloss: 'darkness',
		forms: ['scoto'],
	},
	{
		head: 'sôma',
		lang: EDS.greek,
		gloss: 'body',
		forms: ['some'], // chromosome
	},
	{
		head: 'stóma',
		lang: EDS.greek,
		gloss: 'mouth',
		forms: ['stom'],
	},
	{
		head: 'téleios',
		lang: EDS.greek,
		gloss: 'complete',
		forms: ['tele'], // teleost
	},
	{
		head: 'tetra-',
		lang: EDS.greek,
		gloss: 'four',
		forms: ['tetra'],
	},
	{
		head: 'thēríon',
		lang: EDS.greek,
		gloss: 'beast',
		forms: ['theria'],
	},
	{
		head: 'zôion',
		lang: EDS.greek,
		gloss: 'animal',
		forms: ['zoo', 'zoa', 'zo'],
	},
	/*
	{
		head: '(mochanoise)',
		lang: EDS.mocha,
		gloss: 'gay',
		forms: ['kippi', 'boi', 'snueg'],
	},
	*/
];

// compile langs automatically

const etymLangData = [];
etymData.forEach(o => {
	if (etymLangData.includes(o.lang))
		return;
	etymLangData.push(o.lang);
});