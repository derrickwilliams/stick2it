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
