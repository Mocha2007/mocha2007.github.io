/* eslint-disable max-len */

const earthWidth = 3600; // default: 36
const earthHeight = 600;
const int = Math.floor;

function random(x){
	// todo - check if correct?
	return Math.floor(Math.random() * x);
}

class Mineral {
	constructor(name, value, mass){
		/** @type {string} */
		this.name = name;
		/** @type {number} */
		this.value = value;
		/** @type {number} */
		this.mass = mass; // I THINK that's what this number represents...
	}
	get tileId(){
		return minerals.indexOf(this) + 6;
	}
	get tilePoints(){
		return this.value * 50; // * difficulty[lvl].mineralValueMod
	}
	static idToMineralName(n){
		const mineralId = n - 6;
		if (mineralId < 0 || mineralId >= minerals.length){
			return 'other';
		}
		if (n > 24 && n < 28){
			return 'rock';
		}
		if (n > 27 && n < 31){
			return 'lava';
		}
		if (n > -1 && n < 6){
			return 'dirt';
		}
		return minerals[mineralId].name;
	}
}
/** @type {Mineral[]} */
const minerals = [];

minerals[0] = new Mineral('Ironium', 30, 1);
minerals[1] = new Mineral('Bronzium', 60, 1);
minerals[2] = new Mineral('Silverium', 100, 1);
minerals[3] = new Mineral('Goldium', 250, 2);
minerals[4] = new Mineral('Platinium', 750, 3);
minerals[5] = new Mineral('Einsteinium', 2000, 4);
minerals[6] = new Mineral('Emerald', 5000, 6);
minerals[7] = new Mineral('Ruby', 20000, 8);
minerals[8] = new Mineral('Diamond', 100000, 10);
minerals[9] = new Mineral('Amazonite', 500000, 12);
minerals[10] = new Mineral('Dinosaur Bones', 1000, 1);
minerals[11] = new Mineral('Treasure', 5000, 1);
minerals[12] = new Mineral('Martian Skeleton', 10000, 1);
minerals[13] = new Mineral('Religious Artifact', 50000, 1);
minerals[14] = new Mineral('Mr. Natas\' Kevlar Suit', 50000, 1);
minerals[15] = new Mineral('Mr. Natas\' Staff of Hell', 100000, 1);
minerals[16] = new Mineral('Mr. Natas\' Laser Monacle', 200000, 1);
minerals[17] = new Mineral('Satan\'s Hooves', 300000, 1);
minerals[18] = new Mineral('Satan\'s Horns', 400000, 1);
minerals[19] = new Mineral('Satan\'s Evil Eye (right)', 500000, 1);
minerals[20] = new Mineral('Satan\'s Evil Eye (left)', 500000, 1);
minerals[21] = new Mineral('Satan\'s Boiler of Eternal Infernos', 600000, 1);
minerals[22] = new Mineral('Martian Reward for Restoring Peace', 1000000, 1);
minerals[23] = new Mineral('250,000 Shares of Natas HI Inc.', 25000000, 1);

const earth = [];

function generateEarth(){
	const mineralRate = 65;
	let x = 0;
	while (x < earthWidth){
		earth[x] = [];
		let y = 0;
		while (y < earthHeight){
			earth[x][y] = [];
			earth[x][y][1] = random(4);
			if (y < 5){
				earth[x][y][0] = 0;
			}
			else if (y === 5){
				earth[x][y][0] = random(2) - 2;
			}
			else if (y === earthHeight - 12){
				earth[x][y][0] = random(2) - 7;
			}
			else if (y >= earthHeight - 11 && y < earthHeight - 5){
				earth[x][y][0] = -999;
			}
			else if (y === earthHeight - 5){
				earth[x][y][0] = - (9 + random(4));
			}
			else if (y > earthHeight - 5){
				earth[x][y][0] = -8;
			}
			else {
				if (random(5) === 0){
					if (random(5) === 0){
						if (random(5) === 0){
							if (random(4) === 0 && y > 80){
								earth[x][y][0] = random(4) + 16;
								if (earth[x][y][0] === 17){
									earth[x][y][1] = 0;
								}
							}
							else {
								earth[x][y][0] = Math.min(random(int(y / mineralRate) + 2) + 8, 15);
							}
						}
						else {
							earth[x][y][0] = Math.min(random(int(y / mineralRate) + 2) + 7, 15);
						}
					}
					else {
						earth[x][y][0] = Math.min(random(int(y / mineralRate) + 2) + 6, 15);
					}
				}
				else {
					earth[x][y][0] = random(5) + 1;
					if (y * 1.5 > earthHeight / 3){
						if (random(int(earthHeight - y) / earthHeight * 15) === 0){
							if (y / 2 * 1.5 > earthHeight / 3 && random(2) === 0){
								if (y / 3 * 1.5 > earthHeight / 3 && random(2) === 0){
									earth[x][y][0] = 31;
								}
								else {
									earth[x][y][0] = 28 + random(3);
								}
							}
							else {
								earth[x][y][0] = 25 + random(3);
							}
						}
					}
				}
				if (random(3) === 0){
					earth[x][y][0] = 0;
				}
			}
			y += 1;
		}
		x += 1;
	}
	earth[earthWidth - 3][earthHeight - 12][0] = 0;
	earth[earthWidth - 4][earthHeight - 12][0] = 0;
	earth[3][3][0] = -125;
	earth[4][3][0] = -126;
	earth[5][3][0] = -127;
	earth[3][4][0] = -128;
	earth[4][4][0] = -129;
	earth[5][4][0] = -130;
	earth[2][5][0] = -3;
	earth[3][5][0] = -4;
	earth[4][5][0] = -4;
	earth[5][5][0] = -5;
	earth[10][2][0] = -110;
	earth[11][2][0] = -111;
	earth[12][2][0] = -112;
	earth[13][2][0] = -113;
	earth[10][3][0] = -114;
	earth[11][3][0] = -115;
	earth[12][3][0] = -116;
	earth[13][3][0] = -117;
	earth[10][4][0] = -118;
	earth[11][4][0] = -119;
	earth[12][4][0] = -120;
	earth[13][4][0] = -121;
	earth[9][5][0] = -3;
	earth[10][5][0] = -4;
	earth[11][5][0] = -4;
	earth[12][5][0] = -4;
	earth[13][5][0] = -4;
	earth[14][5][0] = -5;
	earth[25][2][0] = -101;
	earth[22][3][0] = -102;
	earth[23][3][0] = -103;
	earth[24][3][0] = -104;
	earth[25][3][0] = -105;
	earth[22][4][0] = -106;
	earth[23][4][0] = -107;
	earth[24][4][0] = -108;
	earth[25][4][0] = -109;
	earth[21][5][0] = -3;
	earth[22][5][0] = -4;
	earth[23][5][0] = -4;
	earth[24][5][0] = -4;
	earth[25][5][0] = -4;
	earth[26][5][0] = -5;
	earth[30][3][0] = -131;
	earth[31][3][0] = -132;
	earth[32][3][0] = -133;
	earth[30][4][0] = -134;
	earth[31][4][0] = -135;
	earth[32][4][0] = -136;
	earth[30][5][0] = -3;
	earth[31][5][0] = -4;
	earth[32][5][0] = -4;
	earth[33][5][0] = -5;
}

generateEarth();
console.debug(earth);

function histogram(){
	const combine = 8; // combine every ten rows
	const display = n => `${n}: ${12.5*combine*n} ft to ${12.5*combine*(n+1)} ft`; // function to get the display string
	const depthStats = [];
	const delta = 1;// / (combine * earthWidth);
	for (let depth = 0; depth < earthHeight; depth++){
		const histDepth = display(Math.floor(depth / combine));
		if (depth % combine === 0){
			depthStats[histDepth] = {};
		}
		for (let col = 0; col < earthWidth; col++){
			const tile = Mineral.idToMineralName(earth[col][depth][0]);
			if (isFinite(depthStats[histDepth][tile])){
				depthStats[histDepth][tile] += delta;
			}
			else {
				depthStats[histDepth][tile] = delta;
			}
		}
	}
	console.debug(depthStats);
}

histogram();