/* exported charHisto, histo, main */
/* global createSvgElement, remap */

const sizeX = 700;
const sizeY = 350;

/** generate bar graph from URL data */
function bar(){
	const data = getData();
	/** @type {SVGElement} */
	const barChart = document.getElementById('chart');
	barChart.setAttribute('viewBox', `0 0 ${sizeX} ${sizeY}`);
	/** @type {number} */
	const len = data.x.length;
	const spacingRatio = 0.5;
	const width = sizeX / (len + spacingRatio*(len-1));
	const spacing = sizeX / len;
	const maxY = Math.max(...data.y);
	const yScale = sizeY / maxY * 0.85;

	/** @type {[*, number][]} */
	let xxyy = data.x.map((x, i) => [x, data.y[i]]);
	if (data.sort)
		xxyy = xxyy.sort((a, b) => a[1] - b[1]);
	else if (data.sortX)
		xxyy = xxyy.sort((a, b) => a[0] - b[0]);
	if (data.reverse)
		xxyy.reverse();
	// console.debug(xxyy);

	xxyy.forEach((xy, i) => {
		/** @type {number} */
		const y = xy[1];
		const barG = createSvgElement('g');
		barChart.appendChild(barG);
		const barElem = createSvgElement('rect');
		barElem.setAttribute('width', width);
		barElem.classList.add('bar');
		const labelElem = createSvgElement('text');
		labelElem.innerHTML = xy[0];
		labelElem.classList.add('label');
		const valueElem = createSvgElement('text');
		valueElem.innerHTML = y;
		valueElem.classList.add('value');
		// x-y coords
		const topY = sizeY - y*yScale;
		labelElem.setAttribute('x', i*spacing);
		valueElem.setAttribute('x', i*spacing);
		barElem.setAttribute('x', i*spacing);
		labelElem.setAttribute('y', topY - 30);
		valueElem.setAttribute('y', topY - 5);
		barElem.setAttribute('y', topY);
		barElem.setAttribute('height', y*yScale);
		// append to group
		barG.appendChild(barElem);
		barG.appendChild(labelElem);
		barG.appendChild(valueElem);
	});
}

/** @param {string} s */
function charHisto(s){
	const x = Array.from(new Set(Array.from(s)));
	const y = x.map(char => s.split(char).length - 1);
	const data = {
		reverse: true,
		sort: true,
		type: 'bar',
		x,
		y,
	};
	return toURL(data);
}

function fromURL(s){
	return JSON.parse(atob(s));
}

function getData(){
	const rawData = window.location.href.match(/\?.+/g)[0].replace('?data=', '');
	return fromURL(rawData);
}

/** @param {[]} d */
function histo(d){
	const x = Array.from(new Set(Array.from(d)));
	const y = x.map(char => d.filter(i => i === char).length);
	const data = {
		sortX: true,
		type: 'bar',
		x,
		y,
	};
	return toURL(data);
}

function main(){
	// console.debug(toURL(main.testData));
	const data = getData();
	switch (data.type){
		case 'bar':
			bar();
			break;
		case 'scatter':
			scatter();
			break;
	}
}
main.testData = {
	type: 'bar',
	x: ['a', 'b', 'c'],
	y: [1, 2, 3],
};

/** generate scatter plot from URL data */
function scatter(){
	const data = getData();
	/** @type {SVGElement} */
	const chart = document.getElementById('chart');
	chart.setAttribute('viewBox', `0 0 ${sizeX} ${sizeY}`);
	const xMax = Math.max(...data.x);
	const xMin = Math.min(...data.x);
	const yMax = Math.max(...data.y);
	const yMin = Math.min(...data.y);

	/** @type {[number, number][]} */
	const xxyy = data.x.map((x, i) => [x, data.y[i]]);

	xxyy.forEach(xy => {
		const g = createSvgElement('g');
		chart.appendChild(g);
		const point = createSvgElement('circle');
		point.setAttribute('r', 1);
		point.classList.add('point');
		const labelElem = createSvgElement('text');
		labelElem.innerHTML = `(${xy[0]}, ${xy[1]})`;
		labelElem.classList.add('value');
		// x-y coords
		const [x, y] = [remap(xy[0], [xMin, xMax], [0, sizeX]),
			remap(xy[1], [yMin, yMax], [sizeY, 0])];
		labelElem.setAttribute('x', x + 5);
		point.setAttribute('cx', x);
		labelElem.setAttribute('y', y + 5);
		point.setAttribute('cy', y);
		// append to group
		g.appendChild(point);
		g.appendChild(labelElem);
	});
}

function toURL(data){
	return btoa(JSON.stringify(data));
}