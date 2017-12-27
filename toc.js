window.onload = function MakeTOC() {
	//.getElementsByTagName('h1,h2,h3,h4,h5,h6')
	namedheaders = document.querySelectorAll('h1[id],h2[id],h3[id],h4[id],h5[id],h6[id]');
	var text = `
	<div class="desc">Navigation<br>
	<a href="index.html">Home</a></div>
	<details open>
		<summary>On This Page</summary>`;

	for (i=0;i<namedheaders.length;i++) {
		var formattedname = namedheaders[i].id.replace(/_/g,' ');
		text+='<a href=#'+namedheaders[i].id+'>'+formattedname+'</a><br>';
	}
	text+='</details>';
	
	document.getElementById("nav").innerHTML = text;
}