/* exported particleData, reactionData */
'use strict';

const speedOfLight =  299792458; // m/s; exact
const eV = 1.602176634e-19; // J; exact
const eVc2 = eV / Math.pow(speedOfLight, 2); // kg; exact
const amu = 1.6605390666e-27; // kg; unsure exactless; AKA dalton

const minute = 60;
const hour = 60*minute;
const day = 24*hour;
const year = 365.2425*day;

const particleData = [
	// bosons
	{
		name: 'photon',
		category: 'boson',
		symbol: {
			char: 'γ',
		},
		spin: 1,
		charge: 0,
		mass: 0,
	},
	// leptons
	{
		name: 'electron',
		category: 'lepton',
		symbol: {
			char: 'e',
			sup: '-',
		},
		spin: 0.5,
		charge: -eV,
		mass: 0.5109989461e6*eVc2,
	},
	{
		name: 'positron',
		category: 'lepton',
		symbol: {
			char: 'e',
			sup: '+',
		},
		spin: 0.5,
		charge: eV,
		mass: 0.5109989461e6*eVc2,
	},
	{
		name: 'electron neutrino',
		category: 'lepton',
		symbol: {
			char: 'ν',
			sub: 'e',
		},
		spin: 0.5,
		charge: 0,
		mass: 0.0000022e6*eVc2,
	},
	{
		name: 'electron antineutrino',
		category: 'lepton',
		symbol: {
			char: 'ν',
			sub: 'e',
			overline: true,
		},
		spin: 0.5,
		charge: 0,
		mass: 0.0000022e6*eVc2,
	},
	{
		name: 'muon',
		category: 'lepton',
		symbol: {
			char: 'μ',
			sup: '-',
		},
		spin: 0.5,
		charge: -eV,
		mass: 105.6583745e6*eVc2,
		decays: [
			['electron', 'electron antineutrino', 'muon neutrino'],
		],
		halfLife: 2.1969811e-6,
	},
	{
		name: 'antimuon',
		category: 'lepton',
		symbol: {
			char: 'μ',
			sup: '+',
		},
		spin: 0.5,
		charge: eV,
		mass: 105.6583745e6*eVc2,
		decays: [
			['positron', 'electron neutrino', 'muon antineutrino'],
		],
		halfLife: 2.1969811e-6,
	},
	{
		name: 'muon neutrino',
		category: 'lepton',
		symbol: {
			char: 'ν',
			sub: 'μ',
		},
		spin: 0.5,
		charge: 0,
		mass: 0.17e6*eVc2,
	},
	{
		name: 'muon antineutrino',
		category: 'lepton',
		symbol: {
			char: 'ν',
			sub: 'μ',
			overline: true,
		},
		spin: 0.5,
		charge: 0,
		mass: 0.17e6*eVc2,
	},
	{
		name: 'tau',
		category: 'lepton',
		symbol: {
			char: 'τ',
			sup: '-',
		},
		spin: 0.5,
		charge: -eV,
		mass: 1776.86e6*eVc2,
		decays: [ // todo: probability values
			['pion+', 'pion0', 'tau neutrino'],
			['pion-', 'pion0', 'tau neutrino'],
			['pion+', 'tau neutrino'],
			['pion-', 'tau neutrino'],
			['pion+', 'pion0', 'pion0', 'tau neutrino'],
			['pion-', 'pion0', 'pion0', 'tau neutrino'],
			['pion+', 'pion+', 'pion-', 'tau neutrino'],
			['tau neutrino', 'electron', 'electron antineutrino'],
			['tau neutrino', 'muon', 'muon antineutrino'],
		],
		halfLife: 2.6033e-8,
	},
	{
		name: 'antitau',
		category: 'lepton',
		symbol: {
			char: 'τ',
			sup: '+',
		},
		spin: 0.5,
		charge: eV,
		mass: 1776.86e6*eVc2,
		decays: [ // todo: probability values
			['pion+', 'pion0', 'tau antineutrino'],
			['pion-', 'pion0', 'tau antineutrino'],
			['pion+', 'tau antineutrino'],
			['pion-', 'tau antineutrino'],
			['pion+', 'pion0', 'pion0', 'tau antineutrino'],
			['pion-', 'pion0', 'pion0', 'tau antineutrino'],
			['pion+', 'pion+', 'pion-', 'tau antineutrino'],
			['tau antineutrino', 'positron', 'electron neutrino'],
			['tau antineutrino', 'antimuon', 'muon neutrino'],
		],
	},
	{
		name: 'tau neutrino',
		category: 'lepton',
		symbol: {
			char: 'ν',
			sub: 'τ',
		},
		spin: 0.5,
		charge: 0,
		mass: 15.5e6*eVc2,
	},
	{
		name: 'tau antineutrino',
		category: 'lepton',
		symbol: {
			char: 'ν',
			sub: 'τ',
			overline: true,
		},
		spin: 0.5,
		charge: 0,
		mass: 15.5e6*eVc2,
	},
	// mesons
	{
		name: 'pion0',
		category: 'meson',
		symbol: {
			char: 'π',
			sup: '0',
		},
		spin: 0,
		charge: 0,
		mass: 134.9766e6*eVc2,
		decays: [
			['photon', 'photon'],
		],
		halfLife: 8.4e-17,
	},
	{
		name: 'pion+',
		category: 'meson',
		symbol: {
			char: 'π',
			sup: '+',
		},
		spin: 0,
		charge: +eV,
		mass: 139.57018e6*eVc2,
		decays: [
			['antimuon', 'muon neutrino'],
		],
		halfLife: 2.6033e-8,
	},
	{
		name: 'pion-',
		category: 'meson',
		symbol: {
			char: 'π',
			sup: '-',
		},
		spin: 0,
		charge: -eV,
		mass: 139.57018e6*eVc2,
		decays: [
			['muon', 'muon antineutrino'],
		],
		halfLife: 2.6033e-8,
	},
	{
		name: 'eta',
		category: 'meson',
		symbol: {
			char: 'η',
		},
		spin: 0, // unsure
		charge: 0,
		mass: 547.862e6*eVc2,
		decays: [
			['photon', 'photon'],
			['pion0', 'pion0', 'pion0'],
			['pion+', 'pion0', 'pion-'],
		],
		halfLife: 5.02e-19,
	},
	{
		name: 'eta prime',
		category: 'meson',
		symbol: {
			char: 'η′',
		},
		spin: 0, // unsure
		charge: 0,
		mass: 957.78e6*eVc2,
		decays: [
			['pion+', 'pion-', 'eta'],
			['pion0', 'pion0', 'eta'],
		],
		halfLife: 3.32e-21,
	},
	{
		name: 'kaon',
		category: 'meson',
		symbol: {
			char: 'K',
			sup: '0',
		},
		spin: 0.5, // unsure
		charge: 0,
		mass: 497.614e6*eVc2,
	},
	{
		name: 'kaon+',
		category: 'meson',
		symbol: {
			char: 'K',
			sup: '+',
		},
		spin: 0.5, // unsure
		charge: eV,
		mass: 497.614e6*eVc2,
		decays: [
			['antimuon', 'muon neutrino'],
			['pion+', 'pion0'],
			['pion0', 'positron', 'electron neutrino'],
		],
		halfLife: 3.32e-21,
	},
	{
		name: 'kaon-',
		category: 'meson',
		symbol: {
			char: 'K',
			sup: '-',
		},
		spin: 0.5, // unsure
		charge: -eV,
		mass: 497.614e6*eVc2,
		decays: [
			['muon', 'muon antineutrino'],
			['pion-', 'pion0'],
			['pion0', 'electron', 'electron antineutrino'],
		],
		halfLife: 3.32e-21,
	},
	{
		name: 'kaon short',
		category: 'meson',
		symbol: {
			char: 'K',
			sup: '0',
			sub: 'S',
		},
		spin: 0.5, // unsure
		charge: 0,
		mass: 497.614e6*eVc2,
		decays: [
			['pion+', 'pion-'],
			['pion0', 'pion0'],
		],
		halfLife: 8.953e-11,
	},
	{
		name: 'kaon long',
		category: 'meson',
		symbol: {
			char: 'K',
			sup: '0',
			sub: 'L',
		},
		spin: 0.5, // unsure
		charge: 0,
		mass: 497.614e6*eVc2,
		decays: [
			['pion+', 'electron', 'electron neutrino'],
			['pion-', 'positron', 'electron neutrino'],
			['pion+', 'muon', 'muon neutrino'],
			['pion-', 'antimuon', 'muon neutrino'],
			['pion0', 'pion0', 'pion0'],
			['pion+', 'pion0', 'pion-'],
		],
		halfLife: 5.116e-8,
	},
	// baryons
	{
		name: 'proton',
		category: 'baryon',
		symbol: {
			char: 'p',
			sup: '+',
		},
		spin: 0.5,
		charge: eV,
		mass: 938.27208816e6*eVc2,
	},
	{
		name: 'neutron',
		category: 'baryon',
		symbol: {
			char: 'n',
			sup: '0',
		},
		spin: 0.5,
		charge: 0,
		mass: 939.56542052e6*eVc2,
	},
	{
		name: 'lambda',
		category: 'baryon',
		symbol: {
			char: 'Λ',
			sup: '0',
		},
		spin: 0,
		charge: 0,
		mass: 1115.683e6*eVc2,
		decays: [
			['proton', 'pion-'],
			['neutron', 'pion0'],
		],
		halfLife: 2.632e-10,
	},
	{
		name: 'sigma0',
		category: 'baryon',
		symbol: {
			char: 'Σ',
			sup: '0',
		},
		spin: 1,
		charge: 0,
		mass: 1192.642e6*eVc2,
		decays: [
			['lambda', 'photon'],
		],
		halfLife: 7.4e-20,
	},
	{
		name: 'sigma+',
		category: 'baryon',
		symbol: {
			char: 'Σ',
			sup: '+',
		},
		spin: 1,
		charge: eV,
		mass: 1189.37e6*eVc2,
		decays: [
			['proton', 'pion0'],
			['neutron', 'pion+'],
		],
		halfLife: 8.018e-11,
	},
	{
		name: 'sigma-',
		category: 'baryon',
		symbol: {
			char: 'Σ',
			sup: '-',
		},
		spin: 1,
		charge: -eV,
		mass: 1197.449e6*eVc2,
		decays: [
			['neutron', 'pion-'],
		],
		halfLife: 1.479e-10,
	},
	// isotopes/elements/atoms
	// exotic
	{
		name: 'muonium',
		category: 'atom',
		symbol: {
			char: 'Mu',
		},
		charge: 0,
		mass: 106e6*eVc2, // guess
		decays: [
			['photon', 'photon', 'electron neutrino', 'muon antineutrino'],
		],
		halfLife: 2.2e-6,
	},
	{
		name: 'antimuonium',
		category: 'atom',
		symbol: {
			char: 'Mu',
			overline: true,
		},
		charge: 0,
		mass: 106e6*eVc2, // guess
		decays: [
			['photon', 'photon', 'electron antineutrino', 'muon neutrino'],
		],
		halfLife: 2.2e-6,
	},
	{
		name: 'pionium',
		category: 'atom',
		symbol: {
			char: 'Pi',
		},
		charge: 0,
		mass: 280e6*eVc2, // guess
		decays: [
			['pion0', 'pion0'],
			['photon', 'photon'],
		],
		halfLife: 2.85e-15,
	},
	// normal
	{
		name: 'protium',
		category: 'atom',
		symbol: {
			char: 'H',
			presup: '1',
			presub: '1',
		},
		spin: 0.5,
		charge: 0,
		mass: 1.00782503224*amu,
	},
	{
		name: 'deuterium',
		category: 'atom',
		symbol: {
			char: 'H',
			presup: '2',
			presub: '1',
		},
		spin: 1,
		charge: 0,
		mass: 2.01410177811*amu,
	},
	{
		name: 'tritium',
		category: 'atom',
		symbol: {
			char: 'H',
			presup: '3',
			presub: '1',
		},
		spin: 0.5,
		charge: 0,
		mass: 3.01604928199*amu,
		decays: [
			['helium-3', 'electron antineutrino'],
		],
		halfLife: 12.32*year,
	},
	{
		name: 'helium-3',
		category: 'atom',
		symbol: {
			char: 'He',
			presup: '3',
			presub: '2',
		},
		spin: 0.5,
		charge: 0,
		mass: 3.01602932265*amu,
	},
	{
		name: 'helium-4',
		category: 'atom',
		symbol: {
			char: 'He',
			presup: '4',
			presub: '2',
		},
		spin: 0,
		charge: 0,
		mass: 4.00260325413*amu,
	},
	{
		name: 'lithium-5',
		category: 'atom',
		symbol: {
			char: 'Li',
			presup: '5',
			presub: '3',
		},
		spin: 3/2,
		charge: 0,
		mass: 5.01254*amu,
		decays: [
			['helium-4', 'proton'],
		],
		halfLife: 370e-24,
	},
	{
		name: 'lithium-6',
		category: 'atom',
		symbol: {
			char: 'Li',
			presup: '6',
			presub: '3',
		},
		spin: 1,
		charge: 0,
		mass: 6.0151228874*amu,
	},
	{
		name: 'lithium-7',
		category: 'atom',
		symbol: {
			char: 'Li',
			presup: '7',
			presub: '3',
		},
		spin: 1.5,
		charge: 0,
		mass: 7.016003437*amu,
	},
	{
		name: 'lithium-8',
		category: 'atom',
		symbol: {
			char: 'Li',
			presup: '8',
			presub: '3',
		},
		spin: 2,
		charge: 0,
		mass: 8.02248625*amu,
		decays: [
			['beryllium-8', 'electron antineutrino'], // beta-
		],
		halfLife: 0.8394,
	},
	{
		name: 'beryllium-7',
		category: 'atom',
		symbol: {
			char: 'Be',
			presup: '7',
			presub: '4',
		},
		spin: 1.5,
		charge: 0,
		mass: 7.01692872*amu,
	},
	{
		name: 'beryllium-8',
		category: 'atom',
		symbol: {
			char: 'Be',
			presup: '8',
			presub: '4',
		},
		spin: 0,
		charge: 0,
		mass: 8.0053051*amu,
		decays: [
			['helium-4', 'helium-4'],
		],
		halfLife: 8.19e-19,
	},
	{
		name: 'beryllium-9',
		category: 'atom',
		symbol: {
			char: 'Be',
			presup: '9',
			presub: '4',
		},
		spin: 3/2,
		charge: 0,
		mass: 9.01218307*amu,
	},
	{
		name: 'beryllium-10',
		category: 'atom',
		symbol: {
			char: 'Be',
			presup: '10',
			presub: '4',
		},
		spin: 0,
		charge: 0,
		mass: 10.01353470*amu,
		decays: [
			['boron-10', 'electron antineutrino'], // beta-
		],
		halfLife: 1.51e6*year,
	},
	{
		name: 'boron-8',
		category: 'atom',
		symbol: {
			char: 'B',
			presup: '8',
			presub: '5',
		},
		spin: 2,
		charge: 0,
		mass: 8.0246073*amu,
		decays: [
			['beryllium-8', 'positron', 'electron neutrino'], // beta+
		],
		halfLife: 0.77,
	},
	{
		name: 'boron-10',
		category: 'atom',
		symbol: {
			char: 'B',
			presup: '10',
			presub: '5',
		},
		spin: 3,
		charge: 0,
		mass: 10.012936862*amu,
	},
	{
		name: 'boron-11',
		category: 'atom',
		symbol: {
			char: 'B',
			presup: '11',
			presub: '5',
		},
		spin: 3/2,
		charge: 0,
		mass: 11.009305167*amu,
	},
	{
		name: 'boron-12',
		category: 'atom',
		symbol: {
			char: 'B',
			presup: '12',
			presub: '5',
		},
		spin: 1,
		charge: 0,
		mass: 12.0143526*amu,
		decays: [
			['carbon-12', 'electron antineutrino'], // beta-
		],
		halfLife: 0.0202,
	},
	{
		name: 'carbon-12',
		category: 'atom',
		symbol: {
			char: 'C',
			presup: '12',
			presub: '6',
		},
		spin: 0,
		charge: 0,
		mass: 12*amu,
	},
	{
		name: 'carbon-13',
		category: 'atom',
		symbol: {
			char: 'C',
			presup: '13',
			presub: '6',
		},
		spin: 0.5,
		charge: 0,
		mass: 13.00335483521*amu,
	},
	{
		name: 'nitrogen-13',
		category: 'atom',
		symbol: {
			char: 'N',
			presup: '13',
			presub: '6',
		},
		spin: 0.5,
		charge: 0,
		mass: 13.005738613*amu,
		decays: [
			['carbon-13', 'positron', 'electron neutrino'], // beta+
		],
		halfLife: 9.965*minute,
	},
	{
		name: 'nitrogen-14',
		category: 'atom',
		symbol: {
			char: 'N',
			presup: '14',
			presub: '7',
		},
		spin: 1,
		charge: 0,
		mass: 14.00307400446*amu,
	},
	{
		name: 'nitrogen-15',
		category: 'atom',
		symbol: {
			char: 'N',
			presup: '15',
			presub: '7',
		},
		spin: 0.5,
		charge: 0,
		mass: 15.0001088989*amu,
	},
	{
		name: 'oxygen-14',
		category: 'atom',
		symbol: {
			char: 'O',
			presup: '14',
			presub: '8',
		},
		spin: 0,
		charge: 0,
		mass: 14.008596706*amu,
		decays: [
			['nitrogen-14', 'positron', 'electron neutrino'], // beta+
		],
		halfLife: 70.62,
	},
	{
		name: 'oxygen-15',
		category: 'atom',
		symbol: {
			char: 'O',
			presup: '15',
			presub: '8',
		},
		spin: 0.5,
		charge: 0,
		mass: 15.0030656*amu,
		decays: [
			['nitrogen-15', 'positron', 'electron neutrino'], // beta+
		],
		halfLife: 2.034*minute,
	},
	{
		name: 'oxygen-16',
		category: 'atom',
		symbol: {
			char: 'O',
			presup: '16',
			presub: '8',
		},
		spin: 0,
		charge: 0,
		mass: 15.99491461960*amu,
	},
	{
		name: 'oxygen-17',
		category: 'atom',
		symbol: {
			char: 'O',
			presup: '17',
			presub: '8',
		},
		spin: 5/2,
		charge: 0,
		mass: 16.9991317566*amu,
	},
	{
		name: 'oxygen-18',
		category: 'atom',
		symbol: {
			char: 'O',
			presup: '18',
			presub: '8',
		},
		spin: 0,
		charge: 0,
		mass: 17.9991596128*amu,
	},
	{
		name: 'fluorine-17',
		category: 'atom',
		symbol: {
			char: 'F',
			presup: '17',
			presub: '9',
		},
		spin: 5/2,
		charge: 0,
		mass: 17.00209524*amu,
		decays: [
			['oxygen-17', 'positron', 'electron neutrino'], // beta+
		],
		halfLife: 64.37,
	},
	{
		name: 'fluorine-18',
		category: 'atom',
		symbol: {
			char: 'F',
			presup: '18',
			presub: '9',
		},
		spin: 1,
		charge: 0,
		mass: 18.0009373*amu,
		decays: [
			['oxygen-18', 'positron', 'electron neutrino'], // beta+
		],
		halfLife: 109.739*minute,
	},
	{
		name: 'neon-18',
		category: 'atom',
		symbol: {
			char: 'Ne',
			presup: '18',
			presub: '10',
		},
		spin: 0,
		charge: 0,
		mass: 18.0057087*amu,
		decays: [
			['fluorine-18', 'positron', 'electron neutrino'], // beta+
		],
		halfLife: 1.6642,
	},
	{
		name: 'neon-20',
		category: 'atom',
		symbol: {
			char: 'Ne',
			presup: '20',
			presub: '10',
		},
		spin: 0,
		charge: 0,
		mass: 19.9924401762*amu,
	},
];

const reactionData = [
	// exotic atoms
	{
		reagents: ['muon', 'electron'],
		products: ['muonium'],
	},
	{
		reagents: ['antimuon', 'positron'],
		products: ['antimuonium'],
	},
	{
		reagents: ['pion+', 'pion-'],
		products: ['pionium'],
	},
	// normal atoms
	{
		reagents: ['proton', 'electron'],
		products: ['protium'],
	},
	{ // https://en.wikipedia.org/wiki/Proton%E2%80%93proton_chain
		reagents: ['proton', 'proton', 'electron'],
		products: ['deuterium', 'electron neutrino'],
	},
	// + neutron interactions; most are automatic, these are manual!
	{
		reagents: ['protium', 'neutron'],
		products: ['deuterium'],
	},
	{
		reagents: ['deuterium', 'neutron'],
		products: ['tritium'],
	},
	// atom + atom
	{ // https://en.wikipedia.org/wiki/Proton%E2%80%93proton_chain#The_PEP_reaction
		reagents: ['protium', 'protium', 'electron'],
		products: ['deuterium', 'electron neutrino'],
	},
	{ // https://en.wikipedia.org/wiki/Deuterium_fusion
		reagents: ['deuterium', 'protium'],
		products: ['helium-3', 'photon'],
	},
	{ // https://en.wikipedia.org/wiki/Deuterium_fusion#Other_reactions
		reagents: ['deuterium', 'deuterium'],
		products: ['helium-4', 'photon'],
	},
	{ // https://en.wikipedia.org/wiki/Proton%E2%80%93proton_chain#The_p%E2%80%93p_IV_branch
		reagents: ['helium-3', 'protium'],
		products: ['helium-4', 'positron', 'electron neutrino'],
	},
	{ // https://en.wikipedia.org/wiki/Deuterium_fusion#Other_reactions
		reagents: ['helium-3', 'deuterium'],
		products: ['lithium-5', 'photon'],
	},
	{ // https://en.wikipedia.org/wiki/Deuterium_fusion#Other_reactions
		reagents: ['helium-4', 'deuterium'],
		products: ['lithium-6', 'photon'],
	},
	{ // https://en.wikipedia.org/wiki/Proton%E2%80%93proton_chain#The_p%E2%80%93p_I_branch
		reagents: ['helium-3', 'helium-3'],
		products: ['helium-4', 'protium', 'protium'],
	},
	{ // https://en.wikipedia.org/wiki/Proton%E2%80%93proton_chain#The_p%E2%80%93p_II_branch
		reagents: ['helium-4', 'helium-3'],
		products: ['beryllium-7', 'photon'],
	},
	/* FORBIDDEN - THIS WILL CLONE ITSELF!!!
	{ // https://en.wikipedia.org/wiki/Triple-alpha_process#Triple-alpha_process_in_stars
		reagents: ['helium-4', 'helium-4'],
		products: ['beryllium-8'],
	},
	*/
	{ // https://en.wikipedia.org/wiki/Lithium_burning#6Li
		reagents: ['lithium-7', 'protium'],
		products: ['beryllium-8'],
	},
	{ // https://en.wikipedia.org/wiki/Proton%E2%80%93proton_chain#The_p%E2%80%93p_II_branch
		reagents: ['lithium-7', 'protium'],
		products: ['helium-4', 'helium-4'],
	},
	{ // https://en.wikipedia.org/wiki/Proton%E2%80%93proton_chain#The_p%E2%80%93p_II_branch
		reagents: ['beryllium-7', 'electron'],
		products: ['lithium-7', 'electron neutrino'],
	},
	{ // https://en.wikipedia.org/wiki/Proton%E2%80%93proton_chain#The_p%E2%80%93p_III_branch
		reagents: ['beryllium-7', 'protium'],
		products: ['boron-8', 'photon'],
	},
	{ // https://en.wikipedia.org/wiki/Triple-alpha_process#Triple-alpha_process_in_stars
		reagents: ['beryllium-8', 'helium-4'],
		products: ['carbon-12', 'photon', 'photon'],
	},
	{ // https://en.wikipedia.org/wiki/CNO_cycle#CNO-I
		reagents: ['carbon-12', 'protium'],
		products: ['nitrogen-13', 'photon'],
	},
	{ // https://en.wikipedia.org/wiki/Triple-alpha_process#Triple-alpha_process_in_stars
		reagents: ['carbon-12', 'helium-4'],
		products: ['oxygen-16', 'photon'],
	},
	{ // https://en.wikipedia.org/wiki/CNO_cycle#CNO-I
		reagents: ['carbon-13', 'protium'],
		products: ['nitrogen-14', 'photon'],
	},
	{ // https://en.wikipedia.org/wiki/CNO_cycle#HCNO-I
		reagents: ['nitrogen-13', 'protium'],
		products: ['oxygen-14', 'photon'],
	},
	{ // https://en.wikipedia.org/wiki/CNO_cycle#CNO-I
		reagents: ['nitrogen-14', 'protium'],
		products: ['oxygen-15', 'photon'],
	},
	{ // https://en.wikipedia.org/wiki/CNO_cycle#CNO-I
		reagents: ['nitrogen-15', 'protium'],
		products: ['carbon-12', 'helium-4'],
	},
	{ // https://en.wikipedia.org/wiki/CNO_cycle#CNO-II
		reagents: ['oxygen-16', 'protium'],
		products: ['fluorine-17', 'photon'],
	},
	{ // https://en.wikipedia.org/wiki/Alpha_process
		reagents: ['oxygen-16', 'helium-4'],
		products: ['neon-20', 'photon'],
	},
	{ // https://en.wikipedia.org/wiki/CNO_cycle#CNO-II
		reagents: ['oxygen-17', 'protium'],
		products: ['nitrogen-14', 'helium-4'],
	},
	{ // https://en.wikipedia.org/wiki/CNO_cycle#HCNO-II
		reagents: ['fluorine-17', 'protium'],
		products: ['neon-18', 'photon'],
	},
	{ // https://en.wikipedia.org/wiki/CNO_cycle#HCNO-II
		reagents: ['fluorine-18', 'protium'],
		products: ['oxygen-15', 'helium-4'],
	},
];