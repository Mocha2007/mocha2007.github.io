/* exported body */
const body = {
	parts: [
		{
			name: 'eye',
			validProperties: {
				color: true,
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
		],
		length: [
			'short',
			'medium',
			'long',
		],
	},
};