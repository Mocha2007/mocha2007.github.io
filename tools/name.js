/* exported name */
/* global log, random, sum, title */

function bars(n){
	const completion = Math.min(4, Math.floor(log(n, 6)));
	const icon_src = [
		'https://upload.wikimedia.org/wikipedia/commons/6/60/00_percent.svg',
		'https://upload.wikimedia.org/wikipedia/commons/c/ce/25_percent.svg',
		'https://upload.wikimedia.org/wikipedia/commons/e/eb/50_percent.svg',
		'https://upload.wikimedia.org/wikipedia/commons/6/62/75_percent.svg',
		'https://upload.wikimedia.org/wikipedia/commons/2/24/100_percent.svg',
	][completion];
	return `<img src="${icon_src}" style="height:4vh;" title="${n} possibilities">`;
}

class Language {
	constructor(name, forms, sets){
		this.name = name;
		/** @type {number[][][]} */
		this.forms = forms; // eg. array of [[0], [1, 2], [0, 1]]
		/** @type {string[][]} */
		this.sets = sets; // eg. [["eigh", "xton"], ["ash", "jo"]]
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
		const container = document.createElement('div');
		container.style.display = 'inline-block';
		// https://www.w3schools.com/tags/att_input_type_radio.asp
		const radio = document.createElement('input');
		radio.type = 'radio';
		radio.name = 'langs';
		radio.classList.add('langChoice');
		if (!Language.languages.length)
			radio.checked = 'checked';
		radio.id = `radio_${this.name}`;
		// label
		const label = document.createElement('label');
		label.innerHTML = `${this.name} ${bars(this.count || 1)}`;
		label.appendChild(radio);
		container.appendChild(label);
		return this.elem_ = container;
	}
	/** @returns {boolean} */
	get selected(){
		return document.getElementById(`radio_${this.name}`).checked;
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
	init(){
		// sort langs by name, then create list
		Language.languages.sort((a, b) => a.name < b.name ? -1 : b.name < a.name ? 1 : 0);
		Language.languages.forEach(l => l.addRadioButton());
		// finally
		namegen.updateCount();
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

// todo https://en.wiktionary.org/wiki/Category:Ancient_Greek_male_given_names

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

new Language('Verdurian', [[[0], [0, 1]]],
	// http://www.zompist.com/names.htm
	[
		['aď', 'al', 'an', 'andor', 'ban', 'belgo', 'benda', 'bes', 'bur',
			'calo', 'clai', 'com', 'cor', 'cör', 'cuma', 'dan', 'dašo', 'dën',
			'diči', 'dom', 'dorot', 'draco', 'ďal', 'ďom', 'efar', 'es', 'ele',
			'elir', 'elu', 'elure', 'er', 'esta', 'fale', 'fant', 'fi', 'fori',
			'fre', 'gar', 'gen', 'ges', 'glavo', 'glini', 'gröse', 'hum', 'ili',
			'inye', 'kai', 'kol', 'leti', 'lir', 'lon', 'mei', 'meli', 'mëra',
			'mura', 'nan', 'nařo', 'neže', 'nožu', 'nou', 'nusse', 'oh', 'op',
			'on', 'örn', 'pal', 'pe', 'pon', 'ric', 'ruže', 'řem', 'řezi',
			'sasna', 'sar', 'sea', 'sört', 'sul', 'šeli', 'tai', 'tel', 'tihi',
			'tuli', 'vaďra', 'veaďa', 'vuran', 'zer', 'zol', 'zon', 'zula',
			'žen', 'žina', 'žive', 'žorta', 'žuli', 'žosu'],
		['dul', 'eon', 'nes', 'om', 'orion', 'šec'],
	]
);

new Language('Ithkuil', [[[4], [0, 2], [3], [1, 2]]],
	// http://www.zompist.com/names.htm
	[
		[
			'acvil', // GREY
			'agpwal', // HAMMER
			'alḑaz', // FOREST
			'allwil', // BRIGHT
			'almaj', // MIGHT, STRENGTH
			'alxwal', // STAR
			'aļļtļil', // HEAVEN
			'ankral', // HOME
			'aržaj', // VENGEANCE
			'avplil', // LIGHTNING
			'ekšnal', // FLOWER
			'elzmřal', // ASH (tree)
			'emfaj', // HONOR
			'ežval', // GOOD (morally)
			'orkwaj', // LOVE
			'otglal', // SPEAR
			'ubyal', // WISE
			'ukskal', // FURY
			'ulppil', // HOARD
			'umšal', // BOLD
			'unšwal', // NOBLE
		],
		[
			'aggwal', // STONE
			'kçil', // BLADE
			'umflil', // SPOUSE
		],
		// either
		[
			'aljar', // GOLD
			'amtril', // HELMET
			'anstal', // RAVEN, ROOK
			'aňsdyal', // EAGLE
			'ařal', // DAY
			'asglar', // IRON
			'ažfel', // HEALTHY
			'ažxil', // FIRE
			'eltil', // RULER
			'elţmil', // GUEST
			'enil', // GIFT
			'eňtçaj', // COUNSEL
			'epxal', // BOAR
			'ernzil', // FRIEND
			'ezval', // WOLF
			'ujthaj', // WAR
			'urhil', // BEAR
			'uţkhal', // ARMY
		],
		['â-'],
		['hw'],
	]
);

// finally
namegen.init();