/* exported charHisto, histo, histo2, main */
/* global createSvgElement, remap, round, sum */

const sizeX = 700;
const sizeY = 350;

/** generate bar graph from URL data */
function bar(){
	const data = getData();
	/** @type {SVGElement} */
	const barChart = document.getElementById('chart');
	barChart.setAttribute('viewBox', `0 0 ${sizeX} ${sizeY}`);
	const spacingRatio = 0.5;
	const divisor = data.percent ? sum(data.y) / 100 : 1;
	const maxY = Math.max(...data.y) / divisor;
	const yScale = sizeY / maxY * 0.85;

	/** @type {[*, number][]} */
	let xxyy = data.x.map((x, i) => [x, data.round ? round(data.y[i]/divisor, 1) : data.y[i]]);
	if (data.pruneY)
		xxyy = xxyy.filter(xy => !(xy[1] < data.pruneY));
	if (data.sort)
		xxyy = xxyy.sort((a, b) => a[1] - b[1]);
	else if (data.sortX) // these two are the only mutually exclusive ones
		xxyy = xxyy.sort((a, b) => a[0] - b[0]);
	if (data.reverse)
		xxyy.reverse();
	if (data.maxBars)
		xxyy = xxyy.slice(0, data.maxBars);
	// console.debug(xxyy);

	const len = xxyy.length;
	const width = sizeX / (len + spacingRatio*(len+1));
	const spacing = sizeX / len;

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
		labelElem.style['font-size'] = `${Math.min(25, 2.5*width/xy[0].length)}px`;
		const valueElem = createSvgElement('text');
		valueElem.innerHTML = y;
		if (data.percent)
			valueElem.innerHTML += '%';
		valueElem.classList.add('value');
		// x-y coords
		const topY = sizeY - y*yScale;
		const offsetX = i*spacing + (spacing - width);
		labelElem.setAttribute('x', offsetX + width/2);
		valueElem.setAttribute('x', offsetX + width/2);
		barElem.setAttribute('x', offsetX);
		labelElem.setAttribute('y', topY - 20);
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
		percent: true,
		reverse: true,
		sort: true,
		round: true,
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
	try {
		const rawData = window.location.href.match(/\?.+/g)[0].replace('?data=', '');
		return fromURL(rawData);
	}
	catch (_){
		// return undefined
	}
}

/**
 * @param {[]} d
 * @param {boolean} sortY - whether to sort chart by Y (true) or X (false)
 * @param {boolean} reverse - whether to reverse order of elements (after sorting)
 * @param {number} pruneY - prune data with y < pruneY
 * @param {number} maxBars - cull bars after this many
 */
function histo(d, sort, reverse, pruneY, maxBars){
	const x = Array.from(new Set(Array.from(d)));
	const y = x.map(char => d.filter(i => i === char).length);
	const data = {
		pruneY,
		reverse,
		sort,
		sortX: !sort,
		round: true,
		type: 'bar',
		x,
		y,
		maxBars,
	};
	return toURL(data);
}

/**
 * @param {[]} d
 * @param {boolean} sortY - whether to sort chart by Y (true) or X (false)
 * @param {boolean} reverse - whether to reverse order of elements (after sorting)
 * @param {number} pruneY - prune data with y < pruneY
 * @param {number} maxBars - cull bars after this many
 */
function histo2(xy, sort, reverse, pruneY, maxBars){
	const x = xy.map(datum => datum[0]);
	const y = xy.map(datum => datum[1]);
	const data = {
		pruneY,
		reverse,
		sort,
		sortX: !sort,
		round: true,
		type: 'bar',
		x,
		y,
		maxBars,
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
		case 'pie':
			pie();
			break;
		case 'scatter':
			scatter();
			break;
		case 'ternary':
			ternary();
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
	const PADDING = 0.05;
	const data = getData();
	// log scaling?
	if (data.logx)
		data.x = data.x.map(Math.log);
	if (data.logy)
		data.y = data.y.map(Math.log);
	/** @type {SVGElement} */
	const chart = document.getElementById('chart');
	chart.setAttribute('viewBox', `0 0 ${sizeX} ${sizeY}`);
	let xMax = Math.max(...data.x.filter(isFinite));
	let xMin = Math.min(...data.x.filter(isFinite));
	let yMax = Math.max(...data.y.filter(isFinite));
	let yMin = Math.min(...data.y.filter(isFinite));
	const xRange = xMax - xMin;
	const yRange = yMax - yMin;
	const xPadding = PADDING * xRange;
	const yPadding = PADDING * yRange;
	xMax += xPadding;
	yMax += yPadding;
	xMin -= xPadding;
	yMin -= yPadding;

	/** @type {[number, number][]} */
	const xxyy = data.x.map((x, i) => [x, data.y[i], data.text && data.text[i]]);

	xxyy.forEach(xy => {
		const g = createSvgElement('g');
		chart.appendChild(g);
		const point = createSvgElement('circle');
		point.setAttribute('r', data.radius || 3);
		point.setAttribute('fill', data.fill || 'black');
		point.classList.add('point');
		// x-y coords
		const [x, y] = [remap(xy[0], [xMin, xMax], [0, sizeX]),
			remap(xy[1], [yMin, yMax], [sizeY, 0])];
		if (!isFinite(x) || !isFinite(y))
			return;
		point.setAttribute('cx', x);
		point.setAttribute('cy', y);
		// append to group
		g.appendChild(point);
		if (data.labels){
			const LABEL = xy[2];
			// label
			if (LABEL){
				const labelElem = createSvgElement('text');
				labelElem.innerHTML = LABEL;
				labelElem.classList.add('label');
				labelElem.setAttribute('x', x);
				labelElem.setAttribute('y', y + 20);
				g.appendChild(labelElem);
			}
			// value
			const valueFnX = data.logx ? Math.exp : vx => vx;
			const valueFnY = data.logy ? Math.exp : vy => vy;
			const valueElem = createSvgElement('text');
			valueElem.innerHTML = `(${valueFnX(xy[0])}, ${valueFnY(xy[1])})`;
			valueElem.classList.add('value');
			valueElem.setAttribute('x', x);
			valueElem.setAttribute('y', y + (LABEL ? 20 : 0) + 10);
			g.appendChild(valueElem);
		}
	});
}
/*
{
  type: 'scatter',
  x,
  y,
  text, // optional, labels for when labels=true
  fill: 'red', // optional, default: black
  labels: true, // optional, default: false
  radius: 1, // optional, default: 3
  logx: true, // optional, whether to scale X axis logarithmically, default: false
  logy: true, // optional, whether to scale Y axis logarithmically, default: false
}
*/

function pie(){
	const SMALL_SECTOR_LABEL_CULL = 0.001;
	const LABEL_DIST = 1.1;
	const GLOBAL_SCALE = 1/LABEL_DIST;
	const data = getData(); // data is X:val, Y:val, Z:val, ...
	/** @type {SVGElement} */
	const chart = document.getElementById('chart');
	chart.setAttribute('viewBox', `${-sizeX/2} ${-sizeY/2} ${sizeX} ${sizeY}`);
	const PIE_RADIUS = GLOBAL_SCALE * Math.min(sizeX, sizeY)/2;
	const total = data.pairs.map(p => p[1]).reduce((a, b) => a+b, 0);
	// main
	let startTheta = 0;
	data.pairs.forEach((pair, i) => {
		const sector = createSvgElement('path');
		const fraction = pair[1] / total;
		const theta = 2*Math.PI*fraction;
		const endTheta = startTheta + theta;
		const [x0, y0] = [PIE_RADIUS*Math.cos(startTheta), PIE_RADIUS*-Math.sin(startTheta)];
		const [x1, y1] = [PIE_RADIUS*Math.cos(endTheta), PIE_RADIUS*-Math.sin(endTheta)];
		const [LARGE_ARC_FLAG, SWEEP_FLAG] = [+(0.5 < fraction), 0];
		// https://www.w3.org/TR/SVG/paths.html#PathDataEllipticalArcCommands
		sector.setAttribute('d', `M 0 0 ${x0} ${y0} A ${PIE_RADIUS} ${PIE_RADIUS} 0 ${LARGE_ARC_FLAG} ${SWEEP_FLAG} ${x1} ${y1} Z`);
		sector.setAttribute('fill', pair[2] || pie.colors[i++ % pie.colors.length]);
		//  stroke="#000" stroke-width="2"
		sector.setAttribute('stroke', 'black');
		sector.setAttribute('stroke-width', 1);
		chart.appendChild(sector);
		startTheta += theta;
		// todo label
		if (!data.labels || fraction < SMALL_SECTOR_LABEL_CULL)
			return;
		const thetac = startTheta - theta/2;
		const [xc, yc] = [LABEL_DIST*PIE_RADIUS*Math.cos(thetac),
			LABEL_DIST*PIE_RADIUS*-Math.sin(thetac)];
		const label = createSvgElement('text');
		label.classList.add('label');
		label.setAttribute('x', xc);
		label.setAttribute('y', yc);
		label.innerHTML = pair[0];
		chart.appendChild(label);
		// value label
		const value = createSvgElement('text');
		value.classList.add('value');
		value.setAttribute('x', xc);
		value.setAttribute('y', yc + 10);
		value.innerHTML = Math.round(1000 * fraction)/10 + '%';
		chart.appendChild(value);
	});
}
pie.colors = ['blue', 'red', 'yellow', 'green']; // todo
/*
{
  type: 'pie',
  pairs: [['x', 1, 'black'], ['y', 2], ['z', 3], ...],
  labels: true, // optional, default: false
}
(you can override individual colors by specifying them in the tuple)
*/

/** generate ternary plot from URL data */
function ternary(){
	const PADDING = 0.07;
	const [WIDTH, HEIGHT] = [sizeY * 2/Math.sqrt(3), sizeY];
	const OFFSET_X = (sizeX - WIDTH)/2;
	function normalize(...args){
		const s = sum(args);
		return args.map(x => x/s);
	}
	// bottom right = max x
	// bottom left = max y
	// top = max z
	function xyz2xy(a, b, c){
		// https://en.wikipedia.org/wiki/Ternary_plot#Plotting_a_ternary_plot
		const x = OFFSET_X + WIDTH * 0.5 * (2*b+c)/(a+b+c);
		const y = HEIGHT - HEIGHT * Math.sqrt(3)/2 * c / (a+b+c);
		return {x, y};
	}
	const data = getData();
	/** @type {SVGElement} */
	const chart = document.getElementById('chart');
	chart.setAttribute('viewBox', `${-PADDING*sizeX} ${-PADDING*sizeY} ${(1+2*PADDING)*sizeX} ${(1+2*PADDING)*sizeY}`);
	// draw triangle
	// <polygon points="100,100 150,25 150,75 200,0" fill="none" stroke="black" />
	const triangle = createSvgElement('polygon');
	// bottom left corner to bottom right corner to top mid
	triangle.setAttribute('points', `${OFFSET_X},${HEIGHT} ${OFFSET_X+WIDTH},${HEIGHT} ${OFFSET_X+WIDTH/2},0`);
	triangle.setAttribute('fill', data.fill || 'white');
	triangle.setAttribute('stroke', data.stroke || 'black');
	chart.appendChild(triangle);

	data.x.map((x, i) => [x, data.y[i], data.z[i]]).forEach((xyz, i) => {
		const coords = xyz2xy(...normalize(...xyz));
		if (!isFinite(coords.x) || !isFinite(coords.y))
			return;
		const g = createSvgElement('g');
		chart.appendChild(g);
		const point = createSvgElement('circle');
		point.setAttribute('r', data.radius || 3);
		point.setAttribute('fill', data.fill || 'black');
		point.classList.add('point');
		point.setAttribute('cx', coords.x);
		point.setAttribute('cy', coords.y);
		// append to group
		g.appendChild(point);
		if (data.labels){
			const LABEL = data.text[i];
			// label
			if (LABEL){
				const labelElem = createSvgElement('text');
				labelElem.innerHTML = LABEL;
				labelElem.classList.add('value');
				labelElem.setAttribute('x', coords.x);
				labelElem.setAttribute('y', coords.y + 10);
				g.appendChild(labelElem);
			}
		}
	});
	// axis labels
	const LABEL_COORDS = {
		x: {x: 0, y: 1},
		y: {x: 1, y: 1},
		z: {x: 0.5, y: 0},
	};
	if (data.axes){
		'xyz'.split('').forEach(x => {
			if (data.axes[x]){
				const labelElem = createSvgElement('text');
				labelElem.innerHTML = data.axes[x];
				labelElem.classList.add('label');
				labelElem.setAttribute('x', OFFSET_X + LABEL_COORDS[x].x * WIDTH);
				labelElem.setAttribute('y', LABEL_COORDS[x].y * HEIGHT);
				chart.appendChild(labelElem);
			}
		});
	}
}
/*
{
  type: 'ternary',
  x,
  y,
  z,
  text, // optional, labels for when labels=true
  fill: 'red', // optional, default: white
  stroke: 'red', // optional, default: black
  labels: true, // optional, default: false
  radius: 1, // optional, default: 3
  axes, // optional, list of x/y/z labels
}
*/

function toURL(data){
	return btoa(JSON.stringify(data));
}