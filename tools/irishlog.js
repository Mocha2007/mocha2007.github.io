/* exported test, update */

function range(n){
	return Array.from(Array(n).keys());
}

function isPrime(n){
	if (n === 2)
		return true;
	if (n < 2 || n % 1 || n % 2 === 0)
		return false;
	for (let i = 3; i <= Math.floor(Math.sqrt(n)); i += i % 6 === 1 ? 4 : 2)
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
	function minOffset(t1, t2, multiples = [0]){
		const mods = t1.filter(isFinite);
		const start = Math.max(...t1.filter(isFinite)) + 1;
		// You may think a while loop would make more sense here. And you'd be right - except due to a quirk of how loop declarations work in JS, a while loop doesn't work here at all.
		for (let offset = start; offset < Infinity; offset++)
			if (mods.every(m => multiples.every(mul => !isFinite(t2[m + mul + offset]))))
				return offset;
	}
	const table1 = [];
	const table2 = [];
	// fill in table 1
	table1[1] = 0;
	table2[0] = 1;
	// primes, and multiples thereof
	range(base).filter(isPrime).concat([0]).forEach(p => {
		// find smallest valid value for it
		const multiples = p ? range(Math.floor((base-1) / p)).map(x => table1[x+1])
			: [0]; // when determining the t1 of a prime we must also account for its multiples that will also be in t1
		table1[p] = minOffset(table1, table2, multiples);
		if (0 < p)
			// update multiples in table1 (if not zero)
			for (let i = 2; p*i < base; i++)
				table1[p*i] = table1[p] + table1[i];
		// update table 2
		for (let i = 0; i < base; i++)
			if (isFinite(table1[i]))
				for (let j = i; j < base; j++)
					if (isFinite(table1[j]))
						table2[table1[i] + table1[j]] = i*j;
	});
	// zero out undefineds
	for (let i = 0; i < table2.length; i++)
		if (!isFinite(table2[i]))
			table2[i] = 0;
	return [table1, table2];
}

/** @param {number[]} t2 */
function create23Table(t2){
	const table = document.createElement('table');
	const width = t2.indexOf(3);
	const max_index = t2.indexOf(t2.toReversed().find(x => x));
	for (let i = 0; i < t2.length / width; i++){
		const tr = document.createElement('tr');
		table.appendChild(tr);
		for (let j = 0; j < width; j++){
			const td = document.createElement('td');
			const index = width*i + j;
			const val = t2[index];
			if (max_index < index)
				return table;
			td.innerHTML = val;
			tr.appendChild(td);
			// prime colors
			if (!val)
				continue;
			const p = create23Table.colors.find(datum => val % datum[0] === 0);
			if (p)
				td.style.backgroundColor = p[1];
		}
	}
	return table;
}
create23Table.colors = [
	[17, '#c8c'],
	[13, '#88f'],
	[11, '#8f8'],
	[7, '#ff8'],
	[5, '#fc8'],
	[3, '#f88'],
	[2, 'white'],
];

function update(){
	const base = +document.getElementById('base').value;
	const [t1, t2] = irishLog(base);
	document.getElementById('t1').innerHTML = printArr(t1);
	document.getElementById('t2').innerHTML = printArr(t2);
	document.getElementById('t1_len').innerHTML = base;
	document.getElementById('t2_len').innerHTML = t2.length;
	const t2_23_container = document.getElementById('t2_23_container');
	t2_23_container.innerHTML = '';
	if (3 < base)
		t2_23_container.appendChild(create23Table(t2));
}

function test(b = 100, n = 250){
	const t0 = new Date();
	for (let i = 0; i < n; i++)
		irishLog(b);
	const t1 = new Date();
	return `${(t1-t0)/n} ms`;
}

update();