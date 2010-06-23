#!/usr/bin/env python
# -*- coding: utf-8 -*-


print 'Content-type: text/html'
print
import cgi
import cgitb
import sys
cgitb.enable()

from Cheetah.Template import Template

from xml.dom import minidom

def createXML(dictValues):
	xmlStr = '<paciente>'
	xmlStr += '<triagem>'
	for k,v in dictValues.iteritems():
		xmlStr += '<%s>%s</%s>'%(k,v,k)
	xmlStr += '</triagem>'
	xmlStr += '</paciente>'
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
	domObj = minidom.parseString(createXML(values))
	xmlContent = domObj.toxml().encode('ascii', 'xmlcharrefreplace')


	templateDef = u"""
	<html>
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
				</div>
				<div id='rightpanel'>
					<img src='drawTrafficLights.py'>
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
