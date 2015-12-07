var gulp         = require( 'gulp' );
var sass         = require( 'gulp-sass' );
var cmq          = require( 'gulp-combine-mq' );
var autoprefixer = require( 'gulp-autoprefixer' );
var browser      = require( 'browser-sync' );
var plumber      = require( 'gulp-plumber' );
var notify       = require( 'gulp-notify' );
var config       = require('../config');

gulp.task('sass', function() {
    gulp.src( config.sass.src )
        .pipe(plumber( {errorHandler: notify.onError('<%= error.message %>')} ))
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(gulp.dest( config.sass.dest ))
        .pipe(browser.reload({stream:true}))
});