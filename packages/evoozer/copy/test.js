import assert from 'assert';
import copy from './copy';


const strictEqual = assert.strictEqual.bind(assert);
const notStrictEqual = assert.notStrictEqual.bind(assert);


describe('copy', function() {

  it('should be able to copy undefined types', function() {
    let undef;
    strictEqual(copy(undef), undef);
  });

  it('should be able to copy null types', function() {
    strictEqual(copy(null), null);
  });

  it('should be able to copy boolean types', function() {
    strictEqual(copy(true), true);
    strictEqual(copy(false), false);
  });

  it('should be able to copy number types', function() {
    strictEqual(copy(-1), -1);
    strictEqual(copy(0), 0);
    strictEqual(copy(1), 1);
  });

  it('should be able to copy string types', function() {
    strictEqual(copy("Hello"), "Hello");
  });

  it('should be able to copy function types', function() {
    const fn = () => 123;
    strictEqual(copy(fn), fn);
  });

  it('should be able to copy basic object types', function() {
    const obj = { a: 'a', b: 'b' };
    const clone = copy(obj);

    notStrictEqual(obj, clone);
    strictEqual(JSON.stringify(clone), JSON.stringify(obj));
  });

  it('should use objects .clone() method if found', function() {
    const val = { text: 'hello' };
    const obj = {
      clone: function() {
        strictEqual(this, obj, 'this within the copy-method must be same as the object');
        return val;
      }
    };

    strictEqual(copy(obj), val);
  });

  it('should handle inherited objects without any .clone()', function() {
    function MyError() {
      Error.apply(this, arguments);
      var data = {},
          parent_error = arguments[arguments.length - 1];

      if(parent_error instanceof Error) {
        data.parent_error = parent_error;
      }
      this._MyError = data;
      return this;
    }
    MyError.prototype = Object.create(Error.prototype);
    MyError.prototype.get_parent_error = function() {
      return this._MyError.parent_error;
    };

    var parent_error = new Error('parent error'),
        obj = new MyError('Some error', parent_error),
        clone = copy(obj);

    strictEqual(clone instanceof MyError, true, 'clone should be an instanceof MyError');
    strictEqual(clone.get_parent_error() instanceof Error, true, 'clone.get_parent_error() should return an instanceof Error');
    notStrictEqual(clone, obj, 'clone should be a copy');
    notStrictEqual(clone.get_parent_error(), obj.get_parent_error(), 'clone.get_parent_error() should return an copy, not original');
  });

});