import immutable from 'immutable';
import assert from 'assert';
import getProductCategoryFactory from './getProductCategoryFactory';

const { strictEqual } = assert;

describe('getProductCategoryFactory', function() {

  it('should be a function', function() {
    strictEqual(typeof getProductCategoryFactory, 'function');
  });

  it('should return a function', function() {
    const getProductCategoryId = getProductCategoryFactory();
    strictEqual(typeof getProductCategoryId, 'function');
  });

  describe('getProductCategory', function() {

    it('should return a empty string as default', function() {
      const getProductCategory = getProductCategoryFactory();
      const seq = getProductCategory(immutable.Map(), {});
      strictEqual(seq.isEmpty(), true);
    });

    it('should return all props.productCategoryId', function() {
      const getProductCategory = getProductCategoryFactory();
      const productCategoryId = 'category-id';
      const productCategory = immutable.Map({ name:'Name' });
      const productCategoryMap = immutable.Map({
        [productCategoryId]: productCategory
      });

      const state = immutable.Map({ productCategoryMap });
      const result = getProductCategory(state, { productCategoryId });
      strictEqual(result, productCategory);
    });

  });

});
