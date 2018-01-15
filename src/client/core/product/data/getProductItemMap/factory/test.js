import assert from 'assert';
import getProductItemMapFactory from './getProductItemMapFactory';
import immutable from 'immutable';

const { strictEqual } = assert;

describe('getProductItemMapFactory', function() {

  it('should be a function', function() {
    strictEqual(typeof getProductItemMapFactory, 'function');
  });

  it('should return a function', function() {
    const getProductItemMap = getProductItemMapFactory();
    strictEqual(typeof getProductItemMap, 'function');
  });

  describe('getProductItemMap', function() {

    it('should return a empty Map as default', function() {
      const getProductItemMap = getProductItemMapFactory();
      const seq = getProductItemMap(immutable.Map(), {});
      strictEqual(seq.isEmpty(), true);
    });

    it('should return state.productItemMap', function() {
      const getProductItemMap = getProductItemMapFactory();
      const productItemMap = immutable.Map({
        first: immutable.Map(),
        second: immutable.Map(),
        third: immutable.Map()
      });

      const state = immutable.Map({ productItemMap });

      const result = getProductItemMap(state, {});
      strictEqual(immutable.is(result, productItemMap), true);
    });

  });

});
