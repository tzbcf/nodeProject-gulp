# nodeProject-gulp


这是一个Node后端工程项目的打包；支持后端工程es6,es7的语法打包！


/**
 * src源目录，
 * dist目标打包目录
 **/
const config = {
    src: "extend001-dev",
    dist: "extend001-pro"
}

/**
 * 拷贝目录，主要把除js与json文件外的文件拷贝到打包目录
 **/
gulp.task('copy',function(){
    gulp.src([config.src+'/**/*',`!${config.src}/**/*.js`,`!${config.src}/**/*.json`])
        .pipe(gulp.dest(config.dist));
});


/**
 * 执行JS压缩
 **/
gulp.task('js', [], function(cb) {
    gulp.src([`${config.src}/**/*.js`])
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
 **/
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


es7语法中需要.babelrc文件；
配置项如下：

{
    "presets": [
        "es2015","es2016", "es2017"
    ],
  "plugins": [[
    "transform-runtime",
    {
      "helpers": false,
      "polyfill": false,
      "regenerator": true,
      "moduleName": "babel-runtime"
    }
    ]]
}