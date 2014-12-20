(function() {

    angular.module('stick2it.goals')

      .controller('GoalCategoriesController',[
        '$scope', '$http',

        function GoalCategoriesController($scope, $http) {
          
          $scope.categories = [{ name: 'hey you' }, { name: 'Whatcha doin?' }];
        }
      ]);

        

})(angular);
