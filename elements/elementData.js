/* exported elementData, isotopeData, nobleMetalColors, nucleosynthesisColors, nutritionColors,
	minute, hour, day, year */
'use strict';
// modelColor from https://sciencenotes.org/wp-content/uploads/2019/07/CPK-Jmol-1024x791.png
// abundances from https://periodictable.com/Properties/A/UniverseAbundance.an.log.html
// also https://periodictable.com/Properties/A/UniverseAbundance.html
// metal prices from https://www.dailymetalprice.com/ and https://www.metalary.com
// other prices from https://en.wikipedia.org/wiki/Prices_of_chemical_elements
/* sources for technology-critical
	1	https://en.wikipedia.org/wiki/Technology-critical_element#List_of_technology-critical_elements
	2	https://www.sciencedirect.com/science/article/pii/S0921344919305750 p. 2
	either source = 0.5; both sources = 1
*/
/* Nucleosynthesis
	1	https://upload.wikimedia.org/wikipedia/commons/4/44/Kernfusionen1_en.png
	2	https://upload.wikimedia.org/wikipedia/commons/3/31/Nucleosynthesis_periodic_table.svg
	3	https://vimeo.com/74662953
	4	https://web.archive.org/web/20190104023431/http://www.cosmic-origins.org/
			https://web.archive.org/web/20181228175648/http://www.cosmic-origins.org/PAGES/chartnuc.html
*/
const nucleosynthesisColors = {
	artificial: '#fff', // the rest
	decay: '#ccb', // Po-Ac; Pa
	bigBang: '#18d', // H He Li
	ppChain: '#db2', // He
	pProcess: '#282', // Se
	rProcess: '#b7d', // many
	sProcess: '#3d3', // many
	spallation: '#d88', // Li Be B
	tripleAlphaProcess: '#d8d', // C
	cnoCycle: '#3b3', // N, F
	alphaProcess: '#a1b', // even-Z from O to Ni
	rpProcess: '#edd', // [guess] odd-Z from F to Co and all from Cu to Rb
	carbonBurningProcess: '#cbb', // Na
	oxygenBurningProcess: '#a99', // P
	neonBurningProcess: '#d3b', // Al
};
// https://en.wikipedia.org/wiki/Template:Periodic_table_(noble_metals)
const nobleMetalColors = ['#cf0', '#0e7', '#6bf', '#c9f', '#fb6', '#f66'];
// https://en.wikipedia.org/wiki/Template:Periodic_table_(nutritional_elements)
const nutritionColors = ['#060', '#0b0', '#7f0', '#670', '#f70', '#dd9'];

// also used in isotopeData.js
const minute = 60;
const hour = 60 * minute;
const day = 24 * hour;
const year = 365.2425 * day;
const month = year / 12;
// used for metal prices
const pound = 0.45359237;
const ounce = pound/16;

const elementData = [
	{
		z: 1,
		name: 'Hydrogen',
		symbol: 'H',
		mass: 1.008,
		group: 1,
		period: 1,
		properties: {
			abundance: {
				earth: 6.7e-3,
				human: 0.62,
				universe: 0.739,
			},
			biologicalHalfLife: 12*day, // tritium; http://hyperphysics.phy-astr.gsu.edu/hbase/Nuclear/biohalf.html
			categories: {
				reactiveNonmetal: true,
				rockForming: 0.5,
			},
			crystal: 'hP',
			density: 0.08988,
			discovery: 1500,
			electronegativity: 2.2,
			modelColor: 'white',
			nucleosynthesis: {
				bigBang: 1,
			},
			nutrition: 0,
			oxidation: [-1, 1],
			prices: {
				2012: 1.39,
			},
			production: 50e6,
			temperatures: {
				boil: 20.28,
				melt: 14.01,
				crit: [32.938, 1.2858e6],
				trip: [13.8033, 7.041e3],
			},
		},
	},
	{
		z: 2,
		name: 'Helium',
		symbol: 'He',
		mass: 4.0026,
		group: 18,
		period: 1,
		properties: {
			abundance: {
				earth: 0.008e-6,
				universe: 0.24,
			},
			categories: {
				nobleGas: true,
			},
			crystal: 'hP',
			density: 0.1785,
			discovery: 1895,
			modelColor: 'rgb(217, 255, 255)',
			nucleosynthesis: {
				bigBang: 0.91,
				ppChain: 0.05,
				sProcess: 0.04,
			},
			oxidation: [0],
			prices: {
				2018: 24,
			},
			production: 32e3,
			temperatures: {
				boil: 4.22, // does not solidify at SP
				crit: [5.1953, 0.22746e6],
				trip: [2.177, 5.043e3],
			},
		},
	},
	{
		z: 3,
		name: 'Lithium',
		symbol: 'Li',
		mass: 6.94,
		group: 1,
		period: 2,
		properties: {
			abundance: {
				earth: 4.1e-6,
				human: 1.5e-8,
				universe: 6e-9,
			},
			bulkModulus: 11e9,
			categories: {
				alkaliMetal: true,
				tech: true,
			},
			crystal: 'cI',
			density: 534,
			discovery: 1821,
			electronegativity: 0.98,
			modelColor: 'rgb(204, 128, 255)',
			nucleosynthesis: {
				bigBang: 0.23,
				spallation: 0.13,
				sProcess: 0.64,
			},
			nutrition: 3,
			oxidation: [1],
			prices: {
				2020: 83.5,
				2018: 16.5,
			},
			production: 55e3,
			resistivity: 92.8e-9,
			rgb: 'rgb(249, 255, 252)',
			temperatures: {
				boil: 1560,
				melt: 453.69,
			},
		},
	},
	{
		z: 4,
		name: 'Beryllium',
		symbol: 'Be',
		mass: 9.0121831,
		group: 2,
		period: 2,
		properties: {
			abundance: {
				earth: 140e-9,
				human: 4.5e-10,
				universe: 1e-9,
			},
			bulkModulus: 130e9,
			categories: {
				aem: true,
				preciousMetal: 0.5,
				tech: 0.5,
			},
			crystal: 'hP',
			density: 1850,
			discovery: 1828,
			electronegativity: 1.57,
			modelColor: 'rgb(194, 255, 0)',
			nucleosynthesis: {
				spallation: 1,
			},
			oxidation: [2],
			prices: {
				2020: 857,
			},
			production: 200,
			resistivity: 36e-9,
			rgb: 'rgb(255, 255, 255)',
			temperatures: {
				boil: 2742,
				melt: 1560,
			},
		},
	},
	{
		z: 5,
		name: 'Boron',
		symbol: 'B',
		mass: 10.81,
		group: 13,
		period: 2,
		properties: {
			abundance: {
				earth: 480e-9,
				human: 3e-8,
				universe: 1e-9,
			},
			bulkModulus: 320e9, // https://periodictable.com/Properties/A/BulkModulus.al.html
			categories: {
				metalloid: true,
				tech: 0.5,
			},
			crystal: 'hR',
			density: 2340,
			discovery: 1808,
			electronegativity: 2.04,
			modelColor: 'rgb(255, 181, 181)',
			nucleosynthesis: {
				spallation: 1,
			},
			nutrition: 3,
			oxidation: [3],
			prices: {
				2019: 3.68,
			},
			production: 1.8e6,
			resistivity: 1e6,
			rgb: 'rgb(255, 232, 219)',
			temperatures: {
				boil: 4200,
				melt: 2349,
			},
			toxicity: 6e-3, // LD50
		},
	},
	{
		z: 6,
		name: 'Carbon',
		symbol: 'C',
		mass: 12.011,
		group: 14,
		period: 2,
		properties: {
			abundance: {
				earth: 1.6e-3,
				human: 0.12,
				universe: 4600e-6,
			},
			biologicalHalfLife: 40*day, // C-14; http://hyperphysics.phy-astr.gsu.edu/hbase/Nuclear/biohalf.html
			bulkModulus: 33e9, // graphite; diamond is 442 https://periodictable.com/Properties/A/BulkModulus.al.html
			categories: {
				coinageMetal: 0.5, // various russian coins
				reactiveNonmetal: true,
				rockForming: 0.5,
			},
			crystal: 'hP',
			density: 2267,
			discovery: -3750,
			electronegativity: 2.55,
			modelColor: 'rgb(144, 144, 144)',
			nucleosynthesis: {
				tripleAlphaProcess: 0.989, // C-12
				alphaProcess: 0.011, // C-13; guess
			},
			nutrition: 0,
			oxidation: [-4, -3, -2, -1, 0, 1, 2, 3, 4],
			prices: {
				2018: 0.122,
			},
			production: 1.03e6,
			resistivity: 7.837e-6,
			rgb: 'rgb(255, 251, 239)',
			temperatures: {
				boil: 3915,
				melt: 3915,
			},
		},
	},
	{
		z: 7,
		name: 'Nitrogen',
		symbol: 'N',
		mass: 14.007,
		group: 15,
		period: 2,
		properties: {
			abundance: {
				earth: 46e-6,
				human: 0.011,
				universe: 960e-6,
			},
			categories: {
				pnictogen: true,
				reactiveNonmetal: true,
			},
			crystal: 'hP',
			density: 1.2506,
			discovery: 1772,
			electronegativity: 3.04,
			modelColor: 'rgb(48, 80, 248)',
			nucleosynthesis: {
				cnoCycle: 1,
			},
			nutrition: 0,
			oxidation: [-3, 3, 5],
			prices: {
				2001: 0.14,
			},
			production: 131e6,
			temperatures: {
				boil: 77.36,
				melt: 63.15,
			},
		},
	},
	{
		z: 8,
		name: 'Oxygen',
		symbol: 'O',
		mass: 15.999,
		group: 16,
		period: 2,
		properties: {
			abundance: {
				earth: 482e-3,
				human: 0.24,
				universe: 10400e-6,
			},
			categories: {
				chalcogen: true,
				reactiveNonmetal: true,
				rockForming: true,
			},
			crystal: 'tP',
			density: 1.429,
			discovery: 1604,
			electronegativity: 3.44,
			modelColor: 'rgb(255, 13, 13)',
			nucleosynthesis: {
				alphaProcess: 0.9996, // O-16, O-18
				cnoCycle: 0.0004, // O-17
			},
			nutrition: 0,
			oxidation: [-2],
			prices: {
				2001: 0.154,
			},
			production: 100e6,
			temperatures: {
				boil: 90.2,
				melt: 54.36,
			},
		},
	},
	{
		z: 9,
		name: 'Fluorine',
		symbol: 'F',
		mass: 18.998403162,
		group: 17,
		period: 2,
		properties: {
			abundance: {
				earth: 14e-6,
				human: 1.2e-5,
				universe: 4e-7,
			},
			biologicalHalfLife: 450*day, // personal estimate; 2.6 g fluorine per person, 4 mg/day per person
			categories: {
				halogen: true,
				reactiveNonmetal: true,
				rockForming: 0.5,
			},
			crystal: 'tP',
			density: 1.696,
			discovery: 1886,
			electronegativity: 3.98,
			modelColor: 'rgb(144, 224, 80)',
			nucleosynthesis: {
				cnoCycle: 1,
			},
			nutrition: 3,
			oxidation: [-1],
			prices: {
				2017: 2,
			},
			production: 5.5e6,
			rgb: 'rgb(255, 207, 112)',
			temperatures: {
				boil: 85.03,
				melt: 53.53,
			},
			toxicity: 25e-6, // significant irritation of the eyes and respiratory system as well as liver and kidney damage occur above 25 ppm, which is the immediately dangerous to life and health value for fluorine
		},
	},
	{
		z: 10,
		name: 'Neon',
		symbol: 'Ne',
		mass: 20.1797,
		group: 18,
		period: 2,
		properties: {
			abundance: {
				earth: 0.0051e-6,
				universe: 1340e-6,
			},
			categories: {
				nobleGas: true,
			},
			crystal: 'cF',
			density: 0.8999,
			discovery: 1898,
			modelColor: 'rgb(179, 227, 245)',
			nucleosynthesis: {
				carbonBurningProcess: 0.9075, // Ne-20, Ne-21
				alphaProcess: 0.0925, // Ne-22
			},
			oxidation: [0],
			prices: {
				1999: 240,
			},
			production: 500,
			temperatures: {
				boil: 27.07,
				melt: 24.56,
			},
		},
	},
	{
		z: 11,
		name: 'Sodium',
		symbol: 'Na',
		mass: 22.98976928,
		group: 1,
		period: 3,
		properties: {
			abundance: {
				earth: 2e-3,
				human: 3.7e-4,
				universe: 33e-6,
			},
			biologicalHalfLife: 69*day, // personal estimate; 100 g sodium per person, 1 mg/day per person
			bulkModulus: 6.3e9,
			// 11 d according to http://hyperphysics.phy-astr.gsu.edu/hbase/Nuclear/biohalf.html
			categories: {
				alkaliMetal: true,
				rockForming: true,
			},
			crystal: 'cI',
			density: 971,
			discovery: 1807,
			electronegativity: 0.93,
			modelColor: 'rgb(171, 92, 242)',
			nucleosynthesis: {
				carbonBurningProcess: 1, // guess
			},
			nutrition: 1,
			oxidation: [1],
			prices: {
				2020: 3,
			},
			production: 100e3,
			resistivity: 47.7e-9,
			rgb: 'rgb(252, 255, 249)',
			temperatures: {
				boil: 1156,
				melt: 370.87,
			},
		},
	},
	{
		z: 12,
		name: 'Magnesium',
		symbol: 'Mg',
		mass: 24.305,
		group: 2,
		period: 3,
		properties: {
			abundance: {
				earth: 164e-3,
				human: 7e-5,
				universe: 580e-6,
			},
			biologicalHalfLife: 44*day, // personal estimate; 19 g magnesium per person, 300 mg/day per person
			bulkModulus: 35.4e9,
			categories: {
				aem: true,
				rockForming: true,
				tech: 0.5,
			},
			crystal: 'hP',
			density: 1738,
			discovery: 1808,
			electronegativity: 1.31,
			modelColor: 'rgb(138, 255, 0)',
			nucleosynthesis: {
				alphaProcess: 0.79, // Mg-24
				neonBurningProcess: 0.21, // Mg-25, Mg-26
			},
			nutrition: 1,
			oxidation: [2],
			prices: {
				2019: 2.32,
			},
			production: 748e3,
			resistivity: 43.9e-9,
			rgb: 'rgb(255, 251, 234)',
			temperatures: {
				boil: 1363,
				melt: 923,
			},
		},
	},
	{
		z: 13,
		name: 'Aluminum',
		symbol: 'Al',
		mass: 26.9815384,
		group: 13,
		period: 3,
		properties: {
			abundance: {
				earth: 15.3e-3,
				human: 1.5e-7,
				universe: 58e-6,
			},
			bulkModulus: 76e9,
			categories: {
				coinageMetal: 0.5, // 1 yen coin
				nativeMetal: 0.5,
				rockForming: true,
			},
			crystal: 'cF',
			density: 2698,
			discovery: 1825,
			electronegativity: 1.61,
			modelColor: 'rgb(191, 166, 166)',
			nucleosynthesis: {
				neonBurningProcess: 1,
			},
			nutrition: 4,
			oxidation: [3],
			prices: {
				2021: 0.975/pound,
				2019: 1.79,
			},
			production: 44.1e6,
			resistivity: 26.5e-9,
			rgb: 'rgb(244, 251, 255)',
			temperatures: {
				boil: 2792,
				melt: 933.47,
			},
		},
	},
	{
		z: 14,
		name: 'Silicon',
		symbol: 'Si',
		mass: 28.085,
		group: 14,
		period: 3,
		properties: {
			abundance: {
				earth: 150e-3,
				human: 5.8e-5,
				universe: 650e-6,
			},
			bulkModulus: 97.6e9,
			categories: {
				metalloid: true,
				rockForming: true,
				tech: 0.5,
			},
			crystal: 'cF',
			density: 2329.6,
			discovery: 1823,
			electronegativity: 1.9,
			modelColor: 'rgb(240, 200, 160)',
			nucleosynthesis: {
				oxygenBurningProcess: 0.92,
				neonBurningProcess: 0.08,
			},
			nutrition: 3,
			oxidation: [-4, 4],
			prices: {
				2019: 1.7,
			},
			production: 8e6,
			resistivity: 2.3e3,
			rgb: 'rgb(234, 241, 255)',
			temperatures: {
				boil: 3538,
				melt: 1687,
			},
		},
	},
	{
		z: 15,
		name: 'Phosphorus',
		symbol: 'P',
		mass: 30.973761998,
		group: 15,
		period: 3,
		properties: {
			abundance: {
				earth: 1.02e-3,
				human: 0.0022,
				universe: 7e-6,
			},
			biologicalHalfLife: 932*day, // personal estimate; 780 g phosphorus per person, 580 mg/day per person
			bulkModulus: 5e9, // white
			categories: {
				pnictogen: true,
				reactiveNonmetal: true,
				rockForming: 0.5,
			},
			crystal: 'cI',
			// 1155 d according to http://hyperphysics.phy-astr.gsu.edu/hbase/Nuclear/biohalf.html
			density: 1820,
			discovery: 1669,
			electronegativity: 2.19,
			modelColor: 'rgb(255, 128, 0)',
			nucleosynthesis: {
				neonBurningProcess: 1,
			},
			nutrition: 1,
			oxidation: [-3, 3, 5],
			prices: {
				2019: 2.69,
			},
			production: 910e3,
			resistivity: 1e-7, // https://periodictable.com/Elements/015/data.html
			rgb: 'rgb(255, 235, 186)',
			temperatures: {
				boil: 550,
				melt: 317.3,
			},
		},
	},
	{
		z: 16,
		name: 'Sulfur',
		symbol: 'S',
		mass: 32.06,
		group: 16,
		period: 3,
		properties: {
			abundance: {
				earth: 5.15e-3,
				human: 3.8e-4,
				universe: 440e-6,
			},
			biologicalHalfLife: 90*day, // S-35; http://hyperphysics.phy-astr.gsu.edu/hbase/Nuclear/biohalf.html
			bulkModulus: 7.7e9,
			categories: {
				chalcogen: true,
				reactiveNonmetal: true,
				rockForming: 0.5,
			},
			crystal: 'oP',
			density: 2067,
			discovery: -2000,
			electronegativity: 2.58,
			modelColor: 'rgb(255, 255, 48)',
			nucleosynthesis: { // best guess
				oxygenBurningProcess: 0.9924,
				alphaProcess: 0.0034,
			},
			nutrition: 1,
			oxidation: [-2, 2, 4, 6],
			prices: {
				2019: 0.0926,
			},
			production: 69e6,
			resistivity: 1e15,
			rgb: 'rgb(255, 218, 86)',
			temperatures: {
				boil: 717.87,
				melt: 388.36,
			},
		},
	},
	{
		z: 17,
		name: 'Chlorine',
		symbol: 'Cl',
		mass: 35.45,
		group: 17,
		period: 3,
		properties: {
			abundance: {
				earth: 56e-6,
				human: 2.4e-4,
				universe: 1e-6,
			},
			biologicalHalfLife: 29*day, // Cl-36; http://hyperphysics.phy-astr.gsu.edu/hbase/Nuclear/biohalf.html
			categories: {
				halogen: true,
				reactiveNonmetal: true,
				rockForming: 0.5,
			},
			crystal: 'oP',
			density: 3.214,
			discovery: 1774,
			electronegativity: 3.16,
			modelColor: 'rgb(31, 240, 31)',
			nucleosynthesis: {
				rpProcess: 1, // "explosive nucleosynthesis"
			},
			nutrition: 1,
			oxidation: [-1, 1, 3, 5, 7],
			prices: {
				2013: 0.082,
			},
			rgb: 'rgb(246, 255, 188)',
			temperatures: {
				boil: 239.11,
				melt: 171.6,
			},
		},
	},
	{
		z: 18,
		name: 'Argon',
		symbol: 'Ar',
		mass: 39.95,
		group: 18,
		period: 3,
		properties: {
			abundance: {
				earth: 3.5e-6,
				universe: 77e-6,
			},
			categories: {
				nobleGas: true,
			},
			crystal: 'cF',
			density: 1.7837,
			discovery: 1894,
			modelColor: 'rgb(128, 209, 227)',
			nucleosynthesis: {
				oxygenBurningProcess: 0.00063, // Ar-36
				alphaProcess: 0.00334, // Ar-38
				sProcess: 0.99604, // Ar-40
			},
			oxidation: [0],
			prices: {
				2019: 0.931,
			},
			production: 700e3,
			temperatures: {
				boil: 87.3,
				melt: 83.8,
			},
		},
	},
	{
		z: 19,
		name: 'Potassium',
		symbol: 'K',
		mass: 39.0983,
		group: 1,
		period: 4,
		properties: {
			abundance: {
				earth: 110e-6,
				human: 3.3e-4,
				universe: 3e-6,
			},
			biologicalHalfLife: 20*day, // personal estimate; 140 g potassium per person, 4.7 mg/day per person
			bulkModulus: 3.1e9,
			categories: {
				alkaliMetal: true,
				rockForming: true,
			},
			crystal: 'cI',
			density: 862,
			discovery: 1807,
			electronegativity: 0.82,
			modelColor: 'rgb(143, 64, 212)',
			nucleosynthesis: {
				rpProcess: 1, // guess; K-39, K-41
				sProcess: 0.00012, // K-40
			},
			nutrition: 1,
			oxidation: [1],
			prices: {
				2020: 12.85,
			},
			resistivity: 72e-9,
			temperatures: {
				boil: 1032,
				melt: 336.53,
			},
		},
	},
	{
		z: 20,
		name: 'Calcium',
		symbol: 'Ca',
		mass: 40.078,
		group: 2,
		period: 4,
		properties: {
			abundance: {
				earth: 11.1e-3,
				human: 0.0022,
				universe: 60e-6,
			},
			biologicalHalfLife: 693*day, // personal estimate; 1kg calcium per person, 1 g/day per person
			bulkModulus: 17e9,
			categories: {
				aem: true,
				rockForming: true,
			},
			crystal: 'cF',
			density: 1540,
			discovery: 1808,
			electronegativity: 1,
			modelColor: 'rgb(61, 255, 0)',
			nucleosynthesis: {
				alphaProcess: 1,
			},
			nutrition: 1,
			oxidation: [2],
			prices: {
				2020: 2.28,
			},
			resistivity: 33.6e-9,
			temperatures: {
				boil: 1757,
				melt: 1115,
			},
		},
	},
	{
		z: 21,
		name: 'Scandium',
		symbol: 'Sc',
		mass: 44.955907,
		group: 3,
		period: 4,
		properties: {
			abundance: {
				earth: 6.3e-6,
				human: 4e-10,
				universe: 3e-8,
			},
			bulkModulus: 56.6e9,
			categories: {
				rem: true,
				tech: true,
			},
			crystal: 'hP',
			density: 2989,
			discovery: 1879,
			electronegativity: 1.36,
			modelColor: 'rgb(230, 230, 230)',
			nucleosynthesis: {
				rpProcess: 1, // guess
			},
			oxidation: [3],
			prices: {
				2020: 3460,
			},
			production: 2,
			resistivity: 562e-9,
			temperatures: {
				boil: 3109,
				melt: 1814,
			},
			toxicity: 4e-3, // LD50, oral, rat
		},
	},
	{
		z: 22,
		name: 'Titanium',
		symbol: 'Ti',
		mass: 47.867,
		group: 4,
		period: 4,
		properties: {
			abundance: {
				earth: 440e-6,
				human: 4e-8,
				universe: 3e-6,
			},
			bulkModulus: 110e9,
			categories: {
				nativeMetal: 0.5,
				refractoryMetal: 0.5,
				rockForming: 0.5,
				tech: 0.5,
			},
			crystal: 'hP',
			density: 4540,
			discovery: 1825,
			electronegativity: 1.54,
			modelColor: 'rgb(191, 194, 199)',
			nobleMetal: 0,
			nucleosynthesis: {
				alphaProcess: 1,
			},
			oxidation: [2, 3, 4],
			prices: {
				2020: 11.4,
				2018: 4.8,
			},
			production: 6.7e6,
			resistivity: 420e-9,
			temperatures: {
				boil: 3560,
				melt: 1941,
			},
		},
	},
	{
		z: 23,
		name: 'Vanadium',
		symbol: 'V',
		mass: 50.9415,
		group: 5,
		period: 4,
		properties: {
			abundance: {
				earth: 53.6e-6,
				human: 1.2e-10,
				universe: 1e-6,
			},
			bulkModulus: 160e9,
			categories: {
				nativeMetal: 0.5,
				refractoryMetal: 0.5,
				tech: 0.5,
			},
			crystal: 'cI',
			density: 6110,
			discovery: 1867,
			electronegativity: 1.63,
			modelColor: 'rgb(166, 166, 171)',
			nobleMetal: 0,
			nucleosynthesis: {
				rpProcess: 1, // guess
			},
			nutrition: 3,
			oxidation: [2, 3, 4, 5],
			prices: {
				2020: 371,
			},
			production: 73e6, // https://pubs.usgs.gov/periodicals/mcs2020/mcs2020-vanadium.pdf
			resistivity: 197e-9,
			temperatures: {
				boil: 3680,
				melt: 2183,
			},
		},
	},
	{
		z: 24,
		name: 'Chromium',
		symbol: 'Cr',
		mass: 51.9961,
		group: 6,
		period: 4,
		properties: {
			abundance: {
				earth: 2.3e-3,
				human: 1.9e-10,
				universe: 1.5e-5,
			},
			biologicalHalfLife: 320*day, // personal estimate; 14 mg chromium per person, 0.03 mg/day per person
			bulkModulus: 160e9,
			categories: {
				ironGroup: 0.5,
				nativeMetal: 0.5,
				refractoryMetal: 0.5,
				tech: 0.5,
			},
			crystal: 'cI',
			density: 7150,
			discovery: 1797,
			electronegativity: 1.66,
			modelColor: 'rgb(138, 153, 199)',
			nobleMetal: 0,
			nucleosynthesis: {
				alphaProcess: 1,
			},
			nutrition: 2,
			oxidation: [2, 3, 6],
			prices: {
				2019: 9.4,
			},
			production: 4.4e6,
			resistivity: 125e-9,
			temperatures: {
				boil: 2944,
				melt: 2180,
			},
			toxicity: 50e-6, // Chromium(VI) human, min est. LD50
		},
	},
	{
		z: 25,
		name: 'Manganese',
		symbol: 'Mn',
		mass: 54.938043,
		group: 7,
		period: 4,
		properties: {
			abundance: {
				earth: 800e-6,
				human: 1.5e-8,
				universe: 8e-6,
			},
			biologicalHalfLife: 3.8*day, // personal estimate; 12 mg manganese per person, 2 mg/day per person
			bulkModulus: 120e9,
			categories: {
				coinageMetal: 0.5, // $1 coin
				ironGroup: 0.5,
				nativeMetal: 0.5,
				refractoryMetal: 0.5,
				rockForming: 0.5,
				tech: 0.5,
			},
			crystal: 'cI',
			density: 7440,
			discovery: 1774,
			electronegativity: 1.55,
			modelColor: 'rgb(156, 122, 199)',
			nucleosynthesis: {
				rpProcess: 1, // guess
			},
			nutrition: 2,
			oxidation: [2, 3, 4, 6, 7],
			prices: {
				2019: 1.82,
				2018: 2.06,
			},
			production: 19e6, // https://pubs.usgs.gov/periodicals/mcs2020/mcs2020-manganese.pdf
			resistivity: 1.44e-6,
			temperatures: {
				boil: 2334,
				melt: 1519,
			},
		},
	},
	{
		z: 26,
		name: 'Iron',
		symbol: 'Fe',
		mass: 55.845,
		group: 8,
		period: 4,
		properties: {
			abundance: {
				earth: 148e-3,
				human: 6.7e-6,
				universe: 1.09e-3,
			},
			biologicalHalfLife: 485*day, // personal estimate; 4.2g iron per person, 6 mg/day per person; 0.5^(1/L) = 1 - 0.006/4.2
			bulkModulus: 170e9,
			categories: {
				coinageMetal: 0.5, // various russian coins
				ironGroup: true,
				nativeMetal: 0.5,
				rockForming: true,
			},
			crystal: 'cI',
			density: 7874,
			discovery: -5000,
			electronegativity: 1.83,
			modelColor: 'rgb(224, 102, 51)',
			nucleosynthesis: {
				alphaProcess: 1,
			},
			nutrition: 2,
			oxidation: [2, 3],
			prices: {
				2021: 164.41/1000,
				2020: 0.424,
			},
			production: 1544e6,
			resistivity: 96.1e-9,
			rgb: 'rgb(255, 252, 252)',
			temperatures: {
				boil: 3134,
				melt: 1811,
			},
			toxicity: 50e-6, // "Ingestions of more than 50 mg/kg of elemental iron are associated with severe toxicity"
		},
	},
	{
		z: 27,
		name: 'Cobalt',
		symbol: 'Co',
		mass: 58.933194,
		group: 9,
		period: 4,
		properties: {
			abundance: {
				earth: 390e-6,
				human: 3e-9,
				universe: 3e-6,
			},
			biologicalHalfLife: 10*day, // Co-60; http://hyperphysics.phy-astr.gsu.edu/hbase/Nuclear/biohalf.html
			bulkModulus: 180e9,
			categories: {
				ironGroup: true,
				nativeMetal: 0.5,
				tech: true,
			},
			crystal: 'hP',
			density: 8860,
			discovery: 1735,
			electronegativity: 1.88,
			modelColor: 'rgb(240, 144, 160)',
			nucleosynthesis: {
				rpProcess: 1, // guess
			},
			nutrition: 2,
			oxidation: [2, 3],
			prices: {
				2021: 25.18/pound,
				2019: 32.8,
			},
			production: 140e3, // https://pubs.usgs.gov/periodicals/mcs2020/mcs2020-cobalt.pdf
			resistivity: 62.4e-9,
			rgb: 'rgb(255, 249, 244)',
			temperatures: {
				boil: 3200,
				melt: 1768,
			},
			toxicity: 325e-6, // The LD50 value for soluble cobalt salts has been estimated to be between 150 and 500 mg/kg
		},
	},
	{
		z: 28,
		name: 'Nickel',
		symbol: 'Ni',
		mass: 58.6934,
		group: 10,
		period: 4,
		properties: {
			abundance: {
				earth: 8.01e-3,
				human: 1.5e-8,
				universe: 49e-6,
			},
			bulkModulus: 180e9,
			categories: {
				coinageMetal: 0.5, // us coins
				ironGroup: true,
				nativeMetal: 0.5,
				tech: 0.5,
			},
			crystal: 'cF',
			density: 8912,
			discovery: 1751,
			electronegativity: 1.91,
			modelColor: 'rgb(80, 208, 80)',
			nucleosynthesis: {
				alphaProcess: 1,
			},
			nutrition: 3,
			oxidation: [2],
			prices: {
				2021: 7.2756/pound,
				2019: 13.9,
			},
			production: 1.8e6,
			resistivity: 69.3e-9,
			rgb: 'rgb(255, 245, 224)',
			temperatures: {
				boil: 3186,
				melt: 1728,
			},
		},
	},
	{
		z: 29,
		name: 'Copper',
		symbol: 'Cu',
		mass: 63.546,
		group: 11,
		period: 4,
		properties: {
			abundance: {
				earth: 25e-6,
				human: 1.04e-7,
				universe: 6e-8,
			},
			biologicalHalfLife: 55*day, // personal estimate; 72 mg copper per person, 0.9 mg/day per person
			bulkModulus: 140e9,
			categories: {
				coinageMetal: true,
				nativeMetal: true,
				nobleMetal: 0.5,
				tech: 0.5,
			},
			crystal: 'cF',
			density: 8960,
			discovery: -9000,
			electronegativity: 1.9,
			modelColor: 'rgb(200, 128, 51)',
			nobleMetal: 2,
			nucleosynthesis: {
				rpProcess: 1, // guess
			},
			nutrition: 2,
			oxidation: [1, 2],
			prices: {
				2021: 4.0547/pound,
				2019: 6,
			},
			production: 15.1e6,
			resistivity: 16.78e-9,
			rgb: 'rgb(255, 121, 76)',
			temperatures: {
				boil: 2835,
				melt: 1357.77,
			},
			toxicity: 30e-6, // Copper sulfate, rat
		},
	},
	{
		z: 30,
		name: 'Zinc',
		symbol: 'Zn',
		mass: 65.38,
		group: 12,
		period: 4,
		properties: {
			abundance: {
				earth: 16e-6,
				human: 3.1e-6,
				universe: 3e-7,
			},
			biologicalHalfLife: 200*day, // personal estimate; 2.3 g zinc per person, 8 mg/day per person
			bulkModulus: 70e9,
			categories: {
				coinageMetal: 0.5, // us coins
				nativeMetal: 0.5,
				tech: 0.5,
			},
			crystal: 'hP',
			density: 7134,
			discovery: -1000,
			electronegativity: 1.65,
			modelColor: 'rgb(125, 128, 176)',
			nucleosynthesis: {
				alphaProcess: 1, // unsure
			},
			nutrition: 2,
			oxidation: [2],
			prices: {
				2021: 1.2474/pound,
				2019: 2.55,
			},
			production: 11.2e6,
			resistivity: 59e-9,
			temperatures: {
				boil: 1180,
				melt: 692.88,
			},
		},
	},
	{
		z: 31,
		name: 'Gallium',
		symbol: 'Ga',
		mass: 69.723,
		group: 13,
		period: 4,
		properties: {
			abundance: {
				earth: 1e-6,
				human: 7e-6,
				universe: 1e-8,
			},
			biologicalHalfLife: 25*hour, // Excretion of gallium occurs in two phases: the first phase has a biological half-life of 1 hour, while the second has a biological half-life of 25 hours.
			bulkModulus: (44e9 + 68e9)/2, // https://www.azom.com/properties.aspx?ArticleID=1132
			categories: {
				preciousMetal: 0.5,
				tech: true,
			},
			crystal: 'oP',
			density: 5907,
			discovery: 1875,
			electronegativity: 1.81,
			modelColor: 'rgb(194, 143, 143)',
			nucleosynthesis: {
				sProcess: 1,
			},
			oxidation: [3],
			prices: {
				2020: 148,
			},
			production: 184,
			resistivity: 270e-9,
			temperatures: {
				boil: 2673,
				melt: 692.88,
			},
		},
	},
	{
		z: 32,
		name: 'Germanium',
		symbol: 'Ge',
		mass: 72.630,
		group: 14,
		period: 4,
		properties: {
			abundance: {
				earth: 2.5e-6,
				human: 6e-10,
				universe: 2e-7,
			},
			bulkModulus: 75e9,
			categories: {
				metalloid: true,
				preciousMetal: 0.5,
				tech: true,
			},
			crystal: 'cF',
			density: 5323,
			discovery: 1886,
			electronegativity: 2.01,
			modelColor: 'rgb(102, 143, 143)',
			nucleosynthesis: {
				rpProcess: 0.5203, // guess; Ge-73, Ge-74, Ge-76
				sProcess: 0.4797, // Ge-70, Ge-72
			},
			nutrition: 4,
			oxidation: [-4, 2, 4],
			prices: {
				2020: 962,
			},
			production: 118,
			resistivity: 1,
			temperatures: {
				boil: 3106,
				melt: 1211.4,
			},
		},
	},
	{
		z: 33,
		name: 'Arsenic',
		symbol: 'As',
		mass: 74.921595,
		group: 15,
		period: 4,
		properties: {
			abundance: {
				earth: 590e-9,
				human: 8.9e-10,
				universe: 8e-9,
			},
			bulkModulus: 22e9,
			categories: {
				metalloid: true,
				nativeMetal: 0.5,
				pnictogen: true,
				tech: 0.5,
			},
			crystal: 'hR',
			density: 5776,
			discovery: 815,
			electronegativity: 2.18,
			modelColor: 'rgb(189, 128, 227)',
			nobleMetal: 3,
			nucleosynthesis: {
				rProcess: 1,
			},
			nutrition: 4,
			oxidation: [-3, 3, 5],
			prices: {
				2020: 1.15,
			},
			resistivity: 333e-9,
			production: 33e3, // https://pubs.usgs.gov/periodicals/mcs2020/mcs2020-arsenic.pdf
			temperatures: {
				boil: 887,
				melt: 887, // sublimates
			},
			toxicity: 763e-6, // rat, oral
		},
	},
	{
		z: 34,
		name: 'Selenium',
		symbol: 'Se',
		mass: 78.971,
		group: 16,
		period: 4,
		properties: {
			abundance: {
				earth: 890e-9,
				human: 4.5e-10,
				universe: 3e-8,
			},
			biologicalHalfLife: 190*day, // personal estimate; 15 mg selenium per person, 0.055 mg/day per person
			bulkModulus: 8.3e9,
			categories: {
				chalcogen: true,
				nativeMetal: 0.5,
				reactiveNonmetal: true,
				tech: 0.5,
			},
			crystal: 'hR',
			density: 4809,
			discovery: 1817,
			electronegativity: 2.55,
			modelColor: 'rgb(255, 161, 0)',
			nobleMetal: 3,
			nucleosynthesis: {
				pProcess: 0.0086, // Se-74
				sProcess: 0.0923, // Se-76
				rProcess: 0.8891, // other
			},
			nutrition: 2,
			oxidation: [-2, 2, 4, 6],
			prices: {
				2019: 21.4,
			},
			production: 2e3,
			resistivity: 106e-6, // https://www.espimetals.com/index.php/component/content/article/422-online-catalog/selenium-se/435-selenium-se?Itemid=135
			temperatures: {
				boil: 958,
				melt: 453,
			},
			toxicity: 3000e-6 / 65e3, // The chronic toxic dose of selenite for humans is about 2400 to 3000 micrograms of selenium per day.
		},
	},
	{
		z: 35,
		name: 'Bromine',
		symbol: 'Br',
		mass: 79.904,
		group: 17,
		period: 4,
		properties: {
			abundance: {
				earth: 97e-9,
				human: 3e-7,
				universe: 7e-9,
			},
			categories: {
				halogen: true,
				reactiveNonmetal: true,
			},
			crystal: 'oP',
			density: 3122,
			discovery: 1825,
			electronegativity: 2.96,
			modelColor: 'rgb(166, 41, 41)',
			nucleosynthesis: {
				rProcess: 1,
			},
			nutrition: 3,
			oxidation: [-1, 1, 3, 5],
			prices: {
				2019: 4.39,
			},
			production: 556e3,
			resistivity: 7.8e10,
			rgb: 'rgb(255, 94, 35)',
			temperatures: {
				boil: 332,
				melt: 265.8,
			},
		},
	},
	{
		z: 36,
		name: 'Krypton',
		symbol: 'Kr',
		mass: 83.798,
		group: 18,
		period: 4,
		properties: {
			abundance: {
				earth: 0.0001e-6,
				universe: 4e-8,
			},
			categories: {
				nobleGas: true,
			},
			crystal: 'cF',
			density: 3.733,
			discovery: 1898,
			electronegativity: 3,
			modelColor: 'rgb(92, 184, 209)',
			nucleosynthesis: {
				pProcess: 0.0036, // Kr-78
				sProcess: 0.3116, // Kr-80, Kr-82, Kr-86
				rProcess: 0.6849, // Kr-83, Kr-84
			},
			oxidation: [0],
			prices: {
				1999: 290,
			},
			temperatures: {
				boil: 119.93,
				melt: 115.79,
			},
		},
	},
	{
		z: 37,
		name: 'Rubidium',
		symbol: 'Rb',
		mass: 85.4678,
		group: 1,
		period: 5,
		properties: {
			abundance: {
				earth: 120e-9,
				human: 3.3e-7,
				universe: 1e-8,
			},
			biologicalHalfLife: 45*day, // Rb-86; http://hyperphysics.phy-astr.gsu.edu/hbase/Nuclear/biohalf.html
			bulkModulus: 2.5e9,
			categories: {
				alkaliMetal: true,
			},
			crystal: 'cI',
			density: 1532,
			discovery: 1861,
			electronegativity: 0.82,
			modelColor: 'rgb(112, 46, 176)',
			nucleosynthesis: {
				rProcess: 0.7217, // Rb-85
				sProcess: 0.2783, // Rb-87
			},
			nutrition: 4,
			oxidation: [1],
			prices: {
				2018: 15500,
			},
			production: 2,
			resistivity: 128e-9,
			temperatures: {
				boil: 961,
				melt: 312.46,
			},
			toxicity: 0.36 / 70e3 * 100, // a 70 kg person contains on average 0.36 g of rubidium, and an increase in this value by 50 to 100 times did not show negative effects in test persons
		},
	},
	{
		z: 38,
		name: 'Strontium',
		symbol: 'Sr',
		mass: 87.62,
		group: 2,
		period: 5,
		properties: {
			abundance: {
				earth: 3.9e-6,
				human: 3.3e-7,
				universe: 4e-8,
			},
			biologicalHalfLife: 1.8e4*day, // Sr-90; http://hyperphysics.phy-astr.gsu.edu/hbase/Nuclear/biohalf.html
			bulkModulus: 12e9, // https://pilgaardelements.com/Strontium/Physicals.htm
			categories: {
				aem: true,
			},
			crystal: 'cF',
			density: 2640,
			discovery: 1808,
			electronegativity: 0.95,
			modelColor: 'rgb(0, 255, 0)',
			nucleosynthesis: {
				pProcess: 0.0056, // Sr-84
				sProcess: 0.9944, // rest
			},
			nutrition: 3,
			oxidation: [2],
			prices: {
				2019: 6.61,
			},
			production: 220e3, // https://pubs.usgs.gov/periodicals/mcs2020/mcs2020-strontium.pdf
			resistivity: 132e-9,
			temperatures: {
				boil: 1655,
				melt: 1050,
			},
		},
	},
	{
		z: 39,
		name: 'Yttrium',
		symbol: 'Y',
		mass: 88.905838,
		group: 3,
		period: 5,
		properties: {
			abundance: {
				earth: 850e-9,
				human: 6e-10,
				universe: 7e-9,
			},
			bulkModulus: 41.2e9,
			categories: {
				rem: true,
				tech: true,
			},
			crystal: 'hP',
			density: 4469,
			discovery: 1843,
			electronegativity: 1.22,
			modelColor: 'rgb(148, 255, 255)',
			nucleosynthesis: {
				sProcess: 1,
			},
			oxidation: [3],
			prices: {
				2019: 31,
			},
			production: 200,
			resistivity: 596e-9,
			temperatures: {
				boil: 3609,
				melt: 1799,
			},
		},
	},
	{
		z: 40,
		name: 'Zirconium',
		symbol: 'Zr',
		mass: 91.224,
		group: 4,
		period: 5,
		properties: {
			abundance: {
				earth: 2e-6,
				human: 3e-9,
				universe: 5e-8,
			},
			bulkModulus: 91.1e9,
			categories: {
				refractoryMetal: 0.5,
				tech: 0.5,
			},
			crystal: 'hP',
			density: 6506,
			discovery: 1824,
			electronegativity: 1.33,
			modelColor: 'rgb(148, 224, 224)',
			nobleMetal: 0,
			nucleosynthesis: {
				sProcess: 0.972, // rest
				rProcess: 0.028, // Zr-96
			},
			oxidation: [4],
			prices: {
				2020: 36.4,
			},
			production: 900e3,
			resistivity: 421e-9,
			temperatures: {
				boil: 4682,
				melt: 2128,
			},
		},
	},
	{
		z: 41,
		name: 'Niobium',
		symbol: 'Nb',
		mass: 92.90637,
		group: 5,
		period: 5,
		properties: {
			abundance: {
				earth: 120e-9,
				human: 1e-10,
				universe: 2e-9,
			},
			bulkModulus: 170e9,
			categories: {
				nativeMetal: 0.5,
				refractoryMetal: true,
				tech: true,
			},
			crystal: 'cI',
			density: 8570,
			discovery: 1864,
			electronegativity: 1.6,
			modelColor: 'rgb(115, 194, 201)',
			nobleMetal: 0,
			nucleosynthesis: {
				sProcess: 0.87,
				rProcess: 0.13,
			},
			oxidation: [5],
			prices: {
				2018: 42.28,
				2020: 73.5,
			},
			production: 44.5e3,
			resistivity: 152e-9,
			temperatures: {
				boil: 5017,
				melt: 2750,
			},
			toxicity: 940e-6, // LD50, oral, rat
		},
	},
	{
		z: 42,
		name: 'Molybdenum',
		symbol: 'Mo',
		mass: 95.95,
		group: 6,
		period: 5,
		properties: {
			abundance: {
				earth: 460e-9,
				human: 4.5e-10,
				universe: 5e-9,
			},
			biologicalHalfLife: 77*day, // personal estimate; 5 mg molybdenum per person, 0.045 mg/day per person
			bulkModulus: 230e9,
			categories: {
				nativeMetal: 0.5,
				refractoryMetal: true,
				tech: 0.5,
			},
			crystal: 'cI',
			density: 10220,
			discovery: 1781,
			electronegativity: 2.16,
			modelColor: 'rgb(84, 181, 181)',
			nobleMetal: 0,
			nucleosynthesis: {
				sProcess: 0.63,
				rProcess: 0.37,
			},
			nutrition: 2,
			oxidation: [4, 6],
			prices: {
				2021: 12.28/pound,
				2019: 40.1,
			},
			production: 250e3,
			resistivity: 53.4e-9,
			temperatures: {
				boil: 4912,
				melt: 2896,
			},
		},
	},
	{
		z: 43,
		name: 'Technetium',
		symbol: 'Tc',
		mass: 97,
		group: 7,
		period: 5,
		properties: {
			abundance: {
				earth: 0.003e-12, // https://en.wikipedia.org/wiki/Technetium#Occurrence_and_production
			},
			biologicalHalfLife: day, // Tc-99m; http://hyperphysics.phy-astr.gsu.edu/hbase/Nuclear/biohalf.html
			bulkModulus: 281e9, // https://pilgaardelements.com/Technetium/Physicals.htm
			categories: {
				refractoryMetal: 0.5,
			},
			crystal: 'hP',
			density: 11500,
			discovery: 1937,
			electronegativity: 1.9,
			modelColor: 'rgb(59, 158, 158)',
			nobleMetal: 4,
			oxidation: [4, 7],
			prices: {
				2004: 1e5,
			},
			resistivity: 200e-9,
			temperatures: {
				boil: 4538,
				melt: 2430,
			},
		},
	},
	{
		z: 44,
		name: 'Ruthenium',
		symbol: 'Ru',
		mass: 101.07,
		group: 8,
		period: 5,
		properties: {
			abundance: {
				earth: 330e-9,
				human: 7.6e-11, // appx
				universe: 4e-9,
			},
			bulkModulus: 220e9,
			categories: {
				nativeMetal: true,
				nobleMetal: true,
				platinumGroup: true,
				preciousMetal: true,
				refractoryMetal: 0.5,
				tech: true,
			},
			crystal: 'hP',
			density: 12370,
			discovery: 1844,
			electronegativity: 2.2,
			modelColor: 'rgb(36, 143, 143)',
			nobleMetal: 1,
			nucleosynthesis: {
				sProcess: 0.32,
				rProcess: 0.68,
			},
			oxidation: [3, 4],
			prices: {
				2021: 370/ounce,
				2020: 10500,
			},
			production: 12,
			resistivity: 71e-9,
			temperatures: {
				boil: 4423,
				melt: 2607,
			},
		},
	},
	{
		z: 45,
		name: 'Rhodium',
		symbol: 'Rh',
		mass: 102.90549,
		group: 9,
		period: 5,
		properties: {
			abundance: {
				earth: 61e-9,
				universe: 6e-10,
			},
			bulkModulus: 275e9,
			categories: {
				nativeMetal: true,
				nobleMetal: true,
				platinumGroup: true,
				preciousMetal: true,
				refractoryMetal: 0.5,
				tech: true,
			},
			crystal: 'cF',
			density: 12410,
			discovery: 1804,
			electronegativity: 2.28,
			modelColor: 'rgb(10, 125, 140)',
			nobleMetal: 1,
			nucleosynthesis: {
				sProcess: 0.13,
				rProcess: 0.87,
			},
			oxidation: [3],
			prices: {
				2021: 25700/ounce,
				2019: 147e3,
			},
			production: 25,
			resistivity: 43.3e-9,
			temperatures: {
				boil: 3968,
				melt: 2237,
			},
			toxicity: 198e-6, // LD50, rat, rhodium chloride
		},
	},
	{
		z: 46,
		name: 'Palladium',
		symbol: 'Pd',
		mass: 106.42,
		group: 10,
		period: 5,
		properties: {
			abundance: {
				earth: 240e-9,
				universe: 2e-9,
			},
			bulkModulus: 180e9,
			categories: {
				nativeMetal: true,
				nobleMetal: true,
				platinumGroup: true,
				preciousMetal: true,
				tech: true,
			},
			crystal: 'cF',
			density: 12020,
			discovery: 1802,
			electronegativity: 2.2,
			modelColor: 'rgb(0, 105, 133)',
			nobleMetal: 1,
			nucleosynthesis: {
				sProcess: 0.45,
				rProcess: 0.55,
			},
			oxidation: [0, 2, 4],
			prices: {
				2021: 2350/ounce,
				2019: 49.5e3,
			},
			production: 210, // https://pubs.usgs.gov/periodicals/mcs2020/mcs2020-platinum.pdf
			resistivity: 105.4e-9,
			temperatures: {
				boil: 3236,
				melt: 1828.05,
			},
			toxicity: 200e-6, // LD50, oral, mouse, soluble palladium compounds
		},
	},
	{
		z: 47,
		name: 'Silver',
		symbol: 'Ag',
		mass: 107.8682,
		group: 11,
		period: 5,
		properties: {
			abundance: {
				earth: 12e-9,
				human: 2e-9,
				universe: 6e-10,
			},
			bulkModulus: 100e9,
			categories: {
				coinageMetal: true,
				nativeMetal: true,
				nobleMetal: 0.5,
				preciousMetal: true,
				tech: 0.5,
			},
			crystal: 'cF',
			density: 10501,
			discovery: -5000,
			electronegativity: 1.93,
			modelColor: 'rgb(192, 192, 192)',
			nobleMetal: 2,
			nucleosynthesis: {
				sProcess: 0.19,
				rProcess: 0.81,
			},
			oxidation: [1],
			prices: {
				2021: 25.645/ounce,
				2019: 521,
			},
			production: 322e3,
			resistivity: 15.9e-9,
			rgb: 'rgb(255, 248, 239)',
			temperatures: {
				boil: 2435,
				melt: 1234.93,
			},
		},
	},
	{
		z: 48,
		name: 'Cadmium',
		symbol: 'Cd',
		mass: 112.414,
		group: 12,
		period: 5,
		properties: {
			abundance: {
				earth: 18e-9,
				human: 4.5e-8,
				universe: 2e-9,
			},
			biologicalHalfLife: 30*year, // in bone
			bulkModulus: 42e9,
			categories: {
				nativeMetal: 0.5,
				tech: 0.5,
			},
			crystal: 'hP',
			density: 8690,
			discovery: 1817,
			electronegativity: 1.69,
			modelColor: 'rgb(255, 217, 143)',
			nucleosynthesis: {
				sProcess: 0.52,
				rProcess: 0.48,
			},
			nutrition: 5,
			oxidation: [2],
			prices: {
				2019: 2.73,
			},
			production: 25e3, // https://pubs.usgs.gov/periodicals/mcs2020/mcs2020-cadmium.pdf
			resistivity: 72.7e-9,
			temperatures: {
				boil: 1040,
				melt: 594.22,
			},
			toxicity: 225e-6, // rat, oral
		},
	},
	{
		z: 49,
		name: 'Indium',
		symbol: 'In',
		mass: 114.818,
		group: 13,
		period: 5,
		properties: {
			abundance: {
				earth: 2e-9,
				human: 4e-10,
				universe: 3e-10,
			},
			bulkModulus: 40e9, // https://pilgaardelements.com/Strontium/Physicals.htm
			categories: {
				nativeMetal: 0.5,
				preciousMetal: 0.5,
				tech: true,
			},
			crystal: 'tI',
			density: 7310,
			discovery: 1867,
			electronegativity: 1.78,
			modelColor: 'rgb(166, 117, 115)',
			nucleosynthesis: {
				sProcess: 0.36,
				rProcess: 0.64,
			},
			oxidation: [3],
			prices: {
				2019: 167,
			},
			production: 476,
			resistivity: 83.7e-9,
			temperatures: {
				boil: 2345,
				melt: 429.75,
			},
		},
	},
	{
		z: 50,
		name: 'Tin',
		symbol: 'Sn',
		mass: 118.71,
		group: 14,
		period: 5,
		properties: {
			abundance: {
				earth: 55e-9,
				human: 6e-9,
				universe: 4e-9,
			},
			biologicalHalfLife: 3.5*day, // rats; oral; diethyltin chloride; https://www.sciencedirect.com/topics/agricultural-and-biological-sciences/biological-half-life
			bulkModulus: 58e9,
			categories: {
				coinageMetal: true,
				nativeMetal: 0.5,
				tech: 0.5,
			},
			crystal: 'tI',
			density: 7287,
			discovery: -3500,
			electronegativity: 1.96,
			modelColor: 'rgb(102, 128, 128)',
			nucleosynthesis: {
				sProcess: 0.69,
				rProcess: 0.31,
			},
			nutrition: 4,
			oxidation: [-4, 2, 4],
			prices: {
				2021: 12.565/pound,
				2019: 18.7,
			},
			production: 340e3,
			resistivity: 115e-9,
			temperatures: {
				boil: 2875,
				melt: 505.08,
			},
			toxicity: 200e-6, // "Nausea, vomiting and diarrhea have been reported after ingesting canned food containing 200 mg/kg of tin."
		},
	},
	{
		z: 51,
		name: 'Antimony',
		symbol: 'Sb',
		mass: 121.76,
		group: 15,
		period: 5,
		properties: {
			abundance: {
				earth: 11e-9,
				human: 6e-10,
				universe: 4e-10,
			},
			bulkModulus: 42e9,
			categories: {
				metalloid: true,
				nativeMetal: 0.5,
				pnictogen: true,
				tech: true,
			},
			crystal: 'hR',
			density: 6685,
			discovery: 815,
			electronegativity: 2.05,
			modelColor: 'rgb(158, 99, 181)',
			nobleMetal: 3,
			nucleosynthesis: {
				sProcess: 0.25,
				rProcess: 0.75,
			},
			oxidation: [-3, 3, 5],
			prices: {
				2019: 5.79,
			},
			production: 150e3,
			resistivity: 417e-9,
			temperatures: {
				boil: 1860,
				melt: 903.78,
			},
		},
	},
	{
		z: 52,
		name: 'Tellurium',
		symbol: 'Te',
		mass: 127.6,
		group: 16,
		period: 5,
		properties: {
			abundance: {
				earth: 61e-9,
				human: 2e-10,
				universe: 9e-9,
			},
			bulkModulus: 65e9,
			categories: {
				chalcogen: true,
				metalloid: true,
				nativeMetal: 0.5,
				tech: true,
			},
			crystal: 'hR',
			density: 6232,
			discovery: 1782,
			electronegativity: 2.1,
			modelColor: 'rgb(212, 122, 0)',
			nobleMetal: 3,
			nucleosynthesis: {
				sProcess: 0.57,
				rProcess: 0.43,
			},
			oxidation: [-2, 2, 4, 6],
			prices: {
				2019: 63.5,
			},
			production: 122,
			resistivity: 1e-4, // https://periodictable.com/Elements/052/data.html
			temperatures: {
				boil: 1261,
				melt: 722.66,
			},
		},
	},
	{
		z: 53,
		name: 'Iodine',
		symbol: 'I',
		mass: 126.90447,
		group: 17,
		period: 5,
		properties: {
			abundance: {
				earth: 10e-9,
				human: 7.5e-9,
				universe: 1e-9,
			},
			biologicalHalfLife: 66.1*day, // https://www.sciencedirect.com/topics/agricultural-and-biological-sciences/biological-half-life
			bulkModulus: 7.7e9,
			categories: {
				halogen: true,
				reactiveNonmetal: true,
			},
			crystal: 'oS',
			density: 4930,
			discovery: 1811,
			electronegativity: 2.66,
			modelColor: 'rgb(148, 0, 148)',
			nucleosynthesis: {
				sProcess: 0.05,
				rProcess: 0.95,
			},
			nutrition: 2,
			oxidation: [-1, 1, 3, 5, 7],
			prices: {
				2019: 35,
			},
			production: 28e3, // https://pubs.usgs.gov/periodicals/mcs2020/mcs2020-iodine.pdf
			resistivity: 1.3e7,
			rgb: 'rgb(216, 229, 255)',
			temperatures: {
				boil: 457.4,
				melt: 386.85,
			},
			toxicity: 30e-6, // LD50, oral, adult human
		},
	},
	{
		z: 54,
		name: 'Xenon',
		symbol: 'Xe',
		mass: 131.293,
		group: 18,
		period: 5,
		properties: {
			abundance: {
				earth: 0.00003e-6,
				universe: 1e-8,
			},
			categories: {
				nobleGas: true,
			},
			crystal: 'cF',
			density: 5.887,
			discovery: 1898,
			electronegativity: 2.6,
			modelColor: 'rgb(66, 158, 176)',
			nucleosynthesis: {
				sProcess: 0.17,
				rProcess: 0.83,
			},
			oxidation: [0],
			prices: {
				1999: 1800,
			},
			production: 40,
			temperatures: {
				boil: 165.03,
				melt: 161.4,
			},
		},
	},
	// period 6
	{
		z: 55,
		name: 'Cesium',
		symbol: 'Cs',
		mass: 132.90545196,
		group: 1,
		period: 6,
		properties: {
			abundance: {
				earth: 7e-9,
				human: 1e-9,
				universe: 8e-10,
			},
			biologicalHalfLife: 2.5*month, // 1-4 mos
			bulkModulus: 1.6e9,
			categories: {
				alkaliMetal: true,
				tech: 0.5,
			},
			crystal: 'cI',
			density: 1873,
			discovery: 1882,
			electronegativity: 0.79,
			modelColor: 'rgb(87, 23, 143)',
			nucleosynthesis: {
				sProcess: 0.15,
				rProcess: 0.85,
			},
			oxidation: [1],
			prices: {
				2018: 61.8e3,
			},
			resistivity: 205e-9,
			rgb: 'rgb(255, 212, 153)',
			temperatures: {
				boil: 944,
				melt: 301.59,
			},
			toxicity: 2.3e-3, // https://en.wikipedia.org/wiki/Caesium#Health_and_safety_hazards
		},
	},
	{
		z: 56,
		name: 'Barium',
		symbol: 'Ba',
		mass: 137.327,
		group: 2,
		period: 6,
		properties: {
			abundance: {
				earth: 850e-9,
				human: 1.2e-8,
				universe: 1e-8,
			},
			biologicalHalfLife: 65*day, // Ba-140; http://hyperphysics.phy-astr.gsu.edu/hbase/Nuclear/biohalf.html
			bulkModulus: 9.6e9,
			categories: {
				aem: true,
			},
			crystal: 'cI',
			density: 3594,
			discovery: 1808,
			electronegativity: 0.89,
			modelColor: 'rgb(0, 201, 0)',
			nucleosynthesis: {
				sProcess: 0.82,
				rProcess: 0.18,
			},
			oxidation: [2],
			prices: {
				2016: 0.261,
			},
			resistivity: 332e-9,
			temperatures: {
				boil: 2170,
				melt: 1000,
			},
		},
	},
	{
		z: 57,
		name: 'Lanthanum',
		symbol: 'La',
		mass: 138.90547,
		period: 6,
		properties: {
			abundance: {
				earth: 82e-9,
				human: 4e-10,
				universe: 2e-9,
			},
			bulkModulus: 27.9e9,
			categories: {
				lanthanide: true,
				rem: true,
				tech: true,
			},
			crystal: 'hP',
			density: 6145,
			discovery: 1841,
			electronegativity: 1.1,
			modelColor: 'rgb(112, 212, 255)',
			nucleosynthesis: {
				sProcess: 0.62,
				rProcess: 0.38,
			},
			nutrition: 5,
			oxidation: [3],
			prices: {
				2020: 4.85,
			},
			resistivity: 615e-9,
			temperatures: {
				boil: 3737,
				melt: 1193,
			},
		},
	},
	{
		z: 58,
		name: 'Cerium',
		symbol: 'Ce',
		mass: 140.116,
		period: 6,
		properties: {
			abundance: {
				earth: 210e-9,
				human: 2e-8,
				universe: 1e-8,
			},
			bulkModulus: 21.5e9,
			categories: {
				lanthanide: true,
				rem: true,
				tech: true,
			},
			crystal: 'hP',
			density: 6770,
			discovery: 1838,
			electronegativity: 1.12,
			modelColor: 'rgb(255, 255, 199)',
			nucleosynthesis: {
				sProcess: 0.76,
				rProcess: 0.24,
			},
			nutrition: 5,
			oxidation: [3, 4],
			prices: {
				2020: 31.4,
			},
			resistivity: 828e-9,
			temperatures: {
				boil: 3716,
				melt: 1068,
			},
		},
	},
	{
		z: 59,
		name: 'Praseodymium',
		symbol: 'Pr',
		mass: 140.90766,
		period: 6,
		properties: {
			abundance: {
				earth: 31e-9,
				universe: 2e-9,
			},
			bulkModulus: 28.8e9,
			categories: {
				lanthanide: true,
				rem: true,
				tech: true,
			},
			crystal: 'hP',
			density: 6773,
			discovery: 1885,
			electronegativity: 1.13,
			modelColor: 'rgb(217, 255, 199)',
			nucleosynthesis: {
				sProcess: 0.52,
				rProcess: 0.48,
			},
			nutrition: 5,
			oxidation: [3],
			prices: {
				2019: 103,
			},
			resistivity: 700e-9,
			temperatures: {
				boil: 3793,
				melt: 1208,
			},
		},
	},
	{
		z: 60,
		name: 'Neodymium',
		symbol: 'Nd',
		mass: 144.242,
		period: 6,
		properties: {
			abundance: {
				earth: 150e-9,
				universe: 1e-8,
			},
			bulkModulus: 31.8e9,
			categories: {
				lanthanide: true,
				rem: true,
				tech: true,
			},
			crystal: 'hP',
			density: 7007,
			discovery: 1885,
			electronegativity: 1.14,
			modelColor: 'rgb(199, 255, 199)',
			nucleosynthesis: {
				sProcess: 0.60,
				rProcess: 0.40,
			},
			nutrition: 5,
			oxidation: [3],
			prices: {
				2019: 57.5,
			},
			production: 7000,
			resistivity: 643e-9,
			temperatures: {
				boil: 3347,
				melt: 1297,
			},
		},
	},
	{
		z: 61,
		name: 'Prometheum',
		symbol: 'Pm',
		mass: 145,
		period: 6,
		properties: {
			abundance: {
				earth: 2e-23,
			},
			bulkModulus: 33e9,
			categories: {
				lanthanide: true,
				rem: true,
				tech: 0.5,
			},
			crystal: 'hP',
			density: 7260,
			discovery: 1945,
			electronegativity: 1.15,
			modelColor: 'rgb(163, 255, 199)',
			oxidation: [3],
			prices: {
				2003: 460e3,
			},
			resistivity: 750e-9,
			temperatures: {
				boil: 3273,
				melt: 1315,
			},
		},
	},
	{
		z: 62,
		name: 'Samarium',
		symbol: 'Sm',
		mass: 150.36,
		period: 6,
		properties: {
			abundance: {
				earth: 47e-9,
				human: 3e-11,
				universe: 5e-9,
			},
			bulkModulus: 37.8e9,
			categories: {
				lanthanide: true,
				rem: true,
				tech: true,
			},
			crystal: 'hR',
			density: 7520,
			discovery: 1879,
			electronegativity: 1.17,
			modelColor: 'rgb(143, 255, 199)',
			nucleosynthesis: {
				sProcess: 0.29,
				rProcess: 0.71,
			},
			nutrition: 5,
			oxidation: [3],
			prices: {
				2019: 13.9,
			},
			production: 700,
			resistivity: 940e-9,
			temperatures: {
				boil: 2067,
				melt: 1345,
			},
		},
	},
	{
		z: 63,
		name: 'Europium',
		symbol: 'Eu',
		mass: 151.964,
		period: 6,
		properties: {
			abundance: {
				earth: 17e-9,
				universe: 5e-10,
			},
			bulkModulus: 8.3e9,
			categories: {
				lanthanide: true,
				rem: true,
				tech: true,
			},
			crystal: 'cI',
			density: 5243,
			discovery: 1901,
			electronegativity: 1.15,
			modelColor: 'rgb(97, 255, 199)',
			nucleosynthesis: {
				sProcess: 0.05,
				rProcess: 0.95,
			},
			oxidation: [2, 3],
			prices: {
				2020: 31.4,
			},
			resistivity: 900e-9,
			temperatures: {
				boil: 1802,
				melt: 1099,
			},
			toxicity: 5e-3, // LD50, oral, europium chloride and nitrate
		},
	},
	{
		z: 64,
		name: 'Gadolinium',
		symbol: 'Gd',
		mass: 157.25,
		period: 6,
		properties: {
			abundance: {
				earth: 61e-9,
				universe: 2e-9,
			},
			bulkModulus: 37.9e9,
			categories: {
				lanthanide: true,
				rem: true,
				tech: true,
			},
			crystal: 'hP',
			density: 7895,
			discovery: 1886,
			electronegativity: 1.2,
			modelColor: 'rgb(69, 255, 199)',
			nucleosynthesis: {
				sProcess: 0.15,
				rProcess: 0.85,
			},
			oxidation: [3],
			prices: {
				2020: 28.6,
			},
			resistivity: 1.31e-6,
			temperatures: {
				boil: 3546,
				melt: 1585,
			},
			toxicity: 150e-6, // LD50, mice
		},
	},
	{
		z: 65,
		name: 'Terbium',
		symbol: 'Tb',
		mass: 158.925354,
		period: 6,
		properties: {
			abundance: {
				earth: 11e-9,
				universe: 5e-10,
			},
			bulkModulus: 38.7e9,
			categories: {
				lanthanide: true,
				rem: true,
				tech: true,
			},
			crystal: 'hP',
			density: 8229,
			discovery: 1886,
			electronegativity: 1.1,
			modelColor: 'rgb(48, 255, 199)',
			nucleosynthesis: {
				sProcess: 0.07,
				rProcess: 0.93,
			},
			oxidation: [3],
			prices: {
				2019: 658,
			},
			resistivity: 1.15e-6,
			temperatures: {
				boil: 3503,
				melt: 1629,
			},
		},
	},
	{
		z: 66,
		name: 'Dysprosium',
		symbol: 'Dy',
		mass: 162.5,
		period: 6,
		properties: {
			abundance: {
				earth: 74e-9,
				universe: 2e-9,
			},
			bulkModulus: 40.5e9,
			categories: {
				lanthanide: true,
				rem: true,
				tech: true,
			},
			crystal: 'hP',
			density: 8550,
			discovery: 1886,
			electronegativity: 1.22,
			modelColor: 'rgb(31, 255, 199)',
			nucleosynthesis: {
				sProcess: 0.14,
				rProcess: 0.86,
			},
			oxidation: [3],
			prices: {
				2019: 307,
			},
			production: 100,
			resistivity: 926e-9,
			temperatures: {
				boil: 2840,
				melt: 1680,
			},
			toxicity: 0.5 / 65, // it is estimated that the ingestion of 500 grams or more could be fatal to a human
		},
	},
	{
		z: 67,
		name: 'Holmium',
		symbol: 'Ho',
		mass: 164.930329,
		period: 6,
		properties: {
			abundance: {
				earth: 16e-9,
				universe: 5e-10,
			},
			bulkModulus: 40.2e9,
			categories: {
				lanthanide: true,
				rem: true,
				tech: 0.5,
			},
			crystal: 'hP',
			density: 8795,
			discovery: 1879,
			electronegativity: 1.23,
			modelColor: 'rgb(0, 255, 156)',
			nucleosynthesis: {
				sProcess: 0.07,
				rProcess: 0.93,
			},
			oxidation: [3],
			prices: {
				2020: 57.1,
			},
			resistivity: 814e-9,
			temperatures: {
				boil: 2993,
				melt: 1734,
			},
		},
	},
	{
		z: 68,
		name: 'Erbium',
		symbol: 'Er',
		mass: 167.259,
		period: 6,
		properties: {
			abundance: {
				earth: 47e-9,
				universe: 2e-9,
			},
			bulkModulus: 44.4e9,
			categories: {
				lanthanide: true,
				rem: true,
				tech: true,
			},
			crystal: 'hP',
			density: 9066,
			discovery: 1879,
			electronegativity: 1.24,
			modelColor: 'rgb(0, 230, 117)',
			nucleosynthesis: {
				sProcess: 0.16,
				rProcess: 0.84,
			},
			oxidation: [3],
			prices: {
				2020: 26.4,
			},
			resistivity: 860e-9,
			temperatures: {
				boil: 3141,
				melt: 1734,
			},
		},
	},
	{
		z: 69,
		name: 'Thulium',
		symbol: 'Tm',
		mass: 168.934219,
		period: 6,
		properties: {
			abundance: {
				earth: 7e-9,
				universe: 1e-10,
			},
			bulkModulus: 44.5e9,
			categories: {
				lanthanide: true,
				rem: true,
				tech: 0.5,
			},
			crystal: 'hP',
			density: 9321,
			discovery: 1879,
			electronegativity: 1.25,
			modelColor: 'rgb(0, 212, 82)',
			nucleosynthesis: {
				sProcess: 0.12,
				rProcess: 0.88,
			},
			oxidation: [3],
			prices: {
				2003: 3000,
			},
			resistivity: 676e-9,
			temperatures: {
				boil: 2223,
				melt: 1818,
			},
		},
	},
	{
		z: 70,
		name: 'Ytterbium',
		symbol: 'Yb',
		mass: 173.045,
		period: 6,
		properties: {
			abundance: {
				earth: 45e-9,
				universe: 2e-9,
			},
			bulkModulus: 30.5e9,
			categories: {
				lanthanide: true,
				rem: true,
				tech: 0.5,
			},
			crystal: 'cF',
			density: 6965,
			discovery: 1906,
			electronegativity: 1.15,
			modelColor: 'rgb(0, 191, 56)',
			nucleosynthesis: {
				sProcess: 0.32,
				rProcess: 0.68,
			},
			oxidation: [3],
			prices: {
				2020: 17.1,
			},
			resistivity: 250e-9,
			temperatures: {
				boil: 1469,
				melt: 1097,
			},
		},
	},
	{
		z: 71,
		name: 'Lutetium',
		symbol: 'Lu',
		mass: 174.9668,
		group: 3,
		period: 6,
		properties: {
			abundance: {
				earth: 7e-9,
				universe: 1e-10,
			},
			bulkModulus: 47.6e9,
			categories: {
				lanthanide: true,
				rem: true,
				tech: 0.5,
			},
			crystal: 'hP',
			density: 9840,
			discovery: 1906,
			electronegativity: 1.27,
			modelColor: 'rgb(0, 171, 36)',
			nucleosynthesis: {
				sProcess: 0.20,
				rProcess: 0.80,
			},
			oxidation: [3],
			prices: {
				2020: 643,
			},
			resistivity: 582e-9,
			temperatures: {
				boil: 3675,
				melt: 1925,
			},
		},
	},
	{
		z: 72,
		name: 'Hafnium',
		symbol: 'Hf',
		mass: 178.486,
		group: 4,
		period: 6,
		properties: {
			abundance: {
				earth: 28e-9,
				universe: 7e-10,
			},
			bulkModulus: 110e9,
			categories: {
				refractoryMetal: 0.5,
				tech: 0.5,
			},
			crystal: 'hP',
			density: 13310,
			discovery: 1922,
			electronegativity: 1.3,
			modelColor: 'rgb(77, 194, 255)',
			nobleMetal: 0,
			nucleosynthesis: {
				sProcess: 0.55,
				rProcess: 0.45,
			},
			oxidation: [4],
			prices: {
				2017: 900,
			},
			production: 10,
			resistivity: 331e-9,
			temperatures: {
				boil: 4876,
				melt: 2506,
			},
		},
	},
	{
		z: 73,
		name: 'Tantalum',
		symbol: 'Ta',
		mass: 180.94788,
		group: 5,
		period: 6,
		properties: {
			abundance: {
				earth: 4e-9,
				human: 3e-9,
				universe: 8e-11,
			},
			bulkModulus: 200e9,
			categories: {
				nativeMetal: 0.5,
				refractoryMetal: true,
				tech: true,
			},
			crystal: 'cI',
			density: 16654,
			discovery: 1802,
			electronegativity: 1.5,
			modelColor: 'rgb(77, 166, 255)',
			nobleMetal: 0,
			nucleosynthesis: {
				sProcess: 0.41,
				rProcess: 0.49,
			},
			oxidation: [5],
			prices: {
				2019: 305,
				2018: 151.8,
			},
			production: 1.8e3, // https://pubs.usgs.gov/periodicals/mcs2020/mcs2020-tantalum.pdf
			resistivity: 131e-9,
			temperatures: {
				boil: 5731,
				melt: 3290,
			},
		},
	},
	{
		z: 74,
		name: 'Tungsten',
		symbol: 'W',
		mass: 183.84,
		group: 6,
		period: 6,
		properties: {
			abundance: {
				earth: 24e-9,
				human: 3e-10,
				universe: 5e-10,
			},
			bulkModulus: 310e9,
			categories: {
				nativeMetal: 0.5,
				refractoryMetal: true,
				tech: true,
			},
			crystal: 'cI',
			density: 19250,
			discovery: 1783,
			electronegativity: 2.36,
			modelColor: 'rgb(33, 148, 214)',
			nobleMetal: 0,
			nucleosynthesis: {
				sProcess: 0.57,
				rProcess: 0.43,
			},
			nutrition: 5,
			oxidation: [4, 6],
			prices: {
				2019: 35.3,
				2018: 30.3,
			},
			production: 37400,
			resistivity: 52.8e-9,
			temperatures: {
				boil: 5828,
				melt: 3695,
			},
			toxicity: 59e-6, // https://en.wikipedia.org/wiki/Tungsten#Health_factors
		},
	},
	{
		z: 75,
		name: 'Rhenium',
		symbol: 'Re',
		mass: 186.207,
		group: 7,
		period: 6,
		properties: {
			abundance: {
				earth: 10e-9,
				universe: 2e-10,
			},
			bulkModulus: 370e9,
			categories: {
				nativeMetal: 0.5,
				nobleMetal: 0.5,
				preciousMetal: true,
				refractoryMetal: true,
				tech: 0.5,
			},
			crystal: 'hP',
			density: 21020,
			discovery: 1919,
			electronegativity: 1.9,
			modelColor: 'rgb(38, 125, 171)',
			nobleMetal: 2,
			nucleosynthesis: {
				sProcess: 0.08,
				rProcess: 0.92,
			},
			oxidation: [4, 7],
			prices: {
				2020: 3580,
			},
			production: 45,
			resistivity: 193e-9,
			temperatures: {
				boil: 5869,
				melt: 3459,
			},
			toxicity: 280e-6, // https://en.wikipedia.org/wiki/Rhenium#Precautions
		},
	},
	{
		z: 76,
		name: 'Osmium',
		symbol: 'Os',
		mass: 190.23,
		group: 8,
		period: 6,
		properties: {
			abundance: {
				earth: 120e-9,
				universe: 3e-9,
			},
			bulkModulus: 462e9,
			categories: {
				nativeMetal: true,
				nobleMetal: true,
				platinumGroup: true,
				preciousMetal: true,
				refractoryMetal: 0.5,
				tech: 0.5,
			},
			crystal: 'hP',
			density: 22590,
			discovery: 1803,
			electronegativity: 2.2,
			modelColor: 'rgb(38, 102, 150)',
			nobleMetal: 1,
			nucleosynthesis: {
				sProcess: 0.10,
				rProcess: 0.90,
			},
			oxidation: [4],
			prices: {
				2018: 400/ounce,
				2016: 12e3,
			},
			production: 1,
			resistivity: 81.2e-9,
			temperatures: {
				boil: 5285,
				melt: 3306,
			},
		},
	},
	{
		z: 77,
		name: 'Iridium',
		symbol: 'Ir',
		mass: 192.217,
		group: 9,
		period: 6,
		properties: {
			abundance: {
				earth: 120e-9,
				human: 20e-12, // https://en.wikipedia.org/wiki/Iridium#Precautions
				universe: 2e-9,
			},
			bulkModulus: 320e9,
			categories: {
				nativeMetal: true,
				nobleMetal: true,
				platinumGroup: true,
				preciousMetal: true,
				refractoryMetal: 0.5,
				tech: true,
			},
			crystal: 'cF',
			density: 22560,
			discovery: 1803,
			electronegativity: 2.2,
			modelColor: 'rgb(22, 84, 135)',
			nobleMetal: 1,
			nucleosynthesis: {
				sProcess: 0.01,
				rProcess: 0.99,
			},
			oxidation: [3, 4],
			prices: {
				2021: 5500/ounce,
				2020: 55850,
			},
			production: 3,
			resistivity: 47.1e-9,
			temperatures: {
				boil: 4701,
				melt: 2719,
			},
		},
	},
	{
		z: 78,
		name: 'Platinum',
		symbol: 'Pt',
		mass: 195.084,
		group: 10,
		period: 6,
		properties: {
			abundance: {
				earth: 250e-9,
				universe: 5e-9,
			},
			bulkModulus: 230e9,
			categories: {
				nativeMetal: true,
				nobleMetal: true,
				platinumGroup: true,
				preciousMetal: true,
				tech: true,
			},
			crystal: 'cF',
			density: 21460,
			discovery: 1735,
			electronegativity: 2.28,
			modelColor: 'rgb(208, 208, 224)',
			nobleMetal: 1,
			nucleosynthesis: {
				sProcess: 0.05,
				rProcess: 0.95,
			},
			oxidation: [2, 4],
			prices: {
				2021: 1227/ounce,
				2020: 27800,
			},
			production: 239,
			resistivity: 105e-9,
			temperatures: {
				boil: 4098,
				melt: 2041.4,
			},
		},
	},
	{
		z: 79,
		name: 'Gold',
		symbol: 'Au',
		mass: 196.96657,
		group: 11,
		period: 6,
		properties: {
			abundance: {
				earth: 21e-9,
				human: 3e-9,
				universe: 6e-10,
			},
			biologicalHalfLife: 280*day, // Au-198; http://hyperphysics.phy-astr.gsu.edu/hbase/Nuclear/biohalf.html
			bulkModulus: 180e9,
			categories: {
				nativeMetal: true,
				nobleMetal: true,
				coinageMetal: true,
				preciousMetal: true,
				tech: 0.5,
			},
			crystal: 'cF',
			density: 19282,
			discovery: -6000,
			electronegativity: 2.54,
			modelColor: 'rgb(255, 209, 35)',
			nobleMetal: 2,
			nucleosynthesis: {
				sProcess: 0.06,
				rProcess: 0.94,
			},
			oxidation: [1, 3],
			prices: {
				2021: 1711.5/ounce,
				2020: 44800,
			},
			production: 2310,
			resistivity: 24.4e-9,
			rgb: 'rgb(255, 211, 109)',
			temperatures: {
				boil: 3129,
				melt: 1337.33,
			},
		},
	},
	{
		z: 80,
		name: 'Mercury',
		symbol: 'Hg',
		mass: 200.592,
		group: 12,
		period: 6,
		properties: {
			abundance: {
				earth: 3e-9,
				human: 8.9e-10,
				universe: 1e-9,
			},
			biologicalHalfLife: 65*day, // as methylmercury; in blood
			bulkModulus: 25e9, // https://periodictable.com/Properties/A/BulkModulus.al.html
			categories: {
				nativeMetal: 0.5,
				nobleMetal: 0.5,
			},
			crystal: 'hR',
			density: 13533.6,
			discovery: -1500,
			electronegativity: 2,
			modelColor: 'rgb(184, 184, 208)',
			nobleMetal: 2,
			nucleosynthesis: {
				sProcess: 0.62,
				rProcess: 0.38,
			},
			oxidation: [1, 2],
			prices: {
				2017: 30.2,
			},
			production: 4e6, // https://pubs.usgs.gov/periodicals/mcs2020/mcs2020-mercury.pdf
			resistivity: 961e-9,
			temperatures: {
				boil: 629.88,
				melt: 234.43,
			},
		},
	},
	{
		z: 81,
		name: 'Thallium',
		symbol: 'Tl',
		mass: 204.38,
		group: 13,
		period: 6,
		properties: {
			abundance: {
				earth: 2e-9,
				human: 7e-11,
				universe: 5e-10,
			},
			bulkModulus: 43e9,
			crystal: 'hP',
			density: 11850,
			discovery: 1862,
			electronegativity: 1.62,
			modelColor: 'rgb(166, 84, 77)',
			nucleosynthesis: {
				sProcess: 0.77,
				rProcess: 0.23,
			},
			oxidation: [1, 3],
			prices: {
				2017: 4200,
			},
			production: 10,
			resistivity: 180e-9,
			rgb: 'rgb(255, 252, 253)',
			temperatures: {
				boil: 1746,
				melt: 577,
			},
		},
	},
	{
		z: 82,
		name: 'Lead',
		symbol: 'Pb',
		mass: 207.2,
		group: 14,
		period: 6,
		properties: {
			abundance: {
				earth: 29e-9,
				human: 4.5e-8,
				universe: 1e-8,
			},
			biologicalHalfLife: 32*day, // 28-36 d in blood
			bulkModulus: 46e9,
			categories: {
				nativeMetal: 0.5,
			},
			crystal: 'cF',
			density: 11342,
			discovery: -7000,
			electronegativity: 1.87,
			modelColor: 'rgb(87, 89, 97)',
			nucleosynthesis: {
				sProcess: 0.47,
				rProcess: 0.53,
				tech: 0.5,
			},
			nutrition: 4,
			oxidation: [2, 4],
			prices: {
				2021: 0.8729/pound,
				2019: 2,
			},
			production: 8725e3,
			resistivity: 208e-9,
			rgb: 'rgb(255, 255, 255)',
			temperatures: {
				boil: 2022,
				melt: 600.61,
			},
		},
	},
	{
		z: 83,
		name: 'Bismuth',
		symbol: 'Bi',
		mass: 208.9804,
		group: 15,
		period: 6,
		properties: {
			abundance: {
				earth: 1e-9,
				human: 2e-10,
				universe: 7e-10,
			},
			biologicalHalfLife: 5*day, // https://en.wikipedia.org/wiki/Bismuth#Toxicology_and_ecotoxicology
			bulkModulus: 31e9,
			categories: {
				nativeMetal: 0.5,
				pnictogen: true,
			},
			crystal: 'hR',
			density: 9807,
			discovery: 1000,
			electronegativity: 2.02,
			modelColor: 'rgb(158, 79, 181)',
			nobleMetal: 3,
			nucleosynthesis: {
				sProcess: 0.005,
				rProcess: 0.995,
			},
			oxidation: [3],
			prices: {
				2019: 6.36,
			},
			production: 15e3,
			resistivity: 1.29e-6,
			rgb: 'rgb(255, 245, 232)',
			temperatures: {
				boil: 1837,
				melt: 544.7,
			},
		},
	},
	{
		z: 84,
		name: 'Polonium',
		symbol: 'Po',
		mass: 209,
		group: 16,
		period: 6,
		properties: {
			abundance: {
				earth: 0.2e-2 * 9e-13, // https://en.wikipedia.org/wiki/Polonium#Occurrence_and_production
			},
			biologicalHalfLife: 40*day, // 30-50 d
			categories: {
				chalcogen: true,
				metalloid: 0.5,
			},
			crystal: 'cP',
			density: 9320,
			discovery: 1902,
			electronegativity: 2,
			modelColor: 'rgb(171, 92, 0)',
			nobleMetal: 4,
			nucleosynthesis: {
				decay: 1,
			},
			oxidation: [-2, 2, 4],
			/* prices: {
				2004: 49.2e12,
			}, */
			production: 100e-6,
			resistivity: 400e-9,
			rgb: 'rgb(234, 242, 255)',
			temperatures: {
				boil: 1235,
				melt: 527,
			},
			toxicity: 8.7e-12, //  rats were given a fatal dose of 1.45 MBq/kg (8.7 ng/kg) of 210Po;
		},
	},
	{
		z: 85,
		name: 'Astatine',
		symbol: 'At',
		mass: 210,
		group: 17,
		period: 6,
		properties: {
			abundance: {
				earth: 1e-24, // https://en.wikipedia.org/wiki/Astatine#Natural_occurrence
			},
			categories: {
				halogen: true,
				metalloid: 0.5,
			},
			crystal: 'cF',
			density: 8930,
			discovery: 1940,
			electronegativity: 2.2,
			modelColor: 'rgb(117, 79, 69)',
			nobleMetal: 4,
			nucleosynthesis: {
				decay: 1,
			},
			oxidation: [-1, 1],
			temperatures: {
				boil: 610,
				melt: 575,
			},
		},
	},
	{
		z: 86,
		name: 'Radon',
		symbol: 'Rn',
		mass: 222,
		group: 18,
		period: 6,
		properties: {
			abundance: {
				earth: 4e-17,
			},
			categories: {
				nobleGas: true,
			},
			crystal: 'cF',
			density: 9.73,
			discovery: 1910,
			electronegativity: 2.2,
			modelColor: 'rgb(66, 130, 150)',
			nucleosynthesis: {
				decay: 1,
			},
			oxidation: [0],
			temperatures: {
				boil: 211.5,
				melt: 202,
			},
		},
	},
	{
		z: 87,
		name: 'Francium',
		symbol: 'Fr',
		mass: 223,
		group: 1,
		period: 7,
		properties: {
			abundance: {
				earth: 1e-18 * 2e-9, // https://en.wikipedia.org/wiki/Francium#Occurrence
			},
			categories: {
				alkaliMetal: true,
			},
			crystal: 'cI',
			density: 2480,
			discovery: 1939,
			electronegativity: 0.8,
			modelColor: 'rgb(66, 0, 102)',
			nucleosynthesis: {
				decay: 1,
			},
			oxidation: [1],
			resistivity: 3e-6,
			temperatures: {
				boil: 950,
				melt: 300,
			},
		},
	},
	{
		z: 88,
		name: 'Radium',
		symbol: 'Ra',
		mass: 226,
		group: 2,
		period: 7,
		properties: {
			abundance: {
				earth: 9e-13, // https://en.wikipedia.org/wiki/Radium#Occurrence
				human: 1e-19,
			},
			biologicalHalfLife: 1.6e4*day, // Ra-226; http://hyperphysics.phy-astr.gsu.edu/hbase/Nuclear/biohalf.html
			categories: {
				aem: true,
			},
			crystal: 'cI',
			density: 5500,
			discovery: 1902,
			electronegativity: 0.9,
			modelColor: 'rgb(0, 125, 0)',
			nucleosynthesis: {
				decay: 1,
			},
			oxidation: [2],
			resistivity: 1e-6,
			rgb: 'rgb(255, 233, 198)',
			temperatures: {
				boil: 2010,
				melt: 973,
			},
		},
	},
	{
		z: 89,
		name: 'Actinium',
		symbol: 'Ac',
		mass: 227,
		period: 7,
		properties: {
			abundance: {
				earth: 2e-7 * 2e-9, // https://en.wikipedia.org/wiki/Actinium#Occurrence_and_synthesis
			},
			categories: {
				actinide: true,
			},
			crystal: 'cF',
			density: 10070,
			discovery: 1902,
			electronegativity: 1.1,
			modelColor: 'rgb(112, 171, 250)',
			nucleosynthesis: {
				decay: 1,
			},
			oxidation: [3],
			/* prices: {
				2004: 29e12,
			}, */
			temperatures: {
				boil: 3471,
				melt: 1323,
			},
		},
	},
	{
		z: 90,
		name: 'Thorium',
		symbol: 'Th',
		mass: 232.0377,
		period: 7,
		properties: {
			abundance: {
				earth: 6e-9,
				human: 3e-11,
				universe: 4e-10,
			},
			bulkModulus: 54e9,
			categories: {
				actinide: true,
			},
			crystal: 'cF',
			density: 11720,
			discovery: 1914,
			electronegativity: 1.3,
			modelColor: 'rgb(0, 185, 255)',
			nucleosynthesis: {
				rProcess: 1,
			},
			oxidation: [4],
			prices: {
				2010: 287,
			},
			production: 1.2e3, // US, est. https://pubs.usgs.gov/periodicals/mcs2020/mcs2020-thorium.pdf
			resistivity: 157e-9,
			rgb: 'rgb(255, 229, 216)',
			temperatures: {
				boil: 5061,
				melt: 2115,
			},
		},
	},
	{
		z: 91,
		name: 'Protactinium',
		symbol: 'Pa',
		mass: 231.03588,
		period: 7,
		properties: {
			abundance: {
				earth: 1.4e-12,
			},
			biologicalHalfLife: 25*day, // appx.; https://en.wikipedia.org/wiki/Protactinium#Precautions
			categories: {
				actinide: true,
			},
			crystal: 'tI',
			density: 15370,
			discovery: 1927,
			electronegativity: 1.5,
			modelColor: 'rgb(0, 161, 255)',
			nucleosynthesis: {
				decay: 1,
			},
			oxidation: [5],
			prices: {
				2011: 280e3,
			},
			resistivity: 177e-9,
			temperatures: {
				boil: 4300,
				melt: 1841,
			},
			toxicity: 0.5e-9/70, // "The maximum safe dose of Pa in the human body (~70kg) is ... 0.5 micrograms
		},
	},
	{
		z: 92,
		name: 'Uranium',
		symbol: 'U',
		mass: 238.02891,
		period: 7,
		properties: {
			abundance: {
				earth: 2e-9,
				human: 3e-11,
				universe: 2e-10,
			},
			biologicalHalfLife: 15*day, // U-235; http://hyperphysics.phy-astr.gsu.edu/hbase/Nuclear/biohalf.html
			bulkModulus: 100e9,
			categories: {
				actinide: true,
			},
			crystal: 'oP',
			density: 18950,
			discovery: 1841,
			electronegativity: 1.38,
			modelColor: 'rgb(0, 143, 255)',
			nucleosynthesis: {
				rProcess: 1,
			},
			oxidation: [4, 6],
			prices: {
				2018: 101,
			},
			production: 50572,
			resistivity: 280e-9,
			rgb: 'rgb(255, 251, 242)',
			temperatures: {
				boil: 4404,
				melt: 1405.3,
			},
		},
	},
	{
		z: 93,
		name: 'Neptunium',
		symbol: 'Np',
		mass: 237,
		period: 7,
		properties: {
			abundance: {
				earth: 3e-18,
			},
			bulkModulus: 118e9, // https://pilgaardelements.com/Neptunium/Physicals.htm
			categories: {
				actinide: true,
			},
			crystal: 'oP',
			density: 20450,
			discovery: 1940,
			electronegativity: 1.36,
			modelColor: 'rgb(0, 128, 255)',
			nucleosynthesis: {
				rProcess: 1,
			},
			oxidation: [5],
			prices: {
				2020: 660e3,
			},
			resistivity: 1.22e-6,
			temperatures: {
				boil: 4273,
				melt: 917,
			},
		},
	},
	{
		z: 94,
		name: 'Plutonium',
		symbol: 'Pu',
		mass: 244,
		period: 7,
		properties: {
			abundance: {
				earth: 3e-17,
			},
			biologicalHalfLife: 40*year, // in liver
			bulkModulus: 40e9, // https://pilgaardelements.com/Plutonium/Physicals.htm
			/* prices: {
				2019: 6.49e6,
			}, */
			categories: {
				actinide: true,
			},
			crystal: 'mP',
			density: 19850,
			discovery: 1940,
			electronegativity: 1.28,
			modelColor: 'rgb(0, 107, 255)',
			nucleosynthesis: {
				rProcess: 1,
			},
			oxidation: [4],
			resistivity: 1.46e-6,
			rgb: 'rgb(255, 226, 249)',
			temperatures: {
				boil: 3501,
				melt: 912.5,
			},
			toxicity: 5e-6, // "Animal studies found that a few milligrams of plutonium per kilogram of tissue is a lethal dose."
		},
	},
	{
		z: 95,
		name: 'Americium',
		symbol: 'Am',
		mass: 243,
		period: 7,
		properties: {
			biologicalHalfLife: 7*day, // "If consumed, most of the americium is excreted within a few days,"
			categories: {
				actinide: true,
			},
			crystal: 'hP',
			density: 13690,
			discovery: 1944,
			electronegativity: 1.13,
			modelColor: 'rgb(84, 92, 242)',
			prices: {
				1998: 728e3,
			},
			oxidation: [3],
			resistivity: 690e-9,
			rgb: 'rgb(255, 233, 224)',
			temperatures: {
				boil: 2880,
				melt: 1449,
			},
		},
	},
	{
		z: 96,
		name: 'Curium',
		symbol: 'Cm',
		mass: 247,
		period: 7,
		properties: {
			categories: {
				actinide: true,
			},
			crystal: 'hP',
			density: 13510,
			discovery: 1944,
			electronegativity: 1.28,
			modelColor: 'rgb(120, 92, 227)',
			oxidation: [3],
			/* prices: {
				2004: 185e6,
			}, */
			resistivity: 1.25e-6,
			rgb: 'rgb(255, 255, 216)',
			temperatures: {
				boil: 3383,
				melt: 1613,
			},
		},
	},
	{
		z: 97,
		name: 'Berkelium',
		symbol: 'Bk',
		mass: 247,
		period: 7,
		properties: {
			categories: {
				actinide: true,
			},
			crystal: 'hP',
			density: 14790,
			discovery: 1949,
			electronegativity: 1.3,
			modelColor: 'rgb(138, 79, 227)',
			oxidation: [3],
			/* prices: {
				2004: 185e9,
			}, */
			temperatures: {
				boil: 2900,
				melt: 1259,
			},
		},
	},
	{
		z: 98,
		name: 'Californium',
		symbol: 'Cf',
		mass: 251,
		period: 7,
		properties: {
			categories: {
				actinide: true,
			},
			crystal: 'hP',
			density: 15100,
			discovery: 1950,
			electronegativity: 1.3,
			modelColor: 'rgb(161, 54, 212)',
			oxidation: [3],
			/* prices: {
				2004: 906e9,
			}, */
			production: 0.275e-6,
			temperatures: {
				boil: 1743, // estimate
				melt: 1173,
			},
		},
	},
	{
		z: 99,
		name: 'Einsteinium',
		symbol: 'Es',
		mass: 252,
		period: 7,
		properties: {
			categories: {
				actinide: true,
			},
			crystal: 'cF',
			density: 8840,
			discovery: 1952,
			electronegativity: 1.3,
			modelColor: 'rgb(179, 31, 212)',
			oxidation: [3],
			temperatures: {
				boil: 1269, // estimate
				melt: 1133,
			},
		},
	},
	{
		z: 100,
		name: 'Fermium',
		symbol: 'Fm',
		mass: 257,
		period: 7,
		properties: {
			categories: {
				actinide: true,
			},
			crystal: 'cF',
			density: 9700,
			discovery: 1952,
			electronegativity: 1.3,
			modelColor: 'rgb(179, 31, 186)',
			oxidation: [3],
			temperatures: {
				melt: 1800, // predicted
			},
		},
	},
	{
		z: 101,
		name: 'Mendelevium',
		symbol: 'Md',
		mass: 258,
		period: 7,
		properties: {
			categories: {
				actinide: true,
			},
			crystal: 'cF',
			density: 10300,
			discovery: 1955,
			electronegativity: 1.3,
			modelColor: 'rgb(179, 13, 166)',
			oxidation: [3],
			temperatures: {
				melt: 1100, // predicted
			},
		},
	},
	{
		z: 102,
		name: 'Nobelium',
		symbol: 'No',
		mass: 259,
		period: 7,
		properties: {
			categories: {
				actinide: true,
			},
			crystal: 'cF',
			density: 9900,
			discovery: 1966,
			electronegativity: 1.3,
			modelColor: 'rgb(189, 13, 135)',
			oxidation: [2],
			temperatures: {
				melt: 1100, // predicted
			},
		},
	},
	{
		z: 103,
		name: 'Lawrencium',
		symbol: 'Lr',
		mass: 266,
		group: 3,
		period: 7,
		properties: {
			categories: {
				actinide: true,
			},
			crystal: 'hP',
			density: 14400,
			discovery: 1961,
			electronegativity: 1.3,
			modelColor: 'rgb(199, 0, 102)',
			oxidation: [3],
			temperatures: {
				melt: 1900, // predicted
			},
		},
	},
	{
		z: 104,
		name: 'Rutherfordium',
		symbol: 'Rf',
		mass: 267,
		group: 4,
		period: 7,
		properties: {
			crystal: 'hP',
			density: 17000,
			discovery: 1969,
			modelColor: 'rgb(204, 0, 89)',
			oxidation: [3, 4],
			temperatures: {
				boil: 5800, // predicted
				melt: 2400, // predicted
			},
		},
	},
	{
		z: 105,
		name: 'Dubnium',
		symbol: 'Db',
		mass: 268,
		group: 5,
		period: 7,
		properties: {
			crystal: 'cI',
			density: 21600,
			discovery: 1970,
			modelColor: 'rgb(209, 0, 79)',
			oxidation: [5],
		},
	},
	{
		z: 106,
		name: 'Seaborgium',
		symbol: 'Sg',
		mass: 269,
		group: 6,
		period: 7,
		properties: {
			crystal: 'cI',
			density: 23500,
			discovery: 1974,
			modelColor: 'rgb(217, 0, 69)',
			oxidation: [4, 6],
		},
	},
	{
		z: 107,
		name: 'Bohrium',
		symbol: 'Bh',
		mass: 278,
		group: 7,
		period: 7,
		properties: {
			crystal: 'hP',
			density: 26500,
			discovery: 1981,
			modelColor: 'rgb(224, 0, 56)',
			nobleMetal: 5,
			oxidation: [3, 4, 5, 7],
		},
	},
	{
		z: 108,
		name: 'Hassium',
		symbol: 'Hs',
		mass: 269,
		group: 8,
		period: 7,
		properties: {
			crystal: 'hP',
			density: 28000,
			discovery: 1984,
			modelColor: 'rgb(230, 0, 46)',
			nobleMetal: 5,
			oxidation: [3, 4, 8],
		},
	},
	{
		z: 109,
		name: 'Meitnerium',
		symbol: 'Mt',
		mass: 282,
		group: 9,
		period: 7,
		properties: {
			crystal: 'cF',
			density: 27500,
			discovery: 1982,
			modelColor: 'rgb(235, 0, 38)',
			nobleMetal: 5,
			oxidation: [1, 3, 6],
		},
	},
	{
		z: 110,
		name: 'Darmstadtium',
		symbol: 'Ds',
		mass: 281,
		group: 10,
		period: 7,
		properties: {
			crystal: 'cI',
			density: 26500,
			discovery: 1994,
			modelColor: 'rgb(239, 0, 29)', // extrapolation
			nobleMetal: 5,
			oxidation: [0, 2, 8],
		},
	},
	{
		z: 111,
		name: 'Roentgenium',
		symbol: 'Rg',
		mass: 286,
		group: 11,
		period: 7,
		properties: {
			crystal: 'cI',
			density: 23000,
			discovery: 1994,
			modelColor: 'rgb(242, 0, 19)', // extrapolation
			nobleMetal: 5,
			oxidation: [3],
		},
	},
	{
		z: 112,
		name: 'Copernicium',
		symbol: 'Cn',
		mass: 285,
		group: 12,
		period: 7,
		properties: {
			crystal: 'hP',
			density: 14000,
			discovery: 1996,
			modelColor: 'rgb(244, 0, 9)', // extrapolation
			nobleMetal: 5,
			oxidation: [0, 2],
			temperatures: {
				boil: 340, // predicted
				melt: 283, // predicted
			},
		},
	},
	{
		z: 113,
		name: 'Nihonium',
		symbol: 'Nh',
		mass: 286,
		group: 13,
		period: 7,
		properties: {
			crystal: 'hP',
			density: 16000,
			discovery: 2003,
			modelColor: 'rgb(166, 51, 39)', // extrapolation
			nobleMetal: 5,
			oxidation: [1, 3],
			temperatures: {
				boil: 1430, // predicted
				melt: 700, // predicted
			},
		},
	},
	{
		z: 114,
		name: 'Flerovium',
		symbol: 'Fl',
		mass: 290,
		group: 14,
		period: 7,
		properties: {
			crystal: 'cF', // https://en.wikipedia.org/wiki/Flerovium#Atomic_and_physical
			density: 11400,
			discovery: 1999,
			modelColor: 'rgb(62, 50, 66)', // extrapolation
			nobleMetal: 5,
			oxidation: [2],
			temperatures: {
				boil: 380, // predicted
				melt: 284, // predicted
			},
		},
	},
	{
		z: 115,
		name: 'Moscovium',
		symbol: 'Mc',
		mass: 290,
		group: 15,
		period: 7,
		properties: {
			categories: {
				pnictogen: true,
			},
			density: 13500,
			discovery: 2003,
			modelColor: 'rgb(158, 59, 181)', // extrapolation
			oxidation: [1, 3],
			temperatures: {
				boil: 1400, // predicted
				melt: 670, // predicted
			},
		},
	},
	{
		z: 116,
		name: 'Livermorium',
		symbol: 'Lv',
		mass: 294,
		group: 16,
		period: 7,
		properties: {
			categories: {
				chalcogen: true,
			},
			density: 12900,
			discovery: 2000,
			modelColor: 'rgb(130, 60, 0)', // extrapolation
			nobleMetal: 5,
			oxidation: [2],
			temperatures: {
				boil: 1085, // extrapolated
				melt: 708.5, // extrapolated
			},
		},
	},
	{
		z: 117,
		name: 'Tennessine',
		symbol: 'Ts',
		mass: 294,
		group: 17,
		period: 7,
		properties: {
			categories: {
				halogen: true,
			},
			density: 7200,
			discovery: 2009,
			modelColor: 'rgb(94, 63, 55)', // extrapolation
			oxidation: [1, 3],
			temperatures: {
				boil: 883, // predicted
				melt: 723, // predicted
			},
		},
	},
	{
		z: 118,
		name: 'Oganesson',
		symbol: 'Og',
		mass: 294,
		group: 18,
		period: 7,
		properties: {
			categories: {
				nobleGas: true,
			},
			crystal: 'cF',
			density: 7200,
			discovery: 2002,
			modelColor: 'rgb(66, 102, 124)', // extrapolation
			oxidation: [2, 4],
			temperatures: {
				boil: 450, // predicted
				melt: 325, // predicted
			},
		},
	},
	/* somehow this actually doesn't break the table!!! wow
	{
		z: 119,
		name: 'Ununennium',
		symbol: 'Uue',
		mass: 315, // predicted to be the most stable
		group: 1,
		period: 8,
		properties: {
			categories: {
				alkaliMetal: true,
			},
			crystal: 'cI',
			density: 3000,
			oxidation: [1],
			temperatures: {
				boil: 903, // predicted
				melt: 288, // predicted
			},
		},
	},
	{
		z: 120,
		name: 'Unbinilium',
		symbol: 'Ubn',
		mass: 317, // predicted to be the most stable
		group: 2,
		period: 8,
		properties: {
			categories: {
				aem: true,
			},
			crystal: 'cI',
			density: 7000,
			oxidation: [2],
			temperatures: {
				boil: 1973, // predicted
				melt: 953, // predicted
			},
		},
	},
	{
		z: 121,
		name: 'Unbiunium',
		symbol: 'Ubu',
		mass: 319, // predicted to be the most stable
		period: 8,
		properties: {
			categories: {
				superactinide: true,
			},
			oxidation: [3],
		},
	},
	{
		z: 122,
		name: 'Unbibium',
		symbol: 'Ubb',
		mass: 321, // predicted to be the most stable
		period: 8,
		properties: {
			categories: {
				superactinide: true,
			},
			oxidation: [4],
		},
	},
	{
		z: 123,
		name: 'Unbitrium',
		symbol: 'Ubt',
		mass: 321, // predicted to be the most stable
		period: 8,
	},
		properties: {
			categories: {
				superactinide: true,
			},
			oxidation: [5],
		},
	{
		z: 124,
		name: 'Unbiquadium',
		symbol: 'Ubq',
		mass: 323, // predicted to be the most stable
		period: 8,
	},
		properties: {
			categories: {
				superactinide: true,
			},
			oxidation: [6],
		},
	{
		z: 125,
		name: 'Unbipentium',
		symbol: 'Ubp',
		mass: 325, // predicted to be the most stable
		period: 8,
		properties: {
			categories: {
				superactinide: true,
			},
			oxidation: [7], // ???
		},
	},
	{
		z: 126,
		name: 'Unbihexium',
		symbol: 'Ubh',
		mass: 325, // predicted to be the most stable
		period: 8,
		properties: {
			categories: {
				superactinide: true,
			},
			oxidation: [4, 6, 8],
		},
	},
	{
		z: 139,
		name: 'Untriennium',
		symbol: 'Ute',
		mass: 343, // 10/7 z + 145
		period: 8,
	},
	{
		z: 153,
		name: 'Unpenttrium',
		symbol: 'Upt',
		mass: 365, // 10/7 z + 145
		group: 3,
		period: 8,
	},
	*/
];