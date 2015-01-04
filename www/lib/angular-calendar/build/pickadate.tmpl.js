(function(module) {
try {
  module = angular.module('pickadate.templates');
} catch (e) {
  module = angular.module('pickadate.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('pickadate/templates/pickadate.html',
    '<div class="pickadate">\n' +
    '  <div class="pickadate-header">\n' +
    '    <div class="pickadate-controls">\n' +
    '      <a href="" class="pickadate-prev" ng-click="changeMonth(-1)" ng-show="allowPrevMonth">prev</a>\n' +
    '      <a href="" class="pickadate-next" ng-click="changeMonth(1)" ng-show="allowNextMonth">next</a>\n' +
    '    </div>\n' +
    '    <h3 class="pickadate-centered-heading">\n' +
    '      <span class="heading-long">{{currentDate | date:"MMMM yyyy"}}</span>\n' +
    '      <span class="heading-short">{{currentDate | date:"MMM yyyy"}}</span>\n' +
    '    </h3>\n' +
    '    <h3 class="pickadate-centered-heading-short"></h3>\n' +
    '  </div>\n' +
    '  <div class="pickadate-body">\n' +
    '    <div class="pickadate-main">\n' +
    '\n' +
    '      <ul class="pickadate-cell pickadate-day-labels">\n' +
    '        <li class="pickadate-head" ng-repeat="dayName in dayNameInitials track by $index">{{dayName}}</li>\n' +
    '      </ul>\n' +
    '\n' +
    '      <ul class="pickadate-cell pickadate-day-cells">\n' +
    '        <li ng-repeat="d in dates" ng-click="setDate(d)"\n' +
    '          class="{{d.className}}" ng-class="{\'pickadate-active\': date == d.date}">\n' +
    '\n' +
    '          {{d.date | date:"d"}}\n' +
    '        </li>\n' +
    '      </ul>\n' +
    '\n' +
    '    </div>\n' +
    '  </div>\n' +
    '</div>\n' +
    '');
}]);
})();
