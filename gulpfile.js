var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    compass = require('gulp-compass'),
    tinypng = require('gulp-tinypng');
// imagemin = require('gulp-imagemin');
// pngquant = require('imagemin-pngquant');
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
// gulp.task('imagemin', function() {
//     return gulp.src('./images/*')
//         .pipe(imagemin({
//             progressive: true,
//             svgoPlugins: [{
//                 removeViewBox: false
//             }],

//         }))
//         .pipe(gulp.dest('./images'));
// });

//tinypng图片压缩
gulp.task('tinypng', function() {
    gulp.src('./images/**/*.*')
        .pipe(tinypng('hborAzV1UAecTvoPizaB91UQnyRuvowC'))
        .pipe(gulp.dest('images'));
});
// 监听
gulp.task('watch', function() {

    
    gulp.watch('./sass/*/*.scss', ['compass']);// 监听所有.scss档
    gulp.watch('./config.b', ['compass']);//监听confirg.rg
    gulp.watch('./images/**/*.*', ['tinypng']);//监听图片改动

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

gulp.task('default', ['compass', 'watch', 'tinypng']);
