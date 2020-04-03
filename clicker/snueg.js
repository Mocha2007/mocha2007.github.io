/* jshint esversion: 6, strict: true, strict: global, eqeqeq: true, nonew: false */
/* exported delete_cookie, downloadSave, guide, importSave, main, prestige, snuegButton */
"use strict";
var version = "a200402";

// classes

class Purchase{
	/**
	 * Buildings to improve snueg production
	 * @param {string} name - Name of the building
	 * @param {number} price - Base price of the building, increases 15% each purchase
	 * @param {string} desc - Description of the building, given in the tooltip
	 * @param {function} onPurchase - Function to play on purchase
	*/
	constructor(name, price, desc = "", onPurchase = () => {}){
		this.name = name;
		this.price = price;
		this.desc = desc;
		this.onPurchase = onPurchase;
	}
	// getters
	/** @returns {boolean} true if the player can afford to purchase another of this building */
	get canAfford(){
		return this.next_price <= game.player.snueg;
	}
	/** @returns {string} id of buy button */
	get elementId(){
		return this.name + "_button";
	}
	/** @returns {string} icon of button */
	get textIcon(){
		// take the first letter of the first one or two words
		return this.name.split(' ').map(word => word[0]).join('').substring(0, 2);
	}
	// functions
	/** @returns {boolean} success */
	buy(){
		if (this.canAfford){
			game.player.snueg -= this.next_price;
			this.addToPlayer(1);
			this.updateElement();
			this.onPurchase();
			log("Player bought 1 " + this.name);
			return true;
		}
		log("Player tried to buy 1 " + this.name + ", but did not have enough snueg. (" +
			game.player.snueg + " < " + this.next_price + ")");
		return false;
	}
	buyBye(){
		if (this.buy()){
			document.getElementById(this.elementId).remove();
		}
	}
	updateElement(){
		document.getElementById(this.elementId).innerHTML = this.createElement.innerHTML;
	}
}

class Building extends Purchase{
	/**
	 * Buildings to improve snueg production
	 * @param {string} name - Name of the building
	 * @param {number} base_price - Base price of the building, increases 15% each purchase
	 * @param {number} production - In snueg
	 * @param {string} desc - Description of the building, given in the tooltip
	 * @param {function} onPurchase - Function to play on purchase
	*/
	constructor(name, base_price, production, desc = "", onPurchase = () => {}){
		super(name, base_price, desc, onPurchase);
		this.production = production;
	}
	// getters
	/** @returns {number} Amount of this building current purchased */
	get amount(){
		if (game.player.buildings[this.id] !== undefined){
			return game.player.buildings[this.id];
		}
		return 0;
	}
	/** @returns {number} Bonus to production */
	get bonus(){
		return game.globalBonus * this.upgradeBonus;
	}
	/** @returns {boolean} true if the player can afford to purchase another of this building */
	get canAfford(){
		return this.next_price <= game.player.snueg;
	}
	/** @returns {HTMLDivElement} buy button */
	get createElement(){
		// button
		var buy_button = document.createElement('div');
		buy_button.classList.add('buy_button');
		buy_button.id = this.elementId;
		buy_button.onclick = () => this.buy();
		buy_button.onmousemove = () => this.tooltip();
		buy_button.onmouseout = () => clearTooltip();
		// amount
		var item_amount = document.createElement('span');
		item_amount.classList.add('item_amount');
		item_amount.innerHTML = this.amount;
		buy_button.appendChild(item_amount);
		// name
		var item_name = document.createElement('span');
		item_name.classList.add('item_name');
		item_name.innerHTML = this.name;
		buy_button.appendChild(item_name);
		// price
		var item_price = document.createElement('span');
		item_price.classList.add('item_price');
		item_price.innerHTML = bigNumber(this.next_price, true);
		buy_button.appendChild(item_price);
		return buy_button;
	}
	/** @returns {number} index of this in game.buildings */
	get id(){
		return game.buildings.indexOf(this);
	}
	/** @returns {number} production of one of these buildings */
	get individualProduction(){
		return this.production * this.bonus;
	}
	/** @returns {number} total production produced by all buildings of this class on this playthrough */
	get lifetimeProduction(){
		return game.player.buildingClicks[this.id];
	}
	/** @returns {number} cost to buy another of these buildings */
	get next_price(){
		return this.price_at(this.amount);
	}
	/** @returns {number} fraction of total production provided by these buildings */
	get productionFraction(){
		return game.production ? this.totalProduction / game.production : 0;
	}
	/** @returns {Upgrade[]} upgrades affecting this building */
	get relevantUpgrades(){
		var upgrades = [];
		game.upgrades.forEach(upgrade => {
			if (upgrade.targets.includes(this.id)){
				upgrades.push(upgrade);
			}
		});
		return upgrades;
	}
	/** @returns {number} total production provided by all buildings of this type */
	get totalProduction(){
		return this.production * this.amount * this.bonus;
	}
	/** @returns {number} bonus from relevant upgrades */
	get upgradeBonus(){
		var bonus = 1;
		this.relevantUpgrades.forEach(upgrade => {
			if (upgrade.purchased){
				bonus *= upgrade.bonus;
			}
		});
		return bonus;
	}
	// functions
	addToDocument(){
		document.getElementById("building_panel").appendChild(this.createElement);
	}
	/** @param {number} n number of this to add to player */
	addToPlayer(n){
		if (game.player.buildings[this.id] !== undefined){
			game.player.buildings[this.id] += n;
		}
		else {
			game.player.buildings[this.id] = n;
		}
	}
	/**
	 * @param {number} n number of buildings already purchased
	 * @return {number} price after already having n buildings
	*/
	price_at(n){
		return round(this.price * Math.pow(1.15, n));
	}
	/** @param {number} time simulate the production of these buildings over time */
	produce(time){
		var snueg = this.totalProduction*time;
		addSnueg(snueg);
		// add to records
		this.record(snueg);
	}
	/** @param {number} snueg amount of snuegs to record this building as having produced */
	record(snueg){
		var id = this.id;
		if (game.player.buildingClicks[id] === undefined){
			game.player.buildingClicks[id] = snueg;
		}
		else {
			game.player.buildingClicks[id] += snueg;
		}
	}
	tooltip(){
		// function to update the tooltip
		/** @type {HTMLDivElement} */
		var div = tooltip();
		// text
		div.innerHTML = '<b>' + this.name + '</b>';
		div.innerHTML += '<b style="float: right;">' + bigNumber(this.next_price, true) + '</b><br>';
		div.innerHTML += this.desc;
		// item stats
		var ul = document.createElement('ul');
		div.appendChild(ul);
		var li = document.createElement('li');
		li.innerHTML = "each " + this.name + " produces <b>" + bigNumber(this.individualProduction) + "</b> snueg per second";
		ul.appendChild(li);
		li = document.createElement('li');
		li.innerHTML = this.amount + " " + this.name + " producing <b>" + bigNumber(this.totalProduction) + "</b> snueg per second (<b>" + (100*this.productionFraction).toFixed(1)+ "%</b> of total SpS)";
		ul.appendChild(li);
		li = document.createElement('li');
		li.innerHTML = bigNumber(this.lifetimeProduction, true) + " snuegs so far";
		ul.appendChild(li);
	}
	// debug statistics
	/** @returns {number} if purchased now, the time it takes to pay itself off */
	get roiTime(){
		return this.next_price / this.individualProduction;
	}
	/** @returns {number} total seconds, from now, needed to pay itself off */
	get roiWaitTime(){
		return this.roiTime + this.waitTime;
	}
	/** @returns {number} seconds needed to afford */
	get waitTime(){
		return Math.max(0, (this.next_price - game.player.snueg) / game.production);
	}
}

class Upgrade extends Purchase{
	/**
	 * Upgrades to improve snueg production
	 * @param {string} name - Name of the upgrade
	 * @param {number} price - Price of the upgrade
	 * @param {number} bonus - Bonus (1 = normal, 0.5 = halved, 2 = doubled)
	 * @param {number[]} targets - IDs of targetted buildings
	 * @param {string} desc - Description of the upgrade, given in the tooltip
	 * @param {string[]} special - Special effect(s) of the upgrade. Currently only "mouse" is supported.
	 * @param {function} onPurchase - Function to play on purchase
	*/
	constructor(name, price, bonus, targets, desc = "", special = [], onPurchase = () => {}){
		super(name, price, desc, onPurchase);
		this.bonus = bonus;
		this.targets = targets;
		this.special = special;
	}
	/** @returns {HTMLDivElement} buy button */
	get createElement(){
		// button
		var buy_button = document.createElement('div');
		buy_button.classList.add('upgrade_buy_button');
		buy_button.id = this.elementId;
		buy_button.onclick = () => this.buyBye();
		buy_button.onmousemove = () => this.tooltip();
		buy_button.onmouseout = () => clearTooltip();
		// name
		buy_button.innerHTML = this.textIcon;
		return buy_button;
	}
	/** @returns {number} index of this in game.upgrades */
	get id(){
		return game.upgrades.indexOf(this);
	}
	/** @returns {number} upgrade price */
	get next_price(){
		return this.price;
	}
	/** @returns {boolean} is this upgrade purchased? */
	get purchased(){
		return game.player.upgrades.includes(this.id);
	}
	/** @returns {string} desc string for special abilities */
	get specialString(){
		var specials = "";
		if (this.special.includes("mouse")){
			specials += "<li>Also increases production from clicking by this much.</li>";
		}
		if (this.special.includes("fromProduction")){
			specials += "<li>Also adds this much of your production to your clicks.</li>";
		}
		return specials;
	}
	/** @returns {string[]} the names of its targets */
	get targetNames(){
		return this.targets.map(buildingId => game.buildings[buildingId].name);
	}
	// functions
	addToDocument(){
		if (game.player.upgrades.includes(this.id)){
			return;
		}
		document.getElementById("upgrade_panel").appendChild(this.createElement);
	}
	addToPlayer(){
		game.player.upgrades.push(this.id);
	}
	tooltip(){
		// function to update the tooltip
		var div = tooltip();
		// text
		div.innerHTML = '<b>' + this.name + '</b>';
		div.innerHTML += '<b style="float: right;">' + bigNumber(this.price, true) + '</b><br>';
		div.innerHTML += this.desc;
		// item stats
		var ul = document.createElement('ul');
		div.appendChild(ul);
		var li = document.createElement('li');
		li.innerHTML = "improves production of each " + this.targetNames.join(" and ") + " by " + bigNumber((this.bonus-1)*100, true) + "%";
		ul.appendChild(li);
		ul.innerHTML += this.specialString;
	}
}

class Particle {
	/**
	 * Aesthetic Particles
	 * @param {HTMLElement} element - element to animate
	 * @param {Function} tick - animation function (runs every tick, takes element as argument)
	 * @param {number} lifespan - animation time (s)
	*/
	constructor(element, tick, lifespan){
		element.id = +new Date();
		element.classList.add('particle');
		document.getElementById('left').appendChild(element);
		this.element = element;
		this.tick = tick;
		this.lifespan = lifespan;
		setIntervalX(() => tick(element), 1000/game.settings.fps, lifespan*game.settings.fps);
		setTimeout(() => {
			try{
				document.getElementById(element.id).remove();
			}
			catch (TypeError){}
		}, lifespan*1000);
		game.particles.push(this);
	}
}

class FlyingText extends Particle {
	/**
	 * Flying text particle
	 * @param {string} text - text
	 * @param {number} x - x coord of location
	 * @param {number} y - y coord of location
	*/
	constructor(text, x, y){
		var particleElement = document.createElement('div');
		particleElement.style.left = x + "px";
		particleElement.style.top = y + "px";
		particleElement.style.opacity = "1";
		particleElement.innerHTML = text;
		super(particleElement,
			element => {
				element.style.top = (parseInt(element.style.top.replace('px', '')) - 10) + 'px';
				element.style.left = (parseInt(element.style.left.replace('px', '')) + game.random.uniform(-8, 8)) + 'px';
				element.style.opacity = parseFloat(element.style.opacity) * 0.9;
			},
		1);
	}
}

class Video {
	/**
	 * Video storage
	 * @param {string} id - eg. Ekg7fH2t40U
	 * @param {number} length - duration in seconds of entire video
	 * @param {string} title
	 * @param {string} artist
	 * @param {string[]} categories - (default: [])
	 * @param {number} startTime - in seconds (default: 0)
	 * @param {number} endTime - in seconds (default: -1)
	*/
	constructor(id, length, title = '', artist = '', categories = [], startTime = 0, endTime = -1){
		this.id = id;
		this.length = length;
		this.title = title;
		this.artist = artist;
		this.categories = categories;
		this.startTime = startTime;
		this.endTime = endTime;
	}
	/**
	 * @return {string} title/artist info (if possible)
	*/
	get desc(){
		return this.title + ' - ' + this.artist;
	}
	/**
	 * @return {number} duration in seconds
	*/
	get duration(){
		return (this.endTime !== -1 ? this.endTime : this.length) - this.startTime;
	}
	/**
	 * @return {string} video url
	*/
	get url(){
		var u = 'https://www.youtube.com/embed/' + this.id + '?autoplay=1';
		if (this.startTime !== 0){
			u += '&start=' + this.startTime;
		}
		if (this.endTime !== -1){
			u += '&end=' + this.endTime;
		}
		return u;
	}
}

class Achievement{
	/**
	 * @param {string} name
	 * @param {string} desc
	 * @param {function} criteriaFunction - function to determine whether the criteria are satisfied
	*/
	constructor(name, desc, criteriaFunction){
		this.name = name;
		this.desc = desc;
		this.criteriaFunction = criteriaFunction;
	}
	get earned(){
		return game.player.achievements.includes(this.id);
	}
	/** @returns {HTMLDivElement} achievement button */
	get element(){
		// button
		var div = document.createElement('div');
		div.classList.add('upgrade_buy_button');
		div.id = "achievement_" + this.name;
		div.onmousemove = () => this.tooltip();
		div.onmouseout = () => clearTooltip();
		// name
		div.innerHTML = this.icon;
		return div;
	}
	/** @returns {string} icon of achievement button */
	get icon(){
		// take the first letter of the first one or two words
		return this.name.split(' ').map(word => word[0]).join('').substring(0, 2);
	}
	get id(){
		return game.achievements.indexOf(this);
	}
	/** @returns {HTMLDivElement} achievement button */
	get unearnedElement(){
		// button
		var div = this.element;
		div.classList.add('unearnedAchievement');
		div.innerHTML = '?';
		div.style.color = 'red';
		return div;
	}
	earn(){
		game.player.achievements.push(this.id);
	}
	tooltip(){
		// function to update the tooltip
		tooltip('<b>' + this.name + '</b><br>' + this.desc);
	}
}

class AchievementSeries{
	/**
	 * @param {string} nameFunction
	 * @param {string} descFunction
	 * @param {function} criteriaFunctionFunction
	 * @param {number} max
	*/
	constructor(nameFunction, descFunction, criteriaFunctionFunction, max){
		this.nameFunction = nameFunction;
		this.descFunction = descFunction;
		this.criteriaFunctionFunction = criteriaFunctionFunction;
		this.max = max;
	}
	get array(){
		return range(this.max).map(
			i => new Achievement(this.nameFunction(i), this.descFunction(i), this.criteriaFunctionFunction(i))
		);
	}
}

// rpg classes

class RPGFloor{
	/**
	 * @param {string} color - color used for the background
	 * @param {string} name
	 * @param {string} desc
	*/
	constructor(color, name = "", desc = ""){
		this.color = color;
		this.name = name;
		this.desc = desc;
	}
	get element(){
		var span = document.createElement('span');
		span.style.backgroundColor = this.color;
		return span;
	}
}

class RPGObject{
	/**
	 * @param {string} icon - character(s) to use (will be ONE character, randomly chosen)
	 * @param {string} color
	 * @param {string} name
	 * @param {string} desc
	 * @param {number} hp
	*/
	constructor(icon, color = "white", name = "", desc = "", hp = Infinity){
		this.icon = icon;
		this.color = color;
		this.name = name;
		this.desc = desc;
		this.hp = hp;
	}
	get element(){
		var span = document.createElement('span');
		span.innerHTML = game.random.choice(this.icon);
		span.style.color = game.random.choice(this.color.split(' '));
		return span;
	}
}

class RPGEntity extends RPGObject{
	/**
	 * @param {string} icon - character(s) to use (will be ONE character, randomly chosen)
	 * @param {string} color
	 * @param {string} name
	 * @param {string} desc
	 * @param {number} hp
	 * @param {number} attack
	*/
	constructor(icon, color = "white", name = "", desc = "", hp = 1, attack = 0){
		super(icon, color, name, desc, hp);
		this.attack = attack;
	}
}

class RPGTile{
	/**
	 * @param {RPGFloor} floor - floor of tile
	 * @param {RPGObject} object - object/creature standing on tile
	*/
	constructor(floor, object = undefined){
		this.floor = floor;
		this.object = object;
	}
	get element(){
		var span = this.floor.element;
		span.appendChild(this.object.element);
		span.onmousemove = () => this.tooltip();
		span.onmouseout = () => clearTooltip();
		return span;
	}
	tooltip(){
		// function to update the tooltip
		var innerHTML = this.object.name + ', ' + this.floor.name;
		tooltip(innerHTML);
	}
}
// constants

var game = {
	get globalBonus(){
		return 1 + 0.01 * game.player.prestige;
	},
	/** @return {number} number of snuegs for next prestige level */
	get nextPrestige(){
		if (game.player.lifetimeSnueg <= 0){
			return 1e9;
		}
		var nextNumber = game.thisPrestigeNumber + 1;
		return Math.pow(nextNumber, 5) * 1e9;
	},
	get production(){
		return sum(this.buildings.map(building => building.totalProduction));
	},
	/** @return {number} prestige gain if prestiged now */
	get thisPrestigeNumber(){
		return Math.floor(Math.pow(game.player.lifetimeSnueg/1e9, 1/5));
	},
	/** @type {Achievement[]} */
	achievements: [
		new Achievement("Lucky", "Every 2 seconds this achievement has a one in a million chance of unlocking. Should take you about two weeks...", () => Math.random() < 1e-6),
		new Achievement("Picky", "Skip twenty songs in one session", () => 20 <= game.youtube.skips),
		new Achievement("Well-Informed", "Ask the guide for advice 50 times in one session", () => 50 <= game.debug.guideClicks),
		new Achievement("Prepared", "Back your save up", () => false), // DO NOT CHANGE THE ID OF THIS - SHOULD REMAIN 3
		new Achievement("6 9", "Have exactly 69 SNG 69000s", () => game.buildings[5].amount === 69),
		new Achievement("m o w mow mow mow", "mow mow mow mow mow mow mow mow mow mow mow mow mow mow", () => false), // DO NOT CHANGE THE ID OF THIS - SHOULD REMAIN 5
		new Achievement("Closure", "Earn every achievement - you win! :D", () => game.player.achievements.length === game.achievements.length),
		new Achievement("Efficient", "Buy every upgrade", () => game.player.upgrades.length === game.upgrades.length),
	],
	/** @type {AchievementSeries[]} */
	achievementSeries: [],
	buildings: [
		new Building('Snueg', 10, 0.1, "A warm snueg."),
		new Building('Megasnueg', 60, 0.5, "A really big snueg, more efficiently transferring warmth and affection."),
		new Building('Snueggr', 400, 4, "An unpaid intern to snueg you cheaply."),
		new Building('Snueggotron', 2e3, 10, "A simple robot designed to automatically snueg you."),
		new Building('SNG 9000', 6e3, 40, "A half-sentient robot designed to automatically snueg you."),
		new Building('SNG 69000', 25e3, 100, "A fully sentient robot designed to snueg you with maximum simulated affection."),
		new Building('It&apos;s newegg', 125e3, 400, "For a nominal fee you too can own your own snueg-themed website."),
		new Building('G&eacute;&ucirc;&ntilde;s', 666666, 1666,
			"An unholy abomination, you can use particle colliders to smash two of them together to get their antiparticle, the snueg.",
			() => game.youtube.play(0)),
		new Building('Snuegland', 3e6, 7e3, "A magical kingdom teeming with snuegs, ripe for the snatching!"),
		new Building('Snoo', 20050623, 2e4, "These strange little critters only need a G added to them to make them snuegs. Seems simple enough..."),
		new Building('Snuegworld', 1.69e8, 6.9e4, "An entire world filled with snueg! :D"), // todo unlock slipworld-style minigame
		new Building('I. D. T. S.', 1.23456789e9, 222222, "The <i>Interdimensional Transsnuegginator</i> is a device to harness snueggery from other dimensions."),
	],
	debug: {
		guideClicks: 0,
		loadTime: new Date(),
		log: [],
		newsTime: new Date(),
		userAgent: navigator.appVersion,
		version: version,
	},
	mouse: {
		/** @returns {number} base clicks from relevant upgrades */
		get base(){
			var fromProduction = game.production * 
				sum(game.upgrades.map(upgrade => upgrade.special.includes("fromProduction") && upgrade.purchased ? upgrade.bonus : 0));
			return 1 + fromProduction;
		},
		/** @returns {number} bonus from relevant upgrades */
		get bonus(){
			return product(game.upgrades.map(upgrade => upgrade.special.includes("mouse") && upgrade.purchased ? upgrade.bonus : 1));
		},
	},
	news: [
		"I like snueg.",
		"I love to snueg.",
		"licc",
		"Must... forevrially... snueg...",
		"Snueg is love, snueg is life.",
		"Snuegging is the best!",
		"That's the power of snueg.",
		"UwU",
		"Wow, snueg is great.",
	],
	/** @type {Particle[]} */
	particles: [],
	player: {
		/** @type {number[]} */
		achievements: [],
		/** @type {number[]} */
		buildingClicks: [],
		/** @type {number[]} */
		buildings: [],
		lastSave: 0,
		lifetimeSnueg: 0,
		prestige: 0,
		snueg: 0,
		snugBugClicks: 0,
		startTime: +new Date(),
		/** @type {number[]} */
		upgrades: [],
	},
	random: {
		/**
		 * @param {any[]} array
		 * @return {any} random item from array
		*/
		choice(array){
			return array[Math.floor(Math.random() * array.length)];
		},
		/**
		 * Uniform random integer between min and max
		 * @param {number} min
		 * @param {number} max
		 * @return {number} - number in [min, max)
		*/
		randint(min, max){
			return Math.floor(this.uniform(min, max));
		},
		/**
		 * Uniform random number between min and max
		 * @param {number} min
		 * @param {number} max
		 * @return {number}
		*/
		uniform(min, max){
			return Math.random() * (max-min) + min;
		},
	},
	rpg : {
		worldSize: 16,
		entities: [
			new RPGEntity('f', 'maroon', 'Fox', 10, 2),
		],
		floors: [
			new RPGFloor('green', 'Grass'),
		],
		objects: [
			new RPGObject('&nbsp;', 'transparent', 'Air'),
			new RPGObject('.,\'`', 'lime darkgreen', 'Grass'),
			new RPGObject('"', 'lime darkgreen', 'Shrub'),
			new RPGObject('.', 'grey darkgrey silver', 'Pebble'),
			new RPGObject('O', 'brown', 'Tree'),
		],
		toggle(){
			document.getElementById('rpg').style.display = document.getElementById('rpg').style.display === "block" ? "none" : "block";
		},
		unlock(){
			if (document.getElementById('rpg').style.display !== 'block'){
				document.getElementById('rpg').style.display = 'block';
			}
		},
		worldGen(){
			var world = document.createElement('div');
			range(this.worldSize).map(row => {
				range(this.worldSize).map(col => {
					var floor = game.random.choice(this.floors);
					var object = game.random.choice(this.objects);
					var element = (new RPGTile(floor, object)).element;
					element.id = "rpgTile" + row + "-" + col;
					world.appendChild(element);
				});
				world.appendChild(document.createElement('br'));
			});
			document.getElementById('rpgdisp').innerHTML = '';
			document.getElementById('rpgdisp').appendChild(world);
		}
	},
	settings: {
		autosaveInterval: 30 * 1000,
		fps: 20,
		newsUpdateInterval: 30 * 1000,
		nonEssentialUpdateInterval: 2 * 1000,
	},
	upgrades: [
		// snueg
		new Upgrade('Decasnueg', 1e2, 1.5, [0], "A <i>really</i> warm snueg."),
		new Upgrade('Hectosnueg', 1e3, 1.5, [0], "A <i>really really</i> warm snueg."),
		new Upgrade('Kilosnueg', 1e4, 1.5, [0], "A <i>really, really, really</i> warm snueg."),
		new Upgrade('Myriasnueg', 1e5, 1.5, [0], "A <i>really, r-</i>... dude, it's just a warm-ass snueg."),
		new Upgrade('Hebdosnueg', 1e6, 1.5, [0], "Did you even know this used to be a metric prefix? I didn't. Must be a warm fuckin&apos; snueg."),
		// megasnueg
		new Upgrade('Floofy Megasnuegs', 6e2, 1.2, [1], "Makes the megasnuegs even floofier!"),
		new Upgrade('Woolen Megasnuegs', 6e3, 1.2, [1], "Makes the megasnuegs soopr soff!"),
		new Upgrade('Cloud Megasnuegs', 6e4, 1.2, [1], "Clouds are like super soft, right? Let&apos;s just use those!"),
		new Upgrade('Kitten Megasnuegs', 6e5, 1.2, [1],
			"The only thing softer than clouds is kittens!", [],
			() => game.youtube.playCategory('cat')),
		new Upgrade('Genetically Engineered Kitten Megasnuegs', 6e6, 1.1, [1],
			"Genetically engineer the kittens to give even fluffier megasnuegs.", [],
			() => game.youtube.playCategory('cat')),
		// Snueggr
		new Upgrade('Minimum Wage Snueggrs', 4e3, 1.1, [2], "Pays the unpaid interns to motivate them more."),
		new Upgrade('Beyond Minimum Wage Snueggrs', 4e4, 1.1, [2], "Pays the slightly paid interns even more."),
		new Upgrade('Almost Livable Wage Snueggrs', 4e5, 1.1, [2], "Pays the interns almost a living wage. Almost."),
		new Upgrade('Livable Wage Snueggrs', 4e6, 1.1, [2], "Pays the interns a living wage."),
		new Upgrade('Decent Wage Snueggrs', 4e7, 1.1, [2], "Pays the interns a decent wage, allowing for extra free time to snueg."),
		// Snuegotron
		new Upgrade('Oiling', 2e4, 1.1, [3], "Oil helps the snuegotron move faster, providing more snuegs."),
		new Upgrade('Coolant', 2e5, 1.1, [3], "Coolant allows the snuegotron to operate faster without overheating."),
		new Upgrade('Snueg Processing Unit', 2e6, 1.1, [3], "An SPU will allow snueggotrons to snueg with greater care."),
		new Upgrade('Snueg Nexus Unit Extended Graphics', 2e7, 1.1, [3], "A snueg nexus unit graphics chip (SNUEG chip) will allow better processing of snuegs."),
		// Gneus
		new Upgrade('Parallel G&eacute;&ucirc;&ntilde;s Collisions', 6666666, 1.1, [7], "Parallel colliders make for more snueg."),
		new Upgrade('G&eacute;&ucirc;&ntilde;s Colliders in Series', 66666666, 1.1, [7], "Colliders in series make for more even more snueg."),
		// Snuegland
		new Upgrade('Duchies', 3e7, 1.1, [8], "Snueg duchies will enhance the administration of Snuegland."),
		new Upgrade('Counties', 3e8, 1.1, [8], "Snueg counties will enhance the administration of Snuegland even further."),
		// Snoo
		new Upgrade('Baronies', 3e9, 1.1, [8], "Snueg baronies will enhance the administration of Snuegland yet further."),
		new Upgrade('Subreddits', 2e8, 1.1, [9], "Subreddits will help corral the snoos, allowing for more efficient reaping."),
		new Upgrade('Admins', 2e9, 1.1, [9], "Admins will frighten the snoos, allowing for faster culling."),
		new Upgrade('Spezzing Protocols', 2e10, 1.1, [9], "Permit admins to spez unflattering snoos, allowing for more optimal harvest."),
		// Snuegworld
		new Upgrade('Snuegmoon', 1.69e9, 1.1, [10], "A snuegmoon will allow snuegtides on snuegworld."),
		new Upgrade('Snuegstar', 1.69e10, 1.1, [10], "A snuegstar will allow snuegphotosynthesis in snuegplants on snuegworld."),
		new Upgrade('Snueggalaxy', 1.69e11, 1.1, [10], "A snueggalaxy will allow sn-... well, you get the idea."),
		// Snuegworld
		new Upgrade('5th Dimension', 1.23456789e10, 6/5, [11], "A fifth dimension will improve the IDTS by a whopping 20%!"),
		new Upgrade('6th Dimension', 1.23456789e11, 7/6, [11], "A sixth dimension will improve the IDTS by a whopping 17%!"),
		new Upgrade('7th Dimension', 1.23456789e12, 8/7, [11], "A seventh dimension will improve the IDTS by a whopping 14%!"),
		new Upgrade('8th Dimension', 1.23456789e13, 9/8, [11], "A eighth dimension will improve the IDTS by a whopping 13%!"),
		new Upgrade('9th Dimension', 1.23456789e14, 10/9, [11], "A ninth dimension will improve the IDTS by a whopping 11%!"),
		new Upgrade('10th Dimension', 1.23456789e15, 11/10, [11], "A tenth dimension will improve the IDTS by a whopping 10%!"),
		// etc
		new Upgrade('Clickysnueg', 750, 2, [], "Makes the cursor floofier so the clicks are nice and soft UwU", "mouse"),
		new Upgrade('Snueg Siphon', 1e3, 0.01, [], "Siphons SPS from your buildings, giving your mouse an extra 1% of your production.", "fromProduction"),
		new Upgrade('Snueg Straw', 1e6, 0.01, [], "Siphons SPS from your buildings, giving your mouse an extra 1% of your production.", "fromProduction"),
		new Upgrade('Snueg Vacuum', 1e9, 0.01, [], "Siphons SPS from your buildings, giving your mouse an extra 1% of your production.", "fromProduction"),
		new Upgrade('Snueg Towhook', 1e12, 0.01, [], "Siphons SPS from your buildings, giving your mouse an extra 1% of your production.", "fromProduction"),
	],
	youtube: {
		bufferTime: 2, // s
		/** @type {Video} */
		current: undefined,
		/** @type {Video} */
		last: undefined,
		skips: 0,
		/** @type {number} */
		timeout: -1,
		videos: [
			// cute music only pls
			// 0
			new Video('Ekg7fH2t40U', 1, 'gneurshk'),
			new Video('rXMB5WSCVks', 87, 'bad moew', 'Bongo Cat', ['music'], 0, 80),
			new Video('AeENh1TqsKY', 88, 'ＭａｙｕｒｉＷａｖｅ', 'Stost', ['music']),
			new Video('9wnNW4HyDtg', 56, 'Ayaya! Ayaya! Intensifies', 'No. 8', ['music']),
			new Video('9Gj47G2e1Jc', 476, 'Plastic Love', 'Mariya Takeuchi', ['music']), // exempt from music rules
			new Video('yQm4CnHMwxc', 14, 'Snow leopard purr', '', ['cat']),
			new Video('dAUpL62-FLM', 44, 'Cougar Talk...', '', ['cat']),
			new Video('W461djpQl2s', 19, 'Purring Cougar Kneading & Sucking', '', ['cat']),
			new Video('mNrXMOSkBas', 202, 'Smile', 'Pinkie Pie', ['music']),
			new Video('fZ2f6lFH5cg', 70, 'Laughter', 'Pinkie Pie', ['music']),
			// 10
			new Video('b9EqoWzTKRY', 23, 'Cupcakes', 'Pinkie Pie', ['music']),
			new Video('ncN8JeG-dZ0', 95, 'DDU-DU DDU-DU', 'Bongo Cat', ['music'], 0, 92),
			new Video('zoAQfKb42ig', 140, 'See You Again', 'Bongo Cat', ['music'], 5, 130),
			new Video('4atH_Km4KaQ', 25, 'Golden Ticket', 'South Park', ['music']),
			new Video('s-DQM-1atK0', 80, 'Kyle\'s Mom\'s a Bitch', 'South Park', ['music']),
			new Video('bOR38552MJA', 124, 'Blame Canada', 'South Park', ['music'], 0, 95),
			new Video('E1UEDulwWkY', 131, 'Minorities in my Waterpark', 'South Park', ['music']),
			new Video('MtN1YnoL46Q', 191, 'The Duck Song', 'Bryant Oden', ['music'], 3, 190),
			new Video('Dc-RRLKeilk', 139, 'Fresh Prince Of Dickbutt Bel Air', 'A.COE', ['music']),
		],
		/** @return {number} total soundtrack length, in seconds */
		get soundtrackDuration(){
			return sum(game.youtube.category('music').map(song => song.duration));
		},
		/**
		 * get all videos of a category
		 * @param {string} categoryName
		*/
		category(categoryName){
			return this.videos.filter(video => video.categories.includes(categoryName));
		},
		/**
		 * play something, then queue music
		 * @param {Video|number} video - video object or id to play (in game.youtube.videos, eg. 0)
		*/
		play(video = undefined){
			this.last = this.current;
			clearTimeout(this.timeout);
			// get video
			if (video === undefined){
				this.playCategory('music');
				return;
			}
			if (typeof video === 'number'){
				video = this.videos[video];
			}
			log('playing ' + video.id);
			// set video
			document.getElementById('youtube').src = video.url;
			document.getElementById('youtubeDesc').innerHTML = video.desc;
			// set timeout (to queue next video)
			this.timeout = setTimeout(() => this.play(), (video.duration + this.bufferTime)*1000);
			// save as new last
			this.current = video;
		},
		/**
		 * play something in a category
		 * @param {string} categoryName
		*/
		playCategory(categoryName){
			if (categoryName === 'cat'){
				game.achievements[5].earn();
			}
			this.play(game.random.choice(this.category(categoryName)));
		},
		playLast(){
			if (this.last){
				this.play(this.last);
			}
		},
		skip(){
			this.skips += 1;
			this.play();
		}
	},
	powerOverwhelming(){
		// unlock all achievements
		this.achievements.forEach(achievement => achievement.earn());
		// unlock all upgrades
		this.upgrades.forEach(upgrade => upgrade.addToPlayer());
		// give insane money
		this.player.snueg += 1e33;
		// unlock rpg
		this.rpg.unlock();
	},
	secondsOfProduction(t){
		return this.production * t;
	},
	softReset(){
		this.player.buildingClicks = [];
		this.player.buildings = [];
		this.player.snueg = 0;
		this.player.upgrades = [];
	},
	spawnSnugBug(){
		var element = document.createElement('span');
		element.innerHTML = game.random.choice(['🐞', '🐛', '🐜', '🐝']);
		element.classList.add('snugBug');
		element.onclick = () => {
			log('player clicked snugbug');
			this.player.snugBugClicks += 1;
			addSnueg(this.secondsOfProduction(600));
			setTimeout(() => this.spawnSnugBug(), 600*1000);
			element.remove();
		};
		element.style.left = this.random.randint(window.screen.width*0.1, window.screen.width*0.7) + "px";
		element.style.top = this.random.randint(window.screen.height*0.1, window.screen.height*0.9) + "px";
		element.style.opacity = 1;
		var tick = e => {
			e.style.top = (parseInt(e.style.top.replace('px', '')) + this.random.uniform(-20, 20)) + 'px';
			e.style.left = (parseInt(e.style.left.replace('px', '')) + this.random.uniform(-20, 20)) + 'px';
			e.style.opacity = parseFloat(e.style.opacity) * 0.99;
		};
		new Particle(element, tick, 10);
	},
	toggleStats(){
		/** @type {HTMLDivElement} */
		var element = document.getElementById('statPage');
		element.style.display = element.style.display === 'block' ? 'none' : 'block';
		log('stat page toggled');
	}
};
// must be defined after game is defined since game.buildings isn't defined yet
game.achievementSeries = [
	// buying a building for the first time
	new AchievementSeries(
		n => "First " + game.buildings[n].name,
		n => "Purchase one " + game.buildings[n].name,
		n => () => 0 < game.player.buildings[n],
		game.buildings.length
	),
	// 50 of a building
	new AchievementSeries(
		n => "Fiftieth " + game.buildings[n].name,
		n => "Purchase fifty " + game.buildings[n].name,
		n => () => 50 <= game.player.buildings[n],
		game.buildings.length
	),
	// 100 of a building
	new AchievementSeries(
		n => "Hundredth " + game.buildings[n].name,
		n => "Purchase a hundred " + game.buildings[n].name,
		n => () => 100 <= game.player.buildings[n],
		game.buildings.length
	),
	// 10^n income
	new AchievementSeries(
		n => bigNumber(Math.pow(10, n), true) + " snueg/s income",
		n => "Get " + bigNumber(Math.pow(10, n), true) + " snueg/s income",
		n => () => Math.pow(10, n) <= game.production,
		10
	),
	// 10^n lifetime snueg
	new AchievementSeries(
		n => bigNumber(Math.pow(10, n), true) + " snueg lifetime earnings",
		n => "Get " + bigNumber(Math.pow(10, n), true) + " snueg lifetime earnings",
		n => () => Math.pow(10, n) <= game.player.lifetimeSnueg,
		16
	),
	// 10^n minutes played
	new AchievementSeries(
		n => bigNumber(Math.pow(10, n), true) + " minute" + (n ? 's': '') + " played",
		n => "Play snueg clicker for " + bigNumber(Math.pow(10, n), true) + " minute" + (n ? 's': ''),
		n => () => Math.pow(10, n) <= (new Date() - game.player.startTime)/(60000),
		6
	),
	// 10^n prestigeing achievement series
	new AchievementSeries(
		n => bigNumber(Math.pow(10, n), true) + " prestige earned",
		n => "Earn " + bigNumber(Math.pow(10, n), true) + " prestige",
		n => () => Math.pow(10, n) <= game.player.prestige,
		7
	),
	// 10^n snugbug achievement series
	new AchievementSeries(
		n => bigNumber(Math.pow(10, n), true) + " snugbugs clicked",
		n => "Click " + bigNumber(Math.pow(10, n), true) + " snugbugs",
		n => () => Math.pow(10, n) <= game.player.snugBugClicks,
		4
	),
	// 25n upgrade series
	new AchievementSeries(
		n => (25*n + 25) + " upgrades bought",
		n => "Buy " + (25*n + 25) + " upgrades",
		n => () => (25*n + 25) <= game.player.upgrades.length,
		1
	),
];

// functions

// cookie shit (borrowed from spacegame's main.js)
function delete_cookie(name) {
	document.cookie = [name, '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/; domain=.', window.location.host.toString()].join('');
}
function read_cookie(name){ // https://stackoverflow.com/a/11344672/2579798
	var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
	if (result){
		result = JSON.parse(result[1]);
	}
	return result;
}
function write_cookie(name, value){ // https://stackoverflow.com/a/11344672/2579798
	var cookie = [name, '=', JSON.stringify(value), '; domain=.', window.location.host.toString(), '; path=/;'].join('');
	document.cookie = cookie;
}
function download(content, fileName, contentType){ // https://stackoverflow.com/questions/34156282/how-do-i-save-json-to-local-text-file/34156339#34156339
	var a = document.createElement("a");
	var file = new Blob([content], {type: contentType});
	a.href = URL.createObjectURL(file);
	a.download = fileName;
	a.click();
}
function importSave(){
	navigator.clipboard.readText().then(
		clipText => document.cookie = atob(clipText));
	location.reload();
}
function exportSave(){
	var data = btoa(document.cookie);
	log("Exported Save.");
	return data;
}
function downloadSave(){
	game.achievements[3].earn();
	download(exportSave(), 'snuegClickerBackup.txt', 'text/plain');
}

// other

/** @param {number} amount amount of snueg to add to player */
function addSnueg(amount){
	game.player.snueg += amount;
	game.player.lifetimeSnueg += amount;
}

/**
 * @param {number} amount number
 * @param {boolean} integer should the output be rounded? (default = false)
 * @return {string} prettified number
*/
function bigNumber(amount, integer = false){
	// 245 -> 245
	// 3245 -> 3.245 k
	// 3950847 -> 3.950 M
	if (amount < 1000){
		return integer ? "" + round(amount) : amount.toFixed(3);
	}
	var prefixes = " k M B T Qa Qi Sx Sp Oc No Dc".split(" "); // todo add more varieties for settings: SI, 1.0e10, ...
	var i = Math.floor(Math.log(amount)/Math.log(1000));
	var factor = Math.pow(1000, i);
	return round(amount/factor, 3).toFixed(3) + " " + prefixes[i];
}

function clearTooltip(){
	// erase current tooltip
	var tooltip = document.getElementById("tooltip");
	tooltip.innerHTML = "";
	tooltip.style.top = "-5%";
	tooltip.style.left = "0px";
}

function gameTick(){
	var t = 1/game.settings.fps;
	// was the player away?
	if (2*game.settings.autosaveInterval < new Date() - game.player.lastSave){
		// offline rewards
		t = (new Date() - game.player.lastSave)/1000 * 0.01; // 1% offline efficiency
		saveGame();
	}
	// production
	game.buildings.forEach(building => building.produce(t));
	updateSnuegCount();
}

function guide(){
	game.debug.guideClicks += 1;
	var helpstring;
	/** @type {HTMLDivElement} */
	var speechBubble = document.getElementById("guideSpeechBubble");
	/** @type {number} */
	var n = game.random.randint(0, 5);
	log("Guide string " + n);
	switch (n){
		case 0: // upgrade advice
			for (var i = 1; i < game.upgrades.length; i++){
				var upgrade = game.upgrades[i];
				// most upgrades are worth 10s of production...
				if (!upgrade.purchased && upgrade.price < Math.max(10*game.production, game.player.snueg)){
					helpstring = "The <b>" + upgrade.name + "</b> upgrade is looking pretty cheap right now... only " + bigNumber(upgrade.price, true) + " snueg!";
					break;
				}
			}
			if (helpstring){
				break;
			}
			/* falls through */
		case 1: // building advice
			var bestBuilding = game.buildings[0];
			game.buildings.forEach(building => {
				if (building.roiWaitTime < bestBuilding.roiWaitTime){
					bestBuilding = building;
				}
			});
			helpstring = "I recommend purchasing the <b>" + bestBuilding.name + "</b>! It's the best deal right now!";
			break;
		case 2: // nonsense
			helpstring = game.random.choice([
				"Do you liek snueg too, hoomon?",
				"I liek snueg",
				"Pls gib guide snueg",
			]);
			helpstring += " UwU";
			break;
		case 3: // gameplay advice
			helpstring = game.random.choice([
				"Don&apos;t forget to purchase upgrades! They can help your SPS (Snuegs per second) immensely!",
				"If the game is going slow, it might be time to prestige up! Click the prestige button in the upper left once you get a couple dozen points or so!",
			]);
			break;
		default:
			helpstring = "Hiya! I'm the guide! Click me to get some advice! :D";
	}
	// no duplicates
	if (helpstring === speechBubble.innerHTML){
		guide();
	}
	else {
		speechBubble.innerHTML = helpstring;
	}
}

/** @param {string} string string to log */
function log(string){
	game.debug.log.push(string);
	console.log(string);
}

function news(){
	document.getElementById('news').innerHTML = game.random.choice(game.news);
}

function nonEssentialUpdate(){
	// check if rpg unlicked
	if (1e6 * Infinity <= game.player.lifetimeSnueg){
		game.rpg.unlock();
	}
	// check if a new achievement is unlocked
	game.achievements.forEach(
		achievement => {
			if (!achievement.earned && achievement.criteriaFunction()){
				achievement.earn();
			}
		}
	);
	// clean up achievements
	game.player.achievements = [...new Set(game.player.achievements)];
	game.player.achievements.sort();
	// update statistics page
	statUpdate();
}

/** @param {string} filename to play */
function play(filename){
	(new Audio(filename)).play();
}

function prestige(){
	// confirm
	var pp = game.thisPrestigeNumber;
	if (!confirm("Are you sure you want to prestige up? You will lose all your snueg and buildings, but will gain a permanent " +
		pp + "% boost to your snueg production from all sources.")){
		return;
	}
	// follow through
	if (game.player.prestige === undefined){
		game.player.prestige = pp;
	}
	else {
		game.player.prestige += pp;
	}
	// DELETE
	game.softReset();
	// play sound
	play('prestige.mp3');
}

function product(array){
	return array.reduce((a, b) => a * b, 1);
}

/**
 * @param {number} progress fraction in [0, 1]
 * @return {HTMLDivElement} progress bar element
*/
function progressBar(progress){
	var progressBarContainer = document.createElement("div");
	progressBarContainer.classList.add('progressBarContainer');
	var progressBar = document.createElement("div");
	progressBar.classList.add('progressBar');
	progressBar.style.width = 100 * progress + "%";
	progressBarContainer.appendChild(progressBar);
	return progressBarContainer;
}

/** @param {number} n */
function range(n){
	return [...Array(n).keys()];
}

function redrawInterface(){
	// autosave notification
	var autosaveCountdown = Math.floor((+game.player.lastSave + game.settings.autosaveInterval - new Date())/1000);
	document.getElementById('autosave').innerHTML = "autosave in " + autosaveCountdown + "s";
}

/**
 * @param {number} number to round
 * @param {number} digits to round to (default 0)
 * @return {number} rounded number
*/
function round(number, digits = 0){
	number *= Math.pow(10, digits);
	number = Math.round(number);
	number /= Math.pow(10, digits);
	return number;
}

/**
 * @param {boolean} isManual is this save manually triggered, or automatic?
*/
function saveGame(isManual = false){
	var saveFile = {};
	saveFile.settings = game.settings;
	game.player.lastSave = +new Date();
	saveFile.player = game.player;
	write_cookie("snueg", saveFile);
	game.debug.lastSave = new Date();
	if (isManual){
		log("Successfully manually saved game!");
	}
}

// https://stackoverflow.com/a/2956980/2579798
function setIntervalX(callback, delay, repetitions) {
    var x = 0;
    var intervalID = window.setInterval(function () {
       callback();
       if (++x === repetitions) {
           window.clearInterval(intervalID);
       }
    }, delay);
}

function snuegButton(){
	// add snueg
	var amount = game.mouse.base * game.mouse.bonus;
	addSnueg(amount);
	// update snueg amount
	updateSnuegCount();
	// flying numbers
	new FlyingText(bigNumber(amount, true), window.event.clientX, window.event.clientY);
	// log action
	log("Clicked snueg button");
}

function statUpdate(){
	// basic stats
	/** @type {HTMLUListElement} */
	var statElement = document.getElementById('statPageBasic');
	statElement.innerHTML = '';
	var stats = [
		'Lifetime Snueg: ' + game.player.lifetimeSnueg,
		'Snugbug Clicks: ' + game.player.snugBugClicks,
	];
	stats.forEach(
		stat => {
			var li = document.createElement('li');
			li.innerHTML = stat;
			statElement.appendChild(li);
		}
	);
	// blank achievements
	/** @type {HTMLDivElement} */
	var achievementElement = document.getElementById('statPageAchievements');
	achievementElement.innerHTML = '';
	// add all achievements earned
	game.achievements.forEach(
		achievement => {
			if (achievement.earned){
				achievementElement.appendChild(achievement.element);
			}
			else{
				achievementElement.appendChild(achievement.unearnedElement);
			}
		}
	);
	// update achievement progress
	/** @type {HTMLSpanElement} */
	var achievementProgress = document.getElementById('statAchievementProgress');
	var percent = Math.round(100 * game.player.achievements.length / game.achievements.length);
	achievementProgress.innerHTML = game.player.achievements.length + '/' + game.achievements.length + ' achievements earned (' + percent + '%)';
}

function sum(array){
	return array.reduce((a, b) => a + b, 0);
}

/**
 * function to update the tooltip
 * @param {string} innerHTML
 * @return {HTMLDivElement} tooltip
*/
function tooltip(innerHTML = ''){
	/** @type {HTMLDivElement} */
	var div = document.getElementById("tooltip");
	div.style.top = Math.min(window.event.clientY, window.innerHeight*0.85) - 25 + "px";
	div.style.left = window.event.clientX - 450 + "px";
	// text
	div.innerHTML = innerHTML;
	return div;
}

/**
 * updates the prestige bar
 * @return {number} progress to next level
*/
function updatePrestige(){
	document.getElementById('prestigeNumber').innerHTML = game.thisPrestigeNumber;
	document.getElementById('prestigeProgress').innerHTML = '';
	var progress = game.player.lifetimeSnueg / game.nextPrestige;
	document.getElementById('prestigeProgress').appendChild(progressBar(progress));
	return progress;
}

function updateSnuegCount(){
	var n = bigNumber(game.player.snueg, true);
	document.getElementById("snueg_counter").innerHTML = n;
	document.getElementById("snueg_production_counter").innerHTML = "Production: " + bigNumber(game.production) + "/s";
	// update webpage title
	document.title = n + " snuegs - Snueg Clicker";
	// update prestige progress
	updatePrestige();
}

// main only beyond here

function main(){
	// clear warning
	document.getElementById('notsupported').remove();
	// update version div
	document.getElementById("version").innerHTML = "v. " + game.debug.version;
	// load save
	if (read_cookie("snueg")){
		var saveFile = read_cookie("snueg");
		game.player = saveFile.player;
		game.settings = saveFile.settings;
	}
	else{
		saveGame();
	}
	// set up ticks
	setInterval(redrawInterface, 1000/game.settings.fps);
	setInterval(gameTick, 1000/game.settings.fps);
	setInterval(nonEssentialUpdate, game.settings.nonEssentialUpdateInterval);
	setInterval(saveGame, game.settings.autosaveInterval);
	setInterval(news, game.settings.newsUpdateInterval);
	// set up buildings
	document.getElementById("building_panel").innerHTML = "";
	game.buildings.forEach(building => building.addToDocument());
	// set up upgrades
	document.getElementById("upgrade_panel").innerHTML = "";
	// set up achievements
	game.achievementSeries.forEach(
		achievementSeries => game.achievements.push(...achievementSeries.array)
	);
	// clones upgrade array, sorts, then adds each to document
	game.upgrades.slice().sort((a, b) => a.price - b.price).forEach(upgrade => upgrade.addToDocument());
	// clear tooltip
	clearTooltip();
	// music
	game.youtube.play(1);
	// snugbug delay
	setTimeout(() => game.spawnSnugBug(), 600*1000);
	// notification
	console.info('Snueg Clicker v. ' + version + ' loaded successfully.');
}