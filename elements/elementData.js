/* eslint-disable max-len */
/* exported elementData, isotopeData, nobleMetalColors, nucleosynthesisColors, nutritionColors,
	minute, hour, day, year */
'use strict';
// modelColor from https://sciencenotes.org/wp-content/uploads/2019/07/CPK-Jmol-1024x791.png
// abundances from https://periodictable.com/Properties/A/UniverseAbundance.an.log.html
// also https://periodictable.com/Properties/A/UniverseAbundance.html
// metal prices from https://www.dailymetalprice.com/ and https://www.metalary.com
// other prices from https://en.wikipedia.org/wiki/Prices_of_chemical_elements
// detailed platinum group metal price history https://matthey.com/products-and-markets/pgms-and-circularity/pgm-management
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
// also used: CRC 97th ed.
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
const nutritionColors = ['#060', '#0b0', '#7f0', '#eb3', '#dd9'];

// also used in isotopeData.js
const minute = 60;
const hour = 60 * minute;
const day = 24 * hour;
const year = 365.2425 * day;
const month = year / 12;
// used for metal prices
const pound = 0.45359237;
const ounce = pound/16;

/// kg
const human_weight = 60;
/// I assume 1000x recommended intake is GIGABAD
const over_nutrition = 1000;
/// in m^3: derived from 6-8 L per minute
const minute_of_breathing = 7 / 1000;
const workday_of_breathing = 8 * 60 * minute_of_breathing;

/**
 * Thought process behind this:
 * The median lethal dose (LD50) for acute radiation exposure is about 4.5 Sv.
 * The committed effective dose equivalent 210Po is 0.51 μSv/Bq if ingested, and 2.5 μSv/Bq if inhaled.
 * A fatal 4.5 Sv dose can be caused by ingesting 8.8 MBq (240 μCi), about 50 nanograms (ng), or inhaling 1.8 MBq (49 μCi), about 10 ng.
 * Po-210 has a half-life of 138.376 d, and decays exclusively by alpha decay.
 * Therefore, I can roughly approximate the LD50 of a radioactive element by taking the ratio of HL's.
 * This is probably not accurate for HL > 1000 yr (100?), so don't use it on elements with a longer HL...
 * @param {number} hl half-life, in seconds
 */
function ld50_radiation(hl){
	const hl_po210 = 138.376 * day;
	return hl / hl_po210 * 50e-12 / human_weight;
}

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
			appearance: 'colorless',
			biologicalHalfLife: 12*day, // tritium; http://hyperphysics.phy-astr.gsu.edu/hbase/Nuclear/biohalf.html
			categories: {
				reactiveNonmetal: true,
				rockForming: 0.5,
			},
			covalentRadius: 25e-12,
			crystal: 'hP',
			density: 0.08988,
			discovery: 1500,
			electronAffinity: 73e3,
			electronegativity: 2.2,
			ionization: [1312e3],
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
			radius: {
				covalent: 31e-12,
				vanDerWaals: 120e-12,
			},
			speedOfSound: 1310,
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
			appearance: 'colorless',
			categories: {
				nobleGas: true,
			},
			covalentRadius: 28e-12,
			crystal: 'hP',
			density: 0.1785,
			discovery: 1895,
			electronAffinity: -50e3,
			ionization: [2372.3e3, 5230.5e3],
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
			radius: {
				covalent: 28e-12,
				vanDerWaals: 140e-12,
			},
			speedOfSound: 972,
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
			appearance: 'silvery white',
			bulkModulus: 11e9,
			categories: {
				alkaliMetal: true,
				tech: true,
			},
			covalentRadius: 145e-12,
			crystal: 'cI',
			density: 534,
			discovery: 1821,
			electronAffinity: 60e3,
			electronegativity: 0.98,
			ionization: [520.2e3, 7298.1e3, 11815e3],
			modelColor: 'rgb(204, 128, 255)',
			nucleosynthesis: {
				bigBang: 0.23,
				spallation: 0.13,
				sProcess: 0.64,
			},
			nutrition: 3,
			oxidation: [1],
			prices: {
				2026: 17.108, // 5 Jan 2026
				2022: 79.42,
				2020: 83.5,
				2018: 16.5,
			},
			production: 55e3,
			radius: {
				atomic: 152e-12,
				covalent: 128e-12,
				vanDerWaals: 182e-12,
			},
			resistivity: 92.8e-9,
			speedOfSound: 6000,
			temperatures: {
				boil: 1560,
				melt: 453.69,
			},
			youngsModulus: 4.9e9,
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
			appearance: 'white grey metallic',
			bulkModulus: 130e9,
			categories: {
				aem: true,
				preciousMetal: 0.5,
				tech: 0.5,
			},
			covalentRadius: 105e-12,
			crystal: 'hP',
			density: 1850,
			discovery: 1828,
			electronAffinity: -50e3,
			electronegativity: 1.57,
			ionization: [899.5e3, 1757.1e3, 14848.70e3, 21006.60e3],
			modelColor: 'rgb(194, 255, 0)',
			nucleosynthesis: {
				spallation: 1,
			},
			oxidation: [2],
			prices: {
				2021: 610,
				2020: 857,
			},
			production: 200,
			radius: {
				atomic: 112e-12,
				covalent: 96e-12,
				vanDerWaals: 153e-12,
			},
			resistivity: 36e-9,
			speedOfSound: 12890,
			temperatures: {
				boil: 2742,
				melt: 1560,
			},
			youngsModulus: 287e9,
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
			appearance: 'black brown',
			bulkModulus: 320e9, // https://periodictable.com/Properties/A/BulkModulus.al.html
			categories: {
				metalloid: true,
				tech: 0.5,
			},
			covalentRadius: 85e-12,
			crystal: 'hR',
			density: 2340,
			discovery: 1808,
			electronAffinity: 27e3,
			electronegativity: 2.04,
			ionization: [800.6e3, 2427.1e3, 3659.7e3, 25025.80e3, 32826.70e3],
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
			radius: {
				atomic: 90e-12,
				covalent: 84e-12,
				vanDerWaals: 192e-12,
			},
			resistivity: 1e6,
			speedOfSound: 16200,
			temperatures: {
				boil: 4200,
				melt: 2349,
			},
			toxicity: 6e-3, // LD50
			youngsModulus: 710.4e9, // "The Poisson's ratio of boron fibers is 0.13"
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
			// try to stick to graphite if possible since diamond is technically only metastable at stp
			abundance: {
				earth: 1.6e-3,
				human: 0.12,
				universe: 4600e-6,
			},
			appearance: 'black',
			biologicalHalfLife: 40*day, // C-14; http://hyperphysics.phy-astr.gsu.edu/hbase/Nuclear/biohalf.html
			bulkModulus: 33e9, // diamond is 442; graphite is 33 https://periodictable.com/Properties/A/BulkModulus.al.html
			categories: {
				coinageMetal: 0.5, // various russian coins
				reactiveNonmetal: true,
				rockForming: 0.5,
			},
			covalentRadius: 70e-12,
			crystal: 'hP', // graphite
			density: 2267, // graphite
			discovery: -3750,
			electronAffinity: 122e3,
			electronegativity: 2.55,
			ionization: [1086.5e3, 2352.6e3, 4620.5e3, 6222.7e3, 37831e3, 47277e3],
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
			radius: {
				covalent: (77e-12 + 73e-12 + 69e-12)/3,
				vanDerWaals: 170e-12,
			},
			resistivity: 7.837e-6, // graphite
			speedOfSound: 1470, // graphite
			temperatures: {
				boil: 3915,
				melt: 3915,
			},
			youngsModulus: 11.5e9, // diamond is 1050; graphite is 11.5 https://material-properties.org/graphite-density-strength-hardness-melting-point/
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
			appearance: 'colorless',
			categories: {
				pnictogen: true,
				reactiveNonmetal: true,
			},
			covalentRadius: 65e-12,
			crystal: 'hP',
			density: 1.2506,
			discovery: 1772,
			electronAffinity: -7e3,
			electronegativity: 3.04,
			ionization: [1402.3e3, 2856e3, 4578.1e3, 7475e3, 9444.9e3, 53266.60e3, 64360e3],
			modelColor: 'rgb(48, 80, 248)',
			nucleosynthesis: {
				cnoCycle: 1,
			},
			nutrition: 0,
			oxidation: [-3, 3, 5],
			prices: {
				2013: 2.77,
				2001: 0.14,
			},
			production: 131e6,
			radius: {
				covalent: 71e-12,
				vanDerWaals: 155e-12,
			},
			speedOfSound: 353,
			temperatures: {
				boil: 77.36,
				melt: 63.15,
			},
			youngsModulus: 208414.062, // asymptotic Poisson's ratio derived from https://www.arcjournals.org/pdfs/ijarps/v4-i5/3.pdf
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
			appearance: 'colorless',
			categories: {
				chalcogen: true,
				reactiveNonmetal: true,
				rockForming: true,
			},
			covalentRadius: 60e-12,
			crystal: 'tP',
			density: 1.429,
			discovery: 1604,
			electronAffinity: 141e3,
			electronegativity: 3.44,
			ionization: [1313.9e3, 3388.3e3, 5300.5e3, 7469.2e3, 10989.50e3, 13326.50e3, 71330e3, 84078e3],
			modelColor: 'rgb(255, 13, 13)',
			nucleosynthesis: {
				alphaProcess: 0.9996, // O-16, O-18
				cnoCycle: 0.0004, // O-17
			},
			nutrition: 0,
			oxidation: [-2],
			prices: {
				2013: 0.64,
				2001: 0.154,
			},
			production: 100e6,
			radius: {
				covalent: 66e-12,
				vanDerWaals: 152e-12,
			},
			speedOfSound: 330,
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
			appearance: 'pale yellow',
			biologicalHalfLife: 450*day, // personal estimate; 2.6 g fluorine per person, 4 mg/day per person
			categories: {
				halogen: true,
				reactiveNonmetal: true,
				rockForming: 0.5,
			},
			covalentRadius: 50e-12,
			crystal: 'tP',
			density: 1.696,
			discovery: 1886,
			electronAffinity: 328e3,
			electronegativity: 3.98,
			ionization: [1681e3, 3374.2e3, 6050.4e3, 8407.7e3, 11022.70e3, 15164.10e3, 17868e3, 92038.10e3, 106434.30e3],
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
			radius: {
				covalent: 64e-12,
				vanDerWaals: 135e-12,
			},
			speedOfSound: 332,
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
			appearance: 'colorless',
			categories: {
				nobleGas: true,
			},
			covalentRadius: 58e-12,
			crystal: 'cF',
			density: 0.8999,
			discovery: 1898,
			electronAffinity: -120e3,
			ionization: [2080.7e3, 3952.3e3, 6122e3, 9371e3, 12177e3, 15238.90e3, 19999e3, 23069.50e3, 115379.50e3, 131432e3],
			modelColor: 'rgb(179, 227, 245)',
			nucleosynthesis: {
				carbonBurningProcess: 0.9075, // Ne-20, Ne-21
				alphaProcess: 0.0925, // Ne-22
			},
			oxidation: [0],
			prices: {
				2016: 629.9,
				1999: 240,
			},
			production: 500,
			radius: {
				covalent: 58e-12,
				vanDerWaals: 154e-12,
			},
			speedOfSound: 435,
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
			appearance: 'silvery white metallic',
			biologicalHalfLife: 69*day, // personal estimate; 100 g sodium per person, 1 mg/day per person
			bulkModulus: 6.3e9,
			// 11 d according to http://hyperphysics.phy-astr.gsu.edu/hbase/Nuclear/biohalf.html
			categories: {
				alkaliMetal: true,
				rockForming: true,
			},
			covalentRadius: 180e-12,
			crystal: 'cI',
			density: 971,
			discovery: 1807,
			electronAffinity: 53e3,
			electronegativity: 0.93,
			ionization: [495.8e3, 4562e3, 6910.3e3, 9543e3, 13354e3, 16613e3, 20117e3, 25496e3, 28932e3, 141362e3, 159076e3],
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
			radius: {
				atomic: 186e-12,
				covalent: 166e-12,
				vanDerWaals: 227e-12,
			},
			resistivity: 47.7e-9,
			speedOfSound: 3200,
			temperatures: {
				boil: 1156,
				melt: 370.87,
			},
			toxicity: 2.3e-3 / human_weight * over_nutrition, // double the daily intake, a wild guess. (see <https://en.wikipedia.org/wiki/Hypernatremia>)
			youngsModulus: 10e9,
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
			appearance: 'shiny grey',
			biologicalHalfLife: 44*day, // personal estimate; 19 g magnesium per person, 300 mg/day per person
			bulkModulus: 35.4e9,
			categories: {
				aem: true,
				rockForming: true,
				tech: 0.5,
			},
			covalentRadius: 150e-12,
			crystal: 'hP',
			density: 1738,
			discovery: 1808,
			electronAffinity: -40e3,
			electronegativity: 1.31,
			ionization: [737.7e3, 1450.7e3, 7732.7e3, 10542.50e3, 13630e3, 18020e3, 21711e3, 25661e3, 31653e3, 35458e3, 169988e3, 189368e3],
			modelColor: 'rgb(138, 255, 0)',
			nucleosynthesis: {
				alphaProcess: 0.79, // Mg-24
				neonBurningProcess: 0.21, // Mg-25, Mg-26
			},
			nutrition: 1,
			oxidation: [2],
			prices: {
				2022: 3.27,
				2019: 2.32,
			},
			production: 748e3,
			radius: {
				atomic: 160e-12,
				covalent: 141e-12,
				vanDerWaals: 173e-12,
			},
			resistivity: 43.9e-9,
			speedOfSound: 4940,
			temperatures: {
				boil: 1363,
				melt: 923,
			},
			toxicity: 0.42e-3 / human_weight * over_nutrition, // double the daily intake, a wild guess. (see <https://en.wikipedia.org/wiki/Hypermagnesemia>)
			youngsModulus: 45e9,
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
			appearance: 'silvery grey metallic',
			bulkModulus: 76e9,
			categories: {
				coinageMetal: 0.5, // 1 yen coin
				df: true,
				nativeMetal: 0.5,
				rockForming: true,
			},
			covalentRadius: 125e-12,
			crystal: 'cF',
			density: 2698,
			discovery: 1825,
			electronAffinity: 42e3,
			electronegativity: 1.61,
			ionization: [577.5e3, 1816.7e3, 2744.8e3, 11577e3, 14842e3, 18379e3, 23326e3, 27465e3, 31853e3, 38473e3, 42647e3, 201266e3, 222316e3],
			modelColor: 'rgb(191, 166, 166)',
			nucleosynthesis: {
				neonBurningProcess: 1,
			},
			nutrition: 4,
			oxidation: [3],
			prices: {
				2026: 3.0231, // 2 Jan 2026
				2022: 1.078/pound,
				2021: 0.975/pound,
				2019: 1.79,
			},
			production: 44.1e6,
			radius: {
				atomic: 143e-12,
				covalent: 121e-12,
				vanDerWaals: 184e-12,
			},
			resistivity: 26.5e-9,
			speedOfSound: 5000,
			temperatures: {
				boil: 2792,
				melt: 933.47,
			},
			youngsModulus: 70e9,
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
			appearance: 'bluish metallic',
			bulkModulus: 97.6e9,
			categories: {
				metalloid: true,
				rockForming: true,
				tech: 0.5,
			},
			covalentRadius: 110e-12,
			crystal: 'cF',
			density: 2329.6,
			discovery: 1823,
			electronAffinity: 134e3,
			electronegativity: 1.9,
			ionization: [786.5e3, 1577.1e3, 3231.6e3, 4355.5e3, 16091e3, 19805e3, 23780e3, 29287e3, 33878e3, 38726e3, 45962e3, 50502e3, 235196e3, 257923e3],
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
			radius: {
				atomic: 111e-12,
				covalent: 111e-12,
				vanDerWaals: 210e-12,
			},
			resistivity: 2.3e3,
			speedOfSound: 8433,
			temperatures: {
				boil: 3538,
				melt: 1687,
			},
			youngsModulus: (130e9 + 188e9)/2,
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
			appearance: 'white',
			biologicalHalfLife: 932*day, // personal estimate; 780 g phosphorus per person, 580 mg/day per person
			bulkModulus: 5e9, // white
			categories: {
				pnictogen: true,
				reactiveNonmetal: true,
				rockForming: 0.5,
			},
			covalentRadius: 100e-12,
			crystal: 'cI',
			// 1155 d according to http://hyperphysics.phy-astr.gsu.edu/hbase/Nuclear/biohalf.html
			density: 1820,
			discovery: 1669,
			electronAffinity: 72e3,
			electronegativity: 2.19,
			ionization: [1011.8e3, 1907e3, 2914.1e3, 4963.6e3, 6273.9e3, 21267e3, 25431e3, 29872e3, 35905e3, 40950e3, 46261e3, 54110e3, 59024e3, 271791e3, 296195e3],
			modelColor: 'rgb(255, 128, 0)',
			nucleosynthesis: {
				neonBurningProcess: 1,
			},
			nutrition: 0,
			oxidation: [-3, 3, 5],
			prices: {
				2019: 2.69,
			},
			production: 910e3,
			radius: {
				covalent: 107e-12,
				vanDerWaals: 180e-12,
			},
			resistivity: 1e-7, // https://periodictable.com/Elements/015/data.html
			temperatures: {
				boil: 550,
				melt: 317.3,
			},
			toxicity: 1.25e-3 / human_weight * over_nutrition, // double the daily intake, a wild guess. (see <https://en.wikipedia.org/wiki/Hyperphosphatemia>)
			youngsModulus: 6e9, // based on data from https://arxiv.org/pdf/1211.3512.pdf => v = 0.3 for black
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
			appearance: 'yellow',
			biologicalHalfLife: 90*day, // S-35; http://hyperphysics.phy-astr.gsu.edu/hbase/Nuclear/biohalf.html
			bulkModulus: 7.7e9,
			categories: {
				chalcogen: true,
				reactiveNonmetal: true,
				rockForming: 0.5,
			},
			covalentRadius: 100e-12,
			crystal: 'oP',
			density: 2067,
			discovery: -2000,
			electronAffinity: 200e3,
			electronegativity: 2.58,
			ionization: [999.6e3, 2252e3, 3357e3, 4556e3, 7004.3e3, 8495.8e3, 27107e3, 31719e3, 36621e3, 43177e3, 48710e3, 54460e3, 62930e3, 68216e3, 311048e3, 337138e3],
			modelColor: 'rgb(255, 255, 48)',
			nucleosynthesis: { // best guess
				oxygenBurningProcess: 0.9924,
				alphaProcess: 0.0034,
			},
			nutrition: 0,
			oxidation: [-2, 2, 4, 6],
			prices: {
				2019: 0.0926,
			},
			production: 69e6,
			radius: {
				covalent: 105e-12,
				vanDerWaals: 180e-12,
			},
			resistivity: 1e15,
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
			appearance: 'pale yellow green',
			biologicalHalfLife: 29*day, // Cl-36; http://hyperphysics.phy-astr.gsu.edu/hbase/Nuclear/biohalf.html
			categories: {
				halogen: true,
				reactiveNonmetal: true,
				rockForming: 0.5,
			},
			covalentRadius: 100e-12,
			crystal: 'oP',
			density: 3.214,
			discovery: 1774,
			electronAffinity: 349e3,
			electronegativity: 3.16,
			ionization: [1251.2e3, 2298e3, 3822e3, 5158.6e3, 6542e3, 9362e3, 11018e3, 33604e3, 38600e3, 43961e3, 51068e3, 57119e3, 63363e3, 72341e3, 78095e3, 352994e3, 380760e3],
			modelColor: 'rgb(31, 240, 31)',
			nucleosynthesis: {
				rpProcess: 1, // "explosive nucleosynthesis"
			},
			nutrition: 1,
			oxidation: [-1, 1, 3, 5, 7],
			prices: {
				2013: 0.082,
			},
			radius: {
				covalent: 102e-12,
				vanDerWaals: 175e-12,
			},
			speedOfSound: 206,
			temperatures: {
				boil: 239.11,
				melt: 171.6,
			},
			toxicity: 2.3e-3 / human_weight * over_nutrition, // double the daily intake, a wild guess. (see <https://en.wikipedia.org/wiki/Hypernatremia>)
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
			appearance: 'colorless',
			categories: {
				nobleGas: true,
			},
			covalentRadius: 106e-12,
			crystal: 'cF',
			density: 1.7837,
			discovery: 1894,
			electronAffinity: -96e3,
			ionization: [1520.6e3, 2665.8e3, 3931e3, 5771e3, 7238e3, 8781e3, 11995e3, 13842e3, 40760e3, 46186e3, 52002e3, 59653e3, 66199e3, 72918e3, 82473e3, 88576e3, 397605e3, 427066e3],
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
			radius: {
				covalent: 106e-12,
				vanDerWaals: 188e-12,
			},
			speedOfSound: 323,
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
			appearance: 'silvery white',
			biologicalHalfLife: 20*day, // personal estimate; 140 g potassium per person, 4.7 mg/day per person
			bulkModulus: 3.1e9,
			categories: {
				alkaliMetal: true,
				rockForming: true,
			},
			covalentRadius: 220e-12,
			crystal: 'cI',
			density: 862,
			discovery: 1807,
			electronAffinity: 48e3,
			electronegativity: 0.82,
			ionization: [418.8e3, 3052e3, 4420e3, 5877e3, 7975e3, 9590e3, 11343e3, 14944e3, 16963.70e3, 48610e3, 54490e3, 60730e3, 68950e3, 75900e3, 83080e3, 93400e3, 99710e3, 444880e3, 476063e3],
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
			radius: {
				atomic: 227e-12,
				covalent: 203e-12,
				vanDerWaals: 275e-12,
			},
			resistivity: 72e-9,
			speedOfSound: 2000,
			temperatures: {
				boil: 1032,
				melt: 336.53,
			},
			toxicity: 4.7e-3 / human_weight * over_nutrition, // double the daily intake, a wild guess. (see <https://en.wikipedia.org/wiki/Hyperkalemia>)
			youngsModulus: 3.53e9,
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
			appearance: 'dull grey',
			biologicalHalfLife: 693*day, // personal estimate; 1kg calcium per person, 1 g/day per person
			bulkModulus: 17e9,
			categories: {
				aem: true,
				rockForming: true,
			},
			covalentRadius: 180e-12,
			crystal: 'cF',
			density: 1540,
			discovery: 1808,
			electronAffinity: 2e3,
			electronegativity: 1,
			ionization: [589.8e3, 1145.4e3, 4912.4e3, 6491e3, 8153e3, 10496e3, 12270e3, 14206e3, 18191e3, 20385e3, 57110e3, 63410e3, 70110e3, 78890e3, 86310e3, 94000e3, 104900e3, 111711e3, 494850e3, 527762e3],
			modelColor: 'rgb(61, 255, 0)',
			nucleosynthesis: {
				alphaProcess: 1,
			},
			nutrition: 1,
			oxidation: [2],
			prices: {
				2020: 2.28,
			},
			radius: {
				atomic: 197e-12,
				covalent: 176e-12,
				vanDerWaals: 231e-12,
			},
			resistivity: 33.6e-9,
			speedOfSound: 3810,
			temperatures: {
				boil: 1757,
				melt: 1115,
			},
			toxicity: 1.3e-3 / human_weight * over_nutrition, // double the daily intake, a wild guess. (see <https://en.wikipedia.org/wiki/Hypercalcaemia>)
			youngsModulus: 20e9,
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
			appearance: 'silvery white',
			bulkModulus: 56.6e9,
			categories: {
				rem: true,
				tech: true,
			},
			covalentRadius: 160e-12,
			crystal: 'hP',
			density: 2989,
			discovery: 1879,
			electronAffinity: 18e3,
			electronegativity: 1.36,
			ionization: [633.1e3, 1235e3, 2388.6e3, 7090.6e3, 8843e3, 10679e3, 13310e3, 15250e3, 17370e3, 21726e3, 24102e3, 66320e3, 73010e3, 80160e3, 89490e3, 97400e3, 105600e3, 117000e3, 124270e3, 547530e3, 582163e3],
			modelColor: 'rgb(230, 230, 230)',
			nucleosynthesis: {
				rpProcess: 1, // guess
			},
			oxidation: [3],
			prices: {
				2020: 3460,
			},
			production: 2,
			radius: {
				atomic: 162e-12,
				covalent: 170e-12,
				vanDerWaals: 211e-12,
			},
			resistivity: 562e-9,
			temperatures: {
				boil: 3109,
				melt: 1814,
			},
			toxicity: 4e-3, // LD50, oral, rat
			youngsModulus: 74.4e9,
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
			appearance: 'silvery grey white metallic',
			bulkModulus: 110e9,
			categories: {
				nativeMetal: 0.5,
				refractoryMetal: 0.5,
				rockForming: 0.5,
				tech: 0.5,
			},
			covalentRadius: 140e-12,
			crystal: 'hP',
			density: 4540,
			discovery: 1825,
			electronAffinity: 7e3,
			electronegativity: 1.54,
			ionization: [658.8e3, 1309.8e3, 2652.5e3, 4174.6e3, 9581e3, 11533e3, 13590e3, 16440e3, 18530e3, 20833e3, 25575e3, 28125e3, 76015e3, 83280e3, 90880e3, 100700e3, 109100e3, 117800e3, 129900e3, 137530e3, 602930e3, 639294e3],
			modelColor: 'rgb(191, 194, 199)',
			nobleMetal: 0,
			nucleosynthesis: {
				alphaProcess: 1,
			},
			nutrition: 4,
			oxidation: [2, 3, 4],
			prices: {
				2022: 9,
				2020: 11.4,
				2018: 4.8,
			},
			production: 6.7e6,
			radius: {
				atomic: 147e-12,
				covalent: 160e-12,
			},
			resistivity: 420e-9,
			speedOfSound: 5090,
			temperatures: {
				boil: 3560,
				melt: 1941,
			},
			toxicity: 0.8e-6 / human_weight * over_nutrition, // "titanium is non-toxic even in large doses ... people consume an average of 0.8 mg / day"
			youngsModulus: 116e9,
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
			appearance: 'blue silvery grey metallic',
			bulkModulus: 160e9,
			categories: {
				nativeMetal: 0.5,
				refractoryMetal: 0.5,
				tech: 0.5,
			},
			covalentRadius: 135e-12,
			crystal: 'cI',
			density: 6110,
			discovery: 1867,
			electronAffinity: 51e3,
			electronegativity: 1.63,
			ionization: [650.9e3, 1414e3, 2830e3, 4507e3, 6298.7e3, 12363e3, 14530e3, 16730e3, 19860e3, 22240e3, 24670e3, 29730e3, 32446e3, 86450e3, 94170e3, 102300e3, 112700e3, 121600e3, 130700e3, 143400e3, 151440e3, 661050e3, 699144e3],
			modelColor: 'rgb(166, 166, 171)',
			nobleMetal: 0,
			nucleosynthesis: {
				rpProcess: 1, // guess
			},
			nutrition: 3,
			oxidation: [2, 3, 4, 5],
			prices: {
				2021: 34.27,
				2020: 371,
			},
			production: 73e6, // https://pubs.usgs.gov/periodicals/mcs2020/mcs2020-vanadium.pdf
			radius: {
				atomic: 134e-12,
				covalent: 153e-12,
			},
			resistivity: 197e-9,
			speedOfSound: 4560,
			temperatures: {
				boil: 3680,
				melt: 2183,
			},
			toxicity: 12e-9 / human_weight * over_nutrition, // double the daily intake, a wild guess. (see <https://en.wikipedia.org/wiki/Zinc_toxicity>)
			youngsModulus: 128e9,
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
			appearance: 'silvery metallic',
			biologicalHalfLife: 320*day, // personal estimate; 14 mg chromium per person, 0.03 mg/day per person
			bulkModulus: 160e9,
			categories: {
				ironGroup: 0.5,
				nativeMetal: 0.5,
				refractoryMetal: 0.5,
				tech: 0.5,
			},
			covalentRadius: 140e-12,
			crystal: 'cI',
			density: 7150,
			discovery: 1797,
			electronAffinity: 65e3,
			electronConfiguration: '[Ar] 3d5 4s1',
			electronegativity: 1.66,
			ionization: [652.9e3, 1590.6e3, 2987e3, 4743e3, 6702e3, 8744.9e3, 15455e3, 17820e3, 20190e3, 23580e3, 26130e3, 28750e3, 34230e3, 37066e3, 97510e3, 105800e3, 114300e3, 125300e3, 134700e3, 144300e3, 157700e3, 166090e3, 721870e3, 761733e3],
			modelColor: 'rgb(138, 153, 199)',
			nobleMetal: 0,
			nucleosynthesis: {
				alphaProcess: 1,
			},
			oxidation: [2, 3, 6],
			prices: {
				2021: 5.65/pound,
				2019: 9.4,
			},
			production: 4.4e6,
			radius: {
				atomic: 128e-12,
				covalent: 139e-12,
			},
			resistivity: 125e-9,
			speedOfSound: 5940,
			temperatures: {
				boil: 2944,
				melt: 2180,
			},
			toxicity: 50e-6, // Chromium(VI) human, min est. LD50
			youngsModulus: 279e9,
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
			appearance: 'silvery metallic',
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
			covalentRadius: 140e-12,
			crystal: 'cI',
			density: 7440,
			discovery: 1774,
			electronAffinity: -50e3,
			electronegativity: 1.55,
			ionization: [717.3e3, 1509e3, 3248e3, 4940e3, 6990e3, 9220e3, 11500e3, 18770e3, 21400e3, 23960e3, 27590e3, 30330e3, 33150e3, 38880e3, 41987e3, 109480e3, 118100e3, 127100e3, 138600e3, 148500e3, 158600e3, 172500e3, 181380e3, 785450e3, 827067e3],
			modelColor: 'rgb(156, 122, 199)',
			nucleosynthesis: {
				rpProcess: 1, // guess
			},
			nutrition: 2,
			oxidation: [2, 3, 4, 6, 7],
			prices: {
				2021: 3.92875,
				2019: 1.82,
				2018: 2.06,
			},
			production: 19e6, // https://pubs.usgs.gov/periodicals/mcs2020/mcs2020-manganese.pdf
			radius: {
				atomic: 127e-12,
				covalent: (139e-12 + 161e-12)/2,
			},
			resistivity: 1.44e-6,
			speedOfSound: 5150,
			temperatures: {
				boil: 2334,
				melt: 1519,
			},
			toxicity: 2.3e-6 / human_weight * over_nutrition, // double the daily intake, a wild guess. (see <https://en.wikipedia.org/wiki/Zinc_toxicity>)
			youngsModulus: 198e9,
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
			appearance: 'grey metallic',
			biologicalHalfLife: 485*day, // personal estimate; 4.2g iron per person, 6 mg/day per person; 0.5^(1/L) = 1 - 0.006/4.2
			bulkModulus: 170e9,
			categories: {
				coinageMetal: 0.5, // various russian coins
				df: true,
				ironGroup: true,
				nativeMetal: 0.5,
				rockForming: true,
			},
			covalentRadius: 140e-12,
			crystal: 'cI',
			density: 7874,
			discovery: -5000,
			electronAffinity: 15e3,
			electronegativity: 1.83,
			ionization: [762.5e3, 1561.9e3, 2957e3, 5290e3, 7240e3, 9560e3, 12060e3, 14580e3, 22540e3, 25290e3, 28000e3, 31920e3, 34830e3, 37840e3, 44100e3, 47206e3, 122200e3, 131000e3, 140500e3, 152600e3, 163000e3, 173600e3, 188100e3, 195200e3, 851800e3, 895161e3],
			modelColor: 'rgb(224, 102, 51)',
			nucleosynthesis: {
				alphaProcess: 1,
			},
			nutrition: 2,
			oxidation: [2, 3],
			prices: {
				2026: 0.1072, // 2 Jan 2026
				2022: 0.1099,
				2021: 164.41/1000,
				2020: 0.424,
			},
			production: 1544e6,
			radius: {
				atomic: 126e-12,
				covalent: 142e-12,
				vanDerWaals: 194e-12,
			},
			resistivity: 96.1e-9,
			speedOfSound: 5120,
			temperatures: {
				boil: 3134,
				melt: 1811,
			},
			toxicity: 50e-6, // "Ingestions of more than 50 mg/kg of elemental iron are associated with severe toxicity"
			youngsModulus: 211e9,
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
			appearance: 'blue grey metallic',
			biologicalHalfLife: 10*day, // Co-60; http://hyperphysics.phy-astr.gsu.edu/hbase/Nuclear/biohalf.html
			bulkModulus: 180e9,
			categories: {
				ironGroup: true,
				nativeMetal: 0.5,
				tech: true,
			},
			covalentRadius: 135e-12,
			crystal: 'hP',
			density: 8860,
			discovery: 1735,
			electronAffinity: 64e3,
			electronegativity: 1.88,
			ionization: [760.4e3, 1648e3, 3232e3, 4950e3, 7670e3, 9840e3, 12440e3, 15230e3, 17959e3, 26570e3, 29400e3, 32400e3, 36600e3, 39700e3, 42800e3, 49396e3, 52737e3, 134810e3, 145170e3, 154700e3, 167400e3, 178100e3, 189300e3, 204500e3, 214100e3, 920870e3, 966023e3],
			modelColor: 'rgb(240, 144, 160)',
			nucleosynthesis: {
				rpProcess: 1, // guess
			},
			nutrition: 2,
			oxidation: [2, 3],
			prices: {
				2026: 53.355, // 2 Jan 2026
				2022: 23.566/pound,
				2021: 25.18/pound,
				2019: 32.8,
			},
			production: 140e3, // https://pubs.usgs.gov/periodicals/mcs2020/mcs2020-cobalt.pdf
			radius: {
				atomic: 125e-12,
				covalent: (126e-12 + 150e-12)/2,
			},
			resistivity: 62.4e-9,
			speedOfSound: 4720,
			temperatures: {
				boil: 3200,
				melt: 1768,
			},
			toxicity: 325e-6, // The LD50 value for soluble cobalt salts has been estimated to be between 150 and 500 mg/kg
			youngsModulus: 209e9,
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
			appearance: 'gold silvery grey metallic',
			bulkModulus: 180e9,
			categories: {
				coinageMetal: 0.5, // us coins
				df: true,
				ironGroup: true,
				nativeMetal: 0.5,
				tech: 0.5,
			},
			covalentRadius: 135e-12,
			crystal: 'cF',
			density: 8912,
			discovery: 1751,
			electronAffinity: 112e3,
			electronegativity: 1.91,
			ionization: [737.1e3, 1753e3, 3395e3, 5300e3, 7339e3, 10400e3, 12800e3, 15600e3, 18600e3, 21670e3, 30970e3, 34000e3, 37100e3, 41500e3, 44800e3, 48100e3, 55101e3, 58570e3, 148700e3, 159000e3, 169400e3, 182700e3, 194000e3, 205600e3, 221400e3, 231490e3, 992718e3, 1039668e3],
			modelColor: 'rgb(80, 208, 80)',
			nucleosynthesis: {
				alphaProcess: 1,
			},
			nutrition: 3,
			oxidation: [2],
			prices: {
				2026: 16.750, // 1 Jan 2026
				2022: 12.28/pound,
				2021: 7.2756/pound,
				2019: 13.9,
				2017: 0.31/ounce,
				2007: 1.47/ounce,
			},
			production: 1.8e6,
			radius: {
				atomic: 124e-12,
				covalent: 124e-12,
				vanDerWaals: 163e-12,
			},
			resistivity: 69.3e-9,
			speedOfSound: 4900,
			temperatures: {
				boil: 3186,
				melt: 1728,
			},
			toxicity: 1e-3 / human_weight * over_nutrition, // tolerable upper intake
			youngsModulus: 200e9,
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
			appearance: 'red orange metallic',
			biologicalHalfLife: 55*day, // personal estimate; 72 mg copper per person, 0.9 mg/day per person
			bulkModulus: 140e9,
			categories: {
				coinageMetal: true,
				df: true,
				nativeMetal: true,
				nobleMetal: 0.5,
				tech: 0.5,
			},
			covalentRadius: 135e-12,
			crystal: 'cF',
			density: 8960,
			discovery: -9000,
			electronAffinity: 119e3,
			electronConfiguration: '[Ar] 3d10 4s1',
			electronegativity: 1.9,
			ionization: [745.5e3, 1957.9e3, 3555e3, 5536e3, 7700e3, 9900e3, 13400e3, 16000e3, 19200e3, 22400e3, 25600e3, 35600e3, 38700e3, 42000e3, 46700e3, 50200e3, 53700e3, 61100e3, 64702e3, 163700e3, 174100e3, 184900e3, 198800e3, 210500e3, 222700e3, 239100e3, 249660e3, 1067358e3, 1116105e3],
			modelColor: 'rgb(200, 128, 51)',
			nobleMetal: 2,
			nucleosynthesis: {
				rpProcess: 1, // guess
			},
			nutrition: 2,
			oxidation: [1, 2],
			prices: {
				2026: 12.454, // 1 Jan 2026
				2022: 3.794/pound,
				2021: 4.0547/pound,
				2019: 6,
			},
			production: 15.1e6,
			radius: {
				atomic: 128e-12,
				covalent: 132e-12,
				vanDerWaals: 140e-12,
			},
			resistivity: 16.78e-9,
			speedOfSound: 3810,
			temperatures: {
				boil: 2835,
				melt: 1357.77,
			},
			toxicity: 30e-6, // Copper sulfate, rat
			youngsModulus: (110e9 + 128e9)/2,
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
			appearance: 'silvery grey',
			biologicalHalfLife: 200*day, // personal estimate; 2.3 g zinc per person, 8 mg/day per person
			bulkModulus: 70e9,
			categories: {
				coinageMetal: 0.5, // us coins
				df: true,
				nativeMetal: 0.5,
				tech: 0.5,
			},
			covalentRadius: 135e-12,
			crystal: 'hP',
			density: 7134,
			discovery: -1000,
			electronAffinity: -60e3,
			electronegativity: 1.65,
			ionization: [906.4e3, 1733.3e3, 3833e3, 5731e3, 7970e3, 10400e3, 12900e3, 16800e3, 19600e3, 23000e3, 26400e3, 29990e3, 40490e3, 43800e3, 47300e3, 52300e3, 55900e3, 59700e3, 67300e3, 71200e3, 179100e3],
			modelColor: 'rgb(125, 128, 176)',
			nucleosynthesis: {
				alphaProcess: 1, // unsure
			},
			nutrition: 2,
			oxidation: [2],
			prices: {
				2026: 3.1301, // 2 Jan 2026
				2022: 1.3962/pound,
				2021: 1.2474/pound,
				2019: 2.55,
			},
			production: 11.2e6,
			radius: {
				atomic: 134e-12,
				covalent: 122e-12,
				vanDerWaals: 139e-12,
			},
			resistivity: 59e-9,
			speedOfSound: 3850,
			temperatures: {
				boil: 1180,
				melt: 692.88,
			},
			toxicity: 11e-6 / human_weight * over_nutrition, // double the daily intake, a wild guess. (see <https://en.wikipedia.org/wiki/Zinc_toxicity>)
			youngsModulus: 108e9,
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
			appearance: 'silvery blue',
			biologicalHalfLife: 25*hour, // Excretion of gallium occurs in two phases: the first phase has a biological half-life of 1 hour, while the second has a biological half-life of 25 hours.
			bulkModulus: (44e9 + 68e9)/2, // https://www.azom.com/properties.aspx?ArticleID=1132
			categories: {
				preciousMetal: 0.5,
				tech: true,
			},
			covalentRadius: 130e-12,
			crystal: 'oP',
			density: 5907,
			discovery: 1875,
			electronAffinity: 29e3,
			electronegativity: 1.81,
			ionization: [578.8e3, 1979.3e3, 2963e3, 6180e3],
			modelColor: 'rgb(194, 143, 143)',
			nucleosynthesis: {
				sProcess: 1,
			},
			oxidation: [3],
			prices: {
				2026: 236.22, // 5 Jan 2026
				2022: 218.82,
				2020: 148,
			},
			production: 184,
			radius: {
				atomic: 135e-12,
				covalent: 122e-12,
				vanDerWaals: 187e-12,
			},
			resistivity: 270e-9,
			speedOfSound: 2740,
			temperatures: {
				boil: 2673,
				melt: 692.88,
			},
			youngsModulus: 9.8e9,
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
			appearance: 'greyish white',
			bulkModulus: 75e9,
			categories: {
				metalloid: true,
				preciousMetal: 0.5,
				tech: true,
			},
			covalentRadius: 125e-12,
			crystal: 'cF',
			density: 5323,
			discovery: 1886,
			electronAffinity: 119e3,
			electronegativity: 2.01,
			ionization: [762e3, 1537.5e3, 3302.1e3, 4411e3, 9020e3],
			modelColor: 'rgb(102, 143, 143)',
			nucleosynthesis: {
				rpProcess: 0.5203, // guess; Ge-73, Ge-74, Ge-76
				sProcess: 0.4797, // Ge-70, Ge-72
			},
			oxidation: [-4, 2, 4],
			prices: {
				2022: 1124,
				2020: 962,
			},
			production: 118,
			radius: {
				atomic: 122e-12,
				covalent: 122e-12,
				vanDerWaals: 211e-12,
			},
			resistivity: 1,
			speedOfSound: 5400,
			temperatures: {
				boil: 3106,
				melt: 1211.4,
			},
			youngsModulus: 103e9,
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
			appearance: 'grey',
			bulkModulus: 22e9,
			categories: {
				metalloid: true,
				nativeMetal: 0.5,
				pnictogen: true,
				tech: 0.5,
			},
			covalentRadius: 115e-12,
			crystal: 'hR',
			density: 5776,
			discovery: 815,
			electronAffinity: 78e3,
			electronegativity: 2.18,
			ionization: [947e3, 1798e3, 2735e3, 4837e3, 6043e3, 12310e3],
			modelColor: 'rgb(189, 128, 227)',
			nobleMetal: 3,
			nucleosynthesis: {
				rProcess: 1,
			},
			nutrition: 4,
			oxidation: [-3, 3, 5],
			prices: {
				2021: 1.11,
				2020: 1.15,
			},
			radius: {
				atomic: 119e-12,
				covalent: 119e-12,
				vanDerWaals: 185e-12,
			},
			resistivity: 333e-9,
			production: 33e3, // https://pubs.usgs.gov/periodicals/mcs2020/mcs2020-arsenic.pdf
			temperatures: {
				boil: 887,
				melt: 887, // sublimates
			},
			toxicity: 1e-6, // "The acute minimal lethal dose of arsenic in adults is estimated to be 70 to 200 mg or 1 mg/kg/day."
			youngsModulus: 8e9,
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
			appearance: 'grey metallic',
			biologicalHalfLife: 190*day, // personal estimate; 15 mg selenium per person, 0.055 mg/day per person
			bulkModulus: 8.3e9,
			categories: {
				chalcogen: true,
				nativeMetal: 0.5,
				reactiveNonmetal: true,
				tech: 0.5,
			},
			covalentRadius: 115e-12,
			crystal: 'hR',
			density: 4809,
			discovery: 1817,
			electronAffinity: 195e3,
			electronegativity: 2.55,
			ionization: [941e3, 2045e3, 2973.7e3, 4144e3, 6590e3, 7880e3, 14990e3],
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
				2021: 22.87,
				2019: 21.4,
			},
			production: 2e3,
			radius: {
				atomic: 120e-12,
				covalent: 120e-12,
				vanDerWaals: 190e-12,
			},
			resistivity: 106e-6, // https://www.espimetals.com/index.php/component/content/article/422-online-catalog/selenium-se/435-selenium-se?Itemid=135
			speedOfSound: 3350,
			temperatures: {
				boil: 958,
				melt: 453,
			},
			toxicity: 3000e-6 / 65e3, // The chronic toxic dose of selenite for humans is about 2400 to 3000 micrograms of selenium per day.
			youngsModulus: 10e9,
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
			appearance: 'reddish brown',
			categories: {
				halogen: true,
				reactiveNonmetal: true,
			},
			covalentRadius: 115e-12,
			crystal: 'oP',
			density: 3122,
			discovery: 1825,
			electronAffinity: 325e3,
			electronegativity: 2.96,
			ionization: [1139.9e3, 2103e3, 3470e3, 4560e3, 5760e3, 8550e3, 9940e3, 18600e3],
			modelColor: 'rgb(166, 41, 41)',
			nucleosynthesis: {
				rProcess: 1,
			},
			nutrition: 2,
			oxidation: [-1, 1, 3, 5],
			prices: {
				2019: 4.39,
			},
			production: 556e3,
			radius: {
				atomic: 120e-12,
				covalent: 120e-12,
				vanDerWaals: 185e-12,
			},
			resistivity: 7.8e10,
			speedOfSound: 206,
			temperatures: {
				boil: 332,
				melt: 265.8,
			},
			toxicity: 8e-6 / human_weight * over_nutrition, // "normal daily intake is 2-8 mg"
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
			appearance: 'colorless',
			categories: {
				nobleGas: true,
			},
			covalentRadius: 116e-12,
			crystal: 'cF',
			density: 3.733,
			discovery: 1898,
			electronAffinity: -96e3,
			electronegativity: 3,
			ionization: [1350.8e3, 2350.4e3, 3565e3, 5070e3, 6240e3, 7570e3, 10710e3, 12138e3, 22274e3, 25880e3, 29700e3, 33800e3, 37700e3, 43100e3, 47500e3, 52200e3, 57100e3, 61800e3, 75800e3, 80400e3, 85300e3, 90400e3, 96300e3, 101400e3, 111100e3, 116290e3, 282500e3, 296200e3, 311400e3, 326200e3],
			modelColor: 'rgb(92, 184, 209)',
			nucleosynthesis: {
				pProcess: 0.0036, // Kr-78
				sProcess: 0.3116, // Kr-80, Kr-82, Kr-86
				rProcess: 0.6849, // Kr-83, Kr-84
			},
			oxidation: [0],
			prices: {
				2016: 1.4,
				1999: 290,
			},
			radius: {
				covalent: 116e-12,
				vanDerWaals: 202e-12,
			},
			speedOfSound: 221,
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
			appearance: 'grey white',
			biologicalHalfLife: 45*day, // Rb-86; http://hyperphysics.phy-astr.gsu.edu/hbase/Nuclear/biohalf.html
			bulkModulus: 2.5e9,
			categories: {
				alkaliMetal: true,
			},
			covalentRadius: 235e-12,
			crystal: 'cI',
			density: 1532,
			discovery: 1861,
			electronAffinity: 47e3,
			electronegativity: 0.82,
			ionization: [403e3, 2633e3, 3860e3, 5080e3, 6850e3, 8140e3, 9570e3, 13120e3, 14500e3, 26740e3],
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
			radius: {
				atomic: 248e-12,
				covalent: 220e-12,
				vanDerWaals: 303e-12,
			},
			resistivity: 128e-9,
			speedOfSound: 1300,
			temperatures: {
				boil: 961,
				melt: 312.46,
			},
			toxicity: 0.36 / 70e3 * 100, // a 70 kg person contains on average 0.36 g of rubidium, and an increase in this value by 50 to 100 times did not show negative effects in test persons
			youngsModulus: 2.4e9,
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
			appearance: 'gold silvery grey metallic',
			biologicalHalfLife: 1.8e4*day, // Sr-90; http://hyperphysics.phy-astr.gsu.edu/hbase/Nuclear/biohalf.html
			bulkModulus: 12e9, // https://pilgaardelements.com/Strontium/Physicals.htm
			categories: {
				aem: true,
			},
			covalentRadius: 200e-12,
			crystal: 'cF',
			density: 2640,
			discovery: 1808,
			electronAffinity: 5e3,
			electronegativity: 0.95,
			ionization: [549.5e3, 1064.2e3, 4138e3, 5500e3, 6910e3, 8760e3, 10230e3, 11800e3, 15600e3, 17100e3, 31270e3],
			modelColor: 'rgb(0, 255, 0)',
			nucleosynthesis: {
				pProcess: 0.0056, // Sr-84
				sProcess: 0.9944, // rest
			},
			nutrition: 4,
			oxidation: [2],
			prices: {
				2019: 6.61,
			},
			production: 220e3, // https://pubs.usgs.gov/periodicals/mcs2020/mcs2020-strontium.pdf
			radius: {
				atomic: 215e-12,
				covalent: 195e-12,
				vanDerWaals: 249e-12,
			},
			resistivity: 132e-9,
			temperatures: {
				boil: 1655,
				melt: 1050,
			},
			toxicity: 2e-6 / human_weight * over_nutrition, // average daily intake
			youngsModulus: 15.7e9,
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
			appearance: 'silvery white',
			bulkModulus: 41.2e9,
			categories: {
				rem: true,
				tech: true,
			},
			covalentRadius: 180e-12,
			crystal: 'hP',
			density: 4469,
			discovery: 1843,
			electronAffinity: 30e3,
			electronegativity: 1.22,
			ionization: [600e3, 1180e3, 1980e3, 5847e3, 7430e3, 8970e3, 11190e3, 12450e3, 14110e3, 18400e3, 19900e3, 36090e3],
			modelColor: 'rgb(148, 255, 255)',
			nucleosynthesis: {
				sProcess: 1,
			},
			oxidation: [3],
			prices: {
				2021: 37.18,
				2019: 31,
			},
			production: 200,
			radius: {
				atomic: 180e-12,
				covalent: 190e-12,
			},
			resistivity: 596e-9,
			speedOfSound: 3350,
			temperatures: {
				boil: 3609,
				melt: 1799,
			},
			toxicity: 500e-6 * minute_of_breathing / human_weight, // "at levels of 500 mg/m^3 yttrium is IDLH"
			youngsModulus: 63.5e9,
		},
	},
	{
		z: 40,
		name: 'Zirconium',
		symbol: 'Zr',
		mass: 91.222,
		group: 4,
		period: 5,
		properties: {
			abundance: {
				earth: 2e-6,
				human: 3e-9,
				universe: 5e-8,
			},
			appearance: 'silvery white',
			bulkModulus: 91.1e9,
			categories: {
				refractoryMetal: 0.5,
				tech: 0.5,
			},
			covalentRadius: 155e-12,
			crystal: 'hP',
			density: 6506,
			discovery: 1824,
			electronAffinity: 42e3,
			electronegativity: 1.33,
			ionization: [640.1e3, 1270e3, 2218e3, 3313e3, 7752e3, 9500e3],
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
			radius: {
				atomic: 160e-12,
				covalent: 175e-12,
			},
			resistivity: 421e-9,
			speedOfSound: 3800,
			temperatures: {
				boil: 4682,
				melt: 2128,
			},
			toxicity: 25e-6 * minute_of_breathing / human_weight, // "at levels of 25 mg/m^3 zirconium is IDLH"
			youngsModulus: 88e9,
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
			appearance: 'grey metallic',
			bulkModulus: 170e9,
			categories: {
				nativeMetal: 0.5,
				refractoryMetal: true,
				tech: true,
			},
			covalentRadius: 145e-12,
			crystal: 'cI',
			density: 8570,
			discovery: 1864,
			electronAffinity: 89e3,
			electronConfiguration: '[Kr] 4d4 4s1',
			electronegativity: 1.6,
			ionization: [652.1e3, 1380e3, 2416e3, 3700e3, 4877e3, 9847e3, 12100e3],
			modelColor: 'rgb(115, 194, 201)',
			nobleMetal: 0,
			nucleosynthesis: {
				sProcess: 0.87,
				rProcess: 0.13,
			},
			oxidation: [5],
			prices: {
				2021: 36.64,
				2020: 73.5,
				2018: 42.28,
			},
			production: 44.5e3,
			radius: {
				atomic: 146e-12,
				covalent: 164e-12,
			},
			resistivity: 152e-9,
			speedOfSound: 3480,
			temperatures: {
				boil: 5017,
				melt: 2750,
			},
			toxicity: 940e-6, // LD50, oral, rat
			youngsModulus: 105e9,
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
			appearance: 'grey metallic',
			biologicalHalfLife: 77*day, // personal estimate; 5 mg molybdenum per person, 0.045 mg/day per person
			bulkModulus: 230e9,
			categories: {
				nativeMetal: 0.5,
				refractoryMetal: true,
				tech: 0.5,
			},
			covalentRadius: 145e-12,
			crystal: 'cI',
			density: 10220,
			discovery: 1781,
			electronAffinity: 72e3,
			electronConfiguration: '[Kr] 4d5 4s1',
			electronegativity: 2.16,
			ionization: [684.3e3, 1560e3, 2618e3, 4480e3, 5257e3, 6640.8e3, 12125e3, 13860e3, 15835e3, 17980e3, 20190e3, 22219e3, 26930e3, 29196e3, 52490e3, 55000e3, 61400e3, 67700e3, 74000e3, 80400e3, 87000e3, 93400e3, 98420e3, 104400e3, 121900e3, 127700e3, 133800e3, 139800e3, 148100e3, 154500e3],
			modelColor: 'rgb(84, 181, 181)',
			nobleMetal: 0,
			nucleosynthesis: {
				sProcess: 0.63,
				rProcess: 0.37,
			},
			nutrition: 2,
			oxidation: [4, 6],
			prices: {
				2026: 66.214, // 5 Jan 2026
				2022: 46.5,
				2021: 12.28/pound,
				2019: 40.1,
			},
			production: 250e3,
			radius: {
				atomic: 139e-12,
				covalent: 154e-12,
			},
			resistivity: 53.4e-9,
			speedOfSound: 5400,
			temperatures: {
				boil: 4912,
				melt: 2896,
			},
			toxicity: 45e-9 / human_weight * over_nutrition, // double the daily intake, a wild guess. (see <https://en.wikipedia.org/wiki/Zinc_toxicity>)
			youngsModulus: 329e9,
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
			appearance: 'shiny grey',
			biologicalHalfLife: day, // Tc-99m; http://hyperphysics.phy-astr.gsu.edu/hbase/Nuclear/biohalf.html
			bulkModulus: 281e9, // https://pilgaardelements.com/Technetium/Physicals.htm
			categories: {
				refractoryMetal: 0.5,
			},
			covalentRadius: 135e-12,
			crystal: 'hP',
			density: 11500,
			discovery: 1937,
			electronAffinity: 53e3,
			electronegativity: 1.9,
			ionization: [702e3, 1470e3, 2850e3],
			modelColor: 'rgb(59, 158, 158)',
			nobleMetal: 4,
			oxidation: [4, 7],
			prices: {
				2004: 1e5,
			},
			radius: {
				atomic: 136e-12,
				covalent: 147e-12,
			},
			resistivity: 200e-9,
			temperatures: {
				boil: 4538,
				melt: 2430,
			},
			toxicity: 15e-12 * over_nutrition, // 15 mcg/g is apparently safe in mice (see <https://en.wikipedia.org/wiki/Zinc_toxicity>)
			youngsModulus: (382e9 + 430e9)/2,
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
			appearance: 'silvery white metallic',
			bulkModulus: 220e9,
			categories: {
				nativeMetal: true,
				nobleMetal: true,
				platinumGroup: true,
				preciousMetal: true,
				refractoryMetal: 0.5,
				tech: true,
			},
			covalentRadius: 130e-12,
			crystal: 'hP',
			density: 12370,
			discovery: 1844,
			electronAffinity: 101e3,
			electronConfiguration: '[Kr] 4d7 4s1',
			electronegativity: 2.2,
			ionization: [710.2e3, 1620e3, 2747e3],
			modelColor: 'rgb(36, 143, 143)',
			nobleMetal: 1,
			nucleosynthesis: {
				sProcess: 0.32,
				rProcess: 0.68,
			},
			oxidation: [3, 4],
			prices: {
				2025: 29257.18, // 31 Oct 2025
				2022: 553.49/ounce, // year average
				2021: 566.85/ounce, // year average
				2020: 264.94/ounce, // year average
			},
			production: 12,
			radius: {
				atomic: 134e-12,
				covalent: 146e-12,
			},
			resistivity: 71e-9,
			speedOfSound: 5970,
			temperatures: {
				boil: 4423,
				melt: 2607,
			},
			youngsModulus: 447e9,
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
			appearance: 'silvery white metallic',
			bulkModulus: 275e9,
			categories: {
				nativeMetal: true,
				nobleMetal: true,
				platinumGroup: true,
				preciousMetal: true,
				refractoryMetal: 0.5,
				tech: true,
			},
			covalentRadius: 135e-12,
			crystal: 'cF',
			density: 12410,
			discovery: 1804,
			electronAffinity: 110e3,
			electronConfiguration: '[Kr] 4d8 4s1',
			electronegativity: 2.28,
			ionization: [719.7e3, 1740e3, 2997e3],
			modelColor: 'rgb(10, 125, 140)',
			nobleMetal: 1,
			nucleosynthesis: {
				sProcess: 0.13,
				rProcess: 0.87,
			},
			oxidation: [3],
			prices: {
				2026: 303824.55, // 2 Jan 2026
				2022: 15560.66/ounce, // year average
				2021: 20064.59/ounce, // year average
				2020: 11235.95/ounce, // year average
				2019: 147e3,
			},
			production: 25,
			radius: {
				atomic: 134e-12,
				covalent: 142e-12,
			},
			resistivity: 43.3e-9,
			speedOfSound: 4700,
			temperatures: {
				boil: 3968,
				melt: 2237,
			},
			toxicity: 198e-6, // LD50, rat, rhodium chloride
			youngsModulus: 380e9,
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
			appearance: 'silvery white',
			bulkModulus: 180e9,
			categories: {
				nativeMetal: true,
				nobleMetal: true,
				platinumGroup: true,
				preciousMetal: true,
				tech: true,
			},
			covalentRadius: 140e-12,
			crystal: 'cF',
			density: 12020,
			discovery: 1802,
			electronAffinity: 54e3,
			electronConfiguration: '[Kr] 4d10',
			electronegativity: 2.2,
			ionization: [804.4e3, 1870e3, 3177e3],
			modelColor: 'rgb(0, 105, 133)',
			nobleMetal: 1,
			nucleosynthesis: {
				sProcess: 0.45,
				rProcess: 0.55,
			},
			oxidation: [0, 2, 4],
			prices: {
				2026: 53595.29, // 2 Jan 2026
				2022: 2133.95/ounce, // year average
				2021: 2407.67/ounce, // year average
				2020: 2209.99/ounce, // year average
				2019: 49.5e3,
			},
			production: 210, // https://pubs.usgs.gov/periodicals/mcs2020/mcs2020-platinum.pdf
			radius: {
				atomic: 137e-12,
				covalent: 139e-12,
				vanDerWaals: 163e-12,
			},
			resistivity: 105.4e-9,
			speedOfSound: 3070,
			temperatures: {
				boil: 3236,
				melt: 1828.05,
			},
			toxicity: 200e-6, // LD50, oral, mouse, soluble palladium compounds
			youngsModulus: 121e9,
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
			appearance: 'silvery white',
			bulkModulus: 100e9,
			categories: {
				coinageMetal: true,
				df: true,
				nativeMetal: true,
				nobleMetal: 0.5,
				preciousMetal: true,
				tech: 0.5,
			},
			covalentRadius: 160e-12,
			crystal: 'cF',
			density: 10501,
			discovery: -5000,
			electronAffinity: 126e3,
			electronConfiguration: '[Kr] 4d10 5s1',
			electronegativity: 1.93,
			ionization: [731e3, 2070e3, 3361e3],
			modelColor: 'rgb(192, 192, 192)',
			nobleMetal: 2,
			nucleosynthesis: {
				sProcess: 0.19,
				rProcess: 0.81,
			},
			oxidation: [1],
			prices: {
				2026: 2334.79, // 2 Jan 2026
				2022: 23.74/ounce,
				2021: 25.645/ounce,
				2019: 521,
			},
			production: 322e3,
			radius: {
				atomic: 144e-12,
				covalent: 145e-12,
				vanDerWaals: 172e-12,
			},
			resistivity: 15.9e-9,
			speedOfSound: 2680,
			temperatures: {
				boil: 2435,
				melt: 1234.93,
			},
			toxicity: 5e-9 * over_nutrition, // safe at doses up to 5 μg/(kg·d)
			youngsModulus: 83e9,
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
			appearance: 'blue silvery grey metallic',
			biologicalHalfLife: 30*year, // in bone
			bulkModulus: 42e9,
			categories: {
				nativeMetal: 0.5,
				tech: 0.5,
			},
			covalentRadius: 155e-12,
			crystal: 'hP',
			density: 8690,
			discovery: 1817,
			electronAffinity: -70e3,
			electronegativity: 1.69,
			ionization: [867.8e3, 1631.4e3, 3616e3],
			modelColor: 'rgb(255, 217, 143)',
			nucleosynthesis: {
				sProcess: 0.52,
				rProcess: 0.48,
			},
			nutrition: 4,
			oxidation: [2],
			prices: {
				2022: 1.9,
				2021: 2.49,
				2019: 2.73,
			},
			production: 25e3, // https://pubs.usgs.gov/periodicals/mcs2020/mcs2020-cadmium.pdf
			radius: {
				atomic: 151e-12,
				covalent: 144e-12,
				vanDerWaals: 158e-12,
			},
			resistivity: 72.7e-9,
			speedOfSound: 2310,
			temperatures: {
				boil: 1040,
				melt: 594.22,
			},
			toxicity: 225e-6, // rat, oral
			youngsModulus: 50e9,
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
			appearance: 'silvery grey',
			bulkModulus: 40e9, // https://pilgaardelements.com/Strontium/Physicals.htm
			categories: {
				nativeMetal: 0.5,
				preciousMetal: 0.5,
				tech: true,
			},
			covalentRadius: 155e-12,
			crystal: 'tI',
			density: 7310,
			discovery: 1867,
			electronAffinity: 37e3,
			electronegativity: 1.78,
			ionization: [558.3e3, 1820.7e3, 2704e3, 5210e3],
			modelColor: 'rgb(166, 117, 115)',
			nucleosynthesis: {
				sProcess: 0.36,
				rProcess: 0.64,
			},
			oxidation: [3],
			prices: {
				2026: 404.44, // 5 Jan 2026
				2022: 205.9,
				2019: 167,
			},
			production: 476,
			radius: {
				atomic: 167e-12,
				covalent: 142e-12,
				vanDerWaals: 193e-12,
			},
			resistivity: 83.7e-9,
			speedOfSound: 1215,
			temperatures: {
				boil: 2345,
				melt: 429.75,
			},
			toxicity: 0.1e-6 * workday_of_breathing / human_weight * over_nutrition, // recommended exposure limit over an 8h workday
			youngsModulus: 11e9,
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
			appearance: 'silvery white',
			biologicalHalfLife: 3.5*day, // rats; oral; diethyltin chloride; https://www.sciencedirect.com/topics/agricultural-and-biological-sciences/biological-half-life
			bulkModulus: 58e9,
			categories: {
				coinageMetal: true,
				df: true,
				nativeMetal: 0.5,
				tech: 0.5,
			},
			covalentRadius: 145e-12,
			crystal: 'tI',
			density: 7287,
			discovery: -3500,
			electronAffinity: 107e3,
			electronegativity: 1.96,
			ionization: [708.6e3, 1411.8e3, 2943e3, 3930.3e3, 7456e3],
			modelColor: 'rgb(102, 128, 128)',
			nucleosynthesis: {
				sProcess: 0.69,
				rProcess: 0.31,
			},
			oxidation: [-4, 2, 4],
			prices: {
				2026: 40.409, // 2 Jan 2026
				2022: 23.307,
				2021: 12.565/pound,
				2019: 18.7,
			},
			production: 340e3,
			radius: {
				atomic: 140e-12,
				covalent: 139e-12,
				vanDerWaals: 217e-12,
			},
			resistivity: 115e-9,
			speedOfSound: 2730,
			temperatures: {
				boil: 2875,
				melt: 505.08,
			},
			toxicity: 200e-6, // "Nausea, vomiting and diarrhea have been reported after ingesting canned food containing 200 mg/kg of tin."
			youngsModulus: 50e9,
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
			appearance: 'silvery grey',
			bulkModulus: 42e9,
			categories: {
				metalloid: true,
				nativeMetal: 0.5,
				pnictogen: true,
				tech: true,
			},
			covalentRadius: 145e-12,
			crystal: 'hR',
			density: 6685,
			discovery: 815,
			electronAffinity: 101e3,
			electronegativity: 2.05,
			ionization: [834e3, 1594.9e3, 2440e3, 4260e3, 5400e3, 10400e3],
			modelColor: 'rgb(158, 99, 181)',
			nobleMetal: 3,
			nucleosynthesis: {
				sProcess: 0.25,
				rProcess: 0.75,
			},
			nutrition: 4,
			oxidation: [-3, 3, 5],
			prices: {
				2022: 11.3,
				2019: 5.79,
			},
			production: 150e3,
			radius: {
				atomic: 140e-12,
				covalent: 139e-12,
				vanDerWaals: 206e-12,
			},
			resistivity: 417e-9,
			speedOfSound: 3420,
			temperatures: {
				boil: 1860,
				melt: 903.78,
			},
			youngsModulus: 55e9,
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
			appearance: 'silvery grey',
			bulkModulus: 65e9,
			categories: {
				chalcogen: true,
				metalloid: true,
				nativeMetal: 0.5,
				tech: true,
			},
			covalentRadius: 140e-12,
			crystal: 'hR',
			density: 6232,
			discovery: 1782,
			electronAffinity: 190e3,
			electronegativity: 2.1,
			ionization: [869.3e3, 1790e3, 2698e3, 3610e3, 5668e3, 6820e3, 13200e3],
			modelColor: 'rgb(212, 122, 0)',
			nobleMetal: 3,
			nucleosynthesis: {
				sProcess: 0.57,
				rProcess: 0.43,
			},
			nutrition: 4,
			oxidation: [-2, 2, 4, 6],
			prices: {
				2026: 104.51, // 5 Jan 2026
				2022: 78.559,
				2019: 63.5,
			},
			production: 122,
			radius: {
				atomic: 140e-12,
				covalent: 138e-12,
				vanDerWaals: 206e-12,
			},
			resistivity: 1e-4, // https://periodictable.com/Elements/052/data.html
			speedOfSound: 2610,
			temperatures: {
				boil: 1261,
				melt: 722.66,
			},
			youngsModulus: 43e9,
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
			appearance: 'grey metallic',
			biologicalHalfLife: 66.1*day, // https://www.sciencedirect.com/topics/agricultural-and-biological-sciences/biological-half-life
			bulkModulus: 7.7e9,
			categories: {
				halogen: true,
				reactiveNonmetal: true,
			},
			covalentRadius: 140e-12,
			crystal: 'oS',
			density: 4930,
			discovery: 1811,
			electronAffinity: 295e3,
			electronegativity: 2.66,
			ionization: [1008.4e3, 1845.9e3, 3180e3],
			modelColor: 'rgb(148, 0, 148)',
			nucleosynthesis: {
				sProcess: 0.05,
				rProcess: 0.95,
			},
			nutrition: 2,
			oxidation: [-1, 1, 3, 5, 7],
			prices: {
				2026: 180.01, // 2 Jan 2026
				2019: 35,
			},
			production: 28e3, // https://pubs.usgs.gov/periodicals/mcs2020/mcs2020-iodine.pdf
			radius: {
				atomic: 140e-12,
				covalent: 139e-12,
				vanDerWaals: 198e-12,
			},
			resistivity: 1.3e7,
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
			appearance: 'colorless',
			categories: {
				nobleGas: true,
			},
			covalentRadius: 140e-12,
			crystal: 'cF',
			density: 5.887,
			discovery: 1898,
			electronAffinity: -80e3,
			electronegativity: 2.6,
			ionization: [1170.4e3, 2046.4e3, 3099.4e3],
			modelColor: 'rgb(66, 158, 176)',
			nucleosynthesis: {
				sProcess: 0.17,
				rProcess: 0.83,
			},
			oxidation: [0],
			prices: {
				2016: 9.2,
				1999: 1800,
			},
			production: 40,
			radius: {
				covalent: 140e-12,
				vanDerWaals: 216e-12,
			},
			speedOfSound: 178,
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
			appearance: 'pale gold',
			biologicalHalfLife: 2.5*month, // 1-4 mos
			bulkModulus: 1.6e9,
			categories: {
				alkaliMetal: true,
				tech: 0.5,
			},
			covalentRadius: 260e-12,
			crystal: 'cI',
			density: 1873,
			discovery: 1882,
			electronegativity: 0.79,
			electronAffinity: 46e3,
			ionization: [375.7e3, 2234.3e3, 3400e3],
			modelColor: 'rgb(87, 23, 143)',
			nucleosynthesis: {
				sProcess: 0.15,
				rProcess: 0.85,
			},
			oxidation: [1],
			prices: {
				2021: 69.9e3,
				2018: 61.8e3,
			},
			radius: {
				atomic: 265e-12,
				covalent: 244e-12,
				vanDerWaals: 343e-12,
			},
			resistivity: 205e-9,
			speedOfSound: 980, // https://www.knowledgedoor.com/2/elements_handbook/speed_of_sound.html
			temperatures: {
				boil: 944,
				melt: 301.59,
			},
			toxicity: 2.3e-3, // https://en.wikipedia.org/wiki/Caesium#Health_and_safety_hazards
			youngsModulus: 1.7e9,
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
			appearance: 'silvery grey',
			biologicalHalfLife: 65*day, // Ba-140; http://hyperphysics.phy-astr.gsu.edu/hbase/Nuclear/biohalf.html
			bulkModulus: 9.6e9,
			categories: {
				aem: true,
			},
			covalentRadius: 215e-12,
			crystal: 'cI',
			density: 3594,
			discovery: 1808,
			electronAffinity: 14e3,
			electronegativity: 0.89,
			ionization: [502.9e3, 965.2e3, 3600e3],
			modelColor: 'rgb(0, 201, 0)',
			nucleosynthesis: {
				sProcess: 0.82,
				rProcess: 0.18,
			},
			nutrition: 4,
			oxidation: [2],
			prices: {
				2016: 0.261,
			},
			radius: {
				atomic: 222e-12,
				covalent: 215e-12,
				vanDerWaals: 268e-12,
			},
			resistivity: 332e-9,
			speedOfSound: 1620,
			temperatures: {
				boil: 2170,
				melt: 1000,
			},
			youngsModulus: 13e9,
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
			appearance: 'silvery white',
			bulkModulus: 27.9e9,
			categories: {
				lanthanide: true,
				rem: true,
				tech: true,
			},
			covalentRadius: 195e-12,
			crystal: 'hP',
			density: 6145,
			discovery: 1841,
			electronAffinity: 54e3,
			electronConfiguration: '[Xe] 5d1 6s2',
			electronegativity: 1.1,
			ionization: [538.1e3, 1067e3, 1850.3e3, 4819e3, 5940e3],
			modelColor: 'rgb(112, 212, 255)',
			nucleosynthesis: {
				sProcess: 0.62,
				rProcess: 0.38,
			},
			nutrition: 4,
			oxidation: [3],
			prices: {
				2022: 5.09,
				2020: 4.85,
			},
			radius: {
				atomic: 187e-12,
				covalent: 207e-12,
			},
			resistivity: 615e-9,
			speedOfSound: 2475,
			temperatures: {
				boil: 3737,
				melt: 1193,
			},
			youngsModulus: 36.6e9,
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
			appearance: 'silvery white',
			bulkModulus: 21.5e9,
			categories: {
				lanthanide: true,
				rem: true,
				tech: true,
			},
			covalentRadius: 185e-12,
			crystal: 'hP',
			density: 6770,
			discovery: 1838,
			electronAffinity: 55e3,
			electronConfiguration: '[Xe] 4f1 5d1 6s2',
			electronegativity: 1.12,
			ionization: [534.4e3, 1050e3, 1949e3, 3547e3, 6325e3, 7490e3],
			modelColor: 'rgb(255, 255, 199)',
			nucleosynthesis: {
				sProcess: 0.76,
				rProcess: 0.24,
			},
			nutrition: 4,
			oxidation: [3, 4],
			prices: {
				2020: 31.4,
			},
			radius: {
				atomic: 181.8e-12,
				covalent: 204e-12,
			},
			resistivity: 828e-9,
			speedOfSound: 2100,
			temperatures: {
				boil: 3716,
				melt: 1068,
			},
			youngsModulus: 33.6e9,
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
			appearance: 'greyish white',
			bulkModulus: 28.8e9,
			categories: {
				lanthanide: true,
				rem: true,
				tech: true,
			},
			covalentRadius: 185e-12,
			crystal: 'hP',
			density: 6773,
			discovery: 1885,
			electronAffinity: 11e3,
			electronegativity: 1.13,
			ionization: [527e3, 1020e3, 2086e3, 3761e3, 5551e3],
			modelColor: 'rgb(217, 255, 199)',
			nucleosynthesis: {
				sProcess: 0.52,
				rProcess: 0.48,
			},
			nutrition: 4,
			oxidation: [3],
			prices: {
				2022: 135.59,
				2021: 112.23,
				2019: 103,
			},
			radius: {
				atomic: 182e-12,
				covalent: 203e-12,
			},
			resistivity: 700e-9,
			speedOfSound: 2280,
			temperatures: {
				boil: 3793,
				melt: 1208,
			},
			youngsModulus: 37.3e9,
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
			appearance: 'silvery white',
			bulkModulus: 31.8e9,
			categories: {
				lanthanide: true,
				rem: true,
				tech: true,
			},
			covalentRadius: 185e-12,
			crystal: 'hP',
			density: 7007,
			discovery: 1885,
			electronAffinity: 9e3,
			electronegativity: 1.14,
			ionization: [533.1e3, 1040e3, 2130e3, 3900e3],
			modelColor: 'rgb(199, 255, 199)',
			nucleosynthesis: {
				sProcess: 0.60,
				rProcess: 0.40,
			},
			nutrition: 4,
			oxidation: [3],
			prices: {
				2026: 108.45, // 5 Jan 2026
				2022: 135,
				2021: 120.8,
				2019: 57.5,
			},
			production: 7000,
			radius: {
				atomic: 181e-12,
				covalent: 201e-12,
			},
			resistivity: 643e-9,
			speedOfSound: 2330,
			temperatures: {
				boil: 3347,
				melt: 1297,
			},
			youngsModulus: 41.4e9,
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
			appearance: 'silvery white', // probable
			bulkModulus: 33e9,
			categories: {
				lanthanide: true,
				rem: true,
				tech: 0.5,
			},
			covalentRadius: 185e-12,
			crystal: 'hP',
			density: 7260,
			discovery: 1945,
			electronAffinity: 12e3,
			electronegativity: 1.15,
			ionization: [540e3, 1050e3, 2150e3, 3970e3],
			modelColor: 'rgb(163, 255, 199)',
			oxidation: [3],
			prices: {
				2003: 460e3,
			},
			radius: {
				atomic: 183e-12,
				covalent: 199e-12,
			},
			resistivity: 750e-9,
			temperatures: {
				boil: 3273,
				melt: 1315,
			},
			toxicity: ld50_radiation(17.7*year),
			youngsModulus: 46e9,
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
			appearance: 'silvery white',
			bulkModulus: 37.8e9,
			categories: {
				lanthanide: true,
				rem: true,
				tech: true,
			},
			covalentRadius: 185e-12,
			crystal: 'hR',
			density: 7520,
			discovery: 1879,
			electronAffinity: 16e3,
			electronegativity: 1.17,
			ionization: [544.5e3, 1070e3, 2260e3, 3990e3],
			modelColor: 'rgb(143, 255, 199)',
			nucleosynthesis: {
				sProcess: 0.29,
				rProcess: 0.71,
			},
			nutrition: 4,
			oxidation: [3],
			prices: {
				2021: 13.94,
				2019: 13.9,
			},
			production: 700,
			radius: {
				atomic: 180e-12,
				covalent: 198e-12,
			},
			resistivity: 940e-9,
			speedOfSound: 2130,
			temperatures: {
				boil: 2067,
				melt: 1345,
			},
			youngsModulus: 49.7e9,
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
			appearance: 'silvery white',
			bulkModulus: 8.3e9,
			categories: {
				lanthanide: true,
				rem: true,
				tech: true,
			},
			covalentRadius: 185e-12,
			crystal: 'cI',
			density: 5246,
			discovery: 1901,
			electronAffinity: 11e3,
			electronegativity: 1.15,
			ionization: [547.1e3, 1085e3, 2404e3, 4120e3],
			modelColor: 'rgb(97, 255, 199)',
			nucleosynthesis: {
				sProcess: 0.05,
				rProcess: 0.95,
			},
			nutrition: 4,
			oxidation: [2, 3],
			prices: {
				2020: 31.4,
			},
			radius: {
				atomic: 180e-12,
				covalent: 198e-12,
			},
			resistivity: 900e-9,
			temperatures: {
				boil: 1802,
				melt: 1099,
			},
			toxicity: 5e-3, // LD50, oral, europium chloride and nitrate
			youngsModulus: 18.2e9,
		},
	},
	{
		z: 64,
		name: 'Gadolinium',
		symbol: 'Gd',
		mass: 157.249,
		period: 6,
		properties: {
			abundance: {
				earth: 61e-9,
				universe: 2e-9,
			},
			appearance: 'silvery white',
			bulkModulus: 37.9e9,
			categories: {
				lanthanide: true,
				rem: true,
				tech: true,
			},
			covalentRadius: 180e-12,
			crystal: 'hP',
			density: 7895,
			discovery: 1886,
			electronAffinity: 13e3,
			electronConfiguration: '[Xe] 4f7 5d1 6s2',
			electronegativity: 1.2,
			ionization: [593.4e3, 1170e3, 1990e3, 4250e3],
			modelColor: 'rgb(69, 255, 199)',
			nucleosynthesis: {
				sProcess: 0.15,
				rProcess: 0.85,
			},
			nutrition: 4,
			oxidation: [3],
			prices: {
				2020: 28.6,
			},
			radius: {
				atomic: 180e-12,
				covalent: 196e-12,
			},
			resistivity: 1.31e-6,
			speedOfSound: 2680,
			temperatures: {
				boil: 3546,
				melt: 1585,
			},
			toxicity: 150e-6, // LD50, mice
			youngsModulus: 54.8e9,
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
			appearance: 'silvery white',
			bulkModulus: 38.7e9,
			categories: {
				lanthanide: true,
				rem: true,
				tech: true,
			},
			covalentRadius: 175e-12,
			crystal: 'hP',
			density: 8229,
			discovery: 1886,
			electronAffinity: 13e3,
			electronegativity: 1.1,
			ionization: [565.8e3, 1110e3, 2114e3, 3839e3],
			modelColor: 'rgb(48, 255, 199)',
			nucleosynthesis: {
				sProcess: 0.07,
				rProcess: 0.93,
			},
			oxidation: [3],
			prices: {
				2022: 3993.2,
				2021: 1681.75,
				2019: 658,
			},
			radius: {
				atomic: 177e-12,
				covalent: 194e-12,
			},
			resistivity: 1.15e-6,
			speedOfSound: 2620,
			temperatures: {
				boil: 3503,
				melt: 1629,
			},
			youngsModulus: 55.7e9,
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
			appearance: 'silvery white',
			bulkModulus: 40.5e9,
			categories: {
				lanthanide: true,
				rem: true,
				tech: true,
			},
			covalentRadius: 175e-12,
			crystal: 'hP',
			density: 8550,
			discovery: 1886,
			electronAffinity: 34e3,
			electronegativity: 1.22,
			ionization: [573e3, 1130e3, 2200e3, 3990e3],
			modelColor: 'rgb(31, 255, 199)',
			nucleosynthesis: {
				sProcess: 0.14,
				rProcess: 0.86,
			},
			oxidation: [3],
			prices: {
				2022: 647.1,
				2021: 518.12,
				2019: 307,
			},
			production: 100,
			radius: {
				atomic: 178e-12,
				covalent: 192e-12,
			},
			resistivity: 926e-9,
			speedOfSound: 2710,
			temperatures: {
				boil: 2840,
				melt: 1680,
			},
			toxicity: 0.5 / 65, // it is estimated that the ingestion of 500 grams or more could be fatal to a human
			youngsModulus: 61.4e9,
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
			appearance: 'silvery white',
			bulkModulus: 40.2e9,
			categories: {
				lanthanide: true,
				rem: true,
				tech: 0.5,
			},
			covalentRadius: 175e-12,
			crystal: 'hP',
			density: 8795,
			discovery: 1879,
			electronAffinity: 33e3,
			electronegativity: 1.23,
			ionization: [581e3, 1140e3, 2204e3, 4100e3],
			modelColor: 'rgb(0, 255, 156)',
			nucleosynthesis: {
				sProcess: 0.07,
				rProcess: 0.93,
			},
			oxidation: [3],
			prices: {
				2022: 58.72,
				2020: 57.1,
			},
			radius: {
				atomic: 176e-12,
				covalent: 192e-12,
			},
			resistivity: 814e-9,
			speedOfSound: 2760,
			temperatures: {
				boil: 2993,
				melt: 1734,
			},
			youngsModulus: 64.8e9,
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
			appearance: 'silvery white',
			bulkModulus: 44.4e9,
			categories: {
				lanthanide: true,
				rem: true,
				tech: true,
			},
			covalentRadius: 175e-12,
			crystal: 'hP',
			density: 9066,
			discovery: 1879,
			electronAffinity: 30e3,
			electronegativity: 1.24,
			ionization: [589.3e3, 1150e3, 2194e3, 4120e3],
			modelColor: 'rgb(0, 230, 117)',
			nucleosynthesis: {
				sProcess: 0.16,
				rProcess: 0.84,
			},
			oxidation: [3],
			prices: {
				2022: 21,
				2020: 26.4,
			},
			radius: {
				atomic: 176e-12,
				covalent: 189e-12,
			},
			resistivity: 860e-9,
			speedOfSound: 2830,
			temperatures: {
				boil: 3141,
				melt: 1734,
			},
			youngsModulus: 69.9e9,
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
			appearance: 'silvery grey',
			bulkModulus: 44.5e9,
			categories: {
				lanthanide: true,
				rem: true,
				tech: 0.5,
			},
			covalentRadius: 175e-12,
			crystal: 'hP',
			density: 9321,
			discovery: 1879,
			electronAffinity: 90e3,
			electronegativity: 1.25,
			ionization: [596.7e3, 1160e3, 2285e3, 4120e3],
			modelColor: 'rgb(0, 212, 82)',
			nucleosynthesis: {
				sProcess: 0.12,
				rProcess: 0.88,
			},
			oxidation: [3],
			prices: {
				2016: 6200,
				2003: 3000,
			},
			radius: {
				atomic: 176e-12,
				covalent: 190e-12,
			},
			resistivity: 676e-9,
			temperatures: {
				boil: 2223,
				melt: 1818,
			},
			youngsModulus: 74e9,
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
			appearance: 'silvery white',
			bulkModulus: 30.5e9,
			categories: {
				lanthanide: true,
				rem: true,
				tech: 0.5,
			},
			covalentRadius: 175e-12,
			crystal: 'cF',
			density: 6965,
			discovery: 1906,
			electronAffinity: -2e3,
			electronegativity: 1.15,
			ionization: [603.4e3, 1174.8e3, 2417e3, 4203e3],
			modelColor: 'rgb(0, 191, 56)',
			nucleosynthesis: {
				sProcess: 0.32,
				rProcess: 0.68,
			},
			oxidation: [3],
			prices: {
				2020: 17.1,
			},
			radius: {
				atomic: 176e-12,
				covalent: 187e-12,
			},
			resistivity: 250e-9,
			speedOfSound: 1590,
			temperatures: {
				boil: 1469,
				melt: 1097,
			},
			youngsModulus: 23.9e9,
		},
	},
	{
		z: 71,
		name: 'Lutetium',
		symbol: 'Lu',
		mass: 174.96669,
		group: 3,
		period: 6,
		properties: {
			abundance: {
				earth: 7e-9,
				universe: 1e-10,
			},
			appearance: 'silvery white',
			bulkModulus: 47.6e9,
			categories: {
				lanthanide: true,
				rem: true,
				tech: 0.5,
			},
			covalentRadius: 175e-12,
			crystal: 'hP',
			density: 9840,
			discovery: 1906,
			electronAffinity: 23e3,
			electronegativity: 1.27,
			ionization: [523.5e3, 1340e3, 2022.3e3, 4370e3, 6445e3],
			modelColor: 'rgb(0, 171, 36)',
			nucleosynthesis: {
				sProcess: 0.20,
				rProcess: 0.80,
			},
			oxidation: [3],
			prices: {
				2020: 643,
			},
			radius: {
				atomic: 174e-12,
				covalent: 187e-12,
			},
			resistivity: 582e-9,
			temperatures: {
				boil: 3675,
				melt: 1925,
			},
			youngsModulus: 68.6e9,
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
			appearance: 'silvery grey',
			bulkModulus: 110e9,
			categories: {
				refractoryMetal: 0.5,
				tech: 0.5,
			},
			covalentRadius: 155e-12,
			crystal: 'hP',
			density: 13310,
			discovery: 1922,
			electronAffinity: 17e3,
			electronegativity: 1.3,
			ionization: [658.5e3, 1440e3, 2250e3, 3216e3],
			modelColor: 'rgb(77, 194, 255)',
			nobleMetal: 0,
			nucleosynthesis: {
				sProcess: 0.55,
				rProcess: 0.45,
			},
			oxidation: [4],
			prices: {
				2022: 4560,
				2017: 900,
			},
			production: 10,
			radius: {
				atomic: 159e-12,
				covalent: 175e-12,
			},
			resistivity: 331e-9,
			speedOfSound: 1590,
			temperatures: {
				boil: 4876,
				melt: 2506,
			},
			youngsModulus: 78e9,
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
			appearance: 'blue grey',
			bulkModulus: 200e9,
			categories: {
				nativeMetal: 0.5,
				refractoryMetal: true,
				tech: true,
			},
			covalentRadius: 145e-12,
			crystal: 'cI',
			density: 16654,
			discovery: 1802,
			electronAffinity: 31e3,
			electronegativity: 1.5,
			ionization: [761e3, 1500e3],
			modelColor: 'rgb(77, 166, 255)',
			monoisotopic: false,
			nobleMetal: 0,
			nucleosynthesis: {
				sProcess: 0.41,
				rProcess: 0.49,
			},
			oxidation: [5],
			prices: {
				2021: 209.29,
				2019: 305,
				2018: 151.8,
			},
			production: 1.8e3, // https://pubs.usgs.gov/periodicals/mcs2020/mcs2020-tantalum.pdf
			radius: {
				atomic: 146e-12,
				covalent: 170e-12,
			},
			resistivity: 131e-9,
			speedOfSound: 3400,
			temperatures: {
				boil: 5731,
				melt: 3290,
			},
			youngsModulus: 186e9,
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
			appearance: 'greyish white',
			bulkModulus: 310e9,
			categories: {
				nativeMetal: 0.5,
				refractoryMetal: true,
				tech: true,
			},
			covalentRadius: 135e-12,
			crystal: 'cI',
			density: 19250,
			discovery: 1783,
			electronAffinity: 79e3,
			electronegativity: 2.36,
			ionization: [770e3, 1700e3],
			modelColor: 'rgb(33, 148, 214)',
			nobleMetal: 0,
			nucleosynthesis: {
				sProcess: 0.57,
				rProcess: 0.43,
			},
			nutrition: 4,
			oxidation: [4, 6],
			prices: {
				2021: 37.94,
				2019: 35.3,
				2018: 30.3,
			},
			production: 37400,
			radius: {
				atomic: 139e-12,
				covalent: 162e-12,
			},
			resistivity: 52.8e-9,
			speedOfSound: 4620,
			temperatures: {
				boil: 5828,
				melt: 3695,
			},
			toxicity: 59e-6, // https://en.wikipedia.org/wiki/Tungsten#Health_factors
			youngsModulus: 411e9,
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
			appearance: 'silvery grey',
			bulkModulus: 370e9,
			categories: {
				nativeMetal: 0.5,
				preciousMetal: true,
				refractoryMetal: true,
				tech: 0.5,
			},
			covalentRadius: 135e-12,
			crystal: 'hP',
			density: 21020,
			discovery: 1919,
			electronAffinity: 6e3,
			electronegativity: 1.9,
			ionization: [760e3, 1260e3, 2510e3, 3640e3],
			modelColor: 'rgb(38, 125, 171)',
			nobleMetal: 2,
			nucleosynthesis: {
				sProcess: 0.08,
				rProcess: 0.92,
			},
			oxidation: [4, 7],
			prices: {
				2022: 1590.8,
				2020: 3580,
			},
			production: 45,
			radius: {
				atomic: 137e-12,
				covalent: 151e-12,
			},
			resistivity: 193e-9,
			speedOfSound: 4940,
			temperatures: {
				boil: 5869,
				melt: 3459,
			},
			toxicity: 280e-6, // https://en.wikipedia.org/wiki/Rhenium#Precautions
			youngsModulus: 463e9,
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
			appearance: 'silvery blue',
			bulkModulus: 462e9,
			categories: {
				nativeMetal: true,
				nobleMetal: true,
				platinumGroup: true,
				preciousMetal: true,
				refractoryMetal: 0.5,
				tech: 0.5,
			},
			covalentRadius: 130e-12,
			crystal: 'hP',
			density: 22590,
			discovery: 1803,
			electronAffinity: 104e3,
			electronegativity: 2.2,
			ionization: [840e3, 1600e3],
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
			radius: {
				atomic: 135e-12,
				covalent: 144e-12,
			},
			resistivity: 81.2e-9,
			speedOfSound: 4940, // https://www.knowledgedoor.com/2/elements_handbook/speed_of_sound_part_3.html
			temperatures: {
				boil: 5285,
				melt: 3306,
			},
			youngsModulus: 555e9, // computed from poisson ratio + shear modulus
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
			appearance: 'silvery white',
			bulkModulus: 320e9,
			categories: {
				nativeMetal: true,
				nobleMetal: true,
				platinumGroup: true,
				preciousMetal: true,
				refractoryMetal: 0.5,
				tech: true,
			},
			covalentRadius: 135e-12,
			crystal: 'cF',
			density: 22560,
			discovery: 1803,
			electronAffinity: 151e3,
			electronegativity: 2.2,
			ionization: [880e3, 1600e3],
			modelColor: 'rgb(22, 84, 135)',
			nobleMetal: 1,
			nucleosynthesis: {
				sProcess: 0.01,
				rProcess: 0.99,
			},
			oxidation: [3, 4],
			prices: {
				2025: 144678.36, // 31 Oct 2025
				2022: 4455.78/ounce, // year average
				2021: 5081.52/ounce, // year average
				2020: 1628.06/ounce, // year average
			},
			production: 3,
			radius: {
				atomic: 136e-12,
				covalent: 141e-12,
			},
			resistivity: 47.1e-9,
			speedOfSound: 4825,
			temperatures: {
				boil: 4701,
				melt: 2719,
			},
			youngsModulus: 528e9,
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
			appearance: 'silvery white',
			bulkModulus: 230e9,
			categories: {
				df: true,
				nativeMetal: true,
				nobleMetal: true,
				platinumGroup: true,
				preciousMetal: true,
				tech: true,
			},
			covalentRadius: 135e-12,
			crystal: 'cF',
			density: 21460,
			discovery: 1735,
			electronAffinity: 205e3,
			electronConfiguration: '[Xe] 4f14 5d9 6s1',
			electronegativity: 2.28,
			ionization: [870e3, 1791e3],
			modelColor: 'rgb(208, 208, 224)',
			nobleMetal: 1,
			nucleosynthesis: {
				sProcess: 0.05,
				rProcess: 0.95,
			},
			oxidation: [2, 4],
			prices: {
				2026: 64741.96, // 1 Jan 2026
				2022: 966.03/ounce, // year average
				2021: 1095.32/ounce, // year average
				2020: 887.94/ounce, // year average
			},
			production: 239,
			radius: {
				atomic: 139e-12,
				covalent: 136e-12,
				vanDerWaals: 175e-12,
			},
			resistivity: 105e-9,
			speedOfSound: 2800,
			temperatures: {
				boil: 4098,
				melt: 2041.4,
			},
			youngsModulus: 168e9,
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
			appearance: 'gold',
			biologicalHalfLife: 280*day, // Au-198; http://hyperphysics.phy-astr.gsu.edu/hbase/Nuclear/biohalf.html
			bulkModulus: 180e9,
			categories: {
				df: true,
				nativeMetal: true,
				nobleMetal: true,
				coinageMetal: true,
				preciousMetal: true,
				tech: 0.5,
			},
			covalentRadius: 135e-12,
			crystal: 'cF',
			density: 19282,
			discovery: -6000,
			electronAffinity: 223e3,
			electronConfiguration: '[Xe] 4f14 5d10 6s1',
			electronegativity: 2.54,
			ionization: [890.1e3, 1980e3],
			modelColor: 'rgb(255, 209, 35)',
			nobleMetal: 2,
			nucleosynthesis: {
				sProcess: 0.06,
				rProcess: 0.94,
			},
			oxidation: [1, 3],
			prices: {
				2026: 139277.35, // 2 Jan 2026
				2022: 1806.35/ounce,
				2021: 1711.5/ounce,
				2020: 44800,
			},
			production: 2310,
			radius: {
				atomic: 144e-12,
				covalent: 136e-12,
				vanDerWaals: 166e-12,
			},
			resistivity: 24.4e-9,
			speedOfSound: 2030,
			temperatures: {
				boil: 3129,
				melt: 1337.33,
			},
			youngsModulus: 79e9,
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
			appearance: 'silvery',
			biologicalHalfLife: 65*day, // as methylmercury; in blood
			bulkModulus: 25e9, // https://periodictable.com/Properties/A/BulkModulus.al.html
			categories: {
				nativeMetal: 0.5,
				nobleMetal: 0.5,
			},
			covalentRadius: 150e-12,
			crystal: 'hR',
			density: 13533.6,
			discovery: -1500,
			electronAffinity: -50e3,
			electronegativity: 2,
			ionization: [1007.1e3, 1810e3, 3300e3],
			modelColor: 'rgb(184, 184, 208)',
			nobleMetal: 2,
			nucleosynthesis: {
				sProcess: 0.62,
				rProcess: 0.38,
			},
			oxidation: [1, 2],
			prices: {
				2017: 30.2,
				2016: 38.44,
			},
			production: 4e6, // https://pubs.usgs.gov/periodicals/mcs2020/mcs2020-mercury.pdf
			radius: {
				atomic: 151e-12,
				covalent: 132e-12,
				vanDerWaals: 155e-12,
			},
			resistivity: 961e-9,
			speedOfSound: 1454, // https://www.knowledgedoor.com/2/elements_handbook/speed_of_sound_part_2.html
			temperatures: {
				boil: 629.88,
				melt: 234.43,
			},
			toxicity: 44e-6 * workday_of_breathing / human_weight, // "A study has shown that acute exposure (4–8 hours) to calculated elemental mercury levels of 1.1 to 44 mg/m3 resulted in chest pain, dyspnea, cough, hemoptysis, impairment of pulmonary function, and evidence of interstitial pneumonitis."
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
			appearance: 'silvery white',
			bulkModulus: 43e9,
			covalentRadius: 190e-12,
			crystal: 'hP',
			density: 11850,
			discovery: 1862,
			electronAffinity: 31e3,
			electronegativity: 1.62,
			ionization: [589.4e3, 1971e3, 2878e3],
			modelColor: 'rgb(166, 84, 77)',
			nucleosynthesis: {
				sProcess: 0.77,
				rProcess: 0.23,
			},
			oxidation: [1, 3],
			prices: {
				2021: 8400,
				2020: 8200,
				2019: 7600,
				2017: 4200,
			},
			production: 10,
			radius: {
				atomic: 170e-12,
				covalent: 145e-12,
				vanDerWaals: 196e-12,
			},
			resistivity: 180e-9,
			speedOfSound: 818,
			temperatures: {
				boil: 1746,
				melt: 577,
			},
			youngsModulus: 8e9,
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
			appearance: 'grey',
			biologicalHalfLife: 32*day, // 28-36 d in blood
			bulkModulus: 46e9,
			categories: {
				df: true,
				nativeMetal: 0.5,
			},
			covalentRadius: 180e-12,
			crystal: 'cF',
			density: 11342,
			discovery: -7000,
			electronAffinity: 34e3,
			electronegativity: 1.87,
			ionization: [715.6e3, 1450.5e3, 3081.5e3, 4083e3, 6640e3],
			modelColor: 'rgb(87, 89, 97)',
			nucleosynthesis: {
				sProcess: 0.47,
				rProcess: 0.53,
				tech: 0.5,
			},
			oxidation: [2, 4],
			prices: {
				2026: 2.0035, // 2 Jan 2026
				2022: 0.9857/pound,
				2021: 0.8729/pound,
				2019: 2,
			},
			production: 8725e3,
			radius: {
				atomic: 175e-12,
				covalent: 146e-12,
				vanDerWaals: 202e-12,
			},
			resistivity: 208e-9,
			speedOfSound: 1190,
			temperatures: {
				boil: 2022,
				melt: 600.61,
			},
			toxicity: 100e-6 * minute_of_breathing / human_weight, // "at levels of 500 mg/m^3 yttrium is IDLH"
			youngsModulus: 16e9,
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
			appearance: 'brownish silver',
			biologicalHalfLife: 5*day, // https://en.wikipedia.org/wiki/Bismuth#Toxicology_and_ecotoxicology
			bulkModulus: 31e9,
			categories: {
				df: true,
				nativeMetal: 0.5,
				pnictogen: true,
			},
			covalentRadius: 160e-12,
			crystal: 'hR',
			density: 9807,
			discovery: 1000,
			electronAffinity: 91e3,
			electronegativity: 2.02,
			ionization: [703e3, 1610e3, 2466e3, 4370e3, 5400e3, 8520e3],
			modelColor: 'rgb(158, 79, 181)',
			nobleMetal: 3,
			nucleosynthesis: {
				sProcess: 0.005,
				rProcess: 0.995,
			},
			oxidation: [3],
			prices: {
				2022: 3.925/pound,
				2019: 6.36,
			},
			production: 15e3,
			radius: {
				atomic: 156e-12,
				covalent: 148e-12,
				vanDerWaals: 207e-12,
			},
			resistivity: 1.29e-6,
			speedOfSound: 1790,
			temperatures: {
				boil: 1837,
				melt: 544.7,
			},
			youngsModulus: 32e9,
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
			appearance: 'silvery',
			biologicalHalfLife: 40*day, // 30-50 d
			bulkModulus: 26e9, // https://www.knowledgedoor.com/2/elements_handbook/isothermal_bulk_modulus.html
			categories: {
				chalcogen: true,
				metalloid: 0.5,
			},
			covalentRadius: 190e-12,
			crystal: 'cP',
			density: 9320,
			discovery: 1902,
			electronAffinity: 136e3,
			electronegativity: 2,
			ionization: [812.1e3],
			modelColor: 'rgb(171, 92, 0)',
			nobleMetal: 4,
			nucleosynthesis: {
				decay: 1,
			},
			oxidation: [-2, 2, 4],
			prices: {
				2004: 49.2e12,
			},
			production: 100e-6,
			radius: {
				atomic: 168e-12,
				covalent: 140e-12,
				vanDerWaals: 197e-12,
			},
			resistivity: 400e-9,
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
			appearance: 'metallic',
			categories: {
				halogen: true,
				metalloid: 0.5,
			},
			covalentRadius: 147e-12,
			crystal: 'cF',
			density: 8930,
			discovery: 1940,
			electronAffinity: 233e3,
			electronegativity: 2.2,
			ionization: [899.003e3],
			modelColor: 'rgb(117, 79, 69)',
			nobleMetal: 4,
			nucleosynthesis: {
				decay: 1,
			},
			oxidation: [-1, 1],
			// https://www.knowledgedoor.com/2/elements_handbook/astatine.html
			radius: {
				covalent: 147e-12,
				ionic: 62e-12,
			},
			temperatures: {
				boil: 610,
				melt: 575,
			},
			toxicity: ld50_radiation(8.1*hour),
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
			appearance: 'colorless',
			categories: {
				nobleGas: true,
			},
			covalentRadius: 150e-12,
			crystal: 'cF',
			density: 9.73,
			discovery: 1910,
			electronAffinity: -70e3,
			electronegativity: 2.2,
			ionization: [1037e3],
			modelColor: 'rgb(66, 130, 150)',
			nucleosynthesis: {
				decay: 1,
			},
			oxidation: [0],
			radius: {
				covalent: 150e-12,
				vanDerWaals: 220e-12,
			},
			speedOfSound: 2*178-221, // extrapolated from Xenon and Krypton
			temperatures: {
				boil: 211.5,
				melt: 202,
			},
			toxicity: ld50_radiation(3.8235*day),
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
			bulkModulus: 2e9, // https://www.knowledgedoor.com/2/elements_handbook/isothermal_bulk_modulus.html
			categories: {
				alkaliMetal: true,
			},
			covalentRadius: 260e-12,
			crystal: 'cI',
			density: 2480,
			discovery: 1939,
			electronAffinity: 47e3,
			electronegativity: 0.8,
			ionization: [393e3],
			modelColor: 'rgb(66, 0, 102)',
			nucleosynthesis: {
				decay: 1,
			},
			oxidation: [1],
			radius: {
				covalent: 260e-12,
				vanDerWaals: 348e-12,
			},
			resistivity: 3e-6,
			temperatures: {
				boil: 950,
				melt: 300,
			},
			toxicity: ld50_radiation(22*minute),
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
			appearance: 'silvery white metallic',
			biologicalHalfLife: 1.6e4*day, // Ra-226; http://hyperphysics.phy-astr.gsu.edu/hbase/Nuclear/biohalf.html
			bulkModulus: 13.2e9, // https://www.knowledgedoor.com/2/elements_handbook/isothermal_bulk_modulus.html
			categories: {
				aem: true,
			},
			covalentRadius: 221e-12,
			crystal: 'cI',
			density: 5500,
			discovery: 1902,
			electronAffinity: 10e3,
			electronegativity: 0.9,
			ionization: [509.3e3, 979e3],
			modelColor: 'rgb(0, 125, 0)',
			nucleosynthesis: {
				decay: 1,
			},
			oxidation: [2],
			radius: {
				covalent: 221e-12,
				vanDerWaals: 283e-12,
			},
			resistivity: 1e-6,
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
			appearance: 'silvery white',
			bulkModulus: 25e9, // https://www.knowledgedoor.com/2/elements_handbook/isothermal_bulk_modulus.html
			categories: {
				actinide: true,
			},
			covalentRadius: 215e-12,
			crystal: 'cF',
			density: 10070,
			discovery: 1902,
			electronAffinity: 34e3,
			electronConfiguration: '[Rn] 6d1 7s2',
			electronegativity: 1.1,
			ionization: [499e3, 1170e3, 1900e3, 4700e3],
			modelColor: 'rgb(112, 171, 250)',
			nucleosynthesis: {
				decay: 1,
			},
			oxidation: [3],
			prices: {
				2004: 29e12,
			},
			radius: {
				covalent: 215e-12,
			},
			temperatures: {
				boil: 3471,
				melt: 1323,
			},
			toxicity: ld50_radiation(21.772*year),
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
			appearance: 'silvery',
			bulkModulus: 54e9,
			categories: {
				actinide: true,
			},
			covalentRadius: 206e-12,
			crystal: 'cF',
			density: 11720,
			discovery: 1914,
			electronAffinity: 113e3,
			electronConfiguration: '[Rn] 6d2 7s2',
			electronegativity: 1.3,
			ionization: [587e3, 1110e3, 1978e3, 2780e3],
			modelColor: 'rgb(0, 185, 255)',
			nucleosynthesis: {
				rProcess: 1,
			},
			oxidation: [4],
			prices: {
				2019: 72,
				2018: 72,
				2017: 73,
				2016: 176,
				2010: 287,
			},
			production: 1.2e3, // US, est. https://pubs.usgs.gov/periodicals/mcs2020/mcs2020-thorium.pdf
			radius: {
				atomic: 179.8e-12,
				covalent: 206e-12,
			},
			resistivity: 157e-9,
			speedOfSound: 2490,
			temperatures: {
				boil: 5061,
				melt: 2115,
			},
			youngsModulus: 79e9,
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
			appearance: 'silvery',
			biologicalHalfLife: 25*day, // appx.; https://en.wikipedia.org/wiki/Protactinium#Precautions
			bulkModulus: 157e9, // https://www.matweb.com/search/DataSheet.aspx?MatGUID=5008398b32234120a1d10ab3303788bf
			categories: {
				actinide: true,
			},
			covalentRadius: 200e-12,
			crystal: 'tI',
			density: 15370,
			discovery: 1927,
			electronAffinity: 53e3,
			electronConfiguration: '[Rn] 5f2 6d1 7s2',
			electronegativity: 1.5,
			ionization: [568e3, 1128e3, 1814e3, 2991e3],
			modelColor: 'rgb(0, 161, 255)',
			nucleosynthesis: {
				decay: 1,
			},
			oxidation: [5],
			prices: {
				2011: 280e3,
			},
			radius: {
				atomic: 163e-12,
				covalent: 200e-12,
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
			appearance: 'silvery grey metallic',
			biologicalHalfLife: 15*day, // U-235; http://hyperphysics.phy-astr.gsu.edu/hbase/Nuclear/biohalf.html
			bulkModulus: 100e9,
			categories: {
				actinide: true,
			},
			covalentRadius: 196e-12,
			crystal: 'oP',
			density: 18950,
			discovery: 1841,
			electronAffinity: 51e3,
			electronConfiguration: '[Rn] 5f3 6d1 7s2',
			electronegativity: 1.38,
			ionization: [597.6e3, 1420e3, 1900e3, 3145e3],
			modelColor: 'rgb(0, 143, 255)',
			nucleosynthesis: {
				rProcess: 1,
			},
			nutrition: 4,
			oxidation: [4, 6],
			prices: {
				2022: 48.1/pound,
				2018: 101,
			},
			production: 50572,
			radius: {
				atomic: 156e-12,
				covalent: 196e-12,
				vanDerWaals: 186e-12,
			},
			resistivity: 280e-9,
			speedOfSound: 3155,
			temperatures: {
				boil: 4404,
				melt: 1405.3,
			},
			youngsModulus: 208e9,
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
			appearance: 'silvery metallic',
			bulkModulus: 118e9, // https://pilgaardelements.com/Neptunium/Physicals.htm
			categories: {
				actinide: true,
			},
			covalentRadius: 190e-12,
			crystal: 'oP',
			density: 20450,
			discovery: 1940,
			electronAffinity: 46e3,
			electronConfiguration: '[Rn] 5f4 6d1 7s2',
			electronegativity: 1.36,
			ionization: [604.5e3, 1128e3, 1997e3, 3242e3],
			modelColor: 'rgb(0, 128, 255)',
			nucleosynthesis: {
				rProcess: 1,
			},
			oxidation: [5],
			prices: {
				2003: 660e3,
			},
			radius: {
				atomic: 155e-12,
				covalent: 190e-12,
			},
			resistivity: 1.22e-6,
			temperatures: {
				boil: 4273,
				melt: 917,
			},
			youngsModulus: 80e9,
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
			appearance: 'silvery white',
			biologicalHalfLife: 40*year, // in liver
			bulkModulus: 55e9, // https://pilgaardelements.com/Plutonium/Physicals.htm claims 40 GPa but that must be too low
			// is https://www.pnas.org/doi/pdf/10.1073/pnas.1918281117 more accurate???
			prices: {
				2019: 6.49e6,
			},
			categories: {
				actinide: true,
			},
			covalentRadius: 187e-12,
			crystal: 'mP',
			density: 19850,
			discovery: 1940,
			electronAffinity: -48e3,
			electronegativity: 1.28,
			ionization: [584.7e3, 1128e3, 2084e3, 3338e3],
			modelColor: 'rgb(0, 107, 255)',
			nucleosynthesis: {
				rProcess: 1,
			},
			oxidation: [4],
			radius: {
				atomic: 159e-12,
				covalent: 187e-12,
			},
			resistivity: 1.46e-6,
			speedOfSound: 2260,
			temperatures: {
				boil: 3501,
				melt: 912.5,
			},
			toxicity: 5e-6, // "Animal studies found that a few milligrams of plutonium per kilogram of tissue is a lethal dose."
			youngsModulus: 96e9,
		},
	},
	{
		z: 95,
		name: 'Americium',
		symbol: 'Am',
		mass: 243,
		period: 7,
		properties: {
			appearance: 'silvery white',
			biologicalHalfLife: 7*day, // "If consumed, most of the americium is excreted within a few days,"
			bulkModulus: 45e9, // https://www.matweb.com/search/datasheet.aspx?matguid=20003a10845d4b97ba300b9e7fe50bc5&ckck=1
			categories: {
				actinide: true,
			},
			covalentRadius: 180e-12,
			crystal: 'hP',
			density: 12000,
			discovery: 1944,
			electronAffinity: 10e3,
			electronegativity: 1.13,
			ionization: [578e3, 1158e3, 2132e3, 3493e3],
			modelColor: 'rgb(84, 92, 242)',
			prices: {
				2004: 750e3,
				1998: 728e3,
			},
			oxidation: [3],
			radius: {
				atomic: 173e-12,
				covalent: 180e-12,
			},
			resistivity: 690e-9,
			temperatures: {
				boil: 2284, // CRC
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
			appearance: 'silvery metallic',
			bulkModulus: 37e9, // https://www.matweb.com/search/DataSheet.aspx?MatGUID=656675e27bab42d19fcc4d600a52de49
			categories: {
				actinide: true,
			},
			covalentRadius: 169e-12,
			crystal: 'hP',
			density: 13510,
			discovery: 1944,
			electronAffinity: 27e3,
			electronConfiguration: '[Rn] 5f7 6d1 7s2',
			electronegativity: 1.28,
			ionization: [581e3, 1196e3, 2026e3, 3550e3],
			modelColor: 'rgb(120, 92, 227)',
			oxidation: [3],
			prices: {
				2004: 185e6,
			},
			radius: {
				atomic: 174e-12,
				covalent: 169e-12,
			},
			resistivity: 1.25e-6,
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
			appearance: 'silvery',
			bulkModulus: 52e9, // https://www.matweb.com/search/DataSheet.aspx?MatGUID=17bfc4cdbfd24550b8ecf9038881b27d
			categories: {
				actinide: true,
			},
			covalentRadius: 168e-12,
			crystal: 'hP',
			density: 14790,
			discovery: 1949,
			electronAffinity: -165e3,
			electronegativity: 1.3,
			ionization: [601e3, 1186e3, 2152e3, 3434e3],
			modelColor: 'rgb(138, 79, 227)',
			oxidation: [3],
			prices: {
				2004: 185e9,
			},
			radius: {
				atomic: 170e-12,
			},
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
			appearance: 'silvery',
			bulkModulus: 50e9, // https://www.matweb.com/search/DataSheet.aspx?MatGUID=a2d1c04f5ba140d6ac8934564d716513
			categories: {
				actinide: true,
			},
			covalentRadius: 168e-12,
			crystal: 'hP',
			density: 15100,
			discovery: 1950,
			electronAffinity: -97e3,
			electronegativity: 1.3,
			ionization: [608e3, 1206e3, 2267e3, 3599e3],
			modelColor: 'rgb(161, 54, 212)',
			oxidation: [3],
			prices: {
				2004: 906e9,
			},
			production: 0.275e-6,
			// https://www.knowledgedoor.com/2/elements_handbook/californium.html
			radius: {
				covalent: 168e-12,
				ionic: 95e-12,
			},
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
			appearance: 'silvery',
			bulkModulus: 15e9, // https://www.matweb.com/search/DataSheet.aspx?MatGUID=07746507cfdc4f10a68657963161957a
			categories: {
				actinide: true,
			},
			covalentRadius: 165e-12,
			crystal: 'cF',
			density: 8840,
			discovery: 1952,
			electronAffinity: -29e3,
			electronegativity: 1.3,
			ionization: [619e3, 1216e3, 2334e3, 3734e3],
			modelColor: 'rgb(179, 31, 212)',
			oxidation: [3],
			// https://www.knowledgedoor.com/2/elements_handbook/einsteinium.html
			radius: {
				covalent: 165e-12,
			},
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
			bulkModulus: 15e9, // https://www.matweb.com/search/DataSheet.aspx?MatGUID=6f7e439602524a21b27dbbdc98cd4e1b
			categories: {
				actinide: true,
			},
			covalentRadius: 167e-12,
			crystal: 'cF',
			density: 9700,
			discovery: 1952,
			electronAffinity: 34e3,
			electronegativity: 1.3,
			ionization: [629e3, 1225e3, 2363e3, 3792e3],
			modelColor: 'rgb(179, 31, 186)',
			oxidation: [3],
			// https://www.knowledgedoor.com/2/elements_handbook/fermium.html
			radius: {
				covalent: 167e-12,
			},
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
			covalentRadius: 173e-12,
			crystal: 'cF',
			density: 10300,
			discovery: 1955,
			electronAffinity: 94e3,
			electronegativity: 1.3,
			ionization: [636e3, 1235e3, 2470e3, 3840e3],
			modelColor: 'rgb(179, 13, 166)',
			oxidation: [3],
			radius: {
				covalent: 173e-12, // https://www.knowledgedoor.com/2/elements_handbook/mendelevium.html
				ionic: 90e-12, // four estimates were given
				metallic: 194e-12,
			},
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
			covalentRadius: 176e-12,
			crystal: 'cF',
			density: 9900,
			discovery: 1966,
			electronAffinity: -223e3,
			electronegativity: 1.3,
			ionization: [639e3, 1254e3, 2643e3, 3956e3],
			modelColor: 'rgb(189, 13, 135)',
			oxidation: [2],
			radius: {
				covalent: 176e-12, // https://www.knowledgedoor.com/2/elements_handbook/nobelium.html
				ionic: 100e-12,
				metallic: 197e-12,
			},
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
			appearance: 'silvery',
			categories: {
				actinide: true,
			},
			covalentRadius: 161e-12,
			crystal: 'hP',
			density: 14400,
			discovery: 1961,
			electronAffinity: -30e3,
			electronConfiguration: '[Rn] 5f14 7s2 7p1',
			electronegativity: 1.3,
			ionization: [479e3, 1428e3, 2228e3, 4910e3],
			modelColor: 'rgb(199, 0, 102)',
			oxidation: [3],
			radius: {
				covalent: 161e-12, // https://www.knowledgedoor.com/2/elements_handbook/lawrencium.html
				ionic: 88.6e-12,
				metallic: 157e-12,
			},
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
			covalentRadius: 157e-12,
			crystal: 'hP',
			density: 17000,
			discovery: 1969,
			ionization: [580e3, 1390e3, 2300e3, 3080e3],
			modelColor: 'rgb(204, 0, 89)',
			oxidation: [3, 4],
			radius: {
				atomic: 150e-12,
				covalent: 157e-12,
			},
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
			covalentRadius: 149e-12,
			crystal: 'cI',
			density: 21600,
			discovery: 1970,
			ionization: [665e3, 1547e3, 2378e3, 3299e3, 4305e3],
			modelColor: 'rgb(209, 0, 79)',
			oxidation: [5],
			radius: {
				atomic: 139e-12,
				covalent: 149e-12,
			},
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
			covalentRadius: 143e-12,
			crystal: 'cI',
			density: 23500,
			discovery: 1974,
			ionization: [757e3, 1733e3, 2484e3, 3416e3, 4562e3, 5716e3],
			modelColor: 'rgb(217, 0, 69)',
			oxidation: [4, 6],
			radius: {
				atomic: 132e-12,
				covalent: 143e-12,
			},
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
			covalentRadius: 141e-12,
			crystal: 'hP',
			density: 26500,
			discovery: 1981,
			ionization: [740e3, 1690e3, 2570e3, 3600e3, 4730e3, 5990e3, 7230e3],
			modelColor: 'rgb(224, 0, 56)',
			nobleMetal: 5,
			oxidation: [3, 4, 5, 7],
			radius: {
				atomic: 128e-12,
				covalent: 141e-12,
			},
		},
	},
	{
		z: 108,
		name: 'Hassium',
		symbol: 'Hs',
		mass: 271,
		group: 8,
		period: 7,
		properties: {
			covalentRadius: 134e-12,
			crystal: 'hP',
			density: 28000,
			discovery: 1984,
			ionization: [730e3, 1760e3, 2830e3, 3640e3, 4940e3, 6180e3, 7540e3, 8860e3],
			modelColor: 'rgb(230, 0, 46)',
			nobleMetal: 5,
			oxidation: [3, 4, 8],
			radius: {
				atomic: 126e-12,
				covalent: 134e-12,
			},
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
			covalentRadius: 129e-12,
			crystal: 'cF',
			density: 27500,
			discovery: 1982,
			ionization: [800e3, 1820e3, 2900e3, 3900e3, 4900e3],
			modelColor: 'rgb(235, 0, 38)',
			nobleMetal: 5,
			oxidation: [1, 3, 6],
			radius: {
				atomic: 128e-12,
				covalent: 129e-12,
			},
		},
	},
	{
		z: 110,
		name: 'Darmstadtium',
		symbol: 'Ds',
		mass: 282,
		group: 10,
		period: 7,
		properties: {
			covalentRadius: 128e-12,
			crystal: 'cI',
			density: 26500,
			discovery: 1994,
			ionization: [960e3, 1890e3, 3030e3, 4000e3, 5100e3],
			modelColor: 'rgb(239, 0, 29)', // extrapolation
			nobleMetal: 5,
			oxidation: [0, 2, 8],
			radius: {
				atomic: 132e-12,
				covalent: 128e-12,
			},
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
			covalentRadius: 121e-12,
			crystal: 'cI',
			density: 23000,
			discovery: 1994,
			electronAffinity: 151e3,
			ionization: [1020e3, 2070e3, 3080e3, 4100e3, 5300e3],
			modelColor: 'rgb(242, 0, 19)', // extrapolation
			nobleMetal: 5,
			oxidation: [3],
			radius: {
				atomic: 138e-12,
				covalent: 121e-12,
			},
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
			covalentRadius: 122e-12,
			crystal: 'hP',
			density: 14000,
			discovery: 1996,
			electronAffinity: -1, // <0
			ionization: [1155e3, 2170e3, 3160e3, 4200e3, 5500e3],
			modelColor: 'rgb(244, 0, 9)', // extrapolation
			nobleMetal: 5,
			oxidation: [0, 2],
			radius: {
				atomic: 147e-12,
				covalent: 122e-12,
			},
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
			covalentRadius: 176e-12,
			crystal: 'hP',
			density: 16000,
			discovery: 2003,
			electronAffinity: 67e3,
			ionization: [707.2e3, 2309e3, 3226e3, 4382e3, 5638e3],
			modelColor: 'rgb(166, 51, 39)', // extrapolation
			nobleMetal: 5,
			oxidation: [1, 3],
			radius: {
				atomic: 170e-12,
				covalent: (172e-12 + 180e-12)/2,
			},
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
			covalentRadius: 174e-12,
			crystal: 'cF', // https://en.wikipedia.org/wiki/Flerovium#Atomic_and_physical
			density: 11400,
			discovery: 1999,
			electronAffinity: -1, // <0
			ionization: [832.2e3, 1600e3, 3370e3, 4400e3, 5850e3],
			modelColor: 'rgb(62, 50, 66)', // extrapolation
			nobleMetal: 5,
			oxidation: [2],
			radius: {
				atomic: 180e-12,
				covalent: (171e-12 + 177e-12)/2,
			},
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
			covalentRadius: 157e-12,
			categories: {
				pnictogen: true,
			},
			density: 13500,
			discovery: 2003,
			electronAffinity: 35e3,
			ionization: [538.3e3, 1760e3, 2650e3, 4680e3, 5720e3],
			modelColor: 'rgb(158, 59, 181)', // extrapolation
			oxidation: [1, 3],
			radius: {
				atomic: 187e-12,
				covalent: 157e-12,
			},
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
		mass: 293,
		group: 16,
		period: 7,
		properties: {
			categories: {
				chalcogen: true,
			},
			covalentRadius: 164e-12,
			density: 12900,
			discovery: 2000,
			electronAffinity: 75e3,
			ionization: [663.9e3, 1330e3, 2850e3, 3810e3, 6080e3],
			modelColor: 'rgb(130, 60, 0)', // extrapolation
			nobleMetal: 5,
			oxidation: [2],
			radius: {
				atomic: 183e-12,
				covalent: 164e-12,
			},
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
			appearance: 'semimetallic',
			categories: {
				halogen: true,
			},
			covalentRadius: 156.5e-12,
			density: 7200,
			discovery: 2009,
			electronAffinity: 166e3,
			ionization: [736.9e3, 1435.4e3, 2161.9e3, 4012.9e3, 5076.4e3],
			modelColor: 'rgb(94, 63, 55)', // extrapolation
			oxidation: [1, 3],
			radius: {
				atomic: 138e-12,
				covalent: 156.5e-12,
			},
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
			appearance: 'metallic',
			categories: {
				nobleGas: true,
			},
			covalentRadius: 157e-12,
			crystal: 'cF',
			density: 7200,
			discovery: 2002,
			electronAffinity: 8e3,
			ionization: [860.1e3, 1560e3],
			modelColor: 'rgb(66, 102, 124)', // extrapolation
			oxidation: [2, 4],
			radius: {
				atomic: 152e-12,
				covalent: 157e-12,
			},
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
			covalentRadius: 272e-12,
			crystal: 'cI',
			density: 3000,
			ionization: [463.1e3, 1698.1e3],
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
			covalentRadius: 208e-12,
			crystal: 'cI',
			density: 7000,
			ionization: [563.3e3, (919e3+895e3)/2],
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
			electronConfiguration: '[Og] 8s2 8p1',
			ionization: [429.4e3, 1110e3, 1710e3, 4270e3],
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
			electronConfiguration: '[Og] 7d1 8s2 8p1',
			ionization: [545, 1090, 1848, 2520],
			oxidation: [4],
		},
	},
	{
		z: 123,
		name: 'Unbitrium',
		symbol: 'Ubt',
		mass: 321, // predicted to be the most stable
		period: 8,
		properties: {
			categories: {
				superactinide: true,
			},
			oxidation: [5],
		},
	},
	{
		z: 124,
		name: 'Unbiquadium',
		symbol: 'Ubq',
		mass: 323, // predicted to be the most stable
		period: 8,
		properties: {
			categories: {
				superactinide: true,
			},
			oxidation: [6],
		},
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
			electronConfiguration: '[Og] 5g2 6f3 8s2 8p1',
			oxidation: [4, 6, 8],
		},
	},
	{
		z: 146,
		name: 'Unquadhexium',
		symbol: 'Uqh',
		mass: 380, // guess
		period: 8,
	},
	{
		z: 165,
		name: 'Unhexpentium',
		symbol: 'Uhp',
		mass: 429, // guess
		group: 11,
		period: 8,
	},
	{
		z: 172,
		name: 'Unseptbium',
		symbol: 'Usb',
		mass: 447, // guess
		group: 18,
		period: 8,
	},
	*/
];