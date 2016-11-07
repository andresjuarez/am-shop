(function(){
    'use strict';
    angular
    .module('andresshop', ['ngMaterial', 'ngResource', 'angular-lodash', 'andresshop.products', 'ngRoute', 'mdDataTable', 'andresshop.cube'])
    .config(['$mdThemingProvider', '$mdIconProvider', '$routeProvider', '$locationProvider', function($mdThemingProvider, $mdIconProvider, $routeProvider, $locationProvider){

        // $locationProvider.html5Mode(true);
        $routeProvider
            .when("/", {
                templateUrl : "main.html"
            })
            .when("/cart", {
                templateUrl : "cart.html"
            })
            .when("/cube", {
                templateUrl : "cube.html"
            });

        $mdIconProvider
            .defaultIconSet("./assets/svg/avatars.svg", 128)
            .icon("star", "./assets/svg/star.svg", 24)
            .icon("cart", "./assets/svg/cart.svg", 24)
            .icon("error", "./assets/svg/error.svg", 24)
            .icon("check", "./assets/svg/check.svg", 24)
            .icon("filter", "./assets/svg/filter.svg", 24)
            .icon("search", "./assets/svg/search.svg", 24)
            .icon("add_cart", "./assets/svg/add_cart.svg", 24)
            .icon("credit", "./assets/svg/credit_card.svg", 24)
            .icon("remove_cart", "./assets/svg/remove_cart.svg", 24)
            .icon("menu"       , "./assets/svg/menu.svg"        , 24)
            .icon("share"      , "./assets/svg/share.svg"       , 24)
            .icon("google_plus", "./assets/svg/google_plus.svg" , 512)
            .icon("hangouts"   , "./assets/svg/hangouts.svg"    , 512)
            .icon("twitter"    , "./assets/svg/twitter.svg"     , 512)
            .icon("phone"      , "./assets/svg/phone.svg"       , 512);

            $mdThemingProvider.theme('default')
                .primaryPalette('deep-orange')
                .accentPalette('blue')
                .warnPalette('red');

            $mdThemingProvider.enableBrowserColor({
                theme: 'default', // Default is 'default'
                palette: 'deep-orange', // Default is 'primary', any basic material palette and extended palettes are available
                hue: '800' // Default is '800'
            });

    }])
    .constant('_', window._);
})();

(function(){
  'use strict';

  // Prepare the 'products' module for subsequent registration of controllers and delegates
  angular.module('andresshop.cart', [ 'ngMaterial']);


})();
(function(){
  'use strict';

  // Prepare the 'products' module for subsequent registration of controllers and delegates
  angular.module('andresshop.cube', ['ngMessages']);


})();
(function(){
  'use strict';

  // Prepare the 'products' module for subsequent registration of controllers and delegates
  angular.module('andresshop.products', [ 'ngMaterial', 'andresshop.cart']);


})();
(function iife() {
  'use strict';

  CartFactory.$inject = ['_'];
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

(function () {
	'use strict';
	CubeController.$inject = ['_'];
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
(function(){
  'use strict';
  ProductController.$inject = ['productService', '$mdSidenav', '$mdBottomSheet', '$timeout', '$log', '_', '$scope', 'CartFactory', '$mdToast', '$mdDialog', '$rootScope'];
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

(function(){
  'use strict';

  productService.$inject = ['$resource', '$q', 'BASE_API_URI'];
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
