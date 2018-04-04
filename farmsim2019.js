fps = 20;
clock = 0;
score = 0;
health = 100;
paused = false;

function main(){
	if (!paused){
		clock+=1;

		// ONLY update if absolutely necessary!

		var timeElement = document.getElementById("time");
		var scoreElement = document.getElementById("score");
		var healthElement = document.getElementById("health");
		
		if (timeElement.innerHTML !== String((clock/fps).toFixed(1))){
			timeElement.innerHTML = (clock/fps).toFixed(1);
		}
		if (scoreElement.innerHTML !== String(score)){
			scoreElement.innerHTML = score;
		}
		if (healthElement.innerHTML !== String(health)){
			healthElement.innerHTML = health;
		}
	}
}