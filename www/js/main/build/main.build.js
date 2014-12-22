(function(angular) {

  var app = angular
    .module('stick2it', ['ionic', 'stick2it.goals', 'stick2it.services', 'ngCordova', 'firebase']);

  app.run(['$ionicPlatform', '$rootScope', '$location', function moduleRun($ionicPlatform, $rootScope, $location) {
      
      $ionicPlatform.ready(ionicPlatformReady);

      $rootScope.$on('$stateChangeError', stateChangeError);
      $rootScope.$on('$stateChangeStart', stateChangeStart);

      function ionicPlatformReady() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if(window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleDefault();
        }
      }

      function stateChangeError(ev, toState, toParams, fromState, fromParams, error) {
        if (error.notSetup) {
          $location.path('/setup');
        }

        console.log('$stateChangeError', arguments);
      }

      function stateChangeStart(event, toState, toParams, fromState, fromParams) {
        console.log('$stateChangeStart', arguments);
      }

    }])


    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
      
      $stateProvider
        
        .state('main', {
          url: '/main',
          abstract: true,
          templateUrl: 'js/main/templates/menu.html',
          controller: 'MainController',
          resolve: {
            checkSetup: ['$location', '$q', 'stick2itDb', function checkSetup($location, $q, db) {
              debugger
              return db.loadSettings();
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

    }]);

})(angular);
(function(angular) {

  var app = angular
    .module('stick2it', ['ionic', 'stick2it.goals', 'stick2it.services', 'ngCordova', 'firebase']);

  app.run(['$ionicPlatform', '$rootScope', '$location', function moduleRun($ionicPlatform, $rootScope, $location) {
      
      $ionicPlatform.ready(ionicPlatformReady);

      $rootScope.$on('$stateChangeError', stateChangeError);
      $rootScope.$on('$stateChangeStart', stateChangeStart);

      function ionicPlatformReady() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if(window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleDefault();
        }
      }

      function stateChangeError(ev, toState, toParams, fromState, fromParams, error) {
        if (error.notSetup) {
          $location.path('/setup');
        }

        console.log('$stateChangeError', arguments);
      }

      function stateChangeStart(event, toState, toParams, fromState, fromParams) {
        console.log('$stateChangeStart', arguments);
      }

    }])


    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
      
      $stateProvider
        
        .state('main', {
          url: '/main',
          abstract: true,
          templateUrl: 'js/main/templates/menu.html',
          controller: 'MainController',
          resolve: {
            checkSetup: ['$location', '$q', 'stick2itDb', function checkSetup($location, $q, db) {
              debugger
              return db.loadSettings();
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

    }]);

})(angular);
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
(function(angular) {

  var app = angular.module('stick2it');

  app.controller('ProfileController', [
    
    '$scope', '$http', 'Firebase', '$firebase',
    
    function ProfileController($scope, $http, Firebase, $firebase) {
      var 
        ref = new Firebase('https://stick2it.firebaseio.com/settings/heather4328'),
        repoLive = $firebase(ref),
        source = repoLive.$asObject();

      source.$bindTo($scope, 'settings');
    }
  ]);

})(angular);
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
(function(angular) {

  var app = angular.module('stick2it');

  app.controller('ProfileController', [
    
    '$scope', '$http', 'Firebase', '$firebase',
    
    function ProfileController($scope, $http, Firebase, $firebase) {
      var 
        ref = new Firebase('https://stick2it.firebaseio.com/settings/heather4328'),
        repoLive = $firebase(ref),
        source = repoLive.$asObject();

      source.$bindTo($scope, 'settings');
    }
  ]);

})(angular);
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