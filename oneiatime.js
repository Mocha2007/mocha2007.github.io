/* eslint-disable comma-dangle, no-var, object-shorthand, prefer-arrow-callback */
/* eslint-env es3 */
/* jshint esversion: 3, strict: true, strict: global, eqeqeq: true */
/* exported bonus, playSound, stopSound */
'use strict';
var vernal = 6884100000; // ms after first vernal equinox 20 Mar 16:15 (2018)

var egyptmonths = [
	'Thoth', 'Paopi', 'Hathor', 'Koiak', 'Tobi', 'Meshir', 'Paremhat', 'Paremoude',
	'Pashons', 'Paoni', 'Epip', 'Mesori'
];
var egyptseasons = ['Akhet', 'Peret', 'Shemu'];
var chineseelements = [
	'Wood"><ruby>木<rt>き</rt></ruby>', 'Fire"><ruby>火<rt>ひ</rt></ruby>',
	'Earth"><ruby>土<rt>つち</rt></ruby>', 'Metal"><ruby>金<rt>か</rt></ruby>',
	'Water"><ruby>水<rt>みず</rt></ruby>'
];
var chinesesigns = [
	'Rat"><ruby>子<rt>ね</rt></ruby>', 'Ox"><ruby>丑<rt>うし</rt></ruby>',
	'Tiger"><ruby>寅<rt>とら</rt></ruby>', 'Rabbit"><ruby>卯<rt>う</rt></ruby>',
	'Dragon"><ruby>辰<rt>たつ</rt></ruby>', 'Snake"><ruby>巳<rt>み</rt></ruby>',
	'Horse"><ruby>午<rt>うま</rt></ruby>', 'Goat"><ruby>未<rt>ひつじ</rt></ruby>',
	'Monkey"><ruby>申<rt>さる</rt></ruby>', 'Rooster"><ruby>酉<rt>とり</rt></ruby>',
	'Dog"><ruby>戌<rt>いぬ</rt></ruby>', 'Pig"><ruby>亥<rt>い</rt></ruby>'
];
var signs = [
	'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
	'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];
var signpolarity = [
	'Positive (active, yang, expressive, masculine)',
	'Negative (passive, yin, receptive, feminine)'
];
var signelements = [
	'Fire (Enthusiasm; drive to express self; faith)',
	'Earth (Practicality; caution; material world)',
	'Air (Communication; socialization; conceptualization)',
	'Water (Emotion; empathy; sensitivity)'
];
var signqualities= [
	'Cardinal (active; self-motivated; insightful; ambitious)',
	'Fixed (stabilization; determination; depth; persistence)',
	'Mutable (adaptability; flexibility; sympathy)'
];
var signrulers= [
	'Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury',
	'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus/Saturn', 'Neptune/Jupiter'
];
var marsmonths = [
	'Sagittarius', 'Dhanus', 'Capricornus', 'Makara', 'Aquarius', 'Kumbha',
	'Pisces', 'Mina', 'Aries', 'Mesha', 'Taurus', 'Rishabha',
	'Gemini', 'Mithuna', 'Cancer', 'Karka', 'Leo', 'Simha',
	'Virgo', 'Kanya', 'Libra', 'Tula', 'Scorpius', 'Vrishika'
];
var marsseasons = [ // appx
	'Spring', 'Spring', 'Spring', 'Spring', 'Spring', 'Spring',
	'Spring', 'Summer', 'Summer', 'Summer', 'Summer', 'Summer',
	'Summer', 'Fall', 'Fall', 'Fall', 'Fall', 'Fall',
	'Winter', 'Winter', 'Winter', 'Winter', 'Winter', 'Winter'
];

/**
 * https://stackoverflow.com/questions/4467539/javascript-modulo-gives-a-negative-result-for-negative-numbers/17323608#17323608
 * Fixes a bug in javascript where the entire fucking language is retarded and should burn in hell for all eternity.
 * @param {number} n - dividend
 * @param {number} m - divisor
*/
function mod(n, m){
	return (n % m + m) % m;
}

/**
 * https://stackoverflow.com/questions/14926306/javascript-play-sound-on-hover-stop-and-reset-on-hoveroff/14926552#14926552
 * @param {string} elementId - id
*/
function playSound(elementId){
	document.getElementById(elementId).play();
}

/** @param {string} elementId - id */
function stopSound(elementId){
	/** @type {HTMLAudioElement} */
	var thissound = document.getElementById(elementId);
	thissound.pause();
	thissound.currentTime = 0;
}

function ordinal(n){
	var n_ = n;
	n %= 100;
	if (10 < n && n < 20)
		return n_ + 'th';
	n %= 10;
	switch (n){
		case 1:
			return n_ + 'st';
		case 2:
			return n_ + 'nd';
		case 3:
			return n_ + 'rd';
		default:
			return n_ + 'th';
	}
}

function avoidWrap(innerHTML){
	var elem = document.createElement('span');
	elem.style.display = 'inline-block';
	elem.innerHTML = innerHTML;
	return elem.outerHTML;
}

function egypt(){
	var epoch =	21852000; // 1970 SEP 11 00:00:00 UTC+2; first akhet after epoch
	var reltime = mod(new Date()/1000-epoch, 31556952); // time (s) since beginning of akhet
	var wutwut = Math.floor(reltime/10518984); // season number
	var wutmonth = Math.floor(reltime/2629746); // month number
	var wutday = Math.floor(reltime/86400)-wutmonth*30; // day number
	return wutday+' '+egyptmonths[wutmonth]+' ('+egyptseasons[wutwut]+')';
}

function maya(){
	// 144000 days : 7200 days : 360 days : 20 days : day
	var epoch = 1356069600; // 13th b'ak'tun : 21 Dec 2012 00:00:00 UTC-6
	var remainder = Math.floor((new Date()/1000-epoch)/86400); // days since beginning of 13th b'ak'tun

	var mayaTime = [mod(remainder, 20)];
	var temp = Math.floor(remainder/20);

	mayaTime.unshift(mod(temp, 18));
	temp = Math.floor(temp/18);

	mayaTime.unshift(mod(temp, 20));
	temp = Math.floor(temp/20);

	mayaTime.unshift(mod(temp, 20));
	temp = Math.floor(temp/20);

	mayaTime.unshift(13+mod(temp, 20));
	return mayaTime.join(':');
}

function china(){
	// naive; does not account for time between new year's and chinese new year's well
	var epoch = 444440000; // appx 1 FEB 1984
	var y = Math.floor((new Date()/1000-epoch)/31556952); // years since epoch
	var yy = '<abbr title="'+(mod(y, 2)?'Yin"><ruby>兄<rt>え</rt></ruby>':'Yang"><ruby>弟<rt>と</rt></ruby>')+'</abbr>';
	var element = '<abbr title="'+chineseelements[mod(Math.floor(y/2), 5)]+'</abbr>の'+yy;
	var animal = '<abbr title="'+chinesesigns[mod(y, 12)]+'</abbr>';
	return [element, animal].join(' - ');
}

function zodiac(){
	var n = Math.floor(mod(new Date()-vernal, 31556952000)/2629746000); // sign number 0-11
	return '<abbr title="Element: ' + signelements[mod(n, 4)]
		+ '&#013;Polarity: ' + signpolarity[mod(n, 3)]
		+ '&#013;Modality: ' + signqualities[mod(n, 3)]
		+ '&#013;Ruler: '+signrulers[n]
		+ ' (this planet\'s influence heightens when inside this constellation)&#013;Detriment: '
		+ signrulers[mod(n+6, 12)]
		+ ' (this planet\'s influence weakens when inside this constellation)">'
		+ signs[n]+'</abbr>';
}

function jd(){
	return new Date()/86400000+2440587.5;
}

/** @param {number} y */
function dhelp(y){
	var leap;
	if (y < 2001)
		leap = y % 2 || y % 1000 === 0 || y % 100 !== 0 || y % 10 === 0;
	else if (y < 4801)
		leap = y % 2 || y % 150 !== 0 || y % 10 === 0;
	else if (y < 6801)
		leap = y % 2 || y % 200 !== 0 || y % 10 === 0;
	else if (y < 8401)
		leap = y % 2 || y % 300 !== 0 || y % 10 === 0;
	else if (y < 10001)
		leap = y % 2 || y % 600 !== 0 || y % 10 === 0;
	else
		leap = y % 2 || y % 10 === 0;
	return 668 + leap;
}

/** @param {number} month */
function dhelp2(month){
	var y = Math.floor(month/24);
	var leap = dhelp(y) === 669;
	return mod(month, 24) === 23
		// leap month - odd years OR every ten years except every hundred years except every thousand years
		// https://en.wikipedia.org/wiki/Darian_calendar#Year_length_and_intercalation
		? leap ? 28 : 27
		// short, non-leap month
		: mod(month, 6) === 5 ? 27 : 28;
}

/** @param {number} day */
function dhelp3(day){
	var m = 0;
	while (dhelp2(m) <= day)
		day -= dhelp2(++m);
	return [m, Math.floor(day), Math.floor(mod(day, 1)*1000)];
}

function darian(){
	var sol = 88775244; // Martian Sol; milliseconds
	var n = (Number(new Date())+11392059672000)/sol; // sols past epoch
	var tn = n;
	var marsy = 0;
	var marsd = 0;
	while (dhelp(marsy+1) <= tn)
		tn -= dhelp(++marsy);
	marsd = tn;
	var DH3 = dhelp3(marsd);
	var monthID = DH3[0];
	var marsmonth = marsmonths[monthID];
	var marsday = DH3[1]+1;
	var marshour = DH3[2];
	return [marsday, marsmonth, marsy, marshour,
		'<a href="https://en.wikipedia.org/wiki/Darian_calendar">UMST</a> &mdash; ',
		marsseasons[monthID]].join(' ');
}

/** DF time */
function dorf(){
	var dorfMonths = [
		'Granite', 'Slate', 'Felsite', 'Hematite', 'Malachite', 'Galena',
		'Limestone', 'Sandstone', 'Timber', 'Moonstone', 'Opal', 'Obsidian'
	];
	var dorfSeasons = ['Spring', 'Summer', 'Autumn', 'Winter'];
	var dorfCaravans = ['Elven', 'Human', 'Dwarven', 'No'];
	var dorfSeasonModifiers = ['Early', 'Mid', 'Late'];
	var yearLength = 60*60*24*28*12;
	var epoch = 1154995200; // 1142878500 = 1:15 PM EST 20 MAR 2006, the first vernal equinox before release
	var remainder = new Date()/1000 - epoch; // seconds since epoch
	// 5964 days between Aug 8 2006 and Dec 6 2022 (0.50); so presumably development will take 11928 days total?
	var progress = Math.floor(100*remainder/(60*60*24*11928));
	var y = Math.floor(remainder / yearLength);
	remainder -= y*yearLength;
	var m = Math.floor(remainder / (yearLength/12));
	var s = Math.floor(m/3);
	var sm = m - s*3;
	remainder -= m*yearLength/12;
	var d = Math.floor(remainder / (yearLength/12/28));
	remainder -= d*yearLength/12/28;
	var h = Math.floor(remainder / (yearLength/12/28/24));
	remainder -= h*yearLength/12/28/24;
	var t = Math.floor(remainder / 72); // *2 = adventure mode ticks; /72 = fortress mode ticks
	return d+1 + ' ' + dorfMonths[m] + ' (<abbr title="' + dorfCaravans[s] + ' caravan">'
		+ dorfSeasonModifiers[sm] + ' ' + dorfSeasons[s]
		+ '</abbr>), <abbr title="Age of Civilization">Year ' + y + '</abbr> - Hour ' + h
		+ ', Tick ' + t
		+ ' (0.' + progress + '.0?)';
}

/** ab urbe condita */
function auc(){
	return new Date().getFullYear() + 753 + ' <abbr title="ab urbe condita">AUC</abbr>';
}

/** japanese era */
function japan(){
	var eras = [ // older ones included in case some weirdo sets their system time to 1970
		[2019, '令和', 'Reiwa', 'Naruhito', 'れいわ'],
		[1989, '平成', 'Heisei', 'Akihito', 'へいせい'],
		[1926, '昭和', 'Shōwa', 'Hirohito', 'しょうわ']
	];
	var y = new Date().getFullYear();
	var i; // need this outside the for scope
	for (i = 0; i < eras.length; i++){
		if (y > eras[i][0])
			break;
	}
	y -= eras[i][0] - 1;
	return '<abbr title="' + eras[i][2] + ' era\nEmperor ' + eras[i][3] + '"><ruby>' + eras[i][1]
		+ '<rt>' + eras[i][4] + '</rt></ruby></abbr>' + y + '年';
}

function romanFULL(){
	return romanDOTW() + ' ' + roman() + ' ' + auc();
}

function romanDOTW(){
	var days = [ // diēs + ? s gen
		'sōlis', // Sunday
		'lūnae',
		'mārtis',
		'mercuriī',
		'iovis',
		'veneris',
		'saturnī'
	];
	var daysABBR = [
		'Sol.', // Sunday
		'Lun.',
		'Mar.',
		'Mer.',
		'Iov.',
		'Ven.',
		'Sat.'
	];
	var dotw = new Date().getDay(); // 0=sun
	return '<abbr title="diēs ' + days[dotw] + '">' + daysABBR[dotw] + '</abbr>';
}

function roman(){
	var monthsAbl = [ // f pl abl; used on the day of
		'iānuāriīs',
		'februāriīs',
		'mārtiīs',
		'aprīlibus',
		'maiīs',
		'iūniīs',
		'iūliīs',
		'augustīs',
		'septembribus',
		'octōbribus',
		'novembribus',
		'decembribus'
	];
	var monthsAcc = [ // f pl acc; used before the day
		'iānuāriās',
		'februāriās',
		'mārtiās',
		'aprīlēs',
		'maiās',
		'iūniās',
		'iūliās',
		'augustās',
		'septembrēs',
		'octōbrēs',
		'novembrēs',
		'decembrēs'
	];
	var monthAbbreviations = ['Ian', 'Feb', 'Mar', 'Apr', 'Mai', 'Iun',
		'Iul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	var numerals = [ // m s acc
		'tertium',
		'quārtum',
		'quīntum',
		'sextum',
		'septimum',
		'octāvum',
		'nōnum',
		'decimum',
		'ūndecimum',
		'duodecimum',
		'tertium decimum',
		'quārtum decimum',
		'quīntum decimum',
		'sextum decimum',
		'septimum decimum',
		'duodēvīcēsimum',
		'ūndēvīcēsimum'
	];
	var numeralAbbreviations = ['III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII',
		'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX'];
	var day = new Date().getDate(); // 1-indexed
	var month = new Date().getMonth(); // 0-indexed
	var year = new Date().getFullYear();
	var nextMonth = new Date(year, month+1, 1).getMonth(); // 0-indexed
	var numberOfDaysInTheMonth = new Date(year, month+1, 0).getDate();
	var ides = [2, 4, 6, 9].includes(month) ? 15 : 13; // https://en.wikipedia.org/wiki/Roman_calendar#Months
	var nones = ides - 8;
	var numberOfDaysBeforeNextKalends = numberOfDaysInTheMonth - ides;
	// console.debug(day, month, year, ';', nones, ides, numberOfDaysInTheMonth);
	if (day === 1)
		return '<abbr title="kalendīs ' + monthsAbl[month]
			+ '">Kal. ' + monthAbbreviations[month] + '.</abbr>';
	if (1 < nones - day)
		return '<abbr title="ante diem ' + numerals[nones - day - 2] + ' nōnās ' + monthsAcc[month]
			+ '"> a.d. ' + numeralAbbreviations[nones - day - 2] + ' Non. ' + monthAbbreviations[month] + '.</abbr>';
	if (day === nones - 1)
		return '<abbr title="prīdiē nōnās ' + monthsAcc[month]
			+ '">Prid. Non. ' + monthAbbreviations[month] + '.</abbr>';
	if (day === nones)
		return '<abbr title="nōnīs ' + monthsAbl[month]
			+ '">Non. ' + monthAbbreviations[month] + '.</abbr>';
	if (1 < ides - day)
		return '<abbr title="ante diem ' + numerals[ides-2-day] + ' īdūs ' + monthsAcc[month]
			+ '"> a.d. ' + numeralAbbreviations[ides-2-day] + ' Eid. ' + monthAbbreviations[month] + '.</abbr>';
	if (day === ides - 1)
		return '<abbr title="prīdiē īdūs ' + monthsAcc[month]
			+ '">Prid. Eid. ' + monthAbbreviations[month] + '.</abbr>';
	if (day === ides)
		return '<abbr title="īdibus' + monthsAbl[month]
			+ '">Eid. ' + monthAbbreviations[month] + '.</abbr>';
	// at this point all that remains is the time before the Kalends...
	if (day === numberOfDaysInTheMonth)
		return '<abbr title="prīdiē kalendās ' + monthsAcc[nextMonth]
			+ '">Prid. Eid. ' + monthAbbreviations[nextMonth] + '.</abbr>';
	return '<abbr title="ante diem ' + numerals[numberOfDaysBeforeNextKalends + ides - day] + ' kalendās ' + monthsAcc[nextMonth]
		+ '"> a.d. ' + numeralAbbreviations[numberOfDaysBeforeNextKalends + ides - day] + ' Kal. ' + monthAbbreviations[nextMonth] + '.</abbr>';
}

/** Probably broken, but... */
function hebrew(){
	// maybe stick to https://www.hebcal.com/home/40/displaying-todays-hebrew-date-on-your-website
	var monthNames = [
		'Tishrei', 'Cheshvan', 'Kislev', 'Tevet', 'Shevat', 'Adar',
		'Nisan', 'Iyar', 'Sivan', 'Tammuz', 'Av', 'Elul'
	];
	var monthLengths = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29];
	var leapMonthNames = [
		'Tishrei', 'Cheshvan', 'Kislev', 'Tevet', 'Shevat', 'Adar I',
		'Adar II',
		'Nisan', 'Iyar', 'Sivan', 'Tammuz', 'Av', 'Elul'
	];
	var leapMonthLengths = [30, 29, 30, 29, 30, 30, 29, 30, 29, 30, 29, 30, 29];
	// year advances on tishrei
	// Nisan begins 2 wk before the vernal equinox???
	var epoch = +new Date(2021, 8, 7); // 7 Sep 2021 = 1 Tishrei 5782
	var remainder = new Date() - epoch;
	var year = 5782 + Math.floor(remainder / 31556952000);
	var metonic = year % 19;
	var isLeap = [3, 6, 8, 11, 14, 17, 19].includes(metonic);
	remainder %= 31556952000; // ms since year start
	var month = 0;
	var monthName;
	if (isLeap){
		while (0 < remainder - 1000*60*60*24*leapMonthLengths[month])
			remainder -= 1000*60*60*24*leapMonthLengths[month++];
		monthName = leapMonthNames[month];
	}
	else {
		while (0 < remainder - 1000*60*60*24*monthLengths[month])
			remainder -= 1000*60*60*24*monthLengths[month++];
		monthName = monthNames[month];
	}
	var afterSunset = 16 <= new Date().getHours(); // approximation
	var day = Math.floor(remainder / (1000*60*60*24))
		+ afterSunset + 1; // 1-indexed
	return day + ' ' + monthName + ' ' + year;
}

/** @param {number} t hours past dawn */
function solarDayHelper(t, includeSeconds){
	t += 6;
	t %= 24;
	var h = Math.floor(t);
	var m = Math.floor((t - h)*60);
	var s = Math.floor((t - h - m/60)*3600);
	// 12h time
	var ampm = 'AP'[+(11 < h)] + 'M';
	h = h%12 || 12;
	var digits = [h, m];
	if (includeSeconds)
		digits.push(s);
	return digits.map(x => (x + '').padStart(2, 0)).join(':') + ' ' + ampm;
}

function solarDay(now, latitude, longitude){
	now = now || new Date();
	latitude = latitude || 36;
	longitude = longitude || -79;
	// main
	var _1d = 24*60*60*1000;
	var TODAY = solarPosition(now, latitude, longitude);
	var YESTERDAY = solarPosition(new Date(now - _1d), latitude, longitude);
	var TOMORROW = solarPosition(new Date(+now + _1d), latitude, longitude);
	var t = now < TODAY.sunrise ? (now - YESTERDAY.sunset)/(TODAY.sunrise - YESTERDAY.sunset)/2+0.5
		: now < TODAY.sunset ? (now - TODAY.sunrise)/(TODAY.sunset - TODAY.sunrise)/2
			: (now - TODAY.sunset)/(TOMORROW.sunrise - TODAY.sunset)/2 + 0.5;
	var dawndusk_str = '↑ ' + TODAY.sunrise.toLocaleTimeString('en-US', {timeStyle: 'short'})
		+ '; <abbr title="noon">n</abbr> ' + TODAY.snoon.toLocaleTimeString('en-US', {timeStyle: 'short'})
		+ '; ↓ ' + TODAY.sunset.toLocaleTimeString('en-US', {timeStyle: 'short'});
	var daytime_str = '(' + (TODAY.dayLength/60).toFixed(2) + ' h day; ' + dawndusk_str + ')';
	return solarDayHelper(24*t, true)
		+ ' <abbr title="h:m:s since local midnight">solar time</abbr> '
		+ avoidWrap(daytime_str);
}

/** this still seems buggy...
 * @param {Date} t
 * @param {number} latitude in degrees (eg. NYC = +41)
 * @param {number} longitude in degrees (eg. NYC = -74)
 */
function solarPosition(t, latitude, longitude){
	// http://www.jgiesen.de/astro/suncalc/calculations.htm
	var offset = t.getTimezoneOffset();
	latitude *= Math.PI/180; // convert to radians
	longitude *= -1; // the site seems to use a weird backwards longitude...?
	var y = 2*Math.PI * (t - new Date(t.getFullYear(), 0, 1))/(1000*60*60*24*365.2425);
	// eslint-disable-next-line max-len
	var eqtime = 229.18*(0.000075+0.001868*Math.cos(y)-0.032077*Math.sin(y)-0.014615*Math.cos(2*y)-0.040849*Math.sin(2*y));
	// eslint-disable-next-line max-len
	var declin = 0.006918-0.399912*Math.cos(y)+0.070257*Math.sin(y)-0.006758*Math.cos(2*y)+0.000907*Math.sin(2*y)-0.002697*Math.cos(3*y)+0.00148*Math.sin(3*y);
	var time_offset = eqtime - 4*longitude + offset;
	var tst = t.getHours()*60 + t.getMinutes() + t.getSeconds()/60
		+ t.getMilliseconds()/60000 + time_offset;
	var ha = (tst/4 - 180)*Math.PI/180;
	// eslint-disable-next-line max-len
	var phi = Math.acos(Math.sin(latitude)*Math.sin(declin)+Math.cos(latitude)*Math.cos(declin)*Math.cos(ha));
	// eslint-disable-next-line max-len
	var theta = Math.PI - Math.acos(-(Math.sin(latitude)*Math.cos(phi)-Math.sin(declin))/(Math.cos(latitude)*Math.sin(phi)));
	var refrac = 90.833 * Math.PI/180;
	// eslint-disable-next-line max-len
	var ha_inner = Math.cos(refrac)/(Math.cos(latitude)*Math.cos(declin)) - Math.tan(latitude)*Math.tan(declin);
	var ha_ = Math.acos(ha_inner);
	var sunrise = 720 + 4*(longitude-ha_*180/Math.PI) - eqtime;
	var sunset = 720 + 4*(longitude+ha_*180/Math.PI) - eqtime;
	var snoon = 720 + 4*longitude - eqtime;
	return {
		dayLength: sunset - sunrise, // min
		declin: declin, // rad
		eqtime: eqtime, // min
		ha: ha, // rad
		ha_: ha_, // rad
		ha_inner: ha_inner, // dimensionless??? if this is <=-1 then eternal night, if this is 1<= eternal day (or was it vice versa?)
		phi: phi, // rad
		snoon: new Date(Date.UTC(t.getFullYear(), t.getMonth(), t.getDate(), 0, snoon)),
		sunrise: new Date(Date.UTC(t.getFullYear(), t.getMonth(), t.getDate(), 0, sunrise)),
		sunset: new Date(Date.UTC(t.getFullYear(), t.getMonth(), t.getDate(), 0, sunset)),
		theta: theta, // rad
		time_offset: time_offset, // min
		tst: tst, // min
		y: y, // rad
	};
}

function elderscrolls(){
	var d = new Date();
	// 2011 = 4E 201... therefore 1810 is the offset
	var year = d.getFullYear() - 1810;
	var month = [
		'Morning Star', 'Sun\'s Dawn', 'First Seed',
		'Rain\'s Hand', 'Second Seed', 'Midyear',
		'Sun\'s Height', 'Last Seed', 'Hearthfire',
		'Frostfall', 'Sun\'s Dusk', 'Evening Star'
	][d.getMonth()];
	var sign = [
		'Ritual', 'Lover', 'Lord', 'Mage', 'Shadow', 'Steed',
		'Apprentice', 'Warrior', 'Lady', 'Tower', 'Atronach', 'Thief'
	][d.getMonth()];
	var weekday = ['Sundas', 'Morndas', 'Tirdas', 'Middas', 'Turdas', 'Fredas', 'Loredas'][d.getDay()];
	return weekday + ', ' + d.getDate() + ' <abbr title="Sign: The ' + sign + '">' + month + '</abbr> 4E ' + year;
}

function kol(){
	var epoch = new Date(2002, 9, 28); // Jarlsuary 1, year 0 = 10/28/02
	var time = Math.floor((new Date() - epoch)/(24*60*60*1000)); // days
	var year = Math.floor(time/(12*8));
	time -= 12*8*year;
	var month = Math.floor(time/8);
	time -= 8*month;
	time++;
	var s = 'Jarlsuary Frankuary Starch April Martinus Bill Bor Petember Carlvember Porktober Boozember Dougtember'.split(' ')[month]
		+ ' ' + time + ', Year ' + year;
	// Buff Days
	if (time === [1, 8][month % 2]) // Moxie
		s += ' <abbr title="Moxie">Mo</abbr>';
	else if (month % 2 === 1 && time < 3) // Muscle
		s += ' <abbr title="Muscle">Mu</abbr>';
	else if (time === 5) // Mysticality
		s += ' <abbr title="Mysticality">My</abbr>';
	// holidays
	if (time === [1, 4, 3, 2, 2, 3, 4, 4, 6, 8, 7, 4][month])
		s += ' <abbr title="Holiday">H</abbr>';
	// Ronald and Grimace phases
	var phases = ['Full', 'Waning Gibbous', 'Third Quarter', 'Waning Crescent',
		'New', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous'];
	s += ' <abbr title="Ronald Phase: ' + phases[(time+3)%8] + '">R</abbr>';
	s += ' <abbr title="Grimace Phase: ' + phases[(Math.floor(month%2 * 4 + time/2)+4)%8] + '">G</abbr>';
	return s;
}

function beat(){
	function pad(n){
		return n.toString().padStart(2, '0');
	}
	var d = new Date(+new Date() + 3600000);
	var date = 'd' + [d.getDate(), d.getMonth(), d.getFullYear() % 100].map(pad).join('.');
	return date + ' @' + (d%86400000 / 86400).toFixed(2)
		+ ' <a href="https://en.wikipedia.org/wiki/Swatch_Internet_Time">BMT</a>';
}

/** A lunisolar calendar that uses a 334-year = 4131-month cycle
 * month drift: -0.4108807128 days per millennium
 * year drift:  -0.3249700599 days per millennium
 * rules:
 * only consider the number of years elapsed in the current 334-year cycle (ie. y %= 334)
 * There are twelve months in a normal year.
 * A normal month has 30 days if it is even-indexed, 29 otherwise.
 * A leap month is placed at the end of leap years.
 * Leap years are years such that year mod 19 mod 3 is zero.
 * Keep track of the number of leap years that have already passed in a 334-year cycle.
 * The length of a leap month is 30 if that number mod 17 is odd, and 31 if it is even.
 * This means that, per cycle, there are 65 31-day leap years, and 58 30-day leap years,
 * for an average length of ~30.52845528 d.
 * This means the average year length is ~365.242515 d, and the average month length is ~29.53062213 d.
 * The total cycle length is 121991 days, or 4131 months, or 334 years.
 * A year can have 354, 384, or 385 days.
 * Per 334-year cycle, there are 211 354-day years, 58 384-day years, and 65 385-day years.
 */
function mochaLunisolar(t, link){
	// default
	t = t || new Date();
	if (isNaN(t))
		throw new Error('INVALID DATE');
	var _1h = 1000*60*60;
	var _1d = 24*_1h;
	var epoch = new Date(Date.UTC(2015, 2, 20, 5)); // local midnight, last vernal equinox with a full moon - the next closest is in 1939, and beyond that, before 1900
	var LUNAR_SIDEREAL_PERIOD = 27.321661 * _1d; // used only for lunar mansions
	var normalYearLength = 354;
	var cycleLength = 334;
	var _334 = 121991;
	var headerTag = link ? 'a' : 'abbr';
	var header = '<' + headerTag + ' title="Mocha\'s Lunisolar Calendar" href="https://mocha2007.github.io/tools/mlsc">MLSC</'
		+ headerTag + '> ';
	var daysSinceEpoch = Math.floor((t - epoch)/_1d);
	var _334s = Math.floor(daysSinceEpoch / _334);
	daysSinceEpoch -= _334 * _334s;
	var y = cycleLength * _334s;
	var yearLength;
	var leapIndex = 0;
	var yearStartT = _334 * _334s;
	// eslint-disable-next-line max-len
	for (; (yearLength = (mod(y, 19)%3 ? 0 : leapIndex++%17%2 ? 30 : 31) + normalYearLength) <= daysSinceEpoch; y++){
		daysSinceEpoch -= yearLength;
		yearStartT += yearLength;
	}
	yearStartT = new Date(+epoch + yearStartT * _1d);
	// DST fix
	if (yearStartT.getHours())
		yearStartT = new Date(+yearStartT + _1h);
	var monthStartT = +yearStartT;
	// now figure out month/day
	var mo;
	for (mo = 0; mo < 13; mo++){
		var monthLength = 30 - mo % 2 + (yearLength === 385 && mo === 12); // stuff in parens is accounting for long leap months
		if (monthLength <= daysSinceEpoch){
			daysSinceEpoch -= monthLength;
			monthStartT += _1d*monthLength;
		}
		else
			break;
	}
	// epicycles
	var epicycleR = mod(_334s + mochaLunisolar.eraROffset, mochaLunisolar.cyclesPerEpi);
	// eslint-disable-next-line brace-style
	var epicycleEra = (12 - mochaLunisolar.eraStarts.findIndex(function(n){return epicycleR < n;}))
		% 12;
	var eraName = mochaLunisolar.monthNames[epicycleEra];
	var ELH = (12 - epicycleEra) % 12;
	var eraR = mod(epicycleR - mochaLunisolar.eraStarts[mod(ELH+11, 12)]
		, mochaLunisolar.cyclesPerEpi);
	var eraLength = mod(mochaLunisolar.eraStarts[ELH]
		- mochaLunisolar.eraStarts[mod(ELH-1, 12)], mochaLunisolar.cyclesPerEpi);
	var eraString = avoidWrap('(Age of ' + eraName + ', Cycle ' + (eraR+1) + ' of ' + eraLength + ', Year ' + (mod(y, 334)+1) + ')');
	// weekday
	monthStartT = new Date(monthStartT);
	var quarters = [
		monthStartT,
		new Date(monthStartT.getFullYear(), monthStartT.getMonth(), monthStartT.getDate()+7),
		new Date(monthStartT.getFullYear(), monthStartT.getMonth(), monthStartT.getDate()+15),
		new Date(monthStartT.getFullYear(), monthStartT.getMonth(), monthStartT.getDate()+22)
	];
	var currentQuarter = (mod(quarters.findIndex(q => t < q), 5)+3)%4;
	var daysAfterQuarter = Math.floor((t - quarters[currentQuarter])/_1d);
	var quarterName = 'the ' + mochaLunisolar.quarterNames[currentQuarter];
	var dayName = daysAfterQuarter
		? mochaLunisolar.dayNames[daysAfterQuarter-1] + '’s Day of ' + quarterName
		: quarterName;
	// Lunar Mansion
	var mansionID = (Math.round(t/LUNAR_SIDEREAL_PERIOD % 1 * mochaLunisolar.mansions.length)
		+ mochaLunisolar.mansionOffset) % mochaLunisolar.mansions.length;
	// continue
	var season = 'Spring Summer Fall Winter Month'.split(' ')[Math.floor(mo/4)];
	var MS = 'Early Mid Late Intercalary'.split(' ')[mo === 12 ? 4 : mo % 3];
	var meton = Math.floor(y/19);
	var d = 1 + daysSinceEpoch; // 1-indexed
	var monthName = 12 < mo ? 'Aurora' : mochaLunisolar.monthNames[(mo + epicycleEra) % 12];
	var string = header + ordinal(d) + ' ' + avoidWrap('(' + dayName + ')')
		+ ' of ' + monthName + ' (' + MS + ' ' + season + '), ' + y + ' ' + eraString;
	var monthDay = monthStartT.getDay(), monthWeek = 0;
	for (var date = 0; date < daysSinceEpoch; date++){
		monthDay++;
		if (6 < monthDay){
			monthDay -= 7;
			monthWeek++;
		}
	}
	// misc data
	var nextMonth = new Date(+monthStartT + 31*_1d);
	var previousMonth = new Date(monthStartT - _1d);
	return {
		cycles: _334s,
		date: d,
		epicycle: epicycleR,
		era: epicycleEra,
		eraLength: eraLength,
		eraMonths: new Array(12).fill(0)
			// eslint-disable-next-line brace-style
			.map(function(_, i){return mochaLunisolar.monthNames[(i + epicycleEra) % 12];})
			.concat([mochaLunisolar.monthNames[12]]),
		eraName: mochaLunisolar.monthNames[epicycleEra], // this is the month of the year it starts on...
		eraR: eraR,
		eraString: eraString,
		icas: quarters[3], // third quarter
		ides: quarters[2], // full
		kalends: quarters[0], // new
		leap: normalYearLength < yearLength,
		meton: meton,
		mansion: mochaLunisolar.mansions[mansionID],
		mansionID: mansionID,
		month: mo,
		monthDay: monthDay,
		monthLength: monthLength,
		monthName: monthName,
		monthStartT: monthStartT,
		monthWeek: monthWeek,
		nextMonth: nextMonth,
		previousMonth: previousMonth,
		nones: quarters[1], // first quarter
		string: string,
		t: t,
		weekdayM: daysAfterQuarter,
		weekdayMName: dayName,
		year: y,
		yearLengthDays: yearLength,
		yearLengthMonths: 12 + (normalYearLength < yearLength),
		yearStartT: yearStartT,
	};
}
// Most of month 0 will be in Pisces until 3665 CE (MLST ~1650), when half is in Aquarius instead.
// Hypothetically, after 11 334-cycles (3674 years), Aquarius could be made the first month by decree...
// 5374 CE (MLST ~3359) it would switch to Capricorn after 10 334-cycles
// current "era" = (C+7) % 77
// mochaLunisolar.eraStarts = [4, 12, 17, 23, 31, 36, 41, 50, 58, 62, 69, 77];
mochaLunisolar.eraStarts = [6, 13, 19, 25, 32, 38, 44, 51, 58, 64, 70, 77]; // based on even divisions centered roughly on the middle of pisces...
//							  March April May June July August September October November December January February Intercalary
mochaLunisolar.dayNames = 'Sol Luna Mars Mercury Jupiter Venus Saturn Uranus'.split(' ');
mochaLunisolar.quarterNames = 'Kalends Nones Ides Icas'.split(' ');
mochaLunisolar.monthNames = 'Aries Taurus Gemini Cancer Leo Virgo Libra Ophiuchus Sagittarius Capricornus Aquarius Pisces Aurora'.split(' ');
mochaLunisolar.cyclesPerEpi = mochaLunisolar.eraStarts[11];
mochaLunisolar.eraROffset = 9; // set to 7 for the original lengths
mochaLunisolar.mansions = [
	// starting 0 deg ecliptic long, ending 360, in intervals of 10 deg, visualize a box +/- 5 deg longitude +/- 6 deg latitude, choose brightest star
	'ω Piscium', 'δ Piscium', 'ε Piscium', 'η Piscium', 'μ Ceti', '5 Tauri', 'Pleiades', 'Aldebaran', '119 Tauri', 'ζ Tauri',
	'Tejat', 'Wasat', '81 Geminorum', 'Asellus Australis', 'Subra', 'Regulus', 'ρ Leonis', 'ν Virginis', 'Zavijava', 'Porrima',
	'Spica', 'Kang', 'Khambalia', 'Zubenelgenubi', 'Dschubba', 'Antares', 'Garafsa', 'Polis', 'Nunki', 'Albaldah',
	'Dabih', 'θ Capricorni', 'δ Capricorni', 'Ancha', 'Hydor', 'φ Aquarii',
];
mochaLunisolar.mansionOffset = 20;

function astro(){
	var t = new Date();
	var DAY = 1000*60*60*24;
	var MONTH = 29.530588904835206 * DAY;
	var YEAR = 365.24219 * DAY;
	var SEASON = YEAR / 4;
	var newMoon = new Date(2023, 11, 12, 18, 31);
	var spring = new Date(2023, 2, 20, 4, 8);
	var monthR = mod(t - newMoon, MONTH);
	var yearR = mod(t - spring, YEAR);
	var season = ['Vernal Equinox', 'Summer Solstice', 'Autumnal Equinox', 'Winter Solstice'][Math.floor(yearR / SEASON)];
	var seasonR = yearR % SEASON;
	return Math.floor(seasonR/DAY) + ' days since the ' + season + ', '
		+ Math.floor(monthR/DAY) + ' days since a new moon';
}

/** @param {number} y */
function getEaster(y){
	function div(dividend, divisor){
		return Math.floor(dividend / divisor);
	}
	var a = y % 19, b = div(y, 100), c = y % 100;
	var d = div(b, 4), e = b % 4, f = div(b + 8, 25), i = div(c, 4), k = c % 4;
	var g = div(b - f + 1, 3);
	var h = (19*a + b - d - g + 15) % 30;
	var l = (32 + 2*e + 2*i - h - k) % 7;
	var m = div(a + 11*h + 22*l, 451);
	var n = div(h + l - 7*m + 114, 31), o = (h + l - 7*m + 114) % 31;
	return new Date(y, n-1, o+1);
}
getEaster.html = function(){
	var now = new Date();
	var y = now.getFullYear();
	var current = getEaster(y);
	return 'Next Easter: ' + (current < now ? getEaster(y+1) : current)
		.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
};

function stardate(){
	// updates every 14m24s
	var date = new Date();
	var y = 1970 + date/31556952000;
	var d = mod(date/86400000, 1);
	return 'Stardate ' + Math.round(1000 * y - 2322242) + '.' + Math.round(d*100);
}

function bonus(){
	/*
	solarDay updates ~1 hz
	JD updates once every 8.64 s
	Darian updates once every 88.776 s
	1 DF tick = 50s
	*/
	function onTick100(){ // every 100 ms
		document.getElementById('clockbonus_tick100').innerHTML = [beat(), solarDay()].join('<br>');
	}
	function onTick1000(){ // every 1 s
		document.getElementById('clockbonus_tick1000').innerHTML = ['JD '+jd().toFixed(4), Math.round(new Date()/1000) + ' Unix Time'].join('<br>');
	}
	function onTick10000(){ // every 10 s
		document.getElementById('clockbonus_tick10000').innerHTML = [darian(), dorf()].join('<br>');
	}
	function onTick100000(){// every 1m40s
		document.getElementById('clockbonus_tick100000').innerHTML = [stardate()].join('<br>');
	}
	onTick100();
	onTick1000();
	onTick10000();
	onTick100000();
	// all these clocks update once a day, so no need to have these recomputed every 100 ms
	document.getElementById('clockbonus').innerHTML = ['<br><hr>', zodiac(), china(),
		egypt(), hebrew(), japan(), romanFULL(), maya(), elderscrolls(),
		kol(), mochaLunisolar(new Date(), true).string, astro(), getEaster.html()].join('<br>');
	setInterval(onTick100, 100);
	setInterval(onTick1000, 1000);
	setInterval(onTick10000, 10000);
	setInterval(onTick10000, 100000);
}