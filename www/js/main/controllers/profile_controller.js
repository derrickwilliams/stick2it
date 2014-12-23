(function(angular) {

  var app = angular.module('stick2it');

  app.controller('ProfileController', [

    '$scope', '$ionicPopup', '$state', 's2iUserData', 'userSettings',

    function ProfileController($scope, popup, $state, userData, userSettings) {

      $scope.settings = userSettings;
      $scope.clearSettings = function clearSettings() {
        var confirmPopup = popup.confirm({
           title: 'Clear Settings',
           template: 'Are you sure you want to clear your settings? This cannot be undone.'
         });

        confirmPopup.then(function handleConfirmationChoice(confirmed) {
          if (!confirmed) return;

          return userData.saveSettings({})
            .then(goToSetup);
        });
      };

      function goToSetup() {
        $state.go('setup');
      }
    }
  ]);

})(angular);