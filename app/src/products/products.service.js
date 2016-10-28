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

   /* @ngInject */
  function productService($resource, $q, BASE_API_URI){

    var apiUrl = 'http://www.mocky.io/v2/58115c3b3a0000a20d6098d4';

    var getProducts = function(httpServerUrl){
      return $resource(httpServerUrl, {},
            {

              get: {
                method: 'GET',
                isArray: false
              }
            });
    };

    var changeHttpServer = function(newUrl){

      apiUrl = newUrl;

    };

    var service = {
      getProducts: getProducts,
      changeHttpServer: changeHttpServer,
      apiUrl: apiUrl
    };

    return service;
  }

})();
