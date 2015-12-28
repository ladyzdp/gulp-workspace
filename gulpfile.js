var gulp = require('gulp'), //基础库
  gulpLoadPlugins = require('gulp-load-plugins'),
  plugins = gulpLoadPlugins();


plugins.livereload({
    start: true
  })
  //配置路径
var config = {
  cssUrl: 'assets/css/*.css',
  scssUrl: 'assets/sass/*/*.scss',
  jsUrl: 'assets/js/*.js', //js路径
  imagesUrl: 'assets/images/*.{png,jpg}',
  htmlUrl: '*.html'

};
gulp.task('clean', function() {
  return gulp.src('assets', {
      read: false
    })
    .pipe(plugins.clean());
});


// compass编译scss
gulp.task('compass', function() {

  return gulp.src(config.scssUrl)
    .pipe(plugins.plumber({
      errorHandler: function(error) {
        console.log(error.message);
        this.emit('end');
      }
    }))
    .pipe(plugins.compass({
      config_file: './config.rb',
      css: 'assets/css',
      sass: 'assets/sass',
      images: 'assets/images'
    }))
    .pipe(plugins.autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('assets/css'))
    .pipe(plugins.livereload());

});

//图片压缩
gulp.task('tinypng', function() {
  return gulp.src(config.imagesUrl)
    //tinypng图片压缩
    .pipe(plugins.tinypng('m66cergQwJ-L96d3X1QhVs-mQs8WzrPm'))
    .pipe(gulp.dest('assets/images'));
});



// 监听
gulp.task('watch', function() {
  gulp.watch([config.scssUrl, 'config.rb'], ['compass']);
  gulp.watch([config.imagesUrl, config.cssUrl, config.htmlUrl]).on('change', plugins.livereload.changed);
});
gulp.task('default', ['compass', 'tinypng', 'watch']);
