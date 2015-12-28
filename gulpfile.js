var gulp = require('gulp'), //基础库
  clean = require('gulp-clean'),
  autoprefixer = require('gulp-autoprefixer'),
  plumber = require('gulp-plumber'), //错误跳出
  compass = require('gulp-compass'), //编译sass
  tinypng = require('gulp-tinypng'),
  gulpif = require('gulp-if'),
  livereload = require('gulp-livereload');

livereload({
    start: true
  })
  //配置路径
var config = {
  cssUrl: 'assets/css/*.css', //css路径
  scssUrl: 'assets/sass/*/*.scss', //scss路径
  jsUrl: 'assets/js/*.js', //js路径
  imagesUrl: 'assets/images/*.{png,jpg}', //图片路径
  htmlUrl: '*.html' //html路径

};
gulp.task('clean', function() {
  return gulp.src('assets', {
      read: false
    })
    .pipe(clean());
});


// compass编译scss
gulp.task('compass', function() {

  return gulp.src(config.scssUrl)
    .pipe(plumber({
      errorHandler: function(error) {
        console.log(error.message);
        this.emit('end');
      }
    }))
    .pipe(compass({
      config_file: './config.rb',
      css: 'assets/css',
      sass: 'assets/sass',
      images: 'assets/images'
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('assets/css'))
    .pipe(livereload());

});

//图片压缩
gulp.task('tinypng', function() {
  return gulp.src(config.imagesUrl)
    //tinypng图片压缩
    .pipe(tinypng('m66cergQwJ-L96d3X1QhVs-mQs8WzrPm'))
    .pipe(gulp.dest('assets/images')); //压缩后的图片存放路径
});



// 监听
gulp.task('watch', function() {
  gulp.watch([config.scssUrl, 'config.rb'], ['compass']); // 监听所有.scss文件监听confirg.rb

  gulp.watch([config.imagesUrl, config.cssUrl, config.htmlUrl].on('change', livereload.changed)
});

gulp.task('default', ['compass', 'tinypng', 'watch']);
