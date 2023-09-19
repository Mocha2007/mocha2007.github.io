const data = [
	{
		p: 'Death calls.',
		choices: ['Accept incongruity', 'Fight back'],
	},
	{
		p: 'You hear the voices of your colleagues around you, whispering behind your back&mdash;they are disgusted by your appearance.',
		choices: ['&ldquo;They&apos;re right&mdash;I&apos;m a freak.&rdquo;', '&ldquo;But... they&apos;re wrong! I can&apos;t help who I am!&rdquo;'],
	},
	{
		p: 'You see your body morphing in front of your very eyes, into a new, grotesque form.',
		choices: ['Accept transformation', 'Search for your true self'],
	},
	{
		p: 'You look into the mirror, but do not recognize your reflection.',
	},
	{
		id: 'mold0',
		p: 'You feel mold growing on your face.',
		links: ['mold1', 'mold1'],
	},
	{
		id: 'mold1',
		p: 'The mold has spread to your arms and legs.',
	},
	{
		p: 'You feel your clothes burning your skin.',
	},
	{
		p: 'You try to speak, but you only hear incoherent scratching noises.',
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
		choices: ['&ldquo;No one understands.&rdquo;', '&ldquo;Where is hope?&rdquo;'],
	},
	{
		p: 'You feel a thousand needles poking at your skin&mdash;but when you look, nothing is there.',
		choices: ['&ldquo;This is how I&apos;ve always felt anyways.&rdquo;', '&ldquo;Something is wrong with my body.&rdquo;'],
	},
];

class HEvent {
	constructor(id, prompt, choices = undefined, links = undefined){
		/** @type {string} */
		this.id = id;
		/** @type {string} */
		this.prompt = prompt;
		/** @type {string[]} */
		this.choices = choices || HEvent.defaultChoices;
		/** @type {string[]} */
		this.links = links || [];
	}
	get elem(){
		const div = document.createElement('div');
		div.id = 'identity';
		const p = document.createElement('p');
		p.innerHTML = this.prompt;
		div.appendChild(p);
		this.choices.forEach(choice => {
			const span = document.createElement('span');
			span.onclick = () => {
				div.remove();
				document.body.classList.remove('noOverflow');
			};
			span.innerHTML = choice;
			div.appendChild(span);
		});
		return div;
	}
	link(str = this.id){
		const span = document.createElement('span');
		span.onclick = () => {
			this.show();
			document.body.classList.remove('noOverflow');
		};
		span.innerHTML = str;
		return span;
	}
	show(){
		document.body.classList.add('noOverflow');
		document.body.appendChild(this.elem);
	}
	static fromObject(o){
		return new HEvent(o.id, o.p, o.choices, o.links);
	}
	static random(){
		return this.hevents[Math.floor(Math.random() * this.hevents.length)];
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