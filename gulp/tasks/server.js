var gulp    = require( 'gulp' );
var browser = require( 'browser-sync' );
var config  = require('../config');

gulp.task( 'server', function() {
    browser({
        server: {
            baseDir: config.dest
        }
    });
});
