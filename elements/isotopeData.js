/* exported isotopeData */
'use strict';

const minute = 60;
const hour = 60 * minute;
const day = 24 * hour;
const year = 365.2425 * day;

const isotopeData = [
	// ignore all decay modes with P < 0.01
	// include just HL >= 1 yr
	{
		name: 'H-1',
		abundance: 0.9998,
	},
	{
		name: 'H-2',
		abundance: 0.0002,
	},
	{
		name: 'H-3',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 12.32*year,
	},
	{
		name: 'He-3',
		abundance: 1.34e-6,
	},
	{
		name: 'He-4',
		abundance: 0.99999866,
	},
	{
		name: 'Li-6',
		abundance: 0.0759,
	},
	{
		name: 'Li-7',
		abundance: 0.9241,
	},
	{
		name: 'Be-9',
		abundance: 1,
	},
	{
		name: 'Be-10',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 1.51e6*year,
	},
	{
		name: 'B-10',
		abundance: 0.199,
	},
	{
		name: 'B-11',
		abundance: 0.801,
	},
	{
		name: 'C-12',
		abundance: 0.9893,
	},
	{
		name: 'C-13',
		abundance: 0.0107,
	},
	{
		name: 'C-14',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 5730*year,
	},
	{
		name: 'N-14',
		abundance: 0.99636,
	},
	{
		name: 'N-15',
		abundance: 0.00364,
	},
	{
		name: 'O-16',
		abundance: 0.99757,
	},
	{
		name: 'O-17',
		abundance: 3.8e-4,
	},
	{
		name: 'O-18',
		abundance: 2.05e-3,
	},
	{
		name: 'F-19',
		abundance: 1,
	},
	{
		name: 'Ne-20',
		abundance: 0.9048,
	},
	{
		name: 'Ne-21',
		abundance: 0.0027,
	},
	{
		name: 'Ne-22',
		abundance: 0.0925,
	},
	{
		name: 'Na-22',
		decayTypes: [
			['b+', 1],
		],
		halfLife: 2.6018*year,
	},
	{
		name: 'Na-23',
		abundance: 1,
	},
	{
		name: 'Mg-24',
		abundance: 0.7899,
	},
	{
		name: 'Mg-25',
		abundance: 0.1,
	},
	{
		name: 'Mg-26',
		abundance: 0.1101,
	},
	{
		name: 'Al-26',
		decayTypes: [
			['b+', 0.85],
			['ec', 0.15],
		],
		halfLife: 7.17e5*year,
	},
	{
		name: 'Al-27',
		abundance: 1,
	},
	{
		name: 'Si-28',
		abundance: 0.92223,
	},
	{
		name: 'Si-29',
		abundance: 0.04685,
	},
	{
		name: 'Si-30',
		abundance: 0.03092,
	},
	{
		name: 'Si-32',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 153*year,
	},
	{
		name: 'P-31',
		abundance: 1,
	},
	{
		name: 'P-32',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 14.268*day,
	},
	{
		name: 'S-32',
		abundance: 0.9499,
	},
	{
		name: 'S-33',
		abundance: 0.0075,
	},
	{
		name: 'S-34',
		abundance: 0.0425,
	},
	{
		name: 'S-36',
		abundance: 0.0001,
	},
	{
		name: 'Cl-35',
		abundance: 0.7576,
	},
	{
		name: 'Cl-36',
		decayTypes: [
			['b-', 0.981],
			['b+', 0.019],
		],
		halfLife: 14.268*day,
	},
	{
		name: 'Cl-37',
		abundance: 0.2424,
	},
	{
		name: 'Ar-36',
		abundance: 0.003336,
	},
	{
		name: 'Ar-38',
		abundance: 0.000629,
	},
	{
		name: 'Ar-39',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 269*year,
	},
	{
		name: 'Ar-40',
		abundance: 0.996035,
	},
	{
		name: 'Ar-42',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 32.9*year,
	},
	{
		name: 'K-39',
		abundance: 0.932581,
	},
	{
		name: 'K-40',
		decayTypes: [
			['b-', 0.8928],
			['ec', 0.1072],
			['b+', 0.00001],
		],
		halfLife: 1.248e9*year,
		abundance: 1.17e-4,
	},
	{
		name: 'K-42',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 12.355*hour,
	},
	{
		name: 'K-41',
		abundance: 0.067302,
	},
	{
		name: 'Ca-40',
		abundance: 0.96941,
	},
	{
		name: 'Ca-41',
		decayTypes: [
			['ec', 1],
		],
		halfLife: 9.94e4*year,
	},
	{
		name: 'Ca-42',
		abundance: 0.00647,
	},
	{
		name: 'Ca-43',
		abundance: 0.00135,
	},
	{
		name: 'Ca-44',
		abundance: 0.02086,
	},
	{
		name: 'Ca-46',
		abundance: 4e-5,
	},
	{
		name: 'Ca-48',
		decayTypes: [
			['b-b-', 1],
		],
		halfLife: 6.4e19*year,
	},
	{
		name: 'Sc-44',
		decayTypes: [
			['b+', 1],
		],
		halfLife: 3.97*hour,
	},
	{
		name: 'Sc-45',
		abundance: 1,
	},
	{
		name: 'Ti-44',
		decayTypes: [
			['ec', 1],
		],
		halfLife: 60*year,
	},
	{
		name: 'Ti-46',
		abundance: 0.0825,
	},
	{
		name: 'Ti-47',
		abundance: 0.0744,
	},
	{
		name: 'Ti-48',
		abundance: 0.7372,
	},
	{
		name: 'Ti-49',
		abundance: 0.0541,
	},
	{
		name: 'Ti-50',
		abundance: 0.0518,
	},
	{
		name: 'V-50',
		decayTypes: [
			['ec', 0.83],
			['b-', 0.17],
		],
		halfLife: 1.4e17*year,
		abundance: 0.0025,
	},
	{
		name: 'V-51',
		abundance: 0.9975,
	},
	{
		name: 'Cr-50',
		abundance: 0.04345,
	},
	{
		name: 'Cr-52',
		abundance: 0.83789,
	},
	{
		name: 'Cr-53',
		abundance: 0.09501,
	},
	{
		name: 'Cr-54',
		abundance: 0.02365,
	},
	{
		name: 'Mn-53',
		decayTypes: [
			['ec', 1],
		],
		halfLife: 3.7e6*year,
	},
	{
		name: 'Mn-55',
		abundance: 1,
	},
	{
		name: 'Fe-54',
		abundance: 0.05845,
	},
	{
		name: 'Fe-55',
		decayTypes: [
			['ec', 1],
		],
		halfLife: 2.737*year,
	},
	{
		name: 'Fe-56',
		abundance: 0.91754,
	},
	{
		name: 'Fe-57',
		abundance: 0.02119,
	},
	{
		name: 'Fe-58',
		abundance: 0.00282,
	},
	{
		name: 'Fe-60',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 2.6e6*year,
	},
	{
		name: 'Co-59',
		abundance: 1,
	},
	{
		name: 'Co-60',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 5.2713*year,
	},
	{
		name: 'Ni-58',
		abundance: 0.680769,
	},
	{
		name: 'Ni-59',
		decayTypes: [
			['ec', 1],
			['b+', 1.5e-7],
		],
		halfLife: 7.6e4*year,
	},
	{
		name: 'Ni-60',
		abundance: 0.262231,
	},
	{
		name: 'Ni-61',
		abundance: 0.011399,
	},
	{
		name: 'Ni-62',
		abundance: 0.036345,
	},
	{
		name: 'Ni-63',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 100.1*year,
	},
	{
		name: 'Ni-64',
		abundance: 0.009256,
	},
	{
		name: 'Cu-63',
		abundance: 0.6915,
	},
	{
		name: 'Cu-65',
		abundance: 0.3085,
	},
	{
		name: 'Zn-64',
		abundance: 0.4917,
	},
	{
		name: 'Zn-66',
		abundance: 0.2773,
	},
	{
		name: 'Zn-67',
		abundance: 0.0404,
	},
	{
		name: 'Zn-68',
		abundance: 0.1845,
	},
	{
		name: 'Zn-70',
		abundance: 0.0061,
	},
	{
		name: 'Ga-69',
		abundance: 0.60108,
	},
	{
		name: 'Ga-71',
		abundance: 0.39892,
	},
	{
		name: 'Ge-70',
		abundance: 0.2038,
	},
	{
		name: 'Ge-72',
		abundance: 0.2731,
	},
	{
		name: 'Ge-73',
		abundance: 0.0776,
	},
	{
		name: 'Ge-74',
		abundance: 0.3672,
	},
	{
		name: 'Ge-76',
		decayTypes: [
			['b-b-', 1],
		],
		halfLife: 1.926e21*year,
		abundance: 0.0783,
	},
	{
		name: 'As-75',
		abundance: 1,
	},
	{
		name: 'Se-74',
		abundance: 0.0089,
	},
	{
		name: 'Se-76',
		abundance: 0.0937,
	},
	{
		name: 'Se-77',
		abundance: 0.0763,
	},
	{
		name: 'Se-78',
		abundance: 0.2377,
	},
	{
		name: 'Se-79',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 3.27e5*year,
	},
	{
		name: 'Se-80',
		abundance: 0.4961,
	},
	{
		name: 'Se-82',
		decayTypes: [
			['b-b-', 1],
		],
		halfLife: 0.97e20*year,
		abundance: 0.0873,
	},
	{
		name: 'Br-79',
		abundance: 0.5069,
	},
	{
		name: 'Br-81',
		abundance: 0.4931,
	},
	{
		name: 'Kr-78',
		decayTypes: [
			['ecec', 1],
		],
		halfLife: 9.2e21*year,
		abundance: 0.00355,
	},
	{
		name: 'Kr-80',
		abundance: 0.02286,
	},
	{
		name: 'Kr-81',
		decayTypes: [
			['ec', 1],
		],
		halfLife: 2.29e5*year,
	},
	{
		name: 'Kr-82',
		abundance: 0.11593,
	},
	{
		name: 'Kr-83',
		abundance: 0.115,
	},
	{
		name: 'Kr-84',
		abundance: 0.56987,
	},
	{
		name: 'Kr-85',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 10.776*year,
	},
	{
		name: 'Kr-86',
		abundance: 0.17279,
	},
	{
		name: 'Rb-85',
		abundance: 0.7217,
	},
	{
		name: 'Rb-87',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 4.923e10*year,
		abundance: 0.2783,
	},
	{
		name: 'Sr-84',
		abundance: 0.0056,
	},
	{
		name: 'Sr-86',
		abundance: 0.0986,
	},
	{
		name: 'Sr-87',
		abundance: 0.07,
	},
	{
		name: 'Sr-88',
		abundance: 0.8258,
	},
	{
		name: 'Sr-90',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 28.9*year,
	},
	{
		name: 'Y-89',
		abundance: 1,
	},
	{
		name: 'Zr-90',
		abundance: 0.5145,
	},
	{
		name: 'Zr-91',
		abundance: 0.1122,
	},
	{
		name: 'Zr-92',
		abundance: 0.1715,
	},
	{
		name: 'Zr-93',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 1.53e6*year,
	},
	{
		name: 'Zr-94',
		abundance: 0.1738,
	},
	{
		name: 'Zr-96',
		decayTypes: [
			['b-b-', 1],
		],
		halfLife: 20e18*year,
		abundance: 0.028,
	},
	{
		name: 'Nb-91',
		decayTypes: [
			['ec', 0.9998],
			['b+', 0.00013],
		],
		halfLife: 680*year,
	},
	{
		name: 'Nb-92',
		decayTypes: [
			['b+', 0.9995],
			['b-', 0.0005],
		],
		halfLife: 3.47e7*year,
	},
	{
		name: 'Nb-93',
		abundance: 1,
	},
	{
		name: 'Nb-94',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 2.03e4*year,
	},
	{
		name: 'Mo-92',
		abundance: 0.14649,
	},
	{
		name: 'Mo-93',
		decayTypes: [
			['ec', 1],
		],
		halfLife: 4e3*year,
	},
	{
		name: 'Mo-94',
		abundance: 0.09187,
	},
	{
		name: 'Mo-95',
		abundance: 0.15873,
	},
	{
		name: 'Mo-96',
		abundance: 0.16673,
	},
	{
		name: 'Mo-97',
		abundance: 0.09582,
	},
	{
		name: 'Mo-98',
		abundance: 0.24292,
	},
	{
		name: 'Mo-100',
		decayTypes: [
			['b-b-', 1],
		],
		halfLife: 8.5e18*year,
		abundance: 0.09744,
	},
	{
		name: 'Tc-97',
		decayTypes: [
			['ec', 1],
		],
		halfLife: 4.21e6*year,
	},
	{
		name: 'Tc-98',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 4.2e6*year,
	},
	{
		name: 'Tc-99',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 2.111e5*year,
	},
	// skip a few...
	{
		name: 'Cs-133',
		abundance: 1,
	},
	{
		name: 'Cs-134',
		decayTypes: [
			['b-', 1],
			['ec', 3e-6],
		],
		halfLife: 2.0652*year,
	},
	{
		name: 'Cs-135',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 2.3e6*year,
	},
	{
		name: 'Cs-137',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 30.1671*year,
	},
	{
		name: 'Ba-130',
		decayTypes: [
			['ecec', 1],
		],
		halfLife: 1.6e21*year,
		abundance: 0.00106,
	},
	{
		name: 'Ba-132',
		abundance: 0.00101,
	},
	{
		name: 'Ba-133',
		decayTypes: [
			['ec', 1],
		],
		halfLife: 10.51*year,
	},
	{
		name: 'Ba-134',
		abundance: 0.02417,
	},
	{
		name: 'Ba-135',
		abundance: 0.06592,
	},
	{
		name: 'Ba-136',
		abundance: 0.07854,
	},
	{
		name: 'Ba-137',
		abundance: 0.11232,
	},
	{
		name: 'Ba-138',
		abundance: 0.71698,
	},
	{
		name: 'La-138',
		decayTypes: [
			['b+', 0.664],
			['b-', 0.336],
		],
		halfLife: 1.02e11*year,
		abundance: 9e-4,
	},
	{
		name: 'La-139',
		abundance: 0.9991,
	},
	{
		name: 'Ce-136',
		abundance: 0.00185,
	},
	{
		name: 'Ce-138',
		abundance: 0.00251,
	},
	{
		name: 'Ce-140',
		abundance: 0.8845,
	},
	{
		name: 'Ce-142',
		abundance: 0.11114,
	},
	{
		name: 'Pr-141',
		abundance: 1,
	},
	{
		name: 'Nd-142',
		abundance: 0.272,
	},
	{
		name: 'Nd-143',
		abundance: 0.122,
	},
	{
		name: 'Nd-144',
		decayTypes: [
			['a', 1],
		],
		halfLife: 2.29e15*year,
		abundance: 0.238,
	},
	{
		name: 'Nd-145',
		abundance: 0.083,
	},
	{
		name: 'Nd-146',
		abundance: 0.172,
	},
	{
		name: 'Nd-148',
		abundance: 0.057,
	},
	{
		name: 'Nd-150',
		decayTypes: [
			['b-b-', 1],
		],
		halfLife: 6.7e18*year,
		abundance: 0.056,
	},
	{
		name: 'Pm-145',
		decayTypes: [
			['ec', 1],
			['a', 2.8e-9],
		],
		halfLife: 17.7*year,
	},
	{
		name: 'Pm-146',
		decayTypes: [
			['ec', 0.66],
			['b-', 0.34],
		],
		halfLife: 5.53*year,
	},
	{
		name: 'Pm-147',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 2.6234*year,
	},
	{
		name: 'Sm-144',
		abundance: 0.0307,
	},
	{
		name: 'Sm-146',
		decayTypes: [
			['a', 1],
		],
		halfLife: 6.7e7*year,
	},
	{
		name: 'Sm-147',
		decayTypes: [
			['a', 1],
		],
		halfLife: 1.06e11*year,
		abundance: 0.1499,
	},
	{
		name: 'Sm-148',
		decayTypes: [
			['a', 1],
		],
		halfLife: 7e15*year,
		abundance: 0.1124,
	},
	{
		name: 'Sm-149',
		abundance: 0.1382,
	},
	{
		name: 'Sm-150',
		abundance: 0.0738,
	},
	{
		name: 'Sm-151',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 88.8*year,
	},
	{
		name: 'Sm-152',
		abundance: 0.2675,
	},
	{
		name: 'Sm-154',
		abundance: 0.2275,
	},
	{
		name: 'Eu-150',
		decayTypes: [
			['b+', 1],
		],
		halfLife: 36.9*year,
	},
	{
		name: 'Eu-151',
		decayTypes: [
			['a', 1],
		],
		halfLife: 4.62e18*year,
		abundance: 0.4781,
	},
	{
		name: 'Eu-152',
		decayTypes: [
			['ec', 0.7209],
			['b-', 0.279],
			['b+', 0.00027],
		],
		halfLife: 13.537*year,
	},
	{
		name: 'Eu-153',
		abundance: 0.5219,
	},
	{
		name: 'Eu-154',
		decayTypes: [
			['b-', 0.9998],
			['ec', 0.0002],
		],
		halfLife: 8.593*year,
	},
	{
		name: 'Eu-155',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 4.7611*year,
	},
	{
		name: 'Gd-148',
		decayTypes: [
			['a', 1],
		],
		halfLife: 74.6*year,
	},
	{
		name: 'Gd-150',
		decayTypes: [
			['a', 1],
		],
		halfLife: 1.79e6*year,
	},
	{
		name: 'Gd-152',
		decayTypes: [
			['a', 1],
		],
		halfLife: 1.08e14*year,
		abundance: 0.002,
	},
	{
		name: 'Gd-154',
		abundance: 0.0218,
	},
	{
		name: 'Gd-155',
		abundance: 0.148,
	},
	{
		name: 'Gd-156',
		abundance: 0.2047,
	},
	{
		name: 'Gd-157',
		abundance: 0.1565,
	},
	{
		name: 'Gd-158',
		abundance: 0.2484,
	},
	{
		name: 'Gd-160',
		abundance: 0.2186,
	},
	{
		name: 'Tb-158',
		decayTypes: [
			['b+', 0.834],
			['b-', 0.166],
		],
		halfLife: 180*year,
	},
	{
		name: 'Tb-159',
		abundance: 1,
	},
	{
		name: 'Dy-154',
		decayTypes: [
			['a', 1],
		],
		halfLife: 3e6*year,
	},
	{
		name: 'Dy-156',
		abundance: 5.6e-4,
	},
	{
		name: 'Dy-158',
		abundance: 9.5e-4,
	},
	{
		name: 'Dy-160',
		abundance: 0.02329,
	},
	{
		name: 'Dy-161',
		abundance: 0.18889,
	},
	{
		name: 'Dy-162',
		abundance: 0.25475,
	},
	{
		name: 'Dy-163',
		abundance: 0.24896,
	},
	{
		name: 'Dy-164',
		abundance: 0.2826,
	},
	{
		name: 'Ho-163',
		decayTypes: [
			['ec', 1],
		],
		halfLife: 4570*year,
	},
	{
		name: 'Ho-165',
		abundance: 1,
	},
	{
		name: 'Er-162',
		abundance: 0.00139,
	},
	{
		name: 'Er-164',
		abundance: 0.01601,
	},
	{
		name: 'Er-166',
		abundance: 0.33503,
	},
	{
		name: 'Er-167',
		abundance: 0.22869,
	},
	{
		name: 'Er-168',
		abundance: 0.26978,
	},
	{
		name: 'Er-170',
		abundance: 0.1491,
	},
	{
		name: 'Tm-169',
		abundance: 1,
	},
	{
		name: 'Tm-171',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 1.92*year,
	},
	{
		name: 'Yb-168',
		abundance: 0.0013,
	},
	{
		name: 'Yb-170',
		abundance: 0.0304,
	},
	{
		name: 'Yb-171',
		abundance: 0.1428,
	},
	{
		name: 'Yb-172',
		abundance: 0.2183,
	},
	{
		name: 'Yb-173',
		abundance: 0.1613,
	},
	{
		name: 'Yb-174',
		abundance: 0.3183,
	},
	{
		name: 'Lu-175',
		abundance: 0.9741,
	},
	{
		name: 'Lu-176',
		abundance: 0.1276,
	},
	{
		name: 'Lu-176',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 38.5e9*year,
		abundance: 0.0259,
	},
	{
		name: 'Hf-174',
		decayTypes: [
			['a', 1],
		],
		halfLife: 2e15*year,
		abundance: 0.0016,
	},
	{
		name: 'Hf-176',
		abundance: 0.0526,
	},
	{
		name: 'Hf-177',
		abundance: 0.186,
	},
	{
		name: 'Hf-178',
		abundance: 0.2728,
	},
	{
		name: 'Hf-179',
		abundance: 0.1362,
	},
	{
		name: 'Hf-180',
		abundance: 0.3508,
	},
	{
		name: 'Hf-182',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 8.9e6*year,
	},
	{
		name: 'Ta-179',
		decayTypes: [
			['ec', 1],
		],
		halfLife: 1.82*year,
	},
	{
		name: 'Ta-181',
		abundance: 0.99988,
	},
	{
		name: 'Ta-182',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 114.43*day,
	},
	{
		name: 'W-180',
		decayTypes: [
			['a', 1],
		],
		halfLife: 1.8e18*year,
		abundance: 0.0012,
	},
	{
		name: 'W-182',
		abundance: 0.265,
	},
	{
		name: 'W-183',
		abundance: 0.1431,
	},
	{
		name: 'W-184',
		abundance: 0.3064,
	},
	{
		name: 'W-186',
		abundance: 0.2843,
	},
	{
		name: 'Rh-185',
		abundance: 0.374,
	},
	{
		name: 'Rh-187',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 41.2e9*year,
		abundance: 0.626,
	},
	{
		name: 'Os-184',
		abundance: 2e-4,
	},
	{
		name: 'Os-186',
		decayTypes: [
			['a', 1],
		],
		halfLife: 2e15*year,
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
		name: 'Os-194',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 6*year,
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
		name: 'Ir-194',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 19.28*hour,
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
		name: 'Hg-206',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 8.15*minute,
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
		name: 'Tl-206',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 4.2*minute,
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
			['a', 1.9e-8],
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
			['a', 1.32e-6],
		],
		halfLife: 5.012*day,
	},
	{
		name: 'Bi-211',
		decayTypes: [
			['a', 0.9972],
			['b-', 0.00276],
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
			['b-', 0.9997],
			['a', 0.00021],
		],
		halfLife: 19.9*minute,
	},
	{
		name: 'Bi-215',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 7.6*minute,
	},
	{
		name: 'Po-208',
		decayTypes: [
			['a', 0.9999],
			['b+', 0.0000277],
		],
		halfLife: 2.898*year,
	},
	{
		name: 'Po-209',
		decayTypes: [
			['a', 0.9952],
			['b+', 0.0048],
		],
		halfLife: 125.2*year,
	},
	{
		name: 'Po-210',
		decayTypes: [
			['a', 1],
		],
		halfLife: 138.376*day,
	},
	{
		name: 'Po-211',
		decayTypes: [
			['a', 1],
		],
		halfLife: 0.516,
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
		name: 'Po-214',
		decayTypes: [
			['a', 1],
		],
		halfLife: 164.3e-6,
	},
	{
		name: 'Po-215',
		decayTypes: [
			['a', 0.9999],
			['b-', 2.3e-6],
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
			['b-', 0.0002],
		],
		halfLife: 3.1*minute,
	},
	{
		name: 'At-215',
		decayTypes: [
			['a', 1],
		],
		halfLife: 0.1e-3,
	},
	{
		name: 'At-217',
		decayTypes: [
			['a', 0.9998],
			['b-', 0.00012],
		],
		halfLife: 32.3e-3,
	},
	{
		name: 'At-218',
		decayTypes: [
			['a', 0.999],
			['b-', 0.001],
		],
		halfLife: 1.5,
	},
	{
		name: 'At-219',
		decayTypes: [
			['a', 0.97],
			['b-', 0.03],
		],
		halfLife: 56,
	},
	{
		name: 'Rn-217',
		decayTypes: [
			['a', 1],
		],
		halfLife: 0.54e-3,
	},
	{
		name: 'Rn-218',
		decayTypes: [
			['a', 1],
		],
		halfLife: 35e-3,
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
			['b-', 0.001],
		],
		halfLife: 4.9*minute,
	},
	{
		name: 'Fr-223',
		decayTypes: [
			['b-', 0.9999],
			['a', 0.00006],
		],
		halfLife: 22*minute,
	},
	{
		name: 'Fr-224',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 3.33*minute,
	},
	{
		name: 'Ra-221',
		decayTypes: [
			['a', 1],
		],
		halfLife: 28,
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
		name: 'Ra-227',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 42.2*minute,
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
			['a', 5.5e-8],
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
			['sf', 5e-13],
		],
		halfLife: 7.538e4*year,
	},
	{
		name: 'Th-231',
		decayTypes: [
			['b-', 1],
			['a', 1e-10],
		],
		halfLife: 25.5*hour,
	},
	{
		name: 'Th-232',
		decayTypes: [
			['a', 1],
			['sf', 1.1e-11],
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
		name: 'Th-236',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 37.5*minute,
	},
	{
		name: 'Pa-231',
		decayTypes: [
			['a', 1],
			['sf', 3e-12],
		],
		halfLife: 3.276e4*year,
		abundance: 1,
	},
	{
		name: 'Pa-232',
		decayTypes: [
			['b-', 1],
			['ec', 0.00003],
		],
		halfLife: 1.31*day,
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
			['sf', 3e-12],
		],
		halfLife: 6.7*hour,
	},
	{
		name: 'Pa-236',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 9.1*minute,
	},
	{
		name: 'U-232',
		decayTypes: [
			['a', 1],
			['sf', 1e-14],
		],
		halfLife: 68.9*year,
	},
	{
		name: 'U-233',
		decayTypes: [
			['a', 1],
			['sf', 6e-11],
		],
		halfLife: 1.592e5*year,
	},
	{
		name: 'U-234',
		decayTypes: [
			['a', 1],
			['sf', 1.73e-11],
		],
		halfLife: 2.455e5*year,
		abundance: 0.000054,
	},
	{
		name: 'U-235',
		decayTypes: [
			['a', 1],
			['sf', 7e-11],
		],
		halfLife: 7.038e6*year,
		abundance: 0.0072,
	},
	{
		name: 'U-236',
		decayTypes: [
			['a', 1],
			['sf', 9.6e-10],
		],
		halfLife: 2.342e7*year,
	},
	{
		name: 'U-237',
		decayTypes: [
			['b-', 1],
		],
		halfLife: 6.75*day,
	},
	{
		name: 'U-238',
		decayTypes: [
			['a', 1],
			['sf', 5.45e-7],
			['b-b-', 2.19e-12],
		],
		halfLife: 4.468e9*year,
		abundance: 0.992745,
	},
	{
		name: 'U-240',
		decayTypes: [
			['b-', 1],
			['a', 1e-12],
		],
		halfLife: 14.1*hour,
	},
	{
		name: 'Np-236',
		decayTypes: [
			['ec', 0.873],
			['b-', 0.125],
			['a', 0.0016],
		],
		halfLife: 1.54e6*year,
	},
	{
		name: 'Np-237',
		decayTypes: [
			['a', 1],
			['sf', 2e-12],
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
			['sf', 9.6e-10],
		],
		halfLife: 2.858*year,
	},
	{
		name: 'Pu-238',
		decayTypes: [
			['a', 1],
			['sf', 1.9e-9],
		],
		halfLife: 87.7*year,
	},
	{
		name: 'Pu-239',
		decayTypes: [
			['a', 1],
			['sf', 3.1e-12],
		],
		halfLife: 2.411e4*year,
	},
	{
		name: 'Pu-240',
		decayTypes: [
			['a', 1],
			['sf', 5.7e-8],
		],
		halfLife: 6.561e3*year,
	},
	{
		name: 'Pu-241',
		decayTypes: [
			['b-', 1],
			['a', 0.0000245],
			['sf', 2.4e-16],
		],
		halfLife: 14.29*year,
	},
	{
		name: 'Pu-242',
		decayTypes: [
			['a', 1],
			['sf', 5.5e-6],
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
			['sf', 0.00123],
			['b-b-', 7.3e-11],
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
			['sf', 4.3e-12], // also cd
		],
		halfLife: 432.2*year,
	},
	{
		name: 'Am-243',
		decayTypes: [
			['a', 1],
			['sf', 3.7e-11],
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
			['ec', 0.0029],
			['sf', 5.3e-11],
		],
		halfLife: 29.1*year,
	},
	{
		name: 'Cm-244',
		decayTypes: [
			['a', 1],
			['sf', 1.34e-6],
		],
		halfLife: 18.1*year,
	},
	{
		name: 'Cm-245',
		decayTypes: [
			['a', 1],
			['sf', 6.1e-9],
		],
		halfLife: 8500*year,
	},
	{
		name: 'Cm-246',
		decayTypes: [
			['a', 1],
			['sf', 0.000261],
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
			['sf', 0.00077],
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