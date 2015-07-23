(function() {
  'use strict';

   angular.module('myApp.controllers')
    .controller('beerCtrl', ['$scope', '$http', function($scope, $http) {
          var username=getCookie("username");
          if(username === "") {
           $location.path('/')
          }
      
          $scope.name=username;

          var results = $scope,
            url = 'http://api.brewerydb.com/v2/',
            beer = 'beer/',
            beers = 'beers/',
            categories = 'categories/',
            category = 'category/',
            styles = 'styles/',
            style = 'style/',
            getRandom = 'random',
            apikey = '?key=3435e631918c81b4a3e45ed590b29a82',
            apikey2 = '?key=1fb2dde30f140bb33cdf99babb959265';

          // results.beers = function() {
          //     $http.get(url + beers + apikey)
          //       .success(function(data) {
          //         console.log(data);
          //       })
          //       .error(function(data, status, headers, config) {
          //         return 'cannot get beers' + status;
          //       });
          //   }();

          results.data = [];

          $scope.getBeer = function(beerId) {
            $http.get(url + getRandom + apikey2)
              .success(function(data) {
                // beer.results = data;
                results.data = data.data;
                console.log(results);
              })
              .error(function(data, status, headers, config) {

              });
              return results.data;
          };

          $scope.getCategories = function() {
            $http.get(url + categories + apikey2)
              .success(function(data) {
                results.data.categoriesAll = data.data;
                return data.data;
              })
              .error( function(data, status, headers, config) {

              });
          };

          $scope.getBeersInCategory = function(categoryId) {
            $http.get(url + category + categoryId + apikey2)
              .success(function(data) {
                results.data = data.data;
              })
              .error( function(data, status, headers, config) {

              });
              console.log(results.data);
              return results.data;
          };

          $scope.getStyles = function(categories) {
            $http.get(url + styles + apikey2)
              .success(function(data) {
                results.data.stylesAll = data.data;
                console.log('success on styles');
                $scope.getHierarchy(results.data.categoriesAll, results.data.stylesAll);
                return results.data;
              })
              .error( function(data, status, headers, config) {

              });
              
          };

          $scope.getHierarchy = function(parent, child) {
            results.data = {"name": "root", "id" : 0};
            results.data.children = [];

            for(var j = 0; j < parent.length; j++) {
              results.data.children[j] = parent[j];
              results.data.children[j].children = [];
            }

            for(var i in child) {
              var categoryId = child[i].category.id || child.length+1;
              results.data.children[categoryId-1].children.push(child[i]);
            }
            return results.data;
          };
  }]);
}());