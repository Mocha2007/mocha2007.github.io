/* global pi */
/* exported data */
'use strict';

const au = 149597870700; // m; exact
const ly = 9460730472580800; // m; exact
const pc = 648e3*au/pi; // m; exact

const data = [
	// Sun, as an example
	{
		name: 'Sun',
		type: 'sun',
		dist: 0, // in m
		ra: [0, 0, 0], // h min s
		dec: [0, 0, 0], // deg arcmin arcsec
		img: 'https://upload.wikimedia.org/wikipedia/commons/5/54/Sun_white.jpg',
	},
	{
		name: 'Sgr A*',
		type: 'star',
		dist: 26673*ly,
		ra: [17, 45, 40.0409],
		dec: [-29, 0, 28.118],
		img: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Sagittarius_A%2A.jpg',
	},
	// Some distant solar system objects, for scale...
	{
		name: 'Neptune',
		type: 'planet',
		dist: 30.87*au,
		ra: [23, 29, 50.3], // location on 29 Mar 2021
		dec: [-4, 25, 23.8],
		img: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg',
	},
	{
		name: 'Planet Nine',
		type: 'planet',
		dist: 630*au,
		ra: [2, 0, 0], // est.
		dec: [-20, 0, 0],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Planet_nine_artistic_plain.png/640px-Planet_nine_artistic_plain.png',
	},
	// main
	// nearby stars (sort by dist)
	{
		name: 'Proxima Centauri',
		type: 'star',
		dist: 4.2465*ly,
		ra: [14, 29, 42.94853],
		dec: [-60, 40, 46.1631],
		img: 'https://upload.wikimedia.org/wikipedia/commons/9/95/New_shot_of_Proxima_Centauri%2C_our_nearest_neighbour.jpg',
	},
	{
		name: 'Alpha Centauri',
		type: 'star',
		dist: 4.37*ly,
		ra: [14, 39, 36],
		dec: [-60, 50, 9],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Alpha%2C_Beta_and_Proxima_Centauri_%281%29.jpg/640px-Alpha%2C_Beta_and_Proxima_Centauri_%281%29.jpg',
	},
	{
		name: 'Barnard\'s Star',
		type: 'star',
		dist: 5.958*ly,
		ra: [17, 57, 48.49803],
		dec: [4, 41, 36.2072],
		img: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Barnardstar2006.jpg',
	},
	{
		name: 'Luhman 16',
		type: 'star',
		dist: 6.516*ly,
		ra: [10, 49, 18.723],
		dec: [-53, 19, 9.86],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Two_Brown_Dwarfs_in_Our_Backyard.jpg/599px-Two_Brown_Dwarfs_in_Our_Backyard.jpg',
	},
	{
		name: 'WISE 0855−0714',
		type: 'star',
		dist: 7.27*ly,
		ra: [8, 55, 10.83],
		dec: [-7, 14, 42.5],
		img: 'https://upload.wikimedia.org/wikipedia/commons/0/01/WISE_J085510.83%E2%80%93071442.5_movement_%28PIA18002%29.gif',
	},
	{
		name: 'Wolf 359',
		type: 'star',
		dist: 7.86*ly,
		ra: [10, 56, 28.99],
		dec: [7, 0, 52],
	},
	{
		name: 'Lalande 21185',
		type: 'star',
		dist: 8.31*ly,
		ra: [11, 3, 20.194],
		dec: [35, 58, 11.5682],
	},
	{
		name: 'Sirius',
		type: 'star',
		dist: 8.6*ly,
		ra: [6, 45, 8.91728],
		dec: [-16, 42, 58.0171],
		img: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Sirius_A_and_B_Hubble_photo.jpg',
	},
	{
		name: 'Van Maanen 2',
		type: 'star',
		dist: 14.074*ly,
		ra: [0, 49, 9.89841],
		dec: [5, 23, 18.9931],
	},
	{
		name: '40 Eridani',
		type: 'star',
		dist: 16.26*ly,
		ra: [4, 15, 16.31963],
		dec: [-7, 39, 10.3404],
		desc: 'Said to be home to the Vulcan homeworld',
	},
	{
		name: 'Altair',
		type: 'star',
		dist: 16.73*ly,
		ra: [19, 50, 46.99855],
		dec: [8, 52, 5.9563],
		img: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Altair_PR_image6_%28white%29.jpg',
	},
	{
		name: 'Algol',
		type: 'star',
		dist: 90*ly,
		ra: [3, 8, 10.13245],
		dec: [40, 57, 20.3280],
		img: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Algol_AB_movie_imaged_with_the_CHARA_interferometer_-_labeled.gif',
	},
	{
		name: 'Gamma2 Sagittarii',
		type: 'star',
		dist: 96.9*ly,
		ra: [18, 5, 48.4881],
		dec: [-30, 25, 26.7235],
	},
	{
		name: 'Omega Leonis',
		type: 'star',
		dist: 108*ly,
		ra: [9, 28, 27.39861],
		dec: [9, 3, 24.4255],
	},
	{
		name: 'HD 162826',
		type: 'star',
		dist: 110*ly,
		ra: [17, 51, 14.02244],
		dec: [40, 4, 20.8772],
		desc: 'First discovered solar sibling: a star born from the same stellar nursery.',
	},
	{
		name: 'Cor Caroli',
		type: 'star',
		dist: 115*ly,
		ra: [12, 56, 0],
		dec: [38, 19, 0],
		desc: 'α² CVn variable lectotype',
	},
	{
		name: 'Iota Geminorum',
		type: 'star',
		dist: 120.4*ly,
		ra: [7, 25, 43.59532],
		dec: [27, 47, 53.0929],
		desc: 'Said to be the home system of the tribbles in the Star Trek universe.',
	},
	{
		name: 'Beta2 Sagittarii',
		type: 'star',
		dist: 134*ly,
		ra: [19, 23, 13.13745],
		dec: [-44, 47, 59.2051],
	},
	{
		name: 'Epsilon Sagittarii',
		type: 'star',
		dist: 143*ly,
		ra: [18, 24, 10.3184],
		dec: [-34, 23, 4.6193],
		desc: 'Said to be home to the Klingon homeworld QoʼnoS',
	},
	{
		name: 'R Doradus',
		type: 'star',
		dist: 178*ly,
		ra: [4, 36, 45.59127],
		dec: [-62, 4, 37.7974],
		img: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/R_Doradus_ESO.jpg',
	},
	{
		name: 'Rukbat',
		type: 'star',
		dist: 182*ly,
		ra: [19, 23, 53.17483],
		dec: [-40, 36, 57.3705],
	},
	{
		name: 'Mira',
		type: 'star',
		dist: 300*ly,
		ra: [2, 19, 20.79210],
		dec: [-2, 58, 39.4956],
		img: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Mira_1997.jpg',
	},
	{
		name: 'Beta1 Sagittarii',
		type: 'star',
		dist: 310*ly,
		ra: [19, 22, 38.2977],
		dec: [-44, 27, 32.2458],
	},
	{
		name: 'Canopus',
		type: 'star',
		dist: 310*ly,
		ra: [6, 23, 57.10988],
		dec: [-52, 41, 44.381],
	},
	{
		name: '21 Persei',
		type: 'star',
		dist: 331*ly,
		ra: [2, 57, 17.28228],
		dec: [31, 56, 3.1976],
		desc: 'Mocha was born under this star',
	},
	{
		name: 'Polaris',
		type: 'star',
		dist: 378*ly,
		ra: [2, 31, 49.09],
		dec: [89, 15, 50.8],
	},
	{
		name: 'Epsilon Centauri',
		type: 'star',
		dist: 430*ly,
		ra: [13, 39, 53.25774],
		dec: [-53, 27, 59.0081],
	},
	{
		name: 'T Tauri',
		type: 'star',
		dist: 471*ly,
		ra: [4, 21, 59.43445],
		dec: [19, 32, 6.4182],
		img: 'https://upload.wikimedia.org/wikipedia/commons/7/76/Ngc1555.jpg',
	},
	{
		name: '19 Arietis',
		type: 'star',
		dist: 480*ly,
		ra: [2, 13, 3.3044],
		dec: [15, 16, 47.5005],
	},
	{
		name: 'Pi 1 Gruis',
		type: 'star',
		dist: 530*ly,
		ra: [22, 22, 44.20571],
		dec: [-45, 56, 52.6115],
		img: 'https://upload.wikimedia.org/wikipedia/commons/d/df/The_surface_of_the_red_giant_star_%CF%801_Gruis_from_PIONIER_on_the_VLT.jpg',
	},
	{
		name: 'Betelgeuse',
		type: 'star',
		dist: 548*ly,
		ra: [5, 55, 10.30536],
		dec: [7, 24, 25.4304],
		img: 'https://upload.wikimedia.org/wikipedia/commons/5/57/Betelgeuse_captured_by_ALMA.jpg',
	},
	{
		name: 'Antares',
		type: 'star',
		dist: 550*ly,
		ra: [16, 29, 24.4597],
		dec: [-26, 25, 55.2094],
		img: 'https://upload.wikimedia.org/wikipedia/commons/f/f4/VLTI_reconstructed_view_of_the_surface_of_Antares.jpg',
	},
	{
		name: 'Lambda Scorpii',
		type: 'star',
		dist: 570*ly,
		ra: [17, 33, 36.52],
		dec: [-37, 6, 13.76],
	},
	{
		name: 'Rigel',
		type: 'star',
		dist: 860*ly,
		ra: [5, 14, 32.2721],
		dec: [-8, 12, 5.8981],
	},
	{
		name: 'Mu Sagittarii',
		type: 'star',
		dist: 920*ly,
		ra: [18, 13, 45.8],
		dec: [-21, 3, 32],
	},
	{
		name: '7 Vulpeculae',
		type: 'star',
		dist: 940*ly,
		ra: [19, 29, 20.8974],
		dec: [20, 16, 47.0583],
	},
	{
		name: 'X Sagittarii',
		type: 'star',
		dist: 950*ly,
		ra: [17, 47, 33.6241],
		dec: [-27, 49, 50.849],
	},
	{
		name: 'Zeta Puppis',
		type: 'star',
		dist: 1080*ly,
		ra: [8, 3, 35.1],
		dec: [-40, 0, 11.6],
	},
	{
		name: 'T Leporis',
		type: 'star',
		dist: 1100*ly,
		ra: [5, 4, 50.85],
		dec: [-21, 54, 16.5],
		img: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/T_Leporis.jpg',
	},
	{
		name: 'Mintaka',
		type: 'star',
		dist: 1200*ly,
		ra: [5, 32, 0.40009],
		dec: [0, -17, -56.7424],
	},
	{
		name: 'Gamma Velorum',
		type: 'star',
		dist: 379*pc, // ~1237
		ra: [8, 9, 31.95013],
		dec: [-47, 20, 11.7108],
	},
	{
		name: 'Alnitak',
		type: 'star',
		dist: 1260*ly,
		ra: [5, 40, 45.52666],
		dec: [-1, 56, 34.2649],
		img: 'https://upload.wikimedia.org/wikipedia/commons/b/b2/Ngc2024_2mass.jpg',
	},
	{
		name: 'Eta Leonis',
		type: 'star',
		dist: 1270*ly,
		ra: [10, 7, 19.95186],
		dec: [16, 45, 45.592],
	},
	{
		name: 'W Sagittarii',
		type: 'star',
		dist: 409*pc, // ~1334 ly
		ra: [18, 5, 1.22409],
		dec: [-29, 34, 48.3199],
	},
	{
		name: 'Theta 1 Orionis C',
		type: 'star',
		dist: 410*pc, // ~1337 ly
		ra: [5, 35, 16.46375],
		dec: [-5, 23, 22.8486],
		img: 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Theta1-Orionis-C.png',
	},
	{
		name: 'Y Sagittarii',
		type: 'star',
		dist: 1500*ly,
		ra: [18, 21, 22.98643],
		dec: [-18, 51, 36.0018],
	},
	{
		name: 'Wezen',
		type: 'star',
		dist: 1600*ly,
		ra: [7, 8, 23.48608],
		dec: [-26, 23, 35.5474],
	},
	{
		name: 'Gamma Cygni',
		type: 'star',
		dist: 1800*ly,
		ra: [20, 22, 13.70184],
		dec: [40, 15, 24.045],
	},
	{
		name: 'Alnilam',
		type: 'star',
		dist: 2000*ly,
		ra: [5, 36, 12.8],
		dec: [-1, 12, 6.9],
	},
	{
		name: 'Aludra',
		type: 'star',
		dist: 2000*ly,
		ra: [7, 24, 5.70228],
		dec: [-29, 18, 11.1798],
	},
	{
		name: 'PSR B0943+10',
		type: 'star',
		dist: 630*pc, // ~2055 ly
		ra: [9, 46, 7.31],
		dec: [9, 51, 57.3],
	},
	{
		name: 'Deneb',
		type: 'star',
		dist: 2615*ly,
		ra: [20, 41, 25.9],
		dec: [45, 16, 49],
	},
	{
		name: 'Chi Aurigae',
		type: 'star',
		dist: 3032*ly,
		ra: [5, 32, 43.67312],
		dec: [32, 11, 31.2753],
	},
	{
		name: 'Mu Cephei',
		type: 'star',
		dist: 940*pc, // ~3066 ly
		ra: [21, 43, 30.4609],
		dec: [58, 46, 48.166],
	},
	{
		name: 'Rho Cassiopeiae',
		type: 'star',
		dist: 1050*pc, // ~3425 ly
		ra: [23, 54, 23],
		dec: [57, 29, 58],
	},
	{
		name: 'Kappa Cassiopeiae',
		type: 'star',
		dist: 4e3*ly,
		ra: [0, 32, 59.991],
		dec: [62, 55, 54.42],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Kappa_Cassiopeiae.jpg/631px-Kappa_Cassiopeiae.jpg',
	},
	{
		name: 'V838 Monocerotis',
		type: 'star',
		dist: 5900*ly,
		ra: [7, 4, 4.85],
		dec: [-3, 50, 50.1],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/V838_Mon_HST.jpg/600px-V838_Mon_HST.jpg',
	},
	{
		name: 'Alpha Camelopardalis',
		type: 'star',
		dist: 6e3*ly,
		ra: [4, 54, 3.01040],
		dec: [66, 20, 33.6365],
	},
	{
		name: 'Tycho G',
		type: 'star',
		dist: 6e3*ly,
		ra: [0, 25, 23.59],
		dec: [64, 8, 2],
		img: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/SN1572.Companion.jpg',
	},
	{
		name: 'Eta Carinae',
		type: 'star',
		dist: 7500*ly,
		ra: [10, 45, 3.591],
		dec: [-59, 41, 4.26],
		img: 'https://upload.wikimedia.org/wikipedia/commons/f/fc/Eta_Carinae.jpg',
	},
	{
		name: 'WR 102',
		type: 'star',
		dist: 9400*ly,
		ra: [17, 45, 47.5],
		dec: [-26, 10, 27],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/WR102_Ejecta_Nebula.png/604px-WR102_Ejecta_Nebula.png',
	},
	{
		name: '3C 58',
		type: 'star',
		dist: 10e3*ly,
		ra: [2, 5, 38],
		dec: [64, 49.7, 0],
		img: 'https://upload.wikimedia.org/wikipedia/commons/3/34/3C58_chandra.jpg',
	},
	{
		name: 'WR 1',
		type: 'star',
		dist: 3150*pc, // ~10,274 ly
		ra: [0, 43, 28.39827],
		dec: [64, 45, 35.4011],
	},
	{
		name: 'HR 5171',
		type: 'star',
		dist: 13e3*ly,
		ra: [13, 47, 10],
		dec: [-62, 35, 20],
		img: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/HR_5171_A_potw1740a.png',
	},
	{
		name: 'Great Annihilator',
		type: 'star',
		dist: 5e3*pc, // ~16,308 ly
		ra: [17, 43, 54.83],
		dec: [-29, 44, 42.6],
	},
	{
		name: 'XTE J1739-285',
		type: 'star',
		dist: 39e3*ly,
		ra: [17, 39, 53.95],
		dec: [-28, 29, 46.8],
	},
	{
		name: 'SGR 1806−20',
		type: 'star',
		dist: 50e3*ly,
		ra: [18, 8, 39.32],
		dec: [-20, 24, 39.5],
	},
	{
		name: 'UDF 2457',
		type: 'star',
		dist: 59e3*ly,
		ra: [3, 32, 38.79],
		dec: [-27, 48, 10],
		img: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/UDF2457-mdwarf-star.jpg',
	},
	// not stars, not in NGC, in milky way; sort by dist
	{
		name: 'Ursa Major Moving Group',
		type: 'moving group',
		dist: 80*ly,
		ra: [12, 0, 0],
		dec: [56, 0, 0],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Ursa_Major_%C5%81azy.jpg/640px-Ursa_Major_%C5%81azy.jpg',
	},
	{
		name: 'AB Doradus Moving Group',
		type: 'moving group',
		dist: 100*ly,
		ra: [5, 29, 0],
		dec: [-65, 27, 0],
	},
	{
		name: 'Beta Pictoris Moving Group',
		type: 'moving group',
		dist: 115*ly,
		ra: [5, 47, 0],
		dec: [-51, 4, 0],
	},
	{
		name: 'Tucana-Horologium Association',
		type: 'stellar association',
		dist: 150*ly,
		ra: [23, 0, 0],
		dec: [-54, 0, 0],
	},
	{
		name: 'Hyades',
		type: 'open cluster',
		dist: 153*ly,
		ra: [4, 27, 0],
		dec: [15, 52, 0],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Hyades.jpg/640px-Hyades.jpg',
		href: 'https://en.wikipedia.org/wiki/Hyades_(star_cluster)',
		radius: 10*ly,
	},
	{
		name: 'Coma Star Cluster',
		type: 'open cluster',
		dist: 280*ly,
		ra: [12, 22.5, 0],
		dec: [25, 51, 0],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/ComaCluster.jpg/640px-ComaCluster.jpg',
		radius: 7*ly, // personal estimate
	},
	{
		name: 'Taurus Molecular Cloud',
		type: 'molecular cloud',
		dist: 430*ly,
		ra: [4, 41, 0],
		dec: [25, 52, 0],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Herschel%E2%80%99s_view_of_the_Taurus_molecular_cloud_ESA384012.jpg/800px-Herschel%E2%80%99s_view_of_the_Taurus_molecular_cloud_ESA384012.jpg',
		radius: 40*ly, // personal estimate
	},
	{
		name: 'Pleiades',
		type: 'open cluster',
		dist: 444*ly,
		ra: [3, 47, 24],
		dec: [24, 7, 0],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Pleiades_large.jpg/640px-Pleiades_large.jpg',
		radius: 8*ly,
	},
	{
		name: 'Barnard 68',
		type: 'molecular cloud',
		dist: 500*ly,
		ra: [17, 22, 38.2],
		dec: [-23, 49, 34],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Barnard_68.jpg/600px-Barnard_68.jpg',
		radius: 0.25*ly,
	},
	{
		name: 'IC 2602',
		type: 'open cluster',
		dist: 547*ly,
		ra: [10, 42, 57.5],
		dec: [-64, 23, 29],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/The_Southern_Pleiades_%28IC_2602%29.jpg/629px-The_Southern_Pleiades_%28IC_2602%29.jpg',
		radius: 8*ly, // personal estimate
	},
	{
		name: 'Alpha Persei Cluster',
		type: 'open cluster',
		dist: 570*ly,
		ra: [3, 26, 42],
		dec: [48, 48, 0],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Melotte_20.jpg/591px-Melotte_20.jpg',
		radius: 25*ly, // personal estimate
	},
	{
		name: 'IC 2391',
		type: 'open cluster',
		dist: 574*ly,
		ra: [8, 40.6, 0],
		dec: [-53, 2, 0],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/IC_2391_in_Vele.jpg/678px-IC_2391_in_Vele.jpg',
		radius: 5*ly, // personal estimate
	},
	{
		name: 'Beehive Cluster',
		type: 'open cluster',
		dist: 610*ly,
		ra: [8, 40.4, 0],
		dec: [19, 59, 0],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/M44_Heggie.jpg/600px-M44_Heggie.jpg',
		radius: 12.7*ly,
	},
	{
		name: 'RX J0852.0−4622',
		type: 'supernova remnant',
		dist: 700*ly,
		ra: [8, 52, 0],
		dec: [-46, 22, 0],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Supernova_Remnant_G266.2-1.2.jpg/326px-Supernova_Remnant_G266.2-1.2.jpg',
	},
	{
		name: 'Abell 36',
		type: 'planetary nebula',
		dist: 780*ly,
		ra: [13, 40, 41.34369],
		dec: [-19, 52, 55.32],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/ESO_577-24_FORS2_VLT.jpg/551px-ESO_577-24_FORS2_VLT.jpg',
	},
	{
		name: 'Vela Supernova Remnant',
		type: 'supernova remnant',
		dist: 815*ly,
		ra: [8, 35, 20.66],
		dec: [-45, 10, 35.2],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Vela_Supernova_Remnant_by_Harel_Boren_%28155256626%29.jpg/640px-Vela_Supernova_Remnant_by_Harel_Boren_%28155256626%29.jpg',
	},
	{
		name: 'Berkeley 87',
		type: 'open cluster',
		dist: 946*ly,
		ra: [20, 21, 43.01],
		dec: [37, 22, 13.8],
		img: 'https://upload.wikimedia.org/wikipedia/commons/b/b7/Be087.jpg',
	},
	{
		name: 'Perseus Molecular Cloud',
		type: 'molecular cloud',
		dist: 1000*ly,
		ra: [3, 35, 0],
		dec: [31, 13, 0],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/PIA23405-PerseusMolecularCloud-FullRez.jpg/800px-PIA23405-PerseusMolecularCloud-FullRez.jpg',
		radius: 35*ly, // personal estimate
	},
	{
		name: 'Sh2-264',
		type: 'supernova remnant',
		dist: 1100*ly,
		ra: [5, 37, 0],
		dec: [9, 30, 0],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Orion%27s_Big_Head_Revealed_in_Infrared.jpg/645px-Orion%27s_Big_Head_Revealed_in_Infrared.jpg',
	},
	{
		name: 'Orion Molecular Cloud Complex',
		type: 'molecular cloud',
		dist: 1200*ly,
		ra: [5, 35.3, 0],
		dec: [-5, 23, 0],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Orion_Head_to_Toe.jpg/664px-Orion_Head_to_Toe.jpg',
		radius: 100*ly, // "hundreds of light-years across"
	},
	{
		name: 'Medusa Nebula',
		type: 'planetary nebula',
		dist: 1500*ly,
		ra: [7, 29, 2.69],
		dec: [13, 14, 48.4],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Medusa_nebula.jpg/693px-Medusa_nebula.jpg',
	},
	{
		name: 'Cygnus Loop',
		type: 'supernova remnant',
		dist: 2400*ly,
		ra: [20, 50, 0],
		dec: [31, 0, 0],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Ultraviolet_image_of_the_Cygnus_Loop_Nebula_crop.jpg/691px-Ultraviolet_image_of_the_Cygnus_Loop_Nebula_crop.jpg',
	},
	{
		name: 'Simeis 147',
		type: 'supernova remnant',
		dist: 3000*ly,
		ra: [5, 39, 6],
		dec: [27, 59, 55],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/S147_SH2-240_GeorgesAttard_Apod1012020.jpg/423px-S147_SH2-240_GeorgesAttard_Apod1012020.jpg',
	},
	{
		name: 'Spirograph Nebula',
		type: 'planetary nebula',
		dist: 3600*ly,
		ra: [5, 27, 28.2037],
		dec: [-12, 41, 50.265],
		img: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Spirograph_Nebula_-_Hubble_1999.jpg',
	},
	{
		name: 'Lemon Slice Nebula',
		type: 'planetary nebula',
		dist: 4500*ly,
		ra: [12, 33, 6],
		dec: [82, 34, 0],
		img: 'https://upload.wikimedia.org/wikipedia/commons/e/ee/IC_3568_%22Lemon_Slice%22.jpg',
	},
	{
		name: 'IC 443',
		type: 'supernova remnant',
		dist: 5e3*ly,
		ra: [6, 17, 13],
		dec: [22, 31, 5],
		img: 'https://upload.wikimedia.org/wikipedia/commons/1/14/Ic443_wide.jpg',
	},
	{
		name: 'G292.0+01.8',
		type: 'supernova remnant',
		dist: 6500*ly,
		ra: [11, 24, 27.9],
		dec: [-59, 15, 39],
		img: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Chandra_SNR_G292.0%2B1.8.png',
	},
	{
		name: 'Puppis A',
		type: 'supernova remnant',
		dist: 7000*ly,
		ra: [8, 24, 7],
		dec: [-42, 59, 48],
		img: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Puppis_A_Chandra_%2B_ROSAT.jpg',
	},
	{
		name: 'SN 1006',
		type: 'supernova remnant',
		dist: 7200*ly,
		ra: [15, 2, 8],
		dec: [-41, 57, 0],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/SN_1006.jpg/600px-SN_1006.jpg',
	},
	{
		name: 'Tycho&apos;s Supernova',
		type: 'supernova remnant',
		dist: 8900*ly,
		ra: [0, 25.3, 0],
		dec: [64, 9, 0],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Tycho-supernova-xray.jpg/600px-Tycho-supernova-xray.jpg',
	},
	{
		name: 'SN 185',
		type: 'supernova remnant',
		dist: 9100*ly,
		ra: [14, 43, 0],
		dec: [-62, 30, 0],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/RCW_86.jpg/627px-RCW_86.jpg',
	},
	{
		name: 'Small Sagittarius Star Cloud',
		type: 'star cloud',
		dist: 1e4*ly,
		ra: [18, 17, 0],
		dec: [-18, 29, 0],
		img: 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Messier_24_Colombari_crop_invert.jpg',
		radius: 300*ly,
	},
	{
		name: 'RCW 103',
		type: 'supernova remnant',
		dist: 3200*pc, // ~10437 ly
		ra: [16, 17, 33],
		dec: [-51, 2, 0],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/RCW103.tif/lossy-page1-609px-RCW103.tif.jpg',
	},
	{
		name: 'Cassiopeia A',
		type: 'supernova remnant',
		dist: 11e3*ly,
		ra: [23, 23, 24],
		dec: [58, 48.9, 0],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Cassiopeia_A_Spitzer_Crop.jpg/631px-Cassiopeia_A_Spitzer_Crop.jpg',
	},
	{
		name: 'FSR 1758',
		type: 'globular cluster',
		dist: 11.5e3*ly,
		ra: [17, 31, 12],
		dec: [-39, 48, 30],
	},
	{
		name: 'G350.1-0.3',
		type: 'supernova remnant',
		dist: 15e3*ly,
		ra: [17, 21, 1],
		dec: [-37, 26, 0],
		img: 'https://upload.wikimedia.org/wikipedia/commons/5/59/G350.1-0.3_%28NASA%29.jpg',
	},
	{
		name: 'Gaia 1',
		type: 'open cluster',
		dist: 15e3*ly,
		ra: [6, 45, 52.8],
		dec: [-16, 45, 0],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Gaia_1_with_Sirius.jpg/640px-Gaia_1_with_Sirius.jpg',
	},
	{
		name: 'Necklace Nebula',
		type: 'planetary nebula',
		dist: 15e3*ly,
		ra: [19, 43, 59.51104],
		dec: [17, 9, 0.9579],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Necklace_Nebula_by_Hubble.jpg/539px-Necklace_Nebula_by_Hubble.jpg',
	},
	{
		name: 'Manatee Nebula',
		type: 'supernova remnant',
		dist: 18e3*ly,
		ra: [19, 11, 49],
		dec: [4, 59, 12],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/W50_medium.jpg/640px-W50_medium.jpg',
	},
	{
		name: 'Kepler&apos;s Supernova',
		type: 'supernova remnant',
		dist: 20e3*ly,
		ra: [17, 30, 42],
		dec: [-21, 29, 0],
		img: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Keplers_supernova.jpg',
	},
	{
		name: 'Kesteven 79',
		type: 'supernova remnant',
		dist: 23e3*ly,
		ra: [18, 52, 48],
		dec: [0, 41, 0],
		img: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Kesteven_79.jpg',
	},
	{
		name: 'Large Sagittarius Star Cloud',
		type: 'star cloud',
		dist: 25e3*ly,
		ra: [18, 0, 0],
		dec: [-29, 0, 0],
		img: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Large_Sagittarius_star_cloud.jpg',
		radius: 1e3*ly, // personal estimate
	},
	{
		name: 'G306.3-0.9',
		type: 'supernova remnant',
		dist: 26e3*ly,
		ra: [13, 21, 50.9],
		dec: [-63, 33, 50],
		img: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/G306.3-0.9.jpg',
	},
	{
		name: 'G1.9+0.3',
		type: 'supernova remnant',
		dist: 27.7e3*ly,
		ra: [17, 48, 45.4],
		dec: [-27, 10, 6],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/G19_xray.tif/lossy-page1-703px-G19_xray.tif.jpg',
	},
	{
		name: 'W49B',
		type: 'supernova remnant',
		dist: 33e3*ly,
		ra: [19, 11, 9],
		dec: [9, 6, 24],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Supernova_Remnant_W49B_in_x-ray%2C_radio%2C_and_infrared.jpg/600px-Supernova_Remnant_W49B_in_x-ray%2C_radio%2C_and_infrared.jpg',
	},
	// sort by NGC identifier
	{ // NGC 104
		name: '47 Tucanae',
		type: 'globular cluster',
		dist: 13e3*ly,
		ra: [0, 24, 5.67],
		dec: [-72, 4, 52.6],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Heic1510a.tif/lossy-page1-613px-Heic1510a.tif.jpg',
	},
	{
		name: 'NGC 206',
		type: 'star cloud',
		dist: 2.5e6*ly,
		ra: [0, 40, 31.3],
		dec: [40, 44, 21],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/NGC206.jpg/640px-NGC206.jpg',
		radius: 400*ly,
	},
	{
		name: 'NGC 300',
		type: 'galaxy',
		dist: 6.07e6*ly,
		ra: [0, 54, 53.5],
		dec: [-37, 41, 4],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/View_of_the_southern_spiral_NGC_300.jpg/600px-View_of_the_southern_spiral_NGC_300.jpg',
		radius: 94e3*ly/2,
	},
	{ // NGC 650/651
		name: 'Little Dumbbell Nebula',
		type: 'planetary nebula',
		dist: 2500*ly,
		ra: [1, 42.4, 0],
		dec: [51, 34, 31],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Little_Dumbbell_Nebula_M76_by_Goran_Nilsson%2C_Wim_van_Berlo_%26_Liverpool_Telescope.jpg/606px-Little_Dumbbell_Nebula_M76_by_Goran_Nilsson%2C_Wim_van_Berlo_%26_Liverpool_Telescope.jpg',
	},
	{ // NGC 1499
		name: 'California Nebula',
		type: 'emission nebula',
		dist: 1000*ly,
		ra: [4, 3, 18],
		dec: [36, 25, 18],
		img: 'https://upload.wikimedia.org/wikipedia/commons/4/41/California-nebula.jpeg',
	},
	{ // NGC 1912
		name: 'Messier 38',
		type: 'open cluster',
		dist: 3480*ly,
		ra: [5, 28, 43],
		dec: [35, 51, 18],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/M38_Open_Cluster.jpg/640px-M38_Open_Cluster.jpg',
	},
	{ // NGC 1952
		name: 'Crab Nebula',
		type: 'supernova remnant',
		dist: 6500*ly,
		ra: [5, 34, 31.94],
		dec: [22, 0, 52.2],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Crab_Nebula.jpg/600px-Crab_Nebula.jpg',
		radius: 5.5*ly,
	},
	{ // NGC 1960
		name: 'Messier 36',
		type: 'open cluster',
		dist: 4340*ly,
		ra: [5, 36, 18],
		dec: [34, 8, 24],
		img: 'https://upload.wikimedia.org/wikipedia/commons/d/dc/M36_2mass.jpg',
	},
	{ // NGC 2024
		name: 'Flame Nebula',
		type: 'emission nebula',
		dist: 1350*ly,
		ra: [5, 46, 46.7],
		dec: [0, 0, 50],
		img: 'https://upload.wikimedia.org/wikipedia/commons/3/36/NASA-FlameNebula-NGC2024-20140507.jpg',
	},
	{ // NGC 2068
		name: 'Messier 78',
		type: 'reflection nebula',
		dist: 1350*ly,
		ra: [5, 41, 54],
		dec: [-1, 51, 0],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Messier_78.jpg/619px-Messier_78.jpg',
	},
	{ // NGC 2070; LMC
		name: 'Tarantula Nebula',
		type: 'emission nebula',
		dist: 160e3*ly,
		ra: [5, 38, 38],
		dec: [-69, 5.7, 0],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Tarantula_Nebula_TRAPPIST.jpg/594px-Tarantula_Nebula_TRAPPIST.jpg',
		href: 'https://en.wikipedia.org/wiki/Tarantula_Nebula',
	},
	{ // NGC 2099
		name: 'Messier 37',
		type: 'open cluster',
		dist: 4511*ly,
		ra: [5, 52, 18],
		dec: [32, 33, 2],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/M37_Mazur_full.jpg/618px-M37_Mazur_full.jpg',
	},
	{ // NGC 2237
		name: 'Rosette Nebula',
		type: 'emission nebula',
		dist: 5200*ly,
		ra: [6, 33, 45],
		dec: [4, 49, 54],
		img: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/NGC_2244_Rosette_Nebula.jpg',
	},
	{ // NGC 2392
		name: 'Eskimo Nebula',
		type: 'planetary nebula',
		dist: 6520*ly,
		ra: [7, 29, 10.7669],
		dec: [20, 54, 42.488],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Ngc2392.jpg/600px-Ngc2392.jpg',
	},
	{
		name: 'NGC 2547',
		type: 'open cluster',
		dist: 1190*ly,
		ra: [8, 9, 52.36],
		dec: [-49, 10, 35.01],
		img: 'https://upload.wikimedia.org/wikipedia/commons/7/7f/Star_cluster_NGC_2547.jpg',
	},
	{ // NGC 3242
		name: 'Ghost of Jupiter',
		type: 'planetary nebula',
		dist: 4800*ly,
		ra: [10, 24, 46.1],
		dec: [-18, 38, 32.6],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/NGC_3242_%22Ghost_of_Jupiter%22.png/619px-NGC_3242_%22Ghost_of_Jupiter%22.png',
	},
	{ // NGC 3372
		name: 'Carina Nebula',
		type: 'emission nebula',
		dist: 8500*ly,
		ra: [10, 45, 8.5],
		dec: [-59, 52, 4],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Eagle_Nebula_from_ESO.jpg/600px-Eagle_Nebula_from_ESO.jpg',
	},
	{ // NGC 3587
		name: 'Owl Nebula',
		type: 'planetary nebula',
		dist: 2415*ly,
		ra: [11, 14, 47.734],
		dec: [55, 1, 8.5],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/The_Owl_Nebula_M97_Goran_Nilsson_%26_The_Liverpool_Telescope.jpg/606px-The_Owl_Nebula_M97_Goran_Nilsson_%26_The_Liverpool_Telescope.jpg',
	},
	{ // NGC 3992
		name: 'Messier 109',
		type: 'galaxy',
		dist: 83.5e6*ly,
		ra: [11, 57, 36],
		dec: [53, 22, 28],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Messier109_-_SDSS_DR14_%28panorama%29.jpg/800px-Messier109_-_SDSS_DR14_%28panorama%29.jpg',
	},
	{ // NGC 5139
		name: 'Omega Centauri',
		type: 'globular cluster',
		dist: 15.8e3*ly,
		ra: [13, 26, 47.28],
		dec: [-47, 28, 46.1],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Omega_Centauri_by_ESO.jpg/638px-Omega_Centauri_by_ESO.jpg',
	},
	{
		name: 'NGC 5460',
		type: 'open cluster',
		dist: 2350*ly,
		ra: [14, 7, 27],
		dec: [-48, 20, 36],
		img: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/NGC_5460.png',
	},
	{ // NGC 5272
		name: 'Messier 3',
		type: 'globular cluster',
		dist: 33.9e3*ly,
		ra: [13, 42, 11.62],
		dec: [28, 22, 38.2],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Messier_3_-_Adam_Block_-_Mount_Lemmon_SkyCenter_-_University_of_Arizona.jpg/640px-Messier_3_-_Adam_Block_-_Mount_Lemmon_SkyCenter_-_University_of_Arizona.jpg',
	},
	{ // NGC 5904
		name: 'Messier 5',
		type: 'globular cluster',
		dist: 24.5e3*ly,
		ra: [15, 18, 33.22],
		dec: [2, 4, 51.7],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/M5s.jpg/616px-M5s.jpg',
	},
	{ // NGC 6121
		name: 'Messier 4',
		type: 'globular cluster',
		dist: 7.2e3*ly,
		ra: [16, 23, 35.22],
		dec: [-26, 31, 32.7],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Globular_star_cluster_Messier_4.jpg/621px-Globular_star_cluster_Messier_4.jpg',
	},
	{
		name: 'NGC 6543',
		type: 'planetary nebula',
		dist: 11e3*ly,
		ra: [17, 20, 46.3],
		dec: [51, 45, 16],
		img: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/NGC_6326.jpg',
	},
	{ // NGC 6334
		name: 'Cat&apos;s Paw Nebula',
		type: 'emission nebula',
		dist: 5540*ly,
		ra: [17, 20, 50.9],
		dec: [-36, 6, 54],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/PIA22568-CatsPawNebula-Spitzer-20181023.jpg/800px-PIA22568-CatsPawNebula-Spitzer-20181023.jpg',
	},
	{ // NGC 6405
		name: 'Butterfly Cluster',
		type: 'open cluster',
		dist: 1590*ly,
		ra: [17, 40.1, 0],
		dec: [-32, 13, 0],
		img: 'https://upload.wikimedia.org/wikipedia/commons/7/7f/M6a.jpg',
	},
	{ // NGC 6514
		name: 'Trifid Nebula',
		type: 'emission nebula',
		dist: 4100*ly,
		ra: [18, 2, 23],
		dec: [-23, 1, 48],
		img: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Trifid.nebula.arp.750pix.jpg',
	},
	{ // NGC 6523
		name: 'Lagoon Nebula',
		type: 'emission nebula',
		dist: 4100*ly,
		ra: [18, 3, 37],
		dec: [-24, 23, 12],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/VST_images_the_Lagoon_Nebula.jpg/800px-VST_images_the_Lagoon_Nebula.jpg',
	},
	{ // NGC 6531
		name: 'Messier 21',
		type: 'open cluster',
		dist: 3930*ly,
		ra: [18, 4, 13],
		dec: [-22, 29, 24],
		img: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Messier_21.jpg',
	},
	{ // NGC 6543
		name: 'Cat&apos;s Eye Nebula',
		type: 'planetary nebula',
		dist: 3300*ly,
		ra: [17, 58, 33.423],
		dec: [66, 37, 59.52],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/NGC6543.jpg/600px-NGC6543.jpg',
	},
	{ // NGC 6611
		name: 'Eagle Nebula',
		type: 'emission nebula',
		dist: 5700*ly,
		ra: [18, 18, 48],
		dec: [-13, 49, 0],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Eagle_Nebula_from_ESO.jpg/600px-Eagle_Nebula_from_ESO.jpg',
	},
	{ // NGC 6613
		name: 'Messier 18',
		type: 'open cluster',
		dist: 4230*ly,
		ra: [18, 19, 58],
		dec: [-17, 6, 6],
		img: 'https://upload.wikimedia.org/wikipedia/commons/6/64/Messier_18.jpg',
	},
	{ // NGC 6618
		name: 'Omega Nebula',
		type: 'emission nebula',
		dist: 5500*ly,
		ra: [18, 20, 26],
		dec: [-16, 10, 36],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/VST_image_of_the_spectacular_star-forming_region_Messier_17_%28Omega_Nebula%29.jpg/600px-VST_image_of_the_spectacular_star-forming_region_Messier_17_%28Omega_Nebula%29.jpg',
	},
	{
		name: 'NGC 6633',
		type: 'open cluster',
		dist: 1040*ly,
		ra: [18, 27.7, 0],
		dec: [6, 34, 0],
		img: 'https://upload.wikimedia.org/wikipedia/commons/1/14/NGC_6633.png',
	},
	{ // NGC 6694
		name: 'Messier 26',
		type: 'open cluster',
		dist: 5160*ly,
		ra: [18, 45, 18],
		dec: [-9, 23, 0],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Messier_26.jpg/600px-Messier_26.jpg',
	},
	{ // NGC 6705
		name: 'Wild Duck Cluster',
		type: 'open cluster',
		dist: 6120*ly,
		ra: [18, 51, 5],
		dec: [-6, 16, 12],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Eso1430a.jpg/684px-Eso1430a.jpg',
	},
	{ // NGC 6715; SagDEG
		name: 'Messier 54',
		type: 'globular cluster',
		dist: 87.4e3*ly,
		ra: [18, 55, 3.33],
		dec: [-30, 28, 47.5],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Messier_54_HST.jpg/612px-Messier_54_HST.jpg',
	},
	{ // NGC 6720
		name: 'Ring Nebula',
		type: 'planetary nebula',
		dist: 2567*ly,
		ra: [18, 53, 35.079],
		dec: [33, 1, 45.03],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/M57_The_Ring_Nebula.JPG/587px-M57_The_Ring_Nebula.JPG',
	},
	{
		name: 'NGC 6791',
		type: 'open cluster',
		dist: 13.3e3*ly,
		ra: [19, 20, 53],
		dec: [37, 46.3, 0],
		img: 'https://upload.wikimedia.org/wikipedia/commons/5/54/NGC_6791_cluster.jpg',
		radius: 100*ly, // personal estimate
	},
	{ // NGC 6809
		name: 'Messier 55',
		type: 'globular cluster',
		dist: 17.6e3*ly,
		ra: [19, 39, 59.71],
		dec: [-30, 57, 53.1],
		img: 'https://upload.wikimedia.org/wikipedia/commons/6/65/M55.jpg',
	},
	{ // NGC 6855
		name: 'Dumbbell Nebula',
		type: 'planetary nebula',
		dist: 417*pc,
		ra: [19, 59, 36.34],
		dec: [22, 43, 16.09],
		img: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/M27-Mazur.jpg',
	},
	{ // NGC 6864 Far side of Galaxy
		name: 'Messier 75',
		type: 'globular cluster',
		dist: 68e3*ly,
		ra: [20, 6, 4.85],
		dec: [-21, 55, 17.85],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Crowded_cluster_Messier_75.jpg/640px-Crowded_cluster_Messier_75.jpg',
	},
	{
		name: 'NGC 6886',
		type: 'planetary nebula',
		dist: 4600*ly,
		ra: [20, 12, 42.83],
		dec: [19, 59, 22.6],
		img: 'https://upload.wikimedia.org/wikipedia/commons/7/78/NGC_6886.jpg',
	},
	{ // NGC 7000
		name: 'North America Nebula',
		type: 'emission nebula',
		dist: 2590*ly,
		ra: [20, 59, 17.1],
		dec: [44, 31, 44],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/North_America_and_Pelican_-_Wesley_Chang.jpg/658px-North_America_and_Pelican_-_Wesley_Chang.jpg',
	},
	{ // NGC 7089 Far side of Galaxy
		name: 'Messier 2',
		type: 'globular cluster',
		dist: 55e3*ly,
		ra: [21, 33, 27.02],
		dec: [0, -49, -23.7],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Messier2_-_HST_-_Potw1913a.jpg/597px-Messier2_-_HST_-_Potw1913a.jpg',
	},
	{ // NGC 7092
		name: 'Messier 39',
		type: 'open cluster',
		dist: 1010*ly,
		ra: [21, 31, 48],
		dec: [48, 26, 0],
		img: 'https://upload.wikimedia.org/wikipedia/commons/8/83/M39_Mazur.jpg',
	},
	{ // NGC 7293
		name: 'Helix Nebula',
		type: 'planetary nebula',
		dist: 650*ly,
		ra: [22, 29, 38.55],
		dec: [-20, 50, 13.6],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/NGC7293_%282004%29.jpg/557px-NGC7293_%282004%29.jpg',
	},
	// not a star, no NGC identifier, outside milky way; sort by dist
	{
		name: 'Laevens 1',
		type: 'globular cluster',
		dist: 145e3*ly,
		ra: [11, 36, 16.2],
		dec: [-10, 52, 38.8],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Crater_Cluster.png/640px-Crater_Cluster.png',
		radius: 50*pc,
	},
	{
		name: 'Koposov 1',
		type: 'globular cluster',
		dist: 157.5e3*ly,
		ra: [11, 59, 18],
		dec: [12, 15, 36],
		img: 'https://upload.wikimedia.org/wikipedia/commons/5/56/GLC_Koposov1.png',
	},
	{
		name: 'LMC N49',
		type: 'supernova remnant',
		dist: 160e3*ly,
		ra: [5, 26, 1],
		dec: [-66, 5, 6],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Sig06-030.jpg/575px-Sig06-030.jpg',
	},
	{
		name: 'SN 1987A',
		type: 'supernova remnant',
		dist: 168e3*ly,
		ra: [5, 35, 28.03],
		dec: [-69, 16, 11.79],
		img: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/New_Hubble_Observations_of_Supernova_1987A_Trace_Shock_Wave_%284954621859%29.jpg',
	},
	{
		name: 'E0102',
		type: 'supernova remnant',
		dist: 190e3*ly,
		ra: [1, 4, 1.5],
		dec: [-72, 1, 55.7],
		img: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Hubble_Pinpoints_Supernova_Blast.jpg',
	},
	// satellite galaxies
	{
		name: 'Canis Major Dwarf',
		type: 'dwarf galaxy',
		dist: 25e3*ly,
		ra: [7, 12, 35],
		dec: [-27, 40, 0],
		radius: 750*pc,
	},
	{
		name: 'Sagittarius Dwarf Spheroidal Galaxy',
		type: 'dwarf galaxy',
		dist: 65e3*ly,
		ra: [18, 55, 19.5],
		dec: [-30, 32, 43],
		img: 'https://upload.wikimedia.org/wikipedia/commons/9/99/S_sgrdw1.jpg',
		radius: 1300*pc,
	},
	{
		name: 'Segue I',
		type: 'dwarf galaxy',
		dist: 75e3*ly,
		ra: [10, 7, 4],
		dec: [16, 4, 55],
		radius: 30*pc,
	},
	{
		name: 'Reticulum II',
		type: 'dwarf galaxy',
		dist: 97.8e3*ly,
		ra: [3, 35, 42.14],
		dec: [-54, 2, 57.1],
		radius: 15*pc,
	},
	{
		name: 'Triangulum II',
		type: 'dwarf galaxy',
		dist: 97.8e3*ly,
		ra: [2, 13, 17.4],
		dec: [36, 10, 42.4],
		radius: 34*pc,
	},
	{
		name: 'Ursa Major II Dwarf',
		type: 'dwarf galaxy',
		dist: 98e3*ly,
		ra: [8, 51, 30],
		dec: [63, 7, 48],
		radius: 140*pc,
	},
	{
		name: 'Segue II',
		type: 'dwarf galaxy',
		dist: 114e3*ly,
		ra: [2, 19, 16],
		dec: [20, 10, 31],
		radius: 34*pc,
	},
	{
		name: 'Willman 1',
		type: 'dwarf galaxy',
		dist: 120e3*ly,
		ra: [10, 49, 22.3],
		dec: [51, 3, 3.6],
		radius: 25*pc,
	},
	{
		name: 'Boötes II',
		type: 'dwarf galaxy',
		dist: 136e3*ly,
		ra: [13, 58, 0],
		dec: [12, 51, 0],
		radius: 51*pc,
	},
	{
		name: 'Coma Berenices',
		type: 'dwarf galaxy',
		dist: 137e3*ly,
		ra: [12, 26, 59],
		dec: [23, 55, 9],
		radius: 70*pc,
		href: 'https://en.wikipedia.org/wiki/Coma_Berenices_(dwarf_galaxy)',
	},
	{
		name: 'Boötes III',
		type: 'dwarf galaxy',
		dist: 150e3*ly,
		ra: [13, 57, 0],
		dec: [26, 48, 0],
		radius: 500*pc,
	},
	{
		name: 'Large Magellanic Cloud',
		type: 'dwarf galaxy',
		dist: 163e3*ly,
		ra: [5, 23, 34.5],
		dec: [-69, 45, 22],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/The_Large_Magellanic_Cloud_revealed_by_VISTA.jpg/537px-The_Large_Magellanic_Cloud_revealed_by_VISTA.jpg',
		radius: 7000*ly,
	},
	{
		name: 'Boötes I',
		type: 'dwarf galaxy',
		dist: 197e3*ly,
		ra: [14, 0, 6],
		dec: [14, 30, 0],
		img: 'https://www.constellation-guide.com/wp-content/uploads/2011/05/Bo%C3%B6tes-Dwarf-Galaxy.jpg',
		href: 'https://en.wikipedia.org/wiki/Bo%C3%B6tes_I_(dwarf_galaxy)',
		radius: 150*pc,
	},
	{
		name: 'Small Magellanic Cloud',
		type: 'dwarf galaxy',
		dist: 201e3*ly,
		ra: [0, 52, 44.8],
		dec: [-72, 49, 43],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Small_Magellanic_Cloud_%28Digitized_Sky_Survey_2%29.jpg/577px-Small_Magellanic_Cloud_%28Digitized_Sky_Survey_2%29.jpg',
		radius: 3500*ly,
	},
	{
		name: 'Crater II',
		type: 'dwarf galaxy',
		dist: 383e3*ly,
		ra: [11, 49, 14.4],
		dec: [-18, 24, 46.8],
		radius: 1100*pc,
	},
	{
		name: 'Antlia II',
		type: 'dwarf galaxy',
		dist: 422e3*ly,
		ra: [9, 35, 32.832],
		dec: [-36, 46, 2.28],
		radius: 2900*pc,
	},
	{
		name: 'Leo T',
		type: 'dwarf galaxy',
		dist: 1365e3*ly,
		ra: [9, 34, 53.4],
		dec: [17, 3, 5],
		url: 'https://en.wikipedia.org/wiki/Leo_T_(dwarf_galaxy)',
		radius: 2300*ly/2,
	},
	{
		name: 'Phoenix Dwarf',
		type: 'dwarf galaxy',
		dist: 1.44e6*ly,
		ra: [1, 51, 6.3],
		dec: [-44, 26, 41],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/An_explosive_phoenix_-_Phoenix_Dwarf.jpg/640px-An_explosive_phoenix_-_Phoenix_Dwarf.jpg',
		radius: 3700*ly/2,
	},
	// continue https://en.wikipedia.org/wiki/Satellite_galaxies_of_the_Milky_Way
	// @ Draco Dwarf
	// Local Group (excl. Satellites of Milky Way)
	{
		name: 'Milky Way',
		type: 'galaxy',
		dist: 26673*ly,
		ra: [17, 45, 40.0409],
		dec: [-29, 0, 28.118],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/ESO_-_Milky_Way.jpg/640px-ESO_-_Milky_Way.jpg',
		radius: 52850*ly,
	},
	{
		name: 'Andromeda Galaxy',
		type: 'galaxy',
		dist: 2.5e6*ly,
		ra: [0, 42, 44.3],
		dec: [41, 16, 9],
		img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Andromeda_Galaxy_560mm_FL.jpg/640px-Andromeda_Galaxy_560mm_FL.jpg',
		radius: 110e3*ly,
	},
	// todo
	// https://en.wikipedia.org/wiki/List_of_nearest_galaxies
];