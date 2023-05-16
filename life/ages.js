/* exported ages */
'use strict';
const ages = [
	/*
	{
		'name': 'Template',
		'start': 5000,
		'divisions': [
			...
		],
	},
	*/
	{
		'name': 'Hadean',
		'start': 4600,
	},
	{
		'name': 'Archean',
		'start': 4000,
		'divisions': [
			{
				'name': 'Eoarchean',
				'start': 4000,
			},
			{
				'name': 'Paleoarchean',
				'start': 3600,
			},
			{
				'name': 'Mesoarchean',
				'start': 3200,
			},
			{
				'name': 'Neoarchean',
				'start': 2800,
			},
		],
	},
	{
		'name': 'Proterozoic',
		'start': 2500,
		'divisions': [
			{
				'name': 'Paleoproterozoic',
				'start': 2500,
				'divisions': [
					{
						'name': 'Siderian',
						'start': 2500,
					},
					{
						'name': 'Rhyacian',
						'start': 2300,
					},
					{
						'name': 'Orosirian',
						'start': 2050,
					},
					{
						'name': 'Statherian',
						'start': 1800,
					},
				],
			},
			{
				'name': 'Mesoproterozoic',
				'start': 1600,
				'divisions': [
					{
						'name': 'Calymmian',
						'start': 1600,
					},
					{
						'name': 'Ectasian',
						'start': 1400,
					},
					{
						'name': 'Stenian',
						'start': 1200,
					},
				],
			},
			{
				'name': 'Neoproterozoic',
				'start': 1000,
				'divisions': [
					{
						'name': 'Tonian',
						'start': 1000,
					},
					{
						'name': 'Cryogenian',
						'start': 720,
					},
					{
						'name': 'Ediacaran',
						'start': 635,
					},
				],
			},
		],
	},
	{
		'name': 'Phanerozoic',
		'start': 538.8,
		'divisions': [
			{
				'name': 'Paleozoic',
				'start': 538.8,
				'divisions': [
					{
						'name': 'Cambrian',
						'start': 538.8,
					},
					{
						'name': 'Ordovician',
						'start': 485.4,
					},
					{
						'name': 'Silurian',
						'start': 443.8,
					},
					{
						'name': 'Devonian',
						'start': 419.2,
					},
					{
						'name': 'Carboniferous',
						'start': 358.9,
					},
					{
						'name': 'Permian',
						'start': 298.9,
					},
				],
			},
			{
				'name': 'Mesozoic',
				'start': 251.902,
				'divisions': [
					{
						'name': 'Triassic',
						'start': 251.902,
						'divisions': [
							{
								'name': 'Early Triassic',
								'start': 251.902,
							},
							{
								'name': 'Middle Triassic',
								'start': 247.2,
							},
							{
								'name': 'Late Triassic',
								'start': 237,
							},
						],
					},
					{
						'name': 'Jurassic',
						'start': 201.3,
						'divisions': [
							{
								'name': 'Early Jurassic',
								'start': 201.3,
							},
							{
								'name': 'Middle Jurassic',
								'start': 174.1,
							},
							{
								'name': 'Late Jurassic',
								'start': 163.5,
							},
						],
					},
					{
						'name': 'Cretaceous',
						'start': 145,
						'divisions': [
							{
								'name': 'Early Cretaceous',
								'start': 145,
							},
							{
								'name': 'Late Cretaceous',
								'start': 100.5,
							},
						],
					},
				],
			},
			{
				'name': 'Cenozoic',
				'start': 66,
				'divisions': [
					{
						'name': 'Paleogene',
						'start': 66,
						'divisions': [
							{
								'name': 'Paleocene',
								'start': 66,
								'divisions': [
									{
										'name': 'Danian',
										'start': 66,
									},
									{
										'name': 'Selandian',
										'start': 61.6,
									},
									{
										'name': 'Thanetian',
										'start': 59.2,
									},
								],
							},
							{
								'name': 'Eocene',
								'start': 56,
								'divisions': [
									{
										'name': 'Ypresian',
										'start': 56,
									},
									{
										'name': 'Lutetian',
										'start': 47.8,
									},
									{
										'name': 'Bartonian',
										'start': 41.2,
									},
									{
										'name': 'Priabonian',
										'start': 37.8,
									},
								],
							},
							{
								'name': 'Oligocene',
								'start': 33.9,
								'divisions': [
									{
										'name': 'Rupelian',
										'start': 33.9,
									},
									{
										'name': 'Chattian',
										'start': 27.8,
									},
								],
							},
						],
					},
					{
						'name': 'Neogene',
						'start': 23.03,
						'divisions': [
							{
								'name': 'Miocene',
								'start': 23.03,
								'divisions': [
									{
										'name': 'Aquitanian',
										'start': 23.03,
									},
									{
										'name': 'Burdigalian',
										'start': 20.44,
									},
									{
										'name': 'Langhian',
										'start': 15.97,
									},
									{
										'name': 'Serravallian',
										'start': 13.82,
									},
									{
										'name': 'Tortonian',
										'start': 11.63,
									},
									{
										'name': 'Messinian',
										'start': 7.246,
									},
								],
							},
							{
								'name': 'Pliocene',
								'start': 5.333,
								'divisions': [
									{
										'name': 'Zanclean',
										'start': 5.333,
									},
									{
										'name': 'Piacenzian',
										'start': 3.6,
									},
								],
							},
						],
					},
					{
						'name': 'Quaternary',
						'start': 2.58,
						'divisions': [
							{
								'name': 'Pleistocene',
								'start': 2.58,
								'divisions': [
									{
										'name': 'Gelasian',
										'start': 2.58,
									},
									{
										'name': 'Calabrian',
										'start': 1.8,
									},
									{
										'name': 'Chibanian',
										'start': 0.774,
									},
									{
										'name': 'Tarantian',
										'start': 0.129,
									},
								],
							},
							{
								'name': 'Holocene',
								'start': 0.0117,
								'divisions': [
									{
										'name': 'Greenlandian',
										'start': 0.0117,
									},
									{
										'name': 'Northgrippian',
										'start': 0.0082,
									},
									{
										'name': 'Meghalayan',
										'start': 0.0042,
									},
								],
							},
						],
					},
				],
			},
		],
	},
];