import assert from 'assert';
import isEqual from './isEqual';

const strictEqual = assert.strictEqual.bind(assert);

describe('isEqual', function() {

  it('should be a function', function() {
    strictEqual(typeof isEqual, 'function');
  });

  it('should be able to compare numbers', function() {
    strictEqual(isEqual(0, 0), true);
    strictEqual(isEqual(0, 1), false);
  });

  it('should be able to compare strings', function() {
    strictEqual(isEqual('hello', 'hello'), true);
    strictEqual(isEqual('John', 'Doe'), false);
  });

  it('should return true if both objects provided has the same keys and value', function() {
    const age = 12;
    const name = 'John Doe';
    const john = { age, name };
    const doe = { age, name };
    const lisa = { age, name: 'Lisa Doe' };
    strictEqual(isEqual(john, john), true);
    strictEqual(isEqual(john, doe), true);
    strictEqual(isEqual(john, lisa), false);
  });

  it('should handle nested types', function() {
    const first = {
      levelOne: {
        levelTwo: {
          value: 'Hello'
        }
      }
    };
    const second = {
      levelOne: {
        levelTwo: {
          value: 'Hello'
        }
      }
    };
    const third = {
      levelOne: {
        levelTwo: {
          value: 'third'
        }
      }
    };
    strictEqual(isEqual(first, second), true);
    strictEqual(isEqual(second, third), false);
  });

});