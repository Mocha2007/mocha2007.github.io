# a small script to check which files are new or modified in the past 30 days
from glob import glob
from os.path import getctime, getmtime
from time import time

day = 24 * 60 * 60
limit = 30 # days
for path in glob('*.html', recursive=True):
	c = round((time() - getctime(path))//day)
	if c < limit:
		print(f"C {str.rjust(str(c), 2)} d ago - {path}")
		continue
	m = round((time() - getmtime(path))//day)
	if m < limit:
		print(f"M {str.rjust(str(m), 2)} d ago - {path}")