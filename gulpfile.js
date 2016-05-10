var gulp = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    buffer = require('vinyl-buffer'),
    merge = require('merge-stream'),
    gulpSequence = require('gulp-sequence'),
    cleanCSS = require('gulp-clean-css'),
    $ = gulpLoadPlugins();


$.livereload({
    start: true
})

//配置路径
var baseUrl = './dev/assets/';
var tinypngApi = 'm66cergQwJ-L96d3X1QhVs-mQs8WzrPm';
var configUrl = {
    assets: {
        css: baseUrl + 'css/*.css',
        scss: baseUrl + 'sass/**/*.scss',
        js: baseUrl + 'js/*.js',
        images: baseUrl + 'images/*.{png,jpg}',
        html: './dev/static/*.html'
    },
    dist: {
        css: baseUrl + 'css/',
        images: baseUrl + 'images/',
        js: baseUrl + 'js/',
        scss: baseUrl + 'sass/',
        sprites: baseUrl + 'sass/sprites/'

    }
};

//清除文件
gulp.task('clean', function() {
    return gulp.src('assets', {
            read: false
        })
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
        .pipe(gulp.dest(configUrl.dist.images))

    var cssStream = spriteData.css
        .pipe(gulp.dest(configUrl.dist.sprites))

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
        .pipe(gulp.dest(configUrl.dist.images))

    var cssFood = spirteFile.css
        .pipe(gulp.dest(configUrl.dist.sprites))

    return merge([imgStream, cssStream, imgFood, cssFood]);
});

//sass编译
gulp.task('sass', function() {
    return gulp.src(configUrl.assets.scss)
        .pipe($.sourcemaps.init())
        .pipe($.sass({ outputStyle: 'compressed' }).on('error', $.sass.logError))
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest(configUrl.dist.css))
        .pipe($.livereload());
});





//压缩排序优化CSS
gulp.task('minicss', function() {
    return gulp.src(configUrl.assets.css)
        .pipe($.autoprefixer())
        .pipe($.csscomb())
        .pipe($.csso())
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(gulp.dest(configUrl.dist.css));
});

//tinypng图片压缩
gulp.task('tinypng', function() {
    return gulp.src(configUrl.assets.images)
        .pipe($.cache($.tinypng(tinypngApi)))
        .pipe(gulp.dest(configUrl.dist.images));
});



// 监听
gulp.task('watch', function() {
    //gulp.watch(configUrl.assets.scss, ['sass']).on('change', $.livereload.changed);
    gulp.watch(configUrl.assets.scss, ['sass', 'minicss']);
    gulp.watch(['./dev/**/*.*', '*.html']).on('change', function() { $.livereload.changed });
});

// gulp.task('default', ['compass','minicss' ,'tinypng', 'watch']);
gulp.task('default', gulpSequence('sprites', 'sass', 'minicss', 'tinypng', 'watch'));
