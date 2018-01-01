// Seed

function OneiaMonth() {
	var epoch =			1497151176;/*SUN 2017 JUN 11 03:19:36 UTC*/
	var month =			6477407.605917404/12;
	var currenttime = 	Date.now()/1000;

	return Math.floor((currenttime-epoch)/month+3)%12;
}

function OneiaDay() {
	var epoch =			1497151176;/*SUN 2017 JUN 11 03:19:36 UTC*/
	var day =			104148;
	var currenttime = 	Date.now()/1000;

	return Math.floor((currenttime-epoch)/day);
}

function SeededRandom(n) {
	return (9*Math.pow(n,2)%97)/97;
}

function SeededRandomRange(x,y,n) {
	return (y-x)*SeededRandom(n)+x;
}

function C2F(t) {
	return 9/5*t+32;
}

function Weather() {
	// Modelled on Bhavnagar, India
	highs = [27.7,30.2,34.7,37.6,39.4,34.5,33,32.2,33,34.2,31.7,28.6];
	lows = [11.2,14.7,19.5,23.8,25.9,27.1,26,24.8,24.1,22.4,17.9,14.1];
	rains = [0,0,0,0,1/31,6/30,10/31,8/31,5/30,1/31,0,0];
	
	var temp = SeededRandomRange(lows[OneiaMonth()],highs[OneiaMonth()],OneiaDay());
	
	var state = '<abbr title="Sunny">&#x2600;</abbr>';
	if (SeededRandom(OneiaDay())<rains[OneiaMonth()]) {
		var state = '<abbr title="Rainy">&#x2614;</abbr>';
	}
	
	var day = 104148000;
	var fiveday = '<details><summary>5-Day Forecast</summary>'+BareWeather(BareOneiaMonth(Date.now()+day),OneiaDay()+1)+'<br>'+BareWeather(BareOneiaMonth(Date.now()+2*day),OneiaDay()+2)+'<br>'+BareWeather(BareOneiaMonth(Date.now()+3*day),OneiaDay()+3)+'<br>'+BareWeather(BareOneiaMonth(Date.now()+4*day),OneiaDay()+4)+'<br>'+BareWeather(BareOneiaMonth(Date.now()+5*day),OneiaDay()+5)+'</details>';
	
	document.getElementById("eremorweather").innerHTML = 'Weather in Eremor: <abbr title="'+Math.round(C2F(temp))+'&#176;F">'+Math.round(temp)+'&#176;C</abbr> '+state+fiveday;
}

function BareOneiaMonth(t) {
	var epoch =			1497151176;/*SUN 2017 JUN 11 03:19:36 UTC*/
	var month =			6477407.605917404/12;
	var currenttime = 	t/1000;

	return Math.floor((currenttime-epoch)/month+3)%12;
}

function BareWeather(m,d) {
	// Modelled on Bhavnagar, India
	highs = [27.7,30.2,34.7,37.6,39.4,34.5,33,32.2,33,34.2,31.7,28.6];
	lows = [11.2,14.7,19.5,23.8,25.9,27.1,26,24.8,24.1,22.4,17.9,14.1];
	rains = [0,0,0,0,1/31,6/30,10/31,8/31,5/30,1/31,0,0];
	
	var temp = SeededRandomRange(lows[m],highs[m],d);
	
	var state = '<abbr title="Sunny">&#x2600;</abbr>';
	if (SeededRandom(d)<rains[m]) {
		var state = '<abbr title="Rainy">&#x2614;</abbr>';
	}
	
	return '<abbr title="'+Math.round(C2F(temp))+'&#176;F">'+Math.round(temp)+'&#176;C</abbr> '+state;
}