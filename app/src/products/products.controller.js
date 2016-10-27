(function(){
  'use strict';
  angular
       .module('andresshop.products')
       .controller('ProductController', ProductController);

  /**
   * Main Controller for the Angular Material Starter App
   * @param $mdSidenav
   * @param avatarsService
   * @constructor
   */
  function ProductController( productService, $mdSidenav, $mdBottomSheet, $timeout, $log, _, $scope ) {
    var self = this;

    self.search;
    self.orderBy      = null;
    self.selected     = null;
    self.products     = [];
    self.categories   = [];
    self.toggleList   = toggleList;
    
    /*filter categories */
    self.searchText   = null;
    self.selectedItem = null;
    self.categoriesAC = [];
    self.querySearch   = querySearchCategory;



    // Load all products registered 

    productService.get({}).$promise
    .then(function (listProducts) {
      self.products = listProducts.products;
      self.categories = _.pluck(listProducts.categories, 'name');

      for (var i = 0; i < self.products.length; i++){
        self.products[i].price = parseInt(self.products[i].price);

        for (var j= 0; j < self.products[i].categories.length; j++){
          self.products[i].categories[j] = _.result(_.find(listProducts.categories, function(chr) {
              return chr.categori_id == self.products[i].categories[j];
            }), 'name');
        }
        
      }

      for (var i = 0; i < self.categories.length; i++) {
        self.categoriesAC.push({display: self.categories[i], value: self.categories[i]});
      }
      console.log('listProducts', self.products);
      self.Allproducts = _.clone(self.products);
      console.log('categoriesAC', self.categoriesAC);
    });

    if (!!self.searchText) {
      self.search.categories = [self.searchText.value];
    }

    // *********************************
    // Internal methods
    // *********************************

    /**
     * Hide or Show the 'left' sideNav area
     */
    function toggleList() {
      $mdSidenav('left').toggle();
    }

    /*
    * query search Category for autocomplete
    */

    function querySearchCategory (query) {
      var results = query ? self.categoriesAC.filter( createFilterFor(query) ) : self.categoriesAC;

      return results;
    }

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(state) {
        return (state.value.indexOf(lowercaseQuery) === 0);
      };

    }

    $scope.$watch('productCtrl.search', function(value) {
      if(!!value){
        if (_.isObject(value)) {
          self.search = value;
        } else {
         self.search = JSON.parse(value);
        }
      }
    });

    $scope.$watch('productCtrl.selectedItem', function(newV, old) {
      if (!!newV) {
        var temp = _.filter(self.products, _.matches({ 'categories': [newV.value] }));
        self.products = _.clone(temp);
      } else {
        self.products = _.clone(self.Allproducts);
      }
    });

    $scope.onSwipeRight = function(ev) {
      toggleList();
    };

  }

})();
