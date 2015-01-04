(function(angular) {
  angular.module('pickadate.utils', [])

    .factory('pickadateUtils.indexOf', [pickadateUtilsIndexOf])
    .factory('pickadateUtils.errors', [pickadateUtilsErrors])
    .factory('pickadateUtils', ['dateFilter', pickadateUtils]);

  function pickadateUtils(dateFilter) {

    return {
      isDate: isDate,
      stringToDate: stringToDate,
      dateRange: dateRange
    };

    function isDate(obj) {
      return Object.prototype.toString.call(obj) === '[object Date]';
    }

    function stringToDate(dateString) {
      if (this.isDate(dateString)) return new Date(dateString);
      var dateParts = dateString.split('-'),
        year  = dateParts[0],
        month = dateParts[1],
        day   = dateParts[2];

      // set hour to 3am to easily avoid DST change
      return new Date(year, month - 1, day, 3);
    }

    function dateRange(first, last, initial, format) {
      var date, i, _i, dates = [];

      if (!format) format = 'yyyy-MM-dd';

      for (i = _i = first; first <= last ? _i < last : _i > last; i = first <= last ? ++_i : --_i) {
        date = this.stringToDate(initial);
        date.setDate(date.getDate() + i);
        dates.push(dateFilter(date, format));
      }
      return dates;
    }

  }

  function pickadateUtilsIndexOf() {
    return [].indexOf || function indexOfShim(item) {
      for (var i = 0, l = this.length; i < l; i++) {
        if (i in this && this[i] === item) return i;
      }
      return -1;
    };
  }

  function pickadateUtilsErrors() {
    var self;

    self = {
      create: createError,
      throw: throwError
    };

    return self;

    function createError(msg, inner) {
      var newErr = new Error(msg);
      if (inner) newErr.innerError = inner;
      return newError;
    }

    function throwError(msg, inner) {
      throw self.createError(msg, inner);
    }
  }

})(angular);
