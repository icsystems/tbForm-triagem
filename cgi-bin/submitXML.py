#!/usr/bin/env python
# -*- coding: utf-8 -*-

print 'Content-type: text/html; charset=utf-8'
print
import cgi
import cgitb
import sys,os

cgitb.enable()

from Cheetah.Template import Template

from xml.dom import minidom

def Main():
	form = cgi.FieldStorage()
	xmlFile = 'pacientes.xml'
	try:
		#Get XML content
		xmlStr = form['xmlPaciente'].value
		# check xml file
		if os.path.isfile(xmlFile):
			domMaster = minidom.parse(xmlFile)
			nodePatients = domMaster.childNodes[0]
			domPatient = minidom.parseString(xmlStr)
			nodeNewPatient= domPatient.childNodes[0].childNodes[0]
			#Create new DOM Tree
			nodePatients.appendChild(nodeNewPatient)
			os.remove(xmlFile)
			xml = open(xmlFile, 'w')
			xmlStr = domMaster.toxml(encoding='utf-8')
			xml.write(xmlStr)
		else:
			xml = open(xmlFile, 'w')
			xml.write(xmlStr)
	except:
		print '<pre>'
		print 'ERROR'
		import traceback
		traceback.print_exc(file=sys.stdout)
		print xmlStr
		print '</pre>'
	else:
		templateDef = u"""
			<html>
				<head>
				</head>
				<body>
					<script>
						alert('Paciente Registrado.');
						window.location = '../index.html';
					</script>
				</body>
			</html>
		"""
		t = Template(templateDef)
		print t

	return 0

if __name__ == '__main__':
	Main()
