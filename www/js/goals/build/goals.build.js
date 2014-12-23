
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

/* goals/controllers/categories_controller.js */
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


/* goals/controllers/edit_goals_category_controller.js */
(function(angular) {

  angular.module('stick2it.goals')
    .controller('EditGoalsCategoryController', [
      '$scope',
      '$state',
      'stick2itUtils',
      's2iUserData',
      'userSettings',
      EditGoalsCategoryController]);

  function EditGoalsCategoryController($scope, $state, s2iUtils, userData, userSettings) {
    $scope.formTitle = getFormTitle($state.$current.data.context);

    $scope.category = {
      name: ''
    };

    $scope.saveCategory = saveCategory;

    function saveCategory(category) {
      userData.saveCategory(userSettings.id, category)
        .then(goToCategoryList);
    }

    function goToCategoryList() {
      $state.go('main.goals.categories');
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