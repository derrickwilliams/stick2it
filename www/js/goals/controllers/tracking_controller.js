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
