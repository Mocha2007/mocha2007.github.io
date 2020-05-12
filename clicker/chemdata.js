/* jshint esversion: 6, strict: true, strict: global */
/* exported chemData, recipeData */
'use strict';
// chems - ball-and-stick models preferred
const chemData = [
	// blacklisted
	{
		name: 'Hydrogen',
		density: 0.08988e-3,
		molarMass: 1.008*2,
		imgUrl: 'https://imagenesgratis.com.ar/wp-content/uploads/2020/01/sphere-3d-white-001.png',
		tags: ['Blacklisted'],
	},
	{
		name: 'Carbon',
		density: 2,
		molarMass: 12.011,
		imgUrl: 'https://www.intrism.com/wp-content/uploads/2017/01/cropped-black-sphere.png',
		tags: ['Blacklisted'],
	},
	{
		name: 'Methane',
		density: 0.657e-3,
		molarMass: 16.043,
		imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/58/Methane-3D-balls.png',
		tags: ['Alkane', 'Blacklisted'],
	},
	{
		name: 'Ammonia',
		density: 0.769e-3,
		molarMass: 17.031,
		imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Ammonia-3D-balls-A.png',
		tags: ['Blacklisted'],
	},
	// whitelisted
	{
		name: 'Water',
		density: 1,
		molarMass: 18.01528,
		imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Water_molecule_3D.svg',
	},
	{
		name: 'Nitrogen',
		density: 1.2506e-3,
		molarMass: 28,
		imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Dinitrogen-3D-vdW.png',
	},
	{
		name: 'Phosphorus',
		density: 1.823,
		molarMass: 30.973761998,
		imgUrl: 'https://cdn0.iconfinder.com/data/icons/3D-shapes-psd/256/ball-6x6.png',
	},
	{
		name: 'Oxygen',
		density: 1.429e-3,
		molarMass: 32,
		imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/57/Oxygen_molecule.svg',
	},
	{
		name: 'Carbon Dioxide',
		density: 1.977e-3,
		molarMass: 44.009,
		imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Carbon_dioxide_3D_ball.png',
	},
	{
		name: 'Formic Acid',
		density: 1.22,
		molarMass: 46.025,
		imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Formic-acid-CRC-MW-3D-balls.png',
		tags: ['Carboxylic Acid'],
	},
	{
		name: 'Ethanol',
		density: 0.7893,
		molarMass: 46.069,
		imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Ethanol-3D-balls.png',
		tags: ['Alcohol'],
	},
	{
		name: 'Sodium Chloride',
		density: 2.17,
		molarMass: 58.443,
		imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Sodium-chloride-3D-ionic.png',
	},
	{
		name: 'Glycine',
		density: 1.1607,
		molarMass: 75.067,
		imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Glycine-3D-balls.png',
		tags: ['Amino Acid'],
	},
	{
		name: 'Pyramidine',
		density: 1.016,
		molarMass: 80.088,
		imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/26/Pyrimidine-3D-balls-2.png',
		tags: ['Organic'],
	},
	{
		name: 'Thiazole',
		molarMass: 85.12,
		imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Thiazole-3D-balls.png',
		tags: ['Organic'],
	},
	{
		name: 'Pyruvic Acid',
		density: 1.25,
		molarMass: 88.06,
		imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/dc/Pyruvic-acid-3D-balls.png',
		tags: ['Carboxylic Acid'],
	},
	{
		name: 'Serine',
		density: 1.603,
		molarMass: 105.093,
		imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/L-serine-3D-balls.png',
		tags: ['Amino Acid'],
	},
	{
		name: 'Cytosine',
		density: 1.55,
		molarMass: 111.1,
		imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/73/Cytosine-3D-balls.png',
		tags: ['Amine', 'Nucleobase'],
	},
	{
		name: 'Uracil',
		density: 1.32,
		molarMass: 112.08676,
		imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Uracil-3D-balls.png',
		tags: ['Nucleobase'],
	},
	{
		name: 'Indole',
		density: 1.1747,
		molarMass: 117.151,
		imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Indole-3D-balls-2.png',
		tags: ['Organic'],
	},
	{
		name: 'Purine',
		molarMass: 120.115,
		imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Purine-3D-balls.png',
		tags: ['Organic'],
	},
	{
		name: 'Thymine',
		density: 1.223,
		molarMass: 126.115,
		imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Thymine-3D-balls.png',
		tags: ['Nucleobase'],
	},
	{
		name: 'Adenine',
		density: 1.6,
		molarMass: 135.13,
		imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Adenine-3D-balls.png',
		tags: ['Amine', 'Nucleobase'],
	},
	{
		name: 'Guanine',
		density: 2.2,
		molarMass: 151.13,
		imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Guanine-3D-balls.png',
		tags: ['Amine', 'Nucleobase'],
	},
	{
		name: 'Xanthine',
		molarMass: 152.11,
		imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/38/Xanthin_-_Xanthine.svg',
		tags: ['Organic'],
	},
	{
		name: 'Vitamin C',
		density: 1.694,
		molarMass: 176.12,
		imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Ascorbic-acid-from-xtal-1997-3D-balls.png',
		tags: ['Organic'], // unsure if carbohydrate
	},
	{
		name: 'Seratonin',
		molarMass: 176.215,
		imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Serotonin-Spartan-HF-based-on-xtal-3D-balls-web.png',
		tags: ['Amine', 'Organic'],
	},
	{
		name: 'Glucose',
		density: 1.54,
		molarMass: 180.156,
		imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Alpha-D-glucose-from-xtal-1979-3D-balls.png',
		tags: ['Monosaccharide'],
	},
	{
		name: 'Citric Acid',
		density: 1.665,
		molarMass: 192.123,
		imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Citric-acid-3D-balls.png',
		tags: ['Carboxylic Acid'], // unsure if carbohydrate
	},
	{
		name: 'Caffeine',
		density: 1.23,
		molarMass: 194.19,
		imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Caffeine_molecule_ball_from_xtal_(1).png',
		tags: ['Organic'],
	},
	{
		name: 'Tryptophan',
		molarMass: 204.229,
		imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/L-Tryptophan-3D-balls.png',
		tags: ['Amino Acid'],
	},
	{
		name: 'Thiamine',
		molarMass: 265.35,
		imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Thiamine_cation_3D_ball.png',
		tags: ['Amine', 'Organic'],
	},
	{
		name: 'ADP',
		density: 2.49,
		molarMass: 427.201,
		imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Adenosine-diphosphate-3D-balls.png',
		tags: ['Amine', 'Organic'],
	},
	{
		name: 'Tetrahydrofolate',
		molarMass: 445.43,
		imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/76/Tetrahydrofolic-acid-3D-spacefill.png',
		tags: ['Amine', 'Carboxylic Acid'], // unsure if amino acid
	},
	// https://en.wikipedia.org/wiki/5,10-Methylenetetrahydrofolate
	{
		name: 'MTHF',
		molarMass: 457.44,
		imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/5%2C10-methylenetetrahydrofolic_acid.svg',
		tags: ['Amine', 'Carboxylic Acid'], // unsure if amino acid
	},
	{
		name: 'ATP',
		density: 1.04,
		molarMass: 507.18,
		imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/22/ATP-3D-vdW.png',
		tags: ['Amine', 'Organic'],
	},
	{
		name: 'NAD+',
		molarMass: 663.43,
		imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/NAD%2B-from-xtal-2003-3D-balls.png',
		tags: ['Amine', 'Organic'],
	},
	{
		name: 'NADH',
		molarMass: 663.43,
		imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/NAD%2B-from-xtal-2003-3D-balls.png',
		tags: ['Amine', 'Organic'],
	},
];

// recipes
// list reagents and products from MOST MASSIVE to LEAST MASSIVE
// list recipes from LEAST TO MOST MASSIVE PRIMARY REAGENT (then second reagent, ..., then first product, ...)
// todo https://en.wikipedia.org/wiki/Metabolic_pathway#Major_metabolic_pathways
const recipeData = [
	// simple reactions
	{
		reagents: [
			['Carbon', 1],
			['Hydrogen', 2],
		],
		products: [
			['Methane', 1],
		],
	},
	{
		reagents: [
			['Nitrogen', 1],
			['Hydrogen', 3],
		],
		products: [
			['Ammonia', 2],
		],
	},
	{
		reagents: [
			['Oxygen', 1],
			['Hydrogen', 2],
		],
		products: [
			['Water', 2],
		],
	},
	{
		reagents: [
			['Oxygen', 1],
			['Carbon', 1],
		],
		products: [
			['Carbon Dioxide', 1],
		],
	},
	{
		reagents: [
			['Oxygen', 2],
			['Methane', 1],
		],
		products: [
			['Carbon Dioxide', 1],
			['Water', 2],
		],
	},
	{
		reagents: [
			['Oxygen', 3],
			['Ammonia', 4],
		],
		products: [
			['Nitrogen', 2],
			['Water', 6],
		],
	},
	{
		reagents: [
			['Ethanol', 1],
			['Oxygen', 3],
		],
		products: [
			['Carbon Dioxide', 2],
			['Water', 3],
		],
	},
	// biochemical reactions
	// oversimplified since I can't find an explanation
	{
		reagents: [
			['Pyramidine', 1],
			['Thiazole', 1],
			['Ethanol', 1],
			['Ammonia', 1],
			['Methane', 2],
		],
		products: [
			['Thiamine', 1],
			['Hydrogen', 4],
		],
	},
	// https://en.wikipedia.org/wiki/File:Tryptophan_biosynthesis_(en).svg
	{
		reagents: [
			['Indole', 1],
			['Serine', 1],
		],
		products: [
			['Tryptophan', 1],
			['Water', 1],
		],
	},
	// oversimplified since I can't find an explanation
	{
		reagents: [
			['Purine', 2],
			['Ammonia', 2],
			['Oxygen', 1],
		],
		products: [
			['Guanine', 2],
			['Hydrogen', 3],
		],
	},
	// oversimplified since I can't find an explanation
	{
		reagents: [
			['Guanine', 2],
			['Oxygen', 1],
			['Hydrogen', 1],
		],
		products: [
			['Xanthine', 2],
			['Ammonia', 2],
		],
	},
	// oversimplified since I can't find an explanation
	{
		reagents: [
			['Xanthine', 1],
			['Methane', 3],
		],
		products: [
			['Caffeine', 1],
			['Hydrogen', 3],
		],
	},
	// https://en.wikipedia.org/wiki/Serotonin#Biosynthesis
	{
		reagents: [
			['Tryptophan', 2],
			['Oxygen', 1],
		],
		products: [
			['Seratonin', 2],
			['Formic Acid', 2],
		],
	},
	// https://en.wikipedia.org/wiki/Glycine#Biosynthesis
	{
		reagents: [
			['Tetrahydrofolate', 1],
			['Serine', 1],
		],
		products: [
			['MTHF', 1],
			['Glycine', 1],
			['Water', 1],
		],
	},
	{
		name: 'Glycolysis',
		reagents: [
			['NAD+', 2],
			['ADP', 2],
			['Glucose', 1],
			['Phosphorus', 2],
		],
		products: [
			['NADH', 2],
			['ATP', 2],
			['Pyruvic Acid', 2],
			['Water', 2],
		],
	},
	// https://en.wikipedia.org/wiki/Glycine#Degradation
	{
		reagents: [
			['NAD+', 1],
			['Tetrahydrofolate', 1],
			['Glycine', 1],
		],
		products: [
			['NADH', 1],
			['MTHF', 1],
			['Carbon Dioxide', 1],
			['Ammonia', 1], // technically ammonium, but given how complex this game already is...
			['Hydrogen', 1],
		],
	},
];