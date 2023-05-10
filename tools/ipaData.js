/* exported ipaData */

const constants = {
	polish_vowels: 'aeiouyąęó',
};

const ipaData = [
	{
		lang: 'Polish',
		rules: [
			// consonants
			[`ć|ci(?=[${constants.polish_vowels}])`, 't͡ɕ'],
			['c?h', 'x'],
			['cz', 't͡ʂ'],
			['dż', 'd͡ʐ'],
			[`dź|dzi(?=[${constants.polish_vowels}])`, 'd͡ʑ'],
			['n(?=[gk])', 'ŋ'],
			[`ń|ni(?=[${constants.polish_vowels}])`, 'ɲ'],
			[`ś|si(?=[${constants.polish_vowels}])`, 'ɕ'],
			['sz', 'ʂ'],
			['w', 'v'],
			['ż|rz', 'ʐ'],
			[`ź|zi(?=[${constants.polish_vowels}])`, 'ʑ'],
			// consonants, round 2
			['c', 't͡s'],
			['dz', 'd͡z'],
			['ł', 'w'],
			// oral vowels
			['e', 'ɛ'],
			['o', 'ɔ'],
			['ó', 'u'],
			['y', 'ɨ'],
			// nasal vowels
			// https://en.wikipedia.org/wiki/Polish_phonology#Distribution_2
			['ą(?=[bp])', 'ɔm'],
			['ą(?=[td])', 'ɔn'],
			['ą(?=[kg])', 'ɔŋ'],
			['ą(?=[lw])', 'ɔ'],
			['ę(?=[bp])', 'ɛm'],
			['ę(?=[td])', 'ɛn'],
			['ę(?=[kg])', 'ɛŋ'],
			['ę(?=[lw])', 'ɛ'],
			['ę$', 'ɛ'],
			// else...
			['ą', 'ɔ̃'],
			['ę', 'ɛ̃'],
		],
	},
];