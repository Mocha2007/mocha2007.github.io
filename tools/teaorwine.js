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
		// WINES (10)
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
		// TEAS (10)
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