/* eslint-disable no-var */
/* eslint-env es3 */
/* jshint esversion: 3, strict: true, strict: global, eqeqeq: true */
/* exported phoonsvg, phoonTest */
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
	mask.id = 'mask';
	svg.appendChild(mask);
	var maskCircle = shadow.cloneNode();
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
	terminator2.setAttribute('mask', 'url(#mask)');
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