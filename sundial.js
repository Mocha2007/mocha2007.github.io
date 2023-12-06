/* eslint-disable no-var */
/* eslint-env es3 */
/* jshint esversion: 3, strict: true, strict: global, eqeqeq: true */
/* exported sundial */
/* global createSvgElement, phoonsvg, svgScale */
'use strict';

/**
 * creates a clock that looks like the clock in MC, except it accounts for the moon's phase and relative position.
 * @param {number} dayPhase [0, 1) 0 = 1 = dawn
 * @param {number} moonPhase [0, 1) 0 = 1 = new moon
 * @param {boolean} ornamental dress this svg up like a MC-style clock
 * @param {number[]} planets array of planet locations, measured in radians from the sun
 * @param {string[]} planetNames array of planet names (default = all blank)
 */
function sundial(dayPhase, moonPhase, ornamental, planets, planetNames){
	// default values
	planets = planets || [];
	planetNames = planetNames || [];
	// main
	var bodySize = 0.2;
	var fontsize = 0.1;
	/**
	 * IMAGE STRUCTURE
	 * cyan day sky
	 * midnight blue sky with semicircular mask
	 * pale yellow sun circle
	 * phoon()
	 * both of these are rotated about the center
	 */
	var svg = createSvgElement('svg');
	svg.classList.add('sundial');
	svg.setAttribute('viewBox', '-1.1 -1.1 2.2 2.2');
	svg.setAttribute('width', 10*svgScale);
	svg.setAttribute('height', 10*svgScale);
	svg.setAttribute('aria-label', 'Sundial');
	// css
	var style = document.createElement('style');
	style.innerHTML = 'text{font-size:' + fontsize
		+ 'px;user-select:none;}\ng .pText{fill:white;opacity:0;paint-order:stroke;stroke:black;stroke-width:0.02px;}\ng:hover > .pText{opacity:1;}';
	svg.appendChild(style);
	// gold perimeter disk
	if (ornamental){
		var clockDisk = createSvgElement('circle');
		svg.appendChild(clockDisk);
		clockDisk.setAttribute('r', 1.1);
		clockDisk.style.fill = '#fc0';
	}
	// entire image
	var g = createSvgElement('g');
	svg.appendChild(g);
	// rotate entire image
	var globalTheta = 360 * -dayPhase + 90;
	g.setAttribute('transform', 'rotate(' + globalTheta + ', 0, 0)');
	// day disk
	var dayDisk = createSvgElement('circle');
	g.appendChild(dayDisk);
	dayDisk.setAttribute('r', 1);
	dayDisk.style.fill = '#08f';
	// mask https://stackoverflow.com/a/61001784
	var mask = createSvgElement('clipPath');
	g.appendChild(mask);
	mask.id = 'cut-off';
	var rect = createSvgElement('rect');
	mask.appendChild(rect);
	rect.setAttribute('x', -1);
	rect.setAttribute('y', 0);
	rect.setAttribute('width', 2);
	rect.setAttribute('height', 1);
	// night disk
	var nightDisk = createSvgElement('circle');
	g.appendChild(nightDisk);
	nightDisk.setAttribute('r', 1);
	nightDisk.style.fill = '#204';
	nightDisk.setAttribute('clip-path', 'url(#cut-off)');
	// sun disk
	var sunDisk = createSvgElement('circle');
	g.appendChild(sunDisk);
	sunDisk.setAttribute('r', bodySize);
	sunDisk.setAttribute('cy', -0.5);
	sunDisk.style.fill = '#ff8';
	// phoon https://stackoverflow.com/a/27546213
	var moonContainer = createSvgElement('g');
	g.appendChild(moonContainer);
	moonContainer.setAttribute('transform', 'rotate(' + 360 * -moonPhase + ', 0, 0)');
	var moonDisk = phoonsvg(moonPhase);
	moonContainer.appendChild(moonDisk);
	moonDisk.setAttribute('width', 2*bodySize);
	moonDisk.setAttribute('height', 2*bodySize);
	moonDisk.setAttribute('x', -0.19);
	moonDisk.setAttribute('y', -0.7);
	// planets
	for (var pID = 0; pID < planets.length; pID++){
		var angle = 180/Math.PI * planets[pID];
		// planet group
		var pg = createSvgElement('g');
		g.appendChild(pg);
		pg.setAttribute('transform', 'rotate(' + angle + ', 0, 0)');
		// planet disk
		var planetDisk = createSvgElement('circle');
		pg.appendChild(planetDisk);
		planetDisk.style.fill = 'white';
		planetDisk.style.stroke = 'black';
		planetDisk.style.strokeWidth = bodySize/16;
		planetDisk.setAttribute('r', bodySize/8);
		planetDisk.setAttribute('cy', -0.5);
		// planet label
		var planetLabel = createSvgElement('text');
		pg.appendChild(planetLabel);
		planetLabel.innerHTML = planetNames[pID];
		planetLabel.classList.add('pText');
		planetLabel.setAttribute('y', -0.5);
		var labelTheta = -globalTheta-angle;
		planetLabel.setAttribute('transform', 'rotate(' + labelTheta + ', 0, -0.5)');
	}
	if (ornamental){
		var labelDelta = -0.027;
		var labels = ['Dawn', 'L. Morn', 'Noon', 'Afternoon', 'Dusk', 'Evening', 'Midnight', 'E. Morn'];
		for (let i = 0; i < labels.length; i++){
			var dayLabel = createSvgElement('text');
			g.appendChild(dayLabel);
			var s = labels[i];
			dayLabel.innerHTML = s;
			var fill = i % 4 ? i % 2 ? 'silver' : 'white' : 'red';
			dayLabel.setAttribute('fill', fill);
			dayLabel.setAttribute('text-align', 'center');
			dayLabel.setAttribute('x', labelDelta * s.length);
			dayLabel.setAttribute('y', -0.8);
			var theta = 270 + 45*i;
			dayLabel.setAttribute('transform', 'rotate(' + theta + ', 0, 0)');
		}
		// bottom half of mc clock
		var bottomDisk = createSvgElement('circle');
		svg.appendChild(bottomDisk);
		bottomDisk.setAttribute('r', 1);
		bottomDisk.style.fill = 'rgba(255, 192, 0, 0.5)';
		bottomDisk.setAttribute('clip-path', 'url(#cut-off)');
		// ornamentation
		// middle bar
		var bar = createSvgElement('rect');
		svg.appendChild(bar);
		bar.setAttribute('x', -1);
		bar.setAttribute('y', -0.05);
		bar.setAttribute('width', 2);
		bar.setAttribute('height', 0.1);
		bar.style.fill = '#fc0';
		// triangle
		var triangle = createSvgElement('polygon');
		svg.appendChild(triangle);
		triangle.setAttribute('points', '-0.2 0, 0 -0.2, 0.2 0');
		triangle.style.fill = '#fc0';
		// text
		if (ornamental === 2){
			var hours = 'I II III IV V VI VII VIII IX X XI XII'.split(' ');
			for (let i = 0; i < 2*hours.length; i++){
				var hLabel = createSvgElement('text');
				g.appendChild(hLabel);
				s = hours[i%12];
				hLabel.innerHTML = s;
				hLabel.setAttribute('fill', '#860');
				hLabel.setAttribute('text-align', 'center');
				hLabel.setAttribute('x', labelDelta * s.length);
				hLabel.setAttribute('y', -1.015);
				theta = 15 + 15*i;
				hLabel.setAttribute('transform', 'rotate(' + theta + ', 0, 0)');
			}
			// east/west
			var eastLabel = hLabel.cloneNode();
			svg.appendChild(eastLabel);
			eastLabel.innerHTML = 'EAST';
			eastLabel.setAttribute('x', 0.45);
			eastLabel.setAttribute('y', 0.03);
			eastLabel.setAttribute('transform', 'rotate(0, 0, 0)');
			var westLabel = eastLabel.cloneNode();
			svg.appendChild(westLabel);
			westLabel.innerHTML = 'WEST';
			westLabel.setAttribute('x', -0.65);
		}
	}
	return svg;
}