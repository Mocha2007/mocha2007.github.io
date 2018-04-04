var fps = 20;
var atttime = 2;
var clock = 0;
var lastkilltime = 0;
var lastatttime = 0;
var score = 0;
var health = 100;
var paused = false;
var enemyAttacking = false;

var llamahp = 10;

var timeElement = document.getElementById("time");
var scoreElement = document.getElementById("score");
var healthElement = document.getElementById("health");
var enemyhealthElement = document.getElementById("hp");
var llamaElement = document.getElementById("llama");
var enemyNameElement = document.getElementById("enemyname");
var readyElement = document.getElementById("ready");

enemyNameElement.innerHTML = 'Demonic Llama';

function click(x){
	"use strict";
	if (!paused){
		switch (x){
			case 'llama':
				llamahp -= 1;
				break;
			case 'dodge':
				enemyAttacking = false;
				console.log('DODGED');
				break;
		}
	}
	else {
		window.alert('Nice try, but you can\'t fight while the game is paused!!!! >:3');
	}
}

function damage(x){
	"use strict";
	health -= x;
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

		// if no dodge, deal damage to player
		if (enemyAttacking && (clock-lastatttime)/fps > atttime){
			enemyAttacking = false;
			damage(5);
		}

		// make new llama
		if (llamahp===0){
			score += Math.floor(fps*1000/(clock-lastkilltime));
			lastkilltime = clock;
			enemyAttacking = false;
			new Audio('https://www.myinstants.com/media/sounds/wilhelmscream.mp3').play();
			llamahp = 10;
		}
		// launches an attack if not already
		else if (!enemyAttacking){ 
			enemyAttacking = true;
			lastatttime = clock;
		}
		
		// set enemy hp color
		enemyhealthElement.classList = [(llamahp>6?"gre":(llamahp>3?"yel":"red"))];

		// ONLY update if absolutely necessary!
		if (llamahp>0 && timeElement.innerHTML !== String(Math.floor(clock/fps))){
			timeElement.innerHTML = clock/fps;
		}
		if (scoreElement.innerHTML !== String(score)){
			scoreElement.innerHTML = score;
		}
		if (healthElement.innerHTML !== String(health)){
			healthElement.innerHTML = health;
		}
		if (enemyhealthElement.innerHTML !== String(Math.max(0,llamahp))){
			enemyhealthElement.innerHTML = Math.max(0,llamahp);
		}

		// this fine to update constantly
		readyElement.innerHTML = '<progress value="'+(clock-lastatttime)/fps/atttime+'"></progress>';
	}
}