(function(angular) {

  angular
    .module('stick2it.goals', ['ionic'])

    .config([
      '$stateProvider', '$urlRouterProvider',

      function($stateProvider, $urlRouterProvider) {

        $stateProvider
          .state('main.goals', {
            url: '/goals',
            views: {
              menuContent: {
                templateUrl: 'js/goals/templates/categories.html',
                controller: 'GoalCategoriesController'
              }
            }
          })
          .state('main.goals.category', {
            url: '/:category_id',
            views: {
              menuContent: {
                templateUrl: 'js/goals/templates/list.html'
              }
            }
          });

      }]);

})(angular);
(function() {

    angular.module('stick2it.goals')

      .controller('GoalCategoriesController',[
        '$scope', '$http',

        function GoalCategoriesController($scope, $http) {
          
          $scope.categories = [{ name: 'hey you' }, { name: 'Whatcha doin?' }];
        }
      ]);

        

})(angular);
