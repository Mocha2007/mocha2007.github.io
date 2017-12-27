window.onload = function MakeTOC() {
	//.getElementsByTagName('h1,h2,h3,h4,h5,h6')
	namedheaders = document.querySelectorAll('h1[id],h2[id],h3[id],h4[id],h5[id],h6[id],b.sub,b.super');

	var text = `
	<div class="desc">Navigation<br>
	<a href="index.html">Home</a></div>
	<details open>
		<summary>On This Page</summary>`;

	for (i=0;i<namedheaders.length;i++) {
		if (namedheaders[i].tagName == 'B') {
			namedheaders[i].id = namedheaders[i].innerHTML.replace(/\s/g,'_');/*Maybe I can just use this?!*/
			var formattedname = namedheaders[i].innerHTML;

			if (namedheaders[i].className == 'super') {
				var depth = '2';
			}
			else {
				var depth = '3';
			}
		}
		else {
			var formattedname = namedheaders[i].id.replace(/_/g,' ');
			var depth = namedheaders[i].tagName.slice(-1);
		}
		text+='<span class="nav'+depth+'"><a href="#'+namedheaders[i].id+'">'+formattedname+'</a></span><br>';
		console.log(formattedname,depth);
	}
	text+='</details>';
	
	document.getElementById("nav").innerHTML = text;
}