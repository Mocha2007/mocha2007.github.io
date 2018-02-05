function doit(){
	"use strict";
	var element=document.getElementById("result");
	var s=document.getElementsByTagName("input")[0].value;
	/* Modified from https://stackoverflow.com/a/1643468/2579798 */
	var monthNames=["January","February","March","April","May","June","July","August","September","October","November","December"];
	var d = new Date();
	/* Modified from https://stackoverflow.com/a/10211214/2579798 */
	var currentdate=new Date(); 
	var foot="Results generated "
		+ currentdate.getDate() + " "
		+ monthNames[d.getMonth()]  + " " 
		+ currentdate.getFullYear() + " @ "  
		+ currentdate.getHours() + ":"  
		+ currentdate.getMinutes() + ":" 
		+ currentdate.getSeconds() + " by MOLS (<a href='search.html'>mocha2007.github.io/search.html</a>)";
	
	element.innerHTML=`
	<hr/>
	<div id="bottom"></div>
	You searched for: "`+s+`".<br/>
	<b>DICTIONARIES:</b><br/>
	<a href="https://en.wiktionary.org/wiki/`+s+`#English">Wiktionary - English</a><br/>
	<a href="https://ahdictionary.com/word/search.html?q=`+s+`">American Heritage Dictionary</a><br/>
	<a href="https://dictionary.cambridge.org/us/dictionary/english/`+s+`">Cambridge - English</a><br/>
	<a href="https://dictionary.com/browse/`+s+`">dictionary.com</a><br/>
	<a href="https://ldoceonline.com/dictionary/`+s+`">Longman</a><br/>
	<a href="https://merriam-webster.com/dictionary/`+s+`">Merriam-Webster</a><br/>
	<a href="https://en.oxforddictionaries.com/definition/`+s+`">Oxford - English</a><br/>
	<b>JARGON / SLANG DICTIONARIES:</b><br/>
	<a href="https://www.abbreviations.com/`+s+`">abbreviations.com</a><br/>
	<a href="https://techterms.com/definition/`+s+`">TechTerms</a><br/>
	<a href="https://www.urbandictionary.com/define.php?term=`+s+`">Urban Dictionary</a><br/>
	<b>THESAURI:</b><br/>
	<a href="https://en.wiktionary.org/wiki/Wikisaurus:`+s+`">Wikisaurus</a><br/>
	<a href="https://merriam-webster.com/thesaurus/`+s+`">Merriam-Webster</a><br/>
	<a href="http://thesaurus.com/browse/`+s+`">thesaurus.com</a><br/>
	<b>ENCYCLOPEDIAE:</b><br/>
	<a href="https://en.wikipedia.org/wiki/`+s+`">Wikipedia</a><br/><b>GAME ENCYCLOPEDIAE:</b><br/>
	<a href="https://dwarffortresswiki.org/index.php/DF2014:`+s+`">DFWiki</a><br/>
	<a href="https://minecraft.gamepedia.com/`+s+`">MCWiki</a><br/>
	<a href="https://terraria.gamepedia.com/`+s+`">Terraria Wiki</a><br/>
	<b>RESURSOJ ESPERANTAJ:</b><br/>
	<a href="http://vortaro.net/#`+s+`">vortaro.net</a><br/>
	<a href="https://eo.wikipedia.org/wiki/`+s+`">Vikipedio</a><br/>
	<a href="https://eo.wiktionary.org/wiki/`+s+`#Esperanto">Vikivortaro</a><br/>
	<b>OTHER RESOURCES:</b><br/>
	<a href="https://corpus.byu.edu/coca/">COCA</a><br/>
	<a href="https://duckduckgo.com/?q=`+s+`">DuckDuckGo</a><br/>
	<a href="https://etymonline.com/index.php?search=`+s+`">Etymonline</a><br/>
	<a href="https://books.google.com/ngrams/graph?content=`+s+`&year_start=1500&year_end=2008">Google Ngram</a><br/>
	<a href="https://google.com/trends/explore?date=all&q=`+s+`">Google Trends</a><br/>
	<a href="https://www.perseus.tufts.edu/hopper/searchresults?q=`+s+`">Perseus</a><br/>
	<a href="https://reddit.com/search?q=`+s+`">Reddit - Search</a><br/>
	<a href="https://reddit.com/r/`+s+`">Reddit - Subreddit</a><br/>
	<a href="https://reddit.com/u/`+s+`">Reddit - User</a><br/>
	<a href="https://wolframalpha.com/input/?i=`+s+`">Wolfram Alpha</a><br/>
	<a href="https://youtube.com/results?search_query=`+s+`">Youtube</a><br/><div id="foot">
	`+foot+'</div>';
	// Namei Dictionary
	$("#temp").load("https://mocha2007.github.io/namei.xml");
	try {
		document.getElementById("namei").innerHTML = '<h3>Nameipedia</h3><p>'+document.getElementById(s.toLowerCase()).getAttribute('content')+'</p><a href="namei#'+s+'">Read More...</a>';
	}
	catch(err) {
		document.getElementById("namei").innerHTML = '';
	}
}