var gulp = require('gulp');
var replace = require('gulp-replace');
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var tsify = require("tsify");
var watchify = require("watchify");
var gutil = require("gulp-util");

var paths = {
  pages: ['src/*.html'],
  libs: ['node_modules/phaser/build/phaser.min.js'],
  typings: [
    'node_modules/phaser/typescript/p2.d.ts',
    'node_modules/phaser/typescript/phaser.d.ts',
    'node_modules/phaser/typescript/pixi.d.ts',
  ],
  assets: [
    'src/assets/**/*'
  ]
};

var dest = {
  typings: 'typings',
  js: 'dist/js',
  assets: 'dist/assets'
}

var browserifyProject = browserify({
  basedir: '.',
  debug: true,
  entries: ['src/app/maze-game.ts'],
  cache: {},
  packageCache: {}
});
var watchedBrowserify = watchify(browserifyProject).plugin(tsify);


function bundle() {
  return watchedBrowserify
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(dest.js));
}

gulp.task("copy-html", function () {
  return gulp.src(paths.pages)
    .pipe(gulp.dest("dist"));
});

gulp.task("libs", function () {
  return gulp.src(paths.libs)
    .pipe(gulp.dest(dest.js));
});

gulp.task('clean', function () {
  return gulp.src(['dist', 'typings'], { read: false })
    .pipe(clean());
});

gulp.task('typings', function () {
  gulp
    .src(paths.typings)
    .pipe(gulp.dest(dest.typings));
})

gulp.task('assets', function () {
  gulp
    .src(paths.assets)
    .pipe(gulp.dest(dest.assets));
})

gulp.task('cordova', function () {
  gulp
    .src(['dist/**/*'])
    .pipe(replace('<!--cordova-->', '<script type="text/javascript" src="cordova.js"></script>'))
    .pipe(gulp.dest('mobile/www/'));
});

gulp.task("default", ["typings", "copy-html", "libs", "assets"], function () {
  bundle();
  gulp.watch(paths.assets, ['assets']);
  gulp.watch(paths.pages, ['copy-html']);
});
watchedBrowserify.on("update", bundle);
watchedBrowserify.on("log", gutil.log);


