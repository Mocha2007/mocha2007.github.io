function MakeTOC() {
	"use strict";
	//.getElementsByTagName('h1,h2,h3,h4,h5,h6')
	var namedheaders = document.querySelectorAll('h1[id],h2[id],h3[id],h4[id],h5[id],h6[id],b.sub,b.super');
	/*details open*/
	var text = '<details><summary>Navigation</summary><div class="desc"><a href="index.html">Home</a></div>On This Page<br/>';

	var depth,formattedname,i;
	for (i=0;i<namedheaders.length;i+=1) {
		if (namedheaders[i].tagName === 'B') {
			namedheaders[i].id = namedheaders[i].innerHTML.replace(/\s/g,'_');/*Maybe I can just use this?!*/
			formattedname = namedheaders[i].innerHTML;

			if (namedheaders[i].className === 'super') {
				depth = '2';
			}
			else {
				depth = '3';
			}
		}
		else {
			formattedname = namedheaders[i].id.replace(/_/g,' ');
			depth = namedheaders[i].tagName.slice(-1);
		}
		text+='<span class="nav'+depth+'"><a href="#'+namedheaders[i].id+'">'+formattedname+'</a></span><br>';
		console.log('\t'.repeat(parseInt(depth)-1),formattedname);
	}
	text+='</details>';
	
	document.getElementById("nav").innerHTML = text;
};

window.onload = MakeTOC;