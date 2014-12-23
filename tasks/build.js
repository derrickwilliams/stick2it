var
  concat = require('gulp-concat-util'),
  fs = require('fs'),
  _ = require('lodash-node'),
  util = require('util'),
  del = require('del'),
  debug = require('gulp-debug');

module.exports = function stick2itBuild(gulp) {

  var s2iModules = ['main', 'goals', 'services'];
  // var s2iModules = ['services'];

  gulp.task('build', ['build:preclean', 'build:modules']);
  gulp.task('build:preclean', buildPreclean);
  gulp.task('build:modules', ['build:preclean'], buildModules);

  function buildPreclean(done) {
    del(['www/js/**/build/*.build.js'], done);
  }

  function buildModules() {
    _.map(s2iModules, toConcatTask);

    function toConcatTask(moduleName) {
      var paths = modulePaths(moduleName);

      gulp.src([paths.main, paths.rest])
        .pipe(concat(moduleName + '.build.js', {
          process: concatProcess
        }))
        .pipe(gulp.dest(paths.dir + '/build'));
    }
  }

  function concatProcess(src) {
    var
      file = this,
      output = file.path.split('www/js/')[1];

    output = '\n/* ' + output + ' */\n';
    output += src;

    return output;
  }

  function modulePaths(moduleName) {
    return {
      dir: moduleDir(moduleName),
      main: moduleMain(moduleName),
      rest: moduleRest(moduleName)
    };
  }

  function moduleDir(moduleName) {
    return util.format('./www/js/%s', moduleName);
  }

  function moduleMain(moduleName) {
    return util.format('%s/%s.js', moduleDir(moduleName), moduleName);
  }

  function moduleRest(moduleName) {
    return util.format('%s/**/*.js', moduleDir(moduleName));
  }

  function cleanup(path) {
    del([path]);
  }

};