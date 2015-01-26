(function(angular) {

  angular.module('stick2it.goals')
    .service('categoryFormOptionsPopoverInitializer', [
      '$q',
      '$ionicPopover',
      'categoryFormOptionsPopover',
      CategoryFormOptionsPopoverInitializer
    ])
    .service('categoryFormOptionsPopover', [
      CategoryFormOptionsPopover
    ]);

  function CategoryFormOptionsPopoverInitializer($q, $ionicPopover, formOptions) {
    var self = {};

    self.init = init;

    return self;

    function init(params) {
      var deferred = $q.defer();

      $ionicPopover
        .fromTemplateUrl('js/goals/templates/categories/form_more_options.html', {
          scope: params.scope
        })
        .then(function returnPopoverInstance(popover) {
          return deferred.resolve(formOptions.create(popover));
        })
        .catch(newCategoryPopoverError);

      return deferred.promise;

      function newCategoryPopoverError(err) {
        console.log('options provider error', err);
        throw err;
      }
    }
  }

  function CategoryFormOptionsPopover() {
    var self = {};

    self.create = createPopover;

    return self;

    function createPopover(ionicPopoverInstance) {
      return CategoryFormOptionsPopoverConstructor(ionicPopoverInstance);
    }
  }

  function CategoryFormOptionsPopoverConstructor(ionicPopoverInstance)  {
    var self = {}, popover = ionicPopoverInstance;

    self.toggle = toggle;
    self.show = show;
    self.hide = hide;

    return self;

    function toggle(e) {
      return popover.isShown() ? hide() : show(e);
    }

    function show(e) {
      return popover.show(e);
    }

    function hide() {
      return popover.hide();
    }
  }

})(angular);
