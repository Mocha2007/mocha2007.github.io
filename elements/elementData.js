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
		z: 76,
		name: 'Osmium',
		symbol: 'Os',
		mass: 190.23,
		group: 8,
		period: 6,
	},
	{
		z: 77,
		name: 'Iridium',
		symbol: 'Ir',
		mass: 192.217,
		group: 9,
		period: 6,
	},
	{
		z: 78,
		name: 'Platinum',
		symbol: 'Pt',
		mass: 195.084,
		group: 10,
		period: 6,
	},
	{
		z: 79,
		name: 'Gold',
		symbol: 'Au',
		mass: 196.96657,
		group: 11,
		period: 6,
	},
	{
		z: 80,
		name: 'Mercury',
		symbol: 'Hg',
		mass: 200.592,
		group: 12,
		period: 6,
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
		z: 85,
		name: 'Astatine',
		symbol: 'At',
		mass: 210,
		group: 17,
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
	{
		z: 93,
		name: 'Neptunium',
		symbol: 'Np',
		mass: 237,
		period: 7,
	},
	{
		z: 94,
		name: 'Plutonium',
		symbol: 'Pu',
		mass: 244,
		period: 7,
	},
	{
		z: 95,
		name: 'Americium',
		symbol: 'Am',
		mass: 243,
		period: 7,
	},
	{
		z: 96,
		name: 'Curium',
		symbol: 'Cm',
		mass: 247,
		period: 7,
	},
	{
		z: 97,
		name: 'Berkelium',
		symbol: 'Bk',
		mass: 247,
		period: 7,
	},
	{
		z: 98,
		name: 'Californium',
		symbol: 'Cf',
		mass: 251,
		period: 7,
	},
];

const isotopeData = [
	// ignore all decay modes with P < 0.01
	// include just HL >= 1 yr
	{
		name: 'Os-184',
		abundance: 2e-4,
	},
	{
		name: 'Os-187',
		abundance: 0.0196,
	},
	{
		name: 'Os-188',
		abundance: 0.1324,
	},
	{
		name: 'Os-189',
		abundance: 0.1615,
	},
	{
		name: 'Os-190',
		abundance: 0.2626,
	},
	{
		name: 'Os-192',
		abundance: 0.4078,
	},
	{
		name: 'Ir-190',
		decayTypes: [
			['b+', 1],
		],
		halfLife: 11.78*day,
	},
	{
		name: 'Ir-191',
		abundance: 0.373,
	},
	{
		name: 'Ir-193',
		abundance: 0.627,
	},
	{
		name: 'Pt-190',
		decayTypes: [
			['b+', 1],
		],
		halfLife: 6.5e11*year,
		abundance: 1.4e-4,
	},
	{
		name: 'Pt-192',
		abundance: 0.00782,
	},
	{
		name: 'Pt-193',
		decayTypes: [
			['ec', 1],
		],
		halfLife: 50*year,
	},
	{
		name: 'Pt-194',
		abundance: 0.32967,
	},
	{
		name: 'Pt-195',
		abundance: 0.33832,
	},
	{
		name: 'Pt-196',
		abundance: 0.25242,
	},
	{
		name: 'Pt-198',
		abundance: 0.07163,
	},
	{
		name: 'Au-194',
		decayTypes: [
			['b+', 1],
		],
		halfLife: 38.02*hour,
	},
	{
		name: 'Au-197',
		abundance: 1,
	},
	{
		name: 'Hg-194',
		decayTypes: [
			['ec', 1],
		],
		halfLife: 444*year,
	},
	{
		name: 'Hg-196',
		abundance: 0.0015,
	},
	{
		name: 'Hg-198',
		abundance: 0.0997,
	},
	{
		name: 'Hg-199',
		abundance: 0.1687,
	},
	{
		name: 'Hg-200',
		abundance: 0.231,
	},
	{
		name: 'Hg-201',
		abundance: 0.1318,
	},
	{
		name: 'Hg-202',
		abundance: 0.2986,
	},
	{
		name: 'Hg-204',
		abundance: 0.0687,
	},
	{
		name: 'Tl-202',
		decayTypes: [
			['b+', 1],
		],
		halfLife: 12.23*day,
	},
	{
		name: 'Tl-203',
		abundance: 0.2952,
	},
	{
		name: 'Tl-204',
		decayTypes: [
			['b-', 0.971],
			['ec', 0.029],
		],
		halfLife: 3.78*year,
	},
	{
		name: 'Tl-205',
		abundance: 0.7048,
	},
	{
		name: 'Tl-207',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 4.77*minute,
	},
	{
		name: 'Tl-208',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 3.053*minute,
	},
	{
		name: 'Tl-209',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 2.161*minute,
	},
	{
		name: 'Tl-210',
		decayTypes: [
			['b-', 0.99991],
		],
		halfLife: 1.3*minute,
	},
	{
		name: 'Pb-202',
		decayTypes: [
			['ec', 0.99],
			['a', 0.01],
		],
		halfLife: 5.25e4*year,
	},
	{
		name: 'Pb-204',
		abundance: 0.014,
	},
	{
		name: 'Pb-205',
		decayTypes: [
			['ec', 1],
		],
		halfLife: 1.73e7*year,
	},
	{
		name: 'Pb-206',
		abundance: 0.241,
	},
	{
		name: 'Pb-207',
		abundance: 0.221,
	},
	{
		name: 'Pb-208',
		abundance: 0.524,
	},
	{
		name: 'Pb-209',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 3.253*hour,
	},
	{
		name: 'Pb-210',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 22.3*year,
	},
	{
		name: 'Pb-211',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 36.1*minute,
	},
	{
		name: 'Pb-212',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 10.64*hour,
	},
	{
		name: 'Pb-214',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 26.8*minute,
	},
	{
		name: 'Bi-207',
		decayTypes: [
			['b+', 1],
		],
		halfLife: 32.9*year,
	},
	{
		name: 'Bi-208',
		decayTypes: [
			['b+', 1],
		],
		halfLife: 3.68e5*year,
	},
	{
		name: 'Bi-209',
		decayTypes: [
			['a', 1],
		],
		halfLife: 2.01e19*year,
	},
	{
		name: 'Bi-210',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 5.012*day,
	},
	{
		name: 'Bi-211',
		decayTypes: [
			['a', 0.9972],
		],
		halfLife: 2.14*minute,
	},
	{
		name: 'Bi-212',
		decayTypes: [
			['b-', 0.6405],
			['a', 0.3594],
		],
		halfLife: 60.55*minute,
	},
	{
		name: 'Bi-213',
		decayTypes: [
			['b-', 0.9791],
			['a', 0.0209],
		],
		halfLife: 45.59*minute,
	},
	{
		name: 'Bi-214',
		decayTypes: [
			['a', 0.9997],
		],
		halfLife: 19.9*minute,
	},
	{
		name: 'Po-210',
		decayTypes: [
			['a', 1],
		],
		halfLife: 138.376*day,
	},
	{
		name: 'Po-208',
		decayTypes: [
			['a', 0.9999],
		],
		halfLife: 2.898*year,
	},
	{
		name: 'Po-209',
		decayTypes: [
			['a', 0.9952],
		],
		halfLife: 125.2*year,
	},
	{
		name: 'Po-212',
		decayTypes: [
			['a', 1],
		],
		halfLife: 299e-9,
	},
	{
		name: 'Po-213',
		decayTypes: [
			['a', 1],
		],
		halfLife: 3.65e-6,
	},
	{
		name: 'Po-215',
		decayTypes: [
			['a', 0.9999],
		],
		halfLife: 1.781e-3,
	},
	{
		name: 'Po-216',
		decayTypes: [
			['a', 1],
		],
		halfLife: 0.145,
	},
	{
		name: 'Po-218',
		decayTypes: [
			['a', 0.9998],
		],
		halfLife: 3.1*minute,
	},
	{
		name: 'At-217',
		decayTypes: [
			['a', 0.9998],
		],
		halfLife: 32.3e-3,
	},
	{
		name: 'Rn-219',
		decayTypes: [
			['a', 1],
		],
		halfLife: 3.96,
	},
	{
		name: 'Rn-220',
		decayTypes: [
			['a', 1],
		],
		halfLife: 55.6,
	},
	{
		name: 'Rn-222',
		decayTypes: [
			['a', 1],
		],
		halfLife: 3.8235*day,
	},
	{
		name: 'Fr-221',
		decayTypes: [
			['a', 0.999],
		],
		halfLife: 4.9*minute,
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
		name: 'Ra-224',
		decayTypes: [
			['a', 1],
		],
		halfLife: 3.6319*day,
	},
	{
		name: 'Ra-225',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 14.9*day,
	},
	{
		name: 'Ra-226',
		decayTypes: [
			['a', 1],
		],
		halfLife: 1600*year,
	},
	{
		name: 'Ra-228',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 5.75*year,
	},
	{
		name: 'Ac-225',
		decayTypes: [
			['a', 1],
		],
		halfLife: 10*day,
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
		name: 'Ac-228',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 6.13*hour,
	},
	{
		name: 'Th-227',
		decayTypes: [
			['a', 1],
		],
		halfLife: 18.68*day,
	},
	{
		name: 'Th-228',
		decayTypes: [
			['a', 1],
		],
		halfLife: 1.9116*year,
	},
	{
		name: 'Th-229',
		decayTypes: [
			['a', 1],
		],
		halfLife: 7340*year,
	},
	{
		name: 'Th-230',
		decayTypes: [
			['a', 1],
		],
		halfLife: 7.538e4*year,
	},
	{
		name: 'Th-231',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 25.5*hour,
	},
	{
		name: 'Th-232',
		decayTypes: [
			['a', 1],
		],
		halfLife: 1.405e10*year,
		abundance: 0.9998,
	},
	{
		name: 'Th-234',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 24.1*day,
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
		name: 'Pa-233',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 26.975*day,
		abundance: 1,
	},
	{
		name: 'Pa-234',
		decayTypes: [
			['b-', 0.9984],
		],
		halfLife: 6.7*hour,
	},
	{
		name: 'U-232',
		decayTypes: [
			['a', 1],
		],
		halfLife: 68.9*year,
	},
	{
		name: 'U-233',
		decayTypes: [
			['a', 1],
		],
		halfLife: 1.592e5*year,
	},
	{
		name: 'U-234',
		decayTypes: [
			['a', 1],
		],
		halfLife: 2.455e5*year,
		abundance: 0.000054,
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
		name: 'U-236',
		decayTypes: [
			['a', 1],
		],
		halfLife: 2.342e7*year,
	},
	{
		name: 'U-238',
		decayTypes: [
			['a', 1],
		],
		halfLife: 4.468e9*year,
		abundance: 0.992745,
	},
	{
		name: 'U-240',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 14.1*hour,
	},
	{
		name: 'Np-236',
		decayTypes: [
			['ec', 0.873],
			['b-', 0.125],
		],
		halfLife: 1.54e6*year,
	},
	{
		name: 'Np-237',
		decayTypes: [
			['a', 1],
		],
		halfLife: 2.144e6*year,
	},
	{
		name: 'Np-239',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 2.356*day,
	},
	{
		name: 'Np-240',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 61.9*minute,
	},
	{
		name: 'Pu-236',
		decayTypes: [
			['a', 1],
		],
		halfLife: 2.858*year,
	},
	{
		name: 'Pu-238',
		decayTypes: [
			['a', 1],
		],
		halfLife: 87.7*year,
	},
	{
		name: 'Pu-239',
		decayTypes: [
			['a', 1],
		],
		halfLife: 2.411e4*year,
	},
	{
		name: 'Pu-240',
		decayTypes: [
			['a', 1],
		],
		halfLife: 6.561e3*year,
	},
	{
		name: 'Pu-241',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 14.29*year,
	},
	{
		name: 'Pu-242',
		decayTypes: [
			['a', 1],
		],
		halfLife: 3.75e5*year,
	},
	{
		name: 'Pu-243',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 4.956*hour,
	},
	{
		name: 'Pu-244',
		decayTypes: [
			['a', 0.9988],
		],
		halfLife: 8e7*year,
	},
	{
		name: 'Pu-246',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 10.84*day,
	},
	{
		name: 'Am-241',
		decayTypes: [
			['a', 1],
		],
		halfLife: 432.2*year,
	},
	{
		name: 'Am-243',
		decayTypes: [
			['a', 1],
		],
		halfLife: 7370*year,
	},
	{
		name: 'Am-246',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 39*minute,
	},
	{
		name: 'Cm-243',
		decayTypes: [
			['a', 0.9971],
		],
		halfLife: 29.1*year,
	},
	{
		name: 'Cm-244',
		decayTypes: [
			['a', 1],
		],
		halfLife: 18.1*year,
	},
	{
		name: 'Cm-245',
		decayTypes: [
			['a', 1],
		],
		halfLife: 8500*year,
	},
	{
		name: 'Cm-246',
		decayTypes: [
			['a', 1],
		],
		halfLife: 4760*year,
	},
	{
		name: 'Cm-247',
		decayTypes: [
			['a', 1],
		],
		halfLife: 1.56e7*year,
	},
	{
		name: 'Cm-248',
		decayTypes: [
			['a', 0.9174],
			['sf', 0.0826],
		],
		halfLife: 3.48e5*year,
	},
	{
		name: 'Cm-250',
		decayTypes: [
			['sf', 0.74],
			['a', 0.18],
			['b-', 0.08],
		],
		halfLife: 8300*year,
	},
	{
		name: 'Bk-247',
		decayTypes: [
			['a', 1],
		],
		halfLife: 1380*year,
	},
	{
		name: 'Bk-250',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 3.212*hour,
	},
	{
		name: 'Cf-250',
		decayTypes: [
			['a', 0.9992],
		],
		halfLife: 13.08*year,
	},
	{
		name: 'Cf-251',
		decayTypes: [
			['a', 1],
		],
		halfLife: 900*year,
	},
	{
		name: 'Cf-252',
		decayTypes: [
			['a', 0.969],
			['sf', 0.0309],
		],
		halfLife: 2.645*year,
	},
];