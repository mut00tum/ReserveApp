var gulp    = require( 'gulp' );
var browser = require( 'browser-sync' );
var plumber = require( 'gulp-plumber' );
var notify  = require( 'gulp-notify' );
var webpack = require( 'gulp-webpack' );
var config  = require('../config');

gulp.task('webpack', function() {
  return gulp.src( '' )
    .pipe(plumber( {errorHandler: notify.onError('<%= error.message %>')} ))
    .pipe(webpack( config.webpack ))
    .pipe(gulp.dest( '' ))
    .pipe( browser.reload({stream:true}) )
});