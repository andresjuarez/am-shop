(function(){
  'use strict';

  angular.module('andresshop.products')
         .service('productService', ['$resource','$q', productService]);

  /**
   * Users DataService
   * Uses embedded, hard-coded data model; acts asynchronously to simulate
   * remote data service call(s).
   *
   * @returns {{loadAll: Function}}
   * @constructor
   */
  function productService($resource, $q, BASE_API_URI){
    var service = $resource('http://www.mocky.io/v2/58115c3b3a0000a20d6098d4', {},
      {

        get: {
          method: 'GET',
          isArray: false
        }
      });
    return service;
  }

})();
