#!/usr/bin/env python
# -*- coding: utf-8 -*-

import Image,ImageDraw
import cStringIO

import cgi
import cgitb
cgitb.enable()

def drawTrafficLight():
	img = Image.new("RGB", (210,730), "#FFFFFF")
	draw = ImageDraw.Draw(img)


	draw.ellipse((0,0,200,200), fill='green', outline='black')
	draw.point((100,100), fill='black')
	draw.ellipse((0,210,200,410), fill='yellow', outline='black')
	draw.point((100,310), fill='black')
	draw.ellipse((0,420,200,620), fill='red', outline='black')
	draw.point((100,520), fill='black')
	f = cStringIO.StringIO()
	img.save(f, "PNG")

	print "Content-type: image/png\n"
	f.seek(0)
	print f.read()

def Main():
	drawTrafficLight()

if __name__ == "__main__":
	Main()
