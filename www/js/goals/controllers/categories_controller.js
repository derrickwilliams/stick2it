(function() {

    angular.module('stick2it.goals')

      .controller('GoalsCategoriesController',[
        '$scope', '$http', 's2iUserData', 'userSettings', '$state', '$ionicLoading', '$ionicPopover', '$ionicPopup', '$timeout',

        function GoalsCategoriesController($scope, $http, userData, userSettings, $state, ionLoading, ionPopover, ionPopup, $timeout) {
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
              .fromTemplateUrl('js/goals/templates/categories/form_more_options.html', {
                scope: $scope
              })
              .then(optionsPopoverReady)
              .catch(optionsPopoverError);

            function optionsPopoverReady(popover) {
              $scope.optionsPopover = popover;
            }
            
            function optionsPopoverError(err) {
              console.log('options provider error', err);
            }
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
            newCategoryPopup = ionPopup.show();

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
                .then(handleSaveCategory);
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
              template: newCategoryPopupConfigTemplate(),
              title: 'Name?',
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
