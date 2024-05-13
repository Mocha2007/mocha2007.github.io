/* exported POLITICIANS */
/* global Gender, Party, Position */

const POLITICIANS = [
	{
		name: 'Donald Trump',
		dob: new Date(1946, 5, 14),
		gender: Gender.MALE,
		party: Party.REPUBLICAN,
		position: Position.NONE,
	},
	{
		name: 'Joe Biden', // president
		dob: new Date(1942, 10, 20),
		gender: Gender.MALE,
		party: Party.DEMOCRATIC,
		position: Position.PRESIDENT,
	},
	{
		name: 'Kamala Harris', // vice president
		dob: new Date(1964, 9, 20),
		gender: Gender.FEMALE,
		party: Party.DEMOCRATIC,
		position: Position.VICE_PRESIDENT,
	},
	// Trump VP picks
	{
		name: 'Tim Scott', // senator
		dob: new Date(1965, 8, 19),
		gender: Gender.MALE,
		party: Party.REPUBLICAN,
		position: Position.SENATOR,
	},
	{
		name: 'Kristi Noem', // governor
		dob: new Date(1971, 10, 30),
		gender: Gender.FEMALE,
		party: Party.REPUBLICAN,
		position: Position.GOVERNOR,
	},
	{
		name: 'James Vance', // senator
		dob: new Date(1984, 7, 2),
		gender: Gender.MALE,
		party: Party.REPUBLICAN,
		position: Position.SENATOR,
	},
	{
		name: 'Ben Carson',
		dob: new Date(1951, 8, 18),
		gender: Gender.MALE,
		party: Party.REPUBLICAN,
		position: Position.NONE,
	},
	{
		name: 'Vivek Ramaswamy',
		dob: new Date(1985, 7, 9),
		gender: Gender.MALE,
		party: Party.REPUBLICAN,
		position: Position.NONE,
	},
	{
		name: 'Doug Burgum', // governor
		dob: new Date(1956, 8, 1),
		gender: Gender.MALE,
		party: Party.REPUBLICAN,
		position: Position.GOVERNOR,
	},
	{
		name: 'Tucker Carlson',
		dob: new Date(1969, 5, 16),
		gender: Gender.MALE,
		party: Party.REPUBLICAN,
		position: Position.NONE,
	},
	// republican reps
	{
		name: 'Byron Donalds',
		dob: new Date(1978, 9, 28),
		gender: Gender.MALE,
		party: Party.REPUBLICAN,
		position: Position.REPRESENTATIVE,
	},
	{
		name: 'Mike Johnson',
		dob: new Date(1972, 0, 30),
		gender: Gender.MALE,
		party: Party.REPUBLICAN,
		position: Position.REPRESENTATIVE,
	},
	{
		name: 'Kevin McCarthy',
		dob: new Date(1965, 1, 26),
		gender: Gender.MALE,
		party: Party.REPUBLICAN,
		position: Position.REPRESENTATIVE,
	},
	{
		name: 'Patrick McHenry',
		dob: new Date(1975, 10, 22),
		gender: Gender.MALE,
		party: Party.REPUBLICAN,
		position: Position.REPRESENTATIVE,
	},
	{
		name: 'Steve Scalise',
		dob: new Date(1965, 9, 6),
		gender: Gender.MALE,
		party: Party.REPUBLICAN,
		position: Position.REPRESENTATIVE,
	},
	{
		name: 'Elise Stefanik',
		dob: new Date(1984, 6, 2),
		gender: Gender.FEMALE,
		party: Party.REPUBLICAN,
		position: Position.REPRESENTATIVE,
	},
	// backup pols
	{
		name: 'Amy Klobuchar', // senator
		dob: new Date(1960, 4, 25),
		gender: Gender.FEMALE,
		party: Party.DEMOCRATIC,
		position: Position.SENATOR,
	},
];