(function() { 
  'use strict';

  angular.module('myApp.controllers')
    .controller('navbarCtrl', ['$scope', '$location', '$log', function($scope, $location, $log) {
      var username=getCookie("username");
     if(username == "")
      {
       $location.path('/')
      }

      $scope.name=username;

      $scope.isLogIn = function() {
        if ($location.path() === '/' || $location.path() === '/signup' || $location.path() === '/forgotpassword') {
          return true;
        } else {
          return false;
        }
      };
      
      $scope.brand = function() {
        $location.path('/dashboard');
      };

      $scope.home = function () {
        $location.path('/dashboard');
      };

      $scope.beer = function () {
        $location.path('/beer');
      };

      $scope.breweries = function () {
        $location.path('/breweries');
      };

      $scope.foodpairings = function () {
        $location.path('/foodpairings');
      };

      $scope.signout = function () {
        document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
        $location.path('/');
      };

     $scope.changepassword = function () {
        $location.path('/changepassword');
      };
  }]);
}());