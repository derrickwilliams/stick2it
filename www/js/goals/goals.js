(function(angular) {

  angular
    .module('stick2it.goals', ['ionic', 'stick2it.services'])

    .config([
      '$stateProvider', '$urlRouterProvider',

      function($stateProvider, $urlRouterProvider) {

        $stateProvider
          .state('main.goals', {
            url: '/goals',
            abstract: true,
            parent: 'main',
            views: {
              menuContent: {
                template: '<ion-nav-view name="page"></ion-nav-view>'
              }
            }
          })
          .state('main.goals.categories', {
            url: '/categories',
            views: {
              page: {
                templateUrl: 'js/goals/templates/categories/list.html',
                controller: 'GoalsCategoriesController'
              }
            }
          })
          .state('main.goals.categories.new', {
            url: '/categories/new',
            parent: 'main.goals',
            views: {
              page: {
                templateUrl: 'js/goals/templates/categories/form.html',
                controller: 'EditGoalsCategoryController'
              }
            },
            data: {
              context: 'NEW'
            }
          })

          .state('main.goals.categories.edit', {
            url: '/categories/:categoryId/edit',
            parent: 'main.goals',
            views: {
              page: {
                templateUrl: 'js/goals/templates/categories/form.html',
                controller: 'EditGoalsCategoryController'
              }
            },
            data: {
              context: 'EDIT'
            }
          });

      }]);

})(angular);