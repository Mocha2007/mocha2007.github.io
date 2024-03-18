/* exported PL, PL_LOADED */

class Declension {
	constructor(o){
		// s
		this.snom = o.s.nom;
		this.sgen = o.s.gen;
		this.sdat = o.s.dat;
		this.sacc = o.s.acc;
		this.sins = o.s.ins;
		this.sloc = o.s.loc;
		this.svoc = o.s.voc;
		// pl
		this.plnom = o.pl.nom;
		this.plgen = o.pl.gen;
		this.pldat = o.pl.dat;
		this.placc = o.pl.acc;
		this.plins = o.pl.ins;
		this.plloc = o.pl.loc;
		this.plvoc = o.pl.voc;
	}
	get elem(){
		const o = document.createElement('table');
		o.innerHTML = '<tr><th></th><th>s</th><th>pl</th></tr>';
		['nom', 'gen', 'dat', 'acc', 'ins', 'loc', 'voc'].forEach(c => {
			const tr = document.createElement('tr');
			o.appendChild(tr);
			const th = document.createElement('th');
			th.innerHTML = c;
			tr.appendChild(th);
			['s', 'pl'].forEach(number => {
				const td = document.createElement('td');
				tr.appendChild(td);
				td.innerHTML = this[`${number}${c}`];
			});
		});
		return o;
	}
}

const PL = {
	/** @returns {"inan"|"anim"|"pers"} */
	get animacy(){
		return document.querySelector('input[name="animacy"]:checked').value || 'inan';
	},
	decl: {
		/** @param {string} index */
		ablaut(index){
			index = index.split('').reverse().join('');
			const ALTERNATIONS = [['ei?', ''], ['ó', 'o'], ['o', 'ó'], ['ą', 'ę'], ['ę', 'ą']];
			for (let i = 0; i < ALTERNATIONS.length; i++){
				const NEW = index.replace(new RegExp(ALTERNATIONS[i][0]), ALTERNATIONS[i][1]);
				if (NEW !== index){
					index = NEW;
					break;
				}
			}
			index = index.split('').reverse().join('');
			return index;
		},
		// cf. https://courseofpolish.com/grammar/cases/nouns-declension/cases-endings-summary
		decl(index){
			const LAST1 = index[index.length-1];
			const LAST2 = index.slice(index.length-2);
			const LAST3 = index.slice(index.length-3);
			if (LAST3 === 'mię')
				return this.n(index, LAST3);
			if (LAST2 === 'ść')
				return this.f2(index);
			if (LAST2 === 'um')
				return this.n(index, LAST2);
			if (LAST1 === 'a')
				return PL.irr_mf ? this.mf(index) : this.f(index);
			if ('oeę'.includes(LAST1))
				return this.n(index, LAST1);
			return this.m(index);
		},
		ends_in_velar(stem){
			return 'kg'.includes(stem[stem.length-1]);
		},
		f(index){
			// https://en.wiktionary.org/wiki/Appendix:Polish_nouns#Feminine_nouns
			const decl_o = {s: {nom: index}, pl: {}};
			const stem = index.slice(0, index.length-1);
			// Genitive singular adds -y.
			decl_o.s.gen = stem + this.yi(stem);
			// Dative singular palatalizes (softens) the final consonant cluster
			// and adds -e, -i or -y.
			// Locative singular is always the same as dative singular.
			decl_o.s.loc = decl_o.s.dat = this.is_hard(stem) ? this.palstem(stem) + 'e' : stem + this.yi(stem);
			// Accusative singular adds -ę.
			decl_o.s.acc = stem + 'ę';
			// Instrumental singular adds -ą.
			decl_o.s.ins = stem + 'ą';
			// Vocative singular adds -o.
			decl_o.s.voc = stem + 'o';
			// pl
			decl_o.pl.voc = decl_o.pl.acc = decl_o.pl.nom = stem + (this.is_hard(stem) ? this.yi(stem) : 'e');
			decl_o.pl.gen = stem;
			decl_o.pl.dat = stem + 'om';
			decl_o.pl.ins = stem + 'ami';
			decl_o.pl.loc = stem + 'ach';
			return new Declension(decl_o);
		},
		// -ść fem noun
		f2(index){
			const decl_o = {s: {nom: index}, pl: {}};
			decl_o.s.acc = decl_o.s.nom;
			decl_o.s.gen = decl_o.s.dat = decl_o.s.loc = decl_o.s.voc
				= decl_o.pl.nom = decl_o.pl.gen = decl_o.pl.acc = decl_o.pl.voc
				= index + this.yi(index);
			decl_o.s.ins = index + 'ą';
			decl_o.pl.dat = index + 'om';
			decl_o.pl.ins = index + 'ami';
			decl_o.pl.loc = index + 'ach';
			return new Declension(decl_o);
		},
		hard: 'pbfwmtdsznłrkgh',
		hardnv: 'pbfwmtdsznłr',
		/** @param {string} stem */
		is_hard(stem, exclude_velars = false, include_cdzj = false){
			if (include_cdzj && stem.match(/c$|dz$|j$/g))
				return true;
			stem = stem.replace(/(?<=[rdsc])z/g, '`');
			return (exclude_velars ? this.hardnv : this.hard)
				.includes(stem[stem.length-1]);
		},
		// https://en.wiktionary.org/wiki/Template:pl-decl-noun-m-pr ???
		m(index){
			const decl_o = {s: {nom: index}, pl: {}};
			if (PL.irr_oa)
				index = this.ablaut(index);
			decl_o.s.gen = index + {inan: 'u', anim: 'a', pers: 'a'}[PL.animacy];
			decl_o.s.acc = PL.animacy === 'inan' ? decl_o.s.nom : decl_o.s.gen;
			decl_o.s.dat = index + (PL.irr_mudat ? 'u' : 'owi');
			decl_o.s.ins = index + (this.ends_in_velar(index) ? 'i' : '') + 'em';
			decl_o.s.loc = decl_o.s.voc = this.is_hard(index, true) ? this.palstem(index) + 'e' : index + 'u';
			decl_o.pl.voc = decl_o.pl.nom = PL.irr_owie ? index + 'owie'
				: (PL.animacy === 'pers' ? this.palstem(index) : index)
				+ (this.is_hard(index) ? this.yi(index) : 'e');
			decl_o.pl.gen = index + (this.is_hard(index, false, true) ? 'ów' : this.yi(index));
			decl_o.pl.acc = PL.animacy === 'pers' ? decl_o.pl.gen : decl_o.pl.nom;
			decl_o.pl.dat = index + 'om';
			decl_o.pl.ins = index + 'ami';
			decl_o.pl.loc = index + 'ach';
			return new Declension(decl_o);
		},
		mf(index){
			// masculine nouns that end in -a
			const D_M = this.m(index.slice(0, index.length-1));
			const D_F = this.f(index);
			['nom', 'gen', 'dat', 'acc', 'ins', 'loc', 'voc']
				.forEach(c => D_F[`pl${c}`] = D_M[`pl${c}`]);
			return D_F;
		},
		n(index, ending = 'o'){
			const decl_o = {s: {nom: index}, pl: {}};
			let stem = index.slice(0, index.length-ending.length);
			decl_o.s.acc = decl_o.s.voc = decl_o.s.nom;
			if (ending === 'um'){
				decl_o.s.gen = decl_o.s.dat = decl_o.s.ins = decl_o.s.loc = index;
				decl_o.pl.gen = stem + 'ów';
			}
			else if (ending === 'mię'){
				decl_o.s.gen = stem + 'mienia';
				decl_o.s.loc = decl_o.s.dat = stem + 'mieniu';
				decl_o.s.ins = stem + 'mieniem';
				stem += 'mion';
				decl_o.pl.gen = stem;
			}
			else if (ending === 'ę'){
				decl_o.s.gen = index + 'cia';
				decl_o.s.loc = decl_o.s.dat = index + 'ciu';
				decl_o.s.ins = index + 'ciem';
				decl_o.pl.gen = stem + 'ąt';
				stem += 't';
			}
			else {
				decl_o.s.gen = stem + 'a';
				decl_o.s.dat = stem + 'u';
				decl_o.s.ins = stem + (this.ends_in_velar(stem) ? 'i' : '') + 'em';
				decl_o.s.loc = this.is_hard(stem, true) ? this.palstem(stem) + 'e': stem + 'u';
				decl_o.pl.gen = stem;
			}
			decl_o.pl.nom = decl_o.pl.acc = decl_o.pl.voc = PL.irr_yin ? this.palstem(stem) + this.yi(stem) : stem + 'a';
			decl_o.pl.dat = stem + 'om';
			decl_o.pl.ins = stem + 'ami';
			decl_o.pl.loc = stem + 'ach';
			return new Declension(decl_o);
		},
		palstem(stem){
			const HEAD = stem.slice(0, stem.length-1);
			const LAST = stem[stem.length-1];
			const LAST_TWO = stem.slice(0, stem.length-2);
			if ('ch st zd sł zł sn zn'.split(' ').includes(LAST_TWO))
				return stem.replace(new RegExp(LAST_TWO + '$'),
				{ch: 'sz', st: 'ść', zd: 'źdź', sł: 'śl', zł: 'źl', sn: 'śni', zn: 'źni'}[LAST_TWO]);
			if ('pbfwmszn'.includes(LAST))
				return stem + 'i';
			if (LAST === 't')
				return HEAD + 'ci';
			if (LAST === 'd')
				return HEAD + 'dzi';
			if (LAST === 'ł')
				return HEAD + 'l';
			if (LAST === 'r')
				return HEAD + 'rz';
			if (LAST === 'k')
				return HEAD + 'c';
			if (LAST === 'g')
				return HEAD + 'dz';
			console.warn(`PL.decl.palstem can't soften "${stem}"`);
			return stem;
		},
		soft: 'ićźśńlcżj`', // lacks rz, dz, sz, cz: replace these with X'
		yi(stem){
			return 'kgćźśńlj'.includes(stem[stem.length-1]) ? 'i' : 'y';
		},
	},
	display(word){
		const container = document.getElementById('container');
		container.innerHTML = '';
		try {
			container.appendChild(this.decl.decl(word).elem);
		}
		catch (_){
			container.appendChild(this.invalid);
		}
	},
	init(){
		// pass
	},
	get invalid(){
		const elem = document.createElement('span');
		elem.innerHTML = 'invalid';
		return elem;
	},
	get irr_mf(){
		return document.getElementById('mf').checked;
	},
	get irr_mudat(){
		return document.getElementById('mudat').checked;
	},
	get irr_oa(){
		return document.getElementById('oa').checked;
	},
	get irr_owie(){
		return document.getElementById('owie').checked;
	},
	get irr_yin(){
		return document.getElementById('yin').checked;
	},
	main(){
		this.display(document.getElementById('inp').value);
	},
};

const PL_LOADED = true;