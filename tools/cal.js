/* eslint-disable max-len */
/* global getEaster, phoonsvg, sundial */

const _1d = 1000*60*60*24;

function mod(n, m){
	return (n%m+m)%m;
}

const time = {
	equinox: [
		(t = new Date()) => t.getMonth() === 2 && t.getDate() === 20, // vernal equinox
		(t = new Date()) => t.getMonth() === 5 && t.getDate() === 20 + (0 < t.getFullYear() % 4), // summer solstice
		(t = new Date()) => t.getMonth() === 8 && t.getDate() === 22 + (1 < t.getFullYear() % 4), // autumnal equinox
		(t = new Date()) => t.getMonth() === 11 && t.getDate() === 21 + (t.getFullYear() % 4 === 3), // winter solstice
	],
	equinoxNames: ['Vernal Equinox', 'Summer Solstice', 'Autumnal Equinox', 'Winter Solstice'],
	holidays: [
		['New Year\'s', (t = new Date()) => t.getMonth() === 0 && t.getDate() === 1],
		['MLK Jr. Day', (t = new Date()) => t.getMonth() === 0 && t.getDay() === 1 && 14 < t.getDate() && t.getDate() < 22],
		['Inauguration Day', (t = new Date()) => t.getMonth() === 0 && t.getDate() === (new Date(t.getYear(), 0, 20).getDay() ? 20 : 21)], // Jan 20 unless that's a sunday, then Jan 21
		['Groundhog Day', (t = new Date()) => t.getMonth() === 1 && t.getDate() === 2],
		['Super Bowl Sunday', (t = new Date()) => t.getMonth() === 1 && t.getDay() === 0 && 7 < t.getDate() && t.getDate() < 15],
		['Valentine\'s Day', (t = new Date()) => t.getMonth() === 1 && t.getDate() === 14],
		['Presidents\' Day', (t = new Date()) => t.getMonth() === 1 && t.getDay() === 1 && 14 < t.getDate() && t.getDate() < 22],
		['Ash Wednesday', (t = new Date()) => (e => e.getMonth() === t.getMonth() && e.getDate() === t.getDate())(new Date(getEaster(t.getFullYear()) - 45*_1d))],
		['St. Patrick\'s Day', (t = new Date()) => t.getMonth() === 2 && t.getDate() === 17],
		['TDoV', (t = new Date()) => t.getMonth() === 2 && t.getDate() === 31],
		['April Fool\'s Day', (t = new Date()) => t.getMonth() === 3 && t.getDate() === 1],
		['Cinco de Mayo', (t = new Date()) => t.getMonth() === 4 && t.getDate() === 5],
		['Mother\'s Day', (t = new Date()) => t.getMonth() === 4 && t.getDay() === 0 && 8 < t.getDate() && t.getDate() < 15],
		['Memorial Day', (t = new Date()) => t.getMonth() === 4 && t.getDay() === 1 && 24 < t.getDate()],
		['Good Friday', (t = new Date()) => (e => e.getMonth() === t.getMonth() && e.getDate() === t.getDate())(new Date(getEaster(t.getFullYear()) - 2*_1d))],
		['Easter', (t = new Date()) => (e => e.getMonth() === t.getMonth() && e.getDate() === t.getDate())(getEaster(t.getFullYear()))],
		['Father\'s Day', (t = new Date()) => t.getMonth() === 5 && t.getDay() === 0 && 14 < t.getDate() && t.getDate() < 22],
		['Juneteenth', (t = new Date()) => t.getMonth() === 5 && t.getDate() === 19],
		['Independence Day', (t = new Date()) => t.getMonth() === 6 && t.getDate() === 4],
		['Labor Day', (t = new Date()) => t.getMonth() === 8 && t.getDay() === 1 && t.getDate() < 8],
		['Oktoberfest', (t = new Date()) => t.getMonth() === 8 && t.getDay() === 6 && 14 < t.getDate() && t.getDate() < 22],
		['Columbus Day', (t = new Date()) => t.getMonth() === 9 && t.getDay() === 1 && 7 < t.getDate() && t.getDate() < 15],
		['Halloween', (t = new Date()) => t.getMonth() === 9 && t.getDate() === 31],
		['Election Day', (t = new Date()) => t.getMonth() === 10 && t.getDay() === 2 && 1 < t.getDate() && t.getDate() < 9],
		['Veterans\' Day', (t = new Date()) => t.getMonth() === 10 && t.getDate() === 11],
		['TDoR', (t = new Date()) => t.getMonth() === 10 && t.getDate() === 20],
		['Thanksgiving', (t = new Date()) => t.getMonth() === 10 && t.getDay() === 4 && 21 < t.getDate() && t.getDate() < 29],
		['Black Friday', (t = new Date()) => t.getMonth() === 10 && t.getDay() === 5 && 22 < t.getDate() && t.getDate() < 30],
		['Cyber Monday', (t = new Date()) => t.getDay() === 1 && (t.getMonth() === 10 && 25 < t.getDate() || t.getMonth() === 11 && t.getDate() === 1)],
		['Advent Sunday', (t = new Date()) => t.getDay() === 0 && (t.getMonth() === 10 && 26 < t.getDate() || t.getMonth() === 11 && t.getDate() < 4)],
		['Super Saturday', (t = new Date()) => t.getMonth() === 11 && t.getDay() === 6 && 16 < t.getDate() && t.getDate() < 24],
		['Christmas Eve', (t = new Date()) => t.getMonth() === 11 && t.getDate() === 24],
		['Christmas', (t = new Date()) => t.getMonth() === 11 && t.getDate() === 25],
		['New Year\'s Eve', (t = new Date()) => t.getMonth() === 11 && t.getDate() === 31],
		// misc
		['Friday the 13th', (t = new Date()) => t.getDay() === 5 && t.getDate() === 13],
		// bdays
		['Luna\'s Birthday', (t = new Date()) => t.getMonth() === 3 && t.getDate() === 27],
		['Luna\'s HRTiversary', (t = new Date()) => t.getMonth() === 7 && t.getDate() === 16],
		['Kippi\'s Birthday', (t = new Date()) => t.getMonth() === 10 && t.getDate() === 14],
	],
	moon: {
		epoch: new Date(2023, 11, 12, 18, 31),
		p: 29.530594 * _1d,
	},
	months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	seasons: ['Spring', 'Summer', 'Fall', 'Winter'],
	weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
	zodiac: [], // todo
};
time.equinox.forEach((d, i) => time.holidays.push([time.equinoxNames[i], d]));

function moon(t = new Date()){
	return phoonsvg(moon.phase(t));
}
moon.phase = (t = new Date()) => mod((time.moon.epoch - t)/time.moon.p, 1);

function getDatum(t = new Date()){
	// todo
	const starsign = 0;
	// done
	const date = t.getDate();
	let seasonDelta = 0;
	// eslint-disable-next-line no-loop-func
	while (!time.equinox.some(eq => eq(new Date(t - seasonDelta * _1d))))
		seasonDelta++;
	const season = time.equinox.findIndex(eq => eq(new Date(t - seasonDelta * _1d)));
	/** this date is in the nth week of the current month */
	let monthWeek = 0;
	const monthDay = t.getDay();
	for (let d = 1; d < t.getDate(); d++){
		const newDate = new Date(t.getFullYear(), t.getMonth(), d);
		const dotw = newDate.getDay();
		if (dotw === 6)
			monthWeek++;
	}
	return {date, monthWeek, monthDay, season, starsign};
}

function calendar(t = new Date()){
	// todo add weekday and month labels
	const table = document.createElement('table');
	table.id = 'cals';
	table.innerHTML = '';
	// construct table first...
	const cells = {};
	for (let se = 0; se < 4; se++){ // season (row)
		const season = document.createElement('tr');
		season.id = 'season_' + se;
		table.appendChild(season);
		for (let m_ = 0; m_ < 3; m_++){ // months (cell)
			const mo = 3*se + m_;
			const month = document.createElement('td');
			month.id = 'month_' + mo;
			season.appendChild(month);
			// month header
			const monthHeader = document.createElement('h3');
			monthHeader.innerHTML = time.months[mo];
			month.appendChild(monthHeader);
			// month table
			const monthTable = document.createElement('table');
			month.appendChild(monthTable);
			// weekday headers
			const weekdayTr = document.createElement('tr');
			monthTable.appendChild(weekdayTr);
			time.weekdays.forEach(weekday => {
				const th = document.createElement('th');
				th.innerHTML = weekday;
				weekdayTr.appendChild(th);
			});
			for (let wk = 0; wk < 6; wk++){ // weeks (row)
				const week = document.createElement('tr');
				week.id = month.id + 'week_' + wk;
				monthTable.appendChild(week);
				for (let d = 0; d < 7; d++){ // days (cell)
					const day = document.createElement('td');
					cells[day.id = week.id + 'day_' + d] = day;
					week.appendChild(day);
				}
			}
		}
	}
	const year = t.getFullYear();
	const LEAP = year % 400 === 0 || year % 4 === 0 && year % 100 !== 0;
	const YEAR_LENGTH_IN_DAYS = 365 + LEAP;
	for (let d = 0; d < YEAR_LENGTH_IN_DAYS; d++){
		const dateObj = new Date(year, 0, d + 1);
		const datum = getDatum(dateObj);
		const cellID = `month_${dateObj.getMonth()}week_${datum.monthWeek}day_${datum.monthDay}`; // todo
		const td = cells[cellID]; // todo
		// container
		const tdContainer = document.createElement('div');
		tdContainer.classList.add('tdContainer');
		td.appendChild(tdContainer);
		// date
		const date = document.createElement('div');
		date.classList.add('date');
		const season_id = datum.season;
		date.innerHTML = datum.date;
		tdContainer.appendChild(date);
		// season
		td.classList.add(`season_${season_id}`);
		const season = document.createElement('div');
		season.classList.add('season');
		const seasonName = time.seasons[season_id];
		season.innerHTML = seasonName;
		tdContainer.appendChild(season);
		// zodiac
		const zodiacElem = document.createElement('div');
		zodiacElem.classList.add('zodiac');
		// todo
		// zodiacElem.innerHTML = time.zodiac[datum.starsign].slice(0, 3) + '.';
		// zodiacElem.title = `Starsign: ${time.zodiac[datum.starsign]}`;
		tdContainer.appendChild(zodiacElem);
		// holidays
		const holiday = time.holidays.filter(xyz => xyz[1](dateObj));
		if (holiday.length){
			const holidayElem = document.createElement('div');
			holidayElem.classList.add('holiday');
			holidayElem.innerHTML = holiday.map(x => x[0]).join('\n');
			tdContainer.appendChild(holidayElem);
		}
		// phoon
		const phoon = document.createElement('div');
		phoon.classList.add('phoon');
		phoon.appendChild(moon(dateObj));
		tdContainer.appendChild(phoon);
	}
	return table;
}

function main(t = new Date()){
	document.getElementById('months').appendChild(calendar(t));
	document.getElementById('erecal1_title').innerHTML = t.getFullYear();
	refresh();
	refreshSundial();
	setInterval(refresh, 200); // if you set to 1s, it's not exactly 1000ms so sometimes the clock could "miss" a second - the same issue happens with 200ms, but with time so short you can't actually perceive it
	const sundialSize = document.getElementsByClassName('sundial')[0].getBoundingClientRect().width;
	const sundialPixelAngle = Math.atan2(1, sundialSize);
	const sundialInterval = _1d*sundialPixelAngle/Math.PI;
	console.info(`Sundial update interval: ${sundialInterval} ms`);
	setInterval(refreshSundial, sundialInterval); // updates in the time it takes for pixels to shift over 1 unit
	console.info('erecal.js successfully loaded.');
}

function refresh(t = new Date()){
	document.getElementById('earthclock').innerHTML = t;
}

function refreshSundial(t = new Date()){
	const sundialContainer = document.getElementById('sundial');
	sundialContainer.innerHTML = '';
	const dayFraction = (t / _1d - (6 + new Date().getTimezoneOffset()/60)/24) % 1; // offset so 0 = sunrise
	const sunMoon = [dayFraction, moon.phase(t), true];
	sundialContainer.appendChild(sundial(...sunMoon));
}

main();