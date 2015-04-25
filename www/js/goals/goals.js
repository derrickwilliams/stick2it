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
            views: {
              menuContent: {
                template: '<ion-nav-bar class="bar bar-positive">' +
                            '<ion-nav-back-button class="button-clear"><i class="icon ion-ios7-arrow-back"></i> Back</ion-nav-back-button>' +
                          '</ion-nav-bar>' +
                          '<ion-nav-view></ion-nav-view>'
              }
            }
          })

          .state('main.goals.categories', {
            url: '/categories',
            templateUrl: 'js/goals/templates/categories/list.html',
            controller: 'GoalsCategoriesController'
          })

          // .state('main.goals.categories.new', {
          //   url: '/categories/new',
          //   parent: 'main.goals',
          //   templateUrl: 'js/goals/templates/categories/form.html',
          //   controller: 'EditGoalsCategoryController'
          // })

          .state('main.goals.categories.edit', {
            url: '/categories/:categoryId/edit',
            parent: 'main.goals',
            templateUrl: 'js/goals/templates/categories/form.html',
            controller: 'EditGoalsCategoryController'
          })

          .state('main.goals.items', {
            url: '^/categories/items/:goalId/edit',
            templateUrl: 'js/goals/templates/goals/items.html',
            controller: 'ItemsController'
          })

          .state('main.tracking', {
            url: '/tracking',
            abstract: true,
            views: {
              menuContent: {
                template: '<ion-nav-bar class="bar bar-positive">' +
                            '<ion-nav-back-button class="button-clear"><i class="icon ion-ios7-arrow-back"></i> Back</ion-nav-back-button>' +
                          '</ion-nav-bar>' +
                          '<ion-nav-view></ion-nav-view>'
              }
            }
          })

          .state('main.tracking.today', {
            url: '/today',
            templateUrl: 'js/goals/templates/tracking/tracking.html',
            controller: 'TrackingMainController'
          })

          .state('main.tracking.journal', {
            url: '/journal',
            templateUrl: 'js/goals/templates/tracking/journal.html',
            controller: 'TrackingJournalController'
          });


      }]);

})(angular);
