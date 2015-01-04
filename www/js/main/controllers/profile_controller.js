(function(angular) {

  var app = angular.module('stick2it');

  app.controller('ProfileController', [

    '$scope', '$ionicPopup', '$ionicPopover', '$state', 's2iUserData', 'userSettings',

    function ProfileController($scope, ionPopup, ionPopover, $state, userData, userSettings) {

      setupOptionsMenu();

      $scope.settings = userSettings;
      $scope.clearSettings = function clearSettings(e) {
        var confirmPopup = ionPopup.confirm({
           title: 'Clear Settings',
           template: 'Are you sure you want to clear your settings? This cannot be undone.'
        });

        confirmPopup.then(function handleConfirmationChoice(confirmed) {
          if (!confirmed) return;

          return userData.saveSettings({})
            .then(goToSetup);
        });
      };

      $scope.toggleProfileOptions = function toggleProfileOptions(e) {
        if ($scope.optionsPopover.isShown()) {
          $scope.optionsPopover.hide(e);
        }
        else {
          $scope.optionsPopover.show(e);
        }
      };

      function setupOptionsMenu() {
        $scope.optionsPopover = null;
        ionPopover
          .fromTemplateUrl('js/main/templates/profile_options.html', {
            scope: $scope
          })
          .then(function optionsPopoverReady(popover) {
            $scope.optionsPopover = popover;
          });
      }

      function goToSetup() {
        $state.go('setup');
      }
    }
  ]);

})(angular);
