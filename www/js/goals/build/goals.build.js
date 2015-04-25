
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


/* goals/controllers/categories_controller.js */
(function() {

    angular.module('stick2it.goals')

      .controller('GoalsCategoriesController',[
        '$scope', '$http', 's2iUserData', 'userSettings', '$state',
        '$ionicLoading', '$ionicPopup', '$timeout',
        'categoryFormOptionsPopoverInitializer',

        function GoalsCategoriesController($scope, $http, userData, userSettings, $state,
          ionLoading, ionPopup, $timeout, formOptionsInitializer) {

          var newCategoryPopup;

          doSetup();

          $scope.listEmpty = true;
          $scope.categories = [];

          $scope.showNewCategoryForm = showNewCategoryForm;
          $scope.addNewCategory = addNewCategory;
          $scope.goalCount = countGoals;
          $scope.toggleOptionsPopover = toggleOptionsPopover;

          function doSetup() {
            setupPopover();
            getGoals(userSettings);
          }

          function showNewCategoryForm() {
            setupEmptyCategory();
            showNewCategoryPopup();
          }

          function addNewCategory(category) {
            userData.saveCategory(userSettings.id, category)
              .then(handleCategorySave);

            function handleCategorySave() {
              return getGoals(userSettings)
                .then(hideNewCategoryModal);
            }
          }

          function countGoals(category) {
            return Object.keys(category.goals).length;
          }

          function toggleOptionsPopover(e, state) {
            return $scope.formOptions.toggle(e);
          }

          function setupPopover() {
            var setupOptions = {
              scope: $scope
            };

            formOptionsInitializer.init(setupOptions)
              .then(storePopoverInstance)
              .catch(handleOptionsPopoverError);

            function storePopoverInstance(popover) {
              $scope.formOptions = popover;
            }

            function handleOptionsPopoverError(err) {
              console.log('options provider error', err);
              throw err;
            }
          }

          function getGoals(settings) {
            return userData.goals(settings.id)
              .then(handleGoalData)
              .catch(handleGoalsError);
          }

          function handleGoalData(goals) {
            var list = [];
            angular.forEach(goals, pushToList);

            $scope.listEmpty = list.length === 0 ? true : false;
            $scope.categories = list;

            function pushToList(data, key) {
              list.push(data);
            }
          }

          function handleGoalsError(err) {
            alert('there was an error in categories_controller');
          }

          function showNewCategoryPopup() {
            newCategoryPopup = ionPopup.show(newCategoryPopupConfig());

            newCategoryPopup
              .then(handleNewCategoryPopupResponse)
              .catch(newCategoryPopupError);

            function newCategoryPopupError(err) {
              console.log('Something went wrong with the new category popup.', err);
              ionLoading.hide();
            }
          }

          function handleNewCategoryPopupResponse(response) {
            return response === false ? response : saveCategory(response);
          }

          function saveCategory(category) {
            $timeout(finishSave, 750);

            function finishSave() {
              return userData.saveCategory(userSettings.id, category)
                .then(handleCategorySave);
            }

            function handleCategorySave() {
              return getGoals(userSettings)
                .then(hideLoadingMessage);
            }
          }

          function setupEmptyCategory() {
            $scope.newCategory = {
              name: ''
            };
          }

          function hideNewCategoryModal() {
            $scope.newCategoryModal.hide();
          }

          function hideLoadingMessage() {
            ionLoading.hide();
          }

          function newCategoryPopupConfig() {
            return {
              title: 'Category Name',
              template: newCategoryPopupConfigTemplate(),
              scope: $scope,
              buttons: newCategoryPopupConfigButtons()
            };
          }

          function newCategoryPopupConfigTemplate() {
            return '<form name="newCategoryForm">' +
              '<input type="text" autofocus name="goalName" ng-model="newCategory.name">' +
              '</form>';
          }

          function newCategoryPopupConfigButtons() {
            return [
              {
                text: 'Cancel',
                onTap: function onCancelTap(e) {
                  return false;
                }
              },
              {
                text: '<b>Save</b>',
                type: 'button-positive',
                onTap: onAddTap
              }
            ];

            function onAddTap(e) {
              if ($scope.newCategory.name) {
                ionLoading.show({
                  template: 'Adding category...'
                });

                return $scope.newCategory;
              }
              else {
                e.preventDefault();
              }
            }
          }
        }
      ]);



})(angular);


/* goals/controllers/edit_goals_category_controller.js */
(function(angular) {

  angular.module('stick2it.goals')
    .controller('EditGoalsCategoryController', [
      '$scope',
      '$timeout',
      '$state',
      '$stateParams',
      'stick2itUtils',
      's2iUserData',
      'userSettings',
      '$ionicPopup',
      '$ionicPopover',
      '$ionicLoading',
      EditGoalsCategoryController]);

  function EditGoalsCategoryController($scope, $timeout, $state, $stateParams,
    s2iUtils, userData, userSettings, ionPopup, ionPopover, ionLoading) {

    var categoryId = $stateParams.categoryId,
        isEditing = angular.isDefined(categoryId),
        categoryGoals = [],
        listEmpty = false;

    setupPopover();
    loadData();

    $scope.addGoal = addGoal;
    $scope.saveCategory = saveCategory;
    $scope.toggleOptionsPopover = toggleOptionsPopover;

    function addGoal() {

      $scope.goal = { name: '' };

      var goalNamePopup = ionPopup.show({
        template: '<form name="newGoalForm">' +
                    '<input type="text" autofocus name="goalName" ng-model="goal.name">' +
                    '<input type="checkbox" name="multipartGoal" ng-model="goal.isMultipart" />' +
                      '<label for="multipartGoal">mulipart goal</label>' +
                  '</form>',
        title: 'What is your goal?',
        scope: $scope,

        buttons: [
          {
            text: 'Cancel',
            onTap: function onCancelTap(e) {
              return false;
            }
          },
          {
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function onAddTap(e) {
              if ($scope.goal.name) {
                ionLoading.show({
                  template: 'Adding goal...'
                });

                return $scope.goal;
              }
              else {
                e.preventDefault();
              }
            }
          }
        ]
      });

      goalNamePopup
        .then(handleNewGoalPopupResponse)
        .catch(function(err) {
          console.log('Something went wrong with the new goal popup.');
        });

    }

    function toggleOptionsPopover(e, state) {
      if (state === 'ON') {
        $scope.optionsPopover.show(e);
      }
      else if (state === 'OFF') {
        $scope.optionsPopover.hide(e);
      }
      else {
        console.log('Invalid popover state: [' + state + ']');
      }
      return;
    }

    function setupPopover() {
      ionPopover
        .fromTemplateUrl('js/goals/templates/categories/category_details_options.html', {
          scope: $scope
        })
        .then(function optionsPopoverReady(popover) {
          $scope.optionsPopover = popover;
        });
    }

    function handleNewGoalPopupResponse(response) {
      return response === false ? response : saveGoal(response);
    }

    function saveGoal(goal) {
      goal.category = categoryId;

      $timeout(function () {
        userData.saveGoal(userSettings.id, goal)
          .then(function() {
            return refreshGoalList();
          })
          .then(function() {
            ionLoading.hide();
          });
      }, 750, goal); // let the loading stay up for minimum amount of time
    }

    function loadData() {
      return userData.getCategory(userSettings.id, categoryId)
        .then(function(categoryData) {
          $scope.category = categoryData;
          $scope.goals = categoryData.goals;
          $scope.listEmpty = Object.keys($scope.goals).length === 0;
        })
        .catch(function(err) {
          var msg = 'There was an error while loading the category data: ' + err.message;
          alert(msg);
          goToCategoryList();
        });
    }

    function refreshGoalList() {
      return loadData();
    }

    function saveCategory(category) {
      userData.saveCategory(userSettings.id, category)
        .then(goToCategoryList);
    }

    function goToCategoryList() {
      $state.go('main.goals.categories');
    }
  }

})(angular);


/* goals/controllers/items_controller.js */
(function(angular) {
  'use strict';

  angular.module('stick2it.goals')
    .controller('ItemsController', [
      '$scope',
      '$stateParams',

      ItemsController
    ]);

  function ItemsController($scope, $stateParams) {
    
  }


})(angular);


/* goals/controllers/tracking_controller.js */
(function(angular) {
  'use strict';

  angular.module('stick2it.goals')
    .controller('TrackingMainController', [
      '$scope',
      '$ionicActionSheet',
      '$ionicListDelegate',

      function TrackingMainController($scope, $ionicActionSheet, $ionicListDelegate) {
        $scope.itemClasses = function itemClasses(listItem) {
          return {
            'item-divider': listItem.isDivider,
            'goal-item': !listItem.isDivider,
            'text-center': listItem.isDivider
          };
        };

        $scope.track = function(item, status) {
          console.log('tracking', item, status);
          $ionicListDelegate.closeOptionButtons();
        };

        $scope.isSwipable = function isSwipable(item) {
          console.log('isSwipable', item, !item.isDivider);
          return !item.isDivider;
        };

        $scope.goalListItems = [
          // {
          //   label: 'Work',
          //   isDivider: true
          // },
          {
            label: 'First Item',
            breakdown: [1, 0, 1, -1, 1, null, null, 1, 0, 1, -1, 1, null, null]
          },
          {
            label: 'Another Item',
            breakdown: [1, 0, 1, -1, 1, null, null, 1, 0, 1, -1, 1, null, null]
          },
          // {
          //   label: 'Home',
          //   isDivider: true
          // },
          {
            label: 'Some Other Thing',
            breakdown: [1, 0, 1, -1, 1, null, null, 1, 0, 1, -1, 1, null, null]
          }
        ];

        $scope.handleBreakdown = function(breakdown) {
          console.log('handling breakdown selected', breakdown);
        };
      }

    ]);

    function trackingData() {
      return {
        _1234: {
          name: 'Getting Things Done',
          category: {
            id: 'category1',
            label: 'Work Goals'
          },
          breakdown: {
            daily: [1, null, 1, null, 1, null, 0]
          }
        },

        _5678: {
          name: 'Crazy Stuff',
          category: {
            id: 'category2',
            label: 'Other Stuff'
          },
          breakdown: {
            daily: [1, null, 1, null, 1, null, 0]
          }
        }
      }
    }
})(angular);


/* goals/controllers/tracking_journal_controller.js */
(function(angular) {
  'use strict';

  angular.module('stick2it.goals')
    .controller('TrackingJournalController', [
      '$scope',
      '$ionicActionSheet',
      '$ionicListDelegate',

      function TrackingJournalController($scope, $ionicActionSheet, $ionicListDelegate) {

      }

    ]);

})(angular);


/* goals/directives/weekly_breakdown.js */
(function(angular) {

  angular.module('stick2it.goals')
    .directive('weeklyBreakdown', [weeklyBreakdownDirective]);

  function weeklyBreakdownDirective() {
    return {
      restrict: 'AE',
      templateUrl: 'js/goals/templates/tracking/weekly_breakdown_directive.html',
      scope: {
        breakdownData: '=breakdown',
        notifySelect: '&breakdownSelect'
      },
      controller: ['$scope', function weeklyBreakdownController($scope) {
        var selectedBreakdown;

        $scope.today = 4;

        $scope.onBreakdownSelect = function onBreakdownSelect(breakdownIndex) {
          $scope.selectedBreakdown = breakdownIndex;
          $scope.notifySelect({ breakdown: breakdownIndex });
        };

        $scope.isBreakdownToday = function isBreakdownToday(breakdownIndex) {
          return breakdownIndex === $scope.today;
        };

        $scope.breakdownLabel = function breakdownLabel(index) {
          return ['s', 'm', 't', 'w', 't', 'f', 's'][index];
        };

        $scope.breakdownIcon = function breakdownIcon(breakdown) {
          if (breakdown === 1) return 'ion-checkmark-round';
          if (breakdown === 0) return 'ion-close-round';
          if (breakdown === -1 || breakdown === null) return 'ion-minus-round';
        };

        $scope.breakdownColor = function breakdownColor(value) {
          if (value === 1) return '#66cc33';
          if (value === 0) return '#ef4e3a';
          if (value === -1) return '#444';
          if (value === null) return '#ebebeb';
        };

      }],
      link: function weeklyBreakdownLink(scope, el, attr) {
      }
    }
  }

})(angular);


/* goals/services/category_form_options.js */
(function(angular) {

  angular.module('stick2it.goals')
    .service('categoryFormOptionsPopoverInitializer', [
      '$q',
      '$ionicPopover',
      'categoryFormOptionsPopover',
      CategoryFormOptionsPopoverInitializer
    ])
    .service('categoryFormOptionsPopover', [
      CategoryFormOptionsPopover
    ]);

  function CategoryFormOptionsPopoverInitializer($q, $ionicPopover, formOptions) {
    var self = {};

    self.init = init;

    return self;

    function init(params) {
      var deferred = $q.defer();

      $ionicPopover
        .fromTemplateUrl('js/goals/templates/categories/category_list_options.html', {
          scope: params.scope
        })
        .then(function returnPopoverInstance(popover) {
          return deferred.resolve(formOptions.create(popover));
        })
        .catch(newCategoryPopoverError);

      return deferred.promise;

      function newCategoryPopoverError(err) {
        console.log('options provider error', err);
        throw err;
      }
    }
  }

  function CategoryFormOptionsPopover() {
    var self = {};

    self.create = createPopover;

    return self;

    function createPopover(ionicPopoverInstance) {
      return CategoryFormOptionsPopoverConstructor(ionicPopoverInstance);
    }
  }

  function CategoryFormOptionsPopoverConstructor(ionicPopoverInstance)  {
    var self = {}, popover = ionicPopoverInstance;

    self.toggle = toggle;
    self.show = show;
    self.hide = hide;

    return self;

    function toggle(e) {
      return popover.isShown() ? hide() : show(e);
    }

    function show(e) {
      return popover.show(e);
    }

    function hide() {
      return popover.hide();
    }
  }

})(angular);
