class Prompt {
	constructor(answer, url, name, prompt){
		/** @type {Category} */
		this.answer = answer;
		/** @type {string} */
		this.url = url;
		/** @type {string} */
		this.name = name;
		/** @type {string} */
		this.prompt = prompt;
	}
}

class Category {
	static NULL = -1;
	// TEAS
	static TEA = 0;
	static TEA_BLACK = 1;
	static TEA_OOLONG = 2;
	static TEA_WHITE = 3;
	static TEA_YELLOW = 4;
	static TEA_GREEN = 5;
	static TEA_PUER = 6;
	// static TEA_RESERVED = 7;
	// WINES
	static WINE = 8;
	static WINE_WHITE = 9;
	static WINE_RED = 10;
	static WINE_CHAMPAGNE = 11;
	static is(a = Category.NULL, b = Category.NULL){
		switch (b){
			case Category.TEA:
				return Category.isTea(a);
			case Category.WINE:
				return Category.isWine(a);
			default:
				return a === b;
		}
	}
	static isTea(category = Category.NULL){
		return 0 <= category && category < 8;
	}
	static isWine(category = Category.NULL){
		return 8 <= category;
	}
}

const TOW = {
	elem: {
		button(label = '', onclick = () => {}){
			const e = document.createElement('span');
			e.classList.add('button');
			e.innerHTML = label;
			e.onclick = onclick;
			return e;
		},
		/** @type {HTMLDivElement} */
		endScreen: undefined,
		/** @type {HTMLDivElement} */
		endResult: undefined,
		/** @type {HTMLDivElement} */
		menu: undefined,
		/** @type {HTMLDivElement} */
		promptScreen: undefined,
		/** @type {HTMLQuoteElement} */
		quote: undefined,
		/** @type {HTMLDivElement} */
		resultScreen: undefined,
		/** @type {HTMLDivElement} */
		resultResult: undefined,
		/** @type {HTMLAnchorElement} */
		source: undefined,
	},
	prompts: [
		// WINES (25)
		new Prompt(
			Category.WINE_WHITE,
			'https://www.totalwine.com/wine/white-wine/pinot-grigiopinot-gris/tesoro-della-regina-pinot-grigio/p/110475750?s=1108&igrules=true',
			'Tesoro della Regina Pinot Grigio',
			'If you are into brilliant, bright flavors of green apple, citrus and minerality, search no more.'
		),
		new Prompt(
			Category.WINE_WHITE,
			'https://www.totalwine.com/wine/white-wine/sauvignon-blanc/bougrier-famille-sauvignon-blanc/p/243188750?s=1108&igrules=true',
			'Bougrier Vin De France Sauvignon Blanc, 2024',
			'Bright aromas of lemon, pear, and elderflower. Fresh acidity keeps the palate lifted, while a subtle herbal note on the finish adds complexity and depth. Clean, crisp, and food‑friendly.'
		),
		new Prompt(
			Category.WINE_WHITE,
			'https://www.totalwine.com/wine/white-wine/chardonnay/barrel-bell-buttery-chardonnay/p/2126259628?s=1108&igrules=true',
			'Barrel & Bell Buttery Chardonnay, 2023',
			'Clove and apple crumble are mounted on a frame of stony minerality with a lemon custard finish.'
		),
		new Prompt(
			Category.WINE_RED,
			'https://www.totalwine.com/wine/red-wine/pinot-noir/kudos-pinot-noir-willamette/p/107654750?s=1108&igrules=true',
			'Kudos Pinot Noir Willamette, 2023',
			'The aromatic duo of raspberries and herbs, which would make an excellent name for a musical act, perfectly accompanies the mouthwatering scent of a savory meat pie.'
		),
		new Prompt(
			Category.WINE_CHAMPAGNE,
			'https://www.totalwine.com/wine/champagne-sparkling-wine/prosecco/brut/la-vostra-prosecco/p/172976750?s=1108&igrules=true',
			'La Vostra Prosecco',
			'Peach and slight honey aromas become flavors on the palate, along with a nice green apple note that brightens. Approachable and round, with an easy-to-enjoy, smooth, bubbly texture.'
		),
		new Prompt(
			Category.WINE_WHITE,
			'https://www.totalwine.com/wine/white-wine/sauvignon-blanc/king-maui-marlborough-sauv-blanc/p/237134750?s=1108&igrules=true',
			'King Maui Marlborough Sauvignon Blanc, 2025',
			'Tropical and refreshing, showing dried mangoes, dried pineapple and some herbaceous notes. Light- to medium-bodied with juicy character. Laid-back and delicious...'
		),
		new Prompt(
			Category.WINE_RED,
			'https://www.totalwine.com/wine/red-wine/cabernet-sauvignon/ed-edmundo-cabernet-sauvignon/p/213639750?s=1108&igrules=true',
			'Ed Edmundo Cabernet Sauvignon, 2025',
			'Plush and elegant, with black cherry and milk chocolate ganache soothing the palate, offering a gentle, expressive richness.'
		),
		new Prompt(
			Category.WINE_RED,
			'https://www.totalwine.com/wine/red-wine/pinot-noir/caliveda-pinot-noir/p/347421750?s=1108&igrules=true',
			'Caliveda Pinot Noir',
			'Light aromas of raspberry jam, black currant and toasted oak are followed by luscious cherry, juicy plum, and vanilla flavors making this rich in unforgettable flavor and finesse'
		),
		new Prompt(
			Category.WINE_WHITE,
			'https://www.totalwine.com/wine/white-wine/chardonnay/lloyd-chardonnay-carneros/p/109285750?s=1108&igrules=true',
			'Lloyd Chardonnay Carneros, 2023',
			'Aromas of white chocolate, chopped nuts and buttered corn. Clove, too. It’s smoky, spicy and full-bodied with a creamy texture. Drink now.'
		),
		new Prompt(
			Category.WINE_RED,
			'https://www.totalwine.com/wine/red-wine/cabernet-sauvignon/1858-cabernet-sauvignon-paso/p/214578750?s=1108&igrules=true',
			'1858 by Caymus Vineyards Cabernet Sauvignon Paso Robles, 2023',
			'Juicy and expressive, this is packed with jammy strawberry and cherry, accented by clove and cedar. Rich and round, it leans into opulence while maintaining balance through spicy undertones.'
		),
		new Prompt(
			Category.WINE_RED,
			'https://www.totalwine.com/wine/red-wine/cabernet-sauvignon/unanime-cabernet-sauvignon/p/130007750?s=1108&igrules=true',
			'Unanime Cabernet Sauvignon, 2022',
			'Notes of mocha and roses billow from below, followed by an ethereal bouquet of Provençal herbs and hazelnut. Dried herbs prevail on the palate alongside hints of anise seed, peppercorn, and cedar...elegant tannins with a savory grip.'
		),
		new Prompt(
			Category.WINE_RED,
			'https://www.totalwine.com/wine/red-wine/cabernet-sauvignon/mina-mesa-cabernet-paso/p/194460750?s=1108&igrules=true',
			'Mina Mesa Paso Robles Cabernet Sauvignon',
			'Aromas of blackberries and ripe plums, enhanced by notes of tarragon and mocha. Intense, balanced flavors shine through in the lingering finish of concentrated red fruit with a hint of vanilla.'
		),
		new Prompt(
			Category.WINE_WHITE,
			'https://www.totalwine.com/wine/white-wine/sauvignon-blanc/olema-sauvignon-blanc/p/231443750?s=1108&igrules=true',
			'Olema Sauvignon Blanc, 2024',
			'Attractive lemon, green melon and ginseng aromas follow through to a medium body with crunchy fruit and a tangy finish.'
		),
		new Prompt(
			Category.WINE_RED,
			'https://www.totalwine.com/wine/red-wine/cabernet-sauvignon/opus-one/p/2126267408?s=1108&igrules=true',
			'Opus One, 2022',
			'The aromas are high-toned with cassis and graphite, and a cinnamon-dusted red berry character nuanced by the woody, spicy aromas of just-cut rose stems balanced by fresh rose petals and dark chocolate.'
		),
		new Prompt(
			Category.WINE_RED,
			'https://www.totalwine.com/wine/red-wine/cabernet-sauvignon/eccentric-cabernet-sauvignon/p/213641750?s=1108&igrules=true',
			'Eccentric Cabernet Sauvignon, 2025 ',
			'This shows off flavors of blueberries soaked in coffee. Supple tannins support a touch of dark chocolate cedar flavorful with lingering richness throughout.'
		),
		new Prompt(
			Category.WINE_WHITE,
			'https://www.totalwine.com/wine/white-wine/chardonnay/bishop-pine-chardonnay-california/p/236085750?s=1108&igrules=true',
			'Bishop Pine Chardonnay California, 2024',
			'Luscious, bright pear, yellow apple, nutmeg, white flowers, and toasty oak aromas. The flavors translate onto the palate like crisp, crunchy stone fruits, white peach, cinnamon, and candied orange peel, finishing juicy yet dry.'
		),
		new Prompt(
			Category.WINE_RED,
			'https://www.totalwine.com/wine/red-wine/cabernet-sauvignon/silver-oak-cabernet-alexander/p/220638750?s=1108&igrules=true',
			'Silver Oak Cabernet Sauvignon Alexander Valley',
			'Featuring aromas and flavors of black currant jam, rose petals, chocolate, and sandalwood.'
		),
		new Prompt(
			Category.WINE_WHITE,
			'https://www.totalwine.com/wine/white-wine/chardonnay/river-road-chardonnay-rrv-reserve/p/93152750?s=1108&igrules=true',
			'River Road Reserve Russian River Valley Chardonnay ',
			'Vibrant, with a hint of vanilla and bright fresh pear flavors.'
		),
		new Prompt(
			Category.WINE_RED,
			'https://www.totalwine.com/wine/red-wine/bordeaux-blend/ch-lamothe-vincent-reserve-bord/p/2126222101?s=1108&igrules=true',
			'Chateau Lamothe Vincent Reserve Bordeaux, 2023 ',
			'An unravelling of plush hedgerow fruit interlaced with toasty cedarwood and graphite swirling decadently over the supple tannins and cleansing cassis acidity.'
		),
		new Prompt(
			Category.WINE_WHITE,
			'https://www.totalwine.com/wine/white-wine/sauvignon-blanc/amici-sauvignon-blanc/p/20094750?s=1108&igrules=true',
			'Amici Sauvignon Blanc, 2024',
			'Aromas of sliced lemons and hints of celery and fresh white flowers. '
		),
		new Prompt(
			Category.WINE_WHITE,
			'https://www.totalwine.com/wine/white-wine/pinot-grigiopinot-gris/belvino-pinot-grigio/p/140315750?s=1108&igrules=true',
			'Belvino Pinot Grigio',
			'Presents fresh ripe apple and pear aromas and flavors, with a hint of peach in the middle and of elderflower on the finish.'
		),
		new Prompt(
			Category.WINE_WHITE,
			'https://www.totalwine.com/wine/white-wine/chardonnay/chappellet-gc-chardonnay/p/242938750?s=1108&igrules=true',
			'Chappellet Grower Collection Chardonnay ',
			'This displays aromas of apricot, tropical flowers, lemon zest, with hints of creme fraiche, melted butter and baking spices adding depth and complexity.'
		),
		new Prompt(
			Category.WINE_RED,
			'https://www.totalwine.com/wine/red-wine/cabernet-sauvignon/samuel-robert-vyd-cab-napa-rsv/p/2126274136?s=1108&igrules=true',
			'Samuel Robert Vineyard Reserve Napa Valley Cabernet Sauvignon, 2024 ',
			'Bright cherry and pomegranate possess mocha overtones. Juicy and fresh, with supple and inviting tannins. Notes of sweet tobacco and lightly oaked cinnamon-cherry are quite pleasing.'
		),
		new Prompt(
			Category.WINE_CHAMPAGNE,
			'https://www.totalwine.com/wine/champagne-sparkling-wine/champagne/brut/marie-de-moy-grand-cru-champagne/p/238539750?s=1108&igrules=true',
			'Champagne Marie de Moy Grand Cru',
			'Stylish yellow apple, apricot and vibrant citrus is gently laced with vanilla pastry cream and brioche. Crisp and mouth-watering with a pervading mousse and an impressive finish.'
		),
		new Prompt(
			Category.WINE_WHITE,
			'https://www.totalwine.com/wine/white-wine/chardonnay/cakebread-chardonnay-napa/p/2342750?s=1108&igrules=true',
			'Cakebread Chardonnay Napa ',
			'Fresh, ripe, multilayered apple, pear and melon fruit, accented by mineral and toasty oak notes. Full and lush on the palate with a creamy texture and long finish.'
		),
		// TEAS (25)
		new Prompt(
			Category.TEA_GREEN,
			'https://fiveoclock.eu/zielona/168466-japan-gyokuro-wakamusha.html',
			'Japan Gyokuro Wakamusha',
			'Its distinctive, sweet, algae-like aroma beckons. Its smooth and soft character spreads an intense umami flavor across the palate. After a while, a distinct, almost salty aftertaste lingers in the mouth.'
		),
		new Prompt(
			Category.TEA_GREEN,
			'https://fiveoclock.eu/czarna/169202-darjeeling-chamling-dj12026.html',
			'Darjeeling FF Chamling DJ1/2026',
			'A blend of subtle tartness, elegant dryness, and hints of elderflowers. A mineral finish completes the whole.'
		),
		new Prompt(
			Category.TEA_GREEN,
			'https://fiveoclock.eu/darjeeling-lotnicze-2026/169227-darjeeling-ff-pussimbing-ftgfop-dj2.html',
			'Darjeeling FF Pussimbing FTGFOP DJ2',
			'Fresh, elegant character and a touch of dryness. It delights with delicate floral notes and subtle fruit nuances. The finish will surprise with a hint of almond.'
		),
		new Prompt(
			Category.TEA_WHITE,
			'https://fiveoclock.eu/biala/17084-china-white-flowery-pekoe.html',
			'China White Flowery Pekoe',
			'It boasts a floral note with a touch of lily and a wonderful sweetness without a hint of bitterness.'
		),
		new Prompt(
			Category.TEA_BLACK,
			'https://fiveoclock.eu/czarna/87666-colombia.html',
			'Colombia Black Tea',
			'A pleasant blend of subtle bitterness with refreshing woody notes.'
		),
		new Prompt(
			Category.TEA_BLACK,
			'https://fiveoclock.eu/czarna/1165-herbata',
			'Golden Yunnan',
			'It has a balanced bitterness and a pleasantly aromatic flavor. The taste is characterized by a distinctive smoky note and a hint of woodiness.'
		),
		new Prompt(
			Category.TEA_BLACK,
			'https://fiveoclock.eu/czarna/169204-nepal-annapurna-sftgfop.html',
			'Nepal Annapurna SFTGFOP',
			'Fruity notes and a dry muscatel character dominate, with a subtle hint of spice in the background.'
		),
		new Prompt(
			Category.TEA_OOLONG,
			'https://fiveoclock.eu/oolong/161925-vietnam-oolong-four-season-2.html',
			'Vietnam Oolong Four Season',
			'It\'s characterized by a smooth, unbitter taste with aromas of lily-of-the-valley and lilac flowers.'
		),
		new Prompt(
			Category.TEA_BLACK,
			'https://fiveoclock.eu/czarna/169100-nepal-ff-sftgfop1-snow.html',
			'Nepal FF SFTGFOP1 Snow',
			'Light, dry, and elegant flavor. A perfect blend of floral notes, sweetness, and a subtle hint of mountain freshness.'
		),
		new Prompt(
			Category.TEA_BLACK,
			'https://fiveoclock.eu/czarna/127984-filizanka-admirala-2.html',
			'Admiral\'s Cup',
			'A very pleasant balance, combining subtle tartness with sweet smokiness and nuttiness.'
		),
		new Prompt(
			Category.TEA,
			'https://fiveoclock.eu/herbata/168880-ceylon-new-falcon-fbopfexsp-.html',
			'Ceylon New Falcon FBOPFEXSP',
			'The flavor is vinous yet sweet, with a hint of buckwheat and a delicate cocoa undertone. Distinctive, tannic, and with a long, dessert-like finish.'
		),
		new Prompt(
			Category.TEA_BLACK,
			'https://fiveoclock.eu/czarna/169206-georgian-wild.html',
			'Georgian Wild',
			'Subtle and incredibly aromatic. Smoke and sweetness dominate, with a subtle hint of chocolate in the background. Fresh citrus notes are also noticeable in the aroma. Perfect for savoring.'
		),
		new Prompt(
			Category.TEA_GREEN,
			'https://fiveoclock.eu/zielona/78522-japan-bancha-2.html',
			'Japan Bancha',
			'The flavor is full-bodied, melting in the mouth with a subtle bitterness and a pleasant smoothness. Perfectly balanced notes, reminiscent of walnut, create a dense, buttery character.'
		),
		new Prompt(
			Category.TEA_BLACK,
			'https://fiveoclock.eu/czarna/1147-herbata-chinska-china-panyong-golden-needle.html',
			'China Panyong Golden Needle',
			'Sweet and warm notes, reminiscent of milk chocolate, dominate the flavor. A touch of refined smokiness and a slightly herbal nuance emerge at the end.'
		),
		new Prompt(
			Category.TEA_BLACK,
			'https://fiveoclock.eu/czarna/169134-china-golden-silk.html',
			'China Golden Silk',
			'Rich aroma and notes of honey and cocoa. The taste is mild, naturally sweet and velvety, with a long, full, and pleasant finish.'
		),
		new Prompt(
			Category.TEA_GREEN,
			'https://fiveoclock.eu/zielona/168428-china-snow-buds.html',
			'China Snow Buds',
			'Its subtle fruity note lends a lightness and is pleasantly received by those who enjoy delicate flavors.'
		),
		new Prompt(
			Category.TEA_WHITE,
			'https://fiveoclock.eu/biala/86587-colombia-white-tea.html',
			'Colombia White Tea',
			'A hint of bitterness. A mature flavor with a noticeable woodiness and nuttiness.'
		),
		new Prompt(
			Category.TEA_PUER,
			'https://fiveoclock.eu/pu-erh/1157-herbata-chinska-pu-erh-yunnan.html',
			'Pu-Erh Yunnan',
			'The flavor is almost dense, intense and expressive, yet devoid of bitterness. It contains notes of earthiness and woodiness.'
		),
		new Prompt(
			Category.TEA_BLACK,
			'https://fiveoclock.eu/czarna/1138-herbata-chinska-dianhong-tea.html',
			'Dianhong Tea',
			'The flavor is deep and bold. Slightly bitter with a sweet and elegantly smoky aftertaste.'
		),
		new Prompt(
			Category.TEA_GREEN,
			'https://fiveoclock.eu/zielona/150087-herbata-klasyczna-china-luan-gua-pian.html',
			'China Luan Gua Pian',
			'This specialty boasts a unique flavor, blending notes of walnut and chestnut with floral nuances. The most interesting flavors are those that linger after tasting. You can detect herbaceous notes, vanilla, and a hint of vegetable notes.'
		),
		new Prompt(
			Category.TEA_PUER,
			'https://fiveoclock.eu/pu-erh/169231-pu-erh-buds.html',
			'Pu-Erh Buds',
			'Deep, earthy aroma and a velvety flavor with a delicate malt note. It is distinguished by its elegant character and rich, highly complex aroma.'
		),
		new Prompt(
			Category.TEA_GREEN,
			'https://fiveoclock.eu/zielona/168382-truskawka-z-rabarbarem.html',
			'Tai Ping Hou Kui',
			'An incredibly fleeting floral and sweetness combines with a mineral, almost marine accent.'
		),
		new Prompt(
			Category.TEA_GREEN,
			'https://fiveoclock.eu/zielona/168569-china-huang-shan-mao-feng.html',
			'China Huang Shan Mao Feng',
			'A delicate sweetness with floral and malty notes intertwines with the soft body, while an intriguing, light sharpness emerges on the finish.'
		),
		new Prompt(
			Category.TEA_BLACK,
			'https://fiveoclock.eu/czarna/168458-golden-monkey.html',
			'Golden Monkey',
			'The flavor is balanced, with sweet notes and a hint of smokiness and dryness. The overall fullness and density make the taste linger long in the memory.'
		),
		new Prompt(
			Category.TEA_PUER,
			'https://fiveoclock.eu/pu-erh/16940-pu-erh-premium.html',
			'Pu-Erh Premium',
			'The lack of bitterness doesn\'t diminish the sense of essence. The flavor is distinctive, earthy, with a touch of wood. A hint of dried plum is noticeable in the background.'
		),
	],
	state: {
		/** @type {Prompt[]} */
		bank: undefined,
		/** @type {Prompt} */
		current: undefined,
		right: 0,
		total: 0,
		wrong: 0,
	},
	advance(){
		console.debug('advance');
		if (this.state.total < 20){
			this.next();
			this.elem.quote.innerHTML = this.state.current.prompt;
			this.showScreen('promptScreen');
		}
		else {
			this.elem.endResult.innerHTML = `SCORE: ${this.state.right} correct / ${this.state.total} total`;
			this.showScreen('endScreen');
		}
	},
	guess(g = Category.NULL){
		console.debug('guess', g);
		this.state.total++;
		const correct = Category.is(this.state.current.answer, g);
		if (correct){
			this.state.right++;
		}
		else {
			this.state.wrong++;
		}
		this.showResult(correct);
	},
	init(){
		console.debug('init');
		// MENU
		const menu = this.elem.menu = document.createElement('div');
		menu.id = 'menu';
		menu.classList.add('screen');
		document.body.appendChild(menu);
		const h1 = document.createElement('h1');
		h1.innerHTML = 'Tea or Wine?';
		menu.appendChild(h1);
		const img = document.createElement('img');
		img.src = 'teaorwine.jpg';
		img.style.height = 'min(50vh, 50vw)';
		img.title = 'No - this is not wine. This is tea.';
		img.alt = 'two bottles of sparkling tea in ice';
		menu.appendChild(img);
		menu.appendChild(document.createElement('br'));
		menu.appendChild(this.elem.button('new', () => this.new()));
		// PROMPT SCREEN
		const promptScreen = this.elem.promptScreen = document.createElement('div');
		promptScreen.id = 'promptScreen';
		promptScreen.classList.add('screen');
		document.body.appendChild(promptScreen);
		const quote = this.elem.quote = document.createElement('blockquote');
		quote.id = 'quote';
		promptScreen.appendChild(quote);
		promptScreen.appendChild(this.elem.button('Tea', () => this.guess(Category.TEA)));
		promptScreen.appendChild(this.elem.button('Wine', () => this.guess(Category.WINE)));
		// RESULT SCREEN
		const resultScreen = this.elem.resultScreen = document.createElement('div');
		resultScreen.id = 'resultScreen';
		resultScreen.classList.add('screen');
		document.body.appendChild(resultScreen);
		const resultResult = this.elem.resultResult = document.createElement('div');
		resultResult.id = 'result';
		resultScreen.appendChild(resultResult);
		const source = this.elem.source = document.createElement('a');
		resultScreen.appendChild(source);
		resultScreen.appendChild(document.createElement('br'));
		resultScreen.appendChild(this.elem.button('Next', () => this.advance()));
		// END SCREEN
		const endScreen = this.elem.endScreen = document.createElement('div');
		endScreen.id = 'endScreen';
		endScreen.classList.add('screen');
		document.body.appendChild(endScreen);
		const endResult = this.elem.endResult = document.createElement('div');
		endResult.id = 'endResult';
		endScreen.appendChild(endResult);
		endScreen.appendChild(this.elem.button('Retry', () => this.new()));
		// start
		this.showScreen('menu');
		console.info('teaorwine.js loaded.');
	},
	next(){
		console.debug('next');
		const i = Math.floor(Math.random() * this.state.bank.length);
		this.state.current = this.state.bank.splice(i, 1)[0];
	},
	new(){
		console.debug('new');
		this.state = {
			bank: this.prompts.map(x => x),
			right: 0,
			total: 0,
			wrong: 0,
		};
		this.advance();
	},
	showResult(correct = false){
		console.debug('showResult', correct);
		this.elem.resultResult.innerHTML = correct ? 'Correct!' : 'Incorrect!';
		this.elem.resultResult.style.color = correct ? 'green' : 'red';
		this.elem.source.innerHTML = this.state.current.name;
		this.elem.source.href = this.state.current.url;
		this.showScreen('resultScreen');
	},
	showScreen(name = 'menu'){
		console.debug('showScreen', name);
		[
			'endScreen',
			'menu',
			'promptScreen',
			'resultScreen',
		].forEach(s => {
			const elem = this.elem[s];
			elem.style.display = name === s ? 'block' : 'none';
		});
	},
};

TOW.init();