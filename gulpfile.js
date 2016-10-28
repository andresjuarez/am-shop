// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var ngAnnotate = require('gulp-ng-annotate');
var connect = require('gulp-connect');
var open = require('gulp-open');


// Concatenate & Minify JS
gulp.task('scripts', function() {
          gulp.src(['./app/src/**/*.module.js', './app/src/**/*.js',])
    .pipe(concat('main.js'))
    .pipe(ngAnnotate({
      add: true,
      single_quotes: true
    }))
      .on('error', handleError)
    .pipe(gulp.dest('./app'))
    .pipe(connect.reload());
});

gulp.task('scripts-prod', function() {
          gulp.src(['./app/src/**/*.module.js', './app/src/**/*.js',])
    .pipe(concat('main.js'))
    .pipe(ngAnnotate({
      add: true,
      single_quotes: true
    }))
    .pipe(uglify({mangle: true}))
    .on('error', handleError)
    .pipe(gulp.dest('./app'))
    .pipe(connect.reload());
});

gulp.task('build-docs-site', ['scripts-prod'], function() {

  gulp.src(['./app/assets/**/*.*'])
    .pipe(gulp.dest('./docs/assets'));
  gulp.src(['./app/*.html', './app/*.js'])
    .pipe(gulp.dest('./docs'));


});


function handleError(result){
  console.log("Error Complile", result);
};

// Watch Files For Changes
gulp.task('watch', ['scripts', 'server'],  function() {
    gulp.watch(['./app/src/**/*.js', './app/src/**/*.html', './app/*.html'], ['scripts']);

});

gulp.task('watch-prod', ['scripts-prod', 'server'],  function() {
    gulp.watch(['./app/src/**/*.js', './app/src/**/*.html', './app/index.html'], ['scripts']);

});

gulp.task('server',  function() {
  connect.server({
    root: ['app', './'],
    port: 10010,
    livereload: true
  });
  gulp.src('')
  .pipe(open({
    uri: 'http://127.0.0.1:10010'
  }));
});
