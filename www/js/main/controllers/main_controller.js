(function(angular) {

  var app = angular.module('stick2it');

  app.controller('MainController', [
    '$scope',
    function MainController($scope) {
      $scope.msg = 'Main Controller message';
    }
  ]);

})(angular);
