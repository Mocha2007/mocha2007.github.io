# a small script to check which files are new or modified in the past 30 days
from glob import glob
from os.path import getctime, getmtime
from time import time

paths = glob('*.html', recursive=True)
within30d = time() - 30 * 24 * 60 * 60
for path in paths:
	c = getctime(path)
	if within30d < c:
		print(str.ljust(f"C {c}", 22) + path)
		continue
	m = getmtime(path)
	if within30d < m:
		print(str.ljust(f"M {m}", 22) + path)