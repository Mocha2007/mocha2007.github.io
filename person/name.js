/* exported names */
const names = {
	feminine: [
		'Alice', 'Luna',
	],
	masculine: [
		'Jake', 'John', 'Mordecai',
	],
	neuter: [
		'Alex',
	],
	last: [
		'Black', 'Brown', 'Johnson', 'Jones', 'Smith',
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
	},
};