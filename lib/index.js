'use strict';

/**
 * Module dependencies.
 */

var path = require('path');
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

/**
 * Helpers.
 */

var env = process.env.NODE_ENV;
var root = process.cwd();

/**
 * Module class.
 */

module.exports = {

  /**
   * Global configuration.
   */

  config: {
    logger: false,
    scriptsSrc: root+'/app/assets/scripts',
    stylesSrc: root+'/app/assets/styles',
    viewsSrc: root+'/app/assets/views',
    imagesSrc: root+'/app/assets/images',
    fontsSrc: root+'/app/assets/fonts',
    assetsDest: root+'/public/assets',
    assetsRoot: '/assets',
    paths: [root+'/node_modules', root+'/bower_components']
  },

  /**
   * Sends a message to a logger.
   *
   * @param {string} str
   * @api private
   */

  log: function(str) {
    if (this.config.logger) this.config.logger(str);
  },

  /**
   * Deletes precompiled assets.
   *
   * @return {stream}
   * @api public
   */

  clean: function() {
    this.log('Assets cleaned.');
    if (fs.existsSync(this.config.assetsDest)) fs.renameSync(this.config.assetsDest, this.config.assetsDest+'.deleted');
    return gulp.src(this.config.assetsDest+'.deleted', {read: false}).pipe(clean());
  },

  /**
   * Deletes files at `match`.
   *
   * @param {string} match
   * @api private
   */

  removeFiles: function(match) {
    glob.sync(match).forEach(function(file) { fs.unlinkSync(file); });
  },

  /**
   * Deletes precompiled scripts.
   *
   * @api private
   */

  cleanScripts: function() {
    this.log('Scripts cleaned.');
    this.removeFiles(this.config.assetsDest+'/**/*.js');
  },

  /**
   * Deletes precompiled styles.
   *
   * @api private
   */

  cleanStyles: function() {
    this.log('Styles cleaned.');
    this.removeFiles(this.config.assetsDest+'/**/*.css');
  },

  /**
   * Deletes precompiled views.
   *
   * @api private
   */

  cleanViews: function() {
    this.log('Views cleaned.');
    this.removeFiles(this.config.assetsDest+'/**/*.html');
  },

  /**
   * Deletes precompiled images.
   *
   * @api private
   */

  cleanImages: function() {
    this.log('Images .');
    this.removeFiles(this.config.assetsDest+'/**/*.{jpg,jpeg,png,gif}');
  },

  /**
   * Deletes precompiled fonts.
   *
   * @api private
   */

  cleanFonts: function() {
    this.log('Fonts cleaned.');
    this.removeFiles(this.config.assetsDest+'/**/*.{eot,woff,ttf,svg}');
  },

  /**
   * Compiles scripts.
   *
   * @return {stream}
   * @api private
   */

  compileScripts: function() {
    this.log('Scripts compiled.');
    return gulp.src(this.config.scriptsSrc+'/**/*.{coffee,litcoffee}')
      .pipe( include() )
      .pipe( coffee() )
      .pipe( jsmin() )
      .pipe( gulp.dest(this.config.assetsDest) );
  },

  /**
   * Compiles styles.
   *
   * @return {stream}
   * @api private
   */

  compileStyles: function() {
    this.log('Styles compiled.');
    return gulp.src(this.config.stylesSrc+'/**/*.styl')
      .pipe( include() )
      .pipe( stylus({ paths: this.config.paths, use: [nib()] }) )
      .pipe( cssmin() )
      .pipe( gulp.dest(this.config.assetsDest) );
  },

  /**
   * Compiles views.
   *
   * @return {stream}
   * @api private
   */

  compileViews: function() {
    this.log('Views compiled.');
    return gulp.src(this.config.viewsSrc+'/**/*.jade')
      .pipe( jade() )
      .pipe( htmlmin() )
      .pipe( gulp.dest(this.config.assetsDest) );
  },

  /**
   * Compiles images.
   *
   * @return {stream}
   * @api private
   */

  compileImages: function() {
    this.log('Images compiled.');
    return gulp.src(this.config.imagesSrc+'/**/*.{jpg,jpeg,png,gif}')
      .pipe( gulp.dest(this.config.assetsDest) );
  },

  /**
   * Compiles fonts.
   *
   * @return {stream}
   * @api private
   */

  compileFonts: function() {
    this.log('Fonts compiled.');
    return gulp.src(this.config.fontsSrc+'/**/*.{eot,woff,ttf,svg}')
      .pipe( gulp.dest(this.config.assetsDest) );
  },

  /**
   * Compiles all assets.
   *
   * @return {stream}
   * @api public
   */

  compile: function() {
    return es.merge(
      this.compileScripts(),
      this.compileStyles(),
      this.compileViews(),
      this.compileImages(),
      this.compileFonts() );
  },

  /**
   * Compiles, versionizes and gzips all assets.
   *
   * @return {stream}
   * @api public
   */

  precompile: function() {
    // TODO: uncommend when this https://github.com/wearefractal/vinyl-fs/issues/25 is fixed
    return this.compile()
      // .pipe( gulp.src(this.config.assetsDest+'/**/*') )
      //   .pipe( revall({ quiet: true }) )
      //   .pipe( gulp.dest(this.config.assetsDest) )
      //   .pipe( revall.manifest({ fileName: 'manifest.json' }) )
      //   .pipe( gulp.dest(this.config.assetsDest) )
      // .pipe( gulp.src(this.config.assetsDest+'/**/*') )
      //   .pipe( gzip() )
      //   .pipe( gulp.dest(this.config.assetsDest) )
  },

  /**
   * Starts watching assets for changes.
   *
   * @param {function} onChange
   * @api public
   */

  watch: function(onChange) {
    var self = this;

    this.log('Watching assets for changes ...');
    gulp.watch(this.config.scriptsSrc+'/**/*.{coffee,litcoffee}', onScriptsChange);
    gulp.watch(this.config.stylesSrc+'/**/*.styl', onStylesChange);
    gulp.watch(this.config.viewsSrc+'/**/*.jade', onViewsChange);
    gulp.watch(this.config.imagesSrc+'/**/*.{jpg,jpeg,png,gif}', onImagesChange);
    gulp.watch(this.config.fontsSrc+'/**/*.{eot,woff,ttf,svg}', onFontsChange);

    function onScriptsChange() {
      self.cleanScripts();
      self.compileScripts().on('end', onChange);
    }

    function onStylesChange() {
      self.cleanStyles();
      self.compileStyles().on('end', onChange);
    }

    function onViewsChange() {
      self.cleanViews();
      self.compileViews().on('end', onChange);
    }

    function onImagesChange() {
      self.cleanImages();
      self.compileImages().on('end', onChange);
    }

    function onFontsChange() {
      self.cleanFonts();
      self.compileFonts().on('end', onChange);
    }
  },

  /**
   * Returns asset path (from original name).
   *
   * @param {string} fpath
   * @return {string}
   * @api public
   */

  assetPath: function(fpath) {
    var mpath = this.config.assetsDest+'/manifest.json';
    // when assets are precompiled
    if (fs.existsSync(mpath)) {
      if (['development', 'test'].indexOf(env) != -1) delete require.cache[mpath]; // prevent caching
      return this.config.assetsRoot+require(mpath)[fpath];
    }
    // when compiled assets
    return this.config.assetsRoot+'/'+fpath;
  }
}
