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
];

const reactionData = [
	{
		reagents: ['proton', 'electron'],
		products: ['protium'],
	},
	{
		reagents: ['protium', 'neutron'],
		products: ['deuterium'],
	},
	{
		reagents: ['deuterium', 'neutron'],
		products: ['tritium'],
	},
	{
		reagents: ['helium-3', 'neutron'],
		products: ['helium-4'],
	},
];