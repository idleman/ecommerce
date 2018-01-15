import assert from 'assert';
import getProductItemIdsByCategoryIdFactory from './getProductItemIdsByCategoryIdFactory';
import immutable from 'immutable';

const { strictEqual } = assert;

describe('getProductItemIdsByCategoryIdFactory', function() {

  it('should be a function', function() {
    strictEqual(typeof getProductItemIdsByCategoryIdFactory, 'function');
  });

  it('should return a function', function() {
    const getProductItemIdsByCategoryId = getProductItemIdsByCategoryIdFactory();
    strictEqual(typeof getProductItemIdsByCategoryId, 'function');
  });

  describe('getProductItemIdsByCategoryId', function() {

    it('should return a empty list as default', function() {
      const getProductItemIdsByCategoryId = getProductItemIdsByCategoryIdFactory();
      const seq = getProductItemIdsByCategoryId(immutable.Map(), {});
      strictEqual(seq.isEmpty(), true);
    });

    it('should return all productItemIds that match the category', function() {
      const getProductItemIdsByCategoryId = getProductItemIdsByCategoryIdFactory();
      const productCategoryMap = immutable.fromJS({
        "eye-complaint": { name:'Eye complaint', parent: 'allergy' },
        'allergy': { name: 'Allergy' }
      });

      const productItemMap = immutable.fromJS({
        'product-1': { category: 'unknown' },
        'product-2': { category: 'allergy' },
        'product-3': { category: 'eye-complaint' }
      });

      const state = immutable.Map({ productCategoryMap, productItemMap });
      const productCategoryId = 'allergy';
      const result = getProductItemIdsByCategoryId(state, { productCategoryId});
      const expected = immutable.Set(['product-2', 'product-3']);
      strictEqual(immutable.is(expected, result), true);
    });

  });

});
