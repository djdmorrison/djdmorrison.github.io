var gulp = require('gulp'),
    sass = require('gulp-sass'),
    cssnano = require('gulp-cssnano'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync').create(),
    browserSyncReuseTab = require('browser-sync-reuse-tab')(browserSync),
    zip = require('gulp-zip');


gulp.task('sass', function () {
    return gulp.src('app/css/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(concat('main.css'))
        .pipe(sass({ errLogToConsole: true }))
        .pipe(cssnano())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('app/css'));
});

gulp.task('browserSync', function (done) {
    browserSync.init({
        server: {
            baseDir: 'app'
        },
        notify: false,
    }, browserSyncReuseTab);

    done();
});

// BrowserSync Reload
function browserSyncReload(done) {
    browserSync.reload();
    done();
}

gulp.task('html:dist', function () {
    return gulp.src(['app/index.html'])
        .pipe(gulp.dest('dist'));
});

gulp.task('css:dist', function () {
    return gulp.src(['app/css/main.css', 'app/css/normalize.css'])
        .pipe(gulp.dest('dist/css'));
});

gulp.task('img:dist', function () {
    return gulp.src(['app/images/*'])
        .pipe(gulp.dest('dist/images'));
});

gulp.task('dist', gulp.parallel('html:dist', 'css:dist', 'img:dist', function () {
    return gulp.src('dist/**/')
        .pipe(zip('archive.zip'))
        .pipe(gulp.dest('dist'));
}));

gulp.task('default', gulp.parallel('browserSync', 'sass', function () {
    gulp.watch('app/index.html', browserSyncReload);
    gulp.watch('app/css/**/*.scss', gulp.series('sass', browserSyncReload));
}));
