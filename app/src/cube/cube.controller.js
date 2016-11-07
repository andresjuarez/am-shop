(function () {
	'use strict';
	angular
	.module('andresshop.cube')
	.controller('CubeController', CubeController);

	function CubeController(_) {
		var self = this;
		self.matrix = [];
		self.sumMatrixV = 0;
		self.matrixsize = 0;
		self.matrixCreated = false;
		self.sumMatrix = sumMatrix;
		self.updateMatrix = updateMatrix;
		self.generateMatrix = generateMatrix;

		function generateMatrix() {
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
		}

		function updateMatrix() {
			self.matrix[self.positionX-1][self.positionY-1][self.positionZ-1] = self.value;
			self.positionX = self.positionY = self.positionZ = self.value = undefined;

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
		}

	}
	
})();