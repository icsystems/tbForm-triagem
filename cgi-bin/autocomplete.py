#!/usr/bin/env python
# -*- coding: utf-8 -*-

print 'Content-type: text/html'
print

import cgi
import cgitb
cgitb.enable()

from pysqlite2 import dbapi2 as sqlite
import sys
import string


from unicodedata import normalize

def normalizeString(txt, codif='utf-8'):
	txt = normalize('NFKD', txt.decode(codif)).encode('ASCII','ignore')
	return txt.lower()

def JSONizer(q, res):
	if res == []:
		raise ValueError('No Results')
	jStr = u", ".join(res)
	jStr = jStr.encode('ascii', 'backslashreplace')
	retstr = "{"
	if q!='':
		retstr= retstr + "query:'%s',"%(q,)
	retstr=  retstr + """
	suggestions:[
		%s
	]
	}
	"""%(jStr, )
	return retstr

class autoComplete:
	def __init__(self, query=''):
		self.q    = query
	def connectPostServiceDB(self):
		self.conn = sqlite.connect('/home/fferreira/public_html/triagem/cgi-bin/.db_correios')
	def retrieveStates(self):
		self.connectPostServiceDB()
		cursor = self.conn.cursor()
		cursor.execute("""
			SELECT DISTINCT UF
			FROM cidadesbr
		""")
		retarr = ["'%s'"%string.strip(r[0]) for r in cursor]
		cursor.close()
		self.conn.close()
		return retarr
	def retrieveCities(self, state):
		if self.q == '':
			return
		self.connectPostServiceDB()
		cursor = self.conn.cursor()
		cursor.execute("""
			SELECT Nome
			FROM cidadesbr
			WHERE
				NomeSemAcento like '%s%%'
				AND UF = '%s'
			LIMIT 9
		"""%(normalizeString(self.q) , state, ))
		retarr = ["'%s'"%string.strip(r[0]) for r in cursor]
		cursor.close()
		self.conn.close()
		return retarr
	def retrieveNeighborhoods(self, city):
		if self.q == '':
			return
		self.connectPostServiceDB()
		cursor = self.conn.cursor()
		cursor.execute("""
			SELECT bairrosbrasil.Nome
			FROM
				bairrosbrasil,
				cidadesbr
			WHERE
				bairrosbrasil.Localidade = cidadesbr.ID
				AND bairrosbrasil.NomeSemAcento like '%s%%'
				AND cidadesbr.Nome = '%s'
			LIMIT 9
		"""%(normalizeString(self.q) , city, ))
		retarr = ["'%s'"%string.strip(r[0]) for r in cursor]
		cursor.close()
		self.conn.close()
		return retarr
	def retrieveStreets(self, city):
		if self.q == '':
			return
		self.connectPostServiceDB()
		cursor = self.conn.cursor()
		cursor.execute("""
			SELECT DISTINCT
				Nome
			FROM
				ruasrj
			WHERE
				RuaSemAcento like '%s%%'
				AND Localidade = '%s'
			LIMIT 9
		"""%(normalizeString(self.q) , city, ))
		retarr = [u"'%s'"%string.strip(r[0]) for r in cursor]
		cursor.close()
		self.conn.close()
		return retarr


def Main():
	form = cgi.FieldStorage()
	res = []
	try:
		q = form['query'].value
	except:
		q = ''
	ac = autoComplete(q)
	try:
		service = form['service'].value
		if service == 'city':
			res = ac.retrieveCities(form['state'].value)
		elif service == 'state':
			res = ac.retrieveStates()
		elif service == 'neighborhood':
			res = ac.retrieveNeighborhoods(form['city'].value)
		elif service == 'street':
			res = ac.retrieveStreets(form['city'].value)
	except:
		return
	str = JSONizer(q, res)
	sys.stdout.write(str)

if __name__ == '__main__':
	Main()
