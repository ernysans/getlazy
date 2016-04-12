var gulp = require('gulp');
var gp_concat = require('gulp-concat');
var beautify = require('gulp-beautify');
var minify = require('gulp-minify');
var umd = require('gulp-umd');

gulp.task('umd', function() {
  return gulp.src('./src/core/*.js')
    .pipe(umd({
      dependencies: function(file) {
        return [
          {
            name: 'lend'
          },
          {
            name: 'occurrence',
          }
        ];
      },
      exports: function(file) {
          return 'getLazy';
        },
        namespace: function(file) {
          return 'getLazy';
        }
    }))
    .pipe(beautify({indentSize: 4}))
    .pipe(gulp.dest('build'));
});

gulp.task('minify', ['umd'], function() {
  gulp.src('./build/getLazy.js')
    .pipe(minify({
        ext:{
            src:'.js',
            min:'-min.js'
        },
        exclude: ['tasks'],
        output: {
          comments: /^!|@preserve|@license|@cc_on/i
        }
    }))
    .pipe(gulp.dest('./'))
});

gulp.task('default', ['umd', 'minify']);
