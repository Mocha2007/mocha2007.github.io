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
	// eslint-disable-next-line max-len
	return `<img src="${icon_src}" style="height:4vh;" title="${n.toLocaleString()} possibilities">`;
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
		if (Language.languages.findIndex(x => x === this) === 0)
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
		const lang = this.lang;
		if (lang){
			this.elem.count.innerHTML = this.lang.count.toLocaleString() + ' possible names';
		}
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

new Language('Muskian', [[[0], [2], [1], [2], [0], [2], [0], [3], [3]]],
	// X Æ A-X12
	// letter, weird letter, letter, hyphen, letter, digit, digit
	[
		'abcdefghijklmnopqrstuvwxyz'.split(''),
		'àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ'.split(''),
		['-', ' '],
		'0123456789'.split(''),
	]
);

new Language('&rsquo;Murican', [[[0], [0]]],
	[
		['beer', 'burger', 'eagle', 'flag', 'football', 'freedom', 'god', 'gun', 'jesus', 'liberty', 'patriot', 'pickup', 'rifle', 'shoot'],
	]
);

const DWARVEN = new Language('Dwarven', [[[1], [0], [2, 3, 4], [5]]],
	// (specific subset) + (N/Adj/V)(N)
	[
		[' '],
		['Aban', 'Adil', 'Alåth', 'Amost', 'Asmel', 'Asob', 'Ast', 'Astesh', 'Asën', 'Athel', 'Atír', 'Atîs', 'Avuz', 'Ber', 'Besmar', 'Bim', 'Bomrek', 'Bëmbul', 'Catten', 'Cerol', 'Cilob', 'Cog', 'Dakost', 'Dastot', 'Datan', 'Deduk', 'Degël', 'Deler', 'Dodók', 'Domas', 'Doren', 'Ducim', 'Dumat', 'Dumed', 'Dîshmab', 'Dôbar', 'Edzul', 'Edëm', 'Endok', 'Eral', 'Erib', 'Erush', 'Eshtân', 'Etur', 'Fath', 'Feb', 'Fikod', 'Geshud', 'Goden', 'Id', 'Iden', 'Ilral', 'Imush', 'Ineth', 'Ingish', 'Inod', 'Kadol', 'Kadôl', 'Kel', 'Kib', 'Kikrost', 'Kivish', 'Kogan', 'Kogsak', 'Kol', 'Kosoth', 'Kulet', 'Kumil', 'Kûbuk', 'Led', 'Libash', 'Likot', 'Limul', 'Litast', 'Logem', 'Lokum', 'Lolor', 'Lorbam', 'Lòr', 'Mafol', 'Mebzuth', 'Medtob', 'Melbil', 'Meng', 'Mestthos', 'Minkot', 'Mistêm', 'Moldath', 'Momuz', 'Monom', 'Mosus', 'Mörul', 'Mûthkat', 'Nil', 'Nish', 'Nomal', 'Obok', 'Oddom', 'Olin', 'Olon', 'Onget', 'Onol', 'Rakust', 'Ral', 'Reg', 'Rigòth', 'Rimtar', 'Rith', 'Rovod', 'Rîsen', 'Sarvesh', 'Sazir', 'Shem', 'Shorast', 'Sibrek', 'Sigun', 'Sodel', 'Solon', 'Stinthäd', 'Stodir', 'Stukos', 'Stâkud', 'Såkzul', 'Tekkud', 'Thob', 'Tholtig', 'Thîkut', 'Tirist', 'Tobul', 'Tosid', 'Tulon', 'Tun', 'Ubbul', 'Udib', 'Udil', 'Unib', 'Urdim', 'Urist', 'Urvad', 'Ushat', 'Ustuth', 'Uvash', 'Uzol', 'Vabôk', 'Vucar', 'Vutok', 'Zan', 'Zaneg', 'Zas', 'Zasit', 'Zefon', 'Zon', 'Zuglar', 'Zulban', 'Zuntîr', 'Zutthan', 'Äs', 'Åblel', 'Èrith', 'Èzum', 'Îton', 'Ïngiz', 'Ïteb', 'Ònul', 'Ùshrir'],
		['Med', 'Kulet', 'Ngalák', 'Kuthdêng', 'Alak', 'Agseth', 'Bidok', 'Nikot', 'Ìlud', 'Nebél', 'Salir', 'Kulbet', 'Cenäth', 'Lândar', 'Thokit', 'Anam', 'Zafal', 'Anzish', 'Mabdug', 'Uzan', 'Boshut', 'Astel', 'Edos', 'Thukkan', 'Umgan', 'Alron', 'Ïdath', 'Zustash', 'Sedil', 'Ustos', 'Roldeth', 'Emär', 'Otsus', 'Zuntîr', 'Izeg', 'Lebes', 'Tömud', 'Asrer', 'Bemòng', 'Útost', 'Rovod', 'Uvash', 'Öntak', 'Tosid', 'Kumil', 'Feb', 'Zan', 'Berim', 'Ibruk', 'Arist', 'Fidgam', 'Rashgur', 'Endok', 'Ermis', 'Thoth', 'Ardes', 'Tobot', 'Shigin', 'Thatthil', 'Moldath', 'Libash', 'Åm', 'Lakish', 'Geshak', 'Nel', 'Neth', 'Roder', 'Biban', 'Konad', 'Emäth', 'Ägash', 'Ugog', 'Gérig', 'Zulban', 'Ish', 'Robek', 'Stingbol', 'Bashnom', 'Tholtig', 'Ushat', 'Enseb', 'Odom', 'Bërûl', 'Olmul', 'Nokzam', 'Mìshos', 'Emuth', 'Nangês', 'Uvel', 'Durad', 'Fer', 'Kinem', 'Zust', 'Agêk', 'Ucat', 'Ngárak', 'Ritan', 'Enir', 'Ugath', 'Rith', 'Tòm', 'Îmäz', 'Mat', 'Lisig', 'Oshnïl', 'Zutshosh', 'Erong', 'Osed', 'Lanlar', 'Nóton', 'Nitig', 'Räduk', 'Udir', 'Tarmid', 'Nulom', 'Lål', 'Sákrith', 'Sharsid', 'Nural', 'Bugsud', 'Zolak', 'Okag', 'Kastar', 'Medtob', 'Nazush', 'Nashon', 'Âtrid', 'Kod', 'Stektob', 'Enôr', 'Umer', 'Dùstik', 'Asob', 'Kogan', 'Ingish', 'Torad', 'Dudgoth', 'Stalkòb', 'Murak', 'Alåth', 'Osod', 'Thîkut', 'Cog', 'Edod', 'Shomad', 'Gothum', 'Etur', 'Egdoth', 'Gúr', 'Rodum', 'Arust', 'Ärged', 'Nakuth', 'Idek', 'Zes', 'Konos', 'Âtast', 'Ùst', 'Ím', 'Okab', 'Onlìl', 'Gasol', 'Suthmam', 'Tegir', 'Namàsh', 'Noval', 'Sazir', 'Shalig', 'Bogsosh', 'Shin', 'Äkim', 'Kâkdal', 'Lek', 'Kilrud', 'Alud', 'Olom', 'Nosing', 'Tîrdug', 'Ëlot', 'Rozsed', 'Enshal', 'Rintor', 'Egeb', 'Rithzâm', 'Thos', 'Shadust', 'Shèrel', 'Okon', 'Nïng', 'Ostar', 'Rorul', 'Kovath', 'Girtol', 'Åblel', 'Stal', 'Kitïg', 'Lokast', 'Reked', 'Comníth', 'Sidos', 'Setnek', 'Kithìn', 'Nug', 'Mokez', 'Cös', 'Rorash', 'Idos', 'Zimun', 'Betan', 'Ogîk', 'Utheg', 'Tílgil', 'Ebsas', 'Lurak', 'Tobul', 'Ilush', 'Sheced', 'Dënush', 'Rimtar', 'Kun', 'Åkum', 'Lòråm', 'Äs', 'Kor', 'Götom', 'Ïngiz', 'Fazís', 'Kiror', 'Ós', 'Nicat', 'Mafol', 'Akur', 'Tenshed', 'Catten', 'Onshen', 'Rërith', 'Rosat', 'Athser', 'Thomal', 'Ìtdùn', 'Takùth', 'Musöd', 'Shokmug', 'Gingik', 'Tilat', 'Îtat', 'Egot', 'Rangab', 'Bor', 'Arek', 'Sudir', 'Kontuth', 'Oshur', 'Assar', 'Mestthos', 'Ineth', 'Odshith', 'Thedak', 'Merig', 'Lisid', 'Dodók', 'Sinsot', 'Dostob', 'Gast', 'Darùd', 'Lir', 'Akgos', 'Romlam', 'Darål', 'Ân', 'Oddom', 'Zägel', 'Lun', 'Zatam', 'Og', 'Shatag', 'Sholid', 'Om', 'Rîsen', 'Ranzar', 'Teling', 'Letmos', 'Gisëk', 'Balad', 'Rafum', 'Nekik', 'Dakas', 'Muthir', 'Zoluth', 'Artob', 'Resíl', 'Dolek', 'Ruken', 'Kâtad', 'Karas', 'Âgoth', 'Ádol', 'Mulåsh', 'Onesh', 'Thikén', 'Kacoth', 'Thestkig', 'Gemesh', 'Shadmal', 'Kastaz', 'Ullung', 'Kezkíg', 'Sog', 'Nucam', 'Aban', 'Etost', 'Gishgil', 'Ágesh', 'Linòn', 'Mingtuth', 'Shizek', 'Egul', 'Tesum', 'Letom', 'Kanzud', 'Rafar', 'Etnàr', 'Gusil', 'Minkot', 'Shusug', 'Kordam', 'Îgbit', 'Îkeng', 'Össek', 'Amkol', 'Dan', 'Samam', 'Tustem', 'Zocol', 'Laltur', 'Ozsit', 'Obot', 'Arban', 'Rigòth', 'Sulus', 'Uling', 'Dîbesh', 'Berath', 'Dôbar', 'Mes', 'Farash', 'Zangin', 'Shadkik', 'Innok', 'Orshet', 'Vukcas', 'Zim', 'Nunùr', 'Ginet', 'Îstlig', 'Metul', 'Ustir', 'Thad', 'Torish', 'Memrut', 'Luror', 'Angrir', 'Kifed', 'Momuz', 'Zas', 'Astesh', 'Avum', 'Ngotûn', 'Ôfid', 'Kesham', 'Amem', 'Mothram', 'Ishash', 'Rít', 'Tholest', 'Nolthag', 'Gikut', 'Urist', 'Isos', 'Matul', 'Kezat', 'Unul', 'Umom', 'Dëm', 'Lodel', 'Ag', 'Kodor', 'Alod', 'Nökor', 'Ukosh', 'Råsh', 'Ursas', 'Vakun', 'Ethad', 'Ros', 'Inir', 'Thol', 'Kizbiz', 'Alûth', 'Nadak', 'Nirmek', 'Ûlmush', 'Arbost', 'Mishar', 'Amith', 'Ocîg', 'Uthgúr', 'Lensham', 'Miroth', 'Geb', 'Ozon', 'Ngegdol', 'Amas', 'Zareth', 'Nurom', 'Ônor', 'Tislam', 'Nam', 'Gar', 'Terstum', 'Sîbosh', 'Manthul', 'Zagith', 'Noshtath', 'Doren', 'Zengod', 'Imush', 'Kar', 'Lunrud', 'Storlut', 'Ùk', 'Bekar', 'Ôtthat', 'Gethor', 'Amur', 'Ozleb', 'Thazor', 'Gorroth', 'Vashzud', 'Shungmag', 'Gan', 'Assog', 'Olum', 'Ruthösh', 'Tastrod', 'Ashzos', 'Enten', 'Gingim', 'Minran', 'Shoduk', 'Nomes', 'Birir', 'Enas', 'Idar', 'Róth', 'Rodnul', 'Akest', 'Thun', 'Nuggad', 'Okbod', 'Tun', 'Sacat', 'Gomóm', 'Måmgoz', 'Fak', 'Ogon', 'Zêvut', 'Nåzom', 'Rëmrit', 'Stidest', 'Zag', 'Thosbut', 'Ór', 'Kosak', 'Sub', 'Shegum', 'Shuk', 'Óboth', 'Talin', 'Åmmeb', 'Sakub', 'Astis', 'Tig', 'Edir', 'Tath', 'Vesh', 'Etest', 'Kokeb', 'Siknug', 'Atír', 'Lorsïth', 'Rir', 'Ber', 'Deb', 'Sárek', 'Èshgor', 'Rùkal', 'Acöb', 'Mogshum', 'Okir', 'Todör', 'Kastol', 'Kurol', 'Sedur', 'Thalal', 'Kisat', 'Minbaz', 'Zethruk', 'Lushôn', 'Nakas', 'Stistmig', 'Arngish', 'Kemsor', 'Sefol', 'Sharast', 'Tinöth', 'Okin', 'Maskir', 'Othör', 'Ninur', 'Ostath', 'Râmol', 'Esäst', 'Dèg', 'Gedor', 'Egståk', 'Ngilok', 'Thasdoth', 'Zamnuth', 'Ramtak', 'Sombith', 'Onrel', 'Ruzos', 'Ker', 'Lînem', 'Uzlir', 'Ungèg', 'Isul', 'Tabar', 'Umid', 'Seth', 'Belal', 'Shan', 'Sogdol', 'Lemlor', 'Shis', 'Ivom', 'Er', 'Tarem', 'Urem', 'Ston', 'Nist', 'Ódad', 'Ked', 'Urus', 'Riril', 'Ustuth', 'Odkish', 'Nidòst', 'Roduk', 'Korsid', 'Dotir', 'Fikuk', 'Zotir', 'Zikel', 'Bardum', 'Vutok', 'Zikâth', 'Stagshil', 'Atöl', 'Ók', 'Ziril', 'Tatlosh', 'Ngitkar', 'Rerras', 'Dur', 'Solon', 'Keshan', 'Ned', 'Thabost', 'Asiz', 'Engig', 'Gonggash', 'Eststek', 'Astan', 'Ar', 'Nëlas', 'Vuthil', 'Tetist', 'Låluth', 'Dakost', 'Totmon', 'Omet', 'Bem', 'Fenglel', 'Gigin', 'Atham', 'Amug', 'Ost', 'Cabnul', 'Nog', 'Atul', 'Fotthor', 'Nalish', 'Ìltang', 'Dumed', 'Geshud', 'Osram', 'Akam', 'Zefon', 'Ézneth', 'Shosêl', 'Tiklom', 'Rabed', 'Eshim', 'Lumash', 'Babin', 'Shasar', 'Ishol', 'Thîdas', 'Enog', 'Nisgak', 'Gulgun', 'Dozeb', 'Baros', 'Muz', 'Âst', 'Sarvesh', 'Thusest', 'Zalud', 'Vutram', 'Dushig', 'Sholèb', 'Degël', 'Sïsal', 'Bakat', 'Insél', 'Goral', 'Kèbmak', 'Inod', 'List', 'Olon', 'Kadôl', 'Gärem', 'Kast', 'Ërtong', 'Ngotol', 'Kolad', 'Egen', 'Rúbal', 'Thob', 'Gintar', 'Saruth', 'Usir', 'Amkin', 'Atzul', 'Figul', 'Fikod', 'Almôsh', 'Àlil', 'Bebmal', 'Kåtdir', 'Eser', 'Vumshar', 'Anil', 'Igest', 'Reg', 'Rab', 'Ngobol', 'Ubur', 'Desgir', 'Kat', 'Belbez', 'Nòm', 'Limul', 'Igang', 'Eshon', 'Kurig', 'Dedros', 'Erib', 'Mas', 'Lolok', 'Mashus', 'Gídthur', 'Isin', 'Mondûl', 'Asën', 'Bel', 'Siz', 'Saràm', 'Dal', 'Omer', 'Nothis', 'Sumun', 'Zágod', 'Mithmis', 'Enol', 'Edtûl', 'Uzar', 'Tomêm', 'Munèst', 'Bol', 'Ûz', 'Bål', 'Sitheb', 'Duthnur', 'Domas', 'Ilbåd', 'Lushût', 'Rurast', 'Astod', 'Thabum', 'Nolêth', 'Eggut', 'Suton', 'Nuglush', 'Óruk', 'Ulthush', 'Râluk', 'Razes', 'Îton', 'Èzum', 'Nil', 'Ùnil', 'Otad', 'Erush', 'Ifin', 'Thetdel', 'Thir', 'Gethust', 'Golud', 'Ûd', 'Kadol', 'Lur', 'Vath', 'Dumur', 'Aknûn', 'Otel', 'Mis', 'Ser', 'Ikal', 'Ilon', 'Zanor', 'Ur', 'Vúsh', 'Bokbon', 'Dasël', 'Danman', 'Èfim', 'Dok', 'Shash', 'Zon', 'Usen', 'Oshosh', 'Obur', 'Banik', 'Sebïr', 'Inen', 'Åmât', 'Tarag', 'Kegeth', 'Oggez', 'Ugosh', 'Kiron', 'Ríbar', 'Bom', 'Gadan', 'Stetár', 'Dural', 'Sikel', 'Unnos', 'Kisul', 'Ikus', 'Zanos', 'Sheget', 'Kozoth', 'Famthut', 'Rorung', 'Nal', 'Zoden', 'Imbit', 'Idor', 'Enur', 'Vir', 'Kàlreth', 'Alek', 'Fokásh', 'Tharith', 'Tazuk', 'Ushil', 'Gumùr', 'Ular', 'Anist', 'Nizdast', 'Enen', 'Gireth', 'Ngithol', 'Kudar', 'Azoth', 'Ushesh', 'Sharul', 'Goshîst', 'Âzkob', 'Meb', 'Dalem', 'Òrdir', 'Thêmnol', 'Luskal', 'Sedish', 'Avûsh', 'Duthtish', 'Immast', 'Likot', 'Stëtnin', 'Etóm', 'Zarut', 'Lased', 'Lûk', 'Rinul', 'Izkil', 'Datan', 'Gulnas', 'Tabmik', 'Sosad', 'Rinal', 'Ebgok', 'Soshosh', 'Otil', 'Teskom', 'Fastam', 'Bukshon', 'Stîgil', 'Lumen', 'Istrath', 'Maton', 'Ilir', 'Zatthud', 'Abol', 'Cim', 'Mâtzang', 'Egath', 'Imketh', 'Zuden', 'Emtan', 'Edëm', 'Vagúsh', 'Ellest', 'Stizash', 'Nosîm', 'Etar', 'Osor', 'Alis', 'Zasit', 'Arzes', 'Oth', 'Musar', 'Misttar', 'Èrith', 'Lumnum', 'Vakist', 'Ner', 'Nebïn', 'Ralâth', 'Kûbuk', 'Kivish', 'Nïr', 'Talul', 'Udil', 'Bul', 'Ìddor', 'Onam', 'Meng', 'Toral', 'Omoth', 'Erar', 'Govos', 'Ilash', 'Orab', 'Tagùz', 'Turel', 'Subol', 'Gomath', 'Uleb', 'Cerol', 'Mingkil', 'Detthost', 'Rerik', 'Rimís', 'Kashez', 'Lolor', 'Omtäl', 'Eren', 'Koshosh', 'Os', 'Thunen', 'Istam', 'Giken', 'Náshas', 'Od', 'Rômab', 'Vel', 'Kurel', 'Mengmad', 'Bungek', 'Thistus', 'Zedot', 'Thak', 'Dolil', 'Romek', 'Utir', 'Ïlul', 'Sosmil', 'Aval', 'Evon', 'Lushòb', 'Damèl', 'Ekir', 'Merseth', 'Uvar', 'Asin', 'Vunom', 'Lektad', 'Nethgön', 'Suvas', 'Itur', 'Ertal', 'Avan', 'Stâkud', 'Mingus', 'Aroth', 'Lårul', 'Ezost', 'Sutung', 'Udos', 'Imust', 'Deduk', 'Mûthkat', 'Urir', 'Lised', 'Rilbet', 'Rinmol', 'Muzish', 'Kôn', 'Athnîr', 'Dalzat', 'Tad', 'Stul', 'Ôsed', 'Thash', 'Kenis', 'Fathkal', 'Inob', 'Ûbom', 'Fashuk', 'Igril', 'Bëmbul', 'Zalstom', 'An', 'Lar', 'Gidur', 'Nalthish', 'Asmel', 'Zithis', 'Ostësh', 'Milol', 'Kel', 'Kesting', 'Eddaz', 'Ekur', 'Shar', 'Ottan', 'Avuz', 'Shagul', 'Sebshos', 'Ònul', 'Lêgan', 'Cemosh', 'Egeth', 'Sôd', 'Dusak', 'Odgúb', 'Èrnam', 'Idash', 'Ovus', 'Gomòk', 'Othduk', 'Thulom', 'Odês', 'Fevil', 'Evud', 'Vankåb', 'Ushang', 'Ïlon', 'Ushlub', 'Tumam', 'Othud', 'Ogtum', 'Sanád', 'Midil', 'Tunom', 'Tadar', 'Osresh', 'Daros', 'Alen', 'Bobrur', 'Onol', 'Stoling', 'Dum', 'Zagstok', 'Godum', 'Ol', 'Gatis', 'Udler', 'Usân', 'Bothon', 'Thum', 'Kavud', 'Kirun', 'Shasad', 'Shoveth', 'Lathon', 'Limúr', 'Um', 'Kab', 'Solam', 'Egom', 'Kêdnath', 'Kez', 'Ikûl', 'Kib', 'Rotik', 'Ital', 'Necak', 'Stosêth', 'Anan', 'Disuth', 'Rîthol', 'Zaled', 'Tezul', 'Otam', 'Lisat', 'Katthir', 'Nunok', 'Ishlum', 'Kin', 'Mebzuth', 'Usib', 'Nothok', 'Nar', 'Thokdeg', 'Azmol', 'Dolok', 'Migrur', 'Kebon', 'Uzol', 'Losush', 'Dakon', 'Lod', 'Anön', 'Mothdast', 'Muved', 'Som', 'Mostib', 'Vabôk', 'Lotol', 'Shed', 'Inash', 'Stegëth', 'Zar', 'Ritas', 'Sanreb', 'Mïkstal', 'Udril', 'Shigós', 'Dáthnes', 'Iden', 'Mörul', 'Zulash', 'Logem', 'Kosoth', 'Abal', 'Kogsak', 'Kulin', 'Gatin', 'Tetthush', 'Ul', 'Monom', 'Dugal', 'Thimshur', 'Étol', 'Custith', 'Ishen', 'Geth', 'Gemsit', 'Nimar', 'Lîlar', 'Bisól', 'Ginok', 'Ilrom', 'Madush', 'Kovest', 'Ib', 'Thet', 'Rodem', 'Rumred', 'Ator', 'Shithath', 'Thethrus', 'Ìrlom', 'Eges', 'Fimshel', 'Bab', 'Rithul', 'Zimesh', 'Ugeth', 'Sokan', 'Tekkud', 'Thuveg', 'Obok', 'Rusest', 'Umril', 'Al', 'Gor', 'Damol', 'Elcur', 'Zimkel', 'Mamot', 'Ison', 'Sil', 'Nitom', 'Shem', 'Erok', 'Tok', 'Kugik', 'Stisträs', 'Titthal', 'Udist', 'Îm', 'Kagmel', 'Tathtat', 'Rèt', 'Komut', 'Olnen', 'Dimshas', 'Äkil', 'Inrus', 'Ïtsas', 'Deleth', 'Agsal', 'Mistêm', 'Niral', 'Ïteb', 'Tezad', 'Midor', 'Mubun', 'Lâven', 'Libad', 'Nilgin', 'Merir', 'Udiz', 'Gemur', 'Teshkad', 'Nikuz', 'Kamuk', 'Kudust', 'Sastres', 'Kethil', 'Räm', 'Batôk', 'Vildang', 'Gashcoz', 'Arkoth', 'Lashëd', 'Kasith', 'Ngathsesh', 'Besmar', 'Furgig', 'Elbost', 'Nônub', 'Fongbez', 'Ceshfot', 'Enam', 'Thetust', 'Megob', 'Uvir', 'Luslem', 'Ùshrir', 'Zukthist', 'Esrel', 'Iseth', 'Bukèt', 'Esar', 'Kàs', 'Nimak', 'Lestus', 'Fullut', 'Arkim', 'Imsal', 'Led', 'Atêsh', 'Unib', 'Ron', 'Udar', 'Detes', 'Umoz', 'Dîshmab', 'Zokgen', 'Asàs', 'Razot', 'Stigaz', 'Atem', 'Ezuk', 'Vozbel', 'Toltot', 'När', 'Edim', 'Stukos', 'Ushul', 'Ograd', 'Orstist', 'Kukon', 'Ang', 'Ikud', 'Memad', 'Sobìr', 'Zaneg', 'Noram', 'Elbel', 'Ennol', 'Inem', 'Rirnöl', 'Stemel', 'Zìzcun', 'Ebal', 'Akir', 'Nanir', 'Irid', 'Nokgol', 'Emgash', 'Vukrig', 'Kìrar', 'Inush', 'Tirist', 'Athel', 'Osdin', 'Ethram', 'Kamut', 'Neshast', 'Selor', 'Igër', 'Tulon', 'Orrun', 'Sûbil', 'Id', 'Astås', 'Âbir', 'Cilob', 'Mosus', 'Odur', 'Lulâr', 'Goden', 'Istbar', 'Zodost', 'Dumat', 'Mözir', 'Notlith', 'Ilid', 'Tithleth', 'Kezar', 'Bocash', 'Ast', 'Fath', 'Etom', 'Mukar', 'Ekast', 'Ushdish', 'Tölún', 'Nabid', 'Belar', 'Sibrek', 'Rovol', 'Ottem', 'Cuggán', 'Sosh', 'Thining', 'Gasìs', 'Vathem', 'Noglesh', 'Aroz', 'Vumom', 'Tâmol', 'Nanul', 'Kåtâk', 'Etvuth', 'Urrïth', 'Rokel', 'Mishthem', 'Gudas', 'Tokthat', 'Askak', 'Abshoth', 'Gasir', 'Igath', 'Kes', 'Ubas', 'Tathur', 'Givel', 'Aran', 'Angish', 'Allas', 'Gembish', 'Urvad', 'Fel', 'Absam', 'Ingul', 'Nekut', 'Evost', 'Genlath', 'Shulmik', 'Lenod', 'Abras', 'Asol', 'Emal', 'Shethel', 'Urnût', 'Zursul', 'Borlon', 'Othsal', 'Oshgât', 'Ashmôn', 'Shedim', 'Arak', 'Mostod', 'Tizöt', 'Taran', 'Otik', 'Kerlîg', 'Lêned', 'Sodel', 'Langgud', 'Doshet', 'Zuglar', 'Otung', 'Stibmer', 'Tomus', 'Dugan', 'Nåst', 'Mesir', 'Uvóth', 'Mîvid', 'Okun', 'Kafâsh', 'Ngumrash', 'Adek', 'Zokun', 'Eshom', 'Nesteth', 'Thebil', 'Ammesh', 'Ral', 'Guz', 'Reksas', 'Gesis', 'Osal', 'Anir', 'Gecast', 'Salul', 'Nabreth', 'Nekol', 'Rungak', 'Anriz', 'Kosh', 'Noth', 'Tharnas', 'Saneb', 'Bàgoz', 'Bim', 'Sakil', 'Rasuk', 'Lirér', 'Gäzot', 'Ukath', 'Tozör', 'Duz', 'Kal', 'Eshtân', 'Mezum', 'Umar', 'Geles', 'Nasod', 'Therleth', 'Desis', 'Tinan', 'Zekrim', 'Uben', 'Rethal', 'Sesh', 'Adur', 'Ezar', 'Bonun', 'Litez', 'Olthez', 'Egur', 'Unol', 'Vod', 'Zunek', 'Îbmat', 'Kebul', 'Debish', 'Bushos', 'Âm', 'Kutam', 'Lokum', 'Kik', 'Mïshak', 'Thortith', 'Omât', 'Sethal', 'Thocit', 'Lûrit', 'Tishis', 'Datur', 'Ubal', 'Òstob', 'Zakgol', 'Lashid', 'Rulush', 'Usur', 'Adbok', 'Kob', 'Aned', 'Tangak', 'Bâsen', 'Kigok', 'Bekom', 'Noböt', 'Guthstak', 'Estrith', 'Vathsith', 'Gongith', 'Nulral', 'Nomal', 'Atîs', 'Oltud', 'Savot', 'Lorbam', 'Vîr', 'Kot', 'Shìstsak', 'Shagog', 'Keng', 'Dustîk', 'Deler', 'Aztong', 'Dasnast', 'Sholil', 'Ûlosh', 'Kikrost', 'Gusgash', 'Lam', 'Tôsed', 'Togal', 'Mot', 'Rakas', 'Vuknud', 'Nîles', 'Arceth', 'Atith', 'Rêg', 'Meban', 'Emen', 'Stin', 'Abod', 'Birut', 'Sat', 'Shùrrat', 'Timad', 'Tunur', 'Idgag', 'Ozor', 'Eb', 'Omshit', 'Ibes', 'Moshnún', 'Conngim', 'Kobel', 'Ad', 'Nis', 'Stot', 'Mozib', 'Ögred', 'Sined', 'Tecàk', 'Obash', 'Dastot', 'Shazak', 'Udib', 'Idith', 'Rimad', 'Kesh', 'Enkos', 'Kidet', 'Lerteth', 'Ob', 'Vetek', 'Thilség', 'Zeg', 'Stettad', 'Amal', 'Vim', 'Akmesh', 'Rath', 'Mor', 'Becor', 'Vudnis', 'Ittás', 'Itêg', 'Angzak', 'Okil', 'Stinthäd', 'Gakit', 'Tårem', 'Rëcus', 'Kurik', 'Unkíl', 'Gelut', 'Kabat', 'Erith', 'Kalur', 'Arros', 'Amud', 'Nobgost', 'Tan', 'Lïd', 'Bot', 'Ashok', 'Akrul', 'Sheshek', 'Kan', 'Nod', 'Zasgim', 'Nin', 'Rakust', 'Melbil', 'Bal', 'Olin', 'Nol', 'Lòr', 'Raz', 'Tolis', 'Litast', 'Dostust', 'Shotom', 'Mugshith', 'Tat', 'Sigun', 'Mëlist', 'Urdim', 'Amost', 'Nish', 'Mosos', 'Kälán', 'Rìthar', 'Shelret', 'Ïggal', 'Rëdreg', 'Ushal', 'Idräth', 'Zutthan', 'Datlad', 'Ilral', 'Dák', 'Borik', 'Stëlmith', 'Nirkún', 'Bithsêst', 'Meden', 'Amnek', 'Vafig', 'Tízen', 'Bobet', 'Dizesh', 'Êsik', 'Kobem', 'Oshéb', 'Såkzul', 'Tilesh', 'Gamil', 'Atol', 'Buris', 'Ecem', 'Kasben', 'Shilràr', 'Bugud', 'Messog', 'Kekath', 'Ód', 'Bukith', 'Onget', 'Bufut', 'Buzat', 'Ingtak', 'Damor', 'Shetbêth', 'Gim', 'Tishak', 'Eknar', 'Mengib', 'Gósmer', 'Itnet', 'Mer', 'Kôkdath', 'Semor', 'Thur', 'Bakust', 'Vucar', 'Gutid', 'Sebsúr', 'Olil', 'Tudrug', 'Oshot', 'Ubbul', 'Sêgam', 'Nozush', 'Bisek', 'Mirstal', 'Lanzil', 'Zamoth', 'Bomik', 'Tögum', 'Eral', 'Edzul', 'Sizir', 'Nukad', 'Okosh', 'Munsog', 'Oklit', 'Lemis', 'Razmer', 'Liruk', 'Zenon', 'Vathez', 'Furàt', 'Îcum', 'Tost', 'Nitem', 'Vanel', 'Okol', 'Torir', 'Stodir', 'Ôggon', 'Detgash', 'Tikis', 'Dogik', 'Unos', 'Berdan', 'Adil', 'Legon', 'Lelum', 'Alnis', 'Zalìs', 'Sirab', 'Nisûn', 'Ïkor', 'Omtug', 'Tathtak', 'Lidod', 'Azin', 'Isden', 'Arel', 'Uker', 'Kussad', 'Rithlut', 'Deg', 'Othil', 'Limâr', 'Bamgûs', 'Nugreth', 'Edól', 'Adril', 'Orshar', 'Koshmot', 'Sostet', 'Âl', 'Umgush', 'Kil', 'Kol', 'Ken', 'Bomrek', 'Rikkir', 'Atil', 'Iklist', 'Volal', 'Lish', 'Omrist', 'Ud', 'Othôs', 'Num', 'Otin', 'Fesh', 'Lakàl', 'Akath', 'Shorast', 'Dosîm', 'Nabår', 'Lim', 'Damîd', 'Aral', 'Anur', 'Lolum', 'Il', 'Ducim', 'Cubor', 'Oram', 'Vesrul', 'Bumal', 'Soloz', 'Artum', 'Duthal', 'Shoshin', 'Urosh', 'Akith', 'Stanïr', 'Lêrush', 'Ethír', 'Åm', 'Îd', 'Budam', 'Taron', 'Inol', 'Okang', 'Rilem', 'Kizest', 'Kebösh', 'Ibel', 'Shesam'],
		['Med', 'Ilas', 'Sosas', 'Ngalák', 'Kuthdêng', 'Alak', 'Agseth', 'Tatek', 'Nebél', 'Salir', 'Cenäth', 'Thokit', 'Gatal', 'Anzish', 'Astel', 'Edos', 'Thukkan', 'Umgan', 'Alron', 'Ïdath', 'Zustash', 'Sedil', 'Ustos', 'Roldeth', 'Ungòb', 'Útost', 'Kíddir', 'Tosid', 'Berim', 'Ibruk', 'Mangròd', 'Arist', 'Sanus', 'Shigin', 'Thatthil', 'Gòstang', 'Kithäl', 'Asdos', 'Neth', 'Roder', 'Emäth', 'Bashnom', 'Tholtig', 'Enseb', 'Durad', 'Kinem', 'Theb', 'Arom', 'Îmäz', 'Mat', 'Zutshosh', 'Nonshut', 'Etäg', 'Nóton', 'Räduk', 'Udir', 'Ustan', 'Lål', 'Sharsid', 'Nural', 'Okag', 'Medtob', 'Nashon', 'Kod', 'Etes', 'Enôr', 'Unâl', 'Murak', 'Edod', 'Ärged', 'Nakuth', 'Zes', 'Midrim', 'Konos', 'Âtast', 'Urthaz', 'Shalig', 'Shin', 'Äkim', 'Kilrud', 'Neb', 'Nosing', 'Tîrdug', 'Itred', 'Gubel', 'Kitïg', 'Reked', 'Rorash', 'Betan', 'Luthoz', 'Thastith', 'Sheced', 'Kor', 'Fazís', 'Ós', 'Remang', 'Athser', 'Ngusham', 'Musöd', 'Debben', 'Gingik', 'Rangab', 'Bor', 'Kontuth', 'Oshur', 'Assar', 'Lecad', 'Es', 'Lir', 'Urol', 'Lun', 'Teling', 'Letmos', 'Rafum', 'Nekik', 'Mekur', 'Artob', 'Resíl', 'Ultèr', 'Âgoth', 'Ádol', 'Thikén', 'Kacoth', 'Shadmal', 'Kezkíg', 'Nucam', 'Aban', 'Etost', 'Gishgil', 'Ágesh', 'Mingtuth', 'Letom', 'Etnàr', 'Gusil', 'Shusug', 'Samam', 'Tustem', 'Obot', 'Arban', 'Sulus', 'Uling', 'Dîbesh', 'Berath', 'Dôbar', 'Innok', 'Orshet', 'Zim', 'Ginet', 'Thestar', 'Gesul', 'Thad', 'Luror', 'Zas', 'Nakis', 'Kesham', 'Amem', 'Nguteg', 'Gikut', 'Kezat', 'Unul', 'Umom', 'Nökor', 'Asen', 'Ethad', 'Sestan', 'Inir', 'Thol', 'Alûth', 'Nadak', 'Nirmek', 'Ûlmush', 'Arbost', 'Amith', 'Geb', 'Ozon', 'Nam', 'Sîbosh', 'Manthul', 'Sholkik', 'Doren', 'Zengod', 'Arösh', 'Lunrud', 'Storlut', 'Bekar', 'Gorroth', 'Shungmag', 'Vetor', 'Assog', 'Nobang', 'Olum', 'Ruthösh', 'Tastrod', 'Ashzos', 'Nabas', 'Rodnul', 'Akest', 'Okbod', 'Gomóm', 'Rem', 'Bibar', 'Zêvut', 'Nåzom', 'Thikthog', 'Shuk', 'Rumad', 'Etest', 'Ôler', 'Ed', 'Ber', 'Em', 'Utal', 'Rùkal', 'Okir', 'Todör', 'Kastol', 'Kurol', 'Sedur', 'Kisat', 'Minbaz', 'Nakas', 'Stistmig', 'Desor', 'Sharast', 'Tinöth', 'Maskir', 'Othör', 'Ninur', 'Ostath', 'Zilir', 'Râmol', 'Esäst', 'Dèg', 'Ïssun', 'Ilus', 'Gedor', 'Egståk', 'Thasdoth', 'Zamnuth', 'Sankest', 'Uzlir', 'Öndin', 'Ungèg', 'Losis', 'Angen', 'Anûz', 'Tabar', 'Seth', 'Belal', 'Shan', 'Lemlor', 'Er', 'Odroz', 'Tarem', 'Ked', 'Igrish', 'Ustuth', 'Ekzong', 'Nidòst', 'Korsid', 'Lithrush', 'Dotir', 'Zikel', 'Ziril', 'Uthar', 'Engig', 'Gonggash', 'Astan', 'Ar', 'Nëlas', 'Rersîr', 'Tetist', 'Totmon', 'Amug', 'Ost', 'Gatiz', 'Cabnul', 'Gïsstir', 'Akam', 'Inglaz', 'Shosêl', 'Eshim', 'Emet', 'Babin', 'Shasar', 'Ishol', 'Thîdas', 'Nisgak', 'Gulgun', 'Dozeb', 'Sunggor', 'Esmul', 'Thusest', 'Zalud', 'Shistat', 'Zisur', 'Olon', 'Oltar', 'Gintar', 'Saruth', 'Usir', 'Amkin', 'Àlil', 'Eser', 'Vumshar', 'Anil', 'Reg', 'Rab', 'Ngobol', 'Löbor', 'Nòm', 'Bunsoth', 'Limul', 'Thistun', 'Eshon', 'Dedros', 'Zugob', 'Lolok', 'Gídthur', 'Bel', 'Saràm', 'Riras', 'Töras', 'Omer', 'Nothis', 'Usith', 'Mithmis', 'Enol', 'Edtûl', 'Thólthod', 'Lushût', 'Óruk', 'Bistök', 'Vosut', 'Oddet', 'Ifin', 'Thir', 'Gethust', 'Lur', 'Mis', 'Ikal', 'Vúsh', 'Dasël', 'Danman', 'Köshdes', 'Shash', 'Zon', 'Usen', 'Oshosh', 'Obur', 'Lirlez', 'Erlin', 'Goster', 'Kegeth', 'Ugosh', 'Kiron', 'Nakbab', 'Gadan', 'Dural', 'Zanos', 'Vir', 'Kàlreth', 'Alek', 'Fokásh', 'Ushil', 'Gumùr', 'Anist', 'Mimkot', 'Nizdast', 'Enen', 'Osstam', 'Kudar', 'Thalal', 'Kadän', 'Ushesh', 'Goshîst', 'Dalem', 'Òrdir', 'Mengthul', 'Thêmnol', 'Mishim', 'Tellist', 'Sedish', 'Avûsh', 'Gemis', 'Êr', 'Immast', 'Likot', 'Etóm', 'Ethzuth', 'Lûk', 'Rinul', 'Izkil', 'Nelzur', 'Sosad', 'Otil', 'Bukshon', 'Istrath', 'Ilir', 'Imketh', 'Stizash', 'Nosîm', 'Musar', 'Èrith', 'Lumnum', 'Vakist', 'Elol', 'Ralâth', 'Merrang', 'Bul', 'Or', 'Onam', 'Ulol', 'Et', 'Gébar', 'Ngefel', 'Omoth', 'Govos', 'Orab', 'Dalkam', 'Turel', 'Gudos', 'Gomath', 'Gudid', 'Gekur', 'Thunen', 'Istam', 'Dithbish', 'Vel', 'Tokmek', 'Azzin', 'Tetóth', 'Nimem', 'Numol', 'Romek', 'Uleng', 'Aval', 'Lushòb', 'Damèl', 'Ekir', 'Merseth', 'Vurtib', 'Lelgas', 'Nethgön', 'Suvas', 'Ertal', 'Avan', 'Aroth', 'Sezom', 'Ezost', 'Tustzal', 'Tongus', 'Kùgneb', 'Sutung', 'Imust', 'Shashdon', 'Zansong', 'Dalzat', 'Tad', 'Mëbnith', 'Ûbom', 'Fashuk', 'Ablish', 'Bëmbul', 'Unob', 'Kir', 'Milol', 'Ekur', 'Ottan', 'Gitnuk', 'Sebshos', 'Lêgan', 'Cemosh', 'Sôd', 'Èrnam', 'Idash', 'Stesok', 'Zavaz', 'Ushang', 'Tumam', 'Ednàd', 'Tunom', 'Osresh', 'Tel', 'Onol', 'Leshal', 'Stoling', 'Godum', 'Shislug', 'Ol', 'Bothon', 'Thum', 'Shasad', 'Arrug', 'Rul', 'Shoveth', 'Lathon', 'Kab', 'Dast', 'Thubil', 'Solam', 'Egom', 'Kêdnath', 'Ngutug', 'Ital', 'Ir', 'Rîthol', 'Zaled', 'Irol', 'Lisat', 'Katthir', 'Rodïm', 'Kin', 'Nothok', 'Thokdeg', 'Azmol', 'Äsrath', 'Migrur', 'Nokim', 'Kebon', 'Uzol', 'Egar', 'Losush', 'Zocuk', 'Som', 'Shed', 'Stegëth', 'Zar', 'Dáthnes', 'Zulash', 'Abal', 'Fash', 'Ishen', 'Geth', 'Lîlar', 'Bisól', 'Ator', 'Ìrlom', 'Sherik', 'Eges', 'Othbem', 'Bimmon', 'Mamot', 'Kugik', 'Titthal', 'Udist', 'Dimshas', 'Äkil', 'Inrus', 'Deleth', 'Umshad', 'Niral', 'Libad', 'Merir', 'Udiz', 'Gemur', 'Enal', 'Zèler', 'Stibbom', 'Maram', 'Batôk', 'Vildang', 'Bidnoz', 'Furgig', 'Fongbez', 'Enam', 'Thetust', 'Rushrul', 'Uvir', 'Luslem', 'Bukèt', 'Esar', 'Kàs', 'Atêsh', 'Udar', 'Zokgen', 'Serkib', 'Ong', 'Asàs', 'Akrel', 'När', 'Orstist', 'Ang', 'Nuden', 'Sobìr', 'Noram', 'Bomel', 'Elbel', 'Ennol', 'Rirnöl', 'Stemel', 'Zìzcun', 'Ebal', 'Emdush', 'Nanir', 'Irid', 'Dallith', 'Kìrar', 'Ethram', 'Neshast', 'Ibesh', 'Sûbil', 'Âbir', 'Omthel', 'Istbar', 'Dumat', 'Lames', 'Lavath', 'Mözir', 'Relon', 'Notlith', 'Tithleth', 'Oten', 'Ikùl', 'Bocash', 'Fenok', 'Etom', 'Mukar', 'Ekast', 'Ushdish', 'Zagug', 'Nabid', 'Sosh', 'Gasìs', 'Vathem', 'Noglesh', 'Nanul', 'Cudïst', 'Kåtâk', 'Etvuth', 'Kith', 'Bêngeng', 'Mishthem', 'Girust', 'Othlest', 'Bubnus', 'Igath', 'Ïthod', 'Aran', 'Ûthir', 'Nekut', 'Emal', 'Gathil', 'Kitung', 'Borlon', 'Ashmôn', 'Uthmik', 'Mostod', 'Baktus', 'Idrom', 'Istik', 'Kafâsh', 'Ecosh', 'Eshom', 'Nesteth', 'Thebil', 'Ammesh', 'Ral', 'Guz', 'Reksas', 'Nêcik', 'Elik', 'Akmam', 'Umstiz', 'Gecast', 'Afen', 'Kúd', 'Gansit', 'Fôker', 'Sakil', 'Lirér', 'Dezrem', 'Lanir', 'Est', 'Duz', 'Umar', 'Desis', 'Adag', 'Uben', 'Sesh', 'Ngubmul', 'Azuz', 'Bonun', 'Olthez', 'Zunek', 'Lal', 'Isak', 'Ganad', 'Kik', 'Mïshak', 'Omât', 'Soshor', 'Zakgol', 'Kekim', 'Ziksis', 'Adbok', 'Tangak', 'Bâsen', 'Koman', 'Vës', 'Guthstak', 'Vathsith', 'Stukón', 'Tumos', 'Íkthag', 'Nulral', 'Vuzded', 'Shagog', 'Keng', 'Gïnon', 'Mëtin', 'Isan', 'Rithog', 'Edan', 'Gusgash', 'Togal', 'Mot', 'Vuknud', 'Nefast', 'Arceth', 'Emen', 'Stin', 'Ibas', 'Othob', 'Rûl', 'Idgag', 'Ozor', 'Ibes', 'Moshnún', 'Akuth', 'Ad', 'Kulsim', 'Tecàk', 'Kêshshak', 'Subet', 'Shazak', 'Idith', 'Dubmen', 'Rimad', 'Ongos', 'Shukar', 'Ôsust', 'Lasgan', 'Lerteth', 'Timnär', 'Zeg', 'Kán', 'Ugut', 'Nubam', 'Becor', 'Vudnis', 'Ittás', 'Golast', 'Selen', 'Angzak', 'Elis', 'Kabat', 'Lïd', 'Bot', 'Akrul', 'Kan', 'Shaketh', 'Mugshith', 'Stïvut', 'Mosos', 'Tangath', 'Stëlmith', 'Bithsêst', 'Bobet', 'Dizesh', 'Ebbus', 'Tilesh', 'Arin', 'Atol', 'Ösir', 'Kasben', 'Onget', 'Shetbêth', 'Eknar', 'Isrir', 'Cegol', 'Gósmer', 'Ticek', 'Itnet', 'Morus', 'Íster', 'Othâsh', 'Kôkdath', 'Distat', 'Nan', 'Orngim', 'Nirur', 'Ozur', 'Sar', 'Umäm', 'Zotthol', 'Kiret', 'Govûl', 'Thisrid', 'Kizab', 'Oshot', 'Bisek', 'Mirstal', 'Lanzil', 'Dëngstam', 'Okosh', 'Munsog', 'Liruk', 'Geget', 'Vathez', 'Îcum', 'Detgash', 'Adil', 'Lelum', 'Sirab', 'Stelid', 'Isden', 'Kussad', 'Rithlut', 'Onul', 'Othil', 'Limâr', 'Edól', 'Sital', 'Kathil', 'Ken', 'Estil', 'Rikkir', 'Volal', 'Lish', 'Omrist', 'Ud', 'Othôs', 'Num', 'Dosîm', 'Lim', 'Nentuk', 'Anur', 'Lolum', 'Il', 'Bumal', 'Soloz', 'Cugshil', 'Duthal', 'Lêrush', 'Åm', 'Inol', 'Ging', 'Rilem'],
		['Med', 'Agseth', 'Bidok', 'Nebél', 'Salir', 'Cenäth', 'Thokit', 'Anam', 'Astel', 'Edos', 'Ïdath', 'Roldeth', 'Asrer', 'Arist', 'Fidgam', 'Rashgur', 'Ardes', 'Geshak', 'Nel', 'Neth', 'Roder', 'Tholtig', 'Olmul', 'Mìshos', 'Dolush', 'Nóton', 'Ritan', 'Enir', 'Mat', 'Oshnïl', 'Zutshosh', 'Nonshut', 'Estun', 'Nitig', 'Nulom', 'Enoz', 'Sákrith', 'Satneng', 'Sut', 'Rotig', 'Sharsid', 'Nural', 'Rifot', 'Medtob', 'Âtrid', 'Kod', 'Etes', 'Unâl', 'Umer', 'Gåkïz', 'Themor', 'Alåth', 'Atêk', 'Edod', 'Selsten', 'Shomad', 'Othsin', 'Nakuth', 'Zes', 'Âtast', 'Ùst', 'Okab', 'Sazir', 'Lek', 'Stumäm', 'Nosing', 'Tîrdug', 'Rozsed', 'Enshal', 'Nïng', 'Instol', 'Ostar', 'Stal', 'Reked', 'Sidos', 'Ethbesh', 'Idos', 'Betan', 'Ogîk', 'Ozkak', 'Åkum', 'Nastid', 'Fazís', 'Nicat', 'Tenshed', 'Catten', 'Onshen', 'Sid', 'Ìtdùn', 'Emad', 'Zursùl', 'Îtat', 'Dib', 'Oril', 'Bukog', 'Atot', 'Imik', 'Oshur', 'Rag', 'Merig', 'Lisid', 'Dodók', 'Lecad', 'Fushur', 'Es', 'Gast', 'Egast', 'Akgos', 'Élmeth', 'Avéd', 'Oddom', 'Urol', 'Zatam', 'Shatag', 'Sholid', 'Om', 'Balad', 'Dakas', 'Zoluth', 'Artob', 'Âgoth', 'Mulåsh', 'Kacoth', 'Shadmal', 'Tusung', 'Kezkíg', 'Aban', 'Etost', 'Ágesh', 'Egul', 'Rafar', 'Etnàr', 'Shusug', 'Amkol', 'Laltur', 'Obot', 'Arban', 'Rigòth', 'Dunan', 'Dôbar', 'Shadkik', 'Orshet', 'Zim', 'Ginet', 'Than', 'Thad', 'Memrut', 'Usal', 'Ôm', 'Cagith', 'Deshlir', 'Avum', 'Amem', 'Gikut', 'Matul', 'Irtir', 'Rutod', 'Lodel', 'Ag', 'Kodor', 'Råsh', 'Ros', 'Inir', 'Nadak', 'Arbost', 'Amith', 'Geb', 'Ozon', 'Galthor', 'Sîbosh', 'Arösh', 'Lunrud', 'Storlut', 'Ub', 'Bekar', 'Ôtthat', 'Ozleb', 'Thazor', 'Gorroth', 'Shungmag', 'Olum', 'Etath', 'Tastrod', 'Ashzos', 'Gingim', 'Shoduk', 'Birir', 'Lozlok', 'Akest', 'Rem', 'Fak', 'Ogon', 'Zêvut', 'Nåzom', 'Avog', 'Thikthog', 'Zag', 'Monang', 'Thosbut', 'Ór', 'Sub', 'Sterus', 'Shuk', 'Addor', 'Asdûg', 'Zin', 'Rumad', 'Åmmeb', 'Kokeb', 'Ôler', 'Deb', 'Sárek', 'Todör', 'Kastol', 'Kurol', 'Kisat', 'Minbaz', 'Lushôn', 'Nakas', 'Mizês', 'Stistmig', 'Desor', 'Sefol', 'Tinöth', 'Othör', 'Ninur', 'Ostath', 'Esäst', 'Dèg', 'Egståk', 'Thasdoth', 'Zamnuth', 'Ramtak', 'Onrel', 'Ruzos', 'Öndin', 'Ungèg', 'Ildom', 'Umid', 'Nefek', 'Ivom', 'Thiz', 'Ked', 'Roduk', 'Bardum', 'Atöl', 'Ngitkar', 'Lesast', 'Asiz', 'Gonggash', 'Nëlas', 'Sofûsh', 'Ëtul', 'Låluth', 'Ireg', 'Gigin', 'Atham', 'Ost', 'Gatiz', 'Atul', 'Ìltang', 'Dumed', 'Ézneth', 'Tiklom', 'Ïsir', 'Gishdist', 'Shasar', 'Gulgun', 'Esmul', 'Kèbmak', 'Egen', 'Oltar', 'Fikod', 'Almôsh', 'Bavast', 'Kåtdir', 'Éthes', 'Eser', 'Anil', 'Igest', 'Rab', 'Desgir', 'Ugzol', 'Îgam', 'Gídthur', 'Nothis', 'Gommuk', 'Nerrid', 'Zágod', 'Edtûl', 'Tomêm', 'Bol', 'Ûz', 'Duthnur', 'Sodzul', 'Ïlun', 'Râluk', 'Shameb', 'Thir', 'Ûd', 'Lur', 'Dumur', 'Ikal', 'Vúsh', 'Usen', 'Kunon', 'Lilum', 'Kegeth', 'Dural', 'Ikus', 'Zanos', 'Enur', 'Kur', 'Thibam', 'Vostaz', 'Anist', 'Stòkïd', 'Ushesh', 'Meb', 'Òrdir', 'Avûsh', 'Immast', 'Likot', 'Lumen', 'Istrath', 'Etas', 'Maton', 'Zatthud', 'Abol', 'Mâtzang', 'Ilned', 'Vagúsh', 'Stizash', 'Alis', 'Inshot', 'Arzes', 'Äbor', 'Musar', 'Èrith', 'Ralâth', 'Kûbuk', 'Merrang', 'Meng', 'Anban', 'Gébar', 'Erar', 'Orab', 'Tagùz', 'Turel', 'Gudid', 'Omtäl', 'Thunen', 'Gabet', 'Âmid', 'Thak', 'Aval', 'Uvar', 'Ìnal', 'Gukil', 'Lektad', 'Dimol', 'Tongus', 'Lised', 'Muzish', 'Kôn', 'Dalzat', 'Tad', 'Ablish', 'An', 'Lar', 'Kalal', 'Nalthish', 'Kir', 'Rimuk', 'Avuz', 'Sebshos', 'Ònul', 'Odgúb', 'Idash', 'Ushlub', 'Osresh', 'Leshal', 'Shislug', 'Adesh', 'Usân', 'Rul', 'Kab', 'Kez', 'Ikûl', 'Semtom', 'Necak', 'Kezol', 'Lisat', 'Katthir', 'Umel', 'Eddud', 'Uzol', 'Am', 'Stegëth', 'Sanreb', 'Shigós', 'Âgez', 'Iden', 'Mörul', 'Logem', 'Lerom', 'Tetthush', 'Fash', 'Thimshur', 'Adas', 'Lîlar', 'Ilrom', 'Thet', 'Ator', 'Shithath', 'Sherik', 'Eges', 'Sokan', 'Mamot', 'Ison', 'Erok', 'Titthal', 'Stisträs', 'Udist', 'Îm', 'Tathtat', 'Shoner', 'Idok', 'Ïtsas', 'Deleth', 'Zoz', 'Mubun', 'Libad', 'Teshkad', 'Gashcoz', 'Kasith', 'Tashem', 'Enam', 'Thetust', 'Luslem', 'Iseth', 'Kàs', 'Imsal', 'Udar', 'Borush', 'Umoz', 'Vudthar', 'Stigaz', 'Ograd', 'Ikud', 'Memad', 'Sobìr', 'Noram', 'Eshik', 'Ennol', 'Inem', 'Rirnöl', 'Ebal', 'Emdush', 'Akir', 'Nanir', 'Nokgol', 'Dallith', 'Athel', 'Seng', 'Ethab', 'Locun', 'Neshast', 'Orrun', 'Ibesh', 'Âbir', 'Lulâr', 'Mözir', 'Luzat', 'Suthån', 'Ilid', 'Rur', 'Sashas', 'Etom', 'Ekast', 'Zagug', 'Belar', 'Cudïst', 'Laz', 'Urrïth', 'Girust', 'Kikës', 'Gudas', 'Othlest', 'Tokthat', 'Bubnus', 'Igath', 'Ubas', 'Tathur', 'Ïthod', 'Givel', 'Aran', 'Ûthir', 'Absam', 'Nekut', 'Genlath', 'Asol', 'Esdor', 'Emal', 'Zursul', 'Uthmik', 'Mostod', 'Baktus', 'Bithit', 'Lêned', 'Sodel', 'Ônam', 'Otung', 'Keskal', 'Tomus', 'Dugan', 'Nåst', 'Mesir', 'Istik', 'Éth', 'Zokun', 'Eshom', 'Osal', 'Nêcik', 'Akmam', 'Mosol', 'Umstiz', 'Gecast', 'Udesh', 'Dakäl', 'Sezuk', 'Megid', 'Themthir', 'Fôker', 'Sakil', 'Tekmok', 'Lirér', 'Îlkeb', 'Dezrem', 'Tob', 'Duz', 'Kal', 'Zeber', 'Geles', 'Desis', 'Ostuk', 'Magel', 'Adag', 'Umåm', 'Sesh', 'Bûnem', 'Vod', 'Kebul', 'Isak', 'Âm', 'Esesh', 'Tishis', 'Zakgol', 'Rulush', 'Kekim', 'Ziksis', 'Usur', 'Kob', 'Bâsen', 'Koman', 'Magak', 'Imesh', 'Noböt', 'Guthstak', 'Stukón', 'Tumos', 'Íkthag', 'Dugud', 'Ulåb', 'Zat', 'Nulral', 'Oltud', 'Savot', 'Kot', 'Shìstsak', 'Risid', 'Ecut', 'Isan', 'Rithog', 'Edan', 'Gusgash', 'Tôsed', 'Vuknud', 'Nîles', 'Rêg', 'Äkig', 'Abod', 'Sat', 'Fûbeg', 'Tunur', 'Rûl', 'Eb', 'Oceg', 'Imgoz', 'Mozib', 'Êlbem', 'Sined', 'Ronush', 'Kêshshak', 'Urmim', 'Ongos', 'Enkos', 'Masos', 'Ôsust', 'Lerteth', 'Timnär', 'Vetek', 'Thilség', 'Zeg', 'Stettad', 'Amal', 'Asteb', 'Becor', 'Angzak', 'Okil', 'Elis', 'Gelut', 'Arros', 'Amud', 'Tan', 'Kan', 'Bal', 'Dostust', 'Mugshith', 'Tat', 'Nish', 'Kälán', 'Rìthar', 'Tangath', 'Ïggal', 'Datlad', 'Vafig', 'Dizesh', 'Esis', 'Kobem', 'Tilesh', 'Gamil', 'Cavor', 'Segun', 'Ód', 'Nilim', 'Shetbêth', 'Gim', 'Semor', 'Bakust', 'Gutid', 'Tudrug', 'Oshot', 'Ronstiz', 'Amluth', 'Bisek', 'Lanzil', 'Tost', 'Okol', 'Nursher', 'Rodim', 'Berdan', 'Ngesgäs', 'Legon', 'Lelum', 'Zalìs', 'Nisûn', 'Stelid', 'Lidod', 'Azin', 'Uker', 'Rithlut', 'Othil', 'Nilun', 'Edól', 'Orshar', 'Sibnir', 'Kathil', 'Kol', 'Bomrek', 'Estil', 'Boket', 'Iklist', 'Shos', 'Othôs', 'Oslan', 'Lakàl', 'Rôber', 'Nabår', 'Nentuk', 'Kulal', 'Ducim', 'Bumal', 'Soloz', 'Shoshin', 'Ulzest', 'Åm', 'Taron'],
	]
);
DWARVEN.sets.push(DWARVEN.sets[2].map(s => s.toLowerCase()));

new Language('Founding Fathers', [[[1], [0], [2]]],
	// (specific subset) + (N/Adj/V)(N)
	[
		[' '],
		[
			'Abraham', 'Alexander', 'Andrew', 'Arthur', 'Benjamin', 'Button', 'Caesar',
			'Carter', 'Charles', 'Cornelius', 'Daniel', 'David', 'Edward', 'Elbridge',
			'Francis', 'Gouverneur', 'George', 'Gunning', 'Henry', 'Hugh', 'Jacob', 'James',
			'Jared', 'John', 'Jonathan', 'Joseph', 'Josiah', 'Lewis', 'Lyman', 'Matthew',
			'Nathaniel', 'Nicholas', 'Oliver', 'Philip', 'Pierce', 'Richard', 'Robert', 'Rufus',
			'Samuel', 'Stephen', 'Thomas', 'Titus', 'William',
		],
		[
			'Adams', 'Baldwin', 'Banister', 'Bartlett', 'Bassett', 'Bedford', 'Blair', 'Blount',
			'Braxton', 'Brearley', 'Broom', 'Butler', 'Carroll', 'Chase', 'Clark', 'Clingan',
			'Clymer', 'Collins', 'Dana', 'Dayton', 'Dickinson', 'Drayton', 'Duane', 'Duer',
			'Ellery', 'Few', 'Fitzsimons', 'Floyd', 'Franklin', 'Gerry', 'Gilman', 'Gorham',
			'Gwinnett', 'Hall', 'Hamilton', 'Hancock', 'Hanson', 'Harnett', 'Harrison', 'Hart',
			'Harvie', 'Hewes', 'Heyward', 'Holten', 'Hooper', 'Hopkins', 'Hopkinson', 'Hosmer',
			'Huntington', 'Hutson', 'Ingersoll', 'Jackson', 'Jefferson', 'Jenifer', 'Johnson',
			'King', 'Langdon', 'Langworthy', 'Laurens', 'Lee', 'Lewis', 'Livingston', 'Lovell',
			'Lynch', 'Madison', 'Marchant', 'Mathews', 'McHenry', 'McKean', 'Middleton',
			'Miffin', 'Morris', 'Morton', 'Nelson', 'Paca', 'Paine', 'Paterson', 'Penn',
			'Pinckney', 'Read', 'Reed', 'Roberdeau', 'Rodney', 'Ross', 'Rush', 'Rutledge',
			'Scudder', 'Sherman', 'Smith', 'Spaight', 'Stockton', 'Stone', 'Taylor', 'Telfair',
			'Thornton', 'Van Dyke', 'Walton', 'Washington', 'Wentworth', 'Whipple', 'Williams',
			'Williamson', 'Wilson', 'Witherspoon', 'Wolcott', 'Wythe'
		],
	]
);

// finally
namegen.init();