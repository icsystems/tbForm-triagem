#!/usr/bin/env python
# -*- coding: utf-8 -*-


print 'Content-type: text/html'
print

import cgi
import cgitb
import sys
import string
import numpy as np
cgitb.enable()

from art_net import ART
from xml.dom import minidom
from Cheetah.Template import Template
from unicodedata import normalize

def normalizeString(txt, codif='utf-8'):
	txt = normalize('NFKD', txt.decode(codif)).encode('ASCII','ignore')
	return txt.lower()

def createXML(keys, dictValues):
	xmlStr = '<?xml version="1.0" encoding="utf-8"?>'
	xmlStr += '<documento>'
	xmlStr += '<paciente>'
	xmlStr += '<triagem>'
	for k in keys:
		if k != 'score':
			xmlStr += '<%s>%s</%s>'%(k,dictValues[k],k)
	xmlStr += '</triagem>'
	xmlStr += '</paciente>'
	xmlStr += '</documento>'
	return xmlStr

def runArtClustering(keys, dictValues):
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
		'fumante',
		'TBXPulmonar',
		'internacaoHospitalar',
		'sida'
	)
	values = []
	for f in fields:
		try:
			value = dictValues[f]
			if f == 'idade':
				values.append(int(value))
			elif normalizeString(value) == 'nao':
				values.append(-1)
			elif value == 'jamais':
				values.append(-1)
			elif normalizeString(value) == 'sim':
				values.append(1)
			else:
				values.append(0)
		except:
			values.append(0)
	art = ART(np.array(values, float))
	art.net()
	return art.getOutput()

def Main():
	form = cgi.FieldStorage()
	#Build dict
	values = {}
	for k in form:
		v = form[k]
		if type(v) == list:
			values[k] = []
			for el in v:
				values[k].append(el.value)
		else:
			values[k] = v.value
	keys = [k for k in form]
	xmlStr = createXML(keys,values)
	domObj = minidom.parseString(xmlStr)
	xmlContent = domObj.toxml(encoding='utf-8')
	#make output
	templateDef = u"""
	<html>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<head>
			<title> Formulário Triagem </title>
			<style type='text/css'>
			<!--
				@import url(../css/submitForm_style.css);
			-->
			</style>
		</head>
		<body>
			<div id='header'>
				$score
			</div>
			<div id='content'>
				<div id='leftpanel'>
					<table>
						<thead>
						<tr>
							<th colspan='2'> Dados </th>
						</tr>
						</thead>
						<tbody>
	"""
	for k in form:
		templateDef += """
						<tr>
							<th>%s </th>
							<td>$%s</td>
						<tr>
		"""%(k,k,)
	templateDef+="""
						</tbody>
					</table>
				</div>
				<div id='center'>
					<h2>Para CONFIRMAR e REGISTRAR o paciente:</h2>
					<form action='submitXML.py' method='POST'>
						<input type='hidden' value='$xmlPaciente' name='xmlPaciente' />
						<input type='submit' value='Registrar'/>
					</form>
	"""

	cluster, radius, similarity = runArtClustering(keys,values)
	values['cluster'] = cluster
	values['radius']  = radius
	values['similarity']  = similarity
	templateDef+="""
				</div>
				<div id='rightpanel'>
					<img src='drawTrafficLights.py?cluster=$cluster&radius=$radius&similarity=$similarity'>
				</div>
			</div>
		</body>
	</html>
	"""
	values['xmlPaciente'] = xmlContent
	templateDef = templateDef.encode('utf-8', 'xmlcharrefreplace')
	t = Template(templateDef, searchList=[values])
	print t

if __name__ == '__main__':
	Main()
