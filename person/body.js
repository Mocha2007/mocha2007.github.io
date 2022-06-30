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
			validProperties: {
				color: true,
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
			name: 'head',
			validProperties: {
				size: true,
			},
		},
		{
			name: 'lips',
			validProperties: {
				thickness: true,
			},
		},
		{
			name: 'nose',
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
			'medium',
			'tall',
		],
		length: [
			'short',
			'medium',
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