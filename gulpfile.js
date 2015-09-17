var gulp = require('gulp'), //基础库
    usemin = require('gulp-usemin'), //usemin
    plumber = require('gulp-plumber'), //错误跳出
    compass = require('gulp-compass'), //编译sass
    tinypng = require('gulp-tinypng'), //图片压缩tinypng
    imagemin = require('gulp-imagemin'), //图片压缩
    //bower = require('gulp-bower'),
    pngquant = require('imagemin-pngquant'); //深度压缩
//gulpif = require('gulp-if'),
//sprity = require('sprity');
//spritesmith = require('gulp.spritesmith'); //合并精灵图
//cache = require('gulp-cache'); // 文件清理


//sprity合并精灵图
// gulp.task('sprites', function() {
//     return sprity.src({
//             src: './src/images/**/*.{png,jpg}',
//             style: './sprite.css',
//             // ... other optional options 
//             // for example if you want to generate scss instead of css 
//             processor: 'sass', // make sure you have installed sprity-sass 
//         })
//         .pipe(gulpif('*.png', gulp.dest('./dist/img/'), gulp.dest('./dist/css/')));
// });

//usemin
gulp.task('usemin', function() {
    return gulp.src('./*.html')
        .pipe(usemin({
            css: [rev()],
            html: [minifyHtml({
                empty: true
            })],
            js: [uglify(), rev()],
            inlinejs: [uglify()],
            inlinecss: [minifyCss(), 'concat']
        }))
        .pipe(gulp.dest('build/'));
});
//gulp.spritesmith合并精灵图
/*gulp.task('sprite', function() {
    var spriteData = gulp.src('images/icons/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'sprite.css',
        padding: 20,
    }));

    //spriteData.img.pipe(gulp.dest("./css")); // 雪碧图输出路径
    //spriteData.css.pipe(gulp.dest("./css")); //css输出路径
    return spriteData.pipe(gulp.dest('path/to/output/'));
});*/


// compass编译scss
gulp.task('compass', function() {

    gulp.src('./sass/**/*.*')
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

    .pipe(gulp.dest('build/images')); //压缩后的图片存放路径
});


//深度压缩
/*gulp.task('pngquant', function() {
    gulp.src('./images/*.png')
        .pipe(pngquant({
            quality: '65-80',
            speed: 4
        })())
        .pipe(gulp.dest('build/images'));
});*/


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
    gulp.watch('./sass/**/*.*', ['compass']); // 监听所有.scss文件
    gulp.watch('./config.rb', ['compass']); //监听confirg.rb
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

gulp.task('default', ['compass', 'watch', 'imagemin', 'usemin']);
