'use strict';

process.env.NODE_ENV = 'development';

var env = process.env.NODE_ENV;

// Assets && Livereload

if (env == development) {
  var assets = require('..');
  assets.precompile();
  assets.watch();
}
// assets.precompileScripts();
// assets.precompileStyles();
// assets.precompileViews();
// assets.precompileImages();
// assets.precompileFonts();



var serve = require('koa-static');
var koa = require('koa');
var app = koa();
app.use(serve('public'));

app.use(function*(next){
  this.body = (new Date()).getTime(); //yield assets.render('index.jade', { name: 'John Smith' });
});
app.listen(3000, function() {

  assets.precompile();
  // assets.watch(function() { console.log('livereload') });

});














// var serve = require('koa-static');
// var koa = require('koa');
// var app = koa();
// app.use(function*(next){
//   this.set('Content-Encoding', 'gzip');
//   this.res.removeHeader('Content-Length');
//   yield next;
// });
// app.use(serve('public'));
// app.listen(3000);
