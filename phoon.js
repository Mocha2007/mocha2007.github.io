/* eslint-disable no-var */
/* eslint-env es3 */
/* jshint esversion: 3, strict: true, strict: global, eqeqeq: true */
/* exported phoonsvg, phoonTest, sundial */
'use strict';

var svgScale = 15;

// cloned from common.js, look there for docs
/** @returns {SVGElement} */
function createSvgElement(name){
	return document.createElementNS('http://www.w3.org/2000/svg', name);
}

/** @param {number} phase [0, 1) */
function phoonsvg(phase){
	// shift from [0, 1) to [-1, 1)
	// in-circle zero
	// -1 new moon, -0.5 first q, 0 full, 0.5 third q, 1 new
	var x0 = 2*phase - 1;
	var gibbous = 0.25 < phase && phase < 0.75;
	// r^2 = x^2/a + y^2
	/* the basic structure of the image is this:
		(1) white circle
		(2) black terminator ellipse (above) + black terminator rect
		(3) circular mask to remove edges
	*/
	var svg = createSvgElement('svg');
	svg.classList.add('phoon');
	svg.setAttribute('viewBox', '-1 -1 2 2');
	svg.setAttribute('width', svgScale);
	svg.setAttribute('height', svgScale);
	// bg circle
	var shadow = createSvgElement('circle');
	shadow.setAttribute('r', 1);
	shadow.style.fill = gibbous ? 'black' : 'white';
	svg.appendChild(shadow);
	// mask
	var mask = createSvgElement('mask');
	mask.id = 'mask' + phase;
	svg.appendChild(mask);
	var maskCircle = shadow.cloneNode();
	maskCircle.style.fill = 'white'; // just in case
	mask.appendChild(maskCircle);
	// circle
	var terminator = createSvgElement('ellipse');
	// r should go from 1 0 1 0
	terminator.setAttribute('rx', 2*Math.abs(Math.abs(x0) - 0.5));
	terminator.setAttribute('ry', 1);
	svg.appendChild(terminator);
	var terminator2 = createSvgElement('rect');
	// -1 0 -1 0 every 0.25 x0
	var leftRight = Math.floor(phase * 4) % 2;
	terminator2.setAttribute('x', leftRight ? 0 : -1);
	terminator2.setAttribute('y', -1);
	terminator2.setAttribute('width', 1);
	terminator2.setAttribute('height', 2);
	terminator2.setAttribute('mask', 'url(#' + mask.id + ')');
	terminator2.style.fill = terminator.style.fill = gibbous ? 'white' : 'black';
	svg.appendChild(terminator2);
	return svg;
}

function phoonTest(){
	var e = document.getElementById('top');
	for (var i = 0.01; i < 1; i += 0.05){
		var m = phoonsvg(i);
		m.setAttribute('height', 50);
		m.setAttribute('width', 50);
		e.appendChild(m);
	}
}

/**
 * creates a clock that looks like the clock in MC, except it accounts for the moon's phase and relative position.
 * @param {number} dayPhase [0, 1) 0 = 1 = dawn
 * @param {number} moonPhase [0, 1) 0 = 1 = new moon
 * @param {boolean} ornamental dress this svg up like a MC-style clock
 */
function sundial(dayPhase, moonPhase, ornamental = true){
	var bodySize = 0.2;
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
	var moonDisk = phoonsvg(moonPhase);
	g.appendChild(moonDisk);
	moonDisk.setAttribute('width', 2*bodySize);
	moonDisk.setAttribute('height', 2*bodySize);
	moonDisk.setAttribute('x', -0.19);
	moonDisk.setAttribute('y', -0.7);
	moonDisk.setAttribute('transform', 'rotate(' + 360 * -moonPhase + ', 0, 0)');
	// rotate entire image
	g.setAttribute('transform', 'rotate(' + (360 * -dayPhase + 90) + ', 0, 0)');
	if (ornamental){
		var fontsize = 0.15;
		// day label
		var dayLabel = createSvgElement('text');
		g.appendChild(dayLabel);
		dayLabel.innerHTML = 'Noon';
		dayLabel.setAttribute('font-size', fontsize);
		dayLabel.setAttribute('text-align', 'center');
		dayLabel.setAttribute('x', -0.15);
		dayLabel.setAttribute('y', -0.8);
		// night label
		var nightLabel = dayLabel.cloneNode();
		g.appendChild(nightLabel);
		nightLabel.innerHTML = 'Midnight';
		nightLabel.setAttribute('fill', 'white');
		nightLabel.setAttribute('x', -0.3);
		nightLabel.setAttribute('transform', 'rotate(180, 0, 0)');
		// dawn label
		var dawnLabel = dayLabel.cloneNode();
		g.appendChild(dawnLabel);
		dawnLabel.innerHTML = 'Dawn';
		dawnLabel.setAttribute('fill', 'red');
		dawnLabel.setAttribute('transform', 'rotate(270, 0, 0)');
		// dusk label
		var duskLabel = dawnLabel.cloneNode();
		g.appendChild(duskLabel);
		duskLabel.innerHTML = 'Dusk';
		duskLabel.setAttribute('transform', 'rotate(90, 0, 0)');
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
	}
	return svg;
}