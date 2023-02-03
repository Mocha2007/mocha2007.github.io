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
];