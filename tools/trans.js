/* exported convert */

const convert = {
	constants: {
		e: {
			mm: 272.38, // g/mol
		},
		t: {
			mm: 288.431, // g/mol
		},
	},
	e(fromMol){
		const E_G = +this.elem.e_g.value;
		const E_MOL = +this.elem.e_mol.value;
		const C = 1000 / this.constants.e.mm; // cause mL -> L
		if (fromMol)
			this.elem.e_g.value = E_MOL / C;
		else
			this.elem.e_mol.value = E_G * C;
	},
	elem: {
		/** @returns {HTMLInputElement} */
		get e_g(){
			return document.getElementById('e_g');
		},
		/** @returns {HTMLInputElement} */
		get e_mol(){
			return document.getElementById('e_mol');
		},
		/** @returns {HTMLInputElement} */
		get t_g(){
			return document.getElementById('t_g');
		},
		/** @returns {HTMLInputElement} */
		get t_mol(){
			return document.getElementById('t_mol');
		},
	},
	t(fromMol){
		const T_G = +this.elem.t_g.value;
		const T_MOL = +this.elem.t_mol.value;
		const C = 1000 / this.constants.t.mm; // cause mL -> L
		if (fromMol)
			this.elem.t_g.value = T_MOL / C;
		else
			this.elem.t_mol.value = T_G * C;
	},
};