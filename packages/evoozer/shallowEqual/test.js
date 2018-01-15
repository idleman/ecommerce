import assert from 'assert';
import shallowEqual from './shallowEqual';

const strictEqual = assert.strictEqual.bind(assert);

describe('shallowEqual', function() {

  it('should be a function', function() {
    strictEqual(typeof shallowEqual, 'function');
  });

  it('should be able to compare numbers', function() {
    strictEqual(shallowEqual(0, 0), true);
    strictEqual(shallowEqual(0, 1), false);
  });

  it('should be able to compare strings', function() {
    strictEqual(shallowEqual('hello', 'hello'), true);
    strictEqual(shallowEqual('John', 'Doe'), false);
  });

  it('should return true if both objects provided has the same keys and value', function() {
    const age = 12;
    const name = 'John Doe';
    const john = { age, name };
    const doe = { age, name };
    const lisa = { age, name: 'Lisa Doe' };
    strictEqual(shallowEqual(john, john), true);
    strictEqual(shallowEqual(john, doe), true);
    strictEqual(shallowEqual(john, lisa), false);
  });

});