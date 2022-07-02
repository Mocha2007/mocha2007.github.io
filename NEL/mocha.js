/* eslint-disable */
G.AddData({
name:'Mocha\'s mod',
author:'Mocha',
desc:'https://mocha2007.github.io/NEL/mocha.js',
engineVersion:1,
manifest:'mochaManifest.js',
requires:['Default dataset*'],
sheets:{'mochaSheet':'https://mocha2007.github.io/NEL/mochaSheet.png',}, //custom stylesheet (note : broken in IE and Edge for the time being)
func:function()
{
	//The idea in this simple example mod is to add a few elements focused around hot sauce, because hot sauce is great and I use that stuff everywhere.
	
	//First we create a couple new resources :
	new G.Res({
		name:'soybean',
		desc:'[soybean]s are loaded with nutrients and are a useful ingredient.',
		icon:[0,0,'mochaSheet'],
		turnToByContext:{'eat':{'health':0.01,'happiness':0.03},'decay':{'spoiled food':0.5}},//this basically translates to : "when eaten, generate some health and happiness; when rotting, turn into either nothing or some spoiled food"
		partOf:'food',
		category:'food',
	});
	new G.Res({
		name:'soy sauce',
		desc:'Made from [soybean]s, this [soy sauce] stays fresh for a while and will leave everyone asking for more.',
		icon:[1,0,'mochaSheet'],
		turnToByContext:{'eat':{'health':0.03,'happiness':0.1},'decay':{'soy sauce':0.95,'spoiled food':0.05}},//that last part makes hot sauce effectively have a 95% chance of simply not rotting (in effect, it decays into itself)
		partOf:'food',
		category:'food',
	});
	new G.Res({
		name:'tofu',
		desc:'Made from [soybean]s, this [tofu] stays fresh for a while and will leave everyone asking for more.',
		icon:[2,0,'mochaSheet'],
		turnToByContext:{'eat':{'health':0.03,'happiness':0.1},'decay':{'tofu':0.95,'spoiled food':0.05}},//that last part makes hot sauce effectively have a 95% chance of simply not rotting (in effect, it decays into itself)
		partOf:'food',
		category:'food',
	});
	
	//Then we augment the base data to incorporate our new resources :
		//adding hot pepper as something that can be gathered from grass
	G.getDict('grass').res['gather']['soybean']=1;
		//adding a new mode to artisans so they can make hot sauce from hot peppers
	G.getDict('artisan').modes['soy sauce']={name:'Make soy sauce',desc:'Turn 1 [soybean], 1 [water], and 1 [salt] into 1 [soy sauce].',req:{'soy sauce preparing':true},use:{'knapped tools':1}};
	G.getDict('artisan').modes['tofu']={name:'Make tofu',desc:'Turn 6 [soybean]s and 1 [water] into 7 [tofu].',req:{'soy sauce preparing':true},use:{'knapped tools':1}};
		//adding a new effect to artisans that handles the actual hot sauce preparing and is only active when the unit has the mode "hot sauce"
	G.getDict('artisan').effects.push({type:'convert',from:{'soybean':1,'water':1,'salt':1},into:{'soy sauce':1},every:1,mode:'soy sauce'});
	G.getDict('artisan').effects.push({type:'convert',from:{'soybean':6,'water':1},into:{'tofu':7},every:1,mode:'tofu'});
	
	//Then we add a new technology which is required by the artisans to gain access to the "hot sauce" mode :
	new G.Tech({
		name:'soy sauce preparing',
		desc:'@[artisan]s can now produce [soy sauce] and [tofu] from [soybean]s.',
		icon:[0,1,'mochaSheet'],
		cost:{'insight':10},
		req:{'cooking':true},
	});
	
	//Finally, we add a trait that amplifies the benefits of consuming hot sauce; it will take on average 20 years to appear once the conditions (knowing the "Hot sauce preparing" tech) is fulfilled.
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
			}},//this is a custom function executed when we gain the trait
		],
	});
	
	//There are many other ways of adding and changing content; refer to /data.js, the default dataset, if you want to see how everything is done in the base game. Good luck!
}
});