var assets = require('..');

describe('Handler', function() {

  // CONSTRUCTOR

  describe('constructor method', function() {
    it('should always return an instance', function() {
      expect(assets.Handler()).toEqual(jasmine.any(assets.Handler));
    });
  });

  // ATTRIBUTES

  describe('attribute', function() {

    beforeEach(function() {
      this.handler = assets.Handler();
    });

    describe('`src`', function() {

      it('should be a `string` or an `array`', function() {
        this.handler.src = 'p';
        expect(this.handler.src).toEqual(jasmine.any(String));
        this.handler.src = [];
        expect(this.handler.src).toEqual(jasmine.any(Array));
        expect(function() {
          this.handler.src = {};
        }.bind(this)).toThrow(new Error('invalid content type'));
      });

      it('should remove duplicates if `array`', function() {
        this.handler.src = ['a','a'];
        expect(this.handler.src).toEqual(['a']);
      });

      it('should be `[]` by default', function() {
        expect(this.handler.src).toEqual([]);
      });

    });

    describe('`dest`', function() {

      it('should be a `string`', function() {
        expect(this.handler.dest = 'p').toEqual(jasmine.any(String));
        expect(function() {
          this.handler.dest = {};
        }.bind(this)).toThrow(new Error('invalid content type'));
      });

      it('should be `./dist` by default', function() {
        expect(this.handler.dest).toBe('./dist');
      });
    });

    describe('`versionize`', function() {

      it('should be a `boolean`', function() {
        this.handler.versionize = 'true';
        expect(this.handler.versionize).toEqual(true);
      });

      it('should be `false` by default', function() {
        expect(this.handler.versionize).toEqual(false);
      });

    });

    describe('`gzip`', function() {

      it('should be a `boolean`', function() {
        this.handler.gzip = true;
        expect(this.handler.gzip).toEqual(true);
      });

      it('should be `false` by default', function() {
        expect(this.handler.gzip).toEqual(false);
      });

    });

    describe('`locals`', function() {

      it('should be a `hash`', function() {
        expect(this.handler.locals).toEqual(jasmine.any(Object));
        expect(function() {
          this.handler.locals = [];
        }.bind(this)).toThrow(new Error('invalid content type'));
      });

      it('should be `{}` by default', function() {
        expect(this.handler.locals).toEqual({});
      });

    });

    describe('`paths`', function() {

      it('should be an `array`', function() {
        expect(this.handler.paths).toEqual(jasmine.any(Array));
        expect(function() {
          this.handler.paths = {};
        }.bind(this)).toThrow(new Error('invalid content type'));
      });

      it('should be `[]` by default', function() {
        expect(this.handler.paths).toEqual([]);
      });

    });
  });

  // INSTANCE METHODS

  describe('instance method', function() {

    beforeEach(function() {
      this.handler = assets.Handler();
    });

    describe('compiler', function() {

      it('should require a `string` as the first parameter, representing a file extension', function() {
        expect(function() {
          this.handler.compiler({}, function() {});
        }.bind(this)).toThrow(new Error('extension required'));
      });

      it('should require a `function` as the second parameter, representing a file compiler', function() {
        expect(function() {
          this.handler.compiler('coffee', {});
        }.bind(this)).toThrow(new Error('function required'));
      });

      it('should store multiple functions per file extension', function() {
        var fn1 = function() {};
        var fn2 = function() {};
        this.handler.compiler('coffee', fn1);
        this.handler.compiler('coffee', fn2);
        expect(this.handler._compilers['coffee'][0]).toBe(fn1);
        expect(this.handler._compilers['coffee'][1]).toEqual(fn2);
      });

    });

    describe('processor', function() {

      it('should require a `string` as the first parameter, representing a file extension', function() {
        expect(function() {
          this.handler.processor({}, function() {});
        }.bind(this)).toThrow(new Error('extension required'));
      });

      it('should require a `function` as the second parameter, representing a file content processor', function() {
        expect(function() {
          this.handler.processor('coffee', {});
        }.bind(this)).toThrow(new Error('function required'));
      });

      it('should store multiple functions per file extension', function() {
        var fn1 = function() {};
        var fn2 = function() {};
        this.handler.processor('coffee', fn1);
        this.handler.processor('coffee', fn2);
        expect(this.handler._processors['coffee'][0]).toBe(fn1);
        expect(this.handler._processors['coffee'][1]).toEqual(fn2);
      });

    });


  });
});
