/* exported MapElem */


class MapElem {
	/** @param {string} s */
	static coordsFromState(s){
		const Y = this.MAP_GRID_DATA.findIndex(line => line.includes(s));
		const LINE = this.MAP_GRID_DATA[Y];
		const X = LINE.indexOf(s);
		return {X, Y};
	}
	/** @returns {string} */
	static stateFromCoords(o){
		return this.MAP_GRID_DATA[o.Y][o.X];
	}
	/** @param {[State, *][]} results */
	static table(results = []){
		const table = document.createElement('table');
		table.id = 'map';
		// 12 cols, 8 rows
		for (let i = 0; i < 8; i++){
			const tr = document.createElement('tr');
			table.appendChild(tr);
			for (let j = 0; j < 13; j++){
				const td = document.createElement('td');
				tr.appendChild(td);
				const s = this.stateFromCoords({X: j, Y: i});
				if (!s)
					continue;
				td.innerHTML = s;
				td.id = `map_cell_${s}`;
				// if results exists, try to find it!
				let index;
				if (results.find((datum, ii) => datum[0].name === s && 0 <= (index = ii))){
					/** @type {[State, *]} */
					const [state, result] = results[index];
					td.classList.add(`party_${result.winner.abbr}`);
					if (state.swing)
						td.classList.add('swing');
					// detailed results...
					td.title = [
						`${state.name} (${state.ev} EVs)`,
						state.pollCloseTimeString,
						'--------------------',
						...result.result.map((line, i) => `${line[0].name} - ${line[1].toLocaleString()} (${round(result.resultP[i][1] * 100, 2)}%)`)
					].join('\n');
				}
				// debugger;
			}
		}
		return table;
	}
	static MAP_GRID_DATA = `
AK										ME		ME-1
					WI				VT	NH		ME-2
WA	ID	MT	ND	MN	IL	MI		NY	MA	
OR	NV	WY	SD	IA	IN	OH	PA	NJ	CT	RI
CA	UT	CO	NE	MO	KY	WV	VA	MD	DE	
	AZ	NM	KS	AR	TN	NC	SC	DC				NE-1
			OK	LA	MS	AL	GA					NE-2
HI			TX					FL				NE-3
	`.split('\n').slice(1).map(line => line.split('\t'));
}