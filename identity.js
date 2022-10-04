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
		p: 'You feel mold growing on your face.',
	},
	{
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

function identity(){
	if (new Date().getMonth() !== 9) // October
		return;
	if (0.2 < Math.random())
		return;
	// import CSS
	const style = document.createElement('link');
	style.href = 'css/identity.css';
	style.rel = 'stylesheet';
	document.head.appendChild(style);
	// block rest of doc
	document.body.classList.add('noOverflow');
	const div = document.createElement('div');
	div.id = 'identity';
	const datum = data[Math.floor(Math.random() * data.length)];
	const p = document.createElement('p');
	p.innerHTML = datum.p;
	div.appendChild(p);
	const choices = datum.choices || data[0].choices;
	choices.forEach(choice => {
		const span = document.createElement('span');
		span.onclick = () => {
			div.remove();
			document.body.classList.remove('noOverflow');
		};
		span.innerHTML = choice;
		div.appendChild(span);
	});
	document.body.appendChild(div);
}
identity();