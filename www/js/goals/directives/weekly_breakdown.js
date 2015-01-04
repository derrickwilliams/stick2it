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
