(function(angular) {

  var app = angular
    .module('stick2it', ['ionic', 'stick2it.goals', 'stick2it.services', 'ngCordova', 'firebase']);

  app.run(['$ionicPlatform', '$rootScope', function($ionicPlatform, $rootScope) {
      $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if(window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleDefault();
        }
      });

      $rootScope.$on('$stateChangeError', function() {
        console.log('$stateChangeError', arguments);
      });

      $rootScope.$on('$stateChangeStart', function() {
        console.log('$stateChangeStart', arguments);
      });

    }])


    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
      
      $stateProvider
        
        .state('main', {
          url: '/main',
          abstract: true,
          templateUrl: 'js/main/templates/menu.html',
          controller: 'MainController',
          resolve: {
            checkSetup: ['$location', '$q', function($location, $q) {
              var deferred = $q.defer();

              if (true) {
                deferred.reject('You no good');
              }

              return deferred.promise;
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

        .state('main.setup', {
          url: '/setup',
          views: {
            'menuContent' :{
              templateUrl: 'js/main/templates/setup.html',
              controller: 'SetupController'
            }
          }
        
        });

      $urlRouterProvider.otherwise('/main/profile');

    }]);

})(angular);