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
		self.conn = sqlite.connect('.db_correios')
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
		abbr = self.q.split(None, 1)
		abbrRules = {
			'R'    : 'Rua',
			'R.'   : 'Rua',
			'Av'   : 'Avenida',
			'Av.'  : 'Avenida',
			'Trav' : 'Travessa',
			'Trav.': 'Travessa',
			'Rod'  : 'Rodovia',
			'Rod.' : 'Rodovia'
		}
		if len(abbr) == 2 :
			for k, v in abbrRules.iteritems():
				if normalizeString(abbr[0]) == normalizeString(k):
					self.q = v + ' ' + abbr[1]

		self.connectPostServiceDB()
		cursor = self.conn.cursor()
		cursor.execute("""
			SELECT DISTINCT
				Logradouro||' '||Nome
			FROM
				ruasrj
			WHERE
				Logradouro||' '||RuaSemAcento like '%%%s%%'
				AND Localidade = '%s'
			LIMIT 9
		"""%(normalizeString(self.q) , city, ))
		retarr = [u"'%s'"%string.strip(r[0]) for r in cursor]
		cursor.close()
		self.conn.close()
		return retarr
	def completeFromCEP(self):
		#Format XXXXX-XXX
		def getState(cep):
			state =''
			prefixo = int(cep[0:5])
			if int(cep[0]) < 2:
				state = 'sp'
			elif prefixo >= 20000 and prefixo < 29000:
				state = 'rj'
			elif prefixo >= 29000 and prefixo < 30000:
				state = 'es'
			elif int(cep[0]) ==3:
				state = 'mg'
			elif prefixo >= 40000 and prefixo < 49000:
				state = 'ba'
			elif prefixo >= 49000 and prefixo <= 49999:
				state = 'se'
			elif prefixo >= 50000 and prefixo <= 56999:
				state = 'pe'
			elif prefixo >= 57000 and prefixo <= 57999:
				state = 'al'
			elif prefixo >= 58000 and prefixo <= 58999:
				state = 'pb'
			elif prefixo >= 59000 and prefixo <= 59999:
				state = 'rn'
			elif prefixo >= 60000 and prefixo <= 63999:
				state = 'ce'
			elif prefixo >= 64000 and prefixo <= 64999:
				state = 'pi'
			elif prefixo >= 65000 and prefixo <= 65999:
				state = 'ma'
			elif prefixo >= 66000 and prefixo <= 68899:
				state = 'pa'
			elif prefixo >= 68900 and prefixo <= 68999:
				state = 'ap'
			elif prefixo >= 69000 and prefixo <= 69299:
				state = 'am'
			elif prefixo >= 69400 and prefixo <= 69899:
				state = 'am'
			elif prefixo >= 69300 and prefixo <= 69399:
				state = 'ro'
			elif prefixo >= 69900 and prefixo <= 69999:
				state = 'ac'
			elif prefixo >= 70000 and prefixo <= 73699:
				state = 'df'
			elif prefixo >= 73700 and prefixo <= 76799:
				state = 'go'
			elif prefixo >= 76800 and prefixo <= 76999:
				state = 'rn'
			elif prefixo >= 77000 and prefixo <= 77999:
				state = 'to'
			elif int(cep[0]) ==9:
				state = 'rs'
			elif prefixo >= 78000 and prefixo <= 78899:
				state = 'mt'
			elif prefixo >= 79000 and prefixo <= 79999:
				state = 'ms'
			elif prefixo >= 80000 and prefixo <= 86999:
				state = 'pr'
			elif prefixo >= 87000 and prefixo <= 89999:
				state = 'sc'
			return state

		if self.q == '':
			return
		state = getState(self.q)
		self.connectPostServiceDB()
		cursor = self.conn.cursor()
		query = """
			SELECT
				ruas%s.Localidade as Localidade,
				ruas%s.Logradouro||" "||ruas%s.Nome as NomeCompleto
			FROM
				ruas%s ,cidadesbr
			WHERE
				cidadesbr.Nome = ruas%s.Localidade
				AND ruas%s.CEP = '%s'
		"""%(state, state, state, state , state, state, self.q,)
		cursor.execute(query)
		retarr = {}
		retarr['UF'] = state.upper()
		row = cursor.fetchone()
		retarr['Localidade'] = row[0]
		retarr['NomeCompleto'] = row[1]
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
		elif service == 'cep':
			res = ac.completeFromCEP()
			str = u"{'cep':'%s','state':'%s','city':'%s','street':'%s'}"%(q, res['UF'], res['Localidade'], res['NomeCompleto'],)
			sys.stdout.write(str.encode('ascii', 'backslashreplace'))
			return
	except:
		return
	str = JSONizer(q, res)
	sys.stdout.write(str)

if __name__ == '__main__':
	Main()
