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
var enemyImgElement = document.getElementById("img");
var enemyDescElement = document.getElementById("desc");
var readyElement = document.getElementById("ready");
var pauseElement = document.getElementById("pause");

// do this initially regardless
var llama = [];
llama.name = 'Demonic Llama';
llama.img = 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Llama_lying_down.jpg/1200px-Llama_lying_down.jpg';
llama.desc = 'soopr evil bad bad pls kill';
llama.att = 5;
llama.speed = 2;
llama.hp = 10;

var enemy = [];
enemy.llama = llama;

var idlist = ['llama'];

var maxenemyhp,enemyhp,enemyatt,atttime;

function newenemy(){
	"use strict";
	var ce = enemy[idlist[Math.floor(Math.random()*idlist.length)]];
	enemyNameElement.innerHTML = ce.name;
	enemyDescElement.InnerHTML = ce.desc;
	enemyImgElement.src = ce.img;
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
	console.warn('OwO');
	score += Math.floor(100*fps*maxenemyhp/(clock-lastkilltime));
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
		document.getElementById("mid").innerHTML = '<h1 class="red">YOU LOSE!</h1><h1>Score: '+score+'</h1>';
	}
	else if (!paused){
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
		enemyhealthElement.classList = [(enemyhp>6?"gre":(enemyhp>3?"yel":"red"))];

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