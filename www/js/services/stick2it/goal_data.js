(function(angular) {

  angular.module('stick2it.goals')

    .factory('s2iGoalData', [
      '$window', 'bluebird', 'stick2itUtils',
      s2iGoalData
    ]);

  function s2iGoalData($window, Promise, s2iUtils) {
    var self;

    self = {
      tasks: tasks
    };

    function tasks() {

    }
  }

})(angular);
