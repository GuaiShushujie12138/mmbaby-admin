/**
 * Created by boris on 2017/5/6.
 */

var fs = require('fs');
var path = require('path');
var merge = require('merge-stream');
var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var order = require("gulp-order");
var ngAnnotate = require('gulp-ng-annotate');
var ngmin = require('gulp-ngmin');
var stripDebug = require('gulp-strip-debug');
var path = require('path');
// var replace = require('gulp-replace');


var basePath='src/main/webapp';
var scriptsPath = basePath+'/app';
var destPath = basePath+'/dist/script';

function getFolders(dir) {
  return fs.readdirSync(dir)
  .filter(function (file) {
    return fs.statSync(path.join(dir, file)).isDirectory();
  });
}

/**
 * 本网站 程序启动脚本
 */
gulp.task('util_scripts', function () {

  return gulp.src([basePath+'/js/utils.js',basePath+'/js/admin.js',basePath+'/js/queryBuilder.js',basePath+'/app/formatter.js'])
  .pipe(concat('crm-admin-utils.js'))
  .pipe(gulp.dest(destPath))
  .pipe(uglify())
  .pipe(rename('crm-admin-utils.min.js'))
  .pipe(gulp.dest(destPath));

});



/**
 * 本网站 程序启动脚本
 */
gulp.task('index_scripts', function () {




  var srcArray=[
    scriptsPath+'/app.core.js',
    scriptsPath+'/app.module.js',
    scriptsPath+'/app.constants.js',
    scriptsPath+'/components/minimaliza-sidebar.directive.js',
    scriptsPath+'/components/side-navigation.directive.js',
    scriptsPath+'/components/spinnerbar.directive.js',
    scriptsPath+'/components/permission.check.service.js',
    scriptsPath+'/components/icheck.directive.js',
    scriptsPath+'/components/Html5notification.directive.js',
    scriptsPath+'/components/scroll.fixed.directive.js',
    scriptsPath+'/filters/http.interceptor.js',
    scriptsPath+'/filters/http.filter.js',
    scriptsPath+'/app.config.js'
  ];



  return gulp.src(srcArray)
  .pipe(concat('crm-admin-index.js'))
  .pipe(gulp.dest(destPath))
  .pipe(ngAnnotate())
  .pipe(ngmin({dynamic: false}))//Pre-minify AngularJS apps with ngmin
  .pipe(stripDebug())//除去js代码中的console和debugger输出
  .pipe(uglify())
  .pipe(rename('crm-admin-index.min.js'))
  .pipe(gulp.dest(destPath));

});

/**
 * 模块脚本
 */
gulp.task('module_scripts', function () {

  var folders = getFolders(scriptsPath);

  var tasks = folders.map(function (folder) {
    // 拼接成 foldername.js
    // 写入输出
    // 压缩
    // 重命名为 folder.min.js
    // 再一次写入输出

    return gulp.src(path.join(scriptsPath, folder, '/**/*.js'))
    .pipe(order([
      "**/*.module.js",
      "**/*.service.js",
      "**/*.controller.js",
      "*.*"
    ]))
    .pipe(concat(folder + '.js'))
    .pipe(gulp.dest(destPath))
    .pipe(ngAnnotate())
    .pipe(ngmin({dynamic: false}))//Pre-minify AngularJS apps with ngmin
    .pipe(stripDebug())//除去js代码中的console和debugger输出
    .pipe(uglify())
    .pipe(rename(folder + '.min.js'))
    .pipe(gulp.dest(destPath));
  });

  return merge(tasks);
});

// gulp.task('addCacheModal',function(){
//   var folders = getFolders(scriptsPath);
//   folders.forEach(function(item,index) {
//     return gulp.src(path.join(scriptsPath,item,'/**/*.controller.js'),{base: './'})
//                .pipe(replace(/\.html'/g,".html?v=' + LG.appConfig.clientVersion"))
//                .pipe(gulp.dest('./'));
//   });
// });

/**
 * 注册监听文件变动打包任务,开发环境模块压缩,避免老是模块加载顺序导致的报错
 */
gulp.task('watchFileModule',function(){
  var watcher = gulp.watch(path.join(scriptsPath,'*/**/*.js'));
  watcher.on('change',function(event) {
    var changePath = event.path;
    var changePathdirname = path.dirname(changePath);
    var folder ='';
    var dirArray = fs.readdirSync('src/main/webapp/app');

    dirArray.filter(function(item,index){
      var resolvePath = path.resolve('src/main/webapp/app',item); // app下目录的绝对路径
      if (resolvePath === changePathdirname || resolvePath === path.join(changePathdirname,'..')) {
        folder = item;
      }
    });
    gulp.src(path.join(scriptsPath, folder, '/**/*.js'))
        .pipe(order([
          "**/*.module.js",
          "**/*.service.js",
          "**/*.controller.js",
          "*.*"
        ]))
        .pipe(concat(folder + '.js'))
        .pipe(gulp.dest(destPath))
        .pipe(ngAnnotate())
        .pipe(ngmin({dynamic: false}))//Pre-minify AngularJS apps with ngmin
        .pipe(stripDebug())//除去js代码中的console和debugger输出
        .pipe(uglify())
        .pipe(rename(folder + '.min.js'))
        .pipe(gulp.dest(destPath));
    console.log('打包完成');
  });

});



gulp.task('default', ['util_scripts','module_scripts','index_scripts']);
