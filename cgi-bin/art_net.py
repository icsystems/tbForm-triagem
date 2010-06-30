#!/usr/bin/env python
# ART implementation for supporting the tuberculosis diagnostic
# June 24th, 2010
# Author: Fernando Ferreira
# Contact: fferreira@lps.ufrj.br


import numpy as np

def euclidianDistance(G, X):
	s = np.tile(X, (G.shape[0], 1)) - G
	return np.diag(np.dot(s,s.T))

class ART:
	"""
		3 centered clusters ART implementation
	"""
	def __init__(self, input, config_file='art_conf.npz'):
		config_data  = np.load(config_file)
		self.G       = config_data['G']
		self.M       = config_data['M'][0]
		self.mean_id = config_data['mean_id']
		self.std_id  = config_data['std_id']
		self.norm_id = config_data['norm_id']
		self.r       = config_data['r'][0]
		self.input   = input
		self.output  = None
		self.d2      = None
	def normalize(self):
		input     = np.array(self.input, float)
		#Age normalization
		#input[0]  = self.input[0] - self.mean_id
		input[0]  =      input[0] / self.std_id
		input[0]  =      input[0] * self.norm_id
		#####
		s         = np.dot(input, input.T)
		newInput  = np.sqrt(self.M - s)
		input = np.append(input,newInput)
		input = input /np.sqrt(self.M)
		return input
	def net (self):
		input = self.normalize()
		d = euclidianDistance(self.G, input)
		u = (self.r**2) * np.ones(d.shape) - d
		self.output = np.argmax(u)
		self.d = d[self.output]
		if u[self.output] < 0:
			self.output= None
			self.d    = 0
	def getOutput(self):
		r = np.sqrt(self.d)
		return self.output, r, self.r

if __name__ == '__main__':
	art = ART([58, -1., -1., -1., -1., 0., -1., 0., 0., -1, -1., -1])
	#art = ART([ 58, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1])
	art.net()
	print art.getOutput()


