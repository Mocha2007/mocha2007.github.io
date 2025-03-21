/* global playSound */

const cw = {
	bh: 'Body Horror',
	s: 'Suicide',
};

const data = [
	// if stuff has a CW then you need an ID for the CW to link to
	// if canbechosen is true DONT add a second cw, that's pointless...
	{
		id: 'begone',
		p: 'Your worries fade into silence.',
		choices: ['Peace...'],
		canbechosen: false,
	},
	{
		id: 'redPill',
		p: '&ldquo;Who <em>am</em> I</em>?&rdquo;',
		choices: ['&ldquo;Someone else, perhaps?&rdquo;'],
		canbechosen: false,
	},
	{
		cw: cw.s,
		id: 'death',
		p: 'Death calls.',
	},
	{
		p: 'You hear the voices of your colleagues around you, whispering behind your back&mdash;they are disgusted by your appearance.',
		choices: ['&ldquo;They&rsquo;re right&mdash;I&rsquo;m a freak.&rdquo;', '&ldquo;Are those <em>really</em> the voices of others, or myself?&rdquo;'],
	},
	{
		cw: cw.bh,
		id: 'grotesque',
		p: 'You see your body morphing in front of your very eyes, into a new, grotesque form.',
		choices: ['Accept transformation', 'Remember your true self'],
	},
	{
		id: 'mirror0',
		p: 'You look into the mirror, but do not recognize your reflection.',
		choices: ['Look closer'],
		links: ['mirror1'],
	},
	{
		id: 'mirror1',
		p: 'Your reflection laughs at your disgusting body.',
		canbechosen: false,
	},
	{
		cw: cw.bh,
		id: 'mold0',
		p: 'You feel mold growing on your face.',
		choices: ['Check your body'],
		links: ['mold1'],
	},
	{
		id: 'mold1',
		p: 'The mold has spread to your arms and legs.',
		canbechosen: false,
		choices: ['&ldquo;This is how everyone feels.&rdquo;', '&ldquo;Something is wrong with my body.&rdquo;'],
	},
	{
		cw: cw.bh,
		id: 'worms0',
		p: 'You feel worms writhing inside your cheeks.',
		choices: ['Notice your body'],
		links: ['worms1'],
	},
	{
		id: 'worms1',
		p: 'The worms are in your arms and legs, too.',
		canbechosen: false,
		choices: ['&ldquo;This is how everyone feels.&rdquo;', '&ldquo;Something is wrong with my body.&rdquo;'],
	},
	{
		p: 'You feel your clothes burning your skin.',
	},
	{
		p: 'You try to speak, but you only hear incoherent scratching noises.',
	},
	{
		p: 'You try to speak, but hear silence instead of your familiar voice.',
		choices: ['&ldquo;Why can&rsquo;t I speak?&rdquo;', '&ldquo;It was never <em>my</em> voice.&rdquo;'],
	},
	{
		cw: cw.bh,
		id: 'wax',
		p: 'Your chest is melting into a amorphous, waxy blob.',
	},
	{
		p: 'Your existence disgusts your family.',
		choices: ['Accept their will', 'Struggle to retain your individuality'],
	},
	{
		p: 'Your breath is weak. Your body is exhausted. The depression is getting worse.',
		choices: ['&ldquo;I am simply delusional.&rdquo;', '&ldquo;My experiences are real; no one understands.&rdquo;'],
	},
	{
		p: 'Your depression is worsening. Life is such a chore. How does everyone else smile?',
		choices: ['&ldquo;Everyone else is pretending; they&rsquo;re suffering too.&rdquo;', '&ldquo;Something is wrong, but I don&rsquo;t know what.&rdquo;'],
	},
	{
		p: 'You feel a thousand needles poking at your skin&mdash;but when you look, nothing is there.',
		choices: ['&ldquo;This is how I&rsquo;ve always felt anyways.&rdquo;', '&ldquo;Something is wrong with my body.&rdquo;'],
	},
	{
		p: 'You realize it is no longer you who controls your body, but someone else.',
		choices: ['&ldquo;Who am I?&rdquo;', '&ldquo;It was never my body to begin with.&rdquo;'],
	},
	{
		p: 'You no longer see as yourself, but instead see youself from afar.',
		choices: ['&ldquo;Why have I been thrown out of my own body?&rdquo;', '&ldquo;That&rsquo;s not my body; it&rsquo;s someone else&rsquo;s.&rdquo;'],
	},
	{
		p: 'They just called you the wrong name&mdash;so why are you so happy about it?',
		choices: ['&ldquo;I must be a masochistic freak.&rdquo;', '&ldquo;Was <em>that</em> my name all along...?&rdquo;'],
	},
	{
		p: 'They just referred to you with the opposite pronoun&mdash;so why are you so happy about it?',
		choices: ['&ldquo;I must be a masochistic freak.&rdquo;', '&ldquo;Is <em>that</em> me...?&rdquo;'],
	},
	{
		p: 'You just woke from a dream where you were in someone else&rsquo;s body&mdash;so why were you so happy about it?',
		choices: ['&ldquo;It must be my unnatural perversions.&rdquo;', '&ldquo;Is <em>that</em> who I want to be...?&rdquo;'],
	},
	{
		p: 'You noticed yourself staring at a member of the opposite sex&mdash;but it wasn&rsquo;t attraction, was it?',
		choices: ['&ldquo;It <em>must</em> be lust... I&rsquo;m just confused.&rdquo;', '&ldquo;Was that... <em>envy</em>?!&rdquo;'],
	},
];

class HEvent {
	constructor(id, prompt, choices = undefined, links = undefined,
		canbechosen = true, ccw = undefined){
		/** @type {string} */
		this.id = id;
		/** @type {string} */
		this.prompt = prompt;
		/** @type {string[]} */
		this.choices = choices || HEvent.defaultChoices;
		/** @type {string[]} */
		this.links = links || HEvent.links;
		/** @type {boolean} */
		this.canbechosen = canbechosen;
		/** @type {string?} */
		this.cw = ccw;
	}
	get cwElem(){
		return new HEvent('', `CW: ${this.cw}`, ['Look Away', 'Confront the darkness'], ['begone', this.id], false).elem;
	}
	get elem(){
		const div = document.createElement('div');
		div.id = 'identity';
		const p = document.createElement('p');
		p.innerHTML = this.prompt;
		div.appendChild(p);
		this.choices.forEach((choice, i) => {
			const span = document.createElement('span');
			if (this.haslinks)
				span.onclick = () => {
					div.remove();
					HEvent.fromID(this.links[i]).show(true);
					if (i)
						secret.enable();
				};
			else
				span.onclick = () => {
					div.remove();
					document.body.classList.remove('noOverflow');
					if (i)
						secret.enable();
				};
			span.innerHTML = choice;
			div.appendChild(span);
		});
		return div;
	}
	get haslinks(){
		return this.choices.length === this.links.length;
	}
	show(ignoreCW = false){
		document.body.classList.add('noOverflow');
		document.body.appendChild(this.cw && !ignoreCW ? this.cwElem : this.elem);
		if (IDENT_DEBUG)
			console.debug(this);
	}
	/**
	 * @param {string} id
	 * @returns {HEvent}
	 */
	static fromID(id){
		return this.hevents.find(he => he.id === id);
	}
	static fromObject(o){
		return new HEvent(o.id, o.p, o.choices, o.links, o.canbechosen, o.cw);
	}
	static random(){
		const choice = this.hevents[Math.floor(Math.random() * this.hevents.length)];
		return choice.canbechosen ? choice : this.random();
	}
}
HEvent.defaultChoices = ['Accept incongruity', 'Fight back'];
HEvent.links = ['begone', 'redPill'];
HEvent.hevents = data.map(HEvent.fromObject);

const IDENT_DEBUG = false;

// https://stackoverflow.com/a/44670818
function onVisible(element, callback){
	new IntersectionObserver((entries, observer) => {
		entries.forEach(entry => {
			if (entry.intersectionRatio > 0){
				callback(element);
				observer.disconnect();
			}
		});
	}).observe(element);
}

function secret(){
	if (!secret.enabled)
		return;
	document.getElementById('title').innerHTML = 'Luna’s Site<audio id="sfx" src="snd/egg.mp3"/>';
	document.title = 'Luna’s Site';
	const sub = document.getElementById('subtitle');
	const RE = [/Mocha/g, 'Luna'];
	sub.innerHTML = sub.innerHTML.replace(...RE);
	Array.from(document.getElementsByTagName('a'))
		.forEach(elem => elem.innerHTML = elem.innerHTML.replace(...RE));
	playSound('sfx');
	// console.info('I am myself now.');
}
secret.enable = () => {
	secret.enabled = true;
	// console.info('Am I myself now?');
};

function identity(){
	// add secret, regardless of the time of year
	onVisible(document.getElementById('bottom'), secret);
	// 20% chance of happening during JUNE (pride month), OCTOBER (halloween), and NOVEMBER (trans pride month)
	if (!(IDENT_DEBUG || [5, 9, 10].includes(new Date().getMonth()) && Math.random() < 0.2))
		return secret.enable();
	// import CSS
	const style = document.createElement('link');
	style.href = 'css/identity.css';
	style.rel = 'stylesheet';
	document.head.appendChild(style);
	// scroll to top
	window.scrollTo(0, 0);
	// block rest of doc
	HEvent.random().show();
}

identity();