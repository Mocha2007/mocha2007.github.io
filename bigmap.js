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
		if (document.getElementById("b_contain").checked){
			wants = document.getElementById("b_contain_text").value;
			conditional = (x.consonants + x.monophthongs + x.diphthongs).split(" ").includes(wants);
		}
		else if (document.getElementById("b_fam").checked){
			wants = document.getElementById("b_fam_text").value.toLowerCase();
			conditional = x.families.includes(wants);
		}
		else if (document.getElementById("b_area").checked){
			wants = document.getElementById("b_area_text").value.toLowerCase();
			conditional = x.areas.includes(wants);
		}
		else if (document.getElementById("b_quantity").checked){
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

			console.log(soundset.length, wants,soundset. length > wants); // fixme debug

			switch (document.getElementById("b_quantity_select").value){
				case "more":
					conditional = soundset.length > wants;
					break;
				case "fewer":
					conditional = soundset.length < wants;
					break;
				case "exact":
					conditional = soundset.length === wants;
					break;
			}
		}
		else { // document.getElementById("b_all").value
			conditional = true;
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
		diphthongs: "", // too scary
		source: "https://en.wikipedia.org/wiki/Pirahã_language"
	},
	{
		name: "Spanish",
		coords: [40, -4],
		families: ["indo-european", "italic", "romance"],
		areas: ["europe"],
		consonants: "m n J p b t d tS j\\ k g f T s x l L 4 r",
		monophthongs: "a e i o u",
		diphthongs: "", // too scary
		source: "https://en.wikipedia.org/wiki/Spanish_language"
	}
];