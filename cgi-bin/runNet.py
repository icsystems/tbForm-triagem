#!/usr/bin/env python
# -*- coding: utf-8 -*-

print 'Content-type: text/html'
print
import cgi
import cgitb
import sys
cgitb.enable()

from mlp_net import MLP
import numpy as np


def Main():
	#Translate input tags
	fields = (
		'idade',
		'tosse',
		'hemoptoico',
		'sudorese',
		'febre',
		'emagrecimento',
		'dispneia',
		'fuma',
		'internacaoHospitalar',
		'sida'
	)
	form = cgi.FieldStorage()
	input =[]
	for f in fields:
		try:
			value = form[f].value
			if f == 'idade':
				input.append(int(value))
			elif value == 'nao':
				input.append(-1)
			elif value == 'sim' or value=='Sim':
				input.append(1)
			else:
				input.append(0)
		except:
			input.append(0)
	nn = MLP(np.array(input))
	nn.net()
	a = nn.getOutput()[0] - nn.getLimit()
	if nn.getOutput() < nn.getLimit():
		level = a/(1+nn.getLimit())
	else:
		level = a/(1-nn.getLimit())
	outcome  = u"{ 'output': %.02f," %(nn.getOutput())
	outcome += u"  'hThreshold': %.02f," %(nn.getHigherThreshold())
	outcome += u"  'lThreshold': %.02f," %(nn.getLowerThreshold())
	if level < 0:
		outcome += u"  'TB': 'no',"
	else:
		outcome += u"  'TB': 'yes',"
		if nn.getOutput() < nn.getLowerThreshold():
			outcome += u"  'probability': 'baixa',"
		elif nn.getOutput() < nn.getHigherThreshold():
			outcome += u"  'probability': 'média',"
		else:
			outcome += u"  'probability': 'alta',"
	outcome += u" 'threshold' : %.02f }"%(nn.getLimit())
	sys.stdout.write(outcome.encode('utf-8', 'replace'))
if __name__ == '__main__':
	Main()
