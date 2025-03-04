/* eslint-disable max-len */
/* exported blogData */
const blogData = [
	`
	@title I made a blog!
	@date 1674659869714
	@tags meta dev
	I made a blog tool that allows me to assign custom tags to specific sections of text.
	
	@p
	@tags js
	For example, in this paragraph, I'm talking about JS, so I tagged it JS.
	I hate JS. :(

	@p
	Later on this morning I also added prev/next/first/last buttons.
	I eventually want to have better search and exploration options,
	but I suppose the best mechanism to allow that will only be obvious after I use this more...
	`,
	`
	@title 25 Jan 2023
	@date 1674670610190
	Aside from making the blog,
	
	@p
	@tags weather
	I have been thinking about the weather recently.
	It has not snowed yet this winter here, although it did drop below freezing a few times.
	It rained this morning, and then stopped around noon.
	Then the rain picked up again a few hours later and contined into the evening.
	It has been in the 40s and 50s so far this week, as far as I recall.
	I wonder if I should add weather analysis tools to my to-do list...

	@p
	@tags site dev chess eremoran astrology
	I've been thinking about resuming the hyper-customizable chess variant tool I last worked on now just over two years ago.
	As cool as that idea still is, there really are other things I should be working on,
	like Eremoran astrology and the terran astrology tool I've been wanting to make for many months now.

	@p
	@tags flash
	I realized yesterday that <cite>:the game:</cite> is now 15 years old.
	I'm tempted to replay it; it would be a wormhole into the past with all its memes.
	<cite>Caesar's day off</cite> is now a decade old, and I gave that a quick replay.
	It's about as good as I remember.

	@p
	@tags ukraine russia war
	I was also reminded of the ongoing Russo-Ukrainian war today.
	I read <a href="https://time.com/6244330/russia-ukraine-war-nuclear-threat/">an article in Time</a> reiterating the looming nuclear threats.
	It appears little progress has been made from Ukraine in the past couple months, which would strengthen the likelihood of a stalemate.
	However, Ukraine did recapture Kherson a couple months ago, so I suppose the front line isn't totally frozen.

	@p
	@tags wikipedia
	Wikipedia recently redesigned their interface for the first time in over a decade.
	I have mixed feelings about it.
	If they removed the ridiculous amount of whitespace, I would say my overall impression would be positive.
	Unfortunately, the whitespace just kills it for me.
	Worse yet is that many actions that took a single click now take several.
	They said there would be a way for logged-out users to toggle the new interface,
	but initially the button did not appear at all, and now it only appears on wide enough monitors.
	There is also the minor issue of coordinates on location pages now weirdly mixing with the article body,
	but that's not <em>that</em> bad.
	The sole positive change is them moving the table of contents into the sidebar.
	On a sidenote, I am completely baffled as to how Wikipedia is the only major website to not even have considered a dark mode.
	Anyways, until and unless they fix the whitespace issues, I think I'll stick with the classic look.

	@p
	@tags earworm
	All day I have had <a href="https://youtu.be/XXlZfc1TrD0"><cite>Banana Brain</cite> by Die Antwoord</a> stuck in my head.

	@p
	@tags meta
	I have to say, I think I will enjoy writing this blog.
	I have long wanted to continue putting my thoughts to paper since I stopped journaling a decade ago.
	`,
	`
	@title 26 Jan 2023
	@date 1674763626258
	@p
	@tags site dev js
	Today I made a neat JS tool that allows me to have an error popup in the corner,
	so I know when there's been an error without checking the console.

	@p
	@tags cwc
	Someone posted on the CWC subreddit that Barb is throwing out a lot of Chris' old stuff
	(although, honestly, it all looks like trash to me).
	It's reminded me that one day I <em>would</em> actually like to take the pilgramage to CWCville and see the sights.
	From a distance, of course. No way in hell am I getting anywhere near Barb.

	@p
	@tags space_exploration uranus
	Recently I read about the <a href="https://en.wikipedia.org/wiki/Uranus_Orbiter_and_Probe">Uranus Orbiter and Probe</a> mission,
	which sounds cool, although it wouldn't even launch for another eight years at earliest and wouldn't arrive for twenty-one years...

	@p
	@tags space_exploration venus
	I also read about the <a href="https://en.wikipedia.org/wiki/DAVINCI">DAVINCI</a> and
	<a href="https://en.wikipedia.org/wiki/VERITAS_(spacecraft)">VERITAS</a> NASA Discovery Program missions,
	which would launch in 2029 and 2031, respectively.
	Again, kinda sucks that it'll take years to see to fruition, but at least these'll arrive within a decade...

	@p
	@tags space_exploration titan
	There is also the <a href="https://en.wikipedia.org/wiki/Dragonfly_(spacecraft)">Dragonfly</a> mission to Saturn's moon Titan,
	which would land a helicopter much like <a href="https://en.wikipedia.org/wiki/Perseverance_(rover)">Perseverance</a>'s
	<a href="https://en.wikipedia.org/wiki/Ingenuity_(helicopter)">Ingenuity</a>.
	This one I'm particularly excited for, because much less is known about the surface of Titan than, say, Mars.
	Will it find signs of life on Titan? Probably not. But the possibility is exciting nevertheless.

	@p
	@tags dev flash
	I spent some time mulling about flash games again.
	One game I have always wanted to remake with more content is Cellcraft.
	The developer open-sourced it many years ago, so I shouldn't have to hunt too far for the mechanics.
	That's at the very bottom of my priority list, though...
	`,
	`
	@title 27 Jan 2023
	@date 1674843828443
	@p
	@tags site dev meta
	I added a "week" option to the blog post time range filter.
	I've been thinking about adding topic/post freequency charts using my chart tool,
	but I think I'll need to wait for more good data before testing it out.
	I also added a sudoku generator to my site.
	`,
	`
	@title 28 Jan 2023
	@date 1674965139633
	@p
	@tags site dev js
	I optimized the sudoku generator as much as I think I can realistically within the limitations of javascript.
	I think I will leave it for now.

	@p
	@tags game_changer
	This evening I discovered the show <cite>Game Changer</cite> and have become totally enthralled, binge-watching as many episodes as I can.
	The musical episode in particular had me splitting my sides the entire time.
	I would definitely recommend a watch!
	`,
	`
	@title 01 Feb 2023
	@date 1675280393178
	@p
	@tags kenken
	I've been trying out kenken puzzles. Mostly 8x8 ones... they're pretty addictive.
	I'm tempted to try a 10x10 one but I'm worried they'll be unmanageable...
	`,
	`
	@title 02 Feb 2023
	@date 1675383358819
	@p
	@tags twitter dev
	Twitter has now announced API access will be a paid feature in a week.
	I guess I'm not gonna be making my Eremor bot anymore.
	On one hand I wish I did, but on the other I suppose it's nice to know I didn't waste my time.
	It's still amazing to me how fast Twitter has collapsed since Musk's acquisition.
	@p
	@tags duolingo japanese
	Today I completed unit 7 of Japanese on Duolingo. 🇯🇵
	@p
	@tags math
	On a whim I decided to try to figure out the group of rotations of a tetrahedron.
	Obviously there are twelve orientations (4 faces * 3 sides per face),
	but I wasn't sure how to name them.
	I decided to arbitrarily name three axes (going from a vertex through the center of a face) A, B, C, and D,
	and to call a clockwise rotation along the axis "_<sub>1</sub>" and a counterclockwise rotation "_<sub>2</sub>".
	I also decided to name the identity rotation "0".
	Beforehand, I thought this would be everything,
	but after writing it out I realized that would only cover 9 rotations.
	I then decided to name the remaining rotations X<sub>1</sub>, X<sub>2</sub>,
	and X<sub>3</sub> in order of when I first encountered them.
	Interesting properties I found:
	<ol>
		<li>
			The rotations are not commutative.
			All combinations of different letters are counterexamples.
			eg. A<sub>1</sub>&middot;B<sub>1</sub> = C<sub>2</sub> but B<sub>1</sub>&middot;A<sub>1</sub> = D<sub>2</sub>.
			If the two operands have the same letter, they are commutative,
			and the result also has the same letter, or is 0.
		</li>
		<li>
			Rotation by the identity rotation is period-1 (obviously),
			rotation by a _<sub>n</sub> rotation is period-3,
			but rotation by X<sub>n</sub> is period-2 -
			ie. X<sub>1</sub>, X<sub>2</sub>, and X<sub>3</sub> are their own inverses.
		</li>
		<li>
			_<sub>1</sub>&middot;_<sub>1</sub> = _<sub>2</sub>
		</li>
		<li>
			_<sub>2</sub>&middot;_<sub>2</sub> = _<sub>1</sub>
		</li>
		<li>
			_<sub>1</sub>&middot;_<sub>2</sub> <em>or</em> _<sub>2</sub>&middot;_<sub>1</sub> = X<sub>n</sub> <em>or</em> 0
		</li>
		<li>
			X<sub>n</sub>&middot;_<sub>m</sub> <em>or</em> _<sub>m</sub>&middot;X<sub>n</sub> = _<sub>m</sub>
		</li>
		<li>
			A generating set of the group is {A<sub>1</sub>, B<sub>1</sub>}.
			In fact, every set of two elements with different letters is a generating set.
			Intuitively it makes sense the minimal generating set would need two elements of different axes,
			since it is similar to geographic coordinates on a sphere.
		</li>
	</ol>
	Unfortunately I do not yet know the deeper reason behind some of these properties,
	but I will definitely keep thinking about them in the back of my mind.
	The period-3 rotations are and obviously must be rotations by 120&deg;,
	but the period-2 rotations are less clear when I try to visualize them.
	Since they are period-2, I <em>suppose</em> they are rotations by 180&deg; (at least, that is my only rationalization),
	but I have some doubt about that and perhaps there is some other weird movement going on instead.
	`,
	`
	@title 03 Feb 2023
	@date 1675434363640
	@p
	@tags site namei
	To the <a href="../namei/namei.html#Eras">Pankairan color synesthesia table</a> I added solids for the elements.
	`,
	`
	@title 08 Feb 2023
	@date 1675897960761
	@p
	@tags math
	I've continued reading about polyhedra, hyperbolic tilings, etc.
	It's interested me enough to where I've been thinking about making
	some sort of tool to automatically generate diagrams similar to what exists on wikipedia,
	although I don't think I <em>quite</em> have all the information I need yet,
	and I still need to define the scope of the project more clearly (something I have always had problems with).
	@p
	@tags math
	As part of this research I tried making an <a href="https://en.wikipedia.org/wiki/Order-5_square_tiling">Order-5 square tiling</a> out of paper squares.
	I was worried it wouldn't be physically possible, but it turned out to be easy,
	and required no stretching or contortion of the paper whatsoever,
	but did require it to stretch into the third dimension in parts.
	When holding it, the joints bend and contort weirdly.
	The closest thing I can compare it to is a planar Jacob's ladder.
	@p
	@tags weather
	Despite it being midwinter, it was warm enough today for me to have to turn on the AC in the afternoon - lol.
	`,
	`
	@title 10 Feb 2023
	@date 1676045672307
	@p
	@tags site eremoran
	I added several new words (mostly fruit) to Eremoran today, including the 900th word - <em>eresoni</em> "rambutan".
	Afterwards, I was curious as to the average number of words added per day:
	it turns out to have been about 0.46 words per day so far.
	I decided that, since I want that number to be 1 word per day,
	I should add at least 4-5 new words per day for the rest of the year,
	so that by the end of the year that number should reach one word per day average.
	Let's see if I can actually stick to this goal - lol.
	`,
	`
	@title 13 Feb 2023
	@date 1676296395888
	@p
	@tags math
	I've long known about the old trick of "cancelling out" the sixes in 16/64 to get the correct simplification of 1/4,
	but I wondered to myself if there were other fractions like that.
	Excluding trivial forms like 11/11, etc., I was able to construct a proof -
	to my level of satisfaction, at least -
	that there are exactly four non-trivial solutions:
	<ul>
		<li>19/95 &rarr; 1/5</li>
		<li>49/98 &rarr; 4/8</li>
		<li>16/64 &rarr; 1/4</li>
		<li>26/65 &rarr; 2/5</li>
	</ul>
	Unfortunately, I realized my little trick for this wouldn't work for 3-digit fractions -
	or, if it can, I couldn't figure it out.
	@p
	@tags math js
	So instead, I wrote a script to find these - and as it turns out, there are dozens and dozens of non-trivial solutions (my program found 220, but there may be others).
	One such solution is 334/835 &rarr; 34/85.
	But interestingly enough, all four of the previous solutions have one (and, as far as I can tell, <em>only</em> one) corresponding three-digit solution:
	<ul>
		<li>199/995 &rarr; 19/95</li>
		<li>499/998 &rarr; 49/98</li>
		<li>166/664 &rarr; 16/64</li>
		<li>266/665 &rarr; 26/65</li>
	</ul>
	Although I tried to use as many clever tricks to make computation as fast as possible,
	I ended up giving up trying to find a clever algorithm to find all the factors of a number.
	Yet another script to add to my useless library of hundreds of single-use scripts... lol.
	`,
	`
	@title 16 Feb 2023
	@date 1676573482819
	@p
	@tags eremoran math
	I added several new math terms to Eremoran today.
	I was curious to see how other languages translate the <a href="https://en.wikipedia.org/wiki/Platonic_solid">platonic solids</a>,
	but disappointingly they are all essentially English calques.
	I, however, have another idea: instead of classifying polygons by their faces,
	what about their vertices?
	And so now, in Eremoran, <a href="https://en.wikipedia.org/wiki/Isogonal_figure">isogonal polyhedra</a> are defined by their vertex behavior.
	For example, the <a href="https://en.wikipedia.org/wiki/Regular_icosahedron">icosahedron</a> is <em>hanuzkumkimôm</em> -
	in other words "triangles, five times [around the vertex]".
	This is sufficient to uniquely identify it as an icosahedron.
	But furthermore, this isn't just some random property of the polyhedron -
	if you turn the solid so you face a vertex, this is <em>exactly what you see</em> -
	five triangles around a single point.
	I imagine, with the level of technology available,
	it would be rather challenging to produce many of these solids -
	practically relegating them to drawings or the imagination, where this is all that would be visible!
	Theoretically, this could also be extended to non-platonic solids:
	for example, a <a href="https://en.wikipedia.org/wiki/Rhombicuboctahedron">rhombicuboctahedron</a> could be a <em>kumkimôkumkuzbabzimôm</em>.
	As a pleasant surprise, the Eremoran terms tend to use roughly the same amount of syllables as in English,
	so I don't have to worry about these being unrealistically unwieldy.
	`,
	`
	@title 23 Feb 2023
	@date 1677174924910
	@p
	@tags eremoran
	It's been almost two weeks since I made my commitment to expanding Eremoran.
	Although I haven't strictly kept to my "4-5 words a day" goals,
	The average so far has at least been within that range, which is good.
	Some days I have no problem coming up with dozens of missing words, others I struggle to think of even one.
	It's very haphazard, unfortunately.
	@p
	@tags meta js site dev
	I also added a js tool for me to get word frequency statistics from my blog:
	<pre>"blog.corpus.stats();"</pre>
	It's imperfect to be sure, but it's still pretty neat to see my blog unsurprisingly conform to normal English word frequency!
	`,
	`
	@title 1000 Eremoran Words
	@date 1677253519365
	@p
	@tags eremoran
	I have just added the one thousandth word to Eremoran - <em>adz</em>,
	a respectful title for elders.
	<em>Adz</em> is a fairly recent loan to Eremoran.
	It comes directly from Vazcud <em>adj</em>, with similar meaning and usage.
	It was originally used by Eremoran scholars towards masters of their field (cf. English "doctor"),
	but has since spread out of academia and into semi-common usage.
	@p
	@tags eremoran math
	Much of the new vocabulary recently, however, has been math.
	I've been reading Euclid's Elements to give me an idea of the mathematical knowledge available at the time,
	and trying to add as much vocabulary from that as reasonable.
	The style of writing is enticing me to make an Eremoran translation,
	but for Eremoran I have tried to shy away from translations of our world's books since it wouldn't make any in-universe sense.
	@p
	@tags weather
	In other news, it has been excessively warm recently.
	Yesterday it approached 80&deg;F and poured in the late afternoon.
	Today the temperature is forecast to fall all day,
	and reach the 40s at night.
	Well, I guess I had <em>one</em> day of summer...
	`,
	`
	@title Rewnewables in Factorio
	@date 1677517880255
	@p
	@tags factorio
	I've recently been into Factorio again, and I realized something interesting.
	There are few renewable resources, but one of the ones that is? Crude oil.
	Yes, crude oil is renewable in factorio.
	Pumpjacks bottom out at 2 crude oil per second, and never deplete.
	This means oil products are among the handful of truly renewable resources:
	<ul>
		<li>Energy, Water, Crude Oil</li>
		<li>Heavy Oil, Light Oil, Petroleum Gas</li>
		<li>Steam</li>
		<li>Sulfur</li>
		<li>Lubricant</li>
		<li>Solid Fuel</li>
		<li>Rocket Fuel</li>
	</ul>
	However, in order to acquire any of these,
	you will need a <em>small</em> quanitity of non-renewables to kickstart production,
	but after that, everything is automatic.
	A small base focused on crude oil extraction,
	with flamethrowers and laser turrets,
	could run indefinitely without maintenance.
	`,
	`
	@title Exploring the Generalized Collatz Problem
	@date 1677598875664
	@p
	@tags math js
	This morning I wondered what would happen if you replaced the coefficients in the
	<a href="https://en.wikipedia.org/wiki/Collatz_conjecture">Collatz problem</a> with others.
	So I wrote a quick program in JS to allow me to experiment with this.
	@p
	@tags math
	After some experimenting, I came across a really interesting variant:
	<ul>
		<li>Modulus: 5</li>
		<li>Formula for remainders:
		<ol>
			<li value="0">n &rarr; n/5</li>
			<li>n &rarr; 2n + 3</li>
			<li>n &rarr; 3n + 4</li>
			<li>n &rarr; 4n + 3</li>
			<li>n &rarr; 6n + 1</li>
		</ol>
		</li>
	</ul>
	This rule has four different positive cycles:
	<ul>
		<li>1 &harr; 5</li>
		<li>2 &harr; 10</li>
		<li>3 &harr; 15</li>
		<li>19 &rarr; 115 &rarr; 23 &rarr; 95 &rarr; 19</li>
	</ul>
	The distribution of which numbers falls into the cycles is interesting.
	Although most fall into the 1 cycle, quite a few fall into the 19 cycle.
	And although there are many stretches of integers that fall only into the 1 cycle,
	there are also a few stretches of integers which never fall into the 1 cycle, but instead fall into one of the others.
	For example, the range 90 to 95 inclusive all falls into 3 or 19,
	but that range is immediately preceded by a range of seven integers that all converge to 1.
	@p
	@tags math
	At this point you might just assume in all rules the majority of positive integers converge to 1.
	However, this is far from the truth. Consider:
	<ul>
		<li>Modulus: 3</li>
		<li>Formula for remainders:
		<ol>
			<li value="0">n &rarr; n/3</li>
			<li>n &rarr; 4n + 2</li>
			<li>n &rarr; 4n + 1</li>
		</ol>
		</li>
	</ul>
	This rule has two different positive cycles:
	<ul>
		<li>1 &rarr; 6 &rarr; 2 &rarr; 9 &rarr; 3 &rarr; 1</li>
		<li>7 &rarr; 30 &rarr; 10 &rarr; 42 &rarr; 14 &rarr; 57 &rarr;
		19 &rarr; 78 &rarr; 26 &rarr; 105 &rarr; 35 &rarr; 141 &rarr;
		47 &rarr; 189 &rarr; 63 &rarr; 21 &rarr; 7</li>
	</ul>
	The majority of positive integers falls into the latter cycle.
	In fact, the fraction that do seems to only increase with the range of integers considered.
	The first four positive integers all fall into the first cycle,
	5/8 of the first eight do,
	8/16 of the first sixteen do,
	12/32 of the first thirty-two do,
	and 17/64 of the first sixty-four do.
	@p
	@tags math
	There is also this interesting rule that has three cycles and some paths I suspect go to infinity:
	<ul>
		<li>Modulus: 2</li>
		<li>Formula for remainders:
		<ol>
			<li value="0">n &rarr; n/2</li>
			<li>n &rarr; 5n + 1</li>
		</ol>
		</li>
	</ul>
	Cycles:
	<ul>
		<li>1 &rarr; 6 &rarr; 3 &rarr; 16 &rarr; 8 &rarr; 4 &rarr; 2 &rarr; 1</li>
		<li>13 &rarr; 66 &rarr; 33 &rarr; 166 &rarr; 83 &rarr; 416 &rarr; 208 &rarr; 104 &rarr; 52 &rarr; 26 &rarr; 13</li>
		<li>17 &rarr; 86 &rarr; 43 &rarr; 216 &rarr; 108 &rarr; 54 &rarr; 27 &rarr; 136 &rarr; 68 &rarr; 34 &rarr; 17</li>
		<li>7 &rarr; ... &rarr; &infin;</li>
		<li>21 &rarr; ... &rarr; &infin; (this appears to be distinct from the above path)</li>
		<li>??? Possibly others ??? </li>
	</ul>
	There seems to be a pattern with the 7 path - the remainder modulo 10 of terms is 8, then 9, then 6,
	then one pair of 3-6. The next time around, it becomes two pairs of 3-6. Then three, then four...
	The numbers only seem to get bigger.
	@p
	@tags math
	Here is a table of outcomes of Collatz-like rules
	(ie. b should be as small as possible to make an congruent to 0 mod 2):
	<table>
		<tr><th colspan=2 rowspan=2></th><th colspan=4>Divisor</th></tr>
		<tr>
			<th>2</th>
			<th>3</th>
			<th>4</th>
			<th>5</th>
		</tr>
		<tr>
			<th rowspan=4 style="transform:rotate(-90deg);">a in an+b</th>
			<th>2</th>
			<td>E</td>
			<td>{1, 2}</td>
			<td>{1}</td>
			<td>{1}</td>
		</tr>
		<tr>
			<th>3</th>
			<td><abbr title="Collatz Problem">{1}</abbr></td>
			<td>E</td>
			<td>{1, 2, 3}</td>
			<td>{1, 2}</td>
		</tr>
		<tr>
			<th>4</th>
			<td>E</td>
			<td>{1, 7}</td>
			<td>E</td>
			<td>{1, 2, 3, 4}</td>
		</tr>
		<tr>
			<th>5</th>
			<td>{1, 13, &infin;}</td>
			<td>{4, 8, &infin;}</td>
			<td>{1, 23}</td>
			<td>E</td>
		</tr>
	</table>
	<ul>
		<li>E = "everything is a 2-cycle of odds and their n-uples"</li>
	</ul>
	It is the behavior of the rules below the diagonal that is most interesting.
	@p
	@tags math
	Here is a table of outcomes of rules for n congruent to 1 mod 2:
	<table>
		<tr><th colspan=2 rowspan=2></th><th colspan=4>b in an+b</th></tr>
		<tr>
			<th>1</th>
			<th>3</th>
			<th>5</th>
			<th>7</th>
		</tr>
		<tr>
			<th rowspan=4 style="transform:rotate(-90deg);">a in an+b</th>
			<th>3</th>
			<td><abbr title="Collatz Problem">{1}</abbr></td>
			<td>{3}</td>
			<td>{1, 5, 19, 23}</td>
			<td>{5, 7}</td>
		</tr>
		<tr>
			<th>5</th>
			<td>{1, 13, &infin;}</td>
			<td>{1, 3, 39, 43, 51, 53, 61, &infin;}</td>
			<td>{5, 65, 85, &infin;}</td>
			<td>{1, 7, 9, 57, 91, &infin;}</td>
		</tr>
		<tr>
			<th>7</th>
			<td>{1, &infin;}</td>
			<td>{3, &infin;}</td>
			<td>{3, 5, 27 &infin;}</td>
			<td>{7, &infin;}</td>
		</tr>
		<tr>
			<th>9</th>
			<td>{&infin;}</td>
			<td>{&infin;}</td>
			<td>{&infin;}</td>
			<td>{1, &infin;}</td>
		</tr>
	</table>
	@p
	@tags math
	THE COOLEST RULE OF ALL
	<br><br>
	Maximum minimum (3419):
	Most finite positive cycles (33):
	<ul>
		<li>Modulus: 6</li>
		<li>Formula for remainders:
		<ol>
			<li value="0">n &rarr; n/6</li>
			<li>n &rarr; 37n + 5</li>
			<li>n &rarr; 5n + 2</li>
			<li>n &rarr; 7n + 3</li>
			<li>n &rarr; 5n + 4</li>
			<li>n &rarr; 7n + 13</li>
		</ol>
		</li>
	</ul>
	Cycle minima: {2, 4, 19, 27, 39, 77, 89, 181, 337, 367, 409, 451,
	577, 637, 697, 709, 727, 777, 811, 849, 997, 1129, 1137, 1147, 1367,
	1429, 1569, 1579, 2627, 2699, 2947, 2987, 3379, 3419, &infin;}
	<br><br>
	Minor modifications of this also lead to rules with many cycles.
	`,
	`
	@title C# Binge
	@date 1678111176704
	@p
	@tags dev c#
	Over the weekend I wrote a quick unit conversion utility in C#,
	and also created a calendar system based on the Metonic cycle with an application to convert
	between that system and the Gregorian calendar.
	@p
	@tags calendar
	The system is as follows:
	<ul>
		<li>Normal years have twelve months of 29 or 30 days.</li>
		<li>Even-indexed months (starting with 0) have 30 days, while odd-indexed months have 29.</li>
		<li>If the year mod 19 mod 4 is 0, the second month (index 1) has a leap day, totalling 30 days instead of 29.</li>
		<li>If the year mod 19 mod 3 is 0, there is a leap month at the end of the year.</li>
	</ul>
	This means each year has 354, 355, 384, or 385 days in a cycle repeating only every 19 years,
	with a cycle totalling 6940 days.
	I suppose to make it more precise, the leap day could have similar rules
	to how the Gregorian calendar doesn't have leap years when the year mod 400 is 100, 200, or 300.
	If so, our target would be to have an accuracy similar to the Gregorian calendar - an error of about one day per 3030 years.
	Since 19 tropical years is 6939.602 days,
	and since 235 synodic months is 6939.689 days,
	perhaps we could split the difference and say we're targetting about ~6939.6455.
	Well, that's pretty close to 6939.6r,
	so perhaps we can say that in the first 19-year cycle of three, the leap day is ignored.
	That would mean, in the same 3030-year period,
	this calendar would lose about 10.3 days wrt. the tropical year,
	and an error of about 3.6 days wrt. the synodic month.
	This is a bit more than I'd like,
	but we have to remember that no matter what we set the average cycle length to,
	the total error between the two is going to add to about 13.9 days.
	We could say "use 5 out of 8 cycles" (the next best), or 7 out of 11 cycles,
	9 out of 14, etc., but ultimately the error for one of them will be at least 7 days when rounded.
	Therefore, using the three-cycle rule seems sufficient - certainly better than a 63 day error without!
	`,
	`
	@title Eremoran Expansion Project: Month 2
	@date 1678457848993
	@p
	@tags eremoran site
	It's been exactly one month since my pledge to expand Eremoran at a rate of 4-5 words per day.
	Then, I apparently had 900 words.
	This morning (although I am yet to add new words) I have 1,085.
	This amounts to an average of 6.6 words per day, much more than my plan!
	I'm pleased to have made this a workable habit!
	`,
	`
	@title Uranian Moon Names
	@date 1678819743211
	@p
	@tags uranus
	Remembering that Uranian moons are named after characters of Shakespearean plays
	and characters in Alexander Pope's <cite>The Rape of the Lock</cite>,
	I set about trying to find what the most interesting or humorous potential moon names would be,
	and found eleven of interest:
	<ul>
		<li><strong>Dick</strong> - named after the character <em>Dick the Butcher</em> in <cite>Henry VI, Part 2</cite>,
			famous for the line <q>Let's kill all the lawyers</q>.</li>
		<li><strong>Jupiter</strong> - who has a single line in <cite>Cymbeline</cite>, Act V, Scene IV</li>
		<li><strong>Moth</strong> - one of two characters from <cite>Love's Labour's Lost</cite> or <cite>A Midsummer Night's Dream</cite></li>
		<li><strong>Mustardseed</strong> - a fairy in <cite>A Midsummer Night's Dream</cite></li>
		<li><strong>Orlando</strong> - of <cite>As You Like It</cite></li>
		<li><strong>Paris</strong> - characters of this name appear in three of Shakespeare's plays</li>
		<li><strong>Pinch</strong> - doctor in <cite>The Comedy of Errors</cite></li>
		<li><strong>Quickly</strong> - appears in four of Shakespeare's plays</li>
		<li><strong>Regan</strong> - of <cite>King Lear</cite></li>
		<li><strong>Rugby</strong> - servant to Caius in <cite>The Merry Wives of Windsor</cite></li>
		<li><strong>Silence</strong> - name of a judge who appears in Acts III and V of <cite>Henry IV, Part 2</cite></li>
	</ul>
	I doubt <em>Jupiter</em> would fly, but I wonder if the rest would be found acceptable by the IAU.
	Dick and Paris are already the names of asteroids, so that would be another hinderance.
	`,
	`
	@title Month-and-a-half Eremoran Expansion Update
	@date 1679682301927
	@p
	@tags eremoran
	It has been six weeks since I started adding new vocab.
	In that time, I have added 265 words,
	leading to an average of 6.3 words per day.
	I am currently on track to finish my goal likely sometime from September to November,
	by which time the dictionary size will be somewhere on the order of 2,200 words.
	@p
	@tags calendar eremoran
	I also had to tweak the Eremoran calendar yesterday,
	since I realized the axial precession rate for Oneia was much more than I anticipated -
	one complete precession would occur about once every 320 earth years,
	leading to a tropical year substantially shorter than a sideral year.
	So now leap days are determined as follows: if the year is odd or divisible by fifty, it is a leap year.
	@p
	@tags weather
	It went from 19F Sunday to 86F today.
	I guess I don't need a jacket anymore.
	I've had a headache all day; I wonder if it's related?
	`,
	`
	@title Eremoran Expansion Update Afterthought
	@date 1679929974475
	@tags eremoran
	It just occured to me: at the current rate I am expanding the vocab,
	I could easily have it done on Eremoran's sixth anniversary.
	Although I am not sure exactly when I first started developing it,
	I first published it on September 4th of 2017,
	so I suppose that's as good a time as any to celebrate its anniversary.
	`,
	`
	@title Math behind a Conscript
	@date 1680100237142
	@p
	@tags conlang math
	I recently read a <a href="https://footballbatsandmore.wordpress.com/">conlang blog</a>
	with an interesting writing system (Omyatloko).
	It appears to comprise glyphs of a certain form -
	taking a 3 by 3 square grid of vertices and drawing edges between some of the orthogonal vertices.
	It reminds me of <a href="https://commons.wikimedia.org/wiki/File:Genji_chapter_symbols_groupings_of_5_elements.svg">Genji chapter symbols</a>.
	I do not know if its creator calculated the number of possible glyphs,
	but I certainly have: since there are 12 vertices, there must be 2<sup>12</sup> = 4096 possible glyphs,
	or 1024 glyphs excluding rotations, or 512 excluding rotations and reflections.
	But more generally, for a glyph grid of size n:
	<ul>
		<li>Vertices: n<sup>2</sup></li>
		<li>Edges: 2n(n-1)</li>
		<li>Unique Glyphs: 2<sup>2n(n-1)</sup></li>
		<li>Unique Glyphs (excl. rotations): 2<sup>2n(n-1)-2</sup></li>
		<li>Unique Glyphs (excl. rotations and reflections): 2<sup>2n(n-1)-3</sup></li>
	</ul>
	@p
	The author has devised a method of organizing the glyphs by radical;
	however, an alternative could be to instead convert the state (on/off) of all the edges to binary, and then to decimal.
	For example, this glyph:
	<img src="https://imgur.com/cGHp4kd.png">
	could be transcribed (edges from top to bottom, left to right) 111010010000<sub>2</sub>, or 3728<sub>10</sub>.
	This system has the added bonus that, if you reverse the binary, you get the 180&deg; rotation of that glyph.
	@p
	The grammar document seems to imply about 1200 of these have already been assigned -
	If that is the case, there must be glyphs that are identical under rotation.
	Indeed, hama, kasu, yama, and tsila are one such group.
	@p
	There is one caveat: the bit about rotations is only true for blocky fonts.
	In calligraphy, stroke order would subtly change the appearance of, eg.,
	a <em>hama</em> glyph versus a rotated <em>kasu</em> glyph.
	@p
	Not only is this writing system aesthetic,
	It is also easy to write a script to render glyphs (at least, in a blocky form).
	I'm tempted to perhaps borrow this idea, perhaps in a modified form... :^)
	`,
	`
	@title Math behind a Conscript (Addendum)
	@date 1680200717469
	@p
	@tags conlang math
	I realized the figures I gave for rotationally/reflectionally unique glyphs I give
	<a href="blog.html?i=21#s0">here</a> are actually lower bounds that do not account for symmetrical glyphs.
	The actual values are 1044 and 570, instead of 1024 and 512.
	376 glyphs have two symmetries, 20 have four, and 4 have all eight.
	@p
	@tags math
	570 though is still much higher than the figure for a 2x2 square -
	excluding symmetries, there would only by 5 unique glyphs (6 including the empty glyph).
	@p
	@tags english orthography
	Anyways, I used the script I wrote to compute these figures to try to develop the "ultimate" English orthography.
	One with completely distinct glyphs, with difficulty of writing the glyphs proportional to their phonemic frequency
	(which I use <a href="https://cmloegcmluin.wordpress.com/2012/11/10/relative-frequencies-of-english-phonemes/">this</a> as a source for).
	<img src="../img/eo2.png">
	Here is how I would transcribe "Mocha":
	<img src="../img/eo2_mocha.png">
	`,
	`
	@title Random Eremoran Expansion Update
	@date 1680622654847
	@tags eremoran
	The past two days I added an absolute ton of words to Eremoran,
	and also clarified some points and fixed some minor discrepancies.
	At this point, I've now been averaging over 7 new words per day (375 words in 53 days) -
	a feat I am quite happy with!
	`,
	`
	@title Unit Autoconversion Script
	@date 1681139692647
	@tags js
	I wrote a script to automatically do the unit conversion &lt;abbr> tags for me.
	It even does human heights properly (ie. writing it like 5&prime; 6&Prime; instead of 5.5 ft).
	Literally all I have to do is place this at the start of the page:
	<code>&lt;script src="../tools/autoconvert.js" defer>&lt;/script></code>
	And then use this class in the HTML:
	<code>&lt;span class="autoconvert-u">19 cm&lt;span></code>
	And the code will automatically change that HTML to this:
	<code>&lt;span class="autoconvert-c">&lt;abbr title="7 in">19 cm&lt;abbr>&lt;span></code>
	Pretty convenient, eh?
	`,
	`
	@title NYT Digits Solver
	@date 1681308919560
	@tags site js math
	Today the New York Times released a new math puzzle called <a href="https://www.nytimes.com/games/digits">Digits</a>.
	It was therefore inevitable that I made a tool to solve this puzzle:
	<a href="../tools/nytDigits.html">nytDigits solver</a>
	`,
	`
	@title Eremoran Expansion Project: Month 4
	@date 1683641647117
	@p
	@tags eremoran site
	It's been almost three months since my pledge to expand Eremoran at a rate of 4-5 words per day.
	Then, I had 900 words.
	Currently, I have 1,530.
	This amounts to an average of 7.1 words per day, or 50 words per week,
	putting me on track for reaching my goal in another three months.
	I am about halfway there already!
	@p
	@tags site js japanese
	Since my last post, I have created three new tools:
	a <a href="../tools/shuggerlainBattle.html">Shuggerlain battle optimizer</a>,
	an <a href="../tools/etym.html">Etymology guesser</a> for taxon names,
	and a <a href="../tools/jp.html">Japanese study tool</a> to help me remember vocabulary.
	@p
	@tags duolingo japanese
	Out of frustration with Duolingo's increasingly worse design, I have abandoned it,
	after over 10 years of usage, including a 1279-day streak and 80 weeks in Diamond league.
	It was a difficult decision that was the culmination of repeated frustration with
	Duolingo redesigns progressively removing features from the course.
	It has come to the point where the frustration of dealing with Duolingo nonsense tainted my enjoyment of learning Japanese.
	So - I abandoned it.
	I will be experimenting with several platforms - Lingodeer, Clozemaster, and Anki -
	to see if any are a viable replacement, or if I'm better off studying alone.
	`,
	`
	@title Eremoran Expansion Project: Three-and-a-Half Month Update
	@date 1685460440778
	@tags eremoran site
	It's been about 3.5 months since my pledge to expand Eremoran at a rate of 4-5 words per day.
	Then, I had 900 words.
	Currently, I have 1,685.
	This amounts to an average of 7.2 words per day, or 50 words per week,
	putting me on track for reaching my goal in another two months - August 4th, to be specific.
	Even if it takes me longer than usual to come up with vocab, I expect to finish in August or September.
	Last week I added quite a few herbs and spices, and today I added several flowers and birds.
	I will probably continue adding birds for a while.
	I even created a new bird category, which currently has 29 entries.
	`,
	`
	@title EU4 and Plums
	@date 1686064362944
	@p
	@tags eu4
	I've been playing Majapahit in EU4 the past few days.
	Even though I haven't played EU4 in ages, I seem to still be managing pretty well.
	It's currently 1535 ingame and I just finished conquering the last of Indonesia.
	I'm not sure where to expand further, but I tried Taiwan and Wu since Ming exploded,
	and got Taiwan and a few port provinces.
	@p
	@tags botany
	I recently discovered the mysterious fruit trees outside my office are chinese plums (prunus mume).
	They are likely safe for consumption, but I'm not taking any chances.
	@p
	@tags weather news ukraine
	I like recording little snippets of the current climate (both literal and otherwise) here,
	because they are fun to look back on.
	The weather lately has been fairly nice, staying in the 70s much of the day, often cloudy or clear.
	In terms of news, early this morning, a dam was blown up in Ukraine.
	Yesterday, it was reported Ukraine began a counteroffensive.
	Three days ago, there was a major rail accident in India, with >200 deaths and >900 injuries.
	The latest on that is that it is a suspected signal failure.
	@p
	@tags news 2024_election
	Over the past month or so, several more Republican candidates have started campaigning,
	including Pence and Chris Christie.
	I honestly don't know why they even bother - this is clearly a race between Trump and DeSantis.
	Perhaps there will be a surge for someone like Nikki Haley or Tim Scott,
	but last I checked, the polling for these other Republicans has been pathetic at best.
	Did Chris Christie ever regularly poll much past, say, 1-2% in 2016? I doubt it.
	Florida has been steadily growing fashier.
	If DeSantis actually wins the presidency, I may quite literally have to flee the country.
	`,
	`
	@title Eremoran Expansion Project: Four Month Update
	@date 1686314956562
	@tags eremoran site
	It's been about 4 months since my pledge to expand Eremoran at a rate of 4-5 words per day.
	Then, I had 900 words.
	Currently, I have 1,770 - nearly double!
	This amounts to an average of 7.3 words per day, or 51 words per week,
	putting me on track for reaching my goal in under eight weeks.
	Recently I have been adding vocabulary for birds, fish, and bugs.
	I expect to finish in early August - September at the latest.
	`,
	`
	@title Subtle but Unfortunate Misnomers
	@date 1688672359277
	@tags language
	Here I have compiled a list of terms that, in my opinion, don't make sense.
	I am deliberately excluding well-documented misnomers like "french dip" (a Californian invention),
	metaphors like "purple state" (which is not a state aligning to a hypothetical "purple party", but rather a "neutral" state),
	metonyms of any sort, such as "fly fishing" (which involves no real flies, but is named because it mimics flies),
	redundant formations like "ATM machine",
	or illogical syntax, such as the countable use of "DLC".
	Note also that I am not prescribing any linguistic change,
	but merely pointing out some counterintuitive word formations,
	along with providing hypothetical "logical" alternatives.
	<ol>
		<li><b>antisemitism</b> - is generally only applied to jews, not to any other semitic group.
		Should therefore be "antijudaism".</li>
		<li><b>caucasian</b> - generally applied to people and cultures with no ties to the Caucasus.
		Ironically, many Caucasians would not be considered caucasian by American standards.
		The common synonym "white" is (slightly) more logical,
		although ideally one would avoid this outdated and arbitrary racial classification system entirely.</li>
		<li>(math) <b>closed & open</b> - unlike in literally any other context, in math, these are not mutually exclusive.
		Unfortunately, there are no obvious replacements - perhaps "limit-containing" and "limit-bounded", respectively?</li>
		<li><b>copyright</b> - on its surface, appears to indicate one's right to copy.
		In actuality, it is the opposite.
		"Intellectual property rights" or the less obvious but shorter "uncopiability" may be suitable alternatives.</li>
		<li>(American politics) <b>democrat & republican</b> - if you know nothing of American politics, you would assume
		democrats are anti-republic and pro-democracy, and republicans are ant-democracy and pro-republic.
		Snide comments aside, both largely support the continuance of the current system of power investiture (ie., a democratic republic).
		Many other countries use the more logical naming of "liberal" and "conservative", respectively, for similar parties,
		although "liberal" has its own problems.
		If it were up to me, though, I would either choose the existing "left-right" terminology,
		or invent a new meaning for "evolutionary" or "mutational" to contrast with "conservative".
		Don't even get me started on the backwards colors...</li>
		<li><b>preferred pronoun</b> - an unfortunate continuance of the same trivializing anti-queer attitudes that spawned terms like "sexual preference".
		Thankfully, the simple "pronoun" alone is already gaining ground without any prescriptivist intervention.
		If further specificity is somehow required, perhaps "identifying pronoun" would be a good fit.</li>
		<li><b>quiet quitting</b> - not even remotely quitting. It is quiet, though. A better term might be "jaded compliance".</li>
		<li><b>social distancing</b> - on the surface, appears to contrast with physical distancing - yet the two are one and the same.
		Perhaps a better alternative would be something like "hygienic distancing".</li>
	</ol>
	I don't see these talked about often. I guess most folks just take these terms for granted.
	`,
	`
	@title Eremoran Expansion Project: Five Month Update
	@date 1689003152776
	@tags eremoran site
	It's been 5 months since my pledge to expand Eremoran at a rate of 4-5 words per day.
	Then, I had 900 words.
	Currently, I have 1,970.
	This amounts to an average of 7.1 words per day, or 50 words per week,
	putting me on track for reaching my goal in four weeks.
	Thus, my next update will probably be the announcement of the completion of this project
	in early August.
	`,
	`
	@title The Progression of Time
	@date 1690331469945
	Why does everything feel half as old as it is?
	`,
	`
	@title The Future of Eremoran
	@date 1690810269367
	@p
	@tags eremoran site
	A couple weeks ago I stopped updating Eremoran vocabulary and instead focused on a new code project -
	a text adventure life simulation.
	Although I'm <i>technically</i> 200 words away from my original goal...
	I feel being 90% of the way there is close enough.
	When I return to Namei, I will probably focus on Eremoran's descendants after a millennium of evolution.
	@p
	@tags c# dev
	So, the game I've been working on.
	It's actually semi-playable now, although there isn't much to play with.
	I think before I release a public alpha, I need to add more events,
	missions, and more locations outside the city.
	Ideally, I would also like to create an interface for modders to create their own events and missions.
	The game already has support for modding in new NPCs, locations, and items,
	and I think event and mission mods would REALLY increase the replayability potential.
	I'm also thinking about using SadConsole again for this project,
	and maybe having an actual interface alongside the text console,
	but I'm not sure about that yet.
	@p
	@tags c# dev
	The NPCs in this game feel very solid.
	I can throw potions at them and have them be affected,
	they have opinions of the player that change through actions,
	and they move around on a "schedule" as if they're actually being controlled by another player.
	I've tried to make it so anything the player can do, NPCs can do, and vice versa.
	So far I've been making the game take place in a society like today,
	but I've been considering changing the setting to a post-scarcity near future.
	Oh well, more stuff to think about.
	@p
	@tags news 2024_election
	Alright, now a little snapshot of the present news to reflect on in the future.
	DeSantis's polling has been falling, and Kennedy's polling has been rising.
	At this point, Biden vs. Kennedy polls and Trump vs. DeSantis polls look like mirrors of each other -
	they both seem to be hovering around 55% vs. 15%.
	Sadly, Williamson is hovering around 6% and doesn't currently seem to have much of a chance.
	I tried to think if there are any republicans I would even consider voting for.
	But no, after researching every minor candidate, <i>literally every last one</i> is anti-LGBT.
	So, I think the flowchart for how I'll end up voting in 2024 will look like this:
	<br><br>
	<b>*</b> &rarr; Who is the Democratic nominee?
	<ul>
		<li><b>Williamson</b> &rarr; vote Dem.</li>
		<li><b>Biden</b> &rarr; Is my state projected to be a close vote? (Likely)
			<ul>
				<li><b>Yes</b> &rarr; vote Dem.</li>
				<li><b>No</b> &rarr; vote Green.</li>
			</ul>
		</li>
		<li><b>Kennedy</b> &rarr; vote Green.</li>
	</ul>
	Alternatively, if a left-wing (or at this point, even a centrist) third-party candidate seems to be gaining traction,
	I might take the risk and vote for them.
	`,
	// https://penelope.uchicago.edu/Thayer/e/roman/texts/apicius/home.html
	`
	@title Ancient Cuisine
	@date 1691515988714
	@tags cooking history
	Today I read Apicius' <cite>De re culinaria</cite> to see the methods and ingredients used in ancient cuisine.
	The book's recipes can be summarized as follows:
	<q>To cook [ingredient], boil it. Season with pepper and laserwort.</q>
	No, literally - out of the hundred-plus vegetable recipes, almost all are boiled,
	except a few that resemble salads, and even many of the meat-based dishes are boiled.
	@p
	That said, I want to take note of ingredient usage:
	<ul>
		<li>Almonds - 1 recipe</li>
		<li>Brain (unspecified) - 2 recipes</li>
		<li>Breadcrumbs - 1 recipe</li>
		<li>Broth - 19 recipes</li>
		<li>Caraway - 1 recipe</li>
		<li>Cardamom - 1 recipe</li>
		<li>Celery - 1 recipe</li>
		<li>Celery seed - 1 recipe</li>
		<li>Cheese - 1 recipe</li>
		<li>Chicken - 3 recipes</li>
		<li>Citrus leaves - 1 recipe</li>
		<li>Coriander - 2 recipes</li>
		<li>Costmary - 1 recipe</li>
		<li>Crab - 2 recipes</li>
		<li>Cumin - 6 recipes</li>
		<li>Cuttlefish - 2 recipes</li>
		<li>Dates - 1 recipe</li>
		<li>Date stones - 1 recipe</li>
		<li>Date wine - 1 recipe</li>
		<li>Dill - 2 recipes</li>
		<li>Elecampane - 1 recipe</li>
		<li>Eggs - 4 recipes</li>
		<li>Egg yolk - 1 recipe</li>
		<li>Fennel - 1 recipe</li>
		<li>Fig Wine - 1 recipe</li>
		<li>Fruit (unspecified) - 1 recipe</li>
		<li>Garum - 1 recipe</li>
		<li>Ginger - 2 recipes</li>
		<li>Gravy - 2 recipes</li>
		<li>Honey - 15 recipes</li>
		<li>Laserwort / Laser / Silphium - 4 recipes</li>
		<li>Laurel - 3 recipes</li>
		<li>Laurel berries - 1 recipe</li>
		<li>Leaves (unspecified) - 1 recipe</li>
		<li>Leek - 4 recipes</li>
		<li>Lobster - 2 recipes</li>
		<li>Lovage - 11 recipes</li>
		<li>Malabar spinach - 1 recipe</li>
		<li>Mastic - 2 recipes</li>
		<li>Mint - 5 recipes</li>
		<li>Must - 3 recipes</li>
		<li>Mustard - 1 recipe (Mustard seed?)</li>
		<li>Myrtle berries - 1 recipe</li>
		<li>Nard - 2 recipes</li>
		<li>Nuts (unspecified) - 3 recipes (Prob. Almond or Walnut)</li>
		<li>Oil (unspecified) - 6 recipes (Olive oil?)</li>
		<li>Onion - 1 recipe</li>
		<li>Oregano - 2 recipes</li>
		<li>Oysters - 2 recipes</li>
		<li>Parsley - 4 recipes</li>
		<li>Pheasant - mentioned</li>
		<li>Pellitory - 1 recipe</li>
		<li>Pepper - 31 recipes (Black pepper?)</li>
		<li>Pheasant - 1 recipe</li>
		<li>Pine nuts - 7 recipes</li>
		<li>Pine, "raw ground" - 1 recipe</li>
		<li>Pork (unspecified) - 4 recipes</li>
		<li>Pork bacon - 1 recipe</li>
		<li>Pork intestines - 1 recipe</li>
		<li>Pork liver - 1 recipe</li>
		<li>Pork vulva - 1 recipe</li>
		<li>Quince Cider - 1 recipe</li>
		<li>Rabbit - mentioned</li>
		<li>Raisins - 2 recipes</li>
		<li>Raisin wine - 2 recipes</li>
		<li>Rice - 1 recipe</li>
		<li>Rice Flour - 1 recipe</li>
		<li>Rose Petals - 1 recipe</li>
		<li>Roux - 1 recipe</li>
		<li>Rue - 6 recipes</li>
		<li>Rush - 1 recipe</li>
		<li>Saffron - 2 recipes</li>
		<li>Salt - 2 recipes</li>
		<li>Saltpeter - 1 recipe</li>
		<li>Satury - 1 recipe</li>
		<li>Savory - 1 recipe</li>
		<li>"Sea Onion" - 1 recipe</li>
		<li>Scallops - 2 recipes</li>
		<li>Spelt - 4 recipes</li>
		<li>Squid - 1 recipe</li>
		<li>Stock - 9 recipes</li>
		<li>Thyme - 1 recipe</li>
		<li>Vinegar - 7 recipes</li>
		<li>Violets - 1 recipe</li>
		<li>Water - 5 recipes</li>
		<li>Water, salt - 1 recipe</li>
		<li>Wine - 11 recipes</li>
		<li>Wheat, cream of - 1 recipe</li>
		<li>Wormwood - 1 recipe</li>
	</ul>
	So far I have only counted the instances in the first two books, but I plan to count the other recipes later.
	`,
	`
	@title The Death of Escapism
	@date 1695667681570
	@tags namei site dev meta transition
	Almost six weeks ago, my life underwent a massive shift.
	Colossal. Indescribably large.
	@p
	No longer do I have any urge to add to Namei,
	aside from minor additions stemming from fixing problems with preexisting content.
	@p
	(In terms of practical changes for this site:
	I will still update it, but very, very irregularly...)
	@p
	Moreover, my seemingly incessant desire to code something... <em>anything</em>...
	that has persisted for over a decade has also come to a halt.
	@p
	I didn't even notice until someone pointed it out to me.
	Strangely though, losing what have been core parts of my identity half my life hasn't bothered me at all.
	I was, however, baffled as to the cause.
	I mean, <em>other than the E</em>, of course :^).
	But after a month of thinking, it came to me.
	@p
	Escapism.
	I desperately wanted to leave my reality.
	No, <em>needed</em>.
	I created fantasy worlds so I wouldn't have to think of my own.
	Alternate history? Another Earth? Futurism?
	Didn't matter. Anything <em>but</em> here.
	@p
	I entered barely-conscious trances where my only reality was <em>code</em>.
	Where I would wake up, code for 16, 18, 20 hours, until I was so hungry I couldn't code anymore,
	so thirsty I couldn't code anymore, or so drowsy I couldn't code anymore.
	Then I would reluctantly take care of my body's bothersome <em>nagging</em>, but only <em>just enough</em> to keep me working.
	It didn't matter what I was making. It didn't matter if I would ever use it.
	It just had to give me enough of its own problems to distract me from my own.
	@p
	That sounds like self-torture, now that I write that down, but it didn't feel like it.
	<em>Reality</em> was self-torture.
	Now that I see clearly, <em>it was there</em>.
	Half my life, <em>it was there</em>.
	My need for escapism kept growing, and growing, and growing.
	@p
	Well, not anymore.
	I can't roll back the clock and relive my life how I always wanted,
	but I <em>can</em> forge a new path ahead.
	A good path. <em>My</em> good path.
	`,
	`
	@title Snapshot of the Present
	@date 1699979477371
	@tags news 2024_election
	Since it's been three and a half months since my previous snapshot, time to give an update for posterity.
	Since last time:
	<ul>
		<li>DeSantis's polling has continued to fall, but he is still #2 at ~14%</li>
		<li>Nikki Haley has surged somewhat in the polls, but is still at ~9%</li>
		<li>Ramaswamy has fallen to ~5%. Aside from Trump, no other candidate is polling above 5%.
			Additionally, Tim Scott dropped out two days ago.</li>
		<li>Kennedy is now running as in independent, and is polling slightly better in general election polls.</li>
		<li>Four-way general election polling: Trump 39%, Biden 37%, RFK Jr. 15%, Cornel West 4%.</li>
	</ul>
	@p
	The sheer number of people voting for third-party candidates this election year hasn't happened since Perot.
	In fact, in three-way polls, Kennedy polls significantly higher than Perot did in 1992 (I have seen values as high as 28%).
	A third-party candidate has never received such a large fraction of the vote since the 1912 election.
	@p
	Polling seems to suggest Kennedy's presence hurts Trump more than Biden, but only slightly. Normalized to 100%:
	<ul>
		<li>2-way: Trump: 50.61%; Biden: 49.39%</li>
		<li>3-way (w/ Kennedy): Trump: 41.54%; Biden: 42.83%; Kennedy 15.63%</li>
		<li>3-way (w/ West): Trump: 47.74%; Biden: 46.05%; West 6.21%</li>
		<li>4-way: Trump: 41.35%; Biden: 38.50%; Kennedy: 16.14%; West 4.01%</li>
	</ul>
	These ratios suggest Kennedy's support comes 58% from otherwise-Trump supporters and 42% from otherwise-Biden supporters.
	Similarly, West seems to be pulling 54% from Biden and 46% from Trump.
	@p
	General election polling for my state seems to lean fairly strongly in favor of Trump (avg +5),
	so I might end up voting for West as a protest candidate.
	`,
	`
	@title E, Calendars, Haley, Winter.
	@date 1705932486942
	@p
	I uploaded a Youtube video in the first time in over 1&frac12; years, although it is only 5 seconds long.
	I do plan on making longer education/rant style videos later this year, but we'll have to see.
	@p
	@tags site js dev
	I created several calendrical tools for the Eremoran, Gregrorian, and "Mocha Lunisolar" calendars.
	They're useful enough for me to reference them myself in day-to-day activities.
	@p
	@tags news 2024_election
	Since it's been two months since my previous snapshot, time to give an update for posterity.
	Since last time:
	<ul>
		<li>DeSantis, Ramaswamy, and every other relevant republican challenger to Trump has dropped out. Except...</li>
		<li>...Nikki Haley, polling nationally at 12%, and in New Hampshire at a significant 36%.</li>
	</ul>
	It is quite possible by the time I can vote in this primary, there will be no choices left to vote for.
	<br><br>
	An update on 3/4-way race figures:
	<ul>
		<li>2-way: Trump: 51.10%; Biden: 48.90%</li>
		<li>3-way (w/ Kennedy): Trump: 41.39%; Biden: 37.31%; Kennedy 21.30%</li>
	</ul>
	I can't seem to find figures with just West anymore, but he has been polling around 2%.
	@p
	@tags weather
	I found this morning the recent January frost clawing at my cheeks.
	The sun once again rises on my morning commute, rather than after.
	@p
	I once more took up journalling after a nearly 4-year hiatus.
	`,
	`
	@title What's in a Name?
	@date 1706533200000
	@tags transition
	I am changing my name. I am certain of my first name (Luna).
	Although I don't care for middle names, for logistical/bureaucratic reasons it is evident I will need one.
	Some options I have thought of:
	<ul>
	<li>Luna <b>Celestia</b> - Luna's complement in FiM</li>
		<li>Luna <b>Cynthia Selene</b> - two Greek names for the moon</li>
		<li>Luna <b>Lilith</b> - although this goes against my personal ban on abrahamic names, <em>Lilith</em> is just so badass.</li>
		<li>Luna <b>Molly</b> - after probably my favorite book protagonist growing up, Molly Moon.
			That universe was one of the early targets of my "dysphoria-escapist" desires.
			Bonus: her last name is <em>literally</em> Moon.</li>
		<li>Luna <b>Sapphira</b> - one of my original top first name choices -
			named after an old friend. Alternates: Alyssa, Emily, Emma, Mallory, Xanthe.</li>
		<li>Luna <b>Sappho</b> - the OG lesbian</li>
		<li>Luna <b>Victoria</b> - I mean, I do like playing Vicky...</li>
		<li>Luna <b>[Another Latin name]</b><ul>
			<li>Luna <b>Nox</b> - night</li>
			</ul></li>
		<li>Luna <b>[Eremoran name]</b> - this would certainly be reflective of myself.
			Unfortunately, Eremoran names aren't really phonoaesthetic in English,
			eg. <em>Siardor</em> or <em>Erekaflar</em>.
			Humorously, <em>Tranzfemar</em> would be a valid dithetmatic name - it means <em>hidden rose</em>.</li>
		<li>Luna <b>[Galilean Moon]</b> - unfortunately,<ul>
			<li>Luna <b>Io</b> - to modern English phonoaesthetics, -o names are masculine.</li>
			<li>Luna <b>Europa</b> - not gonna share names with a continent, sorry.</li>
			<li>Luna <b>Ganymede</b> - male name.</li>
			<li>Luna <b>Callisto</b> - ditto Io.</li>
			</ul></li>
		<li>Luna <b>[Tolkien Elvish name]</b> - although I don't associate much with LotR, elvish names are aesthetic, and would add a worldbuilding component to my name's meaning personally relevant to me:<ul>
			<li>Luna <b>Galadriel</b> - badass elf bitch</li>
			</ul></li>
	</ul>
	Clearly, I have a lot to decide.
	`,
	`
	@title Why does the world suck?
	@date 1706897495393
	@tags news
	<em>These days</em>, news is depressing.
	The future feels uncertain.
	I keep wildly vacillating between bouts of euphoria from achieving personal goals,
	to downness about my future.
	@p
	Thankfully, <em>these days</em>, my mind has the courage to fight back.
	I am weakened in some ways, but strengthened in others.
	I can now see my victory.
	To achieve it I need only to start at the end and work back.
	@p
	I have learned to stop caring about what I may and may not do,
	and focus instead on what I can and cannot do.
	<em>I</em> will not be stopped.
	<em>I</em> will happen.
	`,
	`
	@title Reborn
	@date 1708375346864
	@tags transition
	I can be happy now.
	Laughter comes so easily.
	The world feels real again.
	I am so close to my dreams, and getting closer by the day.
	@p
	In some ways it feels like my life was paused for a decade.
	Like I've been forced to wait, and only now can I resume.
	Which sucks, but it's okay, because I'm almost there anyways.
	@p
	In other ways it feels like I was only born half a year ago,
	and I'm experiencing the world for the first time.
	I'm becoming aware of all sorts of things I never truly acknowledged or understood.
	@p
	When I look to the past, sometimes I laugh at my ignorance.
	Sometimes I cry for what could've been.
	Bewilderment at what took me so long.
	To realize. To take the first step. Anything.
	What I wouldn't give to have five minutes with my younger self.
	@p
	Tell her she's not crazy. Not a freak. Be herself.
	That it'll be hard. Very hard.
	But absolutely worth it.
	Every bit of pain and effort.
	@p
	That's all in the past, though.
	@p
	Now, if only I could get my mind to stop racing.
	I have so many things I want and need to do.
	So much to do, so much to do.
	`,
	`
	@title Return
	@date 1708617562761
	@tags transition
	Dear Corporeal Salesman,
	<br><br>
	I'd like to make a return.
	You accidentally shipped me the wrong model.
	<br><br>
	Sincerely,
	<br><br>
	Luna
	`,
	`
	@title Voice
	@date 1708979425604
	@tags transition
	I think I've officially given up on voice training guides.
	I tried for a year, made no progress, understood nothing, gave up,
	and tried a strategy of "throw shit at a wall and see what sticks"
	for six months, and...
	well, that strategy <i>actually sorta worked a bit</i>.
	I mean, my voice is still on the masc end of androgynous,
	but at least it's not <i>totally</i> masc!
	@p
	So I thought to myself, okay, maybe now that I've made progress,
	I'll understand all the jargon being thrown around.
	Nope.
	I guess like my brain is just wired wrong (aside from the obvious...).
	Sample clips of vocal dimensions ("weight", "resonance", "brightness", "radioactivity", ...)
	<b>all</b> straight-up sound like either just a difference in pitch,
	or absolutely no audible difference whatsoever.
	So it is no wonder guides never made sense to me.
	@p
	And then, of course, it doesn't help that it seems like different people use the same terms differently
	(or maybe this is my 'weight/resonance/etc-blindness'... who knows)
	@p
	I feel like I'm being gaslit that there is more to voice than pitch.
	I mean, I can tell male voices from female voices.
	I can tell there's <i>more</i> than just pitch to it.
	But I can't "hear" these other dimensions, no matter how hard I try.
	Pardon to bring mathematics into this, <i>but</i>...
	@p
	@tags math
	To my ears, it sounds like voice has a basis of two vectors:
	pitch, and this other indescribable quality.
	But (assuming I'm not just being gaslit by everyone else in the world, which is an assumption I'm gradually doubting more and more),
	this quality is <i>absolutely not</i> anything I've heard from guides.
	So the only reasonable explanation I can come up with is that I am just defective, broken,
	and my mind collapses dimensions others hear distinctly into a single other dimension.
	@p
	Anyways, I think I may permanently be stuck in a "masc androgynous" zone,
	which is pretty depressing.
	`,
	`
	@title Mental Disorder
	@date 1711481683504
	What would a world in which autism is the norm treat NTs?
	@p
	Allism. Symptoms:
	<ul class="list2">
		<li>Socially:
		<ul class="list2">
			<li>Pathological need to stare at interlocutor.</li>
			<li>Often asks pointless questions, or ones the subject already knows the answer to (subject may refer to such questions as "rhetorical" or "smalltalk").</li>
			<li>Difficulty socializing with non-allistic peers (often can only form relationships with other allistics).</li>
			<li>Tells unusual, illogical jokes.</li>
			<li>Highly sensitive to perceived changes (real or imagined) in pitch in interlocutor's voice; prone to irrational fits of anger over unexpected changes in interlocutor's pitch.</li>
			<li>Difficulty discussing interests in depth (eg. may only be able to discuss a topic for less than a minute rather than a few hours).</li>
			<li>Difficulty explaining topics clearly and effectively.</li>
			<li><a href="https://www.researchgate.net/publication/268143945_Ratings_of_Facial_Attractiveness_by_High-Functioning_Individuals_with_Autism">Judgier wrt. attractiveness</a>.</li>
		</ul>
		</li>
		<li>Differences in logic and thought processes:
		<ul class="list2">
			<li>Difficulty adhering to routines.</li>
			<li>Lack of awareness of or understanding of the ramifications of changes in routine.</li>
			<li>Prone to emotional decisionmaking; difficulty thinking rationally.</li>
			<li>Struggles working alone, requires group support to perform work normally.</li>
			<li>Inability to dedicate time and effort to interests (when compared to normal non-allistics).</li>
			<li><a href="https://newtsoda.tumblr.com/post/681610131808681984/there-has-been-a-lot-of-research-about-autistics">Lack of moral rigidity</a>.</li>
			<li><a href="https://www.psychologytoday.com/us/blog/the-fallible-mind/201708/why-advertising-falls-flat-in-individuals-autism">Susceptibility to advertising</a>.</li>
			<li><a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3606476/">Inferior abstract spatial reasoning</a>.</li>
			<li><a href="https://www.sciencedaily.com/releases/2009/06/090616121339.htm">Poor problem-solving</a>.</li>
			<li><a href="https://link.springer.com/article/10.1007/s10803-015-2518-2">Less creative</a>.</li>
		</ul>
		</li>
		<li>Sensory symptoms:
		<ul class="list2">
			<li>Lack of awareness of or sensitivity to environmental sensory stimuli (light, noise, etc.).</li>
			<li>Inability to perceive unusual tastes or textures in food.</li>
		</ul>
		</li>
	</ul>
	`,
	`
	@title Vote
	@date 1729369222230
	@tags 2024_election
	To give an election update, since I haven't in a while: I voted yesterday.
	The line at the polling place was the longest I've seen since 2016.
	Although I have hope Harris will win NC, I suspect Trump will still win the election as a whole.
	Before early voting results were available, I did some quick napkin math and found these approximate odds:
	<ul>
		<li>55.5% Harris</li>
		<li>42.2% Trump</li>
		<li>2.3% EV Tie</li>
	</ul>
	Based on current early voting data though, I actually think Trump's odds are much higher,
	much higher than even on the betting odds website - something like 70%, again, based on napkin math - and a near-zero chance of a tie.
	That said, because I love chaos, I'm hoping for this map:
	<img src="https://i.imgur.com/l088nsQ.png"/>
	Which 538 currently suggests has about a (0.52)(0.37)(0.51)(0.47)(0.5)(0.42)(0.63) ~ <strong>0.61% (1 in 164)</strong> chance of happening.
	This actually agrees with 538's modal outcome except in AZ, MI, and NC.
	538's modal outcome is 281-257 in favor of Trump with odds of (0.52)(0.63)(0.51)(0.53)(0.58)(0.63)(0.5) ~ <strong>1.62% (1 in 62)</strong>.

	@p
	There are two other probable tie outcomes:
	<ul>
		<li>The same, but with NC and GA swapped: (0.52)(0.37)(0.51)(0.47)(0.5)(0.58)(0.37) ~ <strong>0.49% (1 in 202)</strong></li>
		<li>The same, but with GA, WI, and NV swapped: (0.52)(0.37)(0.51)(0.47)(0.5)(0.58)(0.37) ~ <strong>0.32% (1 in 315)</strong></li>
	</ul>
	The total chance of a tie is not much more than the sum of these three odds: <strong>1.42% (1 in 70)</strong>.
	`,
	`
	@title Motherload
	@date 1738512686099
	@tags flash
	After decompiling the flash game <cite>Motherload</cite> to learn its world generation, I found the following information:
	<br><br>
	Ore Distribution (determined computationally)
	<iframe width="700" height="422" seamless frameborder="0" scrolling="no" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vSYsvUZTjG7dMOJKNA2F5fJACsMuD60uXMT0eUBv9kr18v10V2xAirCaoz86_p15nW28Io5c47G49sX/pubchart?oid=270808293&amp;format=interactive"></iframe>

	Avg. Value of Tile Row (determined computationally)
	<iframe width="700" height="422" seamless frameborder="0" scrolling="no" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vSYsvUZTjG7dMOJKNA2F5fJACsMuD60uXMT0eUBv9kr18v10V2xAirCaoz86_p15nW28Io5c47G49sX/pubchart?oid=1064456251&amp;format=interactive"></iframe>

	Ore Distribution (determined mathematically)
	<iframe width="700" height="422" seamless frameborder="0" scrolling="no" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vSYsvUZTjG7dMOJKNA2F5fJACsMuD60uXMT0eUBv9kr18v10V2xAirCaoz86_p15nW28Io5c47G49sX/pubchart?oid=1116954098&amp;format=interactive"></iframe>

	Avg. Value of Tile Row (determined mathematically)
	<iframe width="700" height="422" seamless frameborder="0" scrolling="no" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vSYsvUZTjG7dMOJKNA2F5fJACsMuD60uXMT0eUBv9kr18v10V2xAirCaoz86_p15nW28Io5c47G49sX/pubchart?oid=777561049&amp;format=interactive"></iframe>

	@p
	Some worldgen observations:
	<ul class="list2">
		<li>Apparently "cave generation" is just randomly erasing 1/3 of tiles after generation. It sure seems like a lot less, but after some in-game verification it indeed appears about 1/3 of tiles are empty, and the distribution is random.</li>
		<li>Interestingly, even though Ironium is always rarer than Bronzium, Bronzium is worth twice as much. This apparent bug is due to ore generation being split into tiers - Bronzium cannot appear in the third ore generation tier, and Ironium cannot appear in the first or second ore generation tiers, because the tier bonus is added AFTER generating the random integer in the range, rather than being added to the range.</li>
		<li>Generation of "treasures" is uniform throughout the applicable range (below 1,000 ft.), and the four treasure types are equally distributed.</li>
		<li>The world is evenly divided into ranges, where in a particular range, ore tiers 0..n generate equally often, the n+1-th tier is 5 times rarer, and the n+2-th tier is 25 times rarer.</li>
	</ul>

	@p
	Some code observations:
	<ul class="list2">
		<li>Internally, gas traps are called "l".</li>
		<li>Internally, the rewards you get at the end of the game use the same structure as ores.</li>
		<li>There is a debug item that teleports you to the core of the planet, with a price of $1, and is bound to the 0 key. However, in normal gameplay, it is, of course, unobtainable.</li>
		<li>The silver-tier drill is called <em>Silvide</em> instead of <em>Silverium</em> like the other upgrades.</li>
		<li>The dropship remains just offscreen after dropping you off, and is therefore rendered the whole game (not that it matters much).</li>
		<li>
			Gas trap damage is calculated: <code>floor((depth + 3000) / 15) * cooling</code> <!-- 962 -->
			Cooling tiers have the following values: <code>1, 0.9, 0.75, 0.6, 0.4, 0.2</code>
			HP tiers have the following values: <code>10, 17, 30, 50, 80, 120, 180</code>
			Since gas pockets only appear at a depth of 5,000 ft and below (until, of course, 7,350 ft), <strong>they deal at least 106.6 damage, and will therefore one-shot you unless you have one of the highest two hull tiers and the highest cooling tier</strong>.
		</li>
		<li>Even though the game's story takes place on Mars, Mars is called "Earth" internally.
		<li>When typed anywhere ingame, the following cheat codes have the following effects:
			<ul class="list2">
				<li>blingbling - gives player $100,000</li>
				<li>penetrable - upgrade hull by one tier</li>
				<li>digdug - upgrade drill by one tier</li>
				<li>warp9 - upgrade engine by one tier</li>
				<li>guzzle - upgrade fuel tank by one tier</li>
				<li>toocool - upgrade radiator by one tier</li>
				<li>supersize - upgrade storage bay by one tier</li>
				<li>fillerup - refuel completely</li>
				<li>ntouchable - max hp, upgrades, and 99 of each item</li>
			</ul>
			Some of these you'll need to be in a menu or the pause screen to type properly, otherwise it will trigger a hotkey and reset the code.
			The game will say "Sorry, cheaters can't save." if you attempt to save - however, due to a bug, the code appears to save the game anyways.
			Since the login service is long dead, I have no way of verifying this, but it would be pretty funny if it's true.
		</li>
		<li>
			The game attempts to encrypt certain data (eg. submitting scores), but the "encryption" is just taking the string and xor'ing every character by ñ (char code 241)...
			so you can just xor it by ñ again to get the original string.
			The save data is an array (of the below values) turned into a comma-separated string, and put through this "encryption".
			<code>
			[0]	score<br>
			[1] cash<br>
			[2] scoreBillion (see note below)<br>
			[3] lvl<br>
			[4] hp<br>
			[5] fuel (if fuel is 0, saves "1" instead)<br>
			[6] hull tier<br>
			[7] drill tier<br>
			[8] engine tier<br>
			[9] fuel tank tier<br>
			[10] radiator tier<br>
			[11] storage bay tier<br>
			[12] to [21] storage bay contents<br>
			[22] to [28] consumable items<br>
			[29] lastTransmission (ie. max depth)<br>
			[30] playTime<br>
			[31] totalPlayTime
			</code>
			scoreBillion (unsure why this is separated, but I suspect it is to prevent players from just padding the begining of the string with random characters to increase score)
		</li>
		<li>Your username and password are sent unencrypted(!!!) but not your save data.</li>
	</ul>

	@p
	Did you know higher-tier ores are also heavier, taking more cargo space?
	Every ore above Silverium is denser than the last.
	As for value density, more valuable ores are always more value-dense as well (which isn't terribly surprising, but I figure it'd be worth a check).

	The code used to generate the first two graphs is available at
	<a href="../tools/motherload.html">https://mocha2007.github.io/tools/motherload</a>.
	`,
	`
	@title Random Flash Decompilation Observations
	@date 1738520765488
	@tags flash
	<ul class="list2">
		<li>"Steve" from <cite>The Sea Has No Claim</cite> wanders the map randomly, and doesn't have any particular advantage over "Wandering Boats"</li>
		<li>In <cite>Corporation Incorporated</cite>, four names - Quinn, Reagan, Reese, and Riley - have spaces at their beginnings.</li>
		<li><a href="https://docs.google.com/spreadsheets/d/1YQdaQTZyQgu52AhT1VxMrMC7H-dX1d0m3G_RbqVSeQw/edit?usp=sharing">Age of Empires unit stats</a></li>
	</ul>
	`,
	`
	@title Generating Colorblind-friendly Color Palettes
	@date 1741082724928
	@tags dev js math
	I needed to create a color map to visualize the values in <a href="../tools/goods.html">goods.js</a>.
	My first attempt made it difficult even for me (someone who's very much not colorblind) to tell points off,
	which means it would probably be <em>doubly</em> difficult for someone who <em>is</em> colorblind.
	So after some searching I found a simple color mapping, sampled some points on it and fit it to a cubic and then called it a day.
	But then I wondered if I could create my <em>own</em> colorblind-friendly color palette.
	Or, better yet, have a program randomly generate them for me.
	I went through a lot of failed ideas but eventually I came up with this:
	@p
	We need a color scale with monotonically increasing perceptual brightness.
	Ideally, the brightness increases will be equally spaced along the scale.
	Human eyes are most sensitive to green light, followed by red light, and then blue light.
	<a href="https://stackoverflow.com/a/596243">Stack Overflow</a> gives the following formula to calculate this:
	<code>0.2126*R + 0.7152*G + 0.0722*B</code>
	We are representing each color channel as a cubic polynomial f(x), with x in [0, 1] and f(x) in [0, 255] (you will see later why we're using cubics).
	<code>f(x) = a x^3 + b x^2 + c x + d</code>
	Due to our brightness constraint, f(0) = 0 and f(1) = 255 for all channels.
	This requires that d = 0 and a + b + c + d = 255
	So we can therefore simplify our cubics to this:
	<code>f(x) = a x^3 + b x^2 + (255 - a - b) x</code>
	It may seem like we can now just plug in whatever values for a and b we want, but there's a catch:
	not all combinations of a and b will result in a function that outputs numbers strictly in [0, 255].
	As an example:
	<code>f(x) = -128 x^3 + 383 x</code>
	This has a maximum at:
	<code>(sqrt(2298)/48, 383sqrt(2298)/72) ~ (0.999, 255.007)</code>
	But how can we prevent generating cubics that produce values outside our range?
	Well, the simplest way would be to ensure they are monotonically increasing, which ensures our local extrema must be at the bounds of our range -
	which we have defined to be 0 and 1 anyways.
	If a cubic is monotonically increasing, its derivative must not have any roots:
	<code>f'(x) = 3a x^2 + 2b x + (255 - a - b) ≠ 0 </code>
	Since its derivative is a quadratic, that means the determinant of the derivative must be negative:
	<code>(2b)^2 - 4*(3a)*(255 - a - b) < 0</code>
	<code>b^2 - 765a + 3a^2 + 3ab < 0</code>
	This is a quadratic in b. Since the quadratic coefficient is positive (1), for this inequality to be true, b must lie between the two roots of this polynomial.
	<code>b^2 + 3ab + (3a^2 - 765a) < 0</code>
	<code>roots = (-3a ± sqrt((3a)^2 - 4*1*(3a^2 - 765a)))/(2*1)</code>
	<code>roots = (-3a ± sqrt(-3a^2 + 3060a))/2</code>
	<code>(-3a - sqrt(-3a^2 + 3060a))/2 ≤ b ≤ (-3a + sqrt(-3a^2 + 3060a))/2</code>
	Since we need to actually have roots, this imposes a new constraint on a:
	<code>0 ≤ -3a^2 + 3060a</code>
	<code>0 ≤ a ≤ 1020</code>
	We simply generate random a, b for the red and blue channels, and derive the green channel from these.
	(Since the perceptual brightness function weights green so heavily, we need to derive green from red and blue to ensure the green cubic can satisfy these constraints).
	@p
	I have implemented this in <a href="https://github.com/Mocha2007/mocha2007.github.io/blob/master/tools/gradienttest.js#L170">gradienttest.js</a>,
	And you can fiddle around with it on <a href="../tools/gradient_test.html">gradient_test.html</a> in the console using
	<code>GRADIENT.random();</code>
	@p
	Some notes:
	<ul class="list2">
		<li>It would be much more difficult to compute these constraints with higher-degree polynomials, which is why we're sticking to cubics. They provide enough flexibility anyways.</li>
		<li>The exact color channel weights for the perceptual brightness formula don't necessarily matter for this algorithm, and you can swap them for other values if you want.</li>
		<li>In case you need to know the implied bounds on b and c: 0 ≤ c ≤ 1020, and -510 sqrt(3) - 765 ≤ b ≤ 510 sqrt(3) - 765 (appx. -1648 ≤ b ≤ 68)</li>
	</ul>
	You can play around with the color curve solution space in Desmos:
	<iframe src="https://www.desmos.com/calculator/yf4lnarpyr?embed" width="700" height="700" style="border: 1px solid #ccc" frameborder=0></iframe>
	You can also play around with the color curves in this desmos graph:
	<iframe src="https://www.desmos.com/calculator/n7fj6lvvo0?embed" width="700" height="700" style="border: 1px solid #ccc" frameborder=0></iframe>
	`,
	`
	@title Polynomial Root Probabilities
	@date 1741116360799
	@tags math
	I computed the approximate probability of a polynomial of a given degree having a certain number of real roots (computationally),
	given that the coefficients are uniformly randomly chosen from [-1, 1]:
	<ol>
		<li>1: 100%</li>
		<li>0: 37.1863%, 2: 62.8137%</li>
		<li>1: 78.2289%, 3: 21.7711%</li>
		<li>0: 23.5942%, 2: 69.7628%, 4: 6.6430%</li>
	</ol>
	Since all polynomials in R can be expressed as a scaled version of these,
	this also applies to all polynomials in R.
	@p
	Now the question is... why these numbers specifically???
	`,
];