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
      cartArray: cartArray,
      cleanCart: cleanCart
    };
    return service;

    ////////////////

    function addToCart(product) {

      var isIn = _.find(cartArray, _.identity(product));

      if (isIn == undefined) {
        product.cant = 1;
        product.subTotal = product.price;
        cartArray.push(product);
      } else {
        isIn.cant += 1;
        isIn.subTotal = isIn.cant * isIn.price; 
      }      
      
    }

    function cleanCart(){
      cartArray = [];
    }

    function removeFromCart(product) {
      _.reject(cartArray, product);
    }

  }
})();
