/* global goldClock */
const OTHER_GOLDCLOC_LOCS = {
	ANG: {
		ap: 'ap'.split('').map(s => '_'+s),
		day: 'Sunnan Mōnan Tīwes Wōdnes Þunres Frīġe Sæternes'.split(' ').map(s => s + 'dæġ'),
		month: 'Æ.Gēol Sol Hrēð Ēaster Þrimilce Sēar Mǣd Wēod Hālig Winterf. Blōt Gēol'.split(' '),
		moon: 'Nīewe +C Forma +G Full -G Þridda -C'.split(' '), // moon is masculine
		season: 'Lencten Sumer Hærfest Winter'.split(' '),
		zodiac: 'Ramm Fearr Ġetwisan Crabba Lēo Fǣmne Lib Sċorpio Sċytta Cap Aqu Fiscas'.split(' '),
	},
	JP: {
		ap: '前後'.split('').map(s => '午 '+s+' _'),
		day: '日 月 火 水 木 金 土'.split(' ').map(s => s + ' 曜 日'),
		month: '一\t二\t三\t四\t五\t六\t七\t八\t九\t十\t十 一\t十 二'.split('\t').map(s => s+' 月'),
		moon: '新 月\t三 日 月\t上 弦\t十 一 日 月\t満 月\t十 八 日 月\t下 弦\t二 十 六 日 月'.split('\t'),
		season: '春 夏 秋 冬'.split(' '),
		zodiac: '白 羊\n金 牛\n双 子\t巨 蟹\t獅 子\t処 女\t天 秤\t天 蝎\t人 馬\t磨 羯\t宝 瓶\t双 魚'.split('\t').map(s => s+' 宮'),
	},
	LA: {
		ap: 'ap'.split('').map(s => '_'+s),
		day: 'Sōlis Lūnae Mārtis Mercuriī Iovis Veneris Saturnī'.split(' ').map(s => 'Diēs '+s),
		month: 'Iān Feb Mār Apr Māi Iūn Iūl Aug Sep Oct Nov Dec'.split(' '),
		moon: 'Nova AC AD AIOI Plena DIOI DD DC'.split(' '),
		season: 'Vēr Aestās Autumnus Hiems'.split(' '),
		zodiac: 'Ari Tau Gem Can Leō Vir Lib Sco Sag Cap Aqu Pis'.split(' '),
	},
	PIE: {
		ap: 'h₂ p'.split(' ').map(s => '_'+s),
		//made up ones:        Ares   Hermes       Venus     Cronus
		day: 'sh₂wéns méh₁n̥sos h₂erés sermés diwés wénh₁osyo krónosyo'.split(' ').map(s => 'dyḗws '+s),
		// ordinals
		month: 'pr̥h₃ h₂én tri kʷet pen swe sep oḱt h₁ne deḱ h₁oy dwi'.split(' '),
		// waxing = ḱreh₁sḱónts; waning = deḱreh₁sḱónts; crescent = ḱr̥h₂nós; gibbous = geybʰós
		moon: 'néwos ḱḱ pr̥h₃wós gḱ pl̥h₁nós gd tritós ḱd'.split(' '), // mḗh₁n̥s is masculine
		season: 'wósr̥ sm̥h₂ós (s)h₁esós ǵʰéyōm'.split(' '),
		//       wr̥h₁ḗn táwros yémHoes karkros ?leóntos pr̥spténos ?ledʰreh₂ ?skorpéos ?lenk- kápros h₂ékʷeh₂ dʰǵʰúHes
		zodiac: 'wr̥h₁ táw yém kar leó pr̥s ledʰ sko len káp h₂ékʷ dʰǵʰú'.split(' '),
	},
	PL: {
		ap: 'ap'.split('').map(s => '_'+s),
		day: 'Niedziela Poniedziałek Wtorek Środa Czwartek Piątek Sobota'.split(' '),
		month: 'Styczeń Luty Marzec Kwiecień Maj Czerwiec Lipiec Sierpień Wrzesień Październik Listopad Grudzień'.split(' '),
		// https://spotbox.pl/wp-content/uploads/2023/03/Fazy-Ksiezyca-1024x597.jpg
		moon: 'Nów;Sierp P.;PK;Garb R.;Pełnia;Garb Z.;OK;Sierp Z.'.split(';'),
		season: 'Wiosna Lato Jesień Zima'.split(' '),
		zodiac: 'Baran Byk Bliźnięta Rak Lew Panna Waga Skorpion Strzelec Koziorożec Wodnik Ryby'.split(' '),
	},
};

function ADD_OTHER_LOCS(){
	if (typeof goldClock === 'undefined')
		return setInterval(ADD_OTHER_LOCS, 100);
	// otherwise...
	for (const key in OTHER_GOLDCLOC_LOCS)
		goldClock.language[key] = OTHER_GOLDCLOC_LOCS[key];
}

// eslint-disable-next-line new-cap
ADD_OTHER_LOCS();