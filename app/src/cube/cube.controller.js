(function () {
	'use strict';
	angular
	.module('andresshop.cube')
	.controller('CubeController', CubeController);

	function CubeController(_, Persistence) {
		var self = this;

		var matr = Persistence.getMatrix();
		console.log('MATRIX', matr);
		if (!!matr) {
			self.matrix = matr;
		} else {
			self.matrix = [];
		}

		self.previousMatrixSize = Persistence.getStorage('matrixSize');
		self.sumMatrixV         = Persistence.getStorage('sumMatrixV');
		self.matrixsize         = Persistence.getStorage('matrixSize');
		self.matrixCreated      = false;
		self.sumMatrix          = sumMatrix;
		self.updateMatrix       = updateMatrix;
		self.generateMatrix     = generateMatrix;
		self.resetLocalStorage  = resetLocalStorage;

		function generateMatrix() {
			Persistence.setStorage('matrixSize', self.matrixsize);
			self.previousMatrixSize = self.matrixsize;
			for (var i = 0; i < self.matrixsize; i++) {
				self.matrix[i] = [];
				for (var j = 0; j < self.matrixsize; j++) {
					self.matrix[i][j] = [];
					for (var k = 0; k < self.matrixsize; k++) {
						self.matrix[i][j][k] = 0;
					}
				}
			}
			self.matrixCreated = true;
			Persistence.setMatrix(self.matrix);
		}

		function updateMatrix() {
			self.matrix[self.positionX-1][self.positionY-1][self.positionZ-1] = self.value;
			//self.positionX = self.positionY = self.positionZ = self.value = undefined;
			Persistence.setMatrix(self.matrix);
		}

		function sumMatrix() {
			self.sumMatrixV = 0;
			for (var i = self.begX-1; i < self.topX; i++) {
				for (var j = self.begY-1; j < self.topY; j++) {
					for (var k = self.begZ-1; k < self.topZ; k++) {
						self.sumMatrixV += self.matrix[i][j][k];
					}
				}
			}
			Persistence.setStorage('sumMatrixV', self.sumMatrixV);
		}

		function resetLocalStorage() {
			Persistence.setMatrix();
			Persistence.setStorage('sumMatrixV');
			Persistence.setStorage('matrixSize');
			self.previousMatrixSize = undefined;
			self.matrixCreated      = false;

		}

	}
	
})();