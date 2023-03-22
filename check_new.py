"""a small script to check which files are new or modified in the past 30 days"""
from glob import glob
from os.path import abspath, dirname, getctime, getmtime
from time import time

DAY = 24 * 60 * 60
LIMIT = 30 # days
PATH = dirname(abspath(__file__))

for path in glob(PATH + '/**/*.html', recursive=True):
	path = path.replace(PATH + '\\', '')
	c = round((time() - getctime(path))//DAY)
	if c < LIMIT:
		print(f"C {str.rjust(str(c), 2)} d ago - {path}")
		continue
	m = round((time() - getmtime(path))//DAY)
	if m < LIMIT:
		print(f"M {str.rjust(str(m), 2)} d ago - {path}")
