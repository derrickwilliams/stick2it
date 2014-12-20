var
  concat = require('gulp-concat'),
  fs = require('fs'),
  _ = require('lodash-node'),
  util = require('util');

module.exports = function stick2itTasks(gulp) {

  gulp.task('build', function() {

    _.map(['main', 'goals'], toConcatTask);

    function toConcatTask(moduleName) {
      var 
        moduleDir = util.format('./www/js/%s', moduleName),
        moduleMain = util.format('%s/%.js', moduleDir, moduleName),
        moduleRest = util.format('%s/**/*.js', moduleDir),
        excludeModuleBuild = util.format('!%s/%s.build.js', moduleDir, moduleName);

      gulp.src([moduleMain, moduleRest, excludeModuleBuild])
        .pipe(concat(moduleName + '.build.js'))
        .pipe(gulp.dest(moduleDir));
    } 
  });

};