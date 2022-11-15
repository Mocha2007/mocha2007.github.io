/** exported walsData */

const val = {
	blueRed3: ['#00d', '#fff', '#d00'],
	blueRed5: ['#00d', '#99f', '#fff', '#f6f', '#d00'],
	size3: ['Small', 'Average', 'Large'],
	size5: ['Small', 'Moderately small', 'Average', 'Moderately large', 'Large'],
};

const walsData = [
	{
		id: '1A',
		name: 'Consonant Inventories',
		values: val.size5,
		colors: val.blueRed5,
	},
	{
		id: '2A',
		name: 'Vowel Quality Inventories',
		values: val.size3,
		colors: val.blueRed3,
	},
];