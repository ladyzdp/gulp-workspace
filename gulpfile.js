var gulp = require('gulp'), //基础库
    clean = require('gulp-clean'),
<<<<<<< HEAD
    //给文件添加版本号
    minifyHtml = require('gulp-minify-html'),
    uglify = require('gulp-uglify'),
=======
    sass = require('gulp-sass'),
    merge = require('merge-stream'),
    //minifyHtml = require('gulp-minify-html'),//压缩html
    //uglify = require('gulp-uglify'),
>>>>>>> 0c58d4372341ad58b1143de0120a11ec3ac4bc66
    plumber = require('gulp-plumber'), //错误跳出
    //compass = require('gulp-compass'), //编译sass
    minifyCss = require('gulp-minify-css'),
    //rev = require('gulp-rev'),
    //usemin = require('gulp-usemin'), //usemin
    imagemin = require('gulp-imagemin'), //图片压缩
    //postcss = require('gulp-postcss'), //postcss
    pngquant = require('imagemin-pngquant'), //深度压缩
    gulpif = require('gulp-if'),
    //sprity = require('sprity');
    spritesmith = require('gulp.spritesmith'); //合并精灵图


//配置路径
var config = {
    cssUrl: 'assets/css/*.css', //css路径
    scssUrl: 'sass/**/*.scss', //scss路径
    jsUrl: 'js/*.js', //js路径
<<<<<<< HEAD
    imagesUrl: 'images/*.{png,jpg}', //图片路径
=======
    imagesUrl: 'assets/images/*.{png,jpg}', //图片路径
>>>>>>> 0c58d4372341ad58b1143de0120a11ec3ac4bc66
    htmlUrl: '*.html' //html路径

};
//sass
gulp.task('sass', function() {
    gulp.src(config.scssUrl)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('assets/css'));
});

<<<<<<< HEAD
//清除过期文件
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
            css: 'css',
            sass: 'sass',
            images: 'images'
        }))
        .pipe(gulp.dest('css'));
=======
gulp.task('sprite', function() {
    var spriteData = gulp.src('assets/images/*/*.{png,jpg}').pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'sprite.css',
        padding:20,//间距
        algorithm:'top-down'//布局

>>>>>>> 0c58d4372341ad58b1143de0120a11ec3ac4bc66

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
// gulp.task('compass', function() {

//     return gulp.src(config.scssUrl)
//         .pipe(plumber({
//             errorHandler: function(error) {
//                 console.log(error.message);
//                 this.emit('end');
//             }
//         }))
//         .pipe(compass({
//             config_file: './config.rb',
//             css: 'css',
//             sass: 'sass',
//             images: 'images'
//         }))
//         .pipe(gulp.dest('css'));

// });
//图片压缩
gulp.task('imagemin', function() {
    return gulp.src(config.imagesUrl)
        .pipe(imagemin({
            progressive: true, // 无损压缩JPG图片
            svgoPlugins: [{
                removeViewBox: false
            }], // 不要移除svg的viewbox属性
            use: [pngquant()] // 使用pngquant插件进行深度压缩
        }))

    .pipe(gulp.dest('assets/images')); //压缩后的图片存放路径
});
//压缩CSS
<<<<<<< HEAD
gulp.task('minify', function() {
    gulp.src(config.htmlUrl)
        .pipe(minifyHtml({
            // conditionals: true,
            // spare: true
        }))
        .pipe(gulp.dest('assets/static'));
    gulp.src(config.cssUrl)
=======
gulp.task('minify-css', function() {
    return gulp.src(config.cssUrl)
>>>>>>> 0c58d4372341ad58b1143de0120a11ec3ac4bc66
        .pipe(minifyCss({
            compatibility: 'ie8'
        }))
        .pipe(gulp.dest('assets/css'));

<<<<<<< HEAD
=======
    .pipe(gulp.dest('assets/css'));
>>>>>>> 0c58d4372341ad58b1143de0120a11ec3ac4bc66


<<<<<<< HEAD
});
//usemin
// gulp.task('usemin', function() {
//     gulp.src('./css/*.css')
//        .pipe(usemin({
//            css: [rev()],
//            // html: [ minifyHtml({spare:true,empty:true}) ],
//            js: [uglify(), rev(),gulp.dest('assets/js')],
//            inlinejs: [uglify()],
//            inlinecss: [minifyCss(),gulp.dest('assets/css')]
//        }));
//     //    .pipe(gulp.dest('build/'));
//     // //给css文件加上MD5版本号
//     // gulp.src(config.cssUrl)
//     //     .pipe(rev())
//     //     .pipe(gulp.dest('assets/css'));
//     // //给js加版本号
//     // gulp.src(config.jsUrl)
//     //     .pipe(rev())
//     //     .pipe(gulp.dest('assets/js'));
//     // //给Html加版本号
//     // gulp.src(config.htmlUrl)
//     //     .pipe(rev())
//     //     .pipe(gulp.dest('assets'));

// });
=======
>>>>>>> 0c58d4372341ad58b1143de0120a11ec3ac4bc66

//uncss
// gulp.task('uncss', function () {
//     return gulp.src('assets/css/*.css')
//         .pipe(uncss({
//             html: ['*.html' ]
//         }))
//         .pipe(gulp.dest('html'));
// });



//tinypng图片压缩
/*gulp.task('tinypng', function() {
    gulp.src('./images/*')
        .pipe(tinypng('hborAzV1UAecTvoPizaB91UQnyRuvowC'))
        .pipe(gulp.dest('images'));
});*/


// 监听
gulp.task('watch', function() {
<<<<<<< HEAD
    gulp.watch([config.scssUrl, 'config.rb'], ['compass']); // 监听所有.scss文件监听confirg.rb

    gulp.watch([config.cssUrl, config.htmlUrl], ['minify']);
    gulp.watch('images/*', ['imagemin']); //监听图片改动
=======
    //gulp.watch([config.scssUrl, 'config.rb'], ['compass']); // 监听所有.scss文件监听confirg.rb
    gulp.watch(config.scssUrl, ['sass']);
    gulp.watch(config.cssUrl, ['minify-css']);
    //gulp.watch('images/*', ['imagemin']); //监听图片改动
>>>>>>> 0c58d4372341ad58b1143de0120a11ec3ac4bc66
    // gulp.watch([config.cssUrl,config.jsUrl,config.htmlUrl],['clean','usemin']);
    //gulp.watch('./images/*', ['clean']); //监听图片改动
    //gulp.watch('./images/*', ['pngquant']); //监听图片改动
    //gulp.watch('./images/*', ['tinypng']); //监听图片改动

});

<<<<<<< HEAD
gulp.task('default', ['clean', 'compass', 'minify', 'imagemin', 'watch']);
=======
gulp.task('default', ['clean', 'sass', 'watch']);
>>>>>>> 0c58d4372341ad58b1143de0120a11ec3ac4bc66
