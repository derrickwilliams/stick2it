(function(angular) {
  'use strict';

  angular.module('stick2it.services')
    .factory('bluebird', ['$window', function ($window) {
      return $window.Promise;
    }]);

})(angular);