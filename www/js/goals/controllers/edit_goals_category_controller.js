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
