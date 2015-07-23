(function () { 
  'use strict';

  angular.module('myApp.directives')
    .directive('ngTreeMap', ['$window', '$timeout', 'd3', 
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
            var margin = {top: 20, right: 0, bottom: 0, left: 0};

            // var svg = d3.select(ele[0])
            //     .append('svg')
            //     .attr('width', '100%');
            var svg = d3.select(ele[0]).append('svg');
   
            $window.onresize = function() {
              scope.$apply();
            };

            scope.getCategories();
            scope.getStyles();

            scope.$watch(function() {
              return angular.element($window)[0].innerWidth;
            }, function() {
              scope.render(scope.data);
            });
   
            // scope.$watch('data', function(newData) {
            //   scope.render(newData);
            // }, true);

            scope.render = function(data) {
              svg.selectAll('*').remove();
   
              if (!data) {
                console.log("no data");
                return;
              }
              if (renderTimeout) clearTimeout(renderTimeout);
   
              renderTimeout = $timeout(function() {

                var width = window.innerWidth,//960 - margin.left - margin.right,
                    height = 500 - margin.top - margin.bottom,//1000 - margin.top - margin.bottom,
                    color = d3.scale.category20(),
                    formatNumber = d3.format(",d"),
                    transitioning;

                var x = d3.scale.linear()
                    .domain([0, width])
                    .range([0, width]);

                var y = d3.scale.linear()
                    .domain([0, height])
                    .range([0, height]);

                var treemap = d3.layout.treemap()
                  .children(function(d, depth) { return depth ? null : d._children; })
                  .sort(function(a,b) { return a.id - b.id; })
                  .ratio(height / width * 0.5 * (1 + Math.sqrt(5)))
                  .round(false)
                  .value(function(d) { return d.id; });
                  // .size([width, height])
                  // 
                  // .nodes(scope.data);
                  // .sticky(true);
                  // .value(function(d) { return d.id; } /);
                
                svg.attr('width', width + margin.left + margin.right)
                  .attr('height', height + margin.bottom + margin.top)
                  .style('margin-left', -margin.left + 'px')
                  .style('margin-right', -margin.right + 'px')
                .append('g')
                    .style('shape-rendering', 'crispEdges')
                    .style('transform', "translate(" + margin.left + ", " + margin.top + ")");

                var grandparent = svg.append('g')
                    .attr('class', 'grandparent');

                grandparent.append('rect')
                    .attr('y', -margin.top)
                    .attr('width', width)
                    .attr('height', margin.top);

                grandparent.append('text')
                    .attr('x', 6)
                    .attr('y', 6 - margin.top)
                    .attr('dy', '.75em');


                initialize(scope.data);
                accumulate(scope.data);
                layout(scope.data);
                display(scope.data);

                function initialize(root) {
                  root.x = root.y = 0;
                  root.dx = width;
                  root.dy = height;
                  root.depth = 0;
                }

                // Aggregate the values for internal nodes. This is normally done by the
                // treemap layout, but not here because of our custom implementation.
                // We also take a snapshot of the original children (_children) to avoid
                // the children being overwritten when when layout is computed.
                function accumulate(d) {
                  return (d._children = d.children)
                      ? d.id = d.children.reduce(function(p, v) { return p + accumulate(v); }, 0)
                      : d.id;
                }

                // Compute the treemap layout recursively such that each group of siblings
                // uses the same size (1×1) rather than the dimensions of the parent cell.
                // This optimizes the layout for the current zoom state. Note that a wrapper
                // object is created for the parent node for each group of siblings so that
                // the parent’s dimensions are not discarded as we recurse. Since each group
                // of sibling was laid out in 1×1, we must rescale to fit using absolute
                // coordinates. This lets us use a viewport to zoom.
                function layout(d) {
                  console.log(d);
                  if (d._children) {
                    treemap.nodes({_children: d._children});
                    d._children.forEach(function(c) {
                      c.x = d.x + c.x * d.dx;
                      c.y = d.y + c.y * d.dy;
                      c.dx *= d.dx;
                      c.dy *= d.dy;
                      c.parent = d;
                      layout(c);
                    });
                  }
                }

                function display(d) {
                  grandparent
                      .datum(d.parent)
                      .on("click", transition)
                    .select("text")
                      .text(name(d));

                  var g1 = svg.insert("g", ".grandparent")
                      .datum(d)
                      .attr("class", "depth");

                  var g = g1.selectAll("g")
                      .data(d._children)
                    .enter().append("g");

                  g.filter(function(d) { return d._children; })
                      .classed("children", true)
                      .on("click", transition);

                  g.selectAll(".child")
                      .data(function(d) { return d._children || [d]; })
                    .enter().append("rect")
                      .attr("class", "child")
                      .call(rect);

                  g.append("rect")
                      .attr("class", "parent")
                      .call(rect)
                    .append("title")
                      .text(function(d) { return formatNumber(d.id); });

                  g.append("text")
                      .attr("dy", ".75em")
                      .text(function(d) { return d.name; })
                      .call(text);

                  function transition(d) {
                    if (transitioning || !d) return;
                    transitioning = true;

                    var g2 = display(d),
                        t1 = g1.transition().duration(750),
                        t2 = g2.transition().duration(750);

                    // Update the domain only after entering new elements.
                    x.domain([d.x, d.x + d.dx]);
                    y.domain([d.y, d.y + d.dy]);

                    // Enable anti-aliasing during the transition.
                    svg.style("shape-rendering", null);

                    // Draw child nodes on top of parent nodes.
                    svg.selectAll(".depth").sort(function(a, b) { return a.depth - b.depth; });

                    // Fade-in entering text.
                    g2.selectAll("text").style("fill-opacity", 0);

                    // Transition to the new view.
                    t1.selectAll("text").call(text).style("fill-opacity", 0);
                    t2.selectAll("text").call(text).style("fill-opacity", 1);
                    t1.selectAll("rect").call(rect);
                    t2.selectAll("rect").call(rect);

                    // Remove the old node when the transition is finished.
                    t1.remove().each("end", function() {
                      svg.style("shape-rendering", "crispEdges");
                      transitioning = false;
                    });
                  }

                  return g;
                }

                function text(text) {
                  text.attr("x", function(d) { return x(d.x) + 6; })
                      .attr("y", function(d) { return y(d.y) + 6; });
                }

                function rect(rect) {
                  rect.attr("x", function(d) { return x(d.x); })
                      .attr("y", function(d) { return y(d.y); })
                      .attr("width", function(d) { return x(d.x + d.dx) - x(d.x); })
                      .attr("height", function(d) { return y(d.y + d.dy) - y(d.y); })
                      .attr("fill", function(d) { return d.children ? null : color(d.id); });
                }

                function name(d) {
                  return d.parent
                      ? name(d.parent) + "." + d.name
                      : d.name;
                }

                // var cells = svg.selectAll('.cell')
                //     .data(treemap)
                //     .enter()
                //     .append('g')
                //     .attr('class', 'cell');

                // cells.append('rect')
                //     .attr('x', function(d) { return d.x; })
                //     .attr('y', function(d) { return d.y; })
                //     .attr('width', function(d) { return d.dx; })
                //     .attr('height', function(d) { return d.dy; })
                //     .attr('fill', function(d) { 
                //       console.log(d.categoryId);
                //       return d.children ? null : color(d.categoryId); })
                //     .attr('stroke', '#000');

                // cells.append('text')
                //     .attr('x', function (d) { return d.x + d.dx/2; })
                //     .attr('y', function (d) { return d.y + d.dy/2; })
                //     .attr('text-anchor', 'middle')
                //     .text(function(d) { return d.children ? null : d.categoryId; });

              }, 800); //was 200
            };//end scope.render function
          });//end .then()
      }}// end  link funct andreturn {}
  }]);//end directive function
}());