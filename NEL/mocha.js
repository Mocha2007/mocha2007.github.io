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
	const doesNotSpoil = () => {};
	const slowlySpoils = (me, tick) => G.lose(me.name,randomFloor(me.amount * 0.002),'decay');
	// prevent decay of certain items
	['bone', 'clay', 'limestone', 'stone']
		.forEach(s => G.getRes(s).tick = doesNotSpoil);
	// make other items decay
	['knapped tools', 'stone tools', 'metal tools', 'stone weapons', 'bow']
		.forEach(s => G.getRes(s).tick = slowlySpoils);
	// new stuff
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
		name:'soy sauce preparing',
		desc:'@[artisan]s can now produce [soy sauce] and [tofu] from [soybean]s.',
		icon:[0,1,'mochaSheet'],
		cost:{'insight':10},
		req:{'cooking':true},
	});
	
	new G.Trait({
		name:'soyboyism',
		desc:'@your people appreciate [soy] products twice as much and will be twice as happy from consuming it.',
		icon:[0,1,'mochaSheet'],
		chance:20,
		req:{'soy sauce preparing':true},
		effects:[
			{type:'function',func:function(){
				G.getDict('soy').turnToByContext['eat']['happiness']=0.2;
				G.getDict('soy sauce').turnToByContext['eat']['happiness']=0.2;
				G.getDict('tofu').turnToByContext['eat']['happiness']=0.2;
			}},
		],
	});
}
});
/*
	TODO
	soy farm
*/