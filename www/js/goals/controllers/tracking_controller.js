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
