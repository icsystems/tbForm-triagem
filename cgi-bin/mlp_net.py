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
	try:
		input = np.load('inputs.npz')
	except:
		raise ValueError('No input file')
	nn = MLP(input['input'])
	nn.net()
	print nn.getOutput()
