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