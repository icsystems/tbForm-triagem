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
		'anorexia',
		'fuma',
		'TBXPulmonar',
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
			elif value == 'sim':
				input.append(1)
			else:
				input.append(0)
		except:
			input.append(0)
	nn = MLP(np.array(input))
	nn.net()
	res = '%.02f'%(abs(nn.getOutput()[0]*100))
	if nn.getOutput()[0] < 0:
		outcome = u'TB <strong>NEGATIVO</strong> a nível de %s %%'%res
		sys.stdout.write(outcome.encode('utf-8', 'replace'))
	else:
		outcome = u'TB <strong>POSITIVO</strong> a nível de %s %%'%res
		sys.stdout.write(outcome.encode('utf-8', 'replace'))
if __name__ == '__main__':
	Main()
