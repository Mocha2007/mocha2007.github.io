/* exported blog */
/* global blogData, clamp, copyToClipboard, loadScript, log, notif, random, sum, title */

/** @param {Date} d */
function formatDate(d){
	// 2011-11-18T14:54:39.929-0400
	// eslint-disable-next-line max-len
	return `${d.getUTCFullYear()}-${d.getUTCMonth()+1}-${d.getUTCDate()}T${d.getUTCHours()}:${d.getUTCMinutes()}:${d.getUTCSeconds()}Z`;
}

function link(o, hover='', titleOverride=''){
	const e = document.createElement('span');
	e.classList.add('tag');
	e.onclick = () => blog.set(o.elem);
	e.innerHTML = titleOverride || o.title;
	e.title = hover;
	return e;
}

/** @param {string} suburl */
function permalink(suburl){
	const a = document.createElement('a');
	const baseUrl = window.location.href.match(/[^?#]+/)[0];
	a.href = `${baseUrl}${suburl}`;
	a.innerHTML = '^';
	a.title = 'Permalink';
	return a;
}

/**
 * @param {string} a
 * @param {string} b
 */
function sortText(a, b){
	return a < b ? -1 : a > b ? 1 : 0;
}

class Blogpost {
	/**
	 * @param {string} title
	 * @param {Date} date
	 * @param {Tag[]} tags
	 * @param {Section[]} sections
	 */
	constructor(title, date, tags, sections){
		this.title = title;
		this.date = date;
		if (!blog.debug && new Date() < date)
			return;
		this.tags = tags;
		this.sections = sections;
		Blogpost.blogposts.push(this);
	}
	get allTags(){
		return this.tags.concat(...this.sections.map(s => s.tags));
	}
	get elem(){
		const div = document.createElement('article');
		const h = document.createElement('h2');
		h.appendChild(this.permalink);
		h.appendChild(document.createTextNode(this.title));
		div.appendChild(h);
		// date
		const dateContainer = document.createElement('div');
		dateContainer.classList.add('dateContainer');
		const date = document.createElement('time');
		date.dateTime = formatDate(this.date);
		date.innerHTML = this.date.toString();
		dateContainer.appendChild(date);
		dateContainer.appendChild(document.createElement('br'));
		dateContainer.appendChild(document.createTextNode('more posts from... '));
		dateContainer.appendChild(link(new Period(
			blog.week.start(this.date),
			new Date(+blog.week.start(this.date) + blog.week.size),
			'week'
		)));
		dateContainer.appendChild(link(new Period(
			new Date(`${this.date.getFullYear()}-${this.date.getMonth()+1}`),
			new Date(`${this.date.getFullYear()}-${this.date.getMonth()+2}`),
			'month'
		)));
		dateContainer.appendChild(link(new Period(
			new Date(`${this.date.getFullYear()}`),
			new Date(`${this.date.getFullYear()+1}`),
			'year'
		)));
		div.appendChild(dateContainer);
		// tags
		if (this.tags.length)
			div.appendChild(Tag.tagList(this.tags, this));
		const hr = document.createElement('hr');
		hr.classList.add('shorterHr');
		div.appendChild(hr);
		this.sections.forEach(s => div.appendChild(s.elem));
		return div;
	}
	get id(){
		return Blogpost.blogposts.indexOf(this);
	}
	get link(){
		return link(this, this.date.toString());
	}
	get permalink(){
		return permalink(`?i=${this.id}`);
	}
	static get latest(){
		const max = Math.max(...Blogpost.blogposts.map(b => b.date));
		return Blogpost.blogposts.find(b => +b.date === max);
	}
	/** @param {string} s */
	static parse(s){
		const newP = () => {
			o.sections.push(new Section(o.currentP.tags, o.currentP.innerHTML.replace(/^\s+/g, '')));
			o.currentP = {tags: [], innerHTML: ''};
		};
		const o = {
			title: '',
			date: new Date(0),
			tags: [],
			sections: [],
			currentP: {
				tags: [],
				innerHTML: '',
			},
		};
		let body = false;
		s.split('\n').forEach(line => {
			if (!line)
				return;
			const words = line.split(/\s/g);
			// remove leading whitespace
			while (words[0] === '')
				words.shift();
			// console.debug('words', words);
			// keyword?
			if (words.length && words[0][0] === '@'){
				const kw = words[0].slice(1);
				const rest = words.slice(1).join(' ');
				// console.debug(kw, rest);
				// eslint-disable-next-line nonblock-statement-body-position
				if (!body) switch (kw){
					case 'title':
						o.title = rest;
						break;
					case 'date':
						o.date = new Date(+rest);
						break;
					case 'tags':
						o.tags.push(...words.slice(1).map(Tag.getTag));
						break;
					case 'p':
						body = true;
						break;
				}
				// eslint-disable-next-line nonblock-statement-body-position
				else switch (kw){
					case 'p':
						newP();
						break;
					case 'tags':
						o.currentP.tags.push(...words.slice(1).map(Tag.getTag));
						break;
				}
			}
			else {
				o.currentP.innerHTML += `\n${line}`.replace(/\s+/, ' ');
				body = true;
			}
		});
		// make sure last section is added
		if (o.currentP.innerHTML)
			newP();
		// done
		return new Blogpost(o.title, o.date, o.tags, o.sections);
	}
}
/** @type {Blogpost[]} */
Blogpost.blogposts = [];

class Tag {
	/** @param {string} name */
	constructor(name){
		this.name = name;
		this.title = title(name.toLowerCase().replace('_', ' '));
		Tag.tags.push(this);
	}
	get elem(){
		const div = document.createElement('article');
		const h = document.createElement('h2');
		h.innerHTML = this.title;
		div.appendChild(h);
		// get posts
		const h_ = document.createElement('h3');
		h_.innerHTML = 'Posts';
		div.appendChild(h_);
		const ul = document.createElement('ul');
		div.appendChild(ul);
		Blogpost.blogposts.filter(b => b.tags.includes(this)).forEach(b => {
			const li = document.createElement('li');
			li.appendChild(b.link);
			li.appendChild(document.createTextNode(`(${b.date.toDateString()})`));
			ul.appendChild(li);
		});
		// get sections
		const h_2 = document.createElement('h3');
		h_2.innerHTML = 'Sections';
		div.appendChild(h_2);
		const ul2 = document.createElement('ul');
		div.appendChild(ul2);
		Section.sections.filter(s => s.tags.includes(this)).forEach(s => {
			const li = document.createElement('li');
			const post = s.post;
			li.appendChild(post.link);
			li.appendChild(document.createTextNode(`(${post.date.toDateString()}): `));
			const q = document.createElement('q');
			q.appendChild(s.p);
			li.appendChild(q);
			ul2.appendChild(li);
		});
		return div;
	}
	get link(){
		return link(this);
	}
	/** @param {Blogpost} post */
	link2(post){
		const container = document.createElement('span');
		container.classList.add('linkContainer');
		const prev = Blogpost.blogposts.slice(0, post.id)
			.reverse().find(p => p.allTags.includes(this));
		const next = Blogpost.blogposts.slice(post.id+1)
			.find(p => p.allTags.includes(this));
		if (prev)
			container.appendChild(link(prev, `previous mention of ${this.title}`, '&laquo;'));
		container.appendChild(this.link);
		if (next)
			container.appendChild(link(next, `next mention of ${this.title}`, '&raquo;'));
		return container;
	}
	static get allElemLink(){
		const o = {
			get elem(){
				const ul = document.createElement('ul');
				Tag.tags.sort((a, b) => sortText(a.title, b.title)).forEach(t => {
					const li = document.createElement('li');
					li.appendChild(t.link);
					ul.appendChild(li);
				});
				return ul;
			},
			title: 'Tags:',
		};
		return link(o, 'see all tags');
	}
	/**
	 * @param {Tag[]} tags
	 * @param {Blogpost} post
	 */
	static tagList(tags, post){
		const span = document.createElement('span');
		span.classList.add('tagList');
		span.appendChild(Tag.allElemLink);
		tags.forEach((t, i) => {
			if (i)
				span.appendChild(document.createElement('wbr'));
			span.appendChild(t.link2(post));
		});
		return span;
	}
	/** @param {string} s */
	static getTag(s){
		return Tag.tags.find(t => t.name === s) || new Tag(s);
	}
}
/** @type {Tag[]} */
Tag.tags = [];

class Section {
	/**
	 * @param {Tag[]} tags
	 * @param {string} innerHTML
	 */
	constructor(tags, innerHTML){
		this.tags = tags;
		this.innerHTML = innerHTML;
		Section.sections.push(this);
	}
	get elem(){
		const div = document.createElement('section');
		div.id = this.id;
		if (this.tags.length)
			div.appendChild(Tag.tagList(this.tags, this.post));
		div.appendChild(this.p);
		return div;
	}
	get id(){
		const i = this.post.sections.indexOf(this);
		return `s${i}`;
	}
	get p(){
		const p = document.createElement('p');
		p.appendChild(this.permalink);
		const span = document.createElement('span');
		span.innerHTML = this.innerHTML;
		p.appendChild(span);
		return p;
	}
	get permalink(){
		return permalink(`?i=${this.post.id}#${this.id}`);
	}
	get post(){
		return Blogpost.blogposts.find(b => b.sections.includes(this));
	}
	get rawText(){
		return this.innerHTML.toLowerCase()
			.replace(/\s+/g, ' ') // simplify whitespace
			.replace(/<[^>]+?>/g, '') // remove html tags
			.replace(/&[^;]+?;/g, '') // remove escape chars
			.replace(/[^a-z' ]/g, ''); // remove everything but a-z, apostrophe, and space
	}
}
/** @type {Section[]} */
Section.sections = [];

class Period {
	/**
	 * @param {Date} start inclusive
	 * @param {Date} end exclusive
	 * @param {string} title
	 */
	constructor(start, end, title){
		this.start = start;
		this.end = end;
		this.title = title;
	}
	get elem(){
		const div = document.createElement('article');
		const h = document.createElement('h2');
		h.innerHTML = this.title;
		div.appendChild(h);
		const p = document.createElement('p');
		p.innerHTML = `from ${this.start.toDateString()} to ${this.end.toDateString()}`;
		div.appendChild(p);
		// get posts
		const h_ = document.createElement('h3');
		h_.innerHTML = 'Posts';
		div.appendChild(h_);
		const ul = document.createElement('ul');
		div.appendChild(ul);
		Blogpost.blogposts.filter(b => this.start <= b.date && b.date < this.end).forEach(b => {
			const li = document.createElement('li');
			li.appendChild(b.link);
			ul.appendChild(li);
		});
		return div;
	}
	get link(){
		return link(this);
	}
}

const blog = {
	button: {
		/** @returns {HTMLSpanElement} */
		get next(){
			return document.getElementById('buttonNext');
		},
		/** @returns {HTMLSpanElement} */
		get prev(){
			return document.getElementById('buttonPrev');
		},
	},
	corpus: {
		csvCopy(){
			// copy csv to clipboard
			this.init();
			const s = Object.keys(this.set).map(word => `${this.set[word]}\t${word}`).join('\n');
			console.debug('Now quickly go back to the document so I can copy to your clipboard!');
			setTimeout(() => copyToClipboard(s), 1000);
		},
		get initialized(){
			return Object.keys(this.set).length;
		},
		init(){
			if (this.initialized)
				return;
			this.set = {};
			Section.sections.forEach(s => {
				s.rawText.split(' ').forEach(word => {
					if (blog.corpus.set[word])
						blog.corpus.set[word]++;
					else
						blog.corpus.set[word] = 1;
				});
			});
			// delete blank
			delete this.set[''];
		},
		/** @param {number} fraction */
		pareto(fraction = 0.2){
			this.init();
			/** @type {number[]} */
			const vals = Object.keys(this.set).map(x => this.set[x]);
			return vals
				.sort((a, b) => a-b)
				.slice(-Math.round(fraction * vals.length))
				.reduce((a, b) => a+b, 0)
				/ this.size;
		},
		get paretoIndex(){
			let upper = 1; // too big
			let lower = 0; // too small
			while (1e-10 < upper - lower){
				const midpoint = (upper + lower)/2;
				if (1 < midpoint + this.pareto(midpoint))
					upper = midpoint;
				else
					lower = midpoint;
			}
			const n = 1/upper; // upper = lower at this point so it doesn't matter
			return log(n, n-1);
		},
		set: {},
		/** @type {number} */
		get size(){
			return sum(Object.keys(this.set).map(word => this.set[word]));
		},
		stats(){
			this.init();
			console.log('Total: ' + this.size);
			console.log('Unique: ' + Object.keys(this.set).length);
			Object.keys(this.set)
				.sort((a, b) => this.set[b] - this.set[a])
				.slice(0).forEach((word, i) => {
					console.log(`#${i+1} ${this.set[word]} - ${word}`);
				});
			// eslint-disable-next-line max-len
			console.log(`Top 20% most common words make up ${Math.round(100*this.pareto())}% total`);
			console.log('Pareto index: ' + this.paretoIndex);
		},
	},
	current: 0,
	get debug(){
		return window.location.href.slice(0, 4) === 'file';
	},
	/** @param {number} i */
	goto(i){
		this.set(Blogpost.blogposts[this.current = i].elem);
	},
	init(){
		blogData.forEach(Blogpost.parse);
		const latest = Blogpost.latest;
		this.current = latest.id;
		// url contains id?
		const url = window.location.href.match(/\?[^#]+/g);
		if (url)
			this.goto(+url[0].replace('?i=', ''));
		else
			this.set(latest.elem);
		// try loading error notif
		loadScript('../tools/notif.js');
	},
	get max(){
		return Blogpost.blogposts.length-1;
	},
	/** @param {number} diff amount of posts to move by */
	move(diff){
		this.goto(clamp(this.current + diff, 0, this.max));
	},
	random(){
		this.goto(random.randint(0, this.max));
	},
	/** @param {HTMLElement} elem */
	set(elem){
		try {
			document.getElementById('main').innerHTML = '';
			document.getElementById('main').appendChild(elem);
		}
		catch (e){
			if (this.debug)
				notif.catch(e);
		}
		// grey out buttons...
		if (this.current === 0)
			this.button.prev.classList.add('greyedOut');
		else
			this.button.prev.classList.remove('greyedOut');
		if (this.current === this.max)
			this.button.next.classList.add('greyedOut');
		else
			this.button.next.classList.remove('greyedOut');
	},
	get timestamp(){
		return +new Date();
	},
	week: {
		get epoch(){
			return new Date(1969, 11, 28); // Week 0
		},
		/** @param {Date|number} unix */
		number(unix){
			return Math.floor((unix - this.epoch)/this.size);
		},
		/** @param {Date|number} unix */
		start(unix){
			return new Date(this.number(unix) * this.size + +this.epoch);
		},
		get size(){
			return 1000*60*60*24*7;
		},
	},
};