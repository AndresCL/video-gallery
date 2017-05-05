var gulp = require('gulp');
    sass = require('gulp-sass'),
    notify = require('gulp-notify'),
    concat = require('gulp-concat'),
    livereload = require('gulp-livereload'),
    jshint = require('gulp-jshint');

// Copying html
gulp.task('html', function(){
  return gulp.src('source/*.html')
    .pipe(gulp.dest('video_portal_api-master/client'))
    .pipe(notify({ message: 'HTML complete' }));
});

// Copying imgs
gulp.task('imgs', function(){
  return gulp.src('source/img/*.*')
    .pipe(gulp.dest('video_portal_api-master/client/img'))
    .pipe(notify({ message: 'IMG complete' }));
});

// Compiling SASS
gulp.task('sass', function(){
  return gulp.src('source/sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('video_portal_api-master/client/css'))
    .pipe(notify({ message: 'Sass task complete' }));
});

// Copying CSS LIBS 
// gulp.task('css', function() {
//     gulp.src('./node_modules/bootstrap/dist/css/bootstrap.min.css')
//     .pipe(gulp.dest('./video_portal_api/client/css/libs.css'));
// });

// Joining scripts LIBS
gulp.task('lib', function() {
    return gulp.src(
        [
            './node_modules/jquery/dist/jquery.min.js',
            './node_modules/underscore/underscore-min.js',
            './node_modules/underscore.string/dist/underscore.string.min.js',
            './node_modules/backbone/backbone-min.js',
            './source/vendor/jquery.md5.js'
        ])
        .pipe(concat('lib.js'))
        .pipe(gulp.dest('./video_portal_api-master/client/js/'))
        .pipe(notify({ message: 'Lib task complete' }));
});

// Check JS
gulp.task('jshint', function() {
    return gulp.src('./source/js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(notify({ message: 'JS Hinting complete' }));
});

// Joining scripts APP
gulp.task('scripts', function() {
    return gulp.src(
        [
            './source/js/App.js',
            './source/js/Router.js',
            
            './source/js/models/*.js',
            './source/js/collections/*.js',
            
            './source/js/views/Home.View.js',
            './source/js/views/Nav.View.js',
            './source/js/views/Videos.View.js',
            './source/js/views/Video.View.js'
        ])
        .pipe(concat('app.js'))
        .pipe(gulp.dest('./video_portal_api-master/client/js/'))
        .pipe(notify({ message: 'Scripts task complete' }));
});

// Copying test
gulp.task('test', function(){
  return gulp.src('test/*.*')
    .pipe(gulp.dest('video_portal_api-master/client/test'))
    .pipe(notify({ message: 'Tests complete' }));
});

// Joining scripts APP
gulp.task('tests_lib', function() {
    return gulp.src('./node_modules/qunitjs/qunit/qunit.js')
        .pipe(gulp.dest('./video_portal_api-master/client/test/js/'))
        .pipe(notify({ message: 'Tests Scripts task complete' }));
});

// Copying imgs
gulp.task('tests_css', function(){
  return gulp.src('./node_modules/qunitjs/qunit/qunit.css')
    .pipe(gulp.dest('video_portal_api-master/client/test/css'))
    .pipe(notify({ message: 'Tests CSS task complete' }));
});

gulp.task('watch', function() {
    
    // LiveReload
    livereload.listen();

    // Styles
    gulp.watch('./source/sass/*.scss', ['sass']);

    // Scripts
    gulp.watch('./source/js/**/*.js', ['jshint', 'scripts']);

    // 
    //gulp.watch('./source/images/**/*', ['images']);

    // Html
    gulp.watch(['./source/**'], ['html']);

    // Test unit changes
    gulp.watch(['./test/**'], ['test']);
});

gulp.task('default', [ 'html', 'imgs', 'sass', 'lib', 'scripts', 'tests_lib', 'tests_css', 'test' ]);