/* global langData, walsData */
/* exported WALS */
/**
 * This js automatically creates a WALS table like the old ones on
 * eg. eremoran.html.
 */

class WALSDatum {
	constructor(o){
		this.id = o.id;
		this.name = o.name;
		this.values = o.values;
		this.colors = o.colors;
		WALSDatum.data.push(this);
	}
	get th(){
		const elem = document.createElement('th');
		const a = document.createElement('a');
		a.href = this.url;
		a.innerHTML = this.id;
		a.title = this.name;
		elem.appendChild(a);
		return elem;
	}
	get url(){
		return `https://wals.info/feature/${this.id}`;
	}
	/** @param {number} state - id of state (integer) */
	stateTd(state){
		const td = document.createElement('td');
		const circle = document.createElement('span');
		circle.classList.add('circle');
		circle.style.backgroundColor = this.colors[state];
		td.appendChild(circle);
		td.innerHTML += this.values[state];
		return td;
	}
	/** @param {number} state - id of state (integer) */
	tr(state, reason = '', notes = ''){
		const elem = document.createElement('tr');
		elem.appendChild(this.th);
		elem.appendChild(this.stateTd(state));
		[reason, notes].forEach(s => {
			const td = document.createElement('td');
			td.innerHTML = s;
			elem.appendChild(td);
		});
		return elem;
	}
	/** @param {string} id */
	static fromId(id){
		return WALSDatum.data.find(x => x.id === id);
	}
	/** @type {WALSDatum[]} */
	static data = [];
}

const WALS = {
	display(){
		this.table.appendChild(this.header);
		langData.forEach(datum => {
			const id = datum.shift();
			const wd = WALSDatum.fromId(id);
			WALS.table.appendChild(wd.tr(...datum));
		});
	},
	get header(){
		const elem = document.createElement('tr');
		['ID', 'Value', 'Reason', 'Notes'].forEach(s => {
			const th = document.createElement('th');
			th.innerHTML = s;
			elem.appendChild(th);
		});
		return elem;
	},
	init(){
		// load master JS
		walsData.forEach(datum => new WALSDatum(datum));
	},
	/** @param {string} filename - name of the JS file with this language's data */
	load(filename){
		this.init();
		const script = document.createElement('script');
		script.onload = () => {
			console.info(`WALS: langData for ${langName} loaded`);
			this.display();
		}
		script.src = `data/${filename}.js`;
		document.head.appendChild(script);
	},
	/** @returns {HTMLTableElement} */
	get table(){
		return document.getElementById('walstable');
	}
};