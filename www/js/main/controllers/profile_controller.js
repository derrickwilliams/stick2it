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