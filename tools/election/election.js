class Gender {
	static FEMALE = 0;
	static MALE = 1;
}

class Party {
	static INDEPENDENT = -1;
	static DEMOCRATIC = 0;
	static REPUBLICAN = 1;
	static LIBERTARIAN = 2;
	static GREEN = 3
}

class State {
	constructor(ev, p_rep){
		this.ev = ev;
		this.p_rep = p_rep;
	}
}

class Politician {
	constructor(name, age, gender, party){
		this.name = name;
		this.age = age;
		this.gender = gender;
		this.party = party;
	}
	get eligible_for_president(){
		return 35 < this.age;
	}
}

// https://www.ssa.gov/oact/STATS/table4c6.html
const ACTUARIAL_TABLE = [

];

// https://en.wikipedia.org/wiki/Twelfth_Amendment_to_the_United_States_Constitution#Text