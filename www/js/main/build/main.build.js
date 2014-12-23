
/* main/main.js */
(function(angular) {

  angular.module('stick2it', [
    'ionic',
    'stick2it.goals',
    'stick2it.services',
    'ngCordova',
    'firebase'
  ]);

})(angular);

/* main/main_config.js */
(function(angular) {

  angular.module('stick2it')
    .config([
      '$stateProvider', '$urlRouterProvider',

      function moduleRun($stateProvider, $urlRouterProvider) {
        $stateProvider

          .state('main', {
            url: '/main',
            abstract: true,
            templateUrl: 'js/main/templates/menu.html',
            controller: 'MainController',
            resolve: {
              userSettings: ['s2iUserData', function userDataResolve(userData) {

                return userData.settings()
                  .catch(handleSettingsError);

                function handleSettingsError(err) {
                  var settingsError = new Error('NOT_SETUP');
                  settingsError.innerError = err;
                  throw settingsError;
                }

              }]
            }
          })

          .state('main.profile', {
            url: '/profile',
            views: {
              'menuContent' :{
                templateUrl: 'js/main/templates/profile.html',
                controller: 'ProfileController'
              }
            }

          })

          .state('setup', {
            url: '/setup',
            templateUrl: 'js/main/templates/setup.html',
            controller: 'SetupController'
          });

        $urlRouterProvider.otherwise('/main/profile');
      }
    ]);

})(angular);

/* main/main_run.js */
(function(angular) {

  angular.module('stick2it')
    .run([
      '$ionicPlatform', '$rootScope', '$location', '$state',

      function moduleRun($ionicPlatform, $rootScope, $location, $state) {
        $ionicPlatform.ready(ionicPlatformReady);

        $rootScope.$on('$stateChangeError', stateChangeError);
        $rootScope.$on('$stateChangeStart', stateChangeStart);

        $rootScope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams){
          console.log('$stateChangeSuccess to '+toState.name+'- fired once the state transition is complete.');
        });
        $rootScope.$on('$stateNotFound',function(event, unfoundState, fromState, fromParams){
          console.log('$stateNotFound '+unfoundState.to+'  - fired when a state cannot be found by its name.');
          console.log(unfoundState, fromState, fromParams);
        });



        function ionicPlatformReady() {
          if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
          }
          if(window.StatusBar) {
            StatusBar.styleDefault();
          }
        }

        function stateChangeError(event, toState, toParams, fromState, fromParams, error) {
          event.preventDefault();
          if (error.message === 'NOT_SETUP') {
            console.log('App not setup yet. Redirecting to setup form.');
            $state.go('setup');
          }
        }

        function stateChangeStart(event, toState, toParams, fromState, fromParams) {
          console.log('$stateChangeStart', arguments);
        }

      }
    ]);

})(angular);

/* main/controllers/main_controller.js */
(function(angular) {

  var app = angular.module('stick2it');

  app.controller('MainController', [
    '$scope',
    function MainController($scope) {
      console.log('main controller');
      $scope.msg = 'Main Controller message';
    }
  ]);

})(angular);

/* main/controllers/profile_controller.js */
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

/* main/controllers/setup_controller.js */
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