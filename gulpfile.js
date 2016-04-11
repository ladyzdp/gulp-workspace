var gulp = require('gulp'), //基础库
  gulpLoadPlugins = require('gulp-load-plugins'),
  buffer = require('vinyl-buffer'),
  merge = require('merge-stream'),
  gulpSequence = require('gulp-sequence'),
  cleanCSS = require('gulp-clean-css'),
  $ = gulpLoadPlugins();


// $.livereload({
//   start: true
// })

//配置路径
var configUrl = {
  css: './dev/assets/css/*.css',
  scss: './dev/assets/sass/**/*.scss',
  js: './dev/assets/js/*.js',
  images: './dev/assets/images/*.{png,jpg}',
  html: './dev/static/*.html'

};
gulp.task('clean', function() {
  return gulp.src('assets', {
      read: false
    })
    .pipe($.clean());
});


// compass编译scss
// gulp.task('compass', function() {
//   return gulp.src(configUrl.scss)

//     .pipe($.plumber({
//       errorHandler: function(error) {
//         console.log(error.message);
//         this.emit('end');
//       }
//     }))
//   .pipe($.compass({
//       config_file: './config.rb',
//       css: 'dev/assets/css',
//       sass: 'dev/assets/sass',
//       images: 'dev/assets/images'
//     }))
//     .pipe(gulp.dest('dev/assets/css'))
//     // .pipe($.livereload());

// });


gulp.task('sprites', function generateSpritesheets () {
  var spriteData = gulp.src('./dev/assets/images/icons/normal/*.png')
  .pipe($.spritesmith({
    retinaSrcFilter: './dev/assets/images/icons/normal/*-2x.png',
    retinaImgName: '../images/sprite-2x.png',
    imgName: 'sprite.png',
    imgPath:'../images/sprite.png',
    cssName: '_sprites.scss',
    //cssName: 'sprites.scss',
    //cssFormat: 'scss',
    padding:20,
    algorithm:'',//top-down,left-right,diagonal,alt-diagonal,binary-tree

  }));
  var imgStream = spriteData.img
  .pipe(buffer())
  //.pipe($.tinypng('m66cergQwJ-L96d3X1QhVs-mQs8WzrPm'))
  .pipe(gulp.dest('./dev/assets/images'))

  var cssStream = spriteData.css
  .pipe(gulp.dest('./dev/assets/sass/sprites'))

  // return spriteData.pipe(gulp.dest('./dist/sprites'));
  return merge(imgStream, cssStream);
});

gulp.task('sass', function () {
  return gulp.src(configUrl.scss)
    .pipe($.sourcemaps.init()) 
    .pipe($.sass({outputStyle: 'compressed'}).on('error', $.sass.logError))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('./dev/assets/css'))
    //.pipe($.livereload());
});





//压缩排序优化CSS
gulp.task('minicss', function() {
  return gulp.src(configUrl.css)
    .pipe($.autoprefixer())
    //.pipe($.csscomb())
    .pipe(cleanCSS({compatibility: 'ie8'}))
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
  // gulp.watch([configUrl.scss, 'config.rb'], ['compass']);
  //gulp.watch(configUrl.scss, ['sass']).on('change', $.livereload.changed);
  gulp.watch(configUrl.scss, gulpSequence('sass','minicss')); 
  //gulp.watch('./dist/css/*.css').on('change', $.livereload.changed);
});
// gulp.task('default', ['compass','minicss' ,'tinypng', 'watch']);
gulp.task('default', gulpSequence('sprites','sass','minicss','tinypng', 'watch'));
