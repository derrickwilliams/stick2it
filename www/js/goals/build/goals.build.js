
/* goals/goals.js */
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
                template: '<div ui-view="page"></div>'
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
                templateUrl: 'js/goals/templates/categories/form.html'
              }
            },
            data: {
              context: 'EDIT'
            }
          });

      }]);

})(angular);

/* goals/controllers/categories_controller.js */
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


/* goals/controllers/edit_goals_category_controller.js */
(function(angular) {

  angular.module('stick2it.goals')
    .controller('EditGoalsCategoryController', [
      '$scope',
      '$state',
      'stick2itUtils',
      EditGoalsCategoryController]);

  function EditGoalsCategoryController($scope, $state, s2iUtils) {
    $scope.formTitle = getFormTitle($state.$current.data.context);

    $scope.category = {
      name: ''
    };

    $scope.saveCategory = saveCategory;

    function saveCategory(category) {
      db.store('category', category);
    }
  }

  function getFormTitle(context) {
    switch(context) {
      case 'NEW':
        return 'New Category';
      case 'EDIT':
        return 'Editing Category';
      default:
        return "You're doing something with goal categories";
    }
  }

})(angular);