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
	// center of the bigger circle (terminator)
	var x0 = 2*phase - 1;
	// r^2 = (x+a)^2 + y^2
	var a = -(x0*x0-1)/(2*x0);
	// radius of bigger circle
	var r = Math.sqrt(a*a + 1);
	/* the basic structure of the image is this:
		(1) black bg
		(2) white terminator circle (above)
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
	var terminator = createSvgElement('circle');
	terminator.setAttribute('cx', x0+1);
	terminator.setAttribute('r', r);
	terminator.style.fill = 'black';
	terminator.setAttribute('mask', 'url(#mask)');
	svg.appendChild(terminator);
	return svg;
}