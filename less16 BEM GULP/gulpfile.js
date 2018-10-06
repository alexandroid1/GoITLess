'use strict';
// npm install -g npm-check
// npm-check - use for check updates.

var gulp = require('gulp'); 
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var rigger = require('gulp-rigger');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
var cssnano = require('gulp-cssnano');
var del = require('del');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var browserify = require('browserify');
var babelify = require("babelify");
var source = require('vinyl-source-stream');


var serverConfig = {
    server: {
        baseDir: './build'
    },
    host: 'localhost',
    port: 9000,
    logPrefix: 'NASA',
    notify: false
};


gulp.task('sass', function () {
    return gulp.src('./src/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(concat('stylesheet.css'))
        .pipe(cssnano())
        .pipe(gulp.dest('./build/css'))
        .pipe(browserSync.reload({stream:true}));

});

gulp.task('js', function () {
    return gulp.src('./src/js/*.js')
        .pipe(concat('script.js'))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./build/js'))
        .pipe(browserSync.reload({stream:true}));

});


// gulp.task('js', function () {
//     return browserify({entries: './src/js/script.js', extensions: ['.js'], debug: true})
//         .transform('babelify', {presets: ['es2015', 'react']})
//         .bundle()
//         .pipe(source('script.js'))
//         .pipe(gulp.dest('./build/js'))
//         .pipe(browserSync.reload({stream:true}));
// });


gulp.task ('js_dep', function(){
    return gulp.src('./src/libs/*.js')
    .pipe(gulp.dest('./build/js'));
});

gulp.task('bundleFonts', function() {
    return gulp.src('./src/fonts/**/*.*')
        .pipe(gulp.dest('./build/fonts'));
});

gulp.task('bundleImg', function() {
    return gulp.src('./src/img/**/*.+(png|jpg|gif|svg)')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest('./build/img'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('html', function () {
    return gulp.src('./src/*.html')
        .pipe(rigger())
        .pipe(gulp.dest('./build'))
        .pipe(browserSync.reload({stream:true}));
});

gulp.task('watch', function () {
    gulp.watch('./src/sass/**/*.scss', ['sass']);
    gulp.watch('./src/js/*.js', ['js']);
    gulp.watch('./src/img/*.+(png|jpg|gif|svg)', ['bundleImg']);
    gulp.watch('./src/*.html', ['html']);
    gulp.watch('./src/html/*.html', ['html']);
    gulp.watch('./src/fonts/**/*.*', ['bundleFonts']);
});

gulp.task('svg', function () {
    return gulp.src('./src/svg/*.svg')
        .pipe(gulp.dest('./build/svg'))
        .pipe(browserSync.reload({stream:true}));
});

gulp.task('sound', function () {
    return gulp.src('./src/sound/*.wav')
        .pipe(gulp.dest('./build/sound'))
        .pipe(browserSync.reload({stream:true}));
});


gulp.task('webServer', function () {
    browserSync(serverConfig);

});

gulp.task('clean:build', function () {
    return del.sync('./build');

});


gulp.task("start",["clean:build","html", "js", "js_dep", "sass","svg","sound","bundleImg","bundleFonts", "webServer", "watch"]);


