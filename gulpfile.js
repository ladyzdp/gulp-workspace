var gulp = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    buffer = require('vinyl-buffer'),
    merge = require('merge-stream'),
    gulpSequence = require('gulp-sequence'),
    cleanCSS = require('gulp-clean-css'),
    fileinclude = require('gulp-file-include'),
    htmlmin = require('gulp-htmlmin'),
    md5 = require('gulp-md5-plus'),
    $ = gulpLoadPlugins();


$.livereload({
    start: true
})

//配置路径
var baseUrl = './dev/';
var distUrl = './app/';
var tinypngApi = 'm66cergQwJ-L96d3X1QhVs-mQs8WzrPm';
var configUrl = {
    file: {
        css: baseUrl + 'assets/css/*.css',
        scss: baseUrl + 'assets/sass/**/*.scss',
        images: baseUrl + 'assets/images/*.{png,jpg}',
        js: baseUrl + 'js/*.js',
        html: baseUrl + 'static/*.html',
        htmlfile: baseUrl + 'html/*.html',
    },
    folder: {
        css: baseUrl + 'assets/css',
        images: baseUrl + 'assets/images',
        scss: baseUrl + 'assets/sass',
        sprites: baseUrl + 'assets/sass/sprites',
        js: baseUrl + 'js',
        html: baseUrl + 'html'

    },
    dist: {
        css: distUrl + 'assets/css',
        images: distUrl + 'assets/images',
        scss: distUrl + 'assets/sass',
        sprites: distUrl + 'assets/sass/sprites',
        js: distUrl + 'js',
        html: distUrl + 'html'
    }
};



//清除文件
gulp.task('clean', function() {
    return gulp.src('./app')
        .pipe($.clean())
        .pipe($.clean());
});

//制作精灵图
gulp.task('sprites', function() {
    var spriteData = gulp.src('./dev/assets/images/icons/normal/*.png')
        .pipe($.spritesmith({
            retinaSrcFilter: './dev/assets/images/icons/normal/*-2x.png',
            retinaImgName: '../images/sprite-2x.png',
            imgName: 'sprite.png',
            imgPath: '../images/sprite.png',
            cssName: '_icons-sprites.scss',
            //cssFormat: 'scss',
            //cssSpritesheetName :'icons-',
            padding: 20,
            algorithm: '', //图像排序算法：top-down,left-right,diagonal,alt-diagonal,binary-tree
        }));

    var imgStream = spriteData.img
        .pipe(buffer())
        .pipe(gulp.dest(configUrl.folder.images))

    var cssStream = spriteData.css
        .pipe(gulp.dest(configUrl.folder.sprites))

    //生成多个精灵图
    var spirteFile = gulp.src('./dev/assets/images/icons1/*.png')
        .pipe($.spritesmith({
            cssOpts: {
                cssSelector: function(item) {
                    // If this is a hover sprite, name it as a hover one (e.g. 'home-hover' -> 'home:hover')
                    if (item.name.indexOf('-hover') !== -1) {
                        return '.icons-' + item.name.replace('-hover', ':hover');
                        // Otherwise, use the name as the selector (e.g. 'home' -> 'home')
                    } else {
                        return '.icons-' + item.name;
                    }
                }
            },
            imgName: 'sprite-foods.png',
            imgPath: '../images/sprite-foods.png',
            cssName: '_foods-sprites.scss',
            cssFormat: 'css',
            cssSpritesheetName: 'foods', //变量名称
            padding: 10,
            algorithm: 'binary-tree', //top-down,left-right,diagonal,alt-diagonal,binary-tree
        }));

    var imgFood = spirteFile.img
        .pipe(buffer())
        .pipe(gulp.dest(configUrl.folder.images))

    var cssFood = spirteFile.css
        .pipe(gulp.dest(configUrl.folder.sprites))

    return merge([imgStream, cssStream, imgFood, cssFood]);
});

//sass编译
gulp.task('sass', function() {
    return gulp.src(configUrl.file.scss)
        .pipe($.sourcemaps.init({loadMaps: true}))
        .pipe($.sass().on('error', $.sass.logError))
        .pipe($.autoprefixer())
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest(configUrl.folder.css))
        .pipe($.livereload());
});

//压缩排序优化CSS
gulp.task('minicss', function() {
    return gulp.src(configUrl.file.css)
        //.pipe($.autoprefixer())
        .pipe($.csscomb())
        .pipe($.csso())
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(gulp.dest(configUrl.file.css));
});

//加MD5
gulp.task('md5:css', ['minicss'], function(done) {
    gulp.src(configUrl.file.css)
        .pipe(md5(10, './app/html/*.html'))
        .pipe(gulp.dest(configUrl.folder.css))
        .pipe($.livereload())
        .on('end', done);
});


gulp.task('minifyjs', function() {
    return gulp.src(configUrl.file.js) //需要操作的文件
        //.pipe($.concat('main.js'))    //合并所有js到main.js
        //.pipe(gulp.dest('js'))       //输出到文件夹
        //.pipe($.rename({suffix: '.min'}))   //rename压缩后的文件名
        .pipe($.uglify()) //压缩
        .pipe(gulp.dest(configUrl.folder.js)); //输出
});

//tinypng图片压缩
gulp.task('tinypng', function() {
    return gulp.src(configUrl.file.images)
        .pipe($.cache($.tinypng(tinypngApi)))
        .pipe(gulp.dest(configUrl.folder.images))
        .pipe($.livereload());
});

//fileinclude
gulp.task('fileinclude', function() {
    gulp.src(configUrl.file.html)
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(configUrl.folder.html));
});

//压缩html
gulp.task('htmlmin', function() {
    return gulp.src(configUrl.file.htmlfile)
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(configUrl.file.html))
        .pipe($.livereload());
});


// 监听
gulp.task('watch', function() {
    //gulp.watch(configUrl.file.scss, ['sass']).on('change', $.livereload.changed);
    $.livereload.listen();
    gulp.watch(configUrl.file.scss, ['sass']);
    gulp.watch(configUrl.file.html, ['fileinclude']);
    //gulp.watch('./dev/html/*.html', ['htmlmin']);

    gulp.watch(['./dev/**/*.{html,js,css,scss,jpg,png}', '*.html', './app/**/*.{html,js,css,scss,jpg,png}']).on('change', function() {
        $.livereload.changed
    });
});

// 发布
gulp.task('default', gulpSequence('clean', 'sass',  'tinypng', 'fileinclude','watch'));
//开发
gulp.task('dev', gulpSequence('clean', 'sprites', 'sass', 'minicss', 'minifyjs', 'tinypng', 'fileinclude', 'htmlmin','md5:css', 'watch'));
