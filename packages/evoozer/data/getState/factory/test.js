import assert from 'assert';
import getStateFactory from './getStateFactory';

const { strictEqual } = assert;


describe('getStateFactory', function() {

  it('should be a function', function() {
    strictEqual(typeof getStateFactory, 'function');
  });

  it('should return a function', function() {
    const getState = getStateFactory();
    strictEqual(typeof getState, 'function');
  });

  describe('getState', function() {

    it('should return complete state object', function() {
      const getState = getStateFactory();
      const state = {};
      strictEqual(getState(state), state);
    });

  });

});
