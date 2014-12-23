(function(angular) {

  var app = angular.module('stick2it');

  app.controller('SetupController', [
    '$scope', '$state', 's2iUserData', 'stick2itUtils',

    function SetupController($scope, $state, userData, s2iUtils) {
      $scope.settings = {
        name: '',
        email: '',
        startDate: undefined
      };

      $scope.saveSettings = function saveSettings() {
        $scope.settings.id = s2iUtils.makeGuid();
        userData.saveSettings($scope.settings)
          .then(goToProfile);
      };

      function goToProfile() {
        return $state.go('main.profile');
      }

    }

  ]);

})(angular);