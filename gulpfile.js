var gulp = require('gulp'), //基础库
    plumber = require('gulp-plumber'), //错误跳出
    compass = require('gulp-compass'), //编译sass
    tinypng = require('gulp-tinypng'), //图片压缩tinypng
    imagemin = require('gulp-imagemin'), //图片压缩
    pngquant = require('imagemin-pngquant'); //深度压缩
    // cache = require('gulp-cache'); // 文件清理

// compass
gulp.task('compass', function() {

    gulp.src('./sass/*/*.scss')
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
    gulp.src('./images/*')
        .pipe(imagemin({
            progressive: true, // 无损压缩JPG图片
            svgoPlugins: [{
                removeViewBox: false
            }], // 不要移除svg的viewbox属性
            use: [pngquant()] // 使用pngquant插件进行深度压缩
        }))

    .pipe(gulp.dest('build/images'));
});
//深度压缩
// gulp.task('pngquant', function() {
//     gulp.src('./images/*.png')
//         .pipe(pngquant({
//             quality: '65-80',
//             speed: 4
//         })())
//         .pipe(gulp.dest('build/images'));
// });

//tinypng图片压缩
// gulp.task('tinypng', function() {
//     gulp.src('./images/*')
//         .pipe(tinypng('hborAzV1UAecTvoPizaB91UQnyRuvowC'))
//         .pipe(gulp.dest('images'));
// });
//缓存清理
// gulp.task('clean', function(done) {
//     return cache.clearAll(done);
// });
// 监听
gulp.task('watch', function() {
    gulp.watch('./sass/*/*.scss', ['compass']); // 监听所有.scss档
    gulp.watch('./config.b', ['compass']); //监听confirg.rg
    gulp.watch('./images/*', ['imagemin']); //监听图片改动
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

gulp.task('default', ['compass', 'watch', 'imagemin']);
