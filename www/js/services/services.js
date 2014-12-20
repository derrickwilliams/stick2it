(function() {

  var app = angular.module('stick2it.services', []);

  app.service('Firebase', ['$window', function FirebaseService($window) {
    return $window.Firebase;
  }]);

})(angular);