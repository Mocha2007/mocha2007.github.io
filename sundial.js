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
 * @param {number} spacing (default: 3)
 * @returns {SVGTextElement} the last char
 */
function printCharArc(parent, s, color = 'black', y = 0, startAngle = 0, spacing = 3){
	// MAIN
	var charAngle = spacing / Math.abs(y);
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
	var colorScheme2 = ['#ccf', '#334', '#112'];
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
	// sources for below: https://en.wikipedia.org/wiki/Lunar_month#Cycle_lengths for year 2024
	var LUNAR_SYNODIC_PERIOD = 29.53058892148*_1d;
	var LUNAR_DRACONIC_PERIOD = 27.21222091436*_1d;
	var LUNAR_ANOMALISTIC_PERIOD = 27.55454964432*_1d;
	// var EY = LUNAR_SYNODIC_PERIOD * LUNAR_DRACONIC_PERIOD
	//	/ (LUNAR_SYNODIC_PERIOD - LUNAR_DRACONIC_PERIOD); // ~346.62d
	var YTROPICAL = 365.24219 * _1d;
	var moonPhase = (ACTUAL_TIME - EPOCH_MOON_NEW)/LUNAR_SYNODIC_PERIOD % 1;
	var intervals = [_1m, _1h, _1d, _1w, _1mo, _1y,
		YTROPICAL, YTROPICAL, LUNAR_SYNODIC_PERIOD,
		LUNAR_SYNODIC_PERIOD, LUNAR_DRACONIC_PERIOD, LUNAR_ANOMALISTIC_PERIOD]; // eclipse shit
	var divisions = [60, 60, 24, 7, _1mo/_1d, 12, 12, 4, 8, 30, 28, 28];
	var indices = [0, 0, 'H', 'D', 1, 'mo', 'Z', 'S', 'M', 'E1', 'E2', 'E3'];
	var colors = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1];
	var progress = [t/_1m%1, t/_1h%1, t/_1d%1, (+t+4*_1d)/_1w%1];
	progress.push((t.getUTCDate()-1+progress[2])*_1d/_1mo); // days in the present month
	progress.push((t.getUTCMonth()+progress[4])*_1mo/_1y); // months in the present year
	progress.push((ACTUAL_TIME - EPOCH_EQUINOX_VERNAL)/YTROPICAL%1); // season progress
	progress.push(progress[6]); // zodiac progress
	progress.push((moonPhase + 1/16)%1); // moon phase
	progress.push((moonPhase + 0.5/30)%1); // eclipse 1 (synodic)
	progress.push(((ACTUAL_TIME - EPOCH_MOON_DESCENDING_NODE)/LUNAR_DRACONIC_PERIOD + 0.5/28)%1); // eclipse 2 (draconic)
	progress.push(((ACTUAL_TIME - EPOCH_MOON_PERIGEE)/LUNAR_ANOMALISTIC_PERIOD + 0.5/28)%1); // eclipse 3 (anomalistic) (for determining totality)
	intervals.forEach((_, i, a) => {
		var chosenScheme = [colorScheme, colorScheme2][colors[i]];
		var back = chosenScheme[i%2];
		var fore = chosenScheme[(i+1)%2];
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
					s = j%15 ? '' : 'SL'[j/15];
					break;
				case 'E2':
					s = j%14 ? '' : '☋☊'[j/14];
					break;
				case 'E3':
					s = j%14 ? '' : 'qQ'[j/14];
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
	bar.style.fill = colorScheme2[2];
	// center disk
	var diskH = createSvgElement('circle');
	svg.appendChild(diskH);
	diskH.setAttribute('r', 0.5);
	diskH.style.fill = colorScheme2[intervals.length%2];
	// year
	var yearLabel = createSvgElement('text');
	svg.appendChild(yearLabel);
	var yearString = yearLabel.innerHTML = ''+t.getUTCFullYear();
	yearLabel.setAttribute('x', -0.055*yearString.length);
	yearLabel.setAttribute('y', 0.05);
	yearLabel.style.fill = colorScheme2[1-intervals.length%2];
	yearLabel.style.fontSize = '0.2px';
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

function deg2rad(deg = 0, amin = 0, asec = 0, neg = false){
	return Math.PI/180 * (deg + (amin + asec/60)/60) * (neg ? -1 : 1);
}

function ra2rad(h = 0, m = 0, s = 0){
	return Math.PI/12 * (h + (m + s/60)/60);
}

function mag2radius(mag = 0){
	var linearMag = Math.pow(100, -mag/5); // turn it from logarithmic to linear
	return Math.sqrt(linearMag); // if we let area = mag, then the radius is... sqrt(A/pi), but the pi is just a constant term anyways so I ignore it
}

function ursaMinor(t = new Date(), drawEdges = true){
	var sideralDay = 86164100;
	var starSize = 0.02;
	var lineSize = 0.001;
	var size = 1;
	var whiteDiskScale = 1.01;
	var LABEL_OFFSET_C = 0.01;
	var timeAngle = t/sideralDay%1*360 - ursaMinor.offset; // todo
	// svg
	var svg = createSvgElement('svg');
	svg.classList.add('sundial');
	svg.setAttribute('viewBox', [-size*whiteDiskScale, -size*whiteDiskScale,
		2*size*whiteDiskScale, 2*size*whiteDiskScale].join(' '));
	svg.setAttribute('width', 10*svgScale);
	svg.setAttribute('height', 10*svgScale);
	svg.setAttribute('aria-label', 'North Celestial Pole');
	svg.classList.add('pole');
	// style
	// css
	var style = document.createElement('style');
	style.innerHTML = '.pole text{font-size:0.04px;}';
	svg.appendChild(style);
	// background disks
	var whiteDisk = createSvgElement('circle');
	svg.appendChild(whiteDisk);
	whiteDisk.setAttribute('r', size*whiteDiskScale);
	whiteDisk.style.fill = 'white';
	var nightDisk = createSvgElement('circle');
	svg.appendChild(nightDisk);
	nightDisk.setAttribute('r', size);
	nightDisk.style.fill = 'black';
	// global rotation group
	var g = createSvgElement('g');
	svg.appendChild(g);
	// line group
	var lg = createSvgElement('g');
	g.appendChild(lg);
	// vertices
	const vertices = {};
	/** transform celestial coords to their ACTUAL position in the sky */
	function transform(ra, dec){
		// 			lambda phi
		// https://en.wikipedia.org/wiki/Orthographic_map_projection#Mathematics
		// RA is longitude, dec is latitude
		const lambda0 = timeAngle * Math.PI/180;
		const phi0 = Math.PI - ursaMinor.latitude * Math.PI/180; // I subtract from pi so north appears UP
		const coords = [
			// X, Y, cos(c) <- if cos(c) is < 0, the point should not be displayed since it is behind the viewport
			Math.cos(dec)*Math.sin(ra-lambda0),
			Math.cos(phi0)*Math.sin(dec) - Math.sin(phi0)*Math.cos(dec)*Math.cos(ra-lambda0),
			Math.sin(phi0)*Math.sin(dec)
				+ Math.cos(phi0)*Math.cos(dec)*Math.cos(ra-lambda0),
		];
		return coords;
	}
	ursaMinor.vertices.forEach((vertex, i) => {
		const [id, ra, dec, mag] = vertex;
		const [gx, gy, cosc] = vertices[id] = transform(ra, dec);
		if (cosc < 0)
			return;
		// elem
		var starDisk = createSvgElement('circle');
		g.appendChild(starDisk);
		starDisk.setAttribute('r', starSize * mag2radius(mag));
		starDisk.style.fill = 'white';
		starDisk.setAttribute('cx', gx);
		starDisk.setAttribute('cy', gy);
		starDisk.id = 'star_' + i;
	});
	// edges
	drawEdges && ursaMinor.edges.forEach(edge => {
		const [v1, v2] = edge;
		if (!(vertices[v1] && vertices[v2])){
			console.warn(`${v1}-${v2} link could not be drawn`);
			return;
		}
		const [x1, y1, cosc1] = vertices[v1];
		const [x2, y2, cosc2] = vertices[v2];
		if (cosc1 < 0 && cosc2 < 0)
			return;
		// elem
		var line = createSvgElement('line');
		lg.appendChild(line);
		line.style.stroke = 'cyan';
		line.style.strokeWidth = lineSize;
		line.setAttribute('x1', x1);
		line.setAttribute('y1', y1);
		line.setAttribute('x2', x2);
		line.setAttribute('y2', y2);
	});
	// labels
	ursaMinor.labels.forEach(datum => {
		const [ra, dec, s_] = datum;
		const s = s_.split('').reverse().join('');
		const [x, y, cosc] = transform(ra, dec);
		if (cosc < 0)
			return;
		// label
		var yearLabel = createSvgElement('text');
		lg.appendChild(yearLabel);
		yearLabel.innerHTML = s_;
		yearLabel.setAttribute('x', x - LABEL_OFFSET_C*s.length);
		yearLabel.setAttribute('y', y);
		yearLabel.style.fill = 'red';
	});
	// mask https://stackoverflow.com/a/61001784
	var diskMask = createSvgElement('clipPath');
	svg.appendChild(diskMask);
	diskMask.id = 'crop-disk';
	var maskRect = nightDisk.cloneNode();
	diskMask.appendChild(maskRect);
	g.setAttribute('clip-path', 'url(#crop-disk)');
	return svg;
}
ursaMinor.latitude = 31;
ursaMinor.offset = -164; // from my longitude!
ursaMinor.edges = [
	// UMi
	['alpha umi', 'delta umi'],
	['delta umi', 'epsilon umi'],
	['epsilon umi', 'zeta umi'],
	['zeta umi', 'eta umi'],
	['eta umi', 'gamma umi'],
	['gamma umi', 'beta umi'],
	['beta umi', 'zeta umi'],
	// Cep
	['alpha cep', 'beta cep'],
	['alpha cep', 'mu cep'],
	['alpha cep', 'eta cep'],
	['beta cep', 'gamma cep'],
	['beta cep', 'iota cep'],
	['gamma cep', 'iota cep'],
	['delta cep', 'iota cep'],
	['delta cep', 'zeta cep'],
	['epsilon cep', 'zeta cep'],
	['epsilon cep', 'mu cep'],
	['eta cep', 'theta cep'],
	// Cas
	['alpha cas', 'beta cas'],
	['alpha cas', 'gamma cas'],
	['gamma cas', 'delta cas'],
	['delta cas', 'epsilon cas'],
	['epsilon cas', '50 cas'],
	// Cam
	['alpha cam', 'gamma cam'],
	['alpha cam', 'beta cam'],
	['alpha cam', 'hd 49878'],
	['hd 42818', 'hd 49878'],
	['be cam', 'beta cam'],
	['be cam', 'gamma cam'],
	['be cam', 'cs cam'],
	['beta cam', '7 cam'],
	// Dra
	['beta dra', 'gamma dra'],
	['beta dra', 'nu dra'],
	['xi dra', 'gamma dra'],
	['xi dra', 'nu dra'],
	['delta dra', 'xi dra'],
	['delta dra', 'epsilon dra'],
	['delta dra', 'chi dra'],
	['tau dra', 'chi dra'],
	['zeta dra', 'chi dra'],
	['zeta dra', 'eta dra'],
	['theta dra', 'eta dra'],
	['theta dra', 'iota dra'],
	['alpha dra', 'iota dra'],
	['alpha dra', 'kappa dra'],
	['lambda dra', 'kappa dra'],
	// Ursa Major
	// big dipper
	['alpha uma', 'beta uma'],
	['alpha uma', 'delta uma'],
	['beta uma', 'gamma uma'],
	['gamma uma', 'delta uma'],
	['delta uma', 'epsilon uma'],
	['epsilon uma', 'zeta uma'],
	['zeta uma', 'eta uma'],
	// rear (per HAR)
	['alpha uma', 'h uma'],
	['h uma', 'omicron uma'],
	['h uma', 'upsilon uma'],
	['iota uma', 'omicron uma'],
	['theta uma', 'upsilon uma'],
	['theta uma', 'kappa uma'],
	['iota uma', 'kappa uma'],
	// head/paws (per HAR)
	['gamma uma', 'chi uma'],
	['eta uma', 'chi uma'],
	['psi uma', 'chi uma'],
	['mu uma', 'lambda uma'],
	['theta uma', 'lambda uma'],
	['kappa uma', 'lambda uma'],
	['xi uma', 'nu uma'],
	['psi uma', 'nu uma'],
	['mu uma', 'nu uma'],
	// Lynx
	['2 lyn', '15 lyn'],
	['15 lyn', '21 lyn'],
	['21 lyn', '31 lyn'],
	['31 lyn', '10 uma'],
	['10 uma', 'hd 77912'],
	['hd 77912', '38 lyn'],
	['38 lyn', 'alpha lyn'],
	// Canes Venatici
	['cor caroli', 'chara'],
	// Lacerta
	['alpha lac', 'beta lac'],
	['alpha lac', '5 lac'],
	['beta lac', '4 lac'],
	['1 lac', 'hd 211073'],
	['2 lac', '5 lac'],
	['2 lac', '6 lac'],
	['4 lac', '5 lac'],
	['5 lac', '11 lac'],
	['6 lac', '11 lac'],
	['6 lac', 'hd 211073'],
	// Triangulum
	['alpha tri', 'beta tri'],
	['alpha tri', 'gamma tri'],
	['beta tri', 'gamma tri'],
	// Antinous
	['eta aql', 'theta aql'],
	['eta aql', 'iota aql'],
	['theta aql', '69 aql'],
	['iota aql', 'nu aql'],
	['iota aql', 'kappa aql'],
	['kappa aql', 'lambda aql'],
	['kappa aql', '26 aql'],
	['lambda aql', '12 aql'],
	['51 aql', '57 aql'],
	['57 aql', '69 aql'],
	['69 aql', '70 aql'],
	['70 aql', '71 aql'],
];
ursaMinor.vertices = [
	// RA, DEC
	// URSA MINOR 0-6
	['alpha umi', ra2rad(3, 3, 48.9), deg2rad(89, 22, 4), 1.97], // Polaris
	['beta umi', ra2rad(14, 50, 37), deg2rad(74, 3, 12.1), 2.08], // Kochab
	['delta umi', ra2rad(17, 24, 17.9), deg2rad(86, 33, 59.5), 4.35], // Yildun
	['epsilon umi', ra2rad(16, 43, 28.4), deg2rad(81, 59, 29.9), 1.77], // Alioth
	['zeta umi', ra2rad(15, 43, 10.8), deg2rad(77, 42, 58), 2.04],
	['eta umi', ra2rad(16, 16, 45.7), deg2rad(75, 41, 46), 4.95],
	['gamma umi', ra2rad(15, 20, 39.7), deg2rad(71, 44, 41.8), 3.05], // Pherkad
	// CEPHEUS 7-23
	['alpha cep', ra2rad(21, 19, 6.4), deg2rad(62, 41, 24.4), 2.45],
	['beta cep', ra2rad(21, 28, 54.3), deg2rad(70, 40, 8.6), 3.23],
	['gamma cep', ra2rad(23, 40, 19), deg2rad(77, 46, 14.1), 3.21],
	['delta cep', ra2rad(22, 29, 10), deg2rad(58, 24), 4.07],
	['epsilon cep', ra2rad(22, 15, 2.1953), deg2rad(57, 2, 36.8771), 4.18],
	['zeta cep', ra2rad(22, 11, 39.5), deg2rad(58, 19, 22.8), 3.39],
	['eta cep', ra2rad(20, 45, 43.6), deg2rad(61, 56, 3.3), 3.41],
	['theta cep', ra2rad(20, 29, 34.86518), deg2rad(62, 59, 38.6216), 4.21],
	['iota cep', ra2rad(22, 50, 30.4), deg2rad(66, 19, 50.5), 3.5],
	['kappa cep', ra2rad(20, 8, 53.34492), deg2rad(77, 42, 41.0909), 4.28],
	['lambda cep', ra2rad(22, 11, 30.57571), deg2rad(59, 24, 52.15), 5.05],
	['mu cep', ra2rad(21, 43, 30.4609), deg2rad(58, 46, 48.166), 4.23],
	['nu cep', ra2rad(21, 32, 31.9), deg2rad(61, 36, 33.9), 4.25],
	['xi cep', ra2rad(22, 3, 47.455), deg2rad(64, 37, 40.71), 4.45],
	['omicron cep', ra2rad(23, 18, 37), deg2rad(68, 6), 4.75],
	['pi cep', ra2rad(23, 7, 53.854), deg2rad(75, 23, 15), 4.41],
	['rho cep', ra2rad(22, 27.5), deg2rad(78, 48), 5.45],
	// CASSIOPEA 24-28
	['alpha cas', ra2rad(0, 41, 52.47), deg2rad(56, 40, 22.2), 2.24], // shedir
	['beta cas', ra2rad(0, 10, 26.3), deg2rad(59, 17, 30), 2.25], // caph
	['gamma cas', ra2rad(0, 58, 10.11), deg2rad(60, 51, 2.2), 2.15], // navi
	['delta cas', ra2rad(1, 27, 23.64), deg2rad(60, 21, 56.4), 2.65], // ruchbah
	['epsilon cas', ra2rad(1, 56, 9.07), deg2rad(63, 47, 30), 3.35], // segin
	['50 cas', ra2rad(2, 5, 32.7), deg2rad(72, 32, 25.1), 3.95],
	// CAMELOPARDALIS 29-36
	['beta cam', ra2rad(5, 5, 35.33), deg2rad(60, 28, 35.8), 4.00],
	['cs cam', ra2rad(3, 31, 2.89), deg2rad(60, 1, 30.9), 4.21],
	['alpha cam', ra2rad(4, 56, 29.07), deg2rad(66, 22, 57.1), 4.26],
	['be cam', ra2rad(3, 51, 46.08), deg2rad(65, 36, 2.9), 4.39],
	['7 cam', ra2rad(4, 59, 14.37), deg2rad(53, 47, 24.7), 4.43],
	['ce cam', ra2rad(3, 31, 51.76), deg2rad(58, 57, 47.7), 4.55],
	['hd 49878', ra2rad(7, 3, 36.21), deg2rad(76, 56, 30.1), 4.55],
	['hd 42818', ra2rad(6, 21, 31.8), deg2rad(69, 18, 30.1), 4.75],
	['gamma cam', ra2rad(3, 52, 57.98), deg2rad(71, 24, 23.6), 4.59],
	['bk cam', ra2rad(3, 22, 8.9), deg2rad(65, 44, 29.1), 4.74],
	// DRACO 37-51
	['alpha dra', ra2rad(14, 5, 1.06), deg2rad(64, 15, 26.2), 3.65],
	['beta dra', ra2rad(17, 30, 56.15), deg2rad(52, 16, 58), 2.75],
	['gamma dra', ra2rad(17, 57, 7.4), deg2rad(51, 29, 8.6), 2.2],
	['delta dra', ra2rad(19, 12, 29.73), deg2rad(67, 42, 13.4), 3.05],
	['epsilon dra', ra2rad(19, 48, 0.88), deg2rad(70, 19, 46.4), 3.85],
	['zeta dra', ra2rad(17, 8, 48.55), deg2rad(65, 40, 59.2), 3.15],
	['eta dra', ra2rad(16, 24, 16.67), deg2rad(61, 27, 27), 2.7],
	['theta dra', ra2rad(16, 2, 17.89), deg2rad(58, 29, 51.6), 4],
	['iota dra', ra2rad(15, 25, 25.95), deg2rad(58, 52, 45.6), 3.25],
	['kappa dra', ra2rad(12, 33, 27.69), deg2rad(69, 39, 5.2), 3.85],
	['lambda dra', ra2rad(11, 32, 48.69), deg2rad(69, 11, 41.4), 3.8],
	['nu dra', ra2rad(17, 32, 36.3), deg2rad(55, 10, 1), 4.85],
	['xi dra', ra2rad(17, 53, 54), deg2rad(56, 52, 5.7), 3.7],
	['tau dra', ra2rad(19, 14, 59.98), deg2rad(73, 23, 59.4), 4.45],
	['chi dra', ra2rad(18, 20, 31.68), deg2rad(72, 44, 32.5), 3.55],
	// Ursa Major
	// big dipper
	['alpha uma', ra2rad(11, 5, 11.8), deg2rad(61, 37, 3.6), 1.95], // dubhe
	['beta uma', ra2rad(11, 3, 16.8), deg2rad(56, 15, 0.7), 2.34], // merak
	['gamma uma', ra2rad(11, 55, 4.8), deg2rad(53, 33, 28.6), 2.42], // phecda
	['delta uma', ra2rad(12, 16, 35.9), deg2rad(56, 53, 44.7), 3.33], // megrez
	['epsilon uma', ra2rad(12, 55, 4), deg2rad(55, 49, 34.5), 1.75], // alioth
	['zeta uma', ra2rad(13, 24, 52.3), deg2rad(54, 47, 48.6), 2.25], // mizar
	['eta uma', ra2rad(13, 48, 27.8), deg2rad(49, 11, 26.7), 1.8], // alkaid
	// rump (per HAR)
	['h uma', ra2rad(9, 33, 25), deg2rad(62, 57, 10.5), 3.72],
	['omicron uma', ra2rad(8, 32, 15.9), deg2rad(60, 38, 3.8), 3.5], // muscida
	['upsilon uma', ra2rad(9, 52, 41.5), deg2rad(58, 55, 19.6), 3.84],
	['iota uma', ra2rad(9, 0, 51.2), deg2rad(47, 56, 41.9), 3.19],
	['theta uma', ra2rad(9, 34, 27.7), deg2rad(51, 33, 53.3), 3.27],
	['kappa uma', ra2rad(9, 5, 15.9), deg2rad(47, 3, 31.9), 3.56],
	// head/paws (per HAR)
	['chi uma', ra2rad(11, 47, 18.2), deg2rad(47, 38, 36.1), 3.84],
	['psi uma', ra2rad(11, 11, 0.2), deg2rad(44, 21, 55.9), 3.16],
	['lambda uma', ra2rad(10, 18, 32.3), deg2rad(42, 47, 30.8), 3.45], // tania borealis
	['mu uma', ra2rad(10, 23, 45.2), deg2rad(41, 22, 34.9), 3.14], // tania australis
	['nu uma', ra2rad(11, 19, 45.9), deg2rad(32, 57, 41.8), 3.63], // alula borealis
	['xi uma', ra2rad(11, 19, 27.1), deg2rad(31, 23, 33.4), 3.79], // alula australis
	// Lynx
	['2 lyn', ra2rad(6, 21, 46), deg2rad(59, 0, 0.9), 4.44],
	['15 lyn', ra2rad(6, 59, 22.5), deg2rad(58, 23, 19.9), 4.5],
	['21 lyn', ra2rad(7, 28, 32.2), deg2rad(49, 9, 42.2), 4.59],
	['31 lyn', ra2rad(8, 24, 29), deg2rad(43, 6, 32.1), 4.34], // alsciaukat
	['10 uma', ra2rad(9, 2, 11.9), deg2rad(41, 41, 9.4), 4.03],
	['hd 77912', ra2rad(9, 8, 3.5), deg2rad(38, 21, 15.2), 4.72],
	['38 lyn', ra2rad(9, 20, 20.2), deg2rad(36, 41, 56.6), 3.83],
	['alpha lyn', ra2rad(9, 22, 31), deg2rad(34, 17, 21.6), 3.25],
	// Canes Venatici
	['cor caroli', ra2rad(12, 57, 7.9), deg2rad(38, 11, 12), 2.84],
	['chara', ra2rad(12, 34, 52), deg2rad(41, 13, 28.7), 4.34],
	// Lacerta
	['alpha lac', ra2rad(22, 32, 15.5), deg2rad(50, 24, 33), 3.78],
	['beta lac', ra2rad(22, 24, 28.9), deg2rad(52, 21, 9.4), 4.56],
	['1 lac', ra2rad(22, 16, 59.7), deg2rad(37, 52, 14.5), 4.28],
	['2 lac', ra2rad(22, 21, 59.7), deg2rad(46, 39, 37.5), 4.5],
	['4 lac', ra2rad(22, 25, 28), deg2rad(49, 36, 4.6), 4.59],
	['5 lac', ra2rad(22, 30, 30.6), deg2rad(47, 49, 58.4), 4.41],
	['6 lac', ra2rad(22, 31, 30.2), deg2rad(43, 14, 57.6), 4.47],
	['11 lac', ra2rad(22, 41, 32.9), deg2rad(44, 24, 16.5), 4.66],
	['hd 211073', ra2rad(22, 14, 53.2), deg2rad(39, 50, 11.6), 4.63],
	// Triangulum
	['alpha tri', ra2rad(1, 54, 27.5), deg2rad(29, 41, 50.6), 3.52], // mothallah
	['beta tri', ra2rad(2, 10, 58.9), deg2rad(35, 6, 9.5), 3.06],
	['gamma tri', ra2rad(2, 18, 45.1), deg2rad(33, 57, 35.7), 4],
	// Antinous
	['eta aql', ra2rad(19, 53, 39.9), deg2rad(1, 4, 0.8), 4.03],
	['theta aql', ra2rad(20, 12, 30.8), deg2rad(0, 45, 2.8, true), 3.22],
	['iota aql', ra2rad(19, 37, 56), deg2rad(1, 14, 1.7, true), 4.31],
	['kappa aql', ra2rad(19, 38, 9.1), deg2rad(6, 58, 29.1, true), 4.94],
	['lambda aql', ra2rad(19, 7, 29.4), deg2rad(4, 50, 49, true), 4.03],
	['nu aql', ra2rad(19, 27, 42.8), deg2rad(0, 23, 10), 4.75],
	['12 aql', ra2rad(19, 2, 55.8), deg2rad(5, 42, 20.7, true), 4.16],
	['26 aql', ra2rad(19, 21, 47.9), deg2rad(5, 22, 17.1, true), 4.75],
	['51 aql', ra2rad(19, 52, 4.2), deg2rad(10, 42, 12.8, true), 5.47],
	['57 aql', ra2rad(19, 55, 53.7), deg2rad(8, 9, 56.2, true), 5.66],
	['69 aql', ra2rad(20, 30, 52.6), deg2rad(2, 48, 23.2, true), 5.06],
	['70 aql', ra2rad(20, 37, 57), deg2rad(2, 28, 3.2, true), 5],
	['71 aql', ra2rad(20, 39, 33), deg2rad(1, 1, 18.8, true), 4.47],
];
ursaMinor.labels = [
	// sort from most northernly, then alphabetically
	[ra2rad(16), deg2rad(79), 'Ursa Minor'],
	[ra2rad(22.2), deg2rad(64), 'Cepheus'],
	[ra2rad(5.2), deg2rad(63), 'Camelopardalis'],
	[ra2rad(16), deg2rad(63), 'Draco'],
	[ra2rad(1.1), deg2rad(61), 'Cassiopeia'],
	[ra2rad(11.5), deg2rad(50), 'Ursa Major'],
	[ra2rad(8), deg2rad(46), 'Lynx'],
	[ra2rad(22.6), deg2rad(45), 'Lacerta'],
	[ra2rad(13), deg2rad(39.5), 'Canes Venatici'],
	[ra2rad(2), deg2rad(32), 'Triangulum'],
	[ra2rad(20), deg2rad(-4), 'Antinous'],
	// todo
	[ra2rad(4), deg2rad(43), 'Perseus'],
	[ra2rad(20.5), deg2rad(40), 'Cygnus'],
	[ra2rad(5.5), deg2rad(39), 'Auriga'],
	[ra2rad(1), deg2rad(36), 'Andromeda'],
	[ra2rad(10), deg2rad(36), 'Leo Minor'],
	[ra2rad(19), deg2rad(36), 'Lyra'],
	[ra2rad(17), deg2rad(34), 'Hercules'],
	[ra2rad(16), deg2rad(29), 'Corona Borealis'],
];
/* FINISHED:
	Antinous
	Camelopardalis, Canes Venatici, Cassiopeia, Cepheus, Draco
	Lacerta, Lynx, Triangulum, Ursa Major, Ursa Minor
*/