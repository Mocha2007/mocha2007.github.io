/* jshint esversion: 6, strict: true, strict: global */
/* exported amu, atomData, particleData, reactionData */
'use strict';

const speedOfLight = 299792458; // m/s; exact
const eV = 1.602176634e-19; // J; exact
const eVc2 = eV / Math.pow(speedOfLight, 2); // kg; exact
const amu = 1.6605390666e-27; // kg; unsure exactless; AKA dalton

const minute = 60;
const hour = 60*minute;
const day = 24*hour;
const year = 365.2425*day;

const betaMinus = ['electron antineutrino'];
const betaPlus = ['positron', 'electron neutrino'];
const electronCapture = ['electron neutrino'];

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
			['tau antineutrino', ...betaPlus],
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
			['pion0', ...betaPlus],
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
			['pion-', ...betaPlus],
			['pion+', 'muon', 'muon neutrino'],
			['pion-', 'antimuon', 'muon antineutrino'],
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
		name: 'antiproton',
		category: 'baryon',
		symbol: {
			char: 'p',
			sup: '-',
			overline: true,
		},
		spin: 0.5,
		charge: -eV,
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
		name: 'antineutron',
		category: 'baryon',
		symbol: {
			char: 'n',
			sup: '0',
			overline: 0,
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
];
const atomData = [
	// normal
	{
		name: 'protium',
		category: 'atom',
		symbol: 'H',
		n: 0,
		z: 1,
		spin: 0.5,
	},
	{
		name: 'deuterium',
		category: 'atom',
		symbol: 'H',
		n: 1,
		z: 1,
		spin: 1,
	},
	{
		name: 'tritium',
		category: 'atom',
		symbol: 'H',
		n: 2,
		z: 1,
		spin: 0.5,
		decays: [
			['helium-3', ...betaMinus],
		],
		halfLife: 12.32*year,
	},
	{
		name: 'helium-3',
		category: 'atom',
		symbol: 'He',
		n: 1,
		z: 2,
		spin: 0.5,
	},
	{
		name: 'helium-4',
		category: 'atom',
		symbol: 'He',
		n: 2,
		z: 2,
		spin: 0,
	},
	{
		name: 'lithium-5',
		category: 'atom',
		symbol: 'Li',
		n: 2,
		z: 3,
		spin: 3/2,
		decays: [
			['helium-4', 'proton'],
		],
		halfLife: 370e-24,
	},
	{
		name: 'lithium-6',
		category: 'atom',
		symbol: 'Li',
		n: 3,
		z: 3,
		spin: 1,
	},
	{
		name: 'lithium-7',
		category: 'atom',
		symbol: 'Li',
		n: 4,
		z: 3,
		spin: 1.5,
	},
	{
		name: 'lithium-8',
		category: 'atom',
		symbol: 'Li',
		n: 5,
		z: 3,
		spin: 2,
		decays: [
			['beryllium-8', ...betaMinus],
		],
		halfLife: 0.8394,
	},
	{
		name: 'beryllium-7',
		category: 'atom',
		symbol: 'Be',
		n: 3,
		z: 4,
		spin: 1.5,
	},
	{
		name: 'beryllium-8',
		category: 'atom',
		symbol: 'Be',
		n: 4,
		z: 4,
		spin: 0,
		decays: [
			['helium-4', 'helium-4'],
		],
		halfLife: 8.19e-19,
	},
	{
		name: 'beryllium-9',
		category: 'atom',
		symbol: 'Be',
		n: 5,
		z: 4,
		spin: 3/2,
	},
	{
		name: 'beryllium-10',
		category: 'atom',
		symbol: 'Be',
		n: 6,
		z: 4,
		spin: 0,
		decays: [
			['boron-10', ...betaMinus],
		],
		halfLife: 1.51e6*year,
	},
	{
		name: 'boron-8',
		category: 'atom',
		symbol: 'B',
		n: 3,
		z: 5,
		spin: 2,
		decays: [
			['beryllium-8', ...betaPlus],
		],
		halfLife: 0.77,
	},
	{
		name: 'boron-10',
		category: 'atom',
		symbol: 'B',
		n: 5,
		z: 5,
		spin: 3,
	},
	{
		name: 'boron-11',
		category: 'atom',
		symbol: 'B',
		n: 6,
		z: 5,
		spin: 3/2,
	},
	{
		name: 'boron-12',
		category: 'atom',
		symbol: 'B',
		n: 7,
		z: 5,
		spin: 1,
		decays: [
			['carbon-12', ...betaMinus],
		],
		halfLife: 0.0202,
	},
	{
		name: 'carbon-12',
		category: 'atom',
		symbol: 'C',
		n: 6,
		z: 6,
		spin: 0,
	},
	{
		name: 'carbon-13',
		category: 'atom',
		symbol: 'C',
		n: 7,
		z: 6,
		spin: 0.5,
	},
	{
		name: 'carbon-14',
		category: 'atom',
		symbol: 'C',
		n: 8,
		z: 6,
		spin: 0,
		decays: [
			['nitrogen-14', ...betaMinus],
		],
		halfLife: 5730*year,
	},
	{
		name: 'nitrogen-13',
		category: 'atom',
		symbol: 'N',
		n: 6,
		z: 7,
		spin: 0.5,
		decays: [
			['carbon-13', ...betaPlus],
		],
		halfLife: 9.965*minute,
	},
	{
		name: 'nitrogen-14',
		category: 'atom',
		symbol: 'N',
		n: 7,
		z: 7,
		spin: 1,
	},
	{
		name: 'nitrogen-15',
		category: 'atom',
		symbol: 'N',
		n: 8,
		z: 7,
		spin: 0.5,
	},
	{
		name: 'nitrogen-16',
		category: 'atom',
		symbol: 'N',
		n: 9,
		z: 7,
		spin: 2,
		decays: [
			['oxygen-16', ...betaMinus], // beta-
		],
		halfLife: 7.13,
	},
	{
		name: 'oxygen-14',
		category: 'atom',
		symbol: 'O',
		n: 6,
		z: 8,
		spin: 0,
		decays: [
			['nitrogen-14', ...betaPlus],
		],
		halfLife: 70.62,
	},
	{
		name: 'oxygen-15',
		category: 'atom',
		symbol: 'O',
		n: 7,
		z: 8,
		spin: 0.5,
		decays: [
			['nitrogen-15', ...betaPlus],
		],
		halfLife: 2.034*minute,
	},
	{
		name: 'oxygen-16',
		category: 'atom',
		symbol: 'O',
		n: 8,
		z: 8,
		spin: 0,
	},
	{
		name: 'oxygen-17',
		category: 'atom',
		symbol: 'O',
		n: 9,
		z: 8,
		spin: 5/2,
	},
	{
		name: 'oxygen-18',
		category: 'atom',
		symbol: 'O',
		n: 10,
		z: 8,
		spin: 0,
	},
	{
		name: 'oxygen-19',
		category: 'atom',
		symbol: 'O',
		n: 11,
		z: 8,
		spin: 5/2,
		decays: [
			['fluorine-19', ...betaMinus],
		],
		halfLife: 7.13,
	},
	{
		name: 'fluorine-17',
		category: 'atom',
		symbol: 'F',
		n: 8,
		z: 9,
		spin: 5/2,
		decays: [
			['oxygen-17', ...betaPlus],
		],
		halfLife: 64.37,
	},
	{
		name: 'fluorine-18',
		category: 'atom',
		symbol: 'F',
		n: 9,
		z: 9,
		spin: 1,
		decays: [
			['oxygen-18', ...betaPlus],
		],
		halfLife: 109.739*minute,
	},
	{
		name: 'fluorine-19',
		category: 'atom',
		symbol: 'F',
		n: 10,
		z: 9,
		spin: 1/2,
	},
	{
		name: 'fluorine-20',
		category: 'atom',
		symbol: 'F',
		n: 11,
		z: 9,
		spin: 2,
		decays: [
			['neon-20', ...betaMinus],
		],
		halfLife: 11.163,
	},
	{
		name: 'neon-18',
		category: 'atom',
		symbol: 'Ne',
		n: 8,
		z: 10,
		spin: 0,
		decays: [
			['fluorine-18', ...betaPlus],
		],
		halfLife: 1.6642,
	},
	{
		name: 'neon-19',
		category: 'atom',
		symbol: 'Ne',
		n: 9,
		z: 10,
		spin: 1/2,
		decays: [
			['fluorine-19', ...betaPlus],
		],
		halfLife: 17.274,
	},
	{
		name: 'neon-20',
		category: 'atom',
		symbol: 'Ne',
		n: 10,
		z: 10,
		spin: 0,
	},
	{
		name: 'neon-21',
		category: 'atom',
		symbol: 'Ne',
		n: 11,
		z: 10,
		spin: 3/2,
	},
	{
		name: 'neon-22',
		category: 'atom',
		symbol: 'Ne',
		n: 12,
		z: 10,
		spin: 0,
	},
	{
		name: 'neon-23',
		category: 'atom',
		symbol: 'Ne',
		n: 13,
		z: 10,
		spin: 1/2,
		decays: [
			['sodium-23', ...betaMinus],
		],
		halfLife: 17.274,
	},
	{
		name: 'sodium-23',
		category: 'atom',
		symbol: 'Na',
		n: 12,
		z: 11,
		spin: 3/2,
	},
	{
		name: 'magnesium-23',
		category: 'atom',
		symbol: 'Mg',
		n: 11,
		z: 12,
		spin: 3/2,
		decays: [
			['sodium-23', ...betaPlus],
		],
		halfLife: 11.317,
	},
	{
		name: 'magnesium-24',
		category: 'atom',
		symbol: 'Mg',
		n: 12,
		z: 12,
		spin: 0,
	},
	{
		name: 'magnesium-25',
		category: 'atom',
		symbol: 'Mg',
		n: 13,
		z: 12,
		spin: 5/2,
	},
	{
		name: 'magnesium-26',
		category: 'atom',
		symbol: 'Mg',
		n: 14,
		z: 12,
		spin: 0,
	},
	{
		name: 'silicon-28',
		category: 'atom',
		symbol: 'Si',
		n: 14,
		z: 14,
		spin: 0,
	},
	{
		name: 'silicon-30',
		category: 'atom',
		symbol: 'Si',
		n: 16,
		z: 14,
		spin: 0,
	},
	{
		name: 'phosphorus-30',
		category: 'atom',
		symbol: 'P',
		n: 15,
		z: 15,
		spin: 1,
		decays: [
			['silicon-30', ...betaPlus],
		],
		halfLife: 2.498*minute,
	},
	{
		name: 'phosphorus-31',
		category: 'atom',
		symbol: 'P',
		n: 16,
		z: 15,
		spin: 1/2,
	},
	{
		name: 'sulfur-31',
		category: 'atom',
		symbol: 'S',
		n: 15,
		z: 16,
		spin: 1/2,
		decays: [
			['phosphorus-31', ...betaPlus],
		],
		halfLife: 2.5534,
	},
	{
		name: 'sulfur-32',
		category: 'atom',
		symbol: 'S',
		n: 16,
		z: 16,
		spin: 0,
	},
	{
		name: 'argon-36',
		category: 'atom',
		symbol: 'Ar',
		n: 18,
		z: 18,
		spin: 0,
	},
	{
		name: 'calcium-40',
		category: 'atom',
		symbol: 'Ca',
		n: 20,
		z: 20,
		spin: 0,
	},
	{
		name: 'calcium-44',
		category: 'atom',
		symbol: 'Ca',
		n: 24,
		z: 20,
		spin: 0,
	},
	{
		name: 'scandium-44',
		category: 'atom',
		symbol: 'Sc',
		n: 23,
		z: 21,
		spin: 2,
		decays: [
			['calcium-44', ...betaPlus],
		],
		halfLife: 3.97*hour,
	},
	{
		name: 'titanium-44',
		category: 'atom',
		symbol: 'Ti',
		n: 22,
		z: 22,
		spin: 0,
		decays: [
			['scandium-44', ...electronCapture],
		],
		halfLife: 60*year,
	},
	{
		name: 'titanium-48',
		category: 'atom',
		symbol: 'Ti',
		n: 26,
		z: 22,
		spin: 0,
	},
	{
		name: 'vanadium-48',
		category: 'atom',
		symbol: 'V',
		n: 25,
		z: 23,
		spin: 4,
		decays: [
			['titanium-48', ...betaPlus],
		],
		halfLife: 15.9735*day,
	},
	{
		name: 'chromium-48',
		category: 'atom',
		symbol: 'Cr',
		n: 24,
		z: 24,
		spin: 0,
		decays: [
			['vanadium-48', ...betaPlus],
		],
		halfLife: 21.56*hour,
	},
	{
		name: 'chromium-52',
		category: 'atom',
		symbol: 'Cr',
		n: 28,
		z: 24,
		spin: 0,
	},
	{
		name: 'manganese-52',
		category: 'atom',
		symbol: 'Mn',
		n: 27,
		z: 25,
		spin: 6,
		decays: [
			['chromium-52', ...betaPlus],
		],
		halfLife: 5.591*day,
	},
	{
		name: 'iron-52',
		category: 'atom',
		symbol: 'Fe',
		n: 26,
		z: 26,
		spin: 0,
		decays: [
			['manganese-52', ...betaPlus], // technically 52m
		],
		halfLife: 8.275*hour,
	},
	{
		name: 'iron-56',
		category: 'atom',
		symbol: 'Fe',
		n: 30,
		z: 26,
		spin: 0,
	},
	{
		name: 'cobalt-56',
		category: 'atom',
		symbol: 'Co',
		n: 29,
		z: 27,
		spin: 4,
		decays: [
			['iron-56', ...betaPlus],
		],
		halfLife: 77.233*day,
	},
	{
		name: 'nickel-56',
		category: 'atom',
		symbol: 'Ni',
		n: 28,
		z: 28,
		spin: 0,
		decays: [
			['cobalt-56', ...betaPlus],
		],
		halfLife: 6.075*day,
	},
	{
		name: 'nickel-60',
		category: 'atom',
		symbol: 'Ni',
		n: 32,
		z: 28,
		spin: 0,
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
	// antimatter reactions
	{ // (educated guess)
		reagents: ['proton', 'antineutron'],
		products: ['pion+', 'photon'],
	},
	{ // (educated guess)
		reagents: ['neutron', 'antiproton'],
		products: ['pion-', 'photon'],
	},
	// normal atoms
	{ // https://en.wikipedia.org/wiki/Big_Bang_nucleosynthesis#Neutron%E2%80%93proton_ratio
		reagents: ['proton', 'electron antineutrino'],
		products: ['neutron', 'positron'],
	},
	{
		reagents: ['proton', 'electron'],
		products: ['protium'],
	},
	{ // https://en.wikipedia.org/wiki/Proton%E2%80%93proton_chain
		reagents: ['proton', 'proton'],
		products: ['deuterium', 'positron', 'electron neutrino'],
	},
	{ // https://en.wikipedia.org/wiki/Big_Bang_nucleosynthesis#Neutron%E2%80%93proton_ratio
		reagents: ['neutron', 'electron neutrino'],
		products: ['proton', 'electron'],
	},
	{ // https://en.wikipedia.org/wiki/Big_Bang_nucleosynthesis#Neutron%E2%80%93proton_ratio
		reagents: ['neutron', 'positron'],
		products: ['proton', 'electron antineutrino'],
	},
	// atom + atom
	{ // https://www.phy.anl.gov/mep/photorxn/index.html 1999
		reagents: ['protium', 'photon'],
		products: [
			[1, ['proton', 'electron']],
			[1, ['proton', 'pion0']],
		],
	},
	{ // alternate https://en.wikipedia.org/wiki/Proton%E2%80%93proton_chain
		reagents: ['protium', 'protium'],
		products: ['deuterium', 'electron neutrino'],
	},
	{ // https://en.wikipedia.org/wiki/Photodisintegration#Photodisintegration_of_deuterium
		reagents: ['deuterium', 'photon'],
		products: ['protium', 'neutron'],
		tags: 'photodisintegration',
	},
	{ // https://en.wikipedia.org/wiki/Deuterium_fusion
		reagents: ['deuterium', 'protium'],
		products: ['helium-3', 'photon'],
	},
	{
		reagents: ['deuterium', 'deuterium'],
		products: [
			// https://physics.stackexchange.com/questions/724694/why-dont-deuterons-produce-a-helium-4-nucleus-when-they-fuse/724702#724702
			[0.000001, ['helium-4', 'photon']], // https://en.wikipedia.org/wiki/Deuterium_fusion#Other_reactions
			[0.55, ['helium-3', 'neutron']], // https://en.wikipedia.org/wiki/Big_Bang_nucleosynthesis#Baryon%E2%80%93photon_ratio
			[0.45, ['tritium', 'protium']], // https://en.wikipedia.org/wiki/Big_Bang_nucleosynthesis#Baryon%E2%80%93photon_ratio
		],
	},
	{ // https://physics.stackexchange.com/questions/403063/can-you-combine-protium-and-tritium-to-produce-helium-4
		reagents: ['tritium', 'protium'],
		products: ['helium-3', 'neutron'],
	},
	{ // https://en.wikipedia.org/wiki/Deuterium%E2%80%93tritium_fusion
		// https://en.wikipedia.org/wiki/Big_Bang_nucleosynthesis#Baryon%E2%80%93photon_ratio
		reagents: ['tritium', 'deuterium'],
		products: ['helium-4', 'neutron'],
	},
	{ // https://www.quora.com/Tritium-Tritium-reaction-besides-scarce-supply-would-it-not-be-easier-to-obtain-fusion-and-say-we-finally-obtained-fusion
		reagents: ['tritium', 'tritium'],
		products: ['helium-4', 'neutron', 'neutron'],
	},
	{ // https://en.wikipedia.org/wiki/Proton%E2%80%93proton_chain#The_p%E2%80%93p_IV_branch
		reagents: ['helium-3', 'protium'],
		products: ['helium-4', 'positron', 'electron neutrino'],
	},
	{
		reagents: ['helium-3', 'deuterium'],
		products: [
			[1, ['helium-4', 'protium']], // https://en.wikipedia.org/wiki/Aneutronic_fusion#Candidate_reactions
			[1, ['lithium-5', 'photon']], // https://en.wikipedia.org/wiki/Deuterium_fusion#Other_reactions
		],
	},
	{ // https://en.wikipedia.org/wiki/Proton%E2%80%93proton_chain#The_p%E2%80%93p_I_branch
		reagents: ['helium-3', 'helium-3'],
		products: ['helium-4', 'protium', 'protium'],
	},
	{ // https://en.wikipedia.org/wiki/Deuterium_fusion#Other_reactions
		reagents: ['helium-4', 'deuterium'],
		products: ['lithium-6', 'photon'],
	},
	{ // https://en.wikipedia.org/wiki/Nucleosynthesis#Big_Bang_nucleosynthesis
		reagents: ['helium-4', 'tritium'],
		products: ['lithium-7', 'photon'],
	},
	{ // https://en.wikipedia.org/wiki/Proton%E2%80%93proton_chain#The_p%E2%80%93p_II_branch
		reagents: ['helium-4', 'helium-3'],
		products: ['beryllium-7', 'photon'],
	},
	{ // https://en.wikipedia.org/wiki/Triple-alpha_process#Triple-alpha_process_in_stars
		reagents: ['helium-4', 'helium-4'],
		products: ['beryllium-8', 'photon'],
	},
	{
		reagents: ['lithium-6', 'protium'],
		products: [
			[1, ['beryllium-7', 'photon']], // https://en.wikipedia.org/wiki/Lithium_burning#6Li
			[1, ['helium-4', 'helium-3']], // https://en.wikipedia.org/wiki/Aneutronic_fusion#Candidate_reactions
		],
	},
	{ // https://en.wikipedia.org/wiki/Aneutronic_fusion
		reagents: ['lithium-6', 'deuterium'],
		products: ['helium-4', 'helium-4'],
	},
	{ // https://en.wikipedia.org/wiki/Aneutronic_fusion
		reagents: ['lithium-6', 'helium-3'],
		products: ['helium-4', 'helium-4', 'protium'],
	},
	{
		reagents: ['lithium-7', 'protium'],
		products: [
			[1, ['beryllium-8', 'photon']], // https://en.wikipedia.org/wiki/Lithium_burning#6Li
			[1, ['helium-4', 'helium-4']], // https://en.wikipedia.org/wiki/Proton%E2%80%93proton_chain#The_p%E2%80%93p_II_branch
		],
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
	{ // https://en.wikipedia.org/wiki/Photodisintegration#Photodisintegration_of_beryllium
		reagents: ['beryllium-9', 'photon'],
		products: ['helium-4', 'helium-4', 'neutron'],
		tags: 'photodisintegration',
	},
	{
		reagents: ['boron-11', 'protium'],
		products: [
			[1, ['helium-4', 'helium-4', 'helium-4']], // https://en.wikipedia.org/wiki/Fusion_power#Proton,_boron-11
			[0.001, ['carbon-11', 'neutron']], // https://en.wikipedia.org/wiki/Aneutronic_fusion#Boron
			// prob from https://en.wikipedia.org/wiki/Fusion_power#Proton,_boron-11
			[1, ['carbon-12', 'photon']], // https://en.wikipedia.org/wiki/Aneutronic_fusion#Boron
		],
	},
	{ // https://en.wikipedia.org/wiki/Aneutronic_fusion#Boron
		reagents: ['boron-11', 'deuterium'],
		products: ['carbon-12', 'neutron'],
	},
	{ // https://en.wikipedia.org/wiki/Aneutronic_fusion#Boron
		reagents: ['boron-11', 'helium-4'],
		products: ['nitrogen-14', 'neutron'],
	},
	{ // https://en.wikipedia.org/wiki/CNO_cycle#CNO-I
		reagents: ['carbon-12', 'protium'],
		products: ['nitrogen-13', 'photon'],
	},
	{ // https://en.wikipedia.org/wiki/Triple-alpha_process#Triple-alpha_process_in_stars
		reagents: ['carbon-12', 'helium-4'],
		products: ['oxygen-16', 'photon'],
	},
	{ // https://en.wikipedia.org/wiki/Carbon-burning_process#Fusion_reactions
		reagents: ['carbon-12', 'carbon-12'],
		products: [
			[2, ['neon-20', 'helium-4']],
			[2, ['sodium-23', 'protium']],
			[2, ['magnesium-23', 'neutron']],
			[1, ['magnesium-24', 'photon']],
			[1, ['oxygen-16', 'helium-4', 'helium-4']],
		],
	},
	{ // https://en.wikipedia.org/wiki/CNO_cycle#CNO-I
		reagents: ['carbon-13', 'protium'],
		products: ['nitrogen-14', 'photon'],
	},
	{ // https://en.wikipedia.org/wiki/S-process#The_s-process_in_stars
		reagents: ['carbon-13', 'helium-4'],
		products: ['oxygen-16', 'neutron'],
	},
	{ // https://en.wikipedia.org/wiki/CNO_cycle#HCNO-I
		reagents: ['nitrogen-13', 'protium'],
		products: ['oxygen-14', 'photon'],
	},
	{ // https://en.wikipedia.org/wiki/Cosmic_ray#Changes_in_atmospheric_chemistry
		reagents: ['nitrogen-14', 'neutron'],
		products: ['carbon-14', 'protium'],
	},
	{ // https://en.wikipedia.org/wiki/CNO_cycle#CNO-I
		reagents: ['nitrogen-14', 'protium'],
		products: ['oxygen-15', 'photon'],
	},
	{
		reagents: ['nitrogen-15', 'protium'],
		products: [
			[0.9996, ['carbon-12', 'helium-4']], // https://en.wikipedia.org/wiki/CNO_cycle#CNO-I
			[0.0004, ['oxygen-16', 'photon']], // https://en.wikipedia.org/wiki/CNO_cycle#CNO-II
		],
	},
	{ // https://en.wikipedia.org/wiki/CNO_cycle#CNO-II
		reagents: ['oxygen-16', 'protium'],
		products: ['fluorine-17', 'photon'],
	},
	{ // https://en.wikipedia.org/wiki/Alpha_process
		reagents: ['oxygen-16', 'helium-4'],
		products: ['neon-20', 'photon'],
	},
	{ // https://en.wikipedia.org/wiki/Oxygen-burning_process
		reagents: ['oxygen-16', 'oxygen-16'],
		products: [
			[0.34, ['silicon-28', 'helium-4']],
			[0.56, ['phosphorus-31', 'protium']],
			[0.05, ['sulfur-31', 'neutron']],
			[0.01, ['silicon-30', 'protium', 'protium']],
			[0.05, ['phosphorus-30', 'deuterium']],
			[0.01, ['sulfur-32', 'photon']],
			[0.01, ['magnesium-24', 'helium-4', 'helium-4']],
		],
	},
	{
		reagents: ['oxygen-17', 'protium'],
		products: [
			[1, ['nitrogen-14', 'helium-4']], // https://en.wikipedia.org/wiki/CNO_cycle#CNO-II
			[1, ['fluorine-18', 'photon']], // https://en.wikipedia.org/wiki/CNO_cycle#CNO-III
		],
	},
	{
		reagents: ['oxygen-18', 'protium'],
		products: [
			[1, ['nitrogen-15', 'helium-4']], // https://en.wikipedia.org/wiki/CNO_cycle#CNO-III
			[1, ['fluorine-19', 'photon']], // https://en.wikipedia.org/wiki/CNO_cycle#CNO-IV
		],
	},
	{ // https://en.wikipedia.org/wiki/CNO_cycle#HCNO-II
		reagents: ['fluorine-17', 'protium'],
		products: ['neon-18', 'photon'],
	},
	{ // https://en.wikipedia.org/wiki/CNO_cycle#HCNO-II
		reagents: ['fluorine-18', 'protium'],
		products: ['oxygen-15', 'helium-4'],
	},
	{ // https://en.wikipedia.org/wiki/CNO_cycle#HCNO-IV
		reagents: ['fluorine-19', 'protium'],
		products: ['oxygen-16', 'helium-4'],
	},
	{ // https://en.wikipedia.org/wiki/Neon-burning_process
		reagents: ['neon-20', 'helium-4'],
		products: ['magnesium-24', 'photon'],
		tags: 'photodisintegration',
	},
	{ // https://en.wikipedia.org/wiki/Neon-burning_process
		reagents: ['neon-20', 'photon'],
		products: ['oxygen-16', 'helium-4'],
	},
	{ // https://en.wikipedia.org/wiki/Alpha_process
		reagents: ['neon-20', 'helium-4'],
		products: ['magnesium-24', 'photon'],
	},
	{ // https://en.wikipedia.org/wiki/Neon-burning_process
		reagents: ['neon-21', 'helium-4'],
		products: ['magnesium-24', 'neutron'],
	},
	{ // https://en.wikipedia.org/wiki/S-process#The_s-process_in_stars
		reagents: ['neon-22', 'helium-4'],
		products: ['magnesium-25', 'neutron'],
	},
	{ // https://en.wikipedia.org/wiki/Alpha_process
		reagents: ['magnesium-24', 'helium-4'],
		products: ['silicon-28', 'photon'],
	},
	{ // https://en.wikipedia.org/wiki/Alpha_process
		reagents: ['silicon-28', 'helium-4'],
		products: ['sulfur-32', 'photon'],
	},
	{ // https://en.wikipedia.org/wiki/Alpha_process
		reagents: ['sulfur-32', 'helium-4'],
		products: ['argon-36', 'photon'],
	},
	{ // https://en.wikipedia.org/wiki/Alpha_process
		reagents: ['argon-36', 'helium-4'],
		products: ['calcium-40', 'photon'],
	},
	{ // https://en.wikipedia.org/wiki/Alpha_process
		reagents: ['calcium-40', 'helium-4'],
		products: ['titanium-44', 'photon'],
	},
	{ // https://en.wikipedia.org/wiki/Alpha_process
		reagents: ['titanium-44', 'helium-4'],
		products: ['chromium-48', 'photon'],
	},
	{ // https://en.wikipedia.org/wiki/Alpha_process
		reagents: ['chromium-48', 'helium-4'],
		products: ['iron-52', 'photon'],
	},
	{ // https://en.wikipedia.org/wiki/Alpha_process
		reagents: ['iron-52', 'helium-4'],
		products: ['nickel-56', 'photon'],
	},
	{ // https://en.wikipedia.org/wiki/Alpha_process
		reagents: ['iron-56', 'helium-4'],
		products: ['nickel-60', 'photon'],
	},
];
/* stellar nucleosynthesis pages:
	DONE:
		- isotopes of elements before sodium
		- Deuterium fusion
		- proton-proton chain
		- CNO cycle
		- triple-alpha process
		- lithium burning
		- carbon burning
		- neon burning
		- oxygen burning
		other:
			- aneutronic fusion
			- big bang nucleosynthesis
			- deuterium fusion
			- cosmic ray
			- fusion power
			- photodisintegration
		- alpha process
		- silicon burning
*/