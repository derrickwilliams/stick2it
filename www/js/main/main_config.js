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
              menuContent :{
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
