var 
  gulp = require('gulp'),
  karma = require('karma').server,
  path = require('path');

module.exports = function stick2itKarma(gulp) {

  gulp.task('karma:once', function (done) {
    karma.start({
      configFile: configFile(),
      singleRun: true
    }, done);
  });

  gulp.task('karma', function (done) {
    karma.start({
      configFile: configFile()
    }, done);
  });

};

function configFile(fileName) {
  return path.join(__dirname, '..', fileName || 'karma.conf.js');
}