//To avoid global d3 variable we use dependency injection in Angular, this is a factory 
//containing the d3 code. Declare the d3 variable before copying the d3 source in order 
//to prevent creation of global variable.
//Now we can inject d3 into our code by adding it to the dependency array of our 
//module in app.js file.
(function () { 
  angular.module('d3', [])
  .factory('d3', ['$document', '$window', '$q', '$rootScope',
    function($document, $window, $q, $rootScope) {
      var d = $q.defer(),
          d3service = {
            d3: function() { return d.promise; }
          };
    function onScriptLoad() {
      // Load client in the browser
      $rootScope.$apply(function() { d.resolve($window.d3); });
    }
    var scriptTag = $document[0].createElement('script');
    scriptTag.type = 'text/javascript'; 
    scriptTag.async = true;
    scriptTag.src = 'http://d3js.org/d3.v3.min.js';
    scriptTag.onreadystatechange = function () {
      if (this.readyState == 'complete') onScriptLoad();
    }
    scriptTag.onload = onScriptLoad;
   
    var s = $document[0].getElementsByTagName('body')[0];
    s.appendChild(scriptTag);
    
    return d3service;
  }]);
}());