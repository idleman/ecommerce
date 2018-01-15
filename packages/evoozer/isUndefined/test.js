import assert from 'assert';
import isUndefined from './isUndefined';

const strictEqual = assert.strictEqual.bind(assert);

describe('isUndefined', function() {

  it('should be a function', function() {
    strictEqual(typeof isUndefined, 'function');
  });

  it('should return true provided parameter is undefined, otherwise false', function() {
    let undef;
    strictEqual(isUndefined(), true);
    strictEqual(isUndefined(undef), true);
    strictEqual(isUndefined('a'), false);
    strictEqual(isUndefined(0), false);
    strictEqual(isUndefined(null), false);
    strictEqual(isUndefined(function() { }), false);
  });

  it('should return true if all provided parameters is undefined', function() {
    let undef;
    strictEqual(isUndefined(undef, undef), true);
    strictEqual(isUndefined(undef, 'a'), false);
    strictEqual(isUndefined(undef, 0), false);
    strictEqual(isUndefined(undef, null), false);
    strictEqual(isUndefined(undef, function() { }), false);
    strictEqual(isUndefined(undef, undef, function() { }), false);
  });

});