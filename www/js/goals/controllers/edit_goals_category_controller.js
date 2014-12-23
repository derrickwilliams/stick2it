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