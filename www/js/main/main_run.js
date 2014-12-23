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