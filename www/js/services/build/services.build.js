(function() {

  var app = angular.module('stick2it.services', []);

  app

  .service('Firebase', ['$window', function FirebaseService($window) {
    return $window.Firebase;
  }])

  .service('stick2itLocalStore', ['$window', function($window) {

    var store = $window.localStorage;

    return {
      store: function localStore(key, value) {
        store.setItem(key, JSON.stringify(value));
      },
      get: function localGet(key) {
        return JSON.parse(store.getItem(key));
      }
    };

  }])

  .service('stick2itDb', ['$q', '$window', function stick2itDbService($q, $window) {

      var 
        localStore = $window.localStorage,
        db;

      db = {
        loadSettings: loadSettings,
        store: store,
        get: dbGet
      };

      return db;

      function loadSettings() {
        var settings = localStore.getItem('settings');
        
        if (!settings || !settings.email || !settings.name || !settings.startDate) {
          return reject({ notSetup: true });
        }
        else {
          return resolve(settings);
        }
      }

      function dbStore(key, data) {
        localStore.setItem(key, JSON.stringify(data));
        return resolve(dbGet(key));
      }

      function dbGet(key) {
        var item = localStore.getItem(key);
        item = item === null ? item : JSON.parse(item);
        return resolve(item);
      }

      function resolve(val) {
        return $q.defer().resolve(val);
      }

      function reject(val) {
        return $q.reject(val);
      }

    }]);

})(angular);