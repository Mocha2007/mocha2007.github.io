/* exported elementData, isotopeData */
'use strict';

const minute = 60;
const hour = 60 * minute;
const day = 24 * hour;
const year = 365.2425 * day;

const elementData = [
	{
		z: 1,
		name: 'Hydrogen',
		symbol: 'H',
		mass: 1.008,
		group: 1,
		period: 1,
	},
	{
		z: 2,
		name: 'Helium',
		symbol: 'He',
		mass: 4.0026,
		group: 18,
		period: 1,
	},
	{
		z: 3,
		name: 'Lithium',
		symbol: 'Li',
		mass: 6.94,
		group: 1,
		period: 2,
	},
	{
		z: 4,
		name: 'Beryllium',
		symbol: 'Be',
		mass: 9.0121831,
		group: 2,
		period: 2,
	},
	{
		z: 5,
		name: 'Boron',
		symbol: 'B',
		mass: 10.81,
		group: 13,
		period: 2,
	},
	{
		z: 6,
		name: 'Carbon',
		symbol: 'C',
		mass: 12.011,
		group: 14,
		period: 2,
	},
	{
		z: 7,
		name: 'Nitrogen',
		symbol: 'N',
		mass: 14.007,
		group: 15,
		period: 2,
	},
	{
		z: 8,
		name: 'Oxygen',
		symbol: 'O',
		mass: 15.999,
		group: 16,
		period: 2,
	},
	{
		z: 9,
		name: 'Fluorine',
		symbol: 'F',
		mass: 18.998403163,
		group: 17,
		period: 2,
	},
	{
		z: 10,
		name: 'Neon',
		symbol: 'Ne',
		mass: 20.1797,
		group: 18,
		period: 2,
	},
	// skip a few
	{
		z: 26,
		name: 'Iron',
		symbol: 'Fe',
		mass: 55.845,
		group: 8,
		period: 4,
	},
	{
		z: 81,
		name: 'Thallium',
		symbol: 'Tl',
		mass: 204.38,
		group: 13,
		period: 6,
	},
	{
		z: 82,
		name: 'Lead',
		symbol: 'Pb',
		mass: 207.2,
		group: 14,
		period: 6,
	},
	{
		z: 83,
		name: 'Bismuth',
		symbol: 'Bi',
		mass: 208.9804,
		group: 15,
		period: 6,
	},
	{
		z: 84,
		name: 'Polonium',
		symbol: 'Po',
		mass: 209,
		group: 16,
		period: 6,
	},
	{
		z: 86,
		name: 'Radon',
		symbol: 'Rn',
		mass: 222,
		group: 18,
		period: 6,
	},
	{
		z: 87,
		name: 'Francium',
		symbol: 'Fr',
		mass: 223,
		group: 1,
		period: 7,
	},
	{
		z: 88,
		name: 'Radium',
		symbol: 'Ra',
		mass: 226,
		group: 2,
		period: 7,
	},
	{
		z: 89,
		name: 'Actinium',
		symbol: 'Ac',
		mass: 227,
		group: 3,
		period: 7,
	},
	{
		z: 90,
		name: 'Thorium',
		symbol: 'Th',
		mass: 232.0377,
		period: 7,
	},
	{
		z: 91,
		name: 'Protactinium',
		symbol: 'Pa',
		mass: 231.03588,
		period: 7,
	},
	{
		z: 92,
		name: 'Uranium',
		symbol: 'U',
		mass: 238.02891,
		period: 7,
	},
];

const isotopeData = [
	// ignore all decay modes with P < 0.01
	{
		name: 'Tl-207',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 4.77*minute,
	},
	{
		name: 'Pb-207',
	},
	{
		name: 'Pb-211',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 36.1*minute,
	},
	{
		name: 'Bi-211',
		decayTypes: [
			['a', 0.9972],
		],
		halfLife: 2.14*minute,
	},
	{
		name: 'Po-215',
		decayTypes: [
			['a', 0.9999],
		],
		halfLife: 1.781e-3,
	},
	{
		name: 'Rn-219',
		decayTypes: [
			['a', 1],
		],
		halfLife: 3.96,
	},
	{
		name: 'Fr-223',
		decayTypes: [
			['b-', 0.9999],
		],
		halfLife: 22*minute,
	},
	{
		name: 'Ra-223',
		decayTypes: [
			['a', 1],
		],
		halfLife: 11.43*day,
	},
	{
		name: 'Ac-227',
		decayTypes: [
			['b-', 0.9861],
			['a', 0.0138],
		],
		halfLife: 21.772*year,
	},
	{
		name: 'Pa-231',
		decayTypes: [
			['a', 1],
		],
		halfLife: 3.276e4*year,
		abundance: 1,
	},
	{
		name: 'Th-227',
		decayTypes: [
			['a', 1],
		],
		halfLife: 18.68*day,
	},
	{
		name: 'Th-231',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 25.5*hour,
	},
	{
		name: 'U-235',
		decayTypes: [
			['a', 1],
		],
		halfLife: 7.038e6*year,
		abundance: 0.0072,
	},
	{
		name: 'U-238',
		decayTypes: [
			['a', 1],
		],
		halfLife: 4.468e9*year,
		abundance: 0.992745,
	},
];