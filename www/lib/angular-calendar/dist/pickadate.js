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

;(function(angular){

  angular
    .module('pickadate', [
      'pickadate.templates', 'pickadate.utils'
    ]);

})(window.angular);

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

(function(angular) {

  angular.module('pickadate')
    .directive('pickadate', [
      '$locale',
      'pickadateUtils',
      'pickadateUtils.indexOf',
      'pickadateOptions',
      'dateFilter',

      function pickadateDirective($locale, dateUtils, indexOf, pickadateOptions, dateFilter) {
        return {
          require: 'ngModel',
          scope: {
            date: '=ngModel',
            minDate: '=',
            maxDate: '=',
            disabledDates: '='
          },
          templateUrl: 'pickadate/templates/pickadate.html',
          link: pickadateDirectiveLink
        };

        function pickadateDirectiveLink(scope, element, attrs, ngModel)  {
          var
            minDate       = scope.minDate && makeDate(scope.minDate),
            maxDate       = scope.maxDate && makeDate(scope.maxDate),
            disabledDates = scope.disabledDates || [],
            currentDate   = scope.initialDate || pickadateOptions.initialDateDefault;

          scope.dayNames    = $locale.DATETIME_FORMATS[pickadateOptions.dayNameFormat];
          scope.dayNameInitials = getInitials(scope.dayNames);
          scope.currentDate = currentDate;

          scope.render = function(initialDate) {
            initialDate = new Date(initialDate.getFullYear(), initialDate.getMonth(), 1, 3);

            var currentMonth    = initialDate.getMonth() + 1,
              dayCount          = new Date(initialDate.getFullYear(), initialDate.getMonth() + 1, 0, 3).getDate(),
              prevDates         = dateUtils.dateRange(-initialDate.getDay(), 0, initialDate),
              currentMonthDates = dateUtils.dateRange(0, dayCount, initialDate),
              lastDate          = dateUtils.stringToDate(currentMonthDates[currentMonthDates.length - 1]),
              nextMonthDates    = dateUtils.dateRange(1, 7 - lastDate.getDay(), lastDate),
              allDates          = prevDates.concat(currentMonthDates, nextMonthDates),
              dates             = [],
              today             = dateFilter(new Date(), pickadateOptions.todayDateFormat);

            // Add an extra row if needed to make the calendar to have 6 rows
            if (allDates.length / 7 < 6) {
              allDates = allDates.concat(dateUtils.dateRange(1, 8, allDates[allDates.length - 1]));
            }

            var nextMonthInitialDate = new Date(initialDate);
            nextMonthInitialDate.setMonth(currentMonth);

            scope.allowPrevMonth = !minDate || initialDate > minDate;
            scope.allowNextMonth = !maxDate || nextMonthInitialDate < maxDate;

            scope.dates = buildDates(scope, allDates, today, currentMonth);
          };

          scope.setDate = function(dateObj) {
            if (isDateDisabled(dateObj)) return;
            ngModel.$setViewValue(dateObj.date);
          };

          ngModel.$render = function () {
            if ((date = ngModel.$modelValue) && (indexOf.call(disabledDates, date) === -1)) {
              scope.currentDate = currentDate = dateUtils.stringToDate(date);
            } else if (date) {
              // if the initial date set by the user is in the disabled dates list, unset it
              scope.setDate({});
            }
            scope.render(currentDate);
          };

          scope.changeMonth = function (offset) {
            // If the current date is January 31th, setting the month to date.getMonth() + 1
            // sets the date to March the 3rd, since the date object adds 30 days to the current
            // date. Settings the date to the 2nd day of the month is a workaround to prevent this
            // behaviour
            currentDate.setDate(1);
            currentDate.setMonth(currentDate.getMonth() + offset);
            scope.render(currentDate);
          };

          function getInitials(names) {
            var len = names.length, initials = [], i = 0;

            while (i < len) {
              initials.push(names[i++][0]);
            }

            return initials;
          }

          function makeDate(dateString) {
            return dateUtils.stringToDate(dateString);
          }

          function buildDates(scope, allDates, today, currentMonth) {
            var
              dates = [],
              len = allDates.length,
              date,
              i,
              className;

            className = getDateClassName(today, currentMonth, disabledDates, scope);

            for (i = 0; i < len; i++) {
              date = allDates[i];
              dates.push({ date: date, className: className(date) });
            }

            return dates;
          }

        }

        function getDateClassName(today, currentMonth, disabledDates, options) {
          return classNameGetter;

          function classNameGetter(date) {
            var name = '';

            if (dateOutOfRange(date, options.minDate, options.maxDate, currentMonth)) {
              name = 'pickadate-disabled';
            }
            else if (indexOf.call(disabledDates, date) >= 0) {
              name = 'pickadate-disabled pickadate-unavailable';
            }
            else {
              name = 'pickadate-enabled';
            }

            if (date === today) {
              name += ' pickadate-today';
            }

            return name;
          }
        }

        function dateOutOfRange(date, min, max, currentMonth) {
          return date < min || date > max || dateFilter(date, 'M') !== currentMonth.toString()
        }

        function isDateDisabled(dateObj) {
          return (/pickadate-disabled/.test(dateObj.className));
        }
      }
    ]);

})(angular);
