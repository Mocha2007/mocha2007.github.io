/* exported update */

function range(n){
	return Array.from(Array(n).keys());
}

function isPrime(n){
	if (n === 2)
		return true;
	if (n < 2 || n % 1 || n % 2 === 0)
		return false;
	for (let i = 3; i <= Math.floor(Math.sqrt(n)); i += 2)
		if (n % i === 0)
			return false;
	return true;
}

function printArr(arr){
	return `[${arr.join(', ')}]`;
}

function irishLog(base = 10){
	/**
	 * @param {number[]} t1
	 * @param {number[]} t2
	 * @param {number} offset
	 */
	function minOffset(t1, t2){
		const mods = t1.filter(isFinite);
		for (let n = 0; n < Infinity; n++) // You may think a while loop would make more sense here. And you'd be right - except due to a quirk of how loop declarations work in JS, a while loop doesn't work here at all.
			if (mods.every(m => !isFinite(t2[m + n])))
				return n;
	}
	const table1 = [];
	const table2 = [];
	// fill in table 1
	table1[1] = 0;
	table2[0] = 1;
	// primes, and multiples thereof
	range(base).filter(isPrime).concat([0]).forEach(p => {
		// find smallest valid value for it
		table1[p] = minOffset(table1, table2);
		if (0 < p)
			// update multiples in table1 (if not zero)
			for (let i = 2; p*i < base; i++)
				table1[p*i] = table1[p] + table1[i];
		// update table 2
		for (let i = 0; i < base; i++)
			if (isFinite(table1[i]))
				for (let j = 0; j < base; j++)
					if (isFinite(table1[j]))
						table2[table1[i] + table1[j]] = i*j;
	});
	// zero out undefineds
	for (let i = 0; i < table2.length; i++)
		if (!isFinite(table2[i]))
			table2[i] = 0;
	return [table1, table2];
}

function update(){
	const base = +document.getElementById('base').value;
	const [t1, t2] = irishLog(base);
	document.getElementById('t1').innerHTML = printArr(t1);
	document.getElementById('t2').innerHTML = printArr(t2);
}

update();