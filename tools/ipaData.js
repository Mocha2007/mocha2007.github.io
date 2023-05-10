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
			// https://en.wikipedia.org/wiki/Polish_phonology#Voicing_and_devoicing
			// voicing
			['p(?=[bvdzʐʑg])', 'b'],
			['f(?=[bvdzʐʑg])', 'v'],
			['t(?=[bvdzʐʑg])', 'd'],
			['t͡s(?=[bvdzʐʑg])', 'd͡z'],
			['s(?=[bvdzʐʑg])', 'z'],
			['t͡ʂ(?=[bvdzʐʑg])', 'd͡ʐ'],
			['ʂ(?=[bvdzʐʑg])', 'ʐ'],
			['t͡ɕ(?=[bvdzʐʑg])', 'd͡ʑ'],
			['ɕ(?=[bvdzʐʑg])', 'ʑ'],
			['k(?=[bvdzʐʑg])', 'g'],
			['x(?=[bvdzʐʑg])', 'ɣ'],
			// devoicing
			['b(?=[pftsʂɕkx])', 'p'],
			['v(?=[pftsʂɕkx])', 'f'],
			['d(?=[pftsʂɕkx])', 't'],
			['d͡z(?=[pftsʂɕkx])', 't͡s'],
			['z(?=[pftsʂɕkx])', 's'],
			['d͡ʐ(?=[pftsʂɕkx])', 't͡ʂ'],
			['ʐ(?=[pftsʂɕkx])', 'ʂ'],
			['d͡ʑ(?=[pftsʂɕkx])', 't͡ɕ'],
			['ʑ(?=[pftsʂɕkx])', 'ɕ'],
			['g(?=[pftsʂɕkx])', 'k'],
		],
	},
];