(function(angular) {

  angular.module('pickadate.demo', ['pickadate'])

    .config(['pickadateOptionsProvider', function(pickadateOptionsProvider) {

    }])

    .controller('DemoController', ['$scope', function($scope) {
      $scope.currentDate = new Date();
    }]);

})(angular);
