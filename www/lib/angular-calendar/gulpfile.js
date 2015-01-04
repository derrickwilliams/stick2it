var
  gulp = require('gulp'),
  concat = require('gulp-concat'),
  rename = require('gulp-rename'),
  sass = require('gulp-sass'),
  copy = require('gulp-copy'),
  html2js = require('gulp-ng-html2js');

gulp.task('default', ['build:scripts', 'build:styles', 'build:templates']);

gulp.task('build:scripts', function() {
  return gulp.src(['src/pickadate/pickadate.js', 'src/pickadate_utils/pickadateutils.js', 'src/**/*.js'])
    .pipe(concat('pickadate.js'))
    .pipe(gulp.dest('build/'));
});

gulp.task('build:styles', function() {
  return gulp.src([
      'src/pickadate/scss/pickadate.scss',
      'src/pickadate/scss/**/*.scss'
    ])
    .pipe(concat('pickadate.css'))
    .pipe(sass())
    .pipe(gulp.dest('build/'));
});

gulp.task('build:templates', function() {
  return gulp.src(['src/**/templates/**/*.html'])
    .pipe(html2js({ moduleName: 'pickadate.templates' }))
    .pipe(concat('pickadate.tmpl.js'))
    .pipe(gulp.dest('build/'));
});

gulp.task('package', ['build:scripts', 'build:styles', 'build:templates'], function() {
  return gulp.src(['build/**/*'])
    .pipe(copy('dist/', { prefix: 1 }));
});
