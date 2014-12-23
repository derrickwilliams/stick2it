(function(angular) {

  angular.module('stick2it.services')
    .service('stick2itUtils', [stick2itUtilsService]);

  function stick2itUtilsService() {
    return {
      makeGuid: makeGuid
    };
  }

  function makeGuid() {
    // source: http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function crazyRandomness(c) {
      var
        r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);

      return v.toString(16);
    });
  }

})(angular);