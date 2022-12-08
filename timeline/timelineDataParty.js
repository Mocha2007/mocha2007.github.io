/* exported timelineTest */

const colors = {
	d: '#33F', // Democratic; also Jacksonians
	dr: '#008000', // Democratic-Republican; also Anti-Administration
	f: '#EA9978', // Federalist; also Pro-Administration
	nu: '#B22222', // National Union
	r: '#E81B23',
	whig: '#F0C862', // also National Republican & Anti-Jacksonians
};

const timelineTest = [
	// Party Systems
	{
		name: 'First Party System',
		start: '1792',
		end: '1816',
		href: true,
		forceY: 1,
	},
	{
		name: 'Second Party System',
		start: '1828',
		end: '1854',
		href: true,
		forceY: 1,
	},
	{
		name: 'Third Party System',
		start: '1854',
		end: '1894',
		href: true,
		forceY: 1,
	},
	{
		name: 'Fourth Party System',
		start: '1894',
		end: '1932',
		href: true,
		forceY: 1,
	},
	{
		name: 'Fifth Party System',
		start: '1932',
		end: '1980',
		href: true,
		forceY: 1,
	},
	{
		name: 'Sixth Party System',
		start: '1980',
		end: '2016',
		href: true,
		forceY: 1,
	},
	{
		name: 'Seventh Party System',
		start: '2016',
		end: '2025',
		href: true,
		forceY: 1,
	},
	// presidents
	{
		name: 'George Washington',
		start: '30 Apr 1789',
		end: '4 Mar 1797',
		href: true,
		forceY: 3,
	},
	{
		name: 'John Adams',
		start: '4 Mar 1797',
		end: '4 Mar 1801',
		color: colors.f,
		href: true,
		forceY: 3,
	},
	{
		name: 'Thomas Jefferson',
		start: '4 Mar 1801',
		end: '4 Mar 1809',
		color: colors.dr,
		href: true,
		forceY: 3,
	},
	{
		name: 'James Madison',
		start: '4 Mar 1809',
		end: '4 Mar 1817',
		color: colors.dr,
		href: true,
		forceY: 3,
	},
	{
		name: 'James Monroe',
		start: '4 Mar 1817',
		end: '4 Mar 1825',
		color: colors.dr,
		href: true,
		forceY: 3,
	},
	{
		name: 'John Quincy Adams',
		start: '4 Mar 1825',
		end: '4 Mar 1829',
		color: colors.dr,
		href: true,
		forceY: 3,
		insets: [
			{
				start: '1828',
				end: '4 Mar 1829',
				color: colors.whig,
			},
		],
	},
	{
		name: 'Andrew Jackson',
		start: '4 Mar 1829',
		end: '4 Mar 1837',
		color: colors.d,
		href: true,
		forceY: 3,
	},
	{
		name: 'Martin Van Buren',
		start: '4 Mar 1837',
		end: '4 Mar 1841',
		color: colors.d,
		href: true,
		forceY: 3,
	},
	{
		name: 'William Henry Harrison',
		start: '4 Mar 1841',
		end: '4 Apr 1841',
		color: colors.whig,
		href: true,
		forceY: 3,
	},
	{
		name: 'John Tyler',
		start: '4 Apr 1841',
		end: '4 Mar 1845',
		href: true,
		forceY: 3,
	},
	{
		name: 'James K. Polk',
		start: '4 Mar 1845',
		end: '4 Mar 1849',
		color: colors.d,
		href: true,
		forceY: 3,
	},
	{
		name: 'Zachary Taylor',
		start: '4 Mar 1849',
		end: '9 Jul 1850',
		color: colors.whig,
		href: true,
		forceY: 3,
	},
	{
		name: 'Millard Fillmore',
		start: '9 Jul 1850',
		end: '4 Mar 1853',
		color: colors.whig,
		href: true,
		forceY: 3,
	},
	{
		name: 'Franklin Pierce',
		start: '4 Mar 1853',
		end: '4 Mar 1857',
		color: colors.d,
		href: true,
		forceY: 3,
	},
	{
		name: 'James Buchanan',
		start: '4 Mar 1857',
		end: '4 Mar 1861',
		color: colors.d,
		href: true,
		forceY: 3,
	},
	{
		name: 'Abraham Lincoln',
		start: '4 Mar 1861',
		end: '15 Apr 1865',
		color: colors.r,
		href: true,
		forceY: 3,
		insets: [
			{
				start: '1864',
				end: '15 Apr 1865',
				color: colors.nu,
			},
		],
	},
	{
		name: 'Andrew Johnson',
		start: '15 Apr 1865',
		end: '4 Mar 1869',
		color: colors.nu,
		href: true,
		forceY: 3,
		insets: [
			{
				start: '1868',
				end: '4 Mar 1869',
				color: colors.d,
			},
		],
	},
	{
		name: 'Ulysses S. Grant',
		start: '4 Mar 1869',
		end: '4 Mar 1877',
		color: colors.r,
		href: true,
		forceY: 3,
	},
	{
		name: 'Rutherford B. Hayes',
		start: '4 Mar 1877',
		end: '4 Mar 1881',
		color: colors.r,
		href: true,
		forceY: 3,
	},
	{
		name: 'James A. Garfield',
		start: '4 Mar 1881',
		end: '19 Sep 1881',
		color: colors.r,
		href: true,
		forceY: 3,
	},
	{
		name: 'Chester A. Arthur',
		start: '19 Sep 1881',
		end: '4 Mar 1885',
		color: colors.r,
		href: true,
		forceY: 3,
	},
	{
		name: 'Grover Cleveland',
		start: '4 Mar 1885',
		end: '4 Mar 1889',
		color: colors.d,
		href: true,
		forceY: 3,
	},
	{
		name: 'Benjamin Harrison',
		start: '4 Mar 1889',
		end: '4 Mar 1893',
		color: colors.r,
		href: true,
		forceY: 3,
	},
	{
		name: 'Grover Cleveland',
		start: '4 Mar 1893',
		end: '4 Mar 1897',
		color: colors.d,
		href: true,
		forceY: 3,
	},
	{
		name: 'Wiliam McKinley',
		start: '4 Mar 1897',
		end: '14 Sep 1901',
		color: colors.r,
		href: true,
		forceY: 3,
	},
	{
		name: 'Theodore Roosevelt',
		start: '14 Sep 1901',
		end: '4 Mar 1909',
		color: colors.r,
		href: true,
		forceY: 3,
	},
	{
		name: 'William Howard Taft',
		start: '4 Mar 1909',
		end: '4 Mar 1913',
		color: colors.r,
		href: true,
		forceY: 3,
	},
	{
		name: 'Woodrow Wilson',
		start: '4 Mar 1913',
		end: '4 Mar 1921',
		color: colors.d,
		href: true,
		forceY: 3,
	},
	{
		name: 'Warren G. Harding',
		start: '4 Mar 1921',
		end: '2 Aug 1923',
		color: colors.r,
		href: true,
		forceY: 3,
	},
	{
		name: 'Calvin Coolidge',
		start: '2 Aug 1923',
		end: '4 Mar 1929',
		color: colors.r,
		href: true,
		forceY: 3,
	},
	{
		name: 'Herbert Hoover',
		start: '4 Mar 1929',
		end: '4 Mar 1933',
		color: colors.r,
		href: true,
		forceY: 3,
	},
	{
		name: 'Franklin D. Roosevelt',
		start: '4 Mar 1933',
		end: '12 Apr 1945',
		color: colors.d,
		href: true,
		forceY: 3,
	},
	{
		name: 'Harry S. Truman',
		start: '12 Apr 1945',
		end: '20 Jan 1953',
		color: colors.d,
		href: true,
		forceY: 3,
	},
	{
		name: 'Dwight D. Eisenhower',
		start: '20 Jan 1953',
		end: '20 Jan 1961',
		color: colors.r,
		href: true,
		forceY: 3,
	},
	{
		name: 'John F. Kennedy',
		start: '20 Jan 1961',
		end: '22 Nov 1963',
		color: colors.d,
		href: true,
		forceY: 3,
	},
	{
		name: 'Lyndon B. Johnson',
		start: '22 Nov 1963',
		end: '20 Jan 1969',
		color: colors.d,
		href: true,
		forceY: 3,
	},
	{
		name: 'Richard Nixon',
		start: '20 Jan 1969',
		end: '9 Aug 1974',
		color: colors.r,
		href: true,
		forceY: 3,
	},
	{
		name: 'Gerald Ford',
		start: '9 Aug 1974',
		end: '20 Jan 1977',
		color: colors.r,
		href: true,
		forceY: 3,
	},
	{
		name: 'Jimmy Carter',
		start: '20 Jan 1977',
		end: '20 Jan 1981',
		color: colors.d,
		href: true,
		forceY: 3,
	},
	{
		name: 'Ronald Reagan',
		start: '20 Jan 1981',
		end: '20 Jan 1989',
		color: colors.r,
		href: true,
		forceY: 3,
	},
	{
		name: 'George H. W. Bush',
		start: '20 Jan 1989',
		end: '20 Jan 1993',
		color: colors.r,
		href: true,
		forceY: 3,
	},
	{
		name: 'Bill Clinton',
		start: '20 Jan 1993',
		end: '20 Jan 2001',
		color: colors.d,
		href: true,
		forceY: 3,
	},
	{
		name: 'George W. Bush',
		start: '20 Jan 2001',
		end: '20 Jan 2009',
		color: colors.r,
		href: true,
		forceY: 3,
	},
	{
		name: 'Barack Obama',
		start: '20 Jan 2009',
		end: '20 Jan 2017',
		color: colors.d,
		href: true,
		forceY: 3,
	},
	{
		name: 'Donald Trump',
		start: '20 Jan 2017',
		end: '20 Jan 2021',
		color: colors.r,
		href: true,
		forceY: 3,
	},
	{
		name: 'Joe Biden',
		start: '20 Jan 2021',
		end: '20 Jan 2025',
		color: colors.d,
		href: true,
		forceY: 3,
	},
	// US Congress (overall picture)
	{
		name: 'United States Congress',
		start: '4 Mar 1789',
		end: '2025', // todo
		href: true,
		forceY: 5,
		insets: [
			{
				start: '4 Mar 1789',
				end: '4 Mar 1793',
				color: colors.f,
			},
			{
				start: '4 Mar 1797',
				end: '4 Mar 1801',
				color: colors.f,
			},
			{
				start: '4 Mar 1801',
				end: '4 Mar 1825',
				color: colors.dr,
			},
			{
				start: '4 Mar 1827',
				end: '4 Mar 1833',
				color: colors.d,
			},
			{
				start: '4 Mar 1835',
				end: '4 Mar 1841',
				color: colors.d,
			},
			{
				start: '4 Mar 1841',
				end: '4 Mar 1843',
				color: colors.whig,
			},
			{
				start: '4 Mar 1845',
				end: '4 Mar 1847',
				color: colors.d,
			},
			{
				start: '4 Mar 1849',
				end: '4 Mar 1859',
				color: colors.d,
			},
			{
				start: '4 Mar 1861',
				end: '4 Mar 1875',
				color: colors.r,
			},
			{
				start: '4 Mar 1879',
				end: '18 Mar 1881',
				color: colors.d,
			},
			{
				start: '18 Mar 1881',
				end: '16 May 1881',
				color: colors.r,
			},
			{
				start: '2 Aug 1881',
				end: '4 Mar 1883',
				color: colors.r,
			},
			{
				start: '4 Mar 1889',
				end: '4 Mar 1891',
				color: colors.r,
			},
			{
				start: '4 Mar 1893',
				end: '4 Mar 1895',
				color: colors.d,
			},
			{
				start: '4 Mar 1895',
				end: '4 Mar 1911',
				color: colors.r,
			},
			{
				start: '4 Mar 1913',
				end: '4 Mar 1919',
				color: colors.d,
			},
			{
				start: '4 Mar 1919',
				end: '4 Mar 1931',
				color: colors.r,
			},
			{
				start: '4 Mar 1933',
				end: '3 Jan 1947',
				color: colors.d,
			},
			{
				start: '3 Jan 1947',
				end: '3 Jan 1949',
				color: colors.r,
			},
			{
				start: '3 Jan 1949',
				end: '3 Jan 1953',
				color: colors.d,
			},
			{
				start: '3 Jan 1953',
				end: '3 Jan 1955',
				color: colors.r,
			},
			{
				start: '3 Jan 1955',
				end: '3 Jan 1981',
				color: colors.d,
			},
			{
				start: '3 Jan 1987',
				end: '3 Jan 1995',
				color: colors.d,
			},
			{
				start: '3 Jan 1995',
				end: '3 Jan 2001',
				color: colors.r,
			},
			{
				start: '20 Jan 2001',
				end: '6 Jun 2001',
				color: colors.r,
			},
			{
				start: '23 Nov 2002',
				end: '3 Jan 2007',
				color: colors.r,
			},
			{
				start: '3 Jan 2007',
				end: '3 Jan 2011',
				color: colors.d,
			},
			{
				start: '3 Jan 2015',
				end: '3 Jan 2019',
				color: colors.r,
			},
			{
				start: '3 Jan 2021',
				end: '3 Jan 2023',
				color: colors.d,
			},
		],
	},
	// US Senate
	{
		name: 'United States Senate',
		start: '4 Mar 1789',
		end: '2025', // todo
		href: true,
		forceY: 6,
		insets: [
			{
				start: '4 Mar 1789',
				end: '4 Mar 1801',
				color: colors.f,
			},
			{
				start: '4 Mar 1801',
				end: '4 Mar 1825',
				color: colors.dr,
			},
			{
				start: '4 Mar 1825',
				end: '4 Mar 1833',
				color: colors.d,
			},
			{
				start: '4 Mar 1833',
				end: '4 Mar 1835',
				color: colors.whig,
			},
			{
				start: '4 Mar 1835',
				end: '4 Mar 1841',
				color: colors.d,
			},
			{
				start: '4 Mar 1841',
				end: '4 Mar 1845',
				color: colors.whig,
			},
			{
				start: '4 Mar 1845',
				end: '4 Feb 1861',
				color: colors.d,
			},
			{
				start: '4 Feb 1861',
				end: '4 Mar 1879',
				color: colors.r,
			},
			{
				start: '4 Mar 1879',
				end: '18 Mar 1881',
				color: colors.d,
			},
			{
				start: '18 Mar 1881',
				end: '16 May 1881',
				color: colors.r,
			},
			{
				start: '16 May 1881',
				end: '2 Aug 1881',
				color: colors.d,
			},
			{
				start: '2 Aug 1881',
				end: '4 Mar 1893',
				color: colors.r,
			},
			{
				start: '4 Mar 1893',
				end: '4 Mar 1895',
				color: colors.d,
			},
			{
				start: '4 Mar 1895',
				end: '4 Mar 1913',
				color: colors.r,
			},
			{
				start: '4 Mar 1913',
				end: '4 Mar 1919',
				color: colors.d,
			},
			{
				start: '4 Mar 1919',
				end: '4 Mar 1933',
				color: colors.r,
			},
			{
				start: '4 Mar 1933',
				end: '3 Jan 1947',
				color: colors.d,
			},
			{
				start: '3 Jan 1947',
				end: '3 Jan 1949',
				color: colors.r,
			},
			{
				start: '3 Jan 1949',
				end: '3 Jan 1953',
				color: colors.d,
			},
			{
				start: '3 Jan 1953',
				end: '3 Jan 1955',
				color: colors.r,
			},
			{
				start: '3 Jan 1955',
				end: '3 Jan 1981',
				color: colors.d,
			},
			{
				start: '3 Jan 1981',
				end: '3 Jan 1987',
				color: colors.r,
			},
			{
				start: '3 Jan 1987',
				end: '3 Jan 1995',
				color: colors.d,
			},
			{
				start: '3 Jan 1995',
				end: '3 Jan 2001',
				color: colors.r,
			},
			{
				start: '3 Jan 2001',
				end: '20 Jan 2001',
				color: colors.d,
			},
			{
				start: '20 Jan 2001',
				end: '6 Jun 2001',
				color: colors.r,
			},
			{
				start: '6 Jun 2001',
				end: '23 Nov 2002',
				color: colors.d,
			},
			{
				start: '23 Nov 2002',
				end: '3 Jan 2007',
				color: colors.r,
			},
			{
				start: '3 Jan 2007',
				end: '3 Jan 2015',
				color: colors.d,
			},
			{
				start: '3 Jan 2015',
				end: '3 Jan 2021',
				color: colors.r,
			},
			{
				start: '20 Jan 2021',
				end: '3 Jan 2025',
				color: colors.d,
			},
		],
	},
	// US House
	{
		name: 'United States House of Representatives',
		start: '4 Mar 1789',
		end: '2025', // todo
		href: true,
		forceY: 7,
		insets: [
			{
				start: '4 Mar 1789',
				end: '4 Mar 1793',
				color: colors.f,
			},
			{
				start: '4 Mar 1793',
				end: '4 Mar 1797',
				color: colors.dr,
			},
			{
				start: '4 Mar 1797',
				end: '4 Mar 1801',
				color: colors.f,
			},
			{
				start: '4 Mar 1801',
				end: '4 Mar 1825',
				color: colors.dr,
			},
			{
				start: '4 Mar 1825',
				end: '4 Mar 1827',
				color: colors.whig,
			},
			{
				start: '4 Mar 1827',
				end: '4 Mar 1841',
				color: colors.d,
			},
			{
				start: '4 Mar 1841',
				end: '4 Mar 1843',
				color: colors.whig,
			},
			{
				start: '4 Mar 1843',
				end: '4 Mar 1847',
				color: colors.d,
			},
			{
				start: '4 Mar 1847',
				end: '4 Mar 1849',
				color: colors.whig,
			},
			{
				start: '4 Mar 1849',
				end: '4 Mar 1859',
				color: colors.d,
			},
			{
				start: '4 Mar 1859',
				end: '4 Mar 1875',
				color: colors.r,
			},
			{
				start: '4 Mar 1875',
				end: '4 Mar 1881',
				color: colors.d,
			},
			{
				start: '4 Mar 1881',
				end: '4 Mar 1883',
				color: colors.r,
			},
			{
				start: '4 Mar 1883',
				end: '4 Mar 1889',
				color: colors.d,
			},
			{
				start: '4 Mar 1889',
				end: '4 Mar 1891',
				color: colors.r,
			},
			{
				start: '4 Mar 1891',
				end: '4 Mar 1895',
				color: colors.d,
			},
			{
				start: '4 Mar 1895',
				end: '4 Mar 1911',
				color: colors.r,
			},
			{
				start: '4 Mar 1911',
				end: '4 Mar 1919',
				color: colors.d,
			},
			{
				start: '4 Mar 1919',
				end: '22 Oct 1931',
				color: colors.r,
			},
			{
				start: '22 Oct 1931',
				end: '3 Jan 1947',
				color: colors.d,
			},
			{
				start: '3 Jan 1947',
				end: '3 Jan 1949',
				color: colors.r,
			},
			{
				start: '3 Jan 1949',
				end: '3 Jan 1953',
				color: colors.d,
			},
			{
				start: '3 Jan 1953',
				end: '3 Jan 1955',
				color: colors.r,
			},
			{
				start: '3 Jan 1955',
				end: '3 Jan 1995',
				color: colors.d,
			},
			{
				start: '3 Jan 1995',
				end: '3 Jan 2007',
				color: colors.r,
			},
			{
				start: '3 Jan 2007',
				end: '3 Jan 2011',
				color: colors.d,
			},
			{
				start: '3 Jan 2011',
				end: '3 Jan 2019',
				color: colors.r,
			},
			{
				start: '3 Jan 2019',
				end: '3 Jan 2023',
				color: colors.d,
			},
			{
				start: '3 Jan 2023',
				end: '3 Jan 2025',
				color: colors.r,
			},
		],
	},
	// US Supreme Court - partisanship determined by appointer
	{
		name: 'United States Supreme Court',
		start: '19 Oct 1789',
		end: '2023',
		href: true,
		forceY: 9,
		insets: [
			{
				start: '19 Oct 1789',
				end: '13 Sep 1810',
				color: colors.f,
			},
			{
				start: '19 Jun 1811',
				end: '4 Aug 1834',
				color: colors.dr,
			},
			{
				start: '28 Mar 1836',
				end: '20 May 1863',
				color: colors.d,
			},
			{
				start: '30 May 1865',
				end: '9 Jul 1938',
				color: colors.r,
			},
			{
				start: '17 Apr 1939',
				end: '14 Oct 1958',
				color: colors.d,
			},
			{
				start: '14 Oct 1958',
				end: '16 Apr 1962',
				color: colors.r,
			},
			{
				start: '16 Apr 1962',
				end: '25 Jul 1965',
				color: colors.d,
			},
			{
				start: '4 Oct 1965',
				end: '12 Jun 1967',
				color: colors.d,
			},
			{
				start: '2 Oct 1967',
				end: '14 May 1969',
				color: colors.d,
			},
			{
				start: '23 Jun 1969',
				end: '13 Feb 2016',
				color: colors.r,
			},
			{
				start: '10 Apr 2017',
				end: '31 Jul 2018',
				color: colors.r,
			},
			{
				start: '6 Oct 2018',
				end: '2023',
				color: colors.r,
			},
		],
	},
	// Chief Justices
	{
		name: 'John Jay',
		start: '19 Oct 1789',
		end: '29 Jun 1795',
		color: colors.f,
		href: true,
		forceY: 10,
	},
	{
		name: 'John Rutledge',
		start: '12 Aug 1795',
		end: '28 Dec 1795',
		color: colors.f,
		href: true,
		forceY: 10,
	},
	{
		name: 'Oliver Ellsworth',
		start: '8 Mar 1796',
		end: '15 Dec 1800',
		color: colors.f,
		href: true,
		forceY: 10,
	},
	{
		name: 'John Marshall',
		start: '4 Feb 1801',
		end: '6 Jul 1835',
		color: colors.f,
		href: true,
		forceY: 10,
	},
	{
		name: 'Roger B. Taney',
		start: '28 Mar 1836',
		end: '12 Oct 1864',
		color: colors.d,
		href: true,
		forceY: 10,
	},
	{
		name: 'Salmon P. Chase',
		start: '15 Dec 1864',
		end: '7 May 1873',
		color: colors.r,
		href: true,
		forceY: 10,
		insets: [
			{
				start: '1868',
				end: '7 May 1873',
				color: colors.d,
			},
		],
	},
	{
		name: 'Morrison Waite',
		start: '4 Mar 1874',
		end: '23 Mar 1888',
		color: colors.r,
		href: true,
		forceY: 10,
	},
	{
		name: 'Melville Fuller',
		start: '8 Oct 1888',
		end: '4 Jul 1910',
		color: colors.d,
		href: true,
		forceY: 10,
	},
	{
		name: 'Edward Douglass White',
		start: '19 Dec 1910',
		end: '19 May 1921',
		color: colors.d,
		href: true,
		forceY: 10,
	},
	{
		name: 'William Howard Taft',
		start: '11 Jul 1921',
		end: '3 Feb 1930',
		color: colors.r,
		href: true,
		forceY: 10,
	},
	{
		name: 'Charles Evans Hughes',
		start: '24 Feb 1930',
		end: '30 Jun 1941',
		color: colors.r,
		href: true,
		forceY: 10,
	},
	{
		name: 'Harlan F. Stone',
		start: '3 Jul 1941',
		end: '22 Apr 1946',
		color: colors.r,
		href: true,
		forceY: 10,
	},
	{
		name: 'Fred M. Vinson',
		start: '24 Jun 1946',
		end: '8 Sep 1953',
		color: colors.d,
		href: true,
		forceY: 10,
	},
	{
		name: 'Earl Warren',
		start: '5 Oct 1953',
		end: '23 Jun 1969',
		color: colors.r,
		href: true,
		forceY: 10,
	},
	{
		name: 'Warren E. Burger',
		start: '23 Jun 1969',
		end: '26 Sep 1986',
		color: colors.r,
		href: true,
		forceY: 10,
	},
	{
		name: 'William Rehnquist',
		start: '26 Sep 1986',
		end: '3 Sep 2005',
		color: colors.r,
		href: true,
		forceY: 10,
	},
	{
		name: 'John Roberts',
		start: '29 Sep 2005',
		end: '2023',
		href: true,
		forceY: 10,
	},
];