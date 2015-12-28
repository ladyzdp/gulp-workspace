var gulp = require('gulp'), //基础库
  gulpLoadPlugins = require('gulp-load-plugins'),
  $ = gulpLoadPlugins();


$.livereload({
  start: true
})

//配置路径
var configUrl = {
  css: 'assets/css/*.css',
  scss: 'assets/sass/*/*.scss',
  js: 'assets/js/*.js',
  images: 'assets/images/*.{png,jpg}',
  html: '*.html'

};
gulp.task('clean', function() {
  return gulp.src('assets', {
      read: false
    })
    .pipe($.clean());
});


// compass编译scss
gulp.task('compass', function() {

  return gulp.src(configUrl.scss)
    .pipe($.plumber({
      errorHandler: function(error) {
        console.log(error.message);
        this.emit('end');
      }
    }))
    .pipe($.compass({
      config_file: './config.rb',
      css: 'assets/css',
      sass: 'assets/sass',
      images: 'assets/images'
    }))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe($.csscomb())
    .pipe(gulp.dest('assets/css'))
    .pipe($.livereload());

});

//图片压缩
gulp.task('tinypng', function() {
  return gulp.src(configUrl.images)
    //tinypng图片压缩
    .pipe($.tinypng('m66cergQwJ-L96d3X1QhVs-mQs8WzrPm'))
    .pipe(gulp.dest('assets/images'));
});



// 监听
gulp.task('watch', function() {
  gulp.watch([configUrl.scss, 'configUrl.rb'], ['compass']);
  gulp.watch([configUrl.images, configUrl.css, configUrl.html]).on('change', $.livereload.changed);
});
gulp.task('default', ['compass', 'tinypng', 'watch']);
