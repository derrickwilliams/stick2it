(function() {

    angular.module('stick2it.goals')

      .controller('GoalsCategoriesController',[
        '$scope', '$http', 's2iUserData', '$state',

        function GoalsCategoriesController($scope, $http, userData, $state) {
          $scope.categories = [];

          $scope.doHoldAction = function holdAction(a, b, c) {
            console.log('doHoldAction', a, b, c);
            debugger
          };

          userData.settings()
            .then(getGoals);

          function getGoals(settings) {
            userData.goals(settings.id)
              .then(handleGoalData)
              .catch(handleGoalsError);
          }

          function handleGoalData(goals) {
            var list = [];
            angular.forEach(goals, function pushToList(data, key) {
              list.push(data);
            });
            $scope.categories = list;
          }

          function handleGoalsError(err) {
            alert('there was an error in categories_controller');
          }
        }
      ]);



})(angular);
