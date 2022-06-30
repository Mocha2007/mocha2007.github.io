/* exported body */
const body = {
	parts: [
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
		],
		length: [
			'short',
			'medium',
			'long',
		],
		size: [
			'small',
			'medium',
			'large',
		],
	},
};