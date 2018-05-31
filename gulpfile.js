var gulp = require('gulp');
var cssmin = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var less = require('gulp-less');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var importCss = require('gulp-import-css');
var watch = require('gulp-watch');
var rename = require('gulp-rename');
var del = require('del');
var imagemin = require('gulp-imagemin');
var gulpRemoveHtml = require('gulp-remove-html');
var removeEmptyLines = require('gulp-remove-empty-lines');
var htmlmin = require('gulp-htmlmin');
var webserver = require('gulp-webserver');
var concat = require('gulp-concat');


var buildBasePath = 'dist/';
var browsers = [
    'last 3 versions',
    'ie >= 8',
    'ie_mob >= 8',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 6',
    'opera >= 12.1',
    'ios >= 6',
    'android >= 4.4',
    'bb >= 10',
    'and_uc 9.9',
]

//清空dist
gulp.task('clean', function (cb) {
    del(['dist'], cb)
});

//less 压缩打包
gulp.task('minStyle', function () {
    gulp.src("src/less/style.less")
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(less())
        .pipe(postcss([
            autoprefixer({
                browsers: browsers,
                cascade: false
            })
        ]))
        .pipe(importCss())
        .pipe(cssmin())
        .pipe(gulp.dest(buildBasePath + 'style'))
})
// less 不压缩打包
gulp.task('style', function () {
    gulp.src("src/less/style.less")
        .pipe(less())
        .pipe(postcss([
            autoprefixer({
                browsers: browsers,
                cascade: false
            })
        ]))
        .pipe(importCss())
        .pipe(gulp.dest(buildBasePath + 'style'))
})

//img 压缩
gulp.task('minImage', function () {
    gulp.src('src/images/*.{png,jpg,gif,ico}')
        .pipe(imagemin({
            optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
        }))
        .pipe(gulp.dest('dist/images'))
});

//img正常拷贝
gulp.task('image', function () {
    gulp.src('src/images/*.{png,jpg,gif,ico}')
        .pipe(gulp.dest('dist/images'))
});


//html 压缩
gulp.task('minHtml', function () {
    var options = {
        removeComments: true, //清除HTML注释
        collapseWhitespace: false, //压缩HTML
        collapseBooleanAttributes: false, //省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
        // removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
        // removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
        // minifyJS: true, //压缩页面JS
        // minifyCSS: true //压缩页面CSS
    };
    gulp.src('src/pages/*.html')
        .pipe(gulpRemoveHtml()) //清除特定标签
        .pipe(removeEmptyLines({
            removeComments: true
        })) //清除空白行
        // .pipe(htmlmin(options))
        .pipe(gulp.dest(buildBasePath + 'pages'))
});

//html 正常拷贝
gulp.task('html', function () {
    gulp.src('src/pages/*.html')
        .pipe(gulp.dest(buildBasePath + 'pages'))
});

//js 压缩
gulp.task('minScript', function () {
    gulp.src('src/js/*.js')
        .pipe(uglify())
        .pipe(concat('app.min.js'))
        .pipe(gulp.dest('dist/js/'))
})

//js 不压缩打包
gulp.task('script', function () {
    gulp.src('src/js/*.js')
        .pipe(concat('app.js'))
        .pipe(gulp.dest('dist/js/'))
})

//复制文件夹
gulp.task('copy', function () {
    gulp.src('src/plugins/*')
        .pipe(gulp.dest(buildBasePath + 'plugins'));
});

//监听
gulp.task('watch', function () {
    gulp.watch("src/less/*.less", ['style']);
    gulp.watch("src/pages/*.html", ['html']);
    gulp.watch('src/images/*.{png,jpg,gif,ico}', ['image']);
    gulp.watch('src/js/*.js', ['script']);
    gulp.watch('src/plugins/*', ['copy']);
});


//服务器
gulp.task('webserver', function () {
    gulp.src('dist')
        .pipe(webserver({
            livereload: true,
            port: 2333,
            open: true,
            fallback: 'pages/index.html'
        }));
});


gulp.task('default', ['webserver', 'watch']);
//empty dist
gulp.task('clear', ['clean']);
//build
gulp.task('build', ['minStyle', 'html', 'minImage', 'minScript', 'copy']);
//build All
gulp.task('buildAll', ['minStyle', 'style', 'html', 'minImage', 'minScript','script','copy']);