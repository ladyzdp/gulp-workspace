// 'use strict';
// 载入外挂
var gulp = require('gulp'),
    compass = require('gulp-compass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload');
 
// // 样式
// gulp.task('compass', function() {
//   gulp.src('./sass/*.scss')
//     .pipe(compass({
//       config_file: './config.rb',
//       css: 'css',
//       sass: 'sass'
//     }))
//     .pipe(gulp.dest('app/assets/temp'));
// });
// // 脚本
// gulp.task('scripts', function() { 
//   return gulp.src('src/scripts/**/*.js')
//     .pipe(jshint('.jshintrc'))
//     .pipe(jshint.reporter('default'))
//     .pipe(concat('main.js'))
//     .pipe(gulp.dest('dist/scripts'))
//     .pipe(rename({ suffix: '.min' }))
//     .pipe(uglify())
//     .pipe(gulp.dest('dist/scripts'))
//     .pipe(notify({ message: 'Scripts task complete' }));
// });
 
// // 图片
// gulp.task('images', function() { 
//   return gulp.src('src/images/**/*')
//     .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
//     .pipe(gulp.dest('dist/images'))
//     .pipe(notify({ message: 'Images task complete' }));
// });
 
// // 清理
// gulp.task('clean', function() { 
//   return gulp.src(['dist/styles', 'dist/scripts', 'dist/images'], {read: false})
//     .pipe(clean());
// });
 
// // 预设任务
// gulp.task('default', ['clean'], function() { 
//     gulp.start('styles', 'scripts', 'images');
// });
 
// // 看手
// gulp.task('watch', function() {
 
//   // 看守所有.scss档
//   gulp.watch('src/styles/**/*.scss', ['styles']);
 
//   // 看守所有.js档
//   gulp.watch('src/scripts/**/*.js', ['scripts']);
 
//   // 看守所有图片档
//   gulp.watch('src/images/**/*', ['images']);
 
//   // 建立即时重整伺服器
//   var server = livereload();
 
//   // 看守所有位在 dist/  目录下的档案，一旦有更动，便进行重整
//   gulp.watch(['dist/**']).on('change', function(file) {
//     server.changed(file.path);
//   });
 
// });