
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

          .state('main.goals.categories.new', {
            url: '/categories/new',
            parent: 'main.goals',
            templateUrl: 'js/goals/templates/categories/form.html',
            controller: 'EditGoalsCategoryController'
          })

          .state('main.goals.categories.edit', {
            url: '/categories/:categoryId/edit',
            parent: 'main.goals',
            templateUrl: 'js/goals/templates/categories/form.html',
            controller: 'EditGoalsCategoryController'
          })

          //.state('main.goals.edit', {
          //  url: '/goals/:goalId/edit',
          //  parent: 'main.goals',
          //  templateUrl: 'js/goals/templates/goals/form.html'
          //})

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
          });


      }]);

})(angular);


/* goals/controllers/categories_controller.js */
(function() {

    angular.module('stick2it.goals')

      .controller('GoalsCategoriesController',[
        '$scope', '$http', 's2iUserData', 'userSettings', '$state', '$ionicLoading', '$ionicPopover', '$ionicPopup', '$timeout',

        function GoalsCategoriesController($scope, $http, userData, userSettings, $state, ionLoading, ionPopover, ionPopup, $timeout) {
          var newCategoryPopup;

          setupPopover();
          getGoals(userSettings);

          $scope.listEmpty = true;
          $scope.categories = [];

          $scope.showNewCategoryForm = function showNewCategoryForm() {
            setupEmptyCategory();
            showNewCategoryPopup();
          };

          $scope.addNewCategory = function addNewCategory(category) {
            userData.saveCategory(userSettings.id, category)
              .then(function() {
                return getGoals(userSettings)
                  .then(function() {
                    $scope.newCategoryModal.hide();
                  });
              });
          };

          $scope.goalCount = function countGoals(category) {
            return Object.keys(category.goals).length;
          };

          $scope.toggleOptionsPopover = function toggleOptionsPopover(e, state) {
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
          };

          function setupPopover() {
            ionPopover
              .fromTemplateUrl('js/goals/templates/categories/form_more_options.html', {
                scope: $scope
              })
              .then(function optionsPopoverReady(popover) {
                $scope.optionsPopover = popover;
              })
              .catch(function() {
                debugger
              });
          }

          function getGoals(settings) {
            return userData.goals(settings.id)
              .then(handleGoalData)
              .catch(handleGoalsError);
          }

          function handleGoalData(goals) {
            var list = [];
            angular.forEach(goals, function pushToList(data, key) {
              list.push(data);
            });

            $scope.listEmpty = list.length === 0 ? true : false;
            $scope.categories = list;
          }

          function handleGoalsError(err) {
            alert('there was an error in categories_controller');
          }

          function showNewCategoryPopup() {
            newCategoryPopup = ionPopup.show({
              template: '<form name="newCategoryForm">' +
              '<input type="text" autofocus name="goalName" ng-model="newCategory.name">' +
              '</form>',
              title: 'Name?',
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
              ]
            });

            newCategoryPopup
              .then(handleNewCategoryPopupResponse)
              .catch(function(err) {
                console.log('Something went wrong with the new category popup.', err);
                ionLoading.hide();
              });
          }

          function handleNewCategoryPopupResponse(response) {
            return response === false ? response : saveCategory(response);
          }

          function saveCategory(category) {
            $timeout(function finishSave() {

              return userData.saveCategory(userSettings.id, category)
                .then(function() {
                  return getGoals(userSettings)
                    .then(function() {
                      ionLoading.hide();
                    });
                });


            }, 750);
          }

          function setupEmptyCategory() {
            $scope.newCategory = {
              name: ''
            };
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

    var
      categoryId = $stateParams.categoryId,
      isEditing = angular.isDefined(categoryId),
      categoryGoals = [],
      listEmpty = false;

    setupPopover();
    loadData();

    $scope.addGoal = function addGoal() {

      $scope.goal = { name: '' };

      var goalNamePopup = ionPopup.show({
        template: '<form name="newGoalForm">' +
                    '<input type="text" autofocus name="goalName" ng-model="goal.name">' +
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

    };
    $scope.saveCategory = saveCategory;

    $scope.toggleOptionsPopover = function toggleOptionsPopover(e, state) {
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
    };

    function setupPopover() {
      ionPopover
        .fromTemplateUrl('js/goals/templates/categories/form_more_options.html', {
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


/* goals/controllers/tracking_controller.js */
(function(angular) {
  'use strict';

  angular.module('stick2it.goals')
    .controller('TrackingMainController', [
      '$scope',
      '$ionicActionSheet',

      function TrackingMainController($scope, $ionicActionSheet) {
        $scope.itemClasses = function itemClasses(listItem) {
          return {
            'item-divider': listItem.isDivider,
            'goal-item': !listItem.isDivider,
            'text-center': listItem.isDivider
          };
        };

        $scope.goalListItems = [
          {
            label: 'Work',
            isDivider: true
          },
          {
            label: 'First Item',
            breakdown: [1, 0, 1, -1, 1, null, null, 1, 0, 1, -1, 1, null, null]
          },
          {
            label: 'Another Item',
            breakdown: [1, 0, 1, -1, 1, null, null, 1, 0, 1, -1, 1, null, null]
          },
          {
            label: 'Home',
            isDivider: true
          },
          {
            label: 'First Item',
            breakdown: [1, 0, 1, -1, 1, null, null, 1, 0, 1, -1, 1, null, null]
          },
          {
            label: 'Another Item',
            breakdown: [1, 0, 0, -1, 1, null, null]
          },
          {
            label: 'First Item',
            breakdown: [1, 0, 1, -1, 1, null, null, 1, 0, 1, -1, 1, null, null]
          },
          {
            label: 'Another Item',
            breakdown: [1, 0, 1, -1, 1, null, null, 1, 0, 1, -1, 1, null, null]
          }
        ];

        $scope.handleBreakdown = function(breakdown) {
          console.log('handling breakdown selected', breakdown);
        };

        $scope.itemSelect = function itemSelect($event, item) {
          if (item.isDivider) {
            $event.preventDefault();
            $event.stopPropagation();
            return;
          }
          console.log('itemSelected', item);
        };

        $scope.itemHold = function itemHold($event, item) {
          var hideSheet = $ionicActionSheet.show({
            buttons: [
              {
                text: 'Track Today: Done',
                somethingElse: 'something'
              },
              { text: 'Track Today: Skip' }
            ],
            //destructiveText: 'Delete',
            //titleText: 'Modify your album',
            cancelText: 'Cancel',
            cancel: function() {
              console.log('action sheet cancel', arguments);
            },
            buttonClicked: function(index) {
              console.log('action sheet buttonClicked', arguments);
              return false;
            }
          });
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
        console.log('weeklyBreakdownDirective.controller', $scope);
        var selectedBreakdown;

        $scope.today = 4;

        $scope.onBreakdownSelect = function onBreakdownSelect(breakdownIndex) {
          console.log('onBreakdownSelect', breakdownIndex);
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
        console.log('weeklyBreakdownDirective.link', scope);
      }
    }
  }

})(angular);
