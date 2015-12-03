var gulp = require('gulp'), //基础库
    clean = require('gulp-clean'),
    autoprefixer = require('gulp-autoprefixer'),
    //sass = require('gulp-sass'),
    //merge = require('merge-stream'),
    //minifyHtml = require('gulp-minify-html'),//压缩html
    //uglify = require('gulp-uglify'),
    plumber = require('gulp-plumber'), //错误跳出
    compass = require('gulp-compass'), //编译sass
    minifyCss = require('gulp-minify-css'),
    //rev = require('gulp-rev'),
    //usemin = require('gulp-usemin'), //usemin
    imagemin = require('gulp-imagemin'), //图片压缩
    tinypng = require('gulp-tinypng'),
    postcss = require('gulp-postcss'), //postcss
    pngquant = require('imagemin-pngquant'), //深度压缩
    gulpif = require('gulp-if'),
    //sprity = require('sprity');
    spritesmith = require('gulp.spritesmith'); //合并精灵图


//配置路径
var config = {
    cssUrl: 'css/*.css', //css路径
    scssUrl: 'sass/*/*.scss', //scss路径
    jsUrl: 'js/*.js', //js路径
    imagesUrl: 'images/**/*.{png,jpg}', //图片路径
    htmlUrl: '*.html' //html路径

};
gulp.task('clean', function() {
    return gulp.src('assets', {
            read: false
        })
        .pipe(clean());
});

gulp.task('sprite', function() {
    var spriteData = gulp.src('images/*/*.{png,jpg}').pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'sprite.css',
        padding:20,//间距
        algorithm:'top-down'//布局

    }));
    var imgStream = spriteData.img
        .pipe(pngquant())
        .pipe(gulp.dest('assets/images'));

    // Pipe CSS stream through CSS optimizer and onto disk
    var cssStream = spriteData.css
        // .pipe(minifyCss())
        .pipe(gulp.dest('sass/sprites'));

    // Return a merged stream to handle both `end` events
    return merge(imgStream, cssStream);
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
            css: 'css',
            sass: 'sass',
            images: 'images'
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(minifyCss())
        .pipe(gulp.dest('css'));

});

//图片压缩
gulp.task('imagemin', function() {
    return gulp.src(config.imagesUrl)
        // .pipe(imagemin({
        //     progressive: true, // 无损压缩JPG图片
        //     svgoPlugins: [{
        //         removeViewBox: false
        //     }], // 不要移除svg的viewbox属性
        //     use: [pngquant()] // 使用pngquant插件进行深度压缩
        // }))
        //tinypng图片压缩
     .pipe(tinypng('m66cergQwJ-L96d3X1QhVs-mQs8WzrPm'))
    .pipe(gulp.dest('images')); //压缩后的图片存放路径
});



// 监听
gulp.task('watch', function() {
    gulp.watch([config.scssUrl, 'config.rb'], ['compass']); // 监听所有.scss文件监听confirg.rb

    //gulp.watch(config.imagesUrl, ['imagemin']); //监听图片改动
    // gulp.watch([config.cssUrl,config.jsUrl,config.htmlUrl],['clean','usemin']);
    //gulp.watch('./images/*', ['clean']); //监听图片改动
    //gulp.watch('./images/*', ['pngquant']); //监听图片改动
    //gulp.watch('./images/*', ['tinypng']); //监听图片改动

});

gulp.task('default', ['clean','imagemin', 'compass', 'watch']);
