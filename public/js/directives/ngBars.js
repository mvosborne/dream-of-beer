(function () { 
  'use strict';

  angular.module('myApp.directives')
    .directive('ngBars', ['$window', '$timeout', 'd3', 
    function($window, $timeout, d3) {
      return {
        restrict: 'A',
        controller: 'beerCtrl',
        scope: {
          //= means bi-directional binding between the local scope property and the parent property; 
          //if the parent model changes, just like normal data binding, then the local property will reflect the change

          //@ means binding local scope (string) to value of the DOM's scope 
          //so the value of the outer scope is available inside directive's scope

          //& means parent execution binding so it executes a function in the context of the parent scope
          //when setting the value, a function wrapper  will be created and point to the parent function
          data: '=?', // make the data bind optional so it doesn't error when at first data is undefined
          label: '@',  
          onClick: '&'
        },
        link: function(scope, ele, attrs) {
          d3.d3().then(function(d3) {
            var renderTimeout;
            var margin = parseInt(attrs.margin) || 20,
                barHeight = parseInt(attrs.barHeight) || 20,
                barPadding = parseInt(attrs.barPadding) || 5;

            var svg = d3.select(ele[0])
              .append('svg')
              .style('width', '100%');
   
            $window.onresize = function() {
              scope.$apply();
            };

            scope.getStyles();
            scope.$watch(function() {
              return angular.element($window)[0].innerWidth;
            }, function() {
              scope.render(scope.data);
            });
   
            scope.$watch('data', function(newData) {
              scope.render(newData);
            }, true);
   
            scope.render = function(data) {
              svg.selectAll('*').remove();
   
              if (!data) {
                console.log("no data");
                return;
              }
              if (renderTimeout) clearTimeout(renderTimeout);
   
              renderTimeout = $timeout(function() {
                var width = d3.select(ele[0])[0][0].offsetWidth - margin,
                    height = (scope.data.length || 5) * (barHeight + barPadding),
                    color = d3.scale.category20(),
                    xScale = d3.scale.linear()
                      .domain([0, d3.max(data, function(d) {
                        return d.id;
                      })])
                      .range([width/2, width]);
                console.log( scope.data);
                svg.attr('height', height);
                svg.selectAll('rect')
                  .data(data)
                  .enter()
                    .append('rect')
                    .on('click', function(d,i) {
                      return scope.getBeersInCategory(d.id);
                    })
                    .attr('height', 40)
                    .attr('width', 140)
                    .attr('x', Math.round(margin/2))
                    .attr('y', function(d,i) {
                      return i * (barHeight + barPadding);
                    })
                    .attr('fill', function(d) {
                      return color(d.id);
                    })
                    .transition()
                      .duration(1000)
                      .attr('width', function(d) {
                        return 600;
                      });
                svg.selectAll('text')
                  .data(data)
                  .enter()
                    .append('text')
                    .attr('fill', '#fff')
                    .attr('y', function(d,i) {
                      return i * (barHeight + barPadding) + 15;
                    })
                    .attr('x', 15)
                    .text(function(d) {
                      return d.name + " (scored: " + d.name + ")";
                    });
              }, 200);
            };//end scope.render function
          });//end .then()
      }}// end  link funct andreturn {}
  }]);//end directive function
}());