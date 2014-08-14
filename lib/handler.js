'use strict';

var _ = require('underscore');

function Handler() {
  if (!(this instanceof Handler)) return new Handler;
}

Handler.prototype = {

  set src(s) {
    if (Array.isArray(s)) {
      this._src = _.uniq(s);
    } else if (typeof s == 'string') {
      this._src = s;
    } else {
      throw new Error("invalid content type");
    }
  },

  get src() {
    return this._src || [];
  },

  set dest(s) {
    if (typeof s == 'string') {
      this._src = s;
    } else {
      throw new Error("invalid content type");
    }
  },

  get dest() {
    return this._src || './dist';
  },

  set versionize(s) {
    this._versionize = Boolean(s);
  },

  get versionize() {
    return this._versionize || false;
  },

  set gzip(s) {
    this._gzip = Boolean(s);
  },

  get gzip() {
    return this._gzip || false;
  },

  set locals(s) {
    if (typeof s  == "object" && !Array.isArray(s)) {
      this._locals = s;
    } else {
      throw new Error("invalid content type");
    }
  },

  get locals() {
    return this._locals || {};
  },

  set paths(s) {
    if (Array.isArray(s)) {
      this._paths = _.uniq(paths);
    } else {
      throw new Error("invalid content type");
    }
  },

  get paths() {
    return this._paths || [];
  },

  compiler: function(ext, fn) {
    if (typeof ext != 'string') throw new Error('extension required');
    if (typeof fn != 'function') throw new Error('function required');

    this._compilers = Object(this._compilers);
    this._compilers[ext] = Array.isArray(this._compilers[ext]) ? this._compilers[ext] : [];
    this._compilers[ext].push(fn);
  },

  processor: function(ext, fn) {
    if (typeof ext != 'string') throw new Error('extension required');
    if (typeof fn != 'function') throw new Error('function required');

    this._processors = Object(this._processors);
    this._processors[ext] = Array.isArray(this._processors[ext]) ? this._processors[ext] : [];
    this._processors[ext].push(fn);
  },

  build: function() {

  }

};

module.exports = Handler;
