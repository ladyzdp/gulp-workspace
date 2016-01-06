var gulp = require('gulp'), //基础库
  gulpLoadPlugins = require('gulp-load-plugins'),
  $ = gulpLoadPlugins();


$.livereload({
  start: true
})

//配置路径
var configUrl = {
  css: 'dev/assets/css/*.css',
  scss: 'dev/assets/sass/*/*.scss',
  js: 'dev/assets/js/*.js',
  images: 'dev/assets/images/*.{png,jpg}',
  html: 'dev/static/*.html'

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
      css: 'dev/assets/css',
      sass: 'dev/assets/sass',
      images: 'dev/assets/images'
    }))
    .pipe(gulp.dest('dev/assets/css'))
    .pipe($.livereload());

});
//压缩排序优化CSS
gulp.task('minicss', function() {
  return gulp.src(configUrl.css)
    .pipe($.csscomb())
    .pipe($.autoprefixer())
    .pipe($.minifyCss({compatibility: 'ie8'}))
    .pipe(gulp.dest('dev/assets/css'));
});

//图片压缩
gulp.task('tinypng', function() {
  return gulp.src(configUrl.images)
    //tinypng图片压缩
    .pipe($.tinypng('m66cergQwJ-L96d3X1QhVs-mQs8WzrPm'))
    .pipe(gulp.dest('dev/assets/images'));
});



// 监听
gulp.task('watch', function() {
  gulp.watch([configUrl.scss, 'config.rb'], ['compass']);
  gulp.watch([configUrl.css], ['minicss']);
  gulp.watch([configUrl.images, configUrl.css, configUrl.html]).on('change', $.livereload.changed);
});
gulp.task('default', ['compass','minicss' ,'tinypng', 'watch']);
