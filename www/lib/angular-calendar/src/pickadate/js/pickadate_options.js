(function(angular) {

  angular.module('pickadate')
    .provider('pickadateOptions', pickadateOptionsProvider);


  function pickadateOptionsProvider() {
    var pickadateOptions;

    pickadateOptions = {
      dayNameFormat: 'SHORTDAY',
      todayDateFormat: 'yyyy-MM-dd',
      initialDateDefault: new Date(),
      minDate: new Date(1980, 1, 1),
      maxDate: new Date(3000, 1, 1)
    };

    this.set = setOption;

    this.$get = [pickadateOptionsProvider];

    function pickadateOptionsProvider() {
      return PickadateOptions(pickadateOptions);
    }

    function setOption(name, value) {
      if (value === undefined) return;
      //if (!validOption(name)) return;
      pickadateOptions[name] = value;
    }
  }

  function PickadateOptions(pickadateOptions) {
    return pickadateOptions;
  }

})(angular);
