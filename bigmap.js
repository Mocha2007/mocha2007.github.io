var point0 = 'img/dots/red.png';
var point1 = 'img/dots/green.png';
var pointsize = 8;

function coord2px(coords){
	"use strict";
	var x = coords[1] * 35/18 + 350 - pointsize/2;
	var y = coords[0] * -35/18 + 175 - pointsize/2;
	return [y,x];
}

function bigmap(){
	"use strict";
	var conditional, coords, hastag, newpoint, newrow, soundset, wants;
	document.getElementById("mapinfo").innerHTML = '<tr><th>Language</th><th>Feature</th><th>C</th><th>V</th></tr>';
	document.getElementById("bigmap").innerHTML = '<img id="mapimg" src="https://upload.wikimedia.org/wikipedia/commons/5/51/BlankMap-Equirectangular.svg" width="700">';
	lang.forEach(function(x){
		// test for conditions
		conditional = true;

		if (document.getElementById("b_contain").checked){
			wants = document.getElementById("b_contain_text").value;
			conditional = conditional && (x.consonants + x.monophthongs + x.diphthongs).split(" ").includes(wants);
		}
		if (document.getElementById("b_fam").checked){
			wants = document.getElementById("b_fam_text").value.toLowerCase();
			conditional = conditional && x.families.includes(wants);
		}
		if (document.getElementById("b_area").checked){
			wants = document.getElementById("b_area_text").value.toLowerCase();
			conditional = conditional && x.areas.includes(wants);
		}
		if (document.getElementById("b_quantity").checked){
			wants = Number(document.getElementById("b_quantity_text").value);

			switch (document.getElementById("b_quantity_select2").value){
				case "c":
					soundset = x.consonants;
					break;
				case "v":
					soundset = x.monophthongs + ' ' + x.diphthongs;
					break;
				case "m":
					soundset = x.monophthongs;
					break;
				case "d":
					soundset = x.diphthongs;
					break;
				default:
					soundset = x.consonants + ' ' + x.monophthongs + ' ' + x.diphthongs;
			}

			soundset = soundset.split(' ');

			soundset = soundset[0].length ? soundset : []; // remove lists that are [""]

			switch (document.getElementById("b_quantity_select").value){
				case "more":
					conditional = conditional && (soundset.length > wants);
					break;
				case "fewer":
					conditional = conditional && (soundset.length < wants);
					break;
				case "exact":
					conditional = conditional && (soundset.length === wants);
					break;
			}
		}
		if (document.getElementById("b_tag").checked){
			wants = document.getElementById("b_tag_text").value.toLowerCase();
			hastag = (x.tags !== undefined) && x.tags.includes(wants);

			switch (document.getElementById("b_tag_select").value){
				case "w":
					conditional = conditional && hastag;
					break;
				case "wo":
					conditional = conditional && !hastag;
					break;
			}
		}
		// bigmap
		coords = coord2px(x.coords);
		newpoint = document.createElement("img");
		newpoint.alt = x.name;
		newpoint.title = x.name;
		newpoint.src = conditional ? point1 : point0;
		newpoint.width = pointsize;
		newpoint.style.position = "absolute";
		newpoint.style.top = coords[0] + "px";
		newpoint.style.left = coords[1] + "px";
		document.getElementById("bigmap").appendChild(newpoint);
		// mapinfo
		newrow = document.createElement("tr");
		newrow.innerHTML = "<td><a href='"+x.source+"'>"+x.name+"</a></td><td class='"+conditional+"'>"+conditional+"</td><td>"+(conditional ? x.consonants : "-")+"</td><td>"+(conditional ? x.monophthongs+' '+x.diphthongs : "-")+"</td>";
		document.getElementById("mapinfo").appendChild(newrow);
	});
	// console.log("Success!");
}

var lang = [
	{
		name: "Akkadian",
		coords: [34, 44],
		families: ["afro-asiatic", "semitic"],
		areas: ["asia"],
		tags: ["dead"],
		consonants: "m n p t k ? b d g t_?\\ k_?\\ s x G ts dz ts_?\\ l j w",
		monophthongs: "i u e a",
		diphthongs: "",
		source: "https://en.wikipedia.org/wiki/Akkadian_language"
	},
	{
		name: "Ancient Greek",
		coords: [38, 24],
		families: ["indo-european", "hellenic"],
		areas: ["europe"],
		tags: ["dead"],
		consonants: "p_h t_h k_h p t k b d g m n s h r l_0 W l j w",
		monophthongs: "i y u e o a i: y: u: e: E: O: a:",
		diphthongs: "yi ei eu oi ou ai au E:i O:i E:u O:u a:i a:u",
		source: "https://en.wikipedia.org/wiki/Ancient_Greek"
	},
	{
		name: "Arabic",
		coords: [25, 47],
		families: ["afro-asiatic", "semitic"],
		areas: ["africa", "asia"],
		consonants: "m n t t_?\\ k q ? b d d_?\\ f T s s_?\\ S x X\\ D z D_?\\ G ?\\ h dZ r l j w",
		monophthongs: "i u a i: u: a:",
		diphthongs: "aj aw",
		source: "https://en.wikipedia.org/wiki/Arabic"
	},
	{
		name: "Basque",
		coords: [43, -2],
		families: ["vasconic"],
		areas: ["europe"],
		consonants: "m n J p t c k b d J\\ g ts_m ts_a tS f s_m s_a S h j l L r 4",
		monophthongs: "a e i o u",
		diphthongs: "",
		source: "https://en.wikipedia.org/wiki/Basque_language"
	},
	{
		name: "Bengali",
		coords: [24, 90],
		families: ["indo-european", "indo-iranian", "indo-aryan"],
		areas: ["asia", "india"],
		consonants: "m n N p t t` tS k p_h t_h t`_h tS_h k_h b d d` dZ g b_h d_h d`_h dZ_h g_h s S h w l j r r`",
		monophthongs: "i u e o E O a i~ u~ e~ o~ {~ O~ a~",
		diphthongs: "ae ai ao au {e {o ei eu ii iu oe oi oo ou ui",
		source: "https://en.wikipedia.org/wiki/Bengali_language"
	},
	{
		name: "Cherokee",
		coords: [36, -82],
		families: ["iroquoian"],
		areas: ["north america"],
		consonants: "t k ? ts s h m n l j M\\",
		monophthongs: "i i: u u: e e: @~ @~: o o: a a:",
		diphthongs: "ai",
		source: "https://en.wikipedia.org/wiki/Cherokee_language"
	},
	{
		name: "Danish",
		coords: [56, 13],
		families: ["indo-european", "germanic"],
		areas: ["europe"],
		consonants: "m n N p b t d k g f s h v l j R",
		monophthongs: "i i: y y: u u: e e: E E: 2 2: o o: 9 9: @ O O: { {: 9_o 9_o: Q Q: a & &: 6 V A A:",
		diphthongs: "",
		source: "https://en.wikipedia.org/wiki/Danish_language"
	},
	{
		name: "Dutch",
		coords: [52, 5],
		families: ["indo-european", "germanic"],
		areas: ["europe"],
		consonants: "m n N p b t d k g f v s z S Z x G h\\ r P l j",
		monophthongs: "I Y E @ O A i: y: u: e: 2: o: a:",
		diphthongs: "Ei 9y Au iu yu ui e:u o:i a:i",
		source: "https://en.wikipedia.org/wiki/Dutch_language"
	},
	{
		name: "Dyirbal",
		coords: [-18, 146],
		families: ["pama-nyungan", "dyirbalic"],
		areas: ["australia"],
		consonants: "p k c t_d t t` m N J n_d n n` r r` w j l",
		monophthongs: "i u a",
		diphthongs: "",
		source: "https://en.wikipedia.org/wiki/Dyirbal_language"
	},
	{
		name: "English",
		coords: [51, 0],
		families: ["indo-european", "germanic"],
		areas: ["europe", "britain", "north america", "australia", "africa", "asia", "india"],
		consonants: "m n N p b t d tS dZ k g f v T D s z S Z h l r\\ j w",
		monophthongs: "i I e E { A o U u @",
		diphthongs: "{u oe Ai",
		source: "#bigmap"
	},
	{
		name: "Etruscan",
		coords: [44, 11],
		families: ["tyrsenian"],
		areas: ["europe"],
		tags: ["dead"],
		consonants: "m n p p_h t t_h k k_h ts p\\ s S h l j w r",
		monophthongs: "i e a u",
		diphthongs: "",
		source: "https://en.wikipedia.org/wiki/Etruscan_language"
	},
	{
		name: "Finnish",
		coords: [60, 25],
		families: ["uralic", "finnic"],
		areas: ["europe"],
		consonants: "m n p t k ? s h P l j r",
		monophthongs: "i i: y y: u u: e e: 2 2: o o: { {: A A:",
		diphthongs: "ai au {i {y oi ou ei eu ey 2i 2y ui uo iu iy ie yi y2",
		source: "https://en.wikipedia.org/wiki/Finnish_language"
	},
	{
		name: "French",
		coords: [49, 2],
		families: ["indo-european", "italic", "romance"],
		areas: ["europe", "north america", "south america", "africa"],
		consonants: "m n J p t k b d g f s S v z Z R l j H w",
		monophthongs: "i y u e 2 @ o E E: 9 O a A E~ 9~ O~ A~",
		diphthongs: "",
		source: "https://en.wikipedia.org/wiki/French_language"
	},
	{
		name: "German",
		coords: [53, 13],
		families: ["indo-european", "germanic"],
		areas: ["europe"],
		consonants: "m n N p t k b d g pf ts tS s S z f C x h v j l r",
		monophthongs: "I i: Y y: U u: e: 2: o: E 9 O a a:",
		diphthongs: "OY aI aU",
		source: "https://en.wikipedia.org/wiki/German_language"
	},
	{
		name: "Greek",
		coords: [38, 24],
		families: ["indo-european", "hellenic"],
		areas: ["europe"],
		consonants: "m n p t k b d g f T s x v D z G r l",
		monophthongs: "i u e o a",
		diphthongs: "",
		source: "https://en.wikipedia.org/wiki/Greek_language"
	},
	{
		name: "Hawaiian",
		coords: [21, -158],
		families: ["austronesian", "malayo-polynesian", "oceanic", "polynesian"],
		areas: ["oceania"],
		consonants: "m n p t ? h w l",
		monophthongs: "i u i: u: E o e: o: 6 a:",
		diphthongs: "iu ou oi eu ei au ai ao ae o:u e:i a:u a:i a:o a:e",
		source: "https://en.wikipedia.org/wiki/Hawaiian_language"
	},
	{
		name: "Hindi",
		coords: [29, 77],
		families: ["indo-european", "indo-iranian", "indo-aryan"],
		areas: ["asia", "india"],
		consonants: "m n p t t` tS k p_h t_h t`_h tS_h k_h b d d` dZ g b_h d_h d`_h dZ_h g_h f s S v z h\\ 4 P l j",
		monophthongs: "i: I U u: e: @ o: E: O: A:",
		diphthongs: "",
		source: "https://en.wikipedia.org/wiki/Hindi"
	},
	{
		name: "Hungarian",
		coords: [47, 19],
		families: ["uralic", "ugric"],
		areas: ["europe"],
		consonants: "m n J p b t d k g ts dz tS dZ c_C J\\_j\\ f v s z S Z h r l j",
		monophthongs: "i: i y: y u: u 2: 2 o: o e: E a: Q",
		diphthongs: "",
		source: "https://en.wikipedia.org/wiki/Hungarian_language"
	},
	{
		name: "Japanese",
		coords: [36, 140],
		families: ["japonic"],
		areas: ["asia"],
		consonants: "m n p b t d k g s z h r j w",
		monophthongs: "i u e o a",
		diphthongs: "",
		source: "https://en.wikipedia.org/wiki/Japanese_language"
	},
	{
		name: "Ket",
		coords: [63, 87],
		families: ["dene-yeniseian", "yeniseian"],
		areas: ["asia"],
		consonants: "m n N t k q b d s C h K\\",
		monophthongs: "i 1 u e @ o a",
		diphthongs: "",
		source: "https://en.wikipedia.org/wiki/Ket_language"
	},
	{
		name: "Korean",
		coords: [38, 127],
		families: ["koreanic"],
		areas: ["asia"],
		consonants: "m n N b d dz\\ g p t ts\\ k p_h t_h ts\\_h k_h s_h h s w l j",
		monophthongs: "i M u e 2 E o V a i: M: u: e: 2: E: V: o: a:",
		diphthongs: "",
		source: "https://en.wikipedia.org/wiki/Korean_language"
	},
	{
		name: "Latin",
		coords: [42, 12],
		families: ["indo-european", "italic"],
		areas: ["europe"],
		tags: ["dead"],
		consonants: "b d g g_w p t k k_w z f s h m n r l j w",
		monophthongs: "i: I U u: e: E O o: a a:",
		diphthongs: "ui ei eu oe ou ae au",
		source: "https://en.wikipedia.org/wiki/Latin"
	},
	{
		name: "Mandarin",
		coords: [40, 116],
		families: ["sino-tibetan", "sinitic"],
		areas: ["asia"],
		consonants: "p t k p_h t_h k_h m n N ts ts` ts\\ ts_h ts`_h ts\\_h f s s` s\\ x w l r\\` j",
		monophthongs: "i y u 7 @ a",
		diphthongs: "ye u@ uo ie ua ia iu ei ou au ai",
		source: "https://en.wikipedia.org/wiki/Mandarin_Chinese"
	},
	{
		name: "Maori",
		coords: [-41, 175],
		families: ["austronesian", "malayo-polynesian", "oceanic", "polynesian"],
		areas: ["oceania"],
		consonants: "p t k f h m n N 4 w",
		monophthongs: "i } e o a",
		diphthongs: "ae ai ao au oi oe ou",
		source: "https://en.wikipedia.org/wiki/Maori_language"
	},
	{
		name: "Nahuatl",
		coords: [19, -99],
		families: ["uto-aztecan", "nahuan"],
		areas: ["north america", "mesoamerica"],
		consonants: "m n p t k k_w ? ts tK tS s l S j w",
		monophthongs: "i: i o: o e: e a: a",
		diphthongs: "",
		source: "https://en.wikipedia.org/wiki/Nahuatl"
	},
	{
		name: "Navajo",
		coords: [36, -109],
		families: ["dene–yeniseian", "na-dene", "athabaskan"],
		areas: ["north america"],
		consonants: "p t t_l ts tS k ? t_h tK_h ts_h tS_h k_h t_> tK_> ts_> tS_> k_> K s S x l z Z G m n j",
		monophthongs: "i i~ e e~ o o~ A A~",
		diphthongs: "",
		source: "https://en.wikipedia.org/wiki/Navajo_language"
	},
	{
		name: "Piraha",
		coords: [-7, -62],
		families: ["mura"],
		areas: ["amazon", "brazil", "south america"],
		consonants: "p t ? b g s h",
		monophthongs: "i o a",
		diphthongs: "",
		source: "https://en.wikipedia.org/wiki/Pirahã_language"
	},
	{
		name: "Portuguese",
		coords: [39, -9],
		families: ["indo-european", "italic", "romance"],
		areas: ["brazil", "europe", "south america"],
		consonants: "m n J p t k k_w b d g g_w f s S v z Z j w l L R 4",
		monophthongs: "i i~ u u~ M e e~ 6 6~ E O a",
		diphthongs: "",
		source: "https://en.wikipedia.org/wiki/Portuguese_language"
	},
	{
		name: "Proto-Indo-European",
		coords: [50, 45],
		families: ["indo-european"],
		areas: ["europe"],
		tags: ["dead", "proto"],
		consonants: "m n p t k q q_w d g G\\ G\\_w b_h d_h g_h G\\_h g\\_w_h s r l j w ? X\\ G_w",
		monophthongs: "e o e: o:",
		diphthongs: "ei oi eu ou",
		source: "https://en.wikipedia.org/wiki/Proto-Indo-European"
	},
	{
		name: "Punic",
		coords: [37, 10],
		families: ["afro-asiatic", "semitic"],
		areas: ["africa"],
		tags: ["dead"],
		consonants: "? b g d h w z X\\ t_?\\ j k l m n s ?\\ p s_q k_?\\ r S t",
		monophthongs: "a i u a: i: u: e: o:",
		diphthongs: "",
		source: "https://en.wikipedia.org/wiki/Punic_language"
	},
	{
		name: "Punjab",
		coords: [31, 75],
		families: ["indo-european", "indo-iranian", "indo-aryan"],
		areas: ["asia", "india"],
		consonants: "m n n` J N p t t` tS k p_h t_h t`_h tS_h k_h b d d` dZ g f s S z 4 r` P l r\\` j h\\",
		monophthongs: "i i: i~: u u: u~: I U e e: e~: o o: o~: @ E E: E~: O O: O~: a a: a~:",
		diphthongs: "",
		source: "https://en.wikipedia.org/wiki/Punjabi_language"
	},
	{
		name: "Rotokas",
		coords: [-6, 155],
		families: ["north bougainville"],
		areas: ["oceania"],
		consonants: "p t k b d g",
		monophthongs: "i i: u u: e e: o o: a a:",
		diphthongs: "",
		source: "https://en.wikipedia.org/wiki/Rotokas_language"
	},
	{
		name: "Rukai",
		coords: [23, 121],
		families: ["austronesian"],
		areas: ["asia"],
		consonants: "m n N p t d` k b d g ts v T s D r w l l` j",
		monophthongs: "i e o a",
		diphthongs: "",
		source: "https://en.wikipedia.org/wiki/Rukai_language"
	},
	{
		name: "Russian",
		coords: [56, 38],
		families: ["indo-european", "balto-slavic", "slavic"],
		areas: ["asia", "europe"],
		consonants: "m m' n n' p p' t t' k k' b b' d d' g ts t_s\\ f f' s s' s` s\\: x v v' z z' z` s\\: l l' j r r'",
		monophthongs: "i u e o a",
		diphthongs: "",
		source: "https://en.wikipedia.org/wiki/Russian_language"
	},
	{
		name: "Spanish",
		coords: [40, -4],
		families: ["indo-european", "italic", "romance"],
		areas: ["europe", "north america", "south america"],
		consonants: "m n J p b t d tS j\\ k g f T s x l L 4 r w j",
		monophthongs: "a e i o u",
		diphthongs: "",
		source: "https://en.wikipedia.org/wiki/Spanish_language"
	},
	{
		name: "Sumerian",
		coords: [31, 46],
		families: [],
		areas: ["asia"],
		tags: ["dead"],
		consonants: "m n N p t k ? p_h t_h k_h s S x h ts ts_h 4 l j",
		monophthongs: "a e i u",
		diphthongs: "",
		source: "https://en.wikipedia.org/wiki/Sumerian_language"
	},
	{
		name: "Tagalog",
		coords: [15, 121],
		families: ["austronesian", "malayo-polynesian", "philippine"],
		areas: ["oceania"],
		consonants: "m n J N p b t d k g ? ts tS dZ s S x h l j w 4",
		monophthongs: "i u e o a",
		diphthongs: "ai ui au iu",
		source: "https://en.wikipedia.org/wiki/Tagalog_language"
	},
	{
		name: "Tok Pisin",
		coords: [-9, 147],
		families: ["creole"],
		areas: ["oceania"],
		consonants: "p b t d k g v s h m n N l w j r",
		monophthongs: "i u e o a",
		diphthongs: "",
		source: "https://en.wikipedia.org/wiki/Tok_Pisin"
	},
	{
		name: "Turkish",
		coords: [41, 29],
		families: ["turkic", "oghuz"],
		areas: ["asia", "europe"],
		consonants: "m n p b t d k g tS dZ f v s z S Z h l j 4",
		monophthongs: "i y M u e 9 o a",
		diphthongs: "",
		source: "https://en.wikipedia.org/wiki/Turkish_language"
	},
	{
		name: "Yucatec Maya",
		coords: [20, -89],
		families: ["mayan"],
		areas: ["north america", "mesoamerica"],
		consonants: "m n b_< p_h t_h k_h ? p_> t_> k_> ts_h tS_h ts_> tS_> s S x h w l j 4",
		monophthongs: "i u e o a",
		diphthongs: "",
		source: "https://en.wikipedia.org/wiki/Yucatec_Maya_language"
	},
];