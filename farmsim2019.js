/* eslint-disable no-var */
/* eslint-env es3 */
/* jshint esversion: 3, strict: true, strict: global, eqeqeq: true */
/* exported click, dodge, reset */
'use strict';
var fps = 20;
var att = 1;
var clock = 0;
var lastkilltime = 0;
var lastatttime = 0;
var score = 0;
var health = 100;
var targetHealth = 100;
var paused = false;
var enemyAttacking = false;

var defaultTop = '<h1 id="Farm Simulator 2019">Farm Simulator 2019</h1>';

var topElement = document.getElementById('top');
var timeElement = document.getElementById('time');
var scoreElement = document.getElementById('score');
var healthElement = document.getElementById('health');
var enemyhealthElement = document.getElementById('hp');
var enemyNameElement = document.getElementById('enemyname');
var enemyDescElement = document.getElementById('desc');
var enemyAttNameElement = document.getElementById('attname');
var enemyImgElement = document.getElementById('img');
var readyElement = document.getElementById('ready');
var pauseElement = document.getElementById('pause');

// enemy code
var atttime, enemyatt, enemyhp, maxenemyhp;

/**
 * @param {string} name
 * @param {string} img - url
 * @param {string} desc
 * @param {string} attname
 * @param {number} att
 * @param {number} speed
 * @param {number} hp
 */
function Enemy(name, img, desc, attname, enemyAtt, speed, hp){
	this.name = name;
	this.img = img;
	this.desc = desc;
	this.attname = attname;
	this.att = enemyAtt;
	this.speed = speed;
	this.hp = hp;
}

var enemy = [
	new Enemy(
		'Demonic Llama',
		'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Llama_lying_down.jpg/1200px-Llama_lying_down.jpg',
		'soopr evil bad bad pls kill',
		'Spit',
		5,
		1.5,
		10
	),
	new Enemy(
		'Yuri!!!',
		'https://images.goodsmile.info/cgm/images/product/20170201/6231/43651/large/42f61413f2fec50155107225e94e4b20.jpg',
		'... on ice!',
		'Skate Slash',
		7,
		3,
		25
	),
	new Enemy(
		'Moon',
		'https://upload.wikimedia.org/wikipedia/commons/e/e1/FullMoon2010.jpg',
		'no awoo',
		'Eclipse',
		10,
		3.5,
		30
	),
	new Enemy(
		'Alien Traffic Cone',
		'https://4.imimg.com/data4/HP/BP/MY-5351222/traffic-cone-500x500.png',
		'...from planet nine!!!',
		'Trip',
		6,
		2,
		12
	),
];

function newenemy(){
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
	clock = 0;
	lastkilltime = 0;
	lastatttime = 0;
	score = 0;
	targetHealth = 100;
	paused = false;
	enemyAttacking = false;
	newenemy();
}

function attack(){
	enemyhp -= att;
}

function kill(){
	score += Math.floor(10*fps*maxenemyhp*maxenemyhp/(clock-lastkilltime));
	lastkilltime = clock;
	enemyAttacking = false;
	new Audio('https://www.myinstants.com/media/sounds/wilhelmscream.mp3').play();
}

function click(x){
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
				console.warn('ERR1', x);
		}
	}
	else {
		window.alert('Nice try, but you can\'t fight while the game is paused!!!! >:3');
	}
}

function dodge(){
	click('dodge');
}

function damage(){
	targetHealth -= enemyatt;
	healthElement.classList = ['red'];
	if (targetHealth<=0){
		new Audio('https://www.myinstants.com/media/sounds/roblox-death-sound_1.mp3').play();
		new Audio('https://www.myinstants.com/media/sounds/export_4.mp3').play();
	}
	else {
		new Audio('https://www.myinstants.com/media/sounds/minecraft_hit_soundmp3converter.mp3').play();
	}
}

function main(){
	if (targetHealth <= 0){
		topElement.innerHTML = '<h1 class="red">YOU LOSE!</h1><h1>Score: '+score+'</h1>';
	}
	else if (!paused){
		// increment the clock
		clock+=1;

		// hp flash disable
		if (targetHealth!==health && Math.abs(targetHealth-health)<1){
			health = targetHealth;
		}
		else if (targetHealth<health){
			health -= 1;
		}
		else if (targetHealth>health){
			health += 1;
		}
		else {
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
		enemyhealthElement.classList = [3*enemyhp>2*maxenemyhp?'gre':3*enemyhp>maxenemyhp?'yel':'red'];

		// ONLY update if absolutely necessary!
		if (pauseElement.value !== 'Pause'){
			pauseElement.value = 'Pause';
		}
		if (targetHealth>0 && timeElement.innerHTML !== String(Math.floor(clock/fps))){
			timeElement.innerHTML = Math.floor(clock/fps);
		}
		if (scoreElement.innerHTML !== String(score)){
			scoreElement.innerHTML = score;
		}
		if (healthElement.innerHTML !== String(health)){
			healthElement.innerHTML = health;
		}
		if (enemyhealthElement.innerHTML !== String(Math.max(0, enemyhp))){
			enemyhealthElement.innerHTML = Math.max(0, enemyhp);
		}
		if (topElement.innerHTML !== defaultTop){
			topElement.innerHTML = defaultTop;
		}

		// this fine to update constantly
		readyElement.value = (clock-lastatttime)/fps/atttime;
	}
	else {
		pauseElement.value = 'Play';
	}
}

setInterval(main, 1000/fps);