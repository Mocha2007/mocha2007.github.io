/* eslint-disable no-var */
/* eslint-env es3 */
/* jshint esversion: 3, strict: true, strict: global, eqeqeq: true */
/* exported goldClock, sundial */
/* global createSvgElement, phoonsvg, svgScale */
'use strict';

/**
 * creates a clock that looks like the clock in MC, except it accounts for the moon's phase and relative position.
 * @param {number} dayPhase [0, 1) 0 = 1 = dawn
 * @param {number} moonPhase [0, 1) 0 = 1 = new moon
 * @param {boolean} ornamental dress this svg up like a MC-style clock
 * @param {number[]} planets array of planet locations, measured in radians from the sun
 * @param {string[]} planetNames array of planet names (default = all blank)
 */
function sundial(dayPhase, moonPhase, ornamental, planets, planetNames){
	// default values
	planets = planets || [];
	planetNames = planetNames || [];
	// main
	var bodySize = 0.2;
	var fontsize = 0.1;
	/**
	 * IMAGE STRUCTURE
	 * cyan day sky
	 * midnight blue sky with semicircular mask
	 * pale yellow sun circle
	 * phoon()
	 * both of these are rotated about the center
	 */
	var svg = createSvgElement('svg');
	svg.classList.add('sundial');
	svg.setAttribute('viewBox', '-1.1 -1.1 2.2 2.2');
	svg.setAttribute('width', 10*svgScale);
	svg.setAttribute('height', 10*svgScale);
	svg.setAttribute('aria-label', 'Sundial');
	// css
	var style = document.createElement('style');
	style.innerHTML = 'text{font-size:' + fontsize
		+ 'px;user-select:none;}\ng .pText{fill:white;opacity:0;paint-order:stroke;stroke:black;stroke-width:0.02px;}\ng:hover > .pText{opacity:1;}';
	svg.appendChild(style);
	// gold perimeter disk
	if (ornamental){
		var clockDisk = createSvgElement('circle');
		svg.appendChild(clockDisk);
		clockDisk.setAttribute('r', 1.1);
		clockDisk.style.fill = '#fc0';
	}
	// entire image
	var g = createSvgElement('g');
	svg.appendChild(g);
	// rotate entire image
	var globalTheta = 360 * dayPhase - 90;
	g.setAttribute('transform', 'rotate(' + globalTheta + ', 0, 0)');
	// day disk
	var dayDisk = createSvgElement('circle');
	g.appendChild(dayDisk);
	dayDisk.setAttribute('r', 1);
	dayDisk.style.fill = '#08f';
	// mask https://stackoverflow.com/a/61001784
	var mask = createSvgElement('clipPath');
	g.appendChild(mask);
	mask.id = 'cut-off';
	var rect = createSvgElement('rect');
	mask.appendChild(rect);
	rect.setAttribute('x', -1);
	rect.setAttribute('y', 0);
	rect.setAttribute('width', 2);
	rect.setAttribute('height', 1);
	// night disk
	var nightDisk = createSvgElement('circle');
	g.appendChild(nightDisk);
	nightDisk.setAttribute('r', 1);
	nightDisk.style.fill = '#204';
	nightDisk.setAttribute('clip-path', 'url(#cut-off)');
	// sun disk
	var sunDisk = createSvgElement('circle');
	g.appendChild(sunDisk);
	sunDisk.setAttribute('r', bodySize);
	sunDisk.setAttribute('cy', -0.5);
	sunDisk.style.fill = '#ff8';
	// phoon https://stackoverflow.com/a/27546213
	var moonContainer = createSvgElement('g');
	g.appendChild(moonContainer);
	moonContainer.setAttribute('transform', 'rotate(' + 360 * -moonPhase + ', 0, 0)');
	var moonDisk = phoonsvg(moonPhase);
	moonContainer.appendChild(moonDisk);
	moonDisk.setAttribute('width', 2*bodySize);
	moonDisk.setAttribute('height', 2*bodySize);
	moonDisk.setAttribute('x', -0.19);
	moonDisk.setAttribute('y', -0.7);
	// planets
	for (var pID = 0; pID < planets.length; pID++){
		var angle = 180/Math.PI * planets[pID];
		// planet group
		var pg = createSvgElement('g');
		g.appendChild(pg);
		pg.setAttribute('transform', 'rotate(' + angle + ', 0, 0)');
		// planet disk
		var planetDisk = createSvgElement('circle');
		pg.appendChild(planetDisk);
		planetDisk.style.fill = 'white';
		planetDisk.style.stroke = 'black';
		planetDisk.style.strokeWidth = bodySize/16;
		planetDisk.setAttribute('r', bodySize/8);
		planetDisk.setAttribute('cy', -0.5);
		// planet label
		var planetLabel = createSvgElement('text');
		pg.appendChild(planetLabel);
		planetLabel.innerHTML = planetNames[pID];
		planetLabel.classList.add('pText');
		planetLabel.setAttribute('y', -0.5);
		var labelTheta = -globalTheta-angle;
		planetLabel.setAttribute('transform', 'rotate(' + labelTheta + ', 0, -0.5)');
	}
	if (ornamental){
		var labels = ['Dawn', 'L. Morning', 'Noon', 'Afternoon', 'Dusk', 'Evening', 'Midnight', 'E. Morning'];
		for (let i = 0; i < labels.length; i++){
			var dayLabel = createSvgElement('text');
			g.appendChild(dayLabel);
			var s = labels[i];
			var fill = i % 4 ? i % 2 ? 'silver' : 'white' : 'red';
			var theta = 90 - 45*i;
			printCharArc(g, s, fill, -0.91, theta);
		}
		// bottom half of mc clock
		var bottomDisk = createSvgElement('circle');
		svg.appendChild(bottomDisk);
		bottomDisk.setAttribute('r', 1);
		bottomDisk.style.fill = 'rgba(255, 192, 0, 0.5)';
		bottomDisk.setAttribute('clip-path', 'url(#cut-off)');
		// ornamentation
		// middle bar
		var bar = createSvgElement('rect');
		svg.appendChild(bar);
		bar.setAttribute('x', -1);
		bar.setAttribute('y', -0.05);
		bar.setAttribute('width', 2);
		bar.setAttribute('height', 0.1);
		bar.style.fill = '#fc0';
		// triangle
		var triangle = createSvgElement('polygon');
		svg.appendChild(triangle);
		triangle.setAttribute('points', '-0.2 0, 0 -0.2, 0.2 0');
		triangle.style.fill = '#fc0';
		// text
		if (ornamental === 2){
			var hLabel;
			var hours = 'I II III IV V VI VII VIII IX X XI XII'.split(' ');
			for (var i = 0; i < 2*hours.length; i++){
				s = hours[i%12];
				theta = -15 - 15*i;
				hLabel = printCharArc(g, s, '#860', -1.015, theta);
			}
			// east/west
			var eastLabel = hLabel.cloneNode();
			svg.appendChild(eastLabel);
			eastLabel.innerHTML = 'WEST';
			eastLabel.setAttribute('x', 0.45);
			eastLabel.setAttribute('y', 0.03);
			eastLabel.setAttribute('transform', 'rotate(0, 0, 0)');
			var westLabel = eastLabel.cloneNode();
			svg.appendChild(westLabel);
			westLabel.innerHTML = 'EAST';
			westLabel.setAttribute('x', -0.65);
			var southLabel = eastLabel.cloneNode();
			svg.appendChild(southLabel);
			southLabel.innerHTML = 'Z';
			southLabel.setAttribute('x', -0.025);
			southLabel.setAttribute('y', -0.08);
		}
	}
	return svg;
}

// ok below this line you can use es6 lol

/**
 * @param {SVGElement} parent
 * @param {string} s
 * @param {string} color (default: black)
 * @param {number} y (default: 0)
 * @param {number} startAngle (default: 0)
 * @returns {SVGTextElement} the last char
 */
function printCharArc(parent, s, color = 'black', y = 0, startAngle = 0){
	// MAIN
	var charAngle = 3 / Math.abs(y);
	for (var j = 0; j < s.length; j++){
		var hLabel = createSvgElement('text');
		parent.appendChild(hLabel);
		hLabel.innerHTML = s[j];
		hLabel.style.fill = color;
		// hLabel.setAttribute('font-size', fontSize);
		// hLabel.setAttribute('text-align', 'center');
		hLabel.setAttribute('y', y);
		var theta = startAngle + charAngle * (j - s.length/2) + 0.1;
		hLabel.setAttribute('transform', 'rotate(' + theta + ', 0, 0)');
	}
	return hLabel;
}

function goldClock(t = new Date(), lang = 'EN'){
	var size = 17;
	var barWidth = 0.01;
	var ACTUAL_TIME = t;
	var EPOCH_EQUINOX_VERNAL = new Date(2023, 2, 20, 21, 25);
	var EPOCH_MOON_NEW = new Date(2023, 11, 12, 18, 31);
	var EPOCH_MOON_DESCENDING_NODE = new Date(2020, 5, 6, 18, 10); // https://astropixels.com/ephemeris/moon/moonnodes2001.html
	var EPOCH_MOON_PERIGEE = new Date(2020, 0, 13, 20, 20); // unkhttps://astropixels.com/ephemeris/moon/moonperap2001.htmlnown
	var colorScheme = ['#fc0', '#860', '#640'];
	// main
	var svg = createSvgElement('svg');
	svg.classList.add('sundial');
	svg.setAttribute('viewBox', [-size/10, -size/10, size/5, size/5].join(' '));
	svg.setAttribute('width', 10*svgScale);
	svg.setAttribute('height', 10*svgScale);
	svg.setAttribute('aria-label', 'Sundial');
	// css - this causes lag I think?
	// var style = document.createElement('style');
	// style.innerHTML = 'text{font-size:0.1px;user-select:none;}';
	// svg.appendChild(style);
	// eslint-disable-next-line sort-vars
	var _1m = 1000*60, _1h = _1m*60, _1d = _1h*24, _1w = _1d*7;
	t = new Date(t - t.getTimezoneOffset()*_1m);
	// eslint-disable-next-line max-len
	var _1mo = new Date(t.getUTCFullYear(), t.getUTCMonth()+1) - new Date(t.getUTCFullYear(), t.getUTCMonth());
	var _1y = new Date(t.getUTCFullYear()+1, 0) - new Date(t.getUTCFullYear(), 0);
	var LUNAR_SYNODIC_PERIOD = 29.530594*_1d;
	var LUNAR_DRACONIC_PERIOD = 27.212220817*_1d;
	var LUNAR_ANOMALISTIC_PERIOD = 27.55454988*_1d;
	// var EY = LUNAR_SYNODIC_PERIOD * LUNAR_DRACONIC_PERIOD
	//	/ (LUNAR_SYNODIC_PERIOD - LUNAR_DRACONIC_PERIOD); // ~346.62d
	var YTROPICAL = 365.24219 * _1d;
	var moonPhase = (ACTUAL_TIME - EPOCH_MOON_NEW)/(29.530594*_1d) % 1;
	var intervals = [_1m, _1h, _1d, _1w, _1mo, _1y,
		YTROPICAL, YTROPICAL, LUNAR_SYNODIC_PERIOD,
		LUNAR_SYNODIC_PERIOD, LUNAR_DRACONIC_PERIOD, LUNAR_ANOMALISTIC_PERIOD]; // eclipse shit
	var divisions = [60, 60, 24, 7, _1mo/_1d, 12, 12, 4, 8, 30, 28, 13];
	var indices = [0, 0, 'H', 'D', 1, 'mo', 'Z', 'S', 'M', 'E1', 'E2', 'E3'];
	var progress = [t/_1m%1, t/_1h%1, t/_1d%1, (+t+4*_1d)/_1w%1];
	progress.push((t.getUTCDate()-1+progress[2])*_1d/_1mo); // days in the present month
	progress.push((t.getUTCMonth()+progress[4])*_1mo/_1y); // months in the present year
	progress.push((ACTUAL_TIME - EPOCH_EQUINOX_VERNAL)/YTROPICAL%1); // season progress
	progress.push(progress[6]); // zodiac progress
	progress.push((moonPhase + 1/16)%1); // moon phase
	progress.push(moonPhase); // eclipse 1 (synodic)
	progress.push((ACTUAL_TIME - EPOCH_MOON_DESCENDING_NODE)/LUNAR_DRACONIC_PERIOD%1); // eclipse 2 (draconic)
	progress.push((ACTUAL_TIME - EPOCH_MOON_PERIGEE)/LUNAR_ANOMALISTIC_PERIOD%1); // eclipse 3 (anomalistic) (for determining totality)
	intervals.forEach((_, i, a) => {
		var back = colorScheme[i%2];
		var fore = colorScheme[(i+1)%2];
		var i_ = a.length-i;
		var r = 0.5 + 0.1*i_;
		var ang = 360 / divisions[i];
		// light hour disk
		var gH = createSvgElement('g');
		svg.appendChild(gH);
		var diskH = createSvgElement('circle');
		gH.appendChild(diskH);
		diskH.setAttribute('r', r);
		diskH.style.fill = back;
		var thetaH = -360*progress[i];
		gH.setAttribute('transform', 'rotate(' + thetaH + ', 0, 0)');
		// text
		for (var j = 0; j < divisions[i]; j++){
			var theta = ang*j;
			var ind, s;
			switch (ind = indices[i]){
				case 'D':
					s = goldClock.language[lang].day[j];
					break;
				case 'E1':
					s = 'S             LL             S'[j];
					break;
				case 'E2':
					s = '--          ++++          --'[j];
					break;
				case 'E3':
					s = 'TTTAAAAAAATTT'[j]; // 68/147 tot/ann/hyb eclipses in the 21st century are total which is ~46.3% ~6/13
					break;
				case 'H':
					s = goldClock.language[lang].ap[Math.floor(j/12)].replace('_', j%12 || 12);
					break;
				case 'M':
					s = goldClock.language[lang].moon[j];
					break;
				case 'mo':
					s = goldClock.language[lang].month[j];
					break;
				case 'S':
					s = goldClock.language[lang].season[j];
					break;
				case 'Z':
					s = goldClock.language[lang].zodiac[j];
					break;
				default:
					s = ''+(j + ind);
			}
			printCharArc(gH, s, fore, 0.08 - r, theta + ang/2);
			// tick
			var tick = createSvgElement('rect');
			gH.appendChild(tick);
			tick.setAttribute('x', 0);
			tick.setAttribute('y', -r);
			tick.setAttribute('width', barWidth);
			tick.setAttribute('height', 0.1);
			tick.style.fill = fore;
			tick.setAttribute('transform', 'rotate(' + theta + ', 0, 0)');
		}
	});
	// ornamentation
	// triangle
	var bar = createSvgElement('rect');
	svg.appendChild(bar);
	bar.setAttribute('x', -barWidth/2);
	bar.setAttribute('y', -size/10);
	bar.setAttribute('width', barWidth);
	bar.setAttribute('height', size/10);
	bar.style.fill = colorScheme[2];
	// center disk
	var diskH = createSvgElement('circle');
	svg.appendChild(diskH);
	diskH.setAttribute('r', 0.5);
	diskH.style.fill = colorScheme[intervals.length%2];
	return svg;
}
goldClock.language = {
	EN: {
		ap: 'ap'.split('').map(s => '_'+s),
		day: 'Sun Mon Tues Wednes Thurs Fri Satur'.split(' ').map(s => s + 'day'),
		month: 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' '),
		moon: 'New +C 1st +G Full -G 3rd -C'.split(' '),
		season: 'Spring Summer Fall Winter'.split(' '),
		zodiac: 'Ari Tau Gem Can Leo Vir Lib Sco Sag Cap Aqu Pis'.split(' '),
	},
	JP: {
		ap: '前後'.split('').map(s => '午 '+s+' _'),
		day: '日 月 火 水 木 金 土'.split(' ').map(s => s + ' 曜 日'),
		month: '一\t二\t三\t四\t五\t六\t七\t八\t九\t十\t十 一\t十 二'.split('\t').map(s => s+' 月'),
		moon: '新 月\t三 日 月\t上 弦\t十 一 日 月\t満 月\t十 八 日 月\t下 弦\t二 十 六 日 月'.split('\t'),
		season: '春 夏 秋 冬'.split(' '),
		zodiac: '白 羊\n金 牛\n双 子\t巨 蟹\t獅 子\t処 女\t天 秤\t天 蝎\t人 馬\t磨 羯\t宝 瓶\t双 魚'.split('\t').map(s => s+' 宮'),
	},
	LA: {
		ap: 'ap'.split('').map(s => '_'+s),
		day: 'Sōlis Lūnae Mārtis Mercuriī Iovis Veneris Saturnī'.split(' ').map(s => 'Diēs '+s),
		month: 'Iān Feb Mār Apr Māi Iūn Iūl Aug Sep Oct Nov Dec'.split(' '),
		moon: 'Nova AC AD AIOI Plena DIOI DD DC'.split(' '),
		season: 'Vēr Aestās Autumnus Hiems'.split(' '),
		zodiac: 'Ari Tau Gem Can Leō Vir Lib Sco Sag Cap Aqu Pis'.split(' '),
	},
	PIE: {
		ap: 'h₂ p'.split(' ').map(s => '_'+s),
		//made up ones:        Ares   Hermes       Venus     Cronus
		day: 'sh₂wéns méh₁n̥sos h₂erés sermés diwés wénh₁osyo krónosyo'.split(' ').map(s => 'dyḗws '+s),
		// ordinals
		month: 'pr̥h₃ h₂én tri kʷet pen swe sep oḱt h₁ne deḱ h₁oy dwi'.split(' '),
		// waxing = ḱreh₁sḱónts; waning = deḱreh₁sḱónts; crescent = ḱr̥h₂nós; gibbous = geybʰós
		moon: 'néwos ḱḱ pr̥h₃wós gḱ pl̥h₁nós gd tritós ḱd'.split(' '), // mḗh₁n̥s is masculine
		season: 'wósr̥ sm̥h₂ós (s)h₁esós ǵʰéyōm'.split(' '),
		//       wr̥h₁ḗn táwros yémHoes karkros ?leóntos pr̥spténos ?ledʰreh₂ ?skorpéos ?lenk- kápros h₂ékʷeh₂ dʰǵʰúHes
		zodiac: 'wr̥h₁ táw yém kar leó pr̥s ledʰ sko len káp h₂ékʷ dʰǵʰú'.split(' '),
	},
};