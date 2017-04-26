var gulp = require('gulp');
var gulpCopy = require('gulp-copy');
var ts = require('gulp-typescript');
var merge = require('merge2');
var sourcemaps = require('gulp-sourcemaps');
var clean = require('gulp-clean');

var typings = [
  'node_modules/phaser/typescript/p2.d.ts',
  'node_modules/phaser/typescript/phaser.d.ts',
  'node_modules/phaser/typescript/pixi.d.ts',
  // 'node_modules/phaser/typescript/phaser.comments.d.ts'
]

var libs = [
  'node_modules/phaser/build/phaser.min.js'
]

var assets = [
  'src/assets/**/*'
]

var destinationTypings = 'typings';
var destinationLibs = 'dist/libs';
var desinationAssets = 'dist/assets';

gulp.task('clean', function () {
  return gulp.src(['dist', 'typings'], { read: false })
    .pipe(clean());
});

gulp.task('typings', function () {
  gulp
    .src(typings)
    // .pipe(gulpCopy(destination, options))
    // .pipe(otherGulpFunction())
    .pipe(gulp.dest(destinationTypings));
})


// gulp.task('clean-assets', function () {
//   return gulp.src(desinationAssets, { read: false })
//     .pipe(clean());
// });

gulp.task('assets', function () {

  gulp
    .src(assets)
    .pipe(gulp.dest(desinationAssets));
})

gulp.task('libs', function () {
  gulp
    .src(libs)
    .pipe(gulp.dest(destinationLibs));
})

var tsProject = ts.createProject('tsconfig.json');

gulp.task('scripts-client', function () {
  var tsResult = gulp.src([].concat(typings).concat(['src/client/**/*.ts']))
    .pipe(sourcemaps.init())
    .pipe(tsProject());

  return merge([ // Merge the two output streams, so this task is finished when the IO of both operations is done.
    tsResult.dts.pipe(gulp.dest('dist/definitions')),
    tsResult.js.pipe(gulp.dest('dist/'))
  ])
    .pipe(sourcemaps.write());
});

gulp.task('js', function () {
  gulp
    .src(['src/*.js', 'src/*.html'])
    .pipe(gulp.dest('dist'));
})

gulp.task('client', ['typings', 'libs', 'assets', 'scripts-client', 'js'], function () {
  gulp.watch('src/**/*.ts', ['scripts-client']);
  gulp.watch('src/assets/**/*', ['assets']);
  gulp.watch('src/*.js', ['js']);
});

gulp.task('compile', ['typings', 'libs', 'assets', 'scripts-client', 'js'], function () {
});

gulp.task('cordova', ['compile'], function () {
  // gulp
  //   .src('dist/assets/*.html')
    // .pipe(gulpCopy(destination, options))
    // .pipe(otherGulpFunction())
    // .pipe(gulp.dest('tiled-game-cordova/www'));
  gulp
    .src(['dist/**/*'])
    .pipe(gulp.dest('tiled-game-cordova/www/'));
  // gulp
  //   .src(['dist/assets/**/*'])
  //   .pipe(gulp.dest('tiled-game-cordova/www/assets/'));
  // gulp
  //   .src(['dist/libs/**/*'])
  //   .pipe(gulp.dest('tiled-game-cordova/www/libs/'));
});

