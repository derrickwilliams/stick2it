(function(angular) {

  angular.module('stick2it.services')
    .service('s2iUserData', [

      '$window', 'bluebird',

      function s2iUserDataService($window, Promise) {
        var storage = $window.localStorage;

        return {
          settings: settings,
          saveSettings: saveSettings,
          goals: goals,
          saveCategory: saveCategory,
          saveGoal: saveGoal
        };

        function settings() {
          return get('s2i-user', 'settings')
            .then(function getDeferred(settings) {
              if (settings === null) {
                throw new Error('Could not find user settings.');
              }

              return settings;
            });
        }

        function goals(userId) {
          return get(userId, 'data')
            .then(postProcess);

          function postProcess(data) {
            return dataEmpty(data) ? saveEmptyData(userId) : data;
          }
        }

        function saveCategory(userId, categoryData) {
          if (!categoryData.id) {
            categoryData = initNewCategory(categoryData);
          }

          return goals(userId)
            .then(updateCategory)
            .then(saveIt);

          function updateCategory(data) {
            data[categorData.id] = categoryData;
            return data;
          }

          function saveIt(data) {
            saveData(userId, data);
          }
        }

        function saveGoal(userId, goalData) {
          var
            data = goals(userId),
            categoryId = goalData.category;

          goalData.id = goalData.id || s2iUtils.makeGuid();

          if (!categoryId) { // handle uncategorized goals
            goalData.category = 'NO_CATEGORY';
            data.NO_CATEGORY = data.NO_CATEGORY || initNoCategory();
          }

          data[categoryId].goals[goalData.id] = goalData;

          return saveData(userId, data);
        }

        function saveSettings(value) {
          return save('s2i-user', 'settings', value);
        }

        function saveData(id, data) {
          return save(id, 'data', data);
        }

        function save(id, suffix, data) {
          return new Promise(function saveDeferred(resolve, reject) {
            var
              key = formatKey(id, suffix);

            data = dataEmpty(data) ? data : JSON.stringify(data);
            resolve(storage.setItem(key, data));
          });
        }

        function get(id, suffix) {
          return new Promise(function getDeferred(resolve, reject) {
            var
              key = formatKey(id, suffix),
              data = storage.getItem(key);

            data = dataEmpty(data) ? data : JSON.parse(data);
            resolve(data);
          });
        }

        function saveEmptyData(userId) {
          return saveData(userId, {});
        }

        function formatKey(id, suffix) {
          return id + '-' + suffix;
        }

        function initNewCategory(newCategory, allData) {
          var newId = s2iUtils.makeGuid();

          verifyUniqueCategoryId(newId, allData);

          newCategory.id = newId;
          newCategory.goals = {};

          return newCategory;
        }

        function verifyUniqueCategoryId(id, data) {
          if (data[id]) throw new Error('Duplicate category ID');
        }

        function dataEmpty(data) {
          return data === null || data === undefined;
        }

        function initNoCategory() {
          return {
            id: 'NO_CATEGORY',
            label: 'Uncategorized',
            goals: {}
          };
        }
      }
    ]);

})(angular);