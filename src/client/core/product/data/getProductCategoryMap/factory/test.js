import assert from 'assert';
import getProductCategoryMapFactory from './getProductCategoryMapFactory';
import immutable from 'immutable';

const { strictEqual } = assert;

describe('getProductCategoryMapFactory', function() {

  it('should be a function', function() {
    strictEqual(typeof getProductCategoryMapFactory, 'function');
  });

  it('should return a function', function() {
    const getProductCategoryMap = getProductCategoryMapFactory();
    strictEqual(typeof getProductCategoryMap, 'function');
  });

  describe('getProductCategoryMap', function() {

    it('should return a empty Map as default', function() {
      const getProductCategoryMap = getProductCategoryMapFactory();
      const seq = getProductCategoryMap(immutable.Map(), {});
      strictEqual(seq.isEmpty(), true);
    });

    it('should return all productCategoryMap keys', function() {
      const getProductCategoryMap = getProductCategoryMapFactory();
      const productCategoryMap = immutable.Map({
        first: immutable.Map(),
        second: immutable.Map(),
        third: immutable.Map()
      });

      const state = immutable.Map({ productCategoryMap });

      const result = getProductCategoryMap(state, {});
      strictEqual(result.count(), 3);
      strictEqual(result.has('first'), true);
      strictEqual(result.has('second'), true);
      strictEqual(result.has('third'), true);
    });

  });

});
