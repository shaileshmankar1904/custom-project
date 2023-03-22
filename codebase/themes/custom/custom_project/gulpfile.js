/*global -$ */
'use strict';
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var sass = require('gulp-sass');

// Error notifications
var reportError = function(error) {
  $.notify({
    title: 'Gulp Task Error',
    message: 'Check the console.'
  }).write(error);
  console.log(error.toString());
  this.emit('end');
}

// Sass processing
gulp.task('sass', function() {
  return gulp.src('sass/**/*.scss')
      .pipe($.sourcemaps.init())
      // Convert sass into css
      .pipe($.sass({
        outputStyle: 'nested', // libsass doesn't support expanded yet
        precision: 10
      }))
      // Show errors
      .on('error', reportError)
      // Autoprefix properties
      .pipe($.autoprefixer({
        browsers: ['last 2 versions']
      }))
      // Write sourcemaps
      // .pipe($.sourcemaps.write())
      // Save css
      .pipe(gulp.dest('css'))
      .pipe(browserSync.reload({
        stream: true
      }));
});

// process JS files and return the stream.
gulp.task('js', function () {
  return gulp.src('js/**/*.js')
      .pipe(gulp.dest('js'));
});

// Optimize Images
gulp.task('images', function() {
  return gulp.src('images/**/*')
      .pipe($.imagemin({
        progressive: true,
        interlaced: true,
        svgoPlugins: [{
          cleanupIDs: false
        }]
      }))
      .pipe(gulp.dest('images'));
});

// JS hint
gulp.task('jshint', function() {
  return gulp.src('js/**/*.js')
      .pipe(reload({
        stream: true,
        once: true
      }))
      .pipe($.jshint())
      .pipe($.jshint.reporter('jshint-stylish'))
      .pipe($.notify({
        title: "JS Hint",
        message: "JS Hint says all is good.",
        onLast: true
      }));
});

// Beautify JS
gulp.task('beautify', function() {
  gulp.src('js/**/*.js')
      .pipe($.beautify({indentSize: 2}))
      .pipe(gulp.dest('js'))
      .pipe($.notify({
        title: "JS Beautified",
        message: "JS files in the theme have been beautified.",
        onLast: true
      }));
});

// Compress JS
gulp.task('compress', function() {
  return gulp.src('js/**/*.js')
      .pipe($.sourcemaps.init())
      .pipe($.uglify())
      .pipe($.sourcemaps.write())
      .pipe(gulp.dest('js'))
      .pipe($.notify({
        title: "JS Minified",
        message: "JS files in the theme have been minified.",
        onLast: true
      }));
});


// BrowserSync
gulp.task('browser-sync', function() {
  //watch files
  var files = [
    'scss/**/*.scss',
    'images/**/*',
    'templates/**/*.twig'
  ];
  //initialize browsersync
  browserSync.init(files, {
    proxy: "http://localhost/custom-project" // BrowserSync proxy, change to match your local environment
  });
});


// Default task to be run with `gulp`
gulp.task('default', ['sass', 'browser-sync'], function() {
  gulp.watch("sass/**/*.scss", ['sass']);
  gulp.watch("js/**/*.js", ['js']);
});
