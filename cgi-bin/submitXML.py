#!/usr/bin/env python
# -*- coding: utf-8 -*-

print 'Content-type: text/html'
print
import cgi
import cgitb
import sys,os

cgitb.enable()



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
			xmlStr = domMaster.toxml().encode('utf-8', 'xmlcharrefreplace')
			xml.write(xmlStr)
			sys.stdout.write("Paciente Registrado")
		else:
			xml = open(xmlFile, 'w')
			xml.write(xmlStr)
			sys.stdout.write("Paciente Registrado")
	except:
		print "ERROR"
	return 0
	

if __name__ == '__main__':
	Main()
