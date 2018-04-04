var fps = 20;
var clock = 0;
var lastkilltime = 0;
var score = 0;
var health = 100;
var paused = false;

var llamahp = 10;

var timeElement = document.getElementById("time");
var scoreElement = document.getElementById("score");
var healthElement = document.getElementById("health");
var enemyhealthElement = document.getElementById("hp");
var llamaElement = document.getElementById("llama");
var enemyNameElement = document.getElementById("enemyname");

enemyNameElement.innerHTML = 'Demonic Llama (soopr evil)';

function click(x){
	"use strict";
	if (x==='llama'){
		llamahp -= 1;
		console.log('LLAMA SHOT');
	}
}

function main(){
	"use strict";
	if (!paused){
		clock+=1;

		// make cones
		
		if (llamahp===0){
			//llamaElement.classList = ["invisible"];
			score += Math.floor(fps*1000/(clock-lastkilltime));
			llamahp = 10;
			lastkilltime = clock;
			new Audio('https://www.myinstants.com/media/sounds/wilhelmscream.mp3').play();
		}
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
	}
}