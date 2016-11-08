(function iife() {
  'use strict';

  angular
    .module('andresshop.persistence')
    .factory('Persistence', Persistence);

  function Persistence($window) {

    var persistenceFactory = {
      getMatrix: getMatrix,
      setMatrix: setMatrix,
      getStorage: getStorage,
      setStorage: setStorage,
    };


    function getStorage(key) {
      return $window.localStorage.getItem(key);
    }

    function setStorage(key,value) {
      if (!!value) {
        $window.localStorage.setItem(key, value);
      }
      else {
        $window.localStorage.removeItem(key);
      }
    }

    function setMatrix(value) {
      if (!!value) {
        $window.localStorage.setItem('matrix', JSON.stringify(value));
      }
      else {
        $window.localStorage.removeItem('matrix');
      }
    }

    function getMatrix(value) {
      return  JSON.parse($window.localStorage.getItem('matrix'));
    }

    return persistenceFactory;
  }

})();