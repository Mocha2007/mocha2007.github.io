/* exported particleData */
'use strict';

const speedOfLight =  299792458; // m/s; exact
const eV = 1.602176634e-19; // J; exact
const eVc2 = eV / Math.pow(speedOfLight, 2); // kg; exact

const particleData = [
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
	},
	{
		name: 'tau neutrino',
		category: 'lepton',
		symbol: {
			char: 'ν',
			sup: 'τ',
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
			sup: 'τ',
			overline: true,
		},
		spin: 0.5,
		charge: 0,
		mass: 15.5e6*eVc2,
	},
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
];