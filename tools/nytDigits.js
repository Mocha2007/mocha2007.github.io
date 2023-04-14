// solver for https://www.nytimes.com/games/digits
/* exported nytDigits */
/* global getAllSubsets, permutator */

const nytDigits = {
	button(){
		const i = document.getElementById('input').value.split(' ').map(n => +n);
		const o = this.solve(...i);
		document.getElementById('output').value = `${this.stitch(...o)}`;
	},
	/**
	 * @param {number} target
	 * @param  {number[]} nset available numbers
	 */
	solve(target, ...nset){
		let a, ops;
		getAllSubsets(nset)
			.find(set => permutator(set).some(arr => ops = this.testSet(target, a = arr)));
		return [a, ops];
	},
	/**
	 * @param {number} target
	 * @param {number[]} set
	 */
	testSet(target, set){
		// we need to test every operation here
		if (set.length < 2)
			return set[0] === target ? [] : undefined;
		const ops = this.getOpCombos(set.length - 1);
		// eslint-disable-next-line no-eval
		return ops.find(o => eval(this.stitch(set, o)) === target);
	},
	/**
	 * @param {number} n number of operators
	 * @returns {string[][]}
	 */
	getOpCombos(n){
		if (n === 1)
			return this.ops.map(o => [o]);
		const o = [];
		this.getOpCombos(n - 1)
			.forEach(ops => this.getOpCombos(1).forEach(o_ => o.push(ops.concat(o_))));
		return o;
	},
	ops: '+-*/'.split(''),
	/**
	 * @param {Array} a1 outside set
	 * @param {Array} a2 inside set
	 */
	stitch(a1, a2){
		const o = [];
		a1.forEach((elem, i) => {
			o.push(elem);
			if (i < a2.length)
				o.push(a2[i]);
		});
		return o.join('');
	},
};