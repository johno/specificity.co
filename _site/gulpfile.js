var gulp = require('gulp'),
    gutil = require('gulp-util'),
    watch = require('gulp-watch'),
    lr    = require('tiny-lr'),
    server = lr(),
    livereload = require('gulp-livereload'),
    prefix = require('gulp-autoprefixer'),
    minifyCSS = require('gulp-minify-css'),
    sass = require('gulp-ruby-sass'),
    csslint = require('gulp-csslint');

gulp.task('minify-css', function(){
  gulp.src('./css/*.css')
    .pipe(minifyCSS({keepSpecialComments: 0}))
    .pipe(gulp.dest('./css/'));
});

gulp.task('csslint', function(){
  gulp.src('./css/*.css')
    .pipe(csslint({
          'compatible-vendor-prefixes': false,
          'box-sizing': false,
          'important': false,
          'known-properties': false
        }))
    .pipe(csslint.reporter());

});

gulp.task('pre-process', function(){
  gulp.src('./sass/i.scss')
      .pipe(watch(function(files) {
        return files.pipe(sass({loadPath: ['./sass/'], style: "compact"}))
          .pipe(prefix())
          .pipe(gulp.dest('./css/'))
          .pipe(livereload(server));
      }));
});

gulp.task('reload-html', function() {
  gulp.src('*.html')
    .pipe(watch(function(files) {
      return files.pipe(livereload(server));
    }));
});

gulp.task('default', function(){
  gulp.run('pre-process', 'csslint');
  server.listen(35729, function (err) {
    gulp.watch(['*.html', './sass/*.scss'], function(event) {
      gulp.run('reload-html','pre-process', 'csslint');
    });
  });
});
