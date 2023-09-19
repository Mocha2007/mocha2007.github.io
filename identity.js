const data = [
	{
		p: 'Death calls.',
	},
	{
		p: 'You hear the voices of your colleagues around you, whispering behind your back&mdash;they are disgusted by your appearance.',
		choices: ['&ldquo;They&rsquo;re right&mdash;I&rsquo;m a freak.&rdquo;', '&ldquo;But... they&rsquo;re wrong! I can&rsquo;t help who I am!&rdquo;'],
	},
	{
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
		p: 'You no longer see as yourself, but see youself from afar.',
		choices: ['&ldquo;Why have I been thrown out of my own body?&rdquo;', '&ldquo;That&rsquo;s not my body; it&rsquo;s someone else&rsquo;s.&rdquo;'],
	},
	{
		p: 'They just called you the wrong name&mdash;so why are you so happy about it?',
		choices: ['&ldquo;I must be a masochistic freak.&rdquo;', '&ldquo;Was that my name all along?&rdquo;'],
	},
	{
		p: 'They just referred to you with the opposite pronoun&mdash;so why are you so happy about it?',
		choices: ['&ldquo;I must be a masochistic freak.&rdquo;', '&ldquo;Is <em>that</em> me?&rdquo;'],
	},
];

class HEvent {
	constructor(id, prompt, choices = undefined, links = undefined, canbechosen = true){
		/** @type {string} */
		this.id = id;
		/** @type {string} */
		this.prompt = prompt;
		/** @type {string[]} */
		this.choices = choices || HEvent.defaultChoices;
		/** @type {string[]} */
		this.links = links || [];
		/** @type {boolean} */
		this.canbechosen = canbechosen;
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
					HEvent.fromID(this.links[i]).show();
				};
			else
				span.onclick = () => {
					div.remove();
					document.body.classList.remove('noOverflow');
				};
			span.innerHTML = choice;
			div.appendChild(span);
		});
		return div;
	}
	get haslinks(){
		return this.choices.length === this.links.length;
	}
	show(){
		document.body.classList.add('noOverflow');
		document.body.appendChild(this.elem);
		if (OCTOBER_DEBUG)
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
		return new HEvent(o.id, o.p, o.choices, o.links, o.canbechosen);
	}
	static random(){
		const choice = this.hevents[Math.floor(Math.random() * this.hevents.length)];
		return choice.canbechosen ? choice : this.random();
	}
}
HEvent.defaultChoices = ['Accept incongruity', 'Fight back'];
HEvent.hevents = data.map(HEvent.fromObject);

const OCTOBER_DEBUG = false;

function identity(){
	if (!OCTOBER_DEBUG && (new Date().getMonth() !== 9 || 0.2 < Math.random())) // 20% chance of happening during October
		return;
	// scroll to top
	window.scrollTo(0, 0);
	// import CSS
	const style = document.createElement('link');
	style.href = 'css/identity.css';
	style.rel = 'stylesheet';
	document.head.appendChild(style);
	// block rest of doc
	HEvent.random().show();
}

identity();