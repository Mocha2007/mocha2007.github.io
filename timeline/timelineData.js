/* exported timelineData */
/* global range */

const timelineData = [
	// people
	{
		name: 'Vladimir Lenin',
		start: '22 April 1870',
		end: '21 January 1924',
		color: 'red',
		href: 'https://en.wikipedia.org/wiki/Vladimir_Lenin',
	},
	{
		name: 'Joseph Stalin',
		start: '18 December 1878',
		end: '5 March 1953',
		color: 'red',
		href: 'https://en.wikipedia.org/wiki/Joseph_Stalin',
	},
	{
		name: 'Leon Trotsky',
		start: '7 November 1879',
		end: '21 August 1940',
		color: 'red',
		href: 'https://en.wikipedia.org/wiki/Leon_Trotsky',
	},
	{
		name: 'Nikita Khrushchev',
		start: '15 April 1894',
		end: '11 September 1971',
		color: 'red',
		href: 'https://en.wikipedia.org/wiki/Nikita_Khrushchev',
	},
	{
		name: 'Leonid Brezhnev',
		start: '19 December 1906',
		end: '10 November 1982',
		color: 'red',
		href: 'https://en.wikipedia.org/wiki/Leonid_Brezhnev',
	},
];

// markers
range(1870, 1991, 10).forEach(i => {
	const p = {
		name: i,
		start: `1 January ${i}`,
		end: `2 January ${i}`,
		color: 'black',
		borderColor: 'white',
		textColor: 'white',
		href: `https://en.wikipedia.org/wiki/${i}`,
		forceY: 1,
	};
	timelineData.push(p);
});