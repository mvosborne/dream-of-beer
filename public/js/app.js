
(function() {
  'use strict';
  //create angular app
  angular.module('myApp', [
    'myApp.controllers',
    'myApp.directives', 
    'ngRoute'
    ]).config(function ($routeProvider) {
    $routeProvider
    .when('/', {
      templateUrl: 'js/view/main.html',
      controller: 'MainCtrl'
    })
    .when('/dashboard', {
      templateUrl: function() {
        $('.item').removeClass('active');
        $('#nav-home').addClass('active');
        return 'js/view/dashboard.html';
      },
      controller: 'DashboardCtrl'
    })
    .when('/beer', {
      templateUrl: function() {
        $('.item').removeClass('active');
        $('#nav-beer').addClass('active');
        return 'js/view/beer.html';
      }
      // controller: 'beerCtrl'
    })
    .when('/breweries', {
      templateUrl: function() {
        $('.item').removeClass('active');
        $('#nav-breweries').addClass('active');
        return 'js/view/breweries.html';
      },
      controller: 'breweriesCtrl'
    })
    .when('/foodpairings', {
      templateUrl: function() {
        $('.item').removeClass('active');
        $('#nav-foodpairings').addClass('active');
        return 'js/view/foodpairings.html';
      },
      controller: 'foodPairingsCtrl'
    })
    .when('/signup', {
      templateUrl: 'js/view/signup.html',
      controller: 'signupCtrl'
    })
    .when('/forgotpassword', {
      templateUrl: 'js/view/forgotpassword.html',
      controller: 'forgotpasswordCtrl'
    })
    .when('/changepassword', {
      templateUrl: function() {
        $('.item').removeClass('active');
        $('#nav-changepassword').addClass('active');
        return 'js/view/changepassword.html';
      },
      controller: 'changepasswordCtrl'
    })
  });
  // var app = angular.module('clientApp', ['ngRoute', 'd3']);

  //setup dependency injection
  angular.module('d3', []);
  angular.module('myApp.controllers', []);
  angular.module('myApp.directives', ['d3']);

}());
