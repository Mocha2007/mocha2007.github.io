/* eslint-disable */
G.AddData({
name:'Mocha\'s mod',
author:'Mocha',
desc:'https://mocha2007.github.io/NEL/mocha.js',
engineVersion:1,
manifest:'mochaManifest.js',
requires:['Default dataset*'],
sheets:{'mochaSheet':'https://mocha2007.github.io/NEL/mochaSheet.png',},
func:function()
{
	// modified vanilla stuff
	// from http://orteil.dashnet.org/legacy/data.js
	const doesNotSpoil = (me, tick) => {
		const a = G.props['perishable materials list'];
		const i = a.indexOf(me);
		if (0 <= i)
			a.splice(i, 1);
	};
	const doesSpoil = (me, tick) => {
		if (G.checkPolicy('disable spoiling') === 'off')
			G.props['perishable materials list'].push(me);
	};
	// prevent decay of certain items
	['advanced building materials', 'archaic building materials',
		'basic building materials', 'misc materials', 'precious building materials']
		.forEach(s => G.getRes(s).tick = doesNotSpoil);
	// make other items decay
	['bow', 'knapped tools', 'log', 'lumber', 'metal tools', 'stick', 'stone tools', 'stone weapons']
		.forEach(s => G.getRes(s).tick = doesSpoil);
	// show clothing usage
	['basic clothes', 'primitive clothes']
		.forEach(s => G.getRes(s).displayUsed = true);
	// add new flavor text
	G.props['new day lines'][14] = 'In the distance, prey falls to a pack of beasts.';
	G.props['new day lines'][29] = 'Distant lands lie undisturbed.';
	G.props['new day lines'].push('You hear the cries of Zothcengs in the distance.');
	// desc fixes
	G.unitByName.digger.desc = '@digs the soil for [mud] and [stone]<>[digger]s may also rarely yield [sand], [ice], [clay], [limestone], [salt], [copper ore], and [tin ore], if available.';
	// SOY

	new G.Res({
		name:'soybean',
		desc:'[soybean]s are loaded with nutrients and are a useful ingredient.',
		icon:[0,0,'mochaSheet'],
		turnToByContext:{'eat':{'health':0.01,'happiness':0.03},'decay':{'spoiled food':0.5}},
		//this basically translates to : "when eaten, generate some health and happiness; when rotting, turn into either nothing or some spoiled food"
		partOf:'food',
		category:'food',
	});
	new G.Res({
		name:'soy sauce',
		desc:'Made from [soybean]s, this [soy sauce] stays fresh for a while and will leave everyone asking for more.',
		icon:[1,0,'mochaSheet'],
		turnToByContext:{'eat':{'health':0.03,'happiness':0.1},'decay':{'soy sauce':0.95,'spoiled food':0.05}},
		//that last part makes hot sauce effectively have a 95% chance of simply not rotting (in effect, it decays into itself)
		partOf:'food',
		category:'food',
	});
	new G.Res({
		name:'tofu',
		desc:'Made from [soybean]s, this [tofu] stays fresh for a while and will leave everyone asking for more.',
		icon:[2,0,'mochaSheet'],
		turnToByContext:{'eat':{'health':0.03,'happiness':0.1},'decay':{'tofu':0.95,'spoiled food':0.05}},
		//that last part makes hot sauce effectively have a 95% chance of simply not rotting (in effect, it decays into itself)
		partOf:'food',
		category:'food',
	});

	G.getDict('grass').res['gather']['soybean']=1;
	
	G.getDict('artisan').modes['soy sauce']={name:'Make soy sauce',desc:'Turn 1 [soybean], 1 [water], and 1 [salt] into 1 [soy sauce].',req:{'soy sauce preparing':true},use:{'knapped tools':1}};
	G.getDict('artisan').modes['tofu']={name:'Make tofu',desc:'Turn 6 [soybean]s and 1 [water] into 7 [tofu].',req:{'soy sauce preparing':true},use:{'knapped tools':1}};
	
	G.getDict('artisan').effects.push({type:'convert',from:{'soybean':1,'water':1,'salt':1},into:{'soy sauce':1},every:1,mode:'soy sauce'});
	G.getDict('artisan').effects.push({type:'convert',from:{'soybean':6,'water':1},into:{'tofu':7},every:1,mode:'tofu'});
	
	new G.Tech({
		name:'agriculture',
		desc:'@[worker]s can now produce plants without foraging.',
		icon:[24,7],
		cost:{'insight':10},
		req:{'cooking':true},
	});
	
	new G.Tech({
		name:'soy sauce preparing',
		desc:'@[artisan]s can now produce [soy sauce] and [tofu] from [soybean]s.',
		icon:[0,1,'mochaSheet'],
		cost:{'insight':10},
		req:{'cooking':true},
	});
	
	new G.Trait({
		name:'soyboyism',
		desc:'@your people appreciate [soybean,soy] products twice as much and will be twice as happy from consuming it.',
		icon:[0,1,'mochaSheet'],
		chance:20,
		req:{'soy sauce preparing':true},
		effects:[
			{type:'function',func:function(){
				G.getDict('soybean').turnToByContext['eat']['happiness']=0.2;
				G.getDict('soy sauce').turnToByContext['eat']['happiness']=0.2;
				G.getDict('tofu').turnToByContext['eat']['happiness']=0.2;
			}},
		],
	});

	new G.Unit({
		name:'farm',
		desc:'@farms stuff, like [fruit], [herb]s, and [soybean]s using [stone tools].',
		icon:[24,7],
		cost:{'archaic building materials':100},
		use:{'land':5},
		//require:{'worker':3,'stone tools':3},
		modes:{
			'off':G.MODE_OFF,
			'fruit':{name:'Farm fruit',icon:[4,7],desc:'Produce [fruit].',use:{'worker':3,'stone tools':3}},
			'herb':{name:'Farm herbs',icon:[4,6],desc:'Produce [herb]s.',use:{'worker':3,'stone tools':3}},
			'soybean':{name:'Farm soybeans',icon:[0,0,'mochaSheet'],desc:'Produce [soybean]s.',use:{'worker':3,'stone tools':3}},
		},
		effects:[
			{type:'gather',context:'farm',amount:10,max:30,mode:'any'},
			{type:'gather',context:'farm',what:{'fruit':50},max:30,mode:'fruit'},
			{type:'gather',context:'farm',what:{'herb':50},max:30,mode:'herb'},
			{type:'gather',context:'farm',what:{'soybean':50},max:30,mode:'soybean'},
		],
		gizmos:true,
		req:{'agriculture':true},
		category:'production',
	});

	// SILVER

	new G.Res({
		name:'silver block',
		desc:'A valuable, if unreliable construction material.',
		icon:[5,8], // todo
		partOf:'precious building materials',
		category:'build',
	});
	new G.Res({
		name:'silver ore',
		desc:'Ore that can be processed into [precious metal ingot]s.',
		icon:[13,8], // todo
		partOf:'misc materials',
		category:'build',
	});
	const mine = G.unitByName.mine;
	mine.modes.silver = {
		name:'Silver',icon:[13,8],desc:'Mine for [silver ore] with x5 efficiency.',req:{'prospecting':true},use:{'worker':3,'metal tools':3}
	};
	mine.effects.push(
		{type:'gather',context:'mine',what:{'silver ore':50},max:30,mode:'silver'}
	);
	const furnace = G.unitByName.furnace;
	furnace.modes.silver = {
		name:'Silver smelting',icon:[11,9],desc:'Cast [precious metal ingot]s out of 5 [silver ore] each.',use:{'worker':2,'metal tools':2},req:{'gold-working':true}
	};
	furnace.effects.push(
		{type:'convert',from:{'silver ore':5},into:{'precious metal ingot':1},repeat:1,mode:'silver'}
	);
	G.goodsByName['rocky substrate'].res.mine['silver ore'] = 0.005;

	// LODGE

	const maintain = (res, agent, minRes = 100, maxRes = 200, minAgent = 0, maxAgent = 5) => {
		return me => {
			// ensure the AGENT matches and the PRODUCT matches RES
			console.debug(res, agent);
			const unit = G.unitsOwned.filter(u => u.unit.name === agent
				// [                  gotta make sure this exists              ]
				&& u.unit.effects[u.mode.num] && u.unit.effects[u.mode.num].into
				&& u.unit.effects[u.mode.num].into[res])[0];
			if (G.resByName[res].amount < minRes && G.getUnitAmount(agent) < maxAgent)
				unit.targetAmount = maxAgent;
			else if (maxRes < G.resByName[res].amount && minAgent < G.getUnitAmount(agent))
				unit.targetAmount = minAgent;
		};
	};

	const lodge = G.unitByName.lodge;
	lodge.desc = '@can be set to manage automatic recruitment for units such as [gatherer]s, [hunter]s or [woodcutter]s<>A [lodge] is where people of all professions gather to rest and store their tools.//Lodges let you automate your tribe somewhat; should a worker fall sick or die, they will be automatically replaced if a lodge is tasked for it.';
	lodge.modes = {
		off: G.MODE_OFF,
	}
	// clever simplification :^)
	const additions = [
		['bow', 'artisan', 'bows'],
		['knapped tools', 'artisan', 'stone-knapping'],
		['log', 'woodcutter', 'woodcutting'],
		['leather', 'clothier', 'leather-working'],
		['meat', 'hunter', 'hunting'],
		['mud', 'digger', 'digging'],
		['pot', 'potter', 'pottery'],
		['seafood', 'fisher', 'fishing'],
		['stone tools', 'artisan', 'tool-making'],
	];
	additions.forEach(x => {
		const [res, agent, tech] = x;
		lodge.modes[res] = {
			name: `${tech} lodge`,
			desc: `Hire/fire 5 [${agent}]s to maintain [${res}] stocks between 100 and 200.`,
			req: {}
		};
		lodge.modes[res].req[tech] = true;
		lodge.effects.push(
			{
				type: 'function',
				func: maintain(res, agent),
				mode: res,
			}
		);
	});

	// GUILD

	const maintain2 = (res, agent, enabledId, minRes = 100, maxRes = 200) => {
		return me => {
			// ensure the AGENT matches and the PRODUCT matches RES
			const unit = G.unitsOwned.filter(u => u.unit.name === agent && u.unit.effects[u.mode.num].into[res])[0];
			if (G.resByName[res].amount < minRes)
				unit.mode = G.unitByName[agent].modes[enabledId];
			else if (maxRes < G.resByName[res].amount)
				unit.mode = G.unitByName[agent].modes.off;
		};
	};

	const guild = G.unitByName['guild quarters'];
	guild.desc = '@can be set to manage automatic recruitment for units such as [kiln]s or [carpenter workshop]s<>[guild quarters,Guilds] -that is, associations of people sharing the same profession- meet in these to share their craft and trade secrets.//They can coordinate the building of new workshops should the need arise.';
	guild.modes = {
		off: G.MODE_OFF,
	}
	const additions2 = [
		['brick', 'kiln', 'masonry', 'bricks'],
		['lumber', 'carpenter workshop', 'carpentry', 'lumber'],
	]
	additions2.forEach(x => {
		const [res, agent, tech, enabledId] = x;
		guild.modes[res] = {
			name: `${agent}\'s guild`,
			desc: `Enable/disable [${agent}]s to maintain [${res}] stocks between 100 and 200.`,
			req: {}
		};
		guild.modes[res].req[tech] = true;
		guild.effects.push(
			{
				type: 'function',
				func: maintain2(res, agent, enabledId),
				mode: res,
			}
		);
	});
}
});
/*
	TODO
	more soy shit
	more architect recipes
*/