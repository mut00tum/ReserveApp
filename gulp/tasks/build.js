var gulp = require('gulp');

gulp.task('build', ['server', 'sass', 'html', 'webpack']);