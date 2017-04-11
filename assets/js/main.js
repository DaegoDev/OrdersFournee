'use stric';

(function(){
  var fournee = angular.module('fournee',
    ['ui.router','permission', 'ngAnimate', 'ui.bootstrap', 'ngCookies']);

  // Angular filters
  fournee.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
  }
});
}());
