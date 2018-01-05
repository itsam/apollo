'use strict';

import plugins  from 'gulp-load-plugins';
import yargs    from 'yargs';
import browser  from 'browser-sync';
import gulp     from 'gulp';
import del      from 'del';
import sherpa   from 'style-sherpa';
import yaml     from 'js-yaml';
import fs       from 'fs';

var validate = require('gulp-w3c-css');

var path = require('path');
var gutil = require('gulp-util');

//uncss
var uncss = require('gulp-uncss');
gulp.task('uncss', function () {
    return gulp.src('/srv/http/epamea-site/public_html/themes/apollo/assets/css/app.css')
        .pipe(uncss({
            html: [
              'http://epamea.local/',
              'http://epamea.local/el/financials'
            ],
            ignore: [
              new RegExp('^meta\..*'),
              new RegExp('^\.is-.*')
            ]
        }))
        .pipe(gulp.dest('/home/itsam/devel/validation_results/out'));
});

//critical
var critical = require('critical').stream;

// Generate & Inline Critical-path CSS
gulp.task('critical', function () {
    return gulp.src('/home/itsam/devel/sample_pages/*.html')
        .pipe(critical({base: '/home/itsam/devel/sample_pages', inline: true, minify: true, css: ['/var/www/europraxis/public_html/themes/apollo/assets/css/app.css']}))
        .on('error', function(err) { gutil.log(gutil.colors.red(err.message)); })
        .pipe(gulp.dest('/home/itsam/devel/sample_pages/out'));
        
});



// Load all Gulp plugins into one variable
const $ = plugins();

// Check for --production flag
const PRODUCTION = !!(yargs.argv.production);

// Load settings from settings.yml
const { COMPATIBILITY, PORT, UNCSS_OPTIONS, PATHS } = loadConfig();

function loadConfig() {
  let ymlFile = fs.readFileSync('config.yml', 'utf8');
  return yaml.load(ymlFile);
}

// Build the "dist" folder by running all of the below tasks
gulp.task('build',
 gulp.series(clean, gulp.parallel(sass, javascript, images), copy ));

// Build the site, run the server, and watch for file changes
gulp.task('default',
  gulp.series('build', server, watch));

gulp.task('validate',
  gulp.series(validation));

// Delete the "dist" folder
// This happens every time a build starts
function clean() {
  return del([
    PATHS.dist + '/assets/**/*',
    '!' + PATHS.dist + '/assets/js',
    '!' + PATHS.dist + '/assets/js/custom',
    '!' + PATHS.dist + '/assets/js/custom/**/*',
    '!' + PATHS.dist + '/assets/images',
    '!' + PATHS.dist + '/assets/images/**/*',

  ], {'force':true});
}




//var srcPath = path.join(__dirname, './css/*.css');
function validation() {
return gulp.src('/srv/http/epamea-site/public_html/themes/apollo/assets/css/app.css')
  .pipe(validate())
  .pipe(gulp.dest('/home/itsam/devel/validation_results'));

}





// Copy files out of the assets folder
// This task skips over the "img", "js", and "scss" folders, which are parsed separately
function copy() {
  return gulp.src(PATHS.assets)
    .pipe(gulp.dest(PATHS.dist + '/assets'));
}

// Compile Sass into CSS
// In production, the CSS is compressed
function sass() {
  return gulp.src('src/assets/scss/app.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      includePaths: PATHS.sass
    })
      .on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: COMPATIBILITY
    }))
    // Comment in the pipe below to run UnCSS in production
    //.pipe($.if(PRODUCTION, $.uncss(UNCSS_OPTIONS)))
    .pipe($.if(PRODUCTION, $.cssnano()))
    .pipe($.if(!PRODUCTION, $.sourcemaps.write()))
    .pipe(gulp.dest(PATHS.dist + '/assets/css'))
    .pipe(browser.reload({ stream: true }));
}
 
// Combine JavaScript into one file
// In production, the file is minified
function javascript() {
  return gulp.src(PATHS.javascript)
    .pipe($.sourcemaps.init())
    .pipe($.babel({ignore: ['what-input.js']}))
    .pipe($.concat('app.js'))
    .pipe($.if(PRODUCTION, $.uglify()
      .on('error', e => { console.log(e); })
    ))
    .pipe($.if(!PRODUCTION, $.sourcemaps.write()))
    .pipe(gulp.dest(PATHS.dist + '/assets/js'));
}

// Copy images to the "dist" folder
// In production, the images are compressed
function images() {
  return gulp.src('src/assets/img/**/*')
    .pipe($.if(PRODUCTION, $.imagemin({
      progressive: true
    })))
    .pipe(gulp.dest(PATHS.dist + '/assets/img'));
}

// Start a server with BrowserSync to preview the site in
function server(done) {
  browser.init({
    //server: PATHS.dist, port: PORT
    proxy: 'http://epamea.local'
  });
  done();
}

// Reload the browser with BrowserSync
function reload(done) {
  browser.reload();
  done();
}

// Watch for changes to static assets, pages, Sass, and JavaScript
function watch(done) {
  gulp.watch(PATHS.assets, copy);
  gulp.watch(PATHS.site, reload);
  gulp.watch('src/assets/scss/**/*.scss').on('all', sass);
  gulp.watch('src/assets/js/**/*.js').on('all', gulp.series(javascript, browser.reload));
  gulp.watch('src/assets/img/**/*').on('all', gulp.series(images, browser.reload));
  done();
}