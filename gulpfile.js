var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    compass = require('gulp-compass'),
    imagemin = require('gulp-imagemin');
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
// gulp.task('default', function() {
//     return gulp.src('./src/images/*')
//         .pipe(imagemin({
//             progressive: true,
//             svgoPlugins: [{
//                 removeViewBox: false
//             }],
//             use: [pngquant()]
//         }))
//         .pipe(gulp.dest('dist/images'));
// });
// 看手
gulp.task('watch', function() {

    // 看守所有.scss档
    gulp.watch('./sass/*/*.scss', ['compass']);
    gulp.watch('./config.b', ['compass']);

    // // 看守所有.js档
    // gulp.watch('src/scripts/**/*.js', ['scripts']);

    // // 看守所有图片档
    // gulp.watch('./src/images*', ['compass']);

    // // 建立即时重整伺服器
    // var server = livereload();

    // // 看守所有位在 dist/  目录下的档案，一旦有更动，便进行重整
    // gulp.watch(['dist/**']).on('change', function(file) {
    //   server.changed(file.path);
    // });

});

gulp.task('default', ['compass', 'watch', 'default']);
