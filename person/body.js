/* exported body */
// df inspiration sample https://assets.rockpapershotgun.com/images//2018/06/004-her-personality-and-physical-description-620x405.png
const body = {
	parts: [
		{
			name: 'body',
			validProperties: {
				height: true,
				musculature: true,
				size: true,
			},
		},
		{
			name: 'eye',
			icon: ['👁️'],
			validProperties: {
				color: true,
				size: true,
			},
		},
		{
			name: 'foot',
			icon: ['🦶'],
			validProperties: {
				size: true,
			},
		},
		{
			name: 'hair',
			validProperties: {
				color: true,
				hairTexture: true,
				length: true,
			},
		},
		{
			name: 'hand',
			icon: ['🖐️'],
			validProperties: {
				size: true,
			},
		},
		{
			name: 'head',
			validProperties: {
				size: true,
			},
		},
		{
			name: 'leg',
			icon: ['🦵'],
			validProperties: {
				length: true,
			},
		},
		{
			name: 'lips',
			icon: ['👄'],
			validProperties: {
				thickness: true,
			},
		},
		{
			name: 'nose',
			icon: ['👃'],
			validProperties: {
				height: true,
				width: true,
			},
		},
		{
			name: 'skin',
			validProperties: {
				color: true,
			},
		},
	],
	properties: {
		color: [
			'black',
			'blue',
			'brown',
			'green',
			'grey',
			'pink',
			'red',
		],
		hairTexture: [
			'flat',
			'wavy',
			'curly',
		],
		height: [
			'short',
			'moderately tall',
			'tall',
		],
		length: [
			'short',
			'moderately long',
			'long',
		],
		musculature: [
			'slender',
			'fit',
			'toned',
			'muscular',
			'ripped',
		],
		size: [
			'small',
			'medium',
			'large',
		],
		thickness: [
			'thin',
			'moderately thick',
			'thick',
		],
		width: [
			'narrow',
			'moderately wide',
			'wide',
		],
	},
};