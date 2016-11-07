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

   /* @ngInject */
  function ProductController( productService, $mdSidenav, $mdBottomSheet, $timeout, $log, _, $scope, CartFactory, $mdToast, $mdDialog, $rootScope) {
    var self = this;

    self.search;
    self.searchR;
    self.orderBy      = null;
    self.selected     = null;
    self.products     = [];
    self.categories   = [];
    self.toggleList   = toggleList;
    self.apiUrl       = productService.apiUrl;
    
    /*filter categories */
    self.searchText   = null;
    self.selectedItem = null;
    self.categoriesAC = [];
    self.querySearch  = querySearchCategory;

    /*Search Product */
    self.searchProd      = undefined;
    var originatorEv;
    self.addToCart = addToCart;

    self.cartItems = CartFactory.cartArray;
    self.totalItem = totalItem;

    self.isCart = false;

    $scope.$on('$routeChangeSuccess', function(scope, next, current){
      if(next.$$route.originalPath == '/cart' || next.$$route.originalPath == '/cube') {
        self.isCart = true;
      } else {
        self.isCart = false;
      }
    });

    function addToCart(product) {
      CartFactory.addToCart(product);
      self.showSimpleToast('Added to cart');
      
    }

    function totalItem() {
      return _.sum(self.cartItems, function(item){
        return item.cant*item.price;
      });
    }

    self.showMessage = function methodName(ev) {
      $mdDialog.show(
            $mdDialog.alert()
              .clickOutsideToClose(true)
              .title('This is a Demo')
              .textContent('You can not pay at this moment')
              .ariaLabel('Dialog')
              .ok('Got it!')
              .targetEvent(ev)
          );
    };

    self.getNewProductsFromHttpServer = function(ev){

      var confirm = $mdDialog.confirm()
                .title('Reset Cart')
                .textContent('This will reset the carts contents and fetch new data')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Ok ')
                .cancel('Cancel');

          $mdDialog.show(confirm).then(function() {
              CartFactory.cartArray.length = 0;
              self.cleanProductVariables();
              self.getProducts();
          }, function() {
            
          });

      
    };


    self.changeAPI = function(ev) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.prompt()
      .title('Place the Url of the API')
      .placeholder('API Url')
      .ariaLabel('API Url')
      .initialValue('')
      .targetEvent(ev)
      .ok('Go')
      .cancel('Cancel');

    $mdDialog.show(confirm).then(function(result) {
      self.apiUrl = result;
      self.getNewProductsFromHttpServer();
    }, function() {

    });
  };



    self.showSimpleToast = function(message) {


    $mdToast.show(
      $mdToast.simple()
        .textContent(message)
        .position('top right')
        .hideDelay(500)
    );
  };
    self.deleteRowCallback = function(rows){
      console.log("rows", rows);
      _.remove(self.cartItems, function(item){
        return _.contains(rows, item.id);
      });
      console.log('items', self.cartItems);
    }


    self.cleanProductVariables = function(){
      self.products = [];
      self.categories = [];
      self.categoriesAC = [];
    };
    // Load all products registered 

    self.getProducts = function(){
      productService.getProducts(self.apiUrl).get({}).$promise
      .then(function (listProducts) {
        self.products = listProducts.products;
        self.categories = _.pluck(listProducts.categories, 'name');

        for (var i = 0; i < self.products.length; i++) {
          self.products[i].price = parseInt(self.products[i].price);
          for (var j= 0; j < self.products[i].categories.length; j++) {
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
    };
    self.getProducts();

    if (!!self.searchText) {
      self.search.categories = [self.searchText.value];
    }



   self.openMenu = function($mdOpenMenu, ev) {
    originatorEv = ev;
    $mdOpenMenu(ev);
  };

    // *********************************
    // Internal methods
    // *********************************

    /**
     * Hide or Show the 'left' sideNav area
     */
    function toggleList() {

      $mdSidenav('left').toggle();
      console.log('lok',$mdSidenav('left').isLockedOpen());
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

    $scope.$watch('productCtrl.searchR', function(value) {
      self.products = _.clone(self.Allproducts);
      switch(value){
        case '1': 
          self.search = {available: true};
          break;
        case '2':
          self.search = {available: false};
          break;
        case '3':
          self.search = {best_seller: true};
          break;
        case '4':
          _.remove(self.products, function (item) {
            console.log('item', item.price);
            return item.price < 30000;
          });
          break;
        case '5':
          _.remove(self.products, function (item) {
            console.log('item', item.price);
            return item.price  > 10000;
          });
          break;
        default:
          self.search = undefined;
          break;
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
    
    self.tableData = {
                      data: self.nutritionList,
                      'column-keys': [
                          'name',
                          'calories',
                          'fat',
                          'carbs',
                          'protein',
                          'sodium',
                          'calcium',
                          'iron'
                      ]
                      };

    
  }

})();
