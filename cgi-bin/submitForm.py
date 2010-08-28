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
	"""
	if 'score' in keys():
		templateDef += u"""
				<div id='header'>
					$score
				</div>
		"""
	templateDef += u"""
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
