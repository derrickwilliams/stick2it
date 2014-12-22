(function(angular) {

  var app = angular.module('stick2it');

  app.controller('SetupController', [
    '$scope', '$window', 'stick2itDb', 

    function SetupController($scope, $window, db) {

      $scope.settings = {
        name: '',
        email: '',
        startDate: undefined
      };

      $scope.saveSettings = function saveSettings() {
        console.log('storing settings', $scope.settings);
        db.store('settings', $scope.settings)
          .then(goToProfile);
      };

      function goToProfile() {
        $location.path('/main/profile');
      }

    }

  ]);

})(angular);