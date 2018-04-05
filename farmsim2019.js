var fps = 20;
var att = 1;
var clock = 0;
var lastkilltime = 0;
var lastatttime = 0;
var score = 0;
var health = 100;
var paused = false;
var enemyAttacking = false;

var timeElement = document.getElementById("time");
var scoreElement = document.getElementById("score");
var healthElement = document.getElementById("health");
var enemyhealthElement = document.getElementById("hp");
var enemyNameElement = document.getElementById("enemyname");
var enemyDescElement = document.getElementById("desc");
var enemyAttNameElement = document.getElementById("attname");
var enemyImgElement = document.getElementById("img");
var readyElement = document.getElementById("ready");
var pauseElement = document.getElementById("pause");

// enemy code
var maxenemyhp,enemyhp,enemyatt,atttime;

var llama = [];
llama.name = 'Demonic Llama';
llama.img = 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Llama_lying_down.jpg/1200px-Llama_lying_down.jpg';
llama.desc = 'soopr evil bad bad pls kill';
llama.attname = 'Spit';
llama.att = 5;
llama.speed = 1.5;
llama.hp = 10;

var yuri = [];
yuri.name = 'Yuri!!!';
yuri.img = 'http://images.goodsmile.info/cgm/images/product/20170201/6231/43651/large/42f61413f2fec50155107225e94e4b20.jpg';
yuri.desc = '... on ice!';
yuri.attname = 'Skate Slash';
yuri.att = 7;
yuri.speed = 3;
yuri.hp = 25;

var moon = [];
moon.name = 'Moon';
moon.img = 'https://upload.wikimedia.org/wikipedia/commons/e/e1/FullMoon2010.jpg';
moon.desc = 'no awoo';
moon.attname = 'Eclipse';
moon.att = 10;
moon.speed = 3.5;
moon.hp = 30;

var cone = [];
cone.name = 'Alien Traffic Cone';
cone.img = 'https://4.imimg.com/data4/HP/BP/MY-5351222/traffic-cone-500x500.png';
cone.desc = '...from planet nine!!!';
cone.attname = 'Trip';
cone.att = 6;
cone.speed = 2;
cone.hp = 12;

var enemy = [llama,yuri,moon,cone];

function newenemy(){
	"use strict";
	var ce = enemy[Math.floor(Math.random()*enemy.length)];
	enemyNameElement.innerHTML = ce.name;
	enemyDescElement.innerHTML = ce.desc;
	enemyAttNameElement.innerHTML = ce.attname;
	enemyImgElement.src = ce.img;
	enemyImgElement.alt = ce.name;
	maxenemyhp = ce.hp;
	enemyhp = ce.hp;
	atttime = ce.speed;
	enemyatt = ce.att;
	console.log('Spawned '+ce.name);
}

function reset(){
	"use strict";
	clock = 0;
	lastkilltime = 0;
	lastatttime = 0;
	score = 0;
	health = 100;
	paused = false;
	enemyAttacking = false;
	newenemy();
}

function attack(){
	"use strict";
	enemyhp -= att;
}

function kill(){
	"use strict";
	score += Math.floor(10*fps*maxenemyhp*maxenemyhp/(clock-lastkilltime));
	lastkilltime = clock;
	enemyAttacking = false;
	new Audio('https://www.myinstants.com/media/sounds/wilhelmscream.mp3').play();
}

function click(x){
	"use strict";
	if (!paused){
		switch (x){
			case 'att':
				attack();
				if (enemyhp<=0){
					kill();
				}
				break;
			case 'dodge':
				enemyAttacking = false;
				break;
			default:
				console.warn('ERR1',x);
		}
	}
	else {
		window.alert('Nice try, but you can\'t fight while the game is paused!!!! >:3');
	}
}

function damage(){
	"use strict";
	health -= enemyatt;
	healthElement.classList = ["red"];
	if (health<=0){
		new Audio('https://www.myinstants.com/media/sounds/roblox-death-sound_1.mp3').play();
		new Audio('https://www.myinstants.com/media/sounds/export_4.mp3').play();
	}
	else {
		new Audio('https://www.myinstants.com/media/sounds/minecraft_hit_soundmp3converter.mp3').play();
	}
}

function main(){
	"use strict";
	if (health<=0){
		document.getElementById("top").innerHTML = '<h1 class="red">YOU LOSE!</h1><h1>Score: '+score+'</h1>';
	}
	else if (!paused){
		document.getElementById("top").innerHTML = '<h1 id="Farm Simulator 2019">Farm Simulator 2019</h1>';
	
		// increment the clock
		clock+=1;

		// hp flash disable
		if (clock-lastatttime > fps*atttime/10){
			healthElement.classList = [];
		}

		// make new enemy
		if (!enemyhp){
			newenemy();
		}

		// if no dodge, deal damage to player
		else if (enemyAttacking && (clock-lastatttime)/fps > atttime){
			enemyAttacking = false;
			damage();
		}

		// launches an attack if not already
		else if (!enemyAttacking){ 
			enemyAttacking = true;
			lastatttime = clock;
		}
		
		// set enemy hp color
		enemyhealthElement.classList = [(3*enemyhp>2*maxenemyhp?"gre":(3*enemyhp>maxenemyhp?"yel":"red"))];

		// ONLY update if absolutely necessary!
		if (pauseElement.value !== 'Pause'){
			pauseElement.value = 'Pause';
		}
		if (enemyhp>0 && timeElement.innerHTML !== String(Math.floor(clock/fps))){
			timeElement.innerHTML = clock/fps;
		}
		if (scoreElement.innerHTML !== String(score)){
			scoreElement.innerHTML = score;
		}
		if (healthElement.innerHTML !== String(health)){
			healthElement.innerHTML = health;
		}
		if (enemyhealthElement.innerHTML !== String(Math.max(0,enemyhp))){
			enemyhealthElement.innerHTML = Math.max(0,enemyhp);
		}

		// this fine to update constantly
		readyElement.innerHTML = '<progress value="'+(clock-lastatttime)/fps/atttime+'"></progress>';
	}
	else {
		pauseElement.value = 'Play';
	}
}