var point0 = 'img/dots/red.png';
var point1 = 'img/dots/green.png';
var pointsize = 8;

function coord2px(coords){
	var x = coords[1] * 35/18 + 350 - pointsize/2;
	var y = coords[0] * -35/18 + 175 - pointsize/2;
	return [y,x];
}

function bigmap(){
	// "use strict";
	var conditional, coords, newpoint, newrow, wants;
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
	console.log("Success!");
}

lang = [
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
		name: "Pirahã",
		coords: [-7, -62],
		families: ["mura"],
		areas: ["amazon", "brazil", "south america"],
		consonants: "p t ? b g s h",
		monophthongs: "i o a",
		diphthongs: "",
		source: "https://en.wikipedia.org/wiki/Pirahã_language"
	},
];