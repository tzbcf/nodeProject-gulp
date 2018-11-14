const gulp         = require('gulp'),
    clean        = require('gulp-clean'),
    uglify       = require('gulp-uglify'),
    pump         = require('pump'),
    sequence     = require('run-sequence'),
    babel        = require('gulp-babel'),
    gutil        = require('gulp-util'),
    jsonlint     = require("gulp-jsonlint"),
    jsonminify = require('gulp-jsonminify2'),
    eslint = require('gulp-eslint');
/**
 * src源目录，
 * dist目标打包目录
 */
const config = {
    src: "gateway2",
    dist: "gateway1"
}
/**
 * 清理目标目录
 */
gulp.task('clean', function(cb) {
    pump([
        gulp.src(config.dist),
        clean()
    ], cb)
})

/**
 * 拷贝目录，主要把除js与json文件外的文件拷贝到打包目录
 */
gulp.task('copy',function(){
    gulp.src([config.src+'/**/*',`!${config.src}/**/*.js`,`!${config.src}/**/*.json`])
        .pipe(gulp.dest(config.dist));
});

/**
 * 执行JS压缩
 */
gulp.task('js', [], function(cb) {
    gulp.src([`${config.src}/**/*.js`])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(babel())
    .pipe(babel({
        plugins: ['transform-runtime']        // babel-plugin-transform-runtime 在这里使用;
     }))
    .pipe(uglify())
    .on('error', function (err) {
        gutil.log(gutil.colors.red('[Error]'), err);
    })
    .pipe(gulp.dest(config.dist));
});

/**
 * 执行JSON压缩
 */
gulp.task('jsonLint', () => {
    gulp.src([`${config.src}/**/*.json`]),
        jsonlint(),
        jsonlint.reporter(),
        jsonlint.failAfterError()
});

gulp.task('jsonPro', ['jsonLint'], () => {
    gulp.src([`${config.src}/**/*.json`])
        .pipe(jsonminify())
        .on('error', function (err) {
            gutil.log(gutil.colors.red('[Error]'), err);
        })
        .pipe(gulp.dest(config.dist))
})

/**
 * 监听JS文件变改，即时调用任务执行JS增量打包
 */
gulp.task('watch', [], function(cb) {
    gulp.watch(config.src + "/**/*.js", ['js']);
});

/**
 * 开始执行
 */
gulp.task('default', function(cb) {
    sequence('clean','copy', 'jsonPro','js', 'watch', cb);
});