var gulp = require('gulp'),
	  sass = require('gulp-sass'),
	  autoprefixer = require('gulp-autoprefixer'),
	  jshint = require('gulp-jshint'),
	  uglify = require('gulp-uglify'),
	  imagemin = require('gulp-imagemin'),
	  rename = require('gulp-rename'),
	  concat = require('gulp-concat'),
	  notify = require('gulp-notify'),
	  cache = require('gulp-cache'),
	  livereload = require('gulp-livereload'),
	  connect = require('gulp-connect'),
    nunjucksRender = require('gulp-nunjucks-render'),
    cleanCSS = require('gulp-clean-css'),
    lr = require('tiny-lr'),
    i18n = require('gulp-html-i18n'),
	  server = lr();

const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

const folder = {
  dist:'dist',
  html:{
    src:          "src/pages/**/*.html",
    srcTemplates: "src/templates/**/*.html",
    includes:     "src/templates",
    lang:         "lang/**"
  },
  styles:{
    cssName:      "styles.css",
    cssMinName:   "styles.min.css",
    scss:         "src/assets/scss/**/*.scss",
    css:          "src/assets/css/**/*.{css,map}",
    dist:         "dist/assets/css",
  },
  fonts:{
    src:          "src/assets/fonts/**/*.{ttf,woff,eof,svg,otf}",
    dist:         "dist/assets/fonts"
  },
  images:{
    src:          "src/assets/img/**/*.{svg,gif,jpg,png}",
    dist:         "dist/assets/img"
  },
  scripts:{
    scriptName:   "main.js",
    scriptMinName:"main.min.js",
    src:          "src/assets/js/**/*.js",
    dist:         "dist/assets/js"
  }
};

// Server - listed on localhost:8080
gulp.task('webserver', function() {
  connect.server();
});

// HTML - Renders template with nunjucks and Generate Index Languages
gulp.task('pages', function() {
  return gulp.src(folder.html.src)
              .pipe(nunjucksRender({
                path: [folder.html.includes],
                envOptions:{
                  tags:{
                    variableStart: '@{{',
                    variableEnd: '}}',
                  }
                }
              }))
              .pipe(gulp.dest(folder.dist))
              .pipe(i18n({
                langDir: './lang',
                defaultLang: 'en-US',
                createLangDirs: true
              }))
              .pipe(browserSync.stream());
});

// HTML - Apply Internationalization
gulp.task('i18n', function() {
  return gulp.src(folder.dist + "/index.html")
             .pipe(i18n({
                langDir: './lang',
                createLangDirs: true
             }))
             .pipe(gulp.dest(folder.dist))
             .pipe(browserSync.stream());
});

// CSS - Generate CSS concating all SCSS, and minify
gulp.task('styles', function() {
  return gulp.src(folder.styles.scss)
             .pipe(sass({ style: 'expanded' }))
             .pipe(concat(folder.styles.cssName))
             .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
             .pipe(gulp.dest(folder.styles.dist))
             .pipe(rename(folder.styles.cssMinName))
             .pipe(cleanCSS())
             .pipe(gulp.dest(folder.styles.dist))
             .pipe(browserSync.stream());
});

// JS - Get Scripts
gulp.task('scripts', function() {
	return gulp.src(folder.scripts.src)
            .pipe(gulp.dest(folder.scripts.dist))
            .pipe(browserSync.stream());
});

// JS - Minify Scripts
gulp.task('scripts-minify', function() {
	return gulp.src(folder.scripts.dist + "/" + folder.scripts.scriptName)
             .pipe(rename(folder.scripts.scriptMinName))
             .pipe(uglify())
             .pipe(gulp.dest(folder.scripts.dist))
             .pipe(browserSync.stream());
});

// Images - Copy and Minify Images
gulp.task('images', function() {
  return gulp.src(folder.images.src)
             .pipe(cache(imagemin({ 
                          optimizationLevel: 3, 
                          progressive: true, 
                          interlaced: true })))
             .pipe(gulp.dest(folder.images.dist))
             .pipe(browserSync.stream());
});

// Copy files
gulp.task('copy',function(){

  // copy styles
  gulp.src(folder.styles.css)
      .pipe(gulp.dest(folder.styles.dist))

  // copy images
  gulp.src(folder.images.src)
      .pipe(gulp.dest(folder.images.dist))

  // copy fonts
  return gulp.src(folder.fonts.src)
             .pipe(gulp.dest(folder.fonts.dist))
             .pipe(browserSync.stream());
});

gulp.task('serve', [
          'webserver',
          'styles', 
          'scripts', 
          'scripts-minify', 
          'pages', 
          /*'i18n',
          'images',  */
          'copy'], function() {

  gulp.watch(folder.styles.scss, ['styles']);
  
  // Watch .html files
  gulp.watch([folder.html.src], ['pages']);
  gulp.watch([folder.html.srcTemplates], ['pages']);
  /*gulp.watch([folder.html.srcTemplates], ['i18n']);
  gulp.watch([folder.html.lang], ['i18n']);*/

  // Watch .js files
  gulp.watch(folder.scripts.src, ['scripts']);
  gulp.watch(folder.scripts.src, ['scripts-minify'])

  // Watch image files
  gulp.watch(folder.images.src, ['images']);

  // Watch css, fonts and images files
  gulp.watch([
          folder.styles.css, 
          folder.fonts.src, 
          folder.images.src ], ['copy']);

  // Create LiveReload server
  var server = livereload();

  // Watch any files in dist/, reload on change
  gulp.watch([
          folder.styles.dist + '/**',
          folder.scripts.dist + '/**',
          folder.images.dist + '/**', '**.html'])
      .on('change', function(file) {
	                    server.changed(file.path);
  });

  browserSync.init({
      server: {
          baseDir: "./" + folder.dist,
          directory: true
      },
      ghostMode: false
  });
});