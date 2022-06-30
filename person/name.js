/* exported names */
const names = {
	feminine: [
		'Alice',
	],
	masculine: [
		'John',
	],
	neuter: [
		'Alex',
	],
	last: [
		'Smith',
	],
	/** @param {string} setChars m = masc, f = fem, n = neuter */
	inSets(setChars){
		let n = [];
		if (setChars.includes('f'))
			n = n.concat(this.feminine);
		if (setChars.includes('m'))
			n = n.concat(this.masculine);
		if (setChars.includes('n'))
			n = n.concat(this.neuter);
		return n;
	}
};