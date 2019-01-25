const {series, watch, task} = require('gulp')
const gulp = require('gulp')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const connect = require('gulp-connect')
const cl = require('gulp-clean')
const fileinclude = require('gulp-file-include')
const fs = require('fs')

connect.server({
    root: 'dist',
    host: '0.0.0.0',
    livereload: true
})
// var minifyCSS = require('gulp-csso');

// The `clean` function is not exported so it can be considered a private task.
// It can still be used within the `series()` composition.
function clean(cb) {
    if (fs.existsSync('./dist')) {
        gulp.src('./dist/*', {read: false})
            .pipe(cl())
    }
    cb()
}


function css(cb) {
    gulp.src('src/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        // .pipe(minifyCSS())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        // .pipe(gulp.dest('css'))
        .pipe(gulp.dest('dist'))
        .pipe(connect.reload())
    cb()
}

function html(cb) {
    gulp.src(['./src/**/*.html','!./src/include/*.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('dist/')).pipe(connect.reload())
    cb()
}

function copyAssets(cb) {
    gulp.src(['img/**/*'], {base: '.'})
        .pipe(gulp.dest('dist/'))
    cb()
}


function watches(cb) {
    watch(['src/**/*.html',], html)
    watch(['src/**/*.scss'], css)
}

exports.default = series(clean, copyAssets, html, css, watches)

