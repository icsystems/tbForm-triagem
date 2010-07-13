#!/usr/bin/env python
# MLP implementation for supporting the tuberculosis diagnostic
# June 11th, 2010
# Author: Fernando Ferreira
# Contact: fferreira@lps.ufrj.br


import numpy as np

class MLP:
	"""
		2-Layers MLP implementation
	"""
	def __init__(self, input, config_file='conf.npz'):
		config_data  = np.load(config_file)
		self.W1      = config_data['W1']
		self.W2      = config_data['W2']
		self.centers = config_data['centers']
		self.factors = config_data['factors']
		self.b1      = config_data['b1']
		self.b2      = config_data['b2']
		self.lim     = config_data['lim']
		self.input   = input
		self.output  = .0
	def getLimit(self):
		return self.lim
	def net(self):
		input = (self.input - self.centers)*self.factors
		Y1 = np.tanh(np.dot(self.W1, input) + self.b1)
		Y2 = np.tanh(np.dot(self.W2, Y1)    + self.b2)
		self.output = Y2
	def getOutput(self):
		return self.output
	def evaluatePatient(self):
		if self.output < self.lim:
			return False
		return True

if __name__ == '__main__':
	def lStr2lInt (l):
		return [float(a) for a in l]
	csvFile = 'saidas_10_10_1_spw.csv'
	csv = __import__('csv')
	string = __import__('string')
	dataFile = csv.reader(open(csvFile))
	outputFile = open('test_outcome_text.csv', 'w')
	for row in dataFile:
		data = lStr2lInt(row[0:-2])
		nn = MLP(np.array(data, 'float'))
		nn.net()
		outputFile.write('%f \n '%nn.getOutput()[0])
	outputFile.close()
	#Validate output
	dataFile = csv.reader(open(csvFile))
	outputFile = csv.reader(open('test_outcome_text.csv'))
	saidas = []
	target = []
	try:
		for row in dataFile:
			if row[-1] == '':
				continue
			target.append(float(row[-1]))
		for row in outputFile:
			if row[0] == string.strip(''):
				continue
			saidas.append(float(string.strip(row[0])))
	except:
		pass
	diff = np.array(target) - np.array(saidas)
	vFile = open('test_validation.txt', 'w');
	for v in diff:
		vFile.write('%f \r\n'%v)
	vFile.close()
