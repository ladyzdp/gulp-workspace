var gulp = require('gulp'), //基础库
    clean = require('gulp-clean'),
    //给文件添加版本号
    //minifyHtml = require('gulp-minify-html'),
    uglify = require('gulp-uglify'),
    plumber = require('gulp-plumber'), //错误跳出
    compass = require('gulp-compass'), //编译sass
    minifyCss = require('gulp-minify-css'),
    rev = require('gulp-rev'),
    usemin = require('gulp-usemin'), //usemin

    //tinypng = require('gulp-tinypng'), //图片压缩tinypng
    imagemin = require('gulp-imagemin'), //图片压缩
    //bower = require('gulp-bower'),
    uncss = require('gulp-uncss'),
    pngquant = require('imagemin-pngquant'); //深度压缩
//gulpif = require('gulp-if'),
//sprity = require('sprity');
//spritesmith = require('gulp.spritesmith');       //合并精灵图
//cache = require('gulp-cache');                   // 文件清理

//配置路径
var config = {
    cssUrl: 'css/*.css', //css路径
    scssUrl: 'sass/**/*.scss', //scss路径
    jsUrl: 'js/*.js', //js路径
    imagesUrl: 'images/*', //图片路径
    htmlUrl: '*.html' //html路径

};


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

});
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
gulp.task('minify-css', function() {
    return gulp.src('css/*.css')
        .pipe(minifyCss({
            compatibility: 'ie8'
        }))

    .pipe(gulp.dest('assets/css'))

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

//uncss
// gulp.task('uncss', function () {
//     return gulp.src('assets/css/*.css')
//         .pipe(uncss({
//             html: ['*.html' ]
//         }))
//         .pipe(gulp.dest('html'));
// });
//清除过期文件
gulp.task('clean', function() {
    return gulp.src('assets', {
            read: false
        })
        .pipe(clean());
});


//tinypng图片压缩
/*gulp.task('tinypng', function() {
    gulp.src('./images/*')
        .pipe(tinypng('hborAzV1UAecTvoPizaB91UQnyRuvowC'))
        .pipe(gulp.dest('images'));
});*/


//缓存清理
/*gulp.task('clean', function(done) {
    return cache.clearAll(done);
});*/


// 监听
gulp.task('watch', function() {
    gulp.watch([config.scssUrl, 'config.rb'], ['compass']); // 监听所有.scss文件监听confirg.rb

    gulp.watch(config.cssUrl, ['minify-css']);
    gulp.watch('images/*', ['imagemin']); //监听图片改动
    // gulp.watch([config.cssUrl,config.jsUrl,config.htmlUrl],['clean','usemin']);
    //gulp.watch('./images/*', ['clean']); //监听图片改动
    //gulp.watch('./images/*', ['pngquant']); //监听图片改动
    //gulp.watch('./images/*', ['tinypng']); //监听图片改动

    // // 监听所有.js档
    // gulp.watch('src/scripts/**/*.js', ['scripts']);

    // // 监听所有图片档
    // gulp.watch('./src/images*', ['compass']);

    // // 建立即时重整伺服器
    // var server = livereload();

    // // 监听所有位在 dist/  目录下的档案，一旦有更动，便进行重整
    // gulp.watch(['dist/**']).on('change', function(file) {
    //   server.changed(file.path);
    // });

});

gulp.task('default', ['clean', 'compass', 'imagemin', 'watch']);
