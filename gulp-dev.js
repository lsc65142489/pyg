// 开发环境的代码

console.log("============开发环境========");
// 1. 先删除旧的文件 del
// 2. 要编译less文件 
// 3. 要给css添加对应的浏览器前缀
// 4. 要生成样式文件的同时也顺便生成map文件，js文件也是有map文件
//    js的map文件可以直接在谷歌浏览器里面将代码映射回到es6的源代码中 
// 5. 将es6的语法编译成 es5语法
// 6. 不要丑化或者混淆就是代码
// 7. 要实现标签文件的组件化功能
// 8. 要实现自动打开浏览器和自动根据文件的改变去刷新浏览器
// 9. 不要添加静态资源指纹的功能 
// 10. 复制第三方的插件资源到 dist目录下 

// 1引入插件
const gulp = require("gulp");
const del = require('del');
const less = require("gulp-less");
const autoprefixer = require("gulp-autoprefixer");
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const fileInclude = require("gulp-file-include");
const browserSync = require("browser-sync");



// 2删除任务
gulp.task("delete", () => {
    return del(["./dist"]);
})

// 3处理css任务的，其中包含了2.3.4的需求
gulp.task("css", () => {
    return gulp.src("./src/css/*.less")
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("./dist/css"))
});

// 4转义 es6到es5,同时带有map功能
gulp.task("js", () => {
    return gulp.src("./src/js/*.js")
        // 在转义之前先记住样子，下面再渲染
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("./dist/js/"))
});

// 5实现标签组件化功能，也就是处理html
gulp.task("html", () => {
    return gulp
        .src("src/*.html")
        .pipe(
            fileInclude({
                prefix: "@@",
                basepath: "src/components/",
            })
        )
        .pipe(gulp.dest("dist/"))
});

// 5.5执行复制第三方任务
gulp.task("lib",()=>{
    // **代表的是获取所有的文件
    return gulp.src("./src/lib/**")
    .pipe(gulp.dest("./dist/lib/"));
})
// 6自动打开浏览器和监听文件的改变 刷新浏览器
gulp.task("autopage", () => {
    browserSync({
      server: { 
        baseDir: "./dist/"
      },
      port: 9999
    });
    // 监听html文件的改变，从新执行html任务，刷新浏览器
    gulp.watch(["src/*.html","src/components/*.html"],gulp.series(["html","reload"]));
    gulp.watch(["src/css/*.less"],gulp.series(["css","reload"]));
    gulp.watch(["src/js/*.js"],gulp.series(["js","reload"]));
  
  })
  gulp.task("reload", (done) => {
    // 开始刷新页面
    browserSync.reload();
    done();
  });
// 0定义默认任务
gulp.task("default", gulp.series(["delete", "css", "js", "html","lib","autopage"]));