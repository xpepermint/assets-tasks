
var gulp = require('gulp');
var assets = require('../');

gulp.task('assets:clean', function() {
  return assets.clean();
});

gulp.task('assets:compile', ['assets:clean'], function() {
  return assets.compile();
});

gulp.task('assets:precompile', ['assets:clean'], function() {
  return assets.precompile();
});
