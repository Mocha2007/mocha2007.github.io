/* eslint-disable no-var */
/* jshint esversion: 3, strict: true, strict: global, eqeqeq: true */
/* exported phoonsvg */
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
	var x0 = 2*phase - 1;
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
	shadow.style.fill = 'white';
	svg.appendChild(shadow);
	// mask
	var mask = createSvgElement('mask');
	mask.id = 'mask';
	svg.appendChild(mask);
	var maskCircle = shadow.cloneNode();
	mask.appendChild(maskCircle);
	// circle
	var terminator = createSvgElement('ellipse');
	terminator.setAttribute('rx', Math.abs(x0));
	terminator.setAttribute('ry', 1);
	terminator.style.fill = 'black';
	svg.appendChild(terminator);
	var terminator2 = createSvgElement('rect');
	terminator2.setAttribute('x', x0 < 0 ? -1 : 0);
	terminator2.setAttribute('y', -1);
	terminator2.setAttribute('width', 1);
	terminator2.setAttribute('height', 2);
	terminator2.setAttribute('mask', 'url(#mask)');
	svg.appendChild(terminator2);
	return svg;
}