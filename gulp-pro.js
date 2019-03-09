// 生产环境到的代码

console.log("============生产环境===========");
// 1. 先删除旧的文件 
// 2. 要编译less文件 
// 3. 要给css添加对应的浏览器前缀
// 3.5压缩css代码
// 4. 将es6的语法编译成 es5语法
// 5. 要丑化或者混淆就是代码
// 6. 要实现标签文件的组件化功能
// 7. 要添加静态资源指纹的功能 
// 8. 复制第三方的插件资源到 dist目录下 

const gulp = require("gulp");
const del = require('del');
const less = require("gulp-less");
const autoprefixer = require("gulp-autoprefixer");
const babel = require('gulp-babel');
const uglify = require("gulp-uglify");
const fileInclude = require("gulp-file-include");
const rev = require("gulp-rev");
const revCollector = require("gulp-rev-collector");
const cssmin = require('gulp-cssmin');
// 2删除任务
gulp.task("delete", () => {
    return del(["./dist"]);
})
// 3处理css任务的，其中包含了2.3.4的需求
gulp.task("css", () => {
    return gulp.src("./src/css/*.less")
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        // 压缩代码
        .pipe(cssmin())
        // 在这里可以直接生成指纹文件
        .pipe(rev())
        .pipe(gulp.dest("./dist/css/"))
        //生成字典文件
        .pipe(rev.manifest({
            path: "rev-css.json"
        }))
        //   4 把这个字典文件存放到那里去
        .pipe(gulp.dest("./rev/"));
});
// 4转义 es6到es5 丑化文件，添加指纹
gulp.task("js", () => {
    return gulp.src("./src/js/*.js")
        .pipe(babel({
            presets: ['@babel/env']
        }))
        // 可以直接在这里丑化文件
        .pipe(uglify(
            {
                mangle: {
                    toplevel: true
                }
            }
        ))
        // 这里也添加指纹
        .pipe(rev())
        .pipe(gulp.dest("./dist/js/"))
        .pipe(rev.manifest({
            path: "rev-js.json"
        }))
        //   4 把这个字典文件存放到那里去
        .pipe(gulp.dest("./rev/"));
});
// 5要实现标签文件的组件化功能
gulp.task("html", () => {
    return gulp
        .src(["src/*.html", "./rev/*.json"])
        .pipe(
            fileInclude({
                prefix: "@@",
                basepath: "src/components/",
            })
        )
        //使用插件来替换静态资源
        .pipe(revCollector())
        .pipe(gulp.dest("dist/"));
});
// 5.5执行复制第三方任务
gulp.task("lib",()=>{
    // **代表的是获取所有的文件
    return gulp.src("./src/lib/**")
    .pipe(gulp.dest("./dist/lib/"));
});

// 0定义默认任务
gulp.task("default", gulp.series(["delete", "css", "js", "html","lib"]));