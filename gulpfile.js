var gulp = require('gulp');
var path = require('path');
var plugins = require('gulp-load-plugins')({
  rename: {
    "gulp-minify-css": 'minifyCSS'
  }
});


gulp.task('build', ['style', 'react']);


gulp.task('style', function() {
  gulp.src('./sass/')
    .pipe(plugins.changed('.sass-cache'))
    .pipe(plugins.compass({
      project: path.join(__dirname),
      css: 'public/css',
      sass: 'sass'
    }))
  gulp.src('./public/css/')
    .pipe(plugins.minifyCSS());
});

var jsxFile = [
  './component/navbar.jsx',
  './component/course_selection.jsx',
  './component/main.jsx'
  ];

gulp.task('react', function() {
  gulp.src(jsxFile)
    .pipe(plugins.changed('.react-cache'))
    .pipe(plugins.react())
    .pipe(gulp.dest('.react-cache'))
    .pipe(plugins.uglify())
    .pipe(plugins.concat('bundle.js'))
    .pipe(gulp.dest('./public/js/'))
})

gulp.task('watch', function() {
  gulp.watch('./sass/**/*.scss', ['style']);
  gulp.watch(jsxFile, ['react']);
});
