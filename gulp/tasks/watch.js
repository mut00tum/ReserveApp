var gulp    = require( 'gulp' );
var browser = require( 'browser-sync' );
var config  = require('../config');

gulp.task('watch',['server'], function() {
    gulp.watch( config.watch.sass ,['sass']);
    gulp.watch( config.watch.js , ['webpack'] );
    gulp.watch( config.watch.html , ['html'] );
});