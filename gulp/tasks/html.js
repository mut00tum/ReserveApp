var gulp    = require( 'gulp' );
var browser = require( 'browser-sync' );
var plumber = require( 'gulp-plumber' );
var notify  = require( 'gulp-notify' );
var config  = require('../config');

gulp.task('html',function(){
  gulp.src( config.html.dest )
    .pipe(plumber( {errorHandler: notify.onError('<%= error.message %>')} ))
    .pipe( browser.reload({stream:true}) )
});