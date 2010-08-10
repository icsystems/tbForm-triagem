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
	if level < 0:
		outcome = u'<strong> O paciente n&atilde;o possui TB</strong>'
		outcome += u'<input type="hidden" name="score" id="score" value="naoTB"/>'
	else:
		color = u'red'
		prob  = u'ALTA'
		if nn.getOutput() <= nn.getLowerThreshold():
			color = u'green'
			prob  = u'BAIXA'
		elif nn.getOutput <= nn.getHigherThreshold():
			color = u'yellow'
			prob  = u'MÉDIA'
		outcome = u'<p style="color:%s">O paciente possui probabilidade %s de possuir TB</p>'%(color, prob)
		outcome += u'<input type="hidden" name="score" id="score" value="%s"/>'%(prob.lower())
	sys.stdout.write(outcome.encode('utf-8', 'replace'))
if __name__ == '__main__':
	Main()
