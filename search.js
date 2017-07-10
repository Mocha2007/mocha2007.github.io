function doit(){
var s=document.getElementsByTagName("input")[0].value
document.write(`<!DOCTYPE html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link href="simple.css" type="text/css" rel="stylesheet">
<link href=dark.css type="text/css" rel="alternate stylesheet" title="Dark"> 
<link href=blend.css type="text/css" rel="alternate stylesheet" title="Blend">
<link href=print.css type="text/css" rel="stylesheet" media="print">
<link rel="shortcut icon" href=molsico.png>
<link rel="apple-touch-icon" href="img/mols_57.png" />
<link rel="apple-touch-icon" sizes="72x72" href="img/mols_72.png" />
<link rel="apple-touch-icon" sizes="114x114" href="img/mols_114.png" />
<link rel="apple-touch-icon" sizes="144x144" href="img/mols_144.png" />
<title>MOLS Results for "`+s+`"</title>
You searched for: "`+s+`".<br/>
<a href="search.html">Go Back</a><br/>
<b>DICTIONARIES:</b><br/>
<a href="http://en.wiktionary.org/wiki/`+s+`#English">Wiktionary - English</a><br/>
<a href="http://ahdictionary.com/word/search.html?q=`+s+`">American Heritage Dictionary</a><br/>
<a href="http://dictionary.cambridge.org/us/dictionary/english/`+s+`">Cambridge - English</a><br/>
<a href="http://collinsdictionary.com/dictionary/english/`+s+`">Collins - English</a><br/>
<a href="http://dictionary.com/browse/`+s+`">dictionary.com</a><br/>
<a href="http://ldoceonline.com/dictionary/`+s+`">Longman</a><br/>
<a href="http://macmillandictionary.com/search/british/?q=`+s+`">Macmillan</a><br/>
<a href="http://merriam-webster.com/dictionary/`+s+`">Merriam-Webster</a><br/>
<a href="http://en.oxforddictionaries.com/definition/`+s+`">Oxford - English</a><br/>
<a href="http://oxfordlearnersdictionaries.com/us/definition/english/`+s+`_1">Oxford Advanced Learner\'s Dictionary</a><br/>
<a href="http://www.urbandictionary.com/define.php?term=`+s+`">Urban Dictionary</a><br/>
<b>THESAURI:</b><br/>
<a href="http://en.wiktionary.org/wiki/Wikisaurus:`+s+`">Wikisaurus</a><br/>
<a href="http://collinsdictionary.com/dictionary/english-thesaurus/`+s+`">Collins</a><br/>
<a href="http://merriam-webster.com/thesaurus/`+s+`">Merriam-Webster</a><br/>
<a href="http://thesaurus.com/browse/`+s+`">thesaurus.com</a><br/><b>ENCYCLOPEDIAE:</b><br/>
<a href="http://en.wikipedia.org/wiki/`+s+`">Wikipedia</a><br/><b>GAME ENCYCLOPEDIAE:</b><br/>
<a href="http://dwarffortresswiki.org/index.php/DF2014:`+s+`">DFWiki</a><br/>
<a href="http://minecraft.gamepedia.com/`+s+`">MCWiki</a><br/>
<a href="http://terraria.gamepedia.com/`+s+`">Terraria Wiki</a><br/>
<img src="http://upload.wikimedia.org/wikipedia/commons/f/f5/Flag_of_Esperanto.svg" width="18" height="12"><b>RESURSOJ ESPERANTAJ:</b><br/>
<a href="http://vortaro.net/#`+s+`">vortaro.net</a><br/>
<a href="http://eo.wikipedia.org/wiki/`+s+`">Vikipedio</a><br/>
<a href="http://eo.wiktionary.org/wiki/`+s+`#Esperanto">Vikivortaro</a><br/>
<b>OTHER RESOURCES:</b><br/><a href="http://corpus.byu.edu/coca/">COCA</a><br/>
<a href="http://duckduckgo.com/?q=`+s+`">DuckDuckGo</a><br/>
<a href="http://etymonline.com/index.php?search=`+s+`">Etymonline</a><br/>
<a href="http://books.google.com/ngrams/graph?content=`+s+`&year_start=1500&year_end=2008">Google Ngram</a><br/>
<a href="http://google.com/trends/explore?date=all&q=`+s+`">Google Trends</a><br/>
<a href="http://www.perseus.tufts.edu/hopper/searchresults?q=`+s+`">Perseus</a><br/>
<a href="http://reddit.com/search?q=`+s+`">Reddit - Search</a><br/>
<a href="http://reddit.com/r/`+s+`">Reddit - Subreddit</a><br/>
<a href="http://reddit.com/u/`+s+`">Reddit - User</a><br/>
<a href="http://wolframalpha.com/input/?i=`+s+`">Wolfram Alpha</a><br/>
<a href="http://youtube.com/results?search_query=`+s+`">Youtube</a>
</html>
`);}