/* exported body */
const body = {
	parts: [
		{
			name: 'body',
			validProperties: {
				color: true,
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
				length: true,
			},
		},
	],
	properties: {
		color: [
			'black',
			'blue',
			'brown',
			'green',
			'pink',
			'red',
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
	},
};