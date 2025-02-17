/* exported name */
/* global random, sum, title */

class Language {
	constructor(name, forms, sets){
		this.name = name;
		/** @type {number[][][]} */
		this.forms = forms; // eg. array of [[0], [1, 2], [0, 1]]
		/** @type {string[][]} */
		this.sets = sets; // eg. [["eigh", "xton"], ["ash", "jo"]]
		this.addRadioButton();
		Language.languages.push(this);
	}
	addRadioButton(){
		namegen.elem.langs.appendChild(this.elem);
	}
	get count(){
		return sum(this.forms.map(
			form => form.map(
				setIds => sum(setIds.map(
					setId => this.sets[setId].length))).reduce((a, b) => a * b, 1)));
	}
	get elem(){
		if (this.elem_)
			return this.elem_;
		const container = document.createElement('span');
		// https://www.w3schools.com/tags/att_input_type_radio.asp
		const radio = document.createElement('input');
		radio.type = 'radio';
		radio.name = 'langs';
		radio.classList.add('langChoice');
		if (!Language.languages.length)
			radio.checked = 'checked';
		// label
		const label = document.createElement('label');
		label.innerHTML = this.name;
		label.appendChild(radio);
		container.appendChild(label);
		return this.elem_ = container;
	}
	/** @returns {boolean} */
	get selected(){
		return this.elem.children[0].children[0].checked;
	}
	gen(){
		return this.randomForm().map(x => this.randomComponent(x)).join('');
	}
	/**
	 * @param {number[]} setIds
	 * @returns {string}
	 */
	randomComponent(setIds){
		/** @type {string[]} */
		let acceptable = [];
		setIds.forEach(id => acceptable = acceptable.concat(this.sets[id]));
		return random.choice(acceptable);
	}
	/** @returns {number[][]} */
	randomForm(){
		return random.choice(this.forms);
	}
}
/** @type {Language[]} */
Language.languages = [];

const namegen = {
	elem: {
		/** @returns {HTMLDivElement} */
		get count(){
			return document.getElementById('count');
		},
		/** @returns {HTMLDivElement} */
		get langs(){
			return document.getElementById('langs');
		},
		/** @returns {HTMLDivElement} */
		get result(){
			return document.getElementById('result');
		},
	},
	get lang(){
		return Language.languages.find(l => l.selected);
	},
	run(){
		this.elem.result.innerHTML = title(this.lang.gen());
	},
	updateCount(){
		this.elem.count.innerHTML = this.lang.count + ' possible names';
	},
};

const DITHEMATIC = [[0], [1]];

new Language('Tragedeigh', [DITHEMATIC, [[2]].concat(DITHEMATIC)],
	/*
		SOURCES
		https://www.reddit.com/r/tragedeigh/comments/14dkpz0/posted_in_my_due_date_group/
		https://i.imgur.com/XpvLXFM.jpg
		https://www.reddit.com/gallery/149zi68
		https://i.redd.it/3brdzk6rx67b1.jpg
	*/
	[
		['at', 'brax', 'bray', 'brex', 'brin', 'bry', 'bryght', 'car', 'ever', 'fyn', 'gray', 'had', 'hey',
			'hud', 'hunt', 'hux', 'jae', 'jax', 'kaey', 'kash', 'kay', 'khay', 'khyn', 'kort', 'ky', 'lox', 'oak',
			'pais', 'pay', 'reign', 'tai', 'qwin', 'say', 'zay'],
		['beaux', 'bryn', 'cyn', 'cynn', 'don', 'dyn', 'lan', 'lea', 'leah', 'lee', 'leeigh', 'leey',
			'leghy', 'lei', 'leigh', 'ler', 'ley', 'lie', 'lii',
			'lin', 'lyn', 'lynn', 'reigh', 'sen', 'sleigh', 'son', 'ster', 'syn', 'ton', 'tyn',
			'ven', 'zen', 'zlee', 'zleigh'],
		['mac', 'mc'],
	]
);

new Language('Proto-Celtic', [DITHEMATIC],
	// https://en.wiktionary.org/wiki/Category:Proto-Celtic_male_given_names
	[
		['ambi', 'anawo', 'awi', 'dago', 'dubno', 'esu', 'iwo',
			'katu', 'kengeto', 'koro', 'kuno', 'kʷenno',
			'maglo', 'medu', 'oino', 'rextu', 'tanko', 'tazgo', 'tigerno', 'touto', 'weiko', 'weni', 'wiro'],
		['bilyos', 'galos', 'ganyos', 'genos', 'gnāwos', 'gustus', 'gʷonos', 'kantos', 'karos', 'katus', 'kū', 'kunos', 'maglos', 'mandus', 'māros',
			'rīxs', 'tigernos', 'walos', 'welnāmnos', 'windos'],
	]
);

new Language('Proto-Germanic', [DITHEMATIC],
	// source https://en.wikipedia.org/wiki/Germanic_name#Dithematic_names
	// https://en.wiktionary.org/wiki/Category:Proto-Germanic_male_given_names
	[
		['aga', 'agi', 'ala', 'albi', 'ald', 'anô', 'ans', 'ar', 'auda', 'aþala',
			'balþa', 'band', 'berhta', 'berô', 'branda', 'brūna', 'burg',
			'daga', 'deuza', 'dōma', 'druhti', 'ebura', 'erkna',
			'fardi', 'fastu', 'friþu', 'frōda', 'fulka',
			'ganga', 'gaiza', 'garda', 'gulþa', 'gifti', 'gōda', 'gunþi',
			'haila', 'haima', 'hamara', 'haruga', 'hardu', 'harja', 'hildi', 'helta', 'himina', 'heru', 'heruta', 'hlūda', 'hrōþi',
			'kōni', 'kunja', 'kunþa', 'kwikwa',
			'mērija', 'rīki', 'sinþa', 'sega', 'swinþa',
			'wandila', 'wala', 'walda', 'wini', 'wulfa'],
		['balþaz', 'berhtaz', 'brandaz', 'burgz', 'dagaz', 'fardiz', 'friþuz', 'fulką',
			'gangaz', 'gaizaz', 'gardaz', 'gulþą', 'giftiz', 'gunþiz',
			'hailaz', 'harduz', 'harjaz', 'hildiz', 'hrōþiz',
			'mērijaz', 'rīks', 'sinþaz', 'segaz', 'stainaz', 'swinþaz',
			'waldą', 'winiz', 'wulfaz'],
	]
);

new Language('Proto-Iranian', [DITHEMATIC],
	// https://en.wiktionary.org/wiki/Category:Proto-Iranian_male_given_names
	[
		['bága', 'cyaHmá', 'haHtr̥', 'hhu'],
		['cráwah', 'daHtah', 'kah'],
	]
);

new Language('Proto-Slavic', [DITHEMATIC],
	// https://en.wiktionary.org/wiki/Category:Proto-Slavic_male_given_names
	[
		['bogъ', 'bojь', 'borni', 'bъdi', 'gosti', 'jaro', 'jьzę',
			'miro', 'mьsti', 'mojь', 'vęťe', 'voldi', 'žiro'],
		['danъ', 'gostь', 'měrъ', 'mirъ', 'slàvъ', 'vojь', 'vujь'],
	]
);

// finally
namegen.updateCount();