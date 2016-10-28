(function(){
    'use strict';
    angular
    .module('andresshop', ['ngMaterial', 'ngResource', 'angular-lodash', 'andresshop.products', 'ngRoute'])
    .config(['$mdThemingProvider', '$mdIconProvider', '$routeProvider', '$locationProvider', function($mdThemingProvider, $mdIconProvider, $routeProvider, $locationProvider){

        // $locationProvider.html5Mode(true);
        $routeProvider
            .when("/", {
                templateUrl : "main.html"
            })
            .when("/cart", {
                templateUrl : "cart.html"
            });

        $mdIconProvider
            .defaultIconSet("./assets/svg/avatars.svg", 128)
            .icon("star", "./assets/svg/star.svg", 24)
            .icon("error", "./assets/svg/error.svg", 24)
            .icon("check", "./assets/svg/check.svg", 24)
            .icon("filter", "./assets/svg/filter.svg", 24)
            .icon("search", "./assets/svg/search.svg", 24)
            .icon("cart", "./assets/svg/cart.svg", 24)
            .icon("remove_cart", "./assets/svg/remove_cart.svg", 24)
            .icon("add_cart", "./assets/svg/add_cart.svg", 24)
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
  angular.module('andresshop.products', [ 'ngMaterial', 'andresshop.cart']);


})();
(function(){
  'use strict';

  // Prepare the 'users' module for subsequent registration of controllers and delegates
  angular.module('andresshop.users', [ 'ngMaterial' ]);
 

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

(function(){
  'use strict';
  ProductController.$inject = ['productService', '$mdSidenav', '$mdBottomSheet', '$timeout', '$log', '_', '$scope', 'CartFactory', '$mdToast'];
  angular
       .module('andresshop.products')
       .controller('ProductController', ProductController);

  /**
   * Main Controller for the Angular Material Starter App
   * @param $mdSidenav
   * @param avatarsService
   * @constructor
   */
  function ProductController( productService, $mdSidenav, $mdBottomSheet, $timeout, $log, _, $scope, CartFactory, $mdToast) {
    var self = this;

    self.search;
    self.searchR;
    self.orderBy      = null;
    self.selected     = null;
    self.products     = [];
    self.categories   = [];
    self.toggleList   = toggleList;
    
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

    function addToCart(product) {
      CartFactory.addToCart(product);
      self.showSimpleToast('Added to cart');
      
    }

    self.showSimpleToast = function(message) {


    $mdToast.show(
      $mdToast.simple()
        .textContent(message)
        .position('top right')
        .hideDelay(500)
    );
  };



    // Load all products registered 

    productService.get({}).$promise
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

  }

})();

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

(function(){
  'use strict';
  angular
       .module('andresshop.users')
       .controller('UserController', [
          'userService', '$mdSidenav', '$mdBottomSheet', '$timeout', '$log', 
          UserController 
       ]);

  /**
   * Main Controller for the Angular Material Starter App
   * @param $mdSidenav
   * @param avatarsService
   * @constructor
   */
  function UserController( userService, $mdSidenav, $mdBottomSheet, $timeout, $log ) {
    var self = this;

    self.selected     = null;
    self.users        = [ ];
    self.selectUser   = selectUser;
    self.toggleList   = toggleUsersList;
    self.makeContact  = makeContact;

    // Load all registered users 

    userService
          .loadAllUsers()
          .then( function( users ) {
            self.users    = [].concat(users);
            self.selected = users[0];
          });

    // *********************************
    // Internal methods
    // *********************************

    /**
     * Hide or Show the 'left' sideNav area
     */
    function toggleUsersList() {
      $mdSidenav('left').toggle();
    }

    /**
     * Select the current avatars
     * @param menuId
     */
    function selectUser ( user ) { 
      self.selected = angular.isNumber(user) ? self.users[user] : user;
    }

    /**
     * Show the Contact view in the bottom sheet
     */
    function makeContact(selectedUser) {

        $mdBottomSheet.show({
          controllerAs  : "vm",
          templateUrl   : './src/users/view/contactSheet.html',
          controller    : [ '$mdBottomSheet', ContactSheetController],
          parent        : angular.element(document.getElementById('content'))
        }).then(function(clickedItem) {
          $log.debug( clickedItem.name + ' clicked!');
        });

        /**
         * User ContactSheet controller
         */
        function ContactSheetController( $mdBottomSheet ) {
          this.user = selectedUser;
          this.items = [
            { name: 'Phone'       , icon: 'phone'       , icon_url: 'assets/svg/phone.svg'},
            { name: 'Twitter'     , icon: 'twitter'     , icon_url: 'assets/svg/twitter.svg'},
            { name: 'Google+'     , icon: 'google_plus' , icon_url: 'assets/svg/google_plus.svg'},
            { name: 'Hangout'     , icon: 'hangouts'    , icon_url: 'assets/svg/hangouts.svg'}
          ];
          this.contactUser = function(action) {
            // The actually contact process has not been implemented...
            // so just hide the bottomSheet

            $mdBottomSheet.hide(action);
          };
        }
    }

  }

})();

(function(){
  'use strict';

  angular.module('andresshop.users')
         .service('userService', ['$q', UserService]);

  /**
   * Users DataService
   * Uses embedded, hard-coded data model; acts asynchronously to simulate
   * remote data service call(s).
   *
   * @returns {{loadAll: Function}}
   * @constructor
   */
  function UserService($q){
    var users = [
      {
        name: 'Lia Lugo',
        avatar: 'svg-1',
        content: 'I love cheese, especially airedale queso. Cheese and biscuits halloumi cauliflower cheese cottage cheese swiss boursin fondue caerphilly. Cow port-salut camembert de normandie macaroni cheese feta who moved my cheese babybel boursin. Red leicester roquefort boursin squirty cheese jarlsberg blue castello caerphilly chalk and cheese. Lancashire.'
      },
      {
        name: 'George Duke',
        avatar: 'svg-2',
        content: 'Zombie ipsum reversus ab viral inferno, nam rick grimes malum cerebro. De carne lumbering animata corpora quaeritis. Summus brains sit​​, morbo vel maleficia? De apocalypsi gorger omero undead survivor dictum mauris.'
      },
      {
        name: 'Gener Delosreyes',
        avatar: 'svg-3',
        content: "Raw denim pour-over readymade Etsy Pitchfork. Four dollar toast pickled locavore bitters McSweeney's blog. Try-hard art party Shoreditch selfies. Odd Future butcher VHS, disrupt pop-up Thundercats chillwave vinyl jean shorts taxidermy master cleanse letterpress Wes Anderson mustache Helvetica. Schlitz bicycle rights chillwave irony lumberhungry Kickstarter next level sriracha typewriter Intelligentsia, migas kogi heirloom tousled. Disrupt 3 wolf moon lomo four loko. Pug mlkshk fanny pack literally hoodie bespoke, put a bird on it Marfa messenger bag kogi VHS."
      },
      {
        name: 'Lawrence Ray',
        avatar: 'svg-4',
        content: 'Scratch the furniture spit up on light gray carpet instead of adjacent linoleum so eat a plant, kill a hand pelt around the house and up and down stairs chasing phantoms run in circles, or claw drapes. Always hungry pelt around the house and up and down stairs chasing phantoms.'
      },
      {
        name: 'Ernesto Urbina',
        avatar: 'svg-5',
        content: 'Webtwo ipsum dolor sit amet, eskobo chumby doostang bebo. Bubbli greplin stypi prezi mzinga heroku wakoopa, shopify airbnb dogster dopplr gooru jumo, reddit plickers edmodo stypi zillow etsy.'
      },
      {
        name: 'Gani Ferrer',
        avatar: 'svg-6',
        content: "Lebowski ipsum yeah? What do you think happens when you get rad? You turn in your library card? Get a new driver's license? Stop being awesome? Dolor sit amet, consectetur adipiscing elit praesent ac magna justo pellentesque ac lectus. You don't go out and make a living dressed like that in the middle of a weekday. Quis elit blandit fringilla a ut turpis praesent felis ligula, malesuada suscipit malesuada."
      }
    ];

    // Promise-based API
    return {
      loadAllUsers : function() {
        // Simulate async nature of real remote calls
        return $q.when(users);
      }
    };
  }

})();
