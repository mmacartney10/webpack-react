var gulp = require('gulp');
var gutil = require('gulp-util');
var watch = require('gulp-watch');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

var webpack = require('webpack');
var stream = require('webpack-stream');
var webpackConfig = require('./webpack.config.js');
var WebpackDevServer = require('webpack-dev-server');

var path = {
	jsx: './app/components/*.jsx',
	html: './index.html',
	dest: './'
};

gulp.task('webpack', [], function() {
    return gulp.src(path.jsx)
        .pipe(sourcemaps.init())
        .pipe(stream(webpackConfig))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.dest));
});

gulp.task("webpack:dev", function(callback) {
    var myConfig = Object.create(webpackConfig);
    myConfig.devtool = "eval";
    myConfig.debug = true;

    // Start a webpack-dev-server
    new WebpackDevServer(webpack(myConfig), {
        publicPath: "/" + myConfig.output.publicPath,
        stats: {
            colors: true
        }
    }).listen(8080, "localhost", function(err) {
        if (err) throw new gutil.PluginError("webpack-dev-server", err);
        gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
    });
});


gulp.task('watch', function() {
    gulp.watch(path.jsx, ['webpack']);
});

gulp.task('default', ['webpack:dev', 'watch']);
