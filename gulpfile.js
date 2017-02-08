var gulp = require('gulp');
var sass = require('gulp-sass'); // SASS编译
var less = require('gulp-less'); // LESS编译
var autoprefixer = require('gulp-autoprefixer'); // 自动添加CSS3浏览器前缀
var uglify = require('gulp-uglify'), // js压缩
    rename = require('gulp-rename'), // 文件重命名
    sourcemaps = require('gulp-sourcemaps'); // 来源地图
var imagemin = require('gulp-imagemin'), // 图片压缩
    pngquant = require('imagemin-pngquant'); // 深度压缩
var livereload = require('gulp-livereload'), // 网页自动刷新（文件变动后即时刷新页面）
    webserver = require('gulp-webserver'); // 本地服务器
var changed = require('gulp-changed'); // 只操作有过修改的文件
var concat = require("gulp-concat"); // 文件合并
var clean = require('gulp-clean'); // 文件清理
var minifyCss = require('gulp-minify-css'); // CSS压缩




/* = 全局设置
-------------------------------------------------------------- */
var srcPath = {
    html: 'src/**/*.html',
    css: 'src/css/**/*.css',
    script: 'src/js/**/*.js',
    images: 'src/images/**/*.{png,jpg,gitf,svg}'
};
var destPath = {
    html: 'dist',
    css: 'dist/css',
    script: 'dist/js',
    images: 'dist/images'
};

/* = 代码
-------------------------------------------------------------- */
// HTML处理
gulp.task('html', function() {
    return gulp.src(srcPath.html)
        .pipe(changed(destPath.html))
        .pipe(gulp.dest(destPath.html));
});

// 样式处理
gulp.task('sass', function() {
    return gulp.src(srcPath.css)
        // .pipe(changed(destPath.css))
        // .pipe(sourcemaps.init()) // 执行sourcemaps
        // .pipe(sass({ style: 'compressed' }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'], // 主流浏览器的最新两个版本
            cascade: true, // 是否美化属性值
            remove: true //是否去掉不必要的前缀 默认：true 
        }))
        // .pipe(sourcemaps.write('maps')) // 地图输出路径（存放位置）
        .pipe(gulp.dest(destPath.css));
});


gulp.task('less', function() {
    return gulp.src('src/css/**/*.less')
        // .pipe(changed(destPath.css))
        .pipe(sourcemaps.init()) // 执行sourcemaps
        .pipe(less())
        .pipe(sourcemaps.write('maps')) // 地图输出路径（存放位置）
        .pipe(gulp.dest(destPath.css));
});

//css压缩
gulp.task('minicss', function() {
    return gulp.src(destPath.css + '/**/*.css')
        .pipe(minifyCss())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(destPath.css))
})

//js压缩&重新命名
gulp.task('script', function() {
    return gulp.src(srcPath.script)
        .pipe(changed(destPath.script))
        .pipe(sourcemaps.init()) // 执行sourcemaps
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify({ preserveComments: 'some' }))
        .pipe(sourcemaps.write('maps')) // 地图输出路径（存放位置）
        .pipe(gulp.dest(destPath.script));
});

//文件合并
gulp.task('concat', function() {
    gulp.src(destPath.script + '*.min.js')
        .pipe(concat('dist.min.js'))
        .pipe(gulp.dest(destPath.script));
});
//文件清理
gulp.task('clean', function() {
    return gulp.src('dist/js/maps', { read: false })
        .pipe(clean());
});

//图片压缩
gulp.task('images', function() {
    return gulp.src(srcPath.images)
        .pipe(changed(destPath.images))
        .pipe(imagemin({
            progressive: true, // 无损压缩JPG图片
            svgoPlugins: [{ removeViewBox: false }], // 不移除svg的viewbox属性
            use: [pngquant()] // 使用pngquant插件进行深度压缩
        }))
        .pipe(gulp.dest(destPath.images));
});



//页面自动刷新
gulp.task('websever', function() {
    gulp.src('.')
        .pipe(webserver({
            livereload: true, // 启用LiveReload
            open: true // 服务器启动时自动打开网页
        }));
});

//监听任务
gulp.task('watch', function() {
    gulp.watch(srcPath.css, ['sass'])
    gulp.watch(srcPath.html, ['html'])
    gulp.watch(srcPath.images, ['images'])
    gulp.watch(srcPath.script, ['script'])
});

//默认任务
gulp.task('default', ['websever', 'watch'])