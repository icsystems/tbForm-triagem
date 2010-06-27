#!/usr/bin/env python
# -*- coding: utf-8 -*-

import Image,ImageDraw
import cStringIO

import cgi
import cgitb
cgitb.enable()

from art_net import ART
import numpy as np

def drawTrafficLight(index, r, R):
	img = Image.new("RGB", (210,730), "#FFFFFF")
	draw = ImageDraw.Draw(img)

	colorON = ['green', 'yellow', 'red']
	color   = ['#98FB98','#EEE8AA','#CD9B9B']
	if index != None:
		color[index] = colorON[index]
	for k in range(3):
		draw.ellipse((0, k*210, 200, k*210 + 200), fill=color[k], outline=color[k])
		draw.point((100, 100+210*k), fill='black')
	if r:
		ri = 100*r/R
		draw.arc((100-ri,(index*210) + 100 -ri ,100+ri ,index*210 + 100 + ri), 0, 360, fill='black')
	f = cStringIO.StringIO()
	img.save(f, "PNG")

	print "Content-type: image/png\n"
	f.seek(0)
	print f.read()

def Main():
	form = cgi.FieldStorage()
	try:
		cluster = int(form['cluster'].value)
		r = float(form['radius'].value)
		R = float(form['similarity'].value)
	except:
		cluster = None
		r       = None
		R       = None
	drawTrafficLight(cluster, r, R)

if __name__ == "__main__":
	Main()
