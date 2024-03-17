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
	decl: {
		f(index){
			// https://en.wiktionary.org/wiki/Appendix:Polish_nouns#Feminine_nouns
			const decl_o = {s: {nom: index}, pl: {}};
			const stem = index.slice(0, index.length-1);
			// Genitive singular adds -y.
			decl_o.s.gen = stem + 'y';
			// Dative singular palatalizes (softens) the final consonant cluster
			// and adds -e, -i or -y.
			// Locative singular is always the same as dative singular.
			decl_o.s.loc = decl_o.s.dat = this.fdat(index);
			// Accusative singular adds -ę.
			decl_o.s.acc = stem + 'ę';
			// Instrumental singular adds -ą.
			decl_o.s.ins = stem + 'ą';
			// Vocative singular adds -o.
			decl_o.s.voc = stem + 'o';
			// todo nom pl annoyance
			decl_o.pl.voc = decl_o.pl.acc = decl_o.pl.nom = this.fpl(index);
			decl_o.pl.gen = stem;
			decl_o.pl.dat = stem + 'om';
			decl_o.pl.ins = stem + 'ami';
			decl_o.pl.loc = stem + 'ach';
			return new Declension(decl_o);
		},
		/** @param {string} word */
		fdat(word){
			const rule = this.fdat_dat.find(r => new RegExp(r[0]).test(word));
			return word.replace(new RegExp(rule[0]), rule[1]);
		},
		// https://en.wiktionary.org/wiki/Appendix:Polish_nouns#List_of_palatalizations_in_the_dative_and_locative
		fdat_dat: [
			// 4c
			['dzia$', 'dzi'],
			// 3c
			['bia$', 'bi'],
			['cha$', 'sze'],
			['cia$', 'ci'],
			['cza$', 'czy'],
			['dza$', 'dzy'],
			['dża$', 'dży'],
			['pia$', 'pi'],
			['rza$', 'rzy'],
			['sia$', 'si'],
			['sła$', 'śle'],
			['sma$', 'śmie'],
			['sna$', 'śnie'],
			['sta$', 'ście'],
			['sza$', 'szy'],
			['zda$', 'ździe'],
			['zia$', 'zi'],
			['zła$', 'źle'],
			['zma$', 'zmie'],
			['zna$', 'źnie'],
			// 2c
			['ba$', 'bie'],
			['ca$', 'cy'],
			['da$', 'dzie'],
			['fa$', 'fie'],
			['ga$', 'dze'],
			['ja$', 'ji'],
			['ka$', 'ce'],
			['la$', 'li'],
			['ła$', 'le'],
			['ma$', 'mie'],
			['na$', 'nie'],
			['pa$', 'pie'],
			['ra$', 'rze'],
			['sa$', 'sie'],
			['ta$', 'cie'],
			['wa$', 'wie'],
			['za$', 'zie'],
			['ża$', 'ży'],
		],
		/** @param {string} word */
		fpl(word){
			const rule = this.fpl_dat.find(r => new RegExp(r[0]).test(word));
			return word.replace(new RegExp(rule[0]), rule[1]);
		},
		fpl_dat: [
			['(?<=[kg])a$', 'i'],
			['(?<=[mbpwfndtzsłrh])a$', 'y'],
			['a$', 'e'],
		],
	},
	display(word){
		const container = document.getElementById('container');
		container.innerHTML = '';
		try {
			container.appendChild(this.decl.f(word).elem);
		}
		catch (_){
			container.appendChild(this.invalid);
		}
	},
	get invalid(){
		const elem = document.createElement('span');
		elem.innerHTML = 'invalid';
		return elem;
	},
	main(){
		const ctrl = document.getElementById('ctrl');
		const input = document.createElement('input');
		ctrl.appendChild(input);
		input.type = 'text';
		input.onkeyup = () => this.display(input.value);
	},
};

const PL_LOADED = true;