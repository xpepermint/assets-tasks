'use strict';

var gulp = require('gulp');
var include = require('gulp-include');
var es = require('event-stream');
var revall = require('gulp-rev-all');
var gzip = require('gulp-gzip');
var coffee = require('gulp-coffee');
var jsmin = require('gulp-uglify');
var stylus = require('gulp-stylus');
var cssmin = require('gulp-minify-css');
var jade = require('gulp-jade');
var htmlmin = require('gulp-minify-html');
var clean = require('gulp-rimraf');
var glob = require('glob');
var fs = require('fs');
var nib = require('nib');

var root = process.cwd();
var watch = process.env.NODE_ENV == 'development';
var config = {
  logger: console.log,
  scriptsSrc: root+'/app/assets/scripts',
  stylesSrc: root+'/app/assets/styles',
  viewsSrc: root+'/app/assets/views',
  imagesSrc: root+'/app/assets/images',
  fontsSrc: root+'/app/assets/fonts',
  assetsDest: root+'/public/assets',
  assetsRoot: '/assets',
  paths: [root+'/node_modules', root+'/bower_components']
};

var log = function() {
  config.logger(['common-assets'].concat(Array.prototype.slice.call(arguments)));
}

module.exports = {

  config: config,

  clean: function() {
    if (fs.existsSync(config.assetsDest)) fs.renameSync(config.assetsDest, config.assetsDest+'.deleted');
    return gulp.src(config.assetsDest+'.deleted', {read: false}).pipe(clean());
  },

  removeFiles: function(match) {
    glob.sync(match).forEach(function(file) { fs.unlinkSync(file); });
  },

  cleanScripts: function(type) {
    return this.removeFiles(config.assetsDest+'/**/*.js');
  },

  cleanStyles: function(type) {
    this.removeFiles(config.assetsDest+'/**/*.css');
  },

  cleanViews: function(type) {
    this.removeFiles(config.assetsDest+'/**/*.html');
  },

  cleanImages: function(type) {
    this.removeFiles(config.assetsDest+'/**/*.{jpg,jpeg,png,gif}');
  },

  cleanFonts: function(type) {
    this.removeFiles(config.assetsDest+'/**/*.{eot,woff,ttf,svg}');
  },

  precompileScripts: function() {
    return gulp.src(config.scriptsSrc+'/**/*.{coffee,litcoffee}')
      .pipe( include() )
      .pipe( coffee() )
      .pipe( jsmin() )
      .pipe( revall({ quiet: true }) )
      .pipe( gulp.dest(config.assetsDest) )
      // manifest
      .pipe( revall.manifest({ fileName: 'manifest.scripts.json' }) )
      .pipe( gulp.dest(config.assetsDest) )
      // gzip
      .pipe( gzip() )
      .pipe( gulp.dest(config.assetsDest) );
  },

  precompileStyles: function() {
    return gulp.src(config.stylesSrc+'/**/*.styl')
      .pipe( include() )
      .pipe( stylus({ paths: config.paths, use: [nib()] }) )
      .pipe( cssmin() )
      .pipe( revall({ quiet: true }) )
      .pipe( gulp.dest(config.assetsDest) )
      // manifest
      .pipe( revall.manifest({ fileName: 'manifest.styles.json' }) )
      .pipe( gulp.dest(config.assetsDest) )
      // gzip
      .pipe( gzip() )
      .pipe( gulp.dest(config.assetsDest) );
  },

  precompileViews: function() {
    return gulp.src(config.viewsSrc+'/**/*.jade')
      .pipe( jade() )
      .pipe( htmlmin() )
      .pipe( revall({ quiet: true }) )
      .pipe( gulp.dest(config.assetsDest) )
      // manifest
      .pipe( revall.manifest({ fileName: 'manifest.views.json' }) )
      .pipe( gulp.dest(config.assetsDest) )
      // gzip
      .pipe( gzip() )
      .pipe( gulp.dest(config.assetsDest) );
  },

  precompileImages: function() {
    return gulp.src(config.imagesSrc+'/**/*.{jpg,jpeg,png,gif}')
      .pipe( revall({ quiet: true }) )
      .pipe( gulp.dest(config.assetsDest) )
      // manifest
      .pipe( revall.manifest({ fileName: 'manifest.images.json' }) )
      .pipe( gulp.dest(config.assetsDest) )
      // gzip
      .pipe( gzip() )
      .pipe( gulp.dest(config.assetsDest) );
  },

  precompileFonts: function() {
    return gulp.src(config.fontsSrc+'/**/*.{eot,woff,ttf,svg}')
      .pipe( revall({ quiet: true }) )
      .pipe( gulp.dest(config.assetsDest) )
      // manifest
      .pipe( revall.manifest({ fileName: 'manifest.fonts.json' }) )
      .pipe( gulp.dest(config.assetsDest) )
      // gzip
      .pipe( gzip() )
      .pipe( gulp.dest(config.assetsDest) );
  },

  precompile: function() {
    return es.merge(
      this.precompileScripts(),
      this.precompileStyles(),
      this.precompileViews(),
      this.precompileImages(),
      this.precompileFonts() );
  },

  watch: function(onChange) {
    var self = this;

    gulp.watch(config.scriptsSrc+'/**/*.{coffee,litcoffee}', onScriptsChange);
    gulp.watch(config.stylesSrc+'/**/*.styl', onStylesChange);
    gulp.watch(config.viewsSrc+'/**/*.jade', onViewsChange);
    gulp.watch(config.imagesSrc+'/**/*.{jpg,jpeg,png,gif}', onImagesChange);
    gulp.watch(config.fontsSrc+'/**/*.{eot,woff,ttf,svg}', onFontsChange);

    function onScriptsChange() {
      log('Recompiling scripts ...');
      self.cleanScripts();
      self.precompileScripts().on('end', onChange);
    }

    function onStylesChange() {
      log('Recompiling styles ...');
      self.cleanStyles();
      self.precompileStyles().on('end', onChange);
    }

    function onViewsChange() {
      log('Recompiling views ...');
      self.cleanViews();
      self.precompileViews().on('end', onChange);
    }

    function onImagesChange() {
      log('Recompiling images ...');
      self.cleanImages();
      self.precompileImages().on('end', onChange);
    }

    function onFontsChange() {
      log('Recompiling fonts ...');
      self.cleanFonts();
      self.precompileFonts().on('end', onChange);
    }
  },

  assetPath: function(type, fpath) {
    var manifest = require(config.assetsDest+'/manifest.'+type+'.json');
    return config.assetsRoot+manifest['/'+fpath];
  }
}
