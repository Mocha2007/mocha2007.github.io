# a small script to check which files are new or modified in the past 30 days
from glob import glob
from os.path import abspath, dirname, getctime, getmtime
from time import time

day = 24 * 60 * 60
limit = 30 # days
my_path = dirname(abspath(__file__))
for path in glob(my_path + '/**/*.html', recursive=True):
	path = path.replace(my_path + '\\', '')
	c = round((time() - getctime(path))//day)
	if c < limit:
		print(f"C {str.rjust(str(c), 2)} d ago - {path}")
		continue
	m = round((time() - getmtime(path))//day)
	if m < limit:
		print(f"M {str.rjust(str(m), 2)} d ago - {path}")