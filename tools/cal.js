/* eslint-disable max-len */
/* global phoonsvg, sundial */

const _1d = 1000*60*60*24;

function mod(n, m){
	return (n%m+m)%m;
}

const time = {
	holidays: [],
	moon: {
		epoch: new Date(2023, 11, 12, 18, 31),
		p: 29.530594 * _1d,
	},
	months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	seasons: ['Winter', 'Spring', 'Summer', 'Fall'],
	weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
	zodiac: [], // todo
};

function moon(t = new Date()){
	return phoonsvg(moon.phase(t));
}
moon.phase = (t = new Date()) => mod((time.moon.epoch - t)/time.moon.p, 1);

function getDatum(t = new Date()){
	// todo
	const season = 0;
	const starsign = 0;
	// done
	const date = t.getDate();
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
		const holiday = time.holidays.find(xyz => xyz[1](datum));
		if (holiday){
			const holidayElem = document.createElement('div');
			holidayElem.classList.add('holiday');
			holidayElem.innerHTML = holiday[0];
			tdContainer.appendChild(holidayElem);
		}
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
	const dayFraction = (t / _1d - 0.25) % 1; // offset by 6h so 0 = sunrise
	const sunMoon = [dayFraction, moon.phase(t), true];
	sundialContainer.appendChild(sundial(...sunMoon));
}

main();