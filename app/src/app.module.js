(function(){
    'use strict';
    angular
    .module('andresshop', ['ngMaterial', 'ngResource', 'angular-lodash', 'andresshop.products', 'ngRoute', 'mdDataTable', 'andresshop.cube', 'andresshop.persistence'])
    .config(function($mdThemingProvider, $mdIconProvider, $routeProvider, $locationProvider){

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
            })
            .when("/info", {
                templateUrl : "info.html"
            });

        $mdIconProvider
            .defaultIconSet("./assets/svg/avatars.svg", 128)
            .icon("star", "./assets/svg/star.svg", 24)
            .icon("info", "./assets/svg/info.svg", 24)
            .icon("cube", "./assets/svg/cube.svg", 24)
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

    })
    .constant('_', window._);
})();
