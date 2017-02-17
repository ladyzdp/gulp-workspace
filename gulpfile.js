var url = require('url');
var fs = require('fs');
var path = require('path');
var gulp = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    buffer = require('vinyl-buffer'),
    merge = require('merge-stream'),
    gulpSequence = require('gulp-sequence'),
    cleanCSS = require('gulp-clean-css'),
    livereload = require('gulp-livereload'),
    webserver = require('gulp-webserver'),
    fileinclude = require('gulp-file-include'),
    $ = gulpLoadPlugins();


livereload({ start: true, auto: false });
//配置路径
var baseUrl = './dev/';
var distUrl = './app/';
var tinypngApi = 'm66cergQwJ-L96d3X1QhVs-mQs8WzrPm';
var configUrl = {
    file: {
        css: baseUrl + 'assets/css/*.css',
        scss: baseUrl + 'assets/sass/**/*.scss',
        images: baseUrl + 'assets/images/*.{png,jpg}',
        js: baseUrl + 'assets/js/*.js',
        html: baseUrl + 'static/*.html',
        htmlfile: baseUrl + '*.html',
        tpl: baseUrl + 'tpl/*.tpl'
    },
    folder: {
        css: baseUrl + 'assets/css',
        images: baseUrl + 'assets/images',
        scss: baseUrl + 'assets/sass',
        sprites: baseUrl + 'assets/sass/sprites',
        js: baseUrl + 'assets/js',
        html: baseUrl

    },
    dist: {
        css: distUrl + 'assets/css',
        images: distUrl + 'assets/images',
        scss: distUrl + 'assets/sass',
        sprites: distUrl + 'assets/sass/sprites',
        js: distUrl + 'assets/js',
        html: distUrl + 'html'
    }
};



//清除文件
gulp.task('clean', function() {
    return gulp.src(configUrl.file.htmlfile)
        .pipe($.clean())
        .pipe($.clean());
});

//制作精灵图
gulp.task('sprites', function() {
    //2 倍图
    // var spriteData = gulp.src('./dev/assets/images/icons/*.png')
    //     .pipe($.spritesmith({
    //         retinaSrcFilter: './dev/assets/images/icons/*@2x.png',
    //         retinaImgName: '../images/sprite@2x.png',
    //         imgName: 'sprite@2x.png',
    //         imgPath: '../images/sprite@2x.png',
    //         cssName: '_icons-sprites.scss',
    //         //cssFormat: 'scss',
    //         //cssSpritesheetName :'icons-',
    //         padding: 20,
    //         algorithm: '', //图像排序算法：top-down,left-right,diagonal,alt-diagonal,binary-tree
    //     }));

    // var imgStream = spriteData.img
    //     .pipe(buffer())
    //     .pipe(gulp.dest(configUrl.folder.images));

    // var cssStream = spriteData.css
    //     .pipe(gulp.dest(configUrl.folder.sprites));

    //生成多个精灵图
    var spirteFile = gulp.src('./dev/assets/images/icons/*.png')
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
            imgName: 'sprite.png',
            imgPath: '../images/sprite.png',
            cssName: '_icons.scss',
            cssFormat: 'css',
            //cssSpritesheetName: 'foods', //变量名称
            padding: 50,
            algorithm: 'top-down', //top-down,left-right,diagonal,alt-diagonal,binary-tree
        }));

    var imgSprite = spirteFile.img
        .pipe(buffer())
        .pipe(gulp.dest(configUrl.folder.images));

    var cssSprite = spirteFile.css
        .pipe(gulp.dest(configUrl.folder.sprites));

    return merge([imgSprite, cssSprite]);
});

//sass编译
gulp.task('sass', function() {
    return gulp.src(configUrl.file.scss)
        .pipe($.sourcemaps.init({ loadMaps: true }))
        .pipe($.sass().on('error', $.sass.logError))
        // .pipe($.autoprefixer())
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest(configUrl.folder.css))
        .pipe(livereload());
});

//压缩排序优化CSS
gulp.task('minicss', function() {
    return gulp.src(configUrl.file.css)
        .pipe($.autoprefixer())
        .pipe($.csscomb())
        .pipe($.csso())
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(gulp.dest(configUrl.folder.css));
});




//tinypng图片压缩
gulp.task('tinypng', function() {
    return gulp.src(configUrl.file.images)
        .pipe($.cache($.tinypng(tinypngApi)))
        .pipe(gulp.dest(configUrl.folder.images));

});

//fileinclude
gulp.task('fileinclude', function() {
    gulp.src([configUrl.file.html])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(configUrl.folder.html))
        .pipe(livereload());
});

// webserver
gulp.task('webserver', function() {
    gulp.src('./dev') // 服务器目录（./代表根目录）
        .pipe(webserver({ // 运行gulp-webserver
            // host:'192.168.3.113',
            port: 8006, //端口，默认8000
            livereload: true, // 启用LiveReload
            open: true, // 服务器启动时自动打开网页
            directoryListing: {
                enable: true,
                path: './dev/index.html'
            },
            middleware: function(req, res, next) {
                //mock local data
                var urlObj = url.parse(req.url, true),
                    method = req.method;

                if (!urlObj.pathname.match(/^\/api/)) { //不是api开头的数据，直接next
                    next();
                    return;
                }
                var mockDataFile = path.join(__dirname, urlObj.pathname) + ".js";
                //file exist or not
                fs.access(mockDataFile, fs.F_OK, function(err) {
                    if (err) {
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({
                            "status": "没有找到此文件",
                            "notFound": mockDataFile
                        }));
                        return;
                    }
                    var data = fs.readFileSync(mockDataFile, 'utf-8');
                    res.setHeader('Content-Type', 'application/json');
                    res.end(data);
                });
                next();
            },
            proxies: []
        }));
});

// 监听
gulp.task('watch', function() {
    livereload.listen();
    gulp.watch([configUrl.file.scss, "src/sass/*.scss"], ['sass']);
    gulp.watch([configUrl.file.html, configUrl.file.tpl], ['fileinclude']);

});

// 发布
<<<<<<< HEAD
gulp.task('default', gulpSequence('clean', 'fileinclude', 'sass', 'minicss', 'webserver', 'watch'));
=======
gulp.task('default', gulpSequence('clean', 'sass',  'tinypng', 'fileinclude','watch'));
>>>>>>> 8b5b6689cdac9d1c778e4b7b679c424c08b07d61
//开发
gulp.task('dev', gulpSequence('clean', 'sprites', 'sass', 'minicss', 'minifyjs', 'tinypng', 'fileinclude', 'htmlmin', 'md5:css', 'watch'));