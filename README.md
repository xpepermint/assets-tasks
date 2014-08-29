Assets.js - Flexible NodeJS assets manager
==========================================

  var assets = require('./lib/assets');

  // creating new handler instance
  var handler = assets.Handler();

  // where to search for source files
  handler.src = 'app/assets/scripts/*';
  // where to save converted files
  handler.dest = 'public/assets';
  // if we would like to add a uniq timestamp to each file
  handler.versionize = true;
  // if we would like to also create a gzip version of files
  handler.gzip = true;
  // local assets variables
  handler.locals = {};
  // paths where asset file can search for extensions (e.g. `@import`)
  handler.paths = ['app/assets', 'bower_components', 'node_modules'];

  // attaching asset content compiler
  handler.compiler('coffee', assets.CoffeeCompiler);
  // attaching asset content minimizer
  handler.processor('js', assets.JavascriptMinifier);

  // when we would like to clean destination directory
  handler.clean();
  // building assets based on configuration above
  handler.build();
  // to automatically rebuild assets when source files change
  handler.watch();

  // return asset file destination path
  console.log( handler.path('scripts/main', 'js'));


https://github.com/sindresorhus/gulp-rev
https://www.npmjs.org/package/gulp-include
