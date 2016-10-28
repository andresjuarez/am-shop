(function iife() {
  'use strict';

  angular
    .module('andresshop.cart')
    .factory('CartFactory', CartFactory);

  /* @ngInject */
  function CartFactory(_) {

    var cartArray = [];
    
    var service = {
      confirm: confirm,
      addToCart: addToCart,
      cartArray: cartArray
    };
    return service;

    ////////////////

    function addToCart(product) {

      var isIn = _.find(cartArray, _.identity(product));

      if (isIn == undefined) {
        product.cant = 1;
        cartArray.push(product);
      } else {
        isIn.cant += 1;
      }      
      
    }

    function removeFromCart(product) {
      _.reject(cartArray, product);
    }

  }
})();
