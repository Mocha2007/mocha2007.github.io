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
	var conditional, coords, newpoint, newrow, soundset, wants;
	document.getElementById("mapinfo").innerHTML = '<tr><th>Language</th><th>Feature</th></tr>';
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
		newrow.innerHTML = "<td>"+x.name+"</td><td class='"+conditional+"'>"+conditional+"</td>";
		document.getElementById("mapinfo").appendChild(newrow);
	});
	// console.log("Success!");
}

var lang = [
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
		name: "English",
		coords: [51, 0],
		families: ["indo-european", "germanic"],
		areas: ["europe"],
		consonants: "m n N p b t d tS dZ k g f v T D s z S Z h l r\\ j w",
		monophthongs: "i I e E { A o U u @",
		diphthongs: "{u oe Ai",
		source: "#bigmap"
	},
	{
		name: "French",
		coords: [49, 2],
		families: ["indo-european", "italic", "romance"],
		areas: ["europe"],
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
		name: "Latin",
		coords: [42, 12],
		families: ["indo-european", "italic"],
		areas: ["europe"],
		consonants: "b d g g_w p t k k_w z f s h m n r l j w",
		monophthongs: "i: I U u: e: E O o: a a:",
		diphthongs: "ui ei eu oe ou ae au",
		source: "https://en.wikipedia.org/wiki/Latin"
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
		name: "Pirahã",
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
		consonants: "m n p t k q q_w d g G\\ G\\_w b_h d_h g_h G\\_h g\\_w_h s r l j w ? X\\ G_w",
		monophthongs: "e o e: o:",
		diphthongs: "ei oi eu ou",
		source: "https://en.wikipedia.org/wiki/Proto-Indo-European"
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
		areas: ["europe"],
		consonants: "m n J p b t d tS j\\ k g f T s x l L 4 r w j",
		monophthongs: "a e i o u",
		diphthongs: "",
		source: "https://en.wikipedia.org/wiki/Spanish_language"
	}
];