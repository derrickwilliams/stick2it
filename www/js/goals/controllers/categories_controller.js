(function() {

    angular.module('stick2it.goals')

      .controller('GoalsCategoriesController',[
        '$scope', '$http', 'stick2itDb',

        function GoalsCategoriesController($scope, $http, db) {
          var
            userSettings;

          db.loadSettings()
            .then(function storeSettings(settings) {
              debugger
              userSettings = settings;
              console.log('users settings loaded', settings);
            })
            .catch(function handleLoadError(err) {
              debugger
              console.log('ERROR', err);
              throw err;
            });

        }
      ]);



})(angular);
