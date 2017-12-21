function OneiaTime() {

	var epoch = 1497151176;/*SUN 2017 JUN 11 03:19:36 UTC*/
	var year = 6477407.605917404;
	var day = 104148;
	
	var currenttime = Math.floor((Date.now())/1000)
	//console.log(currenttime);
	
	var remainder = currenttime-epoch;
	var years = Math.floor(remainder/year);
	var remainder = remainder%year;
	var days = Math.floor(remainder/day);
	var remainder = remainder%day;
	var first = Math.floor(remainder/(day/10));
	var remainder = remainder%(day/10);
	var second = Math.floor(remainder/(day/100));
	var remainder = remainder%(day/100);
	var third = Math.floor(remainder/(day/1000));
	var remainder = remainder%(day/1000);
	var fourth = Math.floor(remainder/(day/10000));
	var remainder = remainder%(day/10000);
	var fifth = Math.floor(remainder/(day/100000));

	// Compose the string for display
	var currentTimeString = "Year " + years + ", Day " + days + ", " + first + ":" + second + ":" + third + ":" + fourth + ":" + fifth;
	//console.log(currentTimeString);

	// Update the time display
	document.getElementById("clock").innerHTML = currentTimeString;/*.firstChild*/
}