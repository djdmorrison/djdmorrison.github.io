var gulp = require('gulp'),
    sass = require('gulp-sass'),
    cssnano = require('gulp-cssnano'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync').create(),
    browserSyncReuseTab = require('browser-sync-reuse-tab')(browserSync),
    zip = require('gulp-zip'),
    ghPages = require('gulp-gh-pages');


gulp.task('sass', function() {
    return gulp.src('app/css/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(concat('main.css'))
        .pipe(sass({errLogToConsole: true}))
        .pipe(cssnano())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('app/css'));
});

gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: 'app'
        },
        notify: false,
    }, browserSyncReuseTab);
});

gulp.task('html:dist', function() {
    return gulp.src(['app/index.html'])
        .pipe(gulp.dest('dist'));
});
gulp.task('css:dist', function() {
    return gulp.src(['app/css/main.css', 'app/css/normalize.css'])
        .pipe(gulp.dest('dist/css'));
});
gulp.task('img:dist', function() {
    return gulp.src(['app/images/*'])
        .pipe(gulp.dest('dist/images'));
});
gulp.task('dist', ['html:dist', 'css:dist', 'img:dist'], function() {
    gulp.src('dist/**/')
        .pipe(zip('archive.zip'))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['browserSync', 'sass'], function() {
    var reload = browserSync.reload;

    gulp.watch('app/index.html', reload);
    gulp.watch('app/css/**/*.scss', ['sass', reload]);
});

gulp.task('deploy', function() {
    gulp.src('./dist/**/*')
        .pipe(ghPages());
});
